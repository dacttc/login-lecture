"use strict";

function getValues(body) {
  if (Array.isArray(body.query_input)) return body.query_input;
  if (body.query_input === undefined || body.query_input === null) return [];
  return [body.query_input];
}

function validateLegacyQuery(query, allowWrites) {
  const text = typeof query === "string" ? query.trim() : "";
  if (!text || text.length > 5000) {
    return { ok: false, message: "Invalid query" };
  }

  const singleStatement = text.replace(/;\s*$/, "");
  if (singleStatement.includes(";") || /--|\/\*|\*\/|#|\0/.test(singleStatement)) {
    return { ok: false, message: "Unsafe query rejected" };
  }

  const command = singleStatement.split(/\s+/, 1)[0].toLowerCase();
  if (!allowWrites && command !== "select") {
    return { ok: false, message: "Only read queries are allowed" };
  }
  if (!["select", "insert", "update", "delete"].includes(command)) {
    return { ok: false, message: "Unsupported query" };
  }

  return { ok: true, query: singleStatement };
}

function runLegacyClientQuery(db, req, res, options = {}) {
  if (process.env.ALLOW_LEGACY_CLIENT_SQL !== "true") {
    return res.status(403).json({
      message: "Legacy client SQL is disabled",
    });
  }

  const validation = validateLegacyQuery(req.body.query, options.allowWrites === true);
  if (!validation.ok) {
    return res.status(400).json({ message: validation.message });
  }

  return db.query(validation.query, getValues(req.body), (err, results) => {
    if (err) {
      console.error("Database query error:", err.stack);
      return res.json({ message: "Database error" });
    }

    return res.json({
      message: "Success",
      data: results,
    });
  });
}

module.exports = {
  runLegacyClientQuery,
};

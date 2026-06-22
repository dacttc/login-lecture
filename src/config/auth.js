"use strict";

const jwt = require("jsonwebtoken");

const DEV_JWT_SECRET = "development-only-change-this-secret";

function getJwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET environment variable is required in production.");
  }
  return DEV_JWT_SECRET;
}

function signAuthToken(payload, options, callback) {
  return jwt.sign(payload, getJwtSecret(), options, callback);
}

function verifyAuthToken(token, callback) {
  if (callback) return jwt.verify(token, getJwtSecret(), callback);
  return jwt.verify(token, getJwtSecret());
}

function getAuthCookieOptions(maxAge = 1800000) {
  return {
    maxAge,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };
}

module.exports = {
  getAuthCookieOptions,
  signAuthToken,
  verifyAuthToken,
};

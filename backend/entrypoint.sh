#!/bin/sh
# Creates (or updates) your admin login from Railway variables, then starts PocketBase.
if [ -n "$PB_ADMIN_EMAIL" ] && [ -n "$PB_ADMIN_PASSWORD" ]; then
  /pb/pocketbase superuser upsert "$PB_ADMIN_EMAIL" "$PB_ADMIN_PASSWORD"
fi
# PB_ORIGINS limits which websites may call the API, e.g. https://noble.vercel.app (default: any)
exec /pb/pocketbase serve --http="0.0.0.0:${PORT:-8080}" --origins="${PB_ORIGINS:-*}"

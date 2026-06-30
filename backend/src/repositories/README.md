# repositories

DB access code belongs in this package when real tables are introduced.

Keep the initial template empty aside from this note and `__init__.py`. Add concrete repository
modules only when a feature needs persistent data, and keep SQLAlchemy session usage out of
`src/api`.

CREATE TYPE user_role AS ENUM ('employee', 'administrator');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    login VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE benefits (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cost_points INTEGER NOT NULL CHECK (cost_points > 0),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE benefit_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    benefit_id INTEGER NOT NULL REFERENCES benefits(id),
    status request_status NOT NULL DEFAULT 'pending',
    request_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    decision_date TIMESTAMP
);
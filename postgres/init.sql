-- create role table
CREATE TABLE IF NOT EXISTS role (
  id            INT GENERATED ALWAYS AS IDENTITY,
  name          VARCHAR(30) NOT NULL,
  is_deleted    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ	NOT NULL, 
    PRIMARY KEY(id)
);

-- insert initial default roles
INSERT INTO role 
(name, updated_at) 
VALUES 
('admin', now()),
('general', now())
;

-- create user table
CREATE TABLE IF NOT EXISTS app_user (
  id            INT GENERATED ALWAYS AS IDENTITY,
  full_name     VARCHAR(30) NOT NULL,
  email         VARCHAR(50) NOT NULL,
  password      VARCHAR(50) NOT NULL,
  phone         VARCHAR(20) NOT NULL,
  role          INT NOT NULL,
  is_deleted    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ	NOT NULL, 
    PRIMARY KEY(id),
    FOREIGN KEY(role)
      REFERENCES role(id)
        -- ON UPDATE CASCADE
        -- ON DELETE CASCADE
);

-- insert initial default roles
INSERT INTO app_user 
(full_name, email, password, phone, role, updated_at) 
VALUES 
('Michael Gibbs', 'mike@email.com', 'pass', '123456', 1, now()),
('Lauren Fletcher', 'lauren@email.com', 'pass', '7891011', 2, now())
;
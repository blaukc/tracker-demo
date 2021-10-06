CREATE DATABASE tracker;

CREATE TABLE study(
    study_id SERIAL PRIMARY KEY,
    type VARCHAR(255),
    description VARCHAR(255),
    date DATE,
    duration INT
);

CREATE TABLE code(
    code_id SERIAL PRIMARY KEY,
    type VARCHAR(255),
    description VARCHAR(255),
    date DATE,
    duration INT
);

CREATE TABLE exercise(
    exercise_id SERIAL PRIMARY KEY,
    type VARCHAR(255),
    date DATE,
    reps DECIMAL(10,2),
    duration INT
);

CREATE TABLE exercisetype(
    exerciseType_id SERIAL PRIMARY KEY,
    type VARCHAR(255),
    multiplier DECIMAL(10,2)
);

CREATE TABLE studytype(
    studyType_id SERIAL PRIMARY KEY,
    type VARCHAR(255)
);

CREATE TABLE codetype(
    codeType_id SERIAL PRIMARY KEY,
    type VARCHAR(255)
);

CREATE TABLE auth(
    id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    admin BOOLEAN DEFAULT FALSE
);

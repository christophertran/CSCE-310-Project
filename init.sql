CREATE TABLE session (
	sid varchar NOT NULL COLLATE default,
	sess json NOT NULL,
	expire timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE TABLE users (
	id bigserial PRIMARY KEY,
	username varchar(255) UNIQUE,
	password varchar(100),
	type varchar(50),
	email varchar(255) ,
    language varchar(255) ,
    country varchar(255) ,
    favorite_genre varchar(255) ,
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT user_unique UNIQUE (username,email)
);

CREATE TABLE authors(
	id bigserial PRIMARY KEY,
	first_name varchar(100) ,
	last_name varchar(100),
	birth_date DATE NOT NULL DEFAULT CURRENT_DATE,
	website varchar(255),
	bio varchar(4000),
	death_date DATE DEFAULT NULL,
	photoURL varchar(255),
	socialmedia varchar(255),
	CONSTRAINT authors_pkey PRIMARY KEY (id)
);

CREATE TABLE book_club(
    id bigserial PRIMARY KEY,
    name varchar(255) NOT NULL,
    description varchar(1000) NOT NULL,
    CONSTRAINT Book_Club_pkey PRIMARY KEY (id)
);

CREATE TABLE book_club_member(
    id bigserial PRIMARY KEY,
    user_id bigint NOT NULL,
    book_club_id bigint NOT NULL
	CONSTRAINT book_club_member_pkey PRIMARY KEY (id)
);

CREATE TABLE favorite(
    id bigserial PRIMARY KEY,
    user_id bigint NOT NULL,
    book_id bigint NOT NULL,
    CONSTRAINT favorite_pkey PRIMARY KEY (id)
);

CREATE TABLE reviews(
    id bigserial PRIMARY KEY,
    user_id bigint NOT NULL,
    book_id bigint NOT NULL,
    content varchar(255) NOT NULL,
    rating bigint NOT NULL,
    creating_date date NOT NULL,
    CONSTRAINT reviews_pkey PRIMARY KEY (id)
);

CREATE TABLE to_read(
    id bigserial PRIMARY KEY,
    user_id bigint NOT NULL,
    book_id bigint NOT NULL,
    CONSTRAINT to_read_pkey PRIMARY KEY (id)
);

CREATE TABLE books(
    id bigserial PRIMARY KEY,
	author_id bigint NOT NULL,
	title varchar(255) NOT NULL,
	description varchar(255) NOT NULL,
	publish_date date NOT NULL,
	ISBN bigint NOT NULL,
	edition varchar(255) NOT NULL,
	cover varchar(255) NOT NULL,
	country varchar(255) NOT NULL,
	language varchar(255) NOT NULL,
	pages int NOT NULL,
	genre varchar(255) NOT NULL
);

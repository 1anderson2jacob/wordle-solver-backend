CREATE TABLE words (
  ID SERIAL PRIMARY KEY,
  word VARCHAR(255) NOT NULL
);

COPY words(word) FROM 'engmix.txt'
-- /copy words(word) FROM 'engmix.txt'
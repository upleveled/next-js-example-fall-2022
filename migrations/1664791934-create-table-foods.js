exports.up = async (sql) => {
  await sql`
    CREATE TABLE foods (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name varchar(30) NOT NULL,
      type varchar(30) NOT NULL
    )
  `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE foods
  `;
};

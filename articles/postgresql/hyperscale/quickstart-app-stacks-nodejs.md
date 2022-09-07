---
title: Node.js app to connect and query Hyperscale (Citus)
description: Learn to query Hyperscale (Citus) using Node.js
ms.author: sasriram
author: saimicrosoft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: quickstart
recommendations: false
ms.date: 08/24/2022
---

# Node.js app to connect and query Hyperscale (Citus)

[!INCLUDE[applies-to-postgresql-hyperscale](../includes/applies-to-postgresql-hyperscale.md)]

In this article, you'll connect to a Hyperscale (Citus) server group using a Node.js application. We'll see how to use SQL statements to query, insert, update and delete data in the database. The steps in this article assume that you're familiar with developing using Node.js and are new to working with Hyperscale (Citus).

> [!TIP]
>
> The process of creating a NodeJS application with Hyperscale (Citus) is the same as working with ordinary PostgreSQL.

## Setup

### Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free)
* Create a Hyperscale (Citus) database using this link [Create Hyperscale (Citus) server group](quickstart-create-portal.md)
* [Node.js](https://nodejs.org/)

Install [pg](https://www.npmjs.com/package/pg), which is a PostgreSQL client for Node.js.
To do so, run the node package manager (npm) for JavaScript from your command line to install the pg client.

```bash
npm install pg
```

Verify the installation by listing the packages installed.

```bash
npm list
```

### Get database connection information

To get the database credentials, you can use the **Connection strings** tab in the Azure portal. See the screenshot below.

![Diagram showing NodeJS connection string.](../media/howto-app-stacks/01-python-connection-string.png)

### Running JavaScript code in Node.js

You may launch Node.js from the Bash shell, Terminal or Windows Command Prompt by typing `node`, then run the example JavaScript code interactively by copy and pasting it onto the prompt. Alternatively, you may save the JavaScript code into a text file and launch `node filename.js` with the file name as a parameter to run it.

## Connect, create table and insert data

All examples in this article need to connect to the database. Let's put the
connection logic into its own module for reuse. We'll use the
[pg.Client](https://node-postgres.com/) object to
interface with the PostgreSQL server.

[!INCLUDE[why-connection-pooling](includes/why-connection-pooling.md)]

Create a folder called `db` and inside this folder create `citus.js` file with the common connection code:

```javascript
/**
* file: db/citus.js
*/

const { Pool } = require('pg');

const pool = new Pool({
  max: 300,
  connectionTimeoutMillis: 5000,

  host: '<host>',
  port: 5432,
  user: 'citus',
  password: '<your password>',
  database: 'citus',
  ssl: true,
});

module.exports = {
  pool,
};
```

Next, use the following code to connect and load the data using CREATE TABLE
and INSERT INTO SQL statements. 

```javascript
/**
* file: create.js
*/

const { pool } = require('./db/citus');

async function queryDatabase() {
  const queryString = `
    DROP TABLE IF EXISTS pharmacy;
    CREATE TABLE pharmacy (pharmacy_id integer,pharmacy_name text,city text,state text,zip_code integer);
    INSERT INTO pharmacy (pharmacy_id,pharmacy_name,city,state,zip_code) VALUES (0,'Target','Sunnyvale','California',94001);
    INSERT INTO pharmacy (pharmacy_id,pharmacy_name,city,state,zip_code) VALUES (1,'CVS','San Francisco','California',94002);
    INSERT INTO pharmacy (pharmacy_id,pharmacy_name,city,state,zip_code) VALUES (2,'Walgreens','San Diego','California',94003);
    CREATE INDEX idx_pharmacy_id ON pharmacy(pharmacy_id);
  `;

  try {
    /* Real application code would probably request a dedicated client with
       pool.connect() and run multiple queries with the client. In this
       example, we're running only one query, so we use the pool.query()
       helper method to run it on the first available idle client.
    */

    await pool.query(queryString);
    console.log('Created the Pharmacy table and inserted rows.');
  } catch (err) {
    console.log(err.stack);
  } finally {
    pool.end();
  }
}

queryDatabase();
```

To execute the code above, run `node create.js`. This command will create a new "pharmacy" table and insert some sample data.

## Super power of Distributed Tables

Hyperscale (Citus) gives you [the super power of distributing tables](overview.md#the-superpower-of-distributed-tables) across multiple nodes for scalability. The command below enables you to distribute a table. You can learn more about `create_distributed_table` and the distribution column [here](howto-build-scalable-apps-concepts.md#distribution-column-also-known-as-shard-key).

> [!TIP]
>
> Distributing your tables is optional if you are using the Basic Tier of Hyperscale (Citus), which is a single-node server group.

Use the following code to connect to the database and distribute the table.

```javascript
/**
* file: distribute-table.js
*/

const { pool } = require('./db/citus');

async function queryDatabase() {
  const queryString = `
    SELECT create_distributed_table('pharmacy', 'pharmacy_id');
  `;

  try {
    await pool.query(queryString);
    console.log('Distributed pharmacy table.');
  } catch (err) {
    console.log(err.stack);
  } finally {
    pool.end();
  }
}

queryDatabase();
```

## Read data

Use the following code to connect and read the data using a SELECT SQL statement.

```javascript
/**
* file: read.js
*/

const { pool } = require('./db/citus');

async function queryDatabase() {
  const queryString = `
    SELECT * FROM pharmacy;
  `;

  try {
    const res = await pool.query(queryString);
    console.log(res.rows);
  } catch (err) {
    console.log(err.stack);
  } finally {
    pool.end();
  }
}

queryDatabase();
```

## Update data

Use the following code to connect and read the data using a UPDATE SQL statement.

```javascript
/**
* file: update.js
*/

const { pool } = require('./db/citus');

async function queryDatabase() {
  const queryString = `
    UPDATE pharmacy SET city = 'Long Beach'
    WHERE pharmacy_id = 1;
  `;

  try {
    const result = await pool.query(queryString);
    console.log('Update completed.');
    console.log(`Rows affected: ${result.rowCount}`);
  } catch (err) {
    console.log(err.stack);
  } finally {
    pool.end();
  }
}

queryDatabase();
```

## Delete data

Use the following code to connect and read the data using a DELETE SQL statement.

```javascript
/**
* file: delete.js
*/

const { pool } = require('./db/citus');

async function queryDatabase() {
  const queryString = `
    DELETE FROM pharmacy
    WHERE pharmacy_name = 'Target';
  `;

  try {
    const result = await pool.query(queryString);
    console.log('Delete completed.');
    console.log(`Rows affected: ${result.rowCount}`);
  } catch (err) {
    console.log(err.stack);
  } finally {
    pool.end();
  }
}

queryDatabase();
```

## COPY command for super fast ingestion

The COPY command can yield [tremendous throughput](https://www.citusdata.com/blog/2016/06/15/copy-postgresql-distributed-tables) while ingesting data into Hyperscale (Citus). The COPY command can ingest data in files, or from micro-batches of data in memory for real-time ingestion.

### COPY command to load data from a file

Before running code below, install
[pg-copy-streams](https://www.npmjs.com/package/pg-copy-streams). To do so,
run the node package manager (npm) for JavaScript from your command line.

```bash
npm install pg-copy-streams
```

The following code is an example for copying data from a CSV file to a database table.
It requires the file [pharmacies.csv](https://download.microsoft.com/download/d/8/d/d8d5673e-7cbf-4e13-b3e9-047b05fc1d46/pharmacies.csv).

```javascript
/**
* file: copycsv.js
*/

const inputFile = require('path').join(__dirname, '/pharmacies.csv');
const fileStream = require('fs').createReadStream(inputFile);
const copyFrom = require('pg-copy-streams').from;
const { pool } = require('./db/citus');

async function importCsvDatabase() {
  return new Promise((resolve, reject) => {
    const queryString = `
      COPY pharmacy FROM STDIN WITH (FORMAT CSV, HEADER true, NULL '');
    `;

    fileStream.on('error', reject);

    pool
      .connect()
      .then(client => {
        const stream = client
          .query(copyFrom(queryString))
          .on('error', reject)
          .on('end', () => {
            reject(new Error('Connection closed!'));
          })
          .on('finish', () => {
            client.release();
            resolve();
          });

        fileStream.pipe(stream);
      })
      .catch(err => {
        reject(new Error(err));
      });
  });
}

(async () => {
  console.log('Copying from CSV...');
  await importCsvDatabase();
  await pool.end();
  console.log('Inserted csv successfully');
})();
```

### COPY command to load data in-memory

Before running the code below, install
[through2](https://www.npmjs.com/package/through2) package. This package allows pipe
chaining.  Install it with node package manager (npm) for JavaScript like this:

```bash
npm install through2
```

The following code is an example for copying in-memory data to a table.

```javascript
/**
 * file: copyinmemory.js
 */

const through2 = require('through2');
const copyFrom = require('pg-copy-streams').from;
const { pool } = require('./db/citus');

async function importInMemoryDatabase() {
  return new Promise((resolve, reject) => {
    pool
      .connect()
      .then(client => {
        const stream = client
          .query(copyFrom('COPY pharmacy FROM STDIN'))
          .on('error', reject)
          .on('end', () => {
            reject(new Error('Connection closed!'));
          })
          .on('finish', () => {
            client.release();
            resolve();
          });

        const internDataset = [
          ['100', 'Target', 'Sunnyvale', 'California', '94001'],
          ['101', 'CVS', 'San Francisco', 'California', '94002'],
        ];

        let started = false;
        const internStream = through2.obj((arr, _enc, cb) => {
          const rowText = (started ? '\n' : '') + arr.join('\t');
          started = true;
          cb(null, rowText);
        });

        internStream.on('error', reject).pipe(stream);

        internDataset.forEach((record) => {
          internStream.write(record);
        });

        internStream.end();
      })
      .catch(err => {
        reject(new Error(err));
      });
  });
}
(async () => {
  await importInMemoryDatabase();
  await pool.end();
  console.log('Inserted inmemory data successfully.');
})();
```

## App retry during database request failures

[!INCLUDE[app-stack-next-steps](includes/app-stack-retry-intro.md)]

```javascript
const { Pool } = require('pg');
const { sleep } = require('sleep');

const pool = new Pool({
  host: '<host>',
  port: 5432,
  user: 'citus',
  password: '<your password>',
  database: 'citus',
  ssl: true,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 0,
  min: 10,
  max: 20,
});

(async function() {
  res = await executeRetry('select nonexistent_thing;',5);
  console.log(res);
  process.exit(res ? 0 : 1);
})();

async function executeRetry(sql,retryCount)
{
  for (let i = 0; i < retryCount; i++) {
    try {
      result = await pool.query(sql)
      return result;
    } catch (err) {
      console.log(err.message);
      sleep(60);
    }
  }

  // didn't succeed after all the tries
  return null;
}
```

## Next steps

[!INCLUDE[app-stack-next-steps](includes/app-stack-next-steps.md)]

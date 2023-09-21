---
title: Use Node.js to connect and query Azure Cosmos DB for PostgreSQL
description: See how to use Node.js to connect and run SQL statements on Azure Cosmos DB for PostgreSQL.
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022, devx-track-js
ms.topic: quickstart
recommendations: false
ms.date: 06/05/2023
---

# Use Node.js to connect and run SQL commands on Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

[!INCLUDE [App stack selector](includes/quickstart-selector.md)]

This quickstart shows you how to use Node.js code to connect to a cluster, and use SQL statements to create a table. You'll then insert, query, update, and delete data in the database.  The steps in this article assume that you're familiar with Node.js development, and are new to working with Azure Cosmos DB for PostgreSQL.

## Install PostgreSQL library

The code examples in this article require the [pg](https://node-postgres.com) library to interface with the PostgreSQL server. You'll need to install pg with your language package manager (such as npm).

## Connect, create a table, and insert data

### Create the common connection module

[!INCLUDE[why-connection-pooling](includes/why-connection-pooling.md)]

Create a folder called *db*, and inside this folder create a *citus.js* file that contains the following common connection code. In this code, replace \<cluster> with your cluster name and \<password> with your administrator password.

```javascript
/**
* file: db/citus.js
*/

const { Pool } = require('pg');

const pool = new Pool({
  max: 300,
  connectionTimeoutMillis: 5000,

  host: 'c-<cluster>.<uniqueID>.postgres.cosmos.azure.com',
  port: 5432,
  user: 'citus',
  password: '<password>',
  database: 'citus',
  ssl: true,
});

module.exports = {
  pool,
};
```

### Create a table

Use the following code to connect and load the data by using CREATE TABLE
and INSERT INTO SQL statements. The code creates a new `pharmacy` table and inserts some sample data.

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
       example, you're running only one query, so you use the pool.query()
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

## Distribute tables

Azure Cosmos DB for PostgreSQL gives you [the super power of distributing tables](introduction.md) across multiple nodes for scalability. The command below enables you to distribute a table. You can learn more about `create_distributed_table` and the distribution column [here](quickstart-build-scalable-apps-concepts.md#distribution-column-also-known-as-shard-key).

> [!NOTE]
> Distributing tables lets them grow across any worker nodes added to the cluster.

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

Use the following code to connect and read the data by using a SELECT SQL statement.

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

Use the following code to connect and update the data by using an UPDATE SQL statement.

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

Use the following code to connect and delete the data by using a DELETE SQL statement.

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

## COPY command for fast ingestion

The COPY command can yield [tremendous throughput](https://www.citusdata.com/blog/2016/06/15/copy-postgresql-distributed-tables) while ingesting data into Azure Cosmos DB for PostgreSQL. The COPY command can ingest data in files, or from micro-batches of data in memory for real-time ingestion.

### COPY command to load data from a file

The following code copies data from a CSV file to a database table. The code requires the [pg-copy-streams](https://www.npmjs.com/package/pg-copy-streams) package and the file [pharmacies.csv](https://download.microsoft.com/download/d/8/d/d8d5673e-7cbf-4e13-b3e9-047b05fc1d46/pharmacies.csv).

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

### COPY command to load in-memory data

The following code copies in-memory data to a table. The code requires the [through2](https://www.npmjs.com/package/through2) package, which allows pipe chaining.

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

## App retry for database request failures

[!INCLUDE[app-stack-next-steps](includes/app-stack-retry-intro.md)]

In this code, replace \<cluster> with your cluster name and \<password> with your administrator password.

```javascript
const { Pool } = require('pg');
const { sleep } = require('sleep');

const pool = new Pool({
  host: 'c-<cluster>.<uniqueID>.postgres.cosmos.azure.com',
  port: 5432,
  user: 'citus',
  password: '<password>',
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

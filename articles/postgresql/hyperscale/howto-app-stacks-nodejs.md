---
title: Node.js app to connect and query Hyperscale (Citus)
description: Learn to query Hyperscale (Citus) using Node.js
ms.author: sasriram
author: saimicrosoft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 07/26/2022
---

# Node.js app to connect and query Hyperscale (Citus)

[!INCLUDE[applies-to-postgresql-hyperscale](../includes/applies-to-postgresql-hyperscale.md)]

In this article, you'll connect to a Hyperscale (Citus) server group using a Node.js application. We'll see how to use SQL statements to query, insert, update, and delete data in the database. The steps in this article assume that you're familiar with developing using Node.js, and are new to working with Hyperscale (Citus).

> [!TIP]
>
> The process of creating a NodeJS app with Hyperscale (Citus) is the same as working with ordinary PostgreSQL.

## Setup

### Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free)
* Create a Hyperscale (Citus) database using this link [Create Hyperscale (Citus) server group](quickstart-create-portal.md)
* [Node.js](https://nodejs.org/)

Install [pg](https://www.npmjs.com/package/pg), which is a PostgreSQL client for Node.js.
To do so, run the node package manager (npm) for JavaScript from your command line to install the pg client.

```dotnetcli
npm install pg
```

Verify the installation by listing the packages installed.

```dotnetcli
npm list
```

### Get database connection information

To get the database credentials, you can use the **Connection strings** tab in the Azure portal. See below screenshot.

![Diagram showing NodeJS connection string.](../media/howto-app-stacks/01-python-connection-string.png)

### Running JavaScript code in Node.js

You may launch Node.js from the Bash shell, Terminal, or Windows Command Prompt by typing `node`, then run the example JavaScript code interactively by copy and pasting it onto the prompt. Alternatively, you may save the JavaScript code into a text file and launch `node filename.js` with the file name as a parameter to run it.

## Connect, create table, insert data

All examples in this article need to connect to the database. Let's put the
connection logic into its own module for reuse. We'll use the
[pg.Client](https://github.com/brianc/node-postgres/wiki/Client) object to
interface with the PostgreSQL server.

[!INCLUDE[why-connection-pooling](includes/why-connection-pooling.md)]

Create a `citus.js` with the common connection code:

```javascript
// citus.js

const { Pool } = require('pg');
module.exports = new Promise((resolve, reject) => {
    const pool = new Pool({
        host: 'c.citustest.postgres.database.azure.com',
        port: 5432,
        user: 'citus',
        password: 'Password123$',
        database: 'citus',
        ssl: true,
        connectionTimeoutMillis: 0,
        idleTimeoutMillis: 0,
        min: 10,
        max: 20,
    });

    resolve({ pool });
});
```

Next, use the following code to connect and load the data using CREATE TABLE
and INSERT INTO SQL statements.

```javascript
//create.js

async function queryDatabase() {

    const q = `
        DROP TABLE IF EXISTS pharmacy;
        CREATE TABLE pharmacy (pharmacy_id integer,pharmacy_name text,city text,state text,zip_code integer);
        INSERT INTO pharmacy (pharmacy_id,pharmacy_name,city,state,zip_code) VALUES (0,'Target','Sunnyvale','California',94001);
        INSERT INTO pharmacy (pharmacy_id,pharmacy_name,city,state,zip_code) VALUES (1,'CVS','San Francisco','California',94002);
        CREATE INDEX idx_pharmacy_id ON pharmacy(pharmacy_id);
    `;
    const { pool } = await postgresql;

    const client = await pool.connect();

    var stream = client.query(q).then(() => {
        console.log('Created tables and inserted rows');
        client.end(console.log('Closed client connection'));
    })
        .catch(err => console.log(err))
        .then(() => {
            console.log('Finished execution, exiting now');
            process.exit();
        });
    await pool.end();

}
queryDatabase();
```

## Super power of Distributed Tables

Hyperscale (Citus) gives you [the super power of distributing tables](overview.md#the-superpower-of-distributed-tables) across multiple nodes for scalability. The command below enables you to distribute a table. You can learn more about `create_distributed_table` and the distribution column [here](howto-build-scalable-apps-concepts.md#distribution-column-also-known-as-shard-key).

> [!TIP]
>
> Distributing your tables is optional if you are using the Basic Tier of Hyperscale (Citus), which is a single-node server group.

Use the following code to connect to the database and distribute the table.

```javascript
const postgresql = require('./citus');

// Connect with a connection pool.
async function queryDatabase() {
    const q = `select create_distributed_table('pharmacy','pharmacy_id');`;

    const { pool } = await postgresql;
    // resolve the pool.connect() promise
    const client = await pool.connect();
    var stream = await client.query(q).then(() => {
        console.log('Distributed pharmacy table');
        client.end(console.log('Closed client connection'));
    })
        .catch(err => console.log(err))
        .then(() => {
            console.log('Finished execution, exiting now');
            process.exit();
        });
    await pool.end();
}

// Use a self-calling function so we can use async / await.
queryDatabase();
```

## Read data

Use the following code to connect and read the data using a SELECT SQL statement.

```javascript
// read.js

const postgresql = require('./citus');
// Connect with a connection pool.
async function queryDatabase() {
    const q = 'SELECT * FROM pharmacy;';
    const { pool } = await postgresql;
    // resolve the pool.connect() promise
    const client = await pool.connect();
    var stream = await client.query(q).then(res => {
        const rows = res.rows;
        rows.map(row => {
            console.log(`Read: ${JSON.stringify(row)}`);
        });
        process.exit();
    })
        .catch(err => {
            console.log(err);
            throw err;
        })
        .then(() => {
            console.log('Finished execution, exiting now');
            process.exit();
        });
    await pool.end();
}

queryDatabase();
```

## Update data

Use the following code to connect and read the data using a UPDATE SQL statement.

```javascript
//update.js

const postgresql = require('./citus');

// Connect with a connection pool.
async function queryDatabase() {
    const q = `
        UPDATE pharmacy SET city = 'guntur'
        WHERE pharmacy_id = 1 ;
    `;
    const { pool } = await postgresql;
    // resolve the pool.connect() promise
    const client = await pool.connect();
    var stream = await client.query(q).then(result => {
        console.log('Update completed');
        console.log(`Rows affected: ${result.rowCount}`);
        process.exit();
    })
        .catch(err => {
            console.log(err);
            throw err;
        });
    await pool.end();
}

queryDatabase();
```

## Delete data

Use the following code to connect and read the data using a DELETE SQL statement.

```javascript
//delete.js

const postgresql = require('./citus');

// Connect with a connection pool.
async function queryDatabase() {
    const q = `DELETE FROM pharmacy WHERE pharmacy_name = 'Target';`;
    const { pool } = await postgresql;
    // resolve the pool.connect() promise
    const client = await pool.connect();
    var stream = await client.query(q).then(result => {
        console.log('Delete completed');
        console.log(`Rows affected: ${result.rowCount}`);
    })
        .catch(err => {
            console.log(err);
            throw err;
        })
        .then(() => {
            console.log('Finished execution, exiting now');
            process.exit();
        });
    await pool.end();
}

queryDatabase();
```

## COPY command for super fast ingestion

The COPY command can yield [tremendous throughput](https://www.citusdata.com/blog/2016/06/15/copy-postgresql-distributed-tables) while ingesting data into Hyperscale (Citus). The COPY command can ingest data in files, or from micro-batches of data in memory for real-time ingestion.

### COPY command to load data from a file

Before running below code, install
[pg-copy-streams](https://www.npmjs.com/package/pg-copy-streams). To do so,
run the node package manager (npm) for JavaScript from your command line.

```dotnetcli
npm install pg-copy-streams
```

The following code is an example for copying data from a CSV file to a database table.
It requires the file [pharmacies.csv](https://download.microsoft.com/download/d/8/d/d8d5673e-7cbf-4e13-b3e9-047b05fc1d46/pharmacies.csv).

```javascript
//copycsv.js

const inputFile = require('path').join(__dirname, '/pharmacies.csv')
const copyFrom = require('pg-copy-streams').from;
const postgresql = require('./citus');

// Connect with a connection pool.
async function queryDatabase() {
    const { pool } = await postgresql;
    // resolve the pool.connect() promise
    const client = await pool.connect();

    const q = `
        COPY pharmacy FROM STDIN WITH (FORMAT CSV, HEADER true, NULL '');
    `;

    var fileStream = require('fs').createReadStream(inputFile)
    fileStream.on('error', (error) => {
        console.log(`Error in reading file: ${error}`)
        process.exit();
    });

    var stream = await client.query(copyFrom(q))
        .on('error', (error) => {
            console.log(`Error in copy command: ${error}`)
        })
        .on('end', () => {
            // TODO: this is never reached
            console.log(`Completed loading data into pharmacy`)
            client.end()
            process.exit();
        });

    console.log('Copying from CSV...');
    fileStream.pipe(stream);

    console.log("inserted csv successfully");

    await pool.end();
    process.exit();
}

queryDatabase();
```

### COPY command to load data in-memory

Before running the below code, install
[through2](https://www.npmjs.com/package/through2). This package allows pipe
chaining.  Install it with node package manager (npm) for JavaScript like this:

```dotnetcli
npm install through2
```

The following code is an example for copying in-memory data to a table.

```javascript
//copyinmemory.js
const through2 = require('through2');
const copyFrom = require('pg-copy-streams').from;
const postgresql = require('./citus');

// Connect with a connection pool.
async function queryDatabase() {
    const { pool } = await postgresql;
    // resolve the pool.connect() promise
    const client = await pool.connect();
    var stream = client.query(copyFrom(`COPY pharmacy FROM STDIN `));

    var interndataset = [
        ['0', 'Target', 'Sunnyvale', 'California', '94001'],
        ['1', 'CVS', 'San Francisco', 'California', '94002']
    ];

    var started = false;
    var internmap = through2.obj(function (arr, enc, cb) {
        var rowText = (started ? '\n' : '') + arr.join('\t');
        started = true;
        cb(null, rowText);
    });
    interndataset.forEach(function (r) { internmap.write(r); })

    internmap.end();
    internmap.pipe(stream);
    console.log("inserted inmemory data successfully ");

    await pool.end();
    process.exit();
}

queryDatabase();
```

## Next steps

Learn to [build scalable applications](howto-build-scalable-apps-overview.md)
with Hyperscale (Citus).

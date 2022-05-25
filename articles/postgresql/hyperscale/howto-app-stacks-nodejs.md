---
title: Node.js app to connect and query Hyperscale (Citus) 
description: Learn building a simple app on Hyperscale (Citus) using Node.js
ms.author: sasriram
author: saimicrosoft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 05/19/2022
---

# Node.js app to connect and query Hyperscale (Citus)

## Overview

In this document, you connect to a Hyperscale (citus) database using a Node.js application. It shows how to use SQL statements to query, insert, update, and delete data in the database. The steps in this article assume that you are familiar with developing using Node.js, and are new to working with Hyperscale(Citus). The overall experience is same as working with PostgreSQL database.


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

### Get Database Connection Information

To get the database credentials, you can use the **Connection strings** tab in the Azure portal. See below screenshot.

![Diagram showing python connection string](../media/howto-app-stacks-python/01-python-connection-string.png)

### Running the JavaScript code in Node.js

You may launch Node.js from the Bash shell, Terminal, or Windows Command Prompt by typing node, then run the example JavaScript code interactively by copy and pasting it onto the prompt. Alternatively, you may save the JavaScript code into a text file and launch node filename.js with the file name as a parameter to run it.

## Connect, create table, insert data

Use the following code to connect and load the data using CREATE TABLE and INSERT INTO SQL statements. The [pg.Client](https://github.com/brianc/node-postgres/wiki/Client) object is used to interface with the PostgreSQL server. The [pg.Client.connect()](https://github.com/brianc/node-postgres/wiki/Client#method-connect) function is used to establish the connection to the server. The [pg.Client.query()](https://github.com/brianc/node-postgres/wiki/Query) function is used to execute the SQL query against PostgreSQL database.

Replace the following values:
* \<host> with the value you got from the **Get Database Connection Information** section
* \<password> with your server password.
* Default user is *citus*
* Default database is *citus*

```javascript
const pg = require('pg');

const config = {
    host: '<host>',
    // Do not hard code your username and password.
    // Consider using Node environment variables.
    user: 'citus',     
    password: '<password>',
    database: 'citus',
    port: 5432,
    ssl: true
};

const client = new pg.Client(config);

client.connect(err => {
    if (err) throw err;
    else {
        queryDatabase();
     
    }
});

function queryDatabase() {
    const query = `
        DROP TABLE IF EXISTS pharmacy;
        CREATE TABLE pharmacy (pharmacy_id integer ,pharmacy_name text,city text,state text,zip_code integer);
        INSERT INTO pharmacy (pharmacy_id,pharmacy_name,city,state,zip_code) VALUES (0,'Target','Sunnyvale','California',94001);
        INSERT INTO pharmacy (pharmacy_id,pharmacy_name,city,state,zip_code) VALUES (1,'CVS','San Francisco','California',94002);
        CREATE INDEX idx_pharmacy_id ON pharmacy(pharmacy_id);
    `;

         client
        .query(query)
        .then(() => {
            console.log('tablesand insertion');
            client.end(console.log('Closed client connection'));
        })
        .catch(err => console.log(err))
        .then(() => {
            console.log('Finished execution, exiting now');
            process.exit();
        });

}
```

## Super power of Distributed Tables

Citus gives you [the super power of distributing your table](overview#the-superpower-of-distributed-tables) across multiple nodes for scalability. Below command enables you to do distribute a table. More on create_distributed_table and distribution column [here](howto-build-scalable-apps-concepts#distribution-column-also-known-as-shard-key).

> [!TIP]
>
> Distributing your tables is optional if you are using single node citus (basic tier).
>


Use the following code to connect and read the data using a SELECT SQL statement. 

```javascript
const pg = require('pg');

const config = {
    host: '<your-db-server-name>.postgres.database.azure.com',
    // Do not hard code your username and password.
    // Consider using Node environment variables.
    user: 'citus',     
    password: 'your-password',
    database: 'citus',
    port: 5432,
    ssl: true
};

const client = new pg.Client(config);

client.connect(err => {
    if (err) throw err;
    else {
        queryDatabase();
     
    }
});

function queryDatabase() {
    const query = `
        select create_distributed_table('pharmacy','pharmacy_id');
    `;

    client
    .query(query)
    .then(() => {
        console.log('Distributed table created');
        client.end(console.log('Closed client connection'));
    })
    .catch(err => console.log(err))
    .then(() => {
        console.log('Finished execution, exiting now');
        process.exit();
    });

}
```

## Read data
Use the following code to connect and read the data using a SELECT SQL statement.
```javascript
const pg = require('pg');

const config = {
    host: '<your-db-server-name>.postgres.database.azure.com',
    // Do not hard code your username and password.
    // Consider using Node environment variables.
    user: 'citus',     
    password: '<your-password>',
    database: 'citus',
    port: 5432,
    ssl: true
};

const client = new pg.Client(config);

client.connect(err => {
    if (err) throw err;
    else { queryDatabase(); }
});

function queryDatabase() {
  
    console.log(`Running query to PostgreSQL server: ${config.host}`);

    const query = 'SELECT * FROM pharmacy';

    client.query(query)
        .then(res => {
            const rows = res.rows;

            rows.map(row => {
                console.log(`Read: ${JSON.stringify(row)}`);
            });

            process.exit();
        })
        .catch(err => {
            console.log(err);
        });
}
```
## Update data

Use the following code to connect and read the data using a UPDATE SQL statement. 

```javascript
const pg = require('pg');
const config = {
    host: '<your-db-server-name>.postgres.database.azure.com',
    // Do not hard code your username and password.
    // Consider using Node environment variables.
    user: 'citus',     
    password: '<your-password>',
    database: 'citus',
    port: 5432,
    ssl: true
};

const client = new pg.Client(config);

client.connect(err => {
    if (err) throw err;
    else {
        queryDatabase();
    }
});

function queryDatabase() {
    const query = `
        UPDATE pharmacy SET city = 'guntur' 
          WHERE pharmacy_id = 1 ; 
    `;

    client
        .query(query)
        .then(result => {
            console.log('Update completed');
            console.log(`Rows affected: ${result.rowCount}`);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}
```

## Delete data

Use the following code to connect and read the data using a DELETE SQL statement. 

```javascript
const pg = require('pg');
const config = {
    host: '<your-db-server-name>.postgres.database.azure.com',
    // Do not hard code your username and password.
    // Consider using Node environment variables.
    user: 'citus',     
    password: '<your-password>',
    database: 'citus',
    port: 5432,
    ssl: true
};

const client = new pg.Client(config);

client.connect(err => {
    if (err) {
        throw err;
    } else {
        queryDatabase();
    }
});

function queryDatabase() {
    const query = `
    DELETE FROM pharmacy WHERE pharmacy_name = 'Target';
    `;

    client
        .query(query)
        .then(result => {
            console.log('Delete completed');
            console.log(`Rows affected: ${result.rowCount}`);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}
```

## COPY command for super fast ingestion

COPY command can yield [tremendous throughput](https://www.citusdata.com/blog/2016/06/15/copy-postgresql-distributed-tables) while ingesting data into Hyperscale (Citus). COPY command can ingest data in files. You can also micro-batch data in memory and use COPY for real-time ingestion.

### COPY command to load data from a file

The following code is an example for copying data from csv file to table.
```javascript
// Import required modules
const pg = require('pg');
const fs = require('fs')
const path = require('path')
const { Pool, Client} = require('pg')
const copyFrom = require('pg-copy-streams').from

const config = {
    host: '<your-db-server-name>.postgres.database.azure.com',
    // Do not hard code your username and password.
    // Consider using Node environment variables.
    user: 'citus',     
    password: '<your-password>',
    database: 'citus',
    port: 5432,
    ssl: true
};
var inputFile = path.join(__dirname, '/pharmacies.csv')
const client = new pg.Client(config);
client.connect()
  
  // Execute Copy Function
var stream = client.query(copyFrom(`COPY pharmacy FROM  STDIN WITH (
    FORMAT CSV,
    HEADER true,
    NULL ''
  );`))
var fileStream = fs.createReadStream(inputFile)

fileStream.on('error', (error) =>{
    console.log(`Error in reading file: ${error}`)
})
stream.on('error', (error) => {
    console.log(`Error in copy command: ${error}`)
})
stream.on('end', () => {
    console.log(`Completed loading data into pharmacy`)
    client.end()
})
fileStream.pipe(stream);
```

### COPY command to load data in-memory

The following code is an example for copying in-memory data to a table.

```javascript
const through2 = require('through2');
var pg = require('pg');
var copyFrom = require('pg-copy-streams').from;
const { Pool, Client} = require('pg')
var Readable = require('stream').Readable;

const config = {
  user: 'citus',     
  password: '<your-password>',
  database: 'citus',
  port: 5432,
  ssl: true
};

const client = new pg.Client(config);
client.connect()
var sqlcopysyntax = 'COPY pharmacy FROM STDIN ';
var sqlcopysyntax = 'COPY pharmacy FROM STDIN ';
var stream = client.query(copyFrom(sqlcopysyntax));
   
var interndataset = [
    ['0','Target','Sunnyvale','California','94001'],
    ['1','CVS','San Francisco','California','94002'],
  ]; 
 
var started = false;
var internmap = through2.obj(function(arr, enc, cb) {
         var rowText = (started ? '\n' : '') + arr.join('\t');
          started = true;
          console.log(rowText);
          cb(null, rowText);
})

interndataset.forEach(function(r) {
          internmap.write(r);
})
      
internmap.end();

internmap.pipe(stream);
console.log("inserted successfully");
```
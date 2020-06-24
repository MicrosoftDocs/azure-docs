---
title: Use Node.js to connect to Azure Database for PostgreSQL - Single Server
description: This quickstart provides a Node.js code sample you can use to connect and query data from Azure Database for PostgreSQL  - Single Server.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.custom: [mvc, devcenter, seo-javascript-september2019, seo-javascript-october2019]
ms.devlang: nodejs
ms.topic: quickstart
ms.date: 5/6/2019
---

# Quickstart: Use Node.js to connect and query data in Azure Database for PostgreSQL - Single Server

In this quickstart, you connect to an Azure Database for PostgreSQL using a Node.js application. It shows how to use SQL statements to query, insert, update, and delete data in the database. The steps in this article assume that you are familiar with developing using Node.js, and are new to working with Azure Database for PostgreSQL.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

- Completion of [Quickstart: Create an Azure Database for PostgreSQL server in the Azure portal](quickstart-create-server-database-portal.md) or [Quickstart: Create an Azure Database for PostgreSQL using the Azure CLI](quickstart-create-server-database-azure-cli.md).

- [Node.js](https://nodejs.org)

## Install pg client
Install [pg](https://www.npmjs.com/package/pg), which is a PostgreSQL client for Node.js.

To do so, run the node package manager (npm) for JavaScript from your command line to install the pg client.
```bash
npm install pg
```

Verify the installation by listing the packages installed.
```bash
npm list
```

## Get connection information
Get the connection information needed to connect to the Azure Database for PostgreSQL. You need the fully qualified server name and login credentials.

1. In the [Azure portal](https://portal.azure.com/), search for and select the server you have created (such as **mydemoserver**).

1. From the server's **Overview** panel, make a note of the **Server name** and **Admin username**. If you forget your password, you can also reset the password from this panel.

   ![Azure Database for PostgreSQL connection string](./media/connect-nodejs/server-details-azure-database-postgresql.png)

## Running the JavaScript code in Node.js
You may launch Node.js from the Bash shell, Terminal, or Windows Command Prompt by typing `node`, then run the example JavaScript code interactively by copy and pasting it onto the prompt. Alternatively, you may save the JavaScript code into a text file and launch `node filename.js` with the file name as a parameter to run it.

## Connect, create table, and insert data
Use the following code to connect and load the data using **CREATE TABLE** and  **INSERT INTO** SQL statements.
The [pg.Client](https://github.com/brianc/node-postgres/wiki/Client) object is used to interface with the PostgreSQL server. The [pg.Client.connect()](https://github.com/brianc/node-postgres/wiki/Client#method-connect) function is used to establish the connection to the server. The [pg.Client.query()](https://github.com/brianc/node-postgres/wiki/Query) function is used to execute the SQL query against PostgreSQL database. 

Replace the host, dbname, user, and password parameters with the values that you specified when you created the server and database.

```javascript
const pg = require('pg');

const config = {
    host: '<your-db-server-name>.postgres.database.azure.com',
    // Do not hard code your username and password.
    // Consider using Node environment variables.
    user: '<your-db-username>',     
    password: '<your-password>',
    database: '<name-of-database>',
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
        DROP TABLE IF EXISTS inventory;
        CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);
        INSERT INTO inventory (name, quantity) VALUES ('banana', 150);
        INSERT INTO inventory (name, quantity) VALUES ('orange', 154);
        INSERT INTO inventory (name, quantity) VALUES ('apple', 100);
    `;

    client
        .query(query)
        .then(() => {
            console.log('Table created successfully!');
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
Use the following code to connect and read the data using a **SELECT** SQL statement. The [pg.Client](https://github.com/brianc/node-postgres/wiki/Client) object is used to interface with the PostgreSQL server. The [pg.Client.connect()](https://github.com/brianc/node-postgres/wiki/Client#method-connect) function is used to establish the connection to the server. The [pg.Client.query()](https://github.com/brianc/node-postgres/wiki/Query) function is used to execute the SQL query against PostgreSQL database. 

Replace the host, dbname, user, and password parameters with the values that you specified when you created the server and database. 

```javascript
const pg = require('pg');

const config = {
    host: '<your-db-server-name>.postgres.database.azure.com',
    // Do not hard code your username and password.
    // Consider using Node environment variables.
    user: '<your-db-username>',     
    password: '<your-password>',
    database: '<name-of-database>',
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

    const query = 'SELECT * FROM inventory;';

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
Use the following code to connect and read the data using a **UPDATE** SQL statement. The [pg.Client](https://github.com/brianc/node-postgres/wiki/Client) object is used to interface with the PostgreSQL server. The [pg.Client.connect()](https://github.com/brianc/node-postgres/wiki/Client#method-connect) function is used to establish the connection to the server. The [pg.Client.query()](https://github.com/brianc/node-postgres/wiki/Query) function is used to execute the SQL query against PostgreSQL database. 

Replace the host, dbname, user, and password parameters with the values that you specified when you created the server and database. 

```javascript
const pg = require('pg');

const config = {
    host: '<your-db-server-name>.postgres.database.azure.com',
    // Do not hard code your username and password.
    // Consider using Node environment variables.
    user: '<your-db-username>',     
    password: '<your-password>',
    database: '<name-of-database>',
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
        UPDATE inventory 
        SET quantity= 1000 WHERE name='banana';
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
Use the following code to connect and read the data using a **DELETE** SQL statement. The [pg.Client](https://github.com/brianc/node-postgres/wiki/Client) object is used to interface with the PostgreSQL server. The [pg.Client.connect()](https://github.com/brianc/node-postgres/wiki/Client#method-connect) function is used to establish the connection to the server. The [pg.Client.query()](https://github.com/brianc/node-postgres/wiki/Query) function is used to execute the SQL query against PostgreSQL database. 

Replace the host, dbname, user, and password parameters with the values that you specified when you created the server and database. 

```javascript
const pg = require('pg');

const config = {
    host: '<your-db-server-name>.postgres.database.azure.com',
    // Do not hard code your username and password.
    // Consider using Node environment variables.
    user: '<your-db-username>',     
    password: '<your-password>',
    database: '<name-of-database>',
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
        DELETE FROM inventory 
        WHERE name = 'apple';
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

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./howto-migrate-using-export-and-import.md)

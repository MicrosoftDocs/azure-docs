---
title: 'Connect to Azure Database for PostgreSQL from Node.js | Microsoft Docs'
description: This quickstart provides a Node.js code sample you can use to connect and query data from Azure Database for PostgreSQL.
services: postgresql
author: jasonwhowell
ms.author: jasonh
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql-database
ms.custom: mvc
ms.devlang: nodejs
ms.topic: article
ms.date: 05/31/2017
---

# Azure Database for PostgreSQL: Use Node.js to connect and query data
This quickstart demonstrates how to connect to an Azure Database for PostgreSQL using [Node.js](https://nodejs.org/) from Windows, Ubuntu Linux, and Mac platforms. It shows how to use SQL statements to query, insert, update, and delete data in the database. The steps in this article assume that you are familiar with developing using Node.js, and that you are new to working with Azure Database for PostgreSQL.

## Prerequisites
This quickstart uses the resources created in either of these guides as a starting point:
- [Create DB - Portal](quickstart-create-server-database-portal.md)
- [Create DB - CLI](quickstart-create-server-database-azure-cli.md)

You also need to:
- Install [Node.js](https://nodejs.org)
- Install [pg](https://www.npmjs.com/package/pg) package. 

## Install Node.js 
Depending on your platform, to install Node.js:

### **Mac OS**
Enter the following commands to install **brew**, an easy-to-use package manager for Mac OS X and **Node.js**.

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install node
```

### **Linux (Ubuntu)**
Enter the following commands to install **Node.js** and **npm** the package manager for Node.js.

```bash
sudo apt-get install -y nodejs npm
```

### **Windows**
Visit the [Node.js downloads page](https://nodejs.org/en/download/) and select your desired Windows installer option.

## Install pg client
Install [pg](https://www.npmjs.com/package/pg), which is a pure JavaScript non-blocking client for node.js useful to connect to and query PostgreSQL.

To do so, run the node package manager (npm) for JavaScript from your command line to install the pg client.
```bash
npm install pg
```

Verify the installation by listing the packages installed.
```bash
npm list
```
The list command output confirms the version of each component. 
```
`-- pg@6.2.3
  +-- buffer-writer@1.0.1
  +-- packet-reader@0.3.1
etc...
```

## Get connection information
Get the connection information needed to connect to the Azure Database for PostgreSQL. You need the fully qualified server name and login credentials.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, click **All resources** and search for the server you just created **mypgserver-20170401**.
3. Click the server name **mypgserver-20170401**.
4. Select the server's **Overview** page. Make a note of the **Server name** and **Server admin login name**.
 ![Azure Database for PostgreSQL - Server Admin Login](./media/connect-nodejs/1-connection-string.png)
5. If you forget your server login information, navigate to the **Overview** page to view the Server admin login name and, if necessary, reset the password.

## Running the JavaScript code in Node.js
You may launch Node.js from the bash shell or windows command prompt by typing `node`, then run the example JavaScript code interactively by copy and pasting it onto the prompt. Alternatively, you may save the JavaScript code into a text file and launch `node filename.js` with the file name as a parameter to run it.

## Connect, create table, and insert data
Use the following code to connect and load the data using **CREATE TABLE** and  **INSERT INTO** SQL statements.
The [pg.Client](https://github.com/brianc/node-postgres/wiki/Client) object is used to interface with the PostgreSQL server. The [pg.Client.connect()](https://github.com/brianc/node-postgres/wiki/Client#method-connect) function is used to establish the connection to the server. The [pg.Client.query()](https://github.com/brianc/node-postgres/wiki/Query) function is used to execute the SQL query against PostgreSQL database. 

Replace the host, dbname, user, and password parameters with the values that you specified when you created the server and database. 

```javascript
const pg = require('pg');

var config =
{
	host: 'mypgserver-20170401.postgres.database.azure.com',
	user: 'mylogin@mypgserver-20170401',
	password: '<server_admin_password>',
	database: 'mypgsqldb',
	port: 5432,
	ssl: true
};

const client = new pg.Client(config);

client.connect(function (err)
{
	if (err)
		throw err;
	else
	{
		queryDatabase();
	}
});

function queryDatabase()
{
	client.query(
		' \
			DROP TABLE IF EXISTS inventory; \
			CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER); \
			INSERT INTO inventory (name, quantity) VALUES (\'banana\', 150); \
			INSERT INTO inventory (name, quantity) VALUES (\'orange\', 154); \
			INSERT INTO inventory (name, quantity) VALUES (\'apple\', 100); \
		',
		function (err)
	{
  		console.log("Connection established");

  		if (err)
  			throw err;
  		else
  		{
			client.end(function (err)
			{
	      		if (err)
	      			throw err;

	      		// Else closing connection finished without error
  				console.log("Closed client connection");
	    	});

	  		console.log("Finished execution, exiting now");
	  		process.exit()
  		}
  	});
}
```

## Read data
Use the following code to connect and read the data using a **SELECT** SQL statement. The [pg.Client](https://github.com/brianc/node-postgres/wiki/Client) object is used to interface with the PostgreSQL server. The [pg.Client.connect()](https://github.com/brianc/node-postgres/wiki/Client#method-connect) function is used to establish the connection to the server. The [pg.Client.query()](https://github.com/brianc/node-postgres/wiki/Query) function is used to execute the SQL query against PostgreSQL database. 

Replace the host, dbname, user, and password parameters with the values that you specified when you created the server and database. 

```javascript
const pg = require('pg');

var config =
{
	host: 'mypgserver-20170401.postgres.database.azure.com',
	user: 'mylogin@mypgserver-20170401',
	password: '<server_admin_password>',
	database: 'mypgsqldb',
	port: 5432,
	ssl: true
};


const client = new pg.Client(config);

client.connect(function (err)
{
	if (err)
	    throw err;

	else
	{
		console.log("Connected to Azure Database for PostgreSQL server:" + config.host);
		queryDatabase();
	}
});

function queryDatabase()
{
	// Declare array to hold query result set
	const results = [];

	console.log("Running query to PostgreSQL server:" + config.host);

	// Perform query
	var query = client.query('SELECT * FROM inventory;');

	// Print result set
	query.on('row', function(row)
	{
		console.log("Read " + JSON.stringify(row));
	});

	// Exit program after execution
	query.on('end', function(row)
	{
		console.log("Finished execution, exiting now");
		process.exit()
	});
}
```

## Update data
Use the following code to connect and read the data using a **UPDATE** SQL statement. The [pg.Client](https://github.com/brianc/node-postgres/wiki/Client) object is used to interface with the PostgreSQL server. The [pg.Client.connect()](https://github.com/brianc/node-postgres/wiki/Client#method-connect) function is used to establish the connection to the server. The [pg.Client.query()](https://github.com/brianc/node-postgres/wiki/Query) function is used to execute the SQL query against PostgreSQL database. 

Replace the host, dbname, user, and password parameters with the values that you specified when you created the server and database. 

```javascript
const pg = require('pg');

var config =
{
	host: 'mypgserver-20170401.postgres.database.azure.com',
	user: 'mylogin@mypgserver-20170401',
	password: '<server_admin_password>',
	database: 'mypgsqldb',
	port: 5432,
	ssl: true
};

const client = new pg.Client(config);

client.connect(function (err)
{
	if (err)
		throw err;
	else
	{
		queryDatabase();
	}	
});

function queryDatabase()
{
	client.query('UPDATE inventory SET quantity= 1000 WHERE name=\'banana\';', function (err, result)
	{
		console.log("Connection established");

  		if (err)
  			throw err;
  		else
  		{
			client.end(function (err)
			{
	      		if (err)
	      			throw err;
	      		
	      		// Else closing connection finished without error
  				console.log("Closed client connection");
	    	});  			
  		}

  		console.log("Finished execution, exiting now");
  		process.exit()
  	});
}
```

## Delete data
Use the following code to connect and read the data using a **DELETE** SQL statement. The [pg.Client](https://github.com/brianc/node-postgres/wiki/Client) object is used to interface with the PostgreSQL server. The [pg.Client.connect()](https://github.com/brianc/node-postgres/wiki/Client#method-connect) function is used to establish the connection to the server. The [pg.Client.query()](https://github.com/brianc/node-postgres/wiki/Query) function is used to execute the SQL query against PostgreSQL database. 

Replace the host, dbname, user, and password parameters with the values that you specified when you created the server and database. 

```javascript
const pg = require('pg');

var config =
{
	host: 'mypgserver-20170401.postgres.database.azure.com',
	user: 'mylogin@mypgserver-20170401',
	password: '<server_admin_password>',
	database: 'mypgsqldb',
	port: 5432,
	ssl: true
};

const client = new pg.Client(config);

client.connect(function (err)
{
	if (err)
		throw err;
	else
	{
		queryDatabase();
	}	
});

function queryDatabase()
{
	client.query('DELETE FROM inventory WHERE name=\'apple\';', function (err, result)
	{
  		console.log("Connection established");
  		
  		if (err)
  			throw err;
  		else
  		{
			client.end(function (err)
			{
	      		if (err)
	      			throw err;
	      		
	      		// Else closing connection finished without error
  				console.log("Closed client connection");
	    	});

	  		console.log("Finished execution, exiting now");
	  		process.exit()	    	
  		}
  	});	
}
```

## Next Steps
- [Design your first Azure Database for PostgreSQL using the Azure portal](tutorial-design-database-using-azure-portal.md)
- [Connection libraries for Azure Database for PostgreSQL](concepts-connection-libraries.md)

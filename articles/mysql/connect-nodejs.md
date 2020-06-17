---
title: 'Connect using Node.js - Azure Database for MySQL'
description: This quickstart provides several Node.js code samples you can use to connect and query data from Azure Database for MySQL.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.custom: mvc, seo-javascript-september2019, seo-javascript-october2019
ms.devlang: nodejs
ms.topic: quickstart
ms.date: 5/26/2020
---
# Quickstart: Use Node.js to connect and query data in Azure Database for MySQL

In this quickstart, you connect to an Azure Database for MySQL by using Node.js. You then use SQL statements to query, insert, update, and delete data in the database from Mac, Ubuntu Linux, and Windows platforms. 

This topic assumes that you're familiar with developing using Node.js, but you're new to working with Azure Database for MySQL.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- An Azure Database for MySQL server. [Create an Azure Database for MySQL server using Azure portal](quickstart-create-mysql-server-database-using-azure-portal.md) or [Create an Azure Database for MySQL server using Azure CLI](quickstart-create-mysql-server-database-using-azure-cli.md).

> [!IMPORTANT] 
> Ensure the IP address you're connecting from has been added the server's firewall rules using the [Azure portal](./howto-manage-firewall-using-portal.md) or [Azure CLI](./howto-manage-firewall-using-cli.md)

## Install Node.js and the MySQL connector

Depending on your platform, follow the instructions in the appropriate section to install [Node.js](https://nodejs.org). Use npm to install the [mysql](https://www.npmjs.com/package/mysql) package and its dependencies into your project folder.

### **Windows**

1. Visit the [Node.js downloads page](https://nodejs.org/en/download/), and then select your desired Windows installer option.
2. Make a local project folder such as `nodejsmysql`. 
3. Open the command prompt, and then change directory into the project folder, such as `cd c:\nodejsmysql\`
4. Run the NPM tool to install the mysql library into the project folder.

   ```cmd
   cd c:\nodejsmysql\
   "C:\Program Files\nodejs\npm" install mysql
   "C:\Program Files\nodejs\npm" list
   ```

5. Verify the installation by checking the `npm list` output text. The version number may vary as new patches are released.

### **Linux (Ubuntu)**

1. Run the following commands to install **Node.js** and **npm** the package manager for Node.js.

   ```bash
   sudo apt-get install -y nodejs npm
   ```

2. Run the following commands to create a project folder `mysqlnodejs` and install the mysql package into that folder.

   ```bash
   mkdir nodejsmysql
   cd nodejsmysql
   npm install --save mysql
   npm list
   ```
3. Verify the installation by checking npm list output text. The version number may vary as new patches are released.

### **Mac OS**

1. Enter the following commands to install **brew**, an easy-to-use package manager for Mac OS X and **Node.js**.

   ```bash
   ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
   brew install node
   ```
2. Run the following commands to create a project folder `mysqlnodejs` and install the mysql package into that folder.

   ```bash
   mkdir nodejsmysql
   cd nodejsmysql
   npm install --save mysql
   npm list
   ```

3. Verify the installation by checking the `npm list` output text. The version number may vary as new patches are released.

## Get connection information

Get the connection information needed to connect to the Azure Database for MySQL. You need the fully qualified server name and login credentials.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, select **All resources**, and then search for the server you have created (such as **mydemoserver**).
3. Select the server name.
4. From the server's **Overview** panel, make a note of the **Server name** and **Server admin login name**. If you forget your password, you can also reset the password from this panel.
 ![Azure Database for MySQL server name](./media/connect-nodejs/server-name-azure-database-mysql.png)

## Running the JavaScript code in Node.js

1. Paste the JavaScript code into text files, and then save it into a project folder with file extension .js (such as C:\nodejsmysql\createtable.js or /home/username/nodejsmysql/createtable.js).
2. Open the command prompt or bash shell, and then change directory into your project folder `cd nodejsmysql`.
3. To run the application, enter the node command followed by the file name, such as `node createtable.js`.
4. On Windows, if the node application is not in your environment variable path, you may need to use the full path to launch the node application, such as `"C:\Program Files\nodejs\node.exe" createtable.js`

## Connect, create table, and insert data

Use the following code to connect and load the data by using **CREATE TABLE** and  **INSERT INTO** SQL statements.

The [mysql.createConnection()](https://github.com/mysqljs/mysql#establishing-connections) method is used to interface with the MySQL server. The [connect()](https://github.com/mysqljs/mysql#establishing-connections) function is used to establish the connection to the server. The [query()](https://github.com/mysqljs/mysql#performing-queries) function is used to execute the SQL query against MySQL database. 

Replace the `host`, `user`, `password`, and `database` parameters with the values that you specified when you created the server and database.

```javascript
const mysql = require('mysql');

var config =
{
	host: 'mydemoserver.mysql.database.azure.com',
	user: 'myadmin@mydemoserver',
	password: 'your_password',
	database: 'quickstartdb',
	port: 3306,
	ssl: true
};

const conn = new mysql.createConnection(config);

conn.connect(
	function (err) { 
	if (err) { 
		console.log("!!! Cannot connect !!! Error:");
		throw err;
	}
	else
	{
	   console.log("Connection established.");
           queryDatabase();
	}	
});

function queryDatabase(){
	   conn.query('DROP TABLE IF EXISTS inventory;', function (err, results, fields) { 
			if (err) throw err; 
			console.log('Dropped inventory table if existed.');
		})
  	   conn.query('CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);', 
	      	function (err, results, fields) {
      			if (err) throw err;
			console.log('Created inventory table.');
		})
	   conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['banana', 150], 
      		function (err, results, fields) {
      			if (err) throw err;
			else console.log('Inserted ' + results.affectedRows + ' row(s).');
	   	})
	   conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['orange', 154], 
      		function (err, results, fields) {
      			if (err) throw err;
			console.log('Inserted ' + results.affectedRows + ' row(s).');
	   	})
	   conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['apple', 100], 
		function (err, results, fields) {
      			if (err) throw err;
			console.log('Inserted ' + results.affectedRows + ' row(s).');
	   	})
	   conn.end(function (err) { 
		if (err) throw err;
		else  console.log('Done.') 
		});
};
```

## Read data

Use the following code to connect and read the data by using a **SELECT** SQL statement. 

The [mysql.createConnection()](https://github.com/mysqljs/mysql#establishing-connections) method is used to interface with the MySQL server. The [connect()](https://github.com/mysqljs/mysql#establishing-connections) method is used to establish the connection to the server. The [query()](https://github.com/mysqljs/mysql#performing-queries) method is used to execute the SQL query against MySQL database. The results array is used to hold the results of the query.

Replace the `host`, `user`, `password`, and `database` parameters with the values that you specified when you created the server and database.

```javascript
const mysql = require('mysql');

var config =
{
	host: 'mydemoserver.mysql.database.azure.com',
	user: 'myadmin@mydemoserver',
	password: 'your_password',
	database: 'quickstartdb',
	port: 3306,
	ssl: true
};

const conn = new mysql.createConnection(config);

conn.connect(
	function (err) { 
		if (err) { 
			console.log("!!! Cannot connect !!! Error:");
			throw err;
		}
		else {
			console.log("Connection established.");
			readData();
		}	
	});

function readData(){
		conn.query('SELECT * FROM inventory', 
			function (err, results, fields) {
				if (err) throw err;
				else console.log('Selected ' + results.length + ' row(s).');
				for (i = 0; i < results.length; i++) {
					console.log('Row: ' + JSON.stringify(results[i]));
				}
				console.log('Done.');
			})
	   conn.end(
		   function (err) { 
				if (err) throw err;
				else  console.log('Closing connection.') 
		});
};
```

## Update data

Use the following code to connect and read the data by using an **UPDATE** SQL statement. 

The [mysql.createConnection()](https://github.com/mysqljs/mysql#establishing-connections) method is used to interface with the MySQL server. The [connect()](https://github.com/mysqljs/mysql#establishing-connections) method is used to establish the connection to the server. The [query()](https://github.com/mysqljs/mysql#performing-queries) method is used to execute the SQL query against MySQL database. 

Replace the `host`, `user`, `password`, and `database` parameters with the values that you specified when you created the server and database.

```javascript
const mysql = require('mysql');

var config =
{
	host: 'mydemoserver.mysql.database.azure.com',
	user: 'myadmin@mydemoserver',
	password: 'your_password',
	database: 'quickstartdb',
	port: 3306,
	ssl: true
};

const conn = new mysql.createConnection(config);

conn.connect(
	function (err) { 
		if (err) { 
			console.log("!!! Cannot connect !!! Error:");
			throw err;
		}
		else {
			console.log("Connection established.");
			updateData();
		}	
	});

function updateData(){
	   conn.query('UPDATE inventory SET quantity = ? WHERE name = ?', [200, 'banana'], 
			function (err, results, fields) {
				if (err) throw err;
				else console.log('Updated ' + results.affectedRows + ' row(s).');
	   	})
	   conn.end(
		   function (err) { 
				if (err) throw err;
				else  console.log('Done.') 
		});
};
```

## Delete data

Use the following code to connect and read the data by using a **DELETE** SQL statement. 

The [mysql.createConnection()](https://github.com/mysqljs/mysql#establishing-connections) method is used to interface with the MySQL server. The [connect()](https://github.com/mysqljs/mysql#establishing-connections) method is used to establish the connection to the server. The [query()](https://github.com/mysqljs/mysql#performing-queries) method is used to execute the SQL query against MySQL database. 

Replace the `host`, `user`, `password`, and `database` parameters with the values that you specified when you created the server and database.

```javascript
const mysql = require('mysql');

var config =
{
	host: 'mydemoserver.mysql.database.azure.com',
	user: 'myadmin@mydemoserver',
	password: 'your_password',
	database: 'quickstartdb',
	port: 3306,
	ssl: true
};

const conn = new mysql.createConnection(config);

conn.connect(
	function (err) { 
		if (err) { 
			console.log("!!! Cannot connect !!! Error:");
			throw err;
		}
		else {
			console.log("Connection established.");
			deleteData();
		}	
	});

function deleteData(){
	   conn.query('DELETE FROM inventory WHERE name = ?', ['orange'], 
			function (err, results, fields) {
				if (err) throw err;
				else console.log('Deleted ' + results.affectedRows + ' row(s).');
	   	})
	   conn.end(
		   function (err) { 
				if (err) throw err;
				else  console.log('Done.') 
		});
};
```

## Next steps

> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./concepts-migrate-import-export.md)

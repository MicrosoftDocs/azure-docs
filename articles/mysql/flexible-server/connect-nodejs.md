---
title: "Quickstart: Connect using Node.js - Azure Database for MySQL - Flexible Server"
description: This quickstart provides several Node.js code samples you can use to connect and query data from Azure Database for MySQL - Flexible Server.
author: shreyaaithal
ms.author: shaithal
ms.reviewer: maghan
ms.date: 06/19/2023
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
ms.custom: mvc, seo-javascript-september2019, seo-javascript-october2019, devx-track-js, mode-api, devx-track-linux
ms.devlang: javascript
---

# Quickstart: Use Node.js to connect and query data in Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

In this quickstart, you connect to an Azure Database for MySQL - Flexible Server by using Node.js. You then use SQL statements to query, insert, update, and delete data in the database from Mac, Linux, and Windows platforms.

This article assumes that you're familiar with developing using Node.js, but you're new to working with Azure Database for MySQL - Flexible Server.

## Prerequisites

This quickstart uses the resources created in either of these guides as a starting point:

- [Create an Azure Database for MySQL - Flexible Server using Azure portal](./quickstart-create-server-portal.md)
- [Create an Azure Database for MySQL - Flexible Server using Azure CLI](./quickstart-create-server-cli.md)

> [!IMPORTANT]  
> Ensure the IP address you're connecting from has been added the server's firewall rules using the [Azure portal](./how-to-manage-firewall-portal.md) or [Azure CLI](./how-to-manage-firewall-cli.md)

## Install Node.js and the MySQL connector

Depending on your platform, follow the instructions in the appropriate section to install [Node.js](https://nodejs.org). Use npm to install the [mysql2](https://www.npmjs.com/package/mysql2) package and its dependencies into your project folder. 

### [Windows](#tab/windows)

1. Visit the [Node.js downloads page](https://nodejs.org/en/download/), and then select your desired Windows installer option.
1. Make a local project folder such as `nodejsmysql`.
1. Open the command prompt, and then change directory into the project folder, such as `cd c:\nodejsmysql\`
1. Run the NPM tool to install mysql2 library into the project folder.

    ```cmd
    cd c:\nodejsmysql\
    "C:\Program Files\nodejs\npm" install mysql2
    "C:\Program Files\nodejs\npm" list
    ```

1. Verify the installation by checking the `npm list` output text. The version number may vary as new patches are released.

### [Linux (Ubuntu/Debian)](#tab/ubuntu)

1. Run the following commands to install **Node.js** and **npm** the package manager for Node.js.

   ```bash
    # Using Ubuntu
    sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # Using Debian, as root
    sudo curl -sL https://deb.nodesource.com/setup_14.x | bash -
    sudo apt-get install -y nodejs
   ```

1. Run the following commands to create a project folder `mysqlnodejs` and install the mysql2 package into that folder.

   ```bash
   mkdir nodejsmysql
   cd nodejsmysql
   npm install --save mysql2
   npm list
   ```

1. Verify the installation by checking npm list output text. The version number may vary as new patches are released.

### [Linux (RHEL/CentOS)](#tab/rhel)

1. Run the following commands to install **Node.js** and **npm** the package manager for Node.js.

    **RHEL/CentOS 7.x**

    ```bash
    sudo yum install -y rh-nodejs8
    scl enable rh-nodejs8 bash
   ```

    **RHEL/CentOS 8.x**

   ```bash
    sudo yum install -y nodejs
   ```

1. Run the following commands to create a project folder `mysqlnodejs` and install the mysql2 package into that folder.

   ```bash
   mkdir nodejsmysql
   cd nodejsmysql
   npm install --save mysql2
   npm list
   ```

1. Verify the installation by checking npm list output text. The version number may vary as new patches are released.

### [Linux (SUSE)](#tab/sles)

1. Run the following commands to install **Node.js** and **npm** the package manager for Node.js.

   ```bash
    sudo zypper install nodejs
   ```

1. Run the following commands to create a project folder `mysqlnodejs` and install the mysql2 package into that folder.

   ```bash
   mkdir nodejsmysql
   cd nodejsmysql
   npm install --save mysql2
   npm list
   ```

1. Verify the installation by checking npm list output text. The version number may vary as new patches are released.

### [macOS](#tab/mac)

1. Visit the [Node.js downloads page](https://nodejs.org/en/download/), and then select your macOS installer.

1. Run the following commands to create a project folder `mysqlnodejs` and install the mysql2 package into that folder.

   ```bash
   mkdir nodejsmysql
   cd nodejsmysql
   npm install --save mysql2
   npm list
   ```

1. Verify the installation by checking the `npm list` output text. The version number may vary as new patches are released.

---

## Get connection information

Get the connection information needed to connect to the Azure Database for MySQL - Flexible Server. You need the fully qualified server name and sign in credentials.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. From the left-hand menu in Azure portal, select **All resources**, and then search for the server you have created (such as **mydemoserver**).
1. Select the server name.
1. From the server's **Overview** panel, make a note of the **Server name** and **Server admin login name**. If you forget your password, you can also reset the password from this panel.

## Run the code samples

1. Paste the JavaScript code into new text files, and then save it into a project folder with file extension .js (such as C:\nodejsmysql\createtable.js or /home/username/nodejsmysql/createtable.js).
1. Replace `host`, `user`, `password` and `database` config options in the code with the values that you specified when you created the MySQL flexible server and database.
1. **Obtain SSL certificate**: To use encrypted connections with your client applications,you'll need to download the [public SSL certificate](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem) which is also available in Azure portal Networking blade as shown in the screenshot below.
    :::image type="content" source="./media/how-to-connect-tls-ssl/download-ssl.png" alt-text="Screenshot showing how to download public SSL certificate from Azure portal." lightbox="./media/how-to-connect-tls-ssl/download-ssl.png":::

Save the certificate file to your preferred location.

1. In the `ssl` config option, replace the `ca-cert` filename with the path to this local file. This will allow the application to connect securely to the database over SSL.
1. Open the command prompt or bash shell, and then change directory into your project folder `cd nodejsmysql`.
1. To run the application, enter the node command followed by the file name, such as `node createtable.js`.
1. On Windows, if the node application isn't in your environment variable path, you may need to use the full path to launch the node application, such as `"C:\Program Files\nodejs\node.exe" createtable.js`

## Connect, create table, and insert data

Use the following code to connect and load the data by using **CREATE TABLE** and  **INSERT INTO** SQL statements.

The [mysql.createConnection()](https://github.com/sidorares/node-mysql2#first-query) method is used to interface with the MySQL server. The [connect()](https://github.com/sidorares/node-mysql2#first-query) function is used to establish the connection to the server. The [query()](https://github.com/sidorares/node-mysql2#first-query) function is used to execute the SQL query against MySQL database.

```javascript
const mysql = require('mysql2');
const fs = require('fs');

var config =
{
    host: 'your_server_name.mysql.database.azure.com',
    user: 'your_admin_name',
    password: 'your_admin_password',
    database: 'quickstartdb',
    port: 3306,
    ssl: {ca: fs.readFileSync("your_path_to_ca_cert_file_DigiCertGlobalRootCA.crt.pem")}
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

function queryDatabase()
{
    conn.query('DROP TABLE IF EXISTS inventory;',
        function (err, results, fields) {
            if (err) throw err;
            console.log('Dropped inventory table if existed.');
        }
    )
    conn.query('CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);',
        function (err, results, fields) {
            if (err) throw err;
            console.log('Created inventory table.');
        }
    )
    conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['banana', 150],
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
        }
    )
    conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['orange', 250],
        function (err, results, fields) {
            if (err) throw err;
            console.log('Inserted ' + results.affectedRows + ' row(s).');
        }
    )
    conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['apple', 100],
        function (err, results, fields) {
            if (err) throw err;
            console.log('Inserted ' + results.affectedRows + ' row(s).');
        }
    )
    conn.end(function (err) {
        if (err) throw err;
        else  console.log('Done.')
    });
};
```

## Read data

Use the following code to connect and read the data by using a **SELECT** SQL statement.

The [mysql.createConnection()](https://github.com/sidorares/node-mysql2#first-query) method is used to interface with the MySQL server. The [connect()](https://github.com/sidorares/node-mysql2#first-query) method is used to establish the connection to the server. The [query()](https://github.com/sidorares/node-mysql2#first-query) method is used to execute the SQL query against MySQL database. The results array is used to hold the results of the query.

```javascript
const mysql = require('mysql2');
const fs = require('fs');

var config =
{
    host: 'your_server_name.mysql.database.azure.com',
    user: 'your_admin_name',
    password: 'your_admin_password',
    database: 'quickstartdb',
    port: 3306,
    ssl: {ca: fs.readFileSync("your_path_to_ca_cert_file_DigiCertGlobalRootCA.crt.pem")}
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

Use the following code to connect and update the data by using an **UPDATE** SQL statement.

The [mysql.createConnection()](https://github.com/sidorares/node-mysql2#first-query) method is used to interface with the MySQL server. The [connect()](https://github.com/sidorares/node-mysql2#first-query) method is used to establish the connection to the server. The [query()](https://github.com/sidorares/node-mysql2#first-query) method is used to execute the SQL query against MySQL database.

```javascript
const mysql = require('mysql2');
const fs = require('fs');

var config =
{
    host: 'your_server_name.mysql.database.azure.com',
    user: 'your_admin_name',
    password: 'your_admin_password',
    database: 'quickstartdb',
    port: 3306,
    ssl: {ca: fs.readFileSync("your_path_to_ca_cert_file_DigiCertGlobalRootCA.crt.pem")}
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
       conn.query('UPDATE inventory SET quantity = ? WHERE name = ?', [75, 'banana'],
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

Use the following code to connect and delete data by using a **DELETE** SQL statement.

The [mysql.createConnection()](https://github.com/sidorares/node-mysql2#first-query) method is used to interface with the MySQL server. The [connect()](https://github.com/sidorares/node-mysql2#first-query) method is used to establish the connection to the server. The [query()](https://github.com/sidorares/node-mysql2#first-query) method is used to execute the SQL query against MySQL database.

```javascript
const mysql = require('mysql2');
const fs = require('fs');

var config =
{
    host: 'your_server_name.mysql.database.azure.com',
    user: 'your_admin_name',
    password: 'your_admin_password',
    database: 'quickstartdb',
    port: 3306,
    ssl: {ca: fs.readFileSync("your_path_to_ca_cert_file_DigiCertGlobalRootCA.crt.pem")}
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

## Clean up resources

To clean up all resources used during this quickstart, delete the resource group using the following command:

```azurecli-interactive
az group delete \
    --name $AZ_RESOURCE_GROUP \
    --yes
```

## Next steps

- [Encrypted connectivity using Transport Layer Security (TLS 1.2) in Azure Database for MySQL - Flexible Server](./how-to-connect-tls-ssl.md).
- Learn more about [Networking in Azure Database for MySQL - Flexible Server](./concepts-networking.md).
- [Create and manage Azure Database for MySQL - Flexible Server firewall rules using the Azure portal](./how-to-manage-firewall-portal.md).
- [Create and manage Azure Database for MySQL - Flexible Server virtual network using Azure portal](./how-to-manage-virtual-network-portal.md). 

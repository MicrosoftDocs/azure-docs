---
title: 'Quickstart: Connect using Node.js - Azure Database for MySQL'
description: This quickstart provides several Node.js code samples you can use to connect and query data from Azure Database for MySQL.
ms.service: mysql
ms.subservice: single-server
ms.topic: quickstart
ms.devlang: javascript
author: savjani
ms.author: pariks
ms.custom: mvc, seo-javascript-september2019, seo-javascript-october2019, devx-track-js, mode-api, devx-track-linux
ms.date: 05/03/2023
---

# Quickstart: Use Node.js to connect and query data in Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

In this quickstart, you connect to an Azure Database for MySQL by using Node.js. You then use SQL statements to query, insert, update, and delete data in the database from Mac, Linux, and Windows platforms. 

This article assumes that you're familiar with developing using Node.js, but you're new to working with Azure Database for MySQL.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- An Azure Database for MySQL server. [Create an Azure Database for MySQL server using Azure portal](quickstart-create-mysql-server-database-using-azure-portal.md) or [Create an Azure Database for MySQL server using Azure CLI](quickstart-create-mysql-server-database-using-azure-cli.md).

> [!IMPORTANT] 
> Ensure the IP address you're connecting from has been added the server's firewall rules using the [Azure portal](./how-to-manage-firewall-using-portal.md) or [Azure CLI](./how-to-manage-firewall-using-cli.md)

## Install Node.js and the MySQL connector

Depending on your platform, follow the instructions in the appropriate section to install [Node.js](https://nodejs.org). Use npm to install the [mysql2](https://www.npmjs.com/package/mysql2) package and its dependencies into your project folder.

### [Windows](#tab/windows)

1. Visit the [Node.js downloads page](https://nodejs.org/en/download/), and then select your desired Windows installer option.
2. Make a local project folder such as `nodejsmysql`. 
3. Open the command prompt, and then change directory into the project folder, such as `cd c:\nodejsmysql\`
4. Run the NPM tool to install the mysql2 library into the project folder.

   ```cmd
   cd c:\nodejsmysql\
   "C:\Program Files\nodejs\npm" install mysql2
   "C:\Program Files\nodejs\npm" list
   ```

5. Verify the installation by checking the `npm list` output text. The version number may vary as new patches are released.

### [Linux (Ubuntu/Debian)](#tab/ubuntu)

1. Run the following commands to install **Node.js** and **npm** the package manager for Node.js.

   ```bash
    # Using Ubuntu
    sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # Using Debian
    sudo curl -sL https://deb.nodesource.com/setup_14.x | bash -
    sudo apt-get install -y nodejs
   ```

2. Run the following commands to create a project folder `mysqlnodejs` and install the mysql2 package into that folder.

   ```bash
   mkdir nodejsmysql
   cd nodejsmysql
   npm install --save mysql2
   npm list
   ```

3. Verify the installation by checking npm list output text. The version number may vary as new patches are released.

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

### [macOS](#tab/macos)

1. Visit the [Node.js downloads page](https://nodejs.org/en/download/), and then select your macOS installer.

2. Run the following commands to create a project folder `mysqlnodejs` and install the mysql2 package into that folder.

   ```bash
   mkdir nodejsmysql
   cd nodejsmysql
   npm install --save mysql2
   npm list
   ```

3. Verify the installation by checking the `npm list` output text. The version number may vary as new patches are released.

---

## Get connection information

Get the connection information needed to connect to the Azure Database for MySQL. You need the fully qualified server name and login credentials.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, select **All resources**, and then search for the server you have created (such as **mydemoserver**).
3. Select the server name.
4. From the server's **Overview** panel, make a note of the **Server name** and **Server admin login name**. If you forget your password, you can also reset the password from this panel.
 :::image type="content" source="./media/connect-nodejs/server-name-azure-database-mysql.png" alt-text="Azure Database for MySQL server name":::

## Running the code samples

1. Paste the JavaScript code into new text files, and then save it into a project folder with file extension .js (such as C:\nodejsmysql\createtable.js or /home/username/nodejsmysql/createtable.js).
1. Replace `host`, `user`, `password` and `database` config options in the code with the values that you specified when you created the server and database.
1. **Obtain SSL certificate**: Download the certificate needed to communicate over SSL with your Azure Database for MySQL server from [https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem) and save the certificate file to your local drive.

    **For Microsoft Internet Explorer and Microsoft Edge:** After the download has completed, rename the certificate to DigiCertGlobalRootCA.crt.pem.

    See the following links for certificates for servers in sovereign clouds: [Azure Government](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem), [Microsoft Azure operated by 21Vianet](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem), and [Azure Germany](https://www.d-trust.net/cgi-bin/D-TRUST_Root_Class_3_CA_2_2009.crt).
1. In the `ssl` config option, replace the `ca-cert` filename with the path to this local file.
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
    host: 'mydemoserver.mysql.database.azure.com',
    user: 'myadmin@mydemoserver',
    password: 'your_password',
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

The [mysql.createConnection()](https://github.com/sidorares/node-mysql2#first-query) method is used to interface with the MySQL server. The [connect()](https://github.com/sidorares/node-mysql2#first-query) method is used to establish the connection to the server. The [query()](https://github.com/sidorares/node-mysql2#first-query) method is used to execute the SQL query against MySQL database. The results array is used to hold the results of the query.

```javascript
const mysql = require('mysql2');
const fs = require('fs');

var config =
{
    host: 'mydemoserver.mysql.database.azure.com',
    user: 'myadmin@mydemoserver',
    password: 'your_password',
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

Use the following code to connect and update data by using an **UPDATE** SQL statement. 

The [mysql.createConnection()](https://github.com/sidorares/node-mysql2#first-query) method is used to interface with the MySQL server. The [connect()](https://github.com/sidorares/node-mysql2#first-query) method is used to establish the connection to the server. The [query()](https://github.com/sidorares/node-mysql2#first-query) method is used to execute the SQL query against MySQL database. 

```javascript
const mysql = require('mysql2');
const fs = require('fs');

var config =
{
    host: 'mydemoserver.mysql.database.azure.com',
    user: 'myadmin@mydemoserver',
    password: 'your_password',
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

Use the following code to connect and delete data by using a **DELETE** SQL statement. 

The [mysql.createConnection()](https://github.com/sidorares/node-mysql2#first-query) method is used to interface with the MySQL server. The [connect()](https://github.com/sidorares/node-mysql2#first-query) method is used to establish the connection to the server. The [query()](https://github.com/sidorares/node-mysql2#first-query) method is used to execute the SQL query against MySQL database. 

```javascript
const mysql = require('mysql2');
const fs = require('fs');

var config =
{
    host: 'mydemoserver.mysql.database.azure.com',
    user: 'myadmin@mydemoserver',
    password: 'your_password',
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

> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./concepts-migrate-import-export.md)

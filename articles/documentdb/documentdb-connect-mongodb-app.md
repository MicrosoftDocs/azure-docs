---
title: Connect a MongoDB app to Azure Azure Cosmos DB by using Node.js | Microsoft Docs
description: Learn how to get a Node.js app working in Azure, with connection to an Azure Cosmos DB database with a MongoDB connection string
services: documentdb
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: documentdb
ms.custom: quick start connect
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: hero-article
ms.date: 04/24/2017
ms.author: mimig

---
# Azure Cosmos DB: Build a Node.js and MongoDB web app 

This tutorial shows you how to create a Node.js web app in Azure and connect your application to a Azure Cosmos DB database, which can support MongoDB client connections. When you are done, you will have a MEAN application (MongoDB, Express, AngularJS, and Node.js) running on [Azure Cosmos DB](https://azure.microsoft.com/services/documentdb/). For more information about running MongoDB apps with an Azure Cosmos DB database, see [What is the Azure Cosmos DB MongoDB API?](documentdb-protocol-mongodb.md).

![MEAN.js app running in Azure App Service](./media/documentdb-connect-mongodb-app/meanjs-in-azure.png)

## Before you begin

Before starting this tutorial, ensure that [the Azure CLI is installed](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) on your machine. In addition, you need [Node.js](https://nodejs.org/) and [Git](http://www.git-scm.com/downloads). You will run `az`, `npm`, and `git` commands.

You should have working knowledge of Node.js. This tutorial is not intended to help you with developing Node.js applications in general.

## Step 1 - Create local Node.js application
In this step, you set up the local Node.js project.

### Clone the sample application

Open a git terminal window, such as git bash, and `CD` to a working directory.  

Run the following commands to clone the sample repository. This sample repository contains the default [MEAN.js](http://meanjs.org/) application. 

```bash
git clone https://github.com/prashanthmadi/mean
```

### Run the application

Install the required packages and start the application.

```bash
cd mean
npm install
npm start
```

<!--
I got quite a few errors on npm start:
npm WARN deprecated mongodb@2.2.11: Please upgrade to 2.2.19 or higher
npm WARN deprecated ignore@2.2.19: several bugs fixed in v3.2.1
npm WARN deprecated minimatch@2.0.10: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
npm WARN deprecated minimatch@0.2.14: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
npm WARN deprecated graceful-fs@1.2.3: graceful-fs v3.0.0 and before will fail on node releases >= v7.0. Please update to graceful-fs@^4.0.0 as soon as possible. Use 'npm ls graceful-fs' to find it in the tree.
npm WARN deprecated minimatch@0.3.0: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
-->

Unless you already have a local MongoDB database, `npm start` should terminate with something similar to the following error message:

```bash
{ [MongoError: failed to connect to server [localhost:27017] on first connect]
  ...
  name: 'MongoError',
  message: 'failed to connect to server [localhost:27017] on first connect' }
  [22:16:23] [nodemon] app crashed - waiting for file changes before starting...
```
Type CTRL + C to cancel the operation. We will now create and connect the MongoDB app to an Azure Cosmos DB database. 

## Step 2 - Create an Azure Cosmos DB database

In this step, you connect your application to an Azure Cosmos DB database, which can support MongoDB client connections. In other words, your Node.js application only knows that it's connecting to a database using MongoDB APIs. The fact that data is stored in Azure Cosmos DB is completely transparent to the application.

### Log in to Azure

You are now going to use the Azure CLI 2.0 in a terminal window to create the resources needed to host your Node.js application in Azure App Service.  Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions. 

```azurecli 
az login 
``` 
   
### Add the Azure Cosmos DB module

To use Azure Cosmos DB commands, add the Azure Cosmos DB module. 

```azurecli
az component update --add documentdb
```

### Create a resource group

Create a [resource group](../azure-resource-manager/resource-group-overview.md) with the [az group create](/cli/azure/group#create). An Azure resource group is a logical container into which Azure resources like web apps, databases and storage accounts are deployed and managed. 

The following example creates a resource group in the West Europe region.

```azurecli
az group create --name myResourceGroup --location "West Europe"
```

### Create an Azure Cosmos DB account

Create an Azure Cosmos DB account with the [az documentdb create](/cli/azure/documentdb#create) command.

In the following command, please substitute your own unique Azure Cosmos DB account name where you see the `<documentdb_name>` placeholder. This unique name will be used as part of your Azure Cosmos DB endpoint (`https://<documentdb_name>.documents.azure.com/`), so the name needs to be unique across all Azure Cosmos DB accounts in Azure. 

```azurecli
az documentdb create --name <documentdb_name> --resource-group myResourceGroup --kind MongoDB
```

The `--kind MongoDB` parameter enables MongoDB client connections.

When the Azure Cosmos DB account is created, the Azure CLI shows information similar to the following example. 

```json
{
  "databaseAccountOfferType": "Standard",
  "documentEndpoint": "https://<documentdb_name>.documents.azure.com:443/",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Document
DB/databaseAccounts/<documentdb_name>",
  "kind": "MongoDB",
  "location": "West Europe",
  "name": "<documentdb_name>",
  "readLocations": [
    {
      "documentEndpoint": "https://<documentdb_name>-westeurope.documents.azure.com:443/",
      "failoverPriority": 0,
      "id": "<documentdb_name>-westeurope",
      "locationName": "West Europe",
      "provisioningState": "Succeeded"
    }
  ],
  "resourceGroup": "myResourceGroup",
  "type": "Microsoft.DocumentDB/databaseAccounts",
  "writeLocations": [
    {
      "documentEndpoint": "https://<documentdb_name>-westeurope.documents.azure.com:443/",
      "failoverPriority": 0,
      "id": "<documentdb_name>-westeurope",
      "locationName": "West Europe",
      "provisioningState": "Succeeded"
    }
  ]
} 
```

## Step 3 - Connect your Node.js application to the database

In this step, you connect your MEAN.js sample application to the an Azure Cosmos DB database you just created, using a MongoDB connection string. 

### Retrieve the database key

In order to connect to the an Azure Cosmos DB database, you need the database key. Use the [az documentdb list-keys](/cli/azure/documentdb#list-keys) command to retrieve the primary key.

```azurecli
az documentdb list-keys --name <documentdb_name> --resource-group myResourceGroup
```

The Azure CLI outputs information similar to the following example. 

```json
{
  "primaryMasterKey": "RUayjYjixJDWG5xTqIiXjC...",
  "primaryReadonlyMasterKey": "...",
  "secondaryMasterKey": "...",
  "secondaryReadonlyMasterKey": "..."
}
```

Copy the value of `primaryMasterKey` to a text editor. You need this information in the next step.

<a name="devconfig"></a>
### Configure the connection string in your Node.js application

In your MEAN.js repository, open `config/env/local-development.js`.

Replace the content of this file with the following code. Be sure to also replace the two `<documentdb_name>` placeholders with your an Azure Cosmos DB account name, and the `<primary_master_key>` placeholder with the key you copied in the previous step.

```javascript
'use strict';

module.exports = {
  db: {
    uri: 'mongodb://<documentdb_name>:<primary_master_key>@<documentdb_name>.documents.azure.com:10250/mean-dev?ssl=true&sslverifycertificate=false'
  }
};
```

> [!NOTE] 
> The `ssl=true` option is important because [Azure Cosmos DB requires SSL](../documentdb/documentdb-connect-mongodb-account.md#connection-string-requirements). 
>
>

Save your changes.

### Run the application again.

Run `npm start` again. 

```bash
npm start
```

<!--
Still getting errors
mimig@MIMIG-MINIDESK MINGW64 /c/users/mimig.REDMOND/documents/Visual Studio 2017/projects/mean (master)
$ npm start

> meanjs@0.5.0 start C:\users\mimig.REDMOND\documents\Visual Studio 2017\projects\mean
> gulp

[00:11:05] Using gulpfile C:\users\mimig.REDMOND\documents\Visual Studio 2017\projects\mean\gulpfile.js
[00:11:05] Starting 'default'...
[00:11:05] Starting 'env:dev'...
[00:11:05] Finished 'env:dev' after 525 μs
[00:11:05] Starting 'copyLocalEnvConfig'...
[00:11:05] Starting 'makeUploadsDir'...
[00:11:05] Finished 'makeUploadsDir' after 976 μs
[00:11:05] Finished 'copyLocalEnvConfig' after 141 ms
[00:11:05] Starting 'lint'...
[00:11:05] Starting 'less'...
[00:11:18] Finished 'less' after 13 s
[00:11:18] Starting 'sass'...
[00:11:19] Finished 'sass' after 912 ms
[00:11:19] Starting 'csslint'...
[00:11:21] Starting 'eslint'...
C:\users\mimig.REDMOND\documents\Visual Studio 2017\projects\mean\node_modules\gulp-eslint\node_modules\eslint\lib\config\plugins.js:144
                    throw missingPluginErr;
                    ^

Error: Failed to load plugin react: Cannot find module 'eslint-plugin-react'
    at Function.Module._resolveFilename (module.js:470:15)
    at Function.resolve (internal/module.js:27:19)
    at Object.load (C:\users\mimig.REDMOND\documents\Visual Studio 2017\projects\mean\node_modules\gulp-eslint\node_modules\eslint\lib\config\plugins.js:134:29)
    at Array.forEach (native)
    at Object.loadAll (C:\users\mimig.REDMOND\documents\Visual Studio 2017\projects\mean\node_modules\gulp-eslint\node_modules\eslint\lib\config\plugins.js:162:21)
    at Object.load (C:\users\mimig.REDMOND\documents\Visual Studio 2017\projects\mean\node_modules\gulp-eslint\node_modules\eslint\lib\config\config-file.js:541:21)
    at loadConfig (C:\users\mimig.REDMOND\documents\Visual Studio 2017\projects\mean\node_modules\gulp-eslint\node_modules\eslint\lib\config.js:63:33)
    at getLocalConfig (C:\users\mimig.REDMOND\documents\Visual Studio 2017\projects\mean\node_modules\gulp-eslint\node_modules\eslint\lib\config.js:130:29)
    at Config.getConfig (C:\users\mimig.REDMOND\documents\Visual Studio 2017\projects\mean\node_modules\gulp-eslint\node_modules\eslint\lib\config.js:260:26)
    at processText (C:\users\mimig.REDMOND\documents\Visual Studio 2017\projects\mean\node_modules\gulp-eslint\node_modules\eslint\lib\cli-engine.js:224:33)
    at CLIEngine.executeOnText (C:\users\mimig.REDMOND\documents\Visual Studio 2017\projects\mean\node_modules\gulp-eslint\node_modules\eslint\lib\cli-engine.js:754:26)
    at verify (C:\users\mimig.REDMOND\documents\Visual Studio 2017\projects\mean\node_modules\gulp-eslint\index.js:20:25)
    at Transform.util.transform [as _transform] (C:\users\mimig.REDMOND\documents\Visual Studio 2017\projects\mean\node_modules\gulp-eslint\index.js:70:17)
    at Transform._read (_stream_transform.js:167:10)
    at Transform._write (_stream_transform.js:155:12)
    at doWrite (_stream_writable.js:329:12)

npm ERR! Windows_NT 10.0.14393
npm ERR! argv "C:\\Program Files\\nodejs\\node.exe" "C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js" "start"
npm ERR! node v7.9.0
npm ERR! npm  v4.2.0
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! meanjs@0.5.0 start: `gulp`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the meanjs@0.5.0 start script 'gulp'.
npm ERR! Make sure you have the latest version of node.js and npm installed.
npm ERR! If you do, this is most likely a problem with the meanjs package,
npm ERR! not with npm itself.
npm ERR! Tell the author that this fails on your system:
npm ERR!     gulp
npm ERR! You can get information on how to open an issue for this project with:
npm ERR!     npm bugs meanjs
npm ERR! Or if that isn't available, you can get their info via:
npm ERR!     npm owner ls meanjs
npm ERR! There is likely additional logging output above.

npm ERR! Please include the following file with any support request:
npm ERR!     C:\Users\mimig.REDMOND\AppData\Roaming\npm-cache\_logs\2017-04-16T05_11_36_108Z-debug.log
-->

Instead of the error message you saw earlier, a console message should now tell you that the development environment is up and running. 

Navigate to `http://localhost:3000` in a browser. Click **Sign Up** in the top menu and try to create two dummy users. 

The MEAN.js sample application stores user data in the database. If you are successful and MEAN.js automatically signs into the created user, then your an Azure Cosmos DB connection is working. 

![MEAN.js connects successfully to MongoDB](./media/documentdb-connect-mongodb-app/mongodb-connect-success.png)

## Step 4 - View data in Data Explorer

Data stored by an Azure Cosmos DB is available to view, query, and run business-logic on in the Azure portal.

To view, query, and work with the JSON documents you created in Step 3, login to the [Azure portal](https://portal.azure.com) in your web browser.

In the top Search box, type DocumentDB. When your DocumentDB account blade opens, select your DocumentDB account. In the left navigation, click Data Explorer. Expand your collection in the Collections pane, and then you can view the documents in the collection, query the data, and even create and run stored procedures, triggers, and UDFs. 

![Data Explorer in the Azure portal](./media/documentdb-connect-mongodb-app/documentdb-connect-mongodb-data-explorer.png)


## Step 5 - Deploy the Node.js application to Azure

In this step, you deploy your MongoDB-connected Node.js application to Azure Cosmos DB.

### Prepare your sample application for deployment

You may have noticed that the configuration file that you changed earlier is for the development environment (`/config/env/local-development.js`). When you deploy your application to App Service, it will run in the production environment by default. So now, you need to make the same change to the respective configuration file.

In your MEAN.js repository, open `config/env/production.js`.

In the `db` object, replace the value of `uri` as show in the following example. Be sure to replace the placeholders as before.

```javascript
'mongodb://<documentdb_name>:<primary_master_key>@<documentdb_name>.documents.azure.com:10250/mean?ssl=true&sslverifycertificate=false',
```

In the terminal, commit all your changes into Git. You can copy both commands to run them together.

```bash
git add .
git commit -m "configured MongoDB connection string"
```

## Next steps

Now that you've successfully built and run a MongoDB Node.js app, and connected it to an Azure Cosmos DB database, you can learn more about the options available for working with MongoDB apps in Azure Cosmos DB. For more information, see:

* [MongoDB data model](documentdb-protocol-mongodb.md)
* [Import to API for MongoDB](documentdb-mongodb-migrate.md)
* [Connect to your MongoDB account](documentdb-connect-mongodb-account.md)
* [Using MongoChef](documentdb-mongodb-mongochef.md)
* [Using Robomongo](documentdb-mongodb-robomongo.md)
* [Node.js console app for MongoDB API](documentdb-mongodb-samples.md)
* [.NET web app for MongoDB API](documentdb-mongodb-application.md)


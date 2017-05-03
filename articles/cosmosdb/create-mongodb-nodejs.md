---
title: Connect a MongoDB app to Azure Cosmos DB by using Node.js | Microsoft Docs
description: Learn how to connect an existing Node.js MongoDB app to Azure Cosmos DB
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
ms.date: 05/01/2017
ms.author: mimig

---
# Azure Cosmos DB: Build a Node.js and MongoDB web app 

This tutorial shows you how to use an existing MongoDB app written in Node.js and connect it to your Azure Cosmos DB database, which supports MongoDB client connections. When you are done, you will have a MEAN application (MongoDB, Express, AngularJS, and Node.js) running on [Azure Cosmos DB](https://azure.microsoft.com/services/documentdb/). For more information about running MongoDB apps with an Azure Cosmos DB database, see [What is the Azure Cosmos DB MongoDB API?](../documentdb/documentdb-protocol-mongodb.md)

In this tutorial, you connect a MongoDB app to an Azure Cosmos DB database. In other words, your Node.js application only knows that it's connecting to a database using MongoDB APIs. The fact that data is stored in Azure Cosmos DB is completely transparent to the application.

![MEAN.js app running in Azure App Service](./media/create-mongodb-nodejs/meanjs-in-azure.png)

## Before you begin

Before starting this tutorial, ensure that [the Azure CLI is installed](https://docs.microsoft.com/cli/azure/install-azure-cli) on your machine. In addition, you need [Node.js](https://nodejs.org/) and [Git](http://www.git-scm.com/downloads). You will run `az`, `npm`, and `git` commands.

You should have working knowledge of Node.js. This tutorial is not intended to help you with developing Node.js applications in general.

## Clone the sample application

Open a git terminal window, such as git bash, and `CD` to a working directory.  

Run the following commands to clone the sample repository. This sample repository contains the default [MEAN.js](http://meanjs.org/) application. 

```bash
git clone https://github.com/prashanthmadi/mean
```

## Run the application

Install the required packages and start the application.

```bash
cd mean
npm install
npm start
```

## Log in to Azure

Now use the Azure CLI 2.0 in a terminal window to create the resources needed to host your Node.js application in Azure App Service.  Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions. 

```azurecli 
az login 
``` 
   
### Add the Azure Cosmos DB module

To use Azure Cosmos DB commands, add the Azure Cosmos DB module. 

```azurecli
az component update --add documentdb
```

## Create a resource group

Create a [resource group](../azure-resource-manager/resource-group-overview.md) with the [az group create](/cli/azure/group#create). An Azure resource group is a logical container into which Azure resources like web apps, databases and storage accounts are deployed and managed. 

The following example creates a resource group in the West Europe region.

```azurecli
az group create --name myResourceGroup --location "West Europe"
```

## Create an Azure Cosmos DB account

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

## Connect your Node.js application to the database

In this step, you connect your MEAN.js sample application to the an Azure Cosmos DB database you just created, using a MongoDB connection string. 

## Retrieve the key

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
## Configure the connection string in your Node.js application

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

Instead of the error message you saw earlier, a console message should now tell you that the development environment is up and running. 

Navigate to `http://localhost:3000` in a browser. Click **Sign Up** in the top menu and try to create two dummy users. 

The MEAN.js sample application stores user data in the database. If you are successful and MEAN.js automatically signs into the created user, then your an Azure Cosmos DB connection is working. 

![MEAN.js connects successfully to MongoDB](./media/create-mongodb-nodejs/mongodb-connect-success.png)

## View data in Data Explorer

Data stored by an Azure Cosmos DB is available to view, query, and run business-logic on in the Azure portal.

To view, query, and work with the JSON documents you created in Step 3, login to the [Azure portal](https://portal.azure.com) in your web browser.

In the top Search box, type DocumentDB. When your DocumentDB account blade opens, select your DocumentDB account. In the left navigation, click Data Explorer. Expand your collection in the Collections pane, and then you can view the documents in the collection, query the data, and even create and run stored procedures, triggers, and UDFs. 

![Data Explorer in the Azure portal](./media/documentdb-connect-mongodb-app/documentdb-connect-mongodb-data-explorer.png)


## Deploy the Node.js application to Azure

In this step, you deploy your MongoDB-connected Node.js application to Azure Cosmos DB.

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

* [MongoDB data model](../documentdb/documentdb-protocol-mongodb.md)
* [Import to API for MongoDB](../documentdb/documentdb-mongodb-migrate.md)
* [Connect to your MongoDB account](../documentdb/documentdb-connect-mongodb-account.md)
* [Using MongoChef](../documentdb/documentdb-mongodb-mongochef.md)
* [Using Robomongo](../documentdb/documentdb-mongodb-robomongo.md)
* [Node.js console app for MongoDB API](../documentdb/documentdb-mongodb-samples.md)
* [.NET web app for MongoDB API](../documentdb/documentdb-mongodb-application.md)


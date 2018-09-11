---
title: MongoDB connection string for an Azure Cosmos DB account | Microsoft Docs
description: Learn how to connect your MongoDB app to an Azure Cosmos DB account by using a MongoDB connection string.
keywords: mongodb connection string
services: cosmos-db
author: slyons
manager: kfile

ms.service: cosmos-db
ms.component: cosmosdb-mongo
ms.devlang: na
ms.topic: conceptual
ms.date: 12/19/2017
ms.author: sclyon

---

# Connect a MongoDB application to Azure Cosmos DB
Learn how to connect your MongoDB app to an Azure Cosmos DB account by using a MongoDB connection string. You can then use an Azure Cosmos DB database as the data store for your MongoDB app. 

This tutorial provides two ways to retrieve connection string information:

- [The quick start method](#QuickstartConnection), for use with .NET, Node.js, MongoDB Shell, Java, and Python drivers
- [The custom connection string method](#GetCustomConnection), for use with other drivers

## Prerequisites

- An Azure account. If you don't have an Azure account, create a [free Azure account](https://azure.microsoft.com/free/) now. 
- An Azure Cosmos DB account. For instructions, see [Build a MongoDB API web app with .NET and the Azure portal](create-mongodb-dotnet.md).

## <a id="QuickstartConnection"></a>Get the MongoDB connection string by using the quick start
1. In an Internet browser, sign in to the [Azure portal](https://portal.azure.com).
2. In the **Azure Cosmos DB** blade, select the API for MongoDB account. 
3. In the left pane of the account blade, click **Quick start**. 
4. Choose your platform (**.NET**, **Node.js**, **MongoDB Shell**, **Java**, **Python**). If you don't see your driver or tool listed, don't worry--we continuously document more connection code snippets. Please comment below on what you'd like to see. To learn how to craft your own connection, read [Get the account's connection string information](#GetCustomConnection).
5. Copy and paste the code snippet into your MongoDB app.

    ![Quick start blade](./media/connect-mongodb-account/QuickStartBlade.png)

## <a id="GetCustomConnection"></a> Get the MongoDB connection string to customize
1. In an Internet browser, sign in to the [Azure portal](https://portal.azure.com).
2. In the **Azure Cosmos DB** blade, select the API for MongoDB account. 
3. In the left pane of the account blade, click **Connection String**. 
4. The **Connection String** blade opens. It has all the information necessary to connect to the account by using a driver for MongoDB, including a preconstructed connection string.

    ![Connection String blade](./media/connect-mongodb-account/ConnectionStringBlade.png)

## Connection string requirements
> [!Important]
> Azure Cosmos DB has strict security requirements and standards. Azure Cosmos DB accounts require authentication and secure communication via *SSL*. 
>
>

Azure Cosmos DB supports the standard MongoDB connection string URI format, with a couple of specific requirements: Azure Cosmos DB accounts require authentication and secure communication via SSL. So, the connection string format is:

    mongodb://username:password@host:port/[database]?ssl=true

The values of this string are available in the **Connection String** blade shown earlier:

* Username (required): Azure Cosmos DB account name.
* Password (required): Azure Cosmos DB account password.
* Host (required): FQDN of the Azure Cosmos DB account.
* Port (required): 10255.
* Database (optional): The database that the connection uses. If no database is provided, the default database is "test."
* ssl=true (required)

For example, consider the account shown in the **Connection String** blade. A valid connection string is:

    mongodb://contoso123:0Fc3IolnL12312asdfawejunASDF@asdfYXX2t8a97kghVcUzcDv98hawelufhawefafnoQRGwNj2nMPL1Y9qsIr9Srdw==@contoso123.documents.azure.com:10255/mydatabase?ssl=true

## Next steps
* Learn how to [use Studio 3T (MongoChef)](mongodb-mongochef.md) with an Azure Cosmos DB API for MongoDB account.
* Explore the Azure Cosmos DB API for MongoDB by viewing [samples](mongodb-samples.md).

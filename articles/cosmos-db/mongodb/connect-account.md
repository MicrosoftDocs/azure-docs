---
title: Connect a MongoDB application to Azure Cosmos DB
description: Learn how to connect a MongoDB app to Azure Cosmos DB by getting the connection string from Azure portal.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 03/14/2023
ms.reviewer: mjbrown
adobe-target: true
adobe-target-activity: DocsExp-A/B-384740-MongoDB-2.8.2021
adobe-target-experience: Experience B
adobe-target-content: ./connect-mongodb-account-experimental
---

# Connect a MongoDB application to Azure Cosmos DB

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Learn how to connect your MongoDB app to an Azure Cosmos DB by using a MongoDB connection string. You can then use an Azure Cosmos DB database as the data store for your MongoDB app.

This tutorial provides two ways to retrieve connection string information:

* [The quickstart method](#get-the-mongodb-connection-string-by-using-the-quick-start), for use with .NET, Node.js, MongoDB Shell, Java, and Python drivers.
* [The custom connection string method](#get-the-mongodb-connection-string-to-customize), for use with other drivers.

## Prerequisites

* An Azure account. If you don't have an Azure account, create a [free Azure account](https://azure.microsoft.com/free/) now.
* An Azure Cosmos DB account. For instructions, see [Quickstart: Azure Cosmos DB for MongoDB driver for Node.js](create-mongodb-dotnet.md).

## Get the MongoDB connection string by using the quick start

1. In an Internet browser, sign in to the [Azure portal](https://portal.azure.com).
1. In the **Azure Cosmos DB** pane, select the API.
1. In the left pane of the account pane, select **Quick start**.
1. Choose your platform (**.NET**, **Node.js**, **MongoDB Shell**, **Java**, **Python**). If you don't see your driver or tool listed, don't worry--we continuously document more connection code snippets. Comment on what you'd like to see. To learn how to craft your own connection, read [Get the account's connection string information](#get-the-mongodb-connection-string-to-customize).
1. Copy and paste the code snippet into your MongoDB app.

    :::image type="content" source="./media/connect-account/quickstart-pane.png" alt-text="Screenshot showing the Quick start pane.":::

## Get the MongoDB connection string to customize

1. In an Internet browser, sign in to the [Azure portal](https://portal.azure.com).
1. In the **Azure Cosmos DB** pane, select the API.
1. In the left pane of the account pane, select **Connection strings**.
1. The **Connection strings** pane opens. It has all the information necessary to connect to the account by using a driver for MongoDB, including a preconstructed connection string.

    :::image type="content" source="./media/connect-account/connection-string-pane.png" alt-text="Screenshot showing the Connection strings pane." lightbox="./media/connect-account/connection-string-pane.png" :::

## Connection string requirements

> [!IMPORTANT]
> Azure Cosmos DB has strict security requirements and standards. Azure Cosmos DB accounts require authentication and secure communication via *TLS*.

Azure Cosmos DB supports the standard MongoDB connection string URI format, with a couple of specific requirements: Azure Cosmos DB accounts require authentication and secure communication via TLS. The connection string format is:

`mongodb://username:password@host:port/[database]?ssl=true`

The values of this string are:

* Username (required): Azure Cosmos DB account name.
* Password (required): Azure Cosmos DB account password.
* Host (required): FQDN of the Azure Cosmos DB account.
* Port (required): 10255.
* Database (optional): The database that the connection uses. If no database is provided, the default database is "test."
* ssl=true (required).

For example, consider the account shown in the **Connection strings** pane. A valid connection string is:

`mongodb://contoso123:0Fc3IolnL12312asdfawejunASDF@asdfYXX2t8a97kghVcUzcDv98hawelufhawefafnoQRGwNj2nMPL1Y9qsIr9Srdw==@contoso123.documents.azure.com:10255/mydatabase?ssl=true`

## Driver Requirements

All drivers that support wire protocol version 3.4 or greater support Azure Cosmos DB for MongoDB.

Specifically, client drivers must support the Service Name Identification (SNI) TLS extension and/or the appName connection string option. If the `appName` parameter is provided, it must be included as found in the connection string value in the Azure portal.

## Next steps

* [Connect to an Azure Cosmos DB account using Studio 3T](connect-using-mongochef.md).
* [Use Robo 3T with Azure Cosmos DB's API for MongoDB](connect-using-robomongo.md)

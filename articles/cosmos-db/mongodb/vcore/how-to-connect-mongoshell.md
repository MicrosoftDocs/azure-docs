---
title: Use Mongo Shell to connect
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Connect to an Azure Cosmos DB for MongoDB vCore account using Mongo Shell community tool to query data.
author: kruti-m
ms.author: krmeht
ms.reviewer: yongl
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: how-to
ms.date: 02/02/2024
# CustomerIntent: As a database owner, I want to use Mongo Shell to connect and query my database & collections.
---

# Use MongoShell to connect to Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

MongoDB Shell mongosh, is a JavaScript and Node.js REPL environment for interacting with MongoDB deployments. It's a popular community tool to test queries and interact with the data in your MongoDB database.

## Prerequisites

- An existing Azure Cosmos DB for MongoDB vCore cluster.
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for MongoDB vCore cluster](quickstart-portal.md).
- Install the [MongoShell](https://www.mongodb.com/docs/mongodb-shell/install/) from the community site.
- Ensure you are setting up the necessary environment variables post installation for your operating system
    - For [Windows](https://www.mongodb.com/docs/mongodb-shell/install/#add-the-mongosh-binary-to-your-path-environment-variable).
    - For [MacOS](hhttps://www.mongodb.com/docs/mongodb-shell/install/#add-the-downloaded-binaries-to-your-path-environment-variable).
    - For [Linux](https://www.mongodb.com/docs/mongodb-shell/install/#confirm-that-mongosh-installed-successfully).
- Ensure you have set the firewall settings to allow the machine to connect. Follow the guidelines for [configuring the firewall for Azure CosmosDB](../../../cosmos-db/how-to-configure-firewall#ip-access-control-overview.md)
    - You can choose to allow requests from your current IP, requests from cloud services or requests from virtual machines - specific IP Ranges
    
![alt text](media/connect-using-mongoshell/FirewallSettings.gif)
  :::image type="content" source="./media/connect-using-robomongo/connection-string.png" alt-text="GIF of Firewall Settings update for MongoDB Vcore":::
If you accidentally open all the ports you will be warned before saving the changes as follows

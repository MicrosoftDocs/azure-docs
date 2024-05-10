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
ms.date: 02/05/2024
# CustomerIntent: As a database owner, I want to use Mongo Shell to connect and query my database & collections.
---

# Use MongoDB Shell (Mongosh) to connect to Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

MongoDB Shell (Mongosh), is a JavaScript and Node.js REPL environment for interacting with MongoDB deployments. It's a popular community tool to test queries and interact with the data in your Azure Cosmos DB for MongoDB database.

## Prerequisites

- An existing Azure Cosmos DB for MongoDB vCore cluster.
- Install the MongoShell from the community site.
- Ensure you are setting up the necessary environment variables post installation for your operating system
- Ensure you have set the firewall settings to allow the machine to connect. Follow the guidelines for [configuring the firewall for Azure CosmosDB](../../../cosmos-db/how-to-configure-firewall.md)
    - You can choose to allow requests from your current IP, requests from cloud services or requests from virtual machines - specific IP Ranges
    
![GIF of Firewall Settings update for MongoDB Vcore](media/connect-using-mongoshell/firewallsettings.gif)

If you accidentally open all the ports you will be warned before saving the changes.

## Connect using Mongo Shell (Mongosh)

To add your Azure Cosmos DB cluster to Mongo shell, perform the following steps:
1. Retrieve the connection information for your Azure Cosmos DB for MongoDB vCore using the instructions [here](quickstart-portal.md#get-cluster-credentials).

![GIF for getting connection string](./media/connect-using-mongoshell/getting-connectionstring-from-portal.gif)
Once you have the connection string you can either 
- Have the shell prompt you to enter the password or
- Provide the password as a part of the connection string 

2. Connect using Mongo Shell

**A. By entering the password in the MongoShell Prompt**

![PNG Prompt image for password for MongoShell](./media/connect-using-mongoshell/password-prompting-shell.PNG)

Your connection string would look like this:
    ```
    "mongodb+srv://<username>@<servername>.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"
    ```
Here is an example of how the command looks like : 
    ```
    mongosh "mongodb+srv://testuser@mongodbvcoretesting.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
    ```
![GIF for connecting by entering password](./media/connect-using-mongoshell/mongo-shell-connect.gif)

Once you provide the password and are successfully authenticated you will notice some warning stating *"This server or service appears to be an emulation of MongoDB"*
This can be ignored. Its just shell way of notifying that you are not connection to an emulation of MongoDB. Since it is an Azure as a platform as a service offering this is expected. 

**B. By providing the password as a part of the connection string**

Alternately you can also use a connection string with the password in which case the format looks something like this
```
mongosh "mongodb+srv://<SERVERNAME>.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000" --username "<USER>" -password "<PASSWORD>"
```

Here is an example of how the command looks like : 
```
 mongosh "mongodb+srv://mongodbvcoretesting.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000" --username "testuser" -password "******"
```
![PNG Image for password as a part of connection string ](./media/connect-using-mongoshell/connectionstring-with-password.PNG)

## Next step

> [!div class="nextstepaction"]
> [Migration options](migration-options.md)

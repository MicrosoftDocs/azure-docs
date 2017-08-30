---
title: "MongoDB, AngularJS, and Node.js tutorial for Azure - Part 4 | Microsoft Docs"
description: Part 4 of the tutorial series on creating a MongoDB app with AngularJS and Node.js on Azure Cosmos DB using the exact same APIs you use for MongoDB 
services: cosmos-db
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: cosmos-db
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: hero-article
ms.date: 08/23/2017
ms.author: mimig

---
# Create a MongoDB app with Angular and Azure Cosmos DB - Part 4: Create an Azure Cosmos DB account using the Azure CLI

This multi-part tutorial demonstrates how to create a new [MongoDB API](mongodb-introduction.md) app written in Node.js with Express and Angular and then connect it to your Azure Cosmos DB database. 

Part 4 of the tutorial builds on [Part 3](tutorial-develop-mongodb-nodejs-part3.md) and covers the following tasks:

> [!div class="checklist"]
> * Create an Azure resource group using the Azure CLI
> * Create an Azure Cosmos DB account using the Azure CLI

## Video walkthrough

> [!VIDEO https://www.youtube.com/embed/hfUM-AbOh94]

## Prerequisites

Before starting this part of the tutorial, ensure you've completed the steps in [Part 3](tutorial-develop-mongodb-nodejs-part3.md) of the tutorial. 

In this tutorial section, you can either use the Azure Cloud Shell (in your internet browser) or [Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed locally. If you use the Azure CLI locally, ensure you running Azure CLI version 2.0 or later. Run `az --version` at the command prompt to check your version. 

[!INCLUDE [cloud-shell-try-it](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [Log in to Azure](../../includes/login-to-azure.md)]

[!INCLUDE [Create resource group](../../includes/app-service-web-create-resource-group.md)] 

## Create an Azure Cosmos DB account

Create an Azure Cosmos DB account with the [`az cosmosdb create`](/cli/azure/cosmosdb#create) command.

```azurecli-interactive
az cosmosdb create --name <cosmosdb-name> --resource-group <my-resource-group> --kind MongoDB
```

* [az cosmosdb create](/cli/azure/cosmosdb#create) creates a new Azure Cosmos DB account.
* For `--name <cosmosdb-name>`, substitute your own new unique Azure Cosmos DB account name where you see the `<my-cosmosdb-acct>` placeholder. This unique name is used as part of your Azure Cosmos DB endpoint (`https://<my-cosmosdb-acct>.documents.azure.com/`), so the name needs to be unique across all Azure Cosmos DB accounts in Azure.
* For `--myResourceGroup <my-resource-group>`, substitute the name of the resource group you just created. 
* For `--kind MongoDB`, this setting enables the Azure Cosmos DB account to have MongoDB client connections.

This tells Azure that in that resource group I created, go ahead and spin up an Azure Cosmos DB instance with a MongoDB database. It may take a minute or two for the command to complete. When it's done, the terminal window displays information about the new account. 

Once the terminal displays the confirmation information, you can now go see this new database in the Azure portal. Open a new browser window and go to [https://portal.azure.com](https://portal.azure.com), click the Azure Cosmos DB logo ![Azure Cosmos DB icon in the Azure portal](./media/tutorial-develop-mongodb-nodejs-part4/azure-cosmos-db-icon.png) on the left bar, and it shows you all the Azure Cosmos DB accounts you have.

Now click on the account and scroll down to view the map where the database is located. 

![New Azure Cosmos DB account in the Azure portal](./media/tutorial-develop-mongodb-nodejs-part4/azure-cosmos-db-angular-portal.png)

Now scroll down on the left navigation and under **Settings**, click **Replicate data globally**. Now you can hover over the map and see what areas you can replicate into. For example, if you have numerous customers in Australia, you can click Australia Southeast or Australia East and replicate your data to Australia, or any of the other regions available. Replication is discussed in the last part of this tutorial, part 7, to be released soon. You can also learn more about global replication in [How to distribute data globally with Azure Cosmos DB](distribute-data-globally.md).

![New Azure Cosmos DB account in the Azure portal](./media/tutorial-develop-mongodb-nodejs-part4/azure-cosmos-db-replicate-portal.png)

## Next steps

In this part of the tutorial, you've learned how to create an Azure resource group and Azure Cosmos DB account for MongoDB using the Azure CLI. 

> [!div class="nextstepaction"]
> [Use Mongoose to connect to Azure Cosmos DB](tutorial-develop-mongodb-nodejs-part5.md)

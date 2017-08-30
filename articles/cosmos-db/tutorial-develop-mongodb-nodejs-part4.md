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

Create a Cosmos DB with the [`az cosmosdb create`](/cli/azure/cosmosdb#create) command.

```azurecli-interactive
az cosmosdb create --name <cosmosdb-name> --resource-group myResourceGroup --kind MongoDB
```

* For `<cosmosdb-name>` use your own unique Cosmos DB name, the name needs to be unique across all Cosmos DB names in Azure.
* The `--kind MongoDB` setting enables the Cosmos DB to have MongoDB client connections.

It may take a minute or two for the command to complete. When it's done, the terminal window displays information about the new database. 

Once the Cosmos DB has been created:
1. Open a new browser window and go to [https://portal.azure.com](https://portal.azure.com)
1. Click the Azure Cosmos DB logo ![Azure Cosmos DB icon in the Azure portal](./media/tutorial-develop-mongodb-nodejs-part4/azure-cosmos-db-icon.png) on the left bar, and it shows you all the Cosmos DBs you have.
1. Click on the Cosmos DB you just created, select the **Overview** tab and scroll down to view the map where the database is located. 

![New Azure Cosmos DB account in the Azure portal](./media/tutorial-develop-mongodb-nodejs-part4/azure-cosmos-db-angular-portal.png)

Scroll down on the left navigation and click the **Replicate data globally** tab, this displays a map where you can see the different areas you can replicate into. For example, you can click Australia Southeast or Australia East and replicate your data to Australia. You can learn more about global replication in [How to distribute data globally with Azure Cosmos DB](distribute-data-globally.md).

![New Azure Cosmos DB account in the Azure portal](./media/tutorial-develop-mongodb-nodejs-part4/azure-cosmos-db-replicate-portal.png)

## Next steps

In this part of the tutorial, you've learned how to create an Azure resource group and Cosmos DB using the Azure CLI. 

> [!div class="nextstepaction"]
> [Use Mongoose to connect to Azure Cosmos DB](tutorial-develop-mongodb-nodejs-part5.md)

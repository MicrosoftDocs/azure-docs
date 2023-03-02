---
title: Create an Angular app with Azure Cosmos DB's API for MongoDB (Part1)
description: Part 4 of the tutorial series on creating a MongoDB app with Angular and Node on Azure Cosmos DB using the exact same APIs you use for MongoDB 
author: gahl-levy
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: javascript
ms.topic: tutorial
ms.date: 08/26/2021
ms.author: gahllevy
ms.custom: seodec18, devx-track-js, devx-track-azurecli, ignite-2022
ms.reviewer: mjbrown
---
# Create an Angular app with Azure Cosmos DB's API for MongoDB - Create an Azure Cosmos DB account
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

This multi-part tutorial demonstrates how to create a new app written in Node.js with Express and Angular and then connect it to your [Azure Cosmos DB account configured with Azure Cosmos DB's API for MongoDB](introduction.md).

Part 4 of the tutorial builds on [Part 3](tutorial-develop-nodejs-part-3.md) and covers the following tasks:

> [!div class="checklist"]
> * Create an Azure resource group using the Azure CLI
> * Create an Azure Cosmos DB account using the Azure CLI

## Video walkthrough

> [!VIDEO https://www.youtube.com/embed/hfUM-AbOh94]

## Prerequisites

Before starting this part of the tutorial, ensure you've completed the steps in [Part 3](tutorial-develop-nodejs-part-3.md) of the tutorial. 

In this tutorial section, you can either use the Azure Cloud Shell (in your internet browser) or [the Azure CLI](/cli/azure/install-azure-cli) installed locally.

[!INCLUDE [cloud-shell-try-it](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [Log in to Azure](../../../includes/login-to-azure.md)]

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group.md)]

> [!TIP]
> This tutorial walks you through the steps to build the application step-by-step. If you want to download the finished project, you can get the completed application from the [angular-cosmosdb repo](https://github.com/Azure-Samples/angular-cosmosdb) on GitHub.

## Create an Azure Cosmos DB account

Create an Azure Cosmos DB account with the [`az cosmosdb create`](/cli/azure/cosmosdb#az-cosmosdb-create) command.

```azurecli-interactive
az cosmosdb create --name <cosmosdb-name> --resource-group myResourceGroup --kind MongoDB
```

* For `<cosmosdb-name>` use your own unique Azure Cosmos DB account name, the name needs to be unique across all Azure Cosmos DB account names in Azure.
* The `--kind MongoDB` setting enables the Azure Cosmos DB to have MongoDB client connections.

It may take a minute or two for the command to complete. When it's done, the terminal window displays information about the new database. 

Once the Azure Cosmos DB account has been created:
1. Open a new browser window and go to [https://portal.azure.com](https://portal.azure.com)
1. Click the Azure Cosmos DB logo :::image type="icon" source="./media/tutorial-develop-nodejs-part-4/azure-cosmos-db-icon.png"::: on the left bar, and it shows you all the Azure Cosmos DB s you have.
1. Click on the Azure Cosmos DB account you just created, select the **Overview** tab and scroll down to view the map where the database is located. 

    :::image type="content" source="./media/tutorial-develop-nodejs-part-4/azure-cosmos-db-angular-portal.png" alt-text="Screenshot shows the Overview of an Azure Cosmos DB DB Account.":::

4. Scroll down on the left navigation and click the **Replicate data globally** tab, this displays a map where you can see the different areas you can replicate into. For example, you can click Australia Southeast or Australia East and replicate your data to Australia. You can learn more about global replication in [How to distribute data globally with Azure Cosmos DB](../distribute-data-globally.md). For now, let's just keep the once instance and when we want to replicate, we know how.

    :::image type="content" source="./media/tutorial-develop-nodejs-part-4/azure-cosmos-db-replicate-portal.png" alt-text="Screenshot shows an Azure Cosmos DB DB Account with Replicate data globally selected.":::

## Next steps

In this part of the tutorial, you've done the following:

> [!div class="checklist"]
> * Created an Azure resource group using the Azure CLI
> * Created an Azure Cosmos DB account using the Azure CLI

You can proceed to the next part of the tutorial to connect Azure Cosmos DB to your app using Mongoose.

> [!div class="nextstepaction"]
> [Use Mongoose to connect to Azure Cosmos DB](tutorial-develop-nodejs-part-5.md)

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)

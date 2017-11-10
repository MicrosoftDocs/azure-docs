---
title: 'Quickstart: Table API with Node.js - Azure Cosmos DB | Microsoft Docs'
description: This quickstart shows how to use the Azure Cosmos DB Table API to create an application with the Azure portal and Node.js
services: cosmos-db
documentationcenter: ''
author: arramac
manager: jhubbard
editor: ''

ms.assetid: 66327041-4d5e-4ce6-a394-fee107c18e59
ms.service: cosmos-db
ms.custom: quick start connect, mvc
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: node
ms.topic: quickstart
ms.date: 11/15/2017
ms.author: arramac

---
# Quickstart: Build a Table API app with Node.js and Azure Cosmos DB

This quickstart shows how to use Node.js and the Azure Cosmos DB [Table API](table-introduction.md) to build an app by cloning an example from GitHub. This quickstart also shows you how to create an Azure Cosmos DB account and how to use Data Explorer to create tables and entities in the web-based Azure portal.

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, wide-column, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
[!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]

In addition:

* [Node.js](https://nodejs.org/en/) version v0.10.29 or higher
* [Git](http://git-scm.com/)

## Create a database account

[!INCLUDE [cosmos-db-create-dbaccount-table](../../includes/cosmos-db-create-dbaccount-table.md)]

## Add a table

[!INCLUDE [cosmos-db-create-table](../../includes/cosmos-db-create-table.md)]

## Add sample data

You can now add data to your new table using Data Explorer.

1. In Data Explorer, expand **sample-table**, click **Entities**, and then click **Add Entity**.

   ![Create new entities in Data Explorer in the Azure portal](./media/create-table-dotnet/azure-cosmosdb-data-explorer-new-document.png)
2. Now add data to the PartitionKey value box and RowKey value boxes, and click **Add Entity**.

   ![Set the Partition Key and Row Key for a new entity](./media/create-table-dotnet/azure-cosmosdb-data-explorer-new-entity.png)
  
    You can now add more entities to your table, edit your entities, or query your data in Data Explorer. Data Explorer is also where you can scale your throughput and add stored procedures, user defined functions, and triggers to your table.

## Clone the sample application

Now let's clone a Table app from github, set the connection string, and run it. You'll see how easy it is to work with data programmatically. 

1. Open a git terminal window, such as git bash, and use the `cd` command to change to a folder to install the sample app. 

    ```bash
    cd "C:\git-samples"
    ```

2. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer. 

    ```bash
    git clone https://github.com/Azure-Samples/storage-table-node-getting-started.git
    ```

3. Then open the solution file in Visual Studio. 

## Update your connection string

Now go back to the Azure portal to get your connection string information and copy it into the app. This enables your app to communicate with your hosted database. 

1. In the [Azure portal](http://portal.azure.com/), click **Connection String**. 

    Use the copy buttons on the right side of the screen to copy the CONNECTION STRING.

    ![View and copy the CONNECTION STRING in the Connection String pane](./media/create-table-nodejs/connection-string.png)

2. In Visual Studio, open the app.config file. 

3. Paste the CONNECTION STRING value into the app.config file as the value of the CosmosDBStorageConnectionString. 

    `<add key="CosmosDBStorageConnectionString" 
        value="DefaultEndpointsProtocol=https;AccountName=MYSTORAGEACCOUNT;AccountKey=AUTHKEY;TableEndpoint=https://account-name.table.cosmosdb.net" />`    

    > [!NOTE]
    > To use this app with Azure Table storage, you need to change the connection string in `app.config file`. Use the account name as Table-account name and key as Azure Storage Primary key. <br>
    >`<add key="StandardStorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key;EndpointSuffix=core.windows.net" />`
    > 
    >

4. Save the app.config file.

You've now updated your app with all the info it needs to communicate with Azure Cosmos DB. 

## Run the app

1. Run `npm install` in a terminal to install required npm modules

2. Run `node app.js` in a terminal to start your node application.

You can now go back to Data Explorer and see query, modify, and work with this new data. 

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a table using the Data Explorer, and run an app.  Now you can query your data using the Table API.  

> [!div class="nextstepaction"]
> [Import table data to the Table API](table-import.md)

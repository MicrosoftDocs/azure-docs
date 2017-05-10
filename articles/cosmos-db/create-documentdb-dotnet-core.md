---
title: 'Azure CosmosDB: Build a web app with .NET Core and DocumentDB API | Microsoft Docs'
description: Presents a .NET core code sample you can use to connect to and query the Azure Cosmos DB DocumentDB API
services: cosmosdb
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: cosmosdb
ms.custom: quick start connect
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 05/10/2017
ms.author: mimig

---
# Azure Cosmos DB: Build a DocumentDB API web app with .NET Core and the Azure portal

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This quick start demonstrates how to create an Azure Cosmos DB account, document database, and collection using the Azure portal. You'll then build and deploy a todo list web app built on the [DocumentDB .NET Core API](../documentdb/documentdb-introduction.md), as shown in the following screenshot. 

![Todo app with sample data](./media/create-documentdb-dotnet-core/azure-cosmosdb-todo-app-list.png)

## Prerequisites

If you don’t already have Visual Studio 2017 installed, you can download and use the **free** [Visual Studio 2017 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Install .NET Core

Install .NET Core using the instructions on the [.NET Core SDK](https://www.microsoft.com/net/download/core) page. SDKs are available for Windows, macOS, and Linux.

## Create a database account

[!INCLUDE [documentdb-create-dbaccount](../../includes/documentdb-create-dbaccount.md)]

## Add a collection

[!INCLUDE [cosmosdb-create-collection](../../includes/cosmosdb-create-collection.md)]

## Add sample data

[!INCLUDE [cosmosdb-create-sample-data](../../includes/cosmosdb-create-sample-data.md)]

## Clone the sample application

Now let's clone a DocumentDB API app from github, set the connection string, and run it. You'll see how easy it is to work with data programmatically.

1. Open a git terminal window, such as git bash, and `CD` to a working directory.  

2. Run the following command to clone the sample repository. 

    ```bash
    git clone https://github.com/Azure-Samples/documentdb-dotnet-todo-app.git
    ```

3. Then open the solution file in Visual Studio. 
    
## Review the code

[!INCLUDE [cosmosdb-tutorial-review-code-dotnet](../../includes/cosmosdb-tutorial-review-code-dotnet.md)]

## Update your connection string

Now go back to the Azure portal to get your connection string information and copy it into the app.

1. In the [Azure portal](http://portal.azure.com/), in your Azure Cosmos DB account, in the left navigation click **Keys**, and then click **Read-write Keys**. You'll use the copy buttons on the right side of the screen to copy the URI and Primary Key into the web.config file in the next step.

    ![View and copy an access key in the Azure portal, Keys blade](./media/create-documentdb-dotnet-core/keys.png)

2. In Visual Studio 2017, open the web.config file. 

3. Copy your URI value from the portal (using the copy button) and make it the value of the endpoint key in web.config. 

    `<add key="endpoint" value="FILLME" />`

4. Then copy your PRIMARY KEY value from the portal and make it the value of the authKey in web.confif. 

    `<add key="authKey" value="FILLME" />`

You've now updated your app with all the info it needs to communicate with Azure Cosmos DB. 

## Run the web app

1. In Visual Studio, right-click on the project in **Solution Explorer** and then click **Manage NuGet Packages**. 

2. In the NuGet **Browse** box, type *DocumentDB*.

3. From the results, install the**Microsoft.Azure.DocumentDB** library. This installs the Azure Cosmos DB package as well as all dependencies.

4. Click CTRL + F5 to run the application. Your app displays in your browser. 

5. Click **Create New** in the browser and create a few new tasks in your to-do app.

   ![Todo app with sample data](./media/create-documentdb-dotnet-core/azure-cosmosdb-todo-app-list.png)

You can now go back to Data Explorer and see query, modify, and work with this new data. 

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmosdb-tutorial-review-slas.md)]

## Clean up resources

If you're not going to continue to use this app, delete all resources created by this quickstart in the Azure portal with the following steps:

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you created. 
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a collection using the Data Explorer, and run a web app. You can now import additional data to your Cosmos DB account. 

> [!div class="nextstepaction"]
> [Import data into Azure Cosmos DB](../documentdb/documentdb-import-data.md)

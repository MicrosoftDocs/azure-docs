---
title: Connect to Azure Cosmos DB by using .NET Core (C#) and the DocumentDB API | Microsoft Docs
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
ms.date: 05/01/2017
ms.author: mimig

---
# Azure Cosmos DB: Build a .NET Core (C#) and DocumentDB API web app

This quick start demonstrates how to use the [DocumentDB .NET Core API](documentdb-sdk-dotnet-core.md) for Azure Cosmos DB and the Azure portal to create an Azure Cosmos DB account, create a database and collection, and then build and deploy a web app on the Windows platform.

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

Now let's clone a  DocumentDB API app from github, set the connection string, and run it. You'll see how easy it is to work with data programmatically. 

1. Open a git terminal window, such as git bash, and `CD` to a working directory.  

2. Run the following command to clone the sample repository. 

    ```bash
    git clone https://github.com/Azure-Samples/documentdb-dotnet-core-getting-started.git
    ```

3. Then open the solution file in Visual Studio. 
    
## Review the code

[!INCLUDE [cosmosdb-tutorial-review-code-dotnet](../../includes/cosmosdb-tutorial-review-code-dotnet.md)]

## Update your connection string

[!INCLUDE [cosmosdb-tutorial-update-connection-string](../../includes/cosmosdb-tutorial-update-connection-string.md)]

3. Copy your URI value from the portal (using the copy button) and make it the value of the endpoint key in web.config. 

    `<add key="endpoint" value="FILLME" />`

4. Then copy your PRIMARY KEY value from the portal aand make it the value of the authKey in web.congif. You've now updated your app with all the info it needs to communicate with Azure Cosmos DB. 

## Build and deploy the web app

1. In Visual Studio, right-click on the project in **Solution Explorer** and then click **Manage NuGet Packages**. 

2. In the NuGet **Browse** box, type ***Azure DocumentDB***.

3. From the results, install the **.NET Client library for Azure DocumentDB**. This installs the DocumentDB package as well as all dependencies.

4. Click CTRL + F5 to run the application. Your app displays in your browser. 

5. Click **Create New** in the browser and create a few new tasks in your to-do app.

   ![Todo app with sample data](./media/documentdb-connect-dotnet-core/azure-documentdb-todo-app-list.png)

You can now go back to Data Explorer and see query, modify, and work with this new data. 

## Review metrics in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmosdb-tutorial-review-slas.md)]

## Next steps

If you're not going to continue to use this app and Azure Cosmos DB, use the following steps to delete all resources created by this quick start in the Azure portal. If you plan to continue on to work with subsequent quick starts, do not clean up the resources created in this quick start. 

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you just created. 
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

To learn more about the Azure Comsos DB DocumentDB API, see [What is the DocumentDB API?(documentdb-introduction). To learn more about the SQL query language which you can use in the Azure portal and programmatically, see [SQL](documentdb-sql-query.md).

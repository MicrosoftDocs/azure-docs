---
title: 'Visual Studio Connected Service for Azure Cosmos DB'
description: Enables developers to connect to Azure Cosmos DB account easily and manage resources through Visual Studio Connected Service
services: cosmos-db
documentationcenter: ''
author: jejiang
manager: DJ
+tags: cosmos-db 
editor: 'Jenny Jiang'

ms.assetid: 
ms.service: cosmos-db
ms.custom: Azure Cosmos DB 
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 09/19/2017
ms.author: jejiang

---
# Azure Cosmos DB: Visual Studio Connected Service

Visual Studio Connected Services enables developers to easily connect their Azure Cosmos DB account and manage their resources.

You can also use Data Explorer in Connected Service to create stored procedures, UDFs, and triggers to perform server-side business logic. Data Explorer exposes all the built-in programmatic data access available in the APIs, but provides easy access to your data.

## Prerequisites

Make sure you have the following items:

* An active Azure account. If you don't have one, you can sign up for a [free account](https://azure.microsoft.com/free/). 
    * If you want to use a local environment for development purposes, you can use the [Azure Cosmos DB Emulator](local-emulator.md). The environment emulates the Azure Cosmos DB service.
* Assume you already have an Azure Cosmos DB account. If not, follow the steps at [creating an Azure Cosmos DB account](create-documentdb-dotnet.md) to create one in Azure portal or [Create an Azure Cosmos DB account in Connected Service tool](#Create-an-Azure-Cosmo-DB-account-in-Connected-Service-tool). If so, skip ahead to [Set up your Visual Studio solution](#SetupVS)
* [Visual Studio](http://www.visualstudio.com/).
* Install the latest Azure Cosmos DB Connected Service bits. You can download Azure Cosmos DB connected service from Visual Studio marketplace according to below screen shot. Or you can install it from [Visual Studio Marketplace](https://go.microsoft.com/fwlink/?linkid=858709). Open **Visual Studio** in your computer. On the **Tools** menu, select **Extensions and update...**, and then choose **Online** / **Visual Studio Marketplace**. Enter **cosmosdb** to search the bits.

 ![Screen shot of Connected Service download bits.png](./media/connected-service/connected-service-downloadbits.png) 
## <a id="SetupVS"></a>Set up your Visual Studio solution
1. Open **Visual Studio** in your computer.
2. On the **File** menu, select **New**, and then choose **Project**.
3. In the **New Project** dialog, select **Visual C#** / **Console App (.NET Framework)** or **WPF App (.NET Framework)**, name your project, and then click **OK**.

    ![Screen shot of the New Project window](./media/connected-service/connected-service-new-project.png)
## Add Connected Service and add account
1. Right click on the Project node, then select **Add** / **Connected Service**. Or click on the **Project** menu, and then select **Add Connected Service**.

    ![Screen shot of the Add Connected Service window](./media/connected-service/connected-service-add-connectedservice-rightclick.png)
2. In the connected service page, click **Connected Services** / **Azure Cosmos DB** to open the **Azure Cosmos DB** page.

    ![Screen shot of the Azure Cosmos DB window](./media/connected-service/connected-service-choose-azure-cosmosdb.png)
3. Click the down arrow to sign in for the first time or add an account. After sign-in, all Azure Cosmos DB accounts are shown in the blank area. Choose one Azure Cosmos DB account to add to your project.

    ![Screen shot of the sign-in and listed db account window](./media/connected-service/connected-service-add-db-account.png)
4. After you've added an Azure Cosmos DB account, an Azure Cosmos DB account connected service folder was added to the project. You can add more than one Azure Cosmos DB account through repeating step 1 to step 3.

    ![Screen shot of the connected service folder window](./media/connected-service/connected-service-add-connectedservice-folder.png)

5. When you have added an Azure Cosmos DB connected service, we would modify your project to enable access to Azure Cosmos DB database mainly in below two ways.

* Some nuget packages that are required by Azure Cosmos DB client are installed. You can see them from your packages configuration file. 

    ![The new Azure Cosmos DB packages config](./media/connected-service/connected-service-packages-config.png)   
    
* Cosmos DB connection uri and key are added to project configuration file, in this case, App.config. 

    ![The new Azure Cosmos DB app config](./media/connected-service/connected-service-app-config.png) 

## Open Azure Cosmos DB Explorer
1. Right click on Project node, select **Open Cosmos DB Explorer...**.

    ![Screen shot of the try to Open Data Explorer window](./media/connected-service/connected-service-right-click-open-data-exporer.png)
2. In the **Choose a Cosmos DB Account** page, click dropdown list to select one Azure Cosmos DB account.

    ![Screen shot of the Added Account Connected Service window](./media/connected-service/connected-service-open-explorer.png)
3. Click **Open**, then data explorer window is shown.

## <a id="Create-an-Azure-Cosmo-DB-account-in-Connected-Service-tool"></a>Create an Azure Cosmos DB account in Connected Service tool
1. In the connected service page, in the left bottom pane, click **Create a New Cosmos DB Account** to open **Create Cosmos DB Account** page.

    ![Screen shot of the open Create Azure Cosmos DB Account entry point window](./media/connected-service/connected-service-click-new-db-account.png)
2. On the **Create Cosmos DB Account** page, specify the configuration that you want for this Azure Cosmos DB account.

* Complete the fields on the **Create Cosmos DB Account** page, using information in the following screenshot as reference. 
 
   ![The new Azure Cosmos DB page](./media/connected-service/connected-service-create-new-account.png)        
3. Click **Create** to create the account.

## Use Data Explorer

After opening Data Explorer, we can Create and Delete database, Create, and Delete Collection. And Create and Delete documents, Filter Document, Create, and Delete Stored Procedure. We can also Create and Delete Triggers, Create, and Delete User-Defined Function to perform server-side business logic. For how to use Data Explorer, refers to [Azure Cosmos DB docs on Microsoft website](https://docs.microsoft.com/en-us/azure/cosmos-db/).

![The new Azure Cosmos DB page](./media/connected-service/connected-service-dataexplorerui.png)

## Demo

Use Azure Cosmos DB Connected Service in Visual Studio(video): [Use Azure Cosmos DB Connected Service in Visual Studio](https://go.microsoft.com/fwlink/?linkid=858711)

## Next Steps
In this document, you've learned following items:

> [!div class="checklist"]
> * Create an Azure Cosmos DB account
> * Add Connected Service and add account
> * Open Azure Cosmos DB Explorer
> * Use Data Explorer


* Develop with the DocumentDB API in .NET [Develop with the DocumentDB API in .NET](tutorial-develop-documentdb-dotnet.md).
* DocumentDB API getting started tutorial [Azure Cosmos DB: DocumentDB API getting started tutorial](documentdb-get-started.md).
* Want to perform scale and performance testing with Azure Cosmos DB? See [Performance and Scale Testing with Azure Cosmos DB](performance-testing.md).
* Learn how to [Monitor an Azure Cosmos DB account](monitor-accounts.md).
* To learn more about Azure Cosmos DB, see [Welcome to Azure Cosmos DB](introduction.md).



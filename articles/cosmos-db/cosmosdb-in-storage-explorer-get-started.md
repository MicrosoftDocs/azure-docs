---
title: 'Use Cosmos DB in Azure Storage Explorer'
description: Use Cosmos DB in Azure Storage Explorer.
services: Cosmos DB
documentationcenter: ''
author: t-jiajl
manager: omafnan
editor: 
tags: Cosmos DB

ms.assetid: 
ms.service: Cosmos DB
ms.custom: COSMOSDB active
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/11/2017
ms.author: t-jiajl

---
# Use Cosmos DB in Azure Storage Explorer

Cosmos DB is Microsoft’s globally distributed database service designed to enable developer to build planet scale applications. Cosmos DB allows you to quickly create and query document, key/value, and graph databases. 

Cosmos DB on Azure Storage Explorer allows users to manage Cosmos DB entities, manipulate data, update stored procedure/trigger along with other Azure entities like blob and queue. Now users can use the same tool to manage their different Azure entities in one place. In this release, Document DB and MongoDB are supported. We will enable graph / table support in the coming release. 

In this article, you'll learn how to use Storage Explorer (Preview) to work with Cosmos DB (Document DB API and Mongo API).


## Prerequisites

- Azure subscription. If you don't have, create a  [free Azure account](https://azure.microsoft.com/en-us/free/) first.
- Create your own Cosmos DB account on Azure portal, remember to choose “SQL (Document DB)” API or “Mongo” API, refer this: [Azure Cosmos DB: Build a DocumentDB API web app with .NET and the Azure portal](https://docs.microsoft.com/en-us/azure/cosmos-db/create-documentdb-dotnet).
- Install the newest Azure Storage Explorer bits. You can install it from [Here](https://go.microsoft.com/fwlink/?linkid=858559).



## Connect to Azure subscription

1. After installing the **Azure Storage Explorer**, click the third **plug-in** icon on the left, then choose **Add an Azure Account**.
       
   ![plug in icon](./media/cosmosdb-in-storage-explorer-get-started/plug-in-icon.png)

   ![connect to Azure subscription](./media/cosmosdb-in-storage-explorer-get-started/connect-to-azure-subscription.png)

2. In the **Azure Sign In** dialog box, select **Sign in**, and then enter your Azure credentials.

    ![sign in](./media/cosmosdb-in-storage-explorer-get-started/sign-in.png)

3. **Apply** your subscription, you can see all Azure Cosmos DB account and Storage account under the subscription you choose.

    ![apply](./media/cosmosdb-in-storage-explorer-get-started/apply-subscription.png)

    ![account list](./media/cosmosdb-in-storage-explorer-get-started/account-list.png)

    So far, you have successfully connected to your **Cosmos DB account** through Azure subscription.

## Connect to Cosmos DB by Connection String

1. Find **Local and Attached** in the left tree, right-click **Azure Cosmos DB Accounts**, choose **Connect to Cosmos DB...**

    ![connect to Cosmos DB by connection string](./media/cosmosdb-in-storage-explorer-get-started/connect-to-cosmosdb-by-connection-string.png)

2. Choose Cosmos DB API, paste your **Connection String**, click **OK** to connect Cosmos DB account.

    ![connection-string](./media/cosmosdb-in-storage-explorer-get-started/connection-string.png)

## Cosmos DB resource management

You can manage Cosmos DB account by doing following operations:
* Open in Portal, Add to Quick Access, Search, Refresh
* Database: create, delete
* Collection: create, delete
* Document: create, edit, delete and filter
* Stored Procedure: create, edit and delete
* Trigger: create, edit and delete
* User-Defined Functions: create, edit and delete
* Another scenario when user use partition key

### Open in Portal, Add to Quick Access, Search,  Refresh
1. Right-click a Cosmos DB account or a database, you can choose **Open in Portal** and manage the resource in browser on Azure portal.

     ![open in portal](./media/cosmosdb-in-storage-explorer-get-started/open-in-portal.png)

2. You can also add Cosmos DB account, Database, Collection to **Quick Access**.
3. **Search from Here** enables keywords search under the selected path.

    ![search from here](./media/cosmosdb-in-storage-explorer-get-started/search-from-here.png) 

### Database and Collection management

1. **Create Database**: Right-click the Cosmos DB account, choose **Create Database**, then appear a node to input the database name, **Enter** to complete.

    ![create database](./media/cosmosdb-in-storage-explorer-get-started/create-database.png) 
2. **Delete Database**: Right-click the database, click **Delete Database**, Click **Yes** on the pop-up window, the database node will be deleted and the Cosmos DB account refresh automatically.

    ![detele database1](./media/cosmosdb-in-storage-explorer-get-started/delete-database1.png)  
    ![delete database2](./media/cosmosdb-in-storage-explorer-get-started/delete-database2.png) 

3. **Create Collection**: Right-click your database, choose **Create Collection**, and then provide the following information like Collection ID, Storage capacity, etc. Click **OK** to finish. For partition key setting. refer this:  [Design for partitioning](https://docs.microsoft.com/en-us/azure/cosmos-db/partition-data#designing-for-partitioning).
If using partition key when create collection, once completing the creation, the partition key value can't be changed in documents, the Stored Procedure, Trigger, and UDF can't be changed once saved.
    ![create collection1](./media/cosmosdb-in-storage-explorer-get-started/create-collection.png)
    ![create collection2](./media/cosmosdb-in-storage-explorer-get-started/create-collection2.png) 
4. **Delete Collection**: Right-click the collection, click **Delete Collection**, Click **Yes** on the pop-up window, the collection node will be deleted and the database refresh automatically.

    ![delete collection](./media/cosmosdb-in-storage-explorer-get-started/delete-collection.png) 

### Documents management

1. Open **Documents** in the right window, click **New Document** to new a document, edit in the right pane, **Save** or **Discard** the document. You can also update the existing document, **Save** or **Discard** the change.

    ![document](./media/cosmosdb-in-storage-explorer-get-started/document.png)

2. Click the **Delete** button to delete the selected document.
3. Edit Document **Filter**, **Apply** the filter to choose the document you need like this:

    ![filter](./media/cosmosdb-in-storage-explorer-get-started/filter.png)

### Stored Procedure, Trigger, and UDF
1. **Stored Procedure**: In the left tree, right-click **Stored Procedure**, choose **Create Stored Procedure**, enter name in the left, type the stored procedure scripts in the right window, click **Create** button to complete. 

    You can also edit existing stored procedure through double-click, click **Update** to save or **Discard** to cancel the change.

    ![stored procedure](./media/cosmosdb-in-storage-explorer-get-started/stored-procedure.png)

2. The operations for **Triggers** and **UDF** are very similar to **Stored Procedure**.

## <a name="seealso"></a>See also
* [Get started with Storage Explorer (Preview)](https://docs.microsoft.com/en-us/azure/vs-azure-tools-storage-manage-with-storage-explorer)

### Demo
* Use Cosmos DB in Azure Storage Explorer (video): [Use Cosmos DB in Azure Storage Explorer](https://go.microsoft.com/fwlink/?linkid=858559)
* Storage Explorer Overview (video): [Storage Explorer Overview](https://azure.microsoft.com/en-us/resources/videos/storage-explorer-overview/)


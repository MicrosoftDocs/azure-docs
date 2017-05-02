---
title: Connect Azure Cosmos DB to Xamarin using .NET (C#) | Microsoft Docs
description: Presents a .NET code sample you can use to connect to and query Azure Cosmos DB
services: documentdb
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: documentdb
ms.custom: quick start connect
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 04/14/2017
ms.author: mimig

---
# Azure Cosmos DB: Connect to Xamarin using .NET

This quick start demonstrates how to use [Xamarin](https://www.xamarin.com/), the [DocumentDB .NET API](documentdb-sdk-dotnet-core.md) for Azure Cosmos DB, and the Azure portal to create an Azure Cosmos DB account and use DocumentDB's built-in authorization engine to implement per-user data pattern for a Xamarin mobile app. It is a simple multi-user ToDo list app allowing users to login using Facebook Auth and manage their to do items.

If you don’t already have Visual Studio 2017 installed, you can download and use the **free** [Visual Studio 2017 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create a database account

[!INCLUDE [documentdb-create-dbaccount](../../includes/documentdb-create-dbaccount.md)]

## Add a collection

You can now use Data Explorer to create a collection. 

1. In the Azure portal, in the navigation menu, under **Collections**, click **Data Explorer (Preview)**. 
2. In the Data Explorer blade, click **New Collection**, then fill in the page using the following information.
    * In the **Database id** box, enter *Items* as ID for your new database. Database names must be between 1 and 255 characters, and cannot contain `/ \ # ?` or a trailing space.
    * In the **Collection id** box, enter *UserItems* as the ID for your new collection. Collection names have the same character requirements as database IDs.
    * In the **Storage Capacity** box, leave the default 10 GB selected.
    * In the **Throughput** box, leave the default 400 RUs selected. You can scale up the throughput later if you want to reduce latency.
    * In the **Partition key** box, enter the value */userid*, so that tasks in the todo app you create can be partitioned by category. Selecting the correct partition key is important in creating a performant collection, read more about it in [Designing for partitioning](documentdb-partition-data.md#designing-for-partitioning).

   ![Data Explorer in the Azure portal](./media/documentdb-connect-xamarin-dotnet/azure-documentdb-data-explorer.png)

3. Once the form is filled out, click **OK**.

## Clone the sample application

Now let's clone a DocumentDB API app from github, set the connection string, and run it. You'll see how easy it is to work with data programmatically. 

1. Open a git terminal window, such as git bash, and `CD` to a working directory.  

2. Run the following command to clone the sample repository. 

    ```bash
    git clone https://github.com/Azure/azure-documentdb-dotnet.git
    ```

3. Then open the azure-documentdb-dotnet/samples/xamarin/UserItems/ResourceTokenBroker/ResourceTokenBroker.sln file in Visual Studio. 

## Review the code

The code in the Xamarin folder contains:

* Xamarin app. The app stores user's todo items in a DocumentDB partitioned collection UserItems.
* Resource Token Broker API, a simple ASP.NET Web API to broker DocumentDB resource tokens to the logged in users of the app. Resource tokens are short-lived access tokens that provide the app with the access to the logged in user's data.

The authentication and data flow is illustrated in the diagram below.

* The DocumentDB UserItems collection is created with partition key '/userid'. Specifying partition key for collection allows DocumentDB to scale infinitely as the number of users and items grows.
* The Xamarin app allows users to login with Facebook credentials.
* The Xamarin app uses Facebook access token to authenticate with ResourceTokenBroker API
* The resource token broker API authenticates the request using App Service Auth feature, and requests a DocumentDB resoure token with read/write access to all documents sharing the authenticated user's partition key.
* Resource Token Broker returns the resource token to the client app.
* The app accesses the user's todo items using the resource token.

![Todo app with sample data](./media/documentdb-connect-xamarin-dotnet/tokenbroker.png)
    
## Update your connection string

Now go back to the Azure portal to get your connection string information and copy it into the app.

1. In the [Azure portal](http://portal.azure.com/), in your Azure Cosmos DB account, in the left navigation click **Keys**. You'll use the copy buttons on the right side of the screen to copy the URI and Primary Key into the web.config file in the next step.

    ![View and copy an access key in the Azure Portal, Keys blade](./media/documentdb-connect-dotnet-core/keys.png)

2. In Visual Studio 2017, open the web.config file. 

3. Copy your URI value from the portal (using the copy button) and make it the value of the accountUrl in web.config. 

    `<add key="accountUrl" value="{DocumentDB account URL}"/>`

4. Then copy your PRIMARY KEY value from the portal and make it the value of the accountKey in [web.congif](https://github.com/Azure/azure-documentdb-dotnet/blob/master/samples/xamarin/UserItems/ResourceTokenBroker/ResourceTokenBroker/Web.config). 

    `<add key="accountKey" value="{DocumentDB secret}"/>`

You've now updated your app with all the info it needs to communicate with Azure Cosmos DB. 

## Build and deploy the web app

1. In the Azure portal, create an App Service website to host the Resource Token Broker API.
2. In the Azure portal, open the App Settings blade of the Resource Token Broker API website. Fill in the following app settings:

    * accountUrl - the DocumentDB account URL from the Keys tab of your DocumentDB account.
    * accountKey - the DocumentDB account master key from the Keys tab of your DocumentDB account.
    * databaseId and collectionId of your created database and collection

3. Publish the ResourceTokenBroker solution to your created website.

4. Open the Xamarin project, and navigate to TodoItemManager.cs. Fill in the values for accountURL, collectionId, databaseId, as well as resourceTokenBrokerURL as the base https url for the resource token broker website.

5. Complete the [How to configure your App Service application to use Facebook login](../app-service-mobile/app-service-mobile-how-to-configure-facebook-authentication.md) tutorial to setup Facebook authentication and configure the ResourceTokenBroker website.

    Run the Xamarin app.

## Review metrics in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmosdb-tutorial-review-slas.md)]

## Next steps

If you're not going to continue to use this app and Azure Cosmos DB, use the following steps to delete all resources created by this quick start in the Azure portal. If you plan to continue on to work with subsequent quick starts, do not clean up the resources created in this quick start. 

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you just created. 
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

To learn more about the Azure Comsos DB DocumentDB API, see [What is the DocumentDB API?(documentdb-introduction). To learn more about the SQL query language which you can use in the Azure portal and programmatically, see [SQL](documentdb-sql-query.md).

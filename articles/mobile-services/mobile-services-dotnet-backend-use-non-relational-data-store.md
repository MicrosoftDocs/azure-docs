<properties 
	pageTitle="Build a Service Using a Non-Relational Data Store | Azure Mobile Services" 
	description="Learn how to use a non-relational data store such as MongoDB or Azure Table Storage with your .NET based mobile service" 
	services="mobile-services" 
	documentationCenter="" 
	authors="mattchenderson" 
	manager="dwrede" 
	editor="mollybos"/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="04/24/2015" 
	ms.author="mahender"/>

# Build a .NET backend Mobile Service that uses MongoDB instead of a SQL Database for storage

This topic shows you how to use a non-relational data store for your .NET backend mobile service. In this tutorial, you will modify the Mobile Services quickstart project to use MongoDB instead of the default Azure SQL Database data store.

The tutorial requires completion of the [Get started with Mobile Services] or [Add Mobile Services to an existing app] tutorial. You will also need to add the MongoLab service to your subscription. 

## <a name="create-store"></a>Create the MongoLab non-relational store

1. In the [Azure Management Portal], click **New** and click **Marketplace**.

2. Click the **MongoLab** add-on, and complete the wizard to sign up for a MongoLab account. 

	For more information about MongoLab, see the [MongoLab Add-on Page].

2. Once the account is set up, click **Connection Info** and copy the connection string.

3. In your mobile service, click the **Configure** tab, scroll down to **Connection strings** and enter a new connection string with a **Name** of `MongoConnectionString` and a **Value** that is your MongoDB connection, then click **Save**. 

	![Add the MongoDB connection string](./media/mobile-services-dotnet-backend-use-non-relational-data-store/mongo-connection-string.png)

	The storage account connection string is stored encrypted in app settings. You can access this string in any table controller at runtime. 

8. In Solution Explorer in Visual Studio, open the Web.config file for the mobile service project and add the following new connection string:

		<add name="MongoConnectionString" connectionString="<MONGODB_CONNECTION_STRING>" />

9. Replace the `<MONGODB_CONNECTION_STRING>` placeholder with the MongoDB connection string.

	The mobile service uses this connection string when it runs on your local computer, which lets you test the code before you publish it. When running in Azure, the mobile service instead uses the connection string value set in the portal and ignores the connection string in the project.  

## <a name="modify-service"></a>Modify data types and table controllers

1. Install the **WindowsAzure.MobileServices.Backend.Mongo** NuGet package.

2. Modify **TodoItem** to derive from **DocumentData** instead of **EntityData**.

        public class TodoItem : DocumentData
        {
            public string Text { get; set; }

            public bool Complete { get; set; }
        }

3. In **TodoItemController**, replace the **Initialize** method with the following:

        protected override async void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            string connectionStringName = "MongoConnectionString";
            string databaseName = "<YOUR-DATABASE-NAME>";
            string collectionName = "todoItems";
            DomainManager = new MongoDomainManager<TodoItem>(connectionStringName, databaseName, 
				collectionName, Request, Services);
        }

4. In the code for the **Initialize** method above, replace `<YOUR-DATABASE-NAME>` with the name you chose when you provisioned the MongoLab add-on.

You are now ready to test the app.

## <a name="test-application"></a>Test the application

1. (Optional) Republish your mobile service .NET backend project.

	You can also test your mobile service locally before you publish the .NET backend project to Azure. Whether you test locally or in Azure, the mobile service will be using your MongoDB for storage. 

4. Using either the **Try it now** button on the start page as before or using a client app connected to your Mobile App, query items in the database. 	
 
	Note that you will not see any items which were previously stored in the SQL database from the quickstart tutorial.

	>[AZURE.NOTE]When you use the **Try it now** button to launch the Help API pages, remember to supply your application key as the password (with a blank username).

3. Create a new item. 

	The app and mobile service should behave as before, except now your data is being stored in your non-relational store instead of in the SQL Database.

##Next Steps

Now that you have seen how easy it is to use Table storage with .NET backend, consider exploring some other backend storage options:

+ [Build a .NET backend Mobile Service that uses Table storage instead of a SQL Database](mobile-services-dotnet-backend-store-data-table-storage.md)</br>Like the tutorial you just completed, this topic shows you how to use a non-relational data store for your mobile service. In this tutorial, you will modify the Mobile Services quickstart project to use Azure Storage instead of a SQL Database as the data store.
 
+ [Connect to an on-premises SQL Server using Hybrid Connections](mobile-services-dotnet-backend-hybrid-connections-get-started.md)</br>Hybrid Connections lets your mobile service securely connect to your on-premises assets. In this way, you can make your on-premises data accessible to your mobile clients by using Azure. Supported assets include any resource that runs on a static TCP port, including Microsoft SQL Server, MySQL, HTTP Web APIs, and most custom web services.

+ [Upload images to Azure Storage using Mobile Services](mobile-services-dotnet-backend-windows-store-dotnet-upload-data-blob-storage.md)</br>Shows you how to extend the TodoList sample project to let you upload images from your app to Azure Blob storage.


<!-- Anchors. -->
[Create a non-relational store]: #create-store
[Modify data and controllers]: #modify-service
[Test the application]: #test-application


<!-- Images. -->
[0]: ./media/mobile-services-dotnet-backend-use-non-relational-data-store/create-mongo-lab.png
[1]: ./media/mobile-services-dotnet-backend-use-non-relational-data-store/mongo-connection-string.png


<!-- URLs. -->
[Get started with Mobile Services]: mobile-services-dotnet-backend-windows-store-dotnet-get-started.md
[Add Mobile Services to an existing app]: ../mobile-services-dotnet-backend-windows-store-dotnet-get-started-data.md
[Azure Management Portal]: https://manage.windowsazure.com/
[What is the Table Service]: ../storage-dotnet-how-to-use-tables.md#what-is
[MongoLab Add-on Page]: /gallery/store/mongolab/mongolab
 
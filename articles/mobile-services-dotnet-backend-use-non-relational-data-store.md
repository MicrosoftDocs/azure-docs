<properties 
	pageTitle="Build a Service Using a Non-Relational Data Store - Azure Mobile Services" 
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

3. In Mobile Services in the [Azure Management Portal], click your mobile service then click the **Configure** tab.

4. Under **App Settings**, paste the connection string with the key `MongoConnectionString`, and click **Save**.

    ![][1]

	This ensures that the connection string is stored securely by Mobile Services and can be accessed by your mobile service when running in Azure.

## <a name="modify-service"></a>Modify data types and table controllers

1. Install the **WindowsAzure.MobileServices.Backend.Mongo** NuGet package.

2. Modify **TodoItem** to derive from **DocumentData** instead of **EntityData**.

        public class TodoItem : DocumentData
        {
            public string Text { get; set; }

            public bool Complete { get; set; }
        }


2. In the **TodoItemController** class, add the following code:

        static bool connectionStringInitialized = false;

        private void InitializeConnectionString(string connectionStringName)
        {
            if (!connectionStringInitialized)
            {
                connectionStringInitialized = true;
                if (!this.Services.Settings.Connections.ContainsKey(connectionStringName))
                {
                    var connectionString = this.Services.Settings[connectionStringName];
                    var connectionSetting = new ConnectionSettings(connectionStringName, connectionString);
                    this.Services.Settings.Connections.Add(connectionStringName, connectionSetting);
                }
            }
        }
    
    This code loads the application setting and tells the mobile service to treat it as a connection that can be used by a **TableController&lt;TEntity&gt;**. Later, you will call this method when when the **TodoItemController** is invoked.

3. In **TodoItemController**, replace the **Initialize** method with the following:

        protected override async void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            string connectionStringName = "MongoConnectionString";
            string databaseName = "<YOUR-DATABASE-NAME>";
            string collectionName = "todoItems";
            InitializeConnectionString(connectionStringName);
            DomainManager = new MongoDomainManager<TodoItem>(connectionStringName, databaseName, 
				collectionName, Request, Services);
        }

4. In the code for the **Initialize** method above, replace `<YOUR-DATABASE-NAME>` with the name you chose when you provisioned the MongoLab add-on.

You are now ready to test the app.

## <a name="test-application"></a>Test the application

1. Republish your mobile service .NET backend project.

4. Using either the **Try it now** button on the start page as before or using a client app connected to your Mobile App, invoke some operations that generate database changes. 	
 
	Note that you will not see any items which were previously stored in the SQL database from the quickstart tutorial.

	>[AZURE.NOTE]When you use the **Try it now** button to launch the Help API pages, remember to supply your application key as the password (with a blank username).

3. Create a new item. 

	The app and mobile service should behave as before, except now your data is being stored in your non-relational store instead of in the SQL Database.


<!-- Anchors. -->
[Create a non-relational store]: #create-store
[Modify data and controllers]: #modify-service
[Test the application]: #test-application


<!-- Images. -->
[0]: ./media/mobile-services-dotnet-backend-use-non-relational-data-store/create-mongo-lab.png
[1]: ./media/mobile-services-dotnet-backend-use-non-relational-data-store/mongo-connection-string.png


<!-- URLs. -->
[Get started with Mobile Services]: mobile-services-dotnet-backend-windows-store-dotnet-get-started.md
[Add Mobile Services to an existing app]: mobile-services-dotnet-backend-windows-store-dotnet-get-started-data.md
[Azure Management Portal]: https://manage.windowsazure.com/
[What is the Table Service]: storage-dotnet-how-to-use-tables.md#what-is
[MongoLab Add-on Page]: /gallery/store/mongolab/mongolab

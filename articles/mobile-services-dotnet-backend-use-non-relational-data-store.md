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

# Build a Service Using MongoDB as a Data Store with the .NET Backend

This topic shows you how to use a non-relational data store for your mobile service. In this tutorial, you will modify the Mobile Services quickstart project to use MongoDB instead of SQL as a data store.

This tutorial walks you through these steps to set up a non-relational store:

1. [Create a non-relational store]
2. [Modify data and controllers]
3. [Test the application]

The tutorial requires completion of the [Get started with Mobile Services] or [Get Started with Data] tutorial.

## <a name="create-store"></a>Create a non-relational store

1. In the [Azure Management Portal], click **New** and select **Store**.

2. Select the **MongoLab** add-on, and navigate through the wizard to sign up for an account. For more about MongoLab, see the [MongoLab Add-on Page].

    ![][0]

2. Once the account is set up, select **Connection Info** and copy out the connection string.

3. Navigate to the Mobile Services section of the portal and select the **Configure** tab.

4. Under **App Settings**, enter your connection string with the key "MongoConnectionString", and click **Save**.

    ![][1]

2. Add the following to `TodoItemController`:

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
    
    This code will load the application setting and tell the mobile service to treat it as a connection that can be used by a `TableController`. Later, you will call this method when when the `TodoItemController` is invoked.



## <a name="modify-service"></a>Modify data and controllers

1. Install the **WindowsAzure.MobileServices.Backend.Mongo** NuGet package.

2. Modify `TodoItem` to derive from `DocumentData` instead of `EntityData`.

        public class TodoItem : DocumentData
        {
            public string Text { get; set; }

            public bool Complete { get; set; }
        }

3. In `TodoItemController`, replace the `Initialize` method with the following:

        protected override async void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            string connectionStringName = "MongoConnectionString";
            string databaseName = "<YOUR-DATABASE-NAME>";
            string collectionName = "todoItems";
            InitializeConnectionString(connectionStringName);
            DomainManager = new MongoDomainManager<TodoItem>(connectionStringName, databaseName, collectionName, Request, Services);
        }

4. In the code for the `Initialize` method above, replace **YOUR-DATABASE-NAME** with the name you chose when you provisioned the MongoLab add-on.


## <a name="test-application"></a>Test the application

1. Republish your mobile service backend project.

2. Run your client application. Note that you will not see any items which were previously stored in the SQL database from the quickstart tutorial.

3. Create a new item. The app should behave as before, except now your data will be going to your non-relational store.


<!-- Anchors. -->
[Create a non-relational store]: #create-store
[Modify data and controllers]: #modify-service
[Test the application]: #test-application


<!-- Images. -->
[0]: ./media/mobile-services-dotnet-backend-use-non-relational-data-store/create-mongo-lab.png
[1]: ./media/mobile-services-dotnet-backend-use-non-relational-data-store/mongo-connection-string.png


<!-- URLs. -->
[Get started with Mobile Services]: mobile-services-dotnet-backend-windows-store-dotnet-get-started.md
[Get Started with Data]: mobile-services-dotnet-backend-windows-store-dotnet-get-started-data.md
[Azure Management Portal]: https://manage.windowsazure.com/
[What is the Table Service]: storage-dotnet-how-to-use-tables.md#what-is
[MongoLab Add-on Page]: /gallery/store/mongolab/mongolab

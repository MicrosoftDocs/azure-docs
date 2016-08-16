<properties 
	pageTitle="DocumentDB for MongoDB examples | Microsoft Azure" 
	description="Find examples for DocumentDB's protocol support for MongoDB." 
	keywords="mongodb examples"
	services="documentdb" 
	authors="stephbaron" 
	manager="jhubbard" 
	editor="" 
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/31/2016" 
	ms.author="stbaro"/>

# DocumentDB protocol support for MongoDB examples
To use these examples, you must:

- [Create](documentdb-create-mongodb-account.md) an Azure DocumentDB account with protocol support for MongoDB.
- Retrieve your DocumentDB account with protocol support for MongoDB [connection string](documentdb-connect-mongodb-account.md) information.

## Get started with a sample ASP.NET MVC task list application

You can use the [Create a web app in Azure that connects to MongoDB running on a virtual machine](../app-service-web/web-sites-dotnet-store-data-mongodb-vm.md) tutorial, with minimal modification, to quickly setup a MongoDB application (either locally or published to an Azure web app) that connects to a DocumentDB account with protocol support for MongoDB.  

1. Follow the tutorial, with one modification.  Replace the Dal.cs code with this:
	
		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Web;
		using MyTaskListApp.Models;
		using MongoDB.Driver;
		using MongoDB.Bson;
		using System.Configuration;
		using System.Security.Authentication;

		namespace MyTaskListApp
		{
		    public class Dal : IDisposable
	    	{
        		//private MongoServer mongoServer = null;
        		private bool disposed = false;

		        // To do: update the connection string with the DNS name
        		// or IP address of your server. 
        		//For example, "mongodb://testlinux.cloudapp.net
        		private string connectionString = "mongodb://localhost:27017";
        		private string userName = "<your user name>";
        		private string host = "<your host>";
        		private string password = "<your password>";

        		// This sample uses a database named "Tasks" and a 
        		//collection named "TasksList".  The database and collection 
        		//will be automatically created if they don't already exist.
        		private string dbName = "Tasks";
        		private string collectionName = "TasksList";

        		// Default constructor.        
        		public Dal()
		        {
		        }

        		// Gets all Task items from the MongoDB server.        
		        public List<MyTask> GetAllTasks()
		        {
            		try
            		{
                		var collection = GetTasksCollection();
                		return collection.Find(new BsonDocument()).ToList();
            		}
            		catch (MongoConnectionException)
            		{
                		return new List<MyTask>();
            		}
        		}

        		// Creates a Task and inserts it into the collection in MongoDB.
        		public void CreateTask(MyTask task)
        		{
            		var collection = GetTasksCollectionForEdit();
            		try
            		{
                		collection.InsertOne(task);
            		}
            		catch (MongoCommandException ex)
            		{
                		string msg = ex.Message;
            		}
        		}
		
		        private IMongoCollection<MyTask> GetTasksCollection()
		        {
            		MongoClientSettings settings = new MongoClientSettings();
            		settings.Server = new MongoServerAddress(host, 10250);
            		settings.UseSsl = true;
            		settings.SslSettings = new SslSettings();
            		settings.SslSettings.EnabledSslProtocols = SslProtocols.Tls12;
		
            		MongoIdentity identity = new MongoInternalIdentity(dbName, userName);
            		MongoIdentityEvidence evidence = new PasswordEvidence(password);
		
            		settings.Credentials = new List<MongoCredential>()
            		{
                		new MongoCredential("SCRAM-SHA-1", identity, evidence)
            		};

            		MongoClient client = new MongoClient(settings);
            		var database = client.GetDatabase(dbName);
            		var todoTaskCollection = database.GetCollection<MyTask>(collectionName);
            		return todoTaskCollection;
        		}
		
		        private IMongoCollection<MyTask> GetTasksCollectionForEdit()
		        {
            		MongoClientSettings settings = new MongoClientSettings();
            		settings.Server = new MongoServerAddress(host, 10250);
            		settings.UseSsl = true;
            		settings.SslSettings = new SslSettings();
            		settings.SslSettings.EnabledSslProtocols = SslProtocols.Tls12;
		
            		MongoIdentity identity = new MongoInternalIdentity(dbName, userName);
            		MongoIdentityEvidence evidence = new PasswordEvidence(password);
		
            		settings.Credentials = new List<MongoCredential>()
            		{
                		new MongoCredential("SCRAM-SHA-1", identity, evidence)
            		};
            		MongoClient client = new MongoClient(settings);
            		var database = client.GetDatabase(dbName);
            		var todoTaskCollection = database.GetCollection<MyTask>(collectionName);
            		return todoTaskCollection;
        		}

        		# region IDisposable
		
		        public void Dispose()
		        {
            		this.Dispose(true);
            		GC.SuppressFinalize(this);
        		}

        		protected virtual void Dispose(bool disposing)
        		{
            		if (!this.disposed)
            		{
                		if (disposing)
                		{
                		}
            		}

            		this.disposed = true;
        		}

        		# endregion
    		}
		}

2.	Modify the following variables in the Dal.cs file per your account settings:

        private string userName = "<your user name>";
    	private string host = "<your host>";
        private string password = "<your password>";

3. Use the app!

## Next steps

- Read about the DocumentDB with protocol support for MongoDB [preview development guidelines](documentdb-mongodb-guidelines.md).
- Learn how to [use MongoChef](documentdb-mongodb-mongochef.md) with a DocumentDB account with protocol support for MongoDB.

 

<properties 
	pageTitle="Get started with the DocumentDB .NET SDK | Azure" 
	description="Learn how to create and configure an Azure DocumentDB account, create databases, create collections, and store JSON documents within your NoSQL document database account." 
	services="documentdb" 
	documentationCenter=".net" 
	authors="AndrewHoh" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="hero-article" 
	ms.date="04/29/2015" 
	ms.author="anhoh"/>

#Get started with the DocumentDB .NET SDK  

This tutorial shows you how to get started using [Microsoft Azure DocumentDB](https://azure.microsoft.com/services/documentdb/) and the [DocumentDB .NET SDK](https://www.nuget.org/packages/Microsoft.Azure.DocumentDB/). You'll build a console application that creates and queries DocumentDB resources, and writes the output to the console window. 

DocumentDB is a NoSQL document database service, which has a [number of APIs and SDKs available](https://msdn.microsoft.com/library/dn781482.aspx). The code in this article is written in C# and uses the DocumentDB .NET SDK, which is packaged and distributed as a NuGet package. 

The following scenarios are covered in this article:

- Creating and connecting to a DocumentDB account
- Adding DocumentDB to your Visual Studio solution
- Creating databases
- Creating collections
- Creating JSON documents
- Querying resources 
- Deleting databases 

Don't have time to complete the tutorial and just want to get the working solution? No worries. The complete solution is available on [GitHub](https://github.com/Azure/azure-documentdb-net/tree/master/tutorials/get-started). See [Get the complete solution](#GetSolution) for quick instructions.

## Prerequisites

Before following the instructions in this article, you should ensure that you have the following:

- An active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).
- [Visual Studio 2013](http://www.visualstudio.com/) Update 4 or higher.

## Step 1: Create a DocumentDB account

Lets get started by creating a DocumentDB account. If you already have an account, you can skip to [Setup your Visual Studio Solution](#SetupVS).

[AZURE.INCLUDE [documentdb-create-dbaccount](../includes/documentdb-create-dbaccount.md)]

##<a id="SetupVS"></a> Step 2: Setup your Visual Studio Solution

1. Open **Visual Studio** on your computer.
2. Select **New** from the **File** menu, and choose **Project**.
3. In the **New Project Dialog**, select **Templates** / **Visual C#** / **Console Application**, name your project, and then click **Add**.
4. In the **Solution Explorer**, right click on your new console application, which is under your Visual Studio solution.
5. Then without leaving the menu, click on **Manage NuGet Packages...**
6. On the left most panel of the **Manage NuGet Packages** window, click **Online** / **nuget.org**.
7. In the **Search Online** input box, search for **DocumentDB Client Library**.
8. Within the results, find **Microsoft Azure DocumentDB Client Library** and click **Install**.

Great! You are now ready to start working with DocumentDB.

##<a id="Connect"></a> Step 3: Connect to a DocumentDB account

We'll start by creating a new instance of the [DocumentClient](https://msdn.microsoft.com/library/microsoft.azure.documents.client.documentclient.aspx) class in order to establish a connection to our DocumentDB account.   We'll need the following references at the beginning of our C# application:  

    using Microsoft.Azure.Documents;
    using Microsoft.Azure.Documents.Client;
    using Microsoft.Azure.Documents.Linq;
    using Newtonsoft.Json;
 
Next, a **DocumentClient** can be instantiated using the DocumentDB account endpoint and either the primary or secondary access key associated with the account. Add these properties to your class.

    private static string EndpointUrl = "<your endpoint URI>";
    private static string AuthorizationKey = "<your key>";

Let's now create a new asynchronous task called **GetStartedDemo** in your class. Within this new task, create and set up your **DocumentClient**.

	private static async Task GetStartedDemo()
    {
		// Create a new instance of the DocumentClient.
    	var client = new DocumentClient(new Uri(EndpointUrl), AuthorizationKey); 
	}

Call your asynchronous task from your Main method similar to the code below.

	public static void Main(string[] args)
    {
		try
    	{
        	GetStartedDemo().Wait();
		}
		catch (Exception e)
		{
			Exception baseException = e.GetBaseException();
			Console.WriteLine("Error: {0}, Message: {1}", e.Message, baseException.Message);
		}
	}

> [AZURE.WARNING] Never store credentials in source code. To keep this sample simple, the credentials are shown in the source code. See [Azure Web Sites: How Application Strings and Connection Strings Work](https://azure.microsoft.com/blog/2013/07/17/windows-azure-web-sites-how-application-strings-and-connection-strings-work/) for information on how to store credentials in a production environment. Take a look at our sample application on [GitHub](https://github.com/Azure/azure-documentdb-net/blob/master/tutorials/get-started/src/Program.cs) for an example on storing credentials outside of the source code.

The values for EndpointUrl and AuthorizationKey are the URI and PRIMARY KEY for your DocumentDB account, which can be obtained from the [Keys](https://portal.azure.com) blade for your DocumentDB account. 

![Screen shot of the Azure Preview portal, showing a DocumentDB account, with the ACTIVE hub highlighted, the KEYS button highlighted on the DocumentDB account blade, and the URI, PRIMARY KEY and SECONDARY KEY values highlighted on the Keys blade][keys]
 
These keys grant administrative access to your DocumentDB account and the resources in it. DocumentDB also supports the use of resource keys that allow clients to read, write, and delete resources in the DocumentDB account according to the permissions you've granted, without the need for an account key. For more information about resource keys, see [Permissions](documentdb-resources.md#permissions) and [View, copy, and regenerate access keys](documentdb-manage-account.md#keys).

Now that you know how to connect to a DocumentDB account and create an instance of the **DocumentClient** class, let's take a look at working with DocumentDB resources.  

## Step 4: Create a database
A [database](documentdb-resources.md#databases) can be created by using the [CreateDatabaseAsync](https://msdn.microsoft.com/library/microsoft.azure.documents.client.documentclient.createdatabaseasync.aspx) method of the **DocumentClient** class. A database is the logical container of document storage partitioned across collections. Create your new database in your **GetStartedDemo** method after your **DocumentClient** creation.

	// Create a database.
	Database database = await client.CreateDatabaseAsync(
		new Database
		    {
			    Id = "FamilyRegistry"
		    });

##<a id="CreateColl"></a>Step 5: Create a collection  

> [AZURE.WARNING] **CreateDocumentCollectionAsync** will create a new S1 collection, which has pricing implications. For more details, please visit our [pricing page](https://azure.microsoft.com/pricing/details/documentdb/).

A [collection](documentdb-resources.md#collections) can be created by using the [CreateDocumentCollectionAsync](https://msdn.microsoft.com/library/microsoft.azure.documents.client.documentclient.createdocumentcollectionasync.aspx) method of the **DocumentClient** class. A collection is a container of JSON documents and associated JavaScript application logic. The newly created collection will be mapped to a [S1 performance level](documentdb-performance-levels.md). The database created in the previous step has a number of properties, one of which is the [CollectionsLink](https://msdn.microsoft.com/library/microsoft.azure.documents.database.collectionslink.aspx) property.  With that information, we can now create a collection after our database creation.

  	// Create a document collection.
  	DocumentCollection documentCollection = await client.CreateDocumentCollectionAsync(database.CollectionsLink,
  		new DocumentCollection
  		    {
  			    Id = "FamilyCollection"
  		    });
    
##<a id="CreateDoc"></a>Step 6: Create documents
A [document](documentdb-resources.md#documents) can be created by using the [CreateDocumentAsync](https://msdn.microsoft.com/library/microsoft.azure.documents.client.documentclient.createdocumentasync.aspx) method of the **DocumentClient** class. Documents are user defined (arbitrary) JSON content. The collection created in the previous step has a number of properties, one of which is the [DocumentsLink](https://msdn.microsoft.com/library/microsoft.azure.documents.documentcollection.documentslink.aspx) property.  With that information, we can now insert one or more documents. 

First, we need to create a **Parent**, **Child**, **Pet**, **Address** and **Family** class. Create these classes by adding the following internal sub-classes. 

    internal sealed class Parent
    {
        public string FamilyName { get; set; }
        public string FirstName { get; set; }
    }

    internal sealed class Child
    {
        public string FamilyName { get; set; }
        public string FirstName { get; set; }
        public string Gender { get; set; }
        public int Grade { get; set; }
        public Pet[] Pets { get; set; }
    }

    internal sealed class Pet
    {
        public string GivenName { get; set; }
    }

    internal sealed class Address
    {
        public string State { get; set; }
        public string County { get; set; }
        public string City { get; set; }
    }

    internal sealed class Family
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        public string LastName { get; set; }
        public Parent[] Parents { get; set; }
        public Child[] Children { get; set; }
        public Address Address { get; set; }
        public bool IsRegistered { get; set; }
    }

Next, create your documents within your **GetStartedDemo** async method.

    // Create the Andersen family document.
	Family AndersenFamily = new Family
    {
        Id = "AndersenFamily",
        LastName = "Andersen",
        Parents =  new Parent[] {
            new Parent { FirstName = "Thomas" },
            new Parent { FirstName = "Mary Kay"}
        },
        Children = new Child[] {
            new Child { 
                FirstName = "Henriette Thaulow", 
                Gender = "female", 
                Grade = 5, 
                Pets = new Pet[] {
                    new Pet { GivenName = "Fluffy" } 
                }
            } 
        },
        Address = new Address { State = "WA", County = "King", City = "Seattle" },
        IsRegistered = true
    };

    await client.CreateDocumentAsync(documentCollection.DocumentsLink, AndersenFamily);
    
    // Create the WakeField family document.
    Family WakefieldFamily = new Family
    {
        Id = "WakefieldFamily",
        Parents = new Parent[] {
            new Parent { FamilyName= "Wakefield", FirstName= "Robin" },
            new Parent { FamilyName= "Miller", FirstName= "Ben" }
        },
        Children = new Child[] {
            new Child {
                FamilyName= "Merriam", 
                FirstName= "Jesse", 
                Gender= "female", 
                Grade= 8,
                Pets= new Pet[] {
                    new Pet { GivenName= "Goofy" },
                    new Pet { GivenName= "Shadow" }
                }
            },
            new Child {
                FamilyName= "Miller", 
                FirstName= "Lisa", 
                Gender= "female", 
                Grade= 1
            }
        },
        Address = new Address { State = "NY", County = "Manhattan", City = "NY" },
        IsRegistered = false
    };

    await client.CreateDocumentAsync(documentCollection.DocumentsLink, WakefieldFamily);
 
You have now created the following database, collection, and documents in your DocumentDB account.

![Diagram illustrating the hierarchical relationship between the account, the database, the collection, and the documents](./media/documentdb-get-started/account-database.png)

##<a id="Query"></a>Step 7: Query DocumentDB resources

DocumentDB supports rich [queries](documentdb-sql-query.md) against JSON documents stored in each collection.  The following sample code shows various queries - using both DocumentDB SQL syntax as well as LINQ - that we can run against the documents we inserted in the previous step. Add these queries to your **GetStartedDemo** async method.

    // Query the documents using DocumentDB SQL for the Andersen family.
    var families = client.CreateDocumentQuery(documentCollection.DocumentsLink,
        "SELECT * " +
        "FROM Families f " +
        "WHERE f.id = \"AndersenFamily\"");

    foreach (var family in families)
    {
        Console.WriteLine("\tRead {0} from SQL", family);
    }

    // Query the documents using LINQ for the Andersen family.
    families =
        from f in client.CreateDocumentQuery(documentCollection.DocumentsLink)
        where f.Id == "AndersenFamily"
        select f;

    foreach (var family in families)
    {
        Console.WriteLine("\tRead {0} from LINQ", family);
    }

    // Query the documents using LINQ lambdas for the Andersen family.
    families = client.CreateDocumentQuery(documentCollection.DocumentsLink)
        .Where(f => f.Id == "AndersenFamily")
        .Select(f => f);

    foreach (var family in families)
    {
        Console.WriteLine("\tRead {0} from LINQ query", family);
    }

    // Query the documents using DocumentSQL with one join.
    var items = client.CreateDocumentQuery<dynamic>(documentCollection.DocumentsLink,
        "SELECT f.id, c.FirstName AS child " +
        "FROM Families f " +
        "JOIN c IN f.Children");

    foreach (var item in items.ToList())
    {
        Console.WriteLine(item);
    }

    // Query the documents using LINQ with one join.
    items = client.CreateDocumentQuery<Family>(documentCollection.DocumentsLink)
        .SelectMany(family => family.Children
            .Select(children => new
            {
                family = family.Id,
                child = children.FirstName
            }));

    foreach (var item in items.ToList())
    {
        Console.WriteLine(item);
    }

The following diagram illustrates how the DocumentDB SQL query syntax is called against the collection you created, and the same logic applies to the LINQ query as well.

![Diagram illustrating the scope and meaning of the query](./media/documentdb-get-started/collection-documents.png)

The [FROM](documentdb-sql-query.md/#from-clause) keyword is optional in the query because DocumentDB queries are already scoped to a single collection. Therefore, "FROM Families f" can be swapped with "FROM root r", or any other variable name you choose. DocumentDB will infer that Families, root,or the variable name you chose, reference the current collection by default. 

##<a id="DeleteDatabase"></a>Step 8: Delete the database

Deleting the created database will remove the database and all children resources (collections, documents, etc.). You can delete the database and the document client by adding the following code snippet to the end of your **GetStartedDemo** async method.

    // Clean up/delete the database
    await client.DeleteDatabaseAsync(database.SelfLink);
	client.Dispose();

##<a id="Run"></a>Step 9: Run your application!

You are now ready to run your application. At the end of your **Main** method, add the following line of code, which will let you read the console output before the application finishes running.

	Console.ReadLine();

Now hit F5 in Visual Studio to build the application in debug mode. 

You should now see the output of your get started app. The output will show the results of the queries we added and should match the example text below. 

	Read {
	  "id": "AndersenFamily",
	  "LastName": "Andersen",
	  "Parents": [
		{
		  "FamilyName": null,
		  "FirstName": "Thomas"
		},
    	{
		  "FamilyName": null,
		  "FirstName": "Mary Kay"
		}
	  ],
	  "Children": [
		{
		  "FamilyName": null,
		  "FirstName": "Henriette Thaulow",
		  "Gender": "female",
		  "Grade": 5,
		  "Pets": [
			{
			  "GivenName": "Fluffy"
			}
		  ]
		}
	  ],
	  "Address": {
		"State": "WA",
		"County": "King",
		"City": "Seattle"
	  },
	  "IsRegistered": true,
	  "_rid": "ybVlALUoqAEBAAAAAAAAAA==",
	  "_ts": 1428372205,
	  "_self": "dbs/ybVlAA==/colls/ybVlALUoqAE=/docs/ybVlALUoqAEBAAAAAAAAAA==/",
	  "_etag": "\"0000400c-0000-0000-0000-55233aed0000\"",
	  "_attachments": "attachments/"
	} from SQL
	Read {
	  "id": "AndersenFamily",
	  "LastName": "Andersen",
	  "Parents": [
		{
		  "FamilyName": null,
		  "FirstName": "Thomas"
		},
		{
		  "FamilyName": null,
		  "FirstName": "Mary Kay"
		}
	  ],
	  "Children": [
		{
		  "FamilyName": null,
		  "FirstName": "Henriette Thaulow",
		  "Gender": "female",
		  "Grade": 5,
		  "Pets": [
			{
			  "GivenName": "Fluffy"
			}
		  ]
		}
	  ],
	  "Address": {
		"State": "WA",
		"County": "King",
		"City": "Seattle"
	  },
	  "IsRegistered": true,
	  "_rid": "ybVlALUoqAEBAAAAAAAAAA==",
	  "_ts": 1428372205,
	  "_self": "dbs/ybVlAA==/colls/ybVlALUoqAE=/docs/ybVlALUoqAEBAAAAAAAAAA==/",
	  "_etag": "\"0000400c-0000-0000-0000-55233aed0000\"",
	  "_attachments": "attachments/"
	} from LINQ
	Read {
	  "id": "AndersenFamily",
	  "LastName": "Andersen",
	  "Parents": [
		{
		  "FamilyName": null,
		  "FirstName": "Thomas"
		},
		{
		  "FamilyName": null,
		  "FirstName": "Mary Kay"
		}
	  ],
	  "Children": [
		{
		  "FamilyName": null,
		  "FirstName": "Henriette Thaulow",
		  "Gender": "female",
		  "Grade": 5,
		  "Pets": [
			{
			  "GivenName": "Fluffy"
			}
		  ]
		}
	  ],
	  "Address": {
		"State": "WA",
		"County": "King",
		"City": "Seattle"
	  },
	  "IsRegistered": true,
	  "_rid": "ybVlALUoqAEBAAAAAAAAAA==",
	  "_ts": 1428372205,
	  "_self": "dbs/ybVlAA==/colls/ybVlALUoqAE=/docs/ybVlALUoqAEBAAAAAAAAAA==/",
	  "_etag": "\"0000400c-0000-0000-0000-55233aed0000\"",
	  "_attachments": "attachments/"
	} from LINQ query
	{
	  "id": "AndersenFamily",
 	  "child": "Henriette Thaulow"
	}
	{
	  "id": "WakefieldFamily",
	  "child": "Jesse"
	}
	{
	  "id": "WakefieldFamily",
	  "child": "Lisa"
	}
	{ family = AndersenFamily, child = Henriette Thaulow }
	{ family = WakefieldFamily, child = Jesse }
	{ family = WakefieldFamily, child = Lisa }


> [AZURE.NOTE] If you run the application multiple times without removing the database, you might run into the issue of creating a new database with an id already in use. To avoid this, you can check to see if a database, collection, or document with the same id already exists. For a reference on how this can be achieved, visit our [GitHub page](https://github.com/Azure/azure-documentdb-net/tree/master/tutorials/get-started).
	
##<a id="GetSolution"></a> Get the complete solution
To build the GetStarted solution that contains all the samples in this article, you will need the following:

-   [DocumentDB account][documentdb-create-account].
-   The [GetStarted](https://github.com/Azure/azure-documentdb-net/tree/master/tutorials/get-started) solution available on GitHub. 

To restore the references to the DocumentDB .NET SDK in Visual Studio 2013, right-click the **GetStarted** solution in Solution Explorer, and then click **Enable NuGet Package Restore**. Next, in the App.config file, update the EndpointUrl and AuthorizationKey values as described in [Connect to a DocumentDB account](#Connect). 

## Next steps
-   Want a more complex ASP.NET MVC sample? See [Build a web application with ASP.NET MVC using DocumentDB](documentdb-dotnet-application.md).
-	Learn how to [monitor a DocumentDB account](documentdb-monitor-accounts.md).
-	Run queries against our sample dataset in the [Query Playground](https://www.documentdb.com/sql/demo).
-	Learn more about the programming model in the Development section of the [DocumentDB documentation page](../../services/documentdb/).

[doc-landing-page]: ../../services/documentdb/
[documentdb-create-account]: documentdb-create-account.md
[documentdb-manage]: documentdb-manage.md

[keys]: ../includes/media/documentdb-keys/keys.png

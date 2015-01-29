<properties 
	pageTitle="Get started with a the DocumentDB .NET SDK | Azure" 
	description="Learn how to create and configure an Azure DocumentDB account, create databases, create collections, and store JSON documents within your NoSQL document database account." 
	services="documentdb" 
	documentationCenter="" 
	authors="mimig1" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="12/12/2014" 
	ms.author="mimig"/>

#Get started with the DocumentDB .NET SDK  

This guide shows you how to get started using [Microsoft Azure DocumentDB (Preview)](https://portal.azure.com/#gallery/Microsoft.DocumentDB) and the [DocumentDB .NET SDK](http://go.microsoft.com/fwlink/p/?linkid=402989). DocumentDB is a NoSQL document database service, which has a [number of APIs and SDKs available](http://go.microsoft.com/fwlink/p/?linkid=522476). The code samples in this article are written in C# and use the DocumentDB .NET SDK, which is packaged and distributed as a NuGet package. 

The scenarios covered in this article include creating and configuring a DocumentDB account, creating databases, creating collections, and storing JSON documents within the account. Each of these samples are part of a complete solution available on [GitHub](https://github.com/Azure/azure-documentdb-net/tree/master/tutorials/get-started). You can [download the solution](#GetSolution) to view the sample code in context, or you can just review the samples in this article.

## In this article

-	[Connect to a DocumentDB account](#Connect)
-	[Create a database](#CreateDB)
-	[Create a collection](#CreateColl)
-	[Create documents](#CreateDoc)
-	[Query DocumentDB resources](#Query)
-	[Get the complete solution](#GetSolution)
-	[Next steps](#NextSteps)

##<a id="Connect"></a>Connect to a DocumentDB account

We'll start by creating a new instance of the [DocumentClient](http://go.microsoft.com/fwlink/p/?linkid=522477) class in order to establish a connection to our DocumentDB account.   We'll need the following references in our C# application:  

    using Microsoft.Azure.Documents;
    using Microsoft.Azure.Documents.Client;
    using Microsoft.Azure.Documents.Linq;
 
Next, a **DocumentClient** can be instantiated using the DocumentDB account endpoint and either the primary or secondary access key associated with the account. Create the client using code similar to the following:   

    private static string EndpointUrl = "<your endpoint URI>";
    private static string AuthorizationKey = "<your key>";
    
    // Create a new instance of the DocumentClient.
    var client = new DocumentClient(new Uri(EndpointUrl), AuthorizationKey);  

> [AZURE.WARNING] Never store credentials in source code. To keep this sample simple, the credentials are shown in the source code. See [Windows Azure Web Sites: How Application Strings and Connection Strings Work](http://azure.microsoft.com/blog/2013/07/17/windows-azure-web-sites-how-application-strings-and-connection-strings-work/) for information on how to store credentials in a production environment. 

The values for EndpointUrl and AuthorizationKey are the URI and PRIMARY KEY for your DocumentDB account, which can be obtained from the [Azure preview management portal](https://portal.azure.com) blade for your DocumentDB account. 

![][1]
 
These keys grant administrative access to your DocumentDB account and the resources in it. DocumentDB also supports the use of resource keys that allow clients to read, write, and delete resources in the DocumentDB account according to the permissions you've granted, without the need for an account key. For more information about resource keys, see the Permissions section of [DocumentDB Resource Model and Concepts](../documentdb-resources/).

Now that you know how to connect to a DocumentDB account and create an instance of the **DocumentClient** class, let's take a look at working with DocumentDB resources.  

##<a id="CreateDB"></a>Create a database
A DocumentDB database can be created by using the [CreateDatabaseAsync](http://go.microsoft.com/fwlink/p/?linkid=522478) method of the **DocumentClient** class.  

	// Create a database.
	Database database = await client.CreateDatabaseAsync(
		new Database
		    {
			    Id = "FamilyRegistry"
		    });

##<a id="CreateColl"></a>Create a collection  

A DocumentDB collection can be created by using the [CreateDocumentCollectionAsync](http://go.microsoft.com/fwlink/p/?linkid=522479) method of the **DocumentClient** class.  The database created in the previous step has a number of properties, one of which is the [CollectionsLink](http://go.microsoft.com/fwlink/p/?linkid=522481) property.  With that information, we can now create a collection.  

  	// Create a document collection.
  	DocumentCollection documentCollection = await client.CreateDocumentCollectionAsync(database.CollectionsLink,
  		new DocumentCollection
  		    {
  			    Id = "FamilyCollection"
  		    });
    
##<a id="CreateDoc"></a>Create documents	
A DocumentDB document can be created by using the [CreateDocumentAsync](http://go.microsoft.com/fwlink/p/?linkid=522482) method of the **DocumentClient** class.  The collection created in the previous step has a number of properties, one of which is the [DocumentsLink](http://go.microsoft.com/fwlink/p/?linkid=522483) property.  With that information, we can now insert one or more documents.  For the purposes of this example, we'll assume that we have a Family class that describes the attributes of a family such as name, gender, and age.  

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
 

##<a id="Query"></a>Query DocumentDB resources
DocumentDB supports rich queries against the JSON documents stored in each collection.  The following sample code shows various queries - using both DocumentDB SQL syntax as well as LINQ - that we can run against the documents we inserted in the previous step.  

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
	
##<a id="GetSolution"></a>Get the complete solution
To build the GetStarted solution that contains all the samples in this article, you will need the following:

-   [DocumentDB account][documentdb-create-account].
-   The [GetStarted](https://github.com/Azure/azure-documentdb-net/tree/master/tutorials/get-started) solution available on GitHub. 

To restore the references to the DocumentDB .NET SDK in Visual Studio 2013, right-click the GetStarted solution in Solution Explorer, and then click Enable NuGet Package Restore, which will restore the references. Next, in the App.config file, update the EndpointUrl and AuthorizationKey values as described in [Connect to a DocumentDB account](#Connect). 

##<a id="NextSteps"></a>Next steps
-	Learn how to [monitor a DocumentDB account](http://go.microsoft.com/fwlink/p/?LinkId=402378).
-	For details on the programming model, see the Development section on the [DocumentDB documentation page](http://go.microsoft.com/fwlink/p/?LinkID=402319).


[Connect to a DocumentDB Account]: #Connect
[Create a database]: #CreateDB
[Create a collection]: #CreateColl
[Create documents]: #CreateDoc
[Query DocumentDB Resources]: #Query
[Next steps]: #NextSteps
[doc-landing-page]: ../documentation/services/documentdb/
[documentdb-create-account]: ../documentdb-create-account/
[documentdb-manage]: ../documentdb-manage/

[1]: ./media/documentdb-get-started/gs1.png

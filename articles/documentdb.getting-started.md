<properties title="DocumentDB fundamentals" pageTitle="DocumentDB fundamentals | Azure" description="required" metaKeywords="" services="" solutions="" documentationCenter="" authors="" videoId="" scriptId="" />

#Getting Started with a DocumentDB Account  

This guide shows you how to get started using **Azure DocumentDB (Preview)**.  The samples are written in C# code and use the DocumentDB .NET SDK.  The scenarios covered include creating and configuring a DocumentDB account, creating databases, creating collections and storing JSON documents within the account.  For more information on using Azure DocumentDB, refer to the Next Steps section.  

In order to use this getting started guide, you must have a DocumentDB account and the access key (either primary or secondary) of the account.  For more information, please see:  

-	[Create a Document DB Account](http://go.microsoft.com/fwlink/p/?LinkId=402368&clcid=0x409)
-	[Manage a DocumentDB Account](http://go.microsoft.com/fwlink/p/?LinkId=402377&clcid=0x409)  

##Table of contents
-	[Connect to a DocumentDB Account][]
-	[Create a database][]
-	[Create a collection][]
-	[Create documents][]
-	[Query DocumentDB Resources][]
-	[Next steps][]  

##<a id="Connect"></a>Connect to a DocumentDB Account
There are various SDKs and APIs available to programmatically work with DocumentDB.  The samples below are shown in C# code and use the DocumentDB .NET SDK.  

We’ll start by creating a DocumentClient in order to establish a connection to our DocumentDB account.   We’ll need the following references in our C# application:  

    using Microsoft.Azure.Documents.Client;
    using Microsoft.Azure.Documents.Linq;
    using Microsoft.Azure.Documents;  
 
A DocumentClient can be instantiated using the DocumentDB account endpoint and either the primary or secondary access key associated with the account.  

The DocumentDB account endpoint and keys can be obtained from the Azure management preview portal blade for your DocumentDB account.  See [Manage a DocumentDB](http://go.microsoft.com/fwlink/p/?LinkId=402377) Account for more information.

![][1]
 
>Note that the DocumentDB access keys available from the Keys blade grant administrative access to your DocumentDB account and of the resources in it.  DocumentDB also supports the use of resource keys that allow clients to read, write and delete resources in the DocumentDB account according to the permissions you’ve granted, without the need for an account key.  See [How to Grant Access to DocumentDB Resources](about:blank) for further information.  

Create the client using code like the following example.  

    private static string endpointUrl = "<your endpoint URI>";
    private static string authorizationKey = "<your key>";
    
    //Create a new instance of the DocumentClient
    var client = new DocumentClient(new Uri(endpointUrl), authorizationKey);  

**Warning:** Never store credentials in source code. To keep this sample simple, they are shown in the source code. See [Windows Azure Web Sites: How Application Strings and Connection Strings Work](http://azure.microsoft.com/blog/2013/07/17/windows-azure-web-sites-how-application-strings-and-connection-strings-work/) for information on how to store credentials.  

Now that you know how to connect to a DocumentDB account and create an instance of DocumentClient, let's take a look at working with DocumentDB resources.  

##<a id="CreateDB"></a>Create a database
Using the .NET SDK, a DocumentDB database can be created via the CreateDatabaseAsync method of a DocumentClient.  

    //Create a Database
     Database database = await client.CreateDatabaseAsync(
     new Database
     {
     Name = "<database name>"
     });

Console.WriteLine("Created Database with Id: " + database.Id + " and Name: " + database.Name);  

##<a id="CreateColl"></a>Create a collection  

Using the .NET SDK, a DocumentDB collection can be created via the CreateDocumentCollectionAsync method of a DocumentClient.  The database created in the previous step has a number of properties, one of which is the SelfLink property.  With that information, we can now create a collection.  

    //Create a document collection 
    documentCollection = new DocumentCollection
    {
    Name = "Demo1Collection"
    };
    
    documentCollection = await client.CreateDocumentCollectionAsync(
    database.SelfLink,
    documentCollection);
    
    Console.WriteLine("Created Collection with Id: " + documentCollection.Id + " and Name: " + documentCollection.Name);  

##<a id="CreateDoc"></a>Create documents	
Using the .NET SDK, a DocumentDB document can be created via the CreateDocumentAsync method of a DocumentClient.  The collection created in the previous step has a number of properties, one of which is the DocumentsLink property.  With that information, we can now insert 1 or more documents.  For the purposes of this example, we’ll assume that we have a Page class which describes web page properties which we would like to store in DocumentDB.  

    async static void CreateDocumentAsync()
    {
    List<Page> documents = new List<Page>();
    documents.Add(new Page
    {
    Name = "Sample",
    Title = "About Paris",
    Language = new Language { Name = "English" },
    Author = new Author { Name = "Don", Location = new Location { City = "Paris", Country = "France" } },
    Content = "Don's document in DocumentDB is a valid JSON document as defined by the JSON spec.",
    PageViews = 10000,
    Topics = new Topic[] { new Topic { Title = "History of Paris" }, new Topic { Title = "Places to see in Paris" } }
    });
    
    documents.Add(new Page
    {
    Name = "Sample2",
    Title = "About Seattle",
    Language = new Language { Name = "English" },
    Author = new Author { Name = "Fred", Location = new Location { City = "Seattle", Country = "United States" } },
    Content = "Another document in DocumentDB is a valid JSON document as defined by the JSON spec.",
    PageViews = 15000,
    Topics = new Topic[] { new Topic { Title = "History of Seattle" }, new Topic { Title = "Places to see in in Seattle" } }
    });
    
    documents.Add(new Page
    {
    Name = "Sample3",
    Title = "About Portland",
    Language = new Language { Name = "English" },
    Author = new Author { Name = "Sally", Location = new Location { City = "Portland", Country = "United States" } },
    Content = "Another document in DocumentDB is a valid JSON document as defined by the JSON spec.",
    PageViews = 25000,
    Topics = new Topic[] { new Topic { Title = "History of Portland" }, new Topic { Title = "Places to see in in Portland" } }
    });
    
    // Create each document
    foreach (Page p in documents)
    {
    ResourceResponse<Document> resp = await client.CreateDocumentAsync(documentCollection.DocumentsLink, p);
    
    Console.WriteLine("Created Document with Name: " + p.Name + ", Title: " + p.Title + " and Content: " + p.Content);
    Console.WriteLine();
    }   
     }  

##<a id="Query"></a>Query DocumentDB Resources
DocumentDB supports rich queries against the JSON documents stored in each collection.  The sample code below shows various queries – using both DocumentDB SQL syntax as well as LINQ – that we can run against the documents we inserted in the previous step.  

    // Simple SQL predicate query
    Console.WriteLine("Simple SQL predicate query:");
    IQueryable<dynamic> authorResults = client.CreateDocumentQuery(documentCollection.SelfLink).AsSQL<dynamic>("SELECT p.Author FROM Pages p WHERE p.Title = 'About Seattle'");
    foreach (Page myAuthor in authorResults)
    {
    Console.WriteLine(String.Format("{0} authored a page with the title About Seattle", myAuthor.Author.Name));
    //Console.WriteLine(myAuthor);   
    }
    
    //Simple LINQ predicate query
    Console.WriteLine("Simple LINQ predicate query:");
    IQueryable<Author> pageAuthorQuery = from page in client.CreateDocumentQuery<Page>(documentCollection.DocumentsLink)
     where page.Title == "About Seattle"
     select page.Author;
    foreach (dynamic myAuthor in pageAuthorQuery)
    {
    Console.WriteLine("Page Author = {0}", myAuthor.Name);
    }
    
    //SQL Query with Comparison operator
    Console.WriteLine("SQL Query with Comparison operator:");
    IQueryable<dynamic> pageResults = client.CreateDocumentQuery(documentCollection.SelfLink).AsSQL<dynamic>("SELECT p.Author, p.Title, p.PageViews FROM Pages p WHERE p.PageViews > 10000");
    foreach (Page myPage in pageResults)
    {
    Console.WriteLine(String.Format("{0}, authored by {1}, has {2} page views.", myPage.Title, myPage.Author.Name, myPage.PageViews));
    }
    
    //LINQ Query with Comparison operator
    Console.WriteLine("LINQ Query with Comparison operator:");
    IEnumerable<Page> comparisonOperators = from p in client.CreateDocumentQuery<Page>(documentCollection.DocumentsLink) where p.PageViews > 10000 select p;
    
    foreach (Page p in comparisonOperators)
    {
    Console.WriteLine(String.Format("{0} has page views of {1}", p.Author.Name, p.PageViews));
    }
    
    //SQL Query with Logical operator
    Console.WriteLine("SQL Query with Logical operator:");
    pageResults = client.CreateDocumentQuery(documentCollection.SelfLink).AsSQL<dynamic>("SELECT p.Author, p.Title, p.PageViews FROM Pages p WHERE p.Author.Location.Country = 'France' AND p.PageViews >= 10000");
    foreach (Page myPage in pageResults)
    {
    Console.WriteLine(String.Format("{0}, authored by {1}, has {2} page views.", myPage.Title, myPage.Author.Name, myPage.PageViews));
    }
    
    //LINQ Query with Logical operator
    Console.WriteLine("LINQ Query with Logical operator:");
    IEnumerable<Page> logicalOperators = from p in client.CreateDocumentQuery<Page>(documentCollection.DocumentsLink)
       where p.Author.Location.Country == "France" && p.PageViews >= 10000
       select p;
    
    
    foreach (Page p in logicalOperators)
    {
    Console.WriteLine(String.Format("{0} has page views of {1}", p.Author.Name, p.PageViews));
    }

##<a id="NextSteps"></a>Next steps
-	Learn how to [monitor a DocumentDB account](http://go.microsoft.com/fwlink/p/?LinkId=402378&clcid=0x409).
-	To learn more about DocumentDB, see the Azure DocumentDB documentation on [azure.com](http://go.microsoft.com/fwlink/?LinkID=402319&clcid=0x409)


[Connect to a DocumentDB Account]: #Connect
[Create a database]: #CreateDB
[Create a collection]: #CreateColl
[Create documents]: #CreateDoc
[Query DocumentDB Resources]: #Query
[Next steps]: #NextSteps

[1]: ./media/documentdb.getting-started/gs1.png
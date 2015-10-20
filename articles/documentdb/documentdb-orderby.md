<properties 
	pageTitle="Sorting DocumentDB data using Order By | Microsoft Azure" 
	description="Learn how to use ORDER BY in DocumentDB queries in LINQ and SQL, and how to specify an indexing policy for ORDER BY queries." 
	services="documentdb" 
	authors="arramac" 
	manager="jhubbard" 
	editor="cgronlun" 
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/20/2015" 
	ms.author="arramac"/>

# Sorting DocumentDB data using Order By
Microsoft Azure DocumentDB supports querying documents using SQL over JSON documents. Query results can be ordered using the ORDER BY clause in SQL query statements.

After reading this article, you'll be able to answer the following questions: 

- How do I query with Order By?
- How do I configure an indexing policy for Order By?
- What's coming next?

[Samples](#samples) and an [FAQ](#faq) are also provided.

For a complete reference on SQL querying, see the [DocumentDB Query tutorial](documentdb-sql-query.md).

## How to Query with Order By
Like in ANSI-SQL, you can now include an optional Order By clause in SQL statements when querying DocumentDB. The clause can include an optional ASC/DESC argument to specify the order in which results must be retrieved. 

### Ordering using SQL
For example here's a query to retrieve books in descending order of their titles. 

    SELECT * 
    FROM Books 
    ORDER BY Books.Title DESC

### Ordering using SQL with Filtering
You can order using any nested property within documents like Books.ShippingDetails.Weight, and you can specify additional filters in the WHERE clause in combination with Order By like in this example:

    SELECT * 
    FROM Books 
	WHERE Books.SalePrice > 4000
    ORDER BY Books.ShippingDetails.Weight

### Ordering using the LINQ Provider for .NET
Using the .NET SDK version 1.2.0 and higher, you can also use the OrderBy() or OrderByDescending() clause within LINQ queries like in this example:

    foreach (Book book in client.CreateDocumentQuery<Book>(booksCollection.SelfLink)
        .OrderBy(b => b.PublishTimestamp)) 
    {
        // Iterate through books
    }

### Ordering with paging using the .NET SDK
Using the native paging support within the DocumentDB SDKs, you can retrieve results one page at a time like in the following .NET code snippet. Here we fetch results up to 10 at a time using the FeedOptions.MaxItemCount and the IDocumentQuery interface.

    var booksQuery = client.CreateDocumentQuery<Book>(
        booksCollection.SelfLink,
        "SELECT * FROM Books ORDER BY Books.PublishTimestamp DESC"
        new FeedOptions { MaxItemCount = 10 })
      .AsDocumentQuery();
            
    while (booksQuery.HasMoreResults) 
    {
        foreach(Book book in await booksQuery.ExecuteNextAsync<Book>())
        {
            // Iterate through books
        }
    }

DocumentDB supports ordering with a single numeric, string or Boolean property per query, with additional query types coming soon. Please see [What's coming next](#Whats_coming_next) for more details.

## Configure an indexing policy for Order By

Recall that DocumentDB supports two kinds of indexes (Hash and Range), which can be set for specific paths/properties, data types (strings/numbers) and at different precision values (either maximum precision or a fixed precision value). Since DocumentDB uses Hash indexing as default, you must create a new collection with a custom indexing policy with Range on numbers, strings or both, in order to use Order By. 

>[AZURE.NOTE] String range indexes were introduced on July 7, 2015 with REST API version 2015-06-03. In order to create policies for Order By against strings, you must use SDK version 1.2.0 of the .NET SDK, or version 1.1.0 of the Python, Node.js or Java SDK.
>
>Prior to REST API version 2015-06-03, the default collection indexing policy was Hash for both strings and numbers. This has been changed to Hash for strings, and Range for numbers. 

For more details see [DocumentDB indexing policies](documentdb-indexing-policies.md).

### Indexing for Order By against all properties
Here's how you can create a collection with "All Range" indexing for Order By against any/all numeric or string properties that appear within JSON documents within it. Here, "/*" represents all JSON properties/paths within the collection, and -1 represents the maximum precision.
                   
    booksCollection.IndexingPolicy.IncludedPaths.Add(
        new IncludedPath { 
            Path = "/*", 
            Indexes = new Collection<Index> { 
                new RangeIndex(DataType.String) { Precision = -1 }, 
                new RangeIndex(DataType.Number) { Precision = -1 }
            }
        });

    await client.CreateDocumentCollectionAsync(databaseLink, 
        booksCollection);  

>[AZURE.NOTE] Note that Order By only will return results of the data types (String and Number) that are indexed with a RangeIndex. For example, if you have the default indexing policy which only has RangeIndex on numbers, an Order By against a path with string values will return no documents.

### Indexing for Order By for a single property
Here's how you can create a collection with indexing for Order By against just the Title property, which is a string. There are two paths, one for the Title property ("/Title/?") with Range indexing, and the other for every other property with the default indexing scheme, which is Hash for strings and Range for numbers.                    
    
    booksCollection.IndexingPolicy.IncludedPaths.Add(
        new IncludedPath { 
            Path = "/Title/?", 
            Indexes = new Collection<Index> { 
                new RangeIndex(DataType.String) { Precision = -1 } } 
            });
    
    // Use defaults which are:
    // (a) for strings, use Hash with precision 3 (just equality queries)
    // (b) for numbers, use Range with max precision (for equality, range and order by queries)
    booksCollection.IndexingPolicy.IncludedPaths.Add(
        new IncludedPath { 
            Path = "/*",
            Indexes = new Collection<Index> { 
                new HashIndex(DataType.String) { Precision = 3 }, 
                new RangeIndex(DataType.Number) { Precision = -1 }
            }            
        });

## Samples
Take a look at this [Github samples project](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples/Queries.OrderBy) that demonstrates how to use Order By, including creating indexing policies and paging using Order By. The samples are open source and we encourage you to submit pull requests with contributions that could benefit other DocumentDB developers. Please refer to the [Contribution guidelines](https://github.com/Azure/azure-documentdb-net/blob/master/Contributing.md) for guidance on how to contribute.  

## What's coming next?

Future service updates will expand on the Order By support introduced here. We are working on the following additions and will prioritize the release of these improvements based on your feedback:

- Dynamic Indexing Policies: Support to modify indexing policy after collection creation and in the Azure Portal
- Support for Compound Indexes for more efficient Order By and Order By on multiple properties.

## FAQ

**Which platforms/versions of the SDK support ordering?**

In order to create collections with the indexing policy required for Order By, you must download the latest drop of the SDK (1.2.0 for .NET and 1.1.0 for Node.js, JavaScript, Python and Java). The .NET SDK 1.2.0 is also required to use OrderBy() and OrderByDescending() within LINQ expressions. 


**What is the expected Request Unit (RU) consumption of Order By queries?**

Since Order By utilizes the DocumentDB index for lookups, the number of request units consumed by Order By queries will be similar to the equivalent queries without Order By. Like any other operation on DocumentDB, the number of request units depends on the sizes/shapes of documents as well as the complexity of the query. 


**What is the expected indexing overhead for Order By?**

The indexing storage overhead will be proportionate to the number of properties. In the worst case scenario, the index overhead will be 100% of the data. There is no difference in throughput (Request Units) overhead between Range/Order By indexing and the default Hash indexing.

**How do I query my existing data in DocumentDB using Order By?**

In order to sort query results using Order By, you must modify the indexing policy of the collection to use a Range index type against the property used to sort. See [Modifying Indexing Policy](documentdb-indexing-policies/#modifying-the-indexing-policy-of-a-collection). 

**What are the current limitations of Order By?**

Order By can be specified only against a property, either numeric or String when it is range indexed with the Maximum Precision (-1).

You cannot perform the following:
 
- Order By with internal string properties like id, _rid, and _self (coming soon).
- Order By with properties derived from the result of an intra-document join (coming soon).
- Order By multiple properties (coming soon).
- Order By with queries on databases, collections, users, permissions or attachments (coming soon).
- Order By with computed properties e.g. the result of an expression or a UDF/built-in function.

## Next steps

Fork the [Github samples project](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples/Queries.OrderBy) and start ordering your data! 

## References
* [DocumentDB Query Reference](documentdb-sql-query.md)
* [DocumentDB Indexing Policy Reference](documentdb-indexing-policies.md)
* [DocumentDB SQL Reference](https://msdn.microsoft.com/library/azure/dn782250.aspx)
* [DocumentDB Order By Samples](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples/Queries.OrderBy)
 


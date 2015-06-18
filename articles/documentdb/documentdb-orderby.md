<properties 
	pageTitle="Sorting DocumentDB data using Order By | Azure" 
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
	ms.date="06/04/2015" 
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
For example here's a query to retrieve books in descending order of PublishTimestamp. 

    SELECT * 
    FROM Books 
    ORDER BY Books.PublishTimestamp DESC

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

DocumentDB supports ordering against numeric types (not strings), and only for a single Order By property per query in this preview of the feature. Please see [What's coming next](#Whats_coming_next) for more details.

## Configure an indexing policy for Order By
In order to execute Order By queries, you must either:

- Index specific paths within your documents with maximum precision, (or) 
- Index *all* paths recursively for the entire collection with maximum precision 

Maximum precision (represented as precision of -1 in JSON config) utilizes a variable number of bytes depending on the value that's being indexed. Therefore:

- Properties with larger number values e.g., epoch timestamps, the max precision will have a high index overhead. 
- Properties with smaller number values (enumerations, zeroes, zip codes, ages, etc.) will have a low index overhead.

For more details see [DocumentDB indexing policies](documentdb-indexing-policies.md).

### Indexing for Order By against all numeric properties
Here's how you can create a collection with indexing for Order By against any (numeric) property.
                   

    booksCollection.IndexingPolicy.IncludedPaths.Add(
        new IndexingPath {
            IndexType = IndexType.Range, 
            Path = "/",
            NumericPrecision = -1 });

    await client.CreateDocumentCollectionAsync(databaseLink, 
        booksCollection);  

### Indexing for Order By for a single property
Here's how you can create a collection with indexing for Order By against just the PublishTimestamp property.                                                       

    booksCollection.IndexingPolicy.IncludedPaths.Add(
        new IndexingPath {
            IndexType = IndexType.Range,
            Path = "/\"PublishTimestamp\"/?",
            NumericPrecision = -1
        });

    booksCollection.IndexingPolicy.IncludedPaths.Add(
        new IndexingPath {
            Path = "/"
        });


## Samples
Take a look at this [Github samples project](https://github.com/Azure/azure-documentdb-net/tree/master/samples/orderby) that demonstrates how to use Order By, including creating indexing policies and paging using Order By. The samples are open source and we encourage you to submit pull requests with contributions that could benefit other DocumentDB developers. Please refer to the [Contribution guidelines](https://github.com/Azure/azure-documentdb-net/blob/master/Contributing.md) for guidance on how to contribute.  

## What's coming next?

Future service updates will expand on the Order By support introduced here. We are working on the following additions and will prioritize the release of these improvements based on your feedback:

- Dynamic Indexing Policies: Support to modify indexing policy after collection creation
- String range indexes: Index to support range queries (>, <, >=, <=) against string values. In order to support this, we will be introducing a new richer schema for indexing policies.
- Support for String Order By in DocumentDB query.
- Ability to update indexing policy using the Azure Preview Portal.
- Support for Compound Indexes for more efficient Order By and Order By on multiple properties.

## FAQ

**Which platforms/versions of the SDK support ordering?**

Since Order By is a server-side update, you do not need to download a new version of the SDK to use this feature. All platforms and versions of the SDK, including the server-side JavaScript SDK can use Order By using SQL query strings. If you're using LINQ, you should download version 1.2.0 or newer from Nuget.

**What is the expected Request Unit (RU) consumption of Order By queries?**

Since Order By utilizes the DocumentDB index for lookups, the number of request units consumed by Order By queries will be similar to the equivalent queries without Order By. Like any other operation on DocumentDB, the number of request units depends on the sizes/shapes of documents as well as the complexity of the query. 


**What is the expected indexing overhead for Order By?**

The indexing storage overhead will be proportionate to the number of numeric properties. In the worst case scenario, the index overhead will be 100% of the data. There is no difference in throughput (Request Units) overhead between Range/Order By indexing and the default Hash indexing.

**Does this change impact queries without Order By?**

There are no changes introduced in how queries without Order By work today. Prior to the release of this feature, all DocumentDB queries returned results in ResourceId (_rid) order. With Order By, queries will naturally be returned in the specified order of values. In Order By queries, _rid will be used as a secondary sort order when there are multiple documents returned with the same value.

**How do I query my existing data in DocumentDB using Order By?**

This will be supported with the availability of the  Dynamic Indexing Policies improvement mentioned in the [What's Coming Next](what's-coming-next) section. In order to do this today, you have to export your data and re-import into a new DocumentDB collection created with a Range/Order By Index. The DocumentDB Import Tool can be used to migrate your data between collections. 

**What are the current limitations of Order By?**

Order By can be specified only against a numeric property, and only when it is range indexed with Max Precision (-1) indexing. Order By is supported only against document collections.

You cannot perform the following:
 
- Order By with string properties (coming soon).
- Order By with internal string properties like id, _rid, and _self (coming soon).
- Order By with properties derived from the result of an intra-document join (coming soon).
- Order By multiple properties (coming soon).
- Order By with computed properties e.g. the result of an expression or a UDF/built-in function.
- Order By with queries on databases, collections, users, permissions or attachments.

## Next steps

Fork the [Github samples project](https://github.com/Azure/azure-documentdb-net/tree/master/samples/orderby) and start ordering your data! 

## References
* [DocumentDB Query Reference](documentdb-sql-query.md)
* [DocumentDB Indexing Policy Reference](documentdb-indexing-policies.md)
* [DocumentDB SQL Reference](https://msdn.microsoft.com/library/azure/dn782250.aspx)
* [DocumentDB Order By Samples](https://github.com/Azure/azure-documentdb-net/tree/master/samples/orderby)
 
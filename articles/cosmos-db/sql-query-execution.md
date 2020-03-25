---
title: SQL query execution in Azure Cosmos DB
description: Learn how to create a SQL query and execute it in Azure Cosmos DB. This article describes how to create and execute a SQL query using REST API, .Net SDK, JavaScript SDK and various other SDKs. 
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 12/02/2019
ms.author: tisande

---
# Azure Cosmos DB SQL query execution

Any language capable of making HTTP/HTTPS requests can call the Cosmos DB REST API. Cosmos DB also offers programming libraries for .NET, Node.js, JavaScript, and Python programming languages. The REST API and libraries all support querying through SQL, and the .NET SDK also supports [LINQ querying](sql-query-linq-to-sql.md).

The following examples show how to create a query and submit it against a Cosmos database account.

## <a id="REST-API"></a>REST API

Cosmos DB offers an open RESTful programming model over HTTP. The resource model consists of a set of resources under a database account, which an Azure subscription provisions. The database account consists of a set of *databases*, each of which can contain multiple *containers*, which in turn contain *items*, UDFs, and other resource types. Each Cosmos DB resource is addressable using a logical and stable URI. A set of resources is called a *feed*. 

The basic interaction model with these resources is through the HTTP verbs `GET`, `PUT`, `POST`, and `DELETE`, with their standard interpretations. Use `POST` to create a new resource, execute a stored procedure, or issue a Cosmos DB query. Queries are always read-only operations with no side-effects.

The following examples show a `POST` for a SQL API query against the sample items. The query has a simple filter on the JSON `name` property. The `x-ms-documentdb-isquery` and Content-Type: `application/query+json` headers  denote that the operation is a query. Replace `mysqlapicosmosdb.documents.azure.com:443` with the URI for your Cosmos DB account.

```json
    POST https://mysqlapicosmosdb.documents.azure.com:443/docs HTTP/1.1
    ...
    x-ms-documentdb-isquery: True
    Content-Type: application/query+json

    {
        "query": "SELECT * FROM Families f WHERE f.id = @familyId",
        "parameters": [
            {"name": "@familyId", "value": "AndersenFamily"}
        ]
    }
```

The results are:

```json
    HTTP/1.1 200 Ok
    x-ms-activity-id: 8b4678fa-a947-47d3-8dd3-549a40da6eed
    x-ms-item-count: 1
    x-ms-request-charge: 0.32

    {  
       "_rid":"u1NXANcKogE=",
       "Documents":[  
          {  
             "id":"AndersenFamily",
             "lastName":"Andersen",
             "parents":[  
                {  
                   "firstName":"Thomas"
                },
                {  
                   "firstName":"Mary Kay"
                }
             ],
             "children":[  
                {  
                   "firstName":"Henriette Thaulow",
                   "gender":"female",
                   "grade":5,
                   "pets":[  
                      {  
                         "givenName":"Fluffy"
                      }
                   ]
                }
             ],
             "address":{  
                "state":"WA",
                "county":"King",
                "city":"Seattle"
             },
             "_rid":"u1NXANcKogEcAAAAAAAAAA==",
             "_ts":1407691744,
             "_self":"dbs\/u1NXAA==\/colls\/u1NXANcKogE=\/docs\/u1NXANcKogEcAAAAAAAAAA==\/",
             "_etag":"00002b00-0000-0000-0000-53e7abe00000",
             "_attachments":"_attachments\/"
          }
       ],
       "count":1
    }
```

The next, more complex query returns multiple results from a join:

```json
    POST https://https://mysqlapicosmosdb.documents.azure.com:443/docs HTTP/1.1
    ...
    x-ms-documentdb-isquery: True
    Content-Type: application/query+json

    {
        "query": "SELECT
                     f.id AS familyName,
                     c.givenName AS childGivenName,
                     c.firstName AS childFirstName,
                     p.givenName AS petName
                  FROM Families f
                  JOIN c IN f.children
                  JOIN p in c.pets",
        "parameters": []
    }
```

The results are: 

```json
    HTTP/1.1 200 Ok
    x-ms-activity-id: 568f34e3-5695-44d3-9b7d-62f8b83e509d
    x-ms-item-count: 1
    x-ms-request-charge: 7.84

    {  
       "_rid":"u1NXANcKogE=",
       "Documents":[  
          {  
             "familyName":"AndersenFamily",
             "childFirstName":"Henriette Thaulow",
             "petName":"Fluffy"
          },
          {  
             "familyName":"WakefieldFamily",
             "childGivenName":"Jesse",
             "petName":"Goofy"
          },
          {  
             "familyName":"WakefieldFamily",
             "childGivenName":"Jesse",
             "petName":"Shadow"
          }
       ],
       "count":3
    }
```

If a query's results can't fit in a single page, the REST API returns a continuation token through the `x-ms-continuation-token` response header. Clients can paginate results by including the header in the subsequent results. You can also control the number of results per page through the `x-ms-max-item-count` number header.

If a query has an aggregation function like COUNT, the query page may return a partially aggregated value over only one page of results. Clients must perform a second-level aggregation over these results to produce the final results. For example, sum over the counts returned in the individual pages to return the total count.

To manage the data consistency policy for queries, use the `x-ms-consistency-level` header as in all REST API requests. Session consistency also requires echoing the latest `x-ms-session-token` cookie header in the query request. The queried container's indexing policy can also influence the consistency of query results. With the default indexing policy settings for containers, the index is always current with the item contents, and query results match the consistency chosen for data. For more information, see [Azure Cosmos DB consistency levels][consistency-levels].

If the configured indexing policy on the container can't support the specified query, the Azure Cosmos DB server returns 400 "Bad Request". This error message returns for queries with paths explicitly excluded from indexing. You can specify the `x-ms-documentdb-query-enable-scan` header to allow the query to perform a scan when an index isn't available.

You can get detailed metrics on query execution by setting the `x-ms-documentdb-populatequerymetrics` header to `true`. For more information, see [SQL query metrics for Azure Cosmos DB](sql-api-query-metrics.md).

## C# (.NET SDK)

The .NET SDK supports both LINQ and SQL querying. The following example shows how to perform the preceding filter query with .NET:

```csharp
    foreach (var family in client.CreateDocumentQuery(containerLink,
        "SELECT * FROM Families f WHERE f.id = \"AndersenFamily\""))
    {
        Console.WriteLine("\tRead {0} from SQL", family);
    }

    SqlQuerySpec query = new SqlQuerySpec("SELECT * FROM Families f WHERE f.id = @familyId");
    query.Parameters = new SqlParameterCollection();
    query.Parameters.Add(new SqlParameter("@familyId", "AndersenFamily"));

    foreach (var family in client.CreateDocumentQuery(containerLink, query))
    {
        Console.WriteLine("\tRead {0} from parameterized SQL", family);
    }

    foreach (var family in (
        from f in client.CreateDocumentQuery(containerLink)
        where f.Id == "AndersenFamily"
        select f))
    {
        Console.WriteLine("\tRead {0} from LINQ query", family);
    }

    foreach (var family in client.CreateDocumentQuery(containerLink)
        .Where(f => f.Id == "AndersenFamily")
        .Select(f => f))
    {
        Console.WriteLine("\tRead {0} from LINQ lambda", family);
    }
```

The following example compares two properties for equality within each item, and uses anonymous projections.

```csharp
    foreach (var family in client.CreateDocumentQuery(containerLink,
        @"SELECT {""Name"": f.id, ""City"":f.address.city} AS Family
        FROM Families f
        WHERE f.address.city = f.address.state"))
    {
        Console.WriteLine("\tRead {0} from SQL", family);
    }

    foreach (var family in (
        from f in client.CreateDocumentQuery<Family>(containerLink)
        where f.address.city == f.address.state
        select new { Name = f.Id, City = f.address.city }))
    {
        Console.WriteLine("\tRead {0} from LINQ query", family);
    }

    foreach (var family in
        client.CreateDocumentQuery<Family>(containerLink)
        .Where(f => f.address.city == f.address.state)
        .Select(f => new { Name = f.Id, City = f.address.city }))
    {
        Console.WriteLine("\tRead {0} from LINQ lambda", family);
    }
```

The next example shows joins, expressed through LINQ `SelectMany`.

```csharp
    foreach (var pet in client.CreateDocumentQuery(containerLink,
          @"SELECT p
            FROM Families f
                 JOIN c IN f.children
                 JOIN p in c.pets
            WHERE p.givenName = ""Shadow"""))
    {
        Console.WriteLine("\tRead {0} from SQL", pet);
    }

    // Equivalent in Lambda expressions:
    foreach (var pet in
        client.CreateDocumentQuery<Family>(containerLink)
        .SelectMany(f => f.children)
        .SelectMany(c => c.pets)
        .Where(p => p.givenName == "Shadow"))
    {
        Console.WriteLine("\tRead {0} from LINQ lambda", pet);
    }
```

The .NET client automatically iterates through all the pages of query results in the `foreach` blocks, as shown in the preceding example. The query options introduced in the [REST API](#REST-API) section are also available in the .NET SDK, using the `FeedOptions` and `FeedResponse` classes in the `CreateDocumentQuery` method. You can control the number of pages by using the `MaxItemCount` setting.

You can also explicitly control paging by creating `IDocumentQueryable` using the `IQueryable` object, then by reading the `ResponseContinuationToken` values and passing them back as `RequestContinuationToken` in `FeedOptions`. You can set `EnableScanInQuery` to enable scans when the query isn't supported by the configured indexing policy. For partitioned containers, you can use `PartitionKey` to run the query against a single partition, although Azure Cosmos DB can automatically extract this from the query text. You can use `EnableCrossPartitionQuery` to run queries against multiple partitions.

For more .NET samples with queries, see the [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmos-dotnet-v3) in GitHub.

## <a id="JavaScript-server-side-API"></a>JavaScript server-side API

Azure Cosmos DB provides a programming model for [executing JavaScript based application](stored-procedures-triggers-udfs.md) logic directly on containers, using stored procedures and triggers. The JavaScript logic registered at the container level can then issue database operations on the items of the given container, wrapped in ambient ACID transactions.

The following example shows how to use `queryDocuments` in the JavaScript server API to make queries from inside stored procedures and triggers:

```javascript
    function findName(givenName, familyName) {
        var context = getContext();
        var containerManager = context.getCollection();
        var containerLink = containerManager.getSelfLink()

        // create a new item.
        containerManager.createDocument(containerLink,
            { givenName: givenName, familyName: familyName },
            function (err, documentCreated) {
                if (err) throw new Error(err.message);

                // filter items by familyName
                var filterQuery = "SELECT * from root r WHERE r.familyName = 'Wakefield'";
                containerManager.queryDocuments(containerLink,
                    filterQuery,
                    function (err, matchingDocuments) {
                        if (err) throw new Error(err.message);
    context.getResponse().setBody(matchingDocuments.length);

                        // Replace the familyName for all items that satisfied the query.
                        for (var i = 0; i < matchingDocuments.length; i++) {
                            matchingDocuments[i].familyName = "Robin Wakefield";
                            // we don't need to execute a callback because they are in parallel
                            containerManager.replaceDocument(matchingDocuments[i]._self,
                                matchingDocuments[i]);
                        }
                    })
            });
    }
```

## Next steps

- [Introduction to Azure Cosmos DB](introduction.md)
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmos-dotnet-v3)
- [Azure Cosmos DB consistency levels](consistency-levels.md)

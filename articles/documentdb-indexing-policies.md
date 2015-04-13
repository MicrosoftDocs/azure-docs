<properties 
    pageTitle="DocumentDB Indexing Policies | Azure" 
    description="Understand how indexing works in DocumentDB and learn how to configure the indexing policy." 
    services="documentdb" 
    documentationCenter="" 
    authors="mimig1" 
    manager="jhubbard" 
    editor="monicar"/>

<tags 
    ms.service="documentdb" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.tgt_pltfrm="na" 
    ms.workload="data-services" 
    ms.date="03/27/2015" 
    ms.author="mimig"/>


DocumentDB indexing policies
============================

DocumentDB is a true schema-free database. It does not assume or require
any schema for the JSON documents it indexes. This allows you to quickly define and
iterate on application data models. As you add documents to a
collection, DocumentDB automatically indexes all document properties so
they are available for you to query. Automatic indexing also allows you to
store heterogeneous types of documents.

Automatic indexing of documents is enabled by write optimized, lock free,
and log structured index maintenance techniques. DocumentDB supports a
sustained volume of fast writes while still serving consistent queries.

The DocumentDB indexing subsystem is designed to support:

·         Efficient, rich hierarchical and relational queries without
any schema or index definitions.

·         Consistent query results while handling a sustained volume of
writes. For high write throughput workloads with consistent queries, the
index is updated incrementally, efficiently, and online while handling a
sustained volume of writes.

·         Storage efficiency. For cost effectiveness, the on-disk
storage overhead of the index is bounded and predictable.

·         Multi-tenancy. Index updates are performed within the budget
of system resources allocated per DocumentDB collection. 

For most applications, you can use the default automatic indexing policy
as it allows for the most flexibility and sound tradeoffs between
performance and storage efficiency. On the other hand, specifying a
custom indexing policy allows you to make granular tradeoffs between
query performance, write performance, and index storage overhead.  

For example, by excluding certain documents or paths within documents
from indexing, you can reduce both the storage space used for indexing,
as well as the insert time cost for index maintenance. You can change
the type of index to be better suited for range queries, or increase the
index precision in bytes to improve query performance. This article
describes the various indexing configuration options available in
DocumentDB, and how to customize indexing policy for your workloads.

<a id="HowWorks"></a>How DocumentDB indexing works
-----------------------------

The indexing in DocumentDB takes advantage of the fact that JSON grammar
allows documents to be **represented as trees**. For a JSON document to
be represented as a tree, a dummy root node needs to be created which
parents the rest of the actual nodes in the document underneath. Each
label including the array indices in a JSON document becomes a node of
the tree. The figure below illustrates an example JSON document and its
corresponding tree representation.

![Indexing Policies](media/documentdb-indexing-policies/image001.png)


For example, the JSON property {"headquarters": "Belgium"} property in the above example corresponds to the path /"headquarters"/"Belgium". The JSON array {"exports": [{"city": “Moscow"}, {"city": Athens"}]} correspond to the paths /"exports"/0/"city"/"Moscow" and /"exports"/1/"city"/"Athens".

**Note**  The path representation blurs the boundary between the
structure/schema and the instance values in documents, allowing
DocumentDB to be truly schema-free.

In DocumentDB, documents are organized into collections that can be
queried using SQL, or processed within the scope a single transaction.
Each collection can be configured with its own indexing policy expressed
in terms of paths. In the following section, we will take a look at how
to configure the indexing behavior of a DocumentDB collection.

<a id="ConfigPolicy"></a>Configuring the indexing policy of a collection
-------------------------------------------

The following sample shows how to set a custom indexing policy during 
the creation of a collection, by using the DocumentDB REST API. The sample shows 
the indexing policy expressed in terms of paths, index types,
and precisions.


    POST https://<REST URI>/colls HTTP/1.1                                                  
     ...                                                             
     Accept: application/json 
                                                                                                                         
    {                                                                     
        "id":"customIndexCollection",                                     
        "indexingPolicy":
        {                                                 
            "automatic":true,                                            
            "indexingMode":"Consistent",                                     
            "IncludedPaths":
            [                                       
                {                                                            
                    "IndexType":"Hash",                                        
                    "Path":"/"                                                 
                }                                                  
            ],                                                               
            "ExcludedPaths":
            [                                                
                "/\"nonIndexedContent\"/*"                                 
            ]                                                               
        }                                                                 
     }                                                                                                                                                
     ...                                                                      
                  
                                                        
     HTTP/1.1 201 Created                                                     


**Note:** The indexing policy of a collection must be specified at
the time of creation. Modifying the indexing policy after collection creation is not
allowed, but will be supported in a future release of DocumentDB.

**Note:** By default, DocumentDB indexes all paths within documents
consistently with a hash index. The internal Timestamp (\_ts) path is
stored with a range index.

### Automatic indexing

You can choose if you want the collection to automatically index all
documents or not. By default, all documents are automatically indexed, but 
you can choose to turn it off. When indexing is turned
off, documents can be accessed only through their self-links or by
queries using ID.

With automatic indexing turned off, you can still selectively add only
specific documents to the index. Conversely, you can leave automatic
indexing on and selectively choose to exclude only specific documents.
Indexing on/off configurations are useful when you have only a subset of
documents that need to be queried.

You can configure the default policy by specifying the value for the
automatic property to be true or false. To override for a single document,
you can set the x-ms-indexingdirective request header while inserting
or replacing a document.

For example, the following sample shows how to include a document explicitly
using the [DocumentDB .NET SDK](https://github.com/Azure/azure-documentdb-java) and the [RequestOptions.IndexingDirective](http://msdn.microsoft.com/library/microsoft.azure.documents.client.requestoptions.indexingdirective.aspx) property.

    // If you want to override the default collection behavior to either     
    // exclude (or include) a Document from indexing,                                                                                           
    // use the RequestOptions.IndexingDirective property.                                  
                                                                             
    client.CreateDocumentAsync(defaultCollection.SelfLink,  
        new { id = "AndersenFamily", isRegistered = true },                            
        new RequestOptions { IndexingDirective = IndexingDirective.Include });                                                                 
        


### Indexing modes

You can choose between synchronous (**Consistent**) and asynchronous
(**Lazy**) index updates. By default, the index is updated synchronously
on each insertion, replacement, or deletion action taken on a document in the collection. This
enables the queries to honor the same consistency level as that of the
document reads without any delay for the index to catch up.

While DocumentDB is write optimized and supports sustained volumes of
document writes along with synchronous index maintenance, you can
configure certain collections to update their index lazily. Lazy
indexing is great for scenarios where data is written in bursts, and you
want to amortize the work required to index content over a longer period
of time. This allows you to use your provisioned throughput effectively,
and serve write requests at peak times with minimal latency.  With lazy
indexing turned on, query results will eventually be
consistent regardless of the consistency level configured for the
database account.                                                                                     

The following sample show how create a DocumentDB collection using the
.NET SDK with consistent automatic indexing on all document insertions.


     // Default collection creates a hash index for all string and numeric    
     // fields. Hash indexes are compact and offer efficient                                                                                           
     // performance for equality queries.                                     
                                                                              
     var defaultCollection = new DocumentCollection { Id ="defaultCollection" };                                                   
                                                                              
     // Optional. Override Automatic to false for opt-in indexing of documents.
     defaultCollection.IndexingPolicy.Automatic = true;                       
                                                                              
     // Optional. Set IndexingMode to Lazy for bulk import/read heavy        
     // collections. Queries might return stale results with Lazy indexing.
     defaultCollection.IndexingPolicy.IndexingMode = IndexingMode.Consistent; 
                                                                              
     defaultCollection = await client.CreateDocumentCollectionAsync(database.SelfLink,defaultCollection);

### Index types and precision

The type or scheme used for index entries has a direct impact on index
storage and performance. For a scheme using higher precision, queries
are typically faster. However, there is also a higher storage overhead
for the index. Choosing a lower precision means that more documents
might have to be processed during query execution, but the storage
overhead will be lower.

The index precision for values at any path can be between 3 and 7 bytes. 
Since the same path might have numeric and string
values in different documents, these can be controlled separately. In
the .NET SDK, these values correspond to the [NumericPrecision](http://msdn.microsoft.com/library/microsoft.azure.documents.indexingpath.numericprecision.aspx) and
[StringPrecision](http://msdn.microsoft.com/library/azure/microsoft.azure.documents.indexingpath.stringprecision.aspx) properties.

There are two supported kinds of index types: Hash and Range. Choosing
an index type of **Hash** enables efficient equality queries. For most
use cases, hash indexes do not need a higher precision than the default value
of 3 bytes.

Choosing an index type of **Range** enables range queries (using >, <, >=, <=, !=). For paths that have large ranges of values, it is recommended to use a higher precision like 6 bytes. A common use case
that requires a higher precision range index is timestamps stored as epoch time.

If your use case does not require efficient range queries, then the
default of hash indexes offer the best tradeoff of storage and
performance. Note that to support range queries, you must specify a
custom index policy.

> [AZURE.NOTE] Range indexes are supported only for numeric values.
  
The following example shows how to increase the precision for range
indexes in a collection using the .NET SDK. Note that this uses a
special path "/" – which is explained in the next section.


     // If your collection has numeric fields that need to be queried    
     // against ranges (>,>=,<=,<), then you can configure the collection to 
     // use range queries for all numeric values.
 
    var rangeDefault = new DocumentCollection { Id = "rangeCollection" };                                                              
    rangeDefault.IndexingPolicy.IncludedPaths.Add(
        new IndexingPath {
            IndexType = IndexType.Range, 
            Path = "/",
            NumericPrecision = 7 });
            
    rangeDefault = await client.CreateDocumentCollectionAsync(database.SelfLink, rangeDefault);   


### Index paths

Within documents, you can choose which paths must be included or
excluded from indexing. This can offer improved write performance and
lower index storage for scenarios when the query patterns are known
beforehand.

Index paths start with the root (/) and typically end with the ?
wildcard operator, denoting that there are multiple possible values for
the prefix. For example, to serve SELECT * FROM Families F WHERE
F.familyName = "Andersen", you must include an index path for
/"familyName"/?in the collection’s index policy.                                                      

Index paths can also use the * wildcard operator to specify the
behavior for paths recursively under the prefix. For example,
/"payload"/* can be used to exclude everything under the payload
property from indexing.

Here are the common patterns for specifying index paths:

<table border="0" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td valign="top">
                <p>
                    <strong>Path</strong>
                </p>
            </td>
            <td valign="top">
                <p>
                    <strong>Description/use case</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td valign="top">
                <p>
                    /
                </p>
            </td>
            <td valign="top">
                <p>
                    Default path for collection. Recursive and applies to whole document tree.
                </p>
            </td>
        </tr>
        <tr>
            <td valign="top">
                <p>
                    /"prop"/?
                </p>
            </td>
            <td valign="top">
                <p>
                    Index path required to serve queries like the following (with Hash or Range types respectively):
                </p>
                <p>
                    SELECT * FROM collection c WHERE c.prop = "value"
                </p>
                <p>
                    SELECT * FROM collection c WHERE c.prop &gt; 5
                </p>
            </td>
        </tr>
        <tr>
            <td valign="top">
                <p>
                    /"prop"/*
                </p>
            </td>
            <td valign="top">
                <p>
                    Index path for all paths under the specified label. Works with the following queries
                </p>
                <p>
                    SELECT * FROM collection c WHERE c.prop = "value"
                </p>
                <p>
                    SELECT * FROM collection c WHERE c.prop.subprop &gt; 5
                </p>
                <p>
                    SELECT * FROM collection c WHERE c.prop.subprop.nextprop = "value"
                </p>

            </td>
        </tr>
        <tr>
            <td valign="top">
                <p>
                    /"props"/[]/?
                </p>
            </td>
            <td valign="top">
                <p>
                    Index path required to serve iteration and JOIN queries against arrays of scalars like ["a", "b", "c"]:
                </p>
                <p>
                    SELECT tag FROM tag IN collection.props WHERE tag = "value"
                </p>
                <p>
                    SELECT tag FROM collection c JOIN tag IN c.props WHERE tag > 5
                </p>
            </td>
        </tr>
        <tr>
            <td valign="top">
                <p>
                    /"props"/[]/"subprop"/?
                </p>
            </td>
            <td valign="top">
                <p>
                    Index path required to serve iteration and JOIN queries against arrays of objects like [{subprop: "a"}, {subprop: "b"}]:
                </p>
                <p>
                    SELECT tag FROM tag IN collection.props WHERE tag.subprop = "value"
                </p>
                <p>
                    SELECT tag FROM collection c JOIN tag IN c.props WHERE tag.subprop = "value"
                </p>
            </td>
        </tr>        
        <tr>
            <td valign="top">
                <p>
                    /"prop"/"subprop"/
                </p>
            </td>
            <td valign="top">
                <p>
                    Index path used during query execution to prune documents that do not have the specified path.
                </p>
            </td>
        </tr>
        <tr>
            <td valign="top">
                <p>
                    /"prop"/"subprop"/?
                </p>
            </td>
            <td valign="top">
                <p>
                    Index path required to serve queries (with Hash or Range types respectively):
                </p>
                <p>
                    SELECT * FROM collection c WHERE c.prop.subprop = "value"
                </p>
                <p>
                    SELECT * FROM collection c WHERE c.prop.subprop &gt; 5
                </p>
            </td>
        </tr>
    </tbody>
</table>

> [AZURE.NOTE] While setting custom index paths, you are required to specify
the default indexing rule for the entire document tree denoted by the
special path "/". 

The following example configures a specific path with range indexing and a
custom precision value of 7 bytes:


    // If you only want to specify range queries against a specific field,   
    // then use a range index against that field. Doing so reduces the   
    // amount of storage required for indexes for the collection. In this    
    // case, the query creates an index against the JSON path                   
    // /"CreatedTimestamp"/? allowing queries of the form WHERE CreatedTimestamp [>] X            
    
    var pathRange = new DocumentCollection { Id = "rangeSinglePathCollection" };    
    
    pathRange.IndexingPolicy.IncludedPaths.Add(
        new IndexingPath {
            IndexType = IndexType.Range,
            Path = "/\"CreatedTimestamp\"/?",
            NumericPrecision = 7
        });
    
    pathRange.IndexingPolicy.IncludedPaths.Add(
        new IndexingPath {
            Path = "/"
        });
        
    pathRange = await client.CreateDocumentCollectionAsync(database.SelfLink, pathRange);


DocumentDB returns an error when a query uses a range operator but does
not have a range index against the queried path, and does not have any
other filters that can be served from the index. But these queries can
still be performed without a range index using the
x-ms-documentdb-allow-scans header in the REST API or the
AllowScanInQueryrequest option using the .NET SDK.                                                                                  

The next example excludes a sub-tree of paths from indexing using the
"*" wildcard.

    var excluded = new DocumentCollection { Id = "excludedPathCollection" };
    excluded.IndexingPolicy.IncludedPaths.Add(new IndexingPath {  Path = "/" });
    excluded.IndexingPolicy.ExcludedPaths.Add("/\" nonIndexedContent\"/*");
    
    excluded = await client.CreateDocumentCollectionAsync(database.SelfLink, excluded);


Performance tuning
------------------

As you evaluate different indexing policy configurations, you should
measure the storage and throughput implications of the policy through
the DocumentDB APIs.

To check the storage quota and usage of a collection, run a HEAD or GET request
against the collection resource, and inspect the x-ms-request-quota and
the x-ms-request-usage headers. In the .NET SDK, the [DocumentSizeQuota](http://msdn.microsoft.com/library/dn850325.aspx)
and [DocumentSizeUsage](http://msdn.microsoft.com/library/azure/dn850324.aspx) properties in [ResourceResponse<T\>](http://msdn.microsoft.com/library/dn799209.aspx) contain these
corresponding values.


     // Measure the document size usage (which includes the index size) against   
     // different policies.        
     ResourceResponse<DocumentCollection> collectionInfo = await client.ReadDocumentCollectionAsync(collectionSelfLink);  
     Console.WriteLine("Document size quota: {0}, usage: {1}", collectionInfo.DocumentSizeQuota, collectionInfo.DocumentSizeUsage);


To measure the overhead of indexing on each write operation (create,
update, or delete), inspect the x-ms-request-charge header (or the
equivalent [RequestCharge](http://msdn.microsoft.com/library/dn799099.aspx) property in [ResourceResponse<T\>](http://msdn.microsoft.com/library/dn799209.aspx) in the .NET
SDK) to measure the number of request units consumed by these
operations.


     // Measure the performance (request units) of writes.     
     ResourceResponse<Document> response = await client.CreateDocumentAsync(collectionSelfLink, myDocument);              
     Console.WriteLine("Insert of document consumed {0} request units", response.RequestCharge);
     
     // Measure the performance (request units) of queries.    
     IDocumentQuery<dynamic> queryable =  client.CreateDocumentQuery(collectionSelfLink, queryString).AsDocumentQuery();                                  
     double totalRequestCharge = 0;
     while (queryable.HasMoreResults)
     {
        FeedResponse<dynamic> queryResponse = await queryable.ExecuteNextAsync<dynamic>(); 
        Console.WriteLine("Query batch consumed {0} request units",queryResponse.RequestCharge);
        totalRequestCharge += queryResponse.RequestCharge;
     }
     
     Console.WriteLine("Query consumed {0} request units in total", totalRequestCharge);

Next Steps
------------------
Try out the samples below for managing indexing policy, and learn more about DocumentDB's query language in the links below.

1.	[DocumentDB .NET Index Management code samples](https://code.msdn.microsoft.com/Azure-DocumentDB-NET-Code-6b3da8af/sourcecode?fileId=134860&pathId=1399591856)
2.	[DocumentDB REST API Collection Operations](https://msdn.microsoft.com/library/azure/dn782195.aspx)
3.	[Query with DocumentDB SQL](documentdb-sql-query.md)


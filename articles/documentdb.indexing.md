<properties title="DocumentDB Indexing" pageTitle="DocumentDB Indexing | Azure" description="required" metaKeywords="" services="" solutions="" documentationCenter="" authors="" videoId="" scriptId="" />

#Introduction
DocumentDB supports querying over JSON documents without requiring users to specify any schema or index definitions. To deliver this capability, DocumentDB maintains an index (inverted) tree for lookup of documents that match any given field or path in the collection.  

DocumentDB indexing is built with careful consideration of storage cost efficiency, support for multi-tenancy, write performance and fast, consistent queries. Unlike traditional B+ tree based indexes, DocumentDB employs log structured techniques that allow the index to be kept up to date in the face of heavy writes.  

The default indexing configuration for the service is ideal for a wide range of applications. Developers have the capability to fine-tune indexing behaviors such as index consistency, index type, precision and per-path/field selection, and per-document selection in order to best suit their application needs.  

#Indexing API 
DocumentDB supports different index policy options that can be configured by developers to control index behavior, and make tradeoffs between query performance, index update performance and storage costs.  

-	Collections can be configured with an automatic (default) or “opt-in” indexing mode for each document
-	Collections can be configured with a specific index consistency. Consistent indexing is kept up to date (matching the account’s data consistency level). Lazy Indexing is like lazy initialization in programming - the index is updated only when the collection is idle, and offers only eventual consistency guarantees. Refer to the consistency levels documentation for more information.
-	Each field or nested path can be configured as a hash index (best for equality queries), range index (best for range queries) or explicitly excluded from indexing for storage or performance gains. Developers can also specify the precision of the index hash entry in bytes to trade off storage and query performance.  
 
#Creating a Collection with Indexing Directives
Refer to the indexing directive specification for more information. For example, the indexing policy can be specified in the REST call to POST collections as shown below.  

    POST https://.../colls HTTP/1.1
    x-ms-date: Tue, 10 Jun 2014 05:57:43 GMT
    authorization:..
    User-Agent: Microsoft.Azure.Documents.Client/1.0.0.0
    x-ms-version: 2014-02-25
    Host: …
    Content-Length: 77
    Expect: 100-continue
    
    {"name":"ConsistentColl","indexingPolicy":{"automatic":true,"indexingMode":"Consistent"}}  

Indexing policy can be configured using any of the supported SDKs, for example, using the .NET SDK, developers can specify the policy as follows: 


    var collection = new DocumentCollection { Name = "ConsistentColl" };
    collection.IndexingPolicy.IndexingMode = IndexingMode.Consistent;
    await client.CreateDocumentCollectionAsync(database.SelfLink, collection);


#Getting Index Policy and Usage Collections
A GET call against collections returns the index policy as well as the data storage used in bytes and index storage used in bytes. For example, here’s a sample response using the index API.  

    HTTP/1.1 200 Ok
    Transfer-Encoding: chunked
    Server: Microsoft-HTTPAPI/2.0
    x-ms-request-charge: 1.00
    x-ms-collection-quota-mb: 2048
    etag: "00003b00-0000-0000-0000-5396a09c0000"
    x-ms-collection-data-usage-mb: 0
    x-ms-collection-index-usage-mb: 0
    x-ms-serviceversion: version=1.0.2611.1
    collection-partition-index: 0
    x-ms-session-token: 22662
    x-ms-last-state-change-utc: Sat, 07 Jun 2014 08:44:03.8757438317376 GMT
    collection-service-index: 0
    x-ms-schemaversion: 1.8
    lsn: 22662
    x-ms-activity-id: 3e134323-521b-495c-8bc9-e925dc11e8c2
    Date: Tue, 10 Jun 2014 06:07:25 GMT
    
    {"name":"ConsistentColl","indexingPolicy":{"automatic":true,"indexingMode":"Consistent"},"id":"BjEDPOMAC3Y=","ts":"\/Date(1402380444000)\/","self":"dbs\/BjEDPA==\/colls\/BjEDPOMAC3Y=\/","etag":"\"00003b00-0000-0000-0000-5396a09c0000\"","docs":"docs\/","sprocs":"sprocs\/","triggers":"triggers\/","udfs":"udfs\/","conflicts":"conflicts\/"}


>During public preview, collection indexing policy is immutable. To change indexing policy requires migrating to a new collection.  

This can be accessed equivalently using the SDKs:

    var collection = await client.ReadDocumentCollectionAsync(consistentCollection.SelfLink);
    Console.WriteLine("Current data usage is {0}MB, index usage is {1}MB", collection.CurrentDataSizeInMB, collection.CurrentIndexSizeInMB);

#Indexing Mode
DocumentDB supports four developer tunable consistency levels – strong, bounded staleness, session and eventual consistency. Queries offer the same guarantees as the consistency levels. By default, the results of a query are guaranteed to match the consistency level which is requested by the client. DocumentDB’s index is log-structured, and designed to always keep up to date and consistent with data regardless of volume. When documents are inserted or updated, they are immediately available in query results.  

For applications where query behavior can be eventually consistent, optionally the indexing policy can be configured to use Lazy Indexing. In this case, the index is updated in an eventually consistent manner whenever the collection is quiescent (operating under maximum capacity).  To summarize, here is the table of query consistency behavior with the different database account configurations.  

Data Consistency  |Indexing Policy  |Query Behavior  
------------------|-----------------|--------------  
Strong	|Consistent	|Strong  
Bounded Staleness	|Consistent 	|Bounded Staleness  
Session	|Consistent	|Session  
Eventual	|Consistent	|Eventual  
Strong	|Lazy	|Eventual  
Bounded Staleness	|Lazy	|Eventual  
Session	|Lazy	|Eventual  
Eventual	|Lazy	|Eventual  

Consistent indexing is the default; here’s an example of how to configure a collection to use lazy indexing:

    var collection = new DocumentCollection { Name = "LazyCollection" };
    collection.IndexingPolicy.IndexingMode = IndexingMode.Lazy;
    
    await client.CreateDocumentCollectionAsync(database.SelfLink, collection);
    
    // Queries that need most recent data must wait for index to catch up

#Selective Indexing by Document
Individual documents can be excluded from indexing. This can be used for staging documents or bulk inserts or to archive old documents without maintaining an index over them. For example, this sample excludes a document using RequestOptions.

    var collection = new DocumentCollection { Name = "AutomaticCollection" };
    collection.IndexingPolicy.Automatic = false;
    collection = await client.CreateDocumentCollectionAsync(database.SelfLink, collection);
    
    await client.CreateDocumentAsync(collection.SelfLink, doc, new RequestOptions { IndexingDirective.Exclude });

  
Alternatively, collections can specify an opt-in model where documents are indexed only when specified as shown below:

    var collection = new DocumentCollection { Name = "ManualCollection" };
    collection.IndexingPolicy.Automatic = false;
    collection = await client.CreateDocumentCollectionAsync(database.SelfLink, collection);
    
    await client.CreateDocumentAsync(collection.SelfLink, doc, new RequestOptions { IndexingDirective.Include });

#Selective Indexing by Property or Nested Paths
DocumentDB also supports “opt-in” indexing by path or property. Developers can specify the path in the documents that must be indexed, and optionally include additional details like the type of the index, and the precision.

var collection = new DocumentCollection { Name = "SelectiveIndexCollection" };
collection.IndexingPolicy.Paths.Included.Add(new IncludedPath{
Value = "/user/screen_name/",
IndexType = IndexType.Hash,
StringPrecision = 3});
collection.IndexingPolicy.Paths.Excluded.Add("/"); //exclude everything else


Specific paths can be excluded from indexing using Excluded paths. The overhead in terms of storage and amount of resource consumption for index update is roughly proportional to the number of paths in a document. Hence excluding unused paths helps improve insert performance.

    var collection = new DocumentCollection { Name = "ExcludedCollection" };
    collection.IndexingPolicy.Automatic = false;
    collection.IndexingPolicy.Paths.Excluded.Add("/user/screen_name/");
    collection.IndexingPolicy.Paths.Excluded.Add("/message/");
    collection.IndexingPolicy.Paths.Excluded.Add("/payload/*”);
    
    collection.IndexingPolicy.Paths.Included.Add(new IncludedPath{Value = "/"}); //include everything else

>When two overlapping ranges are specified, the rules corresponding to the smaller range are applied to the intersection between them. For example, if user has two properties, screen_name and location, and /user/ is included but /user/screen_name/ is excluded – then “user.location” can be used in queries, but “user.screen_name” cannot.  

#Advanced – Index Types and Precision
DocumentDB supports two types of indexes – hash and range indexes.  
 
A **hash index** generates values uniformly across the specified byte range, so the probability of two different values returning the same hash is minimal. This makes it best suited for equality queries.  A hash index can be between 3 to 8 bytes in size.  

A **range index** maps ranges of values to the same hash, and is best suited for range queries (using >, <. >=, <=, !=). A range index can be between 3 to 8 bytes in size. This is supported currently only for numeric values.  

**Index precision** is a tuning option to trade off storage against query performance on a per-path basis. A smaller index precision (3 bytes) leads to more index collisions and query processing times, but takes up lesser storage space on disk.  

Use the index storage in bytes value returned from GET collection to tune the index precision values for collections to match data and query patterns.  

#Specifying Indexing Directives 

Indexing directives have to be specified in POST of collection in the payload (body) of the API call. The data is in JSON and includes sections for the indexing mode, automatic behavior, and configurations for individual paths (properties).  

![][1]
 
The indexing mode can be Lazy or Consistent. Lazy indexing is similar to lazy evaluation in that indexing isn’t performed right away to allow higher throughput on writes. Indexing is kept up to date when the collection is “quescient”, i.e., has cycles available.  

![][2]
 
Indexing can be automatic or manual. Automatic indexing supports an “opt-out” model where individual documents can be left out of indexing. When automatic is set to false, DocumentDB supports an “opt-in” model where documents can be explicitly added to the index.  

![][3]
 
DocumentDB allows configuration of indexing on a path-level. This has two use-cases  - improve and fine tune query performance using the right index type and precision, and to save on storage costs and index maintenance overhead by excluding certain paths unused in queries.  

![][4]
 
Multiple paths can be specified as included or excluded, each with the specified behavior. A special path (/) can be used to denote root. In case of overlaps, the behavior of the more specific path is selected.  

![][5]  

![][6]
 
 
Each included path has the value of the path, the type (hash or range are currently supported), and the precision of numeric and string values at the path. The paths are expressed in the directory-style notation. For example, a document collection containing documents like {“a”: 4, “b:” {“c:” 3}} needs index path /a/ to execute a “SELECT * FROM docs WHERE a = 3” and index path /b/c to query for “SELECT * FROM docs WHERE b.c = 4”.  

There are two types of indexes currently supported – hash and range.  String types support only hash. Numbers support both hash and range. Hash indexes are best suited for workloads with point lookups like the previous example “SELECT * FROM docs WHERE a = 3”. Range lookups are best suited for range queries like “SELECT * FROM docs WHERE a > 3”.  

Index precision allows developers to fine tune the tradeoff between performance and storage. DocumentDB implements an inverted index containing of a hash  

![][7]
 
Excluded paths just consist of an array of excluded paths. If a path e.g. “/a/” is excluded, then queries against that property will return an error. Excluded paths can contain wildcards.   

![][8]
 
Each path value can be one of the following:
-	The root label (/) denoting the default. This must be present in either included or excluded paths for the collection
-	A path like /”message”/ or /”user”/”screen_name”/ containing a series of labels separated by /
-	A path ending with wildcard “*” like /”app_metadata”/* - currently supported only for “Excludes”  

![][9]

 

[1]: ./media/documentdb.indexing/Index1.png
[2]: ./media/documentdb.indexing/Index2.png
[3]: ./media/documentdb.indexing/Index3.png
[4]: ./media/documentdb.indexing/Index4.png
[5]: ./media/documentdb.indexing/Index5.png
[6]: ./media/documentdb.indexing/Index6.png
[7]: ./media/documentdb.indexing/Index7.png
[8]: ./media/documentdb.indexing/Index8.png
[9]: ./media/documentdb.indexing/Index9.png
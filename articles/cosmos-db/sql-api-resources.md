---
title: Azure Cosmos DB resource model and concepts | Microsoft Docs
description: Learn about Azure Cosmos DB’s hierarchical model of databases, collections, user defined function (UDF), documents, permissions to manage resources, and more.
keywords: Hierarchical model, cosmosdb, azure, Microsoft azure
services: cosmos-db
author: rafats
manager: kfile

ms.service: cosmos-db
ms.component: cosmosdb-sql
ms.devlang: na
ms.topic: conceptual
ms.date: 05/07/2018
ms.author: rafats
ms.custom: H1Hack27Feb2017

---
# Azure Cosmos DB hierarchical resource model and core concepts

The database entities that Azure Cosmos DB manages are referred to as **resources**. Each resource is uniquely identified by a logical URI. You can interact with the resources using standard HTTP verbs, request/response headers, and status codes. 

This article answers the following questions:

* What is Azure Cosmos DB's resource model?
* What are system defined resources as opposed to user-defined resources?
* How do I address a resource?
* How do I work with collections?
* How do I work with stored procedures, triggers and User-Defined Functions (UDFs)?

## Hierarchical resource model
As the following diagram illustrates, the Azure Cosmos DB hierarchical **resource model** consists of sets of resources under a database account, each addressable via a logical and stable URI. A set of resources are referred to as a **feed** in this article. 

> [!NOTE]
> Azure Cosmos DB offers a highly efficient TCP protocol, which is also RESTful in its communication model, available through the [SQL .NET client API](sql-api-sdk-dotnet.md).
> 
> 

![Azure Cosmos DB hierarchical resource model][1]  
**Hierarchical resource model**   

To start working with resources, you must [create a database account](create-sql-api-dotnet.md) using your Azure subscription. A database account can consist of a set of **databases**, each containing multiple **collections**, each of which in turn contain **stored procedures, triggers, UDFs, documents, and related attachments**. A database also has associated **users**, each with a set of **permissions** to access collections, stored procedures, triggers, UDFs, documents, or attachments. While databases, users, permissions, and collections are system-defined resources with well-known schemas, documents, and attachments contain arbitrary, user-defined JSON content.  

| Resource | Description |
| --- | --- |
| Database account |A database account is associated with a set of databases and a fixed amount of blob storage for attachments. You can create one or more database accounts using your Azure subscription. For more information, visit the [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/). |
| Database |A database is a logical container of document storage partitioned across collections. It is also a users container. |
| User |The logical namespace for scoping permissions. |
| Permission |An authorization token associated with a user for access to a specific resource. |
| Collection |A collection is a container of JSON documents and the associated JavaScript application logic. Collections can span one or more partitions/servers and can scale to handle practically unlimited volumes of storage or throughput. |
| Stored Procedure |Application logic written in JavaScript, which is registered with a collection and transactionally executed within the database engine. |
| Trigger |Application logic written in JavaScript executed before or after either an insert, replace, or delete operation. |
| UDF |Application logic written in JavaScript. UDFs enable you to model a custom query operator and thereby extend the core SQL API query language. |
| Document |User defined (arbitrary) JSON content. By default, no schema needs to be defined nor do secondary indices need to be provided for all the documents added to a collection. |
| Attachment |An attachment is a special document containing references and associated metadata for external blob/media. The developer can choose to have the blob managed by Cosmos DB or store it with an external blob service provider such as OneDrive, Dropbox, etc. |

## System vs. user-defined resources
Resources such as database accounts, databases, collections, users, permissions, stored procedures, triggers, and UDFs - all have a fixed schema and are called system resources. In contrast, resources such as documents and attachments have no restrictions on the schema and are examples of user-defined resources. In Cosmos DB, both system and user-defined resources are represented and managed as standard-compliant JSON. All resources, system, or user defined, have the following common properties:

> [!NOTE]
> All system generated properties in a resource are prefixed with an underscore (_) in their JSON representation.
> 
> 

<table>
    <tbody>
        <tr>
            <td valign="top"><p><strong>Property</strong></p></td>
            <td valign="top"><p><strong>User settable or system generated?</strong></p></td>
            <td valign="top"><p><strong>Purpose</strong></p></td>
        </tr>
        <tr>
            <td valign="top"><p>_rid</p></td>
            <td valign="top"><p>System generated</p></td>
            <td valign="top"><p>System generated, unique, and hierarchical identifier of the resource</p></td>
        </tr>
        <tr>
            <td valign="top"><p>_etag</p></td>
            <td valign="top"><p>System generated</p></td>
            <td valign="top"><p>etag of the resource required for optimistic concurrency control</p></td>
        </tr>
        <tr>
            <td valign="top"><p>_ts</p></td>
            <td valign="top"><p>System generated</p></td>
            <td valign="top"><p>Last updated timestamp of the resource</p></td>
        </tr>
        <tr>
            <td valign="top"><p>_self</p></td>
            <td valign="top"><p>System generated</p></td>
            <td valign="top"><p>Unique addressable URI of the resource</p></td>
        </tr>
        <tr>
            <td valign="top"><p>id</p></td>
            <td valign="top"><p>Either</p></td>
            <td valign="top"><p>User-defined unique name of the resource (with the same partition key value). If the user does not specify an id, an id is system generated</p></td>
        </tr>
    </tbody>
</table>

### Wire representation of resources
Cosmos DB does not mandate any proprietary extensions to the JSON standard or special encodings; it works with standard compliant JSON documents.  

### Addressing a resource
All resources are URI addressable. The value of the **_self** property of a resource represents the relative URI of the resource. The format of the URI consists of the /\<feed\>/{_rid} path segments:  

| Value of the _self | Description |
| --- | --- |
| /dbs |Feed of databases under a database account |
| /dbs/{dbName} |Database with an id matching the value {dbName} |
| /dbs/{dbName}/colls/ |Feed of collections under a database |
| /dbs/{dbName}/colls/{collName} |Collection with an id matching the value {collName} |
| /dbs/{dbName}/colls/{collName}/docs |Feed of documents under a collection |
| /dbs/{dbName}/colls/{collName}/docs/{docId} |Document with an id matching the value {doc} |
| /dbs/{dbName}/users/ |Feed of users under a database |
| /dbs/{dbName}/users/{userId} |User with an id matching the value {user} |
| /dbs/{dbName}/users/{userId}/permissions |Feed of permissions under a user |
| /dbs/{dbName}/users/{userId}/permissions/{permissionId} |Permission with an id matching the value {permission} |

Each resource has a unique user-defined name exposed via the id property. Note: for documents, if the user does not specify an id, the SDKs automatically generate a unique id for the document. The id is a user-defined string, of up to 256 characters that is unique within the context of a specific parent resource. 

Each resource also has a system generated hierarchical resource identifier (also referred to as an RID), which is available via the _rid property. The RID encodes the entire hierarchy of a given resource and it is a convenient internal representation used to enforce referential integrity in a distributed manner. The RID is unique within a database account and it is internally used by Cosmos DB for efficient routing without requiring cross partition lookups. The values of the _self and the  _rid properties are both alternate and canonical representations of a resource. 

The REST APIs support addressing of resources and routing of requests by both the id and the _rid properties.

## Database accounts
You can provision one or more Cosmos DB database accounts using your Azure subscription.

You can create and manage Cosmos DB database accounts via the Azure portal at [http://portal.azure.com/](https://portal.azure.com/). Creating and managing a database account requires administrative access and can only be performed under your Azure subscription. 

### Database account properties
As part of provisioning and managing a database account you can configure and read the following properties:  

<table border="0" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td valign="top"><p><strong>Property Name</strong></p></td>
            <td valign="top"><p><strong>Description</strong></p></td>
        </tr>
        <tr>
            <td valign="top"><p>Consistency Policy</p></td>
            <td valign="top"><p>Set this property to configure the default consistency level for all the collections under your database account. You can override the consistency level on a per request basis using the [x-ms-consistency-level] request header. <p><p>This property only applies to the <i>user-defined resources</i>. All system defined resources are configured to support reads/queries with strong consistency.</p></td>
        </tr>
        <tr>
            <td valign="top"><p>Authorization Keys</p></td>
            <td valign="top"><p>The primary and secondary master and readonly keys that provide administrative access to all of the resources under the database account.</p></td>
        </tr>
    </tbody>
</table>

In addition to provisioning, configuring and managing your database account from the Azure portal, you can also programmatically create and manage Cosmos DB database accounts by using the [Azure Cosmos DB REST APIs](/rest/api/cosmos-db/) as well as [client SDKs](sql-api-sdk-dotnet.md).  

## Databases
A Cosmos DB database is a logical container of one or more collections and users, as shown in the following diagram. You can create any number of databases under a Cosmos DB database account subject to offer limits.  

![Database account and collections hierarchical model][2]  
**A Database is a logical container of users and collections**

A database can contain unlimited document storage partitioned within collections.

### Elastic scale of an Azure Cosmos DB database
A Cosmos DB database is elastic by default – ranging from a few GB to petabytes of SSD backed document storage and provisioned throughput. 

Unlike a database in traditional RDBMS, a database in Cosmos DB is not scoped to a single machine. With Cosmos DB, as your application’s scale needs to grow, you can create more collections, databases, or both. Indeed, various first party applications within Microsoft have been using Azure Cosmos DB at a consumer scale by creating extremely large Azure Cosmos DB databases each containing thousands of collections with terabytes of document storage. You can grow or shrink a database by adding or removing collections to meet your application’s scale requirements. 

You can create any number of collections within a database subject to the offer. Each collection, or set of collections (within a database), has SSD backed storage and throughput provisioned for you depending on the selected offer.

An Azure Cosmos DB database is also a container of users. A user, in-turn, is a logical namespace for a set of permissions that provides fine-grained authorization and access to collections, documents, and attachments.  

As with other resources in the Azure Cosmos DB resource model, databases can be created, replaced, deleted, read, or enumerated easily using either the [REST APIs](/rest/api/cosmos-db/) or any of the [client SDKs](sql-api-sdk-dotnet.md). Azure Cosmos DB guarantees strong consistency for reading or querying the metadata of a database resource. Deleting a database automatically ensures that you cannot access any of the collections or users contained within it.   

## Collections
A Cosmos DB collection is a container for your JSON documents. 

### Elastic SSD backed document storage
A collection is intrinsically elastic - it automatically grows and shrinks as you add or remove documents. Collections are logical resources and can span one or more physical partitions or servers. The number of partitions assigned to a collection is determined by Cosmos DB based on the storage size and the throughput provisioned for the collection or a set of collections. Every partition in Cosmos DB has a fixed amount of SSD-backed storage associated with it, and is replicated for high availability. Partition management is fully managed by Azure Cosmos DB, and you do not have to write complex code or manage your partitions. Cosmos DB collections are **unlimited** in terms of storage and throughput. 

### Automatic indexing of collections
Azure Cosmos DB is a true schema-free database system. It does not assume or require any schema for the JSON documents. As you add documents to a collection, Azure Cosmos DB automatically indexes them and they are available for you to query. Automatic indexing of documents without requiring schema or secondary indexes is a key capability of Azure Cosmos DB and is enabled by write-optimized, lock-free, and log-structured index maintenance techniques. Azure Cosmos DB supports sustained volume of extremely fast writes while still serving consistent queries. Both document and index storage are used to calculate the storage consumed by each collection. You can control the storage and performance trade-offs associated with indexing by configuring the indexing policy for a collection. 

### Configuring the indexing policy of a collection
The indexing policy of each collection allows you to make performance and storage trade-offs associated with indexing. The following options are available to you as part of indexing configuration:  

* Choose whether the collection automatically indexes all of the documents or not. By default, all documents are automatically indexed. You can choose to turn off automatic indexing and selectively add only specific documents to the index. Conversely, you can selectively choose to exclude only specific documents. You can achieve this by setting the automatic property to be true or false on the indexingPolicy of a collection and using the [x-ms-indexingdirective] request header while inserting, replacing, or deleting a document.  
* Choose whether to include or exclude specific paths or patterns in your documents from the index. You can achieve this by setting includedPaths and excludedPaths on the indexingPolicy of a collection respectively. You can also configure the storage and performance trade-offs for range and hash queries for specific path patterns. 
* Choose between synchronous (consistent) and asynchronous (lazy) index updates. By default, the index is updated synchronously on each insert, replace or delete of a document to the collection. This enables the queries to honor the same consistency level as that of the document reads. While Azure Cosmos DB is write optimized and supports sustained volumes of document writes along with synchronous index maintenance and serving consistent queries, you can configure certain collections to update their index lazily. Lazy indexing boosts the write performance further and is ideal for bulk ingestion scenarios for primarily read-heavy collections.

The indexing policy can be changed by executing a PUT on the collection. This can be achieved either through the [client SDK](sql-api-sdk-dotnet.md), the [Azure portal](https://portal.azure.com), or the [REST APIs](/rest/api/cosmos-db/).

### Querying a collection
The documents within a collection can have arbitrary schemas and you can query documents within a collection without providing any schema or secondary indices upfront. You can query the collection using the [Azure Cosmos DB SQL syntax reference](https://msdn.microsoft.com/library/azure/dn782250.aspx), which provides rich hierarchical, relational, and spatial operators and extensibility via JavaScript-based UDFs. JSON grammar allows for modeling JSON documents as trees with labels as the tree nodes. This is exploited both by SQL API’s automatic indexing techniques as well as Azure Cosmos DB's SQL dialect. The SQL query language consists of three main aspects:   

1. A small set of query operations that map naturally to the tree structure including hierarchical queries and projections. 
2. A subset of relational operations including composition, filter, projections, aggregates, and self joins. 
3. Pure JavaScript based UDFs that work with (1) and (2).  

The Azure Cosmos DB query model attempts to strike a balance between functionality, efficiency, and simplicity. The Azure Cosmos DB database engine natively compiles and executes the SQL query statements. You can query a collection using the [REST APIs](/rest/api/cosmos-db/) or any of the [client SDKs](sql-api-sdk-dotnet.md). The .NET SDK comes with a LINQ provider.

> [!TIP]
> You can try out the SQL API and run SQL queries against our dataset in the [Query Playground](https://www.documentdb.com/sql/demo).
> 
> 

## Multi-document transactions
Database transactions provide a safe and predictable programming model for dealing with concurrent changes to the data. In RDBMS, the traditional way to write business logic is to write **stored-procedures** and/or **triggers** and ship it to the database server for transactional execution. In RDBMS, the application programmer is required to deal with two disparate programming languages: 

* The (non-transactional) application programming language (for example, JavaScript, Python, C#, Java, etc.)
* T-SQL, the transactional programming language that is natively executed by the database

By virtue of its deep commitment to JavaScript and JSON directly within the database engine, Azure Cosmos DB provides an intuitive programming model for executing JavaScript based application logic directly on the collections in terms of stored procedures and triggers. This allows for both of the following:

* Efficient implementation of concurrency control, recovery, automatic indexing of the JSON object graphs directly in the database engine
* Naturally expressing control flow, variable scoping, assignment, and integration of exception handling primitives with database transactions directly in terms of the JavaScript programming language

The JavaScript logic registered at a collection level can then issue database operations on the documents of the given collection. Azure Cosmos DB implicitly wraps the JavaScript based stored procedures and triggers within an ambient ACID transaction with snapshot isolation across documents within a collection. During the course of its execution, if the JavaScript throws an exception, then the entire transaction is aborted. The resulting programming model is simple yet powerful. JavaScript developers get a "durable" programming model while still using their familiar language constructs and library primitives.   

The ability to execute JavaScript directly within the database engine in the same address space as the buffer pool enables performant and transactional execution of database operations against the documents of a collection. Furthermore, Cosmos DB database engine makes a deep commitment to the JSON and JavaScript eliminates any impedance mismatch between the type systems of application and the database.   

After creating a collection, you can register stored procedures, triggers, and UDFs with a collection using the [REST APIs](/rest/api/cosmos-db/) or any of the [client SDKs](sql-api-sdk-dotnet.md). After registration, you can reference and execute them. Consider the following stored procedure written entirely in JavaScript, the code below takes two arguments (book name and author name) and creates a new document, queries for a document and then updates it – all within an implicit ACID transaction. At any point during the execution, if a JavaScript exception is thrown, the entire transaction aborts.

    function businessLogic(name, author) {
        var context = getContext();
        var collectionManager = context.getCollection();        
        var collectionLink = collectionManager.getSelfLink()

        // create a new document.
        collectionManager.createDocument(collectionLink,
            {id: name, author: author},
            function(err, documentCreated) {
                if(err) throw new Error(err.message);

                // filter documents by author
                var filterQuery = "SELECT * from root r WHERE r.author = 'George R.'";
                collectionManager.queryDocuments(collectionLink,
                    filterQuery,
                    function(err, matchingDocuments) {
                        if(err) throw new Error(err.message);

                        context.getResponse().setBody(matchingDocuments.length);

                        // Replace the author name for all documents that satisfied the query.
                        for (var i = 0; i < matchingDocuments.length; i++) {
                            matchingDocuments[i].author = "George R. R. Martin";
                            // we don’t need to execute a callback because they are in parallel
                            collectionManager.replaceDocument(matchingDocuments[i]._self,
                                matchingDocuments[i]);   
                        }
                    })
            })
    };

The client can "ship" the above JavaScript logic to the database for transactional execution via HTTP POST. For more information about using HTTP methods, see [RESTful interactions with Azure Cosmos DB resources](https://msdn.microsoft.com/library/azure/mt622086.aspx). 

    client.createStoredProcedureAsync(collection._self, {id: "CRUDProc", body: businessLogic})
       .then(function(createdStoredProcedure) {
            return client.executeStoredProcedureAsync(createdStoredProcedure.resource._self,
                "NoSQL Distilled",
                "Martin Fowler");
        })
        .then(function(result) {
            console.log(result);
        },
        function(error) {
            console.log(error);
        });


Notice that because the database natively understands JSON and JavaScript, there is no type system mismatch, no "OR mapping" or code generation magic required.   

Stored procedures and triggers interact with a collection and the documents in a collection through a well-defined object model, which exposes the current collection context.  

Collections in the SQL API can be created, deleted, read, or enumerated easily using either the [REST APIs](/rest/api/cosmos-db/) or any of the [client SDKs](sql-api-sdk-dotnet.md). The SQL API always provides strong consistency for reading or querying the metadata of a collection. Deleting a collection automatically ensures that you cannot access any of the documents, attachments, stored procedures, triggers, and UDFs contained within it.   

## Stored procedures, triggers, and User Defined Functions (UDF)
As described in the previous section, you can write application logic to run directly within a transaction inside of the database engine. The application logic can be written entirely in JavaScript and can be modeled as a stored procedure, trigger, or a UDF. The JavaScript code within a stored procedure or a trigger can insert, replace, delete, read, or query documents within a collection. On the other hand, the JavaScript within a UDF cannot insert, replace, or delete documents. UDFs enumerate the documents of a query's result set and produce another result set. For multi-tenancy, Azure Cosmos DB enforces a strict reservation-based resource governance. Each stored procedure, trigger, or a UDF gets a fixed quantum of operating system resources to do its work. Furthermore, stored procedures, triggers, or UDFs cannot link against external JavaScript libraries and are blacklisted if they exceed the resource budgets allocated to them. You can register, unregister stored procedures, triggers, or UDFs with a collection by using the REST APIs.  Upon registration a stored procedure, trigger, or a UDF is pre-compiled and stored as byte code, which gets executed later. The following section illustrates how you can use the Azure Cosmos DB JavaScript SDK to register, execute, and unregister a stored procedure, trigger, and a UDF. The JavaScript SDK is a simple wrapper over the [REST APIs](/rest/api/cosmos-db/). 

### Registering a stored procedure
Registration of a stored procedure creates a new stored procedure resource on a collection via HTTP POST.  

    var storedProc = {
        id: "validateAndCreate",
        body: function (documentToCreate) {
            documentToCreate.id = documentToCreate.id.toUpperCase();

            var collectionManager = getContext().getCollection();
            collectionManager.createDocument(collectionManager.getSelfLink(),
                documentToCreate,
                function(err, documentCreated) {
                    if(err) throw new Error('Error while creating document: ' + err.message;
                    getContext().getResponse().setBody('success - created ' + 
                            documentCreated.name);
                });
        }
    };

    client.createStoredProcedureAsync(collection._self, storedProc)
        .then(function (createdStoredProcedure) {
            console.log("Successfully created stored procedure");
        }, function(error) {
            console.log("Error");
        });

### Executing a stored procedure
Execution of a stored procedure is done by issuing an HTTP POST against an existing stored procedure resource by passing parameters to the procedure in the request body.

    var inputDocument = {id : "document1", author: "G. G. Marquez"};
    client.executeStoredProcedureAsync(createdStoredProcedure.resource._self, inputDocument)
        .then(function(executionResult) {
            assert.equal(executionResult, "success - created DOCUMENT1");
        }, function(error) {
            console.log("Error");
        });

### Unregistering a stored procedure
Unregistering a stored procedure is done by issuing an HTTP DELETE against an existing stored procedure resource.   

    client.deleteStoredProcedureAsync(createdStoredProcedure.resource._self)
        .then(function (response) {
            return;
        }, function(error) {
            console.log("Error");
        });


### Registering a pre-trigger
Registration of a trigger is done by creating a new trigger resource on a collection via HTTP POST. You can specify if the trigger is a pre or a post trigger and the type of operation it can be associated with (for example, Create, Replace, Delete, or All).   

    var preTrigger = {
        id: "upperCaseId",
        body: function() {
                var item = getContext().getRequest().getBody();
                item.id = item.id.toUpperCase();
                getContext().getRequest().setBody(item);
        },
        triggerType: TriggerType.Pre,
        triggerOperation: TriggerOperation.All
    }

    client.createTriggerAsync(collection._self, preTrigger)
        .then(function (createdPreTrigger) {
            console.log("Successfully created trigger");
        }, function(error) {
            console.log("Error");
        });

### Executing a pre-trigger
Execution of a trigger is done by specifying the name of an existing trigger at the time of issuing the POST/PUT/DELETE request of a document resource via the request header.  

    client.createDocumentAsync(collection._self, { id: "doc1", key: "Love in the Time of Cholera" }, { preTriggerInclude: "upperCaseId" })
        .then(function(createdDocument) {
            assert.equal(createdDocument.resource.id, "DOC1");
        }, function(error) {
            console.log("Error");
        });

### Unregistering a pre-trigger
Unregistering a trigger is done via issuing an HTTP DELETE against an existing trigger resource.  

    client.deleteTriggerAsync(createdPreTrigger._self);
        .then(function(response) {
            return;
        }, function(error) {
            console.log("Error");
        });

### Registering a UDF
Registration of a UDF is done by creating a new UDF resource on a collection via HTTP POST.  

    var udf = { 
        id: "mathSqrt",
        body: function(number) {
                return Math.sqrt(number);
        },
    };
    client.createUserDefinedFunctionAsync(collection._self, udf)
        .then(function (createdUdf) {
            console.log("Successfully created stored procedure");
        }, function(error) {
            console.log("Error");
        });

### Executing a UDF as part of the query
A UDF can be specified as part of the SQL query and is used as a way to extend the core [SQL query language](sql-api-sql-query-reference.md).

    var filterQuery = "SELECT udf.mathSqrt(r.Age) AS sqrtAge FROM root r WHERE r.FirstName='John'";
    client.queryDocuments(collection._self, filterQuery).toArrayAsync();
        .then(function(queryResponse) {
            var queryResponseDocuments = queryResponse.feed;
        }, function(error) {
            console.log("Error");
        });

### Unregistering a UDF
Unregistering a UDF is simply done by issuing an HTTP DELETE against an existing UDF resource.  

    client.deleteUserDefinedFunctionAsync(createdUdf._self)
        .then(function(response) {
            return;
        }, function(error) {
            console.log("Error");
        });

Although the snippets above showed the registration (POST), unregistration (PUT), read/list (GET), and execution (POST) via the [JavaScript SDK](https://github.com/Azure/azure-documentdb-js), you can also use the [REST APIs](/rest/api/cosmos-db/) or other [client SDKs](sql-api-sdk-dotnet.md). 

## Documents
You can insert, replace, delete, read, enumerate, and query arbitrary JSON documents in a collection. Azure Cosmos DB does not mandate any schema and does not require secondary indexes in order to support querying over documents in a collection. The maximum size for a document is 2 MB.   

Being a truly open database service, Azure Cosmos DB does not invent any specialized data types (for example, date time) or specific encodings for JSON documents. Azure Cosmos DB does not require any special JSON conventions to codify the relationships among various documents; the SQL syntax of Azure Cosmos DB provides powerful hierarchical and relational query operators to query and project documents without any special annotations or need to codify relationships among documents using distinguished properties.  

As with all other resources, documents can be created, replaced, deleted, read, enumerated, and queried easily using either REST APIs or any of the [client SDKs](sql-api-sdk-dotnet.md). Deleting a document instantly frees up the quota corresponding to all of the nested attachments. The read consistency level of documents follows the consistency policy on the database account. This policy can be overridden on a per-request basis depending on data consistency requirements of your application. When querying documents, the read consistency follows the indexing mode set on the collection. For "consistent", this follows the account’s consistency policy. 

## Attachments and media
Azure Cosmos DB allows you to store binary blobs/media either with Azure Cosmos DB (maximum of 2 GB per account) or to your own remote media store. It also allows you to represent the metadata of a media in terms of a special document called attachment. An attachment in Azure Cosmos DB is a special (JSON) document that references the media/blob stored elsewhere. An attachment is simply a special document that captures the metadata (for example, location, author etc.) of a media stored in a remote media storage. 

Consider a social reading application that uses Azure Cosmos DB to store ink annotations, and metadata including comments, highlights, bookmarks, ratings, likes/dislikes etc. associated for an e-book of a given user.   

* The content of the book itself is stored in the media storage either available as part of Azure Cosmos DB database account or a remote media store. 
* An application may store each user’s metadata as a distinct document -- for example, Joe’s metadata for book1 is stored in a document referenced by /colls/joe/docs/book1. 
* Attachments pointing to the content pages of a given book of a user are stored under the corresponding document, for example, /colls/joe/docs/book1/chapter1, /colls/joe/docs/book1/chapter2 etc. 

The examples listed above use friendly ids to convey the resource hierarchy. Resources are accessed via the REST APIs through unique resource ids. 

For the media that is managed by Azure Cosmos DB, the _media property of the attachment references the media by its URI. Azure Cosmos DB will ensure to garbage collect the media when all of the outstanding references are dropped. Azure Cosmos DB automatically generates the attachment when you upload the new media and populates the _media to point to the newly added media. If you choose to store the media in a remote blob store managed by you (for example, OneDrive, Azure Storage, DropBox, etc.), you can still use attachments to reference the media. In this case, you will create the attachment yourself and populate its _media property.   

As with all other resources, attachments can be created, replaced, deleted, read, or enumerated easily using either REST APIs or any of the client SDKs. As with documents, the read consistency level of attachments follows the consistency policy on the database account. This policy can be overridden on a per-request basis depending on data consistency requirements of your application. When querying for attachments, the read consistency follows the indexing mode set on the collection. For "consistent", this follows the account’s consistency policy. 
 

## Users
An Azure Cosmos DB user represents a logical namespace for grouping permissions. An Azure Cosmos DB user may correspond to a user in an identity management system or a predefined application role. For Azure Cosmos DB, a user simply represents an abstraction to group a set of permissions under a database.   

For implementing multi-tenancy in your application, you can create users in Azure Cosmos DB, which corresponds to your actual users or the tenants of your application. You can then create permissions for a given user that correspond to the access control over various collections, documents, attachments, etc.   

As your applications need to scale with your user growth, you can adopt various ways to shard your data. You can model each of your users as follows:   

* Each user maps to a database.
* Each user maps to a collection. 
* Documents corresponding to multiple users go to a dedicated collection. 
* Documents corresponding to multiple users go to a set of collections.   

Regardless of the specific sharding strategy you choose, you can model your actual users as users in Azure Cosmos DB database and associate fine grained permissions to each user.  

![User collections][3]  
**Sharding strategies and modeling users**

Like all other resources, users in Azure Cosmos DB can be created, replaced, deleted, read, or enumerated easily using either REST APIs or any of the client SDKs. Azure Cosmos DB always provides strong consistency for reading or querying the metadata of a user resource. It is worth pointing out that deleting a user automatically ensures that you cannot access any of the permissions contained within it. Even though the Azure Cosmos DB reclaims the quota of the permissions as part of the deleted user in the background, the deleted permissions is available instantly again for you to use.  

## Permissions
From an access control perspective, resources such as database accounts, databases, users, and permission are considered *administrative* resources since these require administrative permissions. On the other hand, resources including the collections, documents, attachments, stored procedures, triggers, and UDFs are scoped under a given database and considered *application resources*. Corresponding to the two types of resources and the roles that access them (namely the administrator and user), the authorization model defines two types of *access keys*: *master key* and *resource key*. The master key is a part of the database account and is provided to the developer (or administrator) who is provisioning the database account. This master key has administrator semantics, in that it can be used to authorize access to both administrative and application resources. In contrast, a resource key is a granular access key that allows access to a *specific* application resource. Thus, it captures the relationship between the user of a database and the permissions the user has for a specific resource (for example, collection, document, attachment, stored procedure, trigger, or UDF).   

The only way to obtain a resource key is by creating a permission resource under a given user. In order to create or retrieve a permission, a master key must be presented in the authorization header. A permission resource ties the resource, its access, and the user. After creating a permission resource, the user only needs to present the associated resource key in order to gain access to the relevant resource. Hence, a resource key can be viewed as a logical and compact representation of the permission resource.  

As with all other resources, permissions in Azure Cosmos DB can be created, replaced, deleted, read, or enumerated easily using either REST APIs or any of the client SDKs. Azure Cosmos DB always provides strong consistency for reading or querying the metadata of a permission. 

## Next steps
Learn more about working with resources by using HTTP commands in [RESTful interactions with Azure Cosmos DB resources](https://msdn.microsoft.com/library/azure/mt622086.aspx).

[1]: media/sql-api-resources/resources1.png
[2]: media/sql-api-resources/resources2.png
[3]: media/sql-api-resources/resources3.png


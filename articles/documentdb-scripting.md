<properties title="Script with DocumentDB" pageTitle="Script with DocumentDB | Azure" metaKeywords="NoSQL, DocumentDB,  database, document-orientated database, JSON" description="How to script stored procedures, triggers, and UDFs in DocumentDB." services="documentdb"  solutions="data-management" documentationCenter=""  authors="bradsev" manager="jhubbard" editor="cgronlun" />

<tags ms.service="documentdb" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="08/20/2014" ms.author="bradsev" />

# Scripting with DocumentDB #

## Introduction  ##

DocumentDB allows developers to write application logic which can be shipped using HTTP POST and executed directly against storage partitions as **stored-procedures**, **triggers** or **user defined functions** (UDFs). Developers can also write native JavaScript procedures with the language-integrated, transactional execution of JavaScript provided by DocumentDB.

Stored procedures, triggers and UDFs in DocumentDB are modeled after the concepts supported by relational database management systems (RDBMS). All JavaScript logic is executed within an ambient ACID transaction with snapshot isolation. During the course of its execution, if the JavaScript throws an exception, then the entire transaction is aborted.  

The creation and execution of triggers, stored procedure and custom query operators is also supported in a RESTful manner in several client SDKs, including .NET, Node.js and JavaScript.  

This topic contains the following sections.

+ [Stored procedures] 
+ [Triggers]
+ [User defined functions]
+ [Server side API]


## Stored procedures ##
Stored procedures are named procedures with **user defined signatures**. Through the REST API, developers can register new stored procedures using an HTTP POST method against any collection. At runtime, DocumentDB exposes a context object through the `GetContext()` method call that provides access to:
 
- Input (request body and headers) for the stored procedure execution 
- Output (response body and headers) of the stored procedure execution 
- Interfaces to perform data store operations (reads, creates, updates, deletes, queries) against resources in the collection 

For example, here’s a simple “Hello World” stored procedure executed through the .NET SDK.

		// Create a simple stored procedure 
		
		string helloWorldScript = @" 
		
		    function sayHello() { 
		
		        getContext().getResponse().setBody(""Hello World""); 
		
		    }"; 
		
		
		// Register in DocumentDB with the name HelloWorldSproc 
		
		StoredProcedure helloWorldSproc = await client.CreateStoredProcedureAsync(collectionSelfLink, 
		
		                new StoredProcedure() { Body = helloWorldScript, Name = "HelloWorldSproc" }); 
		
		
		// Execute the stored procedure 
		
		response = await client.ExecuteStoredProcedureAsync<string>(helloWorldSproc.SelfLink); 


**Note:** A stored procedures with no database operations (i.e. create, delete or query) is an anti-pattern. Shown here for brevity. 

Applications can define their own input arguments (e.g., “name”) and pass them in from client application code:  

		string helloWorldScript = @" 
		
		    function sayHello(name) { 
		
		        getContext().getResponse().setBody(""Hello World from "" + name); 
		
		    }"; 


		// Execute the stored procedure with arguments 
		
		response = await client.ExecuteStoredProcedureAsync<string>(helloWorldSproc.SelfLink, "DocumentDB"); 


More complex types can be passed in using JSON. For example, this stored procedure passes in a Book type: 

		string passInJsonScript = @" 
		
		    function printTitle(book) { 
		
		        getContext().getResponse().setBody(""Book title is "" + book.title); 
		
		    }"; 
		
		response = await client.ExecuteStoredProcedureAsync<string>(passInJsonSproc.SelfLink, new Book { Title = "Moby Dick" }); 


Similarly, complex types can be returned from the stored procedure in JSON: 

		string passOutJsonScript = @" 
		
		    function printTitle() { 
		
		        getContext().getResponse().setBody({""title"": ""Moby Dick""}); 
		
		}"; 
		
		StoredProcedureResponse<Book> response = await client.ExecuteStoredProcedureAsync<Book>(passOutJsonSproc.SelfLink); 


Stored procedures can throw exceptions, as shown below, much like normal JavaScript. When an exception is thrown, the transactions get rolled back, and an error is returned to the caller, in this case an HTTP 401 Bad Request through the REST API.  

		string erroredScript = @" 
		
		    function sayHello() { 
		
		        throw new Error(""this script failed""); 
		
		}"; 
		
		
		// Throws a DocumentClientException with StatusCode.BadRequest 
		
		response = await client.ExecuteStoredProcedureAsync<string>(helloWorldSproc.SelfLink, "DocumentDB"); 


Stored procedures have access to all of the usual database store operations such as read, create, update, delete, read-feed (scan) and query on the documents and attachments within the collection  For example, this stored procedure creates a document using the content passed in as a JSON object. 

		string createDocScript = @"function(content) { 
		
		    var collection = getContext().getCollection(); 
		
		    function callback(err, docCreated, options) { 
		
		        if(err) throw 'Error while creating document'; 
		
		  getContext().getResponse().setBody(docCreated); 
		
		    } 
		
		    collection.createDocument(collection.getSelfLink(), doc, {message : content}, callback); 
		
		}"; 
		
		StoredProcedure createDocSproc = await client.CreateStoredProcedureAsync(collectionSelfLink, 
		
		    new StoredProcedure() { Body = createDocScript, Name = "CreateDocSproc" }); 
		
		response = await client.ExecuteStoredProcedureAsync<string>(createDocSproc.SelfLink, new Book { Title = "Moby Dick" }); 


Stored procedures that need to be executed in an ad-hoc or **transient** manner can be executed directly without being created first, using POST against scripts, or by using the **ExecuteTransientStoredProcedure** methods in the SDKs. 

DocumentDB stored procedures are powerful when used for transactional or bulk database operations. Some common use cases for these stored procedures are the bulk import of documents, purging older documents, custom aggregation logic, and backfilling data with additional fields. 

## Triggers ##

Triggers are special user defined functions that can be configured to be executed automatically on certain events such as the creation or deletion of a document. Triggers come in two flavors - **pre-triggers** and **post-triggers**.  Triggers are similar to stored procedures, but the methods should have no input parameters and they do not return an output response. Triggers get executed with **POST**, **PUT** and **DELETE** requests on documents corresponding to create, update and delete operations respectively.  Pre-triggers execute before the actual request. An exception thrown from a pre-trigger aborts the entire transaction. Post-triggers execute within the transaction of the request.  And ... (TBD get missing text.)

The following example of a pre-trigger converts lowercase characters in the “name” property of a document in a collection to uppercase characters.  

		Trigger preTrigger = new Trigger() 
		
		{ 
		
		    Name = "CapitalizeName", 
		
		    Body = @"function() { 
		
		        var item = getContext().getRequest().getBody(); 
		
		        item.name = item.name.toUpperCase(); 
		
		        getContext().getRequest().setBody(item); 
		
		    }", 
		
		    TriggerOperation = TriggerOperation.Create, 
		
		    TriggerType = TriggerType.Pre 
		
		}; 
		
		
		await client.CreateTriggerAsync(collectionSelfLink, preTrigger); 
		
		Document createdItem = await client.CreateDocumentAsync(collectionSelfLink, new Document { Name = "documentdb" }, new RequestOptions 
		
		{ 
		
		    PreTriggerInclude = new List<string> { "CapitalizeName" }, 
		
		}); 


**Note**: Triggers are always opt-in in DocumentDB. Operations must explicitly specify the list of triggers that must be executed with each operation. 

**Note**: Triggers do not support continuations and must complete within the maximum allowed execution time limit 

The following example of a post-trigger maintains count, minimum value, maximum value and sum aggregates on the “metric” property for all of the documents inserted into a collection. 

		Trigger postTrigger = new Trigger() 
		
		{ 
		
		    Name = "UpdateAggregates", 
		
		    Body = @"function updateCountTrigger() { 
		
		        var collection = getContext().getCollection(); 
		
		        var insertedDoc = getContext().getRequest().getBody(); 
		
		        var metric = insertedDoc.metric; 
		
		
		        collection.queryDocuments(collection.getSelfLink(),  
		
		            'select m from metrics m where m.name = ""aggregate""', {}, 
		
		            function (err, docFeed, responseOptions) { 
		
		                if (err) throw 'Error while querying documents' + err; 
		
		                var aggregateDoc = docFeed[0]; 
		
		
		                aggregateDoc.count++; 
		
		                aggregateDoc.min = Math.min(aggregateDoc.min, metric); 
		
		                aggregateDoc.max = Math.max(aggregateDoc.min, metric); 
		
		                aggregateDoc.sum += metric; 
		
		
		                collection.replaceDocument(aggregateDoc.self, aggregateDoc, 
		
		                    function (err, doc, responseOptions) { 
		
		                        if (err) throw 'Error while updating document'; 
		
		                    } 
		
		                ); 
		
		            } 
		
		        ); 
		
		    }", 
		
		    TriggerOperation = TriggerOperation.Create, 
		
		    TriggerType = TriggerType.Post 
		
		}; 
		
		
		Document newDoc = new Document { Name = "ServiceAPI" }; 
		
		newDoc.SetPropertyValue("metric", 4.0); 
		
		
		createdItem = await client.CreateDocumentAsync(collectionSelfLink, newDoc, new RequestOptions 
		
		{ 
		
		    PostTriggerInclude = new List<string> { "UpdateCount" }, 
		
		}); 

All requests issued against DocumentDB entities, including stored procedures, have an associated timeout. In order to execute long-lived, resumable stored procedures, the clients can use the continuation passing style pattern that is commonly used by most internet facing API services. 

Some common use cases for DocumentDB triggers are data validation, data cleansing, and appending common properties to new documents.  


## User defined functions  ##

User defined functions (UDFs) are used as part of SQL queries to execute JavaScript, for example to convert a string to lower case or to evaluate a regular expression as part of the query. The following UDF is used to perform a case-insensitive query on book titles. 

		UserDefinedFunction function = new UserDefinedFunction() 
		
		{ 
		
		    Name = "ToLower", 
		
		    Body = @"function(input) { 
		
		        return item.toLowerCase(); 
		
		    }" 
		
		}; 
		
		
		var results = client.CreateDocumentQuery(collectionSelfLink).AsSQL<Document>( 
		
		    "SELECT b FROM books b WHERE ToLower(b.Title) = 'war and peace'"); 


**Note**: UDFs are not allowed to perform database operations such as creating or querying documents. 

**Note**: UDFs do not support continuations and must complete within the maximum execution time limit. 


## Server side API  ##

Stored procedures and triggers have access to the DocumentDB server-side JavaScript API which provides helper properties and methods to interact with the database. This section discusses the following methods and the management of their execution with continuation tokens.

+ [Request methods]
+ [Response methods]
+ [Collection methods]
+ [Paging and continuation]

For more details, refer to the documentation for the JavaScript API. 

### Request methods  ###

The request property in `GetContext()` provides hooks to read the input/request from the trigger or stored procedure. 

<table border="1">
	<tr>
		<th>Request Methods</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>context.request.getBody()</td>
		<td>Reads the HTTP request body </td>
	</tr>
	<tr>
		<td>context.request.getContentType()</td>
		<td>Extracts the content type of the request from the headers </td>
	</tr>
	<tr>
		<td>context.request.getTimestamp()</td>
		<td>Extracts the request timestamp from the headers </td>
	</tr>
	<tr>
</table>

### Response methods  ###
The response property provides hooks to modify the output/response returned from the trigger or stored procedure. 

<table border="1">
	<tr>
		<th>Response Methods</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>context.response.getTimestamp()</td>
		<td>Extracts the response timestamp from the headers (for post-triggers)</td>
	</tr>
	<tr>
		<td>context.response.getContentType()</td>
		<td>Extracts the response content type from the headers (for post-triggers)</td>
	</tr>
	<tr>
		<td>context.response.setBody()</td>
		<td>Sets the HTTP response body</td>
	</tr>
	<tr>
		<td>context.response.appendBody()  </td>
		<td>Appends to the HTTP response body </td>
	</tr>
	<tr>
</table>

### Collection methods  ###

The collection property also provides query and CRUD operations (create, read, update and delete) for managing and querying documents within a collection.  

<table border="1">
	<tr>
		<th>Operations</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>readDocument(link, options, callback)</td>
		<td>Reads a single document</td>
	</tr>
	<tr>
		<td>readDocuments(options, callback)</td>
		<td>Scan all documents within the collection</td>
	</tr>
	<tr>
		<td>queryDocuments(query, options, callback)</td>
		<td>Query documents in the collection using the SQL query syntax</td>
	</tr>
	<tr>
		<td>createDocument(body, options, callback)</td>
		<td>Create a new document</td>
	</tr>
	<tr>
		<td>deleteDocument(link, options, callback)</td>
		<td>Delete an existing document</td>
	</tr>
	<tr>
		<td>updateDocument(link, document, options, callback)</td>
		<td>Update an existing document</td>
	</tr>
	<tr>
</table>

The attachment metadata for documents can also be queried and updated within stored procedures and triggers. 

<table border="1">
	<tr>
		<th>Method</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>readAttachment (link, options, callback)</td>
		<td>Reads a single attachment (metadata)</td>
	</tr>
	<tr>
		<td>readAttachments(options, callback)</td>
		<td>Scan all attachments for a document</td>
	</tr>
	<tr>
		<td>queryAttachments(query, options, callback)</td>
		<td>Query attachments for the document using the SQL query syntax</td>
	</tr>
	<tr>
		<td>deleteAttachment(link, options, callback)</td>
		<td>Create a new attachment</td>
	</tr>
	<tr>
		<td>updateAttachment(link, attachment, options, callback)</td>
		<td>Delete an existing attachment</td>
	</tr>
	<tr>
		<td>readAttachment (link, options, callback)</td>
		<td>Update an existing attachment </td>
	</tr>
	<tr>
</table>


### Paging and continuation ###

The DocumentDB JavaScript runtime ensures that database operations are not scheduled if the time limit for the stored procedure is about to expire. Each of the methods listed above returns a Boolean indicating whether the operation was scheduled. Calling methods must check this return value and perform cleanup and/or implement logic to resume execution. Refer to the limits and defaults documentation page for details.

Here is an example of a script for counting documents in a very large collection that handles timeouts and the resumption of execution through continuation tokens. 

		string countScript = @"function(continuationToken) { 
		
		    var totalDocuments = 0; 
		
		    var collection = getContext().getCollection(); 
		
		
		    function setBody(totalDocuments, nextContinuation) { 
		
		        getContext().getResponse().setBody({count: totalDocuments, continuation: nextContinuation}); 
		
		    } 
		
		    function tryRead(nextContinuation, callback) { 
		
		        if (!collection.readDocuments(collection.getSelfLink(), { pageSize : 10, continuation : nextContinuation }, callback)) { 
		
		setBody(totalDocuments, nextContinuation); 
		
		        }        
		
		    } 
		
		    function callback(err, docFeed, responseOptions) { 
		
		        if(err) throw 'Error while reading document'; 
		
		        totalDocuments+= docFeed.length; 
		
		
		        setBody(totalDocuments, responseOptions.continuation); 
		
		        if (responseOptions.continuation) { 
		
		tryRead(responseOptions.continuation, callback);        
		
		        } 
		
		    }; 
		
		
		    tryRead(continuationToken, callback);  
		
		}"; 



The following is the client side logic, “the outer loop”, that iterates through script executions. 


		int totalDocuments = 0; 
		
		string continuation = String.Empty; 
		
		
		do 
		
		{ 
		
		    StoredProcedureResponse<ScriptBatchResult> scriptResponse =  
		
		        await client.ExecuteTransientProcedureAsync<ScriptBatchResult>(collectionSelfLink, countScript, continuation); 
		
		    totalDocuments += scriptResponse.Response.NumRows; 
		
		    continuation = scriptResponse.Response.Continuation; 
		
		} 
		
		while (!String.IsNullOrEmpty(continuation)); 



**Note**: Scripts can perform a significant number of database operations very quickly, and hit the provisioned throughput of the collection. Hence clients must handle throttling (Too Many Requests) responses from the DocumentDB service and retry in accordance with the server specified Retry-After duration. 

<!--Anchors-->
[Stored procedures]: #stored-procedures
[Triggers]: #triggers
[User defined functions]: #user-defined-functions
[Server side API]: #server-side-api
[Request methods]: #request-methods
[Response methods]: #response-methods
[Collection methods]: #collection-methods
[Paging and continuation]: #paging-and-continuation
<properties title="Query with Azure DocumentDB" pageTitle="Query with DocumentDB | Azure" description="DocumentDB's SQL query language supports a subset of ANSI SQL grammar and adds document-oriented support. Queries are served through up-to-date indexes that don't require index management."  metaKeywords="NoSQL, DocumentDB,  database, document-orientated database, JSON, account" services="documentdb"  solutions="data-management" documentationCenter=""  authors="bradsev" manager="jhubbard" editor="cgronlun" videoId="" scriptId="" />

<tags ms.service="documentdb" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="08/20/2014" ms.author="bradsev" />

#Query with Azure DocumentDB

##Motivation
	
DocumentDB's SQL query language supports a subset of ANSI SQL grammar and adds document oriented support in the form of nested data structures, arrays and object construction. Queries are served efficiently through DocumentDB's indexes, which are automatically kept up to date for all properties in documents without the overhead of index management. Developers can also harness the full power of JavaScript inside queries through user-defined functions (UDFs).  


##Why SQL query?
DocumentDB supports SQL to provide a very simple and approachable interface to querying data. SQL as a language is structurally simple, yet powerful and widely used by application developers. DocumentDB is deeply committed to open platforms and standards like HTTP, JSON and JavaScript, and now SQL. 
SQL querying is supported via the REST API as well as .NET, Node.js and JavaScript client SDKs. SQL queries are also supported in stored procedures and triggers in the server-side JavaScript API. In addition to SQL queries, DocumentDB also supports querying via LINQ in the .NET SDK.  
 
#Data Types	
In DocumentDB, the data format for documents and metadata is expressed in JavaScript Object Notation (JSON) . JSON is used widely due to the growth of JavaScript applications, and its evolution into a platform independent data exchange format. Due to JSON being self-describing, it’s also well suited for schema-free databases.  

The primitive data types supported in DocumentDB queries are same as JSON’s. JSON has a simple type system that consists of:  

-	Strings 
-	Numbers (IEEE754 double precision) 
-	Booleans – true and false 
-	Nulls  
 

More complex data types can be represented both in JSON and DocumentDB through the creation of nested objects using the { } operator and arrays using the [ ] operator.  
 
#Query Grammar 
Using the DocumentDB SQL language, users can retrieve data from JSON documents using **SELECT** statements.  Here’s a sample SQL statement against a document collection containing posts on a social network.  

     SELECT p.message, p.user.id AS user_id, p.tags[0] AS first_tag 
     FROM posts p 
     WHERE p.type = "Comment"
 
The output of a query is an array of JSON document fragments, one for each document that matches the specified constraints.  

    {
      "Documents": [
    	{
       		"message": "JSON rocks!"
       		"user_id": "@documentdb"
       		"first_tag": "#documentstore"
    	},
    	{
       		"message": "SQL rocks!"
       		"user_id": "@documentdb"
       		"first_tag": "#documentstore"
    	}
      ]
    }

The complete formal grammar (BNF) for the SQL query language is included at the end of this document.  

#FROM clause
The **FROM** clause is commonly the name of the current collection where the query is executed on. For example, this selects all documents in the collection named “posts”. If the name is incorrect, an error is returned to the user.  

    SELECT * 
    FROM posts

The **ROOT** keyword can be used instead of referencing the collection by name – since through the SDK or REST API, queries can be targeted at a specific collection’s scope.  

    SELECT * 
    FROM ROOT

The output properties of the FROM can be aliased. This is useful while using multiple FROM sources using **JOINs**. This is covered later.  

    SELECT P.* 
    FROM posts P

It is also possible to query from a nested property. For example, if the posts documents contain a subdocument for the user who made the post, it is possible to query using the following syntax.  

    SELECT U.* 
    FROM posts.user U

The source of the FROM statement can also be a scalar array (ordered set).    
  
    SELECT E
    FROM ["documentdb", "json", "sql"] E

It is also possible to omit the FROM statement altogether while evaluating scalar expressions.  

`SELECT "documentdb" ` 

#WHERE clause (Filtering)

The DocumentDB SQL language supports an optional **WHERE** clause that filters the result set based on the specified conditions that the document must satisfy. The filter expression can contain logical comparisons against any property or nested path in the documents.  

For example, any property like message can be used in queries. Filtering is performed efficiently using DocumentDB’s automatic index.  

    SELECT * 
    FROM posts p 
    WHERE p.message = "DocumentDB now supports SQL!"

Nested properties can be used for filtering using the dotted notation. The paths can be arbitrarily long depending on the schema of the documents.  

    SELECT * 
    FROM posts p 
    WHERE p.user.name = "Azure DocumentDB"

Individual values within arrays can be referenced using the array dereferencing operator. Array unwinding is supported using the **IN** keyword (discussed later).  

    SELECT * 
    FROM posts p 
    WHERE p.views[0] = 100

Range comparisons (>, <. >=, <=, !=) are supported for numeric values.  Numbers can also be compared to the result of an arithmetic expression as shown below.  

    SELECT * 
    FROM posts p 
    WHERE p.views[0] > 100 * 2

Logical operators can be combined using the AND, OR and NOT operators just like in regular SQL. These are efficiently processed through the intersection of the indexes for the specified properties.  

    SELECT * 
    FROM posts p 
    WHERE ((p.user.name = "Azure DocumentDB")
    OR (p.views[0] = 100 AND p.message = "DocumentDB now supports SQL!"))

##Handling Missing and Null Properties
NULL is supported as a keyword, and properties can be compared to null like other scalars.  

    SELECT * 
    FROM posts p 
    WHERE p.message IS NULL

Since the schema for documents can be  rapidly changing or unknown beforehand, the language also supports special operators to check for missing properties – through the ISUNDEFINED operator, similar to **undefined** in JavaScript .  

    SELECT * 
    FROM posts p 
    WHERE p.message IS UNDEFINED

>Note: Similar to JavaScript, = undefined always returns false.  

#SELECT clause (Projection)

The **SELECT** clause can be used to extract certain properties from the query. The star (*) operator returns the complete documents that match the query.  

    SELECT * 
    FROM posts

Specified fields can extracted in the SELECT clause. Fields can be atomic (strings, numbers, Booleans) or complex (arrays, JSON objects). Complex types in the SELECT clause like “user” in the example below returns the entire JSON object under the property. Properties in the SELECT clause must have unique names or aliases.  

    SELECT posts.id, posts.user
    FROM posts

>Note: Since JSON is unordered, the individual properties in the document are not returned in any specific order.  

>Note: Field names have to be explicitly qualified. Since documents have no fixed schema, this is required for the query runtime to perform the correct binding.  

An alternate way to access properties is to use the dictionary lookup syntax as shown below:  

    SELECT posts.id, posts["user"], posts["from"]
    FROM posts

>Note: The dictionary lookup syntax should be used to escape property names that use a reserved keyword like FROM in the example above.  

##Expression Evaluation
Scalar expressions can also be used with expressions. When there is no name specified, an auto-generated name is used as a placeholder ($1, $2, $3, etc.).  

    SELECT ((2 + 11 % 7) – 2)/3
    FROM posts

The following expressions can be used within SQL query expressions. The operators are strongly typed like in SQL. For example, equals (=) is strong equality, which means than 5 != “5”.  

<table>
<tr>
<td>Arithmetic operators</td>	
<td>+, -, *, /, % (Modulo)</td>
</tr>
<tr>
<td>Logical operators</td>
<td>AND, OR, NOT</td>
</tr>
<tr>
<td>Bitwise operators</td>	
<td>& (Bitwise AND), | (Bitwise OR), ^ (Bitwise XOR)</td>
</tr>
<tr>
<td>String operators</td>	
<td>|| (Concatenate)</td>
</tr>
<tr>
<td>Comparison operators</td>	
<td>=, !=, >, <, >=, <=</td>
</tr>
</table>


##JSON Transformation
SQL queries can return JSON fragments, not just complete documents – the **VALUE** keyword can be used to do this. For example, the following document will return “2” instead of {“id”: “2”}.  

    SELECT VALUE posts.id
    FROM posts

More complex JSON expressions can be constructed like in JavaScript using the {} and [] operators. This allows queries flexibility to transform the shape of the result-sets.  

    SELECT {"user_name": p.user.name, "recent_views": [p.views[0], p.views[1]]}
    FROM posts p

>Note: Values can be any valid expression, but labels must be literals (strings)  

#Joins and Iteration
In document databases, referenced data is embedded as sub-documents or inside arrays. Hence the SQL language supports intra-document aka self-joins using the **JOIN** keyword.  

    SELECT p.id, tag 
    FROM posts p 
    JOIN tag IN p.tags

>Note: Joins are formally cross joins, but since data is embedded, they act as inner joins.  

In the example, the **IN** operator is used to iterate over all the elements of a source. The source for an IN clause can be either an array or an object. When used with an object, the iterator goes through each property. IN can also be used directly as shown below. IN can also be used with array literals.  

    SELECT tag 
    FROM tag IN posts.tags
 
Multiple joins can be used within a SQL statement, as shown below:  
	
    SELECT p.id, tag, liked
    FROM posts p 
    JOIN tag IN p.tags
    JOIN liked IN p.likes  

#User defined functions (UDFs)
DocumentDB queries support programmable extensions in the form of JavaScript user defined functions. Each collection can have one or more saved **UDFs** that transform JSON fragments, and reference them by name directly in scripts.  

For example, using the create user defined functions, a “regex_match” function can be defined as:  

    function regex_match(input, pattern) {
    	getContext().getResponse().setBody(pattern.test(input));
    }
 
Then it can be referenced in queries like in this example:  

    SELECT *
    FROM posts p
    WHERE regex_match(p.message, "doc.*db") = true

>Note: UDFs have access to only the input parameters. No DocumentDB store operations (read, write, query, etc.) are supported inside UDFs.  

>Note: Currently, only one UDF can be used inside a query.  

UDFs can process and return JSON fragments, not just literals. For example, an “array_count” function can defined as:  

    function array_count(input) {
    	getContext().getResponse().setBody(input.length);
    }

And then be used in queries to find the size of an array inside a document:  

    SELECT *
    FROM posts p
    WHERE array_count(p.likes) > 5

UDFs can also be specified in the SELECT clause or in the FROM clause of a query. For example:  

    SELECT array_count(p.likes) AS count
    FROM posts p

For more details on creating and managing UDFs, refer to the JavaScript programmability documentation.  

#Paging
Each query execution returns a batch of results according to the page size configured by the client. To read all results for a query, applications must paginate over each result-set until there is no more data to read. To read no more than 10 documents for example, clients can modify the page size to 10 to restrict the maximum number of documents returned. Note that queries might return fewer results than the page size or even no results for some queries. To read all results from a query, clients should fetch the next batch using the response continuation token until it is empty.  

    // Fetch pages of results up to 10 at a time. FeedOptions is optional
    DocumentServiceQuery<Database> query = (
    	from db in client.CreateDatabaseQuery(new FeedOptions { MaxItemCount = 10 })
    	where db.Name == dbName
    	select db).AsDocumentServiceQuery();
    
    while (query.HasMoreResults)
    {
    	databases.AddRange(await query.ExecuteNextAsync<Database>());
    }

This is not implemented in the SQL grammar as a TOP or LIMIT keyword, since the functionality is already available through continuation tokens in the underlying client SDK/REST API.  For more information and examples, refer to the REST API documentation for GET documents or the ReadFeed methods in the SDKs.  

#Query Consistency behavior
DocumentDB supports four developer tunable consistency levels – Strong, Bounded Staleness, Session and Eventual. Queries offer the same guarantees as the consistency levels. By default, the results of a query are guaranteed to match the consistency level which is requested by the client. DocumentDB’s index is log-structured, and designed to always keep up to date and consistent with data regardless of volume. When documents are inserted or updated, they are immediately available in query results.  

For applications that need eventual consistency, optionally the indexing policy can be configured to use Lazy Indexing. In this case, the index is updated in an eventually consistent manner whenever the collection is idle.  To summarize, here is the table of query consistency behavior with the different database account configurations.  

Data Consistency|Indexing Policy| Query Behavior|
----------------|---------------|---------------|
Strong|	Consistent|	Strong|
Bounded Staleness|	Consistent|	Bounded Staleness|
Session|	Consistent|	Session|
Eventual|	Consistent|	Eventual|
Strong|	Lazy|	Eventual|
Bounded Staleness|	Lazy|	Eventual|
Session|	Lazy|	Eventual|
Eventual|	Lazy|	Eventual|

For additional details refer to the documentation on indexing policy and configuration.  

#APIs and SDKs
Queries can be executed using the REST API, client SDKs and the server side JavaScript API using the SQL grammar.
##Query using the REST API
Applications can POST queries against collections using the REST API. The following should be included in query requests  

-	Header x-ms-documentdb-isquery: True to indicate that this is a query
-	Header Content-Type: application/sql to indicate that the SQL language is used
-	Body containing the SELECT statement   
<!-- -->

    POST .../docs/executeQuery HTTP/1.1
    authorization: ...
    x-ms-continuation: 
    x-ms-activity-id: 82342881-769e-4113-a662-a85c7617ed5b
    x-ms-date: Fri, 30 May 2014 22:46:13 GMT
    Match: 
    x-docdb-resource-id: 9MEKcum9C2g=
    x-docdb-entity-id: 
    x-ms-documentdb-isquery: True
    Cache-Control: no-cache
    x-ms-version: 2014-02-25
    User-Agent: Microsoft.Azure.Documents.Client/1.0.0.0
    Content-Type: application/sql
    Host: ...
    Content-Length: 59
    Expect: 100-continue
    
    SELECT b.title FROM books b WHERE b.title = 'War and Peace'  

>Note: Query is not supported using GET or using query strings.  

##Query using the .NET SDK
The .NET SDK supports querying using the CreateDocumentQuery method, which supports SQL queries as strings. The output of the query is an IQueryable interface that can be processed using client side LINQ.  

    IQueryable<dynamic> results = client.CreateDocumentQuery(collectionId).AsSQL<dynamic>(
       "SELECT b.title FROM books b WHERE b.title = 'War and Peace'");

For additional details refer to the .NET SDK documentation.  

##Query inside Stored Procedures and Triggers

The server side JavaScript API for stored procedures and triggers also supports querying using SQL.  

    collection.queryDocuments(collection.GetSelfLink(),
    "SELECT b.title FROM books b WHERE b.title = 'War and Peace'",
    callback);

For additional details refer to the JavaScript server side SDK documentation.  

#Appendix A – SQL Syntax
The following railroad diagrams show the formal SQL grammar for the DocumentDB query language  

![][1]  
![][2]  
![][3]  
![][4]  
![][5]  
![][6]  
![][7]  
![][8]  
![][9]  
![][10]  
![][11]  
![][12]  
![][13]  
![][14]  
![][15]
![][16]
![][17]

[1]: ./media/documentdb-query/query1.png
[2]: ./media/documentdb-query/query2.png
[3]: ./media/documentdb-query/query3.png
[4]: ./media/documentdb-query/query4.png
[5]: ./media/documentdb-query/query5.png
[6]: ./media/documentdb-query/query6.png
[7]: ./media/documentdb-query/query7.png
[8]: ./media/documentdb-query/query8.png
[9]: ./media/documentdb-query/query9.png
[10]: ./media/documentdb-query/query10.png
[11]: ./media/documentdb-query/query11.png
[12]: ./media/documentdb-query/query12.png
[13]: ./media/documentdb-query/query13.png
[14]: ./media/documentdb-query/query14.png
[15]: ./media/documentdb-query/query15.png
[16]: ./media/documentdb-query/query16.png
[17]: ./media/documentdb-query/query17.png
 
 

 


 
 
 
 
 
 
 
 
 
 
 



<properties title="Query with DocumentDB SQL" pageTitle="Query with DocumentDB SQL | Azure" description="DocumentDB supports querying of documents using SQL-like grammar over hierarchical JSON documents without requiring explicit schema or creation of secondary indexes." metaKeywords="" services="documentdb"  documentationCenter="" solutions="data-management" authors="bradsev" manager="jhubbard" editor="cgronlun" videoId="" scriptId="" />

<tags ms.service="documentdb" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="08/20/2014" ms.author="spelluru" />

#Query DocumentDB
Azure DocumentDB supports querying of documents using a familiar SQL (Structured Query Language) over hierarchical JSON documents. DocumentDB is truly schema-free. By virtue of its commitment to the JSON data model directly within the database engine, it provides automatic indexing of JSON documents without requiring explicit schema or creation of secondary indexes. 
While designing the query language for DocumentDB we had two goals in mind:

-	<strong>Embrace SQL</strong> – Instead of inventing a new query language, we wanted to embrace the SQL language. After all, SQL is one of the most familiar and popular query languages. Azure DocumentDB's SQL language provides a formal programming model for rich queries over JSON documents.
-	<strong>Extend SQL</strong> – As a JSON document database capable of executing JavaScript directly in the database engine, we wanted use JavaScript's programming model as the foundation for our SQL query language. Azure DocumentDB's SQL query language is rooted in the JavaScript's type system, expression evaluation and function invocation. This in-turn provides a natural programming model for relational projections, hierarchical navigation across JSON documents, self joins, invocation of user defined functions (UDFs) written entirely in JavaScript among other features. 

We believe that these capabilities are key to reducing the friction between the application and the database and are crucial for developer productivity.

In this tutorial, we introduce the DocumentDB query language capabilities and grammar through examples. We also look at how one can query DocumentDB using the REST API and SDKs (including LINQ).

#Getting Started
To see DocumentDB SQL at work, we'll begin with a few simple JSON documents and walk through some simple queries against it. Consider these two JSON documents about two families. Note that with DocumentDB, we do not need to create any schemas or secondary indices explicitly. We simply need to insert the JSON documents to a DocumentDB collection and subsequently query. 
Here we have a simple JSON document for the Andersen family, the parents, children (and their pets), address and registration information. The document has strings, numbers, Booleans, arrays and nested properties. 

**Document**  

	{
	    "id": "AndersenFamily",
	    "lastName": "Andersen",
	    "parents": [
	       { "firstName": "Thomas" },
	       { "firstName": "Mary Kay"}
	    ],
	    "children": [
	       {
	           "firstName": "Henriette Thaulow", "gender": "female", "grade": 5,
	           "pets": [{ "givenName": "Fluffy" }]
	       }
	    ],
	    "address": { "state": "WA", "county": "King", "city": "seattle" },
	    "isRegistered": true
	}


Here's a second document with one subtle difference – `givenName` and `familyName` are used instead of `firstName` and `lastName`.

**Document**  

	{
	    "id": "WakefieldFamily",
	    "parents": [
	        { "familyName": "Wakefield", "givenName": "Robin" },
	        { "familyName": "Miller", "givenName": "Ben" }
	    ],
	    "children": [
	        {
	            "familyName": "Merriam", 
	             "givenName": "Jesse", 
	            "gender": "female", "grade": 1,
	            "pets": [
	                { "givenName": "Goofy" },
	                { "givenName": "Shadow" }
	            ]
	        },
	        { 
	            "familyName": "Miller", 
	             "givenName": "Lisa", 
	             "gender": "female", 
	             "grade": 8 }
	    ],
	    "address": { "state": "NY", "county": "Manhattan", "city": "NY" },
	    "isRegistered": false
	}



Now let's try a few queries against this data to understand some of the key aspects of DocumentDB SQL. For example, the following query will return the documents where the id field matches `AndersenFamily`. Since it's a `SELECT *`, the output of the query is the complete JSON document:

**Query**

	SELECT * 
	FROM Families f 
	WHERE f.id = "AndersenFamily"

**Results**

	[{
	    "id": "AndersenFamily",
	    "lastName": "Andersen",
	    "parents": [
	       { "firstName": "Thomas" },
	       { "firstName": "Mary Kay"}
	    ],
	    "children": [
	       {
	           "firstName": "Henriette Thaulow", "gender": "female", "grade": 5,
	           "pets": [{ "givenName": "Fluffy" }]
	       }
	    ],
	    "address": { "state": "WA", "county": "King", "city": "seattle" },
	    "isRegistered": true
	}]


Now consider the case where we need to reformat the JSON output in a different shape. This query projects a new JSON object with 2 selected fields, Name and City, when the address' city has the same name as the state. In this case, "NY, NY" matches.

**Query**	

	SELECT {"Name":f.id, "City":f.address.city} AS Family 
	FROM Families f 
	WHERE f.address.city = f.address.state

**Results**

	[{
	    "Family": {
	        "Name": "WakefieldFamily", 
	        "City": "NY"
	    }
	}]


The next query returns all the given names of children in the family whose id matches `WakefieldFamily`.

**Query**

	SELECT c.givenName 
	FROM Families f 
	JOIN c IN f.children 
	WHERE f.id = 'WakefieldFamily'

**Results**

	[
	  { "givenName": "Jesse" }, 
	  { "givenName": "Lisa"}
	]


We would like to draw attention to a few noteworthy aspects of the DocumentDB query language through the examples we've seen so far:  
 
-	Since DocumentDB SQL works on JSON values, it deals with tree shaped entities instead of rows and columns. Therefore, the language lets one refer to nodes of the tree at any arbitrary depth, like `Node1.Node2.Node3…..Nodem`, similar to relational SQL referring to two part reference of `<table>.<column>`.   
-	The language works with schema-less data. Therefore, the type system needs to be bound dynamically. The same expression could yield different types on different documents. The result of a query is a valid JSON value, but is not guaranteed to be of a fixed schema.  
-	DocumentDB only supports strict JSON documents. This means the type system and expressions are restricted to deal only with JSON types. Please refer to [JSON specification] (http://www.json.org/) for more details.  
-	A DocumentDB collection is a schema-free container of JSON documents. The relations in data entities within and across documents in a collection are implicitly captured by containment and not by PK-FK relations. This is an important aspect worth pointing out in light of the intra-document joins discussed later in this paper.

#DocumentDB Indexing

Before we get into the DocumentDB SQL language, it is worth exploring DocumentDB's indexing design. 

The purpose of database indexes is to serve queries in their various forms and shapes with minimum resource consumption (like CPU, I/O) while providing good throughput and low latencies. Often, the choice of the right index(s) for querying a database requires much planning and experimentation. This approach poses a challenge for schema-less databases where the data doesn’t conform to a strict schema and evolves rapidly. 

Therefore, when we designed DocumentDB’s indexing subsystem, we set the following goals:

-	Indexing documents without requiring schema: The indexing subsystem does not require any schema information or make any a-priori assumptions about schema of the documents. 

-	Support for efficient, rich hierarchical and relational queries: The index supports DocumentDB Query language efficiently, including support for hierarchical and relational projections.

-	Support for consistent queries in face of sustained volume of writes: For high write throughput workloads with consistent queries, the index is updated incrementally, efficiently and online in the face of sustained volume of writes. The consistent index update is crucial to serve the queries with the consistency level that the user has configured the document service with.

-	Support for multi-tenancy: Given the reservation based model for resource governance across tenants, index updates are performed within the budget of system resources (CPU, memory, IOPS) allocated per replica. 

-	Storage efficient: For cost effectiveness, the on-disk storage overhead of the index is bounded and predictable. This is crucial because DocumentDB allows the developer to make cost based tradeoffs between index overhead vis-à-vis the query performance.  

Refer to the [DocumentDB samples] (http://code.msdn.microsoft.com/Azure-DocumentDB-NET-Code-6b3da8af#content) on MSDN for how to configure the indexing policy for a collection. Let’s now get into the details of the DocumentDB SQL language.


#Basics of DocumentDB Query
Every query consists of a **SELECT** clause and optional **FROM** and **WHERE** clauses per ANSI-SQL standards. Typically, for each query, the source in the FROM clause is enumerated. Then the filter in the WHERE clause is applied on the source to retrieve a subset of JSON documents. Finally, the SELECT clause is used to project the requested JSON values in the select list.
    
    SELECT <select_list> 
    [FROM <from_specification>] 
    [WHERE <filter_condition>]    


#FROM Clause
The `FROM <from_specification>` clause is optional unless the source is filtered/projected later in the query. The purpose of this clause is to specify the data source upon which the query must operate. Commonly the whole collection is the source, but one can specify a subset of the collection instead. 

A query like `SELECT * FROM Families` indicates that the entire Families collection is the source over which to enumerate. A special identifier **ROOT** can be used to represent the collection instead of using the collection name. 
The binding rules that are enforced per query are the following:

- The collection can be aliased like in `SELECT f.id FROM Families AS f` or simply `SELECT f.id FROM Families f`. Here `f` is the equivalent of `Families`. `AS` is an optional keyword to alias the identifier.

-	Note that once aliased, the original source cannot be bound. For example, `SELECT Familes.id FROM Families f` is syntactically invalid since the identifier "Families" cannot be resolved anymore.

-	All properties that need to be referenced must be **fully qualified**. In the absence of strict schema adherence, this is enforced to avoid any ambiguous bindings. Therefore, `SELECT id FROM Families f` is syntactically invalid since the property `id` is not bound.
	
##Sub-documents
The source can also be reduced to a smaller subset. For instance, if one is interested in enumerating only a sub-tree in each document, the sub-root could then become the source, like in the following example.

**Query**

	SELECT * 
	FROM Families.children

**Results**  

	[
	  [
	    {
	        "firstName": "Henriette Thaulow",
	        "gender": "female",
	        "grade": 5,
	        "pets": [
	          {
	              "givenName": "Fluffy"
	          }
	        ]
	    }
	  ],
	  [
	    {
	        "familyName": "Merriam",
	        "givenName": "Jesse",
	        "gender": "female",
	        "grade": 1
	    },
	    {
	        "familyName": "Miller",
	        "givenName": "Lisa",
	        "gender": "female",
	        "grade": 8
	    }
	  ]
	]

While the above example used an array as the source, an object could also be used as the source as shown in the following example. Any valid JSON value (not Undefined) that can be found in the source will be considered for inclusion in the result of the query. If some families don’t have an `address.state` value, they will be excluded in the query result.

**Query**

	SELECT * 
	FROM Families.address.state

**Results**

	[
	  "WA", 
	  "NY"
	]


#WHERE Clause
The WHERE clause (**`WHERE <filter_condition>`**) is optional. It specifies the condition(s) that the JSON documents provided by the source must satisfy in order to be included as part of the result. Any JSON document must evaluate the specified conditions to "true" to be considered for the result. The WHERE clause is used by the index layer in order to determine the absolute smallest subset of source documents that can be part of the result. 

The following query requests documents that contain a name property and that the property’s value is `AndersenFamily`. Any other document that does not have a name property, or where the value does not match `AndersenFamily` is excluded. 

**Query**

	SELECT f.address
	FROM Families f 
	WHERE f.id = "AndersenFamily"

**Results**

	[{
	  "address": {
	    "state": "WA", 
	    "county": "King", 
	    "city": "seattle"
	  }
	}]


The previous example showed a simple equality query. DocumentDB SQL also supports a variety of scalar expressions. The most commonly used are binary and unary expressions.  Property references from the source JSON object are also valid expressions. 

The following binary operators are currently supported and can be used in queries as shown in the following examples:  
<table>
<tr>
<td>Arithmetic</td>	
<td>+,-,*,/,%</td>
</tr>
<tr>
<td>Bitwise</td>	
<td>|, &, ^</td>
</tr>
<tr>
<td>Logical</td>
<td>AND, OR</td>
</tr>
<tr>
<td>Comparison</td>	
<td>=, !=, >, >=, <, <=, <></td>
</tr>
<tr>
<td>String</td>	
<td>|| (concatenate)</td>
</tr>
</table>  

Let’s take a look at some queries using binary operators.

	SELECT * 
	FROM Families.children[0] c
	WHERE c.grade % 2 = 1     -- matching grades == 5, 1
	
	SELECT * 
	FROM Families.children[0] c
	WHERE c.grade ^ 4 = 1    -- matching grades == 5
	
	SELECT *
	FROM Families.children[0] c
	WHERE c.grade >= 5     -- matching grades == 5


The unary operators **+,-, ~ and NOT** are also supported, and can be used inside queries as shown below:


	SELECT *
	FROM Families.children[0] c
	WHERE NOT(c.grade = 5)  -- matching grades == 1
	
	SELECT *
	FROM Families.children[0] c
	WHERE (-c.grade = -5)  -- matching grades == 5



In addition to binary & unary operators, property references are also allowed. For example, `SELECT * FROM Families f WHERE f.isRegistered` would return the JSON documents containing the property `isRegistered` and the property's value is equal to the JSON `true` value. Any other values (false, null, Undefined, <number>, <string>, <object>, <array> etc.) will lead to the source document being excluded from the result. 

##Equality and Comparison operators
The following table shows the result of equality comparisons in DocumentDB SQL between any two JSON types.
<table style = "width:300px">
   <tbody>
      <tr>
         <td valign="top">
            <strong>Op</strong>
         </td>
         <td valign="top">
            <strong>Undefined</strong>
         </td>
         <td valign="top">
            <strong>Null</strong>
         </td>
         <td valign="top">
            <strong>Boolean</strong>
         </td>
         <td valign="top">
            <strong>Number</strong>
         </td>
         <td valign="top">
            <strong>String</strong>
         </td>
         <td valign="top">
            <strong>Object</strong>
         </td>
         <td valign="top">
            <strong>Array</strong>
         </td>
      </tr>
      <tr>
         <td valign="top">
            <strong>Undefined<strong>
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
      </tr>
      <tr>
         <td valign="top">
            <strong>Null<strong>
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            <strong>OK</strong>
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
      </tr>
      <tr>
         <td valign="top">
            <strong>Boolean<strong>
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            <strong>OK</strong>
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
      </tr>
      <tr>
         <td valign="top">
            <strong>Number<strong>
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            <strong>OK</strong>
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
      </tr>
      <tr>
         <td valign="top">
            <strong>String<strong>
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            <strong>OK</strong>
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
      </tr>
      <tr>
         <td valign="top">
            <strong>Object<strong>
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            <strong>OK</strong>
         </td>
         <td valign="top">
            Undefined
         </td>
      </tr>
      <tr>
         <td valign="top">
            <strong>Array<strong>
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            Undefined
         </td>
         <td valign="top">
            <strong>OK</strong>
         </td>
      </tr>
   </tbody>
</table>

For other comparison operators like >, >=, !=, < and <=   

-	Comparison across types results in Undefined.
-	Comparison between two objects or two arrays results in Undefined.   

If the result of the scalar expression in the filter is Undefined, the corresponding document would not be included in the result, since Undefined doesn't logically equate to "true".

##Logical (AND, OR and NOT) operators
These operate on Boolean values. The logical truth tables for these operators are as shown below.

<table style = "width:300px">
    <tbody>
        <tr>
            <td width="55" valign="top">
                <p>
                    <strong>OR</strong>
                </p>
            </td>
            <td width="45" valign="top">
                <p>
                    <strong>True</strong>
                </p>
            </td>
            <td width="68" valign="top">
                <p>
                    <strong>False</strong>
                </p>
            </td>
            <td width="87" valign="top">
                <p>
                    <strong>Undefined</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td width="55" valign="top">
                <p>
                    <strong>True</strong>
                </p>
            </td>
            <td width="45" valign="top">
                <p>
                    True
                </p>
            </td>
            <td width="68" valign="top">
                <p>
                    True
                </p>
            </td>
            <td width="87" valign="top">
                <p>
                    True
                </p>
            </td>
        </tr>
        <tr>
            <td width="55" valign="top">
                <p>
                    <strong>False</strong>
                </p>
            </td>
            <td width="45" valign="top">
                <p>
                    True
                </p>
            </td>
            <td width="68" valign="top">
                <p>
                    False
                </p>
            </td>
            <td width="87" valign="top">
                <p>
                    Undefined
                </p>
            </td>
        </tr>
        <tr>
            <td width="55" valign="top">
                <p>
                    <strong>Undefined</strong>
                </p>
            </td>
            <td width="45" valign="top">
                <p>
                    True
                </p>
            </td>
            <td width="68" valign="top">
                <p>
                    Undefined
                </p>
            </td>
            <td width="87" valign="top">
                <p>
                    Undefined
                </p>
            </td>
        </tr>
    </tbody>
</table>

<table style = "width:300px">
    <tbody>
        <tr>
            <td width="55" valign="top">
                <p>
                    <strong>AND</strong>
                </p>
            </td>
            <td width="54" valign="top">
                <p>
                    <strong>True</strong>
                </p>
            </td>
            <td width="58" valign="top">
                <p>
                    <strong>False</strong>
                </p>
            </td>
            <td width="107" valign="top">
                <p>
                    <strong>Undefined</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td width="55" valign="top">
                <p>
                    <strong>True</strong>
                </p>
            </td>
            <td width="54" valign="top">
                <p>
                    True
                </p>
            </td>
            <td width="58" valign="top">
                <p>
                    False
                </p>
            </td>
            <td width="107" valign="top">
                <p>
                    Undefined
                </p>
            </td>
        </tr>
        <tr>
            <td width="55" valign="top">
                <p>
                    <strong>False</strong>
                </p>
            </td>
            <td width="54" valign="top">
                <p>
                    False
                </p>
            </td>
            <td width="58" valign="top">
                <p>
                    False
                </p>
            </td>
            <td width="107" valign="top">
                <p>
                    False
                </p>
            </td>
        </tr>
        <tr>
            <td width="55" valign="top">
                <p>
                    <strong>Undefined</strong>
                </p>
            </td>
            <td width="54" valign="top">
                <p>
                    Undefined
                </p>
            </td>
            <td width="58" valign="top">
                <p>
                    False
                </p>
            </td>
            <td width="107" valign="top">
                <p>
                    Undefined
                </p>
            </td>
        </tr>
    </tbody>
</table>

<table style = "width:300px">
    <tbody>
        <tr>
            <td valign="top">
                <p>
                    <strong>NOT</strong>
                </p>
            </td>
            <td valign="top">
                <p>
                    <strong></strong>
                </p>
            </td>
        </tr>
        <tr>
            <td valign="top">
                <p>
                    <strong>True</strong>
                </p>
            </td>
            <td valign="top">
                <p>
                    False
                </p>
            </td>
        </tr>
        <tr>
            <td valign="top">
                <p>
                    <strong>False</strong>
                </p>
            </td>
            <td valign="top">
                <p>
                    True
                </p>
            </td>
        </tr>
        <tr>
            <td valign="top">
                <p>
                    <strong>Undefined</strong>
                </p>
            </td>
            <td valign="top">
                <p>
                    Undefined
                </p>
            </td>
        </tr>
    </tbody>
</table>

#SELECT Clause
The SELECT clause (**`SELECT <select_list>`**) is mandatory and specifies what values will be retrieved from the query, just like in ANSI-SQL. The subset that's been filtered on top of the source documents are passed onto the projection phase, where the specified JSON values are retrieved and a new JSON object is constructed, for each input passed onto it. 

The example below shows a typical SELECT query: 

**Query**

	SELECT f.address
	FROM Families f 
	WHERE f.id = "AndersenFamily"

**Results**

	[{
	  "address": {
	    "state": "WA", 
	    "county": "King", 
	    "city": "seattle"
	  }
	}]


##Nested Properties
In the following example, we are projecting two nested properties `f.address.state` and `f.address.city`:

**Query**

	SELECT f.address.state, f.address.city
	FROM Families f 
	WHERE f.id = "AndersenFamily"

**Results**

	[{
	  "state": "WA", 
	  "city": "seattle"
	}]


Projection also supports JSON expressions as shown in the following example.

**Query**

	SELECT { "state": f.address.state, "city": f.address.city, "name": f.id }
	FROM Families f 
	WHERE f.id = "AndersenFamily"

**Results**

	[{
	  "$1": {
	    "state": "WA", 
	    "city": "seattle", 
	    "name": "AndersenFamily"
	  }
	}]


Let's look at the role of `$1` here. The `SELECT` clause needs to create a JSON object and since no key is provided, we use implicit argument variable names starting with `$1`. For example, this query returns 2 implicit argument variables, labeled `$1` and `$2`.

**Query**

	SELECT { "state": f.address.state, "city": f.address.city }, 
	       { "name": f.id }
	FROM Families f 
	WHERE f.id = "AndersenFamily"

**Results**

	[{
	  "$1": {
	    "state": "WA", 
	    "city": "seattle"
	  }, 
	  "$2": {
	    "name": "AndersenFamily"
	  }
	}]


##Aliasing
Now let's extend the example above with explicit aliasing of values. **AS** is the keyword used for aliasing. Note that it's optional as shown while projecting the second value as `NameInfo`. 

In case a query has two properties with the same name, aliasing must be used to rename one or both of the properties so that they are disambiguated in the projected result.

**Query**

	SELECT 
	       { "state": f.address.state, "city": f.address.city } AS AddressInfo, 
	       { "name": f.id } NameInfo
	FROM Families f 
	WHERE f.id = "AndersenFamily"

**Results**

	[{
	  "AddressInfo": {
	    "state": "WA", 
	    "city": "seattle"
	  }, 
	  "NameInfo": {
	    "name": "AndersenFamily"
	  }
	}]


##Scalar Expressions
In addition to property references, the **SELECT** clause also supports scalar expressions like constants, arithmetic expressions, logical expressions etc. For example, here's a simple "Hello World" query.

**Query**

	SELECT "Hello World"

**Results**

	[{
	  "$1": "Hello World"
	}]


Here's a more complex example that uses a scalar expression:

**Query**

	SELECT ((2 + 11 % 7)-2)/3	

**Results**

	[{
	  "$1": 1.33333
	}]


In the following example, the result of the scalar expression is a Boolean.

**Query**

	SELECT f.address.city = f.address.state AS AreFromSameCityState
	FROM Families f	

**Results**

	[
	  {
	    "AreFromSameCityState": false
	  }, 
	  {
	    "AreFromSameCityState": true
	  }
	]


##Object and Array Creation
Another key feature of DocumentDB SQL is array/object creation. In the previous example, note that we created a new JSON object. Similarly, one can also construct arrays as shown below.

**Query**

	SELECT [f.address.city, f.address.state] AS CityState 
	FROM Families f	

**Results**  

	[
	  {
	    "CityState": [
	      "seattle", 
	      "WA"
	    ]
	  }, 
	  {
	    "CityState": [
	      "NY", 
	      "NY"
	    ]
	  }
	]

##VALUE keyword
The **VALUE** keyword provides a way to return JSON value. For example, the query shown below returns the scalar `"Hello World"` instead of `{$1: "Hello World"}`.

**Query**

	SELECT VALUE "Hello World"

**Results**

	[
	  "Hello World"
	]


The following query returns the JSON value without the `"address"` label in the results.

**Query**

	SELECT VALUE f.address
	FROM Families f	

**Results**  

	[
	  {
	    "state": "WA", 
	    "county": "King", 
	    "city": "seattle"
	  }, 
	  {
	    "state": "NY", 
	    "county": "Manhattan", 
	    "city": "NY"
	  }
	]

The following example extends this to show how to return JSON primitive values, i.e. at the leaf level of the JSON tree. 

**Query**

	SELECT VALUE f.address.state
	FROM Families f	

**Results**

	[
	  "WA",
	  "NY"
	]


##* Operator
We support the special operator (*) to project the document as-is. When used, it must be the only projected field. While a query like `SELECT * FROM Families f` is valid, `SELECT VALUE * FROM Families f ` and  `SELECT *, f.id FROM Families f ` are not.

**Query**

	SELECT * 
	FROM Families f 
	WHERE f.id = "AndersenFamily"

**Results**

	[{
	    "id": "AndersenFamily",
	    "lastName": "Andersen",
	    "parents": [
	       { "firstName": "Thomas" },
	       { "firstName": "Mary Kay"}
	    ],
	    "children": [
	       {
	           "firstName": "Henriette Thaulow", "gender": "female", "grade": 5,
	           "pets": [{ "givenName": "Fluffy" }]
	       }
	    ],
	    "address": { "state": "WA", "county": "King", "city": "seattle" },
	    "isRegistered": true
	}]

#Advanced Concepts
##Iteration
We added a new construct via the **IN** keyword in DocumentDB SQL to provide support for iterating over JSON arrays. The FROM source provides support for iteration. Let's start with the following example:

**Query**

	SELECT * 
	FROM Families.children

**Results**  

	[
	  [
	    {
	      "firstName": "Henriette Thaulow", 
	      "gender": "female", 
	      "grade": 5, 
	      "pets": [{ "givenName": "Fluffy"}]
	    }
	  ], 
	  [
	    {
	        "familyName": "Merriam", 
	        "givenName": "Jesse", 
	        "gender": "female", 
	        "grade": 1
	    }, 
	    {
	        "familyName": "Miller", 
	        "givenName": "Lisa", 
	        "gender": "female", 
	        "grade": 8
	    }
	  ]
	]

Now let's look at another query that performs iteration over children in the collection. Note the difference in the output array. This example splits `children` and flattens the results into a single array.  

**Query**

	SELECT * 
	FROM c IN Families.children

**Results**  

	[
	  {
	      "firstName": "Henriette Thaulow",
	      "gender": "female",
	      "grade": 5,
	      "pets": [{ "givenName": "Fluffy" }]
	  },
	  {
	      "familyName": "Merriam",
	      "givenName": "Jesse",
	      "gender": "female",
	      "grade": 1
	  },
	  {
	      "familyName": "Miller",
	      "givenName": "Lisa",
	      "gender": "female",
	      "grade": 8
	  }
	]

This can be further used to filter on each individual entry of the array like in the following example.

**Query**

	SELECT c.givenName
	FROM c IN Families.children
	WHERE c.grade = 8

**Results**  

	[{
	  "givenName": "Lisa"
	}]

##Joins
In a relational database, the need to join across tables is very important. It's the logical corollary to designing normalized schemas. Contrary to this, DocumentDB deals with denormalized data model of schema-free documents. This is the logical equivalent of a "self-join".

The syntax that is supported in the language is <from_source1> JOIN <from_source2> JOIN ... JOIN <from_sourceN>. Overall, this would return a set of **N**-tuples (tuple with **N** values). Each tuple will have values produced by iterating all collection aliases over their respective sets. In other words, this is a full cross product of the sets participating in the join.

The following examples show how JOINs works. In the example below, the result is empty since the cross product of each document from source and an empty set is empty.

**Query**

	SELECT f.id
	FROM Families f
	JOIN f.NonExistent

**Results**  

	[{
	}]


In the following example, the join is between the document root and the `children` sub-root. It's a cross product between two JSON objects. The fact that children is an array is not effective in the JOIN since we are dealing with a single root that is the children array. Hence the result contains only two results, since the cross product of each document with the array yields exactly only one document.

**Query**

	SELECT f.id
	FROM Families f
	JOIN f.children
 
**Results**

	[
	  {
	    "id": "AndersenFamily"
	  }, 
	  {
	    "id": "WakefieldFamily"
	  }
	]


The following example is a more conventional join:

**Query**

	SELECT f.id
	FROM Families f
	JOIN c IN f.children 

**Results**

	[
	  {
	    "id": "AndersenFamily"
	  }, 
	  {
	    "id": "WakefieldFamily"
	  }, 
	  {
	    "id": "WakefieldFamily"
	  }
	]



The first thing to note is that the `from_source` of the **JOIN** here is an iterator. So, the flow in this case is as follows  

-	Expand each child element **c** in the array.
-	Apply a cross product with the root of the document **f** with each child element **c** that got flattened in the first step.
-	Finally, project root object **f** name property alone. 

The first document (`AndersenFamily`) contains only one child element, so the result set contains only a single object corresponding to this document. The second document (`WakefieldFamily`) contains two children. So, the cross product produces a separate object for each child, thereby resulting in two objects, one for each child corresponding to this document. Note that the root fields in both these documents will be same, just as you would expect in a cross product.

The real utility of the JOIN is to form tuples from the cross-product in a shape that's otherwise difficult to project. Furthermore, as we will see in the example below, one could filter on the combination of a tuple that lets' the user chose a condition satisfied by the tuples overall.

**Query**

	SELECT 
		f.id AS familyName,
		c.givenName AS childGivenName,
		c.firstName AS childFirstName,
		p.givenName AS petName 
	FROM Families f 
	JOIN c IN f.children 
	JOIN p IN c.pets
 
**Results**

	[
	  {
	    "familyName": "AndersenFamily", 
	    "childFirstName": "Henriette Thaulow", 
	    "petName": "Fluffy"
	  }, 
	  {
	    "familyName": "WakefieldFamily", 
	    "childGivenName": "Jesse", 
	    "petName": "Goofy"
	  }, 
	  {
	   "familyName": "WakefieldFamily", 
	   "childGivenName": "Jesse", 
	   "petName": "Shadow"
	  }
	]



This example is a natural extension of the above one, and performs a double join. So, the cross product can be viewed as the below pseudo-code.

	for-each(Family f in Families)
	{	
		for-each(Child c in f.children)
		{
			for-each(Pet p in c.pets)
			{
				return (Tuple(f.id AS familyName, 
	              c.givenName AS childGivenName, 
	              c.firstName AS childFirstName,
	              p.givenName AS petName));
			}
		}
	}

`AndersenFamily` has one child who has one pet. So, the cross product yields one row (1*1*1) from this family. WakefieldFamily however has two children, but only one child "Jesse" has pets. She has 2 pets though. Hence the cross product yields 1*1*2 = 2 rows from this family.

In the next example, there is an additional filter on `pet`. This excludes all the tuples where the pet name is not "Shadow". Notice that we are able to build tuples from arrays, filter on any of the elements of the tuple and project any combination of the elements. 

**Query**

	SELECT 
		f.id AS familyName,
		c.givenName AS childGivenName,
		c.firstName AS childFirstName,
		p.givenName AS petName 
	FROM Families f 
	JOIN c IN f.children 
	JOIN p IN c.pets
	WHERE p.givenName = "Shadow"

**Results**

	[
	  {
	   "familyName": "WakefieldFamily", 
	   "childGivenName": "Jesse", 
	   "petName": "Shadow"
	  }
	]


#JavaScript Integration
DocumentDB provides a programming model for executing JavaScript based application logic directly on the collections in terms of stored procedures and triggers. This allows for both:

-	Ability to do high performance transactional CRUD and query against documents in a collection by virtue of the deep integration of JavaScript runtime directly within the database engine. 
-	A natural modeling of control flow, variable scoping, assignment and integration of exception handling primitives with database transactions. For more details about DocumentDB support for JavaScript integration, please refer to the JavaScript server side programmability documentation.

##User Defined Functions (UDFs)
Along with the above specified types, DocumentDB SQL provides support for User Defined Functions (UDF). In particular, scalar UDFs are supported where the developers can pass in zero or many arguments and return a single argument result back. Each of these arguments are checked for being legal JSON values.  

The DocumentDB SQL grammar is extended to support custom application logic using these User Defined Functions. UDFs can be registered with Azure DocumentDB and then be referenced as part of a SQL query. In fact, the UDFs are exquisitely designed to be invoked by queries. As a corollary to this choice, UDFs do not have access to the context object which the other JavaScript types (Stored Procedures, Triggers) have. Since queries execute as read-only, they can run either on primary or on secondary replicas. Therefore, UDFs are designed to run on secondary replicas unlike other JavaScript types.

Below is an example of how a UDF can be registered at the DocumentDB database, specifically under a document collection.

   
	   UserDefinedFunction sqrtUdf = new UserDefinedFunction
	   {
	       Id = "SQRT",
	       Body = @"function(number) { 
	                   return Math.sqrt(number);
	               };",
	   };
	   UserDefinedFunction createdUdf = client.CreateUserDefinedFunctionAsync(
	       collectionSelfLink/* link of the parent collection*/, 
	       sqrtUdf).Result;  
                                                                             
The above example creates a UDF whose name is `SQRT`. It accepts a single JSON value `number` and calculates the square root of the number using the Math library.


We can now use this UDF in a query in a projection.

**Query**

	SELECT SQRT(c.grade)
	FROM c IN Families.children

**Results**

	[
	  {
	    "$1": 2.23606797749979
	  }, 
	  {
	    "$1": 1
	  }, 
	  {
	    "$1": 2.8284271247461903
	  }
	]

The UDF can also be used inside a filter as shown in the example below:

**Query**

	SELECT c.grade
	FROM c IN Familes.children
	WHERE SQRT(c.grade) = 1

**Results**

	[{
	    "grade": 1
	}]


In essence, UDFs are valid scalar expressions and can be used in both projections and filters. 

To expand on the power of UDFs, let's look at another example with conditional logic:

	   UserDefinedFunction seaLevelUdf = new UserDefinedFunction()
	   {
	       Id = "SEALEVEL",
	       Body = @"function(city) {
	       		switch (city) {
	       		    case 'seattle':
	       		        return 520;
	       		    case 'NY':
	       		        return 410;
	       		    case 'Chicago':
	       		        return 673;
	       		    default:
	       		        return -1;
	                }"
            };

            UserDefinedFunction createdUdf = await client.CreateUserDefinedFunctionAsync(collection.SelfLink, seaLevelUdf);
	
	
Below is an example that exercises the UDF.

**Query**

	SELECT f.address.city, SEALEVEL(f.address.city) AS seaLevel
	FROM Families f	

**Results**

	 [
	  {
	    "city": "seattle", 
	    "seaLevel": 520
	  }, 
	  {
	    "city": "NY", 
	    "seaLevel": 410
	  }
	]


As the above examples show cases, UDFs integrates the power of JavaScript language with the DocumentDB SQL to provide rich programmable interface to do complex procedural, conditional logic with the help of inbuilt JavaScript runtime capabilities.

DocumentDB SQL provides the arguments to the UDFs for each document in the source at the current stage (WHERE clause or SELECT clause) of processing the UDF. The result is incorporated in the overall execution pipeline seamlessly. If the properties referred to by the UDF parameters are not available in the JSON value, the parameter is considered as Undefined and hence the UDF invocation is entirely skipped. Similarly if the result of the UDF is Undefined, it's not included in the result. 

In summary, UDFs are great tools to do complex business logic as part of the query.

##Operator Evaluation
DocumentDB, by the virtue of being a JSON database, draws parallels with JavaScript operators and its evaluation semantics. While DocumentDB tries to preserve JavaScript semantics in terms of JSON support, the operation evaluation deviates in some instances.

In DocumentDB SQL query language, unlike in traditional SQL, the types of values are often not known until the values are actually retrieved from database. In order to efficiently execute   queries, most of the operators have strict type requirements. 

DocumentDB SQL doesn't perform implicit conversions unlike JavaScript. For instance, a query like `SELECT * FROM Person p WHERE p.Age = 21` matches documents which contain Age property whose value is 21. Any other document whose Age property matches string "21", or
other possibly infinite variations like "021", "21.0", "0021", "00021" etc. will not be matched. 
This is in contrast to the JavaScript where the string values are implicitly casted to number (based on operator, ex: ==). This choice is crucial for efficient Index matching in DocumentDB SQL. 

#LINQ to DocumentDB SQL
LINQ is a .NET programming model which expresses computation as queries on streams of objects. DocumentDB provides a client side library to interface with LINQ by facilitating a conversion between JSON and .NET objects and a mapping from a subset of LINQ queries to DocumentDB queries. 

The picture below shows the architecture of supporting LINQ queries using DocumentDB.  Using the DocumentDB client, developers can create an **IQueryable** object which would direct the query to the DocumentDB query provider which then translates the LINQ query into a DocumentDB query. The query is then passed to the DocumentDB server to retrieve a set of results in JSON format. The returned results are deserialized into a stream of .NET objects at the client side.

![][1]
 


##.NET and JSON Mapping
The mapping between .NET objects and JSON documents is natural - each data member field is mapped to a JSON object, where the field name is mapped to the "key" part of the object and the "value" part is recursively mapped to the value part of the object. Consider the example below.  The Family object created is mapped to the JSON document as shown below. Vice versa, the JSON document is mapped back to a .NET object.

**C# Class**

	public class Family
	{
	    [JsonProperty(PropertyName="id")]
	    public string Id;
	    public Parent[] parents;
	    public Child[] children;
	    public bool isRegistered;
	};
	
	public struct Parent
	{
	    public string familyName;
	    public string givenName;
	};
	
	public class Child
	{
	    public string familyName;
	    public string givenName;
	    public string gender;
	    public int grade;
	    public List<Pet> pets;
	};
	
	public class Pet
	{
	    public string givenName;
	};
	
	public class Address
	{
	    public string state;
	    public string county;
	    public string city;
	};
	
	// create a Family object
	Parent mother = new Parent { familyName= "Wakefield", givenName="Robin" };
	Parent father = new Parent { familyName = "Miller", givenName = "Ben" };
	Child child = new Child { familyName="Merriam", givenName="Jesse", gender="female", grade=1 };
	Pet pet = new Pet { givenName = "Fluffy" };
	Address address = new Address { state = "NY", county = "Manhattan", city = "NY" };
	Family family = new Family { Id = "WakefieldFamily", parents = new Parent [] { mother, father}, children = new Child[] { child }, isRegistered = false };


**JSON**  

	{
	    "id": "WakefieldFamily",
	    "parents": [
	        { "familyName": "Wakefield", "givenName": "Robin" },
	        { "familyName": "Miller", "givenName": "Ben" }
	    ],
	    "children": [
	        {
	            "familyName": "Merriam", 
	            "givenName": "Jesse", 
	            "gender": "female", 
	            "grade": 1,
	            "pets": [
	                { "givenName": "Goofy" },
	                { "givenName": "Shadow" }
	            ]
	        },
	        { 
	          "familyName": "Miller", 
	          "givenName": "Lisa", 
	          "gender": "female", 
	          "grade": 8 
	        }
	    ],
	    "address": { "state": "NY", "county": "Manhattan", "city": "NY" },
	    "isRegistered": false
	};



##LINQ to SQL Translation
The DocumentDB query provider performs a best effort mapping from a LINQ query into a DocumentDB SQL query. In the following description, we assume the reader's basic familiarity of LINQ.

First, for the type system, we support all JSON primitive types – numeric types, bool, string and null. Only these JSON types are supported. The following scalar expressions are supported.

-	Constant values – these includes constant values of the primitive data types at the time the query is evaluated.

-	Property/array index expressions – these expressions refer to the property of an object or an array element.

		family.Id;
		family.children[0].familyName;
		family.children[0].grade;
		family.children[n].grade; //n is an int variable

-	Arithmetic expressions - These include common arithmetic expressions on numerical and bool values. For the complete list, refer to above SQL specification.

		2 * family.children[0].grade;
		x + y;

-	String comparison expression - these include comparing a string value to some constant string value.  
 
		mother.familyName == "Smith";
		child.givenName == s; //s is a string variable

-	Object/array creation expression - these expressions return an object of compound value type or anonymous type or an array of such objects. These values can be nested.

		new Parent { familyName = "Smith", givenName = "Joe" };
		new { first = 1, second = 2 }; //an anonymous type with 2 fields              
		new int[] { 3, child.grade, 5 };

##Query Operators
Here are some examples that illustrate how some of the standard LINQ query operators are translated down to DocumentDB queries.

###Select Operator
The syntax is `input.Select(x => f(x))`, where `f` is a scalar expression.

**LINQ Lambda Expression**

	input.Select(family => family.parents[0].familyName);

**SQL** 

	SELECT VALUE f.parents[0].familyName
	FROM Families f



**LINQ Lambda Expression**

	input.Select(family => family.children[0].grade + c); // c is an int variable


**SQL** 

	SELECT VALUE f.children[0].grade + c
	FROM Families f 



**LINQ Lambda Expression**

	input.Select(family => new
	{
	    name = family.children[0].familyName,
	    grade = family.children[0].grade + 3
	});


**SQL** 

	SELECT VALUE {"name":f.children[0].familyName, 
	              "grade": f.children[0].grade + 3 }
	FROM Families f



###SelectMany Operator
The syntax is `input.SelectMany(x => f(x))`, where `f` is a scalar expression which returns a collection type.

**LINQ Lambda Expression**

	input.SelectMany(family => family.children);

**SQL** 

	SELECT VALUE child
	FROM child IN Families.children



###Where Operator
The syntax is `input.Where(x => f(x))`, where `f` is a scalar expression which returns a Boolean value.

**LINQ Lambda Expression**

	input.Where(family=> family.parents[0].familyName == "Smith");

**SQL** 

	SELECT *
	FROM Families f
	WHERE f.parents[0].familyName = "Smith" 



**LINQ Lambda Expression**

	input.Where(
	    family => family.parents[0].familyName == "Smith" && 
	    family.children[0].grade < 3);

**SQL** 

	SELECT *
	FROM Families f
	WHERE f.parents[0].familyName = "Smith"
	AND f.children[0].grade < 3


##Composite Queries
The above operators can be composed to form more powerful queries. Since DocumentDB supports nested collections, such composition can either be concatenated or nested.

###Concatenation 

The syntax is `input(.|.SelectMany())(.Select()|.Where())*`. A concatenated query can start with an optional `SelectMany` query followed by multiple `Select` or `Where` operators.


**LINQ Lambda Expression**

	input.Select(family=>family.parents[0])
	    .Where(familyName == "Smith");

**SQL**

	SELECT *
	FROM Families f
	WHERE f.parents[0].familyName = "Smith"



**LINQ Lambda Expression**

	input.Where(family => family.children[0].grade > 3)
	    .Select(family => family.parents[0].familyName);

**SQL** 

	SELECT VALUE f.parents[0].familyName
	FROM Families f
	WHERE f.children[0].grade > 3



**LINQ Lambda Expression**

	input.Select(family => new { grade=family.children[0].grade}).
	    Where(anon=> anon.grade < 3);
            
**SQL** 

	SELECT *
	FROM Families f
	WHERE ({grade: f.children[0].grade}.grade > 3)



**LINQ Lambda Expression**

	input.SelectMany(family => family.parents)
	    .Where(parent => parents.familyName == "Smith");

**SQL** 

	SELECT *
	FROM p IN Families.parents
	WHERE p.familyName = "Smith"



###Nesting

The syntax is `input.SelectMany(x=>x.Q())` where Q is a `Select`, `SelectMany`, or `Where` operator.

In a nested query, the inner query is applied to each element of the outer collection. One important feature is that the inner query can refer to the fields of the elements in the outer collection like self-joins.

**LINQ Lambda Expression**

	input.SelectMany(family=> 
	    family.parents.Select(p => p.familyName));

**SQL** 

	SELECT VALUE p.familyName
	FROM Families f
	JOIN p IN f.parents


**LINQ Lambda Expression**

	input.SelectMany(family => 
	    family.children.Where(child => child.familyName == "Jeff"));
            
**SQL** 

	SELECT *
	FROM Families f
	JOIN c IN f.children
	WHERE c.familyName = "Jeff"



**LINQ Lambda Expression**
            
	input.SelectMany(family => family.children.Where(
	    child => child.familyName == family.parents[0].familyName));

**SQL** 

	SELECT *
	FROM Families f
	JOIN c IN f.children
	WHERE c.familyName = f.parents[0].familyName


#Executing Queries
Azure DocumentDB exposes resources via REST API that can be called by any language capable of making HTTP/HTTPS requests. Additionally, Azure DocumentDB offers programming libraries for several popular languages like .NET, Node.js, JavaScript and Python. The REST API and the various libraries all support querying through SQL. The .NET SDK supports LINQ querying in addition to SQL.

The following examples show how to create a query and submit it against a DocumentDB database account.
##REST API
DocumentDB offers an open RESTful programming model over HTTP. Database accounts can be provisioned using an Azure subscription. DocumentDB's resource model consists of a sets of resources under a database account, each addressable via a logical and stable URI. A set of resources is referred to as a feed in this document. A database account consists of a set of databases, each containing multiple collections, each of which in-turn contain documents, UDFs and other resource types.

The basic interaction model with these resources is through the HTTP verbs GET, PUT, POST and DELETE with their standard interpretation. The POST verb is used for creation of a new resource, for executing a stored procedure or for issuing a DocumentDB query. Queries are always read only operations with no side-effects.

The following examples show POST for a DocumentDB query made against a collection containing the two sample documents we've reviewed so far. The query has a simple filter on the JSON name property. Note the use of the `x-ms-documentdb-isquery` and Content-Type: `application/sql` headers to denote that the operation is a query.


**Request**

	POST https://<REST URI>/docs HTTP/1.1
	...
	x-ms-documentdb-isquery: True
	Content-Type: application/sql
	
	SELECT * FROM Families f WHERE f.id = "AndersenFamily"

**Results**

	HTTP/1.1 200 Ok
	x-ms-activity-id: 8b4678fa-a947-47d3-8dd3-549a40da6eed
	x-ms-item-count: 1
	x-ms-request-charge: 0.32
	
	<indented for readability, results highlighted>
	
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
	            "city":"seattle"
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


The second example shows a more complex query that returns multiple results from the join.

**Request**

	POST https://<REST URI>/docs HTTP/1.1
	...
	x-ms-documentdb-isquery: True
	Content-Type: application/sql
	
	SELECT 
	     f.id AS familyName, 
	     c.givenName AS childGivenName, 
	     c.firstName AS childFirstName, 
	     p.givenName AS petName 
	FROM Families f 
	JOIN c IN f.children 
	JOIN p in c.pets

**Results**

	HTTP/1.1 200 Ok
	x-ms-activity-id: 568f34e3-5695-44d3-9b7d-62f8b83e509d
	x-ms-item-count: 1
	x-ms-request-charge: 7.84
	
	<indented for readability, results highlighted>
	
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


If a query's results cannot fit within a single page of results, then the REST API returns a continuation token through the `x-ms-continuation-token` response header. Clients can paginate results by including the header in subsequent results. The number of results per page can also be controlled through the `x-ms-max-item-count` number header.

To manage the data consistency policy for queries, use the `x-ms-consistency-level` header like all REST API requests. For session consistency, it is required to also echo the latest `x-ms-session-token` Cookie header in the query request. Note that the queried collection's indexing policy can also influence the consistency of query results. With the default indexing policy settings, for collections the index is always current with the document contents and query results will match the consistency chosen for data. If the indexing policy is relaxed to Lazy, then queries can return stale results. For more information, refer to [DocumentDB Consistency Levels] [consistency-levels].

If the configured indexing policy on the collection cannot support the specified query, the DocumentDB server returns 400 "Bad Request". This is returned for range queries against paths configured for hash (equality) lookups, and for paths explicitly excluded from indexing. The `x-ms-documentdb-query-enable-scan` header can be specified to allow the query to perform a scan when an index is not available.

##C# (.NET) SDK
The .NET SDK supports both LINQ and SQL querying. The following example shows how to perform the simple filter query introduced earlier in this document.


	foreach (var family in client.CreateDocumentQuery(collectionLink, 
	    "SELECT * FROM Families f WHERE f.id = \"AndersenFamily\""))
	{
	    Console.WriteLine("\tRead {0} from SQL", family);
	}
	
	foreach (var family in (
	    from f in client.CreateDocumentQuery(collectionLink)
	    where f.Id == "AndersenFamily"
	    select f))
	{
	    Console.WriteLine("\tRead {0} from LINQ query", family);
	}
	
	foreach (var family in client.CreateDocumentQuery(collectionLink)
	    .Where(f => f.Id == "AndersenFamily")
	    .Select(f => f))
	{
	    Console.WriteLine("\tRead {0} from LINQ lambda", family);
	}


This sample compares two properties for equality within each document and uses anonymous projections. 


	foreach (var family in client.CreateDocumentQuery(collectionLink,
	    @"SELECT {""Name"": f.id, ""City"":f.address.city} AS Family 
	    FROM Families f 
	    WHERE f.address.city = f.address.state"))
	{
	    Console.WriteLine("\tRead {0} from SQL", family);
	}
	
	foreach (var family in (
	    from f in client.CreateDocumentQuery<Family>(collectionLink)
	    where f.address.city == f.address.state
	    select new { Name = f.Id, City = f.address.city }))
	{
	    Console.WriteLine("\tRead {0} from LINQ query", family);
	}
	
	foreach (var family in
	    client.CreateDocumentQuery<Family>(collectionLink)
	    .Where(f => f.address.city == f.address.state)
	    .Select(f => new { Name = f.Id, City = f.address.city }))
	{
	    Console.WriteLine("\tRead {0} from LINQ lambda", family);
	}


The next sample shows joins, expressed through LINQ SelectMany.


	foreach (var pet in client.CreateDocumentQuery(collectionLink,
	      @"SELECT p
	        FROM Families f 
	             JOIN c IN f.children 
	             JOIN p in c.pets 
	        WHERE p.givenName = ""Shadow"""))
	{
	    Console.WriteLine("\tRead {0} from SQL", pet);
	}
	
	// Equivalent in Lambda expressions
	foreach (var pet in
	    client.CreateDocumentQuery<Family>(collectionLink)
	    .SelectMany(f => f.children)
	    .SelectMany(c => c.pets)
	    .Where(p => p.givenName == "Shadow"))
	{
	    Console.WriteLine("\tRead {0} from LINQ lambda", pet);
	}



The .NET client automatically iterates through all the pages of query results in the foreach blocks as shown above. The query options introduced in the REST API section are also available in the .NET SDK using the `FeedOptions` and `FeedResponse` classes in the CreateDocumentQuery method. The number of pages can be controlled using the `MaxItemCount` setting. 

Developers can also explicitly control paging by creating an `IDocumentQueryable` using the `IQueryable` object, then by reading the` ResponseContinuationToken` values and passing them back as `RequestContinuationToken` in `FeedOptions`. `EnableScanInQuery` can be set to enable scans when the query cannot be supported by the configured indexing policy.

Refer to [DocumentDB .NET samples] (http://code.msdn.microsoft.com/Azure-DocumentDB-NET-Code-6b3da8af#content) for more samples on queries. 

##JavaScript Server-side API 
DocumentDB provides a programming model for executing JavaScript based application logic directly on the collections using stored procedures and triggers. The JavaScript logic registered at a collection level can then issue database operations on the operations on the documents of the given collection. These operations are wrapped in ambient ACID transactions.

The following example show how to use the queryDocuments in the JavaScript server API make queries from inside stored procedures and triggers.


	function businessLogic(name, author) {
	    var context = getContext();
	    var collectionManager = context.getCollection();
	    var collectionLink = collectionManager.getSelfLink()
	
	    // create a new document.
	    collectionManager.createDocument(collectionLink,
	        { name: name, author: author },
	        function (err, documentCreated) {
	            if (err) throw new Error(err.message);
	
	            // filter documents by author
	            var filterQuery = "SELECT * from root r WHERE r.author = 'George R.'";
	            collectionManager.queryDocuments(collectionLink,
	                filterQuery,
	                function (err, matchingDocuments) {
	                    if (err) throw new Error(err.message);
	context.getResponse().setBody(matchingDocuments.length);
	
	                    // Replace the author name for all documents that satisfied the query.
	                    for (var i = 0; i < matchingDocuments.length; i++) {
	                        matchingDocuments[i].author = "George R. R. Martin";
	                        // we don't need to execute a callback because they are in parallel
	                        collectionManager.replaceDocument(matchingDocuments[i]._self,
	                            matchingDocuments[i]);
	                    }
	                })
	        });
	}


#References
1.	[Introduction to Azure DocumentDB] [introduction]
2.	[DocumentDB SQL Language specification] (http://go.microsoft.com/fwlink/p/?LinkID=510612)
3.	[DocumentDB .NET samples] (http://code.msdn.microsoft.com/Azure-DocumentDB-NET-Code-6b3da8af#content)
4.	[DocumentDB Consistency Levels] [consistency-levels]
5.	ANSI SQL 2011 - [http://www.iso.org/iso/iso_catalogue/catalogue_tc/catalogue_detail.htm?csnumber=53681](http://www.iso.org/iso/iso_catalogue/catalogue_tc/catalogue_detail.htm?csnumber=53681)
6.	JSON [http://json.org/](http://json.org/)
7.	Javascript Specification [http://www.ecma-international.org/publications/standards/Ecma-262.htm](http://www.ecma-international.org/publications/standards/Ecma-262.htm) 
8.	LINQ [http://msdn.microsoft.com/en-us/library/bb308959.aspx](http://msdn.microsoft.com/en-us/library/bb308959.aspx) 
9.	Query evaluation techniques for large databases [http://dl.acm.org/citation.cfm?id=152611](http://dl.acm.org/citation.cfm?id=152611)
10.	Query Processing in Parallel Relational Database Systems, IEEE Computer Society Press, 1994
11.	Lu, Ooi, Tan, Query Processing in Parallel Relational Database Systems, IEEE Computer Society Press, 1994.
12.	Christopher Olston, Benjamin Reed, Utkarsh Srivastava, Ravi Kumar, Andrew Tomkins: Pig Latin: A Not-So-Foreign Language for Data Processing, SIGMOD 2008.
13.     G. Graefe. The Cascades framework for query optimization. IEEE Data Eng. Bull., 18(3): 1995.


[1]: ./media/documentdb-sql-query/sql-query1.png
[introduction]: ../documentdb-introduction
[consistency-levels]: ../documentdb-consistency-levels

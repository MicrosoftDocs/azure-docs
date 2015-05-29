<properties 
	pageTitle="RESTful interactions with DocumentDB resources | Azure" 
	description="Learn how to perform RESTful interactions with Microsoft Azure DocumentDB resources by using HTTP verbs." 
	services="documentdb" 
	authors="h0n" 
	manager="jhubbard" 
	editor="monicar" 
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/08/2015" 
	ms.author="h0n"/>

# RESTful interactions with DocumentDB resources 

DocumentDB supports the use of HTTP methods to create, read, replace, get, and delete DocumentDB resources.

By reading this article, you'll be able to answer the following questions:

- How do the standard HTTP methods work with DocumentDB resources?
- How do I create a new resource using POST?
- How do I register a stored procedure using POST?
- How does DocumentDB support currency control?
- What are the connectivity options for HTTPS and TCP?

## Overview of HTTP verbs
DocumentDB resources support the following HTTP verbs with their standard interpretation:

1.	POST means create a new item resource. 
2.	GET means read an existing item or a feed resource 
3.	PUT means replace an existing item resource 
4.	DELETE means delete an existing  item resource
5.	HEAD means GET sans the response payload (i.e. just the headers) 

>[AZURE.NOTE] In the future, we intend to add support for selective updates via PATCH.  

As illustrated in the following diagram, POST can only be issued against a feed resource; PUT and DELETE can only be issued against an item resource; GET and HEAD can be issued against either feed or item resources. 

![][1]  

**Interaction model using the standard HTTP methods**

## Create a new resource using POST 
To get a better feel for the interaction model, let’s consider the case of creating a new resource (aka INSERT). In order to create a new resource you are required to issue an HTTP POST request with the request body containing the representation of the resource against the URI of the container feed the resource belongs to. The only required property for the request is the id of the resource.  

As an example, in order to create a new database, you POST a database resource (by setting the id property with a unique name) against /dbs. Similarly, in order to create a new collection, you POST a collection resource against /dbs/_rid/colls/ and so on. The response contains the fully committed resource with the system generated properties including the _self link of the resource using which you can navigate to other resources. As an example of the simple HTTP based interaction model, a client can issue an HTTP request to create a new database within an account.  

	POST https://fabrikam.documents.azure.com/dbs
	{
	      "id":"MyDb"
	}

The DocumentDB service responds with a successful response and a status code indicating successful creation of the database.  

	HTTP/1.1 201 Created
	Content-Type: application/json
	x-ms-request-charge: 4.95
	...

	{
	      "id": "MyDb",
	      "_rid": "UoEi5w==",
	      "_self": "dbs/UoEi5w==/",
	      "_ts": 1407370063,
	      "_etag": "00000100-0000-0000-0000-54b636600000",
	      "_colls": "colls/",
	      "_users": "users/"
	}
  
## Register a stored procedure using POST
As another example of creating and executing a resource, consider a simple "HelloWorld" stored procedure written entirely in JavaScript.   

 	function HelloWorld() {
 	var context = getContext();
 	var response = context.getResponse();
 	
        response.setBody("Hello, World");
     }

The stored procedure can be registered to a collection under MyDb by issuing a POST against /dbs/_rid-db/colls/_rid-coll/sprocs. 

	POST https://fabrikam.documents.azure.com/dbs/UoEi5w==/colls/UoEi5w+upwA=/sprocs HTTP/1.1
	
	{
	  "id": "HelloWorld",
	  "body": "function HelloWorld() {
	           var context = getContext();
 	           var response = context.getResponse();
 	           
 	           response.setBody("Hello, World");
        	   }"
	}
The DocumentDB service responds with a successful response and a status code indicating successful registration of the stored procedure.  

	HTTP/1.1 201 Created
	Content-Type: application/json
	x-ms-request-charge: 4.95
	...

	{
	       "body": "function HelloWorld() {
	           var context = getContext();
 	           var response = context.getResponse();
 	           
 	           response.setBody("Hello, World");
        	   }",
	      "id": "HelloWorld"
	      "_rid": "UoEi5w+upwABAAAAAAAAgA==",
	      "_ts" :  1421227641
	      "_self": "dbs/UoEi5w==/colls/UoEi5w+upwA=/sprocs/UoEi5w+upwABAAAAAAAAgA==/",
	      "_etag": "00002100-0000-0000-0000-50f71fda0000"
	}

## Execute a stored procedure using POST
Finally, to execute the stored procedure in the above example, one needs to issue a POST against the URI of the stored procedure resource (/dbs/UoEi5w==/colls/UoEi5w+upwA=/sprocs/UoEi5w+upwABAAAAAAAAgA==/) as illustrated below.

	POST https://fabrikam.documents.azure.com/dbs/UoEi5w==/colls/UoEi5w+upwA=/sprocs/UoEi5w+upwABAAAAAAAAgA== HTTP/1.1
	
The DocumentDB service responds with the following response.  

	HTTP/1.1 200 OK
	
	"Hello World"

Note that the POST verb is used for creation of a new resource, for executing a stored procedure, and for issuing a SQL query. To illustrate the SQL query execution, consider the following.  

	POST https://fabrikam.documents.azure.com/dbs/UoEi5w==/colls/UoEi5w+upwA=/docs HTTP/1.1
	...
	x-ms-documentdb-isquery: True
	x-ms-documentdb-query-enable-scan: True
	Content-Type: application/query+json
	...
	
	{"query":"SELECT f.LastName AS Name, f.Address.City AS City FROM Families f WHERE f.id='AndersenFamily' OR f.Address.City='NY'"}

The service responds with the results of the SQL query.   

	HTTP/1.1 200 Ok
	...
	x-ms-activity-id: 83f9992c-abae-4eb1-b8f0-9f2420c520d2
	x-ms-item-count: 2
	x-ms-session-token: 4
	x-ms-request-charge: 3.1
	Content-Type: application/json1
	...
	{"_rid":"UoEi5w+upwA=","Documents":[{"Name":"Andersen","City":"Seattle"},{"Name":"Wakefield","City":"NY"}],"_count":2}



## Using PUT, GET, and DELETE
Replacing or reading a resource amounts to issuing PUT (with a valid request body) and GET verbs against the _self link of the resource respectively. Likewise, deleting a resource amounts to issuing a DELETE verb against the _self link of the resource. It is worth pointing out that the hierarchical organization of resources in the DocumentDB’s resource model necessitates the support for cascaded deletes wherein deleting the owner resource causes deletion of the dependent resources. The dependent resources may be distributed across other nodes than the owner resources and so the deletion could happen lazily. Regardless of mechanics of the garbage collection, upon deletion of a resource, the quota is instantly freed up and is available for you to use. Note that the referential integrity is preserved by the system. For instance, you cannot insert a collection to a database which is deleted or replace or query a document of a collection which no longer exists.  
 
Issuing a GET against a feed of resources or querying a collection may result into potentially millions of items, thus making it impractical for both server to materialize them and clients to consume them as part of a single roundtrip/ request and response exchange. To address this, DocumentDB allows the clients to paginate over the large feed page-at-a-time. The clients can use the [x-ms-continuation] response header as a cursor to navigate to the next page.   

## Optimistic concurrency control
Most web applications rely on entity tag based optimistic concurrency control to avoid the infamous “Lost Update” and “Lost Delete” problems. The entity tag is a HTTP friendly, logical timestamp associated with a resource. DocumentDB natively support the optimistic concurrency control by ensuring that every HTTP response contains the version (durably) associated with the specific resource. The concurrency control conflicts are correctly detected for the following cases:  

1.	If two clients simultaneously issue mutating requests (via PUT/ DELETE verbs) on a resource with the latest version of the resource (specified via the [if-match] request header), the DocumentDB database engine subjects them to the transactional concurrency control.
2.	If a client presents with an older version of the resource (specified via the [if-match] request header), its request is rejected.  

## Connectivity options
DocumentDB exposes a logical addressing model wherein each resource has a logical and stable URI identified by its _self link. As a distributed storage system spread across regions, the resources under various database accounts in DocumentDB are partitioned across numerous machines and each partition is replicated for high availability. The replicas managing the resources of a given partition register physical addresses. While the physical addresses change over the course of time due to failures, their logical addresses remain stable and constant. The logical to physical address translation is kept in a routing table which is also internally available as a resource. DocumentDB exposes two connectivity modes:  

1.	**Gateway Mode:** The clients are shielded from the translation between logical to physical addresses or the details of the routing; they simply deal with logical URIs and RESTfully navigate the resource model. The clients issue the requests using logical URI and the edge machines translate the logical URI to the physical address of the replica which manages the resource and forwards the request. With the edge machines caching (and periodically refreshing) the routing table, routing is extremely efficient. 
2.	**Direct Connectivity Mode:** The clients directly manage the routing table in their process space and periodically refresh it. Client can directly connect with the replicas and bypass the edge machines.   


<table width="300">
    <tbody>
        <tr>
            <td width="120" valign="top">
                <p>
                    <strong>Connectivity Mode</strong>
                </p>
            </td>
            <td width="66" valign="top">
                <p>
                    <strong>Protocol</strong>
                </p>
            </td>
            <td width="264" valign="top">
                <p>
                    <strong>Details</strong>
                </p>
            </td>
            <td width="150" valign="top">
                <p>
                    <strong>DocumentDB SDKs</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td width="120" valign="top">
                <p>
                    Gateway
                </p>
            </td>
            <td width="66" valign="top">
                <p>
                    HTTPS
                </p>
            </td>
            <td width="264" valign="top">
                <p>
                    Applications directly connect with the edge nodes using logical URIs. This incurs an extra network hop.
                </p>
            </td>
            <td width="150" valign="top">
                <p>
                    REST API, .NET, Node.js, Java, Python, JavaScript
                </p>
            </td>
        </tr>
        <tr>
            <td width="120" valign="top">
                <p>
                    Direct Connectivity
                </p>
            </td>
            <td width="66" valign="top">
                <p>
                    HTTPS and
                </p>
                <p>
                    TCP
                </p>
            </td>
            <td width="264" valign="top">
                <p>
                    The applications can directly access the routing table and perform the client side routing to directly connect with replicas.
                </p>
            </td>
            <td width="150" valign="top">
                <p>
                    .NET
                </p>
            </td>
        </tr>
    </tbody>
</table>

## Next steps
Explore the [Azure DocumentDB REST API Reference](https://msdn.microsoft.com/library/azure/dn781481.aspx) to learn more about working with resources using the REST API.

## References
- [Azure DocumentDB REST API Reference](https://msdn.microsoft.com/library/azure/dn781481.aspx) 
- [Query DocumentDB](../documentdb-sql-query/)
- [DocumentDB SQL Reference](https://msdn.microsoft.com/library/azure/dn782250.aspx)
- [DocumentDB Programming: Stored procedures, triggers, and UDFs](../documentdb-programming/)
- [DocumentDB Reference Documentation](https://msdn.microsoft.com/library/azure/dn781482.aspx)
- REST [http://en.wikipedia.org/wiki/Representational_state_transfer](http://en.wikipedia.org/wiki/Representational_state_transfer)
- JSON specification  [http://www.ietf.org/rfc/rfc4627.txt](http://www.ietf.org/rfc/rfc4627.txt)
- HTTP specification [http://www.w3.org/Protocols/rfc2616/rfc2616.html](http://www.w3.org/Protocols/rfc2616/rfc2616.html)
- Entity Tags [http://en.wikipedia.org/wiki/HTTP_ETag](http://en.wikipedia.org/wiki/HTTP_ETag)


[1]: ./media/documentdb-interactions-with-resources/interactions-with-resources2.png

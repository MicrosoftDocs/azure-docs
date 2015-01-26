<properties pageTitle="Interact with DocumentDB resources | Azure" description="DocumentDB provides client SDKs for .NET, Python, Node.js and JavaScript – all of which are simple wrappers over the underlying REST APIs." services="documentdb" authors="spelluru" manager="jhubbard" editor="cgronlun" documentationCenter=""/>

<tags ms.service="documentdb" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="08/20/2014" ms.author="spelluru"/>

#Interact with DocumentDB Resources 
DocumentDB offers a simple and open RESTful programming model over HTTP. In its Preview release DocumentDB provides client SDKs for .NET, Python, Node.js and JavaScript – all of which are simple wrappers over the underlying REST APIs. In future releases, it will also provide C++ and Java SDKs. We encourage you to write your own SDKs for your specific programming environment and share it with the community as we have opened up our SDKs. 

>[AZURE.NOTE] Additionally, it also offers a highly efficient TCP protocol which is also RESTful in its communication model and is available through the .NET client SDK.  

##Resources
The entities that DocumentDB manages are referred to as the **resources**, which are uniquely identified by their logical URI. Developers can interact with the resources using standard HTTP verbs, request/response headers and status codes. As the following diagram illustrates, DocumentDB’s **resource model** consists of a sets of resources under a database account, each addressable via a logical and stable URI. A set of resources is referred to as a **feed** in this document.  

![][1]  

##Hierarchical resource model under a database account ##

As a customer of DocumentDB, you start by provisioning a DocumentDB **database account** using your Azure subscription. A database account consists of a set of **databases**, each containing multiple **collections**, each of which in-turn contain **stored procedures, triggers, UDFs, documents** and related **attachments**. A database also has associated **users** each with a set of **permissions** to access various other collections, stored procedures, triggers, UDFs, documents or attachments. While databases, users, permissions and collections are system defined resources with well-known schemas, documents and attachments contain arbitrary, user defined JSON content.  

|Resource 	|Description
|-----------|-----------
|Database Account	|A database account is associated with one or more capacity units representing provisioned document storage and throughput, a set of databases and blob storage. You can create one or more database accounts using your Azure subscription.
|Database	|A database is a logical container of document storage partitioned across collections. It is also a users container.
|User	|The logical namespace for scoping/partitioning permissions. 
|Permission	|An authorization token associated with a user for authorized access to a specific resource.
|Collection	|A collection is a container of JSON documents and associated JavaScript application logic.
|Stored Procedure	|Application logic written in JavaScript which is registered with a collection and transactionally executed within the database engine.
|Trigger	|Application logic written in JavaScript modeling side effects associated with an insert, replace or delete operations.
|UDF	|A side effect free, application logic written in JavaScript. UDFs enable you to model a custom query operator and thereby extend the core DocumentDB query language.
|Document	|User defined (arbitrary) JSON content. By default, no schema needs to be defined or secondary indices need to be provided for all the documents added to a collection.
|Attachment	|Attachment are special documents containing references and associated metadata to an external blob/media. The developer can choose to have the blob managed by DocumentDB or store it with an external blob service provider such as OneDrive, Dropbox etc. 

###System vs. User defined Resources
Resources such as database accounts, databases, collections, users, permissions, stored procedures, triggers, and UDFs - all have a fixed schema and are called *system resources*. In contrast, resources such as documents and attachments have no restrictions on the schema and are examples of *user defined resources*. In DocumentDB, both system and user defined resources are represented and managed as standard compliant JSON. All resources, system or user defined have the following common properties.

>[AZURE.NOTE] Note that all system generated properties in a resource are prefixed with an underscore (_) in their JSON representation.  


<table width="500"> 
<tbody>
<tr>
<td valign="top" ><p><b>Property </b></p></td>
<td valign="top" ><p><b>User settable or system generated?</b></p></td>
<td valign="top" ><p><b>Purpose</b></p></td>
</tr>

<tr>
<td valign="top" ><p>_rid</p></td>
<td valign="top" ><p>System generated</p></td>
<td valign="top" ><p>System generated, unique and hierarchical identifier of the resource</p></td>
</tr>

<tr>
<td valign="top" ><p>_etag</p></td>
<td valign="top" ><p>System generated</p></td>
<td valign="top" ><p>etag of the resource required for optimistic concurrency control</p></td>
</tr>

<tr>
<td valign="top" ><p>_ts</p></td>
<td valign="top" ><p>System generated</p></td>
<td valign="top" ><p>Last updated timestamp of the resource</p></td>
</tr>

<tr>
<td valign="top" ><p>_self</p></td>
<td valign="top" ><p>System generated</p></td>
<td valign="top" ><p>Unique addressable URI of the resource </p></td>
</tr>

<tr>
<td valign="top" ><p>id</p></td>
<td valign="top" ><p>User settable</p></td>
<td valign="top" ><p>User defined unique name of the resource </p></td>
</tr>

</tbody>
</table>


###Wire representation of resources
DocumentDB does not mandate any proprietary extensions to the JSON standard or special encodings; it works with standard compliant JSON documents.  
 
###Addressing a resource
All resources are URI addressable. The value of the **_self** property of a resource represents the relative URI of the resource. The format of the URI consists of the /<feed>/{_rid} path segments:  

|Value of the _self	|Description
|-------------------|-----------
|/dbs	|feed of databases under a database account
|/dbs/{_rid-db}	|Database with the unique id property with the value {_rid-db}
|/dbs/{_rid-db}/colls/	|feed of collections under a database 
|/dbs/{_rid-db}/colls/{_rid-coll}	|Collection with the unique id property with the value {_rid-coll}
|/dbs/{_rid-db}/users/	|feed of users under a database 
|/dbs/{_rid-db}/users/{_rid-user}	|User with the unique id property with the value {_rid-user}
|/dbs/{_rid-db}/users/{_rid-user}/permissions	|feed of permissions under a database 
|/dbs/{_rid-db}/users/{_rid-user}/permissions/{_rid-permission}	|Permission with the unique id property with the value {_rid-permission}  
  

A resource also has a unique user defined name exposed via the id property of the resource. The id is a user defined, up to 256 character long string which is unique within the context of a specific parent resource. For instance, the value of the id property of all documents within a given collection are unique but they are not guaranteed to be unique across collections. Similarly, the value of the id property of all permissions for a given user are unique but they are not guaranteed to be unique across all users. The _rid property is used to construct the addressable _self link of a resource.   

Each resource also has a system generated hierarchical resource identifier (also referred to as, RID) which is available via the _rid property. The RID encodes the entire hierarchy of a given resource and it is a very convenient internal representation used to enforce referential integrity in a distributed manner. The RID is unique within a database account and is internally used by DocumentDB for efficient routing without requiring cross partition lookups. 

The values of the _self and the  _rid properties are both alternate and canonical representations of a resource.  
 
##Basic Interaction Model
The resources support the following HTTP verbs  with their standard interpretation:

>[AZURE.NOTE] In future, we intend to add support for selective updates via PATCH  

1.	POST means create a new item resource. 
2.	GET means read an existing item or a feed resource 
3.	PUT means replace an existing item resource 
4.	DELETE means delete an existing  item resource
5.	HEAD means GET sans the response payload (i.e. just the headers)

In future releases, item resources will support the PATCH verb as well.  

As illustrated in the figure below POST can only be issued against a Feed resource; PUT, DELETE can only be issued against an Item resource; GET and HEAD can be issued against either Feed or Item resources. 

![][2]  

**Interaction model using the standard HTTP verbs**

To get a better feel for the interaction model, let’s consider the case of creating a new resource (aka INSERT). In order to create a new resource you are required to issue a HTTP POST request with the request body containing the representation of the resource against the URI of the container feed the resource belongs to. The only required property for the request is the id of the resource.  

As an example, in order to create a new database, you POST a database resource (by setting the id property with a unique name) against /dbs, similarly, in order to create a new collection, you POST a collection resource against /dbs/_rid/colls/ and so on. The response will contain the fully committed resource with the system generated properties including the _self link of the resource using which you can navigate to other resources. As an example of the simple HTTP based interaction model, a client can issue an HTTP request to create a new database within an account:  

	POST http://fabrikam.documents.azure.net/dbs
	{
	      "id":"MyDb"
	}
DocumentDB responds with a successful response and a status code indicating successful creation of the database.  

	[201 Created]
	{
	      "id": "MyDb",
	      "_rid": "UoEi5w==",
	      "_self": "dbs/MyDb/",
	      "_ts": 1407370063,
	      "_etag": "\"00002100-0000-0000-0000-50e71fda0000\"",
	      "_colls": "colls/",
	      "_users": "users/"
	}

DocumentDB service responds with a successful response and a status code indicating successful creation of the database.  

As another example of creating and executing a resource, consider the following stored procedure written entirely in JavaScript.   

	function sproc(docToCreate, addedPropertyName, addedPropertyValue) {
	    var collectionManager = getContext().getCollection();
	    collectionManager.createDocument(collectionManager.getSelfLink(), docToCreate,   
	    function(err, docCreated) {
	        if(err) throw new Error('Error while creating document: ' + err.message);
	        
	        docCreated.addedPropertyName = addedPropertyValue;
	        getContext().getResponse().setBody(docCreated);
	    });
	}

The stored procedure can be registered to a collection under MyDb by issuing a POST against /dbs/_rid-db/colls/_rid-coll/sprocs. 

	POST /dbs/MyDb/colls/MyColl/sprocs HTTP/1.1
	
	{
	  "id": "sproc1",
	  "body": "function (docToCreate, addedPropertyName, addedPropertyValue) {
	                var collectionManager = getContext().getCollection();
	                collectionManager.createDocument(collectionManager.getSelfLink(), 
	                            docToCreate, function(err, docCreated) {
	                    if(err) throw new Error('Error while creating document: ' + 
	                                                     err.message);
	                    
	                    docCreated.addedPropertyName = addedPropertyValue;
	                    getContext().getResponse().setBody(docCreated);
	                });
	            }"
	}
DocumentDB service responds with a successful response and a status code indicating successful registration of the stored procedure.  

	[201 Created]
	{
	      "id": "sproc1",
	      "_rid": "EoEi5w==",
	      "_self": "dbs/MyDb/colls/MyColl/sprocs/sproc1",
	      "_etag": "\"00002100-0000-0000-0000-50f71fda0000\"",
	       ...
	}

Finally, to execute the stored procedure in the above example, one needs to issue a POST against the URI of the stored procedure resource (/dbs/_rid-db/colls/_rid-coll/sprocs/sproc1). This is illustrated below:  

	POST /dbs/MyDb/colls/MyColl/sprocs/sproc1 HTTP/1.1
	 [ { "id": "TestDocument", "book": "Autumn of the Patriarch"}, "Price", 200 ]
 

The DocumentDB service would respond with the following response:  

	HTTP/1.1 200 OK
	 { 
	  "id": "TestDocument",  
	  "_rid": "ZTlcANiwqwIBAAAAAAAAAA==",
	  "_ts": 1407370063,
	  "_self": "dbs/ZTlcAA==/colls/ZTlcANiwqwI=/docs/ZTlcANiwqwIBAAAAAAAAAA==/",
	  "_etag": "00000900-0000-0000-0000-53e2c34f0000",
	  "_attachments": "attachments/",
	  "book": "Autumn of the Patriarch", 
	  "price": 200
	}

Note that the POST verb is used both for creation of a new resource, for executing a stored procedure or for issuing a SQL query. To illustrate the SQL query execution, consider the following:  

	POST /dbs/MyDb/colls/MyColl/docs HTTP/1.1
	...
	x-ms-documentdb-isquery: True
	Content-Type: application/sql
	
	SELECT * FROM root.children

The service responds with the results of the SQL query.   

	HTTP/1.1 200 Ok
	x-ms-activity-id: 83f9992c-abae-4eb1-b8f0-9f2420c520d2
	x-ms-item-count: 2
	x-ms-session-token: 81
	x-ms-request-charge: 1.43
	Content-Length: 287
	
	{"_rid":"sehcAIE2Qy4=","Documents":[[{"firstName":"Henriette Thaulow","gender":"female","grade":5,"pets":[{"givenName":"Fluffy"}]}],[{"familyName":"Merriam","givenName":"Jesse","gender":"female","grade":1},{"familyName":"Miller","givenName":"Lisa","gender":"female","grade":8}]],"count":2}


Replacing or reading a resource amounts to issuing PUT (with a valid request body) and GET verbs against the _self link of the resource respectively. Likewise, deleting a resource amounts to issuing a DELETE verb against the _self link of the resource. It is worth pointing out that the hierarchical organization of resources in the DocumentDB’s resource model necessitates the support for cascaded deletes wherein deleting the owner resource causes deletion of the dependent resources. The dependent resources may be distributed across other nodes than the owner resources and so the deletion could happen lazily. Regardless of mechanics of the garbage collection, upon deletion of a resource, the quota is instantly freed up and is available for you to use. Note that the referential integrity is preserved by the system. For instance, you cannot insert a collection to a database which is deleted or replace or query a document of a collection which no longer exists.  
 
Issuing a GET against a feed (of) resources or querying a collection may result into potentially millions of items, thus making it impractical for both server to materialize them and clients to consume them as part of a single roundtrip/ request and response exchange. To address this, DocumentDB allows the clients to paginate over the large feed page-at-a-time. The clients can use the [x-ms-continuationToken] response header as a cursor to navigate to the next page.   

##Optimistic Concurrency Control
Most Web applications rely on entity tag based Optimistic Concurrency Control to avoid the infamous “Lost Update” and “Lost Delete” problems. The entity tag is a HTTP friendly, logical timestamp associated with a resource. DocumentDB natively support the optimistic concurrency control by ensuring that every HTTP response contains the version (durably) associated with the specific resource. The concurrency control conflicts are correctly detected for the following cases:  

1.	If two clients simultaneously issue mutating requests (via PUT/ DELETE verbs) on a resource with the latest version of the resource (specified via the [if-match] request header), the DocumentDB database engine subjects them to the transactional concurrency control.
2.	If a client presents with an older version of the resource (specified via the [if-match] request header), its request is rejected.  

##Connectivity Options
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
                    REST APIs
                </p>
                <p>
                    .NET, JavaScript, Node.js, Python
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

##References
-	REST [http://en.wikipedia.org/wiki/Representational_state_transfer](http://en.wikipedia.org/wiki/Representational_state_transfer)
-	JSON specification  [http://-www.ietf.org/rfc/rfc4627.txt](http://-www.ietf.org/rfc/rfc4627.txt)
-	HTTP specification [http://www.w3.org/Protocols/rfc2616/rfc2616.html](http://www.w3.org/Protocols/rfc2616/rfc2616.html)
-	Entity Tags [http://en.wikipedia.org/wiki/HTTP_ETag](http://en.wikipedia.org/wiki/HTTP_ETag)
-	[Query DocumentDB](/documentation/articles/documentdb-sql-query/)
-	[DocumentDB SQL Reference](http://go.microsoft.com/fwlink/p/?LinkID=510612)
-	[DocumentDB Programming: Stored procedures, triggers, and UDFs](/documentation/articles/documentdb-programming/)
-	[DocumentDB Reference Documentation](http://go.microsoft.com/fwlink/p/?LinkID=402384)


[1]: ./media/documentdb-interactions-with-resources/interactions-with-resources1.png
[2]: ./media/documentdb-interactions-with-resources/interactions-with-resources2.png

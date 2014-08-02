<properties title="DocumentDB fundamentals" pageTitle="DocumentDB fundamentals | Azure" description="required" metaKeywords="" services="" solutions="" documentationCenter="" authors="" videoId="" scriptId="" />

<tags ms.service="documentdb" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="" />

#Microsoft Azure DocumentDB fundamentals
##What is Microsoft Azure DocumentDB? 
Microsoft Azure DocumentDB is a highly-scalable NoSQL document database-as-a-service that offers rich query over schema-free data, helps deliver configurable and reliable performance, and enables rapid development -- all through a managed platform backed by the power and reach of Microsoft Azure. DocumentDB is the right solution for web and mobile applications when predictable throughput, low latency, and a schema-free data model are key.  DocumentDB delivers schema flexibility and rich indexing via a native JSON data model, and includes multi-document transactional support with integrated JavaScript.  
  
For more information on DocumentDB, please visit the DocumentDB Documentation Center.
##What kind of database is DocumentDB?
DocumentDB is a NoSQL Document store that stores data in JSON format.  DocumentDB database supports nested, self-contained-data structures that can be queried.
##Do DocumentDB databases have tables?
No, data in DocumentDB databases are stored in collections of JSON documents. Unlike a table, there is no predefined schema with a collection of documents. 
##Do DocumentDB databases have schemas?
No, DocumentDB is designed to efficiently store, query and process data represented as JSON.  JSON documents have a schema free design to enable the customer to query over their entire database without secondary indexing or providing index hints.
##Does DocumentDB support ACID transactions?
DocumentDB supports multi-document transactions expressed as JavaScript application logic. Transactions are scoped to a single collection and executed with ACID semantics as all or nothing isolated from other concurrently executing code and user requests. Within a single document, DocumentDB supports full ACID transactions for updated scoped to an entity. Each entity is stored with a logical commit version which is provided with update requests to deal with concurrency control.
##What are the typical use cases for DocumentDB?  

**Enterprise Content Delivery**  

There has been an increasing demand in serving enterprise content with personalized and interactive views across many devices.  The enterprise content delivery system is typically read heavy.  While content is typically created less frequently, the content delivery system must adapt to facilitate new views and personalized experiences for each user.  Hence, the content is typically stored as schema-less or semi-schema’d document.  

**Active Application Exhaust**  

Smart device applications especially games are increasing leveraging telemetry and behavioral data to adjust application level experiences in real time.  These applications are not just emitting telemetry data for post-processing but also storing and serving the data to other applications or using the data to adjust experience in real time.  This data may be used to determine trending content that should be offered to more users, effectiveness of in-app marketing or queried to provide real-time application analytics  

**User Generated Data**

Social centric applications create, store and query high volume of user generated data.   These social applications integrate with one or more social network and need to keep pace with the changing demands of an active user base. In many cases the user data stored represents either content or activity events for common media types such as photos, books or videos. An extension of this pattern is managing and serving information about users including metadata, profile data, user state and preferences.


##What are the resource limits?
An Azure DocumentDB account supports up to 5 capacity units.  You are allowed to create up to 10 database entities or persist up to a total of 50 GB of data per account.  For more information on resource quotas, please see General Guidelines and Limitations.
##How do I sign-up for Microsoft Azure DocumentDB?
Microsoft Azure DocumentDB (Preview) is only available in the Azure Management Preview portal.  First you must purchase a Microsoft Azure subscription.  Once you sign up for a Microsoft Azure subscription, you can add a DocumentDB account to your Azure subscription via the Gallery.  
##How much does Microsoft Azure DocumentDB cost?
Please refer to the DocumentDB Pricing section.
#Does DocumentDB provide a free tier?

#Setting up Microsoft Azure DocumentDB
##How do I create a database account?
Microsoft Azure DocumentDB (Preview) is only available in the new Azure Preview portal.  First you must sign up for a Microsoft Azure subscription.  Once you sign up for a Microsoft Azure subscription, you can add a DocumentDB account to your Azure subscription via the Gallery. 
##What is a master key?
A master key is a security token to access all resources for an account.   Individuals with the key will have read and write access to the all resources in the database account. Please use caution when distributing master keys.  For more information on Master Key, please see Security and Authorization.

##How do I create a database?
You can create databases using the SDKs we support.  Please refer to the Development section for information on how to program with the SDKs we provide.
##What is a collection?
A collection is like a table in a relational database but free of the schema enforcement of relational tables.  It is a logical container consisting of documents sharing the same attributes or behaviors.   

##Are there any restrictions on naming databases and collections?
Strings for database and collection names are UTC-8 encoded.  The max size for the string is 256 bytes.
##How do I set up users and permissions?
You can leverage our programming model to set up users and permissions. For details, please see the Development section.  


##How can I insert documents in bulk into DocumentDB? 
You can write a simple load program by leverage our SDKs.  For details on our programming model, please see the Development section.   

#Developing against Microsoft Azure DocumentDB
##How to do I start developing against DocumentDB?
At Public Preview, we provide 4 flavors of SDKs: .NET, Python, Node.js and JavaScript.  Develops can also leverage our RESTful APIs to interact with the resources under a database account. For details on how to use these SDKs, please see the Development section.
##Does DocumentDB support SQL?
We provide a SQL query language to enable querying ofresources within a database account..   For details on how to use our SQL grammar, please refer to the Query DocumentDB – SQL section.

##What are the data types supported by DocumentDB?
The primitive data types supported in DocumentDB are the same as JSON. JSON has a simple type system that consists of Strings, Numbers (IEEE754 double precision), Booleans – true and false and Nulls.  More complex data types like DateTime, Guid, Int64, and Geometry can be represented both in JSON and DocumentDB through the creation of nested objects using the { } operator and arrays using the [ ] operator. 

##How does DocumentDB provide concurrency?
DocumentDB supports optimistic concurrency control (OCC) through HTTP entity tags or ETags. Every DocumentDB resource has an ETag, and DocumentDB clients include their latest read version in write requests.  

-	If the ETag is current, the change is committed. 
-	If the value has been changed externally, the server rejects the write with a “HTTP 412 Precondition failure” response code. Clients must read the latest version of the resource and retry the request.


##How do I perform transactions in DocumentDB?
DocumentDB supports language-integrated transactions via JavaScript stored procedures and triggers.  All database operations inside scripts are executed under snapshot isolation scoped to the collection. A snapshot of the document versions (ETags) is taken at the start of the transaction and committed only if the script succeeds. If the JavaScript throws an error, the transaction is rolled back.

##Does DocumentDB support caching?
Yes, because DocumentDB is a RESTful service, resource links are immutable and can be cached. DocumentDB clients can specify an “If-None-Match” header for reads against any resource like document or collection and update their local copies only when the server version has change.

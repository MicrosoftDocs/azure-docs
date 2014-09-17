#Sharding Overview 

##Principles of Sharding 

Sharding is a technique to spread large amounts of identically-structured data across a number of independent databases. It is especially popular with cloud developers who are creating Software as a Service (SAAS) offerings for end customers or businesses.  These end customers are often referred to as “Tenants”.  Sharding may be required for any number of reasons: 

* The total amount of data is too large to fit within the constraints of a single database. 
* The transaction throughput of the overall workload exceeds the capabilities of a single database.
* Different tenants may require physical isolation from each other’s data, so separate databases are needed for each tenant.
* Different sections of a database may need to reside in different geographies for compliance or geo-political reasons.
 
Sharding works best when every transaction in an application can be restricted to a single value of a sharding key.  That ensures that all transactions will be local to a specific database.  

Some applications are able to use the simplest approach of creating a separate database for each tenant.  This is the *single tenant* sharding pattern that provides isolation, backup/restore ability and resource scaling at the granularity of the tenant.  In single tenant sharding, each database is associated with a specific Tenant ID value (or Customer Key value), but that key need not always be present in the data itself.   It is the application’s responsibility to route each request to the appropriate database. 

Others scenarios pack multiple tenants together into databases, rather than isolating each into separate databases. This is a typical multitenant sharding scenario – and it may be driven by considerations of cost, efficiency or the fact that an application manages large numbers of very small tenants. In multitenant sharding, the rows in the database tables are all designed to carry a key identifying the tenant ID or sharding key.  Again, the application tier is responsible for routing a tenant’s request to the appropriate database. 

In other scenarios such as ingestion of data from distributed devices, sharding can be used to fill a set of databases distributed by a time period.  For example, a separate database can be dedicated to each day or week.   In that case the sharding key can be an integer representing the date (present in all rows of the sharded tables), and queries retrieving information for a date range must be routed by the application to the subset of databases covering the range in question.  

Regardless of the sharding model being used, a special data structure known as a shard map serves as a lookup table associating sharding key values with databases, allowing the application to perform the routing for database requests. 

Once data is distributed among multiple databases, the application is faced with several challenges: 

1) How do I maintain the Shard Map – the metadata that tracks which database contains each logical slice of data?   This is the problem of Shard Map Management. 2) Given a transaction request, to which database should I send it?   This is known as Data Dependent Routing.

3) How do I satisfy requests that cross database boundaries?   This is referred to as Multi-Shard Query. 

4) How can I easily move data among databases to rebalance the distribution of work?  This is known as Split/Merge operations. 5) How can I easily adjust the throughput of databases to handle growth or the special needs of particular tenants?  We refer to this as Shard Elasticity.

There are additional management challenges in working with sharded databases. For example coordinating schema changes, reference table updates, or management operations such as index maintenance across a large set of databases.  And frequently, an application will need to maintain a set of common reference tables that are replicated across all databases.   

The Elastic Scale preview provides a set of client libraries and management services to simplify these areas of work for an application to operate effectively with a sharded data environment Sharding and Elasticity

Sharding a database in the cloud does help facilitate elasticity for an application’s data tier.  There are two types of elasticity that apply – vertical and horizontal. 

Vertical Elasticity recognizes that since each shard is a separate physical database, you have the freedom to increase the size or capability (Service Level Objective -- SLO) of each shard independently. For example, if a specific shard is associated with an especially busy end-customer for one month out of the year, it can be upgraded to a Premium Edition database for that period of time, and return to Standard Edition later, allowing you to fine-tune your costs to match the specific demands on the system. 

Horizontal Elasticity reflects your ability to add and remove database when needed to accommodate growth or shrinkage in demand.  You may need to rebalance data across the system when changing database count in a multitenant environment – e.g. when removing a small or underutilized DB, the data in that shard will need to be moved to other shards in the system before dropping the database.  This form of elasticity also supports handling “hot spots” in a multitenant database:  an especially busy segment of the database – perhaps associated with a popular product or store – can be moved to a separate database or to one that is relatively underutilized in order to rebalance the workload across all database assets.  

Elastic Scale Preview Offering In the Elastic Scale Preview, we are offering tooling to address the problems of Data Dependent Routing, Multi-Shard Query, and Shard Map Management. We also provide examples of using our APIs to achieve Vertical Elasticity, and provide a template for self-hosted Split/Merge Services to manage horizontal elasticity.  And later in the Preview we plan to extend our offering to include tooling for coordinating of other management operations spanning sets of shards.

In Elastic Scale Preview, we have several important restrictions on how sharding is supported:  * We are providing APIs that rely on ADO.Net 4.5 or later. Applications taking advantage of our sharding libraries need to be .Net applications.  Tools and applications not created with the Elastic Scale APIs can communicate with individual shards since they are regular Azure databases, but they do not have access to Data Dependent Routing or Multi-Shard Query capabilities. 

* Cross-database transactions are not supported – OLTP activity needs to be local to a shard. 

* Queries can be issued against multiple shards, but results will reflect a UNION ALL of results returned from each shard. 

* Sharding keys may be of type integer, long, GUID or byte[]. 

* We support shard maps based on either lists or ranges of values or associated with each shard, not hash-based maps.  You can, however, take the hash value of a column and use it as a key to implement hash-based sharding.  

* The sharding key needs to be a single key. If your sharding scheme needs to be more complex, say, by involving more than one column, consider concatenating the multiple columns together into a single key.  That key can also be associated with a computed column in the database. 

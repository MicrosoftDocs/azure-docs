<properties
   pageTitle="DocumentDB Global Daatabase"
   description="Planet-scale georeplication with Azure DocumentDB  "
   services="documentdb"
   documentationCenter=""
   keywords="time to live"
   authors="kiratp"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="documentdb"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/31/2016"
   ms.author="kipandya"/>
   
   
# Global Database

DocumentDB is challenging what availability and scale means when it comes to databases. Global Database builds on the foundation of DocumentDB’s distributed infrastructure and predictable consistency models to offer globally distributed databases. 

When it comes to databases and multi-datacenter replication, current technology has limited what is available, putting customers in the position of having to make difficult tradeoffs for cost, consistency and availability. Today’s databases can be divided into the following categories:
1. Single Site databases - Originally never designed to be globally distributed, many of these databases have implemented geo-replication as a means to recover from regional disasters (aka “disaster recovery”). These offer strong consistency in the local data center but remain completely silent about any guarantees in the remote data centers. A subset of these databases offer the two extreme consistency choices - strong vs. eventual within the data center.
2. Globally distributed databases – Designed as globally distributed from the start, these databases can be further categorized as follows: (a) Two well-defined consistency levels – typically, strong and eventual consistency and (b) No well-defined consistency guarantees - these burden the application developers with minutia of their replication protocol and expect them to make reasoned tradeoffs between consistency, availability and performance. 

Global Database is an evolution of Azure DocumentDB that allows customers to store, query and process JSON data at global scale. You can now can create databases that span multiple geographic locations. The databases are replicated globally for low latency data access from anywhere in the world while offering predictable data consistency guarantees for applications and systems interacting with the database. 

Global Database is designed for systems that require continuously available, global access to data. Global Database operates under the presumption that failures of all classes happen frequently including the degradation or loss of a regions. Global Databases are configured with multiple regions for global reads and conflict free writes. Regions can be independently reconfigured at any time to adapt to business needs, changing customer patterns or to deliver business continuity in the face of service or application failures. Put together, this enables building globally distributed applications with the same ease that DocumentDB enables in a single region today.

Global Database aims to bring global availability to the masses. Instead of multi-region replication being deployable only by larger customers with lots of management and engineering resources, Global Database enables even single-developer efforts to scale globally at affordable cost.


## Scaling up, Scaling out

Global Database enables you to reason about your data as one logical dataset that is available globally across multiple datacenters with well-defined, relaxed consistency levels, availability and latency guarantees.

Traditional database systems view "scale up" as the act of scaling up the single machine running the database, and "scale out" as the replication of this dataset to multiple machines. 

With Global Database, this changes by orders of magnitude. You can now reason about "scale up" as the act of scaling up a single collection within an entire datacenter across hundres of machines using [Partitioned Collections] [pcolls], and then scaling out globally across 18+ datacenters with Global Databases.


## Latency and Availability

DocumentDB offers single digit 99th percentile latencies for point reads and 30ms 99th percentile latencies for writes within the same datacenter today.

With Global Database, you can make your data available closer to your customers, reducing read and write latencies globally - instead of reaching out across continuents to get to your date, you can bring your data closer to your customers.

As latencies go down, availability goes up at a per-request level. Your application continues to function without failures even when there is momentary or permanent loss of connectivity or endpoints.


### SLA

Please refer to the [DocumentDB SLA] [sla] page for more info


## Tuning Consistency

It is strongly suggested that you familiarize yourself with the available consistency levels in DocumentDB here: [Using consistency levels to maximize availability and performance in DocumentDB] [consistency]

In the context of geo-replication, each of the available consistency levels come with tradeoffs that empower you to choose the right balance of consistency and availability for your application.

![Alt text; Global Database onsistency tradeoffs][3]

### Types

1.	Eventual Consistency
    -   Gaurentees
        -   Once write subsides, eventually every read version will converge.
    - Tradeoffs
        -   No Monotonic reads - Clients may read older versions of the same document within the same client session.
        -   No ordering - Clients may read different versions of the same document
    - Scenario examples
        -   Messaging applications
        
2.  Session Consistency
This is the default consistency level.
    -   Gaurentees
        -   Read your own write(s).
            -   Once a value is written in a session, subsequent read within the session will see the written version or higher
            -   This even applies to cases when the read is occurring in a region other than the write region. 
            -   Note that in the case that the read request gets to the read region before the write has been replicated there, there will an increase in latency as the read region will have to forward the request to the write region
        -   Monotonic read within session.
            -   Once a value is read in a session, subsequent reads within the session will see the read version or higher.
    -   Tradeoffs
        -   Unbounded staleness for reads across sessions.
            -   There is no user controlled bound on read staleness with respect to write(s) performed outside session. i.e. cross session reads over eventual consistency.
        -   No total ordering across session - i.e. client A may see an older version of a document even though client B has seen the latest version
    -   Scenarios:
        -   Shopping carts 
        -   Applications saving and retrieivng user preferences and settings. The user will be guarenteed to see that his settings were persisted every time, while getting low latency local reads

3.  Bounded Staleness Consistency
    -   Gaurentees
        -   Reads follow write(s) at write region.
            -   Once a value is written, subsequent reads are guaranteed to see the written version or higher in the write region.
            -   i.e. strong consistency within Write Region.
        -   Bounded stale reads at read region(s).
            -   Once a value is written, subsequent readers are guaranteed to see version or higher between (written version and written version – User specified staleness bound).
            -   Staleness bound can be expressed in two dimensions.
                -   maxPrefix – Staleness expressed in terms of absolute write versions.
                -   maxInterval – Staleness expressed in terms of time interval;
                -   E.g. maxPrefix = 1000, maxInterval = 30 seconds 
                    -   No reads will be staler than 30 seconds of last committed data.
                    -   No reads will be staler than 1000 version of last committed data.
    -   Tradeoffs
        -   Higher latency if replicas fall behind. The write region will experience backpressure 
        -   Note if a client attempts to read a document from a different region than the write region, it may see any value equal or older than its write, but guaranteed to be newer than the staleness bound.
    -   Scenarios
        -   Stock markets and other real-time systems that have low tolerance for  staleness and read latencies
        
4.  Strong Consistency
    - Guarentees
        -   No stale read – Once a value is written (acknowledged), every subsequent read is guaranteed to see the written version or higher.
        -   Total global ordering – Once a value is read, every subsequent read is guaranteed to see the read version or higher. 
    -   Tradeoffs
        -   Strong consistency comes with a high cost in terms of latency and availability when implemented at a global scale. DocumentDB supports Strong consisency within a single region (when configured to Bounded Staleness globally)


## Failover & Recovery

Global Databses will ensure data availabiltiy in the face of all classes of failures, from short-term connectivity losses and failed single nodes, to natural disasters resulting in the lsos of entire datacenters.


### Temporary failures

With temporary failures, 


### Region loss

In the event that DocumentDB suffers downtime in a region, the following will occur:
1. Any Database Accounts with write region set to the unavailable region will fail over writes to the next region configured for the account. If no other region is left to fail over to, write requests will fail.
2. Any clients performing reads from that region will fail over to the next region in their PreferredRegion list, if specified. If no other region is left to fail over to, read requests will fail.

When such availability loss occurs, there is a small window where writes (acknowledged to client) may have been persisted to the affected region, but may not have been replicated to other regions. In order to enable the recovery of this data, we will restore affected regions in a read-only state and notify all affected customers. At this point, the client SDKs can be configured to read from this region (single region in PreferedLocations list) and recover any un-replicated data by comparing it to other live regions.

Once data has been recovered, the affected region can be restored to active state from the Azure Portal. DocumentDB will rebuild the data in that region for that Database Account, and make it available in full operation state again.


## How it works

For each of your existing or new DocumentDB Database Accounts, you can now add regions where you want your data to be replicated. You can add any number of regions that DocumentDB is available in.

Each of these regions can serve read requests with the same RUs available to each collection. For example, if you have a collection with 10,000 RU/s provisioned to it, the same collection will be able to serve up to 10,000 RU/s in each of the regions. Each client can specify its own order of read region selection, with reads being served from the region at the top of the list. If one or more regions fail or are unreachable for the client, the client will automatically fail over down this list of preferred regions until a region is found that is serving requests. 

Writes go to one region at any given time. The service allows you to set your preferred order of write region selection in the Azure Portal. Once this is set, the service will select the top most region in this list as the write region. If one or more regions fail, the service will automatically select the first available region down the list as the write region. 

Finally, you can set a consistency level for replication (more below).

Once the global database is set up, there is no further day-to-day management necessary. The service will handle replication, and in the case of a regional failure, automatically handle failing over and recovering with minimal loss in availability.


## Selecting regions

When deploying to 2 or more regions, it is recommended that regions are selected based on the region pairs described in [Business continuity and disaster recovery (BCDR): Azure Paired Regions] [bcdr].

Specifically, when deploying multiple regions, make sure to select the same number of regions (+/-1 for odd/even) from each of the paired region columns. 


## Throughput and Performance

When you add one or more regions to a Database Account, each region is provisioned with the same throughput on a per-Collection basis. This means that each collection has an independent, identical RU budget in each region. 

When a read or write operation is performed on a collection in a region, it will consume RUs from that Collection's budget in that specific region only. Unlike other distributed database systems, the RU charge for write operations does not increase as the number of regions is increased. Also, there is no additional RU charge for receiving and persisting the replicated writes at the receiving regions. 

For example, assume that the client was performing 10 RU reads and 50 RU writes against a single region Database Account. Now, when additional regions are added to this database account, the RU charge for those same operations does not change. Each write will continue to be charged 50 RUs from the collection RU budget in the write region only (no impact on other regions). Similarly, each read will be charged 10 RUs from the budget of the collection in the region serving the operation, with no impact to other regions.


## Adding regions

Geo-replication can be enabled for new and existing accounts from the Database Account pane in the Azure Management Portal.

![Alt text; Add regions under DocumentDB Account > Settings > Add/Remove Regions][1]


## Write region selection

Every geo-replicated Database Account has 1 active write region. All writes to resources in that Database Account go to that region.

When configuring geo-replication, you can click and drag to order the list of regions to set your write region selection preference. DocumentDB will select the active write region based on this order (top down). If the first region is not available for any reason, the second region in the list will automatically become the active write region, and so on down the list. 

The impact of failover on active clients is discussed in the Failover & Recovery section below.

![Alt text; Change the write region by reordering the region list under DocumentDB Account > Settings > Change Write Regions][1]


## Read region selection

DocumentDB client SDKs provide an optional parameter "PreferredLocations" that is an ordered list of Azure regions. The SDK will automatically send all reads to the first available region in this list. If the first region returns an error or is not reachable, the client will retry 2 more times with that region, and then fail down the list to the next region, and so on. The SDK will check for region availability every 30s (?) and switch back to a more preferred region if it becomes available again. 

The client SDKs will only attempt to read to the regions specified in PreferedLocations. So, for example, if the Database Account is replicated to 3 regions, but the clients only specify 2 of the non-write regions for PreferedLocations, then no reads will be served out of the write region, even in the case of failover. This behavior can be used to 
1. fully reserve the RU budget of the write region for writes
2. deploy additional regions for data analytics without affecting production throughput, by specifying different PreferedLocations in production and analytics clients respectively.

If the PreferedLocations property is not set, all reads will be served from the current write region. 


## SDKs

Support for global databases is NOT a breaking change for any of the DocumentDB client SDKs or the REST API.


### .Net SDK
The SDK can be used without any code changes. In this case, the SDK will automatically direct both reads and writes to the current write region. 

The ConnectionPolicy parameter for the DocumentClient constructor has a new property, Microsoft.Azure.Documents.ConnectionPolicy.PreferredRegions. This property is of type Collection`<string`> and should contain a list of region names. The names are formatted per the Region Name column on the [Azure Regions] [regions] page. You can also use the predefined constants in the convenience class Microsoft.Azure.Documents.Regions.

The current write and read endpoints are availabe in DocumentClient.WriteEndpoint and DocumentClient.ReadEndpoint respectively.

> [AZURE.NOTE] The URLs for the endpoints should not be considered as long-lived constants. The service may update these at any point. The SDK will handle this change automatically.

    // Improves performance
    ServicePointManager.UseNagleAlgorithm = true;
    ServicePointManager.Expect100Continue = true;
    ServicePointManager.DefaultConnectionLimit = 10000;

    // Getting endpoints
    Uri accountEndPoint = new Uri(Properties.Settings.Default.Global DatabaseUri);
    string accountKey = Properties.Settings.Default.Global DatabaseKey;

    // Setting Direct TCP mode for low latency access - note required but highly recommended
    // More info: https://azure.microsoft.com/en-us/blog/performance-tips-for-azure-documentdb-part-1-2/
    ConnectionPolicy connectionPolicy = new ConnectionPolicy
    {
        ConnectionMode = ConnectionMode.Direct,
        ConnectionProtocol = Protocol.Tcp
    };
    
    //Setting read region selection preference 
    connectionPolicy.PreferredLocations.Add("West US"); // first preference
    connectionPolicy.PreferredLocations.Add("East US"); // second preference
    connectionPolicy.PreferredLocations.Add("North Europe"); // third preference

    // initialize connection
    DocumentClient docClient = new DocumentClient(
        accountEndPoint,
        accountKey,
        connectionPolicy);

    // connect to DocDB 
    await docClient.OpenAsync().ConfigureAwait(false);


### NodeJS, JavaScript and Python SDKs
The SDK can be used without any code changes. In this case, the SDK will automatically direct both reads and writes to the current write region. 

The ConnectionPolicy parameter for the DocumentClient constructor has a new property, DocumentClient.ConnectionPolicy.PreferredRegions. This is parameter is an array of strings that takes a list of region names. The names are formatted per the Region Name column in the [Azure Regions] [regions] page. You can also use the predefined constants in the convenience object AzureDocuments.Regions

The current write and read endpoints are available in DocumentClient.getWriteEndpoint and DocumentClient.getReadEndpoint respectively.

> [AZURE.NOTE] The URLs for the endpoints should not be considered as long-lived constants. The service may update these at any point. The SDK will handle this change automatically.

Below is a code example for NodeJS/Javascripte. Python will follow the same pattern.

    // Creating a ConnectionPolicy object
    var connectionPolicy = new DocumentBase.ConnectionPolicy();
    
    // Setting read region selection preference, in the following order -
    // 1 - West US
    // 2 - East US
    // 3 - North Europe
    connectionPolicy.PreferredLocations = ['West US', 'East US', 'North Eurpope'];
    
    // initialize the connection
    var client = new DocumentDBClient(host, { masterKey: masterKey }, connectionPolicy);


### REST 
Once geo-replication is enabled on a Database Account, clients can query its availability by performing a GET request on the following URI.

https://management.azure.com/subscriptions/{subid}/resourcegroups/{resourcegroupname}/providers/Microsoft.DocumentDB/databaseAccounts/{accountname}

The service will return a list of regions and their corresponding DocumentDB endpoint URIs for the replicas. The current write region will be indicated in the response. The client can then select the appropriate endpoint for all further REST API requests as follows.
•	All PUT, POST and DELETE requests must go to the indicated write URI
•	All GETs and other read-only requests may go to any endpoint of the client’s choice
Write requests to read-only regions will fail with HTTP error code 405 (“Method not allowed”).

If the write region changes after the client’s initial discovery phase, subsequent writes to the previous write region will fail with HTTP error code 405 (“Method not allowed”). The client should then GET the list of regions again to get the updated write region.


## Pricing

Please refer to the [DocumentDB Pricing] [pricing] for pricing information.



<!--Image references-->
[1]: ./media/documentdb-global-database/documentdb_add_region.png
[2]: ./media/documentdb-global-database/documentdb_change_write_region.png
[3]: ./media/documentdb-global-database/documentdb_globaldb_consistency.jpg

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[pcolls]: https://azure.microsoft.com/documentation/articles/documentdb-partition-data/
[consistency]: https://azure.microsoft.com/documentation/articles/documentdb-consistency-levels/
[bcdr]: https://azure.microsoft.com/documentation/articles/best-practices-availability-paired-regions/
[regions]: https://azure.microsoft.com/regions/ 
[pricing]: https://azure.microsoft.com/pricing/details/documentdb/
[sla]: https://azure.microsoft.com/support/legal/sla/documentdb/ 



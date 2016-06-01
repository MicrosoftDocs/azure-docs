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

Leveraging the global scale of Azure to enable geo-redundancy is a key part of enabling high availability, low latency access to your data.

Global Databases enable single-click replication of DocumentDB databases across multiple Azure regions globally. The service takes care of replicating your data enabling you to stop worrying about geo-redundancy and free you to innovate on your application or service. You can now build globally distributed applications easily that can read data from the nearest Azure region with single-digit latencies, and are regional failure resistant and massively scalable.


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

DocumentDB client SDKs provide an optional parameter "PreferredLocations" that is an ordered list of Azure regions. The SDK will automatically send all reads to the first available region in this list. If the first region returns is returns an error or is not reachable, the client will retry 2 more times with that region, and then fail down the list to the next region, and so on. The SDK will check for region availability every 30s (?) and switch back to a more preferred region if it becomes available again. 

The client SDKs will only attempt to read to the regions specified in PreferedLocations. So, for example, if the Database Account is replicated to 3 regions, but the clients only specify 2 of the non-write regions for PreferedLocations, then no reads will be served out of the write region, even in the case of failover. This behavior can be used to 
1. fully reserve the RU budget of the write region for writes
2. deploy additional regions for data analytics without affecting production throughput, by sp3ecifying different PreferedLocations in production and analytics clients respectively.

If the PreferedLocations property is not set, all reads will be served from the current write region. 


## Tuning Consistency

It is strongly suggested that you familiarize yourself with the available consistency levels in DocumentDB here: Using consistency levels to maximize availability and performance in DocumentDB

In the context of geo-replication, each of the available consistency levels come with tradeoffs that empower you to choose the right balance of consistency and availability for your application.


### Types
1.  Strong Consistency
    -   Strong consistency comes with a high cost in terms of latency and availability when implemented at a global scale. DocumentDB currently does not support Strong Consistency for global databases.

2.  Bounded Staleness Consistency
    -   Reads follow write(s) at write region.
        -   Once a value is written, subsequent reads are guaranteed to see the written version or higher in the write region.
        -   i.e. strong consistency within Write Region.
    -   Total global ordering
       -    Once a value is read (in any region, including the write region), every subsequent read at every other region is guaranteed to see the read version or higher.
        -   i.e. For all clients, time always moves forward. 
    -   Bounded stale reads at read region(s).
        -   Once a value is written, subsequent readers are guaranteed to see version or higher between (written version and written version – User specified staleness bound).
        -   Staleness bound can be expressed in two dimensions.
            -   maxPrefix – Staleness expressed in terms of absolute write versions.
            -   maxInterval – Staleness expressed in terms of time interval;
            -   E.g. maxPrefix = 1000, maxInterval = 30 seconds 
                -   No reads will be staler than 30 seconds of last committed data.
                -   No reads will be staler than 1000 version of last committed data.
    -   Note if a client attempts to read a document from a different region than the write region, it may see any value equal or older than its write, but guaranteed to be newer than the staleness bound.

3.  Session Consistency
This is the default consistency level.

    -   Read your own write(s).
        -   Once a value is written in a session, subsequent read within the session will see the written version or higher
        -   This even applies to cases when the read is occurring in a region other than the write region. 
        -   Note that in the case that the read request gets to the read region before the write has been replicated there, there will an increase in latency as the read region will have to forward the request to the write region
    -   Monotonic read within session.
        -   Once a value is read in a session, subsequent reads within the session will see the read version or higher.
    -   Unbounded staleness for reads across sessions.
        -   There is no user controlled bound on read staleness with respect to write(s) performed outside session.
        -   i.e. cross session reads over eventual consistency.
    -   No total ordering across session.
        -   There are no ordering guarantees between read version seen across sessions. 
        -   i.e. client A may see an older version of a document even though client B has seen the latest version

4.	Eventual Consistency
    -   Once write subsides, eventually every read version will converge.
    -   No Monotonic reads 
        -   Clients may read older versions of the same document within the same client session.
    -   No ordering
        -   Clients may read different versions of the same document


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
    Uri accountEndPoint = new Uri(Properties.Settings.Default.GlobalDbUri);
    string accountKey = Properties.Settings.Default.GlobalDbKey;

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


## Failover & Recovery

In the event that DocumentDB suffers downtime in a region, the following will occur:
1. Any Database Accounts with write region set to the unavailable region will fail over writes to the next region configured for the account. If no other region is left to fail over to, write requests will fail.
2. Any clients performing reads from that region will fail over to the next region in their PreferredRegion list, if specified. If no other region is left to fail over to, read requests will fail.

When such availability loss occurs, there is a small window where writes (acknowledged to client) may have been persisted to the affected region, but may not have been replicated to other regions. In order to enable the recovery of this data, we will restore affected regions in a read-only state and notify all affected customers. At this point, the client SDKs can be configured to read from this region (single region in PreferedLocations list) and recover any un-replicated data by comparing it to other live regions.

Once data has been recovered, the affected region can be restored to active state from the Azure Portal. DocumentDB will rebuild the data in that region for that Database Account, and make it available in full operation state again.


## Pricing

Please refer to the [DocumentDB Pricing] [pricing] for pricing information.


## SLA

Please refer to the [DocumentDB SLA] [sla] page for more info

<!--Image references-->
[1]: ./media/documentdb-global-database/documentdb_add_region.png
[2]: ./media/documentdb-global-database/documentdb_change_write_region.png

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[bcdr]: https://azure.microsoft.com/documentation/articles/best-practices-availability-paired-regions/
[regions]: https://azure.microsoft.com/regions/ 
[pricing]: https://azure.microsoft.com/pricing/details/documentdb/
[sla]: https://azure.microsoft.com/support/legal/sla/documentdb/ 



<properties
   pageTitle="DocumentDB global databases | Microsoft Azure"
   description="Learn about planet-scale geo-replication, failover, and data recovery using global databases from Azure DocumentDB, a fully managed NoSQL database service."
   services="documentdb"
   documentationCenter=""
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
   
   
# Global databases

--CAP theorem text --

## Configuring global databases

For each of your existing or new DocumentDB database accounts, you can now add regions where you want your data to be replicated. You can add any number of regions that DocumentDB is available in.

Each of these regions can serve read requests with the same [request units](documentdb-request-units.md)(RUs) available to each collection. For example, if you have a collection with 10,000 RU/s provisioned to it, the same collection will be able to serve up to 10,000 RU/s in each of the regions. Each client can specify its own order of read region selection, with reads being served from the region at the top of the list. If one or more regions fail or are unreachable for the client, the client will automatically fail over down this list of preferred regions until a region is found that is serving requests. 

Writes go to one region at any given time. The service allows you to set your preferred order of write region selection in the Azure portal. Once this is set, the service will select the top most region in this list as the write region. If one or more regions fail, the service will automatically select the first available region down the list as the write region. 

Finally, you can set a [consistency level](#tuning-consistency) for global availability.

Once the global database is set up, there is no further day-to-day management necessary. The service will handle global availability of your data, and in the case of a regional failure, automatically handle failing over and recovering with minimal loss in availability.


## Selecting regions

When deploying to two or more regions, it is recommended that regions are selected based on the region pairs described in [Business continuity and disaster recovery (BCDR): Azure Paired Regions] [bcdr].

Specifically, when deploying multiple regions, make sure to select the same number of regions (+/-1 for odd/even) from each of the paired region columns. 


## Throughput and performance

When you add one or more regions to a database account, each region is provisioned with the same throughput on a per-collection basis. This means that each collection has an independent, identical RU budget in each region. 

When a read or write operation is performed on a collection in a region, it will consume RUs from that collection's budget in that specific region only. Unlike other distributed database systems, the RU charge for write operations does not increase as the number of regions is increased. Also, there is no additional RU charge for receiving and persisting the replicated writes at the receiving regions. 

For example, assume that the client was performing 10 RU reads and 50 RU writes against a single region Database Account. Now, when additional regions are added to this database account, the RU charge for those same operations does not change. Each write will continue to be charged 50 RUs from the collection RU budget in the write region only (no impact on other regions). Similarly, each read will be charged 10 RUs from the budget of the collection in the region serving the operation, with no impact to other regions.


## Adding regions

Geo-replication can be enabled for new and existing accounts from the database account pane in the Azure portal.

![Alt text; Add regions under DocumentDB Account > Settings > Add/Remove Regions][1]


## Tuning consistency

It is strongly suggested that you familiarize yourself with the available consistency levels in DocumentDB here: [Using consistency levels to maximize availability and performance in DocumentDB] [consistency]

In the context of geo-replication, each of the available consistency levels come with tradeoffs that empower you to choose the right balance of consistency and availability for your application.

> [AZURE.NOTE] Strong consistency comes with a high cost in terms of latency and availability when implemented at a global scale. DocumentDB supports Strong consistency within a single region (when configured to Bounded Staleness globally)

![Alt text; Add regions under DocumentDB Account > Settings > Add/Remove Regions][1]


## Write region selection

Every geo-replicated Database Account has 1 active write region. All writes to resources in that Database Account go to that region.

When configuring geo-replication, you can click and drag to order the list of regions to set your write region selection preference. DocumentDB will select the active write region based on this order (top down). If the first region is not available for any reason, the second region in the list will automatically become the active write region, and so on down the list. 

The impact of failover on active clients is discussed in the [Failover and recovery](#failover-and-recovery) section below.

![Alt text; Change the write region by reordering the region list under DocumentDB Account > Settings > Change Write Regions][1]


## Read region selection

DocumentDB client SDKs provide an optional parameter "PreferredLocations" that is an ordered list of Azure regions. The SDK will automatically send all reads to the first available region in this list. If the first region returns an error or is not reachable, the client will retry 2 more times with that region, and then fail down the list to the next region, and so on. The SDK will check for region availability every 30s (?) and switch back to a more preferred region if it becomes available again. 

The client SDKs will only attempt to read to the regions specified in PreferredLocations. So, for example, if the Database Account is replicated to 3 regions, but the clients only specify 2 of the non-write regions for PreferredLocations, then no reads will be served out of the write region, even in the case of failover. This behavior can be used to:

1. Fully reserve the RU budget of the write region for writes
2. Deploy additional regions for data analytics without affecting production throughput, by specifying different PreferredLocations in production and analytics clients respectively.

If the PreferredLocations property is not set, all reads will be served from the current write region. 


## SDKs

Support for global databases is NOT a breaking change for any of the DocumentDB client SDKs or the REST API.


### .NET SDK
The SDK can be used without any code changes. In this case, the SDK will automatically direct both reads and writes to the current write region. 

The ConnectionPolicy parameter for the DocumentClient constructor has a new property, Microsoft.Azure.Documents.ConnectionPolicy.PreferredRegions. This property is of type Collection `<string>` and should contain a list of region names. The names are formatted per the Region Name column on the [Azure Regions] [regions] page. You can also use the predefined constants in the convenience class Microsoft.Azure.Documents.Regions.

The current write and read endpoints are available in DocumentClient.WriteEndpoint and DocumentClient.ReadEndpoint respectively.

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

Below is a code example for NodeJS/Javascript. Python will follow the same pattern.

    // Creating a ConnectionPolicy object
    var connectionPolicy = new DocumentBase.ConnectionPolicy();
    
    // Setting read region selection preference, in the following order -
    // 1 - West US
    // 2 - East US
    // 3 - North Europe
    connectionPolicy.PreferredLocations = ['West US', 'East US', 'North Europe'];
    
    // initialize the connection
    var client = new DocumentDBClient(host, { masterKey: masterKey }, connectionPolicy);


### REST 
Once geo-replication is enabled on a Database Account, clients can query its availability by performing a GET request on the following URI.

    https://management.azure.com/subscriptions/{subid}/resourcegroups/{resourcegroupname}/providers/Microsoft.DocumentDB/databaseAccounts/{accountname}

The service will return a list of regions and their corresponding DocumentDB endpoint URIs for the replicas. The current write region will be indicated in the response. The client can then select the appropriate endpoint for all further REST API requests as follows.

-	All PUT, POST and DELETE requests must go to the indicated write URI
-	All GETs and other read-only requests may go to any endpoint of the client’s choice

Write requests to read-only regions will fail with HTTP error code 405 (“Method not allowed”).

If the write region changes after the client’s initial discovery phase, subsequent writes to the previous write region will fail with HTTP error code 405 (“Method not allowed”). The client should then GET the list of regions again to get the updated write region.


## Failover and recovery

Global databases will ensure data availability in the face of all classes of failures, from short-term connectivity losses and failed single nodes, to natural disasters resulting in the loss of entire datacenters.

In the event that DocumentDB suffers downtime in a region, the following will occur:

1. Any Database Accounts with write region set to the unavailable region will fail over writes to the next region configured for the account. If no other region is left to fail over to, write requests will fail.
2. Any clients performing reads from that region will fail over to the next region in their PreferredRegion list, if specified. If no other region is left to fail over to, read requests will fail.

When such availability loss occurs, there is a small window where writes (acknowledged to client) may have been persisted to the affected region, but may not have been replicated to other regions. In order to enable the recovery of this data, we will restore affected regions in a read-only state and notify all affected customers. At this point, the client SDKs can be configured to read from this region (single region in PreferredLocations list) and recover any un-replicated data by comparing it to other live regions.

Once data has been recovered, the affected region can be restored to active state from the Azure portal. DocumentDB will rebuild the data in that region for that Database Account, and make it available in full operation state again.


## SLA

Please refer to the [DocumentDB SLA] [sla] page for more info

## Pricing

Please refer to the [DocumentDB Pricing] [pricing] for pricing information.



<!--Image references-->
[1]: ./media/documentdb-global-database/documentdb_add_region.png
[2]: ./media/documentdb-global-database/documentdb_change_write_region.png
[3]: ./media/documentdb-global-database/documentdb_change_consistency.jpg

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[pcolls]: https://azure.microsoft.com/documentation/articles/documentdb-partition-data/
[consistency]: https://azure.microsoft.com/documentation/articles/documentdb-consistency-levels/
[bcdr]: https://azure.microsoft.com/documentation/articles/best-practices-availability-paired-regions/
[regions]: https://azure.microsoft.com/regions/ 
[pricing]: https://azure.microsoft.com/pricing/details/documentdb/
[sla]: https://azure.microsoft.com/support/legal/sla/documentdb/ 



<properties
   pageTitle="Developing with multiple regions | Microsoft Azure"
   description="Learn how to access your data in multiple regions from Azure DocumentDB, a fully managed NoSQL database service."
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
   
# Developing with multiple regions

Global databases are accessible through all existing SDKs without application changes.

DocumentDB client SDKs provide an optional parameter "PreferredLocations" that is an ordered list of Azure regions. The SDK will automatically send all reads to the first available region in this list. If the first region returns an error or is not reachable, the client will retry 2 more times with that region, and then fail down the list to the next region, and so on. The SDK will check for region availability every 30s (?) and switch back to a more preferred region if it becomes available again. 

The client SDKs will only attempt to read to the regions specified in PreferredLocations. So, for example, if the Database Account is replicated to 3 regions, but the clients only specify 2 of the non-write regions for PreferredLocations, then no reads will be served out of the write region, even in the case of failover.

If the PreferredLocations property is not set, all reads will be served from the current write region. 


## .NET SDK
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


## NodeJS, JavaScript and Python SDKs
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


## REST 
Once geo-replication is enabled on a Database Account, clients can query its availability by performing a GET request on the following URI.

    https://management.azure.com/subscriptions/{subid}/resourcegroups/{resourcegroupname}/providers/Microsoft.DocumentDB/databaseAccounts/{accountname}

The service will return a list of regions and their corresponding DocumentDB endpoint URIs for the replicas. The current write region will be indicated in the response. The client can then select the appropriate endpoint for all further REST API requests as follows.

-	All PUT, POST and DELETE requests must go to the indicated write URI
-	All GETs and other read-only requests may go to any endpoint of the client’s choice

Write requests to read-only regions will fail with HTTP error code 405 (“Method not allowed”).

If the write region changes after the client’s initial discovery phase, subsequent writes to the previous write region will fail with HTTP error code 405 (“Method not allowed”). The client should then GET the list of regions again to get the updated write region.

[regions]: https://azure.microsoft.com/regions/ 

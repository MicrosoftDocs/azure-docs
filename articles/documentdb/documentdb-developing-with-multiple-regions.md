<properties
   pageTitle="Developing with multiple regions in DocumentDB | Microsoft Azure"
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
   ms.date="06/14/2016"
   ms.author="kipandya"/>
   
# Developing with multi-region DocumentDB accounts

In order to take advantage of [global distribution](documentdb-distribute-data-globally.md), client applications can specify the ordered preference list of regions to be used to perform document operations. This can be done by setting the connection policy. Based on the Azure DocumentDB account configuration, current regional availability and the preference list specified, the most optimal endpoint will be chosen by the SDK to perform write and read operations. 

This preference list is specified when initializing a connection using the DocumentDB  client SDKs. The SDKs accept an optional parameter "PreferredLocations" that is an ordered list of Azure regions.

The SDK will automatically send all writes to the current write region. 

All reads will be sent to the first available region in the PreferredLocations list. If the request fails, the client will fail down the list to the next region, and so on. 

The client SDKs will only attempt to read from the regions specified in PreferredLocations. So, for example, if the Database Account is available in three regions, but the client only specifies two of the non-write regions for PreferredLocations, then no reads will be served out of the write region, even in the case of failover.

The application can verify the current write endpoint and read endpoint chosen by the SDK by checking two properties, WriteEndpoint and ReadEndpoint, available in SDK version 1.8 and above. 

If the PreferredLocations property is not set, all requests will be served from the current write region. 


## .NET SDK
The SDK can be used without any code changes. In this case, the SDK will automatically direct both reads and writes to the current write region. 

In version 1.8 and later of the .NET SDK, the ConnectionPolicy parameter for the DocumentClient constructor has a property called Microsoft.Azure.Documents.ConnectionPolicy.PreferredLocations. This property is of type Collection `<string>` and should contain a list of region names. The string values are formatted per the Region Name column on the [Azure Regions] [regions] page, with no spaces before or after the first and last character respectively.

The current write and read endpoints are available in DocumentClient.WriteEndpoint and DocumentClient.ReadEndpoint respectively.

> [AZURE.NOTE] The URLs for the endpoints should not be considered as long-lived constants. The service may update these at any point. The SDK will handle this change automatically.

    // Getting endpoints from application settings or other configuration location
    Uri accountEndPoint = new Uri(Properties.Settings.Default.GlobalDatabaseUri);
    string accountKey = Properties.Settings.Default.GlobalDatabaseKey;

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

In version 1.8 and later of each SDK, the ConnectionPolicy parameter for the DocumentClient constructor a new property called DocumentClient.ConnectionPolicy.PreferredLocations. This is parameter is an array of strings that takes a list of region names. The names are formatted per the Region Name column in the [Azure Regions] [regions] page. You can also use the predefined constants in the convenience object AzureDocuments.Regions

The current write and read endpoints are available in DocumentClient.getWriteEndpoint and DocumentClient.getReadEndpoint respectively.

> [AZURE.NOTE] The URLs for the endpoints should not be considered as long-lived constants. The service may update these at any point. The SDK will handle this change automatically.

Below is a code example for NodeJS/Javascript. Python and Java will follow the same pattern.

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
Once a database account has been made available in muliple regions, clients can query its availability by performing a GET request on the following URI.

    https://{databaseaccount}.documents.azure.com/dbs

The service will return a list of regions and their corresponding DocumentDB endpoint URIs for the replicas. The current write region will be indicated in the response. The client can then select the appropriate endpoint for all further REST API requests as follows.

Example response

    {
        "_dbs": "//dbs/",
        "media": "//media/",
        "writableLocations": [
            {
                "Name": "West US",
                "DatabaseAccountEndpoint": "https://globaldbexample-westus.documents.azure.com:443/"
            }
        ],
        "readableLocations": [
            {
                "Name": "East US",
                "DatabaseAccountEndpoint": "https://globaldbexample-eastus.documents.azure.com:443/"
            }
        ],
        "MaxMediaStorageUsageInMB": 2048,
        "MediaStorageUsageInMB": 0,
        "ConsistencyPolicy": {
            "defaultConsistencyLevel": "Session",
            "maxStalenessPrefix": 100,
            "maxIntervalInSeconds": 5
        },
        "addresses": "//addresses/",
        "id": "globaldbexample",
        "_rid": "globaldbexample.documents.azure.com",
        "_self": "",
        "_ts": 0,
        "_etag": null
    }


-	All PUT, POST and DELETE requests must go to the indicated write URI
-	All GETs and other read-only requests (eg: Queries) may go to any endpoint of the client’s choice

Write requests to read-only regions will fail with HTTP error code 403 (“Forbidden”).

If the write region changes after the client’s initial discovery phase, subsequent writes to the previous write region will fail with HTTP error code 403 (“Forbidden”). The client should then GET the list of regions again to get the updated write region.

## Next steps

Learn more about the distributing data globally with DocumentDB in the following articles:

- [Distribute data globally with DocumentDB](documentdb-distribute-data-globally.md)
- [Consistency levels](documentdb-consistency-levels.md)
- [How throughput works with multiple regions](documentdb-manage.md#how-throughput-works-with-multiple-regions)
- [Add regions using the Azure portal](documentdb-manage-account.md#addregion)

[regions]: https://azure.microsoft.com/regions/ 

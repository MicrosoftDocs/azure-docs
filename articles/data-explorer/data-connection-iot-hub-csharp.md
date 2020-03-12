---
title: 'Create an IoT Hub data connection for Azure Data Explorer by using C#'
description: In this article, you learn how to create an IoT Hub data connection for Azure Data Explorer by using C#.
author: lucygoldbergmicrosoft
ms.author: lugoldbe
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 10/07/2019
---

# Create an IoT Hub data connection for Azure Data Explorer by using C# (Preview)

> [!div class="op_single_selector"]
> * [Portal](ingest-data-iot-hub.md)
> * [C#](data-connection-iot-hub-csharp.md)
> * [Python](data-connection-iot-hub-python.md)
> * [Azure Resource Manager template](data-connection-iot-hub-resource-manager.md)

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data Explorer offers ingestion (data loading) from Event Hubs, IoT Hubs, and blobs written to blob containers. In this article, you create an IoT Hub data connection for Azure Data Explorer by using C#.

## Prerequisites

* If you don't have Visual Studio 2019 installed, you can download and use the **free** [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.
* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Create [a cluster and database](create-cluster-database-csharp.md)
* Create [table and column mapping](net-standard-ingest-data.md#create-a-table-on-your-test-cluster)
* Set [database and table policies](database-table-policies-csharp.md) (optional)
* Create an [IoT Hub with a shared access policy configured](ingest-data-iot-hub.md#create-an-iot-hub).

[!INCLUDE [data-explorer-data-connection-install-nuget-csharp](../../includes/data-explorer-data-connection-install-nuget-csharp.md)]

[!INCLUDE [data-explorer-authentication](../../includes/data-explorer-authentication.md)]

## Add an IoT Hub data connection 

The following example shows you how to add an IoT Hub data connection programmatically. See [connect Azure Data Explorer table to IoT Hub](ingest-data-iot-hub.md#connect-azure-data-explorer-table-to-iot-hub) for adding an Iot Hub data connection using the Azure portal.

```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
var clientSecret = "xxxxxxxxxxxxxx";//Client Secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
var authenticationContext = new AuthenticationContext($"https://login.windows.net/{tenantId}");
var credential = new ClientCredential(clientId, clientSecret);
var result = await authenticationContext.AcquireTokenAsync(resource: "https://management.core.windows.net/", clientCredential: credential);

var credentials = new TokenCredentials(result.AccessToken, result.AccessTokenType);

var kustoManagementClient = new KustoManagementClient(credentials)
{
    SubscriptionId = subscriptionId
};

var resourceGroupName = "testrg";
//The cluster and database that are created as part of the Prerequisites
var clusterName = "mykustocluster";
var databaseName = "mykustodatabase";
var dataConnectionName = "myeventhubconnect";
//The IoT hub that is created as part of the Prerequisites
var iotHubResourceId = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.Devices/IotHubs/xxxxxx";
var sharedAccessPolicyName = "iothubforread";
var consumerGroup = "$Default";
var location = "Central US";
//The table and column mapping are created as part of the Prerequisites
var tableName = "StormEvents";
var mappingRuleName = "StormEvents_CSV_Mapping";
var dataFormat = DataFormat.CSV;

await kustoManagementClient.DataConnections.CreateOrUpdate(resourceGroupName, clusterName, databaseName, dataConnectionName,
            new IotHubDataConnection(iotHubResourceId, consumerGroup, sharedAccessPolicyName, tableName: tableName, location: location, mappingRuleName: mappingRuleName, dataFormat: dataFormat));
```

|**Setting** | **Suggested value** | **Field description**|
|---|---|---|
| tenantId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | Your tenant ID. Also known as directory ID.|
| subscriptionId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The subscription ID that you use for resource creation.|
| clientId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The client ID of the application that can access resources in your tenant.|
| clientSecret | *xxxxxxxxxxxxxx* | The client secret of the application that can access resources in your tenant. |
| resourceGroupName | *testrg* | The name of the resource group containing your cluster.|
| clusterName | *mykustocluster* | The name of your cluster.|
| databaseName | *mykustodatabase* | The name of the target database in your cluster.|
| dataConnectionName | *myeventhubconnect* | The desired name of your data connection.|
| tableName | *StormEvents* | The name of the target table in the target database.|
| mappingRuleName | *StormEvents_CSV_Mapping* | The name of your column mapping related to the target table.|
| dataFormat | *csv* | The data format of the message.|
| iotHubResourceId | *Resource ID* | The resource ID of your IoT hub that holds the data for ingestion. |
| sharedAccessPolicyName | *iothubforread* | The name of the shared access policy that defines the permissions for devices and services to connect to IoT Hub. |
| consumerGroup | *$Default* | The consumer group of your event hub.|
| location | *Central US* | The location of the data connection resource.|

[!INCLUDE [data-explorer-data-connection-clean-resources-csharp](../../includes/data-explorer-data-connection-clean-resources-csharp.md)]

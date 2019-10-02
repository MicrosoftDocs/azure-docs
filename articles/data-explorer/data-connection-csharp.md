---
title: 'Add data connections for Azure Data Explorer by using C#'
description: In this article, you learn how to add data connections for Azure Data Explorer by using C#.
author: lucygoldbergmicrosoft
ms.author: lugoldbe
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 09/24/2019
---

# Create an Azure Data Explorer data connection by using C#

> [!div class="op_single_selector"]
> * [C#](data-connection-csharp.md)
> * [Python](data-connection-python.md)
>

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data Explorer offers ingestion (data loading) from Event Hubs, and blobs written to blob containers. In this article, you create data connections for Azure Data Explorer by using C#.

## Prerequisites

1. If you don't have Visual Studio 2019 installed, you can download and use the **free** [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

1. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

1. [A test cluster and database](create-cluster-database-csharp.md)

1. [A test table and column mapping](net-standard-ingest-data.md)

1. [Set database-level/table-level policies](database-table-policies-csharp.md) (Optional)

1. [An event hub with data for ingestion](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-create) for adding a EventHub data connection. Or [An event hub](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-create), [a storage account with data for ingestion](https://docs.microsoft.com/en-us/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal), and [an Event Grid subscription in your storage account](ingest-data-event-grid.md) for adding a EventGrid data connection. Or [An IoT hub and a shared access policy](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-create-through-portal) for adding an IoT hub data connection

## Install C# Nuget

1. Install the [Azure Data Explorer (Kusto) nuget package](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).

1. Install the [Microsoft.IdentityModel.Clients.ActiveDirectory nuget package](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/) for authentication.


## Authentication
For running the examples in this article, we need an Azure AD Application and service principal that can access resources. Check [create an Azure AD application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal) to create a free Azure AD Application and add role assignment at the subscription scope. It also shows how to get the `Directory (tenant) ID`, `Application ID`, and `Client Secret`.

## Add data connections

1. Add a EventHub data connection by using the following code:

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
    //The event hub that is created as part of the Prerequisites
    var eventHubResourceId = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.EventHub/namespaces/xxxxxx/eventhubs/xxxxxx";
    var consumerGroup = "$Default";
    var location = "Central US";
    //The table and column mapping are created as part of the Prerequisites
    var tableName = "StormEvents";
    var mappingRuleName = "StormEvents_CSV_Mapping";
    var dataFormat = DataFormat.CSV;
    await kustoManagementClient.DataConnections.CreateOrUpdateAsync(resourceGroupName, clusterName, databaseName, dataConnectionName, 
        new EventHubDataConnection(eventHubResourceId, consumerGroup, location: location, tableName: tableName, mappingRuleName: mappingRuleName, dataFormat: dataFormat));
    ```
    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | tenantId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The id of your tenant, aka Directory ID.|
    | subscriptionId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The id of the subscription you create resources with.|
    | clientId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The client id of the application that can access resources in your tenant.|
    | clientSecret | *xxxxxxxxxxxxxx* | The client secret of the application that can access resources in your tenant. |
    | resourceGroupName | *testrg* | The name of the resource group containing your cluster.|
    | clusterName | *mykustocluster* | The name of your cluster.|
    | databaseName | *mykustodatabase* | The name of the target database in your cluster.|
    | dataConnectionName | *myeventhubconnect* | The wanted name of your data connection.|
    | tableName | *StormEvents* | The name of the target tableName in the target database.|
    | mappingRuleName | *StormEvents_CSV_Mapping* | The name of your column mapping related to the target table.|
    | dataFormat | *csv* | The data format of the message.|
    | eventHubResourceId | *resource id* | The resource id of your event hub, which holds the data for ingestion. |
    | consumerGroup | *$Default* | The consumer group of your event hub.|
    | location | *Central US* | The location of the data connection resource.|

1. Add EventGrid data connection by using the following code:

    ```csharp
    //The event hub and storage account that are created as part of the Prerequisites
    var eventHubResourceId = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.EventHub/namespaces/xxxxxx/eventhubs/xxxxxx";
    var storageAccountResourceId = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.Storage/storageAccounts/xxxxxx";

    await kustoManagementClient.DataConnections.CreateOrUpdateAsync(resourceGroupName, clusterName, databaseName, dataConnectionName,
        new EventGridDataConnection(storageAccountResourceId, eventHubResourceId, consumerGroup, tableName: tableName, location: location, mappingRuleName: mappingRuleName, dataFormat: dataFormat));
    ```
    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | eventHubResourceId | *resource id* | The resource id of your event hub, where the event grid is configured to send events. |
    | storageAccountResourceId | *resource id* | The resource id of your storage account, which holds the data for ingestion. |

1. Add IoT hub data connection by using the following code:

    ```csharp
    //The IoT hub that is created as part of the Prerequisites
    var iotHubResourceId = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.Devices/IotHubs/xxxxxx";
    var sharedAccessPolicyName = "iothubforread";

    await kustoManagementClient.DataConnections.CreateOrUpdate(resourceGroupName, clusterName, databaseName, dataConnectionName,
                new IotHubDataConnection(iotHubResourceId, consumerGroup, sharedAccessPolicyName, tableName: tableName, location: location, mappingRuleName: mappingRuleName, dataFormat: dataFormat));
    ```
    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | iotHubResourceId | *resource id* | The resource id of your IoT hub, which holds the data for ingestion. |
    | sharedAccessPolicyName | *iothubforread* | The name of the shared access policy, which defines the permissions for devices and services to connect to IoT Hub. |

## Clean up resources
* To delete the data connection, Use the following command:

    ```csharp
    kustoManagementClient.DataConnections.Delete(resourceGroupName, clusterName, databaseName, dataConnectionName);
    ```

---
title: 'Create an Event Hub data connection for Azure Data Explorer by using C#'
description: In this article, you learn how to create an Event Hub data connection for Azure Data Explorer by using C#.
author: lucygoldbergmicrosoft
ms.author: lugoldbe
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 10/07/2019
---

# Create an Event Hub data connection for Azure Data Explorer by using C#

> [!div class="op_single_selector"]
> * [Portal](ingest-data-event-hub.md)
> * [C#](data-connection-event-hub-csharp.md)
> * [Python](data-connection-event-hub-python.md)

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data Explorer offers ingestion (data loading) from Event Hubs, IoT Hubs, and blobs written to blob containers. In this article, you create an Event Hub data connection for Azure Data Explorer by using C#.

## Prerequisites

1. If you don't have Visual Studio 2019 installed, you can download and use the **free** [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

1. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

1. [A test cluster and database](create-cluster-database-csharp.md)

1. [A test table and column mapping](net-standard-ingest-data.md#create-a-table-on-your-test-cluster)

1. [Set database-level/table-level policies](database-table-policies-csharp.md) (Optional)

1. [An event hub with data for ingestion](ingest-data-event-hub.md#create-an-event-hub) for adding a EventHub data connection. 

## Install C# Nuget

1. Install the [Azure Data Explorer (Kusto) nuget package](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).

1. Install the [Microsoft.IdentityModel.Clients.ActiveDirectory nuget package](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/) for authentication.


## Authentication
For running the examples in this article, we need an Azure AD Application and service principal that can access resources. Check [create an Azure AD application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal) to create a free Azure AD Application and add role assignment at the subscription scope. It also shows how to get the `Directory (tenant) ID`, `Application ID`, and `Client Secret`.

## Add an Event Hub data connection
The following example shows how to add an Event Hub data connection programmatically. Check [Connect to the event hub](ingest-data-event-hub.md#connect-to-the-event-hub) for adding an Event Hub data connection through Azure portal.

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
| tenantId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The ID of your tenant, also known as Directory ID.|
| subscriptionId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The ID of the subscription you create resources with.|
| clientId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The Client ID of the application that can access resources in your tenant.|
| clientSecret | *xxxxxxxxxxxxxx* | The Client Secret of the application that can access resources in your tenant. |
| resourceGroupName | *testrg* | The name of the resource group containing your cluster.|
| clusterName | *mykustocluster* | The name of your cluster.|
| databaseName | *mykustodatabase* | The name of the target database in your cluster.|
| dataConnectionName | *myeventhubconnect* | The wanted name of your data connection.|
| tableName | *StormEvents* | The name of the target tableName in the target database.|
| mappingRuleName | *StormEvents_CSV_Mapping* | The name of your column mapping related to the target table.|
| dataFormat | *csv* | The data format of the message.|
| eventHubResourceId | *Resource ID* | The resource ID of your event hub, which holds the data for ingestion. |
| consumerGroup | *$Default* | The consumer group of your event hub.|
| location | *Central US* | The location of the data connection resource.|

## Clean up resources
To delete the data connection, Use the following command:

```csharp
kustoManagementClient.DataConnections.Delete(resourceGroupName, clusterName, databaseName, dataConnectionName);
```

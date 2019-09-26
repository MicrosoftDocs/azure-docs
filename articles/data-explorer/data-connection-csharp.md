---
title: 'Add data connections for Azure Data Explorer by using C#'
description: In this article, you learn how to add data connections for Azure Data Explorer by using C#.
author: lugoldbe
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

* If you don't have Visual Studio 2019 installed, you can download and use the **free** [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

* [A test cluster and database](create-cluster-database-csharp.md)

* [A test table and column mapping](net-standard-ingest-data.md)

## Install C# Nuget

```
1. Install the [Azure Data Explorer (Kusto) nuget package](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).

1. Install the [Microsoft.IdentityModel.Clients.ActiveDirectory nuget package](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/) for authentication.
```

## Authentication
For running the examples in this article, we need an Azure AD Application and service principal that can access resources. Check [create an Azure AD application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal) to create a free Azure AD Application and add role assignment at the subscription scope. It also shows how to get the `tenantId`, `clientId`, and `clientSecret`.

## Add database connections

1. Add a EventHub data connection by using the following code:

    ```csharp
    var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
    var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
    var clientSecret = "xxxxxxxxxxxxxx";
    var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
    var authenticationContext = new AuthenticationContext($"https://login.windows.net/{tenantId}");
    var credential = new ClientCredential(clientId, clientSecret);
    var result = await authenticationContext.AcquireTokenAsync(resource: "https://management.core.windows.net/", clientCredential: credential);

    var credentials = new TokenCredentials(result.AccessToken, result.AccessTokenType);

    var kustoManagementClient = new KustoManagementClient(credentials)
    {
        SubscriptionId = subscriptionId
    };

    var resourceGroupName = "testrg";
    var clusterName = "mykustocluster";
    var databaseName = "mykustodb";
    var dataConnectionName = "myeventhubconnect";
    var eventHubResourceId = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.EventHub/namespaces/xxxxxx/eventhubs/xxxxxx";
    var consumerGroup = "$Default";
    var tableName = "mykustotable";
    var location = "Central US";
    var mappingRuleName = "mycolumnmapping";
    var dataFormat = "csv";
    kustoManagementClient.DataConnections.CreateOrUpdate(resourceGroupName, clusterName, databaseName, dataConnectionName, 
        new EventHubDataConnection(eventHubResourceId, consumerGroup, tableName: tableName, location: location, mappingRuleName: mappingRuleName, dataFormat: dataFormat));
    ```
    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | tenantId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The id of your tenant.|
    | subscriptionId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The id of the subscription you create resources with.|
    | clientId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The client id of the application that can access resources in your subscription.|
    | clientSecret | *xxxxxxxxxxxxxx* | The client secret of the application that can access resources in your subscription. |
    | resourceGroupName | *testrg* | The name of the resource group containing your cluster.|
    | clusterName | *mykustocluster* | The name of your cluster.|
    | databaseName | *mykustodb* | The name of the target database in your cluster.|
    | dataConnectionName | *myeventhubconnect* | The wanted name of your data connection.|
    | tableName | *mykustodb* | The name of the target tableName in the target database.|
    | location | *Central US* | The location of the data connection resource.|
    | mappingRuleName | *mycolumnmapping* | The name of your column mapping related to the target table.|
    | dataFormat | *csv* | The data format of the message.|
    | eventHubResourceId | *resource id* | The resource id of your event hub.|
    | consumerGroup | *$Default* | The consumer group of your event hub.|
  


    If you want to create a EventHub data connection by Azure portal, check [Ingest data from Event Hub](ingest-data-event-hub.md)


1. Add EventGrid data connection by using the following code:

    ```csharp
    var storageAccountResourceId =
        "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.Storage/storageAccounts/xxxxxx";
    kustoManagementClient.DataConnections.CreateOrUpdate(resourceGroupName, clusterName, databaseName, dataConnectionName,
        new EventGridDataConnection(storageAccountResourceId, eventHubResourceId, consumerGroup, tableName: tableName, location: location, mappingRuleName: mappingRuleName, dataFormat: dataFormat));
    ```
    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | storageAccountResourceId | *resource id* | The resource id of your storage account.|

    If you want to create a EventGrid data connection by Azure portal, check [Ingest blobs into Azure Data Explorer](ingest-data-event-grid.md)

## Clean up resources
* To delete the data connection, Use the following command:

    ```csharp
    kustoManagementClient.DataConnections.Delete(resourceGroupName, clusterName, databaseName, dataConnectionName);
    ```

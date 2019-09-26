---
title: 'Add data connections for Azure Data Explorer by using Python'
description: In this article, you learn how to add data connections for Azure Data Explorer by using Python.
author: lugoldbe
ms.author: lugoldbe
ms.reviewer: itsagui
ms.service: data-explorer
ms.topic: conceptual
ms.date: 24/09/2019
---

# Create an Azure Data Explorer data connection by using Python

> [!div class="op_single_selector"]
> * [C#](data-connection-csharp.md)
> * [Python](data-connection-python.md)
>

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data Explorer offers ingestion (data loading) from Event Hubs, and blobs written to blob containers. In this article, you create data connections for Azure Data Explorer by using Python.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

* [A test cluster and database](create-cluster-database-csharp.md)

* [A test table and column mapping](net-standard-ingest-data.md)

## Install Python package

To install the Python package for Azure Data Explorer (Kusto), open a command prompt that has Python in its path. Run this command:

```
pip install azure-mgmt-kusto
pip install adal
pip install msrestazure
```
# Authentication
For running the examples in this article, we need an Azure AD Application and service principal that can access resources. Check [create an Azure AD application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal) to create a free Azure AD Application and add role assignment at the subscription scope. It also shows how to get the `tenantId`, `clientId`.

## Add database connections

1. Add a EventHub data connection by using the following code:

    ```Python
    from azure.mgmt.kusto import KustoManagementClient
    from azure.mgmt.kusto.models import EventHubDataConnection
    from adal import AuthenticationContext
    from msrestazure.azure_active_directory import AdalAuthentication

    tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
    client_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
    client_secret = "xxxxxxxxxxxxxx"
    subscription_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
    context = AuthenticationContext('https://login.microsoftonline.com/{}'.format(tenant_id))
    credentials = AdalAuthentication(context.acquire_token_with_client_credentials,
                                         resource="https://management.core.windows.net/",
                                         client_id=client_id,
                                         client_secret=client_secret)
    kusto_management_client = KustoManagementClient(credentials, subscription_id)
    data_connections = kusto_management_client.data_connections
    
    resource_group_name = "testrg";
    cluster_name = "mykustocluster";
    database_name = "mykustodb";
    data_connection_name = "myeventhubconnect";
    event_hub_resource_id = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.EventHub/namespaces/xxxxxx/eventhubs/xxxxxx";
    consumer_group = "$Default";
    table_name = "mykustotable";
    location = "Central US";
    mapping_rule_name = "mycolumnmapping";
    data_format = "csv";
    poller = data_connections.create_or_update(resource_group_name=resource_group_name, cluster_name=cluster_name, database_name=database_name, data_connection_name=data_connection_name,
                                           parameters=EventHubDataConnection(event_hub_resource_id=event_hub_resource_id, consumer_group=consumer_group, 
                                                                             table_name=table_name, location=location, mapping_rule_name=mapping_rule_name, data_format=data_format))
    poller.result()
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
    | dataConnectionName | *myeventhubconnect* | The desired name of your data connection.|
    | tableName | *mykustodb* | The name of the target tableName in the target database.|
    | location | *Central US* | The location of the data connection resource.|
    | mappingRuleName | *mycolumnmapping* | The name of your column mapping related to the target table.|
    | dataFormat | *csv* | The data format of the message.|
    | eventHubResourceId | *resource id* | The resource id of your event hub.|
    | consumerGroup | *$Default* | The consumer group of your event hub.|
  
    If you want to create a EventHub data connection by Azure portal, check [this](ingest-data-event-hub.md)


1. Add EventGrid data connection by using the following code:

    ```Python
    from azure.mgmt.kusto.models import EventGridDataConnection

    storage_account_resource_id="/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.Storage/storageAccounts/xxxxxx"
    poller = data_connections.create_or_update(resource_group_name=resource_group_name, cluster_name=cluster_name, database_name=database_name, data_connection_name=data_connection_name,
                                               parameters=EventGridDataConnection(storage_account_resource_id=storage_account_resource_id, event_hub_resource_id=event_hub_resource_id, 
                                                                                  consumer_group=consumer_group, table_name=table_name, location=location, mapping_rule_name=mapping_rule_name, data_format=data_format))
    poller.result()
    ```
    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | storageAccountResourceId | *resource id* | The resource id of your storage account.|

    If you want to create a EventGrid data connection by Azure portal, check [this](ingest-data-event-grid.md)

## Clean up resources
* To delete the data connection, Use the following command:

    ```csharp
    kustoManagementClient.DataConnections.Delete(resourceGroupName, clusterName, databaseName, dataConnectionName);
    ```

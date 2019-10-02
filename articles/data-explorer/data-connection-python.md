---
title: 'Add data connections for Azure Data Explorer by using Python'
description: In this article, you learn how to add data connections for Azure Data Explorer by using Python.
author: lugoldbe
ms.author: lugoldbe
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 09/24/2019
---

# Create an Azure Data Explorer data connection by using Python

> [!div class="op_single_selector"]
> * [C#](data-connection-csharp.md)
> * [Python](data-connection-python.md)
>

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data Explorer offers ingestion (data loading) from Event Hubs, and blobs written to blob containers. In this article, you create data connections for Azure Data Explorer by using Python.

## Prerequisites

1. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

1. [A test cluster and database](create-cluster-database-csharp.md)

1. [A test table and column mapping](net-standard-ingest-data.md)

1. [Set database-level/table-level policies](database-table-policies-csharp.md) (Optional)

1. [An event hub with data for ingestion](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-create) for adding a EventHub data connection

1. [An event hub](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-create), [a storage account with data for ingestion](https://docs.microsoft.com/en-us/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal), and [an Event Grid subscription in your storage account](ingest-data-event-grid.md) for adding a EventGrid data connection

1. [An IoT hub and a shared access policy](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-create-through-portal) for adding an IoT hub data connection

## Install Python package

To install the Python package for Azure Data Explorer (Kusto), open a command prompt that has Python in its path. Run this command:

```
pip install azure-mgmt-kusto
pip install adal
pip install msrestazure
```
# Authentication
For running the examples in this article, we need an Azure AD Application and service principal that can access resources. Check [create an Azure AD application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal) to create a free Azure AD Application and add role assignment at the subscription scope. It also shows how to get the `Directory (tenant) ID`, `Application ID`, and `Client Secret`.

## Add data connections

1. Add a EventHub data connection by using the following code:

    ```Python
    from azure.mgmt.kusto import KustoManagementClient
    from azure.mgmt.kusto.models import EventHubDataConnection
    from adal import AuthenticationContext
    from msrestazure.azure_active_directory import AdalAuthentication

    #Directory (tenant) ID
    tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
    #Application ID
    client_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
    #Client Secret
    client_secret = "xxxxxxxxxxxxxx"
    subscription_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
    context = AuthenticationContext('https://login.microsoftonline.com/{}'.format(tenant_id))
    credentials = AdalAuthentication(context.acquire_token_with_client_credentials,
                                         resource="https://management.core.windows.net/",
                                         client_id=client_id,
                                         client_secret=client_secret)
    kusto_management_client = KustoManagementClient(credentials, subscription_id)
    
    resource_group_name = "testrg";
    #The cluster and database that are created in step(2) at the Prerequisite section
    cluster_name = "mykustocluster";
    database_name = "mykustodatabase";
    data_connection_name = "myeventhubconnect";
    #The event hub that is created in step(5) at the Prerequisite section
    event_hub_resource_id = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.EventHub/namespaces/xxxxxx/eventhubs/xxxxxx";
    consumer_group = "$Default";
    location = "Central US";
    #The table and column mapping that are created in step(3) at the Prerequisite section
    table_name = "StormEvents";
    mapping_rule_name = "StormEvents_CSV_Mapping";
    data_format = "csv";
    #Returns an instance of LROPoller, check https://docs.microsoft.com/en-us/python/api/msrest/msrest.polling.lropoller?view=azure-python
    poller = kusto_management_client.data_connections.create_or_update(resource_group_name=resource_group_name, cluster_name=cluster_name, database_name=database_name, data_connection_name=data_connection_name,
                                           parameters=EventHubDataConnection(event_hub_resource_id=event_hub_resource_id, consumer_group=consumer_group, location=location,
                                                                             table_name=table_name, mapping_rule_name=mapping_rule_name, data_format=data_format))
    ```
    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | tenant_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The id of your tenant.|
    | subscriptionId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The id of the subscription you create resources with.|
    | client_id | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The client id of the application that can access resources in your tenant.|
    | client_secret | *xxxxxxxxxxxxxx* | The client secret of the application that can access resources in your tenant. |
    | resource_group_name | *testrg* | The name of the resource group containing your cluster.|
    | cluster_name | *mykustocluster* | The name of your cluster.|
    | database_name | *mykustodatabase* | The name of the target database in your cluster.|
    | data_connection_name | *myeventhubconnect* | The desired name of your data connection.|
    | table_name | *StormEvents* | The name of the target tableName in the target database.|
    | mapping_rule_name | *StormEvents_CSV_Mapping* | The name of your column mapping related to the target table.|
    | data_format | *csv* | The data format of the message.|
    | event_hub_resource_id | *resource id* | The resource id of your event hub, which holds the data for ingestion. |
    | consumer_group | *$Default* | The consumer group of your event hub.|
    | location | *Central US* | The location of the data connection resource.|
  

1. Add EventGrid data connection by using the following code:

    ```Python
    from azure.mgmt.kusto.models import EventGridDataConnection

    #The event hub and storage account that are created in step(5) at the Prerequisite section
    event_hub_resource_id = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.EventHub/namespaces/xxxxxx/eventhubs/xxxxxx"
    storage_account_resource_id = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.Storage/storageAccounts/xxxxxx"

    #Returns an instance of LROPoller, check https://docs.microsoft.com/en-us/python/api/msrest/msrest.polling.lropoller?view=azure-python
    poller = kusto_management_client.data_connections.create_or_update(resource_group_name=resource_group_name, cluster_name=cluster_name, database_name=database_name, data_connection_name=data_connection_name,
                                               parameters=EventGridDataConnection(storage_account_resource_id=storage_account_resource_id, event_hub_resource_id=event_hub_resource_id, 
                                                                                  consumer_group=consumer_group, table_name=table_name, location=location, mapping_rule_name=mapping_rule_name, data_format=data_format))
    ```
    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | event_hub_resource_id | *resource id* | The resource id of your event hub, where the event grid is configured to send events. |
    | storage_account_resource_id | *resource id* | The resource id of your storage account, which holds the data for ingestion. |

1. Add IoT hub data connection by using the following code:

    ```Python
    from azure.mgmt.kusto.models import IotHubDataConnection

    #The IoT hub that is created in step(8) at the Prerequisite section
    iot_hub_resource_id = "/subscriptions/xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/xxxxxx/providers/Microsoft.Devices/IotHubs/xxxxxx";
    shared_access_policy_name = "iothubforread";

    #Returns an instance of LROPoller, check https://docs.microsoft.com/en-us/python/api/msrest/msrest.polling.lropoller?view=azure-python
    poller = kusto_management_client.data_connections.create_or_update(resource_group_name=resource_group_name, cluster_name=cluster_name, database_name=database_name, data_connection_name=data_connection_name,
                                               parameters=IotHubDataConnection(iot_hub_resource_id=iot_hub_resource_id, shared_access_policy_name=shared_access_policy_name, 
                                                                                  consumer_group=consumer_group, table_name=table_name, location=location, mapping_rule_name=mapping_rule_name, data_format=data_format))
    ```
    |**Setting** | **Suggested value** | **Field description**|
    |---|---|---|
    | iot_hub_resource_id | *resource id* | The resource id of your IoT hub, which holds the data for ingestion. |
    | shared_access_policy_name | *iothubforread* | The name of the shared access policy, which defines the permissions for devices and services to connect to IoT Hub. |


## Clean up resources
* To delete the data connection, Use the following command:

    ```csharp
    kustoManagementClient.DataConnections.Delete(resourceGroupName, clusterName, databaseName, dataConnectionName);
    ```
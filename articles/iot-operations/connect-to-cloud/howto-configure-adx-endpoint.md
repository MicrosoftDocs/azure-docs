---
title: Configure dataflow endpoints for Azure Data Explorer
description: Learn how to configure dataflow endpoints for Azure Data Explorer in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 09/05/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure dataflow endpoints for Azure Data Explorer in Azure IoT Operations so that I can send data to Azure Data Explorer.
---

# Configure dataflow endpoints for Azure Data Explorer

To send data to Azure Data Explorer in Azure IoT Operations Preview, you can configure a dataflow endpoint. This configuration allows you to specify the destination endpoint, authentication method, table, and other settings.

## Prerequisites

- An instance of [Azure IoT Operations Preview](../deploy-iot-ops/howto-deploy-iot-operations.md)
- A [configured dataflow profile](howto-configure-dataflow-profile.md)
- An **Azure Data Explorer cluster**. Follow the **Full cluster** steps in the [Quickstart: Create an Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-and-database). The *free cluster* option doesn't work for this scenario.

## Create an Azure Data Explorer dataflow endpoint

1. In the Azure portal, create a database in your Azure Data Explorer *full* cluster.

1. Create a table in your database for the data. You can use the Azure portal and create columns manually, or you can use [KQL](/azure/data-explorer/kusto/management/create-table-command) in the query tab. For example, to create a table for sample thermostat data, run the following command:

    ```kql
    .create table thermostat (
        externalAssetId: string,
        assetName: string,
        CurrentTemperature: real,
        Pressure: real,
        MqttTopic: string,
        Timestamp: datetime
    )
    ```

1. Enable streaming ingestion on your table and database. In the query tab, run the following command, substituting `<DATABASE_NAME>` with your database name:

    ```kql
    .alter database ['<DATABASE_NAME>'] policy streamingingestion enable
    ```

  Alternatively, you can enable streaming ingestion on the entire cluster. See [Enable streaming ingestion on an existing cluster](/azure/data-explorer/ingest-data-streaming#enable-streaming-ingestion-on-an-existing-cluster).

1. In Azure portal, go to the Arc-connected Kubernetes cluster and select **Settings** > **Extensions**. In the extension list, find the name of your Azure IoT Operations extension. Copy the name of the extension.

1. In your Azure Data Explorer database, under **Security + networking** select **Permissions** > **Add** > **Ingestor**. Search for the Azure IoT Operations extension name then add it.

1. Create the dataflow endpoint resource with your cluster and database information.

    ```yaml
    apiVersion: connectivity.iotoperations.azure.com/v1beta1
    kind: DataflowEndpoint
    metadata:
      name: adx
      namespace: azure-iot-operations
    spec:
      endpointType: DataExplorer
      dataExplorerSettings:
        host: <your cluster>.westeurope.kusto.windows.net
        database: <your database>
        authentication:
          method: SystemAssignedManagedIdentity
          systemAssignedManagedIdentitySettings: {}
    ```
    
## Configure dataflow destination

Once the endpoint is created, you can use it in a dataflow by specifying the endpoint name in the dataflow's destination settings.

> [!NOTE]
> Using the Azure Data Explorer endpoint as a source in a dataflow isn't supported. You can use the endpoint as a destination only.

For more information about dataflow destination settings, see [Create a dataflow](howto-create-dataflow.md).

To customize the endpoint settings, see the following sections for more information.

### Available authentication methods

The following authentication methods are available.

#### System-assigned managed identity

Before you create the dataflow endpoint, assign a role to the managed identity that grants permission to write to the Azure Data Explorer database. For more information on adding permissions, see [Manage Azure Data Explorer cluster permissions](/azure/data-explorer/manage-cluster-permissions).

Then, create the *DataflowEndpoint* resource and specify the managed identity authentication method. In most cases, you don't need to specify other settings. This configuration creates a managed identity with the default audience `https://api.kusto.windows.net`.

```yaml
dataExplorerSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings: {}
```

If you need to override the system-assigned managed identity audience, you can specify the `audience` setting.

```yaml
dataExplorerSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      audience: https://<audience URL>
```

#### User-assigned managed identity

To use a user-assigned managed identity, specify the `UserAssignedManagedIdentity` authentication method and provide the `clientId` and `tenantId` of the managed identity.

```yaml
dataExplorerSettings:
  authentication:
    method: UserAssignedManagedIdentity
    userAssignedManagedIdentitySettings:
      clientId: <id>
      tenantId: <id>
```

### Batching

Use the `batching` settings to configure the maximum number of messages and the maximum latency before the messages are sent to the destination. This setting is useful when you want to optimize for network bandwidth and reduce the number of requests to the destination.

| Field | Description | Required |
| ----- | ----------- | -------- |
| `latencySeconds` | The maximum number of seconds to wait before sending the messages to the destination. The default value is 60 seconds. | No |
| `maxMessages` | The maximum number of messages to send to the destination. The default value is 100000 messages. | No |

For example, to configure the maximum number of messages to 1000 and the maximum latency to 100 seconds, use the following settings.

```yaml
dataExplorerSettings:
  batching:
    latencySeconds: 100
    maxMessages: 1000
```
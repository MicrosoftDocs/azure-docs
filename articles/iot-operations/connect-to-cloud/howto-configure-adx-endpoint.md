---
title: Configure dataflow endpoints for Azure Data Explorer
description: Learn how to configure dataflow endpoints for Azure Data Explorer in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 08/20/2024

#CustomerIntent: As an operator, I want to understand how to configure dataflow endpoints for Azure Data Explorer in Azure IoT Operations so that I can send data to Azure Data Explorer.
---

# Configure dataflow endpoints for Azure Data Explorer

Azure Data Explorer endpoints are used for Azure Data Explorer destinations. You can configure the endpoint, authentication, table, and other settings.

## Prerequisites

- **Azure IoT Operations**. See [Deploy Azure IoT Operations Preview](../deploy-iot-ops/howto-deploy-iot-operations.md)
- **Dataflow profile**. See [Configure dataflow profile](howto-configure-dataflow-profile.md)
- **Azure Data Explorer cluster**. Follow the **Full cluster** steps in the [Quickstart: Create an Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-and-database).

## How to create dataflow endpoint for Azure Data Explorer using managed identity

1. Ensure that the steps in prerequisites are met, including a full Azure Data Explorer cluster. The "free cluster" option doesn't work.

1. You can create a table for given data via the Azure portal and create columns manually, or you can use [KQL](/azure/data-explorer/kusto/management/create-table-command) in the query tab. For example:

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
    .alter database <DATABASE_NAME> policy streamingingestion enable
    ```

  Alternatively, you can enable streaming ingestion on the entire cluster. See [Enable streaming ingestion on an existing cluster](/azure/data-explorer/ingest-data-streaming#enable-streaming-ingestion-on-an-existing-cluster).

1. In Azure portal, go to the Arc-connected Kubernetes cluster and select **Settings** > **Extensions**. In the extension list, look for the name of your Azure IoT Operations extension. Copy the name of the extension.

1. In your Azure Data Explorer database, select **Permissions** > **Add** > **Ingestor**. Search for the Azure IoT Operations extension name and add it.

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

### Use the endpoint in a dataflow destination

Now that you have created the endpoint, you can use it in a dataflow by specifying the endpoint name in the dataflow's destination settings. To learn more, see [Create a dataflow](howto-create-dataflow.md).

> [!NOTE]
> Using the Azure Data Explorer endpoint as a source in a dataflow isn't supported. You can use the endpoint as a destination only.

To customize the endpoint settings, see the following sections.

## Available authentication methods

The following authentication methods are available.

### System-assigned managed identity

Before you create the dataflow endpoint, assign a role to the managed identity that grants permission to write to the Azure Data Explorer database. For more information on adding permissions, see [Manage Azure Data Explorer cluster permissions](/azure/data-explorer/manage-cluster-permissions).

Then, create the DataflowEndpoint resource and specify the managed identity authentication method. In most cases, you don't need to specify additional settings. This creates a managed identity with the default audience `https://api.kusto.windows.net`.

```yaml
fabricOneLakeSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      {}
```

This is uncommon, but if you need to override the system-assigned managed identity audience, you can specify the `audience` setting.

```yaml
fabricOneLakeSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      audience: https://<audience URL>
```

### User-assigned managed identity

TBD

```yaml
fabricOneLakeSettings:
  authentication:
    method: UserAssignedManagedIdentity
    userAssignedManagedIdentitySettings:
      clientId: <id>
      tenantId: <id>
```

## Batching

Use the `batching` settings to configure the maximum number of messages and the maximum latency before the messages are sent to the destination. This setting is useful when you want to optimize for network bandwidth and reduce the number of requests to the destination.

| Field | Description | Required |
| ----- | ----------- | -------- |
| `latencySeconds` | The maximum number of seconds to wait before sending the messages to the destination. The default value is 60 seconds. | No |
| `maxMessages` | The maximum number of messages to send to the destination. The default value is 100000 messages. | No |

For example, to configure the maximum number of messages to 1000 and the maximum latency to 100 seconds, use the following settings.

```yaml
fabricOneLakeSettings:
  batching:
    latencySeconds: 100
    maxMessages: 1000
```
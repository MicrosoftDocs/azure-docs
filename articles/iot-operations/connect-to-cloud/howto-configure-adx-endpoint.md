---
title: Configure dataflow endpoints for Azure Data Explorer
description: Learn how to configure dataflow endpoints for Azure Data Explorer in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 09/20/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure dataflow endpoints for Azure Data Explorer in Azure IoT Operations so that I can send data to Azure Data Explorer.
---

# Configure dataflow endpoints for Azure Data Explorer

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

To send data to Azure Data Explorer in Azure IoT Operations Preview, you can configure a dataflow endpoint. This configuration allows you to specify the destination endpoint, authentication method, table, and other settings.

## Prerequisites

- An instance of [Azure IoT Operations Preview](../deploy-iot-ops/howto-deploy-iot-operations.md)
- A [configured dataflow profile](howto-configure-dataflow-profile.md)
- An **Azure Data Explorer cluster**. Follow the **Full cluster** steps in the [Quickstart: Create an Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-and-database). The *free cluster* option doesn't work for this scenario.

## Create an Azure Data Explorer database

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

## Create an Azure Data Explorer dataflow endpoint

Create the dataflow endpoint resource with your cluster and database information. We suggest using the managed identity of the Azure Arc-enabled Kubernetes cluster. This approach is secure and eliminates the need for secret management.

# [Portal](#tab/portal)

1. In the IoT Operations portal, select the **Dataflow endpoints** tab.
1. Under **Create new dataflow endpoint**, select **Azure Data Explorer** > **New**.

    :::image type="content" source="media/howto-configure-adx-endpoint/create-adx-endpoint.png" alt-text="Screenshot using Azure Operations portal to create an Azure Data Explorer dataflow endpoint.":::

1. Enter the following settings for the endpoint:

    | Setting               | Description                                                                                       |
    | --------------------- | ------------------------------------------------------------------------------------------------- |
    | Name                  | The name of the dataflow endpoint.                                                        |
    | Host                  | The hostname of the Azure Data Explorer endpoint in the format `<cluster>.<region>.kusto.windows.net`. |
    | Authentication method | The method used for authentication. Choose *System assigned managed identity*, *User assigned managed identity*, or *Access token*.     |
    | Client ID             | The client ID of the user-assigned managed identity. Required if using *User assigned managed identity*. |
    | Tenant ID             | The tenant ID of the user-assigned managed identity. Required if using *User assigned managed identity*. |

# [Kubernetes](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: adx
  namespace: azure-iot-operations
spec:
  endpointType: DataExplorer
  dataExplorerSettings:
    host: <cluster>.<region>.kusto.windows.net
    database: <database-name>
    authentication:
      method: SystemAssignedManagedIdentity
      systemAssignedManagedIdentitySettings: {}
```

---

## Configure dataflow destination

Once the endpoint is created, you can use it in a dataflow by specifying the endpoint name in the dataflow's destination settings.

# [Portal](#tab/portal)

1. In the Azure IoT Operations Preview portal, create a new dataflow or edit an existing dataflow by selecting the **Dataflows** tab on the left. If creating a new dataflow, select a source for the dataflow.
1. In the editor, select the destination dataflow endpoint.
1. Choose the Azure Data Explorer endpoint that you created previously.

    :::image type="content" source="media/howto-configure-adx-endpoint/dataflow-mq-adx.png" alt-text="Screenshot using Azure Operations portal to create a dataflow with an MQTT source and Azure Data Explorer destination.":::

1. Specify an output schema for the data. The schema must match the table schema in Azure Data Explorer. You can select an existing schema or upload a new schema to the schema registry.
1. Select **Apply** to provision the dataflow.

# [Kubernetes](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: Dataflow
metadata:
  name: my-dataflow
  namespace: azure-iot-operations
spec:
  profileRef: default
  mode: Enabled
  operations:
    - operationType: Source
      sourceSettings:
        endpointRef: mq
        dataSources:
          - thermostats/+/telemetry/temperature/#
          - humidifiers/+/telemetry/humidity/#
    - operationType: Destination
      destinationSettings:
        endpointRef: adx
        dataDestination: database-name
```

---

For more information about dataflow destination settings, see [Create a dataflow](howto-create-dataflow.md).

> [!NOTE]
> Using the Azure Data Explorer endpoint as a source in a dataflow isn't supported. You can use the endpoint as a destination only.

To customize the endpoint settings, see the following sections for more information.

### Available authentication methods

The following authentication methods are available for Azure Data Explorer endpoints.

#### System-assigned managed identity

Using the system-assigned managed identity is the recommended authentication method for Azure IoT Operations. Azure IoT Operations creates the managed identity automatically and assigns it to the Azure Arc-enabled Kubernetes cluster. It eliminates the need for secret management and allows for seamless authentication with Azure Data Explorer.

Before you create the dataflow endpoint, assign a role to the managed identity that grants permission to write to the Azure Data Explorer database. For more information on adding permissions, see [Manage Azure Data Explorer cluster permissions](/azure/data-explorer/manage-cluster-permissions).

In the *DataflowEndpoint* resource, specify the managed identity authentication method. In most cases, you don't need to specify other settings. This configuration creates a managed identity with the default audience `https://api.kusto.windows.net`.

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
      clientId: <ID>
      tenantId: <ID>
```

## Advanced settings

You can set advanced settings for the  Azure Data Explorer endpoint, such as the batching latency and message count. 

Use the `batching` settings to configure the maximum number of messages and the maximum latency before the messages are sent to the destination. This setting is useful when you want to optimize for network bandwidth and reduce the number of requests to the destination.

| Field | Description | Required |
| ----- | ----------- | -------- |
| `latencySeconds` | The maximum number of seconds to wait before sending the messages to the destination. The default value is 60 seconds. | No |
| `maxMessages` | The maximum number of messages to send to the destination. The default value is 100000 messages. | No |

For example, to configure the maximum number of messages to 1000 and the maximum latency to 100 seconds, use the following settings:

# [Portal](#tab/portal)

In the IoT Operations portal, select the **Advanced** tab for the dataflow endpoint.

:::image type="content" source="media/howto-configure-adx-endpoint/adx-advanced.png" alt-text="Screenshot using Azure Operations portal to set Azure Data Explorer advanced settings.":::

# [Kubernetes](#tab/kubernetes)

Set the values in the dataflow endpoint custom resource.

```yaml
dataExplorerSettings:
  batching:
    latencySeconds: 100
    maxMessages: 1000
```

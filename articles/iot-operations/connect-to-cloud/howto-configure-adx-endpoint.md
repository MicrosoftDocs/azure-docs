---
title: Configure dataflow endpoints for Azure Data Explorer
description: Learn how to configure dataflow endpoints for Azure Data Explorer in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 11/04/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure dataflow endpoints for Azure Data Explorer in Azure IoT Operations so that I can send data to Azure Data Explorer.
---

# Configure dataflow endpoints for Azure Data Explorer

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

To send data to Azure Data Explorer in Azure IoT Operations, you can configure a dataflow endpoint. This configuration allows you to specify the destination endpoint, authentication method, table, and other settings.

## Prerequisites

- An instance of [Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md)
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

   Alternatively, enable streaming ingestion on the entire cluster. See [Enable streaming ingestion on an existing cluster](/azure/data-explorer/ingest-data-streaming#enable-streaming-ingestion-on-an-existing-cluster).

## Assign permission to managed identity

To configure a dataflow endpoint for Azure Data Explorer, we recommend using either a user-assigned or system-assigned managed identity. This approach is secure and eliminates the need for managing credentials manually.

After the Azure Data Explorer database is created, you need to assign a role to the Azure IoT Operations managed identity that grants permission to write to the database.

If using system-assigned managed identity, in Azure portal, go to your Azure IoT Operations instance and select **Overview**. Copy the name of the extension listed after **Azure IoT Operations Arc extension**. For example, *azure-iot-operations-xxxx7*. Your system-assigned managed identity can be found using the same name of the Azure IoT Operations Arc extension.

1. In your Azure Data Explorer database (not cluster), under **Overview** select **Permissions** > **Add** and then select **Ingestor** as the role. This gives the managed identity the necessary permissions to write to the Azure Data Explorer database. To learn more, see [Role-based access control](/kusto/access-control/role-based-access-control?view=azure-data-explorer&preserve-view=true&branch=main).
1. Search for the name of your [user-assigned managed identity set up for cloud connections](../deploy-iot-ops/howto-enable-secure-settings.md#set-up-a-user-assigned-managed-identity-for-cloud-connections) or the system-assigned managed identity. For example, *azure-iot-operations-xxxx7*.
1. Then, select **Select**.

## Create dataflow endpoint for Azure Data Explorer

<!-- TODO: use the data ingest URI for host? -->

# [Portal](#tab/portal)

1. In the operations experience, select the **Dataflow endpoints** tab.
1. Under **Create new dataflow endpoint**, select **Azure Data Explorer** > **New**.

    :::image type="content" source="media/howto-configure-adx-endpoint/create-adx-endpoint.png" alt-text="Screenshot using operations experience to create an Azure Data Explorer dataflow endpoint.":::

1. Enter the following settings for the endpoint:

    | Setting               | Description                                                                                       |
    | --------------------- | ------------------------------------------------------------------------------------------------- |
    | Name                  | The name of the dataflow endpoint.                                                        |
    | Host                  | The hostname of the Azure Data Explorer endpoint in the format `<cluster>.<region>.kusto.windows.net`. |
    | Authentication method | The method used for authentication. Choose [*System assigned managed identity*](#system-assigned-managed-identity) or [*User assigned managed identity*](#user-assigned-managed-identity). |
    | Client ID             | The client ID of the user-assigned managed identity. Required if using *User assigned managed identity*. |
    | Tenant ID             | The tenant ID of the user-assigned managed identity. Required if using *User assigned managed identity*. |

1. Select **Apply** to provision the endpoint.

# [Bicep](#tab/bicep)

Create a Bicep `.bicep` file with the following content.

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param endpointName string = '<ENDPOINT_NAME>'
param hostName string = 'https://<CLUSTER>.<region>.kusto.windows.net'
param databaseName string = '<DATABASE_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}
resource adxEndpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-11-01' = {
  parent: aioInstance
  name: endpointName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    endpointType: 'DataExplorer'
    dataExplorerSettings: {
      host: hostName
      database: databaseName
      authentication: {
        // See available authentication methods section for method types
        // method: <METHOD_TYPE>
      }
    }
  }
}
```

Then, deploy via Azure CLI.

```azurecli
az deployment group create --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

# [Kubernetes (preview)](#tab/kubernetes)

Create a Kubernetes manifest `.yaml` file with the following content.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowEndpoint
metadata:
  name: <ENDPOINT_NAME>
  namespace: azure-iot-operations
spec:
  endpointType: DataExplorer
  dataExplorerSettings:
    host: 'https://<CLUSTER>.<region>.kusto.windows.net'
    database: <DATABASE_NAME>
    authentication:
      # See available authentication methods section for method types
      # method: <METHOD_TYPE>
```

Then apply the manifest file to the Kubernetes cluster.

```bash
kubectl apply -f <FILE>.yaml
```

---

## Available authentication methods

The following authentication methods are available for Azure Data Explorer endpoints.

### System-assigned managed identity

Before you configure the dataflow endpoint, assign a role to the Azure IoT Operations managed identity that grants permission to write to the Azure Data Explorer database:

1. In Azure portal, go to your Azure IoT Operations instance and select **Overview**.
1. Copy the name of the extension listed after **Azure IoT Operations Arc extension**. For example, *azure-iot-operations-xxxx7*.
1. Go to Azure Data Explorer database (not cluster), under **Overview** select **Permissions** > **Add** and then select an appropriate role.
1. Search for the name of your system-assigned managed identity. For example, *azure-iot-operations-xxxx7*.
1. Select **Select**.

Then, configure the dataflow endpoint with system-assigned managed identity settings.

# [Portal](#tab/portal)

In the operations experience dataflow endpoint settings page, select the **Basic** tab then choose **Authentication method** > **System assigned managed identity**.

# [Bicep](#tab/bicep)

```bicep
dataExplorerSettings: {
  authentication: {
    method: 'SystemAssignedManagedIdentity'
    systemAssignedManagedIdentitySettings: {}
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
dataExplorerSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings: {}
```

---

If you need to override the system-assigned managed identity audience, you can specify the `audience` setting.


# [Portal](#tab/portal)

In most cases, you don't need to specify other settings. This configuration creates a managed identity with the default audience `https://api.kusto.windows.net`.

# [Bicep](#tab/bicep)

```bicep
dataExplorerSettings: {
  authentication: {
    method: 'SystemAssignedManagedIdentity'
    systemAssignedManagedIdentitySettings: {
      audience: 'https://<AUDIENCE_URL>'    
    }
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
dataExplorerSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      audience: https://<AUDIENCE_URL>
```

---

### User-assigned managed identity

To use user-assigned managed identity for authentication, you must first deploy Azure IoT Operations with secure settings enabled. Then you need to [set up a user-assigned managed identity for cloud connections](../deploy-iot-ops/howto-enable-secure-settings.md#set-up-a-user-assigned-managed-identity-for-cloud-connections). To learn more, see [Enable secure settings in Azure IoT Operations deployment](../deploy-iot-ops/howto-enable-secure-settings.md).

Before you configure the dataflow endpoint, assign a role to the user-assigned managed identity that grants permission to write to the Azure Data Explorer database:

1. In Azure portal, go to Azure Data Explorer database (not cluster), under **Overview** select **Permissions** > **Add** and then select an appropriate role.
1. Search for the name of your user-assigned managed identity.
1. Select **Select**.

Then, configure the dataflow endpoint with user-assigned managed identity settings.

# [Portal](#tab/portal)

In the operations experience dataflow endpoint settings page, select the **Basic** tab then choose **Authentication method** > **User assigned managed identity**.

Enter the user assigned managed identity client ID and tenant ID in the appropriate fields.

# [Bicep](#tab/bicep)

```bicep
dataExplorerSettings: {
  authentication: {
    method: 'UserAssignedManagedIdentity'
    userAssignedManagedIdentitySettings: {
      clientId: '<ID>'
      tenantId: '<ID>'
      // Optional, defaults to 'https://api.kusto.windows.net/.default'
      // scope: 'https://<SCOPE_URL>'
    }
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
dataExplorerSettings:
  authentication:
    method: UserAssignedManagedIdentity
    userAssignedManagedIdentitySettings:
      clientId: <ID>
      tenantId: <ID>
      # Optional, defaults to 'https://api.kusto.windows.net/.default'
      # scope: https://<SCOPE_URL>
```

---

Here, the scope is optional and defaults to `https://api.kusto.windows.net/.default`. If you need to override the default scope, specify the `scope` setting via Bicep or Kubernetes.

## Advanced settings

You can set advanced settings for the Azure Data Explorer endpoint, such as the batching latency and message count. 

Use the `batching` settings to configure the maximum number of messages and the maximum latency before the messages are sent to the destination. This setting is useful when you want to optimize for network bandwidth and reduce the number of requests to the destination.

| Field | Description | Required |
| ----- | ----------- | -------- |
| `latencySeconds` | The maximum number of seconds to wait before sending the messages to the destination. The default value is 60 seconds. | No |
| `maxMessages` | The maximum number of messages to send to the destination. The default value is 100000 messages. | No |

For example, to configure the maximum number of messages to 1000 and the maximum latency to 100 seconds, use the following settings:

# [Portal](#tab/portal)

In the operations experience, select the **Advanced** tab for the dataflow endpoint.

:::image type="content" source="media/howto-configure-adx-endpoint/adx-advanced.png" alt-text="Screenshot using operations experience to set Azure Data Explorer advanced settings.":::

# [Bicep](#tab/bicep)

```bicep
dataExplorerSettings: {
  batching: {
    latencySeconds: 100
    maxMessages: 1000
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
dataExplorerSettings:
  batching:
    latencySeconds: 100
    maxMessages: 1000
```

---

## Next steps

To learn more about dataflows, see [Create a dataflow](howto-create-dataflow.md).
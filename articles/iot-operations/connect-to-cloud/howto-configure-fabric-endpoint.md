---
title: Configure dataflow endpoints for Microsoft Fabric OneLake
description: Learn how to configure dataflow endpoints for Microsoft Fabric OneLake in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 11/04/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure dataflow endpoints for Microsoft Fabric OneLake in Azure IoT Operations so that I can send data to Microsoft Fabric OneLake.
---

# Configure dataflow endpoints for Microsoft Fabric OneLake

To send data to Microsoft Fabric OneLake in Azure IoT Operations, you can configure a dataflow endpoint. This configuration allows you to specify the destination endpoint, authentication method, table, and other settings.

## Prerequisites

- An instance of [Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md)
- A [configured dataflow profile](howto-configure-dataflow-profile.md)
- **Microsoft Fabric OneLake**. See the following steps to create a workspace and lakehouse.
  - [Create a workspace](/fabric/get-started/create-workspaces). The default *my workspace* isn't supported.
  - [Create a lakehouse](/fabric/onelake/create-lakehouse-onelake).
  - If shown, ensure *Lakehouse schemas (Public Preview)* is **unchecked**.
  - Make note of the workspace and lakehouse names.

## Create a Microsoft Fabric OneLake dataflow endpoint

To configure a dataflow endpoint for Microsoft Fabric OneLake, we suggest using the managed identity of the Azure Arc-enabled Kubernetes cluster. This approach is secure and eliminates the need for secret management.

1. In Azure portal, go to your Azure IoT Operations instance and select **Overview**.
1. Copy the name of the extension listed after **Azure IoT Operations Arc extension**. For example, *azure-iot-operations-xxxx7*.
1. In the Microsoft Fabric workspace you created, select **Manage access** > **+ Add people or groups**. Search for the Azure IoT Operations Arc extension by its name and select it. Select **Contributor** as the role, then select **Add**.
1. Create the *DataflowEndpoint* resource and specify the managed identity authentication method. 

# [Portal](#tab/portal)

1. In the operations experience, select the **Dataflow endpoints** tab.
1. Under **Create new dataflow endpoint**, select **Microsoft Fabric OneLake** > **New**.

    :::image type="content" source="media/howto-configure-fabric-endpoint/create-fabric-endpoint.png" alt-text="Screenshot using operation experience to create a Microsoft Fabric OneLake dataflow endpoint.":::

1. Enter the following settings for the endpoint:

    | Setting              | Description                                                   |
    | -------------------- | ------------------------------------------------------------- |
    | Host                 | The hostname of the Microsoft Fabric OneLake endpoint in the format `onelake.dfs.fabric.microsoft.com`. |
    | Lakehouse name       | The name of the lakehouse where the data should be stored.    |
    | Workspace name       | The name of the workspace associated with the lakehouse.      |
    | OneLake path type    | The type of path used in OneLake. Select *Files* or *Tables*. |
    | Authentication method | The method used for authentication. Choose *System assigned managed identity* or *User assigned managed identity* |
    | Client ID             | The client ID of the user-assigned managed identity. Required if using *User assigned managed identity*. |
    | Tenant ID             | The tenant ID of the user-assigned managed identity. Required if using *User assigned managed identity*. |

1. Select **Apply** to provision the endpoint.

# [Bicep](#tab/bicep)
   
Create a Bicep `.bicep` file with the following content.

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param endpointName string = '<ENDPOINT_NAME>'
param workspaceName string = '<WORKSPACE_NAME>'
param lakehouseName string = '<LAKEHOUSE_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}
resource oneLakeEndpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-11-01' = {
  parent: aioInstance
  name: endpointName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    endpointType: 'FabricOneLake'
    fabricOneLakeSettings: {
      // The default Fabric OneLake host URL in most cases
      host: 'https://onelake.dfs.fabric.microsoft.com'
      authentication: {
        method: 'SystemAssignedManagedIdentity'
        systemAssignedManagedIdentitySettings: {}
      }
      oneLakePathType: 'Tables'
      names: {
        workspaceName: workspaceName
        lakehouseName: lakehouseName
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
  namespace: azure-iotoperations
spec:
  endpointType: FabricOneLake
  fabricOneLakeSettings:
    # The default Fabric OneLake host URL in most cases
    host: https://onelake.dfs.fabric.microsoft.com
    authentication:
      method: SystemAssignedManagedIdentity
      systemAssignedManagedIdentitySettings: {}
    oneLakePathType: Tables
    names:
      workspaceName: <WORKSPACE_NAME>
      lakehouseName: <LAKEHOUSE_NAME>
```

Then apply the manifest file to the Kubernetes cluster.

```bash
kubectl apply -f <FILE>.yaml
```

---

## OneLake path type

The `oneLakePathType` setting determines the type of path to use in the OneLake path. The default value is `Tables`, which is the recommended path type for the most common use cases. The `Tables` path type is a table in the OneLake lakehouse that is used to store the data. It can also be set as `Files`, which is a file in the OneLake lakehouse that is used to store the data. The `Files` path type is useful when you want to store the data in a file format that isn't supported by the `Tables` path type.

# [Portal](#tab/portal)

The OneLake path type is set in the **Basic** tab for the dataflow endpoint.

# [Bicep](#tab/bicep)

```bicep
fabricOneLakeSettings: {
  oneLakePathType: 'Tables' // Or 'Files'
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
fabricOneLakeSettings:
  oneLakePathType: Tables # Or Files
```

---

## Available authentication methods

The following authentication methods are available for Microsoft Fabric OneLake dataflow endpoints. For more information about enabling secure settings by configuring an Azure Key Vault and enabling workload identities, see [Enable secure settings in Azure IoT Operations deployment](../deploy-iot-ops/howto-enable-secure-settings.md).

Before you create the dataflow endpoint, assign workspace *Contributor* role to the IoT Operations extension that grants permission to write to the Fabric lakehouse. 

![Screenshot of IoT Operations extension name to grant workspace access to.](media/howto-configure-fabric-endpoint/extension-name.png)

To learn more, see [Give access to a workspace](/fabric/get-started/give-access-workspaces).

### System-assigned managed identity

Using the system-assigned managed identity is the recommended authentication method for Azure IoT Operations. Azure IoT Operations creates the managed identity automatically and assigns it to the Azure Arc-enabled Kubernetes cluster. It eliminates the need for secret management and allows for seamless authentication.

In the *DataflowEndpoint* resource, specify the managed identity authentication method. In most cases, you don't need to specify other settings. This configuration creates a managed identity with the default audience.

# [Portal](#tab/portal)

In the operations experience dataflow endpoint settings page, select the **Basic** tab then choose **Authentication method** > **System assigned managed identity**.

# [Bicep](#tab/bicep)

```bicep
fabricOneLakeSettings: {
  authentication: {
    method: 'SystemAssignedManagedIdentity'
    systemAssignedManagedIdentitySettings: {}
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
fabricOneLakeSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      {}
```

---

If you need to override the system-assigned managed identity audience, you can specify the `audience` setting.

# [Portal](#tab/portal)

In most cases, you don't need to specify a service audience. Not specifying an audience creates a managed identity with the default audience scoped to your storage account.

# [Bicep](#tab/bicep)

```bicep
fabricOneLakeSettings: {
  authentication: {
    method: 'SystemAssignedManagedIdentity'
    systemAssignedManagedIdentitySettings: {
      audience: 'https://<ACCOUNT>.onelake.dfs.fabric.microsoft.com'
    }
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
fabricOneLakeSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      audience: https://<ACCOUNT>.onelake.dfs.fabric.microsoft.com
```

---

### User-assigned managed identity

To use user-managed identity for authentication, you must first deploy Azure IoT Operations with secure settings enabled. To learn more, see [Enable secure settings in Azure IoT Operations deployment](../deploy-iot-ops/howto-enable-secure-settings.md).

Then, specify the user-assigned managed identity authentication method along with the client ID, tenant ID, and scope of the managed identity.

# [Portal](#tab/portal)

In the operations experience dataflow endpoint settings page, select the **Basic** tab then choose **Authentication method** > **User assigned managed identity**.

Enter the user assigned managed identity client ID and tenant ID in the appropriate fields.

# [Bicep](#tab/bicep)

```bicep
fabricOneLakeSettings: {
  authentication: {
    method: 'UserAssignedManagedIdentity'
    userAssignedManagedIdentitySettings: {
      clientId: '<ID>'
      tenantId: '<ID>'
      // Optional, defaults to 'https://storage.azure.com/.default'
      // scope: 'https://<SCOPE_URL>' 
    }
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

To use a user-assigned managed identity, specify the `UserAssignedManagedIdentity` authentication method and provide the `clientId` and `tenantId` of the managed identity.

```yaml
fabricOneLakeSettings:
  authentication:
    method: UserAssignedManagedIdentity
    userAssignedManagedIdentitySettings:
      clientId: <ID>
      tenantId: <ID>
      # Optional, defaults to 'https://storage.azure.com/.default'
      # scope: https://<SCOPE_URL>
```

---

Here, the scope is optional and defaults to `https://storage.azure.com/.default`. If you need to override the default scope, specify the `scope` setting using Bicep or Kubernetes.

## Advanced settings

You can set advanced settings for the Fabric OneLake endpoint, such as the batching latency and message count. You can set these settings in the dataflow endpoint **Advanced** portal tab or within the dataflow endpoint custom resource.

### Batching

Use the `batching` settings to configure the maximum number of messages and the maximum latency before the messages are sent to the destination. This setting is useful when you want to optimize for network bandwidth and reduce the number of requests to the destination.

| Field | Description | Required |
| ----- | ----------- | -------- |
| `latencySeconds` | The maximum number of seconds to wait before sending the messages to the destination. The default value is 60 seconds. | No |
| `maxMessages` | The maximum number of messages to send to the destination. The default value is 100000 messages. | No |

For example, to configure the maximum number of messages to 1000 and the maximum latency to 100 seconds, use the following settings:

# [Portal](#tab/portal)

In the operations experience, select the **Advanced** tab for the dataflow endpoint.

:::image type="content" source="media/howto-configure-fabric-endpoint/fabric-advanced.png" alt-text="Screenshot using operations experience to set Microsoft Fabric advanced settings.":::

# [Bicep](#tab/bicep)

```bicep
fabricOneLakeSettings: {
  batching: {
    latencySeconds: 100
    maxMessages: 1000
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
fabricOneLakeSettings:
  batching:
    latencySeconds: 100
    maxMessages: 1000
```

---

## Next steps

To learn more about dataflows, see [Create a dataflow](howto-create-dataflow.md).
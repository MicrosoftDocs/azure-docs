---
title: Configure dataflow endpoints for Microsoft Fabric OneLake
description: Learn how to configure dataflow endpoints for Microsoft Fabric OneLake in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/02/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure dataflow endpoints for Microsoft Fabric OneLake in Azure IoT Operations so that I can send data to Microsoft Fabric OneLake.
---

# Configure dataflow endpoints for Microsoft Fabric OneLake

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

To send data to Microsoft Fabric OneLake in Azure IoT Operations Preview, you can configure a dataflow endpoint. This configuration allows you to specify the destination endpoint, authentication method, table, and other settings.

## Prerequisites

- An instance of [Azure IoT Operations Preview](../deploy-iot-ops/howto-deploy-iot-operations.md)
- A [configured dataflow profile](howto-configure-dataflow-profile.md)
- **Microsoft Fabric OneLake**. See the following steps to create a workspace and lakehouse.
  - [Create a workspace](/fabric/get-started/create-workspaces). The default *my workspace* isn't supported.
  - [Create a lakehouse](/fabric/onelake/create-lakehouse-onelake).
  - If shown, ensure *Lakehouse schemas (Public Preview)* is **unchecked**.
  - Make note of the workspace and lakehouse names.

## Create a Microsoft Fabric OneLake dataflow endpoint

To configure a dataflow endpoint for Microsoft Fabric OneLake, we suggest using the managed identity of the Azure Arc-enabled Kubernetes cluster. This approach is secure and eliminates the need for secret management.

1. Get the managed identity of the Azure IoT Operations Preview Arc extension.

1. In the Microsoft Fabric workspace you created, select **Manage access** > **+ Add people or groups**.

1. Search for the Azure IoT Operations Preview Arc extension by its name, and select the app ID GUID value that you found in the previous step.

1. Select **Contributor** as the role, then select **Add**.

# [Kubernetes](#tab/kubernetes)

1. Create the *DataflowEndpoint* resource and specify the managed identity authentication method.

    ```yaml
    apiVersion: connectivity.iotoperations.azure.com/v1beta1
    kind: DataflowEndpoint
    metadata:
      name: fabric
    spec:
      endpointType: FabricOneLake
      fabricOneLakeSettings:
        # The default Fabric OneLake host URL in most cases
        host: https://onelake.dfs.fabric.microsoft.com
        oneLakePathType: Tables
        authentication:
          method: SystemAssignedManagedIdentity
          systemAssignedManagedIdentitySettings: {}
        names:
          workspaceName: <EXAMPLE-WORKSPACE-NAME>
          lakehouseName: <EXAMPLE-LAKEHOUSE-NAME>
    ```

# [Bicep](#tab/bicep)
   
1. Create a bicep file `deployment.bicep`. Replace the placeholder values like `<AIO_INSTANCE_NAME>` with your own.

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param endpointName string = '<ENDPOINT_NAME>'
param lakehouseName string = '<EXAMPLE-LAKEHOUSE-NAME>'
param workspaceName string = '<EXAMPLE-WORKSPACE-NAME>'

resource oneLakeEndpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-08-15-preview' = {
  parent: aioInstance
  name: endpointName
  extendedLocation: {
    name: customLocationName
    type: 'CustomLocation'
  }
  properties: {
    endpointType: 'FabricOneLake'
    fabricOneLakeSettings: {
      authentication: {
        method: 'SystemAssignedManagedIdentity'
        systemAssignedManagedIdentitySettings: {}
      }
      oneLakePathType: 'Tables'
      host: 'https://onelake.dfs.fabric.microsoft.com'
      names: {
        lakehouseName: lakehouseName
        workspaceName: workspaceName
      }
      ...
    }
  }
}
```

1. Deploy via Azure CLI

```azurecli
az stack group create --name MyDeploymentStack --resource-group <RESOURCE_GROUP> --template-file deployment.bicep
```

---

### Available authentication methods

The following authentication methods are available for Microsoft Fabric OneLake dataflow endpoints. For more information about enabling secure settings by configuring an Azure Key Vault and enabling workload identities, see [Enable secure settings in Azure IoT Operations Preview deployment](../deploy-iot-ops/howto-enable-secure-settings.md).

Before you create the dataflow endpoint, assign workspace *Contributor* role to the IoT Operations extension that grants permission to write to the Fabric lakehouse. 

![Screenshot of IoT Operations extension name to grant workspace access to.](media/howto-configure-fabric-endpoint/extension-name.png)

To learn more, see [Give access to a workspace](/fabric/get-started/give-access-workspaces).

#### System-assigned managed identity

Using the system-assigned managed identity is the recommended authentication method for Azure IoT Operations. Azure IoT Operations creates the managed identity automatically and assigns it to the Azure Arc-enabled Kubernetes cluster. It eliminates the need for secret management and allows for seamless authentication with Azure Data Explorer.


# [Kubernetes](#tab/kubernetes)

In the *DataflowEndpoint* resource, specify the managed identity authentication method. In most cases, you don't need to specify other settings. This configuration creates a managed identity with the default audience.

```yaml
fabricOneLakeSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      {}
```

If you need to override the system-assigned managed identity audience, you can specify the `audience` setting.

```yaml
fabricOneLakeSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      audience: https://contoso.onelake.dfs.fabric.microsoft.com
```

# [Bicep](#tab/bicep)

```bicep
fabricOneLakeSettings: {
  authentication: {
    method: 'SystemAssignedManagedIdentity'
    systemAssignedManagedIdentitySettings: {
      audience: 'https://contoso.onelake.dfs.fabric.microsoft.com'
    }
  }
  ...
}
```

---

#### User-assigned managed identity

# [Kubernetes](#tab/kubernetes)

To use a user-assigned managed identity, specify the `UserAssignedManagedIdentity` authentication method and provide the `clientId` and `tenantId` of the managed identity.

```yaml
fabricOneLakeSettings:
  authentication:
    method: UserAssignedManagedIdentity
    userAssignedManagedIdentitySettings:
      clientId: <ID>
      tenantId: <ID>
```

# [Bicep](#tab/bicep)

```bicep
fabricOneLakeSettings: {
  authentication: {
    method: 'UserAssignedManagedIdentity'
    userAssignedManagedIdentitySettings: {
      clientId: '<clientId>'
      tenantId: '<tenantId>'
    }
  }
  ...
}
```

---

## Advanced settings

You can set advanced settings for the Fabric OneLake endpoint, such as the batching latency and message count. You can set these settings in the dataflow endpoint **Advanced** portal tab or within the dataflow endpoint custom resource.

Use the `batching` settings to configure the maximum number of messages and the maximum latency before the messages are sent to the destination. This setting is useful when you want to optimize for network bandwidth and reduce the number of requests to the destination.

| Field | Description | Required |
| ----- | ----------- | -------- |
| `latencySeconds` | The maximum number of seconds to wait before sending the messages to the destination. The default value is 60 seconds. | No |
| `maxMessages` | The maximum number of messages to send to the destination. The default value is 100000 messages. | No |

For example, to configure the maximum number of messages to 1000 and the maximum latency to 100 seconds, use the following settings:

# [Kubernetes](#tab/kubernetes)

Set the values in the dataflow endpoint custom resource.

```yaml
fabricOneLakeSettings:
  batching:
    latencySeconds: 100
    maxMessages: 1000
```

# [Bicep](#tab/bicep)

The bicep file has the values in the dataflow endpoint resource.

<!-- TODO  Add a way for users to override the file with values using the az stack group command >

```bicep
batching: {
  latencySeconds: 5
  maxMessages: 10000
}
```
-->
---
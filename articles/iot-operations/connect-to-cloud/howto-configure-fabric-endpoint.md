---
title: Configure dataflow endpoints for Microsoft Fabric OneLake
description: Learn how to configure dataflow endpoints for Microsoft Fabric OneLake in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 09/05/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure dataflow endpoints for Microsoft Fabric OneLake in Azure IoT Operations so that I can send data to Microsoft Fabric OneLake.
---

# Configure dataflow endpoints for Microsoft Fabric OneLake

To send data to Microsoft Fabric OneLake in Azure IoT Operations Preview, you can configure a dataflow endpoint. This configuration allows you to specify the destination endpoint, authentication method, table, and other settings.

## Prerequisites

- An instance of [Azure IoT Operations Preview](../deploy-iot-ops/howto-deploy-iot-operations.md)
- A [configured dataflow profile](howto-configure-dataflow-profile.md)
- **Microsoft Fabric OneLake**. See the following steps to create a workspace and lakehouse.
  - [Create a workspace](/fabric/get-started/create-workspaces). The default *my workspace* isn't supported.
  - [Create a lakehouse](/fabric/onelake/create-lakehouse-onelake).

## Create a Microsoft Fabric OneLake dataflow endpoint

To configure a dataflow endpoint for Microsoft Fabric OneLake, we suggest using the managed identity of the Azure Arc-enabled Kubernetes cluster. This approach is secure and eliminates the need for secret management.

### Use managed identity authentication 

1. Get the managed identity of the Azure IoT Operations Preview Arc extension.

1. In the Microsoft Fabric workspace you created, select **Manage access** > **+ Add people or groups**.

1. Search for the Azure IoT Operations Preview Arc extension by its name, and select the app ID GUID value that you found in the previous step.

1. Select **Contributor** as the role, then select **Add**.

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
          workspaceName: <example-workspace-name>
          lakehouseName: <example-lakehouse-name>
    ```

## Configure dataflow destination

Once the endpoint is created, you can use it in a dataflow by specifying the endpoint name in the dataflow's destination settings. To learn more, see [Create a dataflow](howto-create-dataflow.md).

> [!NOTE]
> Using the Fabric endpoint as a source in a dataflow isn't supported. You can use the endpoint as a destination only.

To customize the endpoint settings, see the following sections for more information.

### Fabric OneLake host URL

Use the `host` setting to specify the Fabric OneLake host URL. Usually, it's `https://onelake.dfs.fabric.microsoft.com`.

```yaml
fabricOneLakeSettings:
  host: https://onelake.dfs.fabric.microsoft.com
```

However, if this host value doesn't work and you're not getting data, try checking for the URL from the Properties of one of the precreated lakehouse folders.

![Screenshot of properties shortcut menu to get lakehouse URL.](media/howto-fabric-endpoint/lakehouse-name.png)

The host value should look like `https://xyz.dfs.fabric.microsoft.com`.

To learn more, see [Connecting to Microsoft OneLake](/fabric/onelake/onelake-access-api).

### OneLake path type

Use the `oneLakePathType` setting to specify the type of path in the Fabric OneLake. The default value is `Tables`, which is used for the Tables folder in the lakehouse typically in Delta Parquet format.

```yaml
fabricOneLakeSettings:
  oneLakePathType: Tables
```

Another possible value is `Files`. Use this value for the Files folder in the lakehouse, which is unstructured and can be in any format.

```yaml
fabricOneLakeSettings:
  oneLakePathType: Files
```

### Available authentication methods

The following authentication methods are available.

#### System-assigned managed identity

Before you create the dataflow endpoint, assign a role to the managed identity that grants permission to write to the Fabric lakehouse. To learn more, see [Give access to a workspace](/fabric/get-started/give-access-workspaces).

Then, create the *DataflowEndpoint* resource and specify the managed identity authentication method. In most cases, you don't need to specify other settings. This configuration creates a managed identity with the default audience.

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

#### User-assigned managed identity

To use a user-assigned managed identity, specify the `UserAssignedManagedIdentity` authentication method and provide the `clientId` and `tenantId` of the managed identity.

```yaml
fabricOneLakeSettings:
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
fabricOneLakeSettings:
  batching:
    latencySeconds: 100
    maxMessages: 1000
```
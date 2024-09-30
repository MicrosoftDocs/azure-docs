---
title: Configure dataflow endpoints for Microsoft Fabric OneLake
description: Learn how to configure dataflow endpoints for Microsoft Fabric OneLake in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 09/30/2024
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

## Create a Microsoft Fabric OneLake dataflow endpoint

To configure a dataflow endpoint for Microsoft Fabric OneLake, we suggest using the managed identity of the Azure Arc-enabled Kubernetes cluster. This approach is secure and eliminates the need for secret management.

# [Portal](#tab/portal)

1. In the IoT Operations portal, select the **Dataflow endpoints** tab.
1. Under **Create new dataflow endpoint**, select **Microsoft Fabric OneLake** > **New**.

    :::image type="content" source="media/howto-configure-fabric-endpoint/create-fabric-endpoint.png" alt-text="Screenshot using Azure Operations portal to create a Microsoft Fabric OneLake dataflow endpoint.":::

1. Enter the following settings for the endpoint:

    | Settings             | Description                                                   |
    | -------------------- | ------------------------------------------------------------- |
    | Host                 | The hostname of the Microsoft Fabric OneLake endpoint in the format `onelake.dfs.fabric.microsoft.com`. |
    | Lakehouse name       | The name of the lakehouse where the data should be stored.    |
    | Workspace name       | The name of the workspace associated with the lakehouse.      |
    | OneLake path type    | The type of path used in OneLake. Select *Files* or *Tables*. |
    | Authentication method | The method used for authentication. Choose *System assigned managed identity* or *User assigned managed identity* |
    | Client ID             | The client ID of the user-assigned managed identity. Required if using *User assigned managed identity*. |
    | Tenant ID             | The tenant ID of the user-assigned managed identity. Required if using *User assigned managed identity*. |

# [Kubernetes](#tab/kubernetes)

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
          workspaceName: <EXAMPLE-WORKSPACE-NAME>
          lakehouseName: <EXAMPLE-LAKEHOUSE-NAME>
    ```

---

## Configure dataflow destination

Once the endpoint is created, you can use it in a dataflow by specifying the endpoint name in the dataflow's destination settings. 

# [Portal](#tab/portal)

1. In the Azure IoT Operations Preview portal, create a new dataflow or edit an existing dataflow by selecting the **Dataflows** tab. If creating a new dataflow, select a source for the dataflow.
1. In the editor, select the destination dataflow endpoint.
1. Choose the Azure Data Explorer endpoint that you created previously.

    :::image type="content" source="media/howto-configure-fabric-endpoint/dataflow-mq-fabric.png" alt-text="Screenshot using Azure Operations portal to create a dataflow with an MQTT source and a Microsoft Fabric destination.":::

1. Enter the following settings for the endpoint:

| Settings             | Description                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Table or folder name | The name of the table or folder where the data is sent.                                   |
| Schema name          | The name of the schema that defines the structure of the data.                                     |
| Output schema        | The schema that matches the table schema in Microsoft Fabric OneLake. You can select an existing schema or upload a new one to the schema registry. |

    
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
          *
    - operationType: Destination
      destinationSettings:
        endpointRef: fabric
```

To customize the endpoint settings, see the following sections for more information.

### Fabric OneLake host URL

Use the `host` setting to specify the Fabric OneLake host URL. Usually, it's `https://onelake.dfs.fabric.microsoft.com`.

```yaml
fabricOneLakeSettings:
  host: https://onelake.dfs.fabric.microsoft.com
```

However, if this host value doesn't work and you're not getting data, try checking for the URL from the Properties of one of the precreated lakehouse folders.

![Screenshot of properties shortcut menu to get lakehouse URL.](media/howto-configure-fabric-endpoint/lakehouse-name.png)

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

---

For more information about dataflow destination settings, see [Create a dataflow](howto-create-dataflow.md).

> [!NOTE]
> Using the Fabric OneLake dataflow endpoint as a source in a dataflow isn't supported. You can use the endpoint as a destination only.

### Available authentication methods

The following authentication methods are available for Microsoft Fabric OneLake dataflow endpoints.

#### System-assigned managed identity

Using the system-assigned managed identity is the recommended authentication method for Azure IoT Operations. Azure IoT Operations creates the managed identity automatically and assigns it to the Azure Arc-enabled Kubernetes cluster. It eliminates the need for secret management and allows for seamless authentication with Azure Data Explorer.

Before you create the dataflow endpoint, assign a role to the managed identity that grants permission to write to the Fabric lakehouse. To learn more, see [Give access to a workspace](/fabric/get-started/give-access-workspaces).

# [Portal](#tab/portal)

In the Azure IoT Operations portal dataflow endpoint settings page, select the **Basic** tab then choose **Authentication method** > **System assigned managed identity**.

In most cases, you don't need to specify a service audience. Not specifying an audience creates a managed identity with the default audience scoped to your storage account.

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

---

#### User-assigned managed identity

# [Portal](#tab/portal)

In the Azure IoT Operations portal dataflow endpoint settings page, select the **Basic** tab then choose **Authentication method** > **User assigned managed identity**.

Enter the user assigned managed identity client ID and tenant ID in the appropriate fields.

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

---

## Advanced settings

You can set advanced settings for the Fabric OneLake endpoint, such as the batching latency and message count. You can set these settings in the dataflow endpoint **Advanced** portal tab or within the dataflow endpoint custom resource.

Use the `batching` settings to configure the maximum number of messages and the maximum latency before the messages are sent to the destination. This setting is useful when you want to optimize for network bandwidth and reduce the number of requests to the destination.

| Field | Description | Required |
| ----- | ----------- | -------- |
| `latencySeconds` | The maximum number of seconds to wait before sending the messages to the destination. The default value is 60 seconds. | No |
| `maxMessages` | The maximum number of messages to send to the destination. The default value is 100000 messages. | No |

For example, to configure the maximum number of messages to 1000 and the maximum latency to 100 seconds, use the following settings:

# [Portal](#tab/portal)

In the IoT Operations portal, select the **Advanced** tab for the dataflow endpoint.

:::image type="content" source="media/howto-configure-fabric-endpoint/fabric-advanced.png" alt-text="Screenshot using Azure Operations portal to set Azure Data Explorer advanced settings.":::

# [Kubernetes](#tab/kubernetes)

Set the values in the dataflow endpoint custom resource.

```yaml
fabricOneLakeSettings:
  batching:
    latencySeconds: 100
    maxMessages: 1000
```

---
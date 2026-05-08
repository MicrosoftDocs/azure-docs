---
title: Configure data flow endpoints for Microsoft Fabric Real-Time Intelligence
description: Learn how to configure data flow endpoints for  Microsoft Fabric Real-Time Intelligence in Azure IoT Operations.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 05/05/2026
ai-usage: ai-assisted
ms.custom:
  - sfi-image-nochange
  - sfi-ropc-nochange

#CustomerIntent: As an operator, I want to understand how to configure data flow endpoints for  Microsoft Fabric Real-Time Intelligence in Azure IoT Operations so that I can send real-time data to Microsoft Fabric.
---

# Configure data flow endpoints for Microsoft Fabric Real-Time Intelligence

To send data to Microsoft Fabric Real-Time Intelligence from Azure IoT Operations, you can configure a data flow endpoint. This configuration allows you to specify the destination endpoint, authentication method, topic, and other settings.

## Prerequisites

- An [Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md) instance
- [Create a Fabric workspace](/fabric/get-started/create-workspaces). The default *my workspace* isn't supported.
- [Create an event stream](/fabric/real-time-intelligence/event-streams/create-manage-an-eventstream#create-an-eventstream)
- [Add a custom endpoint as a source](/fabric/real-time-intelligence/event-streams/add-source-custom-app#add-custom-endpoint-data-as-a-source)

> [!NOTE]
> Event Stream supports multiple input sources including Azure Event Hubs. If you have an existing data flow to Azure Event Hubs, you can bring that into Fabric as shown in the [Quickstart](../get-started-end-to-end-sample/quickstart-get-insights.md#ingest-data-into-real-time-intelligence). This article shows you how to flow real-time data directly into Microsoft Fabric without any other hops in between.

## Retrieve custom endpoint connection details

Retrieve the [Kafka-compatible connection details for the custom endpoint](/fabric/real-time-intelligence/event-streams/add-source-custom-app#kafka). The connection details are used to configure the data flow endpoint in Azure IoT Operations. 

# [Entra ID authentication](#tab/entra-id)

This method uses a managed identity to authenticate with the event stream. Use either system-assigned managed identity or user-assigned managed identity when you configure the data flow endpoint.

1. The connection details are in the Fabric portal under the **Sources** section of your event stream. 
1. In the details panel for the custom endpoint, select **Kafka** protocol.
1. Select the **Entra ID Authentication** section to view the connection details.
1. Copy the details for the values for the **Bootstrap server** and **Topic name**. You use these values to configure the data flow endpoint.

    :::image type="content" source="media/howto-configure-fabric-real-time-intelligence/event-stream-kafka-entra-id.png" alt-text="Screenshot in Microsoft Fabric that has the custom endpoint connection details.":::
    
    | Settings                | Description                                                                                                   |
    | ----------------------- | ------------------------------------------------------------------------------------------------------------- |
    | Bootstrap server        | The bootstrap server address is used for the hostname property in data flow endpoint.                         |
    | Topic name              | The event hub name is used as the Kafka topic and is in the format *es_aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb*. |


# [SASL authentication](#tab/sasl)

1. The connection details are in the Fabric portal under the **Sources** section of your event stream. 
1. In the details panel for the custom endpoint, select **Kafka** protocol.
1. Select the **SAS Key Authentication** section to view the connection details.
1. Copy the details for the values for the **Bootstrap server**, **Topic name**, and **Connection string-primary key**. You use these values to configure the data flow endpoint.

    :::image type="content" source="media/howto-configure-fabric-real-time-intelligence/event-stream-kafka-key.png" alt-text="Screenshot in Microsoft Fabric that has the custom endpoint connection details.":::
    
    | Settings                      | Description                                                                                                   |
    | ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
    | Bootstrap server              | The bootstrap server address is used for the hostname property in data flow endpoint.                         |
    | Topic name                    | The event hub name is used as the Kafka topic and is in the format *es_aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb*. |
    | Connection string-primary key | The connection string with the primary key.                                                                   |

---

## Create a Microsoft Fabric Real-Time Intelligence data flow endpoint

# [Operations experience](#tab/portal)

1. In the IoT Operations experience portal, select the **Data flow endpoints** tab.
1. Under **Create new data flow endpoint**, select **Microsoft Fabric Real-Time Intelligence** > **New**.
1. Enter the following settings for the endpoint.

    :::image type="content" source="media/howto-configure-fabric-real-time-intelligence/event-stream-sasl.png" alt-text="Screenshot using operations experience to create a new Fabric Real-Time Intelligence data flow endpoint.":::

    | Setting               | Description                                                                                                                                                                                                               |
    | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | Name                  | The name of the data flow endpoint.                                                                                                                                                                                       |
    | Host                  | The hostname of the event stream custom endpoint in the format `<bootstrap-server>.servicebus.windows.net:9093`. Use the bootstrap server address noted previously.                                                       |
    | Authentication method | The method used for authentication. Choose [*System assigned managed identity*](#system-assigned-managed-identity), [*User assigned managed identity*](#user-assigned-managed-identity), or [*SASL*](#sasl).              |

    Use the authentication method that matches how you want Azure IoT Operations to connect to the Fabric event stream custom endpoint:

    - **System-assigned managed identity**: Use the Azure IoT Operations Arc extension identity to authenticate with the event stream. Before you create the endpoint, add the extension identity to the Fabric workspace with **Contributor** or higher permissions. To learn more, see [System-assigned managed identity](#system-assigned-managed-identity).
    - **User-assigned managed identity**: Use a user-assigned managed identity configured for Azure IoT Operations cloud connections. Before you create the endpoint, add the user-assigned managed identity to the Fabric workspace with **Contributor** or higher permissions. To learn more, see [User-assigned managed identity](#user-assigned-managed-identity).
    - **SASL**: Use the Fabric event stream custom endpoint connection string. This method requires SASL settings and a synced Kubernetes secret with the username and password values. To learn more, see [SASL](#sasl).

1. Select **Apply** to provision the endpoint.

# [Azure CLI](#tab/cli)

#### Create or replace

Use the [az iot ops dataflow endpoint create fabric-realtime](/cli/azure/iot/ops/dataflow/endpoint/create#az-iot-ops-dataflow-endpoint-create-fabric-realtime) command to create or replace a Microsoft Fabric Real-Time Intelligence data flow endpoint.

```azurecli
az iot ops dataflow endpoint create fabric-realtime --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <EndpointName> --host "<BootstrapServerAddress>"
```

Here's an example command to create or replace a Microsoft Fabric Real-Time Intelligence data flow endpoint named `fabric-realtime-endpoint`:

```azurecli
az iot ops dataflow endpoint create fabric-realtime --resource-group myResourceGroup --instance myAioInstance --name fabric-realtime-endpoint --host "fabricrealtime.servicebus.windows.net:9093"
```

#### Create or change

Use the [az iot ops dataflow endpoint apply](/cli/azure/iot/ops/dataflow/endpoint#az-iot-ops-dataflow-endpoint-apply) command to create or change a Microsoft Fabric Real-Time Intelligence data flow endpoint.

```azurecli
az iot ops dataflow endpoint apply --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <EndpointName> --config-file <ConfigFilePathAndName>
```

The `--config-file` parameter is the path and file name of a JSON configuration file containing the resource properties.

In this example, assume a configuration file named `fabric-realtime-endpoint.json` with the following content stored in the user's home directory:

```json
{
  "endpointType": "Kafka",
  "kafkaSettings": {
    "host": "<BootstrapServerAddress>",
    "authentication": {
      "method": "Sasl",
      "saslSettings": {
        "saslType": "Plain",
        "secretRef": "<SecretName>"
      }
    },
    "tls": {
      "mode": "Enabled"
    }
  }
}
```

Here's an example command to create a new Microsoft Fabric Real-Time Intelligence data flow endpoint named `fabric-realtime-endpoint`:

```azurecli
az iot ops dataflow endpoint apply --resource-group myResourceGroupName --instance myAioInstanceName --name fabric-realtime-endpoint --config-file ~/fabric-realtime-endpoint.json
```

# [Bicep](#tab/bicep)

Create a Bicep `.bicep` file with the following content.

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param endpointName string = '<ENDPOINT_NAME>'
param hostName string = '<BOOTSTRAP_SERVER_ADDRESS>'
param secretName string = '<SECRET_NAME>'

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}

resource fabricRealtimeEndpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-11-01' = {
  parent: aioInstance
  name: endpointName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    endpointType: 'Kafka'
    kafkaSettings: {
      host: hostName
      authentication: {
        method: 'Sasl'
        saslSettings: {
          saslType: 'Plain' // Or ScramSha256, ScramSha512
          secretRef: secretName
        }
      }
      tls: {
        mode: 'Enabled'
      }
    }
  }
}
```

Then, deploy via Azure CLI.

```azurecli
az deployment group create --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```bash
kubectl create secret generic <SECRET_NAME> -n azure-iot-operations \
  --from-literal=username='$ConnectionString' \
  --from-literal=password='<ConnectionStringPrimaryKey>'
```

Create a Kubernetes manifest `.yaml` file with the following content.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowEndpoint
metadata:
  name: <ENDPOINT_NAME>
  namespace: azure-iot-operations
spec:
  endpointType: Kafka
  kafkaSettings:
    host: <BOOTSTRAP_SERVER_ADDRESS>
    authentication:
      method: Sasl
      saslSettings:
        saslType: Plain # Or ScramSha256, ScramSha512
        secretRef: <SECRET_NAME>
    tls:
      mode: Enabled
```

Then apply the manifest file to the Kubernetes cluster.

```bash
kubectl apply -f <FILE>.yaml
```

---

## Available authentication methods

The following authentication methods are available for Fabric Real-Time Intelligence data flow endpoints.

### System-assigned managed identity

Before you configure the data flow endpoint, give the Azure IoT Operations managed identity access to the Fabric workspace that contains your event stream. Fabric event stream custom endpoints authorize managed identities through Fabric workspace access, not through Azure portal IAM on an Azure resource.

1. In Azure portal, go to your Azure IoT Operations instance and select **Overview**.
1. Copy the name of the extension listed after **Azure IoT Operations Arc extension**. For example, *azure-iot-operations-xxxx7*.
1. In Microsoft Fabric, go to the workspace that contains your event stream.
1. Select **Manage access** > **Add people or groups**.
1. Search for the Azure IoT Operations Arc extension identity that you copied. For example, *azure-iot-operations-xxxx7*.
1. Assign **Contributor** or higher workspace permission to the identity.

For more information, see [Assign Fabric Workspace Permissions](/fabric/real-time-intelligence/event-streams/connect-using-managed-identity#step-2-assign-fabric-workspace-permissions).

Then, configure the data flow endpoint with system-assigned managed identity settings.

# [Operations experience](#tab/portal)

In the operations experience data flow endpoint settings page, select the **Basic** tab then choose **Authentication method** > **System assigned managed identity**.

# [Azure CLI](#tab/cli)

#### Create or replace

Use the [az iot ops dataflow endpoint create fabric-realtime](/cli/azure/iot/ops/dataflow/endpoint/create#az-iot-ops-dataflow-endpoint-create-fabric-realtime) command with the `--auth-type` parameter set to `SystemAssignedManagedIdentity` for system-assigned managed identity authentication. In most cases, you don't need to specify `--audience`. The default audience matches the endpoint host in the form `https://<NAMESPACE>.servicebus.windows.net`.

```azurecli
az iot ops dataflow endpoint create fabric-realtime --auth-type SystemAssignedManagedIdentity --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <EndpointName> --host "<BootstrapServerAddress>"
```

#### Create or change

Use the [az iot ops dataflow endpoint apply](/cli/azure/iot/ops/dataflow/endpoint#az-iot-ops-dataflow-endpoint-apply) command with the `--config-file` parameter.

In this example, assume a configuration file with the following content:

```json
{
    "endpointType": "Kafka",
    "kafkaSettings": {
        "host": "fabricrealtime.servicebus.windows.net:9093",
        "authentication": {
            "method": "SystemAssignedManagedIdentity",
            "systemAssignedManagedIdentitySettings": {}
        },
        "tls": {
            "mode": "Enabled"
        }
    }
}
```

# [Bicep](#tab/bicep)

```bicep
kafkaSettings: {
  authentication: {
    method: 'SystemAssignedManagedIdentity'
    systemAssignedManagedIdentitySettings: {}
  }
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
kafkaSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      {}
```

---

### User-assigned managed identity

To use user-assigned managed identity for authentication, you must first deploy Azure IoT Operations with secure settings enabled. Then you need to [set up a user-assigned managed identity for cloud connections](../deploy-iot-ops/howto-enable-secure-settings.md#set-up-a-user-assigned-managed-identity-for-cloud-connections). To learn more, see [Enable secure settings in Azure IoT Operations deployment](../deploy-iot-ops/howto-enable-secure-settings.md).

Before you configure the data flow endpoint, give the user-assigned managed identity access to the Fabric workspace that contains your event stream. Fabric event stream custom endpoints authorize managed identities through Fabric workspace access, not through Azure portal IAM on an Azure resource.

1. In Microsoft Fabric, go to the workspace that contains your event stream.
1. Select **Manage access** > **Add people or groups**.
1. Search for your user-assigned managed identity.
1. Assign **Contributor** or higher workspace permission to the identity.

For more information, see [Assign Fabric Workspace Permissions](/fabric/real-time-intelligence/event-streams/connect-using-managed-identity#step-2-assign-fabric-workspace-permissions).

Then, configure the data flow endpoint with user-assigned managed identity settings.

# [Operations experience](#tab/portal)

In the operations experience data flow endpoint settings page, select the **Basic** tab then choose **Authentication method** > **User assigned managed identity**.

# [Azure CLI](#tab/cli)

#### Create or replace

Use the [az iot ops dataflow endpoint create](/cli/azure/iot/ops/dataflow/endpoint/create) command with the `--auth-type` parameter set to `UserAssignedManagedIdentity` for with user-assigned managed identity authentication.

```azurecli
az iot ops dataflow endpoint create fabric-realtime --auth-type UserAssignedManagedIdentity --client-id <ClientId> --tenant-id <TenantId> --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <EndpointName> --host "<BootstrapServerAddress>"
```

#### Create or change

Use the [az iot ops dataflow endpoint apply](/cli/azure/iot/ops/dataflow/endpoint#az-iot-ops-dataflow-endpoint-apply) with the `--config-file` parameter

In this example, assume a configuration file with the following content:

```json
{
    "endpointType": "Kafka",
    "kafkaSettings": {
        "host": "<BootstrapServerAddress>",
        "authentication": {
          "method": "UserAssignedManagedIdentity",
          "userAssignedManagedIdentitySettings": {
            "clientId": "<ID>",
            "tenantId": "<ID>"
          }
        },
        "tls": {
            "mode": "Enabled"
        }
    }
}
```

The `scope` property is optional. If needed, set it to the audience for the Kafka broker, such as `https://<BootstrapServerAddress>`.

# [Bicep](#tab/bicep)

```bicep
kafkaSettings: {
  authentication: {
    method: 'UserAssignedManagedIdentity'
    userAssignedManagedIdentitySettings: {
      clientId: '<CLIENT_ID>'
      tenantId: '<TENANT_ID>'
      // Optional
      // scope: 'https://<SCOPE_URL>'
    }
  }
  ...
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
kafkaSettings:
  authentication:
    method: UserAssignedManagedIdentity
    userAssignedManagedIdentitySettings:
      clientId: <CLIENT_ID>
      tenantId: <TENANT_ID>
      # Optional
      # scope: https://<SCOPE_URL>
```

---

### SASL

To use SASL for authentication, specify the SASL authentication method and configure the SASL type and a secret reference with the name of the secret that contains the SASL credentials.

Azure Key Vault is the recommended way to sync the connection string to the Kubernetes cluster so that it can be referenced in the data flow. [Secure settings](../deploy-iot-ops/howto-enable-secure-settings.md) must be enabled to configure this endpoint using the operations experience web UI.

# [Operations experience](#tab/portal)

In the operations experience data flow endpoint settings page, select the **Basic** tab then choose **Authentication method** > **SASL**.

Enter the following settings for the endpoint:

| Setting                            | Description                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| SASL type                          | The type of SASL authentication to use. For Fabric custom endpoints, choose `Plain`.              |
| Synced secret name                 | Enter a name for the synced secret. A Kubernetes secret with this name is created on the cluster. |
| Username reference or token secret | The reference to the username or token secret used for SASL authentication.                       |
| Password reference of token secret | The reference to the password or token secret used for SASL authentication.                       |

Select **Add reference** to create a new or choose an existing Key Vault reference for the username and password references.

For **Username reference of token secret**, store a Key Vault secret whose value is the literal string `$ConnectionString` (including the leading `$`).

:::image type="content" source="media/howto-configure-fabric-real-time-intelligence/username-reference.png" alt-text="Screenshot to create a username reference in Azure Key Vault.":::

For **Password reference of token secret**, the secret value must be the connection string with the primary key from the event stream custom endpoint.

:::image type="content" source="media/howto-configure-fabric-real-time-intelligence/password-reference.png" alt-text="Screenshot to create a password reference in Azure Key Vault.":::

# [Azure CLI](#tab/cli)

#### Create or replace

Use the [az iot ops dataflow endpoint create](/cli/azure/iot/ops/dataflow/endpoint/create) command with the `--auth-type` parameter set to `Sasl` for SASL authentication.

```azurecli
az iot ops dataflow endpoint create fabric-realtime --auth-type Sasl --sasl-type <SaslType> --secret-name <SecretName> --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <EndpointName> --host "<BootstrapServerAddress>"
```

#### Create or change

Use the [az iot ops dataflow endpoint apply](/cli/azure/iot/ops/dataflow/endpoint#az-iot-ops-dataflow-endpoint-apply) with the `--config-file` parameter

In this example, assume a configuration file with the following content:

```json
{
    "endpointType": "Kafka",
    "kafkaSettings": {
        "host": "<BootstrapServerAddress>",
        "authentication": {
          "method": "Sasl",
          "saslSettings": {
            "saslType": "<SaslType>",
            "secretRef": "<SecretName>"
          }
        },
        "tls": {
            "mode": "Enabled"
        }
    }
}
```

# [Bicep](#tab/bicep)

```bicep
kafkaSettings: {
  authentication: {
    method: 'Sasl'
    saslSettings: {
      saslType: 'Plain' // Or ScramSha256, ScramSha512
      secretRef: '<SECRET_NAME>'
    }
  }
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```bash
kubectl create secret generic <SECRET_NAME> -n azure-iot-operations \
  --from-literal=username='$ConnectionString' \
  --from-literal=password='<ConnectionStringPrimaryKey>'
```

```yaml
kafkaSettings:
  authentication:
    method: Sasl
    saslSettings:
      saslType: Plain # Or ScramSha256, ScramSha512
      secretRef: <SECRET_NAME>
```

---

The supported SASL types are:

- `Plain`
- `ScramSha256`
- `ScramSha512`

The secret must be in the same namespace as the Kafka data flow endpoint. The secret must have both the username and password as key-value pairs.

## Advanced settings

The advanced settings for this endpoint are identical to the [advanced settings for Azure Event Hubs endpoints](howto-configure-kafka-endpoint.md#advanced-settings).

## Next steps

To learn more about data flows, see [Create a data flow](howto-create-dataflow.md).

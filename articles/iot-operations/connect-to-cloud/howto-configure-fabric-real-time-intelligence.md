---
title: Configure data flow endpoints for Microsoft Fabric Real-Time Intelligence
description: Learn how to configure data flow endpoints for  Microsoft Fabric Real-Time Intelligence in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 06/17/2025
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure data flow endpoints for  Microsoft Fabric Real-Time Intelligence in Azure IoT Operations so that I can send real-time data to Microsoft Fabric.
---

# Configure data flow endpoints for Microsoft Fabric Real-Time Intelligence

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

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


1. The connection details are in the Fabric portal under the **Destinations** section of your event stream. 
1. In the details panel for the custom endpoint, select **Kafka** protocol.
1. Select the **SAS Key Authentication** section to view the connection details.
1. Copy the details for the values for the **Bootstrap server**, **Topic name**, and **Connection string-primary key**. You use these values to configure the data flow endpoint.

    :::image type="content" source="media/howto-configure-fabric-real-time-intelligence/event-stream-kafka.png" alt-text="Screenshot in Microsoft Fabric that has the custom endpoint connection details.":::
    
    | Settings              | Description                                                                           |
    |-----------------------|---------------------------------------------------------------------------------------|
    | Bootstrap server      | The bootstrap server address is used for the hostname property in data flow endpoint. |
    | Topic name            | The event hub name is used as the Kafka topic and is of the the format *es_aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb*. |
    | Connection string-primary key | The connection string with the primary key. |

## Create a Microsoft Fabric Real-Time Intelligence data flow endpoint

Microsoft Fabric Real-Time Intelligence, supports Simple Authentication and Security Layer (SASL), System-assigned managed identity, and User-assigned managed identity authentication methods. For details on the available authentication methods, see [Available authentication methods](#available-authentication-methods).

# [Operations experience](#tab/portal)

1. In the IoT Operations experience portal, select the **Data flow endpoints** tab.
1. Under **Create new data flow endpoint**, select **Microsoft Fabric Real-Time Intelligence** > **New**.
1. Enter the following settings for the endpoint.

    :::image type="content" source="media/howto-configure-fabric-real-time-intelligence/event-stream-sasl.png" alt-text="Screenshot using operations experience to create a new Fabric Real-Time Intelligence data flow endpoint.":::

    | Setting               | Description                                                       |
    | --------------------- | ----------------------------------------------------------------- |
    | Name                  | The name of the data flow endpoint. |
    | Host                  | The hostname of the event stream custom endpoint in the format `*.servicebus.windows.net:9093`. Use the bootstrap server address noted previously. |
    | Authentication method | The method used for authentication. Choose [*System assigned managed identity*](#system-assigned-managed-identity), [*User assigned managed identity*](#user-assigned-managed-identity), or [*SASL*](#sasl). |


    If you choose the SASL authentication method, you must also enter the following settings:

    | Setting               | Description                                                       |
    | --------------------- | ----------------------------------------------------------------- |
    | SASL type             | Choose *Plain*. |
    | Synced secret name    | Enter a name for the synced secret. A Kubernetes secret with this name is created on the cluster. |

    Select **Add reference** to create a new or choose an existing Key Vault reference for the username and password references.

    For **Username reference of token secret**, the secret value must be exactly the literal string **$ConnectionString** not an environmentent variable reference.

    :::image type="content" source="media/howto-configure-fabric-real-time-intelligence/username-reference.png" alt-text="Screenshot to create a username reference in Azure Key Vault.":::

    For **Password reference of token secret**, the secret value must be the connection string with the primary key from the event stream custom endpoint.

    :::image type="content" source="media/howto-configure-fabric-real-time-intelligence/password-reference.png" alt-text="Screenshot to create a password reference in Azure Key Vault.":::

1. Select **Apply** to provision the endpoint.

# [Azure CLI](#tab/cli)

#### Create or replace

Use the `az iot ops dataflow endpoint create fabric-realtime` command to create or replace a Microsoft Fabric Real-Time Intelligence data flow endpoint.

```azurecli
az iot ops dataflow endpoint create fabric-realtime --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <EndpointName> --host "<BootstrapServerAddress>"
```

Here's an example command to create or replace a Microsoft Fabric Real-Time Intelligence data flow endpoint named `fabric-realtime-endpoint`:

```azurecli
az iot ops dataflow endpoint create fabric-realtime --resource-group myResourceGroup --instance myAioInstance --name fabric-realtime-endpoint --host "fabricrealtime.servicebus.windows.net:9093"
```

#### Create or change

Use the `az iot ops dataflow endpoint apply` command to create or change a Microsoft Fabric Real-Time Intelligence data flow endpoint.

```azurecli
az iot ops dataflow endpoint apply --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <EndpointName> --config-file <ConfigFilePathAndName>
```

The `--config-file` parameter is the path and file name of a JSON configuration file containing the resource properties.

In this example, assume a configuration file named `fabric-endpoint.json` with the following content stored in the user's home directory:

```json
{
  "endpointType": "FabricRealTimeIntelligence",
  "fabricRealTimeIntelligenceSettings": {
    "authentication": {
      "method": "Sasl",
      "saslSettings": {
        "saslType": "Plain",
        "secretRef": "<SecretName>"
      }
    },
    "host": "<BootstrapServerAddress>",
    "topic": "<TopicName>",
    "names": {
      "workspaceName": "<WorkspaceName>",
      "eventStreamName": "<EventStreamName>"
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
kafkaSettings: {
  authentication: {
    method: 'Sasl' // Or ScramSha256, ScramSha512
    saslSettings: {
      saslType: 'Plain' // Or ScramSha256, ScramSha512
      secretRef: '<SECRET_NAME>'
    }
  }
}
```

Then, deploy via Azure CLI.

```azurecli
az deployment group create --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

# [Kubernetes (preview)](#tab/kubernetes)

```bash
kubectl create secret generic sasl-secret -n azure-iot-operations \
  --from-literal=token='<YOUR_SASL_TOKEN>'
```

Create a Kubernetes manifest `.yaml` file with the following content.

```yaml
kafkaSettings:
  authentication:
    method: Sasl
    saslSettings:
      saslType: Plain # Or ScramSha256, ScramSha512
      secretRef: <SECRET_NAME>
```

Then apply the manifest file to the Kubernetes cluster.

```bash
kubectl apply -f <FILE>.yaml
```

---

## Available authentication methods

The following authentication methods are available for Fabric Real-Time Intelligence data flow endpoints.

### System-assigned managed identity

Before you configure the data flow endpoint, assign a role to the Azure IoT Operations managed identity that grants permission to connect to the Kafka broker:

1. In Azure portal, go to your Azure IoT Operations instance and select **Overview**.
1. Copy the name of the extension listed after **Azure IoT Operations Arc extension**. For example, *azure-iot-operations-xxxx7*.
1. Go to the cloud resource you need to grant permissions. For example, go to the Event Hubs namespace > **Access control (IAM)** > **Add role assignment**.
1. On the **Role** tab, select an appropriate role.
1. On the **Members** tab, for **Assign access to**, select **User, group, or service principal** option, then select **+ Select members** and search for the Azure IoT Operations managed identity. For example, *azure-iot-operations-xxxx7*.

Then, configure the data flow endpoint with system-assigned managed identity settings.

# [Operations experience](#tab/portal)

In the operations experience data flow endpoint settings page, select the **Basic** tab then choose **Authentication method** > **System assigned managed identity**.

# [Azure CLI](#tab/cli)

#### Create or replace

Use the `az iot ops dataflow endpoint create` command with the `--auth-type` parameter set to `SystemAssignedManagedIdentity` for system-assigned managed identity authentication.

```azurecli
az iot ops dataflow endpoint create <Command> --auth-type SystemAssignedManagedIdentity --audience <Audience> --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <EndpointName>
```

#### Create or change

Use the `az iot ops dataflow endpoint apply` command with the `--config-file` parameter.

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

# [Kubernetes (preview)](#tab/kubernetes)

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

Before you configure the data flow endpoint, assign a role to the user-assigned managed identity that grants permission to connect to the Kafka broker:

1. In Azure portal, go to the cloud resource you need to grant permissions. For example, go to the Event Grid namespace > **Access control (IAM)** > **Add role assignment**.
1. On the **Role** tab, select an appropriate role.
1. On the **Members** tab, for **Assign access to**, select **Managed identity** option, then select **+ Select members** and search for your user-assigned managed identity.

Then, configure the data flow endpoint with user-assigned managed identity settings.

# [Operations experience](#tab/portal)

In the operations experience data flow endpoint settings page, select the **Basic** tab then choose **Authentication method** > **User assigned managed identity**.

# [Azure CLI](#tab/cli)

#### Create or replace

Use the `az iot ops dataflow endpoint create` command with the `--auth-type` parameter set to `UserAssignedManagedIdentity` for with user-assigned managed identity authentication.

```azurecli
az iot ops dataflow endpoint create <Command> --auth-type UserAssignedManagedIdentity --client-id <ClientId> --tenant-id <TenantId> --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <EndpointName>
```

#### Create or change

Use the `az iot ops dataflow endpoint apply` with the `--config-file` parameter

In this example, assume a configuration file with the following content:

```json
{
    "endpointType": "Kafka",
    "kafkaSettings": {
        "authentication": {
          "method": "UserAssignedManagedIdentity",
          "userAssignedManagedIdentitySettings": {
            "clientId": "<ID>",
            "tenantId": "<ID>",
            // Optional
            "scope": "https://<Scope_Url>"
          }
        }
    }
}
```

# [Bicep](#tab/bicep)

```bicep
kafkaSettings: {
  authentication: {
    method: 'UserAssignedManagedIdentity'
    UserAssignedManagedIdentitySettings: {
      clientId: '<CLIENT_ID>'
      tenantId: '<TENANT_ID>'
      // Optional
      // scope: 'https://<SCOPE_URL>'
    }
  }
  ...
}
```

# [Kubernetes (preview)](#tab/kubernetes)

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

To use SASL for authentication, specify the SASL authentication method and configure SASL type and a secret reference with the name of the secret that contains the SASL token.

Azure Key Vault is the recommended way to sync the connection string to the Kubernetes cluster so that it can be referenced in the data flow. [Secure settings](../deploy-iot-ops/howto-enable-secure-settings.md) must be enabled to configure this endpoint using the operations experience web UI.

# [Operations experience](#tab/portal)

In the operations experience data flow endpoint settings page, select the **Basic** tab then choose **Authentication method** > **SASL**.

Enter the following settings for the endpoint:

| Setting                        | Description                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------- |
| SASL type                      | The type of SASL authentication to use. Supported types are `Plain`, `ScramSha256`, and `ScramSha512`. |
| Synced secret name             | The name of the Kubernetes secret that contains the SASL token.                                   |
| Username reference or token secret | The reference to the username or token secret used for SASL authentication.                     |
| Password reference of token secret | The reference to the password or token secret used for SASL authentication.                     |

# [Azure CLI](#tab/cli)

#### Create or replace

Use the `az iot ops dataflow endpoint create` command with the `--auth-type` parameter set to `Sasl` for SASL authentication.

```azurecli
az iot ops dataflow endpoint create <Command> --auth-type Sasl --sasl-type <SaslType> --secret-name <SecretName> --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <EndpointName>
```

#### Create or change

Use the `az iot ops dataflow endpoint apply` with the `--config-file` parameter

In this example, assume a configuration file with the following content:

```json
{
    "endpointType": "Kafka",
    "kafkaSettings": {
        "authentication": {
          "method": "Sasl",
          "saslSettings": {
            "saslType": "<SaslType>",
            "secretRef": "<SecretName>"
          }
        }
    }
}
```

# [Bicep](#tab/bicep)

```bicep
kafkaSettings: {
  authentication: {
    method: 'Sasl' // Or ScramSha256, ScramSha512
    saslSettings: {
      saslType: 'Plain' // Or ScramSha256, ScramSha512
      secretRef: '<SECRET_NAME>'
    }
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```bash
kubectl create secret generic sasl-secret -n azure-iot-operations \
  --from-literal=token='<YOUR_SASL_TOKEN>'
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

The secret must be in the same namespace as the Kafka data flow endpoint. The secret must have the SASL token as a key-value pair.

## Advanced settings

The advanced settings for this endpoint are identical to the [advanced settings for Azure Event Hubs endpoints](howto-configure-kafka-endpoint.md#advanced-settings).

## Next steps

To learn more about data flows, see [Create a data flow](howto-create-dataflow.md).

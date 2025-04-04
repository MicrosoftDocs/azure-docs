---
title: Configure data flow endpoints for Microsoft Fabric Real-Time Intelligence
description: Learn how to configure data flow endpoints for  Microsoft Fabric Real-Time Intelligence in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 04/03/2025
ai-usage: ai-assisted

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

To configure a data flow endpoint for Microsoft Fabric Real-Time Intelligence, you need to use Simple Authentication and Security Layer (SASL) based authentication.

Azure Key Vault is the recommended way to sync the connection string to the Kubernetes cluster so that it can be referenced in the data flow. [Secure settings](../deploy-iot-ops/howto-enable-secure-settings.md) must be enabled to configure this endpoint using the operations experience web UI.

# [Operations experience](#tab/portal)

1. In the IoT Operations experience portal, select the **Data flow endpoints** tab.
1. Under **Create new data flow endpoint**, select **Microsoft Fabric Real-Time Intelligence** > **New**.


1. Enter the following settings for the endpoint.

    :::image type="content" source="media/howto-configure-fabric-real-time-intelligence/event-stream-sasl.png" alt-text="Screenshot using operations experience to create a new Fabric Real-Time Intelligence data flow endpoint.":::

    | Setting               | Description                                                       |
    | --------------------- | ----------------------------------------------------------------- |
    | Name                  | The name of the data flow endpoint. |
    | Host                  | The hostname of the event stream custom endpoint in the format `*.servicebus.windows.net:9093`. Use the bootstrap server address noted previously. |
    | Authentication method | *SASL* is currently the only supported authentication method. |
    | SASL type             | Choose *Plain* |
    | Synced secret name    | Enter a name for the synced secret. A Kubernetes secret with this name is created on the cluster. |

    Select **Add reference** to create a new or choose an existing Key Vault reference for the username and password references.

    For **Username reference of token secret**, the secret value must be exactly the literal string **$ConnectionString** not an environmentent variable reference.

    :::image type="content" source="media/howto-configure-fabric-real-time-intelligence/username-reference.png" alt-text="Screenshot to create a username reference in Azure Key Vault.":::

    For **Password reference of token secret**, the secret value must be the connection string with the primary key from the event stream custom endpoint.

    :::image type="content" source="media/howto-configure-fabric-real-time-intelligence/password-reference.png" alt-text="Screenshot to create a password reference in Azure Key Vault.":::

1. Select **Apply** to provision the endpoint.

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

## Advanced settings

The advanced settings for this endpoint are identical to the [advanced settings for Azure Event Hubs endpoints](howto-configure-kafka-endpoint.md#advanced-settings).

## Next steps

To learn more about data flows, see [Create a data flow](howto-create-dataflow.md).

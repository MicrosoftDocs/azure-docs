---
title: Configure dataflow endpoints for Microsoft Fabric Real-Time Intelligence
description: Learn how to configure dataflow endpoints for  Microsoft Fabric Real-Time Intelligence in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/30/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure dataflow endpoints for  Microsoft Fabric Real-Time Intelligence in Azure IoT Operations so that I can send real-time data to Microsoft Fabric.
---

# Configure dataflow endpoints for Microsoft Fabric Real-Time Intelligence

To send data to Microsoft Fabric Real-Time Intelligence from Azure IoT Operations, you can configure a dataflow endpoint. This configuration allows you to specify the destination endpoint, authentication method, topic, and other settings.

## Prerequisites

- An [Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md) instance
- [Create a Fabric workspace](/fabric/get-started/create-workspaces). The default *my workspace* isn't supported.
- [Create an Event Stream](/fabric/real-time-intelligence/event-streams/create-manage-an-eventstream#create-an-eventstream)
- [Add a Custom Endpoint as a source](/fabric/real-time-intelligence/event-streams/add-source-custom-app#add-custom-endpoint-data-as-a-source)

> [!NOTE]
> Event Stream supports multiple input sources including Azure Event Hubs. If you have an existing dataflow to Azure Event Hubs, you can bring that into Fabric as shown in the [Quickstart](../get-started-end-to-end-sample/quickstart-get-insights.md#ingest-data-into-real-time-intelligence). This article shows you how to flow real-time data directly into Microsoft Fabric without any other hops in between.

## Retrieve Custom Endpoint connection details
Retrieve the [Kafka-compatible connection details for the Custom Endpoint](/fabric/real-time-intelligence/event-streams/add-source-custom-app#kafka). You need:

:::image type="content" source="media/howto-configure-fabric-real-time-intelligence/event-stream-kafka.png" alt-text="Screenshot in Microsoft Fabric that has the Custom Endpoint connection details.":::

#### Hostname
The bootstrap server address is used for the hostname property in Dataflow endpoint. 

#### Topic name
The event hub name is used as the Kafka topic and is of the form *es_xxxxxxx*.

#### Custom Endpoint connection string
The connection string with the primary key. 


## Create a Microsoft Fabric Real-Time Intelligence dataflow endpoint

To configure a dataflow endpoint for Microsoft Fabric Real-Time Intelligence, you need to use Simple Authentication and Security Layer (SASL) based authentication.

Azure Key Vault is the recommended way to sync the connection string to the Kubernetes cluster so that it can be referenced in the dataflow. [Secure settings](../deploy-iot-ops/howto-enable-secure-settings.md) must be enabled to configure this endpoint using the operations experience Portal.

# [Portal](#tab/portal)

1. In the IoT Operations portal, select the **Dataflow endpoints** tab.
1. Under **Create new dataflow endpoint**, select **Microsoft Fabric Real-Time Intelligence** > **New**.

    :::image type="content" source="media/howto-configure-fabric-real-time-intelligence/event-stream-sasl.png" alt-text="Screenshot using operations experience to create a new Fabric Real-Time Intelligence dataflow endpoint.":::

1. Enter the following settings for the endpoint:

    | Setting               | Description                                                                                       |
    | --------------------- | ------------------------------------------------------------------------------------------------- |
    | Name                  | The name of the dataflow endpoint.                                                              |
    | Host                  | The hostname of the Event Stream Custom Endpoint in the format `*.servicebus.windows.net:9093`. Use the bootstrap server address noted previously. |
    | Authentication method | *SASL* is the currently the only supported authentication method. |
    | SASL type             | Choose *Plain* |
    | Synced secret name    | Name of secret that will be synced to the Kubernetes cluster. You can choose any name. |
    | Username reference of token secret | Create a new or choose an existing Key Vault reference. The secret value must be the literal string *$ConnectionString*. It isn't an environment variable. |
    | Password reference of token secret | Create a new or choose an existing Key Vault reference. The secret value must be the Custom Endpoint connection string noted earlier. |

1. Select **Apply** to provision the endpoint.

# [Bicep](#tab/bicep)

Identical to [SASL instructions for the Event Hubs endpoint](/azure/iot-operations/connect-to-cloud/howto-configure-kafka-endpoint?tabs=bicep#sasl).

# [Kubernetes (preview)](#tab/kubernetes)

Identical to [SASL instructions for the Event Hubs endpoint](/azure/iot-operations/connect-to-cloud/howto-configure-kafka-endpoint?tabs=kubernetes#sasl).

---

## Advanced settings

The advanced settings for this endpoint are identical to the [advanced settings for Azure Event Hubs endpoints](howto-configure-kafka-endpoint.md#advanced-settings).

## Next steps

To learn more about dataflows, see [Create a dataflow](howto-create-dataflow.md).
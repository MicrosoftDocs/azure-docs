---
title: 'Quickstart: Send and receive large messages with Azure Event Hubs (preview)'
description: In this quickstart, you learn how to send and receive large messages with Azure Event Hubs.
ms.topic: quickstart
ms.author: Saglodha
ms.date: 5/6/2024
---

# Quickstart: Send and receive large messages with Azure Event Hubs (preview)

In this quickstart, you learn how to send and receive large messages (up to 20 MB) by using Azure Event Hubs. If you're new to Event Hubs, see [Event Hubs overview](event-hubs-about.md) before you go through this quickstart.

### Prerequisites

To complete this quickstart, you need the following prerequisites:

- An Azure subscription. To use Azure services, including Event Hubs, you need a subscription. If you don't have an existing Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) or use your MSDN subscriber benefits when you [create an account](https://azure.microsoft.com/).
- A [self-serve scalable dedicated cluster](event-hubs-dedicated-cluster-create-portal.md), an event hubs namespace, and an event hub. The first step to meet this prerequisite is to use the Azure portal to create a dedicated cluster and namespace inside a cluster. To create an event hub, see [Quickstart: Create an event hub by using the Azure portal](event-hubs-create.md). You can skip this step if you already have a self-serve scalable dedicated cluster.

> [!NOTE]
> Large message support, currently in public preview, is exclusively available with certain Event Hubs self-serve dedicated clusters. Streaming large messages with these clusters incurs no extra charges.

## Configure an Event Hubs dedicated cluster

To stream large messages, you must configure your self-serve scalable dedicated cluster.

In the Azure portal, go to the **Settings** section for the dedicated cluster. Under **Settings**, select the **Quota** tab.

:::image type="content" source="./media/event-hubs-quickstart-stream-large-messages/large-message-configuration-for-dedicated-cluster.png" alt-text="Screenshot that shows the Quota pane for a dedicated cluster.":::

- Validate that the value for the read-only key `supportslargemessages` is set to `True`.
- You can update the key `eventhubmaxmessagesizeinbytes` to a suitable value in bytes. An acceptable range for this value is between 1,048,576 and 20,971,520 bytes.

After the configuration is saved, you're ready to stream large messages with Event Hubs.

> [!IMPORTANT]
> Large message streaming is only supported with self-serve scalable dedicated clusters built out of the latest infrastructure. This capability is reflected by the `Supportslargemessages` key.
>
> If a cluster value is false, it won't support large message streaming. To enable this feature, you must re-create the cluster.

## Stream large messages with Event Hubs

Event Hubs allows streaming of large messages up to 20 MB, both in batches and as individual publications. The ability to stream large messages or events requires no client code changes apart from the change in the message or event itself. You can continue sending or receiving messages by using any existing Event Hubs SDK or Kafka API to stream large messages to Event Hubs. This way you can stream large messages to Event Hubs in the same manner as you would for messages of sizes less than 1 MB.

For more information, see [Send events to and receive events from Event Hubs by using .NET](event-hubs-dotnet-standard-getstarted-send.md).

> [!TIP]
> Make sure to review any Event Hubs Advanced Message Queuing Protocol (AMQP) client or Kafka client configuration that might limit the maximum message size that you stream into Event Hubs. You must update client timeout to a higher value to stream large messages.
>
>By default, the AMQP client prefetch count is 300. Lower this value to avoid client-side memory issues when you deal with large messages.

For the complete .NET library reference, see the [SDK documentation](/dotnet/api/overview/azure/event-hubs).

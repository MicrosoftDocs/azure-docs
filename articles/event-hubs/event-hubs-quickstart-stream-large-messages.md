---
title: 'Quickstart: Send and Receive Large Messages with Azure Event Hubs (Preview)'
description: In this quickstart, you learn how to send and receive large messages with Azure Event Hubs after you configure an Event Hubs dedicated cluster.
ms.topic: quickstart
ms.author: Saglodha
ms.date: 06/16/2025
#customer intent: As a developer, I want to understand how to send and receive large messages with Azure Event Hubs to support apps that need this ability.
---

# Quickstart: Send and receive large messages with Azure Event Hubs 

In this quickstart, you learn how to send and receive large messages (up to 20 MB) by using Azure Event Hubs. If you're new to Event Hubs, see [Event Hubs overview](event-hubs-about.md) before you begin.

## Prerequisites

- An Azure subscription. To use Azure services, including Event Hubs, you need a subscription. If you don't have an Azure account, you can sign up for a [free trial](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) or activate your [Monthly Azure credits for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF).
- A [self-serve scalable dedicated cluster](event-hubs-dedicated-cluster-create-portal.md), an Event Hubs namespace, and an event hub. Use the Azure portal to create a dedicated cluster and namespace inside a cluster. To create an event hub, see [Quickstart: Create an event hub by using the Azure portal](event-hubs-create.md). You can skip this step if you already have a self-serve scalable dedicated cluster.

## Configure an Event Hubs dedicated cluster

To stream large messages, you must configure your self-serve scalable dedicated cluster.

In the Azure portal, go to the **Settings** section for the dedicated cluster. Under **Settings**, select the **Quota** tab.

:::image type="content" source="./media/event-hubs-quickstart-stream-large-messages/large-message-configuration-for-dedicated-cluster.png" alt-text="Screenshot that shows the Quota pane for a dedicated cluster." lightbox="./media/event-hubs-quickstart-stream-large-messages/large-message-configuration-for-dedicated-cluster.png":::

- Validate that the value for the read-only key `supportslargemessages` is set to `True`.
- You can update the key `eventhubmaxmessagesizeinbytes` to a suitable value in bytes. An acceptable range for this value is between 1,048,576 and 20,971,520 bytes.

After you save the configuration, you're ready to stream large messages with Event Hubs.

> [!IMPORTANT]
> Large message streaming is only supported with self-serve scalable dedicated clusters built out of the latest infrastructure. The `Supportslargemessages` key reflects this capability.
>
> If a cluster value is false, it doesn't support streaming large messages. To enable this feature, you must re-create the cluster. Streaming large messages doesn't incur any extra charges.

## Stream large messages with Event Hubs

Eligible self serve Event hubs dedicated clusters allow streaming of large messages up to 20 MB, both in batches and as individual publications. You can use any existing Event Hubs SDK or Kafka API to stream large messages to Event Hubs. For existing connections, restart clients or re-establish connection to stream large messages.


For more information, see [Send events to and receive events from Event Hubs by using .NET](event-hubs-dotnet-standard-getstarted-send.md).

> [!TIP]
> Make sure to review any Event Hubs Advanced Message Queuing Protocol (AMQP) client or Kafka client configuration that might limit the maximum message size that you stream into Event Hubs. You must update client timeout to a higher value (> 60s) to stream large message , and refine it based on your testing results to meet your workload needs.
>
> By default, the AMQP client prefetch count is 300. Lower this value to avoid client-side memory issues when you deal with large messages.

For the complete SDK reference, see [Azure Event Hubs libraries for .NET](/dotnet/api/overview/azure/event-hubs).

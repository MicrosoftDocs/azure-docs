---
title: 'Quickstart: Send and receive large messages with Azure Event Hubs (Preview)'
description: In this quickstart, you learn how to send and receive large messages with Azure Event Hubs after you configure an Event Hubs dedicated cluster.
ms.topic: quickstart
author: spelluru
ms.author: spelluru
ms.date: 08/25/2026
ai-usage: ai-assisted
#customer intent: As a developer, I want to understand how to send and receive large messages with Azure Event Hubs to support apps that need this ability.
---

# Quickstart: Send and receive large messages with Azure Event Hubs (Preview)

In this quickstart, you learn how to send and receive large messages (up to 20 MB) by using Azure Event Hubs. If you're new to Event Hubs, see [Event Hubs overview](event-hubs-about.md) before you begin.

## Prerequisites

- An Azure subscription. To use Azure services, including Event Hubs, you need a subscription. If you don't have an Azure account, you can sign up for a [free trial](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) or activate your [Monthly Azure credits for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF).
- An [Event Hubs dedicated cluster](event-hubs-dedicated-cluster-create-portal.md) that contains an Event Hubs namespace and an event hub. Use the Azure portal to create the dedicated cluster and the namespace inside the cluster. To create an event hub, see [Create an event hub by using the Azure portal](event-hubs-create.md).

## Configure an Event Hubs dedicated cluster

To stream large messages, configure your dedicated cluster:

1. In the Azure portal, go to your dedicated cluster.
1. Under **Settings**, select the **Quota** tab.

   :::image type="content" source="./media/event-hubs-quickstart-stream-large-messages/large-message-configuration-for-dedicated-cluster.png" alt-text="Screenshot that shows the Quota pane for a dedicated cluster." lightbox="./media/event-hubs-quickstart-stream-large-messages/large-message-configuration-for-dedicated-cluster.png":::

1. Confirm that the read-only key `supportslargemessages` is set to `True`.
1. Update the `eventhubmaxmessagesizeinbytes` key to a suitable value in bytes. The acceptable range is between 1,048,576 and 20,971,520 bytes.
1. Save the configuration. You're now ready to stream large messages with Event Hubs.

> [!IMPORTANT]
> Large message streaming is supported only on dedicated clusters that are built on the latest infrastructure. The `supportslargemessages` key reflects this capability.
>
> If the `supportslargemessages` value is `False`, the cluster doesn't support streaming large messages. To enable the feature, re-create the cluster. Streaming large messages doesn't incur any extra charges.

## Stream large messages with Event Hubs

Eligible Event Hubs dedicated clusters support streaming large messages up to 20 MB, both in batches and as individual publications. You can use any existing Event Hubs SDK or Kafka API to stream large messages to Event Hubs. For existing connections, restart the clients or re-establish the connection to stream large messages.

> [!TIP]
> Review any Event Hubs Advanced Message Queuing Protocol (AMQP) client or Kafka client configuration that might limit the maximum message size that you stream into Event Hubs. Update the client timeout to a higher value (greater than 60 seconds) to stream large messages, and refine it based on your testing results to meet your workload needs.
>
> By default, the AMQP client prefetch count is 300. Lower this value to avoid client-side memory issues when you handle large messages.

## Related content

- [Send events to and receive events from Event Hubs by using .NET](event-hubs-dotnet-standard-getstarted-send.md)
- [Azure Event Hubs libraries for .NET](/dotnet/api/overview/azure/event-hubs)

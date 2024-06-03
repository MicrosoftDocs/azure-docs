---
title: Azure Quickstart - Send and receive large messages with Azure Event Hubs (Preview)
description: In this quickstart, you learn how to send and receive large messages with Azure Event Hubs.
ms.topic: quickstart
ms.author: Saglodha
ms.date: 5/6/2024
---

# QuickStart: Send and receive large messages with Azure Event Hubs (Preview)

In this quickstart, you learn how to send and receive large messages (up to 20 MB) using Azure Event Hubs. If you're new to Azure Event Hubs, see  [Event Hubs overview](event-hubs-about.md) before you go through this quickstart.

### Prerequisites

To complete this QuickStart, you need the following prerequisites: 

- Microsoft Azure subscription. To use Azure services, including Azure Event Hubs, you need a subscription. If you don't have an existing Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) or use your MSDN subscriber benefits when you [create an account](https://azure.microsoft.com/). 

- Create [Self-serve scalable dedicated cluster](event-hubs-dedicated-cluster-create-portal.md), event hubs namespace and an event hub. The first step is to use the Azure portal to create a Dedicated cluster and namespace inside a cluster. To create an event hub, see [QuickStart: Create an event hub using Azure portal. ](event-hubs-create.md). You can skip this step if you already have a self-serve scalable dedicated cluster.

> [!NOTE]
> Large Message Support, currently in Public Preview, is exclusively available with certain Event Hubs self-serve dedicated clusters. Streaming large messages with these clusters incurs no extra charges.

## Configuring Event Hubs Dedicated Cluster

To stream large messages, you must configure your self-serve scalable dedicated cluster. You could follow below steps below:

- On Azure portal, navigate to the ‘Settings’ section for Dedicated cluster and select the ‘Quota’ tab under Settings.
  
:::image type="content" source="./media/event-hubs-quickstart-stream-large-messages/large-message-configuration-for-dedicated-cluster.png" alt-text="Screenshot showing the Quota blade for Dedicated Cluster.":::

- Validate that the value for read-only key **supportslargemessages** is set to true. 
- You could update the key: **eventhubmaxmessagesizeinbytes** to suitable value in bytes. Acceptable range for this value is between 1048576 and 20971520 bytes.

Once the configuration is saved, you're all set to stream Large messages with event hubs.

> [!IMPORTANT]
> Large message streaming is only supported with Self-serve scalable dedicated clusters built out of latest infrastructure. This capability is reflected by the “Supportslargemessages” key.
> If its value is false, the cluster will not support large message streaming. To enable this feature, you must recreate the cluster.

## Streaming Large messages with Azure Event hubs

Azure Event Hubs allows streaming of large messages up to 20 MB, both in batches and as individual publications. Being able to stream large messages or events requires no client code changes apart from the change in message or event itself. You could continue sending/receiving messages using any existing event hubs SDK/ Kafka API to stream large messages to event hub. This allows you to stream large messages to the event hub in the same manner as you would for messages of size less than 1 MB. 
Know more [here](event-hubs-dotnet-standard-getstarted-send.md)


> [!TIP]
> Make sure to review any Event Hubs AMQP client or Kafka client configuration that could be limiting maximum message size that you stream into event hubs.You must update Client timeout to higher value to be able to stream large messages. By default, AMQP client prefetch count is 300. You should lower this value to avoid client side memory issues when dealing with large messages.    

For complete .NET library reference, see our [SDK documentation](/dotnet/api/overview/azure/event-hubs). 


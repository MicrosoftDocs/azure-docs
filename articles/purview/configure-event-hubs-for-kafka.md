---
title: Configure Event Hubs with Microsoft Purview for Atlas Kafka topics
description: Configure Event Hubs to send/receive events to/from Microsoft Purview's Apache Atlas Kafka topics.
ms.topic: how-to
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.devlang: csharp
ms.date: 12/13/2022
ms.custom: mode-other
---

# Configure Event Hubs with Microsoft Purview to send and receive Atlas Kafka topics messages

This article will show you how to configure Microsoft Purview to be able to send and receive *Atlas Kafka* topics events with Azure Event Hubs.

If you have already configured your environment, you can follow [our guide to get started with the **Azure.Messaging.EventHubs** .NET library to send and receive messages.](manage-kafka-dotnet.md)

## Prerequisites

To configure your environment, you need certain prerequisites in place:

- **A Microsoft Azure subscription**. To use Azure services, including Event Hubs, you need an Azure subscription.  If you don't have an Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/) or use your MSDN subscriber benefits when you [create an account](https://azure.microsoft.com).
- An active [Microsoft Purview account](create-catalog-portal.md).
- An [Azure Event Hubs](../event-hubs/event-hubs-create.md) namespace with an Event Hubs.

## Configure Event Hubs

To send or receive Atlas Kafka topics messages, you'll need to configure at least one Event Hubs namespace.

>[!NOTE]
> If your Microsoft Purview account was created before December 15th, 2022 you may have a managed Event Hubs resource already associated with your account.
> You can check in **Managed Resources** under settings on your Microsoft Purview account page in the [Azure portal](https://portal.azure.com).
> :::image type="content" source="media/configure-event-hubs-for-kafka/enable-disable-event-hubs.png" alt-text="Screenshot showing the Event Hubs namespace toggle highlighted on the Managed resources page of the Microsoft Purview account page in the Azure portal.":::
>
> - If you do not see this resource, or it is **disabled**, follow the steps below to configure your Event Hubs.
>
> - If it is **enabled**, you can continue to use this managed Event Hubs namespace if you prefer. (There is associated cost. See see [the pricing page](https://azure.microsoft.com/pricing/details/purview/).) If you want to manage your own Event Hubs account, you must first **disable** this feature and follow the steps below.
> **If you disable the managed Event Hubs resource you won't be able to re-enable a managed Event Hub resource. You will only be able to configure your own Event Hubs**.

## Event Hubs permissions

To authenticate with your Event Hubs, you can either use:

- Microsoft Purview managed identity
- [User assigned managed identity](manage-credentials.md#create-a-user-assigned-managed-identity) - only available when configuring namespaces after account creation.

One of these identities will need **at least contributor permissions on your Event Hubs** to be able to configure them to use with Microsoft Purview.

## Configure Event Hubs to publish messages to Microsoft Purview

1. Navigate to **Kafka configuration** under settings on your Microsoft Purview account page in the [Azure portal](https://portal.azure.com).

    :::image type="content" source="media/configure-event-hubs-for-kafka/select-kafka-configuration.png" alt-text="Screenshot showing the Kafka configuration option in the Microsoft Purview menu in the Azure portal.":::

1. Select **Add configuration** and **Hook configuration**.
    >[!NOTE]
    > You can add as many hook configurations as you need.

    :::image type="content" source="media/configure-event-hubs-for-kafka/add-hook-configuration.png" alt-text="Screenshot showing the Kafka configuration page with add configuration and hook configuration highlighted.":::

1. Give a name to your hook configuration, select your subscription, an existing Event Hubs namespace, an existing Event Hubs to send the notifications to, the consumer group you want to use, and the kind of authentication you would like to use.

    >[!TIP]
    > You can use the same Event Hubs namespace more than once, but each configuration will need its own Event Hubs.

    :::image type="content" source="media/configure-event-hubs-for-kafka/configure-hook-event-hub.png" alt-text="Screenshot showing the hook configuration page, with all values filled in.":::

1. Select **Save**. It will take a couple minutes for your configuration to complete.

1. Once configuration is complete, you can begin the steps to [publish messages to Microsoft Purview](manage-kafka-dotnet.md#publish-messages-to-microsoft-purview).

### Configure Event Hubs to receive messages from Microsoft Purview

1. Navigate to **Kafka configuration** under settings on your Microsoft Purview account page in the [Azure portal](https://portal.azure.com).

    :::image type="content" source="media/configure-event-hubs-for-kafka/select-kafka-configuration.png" alt-text="Screenshot showing the Kafka configuration option in the Microsoft Purview menu in the Azure portal.":::

1. If there's a configuration already listed as type **Notification**, Event Hubs is already configured, and you can begin the steps to [receive Microsoft Purview messages](manage-kafka-dotnet.md#receive-microsoft-purview-messages).
    >[!NOTE]
    > Only one *Notification* Event Hubs can be configured at a time.

    :::image type="content" source="media/configure-event-hubs-for-kafka/type-notification.png" alt-text="Screenshot showing the Kafka configuration option with a notification type configuration ready.":::

1. If there isn't a **Notification** configuration already listed, select **Add configuration** and **Notification configuration**.

    :::image type="content" source="media/configure-event-hubs-for-kafka/add-notification-configuration.png" alt-text="Screenshot showing the Kafka configuration page with add configuration and notification configuration highlighted.":::

1. Give a name to your notification configuration, select your subscription, an existing Event Hubs namespace, an existing Event Hubs to send the notifications to, the partitions you want to use, and the kind of authentication you would like to use.

    >[!TIP]
    > You can use the same Event Hubs namespace more than once, but each configuration will need its own Event Hubs.

    :::image type="content" source="media/configure-event-hubs-for-kafka/configure-notification-event-hub.png" alt-text="Screenshot showing the notification hub configuration page, with all values filled in.":::

1. Select **Save**. It will take a couple minutes for your configuration to complete.

1. Once configuration is complete, you can begin the steps to [receive Microsoft Purview messages](manage-kafka-dotnet.md#receive-microsoft-purview-messages).

## Remove configured Event Hubs

To remove configured Event Hubs namespaces, you can follow these steps:

1. Search for and open your Microsoft Purview account in the [Azure portal](https://portal.azure.com).
1. Select **Kafka configuration** under settings on your Microsoft Purview account page in the Azure portal.
1. Select the Event Hubs you want to disable. (Hook hubs send messages to Microsoft Purview. Notification hubs receive notifications.)
1. Select **Remove** to save the choice and begin the disablement process. This can take several minutes to complete.
    :::image type="content" source="media/configure-event-hubs-for-kafka/select-remove.png" alt-text="Screenshot showing the Kafka configuration page of the Microsoft Purview account page in the Azure portal with the remove button highlighted.":::

## Next steps

- [Publish and process Atlas Kafka topics messages using your Event Hubs](manage-kafka-dotnet.md)
- [Event Hubs samples in GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs/samples)
- [Event processor samples in GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor/samples)
- [An introduction to Atlas notifications](https://atlas.apache.org/2.0.0/Notifications.html)

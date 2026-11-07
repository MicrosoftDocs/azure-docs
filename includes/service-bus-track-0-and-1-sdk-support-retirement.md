---
title: "Retired Azure Service Bus client libraries"
description: "Retirement status and migration guidance for the older Azure Service Bus client libraries and SBMP."
author: egrootenboer
ms.service: azure-service-bus
ms.topic: include
ms.date: 10/06/2026
ms.author: egrootenboer
---

> [!IMPORTANT]
> The Azure Service Bus libraries `WindowsAzure.ServiceBus`, `Microsoft.Azure.ServiceBus`, and `com.microsoft.azure.servicebus` were retired on September 30, 2026. They no longer receive official support or updates from Microsoft. Applications can continue to use these libraries with AMQP, but migrate to a supported library to receive security updates and bug fixes.
>
> For Service Bus, migrate to `Azure.Messaging.ServiceBus` for .NET or `com.azure:azure-messaging-servicebus` for Java. See the migration guides for [WindowsAzure.ServiceBus](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/MigrationGuide_WindowsAzureServiceBus.md), [Microsoft.Azure.ServiceBus](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/MigrationGuide.md), and [com.microsoft.azure:azure-servicebus](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/servicebus/azure-messaging-servicebus/migration-guide.md).
>
> The Service Bus Messaging Protocol (SBMP) was also retired on September 30, 2026. Use AMQP for Service Bus messaging. Support for `WindowsAzure.ServiceBus` with Azure WCF Relay continues until further notice. For details, see the [retirement announcement](https://techcommunity.microsoft.com/blog/messagingonazureblog/some-azure-service-bus-sdk-libraries-will-be-retired-on-30-september-2026%E2%80%94migrat/3917853).
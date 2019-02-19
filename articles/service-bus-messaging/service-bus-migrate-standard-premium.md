---
title: Migrate existing Azure Service Bus Standard Namespaces to Premium tier| Microsoft Docs
description: Guide to allow migration of existing Azure Service Bus Standard Namespaces to Premium
services: service-bus-messaging
documentationcenter: ''
author: axisc
manager: darosa
editor: spelluru

ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/18/2019
ms.author: aschhab
---

# Migrate existing Azure Service Bus Standard Namespaces to Premium tier

Previously, Azure Service Bus offered namespaces only on the Standard tier. These were multi-tenant setups that were optimized for low throughput and developer environments.

In the recent past, Azure Service Bus has expanded to offer the Premium tier which offers dedicated resources per namespace for predictable latency and increased throughput at a fixed price which is optimized for high throughput and production environments requiring additional enterprise features.

The below tooling enables existing Standard tier namespaces to be migrated to the Premium tier.

>[!WARNING]
> Migration is intended for Service Bus Standard namespace to be ***upgraded*** to the Premium tier. 
> 
> The migration tooling ***does not*** support downgrading.

>[!NOTE]
> This migration is meant to happen ***in place***.
> 
> This implies that existing sender and receiver applications don't require any code or configuration change.
>
> The existing connection string will automatically point to the new premium namespace.
>
> Additionally, all entities in the Standard namespace are **copied over** in the Premium namespace during the migration process.

>[!NOTE]
> We support ***1000 entities per Messaging Unit*** on Premium, so to identify how many Messaging Units you need, please start with the number of entities that you have on your current Standard namespace.

## Migration Steps

>[!IMPORTANT]
> There are some caveats associated with the migration process. We request you to fully familiarize yourself with the steps involved to reduce possibilities of errors.

The concrete step by step migration process is detailed in the guides below.

The logical steps involved are -

1. Create a new Premium namespace.
2. Pair the Standard and Premium namespace to each other.
3. Sync (copy-over) entities from Standard to Premium namespace
4. Commit the migration
5. Drain entities in the Standard namespace using the post-migration name of the namespace
6. Delete the Standard namespace

>[!NOTE]
> Once the migration has been committed, it is extremely important to access the old Standard namespace and drain out the queues and subscriptions.
>
> Once the messages have been drained out they may be sent to the new premium namespace to be processed by the receivers
>
> Once the queues and subscriptions have been drained, we recommend deleting the old Standard namespace. You won't be needing it !

### Migrate using CLI/PowerShell Tool

To migrate your Service Bus Standard namespace to Premium using the CLI or PowerShell tool, refer to the below guide.

1. Create a new Service Bus Premium namespace - you can reference the [resource manager templates](service-bus-resource-manager-namespace.md) or [use the portal](service-bus-create-namespace-portal.md), but be sure to pick "Premium" for **serviceBusSku** parameter.

### Migrate using Azure Portal

## FAQs
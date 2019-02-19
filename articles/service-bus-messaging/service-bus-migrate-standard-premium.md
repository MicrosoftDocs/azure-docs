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

2. Set the below environment variables to simplify the migration commands.
   ```
   resourceGroup = <resource group for the standard namespace>
   standardNamespace = <standard namespace to migrate>
   premiumNamespaceArmId = <ARM ID of the Premium namespace to migrate to>
   postMigrationDnsName = <post migration DNS name entry to access the Standard namespace>
   ```

>[!IMPORTANT]
> The Post-migration name (post_migration_dns_name) will be used to access the old Standard namespace post migration. You must use this to drain the queues and the subscriptions and then delete the namespace.

3. **Pair** the Standard and Premium namespaces and **Start Sync** using the below command -

    ```
    az servicebus migration start --resource-group $resourceGroup --name $standardNamespace --target-namespace $premiumNamespaceArmId --post-migration-name $postMigrationDnsName
    ```


4. Check status of the migration using the below command -
    ```
    az servicebus migration show --resource-group $resourceGroup --name $standardNamespace
    ```

    The migration is considered complete when
    1. MigrationState = "Active"
    2. pendingReplicationsOperationsCount = 0
    3. provisioningState = Succeeded
    
    This command also displays the migration configuration. Please double check to ensure that the values are set as previous declared.
    
    Additionally, also check the Premium namespace in the portal to ensure that all the queues and topics have been created, and that they match what existed on the Standard namespace.

5. Commit the migration by executing the Complete command below
   ```
   az servicebus migration complete --resource-group $resourceGroup --name $standardMamespace
   ```

### Migrate using Azure Portal

## FAQs

#### What do I do after the Standard to Premium migration is complete?

#### How much downtime do I expect?

#### Do I have to make any configuration changes while performing the migration?

#### I don't want to have to drain the messages. What do I do?


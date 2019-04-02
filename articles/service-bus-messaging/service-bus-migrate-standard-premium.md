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
>
>
> We support ***1000 entities per Messaging Unit*** on Premium, so to identify how many Messaging Units you need, please start with the number of entities that you have on your current Standard namespace.

## Migration steps

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
> Once the messages have been drained out they may be sent to the new premium namespace to be processed by the receiver applications.
>
> Once the queues and subscriptions have been drained, we recommend deleting the old Standard namespace. You won't be needing it !

### Migrate using Azure CLI or PowerShell

To migrate your Service Bus Standard namespace to Premium using the Azure CLI or PowerShell tool, refer to the below guide.

1. Create a new Service Bus Premium namespace. You can reference the [Azure Resource Manager templates](service-bus-resource-manager-namespace.md) or [use the Azure portal](service-bus-create-namespace-portal.md). Be sure to select "Premium" for the **serviceBusSku** parameter.

2. Set the below environment variables to simplify the migration commands.
   ```
   resourceGroup = <resource group for the standard namespace>
   standardNamespace = <standard namespace to migrate>
   premiumNamespaceArmId = <Azure Resource Manager ID of the Premium namespace to migrate to>
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
    * MigrationState = "Active"
    * pendingReplicationsOperationsCount = 0
    * provisioningState = "Succeeded"

    This command also displays the migration configuration. Please double check to ensure that the values are set as previous declared.

    Additionally, also check the Premium namespace in the portal to ensure that all the queues and topics have been created, and that they match what existed on the Standard namespace.

5. Commit the migration by executing the Complete command below
   ```
   az servicebus migration complete --resource-group $resourceGroup --name $standardNamespace
   ```

### Migrate using Azure portal

Migration through the Azure portal has the same logical flow as migrating using the commands. Refer to the below guide for the step by step process to migrate using the portal.

1. Pick the **'Migrate to Premium'** menu option from the Navigation menu on the left pane. Click the **'Get Started'** button to proceed to the next page.
    ![Migration Landing Page][]

2. Complete **Setup**.
   ![Setup namespace][]
   1. Create and assign the Premium namespace to migrate the existing Standard namespace to.
        ![Setup namespace - create premium namespace][]
   2. Pick the **'Post Migration name'** to access the Standard namespace by after the migration is complete.
        ![Setup namespace - pick post migration name][]
   3. Click **'Next'** to proceed.
3. **Sync** Entities between the Standard and Premium namespace.
    ![Setup namespace - sync entities - start][]

   1. Click **'Start Sync'** to begin syncing the entities.
   2. Click **'Yes'** on the pop-up confirming to start the sync.
   3. Wait until the **Sync** is complete. The status is made available on the status bar.
        ![Setup namespace - sync entities - progress][]
        >[!IMPORTANT]
        > If you need to **Abort** for any reason, please review the abort flow in the FAQ section of this document.
   4. Once the sync is complete, click the **'Next'** button at the bottom of the page.

4. Review changes on the summary page.
    ![Switch namespace - switch menu][]

5. Click on **'Complete Migration'** to switch namespaces and complete the migration.
    ![Switch namespace - success][]

## FAQs

### What happens when the migration is committed?

After the migration is committed, the connection string that pointed to the Standard namespace will point to the Premium namespace.

The sender and receiver applications will disconnect from the Standard Namespace and reconnect to the Premium namespace automatically.

### What do I do after the Standard to Premium migration is complete?

The Standard to Premium migration ensures that the entity metadata (topics, subscriptions, filters, et al.) are copied over from the Standard to Premium namespace. The message data that was committed to the Standard namespace is not copied over from the Standard to Premium namespace.

Due to this, the Standard namespace may have some messages that were sent and committed while the migration was underway. These messages must be manually drained from the Standard Namespace and sent over to the Premium Namespace manually.

To do this, you ***must*** use a console app or script that drain the Standard namespace entities using the **Post Migration DNS name** that you specified in the migration commands and then send these messages on the Premium Namespace, so that they can be processed by the receivers.

Once the messages have been drained, please proceed to delete the Standard namespace.

>[!IMPORTANT]
> Please note that once the messages from the Standard namespace have been drained, you **must** delete the Standard namespace.
>
> This is important because the connection string that initially referred to the Standard namespace now actually refers to the Premium namespace. You won't be needing this Standard Namespace anymore.
>
> Deleting the Standard namespace that you migrated helps reduces the confusion at a later date. 

### How much downtime do I expect?
The migration process described above is meant to reduce the expected downtime for the applications. 
This is done by utilizing the connection string that the sender and receiver applications use to point to the new Premium namespace.

The downtime experienced by the application is limited to the amount of time it takes to update the DNS entry to point to the Premium namespace.

This can be assumed to be ***approximately 5 minutes***.

### Do I have to make any configuration changes while performing the migration?
No, there are no code/configuration changes needed to perform this migration. The connection string that sender and receiver applications use to access the Standard Namespace is automatically mapped to act as an **alias** for the Premium Namespace.

### What happens when I abort the migration?
Migration can be aborted either by using the 'Abort' command or via the Azure portal. 

#### Azure CLI or PowerShell

    az servicebus migration abort --resource-group $resourceGroup --name $standardNamespace

#### Azure portal

![Abort flow - abort sync][]
![Abort flow - abort complete][]

When the migration process is aborted, it actually aborts the process of copying over the entities(topics, subscriptions, and filters) from Standard to Premium namespace and breaks the pairing.

The connection string **is not** updated to point to the Premium namespace. Your existing applications continue to work as they did before you started the migration.

However, it **does not** delete the entities on the Premium namespace or delete the Premium namespace itself. This has to be done manually if you had decided to not move forward with the migration after all.

>[!IMPORTANT]
> If you decide to abort the migration, please delete the Premium Namespace that you had provisioned for the migration, so that you are not charged for the resources.

#### I don't want to have to drain the messages. What do I do?

There may be messages that are sent by the sender applications and committed to the storage on the Standard Namespace while the migration is taking place, and right before the migration is committed.

Given that during migration, the actual message data/payload is not copied over from Standard to Premium, these have to be manually drained and then sent to the Premium namespace.

However, if you can migrate during a planned maintenance/housekeeping window and don't want to manually drain and send the messages, please follow the below steps -

1. Stop the sender applications, and allow the receivers to process the messages that are currently in the Standard namespace and drain the queue.
2. Once the queues and subscriptions in the Standard Namespace are empty, follow the procedure described above to execute the migration from Standard to Premium namespace.
3. Once the migration is complete, you can restart the sender applications.
4. The senders and receivers will now automatically connect with the Premium namespace.

    >[!NOTE]
    > The receiver need not be stopped for the migration.
    >
    > Once the migration is complete, the receivers will disconnect from the Standard namespace and automatically connect to the Premium namespace.

## Next steps

* Learn more about the [differences between Standard and Premium Messaging](./service-bus-premium-messaging.md)
* Learn about the High-Availability and Geo-Diaster recovery aspects for Service Bus Premium [here](service-bus-outages-disasters.md#protecting-against-outages-and-disasters---service-bus-premium)

[Migration Landing Page]: ./media/service-bus-standard-premium-migration/1.png
[Setup namespace]: ./media/service-bus-standard-premium-migration/2.png
[Setup namespace - create premium namespace]: ./media/service-bus-standard-premium-migration/3.png
[Setup namespace - pick post migration name]: ./media/service-bus-standard-premium-migration/4.png
[Setup namespace - sync entities - start]: ./media/service-bus-standard-premium-migration/5.png
[Setup namespace - sync entities - progress]: ./media/service-bus-standard-premium-migration/8.png
[Switch namespace - switch menu]: ./media/service-bus-standard-premium-migration/9.png
[Switch namespace - success]: ./media/service-bus-standard-premium-migration/12.png

[Abort flow - abort sync]: ./media/service-bus-standard-premium-migration/abort1.png
[Abort flow - abort complete]: ./media/service-bus-standard-premium-migration/abort3.png

---
title: Migrate existing Azure Service Bus Standard namespaces to the Premium tier| Microsoft Docs
description: Guide to allow migration of existing Azure Service Bus Standard namespaces to Premium
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

# Migrate existing Azure Service Bus Standard namespaces to the Premium tier

Previously, Azure Service Bus offered namespaces only on the Standard tier. Namespaces are multi-tenant setups that are optimized for low throughput and developer environments. The Premium tier offers dedicated resources per namespace for predictable latency and increased throughput at a fixed price. The Premium tier is optimized for high throughput and production environments that require additional enterprise features.

This article describes how to migrate existing Standard tier namespaces to the Premium tier.

>[!WARNING]
> Migration is intended for Service Bus Standard namespaces to be upgraded to the Premium tier. The migration tool does not support downgrading.

>[!NOTE]
> This migration is meant to happen in place, meaning that existing sender and receiver applications don't require any changes to code or configuration. The existing connection string will automatically point to the new premium namespace. Additionally, all entities in the Standard namespace are copied to the Premium namespace during the migration process.
>
> Migration supports 1,000 entities per messaging unit on the Premium tier. To identify how many messaging units you need, start with the number of entities that you have on your current Standard namespace.

## Migration steps

>[!IMPORTANT]
> Some conditions are associated with the migration process. Familiarize yourself with the following steps to reduce the possibility of errors.

The following steps outline the migration process, and the step-by-step details are listed in the sections that follow.

1. Create a new Premium namespace.
1. Pair the Standard and Premium namespaces to each other.
1. Sync (copy-over) entities from the Standard to the Premium namespace.
1. Commit the migration.
1. Drain entities in the Standard namespace by using the post-migration name of the namespace.
1. Delete the Standard namespace.

>[!NOTE]
> After the migration has been committed, it is important to access the old Standard namespace and drain the queues and subscriptions. After the messages have been drained, they may be sent to the new premium namespace to be processed by the receiver applications. After the queues and subscriptions have been drained, we recommend that you delete the old Standard namespace.

### Migrate by using the Azure CLI or PowerShell

To migrate your Service Bus Standard namespace to Premium by using the Azure CLI or PowerShell tool, follow these steps.

1. Create a new Service Bus Premium namespace. You can reference the [Azure Resource Manager templates](service-bus-resource-manager-namespace.md) or [use the Azure portal](service-bus-create-namespace-portal.md). Be sure to select **Premium** for the **serviceBusSku** parameter.

1. Set the following environment variables to simplify the migration commands.
   ```
   resourceGroup = <resource group for the standard namespace>
   standardNamespace = <standard namespace to migrate>
   premiumNamespaceArmId = <Azure Resource Manager ID of the Premium namespace to migrate to>
   postMigrationDnsName = <post migration DNS name entry to access the Standard namespace>
   ```

    >[!IMPORTANT]
    > The Post-migration name (post_migration_dns_name) will be used to access the old Standard namespace post migration. Use this to drain the queues and the subscriptions, and then delete the namespace.

1. Pair the Standard and Premium namespaces and start the sync by using the following command:

    ```
    az servicebus migration start --resource-group $resourceGroup --name $standardNamespace --target-namespace $premiumNamespaceArmId --post-migration-name $postMigrationDnsName
    ```


1. Check the status of the migration by using the following command:
    ```
    az servicebus migration show --resource-group $resourceGroup --name $standardNamespace
    ```

    The migration is considered complete when you see the following values:
    * MigrationState = "Active"
    * pendingReplicationsOperationsCount = 0
    * provisioningState = "Succeeded"

    This command also displays the migration configuration. Check to ensure the values are set correctly. Also check the Premium namespace in the portal to ensure that all the queues and topics have been created, and that they match what existed in the Standard namespace.

1. Commit the migration by executing the following complete command:
   ```
   az servicebus migration complete --resource-group $resourceGroup --name $standardNamespace
   ```

### Migrate by using the Azure portal

Migration by using the Azure portal has the same logical flow as migrating by using the commands. Follow these steps to migrate by using the Azure portal.

1. On the **Navigation** menu in the left pane, select **Migrate to premium**. Click the **Get Started** button to continue to the next page.
    ![Migration Landing Page][]

1. Complete **Setup**.
   ![Setup namespace][]
   1. Create and assign the Premium namespace to migrate the existing Standard namespace to.
        ![Setup namespace - create premium namespace][]
   1. Choose a **Post Migration name**. You'll use this name to access the Standard namespace after the migration is complete.
        ![Setup namespace - pick post migration name][]
   1. Select **'Next'** to continue.
1. Sync entities between the Standard and Premium namespaces.
    ![Setup namespace - sync entities - start][]

   1. Select **Start Sync** to begin syncing the entities.
   1. Select **Yes** in the dialog box to confirm and start the sync.
   1. Wait until the sync is complete. The status is available on the status bar.
        ![Setup namespace - sync entities - progress][]
        >[!IMPORTANT]
        > If you need to abort the migration for any reason, please review the abort flow in the FAQ section of this document.
   1. After the sync is complete, select **Next** at the bottom of the page.

1. Review changes on the summary page. Select **Complete Migration** to switch namespaces and to complete the migration.
    ![Switch namespace - switch menu][]
    The confirmation page appears when the migration is complete.
    ![Switch namespace - success][]

## FAQs

### What happens when the migration is committed?

After the migration is committed, the connection string that pointed to the Standard namespace will point to the Premium namespace.

The sender and receiver applications will disconnect from the Standard Namespace and reconnect to the Premium namespace automatically.

### What do I do after the Standard to Premium migration is complete?

The Standard to Premium migration ensures that the entity metadata such as topics, subscriptions, and filters are copied from the Standard namespace to the Premium namespace. The message data that was committed to the Standard namespace is not copied from the Standard namespace to the Premium namespace.

The Standard namespace may have some messages that were sent and committed while the migration was underway. Manually drain these messages from the Standard Namespace and manually send them to the Premium Namespace. To manually drain the messages, use a console app or a script that drains the Standard namespace entities by using the Post Migration DNS name that you specified in the migration commands. Send these messages to the Premium namespace so that they can be processed by the receivers.

After the messages have been drained, delete the Standard namespace.

>[!IMPORTANT]
> After the messages from the Standard namespace have been drained, delete the Standard namespace. This is important because the connection string that initially referred to the Standard namespace now refers to the Premium namespace. You won't need the Standard Namespace anymore. Deleting the Standard namespace that you migrated helps reduce later confusion.

### How much downtime do I expect?
The migration process is meant to reduce the expected downtime for the applications. Downtime is reduced by utilizing the connection string that the sender and receiver applications use to point to the new Premium namespace.

The downtime that is experienced by the application is limited to the time it takes to update the DNS entry to point to the Premium namespace. Downtime is approximately 5 minutes.

### Do I have to make any configuration changes while performing the migration?
No, there are no code or configuration changes needed to perform the migration. The connection string that sender and receiver applications use to access the Standard Namespace is automatically mapped to act as an alias for the Premium namespace.

### What happens when I abort the migration?
The migration can be aborted either by using the `Abort` command or by using the Azure portal. 

#### The Azure CLI or PowerShell

    az servicebus migration abort --resource-group $resourceGroup --name $standardNamespace

#### Azure portal

![Abort flow - abort sync][]
![Abort flow - abort complete][]

When the migration process is aborted, it aborts the process of copying the entities (topics, subscriptions, and filters) from the Standard to the Premium namespace and breaks the pairing.

The connection string is not updated to point to the Premium namespace. Your existing applications continue to work as they did before you started the migration.

However, it doesn't delete the entities on the Premium namespace or delete the Premium namespace. Delete the entities manually if you decided not to move forward with the migration.

>[!IMPORTANT]
> If you decide to abort the migration, delete the Premium Namespace that you had provisioned for the migration so that you are not charged for the resources.

#### I don't want to have to drain the messages. What do I do?

There may be messages that are sent by the sender applications and committed to the storage on the Standard Namespace while the migration is taking place and just before the migration is committed.

During migration, the actual message data/payload is not copied from the Standard to the Premium namespace. The messages have to be manually drained and then sent to the Premium namespace.

However, if you can migrate during a planned maintenance/housekeeping window, and you don't want to manually drain and send the messages, follow these steps:

1. Stop the sender applications. The receiver applications will process the messages that are currently in the Standard namespace and will drain the queue.
1. After the queues and subscriptions in the Standard Namespace are empty, follow the procedure that is described earlier to execute the migration from the Standard to the Premium namespace.
1. After the migration is complete, you can restart the sender applications.
1. The senders and receivers will now automatically connect with the Premium namespace.

    >[!NOTE]
    > You do not have to stop the receiver applications for the migration.
    >
    > After the migration is complete, the receiver applications will disconnect from the Standard namespace and automatically connect to the Premium namespace.

## Next steps

* Learn more about the [differences between Standard and Premium Messaging](./service-bus-premium-messaging.md).
* Learn about the [High-Availability and Geo-Disaster recovery aspects for Service Bus Premium](service-bus-outages-disasters.md#protecting-against-outages-and-disasters---service-bus-premium).

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

---
title: Migrate existing Azure Service Bus standard namespaces to the premium tier| Microsoft Docs
description: Guide to allow migration of existing Azure Service Bus standard namespaces to premium
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
ms.date: 05/18/2019
ms.author: aschhab
---

# Migrate existing Azure Service Bus standard namespaces to the premium tier
Previously, Azure Service Bus offered namespaces only on the standard tier. Namespaces are multi-tenant setups that are optimized for low throughput and developer environments. The premium tier offers dedicated resources per namespace for predictable latency and increased throughput at a fixed price. The premium tier is optimized for high throughput and production environments that require additional enterprise features.

This article describes how to migrate existing standard tier namespaces to the premium tier.  

>[!WARNING]
> Migration is intended for Service Bus standard namespaces to be upgraded to the premium tier. The migration tool does not support downgrading.

Some of the points to note: 
- This migration is meant to happen in place, meaning that existing sender and receiver applications **don't require any changes to code or configuration**. The existing connection string will automatically point to the new premium namespace.
- The **premium** namespace should have **no entities** in it for the migration to succeed. 
- All **entities** in the standard namespace are **copied** to the premium namespace during the migration process. 
- Migration supports **1,000 entities per messaging unit** on the premium tier. To identify how many messaging units you need, start with the number of entities that you have on your current standard namespace. 
- You can't directly migrate from **basic tier** to **premier tier**, but you can do so indirectly by migrating from basic to standard first and then from the standard to premium in the next step.

## Migration steps
Some conditions are associated with the migration process. Familiarize yourself with the following steps to reduce the possibility of errors. These steps outline the migration process, and the step-by-step details are listed in the sections that follow.

1. Create a new premium namespace.
1. Pair the standard and premium namespaces to each other.
1. Sync (copy-over) entities from the standard to the premium namespace.
1. Commit the migration.
1. Drain entities in the standard namespace by using the post-migration name of the namespace.
1. Delete the standard namespace.

>[!IMPORTANT]
> After the migration has been committed, access the old standard namespace and drain the queues and subscriptions. After the messages have been drained, they may be sent to the new premium namespace to be processed by the receiver applications. After the queues and subscriptions have been drained, we recommend that you delete the old standard namespace.

### Migrate by using the Azure CLI or PowerShell

To migrate your Service Bus standard namespace to premium by using the Azure CLI or PowerShell tool, follow these steps.

1. Create a new Service Bus premium namespace. You can reference the [Azure Resource Manager templates](service-bus-resource-manager-namespace.md) or [use the Azure portal](service-bus-create-namespace-portal.md). Be sure to select **premium** for the **serviceBusSku** parameter.

1. Set the following environment variables to simplify the migration commands.
   ```azurecli
   resourceGroup = <resource group for the standard namespace>
   standardNamespace = <standard namespace to migrate>
   premiumNamespaceArmId = <Azure Resource Manager ID of the premium namespace to migrate to>
   postMigrationDnsName = <post migration DNS name entry to access the standard namespace>
   ```

    >[!IMPORTANT]
    > The Post-migration alias/name (post_migration_dns_name) will be used to access the old standard namespace post migration. Use this to drain the queues and the subscriptions, and then delete the namespace.

1. Pair the standard and premium namespaces and start the sync by using the following command:

    ```azurecli
    az servicebus migration start --resource-group $resourceGroup --name $standardNamespace --target-namespace $premiumNamespaceArmId --post-migration-name $postMigrationDnsName
    ```


1. Check the status of the migration by using the following command:
    ```azurecli
    az servicebus migration show --resource-group $resourceGroup --name $standardNamespace
    ```

    The migration is considered complete when you see the following values:
    * MigrationState = "Active"
    * pendingReplicationsOperationsCount = 0
    * provisioningState = "Succeeded"

    This command also displays the migration configuration. Check to ensure the values are set correctly. Also check the premium namespace in the portal to ensure all the queues and topics have been created, and that they match what existed in the standard namespace.

1. Commit the migration by executing the following complete command:
   ```azurecli
   az servicebus migration complete --resource-group $resourceGroup --name $standardNamespace
   ```

### Migrate by using the Azure portal

Migration by using the Azure portal has the same logical flow as migrating by using the commands. Follow these steps to migrate by using the Azure portal.

1. On the **Navigation** menu in the left pane, select **Migrate to premium**. Click the **Get Started** button to continue to the next page.
    ![Migration Landing Page][]

1. Complete **Setup**.
   ![Setup namespace][]
   1. Create and assign the premium namespace to migrate the existing standard namespace to.
        ![Setup namespace - create premium namespace][]
   1. Choose a **Post Migration name**. You'll use this name to access the standard namespace after the migration is complete.
        ![Setup namespace - pick post migration name][]
   1. Select **'Next'** to continue.
1. Sync entities between the standard and premium namespaces.
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

## Caveats

Some of the features provided by Azure Service Bus Standard tier are not supported by Azure Service Bus Premium tier. These are by design since the premium tier offers dedicated resources for predictable throughput and latency.

Here is a list of features not supported by Premium and their mitigation - 

### Express entities

   Express entities that don't commit any message data to storage are not supported in Premium. Dedicated resources provided significant throughput improvement while ensuring that data is persisted, as is expected from any enterprise messaging system.
   
   During migration, any of your express entities in your Standard namespace will be created on the Premium namespace as a non-express entity.
   
   If you utilize Azure Resource Manager (ARM) templates, please ensure that you remove the 'enableExpress' flag from the deployment configuration so that your automated workflows execute without errors.

### Partitioned entities

   Partitioned entities were supported in the Standard tier to provide better availablility in a multi-tenant setup. With the provision of dedicated resources available per namespace in the Premium tier, this is no longer needed.
   
   During migration, any partitioned entity in the Standard namespace is created on the Premium namespace as a non-partitioned entity.
   
   If your ARM template sets 'enablePartitioning' to 'true' for a specific Queue or Topic, then it will be ignored by the broker.

## FAQs

### What happens when the migration is committed?

After the migration is committed, the connection string that pointed to the standard namespace will point to the premium namespace.

The sender and receiver applications will disconnect from the standard Namespace and reconnect to the premium namespace automatically.

### What do I do after the standard to premium migration is complete?

The standard to premium migration ensures that the entity metadata such as topics, subscriptions, and filters are copied from the standard namespace to the premium namespace. The message data that was committed to the standard namespace isn't copied from the standard namespace to the premium namespace.

The standard namespace may have some messages that were sent and committed while the migration was underway. Manually drain these messages from the standard Namespace and manually send them to the premium Namespace. To manually drain the messages, use a console app or a script that drains the standard namespace entities by using the Post Migration DNS name that you specified in the migration commands. Send these messages to the premium namespace so that they can be processed by the receivers.

After the messages have been drained, delete the standard namespace.

>[!IMPORTANT]
> After the messages from the standard namespace have been drained, delete the standard namespace. This is important because the connection string that initially referred to the standard namespace now refers to the premium namespace. You won't need the standard Namespace anymore. Deleting the standard namespace that you migrated helps reduce later confusion.

### How much downtime do I expect?
The migration process is meant to reduce the expected downtime for the applications. Downtime is reduced by using the connection string that the sender and receiver applications use to point to the new premium namespace.

The downtime that is experienced by the application is limited to the time it takes to update the DNS entry to point to the premium namespace. Downtime is approximately 5 minutes.

### Do I have to make any configuration changes while doing the migration?
No, there are no code or configuration changes needed to do the migration. The connection string that sender and receiver applications use to access the standard Namespace is automatically mapped to act as an alias for the premium namespace.

### What happens when I abort the migration?
The migration can be aborted either by using the `Abort` command or by using the Azure portal. 

#### Azure CLI

```azurecli
az servicebus migration abort --resource-group $resourceGroup --name $standardNamespace
```

#### Azure portal

![Abort flow - abort sync][]
![Abort flow - abort complete][]

When the migration process is aborted, it aborts the process of copying the entities (topics, subscriptions, and filters) from the standard to the premium namespace and breaks the pairing.

The connection string isn't updated to point to the premium namespace. Your existing applications continue to work as they did before you started the migration.

However, it doesn't delete the entities on the premium namespace or delete the premium namespace. Delete the entities manually if you decided not to move forward with the migration.

>[!IMPORTANT]
> If you decide to abort the migration, delete the premium Namespace that you had provisioned for the migration so that you are not charged for the resources.

#### I don't want to have to drain the messages. What do I do?

There may be messages that are sent by the sender applications and committed to the storage on the standard Namespace while the migration is taking place and just before the migration is committed.

During migration, the actual message data/payload isn't copied from the standard to the premium namespace. The messages have to be manually drained and then sent to the premium namespace.

However, if you can migrate during a planned maintenance/housekeeping window, and you don't want to manually drain and send the messages, follow these steps:

1. Stop the sender applications. The receiver applications will process the messages that are currently in the standard namespace and will drain the queue.
1. After the queues and subscriptions in the standard Namespace are empty, follow the procedure that is described earlier to execute the migration from the standard to the premium namespace.
1. After the migration is complete, you can restart the sender applications.
1. The senders and receivers will now automatically connect with the premium namespace.

    >[!NOTE]
    > You do not have to stop the receiver applications for the migration.
    >
    > After the migration is complete, the receiver applications will disconnect from the standard namespace and automatically connect to the premium namespace.

## Next steps

* Learn more about the [differences between standard and premium Messaging](./service-bus-premium-messaging.md).
* Learn about the [High-Availability and Geo-Disaster recovery aspects for Service Bus premium](service-bus-outages-disasters.md#protecting-against-outages-and-disasters---service-bus-premium).

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

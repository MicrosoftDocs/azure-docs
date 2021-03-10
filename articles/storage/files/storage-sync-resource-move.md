---
title: Azure File Sync resource moves and topology changes
description: Learn how to move sync resources across resource groups, subscriptions and AAD tenants.
author: fauhse
ms.service: storage
ms.topic: how-to
ms.date: 3/10/2021
ms.author: fauhse
ms.subservice: files
---

# Move Azure File Sync resources to a different resource group, subscription or AAD tenant

This article describes how to make changes to resource group, subscription, or Azure Active Directory tenant for your Azure File Sync cloud resources as well as your Azure storage accounts.

When planning to make changes to the Azure File Sync cloud resources, it's important to consider the storage resources at the same time. The following resources exist:

**Azure File Sync resources (in hierarchical order)**

* :::image type="icon" source="media/storage-sync-resource-move/storage-sync-resource-move-storage-sync-service.png" border="false"::: Storage Sync Service
  * :::image type="icon" source="media/storage-sync-resource-move/storage-sync-resource-move-registered-servers.png" border="false"::: Registered server
  * :::image type="icon" source="media/storage-sync-resource-move/storage-sync-resource-move-sync-group.png" border="false"::: Sync group
    * :::image type="icon" source="media/storage-sync-resource-move/storage-sync-resource-move-cloud-endpoint.png" border="false"::: Cloud endpoint
    * :::image type="icon" source="media/storage-sync-resource-move/storage-sync-resource-move-server-endpoint.png" border="false"::: Server endpoint

In Azure File Sync, the only resource capable of moving is the Storage Sync Service resource. Any sub-resources are bound to it's parent and cannot move to another Storage Sync Service.

**Azure storage resources (in hierarchical order)**

* :::image type="icon" source="media/storage-sync-resource-move/storage-sync-resource-move-storage-account.png" border="false"::: Storage account
    * :::image type="icon" source="media/storage-sync-resource-move/storage-sync-resource-move-file-share.png" border="false"::: File share

In Azure Storage, the only resource capable of moving is the storage account. An Azure file share, as a sub-resource, cannot move to a different storage account.

## Supported combinations

When planning a resource move, storage account and the top-level Azure File Sync resource, called the *Storage Sync Service*, need to be considered together.

As a best practice, the Storage Sync Service and the storage accounts that have syncing file shares, should always reside in the same subscription. These combinations are supported:

* Storage Sync Service and storage accounts are located in **different resource groups** (same Azure tenant)
* Storage Sync Service and storage accounts are located in **different subscriptions** (same Azure tenant)

> [!IMPORTANT]
> Through different combinations of moves, a Storage Sync Service and storage accounts can end up in different subscriptions, governed by different AAD tenants. Sync would even appear to be working, but this is not a supported configuration. Sync can stop in the future with no ability to get back into a working condition.

When planning your resource move, there are different considerations for [moving within the same AAD tenant](#move-within-the-same-azure-active-directory-tenant) and moving across [to a different AAD tenant](#move-to-a-new-azure-active-directory-tenant). When moving AAD tenants, always move sync and storage resources together.

### Move within the same Azure Active Directory tenant

:::row:::
    :::column:::
        :::image type="content" source="media/storage-sync-resource-move/storage-sync-resource-move-small.png" alt-text="An image showing the Azure portal for a Storage Sync Service resource, with the Move command expanded. It shows the resource group move and subscription move options." lightbox="media/storage-sync-resource-move/storage-sync-resource-move.png":::
    :::column-end:::
    :::column:::
        A convenient way to move a Storage Sync Service resource is to use the Azure portal. Navigate to the Storage Sync Service you want to move and select **Move** from the command bar. The same steps apply to moving a storage account. You can also move all resources in a resource group this way. Moving an entire resource group is recommended when you have the Storage Sync Service and all it's used storage accounts in this resource group.
    :::column-end:::
:::row-end:::

> [!WARNING]
> When you move a storage account resource, sync will stop immediately. You have to manually authorize sync to access the storage account in the new subscription. The [Azure File Sync storage access authorization](#azure-file-sync-storage-access-authorization) section will provide the necessary steps.

### Move to a new Azure Active Directory tenant

Individual resources like a Storage Sync Service or storage accounts, cannot move by themselves to a different AAD tenant. Only Azure subscriptions can move AAD tenants. Think about your subscription structure in the new AAD tenant. You can use a dedicated subscription for Azure File Sync. 

1. Create an Azure subscription (or determine an existing one in the old tenant that should move.
1. [perform a subscription move within the same AAD tenant](#move-within-the-same-azure-active-directory-tenant) of your Storage Sync Service(s) and all associated storage accounts into the subscription from the previous step. Sync will stop. Plan to also follow the next step immediately to restore sync's ability to access the storage accounts that moved.
1. You now need to fix Azure File Sync's ability to access the storage account. Follow the steps in the [Azure File Sync storage access authorization section](#azure-file-sync-storage-access-authorization).

You now have sequestered all related Azure File Sync resources into their own subscription. You are now ready to move the entre subscription to the target AAD tenant.

Depending on when your subscription was created, the Azure File 










## Azure File Sync storage access authorization

When storage accounts are moved to either a new subscription or are moved within a subscription to a new Azure Active Directory (AAD) tenant, sync will stop. Role based access (RBAC) is used to authorize Azure File Sync to access a storage account and these role assignments are not migrated with the resources.

### Azure File Sync service principal

:::row:::
    :::column:::
        :::image type="content" source="media/storage-sync-resource-move/storage-sync-resource-move-afs-rp-registered-small.png" alt-text="An image showing the Azure portal, subscription management, registered resource providers." lightbox="media/storage-sync-resource-move/storage-sync-resource-move-afs-rp-registered.png":::
    :::column-end:::
    :::column:::
        The Azure File Sync service principal must exist in your AAD tenant before you can authorize sync access to a storage account. </br></br> When you create a new Azure subscription today, the Azure File Sync resource provider *Microsoft.StorageSync* is automatically registered with your subscription. This will make a *service principal* for sync available in the Azure Active Directory tenant that governs the subscription. A service principal is similar to a user account in your AAD. You can use the Azure File Sync service principal to authorize access to resources via role based access control (RBAC). The only resource sync needs access to is your storage accounts containing the file share that are supposed to sync. The built-in role it needs to be assigned to is called **Reader and Data access**. </br></br> This assignment is done automatically through the user context of the logged on user when you add a file share to a sync group, or in other words, you create a cloud endpoint. When a storage account moves to a new subscription or AAD tenant, this role assignment is lost and [must be manually reestablished](#establish-sync-access-to-a-storage-account).
    :::column-end:::
:::row-end:::


> [!IMPORTANT]
> If the target Azure subscription wasn't recently created, check that the *Microsoft.StorageSync* resource provider is registered with the subscription. If it isn't, manually add it on the same portal blade.

### Establish sync access to a storage account

You need to use the [Azure File Sync service principal](#azure-file-sync-service-principal) to authorize access to a storage account via role based access control (RBAC). The built-in role on the storage account the service principal needs to be assigned to is called **Reader and Data access**. 

This assignment is typically done automatically through the user context of the logged on user when you add a file share to a sync group, or in other words, you create a cloud endpoint. However, when a storage account moves to a new subscription or AAD tenant, this role assignment is lost and must be manually reestablished.

|   |   |
|---------|---------|
|:::image type="content" source="media/storage-sync-resource-move/storage-sync-resource-move-assign-rbac.png" alt-text="An image displaying the Microsoft.StorageSync service principal assigned to the Reader and Data access role on a storage account":::  | In the Azure portal, navigate to the storage account you need to reauthorize sync access to. <ol><li>Select **Access control (IAM)** on the left-hand table of contents.</li><li>Select the Role assignments tab to the list the users and applications (service principals) that have access to your storage account.</li><li>Select **Add**</li><li>In the **Role field**, select **Reader and Data Access**.</li><li>In the **Select field**, type *Microsoft.StorageSync*, select the role and click **Save**.</li></ol> |

## Move to a different Azure region

The Azure File Sync resource *Storage Sync Service* and the storage accounts that contain file shares that are syncing, have an Azure region they are deployed in. You determine that region when you create a resource. The region of the Storage Sync Service and storage account resources must match. These regions cannot be changed on either resource type after their creation.

Assigning a different region to a resource is different from a [region fail-over](#region-fail-over), which can be supported, depending on your storage account redundancy setting.

## Region fail-over

[Azure storage offers geo-redundancy options](../common/storage-redundancy.md#geo-redundant-storage) for a storage account. These redundancy options are generally discouraged for storage accounts used with Azure File Sync. The main reason is that replication between geographically distant regions is not performed by Azure File Sync, but by a storage replication technology built-in to the storage subsystem in Azure. It cannot have an understanding of application state and Azure File Sync is an application with files syncing to and from Azure file shares at all times. If you opt for any of these geographically disbursed storage redundancy options, you will not lose all of your data in the event of a large-scale disaster but you need to [anticipate data loss](../common/storage-disaster-recovery-guidance.md#anticipate-data-loss). 

> [!CAUTION]
> Fail-over is never an appropriate substitute to provisioning your resources in the correct Azure region. If your resources are in the "wrong" region, you need to consider stopping sync and set up sync again to new Azure file shares that are deployed in your desired region.

A regional fail-over is typically designed to be started by Microsoft in the event of a catastrophic event that will render data centers in an Azure region incapacitated for an extended period of time. In some cases, the definition of downtime a business can sustain is less than the time Microsoft is prepared to let pass before starting a regional fail-over. In these cases, [fail-overs can also be initiated by customers](../common/storage-initiate-account-failover.md).

> [!IMPORTANT]
> In the event of a fail-over, you need to file a support ticket for your impacted Storage Sync Services to get sync operational again.

## See also

- [Overview of Azure file share and sync migration guides](storage-files-migration-overview.md)
- [Troubleshoot Azure File Sync](storage-sync-files-troubleshoot.md)
- [Plan for an Azure File Sync deployment](storage-sync-files-planning.md)

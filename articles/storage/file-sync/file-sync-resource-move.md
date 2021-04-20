---
title: Azure File Sync resource moves and topology changes
description: Learn how to move sync resources across resource groups, subscriptions, and Azure Active Directory (AAD) tenants.
author: fauhse
ms.service: storage
ms.topic: how-to
ms.date: 04/13/2021
ms.author: fauhse
ms.subservice: files
---

# Move Azure File Sync resources to a different resource group, subscription, or AAD tenant

This article describes how to make changes to resource group, subscription, or Azure Active Directory (AAD) tenant for your Azure File Sync cloud resources and Azure storage accounts.

When planning to make changes to the Azure File Sync cloud resources, it's important to consider the storage resources at the same time. The following resources exist:

**Azure File Sync resources (in hierarchical order)**

* :::image type="icon" source="media/storage-sync-resource-move/storage-sync-resource-move-storage-sync-service.png" border="false"::: Storage Sync Service
  * :::image type="icon" source="media/storage-sync-resource-move/storage-sync-resource-move-registered-servers.png" border="false"::: Registered server
  * :::image type="icon" source="media/storage-sync-resource-move/storage-sync-resource-move-sync-group.png" border="false"::: Sync group
    * :::image type="icon" source="media/storage-sync-resource-move/storage-sync-resource-move-cloud-endpoint.png" border="false"::: Cloud endpoint
    * :::image type="icon" source="media/storage-sync-resource-move/storage-sync-resource-move-server-endpoint.png" border="false"::: Server endpoint

In Azure File Sync, the only resource capable of moving is the Storage Sync Service resource. Any subresources are bound to its parent and cannot move to another Storage Sync Service.

**Azure storage resources (in hierarchical order)**

* :::image type="icon" source="media/storage-sync-resource-move/storage-sync-resource-move-storage-account.png" border="false"::: Storage account
    * :::image type="icon" source="media/storage-sync-resource-move/storage-sync-resource-move-file-share.png" border="false"::: File share

In Azure Storage, the only resource capable of moving is the storage account. An Azure file share, as a subresource, cannot move to a different storage account.

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
> When you move a storage account resource, sync will stop immediately. You have to manually authorize sync to access the relevant storage accounts in the new subscription. The [Azure File Sync storage access authorization](#azure-file-sync-storage-access-authorization) section will provide the necessary steps.

### Move to a new Azure Active Directory tenant

Individual resources like a Storage Sync Service or storage accounts, cannot move by themselves to a different AAD tenant. Only Azure subscriptions can move AAD tenants. Think about your subscription structure in the new AAD tenant. You can use a dedicated subscription for Azure File Sync. 

1. Create an Azure subscription (or determine an existing one in the old tenant that should move.
1. [Perform a subscription move within the same AAD tenant](#move-within-the-same-azure-active-directory-tenant) of your Storage Sync Service and all associated storage accounts.
1. Sync will stop. Complete your tenant move immediately or [restore sync's ability to access the storage accounts that moved](#azure-file-sync-storage-access-authorization). You can then move to the new AAD tenant later.

Once all related Azure File Sync resources have been sequestered into their own subscription, you are ready to move the entire subscription to the target AAD tenant. The [transfer subscription guide](../../role-based-access-control/transfer-subscription.md) allows you to plan and execute such a transfer.

> [!WARNING]
> When you transfer a subscription from one tenant to another, sync will stop immediately. You have to manually authorize sync to access the relevant storage accounts in the new subscription. The [Azure File Sync storage access authorization](#azure-file-sync-storage-access-authorization) section will provide the necessary steps.

:::row:::
    :::column:::
        :::image type="content" source="media/storage-sync-resource-move/storage-sync-resource-move-aad-tenant.png" alt-text="A picture showing the Azure portal, Subscription Overview blade, highlighting the Change directory toolbar command in the center, top of the page." lightbox="media/storage-sync-resource-move/storage-sync-resource-move-aad-tenant-expanded.png":::
    :::column-end:::
    :::column:::
        You are ready to start the migration once you have a plan and the required permissions:
        1. In the Azure portal, navigate to your subscription, **Overview** blade.
        1. Select **Change directory**
        1. Follow the wizard steps to assign the new AAD tenant.
    :::column-end:::
:::row-end:::

## Azure File Sync storage access authorization

When storage accounts are moved to either a new subscription or are moved within a subscription to a new Azure Active Directory (AAD) tenant, sync will stop. Role-based access (RBAC) is used to authorize Azure File Sync to access a storage account and these role assignments are not migrated with the resources.

### Azure File Sync service principal

:::row:::
    :::column:::
        :::image type="content" source="media/storage-sync-resource-move/storage-sync-resource-move-afs-rp-registered-small.png" alt-text="An image showing the Azure portal, subscription management, registered resource providers." lightbox="media/storage-sync-resource-move/storage-sync-resource-move-afs-rp-registered.png":::
    :::column-end:::
    :::column:::
        The Azure File Sync service principal must exist in your AAD tenant before you can authorize sync access to a storage account. </br></br> When you create a new Azure subscription today, the Azure File Sync resource provider *Microsoft.StorageSync* is automatically registered with your subscription. Resource provider registration will make a *service principal* for sync available in the Azure Active Directory tenant that governs the subscription. A service principal is similar to a user account in your AAD. You can use the Azure File Sync service principal to authorize access to resources via role-based access control (RBAC). The only resource sync needs access to is your storage accounts containing the file shares that are supposed to sync. *Microsoft.StorageSync* must be assigned to the built-in role **Reader and Data access** on the storage account. </br></br> This assignment is done automatically through the user context of the logged on user when you add a file share to a sync group, or in other words, you create a cloud endpoint. When a storage account moves to a new subscription, or AAD tenant, this role assignment is lost and [must be manually reestablished](#establish-sync-access-to-a-storage-account).
    :::column-end:::
:::row-end:::

> [!IMPORTANT]
> If the target Azure subscription wasn't recently created, check that the *Microsoft.StorageSync* resource provider is registered with the subscription. If it isn't, manually add it on the same portal blade.

### Establish sync access to a storage account

The [Azure File Sync service principal](#azure-file-sync-service-principal) must be used to authorize access to a storage account via role-based access control (RBAC). *Microsoft.StorageSync* must be assigned to the built-in role **Reader and Data access** on the storage account. 

This assignment is typically done automatically through the user context of the logged on user when you add a file share to a sync group, or in other words, you create a cloud endpoint. However, when a storage account moves to a new subscription or AAD tenant, this role assignment is lost and must be manually reestablished.

:::row:::
    :::column:::
        :::image type="content" source="media/storage-sync-resource-move/storage-sync-resource-move-assign-rbac.png" alt-text="An image displaying the Microsoft.StorageSync service principal assigned to the Reader and Data access role on a storage account":::
    :::column-end:::
    :::column:::
        In the Azure portal, navigate to the storage account you need to reauthorize sync access to. <ol><li>Select **Access control (IAM)** on the left-hand table of contents.</li><li>Select the Role assignments tab to the list the users and applications (service principals) that have access to your storage account.</li><li>Select **Add**</li><li>In the **Role field**, select **Reader and Data Access**.</li><li>In the **Select field**, type *Microsoft.StorageSync*, select the role and click **Save**.</li></ol>
    :::column-end:::
:::row-end:::

## Move to a different Azure region

The Azure File Sync resource *Storage Sync Service* and the storage accounts that contain file shares that are syncing, have an Azure region they are deployed in. You determine that region when you create a resource. The region of the Storage Sync Service and storage account resources must match. These regions cannot be changed on either resource type after their creation.

Assigning a different region to a resource is different from a [region fail-over](#region-fail-over), which can be supported, depending on your storage account redundancy setting.

## Region fail-over

[Azure storage offers geo-redundancy options](../common/storage-redundancy.md#geo-redundant-storage) for a storage account. These redundancy options can pose problems for storage accounts used with Azure File Sync. The main reason is that replication between geographically distant regions is not performed by Azure File Sync, but by a storage replication technology built-in to the storage subsystem in Azure. It cannot have an understanding of application state and Azure File Sync is an application with files syncing to and from Azure file shares at any given moment. If you opt for any of these geographically disbursed storage redundancy options, you won't lose all of your data in a large-scale disaster. However, you need to [anticipate data loss](../common/storage-disaster-recovery-guidance.md#anticipate-data-loss).

> [!CAUTION]
> Fail-over is never an appropriate substitute to provisioning your resources in the correct Azure region. If your resources are in the "wrong" region, you need to consider stopping sync and setting sync up again to new Azure file shares that are deployed in your desired region.

A regional fail-over can be started by Microsoft in a catastrophic event that will render data centers in an Azure region incapacitated for an extended period of time. The definition of downtime your business can sustain might be less than the time Microsoft is prepared to let pass before starting a regional fail-over. For a situation like that, [fail-overs can also be initiated by customers](../common/storage-initiate-account-failover.md).

> [!IMPORTANT]
> In the event of a fail-over, you need to file a support ticket for your impacted Storage Sync Services for sync to work again.

## See also

- [Overview of Azure file share and sync migration guides](../files/storage-files-migration-overview.md?toc=%2fazure%2fstorage%2ffilesync%2ftoc.json)
- [Troubleshoot Azure File Sync](file-sync-troubleshoot.md)
- [Planning for an Azure File Sync deployment](file-sync-planning.md)
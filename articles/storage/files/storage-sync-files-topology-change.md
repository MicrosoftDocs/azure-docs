---
title: Azure File Sync resource moves and topology changes
description: Learn how to move sync resources across resource groups, subscriptions and tenant and what changes you can make to an existing sync topology.
author: fauhse
ms.service: storage
ms.topic: how-to
ms.date: 3/3/2021
ms.author: fauhse
ms.subservice: files
---

# Azure File Sync resource move and topology changes

This article describes how to make topology changes to your Azure File Sync cloud resources as well as the connected server resources.

This article discusses the steps required to move Azure File Sync resources to other resource groups, subscriptions or Azure tenants. 
Additionally, guidance for changing the sync topology or resource names is listed.

## Cloud resource changes

When planning to make changes to the Azure File Sync cloud resources, it's always important to consider the storage resources at the same time. The following resources exist:

**Azure File Sync resources (in hierarchical order)**

* :::image type="icon" source="media/storage-sync-files-topology-change/storage-sync-files-topology-change-storage-sync-service.png" border="false"::: Storage Sync Service
  * :::image type="icon" source="media/storage-sync-files-topology-change/storage-sync-files-topology-change-registered-servers.png" border="false"::: Registered server
  * :::image type="icon" source="media/storage-sync-files-topology-change/storage-sync-files-topology-change-sync-group.png" border="false"::: Sync group
    * :::image type="icon" source="media/storage-sync-files-topology-change/storage-sync-files-topology-change-cloud-endpoint.png" border="false"::: Cloud endpoint
    * :::image type="icon" source="media/storage-sync-files-topology-change/storage-sync-files-topology-change-server-endpoint.png" border="false"::: Server endpoint

**Azure storage resources (in hierarchical order)**

* :::image type="icon" source="media/storage-sync-files-topology-change/storage-sync-files-topology-change-storage-account.png" border="false"::: Storage account
    * :::image type="icon" source="media/storage-sync-files-topology-change/storage-sync-files-topology-change-file-share.png" border="false"::: File share

[In this article: I want to move resources to a different resource group, subscription or Azure tenant](#azure-file-sync-resource-move)</br>
[In this article: I want to change my existing sync topology](#handling-and-changing-server-resources)

### Azure File Sync resource move

When planning a resource move, storage account and the top-level Azure File Sync resource, called the *Storage Sync Service*, need to be considered together. Two aspects are important to keep aligned for sync to keep working:
* In which subscription and Azure tenant sync and storage resources reside, matters.
* Sync must be authorized to access the storage account.

#### Resource locality

As a best practice, the Storage Sync Service resource and the storage accounts that have syncing file shares, should always reside in the same subscription. Storage Sync Service and storage account resources must always be governed by the same Azure tenant. These combinations are supported:

* Storage Sync Service and storage accounts are located in **different resource groups** (same Azure tenant)
* Storage Sync Service and storage accounts are located in **different subscriptions** (same Azure tenant)

:::row:::
    :::column:::
        :::image type="content" source="media/storage-sync-files-topology-change/storage-sync-files-topology-change-move-small.png" alt-text="An image showing the Azure portal for a Storage Sync Service resource, with the Move command expanded. It shows the resource group move and subscription move options." lightbox="media/storage-sync-files-topology-change/storage-sync-files-topology-change-move.png":::        
    :::column-end:::
    :::column:::
        A convenient way to move a Storage Sync Service resource is to use the Azure portal. Navigate to the Storage Sync Service you want to move and select *Move* from the command bar. The same steps apply to moving a storage account.
    :::column-end:::
:::row-end:::

> [!WARNING]
> When you move a storage account resource, sync will stop immediately. You have to manually authorize sync to access the storage account in the new subscription. The [Azure File Sync storage access authorization](#azure-file-sync-storage-access-authorization) section will provide the necessary steps.

#### Storage Sync Service region fail-over
???????????????????
MS support? THere was something here I don't remember.

#### Azure File Sync storage access authorization

When deploying Azure File Sync for the first time in a subscription, the subscription is registered with the Microsoft.StorageSync resource provider. That makes a service principal with the same name available in the Azure tenant of the subscription. This service principal is then configured to get access to the storage account hosting an Azure file share, when the file share is specified as a *cloud endpoint* in a sync group. That is done automatically through the user context of the logged on user by adding the Azure File Sync service principal to the role based access control (RBAC) built-in role *Reader and Data Access* of the storage account.

There is no authorization problem when moving resources to a different resource group within the same subscription. When moving a storage account to a different subscription from your Storage Sync Service, you need to manually re-establish authorization for the Azure File Sync service principal.

When planning a resource move, you will need to move the Storage Sync Service and the associated storage accounts. To minimize downtime, start a resource move always with the Storage Sync Service. The target subscription will then be registered with the Azure File Sync resource provider.
When moving resources to a different subscription or Azure tenant, the service principal 




## Handling and changing server resources
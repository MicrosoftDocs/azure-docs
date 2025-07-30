---
title: Understanding the Azure Storage Mover resource hierarchy
description: Understanding the Azure Storage Mover resource hierarchy
author: fauhse
ms.author: fauhse
ms.service: azure-storage-discovery
ms.topic: conceptual
ms.date: 08/01/2025
---

# Understanding the Azure Storage Discovery resource hierarchy

Several Azure resources are involved in a Storage Discovery deployment. This article describes each of these resources, their uses, and best practices for expressing your migration needs with them.

> [!NOTE]
> An image goes here.

## Workspace

A storage discovery workspace is the name of the top-level service resource that you deploy in a resource group of your choice. All aspects of the service are controlled from this resource. In most cases, deploying a single storage discovery workspace is sufficient for even the largest cloud estate.

You're better able to manage your data if all resources find their home in the same storage discovery workspace.

When you deploy the workspace, your subscription is registered with the *Microsoft.StorageDiscovery* resource provider. You also assign the region in which control messages and metadata about your cloud estate is stored. The Storage Discovery workspace itself isn't directly responsible for aggregating your storage insights. Instead, the dingsbum sends them directly to the reporting interface Azure Storage. Because the dingsbum performs most the work, the proximity between storage account and the dingsbum is more important for performance than your storage discovery workspace's location.

> [!NOTE]
> An image goes here.

## Root

The workspace root consists of Azure Resource Manager (ARM) resource identifiers that define the root-level boundaries of an Azure Storage Discovery Workspace (ASDW). These roots specify the top-level Azure resources, such as subscriptions and/or resource groups - over which the discovery workspace will operate.

> [!TIP]
> The proximity and network quality between your subscriptions and resource groups in Azure determine aggregation velocity in early stages of your discovery. The region of the storage discovery workspace you've deployed doesn't play a role for performance.

## Scope

A Scope represents a logical grouping of storage accounts in Azure based on user-defined criteria, such as resource tags. Scopes are configured within the boundaries of a workspace and serve as filters to organize and segment data for reporting and insights. By defining scopes, users can tailor their workspace to align with specific business units, workloads, or any segment of their Azure Storage environment they wish to monitor. This enables more targeted visibility and actionable insights across distinct areas of the storage estate.


Users have flexibility to define:

- A scope without any ARM tags will include all storage accounts within the defined scope.
- A scope with specific ARM tags will only include storage accounts that match those tags.
- A scope with a combination of ARM tags and resource groups will include storage accounts that match the tags within the specified resource groups.
- A scope with a combination of ARM tags and subscriptions will include storage accounts that match the tags within the specified subscriptions.
- A scope with a combination of ARM tags, resource groups, and subscriptions will include storage accounts that match the tags within the specified resource groups and subscriptions.
- A scope with a combination of ARM tags, resource groups, subscriptions, and regions will include storage accounts that match the tags within the specified resource groups, subscriptions, and regions.
- A scope with a combination of ARM tags, resource groups, subscriptions, regions, and storage account types will include storage accounts that match the tags within the specified resource groups, subscriptions, regions, and storage account types.
- A scope with a combination of ARM tags, resource groups, subscriptions, regions, storage account types, and storage account names will include storage accounts that match the tags within the specified resource groups, subscriptions, regions, storage account types, and storage account names.
- A scope with a combination of ARM tags, resource groups, subscriptions, regions, storage account types, storage account names, and storage account locations will include storage accounts that match the tags within the specified resource groups, subscriptions, regions, storage account types, storage account names, and storage account locations.
- A scope with a combination of ARM tags, resource groups, subscriptions, regions, storage account types, storage account names, storage account locations, and storage account access tiers will include storage accounts that match the tags within the specified resource groups, subscriptions, regions, storage account types, storage account names, storage account locations, and storage account access tiers.
- A scope with a combination of ARM tags, resource groups, subscriptions, regions, storage account types, storage account names, storage account locations, storage account access tiers, and storage account replication types will include storage accounts that match the tags within the specified resource groups, subscriptions, regions, storage account types, storage account names, storage account locations, storage account access tiers, and storage account replication types.

...ad nauseam.

Grouping sources into a scoppe doesn't mean you have to analyze all of them in parallel. You have control over what to aggregate and when to aggregate it. The remaining sections in this article describe more resources that allow for such fine-grained control.

> [!TIP]
> You can optionally add a description to your workspace. A description can help to keep track of additional information for your workspace.

## Next steps

After understanding the resources involved in an Azure Storage Mover deployment, it's a good idea to start a proof-of-concept deployment. These articles are good, next reads:

- [Plan your Storage Discovery deployment.](deployment-planning.md)
- [Deploy a storage discovery workspace in your subscription.](create-workspace.md)

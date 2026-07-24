---
title: Manage protection policy for resources
description: In this article, you learn how to manage backup and replication policies to protect your resources.
ms.topic: how-to
ms.date: 11/19/2025
ms.service: resiliency
ms.custom:
  - ignite-2023
  - ignite-2024
author: AbhishekMallick-MS
ms.author: v-mallicka
---

# Manage backup and replication policies for your resources

This article describes how to view your protection policies (backup and replication policies), and performs actions related to them using Resiliency in Azure. 

By using Resiliency, you can centrally manage the lifecycle of your replication and backup protection policies for both Azure Backup or Azure Site Recovery.

[!INCLUDE [Resiliency rebranding announcement updates.](../../includes/resiliency-announcement.md)]

## Prerequisites

Before you start managing policies, ensure you have the required resource permissions to view them in the Resiliency in Azure.

## View protection policies

Use Resiliency to view all your existing protection policies (backup and replication policies) from a single location and manage their lifecycle as needed.

To view the protection policies, follow these steps:

1.	On **Resiliency**, go to **Manage** > **Protection policies**. 
    In this view, you can see a list of all the backup and replication policies across subscription, resource groups, location, type etc. along with their properties. 
    
    :::image type="content" source="./media/manage-protection-policy/protection-policy.png" alt-text="Screenshot showing list of policies." lightbox="./media/manage-protection-policy/protection-policy.png":::

1.	You can also select the policy name or the ellipsis (`...`) icon to view the policy action menu and navigate to further details. 
    :::image type="content" source="./media/manage-protection-policy/view-protection-policy.png" alt-text="Screenshot showing View policy page." lightbox="./media/manage-protection-policy/view-protection-policy.png":::
 
1.	To look for specific policy, you can use various filters, such as subscriptions, resource groups, location, and resource type, and more. 
1.	Using the solution filter, you can customize the view to show only backup policies or only replication policies.
    You can also search by the vault name to get specific information.
    :::image type="content" source="./media/manage-protection-policy/filter-policy.png" alt-text="Screenshot showing policy filtering page." lightbox="./media/manage-protection-policy/filter-policy.png":::
 
1.	Resiliency allows you to change the default view using a scope picker. Select the **Change** option beside the **Currently showing:** details displayed at the top.
    :::image type="content" source="./media/manage-protection-policy/change-scope.png" alt-text="Screenshot showing **Change scope** page." lightbox="./media/manage-protection-policy/change-scope.png":::
 
8.	To change the scope for protection policies pane using the scope-picker, select the required options:
    - **Resource managed by**: 
        - **Azure resource**: resources managed by Azure
        - **Non-Azure resources**: resources not managed by Azure
9.	You can use **Select columns** to add or remove columns. 
    :::image type="content" source="./media/manage-protection-policy/select-column.png" alt-text="Screenshot showing *select columns* option." lightbox="./media/manage-protection-policy/select-column.png":::

   You can also query information for your backup and replication policies at no extra cost using Azure Resource Graph (ARG). ARG is an Azure service designed to extend Azure Resource Management. It aims to provide efficient resource exploration with the ability to query at scale across a given set of subscriptions. 
 
   To get started with querying information for your backup and replication policies using ARG, you can use the sample query provided by selecting **Open query**.

   :::image type="content" source="./media/manage-protection-policy/query-for-backup-and-replication-policies.png" alt-text="Screenshot shows how to check for queries to view backup and replication policies." lightbox="./media/manage-protection-policy/query-for-backup-and-replication-policies.png":::

## Next steps

- [Configure protection](./tutorial-configure-protection-datasource.md).
- [View protectable resources](./tutorial-view-protectable-resources.md)

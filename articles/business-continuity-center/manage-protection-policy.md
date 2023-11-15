---
title: Manage protection policy for resources
description: In this article, you learn how to manage backup and replication policies to protect your resources.
ms.topic: how-to
ms.date: 10/18/2023
ms.service: backup
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Manage backup and replication policies for your resources (preview)

Using Azure Business Continuity center (preview), you can centrally manage the lifecycle of your replication and backup protection policies for both Azure Backup or Azure Site Recovery.

This tutorial shows you how to view your protection policies (backup and replication policies), and perform actions related to them using Azure Business Continuity center. 

## Prerequisites

Before you start this tutorial:

- Ensure you have the required resource permissions to view them in the ABC center.

## View protection policies

Use Azure Business Continuity center to view all your existing protection policies (backup and replication policies) from a single location and manage their lifecycle as needed.

Follow these steps:

1.	In the Azure Business Continuity center, select **Protection policies** under **Manage**. 
    In this view, you can see a list of all the backup and replication policies across subscription, resource groups, location, type etc. along with their properties. 
    
    :::image type="content" source="./media/manage-protection-policy/protection-policy.png" alt-text="Screenshot showing list of policies." lightbox="./media/manage-protection-policy/protection-policy.png":::

3.	You can also select the policy name or the ellipsis (`...`) icon to view the policy action menu and navigate to further details. 
    :::image type="content" source="./media/manage-protection-policy/view-protection-policy.png" alt-text="Screenshot showing View policy page." lightbox="./media/manage-protection-policy/view-protection-policy.png":::
 
4.	To look for specific policy, you can use various filters, such as subscriptions, resource groups, location, and resource type, and more. 
5.	Using the solution filter, you can customize the view to show only backup policies or only replication policies.
    You can also search by the vault name to get specific information.
    :::image type="content" source="./media/manage-protection-policy/filter-policy.png" alt-text="Screenshot showing policy filtering page." lightbox="./media/manage-protection-policy/filter-policy.png":::
 
7.	Azure Business Continuity allows you to change the default view using a scope picker. Select the **Change** option beside the **Currently showing:** details displayed at the top.
    :::image type="content" source="./media/manage-protection-policy/change-scope.png" alt-text="Screenshot showing **Change scope** page." lightbox="./media/manage-protection-policy/change-scope.png":::
 
8.	To change the scope for protection policies pane using the scope-picker, select the required options:
    - **Resource managed by**: 
        - **Azure resource**: resources managed by Azure
        - **Non-Azure resources**: resources not managed by Azure
9.	You can use **Select columns** to add or remove columns. 
    :::image type="content" source="./media/manage-protection-policy/select-column.png" alt-text="Screenshot showing *select columns* option." lightbox="./media/manage-protection-policy/select-column.png":::
 
## Next steps

- [Configure protection](./tutorial-configure-protection-datasource.md)
- [View protectable resources](./tutorial-view-protectable-resources.md)

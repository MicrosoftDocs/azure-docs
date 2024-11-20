---
title: Tutorial - Monitor protection summary
description: In this tutorial, learn how to monitor protection estate using Azure business continuity Center overview blade.
ms.topic: tutorial
ms.date: 05/30/2024
ms.service: azure-business-continuity-center
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Tutorial: Monitor protection summary

This article describes how to monitor and govern protection estate, using Azure Business Continuity Center overview blade.

The Azure Business Continuity Center overview blade provides a comprehensive snapshot of your resources from various aspects, such as protection status, the configuration of your security settings, and which resources are protected or not protected. It provides a summarized view from different angles to give you a clear overview of your business continuity status. You can view:

- The protectable resources count
- The protected item and their status.
- Assessment score for security configuration.
- Recovery point actuals for protection items.
- Compliance details for applied Azure policies.

## Prerequisites

Before you start this tutorial:

- Ensure you have the required resource permissions to view them in the ABC Center.

## View dashboard

To view the protection summary dashboard, follow these steps:

1. On **Business Continuity Center**, go to **Overview** to see a consolidated view of information  related to protection of your resources across solutions in a single location.

    :::image type="content" source="./media/tutorial-monitor-protection-summary/summary-page.png" alt-text="Screenshot showing the overview summary page." lightbox="./media/tutorial-monitor-protection-summary/summary-page.png":::
 
2. To look for specific information, use various filters, such as subscriptions, resource groups, location, and resource type, and more.
    :::image type="content" source="./media/tutorial-monitor-protection-summary/overview-filter.png" alt-text="Screenshot showing filtering options." lightbox="./media/tutorial-monitor-protection-summary/overview-filter.png":::
 
3. Azure Business Continuity allows you to change the default view using a scope picker. Select **Change** corresponding to **Currently showing: Azure managed Active resources**.
    :::image type="content" source="./media/tutorial-monitor-protection-summary/change-scope.png" alt-text="Screenshot showing change-scope option." lightbox="./media/tutorial-monitor-protection-summary/change-scope.png":::
 
4.	On the **Change scope** blade, to change the scope for the **Overview** page using the scope-picker, select the following options as required, and then select **Update**.
    - **Resource managed by**: 
        - **Azure resource**: resources managed by Azure.
        - **Non-Azure resources**: resources not managed by Azure.
    - **Resource status:**
        - **Active resources**: resources currently active, i.e., not deleted.
        - **Deprovisioned resources**: resources that no longer exist, yet their backup and recovery points are retained.

   You can also execute core tasks like configuring protection and initiating recovery actions directly within this interface. 
    :::image type="content" source="./media/tutorial-monitor-protection-summary/configure-protection.png" alt-text="Screenshot showing *configure-protection* option." lightbox="./media/tutorial-monitor-protection-summary/configure-protection.png":::
 
The summary tiles are easy to use, interactive and can be accessed to seamlessly navigate to the corresponding views where you can explore comprehensive details regarding the specific resources.

 
## Next steps

- [Create protection policies](./backup-protection-policy.md)
- [Configure protection from ABC Center](./tutorial-configure-protection-datasource.md).

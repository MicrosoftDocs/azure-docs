---
title: Pin and share a Change Analysis query to the Azure dashboard
description: Learn how to pin an Azure Monitor Change Analysis query to the Azure dashboard and share with your team.
ms.topic: conceptual
ms.author: hannahhunter
author: hhunter-ms
ms.contributor: cawa
ms.date: 05/12/2022 
ms.subservice: change-analysis
ms.custom: devx-track-azurepowershell
ms.reviwer: cawa
---

# Pin and share a Change Analysis query to the Azure dashboard

Let's say you want to curate a change view on specific resources, like all Virtual Machine changes in your subscription, and include it in a report sent periodically. You can pin the view to an Azure dashboard for monitoring or sharing scenarios. If you'd like to share a specific change with your team members, you can use the share feature in the Change Details page.

## Pin to the Azure dashboard

Once you have applied filters to the Change Analysis homepage:

1. Select **Pin current filters** from the top menu. 
1. Enter a name for the pin. 
1. Click **OK** to proceed.

   :::image type="content" source="./media/change-analysis/click-pin-menu.png" alt-text="Screenshot of selecting Pin current filters button in Change Analysis":::

A side pane will open to configure the dashboard where you'll place your pin. You can select one of two dashboard types:

| Dashboard type | Description |
| -------------- | ----------- |
| Private | Only you can access a private dashboard. Choose this option if you're creating the pin for your own easy access to the changes. |
| Shared | A shared dashboard supports role-based access control for view/read access. Shared dashboards are created as a resource in your subscription with a region and resource group to host it. Choose this option if you're creating the pin to share with your team. |

### Select an existing dashboard

If you already have a dashboard to place the pin:

1. Select the **Existing** tab.
1. Select either **Private** or **Shared**.
1. Select the dashboard you'd like to use. 
1. If you've selected **Shared**, select the subscription in which you'd like to place the dashboard.
1. Select **Pin**.
 
   :::image type="content" source="./media/change-analysis/existing-dashboard-small.png" alt-text="Screenshot of selecting an existing dashboard to pin your changes to. ":::

### Create a new dashboard

You can create a new dashboard for this pin.
 
1. Select the **Create new** tab. 
1. Select either **Private** or **Shared**. 
1. Enter the name of the new dashboard.
1. If you're creating a shared dashboard, enter the resource group and region information. 
1. Click **Create and pin**. 

   :::image type="content" source="./media/change-analysis/create-pin-dashboard-small.png" alt-text="Screenshot of creating a new dashboard to pin your changes to.":::

Once the dashboard and pin are created, navigate to the Azure dashboard to view them.

1. From the Azure portal home menu, select **Dashboard**. Use the **Manage Sharing** button in the top menu to handle access or "unshare". Click on the pin to navigate to the curated view of changes.

   :::image type="content" source="./media/change-analysis/azure-dashboard.png" alt-text="Screenshot of selecting the Dashboard in the Azure portal home menu.":::

   :::image type="content" source="./media/change-analysis/view-share-dashboard.png" alt-text="Screenshot of the pin in the dashboard.":::

## Share a single change with your team

In the Change Analysis homepage, select a line of change to view details on the change.

1. On the Changed properties page, select **Share** from the top menu. 
1. On the Share Change Details pane, copy the deep link of the page and share with your team in messages, emails, reports, or whichever communication channel your team prefers.

   :::image type="content" source="./media/change-analysis/share-single-change.png" alt-text="Screenshot of selecting the share button on the dashboard and copying link.":::



## Next steps

Learn more about [Change Analysis](change-analysis.md).
---
title: Create and manage dashboards in Dashboard hub
description: This article describes how to create and customize a dashboard in Dashboard Hub in the Azure portal.
ms.topic: how-to
ms.date: 08/27/2024
---

# Create and manage dashboards in Dashboard hub (preview)

Dashboards are a focused and organized view of your cloud resources in the Azure portal. The new Dashboard hub (preview) experience offers editing features such as tabs, a rich set of tiles with support for different data sources, and support in the Azure mobile app.

Dashboar Hub can be used to create and manage shared dashboards only. These shared dashboards are implemented as Azure resources in your subscription and are visible to all users who have subscription-level access.

> [!IMPORTANT]
> Dashboard hub is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Current limitations

Before using the new Dashboard hub experience, be aware of the following current limitations and make sure that your new dashboard meets your organization's needs.

Private dashboards aren't currently supported in Dashboard hub. To create a private dashboard, or share it with only a limited set of users, create your dashboard [from the **Dashboard** view in the Azure portal](azure-portal-dashboards.md).

Some tiles aren't yet available in the Dashboard hub experience. Currently, the following tiles are available:

- **Azure Resource Graph query**
- **Metrics**
- **Resource**
- **Resource Group**
- **Recent Resources**
- **All Resources**
- **Markdown**
- **Policy**

If your dashboard relies on one of these tiles, we recommend that you don't use the new experience for that dashboard at this time. We'll update this page as we add support for additional tile types.

## Create a new dashboard

This example shows how to create a new shared dashboard with an assigned name.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for **Dashboard hub** and then select it.

1. Under **Dashboards (preview)**, select **Shared dashboards**. Then select **Create**.

   :::image type="content" source="media/dashboard-hub/dashboard-hub-create.png" alt-text="Screenshot of the Create option in the Dashboard hub.":::

   You'll see an empty dashboard with a grid where you can arrange tiles.

1. If you want to use a template to create your dashboard, select **Select Templates**, then choose an available template to start from. Enter a name and any other applicable information. For example, if you select **SQL database health**, you'll need to specify a SQL database resource. When you're finished, select **Submit**.

1. If you aren't using a template, or if you want to add more tiles, select **Add tile** to open the **Tile Gallery**. The **Tile Gallery** features a variety of tiles that display different types of information. Select a tile, then select **Add**. You can also drag tiles from the **Tile Gallery** onto your grid. Resize or rearrange the tiles as desired.

1. If you haven't already provided a name, or want to change what you entered, select **Rename dashboard** to enter a name that will help you easily identify your dashboard.

   :::image type="content" source="media/dashboard-hub/dashboard-hub-rename.png" alt-text="Screenshot showing a dashboard being renamed in the Dashboard hub.":::

1. When you're finished, select **Publish dashboardV2** in the page header.

1. Select the subscription and resource group to which the dashboard will be saved.
1. Enter a name for the dashboard. This name will be used for the dashboard resource in Azure, and it can't be changed after publishing. However, you can edit the displayed title of the dashboard later.
1. Select **Submit**.

You'll see a notification confirming that your dashboard has been published. You can continue to [edit your dashboard](#edit-a-dashboard) as needed.

## Create a dashboard based on an existing dashboard

Follow these steps to create a new shared dashboard with an assigned name, based on an existing dashboard.

1. In the Dashboard hub, under **Dashboards**, select either **Private dashboards** or **Shared dashboards**. 
1. Select the dashboard that you want to start with.
1. Select **Try it now**.

   :::image type="content" source="media/dashboard-hub/dashboard-try-it-now.png" alt-text="Screenshot showing the Try it now link for a dashboard.":::

   The dashboard opens in the new Dashboard hub editing experience.

## Edit a dashboard

After you create a dashboard, you can add, resize, and arrange tiles that show your Azure resources or display other helpful information. We'll start by working with the Tile Gallery, then explore other ways to customize dashboards.
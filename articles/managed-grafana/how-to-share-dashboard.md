---
title: Share a Grafana dashboard or panel
titleSuffix: Azure Managed Grafana
description: Learn how to share a Grafana dashboard with internal and external stakeholders, such as customers or partners.
author: maud-lv
ms.author: malev
ms.service: azure-managed-grafana
ms.topic: how-to 
ms.date: 02/06/2025
#customer intent : As a data analyst, I want to share Grafana dashboards and panels with stakeholders.
---

# Share a Grafana dashboard or panel

In this guide for Azure Managed Grafana, learn how to share Grafana dashboards with internal and external stakeholders, whether you want to collaborate on a Grafana project with team members, generate files, reports, or share information publicly.

This article covers information about sharing access to Grafana dashboards with internal stakeholders, managing dashboard permissions, and generating the following dashboard elements:

  - direct links
  - snapshots
  - library panels
  - JSON or PDF files
  - reports

> [!NOTE]
> The Grafana UI may change periodically. This article shows the Grafana interface and user flow at a given point. Your experience may slightly differ from the examples below at the time of reading this document. If so, refer to the [Grafana Labs documentation.](https://grafana.com/docs/grafana/latest/dashboards/)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana workspace. If you don't have one yet, [create an Azure Managed Grafana workspace](./quickstart-managed-grafana-portal.md).

## Share access with team members

To access dashboards, team members must have access to the Grafana workspace. To enable access, start by [assigning them a Grafana role](how-to-manage-access-permissions-users-identities.md) on the Grafana workspace, if they don't have one yet.

By default, all Grafana roles grant view access to all Grafana dashboards, except for the Grafana Limited Viewer role, which requires permissions to be specifically granted per dashboard. This granular control ensures that identities with the Grafana Limited Viewer role only access the specific dashboards they need, enhancing security and data privacy.

Once a user has a Grafana role and has signed into the Grafana portal, you can modify their access permissions for specific dashboards by following the process below:

1. Open the Grafana portal with the dashboard you want to share.
1. Open the dashboard, then go to **Settings** > **Permissions** > **Add a permission**.
1. Under **Add permission for**, select a user and grant them view, edit, or admin permissions.

> [!NOTE]
> Grafana users need to open the Grafana endpoint at least once before they appear in the **Add Permissions** menu. Once the user has logged in, you can edit their permissions.

## Use the Grafana dashboard and panel sharing options

The Grafana portal provides several options to share access to Grafana dashboards and panels to various stakeholders. To access these sharing options:

1. In the Grafana portal, go to **Dashboards > Browse**, and open a dashboard.
1. Open sharing options:
   - To share a whole dashboard, select **Share** at the top of the page.
   - To share a single dashboard panel, hover over a panel title, open the panel menu and select **Share**. A new window opens, offering various sharing options.

      :::image type="content" source="media/share-dashboard/find-share-option.png" alt-text="Screenshot of the Grafana workspace. Create a new dashboard.":::

> [!TIP] 
> If you update a dashboard or a panel, ensure you save your changes before sharing it so that it contains your latest changes.

For more information about the sharing methods presented below, refer to Grafana's [Share dashboards and panels documentation](https://grafana.com/docs/grafana/latest/dashboards/share-dashboards-panels).

### Share a link

The **Link** tab lets you create a direct link to a Grafana dashboard or panel.

Create a sharable link in one step, by selecting **Copy**, at the bottom of the tab. Optionally customize sharing with the options below:

- **Lock time range**: sets the time range of the shared panel or dashboard to the time range currently displayed in your shared panel or dashboard.
- **Theme**: keep the current theme or choose a dark or a light theme.
- **Shorten URL**: shortens the sharable link.

> [!NOTE] 
> Users must have Grafana Viewer permission to view shared links.

### Share a snapshot

The **Snapshot** tab lets you share an interactive dashboard or panel publicly. Sensitive data like queries (metric, template, and annotation) and panel links are removed from the snapshot, leaving only the visible metric data and series names embedded in your dashboard. A snapshot can be viewed by anyone that has the link and can access the URL.

1. Optionally update the snapshot name, select an expiry date, and change the time-out value.
1. To publish the Grafana snapshot, choose one of the following options:
   - **Publish to snapshots.raintank.io** to make it accessible publicly to anyone with the link.
   - **Local Snapshot**, to restrict access to users who are registered in your Microsoft Entra tenant.
1. **Copy** the snapshot URL generated by Grafana. Select **Delete snapshot** if you no longer need it.

> [!TIP]
> To disable public sharing of snapshots, open your Azure Managed Grafana workspace within the Azure portal, then go to **Settings** > **Configuration** > **Grafana Settings (Preview)**, and turn off the **External Enabled** option.

### Create a library panel

Create a library panel that can be reused in other Grafana dashboards from the **Library panel** tab. Do this in a single step by selecting the **Create library panel** at the bottom of the tab. Optionally update the panel library name and select another folder in which to save the library panel.

Once you've created a library panel, reuse it in other dashboards of the same Grafana workspace by going to **Dashboards > New dashboard > Add panel from panel library**.

### Export dashboard as JSON file

Export a dashboard in JSON format from the **Export** tab. Select **Save to file** to download the JSON file, or select **View JSON > Copy to Clipboard**.

**Export for sharing externally** is disabled by default. Optionally enable this option to generate JSON code for external stakeholders. The exported dashboard can then be [imported to Grafana](how-to-create-dashboard.md#import-a-json-dashboard).

### Save as PDF

Save a dashboard as a PDF from the **PDF** tab. Customize your PDF by selecting the desired **Orientation** (landscape or portrait) and **Layout** (grid or simple), and optionally zoom in or out to adjust the number of rows and columns displayed in table panels. Select **Save as PDF** to download the file.

### Generate a report

Generate a dashboard report from the **Report** tab. For more information, see [Use reporting and image rendering](how-to-use-reporting-and-image-rendering.md) and [Create or update a report](https://grafana.com/docs/grafana/latest/dashboards/create-reports/#create-or-update-a-report).

## Related content

- [Share access and manage user permissions](how-to-manage-access-permissions-users-identities.md)
- [Use reporting and image rendering](how-to-use-reporting-and-image-rendering.md)

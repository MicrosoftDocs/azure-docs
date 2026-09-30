---
title: Configure Grafana Settings
titleSuffix: "Azure Managed Grafana"
description: Learn how to configure Grafana settings in Azure Managed Grafana.
author: maud-lv
ms.author: malev
ms.service: azure-managed-grafana
ms.topic: how-to
ms.date: 11/10/2025
#customer intent: In this article, learn how to configure the custom Grafana options available on the Grafana settings tab, in Azure Managed Grafana.
---

# Configure Grafana settings

This article provides step-by-step instructions on how to configure Grafana settings in Azure Managed Grafana. These settings allow you to customize your Grafana instance by enabling or disabling specific options. You can also reference these settings in Grafana documentation, under [Grafana configuration](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/).

## Prerequisites

- An Azure account with an active subscription
- An Azure Managed Grafana instance

## Update Grafana settings

1. Open the Azure portal and go to your Azure Managed Grafana instance.

1. On the left menu, select **Settings** > **Configuration**.

1. Open the **Grafana Settings** tab.

1. Enable or disable settings.

:::image type="content" source="media/grafana-settings/grafana-settings-tab.png" alt-text="Screenshot that shows the Azure platform and the Grafana settings tab." lightbox="media/grafana-settings/grafana-settings-tab.png":::

### External Enabled setting

The **External Enabled** setting controls public sharing of snapshots. When you enable this setting, users can publish snapshots of dashboards to an external URL.

1. Open a dashboard and then select **Share** > **Snapshot** > **Publish to snapshots.raintanks.io**.

1. The default setting is **True**, or enabled. To restrict users from sharing snapshots publicly, change the switch to **False**.

### Viewers Can Edit setting

The **Viewers Can Edit** setting enables users with the Grafana Viewer role to edit dashboards without permanently saving changes. This feature enables those users to run tests and interact with dashboards without making permanent changes. With this setting enabled, users with this role can:

- Edit dashboards temporarily, without saving.
- Access the **Explore** menu to perform interactive queries and analyze data.

The default setting is **False**, or disabled. To enable this setting, change the switch to **True**.

### Editors Can Admin setting

The **Editors Can Admin** setting enables users with the Grafana Editor role to administrate dashboards, folders, and teams they create.

The default setting is **False**, or disabled. To enable this setting, change the switch to **True**.

> [!NOTE]
> This setting isn't supported in Grafana 12 or newer. Workspaces running Grafana 12 or newer can't access this configuration option.

### CSRF Always Check setting

The **CSRF Always Check** setting enhances security by rejecting requests that have an origin header that doesn't match the Grafana instance's origin. This setting helps prevent cross-site request forgery (CSRF) attacks.

The default setting is **False**, or disabled. To enable this setting based on your security requirements, change the switch to **True**.

### Capture Enabled (Preview) setting

The **Capture Enabled (Preview)** setting enables Grafana to take screenshots of dashboards or panels and include them in alert notifications. This option requires a remote HTTP image rendering service. For more configuration options, see [rendering](https://github.com/grafana/grafana-image-renderer).

The default setting is **False**, or disabled. To enable this setting, change the switch to **True**.

## Related content

- [Grafana UI](grafana-app-ui.md)
- [Manage plugins](how-to-manage-plugins.md)

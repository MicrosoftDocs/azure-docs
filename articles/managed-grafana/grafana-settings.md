---
title: How to Configure Grafana Settings
titleSuffix: "Azure Managed Grafana"
description: Learn how to configure Grafana settings in Azure Managed Grafana, including enabling Viewers can Edit and External Enabled.
author: maud-lv
ms.author: malev
ms.service: azure-managed-grafana
ms.topic: how-to
ms.date: 03/20/2025
#customer intent: In this document, learn how to configure the custom Grafana options available in the Grafana settings tab, in Azure Managed Grafana.

---

# How to configure Grafana settings

This article provides step-by-step instructions on how to configure Grafana settings in Azure Managed Grafana. These settings allow you to customize your Grafana instance by enabling or disabling specific options. These Grafana settings are also referenced in Grafana's documentation, under [Grafana configuration](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/).

## Prerequisites

- An Azure account with an active subscription.
- An Azure Managed Grafana instance.

## Update Grafana settings

1. Open the Azure portal and navigate to your Azure Managed Grafana instance.
1. In the left menu, select **Settings** > **Configuration**.
1. Open the **Grafana Settings** tab.
1. Enable or disable settings.

:::image type="content" source="media/grafana-settings/grafana-settings-tab.png" alt-text="Screenshot of the Azure platform showing the Grafana settings tab." lightbox="media/grafana-settings/grafana-settings-tab.png":::

## Available Grafana settings

### External Enabled

Description: The **External Enabled** setting controls the public sharing of snapshots. With this setting enabled, users can publish snapshots of dashboards to an external URL by opening a dashboard, selecting **Share** > **Snapshot** > **Publish to snapshots.raintanks.io**.

Default: enabled. Toggle off to restrict public sharing of snapshots.

### Viewers Can Edit

Description: The **Viewers Can Edit** setting enables users with the Grafana Viewer role to edit dashboards without saving changes permanently. This feature is designed to enable Grafana Viewers to run tests and interact with dashboards without making permanent changes. With this setting enabled, Grafana Viewers can:

- Edit dashboards temporarily, without saving.
- Access the **Explore** menu to perform interactive queries and analyze data.

Default: disabled. Toggle on to enable this setting.

### Editors Can Admin (Preview)

Description: The **Editors Can Admin (Preview)** setting enables users with the Grafana Editor role to administrate dashboards, folders and teams they create.

Default: disabled. Toggle on the switch to enable this setting.

### CSRF Always Check

Description: The **CSRF Always Check** setting enhances security by rejecting requests that have an origin header that does not match the origin of the Grafana instance. This setting helps to prevent Cross-Site Request Forgery (CSRF) attacks. 

Default: disabled. Toggle the switch to enable or disable this setting based on your security requirements.

### Capture Enabled (Preview)

Description: The **Capture Enabled (Preview)** setting enables Grafana to take screenshots of dashboards or panels and include them in alert notifications. This option requires a remote HTTP image rendering service. Refer to [rendering](https://github.com/grafana/grafana-image-renderer) for further configuration options.

Default: disabled. Toggle on the switch to enable this setting.

## Related content

- [Grafana UI](grafana-app-ui.md)
- [Manage plugins](how-to-manage-plugins.md)

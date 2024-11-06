---
title: How to Configure Grafana Settings
titleSuffix: "Azure Managed Grafana"
description: Learn how to configure Grafana settings in Azure Managed Grafana, including enabling Viewers can Edit and External Enabled.
author: maud-lv
ms.author: malev
ms.service: azure-managed-grafana
ms.topic: how-to-article
ms.date: 11/06/2024
#customer intent: In this document, learn how to configure the custom Grafana options available in the Grafana settings tab, in Azure Managed Grafana.

---

# How to configure Grafana settings

This article provides step-by-step instructions on how to configure Grafana settings in Azure Managed Grafana. These settings allow you to customize your Grafana instance by enabling or disabling specific options. These Grafana settings are also referenced in Grafana's documentation, under [Grafana configuration](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/).

## Prerequisites

- An Azure account with an active subscription.
- An Azure Managed Grafana instance.

## Access Grafana Settings

1. Open the Azure portal and navigate to your Azure Managed Grafana instance.
1. In the left menu, select **Settings** > **Configuration**.
1. Open the **Grafana Settings (Preview)** tab.

:::image type="content" source="media/grafana-settings/grafana-settings-tab.png" alt-text="Screenshot of the Azure platform showing the Grafana settings tab." lightbox="media/grafana-settings/grafana-settings-tab.png":::

## Enable or disable Viewers Can Edit

The **Viewers Can Edit** setting allows users with the Grafana Viewer role to edit dashboards without saving changes permanently. This feature is designed to enable Grafana Viewers to run tests and interact with dashboards without making permanent changes.

With this setting enabled, Grafana Viewers can:
- Edit dashboards temporarily, without saving.
- Access the **Explore** menu to perform interactive queries and analyze data.

1. In the **Grafana Settings (Preview)** tab, locate the **Viewers can edit** option.
1. This option is disabled by default. Toggle the switch to enable this setting.

## Enable or disable External Enabled

The **External Enabled** setting controls the public sharing of snapshots.

With this setting enabled, users can publish snapshots of dashboards to an external URL by opening a dashboard, selecting **Share** > **Snapshot** > **Publish to snapshots.raintanks.io**.

1. In the **Grafana Settings (Preview)** tab, locate the **External Enabled** option.
1. This option is enabled by default, allowing users to publicly share snapshots of their dashboards. To restrict the public sharing of snapshots, toggle off the switch to disable this setting.

## Enable or disable CSRF Always Check

The **CSRF Always Check** setting enhances security by rejecting requests that have an origin header that does not match the origin of the Grafana instance. This setting helps to prevent Cross-Site Request Forgery (CSRF) attacks. This option is disabled by default.

1. In the **Grafana Settings (Preview)** tab, locate the **CSRF Always Check** option.
1. Toggle the switch to enable or disable this setting based on your security requirements.

## Related Content

- [Grafana UI](grafana-app-ui.md)
- [Manage plugins](how-to-manage-plugins.md)

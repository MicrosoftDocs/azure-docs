---
title: Enable telemetry for feature flags (preview)
titleSuffix: Azure App Configuration
description: Learn how to enable telemetry for feature flags in Azure App Configuration.
ms.service: azure-app-configuration
author: mrm9084
ms.author: mametcal
ms.topic: how-to
ms.date: 11/06/2024
---

# Tutorial: Enable telemetry for feature flags (preview)

Having telemetry data on your feature flags can be a powerful tool for understanding how your feature flags are used. Telemetry allows you to make informed decisions about your feature management strategy. When a feature flag change is deployed, it's often important to analyze its effect on an application. For example, here are a few questions that may arise:

- Are my flags enabled/disabled as expected?
- Are targeted users getting access to a certain feature as expected?
- Which variant is a particular user seeing?

These types of questions can be answered through the emission and analysis of feature flag evaluation events.

## Prerequisites

- An Azure subscription. If you don't have one, [If you don't have one](https://azure.microsoft.com/free/) before you begin.
- An App Configuration store. If you don't have one, [create an App Configuration store](./quickstart-azure-app-configuration-create.md).
- A variant feature flag. If you don't have a feature flag, see [Create a feature flag](./manage-feature-flags.md).
- An Application Insights resource. If you don't have one, [create an Application Insights resource](/azure/azure-monitor/app/create-workspace-resource).

## Connect to Application Insights (preview)

1. Open your App Configuration store in the Azure portal.
1. In the **Telemetry** section, select the **Application Insights (preview)** blade.
1. Select the subscription, resource group, and the Application Insights resource you want to connect to your App Configuration store.
1. Select the **Connect** button.

    > [!div class="mx-imgBorder"]
    > ![Screenshot of the Azure portal, connecting application insights.](./media/how-to-telemetry/connect-to-app-insights.png)

## Enable telemetry for a feature flag (preview)

1. Open your App Configuration store in the Azure portal and select the **Feature manager** blade under the **Operations** section.
1. Select the feature flag named Greeting. If you don't have it, follow the [instructions to create it](./manage-feature-flags.md). Then, right-click on the feature flag and select **Edit**.

    > [!div class="mx-imgBorder"]
    > ![Screenshot of the Azure portal, editing a feature flag.](./media/how-to-telemetry/edit-feature-flag.png)

1. In the new view, select the **Telemetry** tab.
1. Check the **Enable Telemetry** box and then select the **Review + update** button at the bottom of the page.

    > [!div class="mx-imgBorder"]
    > ![Screenshot of the Azure portal, enabling telemetry.](./media/how-to-telemetry/enable-telemetry.png)

1. Continue to the following instructions to use telemetry in your application for the language or platform you're using.

* [Python](./howto-telemetry-python.md)

---
title: Set Up Autoscale Rules for Azure Spring Apps Applications
description: Shows you how to configure autoscale settings for your applications using the Microsoft Azure portal or the Azure CLI.
author: KarlErickson
ms.author: karler
ms.reviewer: ninpan-ms
ms.service: azure-spring-apps
ms.topic: how-to
ms.date: 06/27/2024
ms.custom: devx-track-java, devx-track-azurecli
---

# Set up autoscale for applications

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Java ✅ C#

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article describes how to set up autoscale settings for your applications using the Microsoft Azure portal or the Azure CLI.

Autoscale is a built-in feature of Azure Spring Apps that helps applications perform their best when demand changes. Azure Spring Apps supports scale-out and scale-in, which includes modifying the number of app instances and load balancing.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* A deployed Azure Spring Apps service instance. For more information, see [Quickstart: Deploy your first application to Azure Spring Apps](./quickstart.md).
* At least one application already created in your service instance.

## Navigate to the Autoscale page in the Azure portal

Use the following steps to access the autoscale settings:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Go to the Azure Spring Apps **Overview** page.
1. In the navigation pane, under **Settings**, select the **Apps**.
1. Select the application for which you want to set up autoscale. If set up your Azure Spring Apps instance by following the directions in [Quickstart: Deploy your first application to Azure Spring Apps](./quickstart.md), select the application named **demo**. You should then see the application's **Overview** page.
1. In the navigation pane, under **Settings**, select **Scale out**.

## Set up autoscale settings for your application in the Azure portal

Autoscale demand management provides the following options:

* Manual scale: Maintains a fixed instance count. In the Standard plan, you can scale out to a maximum of 500 instances. This value changes the number of separate running instances of the application.
* Custom autoscale: Scales on any schedule, based on any metrics.

In the Azure portal, choose how you want to scale. The following figure shows the **Custom autoscale** option and mode settings.

:::image type="content" source="media/how-to-setup-autoscale/custom-autoscale.png" alt-text="Screenshot of the Azure portal that shows the Autoscale setting page with the Custom autoscale option highlighted." lightbox="media/how-to-setup-autoscale/custom-autoscale.png":::

## Set up autoscale settings for your application in Azure CLI

You can also set autoscale modes using the Azure CLI. The following commands create an autoscale setting and an autoscale rule. Be sure to replace the `<...>` placeholders with your own values.

* To create an autoscale setting, use the following command:

   ```azurecli
   az monitor autoscale create \
       --resource-group <resource-group-name> \
       --name <autoscale-setting-name> \
       --resource /subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.AppPlatform/Spring/<service-instance-name>/apps/<app-name>/deployments/<deployment-name> \
       --min-count 1 \
       --max-count 5 \
       --count 1
   ```

* To create an autoscale rule, use the following command:

   ```azurecli
   az monitor autoscale rule create \
       --resource-group <resource-group-name> \
       --autoscale-name <autoscale-setting-name> \
       --scale out 1 \
       --cooldown 1 \
       --condition "tomcat.global.request.total.count > 100 avg 1m where AppName == <app-name> and Deployment == <deployment-name>"
   ```

For information on the available metrics, see the [User metrics options](./concept-metrics.md#user-metrics-options) section of [Metrics for Azure Spring Apps](./concept-metrics.md).

## Set up autoscale settings for blue-green deployments

Use the following steps to set up metrics-based autoscale settings for blue-green deployments:

> [!IMPORTANT]
> Create separate autoscale rules for each deployment. Set up one rule for the blue deployment, and a separate rule for the green deployment.

1. In the Azure portal, navigate to the **Autoscale setting** page as described previously.
1. Select **Custom autoscale**.
1. Within a scale condition, select **Add a rule**.
1. Choose values for the **App** dimension.
1. For the **Deployment** dimension, set the value to either the blue or the green deployment name, not to **All values**.
1. For the **Instance** dimension, set the value to **All values**. This ensures that the rule applies to all instances within the selected deployment.

This setup enables each deployment to scale based on its own metrics, avoiding conflicts or unexpected behavior during rollouts.

## Upgrade to the Standard plan

If you're on the Basic plan and constrained by one or more of these limits, you can upgrade to the Standard plan. To upgrade, go to the **Pricing** plan menu by first selecting the **Standard tier** column and then selecting the **Upgrade** button.

## Next steps

* [Overview of autoscale in Microsoft Azure](/azure/azure-monitor/autoscale/autoscale-overview)
* [Azure CLI Monitoring autoscale](/cli/azure/monitor/autoscale)

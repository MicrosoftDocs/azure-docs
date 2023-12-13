---
title: "Set up autoscale for applications"
description: This article describes how to set up Autoscale settings for your applications using the Microsoft Azure portal or the Azure CLI.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 11/03/2021
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Set up autoscale for applications

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article describes how to set up Autoscale settings for your applications using the Microsoft Azure portal or the Azure CLI.

Autoscale is a built-in feature of Azure Spring Apps that helps applications perform their best when demand changes. Azure Spring Apps supports scale-out and scale-in, which includes modifying the number of app instances and load balancing.

## Prerequisites

To follow these procedures, you need:

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* A deployed Azure Spring Apps service instance. Follow the [quickstart on deploying an app via the Azure CLI](./quickstart.md) to get started.
* At least one application already created in your service instance.

## Navigate to the Autoscale page in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Go to the Azure Spring Apps **Overview** page.
1. Select the **Apps** tab under **Settings** in the menu on the left navigation pane.
1. Select the application for which you want to set up Autoscale. In this example, select the application named **demo**. You should then see the application's **Overview** page.
1. Go to the **Scale out** tab under **Settings** in the menu on the left navigation pane.

## Set up Autoscale settings for your application in the Azure portal

There are two options for Autoscale demand management:

* Manual scale: Maintains a fixed instance count. In the Standard plan, you can scale out to a maximum of 500 instances. This value changes the number of separate running instances of the application.
* Custom autoscale: Scales on any schedule, based on any metrics.

In the Azure portal, choose how you want to scale. The following figure shows the **Custom autoscale** option and mode settings.

:::image type="content" source="media/spring-cloud-autoscale/custom-autoscale.png" alt-text="Screenshot of Azure portal showing the **Autoscale setting** page with the **Custom autoscale** option highlighted.":::

## Set up Autoscale settings for your application in Azure CLI

You can also set Autoscale modes using the Azure CLI. The following commands create an Autoscale setting and an Autoscale rule.

* Create Autoscale setting:

   ```azurecli
   az monitor autoscale create \
       --resource-group <resource-group-name> \
       --name <autoscale-setting-name> \
       --resource /subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.AppPlatform/Spring/<service-instance-name>/apps/<app-name>/deployments/<deployment-name> \
       --min-count 1 \
       --max-count 5 \
       --count 1
   ```

* Create Autoscale rule:

   ```azurecli
   az monitor autoscale rule create \
       --resource-group <resource-group-name> \
       --autoscale-name <autoscale-setting-name> \
       --scale out 1 \
       --cooldown 1 \
       --condition "tomcat.global.request.total.count > 100 avg 1m where AppName == <app-name> and Deployment == <deployment-name>"
   ```

For information on the available metrics, see the [User metrics options](./concept-metrics.md#user-metrics-options) section of [Metrics for Azure Spring Apps](./concept-metrics.md).

## Upgrade to the Standard plan

If you're on the Basic plan and constrained by one or more of these limits, you can upgrade to the Standard plan. To upgrade, go to the **Pricing** plan menu by first selecting the **Standard tier** column and then selecting the **Upgrade** button.

## Next steps

* [Overview of autoscale in Microsoft Azure](../azure-monitor/autoscale/autoscale-overview.md)
* [Azure CLI Monitoring autoscale](/cli/azure/monitor/autoscale)

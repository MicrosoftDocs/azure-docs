---
title: Autoscale in Azure using a custom metric
description: Learn how to scale your web app by using custom metrics in the Azure portal.
author: EdB-MSFT
ms.author: edbaynash
ms.service: azure-monitor
ms.subservice: autoscale
ms.topic: how-to
ms.date: 07/09/2023
ms.reviewer: akkumari

# Customer intent: As a user or dev ops administrator, I want to use the portal to set up autoscale so I can scale my resources.

---
# Autoscale a web app by using custom metrics

This article describes how to set up autoscale for a web app by using a custom metric in the Azure portal.

Autoscale allows you to add and remove resources to handle increases and decreases in load. In this article, we'll show you how to set up autoscale for a web app by using one of the Application Insights metrics to scale the web app in and out.

> [!NOTE]
> Autoscaling on custom metrics in Application Insights is supported only for metrics published to **Standard** and **Azure.ApplicationInsights** namespaces. If any other namespaces are used for custom metrics in Application Insights, it returns an **Unsupported Metric** error.

Azure Monitor autoscale applies to:

+ [Azure Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/)
+ [Azure Cloud Services](https://azure.microsoft.com/services/cloud-services/)
+ [Azure App Service - Web Apps](https://azure.microsoft.com/services/app-service/web/)
+ [Azure Data Explorer cluster](https://azure.microsoft.com/services/data-explorer/) 
+ Integration service environment and [Azure API Management](../../api-management/api-management-key-concepts.md)

## Prerequisite

You need an Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free).

## Overview

To create an autoscaled web app:

1. If you don't already have one, [create an App Service plan](#create-an-app-service-plan). You can't set up autoscale for free or basic tiers.
1. If you don't already have one, [create a web app](#create-a-web-app) by using your service plan.
1. [Configure autoscaling](#configure-autoscale) for your service plan.

## Create an App Service plan

An App Service plan defines a set of compute resources for a web app to run on.

1. Open the [Azure portal](https://portal.azure.com).
1. Search for and select **App Service plans**.

    :::image type="content" source="media\autoscale-custom-metric\search-app-service-plan.png" alt-text="Screenshot that shows searching for App Service plans.":::

1. On the **App Service plan** page, select **Create**.
1. Select a **Resource group** or create a new one.
1. Enter a **Name** for your plan.
1. Select an **Operating system** and **Region**.
1. Select an **SKU** and **size**.

    > [!NOTE]
    > You can't use autoscale with free or basic tiers.

1. Select **Review + create** > **Create**.

    :::image type="content" source="media\autoscale-custom-metric\create-app-service-plan.png" alt-text="Screenshot that shows the Basics tab of the Create App Service Plan screen on which you configure the App Service plan.":::

## Create a web app

1. Search for and select **App services**.

    :::image type="content" source="media\autoscale-custom-metric\search-app-services.png" alt-text="Screenshot that shows searching for App Services.":::

1. On the **App Services** page, select **Create**.
1. On the **Basics** tab, enter a **Name** and select a **Runtime stack**.
1. Select the **Operating System** and **Region** that you chose when you defined your App Service plan.
1. Select the **App Service plan** that you created earlier.
1. Select the **Monitoring** tab.

    :::image type="content" source="media\autoscale-custom-metric\create-web-app.png" alt-text="Screenshot that shows the Basics tab of the Create Web App page where you set up a web app.":::

1. On the **Monitoring** tab, select **Yes** to enable Application Insights.
1. Select **Review + create** > **Create**.

    :::image type="content" source="media\autoscale-custom-metric\enable-application-insights.png"alt-text="Screenshot that shows the Monitoring tab of the Create Web App page where you enable Application Insights.":::

## Configure autoscale

Configure the autoscale settings for your App Service plan.

1. Search and select **autoscale** in the search bar or select **Autoscale** under **Monitor** in the menu bar on the left.
1. Select your App Service plan. You can only configure production plans.

    :::image type="content" source="media\autoscale-custom-metric\autoscale-overview-page.png" alt-text="Screenshot that shows the Autoscale page where you select the resource to set up autoscale.":::

### Set up a scale-out rule

Set up a scale-out rule so that Azure spins up another instance of the web app when your web app is handling more than 70 sessions per instance.

1. Select **Custom autoscale**.
1. In the **Rules** section of the default scale condition, select **Add a rule**.

    :::image type="content" source="media/autoscale-custom-metric/autoscale-settings.png" alt-text="Screenshot that shows the Autoscale setting page where you set up the basic autoscale settings.":::

1. From the **Metric source** dropdown, select **Other resource**.
1. From **Resource type**, select **Application Insights**.
1. From the **Resource** dropdown, select your web app.
1. Select a **Metric name** to base your scaling on. For example, use **Sessions**.
1. Select the **Enable metric divide by instance count** checkbox so that the number of sessions per instance is measured.
1. From the **Operator** dropdown, select **Greater than**.
1. Enter the **Metric threshold to trigger the scale action**. For example, use **70**.
1. Under **Action**, set **Operation** to **Increase count by**. Set **Instance count** to **1**.
1. Select **Add**.

    :::image type="content" source="media/autoscale-custom-metric/scale-out-rule.png" alt-text="Screenshot that shows the Scale rule page where you configure the scale-out rule.":::

### Set up a scale-in rule

Set up a scale-in rule so that Azure spins down one of the instances when the number of sessions your web app is handling is less than 60 per instance. Azure reduces the number of instances each time this rule is run until the minimum number of instances is reached.

1. In the **Rules** section of the default scale condition, select **Add a rule**.
1. From the **Metric source** dropdown, select **Other resource**.
1. From **Resource type**, select **Application Insights**.
1. From the **Resource** dropdown, select your web app.
1. Select a **Metric name** to base your scaling on. For example, use **Sessions**.
1. Select the **Enable metric divide by instance count** checkbox so that the number of sessions per instance is measured.
1. From the **Operator** dropdown, select **Less than**.
1. Enter the **Metric threshold to trigger the scale action**. For example, use **60**.
1. Under **Action**, set **Operation** to **Decrease count by** and set **Instance count** to **1**.
1. Select **Add**.

    :::image type="content" source="media/autoscale-custom-metric/scale-in-rule.png" alt-text="Screenshot that shows the Scale rule page where you configure the scale-in rule.":::

### Limit the number of instances

1. Set the maximum number of instances that can be spun up in the **Maximum** field of the **Instance limits** section. For example, use **4**.
1. Select **Save**.

   :::image type="content" source="media/autoscale-custom-metric/autoscale-instance-limits.png" alt-text="Screenshot that shows the Autoscale setting page where you set up instance limits.":::

## Clean up resources

If you're not going to continue to use this application, delete resources.

1. On the App Service overview page, select **Delete**.

    :::image type="content" source="media/autoscale-custom-metric/delete-web-app.png" alt-text="Screenshot that shows the App Service page where you can delete the web app.":::

1. On the **App Service plans** page, select **Delete**. The autoscale settings are deleted along with the App Service plan.

    :::image type="content" source="media/autoscale-custom-metric/delete-service-plan.png" alt-text="Screenshot that shows the App Service plans page where you can delete the App Service plan.":::

## Next steps

To learn more about autoscale, see the following articles:

+ [Use autoscale actions to send email and webhook alert notifications](./autoscale-webhook-email.md)
+ [Overview of autoscale](./autoscale-overview.md)
+ [Azure Monitor autoscale common metrics](./autoscale-common-metrics.md)
+ [Best practices for Azure Monitor autoscale](./autoscale-best-practices.md)
+ [Autoscale REST API](/rest/api/monitor/autoscalesettings)

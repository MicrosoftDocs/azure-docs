---
title: How to autoscale in Azure using a custom metric
description: Learn how to scale your web app is custom metric in the Azure portal
author: EdB-MSFT
ms.author: edbaynash
ms.service: azure-monitor
ms.subservice: autoscale
ms.topic: how-to
ms.date: 06/22/2022
ms.reviewer: riroloff

# Customer intent: As a user or dev ops administrator I want to use the portal to set up autoscale so I can scale my resources.

---
# How to autoscale a web app using custom metrics.

This article describes how to set up autoscale for a web app using a custom metric in the Azure portal.

Autoscale allows you to add and remove resources to handle increases and decreases in load. In this article we'll show you how to set up autoscale for a web app, using one of the Application Insights metrics to scale the web app in and out.

Azure Monitor autoscale applies to:
+ [Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/)
+ [Cloud Services](https://azure.microsoft.com/services/cloud-services/)
+ [App Service - Web Apps](https://azure.microsoft.com/services/app-service/web/)
+ [Azure Data Explorer Cluster](https://azure.microsoft.com/services/data-explorer/) 
+ Integration Service Environment and [API Management services](../../api-management/api-management-key-concepts.md).

## Prerequisites
An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).

## Overview
To create an autoscaled web app, follow the steps below.
1. If you do not already have one, [Create an App Service Plan](#create-an-app-service-plan). Note that you can't set up autoscale for free or basic tiers.
1. If you do not already have one, [Create a web app](#create-a-web-app) using your service plan.
1. [Configure autoscaling](#configure-autoscale) for your service plan.

  
## Create an App Service Plan  

An App Service plan defines a set of compute resources for a web app to run on.  

1. Open the [Azure portal](https://portal.azure.com).
1. Search for and select **App Service plans**.

    :::image type="content" source="media\autoscale-custom-metric\search-app-service-plan.png" alt-text="Screenshot of the search bar, searching for app service plans.":::

1. Select **Create** from the **App Service plan** page.
1. Select a **Resource group** or create a new one.
1. Enter a **Name** for your plan.
1. Select an **Operating system** and **Region**.
1. Select an **Sku and size**. 
    > [!NOTE]
    > You cannot use autoscale with free or basic tiers.  

1. Select **Review + create**, then **Create**.

    :::image type="content" source="media\autoscale-custom-metric\create-app-service-plan.png" alt-text="Screenshot of the Basics tab of the Create App Service Plan screen that you configure the App Service plan on.":::

## Create a web app

1. Search for and select *App services*.

    :::image type="content" source="media\autoscale-custom-metric\search-app-services.png" alt-text="Screenshot of the search bar, searching for app service.":::

1. Select **Create** from the **App Services** page.
1. On the **Basics** tab, enter a **Name** and select a **Runtime stack**.
1. Select the **Operating System** and **Region** that you chose when defining your App Service plan.
1. Select the **App Service plan** that you created earlier.
1. Select the **Monitoring** tab from the menu bar.

    :::image type="content" source="media\autoscale-custom-metric\create-web-app.png" alt-text="Screenshot of the Basics tab of the Create web app page  where you set up a web app.":::

1. On the **Monitoring** tab, select **Yes** to enable Application Insights.
1. Select **Review + create**, then **Create**.

    :::image type="content" source="media\autoscale-custom-metric\enable-application-insights.png"alt-text="Screenshot of the Monitoring tab of the Create web app page where you enable Application Insights."::: 


## Configure autoscale
Configure the autoscale settings for your App Service plan.

1. Search and select *autoscale* in the search bar or select **Autoscale** under **Monitor** in the side menu bar.
1. Select your App Service plan. You can only configure production plans.

    :::image type="content" source="media\autoscale-custom-metric\autoscale-overview-page.png" alt-text="A screenshot of the autoscale landing page where you select the resource to set up autoscale for.":::

### Set up a scale out rule
Set up a scale out rule so that Azure spins up an additional instance of the web app, when your web app is handling more than 70 sessions per instance.

1. Select **Custom autoscale**.
1.  In the **Rules** section of the default scale condition, select **Add a rule**.

    :::image type="content" source="media/autoscale-custom-metric/autoscale-settings.png" alt-text="A screenshot of the autoscale settings page where you set up the basic autoscale settings.":::

1. From the **Metric source** dropdown, select **Other resource**.
1. From **Resource Type**, select **Application Insights**.
1. From the **Resource** dropdown, select your web app.
1. Select a **Metric name** to base your scaling on, for example *Sessions*.
1. Select **Enable metric divide by instance count** so that the number of sessions per instance is measured.
1. 1. From the **Operator** dropdown, select **Greater than**.
1. Enter the **Metric threshold to trigger the scale action**, for example, *70*.
1. Under **Actions**, set the **Operation** to *Increase count* and set the **Instance count** to *1*.
1. Select **Add**.

    :::image type="content" source="media/autoscale-custom-metric/scale-out-rule.png" alt-text="A screenshot of the Scale rule page where you configure the scale out rule.":::


### Set up a scale in rule
Set up a scale in rule so Azure spins down one of the instances when the number of sessions your web app is handling is less than 60 per instance. Azure will reduce the number of instances each time this rule is run until the minimum number of instances is reached.
1.  In the **Rules** section of the default scale condition, select **Add a rule**.
1. From the **Metric source** dropdown, select **Other resource**.
1. From **Resource Type**, select **Application Insights**.
1. From the **Resource** dropdown, select your web app.
1. Select a **Metric name** to base your scaling on, for example *Sessions*.
1. Select **Enable metric divide by instance count** so that the number of sessions per instance is measured.
1. From the **Operator** dropdown, select **Less than**.
1. Enter the **Metric threshold to trigger the scale action**, for example, *60*. 
1. Under **Actions**, set the **Operation** to **Decrease count** and set the **Instance count** to *1*.
1. Select **Add**.

    :::image type="content" source="media/autoscale-custom-metric/scale-in-rule.png" alt-text="A screenshot of the Scale rule page where you configure the scale in rule.":::

### Limit the number of instances

1. Set the maximum number of instances that can be spun up in the **Maximum** field of the **Instance limits** section, for example, *4*.
1. Select **Save**.

  :::image type="content" source="media/autoscale-custom-metric/autoscale-instance-limits.png" alt-text="A screenshot of the autoscale settings page where you set up instance limits.":::

## Clean up resources

If you're not going to continue to use this application, delete
resources with the following steps:
1. From the App service overview page, select **Delete**.

    :::image type="content" source="media/autoscale-custom-metric/delete-web-app.png" alt-text="A screenshot of the App Service page where you can Delete the web app.":::

1. From The App Service Plan page, select **Delete**. The autoscale settings are deleted along with the App Service plan.

    :::image type="content" source="media/autoscale-custom-metric/delete-service-plan.png" alt-text="A screenshot of the App Service plan page where you can Delete the app service plan.":::

## Next steps
Learn more about autoscale by referring to the following articles:
- [Use autoscale actions to send email and webhook alert notifications](./autoscale-webhook-email.md)
- [Overview of autoscale](./autoscale-overview.md)
- [Azure Monitor autoscale common metrics](./autoscale-common-metrics.md)
- [Best practices for Azure Monitor autoscale](./autoscale-best-practices.md)
- [Autoscale REST API](/rest/api/monitor/autoscalesettings)
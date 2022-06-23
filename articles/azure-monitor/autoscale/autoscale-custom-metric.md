---
title: Autoscale in Azure using a custom metric
description: Learn how to scale your resource by custom metric in Azure.
ms.topic: conceptual
ms.date: 05/07/2017
ms.subservice: autoscale
ms.reviewer: riroloff

# Customer intent: As a user or dev ops administartor I want to use the portal to set up autoscale sp I can scale my resources.

---
# Quickstart: Autoscale a Web app using custom metrics.

This article describes how to set up Autoscale for a Web app using a custom metric in Azure portal.

Autoscale allows you to add and remove resources to handle increases and decreseases in load. In this article we'll show you how to set up Autoscale for a Web app, based on metrics from Application Insights. We'll use a one of the Application Insights metrics to scale theWeb app in and out based on the metric's value.

Azure Monitor Autoscale applies to [Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/), [Cloud Services](https://azure.microsoft.com/services/cloud-services/), [App Service - Web Apps](https://azure.microsoft.com/services/app-service/web/), [Azure Data Explorer Cluster](https://azure.microsoft.com/services/data-explorer/) , 	
Integration Service Environment and [API Management services](../../api-management/api-management-key-concepts.md).

## Prerequisites
An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).

## Overview
To create an autoscaled Web app we will follow the steps below:
1. Create an App Service Plan
1. Create an App Service using the service plan
1. Configure auto scaling for for the service plan.


## Create an App Service plan
An App Service plan defines a set of compute resources for a web app to run on.  

1. Open the [Azure portal](https://portal.azure.com)
1. Search for and select App Service plans.
:::image type="content" source="media\autoscale-custom-metric\search-app-service-plan.png" alt-text="Search for app service plans":::

1. Select **Create** from the App Service plan overview page.
1. Select a **Resource group** or create a new one.
1. Enter a **Name** for your plan.
1. Select an **Operating system** and **Region**
1. Select an **Sku and size**. 
    >[!NOTE] You cannot use autoscale with free or basic tiers.
1. Select **Review + create**, then **Create**.
:::image type="content" source="media\autoscale-custom-metric\create-app-service-plan.png" alt-text="Create an app service plan":::

## Create an App Service  

1. Search for and select App services
:::image type="content" source="media\autoscale-custom-metric\search-app-services.png" alt-text="Search for app service":::

1. Select **Create** from the App Services overview page.
1. Enter a **Name** and select a **Runtime stack**.
1. Select the **Operating System** and **Region** that you chose when defining your App Service plan.
1. Select the **App Service plan** that you created earlier.
:::image type="content" source="media\autoscale-custom-metric\create-web-app.png" alt-text="Create a web app":::
1. Select **Monitoring** from the menu bar.
1. Select **Yes** to enable Application Insights.
1. Select **Review + create**, then **Create**.
:::image type="content" source="media\autoscale-custom-metric\enable-application-insights.png"alt-text="Enable Application Insights"::: 

## Configure Autoscale
Now that you have your App Service plane and Web app configured, configure the Autoscale settings.
1. Search and aselect *Autoscale* in the search bar or select **Autoscale** under **Monitor** in the side menu bar.
1. Select the App Service plan that you created earlier. Note that the **Austoscale status** is for free tier service plans is **Not Available**
:::image type="content" source="media\autoscale-custom-metric\autoscale-overview-page.png" alt-text="Autoscale overview page":::

1. Select **Custom autoscale**.

### Setup a scale out rule
1. Select **Add a rule** in the **Rules** section of the default scale condition.
:::image type="content" source="media/autoscale-custom-metric/autoscale-settings.png" alt-text="Autoscale settings":::

1. Select *Other resource* from the **Metric source** dropdown.
1. Select *Application Insights* from the **Resource Type**
1. Select your Web app from the **Resource** dropdown.
1. Select a metric to base your scaling on, for example *Sessions*
1. Select *Greater than* from the **Operator** dropdown.
1. Enter the **Metric threshold to triger the scale action**, for example, *70*.
1. Under **Actions**, set the **Operation** to *Increase count* and set the **Instance count** to *1*.
1. Select **Add**.
:::image type="content" source="media/autoscale-custom-metric/scale-out-rule.png" alt-text="Configure the scale out rule":::

You have set up a scale out rule. When the number of sessions  your Web app is handling is greater than 70, an additional instance of the Web app will be spun up.
Now lets set up the scale in rule.
### Setup a scale in rule
1. Select **Add a rule** in the **Rules** section of the default scale condition.
1. Select *Other resource* from the **Metric source** dropdown.
1. Select *Application Insights* from the **Resource Type**
1. Select your Web app from the **Resource** dropdown.
1. Select a metric to base your scaling on, for example *Sessions*
1. Select *Less than* from the **Operator** dropdown.
1. Enter the **Metric threshold to triger the scale action**, for example, *60*. 
1. Under **Actions**, set the **Operation** to *Decrease count* and set the **Instance count** to *1*.
1. Select **Add**.
:::image type="content" source="media/autoscale-custom-metric/scale-in-rule.png" alt-text="Configure the scale in rule":::

You have now  set up a scale in rule. When the number of sessions your Web app is handling is less than 60, an instance of the Web app will be spun down.

### Limit the number of instances

1. Set the mamimum number of instances that can be spun up in the **Maximum** field of the **Intance limits** section, for example, *4*.
1. Select **Save**.
:::image type="content" source="media/autoscale-custom-metric/autoscale-instance-limits.png" alt-text="Configure the scale in rule":::

### Summary
- In this Quickstart you created a Web app belonging to an App Service plan.
- You created an autoscale condition for tha your App Service plan that scales your Web app in and out based on the number of sessions your web app is handling.
- When the average number of sessions exceeds 70 for 10 minutes, an additional instance will be added, up to the maximum number of instances.
- When the average number of sessions falls below 60 for 10 minutes, an instance will be removed, until the minimum number of instances has been reached.
- The default and minimum number of Web app instances is 1.
- The maximum number of instances is 4.

## Clean up resources

If you're not going to continue to use this application, delete
resources with the following steps:
1. Delete the Autoscale setting by selecting **Discard**.
:::image type="content" source="media/autoscale-custom-metric/discard-autoscale-settings.png" alt-text="Discard autoscale settings":::

1. From the Web app overview page select **Delete**.
:::image type="content" source="media/autoscale-custom-metric/delete-webapp.png" alt-text="Discard autoscale settings":::

1. From The App Service Plan page, select **Delete**.
:::image type="content" source="media/autoscale-custom-metric/delete-service-plan.png" alt-text="Discard autoscale settings":::

## Next steps

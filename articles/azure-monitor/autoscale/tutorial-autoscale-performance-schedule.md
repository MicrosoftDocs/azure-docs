---
title: Autoscale Azure resources based on data or schedule
description: Create an autoscale setting for an app service plan by using metric data and a schedule.
author: EdB-MSFT
ms.author: edbaynash
services: azure-monitor
ms.topic: tutorial
ms.date: 12/11/2017
ms.custom: mvc
ms.subservice: autoscale
ms.reviewer: akkumari
---

# Create an autoscale setting for Azure resources based on performance data or a schedule

Autoscale settings enable you to add or remove instances of service based on preset conditions. These settings can be created through the portal. This method provides a browser-based user interface for creating and configuring an autoscale setting.

In this tutorial, you will:
> [!div class="checklist"]
> * Create a web app and Azure App Service plan.
> * Configure autoscale rules for scale-in and scale-out based on the number of requests a web app receives.
> * Trigger a scale-out action and watch the number of instances increase.
> * Trigger a scale-in action and watch the number of instances decrease.
> * Clean up your resources.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create a web app and App Service plan
1. On the menu on the left, select **Create a resource**.
1. Search for and select the **Web App** item and select **Create**.
1. Select an app name like **MyTestScaleWebApp**. Create a new resource group **myResourceGroup** or place it into a resource group of your choosing.

Within a few minutes, your resources should be provisioned. Use the web app and corresponding App Service plan in the remainder of this tutorial.

   ![Screenshot that shows creating a new app service in the portal.](./media/tutorial-autoscale-performance-schedule/Web-App-Create.png)

## Go to autoscale settings
1. On the menu on the left, select **Monitor**. Then select the **Autoscale** tab.
1. A list of the resources under your subscription that support autoscale are listed here. Identify the App Service plan that was created earlier in the tutorial, and select it.

    ![Screenshot shows the Azure portal with Monitor and Autoscale selected.](./media/tutorial-autoscale-performance-schedule/monitor-blade-autoscale.png)

1. On the **Autoscale setting** screen, select **Enable autoscale**.

The next few steps help you fill the **Autoscale setting** screen to look like the following screenshot.

   ![Screenshot that shows saving the autoscale setting.](./media/tutorial-autoscale-performance-schedule/Autoscale-Setting-Save.png)

## Configure default profile
1. Provide a name for the autoscale setting.
1. In the default profile, ensure **Scale mode** is set to **Scale to a specific instance count**.
1. Set **Instance count** to **1**. This setting ensures that when no other profile is active, or in effect, the default profile returns the instance count to **1**.

   ![Screenshot that shows the Autoscale setting screen with a name entered for the setting.](./media/tutorial-autoscale-performance-schedule/autoscale-setting-profile.png)

## Create recurrence profile

1. Select the **Add a scale condition** link under the default profile.

1. Edit the name of this profile to be **Monday to Friday profile**.

1. Ensure **Scale mode** is set to **Scale based on a metric**.

1. For **Instance limits**, set **Minimum** as **1**, **Maximum** as **2**, and **Default** as **1**. This setting ensures that this profile doesn't autoscale the service plan to have less than one instance or more than two instances. If the profile doesn't have sufficient data to make a decision, it uses the default number of instances (in this case, one).

1. For **Schedule**, select **Repeat specific days**.

1. Set the profile to repeat Monday through Friday, from 09:00 PST to 18:00 PST. This setting ensures that this profile is only active and applicable 9 AM to 6 PM, Monday through Friday. During all other times, the **Default** profile is the profile the autoscale setting uses.

## Create a scale-out rule

1. In the **Monday to Friday profile** section, select the **Add a rule** link.

1. Set **Metric source** to be **Other resource**. Set **Resource type** as **App Services** and set **Resource** as the web app you created earlier in this tutorial.

1. Set **Time aggregation** as **Total**, set **Metric name** as **Requests**, and set **Time grain statistic** as **Sum**.

1. Set **Operator** as **Greater than**, set **Threshold** as **10**, and set **Duration** as **5** minutes.

1. Set **Operation** as **Increase count by**, set **Instance count** as **1**, and set **Cool down** as **5** minutes.

1. Select **Add**.

This rule ensures that if your web app receives more than 10 requests within 5 minutes or less, one other instance is added to your App Service plan to manage load.

   ![Screenshot that shows creating a scale-out rule.](./media/tutorial-autoscale-performance-schedule/Scale-Out-Rule.png)

## Create a scale-in rule
We recommend that you always have a scale-in rule to accompany a scale-out rule. Having both ensures that your resources aren't overprovisioned. Overprovisioning means you have more instances running than needed to handle the current load.

1. In the **Monday to Friday profile**, select the **Add a rule** link.

1. Set **Metric source** to **Other resource**. Set **Resource type** as **App Services**, and set **Resource** as the web app you created earlier in this tutorial.

1. Set **Time aggregation** as **Total**, set **Metric name** as **Requests**, and set **Time grain statistic** as **Average**.

1. Set **Operator** as **Less than**, set **Threshold** as **5**, and set **Duration** as **5** minutes.

1. Set **Operation** as **Decrease count by**, set **Instance count** as **1**, and set **Cool down** as **5** minutes.

1. Select **Add**.

    ![Screenshot that shows creating a scale-in rule.](./media/tutorial-autoscale-performance-schedule/Scale-In-Rule.png)

1. Save the autoscale setting.

    ![Screenshot that shows saving autoscale setting.](./media/tutorial-autoscale-performance-schedule/Autoscale-Setting-Save.png)

## Trigger scale-out action
To trigger the scale-out condition in the autoscale setting you created, the web app must have more than 10 requests in less than 5 minutes.

1. Open a browser window and go to the web app you created earlier in this tutorial. You can find the URL for your web app in the Azure portal by going to your web app resource and selecting **Browse** on the **Overview** tab.

1. In quick succession, reload the page more than 10 times.

1. On the menu on the left, select **Monitor**. Then select the **Autoscale** tab.

1. From the list, select the App Service plan used throughout this tutorial.

1. On the **Autoscale setting** screen, select the **Run history** tab.

1. You see a chart that reflects the instance count of the App Service plan over time. In a few minutes, the instance count should rise from **1** to **2**.

1. Under the chart, you see the activity log entries for each scale action taken by this autoscale setting.

## Trigger scale-in action
The scale-in condition in the autoscale setting triggers if there are fewer than five requests to the web app over a period of 10 minutes.

1. Ensure no requests are being sent to your web app.

1. Load the Azure portal.

1. On the menu on the left, select **Monitor**. Then select the **Autoscale** tab.

1. From the list, select the App Service plan used throughout this tutorial.

1. On the **Autoscale setting** screen, select the **Run history** tab.

1. You see a chart that reflects the instance count of the App Service plan over time. In a few minutes, the instance count should drop from **2** to **1**. The process takes at least 100 minutes.

1. Under the chart, you see the corresponding set of activity log entries for each scale action taken by this autoscale setting.

    ![Screenshot that shows viewing scale-in actions.](./media/tutorial-autoscale-performance-schedule/Scale-In-Chart.png)

## Clean up resources

1. On the menu on the left in the Azure portal, select **All resources**. Then select the web app created in this tutorial.

1. On your resource page, select **Delete**. Confirm delete by entering **yes** in the text box, and then select **Delete**.

1. Select the App Service plan resource and select **Delete**.

1. Confirm delete by entering **yes** in the text box, and then select **Delete**.

## Next steps

To learn more about autoscale settings, see [Autoscale overview](../autoscale/autoscale-overview.md).

> [!div class="nextstepaction"]
> [Archive your monitoring data](../essentials/platform-logs-overview.md)

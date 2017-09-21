---
title: Browse resource metrics in Azure Portal | Microsoft Docs
description: Visualize and understand the metrics being emmited for a Logic App in the portal
author: anirudhcavale
manager: orenr
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.service: monitoring-and-diagnostics
ms.topic: quickstart
ms.date: 09/25/2017
ms.author: ancav
ms.custom: mvc
---

# How do I browse metrics for my resources in Azure Portal

Metrics for many resources can be visualized through the Azure portal. This method provides a browser-based user interface to discover and plot metrics for Azure resources. This Quickstart steps through creating a Logic App, creating a job, and visualizing the metrics for the logic app.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create a Logic App

1. Click the **New** button found on the upper left-hand corner of the Azure portal.

2. Search for and select **Logic App**. Click the **Create** button.

3. Enter the logic app information and check the **Pin to Dashboard** option. When complete, click **Create**.

    ![Enter basic information about your logic app in the portal blade](./media/monitor-quick-resource-metrics-portal/create-logic-app-portal.jpg)  

4. The logic app should be pinned to your dashboard. Navigate to the logic app by clicking on it.

5. In the Logic App blade, select the **Logic App Designer**

6. In the designer select the **Recurrence** trigger.

    ![Create a recurrence trigger in the logic app designer in the portal blade](./media/monitor-quick-resource-metrics-portal/logic-app-designer.jpg)  

7. Set an **Interval** of 20 and a **Frequency** of second to ensure your logic app is triggered every 20 seconds

8. Click the **New Step** button, select **Add an action**, choose the **HTTP** option, and select **HTTP-HTTP**

10. Set the **Method** as post and the **Uri** to a web address of your choice

    ![Configure the logic app trigger in the portal blade](./media/monitor-quick-resource-metrics-portal/create-logic-app-triggers.jpg)

11. Click **Save**

## View metrics for your logic app

1. Click the **Monitor** option in the left-hand navigation pane

2. Select the **Metrics** tab, fill in the **Subscription**, **Resource Group**, **Resource Type** and **Resource** information for your logic app

3. From the list of metrics, choose **Runs Started**

4. Modify the **Time range** of the chart to display data for the past hour

5. You should now see a chart plotting the total number of runs your logic app has started over the past hour

    ![Plot a metric chart for the logic app resource](./media/monitor-quick-resource-metrics-portal/logic-app-metric-chart.jpg)

## Clean up resources

Other quick starts in this collection build upon this quick start. If you plan to continue on to work with subsequent quick starts or with the tutorials, do not clean up the resources created in this quick start. If you do not plan to continue, use the following steps to delete all resources created by this quick start in the Azure portal.

1. From the left-hand menu in the Azure portal, search for **Logic App** and then click **Logic apps**.
2. On the blade, click the logic app you created in this quickstart in the text box, and then click **Delete**.

## Next steps

In this quick start, you’ve learned how to plot and visualize metrics for your resources. For more information on metrics click through to our overview on metrics.

> [!div class="nextstepaction"]
> [Azure Monitor metrics overview](./monitoring-overview-metrics.md)

To learn how to create an alert on resource metrics, continue to our quickstart for metric alerts.

> [!div class="nextstepaction"]
> [Azure Monitor metric alerts quickstart](./monitor-quick-resource-metric-alert-portal.md)

---
title: Receive a notification when a metric value is abnormal | Microsoft Docs
description: Azure Monitor: Quickstart guide to help users create a metric for a Logic App
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

# Receive a notification when a metric value is abnormal

Azure Monitor makes metrics available for many Azure resources. These metrics convey the performance and health of those resources. In many cases metric values can be indicative of something being wrong with a resource. Many users create metric alerts to monitor for anomalous behavior and be notified if it occurs. This Quickstart steps through creating an alert, and receiving a notification for a metric for a Logic App resource.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/).

## Create logic app

1. Click the **New** button found on the upper left-hand corner of the Azure portal.

2. Search for and select **Logic App**. Click the **Create** button.

3. Enter the logic app information and check the **Pin to Dashboard** option. When complete, click **Create**.

    ![Enter basic information about your logic app in the portal blade](./media/monitoring-quick-resource-metric-alert-portal/create-logic-app-portal.JPG)  

4. The logic app should be pinned to your dashboard. Navigate to the logic app by clicking on it.

5. In the logic app blade, select the **Logic App Designer**

6. In the designer, select the **Recurrence** trigger.

    ![Created a recurrence trigger in the logic app designer in the portal blade](./media/monitoring-quick-resource-metric-alert-portal/logic-app-designer.JPG)  

7. Set an interval of 20 and a frequency of second to ensure your logic app is triggered every 20 seconds

8. Click the **New Step** button, and select **Add an action**

9. Choose the **HTTP** option, and select **HTTP-HTTP**

10. Set the **Method** as POST and the **Uri** to a web address of your choice

    ![Configure the logic app trigger in the portal blade](/media/monitoring-quick-resource-metric-alert-portal/create-logic-app-triggers.JPG)

11. Click **Save**

## Create a metric alert for your logic app

1. Click the **Monitor** option in the left-hand navigation pane

2. Select the **Metrics** tab, fill in the **Subscription**, **Resource Group**, **Resource Type**, and **Resource** information for your logic app

3. From the list of metrics, choose **Runs Failed**

4. Modify the **Time range** of the chart to display data for the past hour

5. You should now see a chart plotting the total number of runs that have failed for your logic app over the past hour

    ![Plot a metric chart for the logic app resource](/media/monitoring-quick-resource-metric-alert-portal/logic-app-metric-chart.JPG)

6. In the top right portion of the metrics blade click the **Add metric alert** button

7. Name your metric alert 'myLogicAppAlert', and provide a brief description for the alert

8. Set the **Condition** for the metric alert as 'Greater than', set the **Threshold** as '10', and set the **Period** as 'Over the last 5 minutes'

9. Finally, under **Additional administrator email(s)** enter your email address. This alert ensures that you receive an email in the event your logic app has more than 10 failed runs within a period of 5 minutes

    ![Configure the logic app alert in the portal blade](/media/monitoring-quick-resource-metric-alert-portal/logic-app-metric-alert-portal.JPG)

## Receive metric alert notifications for your logic app
1. Within a few moments, you should receive an email from 'Microsoft Azure Alerts' to inform you the alert has been 'activated'

2. Navigate back to your logic app and modify the recurrence trigger to an interval of 1 and frequency of hour

3. Within a few minutes, you should receive an email from 'Microsoft Azure Alerts' informing you the alert has been 'resolved'

## Clean up resources

Other quick starts in this collection build upon this quick start. If you plan to continue on to work with subsequent quick starts or with the tutorials, do not clean up the resources created in this quick start. If you do not plan to continue, use the following steps to delete all resources created by this quick start in the Azure portal.

1. From the left-hand menu in the Azure portal, click on **Monitor**

2. Select the **Alerts** tab, find the alert you created in this quickstart guide and click on it

3. In the metric alert blade, click **Delete**

4. From the left-hand menu in the Azure portal, search for **Logic App** and then click **Logic apps**.

5. On the blade, click the logic app you created in this quickstart in the text box, and then click **Delete**.

## Next steps

In this quick start, you’ve learned how to create a metric alert for your resources. For more information on metric alerts, click through to our overview on alerts.

> [!div class="nextstepaction"]
> [Azure Monitor alerts overview](./monitoring-overview-alerts.md)

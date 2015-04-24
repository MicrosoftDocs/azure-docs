<properties 
	pageTitle="Use Monitoring charts" 
	description="Learn how to customize monitoring charts in Azure." 
	authors="stepsic_microsoft_com" 
	manager="ronmart" 
	editor="" 
	services="na" 
	documentationCenter=""/>

<tags 
	ms.service="multiple" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/24/2015" 
	ms.author="stepsic"/>

# Use Monitoring charts

## Changing existing charts 

Azure services have a rich variety of metrics for you to track, and you can chart them over any time period you choose.

1. In the [portal](https://portal.azure.com/), click **Browse**, and then a resource you're interested in monitoring.
2. The **Monitoring** lens contains the most important metrics for each Azure resource. For example, a web app has **Requests and Errors**, where as a virtual machine would have **CPU percentage** and **Disk read and write**:
    ![Monitoring lens](./media/insights-how-to-customize-monitoring/Insights_MonitoringChart.png)
3. Clicking on any chart will show you the **Metric** blade. On the blade, in addition to the graph, is a table that shows you aggregations of the metrics (such as average, minimum and maximum, over the time range you chose). Below that are the alert rules for the resource.
    ![Metric blade](./media/insights-how-to-customize-monitoring/Insights_MetricBlade.png)
4. To customize the lines that appear, click the **Edit** button on the chart, or, the **Edit chart** button in the command bar.
5. On the Edit Query blade you can do three things: change the Time range, switch between Bar and Line, and, chose different metics.  
    ![Edit Query](./media/insights-how-to-customize-monitoring/Insights_EditQuery.png)
6. Changing the time range is as easy as selecting a different range (such as **Past Hour**) and clicking **Save** at the bottom of the blade. You can also choose **Custom**, which allows you to choose any period of time over the past 2 weeks. For example, you can see the whole two weeks, or, just 1 hour from yesterday. Type in the text box to enter a different hour.
    ![Custom time range](./media/insights-how-to-customize-monitoring/Insights_CustomTime.png)
8. Below the time range, you chan choose any number of metrics to show on the chart.
9. When you click Save your changes will be saved for that particular resource. For example, if you have two virtual machines, and you change a chart on one, it will not impact the other.

## Creating side-by-side charts

With the powerful customization in the portal you can add as many charts as you want.

1. In the **...** menu at the top of the blade click **Add tiles**:  
    ![Add Menu](./media/insights-how-to-customize-monitoring/Insights_AddMenu.png)
2. Then, you can select select a chart from the **Gallery** on the right side of your screen:
    ![Gallery](./media/insights-how-to-customize-monitoring/Insights_Gallery.png)
3. If you don't see the metric you want, you can always add one of the preset metrics, and Edit the chart to show the metric that you need. 

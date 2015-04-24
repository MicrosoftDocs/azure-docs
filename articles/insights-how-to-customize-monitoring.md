<properties 
	pageTitle="Use monitoring charts" 
	description="Learn how to customize monitoring charts in Azure." 
	authors="stepsic_microsoft_com" 
	manager="ronmart" 
	editor="" 
	services="application-insights" 
	documentationCenter=""/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/24/2015" 
	ms.author="stepsic"/>

# Customize monitoring charts

Azure services have a rich variety of metrics for you to track, and you can chart them over any time period you choose.

1. In the [portal](https://portal.azure.com/), click **Browse**, and then a resource you're interested in monitoring.
2. The **Monitoring** lens contains the most important metrics for each Azure resource. For example, a web app has **Requests and Errors**, where as a virtual machine would have **CPU percentage** and **Disk read and write**:
    ![Monitoring lens](./media/insights-how-to-customize-monitoring/Insights_MonitoringChart.png)
3. Clicking on any chart will show you the **Metric** blade. On the blade, in addition to the graph, is a table that shows you aggregations of the metrics (such as average, minimum and maximum, over the time range you chose). Below that are the alert rules for the resource.
    ![Metric blade](./media/insights-how-to-customize-monitoring/Insights_MetricBlade.png)
4. To customize the lines that appear, click the **Edit** button on the chart, or, the **Edit chart** button in the command bar:  
    ![Edit entry](./media/insights-how-to-customize-monitoring/Insights_MetricMenu.png)
5. On the Edit Query blade you can do three things: change the Time range, switch between Bar and Line, and, chose different metics.  
    ![Edit Query](./media/insights-how-to-customize-monitoring/Insights_EditQuery.png)
6. Changing the time range is as easy as selecting a different range (such as **Past Hour**) and clicking **Save** at the bottom of the blade. You can also choose **Custom**, which allows you to choose any period of time over the past 2 weeks. For example, you can see the whole two weeks, or, just 1 hour from yesterday. Type in the text box to enter a different hour.
    ![Custom time range](./media/insights-how-to-customize-monitoring/Insights_CustomTime.png)
8. Below the time range, you chan choose any number of metrics to show on the chart.
9. When you click Save your changes will be saved for that particular resource. For example, if you have two virtual machines, and you change a chart on one, it will not impact the other.

## Creating side-by-side charts

With the powerful customization in the portal you can add as many charts as you want.

1. In the **...** menu at the top of the blade click **Add parts**:  
    ![Add Menu](./media/insights-how-to-customize-monitoring/Insights_AddMenu.png)
2. Then, you can select select a chart from the **Gallery** on the right side of your screen:
    ![Gallery](./media/insights-how-to-customize-monitoring/Insights_Gallery.png)
3. If you don't see the metric you want, you can always add one of the preset metrics, and Edit the chart to show the metric that you need. 

<!--Link references-->

[alerts]: app-insightss-alerts.md
[android]: https://github.com/Microsoft/AppInsights-Android
[api]: app-insights-custom-events-metrics-api.md
[apiproperties]: app-insights-custom-events-metrics-api.md#properties
[apiref]: http://msdn.microsoft.com/library/azure/dn887942.aspx
[availability]: app-insights-monitor-web-app-availability.md
[azure]: insights-perf-analytics.md
[azure-availability]: insights-create-web-tests.md
[azure-usage]: insights-usage-analytics.md
[azurediagnostic]: insights-how-to-use-diagnostics.md
[client]: app-insights-web-track-usage.md
[config]: app-insights-configuration-with-applicationinsights-config.md
[data]: app-insights-data-retention-privacy.md
[desktop]: app-insights-windows-desktop.md
[detect]: app-insights-detect-triage-diagnose.md
[diagnostic]: app-insights-diagnostic-search.md
[eclipse]: app-insights-java-eclipse.md
[exceptions]: app-insights-web-failures-exceptions.md
[export]: app-insights-export-telemetry.md
[exportcode]: app-insights-code-sample-export-telemetry-sql-database.md
[greenbrown]: app-insights-start-monitoring-app-health-usage.md
[java]: app-insights-java-get-started.md
[javalogs]: app-insights-java-trace-logs.md
[javareqs]: app-insights-java-track-http-requests.md
[knowUsers]: app-insights-overview-usage.md
[metrics]: app-insights-metrics-explorer.md
[netlogs]: app-insights-asp-net-trace-logs.md
[new]: app-insights-create-new-resource.md
[older]: http://www.visualstudio.com/get-started/get-usage-data-vs
[perf]: app-insights-web-monitor-performance.md
[platforms]: app-insights-platforms.md
[portal]: http://portal.azure.com/
[qna]: app-insights-troubleshoot-faq.md
[redfield]: app-insights-monitor-performance-live-website-now.md
[roles]: app-insights-role-based-access-control.md
[start]: app-insights-get-started.md
[trace]: app-insights-search-diagnostic-logs.md
[track]: app-insights-custom-events-metrics-api.md
[usage]: app-insights-web-track-usage.md
[windows]: app-insights-windows-get-started.md
[windowsCrash]: app-insights-windows-crashes.md
[windowsUsage]: app-insights-windows-usage.md


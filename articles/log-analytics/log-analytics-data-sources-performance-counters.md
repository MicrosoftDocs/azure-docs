<properties 
   pageTitle="Windows and Linux performance counters in Log Analytics | Microsoft Azure"
   description="Performance counters are collected by Log Analytics to analyze performance on Windows and Linux agents.  This article describes how to configure collection of Performance counters for both Windows and Linux agents, details of they are stored in the OMS repository, and how to analyze them in the OMS portal."
   services="log-analytics"
   documentationCenter=""
   authors="bwren"
   manager="jwhit"
   editor="tysonn" />
<tags 
   ms.service="log-analytics"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/09/2016"
   ms.author="bwren" />

# Windows and Linux performance data sources in Log Analytics 

Performance counters in Windows and Linux provide insight into the performance of hardware components, operating systems, and applications.  Log Analytics can collect performance counters at frequent intervals for Near Real Time (NRT) analysis in addition to aggregating performance data for longer term analysis and reporting.

![Performance counters](media/log-analytics-data-sources-performance-counters/overview.png)

## Configuring Performance counters

Configure  Performance counters from the [Data menu in Log Analytics Settings](log-analytics-data-sources.md#configuring-data-sources).

When you first configure Windows or Linux Performance counters for a new OMS workspace, you are given the option to quickly create several common counters.  They are listed with a checkbox next to each.  Ensure that any counters you want to initially create are checked and then click **Add the selected performance counters**.

![Configure Windows Performance counters](media/log-analytics-data-sources-performance-counters/configure-windows.png)

Follow this procedure to add a new Windows performance counter to collect.

1. Type the name of the counter in the text box in the format *object(instance)\counter*.  When you start typing, you are presented with a matching list of common counters.  You can either select a counter from the list or type in one of your own.  You can also return all instances for a particular counter by specifying *object\counter*. 
2. Click **+** or press **Enter** to add the counter to the list.
3. When you add a counter, it uses the default of 10 seconds for its **Sample Interval**.  You can change this to a higher value of up to 1800 seconds (30 minutes) if you want to reduce the storage requirements of the collected performance data.
4. When you're done adding counters, click the **Save** button at the top of the screen to save the configuration.

![Configure Linux Performance counters](media/log-analytics-data-sources-performance-counters/configure-linux.png)

Follow this procedure to add a new Linux performance counter to collect.

1. By default, all configuration changes are automatically pushed to all agents.  For Linux agents, a configuration file is sent to the Fluentd data collector.  If you wish to modify this file manually on each Linux agent, then uncheck the box *Apply below configuration to my Linux machines*.
2. Type the name of the counter in the text box in the format *object(instance)\counter*.  When you start typing, you are presented with a matching list of common counters.  You can either select a counter from the list or type in one of your own.  
2. Click **+** or press **Enter** to add the counter to the list of other counters for the object.
3. All counters for an object use the same **Sample Interval**.  The default is 10 seconds.  You change this to a higher value of up to 1800 seconds (30 minutes) if you want to reduce the storage requirements of the collected performance data.
4. When you're done adding counters, click the **Save** button at the top of the screen to save the configuration.

## Data collection

Log Analytics collects all specified performance counters at their specified sample interval on all agents that have that counter installed.  The data is not aggregated, and the raw data is available in all log search views for the duration specified by your OMS subscription.


## Performance record properties

Performance records have a type of **Perf** and have the properties in the following table.

| Property | Description |
|:--|:--|
| Computer         | Computer that the event was collected from. |
| CounterName      | Name of the performance counter |
| CounterPath      | Full path of the counter in the form \\\\\<Computer>\\object(instance)\\counter. |
| CounterValue     | Numeric value of the counter.  |
| InstanceName     | Name of the event instance.  Empty if no instance. |
| ObjectName       | Name of the performance object |
| SourceSystem  | Type of agent the data was collected from. <br> OpsManager – Windows agent, either direct connect or SCOM <br> Linux – All Linux agents  <br> AzureStorage – Azure Diagnostics |
| TimeGenerated       | Date and time the data was sampled. |


## Sizing estimates

 A rough estimate for collection of a particular counter at 10-second intervals is about 1 MB per day per instance.  You can estimate the storage requirements of a particular counter with the following formula.

	1 MB x (number of counters) x (number of agents) x (number of instances)

## Log searches with Performance records

The following table provides different examples of log searches that retrieve Performance records.

| Query | Description |
|:--|:--|
| Type=Perf | All Performance data |
| Type=Perf Computer="MyComputer" | All Performance data from a particular computer |
| Type=Perf CounterName="Current Disk Queue Length" | All Performance data for a particular counter |
| Type=Perf (ObjectName=Processor) CounterName="% Processor Time" InstanceName=_Total &#124; measure Avg(Average) as AVGCPU  by Computer | Average CPU Utilization across all computers |
| Type=Perf (CounterName="% Processor Time") &#124;  measure max(Max) by Computer | Maximum CPU Utilization across all computers |
| Type=Perf ObjectName=LogicalDisk CounterName="Current Disk Queue Length" Computer="MyComputerName" &#124; measure Avg(Average) by InstanceName | Average Current Disk Queue length across all  the instances of a given computer |
| Type=Perf CounterName="DiskTransfers/sec" &#124; measure percentile95(Average) by Computer | 95th Percentile of Disk Transfers/Sec across all computers |
| Type=Perf CounterName="% Processor Time" InstanceName="_Total"  &#124; measure avg(CounterValue) by Computer Interval 1HOUR | Hourly average of CPU usage across all computers |
| Type=Perf Computer="MyComputer" CounterName=%* InstanceName=_Total &#124; measure percentile70(CounterValue) by CounterName Interval 1HOUR | Hourly 70 percentile of every % percent counter for a particular computer |
| Type=Perf CounterName="% Processor Time" InstanceName="_Total"  (Computer="MyComputer") &#124; measure min(CounterValue), avg(CounterValue), percentile75(CounterValue), max(CounterValue) by Computer Interval 1HOUR | Hourly average, minimum, maximum, and 75-percentile CPU usage for a specific computer |

## Viewing performance data

When you run a log search for performance data, the **Log** view is displayed by default.  To view the data in graphical form, click **Metrics**.  For a detailed graphical view, click the **+** next to a counter.  

![Metrics view collapsed](media/log-analytics-data-sources-performance-counters/metricscollapsed.png)

If the time range you have selected is 6 hours or less, then the graph is updated every few seconds.  The live data is displayed on the right side of the graph in light blue.

![Metrics view expanded with live data](media/log-analytics-data-sources-performance-counters/metricsexpanded.png)

To aggregate performance data in a log search, see [On-demand metric aggregation and visualization in OMS](http://blogs.technet.microsoft.com/msoms/2016/02/26/on-demand-metric-aggregation-and-visualization-in-oms/).

## Next steps

- Learn about [log searches](log-analytics-log-searches.md) to analyze the data collected from data sources and solutions.  
- Export collected data to [Power BI](log-analytics-powerbi.md) for additional visualizations and analysis.
---
title: Collect and analyze performance counters in Azure Log Analytics | Microsoft Docs
description: Performance counters are collected by Log Analytics to analyze performance on Windows and Linux agents.  This article describes how to configure collection of Performance counters for both Windows and Linux agents, details of they are stored in the workspace, and how to analyze them in the Azure portal.
services: log-analytics
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn

ms.assetid: 20e145e4-2ace-4cd9-b252-71fb4f94099e
ms.service: log-analytics
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/19/2017
ms.author: magoedte
ms.component: 
---

# Windows and Linux performance data sources in Log Analytics
Performance counters in Windows and Linux provide insight into the performance of hardware components, operating systems, and applications.  Log Analytics can collect performance counters at frequent intervals for Near Real Time (NRT) analysis in addition to aggregating performance data for longer term analysis and reporting.

![Performance counters](media/log-analytics-data-sources-performance-counters/overview.png)

## Configuring Performance counters
Configure Performance counters from the [Data menu in Log Analytics Settings](log-analytics-data-sources.md#configuring-data-sources).

When you first configure Windows or Linux Performance counters for a new Log Analytics workspace, you are given the option to quickly create several common counters.  They are listed with a checkbox next to each.  Ensure that any counters you want to initially create are checked and then click **Add the selected performance counters**.

For Windows performance counters, you can choose a specific instance for each performance counter. For Linux performance counters, the instance of each counter that you choose applies to all child counters of the parent counter. The following table shows the common instances available to both Linux and Windows performance counters.

| Instance name | Description |
| --- | --- |
| \_Total |Total of all the instances |
| \* |All instances |
| (/&#124;/var) |Matches instances named: / or /var |

### Windows performance counters

![Configure Windows Performance counters](media/log-analytics-data-sources-performance-counters/configure-windows.png)

Follow this procedure to add a new Windows performance counter to collect.

1. Type the name of the counter in the text box in the format *object(instance)\counter*.  When you start typing, you are presented with a matching list of common counters.  You can either select a counter from the list or type in one of your own.  You can also return all instances for a particular counter by specifying *object\counter*.  

    When collecting SQL Server performance counters from named instances, all named instance counters start with *MSSQL$* and followed by the name of the instance.  For example, to collect the Log Cache Hit Ratio counter for all databases from the Database performance object for named SQL instance INST2, specify `MSSQL$INST2:Databases(*)\Log Cache Hit Ratio`.

2. Click **+** or press **Enter** to add the counter to the list.
3. When you add a counter, it uses the default of 10 seconds for its **Sample Interval**.  You can change this to a higher value of up to 1800 seconds (30 minutes) if you want to reduce the storage requirements of the collected performance data.
4. When you're done adding counters, click the **Save** button at the top of the screen to save the configuration.

### Linux performance counters

![Configure Linux Performance counters](media/log-analytics-data-sources-performance-counters/configure-linux.png)

Follow this procedure to add a new Linux performance counter to collect.

1. By default, all configuration changes are automatically pushed to all agents.  For Linux agents, a configuration file is sent to the Fluentd data collector.  If you wish to modify this file manually on each Linux agent, then uncheck the box *Apply below configuration to my Linux machines* and follow the guidance below.
2. Type the name of the counter in the text box in the format *object(instance)\counter*.  When you start typing, you are presented with a matching list of common counters.  You can either select a counter from the list or type in one of your own.  
3. Click **+** or press **Enter** to add the counter to the list of other counters for the object.
4. All counters for an object use the same **Sample Interval**.  The default is 10 seconds.  You change this to a higher value of up to 1800 seconds (30 minutes) if you want to reduce the storage requirements of the collected performance data.
5. When you're done adding counters, click the **Save** button at the top of the screen to save the configuration.

#### Configure Linux performance counters in configuration file
Instead of configuring Linux performance counters using the Azure portal, you have the option of editing configuration files on the Linux agent.  Performance metrics to collect are controlled by the configuration in **/etc/opt/microsoft/omsagent/\<workspace id\>/conf/omsagent.conf**.

Each object, or category, of performance metrics to collect should be defined in the configuration file as a single `<source>` element. The syntax follows the pattern below.

	<source>
	  type oms_omi  
	  object_name "Processor"
	  instance_regex ".*"
	  counter_name_regex ".*"
	  interval 30s
	</source>


The parameters in this element are described in the following table.

| Parameters | Description |
|:--|:--|
| object\_name | Object name for the collection. |
| instance\_regex |  A *regular expression* defining which instances to collect. The value: `.*` specifies all instances. To collect processor metrics for only the \_Total instance, you could specify `_Total`. To collect process metrics for only the crond or sshd instances, you could specify: `(crond\|sshd)`. |
| counter\_name\_regex | A *regular expression* defining which counters (for the object) to collect. To collect all counters for the object, specify: `.*`. To collect only swap space counters for the memory object, for example, you could specify: `.+Swap.+` |
| interval | Frequency at which the object's counters are collected. |


The following table lists the objects and counters that you can specify in the configuration file.  There are additional counters available for certain applications as described in [Collect performance counters for Linux applications in Log Analytics](log-analytics-data-sources-linux-applications.md).

| Object Name | Counter Name |
|:--|:--|
| Logical Disk | % Free Inodes |
| Logical Disk | % Free Space |
| Logical Disk | % Used Inodes |
| Logical Disk | % Used Space |
| Logical Disk | Disk Read Bytes/sec |
| Logical Disk | Disk Reads/sec |
| Logical Disk | Disk Transfers/sec |
| Logical Disk | Disk Write Bytes/sec |
| Logical Disk | Disk Writes/sec |
| Logical Disk | Free Megabytes |
| Logical Disk | Logical Disk Bytes/sec |
| Memory | % Available Memory |
| Memory | % Available Swap Space |
| Memory | % Used Memory |
| Memory | % Used Swap Space |
| Memory | Available MBytes Memory |
| Memory | Available MBytes Swap |
| Memory | Page Reads/sec |
| Memory | Page Writes/sec |
| Memory | Pages/sec |
| Memory | Used MBytes Swap Space |
| Memory | Used Memory MBytes |
| Network | Total Bytes Transmitted |
| Network | Total Bytes Received |
| Network | Total Bytes |
| Network | Total Packets Transmitted |
| Network | Total Packets Received |
| Network | Total Rx Errors |
| Network | Total Tx Errors |
| Network | Total Collisions |
| Physical Disk | Avg. Disk sec/Read |
| Physical Disk | Avg. Disk sec/Transfer |
| Physical Disk | Avg. Disk sec/Write |
| Physical Disk | Physical Disk Bytes/sec |
| Process | Pct Privileged Time |
| Process | Pct User Time |
| Process | Used Memory kBytes |
| Process | Virtual Shared Memory |
| Processor | % DPC Time |
| Processor | % Idle Time |
| Processor | % Interrupt Time |
| Processor | % IO Wait Time |
| Processor | % Nice Time |
| Processor | % Privileged Time |
| Processor | % Processor Time |
| Processor | % User Time |
| System | Free Physical Memory |
| System | Free Space in Paging Files |
| System | Free Virtual Memory |
| System | Processes |
| System | Size Stored In Paging Files |
| System | Uptime |
| System | Users |


Following is the default configuration for performance metrics.

	<source>
	  type oms_omi
	  object_name "Physical Disk"
	  instance_regex ".*"
	  counter_name_regex ".*"
	  interval 5m
	</source>

	<source>
	  type oms_omi
	  object_name "Logical Disk"
	  instance_regex ".*
	  counter_name_regex ".*"
	  interval 5m
	</source>

	<source>
	  type oms_omi
	  object_name "Processor"
	  instance_regex ".*
	  counter_name_regex ".*"
	  interval 30s
	</source>

	<source>
	  type oms_omi
	  object_name "Memory"
	  instance_regex ".*"
	  counter_name_regex ".*"
	  interval 30s
	</source>

## Data collection
Log Analytics collects all specified performance counters at their specified sample interval on all agents that have that counter installed.  The data is not aggregated, and the raw data is available in all log search views for the duration specified by your subscription.

## Performance record properties
Performance records have a type of **Perf** and have the properties in the following table.

| Property | Description |
|:--- |:--- |
| Computer |Computer that the event was collected from. |
| CounterName |Name of the performance counter |
| CounterPath |Full path of the counter in the form \\\\\<Computer>\\object(instance)\\counter. |
| CounterValue |Numeric value of the counter. |
| InstanceName |Name of the event instance.  Empty if no instance. |
| ObjectName |Name of the performance object |
| SourceSystem |Type of agent the data was collected from. <br><br>OpsManager – Windows agent, either direct connect or SCOM <br> Linux – All Linux agents  <br> AzureStorage – Azure Diagnostics |
| TimeGenerated |Date and time the data was sampled. |

## Sizing estimates
 A rough estimate for collection of a particular counter at 10-second intervals is about 1 MB per day per instance.  You can estimate the storage requirements of a particular counter with the following formula.

    1 MB x (number of counters) x (number of agents) x (number of instances)

## Log searches with Performance records
The following table provides different examples of log searches that retrieve Performance records.

| Query | Description |
|:--- |:--- |
| Perf |All Performance data |
| Perf &#124; where Computer == "MyComputer" |All Performance data from a particular computer |
| Perf &#124; where CounterName == "Current Disk Queue Length" |All Performance data for a particular counter |
| Perf &#124; where ObjectName == "Processor" and CounterName == "% Processor Time" and InstanceName == "_Total" &#124; summarize AVGCPU = avg(Average) by Computer |Average CPU Utilization across all computers |
| Perf &#124; where CounterName == "% Processor Time" &#124; summarize AggregatedValue = max(Max) by Computer |Maximum CPU Utilization across all computers |
| Perf &#124; where ObjectName == "LogicalDisk" and CounterName == "Current Disk Queue Length" and Computer == "MyComputerName" &#124; summarize AggregatedValue = avg(Average) by InstanceName |Average Current Disk Queue length across all  the instances of a given computer |
| Perf &#124; where CounterName == "DiskTransfers/sec" &#124; summarize AggregatedValue = percentile(Average, 95) by Computer |95th Percentile of Disk Transfers/Sec across all computers |
| Perf &#124; where CounterName == "% Processor Time" and InstanceName == "_Total" &#124; summarize AggregatedValue = avg(CounterValue) by bin(TimeGenerated, 1h), Computer |Hourly average of CPU usage across all computers |
| Perf &#124; where Computer == "MyComputer" and CounterName startswith_cs "%" and InstanceName == "_Total" &#124; summarize AggregatedValue = percentile(CounterValue, 70) by bin(TimeGenerated, 1h), CounterName | Hourly 70 percentile of every % percent counter for a particular computer |
| Perf &#124; where CounterName == "% Processor Time" and InstanceName == "_Total" and Computer == "MyComputer" &#124; summarize ["min(CounterValue)"] = min(CounterValue), ["avg(CounterValue)"] = avg(CounterValue), ["percentile75(CounterValue)"] = percentile(CounterValue, 75), ["max(CounterValue)"] = max(CounterValue) by bin(TimeGenerated, 1h), Computer |Hourly average, minimum, maximum, and 75-percentile CPU usage for a specific computer |
| Perf &#124; where ObjectName == "MSSQL$INST2:Databases" and InstanceName == "master" | All Performance data from the Database performance object for the master database from the named SQL Server instance INST2.  




## Next steps
* [Collect performance counters from Linux applications](log-analytics-data-sources-linux-applications.md) including MySQL and Apache HTTP Server.
* Learn about [log searches](log-analytics-log-searches.md) to analyze the data collected from data sources and solutions.  
* Export collected data to [Power BI](log-analytics-powerbi.md) for additional visualizations and analysis.

---
title: Create performance alerts with Azure Monitor for containers | Microsoft Docs
description: This article describes how you can create custom Azure alerts based on log queries for memory and CPU utilization from Azure Monitor for containers.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: 
ms.assetid: 
ms.service: azure-monitor
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/26/2019
ms.author: magoedte
---

# How to set up alerts for performance problems in Azure Monitor for containers
Azure Monitor for containers monitors the performance of container workloads deployed to either Azure Container Instances or managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS). 

This article describes how to enable alerting for the following situations:

* When CPU and memory utilization on nodes of the cluster or exceeds your defined threshold.
* When CPU or memory utilization on any of the containers within a controller exceeds your defined threshold as compared to the limit set on the corresponding resource.

To alert when CPU or memory utilization is high for a cluster or a controller, you create a metric measurement alert rule that is based off of log queries provided. The queries compare a datetime to the present using the now operator and goes back one hour. All dates stored by Azure Monitor for containers are in UTC format.

Before starting, if you are not familiar with Alerts in Azure Monitor, see [Overview of alerts in Microsoft Azure](../platform/alerts-overview.md). To learn more about alerts using log queries, see [Log alerts in Azure Monitor](../platform/alerts-unified-log.md)

## Resource utilization log search queries
The queries in this section are provided to support each alerting scenario. The queries are required for step 7 under the [create alert](#create-alert-rule) section below.  

The following query calculates the average CPU utilization as an average of member nodes CPU utilization every minute.  

```kusto
let endDateTime = now();
let startDateTime = ago(1h);
let trendBinSize = 1m;
let capacityCounterName = 'cpuCapacityNanoCores';
let usageCounterName = 'cpuUsageNanoCores';
KubeNodeInventory
| where TimeGenerated < endDateTime
| where TimeGenerated >= startDateTime
// cluster filter would go here if multiple clusters are reporting to the same Log Analytics workspace
| distinct ClusterName, Computer
| join hint.strategy=shuffle (
  Perf
  | where TimeGenerated < endDateTime
  | where TimeGenerated >= startDateTime
  | where ObjectName == 'K8SNode'
  | where CounterName == capacityCounterName
  | summarize LimitValue = max(CounterValue) by Computer, CounterName, bin(TimeGenerated, trendBinSize)
  | project Computer, CapacityStartTime = TimeGenerated, CapacityEndTime = TimeGenerated + trendBinSize, LimitValue
) on Computer
| join kind=inner hint.strategy=shuffle (
  Perf
  | where TimeGenerated < endDateTime + trendBinSize
  | where TimeGenerated >= startDateTime - trendBinSize
  | where ObjectName == 'K8SNode'
  | where CounterName == usageCounterName
  | project Computer, UsageValue = CounterValue, TimeGenerated
) on Computer
| where TimeGenerated >= CapacityStartTime and TimeGenerated < CapacityEndTime
| project ClusterName, Computer, TimeGenerated, UsagePercent = UsageValue * 100.0 / LimitValue
| summarize AggregatedValue = avg(UsagePercent) by bin(TimeGenerated, trendBinSize), ClusterName
```

The following query calculates the average memory utilization as an average of member nodes memory utilization every minute.

```kusto
let endDateTime = now();
let startDateTime = ago(1h);
let trendBinSize = 1m;
let capacityCounterName = 'memoryCapacityBytes';
let usageCounterName = 'memoryRssBytes';
KubeNodeInventory
| where TimeGenerated < endDateTime
| where TimeGenerated >= startDateTime
// cluster filter would go here if multiple clusters are reporting to the same Log Analytics workspace
| distinct ClusterName, Computer
| join hint.strategy=shuffle (
  Perf
  | where TimeGenerated < endDateTime
  | where TimeGenerated >= startDateTime
  | where ObjectName == 'K8SNode'
  | where CounterName == capacityCounterName
  | summarize LimitValue = max(CounterValue) by Computer, CounterName, bin(TimeGenerated, trendBinSize)
  | project Computer, CapacityStartTime = TimeGenerated, CapacityEndTime = TimeGenerated + trendBinSize, LimitValue
) on Computer
| join kind=inner hint.strategy=shuffle (
  Perf
  | where TimeGenerated < endDateTime + trendBinSize
  | where TimeGenerated >= startDateTime - trendBinSize
  | where ObjectName == 'K8SNode'
  | where CounterName == usageCounterName
  | project Computer, UsageValue = CounterValue, TimeGenerated
) on Computer
| where TimeGenerated >= CapacityStartTime and TimeGenerated < CapacityEndTime
| project ClusterName, Computer, TimeGenerated, UsagePercent = UsageValue * 100.0 / LimitValue
| summarize AggregatedValue = avg(UsagePercent) by bin(TimeGenerated, trendBinSize), ClusterName
```
>[!IMPORTANT]
>Queries below contain placeholder string values for your cluster and controller names - <your-cluster-name> and <your-controller-name>. Replace placeholders with values specific to your environment before setting up alerts. 


The following query calculates the average CPU utilization of all containers in a controller as an average of CPU utilization of every container instance in a controller every minute as a percentage of the limit set up for a container.

```kusto
let endDateTime = now();
let startDateTime = ago(1h);
let trendBinSize = 1m;
let capacityCounterName = 'cpuLimitNanoCores';
let usageCounterName = 'cpuUsageNanoCores';
let clusterName = '<your-cluster-name>';
let controllerName = '<your-controller-name>';
KubePodInventory
| where TimeGenerated < endDateTime
| where TimeGenerated >= startDateTime
| where ClusterName == clusterName
| where ControllerName == controllerName
| extend InstanceName = strcat(ClusterId, '/', ContainerName),
         ContainerName = strcat(controllerName, '/', tostring(split(ContainerName, '/')[1]))
| distinct Computer, InstanceName, ContainerName
| join hint.strategy=shuffle (
    Perf
    | where TimeGenerated < endDateTime
    | where TimeGenerated >= startDateTime
    | where ObjectName == 'K8SContainer'
    | where CounterName == capacityCounterName
    | summarize LimitValue = max(CounterValue) by Computer, InstanceName, bin(TimeGenerated, trendBinSize)
    | project Computer, InstanceName, LimitStartTime = TimeGenerated, LimitEndTime = TimeGenerated + trendBinSize, LimitValue
) on Computer, InstanceName
| join kind=inner hint.strategy=shuffle (
    Perf
    | where TimeGenerated < endDateTime + trendBinSize
    | where TimeGenerated >= startDateTime - trendBinSize
    | where ObjectName == 'K8SContainer'
    | where CounterName == usageCounterName
    | project Computer, InstanceName, UsageValue = CounterValue, TimeGenerated
) on Computer, InstanceName
| where TimeGenerated >= LimitStartTime and TimeGenerated < LimitEndTime
| project Computer, ContainerName, TimeGenerated, UsagePercent = UsageValue * 100.0 / LimitValue
| summarize AggregatedValue = avg(UsagePercent) by bin(TimeGenerated, trendBinSize) , ContainerName
```

The following query calculates the average memory utilization of all containers in a controller as an average of memory utilization of every container instance in a controller every minute as a percentage of the limit set up for a container.

```kusto
let endDateTime = now();
let startDateTime = ago(1h);
let trendBinSize = 1m;
let capacityCounterName = 'memoryLimitBytes';
let usageCounterName = 'memoryRssBytes';
let clusterName = '<your-cluster-name>';
let controllerName = '<your-controller-name>';
KubePodInventory
| where TimeGenerated < endDateTime
| where TimeGenerated >= startDateTime
| where ClusterName == clusterName
| where ControllerName == controllerName
| extend InstanceName = strcat(ClusterId, '/', ContainerName),
         ContainerName = strcat(controllerName, '/', tostring(split(ContainerName, '/')[1]))
| distinct Computer, InstanceName, ContainerName
| join hint.strategy=shuffle (
    Perf
    | where TimeGenerated < endDateTime
    | where TimeGenerated >= startDateTime
    | where ObjectName == 'K8SContainer'
    | where CounterName == capacityCounterName
    | summarize LimitValue = max(CounterValue) by Computer, InstanceName, bin(TimeGenerated, trendBinSize)
    | project Computer, InstanceName, LimitStartTime = TimeGenerated, LimitEndTime = TimeGenerated + trendBinSize, LimitValue
) on Computer, InstanceName
| join kind=inner hint.strategy=shuffle (
    Perf
    | where TimeGenerated < endDateTime + trendBinSize
    | where TimeGenerated >= startDateTime - trendBinSize
    | where ObjectName == 'K8SContainer'
    | where CounterName == usageCounterName
    | project Computer, InstanceName, UsageValue = CounterValue, TimeGenerated
) on Computer, InstanceName
| where TimeGenerated >= LimitStartTime and TimeGenerated < LimitEndTime
| project Computer, ContainerName, TimeGenerated, UsagePercent = UsageValue * 100.0 / LimitValue
| summarize AggregatedValue = avg(UsagePercent) by bin(TimeGenerated, trendBinSize) , ContainerName
```

## Create alert rule
Perform the following steps to create a Log Alert in Azure Monitor using one of the log search rules provided earlier.  

>[!NOTE]
>The procedure below requires you to switch to new Log Alerts API as described in [Switch API preference for Log Alerts](../platform/alerts-log-api-switch.md) if you are creating an alert rule for container resource utilization. 
>

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **Monitor** from the left-hand pane in the Azure portal. Under the **Insights** section, select **Containers**.    
3. From the **Monitored Clusters** tab, select a cluster from the list by clicking on the name of the cluster.
4. On the left-hand pane under the **Monitoring** section, select **Logs** to open the Azure Monitor logs page, which used to write and execute Azure Log Analytics queries.
5. On the **Logs** page, click **+ New alert rule**.
6. Under the **Condition** section, click on the pre-defined custom log condition **Whenever the Custom log search is <logic undefined>**. The **custom log search** signal type is automatically selected for us because we initiated creating an alert rule directly from the Azure Monitor logs page.  
7. Paste one of the [queries](#resource-utilization-log-search-queries) provided earlier into the **Search query** field. 

8. Configure the alert with the following information:

    a. From the **Based on** drop-down list, select **Metric measurement**. A metric measurement will create an alert for each object in the query with a value that exceeds our specified threshold.  
    b. For the **Condition**, select **Greater than** and enter **75** as an initial baseline **Threshold** or enter a value that meets your criteria.  
    c. Under **Trigger Alert Based On** section, select **Consecutive breaches** and from the drop-down list select **Greater than** enter a value of **2**.  
    d. If configuring an alert for container CPU or memory utilization, under **Aggregate on** select **ContainerName** from the drop-down list.  
    e. Under **Evaluated based on** section, modify the **Period** value to 60 minutes. The rule will run every five minutes and return records that were created within the last hour from the current time. Setting the time period to a wider window accounts for the potential of data latency, and ensures the query returns data to avoid a false negative where the alert never fires. 

9. Click **Done** to complete the alert rule.
10. Provide a name of your alert in the **Alert rule name** field. Specify a **Description** detailing specifics for the alert, and select an appropriate severity from the options provided.
11. To immediately activate the alert rule on creation, accept the default value for **Enable rule upon creation**.
12. For the final step, you select an existing or create a new **Action Group**, which ensures that the same actions are taken each time an alert is triggered and can be used for each rule you define. Configure based on how your IT or DevOps operations manages incidents. 
13. Click **Create alert rule** to complete the alert rule. It starts running immediately.

## Next steps

* Review some of the [log query examples](container-insights-analyze.md#search-logs-to-analyze-data) learn about the pre-defined queries or examples to evaluate and use or customize for other alert scenarios. 
* To continue learning how to use Azure Monitor and monitor other aspects of your AKS cluster, see [View Azure Kubernetes Service health](container-insights-analyze.md)

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
ms.date: 02/11/2019
ms.author: magoedte
---

# How to be proactively alerted of Azure Monitor for containers performance problems
Azure Monitor for containers monitors the performance of container workloads deployed to either Azure Container Instances or managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS). 

This article describes how to enable alerting when processor and memory utilization on nodes of the cluster exceeds your defined threshold.

## Create alert on cluster CPU or memory utilization
To alert when CPU or memory utilization is high for a cluster, you create a metric measurement alert rule that is based off of log queries provided. The queries compare a datetime to the present using the `now` operator and goes back one hour. All dates stored by Azure Monitor for containers are in UTC format.  

Before starting, if you are not familiar with Alerts in Azure Monitor, see [Overview of alerts in Microsoft Azure](../platform/alerts-overview.md). To learn more about alerts using log queries, see [Log alerts in Azure Monitor](../platform/alerts-unified-log.md)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **Monitor** from the left-hand pane in the Azure portal. Under the **Insights** section, select **Containers**.    
3. From the **Monitored Clusters** tab, select a cluster from the list by clicking on the name of the cluster.
4. On the left-hand pane under the **Monitoring** section, select **Logs** to open the Azure Monitor logs page, which used to write and execute Azure Log Analytics queries.
5. On the **Logs** page, click **+ New alert rule**.
6. Under the **Condition** section, click on the pre-defined custom log condition **Whenever the Custom log search is <logic undefined>**. The **custom log search** signal type is automatically selected for us because we initiated creating an alert rule directly from the Azure Monitor logs page.  
7. Paste either one of the queries below into the **Search query** field. The following query calculates the average CPU utilization as an average of member nodes CPU utilization every minute.

    ```
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

    ```
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

8. Configure the alert with the following information:

    a. From the **Based on** drop-down list, select **Metric measurement**. A metric measurement will create an alert for each object in the query with a value that exceeds our specified threshold.  
    b. For the **Condition**, select **Greater than** and enter **75** as an initial baseline **Threshold** or enter a value that meets your criteria.  
    c. Under **Trigger Alert Based On** section, select **Consecutive breaches** and from the drop-down list select **Greater than** enter a value of **2**.  
    d. Under **Evaluated based on** section, modify the **Period** value to 60 minutes. The rule will run every five minutes and return records that were created within the last hour from the current time. Setting the time period to a wider window accounts for the potential of data latency, and ensures the query returns data to avoid a false negative where the alert never fires. 

9. Click **Done** to complete the alert rule.
10. Provide a name of your alert in the **Alert rule name** field. Specify a **Description** detailing specifics for the alert, and select an appropriate severity from the options provided.
11. To immediately activate the alert rule on creation, accept the default value for **Enable rule upon creation**.
12. For the final step, you select an existing or create a new **Action Group**, which ensures that the same actions are taken each time an alert is triggered and can be used for each rule you define. Configure based on how your IT or DevOps operations manages incidents. 
13. Click **Create alert rule** to complete the alert rule. It starts running immediately.

## Next steps
To continue learning how to use Azure Monitor and monitor other aspects of your AKS cluster, see [View Azure Kubernetes Service health](container-insights-analyze.md)
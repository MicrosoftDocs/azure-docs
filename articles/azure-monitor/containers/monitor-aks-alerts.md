---
title: Monitor Azure Kubernetes Service (AKS) with Azure Monitor - Alerts
description: Describes how to create alerts from your AKS cluster using Azure Monitor.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/02/2021

---

# Monitoring Azure Kubernetes Service (AKS) - Alerts


## Metric alert rules

[Recommended metric alerts (preview) from Container insights](container-insights-metric-alerts.md)

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. You can set alerts on [metrics](/azure/azure-monitor/platform/alerts-metric-overview), [logs](/azure/azure-monitor/platform/alerts-unified-log), and the [activity log](/azure/azure-monitor/platform/activity-log-alerts). Different types of alerts have benefits and drawbacks

The following table lists common and recommended alert rules for AKS.

| Rule Name | COunter Name | Condition | Description  |
|:---|:---|:---|
| Completed job count| completedJobsCount | Number of completed jobs(more than 6 hours ago) are greater than 0 |
| Container CPU % | cpuExceededPercentage | Average container CPU is greater than 95% |
| Container working set memory % | memoryWorkingSetExceededPercentage | Average container working set memory is greater than 95% |
| Failed Pod counts | podCount | Number of Pods in Failed state are greater than 0 |
| Node CPU % | cpuUsagePercentage  | Average node CPU is greater than 80% |
| Node Disk Usage % | diskUsedPercentage | Average disk usage for a node is greater than 80% |
| Node NotReady status |nodesCount | Number of nodes in not ready state are greater than 0 |
| Node working set memory % | memoryWorkingSetPercentage | Average node working set memory is greater than 80% |
| OOM Killed Containers | oomKilledContainerCount | Number of OOM killed containers are greater than  0 |
| Persistent Volume Usage % | pvUsageExceededPercentage | Average PV usage is greater than 80% |
| Pods ready % | podReadyPercentage | Average ready state pods are less than 80% |
| Restarting container count | restartingContainerCount | Number of restarting containers are greater than 0 |





## Log alerts rules

### Pod scale out (hpa)
Container insights automatically monitors the deployment and HPA with specific metrics, and these are collected at every 60 seconds interval in the InsightMetrics table. The list of available metrics name can be referred in the Azure docs.

 

The log search query pulls the Pod scale out data from Insight Metrics table and joins the output from “KubePodInventory” to get the number of scaled out replicas in each deployment. The additional logic calculate the scale out percentage with the maximum number of replicas configured in HPA (The HPA specific information is collected in “kube_hpa_status_current_replicas”).

 

This query returns the results of any application that are hosted with hpa in non-system namespace.


```kusto
let _minthreshold = 70; // minimum threshold 
let _maxthreshold = 90; // maximum threshold 
let startDateTime = ago(60m);
KubePodInventory
| where TimeGenerated >= startDateTime 
| where Namespace !in('default', 'kube-system') // List of non system namespace filter goes here.
| extend labels = todynamic(PodLabel)
| extend deployment_hpa = reverse(substring(reverse(ControllerName), indexof(reverse(ControllerName), "-") + 1))
| distinct tostring(deployment_hpa)
| join kind=inner (InsightsMetrics 
    | where TimeGenerated > startDateTime 
    | where Name == 'kube_hpa_status_current_replicas'
    | extend pTags = todynamic(Tags) //parse the tags for values
    | extend ns = todynamic(pTags.k8sNamespace) //parse namespace value from tags
    | extend deployment_hpa = todynamic(pTags.targetName) //parse HPA target name from tags
    | extend max_reps = todynamic(pTags.spec_max_replicas) // Parse maximum replica settings from HPA deployment
    | extend desired_reps = todynamic(pTags.status_desired_replicas) // Parse desired replica settings from HPA deployment
    | summarize arg_max(TimeGenerated, *) by tostring(ns), tostring(deployment_hpa), Cluster=toupper(tostring(split(_ResourceId, '/')[8])), toint(desired_reps), toint(max_reps), scale_out_percentage=(desired_reps * 100 / max_reps)
    //| where scale_out_percentage > _minthreshold and scale_out_percentage <= _maxthreshold
    )
    on deployment_hpa
```

## Nodepool scale outs 
The following query returns the number of active nodes in each node pools. The additional logic calculates the number of available active node and the max node configuration in the auto-scaler settings to determine the scale out percentage. This is useful when it comes to monitoring the underlying node infrastructure availability for scaling requirement.

 
```kusto
let nodepoolMaxnodeCount = 10; // the maximum number of nodes in your auto scale setting goes here.
let _minthreshold = 20;
let _maxthreshold = 90;
let startDateTime = 60m;
KubeNodeInventory
| where TimeGenerated >= ago(startDateTime)
| extend nodepoolType = todynamic(Labels) //Parse the labels to get the list of node pool types
| extend nodepoolName = todynamic(nodepoolType[0].agentpool) // parse the label to get the nodepool name or set the specific nodepool name (like nodepoolName = 'agentpool)'
| summarize nodeCount = count(Computer) by ClusterName, tostring(nodepoolName), TimeGenerated
//(Uncomment the below two lines to set this as an log search alert)
//| extend scaledpercent = iff(((nodeCount * 100 / nodepoolMaxnodeCount) >= _minthreshold and (nodeCount * 100 / nodepoolMaxnodeCount) < _maxthreshold), "warn", "normal")
//| where scaledpercent == 'warn'
| summarize arg_max(TimeGenerated, *) by nodeCount, ClusterName, tostring(nodepoolName)
| project ClusterName, 
    TotalNodeCount= strcat("Total Node Count: ", nodeCount),
    ScaledOutPercentage = (nodeCount * 100 / nodepoolMaxnodeCount),  
    TimeGenerated, 
    nodepoolName
```

System containers (replicaset) availability

This query monitors the system containers (replicasets) and report the unavailable percentage.

 


```kusto
let startDateTime = 5m; // the minimum time interval goes here
let _minalertThreshold = 50; //Threshold for minimum and maximum unavailable or not running containers
let _maxalertThreshold = 70;
KubePodInventory
| where TimeGenerated >= ago(startDateTime)
| distinct ClusterName, TimeGenerated
| summarize Clustersnapshot = count() by ClusterName
| join kind=inner (
    KubePodInventory
    | where TimeGenerated >= ago(startDateTime)
    | where Namespace in('default', 'kube-system') and ControllerKind == 'ReplicaSet' // the system namespace filter goes here
    | distinct ClusterName, Computer, PodUid, TimeGenerated, PodStatus, ServiceName, PodLabel, Namespace, ContainerStatus
    | summarize arg_max(TimeGenerated, *), TotalPODCount = count(), podCount = sumif(1, PodStatus == 'Running' or PodStatus != 'Running'), containerNotrunning = sumif(1, ContainerStatus != 'running')
        by ClusterName, TimeGenerated, ServiceName, PodLabel, Namespace
    )
    on ClusterName
| project ClusterName, ServiceName, podCount, containerNotrunning, containerNotrunningPercent = (containerNotrunning * 100 / podCount), TimeGenerated, PodStatus, PodLabel, Namespace, Environment = tostring(split(ClusterName, '-')[3]), Location = tostring(split(ClusterName, '-')[4]), ContainerStatus
//Uncomment the below line to set for automated alert
//| where PodStatus == "Running" and containerNotrunningPercent > _minalertThreshold and containerNotrunningPercent < _maxalertThreshold
| summarize arg_max(TimeGenerated, *), c_entry=count() by PodLabel, ServiceName, ClusterName
//Below lines are to parse the labels to identify the impacted service/component name
| extend parseLabel = replace(@'k8s-app', @'k8sapp', PodLabel)
| extend parseLabel = replace(@'app.kubernetes.io/component', @'appkubernetesiocomponent', parseLabel)
| extend parseLabel = replace(@'app.kubernetes.io/instance', @'appkubernetesioinstance', parseLabel)
| extend tags = todynamic(parseLabel)
| extend tag01 = todynamic(tags[0].app)
| extend tag02 = todynamic(tags[0].k8sapp)
| extend tag03 = todynamic(tags[0].appkubernetesiocomponent)
| extend tag04 = todynamic(tags[0].aadpodidbinding)
| extend tag05 = todynamic(tags[0].appkubernetesioinstance)
| extend tag06 = todynamic(tags[0].component)
| project ClusterName, TimeGenerated,
    ServiceName = strcat( ServiceName, tag01, tag02, tag03, tag04, tag05, tag06),
    ContainerUnavailable = strcat("Unavailable Percentage: ", containerNotrunningPercent),
    PodStatus = strcat("PodStatus: ", PodStatus), 
    ContainerStatus = strcat("Container Status: ", ContainerStatus)
```



System containers (daemonsets) availability

This query monitors the system containers (daemonsets) and report the unavailable percentage.

 
```kusto
let startDateTime = 5m; // the minimum time interval goes here
let _minalertThreshold = 50; //Threshold for minimum and maximum unavailable or not running containers
let _maxalertThreshold = 70;
KubePodInventory
| where TimeGenerated >= ago(startDateTime)
| distinct ClusterName, TimeGenerated
| summarize Clustersnapshot = count() by ClusterName
| join kind=inner (
    KubePodInventory
    | where TimeGenerated >= ago(startDateTime)
    | where Namespace in('default', 'kube-system') and ControllerKind == 'DaemonSet' // the system namespace filter goes here
    | distinct ClusterName, Computer, PodUid, TimeGenerated, PodStatus, ServiceName, PodLabel, Namespace, ContainerStatus
    | summarize arg_max(TimeGenerated, *), TotalPODCount = count(), podCount = sumif(1, PodStatus == 'Running' or PodStatus != 'Running'), containerNotrunning = sumif(1, ContainerStatus != 'running')
        by ClusterName, TimeGenerated, ServiceName, PodLabel, Namespace
    )
    on ClusterName
| project ClusterName, ServiceName, podCount, containerNotrunning, containerNotrunningPercent = (containerNotrunning * 100 / podCount), TimeGenerated, PodStatus, PodLabel, Namespace, Environment = tostring(split(ClusterName, '-')[3]), Location = tostring(split(ClusterName, '-')[4]), ContainerStatus
//Uncomment the below line to set for automated alert
//| where PodStatus == "Running" and containerNotrunningPercent > _minalertThreshold and containerNotrunningPercent < _maxalertThreshold
| summarize arg_max(TimeGenerated, *), c_entry=count() by PodLabel, ServiceName, ClusterName
//Below lines are to parse the labels to identify the impacted service/component name
| extend parseLabel = replace(@'k8s-app', @'k8sapp', PodLabel)
| extend parseLabel = replace(@'app.kubernetes.io/component', @'appkubernetesiocomponent', parseLabel)
| extend parseLabel = replace(@'app.kubernetes.io/instance', @'appkubernetesioinstance', parseLabel)
| extend tags = todynamic(parseLabel)
| extend tag01 = todynamic(tags[0].app)
| extend tag02 = todynamic(tags[0].k8sapp)
| extend tag03 = todynamic(tags[0].appkubernetesiocomponent)
| extend tag04 = todynamic(tags[0].aadpodidbinding)
| extend tag05 = todynamic(tags[0].appkubernetesioinstance)
| extend tag06 = todynamic(tags[0].component)
| project ClusterName, TimeGenerated,
    ServiceName = strcat( ServiceName, tag01, tag02, tag03, tag04, tag05, tag06),
    ContainerUnavailable = strcat("Unavailable Percentage: ", containerNotrunningPercent),
    PodStatus = strcat("PodStatus: ", PodStatus), 
    ContainerStatus = strcat("Container Status: ", ContainerStatus)
```


Individual Container restarts

This query monitors the individual system container restart counts for last 10 minutes

 
```kusto
let _threshold = 10m; 
let _alertThreshold = 2;
let Timenow = (datetime(now) - _threshold); 
let starttime = ago(5m); 
KubePodInventory
| where TimeGenerated >= starttime
| where Namespace in ('default', 'kube-system') // the namespace filter goes here
//| where ContainerRestartCount > _alertThreshold
| extend Tags = todynamic(ContainerLastStatus)
| extend startedAt = todynamic(Tags.startedAt)
| where startedAt >= Timenow
| summarize arg_max(TimeGenerated, *) by Name
```

## Next steps

* [Analyze monitoring data collected for virtual machines.](monitor-aks-analyze.md)
* 
---
title: Azure Monitor for containers Frequently Asked Questions | Microsoft Docs
description: Azure Monitor for containers is a solution that monitors the health of your AKS clusters and Container Instances in Azure. This article answers common questions.
ms.topic: conceptual
ms.date: 10/15/2019
---

# Azure Monitor for containers Frequently Asked Questions

This Microsoft FAQ is a list of commonly asked questions about Azure Monitor for containers. If you have any additional questions about the solution, go to the [discussion forum](https://feedback.azure.com/forums/34192--general-feedback) and post your questions. When a question is frequently asked, we add it to this article so that it can be found quickly and easily.

## I don't see Image and Name property values populated when I query the ContainerLog table.

For agent version ciprod12042019 and later, by default these two properties are not populated for every log line to minimize cost incurred on log data collected. There are two options to query the table that include these properties with their values:

### Option 1 

Join other tables to include these property values in the results.

Modify your queries to include Image and ImageTag properties from the ```ContainerInventory``` table by joining on ContainerID property. You can include the Name property (as it previously appeared in the ```ContainerLog``` table) from KubepodInventory table's ContaineName field by joining on the ContainerID property.This is the recommended option.

The following example is a sample detailed query that explains how to get these field values with joins.

```
//lets say we are querying an hour worth of logs
let startTime = ago(1h);
let endTime = now();
//below gets the latest Image & ImageTag for every containerID, during the time window
let ContainerInv = ContainerInventory | where TimeGenerated >= startTime and TimeGenerated < endTime | summarize arg_max(TimeGenerated, *)  by ContainerID, Image, ImageTag | project-away TimeGenerated | project ContainerID1=ContainerID, Image1=Image ,ImageTag1=ImageTag;
//below gets the latest Name for every containerID, during the time window
let KubePodInv  = KubePodInventory | where ContainerID != "" | where TimeGenerated >= startTime | where TimeGenerated < endTime | summarize arg_max(TimeGenerated, *)  by ContainerID2 = ContainerID, Name1=ContainerName | project ContainerID2 , Name1;
//now join the above 2 to get a 'jointed table' that has name, image & imagetag. Outer left is safer in-case there are no kubepod records are if they are latent
let ContainerData = ContainerInv | join kind=leftouter (KubePodInv) on $left.ContainerID1 == $right.ContainerID2;
//now join ContainerLog table with the 'jointed table' above and project-away redundant fields/columns and rename columns that were re-written
//Outer left is safer so you dont lose logs even if we cannot find container metadata for loglines (due to latency, time skew between data types etc...)
ContainerLog
| where TimeGenerated >= startTime and TimeGenerated < endTime 
| join kind= leftouter (
   ContainerData
) on $left.ContainerID == $right.ContainerID2 | project-away ContainerID1, ContainerID2, Name, Image, ImageTag | project-rename Name = Name1, Image=Image1, ImageTag=ImageTag1 

```

### Option 2

Re-enable collection for these properties for every container log line.

If the first option is not convenient due to query changes involved, you can re-enable collecting these fields by enabling the setting ```log_collection_settings.enrich_container_logs``` in the agent config map as described in the [data collection configuration settings](./container-insights-agent-config.md).

> [!NOTE]
> The second option is not recommend with large clusters that have more than 50 nodes, as it generates API server calls from every node > in the cluster to perform this enrichment. This option also increases data size for every log line collected.

## Can I view metrics collected in Grafana?

Azure Monitor for containers supports viewing metrics stored in your Log Analytics workspace in Grafana dashboards. We have provided a template that you can download from Grafana's [dashboard repository](https://grafana.com/grafana/dashboards?dataSource=grafana-azure-monitor-datasource&category=docker) to get you started and  reference to help you learn how to query additional data from your monitored clusters to visualize in custom Grafana dashboards. 

## Can I monitor my AKS-engine cluster with Azure Monitor for containers?

Azure Monitor for containers supports monitoring container workloads deployed to AKS-engine (formerly known as ACS-engine) cluster(s) hosted on Azure. For further details and an overview of steps required to enable monitoring for this scenario, see [Using Azure Monitor for containers for AKS-engine](https://github.com/microsoft/OMS-docker/tree/aks-engine).

## Why don't I see data in my Log Analytics workspace?

If you are unable to see any data in the Log Analytics workspace at a certain time everyday, you may have reached the default 500 MB limit or the daily cap specified to control the amount of data to collect daily. When the limit is met for the day, data collection stops and resumes only on the next day. To review your data usage and update to a different pricing tier based on your anticipated usage patterns, see [Log data usage and cost](../platform/manage-cost-storage.md). 

## What are the container states specified in the ContainerInventory table?

The ContainerInventory table contains information about both stopped and running containers. The table is populated by a workflow inside the agent that queries the docker for all the containers (running and stopped), and forwards that data the Log Analytics workspace.
 
## How do I resolve *Missing Subscription registration* error?

If you receive the error **Missing Subscription registration for Microsoft.OperationsManagement**, you can resolve it by registering the resource provider **Microsoft.OperationsManagement** in the subscription where the workspace is defined. The documentation for how to do this can be found [here](../../azure-resource-manager/templates/error-register-resource-provider.md).

## Is there support for RBAC enabled AKS clusters?

The Container Monitoring solution doesn’t support RBAC, but it is supported with Azure Monitor for Containers. The solution details page may not show the right information in the blades that show data for these clusters.

## How do I enable log collection for containers in the kube-system namespace through Helm?

The log collection from containers in the kube-system namespace is disabled by default. Log collection can be enabled by setting an environment variable on the omsagent. For more information, see the [Azure Monitor for containers](https://github.com/helm/charts/tree/master/incubator/azuremonitor-containers) GitHub page. 

## How do I update the omsagent to the latest released version?

To learn how to upgrade the agent, see [Agent management](container-insights-manage-agent.md).

## How do I enable multi-line logging?

Currently Azure Monitor for containers doesn’t support multi-line logging, but there are workarounds available. You can configure all the services to write in JSON format and then Docker/Moby will write them as a single line.

For example, you can wrap your log as a JSON object as shown in the example below for a sample node.js application:

```
console.log(json.stringify({ 
      "Hello": "This example has multiple lines:",
      "Docker/Moby": "will not break this into multiple lines",
      "and you will receive":"all of them in log analytics",
      "as one": "log entry"
      }));
```

This data will look like the following example in Azure Monitor for logs when you query for it:

```
LogEntry : ({“Hello": "This example has multiple lines:","Docker/Moby": "will not break this into multiple lines", "and you will receive":"all of them in log analytics", "as one": "log entry"}

```

For a detailed look at the issue, review the following [GitHub link](https://github.com/moby/moby/issues/22920).

## How do I resolve Azure AD errors when I enable live logs? 

You may see the following error: **The reply url specified in the request does not match the reply urls configured for the application: '<application ID\>'**. The solution to solve it can be found in the article [How to view container data in real time with Azure Monitor for containers](container-insights-livedata-setup.md#configure-ad-integrated-authentication). 

## Why can't I upgrade cluster after onboarding?

If after you enable Azure Monitor for containers for an AKS cluster, you delete the Log Analytics workspace the cluster was sending its data to, when attempting to upgrade the cluster it will fail. To work around this, you will have to disable monitoring and then re-enable it referencing a different valid workspace in your subscription. When you try to perform the cluster upgrade again, it should process and complete successfully.  

## Which ports and domains do I need to open/whitelist for the agent?

See the [Network firewall requirements](container-insights-onboard.md#network-firewall-requirements) for the proxy and firewall configuration information required for the containerized agent with Azure, Azure US Government, and Azure China clouds.

## Next steps

To begin monitoring your AKS cluster, review [How to onboard the Azure Monitor for containers](container-insights-onboard.md) to understand the requirements and available methods to enable monitoring. 

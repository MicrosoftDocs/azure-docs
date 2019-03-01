---
title: Azure Monitor for containers Frequently Asked Questions | Microsoft Docs
description: Azure Monitor for containers is a solution that monitors the health of your AKS clusters and Container Instances in Azure. This article answers common questions.
services:  azure-monitor
author: mgoedtel
manager: carmonm
editor: tysonn
ms.service:  azure-monitor
ms.topic: article
ms.workload: infrastructure-services
ms.date: 02/26/2019
ms.author: magoedte

---

# Azure Monitor for containers Frequently Asked Questions
This Microsoft FAQ is a list of commonly asked questions about Azure Monitor for containers. If you have any additional questions about the solution, go to the [discussion forum](https://feedback.azure.com/forums/34192--general-feedback) and post your questions. When a question is frequently asked, we add it to this article so that it can be found quickly and easily.

## I am unable to see any data in the Log Analytics workspace at a certain time everyday. How do I resolve this? 

You may have reached the default 500 MB limit or the daily cap specified to control the amount of data to collect daily. When the limit is met for the day, data collection stops and resumes only on the next day. To review your data usage and update to a different pricing tier based on your anticipated usage patterns, see [Log data usage and cost](../platform/manage-cost-storage.md). 
## What are the states of containers specified in the ContainerInventory table?
The ContainerInventory table contains information about both stopped and running containers. The table is populated by a workflow inside the agent that queries the docker for all the containers (running and stopped), and forwards that data the Log Analytics workspace.
 
## How do I resolve errors related to **Missing Subscription registration for Microsoft.OperationsManagement**?
To resolve the error, register the resource provider **Microsoft.OperationsManagement** in the subscription where the workspace is defined. The documentation for how to do this can be found [here](../../azure-resource-manager/resource-manager-register-provider-errors.md).

## Does Azure Monitor for containers include support for RBAC enabled AKS clusters?
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

For a detailed look at the issue, review the following [github link](https://github.com/moby/moby/issues/22920).

## How do I resolve Azure Active Directory errors when I enable live logs? 
You may see the following error: **The reply url specified in the request does not match the reply urls configured for the application: '<application ID\>'**. The solution to solve it can be found in the article [How to view container logs real time with Azure Monitor for containers](container-insights-live-logs.md#configure-aks-with-azure-active-directory). 

## Next steps
To begin monitoring your AKS cluster, review [How to onboard the Azure Monitor for containers](container-insights-onboard.md) to understand the requirements and available methods to enable monitoring. 
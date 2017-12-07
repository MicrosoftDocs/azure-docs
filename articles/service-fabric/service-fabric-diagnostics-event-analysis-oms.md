---
title: Azure Service Fabric Event Analysis with OMS | Microsoft Docs
description: Learn about visualizing and analyzing events using OMS for monitoring and diagnostics of Azure Service Fabric clusters.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 10/15/2017
ms.author: dekapur

---

# Event analysis and visualization with OMS

Operations Management Suite (OMS) is a collection of management services that help with monitoring and diagnostics for applications and services hosted in the cloud. To get a more detailed overview of OMS and what it offers, read [What is OMS?](../operations-management-suite/operations-management-suite-overview.md)

## Log Analytics and the OMS workspace

Log Analytics collects data from managed resources, including an Azure storage table or an agent, and maintains it in a central repository. The data can then be used for analysis, alerting, and visualization, or further exporting. Log Analytics supports events, performance data, or any other custom data.

When OMS is configured, you will have access to a specific *OMS workspace*, from where data can be queried or visualized in dashboards.

After data is received by Log Analytics, OMS has several *Management Solutions* that are prepackaged solutions to monitor incoming data, customized to several scenarios. These include a *Service Fabric Analytics* solution and a *Containers* solution, which are the two most relevant ones to diagnostics and monitoring when using Service Fabric clusters. There are several others as well that are worth exploring, and OMS also allows for the creation of custom solutions, which you can read more about [here](../operations-management-suite/operations-management-suite-solutions.md). Each solution that you choose to use for a cluster can be configured in the same OMS workspace, alongside Log Analytics. Workspaces allow for custom dashboards and visualization of data, and modifications to the data you want to collect, process, and analyze.

## Setting up an OMS workspace with the Service Fabric Analytics Solution
It is recommended that you include the Service Fabric Solution in your OMS workspace - it includes a dashboard that shows the various incoming log channels from the platform and application level, and provides the ability to query Service Fabric specific logs. Here is what a relatively simple Service Fabric Solution looks like, with a single application deployed on the cluster:

![OMS SF solution](media/service-fabric-diagnostics-event-analysis-oms/service-fabric-solution.png)

See [Set up OMS Log Analytics](service-fabric-diagnostics-oms-setup.md) to get started with this for your cluster.

## Using the OMS Agent

It is recommended to use EventFlow and WAD as aggregation solutions because they allow for a more modular approach to diagnostics and monitoring. For example, if you want to change your outputs from EventFlow, it requires no change to your actual instrumentation, just a simple modification to your config file. If, however, you decide to invest in using OMS Log Analytics, you should set up the [OMS agent](../log-analytics/log-analytics-windows-agents.md). You should also use the OMS agent when deploying containers to your cluster, as discussed below. 

Head over to [Add the OMS Agent to a cluster](service-fabric-diagnostics-oms-agent.md) for steps on this.

The advantages of this are the following:

* Richer data on the performance counters and metrics side
* Easy to configure metrics being collected from the cluster and without having to update your cluster's configuration. Changes to the agent's settings can be done from the OMS portal and the agent restarts automatically to match the required configuration. To configure the OMS agent to pick up specific performance counters, go to the workspace **Home > Settings > Data > Windows Performance Counters** and pick the data you would like to see collected
* Data shows up faster than it having to be stored before being picked up by OMS / Log Analytics
* Monitoring containers is much easier, since it can pick up docker logs (stdout, stderr) and stats (performance metrics on container and node levels)

The main consideration here is that since the agent will be deployed on your cluster alongside all your applications, there may be some impact to the performance of your applications on the cluster.

## Monitoring Containers

When deploying containers to a Service Fabric cluster, it is recommended that the cluster has been set up with the OMS agent and that the Containers solution has been added to your OMS workspace to enable monitoring and diagnostics. Here is what the containers solution looks like in a workspace:

![Basic OMS Dashboard](./media/service-fabric-diagnostics-event-analysis-oms/oms-containers-dashboard.png)

The agent enables the collection of several container-specific logs that can be queried in OMS, or used to visualized performance indicators. The log types that are collected are:

* ContainerInventory: shows information about container location, name, and images
* ContainerImageInventory: information about deployed images, including IDs or sizes
* ContainerLog: specific error logs, docker logs (stdout, etc.), and other entries
* ContainerServiceLog: docker daemon commands that have been run
* Perf: performance counters including container cpu, memory, network traffic, disk i/o, and custom metrics from the host machines

[Monitor containers with OMS Log Analytics](service-fabric-diagnostics-oms-containers.md) covers the steps required to set up container monitoring for your cluster. To learn more about OMS's Containers solution, check out their [documentation](../log-analytics/log-analytics-containers.md).

## Next steps

Explore the following OMS tools and options to customize a workspace to your needs:

* For on-premises clusters, OMS offers a Gateway (HTTP Forward Proxy) that can be used to send data to OMS. Read more about that in [Connecting computers without Internet access to OMS using the OMS Gateway](../log-analytics/log-analytics-oms-gateway.md)
* Configure OMS to set up [automated alerting](../log-analytics/log-analytics-alerts.md) to aid in detecting and diagnostics
* Get familiarized with the [log search and querying](../log-analytics/log-analytics-log-searches.md) features offered as part of Log Analytics
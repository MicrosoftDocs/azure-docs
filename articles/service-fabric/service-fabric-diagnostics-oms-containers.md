---
title: Monitor containers on Azure Service Fabric with Log Analytics | Microsoft Docs
description: Use Log Analytics for monitoring containers running on Azure Service Fabric clusters.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/1/2017
ms.author: dekapur

---

# Monitor containers with Log Analytics
 
This article covers the steps required to set up the OMS Log Analytics container monitoring solution to view container events. To set up your cluster to collect container events, see this [step-by-step tutorial](service-fabric-tutorial-monitoring-wincontainers.md).

## Set up the container monitoring solution

> [!NOTE]
> You need to have Log Analytics set up for your cluster as well as have the OMS Agent deployed on your nodes. If you don't, follow the steps in [Set up Log Analytics](service-fabric-diagnostics-oms-setup.md) and [Add the OMS Agent to a cluster](service-fabric-diagnostics-oms-agent.md) first.

1. Once your cluster is set up with Log Analytics and the OMS Agent, deploy your containers. Wait for your containers to be deployed before moving to the next step.

2. In Azure Marketplace, search for *Container Monitoring Solution* and click on the **Container Monitoring Solution** resource that shows up under the Monitoring + Management category.

    ![Adding Containers solution](./media/service-fabric-diagnostics-event-analysis-oms/containers-solution.png)

3. Create the solution inside the same workspace that has already been created for the cluster. This change automatically triggers the agent to start gathering docker data on the containers. In about 15 minutes or so, you should see the solution light up with incoming logs and stats. as shown in the image below.

    ![Basic OMS Dashboard](./media/service-fabric-diagnostics-event-analysis-oms/oms-containers-dashboard.png)

The agent enables the collection of several container-specific logs that can be queried in OMS, or used to visualized performance indicators. The log types that are collected are:

* ContainerInventory: shows information about container location, name, and images
* ContainerImageInventory: information about deployed images, including IDs or sizes
* ContainerLog: specific error logs, docker logs (stdout, etc.), and other entries
* ContainerServiceLog: docker daemon commands that have been run
* Perf: performance counters including container cpu, memory, network traffic, disk i/o, and custom metrics from the host machines



## Next steps
* Learn more about [OMS's Containers solution](../log-analytics/log-analytics-containers.md).
* Read more about container orchestration on Service Fabric - [Service Fabric and containers](service-fabric-containers-overview.md)
* Get familiarized with the [log search and querying](../log-analytics/log-analytics-log-searches.md) features offered as part of Log Analytics
* Configure Log Analytics to set up [automated alerting](../log-analytics/log-analytics-alerts.md) rules to aid in detecting and diagnostics
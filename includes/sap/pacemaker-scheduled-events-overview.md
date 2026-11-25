---
title: Pacemaker Cluster Azure Scheduled Events Overview
description: Include File for Pacemaker Cluster Azure Scheduled Events Overview
services: 
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 08/01/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---
[Scheduled Events][azdoc-vm-linux-scheduled-events] is an Azure Metadata Service that gives your application time to prepare for VM maintenance. It provides information about upcoming maintenance events, such as a reboot, so that your application can prepare for them and limit disruption. 

The [azure-events-az][github-clusterlabs-resource-agents-pr] resource agent monitors this metadata service. When the agent detects events and determines that another cluster node is available, it sets a node-level health attribute `#health-azure` to `-1000000`. This value causes the cluster to consider the node unhealthy and migrates resources away from the affected node. The location constraint ensures resources starting with `health-` are excluded, as the azure-events-az agent still needs to run on both nodes. Once the affected cluster node is free of running cluster resources, the agent notifies the metadata service and the scheduled event can continue. When all events complete, the resource agent sets the `#health-azure` attribute back to `0`, marking the node as healthy again.

> [!IMPORTANT]
> Previously, this document described the use of resource agent [azure-events][github-clusterlabs-azure-events]. New resource agent [azure-events-az][github-clusterlabs-azure-events-az] fully supports Azure environments deployed in different availability zones.
> Use the newer azure-events-az agent for all SAP highly available systems with Pacemaker.

[azdoc-vm-linux-scheduled-events]: /azure/virtual-machines/linux/scheduled-events
[github-clusterlabs-resource-agents-pr]: https://github.com/ClusterLabs/resource-agents/pull/1161
[github-clusterlabs-azure-events]: https://github.com/ClusterLabs/resource-agents/blob/main/heartbeat/azure-events.in
[github-clusterlabs-azure-events-az]: https://github.com/ClusterLabs/resource-agents/blob/main/heartbeat/azure-events-az.in
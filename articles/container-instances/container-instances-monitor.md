---
title: Monitor containers in Azure Container Instances
description: Details on how to monitor the consumption of compute resources like CPU and memory by your containers in Azure Container Instances.
services: container-instances
author: neilpeterson
manager: jeconnoc

ms.service: container-instances
ms.topic: overview
ms.date: 04/25/2018
ms.author: nepeters
---
# Monitor container resources in Azure Container Instances

Azure Monitor provides insight into the compute resources used by your containers instances. Use Azure Monitor to track the CPU and memory utilization of container groups and their containers. This resource usage data helps you determine the best CPU and memory settings for your container groups.

This document details gathering CPU and memory usage for container instances using both the Azure portal and Azure CLI.

## Available metrics

CPU metrics are expressed in **millicores**. One millicore is 1/1000th of a CPU core, so 500 millicores (or 500m) represents 50% utilization of a CPU core. Memory metrics are expressed in bytes. Both CPU and memory metrics are available for a container group and individual container.

## Get metrics portal

When a container group is deployed, Azure Monitor data is immediately available in the Azure portal. To see metrics for a container group, navigate to the resource group and select the container group. Here you will find pre-create charts for both CPU and memory usage of the container group.

![dual-chart][dual-chart]

If you have a container group that contains multiple containers, an Azure Monitoring dimension can be used to present metrics for each individual container. To create an Azure Monitor chart with individual container metrics, perform the following:

Navigate to the Azure Monitoring hub by selecting **Monitor** from the left-hand Azure menu and select **Metrics (preview)**. Select your container group, a metric (CPU or Memory). To display metric for the individual containers, select the dimension button ![dimension][dimension], and select **Container Name**.

Example CPU usage per container.

![Container instance CPU chart][cpu-chart]

Example memory usage per container.

![Container instance memory chart][memory-chart]

## Get metrics Azure CLI

Get the container id:

```console
CONTAINER=$(az container show --resource-group myacicontainer --name myacicontainer-mya1 --query id -o tsv)
```

Get CPU usage for the container.

```console
$ az monitor metrics list --resource $CONTAINER --metric CPUUsage -o table

Timestamp            Name              Average
-------------------  ------------  -----------
2018-04-22 04:39:00  CPU Usage
2018-04-22 04:40:00  CPU Usage
2018-04-22 04:41:00  CPU Usage
2018-04-22 04:42:00  CPU Usage
2018-04-22 04:43:00  CPU Usage      0.375
2018-04-22 04:44:00  CPU Usage      0.875
2018-04-22 04:45:00  CPU Usage      1
2018-04-22 04:46:00  CPU Usage      3.625
2018-04-22 04:47:00  CPU Usage      1.5
2018-04-22 04:48:00  CPU Usage      2.75
2018-04-22 04:49:00  CPU Usage      1.625
2018-04-22 04:50:00  CPU Usage      0.625
2018-04-22 04:51:00  CPU Usage      0.5
2018-04-22 04:52:00  CPU Usage      0.5
2018-04-22 04:53:00  CPU Usage      0.5
```

Get memory usage for the container.

```console
$ az monitor metrics list --resource $CONTAINER --metric MemoryUsage -o table

Timestamp            Name              Average
-------------------  ------------  -----------
2018-04-22 04:38:00  Memory Usage
2018-04-22 04:39:00  Memory Usage
2018-04-22 04:40:00  Memory Usage
2018-04-22 04:41:00  Memory Usage
2018-04-22 04:42:00  Memory Usage  6.76915e+06
2018-04-22 04:43:00  Memory Usage  9.22061e+06
2018-04-22 04:44:00  Memory Usage  9.83552e+06
2018-04-22 04:45:00  Memory Usage  8.42906e+06
2018-04-22 04:46:00  Memory Usage  8.39526e+06
2018-04-22 04:47:00  Memory Usage  8.88013e+06
2018-04-22 04:48:00  Memory Usage  8.89293e+06
2018-04-22 04:49:00  Memory Usage  9.2073e+06
2018-04-22 04:50:00  Memory Usage  9.36243e+06
2018-04-22 04:51:00  Memory Usage  9.30509e+06
2018-04-22 04:52:00  Memory Usage  9.2416e+06
2018-04-22 04:53:00  Memory Usage  9.1008e+06
```

```
$ az monitor metrics list --resource $CONTAINER --metric CPUUsage --dimension containerName -o table

Timestamp            Name              Average
-------------------  ------------  -----------
2018-04-22 04:40:00  CPU Usage  aci-tutorial-app
2018-04-22 04:41:00  CPU Usage  aci-tutorial-app
2018-04-22 04:42:00  CPU Usage  aci-tutorial-app
2018-04-22 04:43:00  CPU Usage  aci-tutorial-app
2018-04-22 04:44:00  CPU Usage  aci-tutorial-app           0.75
2018-04-22 04:45:00  CPU Usage  aci-tutorial-app           1
2018-04-22 04:46:00  CPU Usage  aci-tutorial-app           6.25
2018-04-22 04:47:00  CPU Usage  aci-tutorial-app           2
2018-04-22 04:48:00  CPU Usage  aci-tutorial-app           4.5
2018-04-22 04:49:00  CPU Usage  aci-tutorial-app           2.25
2018-04-22 04:50:00  CPU Usage  aci-tutorial-app           0.25
```

## Alerts

Create alerts based on specific metrics to be notified when they drift outside thresholds you set. For example, create an alert to be notified when average CPU usage exceeds a certain threshold, or available memory drops below a certain level. Configure alerts in the [Azure portal](../monitoring-and-diagnostics/insights-alerts-portal.md), with the [Azure CLI](../monitoring-and-diagnostics/insights-alerts-command-line-interface.md), or in [Azure PowerShell](../monitoring-and-diagnostics/insights-alerts-powershell.md).

## Next steps

Like all Azure services, Azure Container Instances includes certain default limits and quotas for resources and features. Find details on these limits and how to request quota increases in [Quotas and region availability for Azure Container Instances](container-instances-quotas.md).

<!-- IMAGES -->
[cpu-chart]: ./media/container-instances-monitor/cpu-multi.png
[dimension]: ./media/container-instances-monitor/dimension.png
[dual-chart]: ./media/container-instances-monitor/metrics.png
[memory-chart]: ./media/container-instances-monitor/memory-multi.png
<!-- LINKS - External -->
<!-- LINKS - Internal -->
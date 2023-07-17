---
title: Monitor Kubernetes environment - network engineer
description: Monitor Kubernetes environment - network engineer
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/07/2023
---

# Monitor Kubernetes environment - network engineer

The Network Engineer is responsible for traffic between workloads and any ingress/egress with the cluster. They analyze network traffic and perform threat analysis.

:::image type="content" source="media/monitor-containers/layers-network-engineer.png" alt-text="Diagram of Kubernetes layers for network engineer" lightbox="media/monitor-containers/layers-network-engineer.png"  border="false":::

## Azure services

Azure has a complete set of services for monitoring the different layers of your Kubernetes infrastructure and the applications that depend on it as described in the following table. These services work in conjunction with each other to provide a complete monitoring solution, or you may integrate them with your existing monitoring tools.

Your choice of monitoring tools will depend on the requirements of your particular environment in addition to any existing investment in cloud native technologies endorsed by the [Cloud Native Computing Foundation](https://www.cncf.io/). Azure includes managed versions of the most standard tools and features that help you integrate your kubernetes clusters and workloads.

| Service | Description |
|:---|:---|
| [Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) | Suite of tools in Azure to monitor the virtual networks used by your Kubernetes clusters and diagnose detected issues. |
| [Network insights](../../network-watcher/network-insights-overview.md) | Feature of Azure Monitor that includes a visual representation of the performance and health of different network components and provides access to the network monitoring tools that are part of Network Watcher. |


## Configure network monitoring

[Network insights](../../network-watcher/network-insights-overview.md) is enabled by default and requires no configuration. Network Watcher is also typically [enabled by default in each Azure region](../../network-watcher/network-watcher-create.md). 

Create [flow logs](../../network-watcher/network-watcher-nsg-flow-logging-overview.md) to log information about the IP traffic flowing through network security groups used by your cluster and then use [traffic analytics](../../network-watcher/traffic-analytics.md) to analyze and provide insights on this data. You'll most likely use the same Log Analytics workspace for traffic analytics that you use for Container insights and your control plane logs.


## Additional scenarios

**How can I detect any data exfiltration for my cluster?**

 - Use traffic analytics to determine if any traffic is flowing to either to or from any unexpected ports used by the cluster.

**How can I detect if any unnecessary public IPs are exposed?**

- Use traffic analytics to identify traffic flowing over public IPs. Provide this information to security engineers to ensure that no unnecessary public IPs are exposed.

**How can I verify that my network rules are configured correctly?**
- Follow the previous guidance for detecting any unexpected activity and then analyze your network rules to determine why such traffic is allowed.


## Next steps

- See [Monitor Kubernetes clusters with Azure services](monitor-kubernetes-analyze.md) for details on how to use the tools described in this article to monitor your Kubernetes clusters.


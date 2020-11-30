---
title: Concepts - Sustainable software engineering in Azure Kubernetes Services (AKS)
description: Learn about sustainable software engineering in Azure Kubernetes Service (AKS).
services: container-service
ms.topic: conceptual
ms.date: 08/26/2020
---

# Sustainable software engineering principles in Azure Kubernetes Service (AKS)

The sustainable software engineering principles are a set of competencies to help you define, build, and run sustainable applications. The overall goal is to reduce your carbon footprint of every aspect of your application. The [Principles.Green project][principles-green] has an overview of the principles of sustainable software engineering.

An important idea to understand about sustainable software engineering is that it's a shift in priorities and focus. In many cases, software is designed and ran in a way that focuses on fast performance and low latency. Sustainable software engineering focuses on reducing as much carbon emissions as possible. In some cases, applying sustainable software engineering principles can give you faster performance or lower latency, such as by lowering total network travel. In other cases, reducing carbon emissions may cause slower performance or increased latency, such as delaying low-priority workloads. Before considering applying sustainable software engineering principles to your application, review the priorities, needs, and trade-offs of your application.

## Measure and optimize

To lower the carbon footprint of your AKS clusters, you need understand how your cluster's resources are being used. [Azure Monitor][azure-monitor] provides details on your cluster's resource usage, such as memory and CPU usage. This data can help inform your decisions to reduce the carbon footprint of your cluster and observe the effect of your changes. You can also install the [Microsoft Sustainability Calculator][sustainability-calculator] to see the carbon footprint of all your Azure resources.

## Increase resource utilization

One approach to lowering your carbon footprint is to reduce the amount of idle time for your compute resources. Reducing your idle time involves increasing the utilization of your compute resources. For example, if you had four nodes in your cluster, each running at 50% capacity, all four of your nodes have 50% unused capacity remaining idle. If you reduced your cluster to three nodes, then the same workload would cause your three nodes to run at 67% capacity, reducing your unused capacity to 33% on each node and increasing your utilization.

> [!IMPORTANT]
> When considering making changes to the resources in your cluster, verify your [system pools][system-pools] have enough resources to maintain the stability of the core system components of your cluster. Never reduce your cluster's resources to the point where your cluster may become unstable.

After reviewing your cluster's utilization, consider using the features offered by [multiple node pools][multiple-node-pools]. You can use [node sizing][node-sizing] to define node pools with specific CPU and memory profiles, allowing you to tailor your nodes to your workload needs. Sizing your nodes to your workload needs can help you run few nodes at higher utilization. You can also configure how your cluster [scales][scale] and use the [horizontal pod autoscaler][scale-horizontal] and the [cluster autoscaler][scale-auto] to scale your cluster automatically based on your configuration. Controlling how your cluster scales can help you keep all your nodes running at a high utilization while keeping up with changes to your cluster's workload. For cases where a workload is tolerant to sudden interruptions or terminations, you can use [spot pools][spot-pools] to take advantage of idle capacity within Azure. For example, spot pools may work well for batch jobs or development environments.

Increasing utilization can also reduce excess nodes, which reduces the energy consumed by [resource reservations on each node][resource-reservations].

Also review the CPU and memory *requests* and *limits* in the Kubernetes manifests of your applications. As you lower those values for memory and CPU, more memory and CPU are available to the cluster to run other workloads. As you run more workloads with lower CPU and memory, your cluster becomes more densely allocated which increases your utilization. When reducing the CPU and memory for your applications, the behavior of your applications may become degraded or unstable if you set these values too low. Before changing the CPU and memory *requests* and *limits*, consider running some benchmarking tests to understand if these values are set appropriately. Moreover, never reduce these values to the point when your application becomes unstable.

## Reduce network travel

Reducing the distance requests and responses to and from your cluster have to travel usually reduces electricity consumption by networking devices and reduces carbon emissions. After reviewing your network traffic, consider creating clusters [in regions][regions] closer to the source of your network traffic. You can also use [Azure Traffic Manager][azure-traffic-manager] to help with routing traffic to the closest cluster and [proximity placement groups][proiximity-placement-groups] to help reduce the distance between Azure resources.

> [!IMPORTANT]
> When considering making changes to your cluster's networking, never reduce network travel at the cost of meeting workload requirements. For example, using [availability zones][availability-zones] causes more network travel on your cluster but using that feature may be necessary to handle workload requirements.

## Demand shaping

Where possible, consider shifting demand for your cluster's resources to times or regions where you can use excess capacity. For example, consider changing the time or region for a batch job to run or use [spot pools][spot-pools]. Also consider refactoring your application to use a queue to defer running workloads that don't need immediate processing.

## Next steps

Learn more about the features of AKS mentioned in this article:

* [Multiple node pools][multiple-node-pools]
* [Node sizing][node-sizing]
* [Scaling a cluster][scale]
* [Horizontal pod autoscaler][scale-horizontal]
* [Cluster autoscaler][scale-auto]
* [Spot pools][spot-pools]
* [System pools][system-pools]
* [Resource reservations][resource-reservations]
* [Proximity placement groups][proiximity-placement-groups]
* [Availability Zones][availability-zones]

[availability-zones]: availability-zones.md
[azure-monitor]: ../azure-monitor/insights/container-insights-overview.md
[azure-traffic-manager]: ../traffic-manager/traffic-manager-overview.md
[proiximity-placement-groups]: reduce-latency-ppg.md
[regions]: faq.md#which-azure-regions-currently-provide-aks
[resource-reservations]: concepts-clusters-workloads.md#resource-reservations
[scale]: concepts-scale.md
[scale-auto]: concepts-scale.md#cluster-autoscaler
[scale-horizontal]: concepts-scale.md#horizontal-pod-autoscaler
[spot-pools]: spot-node-pool.md
[multiple-node-pools]: use-multiple-node-pools.md
[node-sizing]: use-multiple-node-pools.md#specify-a-vm-size-for-a-node-pool
[sustainability-calculator]: https://azure.microsoft.com/blog/microsoft-sustainability-calculator-helps-enterprises-analyze-the-carbon-emissions-of-their-it-infrastructure/
[system-pools]: use-system-pools.md
[principles-green]: https://principles.green/
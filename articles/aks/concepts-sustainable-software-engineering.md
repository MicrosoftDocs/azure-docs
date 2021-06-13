---
title: Concepts - Sustainable software engineering in Azure Kubernetes Services (AKS)
description: Learn about sustainable software engineering in Azure Kubernetes Service (AKS).
services: container-service
ms.topic: conceptual
ms.date: 03/29/2021
---

# Sustainable software engineering principles in Azure Kubernetes Service (AKS)

The sustainable software engineering principles are a set of competencies to help you define, build, and run sustainable applications. The overall goal is to reduce your carbon footprint of every aspect of your application. [The Principles of Sustainable Software Engineering][principles-sse] has an overview of the principles of sustainable software engineering.

Sustainable software engineering is a shift in priorities and focus. In many cases, the way most software is designed and run highlights fast performance and low latency. Meanwhile, sustainable software engineering focuses on reducing as much carbon emission as possible. Consider:

* Applying sustainable software engineering principles can give you faster performance or lower latency, such as by lowering total network travel. 
* Reducing carbon emissions may cause slower performance or increased latency, such as delaying low-priority workloads. 

Before applying sustainable software engineering principles to your application, review the priorities, needs, and trade-offs of your application.

## Measure and optimize

To lower the carbon footprint of your AKS clusters, you need understand how your cluster's resources are being used. [Azure Monitor][azure-monitor] provides details on your cluster's resource usage, such as memory and CPU usage. This data informs your decision to reduce the carbon footprint of your cluster and observes the effect of your changes. 

You can also install the [Microsoft Sustainability Calculator][sustainability-calculator] to see the carbon footprint of all your Azure resources.

## Increase resource utilization

One approach to lowering your carbon footprint is to reduce your idle time. Reducing your idle time involves increasing the utilization of your compute resources. For example:
1. You had four nodes in your cluster, each running at 50% capacity. So, all four of your nodes have 50% unused capacity remaining idle. 
1. You reduced your cluster to three nodes, each running at 67% capacity with the same workload. You would have successfully decreased your unused capacity to 33% on each node and increased your utilization.

> [!IMPORTANT]
> When considering changing the resources in your cluster, verify your [system pools][system-pools] have enough resources to maintain the stability of your cluster's core system components. **Never** reduce your cluster's resources to the point where your cluster may become unstable.

After reviewing your cluster's utilization, consider using the features offered by [multiple node pools][multiple-node-pools]: 

* Node sizing

    Use [node sizing][node-sizing] to define node pools with specific CPU and memory profiles, allowing you to tailor your nodes to your workload needs. By sizing your nodes to your workload needs, you can run a few nodes at higher utilization. 

* Cluster scaling

    Configure how your cluster [scales][scale]. Use the [horizontal pod autoscaler][scale-horizontal] and the [cluster autoscaler][scale-auto] to scale your cluster automatically based on your configuration. Control how your cluster scales to keep all your nodes running at a high utilization while staying in sync with changes to your cluster's workload. 

* Spot pools

    For cases where a workload is tolerant to sudden interruptions or terminations, you can use [spot pools][spot-pools]. Spot pools take advantage of idle capacity within Azure. For example, spot pools may work well for batch jobs or development environments.

> [!NOTE]
>Increasing utilization can also reduce excess nodes, which reduces the energy consumed by [resource reservations on each node][resource-reservations].

Finally, review the CPU and memory *requests* and *limits* in the Kubernetes manifests of your applications. 
* As you lower memory and CPU values, more memory and CPU are available to the cluster to run other workloads. 
* As you run more workloads with lower CPU and memory, your cluster becomes more densely allocated, which increases your utilization. 

When reducing the CPU and memory for your applications, your applications' behavior may become degraded or unstable if you set CPU and memory values too low. Before changing the CPU and memory *requests* and *limits*, run some benchmarking tests to verify if the values are set appropriately. Never reduce these values to the point of application instability.

## Reduce network travel

By reducing requests and responses travel distance to and from your cluster, you can reduce carbon emissions and electricity consumption by networking devices. After reviewing your network traffic, consider creating clusters [in regions][regions] closer to the source of your network traffic. You can use [Azure Traffic Manager][azure-traffic-manager] to route traffic to the closest cluster and [proximity placement groups][proiximity-placement-groups] and reduce the distance between Azure resources.

> [!IMPORTANT]
> When considering making changes to your cluster's networking, never reduce network travel at the cost of meeting workload requirements. For example, while using [availability zones][availability-zones] causes more network travel on your cluster, availability zones may be necessary to handle workload requirements.

## Demand shaping

Where possible, consider shifting demand for your cluster's resources to times or regions where you can use excess capacity. For example, consider:
* Changing the time or region for a batch job to run.
* Using [spot pools][spot-pools]. 
* Refactoring your application to use a queue to defer running workloads that don't need immediate processing.

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
[azure-monitor]: ../azure-monitor/containers/container-insights-overview.md
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
[principles-sse]: https://docs.microsoft.com/learn/modules/sustainable-software-engineering-overview/
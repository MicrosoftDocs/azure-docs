---
title: Recommended active-active high availability solution overview for Azure Kubernetes Service (AKS)
description: Learn about the recommended active-active high availability solution overview for Azure Kubernetes Service (AKS).
author: schaffererin
ms.author: schaffererin
ms.service: azure-kubernetes-service
ms.topic: concept-article
ms.date: 11/27/2023
---

# Recommended active-active high availability solution overview for Azure Kubernetes Service (AKS)

When you create an application in Azure Kubernetes Service (AKS) and choose an Azure region during resource creation, it's a single-region app. In the event of a disaster that causes the region to become unavailable, your application also becomes unavailable. If you create an identical deployment in a secondary Azure region, your application becomes less susceptible to a single-region disaster, which guarantees business continuity, and any data replication across the regions lets you recover your last application state.

While there are multiple patterns that can provide recoverability for an AKS solution, this guide outlines the recommended active-active high availability solution for AKS. Within this solution, we deploy two independent and identical AKS clusters into two paired Azure regions with both clusters actively serving traffic.

> [!NOTE]
> The following use case can be considered standard practice within AKS. It has been reviewed internally and vetted in conjunction with our Microsoft partners.

## Active-active high availability solution overview

This solution relies on two identical AKS clusters configured to actively serve traffic. You place a global traffic manager, such as [Azure Front Door](../frontdoor/front-door-overview.md), in front of the two clusters to distribute traffic across them. You must consistently configure the clusters to host an instance of all applications required for the solution to function.

Availability zones are another way to ensure high availability and fault tolerance for your AKS cluster within the same region. Availability zones allow you to distribute your cluster nodes across multiple isolated locations within an Azure region. This way, if one zone goes down due to a power outage, hardware failure, or network issue, your cluster can continue to run and serve your applications. Availability zones also improve the performance and scalability of your cluster by reducing the latency and contention among nodes. To set up availability zones for your AKS cluster, you need to specify the zone numbers when creating or updating your node pools. For more information, see [What are Azure availability zones?](../reliability/availability-zones-overview.md)

> [!NOTE]
> Availability zones aren’t a replacement for region down resiliency and can be used simultaneously as an added step to ensure high availability.

## Scenarios and configurations

This solution is best implemented when hosting stateless applications and/or with other technologies also deployed across both regions, such as horizontal scaling. In scenarios where the hosted application is reliant on resources, such as databases, that are actively in only one region, we recommend instead implementing an [active-passive solution](./active-passive-solution.md) for potential cost savings, as active-passive has more downtime than active-active.

## Components

The active-active high availability solution uses many Azure services. This section covers only the components unique to this multi-cluster architecture. For more information on the remaining components, see the [AKS baseline architecture](/reference/reference-architectures/containers/aks/baseline-aks).

**Multiple clusters and regions**: You deploy multiple AKS clusters, each in a separate Azure region. During normal operations, your Azure Front Door configuration routes network traffic between all regions. If one region becomes unavailable, traffic routes to a region with the fastest load time for the user.

**Hub-spoke network per region**: A regional hub-spoke network pair is deployed for each regional AKS instance. [Azure Firewall Manager](../firewall-manager/overview.md) policies manage the firewall policies across all regions.

**Regional key store**: You provision [Azure Key Vault](../key-vault/general/overview.md) in each region to store sensitive values and keys specific to the AKS instance and to support services found in that region.

**Azure Front Door**: [Azure Front Door](../frontdoor/front-door-overview.md) load balances and routes traffic to a regional [Azure Application Gateway](../application-gateway/overview.md) instance, which sits in front of each AKS cluster. Azure Front Door allows for *layer seven* global routing.

**Log Analytics**: Regional [Log Analytics](../azure-monitor/logs/log-analytics-overview.md) instances store regional networking metrics and diagnostic logs. A shared instance stores metrics and diagnostic logs for all AKS instances.

**Container Registry**: The container images for the workload are stored in a managed container registry. With this solution, a single [Azure Container Registry](../container-registry/container-registry-intro.md) instance is used for all Kubernetes instances in the cluster. Geo-replication for Azure Container Registry enables you to replicate images to the selected Azure regions and provides continued access to images even if a region experiences an outage.

## Failover process

If a service or service component becomes unavailable in one region, traffic should be routed to a region where that service is available. A multi-region architecture includes many different failure points. In this section, we cover the potential failure points.

### Application Pods (Regional)

A Kubernetes deployment object creates multiple replicas of a pod (*ReplicaSet*). If one is unavailable, traffic is routed between the remaining replicas. The Kubernetes *ReplicaSet* attempts to keep the specified number of replicas up and running. If one instance goes down, a new instance should be recreated. [Liveness probes](../container-instances/container-instances-liveness-probe.md) can check the state of the application or process running in the pod. If the pod is unresponsive, the liveness probe removes the pod, which forces the *ReplicaSet* to create a new instance.

For more information, see [Kubernetes ReplicaSet](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/).

### Application Pods (Global)

When an entire region becomes unavailable, the pods in the cluster are no longer available to serve requests. In this case, the Azure Front Door instance routes all traffic to the remaining health regions. The Kubernetes clusters and pods in these regions continue to serve requests. To compensate for increased traffic and requests to the remaining cluster, keep in mind the following guidance:

- Make sure network and compute resources are right sized to absorb any sudden increase in traffic due to region failover. For example, when using Azure Container Network Interface (CNI), make sure you have a subnet that can support all pod IPs with a spiked traffic load.
- Use the [Horizontal Pod Autoscaler](./concepts-scale.md#horizontal-pod-autoscaler) to increase the pod replica count to compensate for the increased regional demand.
- Use the AKS [Cluster Autoscaler](./cluster-autoscaler.md) to increase the Kubernetes instance node counts to compensate for the increased regional demand.

### Kubernetes node pools (Regional)

Occasionally, localized failure can occur to compute resources, such as power becoming unavailable in a single rack of Azure servers. To protect your AKS nodes from becoming a single point regional failure, use [Azure Availability Zones](./availability-zones.md). Availability zones ensure that AKS nodes in each availability zone are physically separated from those defined in another availability zones.

### Kubernetes node pools (Global)

In a complete regional failure, Azure Front Door routes traffic to the remaining healthy regions. Again, make sure to compensate for increased traffic and requests to the remaining cluster.

## Failover testing strategy

While there are no mechanisms currently available within AKS to take down an entire region of deployment for testing purposes, [Azure Chaos Studio](../chaos-studio/chaos-studio-overview.md) offers the ability to create a chaos experiment on your cluster.

One example experiment you can use is taking down an entire Availability Zone for the Virtual Machine Scale Sets instances with autoscale disabled. To create a test in the Azure portal, use the following steps:

1. [Create a chaos experiment to shut down all targets in a zone](../chaos-studio/chaos-studio-tutorial-dynamic-target-portal.md).
2. Enable Chaos Studio on your AKS cluster by selecting your cluster resource and enabling service-direct targets.
3. Create a new experiment in Chaos Studio and add a name for it.
4. In the experiment designer, add a fault action and select the **VMSS Shutdown (version 2.0) fault**.
5. Choose the duration and abruptness of the shutdown and select the virtual machine scale set resource that you want to use in the experiment.
6. In the scope section, select the zone where you want to shut down the VMs in the scale set and add it to the experiment.
7. Review and create the experiment and run it when ready.

> [!NOTE]
> You can also [use the Azure CLI to create and run a chaos experiment](../chaos-studio/chaos-studio-tutorial-agent-based-cli.md).

## Next steps

TBD

---
title: Zone resiliency considerations for Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn about the various considerations for zone resiliency in Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 04/09/2024
author: schaffererin
ms.author: schaffererin
---

# Zone resiliency considerations for Azure Kubernetes Service (AKS)

In this article, you learn about the various considerations for zone resiliency in Azure Kubernetes Service (AKS), including how to:

* Make your AKS cluster components zone resilient
* Design a stateless application
* Make your storage disk decision
* Test for availability zone (AZ) resiliency

## Overview

AZ resiliency is a key part of running production-grade Kubernetes clusters. With scalability at its core, Kubernetes takes full advantage of independent infrastructure in data centers without incurring additional costs by provisioning new nodes only when necessary.

Simply scaling up or down the number of nodes in a cluster isn't enough to ensure application resiliency. You must gain a deeper understanding of your application and its dependencies to better plan for resiliency. While AKS provides AZ resiliency for its clusters, the decisions you make about your application's dependencies, such as the storage disk type and networking policies, play a critical role in ensuring that your application is resilient to failures.

## Make your AKS cluster components zone resilient

### Create zone redundant clusters and node pools

AKS allows you to select multiple AZs during cluster and node pool creation. When you create a cluster with multiple AZs, the control plane is spread across the selected AZs. The nodes in the node pool are also spread across the selected AZs. This approach ensures that the control plane and the nodes are distributed across multiple AZs, providing resiliency in case of an AZ failure. You can configure AZs using the Azure portal, Azure CLI, or Azure Resource Manager templates.

The following example shows how to create a cluster with three nodes spread across three AZs using the Azure CLI:

```azurecli-interactive
az aks create --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --generate-ssh-keys --vm-set-type VirtualMachineScaleSets --load-balancer-sku standard --node-count 3 --zones 1 2 3
```

Once the cluster is created, you can use the following command to retrieve the region and availability zone for each agent node from the labels:

```bash
kubectl describe nodes | grep -e "Name:" -e "topology.kubernetes.io/zone"
```

The following example output shows the region and availability zone for each agent node:

```output
Name:       aks-nodepool1-28993262-vmss000000
            topology.kubernetes.io/zone=eastus2-1
Name:       aks-nodepool1-28993262-vmss000001
            topology.kubernetes.io/zone=eastus2-2
Name:       aks-nodepool1-28993262-vmss000002
            topology.kubernetes.io/zone=eastus2-3
```

For more information, see [Use availability zones in Azure Kubernetes Service (AKS)](./availability-zones.md).

### Ensure pods are spread across AZs

You can use pod topology spread constraints based on the `zone` and `hostname` labels to spread pods across AZs within a region and across nodes within AZs.

For example, let's say you a have a four-node cluster where three pods labeled `foo:bar` are located in `node1`, `node2`, and `node3` respectively. If you want an incoming pod to be evenly distributed with existing pods across zones, you can use a manifest similar to the following example:

```yml
kind: Pod
apiVersion: v1
metadata:
  name: mypod
  labels:
    foo: bar
spec:
  topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        foo: bar
  containers:
  - name: pause
    image: registry.k8s.io/pause:3.1
```

For more information, see [Kubernetes Pod Topology Spread Constraints](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/).

### Load balance traffic across AZs

To ensure that your application is highly available and resilient to failures, you should load balance traffic across multiple AZs. You can use [Azure Load Balancer](../load-balancer/load-balancer-overview.md) to distribute incoming traffic across the nodes in your AKS cluster.

Azure Load Balancer supports both internal and external load balancing, and you can configure it to use a *Standard SKU* for zone-redundant load balancing. The Standard SKU supports AZs, zone resiliency, and cross-region load balancing to ensure your application isn't impacted by a region failure. In the event of a zone down scenario, a zone-redundant Standard SKU load balancer isn't impacted by the failure and enables your deployments to continue serving traffic from the remaining zones.

To create a Standard SKU load balancer in AKS, see [Use a standard load balancer in Azure Kubernetes Service (AKS)](./load-balancer-standard.md).

### Configure AZ-aware networking



### Use autoscaling for your workloads

You can improve application availability and resiliency in AKS using autoscaling features, which help you achieve the following goals:

* Optimize resource utilization and cost efficiency by scaling up or down based on the CPU and memory usage of your pods.
* Enhance fault tolerance and recovery by adding more nodes or pods when a zone failure occurs.

You can use the [Horizontal Pod Autoscaler (HPA)](./concepts-scale.md#horizontal-pod-autoscaler) and [Cluster Autoscaler](./cluster-autoscaler-overview.md) to implement autoscaling in AKS. The HPA automatically scales the number of pods in a deployment based on observed CPU utilization, memory utilization, custom metrics, and metrics of other services. The Cluster Autoscaler automatically adjusts the number of nodes in a node pool based on the resource requests of the pods running on the nodes.

## Design a stateless application

When an application is *stateless*, the application logic and data are decoupled, and the pods don't store any persistent or session data on their local disks. This design allows the application to be easily scaled up or down without worrying about data loss. Stateless applications are more resilient to failures because they can be easily replaced or rescheduled on a different node in case of a node failure.

When designing a stateless application with AKS, you should use managed Azure services, such [Azure Databases](https://azure.microsoft.com/products/category/databases/), [Azure Cache for Redis](../azure-cache-for-redis/cache-overview.md), or [Azure Storage](https://azure.microsoft.com/products/category/storage/) to store the application data. Using these services ensures your traffic can be moved across nodes and zones without risking data loss or impacting the user experience. You can use Kubernetes [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), [Services](https://kubernetes.io/docs/concepts/services-networking/service/), and [Health Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) to manage stateless pods and ensure even distribution across zones.

## Make your storage disk decision

### Choose the right disk type based on application needs

Azure offers two types of disks for persistent storage: locally redundant storage (LRS) and zone redundant storage (ZRS). LRS replicates your data within a single AZ. ZRS replicates your data across multiple AZs within a region.

The following table outlines pros and cons of each disk type:

| Disk type | Pros | Cons |
| --------- | ---- | ---- |
| LRS | • Lower cost <br> • Supported for all disk sizes and regions <br> • Easy to use and provision | • Lower availability and durability <br> • Vulnerable to zonal failures <br> • Doesn't support geo-replication |
| ZRS | • Higher availability and durability <br> • More resilient to zonal failures <br> • Supports geo-replication for disaster recovery | • Higher cost <br> • Not supported for all disk sizes and regions <br> • Requires extra configuration to enable |

For more information on the LRS and ZRS disk types, see [Azure Storage redundancy](../storage/common/storage-redundancy.md#redundancy-in-the-primary-region). To provision storage disks in AKS, see [Provision Azure Disks storage in Azure Kubernetes Service (AKS)](./azure-csi-files-storage-provision.md).

### Monitor disk performance

To ensure optimal performance and availability of your storage disks in AKS, you should monitor key metrics, such as IOPS, throughput, and latency. These metrics can help you identify any issues or bottlenecks that might impact your application's performance. If you notice any consistent performance issues, you might want to reconsider your storage disk type or size. You can use Azure Monitor to collect and visualize these metrics and set up alerts to notify you of any performance issues. 

For more information, see [Monitor Azure Kubernetes Service (AKS) with Azure Monitor](./monitor-aks.md).

## Test for AZ resiliency

### Method 1: Cordon and drain nodes in a single AZ

One way to test your AKS cluster for AZ resiliency is to drain a node in one region and see how it affects traffic until it fails over to another region. This method simulates a real-world scenario where an entire zone is unavailable due to a disaster or outage. To test this scenario, you can use the `kubectl drain` command to gracefully evict all pods from a node and mark it as unschedulable. You can then monitor cluster traffic and performance using tools such as Azure Monitor or Prometheus.

The following table outlines pros and cons of this method:

| Pros | Cons |
| ---- | ---- |
| • Mimics a realistic failure scenario and tests the recovery process <br> • Allows you to verify the availability and durability of your data across regions <br> • Helps you identify any potential issues or bottlenecks in your cluster configuration or application design | • Might cause temporary disruption or degradation of service for your users <br> • Requires manual intervention and coordination to drain and restore the node <br> • Might incur extra costs due to increased network traffic or storage replication |

### Method 2: Simulate an AZ failure using Azure Chaos Studio

Another way to test your AKS cluster for AZ resiliency is to inject faults into your cluster and observe the impact on your application using Azure Chaos Studio. Azure Chaos Studio is a service that allows you to create and manage chaos experiments on Azure resources and services. You can use Chaos Studio to simulate an AZ failure by creating a fault injection experiment that targets a specific zone and stops or restarts the virtual machines (VMs) in that zone. You can then measure the availability, latency, and error rate of your application using metrics and logs.

The following table outlines pros and cons of this method:

| Pros | Cons |
| ---- | ---- |
| • Provides a controlled and automated way to inject faults and monitor the results <br> • Supports various types of faults and scenarios, such as network latency, CPU stress, disk failure, etc. <br> • Integrates with Azure Monitor and other tools to collect and analyze data | • Might require extra configuration and setup to create and run experiments <br> • Might not cover all possible failure modes and edge zones that could occur during a real outage <br> • Might have limitations or restrictions on the scope and/or duration of the experiments |

For more information, see [What is Azure Chaos Studio?](../chaos-studio/chaos-studio-overview.md).


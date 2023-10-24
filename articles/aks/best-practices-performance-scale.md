---
title: Performance and scaling best practices for small to medium workloads in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn the best practices for performance and scaling in Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 10/24/2023
---

# Best practices for performance and scaling for small to medium workloads in Azure Kubernetes Service (AKS)

As you deploy and maintain clusters in AKS, you can use the following best practices to help you optimize performance and scaling.

In this article, you learn about:

> [!div class="checklist"]
>
> * Tradeoffs and recommendations for autoscaling your workloads.
> * Managing node scaling and efficiency based on your workload demands.
> * Networking considerations for ingress and egress traffic.
> * Monitoring and troubleshooting control plane and node performance.
> * Limitations and recommendations for using add-ons with your workloads.
> * Capacity planning, surge scenarios, and cluster upgrades.
> * Storage and networking considerations for data plane performance.

> [!NOTE]
> This article focuses on best practices for **small to medium workloads**. For best practices for **large workloads**, see [Performance and scaling best practices for large workloads in Azure Kubernetes Service (AKS)](LINK).

## Cluster autoscaling

### Using the Cluster Autoscaler

You should configure Cluster Autoscaler profile settings according to your workload demands, while also considering the balance between performance and cost.

In cases where your cluster handles substantial, but infrequent workloads with a primary focus on performance, we recommend increasing the scan interval and the utilization threshold. This adjustment helps batch multiple scaling operations into a single call, optimizing scale time and use of compute read/write quotas. This configuration also helps mitigate the risk of swift scale down operations on underutilized nodes, enhancing pod scheduling efficiency. For clusters with daemonset pods, we recommend setting `ignore-daemonset-utilization` to `true` to minimize unnecessary scale down operations.

If you want a cost-optimized profile, we recommend reducing the node unneeded time, utilization threshold, and scale-down delay after add operations. You can also increase *Max-bulk-delete* to help delete nodes in bulk. This configuration helps reduce the number of nodes in the cluster, which reduces the cost of the cluster. However, this configuration can also increase the time it takes to scale up the cluster.

The Cluster Autoscaler profile settings apply universally to all autoscaler-enabled node pools in your cluster. This means that any scaling actions occurring in one autoscaler-enabled node pool might impact the autoscaling behavior in another node pool. It's important to apply consistent and synchronized profile settings across all relevant node pools to ensure that the autoscaler behaves as expected.

## Application autoscaling

## Node scaling and efficiency

> **Best practice guidance**:
>
> Carefully monitor resource utilization and scheduling policies to ensure nodes are being used efficiently.

Node scaling allows you to dynamically adjust the number of nodes in your cluster based on workload demands. It's important to understand that adding more nodes to a cluster isn't always the best solution for improving performance. To ensure optimal performance, you should carefully monitor resource utilization and scheduling policies to ensure nodes are being used efficiently.

### Node image version

> **Best practice guidance**:
>
> Use the latest node image version to ensure that you have the latest security patches and bug fixes.

Using the latest node image version provides the best performance experience. AKS ships performance improvements within the weekly image releases.

### Virtual machine (VM) selection

> **Best practice guidance**:
>
> When selecting a VM, ensure the size and performance of the OS disk and VM SKU don't have a large discrepancy. A discrepancy in size or performance can cause performance issues and resource contention.

*Create* and *scale* latency have direct relationships with the VM SKUs you use in your workloads. The larger and more powerful the VM, the better the performance. For ***mission critical or product workloads***, we recommend using VMs with newer hardware generations, such as v4 and v5 machines, and at least an 8-core CPU.

OS disks are responsible for storing the operating system and its associated files, and the VMs are responsible for running the applications. When selecting a VM, ensure the size and performance of the OS disk and VM SKU don't have a large discrepancy. A discrepancy in size or performance can cause performance issues and resource contention. For example, if the OS disk is significantly smaller than the VMs, it can limit the amount of space available for application data and cause the system to run out of disk space. If the OS disk has lower performance than the VMs, it can cause a bottleneck, limiting the overall performance of the system. Make sure the size and performance are balanced to ensure optimal performance in Kubernetes.

### Node pools

For scaling performance and reliability, we recommend using a dedicated system node pool. The system node pool reserves resources for critical components like system OS daemons and kernel memory. We recommend running your application in a user node pool to increase the availability of allocatable resources for your workloads. This configuration also helps mitigate the risk of resource competition between the system and application.

### Create provisioning

Review the extensions and add-ons you have enabled during create provisioning. Extensions and add-ons can add latency to overall duration of create operations. If you don't need an extension or add-on, we recommend removing it to improve create latency.

You can also use availability zones to provide a higher level of availability to protect against potential hardware failures or planned maintenance events. AKS clusters distribute resources across logical sections of underlying Azure infrastructure. Availability zones physically separate nodes from other nodes to help ensure that a single failure doesn't impact the availability of your application. Availability zones are only available in certain regions. For more information, see [Availability zones in Azure](LINK).

## Data plane performance

The Kubernetes data plane is responsible for managing network traffic between containers and services. Issues with the data plane can lead to slow response times, degraded performance, and application downtime. It's important to carefully monitor and optimize data plane configurations, such as network latency, resource allocation, container density, and network policies, to ensure your containerized applications run smoothly and efficiently.

### Storage

#### OS disks

AKS recommends and defaults to using ephemeral OS disks. Ephemeral OS disks are created on local VM storage and aren't saved to remote Azure storage like managed OS disks. They have faster reimaging and boot times, enabling faster cluster operations, and they provide lower read/write latency on the OS disk of AKS agent nodes. Ephemeral OS disks work well for stateless workloads, where applications are tolerant of individual VM failures but not of VM deployment time or individual VM reimaging instances. Only certain VM SKUs support ephemeral OS disks, so you need to ensure that your desired SKU generation and size is compatible. For more information, see [Ephemeral OS disks in Azure Kubernetes Service (AKS)](LINK).

If your workload is unable to use ephemeral OS disks, AKS defaults to using Premium SSD OS disks. If Premium SSD OS disks aren't compatible with your workload, AKS defaults to Standard SSD disks. Currently, the only other available OS disk type is Standard HDD. For more information, see [Storage options in Azure Kubernetes Service (AKS)](LINK).

The following table provides a breakdown of suggested use cases for OS disks supported in AKS:

| OS disk type | Key features | Suggested use cases |
|--------------|--------------|---------------------|
| Ephemeral OS disks | • Faster reimaging and boot times.<br/> • Lower read/write latency on OS disk of AKS agent nodes.<br/> • High performance and availability. | • Demanding enterprise workloads, such as SQL Server, Oracle, Dynamics, Exchange Server, MySQL, Cassandra, MongoDB, SAP Business Suite, etc.<br/> • Stateless production workloads that require high availability and low latency. |
| Premium SSD OS disks | • Consistent performance and low latency.<br/> • High availability. | • Demanding enterprise workloads, such as SQL Server, Oracle, Dynamics, Exchange Server, MySQL, Cassandra, MongoDB, SAP Business Suite, etc.<br/> • Input/output (IO) intensive enterprise workloads. |
| Standard SSD OS disks | • Consistent performance.<br/> • Better availability and latency compared to Standard HDD disks. | • Web servers.<br/> • Low input/output operations per second (IOPS) application servers.<br/> • Lightly used enterprise applications.<br/> • Dev/test workloads. |
| Standard HDD disks | • Low cost.<br/> • Exhibits variability in performance and latency. | • Backup storage.<br/> • Mass storage with infrequent access. |

##### IOPS and throughput

Input/output operations per second (IOPS) refers to the number of read and write operations that a disk can perform in a second. Throughout refers to the amount of data that can be transferred in a given time period.

In Kubernetes, the IOPS and throughput of a disk can have a significant impact on the performance of the system. When a Kubernetes cluster runs multiple applications, the disk IOPS and throughput might cause a bottleneck, especially for applications requiring high disk performance. It's important to choose a disk that can handle the workload and provide sufficient IOPS and throughput.

Ephemeral OS disks can provide dynamic IOPS and throughput for your application, whereas managed disks have capped IOPS and throughput. For more information, see [LINK](LINK).

### Networking

> **Best practice guidance**:
>
> Use Dynamic IP Allocation or CNI Overlay networking for optimal networking performance.

We recommend using [Dynamic IP Allocation](LINK) or [CNI Overlay](LINK) networking. For more information, see [LINK](LINK).

### Pods


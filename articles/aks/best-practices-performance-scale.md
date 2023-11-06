---
title: Performance and scaling best practices for small to medium workloads in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn the best practices for performance and scaling for small to medium workloads in Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 11/03/2023
---

# Best practices for performance and scaling for small to medium workloads in Azure Kubernetes Service (AKS)

> [!NOTE]
> This article focuses on general best practices for **small to medium workloads**. For best practices specific to **large workloads**, see [Performance and scaling best practices for large workloads in Azure Kubernetes Service (AKS)](./best-practices-performance-scale-large.md).

As you deploy and maintain clusters in AKS, you can use the following best practices to help you optimize performance and scaling.

In this article, you learn about:

> [!div class="checklist"]
>
> * Tradeoffs and recommendations for autoscaling your workloads.
> * Managing node scaling and efficiency based on your workload demands.
> * Networking considerations for ingress and egress traffic.
> * Monitoring and troubleshooting control plane and node performance.
> * Capacity planning, surge scenarios, and cluster upgrades.
> * Storage and networking considerations for data plane performance.

## Application autoscaling vs. infrastructure autoscaling

### Application autoscaling

Application autoscaling is useful when dealing with cost optimization or infrastructure limitations. A well-configured autoscaler maintains high availability for your application while also minimizing costs. You only pay for the resources required to maintain availability, regardless of the demand.

For example, if an existing node has space but not enough IPs in the subnet, it might be able to skip the creation of a new node and instead immediately start running the application on a new pod.

#### Horizontal Pod autoscaling

Implementing [horizontal pod autoscaling](./concepts-scale.md#horizontal-pod-autoscaler) is useful for applications with a steady and predictable resource demand. The Horizontal Pod Autoscaler (HPA) dynamically scales the number of pod replicas, which effectively distributes the load across multiple pods and nodes. This scaling mechanism is typically most beneficial for applications that can be decomposed into smaller, independent components capable of running in parallel.

The HPA provides resource utilization metrics by default. You can also integrate custom metrics or leverage tools like the [Kubernetes Event-Driven Autoscaler (KEDA) (Preview)](./keda-about.md). These extensions allow the HPA to make scaling decisions based on multiple perspectives and criteria, providing a more holistic view of your application's performance. This is especially helpful for applications with varying complex scaling requirements.

> [!NOTE]
> If maintaining high availability for your application is a top priority, we recommend leaving a slightly higher buffer for the minimum pod number for your HPA to account for scaling time.

#### Vertical Pod autoscaling

Implementing [vertical pod autoscaling](./vertical-pod-autoscaler.md) is useful for applications with fluctuating and unpredictable resource demands. The Vertical Pod Autoscaler (VPA) allows you to fine-tune resource requests, including CPU and memory, for individual pods, enabling precise control over resource allocation. This granularity minimizes resource waste and enhances the overall efficiency of cluster utilization. The VPA also streamlines application management by automating resource allocation, freeing up resources for critical tasks.

> [!WARNING]
> You shouldn't use the VPA in conjunction with the HPA on the same CPU or memory metrics. This combination can lead to conflicts, as both autoscalers attempt to respond to changes in demand using the same metrics. However, you can use the VPA for CPU or memory in conjunction with the HPA for custom metrics to prevent overlap and ensure that each autoscaler focuses on distinct aspects of workload scaling.

> [!NOTE]
> The VPA works based on historical data. We recommend waiting at least *24 hours* after deploying the VPA before applying any changes to give it time to collect recommendation data.

### Infrastructure autoscaling

#### Cluster autoscaling

Implementing cluster autoscaling is useful if your existing nodes lack sufficient capacity, as it helps with scaling up and provisioning new nodes.

When considering cluster autoscaling, the decision of when to remove a node involves a tradeoff between optimizing resource utilization and ensuring resource availability. Eliminating underutilized nodes enhances cluster utilization but might result in new workloads having to wait for resources to be provisioned before they can be deployed. It's important to find a balance between these two factors that aligns with your cluster and workload requirements and [configure the cluster autoscaler profile settings accordingly](./cluster-autoscaler.md#change-the-cluster-autoscaler-settings).

The Cluster Autoscaler profile settings apply universally to all autoscaler-enabled node pools in your cluster. This means that any scaling actions occurring in one autoscaler-enabled node pool might impact the autoscaling behavior in another node pool. It's important to apply consistent and synchronized profile settings across all relevant node pools to ensure that the autoscaler behaves as expected.

##### Overprovisioning

Overprovisioning is a strategy that helps mitigate the risk of application pressure by ensuring there's an excess of readily available resources. This approach is especially useful for applications that experience highly variable loads and cluster scaling patterns that show frequent scale ups and scale downs.

To determine the optimal amount of overprovisioning, you can use the following formula:

```txt
1-buffer/1+traffic
```

For example, let's say you want to avoid hitting 100% CPU utilization in your cluster. You might opt for a 30% buffer to maintain a safety margin. If you anticipate an average traffic growth rate of 40%, you might consider overprovisioning by 50%, as calculated by the formula:

```txt
1-30%/1+40%=50%
```

An effective overprovisioning method involves the use of *pause pods*. Pause pods are low-priority deployments that can be easily replaced by high-priority deployments. You create low priority pods that serve the sole purpose of reserving buffer space. When a high-priority pod requires space, the pause pods are removed and rescheduled on another node or a new node to accommodate the high priority pod.

The following YAML shows an example pause pod manifest:

```yml
apiVersion: scheduling.k8s.io/v1 
kind: PriorityClass 
metadata: 
  name: overprovisioning 
value: -1 
globalDefault: false 
description: "Priority class used by overprovisioning." 
--- 
apiVersion: apps/v1 
kind: Deployment 
metadata: 
  name: overprovisioning 
  namespace: kube-system 
spec: 
  replicas: 1 
  selector: 
    matchLabels: 
      run: overprovisioning 
  template: 
    metadata: 
      labels: 
        run: overprovisioning 
    spec: 
      priorityClassName: overprovisioning 
      containers: 
      - name: reserve-resources 
        image: your-custome-pause-image 
        resources: 
          requests: 
            cpu: 1 
            memory: 4Gi 
```

## Node scaling and efficiency

> **Best practice guidance**:
>
> Carefully monitor resource utilization and scheduling policies to ensure nodes are being used efficiently.

Node scaling allows you to dynamically adjust the number of nodes in your cluster based on workload demands. It's important to understand that adding more nodes to a cluster isn't always the best solution for improving performance. To ensure optimal performance, you should carefully monitor resource utilization and scheduling policies to ensure nodes are being used efficiently.

### Node images

> **Best practice guidance**:
>
> Use the latest node image version to ensure that you have the latest security patches and bug fixes.

Using the latest node image version provides the best performance experience. AKS ships performance improvements within the weekly image releases. The latest daemonset images are cached on the latest VHD image, which provide lower latency benefits for node provisioning and bootstrapping. Falling behind on updates might have a negative impact on performance, so it's important to avoid large gaps between versions.

#### Azure Linux

The [Azure Linux Container Host on AKS](../azure-linux/intro-azure-linux.md) uses a native AKS image and provides a single place for Linux development. Every package is built from source and validated, ensuring your services run on proven components.

Azure Linux is lightweight, only including the necessary set of packages to run container workloads. It provides a reduced attack surface and eliminates patching and maintenance of unnecessary packages. At its base layer, it has a Microsoft-hardened kernel tuned for Azure. This image is ideal for performance-sensitive workloads and platform engineers or operators that manage fleets of AKS clusters.

#### Ubuntu 2204

The [Ubuntu 2204 image](https://github.com/Azure/AKS/blob/master/CHANGELOG.md) is the default node image for AKS. It's a lightweight and efficient operating system optimized for running containerized workloads. This means that it can help reduce resource usage and improve overall performance. The image includes the latest security patches and updates, which help ensure that your workloads are protected from vulnerabilities.

The Ubuntu 2204 image is fully supported by Microsoft, Canonical, and the Ubuntu community and can help you achieve better performance and security for your containerized workloads.

### Virtual machines (VMs)

> **Best practice guidance**:
>
> When selecting a VM, ensure the size and performance of the OS disk and VM SKU don't have a large discrepancy. A discrepancy in size or performance can cause performance issues and resource contention.

Application performance is closely tied to the VM SKUs you use in your workloads. Larger and more powerful VMs, generally provide better performance. For *mission critical or product workloads*, we recommend using VMs with at least an 8-core CPU. VMs with newer hardware generations, like v4 and v5, can also help improve performance. Keep in mind that create and scale latency might vary depending on the VM SKUs you use.

### Use dedicated system node pools

For scaling performance and reliability, we recommend using a dedicated system node pool. With this configuration, the dedicated system node pool reserves space for critical system resources such as system OS daemons. Your application workload can then run in a user node pool to increase the availability of allocatable resources for your application. This configuration also helps mitigate the risk of resource competition between the system and application.

### Create operations

Review the extensions and add-ons you have enabled during create provisioning. Extensions and add-ons can add latency to overall duration of create operations. If you don't need an extension or add-on, we recommend removing it to improve create latency.

You can also use availability zones to provide a higher level of availability to protect against potential hardware failures or planned maintenance events. AKS clusters distribute resources across logical sections of underlying Azure infrastructure. Availability zones physically separate nodes from other nodes to help ensure that a single failure doesn't impact the availability of your application. Availability zones are only available in certain regions. For more information, see [Availability zones in Azure](../reliability/availability-zones-overview.md).

## Kubernetes API server

### LIST and WATCH operations

Kubernetes uses the LIST and WATCH operations to interact with the Kubernetes API server and monitor information about cluster resources. These operations are fundamental to how Kubernetes performs resource management.

**The LIST operation retrieves a list of resources that fit within certain criteria**, such as all pods in a specific namespace or all services in the cluster. This operation is useful when you want to get an overview of your cluster resources or you need to operator on multiple resources at once.

The LIST operation can retrieve large amounts of data, especially in large clusters with multiple resources. Be mindful of the fact that making unbounded or frequent LIST calls puts a significant load on the API server and can close down response times.

**The WATCH operation performs real-time resource monitoring**. When you set up a WATCH on a resource, the API server sends you updates whenever there are changes to that resource. This is important for controllers, like the ReplicaSet controller, which rely on WATCH to maintain the desired state of resources.

Be mindful of the fact that watching too many mutable resources or making too many concurrent WATCH requests can overwhelm the API server and cause excessive resource consumption.

To avoid potential issues and ensure the stability of the Kubernetes control plane, you can use the following strategies:

**Resource quotas**

Implement resource quotas to limit the number of resources that can be listed or watched by a particular user or namespace to prevent excessive calls.

**API Priority and Fairness**

Kubernetes introduced the concept of API Priority and Fairness (APF) to prioritize and manage API requests. You can use APF in Kubernetes to protect the cluster's API server and reduce the number of `HTTP 429 Too Many Requests` responses seen by client applications.

| Custom resource | Key features |
| -------------------- | ------------ |
| PriorityLevelConfigurations | • Define different priority levels for API requests.<br/> • Specifies a unique name and assigns an integer value representing the priority level. Higher priority levels have lower integer values, indicating they're more critical.<br/> • Can use multiple to categorize requests into different priority levels based on their importance.<br/> • Allow you to specify whether requests at a particular priority level should be subject to rate limits. |
| FlowSchemas | • Define how API requests should be routed to different priority levels based on request attributes.<br/> • Specify rules that match requests based on criteria like API groups, versions, and resources.<br/> • When a request matches a given rule, the request is directed to the priority level specified in the associated PriorityLevelConfiguration.<br/> • Can use to set the order of evaluation when multiple FlowSchemas match a request to ensure that certain rules take precedence. |

Configuring API with PriorityLevelConfigurations and FlowSchemas enables the prioritization of critical API requests over less important requests. This ensures that essential operations don't starve or experience delays because of lower priority requests.

**Optimize labeling and selectors**

When using LIST operations, optimize label selectors to narrow down the scope of the resources you want to query to reduce the amount of data returned and the load on the API server.

In Kubernetes CREATE and UPDATE operations refer to actions that manage and modify cluster resources.

### CREATE and UPDATE operations

**The CREATE operation creates new resources in the Kubernetes cluster**, such as pods, services, deployments, configmaps, and secrets. During a CREATE operation, a client, such as `kubectl` or a controller, sends a request to the Kubernetes API server to create the new resource. The API server validates the request, ensures compliance with any admission controller policies, and then creates the resource in the cluster's desired state.

**The UPDATE operation modifies existing resources in the Kubernetes cluster**, including changes to resources specifications, like number of replicas, container images, environment variables, or labels. During an UPDATE operation, a client sends a request to the API server to update an existing resource. The API server validates the request, applies the changes to the resource definition, and updates the cluster resource.

CREATE and UPDATE operations can impact the performance of the Kubernetes API server under the following conditions:

* **High concurrency**: When multiple users or applications make concurrent CREATE or UPDATE requests, it can lead to a surge in API requests arriving at the server at the same time. This can stress the API server's processing capacity and cause performance issues.
* **Complex resource definitions**: Resource definitions that are overly complex or involve multiple nested objects can increase the time it takes for the API server to validate and process CREATE and UPDATE requests, which can lead to performance degradation.
* **Resource validation and admission control**: Kubernetes enforces various admission control policies and validation checks on incoming CREATE and UPDATE requests. Large resource definitions, like ones with extensive annotations or configurations, might require more processing time.
* **Custom controllers**: Custom controllers that watch for changes in resources, like Deployments or StatefulSet controllers, can generate a significant number of updates when scaling or rolling out changes. These updates can strain the API server's resources.

For more information, see [Troubleshoot API server and etcd problems in AKS](/troubleshoot/azure/azure-kubernetes/troubleshoot-apiserver-etcd).

## Data plane performance

The Kubernetes data plane is responsible for managing network traffic between containers and services. Issues with the data plane can lead to slow response times, degraded performance, and application downtime. It's important to carefully monitor and optimize data plane configurations, such as network latency, resource allocation, container density, and network policies, to ensure your containerized applications run smoothly and efficiently.

### Storage types

AKS recommends and defaults to using ephemeral OS disks. Ephemeral OS disks are created on local VM storage and aren't saved to remote Azure storage like managed OS disks. They have faster reimaging and boot times, enabling faster cluster operations, and they provide lower read/write latency on the OS disk of AKS agent nodes. Ephemeral OS disks work well for stateless workloads, where applications are tolerant of individual VM failures but not of VM deployment time or individual VM reimaging instances. Only certain VM SKUs support ephemeral OS disks, so you need to ensure that your desired SKU generation and size is compatible. For more information, see [Ephemeral OS disks in Azure Kubernetes Service (AKS)](./cluster-configuration.md#use-ephemeral-os-on-new-clusters).

If your workload is unable to use ephemeral OS disks, AKS defaults to using Premium SSD OS disks. If Premium SSD OS disks aren't compatible with your workload, AKS defaults to Standard SSD disks. Currently, the only other available OS disk type is Standard HDD. For more information, see [Storage options in Azure Kubernetes Service (AKS)](./concepts-storage.md).

The following table provides a breakdown of suggested use cases for OS disks supported in AKS:

| OS disk type | Key features | Suggested use cases |
|--------------|--------------|---------------------|
| Ephemeral OS disks | • Faster reimaging and boot times.<br/> • Lower read/write latency on OS disk of AKS agent nodes.<br/> • High performance and availability. | • Demanding enterprise workloads, such as SQL Server, Oracle, Dynamics, Exchange Server, MySQL, Cassandra, MongoDB, SAP Business Suite, etc.<br/> • Stateless production workloads that require high availability and low latency. |
| Premium SSD OS disks | • Consistent performance and low latency.<br/> • High availability. | • Demanding enterprise workloads, such as SQL Server, Oracle, Dynamics, Exchange Server, MySQL, Cassandra, MongoDB, SAP Business Suite, etc.<br/> • Input/output (IO) intensive enterprise workloads. |
| Standard SSD OS disks | • Consistent performance.<br/> • Better availability and latency compared to Standard HDD disks. | • Web servers.<br/> • Low input/output operations per second (IOPS) application servers.<br/> • Lightly used enterprise applications.<br/> • Dev/test workloads. |
| Standard HDD disks | • Low cost.<br/> • Exhibits variability in performance and latency. | • Backup storage.<br/> • Mass storage with infrequent access. |

#### IOPS and throughput

Input/output operations per second (IOPS) refers to the number of read and write operations that a disk can perform in a second. Throughout refers to the amount of data that can be transferred in a given time period.

OS disks are responsible for storing the operating system and its associated files, and the VMs are responsible for running the applications. When selecting a VM, ensure the size and performance of the OS disk and VM SKU don't have a large discrepancy. A discrepancy in size or performance can cause performance issues and resource contention. For example, if the OS disk is significantly smaller than the VMs, it can limit the amount of space available for application data and cause the system to run out of disk space. If the OS disk has lower performance than the VMs, it can become a bottleneck and limit the overall performance of the system. Make sure the size and performance are balanced to ensure optimal performance in Kubernetes.

You can use the following steps to monitor IOPS and bandwidth meters on OS disks in the Azure portal:

1. Navigate to the [Azure portal](https://portal.azure.com/).
2. Search for **Virtual machine scale sets** and select your virtual machine scale set.
3. Under **Monitoring**, select **Metrics**.

Ephemeral OS disks can provide dynamic IOPS and throughput for your application, whereas managed disks have capped IOPS and throughput. For more information, see [Ephemeral OS disks for Azure VMs](../virtual-machines/ephemeral-os-disks.md).

[Azure Premium SSD v2](../virtual-machines/disks-types.md#premium-ssd-v2) is designed for IO-intense enterprise workloads that require sub-millisecond disk latencies and high IOPS and throughput at a low cost. It's suited for a broad range of workloads, such as SQL server, Oracle, MariaDB, SAP, Cassandra, MongoDB, big data/analytics, gaming, and more. This disk type is the highest performing option currently available for persistent volumes.

### Pod scheduling

The memory and CPU resources allocated to a VM have a direct impact on the performance of the pods running on the VM. When a pod is created, it's assigned a certain amount of memory and CPU resources, which are used to run the application. If the VM doesn't have enough memory or CPU resources available, it can cause the pods to slow down or even crash. If the VM has too much memory or CPU resources available, it can cause the pods to run inefficiently, wasting resources and increasing costs. We recommend monitoring the total pod requests across your workloads against the total allocatable resources for best scheduling predictability and performance. You can also set the maximum pods per node based on your capacity planning using `--max-pods`.

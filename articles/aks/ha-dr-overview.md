---
title: High availability and disaster recovery overview for Azure Kubernetes Service (AKS)
description: Learn about the high availability and disaster recovery options for Azure Kubernetes Service (AKS) clusters.
author: schaffererin
ms.author: schaffererin
ms.topic: concept-article
ms.service: azure-kubernetes-service
ms.date: 11/27/2023
---

# High availability and disaster recovery overview for Azure Kubernetes Service (AKS)

When creating and managing applications in the cloud, there's always a risk of disruption from outages and disasters. To ensure business continuity (BC), you need to plan for high availability (HA) and disaster recovery (DR).

HA refers to the design and implementation of a system or service that's highly reliable and experiences minimal downtime. HA is a combination of tools, technologies, and processes that ensure a system or service is available to perform its intended function. HA is a critical component of DR planning. DR is the process of recovering from a disaster and restoring business operations to a normal state. DR is a subset of BC, which is the process of maintaining business functions or quickly resuming them in the event of a major disruption.

This article covers some recommended practices for applications deployed to AKS, but is by no means meant as an exhaustive list of possible solutions.

## Technology overview

A Kubernetes cluster is divided into two components:

- The **control plane**, which provides the core Kubernetes services and orchestration of application workloads, and
- The **nodes**, which run your application workloads.

![Kubernetes control plane and node components](media/concepts-clusters-workloads/control-plane-and-nodes.png)

When you create an AKS cluster, the Azure platform automatically creates and configures a control plane. AKS offers two pricing tiers for cluster management: the **Free tier** and the **Standard tier**. For more information, see [Free and Standard pricing tiers for AKS cluster management](./free-standard-pricing-tiers.md).

The control plane and its resources reside only in the region where you created the cluster. AKS provides a single-tenant control plane with a dedicated API server, scheduler, etc. You define the number and size of the nodes, and the Azure platform configures the secure communication between the control plane and nodes. Interaction with the control plane occurs through Kubernetes APIs, such as `kubectl` or the Kubernetes dashboard.

To run your applications and supporting services, you need a Kubernetes *node*. An AKS cluster has at least one node, an Azure virtual machine (VM) that runs the Kubernetes node components and container runtime. The Azure VM size for your nodes defines CPUs, memory, size, and the storage type available (such as high-performance SSD or regular HDD). Plan the VM and storage size around whether your applications may require large amounts of CPU and memory or high-performance storage. In AKS, the VM image for your cluster's nodes is based on Ubuntu Linux, [Azure Linux](./use-azure-linux.md), or Windows Server 2022. When you create an AKS cluster or scale out the number of nodes, the Azure platform automatically creates and configures the requested number of VMs.

For more information on cluster and workload components in AKS, see [Kubernetes core concepts for AKS](./concepts-clusters-workloads.md).

## Reference architecture

IMAGE

## Scope definition

Application uptime becomes important as you manage AKS clusters. By default, AKS provides high availability by using multiple nodes in a [Virtual Machine Scale Set](../virtual-machine-scale-sets/overview.md), but these nodes don’t protect your system from a region failure. To maximize your uptime, plan ahead to maintain business continuity and prepare for disaster recovery using the following best practices:

- Plan for AKS clusters in multiple regions.
- Route traffic across multiple clusters using Azure Traffic Manager.
- Use geo-replication for your container image registries.
- Plan for application state across multiple clusters.
- Replicate storage across multiple regions.

### Deployment model implementations

|Deployment model|Pros|Cons|
|----------------|----|----|
|[Active-active](#active-active-high-availability-deployment-model)|• No data loss or inconsistency during failover <br> • High resiliency <br> • Better utilization of resources with higher performance|• Complex implementation and management <br> • Higher cost <br> • Requires a load balancer and form of traffic routing|
|[Active-passive](#active-passive-disaster-recovery-deployment-model)|• Simpler implementation and management <br> • Lower cost <br> • Doesn't require a load balancer or traffic manager|• Potential for data loss or inconsistency during failover <br> • Longer recovery time and downtime <br> • Underutilization of resources|
|[Passive-cold](#passive-cold-failover-deployment-model)|• Lowest cost <br> • Doesn't require synchronization, replication, load balancer, or traffic manager <br> • Suitable for low-priority, non-critical workloads|• High risk of data loss or inconsistency during failover <br> • Longest recovery time and downtime <br> • Requires manual intervention to activate cluster and trigger backup|

#### Active-active high availability deployment model

In the active-active high availability (HA) deployment model, you have two independent AKS clusters deployed in two different Azure regions (typically paired regions, such as Canada Central and Canada East or US East 2 and US Central) that actively serve traffic.

With this example architecture:

- You deploy two AKS clusters in separate Azure regions.
- During normal operations, network traffic routes between both regions. If one region becomes unavailable, traffic automatically routes to a region closest to the user who issued the request.
- There's a deployed hub-spoke pair for each regional AKS instance. Azure Firewall Manager policies manage the firewall rules across the regions.
- Azure Key Vault is provisioned in each region to store secrets and keys.
- Azure Front Door load balances and routes traffic to a regional Azure Application Gateway instance, which sits in front of each AKS cluster.
- Regional Log Analytics instances store regional networking metrics and diagnostic logs.
- The container images for the workload are stored in a managed container registry. A single Azure Container Registry is used for all Kubernetes instances in the cluster. Geo-replication for Azure Container Registry enables replicating images to the selected Azure regions and provides continued access to images, even if a region experiences an outage.

To create an active-active deployment model in AKS, you perform the following steps:

1. Create two identical deployments in two different Azure regions.
2. Create two instances of your web app.
3. Create an Azure Front Door profile with the following resources:

   - An endpoint.
   - Two origin groups, each with a priority of *one*.
   - A route.

4. Limit network traffic to the web apps only from the Azure Front Door instance. 5. Configure all other backend Azure services, such as databases, storage accounts, and authentication providers.
5. Deploy code to both web apps with continuous deployment.

For more information, see the [**Recommended active-active high availability solution overview for AKS**](./active-active-solution.md).

#### Active-passive disaster recovery deployment model

In the active-passive disaster recovery (DR) deployment model, you have two independent AKS clusters deployed in two different Azure regions (typically paired regions, such as Canada Central and Canada East or US East 2 and US Central) that actively serve traffic. Only one of the clusters actively serves traffic at any given time. The other cluster contains the same configuration and application data as the active cluster, but doesn't accept traffic unless directed by a traffic manager.

With this example architecture:

- You deploy two AKS clusters in separate Azure regions.
- During normal operations, network traffic routes to the primary AKS cluster, which you set in the Azure Front Door configuration.
  - Priority needs to be set between *1-5* with 1 being the highest and 5 being the lowest.
  - You can set multiple clusters to the same priority level and can specify the weight of each.
- If the primary cluster becomes unavailable (disaster occurs), traffic automatically routes to the next region selected in the Azure Front Door.
  - All traffic must go through the Azure Front Door traffic manager for this system to work.
- Azure Front Door routes traffic to the Azure App Gateway in the primary region (cluster must be marked with priority 1). If this region fails, the service redirects traffic to the next cluster in the priority list.
  - Rules come from Azure Front Door.
- A hub-spoke pair is deployed for each regional AKS instance. Azure Firewall Manager policies manage the firewall rules across the regions.
- Azure Key Vault is provisioned in each region to store secrets and keys.
- Regional Log Analytics instances store regional networking metrics and diagnostic logs.
- The container images for the workload are stored in a managed container registry. A single Azure Container Registry is used for all Kubernetes instances in the cluster. Geo-replication for Azure Container Registry enables replicating images to the selected Azure regions and provides continued access to images, even if a region experiences an outage.

To create an active-passive deployment model in AKS, you perform the following steps:

1. Create two identical deployments in two different Azure regions.
2. Configure autoscaling rules for the secondary application so it scales to the same instance count as the primary when the primary region becomes inactive. While inactive, it doesn't need to be scaled up. This helps reduce costs.
3. Create two instances of your web application, with one on each cluster.
4. Create an Azure Front Door profile with the following resources:

   - An endpoint.
   - An origin group with a priority of *one* for the primary region.
   - A second origin group with a priority of *two* for the secondary region.
   - A route.

5. Limit network traffic to the web applications from only the Azure Front Door instance.
6. Configure all other backend Azure services, such as databases, storage accounts, and authentication providers.
7. Deploy code to both the web applications with continuous deployment.

For more information, see the [**Recommended active-passive disaster recovery solution overview for AKS**](./active-passive-solution.md).

#### Passive-cold failover deployment model

The passive-cold failover deployment model is configured in the same way as the [active-passive disaster recovery deployment model](#active-passive-disaster-recovery-deployment-model), except the clusters remain inactive until a user activates them in the event of a disaster. We consider this approach *out-of-scope* because it involves a similar configuration to active-passive, but with the added complexity of manual intervention to activate the cluster and trigger a backup.

With this example architecture:

- You create two AKS clusters, preferably in different regions or zones for better resiliency.
- When you need to fail over, you activate the deployment to take over the traffic flow.
- In the case the primary passive cluster goes down, you need to manually activate the cold cluster to take over the traffic flow.
- This condition needs to be set either by a manual input every time or a certain event as specified by you.
- Azure Key Vault is provisioned in each region to store secrets and keys.
- Regional Log Analytics instances store regional networking metrics and diagnostic logs for each cluster.

To create a passive-cold failover deployment model in AKS, you perform the following steps:

1. Create two identical deployments in different zones/regions.
2. Configure autoscaling rules for the secondary application so it scales to the same instance count as the primary when the primary region becomes inactive. While inactive, it doesn't need to be scaled up, which helps reduce costs.
3. Create two instances of your web application, with one on each cluster.
4. Configure all other backend Azure services, such as databases, storage accounts, and authentication providers.
5. Set a condition when the cold cluster should be triggered. You can use a load balancer if you need.

For more information, see the [**Recommended passive-cold failover solution overview for AKS**](./passive-cold-solution.md).

## Service quotas and limits

AKS sets default limits and quotas for resources and features, including usage restrictions for certain VM SKUs.

[!INCLUDE [container-service-limits](../../includes/container-service-limits.md)]

For more information, see [AKS service quotas and limits](./quotas-skus-regions.md#service-quotas-and-limits).

## Backup

Azure Backup supports backing up AKS cluster resources and persistent volumes attached to the cluster using a backup extension. The Backup vault communicates with the AKS cluster through the extension to perform backup and restore operations.

For more information, see the following articles:

- [About AKS backup using Azure Backup (preview)](../backup/azure-kubernetes-service-backup-overview.md)
- [Back up AKS using Azure Backup (preview)](../backup/azure-kubernetes-service-cluster-backup.md)

## References and documentation

TBD

---
title: Best practices for business continuity and disaster recovery in Azure Kubernetes Service (AKS)
description: Best practices for a cluster operator to achieve maximum uptime for your applications and to provide high availability and prepare for disaster recovery in Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 03/08/2023
ms.custom: fasttrack-edit
#Customer intent: As an AKS cluster operator, I want to plan for business continuity or disaster recovery to help protect my cluster from region problems.
---

# Best practices for business continuity and disaster recovery in Azure Kubernetes Service (AKS)

As you manage clusters in Azure Kubernetes Service (AKS), application uptime becomes important. By default, AKS provides high availability by using multiple nodes in a [Virtual Machine Scale Set (VMSS)](../virtual-machine-scale-sets/overview.md). But these multiple nodes don’t protect your system from a region failure. To maximize your uptime, plan ahead to maintain business continuity and prepare for disaster recovery.

This article focuses on how to plan for business continuity and disaster recovery in AKS. You learn how to:

> [!div class="checklist"]

> * Plan for AKS clusters in multiple regions.
> * Route traffic across multiple clusters using Azure Traffic Manager.
> * Use geo-replication for your container image registries.
> * Plan for application state across multiple clusters.
> * Replicate storage across multiple regions.

## Plan for multiregion deployment

> **Best practice**
>
> When you deploy multiple AKS clusters, choose regions where AKS is available. Use paired regions.

An AKS cluster is deployed into a single region. To protect your system from region failure, deploy your application into multiple AKS clusters across different regions. When planning where to deploy your AKS cluster, consider:

* [**AKS region availability**](./quotas-skus-regions.md#region-availability)
    * Choose regions close to your users.
    * AKS continually expands into new regions.

* [**Azure paired regions**](../availability-zones/cross-region-replication-azure.md)
    * For your geographic area, choose two regions paired together.
    * AKS platform updates (planned maintenance) are serialized with a delay of at least 24 hours between paired regions.
    * Recovery efforts for paired regions are prioritized where needed.

* **Service availability**
    * Decide whether your paired regions should be hot/hot, hot/warm, or hot/cold.
    * Do you want to run both regions at the same time, with one region *ready* to start serving traffic? *or*
    * Do you want to give one region time to get ready to serve traffic?

AKS region availability and paired regions are a joint consideration. Deploy your AKS clusters into paired regions designed to manage region disaster recovery together. For example, AKS is available in East US and West US. These regions are paired. Choose these two regions when you're creating an AKS BC/DR strategy.

When you deploy your application, add another step to your CI/CD pipeline to deploy to these multiple AKS clusters. Updating your deployment pipelines prevents applications from deploying into only one of your regions and AKS clusters. In that scenario, customer traffic directed to a secondary region won't receive the latest code updates.

## Use Azure Traffic Manager to route traffic

> **Best practice**
>
> For the best performance and redundancy, direct all application traffic through Traffic Manager before it goes to your AKS cluster.

If you have multiple AKS clusters in different regions, use Traffic Manager to control traffic flow to the applications running in each cluster. [Azure Traffic Manager](../traffic-manager/index.yml) is a DNS-based traffic load balancer that can distribute network traffic across regions. Use Traffic Manager to route users based on cluster response time or based on priority.

![AKS with Traffic Manager](media/operator-best-practices-bc-dr/aks-azure-traffic-manager.png)

If you have a single AKS cluster, you typically connect to the service IP or DNS name of a given application. In a multi-cluster deployment, you should connect to a Traffic Manager DNS name that points to the services on each AKS cluster. Define these services by using Traffic Manager endpoints. Each endpoint is the *service load balancer IP*. Use this configuration to direct network traffic from the Traffic Manager endpoint in one region to the endpoint in a different region.

Traffic Manager performs DNS lookups and returns your most appropriate endpoint. With priority routing you can enable a primary service endpoint and multiple backup endpoints in case the primary or one of the backup endpoints is unavailable.

![Priority routing through Traffic Manager](media/operator-best-practices-bc-dr/traffic-manager-priority-routing.png)

For information on how to set up endpoints and routing, see [Configure priority traffic routing method in Traffic Manager](../traffic-manager/traffic-manager-configure-priority-routing-method.md).

### Application routing with Azure Front Door Service

Using split TCP-based anycast protocol, [Azure Front Door Service](../frontdoor/front-door-overview.md) promptly connects your end users to the nearest Front Door POP (Point of Presence). More features of Azure Front Door Service:

* TLS termination
* Custom domain
* Web application firewall
* URL Rewrite
* Session affinity

Review the needs of your application traffic to understand which solution is the most suitable.

### Interconnect regions with global virtual network peering

Connect both virtual networks to each other through [virtual network peering](../virtual-network/virtual-network-peering-overview.md) to enable communication between clusters. Virtual network peering interconnects virtual networks, providing high bandwidth across Microsoft's backbone network - even across different geographic regions.

Before peering virtual networks with running AKS clusters, use the standard Load Balancer in your AKS cluster. This prerequisite makes Kubernetes services reachable across the virtual network peering.

## Enable geo-replication for container images

> **Best practice**
>
> Store your container images in Azure Container Registry and geo-replicate the registry to each AKS region.

To deploy and run your applications in AKS, you need a way to store and pull the container images. Container Registry integrates with AKS, so it can securely store your container images or Helm charts. Container Registry supports multimaster geo-replication to automatically replicate your images to Azure regions around the world.

To improve performance and availability, use Container Registry geo-replication to create a registry in each region where you have an AKS cluster.Each AKS cluster will then pull container images from the local container registry in the same region.

![Container Registry geo-replication for container images](media/operator-best-practices-bc-dr/acr-geo-replication.png)

Using Container Registry geo-replication to pull images from the same region has the following benefits: 

* **Faster**: Pull images from high-speed, low-latency network connections within the same Azure region.
* **More reliable**: If a region is unavailable, your AKS cluster pulls the images from an available container registry.
* **Cheaper**: No network egress charge between datacenters.

Geo-replication is a *Premium* SKU container registry feature. For information on how to configure geo-replication, see [Container Registry geo-replication](../container-registry/container-registry-geo-replication.md).

## Remove service state from inside containers

> **Best practice**
>
> Avoid storing service state inside the container. Instead, use an Azure platform as a service (PaaS) that supports multi-region replication.

*Service state* refers to the in-memory or on-disk data required by a service to function. State includes the data structures and member variables that the service reads and writes. Depending on how the service is architected, the state might also include files or other resources stored on the disk. For example, the state might include the files a database uses to store data and transaction logs.

State can be either externalized or co-located with the code that manipulates the state. Typically, you externalize state by using a database or other data store that runs on different machines over the network or that runs out of process on the same machine.

Containers and microservices are most resilient when the processes that run inside them don't retain state. Since applications almost always contain some state, use a PaaS solution, such as:

* Azure Cosmos DB
* Azure Database for PostgreSQL
* Azure Database for MySQL
* Azure SQL Database

To build portable applications, see the following guidelines:

* [The 12-factor app methodology](https://12factor.net/)
* [Run a web application in multiple Azure regions](/azure/architecture/reference-architectures/app-service-web-app/multi-region)

## Create a storage migration plan

> **Best practice**
>
> If you use Azure Storage, prepare and test how to migrate your storage from the primary region to the backup region.

Your applications might use Azure Storage for their data. If so, your applications are spread across multiple AKS clusters in different regions. You need to keep the storage synchronized. Here are two common ways to replicate storage:

* Infrastructure-based asynchronous replication
* Application-based asynchronous replication

### Infrastructure-based asynchronous replication

Your applications might require persistent storage even after a pod is deleted. In Kubernetes, you can use persistent volumes to persist data storage. Persistent volumes are mounted to a node VM and then exposed to the pods. Persistent volumes follow pods even if the pods are moved to a different node inside the same cluster.

The replication strategy you use depends on your storage solution. The following common storage solutions provide their own guidance about disaster recovery and replication:

* [Gluster](https://docs.gluster.org/en/latest/Administrator-Guide/Geo-Replication/)
* [Ceph](https://docs.ceph.com/docs/master/cephfs/disaster-recovery/)
* [Rook](https://rook.io/docs/rook/v1.2/ceph-disaster-recovery.html)
* [Portworx](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes/storage-operations/kubernetes-storage-101/volumes.html) 

Typically, you provide a common storage point where applications write their data. This data is then replicated across regions and accessed locally.

![Infrastructure-based asynchronous replication](media/operator-best-practices-bc-dr/aks-infra-based-async-repl.png)

If you use Azure Managed Disks, you can use [Velero on Azure][velero] and [Kasten][kasten] to handle replication and disaster recovery. These options are back up solutions native to but unsupported by Kubernetes.

### Application-based asynchronous replication

Kubernetes currently provides no native implementation for application-based asynchronous replication. Since containers and Kubernetes are loosely coupled, any traditional application or language approach should work. Typically, the applications themselves replicate the storage requests, which are then written to each cluster's underlying data storage.

![Application-based asynchronous replication](media/operator-best-practices-bc-dr/aks-app-based-async-repl.png)

## Next steps

This article focuses on business continuity and disaster recovery considerations for AKS clusters. For more information about cluster operations in AKS, see these articles about best practices:

* [Multitenancy and cluster isolation][aks-best-practices-cluster-isolation]
* [Basic Kubernetes scheduler features][aks-best-practices-scheduler]

<!-- INTERNAL LINKS -->
[aks-best-practices-scheduler]: operator-best-practices-scheduler.md
[aks-best-practices-cluster-isolation]: operator-best-practices-cluster-isolation.md

[velero]: https://github.com/vmware-tanzu/velero-plugin-for-microsoft-azure/blob/master/README.md
[kasten]: https://www.kasten.io/

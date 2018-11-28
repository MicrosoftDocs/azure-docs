---
title: Best Practices - High Availability / Business Continutity / Disaster Recovery (AKS)
description: Learn how to maximize uptime of your AKS cluster
services: container-service
author: lastcoolnameleft

ms.service: container-service
ms.topic: conceptual
ms.date: 11/28/2018
ms.author: lastcoolnameleft
#Customer intent: As an AKS Cluster Operator, I want plan for Business Continuity/Disaster Recovery so that my cluster is resilient from region issues.
---
# Best practices for business continuity and disaster recovery in Azure Kubernetes Service (AKS)

As you manage clusters in Azure Kubernetes Service (AKS), application uptime becomes important. AKS provides high availability by using multiple nodes in an availability set. These multiple nodes don’t protect you from a region failure. To maximize your uptime, implement some business continuity and disaster recovery features.

This best practices article focuses on considerations that help you plan for business continuity and disaster recovery in AKS. You learn how to:

> [!div class="checklist"]
* [Region Planning](#region-planning)
* [Ingress Traffic](#ingress-traffic)
* [Container Registry](#container-registry)
* [Managing Application State](#managing-application-state)
* [Storage](#storage)

## Plan for multi-region deployment

**Best practice guidance** - When you deploy multiple AKS clusters, choose regions where AKS is available and use paired regions.

An AKS cluster is deployed into a single region. To protect yourself from region failure, deploy your application into multiple AKS clusters across different regions. When you plan what regions to deploy your AKS cluster, the following considerations apply:

* [AKS region availability](https://docs.microsoft.com/en-us/azure/aks/container-service-quotas#region-availability)
  * Choose regions close to your users. AKS is continually expanding into new regions.
* [Azure paired regions](https://docs.microsoft.com/en-us/azure/best-practices-availability-paired-regions)
  * For your geographic area, choose two regions that are paired with each other. These regions coordinate platform updates, and prioritize recovery efforts where needed.
* Service Availability Level (Hot/Hot, Hot/Warm, Hot/Cold)
  * Do you want to run both regions at the same time, with one region *ready* to start serving traffic, or one region that needs to time get ready to serve traffic.

AKS region availability and paired regions are joint consideration. Deploy your AKS clusters into paired regions that are designed to manage region disaster recovery together. For example, AKS is available in *East US* and *West US*. These regions are also paired. These two regions would be recommended when creating an AKS BC/DR strategy.

When you deploy your application, you must also add another step to your CI/CD pipeline to deploy to these multiple AKS clusters. If you don't perform this step, application deployments may only be deployed into one of your regions and AKS clusters. Customer traffic that is directed to a secondary region won't receive the latest code updates.

## Use Azure Traffic Manager to route traffic to desired regions

**Best practice guidance** - Azure Traffic Manager can direct customers to their closest AKS cluster and application instance. For the best performance and redundancy, direct all application traffic through Traffic Manager before going to your AKS cluster.

When you run multiple AKS clusters in different regions, you need to control how traffic is directed to the applications that run in each cluster. [Azure Traffic Manager](https://docs.microsoft.com/en-us/azure/traffic-manager/) is a DNS-based traffic load balancer that can distribute network traffic across regions. You can route users based on cluster response time, or based on geography.

![AKS with Azure Traffic Manager](media/operator-best-practices-bc-dr/aks-azure-traffic-manager.jpg)

With a single AKS cluster, customers typically connect to the *Service IP* or DNS name of a given application. In a multi-cluster deployment, customers should connect to a Traffic Manager DNS name that points to the services on each AKS cluster. These services are defined using Traffic Manager endpoints. Each endpoint is the *Service Load Balancer IP*. This configuration lets you direct network traffic from the Traffic Manager endpoint in one region to the endpoint in a different region.

![Geographic routing with Azure Traffic Manager](media/operator-best-practices-bc-dr/traffic-manager-geographic-routing.jpg)

Traffic Manager is used to perform the DNS lookups and return the most appropriate endpoint for a user. Nested profiles can be used, with priority given for a primary location. For example, a user should primarily connect to their closest geographic region. If that region has a problem, Traffic Manager can instead direct them to a secondary region. This approach makes sure customers can always connect to an application instance, even if their closest geographic region is unavailable.

For steps on how to set up these endpoints and routing, see [Configure the geographic traffic routing method using Traffic Manager]((https://docs.microsoft.com/en-us/azure/traffic-manager/traffic-manager-configure-geographic-routing-method).

### Layer 7 application routing with Azure Front Door

Azure Traffic Manager uses DNS (layer 3) to shape traffic. [Azure Front Door (preview)](https://docs.microsoft.com/en-us/azure/frontdoor/front-door-overview) provides an HTTP/HTTPS (layer 7) routing option. Additional features of Front Door include SSL termination, custom domain, Web Application Firewall, URL Rewrite, and Session Affinity.

Review the needs of your application traffic to understand which solution is the most suitable.

## Enable geo-replication in Azure Container Registry

**Best practice guidance** - Store your container images in Azure Container Registry with geo-replication enabled for each AKS region.

Azure Container Registry supports multi-master geo-replication. Use ACR geo-replication to store a registry in each region your AKS cluster resides.

The benefits of using ACR geo-replication include:

* Pulling images from within the same region is faster
* Pulling images from within the same region is more reliable
* Pulling images from within the same region is cheaper (no network egress charge between datacenters)

For more information on configuring this replication, see [Azure Container Registry geo-replication](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-geo-replication)

## Remove service state from inside containers

**Best practice guidance** - Where possible, do not store service state inside the container. Instead, use Azure PaaS services that support multi-region replication.

Service state refers to the in-memory or on-disk data that a service requires to function. State includes the data structures and member variables that the service reads and writes. Depending on how the service is architected, it may also include files or other resources that are stored on disk. For example, the files a database would use to store data and transaction logs.

State can be either externalized or colocated with the code that is manipulating the state. Externalization of state is typically done by using an external database or other data store that runs on different machines over the network or out of process on the same machine.

Containers and microservices are most resilient when the processes that run inside them do not retain state. Your applications almost always contain some state, and it is recommended to use a Platform as a Service solution (such as Azure Database for MySQL/Postgres or Azure SQL).  

For details on for how to build applications that are more portable, see the following guidelines:

* [The Twelve-Factor App Methodology](https://12factor.net/).
* [Run a web application in multiple Azure Regions](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/app-service-web-app/multi-region)

## Create a storage migration plan

**Best practice guidance** - If you use Azure Storage, prepare and test how you plan to migrate your storage from the primary to the backup region.

The two common ways of replicating storage are:

* Application-based asynchronous replication
* Infrastructure-based asynchronous replication

### Infrastructure-based asynchronous replication

![Infrastructure-based Asynchronous Replication](media/operator-best-practices-bc-dr/aks-infra-based-async-repl.jpg)

Sometimes your application requires persistent storage even after the pod is deleted. Kubernetes enables this ability by using Persistent Volumes. These volumes are mounted to host VM and then to the containers running on that VM. Persistent Volumes follow Pods, even if the Pod is moved to a different node inside the same cluster.

Depending on the storage solution you pick, BC/DR strategies change. For example, [Gluster](https://docs.gluster.org/en/latest/Administrator%20Guide/Geo%20Replication/), [CEPH](http://docs.ceph.com/docs/master/cephfs/disaster-recovery/), [Rook](https://rook.io/docs/rook/master/disaster-recovery.html), [Portworx](https://docs.portworx.com/scheduler/kubernetes/going-production-with-k8s.html#disaster-recovery-with-cloudsnaps) have their own guidance.

If you use Azure Managed Disks, the recommended approaches to migrate storage across regions are:

* [Ark on Azure](https://github.com/heptio/ark/blob/master/docs/azure-config.md)
* [Azure Site Recovery](https://azure.microsoft.com/en-us/blog/asr-managed-disks-between-azure-regions/)

### Application-based Asynchronous Replication

![Application-based Asynchronous Replication](media/operator-best-practices-bc-dr/aks-app-based-async-repl.jpg)

Currently, there are no Kubernetes native implementations for application-based asynchronous replication. Due to the loosely coupled nature of containers and Kubernetes, any traditional application/language approach should work.

## Next steps

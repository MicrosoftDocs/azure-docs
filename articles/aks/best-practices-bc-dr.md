---
title: Best Practices - High Availability / Business Continutity / Disaster Recovery (AKS)
description: Learn how to maximize uptime of your AKS cluster
services: container-service
author: lastcoolnameleft

ms.service: container-service
ms.topic: conceptual
ms.date: 11/5/2018
ms.author: lastcoolnameleft
---
# Best practices for Business Continuity and Disaster Recovery in Azure Kubernetes Service (AKS)

As you manage clusters in Azure Kubernetes Service (AKS) and your application uptime becomes more vital, you may want to consider removing Single Point of Failures and increasing the application's fault tolerance.  AKS supports High Availability through using multiple VM’s in an Availability Set; however, this doesn’t protect you from a region failure.  To maximize your uptime, these Business Continuity and Disaster Recovery recommendations should be understood and implemented.

This best practices article focuses on considerations that help you plan for Business Continuity / Disaster Recovery in AKS:

> [!div class="checklist"]
* [Region Planning](#region-planning)
* [Ingress Traffic](#ingress-traffic)
* [Container Registry](#container-registry)
* [Managing Application State](#managing-application-state)
* [Storage](#storage)

## Plan for Multi-region Deployment

**Best practice guidance** - When deploying multiple AKS clusters for BC/DR, use regions where both AKS is available that are also Azure Paired Regions.

A single AKS cluster is only available for one region, so to protect yourself from region failure, you should distribute your application across multiple AKS clusters in different regions.  When planning which regions to deploy your AKS cluster, you should consider:

* [AKS Region Availibility](https://docs.microsoft.com/en-us/azure/aks/container-service-quotas#region-availability)
* [Azure Paired Regions](https://docs.microsoft.com/en-us/azure/best-practices-availability-paired-regions)
* Service Availibility Level (Hot/Hot, Hot/Warm, Hot/Cold)

AKS Region Availibility and Azure Paired Regions should be considered jointly so that you deploy your AKS clusters into paired regions that are designed to manage region disaster recovery together.

## Use Azure Traffic Manager to Route Traffic to Desired Region

**Best practice guidance** - Ensure that all application traffic is directed through Azure Traffic Manager before going to your AKS cluster.

To support routing incoming traffic to the desired region, use [Azure Traffic Manager](https://docs.microsoft.com/en-us/azure/traffic-manager/).  Azure Traffic Manager is a DNS-based traffic load balancer that can distribute network traffic across regions.

Instead of directly publishing your Kubernetes Service IP, end users should be directed to the Azure Traffic Manager CNAME which will direct the users to the intended IP.  This can be setup by using Azure Traffic Manager Endpoints.  Each endpoint will be the Service Load Balancer IP allowing you to direct network traffic to from the Azure Endpoint in one region to the Azure Endpoint in a different region.

TODO: Insert basic DR diagram of two clusters, fronted by Azure Traffic Manager
TODO:  Show example

## Enable Geo-Replication in Azure Container Registry

**Best pratice guidance** - Store all of your container images in Azure Container Registry with geo-replication enabled for each AKS region.

Since Azure Container Registry supports multi-master geo-replication, it is recommend to use ACR geo-replication to store a registry in each region your AKS cluster resides.

Benefits of using ACR Geo-replication are:

* Pulling images from within the same region is faster
* Pulling images from within the same region is more reliable
* Pulling images from within the same region is cheaper (no network egress charge between datacenters)

TODO: Show or reference ACR Geo replication example

## Remove State From Inside Containers

**Best practice guidance** - Where possible, do not store application state inside the container.  Instead, use Azure PaaS services which support multi-region replication

Containers and Microservices are most resilient when the processes that run inside them do not retain state.  Your application will almost always contain some state, and it is recommended to use an Platform as a Service solution (e.g. Azure Database for MySQL/Postgres, Azure SQL, etc.).  

TODO: Elaborate on application state/12 factor apps.

## Create a Storage Migration Plan

**Best practice guidance** - If using Azure Storage, then prepare and test how you plan to migrate your storage from the primary to the backup region

Sometimes your application needs to store files local to the running processes and needs these files to be persisted beyond the lifecycle of the Pod.  Kubernetes enables this through Persistent Volumes which are mounted to host VM and then to the containers running on that VM.  Persistent Volumes will follow Pods, even if the Pod is moved to a different node inside the same cluster.

If using Managed Disks, the recommended approaches to migrate storage across regions are:

* [Ark on Azure](https://github.com/heptio/ark/blob/master/docs/azure-config.md)
* [Azure Site Recovery](https://azure.microsoft.com/en-us/blog/asr-managed-disks-between-azure-regions/)

TODO:  Elaborate on Azure Files and Blob Storage BC/DR
TODO:  Show example
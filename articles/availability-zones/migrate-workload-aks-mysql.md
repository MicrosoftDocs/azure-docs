---
title: Migrate Azure Kubernetes Service and MySQL Flexible Server workloads to availability zone support 
description: Learn how to migrate Azure Kubernetes Service and MySQL Flexible Server workloads to availability zone support.
author: anaharris-ms
ms.service: container-service
ms.topic: conceptual
ms.date: 08/29/2022
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions
---
 
# Migrate Azure Kubernetes Service (AKS) and MySQL Flexible Server workloads to availability zone support 

This guide describes how to migrate Azure Kubernetes Service and MySQL Flexible Server workloads to availability zone support.

To create availability zone support for this workload, you must re-create and re-deploy your AKS cluster or MySQL Flexible Server.


## Workload service dependencies

To provide full workload support for availability zones, each service dependency in the workload must support availability zones. 

There are two approaches types of availability zone supported services: [zonal or zone-redundant](az-region.md#highly-available-services). Most services support one or the other. However, in some cases, there are options for choosing either a zonal or zone-redundant resource for that service. We'll indicate which services zonal and zone-redundant resources n the recommendations below.  

The AKS and MySQL workload architecture consists of the following components:

### Azure Kubernetes Service (AKS)

- *Zonal* : The system node pool and user node pools are zonal when you pre-select the zones in which the node pools are deployed during creation time. In the case of a single datacenter outage, we recommended that you pre-select all three zones for better resiliency. Additional user node pools that support availability zones can be added to an existing AKS cluster and by supplying a value for the `zones` parameter. 

- *Zone-redundant*: Kubernetes control plane components such as *etcd*, *API server*, *Scheduler*, and *Controller Manager*  are automatically replicated or distributed across zones.  

    >[!NOTE]
    >To enable zone-redundancy of the AKS cluster control plane components, you must define your default system node pool with zones when you create an AKS cluster. Adding additional zonal node pools to an existing non-zonal AKS cluster won't make the AKS cluster zone-redundant, because that action doesn't distribute the control plane components across zones after-the-fact.  

### Azure Database for MySQL Flexible Server 

- *Zonal*: This availability mode means that a standby server is always available within the same zone as the primary server. While this option reduces failover time and network latency, it's less resilient due to a single zone outage impacting both the primary and standby servers. 
    
- *Zone-redundant*: This availability mode means that a standby server is always available within another zone in the same region as the primary server. This means that you have two zones enabled for zone redundancy for the primary and standby servers. We recommend this configuration for better resiliency. 


### Azure Standard Load Balancer or Azure Application Gateway 

#### Standard Load Balancer
To understand considerations related to Standard Load Balancer resources, see [Load Balancer and Availablity Zones](../load-balancer/load-balancer-standard-availability-zones.md). 

- *Zone-redundant*: Choosing zone-redundancy is the recommended way to configure your Frontend IP with your existing Load Balancer. The zone-redundant front-end corresponds with the AKS cluster back-end pool which is distributed across multiple zones. 

- *Zonal*: If you're pinning your node pools to specific zones-for example, zone 1 and 2- you can pre-select zone 1 and 2 for your Frontend IP in the existing Load Balancer. The reason for pinning your node pools to specific zones could be due to the availability of specialized VM SKU series, for example, M-series. 

#### Azure Application Gateway 
Using the Application Gateway Ingress Controller add-on with your AKS cluster is supported only on Application Gateway v2 SKUs (Standard and WAF). 

- *Zonal*: To leverage the benefits of availability zones, We recommend that the Application Gateway resource be created in multiple zones, such as zone 1, 2, and 3. Select all three zones for best intra-region resiliency strategy. 

to understand considerations related to Azure Application Gateway,

Please refer to <doc link> Azure Application Gateway PG link: Scaling and Zone-redundant Application Gateway v2 | Microsoft Docs CAE guidance link Application Gateway V2 AZ Migration Guidance.docx </doc link> AZ migration guidance to understand considerations related to this resource. There are instances whereby you are pinning your node pools to specific zones, in which you pre-select zone 1 and 2 during the creation of your App Gateway resource so as to correspond to your backend node pools. The reason for pinning your node pools to specific zones could be due to the availability of specialized VM SKU series, i.e., M-series. 

## Prerequisites

To migrate to availability zone support, your VM SKUs must be available across the zones in for your region. To check for VM SKU availability, use one of the following methods:

- Use PowerShell to [Check VM SKU availability](../virtual-machines/windows/create-PowerShell-availability-zone.md#check-vm-sku-availability).
- Use the Azure CLI to [Check VM SKU availability](../virtual-machines/linux/create-cli-availability-zone.md#check-vm-sku-availability).
- Go to [Foundational Services](az-region.md#an-icon-that-signifies-this-service-is-foundational-foundational-services).

## Downtime requirements

Because zonal VMs are created across the availability zones, all migration options mentioned in this article require downtime during deployment.

## Considerations


## Next Steps

Learn more about:

> [!div class="nextstepaction"]
> [Regions and Availability Zones in Azure](az-overview.md)

> [!div class="nextstepaction"]
> [Azure Services that support Availability Zones](az-region.md)

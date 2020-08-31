---
title: Common questions about managed Service Fabric clusters 
description: Frequently asked questions about managed Service Fabric, including capabilities, use cases, and common scenarios.
ms.topic: troubleshooting
ms.author: pepogors
ms.date: 08/21/2020
---

# Commonly asked managed Service Fabric questions

There are many commonly asked questions about what managed Service Fabric can do and how it should be used. This document covers many of those common questions and their answers.

## General 

### What is a managed Service Fabric cluster? 
Managed Service Fabric clusters are an evolution of the Service Fabric cluster resource model designed to make it easier to deploy and manage clusters. A managed Service Fabric cluster utilizes the Azure Resource Manager encapsulation model so that a user only needs to define and deploy a single cluster resource compared to the many independent resources that they must deploy today (VMSS, LB, IP, etc.).

### Can I do an in-place migration of my existing Service Fabric cluster to a managed Service Fabric cluster resource? 
No, at this time you would need to create a new Service Fabric cluster resource in order to utilize the new managed Service Fabric resource type.

### Is there an additional cost for managed Service Fabric clusters? 
No, there is no additional cost associated with a managed Service Fabric cluster beyond the cost of the underlying compute, storage, and networking resources that are required for the cluster. 

### Is there a new SLA introduced by the managed Service Fabric resource?
The SLA does not change from the current Service Fabric resource model.

### What is the difference between a Basic, and Standard SKU cluster? 
This is a sku for the SF cluster type. Basic means, most of the configurations are provided by the Service Fabric resource provider. Standard is where customers are allowed to config to their choice. Basic is for testing, quickly bringing up a cluster. See cluster SKUs for more details. 

## Cluster Deployment and Management

### I run custom script extensions on my Virtual Machine Scale Set, can I continue to do that with a managed Service Fabric resource?  
Yes you can still specify VM extensions on a node type. Please see the node type extension sample for more details.

### I want to have an internal only load balancer, is that possible?
It is not currently possible to have an internal only load balancer. It is recommended that you lock down the Network Security Group rules to block any undesired inbound/outbound traffic.

### Can I auto-scale my cluster? 
Auto-scaling is not yet available in the preview. 

### Can I deploy my cluster across availability zones? 
Cross availability zone clusters are not yet available in the preview. 

### Can I select between automatic and manual upgrades for my cluster runtime? 
In the preview, all runtime upgrades will be completed automatically.

## Applications 

### Is there a local development experience for managed Service Fabric clusters? 
The local development experience remains unchanged from existing Service Fabric clusters. Please see [Create a .Net Application](https://docs.microsoft.com/azure/service-fabric/service-fabric-quickstart-dotnet) for more details on the local development experience. 

### Can I deploy my applications as an Azure Resource Manager resource? 
In the preview, you will not be able to deploy applications as an Azure Resource Manager resource. Applications must be deployed by connecting directly to the cluster either through PowerShell or CLI. This functionality will be added before manged Service Fabric clusters enter general availability. 

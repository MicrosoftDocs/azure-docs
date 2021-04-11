---
title: Frequently asked questions for to Azure Cloud Services (extended support)
description: Frequently asked questions for to Azure Cloud Services (extended support)
ms.topic: conceptual
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Frequently asked questions for Azure Cloud Services (extended support)
This article covers frequently asked questions related to Azure Cloud Services (extended support).

## General

### What is the resource name for Cloud Services (classic) & Cloud Services (extended support)?
- Cloud Services (classic): `microsoft.classiccompute/domainnames`
- Cloud Services (extended support): `microsoft.compute/cloudservices`

###	What locations are available to deploy Cloud Services (extended support)?
Cloud Services (extended support) is available in all public cloud regions.

###	How does my quota change? 
Customers will need to request quota using the same processes as any other Azure Resource Manager product.Quota in Azure Resource Manager is regional and a separate quota request will be needed for each region.

### Why don’t I see a production & staging slot anymore?
Cloud Services (extended support) does not support the logical concept of a hosted service, which included two slots (Production & Staging). Each deployment is an independent Cloud Service (extended support) deployment. To test and stage a new release of a cloud service, deploy a cloud service (extended support) and tag it as VIP swappable with another cloud service (extended support)

### Why can’t I create an empty Cloud Service anymore?
The concept of hosted service names does not exist anymore, you cannot create an empty Cloud Service (extended support).

###	Does Cloud Services (extended support) support Resource Health Check (RHC)?
No, Cloud Services (extended support) does not support Resource Health Check (RHC).

### How are role instance metrics changing?
There are no changes in the role instance metrics. 

### How are web & worker roles changing?
There are no changes to the design, architecture or components of web and worker roles. 

### How are role instances changing?
There are no changes to the design, architecture or components of the role instances. 

### How will guest os updates change?
 There are no changes to the rollout method. Cloud Services (classic) and Cloud Services (extended support) will get the same updates.
 
### Does Cloud Services (extended support) support stopped-allocated and stopped-deallocated states?

Cloud Services (extended support) deployment only supports the Stopped- Allocated state which appears as "stopped" in the Azure portal. Stopped- Deallocated state is not supported. 

###	Do Cloud Services (extended support) deployments support scaling across clusters, availability zones, and regions?
Cloud Services (extended support) deployments cannot scale across multiple clusters, availability zones and regions. 

### Are there any pricing differences between Cloud Services (classic) and Cloud Services (extended support)?
Cloud Services (extended support) uses Azure Key Vault and Basic (ARM) Public IP addresses. Customers requiring certificates need to use Azure Key Vault for certificate management ([learn more](https://azure.microsoft.com/pricing/details/key-vault/) about Azure Key Vault pricing.)  Each Public IP address for Cloud Services (extended support) is charged separately ([learn more](https://azure.microsoft.com/pricing/details/ip-addresses/) about Public IP Address pricing.) 
## Resources 

###	What resources linked to a Cloud Services (extended support) deployment need to live in the same resource group?
Load balancers, network security groups and route tables need to live in the same region and resource group. 

###	What resources linked to a Cloud Services (extended support) deployment need to live in the same region?
Key Vault, virtual network, public IP addresses, network security groups and route tables need to live in the same region.

###	What resources linked to a Cloud Services (extended support) deployment need to live in the same virtual network?
Public IP addresses, load balancers, network security groups and route tables need to live in the same virtual network. 

## Deployment files 

### How can I use a template to deploy or manage my deployment?
Template and parameter files can be passed as a parameter using REST, PowerShell and CLI. They can also be uploaded using the Azure portal.  

### Do I need to maintain four files now? (template, parameter, csdef, cscfg)
Template and parameter files are only used for deployment automation. Like Cloud Services (classic), you can manually create dependent resources first and then a Cloud Services (extended support) deployment using PowerShell, CLI commands or through Portal with existing csdef, cscfg.

###	How does my application code change on Cloud Services (extended support)
There are no changes required for your application code packaged in cspkg. Your existing applications will continue to work as before. 

### Does Cloud Services (extended support) allow CTP package format?
CTP package format is not supported in Cloud Services (extended support). However, it allows an enhanced package size limit of 800 MB

## Migration

### Will Cloud Services (extended support) mitigate the failures due to allocation failures?
No, Cloud Service (extended support) deployments are tied to a cluster like Cloud Services (classic). Therefore, allocation failures will continue to exist if the cluster is full. 

### When do I need to migrate? 
Estimating the time required and complexity migration depends on a range of variables. Planning is the most effective step to understand the scope of work, blockers and complexity of migration.

## Networking 

###	Why can’t I create a deployment without virtual network?
Virtual networks are a required resource for any deployment on Azure Resource Manager. Cloud Services (extended support) deployment must live inside a virtual network. 

###	Why am I now seeing so many networking resources? 
In Azure Resource Manager, components of your Cloud Services (extended support) deployment are exposed as a resource for better visibility and improved control. The same type of resources were used in Cloud Services (classic) however they were just hidden. One example of such a resource is the Public Load Balancer, which is now an explicit 'read only' resource automatically created by the platform

###	What restrictions apply for a subnet with respective to Cloud Services (extended support)?
A subnet containing Cloud Services (extended support) deployments cannot be shared with deployments from other compute products such as Virtual Machines, Virtual Machines Scale Sets, Service Fabric, etc.

###	What IP allocation methods are supported on Cloud services (extended support)?
Cloud Services (extended support) supports dynamic & static IP allocation methods. Static IP addresses are referenced as reserved IPs in the cscfg file.

###	Why am I getting charged for IP addresses?
Customers are billed for IP Address use on Cloud Services (extended support) just as users are billed for IP addresses associated with virtual machines. 

### Can I use a DNS name with Cloud Services (extended support)? 
Yes. Cloud Services (extended support) can also be given a DNS name. With Azure Resource Manager, the DNS label is an optional property of the public IP address that is assigned to the Cloud Service. The format of the DNS name for Azure Resource Manager based deployments is `<userlabel>.<region>.cloudapp.azure.com`

### Can I update or change the virtual network reference for an existing cloud service (extended support)? 
No. Virtual network reference is mandatory during the creation of a cloud service. For an existing cloud  service, the virtual network reference cannot be changed. The virtual network address space itself can be  modified using VNet APIs. 

## Certificates & Key Vault

###	Why do I need to manage my certificates on Cloud Services (extended support)?
Cloud Services (extended support) has adopted the same process as other compute offerings where certificates reside within customer managed Key Vaults. This enables customers to have complete control over their secrets & certificates. 

###	Can I use one Key Vault for all my deployments in all regions?
No. Key Vault is a regional resource and customers need one Key Vault in each region. However, one Key Vault can be used for all deployments within a given region.

## Next steps
To start using Cloud Services (extended support), see [Deploy a Cloud Service (extended support) using PowerShell](deploy-powershell.md)

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
This article covers frequently asked questions related to Azure Cloud Services (extended support)

## General

### What new features come with Cloud Services (extended support)?
Cloud Service (extended support) supports features such as templates, role-based access control, Azure Resource Manager policies for improved control on security and  privacy, resource tagging, private links, Azure firewall, VNET peering and key vault support.

### Are there any pricing differences between Cloud Services (classic) and Cloud Services (extended support)
Yes. Cloud Services (extended support) supports additional features such as the use of key vault and dynamic/ static IP addresses. Customers will be charged for the utilization of these resources similar to any other Azure Resource Manager products. 

### What is the resource name for Cloud Services (classic) & Cloud Services (extended support)?
- Cloud Services (classic): `microsoft.classiccompute/domainnames`
- Cloud Services (extended support): `microsoft.compute/cloudservices`

###	What locations will Cloud Services (extended support) be available?
Cloud Services (extended support) is available in all Public Cloud Regions.

###	How does my quota change? 
Customers will need to request for new quota on Azure Resource Manager using the same process used for any other compute product. Quota in Azure Resource Manager is regional unlike global in Azure Service Manager. A separate quota request needs to made for each region.

### Why don’t I see a production & staging slot anymore?
Unlike Cloud Services (classic), Cloud Services (extended support) does not support the logical concept of hosted service, which included two slots (Production & Staging). Each deployment is an independent Cloud Service (extended support) deployment. 

### Why can’t I create an empty Cloud Service anymore?
The concept of hosted service names does not exist anymore, you cannot create an empty Cloud Service without any deployment.

If your current architecture used to create a ready to use environment with an empty Cloud Service and later provision a deployment, you can do something similar using Resource Groups. a ready to use environment can be created using Resource Groups and later Cloud Service deployments can be created when needed. 

###	Does Cloud Services (extended support) support Resource Health Check (RHC)?
No, Cloud Services (extended support) does not yet support Resource Health Check (RHC).

### How are role instance metrics changing?
There are no changes in the role instance metrics reported on Portal. 

### How are Web & Worker roles changing?
There are no changes to the design, architecture and the components of Web & Worker roles. 

### How are role instances changing?
There are no changes to the design, architecture and the components of the role instances. 

### How will guest os updates change?
 There are no changes to the rollout method. Cloud Services (classic)  and Cloud Services (extended support) will get the same updates at a regular cadence.
 
### Do Cloud Services (extended support) support Stopped-Allocated and Stopped-Deallocated states?

Similar to Cloud Services (classic) deployment, Cloud Services (extended support) deployment only supports Stopped (Allocated) state which appears as stopped on Portal. Stopped (Deallocated) state is not supported. 

###	Does Cloud Services (extended support) deployment support scaling across clusters, availability zones, and regions?
No, Similar to Cloud Services (classic), Cloud Services (extended support) deployment cannot scale across multiple clusters, availability zones and regions. 

## Resources 

###	What resources linked to a Cloud Services (extended support) deployment need to live in the same resource group?
Storage accounts, public IPs, load balancer, Cloud Service deployments, network security groups and route tables need to live in the same region and resource group. 

###	What resources linked to a Cloud Services (extended support) deployment need to live in the same region?
key vault, virtual network, public IPs, Cloud Service deployments, network security groups and route tables need to live in the same region.

###	What resources linked to a Cloud Services (extended support) deployment need to live in the same virtual network?
Public IPs, load balancer, Cloud Services deployment, network security groups and route tables need to live in the same virtual network. 

## Deployment Files 

### How can I use a Template to deploy or manage my deployment?
Template and Parameter files can be passed as a parameter using Rest API, PowerShell and CLI. They can also be uploaded using the Azure portal.  

### What is changing in my existing `.csdef` deployment file?

Properties of load balancer probes, endpoints, reserved IPs and public IPs now use the fully qualified Azure Resource Manager resource name.

`/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}`

### Do I need to maintain four files now? (template, parameter, `.csdef`, `.cscfg`)
Template and parameter files are only used for deployment automation. Like Cloud Services (classic), you can manually create dependent resources first and then a Cloud Services (extended support) deployment using PowerShell or CLI commands. 


###	How does my application code change on Cloud Services (extended support)
There are no changes required for your application code packaged in `.cspkg`. Your existing applications will continue to work as before. 


## Migration

### Will Cloud Services (extended support) mitigate the failures due to Allocation failures?
No, Cloud Service (extended support) deployments are tied to a cluster like Cloud Services (classic). Therefore, allocation failures will continue to exist if the cluster is full. 

### When do I need to migrate? 
Estimating the time required, complexity and efforts for migration is difficult due to influence of range of variables. Planning is the most time consuming but the most effective step to understand the scope of work, blockers and complexity for migration.

## Networking

### How does this affect VIP Swap feature?
During create of a new Cloud Service (extended support) deployment, you can define the deployment ID of the deployment you want to swap with. This defines the VIP Swap relationship between two Cloud Services. 

###	Why can’t I create a deployment without virtual network?
Virtual networks are a required resource for any deployment on Azure Resource Manager. Therefore, now Cloud Services (extended support) deployments must live inside a virtual network. 

###	Why am I now seeing so many networking resources? 
In Azure Resource Manager, components of your Cloud Services (extended support) deployment are exposed as a resource for better visibility and improved control. 

###	What restrictions apply for a subnet with respective to Cloud Services (extended support)
A Subnet containing Cloud Services (extended support) deployment cannot be shared with deployment from other compute products like Virtual Machines, Virtual Machines Scale Sets, Service Fabric. Etc. 

Customers need to use a different subnet in the same Virtual Network. 

###	What IP allocation methods are supported on Cloud services (extended support)?
Cloud Services (extended support) supports dynamic & static IP allocation methods. Static IP addresses are referenced as reserved IP in the `.cscfg` file.

###	Why am I getting charged for IP addresses?
Customers are billed for IP Address use on Cloud Services (extended support). 

### Can I use a DNS name with Cloud Services (extended support)? 
Yes. Cloud Services (extended support) can also be given a DNS name. With Azure Resource Manager, the DNS label is an optional property of the public IP address that is assigned to the Cloud Service. The format of the DNS name for Azure Resource Manager based deployments is `<userlabel>.<region>.cloudapp.azure.com`

## Certificates & key vault

###	Why do I need to manage my certificates on Cloud Services (extended support)?
Cloud Services (extended support) has adopted the same process as other compute offerings where certificates reside within customer owned key vault. This enables customers to have complete control over their secrets & certificates. 

Cloud Services (extended support) will search the referenced key vault for the certificates mentioned in the deployment files and use it. Thus, simplifying the deployment process. 

###	Can I use one key vault for all my deployments in all regions?
No. Key vault is a regional resource and customers need one key vault in each region. However, one key vault can be used for all deployments within a region.


## Next steps
To start using Cloud Services (extended support), see [Deploy a Cloud Service (extended support) using PowerShell](deploy-powershell.md)
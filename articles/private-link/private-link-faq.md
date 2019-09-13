---
title: Azure Private Link frequently asked questions (FAQ)
description: Learn about Azure Private Link.
services: virtual-network
author: KumudD
ms.service: virtual-network
ms.topic: article
ms.date: 09/16/2019
ms.author: kumud

---

# Azure Private Link frequently asked questions (FAQ)

## Private Link

### What is Azure Private Link service and Private Endpoint? 
= **Azure Private Endpoint**: Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. 
- **Azure Private Link service**: Azure Private Link service is a service created by  a service provider. Currently a Private Link Service can be attached to frontend IP configuration of a Standard Load Balancer. You can also connect to Azure services via Private Endpoints. 
 
### Can I connect my service to multiple Private Endpoints? 
Yes. One Private Link service can connect to multiple Private Endpoints. However one Private Endpoint can only connect to one Private Link Service.  
 
### Is my data over Private Link always private?
Yes. All data over Azure Private Link stays on Microsoft Backbone. It doesn’t traverse internet.  
 
### What is the difference between a VNet Service Endpoint and a Private Endpoint?  
VNet Service Endpoints and Private Endpoints are independent of each other. 
- VNet Service Endpoints extend your Virtual Network private address space and the identity of your VNet to the Azure services, over a direct connection. Endpoints allow you to secure your critical Azure service resources to only your virtual networks. 
- Private Endpoint is a networking resource acting as an entry point for ervice traffic in your network and use Azure Private Link technology.  
 
### Can I have multiple Private Endpoints to the same service?
Yes, one Private Link service can connect to multiple Private Endpoints. However, only one Private Endpoint can only connect to one Private Link service.  
 
### Does the data always stay off internet? 
All data over Azure Private Link stays on Microsoft network. It doesn’t traverse internet.  
 
### What is the difference between a VNet service endpoint and a private endpoint? 
VNet service endpoints and private endpoints are independent of each other. VNet service endpoints extend your virtual network private address space and the identity of your VNet to the Azure services, over a direct connection. Endpoints allow you to secure your critical Azure service resources to only your virtual networks. On the other hand, private endpoint is a networking resource acting as an entry point for Service traffic in your network and use Azure Private Link technology.  
 
### Will VNet service endpoints be deprecated once Private Endpoints are available? 
No. VNet Service Endpoints and Private Endpoints are independent technologies/resources. They can complement each other and both will co-exist. Some functionality and use cases may overlap, you can choose the model that fits your needs.  
 
### I am a service provider using Azure Private Link. Do I need to make sure all my customers have unique IP space and don’t overlap with my IP space? 
No. Azure Private Link provides this functionality for you. Hence, you are not required to have non-overlapping address space with your customer's address space. 
 
## Private Link Service
 
### What are the pre-requisites for creating a Private Link service? 
Following are the pre-requisites for creating Private Link service: 
- Virtual Network (Azure Resource Manager deployment model)
- Standard Load Balancer.   
- TCP traffic only. 
 
### How can I scale my Private Link service? 
You can scale your Private Link service in a few different ways: 
- Add Backend VMs to the pool behind your Standard Load Balancer 
- Add NAT IP to the Private Link service. We allow up to 8 NAT IPs per Private Link service.  
- Add new Private Link service to Standard Load Balancer. We allow up to eight Private Link services per load balancer.   
 
### How should I control the exposure of my Private Link service? 
You can control the exposure using the visibility configuration on Private Link service. Visibility support three settings: 
- **None** - Only subscriptions with RBAC access can locate the service. 
- **Restrictive** - Only subscriptions that are whitelisted and with RBAC access can locate the service. 
- **All** - Everyone can locate the service. 
 
### Can I create a Private Link service with Basic Load Balancer? 
No. Private Link service over a Basic Load Balancer is not supported. Standard Load Balancer is supported.
 
### Is a dedicated subnet required for Private Link service? 
No. Private Link service doesn’t require a dedicated subnet. You can choose any subnet in your VNet where your service is deployed.   

## Private Endpoint 
 
### CanI create multiple Private Endpoints in same VNet? Can they connect to different Services? 
Yes. You can have multiple private endpoints in same VNet or subnet. They can connect to different services.  
 
### Do I require a dedicated subnet for private endpoints? 
No. You don't require a dedicated subnet for private endpoints. You can choose a private endpoint IP from any subnet from the VNet where your service is deployed.  
 
### Can Private Endpoint connect to Private Link service across Azure Active Directory Tenants? 
Yes. Private endpoints can connect to Private Link services or Azure PaaS across AD tenants.  
 
### Can private endpoint connect to Azure PaaS resources across Azure regions? 
Yes. Private endpoints can connect to Azure PaaS resources across Azure regions.

##  Next steps
- Learn about [Azure private link](private-link-overview.md)

---
title: Azure Private Link frequently asked questions (FAQ)
description: Learn about Azure Private Link.
services: virtual-network
author: KumudD
ms.service: virtual-network
ms.topic: article
ms.date: 09/05/2019
ms.author: kumud

---

# Azure Private Link frequently asked questions (FAQ)

## Private Link
### What is the difference between Azure Private Link, Azure Private Link service and Private Endpoint? 
 
**Azure Private Link**: It is a technology to render and consume services delivered on Azure Platform privately.   
**Private Link service**: A privately linkable service resource created by the Service provider. Currently, a Private Link service can be attached to front end of a standard load balancer. 
**Private Endpoint**: A networking resource in consumer VNet used to consume services privately on Azure Platform.  
 
Additional definitions: 
**Azure Private Link service** refers to a Private Link service deployed in service provider’s virtual network. 
**Azure Private Endpoints** refers to a private endpoint deployed in service consumer’s virtual network. 
**Maximum Available Minutes** is the total accumulated minutes in a billing month during which the Azure Private Link service/private endpoints has been deployed in a Microsoft Azure subscription. 
**Downtime** is the total accumulated Maximum Available Minutes in a billing month for a given Azure Private Link service/private endpoint during which the Azure private Link service/private endpoint is unavailable. A given minute is considered unavailable if all attempts to connect to the Azure Private Link service through Private Endpoint throughout the minute are unsuccessful. 
**Monthly Uptime Percentage** The *Monthly Uptime Percentage* is calculated using the following formula: 
(*Maximum Available Minutes - Downtime*) /*Maximum Available Minutes * 100*
 

|Monthly Uptime Percentage  |Private Link Service Credit |Private Endpoint Credit |
|---------|---------|---------|
|< 99.99%    |    0%     |    10%     | 
|< 99%   |    0%     |     25%    |
|   |         |         | 


### How can I access control my PaaS resources over Private Link? 
 
Today, we don't offer any ACL-ing mechanism on the Azure service side to protect the resource from traffic coming from  private endpoint over Private Link. However, there are 2 mechanisms with which PaaS resources admin can secure the resources over private Link: 
- For private endpoint connection, PaaS admin can choose whether to approve the connection request or not. Once approved,all data will flow.  
- NSG/ASG support on private endpoint - Network Admin can secure the PaaS resource by securing the Private Endpoint using NSGs/ASGs.  NSG/ASGs will be supported at GA timeframe.   
 
### What is the relationship between Private Link service and private endpoint? 
 
It is 1 to many relationship. One Private Link service can connect to multiple private endpoints. On the other hand, one private endpoint can only connect to one Private Link service.  
 
### Does the data always stay off internet? 
 
All data over Azure Private Link stays on Microsoft network. It doesn’t traverse internet.  
 
### What is the difference between a VNet service endpoint and a private endpoint? 
 
VNet service endpoints and private endpoints are independent of each other. VNet service endpoints extend your virtual network private address space and the identity of your VNet to the Azure services, over a direct connection. Endpoints allow you to secure your critical Azure service resources to only your virtual networks. On the other hand, private endpoint is a networking resource acting as an entry point for Service traffic in your network and use Azure Private Link technology.  
 
### Will VNet service endpoints deprecate once private endpoints are available? 
No. VNet service endpoints and private endpoints are independent technologies/resources. They can complement each other and both will co-exist. Some functionality and use cases may overlap, you can choose the model that fits your needs.  
 
### Is Private Link a paid service? 
Private Link is paid offering. See pricing page for details. 
 
### I am a service provider using Private Link. Do I need to make sure all my customers have unique IP space and don’t overlap with my IP space? 
Azure Private Link uses NAT-ing underneath. Hence, you are not required to have non-overlapping address space with your customers.   
 
 
## Private Link service
 
### What are the pre-requisites for creating a Private Link service? 
Following are the pre-requisites for creating Private Link service: 
- Virtual Network based on Azure Resource Manager.
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
No. Private Link service over a Basic Load Balancer is not supported.
 
### Does it require a dedicated subnet for NAT IP for Private Link service? 
No. Private Link service doesn’t require a dedicated subnet for NAT IPs. You can choose the NAT IP from any subnet from VNet where your service is deployed.   

### How do I know the source info if the connections are NAT-ed on destination side? 
Azure Private Link supports TCP proxy V2 which allows carrying source info to the end destination. You need to configure your service to receive and consume TCP proxy V2 packets.  
 
## Private Endpoint 
 
### Can a customer contain multiple private endpoints in same VNet? Can they connect to different Services? 
Yes. You can have multiple private endpoints in same VNet or subnet. They can connect to different services.  
 
### Can a private endpoint NIC be managed by the customer? 
No. Private endpoint NIC is a virtual NIC and can't be managed by the customer.  
 
### Do I require a dedicated subnet for private endpoints? 
No. You don't require a dedicated subnet for private endpoints. You can choose a private endpoint IP from any subnet from the VNet where your service is deployed.  
 
### Can Private Endpoint connect to Private Link service across AD Tenants? 
Yes. Private endpoints can connect to Private Link services or Azure PaaS across AD tenants.  
 
### Can private endpoint connect to Azure PaaS resources across Azure regions? 
Yes. Private endpoints can connect to Azure PaaS resources across Azure regions.
##  Next steps
- Learn about [Azure Private Link](private-link-overview.md)
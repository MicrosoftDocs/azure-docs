---
title: Azure Private Link frequently asked questions (FAQ)
description: Learn about Azure Private Link.
services: virtual-network
author: KumudD
ms.service: virtual-network
ms.topic: conceptual
ms.date: 09/17/2019
ms.author: kumud

---

# Azure Private Link frequently asked questions (FAQ)

## Private Link

### What is Azure Private Link service and Private Endpoint?

- **Azure Private Endpoint**: Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. 
- **Azure Private Link service**: Azure Private Link service is a service created by  a service provider. Currently, a Private Link Service can be attached to the frontend IP configuration of a Standard Load Balancer. You can also connect to Azure services via Private Endpoints.

### How can I access control my PaaS resources over Private Link?

Today, we don't offer any ACL-ing mechanism on the Azure service side to protect the resource from traffic that comes from a private endpoint over private link. However, there are two mechanisms with which a PaaS resources administrator can secure the resources over Private Link:

- For private endpoint connection, PaaS admins can choose whether to approve the connection request or not. After it's approved, all data will flow.  
 
### Can I connect my service to multiple Private Endpoints?

Yes. One Private Link service can connect to multiple Private Endpoints. However one Private Endpoint can only connect to one Private Link Service.  
 
### Is my data over Private Link always private?

Yes. All data over Azure Private Link stays on the Microsoft backbone. It doesn’t traverse the internet.  
 
### What is the difference between a VNet Service Endpoint and a Private Endpoint?

VNet Service Endpoints and Private Endpoints are independent of each other.

- VNet Service Endpoints extend your virtual network private address space and the identity of your VNet to the Azure services, over a direct connection. Endpoints allow you to secure your critical Azure service resources to only your virtual networks. 
- Private Endpoint is a networking resource that acts as an entry point for service traffic in your network and uses Azure Private Link technology.  

### What is the relationship between Private Link service and Private Endpoint?

It is a one to many relationship. One Private Link service can connect to multiple private endpoints. On the other hand, one private endpoint can only connect to one Private Link service.  
 
### Does the data always stay off internet?

All data over Azure Private Link stays on the Microsoft network. It doesn’t traverse internet.  
 
### What is the difference between a VNet service endpoint and a private endpoint?

VNet service endpoints and private endpoints are independent of each other. VNet service endpoints extend your virtual network private address space and the identity of your VNet to the Azure services, over a direct connection. Endpoints allow you to secure your critical Azure service resources to only your virtual networks. On the other hand, a private endpoint is a networking resource that acts as an entry point for service traffic in your network and uses Azure Private Link technology.  
 
### Will VNet service endpoints be deprecated after private endpoints are available?

No. VNet service endpoints and private endpoints are independent technologies/resources. They can complement each other and both will co-exist. Some functionality and use cases may overlap. You can choose the model that fits your needs.  
 
### I am a service provider using Azure Private Link. Do I need to make sure all my customers have unique IP address space and don’t overlap with my IP address space?

No. Azure private link uses NAT-ing underneath. Therefore, you aren't required to have non-overlapping address space with your customers.   
 
## Private Link Service
 
### What are the prerequisites for creating a Private Link service?

The following are the prerequisites for creating a Private Link service:

- A virtual network based on Azure Resource Manager
- Standard Load Balancer
- TCP traffic only
 
### How can I scale my Private Link service?

You can scale your Private Link service in a few different ways:  

- Add backend VMs to the pool behind your Standard Load Balancer 
- Add NAT IP to the Private Link service. We allow up to eight NAT IP addresses per Private Link service.  
- Add a new Private Link service to Standard Load Balancer. We allow up to eight Private Link services per load balancer.   
 
### How should I control the exposure of my Private Link service?

You can control the exposure using the visibility configuration on Private Link service. Visibility support three settings:

- **None** - Only subscriptions with RBAC access can locate the service. 
- **Restrictive** - Only subscriptions that are whitelisted and with RBAC access can locate the service. 
- **All** - Everyone can locate the service. 
 
### Can I create a Private Link service with Basic Load Balancer?

No. Private Link service over a Basic Load Balancer is not supported.
 
### Does it require a dedicated subnet for NAT IP for Private Link service?

No. Private Link service doesn’t require a dedicated subnet for NAT IP addresses. You can choose the NAT IP address from any subnet from the VNet where your service is deployed.   

### How do I know the source info if the connections are NAT-ed on the destination side?

Azure Private Link supports TCP proxy V2 which allows carrying source info to the end destination. You need to configure your service to receive and consume TCP proxy V2 packets.
 
## Private Endpoint 
 
### Can a customer contain multiple private endpoints in the same VNet? Can they connect to different services?

Yes. You can have multiple private endpoints in the same VNet or subnet. They can connect to different services.  
 
### Can a private endpoint NIC be managed by the customer?

No. The private endpoint NIC is a virtual NIC and can't be managed by the customer.  
 
### Do I require a dedicated subnet for private endpoints?

No. You don't require a dedicated subnet for private endpoints. You can choose a private endpoint IP address from any subnet from the VNet where your service is deployed.
 
### Can Private Endpoint connect to Private Link service across Active Directory tenants?

Yes. Private endpoints can connect to Private Link services or Azure PaaS across Active Directory tenants.  
 
### Can private endpoint connect to Azure PaaS resources across Azure regions?

Yes. Private endpoints can connect to Azure PaaS resources across Azure regions.

##  Next steps

- Learn about [Azure private link](private-link-overview.md)

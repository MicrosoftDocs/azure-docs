---
title: Azure Private Link frequently asked questions (FAQ)
description: Learn about Azure Private Link.
services: private-link
author: malopMSFT
ms.service: private-link
ms.topic: conceptual
ms.date: 09/16/2019
ms.author: allensu

---

# Azure Private Link frequently asked questions (FAQ)

## Private Link

### What is Azure Private Endpoint and Azure Private Link Service?

- **[Azure Private Endpoint](private-endpoint-overview.md)**: Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. You can use Private Endpoints to connect to an Azure PaaS service that supports Private Link or to your own Private Link Service.
- **[Azure Private Link Service](private-link-service-overview.md)**: Azure Private Link service is a service created by a service provider. Currently, a Private Link service can be attached to the frontend IP configuration of a Standard Load Balancer. 

### How is traffic being sent when using Private Link?
Traffic is sent privately using Microsoft backbone. It doesn’t traverse the internet.  
 
### What is the difference between a Service Endpoints and a Private Endpoints?
- When using Private Endpoints, network access is granted to specific resources behind a given service providing granular segmentation, also traffic can reach the service resource from on premises without using public endpoints.
- A service endpoint remains a publicly routable IP address.  A private endpoint is a private IP in the address space of the virtual network where the private endpoint is configured.

### What is the relationship between Private Link service and Private Endpoint?
Private Endpoint provides access to multiple private link resource types, including Azure PaaS services and your own Private Link Service. It is a one-to-many relationship. One Private Link service can receive connections from multiple private endpoints. On the other hand, one private endpoint can only connect to one Private Link service.    

## Private Endpoint 
 
### Can I create multiple Private Endpoints in same VNet? Can they connect to different Services? 
Yes. You can have multiple private endpoints in same VNet or subnet. They can connect to different services.  
 
### Do I require a dedicated subnet for private endpoints? 
No. You don't require a dedicated subnet for private endpoints. You can choose a private endpoint IP from any subnet from the VNet where your service is deployed.  
 
### Can Private Endpoint connect to Private Link service across Azure Active Directory Tenants? 
Yes. Private endpoints can connect to Private Link services or Azure PaaS across AD tenants.  
 
### Can private endpoint connect to Azure PaaS resources across Azure regions?
Yes. Private endpoints can connect to Azure PaaS resources across Azure regions.

## Private Link Service
 
### What are the pre-requisites for creating a Private Link service? 
Your service backends should be in a Virtual network and behind a Standard Load Balancer.
 
### How can I scale my Private Link service? 
You can scale your Private Link service in a few different ways: 
- Add Backend VMs to the pool behind your Standard Load Balancer 
- Add an IP to the Private Link service. We allow up to 8 IPs per Private Link service.  
- Add new Private Link service to Standard Load Balancer. We allow up to eight Private Link services per load balancer.   

### Can I connect my service to multiple Private Endpoints?
Yes. One Private Link service can receive connections from multiple Private Endpoints. However one Private Endpoint can only connect to one Private Link service.  
 
### How should I control the exposure of my Private Link service?
You can control the exposure using the visibility configuration on Private Link service. Visibility supports three settings:

- **None** - Only subscriptions with RBAC access can locate the service. 
- **Restrictive** - Only subscriptions that are whitelisted and with RBAC access can locate the service. 
- **All** - Everyone can locate the service. 
 
### Can I create a Private Link service with Basic Load Balancer? 
No. Private Link service over a Basic Load Balancer is not supported.
 
### Is a dedicated subnet required for Private Link service? 
No. Private Link service doesn’t require a dedicated subnet. You can choose any subnet in your VNet where your service is deployed.   

### I am a service provider using Azure Private Link. Do I need to make sure all my customers have unique IP space and don’t overlap with my IP space? 
No. Azure Private Link provides this functionality for you. Hence, you are not required to have non-overlapping address space with your customer's address space. 

##  Next steps

- Learn about [Azure Private Link](private-link-overview.md)

---
title: Concepts - API Management 
description: Learn how API Management protects APIs running on Azure VMware Solution virtual machines (VMs)
ms.topic: conceptual
ms.date: 10/27/2020
---

# API Management to publish and protect APIs running on Azure VMware Solution-based VMs

Microsoft Azure [API Management](https://azure.microsoft.com/services/api-management/) lets you securely publish to internal or external consumers.  Only the Developer and Premium SKUs allow for Azure Virtual Network integration to publish APIs running on Azure VMware Solution workloads.  Both SKUs securely enable the connectivity between API Management service and the backend. 

>[!NOTE]
>The Developer SKU is intended for development and testing while the Premium SKU is for production deployments.

The API Management configuration is the same for backend services that run on top of Azure VMware Solution virtual machines (VMs) and on-premises. For both deployments, API Management configures the virtual IP (VIP) on the load balancer as the backend endpoint when the backend server is placed behind an NSX Load Balancer on the Azure VMware Solution. 


## External deployment

An external deployment publishes APIs consumed by external users using a public endpoint. Developers and DevOps engineers can manage APIs through the Azure portal or PowerShell, and the API Management developer portal.

The external deployment diagram shows the entire process and the actors involved (shown at the top). The actors are:

- **Administrator(s):** Represents the admin or DevOps team, which manages Azure VMware Solution through the Azure portal and automation mechanisms like PowerShell or Azure DevOps.

- **Users:**  Represents the exposed APIs' consumers and represent both users and services consuming the APIs.

The traffic flow goes through API Management instance, which abstracts the backend services, plugged into the Hub virtual network. The ExpressRoute Gateway routes the traffic to the ExpressRoute Global Reach channel and reaches an NSX Load Balancer distributing the incoming traffic to the different backend services instances.

API Management has an Azure Public API, and activating Azure DDOS Protection Service is recommended. 

:::image type="content" source="media/api-management/external-deployment.png" alt-text="External deployment - API Management for Azure VMware Solution":::


## Internal deployment

An internal deployment publishes APIs consumed by internal users or systems. DevOps team and API developers use the same management tools and developer portal as in the external deployment.

Internal deployments can be done [with Azure Application Gateway](../api-management/api-management-howto-integrate-internal-vnet-appgateway.md) to create a public and secure endpoint for the API.  The gateway's capabilities are used to create a hybrid deployment that enables different scenarios.  

* Use the same API Management resource for consumption by both internal and external consumers.

* Have a single API Management resource with a subset of APIs defined and available for external consumers.

* Provide an easy way to switch access to API Management from the public internet on and off.

The deployment diagram below shows consumers that can be internal or external, with each type accessing the same or different APIs.

In an internal deployment, APIs get exposed to the same API Management instance. In front of API Management, Application Gateway gets deployed with Azure Web Application Firewall (WAF) capability activated. Also deployed, a set of HTTP listeners and rules to filter the traffic, exposing only a subset of the backend services running on Azure VMware Solution.


* Internal traffic routes through ExpressRoute Gateway to Azure Firewall and then to API Management, directly or through traffic rules.   

* External traffic enters Azure through Application Gateway, which uses the external protection layer for API Management.


:::image type="content" source="media/api-management/internal-deployment.png" alt-text="Internal deployment - API Management for Azure VMware Solution" lightbox="media/api-management/internal-deployment.png":::
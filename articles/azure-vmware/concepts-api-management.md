---
title: Concepts - API Management 
description: Learn how API Management protects APIs running on Azure VMware Solution virtual machines (VMs)
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 10/25/2022
ms.custom: engagement-fy23
---

# Publish and protect APIs running on Azure VMware Solution VMs

Microsoft Azure [API Management](https://azure.microsoft.com/services/api-management/) lets you securely publish to external or internal consumers.  Only the Developer (development) and Premium (production) SKUs allow Azure Virtual Network integration to publish APIs that run on Azure VMware Solution workloads. In addition, both SKUs enable the connectivity between the API Management service and the backend.

The API Management configuration is the same for backend services that run on Azure VMware Solution virtual machines (VMs) and on-premises. API Management also configures the virtual IP on the load balancer as the backend endpoint for both deployments when the backend server is placed behind an NSX Load Balancer on Azure VMware Solution.

## External deployment

An external deployment publishes APIs consumed by external users that use a public endpoint. Developers and DevOps engineers can manage APIs through the Azure portal or PowerShell and the API Management developer portal.

The external deployment diagram shows the entire process and the actors involved (shown at the top). The actors are:

- **Administrator(s):** Represents the admin or DevOps team, which manages Azure VMware Solution through the Azure portal and automation mechanisms like PowerShell or Azure DevOps.

- **Users:**  Represents the exposed APIs' consumers and represents both users and services consuming the APIs.

The traffic flow goes through the API Management instance, which abstracts the backend services, plugged into the Hub virtual network. The ExpressRoute Gateway routes the traffic to the ExpressRoute Global Reach channel and reaches an NSX Load Balancer distributing the incoming traffic to the different backend service instances.

API Management has an Azure Public API, and activating Azure DDoS Protection Service is recommended.

:::image type="content" source="media/api-management/api-management-external-deployment.png" alt-text="Diagram showing an external API Management deployment for Azure VMware Solution" border="false":::

## Internal deployment

An internal deployment publishes APIs consumed by internal users or systems. DevOps teams and API developers use the same management tools and developer portal as in the external deployment.

Use [Azure Application Gateway](../api-management/api-management-howto-integrate-internal-vnet-appgateway.md) for internal deployments to create a public and secure endpoint for the API.  The gateway's capabilities are used to create a hybrid deployment that enables different scenarios.  

* Use the same API Management resource for consumption by both internal and external consumers.

* Have a single API Management resource with a subset of APIs defined and available for external consumers.

* Provide an easy way to switch access to API Management from the public internet on and off.

The deployment diagram below shows consumers that can be internal or external, with each type accessing the same or different APIs.

In an internal deployment, APIs get exposed to the same API Management instance. In front of API Management, Application Gateway gets deployed with Azure Web Application Firewall (WAF) capability activated. Also deployed, a set of HTTP listeners and rules to filter the traffic, exposing only a subset of the backend services running on Azure VMware Solution.

* Internal traffic routes through ExpressRoute Gateway to Azure Firewall and then to API Management, directly or through traffic rules.

* External traffic enters Azure through Application Gateway, which uses the external protection layer for API Management.

:::image type="content" source="media/api-management/api-management-internal-deployment.png" alt-text="Diagram showing an internal API Management deployment for Azure VMware Solution" lightbox="media/api-management/api-management-internal-deployment.png" border="false":::

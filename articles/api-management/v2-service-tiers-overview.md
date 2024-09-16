---
title: Azure API Management - v2 tiers
description: Introduction to key scenarios, capabilities, and concepts of the v2 tiers (SKUs) of the Azure API Management service. 
services: api-management
author: dlepow
 
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 09/12/2024
ms.author: danlep
ms.custom: references_regions
---

# Azure API Management v2 tiers

[!INCLUDE [api-management-availability-basicv2-standardv2-premiumv2](../../includes/api-management-availability-basicv2-standardv2-premiumv2.md)]

The recently released v2 tiers (SKUs) for Azure API Management are built on a new, more reliable and scalable platform and are designed to make API Management accessible to a broader set of customers and offer flexible options for a wider variety of scenarios. The v2 tiers are in addition to the existing classic tiers (Developer, Basic, Standard, and Premium) and the Consumption tier. [See detailed comparison of API Management tiers](api-management-features.md).

The following v2 tiers are generally available:

* **Basic v2** - The Basic v2 tier is designed for development and testing scenarios, and is supported with an SLA.

* **Standard v2** - Standard v2 is a production-ready tier with support for network-isolated backends.

The following v2 tier is in preview:

* **Premium v2** (preview) - Premium v2 provides enterprise features including full virtual network isolation, zone redundancy, workspaces, and greater scaling.

## Key capabilities

* **Faster deployment, configuration, and scaling** - Deploy a production-ready API Management instance in minutes. Quickly apply configurations such as certificate and hostname updates. Scale a Basic v2 or Standard v2 instance quickly to up to 10 units to meet the needs of your API management workloads. Scale a Premium v2 instance to up to 30 units.

* **Simplified networking** - The Standard v2 tier supports [outbound connections](#networking-options) to network-isolated backends. Premium v2 supports simplified network injection to isolate both inbound and outbound traffic.

* **More options for production workloads** - The v2 tiers are all supported with an SLA. Upgrade from Basic v2 to Standard v2 to Premium v2 to add more production options.

* **Developer portal options** - Enable the [developer portal](api-management-howto-developer-portal.md) when you're ready to let API consumers discover your APIs. 


## Features

### API version

The latest capabilities of the v2 tiers are supported in API Management API version **2024-05-01** or later.

## Networking options

* **Standard v2** supports VNet integration to allow your API Management instance to reach API backends that are isolated in a single connected VNet. The API Management gateway, management plane, and developer portal remain publicly accessible from the internet. The VNet must be in the same region as the API Management instance. [Learn more](integrate-vnet-outbound.md).

* **Premium v2** supports VNet injection for complete network isolation of the API Management instance without networking dependencies on the customer's virtual network. You can secure all inbound and outbound traffic and route outbound traffic as you want. [Learn more](virtual-network-concepts.md)


### Enterprise capabilities in the Premium v2 tier

The Premium v2 tier offers enterprise capabilities including the following:

* **Workspaces with isolation** - Configure [workspaces](workspaces-overview.md) for API teams to own and operate a portion of a shared API Management service with an isolated workspace gateway. 

* **Availability zones by default** - Premium v2 instances are availability zone-enabled by default. The underlying infrastructure and dependencies of the API Management instance are distributed across two availability zones in a region.  

* **Distribute your data plane across availability zones** - Distribute API gateways across specific availability zones in a region. 

### Supported regions

For a current list of regions where the v2 tiers are available, see [Availability of v2 tiers and workspace gateways](api-management-region-availability.md).

### Classic feature availability

Most capabilities of the classic API Management tiers are supported in the v2 tiers. However, the following capabilities aren't supported in the v2 tiers:

* API Management service configuration using Git
* Back up and restore of API Management instance
* Enabling Azure DDoS Protection
* Direct Management API access

### Limitations

The following API Management capabilities are currently unavailable in the v2 tiers.

**Infrastructure and networking**
* Multi-region deployment 
* Multiple custom domain names 
* Capacity metric - *replaced by CPU Percentage of Gateway and Memory Percentage of Gateway metrics*
* Built-in analytics - *replaced by Azure Monitor-based dashboard*
* Inbound connection using a private endpoint
* Upgrade to v2 tiers from v1 tiers 
* CA Certificates

**Developer portal**
* Reports
* Custom HTML code widget and custom widget
* Self-hosted developer portal

**Gateway**
* Self-hosted gateway
* Quota by key policy
* Cipher configuration
* Client certificate renegotiation
* Free, managed TLS certificate
* Requests to the gateway over localhost

## Resource limits

The following resource limits apply to the v2 tiers.

[!INCLUDE [api-management-service-limits-v2](../../includes/api-management-service-limits-v2.md)]

## Developer portal limits

The following limits apply to the developer portal in the v2 tiers.

[!INCLUDE [api-management-developer-portal-limits-v2](../../includes/api-management-developer-portal-limits-v2.md)]

## Deployment

Deploy a v2 tier instance using the Azure portal, Azure REST API, or Azure Resource Manager or Bicep template.

## Frequently asked questions

### Q: Can I migrate from my existing API Management instance to a new v2 tier instance?

A: No. Currently you can't migrate an existing API Management instance (in the Consumption, Developer, Basic, Standard, or Premium tier) to a new v2 tier instance. Currently the v2 tiers are available for newly created service instances only.

### Q: What's the relationship between the stv2 compute platform and the v2 tiers?

A: They're not related. stv2 is a [compute platform](compute-infrastructure.md) version of the Developer, Basic, Standard, and Premium tier service instances. stv2 is a successor to the stv1 platform [scheduled for retirement in 2024](./breaking-changes/stv1-platform-retirement-august-2024.md).

### Q: Will I still be able to provision Basic, Standard, or Premium tier services? 

A: Yes, there are no changes to the classic Basic, Standard, or Premium tiers. 

### Q: What is the difference between VNet integration in Standard v2 tier and VNet support in the Premium and Premium v2 tiers? 

A: A Standard v2 service instance can be integrated with a VNet to provide secure access to the backends residing there. A Standard v2 service instance integrated with a VNet has a public IP address for inbound access. 

The Premium tier and Premium v2 tier support a fully private integration with a VNet (often referred to as injection into VNet) without exposing a public IP address. [Learn more about networking options in API Management](virtual-network-concepts.md). 

### Q: Can I deploy an instance of the Basic v2 or Standard v2 tier entirely in my VNet? 

A: No, such a deployment is only supported in the Premium and Premium v2 tiers. 

## Related content

* Compare the API Management [tiers](api-management-features.md).
* Learn more about the [API Management gateways](api-management-gateways-overview.md)
* Learn about [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

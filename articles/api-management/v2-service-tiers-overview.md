---
title: Azure API Management - V2 Tiers
description: Introduction to key scenarios, capabilities, and concepts of the v2 tiers (SKUs) of the Azure API Management service. 
services: api-management
author: dlepow
 
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 11/21/2025
ms.author: danlep
ms.custom:
  - references_regions
  - build-2025
---

# Azure API Management v2 tiers

[!INCLUDE [api-management-availability-basicv2-standardv2-premiumv2](../../includes/api-management-availability-basicv2-standardv2-premiumv2.md)]

The API Management v2 tiers (SKUs) are built on a new, more reliable and scalable platform and are designed to make API Management accessible to a broader set of customers and offer flexible options for a wider variety of scenarios. The v2 tiers are in addition to the existing classic tiers (Developer, Basic, Standard, and Premium) and the Consumption tier. [See detailed comparison of API Management tiers](api-management-features.md).

The following v2 tiers are generally available:

* **Basic v2** - The Basic v2 tier is designed for development and testing scenarios, and is supported with an SLA.

* **Standard v2** - Standard v2 is a production-ready tier with support for network-isolated backends.

* **Premium v2** - Premium v2 offers enterprise features including full virtual network isolation, scaling for high volume workloads, availability zones, and workspaces. [Read the blog post](https://techcommunity.microsoft.com/blog/integrationsonazureblog/announcing-the-general-availability-ga-of-the-premium-v2-tier-of-azure-api-manag/4471499) announcing general availability.

## Key capabilities

* **Faster deployment, configuration, and scaling** - Deploy a production-ready API Management instance in minutes. Quickly apply configurations such as certificate and hostname updates. Scale a Basic v2 or Standard v2 instance quickly to up to 10 units to meet the needs of your API management workloads. Scale a Premium v2 instance to up to 30 units.

* **Simplified networking** - The Standard v2 and Premium v2 tiers provide [networking options](#networking-options) to isolate API Management's inbound and outbound traffic.

* **More options for production workloads** - The v2 tiers are all supported with an SLA. 

* **Developer portal options** - Enable the [developer portal](api-management-howto-developer-portal.md) when you're ready to let API consumers discover your APIs. 


## Features

### API version

The latest capabilities of the v2 tiers are supported in API Management API version **2024-05-01** or later.

## Networking options

* **Standard v2** and **Premium v2** support **virtual network integration** to allow your API Management instance to reach API backends that are isolated in a single connected virtual network. The API Management gateway, management plane, and developer portal remain publicly accessible from the internet. The virtual network must be in the same region and subscription as the API Management instance. [Learn more](integrate-vnet-outbound.md).

* **Standard v2** and **Premium v2** also support inbound [private endpoint connections](private-endpoint.md) to the API Management gateway.

* **Premium v2** also supports simplified **virtual network injection** for complete isolation of inbound and outbound gateway traffic without requiring route tables or service endpoints. The virtual network must be in the same region and subscription as the API Management instance. [Learn more](inject-vnet-v2.md).

### Supported regions

For a current list of regions where the v2 tiers are available, see [Availability of v2 tiers and workspace gateways](api-management-region-availability.md).

### Classic feature availability

Most capabilities of the classic API Management tiers are supported directly in the v2 tiers. However, some features have replacements in the v2 tiers, and some currently aren't available. For detailed comparisons, see 

* [Feature-based comparison of the Azure API Management tiers](api-management-features.md)
* [API Management gateways overview](api-management-gateways-overview.md)

#### Features replaced in v2 (with comparable functionality)

| Classic feature | Replacement in v2 |
|---------|-----|
| [Built-in analytics](monitor-api-management.md#legacy-built-in-analytics)  | [Azure Monitor-based dashboard](monitor-api-management.md#get-api-analytics-in-azure-api-management)<sup>1</sup> |
| [CA certificates](api-management-howto-ca-certificates.md) managed in the global certificate list | CA certificates referenced in [backend](backends.md#configure-certificates-for-authorization-credentials) entity |
| [Capacity](api-management-capacity.md#available-capacity-metrics) metric | [CPU Percentage of Gateway and Memory Percentage of Gateway](api-management-capacity.md#available-capacity-metrics) metrics<sup>1</sup> |

<sup>1</sup> Also available in the classic tiers.


#### Currently unavailable features

The following are currently unavailable in the v2 tiers.

**Infrastructure and configuration**
* Multi-region deployment 
* Multiple custom domain names 
* Sending events to Event Grid
* Event Hubs event metrics
* API Management service configuration using Git
* Enabling Azure DDoS Protection
* Direct Management API access
* Back up and restore of API Management instance
* Upgrade to v2 tiers from classic tiers

**Developer portal**
* Reports 
* Custom HTML code widget and custom widget

**Gateway**
* Self-hosted gateway
* Cipher configuration
* Client certificate renegotiation
* Free, managed TLS certificate
* Requests to the gateway over localhost

## Resource limits

The following resource limits apply to the v2 tiers:

* [Resource limits for v2 tiers](/azure/azure-resource-manager/management/azure-subscription-service-limits?toc=%2Fazure%2Fapi-management%2Ftoc.json&bc=%2Fazure%2Fapi-management%2Fbreadcrumb%2Ftoc.json#limits---api-management-v2-tiers)
* [Developer portal limits for v2 tiers](/azure/azure-resource-manager/management/azure-subscription-service-limits?toc=%2Fazure%2Fapi-management%2Ftoc.json&bc=%2Fazure%2Fapi-management%2Fbreadcrumb%2Ftoc.json#limits---developer-portal-in-api-management-v2-tiers)


## Deployment

Deploy a v2 tier instance using the Azure portal or using tools such as the Azure REST API, Azure Resource Manager, Bicep file, or Terraform.

## Frequently asked questions

### Q: Can I migrate from my existing API Management instance to a new v2 tier instance?

A: No. Currently you can't migrate an existing API Management instance (in the Consumption, Developer, Basic, Standard, or Premium tier) to a new v2 tier instance. Currently the v2 tiers are available for newly created service instances only.

### Q: Will I still be able to provision Developer, Basic, Standard, or Premium tier services? 

A: Yes, there are no changes to the classic Developer, Basic, Standard, or Premium tiers. 

### Q: What is the difference between virtual network integration in Standard v2 tier and virtual network injection in the Premium and Premium v2 tiers? 

A: A Standard v2 service instance can be integrated with a virtual network to provide secure access to the backends residing there. A Standard v2 service instance integrated with a virtual network has a public IP address for inbound access. 

The Premium tier and Premium v2 tier support full network isolation by deployment (injection) into a virtual network without exposing a public IP address. [Learn more about networking options in API Management](virtual-network-concepts.md). 

### Q: Can I deploy an instance of the Basic v2 or Standard v2 tier entirely in my virtual network? 

A: No, such a deployment is only supported in the Premium and Premium v2 tiers. 

### Q: What's the relationship between the stv2 compute platform and the v2 tiers?

A: They're not related. stv2 is a compute platform version of the Developer, Basic, Standard, and Premium tier service instances. stv2 is a successor to the stv1 compute platform that retired in 2024.

## Related content

* Compare the API Management [tiers](api-management-features.md).
* Learn more about the [API Management gateways](api-management-gateways-overview.md)
* Learn about [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

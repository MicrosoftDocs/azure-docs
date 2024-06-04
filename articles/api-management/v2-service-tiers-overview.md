---
title: Azure API Management - v2 tiers
description: Introduction to key scenarios, capabilities, and concepts of the v2 tiers (SKUs) of the Azure API Management service. 
services: api-management
author: dlepow
 
ms.service: api-management
ms.topic: conceptual
ms.date: 03/21/2024
ms.author: danlep
ms.custom: references_regions
---

# Azure API Management v2 tiers

[!INCLUDE [api-management-availability-basicv2-standardv2](../../includes/api-management-availability-basicv2-standardv2.md)]

We're introducing a new set of pricing tiers (SKUs) for Azure API Management: the *v2 tiers*. The new tiers are built on a new, more reliable and scalable platform and are designed to make API Management accessible to a broader set of customers and offer flexible options for a wider variety of scenarios. The v2 tiers are in addition to the existing classic tiers (Developer, Basic, Standard, and Premium) and the Consumption tier. [Learn more](api-management-key-concepts.md#api-management-tiers).

The following v2 tiers are generally available:

* **Basic v2** - The Basic v2 tier is designed for development and testing scenarios, and is supported with an SLA.

* **Standard v2** - Standard v2 is a production-ready tier with support for network-isolated backends.

## Key capabilities

* **Faster deployment, configuration, and scaling** - Deploy a production-ready API Management instance in minutes. Quickly apply configurations such as certificate and hostname updates. Scale a Basic v2 or Standard v2 instance quickly to up to 10 units to meet the needs of your API management workloads.

* **Simplified networking** - The Standard v2 tier supports [outbound connections](#networking-options) to network-isolated backends.

* **More options for production workloads** - The v2 tiers are all supported with an SLA. Upgrade from Basic v2 to Standard v2 to add more production options.

* **Developer portal options** - Enable the [developer portal](api-management-howto-developer-portal.md) when you're ready to let API consumers discover your APIs. 

## Networking options

The Standard v2 tier supports VNet integration to allow your API Management instance to reach API backends that are isolated in a single connected VNet. The API Management gateway, management plane, and developer portal remain publicly accessible from the internet. The VNet must be in the same region as the API Management instance. [Learn more](integrate-vnet-outbound.md).

## Features

### API version

The v2 tiers are supported in API Management API version **2023-05-01-preview** or later.

### Supported regions
The v2 tiers are available in the following regions:
* South Central US
* West US
* France Central
* Germany West Central
* North Europe
* West Europe
* UK South
* UK West
* Brazil South
* Australia Central
* Australia East
* Australia Southeast
* East Asia
* Southeast Asia
* Korea Central

### Feature availability

Most capabilities of the classic API Management tiers are supported in the v2 tiers. However, the following capabilities aren't supported in the v2 tiers:

* API Management service configuration using Git
* Back up and restore of API Management instance
* Enabling Azure DDoS Protection
* Built-in analytics (replaced with Azure Monitor-based dashboard)

### Limitations

The following API Management capabilities are currently unavailable in the v2 tiers.

**Infrastructure and networking**
* Zone redundancy 
* Multi-region deployment 
* Multiple custom domain names 
* Capacity metric
* Autoscaling
* Inbound connection using a private endpoint
* Injection in a VNet in external mode or internal mode
* Upgrade to v2 tiers from v1 tiers 
* Workspaces
* CA Certificates

**Developer portal**
* Delegation of user registration and product subscription
* Reports
* Custom HTML code widget and custom widget
* Self-hosted developer portal

**Gateway**
* Self-hosted gateway
* Quota by key policy
* Cipher configuration
* Client certificate renegotiation
* Free, managed TLS certificate
* Request tracing in the test console
* Requests to the gateway over localhost

## Resource limits

The following resource limits apply to the v2 tiers.

[!INCLUDE [api-management-service-limits-v2](../../includes/api-management-service-limits-v2.md)]

## Developer portal limits

The following limits apply to the developer portal in the v2 tiers.

[!INCLUDE [api-management-developer-portal-limits-v2](../../includes/api-management-developer-portal-limits-v2.md)]

## Deployment

Deploy an instance of the Basic v2 or Standard v2 tier using the Azure portal, Azure REST API, or Azure Resource Manager or Bicep template.

## Frequently asked questions

### Q: Can I migrate from my existing API Management instance to a new v2 tier instance?

A: No. Currently you can't migrate an existing API Management instance (in the Consumption, Developer, Basic, Standard, or Premium tier) to a new v2 tier instance. Currently the v2 tiers are available for newly created service instances only.

### Q: What's the relationship between the stv2 compute platform and the v2 tiers?

A: They're not related. stv2 is a [compute platform](compute-infrastructure.md) version of the Developer, Basic, Standard, and Premium tier service instances. stv2 is a successor to the stv1 platform [scheduled for retirement in 2024](./breaking-changes/stv1-platform-retirement-august-2024.md).

### Q: Will I still be able to provision Basic or Standard tier services? 

A: Yes, there are no changes to the Basic or Standard tiers. 

### Q: What is the difference between VNet integration in Standard v2 tier and VNet support in the Premium tier? 

A: A Standard v2 service instance can be integrated with a VNet to provide secure access to the backends residing there. A Standard v2 service instance integrated with a VNet will have a public IP address. The Premium tier supports a [fully private integration](api-management-using-with-internal-vnet.md) with a VNet (often referred to as injection into VNet) without exposing a public IP address. 

### Q: Can I deploy an instance of the Basic v2 or Standard v2 tier entirely in my VNet? 

A: No, such a deployment is only supported in the Premium tier. 

### Q: Is a Premium v2 tier planned?

A: Yes, a Premium v2 preview is planned and will be announced separately.

## Related content

* Compare the API Management [tiers](api-management-features.md).
* Learn more about the [API Management gateways](api-management-gateways-overview.md)
* Learn about [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

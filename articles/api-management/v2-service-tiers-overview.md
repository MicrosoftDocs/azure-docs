---
title: Azure API Management - v2 tiers (preview)
description: Introduction to key scenarios, capabilities, and concepts of the v2 tiers (SKUs) of the Azure API Management service. The v2 tiers are in preview.
services: api-management
author: dlepow
editor: ''
 
ms.service: api-management
ms.topic: conceptual
ms.date: 10/02/2023
ms.author: danlep
ms.custom: references_regions
---

# New Azure API Management tiers (preview)

We're introducing a new set of pricing tiers (SKUs) for Azure API Management: the *v2 tiers*. The new tiers are built on a new, more reliable and scalable platform and are designed to make API Management accessible to a broader set of customers and offer flexible options for a wider variety of scenarios.

Currently in preview, the following v2 tiers are available:

* **Basic v2** - The Basic v2 tier is designed for development and testing scenarios, and is supported with an SLA. In the Basic v2 tier, the developer portal is an optional add-on.

* **Standard v2** - Standard v2 is a production-ready tier with support planned for advanced API Management features previously available only in a Premium tier of API Management, including high availability and networking options.

## Key capabilities

* **Faster deployment, configuration, and scaling** - Deploy a production-ready API Management instance in minutes. Quickly apply configurations such as certificate and hostname updates. Scale a Basic v2 or Standard v2 instance quickly to up to 10 units to meet the needs of your API management workloads.

* **Simplified networking** - The Standard v2 tier supports [outbound connections](#networking-options) to network-isolated backends.

* **More options for production workloads** - The v2 tiers are all supported with an SLA. Upgrade from Basic v2 to Standard v2 to add more production options.

* **Developer portal options** - Enable the [developer portal](api-management-howto-developer-portal.md) when you're ready to let API consumers discover your APIs. The developer portal is included in the Standard v2 tier, and is an add-on in the Basic v2 tier.

## Networking options

In preview, the v2 tiers currently support the following options to limit network traffic from your API Management instance to protected API backends:


* **Standard v2**

    **Outbound** - VNet integration to allow your API Management instance to reach API backends that are isolated in a VNet. The API Management gateway, management plane, and developer portal remain publicly accessible from the internet. The VNet must be in the same region as the API Management instance. [Learn more](integrate-vnet-outbound.md).

    
## Features and limitations

### API version

The v2 tiers are supported in API Management API version **2023-03-01-preview** or later.

### Supported regions

In preview, the v2 tiers are available in the following regions:

* East US
* South Central US
* West US
* France Central
* North Europe
* West Europe
* UK South
* Brazil South
* Australia East
* Australia Southeast
* East Asia

### Feature availability

Most capabilities of the existing (v1) tiers are planned for the v2 tiers. However, the following capabilities aren't supported in the v2 tiers:

* API Management service configuration using Git
* Back up and restore of API Management instance
* Enabling Azure DDoS Protection

### Preview limitations

Currently, the following API Management capabilities are unavailable in the v2 tiers preview and are planned for later release. Where indicated, certain features are planned only for the Standard v2 tier. Features may be enabled during the preview period.


**Infrastructure and networking**
* Zone redundancy (*Standard v2*)
* Multi-region deployment (*Standard v2*)
* Multiple custom domain names (*Standard v2*)
* Capacity metric
* Autoscaling
* Built-in analytics
* Inbound connection using a private endpoint
* Upgrade to v2 tiers from v1 tiers 
* Workspaces

**Developer portal**
* Delegation of user registration and product subscription
* Reports

**Gateway**
* Self-hosted gateway (*Standard v2*)
* Management of Websocket APIs
* Rate limit by key and quota by key policies
* Cipher configuration
* Client certificate renegotiation
* Requests to the gateway over localhost

  > [!NOTE]
  > Currently the policy document size limit in the v2 tiers is 16 KiB.

## Deployment

Deploy an instance of the Basic v2 or Standard v2 tier using the Azure portal, Azure REST API, or Azure Resource Manager or Bicep template.

## Frequently asked questions

### Q: Can I migrate from my existing API Management instance to a new v2 tier instance?

A: No. Currently you can't migrate an existing API Management instance (in the Consumption, Developer, Basic, Standard, or Premium tier) to a new v2 tier instance. Currently the new tiers are available for newly created service instances only.

### Q: What's the relationship between the stv2 compute platform and the v2 tiers?

A: They're not related. stv2 is a [compute platform](compute-infrastructure.md) version of the Developer, Basic, Standard, and Premium tier service instances. stv2 is a successor to the stv1 platform [scheduled for retirement in 2024](./breaking-changes/stv1-platform-retirement-august-2024.md).

### Q: Will I still be able to provision Basic or Standard tier services? 

A: Yes, there are no changes to the Basic or Standard tiers. 

### Q: What is the difference between VNet integration in Standard v2 tier and VNet support in the Premium tier? 

A: A Standard v2 service instance can be integrated with a VNet to provide secure access to the backends residing there. A Standard v2 service instance integrated with a VNet will have a public IP address that can be secured separately, via Private Link, if necessary. The Premium tier supports a [fully private integration](api-management-using-with-internal-vnet.md) with a VNet (often referred to as injection into VNet) without exposing a public IP address. 

### Q: Can I deploy an instance of the Basic v2 or Standard v2 tier entirely in my VNet? 

A: No, such a deployment is only supported in the Premium tier. 

### Q: Is a Premium v2 tier planned?

A: Yes, a Premium v2 preview is planned and will be announced separately.

## Related content

* Learn more about the API Management [tiers](api-management-features.md).



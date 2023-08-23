---
title: Azure API Management - v2 tiers (preview)
description: Introduction to key scenarios, capabilities, and concepts of the v2 tiers (SKUs) of the Azure API Management service. The v2 tiers are in preview.
services: api-management
documentationcenter: ''
author: dlepow
editor: ''
 
ms.service: api-management
ms.topic: overview
ms.date: 08/22/2023
ms.author: danlep
ms.custom: references_regions
---

# Welcome to the v2 tiers of API Management (preview)

We're introducing a new set of pricing tiers (SKUs) for Azure API Management that we've named *v2 tiers*. The v2 tiers of Azure API Management are designed to meet the needs of customers with today's demanding API management workloads. Built on a new platform that provides enhanced performance, reliability, and scale, the v2 tiers offer a range of features and flexible options for many scenarios. 

Currently in preview, the following v2 tiers are available:

* **Basic v2** - The Basic v2 tier is designed for development and testing scenarios, and is supported with an SLA. In the Basic v2 tier, the developer portal is an optional add-on.

* **Standard v2** - Standard v2 is a production-ready tier that supports advanced API Management features previously available only in a Premium tier of API Management, including networking options.

## Key capabilities

* **Faster deployment and scaling** - Deploy a production-ready API Management instance in minutes. Scale up quickly to meet the needs of your API management workloads.

* **Simplified networking** - The v2 tiers support [networking options](#networking-options) to isolate the network traffic to and from your API Management instance. Most networking configurations and dependencies can be managed automatically by the service.

* **Built-in analytics** -  The v2 tiers include built-in analytics based on Azure Log Analytics workbooks.

* **More options for production workloads** - The v2 tiers are all supported with an SLA.

* **Consumption-based pricing** - The v2 tiers are designed for a consumption-based pricing model, based on the number of API calls made through your API Management gateway.

    > [!NOTE]
    > Currently, pricing specifics for the v2 tiers haven't been announced.

<!-- Do we want to provide specifics about change to compute architecture
## Architecture
-->

## Networking options

In preview, the v2 tiers currently support the following options to limit network traffic from your API Management instance:


* **Standard v2**

    **Outbound**: VNet integration to allow your API Management instance to reach API backends that are isolated in a VNet. The API Management gateway, management plane, and developer portal remain publicly accessible from the internet. The VNet must be in the same region as the API Management instance. [Learn more]


<!--Link to networking article?-->

## Features and limitations

<!--Review and confirm all details-->

### API version

The v2 tiers are supported in API Management API version 2023-03-01-preview or later.

### Supported regions

In preview, the v2 tiers are available in the following regions:

* East US
* South Central US
* West US
* France Central
* West Europe
* UK South
* Brazil South
* South Africa North
* Australia East
* Central India
* East Asia

### Feature availability

Most capabilities of the existing (v1) tiers are supported in the v2 tiers. However, the following API Management capabilities that are available in the v1 tiers aren't supported in the v2 tiers:

* API Management service configuration using Git
* Back up and restore
* Enabling Azure DDoS Protection

### Preview limitations

During preview, the following API Management capabilities are currently not available in the v2 tiers. Feature support may be added during the preview period.

* Zone redundancy
* Multi-region deployment
* Autoscaling
* Multiple custom domain names
* Deployment in a VNet in internal mode (VNet injection)
* Delegation in the developer portal
* Management of Websocket APIs
* Management of GraphQL APIs
* Upgrade to v2 tiers from v1 tiers 

## Frequently asked questions

### Q: Can I migrate from my existing API Management instance to a new v2 tier instance?

A: No. Currently you can't migrate an existing API Management instance (in the Consumption, Developer, Standard, or Premium tier) to a new v2 tier instance. You must deploy a completely new instance in the v2 tier.

### Q: What's the relationship between the stv2 compute platform and the v2 tiers?
A: They're not related. API Management's stv2 compute platform is a successor platform version used for the [retirement of the stv1 compute platform](./breaking-changes/stv1-platform-retirement-august-2024.md) in the current Developer, Standard, and Premium tiers. The v2 tiers aren't affected by the retirement of the stv1 compute platform.

### Q: How can I provide feedback?

Provide feedback or report issues in the [v2 tier GitHub repo](https://github.com/Azure/api-management-tiersv2), or send email to apimskv2@microsoft.com.

## Related content

* Learn more about the API Management [tiers](api-management-features.md).
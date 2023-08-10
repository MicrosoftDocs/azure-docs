---
title: Azure API Management - v2 tiers (preview)
description: Introduction to key scenarios, capabilities, and concepts of the v2 tiers of the Azure API Management service. The v2 tiers are in preview.
services: api-management
documentationcenter: ''
author: dlepow
editor: ''
 
ms.service: api-management
ms.topic: overview
ms.date: 08/08/2023
ms.author: danlep
ms.custom: references_regions
---

# Welcome to the v2 tiers of API Management (preview)

We're introducing a new set of pricing tiers (SKUs) for Azure API Management that we've named *v2 tiers*. The v2 tiers of Azure API Management are designed to meet the needs of customers with today's demanding API management workloads. Built on a new platform that provides enhanced performance, reliability, and scale, the v2 tiers offer a range of features and flexible options for many scenarios. 

Currently in preview, the following v2 tiers are available:

* **Basic v2** - The Basic v2 tier is designed for development and testing scenarios, and is supported with an SLA. In the Basic v2 tier, the developer portal is an optional add-on.

* **Standard v2** - Standard v2 is a production-ready tier that supports advanced API Management features previously available only in a Premium tier of API Management, including networking options.

## Key capabilities

* **Faster deployment and scaling** - Deploy a production-ready API Management instance in minutes. Scale up or scale out quickly to meet the needs of your API management workloads.

* **Improved performance** - The v2 tiers are built on a platform that provides enhanced performance, reliability, and scale.

* **Simplified networking** - The v2 tiers support [networking options](#networking-options) to isolate the network traffic to and from your API Management instance. Most networking configurations and dependencies can be managed automatically by the service.

* **Built-in analytics** -  The v2 tiers include built-in analytics based on Azure Log Analytics workbooks.

* **More options for production workloads** - The v2 tiers are all supported with an SLA. You can easily scale out in each tier or scale up to a higher tier as your production workloads grow.

* **Consumption-based pricing** - The v2 tiers use a consumption-based pricing model, based on the number of API calls made through your API Management gateway.

    > [!NOTE]
    > Currently, pricing specifics for the v2 tiers haven't been announced.

<!-- Do we want to provide specifics about change to compute architecture
## Architecture
-->

## Networking options

The v2 tiers support the following options to limit network traffic to and from your API Management instance. Inbound options are from clients to the API Management gateway. Outbound options are from the API Management gateway to backends.

| Option |Basic v2  |Standard v2  |
|---------|---------|---------|
|Inbound     |  Private endpoint to  API Management gateway       | Private endpoint to  API Management gateway        |
|Outbound     | Private endpoint for backends        |   Private endpoint for backends<br/><br/>-OR-<br/><br/>VNet integration     |

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
* Deployment in a VNet in internal mode
* Upgrade to v2 tiers from v1 tiers 


## Next steps

* Learn more about the API Management [tiers](api-management-features.md).
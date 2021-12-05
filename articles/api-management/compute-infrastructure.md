---
title: Azure API Management compute platform
description: Learn about the compute platform used to host your API Management service instance
author: dlepow
ms.service: api-management
ms.topic: conceptual
ms.date: 08/23/2021
ms.author: danlep
ms.custom: 
---
# Compute platform for Azure API Management

As a cloud platform-as-a-service (PaaS), Azure API Management abstracts many details of the infrastructure used to host and run your service. You can create, manage, and scale most aspects of your API Management instance without needing to know about its underlying resources.

To enhance service capabilities, we're upgrading the API Management compute platform version - the Azure compute resources that host the service - for instances in several [service tiers](api-management-features.md). This article gives you context about the upgrade and the major versions of API Management's compute platform: `stv1` and `stv2`.

We've minimized impacts of this upgrade on your operation of your API Management instance. However, if your instance is connected to an [Azure virtual network](virtual-network-concepts.md), you'll need to change some network configuration settings when the instance upgrades to the `stv2` platform version.

## Compute platform versions

| Version | Description | Architecture | API Management tiers |
| -------| ----------| ----------- | ------- |
| `stv2` | Single-tenant v2 | [Virtual machine scale sets](../virtual-machine-scale-sets/overview.md) | Developer, Basic, Standard, and Premium |
| `stv1` |  Single-tenant v1 | [Cloud Service (classic)](../cloud-services/cloud-services-choose-me.md) | Developer, Basic, Standard, and Premium |
| `mtv1` | Multi-tenant v1 |  [App service](../app-service/overview.md) | Consumption |


## How do I know which platform hosts my API Management instance?

### Developer, Basic, Standard, and Premium tiers

* Instances with virtual network connections created or updated using the Azure portal after **April 2021**, or using the API Management REST API version **2021-01-01-preview** or later, are hosted on the `stv2` platform
* If you enabled [zone redundancy](zone-redundancy.md) in your Premium tier instance, it's hosted on the `stv2` platform
* Otherwise, the instance is hosted on the `stv1` platform

> [!TIP]
> Starting with API version `2021-04-01-preview`, the API Management instance has a read-only `PlatformVersion` property that shows this platform information. 

### Consumption tier

* All instances are hosted on the `mtv1` platform

## How do I upgrade to the `stv2` platform? 

Update is only possible for an instance in the Developer, Basic, Standard, or  Premium tier. 

Create or update the virtual network connection, or availability zone configuration, in an API Management instance using:

* [Azure portal](https://portal.azure.com)
* Azure REST API, or ARM template, specifying API version **2021-01-01-preview** or later

> [!IMPORTANT]
> When you update the compute platform version of an instance connected to an Azure [virtual network](virtual-network-concepts.md):
> * You must provide provide a Standard SKU [public IPv4 address](../virtual-network/ip-services/public-ip-addresses.md#standard) resource
> * The VIP address(es) of your API Management instance will change.

## Next steps

* Learn more about using a [virtual network](virtual-network-concepts.md) with API Management.
* Learn more about [zone redundancy](zone-redundancy.md).
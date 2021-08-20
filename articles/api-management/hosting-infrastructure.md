---
title: Azure API Management compute platform
description: Learn about the compute platform used to host your API Management service instance
author: dlepow
ms.service: api-management
ms.topic: conceptual
ms.date: 08/19/2021
ms.author: danlep
ms.custom: 
---
# Compute platform for Azure API Management

As a cloud platform-as-a-service (PaaS), Azure API Management abstracts many details of the infrastructure used to host and run your service. You can create, manage, and scale most aspects of your API Management instance without needing to know about its underlying resources.

API Management occasionally upgrades its compute platform - the underlying compute resources used to run the service. These changes aren't visible to you, but are carried out to deliver new features and improve service performance. This article explains major versions of API Management's compute platform.

## Compute platform versions

| Version | Description | Architecture | API Management tiers |
| -------| ----------| ----------- | ------- |
| **Stv2** | Single-tenant v2 | [Virtual machine scale sets](../virtual-machine-scale-sets/overview.md) | Developer, Basic, Standard, and Premium |
| **Stv1** |  Single-tenant v1 | [Cloud Service (classic)](../cloud-services/cloud-services-choose-me.md) | Developer, Basic, Standard, and Premium |
| **Mtv1** | Multi-tenant v1 |  [App service](../app-service/overview.md) | Consumption only |


## How do I know which platform hosts my API Management instance?

### Developer, Basic, Standard, and Premium tiers

* Instances created or updated using the Azure portal after **April 2021**, or using the API Management REST API version **2021-01-01-preview** or later, are hosted on the **Stv2** platform
* If you enabled [zone redundancy](zone-redundancy.md) in your Premium tier instance, it's hosted on the **Stv2** platform
* Otherwise, the instance is hosted on the **Stv1** platform

> [!TIP]
> Starting with API version 2021-04-01-preview, the API Management instance has a read-only `PlatformVersion` property that shows this platform information. 

### Consumption tier

* All instances are hosted on the **Mtv1** platform

## How do I update to the Stv2 platform? 

Update is only possible for an instance in the Developer, Basic, Standard, or  Premium tier. 

Create an API Management instance, or update an existing instance, using:

* [Azure portal](https://portal.azure.com)
* Azure REST API, or ARM template, specifying API version **2021-01-01-preview** or later

> [!IMPORTANT]
> When you update the compute platform version of an instance connected to an Azure [virtual network](virtual-network-concepts.md):
> * You must provide provide a Standard SKU [public IPv4 address](../virtual-network/public-ip-addresses.md#standard) resource
> * The VIP address(es) of your API Management instance will change.

## Next steps

* Learn more about using a [virtual network](virtual-network-concepts.md) with API Management.
* Learn more about [zone redundancy](zone-redundancy.md).
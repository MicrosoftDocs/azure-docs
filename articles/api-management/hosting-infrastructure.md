---
title: Azure API Management hosting platform
description: Learn about the compute platform used to host your API Management service instance
author: dlepow
ms.service: api-management
ms.topic: conceptual
ms.date: 08/10/2021
ms.author: danlep
ms.custom: 
---
# Hosting platform used for Azure API Management

As a cloud platform-as-a-service (PaaS), Azure API Management abstracts many details of the infrastructure used to host and run your service. You can create, manage, and scale most aspects of your API Management instance without needing to know about, deploy, or upgrade its underlying resources.

API Management occasionally upgrades its hosting platform. These changes generally are not visible to you, but are carried out to deliver new features or to improve service performance. This article explains major versions of API Management's hosting platform.

## Platform versions

| Version | Description | Architecture | API Management SKUs |
| -------| ----------| ----------- | ------- |
| **Stv1** |  Single-tenant v1 | [Cloud Service (classic)](../cloud-services/cloud-services-choose-me.md) | SKUs other than Consumption |
| **Mtv1** |  Multi-tenant v1 |  [App service](../app-service/overview.md) | Consumption only |
| **Stv2** | Single-tenant v2 | [Virtual machine scale sets](../virtual-machine-scale-sets/overview.md) | SKUs other than Consumption 


Currently, only certain features such as [zone redundancy](zone-redundancy.md) (Premium SKU) and some [virtual network options](virtual-network-concepts.md) require your API Management instance to be hosted on the v2 platform.


## How do I know which platform hosts my API Management instance?

* Most instances created before April 2021 are hosted on the v1 platform.
* If you enabled [zone redundancy](zone-redundancy.md) in your Premium tier instance, it's hosted on the v2 platform.
* Instances created or updated using the Azure portal after April 2021, or using the API Management REST API version 2021-01-01-preview or later, are hosted on the v2 platform. 

## How do I update from the v1 to the v2 platform? 

Create an API Management instance, or update an existing instance, using:

* [Azure portal](https://portal.azure.com)
* Azure REST API, or ARM template, specifying API version **2021-01-01-preview** or later

> [!IMPORTANT]
> When you update the hosting platform of an instance connected to an Azure [virtual network](virtual-network-concepts.md):
> * You must provide provide a Standard SKU [public IPv4 address](../virtual-network/public-ip-addresses.md#standard) resource.
> * The VIP address(es) of your API Management instance will change.

## Next steps

* Learn more about using a [virtual network](virtual-network-concepts.md) with API Management.
* Learn more about [zone redundancy](zone-redundancy.md).
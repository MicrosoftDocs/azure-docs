---
title: Azure API Management hosting infrastructure
description: Learn about infrastructure used to host your API Management service instance
author: dlepow

ms.service: api-management
ms.topic: conceptual
ms.date: 08/05/2021
ms.author: danlep
ms.custom: 
---
# Hosting infrastructure used for Azure API Management

As a cloud platform-as-a-service (PaaS), Azure API Management abstracts many details of the infrastructure used to host and run your service. You can create, manage, and scale most aspects of your API Management instance without needing to know about, deploy, or upgrade its compute, network, and storage resources.

API Management occasionally upgrades its hosting infrastructure. These changes generally are not visible to you, but are carried out to deliver new features or to improve service performance. This article explains major versions of API Management's hosting infrastructure.

## Infrastructure versions

| Version | Description | Architecture | API Management SKUs |
| -------| ----------| ----------- | ------- |
| Stv1 |  Single-tenant v1 | [Cloud Service (classic)](../cloud-services/cloud-services-choose-me.md) | SKUs other than Consumption |
| Mtv1 |  Multi-tenant v1 |  [App service](../app-service/overview.md) | Consumption only |
| Stv2 | Single-tenant v2 | [Virtual machine scale sets (VMSS)](../virtual-machine-scale-sets/overview.md) | all } 


Currently, only [zone redundancy](zone-redundancy.md) (Premium SKU) requires your API Management instance to be hosted on the v2 infrastructure.


## How do I know which infratructure hosts my API Management instance?

* Most instances created before April 2021 are hosted on the v1 infrastructure
* If you enabled [zone redundancy](zone-redundancy.md) in your Premium tier instance, it's hosted on v2 infrastrucutre.
* Instances created or updated using the Azure portal after April 2021, or using the API Management REST API version 2021-01-01-preview or later, are hosted on v2 infrastructure. 

## How do I update from the v1 to the v2 infrastructure? 

Create an API Management instance, or update an existing instance, using:

* [Azure portal](https://portal.azure.com)
* Azure REST API, or ARM template, specifying API version **2021-01-01-preview** or later

> [!IMPORTANT]
> If updating an instance connected to an Azure [virtual network](virtual-network-concepts.md), you must provide provide a Standard SKU [public IPv4 address](../virtual-network/public-ip-addresses.md#standard) resource.


## Next steps

* Learn more about using a [virtual network](virtual-network-concepts.md) with API Management.
* 
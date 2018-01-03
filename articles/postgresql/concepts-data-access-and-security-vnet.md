---
title: 'Azure Database for PostgreSQL Server vnet services endpoint overview | Microsoft Docs'
description: 'Describes vnet service endpoints work for your Azure Database for PostgreSQL server.'
services: postgresql
author: mbolz
ms.author: mbolz
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql
ms.topic: article
ms.date: 1/02/2018
---
# Use Virtual Network service endpoints and rules for Azure Database for PostgreSQL

*Virtual network rules* are one firewall security feature that controls whether your Azure Database for PostgreSQL server accepts communications that are sent from particular subnets in virtual networks. This article explains why the virtual network rule feature is sometimes your best option for securely allowing communication to your Azure SQL Database.

To create a virtual network rule, there must first be a [virtual network service endpoint][vm-virtual-network-service-endpoints-overview-649d] for the rule to reference.


> [!NOTE]
> For Azure Database for PostgreSQL, this feature is available in Preview in all regions of Azure public cloud.

<a name="anchor-how-to-links-60h" />

## Related articles

- [Azure virtual network service endpoints][vm-virtual-network-service-endpoints-overview-649d]

<!-- Link references, to text, Within this same Github repo. -->

[vm-virtual-network-service-endpoints-overview-649d]: https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview
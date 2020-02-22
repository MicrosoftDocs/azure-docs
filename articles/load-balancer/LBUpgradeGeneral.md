---
title: Upgrade from Basic to Standard - Azure Load Balancer
description: This article shows you how to upgrade Azure Load Balancer from Basic SKU to Standard SKU
services: load-balancer
author: irenehua
ms.service: load-balancer
ms.topic: article
ms.date: 01/23/2020
ms.author: irenehua
---

# Upgrade Azure Load Balancer from Basic SKU to Standard SKU
[Azure Standard Load Balancer](load-balancer-overview.md) offers a rich set of functionality and high availability through zone redundancy. To learn more about Load Balancer SKU, see [comparison table](https://docs.microsoft.com/azure/load-balancer/concepts-limitations#skus).

## Upgrade overview

An Azure PowerShell script is available that does the following:

* Creates a Standard SKU Load Balancer in the resource group and location the you specify.
* Seamlessly copies the configurations of the Basic SKU Load Balancer to the newly create Standard Load Balancer.

## <a name="scenarios"></a>Scenario overview

Azure Load Balancer and related resources are explicitly defined when you're using [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview).  Azure currently provides three different methods to achieve outbound connectivity for Azure Resource Manager resources. 

| Scenario | Method |
| --- | --- |
| [Upgrading Public Load Balancer](upgrade-basic-standard.md) | Follow the instruction on [this page](upgrade-basic-standard.md) to create a Standard Public Load Balancer with the same configurations as the Basic Public Load Balancer. |
| [Upgrading Internal Load Balancer (No outbound connection required)](upgrade-basicInternal-standard.md) | Follow the instruction on [this page](upgrade-basicInternal-standard.md) to create a Standard Internal Load Balancer with the same configurations as the Basic Public Load Balancer. |
| [Upgrading Internal Load Balancer (Outbound connection required)](load-balancer-outbound-connections.md) | Create a Standard Public Load Balancer with the same configuration with Basic Internal Load Balancer. If you want to block Internet traffic from entering the load balancer, you can configure an [NSG rule](https://docs.microsoft.com/en-us/azure/virtual-network/manage-network-security-group) on VM. |


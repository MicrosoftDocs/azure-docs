---
title: include file
description: include file
services: virtual-network
author: KumudD
ms.service: virtual-network
ms.topic: include
ms.date: 04/21/2020
ms.author: kumud
ms.custom: include file
---


 The following limits apply to Azure private link:

|Resource |Limit |
|---------|---------|
|Number of private endpoints per virtual network     |  1000       |
|Number of private endpoints per subscription       |   64000       |
|Number of private link services per subscription         |   800      |
|Number of private link services per Standard Load Balancer         |   8      |
|Number of IP Configurations on a private link service     |  8 (This number is for the NAT IP addresses used per PLS)       |
|Number of private endpoints on the same private link service   |  1000       |
|Number of subscriptions allowed in visibility setting on private link service   |  100       |
|Number of subscriptions allowed in auto-approval setting on private link service   |  100       |
|Number of private endpoints per key vault | 64 |
|Number of key vaults with private endpoints per subscription | 400 |
|Number of private DNS zone groups that can be linked to a private endpoint | 1 |
|Number of DNS zones in each group | 5 |


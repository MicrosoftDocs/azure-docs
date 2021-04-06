---
title: include file
description: include file
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: include
ms.date: 12/05/2019
ms.author: duau
ms.custom: include file
---


| Gateway SKU | Connections per second | Number of flows | Mega-bits per second | Packets per second | Circuit bandwidth | Number of routes advertised by gateway (to MSEE) | Number of routes learned by gateway (from MSEE) | Number of VMs in the virtual network |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Basic SKU (deprecated)** | N/A | N/A | 500 | N/A | N/A | N/A | N/A | N/A |
| **Standard SKU/ErGw1AZ** | 7,000 | 400,000 | >1,000 | >100,000 | 1 Gbps |  500 | 4,000 | 2,000 (Reduce to 1,000 during maintenance, restores afterward.) | 
| **High Performance SKU/ErGw2AZ** | 14,000 | 840,000 | >2,000 | 250,000 | 1 Gbps | 500 | ~9,500 (Reduce to 4,000 if more than 6,500 VMs are in the virtual network.) | 4,500 |
| **Ultra Performance SKU/ErGw3AZ** | 16,000 | 950,000 | ~10,000 | 1,000,000 | 1 Gbps | 500 | ~9,500 | 11,000 |

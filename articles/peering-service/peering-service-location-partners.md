---
title: 'Create an Azure Peering connection - portal | Microsoft Docs'
description: 
services: networking
documentationcenter: na
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2019
ms.author: v-meravi
---

# Peering Service - Location and Partners

## Who are our Partners?

| **Partners** | **Location**|
|-----------|---------|
| PCCW Global | |
| interCloud  | |
| BT          |  |
| Tata COMMUNICATIONS | |
| Colt |  |

## Requirements from Partners
The table listed below provide an insight to the set of requirements need to be fulfilled by the partners to establish the Peering Service connection.

| **Requirements** | **Why**|
|-----------|---------|
| Partner must establish 1:1 connection in a metro. Each connection needs to originate from different device. | To provide local redundancy |
| Partner must establish peering with Microsoft at multiple metro(locations). | To provide geo redundancy |
| In case, a Partner-Microsoft interconnect node goes down, Partner must route the traffic to Microsoft through alternate sites.| To provide geo redundancy|
|Partner must provide a BGP community tag indicating the routes belong to Peering Service| Identify Peering Service traffic and provide route optimization|
| Partner may provide BW guarantee or QoS through their network for Peering Service traffic.| Strengthens the Peering Service offering |
| Peering Service must be supported through PNI (as opposed to Internet Exchange Peering) |1 hop connectivity  |
| Partner should connect customers to the nearest possible Microsoft edge.| Latency optimization |

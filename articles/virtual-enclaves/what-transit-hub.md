---
title: What is a Transit hub?
description: What is a Transit hub?
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# What is a Transit hub?

A Transit hub establishes a virtual hub within a Community vWAN that serves as a secure tunnel between the Community and an external private network. A Transit Hub can be associated with a Private Network rule within a Community Endpoint to enable Virtual Enclaves to connect to trusted private networks outside of the Community boundary.

## Architecture of a Transit Hub

![Graphic showing example connection through a Transit Hub with a VPN connection to resources external to the Community.](./media/transit-hub-vpn-connection.png)

## Transit hub types

Transit hubs support the following types of secure connectivity:

- VPN Gateway
- ExpressRoute
- vNet Peering

## Next Steps

- [Create a Transit Hub in the Azure portal](./create-transit-hub-azure-portal.md)
- [Create a Community Endpoint in the Azure portal](./create-community-endpoint-azure-portal.md)

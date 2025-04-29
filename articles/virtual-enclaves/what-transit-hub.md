---
title: What is a Transit hub?
description: What is a Transit hub?
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# What is a Transit hub?

A Transit hub establishes a virtual hub within a community vWAN that serves as a secure tunnel between the community and an external private network. A Transit Hub can be associated with a Private Network rule within a community Endpoint to enable Virtual Enclaves to connect to trusted private networks outside of the community boundary.

## Architecture of a Transit Hub

![Diagram showing example connection through a Transit Hub with a VPN connection to resources external to the community.](./media/transit-hub-vpn-connection.png)

## Transit hub types

Transit hubs support the following types of secure connectivity:

- VPN Gateway
- ExpressRoute
- vNet Peering

## Next Steps

- [Create a Transit Hub in the Azure portal](./create-transit-hub-portal.md)
- [Create a community Endpoint in the Azure portal](./create-community-endpoint-portal.md)

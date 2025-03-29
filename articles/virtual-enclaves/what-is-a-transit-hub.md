---
title: What is a Transit hub?
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Overview

A Transit hub establishes a virtual hub within a Community vWAN that serves as a secure tunnel between the Community and an external private network. A Transit Hub can be associated with a Private Network rule within a Community Endpoint to enable Virtual Enclaves to connect to trusted private networks outside of the Community boundary.

## Architecture of a transit hub

![image](/assets/image-transithub1.png)

## Transit hub types

Transit hubs support the following types of secure connectivity:

- VPN Gateway
- ExpressRoute
- vNet Peering

## Next Steps

- [Create a Transit Hub in the Azure Portal](/docs/How%20To%20Guides/Create%20a%20Transit%20Hub%20from%20the%20Azure%20Portal)
- [Create a Community Endpoint in the Azure Portal](/docs/How%20To%20Guides/Create%20a%20Community%20Endpoint%20in%20the%20Azure%20Portal)

---
title: Azure Orbital Ground Stations - About Microsoft and partner ground stations
description: Provides specs on Microsoft ground stations and outlines partner ground station network.
author: kellydevens
ms.service: orbital
ms.topic: how-to
ms.custom: ga
ms.date: 10/20/2023
ms.author: kellydevens
#Customer intent: As a satellite operator or user, I want to learn about Microsoft and partner ground stations.
---

# About Microsoft and partner ground stations

## Microsoft ground stations

Microsoft owns and operates five ground stations around the world.

:::image type="content" source="./media/ground-station-map.png" alt-text="Diagram shows a world map with the five Azure Orbital Ground Station sites labeled.":::

Our antennas are 6.1 meters in diameter and support the following frequency bands for commercial satellites:

| Ground Station             | X-band Downlink (MHz) | S-band Downlink (MHz) | S-band Uplink (MHz) | 
|----------------------------|-----------------------|-----------------------|---------------------|
| Quincy, WA, USA            | 8025-8400             |                       | 2025-2110           | 
| Longovilo, Chile           | 8025-8400             | 2200-2290             | 2025-2110           |
| Singapore                  | 8025-8400             | 2200-2290             | 2025-2110           |
| Johannesburg, South Africa | 8025-8400             | 2200-2290             | 2025-2110           |
| Gavle, Sweden              | 8025-8400             | 2200-2290             | 2025-2110           |

In addition, we support public satellites for downlink-only operations that utilize frequencies between 7800-8025 MHz.

## Partner ground stations

Azure Orbital Ground Station offers a common data plane and API to access all antenna in the global network. An active contract with the partner network(s) you wish to integrate with Azure Orbital Ground Station is required to onboard with a partner. Once you have the proper contract(s) and regulatory approval(s) in place, your subscription is approved to access partner ground station sites by the Azure Orbital Ground Station team. Learn how to [request authorization of a spacecraft](register-spacecraft.md#request-authorization-of-the-new-spacecraft-resource) and [configure a contact profile](concepts-contact-profile.md#configuring-a-contact-profile-for-applicable-partner-ground-stations) for partner ground stations.

## Next steps

- [Get started with Azure Orbital Ground Station](get-started.md)
- [Support all mission phases](mission-phases.md)

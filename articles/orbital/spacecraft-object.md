---
title: Spacecraft resource - Azure Orbital Ground Station
description: Learn about how you can represent your spacecraft details in Azure Orbital Ground Station.
author: hrshelar
ms.service: orbital
ms.topic: conceptual
ms.custom: ga
ms.date: 07/13/2022
ms.author: hrshelar
#Customer intent: As a satellite operator or user, I want to understand what the spacecraft resource does so I can manage my mission.
---

# Spacecraft resource

Learn about how you can represent your spacecraft details in Azure Orbital Ground Station.

## Spacecraft parameters

The spacecraft resource captures three types of information:
- **Ephemeris** - The latest spacecraft TLE to predict the position and velocity of the satellite.
- **Links** - RF details on center frequency, bandwidth, direction, and polarization for each link.
- **Authorizations** - Regulatory authorizations are held on a per-link, per-site basis.

### Ephemeris

The spacecraft ephemeris is captured in Azure Orbital Ground Station using a Two-Line Element, or TLE. 

A TLE is associated with the spacecraft to determine contact opportunities at the time of scheduling. The TLE is also used to determine the path the antenna must follow during the contact as the spacecraft passes over the ground station during contact execution.

As TLEs are prone to expiration, the user must keep the TLE up-to-date using the [TLE update](update-tle.md) procedure. A TLE that is more than two weeks old might result in an unsuccessful contact.

### Links

Make sure to capture each link that you wish to use with Azure Orbital Ground Station when you create the spacecraft resource. The following details are required:

| **Field**        | **Values**                     |
|------------------|--------------------------------|
| Direction        | Uplink or Downlink             |
| Center Frequency | Center frequency in MHz        |
| Bandwidth        | Bandwidth in MHz               |
| Polarization     | RHCP, LHCP, or Linear Vertical |

Dual polarization schemes are represented by two individual links with their respective LHCP and RHCP polarizations.

### Authorizations

In order to uphold regulatory requirements across the world, the spacecraft resource contains authorizations for specific links and sites that permit usage of the Azure Orbital Ground Station sites.

The platform will deny scheduling or execution of contacts if the spacecraft resource links aren't authorized. The platform will also deny contact if a profile contains links that aren't included in the spacecraft resource authorized links.

Learn how to [initiate ground station licensing](initiate-licensing.md) and [authorize a spacecraft resource](register-spacecraft.md).

## Create a spacecraft resource

Learn how to [create and authorize a spacecraft resource](register-spacecraft.md) in the Azure portal or Azure Orbital Ground Station API.

## Modify or delete spacecraft resources

Spacecraft resources can be modified and deleted via the Azure portal or the Azure Orbital Ground Station API. Once the spacecraft resource is created, modification to the resource is dependent on the authorization status:
- When the spacecraft is **unauthorized**, the spacecraft resource can be modified. The [API](/rest/api/orbital/azureorbitalgroundstation/spacecrafts/create-or-update/) is the recommended way to update the spacecraft resource as the [Azure portal](https://aka.ms/orbital/portal) only allows for TLE updates.
- After the spacecraft is **authorized**, [TLE updates](update-tle.md) are the only modifications possible. Other fields, such as links, become immutable.

To delete the spacecraft resource, you must first delete all scheduled contacts associated with that spacecraft resource. See [contact resource](concepts-contact.md) for more information.

To delete a spacecraft via the [Azure portal](https://aka.ms/orbital/portal), navigate to the spacecraft resource. Click 'Overview' on the left panel, then click 'Delete.' Alternatively, use the Spacecrafts REST Operation Group to [delete a spacecraft](/rest/api/orbital/azureorbitalgroundstation/spacecrafts/delete/) with the Azure Orbital Ground Station API.

## Next steps

- [Create and authorize a spacecraft resource](register-spacecraft.md)

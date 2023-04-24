---
title: Spacecraft object - Azure Orbital
description: Learn about how you can represent your spacecraft details in Azure Orbital.
author: hrshelar
ms.service: orbital
ms.topic: conceptual
ms.custom: ga
ms.date: 07/13/2022
ms.author: hrshelar
#Customer intent: As a satellite operator or user, I want to understand what the spacecraft object does so I can manage my mission.
---

# Spacecraft object

Learn about how you can represent your spacecraft details in Azure Orbital Ground Station.

## Spacecraft details

The spacecraft object captures three types of information:

- **Links** - RF details on center frequency, direction, and bandwidth for each link.
- **Ephemeris** - The latest spacecraft TLE.
- **Licensing** - Authorizations held on a per-link, per-site basis.

### Links

Make sure to capture each link that you wish to use with Azure Orbital Ground Station when you create the spacecraft object. The following details are required:

| **Field**        | **Values**                     |
|------------------|--------------------------------|
| Direction        | Uplink or Downlink             |
| Center Frequency | Center frequency in MHz        |
| Bandwidth        | Bandwidth in MHz               |
| Polarization     | RHCP, LHCP, or Linear Vertical |

Dual polarization schemes are represented by two individual links with their respective LHCP and RHCP polarizations.

### Ephemeris

The spacecraft ephemeris is captured in Azure Orbital Ground Station using the Two-Line Element, or TLE. 

A TLE is associated with the spacecraft to determine contact opportunities at the time of scheduling. The TLE is also used to determine the path the antenna must follow during the contact as the spacecraft passes over the ground station during contact execution.

As TLEs are prone to expiration, the user must keep the TLE up-to-date using the [TLE update](update-tle.md) procedure. A TLE that is more than two weeks old might result in an unsuccessful contact.

### Licensing

In order to uphold regulatory requirements across the world, the spacecraft object contains authorizations on a per-link and per-site level that permits usage of the Azure Orbital Ground Station sites.

The platform will deny scheduling or execution of contacts if the spacecraft object links are not authorized. The platform will also deny contact if a profile contains links that are not included in the spacecraft object authorized links.

For more information, see the [spacecraft authorization and ground station licensing](register-spacecraft.md) documentation.

## Create spacecraft resource

For more information on how to create a spacecraft resource, see the details listed in the [register a spacecraft](register-spacecraft.md) article.

## Managing spacecraft objects

Spacecraft objects can be created and deleted via the Portal and Azure Orbital Ground Station APIs. Once the object is created, modification to the object is dependent on the authorization status.

When the spacecraft is unauthorized, then the spacecraft object can be modified. The API is the best way to make changes to the spacecraft object as the Portal only allows TLE updates.

Once the spacecraft is authorized, TLE updates are the only modifications possible. Other fields, such as links, become immutable. The TLE updates are possible via the Portal and Orbital API.

## Delete spacecraft resource

You can delete the spacecraft object via the Portal or the API. See [How-to: Delete Contact](delete-contact.md).

## Next steps

- [Register a spacecraft](register-spacecraft.md)

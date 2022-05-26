---
title: Spacecraft Object - Azure Orbital
description: Learn about how you can represent your spacecraft details in Azure Orbital.
author: hrshelar
ms.service: orbital
ms.topic: conceptual
ms.custom: ga
ms.date: 05/26/2022
ms.author: hrshelar

---

# Spacecraft Object

Learn about how you can represent your spacecraft details in Azure Orbital. 

## Spacecraft details

The spacecraft object is used to capture the following three main types of information:

1. **Links** - RF details on center frequency, direction, and bandwidth for each link.
1. **Ephemeris** - The latest TLE.
1. **Licensing** - Authorizations held on a per link per ground station basis.

### Links

Make sure to capture each link that you wish to use with Azure Orbital at time of spacecraft object creation. The following is required:

   | **Field** | **Values** |
   | --- | --- |
   | Direction | Uplink or Downlink |
   | Center Frequency | Center frequency in MHz |
   | Bandwidth | Bandwidth in MHz |
   | Polarization | RHCP, LHCP, or Linear Vertical |

Dual polarization schemes are represented by two links with their respective LHCP and RHCP polarizations.

### Ephemeris

The spacecraft ephemeris is captured in Azure Orbital using the Two-Line Element or TLE. 

A TLE is associated with the spacecraft to determine contact opportunities at time of scheduling. The TLE is also used to determine the path the antenna must follow during the contact as the spacecraft passes over the groundstation during contact execution.

As TLEs are prone to expiration the user must keep the TLE up-to-date using the [TLE update](update-tle.md) procedure.

<!-- Licensing or Authorization? -->
### Authorization

 In order to uphold regulatory requirements across the world the spacecraft object contains authorizations on a per link and per site level that permit usage of the Azure Orbital groundstation sites.

The platform will deny scheduling or execution of contacts if none of the spacecraft object links are authorized or if the requested contact profile contains links that are not included in the spacecraft object authorized links.

Please refer to [Licensing](concepts-licensing.md) for more information on this.

## Managing Spacecraft Objects

Spacecraft objects can be created and deleted via the Portal and Azure Orbital SDKs. Once the object is created, modification to the object is dependant on the authorization status.

When the spacecraft is unauthorized then the spacecraft object can be modified. The SDK is the best way to make changes as the Portal only lets you make TLE updates.

When the spacecraft is unauthorized then TLE updates are the only modifications possible. Other fields such as links become immutable. The TLE updates are possible via the Portal and Orbital SDK.

<!-- What are the portal flows?
Insert link
-->

The Portal flows are shown below. Please refer to (link here) for the SDK usage.

<!-- Note: This section is duplicated from register-spacecraft.md. Should it be?
Also, does the portal show Spacecraft or Spacecrafts? The docs currently use both singular and plural. -->
### Create spacecraft resource

1. In the Azure portal search box, enter **Spacecraft**. Select **Spacecraft** in the search results.
2. In the **Spacecraft** page, select Create.
3. In **Create spacecraft resource**, enter or select this information in the Basics tab:

   | **Field** | **Value** |
   | --- | --- |
   | Subscription | Select your subscription |
   | Resource Group | Select your resource group |
   | Name | Enter spacecraft name |
   | Region | Select **West US 2** |
   | NORAD ID | Enter NORAD ID |
   | TLE title line | Enter TLE title line |
   | TLE line 1 | Enter TLE line 1 |
   | TLE line 2 | Enter TLE line 2 |

   > [!NOTE]
   > TLE stands for Two-Line Element.

   :::image type="content" source="media/orbital-eos-register-bird.png" alt-text="Register Spacecraft Resource Page" lightbox="media/orbital-eos-register-bird.png":::

4. Select the **Links** tab, or select the **Next: Links** button at the bottom of the page.
5. In the **Links** page, enter or select this information:

   | **Field** | **Value** |
   | --- | --- |
   | Direction | Select Uplink or Downlink |
   | Center Frequency | Enter the center frequency in Mhz |
   | Bandwidth | Enter the bandwidth in Mhz |
   | Polarization | Select RHCP, LHCP, or Linear Vertical |

   :::image type="content" source="media/orbital-eos-register-links.png" alt-text="Spacecraft Links Resource Page" lightbox="media/orbital-eos-register-links.png":::

6. Select the **Review + create** tab, or select the **Review + create** button.
7. Select **Create**

### Modify spacecraft resource

Please refer to [Update TLE](update-tle.md) to make changes to the TLE.

Please use the SDK to make changes to the links.

### Delete spacecraft resource

1. In the Azure portal search box, enter the name of the Spacecraft object you wish to delete and pull up the object.
1. Click delete and confirm the action. (to add screen shots)


## Next steps

- [Register a spacecraft](register-spacecraft.md)

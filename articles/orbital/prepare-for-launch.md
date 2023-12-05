---
title: Azure Orbital Ground Station - Prepare for launch and early operations
description: Learn how to get ready for Launch with Azure Orbital.
author: hrshelar
ms.service: orbital
ms.topic: how-to
ms.custom: ga
ms.date: 10/12/2023
ms.author: hrshelar
---

# Prepare for launch and early operations

Follow these steps to get ready for an upcoming satellite launch and acquire your satellite with Azure Orbital Ground Station.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Contributor permissions at the subscription level.
- A [Basic Support Plan](https://azure.microsoft.com/support/plans/) or higher to submit a spacecraft authorization request.
- Private spacecraft: an active satellite license. In certain countries including the United States, authorization for market access (or a waiver of the United States’ market access rules) is required for satellites not licensed in the country.
- Private spacecraft: added as a point of communication to Microsoft and/or Partner ground stations. For more information, see [initiate ground station licensing](initiate-licensing.md).
- A [contact profile resource](concepts-contact-profile.md)

## Compatibility testing

Compatibility testing is an important risk reduction process in the launch campaign. Azure Orbital Ground Station provides two options to perform compatibility testing.

### Option 1 - Buy your own set of equipment for your lab

This option is preferred if you're standing up a new satellite constellation and plan to periodically launch satellites. By procuring your own lab equipment, you can fully verify all aspects of RF functionality.

We can connect you with our digitizer and software modem partner, [Kratos](https://www.kratosdefense.com/products/space/signals/signal-processing). Relevant equipment could include [wideband and narrowband digitizers](https://www.kratosdefense.com/products/space/networks/network-devices/spectralnet?r=krtl), a [wideband software receiver](https://www.kratosdefense.com/products/space/signals/signal-processing/quantumrx), and a [virtualized narrowband modem](https://www.kratosdefense.com/products/space/satellites/ttc-devices-and-software/quantumradio).

### Option 2 - Use our Free Professional Services

Depending on your scenario, it might be impractical for you to obtain your own lab equipment. We can help through our Free Professional Services program at no additional cost.

This option is evaluated on a case-by-case basis, so reach out to the Azure Orbital Ground Station team to learn more. A typical offering is shown below:

For each channel, we execute a replay of a customer furnished RF test vector in our lab against flight-like equipment.
1. The customer provides RF test vectors in raw 32-bit I/Q format or bitstream test vectors in a raw format.
1. Our team provides a capture of the system output of the other end of the RF chain. Expect a 21 day turn around time.
1. We can repeat Steps 1 and 2 up to two more times to eliminate any bugs.

## Acquisition of satellite after launch vehicle separation

Satellites typically don't have accurate [TLEs](spacecraft-object.md#ephemeris) before and shortly after launch, and contact windows can shift as the TLE estimates improve. In order to accommodate this uncertainty, Azure Orbital Ground Station supports a Launch Window Scheduling feature in Preview. This feature allows you to reserve contact windows for this critical mission phase ahead of launch without requiring an accurate satellite TLE. You can provide as many TLE updates as needed until five minutes ahead of the scheduled contact start time.

Our team enables the Launch Window Scheduling feature manually on a per-spacecraft basis, so contact Azure Orbital Ground Station to request this Preview feature for your upcoming launch campaign.

The following outlines a typical contact scheduling flow when using Launch Window Scheduling:
1. You don't need an accurate TLE to schedule a contact. [Update the spacecraft resource](update-tle.md) with the best estimate TLE.
1. Specify the time window of interest for your contact by adjusting the **Start Time** and **End Time** fields in the [List Available Contacts API](https://learn.microsoft.com/rest/api/orbital/azureorbitalgroundstation/spacecrafts/list-available-contacts?view=rest-orbital-azureorbitalgroundstation-2022-11-01&tabs=HTTP) or [Portal contact scheduling flow](schedule-contact.md). To account for the unpredictability of launch and vehicle separation, we recommend your window include additional time before and after the anticipated satellite pass.
1. The service returns contact options if a whole window or partial window is available in your specified block.
1. [Schedule the contact](schedule-contact.md) as normal.

   > [!NOTE]
   > [TLE updates](update-tle.md) for Launch Window Scheduling contacts are performed the same way as regular contacts. The TLE will lock five minutes before the start time of a Launch Window Schedule contact. The ground station antenna will use this TLE and move when it computes the satellite is ascending above the minimum elevation.

## Next steps

- [Schedule a contact](schedule-contact.md)
- [Update the spacecraft TLE](update-TLE.md)
- [Receive real-time antenna telemetry](receive-real-time-telemetry.md)
- [Use Azure Resource Graph queries](resource-graph-samples.md)

---
title: Ground station contact profile - Azure Orbital GSaaS
description: Learn more about the contact profile object, including how to create, modify, and delete the profile.
author: hrshelar
ms.service: orbital
ms.topic: conceptual
ms.custom: ga
ms.date: 06/21/2022
ms.author: hrshelar
#Customer intent: As a satellite operator or user, I want to understand how to use the contact profile so that I can take passes using the GSaaS service.
---

# Ground station contact profile

The contact profile object stores pass requirements such as links and endpoint details for each link. Use this object with the spacecraft object at time of scheduling to view and schedule available passes.

You can create many contact profiles to represent different types of passes depending on your mission operations. For example, you can create a contact profile for a command and control pass or a contact profile for a downlink only pass. 

These objects are mutable and don't undergo an authorization process like the spacecraft objects do. One contact profile can be used with many spacecraft objects. 

See [how to configure a contact profile](contact-profile.md) for the full list of parameters.

## Prerequisites 

- Subnet that is created in the VNET and resource group you desire. See [Prepare network for Orbital GSaaS integration.](howto-prepare-network.md)

## Creating a contact profile 

Follow the steps in [how to create a contact profile.](contact-profile.md). 

## Adjusting pass parameters

Specify a minimum pass time to ensure passes of a certain duration. Specify a minimum elevation to ensure passes above a certain elevation.

The two parameters above are used by the service to schedule passes accordingly. We recommend keeping these fields static per use case and avoid changing these on a pass-by-pass basis. 

## Understanding links and channels

A whole band, unique in direction, and unique in polarity is called a link. Channels, which are children under links, specify center frequency, bandwidth, and endpoints. Typically there is only one channel per link but some applications require multiple channels per link. Refer to the Ground Station manual for a full list of supported bands and antenna capabilities.

Look at the example below to see how to specify a RHCP channel and an LHCP channel if your mission requires dual-polarization on downlink.  

Look at the example below to see how to specify an S-band uplink and an S-band downlink.


## Modifying or deleting a contact profile

You can modify or delete the contact profile via the Portal or through the API.

## Configuring contact profile for third party ground stations

When you onboard a third party network you will receive a token that identifies your profile. Use this token in the object to link a contact profile to the third party network.

## Next steps

- [Quickstart: Schedule a contact](schedule-contact.md)
- [How to: Update the Spacecraft TLE](update-tle.md)


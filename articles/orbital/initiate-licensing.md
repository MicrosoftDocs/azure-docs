---
title: Azure Orbital Ground Station - Initiate ground station licensing
description: How to initiate ground station licensing
author: kellydevens
ms.service: orbital
ms.topic: how-to
ms.custom: ga
ms.date: 10/12/2023
ms.author: kellydevens
#Customer intent: As a satellite operator or user, I want to learn about ground station licensing.
---

# Initiate ground station licensing

## About satellite and ground station licensing

Both satellites and ground stations require authorizations from federal regulators and other government agencies to operate.

Azure Orbital Ground Station consists of five first-party, Microsoft-owned ground stations and networks of third-party Partner ground stations. Except in South Africa, adding a new satellite point of communication to licensed Microsoft ground stations requires an authorization from the respective federal regulator. While the specifics of obtaining authorization vary by geography, coordination with incumbent users is always required.

- If you're interested in contacting [select **public** satellites supported by Azure Orbital Ground Station](https://learn.microsoft.com/azure/orbital/modem-chain#named-modem-configuration), Microsoft has already completed all regulatory requirements to add these satellite points of communication to all Microsoft ground stations.

- If you're interested in having your **existing** satellite space station or constellation communicate with one or more Microsoft ground stations, you must modify your authorization for the US market to add each ground station.

- If you're interested in having your **planned** satellite space station or constellation communicate with one or more Microsoft ground stations, each ground station must be referenced in the technical exhibits accompanying your US license (or market access) application. As the US application process can be lengthy due to the required coordination with federal users in the X- and S-bands, we recommend you start at least one year ahead of launch if possible.

If you are seeking a new or modified satellite license, Azure Orbital Ground Station provides your in-house or outside counsel with geo-coordinates and technical information for each Microsoft ground station. Similarly, we require information from your satellite space station or constellation license application in order to complete our applications to modify our first-party ground station licenses and add new satellite points of communication. If you plan to use Partner network ground stations, work with the Partner's regulatory team to ensure their ground station authorizations are updated for use with your spacecrafts.

## Coordination during the authorization process

During the process of licensing new satellite space stations, applications sometimes need to be amended or modified. It's important that the satellite operator keeps Microsoft and Partner ground station operators informed of these changes as soon as possible. Delays in the regulatory review process are more likely if the information in the satellite operator’s license application regarding Microsoft and Partner ground stations don't match the information in the respective ground station licenses. Likewise, delays can occur if the information in an application to add a new satellite point of communication to Microsoft or Partner ground stations does not match the information in the current satellite license application.

## Costs

Satellite operators are responsible for all costs associated with obtaining satellite space station or constellation licenses. 

The costs associated with ground station license are defined in your agreement with Azure Orbital Ground Station and/or the Partner ground station network.

## Enforcement

Satellite operators are responsible for complying with the conditions and restrictions in their satellite licenses. 

When you're ready to use Azure Orbital Ground Station, you should [create a spacecraft resource](register-spacecraft.md). Here, you're required to provide your authorizations on a per-link and per-site level.

The platform denies scheduling or execution of contacts if the [spacecraft resource](spacecraft-object.md) links aren't authorized. The platform denies a contact if a [contact profile resource](concepts-contact-profile.md) contains links that aren't included in the spacecraft object authorized links.

## Next steps

- [Register a spacecraft](register-spacecraft.md)
- [Configure a contact profile](contact-profile.md)

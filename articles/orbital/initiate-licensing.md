---
title: Azure Orbital Ground Station - initiate ground station licensing
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

Satellites and ground stations require authorizations from federal regulators and other government agencies to operate. If you're contacting [select public satellites supported by Azure Orbital Ground Station](https://learn.microsoft.com/azure/orbital/modem-chain#named-modem-configuration), Microsoft has already completed all regulatory requirements. If you're planning to launch a private satellite, we recommend that you hire outside counsel to assist you in filing with the appropriate regulators. The application process can be lengthy, so we recommend you start one year ahead of launch.

During the satellite licensing application process, Azure Orbital Ground Station provides the technical information for the ground station portion of your satellite license request. We require information from your satellite license to modify our ground station licenses and authorize your satellite for use with Microsoft ground stations. Similarly, if you plan to use partner network ground stations, work with the partner's regulatory team ensure their ground stations are updated for use with your spacecraft.

If your spacecraft is already licensed and in orbit, you must still work with Azure Orbital Ground Station and partner teams to update all relevant ground station licenses. Contact Microsoft as soon as you have an idea of which ground stations you might use.

## Coordination

Coordination is required between regulators and outside counsel as well as between regulators and various government entities to avoid interference between radio frequencies. These entities include the International Telecommunication Union (ITU) and armed forces for the relevant country.

The license application may need to be resubmitted based on feedback obtained during the coordination phase. If you have to update your satellite license request, you also need to inform the regulatory teams updating the ground station licenses. 

## Costs

Regulators have filing fees for obtaining licenses; usually the authorizations aren't released until payment is made. In addition to the filing fees, there are fees for outside counsel. Satellite operators are responsible for all costs associated with obtaining the satellite licenses. 

The costs associated with ground station license are defined in your agreement with Azure Orbital Ground Station and/or the partner ground station network.

## Enforcement

Satellite operators are responsible for complying with their satellite licenses. 

When you're ready to use Azure Orbital Ground Station, you should [create a spacecraft resource](register-spacecraft.md). Here, you're required to provide your authorizations on a per-link and per-site level.

The platform denies scheduling or execution of contacts if the [spacecraft resource](spacecraft-objects.md) links aren't authorized. The platform denies a contact if a [contact profile resource](concepts-contact-profile.md) contains links that aren't included in the spacecraft object authorized links.

## Next steps

- [Register a spacecraft](register-spacecraft.md)
- [Configure a contact profile](contact-profile.md)

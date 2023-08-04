---
title: Get Started with Azure Orbital Ground Station
description: How to get started with Azure Orbital Ground Station.
author: kellydevens
ms.service: orbital
ms.topic: overview
ms.custom: ga
ms.date: 8/4/2023
ms.author: kellydevens
# Customer intent: As a satellite operator, I want to learn how to get started with Azure Orbital Ground Station.
---

# Get Started with Azure Orbital Ground Station

Azure Orbital Ground Station can be used to communicate with a private satellite or a selection of public satellites.

## Learn about resources

Azure Orbital Ground Station uses three different types of resources:
- [Spacecraft](https://learn.microsoft.com/azure/orbital/spacecraft-object)
- [Contact profile](https://learn.microsoft.com/azure/orbital/concepts-contact-profile)
- [Contact](https://learn.microsoft.com/azure/orbital/concepts-contact)

You need to create each of these resources before you can successfully contact your satellite. Click the links to learn more about each of these resources.

A spacecraft object is a representation of your satellite in Azure Orbital Ground Station and stores links, ephemeris, and licensing information. A contact profile stores pass requirements such as links, channels, and network endpoint details.
Contacts are scheduled at a designated time for a particular combination of a spacecraft and contact profile. When you schedule a contact for a spacecraft, a contact object is created under your spacecraft object in your resource group.

## 1. Register a spacecraft

[Register a spacecraft](https://learn.microsoft.com/azure/orbital/register-spacecraft) to add it to your subscription. This process includes creating the spacecraft resource and requesting authorization to use this spacecraft according to the spacecraft and ground station licenses.

   > [!NOTE] 
   > Before spacecraft resources can be created and authorized for private satellites, proper regulatory licenses for both satellites and relevant ground stations must be obtained.

## 2. Prepare the network

[Set up your network](https://learn.microsoft.com/azure/orbital/prepare-network) by preparing your subnet for VNET injection, setting the endpoints, and ensuring your objects are configured correctly.

## 3. Integrate partner networks

If you're using one of Azure Orbital Ground Station's partner ground station networks, [integrate the partner network](https://learn.microsoft.com/azure/orbital/partner-network-integration)

## 4. Configure the modem

[Configure the RF chain](https://learn.microsoft.com/azure/orbital/modem-chain), choosing to utilize a managed modem or virtual RF.

## 5. Set up telemetry

Use Azure EventHubs to [set up real-time antenna telemetry](https://learn.microsoft.com/azure/orbital/receive-real-time-telemetry).

## 6. Configure a contact profile

[Configure a contact profile](https://learn.microsoft.com/azure/orbital/contact-profile) for your spacecraft.

## 7. Schedule a contact

[Schedule a contact](https://learn.microsoft.com/azure/orbital/schedule-contact) for a particular spacecraft and contact profile.
If needed, you can [cancel a contact](https://learn.microsoft.com/azure/orbital/delete-contact).

## 8. Update spacecraft TLE

[Update your spacecraft's TLE](https://learn.microsoft.com/azure/orbital/update-tle) to ensure it remains current.

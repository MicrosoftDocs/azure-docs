---
title: Why use Azure Orbital?
description: Azure Orbital is a cloud-based ground station as a Service that allows you to streamline your operations by ingesting space data directly into Azure.
author: wamota
ms.service: orbital
ms.topic: overview
ms.custom: ga
ms.date: 07/13/2022
ms.author: wamota
# Customer intent: As a satellite operator, I want to ingest data from my satellite into Azure.
---

# Why use Azure Orbital?

Azure Orbital is a fully managed cloud-based ground station as a service that allows you to streamline your operations by ingesting space data directly into Azure. 

With Azure Orbital, you can focus on your missions by off-loading the responsibility for deployment and maintenance of ground stations. 

Azure Orbital uses Microsoft’s global infrastructure and low-latency global network along with an expansive partner ecosystem of ground station networks, cloud modems, and "Telemetry, Tracking, & Control" (TT&C) functions.

:::image type="content" source="./media/orbital-all-overview.png" alt-text="Azure Orbital Overview":::

Azure Orbital offers two main services:

## Azure Orbital Earth Observation

   Schedule contacts with satellites on a pay-as-you-go basis to ingest data from the satellite, monitor the satellite health and status, or transmit commands to the satellite. Incoming data is delivered to your private virtual network allowing it to be processed or stored in Azure.
   
   The fully digitized service allows you to use software modems from Kratos and Amergint to do the modulation / demodulation, and encoding / decoding functions to recover the data. 

   For a full end-to-end solution to manage fleet operations and "Telemetry, Tracking, & Control" (TT&C) functions, seamlessly integrate your Azure Orbital operations with Kubos Major Tom. Lower your operational costs and maximize your capabilities by using Azure Space.

   * Spacecraft contact self-service scheduling
   * Direct data ingestion into Azure
   * Marketplace integration with third-party data processing and image calibration services
   * Integrated cloud modems for X and S bands and Certified cloud modems available through the Azure Marketplace
   * Global reach through integrated third-party networks

## Azure Orbital Global Communications

   Satellite operators who provide global communication capabilities to their customers can route their traffic through the Microsoft global network. 

   They can offer private connection to their customer's virtual network, or offer other managed services to their customers by connecting them to the operator's virtual network. 

   In addition, all internet traffic destined to Microsoft services (including Office365, Microsoft Teams, Xbox, Azure public IPs) can be routed directly within region and without traversing an ISP. It can reduce the amount of traffic going towards the internet and provide lower latency access to these services.

   Operators can colocate new ground stations at Azure data centers or at Azure Edges, or inter-connect existing ground stations with the global Azure backbone.

   Azure Orbital delivers the traffic from an Orbital ground station to your virtual network, enabling you to bundle and provide managed security and connectivity services to your end-customers.

   * Routing over global Microsoft network
   * Internet breakout at the edge
   * Traffic delivery to provider’s virtual network
   * Service chain other Azure services to provide managed services
   * Private connection to customer's virtual network

## Next steps

- [Register Spacecraft](register-spacecraft.md)
- [Configure a Contact Profile](contact-profile.md)
---
title: Why use Azure Orbital Ground Station?
description: Azure Orbital Ground Station is a cloud-based ground station as a service that allows you to streamline your operations by ingesting space data directly into Azure.
author: apoorvanori
ms.service: orbital
ms.topic: overview
ms.custom: ga
ms.date: 12/06/2022
ms.author: apoorvanori
# Customer intent: As a satellite operator, I want to ingest data from my satellite into Azure.
---

# Why use Azure Orbital Ground Station?

Azure Orbital Ground Station is a fully managed cloud-based ground station as a service that allows you to streamline your operations by ingesting space data directly into Azure. 

With Azure Orbital Ground Station, you can focus on your missions by off-loading the responsibility for deployment and maintenance of ground stations. 

Azure Orbital Ground Station uses Microsoft’s global infrastructure and low-latency global network along with an expansive partner ecosystem of ground station networks, cloud modems, and "Telemetry, Tracking, & Control" (TT&C) functions.

:::image type="content" source="./media/orbital-all-overview.png" alt-text="Azure Orbital Ground Station overview":::

## Earth Observation with Azure Orbital Ground Station

Schedule contacts with satellites on a pay-as-you-go basis to ingest data from satellites, monitor satellite health and status, or transmit commands to satellites. Incoming data is delivered to your private virtual network allowing it to be processed or stored in Azure.
   
The fully digitized service allows you to use managed software modems from Kratos to do the modulation / demodulation, and encoding / decoding functions to recover the data. Alternatively, choose to leverage virtual RF and GNU Radio to send raw RF signal directly to your VM for processing.

For a full end-to-end solution to manage fleet operations and "Telemetry, Tracking, & Control" (TT&C) functions, seamlessly integrate your Azure Orbital Ground Station operations with Kubos Major Tom. Lower your operational costs and maximize your capabilities by using Azure Space.

   * Spacecraft contact self-service scheduling
   * Direct data ingestion into Azure
   * Marketplace integration with third-party data processing and image calibration services
   * Integrated cloud modems for X and S bands
   * Global reach through first-party and integrated third-party networks

:::image type="content" source="./media/ground-station-map.png" alt-text="Azure Orbital Ground Station site map":::

## Links to learn more
- [Overview, features, security, and FAQ](https://azure.microsoft.com/products/orbital/#layout-container-uid189e)
- [Pricing](https://azure.microsoft.com/pricing/details/orbital/)
- [Microsoft Learn training session](/training/modules/introduction-to-ground-station/)
- [Azure Space Blog](https://techcommunity.microsoft.com/t5/azure-space-blog/bg-p/AzureSpaceBlog)
- [General Availability press announcement](https://azure.microsoft.com/blog/new-azure-space-products-enable-digital-resiliency-and-empower-the-industry/)

## Next steps

- [Register Spacecraft](register-spacecraft.md)
- [Configure a Contact Profile](contact-profile.md)

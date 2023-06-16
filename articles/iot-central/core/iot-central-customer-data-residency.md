---
title: Customer data residency in Azure IoT Central
description: This article describes customer data residency in Azure IoT Central applications and how it relates to Azure geographies.
author: dominicbetts
ms.author: dobett
ms.date: 06/12/2023
ms.topic: conceptual
ms.service: iot-central
services: iot-central
---

# Azure IoT Central customer data residency​

IoT Central doesn't store customer data outside of the customer specified geography except for the following scenarios:

- When a new user is added to an existing IoT Central application, the user's email ID may be stored outside of the geography until the invited user accesses the application for the first time.

- IoT Central dashboard map tiles use [Azure Maps](../../azure-maps/about-azure-maps.md). When you add a map tile to an existing IoT Central application, the location data may be processed or stored in accordance with the geolocation rules of the Azure Maps service.

- IoT Central uses the Device Provisioning Service (DPS) internally. DPS uses the same device provisioning endpoint for all provisioning service instances, and performs traffic load balancing to the nearest available service endpoint. As a result, authentication secrets may be temporarily transferred outside of the region where the DPS instance was initially created. However, once the device is connected, the device data flows directly to the original region of the DPS instance.

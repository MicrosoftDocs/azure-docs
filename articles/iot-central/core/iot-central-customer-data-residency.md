---
title: Customer data residency in Azure IoT Central | Microsoft Docs
description: This article describes customer data residency in Azure IoT Central applications.
author: dominicbetts
ms.author: dobett
ms.date: 11/02/2020
ms.topic: conceptual
ms.service: iot-central
services: iot-central
---

# Azure IoT Central customer data residency​

IoT Central does not store customer data outside of the customer specified geography except for the following scenarios:

- When a new user is added to an existing IoT Central application, the user's email ID may be stored outside of the geography until the invited user accesses the application for the first time.

- IoT Central dashboard map tiles use [Azure Maps](../../azure-maps/about-azure-maps.md). When you add a map tile to an existing IoT Central application, the location data may be processed or stored in accordance with the geolocation rules of the Azure Maps service.

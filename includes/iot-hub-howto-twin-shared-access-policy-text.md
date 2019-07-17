---
title: include file
description: include file
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: include
ms.date: 07/17/2019
ms.author: robinsh
ms.custom: include file
---
<!-- This contains intro text for the "Get an IoT hub connection string" section in the iot-hub-lang-lang-twin-getstarted.md files-->

In this article, you create a backend service that adds desired properties to a device twin and then queries the identity registry to find all devices with reported properties that have been updated accordingly. To modify desired properties of a device twin your service needs the **service connect** permission. To query the identity registry, your service needs the **registry read** permission. There is no default shared access policy that contains only these two permissions, so you need to create one.

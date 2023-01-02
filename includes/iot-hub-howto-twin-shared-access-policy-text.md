---
title: include file
description: include file
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: include
ms.date: 08/07/2019
ms.author: kgremban
ms.custom: include file
---
<!-- This contains intro text for the "Get an IoT hub connection string" section in the iot-hub-lang-lang-twin-getstarted.md files-->

In this article, you create a back-end service that adds desired properties to a device twin and then queries the identity registry to find all devices with reported properties that have been updated accordingly. Your service needs the **service connect** permission to modify desired properties of a device twin, and it needs the **registry read** permission to query the identity registry. There is no default shared access policy that contains only these two permissions, so you need to create one.

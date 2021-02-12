---
title: Understand Device Update for Azure IoT Hub resources | Microsoft Docs
description: Understand Device Update for Azure IoT Hub resources
author: vimeht
ms.author: vimeht
ms.date: 2/11/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---


# Device update resources

## Device update account

A Device Update account is a resource that is created within your Azure subscription. At the Device Update account level,
you can select the region where your Device Update account will be created and set permissions to authorize users that 
will have access to Device Update.


## Device update instance
After an account has been created, a Device Update instance must be created. An instance is a logical container that contains
updates and deployments associated with a specific IoT hub. Device Update uses IoT hub as a device directory, and a communication channel with devices. 
A single Device update account can be created per subscription, and two device update instances can be created with an account.

---
title: Azure IoT Edge overview | Microsoft Docs
description: Overview of the Azure IoT Edge service
services: iot-Edge
documentationcenter: ''
author: kgremban
manager: timlt
editor: fsautomata

ms.assetid:
ms.service: iot-hub
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/10/2017
ms.author: kgremban
ms.custom: 
---

# Empower devices on the edge to do more with Azure IoT Edge

Azure IoT Edge is an Internet of Things (IoT) service that builds on top of IoT Hub. This service is meant for customers who want to analyze data on devices, a.k.a. "at the edge", instead of in the cloud. By moving parts of your workload to the edge, your devices can spend less time sending messages to the cloud and react more quickly to changes in status. 

Azure IoT Edge was designed to give your IoT solution:

* **Composability** - Reusable components can be mixed, matched, and customized to address your specific needs. 
* **Manageability** - A cloud interface enables you to manage edge software and configuration without having to physically access your devices.
* **Symmetry** - The same Azure components that you use to process your data in the cloud can be run at the edge. 
* **Resiliency** - Operations continue to run, even when your devices are disconnected from the cloud, and communications are stored until the devices are back online. 
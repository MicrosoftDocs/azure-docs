---
title: Set up device for IoT DPS | Microsoft Docs
description: Set up device to provision via IoT DPS during manufacturing process
services: iot-dps
keywords: 
author: dsk-2015
ms.author: dkshir
ms.date: 08/23/2017
ms.topic: tutorial
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Set up a device to provision using Azure IoT DPS

In the previous tutorial, you learned how to set up the Azure IoT DPS to automatically provision your devices to your IoT hub. This tutorial provides guidance for setting up your device during the manufacturing process, so that you can configure the IoT DPS for your device based on its [Hardware Security Module (HSM)]https://azure.microsoft.com/blog/azure-iot-supports-new-security-hardware-to-strengthen-iot-security/), and the device can connect to the IoT DPS when it boots for the first time. Using a device simulator, this tutorial shows you how to:

> [!div class="checklist"]
> * Select a Hardware Security Module
> * Implement security mechanism
> * Extract the security artefacts
> * Set up DPS configuration on the device


## Select a Hardware Security Module

[Azure IoT DPS client SDK](https://github.com/Azure/azure-iot-device-auth/tree/master/dps_client) provides support for 2 types of Hardware Security Modules: 

- [Trusted Platform Module (TPM)](https://en.wikipedia.org/wiki/Trusted_Platform_Module)
- X.509 based security modules

A device to be provisioned by IoT DPS should have one of these HSM chips built into them. DPS client is also 

<--?
You select the HSM for your chip. 
Build the SDK for the type of HSM you are using. 

App programmer will call into same functions so they don't see the difference. 

The registration part of the SDK does not have to be part of the OS - either an app or a service, (probably triggered) after the OS boots. 

Current support is Windows and Linux, since the SDK is in C so portable. Java (a big ask) and Python (since it's a wrapper on C code) next - for GA. Node & C# are still in discussion.



-->

## Implement security mechanism


## Extract the security artefacts


## Set up DPS configuration on the device


## Clean up resources
<----! ToDo: Clean up or delete any Azure work that may incur costs --->

## Next steps
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Select a Hardware Security Module
> * Implement security mechanism
> * Extract the security artefacts
> * Set up DPS configuration on the device

Advance to the next tutorial to learn how to provision the device to your IoT hub by enrolling it to IoT DPS for auto-provisioning.

> [!div class="nextstepaction"]
> [Provision the device to your IoT hub](tutorial-provision-device-to-hub.md)


<---! ToDo: 
Rules for screenshots:
- Use default Public Portal colors
- Browser included in the first shot (especially) but all shots if possible
- Resize the browser to minimize white space
- Include complete blades in the screenshots
- Linux: Safari – consider context in images
Guidelines for outlining areas within screenshots:
	- Red outline #ef4836
	- 3px thick outline
	- Text should be vertically centered within the outline.
	- Length of outline should be dependent on where it sits within the screenshot. Make the shape fit the layout of the screenshot.
-->
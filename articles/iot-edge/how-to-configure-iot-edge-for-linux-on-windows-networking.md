---
title: Networking for Azure IoT Edge for Linux on Windows | Microsoft Docs
description: Learn about how to configure custom networking for Azure IoT Edge for Linux on Windows virtual machine.
author: PatAltimore
manager: kgremban
ms.author: fcabrera
ms.date: 03/21/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Networking configuration for Azure IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-all-supported](../../includes/iot-edge-version-all-supported.md)]

To connect the IoT Edge for Linux on Windows (EFLOW) virtual machine to connect over a network to your host, to other virutal machines on your host, and to other devices/locations on an external network, the virtual machine networking must be configured accordingly. 

The easiest way to establish basic networking on Windows Client SKUs is by using the **Default Switch**, which is already created by the Hyper-V feature. However, on Windows Server SKUs devices, networking it's a bit more complicated as there's no Default Switch available.  

For more information about EFLOW netowrking concepts, see [IoT Edge for Linux on Winodws netowrking](./nested-virtualization.md). 

This article will provide users clarity on which networking option is best for their scenario and provide insight into configuration requirements.

## Configure virtual machine networking

The first step before deploying the EFLOW virutal machine, is to determine which type of virutal switch will be used. For more information, see [EFLOW virutal switch choices](./nested-virtualization.md).




## Next steps

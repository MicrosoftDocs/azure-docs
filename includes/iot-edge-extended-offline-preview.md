---
title: include file
description: iot edge 
author: kgremban
manager: timlt
# this is the PM responsible
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 09/18/2018
ms.author: kgremban
---

## Enabling extended offline operation (Preview)
Starting with the [v1.0.2 release](https://aka.ms/edge102) of the Edge Runtime, the Edge device and downstream devices connecting to it can be configured for extended offline operation. 

With this capability, local modules or downstream devices can re-authenticate with the Edge device as needed and communicate with each other using messages and methods even when disconnected from the IoT Hub. See this [blog post](https://aka.ms/iot-edge-offline) and [concept article](../articles/iot-edge/offline-capabilities.md) for more details and scope of this capability.

For enabling extended offline in a gateway scenario establish a parent-child relationship between edge device and downstream devices that will connect to it.

1. From the Edge device details blade in the IoT Hub portal, click the **Manage Child Devices (preview)** button in the top command bar.

1. Click the **+ Add** button.

1. From the devices list, select the child devices and use the right arrow to pick the ones to add as children.

1. Click **OK** to confirm.

1. In the **Set Modules** screen from the Edge device details, click **Configure advanced Edge Runtime settings**, and under **Edge Hub** environment variables add an entry **UpstreamProtocol** with value **MQTT**. Add the same environment variable and value for the **Edge Agent** as well. 

1. Click **Save** and be sure to **Submit** the changes after clicking **Next** two times.

The Edge device and its child devices are now enabled for extended offline operation.  
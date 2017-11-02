---
title: Deploy, monitor modules for Azure IoT Edge | Microsoft Docs 
description: Manage the modules that run on edge devices
services: iot-edge
keywords: 
author: kgremban
manager: timlt

ms.author: kgremban
ms.date: 10/05/2017
ms.topic: article
ms.service: iot-edge

---

# Deploy and monitor IoT Edge modules at scale

Azure IoT Edge enables you to move analytics to the edge and provides a cloud interface so that you can manage and monitor your IoT Edge devices without having to physically access each one. The capability to remotely manage devices is increasingly important as Internet of Things solutions are growing larger and more complex. Azure IoT Edge is designed to support your business goals, no matter how many devices you add.

You can manage individual devices and deploy modules to them one at a time. However, if you want to make changes to devices at a large scale, you can create an **IoT Edge deployment**. Deployments are dynamic processes that enable you to deploy multiple modules to multiple devices at once, track the status and health of the modules, and make changes when necessary. 

## Identify devices using tags

Before you can create a deployment, you have to be able to specify which devices you want to affect. Azure IoT Edge identifies devices using **tags** in the device twin. Each device can have multiple tags, and you can define them any way that makes sense for your solution. For example, if you manage a campus of smart buildings, you may add the following tags to a device:

```json
"tags":{
    "location":{
        "building": "20",
        "floor": "2"
    },
    "roomtype": "conference",
    "environment": "prod"
}
```

For more information about device twins and tags, see [Understand and use device twins in IoT Hub][lnk-device-twin].

## Create a deployment

1. Sign in to the [Azure portal][lnk-portal] and navigate to your IoT hub. 
1. Select **IoT Edge Explorer**.
1. Select **Create Edge Deployment**.

There are five steps to create a deployment. The following sections walk through each one. 

### Step 1: Add modules

### Step 2: Specify routes

### Step 3: Target devices

### Step 4: Label deployment (optional)

### Step 5: Review template



<!-- Links -->
[lnk-device-twin]: ../iot-hub/iot-hub-devguide-device-twins
[lnk-portal]: https://portal.azure.com

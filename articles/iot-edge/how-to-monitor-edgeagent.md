---
title: Built-in edgeAgent direct methods - Azure IoT Edge
description: Monitor and manage an IoT Edge deployment using built-in direct methods in the IoT Edge agent runtime module
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 01/31/2020
ms.topic: conceptual
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
---

# Communicate with edgeAgent using built-in direct methods

Monitor and manage IoT Edge deployments by using the direct methods included in the IoT Edge agent module. Direct methods are implemented on the device, and then can be invoked from the cloud. The IoT Edge agent includes direct methods that help you monitor and manage your IoT Edge devices remotely.

For more information about direct methods, how to use them, and how to implement them in your own modules, see [Understand and invoke direct methods from IoT Hub](../iot-hub-devguide-direct-methods.md).

## Ping

The **ping** method is useful for checking whether IoT Edge is running on a device, or whether the device has an open connection to ioT Hub. Use this direct method to ping the IoT Edge agent and get its status. A successful ping returns an empty payload and **"status": 200**.

For example:

```cli
az iot hub invoke-module-method --method-name "ping" -n <hub name> -d <device name> -m '$edgeAgent'
```

In the Azure portal, invoke the method with the method name **ping** and an empty json payload **{}**.

![Invoke direct method 'ping' in Azure portal](./media/how-to-monitor-edgeagent/ping-direct-method.png)

## Restart module

## Experimental methods

## Next steps

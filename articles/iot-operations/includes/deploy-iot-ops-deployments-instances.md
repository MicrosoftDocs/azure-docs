---
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: include
ms.custom: include file
ms.date: 11/18/2025
---

This article discusses Azure IoT Operations *deployments* and *instances*, which are two different concepts:

* An Azure IoT Operations *deployment* describes all of the components and resources that enable the Azure IoT Operations scenario. These components and resources include:
  * An Azure IoT Operations instance
  * Arc extensions
  * Custom locations
  * Resources that you can configure in your Azure IoT Operations solution, like assets and devices.

* An Azure IoT Operations *instance* is the parent resource that bundles the suite of services that are defined in [What is Azure IoT Operations?](../overview-iot-operations.md) like MQTT broker, data flows, and connector for OPC UA.

When we talk about deploying Azure IoT Operations, we mean the full set of components that make up a *deployment*. Once the deployment exists, you can view, manage, and update the *instance*.

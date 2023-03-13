---
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.topic: include
ms.date: 01/30/2023
---

Back-end apps can use Azure IoT Hub primitives, such as [device twins](../articles/iot-hub/iot-hub-devguide-device-twins.md) and [direct methods](../articles/iot-hub/iot-hub-devguide-direct-methods.md), to remotely start and monitor device management actions on devices. This article shows you how a back-end app and a device app can work together to initiate and monitor a remote device reboot using IoT Hub.

[!INCLUDE [iot-hub-basic](iot-hub-basic-whole.md)]

Use a direct method to initiate device management actions (such as reboot, factory reset, and firmware update) from a back-end app in the cloud. The device is responsible for:

* Handling the method request sent from IoT Hub.

* Initiating the corresponding device-specific action on the device.

* Providing status updates through *reported properties* to IoT Hub.

You can use a back-end app in the cloud to run device twin queries to report on the progress of your device management actions.
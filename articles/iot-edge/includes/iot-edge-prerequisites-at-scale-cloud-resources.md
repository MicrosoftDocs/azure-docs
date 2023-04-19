---
ms.topic: include
ms.date: 10/29/2021
author: PatAltimore
ms.author: patricka
ms.service: iot-edge
services: iot-edge
---

### Cloud resources

* An active IoT hub
* An instance of the IoT Hub device provisioning service in Azure, linked to your IoT hub
  * If you don't have a device provisioning service instance, you can follow the instructions in the [Create a new IoT Hub device provisioning service](/azure/iot-dps/quick-setup-auto-provision#create-a-new-iot-hub-device-provisioning-service) and [Link the IoT hub and your device provisioning service](/azure/iot-dps/quick-setup-auto-provision#link-the-iot-hub-and-your-device-provisioning-service) sections of the IoT Hub device provisioning service quickstart.
  * After you have the device provisioning service running, copy the value of **ID Scope** from the overview page. You use this value when you configure the IoT Edge runtime.

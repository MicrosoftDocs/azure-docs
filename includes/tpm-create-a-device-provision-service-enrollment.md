---
ms.topic: include
ms.date: 10/29/2021
author: kgremban
ms.author: kgremban
ms.service: iot-edge
services: iot-edge
---

## Create a device provisioning service enrollment

Use your TPM's provisioning information to create an individual enrollment in the device provisioning service.

When you create an enrollment in the device provisioning service, you have the opportunity to declare an **Initial Device Twin State**. In the device twin, you can set tags to group devices by any metric used in your solution, like region, environment, location, or device type. These tags are used to create [automatic deployments](../articles/iot-edge/how-to-deploy-at-scale.md).

> [!TIP]
> The steps in this article are for the Azure portal, but you can also create individual enrollments by using the Azure CLI. For more information, see [az iot dps enrollment](/cli/azure/iot/dps/enrollment). As part of the CLI command, use the **edge-enabled** flag to specify that the enrollment is for an IoT Edge device.

1. In the [Azure portal](https://portal.azure.com), go to your instance of the IoT Hub device provisioning service.

1. Under **Settings**, select **Manage enrollments**.

1. Select **Add individual enrollment**, and then complete the following steps to configure the enrollment:

   1. For **Mechanism**, select **TPM**.

   1. Provide the **Endorsement key** and **Registration ID** that you copied from your VM or physical device.

   1. Provide an ID for your device if you want. If you don't provide a device ID, the registration ID is used.

   1. Select **True** to declare that your VM or physical device is an IoT Edge device.

   1. Choose the linked IoT hub that you want to connect your device to, or select **Link to new IoT Hub**. You can choose multiple hubs, and the device will be assigned to one of them according to the selected assignment policy.

   1. Add a tag value to the **Initial Device Twin State** if you want. You can use tags to target groups of devices for module deployment. For more information, see [Deploy IoT Edge modules at scale](../articles/iot-edge/how-to-deploy-at-scale.md).

   1. Select **Save**.

Now that an enrollment exists for this device, the IoT Edge runtime can automatically provision the device during installation.

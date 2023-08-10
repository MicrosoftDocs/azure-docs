---
author: kgremban
ms.service: iot-dps
ms.topic: include
ms.date: 03/09/2023
ms.author: kgremban
---

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Device Provisioning Service instance.

1. Select **Manage enrollments** from the **Settings** section of the navigation menu.

1. Select the **Individual enrollments** tab, then select **Add individual enrollment**.

   :::image type="content" source="../articles/iot-dps/media/how-to-manage-enrollments/add-individual-enrollment.png" alt-text="Screenshot that shows the add individual enrollment option.":::

1. On the **Registration + provisioning** of the **Add enrollment** page, provide the following information to configure the enrollment details:

   | Field | Description |
   | :--- | :--- |
   | **Attestation** | Select **Symmetric key** as the **Attestation mechanism**. |
   | **Symmetric key settings** | Check the **Generate symmetric keys automatically** box if you want to use randomly generated keys. Uncheck this box if you want to provide your own keys. |
   | **Registration ID** | Provide a unique registration ID for the device.|
   | **Provisioning status** | Check the **Enable this enrollment** box if you want this enrollment to be available to provision its device. Uncheck this box if you want the enrollment to be disabled. You can change this setting later. |
   | **Reprovision policy** | Choose a reprovision policy that reflects how you want DPS to handle devices that request reprovisioning. For more information, see [Reprovision policies](../articles/iot-dps/concepts-device-reprovision.md#reprovision-policies). |

1. Select **Next: IoT hubs**.

1. On the **IoT hubs** tab of the **Add enrollment** page, provide the following information to determine which IoT hubs the enrollment can provision devices to:

   | Field | Description |
   | :---- | :---------- |
   | **Target IoT hubs** |Select one or more of your linked IoT hubs, or add a new link to an IoT hub. To learn more about linking IoT hubs to your DPS instance, see [How to link and manage IoT hubs](../articles/iot-dps/how-to-manage-linked-iot-hubs.md).|
   | **Allocation policy** | If you selected more than one linked IoT hub, select how you want to assign devices to the different hubs. To learn more about allocation policies, see [How to use allocation policies](../articles/iot-dps/how-to-use-allocation-policies.md).<br><br>If you selected only one linked IoT hub, we recommend using the **Evenly weighted distribution** policy.|

1. Select **Next: Device settings**

1. On the **Device settings** tab of the **Add enrollment** page, provide the following information to define how newly provisioned devices will be configured:

   | Field | Description |
   | :---- | :---------- |
   | **Device ID** | Provide a device ID that will be assigned to the provisioned device in IoT Hub. If you don't provide a device ID, the registration ID will be used. |
   | **IoT Edge** | Check the **Enable IoT Edge on provisioned devices** if the provisioned device will run [Azure IoT Edge](../articles/iot-edge/about-iot-edge.md). Uncheck this box if this enrollment is for a non-IoT Edge-enabled device. |
   | **Device tags** | Use this text box to provide any tags that you want to apply to the device twin of the provisioned device. |
   | **Desired properties** | Use this text box to provide any desired properties that you want to apply to the device twin of the provisioned device. |

   For more information, see [Understand and use device twins in IoT Hub](../articles/iot-hub/iot-hub-devguide-device-twins.md).

1. Select **Next: Review + create**.

1. On the **Review + create** tab, verify all of your values then select **Create**.

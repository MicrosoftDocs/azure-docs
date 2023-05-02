---
author: kgremban
ms.service: iot-dps
ms.topic: include
ms.date: 03/28/2023
ms.author: kgremban
---

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Device Provisioning Service instance.

1. Select **Manage enrollments** from the **Settings** section of the navigation menu.

1. Select **Add enrollment group**.

1. On the **Registration + provisioning** tab of the **Add enrollment group** page, provide the following information to configure the enrollment group details:

   | Field | Description |
   | :--- | :--- |
   | **Attestation** |Select **Symmetric key** as the **Attestation mechanism**.|
   | **Symmetric key settings** |Check the **Generate symmetric keys automatically** box if you want to use randomly generated keys. Uncheck this box if you want to provide your own keys. |
   | **Group name** | Provide a name for the group of devices. The enrollment group name is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`).|
   | **Provisioning status** | Check the **Enable this enrollment** box if you want this enrollment group to be available to provision devices. Uncheck this box if you want the group to be disabled. You can change this setting later. |
   | **Reprovision policy** | Choose a reprovision policy that reflects how you want DPS to handle devices that request reprovisioning. For more information, see [Reprovision policies](../articles/iot-dps/concepts-device-reprovision.md#reprovision-policies) |

   :::image type="content" source="../articles/iot-dps/media/how-to-manage-enrollments/add-enrollment-group-symmetric-key.png" alt-text="Screenshot that shows adding an enrollment group for symmetric key attestation.":::

1. Select **Next: IoT hubs**.

1. On the **IoT hubs** tab of the **Add enrollment group** page, provide the following information to determine which IoT hubs the enrollment group can provision devices to:

   | Field | Description |
   | :---- | :---------- |
   | **Target IoT hubs** |Select one or more of your linked IoT hubs, or add a new link to an IoT hub. To learn more about linking IoT hubs to your DPS instance, see [How to link and manage IoT hubs](../articles/iot-dps/how-to-manage-linked-iot-hubs.md).|
   | **Allocation policy** | If you selected more than one linked IoT hub, select how you want to assign devices to the different hubs. To learn more about allocation policies, see [How to use allocation policies](../articles/iot-dps/how-to-use-allocation-policies.md).<br><br>If you selected only one linked IoT hub, we recommend using the **Evenly weighted distribution** policy.|

   :::image type="content" source="../articles/iot-dps/media/how-to-manage-enrollments/add-enrollment-group-key-linked-hub.png" alt-text="Screenshot that shows connecting IoT hubs to the new enrollment group.":::

1. Select **Next: Device settings**

1. On the **Device settings** tab of the **Add enrollment group** page, provide the following information to define how newly provisioned devices will be configured:

   | Field | Description |
   | :---- | :---------- |
   | **IoT Edge** | Check the **Enable IoT Edge on provisioned devices** if all the devices provisioned through this group will run [Azure IoT Edge](../articles/iot-edge/about-iot-edge.md). Uncheck this box if this group is for non-IoT Edge-enabled devices only. Either all devices in a group will be IoT Edge-enabled or none can be. |
   | **Device tags** | Use this text box to provide any tags that you want to apply to the device twins of provisioned devices. |
   | **Desired properties** | Use this text box to provide any desired properties that you want to apply to the device twins of provisioned devices. |

   For more information, see [Understand and use device twins in IoT Hub](../articles/iot-hub/iot-hub-devguide-device-twins.md).

1. Select **Next: Review + create**.

1. On the **Review + create** tab, verify all of your values then select **Create**.

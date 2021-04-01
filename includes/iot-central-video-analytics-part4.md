---
 title: include file
 description: include file
 services: iot-central
 author: dominicbetts
 ms.service: iot-central
 ms.topic: include
 ms.date: 10/06/2020
 ms.author: dobett
 ms.custom: include file
---

### Publish the device template

Before you can add a device to the application, you must publish the device template:

1. In the **LVA Edge Gateway v2** device template, select **Publish**.

1. On the **Publish this device template to the application** page, select **Publish**.

**LVA Edge Gateway v2** is now available as device type to use on the **Devices** page in the application.

## Migrate the gateway device

The existing **gateway-001** device uses the **LVA Edge Gateway** device template. To use your new deployment manifest, migrate the device to the new device template:

To migrate the **gateway-001** device:

1. Navigate to the **Devices** page and select the **gateway-001** device to highlight it in the list.

1. Select **Migrate**. If the **Migrate** icon isn't visible, select **...** to see more options.

    :::image type="content" source="media/iot-central-video-analytics-part4/migrate-device.png" alt-text="Migrate the gateway device to a new version":::

1. In the list on the **Migrate** dialog, select **LVA Edge Gateway v2**, and then select **Migrate**.

After a few seconds, the migration completes. Your device is now using the **LVA Edge Gateway v2** device template with your customized deployment manifest.

There are now no devices using the original **LVA Edge Gateway** device template. Delete this device template:

1. Navigate to the **Device templates** page and select the **LVA Edge Gateway** device template.

1. Select **Delete** to delete the device template.

### Get the device credentials

You need the credentials that allow the device to connect to your IoT Central application. The get the device credentials:

1. On the **Devices** page, select the **gateway-001** device.

1. Select **Connect**.

1. On the **Device connection** page, make a note in the *scratchpad.txt* file of the **ID Scope**, the **Device ID**, and the device **Primary Key**. You use these values later.

1. Make sure the connection method is set to **Shared access signature**.

1. Select **Close**.


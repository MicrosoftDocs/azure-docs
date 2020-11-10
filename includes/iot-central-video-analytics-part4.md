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

### Get the device credentials

You need the credentials that allow the device to connect to your IoT Central application. The get the device credentials:

1. On the **Devices** page, select the **gateway-001** device.

1. Select **Connect**.

1. On the **Device connection** page, make a note in the *scratchpad.txt* file of the **ID Scope**, the **Device ID**, and the device **Primary Key**. You use these values later.

1. Make sure the connection method is set to **Shared access signature**.

1. Select **Close**.

## Next steps

You've now created an IoT Central application using the **Video analytics - object and motion detection** application template, created a device template for the gateway device, and added a gateway device to the application.

If you want to try out the video analytics - object and motion detection application using IoT Edge modules running a cloud VM with simulated video streams:

> [!div class="nextstepaction"]
> [Create an IoT Edge instance for video analytics (Linux VM)](../articles/iot-central/retail/tutorial-video-analytics-iot-edge-vm.md)

If you want to try out the video analytics - object and motion detection application using IoT Edge modules running a real device with real **ONVIF** camera:

> [!div class="nextstepaction"]
> [Create an IoT Edge instance for video analytics (Intel NUC)](../articles/iot-central/retail/tutorial-video-analytics-iot-edge-nuc.md)

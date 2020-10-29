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

### Add relationships

In the **LVA Edge Gateway** device template, under **Modules/LVA Edge Gateway Module**, select **Relationships**. Select **+ Add relationship** and add the following two relationships:

|Display Name               |Name          |Target |
|-------------------------- |------------- |------ |
|LVA Edge Motion Detector   |Use default   |LVA Edge Motion Detector Device |
|LVA Edge Object Detector   |Use default   |LVA Edge Object Detector Device |

Then select **Save**.

:::image type="content" source="media/iot-central-video-analytics-part4/relationships.png" alt-text="Add relationships":::

### Add views

The **LVA Edge Gateway** device template doesn't include any view definitions.

To add a view to the device template:

1. In the **LVA Edge Gateway** device template, navigate to **Views** and select the **Visualizing the device** tile.

1. Enter *LVA Edge Gateway device* as the view name.

1. Add the following tiles to the view:

    * A tile with the **Device Info** properties: **Device model**, **Manufacturer**, **Operating system**, **Processor architecture**, **Software version**, **Total memory**, and **Total storage**.
    * A line chart tile with the **Free Memory** and the **System Heartbeat** telemetry values.
    * An event history tile with the following events: **Create Camera**, **Delete Camera**, **Module Restart**, **Module Started**, **Module Stopped**.
    * A 2x1 last known value tile showing the **IoT Central Client State** telemetry.
    * A 2x1 last known value tile showing the **Module State** telemetry.
    * A 1x1 last known value tile showing the **System Heartbeat** telemetry.
    * A 1x1 last known value tile showing the **Connected Cameras** telemetry.

    :::image type="content" source="media/iot-central-video-analytics-part4/gateway-dashboard.png" alt-text="Dashboard":::

1. Select **Save**.

### Publish the device template

Before you can add a device to the application, you must publish the device template:

1. In the **LVA Edge Gateway** device template, select **Publish**.

1. On the **Publish this device template to the application** page, select **Publish**.

**LVA Edge Gateway** is now available as device type to use on the **Devices** page in the application.

## Add a gateway device

To add an **LVA Edge Gateway** device to the application:

1. Navigate to the **Devices** page and select the **LVA Edge Gateway** device template.

1. Select **+ New**.

1. In the **Create a new device** dialog, change the device name to *LVA Gateway 001*, and change the device ID to *lva-gateway-001*.

    > [!NOTE]
    > The device ID must be unique in the application.

1. Select **Create**.

The device status is **Registered**.

### Get the device credentials

You need the credentials that allow the device to connect to your IoT Central application. The get the device credentials:

1. On the **Devices** page, select the **lva-gateway-001** device you created.

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

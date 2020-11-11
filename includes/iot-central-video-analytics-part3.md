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

## Create the Azure IoT Edge gateway device

The video analytics - object and motion detection application includes an **LVA Edge Object Detector** device template and an **LVA Edge Motion Detection** device template. In this section, you create a gateway device template using the deployment manifest, and add the gateway device to your IoT Central application.

### Create a device template for the LVA Edge Gateway

To import the deployment manifest and create the **LVA Edge Gateway** device template:

1. In your IoT Central application, navigate to **Device Templates**, and select **+ New**.

1. On the **Select template type** page, select the **Azure IoT Edge** tile. Then select **Next: Customize**.

1. On the **Upload an Azure IoT Edge deployment manifest** page, enter *LVA Edge Gateway* as the template name, and check **Gateway device with downstream devices**.

    Don't browse for the deployment manifest yet. If you do, the deployment wizard expects an interface for each module, but you only need to expose the interface for the **LvaEdgeGatewayModule**. You upload the manifest in a later step.

    :::image type="content" source="./media/iot-central-video-analytics-part3/upload-deployment-manifest.png" alt-text="Don't upload deployment manifest":::

    Select **Next: Review**.

1. On the **Review** page, select **Create**.

### Import the device capability model

The device template must include a device capability model. On the **LVA Edge Gateway** page, select the **Import capability model** tile. Navigate to the *lva-configuration* folder you created previously and select the *LvaEdgeGatewayDcm.json* file.

The **LVA Edge Gateway** device template now includes the **LVA Edge Gateway Module** along with three interfaces: **Device information**, **LVA Edge Gateway Settings**, and **LVA Edge Gateway Interface**.

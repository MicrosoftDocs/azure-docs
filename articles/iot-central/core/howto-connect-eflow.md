---
title: Azure IoT Edge for Linux on Windows (EFLOW) with IoT Central | Microsoft Docs
description: Learn how to connect Azure IoT Edge for Linux on Windows (EFLOW) with IoT Central 
author: v-krishnag
ms.author: v-krishnag
ms.date: 11/09/2021
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# Azure IoT Edge for Linux on Windows (EFLOW) with IoT Central

Azure IoT Edge for Linux on Windows (EFLOW) lets you run Azure IoT Edge in a Linux container on your Windows device. In this article, you learn how to provision an [EFLOW](https://docs.microsoft.com/windows/iot/iot-enterprise/azure-iot-edge-for-linux-on-windows) device and manage it from your IoT Central application.

In this how-to article, you learn how to:

* Create a device template for an IoT Edge device.
* Create an IoT Edge device in IoT Central.
* Connect & Provision the device.

## Prerequisites

To complete the steps in this article, you need:

* An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* An [IoT Central application created](howto-create-iot-central-application.md) from the **Custom application** template. To learn more, see [Create an IoT Central application](howto-create-iot-central-application.md).


To follow the steps in this article, download the following files to your computer:

* [EnvironmentalSensorManifest.json](https://raw.githubusercontent.com/Azure-Samples/iot-central-docs-samples/master/iotedge/EnvironmentalSensorManifest.json)

## Add device template

In this section, you will create an IoT Central device template for an IoT Edge device. You will import an IoT Edge manifest to get started, and then modify the template to add telemetry definitions and views:

### Import manifest to create template

1. Create a device template and choose **Azure IoT Edge** as the template type.

1. On the **Customize** page of the wizard, enter a name such as *Environmental Sensor Edge Device* for the device template.

1. After you create the device template, select **Import a model**. Select a model such as the *EnvironmentalSensorManifest.json* file you downloaded previously.

1. On the **Review** page, select **Create**.

1. Select the **management** interface in the **SimulatedTemperatureSensor** module to view the two properties defined in the manifest:

:::image type="content" source="media/howto-connect-eflow/imported-manifest.png" alt-text="Device template created from IoT Edge manifest.":::

### Add telemetry to manifest

An IoT Edge manifest doesn't define the telemetry a module sends. You add the telemetry definitions to the device template in IoT Central. The **SimulatedTemperatureSensor** module sends telemetry messages that look like the following JSON:

```json
{
  "machine": {
    "temperature": 75.0,
    "pressure": 40.2
  },
  "ambient": {
    "temperature": 23.0,
    "humidity": 30.0
  },
  "timeCreated": ""
}
```

To add the telemetry definitions to the device template:

1. Select the **Manage** interface in the **Environmental Sensor Edge Device** template.

1. Select **+ Add capability**. Enter *machine* as the **Display name** and select the **Capability type** as **Telemetry**.

1. Select **Object** as the schema type, and then select **Define**. On the object definition page, add *temperature* and *pressure* as attributes of type **Double** and then select **Apply**.

1. Select **+ Add capability**. Enter *ambient* as the **Display name** and select the **Capability type** as **Telemetry**.

1. Select **Object** as the schema type, and then select **Define**. On the object definition page, add *temperature* and *humidity* as attributes of type **Double** and then select **Apply**.

1. Select **+ Add capability**. Enter *timeCreated* as the **Display name** and make sure that the **Capability type** is **Telemetry**.

1. Select **DateTime** as the schema type.

1. Select **Save** to update the template.

The **Manage** interface now includes the **machine**, **ambient**, and **timeCreated** telemetry types:

:::image type="content" source="media/howto-connect-eflow/manage-interface.png" alt-text="Interface with machine and ambient telemetry types."::: 

### Add views to template

1. Select **Views** in the **Environmental Sensor Edge Device** template.

1. On the **Select to add a new view** page, select the **Visualizing the device** tile.

1. Change the view name to *View IoT Edge device telemetry*.

1. Under **Start with devices**, select the **ambient**, **humidity** and **temperature** telemetry types. Then select **Add tile**.

1. Select **Save** to save the **View IoT Edge device telemetry** view.

:::image type="content" source="media/howto-connect-eflow/template-telemetry-view.png" alt-text="Device template with telemetry view."::: 

### Publish the template

Before you can add a device that uses the **Environmental Sensor Edge Device** template, you must publish the template.

Navigate to the **Environmental Sensor Edge Device** template and select **Publish**. On the **Publish this device template to the application** panel, select **Publish** to publish the template:

:::image type="content" source="media/howto-connect-eflow/publish-template.png" alt-text="Publish the device template."::: 

## Add IoT Edge device

1. In your IoT Central application, navigate to the **Devices** page and select **Environmental Sensor Edge Device** in the list of available templates.

1. Select **+ New** to add a new device from the template. On the **Create new device** page, select **Create**.

You now have a new device with the status **Registered**:

:::image type="content" source="media/howto-connect-eflow/new-device.png" alt-text="New Device."::: 

### Get the device credentials

When you deploy the IoT Edge device later in this tutorial, you need the credentials that allow the device to connect to your IoT Central application. The get the device credentials:

1. On the **Device** page, select the device you created.

1. Select **Connect**.

1. On the **Device connection** page, make a note of the **ID Scope**, the **Device ID**, and the **Primary Key**. You use these values later.

1. Select **Close**.

You've now finished configuring your IoT Central application to enable an IoT Edge device to connect.

## Install and provision Azure IoT Edge for Linux on a Windows device

To install and provision Edge for Linux on a windows device see [Install and provision Azure IoT Edge for Linux on a Windows device](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-on-windows)

> [!NOTE]
> You are not required to create an IoTHub with this tutorial. You can skip the step of creating IoT Hub since you will connecting to IoT Central. 

Use the **ID scope**, **Device ID** and the **Primary Key** you made a note of previously. 

 ```azurepowershell-interactive
   Provision-EflowVm -provisioningType DpsSymmetricKey -​scopeId <ID_SCOPE_HERE> -registrationId <DEVCIE_ID_HERE> -symmKey <PRIMARY_KEY_HERE>
   ```

Go To Device Details page on IoT Central and you can see telemetry flowing from your device
    
:::image type="content" source="media/howto-connect-eflow/telemetry.png" alt-text="Telemetry from the device."::: 

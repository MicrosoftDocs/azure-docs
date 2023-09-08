---
title: Tutorial - Connect an IoT Edge device to your application
description: This tutorial shows you how to register, provision, and connect an IoT Edge device to your IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 12/14/2022
ms.topic: tutorial
ms.service: iot-central
services: iot-central
ms.custom: [device-developer]

# Customer intent: As a solution developer, I want to learn how to connect an IoT Edge device to IoT Central and then configure views and forms so that I can interact with the device.
---

# Tutorial: Connect an IoT Edge device to your Azure IoT Central application

This tutorial shows you how to connect an IoT Edge device to your Azure IoT Central application. The IoT Edge device runs a module that sends temperature, pressure, and humidity telemetry to your application. You use a device template to enable views and forms that let you interact with the module on the IoT Edge device.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Import an IoT Edge deployment manifest into your IoT Central application.
> * Add an IoT Edge device that uses this deployment manifest to your application.
> * Connect the IoT Edge device to your application.
> * Monitor the IoT Edge runtime from your application.
> * Add a device template with views and forms to your application.
> * View the telemetry sent from the device in your application.

## Prerequisites

To complete the steps in this tutorial, you need:

[!INCLUDE [iot-central-prerequisites-basic](../../../includes/iot-central-prerequisites-basic.md)]

You also need to be able to upload configuration files to your IoT Central application from your local machine.

## Import a deployment manifest

A deployment manifest specifies the configuration of an IoT Edge device including the details of any custom modules the device should download and run. IoT Edge devices that connect to an IoT Central application download their deployment manifests from the application.

To add a deployment manifest to IoT Central to use in this tutorial:

1. Download and save the [EnvironmentalSensorManifest-1-4.json](https://raw.githubusercontent.com/Azure-Samples/iot-central-docs-samples/main/iotedge/EnvironmentalSensorManifest-1-4.json) deployment manifest to your local machine.

1. In your IoT Central application, navigate to the **Edge manifests** page.

1. Select **+ New**.

1. On the **Customize** page, enter *Environmental Sensor* as the name and then upload the *EnvironmentalSensorManifest-1-4.json* file.

1. After the manifest file is validated, select **Next**.

1. The **Review and finish** page shows the modules defined in the manifest, including the **SimulatedTemperatureSensor** custom module. Select **Create**.

The **Edge manifests** list now includes  the **Environmental sensor** manifest:

:::image type="content" source="media/tutorial-connect-iot-edge-device/deployment-manifests.png" alt-text="Screenshot that shows the Edge Manifests list in the application.":::

## Add an IoT Edge device

Before the IoT Edge device can connect to your IoT Central application, you need to add it to the list of devices and get its credentials:

1. In your IoT Central application, navigate to the **Devices** page.

1. On the **Devices** page, make sure that **All devices** is selected. Then select **+ New**.

1. On the **Create a new device** page:
    * Enter *Environmental sensor - 001* as the device name.
    * Enter *env-sens-001* as the device ID.
    * Make sure that the device template is **unassigned**.
    * Make sure that the device isn't simulated.
    * Set **Azure IoT Edge device** to **Yes**.
    * Select the **Environmental sensor** IoT Edge deployment manifest.

1. Select **Create**.

The list of devices on the **Devices** page now includes the **Environmental sensor - 001** device. The device status is **Registered**:

:::image type="content" source="media/tutorial-connect-iot-edge-device/registered-sensor-device.png" alt-text="Screenshot that shows the registered and unassigned IoT Edge device.":::

Before you deploy the IoT Edge device, you need the:

* **ID Scope** of your IoT Central application.
* **Device ID** values for the IoT Edge device.
* **Primary key** values for the IoT Edge device.

To find these values, navigate to the **Environmental sensor - 001** device from the **Devices** page and select **Connect**. Make a note of these values before you continue.

## Deploy the IoT Edge device

In this tutorial, you deploy the IoT Edge runtime to a Linux virtual machine in Azure. To deploy and configure the virtual machine, select the following button:

[![Deploy to Azure Button](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fiot-central-docs-samples%2Fmain%2Fedge-vm-deploy-1-4%2FedgeDeploy.json)

On the **Custom deployment** page, use the following values to complete the form:

| Setting | Value |
| ------- | ----- |
| `Resource group` | Create a new resource group with a name such as *MyIoTEdgeDevice_rg*. |
| `Region` | Select a region close to you. |
| `Dns Label Prefix` | A unique DNS prefix for your virtual machine.  |
| `Admin Username` |  *AzureUser* |
| `Admin Password` | A password of your choice to access the virtual machine. |
| `Scope Id` | The ID scope you made a note of previously. |
| `Device Id` | The device ID you made a note of previously. |
| `Device Key` |  The device key you made a note of previously. |

Select **Review + create** and then **Create**. Wait for the deployment to finish before you continue.

## Manage the IoT Edge device

To verify the deployment of the IoT Edge device was successful:

1. In your IoT Central application, navigate to the **Devices** page. Check the status of the **Environmental sensor - 001** device is **Provisioned**. You may need to wait for a few minutes while the device connects.

1. Navigate to the **Environmental sensor - 001** device.

1. On the **Modules** page, check the status of the three modules is **Running**.

On the **Modules** page, you can view status information about the modules and perform actions such as viewing their logs and restarting them.

## View raw data

On the **Raw data** page for the **Environmental sensor - 001** device, you can see the telemetry it's sending and the property values it's reporting.

At the moment, the IoT Edge device doesn't have a device template assigned, so all the data from the device is **Unmodeled**. Without a device template, there are no views or dashboards to display custom device information in the IoT Central application. However, you can use data export to forward the data to other services for analysis or storage.

## Add a device template

A deployment manifest may include definitions of properties exposed by a module. For example, the configuration in the deployment manifest for the **SimulatedTemperatureSensor** module includes the following:

```json
"SimulatedTemperatureSensor": {
    "properties.desired": {
        "SendData": true,
        "SendInterval": 10
    }
}
```

The following steps show you how to add a device template for an IoT Edge device and the module property definitions from the deployment manifest:

1. In your IoT Central application, navigate to the **Device templates** page and select **+ New**.

1. On the **Select type** page, select **Azure IoT Edge**, and then **Next: Customize**.

1. On the **Customize** page, enter *Environmental sensor* as the device template name. Select **Next: Review**.

1. On the **Review** page, select **Create**.

1. On the **Create a model** page, select **Custom model**.

1. On the **Environmental sensor** page, select **Modules**, then **Import modules from manifest**.

1. In the **Import modules** dialog, select the **Environmental sensor** deployment manifest, then **Import**.

The device template now includes a module called **SimulatedTemperatureSensor**, with an interface called **management**. This interface includes definitions of the **SendData** and **SendInterval** properties from the deployment manifest.

A deployment manifest can only define module properties, not commands or telemetry. To add the telemetry definitions to the device template:

1. Download and save the [EnvironmentalSensorTelemetry.json](https://raw.githubusercontent.com/Azure-Samples/iot-central-docs-samples/main/iotedge/EnvironmentalSensorTelemetry.json) interface definition to your local machine.

1. Navigate to the **SimulatedTemperatureSensor** module in the **Environmental sensor** device template.

1. Select **Add inherited interface** (you may need to select **...** to see this option). Select **Import interface**. Then import the *EnvironmentalSensorTelemetry.json* file you previously downloaded.

The module now includes a **telemetry** interface that defines **machine**, **ambient**, and **timeCreated** telemetry types:

:::image type="content" source="media/tutorial-connect-iot-edge-device/telemetry-interface.png" alt-text="Screenshot that shows the device template with the telemetry interface.":::

To add a view that plots telemetry from the device:

1. In the **Environmental sensor** device template, select **Views**.

1. On the **Select to add a new view** page, select **Visualizing the device**.

1. Enter *Environmental telemetry* as the view name.

1. Select **Start with devices**. Then add the following telemetry types:
    * **ambient/temperature**
    * **humidity**
    * **machine/temperature**
    * **pressure**

1. Select **Add tile**, then **Save**.

1. To publish the template, select **Publish**.

## View telemetry and control module

To view the telemetry from your device, you need to attach the device to the device template:

1. Navigate to the **Devices** page and select the **Environmental sensor - 001** device.

1. Select **Migrate**.

1. In the **Migrate** dialog, select the **Environmental sensor** device template, and select **Migrate**.

1. Navigate to the **Environmental sensor - 001** device and select the **Environmental telemetry** view.

1. The line chart plots the four telemetry values you selected for the view:

    :::image type="content" source="media/tutorial-connect-iot-edge-device/environmental-telemetry-view.png" alt-text="Screenshot that shows the telemetry line charts.":::

1. The **Raw data** page now includes columns for the **ambient**, **machine**, and **timeCreated** telemetry values.

To control the module by using the properties defined in the deployment manifest, navigate to the **Environmental sensor - 001** device and select the **Manage** view.

IoT Central created this view automatically from the **manage** interface in the **SimulatedTemperatureSensor** module. The **Raw data** page now includes columns for the **SendData** and **SendInterval** properties.

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources](../../../includes/iot-central-clean-up-resources.md)]

To remove the virtual machine that's running Azure IoT Edge, navigate to the Azure portal and delete the resource group you created previously. If you used the recommended name, your resource group is called **MyIoTEdgeDevice_rg**.

## Next steps

If you'd prefer to continue through the set of IoT Central tutorials and learn more about building an IoT Central solution, see:

> [!div class="nextstepaction"]
> [Create a gateway device template](./tutorial-define-gateway-device-type.md)

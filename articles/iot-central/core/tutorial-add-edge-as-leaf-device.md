---
title: Add an Azure IoT Edge device to Azure IoT Central | Microsoft Docs
description: As an operator, add an Azure IoT Edge device to your Azure IoT Central application
author: rangv
ms.author: rangv
ms.date: 05/29/2020
ms.topic: tutorial
ms.service: iot-central
services: iot-central
ms.custom: mvc
---

# Tutorial: Add an Azure IoT Edge device to your Azure IoT Central application

*This article applies to operators, solution builders, and device developers.*

This tutorial shows you how to configure and add an Azure IoT Edge device to your Azure IoT Central application. The tutorial uses an IoT Edge-enabled Linux virtual machine (VM) to simulate an IoT Edge device. The IoT Edge device uses a module that generates simulated environmental telemetry. You view the telemetry on a dashboard in your IoT Central application.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a device template for an IoT Edge device
> * Create an IoT Edge device in IoT Central
> * Deploy a simulated IoT Edge device to a Linux VM

## Prerequisites

Complete the [Create an Azure IoT Central application](./quick-deploy-iot-central.md) quickstart to create an IoT Central application using the **Custom app > Custom application** template.

To complete the steps in this tutorial, you need an active Azure subscription.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Download the IoT Edge manifest file from GitHub. Right-click on the following link and then select **Save link as**: [EnvironmentalSensorManifest.json](https://raw.githubusercontent.com/Azure-Samples/iot-central-docs-samples/master/iotedge/EnvironmentalSensorManifest.json)

## Create device template

In this section, you create an IoT Central device template for an IoT Edge device. You import an IoT Edge manifest to get started, and then modify the template to add telemetry definitions and views:

### Import manifest to create template

To create a device template from an IoT Edge manifest:

1. In your IoT Central application, navigate to **Device templates** and select **+ New**.

1. On the **Select template type** page, select the **Azure IoT Edge** tile. Then select **Next: Customize**.

1. On the **Upload an Azure IoT Edge deployment manifest** page, enter *Environmental Sensor Edge Device* as the device template name. Then select **Browse** to upload the **EnvironmentalSensorManifest.json** you downloaded previously. Then select **Next: Review**.

1. On the **Review** page, select **Create**.

1. Select the **Manage** interface in the **SimulatedTemperatureSensor** module to view the two properties defined in the manifest:

:::image type="content" source="media/tutorial-add-edge-as-leaf-device/imported-manifest.png" alt-text="Device template created from IoT Edge manifest":::

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

1. Select **+ Add capability**. Enter *machine* as the **Display name** and make sure that the **Capability type** is **Telemetry**.

1. Select **Object** as the schema type, and then select **Define**. On the object definition page, add *temperature* and *pressure* as attributes of type **Double** and then select **Apply**.

1. Select **+ Add capability**. Enter *ambient* as the **Display name** and make sure that the **Capability type** is **Telemetry**.

1. Select **Object** as the schema type, and then select **Define**. On the object definition page, add *temperature* and *humidity* as attributes of type **Double** and then select **Apply**.

1. Select **+ Add capability**. Enter *timeCreated* as the **Display name** and make sure that the **Capability type** is **Telemetry**.

1. Select **DateTime** as the schema type.

1. Select **Save** to update the template.

The **Manage** interface now includes the **machine**, **ambient**, and **timeCreated** telemetry types:

:::image type="content" source="media/tutorial-add-edge-as-leaf-device/manage-interface.png" alt-text="Interface with machine and ambient telemetry types":::

### Add views to template

The device template doesn't yet have a view that lets an operator see the telemetry from the IoT Edge device. To add a view to the device template:

1. Select **Views** in the **Environmental Sensor Edge Device** template.

1. On the **Select to add a new view** page, select the **Visualizing the device** tile.

1. Change the view name to *View IoT Edge device telemetry*.

1. Select the **ambient** and **machine** telemetry types. Then select **Add tile**.

1. Select **Save** to save the **View IoT Edge device telemetry** view.

:::image type="content" source="media/tutorial-add-edge-as-leaf-device/template-telemetry-view.png" alt-text="Device template with telemetry view":::

### Publish the template

Before you can add a device that uses the **Environmental Sensor Edge Device** template, you must publish the template.

Navigate to the **Environmental Sensor Edge Device** template and select **Publish**. On the **Publish this device template to the application** panel, select **Publish** to publish the template:

:::image type="content" source="media/tutorial-add-edge-as-leaf-device/publish-template.png" alt-text="Publish the device template":::

## Add IoT Edge device

Now you've published the **Environmental Sensor Edge Device** template, you can add a device to your IoT Central application:

1. In your IoT Central application, navigate to the **Devices** page and select **Environmental Sensor Edge Device** in the list of available templates.

1. Select **+ New** to add a new device from the template. On the **Create new device** page, select **Create**.

You now have a new device with the status **Registered**:

:::image type="content" source="media/tutorial-add-edge-as-leaf-device/new-device.png" alt-text="New, registered device":::

### Get the device credentials

When you deploy the IoT Edge device later in this tutorial, you need the credentials that allow the device to connect to your IoT Central application. The get the device credentials:

1. On the **Device** page, select the device you created.

1. Select **Connect**.

1. On the **Device connection** page, make a note of the **ID Scope**, the **Device ID**, and the **Primary Key**. You use these values later.

1. Select **Close**.

You've now finished configuring your IoT Central application to enable an IoT Edge device to connect.

## Deploy an IoT Edge device

In this tutorial, you use an Azure IoT Edge-enabled Linux VM, created on Azure to simulate an IoT Edge device. To create the IoT Edge-enabled VM in your Azure subscription, click:

[![Deploy to Azure Button for iotedge-vm-deploy](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazure%2Fiotedge-vm-deploy%2Fmaster%2FedgeDeploy.json)

On the **Custom deployment** page:

1. Select your Azure subscription.

1. Select **Create new** to create a new resource group called *central-edge-rg*.

1. Choose a region close to you.

1. Add a unique **DNS Label Prefix** such as *contoso-central-edge*.

1. Choose an admin user name for the virtual machine.

1. Enter *temp* as the connection string. Later, you configure the device to connect using DPS.

1. Accept the default values for the VM size, Ubuntu version, and location.

1. Select **password** as the authentication type.

1. Enter a password for the VM.

1. Then select **Review + Create**.

1. Review your choices and then select **Create**:

    :::image type="content" source="media/tutorial-add-edge-as-leaf-device/vm-deployment.png" alt-text="Create an IoT Edge VM":::

The deployment takes a couple of minutes to complete. When the deployment is complete, navigate to the **central-edge-rg** resource group in the Azure portal.

### Configure the IoT Edge VM

To configure IoT Edge in the VM to use DPS to register and connect to your IoT Central application:

1. In the **contoso-edge-rg** resource group, select the virtual machine instance.

1. In the **Support + troubleshooting** section, select **Serial console**. If you're prompted to configure boot diagnostics, follow the instructions in the portal.

1. Press **Enter** to see the `login:` prompt. Enter your username and password to sign in.

1. Run the following command to check the IoT Edge runtime version. At the time of writing, the version is 1.0.9.1:

    ```bash
    sudo iotedge --version
    ```

1. Use the `nano` editor to open the IoT Edge config.yaml file:

    ```bash
    sudo nano /etc/iotedge/config.yaml
    ```

1. Scroll down until you see `# Manual provisioning configuration`. Comment out the next three lines as shown in the following snippet:

    ```yaml
    # Manual provisioning configuration
    #provisioning:
    #  source: "manual"
    #  device_connection_string: "temp"
    ```

1. Scroll down until you see `# DPS symmetric key provisioning configuration`. Uncomment the next eight lines as shown in the following snippet:

    ```yaml
    # DPS symmetric key provisioning configuration
    provisioning:
      source: "dps"
      global_endpoint: "https://global.azure-devices-provisioning.net"
      scope_id: "{scope_id}"
      attestation:
        method: "symmetric_key"
        registration_id: "{registration_id}"
        symmetric_key: "{symmetric_key}"
    ```

    > [!TIP]
    > Make sure there's no space left in front of `provisioning:`

1. Replace `{scope_id}` with the **ID Scope** you made a note of previously.

1. Replace `{registration_id}` with the **Device ID** you made a note of previously.

1. Replace `{symmetric_key}` with the **Primary key** you made a note of previously.

1. Save the changes (**Ctrl-O**) and exit (**Ctrl-X**) the `nano` editor.

1. Run the following command to restart the IoT Edge daemon:

    ```bash
    sudo systemctl restart iotedge
    ```

1. To check the status of the IoT Edge modules, run the following command:

    ```bash
    iotedge list
    ```

    The following sample output shows the running modules:

    ```bash
    NAME                        STATUS           DESCRIPTION      CONFIG
    SimulatedTemperatureSensor  running          Up 20 seconds    mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0
    edgeAgent                   running          Up 27 seconds    mcr.microsoft.com/azureiotedge-agent:1.0
    edgeHub                     running          Up 22 seconds    mcr.microsoft.com/azureiotedge-hub:1.0
    ```

    > [!TIP]
    > You may need to wait for all the modules to start running.

## View the telemetry

The simulated IoT Edge device is now running in the VM. In your IoT Central application, the device status is now **Provisioned** on the **Devices** page:

:::image type="content" source="media/tutorial-add-edge-as-leaf-device/provisioned-device.png" alt-text="Provisioned IoT Edge device":::

You can see the telemetry from the device on the **View IoT Edge device telemetry** page:

:::image type="content" source="media/tutorial-add-edge-as-leaf-device/device-telemetry-view.png" alt-text="Device telemetry":::

The **Modules** page shows the status of the IoT Edge modules on the device:

:::image type="content" source="media/tutorial-add-edge-as-leaf-device/edge-module-status.png" alt-text="Device module status":::

## Clean up resources

If you plan to continue working with the IoT Edge VM, you can keep and reuse the resources you used in this tutorial. Otherwise, you can delete the resources you created in this tutorial to avoid additional charges:

* To delete the IoT Edge VM and its associated resources, delete the the **contoso-edge-rg** resource group in the Azure portal.
* To delete the IoT Central application, navigate to the **Your application** page in the **Administration** section of the application and select **Delete**.

## Next steps

As a device developer, now that you've learned how to work with and manage IoT Edge devices in IoT Central, a suggested next step is to read:

> [!div class="nextstepaction"]
> [Develop IoT Edge modules](../../iot-edge/tutorial-develop-for-linux.md)

As a solution developer or operator, now that you've learned how to work with and manage IoT Edge devices in IoT Central, a suggested next step is to:

> [!div class="nextstepaction"]
> [Use device groups to analyze device telemetry](./tutorial-use-device-groups.md)

---
title: Define a new IoT device type in Azure IoT Central | Microsoft Docs
description: This article shows you how to create a new Azure IoT device template in your Azure IoT Central application. You define the telemetry, state, properties, and commands for your type.
author: dominicbetts
ms.author: dobett
ms.date: 12/06/2019
ms.topic: how-to
ms.service: iot-central
services: iot-central
ms.custom: [contperf-fy21q1, device-developer]

# This article applies to solution builders and device developers.
---

# Define a new IoT device type in your Azure IoT Central application

A device template is a blueprint that defines the characteristics and behaviors of a type of device that connects to an [Azure IoT Central application](concepts-app-templates.md).

For example, a builder can create a device template for a sensor that sends telemetry and location property. From this device template, an operator can create and connect real devices. 

The following screenshot shows an example of a device template and it has the following sections

- Model - The model defines how your device interacts with your IoT Central application. Each model has a unique model ID and you can customize it with additional capabilities, add interfaces to inherit capabilities, or add new components that are based on other interfaces 
- Cloud properties -  define information that your IoT Central application stores about your devices. For example, a cloud property might record the date a device was last serviced. 
- Customizations - You can customize your interface capabilities such as specifying the minimum and maximum temperature ranges
- Views - You can use views to visualize the data from the device, and forms to manage and control a device

To learn more about device templates see [here](concepts-device-templates.md).


## Create a device template 

As a builder, you have several options for creating device templates:

- Design the device template in IoT Central GUI, and then [implement its device model in your device code](concepts-telemetry-properties-commands.md).
- Import a device template from the [Azure Certified for IoT device catalog](https://aka.ms/iotdevcat). Customize the device template to your requirements in IoT Central.
- Implement your device code from the model, and connect your real device to your IoT Central application. IoT Central finds and imports the device model from the public repository for you and generates a device template. You can then add any cloud properties, customizations, and views your IoT Central application needs to the device template.
- Author a device model using the DTDL. Implement your device code from the model. Manually import the device model into your IoT Central application, and then add any cloud properties, customizations, and views your IoT Central application needs.
- You can also add device templates to an IoT Central application using the [REST API](/learn/modules/manage-iot-central-apps-with-rest-api/) or the [CLI](howto-manage-iot-central-from-cli.md).

This section focuses on creating device template using IoT Central GUI. Add a device template from the device catalog. 

This tutorial uses the **ESP32-Azure IoT Kit** device template:

1. To add a new device template, select **+ New** on the **Device templates** page.
1. On the **Select type** page, scroll down until you find the **ESP32-Azure IoT Kit** tile in the **Use a pre-configured device template** section.
1. Select the **ESP32-Azure IoT Kit** tile, and then select **Next: Review**.
1. On the **Review** page, select **Create**.
The name of the template you created is **Sensor Controller**. The model includes components such as **Sensor Controller**, **SensorTemp**, and **Device Information interface**. Components define the capabilities of an ESP32 device. Capabilities include the telemetry, properties, and commands.

## Manage a device template

You can rename or delete a template from the template's editor page.

After you've defined the template, you can publish it. Until the template is published, you can't connect a device to it, and it doesn't appear on the **Devices** page.

To learn more about modifying device templates, see [Edit an existing device template](howto-edit-device-template.md).

## Models

The model defines how your device interacts with your IoT Central application. Customize your model with additional capabilities, add interfaces to inherit capabilities, or add new components that are based on other interfaces.

To create a device model, you can:

- Use IoT Central to create a custom model from scratch.
- Import a DTDL model from a JSON file. A device builder might have used Visual Studio Code to author a device model for your application.
- Select one of the devices from the Device Catalog. This option imports the device model that the manufacturer has published for this device. A device model imported like this is automatically published.

To learn more about models see [here.](../../iot-pnp/concepts-modeling-guide.md)

To view an interface in your IoT Central Application

1. Go to **Device Templates** page and select the device template you created. The following screenshot shows an example of root interface of a Sensor Controller device template.

    :::image type="content" source="media/howto-set-up-template/root-interface.png" alt-text="Screenshot that shows root interface for a model"::: 


1. Select ellipsis to add an inherited interface or component to the root interface.

    :::image type="content" source="media/howto-set-up-template/add-interface.png" alt-text="How to add interface or component ":::

1. Select **+ add capability** to add capability to an interface or component. For example, you can add **Target Temperature** capability to a SensorTemp component.

    :::image type="content" source="media/howto-set-up-template/add-capability.png" alt-text="How to add capability":::

1. To export a model, an interface, or a capability select **export**.

    :::image type="content" source="media/howto-set-up-template/export.png" alt-text="How to export":::

1. To view or edit DTDL for an interface, or a capability select **edit DTDL**.

    :::image type="content" source="media/howto-set-up-template/edit-interface.png" alt-text="How to view or edit"::: 

To learn more about models see [modeling guide](../../iot-pnp/concepts-modeling-guide.md).


## Cloud properties

Use cloud properties to store information about devices in IoT Central. Cloud properties are never sent to a device. For example, you can use cloud properties to store the name of the customer who has installed the device, or the device's last service date.

:::image type="content" source="media/howto-set-up-template/cloud-properties.png" alt-text="How to add cloud properties"::: 

The following table shows the configuration settings for a cloud property:

| Field | Description |
| ----- | ----------- |
| Display Name | The display name for the cloud property value used on views and forms. |
| Name | The name of the cloud property. IoT Central generates a value for this field from the display name, but you can choose your own value if necessary. |
| Semantic Type | The semantic type of the property, such as temperature, state, or event. The choice of semantic type determines which of the following fields are available. |
| Schema | The cloud property data type, such as double, string, or vector. The available choices are determined by the semantic type. |

## Customizations

Use customizations when you need to modify an imported component or add IoT Central-specific features to a capability. You can customize any part of an existing device template's capabilities.

For example you can customize **SensorPressure** component to add 

## Views

Generating default views is a quick way to visualize your important device information. You have up to three default views generated for your device template:

- **Commands**: A view with device commands, and allows your operator to dispatch them to your device.
- **Overview**: A view with device telemetry, displaying charts and metrics.
- **About**: A view with device information, displaying device properties.

After you've selected **Generate default views**, you see that they've been automatically added under the **Views** section of your device template.

Add views to a device template to enable operators to visualize a device by using charts and metrics. You can have multiple views for a device template.

To add a view to a device template:

1. Go to your device template, and select **Views**.
1. Select **Visualizing the Device**.
1. Enter a name for your view in **View name**.
1. Select **Start with a visual**  under add tiles and choose the type of visual you want to show on your tile, and then click Add tile (or just drag and drop it on the canvas). Click the gear icon on your new tile to configure the tile.

:::image type="content" source="media/howto-set-up-template/start-visual.png" alt-text="How to start with a visual"::: 

:::image type="content" source="media/howto-set-up-template/tile.png" alt-text="configure tile"::: 

To view and test your view, select **Configure preview device**. This feature lets you see the view as your operator sees it after it's published. Use this feature to validate that your views show the correct data. You can choose from the following options:

- No preview device.
- The real test device you've configured for your device template.
- An existing device in your application, by using the device ID.

Add forms to a device template to enable operators to manage a device by viewing and setting properties. Operators can only edit cloud properties and writable device properties. You can have multiple forms for a device template.

1. Select the **Views** node, and then select the **Editing device and cloud data** tile to add a new view.

1. Change the form name to **Manage device**.

1. Select the **Customer Name** and **Last Service Date** cloud properties, and the **Target Temperature** property. Then select **Add section**.

1. Select **Save** to save your new form.

:::image type="content" source="media/howto-set-up-template/form.png" alt-text="configure form"::: 


## Publish a device template

Before you can connect a device that implements your device model, you must publish your device template.

To learn more about modifying a device template it's published, see [Edit an existing device template](howto-edit-device-template.md).

To publish a device template, go to you your device template, and select **Publish**.

After you publish a device template, an operator can go to the **Devices** page, and add either real or simulated devices that use your device template. You can continue to modify and save your device template as you're making changes. When you want to push these changes out to the operator to view under the **Devices** page, you must select **Publish** each time.

## Next steps

A suggested next step is to read about how to [Make changes to an existing device template](howto-edit-device-template.md).

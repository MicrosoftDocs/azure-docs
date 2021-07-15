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

This article describes how to create a device template in IoT Central. For example, you can create a device template for a sensor that sends telemetry, such as temperature and humidity, and properties, such as location. From this device template, an operator can create and connect real devices. 

The following screenshot shows an example of a device template:

:::image type="content" source="media/howto-set-up-template/device-template.png" alt-text="Screenshot that shows a device template.":::

The device template has the following sections:

- Model - Use the models to define how your device interacts with your IoT Central application. Each model has a unique model ID and you can customize it with additional capabilities, add interfaces to inherit capabilities, or add new components that are based on other interfaces.
- Cloud properties - Use cloud properties to define information that your IoT Central application stores about your devices. For example, a cloud property might record the date a device was last serviced. 
- Customize - Use customizations to add interface capabilities such as specifying the minimum and maximum temperature ranges.
- Views - Use views to visualize the data from the device, and forms to manage and control a device.

To learn more, see [What are device templates?](concepts-device-templates.md).


## Create a device template 

You have several options for creating device templates:

- Design the device template in IoT Central GUI, and then [implement its device model in your device code](tutorial-connect-device.md).
- Import a device template from the [Azure Certified for IoT device catalog](https://aka.ms/iotdevcat). Customize the device template to your requirements in IoT Central.
- Use a model stored in a model repository to implement your device code. Have the the device send the model Id when it connects to IoT Central. IoT Central uses the model Id to retrieve the model from the repository and creates a device template. You can then add any cloud properties, customizations, and views your IoT Central application needs to the device template.
- Author a device model using the DTDL. Implement your device code from the model. Manually import the device model into your IoT Central application, and then add any cloud properties, customizations, and views your IoT Central application needs.
- You can also add device templates to an IoT Central application using the [REST API](/learn/modules/manage-iot-central-apps-with-rest-api/) or the [CLI](howto-manage-iot-central-from-cli.md).

This section shows you how to import a device template from the catalog and how to customize it using the IoT Central GUI.

This tutorial uses the **ESP32-Azure IoT Kit** device template from the device catalog as an example:

1. To add a new device template, select **+ New** on the **Device templates** page.
1. On the **Select type** page, scroll down until you find the **ESP32-Azure IoT Kit** tile in the **Use a pre-configured device template** section.
1. Select the **ESP32-Azure IoT Kit** tile, and then select **Next: Review**.
1. On the **Review** page, select **Create**.
The name of the template you created is **Sensor Controller**. The model includes components such as **Sensor Controller**, **SensorTemp**, and **Device Information interface**. Components define the capabilities of an ESP32 device. Capabilities include the telemetry, properties, and commands.

:::image type="content" source="media/howto-set-up-template/device-template.png" alt-text="Screenshot that shows a Sensor controller device template."::: 

## Manage a device template

You can rename or delete a template from the template's editor page.

After you've defined the template, you can publish it. Until the template is published, you can't connect a device to it, and it doesn't appear on the **Devices** page.

To learn more about modifying and versioning device templates, see [Edit an existing device template](howto-edit-device-template.md).

## Models

The model defines how your device interacts with your IoT Central application. Customize your model with additional capabilities, add interfaces to inherit capabilities, or add new components that are based on other interfaces.

To create a device model, you can:

- Use IoT Central to create a custom model from scratch.
- Import a DTDL model from a JSON file. A device builder might have used Visual Studio Code to author a device model for your application.
- Select one of the devices from the Device Catalog. This option imports the device model that the manufacturer has published for this device. A device model imported like this is automatically published.

### Interfaces and components

1. To view model ID, go to **Device Templates** page and select the device template you created.

1. Select the root interface listed in the models and select **Edit identity** to view the model ID.

:::image type="content" source="media/howto-set-up-template/root-interface.png" alt-text="Screenshot that shows a root interface for Sensor controller device template.":::

:::image type="content" source="media/howto-set-up-template/view-id.png" alt-text="Screenshot that shows model id for device template root interface.":::

To view component ID, select **Edit identity** on any of the component interfaces.

:::image type="content" source="media/howto-set-up-template/component.png" alt-text="Screenshot that shows a component interface for Sensor controller device template.":::

:::image type="content" source="media/howto-set-up-template/view-component-id.png" alt-text="Screenshot that shows model id for device template component interface.":::

To learn more, see the [IoT Plug and Play modeling guide](../../iot-pnp/concepts-modeling-guide.md).

To view and manage the interfaces in your device model:

1. Go to **Device Templates** page and select the device template you created. The interfaces are listed in the **Models** section of the device template. The following screenshot shows an example of the **Sensor Controller** root interface in a device template:

    :::image type="content" source="media/howto-set-up-template/root-interface.png" alt-text="Screenshot that shows root interface for a model"::: 

1. Select the ellipsis to add an inherited interface or component to the root interface. To learn more about interfaces and component see [multiple components](../../iot-pnp/concepts-modeling-guide.md#multiple-components) in the modeling guide.

    :::image type="content" source="media/howto-set-up-template/add-interface.png" alt-text="How to add interface or component ":::

1. Select **+ add capability** to add capability to an interface or component. For example, you can add **Target Temperature** capability to a **SensorTemp** component.

    :::image type="content" source="media/howto-set-up-template/add-capability.png" alt-text="How to add capability":::

1. To export a model or interface select **Export**.

    :::image type="content" source="media/howto-set-up-template/export.png" alt-text="How to export":::

1. To view or edit DTDL for an interface, or a capability select **Edit DTDL**.

    :::image type="content" source="media/howto-set-up-template/edit-interface.png" alt-text="How to view or edit"::: 

### Capabilities

#### Telemetry

Telemetry is a stream of values sent from the device, typically from a sensor. For example, a sensor might report the ambient temperature.

The following table shows the configuration settings for a telemetry capability:

| Field | Description |
| ----- | ----------- |
| Display Name | The display name for the telemetry value used on views and forms. |
| Name | The name of the field in the telemetry message. IoT Central generates a value for this field from the display name, but you can choose your own value if necessary. This field needs to be alphanumeric. |
| Capability Type | Telemetry. |
| Semantic Type | The semantic type of the telemetry, such as temperature, state, or event. The choice of semantic type determines which of the following fields are available. |
| Schema | The telemetry data type, such as double, string, or vector. The available choices are determined by the semantic type. Schema isn't available for the event and state semantic types. |
| Severity | Only available for the event semantic type. The severities are **Error**, **Information**, or **Warning**. |
| State Values | Only available for the state semantic type. Define the possible state values, each of which has display name, name, enumeration type, and value. |
| Unit | A unit for the telemetry value, such as **mph**, **%**, or **&deg;C**. |
| Display Unit | A display unit for use on views and forms. |
| Comment | Any comments about the telemetry capability. |
| Description | A description of the telemetry capability. |

#### Properties

Properties represent point-in-time values. For example, a device can use a property to report the target temperature it's trying to reach. You can set writable properties from IoT Central.

The following table shows the configuration settings for a property capability:

| Field | Description |
| ----- | ----------- |
| Display Name | The display name for the property value used on views and forms. |
| Name | The name of the property. IoT Central generates a value for this field from the display name, but you can choose your own value if necessary. This field needs to be alphanumeric. |
| Capability Type | Property. |
| Semantic Type | The semantic type of the property, such as temperature, state, or event. The choice of semantic type determines which of the following fields are available. |
| Schema | The property data type, such as double, string, or vector. The available choices are determined by the semantic type. Schema isn't available for the event and state semantic types. |
| Writable | If the property isn't writable, the device can report property values to IoT Central. If the property is writable, the device can report property values to IoT Central and IoT Central can send property updates to the device.
| Severity | Only available for the event semantic type. The severities are **Error**, **Information**, or **Warning**. |
| State Values | Only available for the state semantic type. Define the possible state values, each of which has display name, name, enumeration type, and value. |
| Unit | A unit for the property value, such as **mph**, **%**, or **&deg;C**. |
| Display Unit | A display unit for use on views and forms. |
| Comment | Any comments about the property capability. |
| Description | A description of the property capability. |

#### Commands

You can call device commands from IoT Central. Commands optionally pass parameters to the device and receive a response from the device. For example, you can call a command to reboot a device in 10 seconds.

The following table shows the configuration settings for a command capability:

| Field | Description |
| ----- | ----------- |
| Display Name | The display name for the command used on views and forms. |
| Name | The name of the command. IoT Central generates a value for this field from the display name, but you can choose your own value if necessary. This field needs to be alphanumeric. |
| Capability Type | Command. |
| Queue if offline | If enabled, you can call the command even if the device is offline. If not enabled, you can only call the command when the the device is online. |
| Comment | Any comments about the command capability. |
| Description | A description of the command capability. |
| Request | If enabled, a definition of the request parameter, including: name, display name, schema, unit, and display unit. |
| Response | If enabled, a definition of the command response, including: name, display name, schema, unit, and display unit. |

To learn more about how devices implement commands, see [Telemetry, property, and command payloads > Commands and long running commands](concepts-telemetry-properties-commands.md#commands).

#### Offline commands

You can choose queue commands if a device is currently offline by enabling the **Queue if offline** option for a command in the device template.

This option uses IoT Hub cloud-to-device messages to send notifications to devices. To learn more, see the IoT Hub article [Send cloud-to-device messages](../../iot-hub/iot-hub-devguide-messages-c2d.md).

Cloud-to-device messages:

- Are one-way notifications to the device from your solution.
- Guarantee at-least-once message delivery. IoT Hub persists cloud-to-device messages in per-device queues, guaranteeing resiliency against connectivity and device failures.
- Require the device to implement a message handler to process the cloud-to-device message.

> [!NOTE]
> This option is only available in the IoT Central web UI. This setting isn't included if you export a model or component from the device template.


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

Use customizations when you need to modify an imported component or add IoT Central-specific features to a capability. You can customize any part of an existing device template's capabilities. For example, you can specify minimum and maximum temperature ranges as shown below:

:::image type="content" source="media/howto-set-up-template/customize.png" alt-text="How to do customizations":::

## Views

Generating default views is a quick way to visualize your important device information. The three default views are:

- **Commands**: A view with device commands, and allows your operator to dispatch them to your device.
- **Overview**: A view with device telemetry, displaying charts and metrics.
- **About**: A view with device information, displaying device properties.

After you've selected **Generate default views**, you see that they've been automatically added under the **Views** section of your device template.

### Custom views

Add views to a device template to enable operators to visualize a device by using charts and metrics. You can add your own custom views to a device template.

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

### Forms

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

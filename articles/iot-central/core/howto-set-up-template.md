---
title: Define a new IoT device type in Azure IoT Central
description: How to create an Azure IoT device template in your Azure IoT Central application. You define the telemetry, state, properties and commands for your device type.
author: dominicbetts
ms.author: dobett
ms.date: 10/31/2022
ms.topic: how-to
ms.service: iot-central
services: iot-central
ms.custom: [contperf-fy21q1, device-developer]

# This article applies to solution builders and device developers.
---

# Define a new IoT device type in your Azure IoT Central application

A device template is a blueprint that defines the characteristics and behaviors of a type of device that connects to an Azure IoT Central application.

This article describes how to create a device template in IoT Central. For example, you can create a device template for a sensor that sends telemetry, such as temperature and properties, such as location. From this device template, an operator can create and connect real devices.

The following screenshot shows an example of a device template:

:::image type="content" source="media/howto-set-up-template/device-template.png" alt-text="Screenshot that shows a device template." lightbox="media/howto-set-up-template/device-template.png":::

The device template has the following sections:

- Model - Use the model to define how your device interacts with your IoT Central application. Each model has a unique model ID and defines the capabilities of the device. Capabilities are grouped into interfaces. Interfaces let you reuse components across models or use inheritance to extend the set of capabilities.
- Raw data - View the raw data sent by your designated preview device. This view is useful when you're debugging or troubleshooting a device template.
- Views - Use views to visualize the data from the device and forms to manage and control a device.

To learn more, see [What are device templates?](concepts-device-templates.md).

To learn how to manage device templates by using the IoT Central REST API, see [How to use the IoT Central REST API to manage device templates.](../core/howto-manage-device-templates-with-rest-api.md)

## Create a device template

You have several options to create device templates:

- Design the device template in the IoT Central GUI.
- Import a device template from the [Azure Certified for IoT device catalog](https://aka.ms/iotdevcat). Optionally, customize the device template to your requirements in IoT Central.
- When the device connects to IoT Central, have it send the model ID of the model it implements. IoT Central uses the model ID to retrieve the model from the model repository and to create a device template. Add any cloud properties and views your IoT Central application needs to the device template.
- When the device connects to IoT Central, let IoT Central [autogenerate a device template](#autogenerate-a-device-template) definition from the data the device sends.
- Author a device model using the [Digital Twin Definition Language (DTDL) V2](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.v2.md) and [IoT Central DTDL extension](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.iotcentral.v2.md). Manually import the device model into your IoT Central application. Then add the cloud properties and views your IoT Central application needs.
- You can also add device templates to an IoT Central application using the [How to use the IoT Central REST API to manage device templates](howto-manage-device-templates-with-rest-api.md) or the [CLI](howto-manage-iot-central-from-cli.md).

> [!NOTE]
> In each case, the device code must implement the capabilities defined in the model. The device code implementation isn't affected by the cloud properties and views sections of the device template.

This section shows you how to import a device template from the catalog and how to customize it using the IoT Central GUI. This example uses the **ESP32-Azure IoT Kit** device template from the device catalog:

1. To add a new device template, select **+ New** on the **Device templates** page.
1. On the **Select type** page, scroll down until you find the **ESP32-Azure IoT Kit** tile in the **Use a pre-configured device template** section.
1. Select the **ESP32-Azure IoT Kit** tile, and then select **Next: Review**.
1. On the **Review** page, select **Create**.
The name of the template you created is **Sensor Controller**. The model includes components such as **Sensor Controller**, **SensorTemp**, and **Device Information interface**. Components define the capabilities of an ESP32 device. Capabilities include the telemetry, properties and commands.

:::image type="content" source="media/howto-set-up-template/device-template.png" alt-text="Screenshot that shows a Sensor controller device template." lightbox="media/howto-set-up-template/device-template.png":::

## Autogenerate a device template

You can also automatically create a device template from a connected device that's not yet assigned to a device template. IoT Central uses the telemetry and property values the device sends to infer a device model.

> [!NOTE]
> Currently, this preview feature can't use telemetry and properties from components. It can only generate capabilities from root telemetry and properties.

The following steps show how to use this feature:

1. Connect your device to IoT Central, and start sending the data. When you see the data in the **Raw data** view, select **Auto-create template** in the **Manage template** drop-down:

    :::image type="content" source="media/howto-set-up-template/infer-model-1.png" alt-text="Screenshot that shows raw data from unassigned device." lightbox="media/howto-set-up-template/infer-model-1.png":::

1. On the **Data preview** page, make any required changes to the raw data, and select **Create template**:

    :::image type="content" source="media/howto-set-up-template/infer-model-2.png" alt-text="Screenshot that shows data preview change that lets you edit data that IoT Central uses to generate the device template." lightbox="media/howto-set-up-template/infer-model-2.png":::

1. IoT Central generates a template based on the data format shown on the **Data preview** page and assigns the device to it. You can make further changes to the device template, such as renaming it or adding capabilities, on the **Device templates** page:

    :::image type="content" source="media/howto-set-up-template/infer-model-3.png" alt-text="Screenshot that shows how to rename the autogenerated device template." lightbox="media/howto-set-up-template/infer-model-3.png":::

## Manage a device template

You can rename or delete a template from the template's editor page.

After you've defined the template, you can publish it. Until the template is published, you can't connect a device to it, and it doesn't appear on the **Devices** page.

To learn more about modifying and versioning device templates, see [Edit an existing device template](howto-edit-device-template.md).

## Models

The model defines how your device interacts with your IoT Central application. Customize your model with more capabilities, add interfaces to inherit capabilities, or add new components that are based on other interfaces.

To create a device model, you can:

- Use IoT Central to create a custom model from scratch.
- Import a DTDL model from a JSON file. A device builder might have used Visual Studio Code to author a device model for your application.
- Select one of the devices from the Device Catalog. This option imports the device model that the manufacturer has published for this device. A device model imported like this is automatically published.

1. To view the model ID, select the root interface in the model and select **Edit identity**:

    :::image type="content" source="media/howto-set-up-template/view-id.png" alt-text="Screenshot that shows model ID for device template root interface.":::

1. To view the component ID, select **Edit Identity** on any of the component interfaces in the model.

To learn more, see the [IoT Plug and Play modeling guide](../../iot-pnp/concepts-modeling-guide.md).

### Interfaces and components

To view and manage the interfaces in your device model:

1. Go to **Device Templates** page and select the device template you created. The interfaces are listed in the **Models** section of the device template. The following screenshot shows an example of the **Sensor Controller** root interface in a device template:

    :::image type="content" source="media/howto-set-up-template/device-template.png" alt-text="Screenshot that shows root interface for a model":::

1. Select the ellipsis to add an inherited interface or component to the root interface. To learn more about interfaces and component see [multiple components](../../iot-pnp/concepts-modeling-guide.md#multiple-components) in the modeling guide.

    :::image type="content" source="media/howto-set-up-template/add-interface.png" alt-text="Screenshot that shows how to add interface or component." lightbox="media/howto-set-up-template/add-interface.png":::

1. To export a model or interface select **Export**.

1. To view or edit the DTDL for an interface or a capability, select **Edit DTDL**.

### Capabilities

Select **+ Add capability** to add capability to an interface or component. For example, you can add **Target Temperature** capability to a **SensorTemp** component.

:::image type="content" source="media/howto-set-up-template/add-capability.png" alt-text="Screenshot that shows how to add capability." lightbox="media/howto-set-up-template/add-capability.png":::

#### Telemetry

Telemetry is a stream of values sent from the device, typically from a sensor. For example, a sensor might report the ambient temperature as shown in the following screenshot:

:::image type="content" source="media/howto-set-up-template/telemetry.png" alt-text="Screenshot that shows how to add a telemetry type." lightbox="media/howto-set-up-template/telemetry.png":::

The following table shows the configuration settings for a telemetry capability:

| Field | Description |
| ----- | ----------- |
| Display Name | The display name for the telemetry value used on views and forms. |
| Name | The name of the field in the telemetry message. IoT Central generates a value for this field from the display name, but you can choose your own value if necessary. This field needs to be alphanumeric. |
| Capability Type | Telemetry. |
| Semantic Type | The semantic type of the telemetry, such as temperature, state, or event. The choice of semantic type determines which of the following fields are available. |
| Schema | The telemetry data type, such as double, string, or vector. The semantic type determines the available choices. Schema isn't available for the event and state semantic types. |
| Severity | Only available for the event semantic type. The severities are **Error**, **Information**, or **Warning**. |
| State Values | Only available for the state semantic type. Define the possible state values, each of which has display name, name, enumeration type, and value. |
| Unit | A unit for the telemetry value, such as **mph**, **%**, or **&deg;C**. |
| Display Unit | A display unit for use on views and forms. |
| Comment | Any comments about the telemetry capability. |
| Description | A description of the telemetry capability. |

#### Properties

Properties represent point-in-time values. You can set writable properties from IoT Central. For example, a device can use a writable property to let an operator set the target temperature as shown in the following screenshot:

:::image type="content" source="media/howto-set-up-template/property.png" alt-text="Screenshot that shows how to add property." lightbox="media/howto-set-up-template/property.png":::

The following table shows the configuration settings for a property capability:

| Field | Description |
| ----- | ----------- |
| Display Name | The display name for the property value used on views and forms. |
| Name | The name of the property. IoT Central generates a value for this field from the display name, but you can choose your own value if necessary. This field needs to be alphanumeric. |
| Capability Type | Property. |
| Semantic Type | The semantic type of the property, such as temperature, state, or event. The choice of semantic type determines which of the following fields are available. |
| Schema | The property data type, such as double, string, or vector. The semantic type determines the available choices. Schema isn't available for the event and state semantic types. |
| Writable | If the property isn't writable, the device can report property values to IoT Central. If the property is writable, the device can report property values to IoT Central, and IoT Central can send property updates to the device. |
| Severity | Only available for the event semantic type. The severities are **Error**, **Information**, or **Warning**. |
| State Values | Only available for the state semantic type. Define the possible state values, each of which has display name, name, enumeration type, and value. |
| Unit | A unit for the property value, such as **mph**, **%**, or **&deg;C**. |
| Display Unit | A display unit for use on views and forms. |
| Comment | Any comments about the property capability. |
| Description | A description of the property capability. |
|Color | An IoT Central extension to DTDL. |
|Min value | Set minimum value - An IoT Central extension to DTDL. |
|Max value | Set maximum value - An IoT Central extension to DTDL. |
|Decimal places | An IoT Central extension to DTDL. |

#### Commands

You can call device commands from IoT Central. Commands optionally pass parameters to the device and receive a response from the device. For example, you can call a command to reboot a device in 10 seconds as shown in the following screenshot:

:::image type="content" source="media/howto-set-up-template/command.png" alt-text="Screenshot that shows how to add commands." lightbox="media/howto-set-up-template/command.png":::

The following table shows the configuration settings for a command capability:

| Field | Description |
| ----- | ----------- |
| Display Name | The display name for the command used on views and forms. |
| Name | The name of the command. IoT Central generates a value for this field from the display name, but you can choose your own value if necessary. This field needs to be alphanumeric. |
| Capability Type | Command. |
| Queue if offline | If enabled, you can call the command even if the device is offline. If not enabled, you can only call the command when the device is online. |
| Comment | Any comments about the command capability. |
| Description | A description of the command capability. |
| Request | If enabled, a definition of the request parameter, including: name, display name, schema, unit, and display unit. |
| Response | If enabled, a definition of the command response, including: name, display name, schema, unit, and display unit. |
|Initial value | The default parameter value. This is an IoT Central extension to DTDL. |

To learn more about how devices implement commands, see [Telemetry, property, and command payloads > Commands and long running commands](../../iot-develop/concepts-message-payloads.md#commands).

#### Offline commands

You can choose queue commands if a device is currently offline by enabling the **Queue if offline** option for a command in the device template.

This option uses IoT Hub cloud-to-device messages to send notifications to devices. To learn more, see the IoT Hub article [Send cloud-to-device messages](../../iot-hub/iot-hub-devguide-messages-c2d.md).

Cloud-to-device messages:

- Are one-way notifications to the device from your solution.
- Guarantee at-least-once message delivery. IoT Hub persists cloud-to-device messages in per-device queues, guaranteeing resiliency against connectivity and device failures.
- Require the device to implement a message handler to process the cloud-to-device message.

> [!NOTE]
> Offline commands are marked as `durable` if you export the model as DTDL.

## Cloud properties

Use cloud properties to store information about devices in IoT Central. Cloud properties are never sent to a device. For example, you can use cloud properties to store the name of the customer who has installed the device, or the device's last service date.

:::image type="content" source="media/howto-set-up-template/cloud-properties.png" alt-text="Screenshot that shows how to add cloud properties.":::

> [!TIP]
> You can only add cloud properties to the **Root** component in the model.

The following table shows the configuration settings for a cloud property:

| Field | Description |
| ----- | ----------- |
| Display Name | The display name for the cloud property value used on views and forms. |
| Name | The name of the cloud property. IoT Central generates a value for this field from the display name, but you can choose your own value if necessary. |
| Semantic Type | The semantic type of the property, such as temperature, state, or event. The choice of semantic type determines which of the following fields are available. |
| Schema | The cloud property data type, such as double, string, or vector. The semantic type determines the available choices. |

## Views

Views let you define views and forms that let an operator monitor and interact with a device. Views use visualizations such as charts to show telemetry and property values.

Generating default views is a quick way to visualize your important device information. The three default views are:

### Default views

- **Commands**: A view with device commands, and allows your operator to dispatch them to your device.
- **Overview**: A view with device telemetry, displaying charts and metrics.
- **About**: A view with device information, displaying device properties.

After you've selected **Generate default views**, they're automatically added under the **Views** section of your device template.

### Custom views

Add views to a device template to enable operators to visualize a device by using charts and metrics. You can add your own custom views to a device template.

To add a view to a device template:

1. Go to your device template, and select **Views**.
1. Select **Visualizing the Device**.
1. Enter a name for your view in **View name**.
1. Select **Start with a visual** under add tiles and choose the type of visual for your tile. Then either select **Add tile** or drag and drop the visual onto the canvas. To configure the tile, select the gear icon.

:::image type="content" source="media/howto-set-up-template/start-visual.png" alt-text="Screenshot that shows how to start with a visual." lightbox="media/howto-set-up-template/start-visual.png":::

:::image type="content" source="media/howto-set-up-template/tile.png" alt-text="Screenshot that shows how to configure a tile." lightbox="media/howto-set-up-template/tile.png" :::

To test your view, select **Configure preview device**. This feature lets you see the view as an operator sees it after it's published. Use this feature to validate that your views show the correct data. Choose from the following options:

- No preview device.
- The real test device you've configured for your device template.
- An existing device in your application, by using the device ID.

### Forms

Add forms to a device template to enable operators to manage a device by viewing and setting properties. Operators can only edit cloud properties and writable device properties. You can have multiple forms for a device template.

1. Select the **Views** node, and then select the **Editing device and cloud data** tile to add a new view.

1. Change the form name to **Manage device**.

1. Select the properties and cloud properties to add to the form. Then select **Add section**.

1. Select **Save** to save your new form.

:::image type="content" source="media/howto-set-up-template/form.png" alt-text="Screenshot that shows how to configure a form." lightbox="media/howto-set-up-template/form.png":::

## Publish a device template

Before you can connect a device that implements your device model, you must publish your device template.

To publish a device template, go to you your device template, and select **Publish**.

After you publish a device template, an operator can go to the **Devices** page, and add either real or simulated devices that use your device template. You can continue to modify and save your device template as you're making changes. When you want to push these changes out to the operator to view under the **Devices** page, you must select **Publish** each time.

## Next steps

A suggested next step is to read about how to [Make changes to an existing device template](howto-edit-device-template.md).

---
title: Define a new IoT device type in Azure IoT Central | Microsoft Docs
description: This article shows you, as a solution builder, how to create a new Azure IoT device template in your Azure IoT Central application. You define the telemetry, state, properties, and commands for your type.
author: dominicbetts
ms.author: dobett
ms.date: 12/06/2019
ms.topic: how-to
ms.service: iot-central
services: iot-central
ms.custom: [contperfq1, device-developer]
---

# Define a new IoT device type in your Azure IoT Central application

*This article applies to solution builders and device developers.*

A device template is a blueprint that defines the characteristics and behaviors of a type of device that connects to an [Azure IoT Central application](concepts-app-templates.md).

For example, a builder can create a device template for a connected fan that has the following characteristics:

- Sends temperature telemetry
- Sends location property
- Sends fan motor error events
- Sends fan operating state
- Provides a writable fan speed property
- Provides a command to restart the device
- Gives you an overall view of the device via a dashboard

From this device template, an operator can create and connect real fan devices. All these fans have measurements, properties, and commands that operators use to monitor and manage them. Operators use the [device dashboards](#add-dashboards) and forms to interact with the fan devices. A device developer uses the template to understand how the device interacts with the application. To learn more, see [Telemetry, property, and command payloads](concepts-telemetry-properties-commands.md).

> [!NOTE]
> Only builders and administrators can create, edit, and delete device templates. Any user can create devices on the **Devices** page from existing device templates.

In an IoT Central application, a device template uses a device model to describe the capabilities of a device. As a builder, you have several options for creating device templates:

- Design the device template in IoT Central, and then [implement its device model in your device code](concepts-telemetry-properties-commands.md).
- Import a device template from the [Azure Certified for IoT device catalog](https://aka.ms/iotdevcat). Customize the device template to your requirements in IoT Central.
- Author a device model using the [Digital Twins Definition Language (DTDL) - version 2](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md). Visual Studio code has an extension that supports authoring DTDL models. To learn more, see [Install and use the DTDL authoring tools](../../iot-pnp/howto-use-dtdl-authoring-tools.md). Then publish the model to the public model repository. To learn more, see [Device model repository](../../iot-pnp/concepts-model-repository.md). Implement your device code from the model, and connect your real device to your IoT Central application. IoT Central finds and imports the device model from the public repository for you and generates a device template. You can then add any cloud properties, customizations, and dashboards your IoT Central application needs to the device template.
- Author a device model using the DTDL. Implement your device code from the model. Manually import the device model into your IoT Central application, and then add any cloud properties, customizations, and dashboards your IoT Central application needs.

You can also add device templates to an IoT Central application using the [REST API](/learn/modules/manage-iot-central-apps-with-rest-api/) or the [CLI](howto-manage-iot-central-from-cli.md).

Some [application templates](concepts-app-templates.md) already include device templates that are useful in the scenario the application template supports. For example, see [In-store analytics architecture](../retail/store-analytics-architecture.md).

## Create a device template from the device catalog

As a builder, you can quickly start building out your solution by using a certified device. See the list in the [Azure IoT Device Catalog](https://catalog.azureiotsolutions.com/alldevices). IoT Central integrates with the device catalog so you can import a device model from any of the certified devices. To create a device template from one of these devices in IoT Central:

1. Go to the **Device templates** page in your IoT Central application.
1. Select **+ New**, and then select any of the certified devices from the catalog. IoT Central creates a device template based on this device model.
1. Add any cloud properties, customizations, or views to your device template.
1. Select **Publish** to make the template available for operators to view and connect devices.

## Create a device template from scratch

A device template contains:

- A _device model_ that specifies the telemetry, properties, and commands that the device implements. These capabilities are organized into one or more components.
- _Cloud properties_ that define information that your IoT Central application stores about your devices. For example, a cloud property might record the date a device was last serviced. This information is never shared with the device.
- _Customizations_ let the builder override some of the definitions in the device model. For example, the builder can override the name of a device property. Property names appear in IoT Central dashboards and forms.
- _Dashboards and forms_ let the builder create a UI that lets operators monitor and manage the devices connected to your application.

To create a device template in IoT Central:

1. Go to the **Device Templates** page in your IoT Central application.
1. Select **+ New** > **IoT device**. Then select **Next: Customize**.
1. Enter a name for your template, such as **Thermostat**. Then select **Next: Review** and then select **Create**.
1. IoT Central creates an empty device template and lets you choose to create a custom model from scratch or import a DTDL model.

## Manage a device template

You can rename or delete a template from the template's home page.

After you've added a device model to your template, you can publish it. Until you've published the template, you can't connect a device based on this template for your operators to see in the **Devices** page.

## Create a capability model

To create a device model, you can:

- Use IoT Central to create a custom model from scratch.
- Import a DTDL model from a JSON file. A device builder might have used Visual Studio Code to author a device model for your application.
- Select one of the devices from the Device Catalog. This option imports the device model that the manufacturer has published for this device. A device model imported like this is automatically published.

## Manage a capability model

After you create a device model, you can:

- Add components to the model. A model must have at least one component.
- Edit model metadata, such as its ID, namespace, and name.
- Delete the model.

## Create a component

A device model must have at least one default component. A component is a reusable collection of capabilities.

To create a component:

1. Go to your device model, and choose **+ Add component**.

1. On the **Add a component interface** page, you can:

    - Create a custom component from scratch.
    - Import an existing component from a DTDL file. A device builder might have used Visual Studio Code to author a component interface for your device.

1. After you create a component, choose **Edit identity** to change the display name of the component.

1. If you choose to create a custom component from scratch, you can add your device's capabilities. Device capabilities are telemetry, properties, and commands.

### Telemetry

Telemetry is a stream of values sent from the device, typically from a sensor. For example, a sensor might report the ambient temperature.

The following table shows the configuration settings for a telemetry capability:

| Field | Description |
| ----- | ----------- |
| Display Name | The display name for the telemetry value used on dashboards and forms. |
| Name | The name of the field in the telemetry message. IoT Central generates a value for this field from the display name, but you can choose your own value if necessary. This field needs to be alphanumeric. |
| Capability Type | Telemetry. |
| Semantic Type | The semantic type of the telemetry, such as temperature, state, or event. The choice of semantic type determines which of the following fields are available. |
| Schema | The telemetry data type, such as double, string, or vector. The available choices are determined by the semantic type. Schema isn't available for the event and state semantic types. |
| Severity | Only available for the event semantic type. The severities are **Error**, **Information**, or **Warning**. |
| State Values | Only available for the state semantic type. Define the possible state values, each of which has display name, name, enumeration type, and value. |
| Unit | A unit for the telemetry value, such as **mph**, **%**, or **&deg;C**. |
| Display Unit | A display unit for use on dashboards and forms. |
| Comment | Any comments about the telemetry capability. |
| Description | A description of the telemetry capability. |

### Properties

Properties represent point-in-time values. For example, a device can use a property to report the target temperature it's trying to reach. You can set writable properties from IoT Central.

The following table shows the configuration settings for a property capability:

| Field | Description |
| ----- | ----------- |
| Display Name | The display name for the property value used on dashboards and forms. |
| Name | The name of the property. IoT Central generates a value for this field from the display name, but you can choose your own value if necessary. This field needs to be alphanumeric. |
| Capability Type | Property. |
| Semantic Type | The semantic type of the property, such as temperature, state, or event. The choice of semantic type determines which of the following fields are available. |
| Schema | The property data type, such as double, string, or vector. The available choices are determined by the semantic type. Schema isn't available for the event and state semantic types. |
| Writable | If the property isn't writable, the device can report property values to IoT Central. If the property is writable, the device can report property values to IoT Central and IoT Central can send property updates to the device.
| Severity | Only available for the event semantic type. The severities are **Error**, **Information**, or **Warning**. |
| State Values | Only available for the state semantic type. Define the possible state values, each of which has display name, name, enumeration type, and value. |
| Unit | A unit for the property value, such as **mph**, **%**, or **&deg;C**. |
| Display Unit | A display unit for use on dashboards and forms. |
| Comment | Any comments about the property capability. |
| Description | A description of the property capability. |

### Commands

You can call device commands from IoT Central. Commands optionally pass parameters to the device and receive a response from the device. For example, you can call a command to reboot a device in 10 seconds.

The following table shows the configuration settings for a command capability:

| Field | Description |
| ----- | ----------- |
| Display Name | The display name for the command used on dashboards and forms. |
| Name | The name of the command. IoT Central generates a value for this field from the display name, but you can choose your own value if necessary. This field needs to be alphanumeric. |
| Capability Type | Command. |
| Comment | Any comments about the command capability. |
| Description | A description of the command capability. |
| Request | If enabled, a definition of the request parameter, including: name, display name, schema, unit, and display unit. |
| Response | If enabled, a definition of the command response, including: name, display name, schema, unit, and display unit. |

#### Offline commands

You can choose queue commands if a device is currently offline by enabling the **Queue if offline** option for a command in the device template.

This option uses IoT Hub cloud-to-device messages to send notifications to devices. To learn more, see the IoT Hub article [Send cloud-to-device messages](../../iot-hub/iot-hub-devguide-messages-c2d.md).

Cloud-to-device messages:

- Are one-way notifications to the device from your solution.
- Guarantee at-least-once message delivery. IoT Hub persists cloud-to-device messages in per-device queues, guaranteeing resiliency against connectivity and device failures.
- Require the device to implement a message handler to process the cloud-to-device message.

> [!NOTE]
> This option is only available in the IoT Central web UI. This setting isn't included if you export a model or component from the device template.

## Manage a component

If you haven't published the component, you can edit the capabilities defined by the component. After you publish the component, if you want to make any changes, you must create a new version of the device template and [version the component](howto-version-device-template.md). You can make changes that don't require versioning, such as display names or units, in the **Customize** section.

You can also export the component as a JSON file if you want to reuse it in another capability model.

## Add cloud properties

Use cloud properties to store information about devices in IoT Central. Cloud properties are never sent to a device. For example, you can use cloud properties to store the name of the customer who has installed the device, or the device's last service date.

The following table shows the configuration settings for a cloud property:

| Field | Description |
| ----- | ----------- |
| Display Name | The display name for the cloud property value used on dashboards and forms. |
| Name | The name of the cloud property. IoT Central generates a value for this field from the display name, but you can choose your own value if necessary. |
| Semantic Type | The semantic type of the property, such as temperature, state, or event. The choice of semantic type determines which of the following fields are available. |
| Schema | The cloud property data type, such as double, string, or vector. The available choices are determined by the semantic type. |

## Add customizations

Use customizations when you need to modify an imported component or add IoT Central-specific features to a capability. You can only customize fields that don't break component compatibility. For example, you can:

- Customize the display name and units of a capability.
- Add a default color to use when the value appears on a chart.
- Specify initial, minimum, and maximum values for a property.

You can't customize the capability name or capability type. If there are changes you can't make in the **Customize** section, you'll need to version your device template and component to modify the capability.

### Generate default views

Generating default views is a quick way to visualize your important device information. You have up to three default views generated for your device template:

- **Commands**: A view with device commands, and allows your operator to dispatch them to your device.
- **Overview**: A view with device telemetry, displaying charts and metrics.
- **About**: A view with device information, displaying device properties.

After you've selected **Generate default views**, you see that they've been automatically added under the **Views** section of your device template.

## Add dashboards

Add dashboards to a device template to enable operators to visualize a device by using charts and metrics. You can have multiple dashboards for a device template.

To add a dashboard to a device template:

1. Go to your device template, and select **Views**.
1. Choose **Visualizing the Device**.
1. Enter a name for your dashboard in **Dashboard Name**.
1. Add tiles to your dashboard from the list of static, property, cloud property, telemetry, and command tiles. Drag and drop the tiles you want to add to your dashboard.
1. To plot multiple telemetry values on a single chart tile, select the telemetry values, and then select **Combine**.
1. Configure each tile you add to customize how it displays data. Access this option by selecting the gear icon, or by selecting **Change configuration** on your chart tile.
1. Arrange and resize the tiles on your dashboard.
1. Save the changes.

### Configure preview device to view dashboard

To view and test your dashboard, select **Configure preview device**. This feature lets you see the dashboard as your operator sees it after it's published. Use this feature to validate that your views show the correct data. You can choose from the following options:

- No preview device.
- The real test device you've configured for your device template.
- An existing device in your application, by using the device ID.

## Add forms

Add forms to a device template to enable operators to manage a device by viewing and setting properties. Operators can only edit cloud properties and writable device properties. You can have multiple forms for a device template.

To add a form to a device template:

1. Go to your device template, and select **Views**.
1. Choose **Editing Device and Cloud data**.
1. Enter a name for your form in **Form Name**.
1. Select the number of columns to use to lay out your form.
1. Add properties to an existing section on your form, or select properties and choose **Add Section**. Use sections to group properties on your form. You can add a title to a section.
1. Configure each property on the form to customize its behavior.
1. Arrange the properties on your form.
1. Save the changes.

## Publish a device template

Before you can connect a device that implements your device model, you must publish your device template.

After you publish a device template, you can only make limited changes to the device model. To modify a component, you need to [create and publish a new version](./howto-version-device-template.md).

To publish a device template, go to you your device template, and select **Publish**.

After you publish a device template, an operator can go to the **Devices** page, and add either real or simulated devices that use your device template. You can continue to modify and save your device template as you're making changes. When you want to push these changes out to the operator to view under the **Devices** page, you must select **Publish** each time.

## Next steps

If you're a device developer, a suggested next step is to read about [device template versioning](./howto-version-device-template.md).

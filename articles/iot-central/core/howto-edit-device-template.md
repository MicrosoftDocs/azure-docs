---
title: Edit device templates in your Azure IoT Central application
description: Iteratively update your device templates without impacting your live connected devices by using versioned device templates.
author: dominicbetts
ms.author: dobett
ms.date: 10/31/2022
ms.topic: how-to
ms.service: iot-central
services: iot-central
ms.custom: device-developer
---

# Edit an existing device template

A device template includes a model that describes how a device interacts with IoT Central. This model defines the capabilities of the device and how to IoT Central interacts with them. Devices can send telemetry and property values to IoT Central, IoT Central can send property updates and commands to a device. IoT Central also uses the model to define interactions with IoT Central features such as jobs, rules, and exports.

Changes to the model in a device template can affect your entire application, including any connected devices. Changes to a capability that's used by rules, exports, device groups, or jobs may cause them to behave unexpectedly or not work at all. For example, if you remove a telemetry definition from a template:

- IoT Central is no longer able interpret that value. IoT Central shows device data that it can't interpret as **Unmodeled data** on the device's **Raw data** page.
- IoT Central no longer includes the value in any data exports.

To help you avoid any unintended consequences from editing a device template, this article includes recommendations based on your current development life-cycle stage. In general, the earlier you are in the development life cycle, the more tolerant you can be to device template changes.

To learn more about device templates and how to create one, see [What are device templates?](concepts-device-templates.md) and [Set up a device template](howto-set-up-template.md).

To learn how to manage device templates by using the IoT Central REST API, see [How to use the IoT Central REST API to manage device templates.](../core/howto-manage-device-templates-with-rest-api.md)

## Modify a device template

Additive changes, such as adding a capability or interface to a model are non-breaking changes. You can make additive changes to a model at any stage of the development life cycle.

Breaking changes include removing parts of a model, or changing a capability name or schema type. These changes could cause application features such as rules, exports, or dashboards to display error messages and stop working.

In early device development phases, while you're still designing and testing the model, there's greater tolerance for making changes directly to your device model. Before you connect production devices to a device template, you can edit the device template directly. IoT Central applies those changes automatically to devices when you publish the device template.

After you attach production devices to a device template, evaluate the impact of any changes before you edit a device template. You shouldn't make breaking changes to a device template in production. To make such changes, create a new version of the device template. Test the new device template and then migrate your production devices to the new template at a scheduled downtime.

### Update an IoT Edge device template

For an IoT Edge device, the model groups capabilities by modules that correspond to the IoT Edge modules running on the device. The deployment manifest is a separate JSON document that tells an IoT Edge device which modules to install, how to configure them, and what properties the module has. If you've modified a deployment manifest, you can update the device template to include the modules and properties defined in the manifest:

1. Navigate to the **Modules** node in the device template.
1. On the **Modules summary** page, select **Import modules from manifest**.
1. Select the appropriate deployment manifest and select **Import**.

To learn more, see [IoT Edge devices and IoT Central](concepts-iot-edge.md#iot-edge-devices-and-iot-central).

### Edit and publish actions

The following actions are useful when you edit a device template:

- _Save_. When you change part of your device template, saving the changes creates a draft that you can return to. These changes don't yet affect connected devices. Any devices created from this template won't have the saved changes until you publish it.
- _Publish_. When you publish the device template, it applies any saved changes to existing device instances. Newly created device instances always use the latest published template.
- _Version a template_. When you version a device template, it creates a new template with all the latest saved changes. Existing device instances aren't impacted by changes made to a new version. To learn more, see [Version a device template](#version-a-device-template).
- _Version an interface_. When you version an interface, it creates a new interface with all the latest saved capabilities. You can reuse an interface in multiples locations within a template. That's why a change made to one reference to an interface changes all the places in the template that use the interface. When you version an interface, this behavior changes because the new version is now a separate interface. To learn more, see [Version an interface](#version-an-interface).
- _Migrate a device_. When you migrate a device, the device instance swaps from one device template to another. Device migration can cause a short while IoT Central processes the changes. To learn more, see [Migrate a device across versions](#migrate-a-device-across-versions).

### Version numbers

Both device models and interfaces have version numbers. Different version numbers let models or interfaces share an `@id` value, while providing a history of updates. Version numbers only increment if you choose to version the template or interface, or if you deliberately change the version number. You should change a version number when you make a major change to a template or interface.

The following snippet shows the device model for a thermostat device. The device model has a single interface. You can see the version number, `1`, at the end of the`@id` field.

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:com:example:Thermostat;1",
  "@type": "Interface",
  "displayName": "Thermostat",
  "description": "Reports current temperature and provides desired temperature control.",
  "contents": [
    // ...
  ]
}
```

To view this information in the IoT Central UI, select **View identity** in the device template editor:

:::image type="content" source="media/howto-edit-device-template/view-identity.png" alt-text="Screenshot that shows how to view the identity of an interface to see the version number." lightbox="media/howto-edit-device-template/view-identity.png":::

## Version a device template

To version a device template:

1. Go to the **Device templates** page.
1. Select the device template you want to version.
1. Select **Version** at the top of the page and give the template a new name. IoT Central suggests a new name, which you can edit.
1. Select **Create**.

Now you've created a new template with a unique identity that isn't attached to any existing devices.

## Version an interface

To version an interface:

1. Go to the **Device templates** page.
1. Select the device template you have in a draft mode.
1. Select the published interface that you want to version and edit.
1. Select **Version** at the top of the interface page.
1. Select **Create**.

Now you've created a new interface with a unique identity isn't synchronized with the previous interface version.

## Migrate a device across versions

You can create multiple versions of the device template. Over time, you'll have multiple connected devices using these device templates. You can migrate devices from one version of your device template to another. The following steps describe how to migrate a device:

1. Go to the **Devices** page.
1. Select the device you need to migrate to another version.
1. Choose **Migrate**:

    :::image type="content" source="media/howto-edit-device-template/migrate-device.png" alt-text="Screenshot that shows how to choose the option to start migrating a device." lightbox="media/howto-edit-device-template/migrate-device.png":::

1. Select the device template with the version you want to migrate the device to and select **Migrate**.

> [!TIP]
> You can use a job to migrate all the devices in a device group to a new device template at the same time.

## Next steps

If you're an operator or solution builder, a suggested next step is to learn [how to manage your devices](./howto-manage-devices-individually.md).

If you're a device developer, a suggested next step is to read about [Azure IoT Edge devices and Azure IoT Central](./concepts-iot-edge.md).

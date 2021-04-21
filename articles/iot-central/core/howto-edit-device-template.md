---
title: Editing a device template within your Azure IoT Central apps | Microsoft Docs
description: Iterate over your device templates without impacting your live connected devices
author: dominicbetts
ms.author: dobett
ms.date: 04/13/2021
ms.topic: how-to
ms.service: iot-central
services: iot-central
ms.custom: device-developer
---

# Make changes to an existing device template

*This article applies to solution builders and device developers.*

A device template includes a schema that describes how a device interacts with IoT Central. This schema provides a definition for how to read the device data and send information back to the device. Parts of template, such as telemetry, properties, and commands, help define interactions between the device and IoT Central, such as Jobs, Rules, and Exports.

Therefore, making changes to a device template can result in impacts across your entire application, especially if devices are connected to the template. Editing a capability used across an application within Rules, Exports, Device Groups, or Jobs can cause those areas of the application to behave unexpectedly or not trigger at all. For example, removing a telemetry from a template can cause device data that is sending to go from modeled to unmodeled, because IoT Central no longer has a way to interpret that data. If that telemetry value was specifically selected for export, the data would no longer export.

To avoid unintended consequences from editing a device template, follow the recommendations in this article that help align your changes to your stages of development.

> To learn more about what a device template is or how to create one, see [What are device templates?](concepts-device-templates.md) and [Set up a device template](howto-set-up-template.md)

## Modify a device template across development stages

Additive changes, like adding a capability or interface, to a device template will not cause other areas of the application to break. Additive changes can be made directly to a device template at any stage of development. Breaking changes include removing parts of a device template, changing names, or changing schemas. These changes could cause parts of the app, such as Rules, Exports, or Dashboards to display error messages and stop executing.

In early phases of device development, the model and device are still being designed and tested, there is greater tolerance for making changes directly to your device model. Prior to connecting live production devices to a model, the template can be edited directly and those changes will automatically be applied to devices upon publishing a device template.

Once production devices have been attached to a device template, the impacts of changes should be evaluated before directly editing a device template. Breaking changes should not be made on a device template in production. To make these changes, a new version of the device template should first be created. The new device template can be tested out, and then production devices can be migrated to the new template at a scheduled downtime.

## Update an IoT Edge device template

IoT Edge device templates contain two parts: a device model and a deployment manifest. The device model defines the modules and capabilities within IoT Central. The deployment manifest is a separate JSON document that tells an IoT Edge device which modules to install and how to configure them. The device model can be updated according the same principles in the section above, with one additional consideration: Every module defined in the device model must also be included in the deployment manifest. Once an IoT Edge template has been published, a new version must be created in order to replace the deployment manifest. IoT Edge device instances must be migrated to the new template version to receive the deployment manifest update.

> To learn more, see [oT Edge deployment manifests and IoT Central device templates](concepts-iot-edge.md#iot-edge-deployment-manifests-and-iot-central-device-templates).

## Edit and publish actions

- _Save_. When you make changes to a part of your device template, saving the changes will preserve them as a draft that you can refer back to. These changes will not yet impact connected devices. Any devices created from this template will not have the saved changes, until the changes are published.
- _Publish_. Publishing changes to the template applies any saved modifications to existing device instances. Newly created device instances will always be created with the latest published template.
- _Version a template_. Versioning a device template creates a new template with all of the latest saved changes. Existing devices instances will not be impacted by changes made to a new version.
- _Version an interface_. Versioning an interface will create a new interface with all of the latest saved capabilities. Interfaces can be reused within templates, so that any changes made to one reference to an interface will impact all areas of the template where the interface is reused. When an interface is versioned, this is no longer the case, as the new version acts like a separate interface.
- _Migrate a device_. Migrating a device swaps the device instance from one device template to another. This can cause a short delay where data being processed by IoT Central.

## Version numbers

This section explains the purpose of version numbers. Both device models and interfaces have version numbers. Differing version numbers allow models or interfaces to largely share '@id', while providing a history of progression. Version numbers will only increment if you choose to version the template or interface, or if you deliberately change the version number. It's recommended to change a version number when issuing a major change to a template or interface.

The following snippet shows the device model for a thermostat device. The device model has a single interface. You can see the version number at the end of the`@id` field.

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

:::image type="content" source="media/howto-version-device-template/view-identity.png" alt-text="View the identity of an interface to see the version number":::

The following sections walk you through the steps of performing these actions.

## Version a device template

To version a device template:

1. Go to the **Device templates** page.
1. Select the device template you're trying to version.
1. Select the **Version** button at the top of the page and give the template a new name. IoT Central suggests a new name, which you can edit.
1. Select **Create**.
1. Now you've created a new template with a unique identity that is no not attached to any existing devices.

## Version an interface

To version an interface:

1. Go to the **Device templates** page.
1. Select the device template you have in a draft mode.
1. Select the interface that is in published mode that you want to version and edit.
1. Select the **Version** button at the top of the interface page.
1. Select **Create**.
1. Now you've created a new interface with a unique identity will not be sychronized with the previous interface version.

## Migrate a device across versions

You can create multiple versions of the device template. Over time, you'll have multiple connected devices using these device templates. You can migrate devices from one version of your device template to another. The following steps describe how to migrate a device:

1. Go to the **Devices** page.
1. Select the device you need to migrate to another version.
1. Choose **Migrate**:
    :::image type="content" source="media/howto-version-device-template/migrate-device.png" alt-text="Choose the option to start migrating a device":::
1. Select the device template with the version you want to migrate the device to and select **Migrate**.

## Next steps

If you're an operator or solution builder, a suggested next step is to learn [how to manage your devices](./howto-manage-devices.md).

If you're a device developer, a suggested next step is to read about [Azure IoT Edge devices and Azure IoT Central](./concepts-iot-edge.md).

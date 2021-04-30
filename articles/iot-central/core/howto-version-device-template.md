---
title: Understanding device template versioning for your Azure IoT Central apps | Microsoft Docs
description: Iterate over your device templates by creating new versions and without impacting your live connected devices
author: dominicbetts
ms.author: dobett
ms.date: 11/06/2020
ms.topic: how-to
ms.service: iot-central
services: iot-central
ms.custom: device-developer
---

# Create a new device template version

*This article applies to solution builders and device developers.*

A device template includes a schema that describes how a device interacts with IoT Central. These interactions include telemetry, properties, and commands. Both the device and the IoT Central application rely on a shared understanding of this schema to exchange information. You can only make limited changes to the schema without breaking the contract, that's why most schema changes require a new version of the device template. Versioning the device template lets older devices continue with the schema version they understand, while newer or updated devices use a later schema version.

The schema in a device template is defined in the device model and its interfaces. Device templates include other information, such as cloud properties, display customizations, and views. If you make changes to those parts of the device template that don't define how the device exchanges data with IoT Central, you don't need to version the template.

You must always publish an updated device template before an operator can use it. IoT Central stops you from publishing breaking changes to a device template without first versioning the template.

> [!NOTE]
> To learn more about how to create a device template see [Set up and manage a device template](howto-set-up-template.md)

## Versioning rules

This section summarizes the versioning rules that apply to device templates. Both device models and interfaces have version numbers. The following snippet shows the device model for a thermostat device. The device model has a single interface. You can see the version number at the end of the`@id` field.

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

The following list shows the rules that determine when you must create a new version:

* After a device model is published, you can't remove any interfaces, even in a new version of the device template.
* After a device model is published, you can add an interface if you create a new version of the device template.
* After a device model is published, you can replace an interface with a newer version if you create a new version of the device template. For example, if the sensor v1 device template uses the thermostat v1 interface, you can create a sensor v2 device template that uses the thermostat v2 interface.
* After an interface is published, you can't remove any of the interface contents, even in a new version of the device template.
* After an interface is published, you can add items to the contents of an interface if you create a new version of the interface and device template. Items that you can add to the interface include telemetry, properties, and commands.
* After an interface is published, you can make non-schema changes to existing items in the interface if you create a new version of the interface and device template. Non-schema parts of an interface item include the display name and the semantic type. The schema parts of an interface item that you can't change are name, capability type, and schema.

The following sections walk you through some examples of modifying device templates in IoT Central.

## Customize the device template without versioning

Certain elements of your device capabilities can be edited without needing to version your device template and interfaces. For example, some of these fields include display name, semantic type, minimum value, maximum value, decimal places, color, unit, display unit, comment, and description. To add one of these customizations:

1. Go to the **Device templates** page.
1. Select the device template you wish to customize.
1. Choose the **Customize** tab.
1. All the capabilities defined in your device model are listed here. You can edit, save, and use all of these fields without the need to version your device template. If there are fields you wish to edit that are read-only, you must version your device template to change them. Select a field you wish to edit and enter in any new values.
1. Select **Save**. Now these values override anything that was initially saved in your device template and are used across the application.

## Version a device template

Creating a new version of your device template creates a draft version of the template where the device model can be edited. Any published interfaces remain published until they're individually versioned. To modify a published interface, first create a new device template version.

Only version the device template when you're trying to edit a part of the device model that you can't edit in the customizations section.

To version a device template:

1. Go to the **Device templates** page.
1. Select the device template you're trying to version.
1. Select the **Version** button at the top of the page and give the template a new name. IoT Central suggests a new name, which you can edit.
1. Select **Create**.
1. Now your device template is in draft mode. You can see your interfaces are still locked. Version any interfaces you want to modify.

## Version an interface

Versioning an interface allows you to add and update capabilities inside the interface you had already created.

To version an interface:

1. Go to the **Device templates** page.
1. Select the device template you have in a draft mode.
1. Select the interface that is in published mode that you want to version and edit.
1. Select the **Version** button at the top of the interface page.
1. Select **Create**.
1. Now your interface is in draft mode. You can add or edit capabilities to your interface without breaking existing customizations and views.

## Migrate a device across versions

You can create multiple versions of the device template. Over time, you'll have multiple connected devices using these device templates. You can migrate devices from one version of your device template to another. The following steps describe how to migrate a device:

1. Go to the **Devices** page.
1. Select the device you need to migrate to another version.
1. Choose **Migrate**:
    :::image type="content" source="media/howto-version-device-template/migrate-device.png" alt-text="Choose the option to start migrating a device":::
1. Select the device template with the version number you want to migrate the device to and select **Migrate**.

## Next steps

If you're an operator or solution builder, a suggested next step is to learn [how to manage your devices](./howto-manage-devices.md).

If you're a device developer, a suggested next step is to read about [Azure IoT Edge devices and Azure IoT Central](./concepts-iot-edge.md).

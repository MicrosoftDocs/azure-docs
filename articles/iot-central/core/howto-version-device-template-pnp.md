---
title: Understanding device template versioning for your Azure IoT Central apps | Microsoft Docs
description: Iterate over your device templates by creating new versions and without impacting your live connected devices
author: sarahhubbard
ms.author: sahubbar
ms.date: 07/17/2019
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: peterpr
---

# Create a new device template version (preview features)

[!INCLUDE [iot-central-pnp-original](../../../includes/iot-central-pnp-original-note.md)]

Azure IoT Central allows rapid development of IoT Applications. You can quickly iterate over your device template designs by adding, editing, or deleting device capabilities, views, and customizations. Once you have published your device template, the device capability model shows as **Published** with lock icons next to the model. In order to make changes to the device capability model, you will need to create a new version of the device template. Meanwhile the cloud properties, customizations, and views can all be edited at any time without needing to version the device template. Once you have saved any of these changes, you can publish the device template to make the latest changes available for the operator to view in Device Explorer.

> [!NOTE]
> To learn more about how to create a device template see [Set up and manage a device template](howto-set-up-template-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json)

## Add customizations to the device template without versioning

Certain elements of your device capabilities can be edited without needing to version your device template and interfaces. For example, some of these fields include display name, semantic type, minimum value, maximum value, decimal places, color, unit, display unit, comment, and description. To add one of these customizations:

1. Go to the **Device Templates** page.
1. Select the device template you wish to customize.
1. Choose the **Customize** tab.
1. All of the capabilities defined in your device capability model will be listed here. All of the fields you can edit here can be saved and used across your application, without needing to version your device template. If there are fields you wish to edit that are read-only, you will need to version your device template to change these. Select a field you wish to edit and enter in any new values.
1. Click **Save**. Now these values will override anything that was initially saved in your device template and will be used across the application.

## Versioning a device template

Creating a new version of your device template will create a draft version of the template where the device capability model can be edited. Any published interfaces will remain published until they are individually versioned. In order to modify a published interface, you must first create a new device template version.

The device template should only be versioned when you are trying to edit a part of the device capability model that you can not edit in the customizations section of the device template. 

In order to version a device template:

1. Go to the **Device Templates** page.
1. Select the device template you are trying to version.
1. Click the **Version** button at the top of the page and give the template a new name. We have suggested a new name for you which can be edited.
1. Click **Create**.
1. Now your device template is in draft mode. You will see your interfaces are still locked and must be individually versioned to be edited. 

### Versioning an interface

Versioning an interface allows you to add, update, and remove the capabilities inside the interface you had already created. 

In order to version an interface:

1. Go to the **Device Templates** page.
1. Select the device template you have in a draft mode.
1. Select the interface that is in published mode that you wish to version and edit.
1. Click the **Version** button at the top of the interface page. 
1. Click **Create**.
1. Now your interface is in draft mode. You will be able to add or edit capabilities to your interface without breaking existing customizations and views. 

> [!NOTE]
> Standard interfaces published by Azure IoT can not be versioned or edited. These standard interfaces are used for device certification.

> [!NOTE]
> Once the interface has been published, you can not delete any of it's capabilities even in a draft mode. Capabilities can only be edited or added to the interface in draft mode.


## Migrate a device across device template versions

You can create multiple versions of the device template. Over time, you will have multiple connected devices using these device templates. You can migrate devices from one version of your device template to another. The following steps describe how to migrate a device:

1. Go to the **Device Explorer** page.
1. Select the device you need to migrate to another version.
1. Choose **Migrate**.
1. Select the device template with the version number you want to migrate the device to and choose **Migrate**.

![How to migrate a device](media/howto-version-device-template-pnp/pick-version.png)

## Next steps

Now that you have learned how to use device template versions in your Azure IoT Central application, here is the suggested next step:

> [!div class="nextstepaction"]
> [How to create telemetry rules](howto-create-telemetry-rules-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json)

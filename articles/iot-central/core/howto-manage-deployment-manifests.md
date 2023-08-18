---
title: Manage Azure IoT Edge deployment manifests
description: This article describes how to the deployment manifests for the IT Edge devices that connect to your IoT Central application.
services: iot-central
ms.service: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 11/22/2022
ms.topic: how-to
---

# Manage IoT Edge deployment manifests in your IoT Central application

A deployment manifest lets you specify the modules the IoT Edge runtime should download and configure. An IoT Edge device can download a deployment manifest when it first connects to your IoT Central application. This article describes how you manage deployment manifests in your IoT Central application.

To learn more about IoT Edge and IoT Central, see [Connect Azure IoT Edge devices to an Azure IoT Central application](concepts-iot-edge.md).

To learn how to manage deployment manifests by using the IoT Central REST API, see [How to use the IoT Central REST API to manage deployment manifests](../core/howto-manage-deployment-manifests-with-rest-api.md).

## Manage deployment manifests

The **Edge manifests** page lets you manage the deployment manifests in your application. From this page you can:

- Upload or create deployment manifests
- Modify existing deployment manifests
- Delete deployment manifests

### Upload and create deployment manifests

When you create a new deployment manifest, you can upload the deployment manifest JSON file or start with an existing manifest:

1. On the **Edge manifests** page, select **+ New**.

1. Enter a name for the deployment manifest.

1. If your application uses organizations, select an organization to associate the deployment manifest with.

1. Browse for a deployment manifest file to upload or choose an existing deployment manifest as a starting point for your new one. IoT Central validates any uploaded files.

    :::image type="content" source="media/howto-manage-deployment-manifests/uploaded-deployment-manifest.png" alt-text="Screenshot that shows an uploaded and validated deployment manifest.":::

1. Select **Next**. The **Review and finish** page shows information about the deployment manifest and the modules it defines. You can also view the raw JSON.

1. Select **Create**. The **Edge manifests** page now includes the new deployment manifest.

> [!TIP]
> If you have a large number of deployment manifest, you can sort and filter the list shown on the **Edge manifests** page.

### Edit the JSON source of a deployment manifest

To modify a deployment manifest by editing the JSON directly:

1. Navigate to the **Edge manifests** page.

1. Select **Edit JSON** in the context menu for the deployment manifest you want to modify.

1. Use the JSON editor to make the required changes. Then select **Save**.

### Replace the content of a deployment manifest

To completely replace the content of a deployment manifest:

1. Navigate to the **Edge manifests** page.

1. Select the deployment manifest you want to replace.

1. In the **Customize** dialog, browse for a new deployment manifest file to upload or choose an existing deployment manifest as a starting point. IoT Central validates any uploaded files.

1. Select **Next**. The **Review and finish** page shows information about the new deployment manifest and the modules it defines. You can also view the raw JSON.

1. Select **Save**. The **Edge manifests** page now includes the updated deployment manifest.

## Manage IoT Edge devices

When you add an IoT Edge device on the devices page, you can choose a deployment manifest for the device. In the **Create a new device** dialog, you can choose from the list of previously uploaded device manifests on the **Edge manifests** page. It's also possible to add a deployment manifest directly to a device after you create the device.

If you add an IoT Edge device that isn't assigned to a device template, the **Create a new device** dialog looks like the following screenshot:

:::image type="content" source="media/howto-manage-deployment-manifests/unassigned-device.png" alt-text="Screenshot that shows adding an unassigned device to your application.":::

To choose the deployment manifest for the device:

1. Toggle **Azure IoT Edge device?** to **Yes**.

1. Select the IoT Edge deployment manifest to use. You can also choose to assign a deployment manifest after you create the device.

1. Select **Create**.

If you add an IoT Edge device that is assigned to a device template, the **Create a new device** dialog looks like the following screenshot:

:::image type="content" source="media/howto-manage-deployment-manifests/assigned-device.png" alt-text="Screenshot that shows adding an assigned device to your application.":::

To choose the deployment manifest for the device:

1. The **Azure IoT Edge device?** toggle is already set to **Yes** because IoT Central recognizes that you're using an IoT Edge device template.

1. Select the IoT Edge deployment manifest to use. You can also choose to assign a deployment manifest after you create the device.

1. Select **Create**.

When an IoT Edge device connects to your application for the first time, it downloads the deployment manifest, configures the modules specified in the deployment manifest, and runs the modules.

If you don't select a deployment manifest when you create an IoT Edge device, you can assign one later either individually or to multiple devices by using a job.

### Update the deployment manifest a device uses

You can manage the deployment manifest for an existing device:

:::image type="content" source="media/howto-manage-deployment-manifests/manage-manifest.png" alt-text="Screenshot that shows the options to manage a deployment manifest on a device.":::

Use **Assign edge manifest** to select a previously uploaded deployment manifest from the **Edge manifests** page. You can also use this option to manually notify a device if you've modified the deployment manifest on the **Edge manifests** page.

Use **Edit manifest** to modify the deployment manifest for this device. Changes you make here don't affect the deployment manifest on the **Edge manifests** page.

### Jobs

To assign or update the deployment manifest for multiple devices, use a [job](howto-manage-devices-in-bulk.md). Use the **Change edge deployment manifest** job type:

:::image type="content" source="media/howto-manage-deployment-manifests/manifest-job.png" alt-text="Screenshot that shows the deployment manifest job type.":::

## Add modules and properties to device templates

A deployment manifest defines the modules to run on the device and optionally [writable properties](../../iot-edge/module-composition.md?#define-or-update-desired-properties) that you can use to configure modules.

If you're assigning a device template to an IoT Edge device, you may want to define the modules and writable properties in the device template. To add the modules and property definitions to a device template:

1. Navigate to the **Modules Summary** page of the IoT Edge device template.
1. Select **Import modules from manifest**.
1. Select the appropriate deployment manifest from the list.
1. Select **Import**. IoT Central adds the custom modules defined in the deployment manifest to the device template. The names of the modules in the device template match the names of the custom modules in the deployment manifest. The generated interface includes property definitions for the properties defined for the custom module in the deployment manifest:

:::image type="content" source="media/howto-manage-deployment-manifests/import-modules.png" alt-text="Screenshot the shows importing module definitions to a device template.":::

## Next steps

Now that you've learned how to manage IoT Edge deployment manifests in your Azure IoT Central application, the suggested next step is to learn how to [How to connect devices through an IoT Edge transparent gateway](how-to-connect-iot-edge-transparent-gateway.md).

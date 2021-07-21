---
title: Tutorial - Define a new gateway device type in Azure IoT Central | Microsoft Docs
description: This tutorial shows you, as a builder, how to define a new IoT gateway device type in your Azure IoT Central application.
author: rangv
ms.author: rangv
ms.date: 10/22/2019
ms.topic: tutorial
ms.service: iot-central
services: iot-central
ms.custom: mvc
manager: peterpr
---

# Tutorial - Define a new IoT gateway device type in your Azure IoT Central application

This tutorial shows you how to use a gateway device template to define a gateway device in your IoT Central application. You then configure several downstream devices that connect to your IoT Central application through the gateway device. 

In this tutorial, you create a **Smart Building** gateway device template. A **Smart Building** gateway device has relationships with other downstream devices.

![Diagram of relationship between gateway device and downstream devices](./media/tutorial-define-gateway-device-type/gatewaypattern.png)

As well as enabling downstream devices to communicate with your IoT Central application, a gateway device can also:

* Send its own telemetry, such as temperature.
* Respond to writable property updates made by an operator. For example, an operator could changes the telemetry send interval.
* Respond to commands, such as rebooting the device.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create downstream device templates
> * Create a gateway device template
> * Publish the device template
> * Create the simulated devices

## Prerequisites

To complete the steps in this tutorial, you need:

[!INCLUDE [iot-central-prerequisites-basic](../../../includes/iot-central-prerequisites-basic.md)]

## Create downstream device templates

This tutorial uses device templates for an **S1 Sensor** device and an **RS40 Occupancy Sensor** device to generate simulated downstream devices.

To create a device template for an **S1 Sensor** device:

1. In the left pane, select **Device Templates**. Then select **+ New** to start adding the template.

1. Scroll down until you can see the tile for the **Minew S1** device. Select the tile and then select **Next: Customize**.

1. On the **Review** page, select **Create** to add the device template to your application. 

To create a device template for an **RS40 Occupancy Sensor** device:

1. In the left pane, select **Device Templates**. Then select **+ New** to start adding the template.

1. Scroll down until you can see the tile for the ***RS40 Occupancy Sensor** device. Select the tile and then select **Next: Customize**.

1. On the **Review** page, select **Create** to add the device template to your application. 

You now have device templates for the two downstream device types:

![Device templates for downstream devices](./media/tutorial-define-gateway-device-type/downstream-device-types.png)


## Create a gateway device template

In this tutorial you create a device template for a gateway device from scratch. You use this template later to create a simulated gateway device in your application.

To add a new gateway device template to your application:

1. In the left pane, select **Device Templates**. Then select **+ New** to start adding the template.

1. On the **Select template type** page, select the **IoT Device** tile, and then select **Next: Customize**.

1. On the **Customize device** page, select **This is a gateway device** checkbox.

1. Enter **Smart Building gateway device** as the template name and then select **Next: Review**.

1. On the **Review** page, select **Create**. 



1. On the **Create a model** page, select the **Custom model** tile.

1. Select **+ Add capability** to add a capability.

1. Enter **Send Data** as the display name, and then select **Property** as the capability type.

1. Select **+ Add capability** to add another capability. Enter **Boolean Telemetry** as the display name, select **Telemetry** as the capability type, and then select **Boolean** as schema.

1. Select **Save**.

### Add relationships

Next you add relationships to the templates for the downstream device templates:

1. In the **Smart Building gateway device** template, select **Relationships**.

1. Select **+ Add relationship**. Enter **Environmental Sensor** as the display name, and select **S1 Sensor** as the target.

1. Select **+ Add relationship** again. Enter **Occupancy Sensor** as the display name, and select **RS40 Occupancy Sensor** as the target.

1. Select **Save**.

![Smart Building gateway device template, showing relationships](./media/tutorial-define-gateway-device-type/relationships.png)

### Add cloud properties

A gateway device template can include cloud properties. Cloud properties only exist in the IoT Central application, and are never sent to, or received from, a device.

To add cloud properties to the **Smart Building gateway device** template.

1. In the **Smart Building gateway device** template, select **Cloud properties**.

1. Use the information in the following table to add two cloud properties to your gateway device template.

    | Display name      | Semantic type | Schema |
    | ----------------- | ------------- | ------ |
    | Last Service Date | None          | Date   |
    | Customer Name     | None          | String |

1. Select **Save**.

### Create views

As a builder, you can customize the application to display relevant information about the environmental sensor device to an operator. Your customizations enable the operator to manage the environmental sensor devices connected to the application. You can create two types of views for an operator to use to interact with devices:

* Forms to view and edit device and cloud properties.
* Views to visualize devices.

To generate the default views for the **Smart Building gateway device** template:

1. In the **Smart Building gateway device** template, select **Views**.

1. Select **Generate default views** tile and make sure that all the options are selected.

1. Select **Generate default dashboard view(s)**.

## Publish the device template

Before you can create a simulated gateway device, or connect a real gateway device, you need to publish your device template.

To publish the gateway device template:

1. Select the **Smart Building gateway device** template from the **Device templates** page.

2. Select **Publish**.

3. In the **Publish a Device Template** dialog box, choose **Publish**.

After a device template is published, it's visible on the **Devices** page and to the operator. The operator can use the template to create device instances or establish rules and monitoring. Editing a published template could affect behavior across the application.

To learn more about modifying a device template after it's published, see [Edit an existing device template](howto-edit-device-template.md).

## Create the simulated devices

This tutorial uses simulated downstream devices and a simulated gateway device.

To create a simulated gateway device:

1. On the **Devices** page, select **Smart Building gateway device** in the list of device templates.

1. Select **+ New** to start adding a new device.

1. Keep the generated **Device ID** and **Device name**. Make sure that the **Simulated** switch is **On**. Select **Create**.

To create a simulated downstream devices:

1. On the **Devices** page, select **RS40 Occupancy Sensor** in the list of device templates.

1. Select **+ New** to start adding a new device.

1. Keep the generated **Device ID** and **Device name**. Make sure that the **Simulated** switch is **On**. Select **Create**.

1. On the **Devices** page, select **S1 Sensor** in the list of device templates.

1. Select **+ New** to start adding a new device.

1. Keep the generated **Device ID** and **Device name**. Make sure that the **Simulated** switch is **On**. Select **Create**.

![Simulated devices in your application](./media/tutorial-define-gateway-device-type/simulated-devices.png)

### Add downstream device relationships to a gateway device

Now that you have the simulated devices in your application, you can create the relationships between the downstream devices and the gateway device:

1. On the **Devices** page, select **S1 Sensor** in the list of device templates, and then select your simulated **S1 Sensor** device.

1. Select **Attach to gateway**.

1. On the **Attach to a gateway** dialog, select the **Smart Building gateway device** template, and then select the simulated instance you created previously.

1. Select **Attach**.

1. On the **Devices** page, select **RS40 Occupancy Sensor** in the list of device templates, and then select your simulated **RS40 Occupancy Sensor** device.

1. Select **Connect to gateway**.

1. On the **Connect to a gateway** dialog, select the **Smart Building gateway device** template, and then select the simulated instance you created previously.

1. Select **Attach**.

Both your simulated downstream devices are now connected to your simulated gateway device. If you navigate to the **Downstream Devices** view for your gateway device, you can see the related downstream devices:

![Downstream devices view](./media/tutorial-define-gateway-device-type/downstream-device-view.png)

## Connect real downstream devices

In the [Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md) tutorial, the sample code shows how to include the model ID from the device template in the provisioning payload the device sends. The model ID lets IoT Central associate the device with the correct device template. For example:

```python
async def provision_device(provisioning_host, id_scope, registration_id, symmetric_key, model_id):
  provisioning_device_client = ProvisioningDeviceClient.create_from_symmetric_key(
    provisioning_host=provisioning_host,
    registration_id=registration_id,
    id_scope=id_scope,
    symmetric_key=symmetric_key,
  )

  provisioning_device_client.provisioning_payload = {"modelId": model_id}
  return await provisioning_device_client.register()
```

When you connect a downstream device, you can modify the provisioning payload to include the the ID of the gateway device. The model ID lets IoT Central associate the device with the correct downstream device template. The gateway ID lets IoT Central establish the relationship between the downstream device and its gateway. In this case the provisioning payload the device sends looks like the following JSON:

```json
{
  "modelId": "dtmi:rigado:S1Sensor;2",
  "iotcGateway":{
    "iotcGatewayId": "gateway-device-001"
  }
}
```

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources](../../../includes/iot-central-clean-up-resources.md)]

## Next steps

In this tutorial, you learned how to:

* Create a new IoT gateway as a device template.
* Create cloud properties.
* Create customizations.
* Define a visualization for the device telemetry.
* Add relationships.
* Publish your device template.

Next you can learn how to:

> [!div class="nextstepaction"]
> [Add an Azure IoT Edge device to your Azure IoT Central application](tutorial-add-edge-as-leaf-device.md)

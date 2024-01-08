---
title: Tutorial - Define an Azure IoT Central gateway device type
description: This tutorial shows you, as a builder, how to define a new IoT gateway device type in your Azure IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 10/26/2022
ms.topic: tutorial
ms.service: iot-central
services: iot-central
ms.custom: mvc
manager: peterpr
---

# Tutorial - Define a new IoT gateway device type in your Azure IoT Central application

This tutorial shows you how to use a gateway device template to define a gateway device in your IoT Central application. You then configure several downstream devices that connect to your IoT Central application through the gateway device.

In this tutorial, you create a **Smart Building** gateway device template. A **Smart Building** gateway device has relationships with other downstream devices.

:::image type="content" source="media/tutorial-define-gateway-device-type/gatewaypattern.png" alt-text="Diagram that shows the relationship between a gateway device and its downstream devices." border="false":::

As well as enabling downstream devices to communicate with your IoT Central application, a gateway device can also:

* Send its own telemetry, such as temperature.
* Respond to writable property updates made by an operator. For example, an operator could change the telemetry send interval.
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

1. Scroll down until you can see the tile for the **Minew S1** device. Select the tile and then select **Next: Review**.

1. On the **Review** page, select **Create** to add the device template to your application.

To create a device template for an **RS40 Occupancy Sensor** device:

1. In the left pane, select **Device Templates**. Then select **+ New** to start adding the template.

1. Scroll down until you can see the tile for the **Rigado RS40 Occupancy Sensor** device. Select the tile and then select **Next: Review**.

1. On the **Review** page, select **Create** to add the device template to your application.

You now have device templates for the two downstream device types:

:::image type="content" source="media/tutorial-define-gateway-device-type/downstream-device-types.png" alt-text="Screenshot that shows the downstream device templates." lightbox="media/tutorial-define-gateway-device-type/downstream-device-types.png":::

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

1. Select **Boolean** as the schema type, set **Writable** on, and then select **Save**.

### Add relationships

Next you add relationships to the templates for the downstream device templates:

1. In the **Smart Building gateway device** template, select **Relationships**.

1. Select **+ Add relationship**. Enter **Environmental Sensor** as the display name, and select **S1 Sensor** as the target.

1. Select **+ Add relationship** again. Enter **Occupancy Sensor** as the display name, and select **RS40 Occupancy Sensor** as the target.

1. Select **Save**.

:::image type="content" source="media/tutorial-define-gateway-device-type/relationships.png" alt-text="Screenshot that shows the gateway relationships." lightbox="media/tutorial-define-gateway-device-type/relationships.png":::

### Add cloud properties

A gateway device template can include cloud properties. Cloud properties only exist in the IoT Central application, and are never sent to, or received from, a device.

To add cloud properties to the **Smart Building gateway device** template.

1. In the **Smart Building gateway device** template, select **Smart Building gateway device** model.

1. Use the information in the following table to add two cloud properties to your gateway device template.

    | Display name      | Capability type | Semantic type | Schema |
    | ----------------- | --------------- | ------------- | ------ |
    | Last Service Date | Cloud property  | None          | Date   |
    | Customer Name     | Cloud property  | None          | String |

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

1. Keep the generated **Device ID** and **Device name**. Make sure that the **Simulated** switch is **Yes**. Select **Create**.

To create simulated downstream devices:

1. On the **Devices** page, select **RS40 Occupancy Sensor** in the list of device templates.

1. Select **+ New** to start adding a new device.

1. Keep the generated **Device ID** and **Device name**. Make sure that the **Simulated** switch is **Yes**. Select **Create**.

1. On the **Devices** page, select **S1 Sensor** in the list of device templates.

1. Select **+ New** to start adding a new device.

1. Keep the generated **Device ID** and **Device name**. Make sure that the **Simulated** switch is **Yes**. Select **Create**.

:::image type="content" source="media/tutorial-define-gateway-device-type/simulated-devices.png" alt-text="Screenshot that shows the simulated devices." lightbox="media/tutorial-define-gateway-device-type/simulated-devices.png":::

### Add downstream device relationships to a gateway device

Now that you have the simulated devices in your application, you can create the relationships between the downstream devices and the gateway device:

1. On the **Devices** page, select **S1 Sensor** in the list of device templates, and then select your simulated **S1 Sensor** device.

1. Select **Attach to gateway**.

1. On the **Attach to a gateway** dialog, select the **Smart Building gateway device** template, and then select the simulated instance you created previously.

1. Select **Attach**.

1. On the **Devices** page, select **RS40 Occupancy Sensor** in the list of device templates, and then select your simulated **RS40 Occupancy Sensor** device.

1. Select **Attach to gateway**.

1. On the **Attach to a gateway** dialog, select the **Smart Building gateway device** template, and then select the simulated instance you created previously.

1. Select **Attach**.

Both your simulated downstream devices are now connected to your simulated gateway device. If you navigate to the **Downstream Devices** view for your gateway device, you can see the related downstream devices:

:::image type="content" source="media/tutorial-define-gateway-device-type/downstream-device-view.png" alt-text="Screenshot that shows the devices attached to the gateway." lightbox="media/tutorial-define-gateway-device-type/downstream-device-view.png":::

## Connect real downstream devices

In the [Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md) tutorial, the sample code shows how to include the model ID from the device template in the provisioning payload the device sends.

When you connect a downstream device, you can modify the provisioning payload to include the ID of the gateway device. The model ID lets IoT Central assign the device to the correct downstream device template. The gateway ID lets IoT Central establish the relationship between the downstream device and its gateway. In this case the provisioning payload the device sends looks like the following JSON:

```json
{
  "modelId": "dtmi:rigado:S1Sensor;2",
  "iotcGateway":{
    "iotcGatewayId": "gateway-device-001"
  }
}
```

A gateway can register and provision a downstream device, and associate the downstream device with the gateway as follows:

# [JavaScript](#tab/javascript)

```javascript
var crypto = require('crypto');


var ProvisioningTransport = require('azure-iot-provisioning-device-mqtt').Mqtt;
var SymmetricKeySecurityClient = require('azure-iot-security-symmetric-key').SymmetricKeySecurityClient;
var ProvisioningDeviceClient = require('azure-iot-provisioning-device').ProvisioningDeviceClient;

var provisioningHost = "global.azure-devices-provisioning.net";
var idScope = "<The ID scope from your SAS group enrollment in IoT Central>";
var groupSymmetricKey = "<The primary key from the SAS group enrollment>";
var registrationId = "<The device ID for the downstream device you're creating>";
var modelId = "<The model you're downstream device should use>";
var gatewayId = "<The device ID of your gateway device>";

// Calculate the device key from the group enrollment key
function computeDerivedSymmetricKey(deviceId, masterKey) {
    return crypto.createHmac('SHA256', Buffer.from(masterKey, 'base64'))
        .update(deviceId, 'utf8')
        .digest('base64');
}

var symmetricKey = computeDerivedSymmetricKey(registrationId, groupSymmetricKey);

var provisioningSecurityClient = new SymmetricKeySecurityClient(registrationId, symmetricKey);

var provisioningClient = ProvisioningDeviceClient.create(provisioningHost, idScope, new ProvisioningTransport(), provisioningSecurityClient);

// Use the DPS payload to:
// - specify the device capability model to use.
// - associate the device with a gateway.
var provisioningPayload = {modelId: modelId, iotcGateway: { iotcGatewayId: gatewayId}}

provisioningClient.setProvisioningPayload(provisioningPayload);

provisioningClient.register(function(err, result) {
  if (err) {
    console.log("Error registering device: " + err);
  } else {
    console.log('The registration status is: ' + result.status)
   }
});
```

# [Python](#tab/python)

```python
from azure.iot.device import ProvisioningDeviceClient
import os
import base64
import hmac
import hashlib

provisioning_host = "global.azure-devices-provisioning.net"

id_scope = "<The ID scope from your SAS group enrollment in IoT Central>"
group_symmetric_key = "<The primary key from the SAS group enrollment>"
registration_id = "<The device ID for the downstream device you're creating>"
model_id = "<The model you're downstream device should use>"
gateway_id = "<The device ID of your gateway device>"

# Calculate the device key from the group enrollment key
def compute_device_key (device_id, group_key):
    message = device_id.encode("utf-8")
    signing_key = base64.b64decode(group_key.encode("utf-8"))
    signed_hmac = hmac.HMAC(signing_key, message, hashlib.sha256)
    device_key_encoded = base64.b64encode(signed_hmac.digest())
    return device_key_encoded.decode("utf-8")

provisioning_device_client = ProvisioningDeviceClient.create_from_symmetric_key(
    provisioning_host=provisioning_host,
    registration_id=registration_id,
    id_scope=id_scope,
    symmetric_key=compute_device_key(registration_id, group_symmetric_key)
)

# Use the DPS payload to:
# - specify the device capability model to use.
# - associate the device with a gateway.
provisioning_device_client.provisioning_payload = {"modelId": model_id, "iotcGateway":{"iotcGatewayId": gateway_id}}

registration_result = provisioning_device_client.register()

print("The registration status is:")
print(registration_result.status)
```

---

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
> [Create a rule and set up notifications in your Azure IoT Central application](tutorial-create-telemetry-rules.md)

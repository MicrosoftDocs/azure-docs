---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Deploy the Azure IoT Central device bridge | Microsoft Docs
description: Deploy the IoT Central device bridge to connect other IoT clouds (Sigfox, Particle, The Things Network etc.) to your IoT Central app.
services: iot-central
ms.service: iot-central
author: TheRealJasonAndrew
ms.author: v-anjaso
ms.date: 03/25/2021
ms.topic: how-to
manager: peterpr
ms.custom: device-developer
---

# Build the IoT Central device bridge to connect other IoT clouds to IoT Central

*This topic applies to administrators.*

## Azure IoT Central Device Bridge
The IoT Central device bridge is an open-source solution that connects your Sigfox, Particle, and The Things Network (TTN) IoT clouds to your IoT Central application. Whether you are using asset tracking devices connected to Sigfox's low-power wide area network, or using air quality monitoring devices on the Particle Device Cloud, or using soil moisture monitoring devices on TTN, you can directly leverage the power of IoT Central using the IoT Central device bridge. The device bridge connects other IoT clouds with IoT Central by forwarding the data your devices send to the other clouds through to your IoT Central application. In your IoT Central application, you can build rules and run analytics on that data, create workflows in Power Automate and Azure Logic apps, export that data, and much more. The device bridge solution provisions several Azure resources into your Azure subscription that work together to transform and forward device messages to IoT Central.

## Prerequisites

To complete the steps in this how-to guide, you need an active Azure subscription.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Complete the [Create an Azure IoT Central application](./quick-deploy-iot-central.md) quickstart to create an IoT Central application using the **Custom app > Custom application** template.

## What is it and how does it work?
The IoT Central device bridge is an open-source solution in GitHub. It uses a custom Azure Resource Manager template to build the following resources in your Azure subscription: 
*  Azure Function app
*  Azure Storage Account
*  Consumption Plan
*  Azure Key Vault

The function app is the core piece of the device bridge. It receives HTTP POST requests from other IoT platforms through a simple webhook. The repository includes examples that show how to connect Sigfox, Particle, and TTN clouds. You can extend this solution to connect to your custom IoT cloud if your platform can send HTTP POST requests to your function app.

The function app transforms the data into a format accepted by IoT Central and forwards it using the DPS APIs.

:::image type="content" source="media/howto-build-iotc-device-bridge/azfunctions.png" alt-text="Screenshot of Azure functions screenshot.":::

If your IoT Central app recognizes the device by device ID in the forwarded message, a new measurement appears for that device. If the device ID has never been seen by your IoT Central app, your function app attempts to register a new device with that device ID, and it appears as an "Unassociated device" in your IoT Central app. 

## Deploy the Azure Function
Take the following steps to deploy an Azure Function into your subscription and set up the device bridge.

1. Select [![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fiotc-device-bridge%2Fmaster%2Fazuredeploy.json). An custom ARM template opens in the Azure Portal to deploy the Function.

1. Go to your IoT Central application, and then navigate to the **Administration > Device Connection**.

    1. Copy `ID Scope` and paste it into the `ID Scope` field the custom template.

    2. In the same page, under _Enrollment groups_, open the SAS-IoT-Devices group. In the group page, copy either the Primary key or the Secondary key and paste it into the Iot Central SAS Key field. (this key is stored in a Key Vault provisioned with the function). 
    
    :::image type="content" source="media/howto-build-iotc-device-bridge/scopeIdAndKey.png" alt-text="Screenshot of Scope ID.":::

    :::image type="content" source="media/howto-build-iotc-device-bridge/sasEnrollmentGroup.png" alt-text="Screenshot of Enrollment Group.":::

1. After the deployment is completed, install the required NPM packages in the function. Open the App Service that was deployed to your subscription, then navigate to **Development Tools > Console**. In the console, navigate to the function directory by running the command `cd IoTCIntegration`. Once in the correct directory, run the command npm install (this command takes ~20 minutes to complete, so feel free to do something else in that time). NPM warning messages (starting with `npm WARN`) do not prevent the successful execution of the command. 

    :::image type="content" source="media/howto-build-iotc-device-bridge/npmInstall.png" alt-text="Screenshot of NPM Install.":::

1. After the package installation finishes, the App Service needs to be restarted by selecting **Restart** in _Overview_ page.

    :::image type="content" source="media/howto-build-iotc-device-bridge/restart.png" alt-text="Screenshot of Restart.":::

1. The function is now ready to use. External systems can feed device data through this device bridge and into your IoT Central app by making HTTP POST requests to the function URL. The URL can be obtained in the newly created function in **Functions > IoTCIntegration > Code + Test > Get function URL**.

    :::image type="content" source="media/howto-build-iotc-device-bridge/getFunctionUrl.png" alt-text="Screenshot of Get Function URL.":::

Messages sent to the device bridge must have the following format in the body:

```json
     "device": {
        "deviceId": "my-cloud-device"
    },
    "measurements": {
        "temp": 20.31,
        "pressure": 50,
        "humidity": 8.5,
        "ledColor": "blue"
    }
```

Each key in the `measurements` object must match the name of a capability in the device template in the IoT Central application. Because this solution doesn't support specifying the interface ID in the message body, if two different interfaces have a capability with the same name, the measurement is presented in both capabilities. For legacy applications (2018), the keys in the `measurements` object must match the measurement field names in the Azure IoT Central application.

An optional `timestamp` field can be included in the body, to specify the UTC date and time of the message. This field must be in ISO format: YYYY-MM-DDTHH:mm:ss.sssZ(for example, `2020-06-08T20:16:54.602Z`  is a valid timestamp). If timestamp is not provided, the current date and time is used.

An optional `modelId` field can also be included in the body. Filling this field causes the device to be associated to a Device Template during provisioning. This functionality is not supported by legacy apps.

> [!NOTE]
> `deviceId` must be alphanumeric, lowercase, and may contain hyphens.

When a message with a new `deviceId` is sent to IoT Central by the device bridge, a new unassociated device is created. The device is initially under **Devices > All devices**. Select the device then **migrate** to choose the appropriate template. 

:::image type="content" source="media/howto-build-iotc-device-bridge/migrate.png" alt-text="Screenshot of deviceID."::: 

V2 applications: the new device appears in your IoT Central application in **Device Explorer > Unassociated devices**. Select **Associate** and choose a device template to start receiving incoming measurements from that device in IoT Central.

:::image type="content" source="media/howto-build-iotc-device-bridge/associate.png" alt-text="Screenshot of Migrate.":::

> [!NOTE]
> Until the device is associated to a template, all HTTP calls to the function returns a 403 error status.


Logging can be enabled using Application Insights. To do so, they are saved for future executions of the function.

## What is being provisioned? (pricing)
The custom template in this repository provisions to:

Key Vault, needed to store your IoT Central key
* Storage Account
* Function App
* Consumption Plan 

The Function App runs on a [consumption plan](https://azure.microsoft.com/pricing/details/functions/). While this option does not offer dedicated compute resources, it allows device bridge to handle hundreds of device messages per minute, suitable for smaller fleets of devices or devices that send messages less frequently. If your application depends on streaming a large number of device messages, you may choose to replace the consumption plan by dedicated a [App service plan](https://azure.microsoft.com/pricing/details/app-service/windows/). This plan offers dedicated compute resources, which leads to faster server response times. Using a standard App Service Plan, the maximum observed performance of the Azure Function in this repository was around 1,500 device messages per minute. You can [learn more about the Azure Function hosting options](https://docs.microsoft.com/azure/azure-functions/functions-scale) in documentation.

To use a dedicated App Service Plan instead of a consumption plan, edit the custom template before deploying. Select  **Edit template**.

:::image type="content" source="media/howto-build-iotc-device-bridge/editTemplate.png" alt-text="Screenshot of Edit Template.":::

1. Replace the following segment:

```json 
{
  "type": "Microsoft.Web/serverfarms",
  "apiVersion": "2015-04-01",
  "name": "[variables('planName')]",
  "location": "[resourceGroup().location]",
  "properties": {
    "name": "[variables('planName')]",
    "computeMode": "Dynamic",
    "sku": "Dynamic"
  }
},
```

with

```json
{
  "type": "Microsoft.Web/serverfarms",
  "sku": {
      "name": "S1",
      "tier": "Standard",
      "size": "S1",
      "family": "S",
      "capacity": 1
  },
  "kind": "app",
  "name": "[variables('planName')]",
  "apiVersion": "2016-09-01",
  "location": "[resourceGroup().location]",
  "tags": {
      "iotCentral": "device-bridge",
      "iotCentralDeviceBridge": "app-service-plan"
  },
  "properties": {
      "name": "[variables('planName')]"
  }
},
```
Next, edit the template to include "alwaysOn": true in the configurations of the Function App resource (under **Properties > SiteConfig**.) The [alwaysOn configuration](https://github.com/Azure/Azure-Functions/wiki/Enable-Always-On-when-running-on-dedicated-App-Service-Plan) ensures that the function app is running at all times.

### Example 1: Connecting Particle devices through the device bridge

To connect a Particle device through the device bridge to IoT Central, go to the Particle console and create a new webhook integration. Set the **Request Format** to _JSON_.  Under _Advanced Settings_, use the following custom body format:

```json
{
  "device": {
    "deviceId": "{{{PARTICLE_DEVICE_ID}}}"
  },
  "measurements": {
    "{{{PARTICLE_EVENT_NAME}}}": {{{PARTICLE_EVENT_VALUE}}}
  }
}
```

Paste in the _function URL_ from your Azure Function, and you should see Particle devices appear as unassociated devices in IoT Central. For additional details, [see this blog post by the Particle team.](https://blog.particle.io/2019/09/26/integrate-particle-with-azure-iot-central/). 

### Example 2: Connecting Sigfox devices through the device bridge
Some platforms may not allow you to specify the format of device messages sent through a webhook. For such systems, the message payload must be converted to the expected body format before it can be processed by the device bridge. This conversion can be performed in the same Azure Function that runs the device bridge.

```javascript
const payloadDefinition = 'gforce::uint:8 lat::uint:8 lon::uint:16'; // Replace this with your payload definition

req.body = {
    device: {
        deviceId: req.body.device
    },
    measurements: require('./converters/sigfox')(payloadDefinition, req.body.data)
};
```
1. Sigfox devices expect a `204` response code. To make this happen, add the following code snippet after the call to handleMessage in line 21:

```json
context.res = {
    status: 204
};
```

### Example 3: Connecting devices from TTN through the device bridge
Devices in TTN can be easily connected to IoT Central through this solution. To do so, add a new HTTP integration to your application in TTN (**Application > Integrations > add integration > HTTP Integration**). Also make sure that your application has a decoder function defined (**Application > Payload Functions > decoder**), so the payload of your device messages can be automatically converted to JSON before being sent to the Azure Function. The following sample, shows a JavaScript decoder function that can be used to decode common numeric types from binary data.

```javascript
function Decoder(bytes, port) {
    function bytesToFloat(bytes, decimalPlaces) {
        var bits = (bytes[3] << 24) | (bytes[2] << 16) | (bytes[1] << 8) | bytes[0];
        var sign = (bits >>> 31 === 0) ? 1.0 : -1.0;
        var e = bits >>> 23 & 0xff;
        var m = (e === 0) ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
        var f = Math.round((sign * m * Math.pow(2, e - 150)) * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
        return f;
    }

    function bytesToInt32(bytes, signed) {
        var bits = bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24);
        var sign = 1;

        if (signed && bits >>> 31 === 1) {
            sign = -1;
            bits = bits & 0x7FFFFFFF;
        }

        return bits * sign;
    }

    function bytesToShort(bytes, signed) {
        var bits = bytes[0] | (bytes[1] << 8);
        var sign = 1;

        if (signed && bits >>> 15 === 1) {
            sign = -1;
            bits = bits & 0x7FFF;
        }

        return bits * sign;
    }

    return {
        temperature: bytesToFloat(bytes.slice(0, 4), 2),
        presscounter: bytesToInt32(bytes.slice(4, 8), true),
        blueLux: bytesToShort(bytes.slice(8, 10), false)
    };
}
```
After the integration has been defined, add the following code before the call to `handleMessage` in line 21 of the `IoTCIntegration/index.js` file of your Azure Function. This translates the body of your HTTP integration to the expected format.

```javascript
    device: {
        deviceId: req.body.hardware_serial.toLowerCase()
    },
    measurements: req.body.payload_fields
};
```

## Limitations
This device bridge only forwards messages to IoT Central, and does not send messages back to devices. Due to the unidirectional nature of this solution, settings and commands do not work for devices that connect to IoT Central through this device bridge. Because device twin operations are also not supported, it's not possible to update device properties through this setup. To use these features, a device must be connected directly to IoT Central using one of the [Azure IoT device SDKs.](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-sdks/)


## Package integrity
The template provided here deploys a packaged version of the code in this repository to an Azure Function. You can check the integrity of the code being deployed by verifying that the `SHA256` hash of the `iotc-bridge-az-function.zip` file in the root of this repository matches the following:
s
```javascript
   F7BA3AC451E8CD738B9FBC6A55677C840039E5205541575FD18326C8D9E9EBDC
```

## Contributing
This project welcomes contributions and suggestions. Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot automatically determines whether you need to provide a CLA and decorate the PR appropriately (e.g., label, comment). Follow the instructions provided by the bot. You need to do this only once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact opencode@microsoft.com with any questions or comments.

## Updating the package
The code in the repository is deployed to the Azure Function from the `iotc-bridge-az-function.zip` package at the repository root. When updating the source code, this package also needs to be updated and tested. To update, simply make a zip file from the IoTCIntegration folder that contains your source changes. Make sure to  exclude non-source files, such as node_modules.

To test your changes, use the `azuredeploy.json` resource manager template in the repository root. Change the `packageUri` variable to point to your modified zip package location - the zip package URL can be obtained from your GitHub branch - and deploy the template in the Azure Portal. Make sure that the function deploys correctly and that you're able to send device data through the test tab in the Azure Portal.

## Next steps
Now that you've learned how to deploy the IoT Central device bridge, here is the suggested next step:

> [!div class="nextstepaction"]
> [Manage your devices](howto-manage-devices.md)

---
title: Transform data for Azure IoT Central | Microsoft Docs
description: IoT devices send data in various formats that you may need to transform. This article describes how to transform data both on the way into IoT Central and on the way out. 
author: dominicbetts
ms.author: dobett
ms.date: 04/09/2021
ms.topic: how-to
ms.service: iot-central
services: iot-central
---

# Transform data for IoT Central

*This topic applies to solution builders.*

IoT devices send data in various formats. To use the device data with your IoT Central application, you may need to use a transformation to:

- Make the format of the data compatible with your IoT Central application.
- Convert units.
- Compute new metrics.
- Enrich the data from other sources.

This article shows you how to transform device data outside of IoT Central either at ingress or egress.

The following diagram shows three routes for data that include transformations:

:::image type="content" source="media/howto-transform-data/transform-data.png" alt-text="Summary of data transformation routes both ingress and egress" border="false":::

The following table shows three example transformation types:

| Transformation | Description | Example  | Notes |
|------------------------|-------------|----------|-------|
| Message Format         | Convert to or manipulate JSON messages. | CSV to JSON  | At ingress. IoT Central only accepts value JSON messages. To learn more, see [Telemetry, property, and command payloads](concepts-telemetry-properties-commands.md). |
| Computations           | Math functions that [Azure Functions](../../azure-functions/index.md) can execute. | Unit conversion from Fahrenheit to Celsius.  | Normalize using the egress pattern to take advantage of scalable device ingress through direct connection to IoT Central. Normalizing data lets you use common device models and IoT Central features such as visualizations and jobs. |
| Message Enrichment     | Enrichments from external data sources not found in device properties or telemetry. To learn more about internal enrichments, see [Export IoT data to cloud destinations using data export](howto-export-data.md) | Add weather information to messages using location data from devices. | Normalize using the egress pattern to take advantage of scalable device ingress through direct connection to IoT Central. |

## Prerequisites

To complete the steps in this article, you need an active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

To set up the solution you need a [V3 IoT Central application](howto-get-app-info.md). To learn how to create an IoT Central application, see [Create an Azure IoT Central application](quick-deploy-iot-central.md).

Install [Node.js](https://nodejs.org/) and the `npm` package manager on your local development machine.

Install [Docker](https://www.docker.com/products/docker-desktop) on your local development machine.

<!-- To Do - can we be more prescriptive about the template to use? Is this really a prereq? -->
In your IoT Central app, create a device template for your device and add the capabilities to model the data including the transformed data. See [Set up a device template](howto-set-up-template.md) for more information.

## Data transformation at ingress

To transform device data at ingress, there are two options:

- **IoT Edge**: Use an IoT Edge module to transform data from downstream devices or other modules before sending the data to your IoT Central application.

- **IoT Central device bridge**: The [IoT Central device bridge](https://github.com/Azure/iotc-device-bridge) connects other IoT device clouds, such as Sigfox, Particle, and The Things Network, to IoT Central. The device bridge uses an Azure function to forward the data and you can customize the function to transform the device data.

To learn more about the data formats IoT Central expects, see [Telemetry, property, and command payloads](concepts-telemetry-properties-commands.md).

### Use IoT Edge to transform device data

:::image type="content" source="media/howto-transform-data/transform-ingress.png" alt-text="Data transformation on ingress using IoT Edge" border="false":::

In this scenario, an IoT Edge module transforms the data from downstream devices before forwarding it to your IoT Central application. At a high-level, the steps to configure this scenario are:

1. **Set-up an IoT Edge device**: Install and provision an IoT Edge device as a gateway and connect the gateway to your IoT Central application.

1. **Connect downstream device to the IoT Edge device:** Connect downstream devices to the IoT Edge device and provision them to your IoT Central application.

1. **Transform device data in IoT Edge:** Create an IoT Edge module to transform the data. Deploy the module to the IoT Edge gateway device that forwards the transformed device data to your IoT Central application.

1. **Verify**: Send data from a downstream device to the gateway and verify the transformed device data arrives in your IoT Central application.

In the example described in the following sections, the downstream device sends CSV data in the following format to the IoT Edge gateway device:

```csv
"<temperature >, <pressure>, <humidity>"
```

You want to use an IoT Edge module to transform the data to the following JSON format before it's sent to IoT Central:

<!-- To Do: check this format is correct for IoT Central -->

```json
{
  "device": {
      "deviceId": "<downstream-deviceid>"
  },
  "measurements": {
    "temp": <temperature>,
    "pressure": <pressure>,
    "humidity": <humidity>,
  }
}
```

The following steps show you how to set up and configure this scenario:

### Set-up an IoT Edge device

<!-- To Do - check if we can use a simpler template to avoid creating too many VMs etc. Add steps for creating the certs -->
To install and provision an Azure virtual machine to host IoT Edge, follow the steps in [Connect devices through an IoT Edge transparent gateway to IoT Central](how-to-connect-iot-edge-transparent-gateway.md).

> [!NOTE]
> For this example, we will only use the transparent gateway that you provisioned from the tutorial. Ensure you opened the virtual machine (acting as a gateway) ports: 22 (for SSH login), 5671 and 5672 (AMQP), and 8883 (MQTT). You can also terminate the downstream device as we will use a separate script to act as a sample device.*

### Connect downstream device to Edge

To connect a downstream downstream device to the IoT Edge gateway device:

<!-- To Do - change this to clone the repo as we need other resources -->
1. Download a sample device in the folder _leafdevice_ from [here](https://github.com/iot-for-all/iot-central-transform-with-iot-edge).

1. To verify identity of the downstream device and enable a secure connection to edge, add a root CA certificate to the downstream device.

    Copy the root CA certificate you created in the **edgegateway** virtual machine you created in the previous step to the local *certs* folder in the downstream device. You can use the following `scp` command to copy from your virtual machine to local drive.

    `scp AzureUser@<edge gateway DNS>:/home/AzureUser/certs/certs/azure-iot-test-only.root.ca.cert.pem /leafdevice/certs`

1. To provision the downstream and send the data to IoT Edge:

    1. Navigate to the *leafdevice* directory and install the required packages. Then run the `dist/main.js` script to provision and connect the device:

        ```bash
        cd leafdevice
        npm install
        node dist/main.js
        ```

    1. Enter the device ID, scope ID, and SAS key for the downstream device you created previously. For the hostname, enter `edgegateway`.

### Transform device data in IoT Edge

To build an edge module that transforms the data from the downstream device and forwards to IoT Central:

<!-- To do - fix this as we've cloned the repo previously -->
1. Download the CSV to JSON transform module from [here](https://github.com/iot-for-all/iot-central-transform-with-iot-edge) and go to the directory *custommodule/transformmodule*.

    The CSV to JSON transformation logic is in the *Program.cs* file. Edit this file to change any capability values or to modify the transformation logic.

<!-- Can we do this in the cloud shell to use the Azure container registry -->
1. To build an image of the *custommodule/transformmodule* use the `docker build` command.
1. Push the image to your container registry and retrieve the image URL and credentials to pull the image.
1. Open the *EdgeTransparentGatewayManifest.json* deployment manifest file you downloaded previously. Add the data transformation module as a custom module to the deployment manifest as shown in the following example:

    ```json
    {
      "modulesContent": {
          "$edgeAgent": {
              "properties.desired": {
                  "modules": {
                      "datatransformationodule": {
                          "settings": {
                              "image": "<url of image repository>",
                              "createOptions": ""
                          },
                          "type": "docker",
                          "status": "running",
                          "restartPolicy": "always",
                          "version": "1.0"
                      }
                  },
                  "runtime": {
                      "settings": {
                          "minDockerVersion": "v1.25",
                          "registryCredentials": {
                              "<image repository name>": {
                                  "address": "<image repository address>",
                                  "password": "<image repository password>",
                                  "username": "<image repository username>"
                              }
                          }
                      },
                      "type": "docker"
                  },
                  "schemaVersion": "1.1",
                  "systemModules": {
                      "edgeAgent": {
                          "settings": {
                              "image": "mcr.microsoft.com/azureiotedge-agent:1.0",
                              "createOptions": ""
                          },
                          "type": "docker"
                      },
                      "edgeHub": {
                          "settings": {
                              "image": "mcr.microsoft.com/azureiotedge-hub:1.0",
                              "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"443/tcp\":[{\"HostPort\":\"443\"}],\"5671/tcp\":[{\"HostPort\":\"5671\"}],\"8883/tcp\":[{\"HostPort\":\"8883\"}]}}}"
                          },
                          "type": "docker",
                          "status": "running",
                          "restartPolicy": "always"
                      }
                  }
              }
          },
          "$edgeHub": {
              "properties.desired": {
                  "routes": {
                      "allDownstreamToHub": "FROM /messages/* WHERE NOT IS_DEFINED ($connectionModuleId) INTO $upstream"
                  },
                  "schemaVersion": "1.1",
                  "storeAndForwardConfiguration": {
                      "timeToLiveSecs": 7200
                  }
              }
          }
      }
    }
    ```

1. In your IoT Central application go to the IoT Edge gateway device template you created previously. Create a new version of this device template and select **Replace Manifest**  to upload the modified deployment manifest file. Publish the device template.
1. On the **Devices** page in your IoT Central application, and select the **edgegateway** device you created previously. Migrate this device to use the new version of the IoT Edge gateway device template.

### Verify

Navigate to your IoT Edge gateway device in IoT Central and select **Modules**. Verify that the three Edge modules **$edgeAgent**, **$edgeHub** and **datatransformationmodule** are running. Select the downstream devices and verify that the **leafdevice** is provisioned. Run the `leafdevice` script and then go back to the **Devices** page in IoT Central. Select **leafdevice** and verify that you can see the transformed device data on the  **Raw data** view.

## Data transformation at egress

You can connect your devices to IoT Central, export the device data to a compute engine to transforms it, and then send the transformed data back to IoT Central for device management and analysis. For example:

- Your devices send location data to IoT Central.
- IoT Central exports the data to a compute engine that enhances the location data with weather information.
- The compute engine sends the enhanced data back to IoT Central.

You can use the [IoT Central device bridge](https://github.com/Azure/iotc-device-bridge) as compute engine to transform data exported from IoT Central.

<!-- To Do - you can control and manage downstream devices through an IoT Edge gateway -->
An advantage of transforming data at egress is that your devices connect directly to IoT Central, making it easy to send commands to devices or update device properties. However, with this method, you may use more messages than your monthly allotment and increase the cost of using Azure IoT Central.

### Use the IoT Central device bridge to transform device data

:::image type="content" source="media/howto-transform-data/transform-egress.png" alt-text="Data transformation on egress using IoT Edge" border="false":::

In this scenario, a compute engine transforms device data exported from IoT Central before sending it back to your IoT Central application. At a high-level, the steps to configure this scenario are:

1. **Set-up the compute engine:** Create an IoT Central device bridge to act as a compute engine for data transformation.

1. **Transform device data in the device bridge:** Transform data in the device bridge by modifying the device bridge function code for your data transformation use case.

1. **Enable data flow from IoT Central to the device bridge:** Export the data from IoT Central to device bridge for transformation. Then, forward the transformed data back to IoT Central. When you create the data export, use message property filters to only export un-transformed data.

1. **Verify**: Connect your device to the IoT Central app and check for both raw device data and transformed data in IoT Central.

<!-- To Do - doesn't the device send JSON data? -->
In the example described in the following sections, the device sends CSV data in the following format to the IoT Edge gateway device:

```csv
"<temperature in degrees C>, <humidity>, <latitude>, <longitude>"
```

You use the device bridge to transform the device data by:

- Changing the unit of temperature from centigrade to fahrenheit.
- Enriching the device data with weather data pulled from the [Open Weather](https://openweathermap.org/) service for the latitude and longitude values.

The device bridge then sends the transformed data to IoT Central in the following format:

```json
{
  "temp": <temperature in degrees F>,
  "humidity": <humidity>,
  "lat": <latitude>,
  "lon": <logitude>,
  "weather": {
    "weather_temp": <temperature at lat/lon>,
    "weather_humidity": <humidity at lat/lon>,
    "weather_pressure": <pressure at lat/lon>,
    "weather_windspeed": <wind speed at lat/lon>,
    "weather_clouds": <cloud cover at lat/lon>,
    "weather_uvi": <UVI at lat/lon>
  }
}
```

The following steps show you how to set up and configure this scenario:

### Set-up a compute engine

<!-- To do: Add steps to get Scope ID and primary group SAS key -->
To deploy the device bridge, select [![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fiotc-device-bridge%2Fmaster%2Fazuredeploy.json). To learn more, see [Azure IoT Central Device Bridge](https://github.com/Azure/iotc-device-bridge/blob/master/README.md).

### Transform device data in the device bridge

To configure the device bridge to transform the exported device data:

1. Obtain an application API key from the Open Weather service. This is free with limited usage of the service. To create an application API key, create an account in [Open Weather service portal](https://openweathermap.org/) and follow the instructions. You use your Open Weather API key later.

1. In the Azure Portal, navigate to Function App that was deployed with the device bridge.

1. In the left-navigation, in **Development Tools**, select **App Service Editor (Preview)**.

1. Select "Go -&gt;" to open the **App Service Editor** page. Make the following changes:

    1. Open the *wwwroot/IoTCIntegration/index.js* file. Delete all the code in this file. Replace the code with the code in [index.js](https://github.com/iot-for-all/iot-central-compute/blob/main/Azure_function/index.js).
    <!-- to do : get raw link -->

    1. In the new *index.js*, update the `openWeatherAppId` variable file with Open Weather API key you obtained previously.

        ```javascript
        const openWeatherAppId = '<Your Open Weather API Key>'
        ```

    1. Add a message property to the data sent by the device bridge to IoT Central. IoT Central uses this property to prevent exporting the transformed data. To make this change, open the *wwwroot/IoTCIntegrationlib/engine.js* file. Add the following code in the section that creates the message to send from from the device bridge:

        ```javascript
        // add a message property that we can look for in data export to not re-compute computed telemetry
        message.properties.add('computed', true);
        ```

        For reference you can view a example ** [engine.js](https://github.com/iot-for-all/iot-central-compute/blob/main/Azure_function/lib/engine.js)file.

1. Return to the **Azure Function Overview** page and restart the function:

    :::image type="content" source="media/howto-transform-data/azure-function.png" alt-text="Restart the function":::

<!-- To DO - more detail about how to get function URL -->
1. Make a note of the function URL, you need this later:

    :::image type="content" source="media/howto-transform-data/get-function-url.png" alt-text="Get the function URL":::

### Enable data flow from IoT Central to the device bridge

To set up the Azure IoT Central application:

1. To add a device template to your IoT Central application, navigate to your IoT Central application and then:

    1. Create a device template and import the model publish here. See [Set up a device template](howto-set-up-template.md) for more information.

    1. Publish the model so it can be used in your application.

1. Setup the data export to send data to your Device bridge:

    1. In your IoT Central application, select **Data export**.

    1. Select **+ New destination** to create a destination to use with the device bridge. Call the destination *Compute function*, for **Destination type** select **Webhook**. For the Callback URL select paste in the function URL you made a note of previously. Leave the **Authorization** as **No Auth**.

    1. Save the changes.

    1. Select the **+ New export** and create a data export called *Compute export*.

    1. Add a filter to only export device data for the device template you're using. Select **+ Filter**, select item **Device template**, select the operator **Equals**, and select the name of the device template you just created.

    1. Add a message filter to differentiate between transformed and un-transformed data. This prevents sending transformed values back to the device bridge. Select **+ Message property filter** and enter the name value *computed*, then select the operator **Does not exist**. The string `computed` is used as a keyword in the device bridge example code.

    1. For the destination, select the **Compute function** destination you created previously.

    1. Save the changes. After a minute or so, the **Export status** shows as **Healthy**.

### Verify

<!-- to do - does the device really send CSV? -->
Download a [sample device](https://github.com/iot-for-all/iot-central-compute/tree/main/device). The device code can be found in the file *device/device.js*. The sample device sends random CSV formatted data to IoT Central. To run the sample device:

1. To connect the sample device to your IoT Central application, edit the connection settings in the *device.js* file. Replace the scope ID and group SAS key with the values you made a note of previously:

    ```javascript
    // These values need to be filled in from your Azure IoT Central application
    //
    const scopeId = "<IoT Central Scope Id value>";
    const groupSasKey = "<IoT Central Group SAS key>";
    //
    ```

    Save the changes.

<!-- to do - get rid of this by collecting this data at the start -->
1. The Scope Id and the Group SAS key can be found in the IoT Central application by clicking the Administration -&gt; Device connection in the left hand navigation. Copy the ID Scope value and the "SAS-IoT-Devices" primary key into the code in the device.js file by replacing the place holder text. Save the file and from the command line in the "iot-central-compute\\device" directory.

1. Use the following command to run the device:

    ```bash
    node device.js
    ```

1. The output looks like the following:

    ```output
    registration succeeded
    assigned hub=iotc-2bd611b0....azure-devices.net
    deviceId=computeDevice
    Client connected
    send status: MessageEnqueued [{"data":"33.23, 69.09, 30.7213, -61.1192"}]
    send status: MessageEnqueued [{"data":"2.43, 75.86, -2.6358, 162.935"}]
    send status: MessageEnqueued [{"data":"6.19, 76.55, -14.3538, -82.314"}]
    send status: MessageEnqueued [{"data":"33.26, 48.01, 71.9172, 48.6606"}]
    send status: MessageEnqueued [{"data":"40.5, 36.41, 14.6043, 14.079"}]
    ```

<!-- to do - should be the **overview** page to see the plot -->
1. In your IoT Central application navigate to the device called **computeDevice**. On the **Raw data** view there are two different telemetry lines one after the other showing up around every five seconds. These lines show the original device data and the transformed data.

## Next Steps

Now that you've learned how to transform device data outside of your Azure IoT Central application, you can learn [How to use analytics to analyze device data in IoT Central](howto-create-analytics.md).

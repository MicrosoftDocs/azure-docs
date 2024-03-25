---
title: Tutorial - Check device connectivity to Azure IoT Hub
description: Tutorial - Use IoT Hub tools to troubleshoot, during development, device connectivity issues to your IoT hub.
services: iot-hub
author: kgremban
ms.author: kgremban
ms.custom: [mvc, amqp, mqtt, 'Role: Cloud Development', 'Role: IoT Device', devx-track-azurecli]
ms.date: 02/01/2023
ms.topic: tutorial
ms.service: iot-hub
#Customer intent: As a developer, I want to know what tools I can use to verify connectivity between my IoT devices and my IoT hub.
---

# Tutorial: Use a simulated device to test connectivity with your IoT hub

In this tutorial, you use Azure IoT Hub portal tools and Azure CLI commands to test device connectivity. This tutorial also uses a simple device simulator that you run on your desktop machine.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

In this tutorial, you learn how to:
> [!div class="checklist"]
>
> * Check your device authentication
> * Check device-to-cloud connectivity
> * Check cloud-to-device connectivity
> * Check device twin synchronization

## Prerequisites

* This tutorial uses the Azure CLI to create cloud resources. There are two ways to run CLI commands:

  * Use the Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md). For more information, see [Azure Cloud Shell Quickstart - Bash](../cloud-shell/quickstart.md).
   :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::
  * If you prefer to run CLI reference commands locally, [install](/cli/azure/install-azure-cli) the Azure CLI. If you're running on Windows or macOS, consider running Azure CLI in a Docker container. For more information, see [How to run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).

    * Sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.
    * When you're prompted, install Azure CLI extensions on first use. For more information about extensions, see [Use extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).
    * Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).

  [!INCLUDE [iot-hub-cli-version-info](../../includes/iot-hub-cli-version-info.md)]

* The sample application that you run in this tutorial uses Node.js. You need Node.js v10.x.x or later on your development machine.

  * You can download Node.js for multiple platforms from [nodejs.org](https://nodejs.org).
  * You can verify the current version of Node.js on your development machine using the following command:

    ```cmd/sh
    node --version
    ```

* Clone or download the sample Node.js project from [Azure IoT samples for Node.js](https://github.com/Azure-Samples/azure-iot-samples-node).

* Make sure that port 8883 is open in your firewall. The device sample in this tutorial uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub-cli](../../includes/iot-hub-include-create-hub-cli.md)]

## Check device authentication

A device must authenticate with your hub before it can exchange any data with the hub. You can use the **IoT Devices** tool in the **Device Management** section of the portal to manage your devices and check the authentication keys they're using. In this section of the tutorial, you add a new test device, retrieve its key, and check that the test device can connect to the hub. Later you reset the authentication key to observe what happens when a device tries to use an outdated key.

### Register a device

[!INCLUDE [iot-hub-include-create-device-cli](../../includes/iot-hub-include-create-device-cli.md)]

### Simulate a test device

To simulate a device sending telemetry to your IoT hub, run the Node.js simulated device application you downloaded previously.

1. In a terminal window on your development machine, navigate to the root folder of the sample Node.js project that you downloaded. Then navigate to the **iot-hub\Tutorials\ConnectivityTests** folder.

1. In the terminal window, run the following commands to install the required libraries and run the simulated device application. Use the device connection string you made a note of when you registered the device.

   ```cmd/sh
   npm install
   node SimulatedDevice-1.js "{your_device_connection_string}"
   ```

   The terminal window displays a success message once it connects to your hub:

   :::image type="content" source="media/tutorial-connectivity/sim-1-connected.png" alt-text="Screenshot that shows the simulated device connecting.":::

You've now successfully authenticated from a device using a device key generated by your IoT hub.

### Reset keys

In this section, you reset the device key and observe the error when the simulated device tries to connect.

1. To reset the primary device key for your device, run the [az iot hub device-identity update](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-update) command:

   ```azurecli-interactive
   # Generate a new Base64 encoded key using the current date
   read key < <(date +%s | sha256sum | base64 | head -c 32)

   # Reset the primary device key for test device
   az iot hub device-identity update --device-id {your_device_id} --set authentication.symmetricKey.primaryKey=$key --hub-name {your_iot_hub_name}
   ```

1. In the terminal window on your development machine, run the simulated device application again:

   ```cmd/sh
   npm install
   node SimulatedDevice-1.js "{your_device_connection_string}"
   ```

   This time you see an authentication error when the application tries to connect:

   :::image type="content" source="media/tutorial-connectivity/sim-1-fail.png" alt-text="Screenshot that shows the connection failing after the key reset.":::

### Generate a shared access signature (SAS) token

If your device uses one of the IoT Hub device SDKs, the SDK library code generates the SAS token used to authenticate with the hub. A SAS token is generated from the name of your hub, the name of your device, and the device key.

In some scenarios, such as in a cloud protocol gateway or as part of a custom authentication scheme, you may need to generate the SAS token yourself. To troubleshoot issues with your SAS generation code, it's useful to generate a known-good SAS token to use during testing.

> [!NOTE]
> The SimulatedDevice-2.js sample includes examples of generating a SAS token both with and without the SDK.

1. Run the [az iot hub genereate-sas-token](/cli/azure/iot/hub#az-iot-hub-generate-sas-token) command to generate a known-good SAS token using the CLI:

   ```azurecli-interactive
   az iot hub generate-sas-token --device-id {your_device_id} --hub-name {your_iot_hub_name}
   ```

1. Copy the full text of the generated SAS token. A SAS token looks like the following example: `SharedAccessSignature sr=tutorials-iot-hub.azure-devices.net%2Fdevices%2FmyDevice&sig=xxxxxx&se=111111`

1. In a terminal window on your development machine, navigate to the root folder of the sample Node.js project you downloaded. Then navigate to the **iot-hub\Tutorials\ConnectivityTests** folder.

1. In the terminal window, run the following commands to install the required libraries and run the simulated device application:

   ```cmd/sh
   npm install
   node SimulatedDevice-2.js "{Your SAS token}"
   ```

   The terminal window displays a success message once it connects to your hub using the SAS token:

   :::image type="content" source="media/tutorial-connectivity/sim-2-connected.png" alt-text="Screenshot that shows a successful connection using a SAS token.":::

You've now successfully authenticated from a device using a test SAS token generated by a CLI command. The **SimulatedDevice-2.js** file includes sample code that shows you how to generate a SAS token in code.

### Protocols

A device can use any of the following protocols to connect to your IoT hub:

| Protocol | Outbound port |
| --- | --- |
| MQTT |8883 |
| MQTT over WebSockets |443 |
| AMQP |5671 |
| AMQP over WebSockets |443 |
| HTTPS |443 |

If the outbound port is blocked by a firewall, the device can't connect:

:::image type="content" source="media/tutorial-connectivity/port-blocked.png" alt-text="Screenshot that shows a connection error when the outbound port is blocked.":::

## Check device-to-cloud connectivity

After a device connects, it can start sending telemetry to your IoT hub. This section shows you how you can verify that the telemetry sent by the device reaches your hub.

### Send device-to-cloud messages

1. Since we reset the connection string for your device in the previous section, use the [az iot hub device-identity connection-string show](/cli/azure/iot/hub/device-identity/connection-string#az-iot-hub-device-identity-connection-string-show) command to retrieve the updated connection string:

   ```azurecli-interactive
   az iot hub device-identity connection-string show --device-id {your_device_id} --output table --hub-name {your_iot_hub_name}
   ```

1. To run a simulated device that sends messages, navigate to the **iot-hub\Tutorials\ConnectivityTests** folder in the code you downloaded.

1. In the terminal window, run the following commands to install the required libraries and run the simulated device application:

   ```cmd/sh
   npm install
   node SimulatedDevice-3.js "{your_device_connection_string}"
   ```

   The terminal window displays information as it sends telemetry to your hub:

   :::image type="content" source="media/tutorial-connectivity/sim-3-sending.png" alt-text="Screenshot that shows the simulated device sending messages.":::

### Monitor incoming messages

You can use **Metrics** in the portal to verify that the telemetry messages are reaching your IoT hub.

1. In the [Azure portal](https://portal.azure.com), select your IoT hub in the **Resource** drop-down.

1. Select **Metrics** from the **Monitoring** section of the navigation menu.

1. Select **Telemetry messages sent** as the metric, and set the time range to **Past hour**. The chart shows the aggregate count of messages sent by the simulated device:

   :::image type="content" source="media/tutorial-connectivity/metrics-portal.png" alt-text="Screenshot showing left pane metrics." border="true":::

It takes a few minutes for the metrics to become available after you start the simulated device.

## Check cloud-to-device connectivity

This section shows how you can make a test direct method call to a device to check cloud-to-device connectivity. You run a simulated device on your development machine to listen for direct method calls from your hub.

1. In a terminal window, use the following command to run the simulated device application:

   ```cmd/sh
   node SimulatedDevice-3.js "{your_device_connection_string}"
   ```

1. In a separate window, use the [az iot hub invoke-device-method](/cli/azure/iot/hub#az-iot-hub-invoke-device-method) command to call a direct method on the device:

   ```azurecli-interactive
   az iot hub invoke-device-method --device-id {your_device_id} --method-name TestMethod --timeout 10 --method-payload '{"key":"value"}' --hub-name {your_iot_hub_name}
   ```

   The simulated device prints a message to the console when it receives a direct method call:

   :::image type="content" source="media/tutorial-connectivity/receive-method-call.png" alt-text="Screenshot that shows the device confirming that the direct method was received.":::

   When the simulated device successfully receives the direct method call, it sends an acknowledgment back to the hub:

   :::image type="content" source="media/tutorial-connectivity/method-acknowledgement.png" alt-text="Screenshot showing that the device returns a direct method acknowledgment.":::

## Check twin synchronization

Devices use twins to synchronize state between the device and the hub. In this section, you use CLI commands to send *desired properties* to a device and read the *reported properties* sent by the device.

The simulated device you use in this section sends reported properties to the hub whenever it starts up, and prints desired properties to the console whenever it receives them.

1. In a terminal window, use the following command to run the simulated device application:

   ```cmd/sh
   node SimulatedDevice-3.js "{your_device_connection_string}"
   ```

1. In a separate window, run the [az iot hub device-twin show](/cli/azure/iot/hub/device-twin#az-iot-hub-device-twin-show) command to verify that the hub received the reported properties from the device:

   ```azurecli-interactive
   az iot hub device-twin show --device-id {your_device_id} --hub-name {your_iot_hub_name}
   ```

   In the output from the command, you can see the **devicelaststarted** property in the reported properties section. This property shows the date and time you last started the simulated device.

   :::image type="content" source="media/tutorial-connectivity/reported-properties.png" alt-text="Screenshot showing the reported properties of a device.":::

1. To verify that the hub can send desired property values to the device, use the [az iot hub device-twin update](/cli/azure/iot/hub/device-twin#az-iot-hub-device-twin-update) command:

   ```azurecli-interactive
   az iot hub device-twin update --set properties.desired='{"mydesiredproperty":"propertyvalue"}' --device-id {your_device_id} --hub-name {your_iot_hub_name}
   ```

   The simulated device prints a message when it receives a desired property update from the hub:

   :::image type="content" source="media/tutorial-connectivity/desired-properties.png" alt-text="Screenshot that shows the device confirming that the desired properties update was received.":::

In addition to receiving desired property changes as they're made, the simulated device automatically checks for desired properties when it starts up.

## Clean up resources

If you don't need the IoT hub any longer, delete it and the resource group in the portal. To do so, select the resource group that contains your IoT hub and select **Delete**.

## Next steps

In this tutorial, you've seen how to check your device keys, check device-to-cloud connectivity, check cloud-to-device connectivity, and check device twin synchronization. To learn more about how to monitor your IoT hub, visit the how-to article for IoT Hub monitoring.

> [!div class="nextstepaction"]
> [Monitor IoT Hub](monitor-iot-hub.md)

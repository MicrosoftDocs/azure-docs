---
 title: include file
 description: include file
 author: timlt
 ms.service: iot-develop
 ms.topic: include
 ms.date: 08/03/2021
 ms.author: timlt
 ms.custom: include file
---

[![Browse code](../articles/iot-develop/media/common/browse-code.svg)](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/master/iot-hub/Samples/device/PnpDeviceSamples)

In this quickstart, you learn a basic Azure IoT application development workflow. You use the Azure CLI to create an Azure IoT hub and a device. Then you use an Azure IoT device SDK sample to run a simulated temperature controller, connect it securely to the hub, and send telemetry.

## Prerequisites
- If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Visual Studio (Community, Professional, or Enterprise) 2019](https://visualstudio.microsoft.com/downloads/).
- A local copy of the [Microsoft Azure IoT Samples for C# (.NET)](https://github.com/Azure-Samples/azure-iot-samples-csharp) GitHub repository. Download a copy of the repository and extract it: [Download ZIP](https://github.com/Azure-Samples/azure-iot-samples-csharp/archive/master.zip).
- [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer/releases): Cross-platform utility to  monitor and manage Azure IoT 
- Azure CLI. You have two options for running Azure CLI commands in this quickstart:
    - Use the Azure Cloud Shell, an interactive shell that runs CLI commands in your browser. This option is recommended because you don't need to install anything. If you're using Cloud Shell for the first time, log into the [Azure portal](https://portal.azure.com). Follow the steps in [Cloud Shell quickstart](../articles/cloud-shell/quickstart.md) to **Start Cloud Shell** and **Select the Bash environment**.
    - Optionally, run Azure CLI on your local machine. If Azure CLI is already installed, run `az upgrade` to upgrade the CLI and extensions to the current version. To install Azure CLI, see [Install Azure CLI]( /cli/azure/install-azure-cli).

[!INCLUDE [iot-hub-include-create-hub-iot-explorer](iot-hub-include-create-hub-iot-explorer.md)]

## Run a simulated device
In this section, you'll use the C# SDK to send messages from a simulated device to your IoT hub. You'll run a sample that implements a temperature controller with two thermostat sensors.

To run the sample application in Visual Studio:

1. In the folder where you unzipped the Azure IoT Samples for C#, open the *azure-iot-samples-csharp-master\iot-hub\Samples\device\IoTHubDeviceSamples.sln"* solution file in Visual Studio. 

1. In **Solution Explorer**, select the **PnpDeviceSamples > TemperatureController** project file, right-click it, and select **Set as Startup Project**.

1. Right-click the **TemperatureController** project, select **Properties**, select the **Debug** tab, and add the following environment variables to the project:

    | Name | Value |
    | ---- | ----- |
    | IOTHUB_DEVICE_SECURITY_TYPE | *connectionString* |
    | IOTHUB_DEVICE_CONNECTION_STRING | The connection string you saved previously. |

1. Save the updated **TemperatureController** project file.

1. In Visual Studio, press CTRL + F5 to run the sample.

A console window opens. The sample securely connects to your IoT hub as the device you registered and begins sending telemetry messages. The sample output appears in the console.

## View telemetry

You can view the device telemetry with IoT Explorer. Optionally, you can view telemetry using Azure CLI.

To view telemetry in Azure IoT Explorer:

1. From your Iot hub in IoT Explorer, select **View devices in this hub**, then select your device from the list. 
1. On the left menu for your device, select **Telemetry**.
1. Confirm that **Use built-in event hub** is set to *Yes* and then select **Start**.
1. View the telemetry as the device sends messages to the cloud.

    :::image type="content" source="media/iot-develop-send-telemetry-iot-hub-csharp/iot-explorer-device-telemetry.png" alt-text="Screenshot of device telemetry in IoT Explorer":::

1. Select **Stop** to end receiving events.

To read telemetry sent by individual device components, you can use the plug and play features in IoT Explorer. For example, the temperature controller in this quickstart has two thermostats: thermostat1 and thermostat2. To see the temperature reported by thermostat1: 

1. On your device in IoT Explorer, select **IoT Plug and Play components** from the left menu. Then select **thermostat1** from the list of components.

1. On the **thermostat1** component pane, select **Telemetry** from the top menu.

1. On the **Telemetry** pane, follow the same steps that you did previously. Make sure that **Use built-in event hub** is set to *Yes* and then select **Start**.

To view device telemetry with Azure CLI:

1. In your CLI app, run the [az iot hub monitor-events](/cli/azure/iot/hub#az_iot_hub_monitor_events) command to monitor events sent from the simulated device to your IoT hub. Use the names that you created previously in Azure IoT for your device and IoT hub.

    ```azurecli
    az iot hub monitor-events --output table --device-id mydevice --hub-name {YourIoTHubName}
    ```

1. View the connection details and telemetry output in the console.

    ```output
    Starting event monitor, filtering on device: mydevice, use ctrl-c to stop...
    event:
      component: thermostat1
      interface: dtmi:com:example:TemperatureController;2
      module: ''
      origin: mydevice
      payload:
        temperature: 39.8
    
    event:
      component: thermostat2
      interface: dtmi:com:example:TemperatureController;2
      module: ''
      origin: mydevice
      payload:
        temperature: 36.7
    ```

1. Select CTRL+C to end monitoring.

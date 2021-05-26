---
 title: include file
 description: include file
 author: timlt
 ms.service: iot-develop
 ms.topic: include
 ms.date: 05/05/2021
 ms.author: timlt
 ms.custom: include file
---

## Prerequisites
- If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Visual Studio (Community, Professional, or Enterprise) 2019](https://visualstudio.microsoft.com/downloads/).
- A local copy of the [Microsoft Azure IoT Samples for C# (.NET)](https://github.com/Azure-Samples/azure-iot-samples-csharp) GitHub repository. Download a copy of the repository and extract it: [Download ZIP](https://github.com/Azure-Samples/azure-iot-samples-csharp/archive/master.zip).
- Azure CLI. You have two options for running Azure CLI commands in this quickstart:
    - Use the Azure Cloud Shell, an interactive shell that runs CLI commands in your browser. This option is recommended because you don't need to install anything. If you're using Cloud Shell for the first time, log into the [Azure portal](https://portal.azure.com). Follow the steps in [Cloud Shell quickstart](/azure/cloud-shell/quickstart) to **Start Cloud Shell** and **Select the Bash environment**.
    - Optionally, run Azure CLI on your local machine. The quickstart requires Azure CLI version 2.0.76 or later. Run `az --version` to check the version. Follow the steps in [Install Azure CLI]( /cli/azure/install-azure-cli) to install or upgrade Azure CLI, run it, and log in. If you're prompted, install the Azure CLI extensions on first use.

[!INCLUDE [iot-hub-include-create-hub-cli](iot-hub-include-create-hub-cli.md)]

## Run a simulated device
In this section, you configure your local environment, and run a sample that creates a simulated temperature controller.

To run the sample application in Visual Studio:

1. In the folder where you unzipped the Azure IoT Samples for C#, open the *azure-iot-samples-csharp-master\iot-hub\Samples\device\IoTHubDeviceSamples.sln"* solution file in Visual Studio. 

1. In **Solution Explorer**, select the **PnpDeviceSamples > TemperatureController** project file, right-click it, and select **Set as Startup Project**.

1. Right-click the **TemperatureController** project, select **Properties**, select the **Debug** tab, and add the following environment variables to the project:

    | Name | Value |
    | ---- | ----- |
    | IOTHUB_DEVICE_SECURITY_TYPE | *connectionString* |
    | IOTHUB_DEVICE_CONNECTION_STRING | The connection string you saved previously. |

1. Save the updated **TemperatureController** project file.

1. In your CLI app, run the [az iot hub monitor-events](/cli/azure/iot/hub#az_iot_hub_monitor_events) command to begin monitoring for events on your simulated IoT device.  Event messages print in the terminal as they arrive.

    ```azurecli-interactive
    az iot hub monitor-events --output table --hub-name {YourIoTHubName}
    ```

1. In Visual Studio, press CTRL + F5 to run the sample.

    After your simulated device connects to your IoT Central application, it begins to send telemetry. The connection details and telemetry output appear in the console: 
    
    ```output
    Starting event monitor, use ctrl-c to stop...
    event:
      component: thermostat1
      interface: dtmi:com:example:TemperatureController;2
      module: ''
      origin: myDevice
      payload:
        temperature: 39.8
    
    event:
      component: thermostat2
      interface: dtmi:com:example:TemperatureController;2
      module: ''
      origin: myDevice
      payload:
        temperature: 36.7
    ```
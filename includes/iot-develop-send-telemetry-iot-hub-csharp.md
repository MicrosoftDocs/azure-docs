---
 title: include file
 description: include file
 author: timlt
 ms.service: iot-develop
 ms.topic: include
 ms.date: 07/31/2021
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

1. In Visual Studio, press CTRL + F5 to run the sample.

[!INCLUDE [iot-hub-include-view-telemetry-iot-explorer](iot-hub-include-view-telemetry-iot-explorer.md)]

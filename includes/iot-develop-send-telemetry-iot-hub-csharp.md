---
 title: include file
 description: include file
 author: timlt
 ms.service: iot-develop
 ms.topic: include
 ms.date: 10/07/2021
 ms.author: timlt
 ms.custom: include file, devx-track-azurecli
 ms.devlang: azurecli
---

[![Browse code](../articles/iot-develop/media/common/browse-code.svg)](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/solutions/PnpDeviceSamples)

In this quickstart, you learn a basic Azure IoT application development workflow. You use the Azure CLI and IoT Explorer to create an Azure IoT hub and a device. Then you use an Azure IoT device SDK sample to run a temperature controller, connect it securely to the hub, and send telemetry. The temperature controller sample application runs on your local machine and generates simulated sensor data to send to IoT Hub.

## Prerequisites

This quickstart runs on Windows, Linux, and Raspberry Pi. It's been tested on the following OS and device versions:

- Windows 10
- Ubuntu 20.04 LTS
- Raspberry Pi OS (Raspbian) version 10, running on a Raspberry Pi 3 Model B+

Install the following prerequisites on your development machine except where noted for Raspberry Pi:

- If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Git](https://git-scm.com/downloads).
- .NET Core SDK 3.1. Be sure to install the .NET SDK, not just the runtime. To check the version of the .NET SDK and runtime installed on your machine, run `dotnet --info`.

  - For Windows and Linux (except Raspberry Pi), follow the instructions to [install the .NET Core SDK 3.1](/dotnet/core/install/) on your platform.
  - For Raspberry Pi, you'll need to follow the instructions to [manually install the SDK](/dotnet/core/install/linux-scripted-manual#manual-install). This is because on Debian, package manager installs of the .NET SDK are only supported for the x64 architecture.

- [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer/releases): Cross-platform, GUI-based utility to monitor and manage Azure IoT. If you're using Raspberry Pi as your development platform, we recommend that you install IoT Explorer on another computer. If you don't want to install IoT Explorer, you can use Azure CLI to perform the same steps.
- Azure CLI. You have two options for running Azure CLI commands in this quickstart:
    - Use the Azure Cloud Shell, an interactive shell that runs CLI commands in your browser. This option is recommended because you don't need to install anything. If you're using Cloud Shell for the first time, sign in to the [Azure portal](https://portal.azure.com). Follow the steps in [Get started with Azure Cloud Shell](../articles/cloud-shell/get-started.md) to **Start Cloud Shell** and **Select the Bash environment**.
    - Optionally, run Azure CLI on your local machine. If Azure CLI is already installed, run `az upgrade` to upgrade the CLI and extensions to the current version. To install Azure CLI, see [Install Azure CLI]( /cli/azure/install-azure-cli). If you're using Raspberry Pi as your development platform, we recommend that you use Azure Cloud Shell or install Azure CLI on another computer.

[!INCLUDE [iot-hub-include-create-hub-iot-explorer](iot-hub-include-create-hub-iot-explorer.md)]

## Run the device sample

In this section, you'll use the C# SDK to send messages from a device to your IoT hub. You'll run a sample that implements a temperature controller with two thermostat sensors.

1. Open a new console such as Windows CMD, PowerShell, or Bash. In the following steps, you'll use this console to install the Node.js SDK and work with Node.js sample code.

    > [!NOTE]
    > If you're using a local installation of Azure CLI, you might now have two console windows open. Be sure to enter the commands in this section in the console you just opened, not the one that you've been using for the CLI.

1. Clone the [Microsoft Azure IoT SDK for C# (.NET)](https://github.com/Azure/azure-iot-sdk-csharp) to your local machine:

    ```console
    git clone https://github.com/Azure/azure-iot-sdk-csharp.git
    ```

1. Navigate to the sample directory:

    **Windows**
    ```console
    cd azure-iot-sdk-csharp\iothub\device\samples\solutions\PnpDeviceSamples\TemperatureController
    ```

    **Linux or Raspberry Pi OS**
    ```console
    cd azure-iot-sdk-csharp/iothub/device/samples/solutions/PnpDeviceSamples/TemperatureController
    ```

1. Install the Azure IoT C# SDK and necessary dependencies:

    ```console
    dotnet restore
    ```

    This command installs the proper dependencies as specified in the *TemperatureController.csproj* file.

1. Set both of the following environment variables, to enable your device to connect to Azure IoT.
    * Set an environment variable called `IOTHUB_DEVICE_CONNECTION_STRING`. For the variable value, use the device connection string that you saved in the previous section.
    * Set an environment variable called `IOTHUB_DEVICE_SECURITY_TYPE`. For the variable, use the literal string value `connectionString`.

    **CMD (Windows)**

    ```console
    set IOTHUB_DEVICE_CONNECTION_STRING=<your connection string here>
    set IOTHUB_DEVICE_SECURITY_TYPE=connectionString
    ```

    > [!NOTE]
    > For Windows CMD there are no quotation marks surrounding the string values for each variable.

    **PowerShell**

    ```azurepowershell
    $env:IOTHUB_DEVICE_CONNECTION_STRING='<your connection string here>'
    $env:IOTHUB_DEVICE_SECURITY_TYPE='connectionString'
    ```

    **Bash**

    ```bash
    export IOTHUB_DEVICE_CONNECTION_STRING="<your connection string here>"
    export IOTHUB_DEVICE_SECURITY_TYPE="connectionString"
    ```
1. Run the code sample:

    ```console
    dotnet run
    ```
    > [!NOTE]
    > This code sample uses Azure IoT Plug and Play, which lets you integrate smart devices into your solutions without any manual configuration.  By default, most samples in this documentation use IoT Plug and Play. To learn more about the advantages of IoT PnP, and cases for using or not using it, see [What is IoT Plug and Play?](../articles/iot-develop/overview-iot-plug-and-play.md).

The sample securely connects to your IoT hub as the device you registered and begins sending telemetry messages. The sample output appears in your console.

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

1. Run the [az iot hub monitor-events](/cli/azure/iot/hub#az-iot-hub-monitor-events) command to monitor events sent from the device to your IoT hub. Use the names that you created previously in Azure IoT for your device and IoT hub.

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

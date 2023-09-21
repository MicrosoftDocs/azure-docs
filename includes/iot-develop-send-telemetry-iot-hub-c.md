---
 title: include file
 description: include file
 author: timlt
 ms.service: iot-develop
 ms.topic: include
 ms.date: 09/10/2021
 ms.author: timlt
 ms.custom: include file, devx-track-azurecli
 ms.devlang: azurecli
---

[![Browse code](../articles/iot-develop/media/common/browse-code.svg)](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples/pnp)

In this quickstart, you learn a basic Azure IoT application development workflow. You use the Azure CLI and IoT Explorer to create an Azure IoT hub and a device. Then you use an Azure IoT device SDK sample to run a temperature controller, connect it securely to the hub, and send telemetry. The temperature controller sample application runs on your local machine and generates simulated sensor data to send to IoT Hub.

## Prerequisites
This quickstart runs on Windows, Linux, and Raspberry Pi. It's been tested on the following OS and device versions:

- Windows 10
- Ubuntu 20.04 LTS
- Raspberry Pi OS (Raspbian) version 10, running on a Raspberry Pi 3 Model B+

Install the following prerequisites on your development machine except where noted for Raspberry Pi:

- If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Git](https://git-scm.com/downloads).
- [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer/releases): Cross-platform, GUI-based utility to monitor and manage Azure IoT. If you're using Raspberry Pi as your development platform, we recommend that you install IoT Explorer on another computer. If you don't want to install IoT Explorer, you can use Azure CLI to perform the same steps. 
- Azure CLI. You have two options for running Azure CLI commands in this quickstart:
    - Use the Azure Cloud Shell, an interactive shell that runs CLI commands in your browser. This option is recommended because you don't need to install anything. If you're using Cloud Shell for the first time, sign in to the [Azure portal](https://portal.azure.com). Follow the steps in [Cloud Shell quickstart](../articles/cloud-shell/quickstart.md) to **Start Cloud Shell** and **Select the Bash environment**.
    - Optionally, run Azure CLI on your local machine. If Azure CLI is already installed, run `az upgrade` to upgrade the CLI and extensions to the current version. To install Azure CLI, see [Install Azure CLI]( /cli/azure/install-azure-cli). If you're using Raspberry Pi as your development platform, we recommend that you use Azure Cloud Shell or install Azure CLI on another computer.

Install the remaining prerequisites for your operating system.

### Linux or Raspberry Pi OS
To complete this quickstart on Linux or Raspberry Pi OS, install the following software:

Install **GCC**, **Git**, **CMake**, and the required dependencies using the `apt-get` command:

```sh
sudo apt-get update
sudo apt-get install -y git cmake build-essential curl libcurl4-openssl-dev libssl-dev uuid-dev
```

Verify the version of CMake is **3.13** or greater, and the version of **GCC** is **4.4.7** or greater.

```sh
cmake --version
gcc --version
```

### Windows
To complete this quickstart on Windows, install Visual Studio 2022 and add the required components for C and C++ development.

1. For new users, install [Visual Studio (Community, Professional, or Enterprise) 2022](https://visualstudio.microsoft.com/downloads/). Download the edition you want to install, and start the installer.
    > [!NOTE]
    > For existing Visual Studio 2022 users, select Windows **Start**, type *Visual Studio Installer*, run the installer, and then select **Modify**. 
1. In the installer **Workloads** tab, select the **Desktop Development with C++** workload.
1. Run the installation.

[!INCLUDE [iot-hub-include-create-hub-iot-explorer](iot-hub-include-create-hub-iot-explorer.md)]

## Run the device sample
In this section, you use the C SDK to send messages from a device to your IoT hub. You run a sample that implements a temperature controller with two thermostat sensors.

### Build the sample
1. Open a new console to install the Azure IoT C device SDK and run the code sample. For Windows, select **Start**, type *Developer Command Prompt for VS 2019*, and open the console. For Linux and Raspberry Pi OS, open a terminal for Bash commands.

    > [!NOTE]
    > If you're using a local installation of Azure CLI, you might now have two console windows open. Be sure to enter the commands in this section in the console you just opened, not the one that you've been using for the CLI.

1. Navigate to a local folder where you want to clone the sample repo.

1. Clone the Azure IoT C device SDK to your local machine:
    ```console
    git clone https://github.com/Azure/azure-iot-sdk-c.git
    ```
1. Navigate to the root folder of the SDK, and run the following command to update dependencies:

    ```console
    cd azure-iot-sdk-c
    git submodule update --init
    ```
    This operation takes a few minutes.

1. To build the SDK and samples, run the following commands:

    ```console
    cmake -Bcmake -Duse_prov_client=ON -Dhsm_type_symm_key=ON -Drun_e2e_tests=OFF
    cmake --build cmake
    ```
1. Set the following environment variables, to enable your device to connect to Azure IoT.
    * Set an environment variable called `IOTHUB_DEVICE_CONNECTION_STRING`. For the variable value, use the device connection string that you saved in the previous section.
    * Set an environment variable called `IOTHUB_DEVICE_SECURITY_TYPE`. For the variable, use the literal string value `connectionString`.

    **CMD**

    ```console
    set IOTHUB_DEVICE_CONNECTION_STRING=<your connection string here>
    set IOTHUB_DEVICE_SECURITY_TYPE=connectionString
    ```
    > [!NOTE]
    > For Windows CMD there are no quotation marks surrounding the string values for each variable.

    **Bash**

    ```bash
    export IOTHUB_DEVICE_CONNECTION_STRING="<your connection string here>"
    export IOTHUB_DEVICE_SECURITY_TYPE="connectionString"
    ```

### Run the code
1. Run the sample code, using the appropriate command for your console.

    **CMD**
    ```console
    cmake\iothub_client\samples\pnp\pnp_temperature_controller\Debug\pnp_temperature_controller.exe
    ```

    **Bash**
    ```bash
    cmake/iothub_client/samples/pnp/pnp_temperature_controller/pnp_temperature_controller
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

    :::image type="content" source="media/iot-develop-send-telemetry-iot-hub-c/iot-explorer-device-telemetry.png" alt-text="Screenshot of device telemetry in IoT Explorer":::

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
      component: ''
      interface: dtmi:com:example:TemperatureController;1
      module: ''
      origin: mydevice
      payload: '{"workingSet":1251}'
    
    event:
      component: thermostat1
      interface: dtmi:com:example:TemperatureController;1
      module: ''
      origin: mydevice
      payload: '{"temperature":22.00}'
    ```

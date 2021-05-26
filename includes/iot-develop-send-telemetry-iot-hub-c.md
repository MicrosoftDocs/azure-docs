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
- [Git](https://git-scm.com/downloads).
- Azure CLI. You have two options for running Azure CLI commands in this quickstart:
    - Use the Azure Cloud Shell, an interactive shell that runs CLI commands in your browser. This option is recommended because you don't need to install anything. If you're using Cloud Shell for the first time, log into the [Azure portal](https://portal.azure.com). Follow the steps in [Cloud Shell quickstart](/azure/cloud-shell/quickstart) to **Start Cloud Shell** and **Select the Bash environment**.
    - Optionally, run Azure CLI on your local machine. The quickstart requires Azure CLI version 2.0.76 or later. Run `az --version` to check the version. Follow the steps in [Install Azure CLI]( /cli/azure/install-azure-cli) to install or upgrade Azure CLI, run it, and log in. If you're prompted, install the Azure CLI extensions on first use.

Install the remaining prerequisites for your operating system.

### Linux
The steps in this tutorial were tested using Ubuntu Linux 18.04.

To complete this quickstart on Linux, install the following software on your local Linux environment:

Install **GCC**, **Git**, **cmake**, and the required dependencies using the `apt-get` command:

```sh
sudo apt-get update
sudo apt-get install -y git cmake build-essential curl libcurl4-openssl-dev libssl-dev uuid-dev
```

Verify the version of `cmake` is above **2.8.12** and the version of **GCC** is above **4.4.7**.

```sh
cmake --version
gcc --version
```

### Windows
To complete this quickstart on Windows, install Visual Studio 2019 and add the required components for C and C++ development.

1. For new users, install [Visual Studio (Community, Professional, or Enterprise) 2019](https://visualstudio.microsoft.com/downloads/). Download the edition you want to install, and start the installer.
    > [!NOTE]
    > For existing Visual Studio 2019 users, select Windows **Start**, type *Visual Studio Installer*, and start the installer.
1. In the installer **Workloads** tab, select the **Desktop Development with C++** workload.
1. Run the installation.

[!INCLUDE [iot-hub-include-create-hub-cli](iot-hub-include-create-hub-cli.md)]

## Run a simulated device
In this section, you use the C SDK to send messages from your simulated device to your IoT hub.

### Build the sample
1. Open a console to install the Azure IoT C device SDK, and run the code sample. For Windows, select **Start**, type *Developer Command Prompt for VS 2019*, and open the console. For Linux, open Bash.
    > [!NOTE]
    > You should now have two console windows open: the one you just opened, and the Cloud Shell or CLI console that you used previously to enter CLI commands.

1. In your C console, clone the Azure IoT C device SDK to your local machine:
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
1. Set the following environment variables, to enable your simulated device to connect to Azure IoT.
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
1. In your CLI app, run the [az iot hub monitor-events](/cli/azure/iot/hub#az_iot_hub_monitor_events) command to begin monitoring for events on your simulated IoT device.  Event messages print in the terminal as they arrive.

    ```azurecli-interactive
    az iot hub monitor-events --output table --hub-name {YourIoTHubName}
    ```
1. Run the sample code, using the appropriate command for your console:

    **CMD**
    ```console
    cmake\iothub_client\samples\pnp\pnp_temperature_controller\Debug\pnp_temperature_controller.exe
    ```

    **Bash**
    ```bash
    cmake/iothub_client/samples/pnp/pnp_temperature_controller/Debug/pnp_temperature_controller
    ```
    > [!NOTE]
    > This code sample uses Azure IoT Plug and Play, which lets you integrate smart devices into your solutions without any manual configuration.  By default, most samples in this documentation use IoT Plug and Play. To learn more about the advantages of IoT PnP, and cases for using or not using it, see [What is IoT Plug and Play?](../articles/iot-pnp/overview-iot-plug-and-play.md).

    After your simulated device connects to your IoT Central application, it connects to the device instance you created in the application and begins to send telemetry. The connection details and telemetry output are shown in your console: 
    
    ```output
    Starting event monitor, use ctrl-c to stop...
    event:
      component: ''
      interface: dtmi:com:example:TemperatureController;1
      module: ''
      origin: myDevice
      payload: '{"workingSet":1251}'
    
    event:
      component: thermostat1
      interface: dtmi:com:example:TemperatureController;1
      module: ''
      origin: myDevice
      payload: '{"temperature":22.00}'
    ```
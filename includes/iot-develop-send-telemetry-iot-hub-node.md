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
- [Node.js](https://nodejs.org) version 10 or later. To check your node version run `node --version`.
- Azure CLI. You have two options for running Azure CLI commands in this quickstart:
    - Use the Azure Cloud Shell, an interactive shell that runs CLI commands in your browser. This option is recommended because you don't need to install anything. If you're using Cloud Shell for the first time, log into the [Azure portal](https://portal.azure.com). Follow the steps in [Cloud Shell quickstart](/azure/cloud-shell/quickstart) to **Start Cloud Shell** and **Select the Bash environment**.
    - Optionally, run Azure CLI on your local machine. The quickstart requires Azure CLI version 2.0.76 or later. Run `az --version` to check the version. Follow the steps in [Install Azure CLI]( /cli/azure/install-azure-cli) to install or upgrade Azure CLI, run it, and log in. If you're prompted, install the Azure CLI extensions on first use.

[!INCLUDE [iot-hub-include-create-hub-cli](iot-hub-include-create-hub-cli.md)]

## Run a simulated device
In this section, you will use the Node.js SDK to send messages from your simulated device to your IoT hub. 

1. Open a new console window. You will use this console to install the Node.js SDK and work with Node.js sample code. You should now have two console windows open: the one you just opened, and the Cloud Shell or CLI console that you used previously to enter CLI commands.

1. In your Node console, clone the [Azure IoT Node.js SDK device samples](https://github.com/Azure/azure-iot-sdk-node/tree/master/device/samples) to your local machine:

    ```console
    git clone https://github.com/Azure/azure-iot-sdk-node
    ```

1. Navigate to the *azure-iot-sdk-node/device/samples/pnp* directory:

    ```console
    cd azure-iot-sdk-node/device/samples/pnp
    ```

1. Install the Azure IoT Node.js SDK and necessary dependencies:

    ```console
    npm install
    ```

    This command installs the proper dependencies as specified in the *package.json* file in the device samples directory.

1. Set both of the following environment variables, to enable your simulated device to connect to Azure IoT.
    * Set an environment variable called `IOTHUB_DEVICE_CONNECTION_STRING`. For the variable value, use the device connection string that you saved in the previous section.
    * Set an environment variable called `IOTHUB_DEVICE_SECURITY_TYPE`. For the variable, use the literal string value `connectionString`.

    **Windows (cmd)**

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

    **Bash (Linux or Windows)**

    ```bash
    export IOTHUB_DEVICE_CONNECTION_STRING="<your connection string here>"
    export IOTHUB_DEVICE_SECURITY_TYPE="connectionString"
    ```
1. In your CLI app, run the [az iot hub monitor-events](/cli/azure/iot/hub#az_iot_hub_monitor_events) command to begin monitoring for events on your simulated IoT device.  Event messages will be printed in the terminal as they arrive.

    ```azurecli-interactive
    az iot hub monitor-events --output table --hub-name {YourIoTHubName}
    ```

1. In your Node console, run the code for the following sample file. This code accesses the simulated IoT device and sends a message to the IoT hub.

    To run the Node.js sample from the terminal:
    ```console
    node pnpTemperatureController.js
    ```
    > [!NOTE]
    > This code sample uses Azure IoT Plug and Play, which lets you integrate smart devices into your solutions without any manual configuration.  By default, most samples in this documentation use IoT Plug and Play. To learn more about the advantages of IoT PnP, and cases for using or not using it, see [What is IoT Plug and Play?](../articles/iot-pnp/overview-iot-plug-and-play.md).

As the Node.js code sends a simulated telemetry message from your device to the IoT hub, the message appears in your CLI app that is monitoring events:

```output
Starting event monitor, use ctrl-c to stop...
event:
  component: thermostat1
  interface: dtmi:com:example:TemperatureController;2
  module: ''
  origin: myDevice
  payload:
    temperature: 70.5897683228018

event:
  component: thermostat2
  interface: dtmi:com:example:TemperatureController;2
  module: ''
  origin: myDevice
  payload:
    temperature: 52.87582619316418
```

Your device is now securely connected and sending telemetry to Azure IoT Hub.
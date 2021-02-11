---
title: How to connect an IoT Plug and Play bridge sample running on Linux or Windows to an IoT hub | Microsoft Docs
description: Build and run IoT Plug and Play bridge on Linux or Windows that connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: usivagna
ms.author: ugans
ms.date: 12/11/2020
ms.topic: how-to
ms.service: iot-pnp
services: iot-pnp

# As a device builder, I want to see a working IoT Plug and Play device sample connecting to an IoT hub and sending properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# How to connect an  IoT Plug and Play bridge sample running on Linux or Windows to IoT Hub

This article shows you how to build the IoT Plug and Play bridge's sample environmental adapter, connect it to your IoT hub, and use the Azure IoT explorer tool to view the telemetry it sends. The IoT Plug and Play bridge is written in C and includes the Azure IoT device SDK for C. By the end of this tutorial you should be able to run the IoT Plug and Play bridge and see it report telemetry in Azure IoT explorer:

:::image type="content" source="media/concepts-iot-pnp-bridge/iot-pnp-bridge-explorer-telemetry.png" alt-text="A screenshot showing Azure IoT explorer with a table of reported telemetry (humidity, temperature) from Iot Plug and Play bridge.":::

## Prerequisites

You can run the sample in the article on Windows or Linux. The shell commands in this how-to guide follow the Windows convention for path separators '`\`', if you're following along on Linux be sure to swap these separators for '`/`'.

### Azure IoT explorer

To interact with the sample device in the second part of this article, you use the **Azure IoT explorer** tool. [Download and install the latest release of Azure IoT explorer](./howto-use-iot-explorer.md) for your operating system.

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT Hub connection string_ for your hub. Make a note of this connection string, you use it later in this article:

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

Run the following command to get the _device connection string_ for the device you added to the hub. Make a note of this connection string, you use it later in this article:

```azurecli-interactive
az iot hub device-identity show-connection-string --hub-name <YourIoTHubName> --device-id <YourDeviceID> --output table
```

## Download and run the bridge

In this article, you have two options to run the bridge. You can:

- Download a prebuilt executable and run it as described in this section.
- Download the source code and then [build and run the bridge](#build-and-run-the-bridge) as described in the following section.

To download and run the bridge:

1. Go to the IoT Plug and Play [releases page](https://github.com/Azure/iot-plug-and-play-bridge/releases).
1. Download the prebuilt executable for your operating system: **pnpbridge_bin.exe** for Windows, or **pnpbridge_bin** for Linux.
1. Download the sample [config.json](https://raw.githubusercontent.com/Azure/iot-plug-and-play-bridge/master/pnpbridge/src/adapters/samples/environmental_sensor/config.json) configuration file for the environmental sensor sample. Make sure that the configuration file is in the same folder as the executable.
1. Edit the *config.json* file:

    - Add the `connection-string` value that's the _device connection string_ you made a note of previously.
    - Add the `symmetric_key` value that's shared access key value from the _device connection string_.
    - Replace the `root_interface_model_id` value with `dtmi:com:example:PnpBridgeEnvironmentalSensor;1`.

    The first section of the *config.json* file now looks like the following snippet:

    ```json
    {
      "$schema": "../../../pnpbridge/src/pnpbridge_config_schema.json",
      "pnp_bridge_connection_parameters": {
        "connection_type" : "connection_string",
        "connection_string" : "HostName=youriothub.azure-devices.net;DeviceId=yourdevice;SharedAccessKey=TTrz8fR7ylHKt7DC/e/e2xocCa5VIcq5x9iQKxKFVa8=",
        "root_interface_model_id": "dtmi:com:example:PnpBridgeEnvironmentalSensor;1",
        "auth_parameters": {
            "auth_type": "symmetric_key",
            "symmetric_key": "TTrz8fR7ylHKt7DC/e/e2xocCa5VIcq5x9iQKxKFVa8="
        },
    ```

1. Run the executable in you command-line environment. The bridge generates output that looks like:

    ```output
    c:\temp\temp-bridge>dir
     Volume in drive C is OSDisk
     Volume Serial Number is 38F7-DA4A
    
     Directory of c:\temp\temp-bridge
    
    10/12/2020  12:24    <DIR>          .
    10/12/2020  12:24    <DIR>          ..
    08/12/2020  15:26             1,216 config.json
    10/12/2020  12:21         3,617,280 pnpbridge_bin.exe
                   2 File(s)      3,618,496 bytes
                   2 Dir(s)  12,999,147,520 bytes free
    
    c:\temp\temp-bridge>pnpbridge_bin.exe
    Info:
     -- Press Ctrl+C to stop PnpBridge
    
    Info: Using default configuration location
    Info: Starting Azure PnpBridge
    Info: Pnp Bridge is running as am IoT egde device.
    Info: Pnp Bridge creation succeeded.
    Info: Connection_type is [connection_string]
    Info: Tracing is disabled
    Info: WARNING: SharedAccessKey is included in connection string. Ignoring symmetric_key in config file.
    Info: IoT Edge Device configuration initialized successfully
    Info: Building Pnp Bridge Adapter Manager, Adapters & Components
    Info: Adapter with identity environment-sensor-sample-pnp-adapter does not have any associated global parameters. Proceeding with adapter creation.
    Info: Pnp Adapter with adapter ID environment-sensor-sample-pnp-adapter has been created.
    Info: Pnp Adapter Manager created successfully.
    Info: Pnp components created successfully.
    Info: Pnp components built in model successfully.
    Info: Connected to Azure IoT Hub
    Info: Environmental Sensor: Starting Pnp Component
    Info: IoTHub client call to _SendReportedState succeeded
    Info: Environmental Sensor Adapter:: Sending device information property to IoTHub. propertyName=state, propertyValue=true
    Info: Pnp components started successfully.
    ```

## Build and run the bridge

If you prefer to build the executable yourself, you can download the source code and build scripts.

Open a command prompt in a folder of your choice. Run the following command to clone the [IoT Plug and Play bridge](https://github.com/Azure/iot-plug-and-play-bridge) GitHub repository into this location:

```cmd
git clone https://github.com/Azure/iot-plug-and-play-bridge.git
```

After you clone the repository, update the submodules. The submodules include the Azure IoT SDK for C:

```cmd
cd iot-plug-and-play-bridge
git submodule update --init --recursive
```

Expect this operation to take several minutes to complete.

> [!TIP]
> If you run into issues with the git clone sub module update failing, this is a known issue with Windows file paths. You can try the following command to resolve the issue: `git config --system core.longpaths true`

The prerequisites for building the bridge differ by operating system:

### Windows

To build the IoT Plug and Play bridge on Windows, install the following software:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure you include the **Desktop Development with C++** workload when you [install](/cpp/build/vscpp-step-0-installation?preserve-view=true&view=vs-2019) Visual Studio.
* [Git](https://git-scm.com/download/).
* [CMake](https://cmake.org/download/).

### Linux

This article assumes you're using Ubuntu Linux. The steps in this article were tested using Ubuntu 18.04.

To build the IoT Plug and Play bridge on Linux, install **GCC**, **Git**, **cmake**, and all the required dependencies using the `apt-get` command:

```sh
sudo apt-get update
sudo apt-get install -y git cmake build-essential curl libcurl4-openssl-dev libssl-dev uuid-dev
```

Verify the version of `cmake` is above **2.8.12** and the version of **GCC** is above **4.4.7**.

```sh
cmake --version
gcc --version
```

### Build the IoT Plug and Play bridge

Navigate to the *pnpbridge* folder in the repository directory.

For Windows run the following in a [Developer Command Prompt for Visual Studio](/dotnet/framework/tools/developer-command-prompt-for-vs):

```cmd
cd scripts\windows
build.cmd
```

Similarly for Linux run the following:

```bash
cd scripts/linux
./setup.sh
./build.sh
```

>[!TIP]
>On Windows, you can open the solution generated by the cmake command in Visual Studio 2019. Open the *azure_iot_pnp_bridge.sln* project file in the cmake directory and set the *pnpbridge_bin* project as the startup project in the solution. You can now build the sample in Visual Studio and run it in debug mode.

### Edit the configuration file

You can learn more about config files in the [IoT Plug and Play bridge concepts document](concepts-iot-pnp-bridge.md).

Open the the *iot-plug-and-play-bridge\pnpbridge\src\adapters\samples\environmental_sensor\config.json* file in a text editor.

- Add the `connection-string` value that's the _device connection string_ you made a note of previously.
- Add the `symmetric_key` value that's shared access key value from the _device connection string_.
- Replace the `root_interface_model_id` value with `dtmi:com:example:PnpBridgeEnvironmentalSensor;1`.

The first section of the *config.json* file now looks like the following snippet:

```json
{
  "$schema": "../../../pnpbridge/src/pnpbridge_config_schema.json",
  "pnp_bridge_connection_parameters": {
    "connection_type" : "connection_string",
    "connection_string" : "HostName=youriothub.azure-devices.net;DeviceId=yourdevice;SharedAccessKey=TTrz8fR7ylHKt7DC/e/e2xocCa5VIcq5x9iQKxKFVa8=",
    "root_interface_model_id": "dtmi:com:example:PnpBridgeEnvironmentalSensor;1",
    "auth_parameters": {
        "auth_type": "symmetric_key",
        "symmetric_key": "TTrz8fR7ylHKt7DC/e/e2xocCa5VIcq5x9iQKxKFVa8="
    },
```

### Run the IoT Plug and Play bridge

Start the IoT Plug and Play bridge environmental sensor sample. The parameter is the path to `config.json` file you edited in the previous section:

```cmd
REM Windows
cd iot-plug-and-play-bridge\pnpbridge\cmake\pnpbridge_x86\src\pnpbridge\samples\console
Debug\pnpbridge_bin.exe ..\..\..\..\..\..\src\adapters\samples\environmental_sensor\config.json
```

The bridge generates output that looks like:

```output
c:\temp>cd iot-plug-and-play-bridge\pnpbridge\cmake\pnpbridge_x86\src\pnpbridge\samples\console

c:\temp\iot-plug-and-play-bridge\pnpbridge\cmake\pnpbridge_x86\src\pnpbridge\samples\console>Debug\pnpbridge_bin.exe ..\..\..\..\..\..\src\adapters\samples\environmental_sensor\config.json
Info:
 -- Press Ctrl+C to stop PnpBridge

Info: Using configuration from specified file path: ..\..\..\..\..\..\src\adapters\samples\environmental_sensor\config.json
Info: Starting Azure PnpBridge
Info: Pnp Bridge is running as am IoT egde device.
Info: Pnp Bridge creation succeeded.
Info: Connection_type is [connection_string]
Info: Tracing is disabled
Info: WARNING: SharedAccessKey is included in connection string. Ignoring symmetric_key in config file.
Info: IoT Edge Device configuration initialized successfully
Info: Building Pnp Bridge Adapter Manager, Adapters & Components
Info: Adapter with identity environment-sensor-sample-pnp-adapter does not have any associated global parameters. Proceeding with adapter creation.
Info: Pnp Adapter with adapter ID environment-sensor-sample-pnp-adapter has been created.
Info: Pnp Adapter Manager created successfully.
Info: Pnp components created successfully.
Info: Pnp components built in model successfully.
Info: Connected to Azure IoT Hub
Info: Environmental Sensor: Starting Pnp Component
Info: IoTHub client call to _SendReportedState succeeded
Info: Environmental Sensor Adapter:: Sending device information property to IoTHub. propertyName=state, propertyValue=true
Info: Pnp components started successfully.
Info: IoTHub client call to _SendEventAsync succeeded
Info: PnpBridge_PnpBridgeStateTelemetryCallback called, result=0, telemetry=PnpBridge configuration complete
Info: Processing property update for the device or module twin
Info: Environmental Sensor Adapter:: Successfully delivered telemetry message for <environmentalSensor>
```

Use the following commands to run the bridge on Linux:

```bash
cd iot-plug-and-play-bridge/pnpbridge/cmake/pnpbridge_x86/src/pnpbridge/samples/console
./pnpbridge_bin ../../../../../../src/adapters/samples/environmental_sensor/config.json
```

## Download the model files

You use Azure IoT Explorer later to view the device when it connects to your IoT hub. Azure IoT Explorer needs a local copy of the model file that matches the **Model ID** your device sends. The model file lets the IoT Explorer display the telemetry, properties, and commands that your device implements.

To download the models for Azure IoT explorer:

1. Create a folder called *models* on your local machine.
1. Save [EnvironmentalSensor.json](https://raw.githubusercontent.com/Azure/iot-plug-and-play-bridge/master/pnpbridge/docs/schemas/EnvironmentalSensor.json) to the *models* folder you created in the previous step.
1. If you open this model file in a text editor, you can see the the model defines a component with `dtmi:com:example:PnpBridgeEnvironmentalSensor;1` as its ID. This is the same model ID you used in the *config.json* file.

## Use Azure IoT explorer to validate the code

After the bridge starts, use the Azure IoT explorer tool to verify it's working. You can see the telemetry, properties, and commands defined in the `dtmi:com:example:PnpBridgeEnvironmentalSensor;1` model.

[!INCLUDE [iot-pnp-iot-explorer.md](../../includes/iot-pnp-iot-explorer.md)]

## Clean up resources

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this article, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

* [What is IoT Plug and Play bridge](./concepts-iot-pnp-bridge.md)
* [Build, deploy, and extend IoT Plug and Play bridge](howto-build-deploy-extend-pnp-bridge.md)
* [IoT Plug and Play bridge on GitHub](https://github.com/Azure/iot-plug-and-play-bridge)

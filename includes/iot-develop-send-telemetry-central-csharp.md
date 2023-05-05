---
 title: include file
 description: include file
 author: timlt
 ms.service: iot-develop
 ms.topic: include
 ms.date: 10/08/2021
 ms.author: timlt
 ms.custom: include file
---

[![Browse code](../articles/iot-develop/media/common/browse-code.svg)](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/solutions/PnpDeviceSamples)

In this quickstart, you learn a basic Azure IoT application development workflow. First you create an Azure IoT Central application for hosting devices. Then you use an Azure IoT device SDK sample to create a temperature controller, connect it securely to IoT Central, and send telemetry. The temperature controller sample application runs on your local machine and generates simulated sensor data to send to IoT Central.

> [!TIP]
> As a developer, you have some options for how to connect devices to Azure IoT. To learn about connection options, see [What is Azure IoT device and application development?](../articles/iot-develop/about-iot-develop.md#selecting-a-service).

## Prerequisites

This quickstart runs on Windows, Linux, and Raspberry Pi. It's been tested on the following OS and device versions:

- Windows 10
- Ubuntu 20.04 LTS
- Raspberry Pi OS (Raspbian) version 10, running on a Raspberry Pi 3 Model B+
- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Install the following prerequisites on your development machine:

- If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Git](https://git-scm.com/downloads).
- .NET Core SDK 3.1. Be sure to install the .NET SDK, not just the runtime. To check the version of the .NET SDK and runtime installed on your machine, run `dotnet --info`.

  - For Windows and Linux (except Raspberry Pi), follow the instructions to [install the .NET Core SDK 3.1](/dotnet/core/install/) on your platform.
  - For Raspberry Pi, you'll need to follow the instructions to [manually install the SDK](/dotnet/core/install/linux-scripted-manual#manual-install). This is because on Debian, package manager installs of the .NET SDK are only supported for the x64 architecture.

[!INCLUDE [iot-develop-create-central-app-with-device](iot-develop-create-central-app-with-device.md)]

## Run the device sample
In this section, you configure your local environment, install the Azure IoT C# SDK, and run a sample that creates a temperature controller.

### Configure your environment

1. Open a console such as Windows CMD, PowerShell, or Bash.

1. Set the following environment variables, using the appropriate commands for your console. The device uses these values to connect to IoT Central. For `IOTHUB_DEVICE_DPS_ID_SCOPE`, `IOTHUB_DEVICE_DPS_DEVICE_KEY`, and `IOTHUB_DEVICE_DPS_DEVICE_ID`, use the device connection values that you saved previously.

    **CMD (Windows)**

    ```console
    set IOTHUB_DEVICE_SECURITY_TYPE=DPS
    set IOTHUB_DEVICE_DPS_ID_SCOPE=<application ID scope>
    set IOTHUB_DEVICE_DPS_DEVICE_KEY=<device primary key>
    set IOTHUB_DEVICE_DPS_DEVICE_ID=<your device ID>
    set IOTHUB_DEVICE_DPS_ENDPOINT=global.azure-devices-provisioning.net
    ```

    > [!NOTE]
    > For Windows CMD there are no quotation marks surrounding the variable values.

    **PowerShell**

    ```azurepowershell
    $env:IOTHUB_DEVICE_SECURITY_TYPE='DPS'
    $env:IOTHUB_DEVICE_DPS_ID_SCOPE='<application ID scope>'
    $env:IOTHUB_DEVICE_DPS_DEVICE_KEY='<device primary key>'
    $env:IOTHUB_DEVICE_DPS_DEVICE_ID='<your device ID>'
    $env:IOTHUB_DEVICE_DPS_ENDPOINT='global.azure-devices-provisioning.net'
    ```

    **Bash**

    ```bash
    export IOTHUB_DEVICE_SECURITY_TYPE='DPS'
    export IOTHUB_DEVICE_DPS_ID_SCOPE='<application ID scope>'
    export IOTHUB_DEVICE_DPS_DEVICE_KEY='<device primary key>'
    export IOTHUB_DEVICE_DPS_DEVICE_ID='<your device ID>'
    export IOTHUB_DEVICE_DPS_ENDPOINT='global.azure-devices-provisioning.net' 
    ```

### Install the SDK and samples

1. Clone the [Microsoft Azure IoT SDK for C# (.NET)](https://github.com/Azure/azure-iot-sdk-csharp) to your local machine.

    ```console
    git clone https://github.com/Azure/azure-iot-sdk-csharp.git
    ```

1. Navigate to the sample directory.

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

### Run the code

1. In your console, run the code sample. The sample creates a temperature controller with thermostat sensors.

    ```console
    dotnet run
    ```

    After your device connects to your IoT Central application, it connects to the device instance you created in the application and begins to send telemetry. The connection details and telemetry output are shown in your console:

    ```output
    [10/09/2021 00:29:18]info: Microsoft.Azure.Devices.Client.Samples.TemperatureControllerSample[0]
          Press Control+C to quit the sample.
    [10/09/2021 00:29:18]dbug: Microsoft.Azure.Devices.Client.Samples.TemperatureControllerSample[0]
          Set up the device client.
    [10/09/2021 00:29:18]dbug: Microsoft.Azure.Devices.Client.Samples.TemperatureControllerSample[0]
          Initializing via DPS
    [10/09/2021 00:29:38]dbug: Microsoft.Azure.Devices.Client.Samples.TemperatureControllerSample[0]
          Set handler for 'reboot' command.
    [10/09/2021 00:29:39]dbug: Microsoft.Azure.Devices.Client.Samples.TemperatureControllerSample[0]
          Connection status change registered - status=Connected, reason=Connection_Ok.
    [10/09/2021 00:29:39]dbug: Microsoft.Azure.Devices.Client.Samples.TemperatureControllerSample[0]
          Set handler for "getMaxMinReport" command.
    [10/09/2021 00:29:39]dbug: Microsoft.Azure.Devices.Client.Samples.TemperatureControllerSample[0]
          Set handler to receive 'targetTemperature' updates.
    [10/09/2021 00:29:39]dbug: Microsoft.Azure.Devices.Client.Samples.TemperatureControllerSample[0]
          Property: Update - component = 'deviceInformation', properties update is complete.
    [10/09/2021 00:29:39]dbug: Microsoft.Azure.Devices.Client.Samples.TemperatureControllerSample[0]
          Property: Update - { "serialNumber": "SR-123456" } is complete.
    [10/09/2021 00:29:40]dbug: Microsoft.Azure.Devices.Client.Samples.TemperatureControllerSample[0]
          Telemetry: Sent - component="thermostat1", { "temperature": 23.7 } in °C.
    [10/09/2021 00:29:40]dbug: Microsoft.Azure.Devices.Client.Samples.TemperatureControllerSample[0]
          Property: Update - component="thermostat1", { "maxTempSinceLastReboot": 23.7 } in °C is complete.
    [10/09/2021 00:29:40]dbug: Microsoft.Azure.Devices.Client.Samples.TemperatureControllerSample[0]
          Telemetry: Sent - component="thermostat2", { "temperature": 25.8 } in °C.
    ```
<properties
   pageTitle="Connect a device using C on mbed | Microsoft Azure"
   description="Describes how to connect a device to the Azure IoT Suite preconfigured remote monitoring solution using an application written in C running on an mbed device."
   services=""
   suite="iot-suite"
   documentationCenter="na"
   authors="dominicbetts"
   manager="timlt"
   editor=""/>

<tags
   ms.service="iot-suite"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/14/2016"
   ms.author="dobett"/>


# Connect your device to the remote monitoring preconfigured solution (mbed)

[AZURE.INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

## Build and run the C sample solution

The following instructions describe the steps for connecting an [mbed-enabled Freescale FRDM-K64F][lnk-mbed-home] device to the remote monitoring solution.

### Connect the mbed device to your network and desktop machine

1. Connect the mbed device to your network using an Ethernet cable. This step is necessary because the sample application requires internet access.

2. See [Getting Started with mbed][lnk-mbed-getstarted] to connect your mbed device to your desktop PC.

3. If your desktop PC is running Windows, see [PC Configuration][lnk-mbed-pcconnect] to configure serial port access to your mbed device.

### Create an mbed project and import the sample code

1. In your web browser, go to the mbed.org [developer site](https://developer.mbed.org/). If you haven't signed up, you see an option to create a new account (it's free). Otherwise, log in with your account credentials. Then click **Compiler** in the upper right-hand corner of the page. This brings you to the *Workspace* interface.

2. Make sure the hardware platform you're using appears in the upper right-hand corner of the window, or click the icon in the right-hand corner to select your hardware platform.

3. Click **Import** on the main menu. Then click the **Click here** to import from URL link next to the mbed globe logo.

    ![][6]

4. In the pop-up window, enter the link for the sample code https://developer.mbed.org/users/AzureIoTClient/code/remote_monitoring/ then click **Import**.

    ![][7]

5. You can see in the mbed compiler window that importing this project also imports various libraries. Some are provided and maintained by the Azure IoT team ([azureiot_common](https://developer.mbed.org/users/AzureIoTClient/code/azureiot_common/), [iothub_client](https://developer.mbed.org/users/AzureIoTClient/code/iothub_client/), [iothub_amqp_transport](https://developer.mbed.org/users/AzureIoTClient/code/iothub_amqp_transport/), [azure_uamqp](https://developer.mbed.org/users/AzureIoTClient/code/azure_uamqp/)), while others are third-party libraries available in the mbed libraries catalog.

    ![][8]

6. Open the remote_monitoring\remote_monitoring.c file and locate the following code in the file:

    ```
    static const char* deviceId = "[Device Id]";
    static const char* deviceKey = "[Device Key]";
    static const char* hubName = "[IoTHub Name]";
    static const char* hubSuffix = "[IoTHub Suffix, i.e. azure-devices.net]";
    ```

7. Replace [Device Id] and [Device Key], with your device data to enable the sample program to connect to your IoT hub. Use the IoT Hub Hostname to replace the [IoTHub Name] and [IoTHub Suffix, i.e. azure-devices.net] placeholders. For example, if your IoT Hub Hostname is **contoso.azure-devices.net**, **contoso** is the **hubName** and everything after it is the **hubSuffix**:

    ```
    static const char* deviceId = "mydevice";
    static const char* deviceKey = "mykey";
    static const char* hubName = "contoso";
    static const char* hubSuffix = "azure-devices.net";
    ```

    ![][9]

### Walk through the code

If you are interested in how the program works, this section describes some the key parts of the sample code. If you just want to run the code, skip ahead to [Build and run the program](#buildandrun).

#### Defining the model

This sample uses the [serializer][lnk-serializer] library to define a model that specifies the messages the device can send to IoT Hub and receive from IoT Hub. In this sample, the **Contoso** namespace defines a **Thermostat** model that specifies the **Temperature**, **ExternalTemperature** and **Humidity** telemetry data along with metadata such as the device id, device properties, and the commands that the device responds to:

```
BEGIN_NAMESPACE(Contoso);

DECLARE_STRUCT(SystemProperties,
    ascii_char_ptr, DeviceID,
    _Bool, Enabled
);

DECLARE_STRUCT(DeviceProperties,
ascii_char_ptr, DeviceID,
_Bool, HubEnabledState
);

DECLARE_MODEL(Thermostat,

    /* Event data (temperature, external temperature and humidity) */
    WITH_DATA(int, Temperature),
    WITH_DATA(int, ExternalTemperature),
    WITH_DATA(int, Humidity),
    WITH_DATA(ascii_char_ptr, DeviceId),

    /* Device Info - This is command metadata + some extra fields */
    WITH_DATA(ascii_char_ptr, ObjectType),
    WITH_DATA(_Bool, IsSimulatedDevice),
    WITH_DATA(ascii_char_ptr, Version),
    WITH_DATA(DeviceProperties, DeviceProperties),
    WITH_DATA(ascii_char_ptr_no_quotes, Commands),

    /* Commands implemented by the device */
    WITH_ACTION(SetTemperature, int, temperature),
    WITH_ACTION(SetHumidity, int, humidity)
);

END_NAMESPACE(Contoso);
```

Related to the model definition are the definitions for the **SetTemperature** and **SetHumidity** commands that the device responds to:

```
EXECUTE_COMMAND_RESULT SetTemperature(Thermostat* thermostat, int temperature)
{
    (void)printf("Received temperature %d\r\n", temperature);
    thermostat->Temperature = temperature;
    return EXECUTE_COMMAND_SUCCESS;
}

EXECUTE_COMMAND_RESULT SetHumidity(Thermostat* thermostat, int humidity)
{
    (void)printf("Received humidity %d\r\n", humidity);
    thermostat->Humidity = humidity;
    return EXECUTE_COMMAND_SUCCESS;
}
```

#### Connecting the model to the library

The functions **sendMessage** and **IoTHubMessage** are boilerplate code for sending telemetry from the device and connecting messages from IoT Hub to the command handlers.

#### The remote_monitoring_run function

The program's **main** function invokes the **remote_monitoring_run** function when the application starts to execute the device's behavior as an IoT Hub device client. This **remote_monitoring_run** function mostly consists of nested pairs of functions:

- **platform\_init** and **platform\_deinit** perform platform specific initialization and shutdown operations.
- **serializer\_init** and **serializer\_deinit** initialize and de-initialize the serializer library.
- **IoTHubClient\_Create** and **IoTHubClient\_Destroy** create a client handle, **iotHubClientHandle**, using the device credentials for connecting to your IoT hub.

In the main section of the **remote_monitoring_run** function, the program performs the following operations using the **iotHubClientHandle** handle:

- Creates an instance of the Contoso thermostat model and sets up the message callbacks for the two commands.
- Sends information about the device itself, including the commands it supports, to your IoT hub using the serializer library. When the hub receives this message, it changes the device status in the dashboard from **Pending** to **Running**.
- Starts a **while** loop that sends temperature, external temperature, and humidity values to IoT Hub every second.

For reference, here is a sample **DeviceInfo** message sent to IoT Hub at start up:

```
{
  "ObjectType":"DeviceInfo",
  "Version":"1.0",
  "IsSimulatedDevice":false,
  "DeviceProperties":
  {
    "DeviceID":"mydevice01", "HubEnabledState":true
  }, 
  "Commands":
  [
    {"Name":"SetHumidity", "Parameters":[{"Name":"humidity","Type":"double"}]},
    { "Name":"SetTemperature", "Parameters":[{"Name":"temperature","Type":"double"}]}
  ]
}
```

For reference, here is a sample **Telemetry** message sent to IoT Hub:

```
{"DeviceId":"mydevice01", "Temperature":50, "Humidity":50, "ExternalTemperature":55}
```

For reference, here is a sample **Command** received from IoT Hub:

```
{
  "Name":"SetHumidity",
  "MessageId":"2f3d3c75-3b77-4832-80ed-a5bb3e233391",
  "CreatedTime":"2016-03-11T15:09:44.2231295Z",
  "Parameters":{"humidity":23}
}
```

<a id="buildandrun"/>
### Build and run the program

1. Click **Compile** to build the program. You can safely ignore any warnings, but if the build generates errors, fix them before proceeding.

2. If the build is successful, the mbed compiler website generates a .bin file with the name of your project and downloads it to your local machine. Copy the .bin file to the device. Saving the .bin file to the device causes the device to restart and run the program contained in the .bin file. You can manually restart the program at any time by pressing the reset button on the mbed device.

3. Connect to the device using an SSH client application, such as PuTTY. You can determine the serial port your device uses by checking Windows Device Manager.

    ![][11]

4. In PuTTY, click the **Serial** connection type. The device typically connects at 9600 baud, so enter 9600 in the **Speed** box. Then click **Open**.

5. The program starts executing. You may have to reset the board (press CTRL+Break or press on the board's reset button) if the program does not start automatically when you connect.

    ![][10]

[AZURE.INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]


[6]: ./media/iot-suite-connecting-devices-mbed/mbed1.png
[7]: ./media/iot-suite-connecting-devices-mbed/mbed2a.png
[8]: ./media/iot-suite-connecting-devices-mbed/mbed3a.png
[9]: ./media/iot-suite-connecting-devices-mbed/suite6.png
[10]: ./media/iot-suite-connecting-devices-mbed/putty.png
[11]: ./media/iot-suite-connecting-devices-mbed/mbed6.png

[lnk-mbed-home]: https://developer.mbed.org/platforms/FRDM-K64F/
[lnk-mbed-getstarted]: https://developer.mbed.org/platforms/FRDM-K64F/#getting-started-with-mbed
[lnk-mbed-pcconnect]: https://developer.mbed.org/platforms/FRDM-K64F/#pc-configuration
[lnk-serializer]: https://azure.microsoft.com/documentation/articles/iot-hub-device-sdk-c-intro/#serializer

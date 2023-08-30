---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 06/06/2023
---

[![Browse code](../articles/iot-central/core/media/common/browse-code.svg)](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples/pnp)

## Prerequisites

To complete the steps in this tutorial, you need:

[!INCLUDE [iot-central-prerequisites-basic](iot-central-prerequisites-basic.md)]

You can run this tutorial on Linux or Windows. The shell commands in this tutorial follow the Linux convention for path separators '`/`', if you're following along on Windows be sure to swap these separators for '`\`'.

The prerequisites differ by operating system:

### Linux

This tutorial assumes you're using Ubuntu Linux. The steps in this tutorial were tested using Ubuntu 18.04.

To complete this tutorial on Linux, install the following software on your local Linux environment:

Install **GCC**, **Git**, **cmake**, and all the required dependencies using the `apt-get` command:

```sh
sudo apt-get update
sudo apt-get install -y git cmake build-essential curl libcurl4-openssl-dev libssl-dev uuid-dev
```

Verify the version of `cmake` is greater than **2.8.12** and the version of **GCC** is greater than **4.4.7**.

```sh
cmake --version
gcc --version
```

### Windows

To complete this tutorial on Windows, install the following software on your local Windows environment:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure you include the **Desktop Development with C++** workload when you [install](/cpp/build/vscpp-step-0-installation?preserve-view=true&view=vs-2019) Visual Studio.
* [Git](https://git-scm.com/download/).
* [CMake](https://cmake.org/download/).

## Download the code

In this tutorial, you prepare a development environment you can use to clone and build the Azure IoT Hub Device C SDK.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Azure IoT C SDKs and Libraries](https://github.com/Azure/azure-iot-sdk-c) GitHub repository into this location:

```cmd/sh
git clone https://github.com/Azure/azure-iot-sdk-c.git
cd azure-iot-sdk-c
git submodule update --init
```

Expect this operation to take several minutes to complete.

## Review the code

In the copy of the Microsoft Azure IoT SDK for C you downloaded previously, open the *azure-iot-sdk-c/iothub_client/samples/pnp/pnp_temperature_controller/pnp_temperature_controller.c* and *azure-iot-sdk-c/iothub_client/samples/pnp/pnp_temperature_controller/pnp_thermostat_component.c* files in a text editor.

The sample implements the multiple-component [Temperature Controller](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) Digital Twin Definition Language model.

When you run the sample to connect to IoT Central, it uses the Device Provisioning Service (DPS) to register the device and generate a connection string. The sample retrieves the DPS connection information it needs from the command-line environment.

In *pnp_temperature_controller.c*, the `main` function first calls `CreateDeviceClientAndAllocateComponents` to:

* Set the `dtmi:com:example:Thermostat;1` model ID. IoT Central uses the model ID to identify or generate the device template for this device. To learn more, see [Assign a device to a device template](../articles/iot-central/core/concepts-device-templates.md#assign-a-device-to-a-device-template).
* Use DPS to provision and register the device.
* Create a device client handle, and connect to your IoT Central application.
* Creates a handler for commands in the temperature controller component.
* Creates a handler for property updates in the temperature controller component.
* Creates the two thermostat components.

The `main` function next:

* Reports some initial property values for all the components.
* Starts a loop to send telemetry from all the components.

The `main` function then starts a thread to send telemetry periodically.

```c
int main(void)
{
    IOTHUB_DEVICE_CLIENT_LL_HANDLE deviceClient = NULL;

    g_pnpDeviceConfiguration.modelId = g_temperatureControllerModelId;
    g_pnpDeviceConfiguration.enableTracing = g_hubClientTraceEnabled;

    // First determine the IoT Hub / credentials / device to use.
    if (GetConnectionSettingsFromEnvironment(&g_pnpDeviceConfiguration) == false)
    {
        LogError("Cannot read required environment variable(s)");
    }
    // Creates the thermostat subcomponents defined by this model.  Since everything
    // is simulated, this setup stage just creates simulated objects in memory.
    else if (AllocateThermostatComponents() == false)
    {
        LogError("Failure allocating thermostat components");
    }
    // Create a handle to device client handle.  Note that this call may block
    // for extended periods of time when using DPS.
    else if ((deviceClient = CreateAndConfigureDeviceClientHandleForPnP()) == NULL)
    {
        LogError("Failure creating Iot Hub device client");
        PnP_ThermostatComponent_Destroy(g_thermostatHandle1);
        PnP_ThermostatComponent_Destroy(g_thermostatHandle2);
    }
    else
    {
        LogInfo("Successfully created device client.  Hit Control-C to exit program\n");

        int numberOfIterations = 0;

        // During startup, send what DTDLv2 calls "read-only properties" to indicate initial device state.
        PnP_TempControlComponent_ReportSerialNumber_Property(deviceClient);
        PnP_DeviceInfoComponent_Report_All_Properties(g_deviceInfoComponentName, deviceClient);
        PnP_TempControlComponent_Report_MaxTempSinceLastReboot_Property(g_thermostatHandle1, deviceClient);
        PnP_TempControlComponent_Report_MaxTempSinceLastReboot_Property(g_thermostatHandle2, deviceClient);

        while (true)
        {
            // Wake up periodically to poll.  Even if we do not plan on sending telemetry, we still need to poll periodically in order to process
            // incoming requests from the server and to do connection keep alives.
            if ((numberOfIterations % g_sendTelemetryPollInterval) == 0)
            {
                PnP_TempControlComponent_SendWorkingSet(deviceClient);
                PnP_ThermostatComponent_SendCurrentTemperature(g_thermostatHandle1, deviceClient);
                PnP_ThermostatComponent_SendCurrentTemperature(g_thermostatHandle2, deviceClient);
            }

            IoTHubDeviceClient_LL_DoWork(deviceClient);
            ThreadAPI_Sleep(g_sleepBetweenPollsMs);
            numberOfIterations++;
        }

        // The remainder of the code is used for cleaning up our allocated resources. It won't be executed in this 
        // sample (because the loop above is infinite and is only broken out of by Control-C of the program), but 
        // it is included for reference.

        // Free the memory allocated to track simulated thermostat.
        PnP_ThermostatComponent_Destroy(g_thermostatHandle1);
        PnP_ThermostatComponent_Destroy(g_thermostatHandle2);

        // Clean up the IoT Hub SDK handle.
        IoTHubDeviceClient_LL_Destroy(deviceClient);
        // Free all IoT Hub subsystem.
        IoTHub_Deinit();
    }

    return 0;
}
```

In `pnp_thermostat_component.c`, the `PnP_ThermostatComponent_SendCurrentTemperature` function shows how the device sends the temperature telemetry from a component to IoT Central:

```c
void PnP_ThermostatComponent_SendCurrentTemperature(PNP_THERMOSTAT_COMPONENT_HANDLE pnpThermostatComponentHandle, IOTHUB_DEVICE_CLIENT_LL_HANDLE deviceClient)
{
    PNP_THERMOSTAT_COMPONENT* pnpThermostatComponent = (PNP_THERMOSTAT_COMPONENT*)pnpThermostatComponentHandle;
    IOTHUB_MESSAGE_HANDLE messageHandle = NULL;
    IOTHUB_MESSAGE_RESULT messageResult;
    IOTHUB_CLIENT_RESULT iothubClientResult;

    char temperatureStringBuffer[CURRENT_TEMPERATURE_BUFFER_SIZE];

    // Create the telemetry message body to send.
    if (snprintf(temperatureStringBuffer, sizeof(temperatureStringBuffer), g_temperatureTelemetryBodyFormat, pnpThermostatComponent->currentTemperature) < 0)
    {
        LogError("snprintf of current temperature telemetry failed");
    }
    // Create the message handle and specify its metadata.
    else if ((messageHandle = IoTHubMessage_CreateFromString(temperatureStringBuffer)) == NULL)
    {
        LogError("IoTHubMessage_PnP_CreateFromString failed");
    }
    else if ((messageResult = IoTHubMessage_SetContentTypeSystemProperty(messageHandle, g_jsonContentType)) != IOTHUB_MESSAGE_OK)
    {
        LogError("IoTHubMessage_SetContentTypeSystemProperty failed, error=%d", messageResult);
    }
    else if ((messageResult = IoTHubMessage_SetContentEncodingSystemProperty(messageHandle, g_utf8EncodingType)) != IOTHUB_MESSAGE_OK)
    {
        LogError("IoTHubMessage_SetContentEncodingSystemProperty failed, error=%d", messageResult);
    }
    else if ((messageResult = IoTHubMessage_SetComponentName(messageHandle, pnpThermostatComponent->componentName)) != IOTHUB_MESSAGE_OK)
    {
        LogError("IoTHubMessage_SetContentEncodingSystemProperty failed, error=%d", messageResult);
    }
    // Send the telemetry message.
    else if ((iothubClientResult = IoTHubDeviceClient_LL_SendTelemetryAsync(deviceClient, messageHandle, NULL, NULL)) != IOTHUB_CLIENT_OK)
    {
        LogError("Unable to send telemetry message, error=%d", iothubClientResult);
    }

    IoTHubMessage_Destroy(messageHandle);
}
```

In `pnp_thermostat_component.c`, the `PnP_TempControlComponent_Report_MaxTempSinceLastReboot_Property` function sends a `maxTempSinceLastReboot` property update from the component to IoT Central:

```c
void PnP_TempControlComponent_Report_MaxTempSinceLastReboot_Property(PNP_THERMOSTAT_COMPONENT_HANDLE pnpThermostatComponentHandle, IOTHUB_DEVICE_CLIENT_LL_HANDLE deviceClient)
{
    PNP_THERMOSTAT_COMPONENT* pnpThermostatComponent = (PNP_THERMOSTAT_COMPONENT*)pnpThermostatComponentHandle;
    char maximumTemperatureAsString[MAX_TEMPERATURE_SINCE_REBOOT_BUFFER_SIZE];
    IOTHUB_CLIENT_RESULT iothubClientResult;

    if (snprintf(maximumTemperatureAsString, sizeof(maximumTemperatureAsString), g_maxTempSinceLastRebootPropertyFormat, pnpThermostatComponent->maxTemperature) < 0)
    {
        LogError("Unable to create max temp since last reboot string for reporting result");
    }
    else
    {
        IOTHUB_CLIENT_PROPERTY_REPORTED maxTempProperty;
        maxTempProperty.structVersion = IOTHUB_CLIENT_PROPERTY_REPORTED_STRUCT_VERSION_1;
        maxTempProperty.name = g_maxTempSinceLastRebootPropertyName;
        maxTempProperty.value =  maximumTemperatureAsString;

        unsigned char* propertySerialized = NULL;
        size_t propertySerializedLength;

        // The first step of reporting properties is to serialize IOTHUB_CLIENT_PROPERTY_WRITABLE_RESPONSE into JSON for sending.
        if ((iothubClientResult = IoTHubClient_Properties_Serializer_CreateReported(&maxTempProperty, 1, pnpThermostatComponent->componentName, &propertySerialized, &propertySerializedLength)) != IOTHUB_CLIENT_OK)
        {
            LogError("Unable to serialize reported state, error=%d", iothubClientResult);
        }
        // The output of IoTHubClient_Properties_Serializer_CreateReported is sent to IoTHubDeviceClient_LL_SendPropertiesAsync to perform network I/O.
        else if ((iothubClientResult = IoTHubDeviceClient_LL_SendPropertiesAsync(deviceClient, propertySerialized, propertySerializedLength,  NULL, NULL)) != IOTHUB_CLIENT_OK)
        {
            LogError("Unable to send reported state, error=%d", iothubClientResult);
        }
        else
        {
            LogInfo("Sending %s property to IoTHub for component %s", g_maxTempSinceLastRebootPropertyName, pnpThermostatComponent->componentName);
        }
        IoTHubClient_Properties_Serializer_Destroy(propertySerialized);
    }
}
```

In `pnp_thermostat_component.c`, the `PnP_ThermostatComponent_ProcessPropertyUpdate` function handles writable property updates from IoT Central:

```c
void PnP_ThermostatComponent_ProcessPropertyUpdate(PNP_THERMOSTAT_COMPONENT_HANDLE pnpThermostatComponentHandle, IOTHUB_DEVICE_CLIENT_LL_HANDLE deviceClient, const char* propertyName, const char* propertyValue, int version)
{
    PNP_THERMOSTAT_COMPONENT* pnpThermostatComponent = (PNP_THERMOSTAT_COMPONENT*)pnpThermostatComponentHandle;

    if (strcmp(propertyName, g_targetTemperaturePropertyName) != 0)
    {
        LogError("Property %s was requested to be changed but is not part of the thermostat interface definition", propertyName);
    }
    else
    {
        char* next;
        double targetTemperature = strtod(propertyValue, &next);
        if ((propertyValue == next) || (targetTemperature == HUGE_VAL) || (targetTemperature == (-1*HUGE_VAL)))
        {
            LogError("Property %s is not a valid number", propertyValue);
            SendTargetTemperatureResponse(pnpThermostatComponent, deviceClient, propertyValue, PNP_STATUS_BAD_FORMAT, version, g_temperaturePropertyResponseDescriptionNotInt);
        }
        else
        {
            LogInfo("Received targetTemperature %f for component %s", targetTemperature, pnpThermostatComponent->componentName);
            
            bool maxTempUpdated = false;
            UpdateTemperatureAndStatistics(pnpThermostatComponent, targetTemperature, &maxTempUpdated);

            // The device needs to let the service know that it has received the targetTemperature desired property.
            SendTargetTemperatureResponse(pnpThermostatComponent, deviceClient, propertyValue, PNP_STATUS_SUCCESS, version, NULL);
            
            if (maxTempUpdated)
            {
                // If the maximum temperature has been updated, we also report this as a property.
                PnP_TempControlComponent_Report_MaxTempSinceLastReboot_Property(pnpThermostatComponent, deviceClient);
            }
        }
    }
}
```

In `pnp_thermostat_component.c`, the `PnP_ThermostatComponent_ProcessCommand` function handles commands called from IoT Central:

```c
void PnP_ThermostatComponent_ProcessCommand(PNP_THERMOSTAT_COMPONENT_HANDLE pnpThermostatComponentHandle, const char *pnpCommandName, JSON_Value* commandJsonValue, IOTHUB_CLIENT_COMMAND_RESPONSE* commandResponse)
{
    PNP_THERMOSTAT_COMPONENT* pnpThermostatComponent = (PNP_THERMOSTAT_COMPONENT*)pnpThermostatComponentHandle;
    const char* sinceStr;

    if (strcmp(pnpCommandName, g_getMaxMinReportCommandName) != 0)
    {
        LogError("Command %s is not supported on thermostat component", pnpCommandName);
        commandResponse->statusCode = PNP_STATUS_NOT_FOUND;
    }
    // See caveats section in ../readme.md; we don't actually respect this sinceStr to keep the sample simple,
    // but want to demonstrate how to parse out in any case.
    else if ((sinceStr = json_value_get_string(commandJsonValue)) == NULL)
    {
        LogError("Cannot retrieve JSON string for command");
        commandResponse->statusCode = PNP_STATUS_BAD_FORMAT;
    }
    else if (BuildMaxMinCommandResponse(pnpThermostatComponent, commandResponse) == false)
    {
        LogError("Unable to build response for component %s", pnpThermostatComponent->componentName);
        commandResponse->statusCode = PNP_STATUS_INTERNAL_ERROR;
    }
    else
    {
        LogInfo("Returning success from command request for component %s", pnpThermostatComponent->componentName);
        commandResponse->statusCode = PNP_STATUS_SUCCESS;
    }
}
```

## Build the code

You use the device SDK to build the included sample code:

1. Create a *cmake* subdirectory in the root folder of the device SDK, and navigate to that folder:

    ```cmd/sh
    cd azure-iot-sdk-c
    mkdir cmake
    cd cmake
    ```

1. Run the following commands to build the SDK and samples:

    ```cmd/sh
    cmake -Duse_prov_client=ON -Dhsm_type_symm_key=ON -Drun_e2e_tests=OFF ..
    cmake --build .
    ```

## Get connection information

[!INCLUDE [iot-central-connection-configuration](iot-central-connection-configuration.md)]

## Run the code

To run the sample application, open a command-line environment and navigate to the folder *azure-iot-sdk-c\cmake*.

[!INCLUDE [iot-central-connection-environment](iot-central-connection-environment.md)]

To run the sample:

```bash
# Bash
cd iothub_client/samples/pnp/pnp_temperature_controller/
./pnp_temperature_controller
```

```cmd
REM Windows
cd iothub_client\samples\pnp\pnp_temperature_controller\Debug
.\pnp_temperature_controller.exe
```

The following output shows the device registering and connecting to IoT Central. The sample starts sending telemetry:

```output
Info: Initiating DPS client to retrieve IoT Hub connection information
-> 09:43:27 CONNECT | VER: 4 | KEEPALIVE: 0 | FLAGS: 194 | USERNAME: 0ne0026656D/registrations/sample-device-01/api-version=2019-03-31&ClientVersion=1.6.0 | PWD: XXXX | CLEAN: 1
<- 09:43:28 CONNACK | SESSION_PRESENT: false | RETURN_CODE: 0x0
-> 09:43:29 SUBSCRIBE | PACKET_ID: 1 | TOPIC_NAME: $dps/registrations/res/# | QOS: 1
<- 09:43:30 SUBACK | PACKET_ID: 1 | RETURN_CODE: 1
-> 09:43:30 PUBLISH | IS_DUP: false | RETAIN: 0 | QOS: DELIVER_AT_MOST_ONCE | TOPIC_NAME: $dps/registrations/PUT/iotdps-register/?$rid=1 | PAYLOAD_LEN: 102
<- 09:43:31 PUBLISH | IS_DUP: false | RETAIN: 0 | QOS: DELIVER_AT_LEAST_ONCE | TOPIC_NAME: $dps/registrations/res/202/?$rid=1&retry-after=3 | PACKET_ID: 2 | PAYLOAD_LEN: 94
-> 09:43:31 PUBACK | PACKET_ID: 2
-> 09:43:33 PUBLISH | IS_DUP: false | RETAIN: 0 | QOS: DELIVER_AT_MOST_ONCE | TOPIC_NAME: $dps/registrations/GET/iotdps-get-operationstatus/?$rid=2&operationId=4.2f792ade0a5c3e68.baf0e879-d88a-4153-afef-71aff51fd847 | PAYLOAD_LEN: 102
<- 09:43:34 PUBLISH | IS_DUP: false | RETAIN: 0 | QOS: DELIVER_AT_LEAST_ONCE | TOPIC_NAME: $dps/registrations/res/202/?$rid=2&retry-after=3 | PACKET_ID: 2 | PAYLOAD_LEN: 173
-> 09:43:34 PUBACK | PACKET_ID: 2
-> 09:43:36 PUBLISH | IS_DUP: false | RETAIN: 0 | QOS: DELIVER_AT_MOST_ONCE | TOPIC_NAME: $dps/registrations/GET/iotdps-get-operationstatus/?$rid=3&operationId=4.2f792ade0a5c3e68.baf0e879-d88a-4153-afef-71aff51fd847 | PAYLOAD_LEN: 102
<- 09:43:37 PUBLISH | IS_DUP: false | RETAIN: 0 | QOS: DELIVER_AT_LEAST_ONCE | TOPIC_NAME: $dps/registrations/res/200/?$rid=3 | PACKET_ID: 2 | PAYLOAD_LEN: 478
-> 09:43:37 PUBACK | PACKET_ID: 2
Info: Provisioning callback indicates success.  iothubUri=iotc-60a....azure-devices.net, deviceId=sample-device-01
-> 09:43:37 DISCONNECT
Info: DPS successfully registered.  Continuing on to creation of IoTHub device client handle.
Info: Successfully created device client.  Hit Control-C to exit program

Info: Sending serialNumber property to IoTHub
Info: Sending device information property to IoTHub.  propertyName=swVersion, propertyValue="1.0.0.0"
Info: Sending device information property to IoTHub.  propertyName=manufacturer, propertyValue="Sample-Manufacturer"
Info: Sending device information property to IoTHub.  propertyName=model, propertyValue="sample-Model-123"
Info: Sending device information property to IoTHub.  propertyName=osName, propertyValue="sample-OperatingSystem-name"
Info: Sending device information property to IoTHub.  propertyName=processorArchitecture, propertyValue="Contoso-Arch-64bit"
Info: Sending device information property to IoTHub.  propertyName=processorManufacturer, propertyValue="Processor Manufacturer(TM)"
Info: Sending device information property to IoTHub.  propertyName=totalStorage, propertyValue=10000
Info: Sending device information property to IoTHub.  propertyName=totalMemory, propertyValue=200
Info: Sending maximumTemperatureSinceLastReboot property to IoTHub for component=thermostat1
Info: Sending maximumTemperatureSinceLastReboot property to IoTHub for component=thermostat2
-> 09:43:44 CONNECT | VER: 4 | KEEPALIVE: 240 | FLAGS: 192 | USERNAME: iotc-60a576a2-eec7-48e2-9306-9e7089a79995.azure-devices.net/sample-device-01/?api-version=2020-09-30&DeviceClientType=iothubclient%2f1.6.0%20(native%3b%20Linux%3b%20x86_64)&model-id=dtmi%3acom%3aexample%3aTemperatureController%3b1 | PWD: XXXX | CLEAN: 0
<- 09:43:44 CONNACK | SESSION_PRESENT: false | RETURN_CODE: 0x0
-> 09:43:44 SUBSCRIBE | PACKET_ID: 2 | TOPIC_NAME: $iothub/twin/res/# | QOS: 0 | TOPIC_NAME: $iothub/methods/POST/# | QOS: 0
-> 09:43:44 PUBLISH | IS_DUP: false | RETAIN: 0 | QOS: DELIVER_AT_LEAST_ONCE | TOPIC_NAME: devices/sample-device-01/messages/events/ | PACKET_ID: 3 | PAYLOAD_LEN: 19
-> 09:43:44 PUBLISH | IS_DUP: false | RETAIN: 0 | QOS: DELIVER_AT_LEAST_ONCE | TOPIC_NAME: devices/sample-device-01/messages/events/%24.sub=thermostat1 | PACKET_ID: 4 | PAYLOAD_LEN: 21
-> 09:43:44 PUBLISH | IS_DUP: false | RETAIN: 0 | QOS: DELIVER_AT_LEAST_ONCE | TOPIC_NAME: devices/sample-device-01/messages/events/%24.sub=thermostat2 | PACKET_ID: 5 | PAYLOAD_LEN: 21
```

[!INCLUDE [iot-central-monitor-thermostat](iot-central-monitor-thermostat.md)]

You can see how the device responds to commands and property updates:

```output
<- 09:49:03 PUBLISH | IS_DUP: false | RETAIN: 0 | QOS: DELIVER_AT_MOST_ONCE | TOPIC_NAME: $iothub/methods/POST/thermostat1*getMaxMinReport/?$rid=1 | PAYLOAD_LEN: 26
Info: Received PnP command for component=thermostat1, command=getMaxMinReport
Info: Returning success from command request for component=thermostat1
-> 09:49:03 PUBLISH | IS_DUP: false | RETAIN: 0 | QOS: DELIVER_AT_MOST_ONCE | TOPIC_NAME: $iothub/methods/res/200/?$rid=1 | PAYLOAD_LEN: 117

...

<- 09:50:04 PUBLISH | IS_DUP: false | RETAIN: 0 | QOS: DELIVER_AT_MOST_ONCE | TOPIC_NAME: $iothub/twin/PATCH/properties/desired/?$version=2 | PAYLOAD_LEN: 63
Info: Received targetTemperature=67.000000 for component=thermostat2
Info: Sending acknowledgement of property to IoTHub for component=thermostat2
```

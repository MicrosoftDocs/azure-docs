---
title: Collect device debug logs
titleSuffix: Azure IoT Hub
description: To troubleshoot device issues, it's sometimes useful to collect low-level debug logs from the devices. This article shows how to use the device SDKs to generate debug logs.
author: dominicbetts
ms.author: dobett
ms.date: 01/20/2023
ms.topic: how-to
ms.service: iot-hub
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
services: iot-hub
zone_pivot_groups: programming-languages-set-twenty-seven

#- id: programming-languages-set-twenty-seven
#    title: Embedded C
#Customer intent: As a device builder, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and sending properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# How to collect debug logs from your Azure IoT devices

To troubleshoot device issues, it's sometimes useful to collect low-level debug logs from the devices. This article shows how to capture debug logs from the device SDKs. The steps outlined in this article assume you have either direct or remote access the device.

> [!CAUTION]
> If you're sharing logs with a support engineer or adding them to a GitHub issue, be sure to remove any confidential information such as connection strings.

## Capture trace logs

:::zone pivot="programming-language-ansi-c"

To capture trace data from the Azure IoT Hub client connection, you use the client `logtrace` option.

You can set the option by using either the convenience layer or low-level layer:

```c
// Convenience layer for device client
IOTHUB_CLIENT_RESULT IoTHubDeviceClient_SetOption(IOTHUB_DEVICE_CLIENT_HANDLE iotHubClientHandle, const char* optionName, const void* value);

// Lower layer for device client
IOTHUB_CLIENT_RESULT IoTHubDeviceClient_LL_SetOption(IOTHUB_DEVICE_CLIENT_LL_HANDLE iotHubClientHandle, const char* optionName, const void* value);
```

The following example from the [pnp_temperature_controller.c](https://github.com/Azure/azure-iot-sdk-c/blob/main/iothub_client/samples/pnp/pnp_temperature_controller/pnp_temperature_controller.c) sample shows how to enable trace capture by using the convenience layer:

```c
static bool g_hubClientTraceEnabled = true;

...

else if ((iothubClientResult = IoTHubDeviceClient_LL_SetOption(deviceClient, OPTION_LOG_TRACE, &g_hubClientTraceEnabled)) != IOTHUB_CLIENT_OK)
{
    LogError("Unable to set logging option, error=%d", iothubClientResult);
    result = false;
}
```

The trace output is written to `stdout`.

To learn more about capturing and viewing trace data from the C SDK, see [IoT Hub device and module client options](https://github.com/Azure/azure-iot-sdk-c/blob/main/doc/Iothub_sdk_options.md#iot-hub-device-and-module-client-options).

:::zone-end

:::zone pivot="programming-language-csharp"

### Capture trace data on Windows

On Windows, the Azure IoT SDK for .NET exports trace data by using Event Tracing for Windows (ETW). The SDK repository includes [PowerShell scripts to start and stop a capture](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/tools/CaptureLogs).

Run the following scripts in an elevated PowerShell prompt on the device. The *iot_providers.txt* file lists the [GUIDs for the IoT SDK providers](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/tools/CaptureLogs#azure-iot-sdk-providers). To start capturing trace data in a file called *iot.etl*:

```powershell
.\iot_startlog.ps1 -Output iot.etl -ProviderFile .\iot_providers.txt -TraceName IotTrace
```

To stop the capture:

```powershell
 .\iot_stoplog.ps1 -TraceName IotTrace
```

To learn more about capturing and viewing trace data from the .NET SDK, see [Capturing Traces](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/tools/CaptureLogs/readme.md).

### Capture trace data on Linux

On Linux, you can use the **dotnet-trace** tool to capture trace data. To install the tool, run the following command:

```bash
dotnet tool install --global dotnet-trace
```

Before you can collect a trace, you need the process ID of the device client application. To list the processes on the device, run the following command:

```bash
dotnet-trace ps
```

The following example output includes the **TemperatureController** device client process with process ID **24987**:

```bash
24772  dotnet                 /usr/share/dotnet/dotnet                 dotnet run
25206  dotnet                 /usr/share/dotnet/dotnet                 dotnet trace ps
24987  TemperatureController  /bin/Debug/net6.0/TemperatureController
```

To capture trace data from this process to a file called *device.nettrace*, run the following command:

```bash
dotnet-trace collect --process-id 24987 --output device.nettrace --providers Microsoft-Azure-Devices-Device-Client
```

The `providers` argument is a comma-separated list of event providers. The following list shows the Azure IoT SDK providers:

- Microsoft-Azure-Devices-Device-Client
- Microsoft-Azure-Devices-Service-Client
- Microsoft-Azure-Devices-Provisioning-Client
- Microsoft-Azure-Devices-Provisioning-Transport-Amqp
- Microsoft-Azure-Devices-Provisioning-Transport-Http
- Microsoft-Azure-Devices-Provisioning-Transport-Mqtt.
- Microsoft-Azure-Devices-Security-Tpm

To learn more about capturing and viewing trace data from the .NET SDK, see [Capturing Traces](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/tools/CaptureLogs/readme.md).

:::zone-end

:::zone pivot="programming-language-java"

The Azure IoT SDK for Java exports trace data by using [SLF4j](http://www.slf4j.org/faq.html). The samples included in the SDK configure SLF4j by using a property file: *src/main/resources/log4j2.properties*. The property file in each sample configures logging to the console:

```properties
status = error
name = Log4j2PropertiesConfig

appenders = console

appender.console.type = Console
appender.console.name = LogToConsole
appender.console.layout.type = PatternLayout
appender.console.layout.pattern = %d %p (%t) [%c] - %m%n

rootLogger.level = debug
rootLogger.appenderRefs = stdout
rootLogger.appenderRef.stdout.ref = LogToConsole
```

To log just debug messages from the SDK to a file, you can use the following configuration:

```properties
status = error
name = Log4j2PropertiesConfig

# Log file location - choose a suitable path for your OS
property.filePath = c/temp/logs

appenders = console,file

appender.console.type = Console
appender.console.name = LogToConsole
appender.console.layout.type = PatternLayout
appender.console.layout.pattern = %d %p (%t) [%c] - %m%n

appender.file.type = File
appender.file.name = LogToFile
appender.file.fileName = ${filePath}/device.log
appender.file.layout.type = PatternLayout
appender.file.layout.pattern = %d %p (%t) [%c] - %m%n

loggers.file
logger.file.name = com.microsoft.azure.sdk.iot
logger.file.level = debug
logger.file.appenderRefs = logfile
logger.file.appenderRef.logfile.ref = LogToFile

rootLogger.level = debug
rootLogger.appenderRefs = stdout
rootLogger.appenderRef.stdout.ref = LogToConsole
```

To learn more about capturing and viewing trace data from the Java SDK, see [Azure IoT SDK logging](https://github.com/Azure/azure-iot-sdk-java/blob/main/logging.md#azure-iot-sdk-logging).

:::zone-end

:::zone pivot="programming-language-javascript"

The Azure IoT SDK for Node.js uses the [debug](https://github.com/visionmedia/debug) library to capture trace logs. You control the trace by using the `DEBUG` environment variable.

To capture trace information from the SDK and the low-level MQTT library, set the following environment variable before you run your device code:

```bash
export DEBUG=azure*,mqtt*
```

> [!TIP]
> If you're using the AMQP protocol, use `rhea*` to capture trace information from the low-level library.

To capture just the trace data to a file called *trace.log*, use a command such as:

```bash
node pnp_temperature_controller.js 2> trace.log
```

To learn more about capturing and viewing trace data from the Node.js SDK, see [Troubleshooting guide - devices](https://github.com/Azure/azure-iot-sdk-node/wiki/Troubleshooting-Guide-Devices).

:::zone-end

:::zone pivot="programming-language-python"

The Azure IoT SDK for Python uses the [logging](https://docs.python.org/3/library/logging.html) module to capture trace logs. You control the trace by using a logging configuration file. If you're using one of the samples in the SDK, you may need to modify the code to load a logging configuration from a file:

Replace the following line:

```python
logging.basicConfig(level=logging.ERROR)
```

With this line:

```python
logging.config.fileConfig('logging.conf')
```

Create a file called *logging.conf*. The following example captures debug information from all modules with a prefix `azure.iot.device` in the file:

```conf
[loggers]
keys=root,azure

[handlers]
keys=consoleHandler,fileHandler

[formatters]
keys=simpleFormatter

[logger_root]
level=ERROR
handlers=consoleHandler

[logger_azure]
level=DEBUG
handlers=fileHandler
qualname=azure.iot.device
propagate=0

[handler_consoleHandler]
class=StreamHandler
level=DEBUG
formatter=simpleFormatter
args=(sys.stdout,)

[handler_fileHandler]
class=FileHandler
level=DEBUG
formatter=simpleFormatter
args=('device.log', 'w')

[formatter_simpleFormatter]
format=%(asctime)s - %(name)s - %(levelname)s - %(message)s
```

To learn more about capturing and viewing trace data from the Python SDK, see [Configure logging in the Azure libraries for Python](/azure/developer/python/sdk/azure-sdk-logging).

:::zone-end

:::zone pivot="programming-language-embedded-c"

To capture trace information from the [Azure SDK for Embedded C](https://github.com/Azure/azure-sdk-for-c) library for embedded IoT devices, add a callback function to your device code that handles the trace messages. For example, your callback function could write to the console and save the messages to a file.

The following example shows how you could modify the [paho_iot_hub_sas_telemetry_sample.c](https://github.com/Azure/azure-sdk-for-c/blob/main/sdk/samples/iot/paho_iot_hub_sas_telemetry_sample.c) to capture trace information and write it to the console:

```c
#include <azure/core/az_log.h>

...

static void write_log_message(az_log_classification, az_span);

...

int main(void)
{
  az_log_set_message_callback(write_log_message);

  ...
}

static void write_log_message(az_log_classification classification, az_span message)
{
   (void)classification;
   printf("TRACE:\t\t%.*s\n", az_span_size(message), az_span_ptr(message));
}
```

To learn more about capturing and filtering trace data in the Embedded C SDK, see [Logging SDK operations](https://github.com/Azure/azure-sdk-for-c/tree/main/sdk/docs/core#logging-sdk-operations).

:::zone-end

## Next steps

If you need more help, you can contact the Azure experts on the [Microsoft Q&A and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.

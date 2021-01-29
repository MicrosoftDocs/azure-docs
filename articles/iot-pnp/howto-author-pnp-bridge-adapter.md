---
title: How to build an adapter for the IoT Plug and Play bridge | Microsoft Docs
description: Identify the IoT Plug and Play bridge adapter components. Learn how to extend the bridge by writing your own adapter.
author: usivagna
ms.author: ugans
ms.date: 1/20/2021
ms.topic: how-to
ms.service: iot-pnp
services: iot-pnp

# As a device builder, I want to understand the IoT Plug and Play bridge, learn how to build and IoT Plug and Play bridge adapter.
---
# Extend the IoT Plug and Play bridge
The [IoT Plug and Play bridge](concepts-iot-pnp-bridge.md#iot-plug-and-play-bridge-architecture) lets you connect the existing devices attached to a gateway to your IoT hub. You use the bridge to map IoT Plug and Play interfaces to the attached devices. An IoT Plug and Play interface defines the telemetry that a device sends, the properties synchronized between the device and the cloud, and the commands that the device responds to. You can install and configure the open-source bridge application on Windows or Linux gateways. Additionally, the bridge can be run as an Azure IoT Edge runtime module.

This article explains in detail how to:

- Extend the IoT Plug and Play bridge with an adapter.
- Implement common callbacks for a bridge adapter.

For a simple example that shows how to use the bridge, see [How to connect the IoT Plug and Play bridge sample that runs on Linux or Windows to IoT Hub](howto-use-iot-pnp-bridge.md).

The guidance and samples in this article assume basic familiarity with [Azure Digital Twins](../digital-twins/overview.md) and [IoT Plug and Play](overview-iot-plug-and-play.md). Additionally, this article assumes familiarity with how to [Build, and deploy the IoT Plug and Play bridge](howto-build-deploy-extend-pnp-bridge.md).

## Design Guide to extend the IoT Plug and Play bridge with an adapter

To extend the capabilities of the bridge, you can author your own bridge adapters.

The bridge uses adapters to:

- Establish a connection between a device and the cloud.
- Enable data flow between a device and the cloud.
- Enable device management from the cloud.

Every bridge adapter must:

- Create a digital twins interface.
- Use the interface to bind device-side functionality to cloud-based capabilities such as telemetry, properties, and commands.
- Establish control and data communication with the device hardware or firmware.

Each bridge adapter interacts with a specific type of device based on how the adapter connects to and interacts with the device. Even if communication with a device uses a handshaking protocol, a bridge adapter may have multiple ways to interpret the data from the device. In this scenario, the bridge adapter uses information for the adapter in the configuration file to determine the *interface configuration* the adapter should use to parse the data.

To interact with the device, a bridge adapter uses a communication protocol supported by the device and APIs provided either by the underlying operating system, or the device vendor.

To interact with the cloud, a bridge adapter uses APIs provided by the Azure IoT Device C SDK to send telemetry, create digital twin interfaces, send property updates, and create callback functions for property updates and commands.

### Create a bridge adapter

The bridge expects a bridge adapter to implement the APIs defined in the [_PNP_ADAPTER](https://github.com/Azure/iot-plug-and-play-bridge/blob/9964f7f9f77ecbf4db3b60960b69af57fd83a871/pnpbridge/src/pnpbridge/inc/pnpadapter_api.h#L296) interface:

```c
typedef struct _PNP_ADAPTER {
  // Identity of the IoT Plug and Play adapter that is retrieved from the config
  const char* identity;

  PNPBRIDGE_ADAPTER_CREATE createAdapter;
  PNPBRIDGE_COMPONENT_CREATE createPnpComponent;
  PNPBRIDGE_COMPONENT_START startPnpComponent;
  PNPBRIDGE_COMPONENT_STOP stopPnpComponent;
  PNPBRIDGE_COMPONENT_DESTROY destroyPnpComponent;
  PNPBRIDGE_ADAPTER_DESTOY destroyAdapter;
} PNP_ADAPTER, * PPNP_ADAPTER;
```

In this interface:

- `PNPBRIDGE_ADAPTER_CREATE` creates the adapter and sets up the interface management resources. An adapter may also rely on global adapter parameters for adapter creation. This function is called once for a single adapter.
- `PNPBRIDGE_COMPONENT_CREATE` creates the digital twin client interfaces and binds the callback functions. The adapter initiates the communication channel to the device. The adapter may set up the resources to enable the telemetry flow but doesn't start reporting telemetry until `PNPBRIDGE_COMPONENT_START` is called. This function is called once for each interface component in the configuration file.
- `PNPBRIDGE_COMPONENT_START` is called to let the bridge adapter start forwarding telemetry from the device to the digital twin client. This function is called once for each interface component in the configuration file.
- `PNPBRIDGE_COMPONENT_STOP` stops the telemetry flow.
- `PNPBRIDGE_COMPONENT_DESTROY` destroys the digital twin client and associated interface resources. This function is called once for each interface component in the configuration file when the bridge is torn down or when a fatal error occurs.
- `PNPBRIDGE_ADAPTER_DESTROY` cleans up the bridge adapter resources.

### Bridge core interaction with bridge adapters

The following list outlines what happens when the bridge starts:

1. When the bridge starts, the bridge adapter manager looks through each interface component defined in the configuration file and calls `PNPBRIDGE_ADAPTER_CREATE` on the appropriate adapter. The adapter may use global adapter configuration parameters to set up resources to support the various *interface configurations*.
1. For every device in the configuration file, the bridge manager initiates interface creation by calling `PNPBRIDGE_COMPONENT_CREATE` in the appropriate bridge adapter.
1. The adapter receives any optional adapter configuration settings for the interface component and uses this information to set up connections to the device.
1. The adapter creates the digital twin client interfaces and binds the callback functions for property updates and commands. Establishing device connections shouldn't block the return of the callbacks after digital twin interface creation succeeds. The active device connection is independent of the active interface client the bridge creates. If a connection fails, the adapter assumes the device is inactive. The bridge adapter can choose to retry making this connection.
1. After the bridge adapter manger creates all the interface components specified in the configuration file, it registers all the interfaces with Azure IoT Hub. Registration is a blocking, asynchronous call. When the call completes, it triggers a callback in the bridge adapter that can then start handling property and command callbacks from the cloud.
1. The bridge adapter manager then calls `PNPBRIDGE_INTERFACE_START` on each component and the bridge adapter starts reporting telemetry to the digital twin client.

### Design guidelines

Follow these guidelines when you develop a new bridge adapter:

- Determine which device capabilities are supported and what the interface definition of the components using this adapter looks like.
- Determine what interface and global parameters your adapter needs defined in the configuration file.
- Identify the low-level device communication required to support the component properties and commands.
- Determine how the adapter should parse the raw data from the device and convert it to the telemetry types that the IoT Plug and Play interface definition specifies.
- Implement the bridge adapter interface described previously.
- Add the new adapter to the adapter manifest and build the bridge.

### Enable a new bridge adapter

You enable adapters in the bridge by adding a reference in [adapter_manifest.c](https://github.com/Azure/iot-plug-and-play-bridge/blob/master/pnpbridge/src/adapters/src/shared/adapter_manifest.c):

```c
  extern PNP_ADAPTER MyPnpAdapter;
  PPNP_ADAPTER PNP_ADAPTER_MANIFEST[] = {
    .
    .
    &MyPnpAdapter
  }
```

> [!IMPORTANT]
> Bridge adapter callbacks are invoked sequentially. An adapter shouldn't block a callback because this prevents the bridge core from making progress.

### Sample camera adapter

The [Camera adapter readme](https://github.com/Azure/iot-plug-and-play-bridge/blob/master/pnpbridge/src/adapters/src/Camera/readme.md) describes a sample camera adapter that you can enable.

## Code examples for common adapter scenarios/callbacks

The following section will provide details on how an adapter for the bridge would implement callbacks for a number of common scenarios and usages This section covers the following callbacks:
- [Receive property update (cloud to device)](#receive-property-update-cloud-to-device)
- [Report a property update (device to cloud)](#report-a-property-update-device-to-cloud)
- [Send telemetry (device to cloud)](#send-telemetry-device-to-cloud)
- [Receive command update callback from the cloud and process it on the device side (cloud to device)](#receive-command-update-callback-from-the-cloud-and-process-it-on-the-device-side-cloud-to-device)
- [Respond to command update on the device side (device to cloud)](#respond-to-command-update-on-the-device-side-device-to-cloud)

The examples below are based on the [environmental sensor sample adapter](https://github.com/Azure/iot-plug-and-play-bridge/tree/master/pnpbridge/src/adapters/samples/environmental_sensor).

### Receive property update (cloud to device)
The first step is to register a callback function:

```c
PnpComponentHandleSetPropertyUpdateCallback(BridgeComponentHandle, EnvironmentSensor_ProcessPropertyUpdate);
```
The next step is to implement the callback function to read the property update on the device:

```c
void EnvironmentSensor_ProcessPropertyUpdate(
    PNPBRIDGE_COMPONENT_HANDLE PnpComponentHandle,
    const char* PropertyName,
    JSON_Value* PropertyValue,
    int version,
    void* userContextCallback
)
{
  // User context for the callback is set to the IoT Hub client handle, and therefore can be type-cast to the client handle type
    SampleEnvironmentalSensor_ProcessPropertyUpdate(userContextCallback, PropertyName, PropertyValue, version, PnpComponentHandle);
}

// SampleEnvironmentalSensor_ProcessPropertyUpdate receives updated properties from the server.  This implementation
// acts as a simple dispatcher to the functions to perform the actual processing.
void SampleEnvironmentalSensor_ProcessPropertyUpdate(
    void * ClientHandle,
    const char* PropertyName,
    JSON_Value* PropertyValue,
    int version,
    PNPBRIDGE_COMPONENT_HANDLE PnpComponentHandle)
{
  if (strcmp(PropertyName, sampleEnvironmentalSensorPropertyBrightness) == 0)
    {
        SampleEnvironmentalSensor_BrightnessCallback(ClientHandle, PropertyName, PropertyValue, version, PnpComponentHandle);
    }
    else
    {
        // If the property is not implemented by this interface, presently we only record a log message but do not have a mechanism to report back to the service
        LogError("Environmental Sensor Adapter:: Property name <%s> is not associated with this interface", PropertyName);
    }
}

// Process a property update for bright level.
static void SampleEnvironmentalSensor_BrightnessCallback(
    void * ClientHandle,
    const char* PropertyName,
    JSON_Value* PropertyValue,
    int version,
    PNPBRIDGE_COMPONENT_HANDLE PnpComponentHandle)
{
    IOTHUB_CLIENT_RESULT iothubClientResult;
    STRING_HANDLE jsonToSend = NULL;
    char targetBrightnessString[32];

    LogInfo("Environmental Sensor Adapter:: Brightness property invoked...");

    PENVIRONMENT_SENSOR EnvironmentalSensor = PnpComponentHandleGetContext(PnpComponentHandle);

    if (json_value_get_type(PropertyValue) != JSONNumber)
    {
        LogError("JSON field %s is not a number", PropertyName);
    }
    else if(EnvironmentalSensor == NULL || EnvironmentalSensor->SensorState == NULL)
    {
        LogError("Environmental sensor device context not initialized correctly.");
    }
    else if (SampleEnvironmentalSensor_ValidateBrightness(json_value_get_number(PropertyValue)))
    {
        EnvironmentalSensor->SensorState->brightness = (int) json_value_get_number(PropertyValue);
        if (snprintf(targetBrightnessString, sizeof(targetBrightnessString), 
            g_environmentalSensorBrightnessResponseFormat, EnvironmentalSensor->SensorState->brightness) < 0)
        {
            LogError("Unable to create target brightness string for reporting result");
        }
        else if ((jsonToSend = PnP_CreateReportedPropertyWithStatus(EnvironmentalSensor->SensorState->componentName,
                    PropertyName, targetBrightnessString, PNP_STATUS_SUCCESS, g_environmentalSensorPropertyResponseDescription,
                    version)) == NULL)
        {
            LogError("Unable to build reported property response");
        }
        else
        {
            const char* jsonToSendStr = STRING_c_str(jsonToSend);
            size_t jsonToSendStrLen = strlen(jsonToSendStr);

            if ((iothubClientResult = SampleEnvironmentalSensor_RouteReportedState(ClientHandle, PnpComponentHandle, (const unsigned char*)jsonToSendStr, jsonToSendStrLen,
                                        SampleEnvironmentalSensor_PropertyCallback,
                                        (void*) &EnvironmentalSensor->SensorState->brightness)) != IOTHUB_CLIENT_OK)
            {
                LogError("Environmental Sensor Adapter:: SampleEnvironmentalSensor_RouteReportedState for brightness failed, error=%d", iothubClientResult);
            }
            else
            {
                LogInfo("Environmental Sensor Adapter:: Successfully queued Property update for Brightness for component=%s", EnvironmentalSensor->SensorState->componentName);
            }

            STRING_delete(jsonToSend);
        }
    }
}

```

### Report a property update (device to cloud)
At any point after your component is created, your device can report properties to the cloud with status: 
```c
// Environmental sensor's read-only property, device state indiciating whether its online or not
//
static const char sampleDeviceStateProperty[] = "state";
static const unsigned char sampleDeviceStateData[] = "true";
static const int sampleDeviceStateDataLen = sizeof(sampleDeviceStateData) - 1;

// Sends a reported property for device state of this simulated device.
IOTHUB_CLIENT_RESULT SampleEnvironmentalSensor_ReportDeviceStateAsync(
    PNPBRIDGE_COMPONENT_HANDLE PnpComponentHandle,
    const char * ComponentName)
{

    IOTHUB_CLIENT_RESULT iothubClientResult = IOTHUB_CLIENT_OK;
    STRING_HANDLE jsonToSend = NULL;

    if ((jsonToSend = PnP_CreateReportedProperty(ComponentName, sampleDeviceStateProperty, (const char*) sampleDeviceStateData)) == NULL)
    {
        LogError("Unable to build reported property response for propertyName=%s, propertyValue=%s", sampleDeviceStateProperty, sampleDeviceStateData);
    }
    else
    {
        const char* jsonToSendStr = STRING_c_str(jsonToSend);
        size_t jsonToSendStrLen = strlen(jsonToSendStr);

        if ((iothubClientResult = SampleEnvironmentalSensor_RouteReportedState(NULL, PnpComponentHandle, (const unsigned char*)jsonToSendStr, jsonToSendStrLen,
            SampleEnvironmentalSensor_PropertyCallback, (void*)sampleDeviceStateProperty)) != IOTHUB_CLIENT_OK)
        {
            LogError("Environmental Sensor Adapter:: Unable to send reported state for property=%s, error=%d",
                                sampleDeviceStateProperty, iothubClientResult);
        }
        else
        {
            LogInfo("Environmental Sensor Adapter:: Sending device information property to IoTHub. propertyName=%s, propertyValue=%s",
                        sampleDeviceStateProperty, sampleDeviceStateData);
        }

        STRING_delete(jsonToSend);
    }

    return iothubClientResult;
}


// Routes the reported property for device or module client. This function can be called either by passing a valid client handle or by passing
// a NULL client handle after components have been started such that the client handle can be extracted from the PnpComponentHandle
IOTHUB_CLIENT_RESULT SampleEnvironmentalSensor_RouteReportedState(
    void * ClientHandle,
    PNPBRIDGE_COMPONENT_HANDLE PnpComponentHandle,
    const unsigned char * ReportedState,
    size_t Size,
    IOTHUB_CLIENT_REPORTED_STATE_CALLBACK ReportedStateCallback,
    void * UserContextCallback)
{
    IOTHUB_CLIENT_RESULT iothubClientResult = IOTHUB_CLIENT_OK;

    PNP_BRIDGE_CLIENT_HANDLE clientHandle = (ClientHandle != NULL) ?
            (PNP_BRIDGE_CLIENT_HANDLE) ClientHandle : PnpComponentHandleGetClientHandle(PnpComponentHandle);

    if ((iothubClientResult = PnpBridgeClient_SendReportedState(clientHandle, ReportedState, Size,
            ReportedStateCallback, UserContextCallback)) != IOTHUB_CLIENT_OK)
    {
        LogError("IoTHub client call to _SendReportedState failed with error code %d", iothubClientResult);
        goto exit;
    }
    else
    {
        LogInfo("IoTHub client call to _SendReportedState succeeded");
    }

exit:
    return iothubClientResult;
}

```

### Send telemetry (device to cloud)
```c
//
// SampleEnvironmentalSensor_SendTelemetryMessagesAsync is periodically invoked by the caller to
// send telemetry containing the current temperature and humidity (in both cases random numbers
// so this sample will work on platforms without these sensors).
//
IOTHUB_CLIENT_RESULT SampleEnvironmentalSensor_SendTelemetryMessagesAsync(
    PNPBRIDGE_COMPONENT_HANDLE PnpComponentHandle)
{
    IOTHUB_CLIENT_RESULT result = IOTHUB_CLIENT_OK;
    IOTHUB_MESSAGE_HANDLE messageHandle = NULL;
    PENVIRONMENT_SENSOR device = PnpComponentHandleGetContext(PnpComponentHandle);

    float currentTemperature = 20.0f + ((float)rand() / RAND_MAX) * 15.0f;
    float currentHumidity = 60.0f + ((float)rand() / RAND_MAX) * 20.0f;

    char currentMessage[128];
    sprintf(currentMessage, "{\"%s\":%.3f, \"%s\":%.3f}", SampleEnvironmentalSensor_TemperatureTelemetry, 
            currentTemperature, SampleEnvironmentalSensor_HumidityTelemetry, currentHumidity);


    if ((messageHandle = PnP_CreateTelemetryMessageHandle(device->SensorState->componentName, currentMessage)) == NULL)
    {
        LogError("Environmental Sensor Adapter:: PnP_CreateTelemetryMessageHandle failed.");
    }
    else if ((result = SampleEnvironmentalSensor_RouteSendEventAsync(PnpComponentHandle, messageHandle,
            SampleEnvironmentalSensor_TelemetryCallback, device)) != IOTHUB_CLIENT_OK)
    {
        LogError("Environmental Sensor Adapter:: SampleEnvironmentalSensor_RouteSendEventAsync failed, error=%d", result);
    }

    IoTHubMessage_Destroy(messageHandle);

    return result;
}

// Routes the sending asynchronous events for device or module client
IOTHUB_CLIENT_RESULT SampleEnvironmentalSensor_RouteSendEventAsync(
        PNPBRIDGE_COMPONENT_HANDLE PnpComponentHandle,
        IOTHUB_MESSAGE_HANDLE EventMessageHandle,
        IOTHUB_CLIENT_EVENT_CONFIRMATION_CALLBACK EventConfirmationCallback,
        void * UserContextCallback)
{
    IOTHUB_CLIENT_RESULT iothubClientResult = IOTHUB_CLIENT_OK;
    PNP_BRIDGE_CLIENT_HANDLE clientHandle = PnpComponentHandleGetClientHandle(PnpComponentHandle);
    if ((iothubClientResult = PnpBridgeClient_SendEventAsync(clientHandle, EventMessageHandle,
            EventConfirmationCallback, UserContextCallback)) != IOTHUB_CLIENT_OK)
    {
        LogError("IoTHub client call to _SendEventAsync failed with error code %d", iothubClientResult);
        goto exit;
    }
    else
    {
        LogInfo("IoTHub client call to _SendEventAsync succeeded");
    }

exit:
    return iothubClientResult;
}

```
### Receive command update callback from the cloud and process it on the device side (cloud to device)
```c
// SampleEnvironmentalSensor_ProcessCommandUpdate receives commands from the server.  This implementation acts as a simple dispatcher
// to the functions to perform the actual processing.
int SampleEnvironmentalSensor_ProcessCommandUpdate(
    PENVIRONMENT_SENSOR EnvironmentalSensor,
    const char* CommandName,
    JSON_Value* CommandValue,
    unsigned char** CommandResponse,
    size_t* CommandResponseSize)
{
    if (strcmp(CommandName, sampleEnvironmentalSensorCommandBlink) == 0)
    {
        return SampleEnvironmentalSensor_BlinkCallback(EnvironmentalSensor, CommandValue, CommandResponse, CommandResponseSize);
    }
    else if (strcmp(CommandName, sampleEnvironmentalSensorCommandTurnOn) == 0)
    {
        return SampleEnvironmentalSensor_TurnOnLightCallback(EnvironmentalSensor, CommandValue, CommandResponse, CommandResponseSize);
    }
    else if (strcmp(CommandName, sampleEnvironmentalSensorCommandTurnOff) == 0)
    {
        return SampleEnvironmentalSensor_TurnOffLightCallback(EnvironmentalSensor, CommandValue, CommandResponse, CommandResponseSize);
    }
    else
    {
        // If the command is not implemented by this interface, by convention we return a 404 error to server.
        LogError("Environmental Sensor Adapter:: Command name <%s> is not associated with this interface", CommandName);
        return SampleEnvironmentalSensor_SetCommandResponse(CommandResponse, CommandResponseSize, sampleEnviromentalSensor_NotImplemented);
    }
}

// Implement the callback to process the command "blink". Information pertaining to the request is
// specified in the CommandValue parameter, and the callback fills out data it wishes to
// return to the caller on the service in CommandResponse.

static int SampleEnvironmentalSensor_BlinkCallback(
    PENVIRONMENT_SENSOR EnvironmentalSensor,
    JSON_Value* CommandValue,
    unsigned char** CommandResponse,
    size_t* CommandResponseSize)
{
    int result = PNP_STATUS_SUCCESS;
    int BlinkInterval = 0;

    LogInfo("Environmental Sensor Adapter:: Blink command invoked. It has been invoked %d times previously", EnvironmentalSensor->SensorState->numTimesBlinkCommandCalled);

    if (json_value_get_type(CommandValue) != JSONNumber)
    {
        LogError("Cannot retrieve blink interval for blink command");
        result = PNP_STATUS_BAD_FORMAT;
    }
    else
    {
        BlinkInterval = (int)json_value_get_number(CommandValue);
        LogInfo("Environmental Sensor Adapter:: Blinking with interval=%d second(s)", BlinkInterval);
        EnvironmentalSensor->SensorState->numTimesBlinkCommandCalled++;
        EnvironmentalSensor->SensorState->blinkInterval = BlinkInterval;

        result = SampleEnvironmentalSensor_SetCommandResponse(CommandResponse, CommandResponseSize, sampleEnviromentalSensor_BlinkResponse);
    }

    return result;
}

```
### Respond to command update on the device side (device to cloud)

```c
	static int SampleEnvironmentalSensor_BlinkCallback(
	    PENVIRONMENT_SENSOR EnvironmentalSensor,
	    JSON_Value* CommandValue,
	    unsigned char** CommandResponse,
	    size_t* CommandResponseSize)
	{
	    int result = PNP_STATUS_SUCCESS;
	    int BlinkInterval = 0;
	
	    LogInfo("Environmental Sensor Adapter:: Blink command invoked. It has been invoked %d times previously", EnvironmentalSensor->SensorState->numTimesBlinkCommandCalled);
	
	    if (json_value_get_type(CommandValue) != JSONNumber)
	    {
	        LogError("Cannot retrieve blink interval for blink command");
	        result = PNP_STATUS_BAD_FORMAT;
	    }
	    else
	    {
	        BlinkInterval = (int)json_value_get_number(CommandValue);
	        LogInfo("Environmental Sensor Adapter:: Blinking with interval=%d second(s)", BlinkInterval);
	        EnvironmentalSensor->SensorState->numTimesBlinkCommandCalled++;
	        EnvironmentalSensor->SensorState->blinkInterval = BlinkInterval;
	
	        result = SampleEnvironmentalSensor_SetCommandResponse(CommandResponse, CommandResponseSize, sampleEnviromentalSensor_BlinkResponse);
	    }
	
	    return result;
	}
	
	// SampleEnvironmentalSensor_SetCommandResponse is a helper that fills out a command response
	static int SampleEnvironmentalSensor_SetCommandResponse(
	    unsigned char** CommandResponse,
	    size_t* CommandResponseSize,
	    const unsigned char* ResponseData)
	{
	    int result = PNP_STATUS_SUCCESS;
	    if (ResponseData == NULL)
	    {
	        LogError("Environmental Sensor Adapter:: Response Data is empty");
	        *CommandResponseSize = 0;
	        return PNP_STATUS_INTERNAL_ERROR;
	    }
	
	    *CommandResponseSize = strlen((char*)ResponseData);
	    memset(CommandResponse, 0, sizeof(*CommandResponse));
	
	    // Allocate a copy of the response data to return to the invoker. Caller will free this.
	    if (mallocAndStrcpy_s((char**)CommandResponse, (char*)ResponseData) != 0)
	    {
	        LogError("Environmental Sensor Adapter:: Unable to allocate response data");
	        result = PNP_STATUS_INTERNAL_ERROR;
	    }
	
	    return result;
}
```

## Next steps

To learn more about the IoT Plug and Play bridge, visit the [IoT Plug and Play bridge](https://github.com/Azure/iot-plug-and-play-bridge) GitHub repository.

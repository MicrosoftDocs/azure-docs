---
title: Developer guide - IoT Plug and Play | Microsoft Docs
description: Description of IoT Plug and Play for developers
author: rido-min
ms.author: rmpablos
ms.date: 07/16/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# IoT Plug and Play developer guide

IoT Plug and Play lets you build smart devices that advertise their capabilities to Azure IoT applications. IoT Plug and Play devices don't require manual configuration when a customer connects them to IoT Plug and Play-enabled applications.

A smart device might be implemented directly, use [modules](../iot-hub/iot-hub-devguide-module-twins.md), or use [IoT Edge modules](../iot-edge/about-iot-edge.md).

This guide describes the basic steps required to create a device, module, or IoT Edge module that follows the [IoT Plug and Play conventions](concepts-convention.md), and the available REST APIs you can use to interact with the device.

To build an IoT Plug and Play device, module, or IoT Edge module, follow these steps:

1. Ensure your device is using either the MQTT or MQTT over WebSockets protocol to connect to Azure IoT Hub.
1. Create a [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl) model to describe your device. To learn more, see [Understand components in IoT Plug and Play models](concepts-components.md).
1. Update your device or module to announce the `model-id` as part of the device connection.
1. Implement telemetry, properties, and commands using the [IoT Plug and Play conventions](concepts-convention.md)

Once your device or module implementation is ready, use the [Azure IoT explorer](howto-use-iot-explorer.md) to validate that the device follows the IoT Plug and Play conventions.

> [!Tip]
> All code fragments in this article use C#, but the concepts are applicable to any of the available SDKs for C, Python, Node, and Java.

## Model ID announcement

To announce the model ID, the device must include it in the connection information:

```csharp
DeviceClient.CreateFromConnectionString(
  connectionString,
  TransportType.Mqtt,
  new ClientOptions() { ModelId = modelId })
```

The new `ClientOptions` overload is available in all `DeviceClient` methods used to initialize a connection.

> [!TIP]
> For modules and IoT Edge, use `ModuleClient` in place of `DeviceClient`.

The model ID announcement has been added to the next versions of the SDKs

|SDK|Version|
|---|-------|
|C-SDK|1.3.9|
|.NET|1.27.0|
|Java|1.14.0|
|Node|1.17.0|
|Python|2.1.4|

## DPS payload

Devices using the [Device Provisioning Service (DPS)](../iot-dps/about-iot-dps.md) can include the `modelId` to be used during the provisioning process using the following JSON payload.

```json
{
    "modelId" : "dtmi:com:example:Thermostat;1"
}
```

## Implement telemetry, properties, and commands

As described in [Understand components in IoT Plug and Play models](concepts-components.md), device builders must decide if they want to use components to describe their devices. When using components, devices must follow the rules described in this section.

### Telemetry

Models without components don't require any special property.

When using components, devices must set a message property with the component name:

```c#
public async Task SendComponentTelemetryValueAsync(string componentName, string serializedTelemetry)
{
  var message = new Message(Encoding.UTF8.GetBytes(serializedTelemetry));
  message.Properties.Add("$.sub", componentName);
  message.ContentType = "application/json";
  message.ContentEncoding = "utf-8";
  await client.SendEventAsync(message);
}
```

### Read-only properties

Models without components don't require any special construct:

```csharp
TwinCollection reportedProperties = new TwinCollection();
reportedProperties["maxTemperature"] = 38.7;
await client.UpdateReportedPropertiesAsync(reportedProperties);
```

The device twin is updated with the next reported property:

```json
{
  "reported": {
      "maxTemperature" : 38.7
  }
}
```

When using components, properties must be created within the component name:

```csharp
TwinCollection reportedProperties = new TwinCollection();
TwinCollection component = new TwinCollection();
component["maxTemperature"] = 38.7;
component["__t"] = "c"; // marker to identify a component
reportedProperties["thermostat1"] = component;
await client.UpdateReportedPropertiesAsync(reportedProperties);
```

The device twin is updated with the next reported property:

```json
{
  "reported": {
    "thermostat1" : {  
      "__t" : "c",  
      "maxTemperature" : 38.7
     } 
  }
}
```

### Writable properties

These properties can be set by the device or updated by the solution. If the solution updates a property, the client receives a notification as a callback in the `DeviceClient` or `ModuleClient`. To follow the IoT Plug and Play conventions, the device must inform the service that the property was successfully received.

#### Report a writable property

When a device reports a writable property, it must include the `ack` values defined in the conventions.

To report a writable property without components:

```csharp
TwinCollection reportedProperties = new TwinCollection();
TwinCollection ackProps = new TwinCollection();
ackProps["value"] = 23.2;
ackProps["ac"] = 200; // using HTTP status codes
ackProps["av"] = 0; // not readed from a desired property
ackProps["ad"] = "reported default value";
reportedProperties["targetTemperature"] = ackProps;
await client.UpdateReportedPropertiesAsync(reportedProperties);
```

The device twin is updated with the next reported property:

```json
{
  "reported": {
      "targetTemperature": {
          "value": 23.2,
          "ac": 200,
          "av": 3,
          "ad": "complete"
      }
  }
}
```

To report a writable property from a component, the twin must include a marker:

```csharp
TwinCollection reportedProperties = new TwinCollection();
TwinCollection component = new TwinCollection();
TwinCollection ackProps = new TwinCollection();
component["__t"] = "c"; // marker to identify a component
ackProps["value"] = 23.2;
ackProps["ac"] = 200; // using HTTP status codes
ackProps["av"] = 0; // not read from a desired property
ackProps["ad"] = "reported default value";
component["targetTemperature"] = ackProps;
reportedProperties["thermostat1"] = component;
await client.UpdateReportedPropertiesAsync(reportedProperties);
```

The device twin is updated with the next reported property:

```json
{
  "reported": {
    "thermostat1": {
      "__t" : "c",
      "targetTemperature": {
          "value": 23.2,
          "ac": 200,
          "av": 3,
          "ad": "complete"
      }
    }
  }
}
```

#### Subscribe to desired property updates

Services can update desired properties that trigger a notification on the connected devices. This notification includes the updated desired properties, including the version number identifying the update. Devices must respond with the same `ack` message as reported properties.

Models without components see the single property and create the reported `ack` with the received version:

```csharp
await client.SetDesiredPropertyUpdateCallbackAsync(async (desired, ctx) => 
{
  JValue targetTempJson = desired["targetTemperature"];
  double targetTemperature = targetTempJson.Value<double>();

  TwinCollection reportedProperties = new TwinCollection();
  TwinCollection ackProps = new TwinCollection();
  ackProps["value"] = targetTemperature;
  ackProps["ac"] = 200;
  ackProps["av"] = desired.Version; 
  ackProps["ad"] = "desired property received";
  reportedProperties["targetTemperature"] = ackProps;

  await client.UpdateReportedPropertiesAsync(reportedProperties);
}, null);
```

The device twin shows the property in the desired and reported sections:

```json
{
  "desired" : {
    "targetTemperature": 23.2,
    "$version" : 3
  },
  "reported": {
      "targetTemperature": {
          "value": 23.2,
          "ac": 200,
          "av": 3,
          "ad": "complete"
      }
  }
}
```

Models with components receive the desired properties wrapped with the component name, and should report back the `ack` reported property:

```csharp
await client.SetDesiredPropertyUpdateCallbackAsync(async (desired, ctx) =>
{
  JObject thermostatComponent = desired["thermostat1"];
  JToken targetTempProp = thermostatComponent["targetTemperature"];
  double targetTemperature = targetTempProp.Value<double>();

  TwinCollection reportedProperties = new TwinCollection();
  TwinCollection component = new TwinCollection();
  TwinCollection ackProps = new TwinCollection();
  component["__t"] = "c"; // marker to identify a component
  ackProps["value"] = targetTemperature;
  ackProps["ac"] = 200; // using HTTP status codes
  ackProps["av"] = desired.Version; // not readed from a desired property
  ackProps["ad"] = "desired property received";
  component["targetTemperature"] = ackProps;
  reportedProperties["thermostat1"] = component;

  await client.UpdateReportedPropertiesAsync(reportedProperties);
}, null);
```

The device twin for components shows the desired and reported sections as follows:

```json
{
  "desired" : {
    "thermostat1" : {
        "__t" : "c",
        "targetTemperature": 23.2,
    }
    "$version" : 3
  },
  "reported": {
    "thermostat1" : {
        "__t" : "c",
      "targetTemperature": {
          "value": 23.2,
          "ac": 200,
          "av": 3,
          "ad": "complete"
      }
    }
  }
}
```

### Commands

Models without components receive the command name as it was invoked by the service.

Models with components will receive the command name prefixed with the component and the `*` separator.

```csharp
await client.SetMethodHandlerAsync("themostat*reboot", (MethodRequest req, object ctx) =>
{
  Console.WriteLine("REBOOT");
  return Task.FromResult(new MethodResponse(200));
},
null);
```

#### Request and response payloads

Commands use types to define their request and response payloads. A device must deserialize the incoming input parameter and serialize the response. 
The following example shows how to implement a command with complex types defined in the payloads:

```json
{
  "@type": "Command",
  "name": "start",
  "request": {
    "name": "startRequest",
    "schema": {
      "@type": "Object",
      "fields": [
        {
          "name": "startPriority",
          "schema": "integer"
        },
        {
          "name": "startMessage",
          "schema" : "string"
        }
      ]
    }
  },
  "response": {
    "name": "startReponse",
    "schema": {
      "@type": "Object",
      "fields": [
        {
            "name": "startupTime",
            "schema": "integer" 
        },
        {
          "name": "startupMessage",
          "schema": "string"
        }
      ]
    }
  }
}
```

The following code snippets show how a device implements this command definition, including the types used to enable serialization and deserialization:

```csharp
class startRequest
{
  public int startPriority { get; set; }
  public string startMessage { get; set; }
}

class startResponse
{
  public int startupTime { get; set; }
  public string startupMessage { get; set; }
}

// ... 

await client.SetMethodHandlerAsync("start", (MethodRequest req, object ctx) =>
{
  var startRequest = JsonConvert.DeserializeObject<startRequest>(req.DataAsJson);
  Console.WriteLine($"Received start command with priority ${startRequest.startPriority} and ${startRequest.startMessage}");

  var startResponse = new startResponse
  {
    startupTime = 123,
    startupMessage = "device started with message " + startRequest.startMessage
  };

  string responsePayload = JsonConvert.SerializeObject(startResponse);
  MethodResponse response = new MethodResponse(Encoding.UTF8.GetBytes(responsePayload), 200);
  return Task.FromResult(response);
},null);
```

> [!Tip]
> The request and response names aren't present in the serialized payloads transmitted over the wire.

## Interact with the device

IoT Plug and Play lets you use devices that have announced their model ID with your IoT hub. For example, you can access the properties and commands of a device directly.

To use an IoT Plug and Play device that's connected to your IoT hub, use either one of the IoT service SDKs or the IoT Hub REST API:

### Service SDKs

Use the Azure IoT Service SDKs in your solution to interact with devices and modules. For example, you can use the service SDKs to read and update twin properties and invoke commands. Supported languages include C#, Java, Node.js, and Python.

The service SDKs let you access device information from a solution, such as a desktop or web application. The service SDKs include two namespaces and object models that you can use to retrieve the model ID:

- Iot Hub service client.
- Digital Twins service client.

| Language | IoT Hub service client | Digital Twins service client |
| -------- | ---------------------- | ---------------------------- |
| C#       | [Documentation](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.shared.twin.modelid?view=azure-dotnet-preview#Microsoft_Azure_Devices_Shared_Twin_ModelId&preserve-view=true) <br/> [Sample](https://github.com/Azure/azure-iot-sdk-csharp/blob/pnp-preview-refresh/iothub/service/samples/PnpServiceSamples/Thermostat/Program.cs)| [Sample](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/feature/digitaltwin/iot-hub/Samples/service/DigitalTwinClientSamples) |
| Java     | [Documentation](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.service.devicetwin.devicetwindevice?view=azure-java-stable&preserve-view=true) <br/> [Sample](https://github.com/Azure/azure-iot-sdk-java/blob/pnp-preview-refresh/service/iot-service-samples/pnp-service-sample/thermostat-service-sample/src/main/java/samples/com/microsoft/azure/sdk/iot/service/Thermostat.java)| [Sample](https://github.com/Azure/azure-iot-sdk-java/tree/feature/digitaltwin/service/iot-service-samples/digitaltwin-service-samples) |
| Node.js  | [Documentation](https://docs.microsoft.com/javascript/api/azure-iothub/twin?view=azure-node-latest&preserve-view=true) <br/> [Sample](https://github.com/Azure/azure-iot-sdk-node/blob/master/service/samples/javascript/twin.js)| [Documentation](https://docs.microsoft.com/javascript/api/azure-iot-digitaltwins-service/?view=azure-node-latest&preserve-view=true) |
| Python   | [Documentation](https://docs.microsoft.com/python/api/azure-iot-hub/azure.iot.hub.iothubdigitaltwinmanager?view=azure-python-preview&preserve-view=true) <br/> [Sample](https://github.com/Azure/azure-iot-sdk-python/blob/pnp-preview-refresh/azure-iot-hub/samples/iothub_registry_manager_method_sample.py)| [Documentation](https://docs.microsoft.com/javascript/api/azure-iot-digitaltwins-service/?view=azure-node-latest&preserve-view=true) |

### REST API

The following examples use the IoT Hub REST API to interact with a connected IoT Plug and Play device. The current version of the API is `2020-09-30`. Append `?api-version=2020-05-31` to your REST PI calls.

> [!NOTE]
> Module twins are not currently supported by the `digitalTwins` API.

If your thermostat device is called `t-123`, you get the all the properties on all the interfaces implemented by your device with a REST API GET call:

```REST
GET /digitalTwins/t-123
```

This call will include the Json property `$metadata.$model` with the model ID announced by the device.

All properties on all interfaces are accessed with the `GET /DigitalTwin/{device-id}` REST API template where `{device-id}` is the identifier for the device:

```REST
GET /digitalTwins/{device-id}
```

You can call IoT Plug and Play device commands directly. If the `Thermostat` component in the `t-123` device has a `restart` command, you can call it with a REST API POST call:

```REST
POST /digitalTwins/t-123/components/Thermostat/commands/restart
```

More generally, commands can be called through this REST API template:

- `device-id`: the identifier for the device.
- `component-name`: the name of the interface from the implements section in the device capability model.
- `command-name`: the name of the command.

```REST
/digitalTwins/{device-id}/components/{component-name}/commands/{command-name}
```

## Next steps

Now that you've learned about device modeling, here are some additional resources:

- [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl)
- [C device SDK](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/)
- [IoT REST API](https://docs.microsoft.com/rest/api/iothub/device)
- [Model components](./concepts-components.md)
- [Install and use the DTDL authoring tools](howto-use-dtdl-authoring-tools.md)

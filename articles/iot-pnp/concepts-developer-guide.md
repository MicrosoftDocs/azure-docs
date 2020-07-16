---
title: Developer guide - IoT Plug and Play Preview | Microsoft Docs
description: Description of IoT Plug and Play for developers
author: rido-min
ms.author: rmpablos
ms.date: 07/16/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# IoT Plug and Play Preview developer guide

IoT Plug and Play Preview lets you build devices that advertise their capabilities to Azure IoT applications. IoT Plug and Play devices don't require manual configuration when a customer connects them to IoT Plug and Play-enabled applications.

This guide describes the basic steps required to create a device that follows the [IoT Plug and Play Convention](concepts-convention.md), and the available REST apis to interact with the device.

To build an IoT Plug and Play device, you must follow the next steps:

1. Ensure your device is using MQTT or MQTT over web sockets as the protocol to connect to Azure IoT Hub.
1. Create your DTDL model to describe your device. Modeling is explained in more detail in [Understand components in Azure IoT Plug and Play models](concepts-components.md).
1. Update your device to _announce_ the `model-id` as part of the device connection.
1. Implement Telemetry, Properties and commands using the [IoT Plug and Play Convention](concepts-convention.md)

Once your device implementation is ready, you can validate if it's _PnP conformant_ by  using the [Azure IoT Explorer](howto-use-iot-explorer.md).

>[!Tip]
>Note. All code fragments in this article use C# but the concepts are applicable to any of the avialble SDKs for C, Python, Node and Java.

## Model Id announcement

To announce the Model Id the device must include the model id with the connection information

```csharp
DeviceClient.CreateFromConnectionString(
  connectionString,
  TransportType.Mqtt,
  new ClientOptions() { ModelId = modelId })
```

The new `ClientOptions` overload is available in all `DeviceClient` methods used to initialize the connection.

The model id announcement has been added to the next versions of the SDKs

|SDK|Version|
|---|-------|
|C-SDK|1.3.9|
|.NET|1.27.0|
|Java|1.14.0|
|Node|1.17.0|
|Python|2.1.4|

## Implement Telemetry, Property and Commands

As described in [Understand components in Azure IoT Plug and Play models](concepts-components.md), device developers must decide if they want to use components to describe their devices. When using components devices must follow the rules described in this section.

### Telemetry

Models without components don't require any special property.

When using components devices must set a message property with the component name

```c#
public async Task SendComponentTelemetryValueAsync(string componentName, string serializedTelemetry)
{
  var message = new Message(Encoding.UTF8.GetBytes(serializedTelemetry));
  message.Properties.Add("$.sub", componentName);
  message.ContentType = "application/json";
  message.ContentEncoding = "utf-8";
  await deviceClient.SendEventAsync(message);
}
```

### Read-only Properties

Models without components don't require any special construct.

```csharp
TwinCollection reportedProperties = new TwinCollection();
reportedProperties["maxTemperature"] = 38.7;
await client.UpdateReportedPropertiesAsync(reportedProperties);
```

The device twin will be updated with the next reported property:

```json
{
  "reported": {
      "maxTemperature" : 38.7
  }
}
```

When using components, properties must be created within the component name.

```csharp
TwinCollection reportedProperties = new TwinCollection();
TwinCollection component = new TwinCollection();
component["maxTemperature"] = 38.7;
component["__t"] = "c"; // marker to identify a component
reportedProperties["thermostat1"] = component;
await client.UpdateReportedPropertiesAsync(reportedProperties);
```

The device twin will be updated with the next reported property:

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

These properties can be set by reported by the device and/or updated by the solution, in that case the client will receive a notification as a callback in the `DeviceClient`, to be comformant with the convention the device must inform the service that the property was successfully received.

#### Report a writable property
When a device reports a writable property it must include the _ack_ values defined in the convention.

To report a  writable property without components:

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

The device twin will be updated with the next reported property:

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

To report a writable property from a component, the twin must include the same marker as with read-only properties:

```csharp
TwinCollection reportedProperties = new TwinCollection();
TwinCollection component = new TwinCollection();
TwinCollection ackProps = new TwinCollection();
component["__t"] = "c"; // marker to identify a component
ackProps["value"] = 23.2;
ackProps["ac"] = 200; // using HTTP status codes
ackProps["av"] = 0; // not readed from a desired property
ackProps["ad"] = "reported default value";
component["targetTemperature"] = ackProps;
reportedProperties["thermostat1"] = component;
await client.UpdateReportedPropertiesAsync(reportedProperties);
```

The device twin will be updated with the next reported property:

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

Services can update desired properties that will trigger a notification on the connected devices. This notification will include the updated desired properties, including the version number identifying the update. Devices must respond with the same _ack_ message in reported properties.

Models without components will see the single property and will create the reportes _ack_ with the received version.

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

The device twin will show the property in the desired and reported sections.

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

Models with components will receive the desired properties wrapped with the component name, and should report back the _ack_ reported property:

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

The device twin for components will show the desired and reported sections as follows:

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

Models without components will receive the command name as it was invoked by the service.

Models with components will receive the command name prefixed with the component and the `*` separator.


```csharp
await client.SetMethodHandlerAsync("themostat*reboot", (MethodRequest req, object ctx) =>
{
  Console.WriteLine("REBOOT");
  return Task.FromResult(new MethodResponse(200));
},
null);
```

## Interact with the device 

IoT Plug and Play lets you use devices that have announced their model ID with your IoT hub. For example, you can access the properties and commands of a device directly.

To use an IoT Plug and Play device that's connected to your IoT hub, use either the IoT Hub REST API or one of the IoT language SDKs. The following examples use the IoT Hub REST API. The current version of the API is `2020-05-31-preview`. Append `?api-version=2020-05-31` to your REST PI calls.

If your thermostat device is called `t-123`, you get the all the properties on all the interfaces implemented by your device with a REST API GET call:

```REST
GET /digitalTwins/t-123
```

This call will include the Json property `$metadata.$model` with the model Id announced by the device.

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

- [Digital Twins Definition Language (DTDL)](https://aka.ms/DTDL)
- [C device SDK](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/)
- [IoT REST API](https://docs.microsoft.com/rest/api/iothub/device)
- [Model components](./concepts-components.md)

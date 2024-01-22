---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 11/17/2022
---

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

> [!TIP]
> This is the only time a device can set model ID, it can't be updated after the device connects.

## DPS payload

Devices using the [Device Provisioning Service (DPS)](../articles/iot-dps/about-iot-dps.md) can include the `modelId` to be used during the provisioning process by using the following JSON payload:

```json
{
    "modelId" : "dtmi:com:example:Thermostat;1"
}
```

## Use components

As described in [Understand components in IoT Plug and Play models](../articles/iot-develop/concepts-modeling-guide.md), you must decide if you want to use components to describe your devices. When you use components, devices must follow the rules described in the following sections.

## Telemetry

A default component doesn't require any special property added to the telemetry message.

When you use nested components, devices must set a message property with the component name:

```c#
public async Task SendComponentTelemetryValueAsync(string componentName, string serializedTelemetry)
{
  var message = new Message(Encoding.UTF8.GetBytes(serializedTelemetry));
  message.ComponentName = componentName;
  message.ContentType = "application/json";
  message.ContentEncoding = "utf-8";
  await client.SendEventAsync(message);
}
```

## Read-only properties

Reporting a property from the default component doesn't require any special construct:

```csharp
TwinCollection reportedProperties = new TwinCollection();
reportedProperties["maxTemperature"] = 38.7;
await client.UpdateReportedPropertiesAsync(reportedProperties);
```

The device twin is updated with the following reported property:

```json
{
  "reported": {
      "maxTemperature" : 38.7
  }
}
```

When you use nested components, create properties within the component name and include a marker:

```csharp
TwinCollection reportedProperties = new TwinCollection();
TwinCollection component = new TwinCollection();
component["maxTemperature"] = 38.7;
component["__t"] = "c"; // marker to identify a component
reportedProperties["thermostat1"] = component;
await client.UpdateReportedPropertiesAsync(reportedProperties);
```

The device twin is updated with the following reported property:

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

## Writable properties

These properties can be set by the device or updated by the back-end application. If the back-end application updates a property, the client receives a notification as a callback in the `DeviceClient` or `ModuleClient`. To follow the IoT Plug and Play conventions, the device must inform the service that the property was successfully received.

If the property type is `Object`, the service must send a complete object to the device even if it's only updating a subset of the object's fields. The acknowledgment the device sends must also be a complete object.

### Report a writable property

When a device reports a writable property, it must include the `ack` values defined in the conventions.

To report a writable property from the default component:

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

The device twin is updated with the following reported property:

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

To report a writable property from a nested component, the twin must include a marker:

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

The device twin is updated with the following reported property:

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

### Subscribe to desired property updates

Services can update desired properties that trigger a notification on the connected devices. This notification includes the updated desired properties, including the version number identifying the update. Devices must include this version number in the  `ack` message sent back to the service.

A default component sees the single property and creates the reported `ack` with the received version:

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

The device twin for a nested component shows the desired and reported sections as follows:

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

A nested component receives the desired properties wrapped with the component name, and should report back the `ack` reported property:

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

The device twin for a nested component shows the desired and reported sections as follows:

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

## Commands

A default component receives the command name as it was invoked by the service.

A nested component receives the command name prefixed with the component name and the `*` separator.

```csharp
await client.SetMethodHandlerAsync("themostat*reboot", (MethodRequest req, object ctx) =>
{
  Console.WriteLine("REBOOT");
  return Task.FromResult(new MethodResponse(200));
},
null);
```

### Request and response payloads

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

> [!TIP]
> The request and response names aren't present in the serialized payloads transmitted over the wire.

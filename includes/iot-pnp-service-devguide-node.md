---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 11/17/2022
---

The following resources are also available:

- [Node.js SDK reference documentation](/javascript/api/azure-iothub)
- [Service client samples](https://github.com/Azure/azure-iot-hub-node/blob/main/samples/twin.js)
- [Digital Twins samples](https://github.com/Azure/azure-iot-hub-node/blob/main/samples/get_digital_twin.js)

## IoT Hub service client examples

This section shows JavaScript examples using the IoT Hub service client and the **Registry** and **Client** classes. You use the **Registry** class to interact with the device state using device twins. You can also use the **Registry** class to [query device registrations](../articles/iot-hub/iot-hub-devguide-query-language.md) in your IoT Hub. You use the **Client** class to call commands on the device. The [DTDL](../articles/iot-develop/concepts-digital-twin.md) model for the device defines the properties and commands the device implements. In the code snippets, the `deviceId` variable holds the device ID of the IoT Plug and Play device registered with your IoT hub.

### Get the device twin and model ID

To get the device twin and model ID of the IoT Plug and Play device that connected to your IoT hub:

```javascript
var Registry = require('azure-iothub').Registry;

// ...

var registry = Registry.fromConnectionString(connectionString);
registry.getTwin(deviceId, function(err, twin) {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Model Id: ' + twin.modelId);
    console.log(JSON.stringify(twin, null, 2));
  }
}
```

### Update device twin

The following code snippet shows how to update the `targetTemperature` property on a device. The sample shows how you need to get the twin before you update it. The property is defined in the default component of the device:

```javascript
var Registry = require('azure-iothub').Registry;
var registry = Registry.fromConnectionString(connectionString);

registry.getTwin(deviceId, function(err, twin) {
  if (err) {
    console.error(err.message);
  } else {
    var twinPatch = {
      properties: {
        desired: {
          targetTemperature: 42
        }
      }
    };
    twin.update(twinPatch, function(err, twin) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(JSON.stringify(twin, null, 2));
      }
    }
  }
}
```

The following snippet shows how to update the `targetTemperature` property on a component. The sample shows how you need to get the twin before you update it. The property is defined in the **thermostat1** component:

```javascript
var Registry = require('azure-iothub').Registry;
var registry = Registry.fromConnectionString(connectionString);

registry.getTwin(deviceId, function(err, twin) {
  if (err) {
    console.error(err.message);
  } else {
    var twinPatch = {
      properties: {
        desired: {
          thermostat1:
          {
            __t: "c",
            targetTemperature: 45
          }
        }
      }
    };
    twin.update(twinPatch, function(err, twin) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(JSON.stringify(twin, null, 2));
      }
    }
  }
}
```

For a property in a component, the property patch looks like the following example:

```json
{
  "thermostat1":
  {
    "__t": "c",
    "targetTemperature": 20
  }
}
```

### Call command

The following snippet shows how to invoke the `getMaxMinReport` command defined in a default component:

```javascript
var Client = require('azure-iothub').Client;

// ...

var client = Client.fromConnectionString(connectionString);

var methodParams = {
  methodName: "getMaxMinReport",
  payload: new Date().getMinutes -2,
  responseTimeoutInSeconds: 15
};

client.invokeDeviceMethod(deviceId, methodParams, function (err, result) {
  if (err) {
    console.error('Failed to invoke method \'' + methodParams.methodName + '\': ' + err.message);
  } else {
    console.log(methodParams.methodName + ' on ' + deviceId + ':');
    console.log(JSON.stringify(result, null, 2));
  }
});
```

The following snippet shows how to call the `getMaxMinReport` command on a component. The command is defined in the **thermostat1** component:

```javascript
var Client = require('azure-iothub').Client;

// ...

var client = Client.fromConnectionString(connectionString);

var methodParams = {
  methodName: "thermostat1*getMaxMinReport",
  payload: new Date().getMinutes -2,
  responseTimeoutInSeconds: 15
};

client.invokeDeviceMethod(deviceId, methodParams, function (err, result) {
  if (err) {
    console.error('Failed to invoke method \'' + methodParams.methodName + '\': ' + err.message);
  } else {
    console.log(methodParams.methodName + ' on ' + deviceId + ':');
    console.log(JSON.stringify(result, null, 2));
  }
});
```

## IoT Hub digital twin examples

You use the **DigitalTwinClient** class to interact with the device state using digital twins. The [DTDL](../articles/iot-develop/concepts-digital-twin.md) model for the device defines the properties and commands the device implements.

This section shows JavaScript examples using the Digital Twins API.

The `digitalTwinId` variable holds the device ID of the IoT Plug and Play device registered with your IoT hub.

### Get the digital twin and model ID

To get the digital twin and model ID of the IoT Plug and Play device that connected to your IoT hub:

```javascript
const IoTHubTokenCredentials = require('azure-iothub').IoTHubTokenCredentials;
const DigitalTwinClient = require('azure-iothub').DigitalTwinClient;
const { inspect } = require('util');

// ...

const credentials = new IoTHubTokenCredentials(connectionString);
const digitalTwinClient = new DigitalTwinClient(credentials);

const digitalTwin = await digitalTwinClient.getDigitalTwin(digitalTwinId);

console.log(inspect(digitalTwin));
console.log('Model Id: ' + inspect(digitalTwin.$metadata.$model));
```

### Update digital twin

The following code snippet shows how to update the `targetTemperature` property on a device. The property is defined in the default component of the device:

```javascript
const IoTHubTokenCredentials = require('azure-iothub').IoTHubTokenCredentials;
const DigitalTwinClient = require('azure-iothub').DigitalTwinClient;

// ...

const credentials = new IoTHubTokenCredentials(connString);
const digitalTwinClient = new DigitalTwinClient(credentials);

const patch = [{
  op: 'add',
  path: '/targetTemperature',
  value: 42
}];
await digitalTwinClient.updateDigitalTwin(digitalTwinId, patch);
```

The following snippet shows how to update the `targetTemperature` property on a component. The property is defined in the **thermostat1** component:

```javascript
const IoTHubTokenCredentials = require('azure-iothub').IoTHubTokenCredentials;
const DigitalTwinClient = require('azure-iothub').DigitalTwinClient;

// ...

const credentials = new IoTHubTokenCredentials(connString);
const digitalTwinClient = new DigitalTwinClient(credentials);

const patch = [{
  op: 'add',
  path: '/thermostat1/targetTemperature',
  value: 42
}];
await digitalTwinClient.updateDigitalTwin(digitalTwinId, patch);
```

### Call command

The following snippet shows how to invoke the `getMaxMinReport` command defined in a default component:

```javascript
const IoTHubTokenCredentials = require('azure-iothub').IoTHubTokenCredentials;
const DigitalTwinClient = require('azure-iothub').DigitalTwinClient;
const { inspect } = require('util');

// ...

const commandPayload = new Date().getMinutes -2;

const credentials = new IoTHubTokenCredentials(connectionString);
const digitalTwinClient = new DigitalTwinClient(credentials);

const options = {
  connectTimeoutInSeconds: 30,
  responseTimeoutInSeconds: 40
};
const commandResponse = await digitalTwinClient.invokeCommand(digitalTwinId, "getMaxMinReport", commandPayload, options);

console.log(inspect(commandResponse));
```

The following snippet shows how to call the `getMaxMinReport` command on a component. The command is defined in the **thermostat1** component:

```javascript
const IoTHubTokenCredentials = require('azure-iothub').IoTHubTokenCredentials;
const DigitalTwinClient = require('azure-iothub').DigitalTwinClient;
const { inspect } = require('util');

// ...

const commandPayload = new Date().getMinutes -2;

const credentials = new IoTHubTokenCredentials(connectionString);
const digitalTwinClient = new DigitalTwinClient(credentials);

const options = {
  connectTimeoutInSeconds: 30,
  responseTimeoutInSeconds: 40
};
const commandResponse = await digitalTwinClient.invokeComponentCommand(digitalTwinId, "thermostat1", "getMaxMinReport", commandPayload, options);

console.log(inspect(commandResponse));
```

## Read device telemetry

IoT Plug and Play devices send the telemetry defined in the DTDL model to IoT Hub. By default, IoT Hub routes the telemetry to an Event Hubs endpoint where you can consume it. To learn more, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../articles/iot-hub/iot-hub-devguide-messages-d2c.md).

The following code snippet shows how to read the telemetry from the default Event Hubs endpoint. The code in this snippet is taken from the IoT Hub quickstart [Send telemetry from a device to an IoT hub and read it with a back-end application](../articles/iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-nodejs):

```javascript
const { EventHubConsumerClient } = require("@azure/event-hubs");

var printError = function (err) {
  console.log(err.message);
};

var printMessages = function (messages) {
  for (const message of messages) {
    console.log("Telemetry received: ");
    console.log(JSON.stringify(message.body));
    console.log("Properties (set by device): ");
    console.log(JSON.stringify(message.properties));
    console.log("System properties (set by IoT Hub): ");
    console.log(JSON.stringify(message.systemProperties));
    console.log("");
  }
};

// ...

const clientOptions = {};

const consumerClient = new EventHubConsumerClient("$Default", connectionString, clientOptions);

consumerClient.subscribe({
  processEvents: printMessages,
  processError: printError,
});
```

The following output from the previous code shows the temperature telemetry sent by the multi-component **TemperatureController** IoT Plug and Play device. The `dt-subject` system property shows the name of the component that sent the telemetry. In this example, the two components are `thermostat1` and `thermostat2` as defined in the DTDL model. The `dt-dataschema` system property shows the model ID:

```cmd/sh
Telemetry received:
{"temperature":68.77370855171125}
Properties (set by device):
undefined
System properties (set by IoT Hub):
{"iothub-connection-device-id":"my-pnp-device","iothub-connection-auth-method":"{\"scope\":\"device\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}","iothub-connection-auth-generation-id":"637388034455888246","iothub-enqueuedtime":1603206669320,"iothub-message-source":"Telemetry","dt-subject":"thermostat1","dt-dataschema":"dtmi:com:example:TemperatureController;1","contentType":"application/json","contentEncoding":"utf-8"}

Telemetry received:
{"temperature":30.833394506549226}
Properties (set by device):
undefined
System properties (set by IoT Hub):
{"iothub-connection-device-id":"my-pnp-device","iothub-connection-auth-method":"{\"scope\":\"device\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}","iothub-connection-auth-generation-id":"637388034455888246","iothub-enqueuedtime":1603206665835,"iothub-message-source":"Telemetry","dt-subject":"thermostat2","dt-dataschema":"dtmi:com:example:TemperatureController;1","contentType":"application/json","contentEncoding":"utf-8"}
```

## Read device twin change notifications

You can configure IoT Hub to generate device twin change notifications to route to a supported endpoint. To learn more, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints > Non-telemetry events](../articles/iot-hub/iot-hub-devguide-messages-d2c.md#non-telemetry-events).

The code shown in the previous JavaScript code snippet generates the following output when IoT Hub generates device twin change notifications for a no-component thermostat device. The application properties `iothub-message-schema` and `opType` give you information about the type of change notification:

```cmd/sh
Telemetry received:
{"version":4,"properties":{"reported":{"maxTempSinceLastReboot":42.1415152639582,"$metadata":{"$lastUpdated":"2020-10-21T10:01:40.1281138Z","maxTempSinceLastReboot":{"$lastUpdated":"2020-10-21T10:01:40.1281138Z"}},"$version":3}}}
Properties (set by device):
{"hubName":"my-pnp-hub","deviceId":"my-pnp-device","operationTimestamp":"2020-10-21T10:01:40.1281138+00:00","iothub-message-schema":"twinChangeNotification","opType":"updateTwin"}
System properties (set by IoT Hub):
{"iothub-connection-device-id":"my-pnp-device","iothub-enqueuedtime":1603274500282,"iothub-message-source":"twinChangeEvents","userId":{"type":"Buffer","data":[109,121,45,112,110,112,45,104,117,98]},"correlationId":"11ed82d13f50","contentType":"application/json","contentEncoding":"utf-8"}
```

The code shown in the previous JavaScript code snippet generates the following output when IoT Hub generates device twin change notifications for a device with components. This example shows the output when a temperature sensor device with a thermostat component generates notifications. The application properties `iothub-message-schema` and `opType` give you information about the type of change notification:

```cmd/sh
Telemetry received:
{"version":4,"properties":{"reported":{"thermostat1":{"maxTempSinceLastReboot":3.5592971602417913,"__t":"c"},"$metadata":{"$lastUpdated":"2020-10-21T10:07:51.8284866Z","thermostat1":{"$lastUpdated":"2020-10-21T10:07:51.8284866Z","maxTempSinceLastReboot":{"$lastUpdated":"2020-10-21T10:07:51.8284866Z"},"__t":{"$lastUpdated":"2020-10-21T10:07:51.8284866Z"}}},"$version":3}}}
Properties (set by device):
{"hubName":"my-pnp-hub","deviceId":"my-pnp-device","operationTimestamp":"2020-10-21T10:07:51.8284866+00:00","iothub-message-schema":"twinChangeNotification","opType":"updateTwin"}
System properties (set by IoT Hub):
{"iothub-connection-device-id":"my-pnp-device","iothub-enqueuedtime":1603274871951,"iothub-message-source":"twinChangeEvents","userId":{"type":"Buffer","data":[109,121,45,112,110,112,45,104,117,98]},"correlationId":"11ee605b195f","contentType":"application/json","contentEncoding":"utf-8"}
```

## Read digital twin change notifications

You can configure IoT Hub to generate digital twin change notifications to route to a supported endpoint. To learn more, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints > Non-telemetry events](../articles/iot-hub/iot-hub-devguide-messages-d2c.md#non-telemetry-events).

The code shown in the previous JavaScript code snippet generates the following output when IoT Hub generates digital twin change notifications for a no-component thermostat device. The application properties `iothub-message-schema` and `opType` give you information about the type of change notification:

```cmd/sh
Telemetry received:
[{"op":"add","path":"/$metadata/maxTempSinceLastReboot","value":{"lastUpdateTime":"2020-10-21T10:01:40.1281138Z"}},{"op":"add","path":"/maxTempSinceLastReboot","value":42.1415152639582}]
Properties (set by device):
{"hubName":"my-pnp-hub","deviceId":"my-pnp-device","operationTimestamp":"2020-10-21T10:01:40.1281138+00:00","iothub-message-schema":"digitalTwinChangeNotification","opType":"updateTwin"}
System properties (set by IoT Hub):
{"iothub-connection-device-id":"my-pnp-device","iothub-enqueuedtime":1603274500282,"iothub-message-source":"digitalTwinChangeEvents","userId":{"type":"Buffer","data":[109,121,45,112,110,112,45,104,117,98]},"correlationId":"11ed82d13f50","contentType":"application/json-patch+json","contentEncoding":"utf-8"}
```

The code shown in the previous JavaScript code snippet generates the following output when IoT Hub generates digital twin change notifications for a device with components. This example shows the output when a temperature sensor device with a thermostat component generates notifications. The application properties `iothub-message-schema` and `opType` give you information about the type of change notification:

```cmd/sh
Telemetry received:
[{"op":"add","path":"/thermostat1","value":{"$metadata":{"maxTempSinceLastReboot":{"lastUpdateTime":"2020-10-21T10:07:51.8284866Z"}},"maxTempSinceLastReboot":3.5592971602417913}}]
Properties (set by device):
{"hubName":"my-pnp-hub","deviceId":"my-pnp-device","operationTimestamp":"2020-10-21T10:07:51.8284866+00:00","iothub-message-schema":"digitalTwinChangeNotification","opType":"updateTwin"}
System properties (set by IoT Hub):
{"iothub-connection-device-id":"my-pnp-device","iothub-enqueuedtime":1603274871951,"iothub-message-source":"digitalTwinChangeEvents","userId":{"type":"Buffer","data":[109,121,45,112,110,112,45,104,117,98]},"correlationId":"11ee605b195f","contentType":"application/json-patch+json","contentEncoding":"utf-8"}
```

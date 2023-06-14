---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 11/17/2022
---

## Model ID announcement

To announce the model ID, the device must include it in the connection information:

```nodejs
const modelIdObject = { modelId: 'dtmi:com:example:Thermostat;1' };
const client = Client.fromConnectionString(deviceConnectionString, Protocol);
await client.setOptions(modelIdObject);
await client.open();
```

> [!TIP]
> For modules and IoT Edge, use `ModuleClient` in place of `Client`.

> [!TIP]
> This is the only time a device can set model ID, it can't be updated after the device connects.

## DPS payload

Devices using the [Device Provisioning Service (DPS)](../articles/iot-dps/about-iot-dps.md) can include the `modelId` to be used during the provisioning process by using the following JSON payload.

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

```nodejs
async function sendTelemetry(deviceClient, data, index, componentName) {
  const msg = new Message(data);
  if (!!(componentName)) {
    msg.properties.add(messageSubjectProperty, componentName);
  }
  msg.contentType = 'application/json';
  msg.contentEncoding = 'utf-8';
  await deviceClient.sendEvent(msg);
}
```

## Read-only properties

Reporting a property from the default component doesn't require any special construct:

```nodejs
const createReportPropPatch = (propertiesToReport) => {
  let patch;
  patch = { };
  patch = propertiesToReport;
  return patch;
};

deviceTwin = await client.getTwin();
patchThermostat = createReportPropPatch({
  maxTempSinceLastReboot: 38.7
});

deviceTwin.properties.reported.update(patchThermostat, function (err) {
  if (err) throw err;
});
```

The device twin is updated with the following reported property:

```json
{
  "reported": {
      "maxTempSinceLastReboot" : 38.7
  }
}
```

When you use nested components, properties must be created within the component name and include a marker:

```nodejs
helperCreateReportedPropertiesPatch = (propertiesToReport, componentName) => {
  let patch;
  if (!!(componentName)) {
    patch = { };
    propertiesToReport.__t = 'c';
    patch[componentName] = propertiesToReport;
  } else {
    patch = { };
    patch = propertiesToReport;
  }
  return patch;
};

deviceTwin = await client.getTwin();
patchThermostat1Info = helperCreateReportedPropertiesPatch({
  maxTempSinceLastReboot: 38.7,
}, 'thermostat1');

deviceTwin.properties.reported.update(patchThermostat1Info, function (err) {
  if (err) throw err;
});
```

The device twin is updated with the following reported property:

```json
{
  "reported": {
    "thermostat1" : {  
      "__t" : "c",  
      "maxTempSinceLastReboot" : 38.7
     } 
  }
}
```

## Writable properties

These properties can be set by the device or updated by the back-end application. If the back-end application updates a property, the client receives a notification as a callback in the `Client` or `ModuleClient`. To follow the IoT Plug and Play conventions, the device must inform the service that the property was successfully received.

If the property type is `Object`, the service must send a complete object to the device even if it's only updating a subset of the object's fields. The acknowledgment the device sends must also be a complete object.

### Report a writable property

When a device reports a writable property, it must include the `ack` values defined in the conventions.

To report a writable property from the default component:

```nodejs
patch = {
  targetTemperature:
    {
      'value': 23.2,
      'ac': 200,  // using HTTP status codes
      'ad': 'reported default value',
      'av': 0  // not read from a desired property
    }
};
deviceTwin.properties.reported.update(patch, function (err) {
  if (err) throw err;
});
```

The device twin is updated with the following reported property:

```json
{
  "reported": {
    "targetTemperature": {
      "value": 23.2,
      "ac": 200,
      "av": 0,
      "ad": "reported default value"
    }
  }
}
```

To report a writable property from a nested component, the twin must include a marker:

```nodejs
patch = {
  thermostat1: {
    '__t' : 'c',
    targetTemperature: {
      'value': 23.2,
      'ac': 200,  // using HTTP status codes
      'ad': 'reported default value',
      'av': 0  // not read from a desired property
    }
  }
};
deviceTwin.properties.reported.update(patch, function (err) {
  if (err) throw err;
});
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
          "av": 0,
          "ad": "complete"
      }
    }
  }
}
```

### Subscribe to desired property updates

Services can update desired properties that trigger a notification on the connected devices. This notification includes the updated desired properties, including the version number identifying the update. Devices must include this version number in the  `ack` message sent back to the service.

A default component sees the single property and creates the reported `ack` with the received version:

```nodejs
const propertyUpdateHandler = (deviceTwin, propertyName, reportedValue, desiredValue, version) => {
  const patch = createReportPropPatch(
    { [propertyName]:
      {
        'value': desiredValue,
        'ac': 200,
        'ad': 'Successfully executed patch for ' + propertyName,
        'av': version
      }
    });
  updateComponentReportedProperties(deviceTwin, patch);
};

desiredPropertyPatchHandler = (deviceTwin) => {
  deviceTwin.on('properties.desired', (delta) => {
    const versionProperty = delta.$version;

    Object.entries(delta).forEach(([propertyName, propertyValue]) => {
      if (propertyName !== '$version') {
        propertyUpdateHandler(deviceTwin, propertyName, null, propertyValue, versionProperty);
      }
    });
  });
};
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

```nodejs
const desiredPropertyPatchListener = (deviceTwin, componentNames) => {
  deviceTwin.on('properties.desired', (delta) => {
    Object.entries(delta).forEach(([key, values]) => {
      const version = delta.$version;
      if (!!(componentNames) && componentNames.includes(key)) { // then it is a component we are expecting
        const componentName = key;
        const patchForComponents = { [componentName]: {} };
        Object.entries(values).forEach(([propertyName, propertyValue]) => {
          if (propertyName !== '__t' && propertyName !== '$version') {
            const propertyContent = { value: propertyValue };
            propertyContent.ac = 200;
            propertyContent.ad = 'Successfully executed patch';
            propertyContent.av = version;
            patchForComponents[componentName][propertyName] = propertyContent;
          }
        });
        updateComponentReportedProperties(deviceTwin, patchForComponents, componentName);
      }
      else if  (key !== '$version') { // individual property for root
        const patchForRoot = { };
        const propertyContent = { value: values };
        propertyContent.ac = 200;
        propertyContent.ad = 'Successfully executed patch';
        propertyContent.av = version;
        patchForRoot[key] = propertyContent;
        updateComponentReportedProperties(deviceTwin, patchForRoot, null);
      }
    });
  });
};
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

## Commands

A default component receives the command name as it was invoked by the service.

A nested component receives the command name prefixed with the component name and the `*` separator.

```nodejs
const commandHandler = async (request, response) => {
  switch (request.methodName) {
  
  // ...

  case 'thermostat1*reboot': {
    await response.send(200, 'reboot response');
    break;
  }
  default:
    await response.send(404, 'unknown method');
    break;
  }
};

client.onDeviceMethod('thermostat1*reboot', commandHandler);
```

### Request and response payloads

Commands use types to define their request and response payloads. A device must deserialize the incoming input parameter and serialize the response.

The following example shows how to implement a command with complex types defined in the payloads:

```json
{
  "@type": "Command",
  "name": "getMaxMinReport",
  "displayName": "Get Max-Min report.",
  "description": "This command returns the max, min and average temperature from the specified time to the current time.",
  "request": {
    "name": "since",
    "displayName": "Since",
    "description": "Period to return the max-min report.",
    "schema": "dateTime"
  },
  "response": {
    "name" : "tempReport",
    "displayName": "Temperature Report",
    "schema": {
      "@type": "Object",
      "fields": [
        {
          "name": "maxTemp",
          "displayName": "Max temperature",
          "schema": "double"
        },
        {
          "name": "minTemp",
          "displayName": "Min temperature",
          "schema": "double"
        },
        {
          "name" : "avgTemp",
          "displayName": "Average Temperature",
          "schema": "double"
        },
        {
          "name" : "startTime",
          "displayName": "Start Time",
          "schema": "dateTime"
        },
        {
          "name" : "endTime",
          "displayName": "End Time",
          "schema": "dateTime"
        }
      ]
    }
  }
}
```

The following code snippets show how a device implements this command definition, including the types used to enable serialization and deserialization:

```nodejs
class TemperatureSensor {

  // ...

  getMaxMinReportObject() {
    return {
      maxTemp: this.maxTemp,
      minTemp: this.minTemp,
      avgTemp: this.cumulativeTemperature / this.numberOfTemperatureReadings,
      endTime: (new Date(Date.now())).toISOString(),
      startTime: this.startTime
    };
  }
}

// ...

const deviceTemperatureSensor = new TemperatureSensor();

const commandHandler = async (request, response) => {
  switch (request.methodName) {
  case commandMaxMinReport: {
    console.log('MaxMinReport ' + request.payload);
    await response.send(200, deviceTemperatureSensor.getMaxMinReportObject());
    break;
  }
  default:
    await response.send(404, 'unknown method');
    break;
  }
};
```

> [!TIP]
> The request and response names aren't present in the serialized payloads transmitted over the wire.

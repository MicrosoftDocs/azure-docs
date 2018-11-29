---
title: How to use user-defined functions in Azure Digital Twins | Microsoft Docs
description: Guideline on how to create user-defined functions, matchers, and role assignments with Azure Digital Twins.
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 11/13/2018
ms.author: alinast
---

# How to use user-defined functions in Azure Digital Twins

[User-defined functions](./concepts-user-defined-functions.md) (UDF) enable the user to run custom logic against incoming telemetry messages and spatial graph metadata. Then the user can send events to predefined endpoints. This guide walks through an example of acting on temperature events to detect and alert on any reading that exceeds a certain temperature.

[!INCLUDE [Digital Twins Management API](../../includes/digital-twins-management-api.md)]

## Client library reference

The functions that are available as helper methods in the user-defined functions runtime are listed in the [client reference](#Client-Reference) section.

## Create a matcher

Matchers are graph objects that determine what user-defined functions run for a given telemetry message.

- Valid matcher condition comparisons:

  - `Equals`
  - `NotEquals`
  - `Contains`

- Valid matcher condition targets:

  - `Sensor`
  - `SensorDevice`
  - `SensorSpace`

The following example matcher evaluates to true on any sensor telemetry event with `"Temperature"` as its data type value. You can create multiple matchers on a user-defined function:

```plaintext
POST YOUR_MANAGEMENT_API_URL/matchers
{
  "Name": "Temperature Matcher",
  "Conditions": [
    {
      "target": "Sensor",
      "path": "$.dataType",
      "value": "\"Temperature\"",
      "comparison": "Equals"
    }
  ],
  "SpaceId": "YOUR_SPACE_IDENTIFIER"
}
```

| Value | Replace with |
| --- | --- |
| YOUR_SPACE_IDENTIFIER | Which server region your instance is hosted on |

## Create a user-defined function (UDF)

After the matchers are created, upload the function snippet with the following **POST** call:

> [!IMPORTANT]
> - In the headers, set the following `Content-Type: multipart/form-data; boundary="userDefinedBoundary"`.
> - The body is multipart:
>   - The first part is about metadata needed for the UDF.
>   - The second part is the JavaScript compute logic.
> - In the **USER_DEFINED_BOUNDARY** section, replace the **SpaceId** and **Machers** values.

```plaintext
POST YOUR_MANAGEMENT_API_URL/userdefinedfunctions with Content-Type: multipart/form-data; boundary="USER_DEFINED_BOUNDARY"
```

| Parameter value | Replace with |
| --- | --- |
| *USER_DEFINED_BOUNDARY* | A multipart content boundary name |

### Body

```plaintext
--USER_DEFINED_BOUNDARY
Content-Type: application/json; charset=utf-8
Content-Disposition: form-data; name="metadata"

{
  "SpaceId": "YOUR_SPACE_IDENTIFIER",
  "Name": "User Defined Function",
  "Description": "The contents of this udf will be executed when matched against incoming telemetry.",
  "Matchers": ["YOUR_MATCHER_IDENTIFIER"]
}
--USER_DEFINED_BOUNDARY
Content-Disposition: form-data; name="contents"; filename="userDefinedFunction.js"
Content-Type: text/javascript

function process(telemetry, executionContext) {
  // Code goes here.
}

--USER_DEFINED_BOUNDARY--
```

| Value | Replace with |
| --- | --- |
| YOUR_SPACE_IDENTIFIER | The space identifier  |
| YOUR_MATCHER_IDENTIFIER | The ID of the matcher you want to use |

### Example functions

Set the sensor telemetry reading directly for the sensor with data type **Temperature**, which is `sensor.DataType`:

```JavaScript
function process(telemetry, executionContext) {

  // Get sensor metadata
  var sensor = getSensorMetadata(telemetry.SensorId);

  // Retrieve the sensor value
  var parseReading = JSON.parse(telemetry.Message);

  // Set the sensor reading as the current value for the sensor.
  setSensorValue(telemetry.SensorId, sensor.DataType, parseReading.SensorValue);
}
```

The **telemetry** parameter exposes the **SensorId** and **Message** attributes, corresponding to a message sent by a sensor. The **executionContext** parameter exposes the following attributes:

```csharp
var executionContext = new UdfExecutionContext
{
    EnqueuedTime = request.HubEnqueuedTime,
    ProcessorReceivedTime = request.ProcessorReceivedTime,
    UserDefinedFunctionId = request.UserDefinedFunctionId,
    CorrelationId = correlationId.ToString(),
};
```

In the next example, we log a message if the sensor telemetry reading surpasses a predefined threshold. If your diagnostic settings are enabled on the Azure Digital Twins instance, logs from user-defined functions are also forwarded:

```JavaScript
function process(telemetry, executionContext) {

  // Retrieve the sensor value
  var parseReading = JSON.parse(telemetry.Message);

  // Example sensor telemetry reading range is greater than 0.5
  if(parseFloat(parseReading.SensorValue) > 0.5) {
    log(`Alert: Sensor with ID: ${telemetry.SensorId} detected an anomaly!`);
  }
}
```

The following code triggers a notification if the temperature level rises above the predefined constant:

```JavaScript
function process(telemetry, executionContext) {

  // Retrieve the sensor value
  var parseReading = JSON.parse(telemetry.Message);

  // Define threshold
  var threshold = 70;

  // Trigger notification 
  if(parseInt(parseReading) > threshold) {
    var alert = {
      message: 'Temperature reading has surpassed threshold',
      sensorId: telemetry.SensorId,
      reading: parseReading
    };

    sendNotification(telemetry.SensorId, "Sensor", JSON.stringify(alert));
  }
}
```

For a more complex UDF code sample, [check available spaces with a fresh air UDF](https://github.com/Azure-Samples/digital-twins-samples-csharp/blob/master/occupancy-quickstart/src/actions/userDefinedFunctions/availability.js).

## Create a role assignment

We need to create a role assignment for the user-defined function to run under. If we don't, it won't have the proper permissions to interact with the Management API to perform actions on graph objects. The actions that the user-defined function performs aren't exempt from the role-based access control within the Azure Digital Twins Management APIs. They can be limited in scope by specifying certain roles or certain access control paths. For more information, see [role-based access control](./security-role-based-access-control.md) documentation.

1. Query for roles and get the ID of the role you want to assign to the UDF. Pass it to **RoleId**:

    ```plaintext
    GET YOUR_MANAGEMENT_API_URL/system/roles
    ```

1. **ObjectId** will be the UDF ID that was created earlier.
1. Find the value of **Path** by querying your spaces with `fullpath`.
1. Copy the returned `spacePaths` value. You'll use that in the following code:

    ```plaintext
    GET YOUR_MANAGEMENT_API_URL/spaces?name=YOUR_SPACE_NAME&includes=fullpath
    ```

    | Parameter value | Replace with |
    | --- | --- |
    | *YOUR_SPACE_NAME* | The name of the space you wish to use |

1. Paste the returned `spacePaths` value into **Path** to create a UDF role assignment:

    ```plaintext
    POST YOUR_MANAGEMENT_API_URL/roleassignments
    {
      "RoleId": "YOUR_DESIRED_ROLE_IDENTIFIER",
      "ObjectId": "YOUR_USER_DEFINED_FUNCTION_ID",
      "ObjectIdType": "YOUR_USER_DEFINED_FUNCTION_TYPE_ID",
      "Path": "YOUR_ACCESS_CONTROL_PATH"
    }
    ```

    | Your value | Replace with |
    | --- | --- |
    | YOUR_DESIRED_ROLE_IDENTIFIER | The identifier for the desired role |
    | YOUR_USER_DEFINED_FUNCTION_ID | The ID for the UDF you want to use |
    | YOUR_USER_DEFINED_FUNCTION_TYPE_ID | The ID specifying the UDF type |
    | YOUR_ACCESS_CONTROL_PATH | The access control path |

## Send telemetry to be processed

Telemetry generated by the sensor described in the graph triggers the run of the user-defined function that was uploaded. The data processor picks up the telemetry. Then a run plan is created for the invocation of the user-defined function.

1. Retrieve the matchers for the sensor the reading was generated off of.
1. Depending on what matchers evaluated successfully, retrieve the associated user-defined functions.
1. Run each user-defined function.

## Client reference

### getSpaceMetadata(id) ⇒ `space`

Given a space identifier, this function retrieves the space from the graph.

**Kind**: global function

| Parameter  | Type                | Description  |
| ---------- | ------------------- | ------------ |
| *id*  | `guid` | Space identifier |

### getSensorMetadata(id) ⇒ `sensor`

Given a sensor identifier, this function retrieves the sensor from the graph.

**Kind**: global function

| Parameter  | Type                | Description  |
| ---------- | ------------------- | ------------ |
| *id*  | `guid` | Sensor identifier |

### getDeviceMetadata(id) ⇒ `device`

Given a device identifier, this function retrieves the device from the graph.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *id* | `guid` | Device identifier |

### getSensorValue(sensorId, dataType) ⇒ `value`

Given a sensor identifier and its data type, this function retrieves the current value for that sensor.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *sensorId*  | `guid` | Sensor identifier |
| *dataType*  | `string` | Sensor data type |

### getSpaceValue(spaceId, valueName) ⇒ `value`

Given a space identifier and the value name, this function retrieves the current value for that space property.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *spaceId*  | `guid` | Space identifier |
| *valueName* | `string` | Space property name |

### getSensorHistoryValues(sensorId, dataType) ⇒ `value[]`

Given a sensor identifier and its data type, this function retrieves the historical values for that sensor.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *sensorId* | `guid` | Sensor identifier |
| *dataType* | `string` | Sensor data type |

### getSpaceHistoryValues(spaceId, dataType) ⇒ `value[]`

Given a space identifier and the value name, this function retrieves the historical values for that property on the space.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *spaceId* | `guid` | Space identifier |
| *valueName* | `string` | Space property name |

### getSpaceChildSpaces(spaceId) ⇒ `space[]`

Given a space identifier, this function retrieves the child spaces for that parent space.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *spaceId* | `guid` | Space identifier |

### getSpaceChildSensors(spaceId) ⇒ `sensor[]`

Given a space identifier, this function retrieves the child sensors for that parent space.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *spaceId* | `guid` | Space identifier |

### getSpaceChildDevices(spaceId) ⇒ `device[]`

Given a space identifier, this function retrieves the child devices for that parent space.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *spaceId* | `guid` | Space identifier |

### getDeviceChildSensors(deviceId) ⇒ `sensor[]`

Given a device identifier, this function retrieves the child sensors for that parent device.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *deviceId* | `guid` | Device identifier |

### getSpaceParentSpace(childSpaceId) ⇒ `space`

Given a space identifier, this function retrieves its parent space.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *childSpaceId* | `guid` | Space identifier |

### getSensorParentSpace(childSensorId) ⇒ `space`

Given a sensor identifier, this function retrieves its parent space.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *childSensorId* | `guid` | Sensor identifier |

### getDeviceParentSpace(childDeviceId) ⇒ `space`

Given a device identifier, this function retrieves its parent space.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *childDeviceId* | `guid` | Device identifier |

### getSensorParentDevice(childSensorId) ⇒ `space`

Given a sensor identifier, this function retrieves its parent device.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *childSensorId* | `guid` | Sensor identifier |

### getSpaceExtendedProperty(spaceId, propertyName) ⇒ `extendedProperty`

Given a space identifier, this function retrieves the property and its value from the space.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *spaceId* | `guid` | Space identifier |
| *propertyName* | `string` | Space property name |

### getSensorExtendedProperty(sensorId, propertyName) ⇒ `extendedProperty`

Given a sensor identifier, this function retrieves the property and its value from the sensor.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *sensorId* | `guid` | Sensor identifier |
| *propertyName* | `string` | Sensor property name |

### getDeviceExtendedProperty(deviceId, propertyName) ⇒ `extendedProperty`

Given a device identifier, this function retrieves the property and its value from the device.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *deviceId* | `guid` | Device identifier |
| *propertyName* | `string` | Device property name |

### setSensorValue(sensorId, dataType, value)

This function sets a value on the sensor object with the given data type.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *sensorId* | `guid` | Sensor identifier |
| *dataType*  | `string` | Sensor data type |
| *value*  | `string` | Value |

### setSpaceValue(spaceId, dataType, value)

This function sets a value on the space object with the given data type.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *spaceId* | `guid` | Space identifier |
| *dataType* | `string` | Data type |
| *value* | `string` | Value |

### log(message)

This function logs the following message within the user-defined function.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *message* | `string` | Message to be logged |

### sendNotification(topologyObjectId, topologyObjectType, payload)

This function sends a custom notification out to be dispatched.

**Kind**: global function

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *topologyObjectId*  | `guid` | Graph object identifier. Examples are space, sensor, and device ID.|
| *topologyObjectType*  | `string` | Examples are sensor and device.|
| *payload*  | `string` | The JSON payload to be sent with the notification. |

## Return types

The following models describe the return objects from the preceding client reference.

### Space

```JSON
{
  "Id": "00000000-0000-0000-0000-000000000000",
  "Name": "Space",
  "FriendlyName": "Conference Room",
  "TypeId": 0,
  "ParentSpaceId": "00000000-0000-0000-0000-000000000001",
  "SubtypeId": 0
}
```

### Space methods

#### Parent() ⇒ `space`

This function returns the parent space of the current space.

#### ChildSensors() ⇒ `sensor[]`

This function returns the child sensors of the current space.

#### ChildDevices() ⇒ `device[]`

This function returns the child devices of the current space.

#### ExtendedProperty(propertyName) ⇒ `extendedProperty`

This function returns the extended property and its value for the current space.

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *propertyName* | `string` | Name of the extended property |

#### Value(valueName) ⇒ `value`

This function returns the value of the current space.

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *valueName* | `string` | Name of the value |

#### History(valueName) ⇒ `value[]`

This function returns the historical values of the current space.

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *valueName* | `string` | Name of the value |

#### Notify(payload)

This function sends a notification with the specified payload.

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *payload* | `string` | JSON payload to include in the notification |

### Device

```JSON
{
  "Id": "00000000-0000-0000-0000-000000000002",
  "Name": "Device",
  "FriendlyName": "Temperature Sensing Device",
  "Description": "This device contains a sensor that captures temperature readings.",
  "Type": "None",
  "Subtype": "None",
  "TypeId": 0,
  "SubtypeId": 0,
  "HardwareId": "ABC123",
  "GatewayId": "ABC",
  "SpaceId": "00000000-0000-0000-0000-000000000000"
}
```

### Device methods

#### Parent() ⇒ `space`

This function returns the parent space of the current device.

#### ChildSensors() ⇒ `sensor[]`

This function returns the child sensors of the current device.

#### ExtendedProperty(propertyName) ⇒ `extendedProperty`

This function returns the extended property and its value for the current device.

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *propertyName* | `string` | Name of the extended property |

#### Notify(payload)

This function sends a notification with the specified payload.

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *payload* | `string` | JSON payload to include in the notification |

### Sensor

```JSON
{
  "Id": "00000000-0000-0000-0000-000000000003",
  "Port": "30",
  "PollRate": 3600,
  "DataType": "Temperature",
  "DataSubtype": "None",
  "Type": "Classic",
  "PortType": "None",
  "DataUnitType": "FahrenheitTemperature",
  "SpaceId": "00000000-0000-0000-0000-000000000000",
  "DeviceId": "00000000-0000-0000-0000-000000000001",
  "PortTypeId": 0,
  "DataUnitTypeId": 0,
  "DataTypeId": 0,
  "DataSubtypeId": 0,
  "TypeId": 0  
}
```

### Sensor methods

#### Space() ⇒ `space`

This function returns the parent space of the current sensor.

#### Device() ⇒ `device`

This function returns the parent device of the current sensor.

#### ExtendedProperty(propertyName) ⇒ `extendedProperty`

This function returns the extended property and its value for the current sensor.

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *propertyName* | `string` | Name of the extended property |

#### Value() ⇒ `value`

This function returns the value of the current sensor.

#### History() ⇒ `value[]`

This function returns the historical values of the current sensor.

#### Notify(payload)

This function sends a notification with the specified payload.

| Parameter  | Type                | Description  |
| ------ | ------------------- | ------------ |
| *payload* | `string` | JSON payload to include in the notification |

### Value

```JSON
{
  "DataType": "Temperature",
  "Value": "70",
  "CreatedTime": ""
}
```

### Extended property

```JSON
{
  "Name": "OccupancyStatus",
  "Value": "Occupied"
}
```

## Next steps

- Learn how to [create Azure Digital Twins endpoints](how-to-egress-endpoints.md) to send events to.

- For more details on Azure Digital Twins endpoints, learn [more about endpoints](concepts-events-routing.md).

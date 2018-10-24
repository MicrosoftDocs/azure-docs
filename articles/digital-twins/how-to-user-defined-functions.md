---
title: How to use user-defined functions in Azure Digital Twins | Microsoft Docs
description: Guideline on how to create user-defined functions, matchers and role assignments with Azure Digital Twins.
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 10/08/2018
ms.author: alinast
---

# How to use user-defined functions in Azure Digital Twins

[User-defined functions](./concepts-user-defined-functions.md) enable the user to run custom logic against incoming telemetry messages and spatial graph metadata, allowing the user to send events to pre-defined endpoints. In this guide, we'll walk through an example of acting on temperature events to detect and alert on any reading that exceeds a certain temperature.

In the examples below, `https://yourManagementApiUrl` refers to the URI of the Digital Twins APIs:

```plaintext
https://yourInstanceName.yourLocation.azuresmartspaces.net/management
```

| Custom Attribute Name | Replace With |
| --- | --- |
| `yourInstanceName` | The name of your Azure Digital Twins instance |
| `yourLocation` | Which server region your instance is hosted on |

## Client library reference

The functions that are available as helper methods in the user-defined functions runtime are enumerated in the following [Client Reference](#Client-Reference).

## Create a matcher

Matchers are graph objects, which determine what user-defined functions will be executed for a given telemetry message.

Valid matcher condition comparisons:

- `Equals`
- `NotEquals`
- `Contains`

Valid matcher condition targets:

- `Sensor`
- `SensorDevice`
- `SensorSpace`

The following example matcher will evaluate to true on any sensor telemetry event with `Temperature` as its data type value. You can create multiple matchers on a user-defined function.

```text
POST https://yourManagementApiUrl/api/v1.0/matchers
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
  "SpaceId": "yourSpaceIdentifier"
}
```

| Custom Attribute Name | Replace With |
| --- | --- |
| `yourManagementApiUrl` | The full URL path for your Management API  |
| `yourSpaceIdentifier` | Which server region your instance is hosted on |

## Create a user-defined function (UDF)

After the matchers have been created, upload the function snippet with the following POST call:

> [!IMPORTANT]
> - In the Headers, set the following `Content-Type: multipart/form-data; boundary="userDefinedBoundary"`.
> - The Body is multi-part:
>   - The first part is about metadata needed for UDF.
>   - The second part is the javascript compute logic.
> - Replace in `userDefinedBoundary` section `SpaceId` and `Machers` Guids.

```plaintext
POST https://yourManagementApiUrl/api/v1.0/userdefinedfunctions with Content-Type: multipart/form-data; boundary="userDefinedBoundary"
```

| Custom Attribute Name | Replace With |
| --- | --- |
| `yourManagementApiUrl` | The full URL path for your Management API  |

Body:

```plaintext
--userDefinedBoundary
Content-Type: application/json; charset=utf-8
Content-Disposition: form-data; name="metadata"

{
  "SpaceId": "yourSpaceIdentifier",
  "Name": "User Defined Function",
  "Description": "The contents of this udf will be executed when matched against incoming telemetry.",
  "Matchers": ["yourMatcherIdentifier"]
}
--userDefinedBoundary
Content-Disposition: form-data; name="contents"; filename="userDefinedFunction.js"
Content-Type: text/javascript

function process(telemetry, executionContext) {
  // Code goes here.
}

--userDefinedBoundary--
```

| Custom Attribute Name | Replace With |
| --- | --- |
| `yourSpaceIdentifier` | The space identifier  |
| `yourMatcherIdentifier` | The id of the matcher you wish to use |

### Example Functions

Set the sensor telemetry reading directly for the sensor with data type `Temperature`, which is sensor.DataType:

```javascript
function process(telemetry, executionContext) {

  // Get sensor metadata
  var sensor = getSensorMetadata(telemetry.SensorId);

  // Retrieve the sensor value
  var parseReading = JSON.parse(telemetry.Message);

  // Set the sensor reading as the current value for the sensor.
  setSensorValue(telemetry.SensorId, sensor.DataType, parseReading.SensorValue);
}
```

Log a message if the sensor telemetry reading surpasses a pre-defined threshold. If your diagnostic settings are enabled on the Digital Twins instance, logs from user-defined functions will be forwarded:

```javascript
function process(telemetry, executionContext) {

  // Retrieve the sensor value
  var parseReading = JSON.parse(telemetry.Message);

  // Example sensor telemetry reading range is greater than 0.5
  if(parseFloat(parseReading.SensorValue) > 0.5) {
    log(`Alert: Sensor with ID: ${telemetry.SensorId} detected an anomaly!`);
  }
}
```

The following code will trigger a notification if the temperature level rises above the pre-defined constant.

```javascript
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

For a more complex UDF code sample, refer to [Check available spaces with fresh air UDF](https://github.com/Azure-Samples/digital-twins-samples-csharp/blob/master/occupancy-quickstart/src/actions/userDefinedFunctions/availability.js)

## Create a role assignment

We need to create a role assignment for the user-defined function to execute under. If we do not, it will not have the proper permissions to interact with the Management API to perform actions on graph objects. The actions that the user-defined function performs are not exempt from the role-based access control within the Digital Twins Management APIs. They can be limited in scope by specifying certain roles, or certain access control paths. For more information, see [Role Based Access Control](./security-role-based-access-control.md) documentation.

- Query for roles and get the ID of the role you want to assign to the UDF; pass it to RoleId below.

```plaintext
GET https://yourManagementApiUrl/api/v1.0/system/roles
```

| Custom Attribute Name | Replace With |
| --- | --- |
| `yourManagementApiUrl` | The full URL path for your Management API  |

- ObjectId will be the UDF ID that was created earlier
- Find `Path` by querying the Spaces with their full path and copy the `spacePaths` value. Paste it in Path below when creating the UDF role assignment

```plaintext
GET https://yourManagementApiUrl/api/v1.0/spaces?name=yourSpaceName&includes=fullpath
```

| Custom Attribute Name | Replace With |
| --- | --- |
| `yourManagementApiUrl` | The full URL path for your Management API  |
| `yourSpaceName` | The name of the space you wish to use |

```plaintext
POST https://yourManagementApiUrl/api/v1.0/roleassignments
{
  "RoleId": "yourDesiredRoleIdentifier",
  "ObjectId": "yourUserDefinedFunctionId",
  "ObjectIdType": "UserDefinedFunctionId",
  "Path": "yourAccessControlPath"
}
```

| Custom Attribute Name | Replace With |
| --- | --- |
| `yourManagementApiUrl` | The full URL path for your Management API  |
| `yourDesiredRoleIdentifier` | The identifier for the desired role |
| `yourUserDefinedFunctionId` | The id for the UDF you want to use |
| `yourAccessControlPath` | The access control path |

## Send telemetry to be processed

Telemetry generated by the sensor described in the graph should trigger the execution of the user-defined function that was uploaded. Once the telemetry is picked up by the data processor, an execution plan is created for the invocation of the user-defined function.

1. Retrieve the matchers for the sensor the reading was generated off of.
1. Depending on what matchers evaluated successfully, retrieve the associated user-defined functions.
1. Execute each user-defined function.

## Client reference

### getSpaceMetadata(id) ⇒ `space`

Given a space identifier, retrieves the space from the graph.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| id  | `guid` | space identifier |

### getSensorMetadata(id) ⇒ `sensor`

Given a sensor identifier, retrieves the sensor from the graph.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| id  | `guid` | sensor identifier |

### getDeviceMetadata(id) ⇒ `device`

Given a device identifier, retrieves the device from the graph.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| id  | `guid` | device identifier |

### getSensorValue(sensorId, dataType) ⇒ `value`

Given a sensor identifier and its data type, retrieve the current value for that sensor.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| sensorId  | `guid` | sensor identifier |
| dataType  | `string` | sensor data type |

### getSpaceValue(spaceId, valueName) ⇒ `value`

Given a space identifier and the value name, retrieve the current value for that space property.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| spaceId  | `guid` | space identifier |
| valueName  | `string` | space property name |

### getSensorHistoryValues(sensorId, dataType) ⇒ `value[]`

Given a sensor identifier and its data type, retrieve the historical values for that sensor.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| sensorId  | `guid` | sensor identifier |
| dataType  | `string` | sensor data type |

### getSpaceHistoryValues(spaceId, dataType) ⇒ `value[]`

Given a space identifier and the value name, retrieve the historical values for that property on the space.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| spaceId  | `guid` | space identifier |
| valueName  | `string` | space property name |

### getSpaceChildSpaces(spaceId) ⇒ `space[]`

Given a space identifier, retrieve the child spaces for that parent space.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| spaceId  | `guid` | space identifier |

### getSpaceChildSensors(spaceId) ⇒ `sensor[]`

Given a space identifier, retrieve the child sensors for that parent space.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| spaceId  | `guid` | space identifier |

### getSpaceChildDevices(spaceId) ⇒ `device[]`

Given a space identifier, retrieve the child devices for that parent space.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| spaceId  | `guid` | space identifier |

### getDeviceChildSensors(deviceId) ⇒ `sensor[]`

Given a device identifier, retrieve the child sensors for that parent device.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| deviceId  | `guid` | device identifier |

### getSpaceParentSpace(childSpaceId) ⇒ `space`

Given a space identifier, retrieve its parent space.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| childSpaceId  | `guid` | space identifier |

### getSensorParentSpace(childSensorId) ⇒ `space`

Given a sensor identifier, retrieve its parent space.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| childSensorId  | `guid` | sensor identifier |

### getDeviceParentSpace(childDeviceId) ⇒ `space`

Given a device identifier, retrieve its parent space.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| childDeviceId  | `guid` | device identifier |

### getSensorParentDevice(childSensorId) ⇒ `space`

Given a sensor identifier, retrieve its parent device.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| childSensorId  | `guid` | sensor identifier |

### getSpaceExtendedProperty(spaceId, propertyName) ⇒ `extendedProperty`

Given a space identifier, retrieve the property and its value from the space.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| spaceId  | `guid` | space identifier |
| propertyName  | `string` | space property name |

### getSensorExtendedProperty(sensorId, propertyName) ⇒ `extendedProperty`

Given a sensor identifier, retrieve the property and its value from the sensor.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| sensorId  | `guid` | sensor identifier |
| propertyName  | `string` | sensor property name |

### getDeviceExtendedProperty(deviceId, propertyName) ⇒ `extendedProperty`

Given a device identifier, retrieve the property and its value from the device.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| deviceId  | `guid` | device identifier |
| propertyName  | `string` | device property name |

### setSensorValue(sensorId, dataType, value)

Sets a value on the sensor object with the given data type.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| sensorId  | `guid` | sensor identifier |
| dataType  | `string` | sensor data type |
| value  | `string` | value |

### setSpaceValue(spaceId, dataType, value)

Sets a value on the space object with the given data type.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| spaceId  | `guid` | space identifier |
| dataType  | `string` | data type |
| value  | `string` | value |

### log(message)

Logs the following message within the user-defined function.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| message  | `string` | message to be logged |

### sendNotification(topologyObjectId, topologyObjectType, payload)

Sends a custom notification out to be dispatched.

**Kind**: global function

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| topologyObjectId  | `Guid` | graph object identifier (ex. space / sensor /device id)|
| topologyObjectType  | `string` | (ex. space / sensor / device)|
| payload  | `string` | the json payload to be sent with the notification |

## Return Types

The following are models describing the return objects from the above client reference.

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

### Space Methods

#### Parent() ⇒ `space`

Returns the parent space of the current space.

#### ChildSensors() ⇒ `sensor[]`

Returns the child sensors of the current space.

#### ChildDevices() ⇒ `device[]`

Returns the child devices of the current space.

#### ExtendedProperty(propertyName) ⇒ `extendedProperty`

Returns the extended property and its value for the current space.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| propertyName | `string` | name of the extended property |

#### Value(valueName) ⇒ `value`

Returns the value of the current space.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| valueName | `string` | name of the value |

#### History(valueName) ⇒ `value[]`

Returns the historical values of the current space.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| valueName | `string` | name of the value |

#### Notify(payload)

Sends a notification with the specified payload.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| payload | `string` | json payload to include in the notification |

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

### Device Methods

#### Parent() ⇒ `space`

Returns the parent space of the current device.

#### ChildSensors() ⇒ `sensor[]`

Returns the child sensors of the current device.

#### ExtendedProperty(propertyName) ⇒ `extendedProperty`

Returns the extended property and its value for the current device.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| propertyName | `string` | name of the extended property |

#### Notify(payload)

Sends a notification with the specified payload.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| payload | `string` | json payload to include in the notification |

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

### Sensor Methods

#### Space() ⇒ `space`

Returns the parent space of the current sensor.

#### Device() ⇒ `device`

Returns the parent device of the current sensor.

#### ExtendedProperty(propertyName) ⇒ `extendedProperty`

Returns the extended property and its value for the current sensor.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| propertyName | `string` | name of the extended property |

#### Value() ⇒ `value`

Returns the value of the current sensor.

#### History() ⇒ `value[]`

Returns the historical values of the current sensor.

#### Notify(payload)

Sends a notification with the specified payload.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| payload | `string` | json payload to include in the notification |

### Value

```JSON
{
  "DataType": "Temperature",
  "Value": "70",
  "CreatedTime": ""
}
```

### Extended Property

```JSON
{
  "Name": "OccupancyStatus",
  "Value": "Occupied"
}
```

## Next steps

To learn how to create Digital Twins endpoints to send events to, read [Create Digital Twins endpoints](how-to-egress-endpoints.md).

For more details on Digital Twins endpoints, read [Learn more about endpoints](concepts-events-routing.md).

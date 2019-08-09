---
title: 'Azure Digital Twins user-defined functions client library reference | Microsoft Docs'
description: Azure Digital Twins user-defined functions client library reference.
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: article
ms.date: 06/06/2019
ms.author: alinast
ms.custom: seodec18
---

# User-defined functions client library reference

This document provides reference information for the Azure Digital Twins user-defined functions client library.

## Helper methods

The client library defines helper methods for commonly used operations.

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

The response models returned from client reference helper methods are described below.

### Space

```JSON
{
  "id": "00000000-0000-0000-0000-000000000000",
  "name": "Space",
  "friendlyName": "Conference Room",
  "typeId": 0,
  "parentSpaceId": "00000000-0000-0000-0000-000000000001",
  "subtypeId": 0
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
  "id": "00000000-0000-0000-0000-000000000002",
  "name": "Device",
  "friendlyName": "Temperature Sensing Device",
  "description": "This device contains a sensor that captures temperature readings.",
  "type": "None",
  "subtype": "None",
  "typeId": 0,
  "subtypeId": 0,
  "hardwareId": "ABC123",
  "gatewayId": "ABC",
  "spaceId": "00000000-0000-0000-0000-000000000000"
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
  "id": "00000000-0000-0000-0000-000000000003",
  "port": "30",
  "pollRate": 3600,
  "dataType": "Temperature",
  "dataSubtype": "None",
  "type": "Classic",
  "portType": "None",
  "dataUnitType": "FahrenheitTemperature",
  "spaceId": "00000000-0000-0000-0000-000000000000",
  "deviceId": "00000000-0000-0000-0000-000000000001",
  "portTypeId": 0,
  "dataUnitTypeId": 0,
  "dataTypeId": 0,
  "dataSubtypeId": 0,
  "typeId": 0  
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
  "dataType": "Temperature",
  "value": "70",
  "createdTime": ""
}
```

### Extended property

```JSON
{
  "name": "OccupancyStatus",
  "value": "Occupied"
}
```

## Next steps

- Learn about [Azure Digital Twins user-defined functions](./concepts-user-defined-functions.md).

- Learn [how to create user-defined functions](./how-to-user-defined-functions.md).

- Learn [how to debug user-defined functions](./how-to-diagnose-user-defined-functions.md).

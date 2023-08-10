---
title: Query Azure IoT Hub device twins and module twins
description: This article describes how to retrieve information about device/module twins from your IoT hub using the query language.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: concept-article
ms.date: 09/29/2022
---

# Queries for IoT Hub device and module twins

[Device twins](iot-hub-devguide-device-twins.md) and [module twins](iot-hub-devguide-module-twins.md) can contain arbitrary JSON objects as both tags and properties. IoT Hub enables you to query device twins and module twins as a single JSON document containing all twin information.

Here's a sample IoT hub device twin (module twin would be similar just with a parameter for moduleId):

```json
{
    "deviceId": "myDeviceId",
    "etag": "AAAAAAAAAAc=",
    "status": "enabled",
    "statusUpdateTime": "0001-01-01T00:00:00",
    "connectionState": "Disconnected",
    "lastActivityTime": "0001-01-01T00:00:00",
    "cloudToDeviceMessageCount": 0,
    "authenticationType": "sas",
    "x509Thumbprint": {
        "primaryThumbprint": null,
        "secondaryThumbprint": null
    },
    "version": 2,
    "tags": {
        "location": {
            "region": "US",
            "plant": "Redmond43"
        }
    },
    "properties": {
        "desired": {
            "telemetryConfig": {
                "configId": "db00ebf5-eeeb-42be-86a1-458cccb69e57",
                "sendFrequencyInSecs": 300
            },
            "$metadata": {
            ...
            },
            "$version": 4
        },
        "reported": {
            "connectivity": {
                "type": "cellular"
            },
            "telemetryConfig": {
                "configId": "db00ebf5-eeeb-42be-86a1-458cccb69e57",
                "sendFrequencyInSecs": 300,
                "status": "Success"
            },
            "$metadata": {
            ...
            },
            "$version": 7
        }
    }
}
```

## Device twin queries

IoT Hub exposes the device twins as a document collection called **devices**. For example, the most basic query retrieves the whole set of device twins:

```sql
SELECT * FROM devices
```

> [!NOTE]
> [Azure IoT SDKs](iot-hub-devguide-sdks.md) support paging of large results.

You can aggregate the results of a query using the SELECT clause. For example, the following query gets a count of the total number of devices in an IoT hub:

```sql
SELECT COUNT() as totalNumberOfDevices FROM devices
```

Filter query results using the WHERE clause. For example, to receive device twins where the **location.region** tag is set to **US** use the following query:

```sql
SELECT * FROM devices
WHERE tags.location.region = 'US'
```

Create complex WHERE clauses by using Boolean operators and arithmetic comparisons. For example, the following query retrieves device twins located in the US and configured to send telemetry less than every minute:

```sql
SELECT * FROM devices
  WHERE tags.location.region = 'US'
    AND properties.reported.telemetryConfig.sendFrequencyInSecs >= 60
```

You can also use array constants with the **IN** and **NIN** (not in) operators. For example, the following query retrieves device twins that report either WiFi or wired connectivity:

```sql
SELECT * FROM devices
  WHERE properties.reported.connectivity IN ['wired', 'wifi']
```

It's often necessary to identify all device twins that contain a specific property. IoT Hub supports the function `is_defined()` for this purpose. For example,  the following query retrieves device twins that define the `connectivity` property:

```SQL
SELECT * FROM devices
  WHERE is_defined(properties.reported.connectivity)
```

Refer to the [WHERE clause](iot-hub-devguide-query-language.md#where-clause) section for the full reference of the filtering capabilities.

Grouping is also supported. For example, the following query returns the count of devices in each telemetry configuration status:

```sql
SELECT properties.reported.telemetryConfig.status AS status,
    COUNT() AS numberOfDevices
  FROM devices
  GROUP BY properties.reported.telemetryConfig.status
```

This grouping query would return a result similar to the following example:

```json
[
    {
        "numberOfDevices": 3,
        "status": "Success"
    },
    {
        "numberOfDevices": 2,
        "status": "Pending"
    },
    {
        "numberOfDevices": 1,
        "status": "Error"
    }
]
```

In this example, three devices reported successful configuration, two are still applying the configuration, and one reported an error.

Projection queries allow developers to return only the properties they care about. For example, to retrieve the last activity time along with the device ID of all enabled devices that are disconnected, use the following query:

```sql
SELECT DeviceId, LastActivityTime FROM devices WHERE status = 'enabled' AND connectionState = 'Disconnected'
```

The result of that query would look like the following example:

```json
[
  {
    "deviceId": "AZ3166Device",
    "lastActivityTime": "2021-05-07T00:50:38.0543092Z"
  }
]
```

## Module twin queries

Querying on module twins is similar to querying on device twins, but using a different collection/namespace; instead of from **devices**, you query from **devices.modules**:

```sql
SELECT * FROM devices.modules
```

We don't allow join between the devices and devices.modules collections. If you want to query module twins across devices, you do it based on tags. The following query returns all module twins across all devices with the scanning status:

```sql
SELECT * FROM devices.modules WHERE properties.reported.status = 'scanning'
```

The following query returns all module twins with the scanning status, but only on the specified subset of devices:

```sql
SELECT * FROM devices.modules
  WHERE properties.reported.status = 'scanning'
  AND deviceId IN ['device1', 'device2']
```

## Twin query limitations

> [!IMPORTANT]
> Query results are eventually consistent operations and delays of up to 30 minutes should be tolerated. In most instances, twin query returns results in the order of a few seconds. IoT Hub strives to provide low latency for all operations. However, due to network conditions and other unpredictable factors it cannot guarantee a certain latency. 

An alternative option to twin queries is to query individual device twins by ID by using the [get twin REST API](/java/api/com.microsoft.azure.sdk.iot.device.devicetwin). This API always returns the latest values and has higher throttling limits. You can issue the REST API directly or use the equivalent functionality in one of the [Azure IoT Hub Service SDKs](iot-hub-devguide-sdks.md#azure-iot-hub-service-sdks).

Query expressions can have a maximum length of 8192 characters.

Currently, comparisons are supported only between primitive types (no objects), for instance `... WHERE properties.desired.config = properties.reported.config` is supported only if those properties have primitive values.

We recommend to not take a dependency on lastActivityTime found in Device Identity Properties for Twin Queries for any scenario. This field does not guarantee an accurate gauge of device status. Instead, please use IoT Device Lifecycle events to manage device state and activities.  More information on how to use IoT Hub Lifecycle events in your solution, please visit [React to IoT Hub events by using Event Grid to trigger actions](./iot-hub-event-grid.md).


> [!Note]
> Avoid making any assumptions about the maximum latency of this operation.  Please refer to [Latency Solutions](./iot-hub-devguide-quotas-throttling.md) for more information on how to build your solution taking latency into account.

## Next steps

* Understand the basics of the [IoT Hub query language](iot-hub-devguide-query-language.md)
---
title: Use the REST API to query devices in Azure IoT Central
description: How to use the IoT Central REST API to query devices in an application
author: dominicbetts
ms.author: dobett
ms.date: 06/14/2022
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to query devices

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to query devices in your IoT Central application. The following are examples of how you can use the query REST API:

- Get the last 10 telemetry values reported by a device.
- Get the last 24 hours of data from devices that are in the same room. Room is a device or cloud property.
- Find all devices that are in an error state and have outdated firmware.
- Telemetry trends from devices, averaged in 10-minute windows.
- Get the current firmware version of all your thermostat devices.

This article describes how to use the `/query` API to query devices.

A device can group the properties, telemetry, and commands it supports into _components_ and _modules_.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

> [!IMPORTANT]
> Support for property queries is now deprecated in the IoT Central REST API and will be removed from the existing API releases.

[!INCLUDE [iot-central-postman-collection](../../../includes/iot-central-postman-collection.md)]

To learn how to query devices by using the IoT Central UI, see [How to use data explorer to analyze device data.](../core/howto-create-analytics.md)

## Run a query

Use the following request to run a query:

```http
POST https://{your app subdomain}.azureiotcentral.com/api/query?api-version=2022-10-31-preview
```

The query is in the request body and looks like the following example:

```json
{
  "query": "SELECT $id, $ts, temperature, humidity FROM dtmi:azurertos:devkit:hlby5jgib2o WHERE WITHIN_WINDOW(P1D)"
}
```

The `dtmi:azurertos:devkit:hlby5jgib2o` value in the `FROM` clause is a *device template ID*. To find a device template ID, navigate to the **Devices** page in your IoT Central application and hover over a device that uses the template. The card includes the device template ID:

:::image type="content" source="media/howto-query-with-rest-api/show-device-template-id.png" alt-text="Screenshot that shows how to find the device template ID in the page URL.":::

The response includes telemetry from multiple devices that share the same device template. The response to this request looks like the following example:

```json
{
  "results": [
    {
      "$id": "sample-003",
      "$ts": "2021-09-10T12:59:52.015Z",
      "temperature": 47.632160152311016,
      "humidity": 49.726422005390816
    },
    {
      "$id": "sample-001",
      "$ts": "2021-09-10T13:01:34.286Z",
      "temperature": 58.898120617808495,
      "humidity": 44.66125772328022
    },
    {
      "$id": "sample-001",
      "$ts": "2021-09-10T13:04:04.96Z",
      "temperature": 52.79601469228174,
      "humidity": 71.5067230188416
    },
    {
      "$id": "sample-002",
      "$ts": "2021-09-10T13:04:36.877Z",
      "temperature": 49.610062789623264,
      "humidity": 52.78538601804491
    }
  ]
}
```

## Syntax

The query syntax is similar to SQL syntax and is made up of the following clauses:

- `SELECT` is required and defines the data you want to retrieve, such as the device telemetry values.
- `FROM` is required and identifies the device type you're querying. This clause specifies the device template ID.
- `WHERE` is optional and lets you filter the results.
- `ORDER BY` is optional and lets you sort the results.
- `GROUP BY` is optional and lets you aggregate results.

The following sections describe these clauses in more detail.

## SELECT clause

> [!IMPORTANT]
> Support for property queries is now deprecated in the IoT Central REST API and will be removed from the existing API releases.

The `SELECT` clause lists the data values to include in the query output and can include the following items:

- Telemetry. Use the telemetry names from the device template.
- Reported properties. Use the property names from the device template.
- Cloud properties. Use the cloud property names from the device template.
- `$id`. The device ID.
- `$provisioned`. A boolean value that shows if the device is provisioned yet.
- `$simulated`. A boolean value that shows if the device is a simulated device.
- `$ts`. The timestamp associated with a telemetry value.

If your device template uses components such as the **Device information** component, then you reference telemetry or properties defined in the component as follows:

```json
{
  "query": "SELECT deviceInformation.model, deviceInformation.swVersion FROM dtmi:azurertos:devkit:hlby5jgib2o"
}
```

You can find the component name in the device template:

:::image type="content" source="media/howto-query-with-rest-api/show-component-name.png" alt-text="Screenshot that shows how to find the component name." lightbox="media/howto-query-with-rest-api/show-component-name.png":::

The following limits apply in the `SELECT` clause:

- There's no wildcard operator.
- You can't have more than 15 items in the select list.
- In a single query, you either select telemetry or properties but not both. A property query can include both reported properties and cloud properties.
- A property-based query returns a maximum of 1,000 records.
- A telemetry-based query returns a maximum of 10,000 records.  

### Aliases

Use the `AS` keyword to define an alias for an item in the `SELECT` clause. The alias is used in the query output. You can also use it elsewhere in the query. For example:

```json
{
  "query": "SELECT $id as ID, $ts as timestamp, temperature as t, pressure as p FROM dtmi:azurertos:devkit:hlby5jgib2o WHERE WITHIN_WINDOW(P1D) AND t > 0 AND p > 50"
}
```

> [!TIP]
> You can't use another item in the select list as an alias. For example, the following isn't allowed `SELECT id, temp AS id...`.

The result looks like the following output:

```json
{
  "results": [
    {
      "ID": "sample-002",
      "timestamp": "2021-09-10T11:40:29.188Z",
      "t": 40.20355053736378,
      "p": 79.26806508746755
    },
    {
      "ID": "sample-001",
      "timestamp": "2021-09-10T11:43:42.61Z",
      "t": 68.03536237975348,
      "p": 58.33517075380311
    }
  ]
}
```

### TOP

Use the `TOP` to limit the number of results the query returns. For example, the following query returns the first 10 results:

```json
{
    "query": "SELECT TOP 10 $id as ID, $ts as timestamp, temperature, humidity FROM dtmi:azurertos:devkit:hlby5jgib2o"
}
```

If you don't use `TOP`, the query returns a maximum of 10,000 results for a telemetry-based query and a maximum of 1,000 results for a property-based query.

To sort the results before `TOP` limits the number of results, use [ORDER BY](#order-by-clause).

## FROM clause

The `FROM` clause must contain a device template ID. The `FROM` clause specifies the type of device you're querying.

To find a device template ID, navigate to the **Devices** page in your IoT Central application and hover over a device that uses the template. The card includes the device template ID:

:::image type="content" source="media/howto-query-with-rest-api/show-device-template-id.png" alt-text="Screenshot that shows how to find the device template ID on the devices page." lightbox="media/howto-query-with-rest-api/show-device-template-id.png":::

You can also use the [Devices - Get](/rest/api/iotcentral/2022-07-31dataplane/devices/get) REST API call to get the device template ID for a device.

## WHERE clause

The `WHERE` clause lets you use values and time windows to filter the results:

### Time windows

To get telemetry received by your application within a specified time window, use `WITHIN_WINDOW` as part of the `WHERE` clause. For example, to retrieve temperature and humidity telemetry for the last day use the following query:

```json
{
  "query": "SELECT $id, $ts, temperature, humidity FROM dtmi:azurertos:devkit:hlby5jgib2o WHERE WITHIN_WINDOW(P1D)"
}
```

The time window value uses the [ISO 8601 durations format](https://en.wikipedia.org/wiki/ISO_8601#Durations). The following table includes some examples:

| Example | Description                |
| ------- | -------------------------- |
| PT10M   | Past 10 minutes           |
| P1D     | Past day                   |
| P2DT12H | Past 2 days and 12 hours |
| P1W     | Past week                  |
| PT5H    | Past five hours            |
| '2021-06-13T13:00:00Z/2021-06-13T15:30:00Z' | Specific time range |

> [!NOTE]
> You can only use time windows when you're querying for telemetry.

### Value comparisons

> [!IMPORTANT]
> Support for property queries is now deprecated in the IoT Central REST API and will be removed from the existing API releases.

You can get telemetry or property values based on specific values. For example, the following query returns all messages where the temperature is greater than zero, the pressure is greater than 50, and the device ID is one of **sample-002** and **sample-003**:

```json
{
  "query": "SELECT $id, $ts, temperature AS t, pressure AS p FROM dtmi:azurertos:devkit:hlby5jgib2o WHERE WITHIN_WINDOW(P1D) AND t > 0 AND p > 50 AND $id IN ['sample-002', 'sample-003']"
}
```

The following operators are supported:

- Logical operators `AND` and `OR`.
- Comparison operators `=`, `!=`, `>`, `<`, `>=`, `<=`, `<>`, and `IN`.

> [!NOTE]
> The `IN` operator only works with telemetry and `$id`.

The following limits apply in the `WHERE` clause:

- You can use a maximum of 10 operators in a single query.
- In a telemetry query, the `WHERE` clause can only contain telemetry and device metadata filters.
- In a property query, the `WHERE` clause can only contain reported properties, cloud properties, and device metadata filters.
- In a telemetry query, you can retrieve up to 10,000 records.
- In property query, you can retrieve up to 1,000 records.

## Aggregations and GROUP BY clause

Aggregation functions let you calculate values such as average, maximum, and minimum on telemetry data within a time window. For example, the following query calculates average temperature and humidity from device `sample-001` in 10-minute windows:

```json
{
  "query": "SELECT AVG(temperature), AVG(pressure) FROM dtmi:azurertos:devkit:hlby5jgib2o WHERE WITHIN_WINDOW(P1D) AND $id='{{DEVICE_ID}}' GROUP BY WINDOW(PT10M)"
}
```

The results look like the following output:

```json
{
    "results": [
        {
            "$ts": "2021-09-14T11:40:00Z",
            "avg_temperature": 49.212146114456104,
            "avg_pressure": 48.590304135023764
        },
        {
            "$ts": "2021-09-14T11:30:00Z",
            "avg_temperature": 52.44844454703927,
            "avg_pressure": 52.25973211022142
        },
        {
            "$ts": "2021-09-14T11:20:00Z",
            "avg_temperature": 50.14626272506926,
            "avg_pressure": 48.98400386898757
        }
    ]
}
```

The following aggregation functions are supported: `SUM`, `MAX`, `MIN`, `COUNT`, `AVG`, `FIRST`, and `LAST`.

Use `GROUP BY WINDOW` to specify the window size. If you don't use `GROUP BY WINDOW`, the query aggregates the telemetry over the last 30 days.

> [!NOTE]
> You can only aggregate telemetry values.

## ORDER BY clause

The `ORDER BY` clause lets you sort the query results by a telemetry value, the timestamp, or the device ID. You can sort in ascending or descending order. For example, the following query returns the most recent results first:

```json
{
  "query": "SELECT $id as ID, $ts as timestamp, temperature, humidity FROM dtmi:azurertos:devkit:hlby5jgib2o ORDER BY timestamp DESC"
}
```

> [!TIP]
> Combine `ORDER BY` with `TOP` to limit the number of results the query returns after sorting.

## Limits

The current limits for queries are:

- No more than 15 items in the `SELECT` clause list.
- No more than 10 logical operations in the `WHERE` clause.
- The maximum length of a query string is 350 characters.
- You can't use the wildcard (`*`) in the `SELECT` clause list.
- Telemetry-based queries can retrieve up to 10,000 records.
- Property-based queries can retrieve up to 1,000 records.

## Next steps

Now that you've learned how to query devices with the REST API, a suggested next step is to learn [How to use the IoT Central REST API to manage users and roles](howto-manage-users-roles-with-rest-api.md).

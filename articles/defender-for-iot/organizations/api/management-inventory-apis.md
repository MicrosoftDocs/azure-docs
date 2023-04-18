---
title: Inventory management API reference for on-premises management consoles - Microsoft Defender for IoT
description: Learn about the inventory management REST APIs supported for Microsoft Defender for IoT on-premises management consoles.
ms.date: 06/13/2022
ms.topic: reference
---

# Inventory management API reference for on-premises management consoles

This article lists the inventory management REST APIs supported for Microsoft Defender for IoT on-premises management consoles

## devices (Retrieve all device information)

This API requests a list of all devices detected by Defender for IoT sensors that are connected to an on-premises management console.

**URI**: `/external/v1/devices`

### GET

# [Request](#tab/appliances-get-request)

**Query parameters**:

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**authorized**     |  Boolean. Filters by whether the device is authorized or not.   | `/external/v1/devices?authorized=true` <br><br>`/external/v1/devices?authorized=false`| Optional |
|**siteId**     | Comma separated list of long integers. Filter devices for specified sites by site ID.       | `/external/v1/devices?siteId=1,2`| Optional |
|**zoneId**     |Comma separated list of long integers. Filter devices for specified zones by zone ID.        | `/external/v1/devices?zoneId=5,6` | Optional |
|**sensorId**     | Comma separated list of long integers. Filter devices for specified sensors by sensor ID.        | `/external/v1/devices?sensorId=8`| Optional |

> [!TIP]
> If you don't have a site, zone, or sensor ID, query all devices first to retrieve these values.
>

# [Response](#tab/devices-get-response)

**Type**: JSON

Array of JSON objects that represent devices.

**Device fields**

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **id** | Long integer | Not nullable | Device ID on the on-premises management console |
| **sensorId** | Long integer | Not nullable | Device ID on the sensor |
| **zoneId** | Long integer | Not nullable | The device's zone ID |
| **siteId** | Long integer | Not nullable | The device's site ID |
| **ipAddresses** | JSON array of strings | Nullable | JSON array of IP addresses. Each device can have multiple addresses in case of internet addresses or a device with multiple NICs. |
| **name** | String | Not nullable  | The device name. |
| **type** | String | Not nullable  | The device type. For more information see [Supported `type` values](sensor-inventory-apis.md#supported-type-values).|
| **macAddresses** | JSON array of strings | Nullable | JSON array of MAC addresses. Devices with multiple NICs can have multiple addresses. |
| **operatingSystem** | String | Nullable | The device operating system.|
| **engineeringStation** | Boolean | Not nullable | `True` or `false` |
| **scanner** | Boolean | Not nullable | `True` or `false` |
| **authorized** | Boolean | Not nullable | `True` or `false` |
| **vendor** | String | Nullable | The device vendor.|
| **Protocols** | JSON array | Nullable | JSON array of protocol objects. For more information, see [Protocol fields](#protocol-fields). |
| **firmware** | JSON array | Nullable | JSON array of firmware objects. For more information, see [Firmware fields](#firmware-fields). |


### Protocol fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **Name** | String | Not nullable | The protocol name |
| **Addresses** | JSON array of protocol addresses | Not nullable | `Master`, `N/A`, or a numeric representation of the protocol address |

### Firmware fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **serial** | String | Not nullable | `N/A`, or the firmware serial number |
| **model** | String | Not nullable | `N/A`, or the firmware model |
| **firmwareVersion** | Double | Not nullable | `N/A`, or the firmware version |
| **additionalData** | String | Not nullable | `N/A` or additional, vendor-specific firmware data |
| **moduleAddress** | String | Not nullable | `N/A`, or the firmware module address |
| **rack** | String | Not nullable | `N/A`, or the firmware rack |
| **slot** | String | Not nullable | `N/A`, or the firmware slot |
| **address** | String | Not nullable | `N/A`, or the firmware address |

### Response example

```rest
[

    {

    "sensorId": 7,

    "zoneId": 1,

    "siteId": 1,

    "vendor": null,

    "name": "10.4.14.102",

    "firmware": [

    {

        "slot": "N/A",

        "additionalData": "N/A",

        "moduleAddress": "Network: Local network (0), Node: 0, Unit: CPU (0x0)",

        "rack": "N/A",

        "address": "10.4.14.102",

        "model": "AAAAAAAAAA",

        "serial": "N/A",

        "firmwareVersion": "20.55"

    },

    {

        "slot": "N/A",

        "additionalData": "N/A",

        "moduleAddress": "Network: Local network (0), Node: 0, Unit: Unknown (0x3)",

        "rack": "N/A",

        "address": "10.4.14.102",

        "model": "AAAAAAAAAAAAAAAAAAAA",

        "serial": "N/A",

        "firmwareVersion": "20.55"

    },

    {

        "slot": "N/A",

        "additionalData": "N/A",

        "moduleAddress": "Network: Local network (0), Node: 3, Unit: CPU (0x0)",

        "rack": "N/A",

        "address": "10.4.14.102",

        "model": "AAAAAAAAAAAAAAAAAAAA",

        "serial": "N/A",

        "firmwareVersion": "20.55"

    },

    {

        "slot": "N/A",

        "additionalData": "N/A",

        "moduleAddress": "Network: 3, Node: 0, Unit: CPU (0x0)",

        "rack": "N/A",

        "address": "10.4.14.102",

        "model": "AAAAAAAAAAAAAAAAAAAA",

        "serial": "N/A",

        "firmwareVersion": "20.55"

    }

],

"id": 79,

"macAddresses": null,

"authorized": true,

"ipAddresses": [

    "10.4.14.102"

],

"engineeringStation": false,

"type": "PLC",

"operatingSystem": null,

"protocols": [

    {

        "addresses": [],

        "id": 62,

        "name": "Omron FINS"

    }

],

"scanner": false

}

]
```

# [cURL command](#tab/devices-get-curl)

**Type**: GET

**APIs**:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/external/v1/devices?siteId=&zoneId=&sensorId=&uthorized='
```

**Example**:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https://127.0.0.1/external/v1/devices?siteId=1&zoneId=2&sensorId=5&authorized=true'
```

---

## Next steps

For more information, see the [Defender for IoT API reference overview](../references-work-with-defender-for-iot-apis.md).

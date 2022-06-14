---
title: Inventory management API reference for on-premises management consoles - Microsoft Defender for IoT
description: Learn about the inventory management REST APIs supported for Microsoft Defender for IoT on-premises management consoles.
ms.date: 06/13/2022
ms.topic: reference
---

# Inventory management API reference for on-premises management consoles

This article lists the inventory management REST APIs supported for Microsoft Defender for IoT on-premises management consoles.

## devices (Retrieve device information per sensor)

Use this API to request a list of all devices that a Defender for IoT sensor has detected.

**URI**: `/api/v1/devices`

### GET

# [Request](#tab/devices-request)

**Query parameters**:


|Name  |Description  |Examples  |
|---------|---------|---------|
|**authorized**     | To filter only authorized and unauthorized devices.        |    `/api/v1/devices?authorized=true`<br>  `/api/v1/devices?authorized=false`
       |

# [Response](#tab/devices-response)

**Type**: JSON

Array of JSON objects that represent devices.

**Device fields**

| Name | Type | Required / Optional | List of values |
|--|--|--|--|
| **id** | Numeric | Required | - |
| **ipAddresses** | JSON array | Optional | IP addresses (can be more than one address in case of internet addresses or a device with dual NICs) |
| **name** | String | Required | - |
| **type** | String | Required | Unknown, Engineering Station, PLC, HMI, Historian, Domain Controller, DB Server, Wireless Access Point, Router, Switch, Server, Workstation, IP Camera, Printer, Firewall, Terminal station, VPN Gateway, Internet, or Multicast and Broadcast |
| **macAddresses** | JSON array | Optional | MAC addresses (can be more than one address in case of a device with dual NICs) |
| **operatingSystem** | String | Optional | - |
| **engineeringStation** | Boolean | Required | True or false |
| **scanner** | Boolean | Required | True or false |
| **authorized** | Boolean | Required | True or false |
| **vendor** | String | Optional | - |
| **protocols** | JSON array | Optional | Protocol object |
| **firmware** | JSON array | Optional | Firmware object |

**Protocol fields**

| Name | Type | Required / Optional | List of values |
|--|--|--|--|
| **Name** | String | Required |  |
| **Addresses** | JSON array | Optional | `Master`, or numeric values |

**Firmware fields**

| Name | Type | Required / Optional | List of values |
|--|--|--|--|
| **serial** | String | Required | N/A, or the actual value |
| **model** | String | Required | N/A, or the actual value |
| **firmwareVersion** | Double | Required | N/A, or the actual value |
| **additionalData** | String | Required | N/A, or the actual value |
| **moduleAddress** | String | Required | N/A, or the actual value |
| **rack** | String | Required | N/A, or the actual value |
| **slot** | String | Required | N/A, or the actual value |
| **address** | String | Required | N/A, or the actual value |

**Response example**

```rest
[
    {
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

# [Curl command](#tab/devices-curl)

**Type**: GET

**APIs**:


```rest
curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices
```

**Example**:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/v1/devices?authorized=true
```
---

## devices (Retrieve all device information)


This API requests a list of all devices detected by Defender for IoT sensors that are connected to an on-premises management console.

**URI**: `/external/v1/devices`

### GET

# [Response](#tab/devices-get-response)

**Type**: JSON

Array of JSON objects that represent devices.


|Name  |Description  | Example |
|---------|---------|---------|
|**authorized**     |  To filter only authorized and unauthorized devices.       | `/external/v1/devices?authorized=true` <br><br>`/external/v1/devices?authorized=false`|
|**siteId**     |  To filter only devices related to specific sites.       | `/external/v1/devices?siteId=1,2`|
|**zoneId**     |To filter only devices related to specific zones. <sup>[1](#1)</sup>         | `/external/v1/devices?zoneId=5,6` |
|**sensorId**     | To filter only devices detected by specific sensors. <sup>[1](#1)</sup>        | `/external/v1/devices?sensorId=8`|

> [!NOTE]
> <a id="1">1</a> You might not have the site and zone ID. If this is the case, query all devices to retrieve the site and zone ID.*
>

**Device fields**

| Name | Type | Required / Optional | List of values |
|--|--|--|--|
| **sensorId** | Numeric | Required | - |
| **zoneId** | Numeric | Optional | - |
| **siteId** | Numeric | Optional | - |
| **ipAddresses** | JSON array | Optional | IP addresses (can be more than one address in case of internet addresses or a device with dual NICs) |
| **name** | String | Required | - |
| **type** | String | Required | Unknown, Engineering Station, PLC, HMI, Historian, Domain Controller, DB Server, Wireless Access Point, Router, Switch, Server, Workstation, IP Camera, Printer, Firewall, Terminal station, VPN Gateway, Internet, or Multicast and Broadcast |
| **macAddresses** | JSON array | Optional | MAC addresses (can be more than one address in case of a device with dual NICs) |
| **operatingSystem** | String | Optional | - |
| **engineeringStation** | Boolean | Required | True or false |
| **scanner** | Boolean | Required | True or false |
| **authorized** | Boolean | Required | True or false |
| **vendor** | String | Optional | - |
| **Protocols** | JSON array | Optional | Protocol object |
| **firmware** | JSON array | Optional | Firmware object |

**Protocol fields**

| Name | Type | Required / Optional | List of values |
|--|--|--|--|
| **Name** | String | Required | - |
| **Addresses** | JSON array | Optional | `Master`, or numeric values |

**Firmware fields**

| Name | Type | Required / Optional | List of values |
|--|--|--|--|
| **serial** | String | Required | N/A, or the actual value |
| **model** | String | Required | N/A, or the actual value |
| **firmwareVersion** | Double | Required | N/A, or the actual value |
| **additionalData** | String | Required | N/A, or the actual value |
| **moduleAddress** | String | Required | N/A, or the actual value |
| **rack** | String | Required | N/A, or the actual value |
| **slot** | String | Required | N/A, or the actual value |
| **address** | String | Required | N/A, or the actual value |

**Response example**:

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

# [Curl command](#tab/devices-get-curl)

**Type**: GET

**APIs**:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<>IP_ADDRESS>/external/v1/devices?siteId=&zoneId=&sensorId=&authorized='
```

**Example**:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https://127.0.0.1/external/v1/devices?siteId=1&zoneId=2&sensorId=5&authorized=true'
```

---

## Next steps

For more information, see the [Defender for IoT API reference overview](../references-work-with-defender-for-iot-apis.md).

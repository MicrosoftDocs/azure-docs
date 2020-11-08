---
title: Retrieve asset information
description: This API requests a list of all assets detected by CyberX Sensors connected to a Central Manager.
author: mlottner
ms.author: mlottner
ms.date: 08/31/2020
ms.topic: article
ms.service: azure
---

# Retrieve asset information

This API requests a list of all assets detected by CyberX Sensors connected to a Central Manager.

## /external/v1/devices

### Method

**GET**

### Response type

**JSON**

### Response content

Array of JSON Objects representing assets.

### Query params

- **authorized** - to filter only authorized / unauthorized devices

- **siteId** - to filter only devices related to specific sites.

- **zoneId** - to filter only devices related to specific zones. *

- **sensorId** - to filter only devices detected by specific sensors. *

* *You may not have the Site and zone ID. If this is the case, query all devices to retrieve the Site and Zone ID.*

### Query params example

`/external/v1/devices?authorized=true`

`/external/v1/devices?authorized=false`

`/external/v1/devices?siteId=1,2`

`/external/v1/devices?zoneId=5,6`

`/external/v1/devices?sensorId=8`

### Asset fields

|                    |            |          |                                                                                                                                                                                                                                                            |
| ------------------ | ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name               | Type       | Nullable | List of Values                                                                                                                                                                                                                                             |
| id                 | Numeric    | No       |                                                                                                                                                                                                                                                            |
| sensorId           | Numeric    | No       |                                                                                                                                                                                                                                                            |
| zoneId             | Numeric    | Yes      |                                                                                                                                                                                                                                                            |
| siteId             | Numeric    | Yes      |                                                                                                                                                                                                                                                            |
| ipAddresses        | JSON array | Yes      | IP Addresses (can be more than one address in case of internet addresses or a device with dual NIC)                                                                                                                                                        |
| name               | String     | No       |                                                                                                                                                                                                                                                            |
| type               | String     | No       | Unknown / Engineering Station / PLC / HMI / Historian / Domain Controller / DB Server / Wireless Access Point / Router / Switch / Server / Workstation / IP Camera / Printer / Firewall / Terminal station / VPN Gateway / Internet / Multicast\Broadcast |
| macAddresses       | JSON array | Yes      | MAC Addresses (can be more than one address in case of a device with dual NIC)                                                                                                                                                                             |
| operatingSystem    | String     | Yes      |                                                                                                                                                                                                                                                            |
| engineeringStation | Boolean    | No       | true/false                                                                                                                                                                                                                                                 |
| scanner            | Boolean    | No       | true/false                                                                                                                                                                                                                                                 |
| authorized         | Boolean    | No       | true/false                                                                                                                                                                                                                                                 |
| vendor             | String     | Yes      |                                                                                                                                                                                                                                                            |
| Protocols          | JSON array | Yes      | Protocol object                                                                                                                                                                                                                                            |
| firmware           | JSON array | Yes      | Firmware object                                                                                                                                                                                                                                            |

### Protocol fields

|           |            |          |                         |
| --------- | ---------- | -------- | ----------------------- |
| Name      | Type       | Nullable | List Of Values          |
| Name      | String     | No       |                         |
| Addresses | JSON Array | Yes      | Master / Numeric values |

### Firmware fields

|                 |        |          |                        |
| --------------- | ------ | -------- | ---------------------- |
| Name            | Type   | Nullable | List Of Values         |
| serial          | String | No       | N/A / The actual value |
| model           | String | No       | N/A / The actual value |
| firmwareVersion | Double | No       | N/A / The actual value |
| additionalData  | String | No       | N/A / The actual value |
| moduleAddress   | String | No       | N/A / The actual value |
| rack            | String | No       | N/A / The actual value |
| slot            | String | No       | N/A / The actual value |
| address         | String | No       | N/A / The actual value |

## Response example

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
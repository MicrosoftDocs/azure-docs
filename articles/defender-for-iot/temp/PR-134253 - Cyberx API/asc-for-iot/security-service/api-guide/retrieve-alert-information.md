---
title: Retrieve alert information
description: Use this API to request a list of all the alerts detected by the CyberX sensor.
author: mlottner
ms.author: mlottner
ms.date: 08/31/2020
ms.topic: article
ms.service: azure
---

# Retrieve alert information

Use this API to request a list of all the alerts detected by the CyberX sensor.

## /api/v1/alerts

### Method

**GET**

### Query params

- *state* - to filter only handled / unhandled alerts

**Example**:

`/api/v1/alerts?state=handled`

- *fromTime* - to filter alerts created from a specific time (in milliseconds, UTC)

**Example**:

`/api/v1/alerts?fromTime=<epoch>`

- *toTime* - to filter alerts created only before a specific time (in milliseconds, UTC)

**Example**:

`/api/v1/alerts?toTime=<epoch>`

- *type* - to filter alerts by a specific type. Existing types to filter by: unexpected_new_devices / disconnections

**Example**:

`/api/v1/alerts?type=disconnections`

### Response type

**JSON**

### Response content

Array of JSON Objects representing alerts.

### Alert fields

|                       |                              |          |                                                                         |
| --------------------- | ---------------------------- | -------- | ----------------------------------------------------------------------- |
| Name                  | Type                         | Nullable | List Of Values                                                          |
| id                    | Numeric                      | No       |                                                                         |
| time                  | Numeric                      | No       | Epoch (UTC)                                                             |
| title                 | String                       | No       |                                                                         |
| message               | String                       | No       |                                                                         |
| severity              | String                       | No       | Warning / Minor / Major / Critical                                      |
| engine                | String                       | No       | Protocol Violation / Policy Violation / Malware / Anomaly / Operational |
| sourceDevice          | Numeric                      | Yes      | Device id                                                               |
| destinationDevice     | Numeric                      | Yes      | Device id                                                               |
| additionalInformation | Additional Information Obect | Yes      |                                                                         |

### Additional information fields

|             |            |          |                |
| ----------- | ---------- | -------- | -------------- |
| Name        | Type       | Nullable | List Of Values |
| description | String     | No       |                |
| information | JSON Array | No       | String         |

## Response example

```rest
[

    {
    
        "engine": "Policy Violation",
        
        "severity": "Major",
        
        "title": "Internet Access Detected",
        
        "additionalinformation": {
        
            "information": [
            
                "170.60.50.201 over port BACnet (47808)"
            
            ],
            
            "description": "External Addresses"
        
        },
    
        "sourceDevice": null,
        
        "destinationDevice": null,
        
        "time": 1509881077000,
        
        "message": "Device 192.168.0.13 tried to access an external IP address which is an address in the Internet and is not allowed by policy. It is recommended to notify the security officer of the incident.",
        
        "id": 1
    
    },
    
    {
    
        "engine": "Protocol Violation",
        
        "severity": "Major",
        
        "title": "Illegal MODBUS Operation (Exception Raised by Master)",
        
        "sourceDevice": 3,
        
        "destinationDevice": 4,
        
        "time": 1505651605000,
        
        "message": "A MODBUS master 192.168.110.131 attempted to initiate an illegal operation.\nThe operation is considered to be illegal since it incorporated function code \#129 which should not be used by a master.\nIt is recommended to notify the security officer of the incident.",
        
        "id": 2,
        
        "additionalInformation": null,
    
    }

]

```
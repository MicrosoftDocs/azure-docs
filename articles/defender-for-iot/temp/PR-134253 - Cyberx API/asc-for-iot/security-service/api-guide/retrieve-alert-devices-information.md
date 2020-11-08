---
title: Retrieve alert information
description: Use this API to retrieve all or filtered alerts from a Central Manager.
author: mlottner
ms.author: mlottner
ms.date: 08/31/2020
ms.topic: article
ms.service: azure
---

# Retrieve alert information

Use this API to retrieve all or filtered alerts from a Central Manager.

## /external/v1/alerts

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

- **siteId:** The site on which the alert was discovered. *

- **zoneId**: The zone on which the alert was discovered. *

- **sensor**: The Sensor on which the alert was discovered.

&#42; *You may not have the Site and zone ID. If this is the case, query all devices to retrieve the Site and Zone ID.*

## Alert fields

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

## Additional information fields

|             |            |          |                |
| ----------- | ---------- | -------- | -------------- |
| Name        | Type       | Nullable | List Of Values |
| description | String     | No       |                |
| information | JSON Array | No       | String         |

## Response example

```rest
[

    {
    
        "engine": "Operational",
        
        "handled": false,
        
        "title": "Traffic Detected on Sensor Interface",
        
        "additionalInformation": null,
        
        "sourceDevice": 0,
        
        "zoneId": 1,
        
        "siteId": 1,
        
        "time": 1594808245000,
        
        "sensorId": 1,
        
        "message": "The sensor resumed detecting network traffic on ens224.",
        
        "destinationDevice": 0,
        
        "id": 1,
        
        "severity": "Warning"
    
    },
    
    {
    
        "engine": "Anomaly",
        
        "handled": false,
        
        "title": "Address Scan Detected",
        
        "additionalInformation": null,
        
        "sourceDevice": 4,
        
        "zoneId": 1,
        
        "siteId": 1,
        
        "time": 1594808260000,
        
        "sensorId": 1,
        
        "message": "Address scan detected.\nScanning address: 10.10.10.22\nScanned subnet: 10.11.0.0/16\nScanned addresses: 10.11.1.1, 10.11.20.1, 10.11.20.10, 10.11.20.100, 10.11.20.2, 10.11.20.3, 10.11.20.4, 10.11.20.5, 10.11.20.6, 10.11.20.7...\nIt is recommended to notify the security officer of the incident.",
        
        "destinationDevice": 0,
        
        "id": 2,
        
        "severity": "Critical"
    
    },
    
    {
    
        "engine": "Operational",
        
        "handled": false,
        
        "title": "Suspicion of Unresponsive MODBUS Device",
        
        "additionalInformation": null,
        
        "sourceDevice": 194,
        
        "zoneId": 1,
        
        "siteId": 1,
        
        "time": 1594808285000,
        
        "sensorId": 1,
        
        "message": "Outstation device 10.13.10.1 (Protocol Address 53) seems to be unresponsive to MODBUS requests.",
        
        "destinationDevice": 0,
        
        "id": 3,
        
        "severity": "Minor"
    
    }
  
]
```

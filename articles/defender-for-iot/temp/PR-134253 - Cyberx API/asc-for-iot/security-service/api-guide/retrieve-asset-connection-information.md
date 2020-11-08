---
title: Retrieve asset connection information
description: Use this API to request a list of all the connections per asset.
author: mlottner
ms.author: mlottner
ms.date: 08/31/2020
ms.topic: article
ms.service: azure
---

# Retrieve asset connection information

Use this API to request a list of all the connections per asset.

## /api/v1/devices/connections

### Method

**GET**

### Query params

- Without setting the query parameters all the asset connections are returned.

**Example**:

`/api/v1/devices/connections`

- *deviceId* - Filter by a specific asset ID, to view its connections.

**Example**:

`/api/v1/devices/<deviceId>/connections`

- *lastActiveInMinutes* - Time frame from now backwards, by minute, during which the connections were active.

**Example**:

`/api/v1/devices/2/connections?lastActiveInMinutes=20`

- *discoveredBefore*- Filter only connections that were detected before a specific time (in milliseconds, UTC).

**Example**:

`/api/v1/devices/2/connections?discoveredBefore=<epoch>`

- *discoveredAfter*- Filter only connections that were detected after a specific time (in milliseconds, UTC).

**Example**:

`/api/v1/devices/2/connections?discoveredAfter=<epoch>`

### Response type

**JSON**

### Response content

Array of JSON Objects representing asset connections.

### Fields

|                |              |          |                |
| -------------- | ------------ | -------- | -------------- |
| Name           | Type         | Nullable | List Of Values |
| firstDeviceId  | Numeric      | No       |                |
| secondDeviceId | Numeric      | No       |                |
| lastSeen       | Numeric      | No       | Epoch (UTC)    |
| discovered     | Numeric      | No       | Epoch (UTC)    |
| ports          | Number Array | No       |                |
| protocols      | JSON Array   | No       | Protocol Field |

### Protocol field

|          |              |          |                |
| -------- | ------------ | -------- | -------------- |
| Name     | Type         | Nullable | List Of Values |
| name     | String       | No       |                |
| commands | String Array | No       |                |

## Response example

```rest
[

    {
    
        "firstDeviceId": 171,
        
        "secondDeviceId": 22,
        
        "lastSeen": 1511281457933,
        
        "discovered": 1511872830000,
        
        "ports": [
        
            502
        
        ],
    
        "protocols": [
        
        {
        
            name: "modbus",
            
            commands: [
            
                "Read Coils"
        
            ]
        
        },
    
        {
        
            name: "ams",
            
            commands: [
            
                "AMS Write"
        
            ]
        
        },
    
        {
        
            name: "http",
            
            commands: [
        
            ]
        
        }
    
    ]
    
    },
    
    {
    
        "firstDeviceId": 171,
        
        "secondDeviceId": 23,
        
        "lastSeen": 1511281457933,
        
        "discovered": 1511872830000,
        
        "ports": [
        
            502
        
        ],
        
        "protocols": [
        
            {
            
                name: "s7comm",
                
                commands: [
                
                    "Download block",
                    
                    "Upload"
            
                ]
            
            }
        
        ]
    
    }

]
```

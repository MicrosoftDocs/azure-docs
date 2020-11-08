---
title: Retrieve timeline events
description: Use this API to request a list of events reported to the Event Timeline.
author: mlottner
ms.author: mlottner
ms.date: 08/31/2020
ms.topic: article
ms.service: azure
---

# Retrieve timeline events

Use this API to request a list of events reported to the Event Timeline.

## /api/v1/events

### Method

**GET**

### Query params:

- *minutesTimeFrame* - Time frame from now backwards, by minute, in which the events were reported

**Example**:

`/api/v1/events?minutesTimeFrame=20`

- *type* - to filter the events list by a specific type

**Examples**:

`/api/v1/events?type=DEVICE_CONNECTION_CREATED`

`/api/v1/events?type=REMOTE_ACCESS&minutesTimeFrame`

### Response type

**JSON**

### Response content

Array of JSON Objects representing alerts.

### Event fields

|           |         |          |                                                                                                |
| --------- | ------- | -------- | ---------------------------------------------------------------------------------------------- |
| Name      | Type    | Nullable | List Of Values                                                                                 |
| timestamp | Numeric | No       | Epoch (UTC)                                                                                    |
| title     | String  | No       |                                                                                                |
| severity  | String  | No       | INFO / NOTICE / ALERT                                                                          |
| owner     | String  | Yes      | If the event was created manually, this field will include the username that created the event |
| content   | String  | No       |                                                                                                |

## Response example

```rest
[

    {
    
        "severity": "INFO",
        
        "title": "Back to Normal",
        
        "timestamp": 1504097077000,
        
        "content": "Device 10.2.1.15 was found responsive, after being suspected as disconnected",
        
        "owner": null,
        
        "type": "BACK_TO_NORMAL"
    
    },
    
    {
    
        "severity": "ALERT",
        
        "title": "Alert Detected",
        
        "timestamp": 1504096909000,
        
        "content": "Device 10.2.1.15 is suspected to be disconnected (unresponsive).",
        
        "owner": null,
        
        "type": "ALERT_REPORTED"
    
    },
    
    {
    
        "severity": "ALERT",
        
        "title": "Alert Detected",
        
        "timestamp": 1504094446000,
        
        "content": "A DNP3 Master 10.2.1.14 attempted to initiate a request which is not allowed by policy.\nThe policy indicates the allowed function codes, address ranges, point indexes and time intervals.\nIt is recommended to notify the security officer of the incident.",
        
        "owner": null,
        
        "type": "ALERT_REPORTED"
    
    },
    
    {
    
        "severity": "NOTICE",
        
        "title": "PLC Program Update",
        
        "timestamp": 1504094344000,
        
        "content": "Program update detected, sent from 10.2.1.25 to 10.2.1.14",
        
        "owner": null,
        
        "type": "PROGRAM_DEVICE"
    
    }

]

```
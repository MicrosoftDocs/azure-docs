---
title: Retrieve information on CVEs
description: Use this API to request a list of all known CVEs discovered on assets in the network.
author: mlottner
ms.author: mlottner
ms.date: 08/31/2020
ms.topic: article
ms.service: azure
---

# Retrieve information on CVEs

Use this API to request a list of all known CVEs discovered on assets in the network.

## /api/v1/devices/cves

### Method

**GET**

### Query params

- By default, provides the list of all the device IPs with CVEs, up to 100 top scored CVEs for each IP address.

**Example**:

`/api/v1/devices/cves`

- *deviceId* - Filter by a specific device IP address, to get up to 100 top scored CVEs identified on that specific device.

**Example**:

`/api/v1/devices/<ipAddress>/cves`

- *top* - how many top scored CVEs to retrieve for each device IP address.

**Example**:

`/api/v1/devices/cves?top=50`

`/api/v1/devices/<ipAddress>/cves?top=50`

### Response type

**JSON**

### Response content

Array of JSON Objects representing CVEs identified on ip addresses.

### Fields

|              |        |          |                                               |
| ------------ | ------ | -------- | --------------------------------------------- |
| Name         | Type   | Nullable | List Of Values                                |
| cveId        | String | No       |                                               |
| ipAddress    | String | No       | IP Address                                    |
| score        | String | No       | 0.0 - 10.0                                    |
| attackVector | String | No       | Network / Adjacent Network / Local / Physical |
| description  | String | No       |                                               |

## Response example

```rest
[

    {
    
        "cveId": "CVE-2007-0099",
        
        "score": "9.3",
        
        "ipAddress": "10.35.1.51",
        
        "attackVector": "NETWORK",
        
        "description": "Race condition in the msxml3 module in Microsoft XML Core
        
        Services 3.0, as used in Internet Explorer 6 and other
        
        applications, allows remote attackers to execute arbitrary
        
        code or cause a denial of service (application crash) via many
        
        nested tags in an XML document in an IFRAME, when synchronous
        
        document rendering is frequently disrupted with asynchronous
        
        events, as demonstrated using a JavaScript timer, which can
        
        trigger NULL pointer dereferences or memory corruption, aka
        
        \"MSXML Memory Corruption Vulnerability.\""
    
    },
    
    {
    
        "cveId": "CVE-2009-1547",
        
        "score": "9.3",
        
        "ipAddress": "10.35.1.51",
        
        "attackVector": "NETWORK",
        
        "description": "Unspecified vulnerability in Microsoft Internet Explorer 5.01
        
        SP4, 6, 6 SP1, and 7 allows remote attackers to execute
        
        arbitrary code via a crafted data stream header that triggers
        
        memory corruption, aka \"Data Stream Header Corruption
        
        Vulnerability.\""
    
    }

]
```
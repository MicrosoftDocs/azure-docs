---
title: Retrieve operational vulnerabilities
description: Use this API to request general vulnerability assessment results.
author: mlottner
ms.author: mlottner
ms.date: 08/31/2020
ms.topic: article
ms.service: azure
---

# Retrieve operational vulnerabilities

Use this API to request general vulnerability assessment results. This provides insight into the operational status of your network. This assessment is based on general network/system information and not on a specific asset evaluation.

## /api/v1/reports/vulnerabilities/operational

### Method

**GET**

### Response type

**JSON**

### Response content

JSON Object representing assessed results. Each key contains a JSON Array of results.

### Result fields

|                     |                       |            |                        |
| ------------------- | --------------------- | ---------- | ---------------------- |
| Key                 | Field Name            | Type       | List Of Values         |
| backupServer        | source                | String     | IP Address             |
|                     | destination           | String     | IP Address             |
|                     | port                  | Numeric    |                        |
|                     | transport             | String     | TCP / UDP              |
|                     | backupMaximalInterval | String     |                        |
|                     | lastSeenBackup        | Numeric    | Epoch (UTC)            |
| ipNetworks          | addresses             | Numeric    |                        |
|                     | network               | String     | IP Address             |
|                     | mask                  | String     | Subnet mask            |
| protocolProblems    | protocol              | String     |                        |
|                     | addresses             | Json Array | IP Addresses           |
|                     | alert                 | String     |                        |
|                     | reportTime            | Numeric    | Epoch (UTC)            |
| protocolDataVolumes | protocol              | String     |                        |
|                     | volume                | String     | “&lt;volume number&gt; MB” |
| disconnections      | assetAddress          | String     | IP Address             |
|                     | assetName             | String     |                        |
|                     | lastDetectionTime     | Numeric    | Epoch (UTC)            |
|                     | backToNormalTime      | Numeric    | Epoch (UTC)            |

## Response example

```rest
{

    "backupServer": [
    
        {
        
            "backupMaximalInterval": "1 Hour, 29 Minutes",
            
            "source": "10.2.1.22",
            
            "destination": "170.39.2.14",
            
            "port": 10000,
            
            "transport": "TCP",
            
            "lastSeenBackup": 1462645483000
        
        }
    
    ],

    "ipNetworks": [
    
        {
        
            "addresses": "21",
            
            "network": "10.2.1.0",
            
            "mask": "255.255.255.0"
        
        },
        
        {
        
            "addresses": "3",
            
            "network": "170.39.2.0",
            
            "mask": "255.255.255.0"
        
        }
    
    ],

    "protocolProblems": [
    
        {
        
            "protocol": "DNP3",
            
            "addresses": [
            
                "10.2.1.7",
                
                "10.2.1.8"
            
            ],
            
            "alert": "Illegal DNP3 Operation",
            
            "reportTime": 1462645483000
        
        },
        
        {
        
            "protocol": "DNP3",
            
            "addresses": [
            
                "10.2.1.15"
            
            ],
            
            "alert": "Master Requested an Application Layer Confirmation",
            
            "reportTime": 1462645483000
        
        }
        
    ],

    "protocolDataVolumes": [
    
        {
        
            "protocol": "MODBUS (502)",
            
            "volume": "21.07 MB"
        
        },
        
        {
        
            "protocol": "SSH (22)",
            
            "volumn": "0.001 MB"
        
        }
    
    ],
    
    "disconnections": [
    
        {
        
            "assetAddress": "10.2.1.3",
            
            "assetName": "PLC \#3",
            
            "lastDetectionTime": 1462645483000,
            
            "backToNormalTime": 1462645484000
        
        }
    
    ]

}

```

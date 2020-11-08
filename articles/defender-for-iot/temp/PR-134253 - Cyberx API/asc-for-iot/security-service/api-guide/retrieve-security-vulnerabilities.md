---
title: Retrieve security vulnerabilities
description: Use this API to request general vulnerability assessment results.
author: mlottner
ms.author: mlottner
ms.date: 08/31/2020
ms.topic: article
ms.service: azure
---

# Retrieve security vulnerabilities

Use this API to request general vulnerability assessment results. This provides insight your system security level.

This assessment is based on general network/system information and not on a specific asset evaluation.

## /api/v1/reports/vulnerabilities/security

### Method

**GET**

### Response type

**JSON**

### Response content

JSON Object representing assessed results. Each key can be nullable, otherwise, it will contain a JSON object with non-nullable keys.

## Result fields

| Key | Field Name | Type | List Of Values |
| --- | ---------- | ---- | -------------- |
| unauthorizedDevices | address | String | IP Address |
|  | name | String |  |
|  | firstDetectionTime | Numeric | Epoch (UTC) |
|  | lastSeen | Numeric | Epoch (UTC) |
| illegalTrafficByFirewallRules | server | String | IP Address |
|  | client | String | IP Address |
|  | port | Numeric |  |
|  | transport | String | TCP / UDP / ICMP |
| weakFirewallRules | sources | Json array of sources. Each source can be in any of 4 formats | “Any” /<br />“&lt;ip address&gt; (Host)” /<br />“&lt;from ip&gt;-&lt;to ip&gt; (RANGE)” /<br />“&lt;ip address&gt;/&lt;subnet mask&gt; (NETWORK)” |
|  | destinations | Json array of destinations. Each destination can be in any of 4 formats | “Any” /<br />“&lt;ip address&gt; (Host)” /<br />“&lt;from ip&gt;-&lt;to ip&gt; (RANGE)” /<br />“&lt;ip address&gt;/&lt;subnet mask&gt; (NETWORK)” |
|  | ports | Json array of ports in any of 3 formats | “Any” /<br />&lt;port&gt; (&lt;protocol, if detected&gt;)/<br />&lt;from port&gt;-&lt;to port&gt; (&lt;protocol, if detected&gt;) |
| accessPoints | macAddress | String | MAC Address |
|  | vendor | String | Vendor name |
|  | ipAddress | String | IP Address / N/A |
|  | name | String | Device Name / N/A |
|  | wireless | String | No / Suspected / Yes |
| connectionsBetweenSubnets | server | String | IP Address |
|  | client | String | IP Address |
| industrialMalwareIndicators | detectionTime | Numeric | Epoch (UTC) |
|  | alertMessage | String |  |
|  | description | String |  |
|  | assets | Json array | Device names |
| internetConnections | internalAddress | String | IP Address |
|  | authorized | Boolean | Yes / No |
|  | externalAddresses | Json array | IP Adresses |

## Response example

```rest
{

    "unauthorizedDevices": [
    
        {
        
            "address": "10.2.1.14",
            
            "name": "PLC \#14",
            
            "firstDetectionTime": 1462645483000,
            
            "lastSeen": 1462645495000,
        
        }
    
    ],
    
    "redundantFirewallRules": [
    
        {
        
            "sources": "170.39.3.0/255.255.255.0",
            
            "destinations": "Any",
            
            "ports": "102"
        
        }
    
    ],
    
    "connectionsBetweenSubnets": [
    
        {
        
            "server": "10.2.1.22",
            
            "client": "170.39.2.0"
        
        }
    
    ],
    
    "industrialMalwareIndications": [
    
        {
        
            "detectionTime": 1462645483000,
            
            "alertMessage": "Suspicion of Malicious Activity (Regin)",
            
            "description": "Suspicious network activity was detected. Such behavior might be attributed to the Regin malware.",
            
            "addresses": [
            
                "10.2.1.4",
                
                "10.2.1.5"
            
            ]
        
        }
    
    ],
    
    "illegalTrafficByFirewallRules": [
    
        {
        
            "server": "10.2.1.7",
            
            "port": "20000",
            
            "client": "10.2.1.4",
            
            "transport": "TCP"
        
        },
    
        {
        
            "server": "10.2.1.8",
            
            "port": "20000",
            
            "client": "10.2.1.4",
            
            "transport": "TCP"
        
        },
    
        {
        
            "server": "10.2.1.9",
            
            "port": "20000",
            
            "client": "10.2.1.4",
            
            "transport": "TCP"
        
        }
    
    ],
    
    "internetConnections": [
    
        {
        
            "internalAddress": "10.2.1.1",
            
            "authorized": "Yes",
            
            "externalAddresses": ["10.2.1.2",”10.2.1.3”]
        
        }
    
    ],
    
    "accessPoints": [
    
        {
        
            "macAddress": "ec:08:6b:0f:1e:22",
            
            "vendor": "TP-LINK TECHNOLOGIES",
            
            "ipAddress": "173.194.112.22",
            
            "name": "Enterprise AP",
            
            "wireless": "Yes"
        
        }
    
    ],
    
    "weakFirewallRules": [
    
        {
        
            "sources": "170.39.3.0/255.255.255.0",
            
            "destinations": "Any",
            
            "ports": "102"
        
        }
    
    ]

}

```
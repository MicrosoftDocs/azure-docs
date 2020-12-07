---
title: Work with Defender for IoT APIs
description: Defender for IoT allows external systems to access the discovered data and perform actions with that data using external REST API over SSL connections.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/07/2020
ms.topic: reference
ms.service: azure
---

# Overview

Defender for IoT allows external systems to access the discovered data and perform actions with that data using external REST API over SSL connections.

## Getting started

In general, when using an external API on the Defender for IoT sensor or on-premises management console, you need to generate an access token. Tokens are not required for sensor and on-premises management console authentication APIs.

To generate a token:

1. In the **System Settings** window, select **Access Tokens**.
    :::image type="content" source="media/references-work-with-defender-for-iot-apis/access-tokens.png" alt-text="Screenshot of System Settings windows highlighting the access token button.":::

2. Select **Generate new token**.
    :::image type="content" source="media/references-work-with-defender-for-iot-apis/new-token.png" alt-text="Select the button to generate a new token.":::

3. Describe the purpose of the new token and select **Next**.
    :::image type="content" source="media/references-work-with-defender-for-iot-apis/token-name.png" alt-text="Generate a new token and enter the name of the integration associated with it.":::

4. The access token appears. Copy it as it will not be displayed again.
    :::image type="content" source="media/references-work-with-defender-for-iot-apis/token-code.png" alt-text="Copy your access token for your integration.":::

5. Select **Finish**. The tokens you create appear in the Access Tokens dialog box.
    :::image type="content" source="media/references-work-with-defender-for-iot-apis/access-token-window.png" alt-text="Screenshot of Asset Tokens Dialog view with filled out tokens":::

    **Used** indicates the last time an external call with this token was received.

    If **N/A** is displayed in the **Used** field for this token, the connection between the sensor and the connected server is not working.

6. Add an http header entitled **Authorization** to your request to and set its value to the token you generated.

## Defender for IoT sensor API specifications

This section describes the following sensor APIs.

- **/api/v1/devices**

- **/api/v1/devices/connections**

- **/api/v1/devices/cves**

- **/api/v1/alerts**

- **/api/v1/events**

- **/api/v1/reports/vulnerabilities/devices**

- **/api/v1/reports/vulnerabilities/security**

- **/api/v1/reports/vulnerabilities/operational**

- **/api/external/authentication/validation**

- **/external/authentication/set_password**

- **/external/authentication/set_password_by_admin**

## Retrieve device information

Use this API to request a list of all devices detected by a Defender for IoT sensor.

### /api/v1/devices

#### Method

**GET**

Requests a list of all the devices detected by the Defender for IoT sensor.

#### Query params

- authorized - to filter only authorized and unauthorized devices

**Example**:

`/api/v1/devices?authorized=true`

`/api/v1/devices?authorized=false`

#### Response type

**JSON**

#### Response content

Array of JSON Objects representing devices.

#### Device fields

| Name | Type | Nullable | List of Values |
|--|--|--|--|
| **id** | Numeric | No | - |
| **ipAddresses** | JSON array | Yes | IP Addresses (can be more than one address in case of internet addresses or a device with dual NIC) |
| **name** | String | No | - |
| **type** | String | No | Unknown, Engineering Station, PLC, HMI, Historian, Domain Controller, DB Server, Wireless Access Point, Router, Switch, Server, Workstation, IP Camera, Printer, Firewall, Terminal station, VPN Gateway, Internet, Multicast and Broadcast |
| **macAddresses** | JSON array | Yes | MAC Addresses (can be more than one address in case of a device with dual NIC) |
| **operatingSystem** | String | Yes | - |
| **engineeringStation** | Boolean | No | True, or false |
| **scanner** | Boolean | No | True, or false |
| **authorized** | Boolean | No | True, or false |
| **vendor** | String | Yes | - |
| **protocols** | JSON array | Yes | Protocol object |
| **firmware** | JSON array | Yes | Firmware object |

#### Protocol fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **Name** | String | No |  |
| **Addresses** | JSON Array | Yes | Master, or Numeric values |

#### Firmware fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **serial** | String | No | N/A, or The actual value |
| **model** | String | No | N/A, or The actual value |
| **firmwareVersion** | Double | No | N/A, or The actual value |
| **additionalData** | String | No | N/A, or The actual value |
| **moduleAddress** | String | No | N/A, or The actual value |
| **rack** | String | No | N/A, or The actual value |
| **slot** | String | No | N/A, or The actual value |
| **address** | String | No | N/A, or The actual value |

### Response example

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

## Retrieve device connection information

Use this API to request a list of all the connections per device.

### /api/v1/devices/connections

#### Method

**GET**

#### Query params

- Without setting the query parameters all the device connections are returned.

**Example**:

`/api/v1/devices/connections`

- **deviceId** - Filter by a specific device ID, to view its connections.

**Example**:

`/api/v1/devices/<deviceId>/connections`

- **lastActiveInMinutes** - Time frame from now backwards, by minute, during which the connections were active.

**Example**:

`/api/v1/devices/2/connections?lastActiveInMinutes=20`

- **discoveredBefore**- Filter only connections that were detected before a specific time (in milliseconds, UTC).

**Example**:

`/api/v1/devices/2/connections?discoveredBefore=<epoch>`

- **discoveredAfter**- Filter only connections that were detected after a specific time (in milliseconds, UTC).

**Example**:

`/api/v1/devices/2/connections?discoveredAfter=<epoch>`

#### Response type

**JSON**

#### Response content

Array of JSON Objects representing device connections.

#### Fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **firstDeviceId** | Numeric | No | - |
| **secondDeviceId** | Numeric | No | - |
| **lastSeen** | Numeric | No | Epoch (UTC) |
| **discovered** | Numeric | No | Epoch (UTC) |
| **ports** | Number Array | No | - |
| **protocols** | JSON Array | No | Protocol Field |

#### Protocol field

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **name** | String | No | - |
| **commands** | String Array | No | - |

### Response example

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

## Retrieve information on CVEs

Use this API to request a list of all known CVEs discovered on devices in the network.

### /api/v1/devices/cves

#### Method

**GET**

#### Query params

- By default, provides the list of all the device IPs with CVEs, up to 100 top scored CVEs for each IP address.

**Example**:

`/api/v1/devices/cves`

- **deviceId** - Filter by a specific device IP address, to get up to 100 top scored CVEs identified on that specific device.

**Example**:

`/api/v1/devices/<ipAddress>/cves`

- **top** - how many top scored CVEs to retrieve for each device IP address.

**Example**:

`/api/v1/devices/cves?top=50`

`/api/v1/devices/<ipAddress>/cves?top=50`

#### Response type

**JSON**

#### Response content

Array of JSON Objects representing CVEs identified on ip addresses.

#### Fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **cveId** | String | No | - |
| **ipAddress** | String | No | IP Address |
| **score** | String | No | 0.0 - 10.0 |
| **attackVector** | String | No | Network, Adjacent Network, Local, or Physical |
| **description** | String | No | - |

### Response example

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

## Retrieve alert information

Use this API to request a list of all the alerts detected by the Defender for IoT sensor.

### /api/v1/alerts

#### Method

**GET**

#### Query params

- **state** - to filter only handled, or unhandled alerts

**Example**:

`/api/v1/alerts?state=handled`

- **fromTime** - to filter alerts created from a specific time (in milliseconds, UTC)

**Example**:

`/api/v1/alerts?fromTime=<epoch>`

- **toTime** - to filter alerts created only before a specific time (in milliseconds, UTC)

**Example**:

`/api/v1/alerts?toTime=<epoch>`

- **type** - to filter alerts by a specific type. Existing types to filter by: unexpected_new_devices / disconnections

**Example**:

`/api/v1/alerts?type=disconnections`

#### Response type

**JSON**

#### Response content

Array of JSON Objects representing alerts.

#### Alert fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **ID** | Numeric | No | - |
| **time** | Numeric | No | Epoch (UTC) |
| **title** | String | No | - |
| **message** | String | No | - |
| **severity** | String | No | Warning, Minor, Major, or Critical |
| **engine** | String | No | Protocol Violation, Policy Violation, Malware, Anomaly, or Operational |
| **sourceDevice** | Numeric | Yes | Device ID |
| **destinationDevice** | Numeric | Yes | Device ID |
| **additionalInformation** | Additional Information Object | Yes | - |

#### Additional information fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **description** | String | No | - |
| **information** | JSON Array | No | String |

### Response example

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

## Retrieve timeline events

Use this API to request a list of events reported to the **Event Timeline**.

### /api/v1/events

#### Method

**GET**

#### Query params:

- **minutesTimeFrame** - Time frame from now backwards, by minute, in which the events were reported

**Example**:

`/api/v1/events?minutesTimeFrame=20`

- **type** - to filter the events list by a specific type

**Examples**:

`/api/v1/events?type=DEVICE_CONNECTION_CREATED`

`/api/v1/events?type=REMOTE_ACCESS&minutesTimeFrame`

#### Response type

**JSON**

#### Response content

Array of JSON Objects representing alerts.

#### Event fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|--|
| **timestamp** | Numeric | No | Epoch (UTC) |
| **title** | String | No | - |
| **severity** | String | No | INFO, NOTICE, or ALERT |
| **owner** | String | Yes | If the event was created manually, this field will include the username that created the event |
| **content** | String | No | - |

### Response example

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

## Retrieve vulnerability information

Use this API to request vulnerability assessment results for each device.

### /api/v1/reports/vulnerabilities/devices

#### Method

**GET**

#### Response type

**JSON**

#### Response content

Array of JSON Objects representing assessed devices.

The device object contains:

- General data

- Assessment score

- Vulnerabilities

#### Device fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **name** | String | No | - |
| **ipAddresses** | Json array | No | - |
| **securityScore** | Numeric | No | - |
| **vendor** | String | Yes |  |
| **firmwareVersion** | String | Yes | - |
| **model** | String | Yes | - |
| **isWirelessAccessPoint** | Boolean | No | True, or False |
| **operatingSystem** | Operating System Object | Yes | - |
| **vulnerabilities** | Vulnerabilities object | Yes | - |

#### Operating System fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **Name** | String | Yes | - |
| **Type** | String | Yes | - |
| **Version** | String | Yes | - |
| **latestVersion** | String | Yes | - |

#### Vulnerabilities fields
 
| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **antiViruses** | Json array | Yes | AV names |
| **plainTextPasswords** | Json array | Yes | Password objects |
| **remoteAccess** | Json array | Yes | Remote access objects |
| **isBackupServer** | Boolean | No | True, or false |
| **openedPorts** | Json array | Yes | Opened Port objects |
| **isEngineeringStation** | Boolean | No | True, or false |
| **isKnownScanner** | Boolean | No | True, or false |
| **cves** | Json array | Yes | CVE objects |
| **isUnauthorized** | Boolean | No | True, or false |
| **malwareIndicationsDetected** | Boolean | No | True, or false |
| **weakAuthentication** | Json array | Yes | Detected applications that are using weak authentication |

#### Password fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **password** | String | No | - |
| **protocol** | String | No | - |
| **strength** | String | No | Very weak, Weak, Medium, or Strong |

#### Remote access fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **port** | Numeric | No | - |
| **transport** | String | No | TCP, or UDP |
| **client** | String | No | IP Address |
| **clientSoftware** | String | No | SSH, VNC, Remote desktop, or Team viewer |

#### Open port fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **port** | numeric | No | - |
| **transport** | string | No | TCP, or UDP |
| **protocol** | string | Yes | - |
| **isConflictingWithFirewall** | Boolean | No | True, or false |

#### CVE fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **ID** | String | No | - |
| **score** | Numeric | No | Double |
| **description** | String | No | - |

### Response example

```rest
[

    {
    
        "name": "IED \#10",
        
        "ipAddresses": ["10.2.1.10"],
        
        "securityScore": 100,
        
        "vendor": "ABB Switzerland Ltd, Power Systems",
        
        "firmwareVersion": null,
        
        "model": null,
        
        "operatingSystem": {
        
            "name": "ABB Switzerland Ltd, Power Systems",
            
            "type": "abb",
            
            "version": null,
            
            "latestVersion": null
        
        },
        
        "vulnerabilities": {
            
        "antiViruses": [
            
        "McAfee"
            
        ],
            
        "plainTextPasswords": [
            
            {
            
                "password": "123456",
                
                "protocol": "HTTP",
                
                "lastSeen": 1462726930471,
                
                "strength": "Very Weak"
            
            }
            
        ],
            
        "remoteAccess": [
            
            {
            
                "port": 5900,
                
                "transport": "TCP",
                
                "clientSoftware": "VNC",
                
                "client": "10.2.1.20"
            
            }
            
        ],
            
        "isBackupServer": true,
            
        "openedPorts": [
            
            {
            
                "port": 445,
                
                "transport": "TCP",
                
                "protocol": "SMP Over IP",
                
                "isConflictingWithFirewall": false
            
            },
            
            {
            
                "port": 80,
                
                "transport": "TCP",
                
                "protocol": "HTTP",
                
                "isConflictingWithFirewall": false
            
            }
            
        ],
            
        "isEngineeringStation": false,
            
        "isKnownScanner": false,
            
        "cves": [
            
            {
            
                "id": "CVE-2015-6490",
                
                "score": 10,
                
                "description": "Frosty URL - Stack-based buffer overflow on Allen-Bradley MicroLogix 1100 devices before B FRN 15.000 and 1400 devices through B FRN 15.003 allows remote attackers to execute arbitrary code via unspecified vectors"
            
            },
            
            {
            
                "id": "CVE-2012-6437",
                
                "score": 10,
                
                "description": "MicroLogix 1100 and 1400 do not properly perform authentication for Ethernet firmware updates, which allows remote attackers to execute arbitrary code via a Trojan horse update image"
            
            },
            
            {
            
                "id": "CVE-2012-6440",
                
                "score": 9.3,
                
                "description": "MicroLogix 1100 and 1400 allows man-in-the-middle attackers to conduct replay attacks via HTTP traffic."
        
            }
        
        ],
        
        "isUnauthorized": false,
        
        "malwareIndicationsDetected": true
        
        }
    
    }

]

```

## Retrieve security vulnerabilities

Use this API to request general vulnerability assessment results. This provides insight your system security level.

This assessment is based on general network and system information and not on a specific device evaluation.

### /api/v1/reports/vulnerabilities/security

#### Method

**GET**

#### Response type

**JSON**

#### Response content

JSON Object representing assessed results. Each key can be nullable, otherwise, it will contain a JSON object with non-nullable keys.

### Result fields

**Keys**

1. **unauthorizedDevices**

| Field Name | Type | List Of Values |
| ---------- | ---- | -------------- |
| **address** | String | IP Address |
| **name** | String | - |
| **firstDetectionTime** | Numeric | Epoch (UTC) |
| lastSeen | Numeric | Epoch (UTC) |

2. **illegalTrafficByFirewallRules**

| Field Name | Type | List Of Values |
| ---------- | ---- | -------------- |
| **server** | String | IP Address |
| **client** | String | IP Address |
| **port** | Numeric | - |
| **transport** | String | TCP, UDP, or ICMP |

3. **weakFirewallRules**

| Field Name | Type | List Of Values |
| ---------- | ---- | -------------- |
| **sources** | Json array of sources. Each source can be in any of 4 formats | “Any”, “ip address (Host)”, from ip-to ip (RANGE)”, "ip address, subnet mask (NETWORK)” |
| **destinations** | Json array of destinations. Each destination can be in any of 4 formats | “Any”, “ip address (Host)”, “from ip-to ip (RANGE)”, “ip address, subnet mask (NETWORK)” |
| **ports** | Json array of ports in any of 3 formats | “Any”, port (protocol, if detected), from port-to port (protocol, if detected) |

4. **accessPoints**

| Field Name | Type | List Of Values |
| ---------- | ---- | -------------- |
| **macAddress** | String | MAC Address |
| **vendor** | String | Vendor name |
| **ipAddress** | String | IP Address, or N/A |
| **name** | String | Device Name, or N/A |
| **wireless** | String | No, Suspected, or Yes |

5. **connectionsBetweenSubnets**

| Field Name | Type | List Of Values |
| ---------- | ---- | -------------- |
| **server** | String | IP Address |
| **client** | String | IP Address |

6. **industrialMalwareIndicators**

| Field Name | Type | List Of Values |
| ---------- | ---- | -------------- |
| **detectionTime** | Numeric | Epoch (UTC) |
| **alertMessage** | String | - |
| **description** | String | - |
| **devices** | Json array | Device names | 

7. **internetConnections**
| Field Name | Type | List Of Values |
| ---------- | ---- | -------------- |
| **internalAddress** | String | IP Address |
| **authorized** | Boolean | Yes, or No | 
| **externalAddresses** | Json array | IP Adresses |

### Response example

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

## Retrieve operational vulnerabilities

Use this API to request general vulnerability assessment results. This provides insight into the operational status of your network. This assessment is based on general network and system information and not on a specific device evaluation.

### /api/v1/reports/vulnerabilities/operational

#### Method

**GET**

#### Response type

**JSON**

#### Response content

JSON Object representing assessed results. Each key contains a JSON Array of results.

#### Result fields

**Keys**

1. **backupServer**

| Field Name | Type | List Of Values |
|--|--|--|
| **source** | String | IP Address |
| **destination** | String | IP Address |
| **port** | Numeric | - |
| **transport** | String | TCP, or UDP |
| **backupMaximalInterval** | String | - |
| **lastSeenBackup** | Numeric | Epoch (UTC) |

2. **ipNetworks**

| Field Name | Type | List Of Values |
|--|--|--|
| **addresse**s | Numeric | - |
| **network** | String | IP Address |
| **mask** | String | Subnet mask |

3. **protocolProblems**

| Field Name | Type | List Of Values |
|--|--|--|
| **protocol** | String | - |
| **addresses** | Json Array | IP Addresses |
| **alert** | String | - |
| **reportTime** | Numeric | Epoch (UTC) |

4. **protocolDataVolumes**

| Field Name | Type | List Of Values |
|--|--|--|
| protocol | String | - |
| volume | String | “volume number MB” |

5. **disconnections**

| Field Name | Type | List Of Values |
|--|--|--|
| **assetAddress** | String | IP Address |
| **assetName** | String | - |
| **lastDetectionTime** | Numeric | Epoch (UTC) |
| **backToNormalTime** | Numeric | Epoch (UTC) |     

### Response example

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

## Validate user credentials

Use this API to validate a Defender for IoT username and password. All Defender for IoT user roles can work with the API.

You do not need a Defender for IoT access token to use this API.

### /api/external/authentication/validation

#### Method

**POST**

#### Request type

**JSON**

#### Query params

| **Name** | **Type** | **Nullable** |
|--|--|--|
| **username** | String | No |
| **password** | String | No |

#### Request example

```rest
request:

{

    "username": "test",
    
    "password": "Test12345\!"

}

```

#### Response type

**JSON**

#### Response content

Message string with the operation status details:

- **Success** – msg: Authentication succeeded

- **Failure** – error: Credentials Validation Failed

#### Response example

```rest
response:

{

    "msg": "Authentication succeeded."

}

```

## Change password

Use this API to let users  change their own passwords. All Defender for IoT user roles can work with the API. You do not need a Defender for IoT access token to use this API.

### /external/authentication/set_password

#### Method

**POST**

#### Request type

**JSON**

#### Request example

```rest
request:

{

    "username": "test",
    
    "password": "Test12345\!",
    
    "new_password": "Test54321\!"

}

```

#### Response type

**JSON**

#### Response content

Message string with the operation status details:

- **Success – msg**: password has been replaced

- **Failure – error**: user authentication failure

- **Failure – error**: password does not match security policy  

#### Response example

```rest
response:

{

    "error": {
    
        "userDisplayErrorMessage": "User authentication failure"
    
    }

}

```

#### Device fields

| **Name** | **Type** | **Nullable** |
|--|--|--|
| **username** | String | No |
| **password** | String | No |
| **new_password** | String | No |

## User password update by system admin

Use this API to let system administrators change passwords for specified users. Defender for IoT administrator user roles can work with the API. You do not need a Defender for IoT access token to use this API.

### /external/authentication/set_password_by_admin

#### Method

**POST**

#### Request type

**JSON**

#### Request example

```rest
request:

{

    "username": "test",
    
    "password": "Test12345\!",
    
    "new_password": "Test54321\!"

}
```

#### Response type

**JSON**

#### Response content

Message string with the operation status details:

- **Success – msg**: password has been replaced

- **Failure – error**: user authentication failure

- **Failure – error**: user does not exist

- **Failure – error**: password doesn’t match security policy

- **Failure – error**: User does not have the permissions to change password

#### Response example

```rest
response:

{

    "error": {
    
        "userDisplayErrorMessage": "The user 'test_user' doesn't exist",
        
        "internalSystemErrorMessage": "The user 'yoavfe' doesn't exist"
    
    }

}

```

#### Device fields

| **Name** | **Type** | **Nullable** |
|--|--|--|
| **admin_username** | String | No |
| **admin_password** | String | No |
| **username** | String | No |
| **new_password** | String | No |

## On-premises management console API specifications

This section describes the following on-premises management console APIs.

- **/external/v1/alerts/<UUID>**

- **Alert Exclusions (Maintenance Window)**

:::image type="content" source="media/references-work-with-defender-for-iot-apis/alert-exclusion-window.png" alt-text="The alert exclusion window showing active rules.":::

Define conditions under which alerts will not be sent. For example, define and update stop and start times, devices or subnets that should be excluded when triggering alerts, or Defender for IoT engines that should be excluded. For example, during a maintenance window, you may want to stop alert delivery of all alerts, except for malware alerts on critical devices.

The APIs you define here appear in the on-premises management console, Alert Exclusion rule window as a read-only exclusion rule

### /external/v1/maintenanceWindow

- **/external/authentication/validation**

- **Response Example**

- **response:**

```rest
{
    "msg": "Authentication succeeded."
}

```

### Change Password

Use this API to let users  change their own passwords. All Defender for IoT user roles can work with the API. You do not need a Defender for IoT access token to use this API.

- **/external/authentication/set_password**

- **User Password Update by System Admin**

Use this API to let system administrators change passwords for specific users. Defender for IoT Admin user roles can work with the API. You do not need a Defender for IoT access token to use this API.

- **/external/authentication/set_password_by_admin**

## Retrieve device information

This API requests a list of all devices detected by Defender for IoT sensors connected to an on-premises management console.

### /external/v1/devices

#### Method

**GET**

#### Response type

**JSON**

#### Response content

Array of JSON Objects representing devices.

#### Query params

- **authorized** - to filter only authorized and unauthorized devices

- **siteId** - to filter only devices related to specific sites.

- **zoneId** - to filter only devices related to specific zones. [1](#1)

- **sensorId** - to filter only devices detected by specific sensors. [1](#1)

###### <a id="1">1</a> *You may not have the Site and zone ID. If this is the case, query all devices to retrieve the Site and Zone ID.*

#### Query params example

`/external/v1/devices?authorized=true`

`/external/v1/devices?authorized=false`

`/external/v1/devices?siteId=1,2`

`/external/v1/devices?zoneId=5,6`

`/external/v1/devices?sensorId=8`

#### Device fields

| Name | Type | Nullable | List of Values |
|--|--|--|--|
| **sensorId** | Numeric | No | - |
| **zoneId** | Numeric | Yes | - |
| **siteId** | Numeric | Yes | - |
| **ipAddresses** | JSON array | Yes | IP Addresses (can be more than one address in case of internet addresses or a device with dual NIC) |
| **name** | String | No | - |
| **type** | String | No | Unknown, Engineering Station, PLC, HMI, Historian, Domain Controller, DB Server, Wireless Access Point, Router, Switch, Server, Workstation, IP Camera, Printer, Firewall, Terminal station, VPN Gateway, Internet, or Multicast and Broadcast |
| **macAddresses** | JSON array | Yes | MAC Addresses (can be more than one address in case of a device with dual NIC) |
| **operatingSystem** | String | Yes | - |
| **engineeringStation** | Boolean | No | True, or false |
| **scanner** | Boolean | No | True, or false |
| **authorized** | Boolean | No | True, or false |
| **vendor** | String | Yes | - |
| **Protocols** | JSON array | Yes | Protocol object |
| **firmware** | JSON array | Yes | Firmware object |

#### Protocol fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| Name | String | No | - |
| Addresses | JSON Array | Yes | Master, or Numeric values |

#### Firmware fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **serial** | String | No | N/A, or The actual value |
| **model** | String | No | N/A, or The actual value |
| **firmwareVersion** | Double | No | N/A, or The actual value |
| **additionalData** | String | No | N/A, or The actual value |
| **moduleAddress** | String | No | N/A, or The actual value |
| **rack** | String | No | N/A, or The actual value |
| **slot** | String | No | N/A, or The actual value |
| **address** | String | No | N/A, or The actual value |

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

## Retrieve alert information

Use this API to retrieve all or filtered alerts from an on-premises management console.

### /external/v1/alerts

#### Method

**GET**

#### Query params

- **state** - to filter only handled and unhandled alerts

**Example**:

`/api/v1/alerts?state=handled`

- **fromTime** - to filter alerts created from a specific time (in milliseconds, UTC)

**Example**:

`/api/v1/alerts?fromTime=<epoch>`

- **toTime** - to filter alerts created only before a specific time (in milliseconds, UTC)

**Example**:

`/api/v1/alerts?toTime=<epoch>`

- **siteId:** The site on which the alert was discovered. [2](#2)

- **zoneId**: The zone on which the alert was discovered. [2](#2)

- **sensor**: The sensor on which the alert was discovered.

##### <a id="2">2</a> You may not have the Site and zone ID. If this is the case, query all devices to retrieve the Site and Zone ID.*

### Alert fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **ID** | Numeric | No | - |
| **time** | Numeric | No | Epoch (UTC) |
| **title** | String | No | - |
| **message** | String | No | - |
| **severity** | String | No | Warning, Minor, Major, or Critical |
| **engine** | String | No | Protocol Violation, Policy Violation, Malware, Anomaly, or Operational |
| **sourceDevice** | Numeric | Yes | Device ID |
| **destinationDevice** | Numeric | Yes | Device ID |
| **additionalInformation** | Additional Information Object | Yes | - |

### Additional information fields

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **description** | String | No | - |
| **information** | JSON Array | No | String |

### Response example

```rest
[

    {
    
        "engine": "Operational",
        
        "handled": false,
        
        "title": "Traffic Detected on sensor Interface",
        
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

## QRadar alerts

Allows QRadar integration with Defender for IoT to identify the alerts generated by Defender for IoT and perform actions with these alerts. QRadar receives the data from Defender for IoT and then contacts the public API on-premises management console component.

To send the data discovered by Defender for IoT to QRadar, define a forwarding rule in the Defender for IoT system and select the **Remote support alert handling** option.

:::image type="content" source="media/references-work-with-defender-for-iot-apis/edit-forwarding-rules.png" alt-text="Edit the forwarding rules to match your needs.":::

When this option is selected during the forwarding rule configuration process, the following additional fields appear in QRadar:

- **UUID:** Unique alert identifier, for example 1-1555245116250

- **Site:** The site where the alert was discovered

- **Zone:** The zone where the alert was discovered

Example of the payload sent to QRadar:

```
<9>May 5 12:29:23 sensor_Agent LEEF:1.0|CyberX|CyberX platform|2.5.0|CyberX platform Alert|devTime=May 05 2019 15:28:54 devTimeFormat=MMM dd yyyy HH:mm:ss sev=2 cat=XSense Alerts title=Device is Suspected to be Disconnected (Unresponsive) score=81 reporter=192.168.219.50 rta=0 alertId=6 engine=Operational senderName=sensor Agent UUID=5-1557059334000 site=Site zone=Zone actions=handle dst=192.168.2.2 dstName=192.168.2.2 msg=Device 192.168.2.2 is suspected to be disconnected (unresponsive).
```

### /external/v1/alerts/&lt;UUID&gt;

#### Method

**PUT**

#### Request type

**JSON**

#### Request content

JSON object representing the action to perform on alert containing the UUID.

#### Action fields:

| Name | Type | Nullable | List Of Values |
|--|--|--|--|
| **action** | String | No | handle, or handleAndLearn |

#### Request example:

```rest
{
    "action": "handle"
}

```

#### Response type

**JSON**

#### Response content

Array of JSON Objects representing devices

#### Response fields


| Name | Type | Nullable | Description |
|--|--|--|--|
| **content / error** | String | No | If the request is successful, the content property appears. Otherwise, the error property appears. |

#### Possible content values

| Status code | Content value               | Description                    |
| ----------- | --------------------------- | ------------------------------ |
| 200 | Alert update request finished successfully. | The update request finished successfully. No comments. |
| 200 | Alert was already handled (**handle**). | The alert was already handled when a handle request for the alert was received.<br />The alert remains **handled**. |
| 200 | Alert was already handled and learned (**handleAndLearn**). | The alert was already handled and learned when a request to **handleAndLearn** was received.<br />The alert remains in the **handledAndLearn** status. |
| 200 | Alert was already handled (**handled**).<br />Handle and learn (**handleAndLearn**) was performed on the alert. | The alert was already handled when a request to **handleAndLearn** was received.<br />The alert becomes **handleAndLearn**. |
| 200 | Alert was already handled and learned (**handleAndLearn**). Ignored handle request. | The alert was already **handleAndLearn** when a request to handle the alert was received. The alert stays **handle&amp;Learn**. |
| 500 | Invalid action | The action that was sent is not a valid action to perform on the alert. |
| 500 | Unexpected Error occurred. | An unexpected error occurred. To resolve the issue, contact Technical Support. |
| 500 | Couldn't execute request because no alert was found for this UUID. | The specified alert UUID was not found in the system. |

#### Response example

**Successful**

```rest
{
    "content": "Alert update request finished successfully"
}
```

**Unsuccessful**

```rest
{
    "error": "Invalid action"
}
```

## Alert exclusions (maintenance window)

Define conditions under which alerts will not be sent. For example, define and update stop and start times, devices or subnets that should be excluded when triggering alerts, or Defender for IoT engines that should be excluded. For example, during a maintenance window, you may want to stop alert delivery of all alerts, except for malware alerts on critical devices.

The APIs you define here appear in the on-premises management console, Alert Exclusion rule window as a read-only exclusion rule.

:::image type="content" source="media/references-work-with-defender-for-iot-apis/alert-exclusion-window.png" alt-text="The alert exclusions window showing a list of all the exclusion rules. ":::

### /external/v1/maintenanceWindow

#### Method - POST

#### Query parameters

- **ticketId**: The maintenance ticket ID in the user’s systems.

- **ttl**: TTL (time to live) defines the duration of the maintenance window in minutes. After the period of time defined by this parameter, the system automatically starts sending alerts.

- **engines**: Defines from which security engine to suppress alerts during the maintenance process:

   - ANOMALY

   - MALWARE

   - OPERATIONAL

   - POLICY_VIOLATION

   - PROTOCOL_VIOLATION

- **sensorIds**: Defines from which Defender for IoT sensor to suppress alerts during the maintenance process. It is the same ID retrieved from /api/v1/appliances (GET).

- **subnets**: Defines from which subnet to suppress alerts during the maintenance process. The subnet is sent in the following format: 192.168.0.0/16.

#### Error codes

- **201 (Created)**: The action was successfully completed.

- **400 (Bad Request)**: Appears in the following cases:

   - The **ttl** parameter is not numeric or not positive.

   - The **subnets** parameter was defined using a wrong format.

   - The **ticketId** parameter is missing.

   - The **engine** parameter does not match the existing security engines.  

- **404 (Not Found)**: One of the sensors does not exists.

- **409 (Conflict)**: The ticket ID is linked to another open maintenance window.

- **500 (Internal Server Error)**: Any other unexpected error.

> [!NOTE]
> Make sure that the ticketID is not linked to an existing open window. The exclusion rule that is generated: Maintenance-{token name}-{ticket ID}.

### Method - PUT

Allows updating the maintenance window duration after starting the maintenance process by changing the **ttl** parameter. The new duration definition overrides the previous one.

This method is useful when you want to set a longer duration than the currently configured duration.

#### Query parameters

- **ticketId**: The maintenance ticket ID in the user’s systems.

- **ttl**: Defines the duration of the window in minutes.

#### Error code

- **200 (OK)**: The action was successfully completed.

- **400 (Bad Request)**: Appears in the following cases:

   - The **ttl** parameter is not numeric or not positive.

   - The **ticketId** parameter is missing.

   - The **ttl** parameter is missing.

- **404 (Not Found)**: The ticket ID is not linked to an open maintenance window.

- **500 (Internal Server Error)**: Any other unexpected error.

> [!NOTE]
> Make sure that the ticket ID is linked to an existing open window.

### Method - DELETE

Closes an existing maintenance window.

#### Query parameters

- **ticketId**: Logs the maintenance ticket ID in the user’s systems.

#### Error code

- **200 (OK)**: The action was successfully completed.

- **400 (Bad Request)**: The **ticketId** parameter is missing.

- **404 (Not Found)**: The ticket ID is not linked to an open maintenance window.

- **500 (Internal Server Error)**: Any other unexpected error.

> [!NOTE]
> Make sure that the ticket ID is linked to an existing open window.

### Method - GET

Retrieve a log of all the open, close, and update actions that were performed in the system during the maintenance. You can retrieve a log only for maintenance windows that were active in the past and have been closed.

#### Query parameters 

- **fromDate**: Filters the logs from the predefined date and later, the format is 2019-12-30.

- **toDate**: Filters the logs up to the predefined date, the format is 2019-12-30.

- **ticketId**: Filters the logs related to a specific ticketId.

- **tokenName**: Filters the logs related to a specific tokenName.

#### Error code

- **200 (OK)**: The action was successfully completed.

- **400 (Bad Request)**: The date format is wrong.

- **204 (No Content)**: There is no data to show.

- **500 (Internal Server Error)**: Any other unexpected error.

#### Response type

**JSON**

#### Response content

Array of JSON Objects representing maintenance window operations.

#### Response structure

| Name | Type | Comment | Nullable |
|--|--|--|--|
| **dateTime** | string | Example: “2012-04-23T18:25:43.511Z” | no |
| **ticketId** | string | Example: “9a5fe99c-d914-4bda-9332-307384fe40bf” | no |
| **tokenName** | string | - | no |
| **engines** | Array of string | - | yes |
| **sensorIds** | Array of string | - | yes |
| **subnets** | Array of string | - | yes |
| **ttl** | numeric | - | yes |
| **operationType** | string | Values are “OPEN”, “UPDATE” and “CLOSE” | no |

## Authenticate user credentials

Use this API to validate user credentials. All Defender for IoT user roles can work with the API. You do not need a Defender for IoT access token to use this API.

### /external/authentication/validation

#### Method

**POST**

#### Request type

**JSON**

#### Request example

```rest
request:

{

    "username": "test",

    "password": "Test12345\!"

}
```

#### Response type

**JSON**

#### Response content

Message string with the operation status details:

- *Success – msg*: Authentication succeeded

- *Failure – error*: Credentials Validation Failed

#### Device fields

| **Name** | **Type** | **Nullable** |
|--|--|--|
| **username** | String | No |
| **password** | String | No |

#### Response example

```rest
response:

{

    "msg": "Authentication succeeded."

}
```

## Change password

Use this API to let users  change their own passwords. All Defender for IoT user roles can work with the API. You do not need a Defender for IoT access token to use this API.

### /external/authentication/set_password

#### Method

**POST**

#### Request type

**JSON**

#### Request example

```rest
request:

{

    "username": "test",
    
    "password": "Test12345\!",
    
    "new_password": "Test54321\!"

}

```

#### Response type

**JSON**

#### Response content

Message string with the operation status details:

- **Success – msg**: password has been replaced

- **Failure – error**: user authentication failure

- **Failure – error**: password does not match security policy  

#### Response example

```rest
response:

{

    "error": {
    
        "userDisplayErrorMessage": "User authentication failure"
    
    }

}

```

#### Device fields

| **Name** | **Type** | **Nullable** |
|--|--|--|
| **username** | String | No |
| **password** | String | No |
| **new_password** | String | No |

## User password update by system admin

Use this API to let system administrators change passwords for specified users. Defender for IoT Admin user roles can work with the API. You do not need a Defender for IoT access token to use this API.

### /external/authentication/set_password_by_admin

#### Method

**POST**

#### Request type

**JSON**

#### Request example

```rest
request:

{

    "username": "test",
    
    "password": "Test12345\!",
    
    "new_password": "Test54321\!"

}
```

#### Response type

**JSON**

#### Response content

Message string with the operation status details:

- **Success – msg**: password has been replaced

- **Failure – error**: user authentication failure

- **Failure – error**: user does not exist

- **Failure – error**: password doesn’t match security policy

- **Failure – error**: User does not have the permissions to change password

#### Response example

```rest
response:

{

    "error": {
    
        "userDisplayErrorMessage": "The user 'test_user' doesn't exist",
        
        "internalSystemErrorMessage": "The user 'yoavfe' doesn't exist"
    
    }

}

```

#### Device fields

| **Name** | **Type** | **Nullable** |
|--|--|--|
| **admin_username** | String | No |
| **admin_password** | String | No |
| **username** | String | No |
| **new_password** | String | No |

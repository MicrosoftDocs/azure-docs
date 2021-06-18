---
title: Work with Defender for IoT APIs
description: Use an external REST API to access the data discovered by sensors and management consoles and perform actions with that data.
ms.date: 12/14/2020
ms.topic: reference
---

# Defender for IoT sensor and management console APIs

Use an external REST API to access the data discovered by sensors and management consoles and perform actions with that data.

Connections are secured over SSL.

## Getting started

In general, when you're using an external API on the Azure Defender for IoT sensor or on-premises management console, you need to generate an access token. Tokens are not required for authentication APIs that you use on the sensor and the on-premises management console.

To generate a token:

1. In the **System Settings** window, select **Access Tokens**.
  
   :::image type="content" source="media/references-work-with-defender-for-iot-apis/access-tokens.png" alt-text="Screenshot of System Settings windows highlighting the Access Tokens button.":::

2. Select **Generate new token**.
   
   :::image type="content" source="media/references-work-with-defender-for-iot-apis/new-token.png" alt-text="Select the button to generate a new token.":::

3. Describe the purpose of the new token and select **Next**.
   
   :::image type="content" source="media/references-work-with-defender-for-iot-apis/token-name.png" alt-text="Generate a new token and enter the name of the integration associated with it.":::

4. The access token appears. Copy it, because it won't be displayed again.
   
   :::image type="content" source="media/references-work-with-defender-for-iot-apis/token-code.png" alt-text="Copy your access token for your integration.":::

5. Select **Finish**. The tokens that you create appear in the **Access Tokens** dialog box.
   
   :::image type="content" source="media/references-work-with-defender-for-iot-apis/access-token-window.png" alt-text="Screenshot of Device Tokens dialog box with filled-out tokens":::

   **Used** indicates the last time an external call with this token was received.

   If **N/A** is displayed in the **Used** field for this token, the connection between the sensor and the connected server is not working.

6. Add an HTTP header titled **Authorization** to your request, and set its value to the token that you generated.

## Sensor API specifications

This section describes the following sensor APIs:

- [Retrieve device information - /api/v1/devices](#retrieve-device-information---apiv1devices)

- [Retrieve device connection information - /api/v1/devices/connections](#retrieve-device-connection-information---apiv1devicesconnections)

- [Retrieve information on CVEs - /api/v1/devices/cves](#retrieve-information-on-cves---apiv1devicescves)

- [Retrieve alert information - /api/v1/alerts](#retrieve-alert-information---apiv1alerts)

- [Retrieve timeline events - /api/v1/events](#retrieve-timeline-events---apiv1events)

- [Retrieve vulnerability information - /api/v1/reports/vulnerabilities/devices](#retrieve-vulnerability-information---apiv1reportsvulnerabilitiesdevices)

- [Retrieve security vulnerabilities - /api/v1/reports/vulnerabilities/security](#retrieve-security-vulnerabilities---apiv1reportsvulnerabilitiessecurity)

- [Retrieve operational vulnerabilities - /api/v1/reports/vulnerabilities/operational](#retrieve-operational-vulnerabilities---apiv1reportsvulnerabilitiesoperational)

- [Validate user credentials - /api/external/authentication/validation](#validate-user-credentials---apiexternalauthenticationvalidation)

- [Change password - /external/authentication/set_password](#change-password---externalauthenticationset_password)

- [User password update by system admin - /external/authentication/set_password_by_admin](#user-password-update-by-system-admin---externalauthenticationset_password_by_admin)

### Retrieve device information - /api/v1/devices

Use this API to request a list of all devices that a Defender for IoT sensor has detected.

#### Method

**GET**

Requests a list of all the devices that the Defender for IoT sensor has detected.

#### Query parameters

- **authorized**: To filter only authorized and unauthorized devices.

  **Examples**:

  `/api/v1/devices?authorized=true`

  `/api/v1/devices?authorized=false`

#### Response type

**JSON**

#### Response content

Array of JSON objects that represent devices.

#### Device fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **id** | Numeric | No | - |
| **ipAddresses** | JSON array | Yes | IP addresses (can be more than one address in case of internet addresses or a device with dual NICs) |
| **name** | String | No | - |
| **type** | String | No | Unknown, Engineering Station, PLC, HMI, Historian, Domain Controller, DB Server, Wireless Access Point, Router, Switch, Server, Workstation, IP Camera, Printer, Firewall, Terminal station, VPN Gateway, Internet, or Multicast and Broadcast |
| **macAddresses** | JSON array | Yes | MAC addresses (can be more than one address in case of a device with dual NICs) |
| **operatingSystem** | String | Yes | - |
| **engineeringStation** | Boolean | No | True or false |
| **scanner** | Boolean | No | True or false |
| **authorized** | Boolean | No | True or false |
| **vendor** | String | Yes | - |
| **protocols** | JSON array | Yes | Protocol object |
| **firmware** | JSON array | Yes | Firmware object |

#### Protocol fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **Name** | String | No |  |
| **Addresses** | JSON array | Yes | Master, or numeric values |

#### Firmware fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **serial** | String | No | N/A, or the actual value |
| **model** | String | No | N/A, or the actual value |
| **firmwareVersion** | Double | No | N/A, or the actual value |
| **additionalData** | String | No | N/A, or the actual value |
| **moduleAddress** | String | No | N/A, or the actual value |
| **rack** | String | No | N/A, or the actual value |
| **slot** | String | No | N/A, or the actual value |
| **address** | String | No | N/A, or the actual value |

#### Response example

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

#### Curl command

| Type | APIs | Example |
|--|--|--|
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:<span>//127<span>.0.0.1/api/v1/devices?authorized=true |

### Retrieve device connection information - /api/v1/devices/connections

Use this API to request a list of all the connections per device.

#### Method

**GET**

#### Query parameters

If you don't set the query parameters, all the device connections are returned.

**Example**:

`/api/v1/devices/connections`

- **deviceId**: Filter by a specific device ID, to view its connections.

  **Example**:

  `/api/v1/devices/<deviceId>/connections`

- **lastActiveInMinutes**: Time frame from now backward, by minute, during which the connections were active.

  **Example**:

  `/api/v1/devices/2/connections?lastActiveInMinutes=20`

- **discoveredBefore**: Filter only connections that were detected before a specific time (in milliseconds, UTC).

  **Example**:

  `/api/v1/devices/2/connections?discoveredBefore=<epoch>`

- **discoveredAfter**: Filter only connections that were detected after a specific time (in milliseconds, UTC).

  **Example**:

  `/api/v1/devices/2/connections?discoveredAfter=<epoch>`

#### Response type

**JSON**

#### Response content

Array of JSON objects that represent device connections.

#### Fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **firstDeviceId** | Numeric | No | - |
| **secondDeviceId** | Numeric | No | - |
| **lastSeen** | Numeric | No | Epoch (UTC) |
| **discovered** | Numeric | No | Epoch (UTC) |
| **ports** | Number array | No | - |
| **protocols** | JSON array | No | Protocol field |

#### Protocol field

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **name** | String | No | - |
| **commands** | String array | No | - |

#### Response example

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

#### Curl command

> [!div class="mx-tdBreakAll"]
> | Type | APIs | Example |
> |--|--|--|
> | GET | curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices/connections | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/api/v1/devices/connections |
> | GET | curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/devices/<deviceId>/connections?lastActiveInMinutes=&discoveredBefore=&discoveredAfter=' | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https:/<span>/127.0.0.1/api/v1/devices/2/connections?lastActiveInMinutes=20&discoveredBefore=1594550986000&discoveredAfter=1594550986000' |

### Retrieve information on CVEs - /api/v1/devices/cves

Use this API to request a list of all known CVEs discovered on devices in the network.

#### Method

**GET**

#### Query parameters

By default, this API provides the list of all the device IPs with CVEs, up to 100 top-scored CVEs for each IP address.

**Example**:

`/api/v1/devices/cves`

- **deviceId**: Filter by a specific device IP address, to get up to 100 top-scored CVEs identified on that specific device.

  **Example**:

  `/api/v1/devices/<ipAddress>/cves`

- **top**: How many top-scored CVEs to retrieve for each device IP address.

  **Example**:

  `/api/v1/devices/cves?top=50`

  `/api/v1/devices/<ipAddress>/cves?top=50`

#### Response type

**JSON**

#### Response content

Array of JSON objects that represent CVEs identified on IP addresses.

#### Fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **cveId** | String | No | - |
| **ipAddress** | String | No | IP address |
| **score** | String | No | 0.0 - 10.0 |
| **attackVector** | String | No | Network, Adjacent Network, Local, or Physical |
| **description** | String | No | - |

#### Response example

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

#### Curl command

| Type | APIs | Example |
|--|--|--|
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices/cves | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/api/v1/devices/cves |
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices/<deviceIpAddress>/cves?top= | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/api/v1/devices/10.10.10.15/cves?top=50 |

### Retrieve alert information - /api/v1/alerts

Use this API to request a list of all the alerts that the Defender for IoT sensor has detected.

#### Method

**GET**

#### Query parameters

- **state**: To filter only handled or unhandled alerts.

  **Example**:

  `/api/v1/alerts?state=handled`

- **fromTime**: To filter alerts created from a specific time (in milliseconds, UTC).

  **Example**:

  `/api/v1/alerts?fromTime=<epoch>`

- **toTime**: To filter alerts created only before a specific time (in milliseconds, UTC).

  **Example**:

  `/api/v1/alerts?toTime=<epoch>`

- **type**: To filter alerts by a specific type. Existing types to filter by: unexpected new devices, disconnections.

  **Example**:

  `/api/v1/alerts?type=disconnections`

#### Response type

**JSON**

#### Response content

Array of JSON objects that represent alerts.

#### Alert fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **ID** | Numeric | No | - |
| **time** | Numeric | No | Epoch (UTC) |
| **title** | String | No | - |
| **message** | String | No | - |
| **severity** | String | No | Warning, Minor, Major, or Critical |
| **engine** | String | No | Protocol Violation, Policy Violation, Malware, Anomaly, or Operational |
| **sourceDevice** | Numeric | Yes | Device ID |
| **destinationDevice** | Numeric | Yes | Device ID |
| **sourceDeviceAddress** | Numeric | Yes | IP, MAC |
| **destinationDeviceAddress** | Numeric | Yes | IP, MAC |
| **remediationSteps** | String | Yes | Remediation steps described in alert |
| **additionalInformation** | Additional information object | Yes | - |

Note that /api/v2/ is needed for the following information:

- sourceDeviceAddress 
- destinationDeviceAddress
- remediationSteps

#### Additional information fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **description** | String | No | - |
| **information** | JSON array | No | String |

#### Response example

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

#### Curl command

> [!div class="mx-tdBreakAll"]
> | Type | APIs | Example |
> |--|--|--|
> | GET | curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/alerts?state=&fromTime=&toTime=&type=' | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https:/<span>/127.0.0.1/api/v1/alerts?state=unhandled&fromTime=1594550986000&toTime=1594550986001&type=disconnections' |

### Retrieve timeline events - /api/v1/events

Use this API to request a list of events reported to the event timeline.

#### Method

**GET**

#### Query parameters

- **minutesTimeFrame**: Time frame from now backward, by minute, in which the events were reported.

  **Example**:

  `/api/v1/events?minutesTimeFrame=20`

- **type**: To filter the events list by a specific type.

  **Examples**:

  `/api/v1/events?type=DEVICE_CONNECTION_CREATED`

  `/api/v1/events?type=REMOTE_ACCESS&minutesTimeFrame`

#### Response type

**JSON**

#### Response content

Array of JSON objects that represent alerts.

#### Event fields

| Name | Type | Nullable | List of values |
|--|--|--|--|--|
| **timestamp** | Numeric | No | Epoch (UTC) |
| **title** | String | No | - |
| **severity** | String | No | INFO, NOTICE, or ALERT |
| **owner** | String | Yes | If the event was created manually, this field will include the username that created the event |
| **content** | String | No | - |

#### Response example

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

#### Curl command

| Type | APIs | Example |
|--|--|--|
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/events?minutesTimeFrame=&type=' | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https:/<span>/127.0.0.1/api/v1/events?minutesTimeFrame=20&type=DEVICE_CONNECTION_CREATED' |

### Retrieve vulnerability information - /api/v1/reports/vulnerabilities/devices

Use this API to request vulnerability assessment results for each device.

#### Method

**GET**

#### Response type

**JSON**

#### Response content

Array of JSON objects that represent assessed devices.

The device object contains:

- General data

- Assessment score

- Vulnerabilities

#### Device fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **name** | String | No | - |
| **ipAddresses** | JSON array | No | - |
| **securityScore** | Numeric | No | - |
| **vendor** | String | Yes |  |
| **firmwareVersion** | String | Yes | - |
| **model** | String | Yes | - |
| **isWirelessAccessPoint** | Boolean | No | True or false |
| **operatingSystem** | Operating system object | Yes | - |
| **vulnerabilities** | Vulnerabilities object | Yes | - |

#### Operating system fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **Name** | String | Yes | - |
| **Type** | String | Yes | - |
| **Version** | String | Yes | - |
| **latestVersion** | String | Yes | - |

#### Vulnerabilities fields
 
| Name | Type | Nullable | List of values |
|--|--|--|--|
| **antiViruses** | JSON array | Yes | Antivirus names |
| **plainTextPasswords** | JSON array | Yes | Password objects |
| **remoteAccess** | JSON array | Yes | Remote access objects |
| **isBackupServer** | Boolean | No | True or false |
| **openedPorts** | JSON array | Yes | Opened port objects |
| **isEngineeringStation** | Boolean | No | True or false |
| **isKnownScanner** | Boolean | No | True or false |
| **cves** | JSON array | Yes | CVE objects |
| **isUnauthorized** | Boolean | No | True or false |
| **malwareIndicationsDetected** | Boolean | No | True or false |
| **weakAuthentication** | JSON array | Yes | Detected applications that are using weak authentication |

#### Password fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **password** | String | No | - |
| **protocol** | String | No | - |
| **strength** | String | No | Very weak, Weak, Medium, or Strong |

#### Remote access fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **port** | Numeric | No | - |
| **transport** | String | No | TCP or UDP |
| **client** | String | No | IP address |
| **clientSoftware** | String | No | SSH, VNC, Remote desktop, or Team viewer |

#### Open port fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **port** | Numeric | No | - |
| **transport** | String | No | TCP or UDP |
| **protocol** | String | Yes | - |
| **isConflictingWithFirewall** | Boolean | No | True or false |

#### CVE fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **ID** | String | No | - |
| **score** | Numeric | No | Double |
| **description** | String | No | - |

#### Response example

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

#### Curl command

| Type | APIs | Example |
|--|--|--|
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/reports/vulnerabilities/devices | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/api/v1/reports/vulnerabilities/devices |

### Retrieve security vulnerabilities - /api/v1/reports/vulnerabilities/security

Use this API to request results of a general vulnerability assessment. This assessment provides insight into your system's security level.

This assessment is based on general network and system information and not on a specific device evaluation.

#### Method

**GET**

#### Response type

**JSON**

#### Response content

JSON object that represents assessed results. Each key can be nullable. Otherwise, it will contain a JSON object with non-nullable keys.

### Result fields

**Keys**

**unauthorizedDevices**

| Field name | Type | List of values |
| ---------- | ---- | -------------- |
| **address** | String | IP address |
| **name** | String | - |
| **firstDetectionTime** | Numeric | Epoch (UTC) |
| lastSeen | Numeric | Epoch (UTC) |

**illegalTrafficByFirewallRules**

| Field name | Type | List of values |
| ---------- | ---- | -------------- |
| **server** | String | IP address |
| **client** | String | IP address |
| **port** | Numeric | - |
| **transport** | String | TCP, UDP, or ICMP |

**weakFirewallRules**

| Field name | Type | List of values |
| ---------- | ---- | -------------- |
| **sources** | JSON array of sources. Each source can be in any of four formats. | "Any", "ip address (Host)", "from ip-to ip (RANGE)", "ip address, subnet mask (NETWORK)" |
| **destinations** | JSON array of destinations. Each destination can be in any of four formats. | "Any", "ip address (Host)", "from ip-to ip (RANGE)", "ip address, subnet mask (NETWORK)" |
| **ports** | JSON array of ports in any of three formats | "Any", "port (protocol, if detected)", "from port-to port (protocol, if detected)" |

**accessPoints**

| Field name | Type | List of values |
| ---------- | ---- | -------------- |
| **macAddress** | String | MAC address |
| **vendor** | String | Vendor name |
| **ipAddress** | String | IP address, or N/A |
| **name** | String | Device name, or N/A |
| **wireless** | String | No, Suspected, or Yes |

**connectionsBetweenSubnets**

| Field name | Type | List of values |
| ---------- | ---- | -------------- |
| **server** | String | IP address |
| **client** | String | IP address |

**industrialMalwareIndicators**

| Field name | Type | List of values |
| ---------- | ---- | -------------- |
| **detectionTime** | Numeric | Epoch (UTC) |
| **alertMessage** | String | - |
| **description** | String | - |
| **devices** | JSON array | Device names | 

**internetConnections**

| Field name | Type | List of values |
| ---------- | ---- | -------------- |
| **internalAddress** | String | IP address |
| **authorized** | Boolean | Yes or No | 
| **externalAddresses** | JSON array | IP address |

#### Response example

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

#### Curl command

| Type | APIs | Example |
|--|--|--|
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/reports/vulnerabilities/security | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/api/v1/reports/vulnerabilities/security |

### Retrieve operational vulnerabilities - /api/v1/reports/vulnerabilities/operational

Use this API to request results of a general vulnerability assessment. This assessment provides insight into the operational status of your network. It's based on general network and system information and not on a specific device evaluation.

#### Method

**GET**

#### Response type

**JSON**

#### Response content

JSON object that represents assessed results. Each key contains a JSON array of results.

#### Result fields

**Keys**

**backupServer**

| Field name | Type | List of values |
|--|--|--|
| **source** | String | IP address |
| **destination** | String | IP address |
| **port** | Numeric | - |
| **transport** | String | TCP or UDP |
| **backupMaximalInterval** | String | - |
| **lastSeenBackup** | Numeric | Epoch (UTC) |

**ipNetworks**

| Field name | Type | List of values |
|--|--|--|
| **addresse**s | Numeric | - |
| **network** | String | IP address |
| **mask** | String | Subnet mask |

**protocolProblems**

| Field name | Type | List of values |
|--|--|--|
| **protocol** | String | - |
| **addresses** | JSON array | IP addresses |
| **alert** | String | - |
| **reportTime** | Numeric | Epoch (UTC) |

**protocolDataVolumes**

| Field name | Type | List of values |
|--|--|--|
| protocol | String | - |
| volume | String | "volume number MB" |

**disconnections**

| Field name | Type | List of values |
|--|--|--|
| **assetAddress** | String | IP address |
| **assetName** | String | - |
| **lastDetectionTime** | Numeric | Epoch (UTC) |
| **backToNormalTime** | Numeric | Epoch (UTC) |     

#### Response example

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

#### Curl command

| Type | APIs | Example |
|--|--|--|
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/reports/vulnerabilities/operational | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/api/v1/reports/vulnerabilities/operational |

### Validate user credentials - /api/external/authentication/validation

Use this API to validate a Defender for IoT username and password. All Defender for IoT user roles can work with the API.

You don't need a Defender for IoT access token to use this API.

#### Method

**POST**

#### Request type

**JSON**

#### Query parameters

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

- **Success - msg**: Authentication succeeded

- **Failure - error**: Credentials Validation Failed

#### Response example

```rest
response:

{

    "msg": "Authentication succeeded."

}

```

#### Curl command

| Type | APIs | Example |
|--|--|--|
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/external/authentication/validation | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/api/external/authentication/validation |

### Change password - /external/authentication/set_password

Use this API to let users change their own passwords. All Defender for IoT user roles can work with the API. You don't need a Defender for IoT access token to use this API.

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

- **Success – msg**: Password has been replaced

- **Failure – error**: User authentication failure

- **Failure – error**: Password does not match security policy

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

#### Curl command

| Type | APIs | Example |
|--|--|--|
| POST | curl -k -d '{"username": "<USER_NAME>","password": "<CURRENT_PASSWORD>","new_password": "<NEW_PASSWORD>"}' -H 'Content-Type: application/json'  https://<IP_ADDRESS>/api/external/authentication/set_password | curl -k -d '{"username": "myUser","password": "1234@abcd","new_password": "abcd@1234"}' -H 'Content-Type: application/json'  https:/<span>/127.0.0.1/api/external/authentication/set_password |

### User password update by system admin - /external/authentication/set_password_by_admin

Use this API to let system administrators change passwords for specified users. Defender for IoT administrator user roles can work with the API. You don't need a Defender for IoT access token to use this API.

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

- **Success – msg**: Password has been replaced

- **Failure – error**: User authentication failure

- **Failure – error**: User does not exist

- **Failure – error**: Password doesn't match security policy

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

#### Curl command

> [!div class="mx-tdBreakAll"]
> | Type | APIs | Example |
> |--|--|--|
> | POST | curl -k -d '{"admin_username":"<ADMIN_USERNAME>","admin_password":"<ADMIN_PASSWORD>","username": "<USER_NAME>","new_password": "<NEW_PASSWORD>"}' -H 'Content-Type: application/json'  https://<IP_ADDRESS>/api/external/authentication/set_password_by_admin | curl -k -d '{"admin_user":"adminUser","admin_password": "1234@abcd","username": "myUser","new_password": "abcd@1234"}' -H 'Content-Type: application/json'  https:/<span>/127.0.0.1/api/external/authentication/set_password_by_admin |

## On-premises management console API specifications ##

This section describes on-premises management console APIs for:
- Alert exclusions
- Device information
- Alert information

### Alert Exclusions ###

Define conditions under which alerts won't be sent. For example, define and update stop and start times, devices or subnets that should be excluded when triggering alerts, or Defender for IoT engines that should be excluded. For example, during a maintenance window, you might want to stop delivery of all alerts, except for malware alerts on critical devices. The items you define here appear in the on-premises management console's **Alert Exclusions** window as  read-only exclusion rules.

#### /external/v1/maintenanceWindow

- **/external/authentication/validation**

- **Response Example**

- **response:**

```rest
{
    "msg": "Authentication succeeded."
}

```

#### Change password - /external/authentication/set_password 

Use this API to let users change their own passwords. All Defender for IoT user roles can work with the API. You don't need a Defender for IoT access token to use this API.

#### User password update by system admin - /external/authentication/set_password_by_admin 

Use this API to let system administrators change passwords for specific users. Defender for IoT admin user roles can work with the API. You don't need a Defender for IoT access token to use this API.

### Retrieve device information - /external/v1/devices ###

This API requests a list of all devices detected by Defender for IoT sensors that are connected to an on-premises management console.

#### Method

**GET**

#### Response type

**JSON**

#### Response content

Array of JSON objects that represent devices.

#### Query parameters

- **authorized**: To filter only authorized and unauthorized devices.

- **siteId**: To filter only devices related to specific sites.

- **zoneId**: To filter only devices related to specific zones. [1](#1)

- **sensorId**: To filter only devices detected by specific sensors. [1](#1)

###### <a id="1">1</a> *You might not have the site and zone ID. If this is the case, query all devices to retrieve the site and zone ID.*

#### Query parameters example

`/external/v1/devices?authorized=true`

`/external/v1/devices?authorized=false`

`/external/v1/devices?siteId=1,2`

`/external/v1/devices?zoneId=5,6`

`/external/v1/devices?sensorId=8`

#### Device fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **sensorId** | Numeric | No | - |
| **zoneId** | Numeric | Yes | - |
| **siteId** | Numeric | Yes | - |
| **ipAddresses** | JSON array | Yes | IP addresses (can be more than one address in case of internet addresses or a device with dual NICs) |
| **name** | String | No | - |
| **type** | String | No | Unknown, Engineering Station, PLC, HMI, Historian, Domain Controller, DB Server, Wireless Access Point, Router, Switch, Server, Workstation, IP Camera, Printer, Firewall, Terminal station, VPN Gateway, Internet, or Multicast and Broadcast |
| **macAddresses** | JSON array | Yes | MAC addresses (can be more than one address in case of a device with dual NICs) |
| **operatingSystem** | String | Yes | - |
| **engineeringStation** | Boolean | No | True or false |
| **scanner** | Boolean | No | True or false |
| **authorized** | Boolean | No | True or false |
| **vendor** | String | Yes | - |
| **Protocols** | JSON array | Yes | Protocol object |
| **firmware** | JSON array | Yes | Firmware object |

#### Protocol fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| Name | String | No | - |
| Addresses | JSON array | Yes | Master, or numeric values |

#### Firmware fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **serial** | String | No | N/A, or the actual value |
| **model** | String | No | N/A, or the actual value |
| **firmwareVersion** | Double | No | N/A, or the actual value |
| **additionalData** | String | No | N/A, or the actual value |
| **moduleAddress** | String | No | N/A, or the actual value |
| **rack** | String | No | N/A, or the actual value |
| **slot** | String | No | N/A, or the actual value |
| **address** | String | No | N/A, or the actual value |

#### Response example

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

#### Curl command

| Type | APIs | Example |
|--|--|--|
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<>IP_ADDRESS>/external/v1/devices?siteId=&zoneId=&sensorId=&authorized=' | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https:/<span>/127.0.0.1/external/v1/devices?siteId=1&zoneId=2&sensorId=5&authorized=true' |

### Retrieve alert information - /external/v1/alerts

Use this API to retrieve all or filtered alerts from an on-premises management console.

#### Method

**GET**

#### Query parameters

- **state**: To filter only handled and unhandled alerts.

  **Example**:

  `/api/v1/alerts?state=handled`

- **fromTime**: To filter alerts created from a specific time (in milliseconds, UTC).

  **Example**:

  `/api/v1/alerts?fromTime=<epoch>`

- **toTime**: To filter alerts created only before a specific time (in milliseconds, UTC).

  **Example**:

  `/api/v1/alerts?toTime=<epoch>`

- **siteId**: The site on which the alert was discovered.
- **zoneId**: The zone on which the alert was discovered.
- **sensor**: The sensor on which the alert was discovered.

*You might not have the site and zone ID. If this is the case, query all devices to retrieve the site and zone ID.*

#### Alert fields 

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **ID** | Numeric | No | - |
| **time** | Numeric | No | Epoch (UTC) |
| **title** | String | No | - |
| **message** | String | No | - |
| **severity** | String | No | Warning, Minor, Major, or Critical |
| **engine** | String | No | Protocol Violation, Policy Violation, Malware, Anomaly, or Operational |
| **sourceDevice** | Numeric | Yes | Device ID |
| **destinationDevice** | Numeric | Yes | Device ID |
| **sourceDeviceAddress** | Numeric | Yes | IP, MAC |
| **destinationDeviceAddress** | Numeric | Yes | IP, MAC |
| **remediationSteps** | String | Yes | Remediation steps shown in alert|
| **sensorName** | String | Yes | Name of sensor defined by user |
|**zoneName** | String | Yes | Name of zone associated with sensor|
| **siteName** | String | Yes | Name of site associated with sensor |
| **additionalInformation** | Additional information object | Yes | - |

Note that /api/v2/ is needed for the following information:

- sourceDeviceAddress 
- destinationDeviceAddress
- remediationSteps
- sensorName
- zoneName
- siteName

#### Additional information fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **description** | String | No | - |
| **information** | JSON array | No | String |

#### Response example

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

#### Curl command

> [!div class="mx-tdBreakAll"]
> | Type | APIs | Example |
> |--|--|--|
> | GET | curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<>IP_ADDRESS>/external/v1/alerts?state=&zoneId=&fromTime=&toTime=&siteId=&sensor=' | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https:/<span>/127.0.0.1/external/v1/alerts?state=unhandled&zoneId=1&fromTime=0&toTime=1594551777000&siteId=1&sensor=1' |

### QRadar alerts

QRadar integration with Defender for IoT helps you identify the alerts generated by Defender for IoT and perform actions with these alerts. QRadar receives the data from Defender for IoT and then contacts the public API on-premises management console component.

To send the data discovered by Defender for IoT to QRadar, define a forwarding rule in the Defender for IoT system and select the **Remote support alert handling** option.

:::image type="content" source="media/references-work-with-defender-for-iot-apis/edit-forwarding-rules.png" alt-text="Edit the forwarding rules to match your needs.":::

When you select this option during the process of configuring forwarding rules, the following additional fields appear in QRadar:

- **UUID**: Unique alert identifier, such as 1-1555245116250.

- **Site**: The site where the alert was discovered.

- **Zone**: The zone where the alert was discovered.

Example of the payload sent to QRadar:

```
<9>May 5 12:29:23 sensor_Agent LEEF:1.0|CyberX|CyberX platform|2.5.0|CyberX platform Alert|devTime=May 05 2019 15:28:54 devTimeFormat=MMM dd yyyy HH:mm:ss sev=2 cat=XSense Alerts title=Device is Suspected to be Disconnected (Unresponsive) score=81 reporter=192.168.219.50 rta=0 alertId=6 engine=Operational senderName=sensor Agent UUID=5-1557059334000 site=Site zone=Zone actions=handle dst=192.168.2.2 dstName=192.168.2.2 msg=Device 192.168.2.2 is suspected to be disconnected (unresponsive).
```

#### /external/v1/alerts/&lt;UUID&gt;

#### Method

**PUT**

#### Request type

**JSON**

#### Request content

JSON object that represents the action to perform on the alert that contains the UUID.

#### Action fields

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **action** | String | No | handle or handleAndLearn |

#### Request example

```rest
{
    "action": "handle"
}

```

#### Response type

**JSON**

#### Response content

Array of JSON objects that represent devices.

#### Response fields


| Name | Type | Nullable | Description |
|--|--|--|--|
| **content / error** | String | No | If the request is successful, the content property appears. Otherwise, the error property appears. |

#### Possible content values

| Status code | Content value | Description |
|--|--|--|
| 200 | Alert update request finished successfully. | The update request finished successfully. No comments. |
| 200 | Alert was already handled (**handle**). | The alert was already handled when a handle request for the alert was received.<br />The alert remains **handled**. |
| 200 | Alert was already handled and learned (**handleAndLearn**). | The alert was already handled and learned when a request to **handleAndLearn** was received.<br />The alert remains in the **handledAndLearn** status. |
| 200 | Alert was already handled (**handled**).<br />Handle and learn (**handleAndLearn**) was performed on the alert. | The alert was already handled when a request to **handleAndLearn** was received.<br />The alert becomes **handleAndLearn**. |
| 200 | Alert was already handled and learned (**handleAndLearn**). Ignored handle request. | The alert was already **handleAndLearn** when a request to handle the alert was received. The alert stays **handleAndLearn**. |
| 500 | Invalid action. | The action that was sent is not a valid action to perform on the alert. |
| 500 | Unexpected error occurred. | An unexpected error occurred. To resolve the issue, contact Technical Support. |
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

#### Curl command

| Type | APIs | Example |
|--|--|--|
| PUT | curl -k -X PUT -d '{"action": "<ACTION>"}' -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/external/v1/alerts/<UUID> | curl -k -X PUT -d '{"action": "handle"}' -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/external/v1/alerts/1-1594550943000 |

### Alert exclusions (maintenance window) - /external/v1/maintenanceWindow

Define conditions under which alerts won't be sent. For example, define and update stop and start times, devices or subnets that should be excluded when triggering alerts, or Defender for IoT engines that should be excluded. For example, during a maintenance window, you might want to stop alert delivery of all alerts, except for malware alerts on critical devices.

The APIs that you define here appear in the on-premises management console's **Alert Exclusions** window as a read-only exclusion rule.

:::image type="content" source="media/references-work-with-defender-for-iot-apis/alert-exclusion-window.png" alt-text="The Alert Exclusions window, showing a list of all the exclusion rules. ":::

#### Method - POST

#### Query parameters

- **ticketId**: Defines the maintenance ticket ID in the user's systems.

- **ttl**: Defines the TTL (time to live), which is the duration of the maintenance window in minutes. After the period of time that this parameter defines, the system automatically starts sending alerts.

- **engines**: Defines from which security engine to suppress alerts during the maintenance process:

   - ANOMALY

   - MALWARE

   - OPERATIONAL

   - POLICY_VIOLATION

   - PROTOCOL_VIOLATION

- **sensorIds**: Defines from which Defender for IoT sensor to suppress alerts during the maintenance process. It's the same ID retrieved from /api/v1/appliances (GET).

- **subnets**: Defines from which subnet to suppress alerts during the maintenance process. The subnet is sent in the following format: 192.168.0.0/16.

#### Error codes

- **201 (Created)**: The action was successfully completed.

- **400 (Bad Request)**: Appears in the following cases:

   - The **ttl** parameter is not numeric or not positive.

   - The **subnets** parameter was defined using a wrong format.

   - The **ticketId** parameter is missing.

   - The **engine** parameter does not match the existing security engines.

- **404 (Not Found)**: One of the sensors doesn't exist.

- **409 (Conflict)**: The ticket ID is linked to another open maintenance window.

- **500 (Internal Server Error)**: Any other unexpected error.

> [!NOTE]
> Make sure that the ticket ID is not linked to an existing open window. The following exclusion rule is generated: Maintenance-{token name}-{ticket ID}.

#### Method - PUT

Allows updating the maintenance window duration after you start the maintenance process by changing the **ttl** parameter. The new duration definition overrides the previous one.

This method is useful when you want to set a longer duration than the currently configured duration.

#### Query parameters

- **ticketId**: Defines the maintenance ticket ID in the user's systems.

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

#### Method - DELETE

Closes an existing maintenance window.

#### Query parameters

- **ticketId**: Logs the maintenance ticket ID in the user's systems.

#### Error code

- **200 (OK)**: The action was successfully completed.

- **400 (Bad Request)**: The **ticketId** parameter is missing.

- **404 (Not Found)**: The ticket ID is not linked to an open maintenance window.

- **500 (Internal Server Error)**: Any other unexpected error.

> [!NOTE]
> Make sure that the ticket ID is linked to an existing open window.

#### Method - GET

Retrieve a log of all the open, close, and update actions that were performed in the system during the maintenance. You can retrieve a log only for maintenance windows that were active in the past and have been closed.

#### Query parameters

- **fromDate**: Filters the logs from the predefined date and later. The format is 2019-12-30.

- **toDate**: Filters the logs up to the predefined date. The format is 2019-12-30.

- **ticketId**: Filters the logs related to a specific ticket ID.

- **tokenName**: Filters the logs related to a specific token name.

#### Error code 

- **200 (OK)**: The action was successfully completed.

- **400 (Bad Request)**: The date format is wrong.

- **204 (No Content)**: There is no data to show.

- **500 (Internal Server Error)**: Any other unexpected error.

#### Response type

**JSON**

#### Response content

Array of JSON objects that represent maintenance window operations.

#### Response structure

| Name | Type | Comment | Nullable |
|--|--|--|--|
| **dateTime** | String | Example: "2012-04-23T18:25:43.511Z" | no |
| **ticketId** | String | Example: "9a5fe99c-d914-4bda-9332-307384fe40bf" | no |
| **tokenName** | String | - | no |
| **engines** | Array of string | - | yes |
| **sensorIds** | Array of string | - | yes |
| **subnets** | Array of string | - | yes |
| **ttl** | Numeric | - | yes |
| **operationType** | String | Values are "OPEN", "UPDATE", and "CLOSE" | no |

#### Curl command

| Type | APIs | Example |
|--|--|--|
| POST | curl -k -X POST -d '{"ticketId": "<TICKET_ID>",ttl": <TIME_TO_LIVE>,"engines": [<ENGINE1, ENGINE2...ENGINEn>],"sensorIds": [<SENSOR_ID1, SENSOR_ID2...SENSOR_IDn>],"subnets": [<SUBNET1, SUBNET2....SUBNETn>]}' -H "Authorization: <AUTH_TOKEN>" https:/<span>/127.0.0.1/external/v1/maintenanceWindow | curl -k -X POST -d '{"ticketId": "a5fe99c-d914-4bda-9332-307384fe40bf","ttl": "20","engines": ["ANOMALY"],"sensorIds": ["5","3"],"subnets": ["10.0.0.3"]}' -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/external/v1/maintenanceWindow |
| PUT | curl -k -X PUT -d '{"ticketId": "<TICKET_ID>",ttl": "<TIME_TO_LIVE>"}' -H "Authorization: <AUTH_TOKEN>" https:/<span>/127.0.0.1/external/v1/maintenanceWindow | curl -k -X PUT -d '{"ticketId": "a5fe99c-d914-4bda-9332-307384fe40bf","ttl": "20"}' -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/external/v1/maintenanceWindow |
| DELETE | curl -k -X DELETE -d '{"ticketId": "<TICKET_ID>"}' -H "Authorization: <AUTH_TOKEN>" https:/<span>/127.0.0.1/external/v1/maintenanceWindow | curl -k -X DELETE -d '{"ticketId": "a5fe99c-d914-4bda-9332-307384fe40bf"}' -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https:/<span>/127.0.0.1/external/v1/maintenanceWindow |
| GET | curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/external/v1/maintenanceWindow?fromDate=&toDate=&ticketId=&tokenName=' | curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https:/<span>/127.0.0.1/external/v1/maintenanceWindow?fromDate=2020-01-01&toDate=2020-07-14&ticketId=a5fe99c-d914-4bda-9332-307384fe40bf&tokenName=a' |

### Authenticate user credentials - /external/authentication/validation

Use this API to validate user credentials. All Defender for IoT user roles can work with the API. You don't need a Defender for IoT access token to use this API.

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

- **Success – msg**: Authentication succeeded

- **Failure – error**: Credentials Validation Failed

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

#### Curl command

| Type | APIs | Example |
|--|--|--|
| POST | curl -k -d '{"username":"<USER_NAME>","password":"PASSWORD"}' 'https://<IP_ADDRESS>/external/authentication/validation' | curl -k -d '{"username":"myUser","password":"1234@abcd"}' 'https:/<span>/127.0.0.1/external/authentication/validation' |

### Change password - /external/authentication/set_password

Use this API to let users change their own passwords. All Defender for IoT user roles can work with the API. You don't need a Defender for IoT access token to use this API.

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

- **Success – msg**: Password has been replaced

- **Failure – error**: User authentication failure

- **Failure – error**: Password does not match security policy

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

#### Curl command

| Type | APIs | Example |
|--|--|--|
| POST | curl -k -d '{"username": "<USER_NAME>","password": "<CURRENT_PASSWORD>","new_password": "<NEW_PASSWORD>"}' -H 'Content-Type: application/json'  https://<IP_ADDRESS>/external/authentication/set_password | curl -k -d '{"username": "myUser","password": "1234@abcd","new_password": "abcd@1234"}' -H 'Content-Type: application/json'  https:/<span>/127.0.0.1/external/authentication/set_password |

### User password update by system admin - /external/authentication/set_password_by_admin

Use this API to let system administrators change passwords for specified users. Defender for IoT admin user roles can work with the API. You don't need a Defender for IoT access token to use this API.

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

- **Success – msg**: Password has been replaced

- **Failure – error**: User authentication failure

- **Failure – error**: User does not exist

- **Failure – error**: Password doesn't match security policy

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

#### Curl command

> [!div class="mx-tdBreakAll"]
> | Type | APIs | Example |
> |--|--|--|
> | POST | curl -k -d '{"admin_username":"<ADMIN_USERNAME>","admin_password":"<ADMIN_PASSWORD>","username": "<USER_NAME>","new_password": "<NEW_PASSWORD>"}' -H 'Content-Type: application/json'  https://<IP_ADDRESS>/external/authentication/set_password_by_admin | curl -k -d '{"admin_user":"adminUser","admin_password": "1234@abcd","username": "myUser","new_password": "abcd@1234"}' -H 'Content-Type: application/json'  https:/<span>/127.0.0.1/external/authentication/set_password_by_admin |

## Next steps

- [Investigate sensor detections in a device inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md)

- [Investigate all enterprise sensor detections in a device inventory](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md)

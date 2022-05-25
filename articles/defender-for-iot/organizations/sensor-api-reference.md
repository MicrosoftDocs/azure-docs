---
title: OT monitoring sensor API reference - Microsoft Defender for IoT
description: Learn about the REST APIs supported for Microsoft Defender for IoT OT monitoring sensors.
ms.date: 05/25/2022
ms.topic: reference
---

## OT monitoring sensor APIs

## Version reference

|Version  |Supported APIs  |
|---------|---------|
|**No version**     |  - [Validate user credentials - /api/external/authentication/validation](#validate-user-credentials---apiexternalauthenticationvalidation)<br><br>- [Change password - /external/authentication/set_password](#change-password---externalauthenticationset_password)<br><br>- [User password update by system admin - /external/authentication/set_password_by_admin](#user-password-update-by-system-admin---externalauthenticationset_password_by_admin)       |
|**Version 1**     |  - [Retrieve device information - /api/v1/devices](#retrieve-device-information---apiv1devices) <br><br>- [Retrieve device connection information - /api/v1/devices/connections](#retrieve-device-connection-information---apiv1devicesconnections)<br><br>- [Retrieve information on CVEs - /api/v1/devices/cves](#retrieve-information-on-cves---apiv1devicescves)<br><br>- [Retrieve alert information - /api/v1/alerts](#retrieve-alert-information---apiv1alerts)<br><br>- [Retrieve timeline events - /api/v1/events](#retrieve-timeline-events---apiv1events)<br><br>- [Retrieve vulnerability information - /api/v1/reports/vulnerabilities/devices](#retrieve-vulnerability-information---apiv1reportsvulnerabilitiesdevices)<br><br>- [Retrieve security vulnerabilities - /api/v1/reports/vulnerabilities/security](#retrieve-security-vulnerabilities---apiv1reportsvulnerabilitiessecurity)<br><br>- [Retrieve operational vulnerabilities - /api/v1/reports/vulnerabilities/operational](#retrieve-operational-vulnerabilities---apiv1reportsvulnerabilitiesoperational)       |
|**Version 2**     | - [Retrieve alert PCAP - /api/v2/alerts/pcap](#retrieve-alert-pcap---apiv2alertspcap)        |


## Validate user credentials

**URL**: `/api/external/authentication/validation`

Use this API to validate a Defender for IoT username and password. All Defender for IoT user roles can work with the API.

You don't need a Defender for IoT access token to use this API.

### Request

**Method**: POST

**Request type**: JSON

**Query parameters**:

| **Name** | **Type** | **Nullable** |
|--|--|--|
| **username** | String | No |
| **password** | String | No |

**Example**:

```rest
request:

{

    "username": "test",

    "password": "Test12345\!"

}

```

### Response

**Type**: JSON

Message string with the operation status details:

- **Success - msg**: Authentication succeeded

- **Failure - error**: Credentials Validation Failed

**Example**:

```rest
response:

{

    "msg": "Authentication succeeded."

}
```

### Curl command

**Type**: GET

**APIs**:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/external/authentication/validation
```

**Example**:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/external/authentication/validation```

## Change password

**URL**: `/external/authentication/set_password`

Use this API to let users change their own passwords. All Defender for IoT user roles can work with the API. You don't need a Defender for IoT access token to use this API.

### Request

**Method**: POST

**Type**: JSON

**Example**:

```rest
request:

{

    "username": "test",

    "password": "Test12345\!",

    "new_password": "Test54321\!"

}
```

**Parameters**:

| **Name** | **Type** | **Nullable** |
|--|--|--|
| **username** | String | No |
| **password** | String | No |
| **new_password** | String | No |

### Response

**Type**: JSON

Message string with the operation status details:

- **Success – msg**: Password has been replaced

- **Failure – error**: User authentication failure

- **Failure – error**: Password does not match security policy

**Example**:

```rest
response:

{

    "error": {

        "userDisplayErrorMessage": "User authentication failure"

    }

}
```

### Curl command

**Type**: POST

**APIs**:

```rest
curl -k -d '{"username": "<USER_NAME>","password": "<CURRENT_PASSWORD>","new_password": "<NEW_PASSWORD>"}' -H 'Content-Type: application/json'  https://<IP_ADDRESS>/api/external/authentication/set_password
```

**Example**:

```rest
curl -k -d '{"username": "myUser","password": "1234@abcd","new_password": "abcd@1234"}' -H 'Content-Type: application/json'  https://127.0.0.1/api/external/authentication/set_password
```

## User password update by system admin

**URL**: /external/authentication/set_password_by_admin

Use this API to let system administrators change passwords for specified users. Defender for IoT administrator user roles can work with the API. You don't need a Defender for IoT access token to use this API.

### Request

**Method**: POST

**Type**: JSON

**Example**:

```rest
request:

{

    "username": "test",

    "password": "Test12345\!",

    "new_password": "Test54321\!"

}
```

**Parameters**:

| **Name** | **Type** | **Nullable** |
|--|--|--|
| **admin_username** | String | No |
| **admin_password** | String | No |
| **username** | String | No |
| **new_password** | String | No |


### Response

**Type**: JSON

Message string with the operation status details:

- **Success – msg**: Password has been replaced

- **Failure – error**: User authentication failure

- **Failure – error**: User does not exist

- **Failure – error**: Password doesn't match security policy

- **Failure – error**: User does not have the permissions to change password

**Example**:

```rest
response:

{

    "error": {

        "userDisplayErrorMessage": "The user 'test_user' doesn't exist",

        "internalSystemErrorMessage": "The user 'yoavfe' doesn't exist"

    }

}

```


### Curl command

**Type**: POST

**APIs**:

```rest
curl -k -d '{"admin_username":"<ADMIN_USERNAME>","admin_password":"<ADMIN_PASSWORD>","username": "<USER_NAME>","new_password": "<NEW_PASSWORD>"}' -H 'Content-Type: application/json'  https://<IP_ADDRESS>/api/external/authentication/set_password_by_admin
```

**Example**:

```rest
curl -k -d '{"admin_user":"adminUser","admin_password": "1234@abcd","username": "myUser","new_password": "abcd@1234"}' -H 'Content-Type: application/json'  https://127.0.0.1/api/external/authentication/set_password_by_admin
```

## Retrieve device connection information - /api/v1/devices/connections

Use this API to request a list of all the connections per device.

### Method

- **GET**

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

- **JSON**

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

### Curl command

> [!div class="mx-tdBreakAll"]
> | Type | APIs | Example |
> |--|--|--|
> | GET | `curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices/connections` | `curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/v1/devices/connections` |
> | GET | `curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/devices/<deviceId>/connections?lastActiveInMinutes=&discoveredBefore=&discoveredAfter='` | `curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https://127.0.0.1/api/v1/devices/2/connections?lastActiveInMinutes=20&discoveredBefore=1594550986000&discoveredAfter=1594550986000'` |

### Retrieve information on CVEs - /api/v1/devices/cves

Use this API to request a list of all known CVEs discovered on devices in the network.

#### Method

- **GET**

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

- **JSON**

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

### Curl command

| Type | APIs | Example |
|--|--|--|
| GET | `curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices/cves` | `curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/v1/devices/cves` |
| GET | `curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices/<deviceIpAddress>/cves?top=` | `curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/v1/devices/10.10.10.15/cves?top=50` |

### Retrieve alert information - /api/v1/alerts

Use this API to request a list of all the alerts that the Defender for IoT sensor has detected.

#### Method

- **GET**

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

- **JSON**

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

### Curl command

> [!div class="mx-tdBreakAll"]
> | Type | APIs | Example |
> |--|--|--|
> | GET | `curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/alerts?state=&fromTime=&toTime=&type='` | `curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https://127.0.0.1/api/v1/alerts?state=unhandled&fromTime=1594550986000&toTime=1594550986001&type=disconnections'` |

### Retrieve timeline events - /api/v1/events

Use this API to request a list of events reported to the event timeline.

#### Method

- **GET**

#### Query parameters

- **minutesTimeFrame**: Time frame from now backward, by minute, in which the events were reported.

  **Example**:

  `/api/v1/events?minutesTimeFrame=20`

- **type**: To filter the events list by a specific type.

  **Examples**:

  `/api/v1/events?type=DEVICE_CONNECTION_CREATED`

  `/api/v1/events?type=REMOTE_ACCESS&minutesTimeFrame`

#### Response type

- **JSON**

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

### Curl command

| Type | APIs | Example |
|--|--|--|
| GET | `curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/events?minutesTimeFrame=&type='` | `curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https://127.0.0.1/api/v1/events?minutesTimeFrame=20&type=DEVICE_CONNECTION_CREATED'` |

## Retrieve vulnerability information

**URL**: /api/v1/reports/vulnerabilities/devices

Use this API to request vulnerability assessment results for each device.

### Request

**Method**: GET

### Response

**Type**: JSON

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

### Curl command

| Type | APIs | Example |
|--|--|--|
| GET | `curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/reports/vulnerabilities/devices` | `curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/v1/reports/vulnerabilities/devices` |

## Retrieve security vulnerabilities

**URL**: /api/v1/reports/vulnerabilities/security

Use this API to request results of a general vulnerability assessment. This assessment provides insight into your system's security level.

This assessment is based on general network and system information and not on a specific device evaluation.

#### Method

- **GET**

#### Response type

- **JSON**

#### Response content

JSON object that represents assessed results. Each key can be nullable. Otherwise, it will contain a JSON object with non-nullable keys.

#### Result fields

- **Keys**

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

### Curl command

| Type | APIs | Example |
|--|--|--|
| GET | `curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/reports/vulnerabilities/security` | `curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/v1/reports/vulnerabilities/security` |

## Retrieve operational vulnerabilities

**URL**: /api/v1/reports/vulnerabilities/operational

Use this API to request results of a general vulnerability assessment. This assessment provides insight into the operational status of your network. It's based on general network and system information and not on a specific device evaluation.

### Request

- **GET**

### Response

- **JSON**

#### Response content

JSON object that represents assessed results. Each key contains a JSON array of results.

#### Result fields

- **Keys**

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

            "volume": "0.001 MB"

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

### Curl command

| Type | APIs | Example |
|--|--|--|
| GET | `curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/reports/vulnerabilities/operational` | `curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/v1/reports/vulnerabilities/operational` |

## Retrieve alert PCAP

**URL**: /api/v2/alerts/pcap

Use this API to retrieve a PCAP file related to an alert.

This endpoint does not use a regular access token for authorization. Instead, it requires a special token created by the `/external/v2/alerts/pcap` API endpoint on the CM.

### Request

- **GET**

#### Query Parameters

- id: Xsense Alert ID  
Example:  
`/api/v2/alerts/pcap/<id>`

### Response

- **JSON**

#### Response content

- **Success**: Binary file containing PCAP data
- **Failure**: JSON object that contains error message

#### Response example

#### Error

```json
{
  "error": "PCAP file is not available"
}
```

### Curl command

|Type|APIs|Example|
|-|-|-|
|GET|`curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v2/alerts/pcap/<ID>'`|`curl -k -H "Authorization: d2791f58-2a88-34fd-ae5c-2651fe30a63c" 'https://10.1.0.2/api/v2/alerts/pcap/1'`|

## Next steps

For more information, see:

TBD
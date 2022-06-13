---
title: Authentication and password management API reference for OT monitoring sensors - Microsoft Defender for IoT
description: Learn about the REST APIs supported for Microsoft Defender for IoT OT monitoring sensors.
ms.date: 05/25/2022
ms.topic: reference
---

# OT monitoring sensor APIs

This article lists the authentication and password management APIs supported for Defender for IoT OT sensors.

Authentication and password management
Devices - inventory + includes connections, cves
Alerts - alerts and events, pcap
Vulnerabilities reports - all 4


## validation (Validate user credentials)

Use this API to validate a Defender for IoT username and password. All Defender for IoT user roles can work with the API.

You don't need a Defender for IoT access token to use this API.

**URI**: `/api/external/authentication/validation`

### POST

# [Request](#tab/validation-request)

**Request type**: JSON

**Query parameters**:

| **Name** | **Type** | **Required/Optional** |
|--|--|--|
| **username** | String | Required |
| **password** | String | Required |

**Example**:

```rest
request:
{
    "username": "test",
    "password": "Test12345\!"
}
```

# [Response](#tab/validation-response)

**Type**: JSON

Message string with the operation status details:

|Message  |Description  |
|---------|---------|
|**Success - msg**     |  Authentication succeeded       |
|**Failure - error**     |  Credentials validation failed       |

**Example**:

```rest
response:
{
    "msg": "Authentication succeeded."
}
```

# [Curl command](#tab/validation-curl)

**Type**: POST

**APIs**:

```rest
curl -k -X POST -H "Authorization: <AUTH_TOKEN>" -H "Content-Type: application/json" -d '{"username": <USER NAME>, "password": <PASSWORD>}' https://<IP_ADDRESS>/api/external/authentication/validation
```

**Example**:

```rest
curl -k -X POST -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" -H "Content-Type: application/json" -d '{"username": "test", "password": "test"}' https://127.0.0.1/api/external/authentication/validation
```
---

## set_password (Change your password)

Use this API to let users change their own passwords. All Defender for IoT user roles can work with the API. You don't need a Defender for IoT access token to use this API.

**URI**: `/external/authentication/set_password`

### POST

# [Request](#tab/set-password-request)

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
| **username** | String | Required |
| **password** | String | Required |
| **new_password** | String | Required |

# [Response](#tab/set-password-response)


**Type**: JSON

Message string with the operation status details:

|Message  |Description  |
|---------|---------|
|**Success – msg**     |   Password has been replaced      |
|**Failure – error**     |   User authentication failure      |
|**Failure – error**     |   Password does not match security policy      |


**Example**:

```rest
response:

{
    "error": {
        "userDisplayErrorMessage": "User authentication failure"
    }
}
```

# [Curl command](#tab/set-password-curl)

**Type**: POST

**APIs**:

```rest
curl -k -d '{"username": "<USER_NAME>","password": "<CURRENT_PASSWORD>","new_password": "<NEW_PASSWORD>"}' -H 'Content-Type: application/json'  https://<IP_ADDRESS>/api/external/authentication/set_password
```

**Example**:

```rest
curl -k -d '{"username": "myUser","password": "1234@abcd","new_password": "abcd@1234"}' -H 'Content-Type: application/json'  https://127.0.0.1/api/external/authentication/set_password
```

---

## set_password_by_admin (Update a user password by admin)

Use this API to let system administrators change passwords for specified users. Defender for IoT administrator user roles can work with the API. You don't need a Defender for IoT access token to use this API.

**URI**: `/external/authentication/set_password_by_admin`

### POST

# [Request](#tab/set-password-by-admin-request)

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
| **admin_username** | String | Required |
| **admin_password** | String | Required |
| **username** | String | Required |
| **new_password** | String | Required |

# [Response](#tab/set-password-by-admin-response)

**Type**: JSON

Message string with the operation status details:

|Message  |Description  |
|---------|---------|
|**Success – msg**     |   Password has been replaced      |
|**Failure – error**     |   User authentication failure      |
|**Failure – error**     |  User does not exist       |
|**Failure – error**     | Password doesn't match security policy        |
|**Failure – error**     |  User does not have the permissions to change password       |


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
# [Curl command](#tab/set-password-by-admin-curl)


**Type**: POST

**APIs**:

```rest
curl -k -d '{"admin_username":"<ADMIN_USERNAME>","admin_password":"<ADMIN_PASSWORD>","username": "<USER_NAME>","new_password": "<NEW_PASSWORD>"}' -H 'Content-Type: application/json'  https://<IP_ADDRESS>/api/external/authentication/set_password_by_admin
```

**Example**:

```rest
curl -k -d '{"admin_user":"adminUser","admin_password": "1234@abcd","username": "myUser","new_password": "abcd@1234"}' -H 'Content-Type: application/json'  https://127.0.0.1/api/external/authentication/set_password_by_admin
```

---

## connections (Retrieve device connection information)

Use this API to request a list of all the connections per device.

**URI**: `/api/v1/devices/connections`

### GET

# [Request](#tab/connections-request)

**Query parameters**:

Define any of the following query parameters to filter the results returned. If you don't set query parameters, all device connections are returned.

|Name  |Description  |Example  |
|---------|---------|---------|
|**deviceId**     |  Get connections for the given device.       | `/api/v1/devices/<deviceId>/connections`        |
|**lastActiveInMinutes**     | Filter results by a given time frame during which connections were active. Defined backwards from the current time.        |   `/api/v1/devices/2/connections?lastActiveInMinutes=20`      |
|**discoveredBefore**     | Filter results that were detected before a given time, in milliseconds and UTC format.        |   `/api/v1/devices/2/connections?discoveredBefore=<epoch>`      |
|**discoveredAfter**     |Filter results that were given after a given time, in milliseconds and UTC format.         | `/api/v1/devices/2/connections?discoveredAfter=<epoch>`        |

# [Response](#tab/connections-response)

**Response type**: JSON

Array of JSON objects that represent device connections.

**Response fields**

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **firstDeviceId** | Numeric | Required | - |
| **secondDeviceId** | Numeric | Required | - |
| **lastSeen** | Numeric | Required | Epoch (UTC) |
| **discovered** | Numeric | Required | Epoch (UTC) |
| **ports** | Number array | Required | - |
| **protocols** | JSON array | Required | Protocol field |

**Protocol fields**:

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **name** | String | Required | - |
| **commands** | String array | Required | - |

**Response example:**

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

# [Curl command](#tab/connections-curl)

**Type**: GET

**APIs**:

With no query parameters:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices/connections
```

With given query parameters:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/devices/<deviceId>/connections?lastActiveInMinutes=&discoveredBefore=&discoveredAfter=
```

**Examples**:

With no query parameters:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/v1/devices/connections
```

With given query parameters:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https://127.0.0.1/api/v1/devices/2/connections?lastActiveInMinutes=20&discoveredBefore=1594550986000&discoveredAfter=1594550986000
```

---

## cves (Retrieve information on CVEs

Use this API to request a list of all known CVEs discovered on devices in the network.

**URI**:  `/api/v1/devices/cves`

### GET

# [Request](#tab/cves-request)

**Example**: `/api/v1/devices/cves`

Define any of the following query parameters to filter the results returned. If you don't set query parameters, all all device IP addresses with CVEs are returned, including to 100 top-scored CVEs for each IP address.


|Name  |Description  |Example  |
|---------|---------|---------|
|**deviceId**     |  Get CVEs for the given device.       |  `/api/v1/devices/<ipAddress>/cves`       |
|**top**     |    Determine how many top-scored CVEs to get for each device IP address.     |     `/api/v1/devices/cves?top=50` <br><br>  `/api/v1/devices/<ipAddress>/cves?top=50`      |

# [Response](#tab/cves-response)

**Type**: JSON

Array of JSON objects that represent CVEs identified on IP addresses.

**Response fields**

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **cveId** | String | Required | - |
| **ipAddress** | String | Required | IP address |
| **score** | String | Required | 0.0 - 10.0 |
| **attackVector** | String | Required | Network, Adjacent Network, Local, or Physical |
| **description** | String | Required | - |

**Response example:**

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

# [Curl command](#tab/cves-curl)

**Type**: GET

**APIs**:

With no query parameters:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices/cves
```

With given query parameters:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/devices/<deviceIpAddress>/cves?top=
```

**Examples**:

With no query parameters:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/v1/devices/cves
```

With given query parameters:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/v1/devices/10.10.10.15/cves?top=50
```

---


## alerts (Retrieve alert information)

Use this API to request a list of all the alerts that the Defender for IoT sensor has detected.

**URI**: `/api/v1/alerts`

### GET

# [Request](#tab/alerts-request)

**Query parameters**:


|Name  |Description  |Example  |
|---------|---------|---------|
|**state**     | Get only handled or unhandled alerts. Supported values: <br>- `handled`<br>- `unhandled`       |  `/api/v1/alerts?state=handled`       |
|**fromTime**     |   Get alerts created starting at a given time, in milliseconds and UTC format.      |    `/api/v1/alerts?fromTime=<epoch>`     |
|**toTime**     |  Get alerts created only before at a given time, in milliseconds and UTC format.        | `/api/v1/alerts?toTime=<epoch>`        |
|**type**     |  Get alerts of a specific type only. Supported values: <br>- `unexpected new devices` <br>- `disconnections`       |  `/api/v1/alerts?type=disconnections`       |

# [Response](#tab/alerts-response)

**Type**: JSON

**Alert fields**:

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **ID** | Numeric | Required | - |
| **time** | Numeric | Required | Epoch (UTC) |
| **title** | String | Required | - |
| **message** | String | Required | - |
| **severity** | String | Required | Warning, Minor, Major, or Critical |
| **engine** | String | Required | Protocol Violation, Policy Violation, Malware, Anomaly, or Operational |
| **sourceDevice** | Numeric | Optional | Device ID |
| **destinationDevice** | Numeric | Optional | Device ID |
| **sourceDeviceAddress** | Numeric | Optional | IP, MAC |
| **destinationDeviceAddress** | Numeric | Optional | IP, MAC |
| **remediationSteps** | String | Optional | Remediation steps described in alert |
| **additionalInformation** | Additional information object | Optional | - |

> [!NOTE]
> The **/api/v2/** is required to return values for `sourceDeviceAddress`, `destinationDeviceAddress`, and `remediationSteps`.

**Additional information fields**:

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **description** | String | Required | - |
| **information** | JSON array | Required | String |

**Response example**

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

# [Curl command](#tab/alerts-curl)

**Type**: GET

**API**:



```rest
curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/alerts?state=&fromTime=&toTime=&type='
```

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https://127.0.0.1/api/v1/alerts?state=unhandled&fromTime=1594550986000&toTime=1594550986001&type=disconnections'
```

---

## events (Retrieve timeline events)

Use this API to request a list of events reported to the event timeline.

**URI**:  `/api/v1/events`

### GET

# [Request](#tab/events-request)

**Query parameters**:


|Name  |Description  |Example  |
|---------|---------|---------|
|**minutesTimeFrame**     |  Filter results by a given time frame during which events were reported. Defined backwards from the current time.       |   `/api/v1/events?minutesTimeFrame=20`      |
|**type**     |   Get results of a given type only.      |      `/api/v1/events?type=DEVICE_CONNECTION_CREATED` <br><br>  `/api/v1/events?type=REMOTE_ACCESS&minutesTimeFrame`|

# [Response](#tab/events-response)

**Type**: JSON

Array of JSON objects that represent alerts.

**Event fields**:

| Name | Type | Nullable | List of values |
|--|--|--|--|--|
| **timestamp** | Numeric | Required | Epoch (UTC) |
| **title** | String | Required | - |
| **severity** | String | Required | INFO, NOTICE, or ALERT |
| **owner** | String | Optional | If the event was created manually, this field will include the username that created the event |
| **content** | String | Required | - |

**Response example**:

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

# [Curl command](#tab/events-curl)

**Type**: GET

**API**:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/events?minutesTimeFrame=&type='
```

**Example**:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https://127.0.0.1/api/v1/events?minutesTimeFrame=20&type=DEVICE_CONNECTION_CREATED'`
```
---

## device vulnerabilities (Retrieve device vulnerability information)

Use this API to request vulnerability assessment results for each device.

**URI**: `/api/v1/reports/vulnerabilities/devices`

### GET

# [Response](#tab/devices-response)

**Type**: JSON

Array of JSON objects that represent assessed devices.

**Device fields**:

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **name** | String | Required | - |
| **ipAddresses** | JSON array | Required | - |
| **securityScore** | Numeric | Required | - |
| **vendor** | String | Optional |  |
| **firmwareVersion** | String | Optional | - |
| **model** | String | Optional | - |
| **isWirelessAccessPoint** | Boolean | Required | True or false |
| **operatingSystem** | Operating system object | Optional | - |
| **vulnerabilities** | Vulnerabilities object | Optional | - |

**Operating system fields**:

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **Name** | String | Optional | - |
| **Type** | String | Optional | - |
| **Version** | String | Optional | - |
| **latestVersion** | String | Optional | - |

**Vulnerabilities fields**:

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **antiViruses** | JSON array | Optional | Antivirus names |
| **plainTextPasswords** | JSON array | Optional | Password objects |
| **remoteAccess** | JSON array | Optional | Remote access objects |
| **isBackupServer** | Boolean | Required | True or false |
| **openedPorts** | JSON array | Optional | Opened port objects |
| **isEngineeringStation** | Boolean | Required | True or false |
| **isKnownScanner** | Boolean | Required | True or false |
| **cves** | JSON array | Optional | CVE objects |
| **isUnauthorized** | Boolean | Required | True or false |
| **malwareIndicationsDetected** | Boolean | Required | True or false |
| **weakAuthentication** | JSON array | Optional | Detected applications that are using weak authentication |

**Password fields**:

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **password** | String | Required | - |
| **protocol** | String | Required | - |
| **strength** | String | Required | Very weak, Weak, Medium, or Strong |

**Remote access fields**:

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **port** | Numeric | Required | - |
| **transport** | String | Required | TCP or UDP |
| **client** | String | Required | IP address |
| **clientSoftware** | String | Required | SSH, VNC, Remote desktop, or Team viewer |

**Open port fields**

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **port** | Numeric | Required | - |
| **transport** | String | Required | TCP or UDP |
| **protocol** | String | Optional | - |
| **isConflictingWithFirewall** | Boolean | Required | True or false |

**CVE fields**

| Name | Type | Nullable | List of values |
|--|--|--|--|
| **ID** | String | Required | - |
| **score** | Numeric | Required | Double |
| **description** | String | Required | - |

**Response example**:

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

# [Curl command](#tab/devices-curl)

**Type**: GET

**API**:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/reports/vulnerabilities/devices
```

**Example**:

```
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/v1/reports/vulnerabilities/devices
```

---
## security (Retrieve security vulnerabilities)

Use this API to request results of a general vulnerability assessment. This assessment provides insight into your system's security level.

This assessment is based on general network and system information and not on a specific device evaluation.

**URI**: `/api/v1/reports/vulnerabilities/security`

### GET

# [Response](#tab/security-response)

**Type**: JSON

JSON object that represents assessed results. Each key can be nullable. Otherwise, it will contain a JSON object with non-nullable keys.

**unauthorizedDevices fields**

| Field name | Type | List of values |
| ---------- | ---- | -------------- |
| **address** | String | IP address |
| **name** | String | - |
| **firstDetectionTime** | Numeric | Epoch (UTC) |
| lastSeen | Numeric | Epoch (UTC) |

**illegalTrafficByFirewallRules fields**

| Field name | Type | List of values |
| ---------- | ---- | -------------- |
| **server** | String | IP address |
| **client** | String | IP address |
| **port** | Numeric | - |
| **transport** | String | TCP, UDP, or ICMP |

**weakFirewallRules fields**

| Field name | Type | List of values |
| ---------- | ---- | -------------- |
| **sources** | JSON array of sources. Each source can be in any of four formats. | "Any", "ip address (Host", "from ip-to ip (RANGE)", "ip address, subnet mask (NETWORK)" |
| **destinations** | JSON array of destinations. Each destination can be in any of four formats. | "Any", "ipaddress (Host)", "from ip-to ip (RANGE)", "ip address, subnet mask (NETWORK)" |
| **ports** | JSON array of ports in any of three formats | "Any", "port (protocol, if detected)", "fromport-to port (protocol, if detected)" |

**accessPoints fields**

| Field name | Type | List of values |
| ---------- | ---- | -------------- |
| **macAddress** | String | MAC address |
| **vendor** | String | Vendor name |
| **ipAddress** | String | IP address, or N/A |
| **name** | String | Device name, or N/A |
| **wireless** | String | No, Suspected, or Yes |

**connectionsBetweenSubnets fields**

| Field name | Type | List of values |
| ---------- | ---- | -------------- |
| **server** | String | IP address |
| **client** | String | IP address |

**industrialMalwareIndicators fields**

| Field name | Type | List of values |
| ---------- | ---- | -------------- |
| **detectionTime** | Numeric | Epoch (UTC) |
| **alertMessage** | String | - |
| **description** | String | - |
| **devices** | JSON array | Device names |

**internetConnections fields**

| Field name | Type | List of values |
| ---------- | ---- | -------------- |
| **internalAddress** | String | IP address |
| **authorized** | Boolean | Yes or No |
| **externalAddresses** | JSON array | IP address |

**Response example**:

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

# [Curl command](#tab/security-curl)

**Type**: GET

**APIs**:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/reports/vulnerabilities/security
```

**Example**:

```
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/v1/reports/vulnerabilities/security
```
---

## operational (Retrieve operational vulnerabilities)

Use this API to request results of a general vulnerability assessment. This assessment provides insight into the operational status of your network. It's based on general network and system information and not on a specific device evaluation.

**URI**: `/api/v1/reports/vulnerabilities/operational`

# [Request](#tab/operational-request)

**Type**: GET

# [Response](#tab/operational-response)

**Type**: JSON

JSON object that represents assessed results. Each key contains a JSON array of results.


**backupServer result fields**

| Field name | Type | List of values |
|--|--|--|
| **source** | String | IP address |
| **destination** | String | IP address |
| **port** | Numeric | - |
| **transport** | String | TCP or UDP |
| **backupMaximalInterval** | String | - |
| **lastSeenBackup** | Numeric | Epoch (UTC) |

**ipNetworks result fields**

| Field name | Type | List of values |
|--|--|--|
| **addresse**s | Numeric | - |
| **network** | String | IP address |
| **mask** | String | Subnet mask |

**protocolProblems result fields**

| Field name | Type | List of values |
|--|--|--|
| **protocol** | String | - |
| **addresses** | JSON array | IP addresses |
| **alert** | String | - |
| **reportTime** | Numeric | Epoch (UTC) |

**protocolDataVolumes result fields**

| Field name | Type | List of values |
|--|--|--|
| protocol | String | - |
| volume | String | "volume number MB" |

**disconnections result fields**

| Field name | Type | List of values |
|--|--|--|
| **assetAddress** | String | IP address |
| **assetName** | String | - |
| **lastDetectionTime** | Numeric | Epoch (UTC) |
| **backToNormalTime** | Numeric | Epoch (UTC) |

**Response example**

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

# [Curl command](#tab/operational-curl)

**Type**: GET

**APIs**:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/api/v1/reports/vulnerabilities/operational
```

**Example**:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/api/v1/reports/vulnerabilities/operational
```

---
## pcap (Retrieve alert PCAP)

Use this API to retrieve a PCAP file related to an alert.

This endpoint does not use a regular access token for authorization. Instead, it requires a special token created by the `/external/v2/alerts/pcap` API endpoint on the CM.

**URI**: `/api/v2/alerts/pcap`

### GET

# [Request](#tab/pcap-request)

**Query parameters**:

|Name  |Description  |Example  |
|---------|---------|---------|
|**id**     |   The Xsense Alert ID      |   `/api/v2/alerts/pcap/<id>`      |


# [Response](#tab/pcap-response)

**Type**: JSON

One of the following messages:


|Name  |Description  |
|---------|---------|
|**Success**     | Binary file containing PCAP data        |
|**Failure**     |  JSON object that contains error message       |


**Response example**: Error

```json
{
  "error": "PCAP file is not available"
}
```

# [Curl command](#tab/pcap-curl)

**Type**: GET

**APIs**:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v2/alerts/pcap/<ID>'
```

**Example**:

```
curl -k -H "Authorization: d2791f58-2a88-34fd-ae5c-2651fe30a63c" 'https://10.1.0.2/api/v2/alerts/pcap/1'
```
---

## Next steps

For more information, see:

- [Defender for IoT API reference](references-work-with-defender-for-iot-apis.md)
- [On-premises management console API reference](management-api-reference.md)
- [ServiceNow integration API reference (Public preview)](servicenow-api-reference.md)
---
title: Inventory management API reference for OT monitoring sensors - Microsoft Defender for IoT
description: Learn about the device management REST APIs supported for Microsoft Defender for IoT OT monitoring sensors.
ms.date: 06/13/2022
ms.topic: reference
---

# Inventory management API reference for OT monitoring sensors

This article lists the device inventory management APIs supported for Defender for IoT OT sensors.

## devices (Retrieve device information)

TBD

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


## Next steps

For more information, see the [Defender for IoT API reference overview](../references-work-with-defender-for-iot-apis.md).

---
title: Alert management API reference for OT monitoring sensors - Microsoft Defender for IoT
description: Learn about the alert management REST APIs supported for Microsoft Defender for IoT OT monitoring sensors.
ms.date: 05/25/2022
ms.topic: reference
---

# Alert management API reference for OT monitoring sensors

This article lists the alert management REST APIs supported for Microsoft Defender for IoT OT monitoring sensors.


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
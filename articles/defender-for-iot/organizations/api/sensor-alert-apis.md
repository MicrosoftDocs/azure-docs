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


|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**state**     | Get only handled or unhandled alerts. Supported values: <br>- `handled`<br>- `unhandled`  <br>All other values return an error message.     |  `/api/v1/alerts?state=handled`       |Optional |
|**fromTime**     |   Get alerts created starting at a given time, in milliseconds and UTC format.      |    `/api/v1/alerts?fromTime=<epoch>`     | Optional |
|**toTime**     |  Get alerts created only before at a given time, in milliseconds and UTC format.        | `/api/v1/alerts?toTime=<epoch>`        |  Optional |
|**type**     |  Get alerts of a specific type only. Supported values: <br>- `unexpected new devices` <br>- `disconnections`  <br>All other values are ignored.     |  `/api/v1/alerts?type=disconnections`       |Optional |

# [Response](#tab/alerts-response)

**Type**: JSON

A list of alerts with the following fields:

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **ID** | Numeric | Not nullable | - |
| **time** | Numeric | Not nullable | Milliseconds from Epoch time, in UTC format |
| **title** | String | Not nullable | - |
| **message** | String | Not nullable | - |
| **severity** | String | Not nullable | `Warning`, `Minor`, `Major`, or `Critical` |
| **engine** | String | Not nullable | `Protocol Violation`, `Policy Violation`, `Malware`, `Anomaly`, or `Operational` |
| **sourceDevice** | Numeric | Nullable | Device ID |
| **destinationDevice** | Numeric | Nullable | Device ID |
| **additionalInformation** | Additional information object, as described below | Nullable | - |

**Additional information fields**:

| Name | Type |  Nullable / Not nullable | List of values |
|--|--|--|--|
| **description** | String | Not nullable | - |
| **information** | JSON array | Not nullable | String |

**Added for V2**:

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **sourceDeviceAddress** | String | Nullable | IP or MAC  address|
| **destinationDeviceAddress** | String | Nullable | IP or MAC address |
| **remediationSteps** | JSON array | Not nullable | Strings, remediation steps described in alert |

For more information, see [Sensor API version reference](../references-work-with-defender-for-iot-apis.md#sensor-api-version-reference).



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
curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/alerts?state=<STATE>&fromTime=<FROM_TIME>&toTime=<TO_TIME>&type=<TYPE>'
```

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https://127.0.0.1/api/v1/alerts?state=unhandled&fromTime=1594550986000&toTime=1594550986001&type=disconnections'
```

---

## events (Retrieve timeline events)

Use this API to request a list of events reported to the event timeline.

> [!NOTE]
> Running the identical API within the same hour, with the exact same parameter values, returns a cached value. If you are running this API twice in an hour, we recommend that you modify the query parameters to get an updated response.
>

**URI**:  `/api/v1/events`

### GET

# [Request](#tab/events-request)

**Query parameters**:


|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**minutesTimeFrame**     |  Filter results by a given time frame during which events were reported. Defined backwards from the current time.  <br>Maximum = `4320` (3 days). Any larger value is treated as 4320, with no error      |   `/api/v1/events?minutesTimeFrame=20`      |Optional |
|**type**     |   Get results of a given type only.  81 supported types, any other will be ignored. For more information, see <x>.    |      `/api/v1/events?type=DEVICE_CONNECTION_CREATED` <br><br>  `/api/v1/events?type=REMOTE_ACCESS&minutesTimeFrame`|Optional |

Supported types include:



:::row:::
   :::column span="":::
   ALERT_REPORTED
   ALERT_UPDATED
   BACK_TO_NORMAL
   CAMP_MEMORY_WRITE_OPERATION
   CLEARTEXT_AUTHENTICATION
   CONFIGURATION_CHANGE
   CONFIGURATION_OF_CLEARTEXT_PASSWORD
   CONFIGURATION_READ
   CUSTOM_EVENT
   DATABASE_ACTION
   DELETE_DEVICE
   DELETE_DEVICE_SCHEDULE
   DELTAV_PROGRAMMING
   DEVICE_CONNECTION_CREATED
   DEVICE_CREATE
   DEVICE_UNIFICATION
   DEVICE_UPDATE
   DHCP_UPDATE
   DIP_FAILURE
   :::column-end:::
   :::column span="":::
    DIP_UPLOADED
    ENIP_CONTROLLER_GENERIC_RESET
    ENIP_CONTROLLER_GENERIC_START
    ENIP_CONTROLLER_GENERIC_STOP
    ENIP_CONTROLLER_PROGRAM_DELETE
    ENIP_CONTROLLER_PROGRAM_RESET
    EXCLUSION_RULE_CREATED
    EXCLUSION_RULE_REMOVED
    EXCLUSION_RULE_UPDATED
    FILE_TRANSFER
    FIRMWARE_CHANGED
    FIRMWARE_UPDATE
    FTP_AUTHENTICATION_FAILURE
    HARDWARE_UPDATE_BY_IDENTIFIER
    HTTP_BASIC_AUTHENTICATION
    INTERNET_ACCESS
    MMS_MEMORY_BLOCK_OPERATION
    MMS_PROGRAM_DEVICE
    MMS_PROGRAM_OPERATION
   :::column-end:::
   :::column span="":::
   MUTED_ALERT
   NOTIFICATION
   OPC_AE_EVENT
   OPC_AE_EVENT_CONDITION_MANAGEMENT_OPERATION
   OPC_AE_EVENT_SUBSCRIPTION
   OPC_DATA_ACCESS_GROUP_MANAGEMENT_OPERATION
   OPC_DATA_ACCESS_IO_SUBSCRIPTION_MANAGEMENT_OPERATION
   OPC_DATA_ACCESS_ITEM_MANAGEMENT_OPERATION
   PLC_MODULE_CHANGE
   PLC_OPERATING_MODE_CHANGED
   PLC_START
   PROFINET_DPC_VALUE_SET
   PROGRAM_DEVICE
   PROGRAM_UPLOAD_DEVICE
   REMOTE_ACCESS
   REMOTE_PROCESS_EXECUTION
   REPORT_CREATED
   S7_PLC_MODE_CHANGE
   S7PLUS_PLC_MODE_CHANGE
   :::column-end:::
   :::column span="":::
   S7PLUS_PROGRAMMING
   SCAN
   SCL_UPLOADED
   SIEMENS_S_7_AUTHENTICATION
   SIEMENS_S_7_MEMORY_BLOCK_OPERATION
   SNMP_TRAP
   SRTP_CHANGE_LEVEL_FAILED
   SRTP_CHANGE_PRIVILEGE
   SRTP_LOGIN_PROGRAMMING
   SRTP_PLC_CHANGE_PASSWORD
   SRTP_PLC_COPY_FIRMWARE
   SRTP_PLC_RESET
   SUITELINK_INIT_CONNECTION
   SYSLOG_MSG
   TELNET_AUTHENTICATION_FAILURE
   USER_DEFINED_RULE_CREATED
   USER_DEFINED_RULE_DELETED
   USER_DEFINED_RULE_EDITED
   USER_DEFINED_RULE_OPERATION
   USER_LOGIN
   USER_OPERATION
   :::column-end:::
:::row-end:::

# [Response](#tab/events-response)

**Type**: JSON

Array of JSON objects that represent the latest 100 events, sorted by event timestamp, with the latest event first.

Event fields include:

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|--|
| **timestamp** | Numeric | Not nullable | Milliseconds from Epoch, in UTC format |
| **type** | String | Not nullable | One of the supported types <SEE ELSEWHERE>  GET THIS FROM HADAR |
| **title** | String | Not nullable | One of the supported types (in brown) GET THIS FROM HADAR |
| **severity** | String | Not nullable | `INFO`, `NOTICE`, or `ALERT` |
| **owner** | String | Nullable | String. If the event was created manually, this field will include the username that created the event. |
| **content** | String | Not nullable | String that describes the event. |

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
curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/events?minutesTimeFrame=<TIME_FRAEM>&type=<TYPE>'
```

**Example**:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https://127.0.0.1/api/v1/events?minutesTimeFrame=20&type=DEVICE_CONNECTION_CREATED'`
```
---
HERE WE STOPPED

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

For more information, see the [Defender for IoT API reference overview](../references-work-with-defender-for-iot-apis.md).
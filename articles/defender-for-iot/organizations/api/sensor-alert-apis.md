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

#### Query parameters

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**state**     | Get only handled or unhandled alerts. Supported values: <br>- `handled`<br>- `unhandled` |  `/api/v1/alerts?state=handled`       |Optional |
|**fromTime**     |   Get alerts created starting at a given time, in milliseconds from [Epoch time](../references-work-with-defender-for-iot-apis.md#epoch-time) and in UTC timezone.      |    `/api/v1/alerts?fromTime=<epoch>`     | Optional |
|**toTime**     |  Get alerts created only before at a given time, in milliseconds from [Epoch time](../references-work-with-defender-for-iot-apis.md#epoch-time) and in UTC timezone.        | `/api/v1/alerts?toTime=<epoch>`        |  Optional |
|**type**     |  Get alerts of a specific type only. Supported values: <br>- `unexpected new devices` <br>- `disconnections`  <br>All other values are ignored.     |  `/api/v1/alerts?type=disconnections`       |Optional |

# [Response](#tab/alerts-response)

**Type**: JSON

A list of alerts with the following fields:

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **ID** | Numeric | Not nullable | - |
| **time** | Numeric | Not nullable | Milliseconds from [Epoch time](../references-work-with-defender-for-iot-apis.md#epoch-time), in UTC timezone |
| **title** | String | Not nullable | - |
| **message** | String | Not nullable | - |
| **severity** | String | Not nullable | `Warning`, `Minor`, `Major`, or `Critical` |
| **engine** | String | Not nullable | `Protocol Violation`, `Policy Violation`, `Malware`, `Anomaly`, or `Operational` |
| **sourceDevice** | Numeric | Nullable | Device ID |
| **destinationDevice** | Numeric | Nullable | Device ID |
| **additionalInformation** | [Additional information object](#additional-information-fields) | Nullable | - |

#### Additional information fields

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

# [cURL command](#tab/alerts-curl)

**Type**: GET

**API**:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/api/v1/alerts?state=<STATE>&fromTime=<FROM_TIME>&toTime=<TO_TIME>&type=<TYPE>'
```

**Example**:

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

#### Query parameters


|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**minutesTimeFrame**     |  Filter results by a given time frame during which events were reported. Defined backwards from the current time.  <br>Maximum = `4320` (3 days). Any larger value is treated as 4320, with no error      |   `/api/v1/events?minutesTimeFrame=20`      |Optional |
|**type**     |   Filter results for a specific type only. Any value other than supported types is ignored. For more information, see [Event `type` and `title` reference](#event-type-and-title-reference).    |      `/api/v1/events?type=DEVICE_CONNECTION_CREATED` <br><br>  `/api/v1/events?type=REMOTE_ACCESS&minutesTimeFrame`|Optional |

# [Response](#tab/events-response)

**Type**: JSON

Array of JSON objects that represent the latest 100 events, sorted by event timestamp, with the latest event first.

Event fields include:

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|--|
| **timestamp** | Numeric | Not nullable | Milliseconds from [Epoch time](../references-work-with-defender-for-iot-apis.md#epoch-time), in UTC timezone |
| **type** | String | Not nullable | One of the [supported types](#event-type-and-title-reference) |
| **title** | String | Not nullable | One of the [supported titles](#event-type-and-title-reference) |
| **severity** | String | Not nullable | `INFO`, `NOTICE`, or `ALERT` |
| **owner** | String | Nullable | String. If the event was created manually, this field will include the username that created the event. |
| **content** | String | Not nullable | String that describes the event. |

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

# [cURL command](#tab/events-curl)

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

## Event `type` and `title` reference

This section lists the values supported as event *type* and *title* values for the [events](#events-retrieve-timeline-events) API.


| Event type                                           | Event title                                          |
| ---------------------------------------------------- | ---------------------------------------------------- |
| DEVICE_CREATE                                        | Device Detected                                      |
| DEVICE_UPDATE                                        | Device Updated                                       |
| ALERT_REPORTED                                       | Alert Detected                                       |
| ALERT_UPDATED                                        | Alert Updated                                        |
| SCAN                                                 | Scan Device Detected                                 |
| PROGRAM_DEVICE                                       | PLC Programming                                      |
| MMS_PROGRAM_DEVICE                                   | PLC Program Update                                   |
| SCL_UPLOADED                                         | SCL Uploaded                                         |
| EXCLUSION_RULE_CREATED                               | Exclusion Rule Created                               |
| EXCLUSION_RULE_REMOVED                               | Exclusion Rule Removed                               |
| EXCLUSION_RULE_UPDATED                               | Exclusion Rule Updated                               |
| DEVICE_CONNECTION_CREATED                            | Device Connection Detected                           |
| USER_LOGIN                                           | User Login Attempt                                   |
| FILE_TRANSFER                                        | File Transfer Detected                               |
| CUSTOM_EVENT                                         | User Defined Event                                   |
| REMOTE_ACCESS                                        | Remote Access Connection Established                 |
| BACK_TO_NORMAL                                       | Back to Normal                                       |
| MMS_MEMORY_BLOCK_OPERATION                           | MMS Memory Block Operation                           |
| MMS_PROGRAM_OPERATION                                | MMS Program Operation                                |
| HTTP_BASIC_AUTHENTICATION                            | HTTP Basic Authentication                            |
| SIEMENS_S_7_MEMORY_BLOCK_OPERATION                   | Siemens S7 Memory Block Operation                    |
| SIEMENS_S_7_AUTHENTICATION                           | Siemens S7 Authentication                            |
| REPORT_CREATED                                       | Report Created                                       |
| SNMP_TRAP                                            | SNMP Trap detected                                   |
| DATABASE_ACTION                                      | Database Structure Manipulation                      |
| PLC_MODULE_CHANGE                                    | PLC Module Change                                    |
| FIRMWARE_UPDATE                                      | Firmware Update                                      |
| PLC_START                                            | PLC Start                                            |
| SRTP_PLC_RESET                                       | PLC Reset                                            |
| SRTP_PLC_COPY_FIRMWARE                               | Firmware Update                                      |
| SRTP_LOGIN_PROGRAMMING                               | PLC Programming Mode Set                             |
| SRTP_PLC_CHANGE_PASSWORD                             | PLC Password Change                                  |
| OPC_DATA_ACCESS_GROUP_MANAGEMENT_OPERATION           | OPC Data Access Group Management Operation           |
| OPC_DATA_ACCESS_ITEM_MANAGEMENT_OPERATION            | OPC Data Access Item Management Operation            |
| OPC_DATA_ACCESS_IO_SUBSCRIPTION_MANAGEMENT_OPERATION | OPC Data Access IO Subscription Management Operation |
| OPC_AE_EVENT_SUBSCRIPTION                            | OPC AE Event Subscription                            |
| OPC_AE_EVENT_CONDITION_MANAGEMENT_OPERATION          | OPC AE Event Condition Management Operation          |
| OPC_AE_EVENT                                         | OPC AE Event                                         |
| SRTP_CHANGE_PRIVILEGE                                | PLC Change access level                              |
| SRTP_CHANGE_LEVEL_FAILED                             | PLC Change access level failed                       |
| SUITELINK_INIT_CONNECTION                            | Wonderware session initialized                       |
| USER_OPERATION                                       | User Operation                                       |
| DIP_UPLOADED                                         | Data Intelligence Package Uploaded                   |
| FTP_AUTHENTICATION_FAILURE                           | FTP Authentication Failure                           |
| PROFINET_DPC_VALUE_SET                               | Profinet SET operation                               |
| S7PLUS_PLC_MODE_CHANGE                               | PLC Mode Change                                      |
| S7_PLC_MODE_CHANGE                                   | PLC Mode Change                                      |
| DELETE_DEVICE                                        | Device Deleted                                       |
| S7PLUS_PROGRAMMING                                   | PLC Programming                                      |
| FIRMWARE_CHANGED                                     | PLC Firmware Changed                                 |
| DELTAV_PROGRAMMING                                   | DeltaV Install Script                                |
| USER_DEFINED_RULE_CREATED                            | User Defined Rule Created                            |
| USER_DEFINED_RULE_EDITED                             | User Defined Rule Edited                             |
| USER_DEFINED_RULE_DELETED                            | User Defined Rule Deleted                            |
| USER_DEFINED_RULE_OPERATION                          | User Defined Rule Operation                          |
| REMOTE_PROCESS_EXECUTION                             | Remote Process Execution                             |
| DEVICE_UNIFICATION                                   | Device Updated                                       |
| NOTIFICATION                                         | Notification was resolved manually                   |
| ENIP_CONTROLLER_PROGRAM_DELETE                       | Controller Program Delete                            |
| ENIP_CONTROLLER_PROGRAM_RESET                        | Controller Program Reset                             |
| ENIP_CONTROLLER_GENERIC_RESET                        | Controller Reset                                     |
| ENIP_CONTROLLER_GENERIC_STOP                         | Controller Stop                                      |
| ENIP_CONTROLLER_GENERIC_START                        | Controller Start                                     |
| TELNET_AUTHENTICATION_FAILURE                        | Telnet Authentication Failure                        |
| CONFIGURATION_OF_CLEARTEXT_PASSWORD                  | Configuration Of Cleartext Password                  |
| CLEARTEXT_AUTHENTICATION                             | Cleartext Authentication                             |
| PROGRAM_UPLOAD_DEVICE                                | PLC Program Upload                                   |
| CONFIGURATION_CHANGE                                 | PLC Configuration Write                              |
| CONFIGURATION_READ                                   | PLC Configuration Read                               |
| SYSLOG_MSG                                           | Syslog Message                                       |
| INTERNET_ACCESS                                      | Internet Access                                      |
| CAMP_MEMORY_WRITE_OPERATION                          | Common ASCII Message Protocol Memory Write Operation |
| MUTED_ALERT                                          | Event Detected and Muted                             |
| DHCP_UPDATE                                          | Address Update                                      |
| DIP_FAILURE                                          | Data Intelligence Package Installation Failure       |
| DELETE_DEVICE_SCHEDULE                               | Inactive Devices Scheduled for deletion              |
| PLC_OPERATING_MODE_CHANGED                           | PLC Operating Mode Change Detected                   |
| HARDWARE_UPDATE_BY_IDENTIFIER                        | Address Update                                       |

## Next steps

For more information, see the [Defender for IoT API reference overview](../references-work-with-defender-for-iot-apis.md).
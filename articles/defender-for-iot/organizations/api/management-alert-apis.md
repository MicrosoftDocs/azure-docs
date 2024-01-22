---
title: Alert management API reference for on-premises management consoles - Microsoft Defender for IoT
description: Learn about the alert management REST APIs supported for Microsoft Defender for IoT on-premises management consoles.
ms.date: 06/13/2022
ms.topic: reference
---

# Alert management API reference for on-premises management consoles

This article lists the alert management REST APIs supported for Microsoft Defender for IoT on-premises management consoles.

## alerts (Retrieve alert information)

Use this API to retrieve all or filtered alerts from an on-premises management console.

**URI**:  `/external/v1/alerts` or `/external/v2/alerts`

### GET

# [Request](#tab/alerts-get-request)

**Query parameters**:

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**state**     | Get only handled or unhandled alerts. Supported values: <br>- `handled`<br>- `unhandled`    <br>All other values are ignored.   |  `/api/v1/alerts?state=handled`       |Optional |
|**fromTime**     |   Get alerts created starting at a given time, in milliseconds from Epoch time and in UTC timezone.      |    `/api/v1/alerts?fromTime=<epoch>`     | Optional |
|**toTime**     |  Get alerts created only before at a given time, in milliseconds from Epoch time and in UTC timezone.        | `/api/v1/alerts?toTime=<epoch>`        |  Optional |
|**siteId**     |  The site on which the alert was discovered.       |  `/api/v1/alerts?siteId=1`     |Optional |
|**zoneId**     |  The zone on which the alert was discovered.       |  `/api/v1/alerts?zoneId=1`     |Optional |
|**sensorId**     |    The sensor on which the alert was discovered.     |   `/api/v1/alerts?sensorId=1`     |Optional |

> [!NOTE]
> You might not have the site and zone ID. If this is the case, first query all devices to retrieve the site and zone ID. For more information, see [Integration API reference for on-premises management consoles (Public preview)](management-integration-apis.md).



# [Response](#tab/alerts-get-response)

**Type**: JSON

A list of alerts with the following fields:

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **Id** | Numeric | Not nullable | - |
| **sensorId** | Numeric | Not nullable | - |
| **zoneId**  | Numeric | Not nullable | - |
| **time** | Numeric | Not nullable | Milliseconds from [Epoch time](../references-work-with-defender-for-iot-apis.md#epoch-time), in UTC timezone|
| **title** | String | Not nullable | - |
| **message** | String | Not nullable | - |
| **severity** | String | Not nullable | `Warning`, `Minor`, `Major`, or `Critical` |
| **engine** | String | Not nullable | `Protocol Violation`, `Policy Violation`, `Malware`, `Anomaly`, or `Operational` |
| **sourceDevice** | Numeric | Nullable | Device ID |
| **destinationDevice** | Numeric | Nullable | Device ID |
| **remediationSteps** | String | Nullable | Remediation steps shown in alert|
| **additionalInformation** | Additional information object | Nullable | - |
| **handled** | Boolean, state of the alert | Not nullable | `true` or `false` |


<a name="add-info"></a>**Additional information fields**:

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
| **sensorName** | String | Not nullable | Name of sensor defined by user |
|**zoneName** | String | Not nullable | Name of zone associated with sensor|
| **siteName** | String | Not nullable | Name of site associated with sensor |
|

For more information, see [Sensor API version reference](../references-work-with-defender-for-iot-apis.md#sensor-api-version-reference).

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

# [cURL command](#tab/alerts-get-curl)

**Type**: GET

**API**:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<>IP_ADDRESS>/external/v1/alerts?state=&zoneId=&fromTime=&toTime=&siteId=&sensor='
```

**Example**:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https://127.0.0.1/external/v1/alerts?state=unhandled&zoneId=1&fromTime=0&toTime=1594551777000&siteId=1&sensor=1'
```

---

## UUID (Manage alerts based on the UUID)

Use this API to take specified action on a specific alert detected by Defender for IoT.

For example, you can use this API to create a forwarding rule that forwards data to QRadar. For more information, see [Integrate Qradar with Microsoft Defender for IoT](../tutorial-qradar.md).

**URI**: `/external/v1/alerts/<UUID>`

### PUT


# [Request](#tab/uuid-request)

**Type**: JSON

**Query parameters**:

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**UUID**     | Defines the universally unique identifier (UUID) for the alert you want to handle or handle and learn. |  `/api/v1/alerts/7903F632-H7EJ-4N69-F40F-4B1E689G00Q0`       |Required |

**Body parameters**

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
| **action** | String | Either `handle` or `handleAndLearn` | Required |



**Request example**

```rest
{
    "action": "handle"
}

```
# [Response](#tab/uuid-response)

**Type**: JSON


Array of JSON objects that represent devices.

**Response fields**:

| Name | Type | Required / Optional | Description |
|--|--|--|--|
| **content / error** | String | Required | If the request is successful, the content property appears. Otherwise, the error property appears. |

**Possible content values**:

| Status code | Message | Description |
|--|--|--|
| **200** | Alert update request finished successfully. | The update request finished successfully. No comments. |
| **200** | Alert was already handled (**handle**). | The alert was already handled when a handle request for the alert was received.<br />The alert remains **handled**. |
| **200** | Alert was already handled and learned (**handleAndLearn**). | The alert was already handled and learned when a request to **handleAndLearn** was received.<br />The alert remains in the **handledAndLearn** status. |
| **200** | Alert was already handled (**handled**).<br />Handle and learn (**handleAndLearn**) was performed on the alert. | The alert was already handled when a request to **handleAndLearn** was received.<br />The alert becomes **handleAndLearn**. |
| **200** | Alert was already handled and learned (**handleAndLearn**). Ignored handle request. | The alert was already **handleAndLearn** when a request to handle the alert was received. The alert stays **handleAndLearn**. |
| **500** | Invalid action. | The action that was sent is not a valid action to perform on the alert. |
| **500** | Unexpected error occurred. | An unexpected error occurred. To resolve the issue, contact Technical Support. |
| **500** | Couldn't execute request because no alert was found for this UUID. | The specified alert UUID was not found in the system. |



### Response example: Successful

```rest
{
    "content": "Alert update request finished successfully"
}
```

### Response example: Unsuccessful

```rest
{
    "error": "Invalid action"
}
```

# [cURL command](#tab/uuid-curl)

**Type**: PUT

**APIs**:

```rest
curl -k -X PUT -d '{"action": "<ACTION>"}' -H "Authorization: <AUTH_TOKEN>" https://<IP_ADDRESS>/external/v1/alerts/<UUID>
```

**Example**:

```rest
curl -k -X PUT -d '{"action": "handle"}' -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/external/v1/alerts/1-1594550943000
```
---

## maintenanceWindow (Create alert exclusions)

Manages maintenance windows, under which alerts won't be sent. Use this API to define and update stop and start times, devices, or subnets that should be excluded when triggering alerts, or define and update Defender for IoT engines that should be excluded.

For example, during a maintenance window, you might want to stop alert delivery of all alerts, except for malware alerts on critical devices.

The maintenance windows that define with the `maintenanceWindow` API appear in the on-premises management console's Alert Exclusions window as a read-only exclusion rule, named with the following syntax: `Maintenance-{token name}-{ticket ID}`.


> [!IMPORTANT]
> This API is supported for maintenance purposes only and for a limited time period, and is not meant to be used instead of [alert exclusion rules](../how-to-accelerate-alert-incident-response.md#create-alert-exclusion-rules-on-an-on-premises-management-console). Use this API for one-time, temporary maintenance operations only.

**URI**: `/external/v1/maintenanceWindow`

### POST

Creates a new maintenance window.

# [Request](#tab/maintenanceWindow-request-post)

**Body parameters**:

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**ticketId**     | String. Defines the maintenance ticket ID in the user's systems.  Make sure that the ticket ID is not linked to an existing open window.      | `2987345p98234` | Required |
|**ttl**     |  Positive integer. Defines the TTL (time to live), which is the duration of the maintenance window, in minutes. After the defined time period is completed, the maintenance window is over and the system behaves normally again.     | `180`| Required|
|**engines**     | JSON array of strings. Defines which engine to suppress alerts from during the maintenance window. Possible values: <br><br>    - `ANOMALY`<br>    - `MALWARE`<br>    - `OPERATIONAL`<br>    - `POLICY_VIOLATION`<br>    - `PROTOCOL_VIOLATION`       | `ANOMALY,OPERATIONAL`| Optional|
|**sensorIds**     | JSON array of strings. Defines which sensors to suppress alerts from during the maintenance window. You can get these sensor IDs from the [appliances (Manage OT sensor appliances)](management-appliances-apis.md#appliances-manage-ot-sensor-appliances) API.        | `1,35,63`| Optional |
|**subnets**     |  JSON array of strings. Defines the subnets to suppress alerts from during the maintenance window. Define each subnet in a CIDR notation.      | `192.168.0.0/16,138.136.80.0/14,112.138.10.0/8`  | Optional|

# [Response](#tab/maintenanceWindow-response-post)

| Status code | Message | Description |
|--|--|--|
|**201 (Created)**     | - | The action was successfully completed.       |
|**400 (Bad Request)**     | No TicketId | API request was missing a `ticketId` value.|
|**400 (Bad Request)**     | Illegal TTL | API request included a non-positive or non-numeric TTL value. |
|**400 (Bad Request)**     | Couldn't parse request.  | Issue parsing the body, such as incorrect parameters or invalid values.|
|**400 (Bad Request)**     | Maintenance window with same parameters already exists. | Appears when an existing maintenance window already exists with the same details. |
|**404 (Not Found)**     | Unknown sensor ID | One of the sensors listed in the request doesn't exist.        |
|**409 (Conflict)**     | Ticket ID already has an open window. | The ticket ID is linked to another open maintenance window.        |
|**500 (Internal Server Error)**     | - | Any other unexpected error.      |

# [cURL command](#tab/maintenanceWindow-post-curl)

**Type**: POST

**API**:

```rest
curl -k -X POST -d '{"ticketId": "<TICKET_ID>",ttl": <TIME_TO_LIVE>,"engines": [<ENGINE1, ENGINE2...ENGINEn>],"sensorIds": [<SENSOR_ID1, SENSOR_ID2...SENSOR_IDn>],"subnets": [<SUBNET1, SUBNET2....SUBNETn>]}' -H "Authorization: <AUTH_TOKEN>" https://<IP address>/external/v1/maintenanceWindow
```

**Example**:

```rest
curl -k -X POST -d '{"ticketId": "a5fe99c-d914-4bda-9332-307384fe40bf","ttl": "20","engines": ["ANOMALY"],"sensorIds": ["5","3"],"subnets": ["10.0.0.0/16"]}' -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/external/v1/maintenanceWindow
```
---

### DELETE

Closes an existing maintenance window.

# [Request](#tab/maintenanceWindow-delete-request)

**Query parameters**:

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**ticketId**     |   Defines the maintenance ticket ID in the user's systems.   Make sure that the ticket ID is linked to an existing open window.   | `2987345p98234` |Required |

# [Response](#tab/maintenanceWindow-delete-response)

**Error codes**:

|Code  | Message |Description  |
|---------|---------|---------|
|**200 (OK)**    | - |  The action was successfully completed.       |
|**400 (Bad Request)** |  No TicketId  | The **ticketId** parameter is missing from the request.       |
|**404 (Not Found)**:   | Maintenance window not found. |  The ticket ID is not linked to an open maintenance window.       |
|**500 (Internal Server Error)**  |  - |  Any other unexpected error.       |


# [cURL command](#tab/maintenanceWindow-delete-curl)

**Type**: DELETE

**API**:

```rest
curl -k -X DELETE -d '{"ticketId": "<TICKET_ID>"}' -H "Authorization: <AUTH_TOKEN>" https://<IP address>/external/v1/maintenanceWindow
```

**Example**:

```rest
curl -k -X DELETE -d '{"ticketId": "a5fe99c-d914-4bda-9332-307384fe40bf"}' -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/external/v1/maintenanceWindow
```

---

### GET

Retrieve a log of all the *open* ([POST](#post)), *close* ([DELETE](#delete)), and *update* ([PUT](#put)) actions that were performed using this API for handling maintenance windows. T

# [Request](#tab/maintenanceWindow-request-put)

**Query parameters**:

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
| **fromDate** | Filters the logs from the predefined date and later. The format is `YYYY-MM-DD`.|`2022-08-10` |Optional |
| **toDate** | Filters the logs up to the predefined date. The format is `YYYY-MM-DD`. |`2022-08-10` | Optional|
| **ticketId** | Filters the logs related to a specific ticket ID. | `9a5fe99c-d914-4bda-9332-307384fe40bf` |Optional |
| **tokenName** | Filters the logs related to a specific token name. | quarterly-sanity-window |Optional |

**Error codes**:

|Code  |Message  | Description |
|---------|---------|---------|
|**200**     | OK | The action was successfully completed.       |
|**204**:     | No Content | There is no data to show.      |
|**400**  | Bad Request   | The date format is incorrect.     |
|**500**     |    Internal Server Error    | Any other unexpected error.  |


# [Response](#tab/maintenanceWindow-response-put)

**Type**: JSON

Array of JSON objects that represent maintenance window operations.

**Response structure**:

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **id** | Long integer | Not nullable | An internal ID for the current log |
| **dateTime** | String | Not nullable | The time that the activity occurred, for example:  `2022-04-23T18:25:43.511Z `|
| **ticketId** | String | Not nullable | The maintenance window ID. For example: `9a5fe99c-d914-4bda-9332-307384fe40bf` |
| **tokenName** | String | Not nullable | The maintenance window token name. For example: `quarterly-sanity-window` |
| **engines** | Array of strings | Nullable | The engines on which the maintenance window applies, as supplied during maintenance window creation: `Protocol Violation`, `Policy Violation`, `Malware`, `Anomaly`, or `Operational`  |
| **sensorIds** | Array of string | Nullable| The sensors on which the maintenance window applies, as supplied during maintenance window creation. |
| **subnets** | Array of string | Nullable | The subnets on which the maintenance window applies, as supplied during maintenance window creation.|
| **ttl** | Numeric | Nullable | The maintenance window's Time to Live (TTL), as supplied during maintenance window creation or update. |
| **operationType** | String | Not nullable | One of the following values: `OPEN`, `UPDATE`, and `CLOSE` |

# [cURL command](#tab/maintenanceWindow-get-curl)

**Type**: GET

**API**:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/external/v1/maintenanceWindow?fromDate=&toDate=&ticketId=&tokenName='
```

**Example**:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https://127.0.0.1/external/v1/maintenanceWindow?fromDate=2020-01-01&toDate=2020-07-14&ticketId=a5fe99c-d914-4bda-9332-307384fe40bf&tokenName=a'
```

---
### PUT

Allows you to update the maintenance window duration after you start the maintenance process by changing the `ttl` parameter. The new duration definition overrides the previous one.

This method is useful when you want to set a longer duration than the currently configured duration. For example, if you've originally defined 180 minutes, 90 minutes have passed, and you want to add another 30 minutes, update the `ttl` to `120` minute to reset the duration count.

# [Request](#tab/maintenanceWindow-put-request)

**Query parameters**:

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**ticketId**     |  String. Defines the maintenance ticket ID in the user's systems.      | `2987345p98234` | Required |
|**ttl**     | Positive integer. Defines the duration of the window in minutes.       |  `210` | Required |

# [Response](#tab/maintenanceWindow-put-response)

**Error codes**:

|Code  | Message |Description  |
|---------|---------|---------|
|**200 (OK)**  | -   |  The action was successfully completed.       |
|**400 (Bad Request)**   | No TicketId  | The request is missing a `ticketId` value. |
|**400 (Bad Request)**  | Illegal TTL   | The TTL defined is not numeric or not a positive integer.  |
|**400 (Bad Request)**  | Couldn't parse request   | The request is missing a `ttl` parameter value.        |
|**404 (Not Found)**  | Maintenance window not found   |  The ticket ID is not linked to an open maintenance window.       |
|**500 (Internal Server Error)** | -     |  Any other unexpected error.       |


# [cURL command](#tab/maintenanceWindow-put-curl)

**Type**: PUT

**API**:

```rest
curl -k -X PUT -d '{"ticketId": "<TICKET_ID>",ttl": "<TIME_TO_LIVE>"}' -H "Authorization: <AUTH_TOKEN>" https://<IP address>/external/v1/maintenanceWindow
```

**Example**:

```rest
curl -k -X PUT -d '{"ticketId": "a5fe99c-d914-4bda-9332-307384fe40bf","ttl": "20"}' -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/external/v1/maintenanceWindow
```
---


## pcap (Request alert PCAP)

Use this API to request a PCAP file related to an alert.

**URI**: `/external/v2/alerts/`

### GET

# [Request](#tab/pcap-request)

**Query parameters**:

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|
|**id**     | Alert ID from the on-premises management console        |    `/external/v2/alerts/pcap/<id>`     | Required |

# [Response](#tab/pcap-response)

**Type**: JSON

Message string with the operation status details:

| Status code | Message | Description |
|--|--|--|
|**200 (OK)**    | - |  JSON object with data about the requested PCAP file. For more information, see [Data fields](#data-fields).    |
|**500 (Internal Server Error)**| Alert not found     |  The supplied alert ID wasn't found on the on-premises management console.    |
|**500 (Internal Server Error)**|  Error while getting token for xsense id `<number>`  | An error occurred when getting the sensor's token for the specified sensor ID   |
|**500 (Internal Server Error)**|   -   |  Any other unexpected error.    |

#### Data fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
|**id**|Numeric|Not nullable| The on-premises management console alert ID |
|**xsenseId**|Numeric|Not nullable| The sensor ID |
|**xsenseAlertId**|Numeric|Not nullable| The sensor console alert ID |
|**downloadUrl**|String|Not nullable| The URL used to download the PCAP file |
|**token**|String|Not nullable| The sensor's token, to be used when downloading the PCAP file |


### Response example: Success

```json
{
  "downloadUrl": "https://10.1.0.2/api/v2/alerts/pcap/1",
  "xsenseId": 1,
  "token": "d2791f58-2a88-34fd-ae5c-2651fe30a63c",
  "id": 1,
  "xsenseAlertId": 1
}
```

### Response example: Error


```json
{
  "error": "alert not found"
}
```

# [cURL command](#tab/pcap-curl)

**Type**: GET

**APIs**

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/external/v2/alerts/pcap/<ID>'
```

***Example**:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https://10.1.0.1/external/v2/alerts/pcap/1'
```
---

## Next steps

For more information, see the [Defender for IoT API reference overview](../references-work-with-defender-for-iot-apis.md).
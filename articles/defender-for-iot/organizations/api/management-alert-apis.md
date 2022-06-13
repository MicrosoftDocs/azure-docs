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

**URI**:  `/external/v1/alerts`

### GET

# [Request](#tab/alerts-get-request)

**Query parameters**:


|Name  |Description  |Example  |
|---------|---------|---------|
|**state**     |To filter only handled and unhandled alerts.         |   `/api/v1/alerts?state=handled`      |
|**fromTime**     | To filter alerts created from a specific time (in milliseconds, UTC).        |   `/api/v1/alerts?fromTime=<epoch>`      |
|**toTime**     |  To filter alerts created only before a specific time (in milliseconds, UTC).       |   `/api/v1/alerts?toTime=<epoch>`      |
|**siteId**     |  The site on which the alert was discovered.       |         |
|**zoneId**     |  The zone on which the alert was discovered.       |         |
|**sensor**     |    The sensor on which the alert was discovered.     |         |

> [!NOTE]
> You might not have the site and zone ID. If this is the case, query all devices to retrieve the site and zone ID.

**Alert fields**

| Name | Type | Required / Optional | List of values |
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
| **remediationSteps** | String | Optional | Remediation steps shown in alert|
| **sensorName** | String | Optional | Name of sensor defined by user |
|**zoneName** | String | Optional | Name of zone associated with sensor|
| **siteName** | String | Optional | Name of site associated with sensor |
| **additionalInformation** | Additional information object | Optional | - |

> [!NOTE]
> /api/v2/ is needed for the following information:
>
> - sourceDeviceAddress
> - destinationDeviceAddress
> - remediationSteps
> - sensorName
> - zoneName
> - siteName
>

**Additional information fields**

| Name | Type | Required / Optional | List of values |
|--|--|--|--|
| **description** | String | Required | - |
| **information** | JSON array | Required | String |

# [Response](#tab/alerts-get-response)

**Response example**

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
# [Curl command](#tab/alerts-get-curl)

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

**URI**: `/external/v1/alerts/<UUID>`

### PUT

# [Request](#tab/uuid-request)

**Type**: JSON

JSON object that represents the action to perform on the alert that contains the UUID.

**Action fields**

| Name | Type | Required / Optional | List of values |
|--|--|--|--|
| **action** | String | Required | handle or handleAndLearn |

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

**Response example**: Successful

```rest
{
    "content": "Alert update request finished successfully"
}
```

**Response example**: Unsuccessful

```rest
{
    "error": "Invalid action"
}
```

# [Curl command](#tab/uuid-curl)

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

**URI**: `/external/v1/maintenanceWindow`

### POST

Define conditions under which alerts won't be sent. For example, define and update stop and start times, devices or subnets that should be excluded when triggering alerts, or Defender for IoT engines that should be excluded. For example, during a maintenance window, you might want to stop alert delivery of all alerts, except for malware alerts on critical devices.

The APIs that you define here appear in the on-premises management console's Alert Exclusions window as a read-only exclusion rule.

> [!IMPORTANT]
> This API is supported for maintenance purposes only and is not meant to be used instead of [alert exclusion rules](/azure/defender-for-iot/organizations/how-to-work-with-alerts-on-premises-management-console#create-alert-exclusion-rules). Use this API for one-time maintenance operations only.

# [Request](#tab/maintenanceWindow-request-post)

**Query parameters**:

|Name  |Description |
|---------|---------|
|**ticketId**     | Defines the maintenance ticket ID in the user's systems.        |
|**ttl**     |  Required. Defines the TTL (time to live), which is the duration of the maintenance window in minutes. After the period of time that this parameter defines, the system automatically starts sending alerts.       |
|**engines**     |  Defines from which security engine to suppress alerts during the maintenance process:<br><br>    - ANOMALY<br>    - MALWARE<br>    - OPERATIONAL<br>    - POLICY_VIOLATION<br>    - PROTOCOL_VIOLATION       |
|**sensorIds**     | Defines from which Defender for IoT sensor to suppress alerts during the maintenance process. It's the same ID retrieved from /api/v1/appliances (GET).        |
|**subnets**     |  Defines from which subnet to suppress alerts during the maintenance process. The subnet is sent in the following format: 192.168.0.0/16.       |

# [Response](#tab/maintenanceWindow-response-post)


|Code  |Description|
|---------|---------|
|**201 (Created)**     |  The action was successfully completed.       |
|**400 (Bad Request)**     |Appears in the following cases: <br><br>   - The **ttl** parameter is not numeric or not positive.<br>   - The **subnets** parameter was defined using a wrong format.<br>   - The **ticketId** parameter is missing.<br>   - The **engine** parameter does not match the existing security engines.         |
|**404 (Not Found)**     | One of the sensors doesn't exist.        |
|**409 (Conflict)**     | The ticket ID is linked to another open maintenance window.        |
|**500 (Internal Server Error)**     |   Any other unexpected error.      |

> [!NOTE]
> Make sure that the ticket ID is not linked to an existing open window. The following exclusion rule is generated: `Maintenance-{token name}-{ticket ID}`.

# [Curl command](#tab/maintenanceWindow-post-curl)

**Type**: POST

**API**:

```rest
curl -k -X POST -d '{"ticketId": "<TICKET_ID>",ttl": <TIME_TO_LIVE>,"engines": [<ENGINE1, ENGINE2...ENGINEn>],"sensorIds": [<SENSOR_ID1, SENSOR_ID2...SENSOR_IDn>],"subnets": [<SUBNET1, SUBNET2....SUBNETn>]}' -H "Authorization: <AUTH_TOKEN>" https://127.0.0.1/external/v1/maintenanceWindow
```

**Example**:

```rest
curl -k -X POST -d '{"ticketId": "a5fe99c-d914-4bda-9332-307384fe40bf","ttl": "20","engines": ["ANOMALY"],"sensorIds": ["5","3"],"subnets": ["10.0.0.3"]}' -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/external/v1/maintenanceWindow
```


---
### PUT

Allows you to update the maintenance window duration after you start the maintenance process by changing the **ttl** parameter. The new duration definition overrides the previous one.

This method is useful when you want to set a longer duration than the currently configured duration.

# [Request command](#tab/maintenanceWindow-put-request)

**Query parameters**:

|Name  |Description  |
|---------|---------|
|**ticketId**     |   Defines the maintenance ticket ID in the user's systems.      |
|**ttl**     |  Defines the duration of the window in minutes.       |

# [Response command](#tab/maintenanceWindow-put-response)

**Error codes**:

|Code  |Description  |
|---------|---------|
|**200 (OK)**     |  The action was successfully completed.       |
|**400 (Bad Request)**     | Appears in the following cases:<br><br>   - The **ttl** parameter is not numeric or not positive.<br>   - The **ticketId** parameter is missing.<br>   - The **ttl** parameter is missing.        |
|**404 (Not Found)**:     |  The ticket ID is not linked to an open maintenance window.       |
|**500 (Internal Server Error)**     |  Any other unexpected error.       |

> [!NOTE]
> Make sure that the ticket ID is linked to an existing open window.


# [Curl command](#tab/maintenanceWindow-put-curl)

**Type**: PUT

**API**:

```rest
curl -k -X PUT -d '{"ticketId": "<TICKET_ID>",ttl": "<TIME_TO_LIVE>"}' -H "Authorization: <AUTH_TOKEN>" https://127.0.0.1/external/v1/maintenanceWindow
```

**Example**:

```rest
curl -k -X PUT -d '{"ticketId": "a5fe99c-d914-4bda-9332-307384fe40bf","ttl": "20"}' -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/external/v1/maintenanceWindow
```
---


### DELETE

Closes an existing maintenance window.

# [Request](#tab/maintenanceWindow-delete-request)

**Query parameters**:

|Name  |Description  |
|---------|---------|
|**ticketId**     |   Defines the maintenance ticket ID in the user's systems.      |

# [Response](#tab/maintenanceWindow-delete-response)

**Error codes**:

|Code  |Description  |
|---------|---------|
|**200 (OK)**     |  The action was successfully completed.       |
|**400 (Bad Request)**     | The **ticketId** parameter is missing.       |
|**404 (Not Found)**:     |  The ticket ID is not linked to an open maintenance window.       |
|**500 (Internal Server Error)**     |  Any other unexpected error.       |


> [!NOTE]
> Make sure that the ticket ID is linked to an existing open window.

# [Curl command](#tab/maintenanceWindow-delete-curl)

**Type**: DELETE

**API**:

```rest
curl -k -X DELETE -d '{"ticketId": "<TICKET_ID>"}' -H "Authorization: <AUTH_TOKEN>" https://127.0.0.1/external/v1/maintenanceWindow
```

**Example**:

```rest
curl -k -X DELETE -d '{"ticketId": "a5fe99c-d914-4bda-9332-307384fe40bf"}' -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" https://127.0.0.1/external/v1/maintenanceWindow
```

---
### GET

Retrieve a log of all the open, close, and update actions that were performed in the system during the maintenance. You can retrieve a log only for maintenance windows that were active in the past and have been closed.

# [Request](#tab/maintenanceWindow-request-put)

**Query parameters**:

|Name  |Description  |
|---------|---------|
| **fromDate** | Filters the logs from the predefined date and later. The format is `YYYY-MM-DD`.|
| **toDate** | Filters the logs up to the predefined date. The format is `YYYY-MM-DD`. |
| **ticketId** | Filters the logs related to a specific ticket ID. |
| **tokenName** | Filters the logs related to a specific token name. |

**Error codes**:

|Code  |Description  |
|---------|---------|
|**200 (OK)**     |  The action was successfully completed.       |
|**400 (Bad Request)**     | The date format is wrong.     |
|**204 (No Content)**:     |  There is no data to show.      |
|**500 (Internal Server Error)**     |  Any other unexpected error.       |


# [Response](#tab/maintenanceWindow-response-put)

**Type**: JSON

Array of JSON objects that represent maintenance window operations.

**Response structure**:

| Name | Type | Comment | Required / Optional |
|--|--|--|--|
| **dateTime** | String | Example: "2012-04-23T18:25:43.511Z" | Required |
| **ticketId** | String | Example: "9a5fe99c-d914-4bda-9332-307384fe40bf" | Required |
| **tokenName** | String | - | Required |
| **engines** | Array of string | - | Optional |
| **sensorIds** | Array of string | - | Optional |
| **subnets** | Array of string | - | Optional |
| **ttl** | Numeric | - | Optional |
| **operationType** | String | Values are "OPEN", "UPDATE", and "CLOSE" | Required |

# [Curl command](#tab/maintenanceWindow-get-curl)

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


## pcap (Request alert PCAP)

Use this API to request a PCAP file related to an alert.

**URI**: `/external/v2/alerts/`
### GET

# [Request](#tab/pcap-request)

**Query parameters**:


|Name  |Description  |Example  |
|---------|---------|---------|
|id     | CM alert ID        |    `/external/v2/alerts/pcap/<id>`     |

# [Request](#tab/pcap-response)

**Type**: JSON

Message string with the operation status details:

|Name  |Description |
|---------|---------|
|**Success**     |  JSON object that contains data regarding the requested PCAP file       |
|**Failure**     |  JSON object that contains error message       |

#### Data fields

|Name|Type|Required / Optional|
|-|-|-|
|**id**|Numeric|Required|
|**xsenseId**|Numeric|Required|
|**xsenseAlertId**|Numeric|Required|
|**downloadUrl**|String|Required|
|**token**|String|Required|


**Response example**: Success

```json
{
  "downloadUrl": "https://10.1.0.2/api/v2/alerts/pcap/1",
  "xsenseId": 1,
  "token": "d2791f58-2a88-34fd-ae5c-2651fe30a63c",
  "id": 1,
  "xsenseAlertId": 1
}
```

**Response example**: Error


```json
{
  "error": "alert not found"
}
```

# [Curl command](#tab/pcap-curl)

**Type**: GET

**APIs**

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<IP_ADDRESS>/external/v2/alerts/pcap/<ID>'
```

***Example**:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https://10.1.0.1/external/v2/alerts/pcap/1'
```

## Next steps

For more information, see the [Defender for IoT API reference overview](references-work-with-defender-for-iot-apis.md).

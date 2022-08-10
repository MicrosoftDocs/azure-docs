---
title: Appliance management API reference for on-premises management consoles - Microsoft Defender for IoT
description: Learn about the appliance management REST APIs supported for Microsoft Defender for IoT on-premises management consoles.
ms.date: 05/25/2022
ms.topic: reference
---

# Appliance management API reference for on-premises management consoles

This article lists the appliance management REST APIs supported for Microsoft Defender for IoT on-premises management consoles.

## appliances (Manage OT sensor appliances)

Use this API to manage your OT sensor appliances from an on-premises management console.

**URI**:  `/external/v1/appliances` or `/external/v2/appliances`

### GET

# [Request](#tab/appliances-get-request)

No query parameters


# [Response](#tab/appliances-get-response)

**Type**: JSON

A JSON array of appliance objects that represent sensor appliances.

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **id** | Long integer | Not nullable | The sensor ID |
| **name** | String | Not nullable | The sensor's name |
|**interfaceAddress** | String | Not nullable |  The sensor's console URL |
| **state** | JSON array | Not nullable | A JSON array that describes the sensor's connection status. For more information, see [XsenseState fields](#xsensestate-fields). |
| **version** | String | Not nullable | The software version currently installed on the sensor |
|**alertCount**  | Long integer | Nullable |The total number of alerts currently active on the sensor |
| **deviceCount** |Long integer  |Nullable  |The number of devices currently detected by the sensor |
| **unhandledAlertsCount**  | long | Nullable | The current number of unhandled alerts on the sensor |
| **isActivated** | Boolean |Not nullable  | One of the following: `Activated` or `Unactivated` |
|**dataIntelligenceVersion**  | String |Not nullable  | The version of threat intelligence data currently installed on the sensor |
|**upgradeStatus** | UpgradeStatusBean <!--what does this mean?--> | Not nullable | One of the following: <!--hadar to add--> |
|**upgradeFinishTime** | Long |Nullable | The time the last software update completed, in the following format: `YYYY-MM-DD` |
|**hasLog** | Boolean | Not nullable | Defines whether logs exist for the sensor  |
|**zoneId** | Long integer | Nullable | The ID of sensor's zone |
| **isInLearningMode**| Boolean | Not nullable | Defines whether the sensor is currently in learning mode |

#### XsenseState fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **id** | Long integer | Not nullable | The sensor's ID on the on-premises management console |
| **xsenseId** | Long integer | Not nullable | The sensor ID on the sensor <!--?--> |
| **connectionState** | A JSON array of datetime values | Not nullable | The sensor's connection data. For more information, see [XsenseConnectionState fields](#xsenseconnectionstate-fields). |

#### XsenseConnectionState fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **cmSyncedUntil** | DateTime | Not nullable | The last time the on-premises management console was synchronized <!--to what?--> |
| **sensorSyncedUntil** | DateTime | Not nullable | The last time the sensor was synchronized <!--to what?--> |
| **sensorLastMessage** | DateTime | Not nullable | The last time the sensor sent a message <!--to what?--> |

<!--we left off here-->

**Response example**

```rest
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

### PUT

# [Request](#tab/appliances-put-request)

**Query parameters**:

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|

# [Response](#tab/appliances-put-response)

**Type**: JSON

A list of alerts with the following fields:

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|

**Response example**

```rest
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


### DELETE

# [Request](#tab/appliances-delete-request)

**Query parameters**:

|Name  |Description  |Example  | Required / Optional |
|---------|---------|---------|---------|

# [Response](#tab/appliances-delete-response)

**Type**: JSON

A list of alerts with the following fields:

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|

**Response example**

```rest
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


## Next steps

For more information, see the [Defender for IoT API reference overview](../references-work-with-defender-for-iot-apis.md).

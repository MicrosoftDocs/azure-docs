---
title: Appliance management API reference for on-premises management consoles - Microsoft Defender for IoT
description: Learn about the appliance management REST APIs supported for Microsoft Defender for IoT on-premises management consoles.
ms.date: 08/11/2022
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
| **version** | String | Not nullable | The software version currently installed on the sensor. |
|**alertCount**  | Long integer | Not nullable |The total number of alerts currently active on the sensor. |
| **deviceCount** |Long integer  |Not nullable  |The number of devices currently detected by the sensor. |
| **unhandledAlertsCount**  | long | Not nullable | The current number of unhandled alerts on the sensor. |
| **isActivated** | Boolean |Not nullable  | One of the following: `Activated` or `Unactivated` |
|**dataIntelligenceVersion**  | String |Not nullable  | The version of threat intelligence data currently installed on the sensor |
|**upgradeStatus** | JSON array | Not nullable | A JSON array that describes the sensor's update status. For more information, see [UpgradeStatusBean fields](#upgradestatusbean-fields).|
|**upgradeFinishTime** | Long |Nullable | The time the last software update completed, in the following format: `YYYY-MM-DD` |
|**hasLog** | Boolean | Not nullable | Defines whether an upgrade log exists for the sensor. |
|**zoneId** | Long integer | Nullable | The ID of sensor's zone. |
| **isInLearningMode**| Boolean | Not nullable | Defines whether the sensor is currently in learning mode. |

#### XsenseState fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **id** | Long integer | Not nullable | An internal, auto-incremented ID on the on-premises management console database. |
| **xsenseId** | Long integer | Not nullable | The sensor ID. |
| **connectionState** | A JSON array of datetime values | Not nullable | One of the following: `SYNCED`, `OUT_OF_SYNC`, `TIME_DIFF_OFFSET`, `DISCONNECTED` |
| **cmSyncedUntil** | DateTime | Not nullable | The timestamp for the most recent data sent from the sensor.  |
| **sensorSyncedUntil** | DateTime | Not nullable | The timestamp for the last update from the on-premises management console to the sensor.|
| **sensorLastMessage** | DateTime | Not nullable | The timestamp for the last update from the sensor. |

#### UpgradeStatusBean fields

| Name | Type | Nullable / Not nullable | List of values |
|--|--|--|--|
| **startTime** | DateTime | Not nullable | The time the last update process was started.  |
| **percentage** | Integer between 0-100 | Not nullable | The completion percentage of the last update process.  |
| **stage** | String | Not nullable | One of the following statues: <br><br>- `UPLOADING`: Uploading Package<br>- `PREPARE_TO_INSTALL`: Preparing To Install<br>- `STOPPING_PROCESSES` Stopping Processes<br>- `BACKING_UP_DATA`: Backing Up Data<br>- `TAKING_SNAPSHOT`: Taking Snapshot<br>- `UPDATING_CONFIGURATION`: Updating Configuration<br>- `UPDATING_DEPENDENCIES`: Updating Dependencies<br>- `UPDATING_LIBRARIES`: Updating Libraries<br>- `PATCHING_DATABASES`: Patching Databases<br>- `STARTING_PROCESSES`: Starting Processes<br>- `VALIDATING_SYSTEM_SANITY`: Validating System Sanity<br>- `VALIDATION_SUCCEEDED_REBOOTING`: Validation Succeeded<br>- `SUCCESS`: Success<br>- `FAILURE`: Failure<br>- `UPGRADE_STARTED`: Upgrade Started<br>- `STARTING_INSTALLATION`: Starting Installation<br>- `INSTALLING_OPERATING_SYSTEM`: Installing OS |


#### Response example

```rest
[
 {
    "dataIntelligenceVersion":"Dec 22, 2021",
    "name":"Microsoft Defender for IoT",
    "isActivated":true,
    "hasLog":false,
    "zoneId":null,
    "upgradeStatus":null,
    "deviceCount":22,
    "state":{
       "sensorLastMessage":1660217831000,
       "xsenseId":1,
       "sensorSyncedUntil":1660217741000,
       "connectionState":{
          "isConsideredConnected":true,
          "id":1,
          "description":"Connection is successful"
       },
       "cmSyncedUntil":1660217825000,
       "id":1
    },
    "version":"22.1.4.8-r-6372aad",
    "alertCount":9,
    "upgradeFinishTime":null,
    "uid":"a6218f1a-8ebf-4bb3-8613-c859b17eef01",
    "interfaceAddress":"https://173.70.549.76",
    "id":1,
    "unhandledAlertsCount":9
  }
]
```


# [cURL command](#tab/appliances-get-curl)

**Type**: GET

**API**:

```rest
curl -k -H "Authorization: <AUTH_TOKEN>" 'https://<>IP_ADDRESS>/external/v1/appliances'
```

**Example**:

```rest
curl -k -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" 'https://127.0.0.1/external/v1/appliances'
```
---


## Next steps

For more information, see the [Defender for IoT API reference overview](../references-work-with-defender-for-iot-apis.md).

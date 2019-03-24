---
title: Accessing data using Azure IoT Security Preview| Microsoft Docs
description: Learn about how to access your security alert and recommendation data when using Azure IoT Security.
services: azureiotsecurity
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: fbd96ddd-cd9f-48ae-836a-42aa86ca222d
ms.service: azureiotsecurity
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/20/2019
ms.author: mlottner

---

# Data access

> [!IMPORTANT]
> Azure IoT Security is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Security alert and recommendation data is accessible from the ASC IoT Hub portal, Security Module twins and using Microsoft Log Analytics.

## Log analytics

Log analytics are used by the Azure IoT Security service to store your security alerts.

In future versions, security recommendations and raw events will also be collected in a **log analytics** workspace.

For details on querying data from Log Analytics, see [Get started with queries in Log Analytics](https://docs.microsoft.com/en-us/azure/log-analytics/query-language/get-started-queries).

## Security alert table

Security alerts are stored in within the _Security.SecurityAlert_ table in your Log Analytics workspace after you have configured it with the Azure IoT Security solution.

## Sample records

Select a few random records

```
// Select a few random records
//
SecurityAlert
| project 
    TimeGenerated, 
    IoTHubId=ResourceId, 
    DeviceId=tostring(parse_json(ExtendedProperties)["DeviceId"]),
    AlertSeverity, 
    DisplayName,
    Description,
    ExtendedProperties
| take 3
```

| TimeGenerated           | IoTHubId                                                                                                       | DeviceId      | AlertSeverity | DisplayName                           | Description                                             | ExtendedProperties                                                                                                                                                             |
|-------------------------|----------------------------------------------------------------------------------------------------------------|---------------|---------------|---------------------------------------|---------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 2018-11-18T18:10:29.000 | /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | Bruteforce attack succeeded           | A Bruteforce attack on the device was Successful        |	{ "Full Source Address": "[\"10.165.12.18:\"]", "User Names": "[\"\"]", "DeviceId": "IoT-Device-Linux" }                                                                       |
| 2018-11-19T12:40:31.000 | /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | Successful local login on device      | A successful local login to the device was detected     | { "Remote Address": "?", "Remote Port": "", "Local Port": "", "Login Shell": "/bin/su", "Login Process Id": "28207", "User Name": "attacker", "DeviceId": "IoT-Device-Linux" } |
| 2018-11-19T12:40:31.000 | /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | Failed local login attempt on device  | A failed local login attempt to the device was detected |	{ "Remote Address": "?", "Remote Port": "", "Local Port": "", "Login Shell": "/bin/su", "Login Process Id": "22644", "User Name": "attacker", "DeviceId": "IoT-Device-Linux" } |

## Device summary

Select the number of distinct security alerts detected last week by IoT hub, device, alert severity, alert type.

```
// Select number of distinct security alerts detected last week by 
//   IoT hub, device, alert severity, alert type
//
SecurityAlert
| where TimeGenerated > ago(7d)
| summarize Cnt=dcount(TimeGenerated) by
    IoTHubId=ResourceId, 
    DeviceId=tostring(parse_json(ExtendedProperties)["DeviceId"]),
    AlertSeverity,
    DisplayName
```

| IoTHubId                                                                                                       | DeviceId      | AlertSeverity | DisplayName                           | Cnt |
|----------------------------------------------------------------------------------------------------------------|---------------|---------------|---------------------------------------|-----|
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | Bruteforce attack succeeded           | 9   |	
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | Medium        | Failed local login attempt on device  | 242 |	
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | Successful local login on device      | 31  |
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | Medium        | Crypto Coin Miner                     | 4   |

## IoT hub summary

Select a number of distinct devices which had alerts in the last week, by IoT hub, alert severity, alert type

```
// Select number of distinct devices which had alerts in the last week, by 
//   IoT hub, alert severity, alert type
//
SecurityAlert
| where TimeGenerated > ago(7d)
| extend DeviceId=tostring(parse_json(ExtendedProperties)["DeviceId"])
| summarize CntDevices=dcount(DeviceId) by
    IoTHubId=ResourceId, 
    AlertSeverity,
    DisplayName
```

| IoTHubId                                                                                                       | AlertSeverity | DisplayName                           | CntDevices |
|----------------------------------------------------------------------------------------------------------------|---------------|---------------------------------------|------------|
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | High          | Bruteforce attack succeeded           | 1          |	
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | Medium        | Failed local login attempt on device  | 1          |	
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | High          | Successful local login on device      | 1          |
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | Medium        | Crypto Coin Miner                     | 1          |

## Security module twins

Device $security module twins are used by the service to store last occurrences of security recommendation and alerts.

For details on querying data from device twins, see [Device and module twin queries](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-query-language#device-and-module-twin-queries).

### Recommendation details

Query all devices with a _Listening Ports_ recommendation, and their details (which endpoint is being listened to).

```sql
SELECT
    deviceId,
    tags.recommendations.IoT_OpenPorts.severity,
    tags.recommendations.IoT_OpenPorts.discoveredAtUtc,
    tags.recommendations.IoT_OpenPorts.details.Endpoints
FROM devices.modules 
WHERE 
    moduleId = 'Microsoft.Security' AND 
    IS_DEFINED(tags.recommendations.IoT_OpenPorts)
```

| DeviceId       | severity | discoveredAtUtc                | Endpoints             |
|----------------|----------|--------------------------------|-----------------------|
| <device_name>  | Medium   | "2018-11-19T09:11:51.0657343Z" | "[\"0.0.0.0:25324\"]" |
| <device_name>  | Medium   | "2018-11-19T09:11:51.0657343Z" | "[\"0.0.0.0:80\"]"    |

### Alert details

Query all devices with a _Successful BruteForce_ alert.

```sql
SELECT
    deviceId,
    tags.alerts.IoT_Bruteforce_Success
FROM devices.modules 
WHERE 
    moduleId = 'Microsoft.Security' AND 
    IS_DEFINED(tags.alerts.IoT_Bruteforce_Success)
```

| DeviceId       | severity | lastDetectionUtc              |
|----------------|----------|-------------------------------|
| <device_name1> | High     |"2018-11-19T09:11:51.0657343Z" |
| <device_name2> | High     |"2018-11-19T09:11:51.0657343Z" |


## See Also
- [Azure IoT Security Preview](preview.md)
- [Installation for Windows](install-windows.md)
- [Authentication](authentication.md)
- [Azure IoT Security alerts](alerts.md)

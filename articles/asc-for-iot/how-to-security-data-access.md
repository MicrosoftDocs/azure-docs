---
title: Accessing data using ASC for IoT Preview| Microsoft Docs
description: Learn about how to access your security alert and recommendation data when using ASC for IoT.
services: ascforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: fbd96ddd-cd9f-48ae-836a-42aa86ca222d
ms.service: ascforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/25/2019
ms.author: mlottner

---

# Access your security data 

> [!IMPORTANT]
> ASC for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

ASC for IoT stores security alerts, recommendations, and raw security data (if you choose to save it) in your Log Analytics workspace.

## Log Analytics

To configure which Log Analytics workspace is used:

1. Open your IoT hub.
1. Click **Security**
2. Click **Settings**, and change your Log Analytics workspace configuration.

To access your Log Analytics workspace after configuration:

1. Choose an alert in ASC for IoT. 
2. Click **further investigation**, then click **To see which devices have this alert click here and view the DeviceId column**.

For details on querying data from Log Analytics, see [Get started with queries in Log Analytics](https://docs.microsoft.com//azure/log-analytics/query-language/get-started-queries).

## Security alerts

Security alerts are stored in the **ASCforIoT.SecurityAlert** table within your configured Log Analytics workspace.

Use the following basic kql queries to start exploring security alerts.

### Sample records query

To select a few records at random: 

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

#### Sample query results 

| TimeGenerated           | IoTHubId                                                                                                       | DeviceId      | AlertSeverity | DisplayName                           | Description                                             | ExtendedProperties                                                                                                                                                             |
|-------------------------|----------------------------------------------------------------------------------------------------------------|---------------|---------------|---------------------------------------|---------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 2018-11-18T18:10:29.000 | /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | Brute force attack succeeded           | A Brute force attack on the device was Successful        |	{ "Full Source Address": "[\"10.165.12.18:\"]", "User Names": "[\"\"]", "DeviceId": "IoT-Device-Linux" }                                                                       |
| 2018-11-19T12:40:31.000 | /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | Successful local login on device      | A successful local login to the device was detected     | { "Remote Address": "?", "Remote Port": "", "Local Port": "", "Login Shell": "/bin/su", "Login Process Id": "28207", "User Name": "attacker", "DeviceId": "IoT-Device-Linux" } |
| 2018-11-19T12:40:31.000 | /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | Failed local login attempt on device  | A failed local login attempt to the device was detected |	{ "Remote Address": "?", "Remote Port": "", "Local Port": "", "Login Shell": "/bin/su", "Login Process Id": "22644", "User Name": "attacker", "DeviceId": "IoT-Device-Linux" } |

### Device summary query

Use this kql query to select a number of distinct security alerts detected last week by IoT Hub, device, alert severity, alert type.

```
// Select number of distinct security alerts detected last week by 
//   IoT hub, device, alert severity, alert type
//
SecurityAlert
| where TimeGenerated > ago(7d)
| summarize Cnt=dcount(SystemAlertId) by
    IoTHubId=ResourceId, 
    DeviceId=tostring(parse_json(ExtendedProperties)["DeviceId"]),
    AlertSeverity,
    DisplayName
```

#### Device summary query results

| IoTHubId | DeviceId| AlertSeverity| DisplayName | Count |
|----------|---------|------------------|---------|---------|
|/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | Brute force attack succeeded           | 9   |	
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | Medium        | Failed local login attempt on device  | 242 |	
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | Successful local login on device      | 31  |
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | Medium        | Crypto Coin Miner                     | 4   |
|

### IoT Hub summary

Use this kql query to select a number of distinct devices that had alerts in the last week, by IoT hub, alert severity, alert type:

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

#### IoT Hub summary query results

| IoTHubId                                                                                                       | AlertSeverity | DisplayName                           | CntDevices |
|----------------------------------------------------------------------------------------------------------------|---------------|---------------------------------------|------------|
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | High          | Brute force attack succeeded           | 1          |	
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | Medium        | Failed local login attempt on device  | 1          |	
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | High          | Successful local login on device      | 1          |
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | Medium        | Crypto Coin Miner                     | 1          |



## Next steps

- Read the ASC for IoT [Overview](overview.md)
- Learn about ASC for IoT [Architecture](architecture.md)
- Understand and explore [ASC for IoT alerts](concept-security-alerts.md)

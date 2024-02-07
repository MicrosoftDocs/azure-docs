---
title: Access security & recommendation data
description: Learn about how to access your security alert and recommendation data when using Defender for IoT.
ms.topic: conceptual
ms.date: 03/28/2022
---

# Access your security data

Defender for IoT stores security alerts, recommendations, and raw security data (if you choose to save it) in your Log Analytics workspace.

> [!NOTE]
> The Microsoft Defender for IoT legacy experience under IoT Hub has been replaced by our new Defender for IoT standalone experience, in the Defender for IoT area of the Azure portal. The legacy experience under IoT Hub will not be supported after **March 31, 2023**.
>
> For more information, see [Tutorial: Configure Microsoft Defender for IoT agent-based solution](tutorial-configure-agent-based-solution.md).
## Log Analytics

To configure which Log Analytics workspace is used:

1. Open your IoT hub.
1. Select the **Settings** blade under the **Security** section.
1. Select **Data Collection**, and change your Log Analytics workspace configuration.

To access your alerts and recommendations in your Log Analytics workspace after configuration:

1. Choose an alert or recommendation in Defender for IoT.
1. Select **further investigation**, then select **To see which devices have this alert click here and view the DeviceId column**.

For details on querying data from Log Analytics, see [Get started with log queries in Azure Monitor](../../azure-monitor/logs/get-started-queries.md).

## Security alerts

Security alerts are stored in _AzureSecurityOfThings.SecurityAlert_ table in the Log Analytics workspace configured for the Defender for IoT solution.

We've provided a number of useful queries to help you get started exploring security alerts.

### Sample records

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
| 2018-11-18T18:10:29.000 | /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | Brute force attack succeeded           | A Brute force attack on the device was Successful        |    { "Full Source Address": "[\"10.165.12.18:\"]", "User Names": "[\"\"]", "DeviceId": "IoT-Device-Linux" }                                                                       |
| 2018-11-19T12:40:31.000 | /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | Successful local login on device      | A successful local login to the device was detected     | { "Remote Address": "?", "Remote Port": "", "Local Port": "", "Login Shell": "/bin/su", "Login Process Id": "28207", "User Name": "attacker", "DeviceId": "IoT-Device-Linux" } |
| 2018-11-19T12:40:31.000 | /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | Failed local login attempt on device  | A failed local login attempt to the device was detected |    { "Remote Address": "?", "Remote Port": "", "Local Port": "", "Login Shell": "/bin/su", "Login Process Id": "22644", "User Name": "attacker", "DeviceId": "IoT-Device-Linux" } |

### Device summary

Get the number of distinct security alerts detected in the last week, grouped by IoT Hub, device, alert severity, alert type.

```
// Get the number of distinct security alerts detected in the last week, grouped by
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

| IoTHubId                                                                                                       | DeviceId      | AlertSeverity | DisplayName                           | Count |
|----------------------------------------------------------------------------------------------------------------|---------------|---------------|---------------------------------------|-----|
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | Brute force attack succeeded           | 9   |
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | Medium        | Failed local login attempt on device  | 242 |
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | Successful local login on device      | 31  |
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | Medium        | Crypto Coin Miner                     | 4   |

### IoT hub summary

Select a number of distinct devices that had alerts in the last week, by IoT Hub, alert severity, alert type

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
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | High          | Brute force attack succeeded           | 1          |
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | Medium        | Failed local login attempt on device  | 1          |
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | High          | Successful local login on device      | 1          |
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | Medium        | Crypto Coin Miner                     | 1          |

## Security recommendations

Security recommendations are stored in _AzureSecurityOfThings.SecurityRecommendation_ table in the Log Analytics workspace configured for the Defender for IoT solution.

We've provided a number of useful queries to help you get start exploring security recommendations.

### Sample records

Select a few random records

```
// Select a few random records
//
SecurityRecommendation
| project
    TimeGenerated,
    IoTHubId=AssessedResourceId,
    DeviceId,
    RecommendationSeverity,
    RecommendationState,
    RecommendationDisplayName,
    Description,
    RecommendationAdditionalData
| take 2
```

| TimeGenerated | IoTHubId | DeviceId | RecommendationSeverity | RecommendationState | RecommendationDisplayName | Description | RecommendationAdditionalData |
|---------------|----------|----------|------------------------|---------------------|---------------------------|-------------|------------------------------|
| 2019-03-22T10:21:06.060 |    /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | Medium | Active | Permissive firewall rule in the input chain was found | A rule in the firewall has been found that contains a permissive pattern for a wide range of IP addresses or Ports | {"Rules":"[{\"SourceAddress\":\"\",\"SourcePort\":\"\",\"DestinationAddress\":\"\",\"DestinationPort\":\"1337\"}]"} |
| 2019-03-22T10:50:27.237 | /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | Medium | Active | Permissive firewall rule in the input chain was found | A rule in the firewall has been found that contains a permissive pattern for a wide range of IP addresses or Ports | {"Rules":"[{\"SourceAddress\":\"\",\"SourcePort\":\"\",\"DestinationAddress\":\"\",\"DestinationPort\":\"1337\"}]"} |

### Device summary

Get the number of distinct active security recommendations, grouped by IoT Hub, device, recommendation severity, and type.

```
// Get the number of distinct active security recommendations, grouped by
//   IoT hub, device, recommendation severity and type
//
SecurityRecommendation
| extend IoTHubId=AssessedResourceId
| summarize CurrentState=arg_max(RecommendationState, DiscoveredTimeUTC) by IoTHubId, DeviceId, RecommendationSeverity, RecommendationDisplayName
| where CurrentState == "Active"
| summarize Cnt=count() by IoTHubId, DeviceId, RecommendationSeverity
```

| IoTHubId                                                                                                       | DeviceId      | RecommendationSeverity | Count |
|----------------------------------------------------------------------------------------------------------------|---------------|------------------------|-----|
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | 2   |
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | Medium        | 1 |
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | High          | 1  |
| /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Devices/IotHubs/<iot_hub> | <device_name> | Medium        | 4   |

## Next steps

- Read the Defender for IoT [Overview](overview.md)
- Learn about Defender for IoT [What is agent-based solution for device builders](architecture-agent-based.md)
- Understand and explore [Defender for IoT alerts](concept-security-alerts.md)
- Understand and explore [Defender for IoT recommendations](concept-recommendations.md)

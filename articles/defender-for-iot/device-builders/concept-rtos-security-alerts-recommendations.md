---
title: Defender-IoT-micro-agent for Azure RTOS built-in & customizable alerts and recommendations 
description: Learn about security alerts and recommended remediation using the Azure IoT Defender-IoT-micro-agent -RTOS.
ms.topic: conceptual
ms.date: 01/01/2023
---

# Defender-IoT-micro-agent for Azure RTOS security alerts and recommendations (preview)

Defender-IoT-micro-agent for Azure RTOS continuously analyzes your IoT solution using advanced analytics and threat intelligence to alert you to potential malicious activity and suspicious system modifications. You can also create custom alerts based on your knowledge of expected device behavior and baselines.

A Defender-IoT-micro-agent for Azure RTOS alert acts as an indicator of potential compromise, and should be investigated and remediated. A Defender-IoT-micro-agent for Azure RTOS recommendation identifies weak security posture to be remediated and updated. 

In this article, you'll find a list of built-in alerts and recommendations that are triggered based on the default ranges, and customizable with your own values, based on expected or baseline behavior. 

For more information on how alert customization works in the Defender for IoT service, see [customizable alerts](concept-customizable-security-alerts.md). The specific alerts and recommendations available for customization when using the Defender-IoT-micro-agent for Azure RTOS are detailed in the following tables. 

## Defender-IoT-micro-agent for Azure RTOS supported security alerts

### Device-related security alerts

|Device-related security alert activity  |Alert name  |
|---------|---------|
|IP address| Communication with a suspicious IP address detected|
|X.509 device certificate thumbprint|X.509 device certificate thumbprint mismatch|
|X.509 certificate| X.509 certificate expired|
|SAS Token| Expired SAS Token|
|SAS Token| Invalid SAS Token signature|

### IoT Hub-related security alerts

|IoT Hub security alert activity  |Alert name  |
|---------|---------|
|Add a certificate    |  Detected unsuccessful attempt to add a certificate to an IoT Hub       |
|Addition or editing of a diagnostic setting    | Detected an attempt to add or edit a diagnostic setting of an IoT Hub      |
|Delete a certificate    |  Detected unsuccessful attempt to delete a certificate from an IoT Hub       |
|Delete a diagnostic setting    |  Detected attempt to delete a diagnostic setting from an IoT Hub      |
|Deleted certificate    | Detected deletion of a certificate from an IoT Hub        |
|New certificate     |  Detected addition of new certificate to an IoT Hub       |

## Defender-IoT-micro-agent for Azure RTOS supported customizable alerts

### Device related customizable alerts

|Device related activity |Alert name  |
|---------|---------|
|Active connections|Number of active connections is not in the allowed range|
|Cloud to device messages in **MQTT** protocol|Number of cloud to device messages in **MQTT** protocol is not in the allowed range|
|Outbound connection| Outbound connection to an IP that isn't allowed|

### Hub related customizable alerts 

|Hub related activity  |Alert name  |
|---------|---------|
|Command queue purges     |  Number of command queue purges outside the allowed range       |
|Cloud to device messages in **MQTT** protocol    |  Number of Cloud to device messages in **MQTT** protocol outside the allowed range       |
|Device to cloud messages in **MQTT** protocol    | Number of device to cloud messages in **MQTT** protocol outside the allowed range        |
|Direct method invokes     |  Number of direct method invokes outside the allowed range       |
|Rejected cloud to device messages in **MQTT** protocol     |   Number of rejected cloud to device messages in **MQTT** protocol outside the allowed range      |
|Updates to twin modules     |  Number of updates to twin modules outside the allowed range       |
|Unauthorized operations    |  Number of unauthorized operations outside the allowed range       |

## Defender-IoT-micro-agent for Azure RTOS supported recommendations

### Device-related recommendations

|Device-related activity  |Recommendation name |
|---------|---------|
|Authentication credentials    |  Identical authentication credentials used by multiple devices       |

### Hub-related recommendations

|IoT Hub-related activity  |Recommendation name |
|---------|---------|
|IP filter policy   |  The Default IP filter policy should be set to **deny**  |
|IP filter rule| IP filter rule includes a large IP range|
|Diagnostics logs|Suggestion to enable diagnostics logs in IoT Hub|

### All Defender for IoT alerts and recommendations

For a complete list of all Defender for IoT service related alerts and recommendations, see IoT [security alerts](concept-security-alerts.md), IoT security [recommendations](concept-recommendations.md).

## Next steps

- [Quickstart: Defender-IoT-micro-agent for Azure RTOS](./how-to-azure-rtos-security-module.md)
- [Configure and customize Defender-IoT-micro-agent for Azure RTOS](how-to-azure-rtos-security-module.md)
- Refer to the [Defender-IoT-micro-agent for Azure RTOS API](azure-rtos-security-module-api.md)
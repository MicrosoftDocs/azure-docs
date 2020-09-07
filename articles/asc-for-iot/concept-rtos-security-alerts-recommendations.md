---
title: Security Module for Azure RTOS built-in & customizable alerts and recommendations 
description: Learn about security alerts and recommended remediation using the Azure IoT Security Module -RTOS.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''


ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/07/2020
ms.author: mlottner
---

# Security Module for Azure RTOS security alerts and recommendations (preview)

Security Module for Azure RTOS continuously analyzes your IoT solution using advanced analytics and threat intelligence to alert you to potential malicious activity and suspicious system modifications. You can also create custom alerts based on your knowledge of expected device behavior and baselines.

An IoT Security Module alert acts as an indicator of potential compromise, and should be investigated and remediated. An IoT Security Module recommendation identifies weak security posture to be remediated and updated. 

In this article, you'll find a list of built-in alerts and recommendations that are triggered based on the default ranges, and customizable with your own values, based on expected or baseline behavior. 

For more information on how alert customization works in the Azure Security Center for IoT service, see [customizable alerts](concept-customizable-security-alerts.md). The specific alerts and recommendations available for customization when using the Security Module for Azure RTOS are detailed in the following tables. 

## Security Module for Azure RTOS supported security alerts

### Device-related security alerts

|Device-related security alert  |Reason  |
|---------|---------|
|IP address| Communication with a suspicious IP address detected|
|X.509 device certificate thumbprint|Thumbprint mismatch|
|X.509 certificate| Expired|
|SAS Token| Expired|
|SAS Token| Invalid signature|

### IoT Hub-related security alerts

|IoT Hub security alert  |Reason  |
|---------|---------|
|New certificate     |  Detected addition of new certificate to an IoT Hub       |
|Deleted certificate    | Detected deletion of a certificate from an IoT Hub        |
|Add a certificate    |  Detected unsuccessful attempt to add a certificate to an IoT Hub       |
|Delete a certificate    |  Detected unsuccessful attempt to delete a certificate from an IoT Hub       |
|Addition or editing of a diagnostic setting    | Detected an attempt to add or edit a diagnostic setting of an IoT Hub      |
|Delete a diagnostic setting    |  Detected attempt to delete a diagnostic setting from an IoT Hub      |

## Security Module for Azure RTOS supported customizable alerts

### Device related customizable alerts

|Device related customizable value  |Reason  |
|---------|---------|
|Active connections|Number of active connections is not in the allowed range|
|Cloud to device messages in **MQTT** protocol|Number of cloud to device messages in **MQTT** protocol is not in the allowed range|
|Outbound connection| Outbound connection to an IP that isn't allowed|

### Hub related customizable alerts 

|Hub related customizable value  |Reason  |
|---------|---------|
|Command queue purges     |  Number of command queue purges outside the allowed range       |
|Cloud to device messages in **MQTT** protocol    |  Number of Cloud to device messages in **MQTT** protocol outside the allowed range       |
|Device to cloud messages in **MQTT** protocol    | Number of device to cloud messages in **MQTT** protocol outside the allowed range        |
|Direct method invokes     |  Number of direct method invokes outside the allowed range       |
|Rejected cloud to device messages in **MQTT** protocol     |   Number of rejected cloud to device messages in **MQTT** protocol outside the allowed range      |
|Updates to twin modules     |  Number of updates to twin modules outside the allowed range       |
|Unauthorized operations    |  Number of unauthorized operations outside the allowed range       |

## Security Module for Azure RTOS supported recommendations

### Device-related recommendations

|Device-related recommendation  |Reason |
|---------|---------|
|Authentication credentials    |  Identical authentication credentials used by multiple devices       |

### Hub-related recommendations

|IoT Hub-related recommendation  |Reason |
|---------|---------|
|IP filter policy   |  The Default IP filter policy should be set to **deny**  |
|IP filter rule| IP filter rule includes large IP range|
|Diagnostics logs|Suggestion to enable diagnostics logs in IoT Hub|

### All Azure Security Center for IoT alerts and recommendations

For a complete list of all Azure Security Center for IoT service related alerts and recommendations, see IoT [security alerts](concept-security-alerts.md), IoT security [recommendations](concept-recommendations.md).

## Next steps

- [Quickstart: Security Module for Azure RTOS](quickstart-azure-rtos-security-module.md)
- [Configure and customize Security Module for Azure RTOS](how-to-azure-rtos-security-module.md)
- Refer to the [Security Module for Azure RTOS API](azure-rtos-security-module-api.md)
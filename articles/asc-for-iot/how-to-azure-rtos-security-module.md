---
title: Configure and customize Azure IoT Security Module - Azure RTOS
description: Learn about how to configure and customize your Azure IoT Security Module - Azure RTOS.
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
ms.date: 09/06/2020
ms.author: mlottner
---

# Configure and customize Azure IoT Security Module- Azure RTOS (preview)

## azure_iot_security_module/inc/asc_port.h

Use this file to configure your device behavior. The default behavior of each configuration is provided in the following tables: 

### General

| Name | Type | Default | Details |
| - | - | - | - |
| ASC_SECURITY_MODULE_ID | String | --- | Unique identifier of the device  |
| ASC_SECURITY_MODULE_PENDING_TIME  | Number | 300 | Security Module pending time in seconds. If the time exceeds state change to suspend. |

#### Collection

| Name | Type | Default | Details |
| - | - | - | - |
| ASC_HIGH_PRIORITY_INTERVAL | Number | 10 | Collectors high priority group interval in seconds. |
| ASC_MEDIUM_PRIORITY_INTERVAL | Number | 30 | Collectors medium priority group interval in seconds. |
| ASC_LOW_PRIORITY_INTERVAL | Number | 145,440  | Collectors low priority group interval in seconds. |

#### Collector network activity

To customize your collector network activity configuration, use the following:

| Name | Type | Default | Details |
| - | - | - | - |
| ASC_COLLECTOR_NETWORK_ACTIVITY_TCP_DISABLED | Boolean | false | Filter `TCP` network activity |
| ASC_COLLECTOR_NETWORK_ACTIVITY_UDP_DISABLED | Boolean | false | Filter `UDP` network activity events |
| ASC_COLLECTOR_NETWORK_ACTIVITY_ICMP_DISABLED | Boolean | false | Filter `ICMP` network activity events |
| ASC_COLLECTOR_NETWORK_ACTIVITY_CAPTURE_UNICAST_ONLY | Boolean | true | Capture unicast incoming packets only, when set to false capture also Broadcast and Multicast |
| ASC_COLLECTOR_NETWORK_ACTIVITY_MAX_IPV4_OBJECTS_IN_CACHE | Number | 64 | Maximum number of IPv4 network events to store in memory |
| ASC_COLLECTOR_NETWORK_ACTIVITY_MAX_IPV6_OBJECTS_IN_CACHE | Number | 64  | Maximum number of IPv6 network events to store in memory |


## Compile flags
Compile flags allows you to override the predefined configurations.

### Collectors
| Name | Type | Default | Details |
| - | - | - | - |
| collector_heartbeat_enabled | Boolean | ON | Enable the heartbeat collector |
| collector_network_activity_enabled | Boolean | ON | Enable the network activity collector |
| collector_system_information_enabled | Boolean | ON | Enable the system information collector |

## Supported security alerts

The Azure IoT Security Module - RTOS supports specific security alerts and recommendations. Make sure to review the alerts and customize the relevant alert values for your service. 

### Device related security alerts

|Device security alert  |Reason  |
|---------|---------|
|IP address| Communication with a suspicious IP address detected|
|X.509 device certificate thumbprint|Thumbprint mismatch|
|X.509 certificate| Expired|
|SAS Token| Expired|
|SAS Token| Invalid signature|



### IoT Hub related security alerts

|IoT Hub security alert  |Reason  |
|---------|---------|
|New certificate     |  Detected addition of new certificate to an IoT Hub       |
|Deleted certificate    | Detected deletion of a certificate from an IoT Hub        |
|Add a certificate    |  Detected unsuccessful attempt to add a certificate to an IoT Hub       |
|Delete a certificate    |  Detected unsuccessful attempt to delete a certificate from an IoT Hub       |
|Addition or editing of a diagnostic setting    | Detected an attempt to add or edit a diagnostic setting of an IoT Hub      |
|Delete a diagnostic setting    |  Detected attempt to delete a diagnostic setting from an IoT Hub      |

## Supported customizable alerts

### Device related customizable alerts

- Number of active connections is outside the allowed range.
- Outbound connection created to an forbidden IP.
- Number of cloud to device messages in **MQTT** protocol is outside the allowed range.

### Hub related customizable alerts 


|Customizable value  |Reason  |
|---------|---------|
|Command queue purges     |  Number outside the allowed range       |
|Cloud to device messages in **MQTT** protocol    |  Number outside the allowed range       |
|Device to cloud messages in **MQTT** protocol    | Number outside the allowed range        |
|Direct method invokes     |  Number outside the allowed range       |
|Rejected cloud to device messages in **MQTT** protocol     |   Number outside the allowed range      |
|Updates to twin modules     |  Number outside the allowed range       |
|Unauthorized operations    |  Number outside the allowed range       |


For a complete list of all Azure Security Center for IoT service related alerts and recommendations, see IoT [security alerts](concept-security-alerts.md), IoT security [recommendations](concept-recommendations.md).

## Supported recommendations

### Device related recommendations

- Identical authentication credentials used by multiple devices.

### Hub related recommendations

- Default IP filter policy should be deny.
- IP filter rule includes large IP range.
- Enable diagnostics logs in IoT Hub.

### Log Analytics (optional)

Not required, but Log Analytics can be helpful when you wish to investigate events and activities. Read more about using [Log Analytics with Azure Security Center for IoT]() to learn more. 

## Next steps

- Review Azure IoT Security Module - RTOS [security alerts and recommendations](concept-rtos-alerts-recommendations.md)


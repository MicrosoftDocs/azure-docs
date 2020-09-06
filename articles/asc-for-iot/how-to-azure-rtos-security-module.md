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

# Configure and customize Azure IoT Security Module- Azure RTOS 

## azure_iot_security_module/inc/asc_port.h

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
Compile flags allows you to override predefined configurations.

### Collectors
| Name | Type | Default | Details |
| - | - | - | - |
| collector_heartbeat_enabled | Boolean | ON | Enable the heartbeat collector |
| collector_network_activity_enabled | Boolean | ON | Enable the network activity collector |
| collector_system_information_enabled | Boolean | ON | Enable the system information collector |

## Supported security alerts

### Device related

- X.509 device certificate thumbprint mismatch
- X.509 certificate expired
- Expired SAS Token
- Invalid SAS token signature
- Suspicious IP address communication

### IoT Hub related
- New certificate added to an IoT Hub.
- Certificate deleted from an IoT Hub.
- Unsuccessful attempt detected to add a certificate to an IoT Hub.
- Unsuccessful attempt detected to delete a certificate from an IoT Hub.
- Attempt to add or edit a diagnostic setting of an IoT Hub detected.
- Attempt to delete a diagnostic setting from an IoT Hub detected.

## Supported custom alerts

### Device related
- Number of active connections is outside the allowed range.
- Outbound connection created to an forbidden IP.
- Number of cloud to device messages in **MQTT** protocol is outside the allowed range.

### Hub related

- Number of direct method invokes is outside the allowed range.
- Number of cloud to device messages in **MQTT** protocol is outside the allowed range.
- Number of rejected cloud to device messages in **MQTT** protocol is outside the allowed range.
- Number of device to cloud messages in **MQTT** protocol is outside the allowed range.
- Number of command queue purges is outside the allowed range.
- Number of module twin updates is outside the allowed range.
- Number of unauthorized operations is outside the allowed range.

For a list of the complete Azure Security Center for IoT service related alerts and recommendations, see [security alerts](concept-security-alerts.md), [recommendations](concept-recommendations.md).

## Supported recommendations

### Device related

- Identical authentication credentials used by multiple devices.

### Hub related
- Default IP filter policy should be deny.
- IP filter rule includes large IP range.
- Enable diagnostics logs in IoT Hub.


## Contribution, feedback and issues
If you encounter any bugs, have suggestions for new features or if you would like to become an active contributor to this project please follow the instructions provided in the contribution guideline for the corresponding repo.
For general support, please post a question to [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-rtos+azure-iot-security-module) using the `azure-iot-security-module` and `azure-rtos` tags.

- Log Analytics workspace
  - Two types of information are stored by default in your Log Analytics workspace by Azure Security Center for IoT; **security alerts** and **recommendations**.
  - You can choose to add storage of an additional information type, **raw events**. Note that storing **raw events** in Log Analytics carries additional storage costs.
- IoT Hub (standard tier)
- Meet all [service prerequisites](service-prerequisites.md)

### Customize geolocation and IP address handling

To secure your IoT solution, IP addresses of incoming and outgoing connections to and from your IoT devices, IoT Edge, and IoT Hub(s) are collected and stored by default. This information is essential to detect abnormal connectivity from suspicious IP sources. For example, when attempts are made to establish connections from an IP source of a known botnet or from an IP source outside your geolocation. Azure Security Module for IoT - RTOS enables you to choose which data you collect. 

To enable, disable, or modify collection of IP address data:

1. Open your IoT Hub and then select **Security** from the **Settings** menu.
1. Choose the **Data Collection** screen and modify the geolocation and/or IP data collection settings as you wish.

### Log Analytics (optional)

Not required, but Log Analytics can be helpful for deeper investigation purposes. Read more about [Log Analytics with Azure Security Center for IoT]() to learn more. 


## Next steps

- Read the Azure Security Center for IoT [Overview](overview.md)
- Learn about Azure Security Center for IoT [Architecture](architecture.md)
- Understand and explore [Azure Security Center for IoT alerts](concept-security-alerts.md)
- Understand and explore [Azure Security Center for IoT recommendation](concept-recommendations.md)

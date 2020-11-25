---
title: Configure and customize Security Module for Azure RTOS
description: Learn about how to configure and customize your Security Module for Azure RTOS.
services: defender-for-iot
ms.service: defender-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/09/2020
ms.author: mlottner
---

# Configure and customize Security Module for Azure RTOS (preview)

Use this following file to configure your device behavior.

## azure_iot_security_module/inc/asc_port.h

 The default behavior of each configuration is provided in the following tables: 

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

## Supported security alerts and recommendations

The Security Module for Azure RTOS supports specific security alerts and recommendations. Make sure to [review and customize the relevant alert and recommendation values](concept-rtos-security-alerts-recommendations.md) for your service.

## Log Analytics (optional)

While optional and not required, enabling and configuring Log Analytics can be helpful when you wish to further investigate device events and activities. Read about how to setting up and use [Log Analytics with the Defender for IoT service](how-to-security-data-access.md#log-analytics) to learn more. 

## Next steps

- Review and customize Security Module for Azure RTOS [security alerts and recommendations](concept-rtos-security-alerts-recommendations.md)
- Refer to the [Security Module for Azure RTOS API](azure-rtos-security-module-api.md) as needed.


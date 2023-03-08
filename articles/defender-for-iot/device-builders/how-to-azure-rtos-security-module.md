---
title: Configure and customize Defender-IoT-micro-agent for Azure RTOS
description: Learn about how to configure and customize your Defender-IoT-micro-agent for Azure RTOS.
ms.topic: how-to
ms.date: 01/01/2023
---

# Configure and customize Defender-IoT-micro-agent for Azure RTOS

This article describes how to configure the Defender-IoT-micro-agent for your Azure RTOS device, to meet your network, bandwidth, and memory requirements.

## Configuration steps

You must select a target distribution file that has a `*.dist` extension, from the `netxduo/addons/azure_iot/azure_iot_security_module/configs` directory.  

When using a CMake compilation environment, you must set a command line parameter to `IOT_SECURITY_MODULE_DIST_TARGET` for the chosen value. For example, `-DIOT_SECURITY_MODULE_DIST_TARGET=RTOS_BASE`.

In an IAR, or other non CMake compilation environment, you must add the `netxduo/addons/azure_iot/azure_iot_security_module/inc/configs/<target distribution>/` path to any known included paths. For example, `netxduo/addons/azure_iot/azure_iot_security_module/inc/configs/RTOS_BASE`.

## Device behavior

Use the following file to configure your device behavior.

**netxduo/addons/azure_iot/azure_iot_security_module/inc/configs/\<target distribution>/asc_config.h**

In a CMake compilation environment, you must change the default configuration by editing the `netxduo/addons/azure_iot/azure_iot_security_module/configs/<target distribution>.dist` file. Use the following CMake format `set(ASC_XXX ON)`, or the following file `netxduo/addons/azure_iot/azure_iot_security_module/inc/configs/<target distribution>/asc_config.h` for all other environments. For example, `#define ASC_XXX`.

The default behavior of each configuration is provided in the following tables: 

## General configuration

| Name | Type | Default | Details |
| - | - | - | - |
| ASC_SECURITY_MODULE_ID | String | defender-iot-micro-agent | The unique identifier of the device.  |
| SECURITY_MODULE_VERSION_(MAJOR)(MINOR)(PATCH)  | Number | 3.2.1 | The version. |
| ASC_SECURITY_MODULE_SEND_MESSAGE_RETRY_TIME  | Number  | 3 | The amount of time the Defender-IoT-micro-agent will take to send the security message after a fail. (in seconds) |
| ASC_SECURITY_MODULE_PENDING_TIME  | Number | 300 | The Defender-IoT-micro-agent pending time (in seconds). The state will change to suspend, if the time is exceeded. |

## Collection configuration

| Name | Type | Default | Details |
| - | - | - | - |
| ASC_FIRST_COLLECTION_INTERVAL | Number  | 30  | The Collector's startup collection interval offset. During startup, the value will be added to the collection of the system in order to avoid sending messages from multiple devices simultaneously.  |
| ASC_HIGH_PRIORITY_INTERVAL | Number | 10 | The collector's high priority group interval (in seconds). |
| ASC_MEDIUM_PRIORITY_INTERVAL | Number | 30 | The collector's medium priority group interval (in seconds). |
| ASC_LOW_PRIORITY_INTERVAL | Number | 145,440  | The collector's low priority group interval (in seconds). |

#### Collector network activity

To customize your collector network activity configuration, use the following:

| Name | Type | Default | Details |
| - | - | - | - |
| ASC_COLLECTOR_NETWORK_ACTIVITY_TCP_DISABLED | Boolean | false | Filters the `TCP` network activity. |
| ASC_COLLECTOR_NETWORK_ACTIVITY_UDP_DISABLED | Boolean | false | Filters the `UDP` network activity events. |
| ASC_COLLECTOR_NETWORK_ACTIVITY_ICMP_DISABLED | Boolean | false | Filters the `ICMP` network activity events. |
| ASC_COLLECTOR_NETWORK_ACTIVITY_CAPTURE_UNICAST_ONLY | Boolean | true | Captures the unicast incoming packets only. When set to false, it will also capture both Broadcast, and Multicast. |
| ASC_COLLECTOR_NETWORK_ACTIVITY_SEND_EMPTY_EVENTS  | Boolean  | false  | Sends an empty events of collector. |
| ASC_COLLECTOR_NETWORK_ACTIVITY_MAX_IPV4_OBJECTS_IN_CACHE | Number | 64 | The maximum number of IPv4 network events to store in memory. |
| ASC_COLLECTOR_NETWORK_ACTIVITY_MAX_IPV6_OBJECTS_IN_CACHE | Number | 64  | The maximum number of IPv6 network events to store in memory. |

### Collectors
| Name | Type | Default | Details |
| - | - | - | - |
| ASC_COLLECTOR_HEARTBEAT_ENABLED | Boolean | ON | Enables the heartbeat collector. |
| ASC_COLLECTOR_NETWORK_ACTIVITY_ENABLED  | Boolean | ON | Enables the network activity collector. |
| ASC_COLLECTOR_SYSTEM_INFORMATION_ENABLED | Boolean | ON | Enables the system information collector.  |

Other configurations flags are advanced, and have unsupported features. Contact support to change this, or for more information.
 
## Supported security alerts and recommendations

The Defender-IoT-micro-agent for Azure RTOS supports specific security alerts and recommendations. Make sure to [review and customize the relevant alert and recommendation values](concept-rtos-security-alerts-recommendations.md) for your service.

## Log Analytics (optional)

You can enable and configure Log Analytics to investigate device events and activities. Read about how to setup, and use [Log Analytics with the Defender for IoT service](how-to-security-data-access.md#log-analytics) to learn more. 

## Next steps


- Review and customize Defender-IoT-micro-agent for Azure RTOS [security alerts and recommendations](concept-rtos-security-alerts-recommendations.md)
- Refer to the [Defender-IoT-micro-agent for Azure RTOS API](azure-rtos-security-module-api.md) as needed.

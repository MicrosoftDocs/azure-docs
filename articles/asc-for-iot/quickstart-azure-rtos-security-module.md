---
title: "Quickstart: Configure and enable the Azure RTOS IoT security module"
description: Learn how to onboard and enable the Azure Security Center for IoT Azure RTOS security module service in your Azure IoT Hub.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/06/2020
ms.author: mlottner
---

# Quickstart: Onboard Azure Security Center for IoT Azure RTOS IoT security module 

This article provides an explanation of the prerequisites before getting started and explains how to enable the Azure IoT security module for Azure RTOS service on an IoT Hub. If you don't currently have an IoT Hub, see [Create an IoT Hub using the Azure portal](https://docs.microsoft.com/azure/iot-hub/iot-hub-create-through-portal) to get started.

> [!NOTE]
> Azure IoT Security Module currently only supports standard tier IoT Hubs.

## Prerequisites 

To enable the service:

- Install the following tools:
  - [CMake](https://cmake.org/download/) version 3.13 or later

- Make sure the following packages and configurations are setup correctly:
  - Azure RTOS – Azure IoT Middleware.
  - **NX_AZURE_DISABLE_IOT_SECURITY_MODULE** Compile flag is OFF.
  
### IoT Hub connection

If you don't already have IoT security enabled on your IoT Hub, enable security on your IoT Hub to get started:

1. Open your **IoT Hub** in Azure portal.
1. Under the **Security** menu, click **Secure your IoT solution**.

The Azure IoT Security Module uses Azure IoT Middleware connections based on the **MQT** protocol.
Connections credentials are taken from the user application configuration **HOST_NAM**, **DEVICE_ID**,and **DEVICE_SYMMETRIC_KEY**.

## Configuration 

**azure_iot_security_module/inc/asc_port.h**

#### General

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
- Number of cloud to device messages in **AMQP** protocol is outside the allowed range.
- Number of rejected cloud to device messages in **AMQP** protocol is outside the allowed range.
- Number of device to cloud messages in **AMQP** protocol is outside the allowed range.
- Number of direct method invokes is outside the allowed range.
- Number of file uploads is outside the allowed range.
- Number of cloud to device messages in **HTTP** protocol is outside the allowed range.
- Number of rejected cloud to device messages in **HTTP** protocol is not in the allowed range.
- Number of device to cloud messages in **HTTP** protocol is outside the allowed range.
- Number of cloud to device messages in **MQTT** protocol is outside the allowed range.
- Number of rejected cloud to device messages in **MQTT** protocol is outside the allowed range.
- Number of device to cloud messages in **MQTT** protocol is outside the allowed range.
- Number of command queue purges is outside the allowed range.
- Number of module twin updates is outside the allowed range.
- Number of unauthorized operations is outside the allowed range.

## Supported recommendations

### Device related

- Identical authentication credentials used by multiple devices.

### Hub related
- Default IP filter policy should be deny.
- IP filter rule includes large IP range.
- Enable diagnostics logs in IoT Hub.

### Device related


## Contribution, feedback and issues
If you encounter any bugs, have suggestions for new features or if you would like to become an active contributor to this project please follow the instructions provided in the contribution guideline for the corresponding repo.
For general support, please post a question to [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-rtos+azure-iot-security-module) using the `azure-iot-security-module` and `azure-rtos` tags.

- Log Analytics workspace
  - Two types of information are stored by default in your Log Analytics workspace by Azure Security Center for IoT; **security alerts** and **recommendations**.
  - You can choose to add storage of an additional information type, **raw events**. Note that storing **raw events** in Log Analytics carries additional storage costs.
- IoT Hub (standard tier)
- Meet all [service prerequisites](service-prerequisites.md)

### Geolocation and IP address handling

To secure your IoT solution, IP addresses of incoming and outgoing connections to and from your IoT devices, IoT Edge, and IoT Hub(s) are collected and stored by default. This information is essential to detect abnormal connectivity from suspicious IP sources. For example, when attempts are made to establish connections from an IP source of a known botnet or from an IP source outside your geolocation. Azure Security Center for IoT service offers the flexibility to enable and disable collection of IP address data at any time.

To enable or disable collection of IP address data:

1. Open your IoT Hub and then select **Overview** from the **Security** menu.
1. Choose the **Settings** screen and modify the geolocation and/or IP handling settings as you wish.

### Log Analytics creation

When Azure Security Center for IoT is turned on, a default Azure Log Analytics workspace is created to store raw security events, alerts, and recommendations for your IoT devices, IoT Edge, and IoT Hub. Each month, the first five (5) GB of data ingested per customer to the Azure Log Analytics service  is free. Every GB of data ingested into your Azure Log Analytics workspace is retained at no charge for the first 31 days. Learn more about [Log Analytics](https://azure.microsoft.com/pricing/details/monitor/) pricing.

To change the workspace configuration of Log Analytics:

1. Open your IoT Hub and then select **Overview** from the **Security** menu.
1. Choose the **Settings** screen and modify the workspace configuration of Log Analytics settings as you wish.

### Customize your IoT security solution

By default, turning on the Azure Security Center for IoT solution automatically secures all IoT Hubs under your Azure subscription.

To turn Azure Security Center for IoT service on a specific IoT Hub on or off:

1. Open your IoT Hub and then select **Overview** from the **Security** menu.
1. Choose the **Settings** screen and modify the security settings of any IoT hub in your Azure subscription as you wish.

## Next steps

Advance to the next article to configure your solution...

> [!div class="nextstepaction"]
> [Configure your solution](quickstart-configure-your-solution.md)

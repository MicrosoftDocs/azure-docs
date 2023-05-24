---
title: Monitor AP5GC UE usage with Event Hubs
description: Information on using Azure Event Hubs to monitor UE usage in your private mobile network. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: conceptual 
ms.date: 05/24/2023
ms.custom: template-concept
---

# Monitor AP5GC UE usage with Event Hubs

Azure Private 5G Core can be configured to integrate with Azure Event Hub, allowing you to monitor UE usage. This can be configured during site creation, see [Collect UE usage tracking values](collect-required-information-for-a-site.md#collect-ue-usage-tracking-values) or at a later stage by [modifying the packet core](modify-packet-core.md).

## UE usage attributes

When configured, AP5GC will send data usage reports per QoS flow level for all PDU sessions. The following data is reported:

|Data name |Data Type |Description |
|---|---|---|
|**Subscriber Identifier (SUPI/IMSI)** |String | The identifier associated with the UE.|
|**IMEI** |String | The International Mobile Equipment Identity associated with the UE.|
|**Serving PLMN ID** |String | The ID of the serving public land mobile network associated with the UE.|
|**Event Timestamp** |Datetime |Timestamp of the UE event.|
|**Total data Volume (Bytes)** |Integer | Total data volume transmitted. Measured in bytes.|
|**Uplink data volume** |Integer |Uplink data volume transmitted. Measured in bytes.|
|**Downlink data volume** |Integer |Downlink data volume transmitted. Measured in bytes.|
|**APN/DNN** |String | The data point or data network name.|
|**Timestamp First usage** |Datetime |Time stamp for the first IP packet to be transmitted and mapped to the current UE data usage event. |
|**Timestamp Last usage** |Datetime |Time stamp for the last IP packet to be transmitted and mapped to the current UE data usage event. |
|**Duration** |Integer |Duration in seconds in which this event data is collected. |
|**RAN Identifier** |String | The radio access network identifier associated with the UE.|
|**RAT Type** |Integer | The radio access technology type.|
|**QCI/5QI** |Integer | The quality of service identifier. See [5G quality of service (QoS) and QoS flows](policy-control.md#5g-quality-of-service-qos-and-qos-flows) for more information. |
|**PDU Session ID** |String |The identifier for the protocol data unit for the UE event.|
|**IP Address** |String |The UE's IP address.|
|**Packet Core Control Plane ARM ID** |String |The identifier of the packet core control plane ARM associated with the UE.|
|**Packet Core Data Plane ARM ID** |String |The identifier of the packet core data plane ARM associated with the UE.|
|**ARP**|String|The address resolution protocol, including the: priority level, preemption capability and preemption vulnerability. See [5G quality of service (QoS) and QoS flows](policy-control.md#5g-quality-of-service-qos-and-qos-flows) for more information. |
|- **ArpPriorityLevel**|Int (1-15) |See above.|
|- **Preemption Capability**|String |See above.|
|- **Preemption Vulnerability**|String |See above.|

## Next steps

- [Learn more about Azure Event Hubs](/azure/event-hubs/monitor-event-hubs)
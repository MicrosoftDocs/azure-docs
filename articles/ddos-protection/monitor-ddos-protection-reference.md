---
title: 'Monitoring Azure DDoS Protection'
description: Important reference material needed when you monitor DDoS Protection.
author: AbdullahBell
ms.author: abell
ms.service: ddos-protection
ms.topic: conceptual
ms.date: 03/22/2023
ms.custom: template-concept
---

# Monitoring Azure DDoS Protection


The following section outlines the metrics of the Azure DDoS Protection service.

## Metrics



### DDoS protection metrics

The metric names present different packet types, and bytes vs. packets, with a basic construct of tag names on each metric as follows:

* **Dropped tag name** (for example, **Inbound Packets Dropped DDoS**): The number of packets dropped/scrubbed by the DDoS protection system.

* **Forwarded tag name** (for example **Inbound Packets Forwarded DDoS**): The number of packets forwarded by the DDoS system to the destination VIP – traffic that wasn't filtered.

* **No tag name** (for example **Inbound Packets DDoS**): The total number of packets that came into the scrubbing system – representing the sum of the packets dropped and forwarded.

> [!NOTE]
> While multiple options for **Aggregation** are displayed on Azure portal, only the aggregation types listed in the table below are supported for each metric. We apologize for this confusion and we are working to resolve it.
The following [Azure Monitor metrics](../azure-monitor/essentials/metrics-supported.md#microsoftnetworkpublicipaddresses) are available for Azure DDoS Protection. These metrics are also exportable via diagnostic settings, see [View and configure DDoS diagnostic logging](diagnostic-logging.md).

| Metric | Metric Display Name | Unit | Aggregation Type | Description |
| --- | --- | --- | --- | --- |
| BytesDroppedDDoS​ | Inbound bytes dropped DDoS​ | BytesPerSecond​ | Maximum​ | Inbound bytes dropped DDoS​|
| BytesForwardedDDoS​ | Inbound bytes forwarded DDoS​ | BytesPerSecond​ | Maximum​ | Inbound bytes forwarded DDoS​ |
| BytesInDDoS​ | Inbound bytes DDoS​ | BytesPerSecond​ | Maximum​ | Inbound bytes DDoS​ |
| DDoSTriggerSYNPackets​ | Inbound SYN packets to trigger DDoS mitigation​ | CountPerSecond​ | Maximum​ | Inbound SYN packets to trigger DDoS mitigation​ |
| DDoSTriggerTCPPackets​ | Inbound TCP packets to trigger DDoS mitigation​ | CountPerSecond​ | Maximum​ | Inbound TCP packets to trigger DDoS mitigation​ |
| DDoSTriggerUDPPackets​ | Inbound UDP packets to trigger DDoS mitigation​ | CountPerSecond​ | Maximum​ | Inbound UDP packets to trigger DDoS mitigation​ |
| IfUnderDDoSAttack​ | Under DDoS attack or not​ | Count​ | Maximum​ | Under DDoS attack or not​ |
| PacketsDroppedDDoS​ | Inbound packets dropped DDoS​ | CountPerSecond​ | Maximum​ | Inbound packets dropped DDoS​ |
| PacketsForwardedDDoS​ | Inbound packets forwarded DDoS​ | CountPerSecond​ | Maximum​ | Inbound packets forwarded DDoS​ |
| PacketsInDDoS​ | Inbound packets DDoS​ | CountPerSecond​ | Maximum​ | Inbound packets DDoS​ |
| TCPBytesDroppedDDoS​ | Inbound TCP bytes dropped DDoS​ | BytesPerSecond​ | Maximum​ | Inbound TCP bytes dropped DDoS​ |
| TCPBytesForwardedDDoS​ | Inbound TCP bytes forwarded DDoS​ | BytesPerSecond​ | Maximum​ | Inbound TCP bytes forwarded DDoS​ |
| TCPBytesInDDoS​ | Inbound TCP bytes DDoS​ | BytesPerSecond​ | Maximum​ | Inbound TCP bytes DDoS​ |
| TCPPacketsDroppedDDoS​ | Inbound TCP packets dropped DDoS​ | CountPerSecond​ | Maximum​ | Inbound TCP packets dropped DDoS​ |
| TCPPacketsForwardedDDoS​ | Inbound TCP packets forwarded DDoS​ | CountPerSecond​ | Maximum​ | Inbound TCP packets forwarded DDoS​ |
| TCPPacketsInDDoS​ | Inbound TCP packets DDoS​ | CountPerSecond​ | Maximum​ | Inbound TCP packets DDoS​ |
| UDPBytesDroppedDDoS​ | Inbound UDP bytes dropped DDoS​ | BytesPerSecond​ | Maximum​ | Inbound UDP bytes dropped DDoS​ |
| UDPBytesForwardedDDoS​ | Inbound UDP bytes forwarded DDoS​ | BytesPerSecond​ | Maximum​ | Inbound UDP bytes forwarded DDoS​ |
| UDPBytesInDDoS​ | Inbound UDP bytes DDoS​ | BytesPerSecond​ | Maximum​ | Inbound UDP bytes DDoS​ |
| UDPPacketsDroppedDDoS​ | Inbound UDP packets dropped DDoS​ | CountPerSecond​ | Maximum​ | Inbound UDP packets dropped DDoS​ |
| UDPPacketsForwardedDDoS​ | Inbound UDP packets forwarded DDoS​ | CountPerSecond​ | Maximum​ | Inbound UDP packets forwarded DDoS​ |
| UDPPacketsInDDoS​ | Inbound UDP packets DDoS​ | CountPerSecond​ | Maximum​ | Inbound UDP packets DDoS​ |

## Next steps

* [Configure DDoS Alerts](alerts.md)
* [View alerts in Microsoft Defender for Cloud](ddos-view-alerts-defender-for-cloud.md)
* [Test with simulation partners](test-through-simulations.md)



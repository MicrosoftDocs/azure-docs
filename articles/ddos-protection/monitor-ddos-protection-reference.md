---
title: 'Monitoring Azure DDoS Protection'
description: Important reference material needed when you monitor DDoS Protection 
author: AbdullahBell
ms.author: abell
ms.service: ddos-protection
ms.topic: conceptual 
ms.date: 12/19/2022
ms.custom: template-concept
---

# Monitoring Azure DDoS Protection


See [Tutorial: View and configure Azure DDoS protection telemetry](telemetry.md) for details on collecting, analyzing, and monitoring DDoS Protection.

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
## Diagnostic logs

See [Tutorial: View and configure Azure DDoS Protection diagnostic logging](diagnostic-logging.md) for details on attack insights and visualization with DDoS Attack Analytics.

The following diagnostic logs are available for Azure DDoS Protection:

- **DDoSProtectionNotifications**: Notifications will notify you anytime a public IP resource is under attack, and when attack mitigation is over.
- **DDoSMitigationFlowLogs**: Attack mitigation flow logs allow you to review the dropped traffic, forwarded traffic and other interesting data-points during an active DDoS attack in near-real time. You can ingest the constant stream of this data into Microsoft Sentinel or to your third-party SIEM systems via event hub for near-real time monitoring, take potential actions and address the need of your defense operations.
- **DDoSMitigationReports**: Attack mitigation reports use the Netflow protocol data, which is aggregated to provide detailed information about the attack on your resource. Anytime a public IP resource is under attack, the report generation will start as soon as the mitigation starts. There will be an incremental report generated every 5 mins and a post-mitigation report for the whole mitigation period. This is to ensure that in an event the DDoS attack continues for a longer duration of time, you'll be able to view the most current snapshot of mitigation report every 5 minutes and a complete summary once the attack mitigation is over.
- **AllMetrics**: Provides all possible metrics available during the duration of a DDoS attack.

## Log schemas

The following table lists the field names and descriptions:

# [DDoSProtectionNotifications](#tab/DDoSProtectionNotifications)

| Field name | Description |
| --- | --- |
| **TimeGenerated** | The date and time in UTC when the notification was created. |
| **ResourceId** | The resource ID of your public IP address. |
| **Category** | For notifications, this will be `DDoSProtectionNotifications`.|
| **ResourceGroup** | The resource group that contains your public IP address and virtual network. |
| **SubscriptionId** | Your DDoS protection plan subscription ID. |
| **Resource** | The name of your public IP address. |
| **ResourceType** | This will always be `PUBLICIPADDRESS`. |
| **OperationName** | For notifications, this will be `DDoSProtectionNotifications`.  |
| **Message** | Details of the attack. |
| **Type** | Type of notification. Possible values include `MitigationStarted`. `MitigationStopped`. |
| **PublicIpAddress** | Your public IP address. |

# [DDoSMitigationFlowLogs](#tab/DDoSMitigationFlowLogs)

| Field name | Description |
| --- | --- |
| **TimeGenerated** | The date and time in UTC when the flow log was created. |
| **ResourceId** | The resource ID of your public IP address. |
| **Category** | For flow logs, this will be `DDoSMitigationFlowLogs`.|
| **ResourceGroup** | The resource group that contains your public IP address and virtual network. |
| **SubscriptionId** | Your DDoS protection plan subscription ID. |
| **Resource** | The name of your public IP address. |
| **ResourceType** | This will always be `PUBLICIPADDRESS`. |
| **OperationName** | For flow logs, this will be `DDoSMitigationFlowLogs`. |
| **Message** | Details of the attack. |
| **SourcePublicIpAddress** | The public IP address of the client generating traffic to your public IP address. |
| **SourcePort** | Port number ranging from 0 to 65535. |
| **DestPublicIpAddress** | Your public IP address. |
| **DestPort** | Port number ranging from 0 to 65535. |
| **Protocol** | Type of protocol. Possible values include `tcp`, `udp`, `other`.|

# [DDoSMitigationReports](#tab/DDoSMitigationReports)

| Field name | Description |
| --- | --- |
| **TimeGenerated** | The date and time in UTC when the report was created. |
| **ResourceId** | The resource ID of your public IP address. |
| **Category** | For notifications, this will be `DDoSMitigationReports`.|
| **ResourceGroup** | The resource group that contains your public IP address and virtual network. |
| **SubscriptionId** | Your DDoS protection plan subscription ID. |
| **Resource** | The name of your public IP address. |
| **ResourceType** | This will always be `PUBLICIPADDRESS`. |
| **OperationName** | For mitigation reports, this will be `DDoSMitigationReports`. |
| **ReportType** | Possible values include `Incremental`, `PostMitigation`.|
| **MitigationPeriodStart** | The date and time in UTC when the mitigation started.  |
| **MitigationPeriodEnd** | The date and time in UTC when the mitigation ended. |
| **IPAddress** | Your public IP address. |
| **AttackVectors** |  Breakdown of attack types. Keys include `TCP SYN flood`, `TCP flood`, `UDP flood`, `UDP reflection`, `Other packet flood`.|
| **TrafficOverview** |  Breakdown of attack traffic. Keys include `Total packets`, `Total packets dropped`, `Total TCP packets`, `Total TCP packets dropped`, `Total UDP packets`, `Total UDP packets dropped`, `Total Other packets`, `Total Other packets dropped`. |
| **Protocols** | Breakdown of protocols involved. Keys include `TCP`, `UDP`, `Other`. |
| **DropReasons** | Breakdown of reasons for dropped packets. Keys include `Protocol violation invalid TCP syn`, `Protocol violation invalid TCP`, `Protocol violation invalid UDP`, `UDP reflection`, `TCP rate limit exceeded`, `UDP rate limit exceeded`, `Destination limit exceeded`, `Other packet flood`, `Rate limit exceeded`, `Packet was forwarded to service`. |
| **TopSourceCountries** | Breakdown of top 10 source countries of incoming traffic. |
| **TopSourceCountriesForDroppedPackets** | Breakdown of top 10 source countries of attack traffic that is/was mitigated. |
| **TopSourceASNs** | Breakdown of top 10 source autonomous system numbers (ASN) of the incoming traffic.  |
| **SourceContinents** | Breakdown of the source continents of incoming traffic. |
***

## Next steps

> [!div class="nextstepaction"]
> [View and configure DDoS diagnostic logging](diagnostic-logging.md)
>
> [Test with simulation partners](test-through-simulations.md)



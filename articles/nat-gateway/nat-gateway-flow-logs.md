---
title: Manage StandardV2 NAT Gateway Flow Logs
titleSuffix: Azure NAT Gateway
description: Learn about StandardV2 NAT Gateway Flow Logs - what are flow logs and how it can be used.
author: asudbring
ms.author: allensu
ms.service: azure-nat-gateway
ms.topic: how-to
ms.date: 11/04/2025
ms.custom:
#Customer intent: As a network administrator, I want to learn about StandardV2 NAT Gateway flow logs and what it can be used for.
---

# Manage StandardV2 NAT Gateway Flow Logs

NAT Gateway Flow Logs provide IP information on the traffic flowing through your StandardV2 NAT gateway. Logs are captured through Azure Monitor resource log category `NatGatewayFlowLogsV1`, which you enable through Diagnostic Settings on your StandardV2 NAT gateway resource.

## Why use flow logs?

Flow logs provide visibility to the traffic flowing through your NAT gateway, which is critical to:

- **Monitor outbound traffic:** Detect unexpected outbound connections or potential security risks.

- **Ensure traceability:** Maintain a record of traffic flows for auditing and forensic analysis.

- **Analyze traffic patterns:** Understand bandwidth consumption and identify top talkers (for example, which virtual machines initiate the most outbound connections).

- **Troubleshoot connectivity issues:** Pinpoint failures or misconfigurations in outbound traffic paths.

- **Verify compliance:** Confirm that outbound traffic aligns with organizational policies and regulatory requirements.

## About the logs

Logs are captured in a 1-minute time window and can take up to 3 minutes for the data to become available in Azure Monitor.

The following table describes the fields and their definitions for *NatGatewayFlowlogsV1* log category.

| **Field** | **Type** | **Description** |
|----|----|----|
| TimeGenerated | Time in \[UTC\] | Time the data was generated from the data source. |
| SourceIp | string | Source IP address of originating traffic (Azure virtual machine's private IP). |
| DestinationIp | string | Destination IP address of originating traffic (Internet IP address). |
| NatGatewayIp | string | NAT Gateway IP address. |
| packetsSent | int / null | Count of packets sent from source IP and allowed by the NAT Gateway. |
| PacketsReceived | int / null | Count of packets received from destination IP and allowed by the NAT Gateway.  |
| PacketsSentDropped | int / null | Count of packets sent from source IP and dropped by the NAT Gateway. |
| PacketsReceivedDropped | int / null | Count of packets received from destination IP and dropped by the NAT Gateway. |
| BytesSent | int / null | Count of bytes sent from source IP and allowed by the NAT Gateway. |
| BytesReceived | int / null | Count of bytes received from destination IP and allowed by the NAT Gateway.  |
| \_resourceId | string | Resource ID of the NAT Gateway connected to the traffic |

## FAQs

**How is the pricing calculated?**

When your NAT gateway resource has *NatGatewayFlowlogsV1* log category enabled, it incurs a \$4 monthly fee. The charge is prorated hourly based on how long the Diagnostic setting remains active. For example, if the setting is enabled for 71.5 hours, you will be billed for 72 hours and total cost for that month would be \[72 ÷ 730 (total number of hours in a month) × \$4\] = \$0.40.

**What do dropped packets mean?**

The packetsSentDropped and packetsReceivedDropped fields indicate packets that were dropped after a NAT gateway connection was successfully established. These dropped fields don't include failures to establish a connection, such as failures caused by SNAT port exhaustion.

**Does Standard NAT Gateway have Flow Logs?**

Flow Logs are only available for [StandardV2 NAT Gateway](/azure/nat-gateway/nat-overview).

## Next step

To learn how to set up flow logs, see [enabling and analyzing StandardV2 NAT Gateway flow logs](/azure/nat-gateway/monitor-nat-gateway-flow-logs).

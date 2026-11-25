---
title: Monitoring security admin rules with virtual network flow logs
description: This article covers using Network Watcher and Virtual Network Flow Logs to monitor traffic through security admin rules in Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.topic: concept-article
ms.service: azure-virtual-network-manager
ms.date: 07/29/2026
---

# Monitoring Azure Virtual Network Manager with virtual network flow logs

Monitoring traffic is critical to understanding how your network is performing and to troubleshoot issues. Administrators can utilize virtual network flow logs to show whether traffic is flowing through or blocked on a virtual network by a [security admin rule](concept-security-admins.md). Virtual network flow logs are a feature of Network Watcher.

Learn more about [virtual network flow logs](../network-watcher/vnet-flow-logs-overview.md) including usage and how to enable.

## Enable virtual network flow logs

Currently, you need to enable virtual network flow logs on each virtual network you want to monitor. You can enable virtual network flow logs on a virtual network by using the [Azure portal](../network-watcher/vnet-flow-logs-portal.md), [PowerShell](../network-watcher/vnet-flow-logs-powershell.md), or the [Azure CLI](../network-watcher/vnet-flow-logs-cli.md) guide.

## How security admin rules appear in flow logs

Each flow log record groups flows under the resource that evaluated them, so you can determine whether an Azure Virtual Network Manager security admin rule allowed or denied a flow directly from the record. Three fields carry that answer:

| Field | What it tells you |
| --- | --- |
| `aclID` | Identifier of the resource that evaluated the traffic, either a network security group or Azure Virtual Network Manager. For traffic denied because of encryption, this value is `unspecified`. |
| `flowGroups[].rule` | Name of the rule that allowed or denied the traffic. For a flow evaluated by Azure Virtual Network Manager, this value is the name of the security admin rule. For traffic denied because of encryption, this value is `unspecified`. |
| `flowGroups[].flowTuples` | Comma-separated flow records. The seventh value is the traffic direction and the eighth value is the flow state, which carries the allow or deny decision. |

Each flow tuple uses this field order:

`Time Stamp, Source IP, Destination IP, Source port, Destination port, Protocol, Flow direction, Flow state, Flow encryption, Packets sent, Bytes sent, Packets received, Bytes received`

**Flow direction** is `I` for inbound or `O` for outbound. **Flow state** is `B` when a flow begins, `C` while it continues, `E` when it ends, and `D` when the flow is denied. A flow state of `D` under a security admin rule name is how a blocked connection appears in the log.

For example, this tuple appears under the rule `BlockHighRiskTCPPortsFromInternet`:

```output
1663145998065,203.0.113.153,10.0.0.6,55188,22,6,I,D,NX,0,0,0,0
```

The tuple records inbound (`I`) TCP traffic (protocol `6`) from 203.0.113.153 to 10.0.0.6 on destination port 22 that was denied (`D`), with no packets or bytes transferred in either direction. Because the flow appears under `BlockHighRiskTCPPortsFromInternet`, the security admin rule with that name blocked the connection.

For the complete flow log schema, including all flow encryption values, see [Virtual network flow logs](../network-watcher/vnet-flow-logs-overview.md).

### Example flow log record

The following record is trimmed to one allowed flow group and two denied flow groups. The first group shows outbound traffic allowed by `DefaultRule_AllowInternetOutBound`, and the remaining groups show inbound traffic denied by `BlockHighRiskTCPPortsFromInternet` and by the `Internet` rule.

```json
{
    "records": [
        {
            "time": "2022-09-14T09:00:52.5625085Z",
            "flowLogVersion": 4,
            "flowLogGUID": "66aa66aa-bb77-cc88-dd99-00ee00ee00ee",
            "macAddress": "112233445566",
            "category": "FlowLogFlowEvent",
            "flowLogResourceID": "/SUBSCRIPTIONS/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/RESOURCEGROUPS/NETWORKWATCHERRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKWATCHERS/NETWORKWATCHER_EASTUS2EUAP/FLOWLOGS/VNETFLOWLOG",
            "targetResourceID": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet",
            "operationName": "FlowLogFlowEvent",
            "flowRecords": {
                "flows": [
                    {
                        "aclID": "00aa00aa-bb11-cc22-dd33-44ee44ee44ee",
                        "flowGroups": [
                            {
                                "rule": "DefaultRule_AllowInternetOutBound",
                                "flowTuples": [
                                    "1663146003599,10.0.0.6,192.0.2.180,23956,443,6,O,B,NX,0,0,0,0",
                                    "1663146003606,10.0.0.6,192.0.2.180,23956,443,6,O,E,NX,3,767,2,1580"
                                ]
                            }
                        ]
                    },
                    {
                        "aclID": "00aa00aa-bb11-cc22-dd33-44ee44ee44ee",
                        "flowGroups": [
                            {
                                "rule": "BlockHighRiskTCPPortsFromInternet",
                                "flowTuples": [
                                    "1663145998065,203.0.113.153,10.0.0.6,55188,22,6,I,D,NX,0,0,0,0",
                                    "1663146005503,192.0.2.164,10.0.0.6,35276,119,6,I,D,NX,0,0,0,0"
                                ]
                            },
                            {
                                "rule": "Internet",
                                "flowTuples": [
                                    "1663145989563,192.0.2.10,10.0.0.6,50557,44357,6,I,D,NX,0,0,0,0",
                                    "1663145989679,203.0.113.81,10.0.0.6,62797,35945,6,I,D,NX,0,0,0,0"
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    ]
}
```

## Related content

- Learn more about [virtual network flow logs](../network-watcher/vnet-flow-logs-overview.md) and how to use them.
- Learn more about [Event log options for Azure Virtual Network Manager](concept-event-logs.md).

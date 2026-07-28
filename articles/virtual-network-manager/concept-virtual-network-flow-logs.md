---
title: Monitoring security admin rules with virtual network flow logs
description: This article covers using Network Watcher and Virtual Network Flow Logs to monitor traffic through security admin rules in Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.topic: concept-article
ms.service: azure-virtual-network-manager
ms.date: 12/31/2024
---

# Monitoring Azure Virtual Network Manager with virtual network flow logs

Monitoring traffic is critical to understanding how your network is performing and to troubleshoot issues. Administrators can utilize virtual network flow logs to show whether traffic is flowing through or blocked on a virtual network by a [security admin rule](concept-security-admins.md). Virtual network flow logs are a feature of Network Watcher.

Learn more about [virtual network flow logs](../network-watcher/vnet-flow-logs-overview.md) including usage and how to enable.

## Enable virtual network flow logs

Currently, you need to enable virtual network flow logs on each virtual network you want to monitor. You can enable virtual network flow logs on a virtual network by using the [Azure portal](../network-watcher/vnet-flow-logs-portal.md), [PowerShell](../network-watcher/vnet-flow-logs-powershell.md), or the [Azure CLI](../network-watcher/vnet-flow-logs-cli.md) guide.

Here's an example of a flow log:

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
                                    "1663146003606,10.0.0.6,192.0.2.180,23956,443,6,O,E,NX,3,767,2,1580",
                                    "1663146003637,10.0.0.6,203.0.113.17,22730,443,6,O,B,NX,0,0,0,0",
                                    "1663146003640,10.0.0.6,203.0.113.17,22730,443,6,O,E,NX,3,705,4,4569",
                                    "1663146004251,10.0.0.6,203.0.113.17,22732,443,6,O,B,NX,0,0,0,0",
                                    "1663146004251,10.0.0.6,203.0.113.17,22732,443,6,O,E,NX,3,705,4,4569",
                                    "1663146004622,10.0.0.6,203.0.113.17,22734,443,6,O,B,NX,0,0,0,0",
                                    "1663146004622,10.0.0.6,203.0.113.17,22734,443,6,O,E,NX,2,134,1,108",
                                    "1663146017343,10.0.0.6,198.51.100.84,36776,443,6,O,B,NX,0,0,0,0",
                                    "1663146022793,10.0.0.6,198.51.100.84,36776,443,6,O,E,NX,22,2217,33,32466"
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
                                    "1663145989679,203.0.113.81,10.0.0.6,62797,35945,6,I,D,NX,0,0,0,0",
                                    "1663145989709,203.0.113.5,10.0.0.6,51961,65515,6,I,D,NX,0,0,0,0",
                                    "1663145990049,198.51.100.51,10.0.0.6,40497,40129,6,I,D,NX,0,0,0,0",
                                    "1663145990145,203.0.113.81,10.0.0.6,62797,30472,6,I,D,NX,0,0,0,0",
                                    "1663145990175,203.0.113.5,10.0.0.6,51961,28184,6,I,D,NX,0,0,0,0",
                                    "1663146015545,192.0.2.10,10.0.0.6,50557,31244,6,I,D,NX,0,0,0,0"
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

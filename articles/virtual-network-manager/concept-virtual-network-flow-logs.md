---
title: Monitoring security admin rules with Virtual Network Flow Logs
description: This article covers using Network Watcher and Virtual Network Flow Logs to monitor traffic through security admin rules in Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.topic: conceptual
ms.service: virtual-network-manager
ms.date: 08/11/2023
---

# Monitoring Azure Virtual Network Manager with VNet flow logs (Preview)

Monitoring traffic is critical to understanding how your network is performing and to troubleshoot issues. Administrators can utilize VNet flow logs (Preview) to show whether traffic is flowing through or blocked on a VNet by a [security admin rule]. VNet flow logs (Preview) are a feature of Network Watcher.

Learn more about [VNet flow logs (Preview)](../network-watcher/vnet-flow-logs-overview.md) including usage and how to enable.

> [!IMPORTANT]
> VNet flow logs is currently in PREVIEW. This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]

## Enable VNet flow logs (Preview)

Currently, you need to enable Virtual Network flow logs (Preview) on each VNet you want to monitor. You can enable Virtual Network Flow Logs on a VNet by using [PowerShell](../network-watcher/vnet-flow-logs-powershell.md) or the [Azure CLI](../network-watcher/vnet-flow-logs-cli.md).

Here's an example of a flow log

```json
{
    "records": [
        {
            "time": "2022-09-14T09:00:52.5625085Z",
            "flowLogVersion": 4,
            "flowLogGUID": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
            "macAddress": "00224871C205",
            "category": "FlowLogFlowEvent",
            "flowLogResourceID": "/SUBSCRIPTIONS/1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p7/RESOURCEGROUPS/NETWORKWATCHERRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKWATCHERS/NETWORKWATCHER_EASTUS2EUAP/FLOWLOGS/VNETFLOWLOG",
            "targetResourceID": "/subscriptions/1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p7/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet01",
            "operationName": "FlowLogFlowEvent",
            "flowRecords": {
                "flows": [
                    {
                        "aclID": "9a8b7c6d-5e4f-3g2h-1i0j-9k8l7m6n5o4p3",
                        "flowGroups": [
                            {
                                "rule": "DefaultRule_AllowInternetOutBound",
                                "flowTuples": [
                                    "1663146003599,10.0.0.6,52.239.184.180,23956,443,6,O,B,NX,0,0,0,0",
                                   "1663146003606,10.0.0.6,52.239.184.180,23956,443,6,O,E,NX,3,767,2,1580",
                                    "1663146003637,10.0.0.6,40.74.146.17,22730,443,6,O,B,NX,0,0,0,0",
                                    "1663146003640,10.0.0.6,40.74.146.17,22730,443,6,O,E,NX,3,705,4,4569",
                                    "1663146004251,10.0.0.6,40.74.146.17,22732,443,6,O,B,NX,0,0,0,0",
                                    "1663146004251,10.0.0.6,40.74.146.17,22732,443,6,O,E,NX,3,705,4,4569",
                                    "1663146004622,10.0.0.6,40.74.146.17,22734,443,6,O,B,NX,0,0,0,0",
                                    "1663146004622,10.0.0.6,40.74.146.17,22734,443,6,O,E,NX,2,134,1,108",
                                    "1663146017343,10.0.0.6,104.16.218.84,36776,443,6,O,B,NX,0,0,0,0",
                                    "1663146022793,10.0.0.6,104.16.218.84,36776,443,6,O,E,NX,22,2217,33,32466"
                                ]
                            }
                        ]
                    },
                    {
                        "aclID": "b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6",
                        "flowGroups": [
                            {
                                "rule": "BlockHighRiskTCPPortsFromInternet",
                                "flowTuples": [
                                    "1663145998065,101.33.218.153,10.0.0.6,55188,22,6,I,D,NX,0,0,0,0",
                                    "1663146005503,192.241.200.164,10.0.0.6,35276,119,6,I,D,NX,0,0,0,0"
                                ]
                            },
                            {
                                "rule": "Internet",
                                "flowTuples": [
                                    "1663145989563,20.106.221.10,10.0.0.6,50557,44357,6,I,D,NX,0,0,0,0",
                                    "1663145989679,20.55.117.81,10.0.0.6,62797,35945,6,I,D,NX,0,0,0,0",
                                    "1663145989709,20.55.113.5,10.0.0.6,51961,65515,6,I,D,NX,0,0,0,0",
                                    "1663145990049,13.65.224.51,10.0.0.6,40497,40129,6,I,D,NX,0,0,0,0",
                                    "1663145990145,20.55.117.81,10.0.0.6,62797,30472,6,I,D,NX,0,0,0,0",
                                    "1663145990175,20.55.113.5,10.0.0.6,51961,28184,6,I,D,NX,0,0,0,0",
                                    "1663146015545,20.106.221.10,10.0.0.6,50557,31244,6,I,D,NX,0,0,0,0"
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


## Next steps
> [!div class="nextstepaction"]
> Learn more about [VNet Flow Logs](../network-watcher/vnet-flow-logs-overview.md) and how to use them.
> Learn more about [Event log options for Azure Virtual Network Manager](concept-event-logs.md).

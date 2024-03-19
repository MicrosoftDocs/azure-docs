---
title: VNet flow logs (Preview)
titleSuffix: Azure Network Watcher
description: Learn about Azure Network Watcher VNet flow logs and how to use them to record your virtual network's traffic. 
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: concept-article
ms.date: 03/11/2024
ms.custom: references_regions

#CustomerIntent: As an Azure administrator, I want to learn about VNet flow logs so that I can log my network traffic to analyze and optimize network performance.
---

# VNet flow logs (Preview)

Virtual network (VNet) flow logs are a feature of Azure Network Watcher. You can use them to log information about IP traffic flowing through a virtual network.

Flow data from VNet flow logs is sent to Azure Storage. From there, you can access the data and export it to any visualization tool, security information and event management (SIEM) solution, or intrusion detection system (IDS). VNet flow logs overcome some of the limitations of [NSG flow logs](nsg-flow-logs-overview.md).

> [!IMPORTANT]
> The VNet flow logs feature is currently in preview. This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Why use flow logs?

It's vital to monitor, manage, and know your network so that you can protect and optimize it. You might need to know the current state of the network, who's connecting, and where users are connecting from. You might also need to know which ports are open to the internet, what network behavior is expected, what network behavior is irregular, and when sudden rises in traffic happen.

Flow logs are the source of truth for all network activity in your cloud environment. Whether you're in a startup that's trying to optimize resources or a large enterprise that's trying to detect intrusion, flow logs can help. You can use them for optimizing network flows, monitoring throughput, verifying compliance, detecting intrusions, and more.

## Common use cases

#### Network monitoring

- Identify unknown or undesired traffic.
- Monitor traffic levels and bandwidth consumption.
- Filter flow logs by IP and port to understand application behavior.
- Export flow logs to analytics and visualization tools of your choice to set up monitoring dashboards.

#### Usage monitoring and optimization

- Identify top talkers in your network.
- Combine with GeoIP data to identify cross-region traffic.
- Understand traffic growth for capacity forecasting.
- Use data to remove overly restrictive traffic rules.

#### Compliance

- Use flow data to verify network isolation and compliance with enterprise access rules.

#### Network forensics and security analysis

- Analyze network flows from compromised IPs and network interfaces.
- Export flow logs to any SIEM or IDS tool of your choice.

## VNet flow logs compared to NSG flow logs

Both VNet flow logs and [NSG flow logs](nsg-flow-logs-overview.md) record IP traffic, but they differ in their behavior and capabilities.

VNet flow logs simplify the scope of traffic monitoring because you can enable logging at [virtual networks](../virtual-network/virtual-networks-overview.md). Traffic through all supported workloads within a virtual network is recorded.

VNet flow logs also avoid the need to enable multiple-level flow logging, such as in [NSG flow logs](nsg-flow-logs-overview.md#best-practices). In NSG flow logs, network security groups are configured at both the subnet and the network interface (NIC).

In addition to existing support to identify traffic that [network security group rules](../virtual-network/network-security-groups-overview.md) allow or deny, VNet flow logs support identification of traffic that [Azure Virtual Network Manager security admin rules](../virtual-network-manager/concept-security-admins.md) allow or deny. VNet flow logs also support evaluating the encryption status of your network traffic in scenarios where you're using [virtual network encryption](../virtual-network/virtual-network-encryption-overview.md).

## How logging works

Key properties of VNet flow logs include:

- Flow logs operate at Layer 4 of the Open Systems Interconnection (OSI) model and record all IP flows going through a virtual network.
- Logs are collected at one-minute intervals through the Azure platform. They don't affect your Azure resources or network traffic.
- Logs are written in the JavaScript Object Notation (JSON) format.
- Each log record contains the network interface that the flow applies to, 5-tuple information, traffic direction, flow state, encryption state, and throughput information.
- All traffic flows in your network are evaluated through the applicable [network security group rules](../virtual-network/network-security-groups-overview.md) or [Azure Virtual Network Manager security admin rules](../virtual-network-manager/concept-security-admins.md).

## Log format

VNet flow logs have the following properties:

- `time`: Time in UTC when the event was logged.
- `flowLogVersion`: Version of the flow log schema.
- `flowLogGUID`: Resource GUID of the `FlowLog` resource.
- `macAddress`: MAC address of the network interface where the event was captured.
- `category`: Category of the event. The category is always `FlowLogFlowEvent`.
- `flowLogResourceID`: Resource ID of the `FlowLog` resource.
- `targetResourceID`: Resource ID of the target resource that's associated with the `FlowLog` resource.
- `operationName`: Always `FlowLogFlowEvent`.
- `flowRecords`: Collection of flow records.
  - `flows`: Collection of flows. This property has multiple entries for access control lists (ACLs):
    - `aclID`: Identifier of the resource that's evaluating traffic, either a network security group or Virtual Network Manager. For traffic that's denied because of encryption, this value is `unspecified`.
    - `flowGroups`: Collection of flow records at a rule level:
      - `rule`: Name of the rule that allowed or denied the traffic. For traffic that's denied because of encryption, this value is `unspecified`.
      - `flowTuples`: String that contains multiple properties for the flow tuple in a comma-separated format:
        - `Time Stamp`: Time stamp of when the flow occurred, in UNIX epoch format.
        - `Source IP`: Source IP address.
        - `Destination IP`: Destination IP address.
        - `Source port`: Source port.
        - `Destination port`: Destination port.
        - `Protocol`: Layer 4 protocol of the flow, expressed in IANA assigned values.
        - `Flow direction`: Direction of the traffic flow. Valid values are `I` for inbound and `O` for outbound.
        - `Flow state`: State of the flow. Possible states are:
          - `B`: Begin, when a flow is created. No statistics are provided.
          - `C`: Continuing for an ongoing flow. Statistics are provided at five-minute intervals.
          - `E`: End, when a flow is terminated. Statistics are provided.
          - `D`: Deny, when a flow is denied.
        - `Flow encryption`: Encryption state of the flow. The table after this list describes the possible values.
        - `Packets sent`: Total number of packets sent from the source to the destination since the last update.
        - `Bytes sent`: Total number of packet bytes sent from the source to the destination since the last update. Packet bytes include the packet header and payload.
        - `Packets received`: Total number of packets sent from the destination to the source since the last update.
        - `Bytes received`: Total number of packet bytes sent from the destination to the source since the last update. Packet bytes include the packet header and payload.

`Flow encryption` has the following possible encryption statuses:

| Encryption status | Description |
| ----------------- | ----------- |
| `X` | **Connection is encrypted**. Encryption is configured, and the platform encrypted the connection. |
| `NX` | **Connection is unencrypted**. This event is logged in two scenarios: <br> - When encryption isn't configured. <br> - When an encrypted virtual machine communicates with an endpoint that lacks encryption (such as an internet endpoint). |
| `NX_HW_NOT_SUPPORTED` | **Hardware is unsupported**. Encryption is configured, but the virtual machine is running on a host that doesn't support encryption. This problem usually happens because the field-programmable gate array (FPGA) isn't attached to the host or is faulty. Report this problem to Microsoft for investigation. |
| `NX_SW_NOT_READY` | **Software isn't ready**. Encryption is configured, but the software component (GFT) in the host networking stack isn't ready to process encrypted connections. This problem can happen when the virtual machine is starting for the first time, is restarting, or is redeployed. It can also happen when there's an update to the networking components on the host where virtual machine is running. In all these scenarios, the packet is dropped. The problem should be temporary. Encryption should start working after either the virtual machine is fully up and running or the software update on the host is complete. If the problem has a longer duration, report it to Microsoft for investigation. |
| `NX_NOT_ACCEPTED` | **Drop due to no encryption**. Encryption is configured on both source and destination endpoints, with a drop on unencrypted policies. If traffic encryption fails, the packet is dropped. |
| `NX_NOT_SUPPORTED` | **Discovery is unsupported**. Encryption is configured, but the encryption session wasn't established because the host networking stack doesn't support discovery. In this case, the packet is dropped. If you encounter this problem, report it to Microsoft for investigation. |
| `NX_LOCAL_DST` | **Destination is on the same host**. Encryption is configured, but the source and destination virtual machines are running on the same Azure host. In this case, the connection isn't encrypted by design. |
| `NX_FALLBACK` | **Fall back to no encryption**. Encryption is configured with the **Allow unencrypted** policy for both source and destination endpoints. The system attempted encryption but had a problem. In this case, the connection is allowed but isn't encrypted. For example, a virtual machine initially landed on a node that supports encryption, but this support was removed later. |

Traffic in your virtual networks is unencrypted (`NX`) by default. For encrypted traffic, see [Virtual network encryption](../virtual-network/virtual-network-encryption-overview.md).

## Sample log record

In the following example of VNet flow logs, multiple records follow the property list described earlier.

```json
{
    "records": [
        {
            "time": "2022-09-14T09:00:52.5625085Z",
            "flowLogVersion": 4,
            "flowLogGUID": "abcdef01-2345-6789-0abc-def012345678",
            "macAddress": "00224871C205",
            "category": "FlowLogFlowEvent",
            "flowLogResourceID": "/SUBSCRIPTIONS/00000000-0000-0000-0000-000000000000/RESOURCEGROUPS/NETWORKWATCHERRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKWATCHERS/NETWORKWATCHER_EASTUS2EUAP/FLOWLOGS/VNETFLOWLOG",
            "targetResourceID": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet",
            "operationName": "FlowLogFlowEvent",
            "flowRecords": {
                "flows": [
                    {
                        "aclID": "00000000-1234-abcd-ef00-c1c2c3c4c5c6",
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
                        "aclID": "01020304-abcd-ef00-1234-102030405060",
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

## Log tuple and bandwidth calculation

:::image type="content" source="media/vnet-flow-logs-overview/vnet-flow-log-format.png" alt-text="Table that shows the format of a virtual network flow log."lightbox="media/vnet-flow-logs-overview/vnet-flow-log-format.png"

Here's an example bandwidth calculation for flow tuples from a TCP conversation between `185.170.185.105:35370` and `10.2.0.4:23`:

`1493763938,185.170.185.105,10.2.0.4,35370,23,6,I,B,NX,,,,`
`1493695838,185.170.185.105,10.2.0.4,35370,23,6,I,C,NX,1021,588096,8005,4610880`
`1493696138,185.170.185.105,10.2.0.4,35370,23,6,I,E,NX,52,29952,47,27072`

For continuation (`C`) and end (`E`) flow states, byte and packet counts are aggregate counts from the time of the previous flow's tuple record. In the example conversation, the total number of packets transferred is 1,021 + 52 + 8,005 + 47 = 9,125. The total number of bytes transferred is 588,096 + 29,952 + 4,610,880 + 27,072 = 5,256,000.

## Storage account considerations for VNet flow logs 

- **Location**: The storage account must be in the same region as the virtual network.
- **Subscription**: The storage account must be in the same subscription of the virtual network or in a subscription associated with the same Microsoft Entra tenant of the virtual network's subscription.
- **Performance tier**: The storage account must be standard. Premium storage accounts aren't supported.
- **Self-managed key rotation**: If you change or rotate the access keys to your storage account, VNet flow logs stop working. To fix this problem, you must disable and then re-enable VNet flow logs.

## Pricing

Currently, VNet flow logs aren't billed. However, the following costs apply:

- Traffic analytics: if traffic analytics is enabled for VNet flow logs, traffic analytics pricing applies at per gigabyte processing rates. For more information, see [Network Watcher pricing](https://azure.microsoft.com/pricing/details/network-watcher/).

- Storage: flow logs are stored in a storage account, and their retention policy can be set from one day to 365 days. If a retention policy isn't set, the logs are maintained forever. Pricing of VNet flow logs doesn't include the costs of storage. For more information, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Availability

VNet flow logs can be enabled during the preview in the following regions: 

- Central US EUAP
- East US
- East US 2
- East US 2 EUAP
- Switzerland North
- UK South
- West Central US
- West US
- West US 2

> [!NOTE]
> You no longer need to sign up to access the preview.

## Related content

- To learn how to create, change, enable, disable, or delete VNet flow logs, see [Manage VNet flow logs using Azure PowerShell](vnet-flow-logs-powershell.md) or [Manage VNet flow logs using the Azure CLI](vnet-flow-logs-cli.md).
- To learn about traffic analytics, see [Traffic analytics overview](traffic-analytics.md) and [Schema and data aggregation in Azure Network Watcher traffic analytics](traffic-analytics-schema.md).
- To learn how to use Azure built-in policies to audit or enable traffic analytics, see [Manage traffic analytics using Azure Policy](traffic-analytics-policy-portal.md).

---
title: VNet flow logs (preview)
titleSuffix: Azure Network Watcher
description: Learn about VNet flow logs feature of Azure Network Watcher. 
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: concept-article
ms.date: 08/16/2023
---

# VNet flow logs (preview)

> [!IMPORTANT]
> VNet flow logs is currently in PREVIEW. This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Virtual network (VNet) flow logs is a feature of Azure Network Watcher that allows you to log information about IP traffic flowing through a virtual network. Flow data is sent to Azure Storage from where you can access it and export it to any visualization tool, security information and event management (SIEM) solution, or intrusion detection system (IDS) of your choice. Network Watcher VNet flow logs capability overcomes some of the existing limitations of [NSG flow logs](network-watcher-nsg-flow-logging-overview.md).

## Why use flow logs?

It's vital to monitor, manage, and know your network so that you can protect and optimize it. You may need to know the current state of the network, who's connecting, and where users are connecting from. You may also need to know which ports are open to the internet, what network behavior is expected, what network behavior is irregular, and when sudden rises in traffic happen.

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

Both VNet flow logs and [NSG flow logs](network-watcher-nsg-flow-logging-overview.md) record IP traffic but they differ in their behavior and capabilities. VNet flow logs simplify the scope of traffic monitoring by allowing you to enable logging at [virtual networks](../virtual-network/virtual-networks-overview.md), ensuring that traffic through all supported workloads within a virtual network is recorded. VNet flow logs also avoids the need to enable multi-level flow logging such as in cases of [NSG flow logs](network-watcher-nsg-flow-logging-overview.md#best-practices) where network security groups are configured at both subnet and network interface (NIC).

In addition to existing support to identify allowed/denied traffic by [network security group rules](../virtual-network/network-security-groups-overview.md), VNet flow logs support identification of traffic allowed/denied by [Azure Virtual Network Manager security admin rules](../virtual-network-manager/concept-security-admins.md). VNet flow logs also support evaluating the encryption status of your network traffic in scenarios where [virtual network encryption](../virtual-network/virtual-network-encryption-overview.md) is enabled.

## How logging works

Key properties of VNet flow logs include:

- Flow logs operate at Layer 4 of the Open Systems Interconnection (OSI) model and record all IP flows going through a virtual network.
- Logs are collected at 1-minute intervals through the Azure platform and don't affect your Azure resources or network traffic.
- Logs are written in the JSON (JavaScript Object Notation) format.
- Each log record contains the network interface (NIC) the flow applies to, 5-tuple information, traffic direction, flow state, encryption state and throughput information.
- All traffic flows in your network are evaluated through the rules in the applicable [network security group rules](../virtual-network/network-security-groups-overview.md) or [Azure Virtual Network Manager security admin rules](../virtual-network-manager/concept-security-admins.md). For more information, see [Log format](#log-format).

## Log format

VNet flow logs have the following properties:

- `time`: Time in UTC when the event was logged. 
- `flowLogVersion`: Version of flow log schema.
- `flowLogGUID`: The resource GUID of the FlowLog resource. 
- `macAddress`: MAC address of the network interface where the event was captured. 
- `category`: Category of the event. The category is always `FlowLogFlowEvent`. 
- `flowLogResourceID`: Resource ID of the FlowLog resource. 
- `targetResourceID`: Resource ID of target resource associated to the FlowLog resource. 
- `operationName`: Always `FlowLogFlowEvent`. 
- `flowRecords`: Collection of flow records.
	- `flows`: Collection of flows. This property has multiple entries for different ACLs. 
		- `aclID`: Identifier of the resource evaluating traffic, either a network security group or Virtual Network Manager. For cases like traffic denied by encryption, this value is `unspecified`.
		- `flowGroups`: Collection of flow records at a rule level. 
			- `rule`: Name of the rule that allowed or denied the traffic. For traffic denied due to encryption, this value is `unspecified`. 
			- `flowTuples`: string that contains multiple properties for the flow tuple in a comma-separated format:
				- `Time Stamp`: Time stamp of when the flow occurred in UNIX epoch format.
				- `Source IP`: Source IP address.
				- `Destination IP`: Destination IP address.
				- `Source port`: Source port.
				- `Destination port`: Destination Port.
				- `Protocol`: Layer 4 protocol of the flow expressed in IANA assigned values.
				- `Flow direction`: Direction of the traffic flow. Valid values are `I` for inbound and `O` for outbound. 
				- `Flow state`: State of the flow. Possible states are:
					- `B`: Begin, when a flow is created. No statistics are provided.
					- `C`: Continuing for an ongoing flow. Statistics are provided at 5-minute intervals.
					- `E`: End, when a flow is terminated. Statistics are provided.
					- `D`: Deny, when a flow is denied. 
				- `Flow encryption`: Encryption state of the flow. Possible values are:
					- `X`: Encrypted.
					- `NX`: Unencrypted.
					- `NX_HW_NOT_SUPPORTED`: Unsupported hardware.
					- `NX_SW_NOT_READY`: Software not ready.
					- `NX_NOT_ACCEPTED`: Drop due to no encryption.
					- `NX_NOT_SUPPORTED`: Discovery not supported.
					- `NX_LOCAL_DST`: Destination on same host.
					- `NX_FALLBACK`: Fall back to no encryption. 
				- `Packets sent`: Total number of packets sent from source to destination since the last update. 
				- `Bytes sent`: Total number of packet bytes sent from source to destination since the last update. Packet bytes include the packet header and payload. 
				- `Packets received`: Total number of packets sent from destination to source since the last update. 
				- `Bytes received`: Total number of packet bytes sent from destination to source since the last update. Packet bytes include packet header and payload. 

Traffic in your virtual networks is Unencrypted (NX) by default. For encrypted traffic, enable [virtual network encryption](../virtual-network/virtual-network-encryption-overview.md).

`Flow encryption` has the following possible encryption statuses:

| Encryption Status | Description |
| ----------------- | ----------- |
| `X` | **Connection is encrypted**. Encryption is configured and the platform has encrypted the connection. |
| `NX` | **Connection is Unencrypted**. This event is logged in two scenarios: <br> - When encryption isn't configured. <br> - When an encrypted virtual machine communicates with an endpoint that lacks encryption (such as an internet endpoint). |
| `NX_HW_NOT_SUPPORTED` | **Unsupported hardware**. Encryption is configured, but the virtual machine is running on a host that doesn't support encryption. This issue can usually be the case where the FPGA isn't attached to the host, or could be faulty. Report this issue to Microsoft for investigation. |
| `NX_SW_NOT_READY` | **Software not ready**. Encryption is configured, but the software component (GFT) in the host networking stack isn't ready to process encrypted connections. This issue can happen when the virtual machine is booting for the first time / restarting / redeployed. It can also happen in the case where there's an update to the networking components on the host where virtual machine is running. In all these scenarios, the packet gets dropped. The issue should be temporary and encryption should start working once either the virtual machine is fully up and running or the software update on the host is complete. If the issue is seen for longer durations, report it to Microsoft for investigation. |
| `NX_NOT_ACCEPTED` | **Drop due to no encryption**. Encryption is configured on both source and destination endpoints with drop on unencrypted policy. If there's a failure to encrypt traffic, packet is dropped. | 
| `NX_NOT_SUPPORTED` | **Discovery not supported**. Encryption is configured, but the encryption session wasn't established, as discovery isn't supported in the host networking stack. In this case, packet is dropped. If you encounter this issue, report it to Microsoft for investigation. |
| `NX_LOCAL_DST` | **Destination on same host**. Encryption is configured, but the source and destination virtual machines are running on the same Azure host. In this case, the connection isn't encrypted by design. |
| `NX_FALLBACK` | **Fall back to no encryption**. Encryption is configured with the allow unencrypted policy for both source and destination endpoints. Encryption was attempted, but ran into an issue. In this case, connection is allowed but it isn't encrypted. An example of this can be, the virtual machine initially landed on a node that supports encryption, but later, this support was disabled. |


## Sample log record

In the following example of VNet flow logs, multiple records that follow the property list described earlier.

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

:::image type="content" source="media/vnet-flow-logs-overview/vnet-flow-log-format.png" alt-text="Table showing the format of a virtual network flow log."lightbox="media/vnet-flow-logs-overview/vnet-flow-log-format.png"

Here's an example bandwidth calculation for flow tuples from a TCP conversation between **185.170.185.105:35370** and **10.2.0.4:23**:

`1493763938,185.170.185.105,10.2.0.4,35370,23,6,I,B,NX,,,,`
`1493695838,185.170.185.105,10.2.0.4,35370,23,6,I,C,NX,1021,588096,8005,4610880`
`1493696138,185.170.185.105,10.2.0.4,35370,23,6,I,E,NX,52,29952,47,27072`

For continuation (`C`) and end (`E`) flow states, byte and packet counts are aggregate counts from the time of the previous flow's tuple record. In the example conversation, the total number of packets transferred is 1021+52+8005+47 = 9125. The total number of bytes transferred is 588096+29952+4610880+27072 = 5256000.

## Considerations for VNet flow logs

### Storage account

- **Location**: The storage account used must be in the same region as the virtual network.
- **Performance tier**: Currently, only standard-tier storage accounts are supported.
- **Self-managed key rotation**: If you change or rotate the access keys to your storage account, VNet flow logs stop working. To fix this problem, you must disable and then re-enable VNet flow logs.

### Cost

VNet flow logging is billed on the volume of logs produced. High traffic volume can result in large-flow log volume and the associated costs.

Pricing of VNet flow logs doesn't include the underlying costs of storage. Using the retention policy feature with VNet flow logs means incurring separate storage costs for extended periods of time.

If you want to retain data forever and don't want to apply any retention policy, set retention days to 0. For more information, see [Network Watcher pricing](https://azure.microsoft.com/pricing/details/network-watcher/) and [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/).

## Pricing

VNet flow logs are not currently billed. In future, VNet flow logs will be charged per gigabyte of "Network Logs Collected" and come with a free tier of 5 GB/month per subscription. If traffic analytics is enabled with VNet flow logs, then existing traffic analytics pricing is applicable. For more information, see [Network Watcher pricing](https://azure.microsoft.com/pricing/details/network-watcher/).

## Availability

VNet flow logs is available in the following regions during the preview:

- East US 2 EUAP
- Central US EUAP
- West Central US
- East US
- East US 2
- West US
- West US 2

To sign up to obtain access to the public preview, see [VNet flow logs - public preview sign up](https://aka.ms/VNetflowlogspreviewsignup).

## Related content

- To learn how to manage VNet flow logs, see [Create, change, enable, disable, or delete VNet flow logs using Azure PowerShell](vnet-flow-logs-powershell.md) or [Create, change, enable, disable, or delete VNet flow logs using the Azure CLI](vnet-flow-logs-cli.md).
- To learn about traffic analytics, see [Traffic analytics](traffic-analytics.md) and [Traffic analytics schema](traffic-analytics-schema.md).
- To learn how to use Azure built-in policies to audit or enable traffic analytics, see [Manage traffic analytics using Azure Policy](traffic-analytics-policy-portal.md).

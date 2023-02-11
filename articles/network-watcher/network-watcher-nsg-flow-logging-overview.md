---
title: Introduction to flow logging for NSGs
titleSuffix: Azure Network Watcher
description: This article explains how to use the NSG flow logs feature of Azure Network Watcher.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 10/06/2022
ms.custom: engagement-fy23
ms.author: halkazwini
---

# Introduction to flow logging for network security groups

[Network security group](../virtual-network/network-security-groups-overview.md#security-rules) (NSG) flow logs are a feature of Azure Network Watcher that allows you to log information about IP traffic flowing through an NSG. Flow data is sent to Azure Storage accounts. From there, you can access the data and export it to any visualization tool, security information and event management (SIEM) solution, or intrusion detection system (IDS) of your choice.

![Screenshot that shows the main page for NSG flow logs in Network Watcher.](./media/network-watcher-nsg-flow-logging-overview/homepage.jpg)

This article shows you how to use, manage, and troubleshoot flow logs.

## Why use flow logs?

It's vital to monitor, manage, and know your own network so that you can protect and optimize it. You often need to know the current state of the network, who is connecting, and where users are connecting from. You also need to know which ports are open to the internet, what network behavior is expected, what network behavior is irregular, and when sudden rises in traffic happen.

Flow logs are the source of truth for all network activity in your cloud environment. Whether you're in a startup that's trying to optimize resources or a large enterprise that's trying to detect intrusion, flow logs can help. You can use them for optimizing network flows, monitoring throughput, verifying compliance, detecting intrusions, and more.

## Common use cases

**Network monitoring**: Identify unknown or undesired traffic. Monitor traffic levels and bandwidth consumption. Filter flow logs by IP and port to understand application behavior. Export flow logs to analytics and visualization tools of your choice to set up monitoring dashboards.

**Usage monitoring and optimization:** Identify top talkers in your network. Combine with GeoIP data to identify cross-region traffic. Understand traffic growth for capacity forecasting. Use data to remove overly restrictive traffic rules.

**Compliance**: Use flow data to verify network isolation and compliance with enterprise access rules.

**Network forensics and security analysis**: Analyze network flows from compromised IPs and network interfaces. Export flow logs to any SIEM or IDS tool of your choice.

## How logging works

Key properties of flow logs include:

- Flow logs operate at [Layer 4](https://en.wikipedia.org/wiki/OSI_model#Layer_4:_Transport_Layer) and record all IP flows going in and out of an NSG.
- Logs are collected at one-minute intervals through the Azure platform. They don't affect customer resources or network performance in any way.
- Logs are written in the JSON format and show outbound and inbound flows per NSG rule.
- Each log record contains the network interface (NIC) that the flow applies to, 5-tuple information, the traffic decision, and (for version 2 only) throughput information.
- Flow logs have a retention feature that allows automatically deleting the logs up to a year after their creation.

> [!NOTE]
> Retention is available only if you use [general-purpose v2 storage accounts](../storage/common/storage-account-overview.md#types-of-storage-accounts). 

Core concepts for flow logs include:

- Software-defined networks are organized around virtual networks and subnets. The security of these virtual networks and subnets can be managed using an NSG.
- An NSG contains a list of _security rules_ that allow or deny network traffic in resources that it's connected to. NSGs can be associated with each virtual network, subnet, and network interface in a virtual machine (VM). For more information, see [Network security group overview](../virtual-network/network-security-groups-overview.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).
- All traffic flows in your network are evaluated through the rules in the applicable NSG. The result of these evaluations is NSG flow logs. 
- Flow logs are collected through the Azure platform and don't require any change to customer resources.
- Rules are of two types: terminating and non-terminating. Each has different logging behaviors.
  - NSG *deny* rules are terminating. The NSG that's denying the traffic will log it in flow logs. Processing in this case would stop after any NSG denies traffic.
  - NSG *allow* rules are non-terminating. Even if one NSG allows it, processing will continue to the next NSG. The last NSG that allows traffic will log the traffic to flow logs.
- NSG flow logs are written to storage accounts. You can export, process, analyze, and visualize flow logs by using tools like Network Watcher traffic analytics, Splunk, Grafana, and Stealthwatch.

## Log format

Flow logs include the following properties:

* `time`: Time when the event was logged.
* `systemId`: System ID of the NSG.
* `category`: Category of the event. The category is always `NetworkSecurityGroupFlowEvent`.
* `resourceid`: Resource ID of the NSG.
* `operationName`: Always `NetworkSecurityGroupFlowEvents`.
* `properties`: Collection of properties of the flow.
    * `Version`: Version number of the flow log's event schema
    * `flows`: Collection of flows. This property has multiple entries for different rules.
        * `rule`: Rule for which the flows are listed.
            * `flows`: Collection of flows.
                * `mac`: MAC address of the NIC for the VM where the flow was collected.
                * `flowTuples`: String that contains multiple properties for the flow tuple, in comma-separated format.
                    * `Time Stamp`: Time stamp of when the flow occurred, in UNIX epoch format.
                    * `Source IP`: Source IP address.
                    * `Destination IP`: Destination IP addres.
                    * `Source Port`: Source port.
                    * `Destination Port`: Destination port.
                    * `Protocol`: Protocol of the flow. Valid values are `T` for TCP and `U` for UDP.
                    * `Traffic Flow`: Direction of the traffic flow. Valid values are `I` for inbound and `O` for outbound.
                    * `Traffic Decision`: Whether traffic was allowed or denied. Valid values are `A` for allowed and `D` for denied.
                    * `Flow State - Version 2 Only`: State of the flow. Possible states are: <br><br>`B`: Begin, when a flow is created. Statistics aren't provided. <br>`C`: Continuing for an ongoing flow. Statistics are provided at five-minute intervals. <br>`E`: End, when a flow is terminated. Statistics are provided.
                    * `Packets - Source to destination - Version 2 Only`: Total number of TCP packets sent from source to destination since the last update.
                    * `Bytes sent - Source to destination - Version 2 Only`: Total number of TCP packet bytes sent from source to destination since last update. Packet bytes include the packet header and payload.
                    * `Packets - Destination to source - Version 2 Only`: Total number of TCP packets sent from destination to source since the last update.
                    * `Bytes sent - Destination to source - Version 2 Only`: Total number of TCP packet bytes sent from destination to source since the last update. Packet bytes include packet header and payload.


Version 2 of NSG flow logs introduces the concept of flow state. You can configure which version of flow logs you receive.

Flow state `B` is recorded when a flow is initiated. Flow state `C` and flow state `E` are states that mark the continuation of a flow and flow termination, respectively. Both `C` and `E` states contain traffic bandwidth information.

### Sample log records

In the following examples of a flow log, multiple records follow the property list described earlier.

> [!NOTE]
> Values in the `flowTuples` property are a comma-separated list.

Here's an example of a version 1 NSG flow log format:

```json
{
    "records": [
        {
            "time": "2017-02-16T22:00:32.8950000Z",
            "systemId": "2c002c16-72f3-4dc5-b391-3444c3527434",
            "category": "NetworkSecurityGroupFlowEvent",
            "resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-000000000000/RESOURCEGROUPS/FABRIKAMRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/FABRIAKMVM1-NSG",
            "operationName": "NetworkSecurityGroupFlowEvents",
            "properties": {
                "Version": 1,
                "flows": [
                    {
                        "rule": "DefaultRule_DenyAllInBound",
                        "flows": [
                            {
                                "mac": "000D3AF8801A",
                                "flowTuples": [
                                    "1487282421,42.119.146.95,10.1.0.4,51529,5358,T,I,D"
                                ]
                            }
                        ]
                    },
                    {
                        "rule": "UserRule_default-allow-rdp",
                        "flows": [
                            {
                                "mac": "000D3AF8801A",
                                "flowTuples": [
                                    "1487282370,163.28.66.17,10.1.0.4,61771,3389,T,I,A",
                                    "1487282393,5.39.218.34,10.1.0.4,58596,3389,T,I,A",
                                    "1487282393,91.224.160.154,10.1.0.4,61540,3389,T,I,A",
                                    "1487282423,13.76.89.229,10.1.0.4,53163,3389,T,I,A"
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        {
            "time": "2017-02-16T22:01:32.8960000Z",
            "systemId": "2c002c16-72f3-4dc5-b391-3444c3527434",
            "category": "NetworkSecurityGroupFlowEvent",
            "resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-000000000000/RESOURCEGROUPS/FABRIKAMRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/FABRIAKMVM1-NSG",
            "operationName": "NetworkSecurityGroupFlowEvents",
            "properties": {
                "Version": 1,
                "flows": [
                    {
                        "rule": "DefaultRule_DenyAllInBound",
                        "flows": [
                            {
                                "mac": "000D3AF8801A",
                                "flowTuples": [
                                    "1487282481,195.78.210.194,10.1.0.4,53,1732,U,I,D"
                                ]
                            }
                        ]
                    },
                    {
                        "rule": "UserRule_default-allow-rdp",
                        "flows": [
                            {
                                "mac": "000D3AF8801A",
                                "flowTuples": [
                                    "1487282435,61.129.251.68,10.1.0.4,57776,3389,T,I,A",
                                    "1487282454,84.25.174.170,10.1.0.4,59085,3389,T,I,A",
                                    "1487282477,77.68.9.50,10.1.0.4,65078,3389,T,I,A"
                                ]
                            }
                        ]
                    }
                ]
            }
        },
    "records":
    [
        
        {
             "time": "2017-02-16T22:00:32.8950000Z",
             "systemId": "2c002c16-72f3-4dc5-b391-3444c3527434",
             "category": "NetworkSecurityGroupFlowEvent",
             "resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-000000000000/RESOURCEGROUPS/FABRIKAMRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/FABRIAKMVM1-NSG",
             "operationName": "NetworkSecurityGroupFlowEvents",
             "properties": {"Version":1,"flows":[{"rule":"DefaultRule_DenyAllInBound","flows":[{"mac":"000D3AF8801A","flowTuples":["1487282421,42.119.146.95,10.1.0.4,51529,5358,T,I,D"]}]},{"rule":"UserRule_default-allow-rdp","flows":[{"mac":"000D3AF8801A","flowTuples":["1487282370,163.28.66.17,10.1.0.4,61771,3389,T,I,A","1487282393,5.39.218.34,10.1.0.4,58596,3389,T,I,A","1487282393,91.224.160.154,10.1.0.4,61540,3389,T,I,A","1487282423,13.76.89.229,10.1.0.4,53163,3389,T,I,A"]}]}]}
        }
        ,
        {
             "time": "2017-02-16T22:01:32.8960000Z",
             "systemId": "2c002c16-72f3-4dc5-b391-3444c3527434",
             "category": "NetworkSecurityGroupFlowEvent",
             "resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-000000000000/RESOURCEGROUPS/FABRIKAMRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/FABRIAKMVM1-NSG",
             "operationName": "NetworkSecurityGroupFlowEvents",
             "properties": {"Version":1,"flows":[{"rule":"DefaultRule_DenyAllInBound","flows":[{"mac":"000D3AF8801A","flowTuples":["1487282481,195.78.210.194,10.1.0.4,53,1732,U,I,D"]}]},{"rule":"UserRule_default-allow-rdp","flows":[{"mac":"000D3AF8801A","flowTuples":["1487282435,61.129.251.68,10.1.0.4,57776,3389,T,I,A","1487282454,84.25.174.170,10.1.0.4,59085,3389,T,I,A","1487282477,77.68.9.50,10.1.0.4,65078,3389,T,I,A"]}]}]}
        }
        ,
        {
             "time": "2017-02-16T22:02:32.9040000Z",
             "systemId": "2c002c16-72f3-4dc5-b391-3444c3527434",
             "category": "NetworkSecurityGroupFlowEvent",
             "resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-000000000000/RESOURCEGROUPS/FABRIKAMRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/FABRIAKMVM1-NSG",
             "operationName": "NetworkSecurityGroupFlowEvents",
             "properties": {"Version":1,"flows":[{"rule":"DefaultRule_DenyAllInBound","flows":[{"mac":"000D3AF8801A","flowTuples":["1487282492,175.182.69.29,10.1.0.4,28918,5358,T,I,D","1487282505,71.6.216.55,10.1.0.4,8080,8080,T,I,D"]}]},{"rule":"UserRule_default-allow-rdp","flows":[{"mac":"000D3AF8801A","flowTuples":["1487282512,91.224.160.154,10.1.0.4,59046,3389,T,I,A"]}]}]}
        }
        
        
```

Here's an example of a version 2 NSG flow log format:

```json
 {
    "records": [
        {
            "time": "2018-11-13T12:00:35.3899262Z",
            "systemId": "a0fca5ce-022c-47b1-9735-89943b42f2fa",
            "category": "NetworkSecurityGroupFlowEvent",
            "resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-000000000000/RESOURCEGROUPS/FABRIKAMRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/FABRIAKMVM1-NSG",
            "operationName": "NetworkSecurityGroupFlowEvents",
            "properties": {
                "Version": 2,
                "flows": [
                    {
                        "rule": "DefaultRule_DenyAllInBound",
                        "flows": [
                            {
                                "mac": "000D3AF87856",
                                "flowTuples": [
                                    "1542110402,94.102.49.190,10.5.16.4,28746,443,U,I,D,B,,,,",
                                    "1542110424,176.119.4.10,10.5.16.4,56509,59336,T,I,D,B,,,,",
                                    "1542110432,167.99.86.8,10.5.16.4,48495,8088,T,I,D,B,,,,"
                                ]
                            }
                        ]
                    },
                    {
                        "rule": "DefaultRule_AllowInternetOutBound",
                        "flows": [
                            {
                                "mac": "000D3AF87856",
                                "flowTuples": [
                                    "1542110377,10.5.16.4,13.67.143.118,59831,443,T,O,A,B,,,,",
                                    "1542110379,10.5.16.4,13.67.143.117,59932,443,T,O,A,E,1,66,1,66",
                                    "1542110379,10.5.16.4,13.67.143.115,44931,443,T,O,A,C,30,16978,24,14008",
                                    "1542110406,10.5.16.4,40.71.12.225,59929,443,T,O,A,E,15,8489,12,7054"
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        {
            "time": "2018-11-13T12:01:35.3918317Z",
            "systemId": "a0fca5ce-022c-47b1-9735-89943b42f2fa",
            "category": "NetworkSecurityGroupFlowEvent",
            "resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-000000000000/RESOURCEGROUPS/FABRIKAMRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/FABRIAKMVM1-NSG",
            "operationName": "NetworkSecurityGroupFlowEvents",
            "properties": {
                "Version": 2,
                "flows": [
                    {
                        "rule": "DefaultRule_DenyAllInBound",
                        "flows": [
                            {
                                "mac": "000D3AF87856",
                                "flowTuples": [
                                    "1542110437,125.64.94.197,10.5.16.4,59752,18264,T,I,D,B,,,,",
                                    "1542110475,80.211.72.221,10.5.16.4,37433,8088,T,I,D,B,,,,",
                                    "1542110487,46.101.199.124,10.5.16.4,60577,8088,T,I,D,B,,,,",
                                    "1542110490,176.119.4.30,10.5.16.4,57067,52801,T,I,D,B,,,,"
                                ]
                            }
                        ]
                    }
                ]
            }
        }
        
```

### Log tuple and bandwidth calculation

![Screenshot that shows an example of a flow log tuple.](./media/network-watcher-nsg-flow-logging-overview/tuple.png)

Here's an example bandwidth calculation for flow tuples from a TCP conversation between 185.170.185.105:35370 and 10.2.0.4:23:

`1493763938,185.170.185.105,10.2.0.4,35370,23,T,I,A,B,,,,`
`1493695838,185.170.185.105,10.2.0.4,35370,23,T,I,A,C,1021,588096,8005,4610880`
`1493696138,185.170.185.105,10.2.0.4,35370,23,T,I,A,E,52,29952,47,27072`

For continuation (`C`) and end (`E`) flow states, byte and packet counts are aggregate counts from the time of the previous flow tuple record. In the example conversation, the total number of packets transferred is 1021+52+8005+47 = 9125. The total number of bytes transferred is 588096+29952+4610880+27072 = 5256000.

## Enabling NSG flow logs

For more information about enabling flow logs, see the following guides:

- [Azure portal](./network-watcher-nsg-flow-logging-portal.md)
- [PowerShell](./network-watcher-nsg-flow-logging-powershell.md)
- [CLI](./network-watcher-nsg-flow-logging-cli.md)
- [REST](./network-watcher-nsg-flow-logging-rest.md)
- [Azure Resource Manager](./network-watcher-nsg-flow-logging-azure-resource-manager.md)

## Updating parameters

On the Azure portal:

1. Go to the **NSG flow logs** section in Network Watcher. 
1. Select the name of the NSG. 
1. On the settings pane for the flow log, change the parameters that you want. 
1. Select **Save** to deploy the changes.

To update parameters via command-line tools, use the same command that you used to enable flow logs.

## Working with flow logs

### Read and export flow logs

- [Download and view flow logs from the portal](./network-watcher-nsg-flow-logging-portal.md#download-flow-log)
- [Read flow logs by using PowerShell functions](./network-watcher-read-nsg-flow-logs.md)
- [Export NSG flow logs to Splunk](https://www.splunk.com/en_us/blog/platform/splunking-azure-nsg-flow-logs.html)

Although flow logs target NSGs, they're not displayed the same way as the other logs. Flow logs are stored only within a storage account and follow the logging path shown in the following example:

```
https://{storageAccountName}.blob.core.windows.net/insights-logs-networksecuritygroupflowevent/resourceId=/SUBSCRIPTIONS/{subscriptionID}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/{nsgName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json
```

### Visualize flow logs

- [Visualize NSG flow logs by using Azure Network Watcher traffic analytics](./traffic-analytics.md)
- [Visualize NSG flow logs by using Power BI](./network-watcher-visualize-nsg-flow-logs-power-bi.md)
- [Visualize NSG flow logs by using Elastic Stack](./network-watcher-visualize-nsg-flow-logs-open-source-tools.md)
- [Manage and analyze NSG flow logs by using Grafana](./network-watcher-nsg-grafana.md)
- [Manage and analyze NSG flow logs by using Graylog](./network-watcher-analyze-nsg-flow-logs-graylog.md)

### Disable flow logs

When you disable a flow log, you stop the flow logging for the associated NSG. But the flow log continues to exist as a resource, with all its settings and associations. You can enable it anytime to begin flow logging on the configured NSG.

For steps to disable and enable a flow logs, see [this how-to guide](./network-watcher-nsg-flow-logging-powershell.md).  

### Delete flow logs

When you delete a flow log, you not only stop the flow logging for the associated NSG but also delete the flow log resource (with all its settings and associations). To begin flow logging again, you must create a new flow log resource for that NSG. 

You can delete a flow log by using [PowerShell](/powershell/module/az.network/remove-aznetworkwatcherflowlog), the [Azure CLI](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-delete) or the [REST API](/rest/api/network-watcher/flowlogs/delete). At this time, you can't delete flow logs from the Azure portal.

Also, when you delete an NSG is deleted, the associated flow log resource is deleted by default.

> [!NOTE]
> To move an NSG to a different resource group or subscription, you must delete the associated flow logs. Just disabling the flow logs won't work. After you migrate an NSG, you must re-create the flow logs to enable flow logging on it.  

## Considerations for NSG flow logging

### Storage account considerations

- Location: The storage account used must be in the same region as the NSG.
- Performance Tier: Currently, only standard tier storage accounts are supported.
- Self-manage key rotation: If you change/rotate the access keys to your storage account, NSG flow logs will stop working. To fix this issue, you must disable and then re-enable NSG flow logs.

### Flow logging costs

NSG flow logging is billed on the volume of logs produced. High traffic volume can result in large flow log volume and the associated costs. 

NSG Flow log pricing does not include the underlying costs of storage. Using the retention policy feature with NSG Flow Logging means incurring separate storage costs for extended periods of time. 

If you want to retain data forever and do not want to apply any retention policy, set retention (days) to 0. For more information, see [Network Watcher Pricing](https://azure.microsoft.com/pricing/details/network-watcher/) and [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) for additional details.

### Issues with user-defined inbound TCP rules

[Network Security Groups (NSGs)](../virtual-network/network-security-groups-overview.md) are implemented as a [Stateful firewall](https://en.wikipedia.org/wiki/Stateful_firewall?oldformat=true). However, due to current platform limitations, user-defined rules that affect inbound TCP flows are implemented in a stateless fashion. 

Due to this, flows affected by user-defined inbound rules become non-terminating. Additionally byte and packet counts are not recorded for these flows. Consequently the number of bytes and packets reported in NSG flow logs (and Network Watcher traffic analytics) could be different from actual numbers.

This can be resolved by setting the [FlowTimeoutInMinutes](/powershell/module/az.network/set-azvirtualnetwork) property on the associated virtual networks to a non-null value. Default stateful behavior can be achieved by setting FlowTimeoutInMinutes to 4 minutes. For long running connections, where you do not want flows disconnecting from a service or destination, FlowTimeoutInMinutes can be set to a value upto 30 minutes.

```powershell
$virtualNetwork = Get-AzVirtualNetwork -Name VnetName -ResourceGroupName RgName
$virtualNetwork.FlowTimeoutInMinutes = 4
$virtualNetwork |  Set-AzVirtualNetwork
```

### Inbound flows logged from internet IPs to VMs without public IPs

VMs that don't have a public IP address assigned via a public IP address associated with the NIC as an instance-level public IP, or that are part of a basic load balancer back-end pool, use [default SNAT](../load-balancer/load-balancer-outbound-connections.md) and have an IP address assigned by Azure to facilitate outbound connectivity. As a result, you might see flow log entries for flows from internet IP addresses, if the flow is destined to a port in the range of ports assigned for SNAT. 

While Azure won't allow these flows to the VM, the attempt is logged and appears in Network Watcher's NSG flow log by design. We recommend that unwanted inbound internet traffic be explicitly blocked with NSG.

### NSG on ExpressRoute gateway subnet

It is not recommended to log flows on ExpressRoute gateway subnet because traffic can bypass the express route gateway (example: [FastPath](../expressroute/about-fastpath.md)). Thus, if an NSG is linked to an ExpressRoute Gateway subnet and NSG flow logs are enabled, then outbound flows to virtual machines may not get captured. Such flows must be captured at the subnet or NIC of the VM.

### Traffic across private link

To log traffic while accessing PaaS resources via private link, enable NSG flow logs on a subnet NSG containing the private link. Due to platform limitations, the traffic at all the source VMs only can be captured whereas that at the destination PaaS resource cannot be captured.

### Issue with Application Gateway V2 Subnet NSG

Flow logging on the application gateway V2 subnet NSG is [not supported](../application-gateway/application-gateway-faq.yml#are-nsg-flow-logs-supported-on-nsgs-associated-to-application-gateway-v2-subnet) currently. This issue does not affect Application Gateway V1.

### Incompatible services

Due to current platform limitations, a small set of Azure services are not supported by NSG flow logs. The current list of incompatible services is:

- [Azure Container Instances (ACI)](https://azure.microsoft.com/services/container-instances/)
- [Logic Apps](https://azure.microsoft.com/services/logic-apps/) 
- [Azure Functions](https://azure.microsoft.com/services/functions/)

> [!NOTE]
> App services deployed under the App Service Plan do not support NSG flow logs. [Learn more](../app-service/overview-vnet-integration.md#how-regional-virtual-network-integration-works).

## Best practices

- **Enable on critical subnets**: Flow logs should be enabled on all critical subnets in your subscription as an auditability and security best practice.

- **Enable NSG Flow Logging on all NSGs attached to a resource**: Flow logging in Azure is configured on the NSG resource. A flow will only be associated to one NSG Rule. In scenarios where multiple NSGs are utilized, we recommend enabling NSG flow logs on all NSGs applied at the resource's subnet or network interface to ensure that all traffic is recorded. For more information, see [how traffic is evaluated](../virtual-network/network-security-group-how-it-works.md) in Network Security Groups. 

  Here are a few common scenarios:

  - **Multiple NICs at a VM**: In case multiple NICs are attached to a virtual machine, flow logging must be enabled on all of them
  - **Having NSG at both NIC and Subnet Level**: In case NSG is configured at the NIC as well as the subnet level, then flow logging must be enabled at both the NSGs since the exact sequence of rule processing by NSGs at NIC and subnet level is platform dependent and varies from case to case. Traffic flows will be logged against the NSG which is processed last. The processing order is changed by the platform state. You have to check both of the flow logs.
  - **AKS Cluster Subnet**: AKS adds a default NSG at the cluster subnet. As explained in the above point, flow logging must be enabled on this default NSG.

- **Storage provisioning**: Storage should be provisioned in tune with expected Flow Log volume.

- **Naming**: The NSG name must be upto 80 chars and the NSG rule names upto 65 chars. If the names exceed their character limit, it may get truncated while logging.

## Troubleshooting common issues

### I could not enable NSG flow logs

If you received an _AuthorizationFailed_ or a _GatewayAuthenticationFailed_ error, you might have not enabled the **Microsoft.Insights** resource provider on your subscription. [Follow the instructions](./network-watcher-nsg-flow-logging-portal.md#register-insights-provider) to enable the **Microsoft.Insights** provider.

### I have enabled NSG flow logs but do not see data in my storage account

This problem might be related to:

- **Setup time**

  NSG flow logs may take up to 5 minutes to appear in your storage account (if configured correctly). A PT1H.json will appear which can be accessed [as described here](./network-watcher-nsg-flow-logging-portal.md#download-flow-log).

- **No Traffic on your NSGs**

  Sometimes you will not see logs because your VMs are not active or there are upstream filters at an App Gateway or other devices that are blocking traffic to your NSGs.

### I want to automate NSG flow logs

Support for automation via ARM templates is now available for NSG flow logs. Read the [feature announcement](https://azure.microsoft.com/updates/arm-template-support-for-nsg-flow-logs/) & the [Quick Start from ARM template document](quickstart-configure-network-security-group-flow-logs-from-arm-template.md) for more information.

## FAQ

### What does NSG flow logs do?

Azure network resources can be combined and managed through [Network Security Groups (NSGs)](../virtual-network/network-security-groups-overview.md). NSG flow logs enable you to log 5-tuple flow information about all traffic through your NSGs. The raw flow logs are written to an Azure Storage account from where they can be further processed, analyzed, queried, or exported as needed.

### Does using flow logs impact my network latency or performance?

Flow logs data is collected outside of the path of your network traffic, and therefore does not affect network throughput or latency. You can create or delete flow logs without any risk of impact to network performance.

### How do I use NSG flow logs with a Storage account behind a firewall?

To use a Storage account behind a firewall, you have to provide an exception for Trusted Microsoft Services to access your storage account:

- Navigate to the Storage account by typing the Storage account's name in global search on the portal or from the [Storage accounts page](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts)
- Under the **Networking** section, select **Firewalls and virtual networks** at top of page.
- Under the **Public network access**, select:
  ☑️ **Enabled from selected virtual networks and IP addresses**
- Under **Firewall** select:
  ☑️ **Add your Client IP Address**

   > [!Note]
   > A client IP Address is provided here by default, verify this IP matches the machine you are using to access Storage Account using `ipconfig`. If the Client IP Address does not match your machine, you may receive Unauthorized when attempting to access the storage account to read NSG flow logs.

- Under  **Exceptions**, select:
  ☑️ **Allow Azure service on the trusted services list to access this storage account.**
- If the above items are already configured, no change is needed.
- Locate your target NSG on the [NSG flow logs overview page](https://portal.azure.com/#blade/Microsoft_Azure_Network/NetworkWatcherMenuBlade/flowLogs) and enable NSG flow logs using the above configured storage account.

You can check the storage logs after a few minutes, you should see an updated TimeStamp or a new JSON file created.

### How do I use NSG flow logs with a Storage account behind a Service Endpoint?

NSG flow logs are compatible with Service Endpoints without requiring any extra configuration. See the [tutorial on enabling Service Endpoints](../virtual-network/tutorial-restrict-network-access-to-resources.md#enable-a-service-endpoint) in your virtual network.

### What is the difference between flow logs versions 1 & 2?

Flow logs version 2 introduces the concept of _Flow State_ & stores information about bytes and packets transmitted. [Read more](#log-format).

## Pricing

NSG flow logs are charged per GB of logs collected and come with a free tier of 5 GB/month per subscription. For the current pricing in your region, see the [Network Watcher pricing page](https://azure.microsoft.com/pricing/details/network-watcher/).

Storage of logs is charged separately, see [Azure Storage Block blob pricing page](https://azure.microsoft.com/pricing/details/storage/blobs/) for relevant prices.

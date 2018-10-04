---
title: Introduction to flow logging for network security groups with Azure Network Watcher | Microsoft Docs
description: This article explains how to use the NSG flow logs feature of Azure Network Watcher.
services: network-watcher
documentationcenter: na
author: jimdial
manager: timlt
editor: 

ms.assetid: 47d91341-16f1-45ac-85a5-e5a640f5d59e
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: jdial

---

# Introduction to flow logging for network security groups

Network security group (NSG) flow logs are a feature of Network Watcher that allows you to view information about ingress and egress IP traffic through an NSG. Flow logs are written in json format, and show outbound and inbound flows on a per rule basis, the network interface (NIC) the flow applies to, 5-tuple information about the flow (Source/destination IP, source/destination port, and protocol), and if the traffic was allowed or denied.

![flow logs overview](./media/network-watcher-nsg-flow-logging-overview/figure1.png)

While flow logs target NSGs, they are not displayed the same as the other logs. Flow logs are stored only within a storage account and follow the logging path shown in the following example:

```
https://{storageAccountName}.blob.core.windows.net/insights-logs-networksecuritygroupflowevent/resourceId=/SUBSCRIPTIONS/{subscriptionID}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/{nsgName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json
```

The same retention policies seen for other logs apply to flow logs. You can set log retention policy from 1 day to 2147483647 days. If a retention policy is not set, the logs are maintained forever.

## Log file

Flow logs include the following properties:

* **time** - Time when the event was logged
* **systemId** - Network Security Group resource Id.
* **category** - The category of the event. The category is always **NetworkSecurityGroupFlowEvent**
* **resourceid** - The resource Id of the NSG
* **operationName** - Always NetworkSecurityGroupFlowEvents
* **properties** - A collection of properties of the flow
	* **Version** - Version number of the Flow Log event schema
	* **flows** - A collection of flows. This property has multiple entries for different rules
		* **rule** - Rule for which the flows are listed
			* **flows** - a collection of flows
				* **mac** - The MAC address of the NIC for the VM where the flow was collected
				* **flowTuples** - A string that contains multiple properties for the flow tuple in comma-separated format
					* **Time Stamp** - This value is the time stamp of when the flow occurred in UNIX EPOCH format
					* **Source IP** - The source IP
					* **Destination IP** - The destination IP
					* **Source Port** - The source port
					* **Destination Port** - The destination Port
					* **Protocol** - The protocol of the flow. Valid values are **T** for TCP and **U** for UDP
					* **Traffic Flow** - The direction of the traffic flow. Valid values are **I** for inbound and **O** for outbound.
					* **Traffic** - Whether traffic was allowed or denied. Valid values are **A** for allowed and **D** for denied.

The text that follows is an example of a flow log. As you can see, there are multiple records that follow the property list described in the preceding section.

> [!NOTE]
> Values in the **flowTuples* property are a comma-separated list.
 
```json
{
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
		,
		...
```

## Next steps

- To learn how to enable flow logs, see [Enabling NSG flow logging](network-watcher-nsg-flow-logging-portal.md).
- To learn more about NSG logging, see [Log analytics for network security groups (NSGs)](../virtual-network/virtual-network-nsg-manage-log.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json).
- To determine whether traffic is allowed or denied to or from a VM, see [Diagnose a VM network traffic filter problem](diagnose-vm-network-traffic-filtering-problem.md)

---
title: Introduction to flow logging for Network Security Groups with Azure Network Watcher | Microsoft Docs
description: This page explains how to use NSG flow logs a feature of Azure Network Watcher
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: 47d91341-16f1-45ac-85a5-e5a640f5d59e
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace

---

# Introduction to flow logging for Network Security Groups

Network Security Group flow logs are a feature of Network Watcher that allows you to view information about ingress and egress IP traffic through a Network Security Group. These json flow logs show outbound and inbound flows on a per rule basis, the NIC the flow applies to, 5-tuple information about the flow (Source/Destination IP, Source/Destination Port, Protocol), and if the traffic was allowed or denied.

## Configuring NSG Flow logs in the portal

![flow logs overview][1]

## Configuring NSG Flow logs with powershell

The command to enable flow logs is shown in the following example:

```powershell
$NW = Get-AzurermNetworkWatcher -ResourceGroupName NetworkWatcherRg -Name NetworkWatcher_westcentralus
$nsg = Get-AzureRmNetworkSecurityGroup -ResourceGroupName nsgRG-Name nsgName
$storageAccount = Get-AzureRmStorageAccount -ResourceGroupName StorageRG -Name contosostorage123
Get-AzureRmNetworkWatcherFlowLogStatus -NetworkWatcher $NW -TargetResourceId $nsg.Id
Set-AzureRmNetworkWatcherConfigFlowLog -NetworkWatcher $NW -TargetResourceId $nsg.Id -StorageAccountId $storageAccount.Id -EnableFlowLog $true
```

Use the following example to disable flow logs:

```powershell
Set-AzureRmNetworkWatcherConfigFlowLog -NetworkWatcher $NW -TargetResourceId $nsg.Id -StorageAccountId $storageAccount.Id -EnableFlowLog $false
```

The following list is a listing of the properties that are returned within the NSG flow log:

* **time** - Time when the event was logged
* **systemId** - Network Security Group resource ID.
* **category** - The category of the event, this is always be NetworkSecurityGroupFlowEvent
* **resourceid** - The resource id of the NSG
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


The following snippet is an example of the results in the NSG flow event log.

```json
"records": 
	[
		{
			 "time": "2017-01-11T19:00:12.1870000Z",
			 "systemId": "d953ebda-5e51-4b58-ab66-5268eecbc597",
			 "category": "NetworkSecurityGroupFlowEvent",
			 "resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-000000000000/RESOURCEGROUPS/FABRIKAMEXAMPLERG/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/FABRIKAMVM1-NSG",
			 "operationName": "NetworkSecurityGroupFlowEvents",
			 "properties": {"Version":1,"flows":[{"rule":"DefaultRule_AllowInternetOutBound","flows":[]},{"rule":"DefaultRule_AllowVnetOutBound","flows":[]},{"rule":"DefaultRule_DenyAllInBound","flows":[{"mac":"000D3AF845D6","flowTuples":["1484161205,167.220.1.58,10.1.0.4,1011,500,U,I,D","1484161205,167.220.1.58,10.1.0.4,1011,500,U,I,D","1484161206,167.220.1.58,10.1.0.4,1011,500,U,I,D","1484161206,167.220.1.58,10.1.0.4,1011,500,U,I,D","1484161207,167.220.1.58,10.1.0.4,1011,500,U,I,D","1484161207,167.220.1.58,10.1.0.4,1011,500,U,I,D"]}]},{"rule":"UserRule_default-allow-rdp","flows":[]}]}
		}
		,
		{
			 "time": "2017-01-11T19:01:12.1880000Z",
			 "systemId": "d953ebda-5e51-4b58-ab66-5268eecbc597",
			 "category": "NetworkSecurityGroupFlowEvent",
			 "resourceId": "/SUBSCRIPTIONS/00000000-0000-0000-0000-000000000000/RESOURCEGROUPS/FABRIKAMEXAMPLERG/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/FABRIKAMVM1-NSG",
			 "operationName": "NetworkSecurityGroupFlowEvents",
			 "properties": {"Version":1,"flows":[{"rule":"DefaultRule_AllowInternetOutBound","flows":[]},{"rule":"DefaultRule_AllowVnetOutBound","flows":[]},{"rule":"DefaultRule_DenyAllInBound","flows":[{"mac":"000D3AF845D6","flowTuples":["1484161210,167.220.1.58,10.1.0.4,1011,500,U,I,D","1484161210,167.220.1.58,10.1.0.4,1011,500,U,I,D","1484161247,14.188.227.186,10.1.0.4,58643,23,T,I,D","1484161263,167.220.1.58,10.1.0.4,38182,80,T,I,D","1484161266,167.220.1.58,10.1.0.4,38182,80,T,I,D","1484161266,167.220.1.58,10.1.0.4,1011,500,U,I,D","1484161266,167.220.1.58,10.1.0.4,1011,500,U,I,D","1484161267,167.220.1.58,10.1.0.4,1011,500,U,I,D","1484161267,167.220.1.58,10.1.0.4,1011,500,U,I,D","1484161268,167.220.1.58,10.1.0.4,1011,500,U,I,D","1484161268,167.220.1.58,10.1.0.4,1011,500,U,I,D"]}]},{"rule":"UserRule_default-allow-rdp","flows":[]}]}
		},
```

## Next steps

Learn to audit your NSG settings by visiting [Auditing Network Security Groups (NSG) with Network Watcher](network-watcher-nsg-auditing-powershell.md).

Learn about NSG logging by visiting [Log analytics for network security groups (NSGs)](../virtual-network/virtual-network-nsg-manage-log.md).

Find out if traffic is allowed or denied on a VM by visiting [Verify traffic with IP flow verify](network-watcher-check-ip-flow-verify-portal.md)

<!-- Image references -->
[1]: ./media/network-watcher-nsg-flow-logging-overview/figure1.png


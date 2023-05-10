---
title: NSG diagnostics
titleSuffix: Azure Network Watcher
description: Learn about NSG diagnostics tool in Azure Network Watcher.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.author: halkazwini
ms.reviewer: shijaiswal
ms.topic: conceptual
ms.date: 04/24/2023
ms.custom: template-concept, engagement-fy23
---

# Azure Network Watcher NSG diagnostics

The NSG diagnostics is an Azure Network Watcher tool that helps you understand which network traffic is allowed or denied in your Azure virtual network along with detailed information for debugging. NSG diagnostics can help you verify that your network security group rules are set up properly. 

> [!NOTE]
> To use NSG diagnostics, Network Watcher must be enabled in your subscription. For more information, see [Network Watcher is automatically enabled](./network-watcher-create.md#network-watcher-is-automatically-enabled).

## Background

- Your resources in Azure are connected via [virtual networks (VNets)](../virtual-network/virtual-networks-overview.md) and subnets. The security of these virtual networks and subnets can be managed using [network security groups](../virtual-network/network-security-groups-overview.md).
- A network security group contains a list of [security rules](../virtual-network/network-security-groups-overview.md#security-rules) that allow or deny network traffic to resources it's connected to. A network security group can be associated to a virtual network subnet or individual network interface (NIC) attached to a virtual machine (VM). 
- All traffic flows in your network are evaluated using the rules in the applicable network security group.
- Rules are evaluated based on priority number from lowest to highest.

## How does NSG diagnostics work? 

The NSG diagnostics tool can simulate a given flow based on the source and destination you provide. It returns whether the flow is allowed or denied with detailed information about the security rule allowing or denying the flow.

## Next steps

Run NSG diagnostics using [PowerShell](/powershell/module/az.network/invoke-aznetworkwatchernetworkconfigurationdiagnostic), [Azure CLI](/cli/azure/network/watcher#az-network-watcher-run-configuration-diagnostic), or [REST API](/rest/api/network-watcher/networkwatchers/getnetworkconfigurationdiagnostic).
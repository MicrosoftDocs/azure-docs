---
title: Introduction to NSG Diagnostics in Azure Network Watcher
description: Learn about Network Security Group (NSG) Diagnostics tool in Azure Network Watcher
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.author: halkazwini
ms.reviewer: shijaiswal
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 01/20/2023
ms.custom: template-concept, engagement-fy23
---

# Introduction to NSG Diagnostics in Azure Network Watcher

The Network Security Group (NSG) Diagnostics is an Azure Network Watcher tool that helps you understand which network traffic is allowed or denied in your Azure Virtual Network along with detailed information for debugging. It can help you in understanding if your NSG rules are configured correctly. 

> [!NOTE]
> To use NSG Diagnostics, Network Watcher must be enabled in your subscription. See [Create an Azure Network Watcher instance](./network-watcher-create.md) to enable.

## Background

- Your resources in Azure are connected via [virtual networks (VNets)](../virtual-network/virtual-networks-overview.md) and subnets. The security of these VNets and subnets can be managed using [network security groups (NSGs)](../virtual-network/network-security-groups-overview.md).
- An NSG contains a list of [security rules](../virtual-network/network-security-groups-overview.md#security-rules) that allow or deny network traffic to resources it's connected to. An NSG can be associated to a virtual network subnet or individual network interface (NIC) attached to a virtual machine (VM). 
- All traffic flows in your network are evaluated using the rules in the applicable NSG.
- Rules are evaluated based on priority number from lowest to highest.

## How does NSG Diagnostics work? 

For a given flow, after you provide details like source and destination, the NSG Diagnostics tool runs a simulation of the flow and returns whether the flow would be allowed or denied with detailed information about the security rule allowing or denying the flow.

## Next steps

Use NSG Diagnostics using [REST API](/rest/api/network-watcher/networkwatchers/getnetworkconfigurationdiagnostic), [PowerShell](/powershell/module/az.network/invoke-aznetworkwatchernetworkconfigurationdiagnostic), and [Azure CLI](/cli/azure/network/watcher#az-network-watcher-run-configuration-diagnostic).
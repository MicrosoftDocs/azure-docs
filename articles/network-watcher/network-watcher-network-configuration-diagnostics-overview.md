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
ms.date: 06/27/2023
ms.custom: template-concept, engagement-fy23
---

# NSG diagnostics overview

The NSG diagnostics is an Azure Network Watcher tool that helps you understand which network traffic is allowed or denied in your Azure virtual network along with detailed information for debugging. NSG diagnostics can help you verify that your network security group rules are set up properly. 

## Background

- Your resources in Azure are connected via [virtual networks](../virtual-network/virtual-networks-overview.md) and subnets. The security of these virtual networks and subnets can be managed using [network security groups](../virtual-network/network-security-groups-overview.md).
- A network security group contains a list of [security rules](../virtual-network/network-security-groups-overview.md#security-rules) that allow or deny network traffic to resources it's connected to. A network security group can be associated to a virtual network subnet or individual network interface (NIC) attached to a virtual machine (VM). 
- All traffic flows in your network are evaluated using the rules in the applicable network security group.
- Rules are evaluated based on priority number from lowest to highest.

## How does NSG diagnostics work? 

The NSG diagnostics tool can simulate a given flow based on the source and destination you provide. It returns whether the flow is allowed or denied with detailed information about the security rule allowing or denying the flow.

## Next steps

To learn how to use the NSG diagnostics tool to check if your network traffic is allowed or denied, see [Diagnose network security rules](diagnose-network-security-rules.md).
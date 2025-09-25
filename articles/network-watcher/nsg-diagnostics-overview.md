---
title: NSG diagnostics overview
titleSuffix: Azure Network Watcher
description: Learn about NSG diagnostics tool in Azure Network Watcher how it can help you troubleshoot traffic issues.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: concept-article
ms.date: 03/04/2025
# Customer intent: As a network administrator, I want to use the NSG diagnostics tool to simulate network traffic flows, so that I can troubleshoot and verify the proper configuration of network security group rules in my Azure environment.
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

## Supported target resources

NSG diagnostics provides the capability to check network security groups and their rules on these Azure resources:

- Virtual machines
- Network interfaces
- Virtual machine scale set network interfaces
- Application gateways v2 (except private deployments). For more information, see [Private Application Gateway deployment](../application-gateway/application-gateway-private-deployment.md)

## Next step

To learn how to use NSG diagnostics, continue to:

> [!div class="nextstepaction"]
> [Diagnose network security rules](diagnose-network-security-rules.md)

---
title: Introduction to Network Configuration Diagnostics in Azure Network Watcher | Microsoft Docs
description: This page provides an overview of the Network Watcher - NSG Diagnostics
services: network-watcher
documentationcenter: na
author: shijaiswal
ms.service: network-watcher
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 01/04/2023
ms.custom: engagement-fy23
ms.author: shijaiswal
---

# Introduction to NSG Diagnostics in Azure Network Watcher

The NSG Diagnostics tool helps customers understand which traffic flows will be allowed or denied in your Azure Virtual Network along with detailed information for debugging. It can help you in understanding if your NSG rules are configured correctly. 

## Pre-requisites
For using NSG Diagnostics, Network Watcher must be enabled in your subscription. See [Create an Azure Network Watcher instance](./network-watcher-create.md) to enable.

## Background

- Your resources in Azure are connected via Virtual Networks (VNETs) and subnets. The security of these VNets and subnets can be managed using a Network Security Group (NSG).
- An NSG contains a list of security rules that allow or deny network traffic to resources it is connected to. NSGs can be associated with subnets, individual VMs, or individual network interfaces (NICs) attached to VMs. 
- All traffic flows in your network are evaluated using the rules in the applicable NSG.
- Rules are evaluated based on priority number from lowest to highest 

## How does NSG Diagnostics work? 

For a given flow, the NSG Diagnostics tool runs a simulation of the flow and returns whether the flow would be allowed (or denied) and detailed information about rules allowing/denying the flow.  Customers must provide details of a flow like source, destination, protocol, etc. The tool returns whether traffic was allowed or denied, the NSG rules that were evaluated for the specified flow and the evaluation results for every rule.

## Next steps

Use NSG Diagnostics using [REST API](/rest/api/network-watcher/networkwatchers/getnetworkconfigurationdiagnostic), [PowerShell](/powershell/module/az.network/invoke-aznetworkwatchernetworkconfigurationdiagnostic), and [Azure CLI](/cli/azure/network/watcher#az-network-watcher-run-configuration-diagnostic).
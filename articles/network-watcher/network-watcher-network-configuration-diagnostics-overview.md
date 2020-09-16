---
title: Introduction to Network Configuration Diagnostics in Azure Network Watcher | Microsoft Docs
description: This page provides an overview of the Network Watcher - Network Configuration Diagnostics
services: network-watcher
documentationcenter: na
author: damendo
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 09/15/2020
ms.author: damendo
---

# Introduction to Network Configuration Diagnostics in Azure Network Watcher

The Network Configuration Diagnostic tool help customers understand which traffic flows will be allowed or denied in your Azure Virtual Network. It can help your in understanding if your NSG rules are correctly. 

## Pre-requisites
•	For Network Configuration Diagnostics, Network Watcher must be enabled in your subscription. See Create an Azure Network Watcher instance to enable.

## Background

- Your resources in Azure are connected via Virtual Networks (VNETs) and subnets. The security of these VNets and subnets can be managed using a Network Security Group (NSG).
- An NSG contains a list of security rules that allow or deny network traffic to resources it is connected to. NSGs can be associated with subnets, individual VMs, or individual network interfaces (NICs) attached to VMs. 
- All traffic flows in your network are evaluated using the rules in the applicable NSG.
- Rules are evaluated based on priority number from lowest to highest 


## Next steps

Visit the following article to learn if a packet is allowed or denied for a specific virtual machine through the portal. [Check if traffic is allowed on a VM with IP Flow Verify using the portal](diagnose-vm-network-traffic-filtering-problem.md)

[1]: ./media/network-watcher-ip-flow-verify-overview/figure1.png


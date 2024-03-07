---
title: Automate UDR Management with Azure Virtual Network Manager
description: Learn to improve network performance and eliminate errors using UDR management with Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.topic: overview 
ms.date: 03/05/2024
ms.service: virtual-network-manager
# Customer Intent: As a network engineer, I want learn how I can automate UDR management to improve network performance and eliminate errors in Azure Virtual Network Manager.
---

# 

## What is UDR management and what we are solving? 

UDR management allows customers to describe their designed routing behavior, and AVNM orchestrates UDRs to create and maintain the desired behavior.  

We are addressing the need for automation and simplification in managing routing behaviors. Customers often desire to achieve various routing behaviors, and currently, they resort to manually creating User-Defined Routes (UDRs) or utilizing custom scripts. However, these methods are prone to errors and overly complicated. Some customers also utilize the Azure-managed hub in Virtual WAN, but this option has certain limitations (such as the inability to customize the hub or lack of IPV6 support) that may not be relevant to all customers. 

Here are the common routing scenarios that you can simplify and automate by using UDR management. 

1: Spoke -> NVA -> Spoke 

2: Spoke -> NVA -> some endpoint/services in the hub 

3. Subnet -> NVA -> Subnet even in the same VNet 

4. Spoke -> NVA -> onprem/internet 

5. Cross-hub and spoke via NVAs in each hub 

6. hub and spoke with Spoke to onprem needs to go via NVA 

7. GW -> NVA -> Spoke 

## Why UDR management is important

## How UDR management works 

Routing configuration and routing rules 

Structure 

AVNM allows customers to create routing configurations. A routing configuration can include multiple route rules.  

Users create rule collections to describe the UDRs needed for a network group (target network group). In the rule collection, route rules are used to describe the desired routing behavior for the subnets in the target network group. Each route rule consists of the following attributes: 

Route source 

Next hop 

Route destination 

Routing configurations create UDRs for customers based on what the route rules specify. 

For example: 

Spoke network group contains VNet1 and VNet2 

The customer can specify:  

Target network group: Spoke NG, go to DNS service’s address via Firewall 10.0.X.X 

AVNM will do the following to make this routing behavior happen. 

On the route tables in the subnets in VNet1 and VNet2 

Put UDR: go DNS service’s address via Firewall 10.0.X.X 

Supported network group membership 

A network group can have VNets or subnets. A network group can contain only one type of them, meaning a network group of VNets cannot contain subnets. 

The Scope of UDR management Private Preview and Roadmap 

The initial release of UDR management Private Preview allows you to use network group as the source of the UDRs. For example, you can say, the spoke network group, consisting of all the spoke networks, should go to the NVA before going to the DNS in the hub. 
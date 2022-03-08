---
title: Frequently asked questions about Azure Virtual Network Manager
description: Find answers to frequently asked questions about Azure Virtual Network Manager.
services: virtual-network-manager
author: duongau
ms.service: virtual-network-manager
ms.topic: article
ms.date: 11/02/2021
ms.author: duau
ms.custom: references_regions, ignite-fall-2021
---

# Azure Virtual Network Manager FAQ

## General

### What regions are available in public preview?

* North Central US

* West US

* West US 2

* East US

* East US 2

* North Europe

* West Europe

* France Central

### What are common use cases for using Azure Virtual Network Manager?

* As an IT security manager you can create different network groups to meet the requirements of your environment and its functions. For example, you can create network groups for Production and Test network environments, Dev teams, Finance department, etc. to manage their connectivity and security rules at scale. 

* You can apply connectivity configurations to create a mesh or a hub-and-spoke network topology for a large number of virtual networks across your organization's subscriptions. 

* You can deny high-risk traffic: As an administrator of an enterprise, you can block specific protocols or sources that will override any NSG rules that would normally allow the traffic.   

* Always allow traffic: You want to permit a specific security scanner to always have inbound connectivity to all your resources, even if there are NSG rules configured to deny the traffic.   

## Technical

### Can a virtual network belong to multiple Azure Virtual Network Managers?

Yes, a virtual network can belong to more than one Azure Virtual Network Manager.

### What is a global mesh network topology?

A global mesh allows for virtual networks across different regions to communicate with one another. The effects are similar to how global virtual network peering works.

### Is there a limit to how many network groups can be created?

There's no limit to how many network groups can be created.

### How do I remove the deployment of all applied configurations?

You'll need to deploy a **None** configuration to all regions that have you have a configuration applied.

### Can I add virtual networks from another subscription not managed by myself?

Yes, you'll need to have the appropriate permissions to access those virtual networks.

### What is dynamic group membership?

For more information, see [dynamic membership](concept-network-groups.md#dynamic-membership).

### How does the deployment of configuration differ for dynamic membership and static membership?

For more information, see [deployment against membership types](concept-deployments.md#deployment).

### How do I delete an Azure Virtual Network Manager component?

For more information, see [remove components checklist](concept-remove-components-checklist.md).

### How can I see what configurations are applied to help me troubleshoot?

You can view Azure Virtual Network Manager settings under **Network Manager** for a virtual network. You can see both connectivity and security admin configuration that are applied. For more information, see [view applied configuration](how-to-view-applied-configurations.md).

### Can a virtual network managed by Azure Virtual Network Manager be peered to a non-managed virtual network?

Yes, you can choose to override or delete an existing peering already created.

### How can I explicitly allow SQLMI traffic before having deny rules?

Azure SQL Managed Instance has some network requirements. If your security admin rules can block the network requirements, you can use the below sample rules to allow SQLMI traffic with higher priority than the deny rules that can block the traffic of SQL Managed Instance.

#### Inbound rules

| Port | Protocol | Source | Destination | Action |
| ---- | -------- | ------ | ----------- | ------ |
| 9000, 9003, 1438, 1440, 1452 | TCP | SqlManagement | **VirtualNetwork** | Allow |
| 9000, 9003 | TCP | CorpnetSaw | **VirtualNetwork** | Allow |
| 9000, 9003 | TCP | CorpnetPublic | **VirtualNetwork** | Allow |
| Any | Any | **VirtualNetwork** | **VirtualNetwork** | Allow |
| Any | Any | **AzureLoadBalancer** | **VirtualNetwork** | Allow |

#### Outbound rules

| Port | Protocol | Source | Destination | Action |
| ---- | -------- | ------ | ----------- | ------ |
| 443, 12000 | TCP	| **VirtualNetwork** | AzureCloud | Allow |
| Any | Any | **VirtualNetwork** | **VirtualNetwork** | Allow |

## Limits

### What are the service limitation of Azure Virtual Network Manager?

* A hub in a hub-and-spoke topology can be peered up to 250 spokes. 

* A mesh topology can have up to 250 virtual networks.

* The subnets in a virtual network can't talk to each other if they have the same address space in a mesh configuration. 

* The maximum number of IP prefixes in all admin rules combined is 1000. 

* The maximum number of admin rules in one level of Azure Virtual Network Manager is 100. 

* Azure Virtual Network Manager doesn't have cross-tenant support in the public preview.

* A virtual network can be part of up to two mesh configurations. 

## Next steps

Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance using the Azure portal.

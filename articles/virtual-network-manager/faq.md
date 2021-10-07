---
title: Frequently asked questions about Azure Virtual Network Manager
description: Find answers to frequently asked questions about Azure Virtual Network Manager.
services: virtual-network-manager
author: duongau
ms.service: virtual-network-manager
ms.topic: article
ms.date: 11/02/2021
ms.author: duau
ms.custom: references_regions
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

* An IT security manager can create different network groups depending on the needs of an environment and its functions. For example, you can create network groups for Production and Test network environments, Dev teams, Finance department, etc. to manage their network at scale. 

* You can apply a connectivity configuration to create a mesh or hub and spoke network topology for a large number of VNets across your organization. 

* Deny high-risk traffic: As an administrator of an enterprise, you can block a specific protocol or source that overrides any NSG rules that would normally allow the traffic.   

* Always allow traffic: You want to permit a specified security scanner to always have inbound connectivity to all your resources, even if you have an NSG rule configured to deny the traffic.   

## Technical

### Can a virtual network belong to multiple Network Managers?

Yes, a virtual network can belong to more than one Azure Virtual Network Manager.

### What is a global mesh network topology?

A global mesh allows for virtual networks across different regions to communicate with one anything. The effects are similar to how global virtual network peering works.

### Is there a limit to how many network groups can be created?

There's no limit to how many network groups can be created.

### How do I remove the deployment of all applied configurations?

You'll need to deploy a **None** configuration to all the regions that have you have a configuration applied.

### Can I add virtual networks from another subscription not managed by myself?

Yes, you'll need to have the appropriate permissions.

### What is dynamic group membership?

For more information, see [Dynamic group membership](concept-network-groups.md#dynamic).

### How does the deployment of configuration differ for dynamic membership and static membership?

For more information, see [Deployment against membership types](concept-deployments.md#deployment).

### How do I delete an Azure Virtual Network Manager component?

For more information, see [Remove components checklist](concept-remove-components-checklist.md).

### How can I see what configurations are applied to help me troubleshoot?

You can view Azure Virtual Network Manager settings under **Network Manager** for a virtual network. You can see both connectivity and security admin configuration that are applied.

### Can a virtual network managed by Azure Virtual Network Manager be peered to a non-managed virtual network?

Yes, you can choose to override or delete an existing peering already created.

## Limits

### What are the service limitation of Azure Virtual Network Manager?

* A hub in a hub and spoke topology can be peered up to 500 spokes. 

* The subnets in a virtual network can't talk to each other if they have the same address space in a mesh configuration. 

* Azure Virtual Network Manager allows only 500 virtual network peering connections across all connectivity configuration for a given virtual network. You can also manage Legacy peering on their own. 

* The maximum number of IP prefixes in all Admin rules combined is 1000. 

* The maximum number of Admin rules in one level of Azure Virtual Network Manager is 100. 

* Azure Virtual Network Manager won't have cross-tenant support in the public preview.

* A virtual network can't be part of more than five mesh configurations. 

## Next steps

Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance using the Azure portal.

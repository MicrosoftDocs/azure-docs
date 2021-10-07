---
title: Frequently asked questions about Azure Azure Virtual Network Manager
description: Find answers to frequently asked questions about Azure Virtual Network Manager.
services: virtual-network-manager
author: duongau
ms.service: virtual-network-manager
ms.topic: article
ms.date: 11/02/2021
ms.author: duau
---

# Azure Virtual Network Manager FAQ

## General

### What regions are available in public preview?

### What are common use cases for using Azure Virtual Network Manager?

* An IT security manager can create different network groups depending on the needs of an environment and its functions. For example, you can create network groups for Production and Test network environments, Dev teams, Finance department, etc. to manage their network at scale. 

* You can apply a connectivity configuration to simply create a mesh or hub and spoke network topology for a large number of VNets across your organization. 

* Deny high-risk traffic: As an administrator of an enterprise you can block a specific protocol or source that overrides any NSG rules that would normally allow the traffic.   

* Always allow traffic: You may want to permit a specified security scanner to always have inbound connectivity to all your resources, even if an NSG rule was configured to deny the traffic.   

## Technical

### Can a virtual network belong to multiple Network Manager?

Yes, a virtual network can belong to more than one Azure Virtual Network Manager.

### What is a global mesh network topology?

A global mesh allows for virtual networks across different regions to communicate with one anything. The affects is similar to how global virtual network peering works.

### Is there a limit to how many network groups can be created?

There is no limit to how many network groups can be created.

### How do I remove the deployment of all applied configurations?

You'll need to deploy a **None** configuration to all the regions that have you have a configuration applied.

### Can I add virtual networks from another subscription not managed by myself?

Yes, you will need to have the appropriate permissions.

### What is dynamic group membership?

See [Dynamic group membership](concept-network-groups.md#dynamic) for more information.

### How does the deployment of configuration differ for dynamic membership and static membership?

See [Deployment against membership types](concept-deployments.md#deployment) for more information.

### How do I delete an Azure Virtual Network Manager component?

See [Remove components checklist](concept-remove-components-checklist.md) for more information.

### How can I see what configurations are applied to help me troubleshoot?

### Can a virtual network managed by Azure Virtual Network Manager be peered to a non-managed virtual network?

Yes, you can choose to override or delete an existing peerings already created.

## Limits

### What are the service limitation of Azure Virtual Network Manager?

* A hub in a hub and spoke topology can be peered up to 500 spokes. 

* RFC1918 address for mesh virtual network. Get effective routes will show 1918 routes toward peers. This is not expected.

* The subnets in a virtual network can't talk to each other if they have the same address space in a mesh configuration. 

* Azure Virtual Network Manager allows only 500 virtual network peering connections across all connectivity configuration for a given virtual network. You can also manage Legacy peering on their own. 

* The maximum number of IP prefixes in all Admin rules combined is 1000. 

* The maximum number of Admin rules in one level of Azure Virtual Network Manager is 100. 

* Azure Virtual Network Manager won't have cross-tenant support in the public preview.

* A virtual network cannot be part of more than five mesh configurations. 

## Next steps

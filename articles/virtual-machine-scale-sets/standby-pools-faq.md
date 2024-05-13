---
title: Frequently asked questions about standby pools for Virtual Machine Scale Sets
description: Get answers to frequently asked questions for standby pools on Virtual Machine Scale Sets.
author: mimckitt
ms.author: mimckitt
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.date: 04/22/2024
ms.reviewer: ju-shim
---

# Standby pools FAQ (Preview)

> [!IMPORTANT]
> Standby pools for Virtual Machine Scale Sets are currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Get answers to frequently asked questions about standby pools for Virtual Machine Scale Sets in Azure.

### What are standby pools for Virtual Machine Scale Sets? 
Azure standby pools is a feature for Virtual Machine Scale Sets with Flexible Orchestration that enables faster scaling out of resources by creating a pool of pre-provisioned virtual machines ready to service your workload. 

### When should I use standby pools for Virtual Machine Scale Sets? 
Using a standby pool with your Virtual Machine Scale Set can help improve scale-out performance by completing various pre and post provisioning steps in the pool before the instances are placed into the scale set. 

### What are the benefits of using Azure standby pools for Virtual Machine Scale Sets? 
Standby pools is a powerful feature for accelerating your time to scale-out and reducing the management needed for provisioning virtual machine resources and getting them ready to service your workload. If your applications are latency sensitive or have long initialization steps, standby pools can help with reducing that time and managing the steps to make your virtual machines ready on your behalf. 

### Can I use standby pools on Virtual Machine Scale Sets with Uniform Orchestration?
Standby pools is only supported on Virtual Machine Scale Sets with Flexible Orchestration.

### Can I use standby pools for Virtual Machine Scale Sets if I'm already using Azure autoscale? 
Attaching a standby pool to a Virtual Machine Scale Set with Azure autoscale enabled isn't supported.  

### How many virtual machines can my standby pool for Virtual Machine Scale Sets have? 
The maximum number of virtual machines between a scale set and a standby pool is 1,000. 

### Can my standby pool span multiple Virtual Machine Scale Sets? 
A standby pool resource can't span multiple scale sets. Each scale set has its own standby pool attached to it. A standby pool inherits the unique properties of the scale set such as networking, virtual machine profile, extensions, and more. 

### How is the configuration of my virtual machines in the standby pool for Virtual Machine Scale Sets determined? 
Virtual machines in the standby pool inherit the same virtual machine profile as the virtual machines in the scale set. Some examples are:  
- Virtual machine size
- Storage Profile
- Image Reference
- OS Profile
- Network Profile
- Extensions Profile
- Zones


### Can I change the size of my standby pool without needing to recreate it? 
Yes. To change the size of your standby pool update the max ready capacity setting.  


### I created a standby pool and I noticed that some virtual machines are coming up in a failed state. 
Ensure you have enough quota to complete the standby pool creation. Insufficient quota results in the platform attempting to create the virtual machines in the standby pool but unable to successfully complete the create operation. Check for multiple types of quotas such as Cores, Network Interfaces, IP Addresses, etc.

### I increased my scale set instance count but the virtual machines in my standby pool weren't used. 
Ensure that the virtual machines in your standby pool are in the desired state prior to attempting a scale-out event. For example, if using a standby pool with the virtual machine states set to deallocated, the standby pool will only give out instances that are in the deallocated state. If instances are in any other states such as creating, running, updating, etc., the scale set will default to creating a new instance directly in the scale set.


## Next steps

Learn more about [standby pools on Virtual Machine Scale Sets](standby-pools-overview.md).

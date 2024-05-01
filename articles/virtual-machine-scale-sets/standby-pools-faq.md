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
Azure standby pools is a feature for Virtual Machine Scale Sets Flexible Orchestration that enables faster scaling out of resources by creating a pool of pre-provisioned virtual machines ready to service your workload. 

### When should I use standby pools for Virtual Machine Scale Sets? 
There are two phases of virtual machine creation that can impact the time it takes for a virtual machine to be able to retrieve traffic. The first phase is the virtual machine provisioning itself, and the second phase is the post provisioning steps that you might take to make the virtual machine ready for your workload. This second step could include custom script extensions, downloading large amounts of data, security hardening, or any extra configuration steps needed and can often take many minutes to complete. 

### What are the benefits of using Azure standby pools for Virtual Machine Scale Sets? 
Standby pools is a powerful feature for accelerating your time to scale out and reducing the management needed for provisioning virtual machine resources and getting them ready to service your workload. If your applications are latency sensitive or have long initialization steps, standby pools can help with reducing that time and managing the steps to make your virtual machines ready on your behalf. 

### Can I use standby pools on Virtual Machine Scale Sets with Uniform Orchestration?
No. Standby pools is only supported on Virtual Machine Scale Sets with Flexible Orchestration.

### Can I use standby pools for Virtual Machine Scale Sets if I'm already using Azure autoscale? 
No. Attaching a standby pool to a Virtual Machine Scale Set with Azure autoscale enabled is not supported.  

### How many virtual machines can my standby pool for Virtual Machine Scale Sets have? 
The maximum number of virtual machines between a scale set and a standby pool is 1,000. 

### Do virtual machines in the standby pool receive traffic from the load balancer associated with the scale set? 
No. Virtual machines in the standby pool don't take any traffic from the Load Balancer associated with the scale set until they're moved from the standby pool into the scale set. 

### Can my standby pool span multiple Virtual Machine Scale Sets? 
No. A standby pool resource can't span multiple scale sets. Each scale set has its own standby pool attached to it. A standby pool inherits the unique properties of the scale set such as networking, virtual machine profile, extensions, and more. 

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
Yes. To change the size of your standby pool, change the max ready capacity using the SDK of your choice. 


### I created a standby pool and I noticed that some virtual machines are coming up in a failed state. 
Ensure you have enough quota to complete the standby pool creation. Insufficient quota results in the platform attempting to create the virtual machines in the standby pool but unable to successfully complete the create operation. Check for multiple types of quotas such as Cores, Network Interfaces, IP Addresses, etc.

### Will my scale set use virtual machines from my standby pool if they are in a failed state? 
No. Virtual Machine Scale Sets will only use instances from your standby pool that match the desired power state of your pool. For example, if your desired power state is set as deallocated, the scale set only uses virtual machines in that current power state. If virtual machines are in a creating, failed or any other state than the expected state, the scale set defaults to new virtual machine creation instead. 


## Next steps

Learn more about [standby pools on Virtual Machine Scale Sets](standby-pools-overview.md).
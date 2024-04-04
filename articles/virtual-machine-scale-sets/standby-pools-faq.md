---
title: Frequently asked questions about standby pools for Virtual Machine Scale Sets
description: Learn about frequently asked questions for standby pools on Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.date: 01/16/2024
ms.reviewer: ju-shim
---

# Standby pools FAQ

> [!IMPORTANT]
> Standby pools for Virtual Machine Scale Sets are currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Get answers to frequently asked questions about standby pools for Virtual Machine Scale Sets in Azure.

### What are standby pools for Virtual Machine Scale Sets? 
Azure standby pools is a feature of Virtual Machine Scale Sets Flexible Orchestration that enables faster 
scaling out of resources by creating a pool of pre-provisioned virtual machines ready to service your 
workload. 

### When should I use standby pools for Virtual Machine Scale Sets? 
There are two phases of virtual machine creation that can impact the time it takes for a VM to be able to 
retrieve traffic. The first phase is the virtual machine provisioning itself, and the second phase is the post 
provisioning steps that you might take to make the VM ready for your workload. This second step could 
include custom script extensions, downloading large amounts of data, security hardening, or any 
extra configuration steps needed and can often take many minutes to complete. 

### What are the benefits of using Azure standby pools for Virtual Machine Scale Sets? 
Standby pools is a powerful feature for accelerating your time to scale out and reducing the 
management needed for provisioning VM resources and getting them ready to service your workload. If 
your applications are latency sensitive or have long initialization steps, standby pools can help with reducing 
that time as well as managing the steps to make your VMs ready on your behalf. 

### Can I use standby pools on Virtual Machine Scale Sets with Uniform Orchestration?
No. Standby pools is only supported on Virtual Machine Scale Sets with Flexible Orchestration.

### Can I use standby pools for Virtual Machine Scale Sets if I'm already using Azure Autoscale? 
Yes. However it is not suggested. Autoscale will consume the metrics of VMs in your scale set and the VMs in your pool to determine when to scale. This can result in unexpected scale out events. 

### How many VMs can my standby pool for Virtual Machine Scale Sets have? 
The maximum number of VMs between a scale set and a standby pool is 1,000. 

### Do VMs in the standby pool receive traffic from the Load Balancer associated with the scale set? 
No, VMs in the standby pool don't take any traffic from the Load Balancer associated with the scale set 
until they're moved from the standby pool into the scale set. 

### Can my standby pool span multiple Virtual Machine Scale Sets? 
A standby pool resource itself does not span multiple scale set. Each scale set has its own Standby 
Pool attached to it. Standby pool inherits the unique properties of the scale set 
such as networking, VM profile, extensions, and more. 

### How is the configuration of my VMs in the standby pool for Virtual Machine Scale Sets determined? 
Virtual machines in the standby pool inherits the same VM profile as the virtual machines in the scale 
set. Some examples are:  
- VM Size
- Storage Profile
- Image Reference
- OS Profile
- Network Profile
- Extensions Profile
- Zones


### Can I change the size of my standby pool without needing to recreate it? 
Yes, to change the size of your standby pool, resubmit the create request and specify the new 
MaxReadyCapacity you wish you use.

### I created my standby pool and it reported back as successful. However, I don't see any VMs being created in my subscription. 
Make sure you enter the correct Subscription ID in the PUT calls. If you accidentally used the 
incorrect subscription or there was an error in your input, the response might still show successful even though the actual creation of the VMs fail on the backend. 

### I created a standby pool and I noticed that some VMs are coming up in a failed state. 
Ensure you have enough quota to complete the standby pool creation. Insufficient quota usually results 
in the platform attempting to create the VMs in the standby pool but unable to successfully complete 
the create operation. Check for multiple types of quotas such as Cores, NICs, IP Addresses, etc.

### Will my scale set pull VMs from my standby pool if they are in a failed state? 
No. Virtual Machine Scale Sets will only pull instances from your standby pool that match the desired power state of your pool. For example, if your desired power state is set as Stopped (deallocated), the scale set will only pull VMs in that current power state. If VMs are in a creating, failed or any other state than the expected state, the scale set will default to new VM creation instead. 


## Next steps

Learn more about [standby pools on Virtual Machine Scale Sets](standby-pools-overview.md).
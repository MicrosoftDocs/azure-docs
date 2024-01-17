---
title: Frequently asked questions about Standby Pools for Virtual Machine Scale Sets
description: Learn about frequently asked questions for Standby Pools on Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.date: 01/16/2024
ms.reviewer: ju-shim
---

# Standby Pools FAQ

> [!IMPORTANT]
> Standby Pools for Virtual Machine Scale Sets are currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Get answers to frequently asked questions about Standby Pools for Virtual Machine Scale Sets in Azure.

### What are Standby Pools for Virtual Machine Scale Sets? 
Azure Standby Pools is a feature of Virtual Machine Scale Sets Flexible Orchestration that enables faster 
scaling out of resources by creating a pool of pre-provisioned virtual machines ready to service your 
workload. 

### When should I use Standby Pools for Virtual Machine Scale Sets? 
There are two phases of virtual machine creation that can impact the time it takes for a VM to be able to 
retrieve traffic. The first phase is the virtual machine provisioning itself, and the second phase is the post 
provisioning steps that you might take to make the VM ready for your workload. This second step could 
include custom script extensions, downloading large amounts of data, security hardening, or any 
extra configuration steps needed and can often take many minutes to complete. 

### What are the benefits of using Azure Standby Pools for Virtual Machine Scale Sets? 
Standby Pools is a powerful feature for accelerating your time to scale-out and reducing the 
management needed for provisioning VM resources and getting them ready to service your workload. If 
your applications are latency sensitive or have long initialization steps such as custom script extensions, 
loading service binaries, or any other VM configuration action, Standby Pools can help with reducing 
that time as well as managing the steps to make your VMs ready on your behalf. 

### Can I use Standby Pools for Virtual Machine Scale Sets if I'm already using Azure Autoscale? 
Yes. However, autoscale will use the metrics of VMs in your scale set and the VMs in your pool into 
account when determine when to scale. This could result in unexpected scale-out events. 

### How many VMs can my Standby Pool for Virtual Machine Scale Sets have? 
The maximum number of VMs in a scale set is 1,000. When using the Standby Pool feature, this 
number is the maximum number of VMs in both the scale set and the Standby Pool (i.e. VM Scale Set + 
Standby Pool < 1,000 running VMs). 

### Do VMs in the Standby Pool receive traffic from the Load Balancer associated with the scale set? 
No, VMs in the Standby Pool don't take any traffic from the Load Balancer associated with the scale set 
until they're moved from the Standby Pool into the scale set. 

### Can my Standby Pool span multiple Virtual Machine Scale Sets? 
A Standby Pool resource itself does not span multiple scale set. Each scale set has its own Standby 
Pool attached to it. This is because each Standby Pool inherits the unique properties of the scale set 
such as networking, VM profile, extensions, and more. 

### How is the configuration of my VMs in the Standby Pool for Virtual Machine Scale Sets determined? 
Virtual machines in the Standby Pool inherits the same VM profile as the virtual machines in the scale 
set. All the components of the Virtual Machine Profile (examples below are not an exhaustive list) will be 
the same between the VM Scale Set VMs and Standby Pool VMs. 
- VM Size
- Storage Profile
- Image Reference
- OS Profile
- Network Profile
- Extensions Profile
- Zones


### Can I change the size of my Standby Pool without needing to recreate it? 
Yes, to change the size of your Standby Pool, resubmit the create request and specify the new 
MaxReadyCapacity you wish you use.

### I created my Standby Pool and it reported back as successful. However, I don't see any VMs being created in my subscription. 
Make sure you enter the correct Subscription ID in the PUT calls. If you accidentally used the 
incorrect subscription or there was an error in your input, the response might still show successful even 
though the actual creation of the VMs fail on the backend. \

### I created a Standby Pool and I noticed that some VMs are coming up in a failed state. 
Ensure you have enough quota to complete the Standby Pool creation. Insufficient quota usually results 
in the platform attempting to create the VMs in the Standby Pool but unable to successfully complete 
the create operation. Check for multiple types of quotas such as Cores, NICs, IP Addresses, etc.


## Next steps

Learn more about [Standby Pools on Virtual Machine Scale Sets](standby-pools-overview.md).
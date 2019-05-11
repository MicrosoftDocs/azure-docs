---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 05/09/2019
 ms.author: cynthn
 ms.custom: include file
---

One of the largest contributors to latency between VMs is simply distance. Placing VMs in a single region can reduce the distance and placing them in zones is another step to bringing them physically closer together. But, to get VMs as close as possible, you should deploy them within a Proximity Placement Group (PPG).

A Proximity Placement Group (PPG) is a logical grouping used to make sure that Azure compute resources are physically located close to each other in a region or Availability Zone. Proximity placement groups are useful for workloads where low latency is a requirement. 

- Low latency between stand-alone VMs.
- Low Latency between VMs in a single availability set or a virtual machine scale set. 
- Low latency between sand-alone VMs, VMs in multiple Availability Sets, or multiple scale sets. You can have multiple compute resources in a single placement group to bring together a multi-tiered application. 
- Low latency between multiple application tiers using different hardware types. For example, running the backend using M-series in an availability set and the front end on a D-series instance, in a scale set, in a single Proximity Placement Group.



Best practices:
- Deploy all VMs at once with a template.
- Deploy largest and rarest VM types first. Use this page to determine rarity: https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines If a VM type is available in a limited number of regions, it is “rare”. Deploy this one first.
- When re-using an existing PPG from which VMs were deleted, wait for the deletion to fully complete before adding VMs to it.
- Put VMs in a PPG and the entire solution in an availability zone.
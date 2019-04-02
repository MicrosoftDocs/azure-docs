---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 04/01/2019
 ms.author: cynthn
 ms.custom: include file
---

One of the largest contributors to latency between VMs is simply distance. Placing VMs in a single region can reduce the distance and placing them in zones is another step to bringing them physically closer together. But, to get VMs as close as possible, you should deploy them within a Proximity Placement Group (PPG).

A Proximity Placement Group (PPG) is a logical grouping used to make sure that Azure compute resources are physically located close to each other in a region or Availability Zone. Proximity placement groups are useful for workloads where low latency is a requirement. 

PPGs provide latency advantages between VMs, by iteself or when used with other features:

- Low latency between stand-alone VMs. Get low latency without the complexity of other options like zones or availability sets.
- Compatible with Availability Zones. Get even lower latency between VMs in an Availability Zone. Availability Zones provide fault isolation while PPGs provide better latency
- Low latency between different hardware types. Fore example, M-series and D-series VMs can be in the same Proximity Placement Group.
- Low latency between VMs in different Availability Sets. You can have multiple Availability Sets and/or single VMs in a placement group. For example, a SAP/HANA deployment where M-series VMs running Hana can be in AvSet 1 and D-series VMs running a front-end app can be in AvSet2. Both AvSets can be in the same placement group.
- Enable Accelerated Networking for best results

You can also combine Proximity Placement Groups with Availability Zone placement for other resources:
- Gateways
- Firewalls
- Load balancers
- Storage (other than Premium Managed disks which can be in PPG directly)
- Databases
- Anything else that is zone aware

Put VMs in a PPG and the entire solution in a availability zone.
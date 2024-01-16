---
title: Standby Pools for Virtual Machine Scale Sets
description: Learn how to utilize Standby Pools to reduce scale out latency with Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.date: 01/16/2024
ms.reviewer: ju-shim
---

# Standby Pools for Virtual Machine Scale Sets

Standby Pools for Virtual Machine Scale Sets allow you to increase scaling performance by creating a pool of pre-provisioned virtual machines from which the scale set can draw from when scaling out. Standby Pools reduce the time to scale out by performing various initialization steps such as installing applications/ software or loading large amounts of data. These initialization steps are performed on the VMs in the Standby Pool prior to being put into the scale set and before the instances begin taking traffic. 

## Concepts

### Standby Pool Size
The number of VMs in a Standby Pool is determined by the number of VMs in your scale set and the total Max Capacity you want ready at any point in time. 

- Max Ready Capacity = The maximum number of VMs you want to have ready.

- VM Scale Set Capacity = The current number of VMs already deployed in your scale set.

- Standby Pool Size = Max Ready Capacity – VM Scale Set Capacity

### Scaling

When your scale set requires additional instances, rather than creating new instances and placing them directly into the scale set, the scale set can instead pull VMs from the Standby Pool. This significantly reduces the time it takes to scale out and have the instances ready to take traffic. 

When your scale set scales back down, the instances are deleted from your scale set and your Standby Pool will be refilled to meet the Standby Pool Size based on the above formula. 

If at any point in time your scale set needs to scale beyond the number of instances you have in your Standby Pool, the scale set will default to standard scale out methods and create new instances that are added directly into the Scale Set

### Virtual Machine States

The VMs in the Standby Pool can be created in a Running State or a Stopped (deallocated) state. The state of the VMs in the Standby Pool is configured using the virtualMachineState parameter: 

```HTTP
"virtualMachineState":"Running"
"virtualMachineState":"Deallocated"
```


**Stopped (Deallocated) VM State:** Deallocated VMs are shut down and keep any associated data disks, 
NICs, and any static IPs remain unchanged. 

**Running VM State:** Using VMs in a Running state is recommended when latency and reliability 
requirements are very strict.

### Pricing

There is no direct cost associated with using Standby Pools. Users are charged based on the resources 
deployed into the Standby Pool. For more information on Virtual Machine billing, see [VM power states and billing documentation](../virtual-machines/states-billing.md)

**Deallocated VM State:** Leveraging a Standby Pool with VMs in the Deallocated State is a great way to reduce the cost while keeping your scale out times fast. VMs in the deallocated state do not incur any compute costs, only the associated resources incur costs. 

**Running VM State:** Running VMs will incur a higher cost due to compute resources being 
consumed.

## Considerations
- The total capacity of the Standby Pool and the VMSS together cannot exceed 1000 instances. 
- Standby Pools do not currently support Spot VMs or Spot/ Priority Mix VMs.
- If your scale set has already been scaled out to the maximum ready capacity of your Standby Pool, VMs will be created from scratch just as they would a standard scale out without Standby Pools. 
- Creation of pooled resources is subject to the resource availability in each region.
- If using autoscale to trigger scaling, autoscale takes into account the metrics associated with your VMs in your scale set and the VMs in the pool. This could result in unexpected scale out events. This is currently being addressed. 
- Deploying a Standby Pool attached to a Zonal scale set is not currently supported. The pool itself will be deployed zonally, however scaling out can cause random VMs to enter a failed state. This work is in progress. 


## Next steps

Learn how to [create a Standby Pool](standby-pools-create.md)
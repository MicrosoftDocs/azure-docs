---
 title: include file
 description: include file
 author: ju-shim
 ms.service: virtual-machine-scale-sets
 ms.topic: include
 ms.date: 10/11/2022
 ms.author: jushiman
 ms.custom: include file
---

On October 12, 2022  [Spot Priority Mix](../../virtual-machine-scale-sets/spot-priority-mix.md) was introduced for scale sets using Flexible orchestration.

Spot Priority Mix provides the flexibility of running a mix of regular on-demand VMs and Spot VMs for Virtual Machine Scale Set deployments. Easily balance between high-capacity availability and lower infrastructure costs according to your workload requirements.

Customize your deployment by setting a percentage distribution across Spot and regular VMs. The platform will automatically orchestrate each scale-out and scale-in operation to achieve the desired distribution by selecting an appropriate number of VMs to create or delete. You can also set the number of base regular uninterruptible VMs you would like to maintain in the scale set during any scale operation.

- Reduce compute infrastructure costs by applying the deep discounts of Spot VMs while maintaining capacity availability through on-demand VMs
- Provide reassurance that all your VMs won't be taken away simultaneously due to evictions before the infrastructure has time to react and recover the evicted capacity
- Simplify the scale-out and scale-in of workloads that require both Spot and on-demand VMs by letting Azure orchestrate the creating and deleting VMs.

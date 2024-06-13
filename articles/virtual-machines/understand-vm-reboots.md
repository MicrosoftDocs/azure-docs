---
title: Understand VM reboots
description: Understand VM reboots - maintenance vs downtime
author: mimckitt
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 02/28/2023
ms.author: mattmcinnes
ms.reviewer: cynthn

---

# Understand VM reboots - maintenance vs. downtime

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

There are three scenarios that can lead to virtual machines in Azure being impacted: unplanned hardware maintenance, unexpected downtime, and planned maintenance.

## Unplanned hardware maintenance event
Unplanned hardware maintenance occurs when the Azure platform predicts that the hardware or any platform component associated to a physical machine, is about to fail. When the platform predicts a failure, it issues an unplanned hardware maintenance event to reduce the impact to the virtual machines hosted on that hardware. Azure uses [Live Migration](./maintenance-and-updates.md) technology to migrate the Virtual Machines from the failing hardware to a healthy physical machine. Live Migration is a VM preserving operation that only pauses the Virtual Machine for a short time. Memory, open files, and network connections are maintained, but performance might be reduced before and/or after the event. In cases where Live Migration can't be used, the VM experiences Unexpected Downtime.


## Unexpected downtime
Unexpected downtime is when the hardware or the physical infrastructure for the virtual machine encounters an issue and fails unexpectedly. Issues can include local network failures, local disk failures, or other rack level failures. When detected, the Azure platform automatically migrates (heals) your virtual machine to a healthy physical machine in the same data center. During the healing procedure, virtual machines experience downtime (reboot) and in some cases loss of the temporary drive. The attached OS and data disks are always preserved.

Virtual machines can also experience downtime in the unlikely event of an outage or disaster that affects an entire data center, or even an entire region. For these scenarios, Azure provides protection options including  [availability zones](../availability-zones/az-overview.md) and [paired regions](regions.md#region-pairs).

## Planned maintenance events
Planned maintenance events are periodic updates made by Microsoft to the underlying Azure platform to improve overall reliability, performance, and security of the platform infrastructure that your virtual machines run on. Most of these updates are performed without any impact upon your Virtual Machines or Cloud Services (see [Maintenance that doesn't require a reboot](maintenance-and-updates.md#maintenance-that-doesnt-require-a-reboot)). While the Azure platform attempts to use VM Preserving Maintenance in all possible occasions, there are rare instances when these updates require a reboot of your virtual machine to apply the required updates to the underlying infrastructure. In this case, you can perform Azure Planned Maintenance with Maintenance-Redeploy operation by initiating the maintenance for their VMs in the suitable time window. For more information, see [Planned Maintenance for Virtual Machines](maintenance-and-updates.md).

## Reduce downtime
To reduce the impact of downtime due to one or more of these events, we recommend the following high availability best practices for your virtual machines:

* Use [Availability Zones](../availability-zones/az-overview.md) to protect from data center failures
* Configure multiple virtual machines in an [availability set](availability-set-overview.md) for redundancy
* Use [scheduled events for Linux](./linux/scheduled-events.md) or [scheduled events for Windows](./windows/scheduled-events.md) to proactively respond to VM impacting events
* Configure each application tier into separate availability sets
* Combine a [load balancer](../load-balancer/load-balancer-overview.md) with availability zones or sets

## Next steps
To learn more about availability options in Azure see, see [Availability overview](availability.md).

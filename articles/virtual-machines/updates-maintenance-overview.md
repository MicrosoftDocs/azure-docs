---
title: Updates and maintenance overview
description: Learn about the updates and maintenance options available with virtual machines in Azure
author: mimckitt
ms.author: mimckitt
ms.service: virtual-machines
ms.topic: overview
ms.date: 02/28/2023
ms.reviewer: cynthn
---

# Updates and maintenance overview

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

This article provides an overview of the various update and maintenance options for Azure virtual machines (VMs).

## Automatic OS image upgrade

Enabling [automatic OS image upgrades](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md?context=/azure/virtual-machines/context/context) on your scale set helps ease update management by safely and automatically upgrading the OS disk for all instances in the scale set.

[Automatic OS upgrade](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md?context=/azure/virtual-machines/context/context) has the following characteristics:

- Once configured, the latest OS image published by image publishers is automatically applied to the scale set without user intervention.
- Upgrades batches of instances in a rolling manner each time a new image is published by the publisher.
- Integrates with application health probes and [Application Health extension](../virtual-machine-scale-sets/virtual-machine-scale-sets-health-extension.md?context=/azure/virtual-machines/context/context).
- Works for all VM sizes, and for both Windows and Linux images.
- You can opt out of automatic upgrades at any time (OS Upgrades can be initiated manually as well).
- The OS Disk of a VM is replaced with the new OS Disk created with latest image version. Configured extensions and custom data scripts are run, while persisted data disks are retained.
- [Extension sequencing](../virtual-machine-scale-sets/virtual-machine-scale-sets-extension-sequencing.md?context=/azure/virtual-machines/context/context) is supported.
- Automatic OS image upgrade can be enabled on a scale set of any size.


## Automatic VM guest patching 

Enabling [automatic VM guest patching](automatic-vm-guest-patching.md) for your Azure VMs helps ease update management by safely and automatically patching virtual machines to maintain security compliance.

[Automatic VM guest patching](automatic-vm-guest-patching.md) has the following characteristics:
- Patches classified as *Critical* or *Security* are automatically downloaded and applied on the VM.
- Patches are applied during off-peak hours in the VM's time zone.
- Patch orchestration is managed by Azure and patches are applied following [availability-first principles](automatic-vm-guest-patching.md#availability-first-updates).
- Virtual machine health, as determined through platform health signals, is monitored to detect patching failures.
- Works for all VM sizes.


## Automatic extension upgrade

[Automatic Extension Upgrade](automatic-extension-upgrade.md) is available for Azure VMs and Azure Virtual Machine Scale Sets. When Automatic Extension Upgrade is enabled on a VM or scale set, the extension is upgraded automatically whenever the extension publisher releases a new version for that extension.

 Automatic Extension Upgrade has the following features:
- Supported for Azure VMs and Azure Virtual Machine Scale Sets.
- Upgrades are applied in an availability-first deployment model.
- For a Virtual Machine Scale Set, no more than 20% of the scale set virtual machines will be upgraded in a single batch. The minimum batch size is one virtual machine.
- Works for all VM sizes, and for both Windows and Linux extensions.
- You can opt out of automatic upgrades at any time.
- Automatic extension upgrade can be enabled on a Virtual Machine Scale Sets of any size.
- Each supported extension is enrolled individually, and you can choose which extensions to upgrade automatically.
- Supported in all public cloud regions.

## Hotpatch

[Hotpatching](../automanage/automanage-hotpatch.md?context=/azure/virtual-machines/context/context) is a new way to install updates on new Windows Server Azure Edition virtual machines (VMs) that doesn’t require a reboot after installation. Hotpatch for Windows Server Azure Edition VMs, has the following benefits:

- Lower workload impact with less reboots
- Faster deployment of updates as the packages are smaller, install faster, and have easier patch orchestration with Azure Update Manager
- Better protection, as the Hotpatch update packages are scoped to Windows security updates that install faster without rebooting


## Azure update management

You can use [Update Management in Azure Automation](../automation/update-management/overview.md?context=/azure/virtual-machines/context/context) to manage operating system updates for your Windows and Linux virtual machines in Azure, in on-premises environments, and in other cloud environments. You can quickly assess the status of available updates on all agent machines and manage the process of installing required updates for servers.

## Update Manager

[Update Manager](../update-center/overview.md) is a new-age unified service in Azure to manage and govern updates (Windows and Linux), both on-premises and other cloud platforms, across hybrid environments from a single dashboard. The new functionality provides native and out-of-the-box experience, granular access controls, flexibility to create schedules or take action now, ability to check updates automatically and much more. The enhanced functionality ensures that the administrators have visibility into the health of all systems in the environment. For more information, see [key benefits](../update-center/overview.md#key-benefits).

## Maintenance control

Manage platform updates, that don't require a reboot, using [maintenance control](maintenance-configurations.md). Azure frequently updates its infrastructure to improve reliability, performance, security or launch new features. Most updates are transparent to users. Some sensitive workloads, like gaming, media streaming, and financial transactions, can't tolerate even few seconds of a VM freezing or disconnecting for maintenance. Maintenance control gives you the option to wait on platform updates and apply them within a 35-day rolling window.

Maintenance control lets you decide when to apply updates to your isolated VMs and Azure dedicated hosts.

With [maintenance control](maintenance-configurations.md), you can:
- Batch updates into one update package.
- Wait up to 35 days to apply updates for Host machines.
- Automate platform updates by configuring a maintenance schedule or by using [Azure Functions](https://github.com/Azure/azure-docs-powershell-samples/tree/master/maintenance-auto-scheduler).
- Maintenance configurations work across subscriptions and resource groups.


## Scheduled events

Scheduled Events is an Azure Metadata Service that gives your application time to prepare for virtual machine (VM) maintenance. It provides information about upcoming maintenance events (for example, reboot) so that your application can prepare for them and limit disruption. It's available for all Azure Virtual Machines types, including PaaS and IaaS on both Windows and Linux.

For information on Scheduled Events, see [Scheduled Events for Windows VMs](./windows/scheduled-events.md) and [Scheduled Events for Linux](./linux/scheduled-events.md)

## Next steps

Review the [Availability and scale](availability.md) documentation for more ways to increase the uptime of your applications and services.

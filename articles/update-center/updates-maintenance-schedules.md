---
title: Updates and maintenance in Azure Update Manager
description: This article describes the updates and maintenance options available in Azure Update Manager.
ms.service: azure-update-manager
ms.date: 09/18/2023
ms.topic: conceptual
author: snehasudhirG
ms.author: sudhirsneha
---

# Update options and orchestration in Azure Update Manager

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

> [!IMPORTANT]
> - For a seamless scheduled patching experience, we recommend that for all Azure virtual machines (VMs), you update the patch orchestration to **Customer Managed Schedules**. If you fail to update the patch orchestration, you can experience a disruption in business continuity because the schedules fail to patch the VMs. For more information, see [Configure schedule patching on Azure VMs to ensure business continuity](prerequsite-for-schedule-patching.md).
> - For Azure Arc-enabled servers, the updates and maintenance options such as automatic VM guest patching in Azure, Windows automatic updates, and hot patching aren't supported.


This article provides an overview of the various update options and orchestration in Azure Update Manager.

## Update Options

### Automatic OS image upgrade

When you enable the [automatic OS image upgrades](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md) on your [Azure Virtual Machine Scale Set](../virtual-machine-scale-sets/overview.md), it helps ease Azure Update Manager to safely and automatically upgrade the OS disk for all instances in the scale set.

Automatic OS upgrade has the following characteristics:
- After you configure, the latest OS image published by the image publishers is automatically applied to the scale set without any user intervention.
- It upgrades batches of instances in a rolling manner every time a new image is published by the publisher.
- Integrates with application health probes and [Application Health extension](../virtual-machine-scale-sets/virtual-machine-scale-sets-health-extension.md).
- Works for all VM sizes, for both Windows and Linux images including the custom images through the [Azure Compute Gallery](../virtual-machines/shared-image-galleries.md).
- Flexibility to opt out of automatic upgrades at any time. (OS upgrades can be initiated manually as well).
- The OS Disk of a VM is replaced with the new OS Disk created with the latest image version. Configured extensions and custom data scripts are run while persisted data disks are retained.
- Supports Extension sequencing.
- You can enable on a scale set of any size.

> [!NOTE]
> We recommend that you check on the following:
> - Requirements before you enable automatic OS image upgrades
> - Supported OS images
> - Requirements to support custom images. [Learn more](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md)


### Automatic VM guest patching

When you enable [automatic VM guest patching](../virtual-machines/automatic-vm-guest-patching.md) on your Azure VMs, it helps ease Azure Update Manager to safely and automatically patch virtual machines to maintain security compliance.

Automatic VM guest patching has the following characteristics:
- Patches classified as *Critical* or *Security* are automatically downloaded and applied on the VM.
- Patches are applied during off-peak hours for IaaS VMs in the VM's time zone.
- Patches are applied during all hours for Azure Virtual Machine Scale Sets [VMSS Flexible orchestration](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md#scale-sets-with-flexible-orchestration).
- Patch orchestration is managed by Azure and patches are applied following [availability-first principles](../virtual-machines/automatic-vm-guest-patching.md#availability-first-updates).
- Virtual machine health, as determined through platform health signals, is monitored to detect patching failures.
-  You can monitor application health through the [Application Health Extension](../virtual-machine-scale-sets/virtual-machine-scale-sets-health-extension.md).
- It works for all VM sizes.

#### Enable VM property

To enable the VM property, follow these steps:

1. On the Azure Update Manager home page, go to **Update Settings**.
1. Select Patch Orchestration as **Azure Managed-Safe Deployment**.

> [!NOTE]
> We recommend the following:
> - Obtain an understanding how the Automatic VM guest patching works.
> - Check the requirements before you enable Automatic VM guest patching.
> - Check for supported OS images. [Learn more](../virtual-machines/automatic-vm-guest-patching.md)



## Hotpatching

[Hotpatching](https://learn.microsoft.com/windows-server/get-started/hotpatch?context=%2Fazure%2Fvirtual-machines%2Fcontext%2Fcontext) allows you to install OS security updates on supported *Windows Server Datacenter: Azure Edition* virtual machines that don't require a reboot after installation. It works by patching the in-memory code of running processes without the need to restart the process.

Following are the features of Hotpatching:

- Fewer binaries mean update install faster and consume less disk and CPU resources.
- Lower workload impact with fewer reboots.
- Better protection, as the hotpatch update packages are scoped to Windows security updates that install faster without rebooting.
- Reduces the time exposed to security risks and change windows, and easier patch orchestration with Azure Update Manager

:::image type="content" source="media/updates-maintenance/hot-patch-inline.png" alt-text="Screenshot that shows the Hotpatch option." lightbox="media/updates-maintenance/hot-patch-expanded.png":::

Hotpatching property is available as a setting in Azure Update Manager that you can enable by using Update settings flow. For more information, see [Hotpatch for virtual machines and supported platforms](https://learn.microsoft.com/windows-server/get-started/hotpatch).

## Automatic extension upgrade

[Automatic Extension Upgrade](../virtual-machines/automatic-extension-upgrade.md) is available for Azure VMs and [Azure Virtual Machine Scale Sets](../virtual-machine-scale-sets/overview.md). When Automatic Extension Upgrade is enabled on a VM or scale set, the extension is upgraded automatically whenever the extension publisher releases a new version for that extension.

Automatic Extension Upgrade has the following features:

- It's supported for Azure VMs and Azure Virtual Machine Scale Sets.
- Upgrades are applied on an [availability-first-deployment-model](../virtual-machines/automatic-extension-upgrade.md#availability-first-updates).
- For a Virtual Machine Scale Set, no more than 20% of the scale set virtual machines will be upgraded in a single batch. The minimum batch size is one virtual machine.
- Works for all VM sizes and for both Windows and Linux extensions.
- Enabled on a Virtual Machine Scale Sets of any size.
- Each supported extension is enrolled individually, and you can choose the extensions to upgrade automatically.
- Supported in all public cloud regions. For more information, see [supported extensions and Automatic Extension upgrade](../virtual-machines/automatic-extension-upgrade.md#availability-first-updates)
 
 ### Windows automatic updates
This mode of patching allows operating system to automatically install updates on Windows VMs as soon as they're available. It uses the VM property that is enabled by setting the patch orchestration to OS orchestrated/Automatic by OS.

> [!NOTE]
> - Windows automatic updates is not an Azure Update Manager setting but a Windows level setting.
> - Azure Update Manager doesn't support [In-place upgrade for VMs running Windows Server in Azure](../virtual-machines/windows-in-place-upgrade.md).

## Update or Patch orchestration

Azure Update Manager provides the flexibility to either install updates immediately or schedule updates within a defined maintenance window. These settings allow you to orchestrate patching for your virtual machine.

### Update Now/One-time update

Azure Update Manager allows you to secure your machines immediately by installing updates on demand. To perform the on-demand updates, see [Check and install one time updates](deploy-updates.md#install-updates-on-a-single-vm)


### Scheduled patching

You can create a schedule for a daily, weekly or hourly cadence as per your requirement, specify the machines that must be updated as part of the schedule, and the updates that you must install. The schedule will then automatically install the updates as per the specifications.

Azure Update Manager uses maintenance control schedule instead of creating its own schedules. Maintenance control enables customers to manage platform updates. For more information, see the [Maintenance control](../virtual-machines/maintenance-configurations.md). 

Use [scheduled patching](scheduled-patching.md) to create and save recurring deployment schedules.

> [!NOTE]
> Patch orchestration property for Azure machines should be set to **Customer Managed Schedules** as it is a prerequisite for scheduled patching. For more information, see the [list of prerequisites](scheduled-patching.md#prerequisites-for-scheduled-patching).

> [!IMPORTANT]
> - For a seamless scheduled patching experience, we recommend that for all Azure VMs, you must update the patch orchestration to **Customer Managed Schedules**. If you fail to update the patch orchestration, you can experience a disruption in business continuity because the schedules will fail to patch the VMs. [Learn more](prerequsite-for-schedule-patching.md).
> - For Arc-enabled servers, the updates and maintenance options such as Automatic VM Guest patching in Azure, Windows automatic updates and Hotpatching aren't supported.
 
 
## Next steps

* To view update assessment and deployment logs generated by Update Manager, see [Query logs](query-logs.md).
* To troubleshoot Azure Update Manager issues, see [Troubleshoot issues](troubleshoot.md).

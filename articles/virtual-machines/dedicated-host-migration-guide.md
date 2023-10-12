---
title: Azure Dedicated Host SKU Retirement Migration Guide
description: Walkthrough on how to migrate a retiring Dedicated Host SKU
author: mattmcinnes
ms.author: mattmcinnes
ms.reviewer: vamckMS
ms.service: azure-dedicated-host
ms.topic: how-to
ms.date: 07/12/2023
---

# Azure Dedicated Host SKU Retirement Migration Guide

As hardware ages, it must be retired and workloads must be migrated to newer, faster, and more efficient Azure Dedicated Host SKUs. The legacy Dedicated Host SKUs should be migrated to newer Dedicated Host SKUs. 
The main differences between the retiring Dedicated Host SKUs and the newly recommended Dedicated Host SKUs are:

- Newer, more efficient processors
- Increased RAM
- Increased available vCPUs
- Greater regional capacity compared to the retiring Dedicated Host SKUs

Review the [FAQs](dedicated-host-retirement.md#faqs) before you get started on migration. The next section will go over which Dedicated Host SKUs to migrate to help aid in migration planning and execution.

## Host SKUs being retired

Some Azure Dedicated Host SKUs will be retired soon. Refer to the [Azure Dedicated Host SKU Retirement](dedicated-host-retirement.md#faqs) documentation to learn more.

### Dsv3-Type1 and Dsv3-Type2

The Dsv3-Type1 and Dsv3-Type2 run Dsv3-series VMs, which offer a combination of vCPU, memory, and temporary storage best suited for most general-purpose workloads. 
We recommend migrating your existing VMs to one of the following Dedicated Host SKUs:

- Dsv3-Type3
- Dsv3-Type4

Note that both the Dsv3-Type3 and Dsv3-Type4 won't be impacted by the 31 March 2023 retirement date. We recommend moving to either the Dsv3-Type3 or Dsv3-Type4 based on regional availability, pricing, and your organization’s needs.  

### Esv3-Type1 and Esv3-Type2

The Esv3-Type1 and Esv3-Type2 run Esv3-series VMs, which offer a combination of vCPU, memory, and temporary storage best suited for most memory-intensive workloads. 
We recommend migrating your existing VMs to one of the following Dedicated Host SKUs:

- Esv3-Type3
- Esv3-Type4

Note that both the Esv3-Type3 and Esv3-Type4 won't be impacted by the 31 March 2023 retirement date. We recommend moving to either the Esv3-Type3 or Esv3-Type4 based on regional availability, pricing, and your organization’s needs.

## Migrating to supported hosts

To migrate your workloads and avoid Dedicated Host SKU retirement, follow the directions for your migration method of choice.

### Automatic migration (Resize)

[!INCLUDE [dedicated-hosts-resize](includes/dedicated-hosts-resize.md)]

### Manual migration

This includes steps for manually placed VMs, automatically placed VMs, and virtual machine scale sets on your Dedicated Hosts:

#### [Manually Placed VMs](#tab/manualVM)

1.	Choose a target Dedicated Host SKU to migrate to. 
2.	Ensure you have quota for the VM family associated with the target Dedicated Host SKU in your given region.
3.	Provision a new Dedicated Host of the target Dedicated Host SKU in the same Host Group.
4.	Stop and deallocate the VM(s) on your old Dedicated Host.
5.	Reassign the VM(s) to the target Dedicated Host.
6.	Start the VM(s).
7.  Delete the old host.

#### [Automatically Placed VMs](#tab/autoVM)

1.	Choose a target Dedicated Host SKU to migrate to. 
2.	Ensure you have quota for the VM family associated with the target Dedicated Host SKU in your given region.
3.	Provision a new Dedicated Host of the target Dedicated Host SKU in the same Host Group.
4.	Stop and deallocate the VM(s) on your old Dedicated Host.
5.  Delete the old Dedicated Host.
6.	Start the VM(s).

#### [Virtual Machine Scale Sets](#tab/VMSS)

1.	Choose a target Dedicated Host SKU to migrate to. 
2.	Ensure you have quota for the VM family associated with the target Dedicated Host SKU in your given region.
3.	Provision a new Dedicated Host of the target Dedicated Host SKU in the same Host Group.
4.	Stop the virtual machine scale set on your old Dedicated Host.
5.  Delete the old Dedicated Host.
6.	Start the virtual machine scale set.

---

More detailed instructions can be found in the following sections.

> [!NOTE]
>  **Certain sections are different for automatically placed VMs or virtual machine scale set**. These differences will explicitly be called out in the respective steps.

#### Ensure quota for the target VM family

Be sure that you have enough vCPU quota for the VM family of the Dedicated Host SKU that you'll be using. If you need quota, follow this guide to [request an increase in vCPU quota](../azure-portal/supportability/per-vm-quota-requests.md) for your target VM family in your target region. Select the Dsv3-series or Esv3-series as the VM family, depending on the target Dedicated Host SKU.

#### Create a new Dedicated Host

Within the same Host Group as the existing Dedicated Host, [create a Dedicated Host](dedicated-hosts-how-to.md#create-a-dedicated-host) of the target Dedicated Host SKU.

#### Stop the VM(s) or virtual machine scale set

##### [PowerShell](#tab/PS)

Refer to the PowerShell documentation to [stop a VM through PowerShell](/powershell/module/servicemanagement/azure/stop-azurevm) or [stop a virtual machine scale set through PowerShell](/powershell/module/az.compute/stop-azvmss).

##### [CLI](#tab/CLI)

Refer to the Command Line Interface (CLI) documentation to [stop a VM through CLI](/cli/azure/vm#az-vm-stop) or [stop a virtual machine scale set through CLI](/cli/azure/vmss#az-vmss-stop).

##### [Portal](#tab/Portal)

On Azure portal, go through the following steps:

1.	Navigate to your VM or virtual machine scale set.
2.	On the top navigation bar, click “Stop”.

---

#### Reassign the VM(s) to the target Dedicated Host

>[!NOTE] 
> **Skip this step for automatically placed VMs and virtual machine scale set.** 

Once the target Dedicated Host has been created and the VM has been stopped, [reassign the VM to the target Dedicated Host](dedicated-hosts-how-to.md#add-an-existing-vm).

#### Start the VM(s) or virtual machine scale set

>[!NOTE]
>**Automatically placed VM(s) and virtual machine scale set require that you delete the old host _before_ starting the autoplaced VM(s) or virtual machine scale set.**

##### [PowerShell](#tab/PS)
Refer to the PowerShell documentation to [start a VM through PowerShell](/powershell/module/servicemanagement/azure/start-azurevm) or [start a virtual machine scale set through PowerShell](/powershell/module/az.compute/start-azvmss).

##### [CLI](#tab/CLI)

Refer to the Command Line Interface (CLI) documentation to [start a VM through CLI](/cli/azure/vm#az-vm-start) or [start a virtual machine scale set through CLI](/cli/azure/vmss#az-vmss-start).

##### [Portal](#tab/Portal)

On Azure portal, go through the following steps:

1.	Navigate to your VM or virtual machine scale set.
2.	On the top navigation bar, click “Start”.

---

#### Delete the old Dedicated Host

Once all VMs have been migrated from your old Dedicated Host to the target Dedicated Host, [delete the old Dedicated Host](dedicated-hosts-how-to.md#deleting-a-host).

## Help and support

If you have questions, ask community experts in [Microsoft Q&A](/answers/topics/azure-dedicated-host.html).

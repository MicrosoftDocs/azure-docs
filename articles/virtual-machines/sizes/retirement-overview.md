---
title: Previous-gen and retired VM sizes
description: Overview of the retirement process for virtual machine sizes and information on previous-gen sizes.
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: overview
ms.date: 02/02/2024
ms.author: mattmcinnes
ms.reviewer: iamwilliew
---

# Previous-gen and retired VM sizes

Azure virtual machine sizes are the amount of resources allocated to a virtual machine in the cloud. These resources are a portion of the physical server’s hardware capabilities. A *size series* is a collection of all sizes that are available within a single physical server’s hardware capabilities. As a size series' physical hardware ages and newer components are released, Microsoft will stop deploying more of previously established series' hardware. Once users have migrated off of said hardware or the hardware becomes sufficiently outdated, it is retired to make room for new infrastructure.

![A diagram showing a greyed out Azure VM icon with an arrow pointing to a new sparkling Azure VM icon.](./media/size-retirement-new-vm.png "Moving from old to new VM sizes")

When hardware becomes previous-gen or begins the retirement process, it's recommended to migrate workloads to newer generation hardware that provides better performance and future scalability. This helps you to avoid any potential issues that may arise from using outdated hardware. By keeping your hardware up-to-date, you can ensure that your workloads are running smoothly and efficiently.

This article describes the states of older hardware and the processes behind these states.

## Previous-gen sizes

Previous generation size series **are not currently retired** and can still be used. These sizes are still fully supported, but they aren't guaranteed to receive more capacity. It's recommended to migrate to the latest generation replacements as soon as possible, especially when trying to scale up your installations. 

There are two types of previous-gen sizes; *next-gen available* and *capacity constrained*.

### Next-gen available 

Size series listed as *next-gen available* means that while no retirement or capacity constraint plans have been made, there are sufficient deployments of newer alternative sizes to justify considering these series "previous-gen". *Next-gen available* series have no formal announcement of retirement timelines, but they will eventually be retired. 

For a list of series that are considered *next-gen available*, see the [list of previous-gen sizes](./previous-gen-sizes-list.md).

### Capacity constrained

Size series listed as *capacity constrained* means that while no retirement plans have been made, no additional capacity for this series will be deployed. If you had one VM running on a size in this series and wanted to spin up another, there is no guarantee that capacity would be available to fufill this request. Any new VMs should be created using sizes in newer series which are not considered "previous-gen".

For a list of sizes that are considered *capacity constrained*, see the [list of previous-gen sizes](./previous-gen-sizes-list.md). 

## Retired sizes

Retired size series are **no longer available** and can't be used. If you have VMs running on sizes which are considered *retired*, migrate to a newer next-gen size as soon as possible. 

Retiring hardware is necessary over time to ensure that the latest and greatest technology is available on Azure. This ensures that the hardware is reliable, secure, and efficient. It also allows for the latest features and capabilities that may not be present on previous generations of hardware.

For a list of retired sizes, see the [list of retired sizes](./retired-sizes-list.md).

## Migrate to newer sizes

Migrating to newer sizes allows you to keep up with the latest hardware available on Azure. You can [resize your VM](./resize-vm.md) to a newer size using the Azure portal, Azure PowerShell, Azure CLI, or Terraform.

## Next steps
- For more information on VM sizes, see [Sizes for virtual machines in Azure](../sizes.md).
- For a list of retired sizes, see [Retired Azure VM sizes](./retired-sizes-list.md).
- For a list of previous-gen sizes, see [Previous generation Azure VM sizes](./previous-gen-sizes-list.md).

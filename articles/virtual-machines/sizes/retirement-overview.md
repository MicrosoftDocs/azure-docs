---
title: Previous-gen and retired VM sizes
description: Overview of the retirement process for virtual machine sizes and information on previous-gen sizes.
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: overview
ms.date: 01/31/2024
ms.author: mattmcinnes
ms.reviewer: iamwilliew
---

# Previous-gen and retired VM sizes

 This process requires that previously established VM sizes are moved to "previous-gen" status, then eventually retired and made unavailable. This article provides an overview of the retirement of virtual machine sizes and explains the reasoning behind this process.

![A diagram showing a greyed out Azure VM icon with an arrow pointing to a new sparkling Azure VM icon.](./media/size-retirement-new-vm.png "Moving from old to new VM sizes")

When hardware begins the retirement process, it is recommended to migrate workloads to newer generation hardware that provides better performance and reliability. This will help you to avoid any potential issues that may arise from using outdated hardware. By keeping your hardware up-to-date, you can ensure that your workloads are running smoothly and efficiently.

## Previous-gen sizes

Previous generation sizes **are not currently retired** and can still be used. These sizes are still fully supported, but they will not receive additional capacity. It is recommended to migrate to the latest generation replacements as soon as possible. For a list of sizes which are considered "previous-gen", see the [list of previous-gen sizes](./previous-gen-sizes-list.md). 

## Retired sizes

Retiring hardware is necessary over time to ensure that the latest and greatest technology is available on Azure. This ensures that the hardware is reliable, secure, and efficient. It also allows for the latest features and capabilities which may not be present on previous generations of hardware.

Retired sizes are **no longer available** and can't be used. For a list of retired sizes, see the [list of retired sizes](./retired-sizes-list.md).

## Migrate to newer sizes

Migrating to newer sizes allows you to keep up with the latest hardware available on Azure. You can [resize your VM](./resize-vm.md) to a newer size using the Azure portal, Azure PowerShell, Azure CLI, or Terraform.

## Next steps
- For more information on VM sizes, see [Sizes for virtual machines in Azure](../sizes.md).
- For a list of retired sizes, see [Retired Azure VM sizes](./retired-sizes-list.md).
- For a list of previous-gen sizes, see [Previous generation Azure VM sizes](./previous-gen-sizes-list.md).
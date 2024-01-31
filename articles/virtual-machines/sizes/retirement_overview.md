---
title: VM Size retirement overview
description: Overview of the retirement of virtual machine sizes and explaination of reasoning behind retirement.
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: overview
ms.date: 01/30/2024
ms.author: mattmcinnes
ms.reviewer: iamwilliew
---

# VM Size retirement overview

Retiring hardware is necessary over time to ensure that the latest and greatest technology is being used. This ensures that the hardware is reliable, secure, and efficient. It also allows for the latest features and capabilities to be used by customers. 

When hardware is retired, it is recommended to migrate your workloads to newer generation hardware that provides better performance and reliability. This will help you to avoid any potential issues that may arise from using outdated hardware. By keeping your hardware up-to-date, you can ensure that your workloads are running smoothly and efficiently.

## Previous-gen sizes
Previous generation sizes **are not currently retired** and can still be used. These sizes will eventually be retired, so it is still recommended to migrate to the latest generation replacements as soon as possible. For a list of sizes which are considered "previous-gen", see the [list of previous-gen sizes](./previous_gen_sizes_list.md). 

## Migrate to newer sizes by resizing your VM

Migrating to newer sizes is a simple process. You can resize your VM to a newer size using the Azure portal, Azure PowerShell, or the Azure CLI.

![INCLUDE](./resize-vm.md)

## Next steps
- For a list of retired sizes, see [Retired Azure VM sizes](./retired_sizes_list.md).
- For a list of previous-gen sizes, see [Previous generation Azure VM sizes](./previous_gen_sizes_list.md).
- For more information on VM sizes, see [Sizes for virtual machines in Azure](../sizes.md).
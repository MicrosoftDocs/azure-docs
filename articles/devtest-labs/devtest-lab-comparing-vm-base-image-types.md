---
title: Compare custom images and formulas
description: Explore the differences between custom images and formulas as virtual machine (VM) bases so you can decide which one best suits your environment.
ms.topic: concept-article
ms.author: rosemalcolm
author: RoseHJM
ms.date: 12/15/2025
ms.custom: UpdateFrequency2

#customer intent: As a developer, I want to know the differences between custom images and formulas as VM bases so I can choose the best approach for my environment.
---

# Compare DevTest Labs custom images and formulas

This article explores the pros and cons of using [custom images](devtest-lab-create-template.md) versus [formulas](devtest-lab-manage-formulas.md) as bases for creating new lab virtual machines (VMs) in Azure DevTest Labs. The key distinction between a custom image and a formula is that a custom image is simply an image based on a virtual hard drive (VHD), whereas a formula also includes preconfigured settings.

Preconfigured settings can include VM size, virtual network, subnet, and artifacts. These settings are created with default values that you can override when you create the VM.

## Custom images

Custom images are a static, immutable way to create VMs. All VMs created from a single custom image are identical.

VM provisioning from a custom image is fast. The custom image is just an image without settings, so there are no settings to apply.

A drawback of custom images is that to update an aspect of the custom image, you must recreate the image.

## Formulas

Formulas provide a dynamic way to create VMs with the configuration and settings you want. Formulas can capture environment changes on the fly by using artifacts.

For example, you can use a formula to create a VM that has the latest bits from your release pipeline, or that enlists the VM with the latest code from your repository. Along with the target base image, the formula specifies an artifact that deploys the bits or enlists the code repository.

When you use the formula to create VMs, the latest bits or code are deployed or enlisted to the VM. For more information about using artifacts for VMs, see [Create custom artifacts for DevTest Labs](devtest-lab-artifact-author.md).

Formulas can also define default settings that custom images can't specify, such as VM sizes and virtual network settings. The settings are saved in the formula as default values, which you can change when you create the VM. Because of the added configuration, creating a VM from a formula can take longer than creating a VM from a custom image.

## Related content

- [Create lab VMs in Azure DevTest Labs](devtest-lab-add-vm.md)
- [Create a custom image from a VM](devtest-lab-create-custom-image-from-vm-using-portal.md)
- [Manage Azure DevTest Labs formulas](devtest-lab-manage-formulas.md)

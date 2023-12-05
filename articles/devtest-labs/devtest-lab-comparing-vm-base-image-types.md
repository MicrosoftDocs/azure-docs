---
title: Comparing custom images and formulas
description: Learn about the differences between custom images and formulas as VM bases so you can decide which one best suits your environment.
ms.topic: conceptual
ms.author: rosemalcolm
author: RoseHJM
ms.date: 08/26/2021
ms.custom: UpdateFrequency2
---

# Compare custom images and formulas in DevTest Labs
Both [custom images](devtest-lab-create-template.md) and [formulas](devtest-lab-manage-formulas.md) can be used as bases for [creating new lab virtual machines (VMs)](devtest-lab-add-vm.md). The key distinction between custom images and formulas is that a custom image is simply an image based on a virtual hard drive (VHD). A formula is
an image based on a VHD plus preconfigured settings. Preconfigured settings can include VM size, virtual network, subnet, and artifacts. These preconfigured settings are set up with default values that you can override at the time of VM creation. 

In this article, you'll learn the pros and cons of using custom images versus using formulas.  You can also read [How to create a custom image from a VM](devtest-lab-create-custom-image-from-vm-using-portal.md) and  [Compare custom images and formulas in DevTest Labs](devtest-lab-comparing-vm-base-image-types.md).

## Custom image benefits
Custom images provide a static, immutable way to create VMs from the environment you want. 

|Pros|Cons|
|----|----|
|<li>VM provisioning from a custom image is fast, as nothing changes after the VM is spun up from the image. In other words, there are no settings to apply, as the custom image is just an image without settings. <li>VMs created from a single custom image are identical.|<li>If you need to update some aspect of the custom image, you must recreate the image. |

## Formula benefits
  
Formulas provide a dynamic way to create VMs from the configuration and settings you want.

|Pros|Cons|
|----|----|
|<li>Changes in the environment can be captured on the fly via artifacts. For example, if you want a VM installed with the latest bits from your release pipeline or to enlist the latest code from your repository, use a formula. The formula can specify an artifact that deploys the latest bits or enlists the latest code, together with the target base image. Whenever this formula is used to create VMs, the latest bits or code are deployed or enlisted to the VM.  <li>Formulas can define default settings that custom images can't provide, such as VM sizes and virtual network settings.  <li>The settings saved in a formula are shown as default values, but can be modified when the VM is created. |<li> Creating a VM from a formula can take more time than creating a VM from a custom image.

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

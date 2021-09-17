---
title: Comparing custom images and formulas
description: Learn about the differences between custom images and formulas as VM bases so you can decide which one best suits your environment.
ms.topic: conceptual
ms.date: 08/26/2021
---

# Compare custom images and formulas in DevTest Labs
Both [custom images](devtest-lab-create-template.md) and [formulas](devtest-lab-manage-formulas.md) can be used as bases for [created new VMs](devtest-lab-add-vm.md).  The key distinction between custom images and formulas is that a custom image is simply an image based on a VHD, while a formula is 
an image based on a VHD *in addition to* preconfigured settings - such as VM Size, virtual network, subnet, and artifacts. These preconfigured settings are set up with default values that can be overridden at the time of VM creation. 

In this article, you'll learn the pros & cons to using custom images versus using formulas.  You can also read the [How to create a custom image from a VM](devtest-lab-create-custom-image-from-vm-using-portal.md)" and the "[FAQ](devtest-lab-faq.yml)".

## Custom image benefits
Custom images provide a static, immutable way to create VMs from a desired environment. 

|Pros|Cons|
|----|----|
|<li>VM provisioning from a custom image is fast as nothing changes after the VM is spun up from the image. In other words, there are no settings to apply as the custom image is just an image without settings. <li>VMs created from a single custom image are identical.|<li>If you need to update some aspect of the custom image, the image must be recreated. |

## Formula benefits
  
Formulas provide a dynamic way to create VMs from the desired configuration/settings.

|Pros|Cons|
|----|----|
|<li>Changes in the environment can be captured on the fly via artifacts. For example, if you want a VM installed with the latest bits from your release pipeline or enlist the latest code from your repository, you can simply specify an artifact that deploys the latest bits or enlists the latest code in the formula together with <li>target base image. Whenever this formula is used to create VMs, the latest bits/code are deployed/enlisted to the VM.  <li>Formulas can define default settings that custom images cannot provide - such as VM sizes and virtual network settings.  <li>The settings saved in a formula are shown as default values, but can be modified when the VM is created. |<li> Creating a VM from a formula can take more time than creating a VM from a custom image.

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

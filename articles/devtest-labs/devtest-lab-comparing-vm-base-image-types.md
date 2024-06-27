---
title: Compare custom images and formulas
titleSuffix: Azure DevTest Labs
description: Explore the differences between custom images and formulas as virtual machine (VM) bases so you can decide which one best suits your environment.
ms.topic: concept-article
ms.author: rosemalcolm
author: RoseHJM
ms.date: 05/26/2024
ms.custom: UpdateFrequency2

#customer intent: As a developer, I want to know the differences between custom images and formulas as VM bases so I can choose the best approach for my environment.
---

# Compare custom images and formulas in Azure DevTest Labs

In Azure DevTest Labs, both [custom images](devtest-lab-create-template.md) and [formulas](devtest-lab-manage-formulas.md) can be used as bases for [creating new lab virtual machines (VMs)](devtest-lab-add-vm.md). The key distinction between custom images and formulas is that a custom image is simply an image based on a virtual hard drive (VHD). A formula is an image based on a VHD that also includes preconfigured settings. These settings can include VM size, virtual network, subnet, and artifacts. Preconfigured settings are set up with default values that you can override when you create the VM. 

In this article, you learn the pros and cons of using custom images versus formulas. You can also read [Create a custom image from a VM](devtest-lab-create-custom-image-from-vm-using-portal.md) and [Create a formula from a VM](devtest-lab-manage-formulas.md#create-formula-from-existing-vm) for more details.

## Custom image benefits

Custom images provide a static, immutable way to create VMs from the environment you want. 

|Pros|Cons|
|----|----|
| VM provisioning from a custom image is fast. Nothing changes after you create a VM from an image. <br><br> There are no settings to apply. The custom image is just an image without settings. <br><br> VMs created from a single custom image are identical. | To update an aspect of the custom image, you must recreate the image. |

## Formula benefits
  
Formulas provide a dynamic way to create VMs from the configuration and settings you want.

|Pros|Cons|
|----|----|
| Changes in the environment can be captured on the fly by using artifacts. You can use a formula to create a VM installed with the latest bits from your release pipeline. A formula also works when you want to enlist the VM with the latest code from your repository. The formula can specify an artifact that deploys the latest bits or enlists the latest code, together with the target base image. Whenever you use this formula to create VMs, the latest bits or code are deployed or enlisted to the VM. <br><br> Formulas can define default settings that custom images can't provide, such as VM sizes and virtual network settings. <br><br> The settings saved in a formula are shown as default values. You can change these values when you create the VM. | Creating a VM from a formula can take more time than creating a VM from a custom image. |

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

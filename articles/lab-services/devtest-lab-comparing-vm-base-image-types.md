---
title: Comparing custom images and formulas in DevTest Labs | Microsoft Docs
description: Learn about the differences between custom images and formulas as VM bases so you can decide which one best suits your environment.
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila
editor: ''

ms.assetid: a3cb259a-7d80-40ec-8ee8-45105704d589
ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/05/2018
ms.author: spelluru
---
# Comparing custom images and formulas in DevTest Labs
Both [custom images](devtest-lab-create-template.md) and [formulas](devtest-lab-manage-formulas.md) 
can be used as bases for [created new VMs](devtest-lab-add-vm.md). 
However, the key distinction between custom images and formulas is that 
a custom image is simply an image based on a VHD, while a formula is 
an image based on a VHD *in addition to* preconfigured settings - such as 
VM Size, virtual network, subnet, and artifacts. These preconfigured settings are set up with default values that can be overridden
at the time of VM creation. This article explains some of the advantages (pros) and 
disadvantages (cons) to using custom images versus using formulas.

## Custom image pros and cons
Custom images provide a static, immutable way to create VMs from a desired environment. 

**Pros**

* VM provisioning from a custom image is fast as nothing changes after the VM is spun up from the image. In other words, there are no settings to apply as the custom image is just an image without settings. 
* VMs created from a single custom image are identical.

**Cons**

* If you need to update some aspect of the custom image, the image must be recreated.  

## Formula pros and cons
Formulas provide a dynamic way to create VMs from the desired configuration/settings.

**Pros**

* Changes in the environment can be captured on the fly via artifacts. For example, if you want a VM installed with the latest bits from your release pipeline or enlist the latest code from your repository, you can simply specify an artifact that deploys the latest bits or enlists the latest code in the formula together with a target base image. Whenever this formula is used to create VMs, the latest bits/code are deployed/enlisted to the VM. 
* Formulas can define default settings that custom images cannot provide - such as VM sizes and virtual network settings. 
* The settings saved in a formula are shown as default values, but can be modified when the VM is created. 

**Cons**

* Creating a VM from a formula can take more time than creating a VM from a custom image.

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Related blog posts
* [Custom images or formulas?](https://blogs.msdn.microsoft.com/devtestlab/2016/04/06/custom-images-or-formulas/)

## Next steps
- [DevTest Labs FAQ](devtest-lab-faq.md)
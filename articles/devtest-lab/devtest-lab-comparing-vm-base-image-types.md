<properties
	pageTitle="Comparing Custom Images and Formulas in DevTest Labs | Microsoft Azure"
	description="Learn about the differences between Custom Images and Formulas as VM bases so you can decide which one best suits your environment."
	services="devtest-lab,virtual-machines"
	documentationCenter="na"
	authors="tomarcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="devtest-lab"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/22/2016"
	ms.author="tarcher"/>

# Comparing Custom Images and Formulas in DevTest Labs

## Overview
Both [Custom Images](./devtest-lab-create-template.md) and [Formulas](./devtest-lab-manage-formulas.md) 
can be used as bases for [created new VMs](./devtest-lab-add-vm-with-artifacts.md). 
However, the key distinction between Custom Images and Formulas is that 
a Custom Image is simply an image based on a VHD, while a Formula is 
an image based on a VHD *in addition to* preconfigured settings - such as 
VM Size, virtual network and subnet, artifacts, 
and so on. These preconfigured settings are set up with default values that can be overridden
at the time of VM creation. This article explains some of the advantages (pros) and 
disadvantages (cons) to using Custom Images versus using Formulas.
 
## Custom Images pros and cons
Custom Images provide a a static, immutable way to create VMs from a desired environment. 

**Pros**
- VM provisioning from a Custom Image is fast as nothing changes after the VM is spun up from the image. In other words, there are no settings to apply as the Custom Image is simply an image without settings. 
- VMs created from a single Custom Image are identical.

**Cons**
- If you need to update some aspect of the Custom Image, the image must be recreated.  

## Formula pros and cons
Formulas provide a dynamic way to create VMs from the desired configuration/settings.

**Pros**
- Changes in the environment can be captured on the fly via artifacts. For example, if you want a VM installed with the latest bits from your release pipeline or enlist the latest code from your repository, you can simply specify an artifact that deploys the latest bits or enlists the latest code in the Formula together with a target base image. Whenever this formula is used to create VMs, the latest bits/code are deployed/enlisted to the VM. 
- Formulas can define default settings that custom images cannot provide - such as VM sizes and virtual network settings. 
- The settings saved in a Formula are shown as default values, but can be modified when the VM is created. 

**Cons**
- Creating a VM from a Formula can take more time than creating a VM from a Custom Image.
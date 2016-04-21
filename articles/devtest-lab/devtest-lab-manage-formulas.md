<properties
	pageTitle="Manage DevTest Labs Formulas to create VMs | Microsoft Azure"
	description="Learn how to create, update, and remove DevTest Labs formulas, and use them to create new VMs."
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
	ms.date="04/21/2016"
	ms.author="tarcher"/>

# Manage DevTest Labs Formulas to create VMs

## Overview

Formulas - like [Custom Images](./devtest-lab-create-template.md) and [Marketplace Images](./devtest-lab-configure-marketplace-images.md) -
provide a mechanism for fast VM provisioning. A Formula in DevTest Labs is a list of default property values used to create a lab VM. When creating a VM
from a Formula, the default values can be used as-is, or modified. 

In this article, you'll learn how to perform the following tasks:

- [Create a new Formula](#create-a-new-formula)
- [Use a Formula to create a new VM](#use-a-formula-to-create-a-new-vm)
- [Modify a Formula](#modify-a-formula)
- [Remove a Formula](#remove-a-formula)

> [AZURE.NOTE] Formulas are similar to [Custom Images](./devtest-lab-create-template.md) in that 
each allows you to create a base image from a VHD that is used to provision a VM. To help decide which is right
for your particular environment, refer to the article,
[Comparing VM base image types](./devtest-lab-comparing-vm-base-image-types.md).

## Create a new Formula
Anyone with DevTest Labs *Users* permissions is able to create VMs in a lab using a Formula as a base. 
There are two ways to create formulas: 

- From scratch - Use when you know which VM creation settings to be defined.
- From an existing lab VM - Use when you want to use an existing VM as the starting point for your Formula.

### Create a new Formula from scratch
The following steps guide you through the process of creating a new Formula from scratch.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Tap **Browse**, and then tap **DevTest Labs** from the list.

1. From the list of labs, tap the desired lab.  

1. The selected lab's **Settings** blade will be displayed. 

1. On the lab **Settings** blade, tap **Formulas**.

    ![Formula menu](./media/devtest-lab-manage-formulas/lab-settings-formulas.png)

1. On the **Lab formulas** blade, tap **+ Add**.

    ![Add a new formula](./media/devtest-lab-manage-formulas/add-formula.png)

1. On the **Choose a base** blade, tap the Custom Image or Marketplace Image from which you want to create the Formula.

    ![Base list](./media/devtest-lab-manage-formulas/base-list.png)

1. On the **Create formula** blade, specify the following values:

	- **Formula name** - Enter a name for your Formula. This value will be displayed in the list of base images when you create a VM. The name is validated as you type it, and if not valid, a message will indicate the requirements for a valid name.
	- **Description** - Enter a meaningful description for your Formula. This value is available from the Formula's context menu when you create a VM.
	- **Image** - This is a read-only field displaying the base image you selected on the previous blade.
	- Tap **VM Size** and select one of the predefined items that specify the processor cores, RAM size, and the hard drive size of the VM to create.
	- **Virtual network** - Tap and select the desired virtual network.
	- **Subnet** Tap and and select the desired subnet.
	- **Public IP address** - If the lab policy is set to allow public IP addresses for the selected subnet, specify whether or not you want the IP address to be public by selecting either **Yes** or **No**. Otherwise, this option is disabled and selected as **No**.
	- **Artifacts** - Tap and, from the list of artifacts, select and configure the artifacts that you want to add to the base image. 

    	![Create formula](./media/devtest-lab-manage-formulas/create-formula.png)

1. Tap **Create** to create the Formula. When the portal has created the Formula, it will be listed on the **Lab formulas** blade.

	![Newly created formula](./media/devtest-lab-manage-formulas/newly-created-formula.png)

### Create a new Formula from a lab VM

## Use a Formula to create a new VM

## Modify a Formula

## Remove a Formula 

## Next steps
Create VM
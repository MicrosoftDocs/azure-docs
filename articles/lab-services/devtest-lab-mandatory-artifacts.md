---
title: Specify mandatory artifacts for your Azure DevTest Labs | Microsoft Docs
description: Learn how to specify mandatory artifacts that need to installed prior to installing any user-selected artifacts on virtual machines (VMs) in the lab. 
services: devtest-lab,virtual-machines
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.assetid: 32dcdc61-ec23-4a01-b731-78c029ea5316
ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/23/2018
ms.author: spelluru

---
# Specify mandatory artifacts for your lab in Azure DevTest Labs
As a lab owner, you can set a list of mandatory artifacts that are applied on every machine created within your lab.

Imagine a scenario where you want each machine in your lab to be connected to your corporate network. In this case, each lab user would have to add a domain join artifact during virtual machine creation to make sure their machine is connected to the corporate domain. In other words, lab users would essentially have to re-create a machine in case they forget to apply mandatory artifacts on their machine. Mandatory artifacts saves your lab users the effort of adding such artifacts on a lab machine.  
 
As a lab owner you make the domain join artifact as a mandatory artifact in your lab. This step makes sure that each machine is connected to the corporate network and saving the time and effort for your lab users. Other mandatory artifacts could include a common tool that your team uses, a platform related security pack that each machine needs to have by default etc. In short, any common software that every machine in your lab needs to have can become a mandatory artifact. If you create a custom image from a machine that has mandatory artifacts applied on it and then create a fresh machine from that image, the set of mandatory artifacts are reapplied on the machine during creation. This behavior also means that even though the custom image is old, every time you create a machine from it the most updated version of mandatory artifacts are applied on it during the creation flow. 
 
Only artifacts that have no parameters are supported as mandatory ones. This resonates with our aim of not having the lab user to enter additional parameters during lab creation and thus making the process of VM creation a simple one. 


## Specify mandatory artifacts
You can select mandatory artifacts for Windows and Linux machines separately. You can also reorder these artifacts depending on the order in which you would like them to applied. 


1. Select **Configuration and policies** under **SETTINGS**. 
2. Select **Mandatory artifacts** under **EXTERNAL RESOURCES**. 
3. Select **Edit**,  
To configure mandatory artifacts for your lab, you can find the 'Mandatory artifacts' option under 'External Resources in 'Configuration and policies'.  



## Create a VM 
Now, as a lab user you can view the list of mandatory artifacts during the virtual machine creation flow. This is aimed at helping you make an informed decision on the artifacts you would like to apply on top of the mandatory ones. Note that you will not be able to edit or delete mandatory artifacts set by your lab admin.


## Next steps
* Learn how to [add a Git artifact repository to a lab](devtest-lab-add-artifact-repo.md).


---
title: Use Azure DevTest Labs for training | Microsoft Docs
description: Learn how to use Azure DevTest Labs for training scenarios.
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.assetid: 57ff4e30-7e33-453f-9867-e19b3fdb9fe2
ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/17/2018
ms.author: spelluru

---
# Use Azure DevTest Labs for training
Azure DevTest Labs can be used to implement many key scenarios in addition to dev/test. One of those scenarios is to set up a lab for training. Azure DevTest Labs allows you to create a lab where you can provide custom templates that each trainee can use to create identical and isolated environments for training. You can apply policies to ensure that training environments are available to each trainee only when they need them and contain enough resources - such as virtual machines - required for the training. Finally, you can easily share the lab with trainees, which they can access in one click.

![Use DevTest Labs for training](./media/devtest-lab-training-lab/devtest-lab-training.png)

Azure DevTest Labs meets the following requirements that are required to conduct training in any virtual environment: 

* Trainees cannot see VMs created by other trainees
* Every training machine should be identical
* Trainees can quickly provision their training environments
* Control cost by ensuring that trainees cannot get more VMs than they need for the training and also shutdown VMs when they are not using them
* Easily share the training lab with each trainee
* Reuse the training lab again and again

In this article, you learn about various Azure DevTest Labs features that can be used to meet the previously described training requirements and detailed steps that you can follow to set up a lab for training.  

## Implementing training with Azure DevTest Labs
1. **Create the lab** 
   
    Labs are the starting point in Azure DevTest Labs. Once you create a lab, you can perform tasks such as add users (trainees) to the lab, set policies to control costs, define VM images that can create quickly, and more.   
   
    Learn more by clicking on the links in the following table:
   
   | Task | What you learn |
   | --- | --- |
   | [Create a lab in Azure DevTest Labs](devtest-lab-create-lab.md) |Learn how to create a lab in Azure DevTest Labs in the Azure portal. |
2. **Create training VMs in minutes using ready-made marketplace images and custom images** 
   
    You can pick ready-made images from a wide variety of images in the Azure Marketplace and make them available for the trainees in the lab. If the ready-made images don't meet your requirements, you can create a custom image by creating a lab VM using a ready-made image from Azure Marketplace, installing all the software that you need for the training, and saving the VM as custom image in the lab. 
   
    Learn more by clicking on the links in the following table:
   
   | Task | What you learn |
   | --- | --- |
   | [Configure Azure Marketplace images](devtest-lab-configure-marketplace-images.md) |Learn how you can whitelist Azure Marketplace images; making available for selection only the images you want for the training. |
   | [Create a custom image](devtest-lab-create-template.md) |Create a custom image by pre-installing the software you need for the training so that trainees can quickly create a VM using the custom image. |
3. **Create reusable templates for training machines** 
   
    A formula in Azure DevTest Labs is a list of default property values used to create a VM. You can create a formula in the lab by picking an image, a VM size (a combination of CPU and RAM), and a virtual network. Each trainee can see the formula in the lab and use it to create a VM. 
   
    Learn more by clicking on the links in the following table:
   
   | Task | What you learn |
   | --- | --- |
   | [Manage DevTest Labs formulas to create VMs](devtest-lab-manage-formulas.md) |Learn how you can create a formula by picking up an image, VM size (combination of CPU and RAM), and a virtual network. |
4. **Control costs**
   
    Azure DevTest Labs allows you to set a policy in the lab to specify the maximum number of VMs that can be created by a trainee in the lab. 
   
    If you are conducting multi-day training and want to stop all the VMs at a particular time of the day and then automatically restart them the following day, you can easily accomplish that by setting auto-shutdown and auto-start policies in the lab. 
   
    Finally, when training is complete you can delete all the VMs at once by running a single PowerShell script. 
   
    Learn more by clicking on the links in the following table:
   
   | Task | What you learn |
   | --- | --- |
   | [Define lab policies](devtest-lab-set-lab-policy.md) |Control costs by setting policies in the lab. |
   | [Delete all the lab VMs using a PowerShell script](devtest-lab-faq.md#how-do-i-automate-the-process-of-deleting-all-the-vms-in-my-lab) |Delete all the labs in one operation when the training is complete. |
5. **Share the lab with each trainee**
   
    Labs can be directly accessed using a link that you share with your trainees. Your trainees don't even have to have an Azure account, as long as they have a [Microsoft account](devtest-lab-faq.md#what-is-a-microsoft-account). Trainees cannot see VMs created by other trainees.  
   
    Learn more by clicking on the links in the following table:
   
   | Task | What you learn |
   | --- | --- |
   | [Add a trainee to a lab in Azure DevTest Labs](devtest-lab-add-devtest-user.md) |Use the Azure portal to add trainees to your training lab. |
   | [Add trainees to the lab using a PowerShell script](devtest-lab-add-devtest-user.md#add-an-external-user-to-a-lab-using-powershell) |Use PowerShell to automate adding trainees to your training lab. |
   | [Get a link to the lab](devtest-lab-faq.md#how-do-i-share-a-direct-link-to-my-lab) |Learn how a lab can be directly accessed via a hyperlink. |
6. **Reuse the lab again and again** 
   
    You can automate lab creation, including custom settings, by creating a Resource Manager template and using it to create identical labs again and again. 
   
    Learn more by clicking on the links in the following table:
   
   | Task | What you learn |
   | --- | --- |
   | [Create a lab using a Resource Manager template](devtest-lab-faq.md#how-do-i-create-a-lab-from-a-resource-manager-template) |Create labs in Azure DevTest Labs using Resource Manager templates. |

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]


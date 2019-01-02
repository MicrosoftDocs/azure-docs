---
title: Use Azure DevTest Labs for developers | Microsoft Docs
description: Learn how to use Azure DevTest Labs for developer scenarios.
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila
editor: ''

ms.assetid: 22e070e5-3d1a-49fe-9d4c-5e07cb0b7fe2
ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/17/2018
ms.author: spelluru

---
# Use Azure DevTest Labs for developers
Azure DevTest Labs can be used to implement many key scenarios, but one of the primary scenarios involves using DevTest Labs to host development machines for developers. In this scenario, DevTest Labs provides these benefits:

- Developers can quickly provision their development machines on demand.
- Developers can easily customize their development machines whenever needed.
- Administrators can control costs by ensuring that:
  - Developers cannot get more VMs than they need for development.
  - VMs are shut down when not in use. 

![Use DevTest Labs for training](./media/devtest-lab-developer-lab/devtest-lab-developer-lab.png)

In this article, you learn about various Azure DevTest Labs features that can be used to meet developer requirements and the detailed steps that you can follow to set up a lab.

## Implementing developer environments with Azure DevTest Labs
1. **Create the lab** 
   
    Labs are the starting point in Azure DevTest Labs. Once you create a lab, you can perform tasks such as adding users (developers) to the lab, setting policies to control costs, defining VM images that can create quickly, and more.  
   
    Learn more by clicking on the links in the following table:
   
   | Task | What you learn |
   | --- | --- |
   | [Create a lab in Azure DevTest Labs](devtest-lab-create-lab.md) |Learn how to create a lab in Azure DevTest Labs in the Azure portal. |
2. **Create VMs in minutes using ready-made marketplace images and custom images** 
   
    You can pick ready-made images from a wide variety of images in the Azure Marketplace and make them available in the lab. If the ready-made images don't meet your requirements, you can create a custom image by creating a lab VM using a ready-made image from Azure Marketplace, installing all the software that you need, and saving the VM as a custom image in the lab.

    If you will be using custom images, consider using an image factory to create and distribute your images. An image factory is a configuration-as-code solution that regularly builds and distributes your configured images automatically. This saves the time required to manually configure the system after a VM has been created with the base OS.
  
    Learn more by clicking on the links in the following table:
   
   | Task | What you learn |
   | --- | --- |
   | [Configure Azure Marketplace images](devtest-lab-configure-marketplace-images.md) |Learn how you can whitelist Azure Marketplace images, making available for selection only the images you want for the developers.|
   | [Create a custom image](devtest-lab-create-template.md) |Create a custom image by pre-installing the software you need so that developers can quickly create a VM using the custom image.|
   | [Learn about image factory](https://blogs.msdn.microsoft.com/devtestlab/2017/04/17/video-custom-image-factory-with-azure-devtest-labs/) |Watch a video that describes how to set up and use an image factory.|

3. **Create reusable templates for developer machines** 
   
    A formula in Azure DevTest Labs is a list of default property values used to create a VM. You can create a formula in the lab by picking an image, a VM size (a combination of CPU and RAM), and a virtual network. Each developer can see the formula in the lab and use it to create a VM. 
   
    Learn more by clicking on the links in the following table:
   
   | Task | What you learn |
   | --- | --- |
   | [Manage DevTest Labs formulas to create VMs](devtest-lab-manage-formulas.md) |Learn how you can create a formula by picking up an image, VM size (combination of CPU and RAM), and a virtual network.|

4. **Create artifacts to enable flexible VM customization**

   Artifacts are used to deploy and configure your application after a VM is provisioned. Artifacts can be:

   - Tools that you want to install on the VM - such as agents, Fiddler, and Visual Studio.
   - Actions that you want to run on the VM - such as cloning a repo.
   - Applications that you want to test.

   Many artifacts are already available out-of-the-box. You can create your own custom artifacts if you want more customization for your specific needs.

   Learn more by clicking on the links in the following table:
   
   | Task | What you learn |
   | --- | --- |
   | [Create custom artifacts for your DevTest Labs VM](devtest-lab-artifact-author.md) |Create your own custom artifacts for the virtual machines in your lab.|
   | [Add a Git repository to store custom artifacts and Azure Resource Manager templates for use in Azure DevTest Labs](devtest-lab-add-artifact-repo.md) |Learn how to store your custom artifacts in your own private Git repo.|

5. **Control costs**
   
    Azure DevTest Labs allows you to set a policy in the lab to specify the maximum number of VMs that can be created by a developer in the lab. 
   
    If your developer team has a set work schedule and you want to stop all the VMs at a particular time of the day and then automatically restart them the following day, you can easily accomplish that by setting auto-shutdown and auto-start policies in the lab. 
   
    Finally, when app development is complete, you can delete all the VMs at once by running a single PowerShell script. 
   
    Learn more by clicking on the links in the following table:
   
   | Task | What you learn |
   | --- | --- |
   | [Define lab policies](devtest-lab-set-lab-policy.md) |Control costs by setting policies in the lab. |
   | [Delete all the lab VMs using a PowerShell script](devtest-lab-faq.md#how-do-i-automate-the-process-of-deleting-all-the-vms-in-my-lab) |Delete all the labs in one operation when development is complete.|

1. **Add a virtual network to a VM** 
   
    DevTest Labs creates a new virtual network (VNET) whenever a lab is created. If you have configured your own VNET – for example, by using ExpressRoute or site-to-site VPN – you can add this VNET to your lab's virtual network settings so that it is available when creating VMs.

    In addition, there is an Azure Active Directory domain join artifact available that will join a VM to a domain when the VM is being created. 
   
    Learn more by clicking on the links in the following table:
   
   | Task | What you learn |
   | --- | --- |
   | [Configure a virtual network in Azure DevTest Labs](devtest-lab-configure-vnet.md) |Learn how to configure a virtual network in Azure DevTest Labs using the Azure portal.|

6. **Share the lab with each developer**
   
    Labs can be directly accessed using a link that you share with your developers. They don't even have to have an Azure account, as long as they have a [Microsoft account](devtest-lab-faq.md#what-is-a-microsoft-account). Developers cannot see VMs created by other developers.  
   
    Learn more by clicking on the links in the following table:
   
   | Task | What you learn |
   | --- | --- |
   | [Add a developer to a lab in Azure DevTest Labs](devtest-lab-add-devtest-user.md) |Use the Azure portal to add developers to your lab.|
   | [Add developers to the lab using a PowerShell script](devtest-lab-add-devtest-user.md#add-an-external-user-to-a-lab-using-powershell) |Use PowerShell to automate adding developers to your lab. |
   | [Get a link to the lab](devtest-lab-faq.md#how-do-i-share-a-direct-link-to-my-lab) |Learn how developers can directly access a lab via a hyperlink.|

7. **Automate lab creation for more teams** 
   
    You can automate lab creation, including custom settings, by creating a Resource Manager template and using it to create identical labs again and again. 
   
    Learn more by clicking on the links in the following table:
   
   | Task | What you learn |
   | --- | --- |
   | [Create a lab using a Resource Manager template](devtest-lab-faq.md#how-do-i-create-a-lab-from-a-resource-manager-template) |Create labs in Azure DevTest Labs using Resource Manager templates. |

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]


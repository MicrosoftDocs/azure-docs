<properties
	pageTitle="Use Azure DevTest Labs for training | Microsoft Azure"
	description="Learn how to use Azure DevTest Labs for training scenarios."
	services="devtest-lab,virtual-machines"
	documentationCenter="na"
	authors="steved0x"
	manager="douge"
	editor=""/>

<tags
	ms.service="devtest-lab"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/12/2016"
	ms.author="sdanie"/>

# Use Azure DevTest Labs for training

Azure DevTest Labs can be used to implement many key scenarios in addition to dev/test. One of those scenarios is to set up a lab for training. Azure DevTest Labs allows you to create a lab where you can provide custom templates that each trainee can use to create identical and isolated environments for training. You can ensure that training environments are available to each trainee only when they need them and contain enough resources - such as virtual machines - required for the training. Finally, you can easily share the lab with trainees, which they can access in one click.   

![Use DevTest Labs for training](./media/devtest-lab-training-lab/devtest-lab-training.png)

Azure DevTest Labs meets the following requirements that are required to conduct training in any virtual environment: 


-	Trainees cannot see VMs created by other trainees
-	Every training machine should be identical
-	Trainees can quickly provision their training environments
-	Control cost by ensuring that trainees cannot get more VMs than they need for the training and also shutdown VMs when they are not using them
-	Easily share the training lab with each trainee
-	Reuse the training lab again and again


In this article, you learn about various Azure DevTest Labs features that can be used to meet the previously described training requirements and detailed steps that you can follow to set up a lab for training.  


## Implementing training with Azure DevTest Labs

1. **Create the lab** 

    You can create an isolated training lab in Azure DevTest Labs by creating a lab and providing isolated training machines to each trainee by adding them to the DevTest Labs user role. A person in the Azure DevTest Labs user role can see only the VMs created themselves and cannot access the VMs created by other trainees.  

    Learn more:

    -    [Create a lab in DevTest Labs](devtest-lab-create-lab.md)

2. **Create training VMs in minutes using custom images or ready-made marketplace images** 
    
    You can pick ready-made images from a wide variety of images in the Azure Marketplace and make them available for all the trainees in the lab. If the ready-made images don't meet your requirements, you can create a custom image by creating a lab VM using a ready-made image from Azure Marketplace, installing all the software that you need for the training, and finally, saving the VM as custom image in the lab. 

    Learn more:

    -    [Configure marketplace images](devtest-lab-configure-marketplace-images.md)
    -    [Create a custom image](devtest-lab-create-template.md)


3. **Create reusable templates for training machines** 

    You can use formulas in the lab to create templates for training machines. You can create a formula in the lab by picking an image, a VM size (a combination of CPU and RAM), and a virtual network. Each trainee can see the formula in the lab and use it to create a VM. 

    Learn more:

    -    [Manage DevTest Labs formulas to create VMs](devtest-lab-manage-formulas.md)

4. **Control costs**

    Azure DevTest Labs allows you to set a policy in the lab to set the maximum number of VMs that can be created by a trainee in the lab. 

    If you are conducting multi-day training and want to stop all the VMs at a particular time of the day and then automatically retart them the following day, you can easily accomplish it by setting auto-shutdown and auto-start policies in the lab. 

    Finally, when training is complete you can delete all the VMs at once by running a single PowerShell script. 

    Learn more:

    -    [Define lab policies](devtest-lab-set-lab-policy.md)
    -    [Delete all the lab VMs using a PowerShell script](devtest-lab-faq.md#how-can-i-automate-the-process-of-deleting-all-the-vms-in-my-lab)

5. **Share the lab with each trainee**

    If you're worried that trainees will get lost in the Azure portal and won't find the lab that you have created, you don’t have to worry. Labs can be directly accessed using a link. Your trainees don't even have to have an Azure account, as long as they have a [Microsoft account](devtest-lab-faq.md#what-is-a-microsoft-account) such as a live.com or hotmail.com account. You can share the lab link with all the trainees in an email and then they can click the link and go directly to the lab. 

    Learn more:

    -    [Add a trainee to a lab in Azure DevTest Labs](devtest-lab-add-devtest-user.md)
    -    [Add trainees to the lab using a PowerShell script](devtest-lab-add-devtest-user.md#add-an-external-user-to-a-lab-using-powershell)
    -    [Get a link to the lab](devtest-lab-faq.md#how-do-i-share-a-direct-link-to-my-lab)

6. **Reuse the lab again and again** 

    You can automate lab creation, including custom settings, by creating a Resource Manager template and using it to create identical labs again and again. 

    Learn more:

    -    [Create a lab using a Resource Manager template](devtest-lab-faq.md#how-do-i-create-a-lab-from-an-azure-resource-manager-template)


[AZURE.INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]  


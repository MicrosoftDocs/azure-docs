---
title: Azure DevTest Labs FAQ | Microsoft Docs
description: Find answers to common Azure DevTest Labs questions
services: devtest-lab,virtual-machines
documentationcenter: na
author: tomarcher
manager: douge
editor: ''

ms.assetid: afe83109-b89f-4f18-bddd-b8b4a30f11b4
ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/22/2017
ms.author: tarcher

---
# Azure DevTest Labs FAQ
This article answers some of the most common questions about Azure DevTest Labs.

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## General
* [What if my question isn't answered here?](#what-if-my-question-isnt-answered-here)
* [Why should I use Azure DevTest Labs?](#why-should-i-use-azure-devtest-labs)
* [What does "worry-free, self-service" mean?](#what-does-worry-free-self-service-mean)
* [How can I use Azure DevTest Labs?](#how-can-i-use-azure-devtest-labs)
* [How am I billed for Azure DevTest Labs?](#how-am-i-billed-for-azure-devtest-labs)

## Security
* [What are the different security levels in Azure DevTest Labs?](#what-are-the-different-security-levels-in-azure-devtest-labs)
* [How do I create a role to allow users to perform a specific task?](#how-do-i-create-a-role-to-allow-users-to-perform-a-specific-task)

## CI/CD Integration & Automation
* [Does Azure DevTest Labs integrate with my CI/CD toolchain?](#does-azure-devtest-labs-integrate-with-my-cicd-toolchain)

## Virtual Machines
* [Why can't I see certain VMs in the Azure Virtual Machines blade that I see within Azure DevTest Labs?](#why-cant-i-see-certain-vms-in-the-azure-virtual-machines-blade-that-i-see-within-azure-devtest-labs)
* [What is the difference between custom images and formulas?](#what-is-the-difference-between-custom-images-and-formulas)
* [How do I create multiple VMs from the same template at once?](#how-do-i-create-multiple-vms-from-the-same-template-at-once)
* [How do I move my existing Azure VMs into my Azure DevTest Labs lab?](#how-do-i-move-my-existing-azure-vms-into-my-azure-devtest-labs-lab)
* [Can I attach multiple disks to my VMs?](#can-i-attach-multiple-disks-to-my-vms)
* [If I want to use a Windows OS image for my testing, do I have to purchase an MSDN subscription?](#if-i-want-to-use-a-windows-os-image-for-my-testing-do-i-have-to-purchase-an-msdn-subscription)
* [How do I automate the process of uploading VHD files to create custom images?](#how-do-i-automate-the-process-of-uploading-vhd-files-to-create-custom-images)
* [How can I automate the process of deleting all the VMs in my lab?](#how-can-i-automate-the-process-of-deleting-all-the-vms-in-my-lab)

## Artifacts
* [What are artifacts?](#what-are-artifacts)

## Lab configuration
* [How do I create a lab from an Azure Resource Manager template?](#how-do-i-create-a-lab-from-an-azure-resource-manager-template)
* [Why are my VMs created in different resource groups with arbitrary names? Can I rename or modify these resource groups?](#why-are-my-vms-created-in-different-resource-groups-with-arbitrary-names-can-i-rename-or-modify-these-resource-groups)
* [How many labs can I create under the same subscription?](#how-many-labs-can-i-create-under-the-same-subscription)
* [How many VMs can I create per lab?](#how-many-vms-can-i-create-per-lab)
* [How do I share a direct link to my lab?](#how-do-i-share-a-direct-link-to-my-lab)
* [What is a Microsoft account?](#what-is-a-microsoft-account)

## Troubleshooting
* [My artifact failed during VM creation. How do I troubleshoot it?](#my-artifact-failed-during-vm-creation-how-do-i-troubleshoot-it)
* [Why isn't my existing virtual network saving properly?](#why-isnt-my-existing-virtual-network-saving-properly)
* [Why do I get a "Parent resource not found" error when provisioning from PowerShell?](#why-do-i-get-a-parent-resource-not-found-error-when-provisioning-a-vm-from-powershell)  
* [Where can I find more error information if a VM deployment fails?](#where-can-i-find-more-error-information-if-a-vm-deployment-fails)  

### What if my question isn't answered here?
If your question is not listed here, let us know so we can help you find an answer.

* Post a question in the [Disqus thread](#comments) at the end of this FAQ and engage with the Azure Cache team and other community members about this article.
* To reach a wider audience, post a question on the [Azure DevTest Labs MSDN forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=AzureDevTestLabs), and engage with the Azure DevTest Labs team and other members of the community.
* To make a feature request, submit your requests and ideas to the [Azure DevTest Labs User Voice](https://feedback.azure.com/forums/320373-azure-devtest-labs).

### Why should I use Azure DevTest Labs?
Azure DevTest Labs can save your team time and money. Developers can create their own environments using several different bases, and use artifacts to quickly deploy and configure applications. Using custom images and formulas, virtual machines can be saved as templates and easily reproduced. In addition, labs offer several configurable policies that allow lab administrators to reduce waste and manage a team's environments. These policies include auto-shutdown, cost threshold, maximum VMs per user, and maximum VM sizes. For a more in-depth explanation of Azure DevTest Labs, read the [overview](devtest-lab-overview.md) or watch the [introductory video](/documentation/videos/videos/what-is-azure-devtest-labs).

### What does "worry-free, self-service" mean?
"Worry-free, self-service" means that developers and testers create their own environments as needed, and administrators have the security of knowing that Azure DevTest Labs helps minimize waste and control cost. Administrators can specify which VM sizes are allowed, the maximum number of VMs, and when VMs are started and shut down. Azure DevTest Labs also makes it easy to monitor costs and set alerts to stay aware of how resources in the lab are being used.

### How can I use Azure DevTest Labs?
Azure DevTest Labs is useful anytime you require dev or test environments, and you want to reproduce them quickly and/or manage them with cost saving policies.

Here are some scenarios that our customers use Azure DevTest Labs for:

* Managing dev and test environments in one place, utilizing policies to reduce cost and custom images to share builds across the team.
* Developing an application using custom images to save the disk state throughout the development stages.
* Tracking the cost in relation to progress.
* Creating mass test environments for quality assurance testing.
* Using artifacts and formulas to easily configure and reproduce an application on various environments.
* Distributing VMs for hackathons (collaborative dev or test work), and then easily de-provisioning them when the event ends.

### How am I billed for Azure DevTest Labs?
Azure DevTest Labs is a free service, meaning that creating labs and configuring the policies, templates, and artifacts is free. You pay only for the Azure resources used within your labs, such as virtual machines, storage accounts, and virtual networks. For more information on the cost of lab resources, read about [Azure DevTest Labs pricing](https://azure.microsoft.com/pricing/details/devtest-lab/).

### What are the different security levels in Azure DevTest Labs?
Security access is determined by [Azure Role-Based Access Control (RBAC)](../active-directory/role-based-access-built-in-roles.md). To understand how access works, it helps to understand the differences between a permission, a role, and a scope as defined by RBAC.

* **Permission** - A permission is a defined access to a specific action. For example, a permission can be read-access to all virtual machines.
* **Role** - A role is a set of permissions that can be grouped and assigned to a user. For example, a "subscription owner" has access to all resources within a subscription.
* **Scope** - A scope is a level within the hierarchy of Azure resource. For example, a scope can be a resource group or a single lab or the entire subscription.

Within the scope of Azure DevTest Labs, there are two types of roles to define user permissions: lab owner and lab user.

* **Lab owner** - A lab owner has the access to any resources within the lab. Therefore, they can modify policies, read and write any VMs, change the virtual network, and so on.
* **Lab user** - A lab user can view all lab resources, such as VMs, policies, and virtual networks, but they cannot modify policies or any VMs created by other users. It is also possible to create custom roles in Azure DevTest Labs, and you can learn how to do in the article, [Grant user permissions to specific lab policies](devtest-lab-grant-user-permissions-to-specific-lab-policies.md).

Since scopes are hierarchical, when a user has permissions at a certain scope, they are automatically granted those permissions at every lower-level scope encompassed. For instance, if a user is assigned to the role of subscription owner, then they have access to all resources in a subscription. These resources include all virtual machines, all virtual networks, and all labs. Thus, a subscription owner automatically inherits the role of lab owner. However, the opposite is not true. A lab owner has access to a lab, which is a lower scope than the subscription level. Therefore, a lab owner is not able to see virtual machines or virtual networks or any resources that are outside of the lab.

### How do I create a role to allow users to perform a specific task?
A comprehensive article about how to create custom roles and assign permissions to that role can be found here. Here is an example of a script that creates the role "DevTest Labs Advanced User", which has permission to start and stop all VMs in the lab:

    $policyRoleDef = Get-AzureRmRoleDefinition "DevTest Labs User"
    $policyRoleDef.Actions.Remove('Microsoft.DevTestLab/Environments/*')
    $policyRoleDef.Id = $null
    $policyRoleDef.Name = "DevTest Labs Advance User"
    $policyRoleDef.IsCustom = $true
    $policyRoleDef.AssignableScopes.Clear()
    $policyRoleDef.AssignableScopes.Add("subscriptions/<subscription Id>")
    $policyRoleDef.Actions.Add("Microsoft.DevTestLab/labs/virtualMachines/Start/action")
    $policyRoleDef.Actions.Add("Microsoft.DevTestLab/labs/virtualMachines/Stop/action")
    $policyRoleDef = New-AzureRmRoleDefinition -Role $policyRoleDef  

### Does Azure DevTest Labs integrate with my CI/CD toolchain?
If you are using VSTS, there is an [Azure DevTest Labs Tasks extension](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks) that allows you to automate your release pipeline in Azure DevTest Labs. Some of the uses of this extension include:

* Creating and deploying a VM automatically and configuring it with the latest build using Azure File Copy or PowerShell VSTS tasks.
* Automatically capturing the state of a VM after testing to reproduce a bug on the same VM for further investigation.
* Deleting the VM at the end of the release pipeline when it is no longer needed.

The following blog posts provide guidance and information about using the VSTS extension:

* [Azure DevTest Labs – VSTS extension](https://blogs.msdn.microsoft.com/devtestlab/2016/06/15/azure-devtest-labs-vsts-extension/)
* [Deploying a new VM in an existing AzureDevTestLab from VSTS](http://www.visualstudiogeeks.com/blog/DevOps/Deploy-New-VM-To-Existing-AzureDevTestLab-From-VSTS)
* [Using VSTS Release Management for Continuous Deployments to AzureDevTestLabs](http://www.visualstudiogeeks.com/blog/DevOps/Use-VSTS-ReleaseManagement-to-Deploy-and-Test-in-AzureDevTestLabs)

For other CI/CD toolchains, all the previously mentioned scenarios that can be achieved through the VSTS tasks extension can be similarly achieved through deploying [Azure Resource Manager templates](https://aka.ms/dtlquickstarttemplate) using [Azure PowerShell cmdlets](../azure-resource-manager/resource-group-template-deploy.md) and [.NET SDKs](https://www.nuget.org/packages/Microsoft.Azure.Management.DevTestLabs/). You can also use [REST APIs for DevTest Labs](http://aka.ms/dtlrestapis) to integrate with your toolchain.  

### Why can't I see certain VMs in the Azure Virtual Machines blade that I see within Azure DevTest Labs?
When a VM is created in Azure DevTest Labs, permission is given to access that VM. You are able to view it both in the labs blade and the **Virtual Machines** blade. Users in the DevTest Labs role can see all virtual machines created in the lab through the lab's **All Virtual Machines** blade. However, users in the DevTest Labs role are not automatically granted read-access to VM resources that others have created. Therefore, those VMs are not displayed in the **Virtual Machines** blade.

### What is the difference between custom images and formulas?
A custom image is a VHD (virtual hard disk), whereas a formula is an image that you can configure with additional settings that you can save and reproduce. A custom image may be preferable if you want to quickly create several environments with the same basic, immutable image. A formula may be better if you want to reproduce the configuration of your VM with the latest bits, a virtual network/subnet, or a specific size. For a more in-depth explanation, see the article, [Comparing custom images and formulas in DevTest Labs](devtest-lab-comparing-vm-base-image-types.md).

### How do I create multiple VMs from the same template at once?
You can use the [VSTS tasks extension](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks) or [generate an Azure Resource Manager template](devtest-lab-add-vm.md#save-azure-resource-manager-template) while creating a VM and [deploy the Azure Resource Manager template from Windows PowerShell](../azure-resource-manager/resource-group-template-deploy.md).

### How do I move my existing Azure VMs into my Azure DevTest Labs lab?
We are designing a solution to directly move VMs to Azure DevTest Labs, but currently you can copy your existing VMs to Azure DevTest Labs as follows:

1. Copy the VHD file of your existing VM using this [Windows PowerShell script](https://github.com/Azure/azure-devtestlab/blob/master/Scripts/CopyVHDFromVMToLab.ps1)
2. [Create the custom image](devtest-lab-create-template.md) inside your Azure DevTest Labs lab.
3. Create a VM in the lab from your custom image

### Can I attach multiple disks to my VMs?
Attaching multiple disks to VMs is supported.  

### If I want to use a Windows OS image for my testing, do I have to purchase an MSDN subscription?
If you need to use Windows client OS images (Windows 7 or later) for your development or testing in Azure, then yes, you must either:

- [Buy an MSDN subscription](https://www.visualstudio.com/products/how-to-buy-vs).
- if you have an Enterprise Agreement, create an Azure subscription with the [Enterprise Dev/Test offer](https://azure.microsoft.com/en-us/offers/ms-azr-0148p).

For more information about the Azure credits for each MSDN offering, see [Monthly Azure credit for Visual Studio subscribers](https://azure.microsoft.com/en-us/pricing/member-offers/msdn-benefits-details/).

### How do I automate the process of uploading VHD files to create custom images?
There are two options:

* [Azure AzCopy](../storage/storage-use-azcopy.md#blob-upload) can be used to copy or upload VHD files to the storage account associated with the lab.
* [Microsoft Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) is a standalone app that runs on Windows, OSX, and Linux.   

To find the destination storage account associated with your lab, follow these steps:

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).
2. Select **Resource Groups** from the left panel.
3. Locate and select the resource group associated with your lab.
4. On the **Overview** blade, select one of the storage accounts.
5. Select **Blobs**.
6. Look for uploads in the list. If none exists, return to Step #4 and try another storage account.
7. Use the **URL** as your destination in your AzCopy command.

### How can I automate the process of deleting all the VMs in my lab?
In addition to deleting VMs from your lab in the Azure portal, you can delete all the VMs in your lab using a PowerShell script. In the following example, modify the parameter values under the **Values to change** comment. You can retrieve the `subscriptionId`, `labResourceGroup`, and `labName` values from the lab blade in the Azure portal.

    # Delete all the VMs in a lab

    # Values to change
    $subscriptionId = "<Enter Azure subscription ID here>"
    $labResourceGroup = "<Enter lab's resource group here>"
    $labName = "<Enter lab name here>"

    # Login to your Azure account
    Login-AzureRmAccount

    # Select the Azure subscription that contains the lab. This step is optional
    # if you have only one subscription.
    Select-AzureRmSubscription -SubscriptionId $subscriptionId

    # Get the lab that contains the VMs to delete.
    $lab = Get-AzureRmResource -ResourceId ('subscriptions/' + $subscriptionId + '/resourceGroups/' + $labResourceGroup + '/providers/Microsoft.DevTestLab/labs/' + $labName)

    # Get the VMs from that lab.
    $labVMs = Get-AzureRmResource | Where-Object {
              $_.ResourceType -eq 'microsoft.devtestlab/labs/virtualmachines' -and
              $_.ResourceName -like "$($lab.ResourceName)/*"}

    # Delete the VMs.
    foreach($labVM in $labVMs)
    {
        Remove-AzureRmResource -ResourceId $labVM.ResourceId -Force
    }




### What are artifacts?
Artifacts are customizable elements that can be used to deploy your latest bits or your dev tools onto a VM. They are attached to your VM during creation with a few simple clicks, and once the VM is provisioned, the artifacts deploy and configure your VM. There are various pre-existing artifacts in our [public GitHub repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts), but you can also easily [author your own artifacts](devtest-lab-artifact-author.md).

### How do I create a lab from an Azure Resource Manager template?
We have provided a [GitHub repository of lab Azure Resource Manager templates](https://aka.ms/dtlquickstarttemplate) that you can deploy as-is or modify to create custom templates for your labs. Each of these templates has a link that you can click to deploy the lab as-is under your own Azure subscription, or you can customize the template and [deploy using PowerShell or Azure CLI](../azure-resource-manager/resource-group-template-deploy.md).

### Why are my VMs created in different resource groups with arbitrary names? Can I rename or modify these resource groups?
Resource groups are created this way in order for Azure DevTest Labs to manage the user permissions and access to virtual machines. While you can move the VM to another resource group with your desired name, doing so is not recommended. We are working on improving this experience to allow more flexibility.   

### How many labs can I create under the same subscription?
There is no specific limit on the number of labs that can be created per subscription. However, the resources used are limited per subscription. You can read about the [limits and quotas imposed on Azure subscriptions](../azure-subscription-service-limits.md) and [how to increase these limits](https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests).

### How many VMs can I create per lab?
There is no specific limit on the number of VMs that can be created per lab. However, the resources used are limited per subscription (e.g. VM cores, public IPs, etc.). You can read about the [limits and quotas imposed on Azure subscriptions](../azure-subscription-service-limits.md) and [how to increase these limits](https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests).

### How do I share a direct link to my lab?
To share a direct link to your lab users, you can perform the following procedure:

1. Browse to the lab in the Azure portal.
2. Copy the lab URL from your browser and share it with your lab users.

> [!NOTE]
> If your lab users are external users with a [Microsoft account](#what-is-a-microsoft-account) and they don’t belong to your company’s Active directory, they may receive an error when navigating to the provided link. If they receive an error, instruct them to click their name in the upper-right corner of the Azure portal and select the directory where the lab exists from the **Directory** section of the menu.
>
>

### What is a Microsoft account?
A Microsoft account is what you use for almost everything you do with Microsoft devices and services. It’s an email address and password that you use to sign in to Skype, Outlook.com, OneDrive, Windows Phone, and Xbox LIVE – and it means your files, photos, contacts, and settings can follow you to any device.

> [!NOTE]
> Microsoft account used to be called "Windows Live ID".
>
>

### My artifact failed during VM creation. How do I troubleshoot it?
Refer to the blog post, [How to troubleshoot failing Artifacts in AzureDevTestLabs](http://www.visualstudiogeeks.com/blog/DevOps/How-to-troubleshoot-failing-artifacts-in-AzureDevTestLabs) – written by one of our MVPs – to learn how to obtain logs regarding your failed artifact.

### Why isn't my existing virtual network saving properly?
One possibility is that your virtual network name contains periods. If so, try removing the periods or replacing them with hyphens, and then try saving the virtual network again.

### Why do I get a "Parent resource not found" error when provisioning a VM from PowerShell?
When one resource is a parent to another resource, the parent resource must exist before creating the child resource. If it does not exist, you receive a **ParentResourceNotFound** error. If you do not specify a dependency on the parent resource, the child resource might be deployed before the parent.

VMs are child resources under a lab in a resource group. When you use Azure Resource Manager templates to deploy through PowerShell, the resource group name provided in the PowerShell script should be the resource group name of the lab. For more information, see [Troubleshoot common Azure deployment errors ](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-common-deployment-errors#parentresourcenotfound).

### Where can I find more error information if a VM deployment fails?
VM deployment errors are captured in the activity logs. You can find lab VMs activity logs through the **Audit logs** or **Virtual machine diagnostics** on the resource menu in the lab's VM blade (the blade displays after you select the VM from **My virtual machines** list).

Sometimes, the deployment error occurs before the VM deployment starts - such as when the subscription limit for a resource created with the VM is exceeded. In this case, the error details are captured in the lab level **Activity logs** that can be find at the bottom of the **Configuration and policies** settings. For more information about using activity logs in Azure, see [View activity logs to audit actions on resources](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-audit).

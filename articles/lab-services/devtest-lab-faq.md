---
title: Azure DevTest Labs FAQ | Microsoft Docs
description: Find answers to common questions about Azure DevTest Labs.
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila
editor: ''

ms.assetid: afe83109-b89f-4f18-bddd-b8b4a30f11b4
ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/17/2018
ms.author: spelluru

---
# Azure DevTest Labs FAQ
Get answers to some of the most common questions about Azure DevTest Labs.

**General**
## What if my question isn't answered here?
If your question is not listed here, let us know, so we can help you find an answer.

* Post a question at the end of this FAQ. Engage with the Azure Cache team and other community members about this article.
* To reach a wider audience, post a question on the [Azure DevTest Labs MSDN forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=AzureDevTestLabs). Engage with the Azure DevTest Labs team and other members of the community.
* For feature requests, submit your requests and ideas to [Azure DevTest Labs User Voice](https://feedback.azure.com/forums/320373-azure-devtest-labs).

## Why should I use Azure DevTest Labs?
Azure DevTest Labs can save your team time and money. Developers can create their own environments by using several different bases. They also can use artifacts to quickly deploy and configure applications. By using custom images and formulas, you can save virtual machines (VMs) as templates, and easily reproduce them across the team. DevTest Labs also offers several configurable policies that lab administrators can use to reduce waste and manage a team's environments. These policies include auto-shutdown, cost threshold, maximum VMs per user, and maximum VM size. For a more in-depth explanation of DevTest Labs, see the [overview](devtest-lab-overview.md) or the [introductory video](https://channel9.msdn.com/Blogs/Azure/what-is-azure-devtest-labs).

## What does "worry-free self-service" mean?
Worry-free self-service means that developers and testers create their own environments as needed. Administrators have the security of knowing that DevTest Labs can help minimize waste and control costs. Administrators can specify which VM sizes are allowed, the maximum number of VMs, and when VMs are started and shut down. DevTest Labs also makes it easy to monitor costs and set alerts, to help you stay aware of how lab resources are being used.

## How can I use DevTest Labs?
DevTest Labs is useful any time you require dev or test environments, and want to reproduce them quickly, or manage them by using cost-saving policies.

Here are some scenarios that our customers use DevTest Labs for:

* Manage dev and test environments in one place. Use policies to reduce costs and create custom images to share builds across the team.
* Develop an application by using custom images to save the disk state throughout the development stages.
* Track cost in relation to progress.
* Create mass test environments for quality assurance testing.
* Use artifacts and formulas to easily configure and reproduce an application in various environments.
* Distribute VMs for hackathons (collaborative dev or test work), and then easily deprovision them when the event ends.

## How am I billed for DevTest Labs?
DevTest Labs is a free service. Creating labs and configuring policies, templates, and artifacts in DevTest Labs is free. You pay only for the Azure resources used in your labs, such as VMs, storage accounts, and virtual networks. For more information about the cost of lab resources, see [Azure DevTest Labs pricing](https://azure.microsoft.com/pricing/details/devtest-lab/).


**Security**
## What are the different security levels in DevTest Labs?
Security access is determined by [Role-Based Access Control (RBAC)](../role-based-access-control/built-in-roles.md). To learn how access works, it helps to learn the differences between a permission, a role, and a scope, as defined by RBAC.

* **Permission**: A permission is a defined access to a specific action. For example, a permission can be read access to all VMs.
* **Role**: A role is a set of permissions that can be grouped and assigned to a user. For example, a user with a subscription owner role has access to all resources within a subscription.
* **Scope**: A scope is a level within the hierarchy of an Azure resource. For example, a scope can be a resource group, a single lab, or the entire subscription.

Within the scope of DevTest Labs, there are two types of roles that define user permissions:

* **Lab owner**: A lab owner has access to all resources in the lab. A lab owner can modify policies, read and write to any VMs, change the virtual network, and so on.
* **Lab user**: A lab user can view all lab resources, such as VMs, policies, and virtual networks. But, a lab user can't modify policies or any VMs that were created by other users. 

You also can create custom roles in DevTest Labs. To learn how to create custom roles in DevTest Labs, see [Grant user permissions to specific lab policies](devtest-lab-grant-user-permissions-to-specific-lab-policies.md).

Because scopes are hierarchical, when a user has permissions at a certain scope, the user is automatically granted those permissions at every lower-level scope in the scope. For instance, if a user is assigned the role of subscription owner, the user has access to all resources in a subscription. These resources include all VMs, all virtual networks, and all labs. A subscription owner automatically inherits the role of lab owner. However, the opposite is not true. A lab owner has access to a lab, which is a lower scope than the subscription level. Therefore, a lab owner can't  see VMs, virtual networks, or any other resources that are outside the lab.

## How do I create a role to allow users to perform a specific task?
For a comprehensive article about how to create custom roles and assign permissions to a role, see [Grant user permissions to specific lab policies](devtest-lab-grant-user-permissions-to-specific-lab-policies.md). Here's an example of a script that creates the role *DevTest Labs Advanced User*, which has permission to start and stop all VMs in the lab:

    $policyRoleDef = Get-AzureRmRoleDefinition "DevTest Labs User"
    $policyRoleDef.Actions.Remove('Microsoft.DevTestLab/Environments/*')
    $policyRoleDef.Id = $null
    $policyRoleDef.Name = "DevTest Labs Advanced User"
    $policyRoleDef.IsCustom = $true
    $policyRoleDef.AssignableScopes.Clear()
    $policyRoleDef.AssignableScopes.Add("subscriptions/<subscription Id>")
    $policyRoleDef.Actions.Add("Microsoft.DevTestLab/labs/virtualMachines/Start/action")
    $policyRoleDef.Actions.Add("Microsoft.DevTestLab/labs/virtualMachines/Stop/action")
    $policyRoleDef = New-AzureRmRoleDefinition -Role $policyRoleDef  


**CI/CD integration and automation**
## Does DevTest Labs integrate with my CI/CD toolchain?
If you are using Azure DevOps, you can use a [DevTest Labs Tasks extension](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks) to automate your release pipeline in DevTest Labs. Some of the tasks that you can do with this extension include:

* Create and deploy a VM automatically. You also can configure the VM with the latest build by using Azure File Copy or PowerShell Azure DevOps Services tasks.
* Automatically capture the state of a VM after testing to reproduce a bug on the same VM for further investigation.
* Delete the VM at the end of the release pipeline, when it is no longer needed.

The following blog posts offer guidance and information about using the Azure DevOps Services extension:

* [DevTest Labs and the Azure DevOps extension](https://blogs.msdn.microsoft.com/devtestlab/2016/06/15/azure-devtest-labs-vsts-extension/)
* [Deploy a new VM in an existing DevTest Labs lab from Azure DevOps Services](http://www.visualstudiogeeks.com/blog/DevOps/Deploy-New-VM-To-Existing-AzureDevTestLab-From-VSTS)
* [Using Azure DevOps Services release management for continuous deployments to DevTest Labs](http://www.visualstudiogeeks.com/blog/DevOps/Use-VSTS-ReleaseManagement-to-Deploy-and-Test-in-AzureDevTestLabs)

For other continuous integration (CI)/continuous delivery (CD) toolchains, you can achieve the same scenarios by deploying [Azure Resource Manager templates](https://aka.ms/dtlquickstarttemplate) by using [Azure PowerShell cmdlets](../azure-resource-manager/resource-group-template-deploy.md) and [.NET SDKs](https://www.nuget.org/packages/Microsoft.Azure.Management.DevTestLabs/). You also can use [REST APIs for DevTest Labs](http://aka.ms/dtlrestapis) to integrate with your toolchain.  


**Virtual machines**
## Why can't I see VMs on the Virtual Machines blade that I see in DevTest Labs?
When you create a VM in DevTest Labs, you are given permission to access that VM. You can view the VM both on the labs blade and on the **Virtual Machines** blade. Users assigned to the DevTest Labs lab user role can see all VMs that were created in the lab on the lab's **All Virtual Machines** blade. However, users who have the DevTest Labs lab user role are not automatically granted read access to VM resources that other users have created. Therefore, those VMs are not displayed on the **Virtual Machines** blade.

## What is the difference between a custom image and a formula?
A custom image is a virtual hard disk (VHD). A formula is an image that you can configure with additional settings, and then save and reproduce. A custom image might be preferable if you want to quickly create several environments by using the same basic, immutable image. A formula might be better if you want to reproduce the configuration of your VM with the latest bits, as part of a virtual network or subnet, or as a VM of a specific size. For a more in-depth explanation, see [Comparing custom images and formulas in DevTest Labs](devtest-lab-comparing-vm-base-image-types.md).

## How do I create multiple VMs from the same template at once?
You have two options for simultaneously creating multiple VMs from the same template:
* You can use the [Azure DevOps Tasks extension](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks). 
* You can [generate a Resource Manager template](devtest-lab-add-vm.md#save-azure-resource-manager-template) while you are creating a VM, and [deploy the Resource Manager template from Windows PowerShell](../azure-resource-manager/resource-group-template-deploy.md).

## How do I move my existing Azure VMs into my DevTest Labs lab?
To copy your existing VMs to DevTest Labs:

1. Copy the VHD file of your existing VM by using a [Windows PowerShell script](https://github.com/Azure/azure-devtestlab/blob/master/Scripts/CopyVHDFromVMToLab.ps1).
2. [Create the custom image](devtest-lab-create-template.md) inside your DevTest Labs lab.
3. Create a VM in the lab from your custom image.

## Can I attach multiple disks to my VMs?
Yes, you can attach multiple disks to your VMs.  

## If I want to use a Windows OS image for my testing, do I have to purchase an MSDN subscription?
To use Windows client OS images (Windows 7 or a later version) for your development or testing in Azure, you must do one of the following:

- [Buy an MSDN subscription](https://www.visualstudio.com/products/how-to-buy-vs).
- If you have an Enterprise Agreement, create an Azure subscription with the [Enterprise Dev/Test offer](https://azure.microsoft.com/offers/ms-azr-0148p).

For more information about the Azure credits for each MSDN offering, see [Monthly Azure credit for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/).

## How do I automate the process of uploading VHD files to create custom images?
To automate uploading VHD files to create custom images, you have two options:

* Use [AzCopy](../storage/common/storage-use-azcopy.md#upload-blobs-to-blob-storage) to copy or upload VHD files to the storage account that's associated with the lab.
* Use [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md). Storage Explorer is a standalone app that runs on Windows, OS X, and Linux.   

To find the destination storage account that's associated with your lab:

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).
2. On the left menu, select **Resource Groups**.
3. Find and select the resource group that's associated with your lab.
4. Under **Overview**, select one of the storage accounts.
5. Select **Blobs**.
6. Look for uploads in the list. If none exists, return to step 4 and try another storage account.
7. Use the **URL** as the destination in your AzCopy command.

## How do I automate the process of deleting all the VMs in my lab?
You can delete VMs from your lab in the Azure portal. You also can delete all the VMs in your lab by using a PowerShell script. In the following example, under the **Values to change** comment, modify the parameter values. You can retrieve the `subscriptionId`, `labResourceGroup`, and `labName` values from the lab pane in the Azure portal.

    # Delete all the VMs in a lab.

    # Values to change:
    $subscriptionId = "<Enter Azure subscription ID here>"
    $labResourceGroup = "<Enter lab's resource group here>"
    $labName = "<Enter lab name here>"

    # Sign in to your Azure account.
    Connect-AzureRmAccount

    # Select the Azure subscription that has the lab. This step is optional
    # if you have only one subscription.
    Select-AzureRmSubscription -SubscriptionId $subscriptionId

    # Get the lab that has the VMs that you want to delete.
    $lab = Get-AzureRmResource -ResourceId ('subscriptions/' + $subscriptionId + '/resourceGroups/' + $labResourceGroup + '/providers/Microsoft.DevTestLab/labs/' + $labName)

    # Get the VMs from that lab.
    $labVMs = Get-AzureRmResource | Where-Object {
              $_.ResourceType -eq 'microsoft.devtestlab/labs/virtualmachines' -and
              $_.Name -like "$($lab.Name)/*"}

    # Delete the VMs.
    foreach($labVM in $labVMs)
    {
        Remove-AzureRmResource -ResourceId $labVM.ResourceId -Force
    }

**Artifacts**
## What are artifacts?
Artifacts are customizable elements that you can use to deploy your latest bits or deploy your dev tools to a VM. Attach artifacts to your VM when you create the VM. After the VM is provisioned, the artifacts deploy and configure your VM. Various preexisting artifacts are available in our [public GitHub repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts). You can also [author your own artifacts](devtest-lab-artifact-author.md).


**Lab configuration**
## How do I create a lab from a Resource Manager template?
We offer a [GitHub repository of lab Azure Resource Manager templates](https://aka.ms/dtlquickstarttemplate) that you can deploy as-is or modify to create custom templates for your labs. Each template has a link to deploy the lab as-is in your own Azure subscription. Or, you can customize the template and [deploy by using PowerShell or Azure CLI](../azure-resource-manager/resource-group-template-deploy.md).

## Why are my VMs created in different resource groups, with arbitrary names? Can I rename or modify these resource groups?
Resource groups are created this way so that DevTest Labs can manage user permissions and access to VMs. Although you can move a VM to another resource group, and use the name that you want, we recommend that you don't make changes to the resource groups. We are working on improving this experience to allow more flexibility.   

## How many labs can I create under the same subscription?
There isn't a specific limit on the number of labs that can be created per subscription. However, the amount of resources used per subscription is limited. You can read about the [limits and quotas for Azure subscriptions](../azure-subscription-service-limits.md) and [how to increase these limits](https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests).

## How many VMs can I create per lab?
There is no specific limit on the number of VMs that can be created per lab. However, the resources (VM cores, public IP addresses, and so on) that are used are limited per subscription. You can read about the [limits and quotas for Azure subscriptions](../azure-subscription-service-limits.md) and [how to increase these limits](https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests).

## How do I share a direct link to my lab?

1. In the Azure portal, go to the lab.
2. Copy the lab URL from your browser, and then share it with your lab users.

> [!NOTE]
> If a lab user is an external user who has a [Microsoft account](#what-is-a-microsoft-account), but who is not a member of your organization's Active Directory instance, the user might see an error message when they try to access the shared link. If an external user sees an error message, ask the user to first select their name in the upper-right corner of the Azure portal. Then, in the **Directory** section of the menu, the user can select the directory where the lab exists.
>
>

## What is a Microsoft account?
A Microsoft account is an account you use for almost everything you do with Microsoft devices and services. It’s an email address and password that you use to sign in to Skype, Outlook.com, OneDrive, Windows phone, and Xbox Live. A single account means that your files, photos, contacts, and settings can follow you on any device.

> [!NOTE]
> A Microsoft account used to be called a *Windows Live ID*.
>
>


**Troubleshooting**
## My artifact failed during VM creation. How do I troubleshoot it?
To learn how to get logs for your failed artifact, see [How to diagnose artifact failures in DevTest Labs](devtest-lab-troubleshoot-artifact-failure.md).

## Why isn't my existing virtual network saving properly?
One possibility is that your virtual network name contains periods. If so, try removing the periods or replacing them with hyphens. Then, try again to save the virtual network.

## Why do I get a "Parent resource not found" error when I provision a VM from PowerShell?
When one resource is a parent to another resource, the parent resource must exist before you create the child resource. If the parent resource does not exist, you see a **ParentResourceNotFound** message. If you don't specify a dependency on the parent resource, the child resource might be deployed before the parent.

VMs are child resources under a lab in a resource group. When you use Resource Manager templates to deploy VMs by using PowerShell, the resource group name provided in the PowerShell script should be the resource group name of the lab. For more information, see [Troubleshoot common Azure deployment errors](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-common-deployment-errors#parentresourcenotfound).

## Where can I find more error information if a VM deployment fails?
VM deployment errors are captured in activity logs. You can find lab VM activity logs under **Audit logs** or **Virtual machine diagnostics** on the resource menu on the lab's VM blade (the blade appears after you select the VM from the **My virtual machines** list).

Sometimes, the deployment error occurs before VM deployment begins. An example is when the subscription limit for a resource that was created with the VM is exceeded. In this case, the error details are captured in the lab-level activity logs. Activity logs are located at the bottom of the **Configuration and policies** settings. For more information about using activity logs in Azure, see [View activity logs to audit actions on resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-audit).

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

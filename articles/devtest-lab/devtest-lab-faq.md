<properties
	pageTitle="DevTest Labs FAQ | Microsoft Azure"
	description="Find answers to common DevTest Labs questions"
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
	ms.date="08/01/2016"
	ms.author="tarcher"/>

# DevTest Labs FAQ

## General
- [Why should I use DevTest Labs?](#why-should-i-use-devtest-labs) 
- [What does "worry free, self-service" mean?](#what-does-worry-free-self-service-mean)
- [How can I use DevTest Labs?](#how-can-i-use-devtest-labs) 
- [How will I be charged for DevTest Labs?](#how-will-i-be-charged-for-devtest-labs) 
 
## Security 
- [What are the different security levels in DevTest Labs?](#what-are-the-different-security-levels-in-devtest-labs) 
- [How do I create a specific role to allow users to perform only a single task?](#how-do-i-create-a-specific-role-to-allow-users-to-perform-only-a-single-task) 
 
## CI/CD Integration & Automation 
 
- [Does DevTest Labs integrate with my CI/CD toolchain?](#does-devtest-labs--integrate-with-my-cicd-toolchain) 
 
## Virtual Machines 
 
- [Why can't I see certain VMs in the Azure Virtual Machines blade that I see within DevTest Labs?](#why-cant-i-see-certain-vms-in-the-azure-virtual-machines-blade-that-i-see-within-devtest-labs) 
- [What is the difference between custom images and formulas?](#what-is-the-difference-between-custom-images-and-formulas) 
- [How do I create multiple VMs from the same template at once?](#how-do-i-create-multiple-vms-from-the-same-template-at-once) 
- [How do I move my existing Azure VMs into my DevTest Labs lab?](#how-do-i-move-my-existing-azure-vms-into-my-devtest-labs-lab) 
- [Can I attach multiple disks to my VMs?](#can-i-attach-multiple-disks-to-my-vms) 
- [How do I automate the process of uploading VHD files to create custom images?](#how-do-i-automate-the-process-of-uploading-vhd-files-to-create-custom-images) 
 
## Artifacts 
 
- [What are artifacts?](#what-are-artifacts) 
 
## Lab configuration 
 
- [How do I create a lab from an ARM template?](#how-do-i-create-a-lab-from-an-arm-template) 
- [Why are all of my VMs created in different resource groups with arbitrary names? Can I rename or modify these resource groups?](#why-are-all-of-my-vms-created-in-different-resource-groups-with-arbitrary-names-can-i-rename-or-modify-these-resource-groups) 
- [How many labs can I create under the same subscription?](#how-many-labs-can-i-create-under-the-same-subscription)
- [How many VMs can I create per lab?](#how-many-vms-can-i-create-per-lab)
 
## Troubleshooting 
 
- [My artifact failed during VM creation. How do I troubleshoot it?](#my-artifact-failed-during-vm-creation-how-do-i-troubleshoot-it) 
- [Why isn't my existing virtual network saving properly?](#why-isnt-my-existing-virtual-network-saving-properly)  

### Why should I use DevTest Labs? 
DevTest Labs can save your team time and money. Developers can create their own environments using a number of different bases, and use artifacts to quickly deploy and configure applications. Using custom images and formulas, virtual machines can be saved as templates and easily reproduced. On top of all of this, the lab offers several policies ― such as auto-shutdown, cost threshold, max VMs per user, max VM sizes ― that allow lab administrators to reduce waste and effortlessly manage a team's environments. For a more in depth explanation of DevTest Labs, read the [overview](devtest-lab-overview.md) or check out the [introductory video](/documentation/videos/videos/what-is-azure-devtest-labs). 

### What does "worry free, self-service" mean?
It means that developers and testers can create their own environments as needed, and administrators have the security of knowing that DevTest Labs will help minimize waste and control cost. They can specify which VM sizes are allowed, the maximum number of VMs, and when VMs are started and shut down. It is also easy to monitor costs and set alerts in order to stay aware of how resources in the lab are being used. 

### How can I use DevTest Labs? 
DevTest Labs is useful anytime you require dev or test environments, and you want to reproduce them quickly and/or manage them with cost saving policies. Here are some possible scenarios that our customers use DevTest Labs for: 
To manage their team's dev and test environments in one place, utilizing policies to reduce cost and custom images to share builds across the team 
Developing an application, using custom images to save the disk state throughout stages of development and track the cost in relation to progress. 
Creating mass test environments for quality assurance testing, using artifacts and formulas to easily configure and reproduce an application on various environments. 
Distributing VMs for hackathons, and then easily de-provisioning them when the event ends 

### How will I be charged for DevTest Labs? 
DevTest Labs is a free service, meaning that creating labs and configuring the policies, templates, and artifacts in Labs is free. You pay only for the Azure resources used within Labs, such as virtual machines, storage accounts, and virtual networks. For more information on the cost of Labs resources, read about [Azure DevTest Labs pricing](https://azure.microsoft.com/en-us/pricing/details/devtest-lab/). 

### What are the different security levels in DevTest Labs?  
Security access is determined by [Azure Role-Based Access Control (RBAC)](../active-directory/role-based-access-built-in-roles.md). To understand how access works, it helps to understand the differences between a permission, a role, and a scope as defined by RBAC. A permission is a defined access to a specific action (e.g. read-access to all virtual machines). A role is a set of permissions that can be grouped and assigned to a user (e.g. "subscription owner" has access to all resources within a subscription). A scope is a level within the hierarchy of Azure resource (e.g. a resource group or a single lab or the entire subscription). 
 
Within the scope of DevTest Labs, there are two types of roles to define user permissions: lab owner and lab user. A lab owner has the access to any resources within the lab; thus, they can modify policies, read and write any VMs, change the virtual network, and so on. A lab user can view all lab resources, such as VMs, policies, and virtual networks, but they cannot modify policies or any VMs created by other users. It is also possible to create custom roles in DevTest Labs, and you can learn how to do in the article, [Grant user permissions to specific lab policies](devtest-lab-grant-user-permissions-to-specific-lab-policies.md). 
 
Since scopes are hierarchical, when a user has permissions at a certain scope, they are automatically granted those permissions at every lower-level scope encompassed. For instance, if a user is assigned to the role of subscription owner, then they have access to all resources in a subscription, which include all virtual machines, all virtual networks, and all DevTest Labs. Thus a subscription owner automatically inherits the role of lab owner. However, the opposite is not true. A lab owner has access to a DevTest Labs lab, which is a lower scope than the subscription level. Therefore, a lab owner will not be able to see virtual machines or virtual networks or any resources that are outside of the lab. 

### How do I create a specific role to allow users to perform only a single task?
A comprehensive article about how to create custom roles and assign permissions to that role can be found here. Here is an example of a script that creates the role "DevTest Labs Advanced User", which has permission to start and stop all VMs in the lab:
 
	$policyRoleDef = (Get-AzureRmRoleDefinition "DevTest Labs User") 
	$policyRoleDef.Actions.Remove('Microsoft.DevTestLab/Environments/*') 
	$policyRoleDef.Id = $null 
	$policyRoleDef.Name = "DevTest Labs Advance User" 
	$policyRoleDef.IsCustom = $true 
	$policyRoleDef.AssignableScopes.Clear() 
	$policyRoleDef.AssignableScopes.Add("subscriptions/<subscription Id>") 
	$policyRoleDef.Actions.Add("Microsoft.DevTestLab/labs/virtualMachines/Start/action") 
	$policyRoleDef.Actions.Add("Microsoft.DevTestLab/labs/virtualMachines/Stop/action") 
	$policyRoleDef = (New-AzureRmRoleDefinition -Role $policyRoleDef)  
 
### Does DevTest Labs integrate with my CI/CD toolchain? 
If you are using VSTS, there is an [Azure DevTest Labs Tasks extension](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks) that allows you to automate your release pipeline in DevTest Labs. Some of the possible uses of this extension include:

- Creating and deploying a VM automatically and configuring it with the latest build using Azure File Copy or PowerShell VSTS tasks. 
- Automatically capturing the state of a VM after testing to reproduce a bug on the same VM for further investigation. 
- Deleting the VM at the end of the release pipeline as soon as it is no longer needed. 

The following blog posts provide guidance and information about using the VSTS extension:
 
- [Azure DevTest Labs – VSTS extension](https://blogs.msdn.microsoft.com/devtestlab/2016/06/15/azure-devtest-labs-vsts-extension/) 
- [Deploying a new VM in an existing AzureDevTestLab from VSTS](http://www.visualstudiogeeks.com/blog/DevOps/Deploy-New-VM-To-Existing-AzureDevTestLab-From-VSTS) 
- [Using VSTS Release Management for Continuous Deployments to AzureDevTestLabs](http://www.visualstudiogeeks.com/blog/DevOps/Use-VSTS-ReleaseManagement-to-Deploy-and-Test-in-AzureDevTestLabs) 
 
For other CI/CD toolchains, all of the aforementioned scenarios that can be achieved through the VSTS tasks extension can be similarly achieved through deploying [ARM templates](https://github.com/Azure/azure-devtestlab/tree/master/ARMTemplates) using [Azure PowerShell cmdlets](../resource-group-template-deploy.md) and [.NET SDKs](https://www.nuget.org/packages/Microsoft.Azure.Management.DevTestLabs/). You can also use [REST APIs for DevTest Labs](http://aka.ms/dtlrestapis) to integrate with your toolchain.  

### Why can't I see certain VMs in the Azure Virtual Machines blade that I see within DevTest Labs?
When a VM is created in Labs, permission is given to you to access that VM, and you will be able to see it both in Labs and the Virtual Machines blade. If you are a DevTest Labs user, this enables you to see all virtual machines created in the Lab through the Lab's "All Virtual Machines" blade. However, as a DevTest Labs user, you are not automatically granted read-access to VM resources that others have created, so they will not be shown to you in the Virtual Machines blade. 

### What is the difference between custom images and formulas? 
A custom image is a VHD, whereas a formula is an image that you can configure with additional settings that you can save and reproduce. A custom image may be preferable if you want to quickly create several environments with the same basic, immutable image. A formula may be better if you want to reproduce the configuration of your VM with the latest bits, a virtual network/subnet, or a specific size. For a more in depth explanation, see the article, [Comparing custom images and formulas in DevTest Labs](devtest-lab-comparing-vm-base-image-types.md). 
 
### How do I create multiple VMs from the same template at once? 
You can use the [VSTS tasks extension](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks) or [generate an ARM template](devtest-lab-add-vm-with-artifacts.md/#save-arm-template) while creating a VM and [deploy the ARM template from Windows PowerShell](../resource-group-template-deploy.md). 
 
### How do I move my existing Azure VMs into my DevTest Labs lab? 
We are designing a solution to directly move VMs to DevTest Labs, but currently you can copy your existing VMs to DevTest Labs as follows: 

1. Copy the VHD file of your existing VM using this [Windows PowerShell script](https://github.com/Azure/azure-devtestlab/blob/master/Scripts/CopyVHDFromVMToLab.ps1) 
1. [Create the custom image](devtest-lab-create-template.md) inside your DevTest Labs lab. 
1. Create a VM in the lab from your custom image 
 
### Can I attach multiple disks to my VMs? 
Yes, we have recently added this feature to labs.  
 
### How do I automate the process of uploading VHD files to create custom images? 
There are two options. You can use [Azure AzCopy](../storage/storage-use-azcopy.md/#blob-upload) to copy or upload VHD files to the storage account associated with the lab, or you can use [Microsoft Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) if you prefer a GUI.  
 
To find the destination storage account associated with your lab: 

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040). 
1. Select **Resource Groups** from the left hand panel. 
1. Locate and select the resource group associated with your lab. 
1. On the **Overview** blade, select one of the storage accounts. 
1. Select **Blobs**.
1. Look for uploads in the list. If none exist, return to Step #4 and try another storage account.
1. Use the **URL** as your destination in your AzCopy command.

### What are artifacts? 
Artifacts are customizable elements that can used to deploy your latest bits or your dev tools onto a VM. They are attached to your VM during creation with a few simple clicks, and once the VM is provisioned, the artifacts deploy and configure your VM. There are a number of preexisting artifacts in our [public Github repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts), but you can also easily [author your own artifacts](devtest-lab-artifact-author.md). 

### How do I create a lab from an ARM template? 
We have a Github repository of lab ARM templates. Each of these templates has a link that you can click to deploy the DevTest Labs lab under your own Azure subscription. 
 
### Why are all of my VMs created in different resource groups with arbitrary names? Can I rename or modify these resource groups? 
Resource groups are created this way in order for DevTest Labs to manage the user permissions and access to virtual machines. We are working on improving this experience to allow more flexibility, but you can rename these resource groups as needed. It is advised that you do not move VMs into different resource groups to avoid unintentionally modifying permissions. 
 
### How many labs can I create under the same subscription? 
There is no specific limit on the number of labs that can be created per subscription, but the resources used are limited per subscription. You can read about the limits and quotas imposed on Azure subscriptions and how to increase these limits. 
 
### How many VMs can I create per lab? 
There is no specific limit on the number of VMs that can be created per lab, but currently the lab only supports about 40 VMs running at the same time in standard storage, and 25 VMs running concurrently in premium storage. These limits also vary based on the  We are currently working on increasing these limitations. 
 
### My artifact failed during VM creation. How do I troubleshoot it? 
Try using this blog post, written by our MVPs, to learn how to obtain logs regarding your failed artifact. 
 
### Why isn't my existing virtual network saving properly?  
It may be because you have periods in the name of your virtual network. Try removing the periods or replacing them with hyphens, and then try saving you virtual network again.


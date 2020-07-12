---
title: Azure DevTest Labs FAQ | Microsoft Docs
description: This article provides answers to some of the frequently asked questions (FAQ) about Azure DevTest Labs.
ms.topic: article
ms.date: 06/26/2020
---

# Azure DevTest Labs FAQ
Get answers to some of the most common questions about Azure DevTest Labs.

## Blog post
Our DevTest Labs Team blog has been retired as of 20 March 2019. 

### Where can I track feature updates from now on?
From now on, we'll be posting feature updates and informative blog posts on the Azure blog and Azure updates. These blog posts will also link to our documentation wherever required.

Subscribe to the [DevTest Labs Azure Blog](https://azure.microsoft.com/blog/tag/azure-devtest-labs/) and [DevTest Labs Azure updates](https://azure.microsoft.com/updates/?product=devtest-lab) to stay informed about new features in DevTest Labs.

### What happens to the existing blog posts?
We're currently working on migrating existing blog posts (excluding outage updates) to our [DevTest Labs documentation](devtest-lab-overview.md). When the MSDN blog is deprecated, it will be redirected to the documentation overview for DevTest Labs. Once redirected, you can search for the article you're looking for in the 'Filter by' title. We haven't migrated all posts yet, but should be done by end of this month. 


### Where do I see outage updates?
We'll be posting outage updates using our Twitter handle from now onwards. Follow us on Twitter to get latest updates on outages and known bugs.

### Twitter
Our Twitter handle: [@azlabservices](https://twitter.com/azlabservices)

## General
### What if my question isn't answered here?
If your question isn't listed here, let us know, so we can help you find an answer.

- Post a question at the end of this FAQ.
- To reach a wider audience, post a question on the [Microsoft Q&A question page for Azure DevTest Labs](https://docs.microsoft.com/answers/topics/azure-devtestlabs.html). Engage with the Azure DevTest Labs team and other members of the community.
- For feature requests, submit your requests and ideas to [Azure DevTest Labs User Voice](https://feedback.azure.com/forums/320373-azure-devtest-labs).

### What is a Microsoft account?
A Microsoft account is an account you use for almost everything you do with Microsoft devices and services. It’s an email address and password that you use to sign into Skype, Outlook.com, OneDrive, Windows phone, Azure, and Xbox Live. A single account means that your files, photos, contacts, and settings can follow you on any device.

> [!NOTE]
> A Microsoft account used to be called a Windows Live ID.

### Why should I use Azure DevTest Labs?
Azure DevTest Labs can save your team time and money. Developers can create their own environments by using several different bases. They also can use artifacts to quickly deploy and configure applications. By using custom images and formulas, you can save virtual machines (VMs) as templates, and easily reproduce them across the team. DevTest Labs also offers several configurable policies that lab administrators can use to reduce waste and manage a team's environments. These policies include auto-shutdown, cost threshold, maximum VMs per user, and maximum VM size. For a more in-depth explanation of DevTest Labs, see the [overview](devtest-lab-overview.md) or the [introductory video](https://channel9.msdn.com/Blogs/Azure/what-is-azure-devtest-labs).

### What does "worry-free self-service" mean?
Worry-free self-service means that developers and testers create their own environments as needed. Administrators have the security of knowing that DevTest Labs can help set the appropriate access, minimize waste and control costs. Administrators can specify which VM sizes are allowed, the maximum number of VMs, and when VMs are started and shut down. DevTest Labs also makes it easy to monitor costs and set alerts, to help you stay aware of how lab resources are being used.

### How can I use DevTest Labs?
DevTest Labs is useful anytime you require dev or test environments, and want to reproduce them quickly, or manage them by using cost-saving policies.
Here are some scenarios that our customers use DevTest Labs for:

- Manage dev and test environments in one place. Use policies to reduce costs and create custom images to share builds across the team.
- Develop an application by using custom images to save the disk state throughout the development stages.
- Track cost in relation to progress.
- Create mass test environments for quality assurance testing.
- Use artifacts and formulas to easily configure and reproduce an application in various environments.
- Distribute VMs for hackathons (collaborative dev or test work), and then easily deprovision them when the event ends.

### How am I billed for DevTest Labs?
DevTest Labs is a free service. Creating labs and configuring policies, templates, and artifacts in DevTest Labs is free. You pay only for the Azure resources used in your labs, such as VMs, storage accounts, and virtual networks. For more information about the cost of lab resources, see [Azure DevTest Labs pricing](https://azure.microsoft.com/pricing/details/devtest-lab/).

## Security

### What are the different security levels in DevTest Labs?
Security access is determined by Role-Based Access Control (RBAC). To learn how access works, it helps to learn the differences between a permission, a role, and a scope, as defined by RBAC.

- **Permission**: A permission is a defined access to a specific action. For example, a permission can be read access to all VMs.
- **Role**: A role is a set of permissions that can be grouped and assigned to a user. For example, a user with a subscription owner role has access to all resources within a subscription.
- **Scope**: A scope is a level within the hierarchy of an Azure resource. For example, a scope can be a resource group, a single lab, or the entire subscription.

Within the scope of DevTest Labs, there are two types of roles that define user permissions:

- **Lab owner**: A lab owner has access to all resources in the lab. A lab owner can modify policies, read and write to any VMs, change the virtual network, and so on.
- **Lab user**: A lab user can view all lab resources, such as VMs, policies, and virtual networks. However, a lab user can't modify policies or any VMs that were created by other users.

You also can create custom roles in DevTest Labs. To learn how to create custom roles in DevTest Labs, see [Grant user permissions to specific lab policies](devtest-lab-grant-user-permissions-to-specific-lab-policies.md).

Because scopes are hierarchical, when a user has permissions at a certain scope, the user is automatically granted those permissions at every lower-level scope in the scope. For instance, if a user is assigned the role of subscription owner, the user has access to all resources in a subscription. These resources include VMs, virtual networks, and labs. A subscription owner automatically inherits the role of lab owner. However, the opposite is not true. A lab owner has access to a lab, which is a lower scope than the subscription level. So, a lab owner can't see VMs, virtual networks, or any other resources that are outside the lab.

### How do I define role-based access control for my DevTest Labs environments to ensure that IT can govern while developers/test can do their work?
There is a broad pattern, however the detail depends on your organization.

Central IT should own only what is necessary and enable the project and application teams to have the needed level of control. Typically, it means that central IT owns the subscription and handles core IT functions such as networking configurations. The set of **owners** for a subscription should be small. These owners can nominate additional owners when there's a need, or apply subscription-level policies, for example “No Public IP”.

There may be a subset of users that require access across a subscription, such as Tier1 or Tier 2 support. In this case, we recommend that you give these users the **contributor** access so that they can manage the resources, but not provide user access or adjust policies.

The DevTest Labs resource should be owned by owners who are close to the project/application team. It's because they understand their requirements for machines, and required software. In most organizations, the owner of this DevTest Labs resource is commonly the project/development lead. This owner can manage users and policies within the lab environment and can manage all VMs in the DevTest Labs environment.

The project/application team members should be added to the **DevTest Labs Users** role. These users can create virtual machines (in-line with the lab and subscription-level policies). They can also manage their own virtual machines. They can't manage virtual machines that belong to other users.

For more information, see [Azure enterprise scaffold – prescriptive subscription governance documentation](/azure/architecture/cloud-adoption/appendix/azure-scaffold).


### How do I create a role to allow users to do a specific task?
For a comprehensive article about how to create custom roles and assign permissions to a role, see [Grant user permissions to specific lab policies](devtest-lab-grant-user-permissions-to-specific-lab-policies.md). Here's an example of a script that creates the role **DevTest Labs Advanced User**, which has permission to start and stop all VMs in the lab:


```powershell
$policyRoleDef = Get-AzRoleDefinition "DevTest Labs User"
$policyRoleDef.Actions.Remove('Microsoft.DevTestLab/Environments/*')
$policyRoleDef.Id = $null
$policyRoleDef.Name = "DevTest Labs Advanced User"
$policyRoleDef.IsCustom = $true
$policyRoleDef.AssignableScopes.Clear()
$policyRoleDef.AssignableScopes.Add("subscriptions/<subscription Id>")
$policyRoleDef.Actions.Add("Microsoft.DevTestLab/labs/virtualMachines/Start/action")
$policyRoleDef.Actions.Add("Microsoft.DevTestLab/labs/virtualMachines/Stop/action")
$policyRoleDef = New-AzRoleDefinition -Role $policyRoleDef  
```

### How can an organization ensure corporate security policies are in place?
An organization may achieve it by doing the following actions:

- Developing and publishing a comprehensive security policy. The policy articulates the rules of acceptable use associated with the using software, cloud assets. It also defines what clearly violates the policy.
- Develop a custom image, custom artifacts, and a deployment process that allows for orchestration within the security realm that is defined with active directory. This approach enforces the corporate boundary and sets a common set of environmental controls. These controls against the environment a developer can consider as they develop and follow a secure development lifecycle as part of their overall process. The objective also is to provide an environment that isn't overly restrictive that may hinder development, but a reasonable set of controls. The group policies at the organization unit (OU) that contains lab virtual machines could be a subset of the total group policies that are found in production. Alternatively, they can be an additional set to properly mitigate any identified risks.

### How can an organization ensure data integrity to ensure that remoting developers can't remove code or introduce malware or unapproved software?
There are several layers of control to mitigate the threat from external consultants, contractors, or employees that are remoting in to collaborate in DevTest Labs.

As stated previously, the first step must have an acceptable use policy drafted and defined that clearly outlines the consequences when someone violates the policy.

The first layer of controls for remote access is to apply a remote access policy through a VPN connection that isn't directly connected to the lab.

The second layer of controls is to apply a set of group policy objects that prevent copy and paste through remote desktop. A network policy could be implemented to not allow outbound services from the environment such as FTP and RDP services out of the environment. User-defined routing could force all Azure network traffic back to on-premises, but the routing couldn't account for all URLs that might allow uploading of data unless controlled through a proxy to scan content and sessions. Public IPs could be restricted within the virtual network supporting DevTest Labs to not allow bridging of an external network resource.

Ultimately, the same type of restrictions needs to be applied across the organization, which would account for all possible methods of removable media or external URLs that could accept a post of content. Consult with your security professional to review and implement a security policy. For more recommendations, see [Microsoft Cyber Security](https://www.microsoft.com/security/default.aspx?&WT.srch=1&wt.mc_id=AID623240_SEM_sNYnsZDs).

## Lab configuration

### How do I create a lab from a Resource Manager template?
We offer a [GitHub repository of lab Azure Resource Manager templates](https://azure.microsoft.com/resources/templates/101-dtl-create-lab) that you can deploy as-is or modify to create custom templates for your labs. Each template has a link to deploy the lab as it's in your own Azure subscription. Or, you can customize the template and [deploy by using PowerShell or Azure CLI](../azure-resource-manager/templates/deploy-powershell.md).


### Can I have all virtual machines to be created in a common resource group instead having each machine in its own resource group?
Yes, as a lab owner, you can either let the lab handle resource group allocation for you or have all virtual machines created in a common resource group that you specify.

Separate resource group scenario:
-	DevTest Labs creates a new resource group for every public/private IP virtual machine you spin up
-	DevTest Labs creates a resource group for shared IP machines that belong to the same size.

Common resource group scenario:
-	All virtual machines are spun up in the common resource group you specify. Learn more [resource group allocation for the lab](https://aka.ms/RGControl).

### How do I maintain a naming convention across my DevTest Labs environment?
You may want to extend current enterprise naming conventions to Azure operations and make them consistent across the DevTest Labs environment. When deploying DevTest Labs, we recommend that you have specific starting policies. You deploy these policies by a central script and JSON templates to enforce consistency. Naming policies can be implemented through Azure policies applied at the subscription level. For JSON samples for Azure Policy, see [Azure Policy samples](../governance/policy/samples/index.md).

### How many labs can I create under the same subscription?
There isn't a specific limit on the number of labs that can be created per subscription. However, the amount of resources used per subscription is limited. You can read about the [limits and quotas for Azure subscriptions](../azure-resource-manager/management/azure-subscription-service-limits.md) and [how to increase these limits](https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests).


### How many VMs can I create per lab?
There is no specific limit on the number of VMs that can be created per lab. However, the resources (VM cores, public IP addresses, and so on) that are used are limited per subscription. You can read about the [limits and quotas for Azure subscriptions](../azure-resource-manager/management/azure-subscription-service-limits.md) and [how to increase these limits](https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests).

### How do I determine the ratio of users per lab and the overall number of labs that are needed across an organization?
We recommend that business units and development groups that are associated with the same development project are associated with the same lab. It allows for same types of policies, images, and shutdown policies to be applied to both groups.

You may also need to consider geographic boundaries. For example, developers in the North East United States (US) may use a lab provisioned in East US2. And, developers in Dallas, Texas, and Denver, Colorado may be directed to use a resource in US South Central. If there is a collaborative effort with an external third party, they could be assigned to a lab that is not used by internal developers.

You may also use a lab for a specific project within Azure DevOps Projects. Then, you apply security through a specified Azure Active Directory group, which allows access to both set of resources. The virtual network assigned to the lab can be another boundary to consolidate users.

### How can we prevent the deletion of resources within a lab?
We recommend that you set proper permissions at the lab level so that only authorized users can delete resources or change lab policies. Developers should be placed within the **DevTest Labs Users** group. The lead developer or the infrastructure lead should be the **DevTest Labs Owner**. We recommend you have only two lab owners. This policy extends towards the code repository to avoid corruption. Lab users have rights to use resources but can't update lab policies. See the following article that lists the roles and rights that each built-in group has within a lab: [Add owners and users in Azure DevTest Labs](devtest-lab-add-devtest-user.md).

### How do I share a direct link to my lab?

1. In the [Azure portal](https://portal.azure.com), go to the lab.
2. Copy the **lab URL** from your browser, and then share it with your lab users.

> [!NOTE]
> If a lab user is an external user who has a Microsoft account, but who is not a member of your organization's Active Directory instance, the user might see an error message when they try to access the shared link. If an external user sees an error message, ask the user to first select their name in the upper-right corner of the Azure portal. Then, in the Directory section of the menu, the user can select the directory where the lab exists.

## Virtual machines

### Why can't I see VMs on the Virtual Machines page that I see in DevTest Labs?
When you create a VM in DevTest Labs, you're given permission to access that VM. You can view the VM both on the labs page and on the **Virtual Machines** page. Users assigned to the **DevTest Labs Owner** role can see all VMs that were created in the lab on the lab's **All Virtual Machines** page. However, users who have the **DevTest Labs User** role are not automatically granted read access to VM resources that other users have created. So, those VMs are not displayed on the **Virtual Machines** page.


### How do I create multiple VMs from the same template at once?
You have two options for simultaneously creating multiple VMs from the same template:

- You can use the [Azure DevOps Tasks extension](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks).
- You can [generate a Resource Manager template](devtest-lab-add-vm.md#save-azure-resource-manager-template) while you're creating a VM, and [deploy the Resource Manager template from Windows PowerShell](../azure-resource-manager/templates/deploy-powershell.md).
- You can also specify more than one instance of a machine to be created during virtual machine creation. To learn more about creating multiple instances of virtual machines, see the doc on [creating a lab virtual machine](devtest-lab-add-vm.md).

### How do I move my existing Azure VMs into my DevTest Labs lab?
To copy your existing VMs to DevTest Labs:

1.	Copy the VHD file of your existing VM by using a [Windows PowerShell script](https://github.com/Azure/azure-devtestlab/blob/master/samples/DevTestLabs/Scripts/CopyVirtualMachines/CopyAzVHDFromVMToLab.ps1).
2.	Create the [custom image](devtest-lab-create-template.md) inside your DevTest Labs lab.
3.	Create a VM in the lab from your custom image.

### Can I attach multiple disks to my VMs?

Yes, you can attach multiple disks to your VMs.

### Are Gen 2 images supported by DevTest Labs?
No. The DevTest Labs service doesn't support [Gen 2 images](../virtual-machines/windows/generation-2.md). If both Gen 1 and Gen 2 versions are available for an image, DevTest Labs shows only the Gen 1 version of the image when creating a VM. You won't see an image if there is only Gen 2 version of it available. 

### If I want to use a Windows OS image for my testing, do I have to purchase an MSDN subscription?
To use Windows client OS images (Windows 7 or a later version) for your development or testing in Azure, take one of the following steps:

- [Buy an MSDN subscription](https://www.visualstudio.com/products/how-to-buy-vs).
- If you have an Enterprise Agreement, create an Azure subscription with the [Enterprise Dev/Test offer](https://azure.microsoft.com/offers/ms-azr-0148p).

For more information about the Azure credits for each MSDN offering, see [Monthly Azure credit for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/).


### How do I automate the process of deleting all the VMs in my lab?
As a lab owner, you can delete VMs from your lab in the Azure portal. You also can delete all the VMs in your lab by using a PowerShell script. In the following example, under the **values to change** comment, modify the parameter values. You can retrieve the subscriptionId, labResourceGroup, and labName values from the lab pane in the Azure portal.

```powershell
# Delete all the VMs in a lab.

# Values to change:
$subscriptionId = "<Enter Azure subscription ID here>"
$labResourceGroup = "<Enter lab's resource group here>"
$labName = "<Enter lab name here>"

# Sign in to your Azure account.
Connect-AzAccount

# Select the Azure subscription that has the lab. This step is optional
# if you have only one subscription.
Select-AzSubscription -SubscriptionId $subscriptionId

# Get the lab that has the VMs that you want to delete.
$lab = Get-AzResource -ResourceId ('subscriptions/' + $subscriptionId + '/resourceGroups/' + $labResourceGroup + '/providers/Microsoft.DevTestLab/labs/' + $labName)

# Get the VMs from that lab.
$labVMs = Get-AzResource | Where-Object {
          $_.ResourceType -eq 'microsoft.devtestlab/labs/virtualmachines' -and
          $_.Name -like "$($lab.Name)/*"}

# Delete the VMs.
foreach($labVM in $labVMs)
{
    Remove-AzResource -ResourceId $labVM.ResourceId -Force
}
```

## Environments

### How can I use Resource Manager templates in my DevTest Labs Environment?
You deploy your Resource Manager templates into a DevTest Labs environment by using steps mentioned in the [Environments feature in DevTest Labs](devtest-lab-test-env.md) article. Basically, you check your Resource Manager templates into a Git Repository (either Azure Repos or GitHub), and add a [private repository for your templates](devtest-lab-test-env.md) to the lab. This scenario may not be useful if you're using DevTest Labs to host development machines but may be useful if you're building a staging environment, which is representative of production.

It's also worth noting that the number of virtual machines per lab or per user option only limits the number of machines natively created in the lab itself, and not by any environments (Resource Manager templates).

## Custom Images

### How can I set up an easily repeatable process to bring my custom organizational images into a DevTest Labs environment?
See this [video on Image Factory pattern](https://sec.ch9.ms/ch9/8e8a/9ea0b8d4-b803-4f23-bca4-4808d9368e8a/dtlimagefactory_mid.mp4). This scenario is an advanced scenario, and the scripts provided are sample scripts only. If any changes are required, you need to manage and maintain the scripts used in your environment.

For detailed information on creating an image factory, see [Create a custom image factory in Azure DevTest Labs](image-factory-create.md).

### What is the difference between a custom image and a formula?
A custom image is a managed image. A formula is an image that you can configure with additional settings, and then save and reproduce. A custom image might be preferable if you want to quickly create several environments by using the same basic, immutable image. A formula might be better if you want to reproduce the configuration of your VM with the latest bits, as part of a virtual network or subnet, or as a VM of a specific size. For a more in-depth explanation, see [Comparing custom images and formulas in DevTest Labs](devtest-lab-comparing-vm-base-image-types.md).

### When should I use a formula vs. custom image?
Typically, the deciding factor in this scenario is cost and reuse. If you have a scenario where many users/labs require an image with a lot of software on top of the base image, then you could reduce costs by creating a custom image. It means that the image is created once. It reduces the setup time of the virtual machine and the cost incurred due to the virtual machine running when setup occurs.

However, an additional factor to note is the frequency of changes to your software package. If you run daily builds and require that software to be on your users’ virtual machines, consider using a formula instead of a custom image.

For a more in-depth explanation, see [Comparing custom images and formulas](devtest-lab-comparing-vm-base-image-types.md) in DevTest Labs.

### How do I automate the process of uploading VHD files to create custom images?

To automate uploading VHD files to create custom images, you have two options:

- Use [AzCopy](../storage/common/storage-use-azcopy-v10.md) to copy or upload VHD files to the storage account that's associated with the lab.
- Use [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md). Storage Explorer is a standalone app that runs on Windows, OS X, and Linux.

To find the destination storage account that's associated with your lab:

1.	Sign in to the [Azure portal](https://portal.azure.com).
2.	On the left menu, select **Resource Groups**.
3.	Find and select the resource group that's associated with your lab.
4.	Under **Overview**, select one of the storage accounts.
5.	Select **Blobs**.
6.	Look for uploads in the list. If none exists, return to step 4 and try another storage account.
7.	Use the **URL** as the destination in your AzCopy command.

When should I use an Azure Marketplace image vs. my own custom organizational image?

### When should I use an Azure Marketplace image vs. my own custom organizational image?
Azure Marketplace should be used by default unless you have specific concerns or organizational requirements. Some common examples include;

- Complex software setup that requires an application to be included as part of the base image.
- Installation and setup of an application could take many hours, which aren't an efficient use of compute time to be added on an Azure Marketplace image.
- Developers and testers require access to a virtual machine quickly, and want to minimize the setup time of a new virtual machine.
- Compliance or regulatory conditions (for example, security policies) that must be in place for all machines.
- Using custom images shouldn't be considered lightly. They introduce extra complexity, as you now must manage VHD files for those underlying base images. You also need to routinely patch those base images with software updates. These updates include new operating system (OS) updates, and any updates or configuration changes needed for the software package itself.

## Artifacts

### What are artifacts?
Artifacts are customizable elements that you can use to deploy your latest bits or deploy your dev tools to a VM. Attach artifacts to your VM when you create the VM. After the VM is provisioned, the artifacts deploy and configure your VM. Various pre-existing artifacts are available in our [public GitHub repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts). You can also [author your own artifacts](devtest-lab-artifact-author.md).

### My artifact failed during VM creation. How do I troubleshoot it?
To learn how to get logs for your failed artifact, see [How to diagnose artifact failures in DevTest Labs](devtest-lab-troubleshoot-artifact-failure.md).

### When should an organization use a public artifact repository vs. private artifact repository in DevTest Labs?
The [public artifact repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts) provides an initial set of software packages that are most commonly used. It helps with rapid deployment without having to invest time to reproduce common developer tools and add-ins. You can choose to deploy their own private repository. You can use a public and a private repository in parallel. You may also choose to disable the public repository. The criteria to deploy a private repository should be driven by the following questions and considerations:

- Does the organization have a requirement to have corporate licensed software as part of their DevTest Labs offering? If the answer is yes, then a private repository should be created.
- Does the organization develop custom software that provides a specific operation, which is required as part of the overall provisioning process? If the answer is yes, then a private repository should be deployed.
- If organization's governance policy requires isolation, and external repositories aren't under direct configuration management by the organization, a private artifact repository should be deployed. As part of this process, an initial copy of the public repository can be copied and integrated with the private repository. Then, the public repository can be disabled so that no one within the organization can access it anymore. This approach forces all users within the organization to have only a single repository that is approved by the organization and minimize configuration drift.


### Should an organization plan for a single repository or allow multiple repositories?
As part of your organization's overall governance and configuration management strategy, we recommend that you use a centralized repository. When you use multiple repositories, they may become silos of unmanaged software over the time. With a central repository, multiple teams can consume artifacts from this repository for their projects. It enforces standardization, security, ease of management, and eliminates the duplication of efforts. As part of the centralization, the following actions are recommended practices for long-term management and sustainability:

- Associate the Azure Repos with the same Azure Active Directory tenant that the Azure subscription is using for authentication and authorization.
- Create a group named `All DevTest Labs Developers` in Azure Active Directory that is centrally managed. Any developer who contributes to artifact development should be placed in this group.
- The same Azure Active Directory group can be used to provide access to the Azure Repos repository and to the lab.
- In Azure Repos, branching or forking should be used to a separate an in-development repository from the primary production repository. Content is only added to the master branch with a pull request after a proper code review. Once the code reviewer approves the change, a lead developer, who is responsible for maintenance of the master branch, merges the updated code.

## CI/CD integration

### Does DevTest Labs integrate with my CI/CD toolchain?
If you're using Azure DevOps, you can use a [DevTest Labs Tasks extension](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks) to automate your release pipeline in DevTest Labs. Some of the tasks that you can do with this extension include:

- Create and deploy a VM automatically. You also can configure the VM with the latest build by using Azure File Copy or PowerShell Azure DevOps Services tasks.
- Automatically capture the state of a VM after testing to reproduce a bug on the same VM for further investigation.
- Delete the VM at the end of the release pipeline, when it's no longer needed.

The following blog posts offer guidance and information about using the Azure DevOps Services extension:

- [DevTest Labs and the Azure DevOps extension](integrate-environments-devops-pipeline.md)
- [Deploy a new VM in an existing DevTest Labs lab from Azure DevOps Services](https://www.visualstudiogeeks.com/blog/DevOps/Deploy-New-VM-To-Existing-AzureDevTestLab-From-VSTS)
- [Using Azure DevOps Services release management for continuous deployments to DevTest Labs](https://www.visualstudiogeeks.com/blog/DevOps/Use-VSTS-ReleaseManagement-to-Deploy-and-Test-in-AzureDevTestLabs)

For other continuous integration (CI)/continuous delivery (CD) toolchains, you can achieve the same scenarios by deploying [Azure Resource Manager templates](https://azure.microsoft.com/resources/templates/) by using [Azure PowerShell cmdlets](../azure-resource-manager/templates/deploy-powershell.md) and [.NET SDKs](https://www.nuget.org/packages/Microsoft.Azure.Management.DevTestLabs/). You also can use [REST APIs for DevTest Labs](https://aka.ms/dtlrestapis) to integrate with your toolchain.

## Networking

### When should I create a new virtual network for my DevTest Labs environment vs. using an existing virtual network?
If your VMs need to interact with existing infrastructure, then consider using an existing virtual network inside your DevTest Labs environment. If you use ExpressRoute, you may want to minimize the amount of VNets / Subnets so that you don’t fragment your IP address space that gets assigned for use in the subscriptions.

Consider using the VNet peering pattern here ([Hub-Spoke model](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke)) too. This approach enables vnet/subnet communication across subscriptions. Otherwise, each DevTest Labs environment could have its own virtual network.

There are [limits](../azure-resource-manager/management/azure-subscription-service-limits.md) on the number of virtual networks per subscription. The default amount is 50, though this limit can be raised to 100.

### When should I use a shared IP vs. public IP vs. private IP?

If you use a site-to-site VPN or Express Route, consider using private IPs so that your machines are accessible via your internal network, and inaccessible over public internet.

> [!NOTE]
> Lab owners can change this subnet policy to ensure that no one accidentally creates public IP addresses for their VMs. The subscription owner should create a subscription policy preventing public IPs from being created.

When using shared public IPs, the virtual machines in a lab share a public IP address. This approach can be helpful when you need to avoid breaching the limits on public IP addresses for a given subscription.

### How do I ensure that development and test virtual machines are unable to reach the public internet? Are there any recommended patterns to set up network configuration?

Yes. There are two aspects to consider – inbound and outbound traffic.

- **Inbound traffic** – If the virtual machine doesn't have a public IP address, then it cannot be reached by the internet. A common approach is to ensure that a subscription-level policy is set, such that no user can create a public IP address.
- **Outbound traffic** – If you want to prevent virtual machines accessing public internet directly and force traffic through a corporate firewall, then you can route traffic on-premises via express route or VPN, by using forced routing.

> [!NOTE]
> If you have a proxy server that blocks traffic without proxy settings, do not forget to add exceptions to the lab’s artifact storage account.

You could also use network security groups for virtual machines or subnets. This step adds an additional layer of protection to allow / block traffic.

## Troubleshooting

### Why isn't my existing virtual network saving properly?
One possibility is that your virtual network name contains periods. If so, try removing the periods or replacing them with hyphens. Then, try again to save the virtual network.

### Why do I get a "Parent resource not found" error when I provision a VM from PowerShell?
When one resource is a parent to another resource, the parent resource must exist before you create the child resource. If the parent resource doesn't exist, you see a **ParentResourceNotFound** message. If you don't specify a dependency on the parent resource, the child resource might be deployed before the parent.

VMs are child resources under a lab in a resource group. When you use Resource Manager templates to deploy VMs by using PowerShell, the resource group name provided in the PowerShell script should be the resource group name of the lab. For more information, see [Troubleshoot common Azure deployment errors](../azure-resource-manager/templates/common-deployment-errors.md).

### Where can I find more error information if a VM deployment fails?
VM deployment errors are captured in activity logs. You can find lab VM activity logs under **Audit logs** or **Virtual machine diagnostics** on the resource menu on the lab's VM page (the page appears after you select the VM from the My virtual machines list).

Sometimes, the deployment error occurs before VM deployment begins. An example is when the subscription limit for a resource that was created with the VM is exceeded. In this case, the error details are captured in the lab-level activity logs. Activity logs are located at the bottom of the **Configuration and policies** settings. For more information about using activity logs in Azure, see [View activity logs to audit actions on resources](../azure-resource-manager/management/view-activity-logs.md).

### Why do I get "location is not available for resource type" error when trying to create a lab?
You may see an error message similar to the following one when you try to create a lab:

```
The provided location 'australiacentral' is not available for resource type 'Microsoft.KeyVault/vaults'. List of available regions for the resource type is 'northcentralus,eastus,northeurope,westeurope,eastasia,southeastasia,eastus2,centralus,southcentralus,westus,japaneast,japanwest,australiaeast,australiasoutheast,brazilsouth,centralindia,southindia,westindia,canadacentral,canadaeast,uksouth,ukwest,westcentralus,westus2,koreacentral,koreasouth,francecentral,southafricanorth
```

You can resolve this error by taking one of the following steps:

#### Option 1
Check availability of the resource type in Azure regions on the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/) page. If the resource type isn't available in a certain region, DevTest Labs doesn't support creation of a lab in that region. Select another region when creating your lab.

#### Option 2
If the resource type is available in your region, check if it's registered with your subscription. It can be done at the subscription owner level as shown in [this article](../azure-resource-manager/management/resource-providers-and-types.md).

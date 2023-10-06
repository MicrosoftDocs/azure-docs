---
title: Lab accounts versus lab plans
titleSuffix: Azure Lab Services
description: Learn about the differences between lab accounts and lab plans in Azure Lab Services. Lab plans replace lab accounts and have some fundamental differences.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 08/07/2023
---

# Lab accounts versus lab plans in Azure Lab Services

In Azure Lab Services, lab plans replace lab accounts and there some fundamental differences between the two concepts. In this article, you get an overview of the changes that come with lab plans and how lab plans are different from lab accounts. Lab plans bring improvements in performance, reliability, and scalability. Lab plans also give you more flexibility for managing labs, using capacity, and tracking costs.

[!INCLUDE [preview note](./includes/lab-services-new-update-note.md)]

## Overview

Lab plans replace lab accounts and although they come with key new features, they share many familiar concepts. Lab plans, similar to lab accounts, serve as the collection of configurations and settings for creating labs. For example, to configure image galleries, shutdown settings, management of lab users, or to specify advanced networking settings.

Lab plans also have fundamental differences. For example, labs created with lab plans are now an Azure resource in their own right, which makes them a sibling resource to lab plans.

By using lab plans, you can unlock several new capabilities:

**[Canvas Integration](how-to-configure-canvas-for-lab-plans.md)**. If your organization is using Canvas, educators no longer have to leave Canvas to create labs with Azure Lab Services. Students can connect to their virtual machine from inside their course in Canvas.

**[Per-customer assigned capacity](capacity-limits.md#per-customer-assigned-capacity)**. You don't have to share capacity with others anymore. If your organization has requested more quota, Azure Lab Services allocates it just for you.

**[Advanced networking](how-to-connect-vnet-injection.md)**.  Advanced networking with virtual network injection replaces virtual network peering. In your Azure subscription, you can create a virtual network in the same region as the lab plan, and delegate a subnet to Azure Lab Services.

**[Improved auto-shutdown](how-to-configure-auto-shutdown-lab-plans.md)**. Auto-shutdown settings are now available for Windows and Linux operating systems. Learn more about the [supported Linux distributions](./how-to-enable-shutdown-disconnect.md#supported-linux-distributions-for-automatic-shutdown).

**[More built-in roles](./concept-lab-services-role-based-access-control.md)**. In addition to the Lab Creator built-in role, there are now more lab management roles, such as Lab Assistant. Learn more about [role-based access control in Azure Lab Services](./concept-lab-services-role-based-access-control.md).

**[Improved cost tracking in Microsoft Cost Management](cost-management-guide.md#separate-the-costs)**. Lab virtual machines are now the cost unit tracked in Microsoft Cost Management. Tags for lab plan ID and lab name are automatically added to each cost entry.  If you want to track the cost of a single lab, group the lab VM cost entries together by the lab name tag. Custom tags on labs also propagate to Microsoft Cost Management entries to allow further cost analysis.  

**[Updates to lab owner experience](how-to-manage-labs.md)**. Choose to skip the template creation process when creating a new lab if you already have an image ready to use. In addition, you can add a non-admin user to lab VMs.

**[Updates to lab user experience](how-to-manage-vm-pool.md#redeploy-lab-vms)**. In addition to reimaging their lab VM, lab users can now also redeploy their lab VM without losing the data inside the lab VM. In addition, the lab registration experience is simplified when you use labs in Teams, Canvas, or with Azure AD groups. In these cases, Azure Lab Services *automatically* assigns a lab VM to a lab user.

**SDKs**. Azure Lab Services is now integrated with the [Az PowerShell module](/powershell/azure/release-notes-azureps) and supports Azure Resource Manager (ARM) templates. Also, you can use either the [.NET SDK](/dotnet/api/overview/azure/labservices) or [Python SDK](https://pypi.org/project/azure-mgmt-labservices/).

## Difference between lab plans and lab accounts

Lab plans replace lab accounts in Azure Lab Services. The following table lists the fundamental differences between lab plans and lab accounts:

|Lab account|Lab plan|
|-|-|
|Lab account was the only resource that administrators could interact with inside the Azure portal.|Administrators can now manage two types of resources, lab plan and lab, in the Azure portal.|
|Lab account served as the **parent** for the labs.|Lab plan is a **sibling** resource to the lab resource. Grouping of labs is now done by the resource group.|
|Lab account served as a container for the labs.  A change to the lab account often affected the labs under it.|The lab plan serves as a collection of configurations and settings that are applied when a lab is **created**. If you change a lab plan's settings, these changes won't affect any existing labs that were previously created from the lab plan. (The exception is the internal help information, which will affect all labs.)|

Lab accounts and labs have a parental relationship.  Moving to a sibling relationship between the lab plan and lab provides an upgraded experience. The following table compares the previous experience with a lab account and the new improved experience with a lab plan.

|Feature/area|Lab account|Lab plan|
|-|-|-|
|Resource Management|Lab account was the only resource tracked in the Azure portal. All other resources were child resources of the lab account and tracked in Lab Services directly.|Lab plans and labs are now sibling resources in Azure. Administrators can use existing tools in the Azure portal to manage labs. Virtual machines will continue to be a child resource of labs.|
|Cost tracking|In Microsoft Cost Management, admins could only track and analyze cost at the service level and at the lab account level.| Cost entries in Microsoft Cost Management are now for lab virtual machines. Automatic tags on each entry specify the lab plan ID and the lab name. You can analyze cost by lab plan, lab, or virtual machine from within the Azure portal. Custom tags on the lab will also show in the cost data.|  
|Selecting regions|By default, labs were created in the same geography as the lab account.  A geography typically aligns with a country/region and contains one or more Azure regions. Lab owners weren't able to manage exactly which Azure region the labs resided in.|In the lab plan, administrators now can manage the exact Azure regions allowed for lab creation. By default, labs will be created in the same Azure region as the lab plan. </br> Note, when a lab plan has advanced networking enabled, labs are created in the same Azure region as virtual network.|
|Deletion experience|When a lab account is deleted, all labs within it are also deleted.|When deleting a lab plan, labs *aren't* deleted. After a lab plan is deleted, labs will keep references to their virtual network even if advanced networking is enabled. However, if a lab plan was connected to an Azure Compute Gallery, the labs can no longer export an image to that Azure Compute Gallery.|
|Connecting to a virtual network|The lab account provided an option to peer to a virtual network. If you already had labs in the lab account before you peered to a virtual network, the virtual network connection didn't apply to existing labs. Admins couldn't tell which labs in the lab account were peered to the virtual network.|In a lab plan, admins set up the advanced networking only at the time of lab plan creation. Once a lab plan is created, you'll see a read-only connection to the virtual network. If you need to use another virtual network, create a new lab plan configured with the new virtual network.|
|Labs portal experience|Labs are listed under lab accounts in [https://labs.azure.com](https://labs.azure.com).|Labs are listed under resource group name in [https://labs.azure.com](https://labs.azure.com). If there are multiple lab plans in the same resource group, educators can choose which lab plan to use when creating the lab. <br/>Learn more about [resource group and lab plan structure](./concept-lab-services-role-based-access-control.md#resource-group-and-lab-plan-structure).|
|Permissions needed to manage labs|To create a lab:</br>- **Lab Contributor** role on the lab account.<br/></br>To modify an existing lab:</br>- **Reader** role on the lab account.</br>- **Owner** or **Contributor** role on the lab (Lab creators are assigned the **Owner** role to any labs they create). | To create a lab:</br>- **Owner** or **Contributor** role on the resource group that contains the lab plan.</br>- **Lab Creator** role on the lab plan.</br><br/>To modify an existing lab:</br>- **Owner** or **Contributor** role on the lab (Lab creators are assigned the **Owner** role to any labs they create).<br/><br/>Learn more about [Azure Lab Services role-based access control](./concept-lab-services-role-based-access-control.md). |

## Known issues

- When using virtual network injection, use caution in making changes to the virtual network, subnet, and resources created by Lab Services attached to the subnet. Also, labs using advanced networking must be deleted before deleting the virtual network.

- Moving lab plan and lab resources from one Azure region to another isn't supported.

- You have to register the [Azure Compute resource provider](../azure-resource-manager/management/resource-providers-and-types.md) before Azure Lab Services can [create and attach an Azure Compute Gallery resource](how-to-attach-detach-shared-image-gallery.md#attach-an-existing-compute-gallery-to-a-lab-plan).

- If you're attaching an Azure compute gallery, the compute gallery and the lab plan must be in the same Azure region. Also, it's recommended that the [enabled regions](./create-and-configure-labs-admin.md#enable-regions) only has this Azure region selected.

## Next steps

If you're using lab accounts, follow these steps to [migrate your lab accounts to lab plans](./migrate-to-2022-update.md).

If you're new to Azure Lab Services, get started by [creating a new lab plan](./quick-create-resources.md).

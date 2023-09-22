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

**[Lab plans replace lab accounts](#difference-between-lab-plans-and-lab-accounts).** Although lab plans and lab accounts are similar in functionality, there are some fundamental differences. The lab plan serves as a collection of configurations and settings that apply to all labs you created from it. Also, labs are now an Azure resource in their own right and a sibling resource to lab plans.

**[Canvas Integration](how-to-configure-canvas-for-lab-plans.md)**. If you're organization is using Canvas, educators no longer have to leave Canvas to create labs with Azure Lab Services. Students can connect to their virtual machine from inside their course in Canvas.

**[Per-customer assigned capacity](capacity-limits.md#per-customer-assigned-capacity)**. You don't have to share capacity with others anymore. If your organization has requested more quota, Azure Lab Services allocates it just for you.

**[Virtual network injection](how-to-connect-vnet-injection.md)**.  Virtual network peering is replaced by virtual network injection (advanced networking). If you have a lab plan with advanced networking, Azure Lab Services creates lab virtual machines in your virtual network. In your Azure subscription, you can create a virtual network in the same region as the lab plan, and delegate a subnet to Azure Lab Services.

**[Improved auto-shutdown](how-to-configure-auto-shutdown-lab-plans.md)**. Auto-shutdown settings are now available for *all* operating systems.

**[More built-in roles](./concept-lab-services-role-based-access-control.md)**. Previously, there was only the Lab Creator built-in role.  You now have additional roles, such as Lab Operator and Lab Assistant. Lab operators can manage existing labs, but not create new ones. Lab assistants can only help lab users by starting, stopping, or redeploying virtual machines. Lab assistants can't adjust quota or set schedules.

**[Improved cost tracking in Azure Cost Management](cost-management-guide.md#separate-the-costs)**. Lab virtual machines are now the cost unit tracked in Azure Cost Management. Tags for lab plan ID and lab name are automatically added to each cost entry.  If you want to track the cost of a single lab, group the lab VM cost entries together by the lab name tag. Custom tags on labs will also propagate to Azure Cost Management entries to allow further cost analysis.  

**[Updates to lab owner experience](how-to-manage-labs.md)**. Choose to skip the template creation process when creating a new lab if you already have an image ready to use. In addition, you can add a non-admin user to lab VMs.

**[Updates to lab user experience](how-to-manage-vm-pool.md#redeploy-lab-vms)**. Lab users can now redeploy their VM without losing data. The lab registration experience is simplified when you use labs in Teams, Canvas, or with Azure AD groups. In these cases, Azure Lab Services *automatically* assigns a lab VM to a lab user.

**SDKs**. Azure Lab Services is now integrated with the [Az PowerShell module](/powershell/azure/release-notes-azureps). Also, check out the C# SDK.

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
|Cost tracking|In Azure Cost Management, admins could only track and analyze cost at the service level and at the lab account level.| Cost entries in Azure Cost Management are now for lab virtual machines. Automatic tags on each entry specify the lab plan ID and the lab name. You can analyze cost by lab plan, lab, or virtual machine from within the Azure portal. Custom tags on the lab will also show in the cost data.|  
|Selecting regions|By default, labs were created in the same geography as the lab account.  A geography typically aligns with a country/region and contains one or more Azure regions. Lab owners weren't able to manage exactly which Azure region the labs resided in.|In the lab plan, administrators now can manage the exact Azure regions allowed for lab creation. By default, labs will be created in the same Azure region as the lab plan. </br> Note, when a lab plan has advanced networking enabled, labs are created in the same Azure region as virtual network.|
|Deletion experience|When a lab account is deleted, all labs within it are also deleted.|When deleting a lab plan, labs *aren't* deleted. After a lab plan is deleted, labs will keep references to their virtual network even if advanced networking is enabled. However, if a lab plan was connected to an Azure Compute Gallery, the labs can no longer export an image to that Azure Compute Gallery.|
|Connecting to a virtual network|The lab account provided an option to peer to a virtual network. If you already had labs in the lab account before you peered to a virtual network, the virtual network connection didn't apply to existing labs. Admins couldn't tell which labs in the lab account were peered to the virtual network.|In a lab plan, admins set up the advanced networking only at the time of lab plan creation. Once a lab plan is created, you'll see a read-only connection to the virtual network. If you need to use another virtual network, create a new lab plan configured with the new virtual network.|
|Labs portal experience|Labs are listed under lab accounts in [https://labs.azure.com](https://labs.azure.com).|Labs are listed under resource group name in [https://labs.azure.com](https://labs.azure.com). If there are multiple lab plans in the same resource group, educators can choose which lab plan to use when creating the lab.|
|Permissions needed to manage labs|To create a lab, someone must be assigned:</br>- **Lab Contributor** role on the lab account.</br>To modify an existing lab, someone must be assigned:</br>- **Reader** role on the lab account.</br>- **Owner** or **Contributor** role on the lab. (Lab creators are assigned the **Owner** role to any labs they create.)|To create a lab, someone must be assigned:</br>- **Owner** or **Contributor** role on the resource group that contains the lab plan.</br>- **Lab Creator** role on the lab plan.</br>To modify an existing lab, someone must be assigned:</br>- **Owner** or **Contributor** role on the lab. (Lab creators are assigned the **Owner** role to any labs they create.)|

## Known issues

- When using virtual network injection, use caution in making changes to the virtual network and subnet.  Changes may cause the lab VMs to stop working. For example, deleting your virtual network will cause all the lab VMs to stop working. We plan to improve this experience in the future, but for now make sure to delete labs before deleting networks.

- Moving lab plan and lab resources from one Azure region to another isn't supported.

- You have to register the [Azure Compute resource provider](../azure-resource-manager/management/resource-providers-and-types.md) before Azure Lab Services can [create and attach an Azure Compute Gallery resource](how-to-attach-detach-shared-image-gallery.md#attach-an-existing-compute-gallery-to-a-lab-plan).

## Next steps

If you're using lab accounts, follow these steps to [migrate your lab accounts to lab plans](./how-to-migrate-lab-acounts-to-lab-plans.md).

If you're new to Azure Lab Services, get started by [creating a new lab plan](./quick-create-resources.md).

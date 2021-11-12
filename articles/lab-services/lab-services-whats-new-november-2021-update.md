---
title: What's New in Azure Lab Services | Microsoft Docs
description: Learn what's new in the Azure Lab Services November 2021 Updates. 
ms.topic: overview
ms.date: 11/09/2021
---

# What's new in Azure Lab Services November 2021 Updates

We've made fundamental backend improvements for the service to boost performance, reliability, and scalability. In this article, we describe all the great changes and new features that are available! 

[Lab Plans replace Lab Accounts](#lab-plans-replace-lab-accounts). The lab account concept is being replaced with a new concept called a Lab plan. Although similar in functionality, there are some fundamental differences. The Lab Plan serves as a collection of configurations and settings that apply to the labs created from it. Labs are now an Azure resource in their own right and a sibling resource to Lab Plans. 

[Improved performance](#performance-and-capacity). From lab and virtual machine creation to lab publish, you’ll notice drastic improvements.  

[New SKUs](#new-skus). We’ve been working hard to add new VM sizes with options for larger OS disk sizes. All lab virtual machines use solid-state disks (SSD) and you have a choice between Standard SSD and Premium SSD.  

[Per Customer Assigned Capacity](#per-customer-assigned-capacity). No more sharing capacity with others. If your organization has requested more quota, we’ll save it just for you. 

[Canvas Integration](#canvas-integration). Use Canvas to organize everything for your classes—even virtual labs. Now, instructors don’t have to leave Canvas to create their labs. Students can connect to a virtual machine from inside their course.

[VNet Injection](how-to-connect-vnet-injection.md). You asked for more control over the network for lab virtual machines and now you have it. We replaced virtual network peering with virtual network injection. In your own subscription, create a virtual network in the same region as the lab, delegate a subnet to Azure Lab Services and you’re off and running. 

[Improved auto-shutdown](#improved-auto-shutdown-experience). Auto-shutdown settings are now available for ALL operating systems! If we detect a student shut down their VM, we’ll stop billing. 

[More built-in roles](#new-built-in-roles-for-azure-lab-services). In addition to Lab Creator, we’ve added Lab Operator and Lab Assistant roles. Lab Operators can manage existing labs, but not create new ones. Lab Assistant can only help students by starting, stopping, or redeploying virtual machines. They will not be able to adjust quota or set schedules. 

[Improved cost tracking in Cost Management](#improved-cost-tracking). Lab virtual machines are now the cost unit tracked in Azure Cost Management. Tags for lab plan ID and lab name are automatically added if you want to group lab VM cost entries together. Need to track cost by a department or cost center? Just add a tag to the lab resource in Azure. We added the ability to propagate tags from labs to Azure Cost Management entries.  

[Updates to lab owner experience](#updates-to-lab-owner-experience). Now you can choose to skip the template creation process and automatically publish the lab if you already have an image ready to use. In addition, we’ve added the ability to add a non-admin user to lab VMs and made some scheduling improvements while we were at it. 

[Updates to student experience](#updates-to-student-experience). Student can now redeploy their VM without losing data.  If the lab is set up to use AAD group sync, there is no longer a need to send an invitation email so students can register for a virtual machine—one is assigned to the student automatically.

SDKs. The Azure Lab Services PowerShell will now be integrated with the Az PowerShell module and will release with the next monthly update of the Az module. Also, check out the C# SDK.

[Give it a try!](tutorial-setup-lab-plan.md) And check out the updated documentation at [Introduction to labs](classroom-labs-overview.md)

In this release, there remain a few known issues:

- PowerShell SDK will be released on 12/7/2021 as part of the monthly update for the Azure module.

- C# SDK will be released on _______________

- When using VNet Injection, use caution in making changes to the virtual network and subnet because it can cause the lab VMs to stop working. For example, deleting your virtual network will cause all the lab VMs to stop working. We plan to improve this experience, but for now make sure to delete labs before deleting networks.

## Lab Plans replace Lab Accounts

For the new version of Lab Services, the lab account concept is being replaced with a new concept called a lab plan. Although similar in functionality, there are some fundamental differences between the old Lab account and the new Lab plan: 

|Lab account (classic)|Lab plan|
|-|-|
|Lab account was the only resource that administrators could interact with inside the Azure portal.</br>Lab account served as the parent and container for the labs.|In the Azure portal, admins now manage two types of sibling resources, lab plan and lab. Grouping of labs is now done by resource group.</br>The lab plan serves as a collection of configurations and settings that apply when a lab is created. If you change a lab plan’s settings, these changes won’t impact any existing labs that were previously created from the lab plan. (The exception to this is the internal help information settings, which affects all labs.) |

By moving to a sibling relationship between the lab plan and lab instead of a parental relationship, lab plan provides an upgraded experience from the lab account experience. The following table compares the previous experience with a lab account and the new improved experience with a lab plan:

|Feature/area|Lab account (classic)|Lab plan|
|-|-|-|
|Resource Management|Lab account was the only resource tracked in the Azure portal. All other resources were child resources of the lab account and tracked in Lab Services directly.|Lab plans and labs are now sibling resources. Administrators can now use existing tools in the Azure portal to manage labs.</br>Virtual machines will continue to be a child resource of labs.| 
|Cost tracking|In Azure Cost Management, admins were able to track and analyze cost only at the service level and at the lab account level.|In Azure Cost Management, entries are for lab virtual machines. Automatic tags on each entry specify the lab plan id and the lab. Now you can analyze cost by lab plan, lab, or virtual machine from within the Azure portal. Custom tags on the lab will also show in the cost data.|  
|Selecting regions to create labs in|By default, labs were created in the same geography as the lab account.  A geography typically aligns with a country and contains one or more Azure regions. Lab owners were not able to manage exactly which Azure region the labs resided in, only the geography.|In the lab plan, administrator now can manage the exact Azure regions to allowed for lab creation. By default, labs will be created in the same Azure region as the lab plan they were created from. </br>Note that when a lab plan is connected to your own virtual network, labs can only be created in the same Azure region as that virtual network.| 
|Deletion experience|When a lab account is deleted, all labs within it are also deleted.|When deleting a lab plan, labs are not deleted. Labs that were created from a deleted lab plan will continue to retain references to:</br>- A virtual network, if advanced networking was configured on the lab plan.</br>- An image from Shared Image Gallery, if a custom image was used to create the lab.</br>However, the labs will no longer be able to export an image to Shared Image Gallery.|
|Connecting to a Vnet|The lab account provided an option to peer to a Vnet. If you already had labs in the lab account before you peered to a Vnet, the Vnet connection did not apply to existing labs. This created a situation where admins could not tell which labs in the lab account were peered to the Vnet.|In a lab plan, admins will have the ability to set up the advanced networking only at the time of lab plan creation. Once a lab plan is created, you will see and read-only connection to the connected virtual network.</br>If you need to use another virtual network, create a new lab plan configured with the new virtual network.|
|Labs Portal Experience|Labs are lab listed under lab accounts in https://labs.azure.com.|Labs are listed under resource group name in https://labs.azure.com.</br>If there are multiple lab plans in the same resource group, instructors will be able to choose which lab plan to use when creating the lab.|
|Permissions needed to manage labs|To create a lab, administrator must assign:</br>- Lab Contributor role on the lab account</br>To modify an existing lab, administrator must assign:</br>- Reader role on the lab account</br>- Lab Creator or Contributor role on the lab.|To create a lab, administrator must assign:</br>- Owner or Contributor role on the resource group that contains the lab plan.</br>- Lab Creator role on the lab plan.</br>To modify an existing lab, administrator must assign:</br>- Contributor role on the lab.|

### Create a new lab plan  

See [Create and manage Lab Plans](how-to-manage-lab-plans.md).

### Move from lab account to lab plan

To use new features provided in the public preview, you will need to create new lab plans and labs. When you create a lab plan, you can reuse the same Shared Image Gallery and images that you previously used with your lab account.  Likewise, you can reuse the same licensing server. As you migrate, there likely will be a period when you are using both the public preview and the current version of Azure Lab Services at the same time. You may have both lab accounts and lab plans that coexist in your subscription and that access the same Shared Image Gallery and licensing server.

For each new lab plan, there are some settings that you will need to configure, such as:

- Assign user permissions on the lab plan, the lab plan’s resource group, and the lab.
- Enable the Marketplace and Shared Image Gallery images that lab creators can use.
- Select regions that your labs will be deployed in.
- Set auto-shutdown settings.

With all the new enhancements in the public preview, this is a good time to revisit your overall lab structure. For example, you may decide to structure your lab plans differently than your lab accounts now that you can explicitly select the regions that labs are deployed in.

## Performance and capacity

### Performance improvements

In the public preview, we’ve made improvements to how we manage virtual machines in the backend to improve scalability and performance. You’ll notice drastic improvements in the lab creation and publish times. VM start time has been improved as well. Here’s an approximation of the differences.

|Action|Before|With Public Preview|
|-|-|-|
|Lab creation|20+ min|5-15 min|
|Lab publish|1+ hour|15-20 min|
|Increase lab capacity (# of VMs)|1+ hour (dependent on the number of VMs)|15-20 min|
|VM start|5-20 min|3-5 min|
|Export to Shared Imaged Gallery|1 – 3 hours</br>Image replicated to all regions supported by geography.|10 min</br>Image saved to same region as lab.</br>Image not automatically replicated to other regions.|

### Per-customer assigned capacity

Azure Lab Services hosts lab resources, including VMs, within special Microsoft-managed Azure subscriptions that aren’t visible to customers. Previously, VM capacity was available from a large pool shared across many customers. With this update, VM capacity is now dedicated to each customer.

Before you set up a large number of VMs across your labs, we recommend that you open a support ticket to pre-request VM capacity. Requests should include VM size, number, and region. Pre-requesting capacity helps us to ensure that you create your labs in a region that has a sufficient number of VM cores for the VM size that you need for your labs.  We can now assign VM capacity on a per-customer basis when you submit a support ticket to request capacity.

### Limits

Here are the updated limits:

- 500 labs or lab plans per region per subscription
- 400 users per lab

## New built-in roles for Azure Lab Services

We’ve heard from customers that often multiple people manage a lab, and admins need to be able to set more granular control over who has the ability to control different settings inside the lab. Based on this feedback, we added a few more roles. Let’s take a quick tour of all the roles you can use when managed Azure Lab Services.

- **Lab Creator**.  When set in the lab plan, this role enables the user account to create labs from the lab plan. The user account can also see existing labs that are in the same resource group as the lab plan. When applied to a resource group, this role enables the user to view existing lab and create new labs. They will have full control over any labs they create as they are assigned as Owner to those created labs. 
- **Lab Contributor**. When applied to an existing lab, this role enables the user to fully manage the lab. When applied to a resource group enables the user account to fully manage existing labs and create new labs in that resource group.
- **Lab Operator**. When applied to a resource group or a lab, this role enables the user to have limited ability to manage existing labs. This role won’t give the user the ability to create new labs. In an existing lab, the user can manage users, adjust individual users’ quota, manage schedules, and start/stop VMs. The user account will be able to publish a lab. The user will not have the ability to change lab capacity or change quota at the lab level. The user won’t be able to change the template title or description.
- **Lab Assistant**. When applied to a resource group or a lab, enables the user to view an existing lab and can only perform actions on the lab VMs (reset, start, stop, connect) and send invites to the lab. The user will not have the ability to change create a lab, publish a lab, change lab capacity, or manage quota and schedules. This user can’t adjust individual quota. 
- **Lab Services Contributor**. When applied to a resource group, enables the user to fully control all Lab Services scenarios in that resource group. 
- **Lab Services Reader**. When applied to a resource group enables the user to view, but not change, all lab plans and lab resources. External resources like image galleries and virtual networks that may be connected to a lab plan are not included.

## Improved auto-shutdown experience

We’ve made significant improvements to the reliability and performance of the auto-shutdown experience for lab VMs. Now auto-shutdown settings are OS version-agnostic. The following settings can now be applied to any version of Linux or Windows:

- Disconnect users when virtual machines are idle
- Shutdown virtual machines when users disconnect
- Shutdown virtual machines when users do not connect

Another key improvement is how Azure Lab Services detects that a VM is idle. Previously, idle detection was only supported for Windows machines and relied on the Windows’ OS to detect mouse\keyboard input. However, tracking only mouse and keyboard input to detect when a VM is idle isn’t well suited for some scenarios. For example, in data science, users often need to perform long running queries or train deep learning models with large data sets. In these scenarios, the VM’s resources are actively being used, but there are extended periods of time where there isn’t any mouse or keyboard input from the user. Lab Services now provides flexibility to accommodate these scenarios by detecting both mouse/keyboard input and disk/CPU usage.

:::image type="content" source="./media/lab-services-whats-new-november-2021-update/auto-shutdown-settings.png" alt-text="Automatic shutdown and disconnect":::

If Lab Services detects when the OS’s built-in shutdown command is used, so that the VM billing is stopped ½ hour after shutdown was detected.  For example, in Windows, when the user selects the shutdown command from under the **Start** menu, the VM is shut down as well billing being stopped so that further costs aren’t incurred.

## Updates to lab owner experience

### Labs without a template VM

You now have the option to create labs without a template VM. Typically, you use a lab’s template VM to customize the base image that is used to create the users’ VMs within the lab. In cases where you don’t need to make further customizations to the base image, you can choose to create a lab without a template.

:::image type="content" source="./media/lab-services-whats-new-november-2021-update/create-lab-without-template-vm.png" alt-text="Create a lab without a template VM":::

Labs without template VMs have several benefits:

- Lab creation time is faster because it doesn’t include setting up the template VM.  Creation time will drop to about 3 minutes from the usual 10 minutes for labs with templates.
- You can ensure that a lab’s image is not modified by lab owners since there is no way for them to change the lab’s image without the template VM.
- When you use a generalized image, each user’s VMs will have a unique machine security identifier (SID). Unique machine SIDs are often required to use endpoint management tools and similar software with your lab VMs. For example, Azure Marketplace images are generalized. If you create a lab from the Win 10 marketplace image without a template VM, each of the users’ VM within the lab will have a unique machine SID.
Labs without a template VM will still show the Template page that includes information about the image and VM size, along with the ability to set the lab’s Title and Description. However, since there isn’t an underlying template VM, you won’t see options to start, stop, reset the password, or connect to the template VM. Likewise, you won’t see the option to Export to Shared Image Gallery.

:::image type="content" source="./media/lab-services-whats-new-november-2021-update/template-page-no-template-vm.png" alt-text="Template page with no template VM":::

### Updates to lab schedules

There are a few updates to the Schedule experience:

- The Start only schedule type is no longer available. This feature allowed lab owners to start all VMs in the lab without setting a shutdown time. Many customers reported that the feature made it easy to leave VMs accidentally running, incurring cost. Our goal is to get rid of all cases where a VM may unexpectedly run and incur costs.
- As part of improving reliability of schedules, we’ve clarified a few rules: 
- There can be no overlapping events. For example, a 3-5 pm event and a 4-6 pm event on the same day can’t coexist.
- There must be at least 30 minutes between scheduled events. If a schedule ends at 3 pm, the earliest another event can be scheduled is 3:30 pm.
- Minimum duration of a scheduled event is 15 minutes.
- An event must be within a calendar day. It’s not possible to set up an event that starts at 11:30 pm and ends at 1:30 am the next day.
- Changes to a scheduled event, such as updating the stop time or changing recurrence while the scheduled event is running is not allowed.

### Non-admin lab users

By default, when you create a new lab, Azure Lab Services adds a local admin account to the lab’s image. This admin account is then used by the lab owner to connect to the lab’s template VM. Lab users also use this account to connect to their VMs as an admin.

:::image type="content" source="./media/lab-services-whats-new-november-2021-update/connect-to-vm.png" alt-text="Connect to VM":::

There may be cases where you don’t want your lab’s users to have full admin access on their VM. For example, you may want to prevent them from installing or uninstalling software. When you create a Windows or Linux lab, there is now an option to add a non-admin account on the image. If you enable this option:

- Two accounts will be added to the image – a non-admin account and an admin account.
- When the lab owner connects to the lab’s template VM, by default, they are prompted to sign-in with the admin account.
- When a lab user connects to their VM, by default, they are prompted to sign-in with the non-admin account.
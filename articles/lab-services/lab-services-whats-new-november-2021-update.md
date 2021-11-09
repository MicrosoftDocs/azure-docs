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

[New SKUs](#new-skus). We’ve been working hard to add new VM sizes with options for larger OS disk sizes. All lab virtual machines use solid state disks (SSD) and you have a choice between Standard SSD and Premium SSD.  

[Per Customer Assigned Capacity](#per-customer-assigned-capacity). No more sharing capacity with others. If your organization has requested more quota, we’ll save it just for you. 

[Canvas Integration](#canvas-integration). Use Canvas to organize everything for your classes—even virtual labs. Now, instructors don’t have to leave Canvas to create their labs. Students can connect to a virtual machine from inside their course.

[VNet Injection](#vnet-injection). You asked for more control over the network for lab virtual machines and now you have it. We replaced virtual network peering with virtual network injection. In your own subscription, create a virtual network in the same region as the lab, delegate a subnet to Azure Lab Services and you’re off and running. 

[Improved auto-shutdown](#improved-auto-shutdown-experience). Auto-shutdown settings are now available for ALL operating systems! If we detect a student shut down their VM, we’ll stop billing. 

[More built-in roles](#new-built-in-roles-for-azure-lab-services). In addition to Lab Creator, we’ve added Lab Operator and Lab Assistant roles. Lab Operators can manage existing labs, but not create new ones. Lab Assistant can only help students by starting, stopping, or redeploying virtual machines. They will not be able to adjust quota or set schedules. 

[Improved cost tracking in Cost Management](#improved-cost-tracking). Lab virtual machines are now the cost unit tracked in Azure Cost Management. Tags for lab plan id and lab name are automatically added if you want to group lab VM cost entries together. Need to track cost by a department or cost center? Just add a tag to the lab resource in Azure. We added the ability to propagate tags from labs to Azure Cost Management entries.  

[Updates to lab owner experience](#updates-to-lab-owner-experience). Now you can choose to skip the template creation process and automatically publish the lab if you already have an image ready to use. In addition, we’ve added the ability to add a non-admin user to lab VMs and made some scheduling improvements while we were at it. 

[Updates to student experience](#updates-to-student-experience). Student can now redeploy their VM without losing data.  If the lab is setup to use AAD group sync, there is no longer a need to send an invitation email so students can register for a virtual machine—one is assigned to the student automatically.

SDKs. The Azure Lab Services PowerShell will now be integrated with the Az PowerShell module and will release with the next monthly update of the Az module. Also, check out the C# SDK. 

Give it a try!  {link to getting started for V2 doc} And check out the updated documentation at [Introduction to labs](classroom-labs-overview.md)

In this release, there remain a few known issues:

- PowerShell SDK will be released on 12/7/2021 as part of the monthly update for the Azure module.

- C# SDK will be released on _______________

- When using VNet Injection, use caution in making changes to the virtual network and subnet because it can cause the lab VMs to stop working. For example, deleting your virtual network will cause all the lab VMs to stop working. We plan to improve this experience, but for now make sure to delete labs before deleting networks.

## Lab Plans replace Lab Accounts

For the new version of Lab Services, the lab account concept is being replaced with a new concept called a lab plan. Although similar in functionality, there are some fundamental differences between the old Lab account and the new Lab plan: 

|Lab account (classic)|Lab plan|
|-|-|
|Lab account was the only resource that administrators could interact with inside the Azure Portal.</br>Lab account served as the parent and container for the labs.|In the Azure Portal, admins now manage two types of sibling resources, lab plan and lab. Grouping of labs is now done by resource group.</br>The lab plan serves as a collection of configurations and settings that apply when a lab is created. If you change a lab plan’s settings, these changes won’t impact any existing labs that were previously created from the lab plan. (The exception to this is the internal help information settings, which affects all labs.) |

By moving to a sibling relationship between the lab plan and lab instead of a parental relationship, lab plan provides an upgraded experience from the lab account experience. The following table compares the previous experience with a lab account and the new improved experience with a lab plan:

|Feature/area|Lab account (classic)|Lab plan|
|-|-|-|
|Resource Management|Lab account was the only resource tracked in the Azure Portal. All other resources were child resources of the lab account and tracked in Lab Services directly.|Lab plans and labs are now sibling resources. Administrators can now use existing tools in the Azure Portal to manage labs.</br>Virtual machines will continue to be a child resource of labs.| 
|Cost tracking|In Azure Cost Management, admins were able to track and analyze cost only at the service level and at the lab account level.|In Azure Cost Management, entries are for lab virtual machines. Automatic tags on each entry specify the lab plan id and the lab. Now you can analyze cost by lab plan, lab, or virtual machine from within the Azure Portal. Custom tags on the lab will also show in the cost data.|  
|Selecting regions to create labs in|By default, labs were created in the same geography as the lab account.  A geography typically aligns with a country and contains one or more Azure regions. Lab owners were not able to manage exactly which Azure region the labs resided in, only the geography.|In the lab plan, administrator now can manage the exact Azure regions to allowed for lab creation. By default, labs will be created in the same Azure region as the lab plan they were created from.</br>Please note, when a lab plan is connected to your own virtual network, labs can only be created in the same Azure region as that virtual network.| 
|Deletion experience|When a lab account is deleted, all labs within it are also deleted.|When deleting a lab plan, labs are not deleted. Labs that were created from a deleted lab plan will continue to retain references to:</br>- A virtual network, if advanced networking was configured on the lab plan.</br>- An image from Shared Image Gallery, if a custom image was used to create the lab.</br>However, the labs will no longer be able to export an image to Shared Image Gallery.|
|Connecting to a Vnet|The lab account provided an option to peer to a Vnet. If you already had labs in the lab account before you peered to a Vnet, the Vnet connection did not apply to existing labs. This created a situation where admins could not tell which labs in the lab account were peered to the Vnet.|In a lab plan, admins will have the ability to set up the advanced networking only at the time of lab plan creation. Once a lab plan is created, you will see and read-only connection to the connected virtual network.</br>If you need to use another virtual network, create a new lab plan configured with the new virtual network.|
|Labs Portal Experience|Labs are lab listed under lab accounts in https://labs.azure.com.|Labs are listed under resource group name in https://labs.azure.com.</br>If there are multiple lab plans in the same resource group, instructors will be able to choose which lab plan to use when creating the lab.|
|Permissions needed to manage labs|To create a lab, administrator must assign:</br>- Lab Contributor role on the lab account</br>To modify an existing lab, administrator must assign:</br>- Reader role on the lab account</br>- Lab Creator or Contributor role on the lab.|To create a lab, administrator must assign:</br>- Owner or Contributor role on the resource group that contains the lab plan.</br>- Lab Creator role on the lab plan.</br>To modify an existing lab, administrator must assign:</br>- Contributor role on the lab.|

TODO: Screenshot Azure portal

### Creating a new lab plan  

To use Azure Lab Services, open the Azure Portal to create a lab plan first:  

Inside the Azure Portal, create a new Lab plan resource.  

1. Pick the Azure subscription to use for billing.

1. Choose to create a new lab plan resource.

1. Provide a new or existing resource group to create the lab plan in. All labs that are created from the lab plan will be created within the same resource group so that you can easily group and manage the resources.

1. Set the name of the lab plan.

1. Choose the Azure region to create the lab plan in.

   image

1. If you need to set up a VNet injection, check Enable advance networking the Vnet to use. Select the virtual networking and subnet. To see a virtual network, it must be in the same location as the lab plan. Only subnets delegated to Microsoft.LabServices/labs will appear in the subnet drop-down. Only one lab plan my be associated with one subnet.

  image

1. Click **Review + Create**.
1. Click **Create** to create the lab plan.

Once the lab plan is created, administrators can set up the following configurations: 
- Restrictions that apply at lab creation:
  - Which region(s) the labs can be created in.
  - What marketplace images are allowed.
  - What custom images from a connected Shared Image Gallery are allowed.
  - Default auto-shutdown settings that labs will inherit.
- Specify your organization’s Shared Image Gallery to export custom VM images to.
- Provide internal support information for your organization when using Azure Lab Services.
- Give access to educators to create and/or manage labs.

Lab owners who were given access can create new labs, and these labs will inherit the configuration set in the lab plan.

Here is an example of how admins can create multiple lab plans to manage different collections of configurations to apply to labs:

image

Changes made to the lab settings from the lab plan will apply only to new labs created after the settings change. 
Now your lab plans are created, go to [https://labs.azure.com](https://labs.azure.com) to create your labs.

### Moving from lab account to lab plan

To use new features provided in the public preview, you will need to create new lab plans and labs. When you create a lab plan, you can reuse the same Shared Image Gallery and images that you previously used with your lab account.  Likewise, you can reuse the same licensing server. As you migrate, there likely will be a period when you are using both the public preview and the current version of Azure Lab Services at the same time. You may have both lab accounts and lab plans that co-exist in your subscription and that access the same Shared Image Gallery and licensing server.

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

## New SKUs

### Sizes

You’ve told us that you want more control over your virtual machines, and we’ve listened. We now show compute size name, number of cores, amount of memory, OS disk size and disk type. Sizes are no longer listed in families, so you know exactly what you are getting. All lab virtual machines will now use solid state disks (SSD) and you have a choice between Standard SSD and Premium SSD.
Check out the new sizes!

|Size name|Cores|Memory (GB)|OS disk size (GB)|SSD type|
|-|-|-|-|-|
|Standard_Fsv2|2|4|64, 128, 256|Standard|
|Standard_Dsv4|2|8|128, 256|Standard|
|Standard_Dsv4|4|16|128, 256, 512|Standard, Premium|
|Standard_Dsv4|8|32|128, 256, 512|Standard, Premium|
|Standard_NCv3T4*|8|56|256, 512|Standard, Premium|
|Standard_NCv3T4*|16|110|256, 512|Standard, Premium|
|Standard_NVv4*|8|28|256, 512|Standard, Premium|
|Standard_NVv4*|16|56|256, 512|Standard, Premium|
|Standard_Esv4|4|32|128, 256|Standard, Premium|
|Standard_Esv4|8|64|256, 512|Standard, Premium|

\* These sizes are not available in all Azure regions.

>[IMPORTANT]
> Available SKUs are subject to change in the future. See [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/) for latest SKU information.

### Prices

With Public Preview, we no longer have a ‘one size fits all’ approach. Both operating system and region are considered when determining the price. Linux will no longer be charged the same write as Windows and will be less per hour. Creating a lab in cheaper regions? You’ll see those savings in the price, too.
See [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/) for latest SKU information.

## Canvas integration

status - in review

## New built-in roles for Azure Lab Services

status - in progress

## VNET injection

status - in progress

## Improved auto-shutdown experience

## Updates to lab owner experience

## Updates to student experience

status - ready for review

## Improved cost tracking

status - not started

## Azure lab services automation

status - blocked
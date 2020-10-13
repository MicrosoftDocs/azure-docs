---
title: Create a lab in Azure DevTest Labs | Microsoft Docs
description: This article walks you through the process of creating a lab using the Azure portal and Azure DevTest Labs. 
ms.topic: article
ms.date: 10/12/2020
---

# Create a lab in Azure DevTest Labs

A lab in Azure DevTest Labs is the infrastructure that encompasses a group of resources, such as Virtual Machines (VMs), that lets you better manage those resources by specifying limits and quotas. This article walks you through the process of creating a lab using the Azure portal.

## Prerequisites

To create a lab, you need:

* An Azure subscription. To learn about Azure purchase options, see [How to buy Azure](https://azure.microsoft.com/pricing/purchase-options/) or [Free one-month trial](https://azure.microsoft.com/pricing/free-trial/). You must be the owner of the subscription to create the lab.

## Get started with Azure DevTest Labs in minutes

By clicking the following link, you will be transferred to the Azure portal page that allows you to start creating a new Azure DevTest Lab.

[Get started with Azure DevTest Labs in minutes](https://go.microsoft.com/fwlink/?LinkID=627034&clcid=0x409)

## Fill out settings for your new account

On the **Create a DevTest Labs** page, fill out the following settings.

> [!TIP]
> At the bottom of each page, you will find a link that allows you to **download a template for automation**.

### Basic settings

By default you see the **Basic settings** tab. Fill out these values:

|Name|Description|
|---|---|
|**Subscription** | Required. Select the **Subscription** to associate with the lab.|
|**Resource group**| Required. Enter a **name for the resource group** for the lab. Create a new one if one doesn't exist.|
|**Lab name**| Required. Enter a **name** for the lab.|
|**Location**|Required. Select a location in which to store the lab.|
|**Public environments**| See [Configure and use public environments](devtest-lab-configure-use-public-environments.md).

### Auto-shutdown settings

Switch to the **Auto-shutdown** page to see its settings. Auto-shutdown allows you to automatically shut down all machines in a lab at a scheduled time each day.

On the page, you can enable **Auto-shutdown** and define the parameters for the automatic shutting down of all the lab's VMs. The auto-shutdown feature is mainly a cost-saving feature whereby you can specify when you want the VM to automatically be shut down. You can change auto-shutdown settings after creating the lab by following the steps outlined in the article [Manage all policies for a lab in Azure DevTest Labs](./devtest-lab-set-lab-policy.md#set-auto-shutdown).

### Networking

When creating a lab, a default network will be created for you (that can be changed/configured later), or an existing virtual network can be selected.

Switch to the **Networking** tab to specify custom networking settings. 

### Tags

Enter **NAME** and **VALUE** information for **Tags** if you want to create custom tagging that is added to every resource you will create in the lab. Tags are useful to help you manage and organize lab resources by category. For more information about tags, including how to add tags after creating the lab, see [Add tags to a lab](devtest-lab-add-tag.md).

### Review and create

Once done, select **Create**. You can monitor the status of the lab creation process by watching the **Notifications** area at the top-right of the portal page. 

## Completed the creation

Once completed, the **Go to resource** button appears at the bottom of the page and in the notification window. Alternatively, refresh the **DevTest Labs** page to see the newly created lab in the list of labs.  

Press **Go to resource** button and you will be brought to the home page of your new DevTest Labs account.

You can also search for **DevTest Labs** in the Azure portal. Select your new account from the list and get to the home page. 

## Next steps

Once you've created your lab, here are some next steps to consider:

* [Secure access to a lab](devtest-lab-add-devtest-user.md)
* [Set lab policies](devtest-lab-set-lab-policy.md)
* [Create a lab template](devtest-lab-create-template.md)
* [Create custom artifacts for your VMs](devtest-lab-artifact-author.md)
* [Add a VM to a lab](devtest-lab-add-vm.md)


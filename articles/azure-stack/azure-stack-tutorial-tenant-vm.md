---
title: Make virtual machines available to your Azure Stack users| Microsoft Docs
description: Tutorial to make virtual machines available on Azure Stack
services: azure-stack
documentationcenter: ''
author: vhorne
manager: 
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 5/10/2017
ms.author: victorh

---
# Make virtual machines available to your Azure Stack users
As an Azure Stack administrator, you can create offers that your users (sometimes referred to as tenants) can subscribe to. Using their subscription, users can then consumer Azure Stack services. For example, they can then add a virtual machine or whatever else you make available in your offer. Your users can now serve themselves when they need additional resources. You are then free to do other tasks, like perhaps make new services available that your users can consume.

This article shows you how to create an offer, and then test it. 
For the test, you will log in to the portal as a user, subscribe to the offer, and then create a virtual machine using the subscription.

What you will learn:

> [!div class="checklist"]
> * Create an offer
> * Add an image
> * Test the offer


In Azure Stack, services are delivered to users using subscriptions, offers, and plans. Users can subscribe to multiple offers. Offers can have one or more plans, and plans can have one or more services.

![](media/azure-stack-key-features/image4.png)

To learn more, see [Key features and concepts in Azure Stack](azure-stack-key-features.md).

## Create an offer

Now you can get things ready for your users. Create an offer that they can then subscribe to.
1. [Set quotas](azure-stack-setting-quotas.md).

    Quotas define the limits of resources that a user subscription can provision or consume. For example, a quota might allow a user to create up to five VMs. To add a service to a plan, the administrator must configure the quota settings for that service.

2. [Create a plan](azure-stack-create-plan.md).

    Plans are groupings of one or more services. As a provider, you can create plans to offer to your users. In turn, your users subscribe to your offers to use the plans and services they include.

3. [Create an offer](azure-stack-create-offer.md).

    Offers are groups of one or more plans that providers present to users to purchase or subscribe to.

## Add an image

Before you can provision virtual machines, you must add an image to the Azure Stack marketplace. This example shows you how to add a Windows Server 2016 image, but you can add the image of your choice, including Linux images.

For more information, see [The Azure Stack Marketplace](azure-stack-marketplace.md).

> [!NOTE]
> This step can take almost an hour to complete!

[Add the Windows Server 2016 VM image to the Azure Stack marketplace](azure-stack-add-default-image.md)


## Test the offer

Now that you’ve created an offer, you can test it. Log in as a user and subscribe to the offer and then add a virtual machine.

If you deployed using AD FS, you need to create a user account first. If you deployed using Azure Active Directory, you already created a user account following the guidance in [Azure Stack deployment prerequisites](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-deploy#azure-active-directory-accounts).

1. [Add users in the Azure Stack POC](azure-stack-add-users-adfs.md) (AD FS deployments only).

    If you have an AD FS deployment, create a user account (for example Contoso):

    

2. [Subscribe to an offer](azure-stack-subscribe-plan-provision-vm.md).

   Now you can log in to the portal as a user to subscribe to an offer.


3. [Provision a virtual machine](azure-stack-provision-vm.md).

   Now you can log in to the portal as a user to provision a virtual machine using the subscription. 

   Follow this article to test that it works with a user account. Log in to the portal with a user account instead of an administrator account. 

You've learned how to create an offer and verified that users can subscribe to the offer and create virtual machines on Azure Stack. Next, you can make web, mobile, and API apps available to your users.

> [!div class="nextstepaction"]
> [Make web, mobile, and API apps available to your Azure Stack users](azure-stack-tutorial-app-service.md)
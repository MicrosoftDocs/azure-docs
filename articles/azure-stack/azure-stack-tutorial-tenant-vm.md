---
title: Make virtual machines available through Azure Stack | Microsoft Docs
description: Tutorial to make virtual machines available
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
ms.date: 5/8/2017
ms.author: victorh

---
# Make virtual machines available through Azure Stack
## Learn
In Azure Stack, services are delivered to tenants using regions, subscriptions, offers, and plans. Tenants can subscribe to multiple offers. Offers can have one or more plans, and plans can have one or more services.

![](media/azure-stack-key-features/image4.png)

To learn more, see [Key features and concepts in Azure Stack](azure-stack-key-features.md).

This tutorial guides you, the Azure Stack administrator, through the process of creating a plan and offer so that a tenant can subscribe to the offer and then add a virtual machine to their subscription.
## Do

Now you can get things ready for your tenants. You will create an offer that they can then subscribe to.
1. [Set quotas](azure-stack-setting-quotas.md)

    Quotas define the limits of resources that a tenant subscription can provision or consume. For example, a quota might allow a tenant to create up to five VMs. To add a service to a plan, the administrator must configure the quota settings for that service.

2. [Create a plan](azure-stack-create-plan.md)

    Plans are groupings of one or more services. As a provider, you can create plans to offer to your tenants. In turn, your tenants subscribe to your offers to use the plans and services they include.

3. [Create an offer](azure-stack-create-offer.md)

    Offers are groups of one or more plans that providers present to tenants to purchase or subscribe to.

## Validate

Now that you’ve created an offer, you can validate the offer. Log on as a tenant and subscribe to the offer and then add a virtual machine.

If you deployed using ADFS, you need to create a tenant user account first. If you deployed using Azure Active Directory, you already created a tenant account following the directions in Azure Stack deployment prerequisites.

1. Create a tenant user account called Contoso (ADFS deployments only):

    [Add users in the Azure Stack POC](azure-stack-add-users-adfs.md)

2. Now you can get a subscription to subscribe to an offer:

    [Subscribe to an offer](azure-stack-subscribe-plan-provision-vm.md)

3. Before you can provision virtual machines, you must add the Windows Server VM image to the Azure Stack marketplace.

    > [!NOTE]
    > This step can take almost an hour to complete!

    [Add the Windows Server 2016 VM image to the Azure Stack marketplace](azure-stack-add-default-image.md)

4. Now you can logon to the portal as Contoso to provision a virtual machine using the newly created offer. 

    Use the following article, but logon as Contoso instead as an administrator: 

    [Provision a virtual machine](azure-stack-provision-vm.md)
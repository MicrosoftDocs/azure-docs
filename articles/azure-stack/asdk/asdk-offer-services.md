---
title:  In this tutorial, you create an Azure Stack Offer | Microsoft Docs
description: Learn how to create an Azure Stack offer including plans and quotas. 
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.custom: mvc
ms.date: 03/27/2018
ms.author: jeffgilb
ms.reviewer: misainat
---

# Tutorial: offer Azure Stack IaaS services
As an Azure Stack cloud administrator, you can create offers that your users (sometimes referred to as tenants) can subscribe to. Using their subscription, users can then consume Azure Stack services.

This tutorial shows you how to create an offer to enable users to create virtual machines based on the Azure Stack marketplace Windows Server 2016 Datacenter image you uploaded in the [previous tutorial](asdk-marketplace-item.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an offer
> * Create a plan
> * Set quotas
> * Set offer to public

In Azure Stack, services are delivered to users using subscriptions, offers, and plans. Users can subscribe to multiple offers. Offers can have one or more plans, and plans can have one or more services as shown in the following diagram:

![Subscriptions, offers, and plans](media/asdk-offer-services/sop.png)

As an Azure Stack operator offering services, you are first prompted to create the offer, then a plan, and finally quotas. After an offer has been created, Azure Stack users can then subscribe to offers via the user portal.

## Create an offer
**Offers** are groups of one or more plans that Azure Stack operators present to users to purchase or subscribe to.

1. Sign in to the [Azure Stack portal](https://adminportal.local.azurestack.external) as a cloud administrator.

2. Click **New** > **Offers + Plans** > **Offer**.

   ![New offer](media/asdk-offer-services/new-offer.png)

2. In the **New Offer** section, fill in **Display Name** and **Resource Name**, and then select a new or existing **Resource Group**. The display name is the offer's public friendly name that users see. Only the cloud operator can see the resource name, which is used by admins to work with the offer as an Azure Resource Manager resource.

   ![Display name](media/asdk-offer-services/offer-display-name.png)


## Create a plan
After entering the basic offer information, you must add at least one base plan to the offer. 

**Plans** allow Azure Stack operators to group services, and their associated quotas, to be offered to users.

1. Click **Base plans**, and in the **Plan** section, click **Add** to add a new plan to the offer.

   ![Add a plan](media/asdk-offer-services/new-plan.png)

2. In the **New Plan** section, fill in **Display Name** and **Resource Name**. The display name is the plan's friendly name that users see. Only the cloud operator can see the resource name used by cloud operators to work with the plan as an Azure Resource Manager resource.

   ![Plan display name](media/asdk-offer-services/plan-display-name.png)

3. Next, select the services to be included in the plan. To offer IaaS services, click **Services**, select **Microsoft.Compute**, **Microsoft.Network**, and **Microsoft.Storage**, and then click **Select**.

   ![Plan services](media/asdk-offer-services/select-services.png)


## Set quotas
Now that the offer has a plan that includes services, you must set quotas for each of them. 

**Quotas** determine the amount of resources that a user can consume for each service included in the plan being offered.

1. Click **Quotas**, and then select the service for which you want to create a quota. 

   To get started, first create a quota for the compute service. In the namespace list, select the **Microsoft.Compute** namespace and then click **Create new quota**.
   
   ![Create new quota](media/asdk-offer-services/create-quota.png)

2. On the **Create quota** section, type a name for the quota, set the desired parameters for the quota, and click **OK**.

   ![Quota name](media/asdk-offer-services/quota-properties.png)

3. Select the quota that you created for the **Microsoft.Compute** service.

   ![Select quota](media/asdk-offer-services/set-quota.png)

4. Repeat steps 1-3 to set quotas for the network and storage services and then click OK on the Quotas section. Next, click **OK** on the **New plan** section to complete the plan setup. 

   ![All quotas set](media/asdk-offer-services/all-quotas-set.png)

5. Finish creating the offer by clicking **Create** on the Plan section. You will see a notification When the offer is successfully created and it will be listed as an available offer.

   ![Offer created](media/asdk-offer-services/offer-complete.png)

## Set offer to public
Offers must be made public for users to see them when selecting an offer to subscribe to. 

Offers can be:
- **Public**: Visible to all users.
- **Private**: Only visible to the cloud administrators. Useful while drafting the plan or offer, or if the cloud administrator wants to create each subscription for users.
- **Decommissioned**: Closed to new subscribers. The cloud administrator can use decommissioned to prevent future subscriptions, but leave current subscribers untouched.

> [!TIP]
> Changes to the offer are not immediately visible to users. To see the changes, users might have to logout and login again to the [user portal](https://portal.local.azurestack.external) to see the new offer.

To set the new offer to public: 
   - Version 1803 and later: 
     1. On the dashboard menu, click **Offers** and then click the offer you created.

     2. Click **Accessibility State**, and then click **Public**.

        ![Change state](media/asdk-offer-services/change-state.png)

     3. The offer will now be available in the Azure Stack user portal.


   - Prior to version 1803:  
     1. On the dashboard menu, click **Offers** and then click the offer you created.

     2. Click **Change State**, and then click **Public**.

        ![Public state](media/asdk-offer-services/set-public.png)

     3. The offer will now be available in the Azure Stack user portal.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create an offer
> * Create a plan
> * Set quotas
> * Set offer to public

Advance to the next tutorial to learn how to subscribe to the offer you just created as an Azure Stack user.

> [!div class="nextstepaction"]
> [Subscribe to an offer](asdk-subscribe-services.md)
---
title: In this article, you learn how to update Azure Stack offers and plans | Microsoft Docs
description: This article describes how to view and modify existing Azure Stack offers and plans. 
services: azure-stack
documentationcenter: ''
author: brenduns
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.custom: mvc
ms.date: 06/07/2018
ms.author: brenduns
ms.reviewer: 
---

# Azure Stack add-on plans
As an Azure Stack operator, you create plans that contain the desired services and applicable quotas for your users to subscribe to. These [*base plans*](azure-stack-create-plan.md) contain the core services to be offered to your users and you can only have one base plan per offer. If you need to modify your offer, you can use *add-on plans* that allow you to modify the plan to extend computer, storage, or network quotas initially offered with the base plan. 

Although combining everything in a single plan may be optimal in some cases, you may want to have a base plan, and offer additional services using add-on plans. For instance, you could decide to offer IaaS services as part of a base plan, with all PaaS services treated as add-on plans. Plans can also be used to control consumption of resources in your Azure Stack environment. For example, if you want your users to be mindful of their resource usage, you could have a relatively small base plan (depending on the services required) and as users reach capacity, they would be alerted that they have already consumed the allocation of resources based on their assigned plan. From there, the users may select an available add-on plan for additional resources. 

> [!NOTE]
> When a user adds an add-on plan to an existing offer subscription, the additional resources could take up to an hour to appear. 

## Create an add-on plan
Add-on plans are created by modifying an existing offer:

1. Sign in to the Azure Stack administrator portal as a cloud administrator.
2. Follow the same steps used to [create a new base plan](azure-stack-create-plan.md) to create a new plan offering services that were not previously offered. In this example, Key Vault (Microsoft.KeyVault) services will be included in the new plan.
3. In the administrator portal, click **Offers** and then select the offer to be updated with an add-on plan.

   ![](media/create-add-on-plan/1.PNG)

4.  Scroll to the bottom of the offer properties and select **Add-on plans**. Click **Add**.
   
    ![](media/create-add-on-plan/2.PNG)

5. Select the plan to add. In this example, the plan is called **Key vault plan**, and then click **Select** to add the plan to the offer. You should receive a notification that the plan was added to the offer successfully.
   
    ![](media/create-add-on-plan/3.PNG)

6. Review the list of add-on plans included with the offer to verify that the new add-on plan listed.
   
    ![](media/create-add-on-plan/4.PNG)

## Next steps
[Create an offer](azure-stack-create-offer.md)
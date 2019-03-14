---
title: In this article, you learn how to update Azure Stack offers and plans | Microsoft Docs
description: This article describes how to view and modify existing Azure Stack offers and plans. 
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.custom: mvc
ms.date: 03/07/2019
ms.author: sethm
ms.reviewer: efemmano
ms.lastreviewed: 03/07/2019
---

# Azure Stack add-on plans

As an Azure Stack operator, you create add-on plans to modify a [base plan](azure-stack-create-plan.md) when you want to offer additional services or extend *computer*, *storage*, or *network* quotas beyond the base plan initial offer. Add-on plans modify the base plan and are optional extensions that users can choose to subscribe to.

There are times when combining everything in a single plan is optimal. Other times you might want to have a base plan and then offer the additional services by using add-on plans. For instance, you could decide to offer IaaS services as part of a base plan, with all PaaS services treated as add-on plans.

Another reason to use add-on plans is to help monitor resource usage. To do so, you could start with a base plan that includes relatively small quotas (depending on the services required). Then, as users reach capacity, they would be alerted that they've consumed the allocation of resources based on their assigned plan. From there, the users can select an add-on plan that provides the additional resources.

> [!NOTE]
> When you do not want to use an add-on plan to extend a quota, you can also choose to [edit the original configuration of the quota](azure-stack-quota-types.md#edit-a-quota).

When you add an add-on plan to an existing offer subscription, the additional resources can take up to an hour to appear.

Add-on plans are created by modifying an existing offer.

## Create an add-on plan (1902 and later)

1. Sign in to the Azure Stack administrator portal as a cloud administrator.
2. Follow the same steps used to [create a new base plan](azure-stack-create-plan.md) to create a new plan offering services that were not previously offered.
3. In the administrator portal, click **Offers** and then select the offer to be updated with an add-on plan.

   ![Create add-on plan](media/create-add-on-plan/add-on1.png)

4. Scroll to the bottom of the offer properties and select **Add-on plans**. Click **Add**.

    ![Create add-on plan](media/create-add-on-plan/add-on2.png)

5. Select the plan to add. In this example, the plan is called **20-storageaccounts**. After selecting the plan, click **Select** to add the plan to the offer. You should receive a notification that the plan was added to the offer successfully.

    ![Create add-on plan](media/create-add-on-plan/add-on3.png)

6. Review the list of add-on plans included with the offer to verify that the new add-on plan is listed.

    [![Create add-on plan](media/create-add-on-plan/add-on4.png "Create add-on plan")](media/create-add-on-plan/add-on4lg.png#lightbox)

## Create an add-on plan (1901 and earlier)

1. Sign in to the Azure Stack administrator portal as a cloud administrator.
2. Follow the same steps used to [create a new base plan](azure-stack-create-plan.md) to create a new plan offering services that were not previously offered. In this example, Key Vault (**Microsoft.KeyVault**) services will be included in the new plan.
3. In the administrator portal, click **Offers** and then select the offer to be updated with an add-on plan.

   ![Create add-on plan](media/create-add-on-plan/1.PNG)

4. Scroll to the bottom of the offer properties and select **Add-on plans**. Click **Add**.

    ![Create add-on plan](media/create-add-on-plan/2.PNG)

5. Select the plan to add. In this example, the plan is called **Key vault plan**. After selecting the plan, click **Select** to add the plan to the offer. You should receive a notification that the plan was added to the offer successfully.

    ![Create add-on plan](media/create-add-on-plan/3.PNG)

6. Review the list of add-on plans included with the offer to verify that the new add-on plan is listed.

    ![Create add-on plan](media/create-add-on-plan/4.PNG)

## Next steps

* [Create an offer](azure-stack-create-offer.md)
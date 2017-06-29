---
title: Subscribe to an offer and then provision a VM in Azure Stack (tenant) | Microsoft Docs
description: As a tenant, learn how to subscribe to an offer and then provision a VM in Azure Stack.
services: azure-stack
documentationcenter: ''
author: ErikjeMS
manager: byronr
editor: ''

ms.assetid: 7f3f8683-ef09-4838-92ed-41f2fddbbbed
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 7/10/2017
ms.author: erikje

---
# Subscribe to an offer
Now that you've [created an offer](azure-stack-create-offer.md), test that your tenants can create a subscription.

1. [Sign in](azure-stack-connect-azure-stack.md) to the Azure Stack tenant portal (https://portal.local.azurestack.external) and click **Get a Subscription**.

   ![](media/azure-stack-subscribe-plan-provision-vm/image01.png)
2. In the **Display Name** field, type a name for your subscription, click **Offer**, click one of the offers in the **Choose an offer** blade, and then click **Create**.

   ![](media/azure-stack-subscribe-plan-provision-vm/image02.png)
3. To view the subscription you created, click **More services**, click **Subscriptions**, then click your new subscription.  

After you subscribe to an offer, refresh the portal to see which services are part of the new subscription.

# Subscribe to an add-on plan
If the offer has an add-on plan, tenants can add them to their subscription at any time.  

1. In the tenant portal, select More services > Subscriptions .

2. Click on the subscription > Add Plan button, and select the add-on plan.



## Next steps
[Provision a virtual machine](azure-stack-provision-vm.md)

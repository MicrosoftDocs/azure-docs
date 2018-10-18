---
title: In this tutorial, you learn how to subscribe to an Azure Stack offer | Microsoft Docs
description: This tutorial shows you how to create a new subscription to Azure Stack services and test the offer by creating a test virtual machine.
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
ms.topic: tutorial
ms.custom: mvc
ms.date: 09/05/2018
ms.author: sethm
ms.reviewer: 
---

# Tutorial: create and test a subscription
This tutorial shows you how to create a subscription containing an offer and then test it. 
For the test, you will sign in to the Azure Stack user portal as a cloud administrator, subscribe to the offer, and then create a virtual machine.

> [!TIP]
> For more a more advanced evaluation experience, you can [create a subscription for a particular user](https://docs.microsoft.com/azure/azure-stack/azure-stack-subscribe-plan-provision-vm#create-a-subscription-as-a-cloud-operator) and then login as that user in the user portal. 

This tutorial shows you how to subscribe to an Azure Stack offer.

What you will learn:

> [!div class="checklist"]
> * Subscribe to an offer 
> * Test the offer

## Subscribe to an offer
To subscribe to an offer as a user, you need to login to the Azure Stack user portal to discover the services that have been offered by the Azure Stack operator.

1. Sign in to the user portal and click **Get a Subscription**.

   ![Get a subscription](media/azure-stack-subscribe-services/get-subscription.png)

2. In the **Display Name** field, type a name for your subscription. Then, click **Offer** to select one of the available offers in the **Choose an offer** section and then click **Create**.

   ![Create an offer](media/azure-stack-subscribe-services/create-subscription.png)

   > [!TIP]
   > You must now refresh the user portal to start using your subscription.

3. To view the subscription you created, click **All services**.  Then, under the **GENERAL** category select **Subscriptions**, and then select your new subscription. After you subscribe to an offer, refresh the portal to see if new services have been included as part of the new subscription. In this example, **Virtual machines** has been added.

   ![View subscription](media/azure-stack-subscribe-services/view-subscription.png)


## Test the offer
While logged in to the user portal, you can test the offer by provisioning a virtual machine using the new subscription capabilities. 

> [!NOTE]
> This test requires that a Windows Server 2016 Datacenter VM has first been added to the Azure Stack marketplace. 

1. Sign in to the user portal.

2. In the user portal, click **Virtual Machines** > **Add** > **Windows Server 2016 Datacenter**, and then click **Create**.

3. In the **Basics** section, type a **Name**, **User name**, and **Password**, choose a **Subscription**, create a **Resource group** (or select an existing one), and then click **OK**.

4. In the **Choose a size** section, click **A1 Standard**, and then click **Select**.  

5. In the Settings blade, accept the defaults and click **OK**.

6. In the **Summary** section, click **OK** to create the virtual machine.  

7. To see your new virtual machine, click **Virtual machines**, then search for the new virtual machine, and click its name.

    ![All resources](media/azure-stack-subscribe-services/view-vm.png)

> [!NOTE]
> The virtual machine deployment will take a few minutes to complete.


## Next steps

What you learned in this tutorial:

> [!div class="checklist"]
> * Subscribe to an offer 
> * Test the offer


> [!div class="nextstepaction"]
> [Create a VM from a community template](azure-stack-create-vm-template.md)
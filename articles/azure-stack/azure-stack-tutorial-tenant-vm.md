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
ms.topic: article
ms.date: 9/25/2017
ms.author: victorh
ms.custom: mvc

---
# Make virtual machines available to your Azure Stack users

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

As an Azure Stack cloud administrator, you can create offers that your users (sometimes referred to as tenants) can subscribe to. Using their subscription, users can then consume Azure Stack services.

This article shows you how to create an offer, and then test it. 
For the test, you will log in to the portal as a user, subscribe to the offer, and then create a virtual machine using the subscription.

What you will learn:

> [!div class="checklist"]
> * Create an offer
> * Add an image
> * Test the offer


In Azure Stack, services are delivered to users using subscriptions, offers, and plans. Users can subscribe to multiple offers. Offers can have one or more plans, and plans can have one or more services.

![Subscriptions, offers, and plans](media/azure-stack-key-features/image4.png)

To learn more, see [Key features and concepts in Azure Stack](azure-stack-key-features.md).

## Create an offer

Now you can get things ready for your users. When you start the process, you are first prompted to create the offer, then a plan, and finally quotas.

3. **Create an offer**

   Offers are groups of one or more plans that providers present to users to purchase or subscribe to.

   a. [Sign in](azure-stack-connect-azure-stack.md) to the portal as a cloud administrator and then click **New** > **Tenant Offers + Plans** > **Offer**.
   ![New offer](media/azure-stack-tutorial-tenant-vm/image01.png)

   b. In the **New Offer** section, fill in **Display Name** and **Resource Name**, and then select a new or existing **Resource Group**. The Display Name is the offer's friendly name. Only the cloud operator can see the Resource Name. It's the name that admins use to work with the offer as an Azure Resource Manager resource.

   ![Display name](media/azure-stack-tutorial-tenant-vm/image02.png)

   c. Click **Base plans**, and in the **Plan** section, click **Add** to add a new plan to the offer.

   ![Add a plan](media/azure-stack-tutorial-tenant-vm/image03.png)

   d. In the **New Plan** section, fill in **Display Name** and **Resource Name**. The Display Name is the plan's friendly name that users see. Only the cloud operator can see the Resource Name. It's the name that cloud operators use to work with the plan as an Azure Resource Manager resource.

   ![Plan display name](media/azure-stack-tutorial-tenant-vm/image04.png)

   e. Click **Services**, select **Microsoft.Compute**, **Microsoft.Network**, and **Microsoft.Storage**, and then click **Select**.

   ![Plan services](media/azure-stack-tutorial-tenant-vm/image05.png)

   f. Click **Quotas**, and then select the first service for which you want to create a quota. For an IaaS quota, follow these steps for the Compute, Network, and Storage services.

   In this example, we first create a quota for the Compute service. In the namespace list, select the **Microsoft.Compute** namespace and then click **Create new quota**.
   
   ![Create new quota](media/azure-stack-tutorial-tenant-vm/image06.png)

   g. On the **Create quota** section, type a name for the quota and set the desired parameters for the quota and click **OK**.

   ![Quota name](media/azure-stack-tutorial-tenant-vm/image07.png)

   h. Now, for **Microsoft.Compute**, select the quota that you created.

   ![Select quota](media/azure-stack-tutorial-tenant-vm/image08.png)

   Repeat these steps for the Network and Storage services, and then click **OK** on the **Quotas** section.

   i. Click **OK** on the **New plan** section.

   j. On the **Plan** section, select the new plan and click **Select**.

   k. On the **New offer** section, click **Create**. You see a notification when the offer has been created.

   l. On the dashboard menu, click **Offers** and then click the offer you created.

   m. Click **Change State**, and then click **Public**.

   ![Public state](media/azure-stack-tutorial-tenant-vm/image09.png)

## Add an image

Before you can provision virtual machines, you must add an image to the Azure Stack marketplace. You can add the image of your choice, including Linux images, from the Azure Marketplace.

If you are operating in a connected scenario and if you have registered your Azure Stack instance with Azure, then you can download the Windows Server 2016 VM image from the Azure Marketplace by using the steps described in the [Download marketplace items from Azure to Azure Stack](azure-stack-download-azure-marketplace-item.md) topic.

For information about adding different items to the marketplace, see [The Azure Stack Marketplace](azure-stack-marketplace.md).

## Test the offer

Now that you’ve created an offer, you can test it. Log in as a user and subscribe to the offer and then add a virtual machine.

1. **Subscribe to an offer**

   Now you can log in to the portal as a user to subscribe to an offer.

   a. On the Azure Stack Deployment Kit computer, log in to `https://portal.local.azurestack.external` as a user and click **Get a Subscription**.

   ![Get a subscription](media/azure-stack-subscribe-plan-provision-vm/image01.png)

   b. In the **Display Name** field, type a name for your subscription, click **Offer**, click one of the offers in the **Choose an offer** section, and then click **Create**.

   ![Create an offer](media/azure-stack-subscribe-plan-provision-vm/image02.png)

   c. To view the subscription you created, click **More services**, click **Subscriptions**, then click your new subscription.  

   After you subscribe to an offer, refresh the portal to see which services are part of the new subscription.

2. **Provision a virtual machine**

   Now you can log in to the portal as a user to provision a virtual machine using the subscription. 

   a. On the Azure Stack Deployment Kit computer, log in to `https://portal.local.azurestack.external` as a user, and then click **New** > **Compute** > **Windows Server 2016 Datacenter Eval**.  

   b. In the **Basics** section, type a **Name**, **User name**, and **Password**. For **VM disk type**, choose **HDD**. Choose a **Subscription**. Create a **Resource group**, or select an existing one, and then click **OK**.  

   c. In the **Choose a size** section, click **A1 Basic**, and then click **Select**.  

   d. In the **Settings** section, click **Virtual network**. In the **Choose virtual network** section, click **Create new**. In the **Create virtual network** section, accept all the defaults, and click **OK**. In the **Settings** section, click **OK**.

   ![Create virtual network](media/azure-stack-provision-vm/image04.png)

   e. In the **Summary** section, click **OK** to create the virtual machine.  

   f. To see your new virtual machine, click **All resources**, then search for the virtual machine and click its name.

    ![All resources](media/azure-stack-provision-vm/image06.png)

What you learned in this tutorial:

> [!div class="checklist"]
> * Create an offer
> * Add an image
> * Test the offer

> [!div class="nextstepaction"]
> [Make web, mobile, and API apps available to your Azure Stack users](azure-stack-tutorial-app-service.md)
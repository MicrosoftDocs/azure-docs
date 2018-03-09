---
title: Subscribe to an offer in Azure Stack | Microsoft Docs
description: Create subscriptions for offers in Azure Stack
services: azure-stack
documentationcenter: ''
author: brenduns
manager: femila
editor: ''

ms.assetid: 7f3f8683-ef09-4838-92ed-41f2fddbbbed
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 02/06/2018
ms.author: brenduns

---
# Create subscriptions to offers in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

After you [create an offer](azure-stack-create-offer.md), users need a subscription to that offer before they can use it.   
- As a cloud operator, you can create a subscription for a user from within the administrator portal.  Subscriptions you create can be for both public and private offers.
- As a tenant user, you can subscribe to a public offer when you use the user portal.  

The following sections provide guidance for cloud operators when creating subscriptions for users, and how to subscribe to an offer as a user.

## Create a subscription as a cloud operator
Cloud operators can use the admin portal to create a subscription to an offer for a user.  You can create subscriptions for members of your own directory tenant.  When [multi-tenancy](azure-stack-enable-multitenancy.md) is enabled, you can also create subscriptions for users in additional directory tenants.

You can create subscriptions for both public and private offers.  If do not want your tenants to create their own subscriptions, make all of your offers private, and then create subscriptions on behalf of your tenants. This approach is common when integrating Azure Stack with external billing or service catalog systems.

After you create a subscription for a user, that user can log into the user portal and will find that they are subscribed to the offer.  

### To create the subscription for a user
1.	In the Admin portal, go to **User subscriptions.**
2.	Select **Add** to open the **New user subscription** pane. Here you specify the following details:  

  a. **Display name** – A friendly name for identifying the subscription that appears as the *User subscription name*.

  b. **User** – Specify a user from an available directory tenant for this subscription. The user name appears as *Owner*.  The format of the user name depends on your identity solution. For example:   

     -  **Azure AD:**  *&lt;user1>@&lt;contoso.onmicrosoft.com>*

     -   **AD FS:**  *&lt;user1>@&lt;azurestack.local>*     

  c.	**Directory tenant** –  Select the directory tenant where the user account belongs. If you have not enabled multi-tenancy, only your local directory tenant is available.

3.	Select **Offer** to open the **Offers** pane, and then choose an **Offer** for this subscription. Because you are creating a subscription for a user, you can select a private or public offer.

4.	Select **Create** to create the subscription. The **User subscriptions** pane now displays the new subscription.  Later, when the user logs into the user portal, they can view details about this subscription.

### To make an add-on plan available  
A cloud operator can add an add-on plan to a previously created subscription at any time:   
1.	In the admin portal go to **More Services** > **User subscriptions**, and then select the subscription you want to change.   

2.	Select **Add-ons** > **Add**  to open the **Add plan** pane.  

3.	Select the plan you want to add as an add-on.  The console then displays the plans associated with the subscription.




## Create a subscription as a user
As a user, you can sign in to the user portal to locate and subscribe to public offers and add-on plans from your directory tenant (organization). When the Azure Stack environment supports [multi-tenancy](azure-stack-enable-multitenancy.md) you can subscribe to offers from a remote directory tenant.

### To subscribe to an offer
1. [Sign in](azure-stack-connect-azure-stack.md) to the Azure Stack user portal (https://portal.local.azurestack.external) and click **Get a Subscription**.

   ![Get a subscription](media/azure-stack-subscribe-plan-provision-vm/image01.png)
2. In the **Display Name** field, type a name for your subscription, click **Offer**, click one of the offers in the **Choose an offer** pane, and then click **Create**.

   ![Create an offer](media/azure-stack-subscribe-plan-provision-vm/image02.png)
3. To view the subscription you created, click **More services**, click **Subscriptions**, then click your new subscription.  

After you subscribe to an offer, refresh the portal to see which services are part of the new subscription.

### To subscribe to an add-on plan
If an offer has an add-on plan, you can add that plan to your subscription at any time.  

1. In the user portal, select **More services** > **Subscriptions**, and then select the subscription that you want change.

2. Select **Add Plan** button, and then select the add-on plan you want. If **Add plan** is not available, then there are no add-on plans for the offer associated with that subscription.



## Next steps
[Provision a virtual machine](azure-stack-provision-vm.md)

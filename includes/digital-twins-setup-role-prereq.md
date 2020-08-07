---
author: baanders
description: include file for role requirement in Azure Digital Twins setup
ms.service: digital-twins
ms.topic: include
ms.date: 7/17/2020
ms.author: baanders
---

## Prerequisites: Permission requirements

To be able to complete all the steps in this article, you need to be classified as an Owner in your Azure subscription. 

You can check your permission level in the [subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) in the Azure portal (you can use this link or look for *Subscriptions* with the portal search bar). Look for the name of the subscription you are using, and view your role for it in the *My role* column. If you are an owner, this value is *Owner*:

:::image type="content" source="../articles/digital-twins/media/how-to-set-up-instance/portal/subscriptions-role.png" alt-text="View of the Subscriptions page in the Azure portal, showing user as an owner" lightbox="../articles/digital-twins/media/how-to-set-up-instance/portal/subscriptions-role.png":::

If you find that the value is *Contributor* or something other than *Owner*, you can proceed in one of the following ways:
* Contact your subscription Owner and request for the Owner to complete the steps in this article on your behalf
* Contact either your subscription Owner or someone with User Access Admin role on the subscription, and request that they elevate you to Owner on the subscription so that you will have the permissions to proceed yourself. Whether this is appropriate depends on your organization and your role within it.
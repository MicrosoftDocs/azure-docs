---
title: Open a support ticket for Azure HPC Cache
description: How to open a help request for Azure HPC Cache, including how to create a quota increase request 
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 07/13/2022
ms.author: v-erinkelly
---

# Contact support for help with Azure HPC Cache

The best way to get help with Azure HPC Cache is to use the Azure portal to open a support ticket.

Navigate to your cache instance, then click the **New support request** link that appears at the bottom of the sidebar.

To open a ticket when you do not have an active cache, use the main Help + support page from the Azure portal. Open the portal menu from the control at the top left of the screen, then scroll to the bottom and click **Help + support**.

> [!TIP]
> If you need a quota increase, most requests can be handled automatically. Follow the instructions below in [Request a quota increase](#request-a-quota-increase).

Choose **New support request** and select **Technical** for help specific to Azure HPC Cache.

Select your subscription from the list.

To find the Azure HPC Cache service, click the **All services** button and search for HPC.

![Screenshot of the support request - Basics tab, partly filled out as described](media/hpc-cache-support-request.png)

Fill out the rest of the fields with your information and preferences, then submit the ticket when you are ready.

After you submit the request, you will receive a confirmation email with a ticket number. A support staff member will contact you about the request.

## Request a quota increase

Use the quotas page in the Azure portal to check your current quotas and request increases.

The default quota for Azure HPC Cache is four caches per subscription. If you want to create more than six caches in the same subscription, support approval is needed. One HPC Cache uses multiple virtual machines, network resources, storage containers, and other Azure services, so it's unlikely that the number of caches per subscription will be the limiting factor in how many you can have.

Use the support request form described above to request a quota increase.

* For **Issue type**, select **Service and subscription limits (quotas)**.

  ![Select an issue type](media/select-quota-issue-type.png)

* For **Subscription**, select the subscription for the quota increase.

  ![Select a subscription for an increased quota](media/select-subscription-support-request.png)

* Select the **Quota type** "Cache".

  ![Quota type storage cache](media/hpc-cache-quota-draft.png)

Enter any additional details required and create the request.

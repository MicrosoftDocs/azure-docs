---

title: Register your Azure subscription with Azure Cost Management | Microsoft Docs
description: You use your Azure subscription to register with Azure Cost Management by Cloudyn.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 09/14/2017
ms.topic: hero-article
ms.custom: mvc
ms.service: cost-management
manager: carmonm
---

# Register an individual Azure subscription

Use this guide to register with Azure Cost Management by Cloudyn if you purchased your subscriptions directly from Microsoft. This guide details the registration process needed to create a Cloudyn trial subscription and sign in to the Cloudyn portal.

## Sign in to Azure

- Sign in to the Azure portal at [http://portal.azure.com](http://portal.azure.com/).

## Register with Cost Management + Billing

1. In the Azure portal, click **Cost Management + Billing**.
2. Click **Cost Management**.
3. In Cost Management, click **Go to Cloudyn** to open the Cloudyn registration page.
4. On the trial registration page, select **Azure Individual Subscription Owner** , and then click **Next**.
5. Type a name to identity the cloud account in **Cloudyn account name**.
6. Select your **Rate ID** and then click **Next.** If you are unsure of what your Rate ID is, see [What is my rate ID and how to find it](#what-is-my-rate-id-and-how-to-find-it).
7. Click **Next** to authorize Cloudyn to collect Azure resource data. Data collected includes usage, performance, billing, and tag data from your subscriptions.
8. Click **Go to Cloudyn** to open the Cloudyn portal.
9. On the **Cloud Accounts Management** page, you should see your registered Azure subscription account information.

## Register from the Azure Marketplace

1. In the Azure portal, click **New** on the left navigation bar.
2. Click **Monitoring + Management** in the Marketplace gallery list.
3. Select **Cost Management** from the Featured list.
4. On the **Cost Management** details page, click **Create** to open the welcome page.
5. On the welcome page, click **Go to Cloudyn** to open the Cloudyn registration page.
6. On the trial registration page, select **Azure Individual Subscription Owner**, and then click **Next.**
7. Type a name to identity this cloud account in **Cloudyn account name**.
8. Select your **Rate ID**, and then click **Next.** If you are unsure of what your Rate ID is, see [What is my rate ID and how to find it](#what-is-my-rate-id-and-how-to-find-it).
9. Click **Next** to authorize Cloudyn to collect Azure resource data. Data collected includes usage, performance, billing, and tag data from your subscriptions.
10. Click **Go to Cloudyn** to open the Cloudyn portal.
11. On the **Cloud Accounts Management** page, you should see your registered Azure subscription account information.

## What is my rate ID and how to find it

The Rate ID is a combination of the Azure Offer ID and the Offer name. The Rate ID is used to calculate the costs of your Azure resources. For more information on Azure Offers, see [Microsoft Azure Offer Details](https://azure.microsoft.com/support/legal/offer-details).

### To find the Rate ID

You can find the Rate ID in your billing information in the Azure portal.

1. Sign in to the Azure portal at  [http://portal.azure.com](http://portal.azure.com/).
2. Click your Azure account name at the top right of the portal and then select **View my bill**.
3. Under **Billing Account**, select **Subscriptions**.
4. Click one of the Azure subscriptions to open subscription details.
5. On **Overview**, you should see your **Offer** and **Offer ID.** Make note of these values to use during registration.

## Create your hierarchical organization

In the Cloudyn portal, build your hierarchical organization using Cloudyn entities. Creating the hierarchy helps you accurately track spending by different departments and parts of your organization. Read the Cloudyn entities tutorials for more information.

## Next steps

In this quick start, you used your Azure subscription information to register with Cost Management. You also signed into the Cloudyn portal. To learn more about Azure Cost Management by Cloudyn, continue to the tutorial for Cost Management.

<!---


> [!div class="nextstepaction"]
> [Azure Windows virtual machine tutorials](./tutorial-manage-vm.md)
-->

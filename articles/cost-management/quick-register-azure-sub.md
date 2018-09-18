---
title: Register your Azure subscription with Cloudyn | Microsoft Docs
description: Use your Azure subscription to register with Cloudyn.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 08/07/2018
ms.topic: quickstart
ms.custom:
ms.service: cost-management
manager: dougeby
---


# Register an individual Azure subscription and view cost data

You use your Azure subscription to register with Cloudyn. Your registration provides access to the Cloudyn portal. This quickstart details the registration process needed to create a Cloudyn trial subscription and sign in to the Cloudyn portal. It also shows you how to start viewing cost data right away.

## Sign in to Azure

- Sign in to the Azure portal at http://portal.azure.com.

## Register with Cloudyn

1. In the Azure portal, click **Cost Management + Billing** in the list of services.
2. Under **Overview**, click **Cloudyn**  
    ![Cloudyn page](./media/quick-register-azure-sub/cost-mgt-billing-service.png)
3. On the **Cost Management** page, click **Go to Cloudyn** to open the Cloudyn registration page in a new window.
4. On the Cloudyn portal trial registration page, type your company name and then select **Azure Individual Subscription Owner** and then click **Next**. Your account name and Tenant ID is automatically added to the form.  
    ![Trial registration](./media/quick-register-azure-sub/trial-reg-ind.png)
5. Select your **Offer ID - Name** associated with your subscription. If you're unsure of what your Rate ID is for your subscription, you can view your Azure bill and look for **Offer ID**.
6. Agree to the Terms of Use then validate your information and then click **Next**.
7. In the **Gather additional data** page, click **Next** to authorize Cloudyn to collect Azure resource data. Data collected includes usage, performance, billing, and tag data from your subscriptions.  
    ![Gather additional data](./media/quick-register-azure-sub/gather-additional.png)
8. Your browser takes you to the sign in page for Cloudyn. Sign in with your Azure subscription credentials.
9. Click **Go to Cloudyn** to open the Cloudyn portal and then on the **Accounts Management** page, you should see your Azure subscription account information.  
    ![Accounts Management](./media/quick-register-azure-sub/accounts-mgt.png)

To watch a tutorial video about registering your Azure subscription, see [Finding your Directory GUID and Rate ID for use in Cloudyn](https://youtu.be/PaRjnyaNGMI).

[!INCLUDE [cost-management-create-account-view-data](../../includes/cost-management-create-account-view-data.md)]

## Next steps

In this quickstart, you used your Azure subscription information to register with Cloudyn. You also signed into the Cloudyn portal and started viewing cost data. To learn more about Cloudyn, continue to the tutorial for Cloudyn.

> [!div class="nextstepaction"]
> [Review usage and costs](./tutorial-review-usage.md)

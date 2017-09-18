---

title: Register your Azure Enterprise Agreement with Azure Cost Management | Microsoft Docs
description: Use your Enterprise Agreement to register with Azure Cost Management by Cloudyn.
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


# Register an Azure Enterprise Agreement and view cost data

You use your Azure Enterprise Agreement to register with Azure Cost Management by Cloudyn. Your registration provides access to the Cloudyn portal. This quickstart details the registration process needed to create a Cloudyn trial subscription and sign in to the Cloudyn portal. It also shows you how to start viewing cost data right away.

## Log in to Azure

- Log in to the Azure portal at http://portal.azure.com.

## Access Cloudyn from the Azure Marketplace

1. In the Azure portal, click on **New** on the left navigation bar.
2. Click **Monitoring + Management** in the Marketplace gallery list and then select **Cost Management by Cloudyn** from the Featured list.  
    ![Marketplace symbol](./media/quick-register-azure-sub/marketplace.png)
4. On the **Cost Management** details page, click **Create** to open the welcome page.  
5. On the welcome page, click **Go to Cloudyn** to open the Cloudyn registration page in a new window.

## Create a trial registration
1. On the Cloudyn portal trial registration page, type your company name and then select **Enterprise Enrollment (EA)**.  
    ![trial registration](./media/quick-register-ea/trial-reg.png)
2. Enter your Enterprise Portal enrollment API key. If you don't have your key handy, click the [Enterprise Portal](https://ea.azure.com) link and do the following steps:
  1. Sign in to the Azure Enterprise website and click **Reports**, click **API Access Key** and then copy your primary key.  
    ![EA API key](./media/quick-register-ea/ea-key.png)
  3. Go back to the registration page and paste in your API key.
3. Agree to the Terms of Use then validate your key. Click **Next** to authorize Cloudyn to collect Azure resource data. Data collected includes usage, performance, billing, and tag data from your subscriptions.  
    ![key validation](./media/quick-register-ea/ea-key-validated.png)
4. Under **Invite other stakeholders**, you can add users by typing their email addresses. When complete, click **Next**. It takes about two hours for all your billing data to get added to Cloudyn.
5. Click **Go to Cloudyn** to open the Cloudyn portal and then on the **Cloud Accounts Management** page, you should see your registered EA account information.

[!INCLUDE [cost-management-create-account-view-data](../../includes/cost-management-create-account-view-data.md)]

## Next steps

In this quick start, you used your Azure Enterprise Agreement information to register with Cost Management. You also signed into the Cloudyn portal and started viewing cost data. To learn more about Azure Cost Management by Cloudyn, continue to the tutorial for Cost Management.

> [!div class="nextstepaction"]
> [Assign access to cost management data](./tutorial-user-access.md)

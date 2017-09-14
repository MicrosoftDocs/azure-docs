---

title: Register your CSP information with Azure Cost Management | Microsoft Docs
description: You use your CSP Partner program information to register with Azure Cost Management by Cloudyn.
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

# Register with the CSP Partner program

As a CSP partner, you can register with Azure Cost Management by Cloudyn. This guide details the registration process needed to create a Cloudyn trial subscription and sign in to the Cloudyn portal.

To complete registration, you must be a partner program administrator with access to the Partner Center API. Configuration of the Partner Center API is required for authentication and data access. For more information, see [Connect to the Partner Center API](#connect-to-the-partner-center-api).

## Sign in to Azure

- Sign in to the Azure portal at [http://portal.azure.com](http://portal.azure.com).

## Register with Cost Management + Billing

1. In the Azure portal, click **Cost Management + Billing**.
2. Click **Cost Management**.
3. In Cost Management, click **Go to Cloudyn** to open the Cloudyn registration page.
4. On the trial registration page, select **Microsoft CSP Partner Program Administrator**, and then click **Next**.
5. Enter your CSP **API Commerce ID** and **Application secret key**. If you don't have the information handy, follow the instructions at [Connect to the Partner Center API](#connect-to-the-partner-center-api).
6. Choose your **Default Pricing Plan** from the list.
7. Click **Next** and your CSP API connection information is validated.
8. After the key is validated, click **Next** to authorize Cloudyn to collect Azure resource data. Data collected includes usage, performance, billing, and tag data from your subscriptions.
9. Under **Invite other stakeholders**, you can add users by typing their email addresses. When complete, click **Next**. It takes about two hours for all your billing data to get added to Cloudyn.
10. Click **Go to Cloudyn** to open the Cloudyn portal.
11. On the **Cloud Accounts Management** page, you should see your registered CSP account information.

## Register from the Azure Marketplace

1. In the Azure portal, click **New** on the left navigation bar.
2. Click **Monitoring + Management** in the Marketplace gallery list.
3. Select **Cost Management** from the Featured list.
4. On the **Cost Management** details page, click **Create** to open the welcome page.
5. On the welcome page, click **Go to Cloudyn** to open the Cloudyn registration page.
6. On the trial registration page, select **Microsoft CSP Partner Program Administrator**, and then click **Next**.
7. Paste your CSP API **Commerce ID** and **Application secret key**. If you don't have the information handy, follow the instructions at [Connect to the Partner Center API](#connect-to-the-partner-center-api).
8. Choose your **Default Pricing Plan** from the list.
9. Click **Next** and your CSP API connection information is validated.
10. After the key is validated, click **Next** to authorize Cloudyn to collect Azure resource data. Data collected includes usage, performance, billing, and tag data from your subscriptions.
11. Under **Invite other stakeholders**, you can add users by typing their email addresses. When complete, click **Next**. It takes about two hours for all your billing data to get added to Cloudyn.
12. Click **Go to Cloudyn** to open the Cloudyn portal.
13. On the **Cloud Accounts Management** page, you should see your registered CSP account information.

## Connect to the Partner Center API

You need to configure the Partner Center API to authenticate with Azure Cost Management and provide access to data.

### Enable Web App API access in Partner Center

Sign in to the Partner Center portal at [https://partnercenter.microsoft.com](https://partnercenter.microsoft.com) with your primary administrator account.

### Retrieve Partner Center API access information

1. In the Partner Center portal, go to **Dashboard** > **Account Settings** > **App Management**.
2. If you have previously created a Web App, skip this step. Otherwise, click **Add new web app** in the **Web App** section.
3. Copy the **Commerce ID** GUID from your web application. This is needed during the Cloudyn registration process.

### Add a secret key to your app

1. Select the key validity duration as 1 or 2 years, as needed, and then select **Add key**.
2. Copy and save the secret key value. This is needed during the Cloudyn registration process.

## Create your hierarchical organization

In the Cloudyn portal, build your hierarchical organization using Cloudyn entities. Creating the hierarchy helps you accurately track spending by different departments and parts of your organization. Read the Cloudyn entities tutorials for more information.

## Next steps

In this quick start, you used your CSP information to register with Cost Management. You also signed into the Cloudyn portal. To learn more about Azure Cost Management by Cloudyn, continue to the tutorial for Cost Management.

<!---


> [!div class="nextstepaction"]
> [Azure Windows virtual machine tutorials](./tutorial-manage-vm.md)
-->

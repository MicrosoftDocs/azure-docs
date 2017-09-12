---

title: Register your Azure Enterprise Agreement with Azure Cost Management | Microsoft Docs
description: You use your Azure Enterprise Agreement to register with Azure Cost Management by Cloudyn.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 09/12/2017
ms.topic: hero-article
ms.custom: mvc
ms.service: cost-management
manager: carmonm
---


# Register an Azure Enterprise Agreement with Azure Cost Management

You use your Azure Enterprise Agreement to register with Azure Cost Management by Cloudyn. This guide details the registration process using the Azure portal to create a Cloudyn trial subscription and sign in to the Cloudyn portal.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Add Cost Management and register for a trial

1. In the Azure portal, search the list of services in the Marketplace for _Cost Management._
2. On the **Cost Management** page, click **Create** to open the welcome page.
3. On the welcome page, click **Go to Cloudyn** to open the Cloudyn registration page.
4. On the trial registration page, type your company name.
5. Select **Enterprise Enrollment (EA)**.
6. Enter your Enterprise Portal enrollment API key. If you don't have your key handy, click the Enterprise Portal link and do the following:
  1. Sign in to the Azure Enterprise website and then click **Reports**.
  2. Click **API Access Key** and then copy your primary key.
  3. Go back to the registration page and page your key.
7. Click **Next** and your key is validated.
8. After the key is validated, click **Next** to authorize Cloudyn to collect Azure resource data. Data collected includes usage, performance, billing, and tag data from your subscriptions.
9. Under **Invite other stakeholders** , you can add users by typing their email addresses. When complete, click **Next**. It takes about two hours for all of your billing data to get added to Cloudyn.
10. Click **Go to Cloudyn** to open the Cloudyn portal.
11. You should see your organizational entity structure and Azure account information.

## Next steps

In this quick start, you used your Azure Enterprise Agreement information to register it with Cost Management. You also signed into the Cloudyn portal. To learn more about Azure Cost Management by Cloudyn, continue to the tutorial for Cost Management.

<!---


> [!div class="nextstepaction"]
> [Azure Windows virtual machine tutorials](./tutorial-manage-vm.md)
-->

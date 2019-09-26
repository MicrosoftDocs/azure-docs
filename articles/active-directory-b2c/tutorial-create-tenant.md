---
title: Tutorial - Create an Azure Active Directory B2C tenant
description: Learn how to prepare for registering your applications by creating an Azure Active Directory B2C tenant using the Azure portal.
services: B2C
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/28/2019
ms.author: marsma
ms.subservice: B2C
---

# Tutorial: Create an Azure Active Directory B2C tenant

Before your applications can interact with Azure Active Directory B2C (Azure AD B2C), they must be registered in a tenant that you manage.

In this article, you learn how to:

> [!div class="checklist"]
> * Create an Azure AD B2C tenant
> * Link your tenant to your subscription

You learn how to register an application in the next tutorial.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an Azure AD B2C tenant

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Make sure you're using the directory that contains your subscription.

    Select the **Directory + subscription** filter in the top menu and then select the directory that contains your subscription. This directory is different from the one that will contain your Azure AD B2C tenant.

    ![Directory + subscription filter with subscription tenant selected](media/tutorial-create-tenant/portal-01-select-directory.png)

1. Select **Create a resource** in the top-left corner of the Azure portal.
1. Search for and select **Active Directory B2C**, then select **Create**.
1. Select **Create a new Azure AD B2C Tenant**.

    ![Create a new Azure AD B2C tenant selected in Azure portal](media/tutorial-create-tenant/portal-02-create-tenant.png)

1. Enter an **Organization name** and **Initial domain name**. Select the **Country or region** (it can't be changed later), and then select **Create**.

    The domain name is used as part of your full tenant domain name. In this example, the tenant name is *contosob2c.onmicrosoft.com*:

    ![Create tenant form in with example values in Azure portal](media/tutorial-create-tenant/portal-03-tenant-naming.png)

1. Once the tenant creation is complete, select the **Create new B2C Tenant or Link to existing Tenant** link at the top of the tenant creation page.

    ![Link tenant breadcrumb link highlighted in Azure portal](media/tutorial-create-tenant/portal-04-select-link-sub-link.png)

1. Select **Link an existing Azure AD B2C Tenant to my Azure subscription**.

   ![Link an existing subscription selection in Azure portal](media/tutorial-create-tenant/portal-05-link-subscription.png)

1. Select the **Azure AD B2C Tenant** that you created, then select your **Subscription**.
1. For **Resource group**, select **Create new**. Enter a **Name** for the resource group that will contain the tenant, select the **Resource group location**, and then select **Create**.

    ![Link subscription settings form in Azure portal](media/tutorial-create-tenant/portal-06-link-subscription-settings.png)

## Select your B2C tenant directory

To start using your new Azure AD B2C tenant, you need to switch to the directory that contains your B2C tenant.

Select the **Directory + subscription** filter in the top menu, then select the directory that contains your Azure AD B2C tenant.

If at first you don't see your new Azure B2C tenant in the list, refresh your browser window, then select the **Directory + subscription** filter again in the top menu.

![B2C tenant-containing directory selected in Azure portal](media/tutorial-create-tenant/portal-07-select-tenant-directory.png)

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Create an Azure AD B2C tenant
> * Link your tenant to your subscription

Next, learn how to register a web application in your new tenant.

> [!div class="nextstepaction"]
> [Register your applications >](tutorial-register-applications.md)

---
title: Tutorial - Create an Azure Active Directory B2C tenant
description: Follow this tutorial to learn how to prepare for registering your applications by creating an Azure Active Directory B2C tenant using the Azure portal.
services: B2C
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 12/03/2020
ms.author: mimart
ms.subservice: B2C
---

# Tutorial: Create an Azure Active Directory B2C tenant

Before your applications can interact with Azure Active Directory B2C (Azure AD B2C), they must be registered in a tenant that you manage. 

> [!NOTE]
> You can create up to 20 tenants per subscription. This limit helps protect against threats to your resources, such as denial-of-service attacks, and is enforced in both the Azure portal and the underlying tenant creation API. If you need to create more than 20 tenants, please contact [Microsoft Support](support-options.md).
> 
> If you want to reuse a tenant name that you previously tried to delete, but you see the error "Already in use by another directory" when you enter the domain name, you'll need to [follow these steps to fully delete the tenant first](./faq.md?tabs=app-reg-ga#how-do-i-delete-my-azure-ad-b2c-tenant). A role of at least Subscription Administrator is required. After deleting the tenant, you might also need to sign out and sign back in before you can reuse the domain name.

In this article, you learn how to:

> [!div class="checklist"]
> * Create an Azure AD B2C tenant
> * Link your tenant to your subscription
> * Switch to the directory containing your Azure AD B2C tenant
> * Add the Azure AD B2C resource as a **Favorite** in the Azure portal

You learn how to register an application in the next tutorial.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an Azure AD B2C tenant

1. Sign in to the [Azure portal](https://portal.azure.com/). Sign in with an Azure account that's been assigned at least the [Contributor](../role-based-access-control/built-in-roles.md) role within the subscription or a resource group within the subscription.

1. Select the directory that contains your subscription.

    In the Azure portal toolbar, select the **Directory + Subscription** icon, and then select the directory that contains your subscription. This directory is different from the one that will contain your Azure AD B2C tenant.

    ![Subscription tenant, Directory + Subscription filter with subscription tenant selected](media/tutorial-create-tenant/portal-01-pick-directory.png)

1. On the Azure portal menu or from the **Home** page, select **Create a resource**.

   ![Select the Create a resource button](media/tutorial-create-tenant/create-a-resource.png)

1. Search for **Azure Active Directory B2C**, and then select **Create**.
2. Select **Create a new Azure AD B2C Tenant**.

    ![Create a new Azure AD B2C tenant selected in Azure portal](media/tutorial-create-tenant/portal-02-create-tenant.png)

1. On the **Create a directory** page, enter the following:

   - **Organization name** - Enter a name for your Azure AD B2C tenant.
   - **Initial domain name** - Enter a domain name for your Azure AD B2C tenant.
   - **Country or region** - Select your country or region from the list. This selection can't be changed later.
   - **Subscription** - Select your subscription from the list.
   - **Resource group** - Select or search for the resource group that will contain the tenant.

    ![Create tenant form in with example values in Azure portal](media/tutorial-create-tenant/review-and-create-tenant.png)

1. Select **Review + create**.
1. Review your directory settings. Then select **Create**. For [troubleshooting deployment errors](../azure-resource-manager/templates/common-deployment-errors.md).

You can link multiple Azure AD B2C tenants to a single Azure subscription for billing purposes. To link a tenant, you must be an admin in the Azure AD B2C tenant and be assigned at least a Contributor role within the Azure subscription. See [Link an Azure AD B2C tenant to a subscription](billing.md#link-an-azure-ad-b2c-tenant-to-a-subscription).

## Select your B2C tenant directory

To start using your new Azure AD B2C tenant, you need to switch to the directory that contains the tenant.

Select the **Directory + subscription** filter in the top menu of the Azure portal, then select the directory that contains your Azure AD B2C tenant.

If at first you don't see your new Azure B2C tenant in the list, refresh your browser window, then select the **Directory + subscription** filter again in the top menu.

![B2C tenant-containing directory selected in Azure portal](media/tutorial-create-tenant/portal-07-select-tenant-directory.png)

## Add Azure AD B2C as a favorite (optional)

This optional step makes it easier to select your Azure AD B2C tenant in the following and all subsequent tutorials.

Instead of searching for *Azure AD B2C* in **All services** every time you want to work with your tenant, you can instead favorite the resource. Then, you can select it from the portal menu's **Favorites** section to quickly browse to your Azure AD B2C tenant.

You only need to perform this operation once. Before performing these steps, make sure you've switched to the directory containing your Azure AD B2C tenant as described in the previous section, [Select your B2C tenant directory](#select-your-b2c-tenant-directory).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal menu, select **All services**.
1. In the **All services** search box, search for **Azure AD B2C**, hover over the search result, and then select the star icon in the tooltip. **Azure AD B2C** now appears in the Azure portal under **Favorites**.
1. If you want to change the position of your new favorite, go to the Azure portal menu, select **Azure AD B2C**, and then drag it up or down to the desired position.

    ![Azure AD B2C, Favorites menu, Microsoft Azure portal](media/tutorial-create-tenant/portal-08-b2c-favorite.png)

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Create an Azure AD B2C tenant
> * Link your tenant to your subscription
> * Switch to the directory containing your Azure AD B2C tenant
> * Add the Azure AD B2C resource as a **Favorite** in the Azure portal

Next, learn how to register a web application in your new tenant.

> [!div class="nextstepaction"]
> [Register your applications >](tutorial-register-applications.md)
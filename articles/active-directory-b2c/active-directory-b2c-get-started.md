---
title: 'Azure Active Directory B2C: Create an Azure Active Directory B2C tenant | Microsoft Docs'
description: A topic on how to create an Azure Active Directory B2C tenant
services: active-directory-b2c
documentationcenter: ''
author: swkrish
manager: mbaldwin
editor: patricka

ms.assetid: eec4d418-453f-4755-8b30-5ed997841b56
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 06/07/2017
ms.author: swkrish

---
# Create an Azure Active Directory B2C tenant

This Quickstart helps you create a Microsoft Azure Active Directory (Azure AD) B2C tenant in just a few minutes. When you're finished, you have a B2C tenant to use and start registering applications.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create an Azure AD B2C tenant

> [!IMPORTANT]
> B2C features can't be enabled in your existing tenants. You need to create an Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/) as the Subscription Administrator. This account is the same you used to sign up for Azure.
2. Click the **New** button. In the **Search the marketplace** field, enter `Azure Active Directory B2C`.

   ![Add button highlighted and the text Azure Active Directory B2C in the search the marketplace field](./media/active-directory-b2c-get-started/find-azure-ad-b2c.png)
3. In the results list, select **Azure Active Directory B2C**.

   ![Azure Active Directory B2C selected in the results list](./media/active-directory-b2c-get-started/find-azure-ad-b2c-result.png)
4. A blade with details about Azure Active Directory B2C is shown. To begin configuring your new Azure Active Directory B2C tenant, click the **Create** button at the bottom of the blade.
5. Select **Create a new Azure AD B2C Tenant**.
6. Enter an **Organization name, Domain name, and Country or Region** for your tenant.

   ![Azure AD B2C create tenant blade with sample text in the available fields](./media/active-directory-b2c-get-started/create-new-b2c-tenant.png)
7. Click the **Create** button to create your tenant. Creating the tenant may take a few minutes. You are alerted in your notifications when it is complete.

8. Congratulations, you have created an Azure Active Directory B2C tenant. To switch to your new tenant, click the *manage your new tenant link* in the blade.

   ![Manage your new tenant link](./media/active-directory-b2c-get-started/manage-new-b2c-tenant-link.png)

   > [!NOTE]
   > You are a Global Administrator of the tenant. You can add other Global Administrators as required.
   
   > [!IMPORTANT]
   > If you are planning to use a B2C tenant for a production app, read the article on [production-scale vs. preview B2C tenants](active-directory-b2c-reference-tenant-type.md). There are known issues when you delete an existing B2C tenant and re-create it with the same domain name. You need to create a B2C tenant with a different domain name.
   >
   >

## Navigate to the B2C settings blade on the Azure portal

1. To switch to your Azure AD B2C tenant, select the B2C directory on the top-right corner of the portal.

   ![Switch to your Azure AD B2C tenant](./media/active-directory-b2c-get-started/switch-to-b2c-tenant.png)

2. Expand **More services** below the navigation bar on the bottom-left side of the portal.
3. Search for **Azure AD B2C** and select **Azure AD B2C** in the result list.

   ![Screenshot of searching in the navigation pane for Azure AD B2C](./media/active-directory-b2c-get-started/navigate-to-azure-ad-b2c.png)

4. The Azure AD B2C settings blade for the tenant is displayed.
5. Use the pin tool to pin this blade to your dashboard for easy access.
   
    ![Screenshot of the B2C settings blade and pin button](./media/active-directory-b2c-get-started/b2c-pin-tenant.png)

## Link your Azure AD B2C tenant to your Azure subscription

If you are planning to use your B2C tenant for production apps, you need to link your Azure AD B2C tenant to your Azure subscription to pay for usage charges. To learn more, read [this article](active-directory-b2c-how-to-enable-billing.md).

   > [!IMPORTANT]
   > If you don't link your Azure AD B2C tenant to your Azure subscription, you see a warning message ("No Subscription linked to this B2C tenant or the Subscription needs your attention.") on the B2C settings blade on the Azure portal. It is important that you take this step before you ship your apps into production.
   > 
   > 


## Easy access to the B2C settings blade on the Azure portal

To improve discoverability, we've added a shortcut to the B2C settings blade on the Azure portal.

1. Sign into the Azure portal as the Global Administrator of your Azure AD B2C tenant.
2. To switch to your Azure AD B2C tenant, by selecting the B2C directory on the top-right corner of the portal.

   ![Switch to your Azure AD B2C tenant](./media/active-directory-b2c-get-started/switch-to-b2c-tenant.png)
3. In **Search resources** at the top of the portal, enter `Azure AD B2C` and select **Azure AD B2C** in the results list to access the B2C settings blade.

    ![Screenshot of Search resources at the top of the portal](./media/active-directory-b2c-get-started/b2c-browse.png)

## Next steps

> [!div class="nextstepaction"]
> [Create an ASP.NET web app with sign-up, sign-in, and password reset](active-directory-b2c-devquickstarts-web-dotnet-susi.md)

> [!div class="nextstepaction"]
> [Register your B2C application in a B2C tenant](active-directory-b2c-app-registration.md)


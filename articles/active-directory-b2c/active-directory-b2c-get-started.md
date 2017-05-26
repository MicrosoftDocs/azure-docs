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
ms.date: 05/26/2017
ms.author: swkrish

---
# Create an Azure AD B2C tenant
This Quickstart helps you create a Microsoft Azure Active Directory (Azure AD) B2C tenant in just a few minutes. When you're finished,you'll have a B2C tenant to use and start registering applications.

## Prerequisites
[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create an Azure AD B2C tenant
> [!IMPORTANT]
> B2C features can't be turned on in your existing tenants. You'll need to create a new Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/) as the Subscription Administrator. This is the same account that you used to sign up for Azure.
2. Click **New**(or the + button if collapsed). In the **Search the marketplace** field, enter `Azure Active Directory B2C`.
   
    ![Screen shot of finding the Azure AD B2C option](./media/active-directory-b2c-get-started/find-azure-ad-b2c.png)
3. In the results list, select **Azure Active Directory B2C**.

    ![Screen shot of result for Azure Active Directory B2C](./media/active-directory-b2c-get-started/find-azure-ad-b2c-result.png)
4. A blade with details about Azure Active Directory B2C is shown.  Click the **Create** button at the bottom of the blade to begin configuring your new Azure Active Directory B2C tenant.
5. Select **Create a new Azure AD B2C Tenant**.
6. Enter an **Organization name, Domain name, and Country or Region** for your tenant.

    ![Screen shot of the form for creating a new tenant](./media/active-directory-b2c-get-started/create-new-b2c-tenant.png)
7. Click the **Create** button to create your tenant. This may take a few minutes. You will be alerted in your notifications when it is complete.

8. Congratulations, you have created a new Azure Active Directory B2C tenant. The tenant will be listed in the Active Directory extension. You are also made a Global Administrator of the tenant. You can add other Global Administrators as required.
   
   > [!IMPORTANT]
   > If you are planning to use a B2C tenant for a production app, read the article on [production-scale vs. preview B2C tenants](active-directory-b2c-reference-tenant-type.md). Note that there are known issues when you delete an existing B2C tenant and re-create it with the same domain name. You have to create a B2C tenant with a different domain name.
   > 
   > 

## Navigate to the B2C features blade on the Azure portal
1. Expand **More services** below the navigation bar on the left side.
2. Search for **Azure AD B2C** and click on the result (You can favorite this for easy access in the future).

    ![Screen shot of searching in the navigation pane for Azure AD B2C](./media/active-directory-b2c-get-started/navigate-to-azure-ad-b2c.png)

3. The Azure portal with the B2C features blade showing will open in a new browser tab or window.
   
4. Pin this blade to your Startboard for easy access. (The Pin tool is in the upper-right corner of the features blade.)
   
    ![Screen shot of the B2C features blade and pin button](./media/active-directory-b2c-get-started/b2c-pin-tenant.png)

## Link your Azure AD B2C tenant to your Azure subscription
If you are planning to use your B2C tenant for production apps, you will need to link your Azure AD B2C tenant to your Azure subscription to pay for usage charges. Read [this article](active-directory-b2c-how-to-enable-billing.md) to learn how to do this.

   > [!IMPORTANT]
   > If you don't link your Azure AD B2C tenant to your Azure subscription, you will see a warning message ("No Subscription linked to this B2C tenant or the Subscription needs your attention.") on the B2C features blade on the Azure portal. It is important that you take this step before you ship your apps into production.
   > 
   > 

## Easy access to the B2C features blade on the Azure portal
To improve discoverability, we've added a shortcut to the B2C features blade on the Azure portal.

1. Sign into the Azure portal as the Global Administrator of your B2C tenant. If you are already signed into a different tenant, switch tenants (on the top-right corner).
2. Click **Browse** on the left hand navigation.
3. Click **Azure AD B2C** to access the B2C features blade.
   
    ![Screen shot of Browse to B2C features blade](./media/active-directory-b2c-get-started/b2c-browse.png)

## Next steps
Learn how to register an application with Azure AD B2C and to build a Quick Start application by reading [Azure Active Directory B2C: Register your application](active-directory-b2c-app-registration.md).


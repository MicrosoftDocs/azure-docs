---
title: "Quickstart: Create an Azure Active Directory tenant"
description: In this quickstart, you learn how to create an Azure Active Directory tenant for use in developing applications that use the Microsoft identity platform for authentication and authorization.
services: active-directory
author: OwenRichards1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: quickstart
ms.date: 04/19/2023
ms.author: ryanwi
ms.reviewer: jmprieur
ms.custom: aaddev, identityplatformtop40, fasttrack-edit, mode-other
#Customer intent: As an application developer, I need to create a Microsoft identity environment so I can use it to register applications.
---

# Quickstart: Set up a tenant

To build apps that use the Microsoft identity platform for identity and access management, you need access to an Azure Active Directory (Azure AD) *tenant*. It's in the Azure AD tenant that you register and manage your apps, configure their access to data in Microsoft 365 and other web APIs, and enable features like Conditional Access.

A tenant represents an organization. It's a dedicated instance of Azure AD that an organization or app developer receives at the beginning of a relationship with Microsoft. That relationship could start with signing up for Azure, Microsoft Intune, or Microsoft 365, for example.

Each Azure AD tenant is distinct and separate from other Azure AD tenants. It has its own representation of work and school identities, consumer identities (if it's an Azure AD B2C tenant), and app registrations. An app registration inside your tenant can allow authentications only from accounts within your tenant or all tenants.

## Prerequisites

An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Determining the environment type

You can create two types of environments. The environment depends solely on the types of users your app will authenticate. 

This quickstart addresses two scenarios for the type of app you want to build:

* Work and school (Azure AD) accounts or Microsoft accounts (such as Outlook.com and Live.com)
* Social and local (Azure AD B2C) accounts

## Work and school accounts, or personal Microsoft accounts

To build an environment for either work and school accounts or personal Microsoft accounts (MSA), you can use an existing Azure AD tenant or create a new one.
### Use an existing Azure AD tenant

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Many developers already have tenants through services or subscriptions that are tied to Azure AD tenants, such as Microsoft 365 or Azure subscriptions.

To check the tenant:

1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>. Use the account you'll use to manage your application.
1. Check the upper-right corner. If you have a tenant, you'll automatically be signed in. You see the tenant name directly under your account name.
   * Hover over your account name to see your name, email address, directory or tenant ID (a GUID), and domain.
   * If your account is associated with multiple tenants, you can select your account name to open a menu where you can switch between tenants. Each tenant has its own tenant ID.

> [!TIP]
> To find the tenant ID, you can:
> * Hover over your account name to get the directory or tenant ID.
> * Search and select **Azure Active Directory** > **Overview** > **Tenant ID** in the Azure portal.

If you don't have a tenant associated with your account, you'll see a GUID under your account name. You won't be able to do actions like registering apps until you create an Azure AD tenant.

### Create a new Azure AD tenant

If you don't already have an Azure AD tenant or if you want to create a new one for development, see [Create a new tenant in Azure AD](../fundamentals/active-directory-access-create-new-tenant.md). Or use the [directory creation experience](https://portal.azure.com/#create/Microsoft.AzureActiveDirectory) in the Azure portal. 

You'll provide the following information to create your new tenant:

- **Tenant type** - Choose between an Azure AD and Azure AD B2C tenant
- **Organization name**
- **Initial domain** - Initial domain `<domainname>.onmicrosoft.com` can't be edited or deleted. You can add a customized domain name later.
- **Country or region**

> [!NOTE]
> When naming your tenant, use alphanumeric characters. Special characters aren't allowed. The name must not exceed 256 characters.

## Social and local accounts

To begin building external facing applications that sign in social and local accounts, create an Azure AD B2C tenant. To begin, see [Create an Azure AD B2C tenant](../../active-directory-b2c/tutorial-create-tenant.md).

## Next steps

> [!div class="nextstepaction"]
> [Register an app](quickstart-register-app.md)

---
title: Create an Azure Active Directory tenant | Microsoft Docs
description: Learn how to create an Azure AD tenant to use for registering and building applications.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: 1f4b24eb-ab4d-4baa-a717-2a0e5b8d27cd
ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 09/28/2018
ms.author: celested
ms.reviewer: dadobali
ms.custom: aaddev
#Customer intent: As an application developer, I need to create an Microsoft identity environment so I can use it to register applications.
---

# Quickstart: Setup a dev environment

the Microsoft identity platform allows developers to build apps targeting a wide variety of custom Microsoft 365 environments and identities. To get started using Microsoft identity platform, you will access to an environment, also called an Azure AD tenant, that can register & manage apps, have access to Microsoft 365 data, and deploy custom Conditional Access and tenant restrictions. 

## Preface
A tenant is representation of an organization. It's a dedicated instance of Azure AD that an organization or app developer receives when the organization or app developer creates a relationship with Microsoft-- like signing up for Azure, Microsoft Intune, or Microsoft 365. 

Each Azure AD tenant is distinct and separate from other Azure AD tenants and has it's own representation of work and school identites, consumer identities (if it's an Azure AD B2C tenant), an app registrations. An app registration inside of your tenant can allow authentications from accounts only within your tenant or all tenants. 

## Determining environment type

There are two types of environments you can create.  Deciding which you need is based solely on the types of users your app will authenticate.

1. Work and School (Azure AD accounts) or Microsoft accounts (Outlook.com, live.com, etc)
1. Social & Local accounts (Azure AD B2C)

The quickstart is broken into two scenarios depending on the type of app you want to build.  If you need more help targeting an identity type, take a look at [about Microsoft identity platform](about-microsoft-identity-platform.md)

## Work and School (Azure AD accounts) or Microsoft account (Outlook.com, live.com, etc)

### Use an existing tenant

Many developers already have tenants through services or subscriptions that are tied to Azure AD tenants such as Microsoft 365 or Azure subscriptions.

1. To check the tenant, sign in to the [Azure portal](https://portal.azure.com) with the account you want to use to manage your application.
1. Check the upper right corner. If you have a tenant, you'll automatically be logged in and can see the tenant name directly under your account name.
   * Hover over your account name on the upper right-hand side of the Azure portal to see your name, email, directory / tenant ID (a GUID), and your domain.
   * If your account is associated with multiple tenants, you can select your account name to open a menu where you can switch between tenants. Each tenant has its own tenant ID.

> [!TIP]
> If you need to find the tenant ID, you can:
* Hover over your account name to get the directory / tenant ID, or
* Select **Azure Active Directory > Properties > Directory ID** in the Azure portal

If you don't have an existing tenant associated with your account, you'll see a GUID under your account name and you won't be able to perform actions like registering apps until you follow the steps of the next section.

### Create a new Azure AD tenant

If you don't already have an Azure AD tenant or want to create a new one for development, follow the [directory creation experience](https://portal.azure.com/#create/Microsoft.AzureActiveDirectory). You will have to provide the following info to create your new tenant:

- **Organization name**
- **Initial domain** - This will be part of *.onmicrosoft.com. You can customize the domain more later. 
- **Country or region**

## Social & Local accounts (Azure AD B2C)

To begin building apps that sign in Social & Local accounts, you will need to create an Azure AD B2C tenant. To begin, follow [creating a Azure AD B2C tenant](https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-tenant). 

## Next steps

* Try a coding quickstart and begin authenticating users. 
* For more in-depth code samples, checkout the **Tutorials** section of the documentation.
* Want to deploy your app to the cloud? Checkout [deploying containers to Azure](https://docs.microsoft.com/en-us/azure/index#pivot=products&panel=containers). 
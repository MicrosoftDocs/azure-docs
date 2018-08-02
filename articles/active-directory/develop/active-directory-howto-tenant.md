---
title: How to get an Azure AD tenant | Microsoft Docs
description: How to get an Azure Active Directory tenant for registering and building applications.
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
ms.topic: article
ms.date: 03/23/2018
ms.author: celested
ms.custom: aaddev
---

# How to get an Azure Active Directory tenant

In Azure Active Directory (Azure AD), a [tenant](https://msdn.microsoft.com/library/azure/jj573650.aspx#Anchor_0) is representative of an organization. It is a dedicated instance of the Azure AD service that an organization receives and owns when it creates a relationship with Microsoft, such as by signing up for a Microsoft cloud service like Azure, Microsoft Intune, or Office 365. Each Azure AD tenant is distinct and separate from other Azure AD tenants. 

A tenant houses the users in a company and the information about them--their passwords, user profile data, permissions, and so on. It also contains groups, applications, and other information pertaining to an organization and its security.

To allow Azure AD users to sign in to your application, you must register your application in a tenant of your own. Creating an Azure AD tenant and publishing an application in it is **absolutely free** although you can choose to pay for premium features in your tenant. In fact, many developers create several tenants and applications for experimentation, development, staging, and testing purposes.

## Use an existing Azure AD tenant

Many developers already have tenants through services or subscriptions that are tied to Azure AD tenants such as Office 365 or Azure subscriptions. To check if you already have a tenant, sign in to the [Azure portal](https://portal.azure.com) with the account you want to use to manage your application and check the upper right corner where your account information is shown. If you have a tenant, you'll automatically be logged into it and you'll see the tenant name directly under your account name. If you hover over your account name on the upper right-hand side of the Azure portal, you will see your name, email, directory and tenant ID (a GUID), and your domain. If your account is associated with multiple tenants, you can select your account name to open a menu where you can switch between tenants. Each tenant has its own tenant ID.

> [!TIP]
> If you need to find the tenant ID, there are multiple ways to find this info. You can hover over your account name to get the tenant ID or you can select **Azure Active Directory > Properties > Directory ID** in the Azure portal.

If you don't have an existing tenant associated with your account, you'll see a GUID under your account name and you will not be able to perform actions like registering apps until you [create a new tenant](#create-a-new-azure-ad-tenant).

## Create a new Azure AD tenant

If you don't already have an Azure AD tenant or want to create a new one, you can do so using the [directory creation experience](https://portal.azure.com/#create/Microsoft.AzureActiveDirectory) in the [Azure portal](https://portal.azure.com). The process will take about a minute, and in the end you'll be prompted to navigate to your newly created tenant.

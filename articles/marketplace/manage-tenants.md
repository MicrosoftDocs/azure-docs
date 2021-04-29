---
title: Manage tenants in the commercial marketplace - Azure Marketplace
description: Learn how to manage tenants for the commercial marketplace program in Partner Center.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: varsha-sarah
ms.author: vavargh
ms.custom: contperf-fy21q2
ms.date: 04/07/2021
---

# Manage tenants in the commercial marketplace

**Appropriate roles**

- Manager

An Azure Active Directory (AD) tenant, also referred to as your *work account* throughout this documentation, is a representation of your organization set up in the Azure portal and helps you to manage a specific instance of Microsoft cloud services for your internal and external users. If your organization subscribed to a Microsoft cloud service, such as Azure, Microsoft Intune, or Microsoft 365, an Azure AD tenant was established for you.

You can set up multiple tenants to use with Partner Center. You may want to do this if your company has multiple tenants (for example, contoso.com, contoso.uk, and so on) you can link the additional tenants here. This association would allow you to add and manage users from the additional tenants on your commercial marketplace account.

Any user with the Manager role in the Partner Center account will have the option to add and remove Azure AD tenants from the account.

## Add an existing tenant

To associate another Azure AD tenant with your Partner Center account:

1. In the top-right of Partner Center, select **Settings** > **Account settings**.
1. Under **Organization profile**, select **Tenants**. The current tenant associations are shown.
1. On the **Developer** tab, select **Associate**.
1. Enter your Azure AD credentials for the tenant that you want to associate.
1. Review the organization and domain name for your Azure AD tenant. To complete the association, select **Confirm**.

If the association is successful, you will then be ready to add and manage account users in the Users section in Partner Center. To learn about adding users, see [Manage users](add-manage-users.md).

## Create a new tenant

To create a brand new Azure AD tenant with your Partner Center account:

1. In the top-right of Partner Center, select **Settings** > **Account settings**.
1. Under **Organization profile**, select **Tenants**. The current tenant associations are shown.
1. On the Developer tab, select **Create**.
1. Enter the directory information for your new Azure AD:
    - **Domain name**: The unique name that we'll use for your Azure AD domain, along with ".onmicrosoft.com". For example, if you entered "example", your Azure AD domain would be "example.onmicrosoft.com".
    - **Contact email**: An email address where we can contact you about your account if necessary.
    - **Global administrator user account info**: The first name, last name, username, and password that you want to use for the new global administrator account.
1. Select Create to confirm the new domain and account info.
1. Sign in with your new Azure AD global administrator username and password to begin [adding and managing users](add-manage-users.md).

For more information about creating new tenants inside your Azure portal, instead of the Partner Center portal, see the article [Create a new tenant in Azure Active Directory](../active-directory/fundamentals/active-directory-access-create-new-tenant.md).

## Remove a tenant

To remove a tenant from your Partner Center account, find its name on the **Tenants** page (in **Account settings**), then select **Remove**. You'll be prompted to confirm that you want to remove the tenant. After you do so, no users in that tenant will be able to sign into the Partner Center account, and any permissions you have configured for those users will be removed.

> [!TIP]
> You can't remove a tenant if you are currently signed into Partner Center using an account in the same tenant. To remove a tenant, you must sign into Partner Center as a **Manager** for another tenant that is associated with the account. If there is only one tenant associated with the account, that tenant can only be removed after signing in with the Microsoft account that opened the account.
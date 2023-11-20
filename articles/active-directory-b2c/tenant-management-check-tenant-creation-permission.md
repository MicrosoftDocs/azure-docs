---
title: Review tenant creation permission in Azure Active Directory B2C
titleSuffix: Azure Active Directory B2C
description: Learn how to check tenant creation permission in Azure Active Directory B2C before you create tenant

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: tutorial
ms.custom: project-no-code, b2c-docs-improvements
ms.date: 01/30/2023
ms.author: kengaderdus
ms.reviewer: yoelh
ms.subservice: B2C
---

# Review tenant creation permission in Azure Active Directory B2C

Anyone who creates an Azure Active Directory B2C (Azure AD B2C) becomes the *Global Administrator* of the tenant. It's a security risk if a non-admin user is allowed to create a tenant. In this article, you learn how, as an admin, you can restrict tenant creation for non-admins. Also, you'll learn how, as a non-admin user, you can check if you've permission to create a tenant.

## Prerequisites 

- If you haven't already created your own [Azure AD B2C Tenant](tutorial-create-tenant.md), create one now. You can use an existing Azure AD B2C tenant.   

## Restrict non-admin users from creating Azure AD B2C tenants

As a *Global Administrator* in an Azure AD B2C tenant, you can restrict non-admin users from creating tenants. To do so, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.

1. In the Azure portal, search for and select **Microsoft Entra ID**.

1. Under **Manage**, select **User Settings**.

1. Under **Tenant creation**, select **Yes**. 

1. At the top of the **User Settings** page, select **Save**. 

## Check tenant creation permission

Before you create an Azure AD B2C tenant, make sure that you've the permission to do so. Use these steps to check that you've the permission to create a tenant: 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.

1. In the Azure portal, search for and select **Microsoft Entra ID**.

1. Under **Manage**, select **User Settings**.

1. Review your **Tenant Creation** setting. If the settings is set to **No**, then contact your administrator to assign the tenant creator role to you. The setting is greyed out if you're not an administrator in the tenant.


## Next steps 

- [Read tenant name and ID](tenant-management-read-tenant-name.md)
- [Clean up resources and delete tenant](tutorial-delete-tenant.md)

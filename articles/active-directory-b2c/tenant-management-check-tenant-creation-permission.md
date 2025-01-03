---
title: Review tenant creation permission in Azure Active Directory B2C
titleSuffix: Azure Active Directory B2C
description: Learn how to check tenant creation permission in Azure Active Directory B2C before you create tenant

author: kengaderdus
manager: CelesteDG

ms.service: azure-active-directory

ms.topic: tutorial
ms.custom: b2c-docs-improvements
ms.date: 09/11/2024
ms.author: kengaderdus
ms.reviewer: yoelh
ms.subservice: b2c


#Customer intent: "As an Azure AD B2C administrator, I want to restrict non-admin users from creating tenants, so that I can ensure security and prevent unauthorized access. Additionally, as a non-admin user, I want to check if I have permission to create a tenant, so that I can proceed with the necessary actions."

---

# Review tenant creation permission in Azure Active Directory B2C

It's a security risk if a non-admin user in a tenant is allowed to create a tenant. As a [Global Administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator) in an Azure AD B2C tenant, you can restrict non-admin users from creating tenants.

In this article, you learn how, as an admin, you can restrict tenant creation for non-admins. Also, you learn how, as a non-admin user, you can check if you've permission to create a tenant.

## Prerequisites 

- If you haven't already created your own [Azure AD B2C Tenant](tutorial-create-tenant.md), create one now. You can use an existing Azure AD B2C tenant.   

## Restrict non-admin users from creating Azure AD B2C tenants

1. Sign in to the [Azure portal](https://portal.azure.com) as a [Global Administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator).

1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.

1. In the Azure portal, search for and select **Microsoft Entra ID**.

1. Under **Manage**, select **User Settings**.

1. Under **Default user role permissions**, for **Restrict non-admin users from creating tenants**, select **Yes**. 

1. At the top of the **User Settings** page, select **Save**. 

## Check tenant creation permission

Before you create an Azure AD B2C tenant, make sure that you've the permission to do so. Use these steps to check that you've the permission to create a tenant: 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.

1. In the Azure portal, search for and select **Microsoft Entra ID**.

1. Under **Manage**, select **User Settings**.

1.  Under **Default user role permissions**, review your **Restrict non-admin users from creating tenants** setting. If the setting is set to **No**, then contact your administrator to assign you [Tenant Creator](/entra/identity/role-based-access-control/permissions-reference#tenant-creator) role. The setting is greyed out if you're not an administrator in the tenant.


## Related content

- [Read tenant name and ID](tenant-management-read-tenant-name.md)
- [Clean up resources and delete tenant](tutorial-delete-tenant.md)
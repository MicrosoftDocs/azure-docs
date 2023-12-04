---
title: Manage emergency access accounts in Azure Active Directory B2C
titleSuffix: Azure Active Directory B2C
description: Learn how to manage emergency access accounts in Azure AD B2C tenants 
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 11/20/2023
ms.custom: project-no-code, b2c-docs-improvements
ms.reviewer: yoelh
ms.author: kengaderdus
ms.subservice: B2C
---

# Manage emergency access accounts in Azure Active Directory B2C

It's important that you prevent being accidentally locked out of your Azure Active Directory B2C (Azure AD B2C) organization because you can't sign in or activate another user's account as an administrator. You can mitigate the impact of accidental lack of administrative access by creating two or more *emergency access accounts* in your organization.

When you configure these accounts, the following requirements need to be met:

- The emergency access accounts shouldn't be associated with any individual user in the organization. Make sure that your accounts aren't connected with any employee-supplied mobile phones, hardware tokens that travel with individual employees, or other employee-specific credentials. This precaution covers instances where an individual employee is unreachable when the credential is needed. It's important to ensure that any registered devices are kept in a known, secure location that has multiple means of communicating with Azure AD B2C. 

- Use strong authentication for your emergency access accounts and make sure it doesn’t use the same authentication methods as your other administrative accounts.

- The device or credential must not expire or be in scope of automated cleanup due to lack of use.

## Prerequisites 

- If you haven't already created your own [Azure AD B2C Tenant](tutorial-create-tenant.md), create one now. You can use an existing Azure AD B2C tenant.
- Understand [user accounts in Azure AD B2C](user-overview.md).
- Understand [user roles to control resource access](roles-resource-access-control.md).
- Understand [Conditional Access](conditional-access-user-flow.md)

## Create emergency access account

Create two or more emergency access accounts. These accounts should be cloud-only accounts that use the *.onmicrosoft.com* domain and that aren't federated or synchronized from an on-premises environment.

Use the following steps to create an emergency access account:

1. Sign in to the [Azure portal](https://portal.azure.com) as an existing Global Administrator. If you use your Microsoft Entra account, make sure you're using the directory that contains your Azure AD B2C tenant:

    1. Select the **Directories + subscriptions** icon in the portal toolbar.
    
    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
    
1. Under **Azure services**, select **Azure AD B2C**. Or in the Azure portal, search for and select **Azure AD B2C**.

1. In the left menu, under **Manage**, select **Users**. 

1. Select **+ New user**.

1. Select **Create user**.

1. Under **Identity**:

    1. For **User name**, enter a unique user name such as *emergency account*. 
    
    1. For **Name**, enter a name such as *Emergency Account*
    
1. Under **Password**, enter your unique password. 
    
1. Under **Groups and roles** 
 
    1. Select **User**.

    1. In the pane that shows up, search for and select **Global administrator**, and then select **Select** button. 

1. Under **Settings**, select the appropriate **Usage location**.

1. Select **Create**.

1. [Store account credentials safely](../active-directory/roles/security-emergency-access.md#store-account-credentials-safely).

1. [Monitor sign in and audit logs](../active-directory/roles/security-emergency-access.md#monitor-sign-in-and-audit-logs).

1. [Validate accounts regularly](../active-directory/roles/security-emergency-access.md#validate-accounts-regularly).

Once you create your emergency accounts, you need to do the following: 

- Make sure you [exclude at least one account from phone-based multifactor authentication](../active-directory/roles/security-emergency-access.md#exclude-at-least-one-account-from-phone-based-multi-factor-authentication)

- If you use [Conditional Access](conditional-access-user-flow.md), at least one emergency access account needs to be excluded from all conditional access policies.

## Next steps 

- [Read tenant name and ID](tenant-management-read-tenant-name.md)
- [Clean up resources and delete tenant](tutorial-delete-tenant.md)

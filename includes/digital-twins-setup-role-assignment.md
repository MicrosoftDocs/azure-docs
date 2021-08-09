---
author: baanders
description: include file for the access permissions step in Azure Digital Twins setup
ms.service: digital-twins
ms.topic: include
ms.date: 7/17/2020
ms.author: baanders
---

Azure Digital Twins uses [Azure Active Directory (Azure AD)](../articles/active-directory/fundamentals/active-directory-whatis.md) for role-based access control (RBAC). This means that before a user can make data plane calls to your Azure Digital Twins instance, that user needs to be assigned a role with appropriate permissions for it.

For Azure Digital Twins, this role is **Azure Digital Twins Data Owner**. You can read more about roles and security in [Security for Azure Digital Twins solutions](../articles/digital-twins/concepts-security.md).

> [!NOTE]
> This role is different from the Azure AD **Owner** role, which can also be assigned at the scope of the Azure Digital Twins instance. These are two distinct management roles, and Owner does not grant access to data plane features that are granted with **Azure Digital Twins Data Owner**.

This section will show you how to create a role assignment for a user in your Azure Digital Twins instance, using that user's email in the Azure AD tenant on your Azure subscription. Depending on your role in your organization, you might set up this permission for yourself, or set it up on behalf of someone else who will be managing the Azure Digital Twins instance.
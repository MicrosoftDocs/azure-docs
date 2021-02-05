---
author: baanders
description: include file for the access permissions step in Azure Digital Twins setup
ms.service: digital-twins
ms.topic: include
ms.date: 7/17/2020
ms.author: baanders
---

Azure Digital Twins uses [Azure Active Directory (Azure AD)](../articles/active-directory/fundamentals/active-directory-whatis.md) for role-based access control (RBAC). This means that before a user can make data plane calls to your Azure Digital Twins instance, that user needs to be assigned a role with appropriate permissions for it.

For Azure Digital Twins, this role is _**Azure Digital Twins Data Owner**_. You can read more about roles and security in [*Concepts: Security for Azure Digital Twins solutions*](../articles/digital-twins/concepts-security.md).

[!INCLUDE [digital-twins-role-rename-note.md](digital-twins-role-rename-note.md)]

This section will show you how to create a role assignment for a user in your Azure Digital Twins instance, using that user's email in the Azure AD tenant on your Azure subscription. Depending on your role in your organization, you might set up this permission for yourself, or set it up on behalf of someone else who will be managing the Azure Digital Twins instance.

### Assign the role

To give a user permissions to manage an Azure Digital Twins instance, you must assign them the _**Azure Digital Twins Data Owner**_ role within the instance.

> [!NOTE]
> Note that this role is different from the Azure AD *Owner* role, which can also be assigned at the scope of the Azure Digital Twins instance. These are two distinct management roles, and Azure AD *Owner* does not grant access to data plane features that are granted with *Azure Digital Twins Data Owner*.
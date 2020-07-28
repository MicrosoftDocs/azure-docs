---
author: baanders
description: include file for the access permissions step in Azure Digital Twins setup
ms.service: digital-twins
ms.topic: include
ms.date: 7/17/2020
ms.author: baanders
---

Azure Digital Twins uses [Azure Active Directory (Azure AD)](../articles/active-directory/fundamentals/active-directory-whatis.md) for role-based access control (RBAC). This means that before a user can make data plane calls to your Azure Digital Twins instance, that user must first be assigned a role with permissions to do so.

For Azure Digital Twins, this role is _**Azure Digital Twins Owner (Preview)**_. You can read more about roles and security in [*Concepts: Security for Azure Digital Twins solutions*](../articles/digital-twins/concepts-security.md).

This section will show you how to create a role assignment for a user in your Azure Digital Twins instance, through the email associated with that user in the Azure AD tenant on your Azure subscription. Depending on your role within your organization, you will either set this up for yourself, or set this up on behalf of someone else who will be managing the Azure Digital Twins instance.

### Assign the role

To give a user permissions to manage an Azure Digital Twins instance, you must assign them the _**Azure Digital Twins Owner (Preview)**_ role within the instance.

> [!NOTE]
> This role is different from...
> * the *Owner* role on the entire Azure subscription. *Azure Digital Twins Owner (Preview)* is a role within Azure Digital Twins and is scoped to this individual Azure Digital Twins instance.
> * the *Owner* role assignable for Azure Digital Twins. These are two distinct Azure Digital Twins management roles, and *Azure Digital Twins Owner (Preview)* is the role that should be used for management during preview.
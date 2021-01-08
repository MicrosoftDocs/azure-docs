---
 title: include file
 description: include file
 services: active-directory
 author: daveba
 ms.service: active-directory
 ms.subservice: msi
 ms.topic: include
 ms.date: 05/31/2018
 ms.author: daveba
 ms.custom: include file
---

- Each managed identity counts towards the object quota limit in an Azure AD tenant as described in [Azure AD service limits and restrictions](../articles/active-directory/enterprise-users/directory-service-limits-restrictions.md).
-	The rate at which managed identities can be created have the following limits:

    1. Per Azure AD Tenant per Azure region: 200 create operations per 20 seconds.
    2. Per Azure Subscription per Azure region : 40 create operations per 20 seconds.

- When you create user-assigned managed identities, only alphanumeric characters (0-9, a-z, and A-Z) and the hyphen (-) are supported. For the assignment to a virtual machine or virtual machine scale set to work properly, the name is limited to 24 characters.

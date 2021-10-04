---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 08/27/2020
ms.author: msmbaldwin

# Used by articles that show how to assign a Key Vault access policy

---

Key vault supports up to 1024 access policy entries, with each entry granting a distinct set of permissions to a particular security principal. Because of this limitation, we recommend assigning access policies to groups of users, where possible, rather than individual users. Using groups makes it much easier to manage permissions for multiple people in your organization. For more information, see [Manage app and resource access using Azure Active Directory groups](../articles/active-directory/fundamentals/active-directory-manage-groups.md)

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

- Each Managed Identity counts towards the object quota limit in an Azure AD tenant as described [here](../articles/active-directory/users-groups-roles/directory-service-limits-restrictions.md)
-	The rate at which Managed Identities can be created have the following limits:

| Scope | 	Limit | 
| --- | --- | 
| Per Azure AD Tenant | 200 creations per 20 seconds | 
| Per Azure Subscription | 40 creations per 20 seconds |

For User-assigned managed identities
- When you create user-assigned managed identities, only alphanumeric characters (0-9, a-z, and A-Z) and the hyphen (-) are supported. For the assignment to a virtual machine or virtual machine scale set to work properly, the name is limited to 24 characters.

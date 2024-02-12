---
 title: include file
 description: include file
 services: active-directory
 author: daveba
 ms.service: active-directory
 ms.subservice: msi
 ms.topic: include
 ms.date: 07/13/2021
 ms.author: daveba
 ms.custom: include file
---

- Each managed identity counts towards the object quota limit in a Microsoft Entra tenant as described in [Microsoft Entra service limits and restrictions](../articles/active-directory/enterprise-users/directory-service-limits-restrictions.md).
-	The rate at which managed identities can be created have the following limits:

    1. Per Microsoft Entra tenant per Azure region: 400 create operations per 20 seconds.
    2. Per Azure Subscription per Azure region : 80 create operations per 20 seconds.

-	The rate at which a user-assigned managed identity can be assigned with an Azure resource :

    1. Per Microsoft Entra tenant per Azure region: 400 assignment operations per 20 seconds.
    2. Per Azure Subscription per Azure region : 300 assignment operations per 20 seconds.

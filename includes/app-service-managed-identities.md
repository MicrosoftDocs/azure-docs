---
author: mattchenderson
ms.service: app-service
ms.topic: include
ms.date: 04/20/2020
ms.author: mahender
---

A managed identity from Azure Active Directory (Azure AD) allows your app to easily access other Azure AD-protected resources such as Azure Key Vault. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. For more about managed identities in Azure AD, see [Managed identities for Azure resources](../articles/active-directory/managed-identities-azure-resources/overview.md).

Your application can be granted two types of identities:

- A **system-assigned identity** is tied to your application and is deleted if your app is deleted. An app can only have one system-assigned identity.
- A **user-assigned identity** is a standalone Azure resource that can be assigned to your app. An app can have multiple user-assigned identities.
---
author: mattchenderson
ms.service: azure-app-service
ms.topic: include
ms.date: 07/20/2024
ms.author: mahender
---

A managed identity from Microsoft Entra ID allows your app to easily access other Microsoft Entra protected resources such as Azure Key Vault. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. For more about managed identities in Microsoft Entra ID, see [Managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/overview).

Your application can be granted two types of identities:

- A **system-assigned identity** is tied to the app and is deleted if the app is deleted. An app can only have one system-assigned identity.
- A **user-assigned identity** is a standalone Azure resource that can be assigned to your app. An app can have multiple user-assigned identities, and one user-assigned identity can be assigned to multiple Azure resources, such as two App Service apps.

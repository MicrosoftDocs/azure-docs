---
author: baanders
description: include file for Azure Digital Twins - prerequisite to set up an app registration
ms.service: digital-twins
ms.topic: include
ms.date: 10/29/2020
ms.author: baanders
---

To authenticate all the resources used in this article, you'll need to set up an [Azure Active Directory (Azure AD)](../articles/active-directory/fundamentals/active-directory-whatis.md) app registration. Follow the instructions in [Create an app registration with Azure Digital Twins access](../articles/digital-twins/how-to-create-app-registration.md) to set this up. 

Once you have an app registration, you'll need the registration's **Application (client) ID**, **Directory (tenant) ID**, and **client secret value** ([find in the Azure portal](../articles/digital-twins/how-to-create-app-registration.md?tabs=portal#collect-important-values)). Take note of these values to use them later to grant access to the Azure Digital Twins APIs.
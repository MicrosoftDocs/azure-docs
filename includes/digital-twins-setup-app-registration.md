---
author: baanders
description: include file for the access permissions step in Azure Digital Twins setup
ms.service: digital-twins
ms.topic: include
ms.date: 7/17/2020
ms.author: baanders
---

Once you set up an Azure Digital Twins instance, it is common to interact with that instance through a client application. In order to create a working client application, you'll need to make sure the client app will be able to authenticate against Azure Digital Twins. This is done by setting up an [Azure Active Directory (Azure AD)](../articles/active-directory/fundamentals/active-directory-whatis.md) **app registration** for your client app to use.

This app registration is where you configure access permissions to the [Azure Digital Twins APIs](../articles/digital-twins/how-to-use-apis-sdks.md). Later, the client app will authenticate against the app registration, and as a result be granted the configured access permissions to the APIs.

>[!TIP]
> As a subscription Owner/administrator, you may prefer to set up a new app registration for every new Azure Digital Twins instance, *or* to do this only once, establishing a single app registration that will be shared among all Azure Digital Twins instances in the subscription.

### Create the registration
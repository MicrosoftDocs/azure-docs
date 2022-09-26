---
author: kengaderdus
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 07/05/2021
ms.author: kengaderdus
# Used by Azure AD B2C app integration articles under "App integration".
---
The sign-out flow involves the following steps:

1. From the app, users sign out.
1. The app clears its session objects, and the authentication library clears its token cache.
1. The app takes users to the Azure AD B2C sign-out endpoint to terminate the Azure AD B2C session.
1. Users are redirected back to the app.

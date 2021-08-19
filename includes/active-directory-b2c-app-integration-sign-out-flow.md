---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 07/05/2021
ms.author: mimart
# Used by Azure AD B2C app integration articles under "App integration".
---
The sign-out flow involves the following steps:

1. From the app, users sign out.
1. The app clears its session objects, and the authentication library clears its tokens cache.
1. The app takes users to the Azure AD B2C logout endpoint to terminate the Azure AD B2C session.
1. Users are redirected back to the app.

---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 06/11/2021
ms.author: mimart
# Used by Azure AD B2C app integration articles under "App integration".
---
The sign-out flow involves following steps:

1. From the app, the user selects **Sign-out**.
1. The app clears its session cookies, and authentication library clears its token cache.
1. The app redirects the user to Azure AD B2C logout endpoint to terminate Azure AD B2C session.
1. The user is redirected back to the app.
---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 06/11/2021
ms.author: mimart
# Used by Azure AD B2C app integration articles under "App integration".
---
When a user attempts to sign in to your app, the app initiates an authentication request to the authorization endpoint via a [user flow](../articles/active-directory-b2c/user-flow-overview.md). The user flow defines and controls the user experience. After the user completes the user flow, Azure AD B2C generates a token, and redirects the user back to your application.

If you haven't done so already, [create a user flow, or a custom policy](../articles/active-directory-b2c/add-sign-up-and-sign-in-policy.md).

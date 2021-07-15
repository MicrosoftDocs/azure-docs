---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 06/11/2021
ms.author: mimart
# Used by Azure AD B2C app integration articles under "App integration".
---
## Prepopulate the sign-in name

During a sign-in user journey, your app may target a specific user. When targeting a user, an application can specify in the authorization request, the `login_hint` query parameter with the user sign-in name. Azure AD B2C automatically populates the sign-in name, and the user only needs to provide the password. 

To prepopulate the sign-in name, follow these steps:
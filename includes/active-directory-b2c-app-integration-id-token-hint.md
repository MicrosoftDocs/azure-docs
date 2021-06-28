---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 06/11/2021
ms.author: mimart
# Used by Azure AD B2C app integration articles under "App integration".
---
## Pass ID token hint

A relying party application can send an inbound JWT token as part of the OAuth2 authorization request.  The inbound token is a hint about the user, or the authorization request. Azure AD B2C validates the token, and extracts the claim.

To include an ID token hint in the authentication request, follow these steps:
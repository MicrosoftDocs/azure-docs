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

A relying party application can send an inbound JWT token as part of the OAuth2 authorization request. The JWT token can be issued by the relying party application, or an identity provider. The app then passes the token as a hint about the user, or the authorization request. Azure AD B2C validates the signature, issuer name, and token audience, and extracts the claim from the inbound token.

To include an ID token hint in the authentication request, follow these steps:
---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 06/11/2021
ms.author: mimart
# Used by Azure AD B2C app integration articles under "App integration".
---
After authenticating, the user navigates to a page that invokes a protected web API with bearer token authentication. The access token obtained from Azure AD B2C is used as the bearer token. 

The app prepares an HTTPS request to the web API. The access token acquired from Azure AD B2C will be used in the authorization header of the HTTPS request. If the access token scope doesn't match the web API scopes, the authentication library obtains a new access token with the correct scopes.
    
```http
Authorization: Bearer <token>
```

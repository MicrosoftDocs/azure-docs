---
author: kengaderdus
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 03/09/2023
ms.author: kengaderdus
# Used by Azure AD B2C app integration articles under "App integration".
---
After the authentication is completed, users interact with the app, which invokes a protected web API. The web API uses [bearer token](https://datatracker.ietf.org/doc/html/rfc6750) authentication. The bearer token is the access token that the app obtained from Azure AD B2C. The app passes the token in the authorization header of the HTTPS request. 
    
```http
Authorization: Bearer <access token>
```

If the access token's scope doesn't match the web API's scopes, the authentication library obtains a new access token with the correct scopes.

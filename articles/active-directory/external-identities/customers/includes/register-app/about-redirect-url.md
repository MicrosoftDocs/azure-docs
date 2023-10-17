---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 04/30/2023
ms.author: kengaderdus
---

## About redirect URI

The redirect URI is the endpoint where the user is sent to by the authorization server (in this case, Microsoft Entra ID) after completing its interaction with the user, and to which an access token or authorization code is sent to upon successful authorization. 

In a production application, it's typically a publicly accessible endpoint where your app is running, like `https://contoso.com/auth-response`.

During app development, you might add the endpoint where your application listens locally, like http://localhost:3000. You can add and modify redirect URIs in your registered applications at any time.

The following restrictions apply to redirect URIs:

- The reply URL must begin with the scheme `https`, unless you use a localhost redirect URL.

- The reply URL is case-sensitive. Its case must match the case of the URL path of your running application. For example, if your application includes as part of its path `.../abc/response-oidc`, do not specify `.../ABC/response-oidc` in the reply URL. Because the web browser treats paths as case-sensitive, cookies associated with `.../abc/response-oidc` may be excluded if redirected to the case-mismatched `.../ABC/response-oidc` URL.

- The reply URL should include or exclude the trailing forward slash as your application expects it. For example, `https://contoso.com/auth-response` and `https://contoso.com/auth-response/` might be treated as non-matching URLs in your application.

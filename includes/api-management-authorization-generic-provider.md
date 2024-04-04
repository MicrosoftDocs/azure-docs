---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 02/02/2023
ms.author: danlep
---
| Property | Description | Required | Default |
|---|---|---|---|
| Provider name | Name of credential provider resource in API Management |Yes | N/A | 
| Identity provider  | Select **Generic Oauth 2** or **Generic Oauth 2 with PKCE**. |Yes | N/A | 
| Grant type  | The OAuth 2.0 authorization grant type to use <br/><br/>Depending on your scenario and your identity provider, select either **Authorization code** or **Client credentials**. |Yes | Authorization code | 
| Authorization URL | The authorization endpoint URL | No | UNUSED | 
| Client ID | The ID used to identify an app to the identity provider's authorization server | Yes | N/A |
| Client secret | The secret used by the app to authenticate with the identity provider's authorization server | Yes | N/A |
| Refresh URL | The URL that your app makes a request to in order to exchange a refresh token for a renewed access token  | No | UNUSED |
| Token URL | The URL on the identity provider's authorization server that is used to programmatically request tokens | Yes | N/A |
| Scopes | One or more specific actions the app is allowed to do or information that it can request on a user's behalf from an API, separated by the " " character<br/><br/> Example: `user web api openid` | No | N/A | 
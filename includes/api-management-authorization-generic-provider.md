---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 02/02/2023
ms.author: danlep
---
    | Property | Description | Required | Default |
    |---|---|---|---|
    | Provider name | Name of authorization provider resource in API Management |Yes | N/A | 
    | Identity provider  | Select **Generic Oauth 2** or **Generic Oauth 2 with PKCE**. |Yes | N/A | 
    | Grant type  | The authorization grant type to use. Depending on your scenario and your identity provider, select either **Authorization Code** or **Client Credentials**. |Yes | N/A | 
    | Authorization URL | The authorization endpoint URL<br/><br/> Example: `https://login.microsoftonline.com/{{TenantID}}/oauth2/v2.0/authorize` | No | UNUSED | 
    | Client ID | The ID used to identify an app to the identity provider's authorization server | Yes | N/A |
    | Client secret | The secret used by the app to authenticate with the identity provider's authorization server | Yes | N/A |
    | Refresh URL | The URL that your app makes a request to in order to exchange a refresh token for a renewed access token<br/><br/> Example: `https://login.microsoftonline.com/{{TenantID}}/oauth2/v2.0/refresh`  | No | UNUSED |
    | Token URL | The URL on the identity provider's authorization server that is used to programmatically request tokens<br/><br/> Example: `https://login.microsoftonline.com/{{TenantID}}/oauth2/v2.0/token` | Yes | N/A |
    | Scopes | Space-delimited list that defines specific actions the app is allowed to do or information that it can request on a user's behalf from an API<br/><br/> Example: `user web api openid` | No | N/A | 
    | Authorization name | Name of an authorization using the authorization provider | Yes | N/A |
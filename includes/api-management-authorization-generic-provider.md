---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 10/03/2025
ms.author: danlep
---
| Property | Description | Required | Default |
|---|---|---|---|
| **Credential provider name** | The name of credential provider resource in API Management. |Yes | N/A | 
| **Identity provider**  | Select **OAuth 2.0**, **OAuth 2.0 with PKCE**, or **OAuth 2.1 with PKCE with DCR**. |Yes | N/A | 
| **Grant type**  | The OAuth 2.0 authorization grant type to use. <br/><br/>Depending on your scenario and your identity provider, select either **Authorization code** or **Client credentials**. |Yes | **Authorization code** | 
| **Authorization URL** | The authorization endpoint URL. | Yes, for PKCE | UNUSED for OAuth 2.0| 
| **Client ID** | The ID used to identify an app to the identity provider's authorization server. | Yes | N/A |
| **Client secret** | The secret used by the app to authenticate with the identity provider's authorization server. | Yes | N/A |
| **Refresh URL** | The URL that your app makes a request to in order to exchange a refresh token for a renewed access token.  | Yes, for PKCE | UNUSED for OAuth 2.0 |
|**Server URL**|The base server URL. |Yes, for OAuth 2.1 with PKCE with DCR|N/A|
| **Token URL** | The URL on the identity provider's authorization server that's used to programmatically request tokens. | Yes | N/A |
| **Scopes** | One or more specific actions the app is allowed to do or information that it can request on a user's behalf from an API, separated by spaces.<br/><br/> Example: `user web api openid` | No | N/A | 
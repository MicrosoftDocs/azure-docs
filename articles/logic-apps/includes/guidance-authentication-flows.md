---
ms.service: azure-logic-apps
author: ecfan
ms.author: estfan
ms.topic: include
ms.date: 04/01/2025
---

> [!WARNING]
>
> Microsoft advises *against* using the following flows for authentication and authorization:
>
> - Resource Owner Password Credentials (ROPC) for OAuth 2.0
>
>   This flow lets you sign in to an application with a password. The flow is incompatible with 
>   multifactor authentication (MFA), requires a very high degree of trust in the application, 
>   and carries risks that don't exist in other flows. Use this flow only if other more secure 
>   flows aren't supported or available.
>
>   For more information, see [Oauth 2.0 Resource Owner Password Credentials](/entra/identity-platform/v2-oauth-ropc).
>
> - Implicit grant flow for OAuth 2.0
>
>   This token-based flow is intended for traditional web apps where the server has more secure 
>   control over processing **`POST`** data and is often used with the [authorization code flow](/entra/identity-platform/v2-oauth2-auth-code-flow).
>   Due to how this flow handles and returns ID tokens or access tokens, the flow requires a very 
>   high degree of trust in the application and carries risks that don't exist in other flows. 
>   Use this flow only when other more secure flows aren't supported or available.
>
>   For more information, see [OAuth 2.0 implicit grant flow](/entra/identity-platform/v2-oauth2-implicit-grant-flow).

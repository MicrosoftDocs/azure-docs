---
title: Validate JSON Web Tokens with an authentication policy (Preview)
titleSuffix: Azure Front Door
description: Learn how to use an authentication policy in Azure Front Door Premium, in public preview, to validate Microsoft Entra ID JSON Web Tokens at the edge.
author: jessie-jyy
ms.author: yuajia
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 11/10/2026
---

# Validate JSON Web Tokens with an authentication policy (preview)

**Applies to:** :heavy_check_mark: Front Door Premium

> [!IMPORTANT]
> The authentication policy feature in Azure Front Door is currently in public preview. This preview is provided without a service-level agreement and isn't recommended for production workloads. Preview capabilities and support might be limited and can change before general availability. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

An authentication policy in Azure Front Door validates JSON Web Tokens (JWTs) at the edge before requests reach your API or web application. Clients send a token in the `Authorization` or `Proxy-Authorization` request header. Front Door validates the token against the policy and either forwards the request to the origin or applies the configured action.

Use an authentication policy to reject requests with missing or invalid tokens before they reach your origin. You can also log validation results without blocking requests to evaluate a policy before you enforce it.

Authentication policies support tokens issued by Microsoft Entra ID. You can associate a policy with a Front Door profile, domain, or route.

## How token validation works

Front Door processes a request by using the following steps:

1. Identify the authentication policy that applies to the request.
1. Read the JWT from the header configured in the policy.
1. Read the token's signing-key identifier (`kid`) and obtain the corresponding key from the configured Microsoft Entra ID JSON Web Key Set (JWKS) endpoint. Front Door caches and refreshes signing keys.
1. Validate the token's signature, expiration, issuer, and audience against the policy.
1. Forward the request to the origin if validation succeeds. If validation fails, apply the policy's action.

### Policy actions

| Action | Behavior |
| --- | --- |
| **Block** | Reject a request that doesn't meet the policy requirements with HTTP `401 Unauthorized`, without forwarding it to the origin. |
| **Log** | Log the validation result and allow the request to continue. |

### Policy scope and precedence

You can associate an authentication policy at the following scopes:

| Scope | Precedence |
| --- | --- |
| Route | Highest |
| Domain | Applies when no route-level policy takes precedence. |
| Profile | Applies when no route-level or domain-level policy takes precedence. |

If multiple scopes have policies, the effective policy follows this order: **Route > Domain > Profile**.

## Prerequisites

Before you configure an authentication policy, prepare the following resources and values:

- An [Azure Front Door Premium profile](create-front-door-portal.md).
- An existing or new Microsoft Entra ID application registration representing the API or application that you want to protect.
- The expected issuer (`iss`) and audience (`aud`) values for access tokens issued for the protected application.
- A client that can obtain a JWT access token from Microsoft Entra ID and send it using the `Bearer` authentication scheme in the configured request header.

> [!IMPORTANT]
> Secure your origin so clients can't bypass Front Door and access the application directly. For more information, see [Secure traffic to Azure Front Door origins](origin-security.md).

## Configure an authentication policy

Use the [Azure portal](https://portal.azure.com) to configure JWT validation on an Azure Front Door Premium profile:

1. Sign in to the Azure portal and open your Front Door Premium profile.
1. Create an authentication policy for JWT validation and provide a policy name.
1. Select **Microsoft Entra ID** as the identity provider and configure the issuer and audience for your application.
1. Set the authentication location to **Header**, and select either `Authorization` or `Proxy-Authorization`.

   The token must use the `Bearer` authentication scheme (for example, `Authorization: Bearer <token>` or `Proxy-Authorization: Bearer <token>`).

1. Choose whether to forward the validated token to the origin. For more information, see [Forward the token to the origin](#forward-the-token-to-the-origin).
1. Select the policy action.
1. Associate the policy with the intended profile, domain, or route.
1. Wait for the policy deployment to complete before testing.

### Send a token

Send a single JWT in the header that you configured in the policy. Include the `Bearer` prefix before the token.

For example, if the policy uses `Authorization`, send:

```http
Authorization: Bearer <access-token>
```

If the policy uses `Proxy-Authorization`, send:

```http
Proxy-Authorization: Bearer <access-token>
```

Replace `<access-token>` with a token issued for the issuer and audience configured in the policy.

### Forward the token to the origin

The **Forward validated token to origin** setting controls whether Front Door keeps the configured token header when it forwards a successfully validated request. This setting defaults to **true**.

- Enable forwarding if your origin needs to inspect or validate the client token.
- Disable forwarding if the origin doesn't need the client token or uses a different authentication mechanism. Front Door removes the configured token header before forwarding the request.

If your origin requires the client token, keep token forwarding enabled.

### Combine client validation with origin authentication

Client JWT validation and origin authentication protect different parts of the request path:

- An **authentication policy** validates the token that the client sends to Front Door.
- **Origin authentication** authenticates Front Door to the origin.

Configure client-to-Front Door authentication and Front Door-to-origin authentication separately so that they don't use the same header for different tokens. When you use managed identity for origin authentication, Front Door places its origin access token in the `Authorization` header. Configure the authentication policy to use `Proxy-Authorization` for the client token, and have clients send their JWT in that header. This configuration keeps the client token separate from the origin authentication token.

For more information, see [Use managed identities to authenticate to origins](origin-authentication-with-managed-identities.md).

## Test the policy

After the policy is deployed:

1. Send a request with a valid token in the configured header and verify that Front Door forwards it to your origin.
1. Send a request without a token, and another request with an invalid token.
1. Verify that the results match the selected action: **Block** rejects noncompliant requests with HTTP `401 Unauthorized`; **Log** allows them to continue and records the validation result.
1. Review access logs and policy diagnostics to confirm the expected validation results.

For information about configuring Front Door logging, see [Monitor Azure Front Door](monitor-front-door.md).

## Limitations

- The authentication policy feature is available in public preview on Azure Front Door Premium.
- Only tokens issued by Microsoft Entra ID are supported.
- Cross-cloud tokens aren't supported.
- In Azure public cloud, supported Microsoft Entra ID issuer hosts are `login.microsoftonline.com` and `sts.windows.net`.

## Related content

- [Secure your Azure Front Door](secure-front-door.md)
- [Secure traffic to Azure Front Door origins](origin-security.md)
- [Use managed identities to authenticate to origins](origin-authentication-with-managed-identities.md)

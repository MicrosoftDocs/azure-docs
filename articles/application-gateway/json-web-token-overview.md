---
title: JSON Web Token (JWT) validation in Azure Application Gateway (preview)
description: Learn how to use centralized authentication policies to validate JSON Web Tokens across multiple Azure Application Gateways.
author: Vyshnavi-MSFT
ms.author: vnamani
ms.service: azure-application-gateway
ms.topic: article
ms.date: 11/13/2026
---

# JSON Web Token (JWT) validation in Azure Application Gateway (preview)

[Azure Application Gateway](/azure/application-gateway/overview) can validate JSON Web Tokens (JWTs) issued by Microsoft Entra ID before requests reach your backend application. Use JWT validation for API, service-to-service, and machine-to-machine traffic in which the client gets a token from Microsoft Entra ID and sends it in the `Authorization` header of every request.

Configure JWT validation through a centralized authentication policy. You can associate one policy with routing rules on multiple Application Gateway instances, which helps you apply the same issuer, audience, and unauthenticated-request behavior consistently across applications and environments. The authentication policy is a regional resource, so it must be in the same region as the Application Gateway instances that use it.

> [!IMPORTANT]
> The earlier Application Gateway JWT validation preview described in [JSON Web Token (JWT) validation in Application Gateway](json-web-token-overview.md) remains active for existing policies during this public preview.
> Earlier JWT validation policies continue to be active until the centralized JWT validation public preview reaches general availability (GA).
> Existing configurations won't be migrated automatically.
> For new deployments, use the centralized JWT validation policy described in this article. This article isn't a formal deprecation notice. Continue to follow the existing preview guidance until Microsoft publishes lifecycle and transition details.

> [!NOTE]
> Centralized JWT validation is currently in preview. This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Key capabilities

- **Token validation**: Validates the token signature, issuer, audience, and lifetime before forwarding a request.
- **Central policy management**: Defines authentication requirements in one policy instead of repeating configuration on every gateway.
- **Multiple gateway associations**: Applies one policy to routing rules across multiple Application Gateway instances.
- **Identity propagation**: For validated tokens, forwards the `x-msft-entra-identity` header to the backend as `tenantId:oid`.
- **Flexible actions**: Denies missing or invalid tokens, or allows unauthenticated traffic when your application requires it. By using **Allow**, the request forwards without the identity header.
- **HTTPS enforcement**: Applies authentication policies to HTTPS routing rules.

## Prerequisites

Before you create a policy, complete these tasks:

- Create or use a Standard_v2 or WAF_v2 Application Gateway instance.
- Configure an HTTPS listener and a backend target.
- Create an eligible routing rule for each route that you want to protect. Basic and Advanced routing rules are supported, including Advanced rules with path conditions. The separate path-based routing rule type isn't supported during preview.
- Ensure that Application Gateway can reach the Microsoft Entra metadata endpoints over TCP port 443.
- Register the protected API in Microsoft Entra ID.
- Record the following values:
  - Directory (tenant) ID
  - Application (client) ID
  - Application ID URI or other expected audience
  - Issuer URL

| Configuration | Supported |
| --- | --- |
| Basic routing rule | Yes |
| Advanced routing rule | Yes |
| Path-based routing rule type | No |
| HTTPS listener | Yes |
| HTTP listener | No |

For a tenant-specific Microsoft Entra v2.0 endpoint, the values typically use these formats:

```text
Issuer:   https://login.microsoftonline.com/<tenant-id>/v2.0
Audience: api://<application-client-id>
```

Use the values published in your tenant's OpenID Connect metadata document rather than constructing endpoint URLs when possible.

## Register an application in Microsoft Entra ID

For detailed app-registration guidance, see [Register an application in Microsoft Entra ID](json-web-token-overview.md#register-an-application-in-microsoft-entra-id).

1. In the Azure portal, go to [App registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).
1. Select **New registration**.
1. For **Name**, enter **MyWebAPI**.
1. For **Supported account types**, select **Accounts in this organizational directory only (Microsoft only - Single tenant)**.

    > [!NOTE]
    > Supported account types are:
    >
    > - Single tenant (this directory only)
    > - Multitenant (any Microsoft Entra ID directory)
    > - Accounts in any Microsoft Entra ID directory and personal Microsoft accounts

1. For **Redirect URI (optional)**, you can leave the boxes blank. This setting isn't required for API scenarios.
1. Select **Register**.
1. Note down the values for **Application (client) ID** and **Directory (tenant) ID**.
1. (Optional) Configure an application ID URI:

    1. Go to **Expose an API** > **Set Application ID URI**.
    1. Use the default `api://<ClientID>` or a custom URI (for example, `https://api.contoso.com`).

1. (Optional) Define API scopes:

    - Go to **Expose an API** > **Add a scope**.

    This capability is for future authorization features. It's not required for the preview.

## Configure a JWT validation policy

1. In the [Azure portal](https://ms.portal.azure.com/?exp.AzurePortal_isauthenticationpolicyon=true#home), open the Application Gateway that has the routing rules you want to protect.
1. Under **Settings**, select **Authentication policies (Preview)**.
1. Select **Create** > **JWT validation**.

   :::image type="content" source="media/json-web-token-overview/jwt-validation-configuration.png" alt-text="Screenshot of the pane for updating JSON Web Token configuration for Application Gateway.":::

   You can also create a policy by searching for **Authentication policies** in the portal.

1. On **Basics**, configure:
   - **Subscription**
   - **Resource group**
   - **Policy for**: **Application Gateway (regional)**
   - **Policy type**: **JWT validation**
   - **Name**
   - **Region**
1. On **Authentication method**, configure:

   | Setting | Description |
   | --- | --- |
   | **User trust provider type** | Select **Microsoft Entra ID**. |
   | **Issuer** | Exact issuer expected in the token's `iss` claim. |
   | **Audience** | Value expected in the token's `aud` claim. |
   | **Client ID** | Application ID of the protected API. |
   | **Unauthorized request** | Select **Deny** to reject missing or invalid tokens. Use **Allow** only when your application intentionally supports anonymous requests. |

1. On **Association**, select **Add Application Gateway**.
1. Select a gateway and the HTTPS routing rules that the policy should protect.
1. Repeat the association step for each additional Application Gateway that should use the same policy.
1. On **Review + create**, verify the settings, and then select **Create**.

Policy settings apply to every associated routing rule. Before changing a shared policy, review all its associations to understand the impact.

:::image type="content" source="media/json-web-token-overview/jwt-validation-flow-diagram.png" alt-text="Screenshot of a diagram showing JWT signature and claim validation at Application Gateway, backend forwarding, and rejection of missing or invalid tokens when the policy uses Deny.":::

## Create the routing rule

1. Go to **Application Gateway** > **Rules** > **Add Routing rule**.
1. Enter or select the following items:
   - **Listener**: Use the protocol `HTTPS`, an assigned certificate, or an Azure Key Vault secret.
   - **Backend target**: Select or create a backend pool.
   - **Backend settings**: Use an appropriate HTTP/HTTPS port.
   - **Rule name**: Enter a name such as `jwt-route-rule`.
1. Associate this rule with your JWT validation policy.

During preview, a routing rule must use an HTTPS listener to be eligible for an authentication policy. Basic and Advanced rules are supported, and an Advanced rule can include a path condition. This requirement is different from the separate path-based routing rule type, which isn't supported.

## Send a request with JWT

Obtain an access token for the configured audience, and include it in every request:

```bash
curl --request GET \
  --header "Authorization: Bearer <access-token>" \
  https://api.contoso.com/orders
```

Don't put access tokens in URLs. URLs can be recorded in browser history, proxy logs, and diagnostic data.

## Expected outcomes of requests

| Scenario | HTTP status | Identity header | Notes |
| --- | --- | --- | --- |
| Valid token, `action=Allow` | 200 | Present | Token validated, identity forwarded |
| Invalid token, `action=Deny` | 401 | Absent | Gateway blocks request |
| Missing token, `action=Deny` | 401 | Absent | No authorization header |
| Missing `oid` claim, `action=Deny` | 403 | Absent | Critical claim missing |

## Backend verification

Check the `x-msft-entra-identity` header to confirm authentication.

## Troubleshoot JWT validation

### Application Gateway returns 401

Verify that:

- The request contains one `Authorization` header with the `Bearer` scheme.
- The token isn't expired and its `nbf` claim isn't in the future.
- The token's `iss` value exactly matches the configured issuer.
- The token's `aud` value matches the configured audience.
- The signing key identified by the token's `kid` value is available from the JWKS endpoint.
- The policy is associated with the routing rule that handled the request.

### A valid request reaches the wrong policy

Check the listener, host name, path match, routing-rule priority, and policy associations. You can associate a shared policy with multiple gateways, but each request is evaluated by the policy associated with its selected routing rule.

### Policy creation or association fails

Verify that the selected gateway and rule meet the preview requirements, use an HTTPS listener, have a backend target, and are in a supported region.

## Related content

- [Authenticate users using Azure Application Gateway](user-authentication.md)
- [Access tokens in the Microsoft identity platform](/entra/identity-platform/access-tokens)
- [OpenID Connect on the Microsoft identity platform](/entra/identity-platform/v2-protocols-oidc)
- [Azure Application Gateway overview](/azure/application-gateway/overview)

---
title: JSON Web Token (JWT) validation in Azure Application Gateway (Preview)
titleSuffix: Azure Application Gateway
description: Learn how to configure JSON Web Token (JWT) validation in Azure Application Gateway to enforce authentication and authorization policies.
author: rnautiyal
ms.author: rnautiyal
ms.service: azure-application-gateway
ms.topic: conceptual
ms.date: 11/18/2025
---

# JSON Web Token (JWT) validation in Azure Application Gateway (Preview)

The Microsoft Entra JSON Web Tokens (JWTs) feature enables [Azure Application Gateway](/azure/application-gateway/) to validate JSON Web Tokens (JWTs) issued by [Microsoft Entra ID](https://docs.azure.cn/en-us/entra/fundamentals/what-is-entra) (formerly Azure Active Directory) in incoming HTTPS requests. This provides first-hop authentication enforcement for Web APIs or any protected resource without requiring custom code in your backend applications. This capability verifies the integrity and authenticity of tokens in incoming requests and determines whether to allow or deny access before forwarding traffic to backend services. Upon successful validation, the gateway injects the ``x-msft-entra-identity`` header into the request and forwards it to the backend, enabling downstream applications to securely consume verified identity information

By performing token validation at the edge, Application Gateway simplifies application architecture and strengthens overall security posture. JWT validation is stateless, meaning each request must present a valid token for access to be granted. No session or cookie-based state is maintained, ensuring consistent validation across requests and alignment with [Zero Trust](/security/zero-trust/zero-trust-overview) principles.

> [!IMPORTANT]
> JWT validation in Azure Application Gateway is currently in **Public Preview**. This preview version is provided without a service level agreement, and isn't recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Key capabilities

- Token Validation: Validates JWT signature, issuer, tenant, audience, and lifetime
- Identity Propagation: Injects `x-msft-entra-identity` header with tenantId:oid to backend
- Flexible Actions: Configure Deny (return 401) or Allow (forward without identity header) for invalid tokens
- Multitenant Support: Supports common, organizations, and consumers tenant configurations
- HTTPS Only: Feature requires HTTPS listeners (HTTP not supported)

> [!NOTE]
> Tokens must be issued by Microsoft Entra ID

## Prerequisites

- **Application Gateway Requirements**
   - SKU: Standard_v2 or WAF_v2 (Basic SKU not supported)
   - Protocol: HTTPS listener required (TLS/SSL certificate is configured)
   - API Version: Azure Resource Manager API version 2025-03-01 or later

- **Network Requirements**
   - Outbound Connectivity from Application Gateway Subnet to login.microsoftonline.com over TCP port 443

- **Microsoft Entra ID Requirements**
   - Register your Web API in Microsoft Entra ID and note down:
      - Tenant ID: Azure AD tenant GUID, or use common, organizations, or consumers for multitenant apps
      - Client ID: The Application (Client) ID from your app registration (must be a GUID)
      - Audiences (optional): Additional valid aud claim values (max 5) such as custom App ID URIs

> [!NOTE]
> Audiences (`aud`): The `aud` claim is the resource identifier (App ID URI, well‑known resource URI, or sometimes the app's Client ID GUID). The `aud` claim identifies the resource (API) the token is issued for — an App ID URI, a well‑known resource URI, or the application's Client ID GUID. The scope or resource you request points to a resource; Entra ID then sets `aud` to that resource's identifier.
> Common mappings:
>
> - `--scope "api://<ClientID>/.default"` → `aud` = your App ID URI (for example. `api://<ClientID>` or custom). If no App ID URI is set, `aud` falls back to the Client ID GUID.
> - `--scope "https://api.contoso.com/.default"` → `aud = https://api.contoso.com`
> - `--scope "https://management.azure.com/.default"` → `aud = https://management.azure.com`
> - `--scope "https://graph.microsoft.com/.default"` → `aud = https://graph.microsoft.com`
> Add entries to **Audiences** when the token's `aud` is a custom App ID URI (not equal to the bare Client ID GUID) or you intentionally accept multiple resource identifiers. The gateway succeeds validation if `aud` matches either:
> (1) the configured Client ID (when `aud` is the GUID), or 
> (2) any value in the Audiences list (including App ID URIs or well‑known resource URIs).

## Configure JWT validation

In this section, you learn how to configure JWT validation in Azure Application Gateway in four steps:

## Register an application in Microsoft Entra ID

   1. Go to [Azure portal  App registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).
   1. Select **New registration**.
   1. Enter:
         - **Name:** `MyWebAPI`
         - **Supported account types:** *Accounts in this organizational directory only* (Microsoft only - Single Tenant).
   1. Redirect URI: Not required for API scenarios
   1. Select **Register**.
   1. Note down:
         - **Application (client) ID** → `CLIENT_ID`
         - **Directory (tenant) ID** → `TENANT_ID`.
   1. **(Optional) Configure App ID URI**:
      - Go to **Expose an API** → **Set** Application ID URI
      - Use default `api://<ClientID>` or custom URI (for example, `https://api.contoso.com`)

   1. **(Optional) Define API Scopes**:
      - Go to **Expose an API** → **Add a scope**
      - This is for future authorization features (not required for Public Preview)

> [!NOTE]
> Supported account types:
>
> Single tenant (This directory only)
>
> Multitenant (Any Azure AD directory)
>
> Accounts in any Azure AD directory + personal Microsoft accounts


## Configure JWT validation in Application Gateway

   1. Open the preview configuration portal:  
      [App Gateway JWT Config Portal](https://ms.portal.azure.com/?feature.applicationgatewayjwtvalidation=true#home)

   1. Open your Application Gateway, navigate to Settings in the left menu, and select the **JWT validation configuration** window.

       :::image type="content" source="media/json-web-token-overview/json-web-token-configuration.png" alt-text="Screenshot of JSON Web Token configuration window for Application Gateway.":::

   1. Provide the following details:

      | Field                    | Example                        | Description                                                              |
      | ------------------------ | ------------------------------ | ------------------------------------------------------------------------ |
      | **Name**                 | `jwt-policy-1`                 | Friendly name for the validation configuration                           |
      | **Unauthorized Request** | `Deny`                         | Reject requests with missing or invalid JWTs                             |
      | **Tenant ID**            | `<your-tenant-id>`             | Must be a valid GUID or one of `common`, `organizations`, or `consumers` |
      | **Client ID**            | `<your-client-id>`             | GUID of the app registered in Microsoft Entra                                      |
      | **Audiences**            | `<api://<client-id>`           | (Optional) Additional valid aud claim values (max 5)                     |  


   1. Associate the configuration with a **Routing rule** (see next section if new routing rule is needed).


## Create a routing rule (if needed)

1. Go to **Application Gateway -> Rules -> Add Routing rule**

1. Enter or select the following:
   - **Listener:** Protocol `HTTPS`, assign certificate, or Key Vault secret.
   - **Backend target:** Select or create a backend pool.
   - **Backend settings:** Use appropriate HTTP/HTTPS port.
   - **Rule name:** For example, `jwt-route-rule`.

1. Link this rule to your JWT validation configuration. Your JWT validation configuration is now attached to a secure HTTPS listener and routing rule.

## Send Request to Application Gateway

Use `curl` or any HTTP client to send requests with a valid JWT in the `Authorization` header.

```bash
APPGW_URL="https://<appgw-frontend-ip-or-dns>:<port>/<path>"
curl -i -H "Authorization: Bearer $TOKEN" "$APPGW_URL"
```

> [!NOTE]
> Tokens must be issued by Microsoft Entra ID. Check [Token](/azure/devops/cli/entra-tokens) for more details

## Expected Outcomes

| Scenario                         | HTTP Status | Identity Header | Notes                               |
| -------------------------------- | ----------- | --------------- | ----------------------------------- |
| Valid token, action=Allow        | 200         | Present         | Token validated, identity forwarded |
| Invalid token, action=Deny       | 401         | Absent          | Gateway blocks request              |
| Missing token, action=Deny       | 401         | Absent          | No Authorization header             |
| Missing `oid` claim, action=Deny | 403         | Absent          | Critical claim missing              |

## Backend Verification

Check ``x-msft-entra-identity`` header to confirm authentication.

## Troubleshooting 401 and 403 responses

If requests return **401** or **403**, verify:

- **Configuration**
   - Tenant ID / Issuer (`iss`) matches your Microsoft Entra tenant.
   - Audience (`aud`) matches the configured Client ID or audience list.
- **Token integrity**
   - Token isn't expired (`exp`) and `nbf` isn't in the future.
- **Request formatting**
   - `Authorization: Bearer <access_token>` header is present and intact.
- **Gateway policy placement**
   - JWT validation is attached to the correct listener and routing rule.
- **Still failing?**
   - Acquire a new token for the correct audience.
   - Check Application Gateway access logs for detailed failure reason.

## Additional concepts for reference

## Audience vs. scope mapping

Understanding how requested scopes map to the JWT `aud` claim helps determine whether you need to populate the optional **Audiences** list in the Application Gateway configuration.

**Key points:**

- `aud` represents the resource the token was issued for.
- Resource identifiers can be:
   - An App ID URI (for example, `api://<ClientID>` or a verified domain URI like `https://api.contoso.com`)
   - A well-known Microsoft resource URI (for example, `https://management.azure.com`, `https://graph.microsoft.com`)
   - The application's Client ID GUID (common when no App ID URI is set)

## Common scope-to-`aud` mappings

| az CLI scope argument                   | Typical resulting `aud`                                                                   |
| --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `api://<ClientID>/.default`             | `api://<ClientID>` (or custom App ID URI); falls back to GUID if no App ID URI configured |
| `https://api.contoso.com/.default`      | `https://api.contoso.com`                                                                 |
| `https://management.azure.com/.default` | `https://management.azure.com`                                                            |
| `https://graph.microsoft.com/.default`  | `https://graph.microsoft.com`                                                             |

## When to add values to the Audiences list

- Tokens use a custom App ID URI (not just the GUID).
- You accept multiple resource identifiers (for example, during migration from `api://<ClientID>` to `https://api.contoso.com`).
- You need to allow both GUID and URI forms simultaneously.

**Gateway validation logic:**

- If no audiences are configured: token `aud` must equal the configured `ClientId` (GUID).
- If audiences are configured: token `aud` must match either the `ClientId` or one of the configured audience strings.

**Audiences checklist:**

| Scenario                                  | Configure Audiences? | Example Entry             |
| ----------------------------------------- | -------------------- | ------------------------- |
| Only GUID `aud` tokens observed           | No                   | (leave empty)             |
| Tokens show `api://<ClientID>`            | Yes                  | `api://<ClientID>`        |
| Custom domain App ID URI                  | Yes                  | `https://api.contoso.com` |
| Supporting old & new URI during migration | Yes                  | Both URIs (≤5 total)      |

> [!NOTE]
> Keep the list minimal—every extra accepted `aud` broadens what the gateway treats as valid.

## Acquire an access token

The method used to acquire the token determines the `oid` (object ID) in the ``x-msft-entra-identity`` header forwarded to your backend.

#### Scenario 1: Client Credentials Flow

**Use case:** Service-to-service authentication  
**Identity header format:** `tenantId:<service-principal-oid>`

```bash
# Using client secret
CLIENT_ID="<your-client-id>"
CLIENT_SECRET="<your-client-secret>"
TENANT_ID="<your-tenant-id>"
SCOPE="api://<your-client-id>/.default"
TOKEN=$(az account get-access-token \
  --service-principal \
  -u "$CLIENT_ID" \
  -p "$CLIENT_SECRET" \
  --tenant "$TENANT_ID" \
  --scope "$SCOPE" \
  --query accessToken -o tsv)
echo "Access Token: $TOKEN"
```

**Using client certificate (PEM or PFX):**

```bash
# PEM format
az account get-access-token \
  --service-principal \
  -u "$CLIENT_ID" \
  -p /path/to/cert.pem \
  --tenant "$TENANT_ID" \
  --scope "$SCOPE"

# PFX format
export AZURE_CERT_PASSWORD="<pfx-password>"
az account get-access-token \
  --service-principal \
  -u "$CLIENT_ID" \
  -p /path/to/cert.pfx \
  --tenant "$TENANT_ID" \
  --scope "$SCOPE"
```

#### Scenario 2: Managed Identity

**Use case:** Azure resource authenticates using managed identity  
**Identity header format:** `tenantId:<managed-identity-oid>`

```bash
# System-assigned
az login --identity
TOKEN=$(az account get-access-token \
  --scope https://management.azure.com/.default \
  --query accessToken -o tsv)

# User-assigned
USER_ASSIGNED_CLIENT_ID="<client-id>"
az login --identity --username "$USER_ASSIGNED_CLIENT_ID"
TOKEN=$(az account get-access-token \
  --scope https://management.azure.com/.default \
  --query accessToken -o tsv)
```

## Inspect the token (Optional)

Decode JWT payload:

```bash
echo "$TOKEN" | awk -F. '{print $2}' | base64 -d 2>/dev/null | jq
```

**Key claims to verify:** `aud`, `iss`, `tid`, `oid`, `exp`, `nbf`

## Next steps

To learn more about JWT validation and related identity features in Azure:

- [Understand JSON Web Tokens (JWT) in Microsoft Entra ID](/entra/identity-platform/security-tokens)
- [Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app)
- [Azure Application Gateway overview](overview.md)
---
title: JSON Web Token (JWT) validation in Azure Application Gateway (Preview)
titleSuffix: Azure Application Gateway
description: Learn how to configure JSON Web Token (JWT) validation in Azure Application Gateway to enforce authentication and authorization policies.
author: rnautiyal
ms.author: rnautiyal
ms.service: azure-application-gateway
ms.topic: article
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
   - Register your Web API in Microsoft Entra ID
   - Make a call to the Microsoft Entra ID to request access to a service. The Microsoft Entra ID responds with an access token.

- **Configure JWT validation in Application Gateway**
   
   

## JSON Web Token (JWT) validation setup

In this section, you learn how to configure JWT validation in Azure Application Gateway:

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


## Send a JWT Access Token with Every Request to the Secure Application

To securely access an application protected by Application Gateway, the client must first obtain a JWT access token from the Microsoft Entra ID token endpoint. The client then includes this token in the Authorization header (for example, Authorization: Bearer TOKEN) on every request it sends to the Application Gateway. Application Gateway validates the token before forwarding the request to the backend application, ensuring that only authenticated and authorized traffic reaches the secure application.

- Learn more about [Access tokens in the Microsoft identity platform](/entra/identity-platform/access-tokens)



## Expected Outcomes of requests

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



## Next steps

To learn more about JWT validation and related identity features in Azure:

- [Understand JSON Web Tokens (JWT) in Microsoft Entra ID](/entra/identity-platform/security-tokens)
- [Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app)
- [Azure Application Gateway overview](overview.md)
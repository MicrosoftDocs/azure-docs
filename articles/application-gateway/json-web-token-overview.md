---
title: JSON Web Token (JWT) validation in Azure Application Gateway
titleSuffix: Azure Application Gateway
description: Learn how to configure JSON Web Token (JWT) validation in Azure Application Gateway to enforce authentication and authorization policies.
author: rnautiyal
ms.author: rnautiyal
ms.reviewer: mbender
ms.service: azure-application-gateway
ms.topic: conceptual
ms.date: 11/06/2025
---

# JSON Web Token (JWT) validation in Azure Application Gateway (Preview)

## Overview

[Azure Application Gateway](/azure/application-gateway/) provides built-in JSON Web Token (JWT) validation at the gateway routing layer. This capability verifies the integrity and validity of tokens in incoming requests and makes an allow-or-deny decision before forwarding traffic to backend services. Upon successful validation, the gateway adds the `x-msft-entra-identity` header and passes it to the backend.

By performing token validation at the edge, Application Gateway helps simplify application architecture and enhance overall security. JWT validation in Application Gateway is stateless—each request must include a valid token for access to be granted. The gateway doesn't maintain any session or cookie-based state, ensuring consistent token checks and compliance with [Zero Trust](/security/zero-trust/zero-trust-overview) principles.

With JWT validation, Application Gateway can:

- Verify token integrity by using a trusted issuer and signing keys.
- Validate claims such as audience, issuer, and expiration.
- Block requests with invalid or missing tokens before they reach your backend.

## Why use JWT validation?

- **Zero Trust alignment:** Ensure only authenticated traffic reaches your application.
- **Simplified architecture:** Offload token validation from backend services.
- **Improved security:** Reduce attack surface and prevent unauthorized access.

## Supported scenarios

- Validate JWT tokens in the `Authorization` header.
- Provide an allow-or-deny decision based on token validity.
- Integrate with Web Application Firewall (WAF) policies for layered security.

## Configure JWT validation

This section provides a step-by-step guide to configure JWT validation in Azure Application Gateway.

### Step 1: Register an application in Microsoft Entra ID

To issue JWTs for testing, register an application in [Microsoft Entra](/entra/fundamentals/what-is-entra) ID:

1. Go to [Azure portal → App registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).
1. Select **New registration**.
1. Enter:
   - **Name:** `appgw-jwt-demo`
   - **Supported account types:** *Accounts in this organizational directory only*.
1. Select **Register**.
1. Copy:
   - **Application (client) ID** → `CLIENT_ID`
   - **Directory (tenant) ID** → `TENANT_ID`.

### Step 2: Configure JWT validation in Application Gateway

Use the Azure portal to create a JWT validation configuration in Application Gateway:

1. Open the preview configuration portal:  
   [App Gateway JWT Config Portal](https://ms.portal.azure.com/?feature.canmodifystamps=true&amp;Microsoft_Azure_HybridNetworking=flight23&amp;feature.applicationgatewayjwtvalidation=true).
1. Select **JWT validation configuration**.
1. Provide the following details:

    | Field                    | Example                        | Description                                                              |
    | ------------------------ | ------------------------------ | ------------------------------------------------------------------------ |
    | **Name**                 | `jwt-validation-demo`          | Friendly name for the validation configuration                           |
    | **Unauthorized Request** | Deny                           | Reject requests with missing or invalid JWTs                             |
    | **Tenant ID**            | `<your-tenant-id>`             | Must be a valid GUID or one of `common`, `organizations`, or `consumers` |
    | **Client ID**            | `<your-client-id>`             | GUID of the app registered in Microsoft Entra                                      |
    | **Audiences**            | (Optional) `api://<client-id>` | Expected audience claim matching scope                                   |

1. Associate the configuration with a **Routing rule** (see next section).

### Step 3: Create an HTTPS routing rule

Use the Azure portal to create an HTTPS listener and routing rule that uses the JWT validation configuration:

1. Go to **Application Gateway → Rules → Add Routing rule**.
1. Configure the rule:
   - **Listener:** Protocol `HTTPS`, assign certificate, or Key Vault secret.
   - **Backend target:** Select or create a backend pool.
   - **Backend settings:** Use appropriate HTTP/HTTPS port.
   - **Rule name:** For example, `jwt-route-rule`.
1. Link this rule to your JWT validation configuration.

Your JWT validation configuration is now attached to a secure HTTPS listener and routing rule.

### Step 4: Retrieve an access token using Azure CLI

Use the Azure CLI to get a JWT access token for testing:

```bash
az login --tenant "<TENANT_ID>"

CLIENT_ID="<your-client-id>"
TENANT_ID="<your-tenant-id>"

TOKEN=$(az account get-access-token \
    --scope "https://management.azure.com/.default" \
    --query accessToken -o tsv)
```

### Step 5: Test connectivity

Use `curl` to send a request to the Application Gateway with the retrieved token:

```bash

curl -H "Authorization: Bearer $TOKEN" https://appgwFrontendIpOrDns:configuredPort/pathToListenerWithRoute

```

## Expected behavior

When you test the Application Gateway with JWT validation enabled, expect the following responses:

**401 Unauthorized response** occurs when:
- No token is provided in the request
- The token is invalid or expired

**Successful validation** results in:
- The request forwarded to the backend target
- An additional `x-msft-entra-identity` header included in the forwarded request

### Next steps

- [Learn about JSON Web Tokens (JWT)](/entra/identity-platform/access-token-claims-reference)
- [Discover the fundamentals of identity with Microsoft Entra](/entra/fundamentals/what-is-entra)
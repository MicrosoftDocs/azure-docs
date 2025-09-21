---
title: Protect Agent Workflows with Easy Auth Built-In Authentication
description: Learn to secure agent workflows with Easy Auth in Azure Logic Apps. Enable built‑in authentication, token validation, and role‑based authorization.
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, divswa, edwardyhe, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 09/22/2025
ms.update-cycle: 180-days
---

# Secure agent workflows with Easy Auth in Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Agent workflows expand integration options because they can exchange messages with more diverse callers, such as people, agents, Model Context Protocol (MCP) servers and clients, tool brokers, and external services. While non-agent workflows interact with a small, known, and fixed set of callers, agent callers can come from dynamic, unknown, and untrusted networks. As a result, you must authenticate and enforce permissions for each caller.

To strengthen security for agent workflows, set up Easy Auth (App Service Authentication) so you can use the following capabilities:

- Provide a validated identity for each caller request.
- Assign connections to each user.
- Enforce Conditional Access policies.
- Issue revocable credentials.
- Grant permissions based on least-privilege principles, roles, and scopes.

These measures let you authenticate and authorize each caller at a fine-grained level and revoke access quickly when needed. Without these controls, you risk uncontrolled access, leaked secrets such as shared access signature (SAS) URLs and access keys, weak audit trails, and other security hazards.

Easy Auth works with Microsoft Entra, or optionally Open ID Connect, as a separate security layer to provide built-in authentication and authorization capabilities that meet your needs. With security enforcement operating outside your workflow, you can focus more on developing the business logic instead. This separation of concerns makes agent workflows simpler and easier to build, debug, operate, monitor, maintain, govern, and audit.

Non-agent workflow security involves static SAS, rotating secretss, and network boundary controls like access restrictions, IP allow lists, service tags, virtual network integration, and private endpoints. With agent workflows, you design authorization around end users, managed identities, service principals, and their scopes and roles. This approach enables safer global reach but still allows downstream actions to respect fine-grained permissions.

This guide shows how to set up Easy Auth on a Standard logic app resource that can contain agent and non-agent workflows.

For more information, see [Built-in authentication and authorization with Easy Auth for agent workflows](agent-workflows-concepts.md#easy-auth).

> [!IMPORTANT]
>
> Easy Auth stores setup information in your logic app resource's underlying app settings, for example, **WEBSITE_AUTH_ENABLED**, 
> **WEBSITE_AUTH_DEFAULT_PROVIDER**, and **MICROSOFT_PROVIDER_AUTHENTICATION_SECRET**. Don't manually edit these settings unless 
> you want to set up automation using ARM templates, Bicep templates, or Terraform templates.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Standard logic app resource that's deployed or ready to deploy.

- Azure **Contributor** role or higher on the logic app resource with permission to create app registrations for the target tenant using Microsoft Entra.

  > [!IMPORTANT]
  >
  > To set up Easy Auth, make sure you have the higher-level Azure **Contributor** role, which differs from the **Logic Apps Standard Contributor** role.

  For more information, see [Contributor - Azure built-in roles](/azure/role-based-access-control/built-in-roles/privileged#contributor).

- (Optional) Choose whether to support only user flows with interactive sign in or also callers that use a managed identity or service principal.

  For more information, see [Authentication and authorization in Azure App Service and Azure Functions](../app-service/overview-authentication-authorization.md).

- (Optional) A custom domain if you want to enforce specific redirect URIs for that domain.

## Create an app registration

For production scenarios, including chat and agent clients outside the Azure portal, create a dedicated Microsoft Entra app registration, and set up Easy Auth on the logic app resource. This approach isolates tokens, enforces least privilege, and avoids reusing broad multi-application registrations.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar menu, under **Settings**, select **Authentication**.

1. On the **Authentication** page, select **Add identity provider**.

1. On the **Basics** tab, for **Identity provider**, select **Microsoft** for Microsoft Entra ID.

1. For **App registration type**, select **(Recommended for Conversational agents) Create new app registration**, which shows the corresponding options for this selction.

1. Provide a unique display name for your app registration, for example: `logic-app-agent-app-reg-prod`

1. For **Supported account types**, select **Current tenant - Single tenant** unless you want to intentionally accept other tenants.

   Unless you have explicit governance and Conditional Access policies set up, don't select **Any Microsoft Entra directory - Multitenant**. For more information, see the following articles:

   - [Azure governance overview](azure/cloud-adoption-framework/ready/landing-zone/design-area/governance)
   - [Set up governance in Azure](/azure/cloud-adoption-framework/ready/azure-setup-guide/govern-org-compliance)
   - [What is Conditional Access](/entra/identity/conditional-access/overview)?

- Leave the redirect URI pre-populated by the portal (the App Service auth callback). Don’t add custom redirect URIs unless you host an interactive front-end.

1. Optionally, under **App Service authentication settings**, review the following settings and take the appropriate action:

   | Setting | Action |
   |---------|--------|
   | **Restrict access** | Unless you plan to allow some authenticated endpoints, select **Require authentication** to block all anonymous requests. |
   | **Unauthenticated requests** | Based on whether callers are agent or agent-based, select **HTTP 302 Found redirect: recommended for agents** or **HTTP 401 Unauthorized: recommended for APIs**. |

1. When you're done, select **Add** to finish adding the identity provider.

   Azure creates the app registration, updates your app settings, and enables the Easy Auth runtime. When Azure finishes, your logic app's **Authentication** page lists **Microsoft** as an identity provider. Your logic app now rejects unauthenticated calls and issues redirects or 401 responses for requests that are missing tokens.

## Related content



### What gets configured automatically

Easy Auth stores configuration in the logic app’s underlying App Service settings (for example: `WEBSITE_AUTH_ENABLED`, `WEBSITE_AUTH_DEFAULT_PROVIDER`, `MICROSOFT_PROVIDER_AUTHENTICATION_SECRET`). Do not manually edit these unless automating through ARM/Bicep/Terraform.

### Modifying an existing app registration

If you must reuse an existing Microsoft Entra app registration (shared with another API or earlier prototype), confirm and adjust these settings so the registration works cleanly with Easy Auth and agent clients:

1. In the Azure portal, go to **Microsoft Entra ID** > **App registrations** > select your app.
1. On **Branding & properties**, confirm the **Home page URL** is the logic app site URL (optional for backend-only/agent APIs; set only if users need a landing or documentation page—this value isn’t used for token redirects).
1. On **Authentication**:
	- Ensure a **Web** platform entry exists with the redirect URI in the form: `https://<logic-app-hostname>/.auth/login/aad/callback` (portal adds this automatically when you connect the provider; add manually if absent for scripted setups).
	- Add **Implicit grant and hybrid flows** for both access tokens and ID tokens.
	- Configure **Supported account types** based on business need.
	- Leave **Allow public client flows** off unless native (public) clients need ROPC avoidance via device code / auth code.
1. (Optional) Define **Scopes** (exposed API) only if you plan to have first-party clients request delegated permissions (for example: `api://<app-id>/workflow.invoke`). Exposing scopes is not required if you rely solely on roles + audience validation.
1. On **Certificates & secrets** in the **Federated credentials** tab, prefer a [user-assigned managed identity](authenticate-with-managed-identity.md?tabs=standard#create-user-assigned-identity-in-the-azure-portal) with access to the logic app. <!-- NOTE(edwardhe): Not sure if others are supported... If you need external workload identity (GitHub Actions, multi-cloud), add a federated credential. Use short‑lived certificates only if managed identity or federation isn’t possible; use a client secret last and rotate frequently. -->
1. (Optional) On **Token configuration**, add optional claims (groups, `xms_cc`, etc.) only if required. Prefer role or scope checks to large group claims to avoid token bloat.
1. On **API permissions**, grant **Microsoft Graph** > **User.Read** permissions.
1. On **Expose an API**, add a new **Scope**:
	- **Scope name**: "api://{application (client) identifier}/user_impersonation".
	- **Who can consent**: "Admins and users".
	- **Admin consent display name**: This is what the scope will be called in the consent screen when admins consent to this scope. For example: "Access {logic app name}".
	- **Admin consent definition**: This is a detailed description of the scope that is displayed when tenant admins expand a scope on the consent screen. For example: "Allow the application to access {logic app name} on behalf of the signed-in user.".
	- **User consent display name**: This is what the scope will be called in the consent screen when users consent to this scope. For example: "Access {logic app name}".
	- **User consent definition**: This is a detailed description of the scope that is displayed when users expand a scope on the consent screen. For example: "Allow the application to access {logic app name} on your behalf.".
<!-- NOTE(edwardhe): Not sure about app roles and whether they are required. 1. On **Roles and administrators**, this is what my sample had, I think only Cloud Application Administrator is needed:
Application LockBox Administrator
Can create and manage all aspects of app registrations and enterprise apps.
PRIVILEGED
0
Custom
Application Manager
Restricted application administration role
PRIVILEGED
0
Custom
Application Owner Administrator
Enables management of application and sercice principal owners
0
Custom
Application Registration Creator
This role allows for UNLIMITED creation of application objects that is not bound by the user's directory quota object limit.
0
Custom
Cloud Application Administrator
Can create and manage all aspects of app registrations and enterprise apps except App Proxy.
PRIVILEGED
0
Built-in -->
1. Return to the logic app resource **Authentication** blade and select the existing registration instead of creating a new one. Confirm **Require authentication** is enabled and unauthenticated requests are blocked as intended.

### Testing expected behaviors after modification

- Unauthenticated call returns `302` or a `401` status code depending on configuration.
- Authenticated call with valid access token returns `200` and workflow executes.
- Call with wrong audience or tenant returns `401`.
- Call with expired token returns `401`.

### Test and validate authentication

Use a REST client (curl, Postman, VS Code REST, or Azure CLI) to confirm enforcement:

1. Get the base HTTPS endpoint for your workflow trigger (for example, **Request** trigger callback minus the SAS query string if you plan to rely purely on Easy Auth).
1. Send an unauthenticated GET/POST request. Expect `302` or a `401` status code depending on configuration.
1. Acquire a token (authorization code w/PKCE or client credentials) for the app registration’s Application (client) ID with the resource/audience `api://<app-id>` or the default App Service resource as configured.
1. Send the same request with header: `Authorization: Bearer <access_token>`.
1. Confirm `200 OK` and workflow run appears in monitoring.
1. Tamper with the token (edit a character) and resend. Expect `401`.
1. Wait past token expiration (or change system clock in a test container) and resend. Expect `401`.

Troubleshooting tips:
- `401` with `invalid_token` + `error_description` referencing audience: mismatch between token audience and configured allowed audiences.
- `403` might indicate downstream workflow action authorization, not the Easy Auth layer.
- Missing claims: ensure they’re present in the access token (not only the ID token) and that you requested the appropriate scope/role.

### Use identity claims in a workflow

When Easy Auth validates a request, it injects identity data into headers and an encoded principal object:

- `X-MS-CLIENT-PRINCIPAL-ID` – Object ID of the user/service principal.
- `X-MS-CLIENT-PRINCIPAL-NAME` – UPN or service principal name.
- `X-MS-CLIENT-PRINCIPAL` – Base64-encoded JSON array with claim objects (`typ`, `val`).
- `X-MS-TOKEN-AAD-ACCESS-TOKEN` – (Optional) Raw access token if token store is enabled and allowed.

To parse claims inside a workflow:

1. Add a **Compose** action.
1. In the **Inputs**, use: `@base64ToString(triggerOutputs()['headers']['x-ms-client-principal'])`
1. Save and run with an authenticated call.
1. The output is JSON you can further parse with **Parse JSON** to extract roles or scopes.

Common authorization patterns:
- Check role: condition on `@contains(string(body('Compose')), 'LogicApp.Execute')`.
- Check scope: parse the `scp` claim from the decoded JSON.
- Enforce tenant: validate `tid` claim matches expected tenant GUID.

Avoid storing or logging entire tokens. Use claims only and redact sensitive values in diagnostic logs.

## Default auth through developer key

For testing and other non-production scenarios only, the portal provides a “developer key” mechanism that lets the Azure portal invoke your workflow without you manually configuring Easy Auth or supplying a signed trigger callback URL (SAS). The portal injects this key automatically when you use built‑in test experiences (for example, running a workflow or calling a request trigger from the designer). The association is derived from your current Azure Resource Manager (ARM) bearer token (user + tenant context); you don’t distribute this key externally.

### What it is

- A convenience authentication path used only by the Azure portal UX to call your logic app while you’re designing or quickly testing.
- Bound implicitly to the signed-in portal user/tenant session; not intended for programmatic or CI/CD usage.
- Bypasses the need to copy SAS URLs or stand up Easy Auth during early experimentation.

### What it is NOT

- Not a substitute for Easy Auth, managed identity, federated credentials, or signed callback URLs in production.
- Not a per-end-user authorization mechanism (no granular scopes/roles).
- Not designed for large or untrusted caller populations, agent tooling, or automation clients.
- Not governed by Conditional Access at the request execution layer (only at the portal sign‑in layer).

### Appropriate use cases

- Quick designer testing before formalizing authentication.
- Verifying workflow shape, bindings, or basic trigger/action wiring.
- Temporary sandbox or spike prototypes that will later adopt Easy Auth or SAS URL hardening.

### Avoid using when

- External agents, MCP servers, or conversational clients will call the workflow.
- You need auditable per-caller identity, token revocation, Conditional Access, or least‑privilege enforcement.
- You plan to publish the endpoint outside your tenant.
- You require deterministic automation (use service principal + Easy Auth or SAS instead).

### Security & operational limitations

| Aspect | Developer key | Easy Auth |
| ------ | ------------- | --------- |
| Per-request identity | Portal user context only (implicit) | Validated token claims (user / service principal / managed identity) |
| Conditional Access enforcement | Indirect (portal sign‑in only) | Direct (token issuance + policy) |
| Revocation | Revoke portal session / user; no granular key rotation | Standard token revocation, role/scope removal |
| Audit richness | Limited to workflow run + portal user | Full identity claim surface |

### Migration path to production auth

1. Enable Easy Auth on the logic app (Microsoft Entra ID provider).
2. Acquire and test real access tokens (auth code + PKCE, client credentials, or managed identity).
3. Remove reliance on developer key by testing endpoints from external tools with valid tokens or signed SAS callback URLs.
4. (Optional) Lock down triggers: disable or regenerate any unused SAS URLs; enforce auth-only access patterns.

### Troubleshooting notes

| Symptom | Likely cause | Action |
| ------- | ------------ | ------ |
| Portal test works; external curl 401 | External call lacks SAS or Easy Auth token | Configure Easy Auth or use signed trigger URL |
| Works in designer; fails in APIM | APIM call missing expected auth header | Add OAuth 2.0 token acquisition in APIM policy or use MSI |
| Inconsistent access after role change | Portal cached session | Re-login or acquire fresh token |

### Recommendation

Treat the developer key strictly as a local design-time convenience. Move to Easy Auth (or SAS + network restrictions) before exposing the workflow to agents, automation, or broader user populations.

> Summary: If anyone or anything outside your own portal session needs to call the logic app, the developer key is no longer appropriate — enable Easy Auth or use managed identity–based flows instead.

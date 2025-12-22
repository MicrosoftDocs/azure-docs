---
title: Protect Agent Workflows with Easy Auth
description: Learn to set up conversational agent workflows with App Service Authentication (Easy Auth) in Azure Logic Apps.
author: ecfan
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, divswa, edwardyhe, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 10/08/2025
ms.update-cycle: 180-days
#Customer intent: As an integration and AI developer working with Azure Logic Apps, I want to secure access to my conversational agent workflow and external chat client by authenticating and authorizing users through Easy Auth.
---

# Secure conversational agent workflows with Easy Auth (App Service Authentication) in Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Agent workflows expand integration options because they can exchange messages with more diverse callers, such as people, agents, Model Context Protocol (MCP) servers and clients, tool brokers, and external services. While nonagent workflows interact with a small, known, and fixed set of callers, agent callers can come from dynamic, unknown, and untrusted networks. As a result, you must authenticate and enforce permissions for each caller.

To help protect conversational agent workflows in production, set up Easy Auth to authenticate and authorize callers or people who want to interact with your conversational agent. Easy Auth, also known as App Service Authentication, provides following capabilities for you to use:

- Provide a validated identity for each caller request.
- Assign connections to each user.
- Enforce Conditional Access policies.
- Issue revocable credentials.
- Grant permissions based on least-privilege principles, [roles](/entra/identity-platform/developer-glossary#roles), and [scopes](/entra/identity-platform/developer-glossary#scopes).
- Provide an external chat client outside the Azure portal so people can interact with your conversational agent.

These measures let you authenticate and authorize each caller at a fine-grained level and revoke access quickly when needed. Without these controls, you risk uncontrolled access, leaked secrets such as shared access signature (SAS) URLs and access keys, weak audit trails, and other security hazards.

Easy Auth works with Microsoft Entra ID as a separate security layer to provide built-in authentication and authorization capabilities that meet your needs. With security enforcement operating outside your workflow, you can focus more on developing the business logic instead. This separation of concerns makes agent workflows simpler and easier to build, debug, operate, monitor, maintain, govern, and audit.

Nonagent workflow security usually involves static SAS, rotating secrets, and network boundary controls like access restrictions, IP allowlists, service tags, virtual network integration, and private endpoints. With agent workflows, you design authorization around end users, managed identities, service principals, and their scopes and roles. This approach enables safer global reach but still allows downstream workflow actions to respect fine-grained permissions.

This guide shows how to create an app registration and then set up Easy Auth for your Standard logic app resource, which can contain agent and nonagent workflows.

> [!IMPORTANT]
>
> Easy Auth stores configuration information in your logic app resource's underlying app settings, for example, 
> **WEBSITE_AUTH_ENABLED**, **WEBSITE_AUTH_DEFAULT_PROVIDER**, and **MICROSOFT_PROVIDER_AUTHENTICATION_SECRET**. 
> Don't manually edit these settings unless you want to set up automation using ARM templates, Bicep templates, or Terraform templates.

For more information, see the following articles:

- [Built-in authentication and authorization with Easy Auth for agent workflows](agent-workflows-concepts.md#easy-auth)
- [Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app)

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Microsoft Entra [**Application Developer** built-in role](/entra/identity/role-based-access-control/permissions-reference#application-developer) on your Azure account to create an app registration.

- A deployed Standard logic app resource with a conversational agent workflow.

  For more information, see [Create conversational agent workflows for chat interactions in Azure Logic Apps](create-conversational-agent-workflows.md).

- Azure [**Contributor** role](/azure/role-based-access-control/built-in-roles#contributor) or higher on the logic app resource with permission to create app registrations for the target tenant using Microsoft Entra.

  > [!IMPORTANT]
  >
  > To set up Easy Auth, make sure you have the higher-level Azure **Contributor** role, which differs from the **Logic Apps Standard Contributor** role.

- (Optional) Choose whether to support only user flows with interactive sign in or also callers that use a managed identity or service principal.

  For more information, see [Authentication and authorization in Azure App Service and Azure Functions](../app-service/overview-authentication-authorization.md).

- (Optional) A custom domain if you want to enforce specific [redirect URIs](/entra/identity-platform/reply-url#what-is-a-redirect-uri) for that domain.

## Create an app registration

For the best way to begin Easy Auth setup, create a new app registration in Microsoft Entra ID directly from your logic app resource. If you have to reuse an existing app registration instead, you must [update the app registration](#update-an-existing-app-registration) to cleanly work with Easy Auth and Azure clients.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar menu, under **Settings**, select **Authentication**.

1. On the **Authentication** page, select **Add identity provider**.

   :::image type="content" source="media/set-up-authentication-agent-workflows/add-identity-provider.png" alt-text="Screenshot shows Standard logic app with Authentication page open." lightbox="media/set-up-authentication-agent-workflows/add-identity-provider.png":::

   The **Authentication** page now shows the **Basics** tab for setting up the identity provider.

1. On the **Basics** tab, for **Identity provider**, select **Microsoft** for Microsoft Entra ID.

1. In the **App registration** section, for **App registration type**, select **(Recommended for Conversational agents) Create new app registration**, which shows the corresponding options for this selection.

1. Provide a unique display name for your app registration, for example: `agent-logic-app-reg-prod`

1. For **User-assigned managed identity**, select **Create new user-assigned managed identity**.

   You can create a new identity by providing a name or select an existing identity.

1. For **Supported account types**, select **Current tenant - Single tenant** unless you want to intentionally accept other tenants.

   The single-tenant setting refers to accounts only in the current organizational directory. So, all user and guest accounts in this directory can use your application or API. For example, if your target audience is internal to your organization, use this setting.

   The following example shows how an app registration might look:

   :::image type="content" source="media/set-up-authentication-agent-workflows/identity-provider-basics.png" alt-text="Screenshot shows app registration basic information." lightbox="media/set-up-authentication-agent-workflows/identity-provider-basics.png":::

   > [!IMPORTANT]
   >
   > Unless you have explicit governance and Conditional Access policies 
   > set up, don't choose **Any Microsoft Entra directory - Multitenant**.

   For more information, see the following articles:

   - [Azure governance overview](/azure/cloud-adoption-framework/ready/landing-zone/design-area/governance)
   - [Set up governance in Azure](/azure/cloud-adoption-framework/ready/azure-setup-guide/govern-org-compliance)
   - [What is Conditional Access](/entra/identity/conditional-access/overview)?

1. Under **Additional checks**, select the following values if not already selected:

   | Setting | Value |
   |---------|-------|
   | **Client application requirement** | **Allow requests only from this application itself** |
   | **Identity requirement** | **Allow requests from specific identities** |
   | **Allowed identities** | Appears only with **Allow requests from specific identities** selected. <br><br>The default prepopulated value is the object ID that represents the current user, namely yourself. You can update this value in the following ways: <br><br>- Include object IDs for other developers or users. <br>- Use group claims to include a specific group, rather than individual object IDs. <br>- Select an existing app registration for your logic app resource. If you do, make sure to [update the app registration](#update-an-existing-app-registration) to work cleanly with Easy Auth. <br><br>For more information, see [Use a built-in authorization policy](../app-service/configure-authentication-provider-aad.md?tabs=workforce-configuration#use-a-built-in-authorization-policy). |
   | **Tenant requirement** | **Allow requests only from the issuer tenant** |

1. Skip the **Excluded paths** section.

1. Optionally, under **App Service authentication settings**, review the following settings and take the appropriate actions:

   | Setting | Action |
   |---------|--------|
   | **Restrict access** | Unless you plan to allow some authenticated endpoints, select **Require authentication** to block all anonymous requests. |
   | **Unauthenticated requests** | Based on whether callers are agent or agent-based, select **HTTP 302 Found redirect: recommended for agents**. |

1. When you're done, select **Add** to finish adding the identity provider.

   Azure creates the app registration, updates your app settings, and enables the Easy Auth runtime. When Azure finishes, the logic app **Authentication** page lists **Microsoft** as an identity provider. Clients and callers must now authenticate their identities. Your logic app rejects unauthenticated clients and callers as intended and issues a **302 Found redirect** response or a **401 Unauthorized** response when requests don't include valid tokens.

   After you finish creating the app registration, keep your logic app setup as minimal as possible until after you can confirm that authentication works as expected. You can later add any permission scopes or app roles that you want to enforce by going to the following pages on your app registration resource:

   - On your app registration sidebar, under **Manage**, select **Expose an API** to add a permission scope. For more information, see [Add a scope](/entra/identity-platform/quickstart-configure-app-expose-web-apis#add-a-scope).

   - On your app registration sidebar, under **Manage**, select **App roles** to assign an app role. For more information, see [Assign app role](/entra/identity-platform/quickstart-configure-app-expose-web-apis#assign-app-role).

   Or, you can review the corresponding steps in the next section, [Update an existing app registration](#update-an-existing-app-registration).

1. To check that your app registration is correctly set up, see [Test and validate Easy Auth setup](#test-and-validate-easy-auth-setup).

## Update an existing app registration

If you have to reuse an existing app registration that is shared with another API or an earlier prototype, follow these steps to review and adjust the specified settings so the app registration can cleanly work with Easy Auth and agent clients.

1. In the Azure portal search box, find and select **Microsoft Entra ID**.

1. On the sidebar menu, under **Manage**, select **App registrations**, and then find and select your app registration.

1. On the app registration sidebar menu, expand **Manage**.

1. Under **Manage**, select **Branding & properties**, and confirm that the **Home page URL** setting specifies your logic app's website URL.

   > [!NOTE]
   >
   > **Home page URL** is optional for backend-only or agent APIs. Set this value only if 
   > end users need a landing or documentation page. Token redirects don't use this value.

1. Under **Manage**, select **Authentication**.

   1. Under **Platform configurations**, make sure that the **Web** entry exists.

   1. In the **Web** entry, under **Redirect URIs**, find the prepopulated Easy Auth (App Service Authentication) callback URI, which follows this syntax:

      `https://<logic-app-name>.azurewebsites.net/.auth/login/aad/callback`

      Keep this default value unless your scenario needs you to expose custom API application IDs. This callback URI is the default [access token *audience*](/entra/identity-platform/access-tokens#token-ownership) and specifies which resources can accept access tokens from clients that want access to these resources.
      
      The purpose behind an allowed token audience is to honor only the requests that present valid tokens for these resources. An access token request involves two parties: the client that requests the token and the resource that accepts the token. The recipient is known as the token "audience", which is your logic app in this case.

      For more information, see [What is a redirect URI?](/entra/identity-platform/reply-url#what-is-a-redirect-uri)

   1. If Azure doesn't prepopulate the **Redirect URIs** setting, manually enter the URI with your logic app name, for example:

      `https://my-chatbox-logic-app.azurewebsites.net/.auth/login/aad/callback`

      > [!IMPORTANT]
      >
      > Don't use custom redirect URIs unless you're hosting an interactive front end.

   1. Disregard the **Front-channel logout URL** setting.

   1. For **Implicit grant and hybrid flows**, select both of the following options:

      - **Access tokens (used for implicit flows)**
      - **ID tokens (used for implicit and hybrid flows)**

      For more information, see the following documentation:

      - [Microsoft identity platform and OAuth 2.0 implicit grant flow](/entra/identity-platform/v2-oauth2-implicit-grant-flow)
      - [Request an ID token (hybrid flow)](/entra/identity-platform/v2-oauth2-auth-code-flow#request-an-id-token-as-well-or-hybrid-flow)

   1. Under **Supported account types**, select the option that matches your business need.

      In most cases, choose **Accounts in this organizational directory only (Microsoft only - Single tenant)**. For the multitenant option, make sure you have explicit Azure governance and Conditional Access policies set up. For more information about these options, see [Validation differences by supported account types](/entra/identity-platform/supported-accounts-validation).

   1. Under **Advanced settings**, for **Allow public client flows**, keep the **No** setting for enabling the specified mobile and desktop flows.

      The exception exists when native, public clients must avoid the [Resource Owner Password Credentials (ROPC) flow](/entra/identity-platform/v2-oauth-ropc) using device or authentication code.

   1. When you finish, select **Save**.

1. Under **Manage**, select **Certificates & secrets**. On the **Federated credentials** tab, set up a new user-assigned managed identity that has logic app access so you can [use the managed identity as a federated identity credential on your app registration](/entra/workload-id/workload-identity-federation-config-app-trust-managed-identity).

   If you don't have a user-assigned managed identity with logic app access, follow these steps:

   1. [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/manage-user-assigned-managed-identities-azure-portal).
   1. [Add the user-assigned identity to your logic app](authenticate-with-managed-identity.md?tabs=standard#add-user-assigned-identity-to-logic-app-in-the-azure-portal).
   1. [Set up the user-assigned identity as a federated identity credential on your app registration](/entra/workload-id/workload-identity-federation-config-app-trust-managed-identity).

1. Optionally, if you need to set up [claims](/entra/identity-platform/developer-glossary#claim) such as roles, scopes, user groups, or [`XMS_CC`](/entra/identity-platform/claims-challenge?tabs=dotnet#receiving-xms_cc-claim-in-an-access-token), follow these steps:

   1. Under **Manage**, select **Token configuration**.

   1. In the **Optional claims** section, add your claims.

      > [!NOTE]
      >
      > To avoid token bloat, set up role or scope checks, rather than large group claims.

1. Under **Manage**, select **API permissions**, and follow these steps:

   1. Under **Configured permissions**, select **Add a permission**.
   1. On the **Request API permissions** pane, on the **Microsoft APIs** tab, find and select **Microsoft Graph**.
   1. For the permissions type, select **Delegated permissions**.
   1. In the **Select permissions** box, enter **`User.Read`**.
   1. In the **Permission** column, expand **User**, and select the **User.Read** permission.

   For more information, see [Add permissions to access Microsoft Graph](/entra/identity-platform/quickstart-configure-app-access-web-apis#add-permissions-to-access-microsoft-graph).

1. Optionally, under **Manage**, select **Expose an API**, so you can define and expose permission scopes.

   For the **Application ID URI** setting, the prepopulated URI is a unique identifier that represents your logic app resource as the audience in access tokens and uses the following format:

   `api://<application-client-ID>`

   In the **Scopes defined by this API** section, if you want to rely only on validating roles and audience, you don't have to define or expose any permission scopes. However, if you want Azure clients to request delegated permissions, define these scopes by following these steps:

   1. Select **Add a scope** and provide the following information:

      | Setting | Required | Value |
      |---------|----------|-------|
      | **Scope name** | Yes | `user_impersonation` |
      | **Who can consent** | Yes | **Admins and users** |
      | **Admin consent display name** | Yes | Label or name for permission scope that the consent message shows when tenant administrators provide consent for the scope. <br><br>For example: <br>**Access \<logic-app-name\>** |
      | **Admin consent definition** | Yes | Detailed description for the permission scope that the consent screen shows when tenant administrators expand the scope on the consent screen. <br><br>For example: <br>**Allow the application to access \<logic-app-name\> on behalf of the signed-in user.** |
      | **User consent display name** | No | Optional name for the Permission scope that the consent screen shows when end users provide consent for this scope. <br><br>For example: <br>**Access <logic-app-name\>** |
      | **User consent definition** | No | Optional detailed description for the permission scope that the consent screen shows when end users expand the scope on the consent screen. <br><br>For example: <br>**Allow the application to access \<logic-app-name\> on your behalf.** |
      | **State** | Yes | **Enabled** |

   1. When you finish, select **Add scope**.

   1. In the **Scopes** list, review the updated scope settings to confirm that they appear as expected.

1. When you finish updating your app registration, go to your Standard logic app resource.

1. On the logic app sidebar, under **Settings**, select **Authentication**.

1. On the **Authentication** page, next to **Authentication settings**, select **Edit** to review the settings. On the **Edit authentication settings** pane, confirm the following values:

  | Setting | Value | Description |
  |---------|-------|-------------|
  | **App Service authentication** | **Enabled** | Your logic app is set up and enabled with Easy Auth. |
  | **Restrict access** | **Require authentication** | Clients and callers must authenticate their identities. |
  | **Unauthenticated requests** | Yes | Your logic app rejects unauthenticated clients and callers as intended and issues a **302 Found redirect** response or a **401 Unauthorized** response when requests don't include valid tokens. |

<a name="external-chat-client"></a>

## Test and validate Easy Auth setup

After you set up Easy Auth, the internal chat interface on your workflow's **Chat** page in the Azure portal becomes unavailable. Instead, you must interact with your conversational agent by using the external chat client that is available outside the Azure portal. To confirm that Easy Auth works as expected, perform your testing in the external chat client by following these steps:

1. On the designer toolbar or the workflow sidebar, select **Chat**.

   The internal chat interface no longer appears on the **Chat** page.

1. In the **Essentials** section, select the **Chat Client URL** link, which opens a new browser tab.

1. At the permissions request prompt, provide your consent, and accept the request.

   :::image type="content" source="media/set-up-authentication-agent-workflows/consent.png" alt-text="Screenshot shows permissions request consent prompt." lightbox="media/set-up-authentication-agent-workflows/consent.png":::

   The browser page refreshes and shows the interface for the external chat client.

   > [!TIP]
   >
   > You can also embed the chat client URL in an [*iFrame* HTML element](https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/iframe) that you can use with your website where you want to provide the chat client, for example:
   >
   > `<iframe src="https:/<logic-app-name>.azurewebsites.net/api/agentsChat/<workflow-name>/IFrame" title="<chat-client-name>"></iframe>`

1. In the external chat interface, start or continue to interact with your conversational agent.

1. To review your workflow's run history, follow these steps:

   1. Return to the workflow in the Azure portal.

   1. On the workflow sidebar, under **Tools**, select **Run history**, and then select the latest workflow run.

   1. In the monitoring view, confirm that the run history and operation statuses appear as expected.

### Troubleshoot errors during Easy Auth testing

The following table describes common problems you might encounter when you set up Easy Auth, possible causes, and actions you can take:

| Problem or error | Likely cause | Action |
|------------------|--------------|--------|
| **401** with **`invalid_token`** + **`error_description`** that references the audience | A mismatch exists between the access token audience and the specified allowed token audiences. | Make sure that the access token audience and the allowed token audience match. |
| **403 Forbidden** | Might indicate that the workflow or agent for the request wasn't found. | Check the actions in your workflow for an authorization problem. |

## Use an identity in workflow

When Easy Auth validates a request, Easy Auth injects identity data into request headers based on the identity provider. Your logic app uses these headers to authenticate the caller.

For more information, see the following articles:

- [OAuth tokens for App Service](../app-service/configure-authentication-oauth-tokens.md)
- [Tutorial: Authenticate and authorize users end-to-end in Azure App Service](../app-service/tutorial-auth-aad.md)

## Related content

- [Authentication and authorization in AI agent workflows](agent-workflows-concepts.md#authentication-and-authorization)

---
title: Secure OpenAPI tool calls from Foundry Agent Service
description: Configure Microsoft Entra authentication to secure Microsoft Foundry tool calls with managed identity, step by step.
ms.topic: how-to
ms.date: 08/25/2026
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Secure OpenAPI tool calls from Foundry Agent Service

Foundry Agent Service can call an App Service OpenAPI endpoint anonymously or with managed identity. Use managed identity when App Service authentication protects the endpoint.

This scenario contains two independent managed identity directions:

- When App Service calls Foundry, the caller is the App Service system-assigned managed identity. Azure role-based access control (RBAC) on the Foundry resource or project authorizes the call.
- When Foundry calls the App Service OpenAPI endpoint, the caller is the parent Foundry resource system-assigned managed identity. App Service authentication token validation and allow lists authorize the call.

The App Service authentication Microsoft Entra application is the protected API resource. It doesn't replace either calling managed identity.

The following table summarizes the identities and applications in this scenario.

| Identity or application | Purpose | Configuration |
| --- | --- | --- |
| App Service authentication Microsoft Entra application | Protected web/API resource and browser sign-in | Application ID URI, redirect URI, token audiences |
| App Service system-assigned identity | App Service calls Foundry | Azure RBAC on Foundry |
| App Service authentication user-assigned identity (optional) | Secretless App Service authentication client assertion | Federated identity credential |
| Parent Foundry resource system-assigned identity | Foundry OpenAPI tool calls App Service | Allowed client application and optional allowed identity |
| Foundry project identity | Project-level Foundry operations | Not used for the OpenAPI HTTP call |

## Prerequisites

- An App Service app with OpenAPI endpoints. If you need to add OpenAPI functionality to your app, see one of the following tutorials:
  - [Add an App Service app as a tool in Foundry Agent Service (.NET)](tutorial-ai-integrate-azure-ai-agent-dotnet.md)
  - [Add an App Service app as a tool in Foundry Agent Service (Java)](tutorial-ai-integrate-azure-ai-agent-java.md)
  - [Add an App Service app as a tool in Foundry Agent Service (Python)](tutorial-ai-integrate-azure-ai-agent-python.md)
  - [Add an App Service app as a tool in Foundry Agent Service (Node.js)](tutorial-ai-integrate-azure-ai-agent-node.md)

- A Microsoft Foundry project where you add your app as an OpenAPI tool.

## Find the parent Foundry resource's managed identity IDs

Foundry Agent Service uses the **parent Foundry resource's** system-assigned managed identity when it calls an OpenAPI tool. It doesn't use the Foundry project's managed identity for this request.

You need two identifiers for the parent resource identity:

- **Application ID (client ID):** Appears in the access token's `azp` claim and is used for the App Service authentication allowed client application check.
- **Object (principal) ID:** Appears in the token's `oid` claim and is used when App Service authentication restricts access to specific identities.

1. In the [Foundry portal](https://ai.azure.com), open your project, and then select **Manage** in the top menu.

1. Select the parent resource in **Project details**, and then select **Open in Azure portal**.

1. In the Foundry resource's left menu, select **Resource Management** > **Identity**.

1. Under **System assigned**, copy the value of **Object (principal) ID** for later.

1. In the Azure portal, search for and select **Microsoft Entra ID**.

1. In the search box, search for the object ID you copied and select it in the search results.

1. On the **Overview** page, copy the value of **Application ID**. 

    The **Object ID** is the same as the one shown for the system-assigned managed identity. Save both the application ID and the object ID for configuring App Service authentication.

## Configure Microsoft Entra authentication for your app

1. In the Azure portal, navigate to your App Service app.

1. On your app's left menu, select **Settings** > **Authentication**, and then select **Add identity provider**.

1. On the **Add an identity provider** page, select **Microsoft** as the **Identity provider** to create a new app registration.

1. For **Restrict access**, select **Require authentication**.

1. Under **Additional checks**, for **Client application requirement**, select **Allow requests from specific client applications**.

1. Select the pencil icon and configure the allowed client applications:

   - Add the **application ID** that you copied in [Find the parent Foundry resource's managed identity IDs](#find-the-parent-foundry-resources-managed-identity-ids). This ID allows tokens requested by the parent Foundry resource identity.
   - If the app supports interactive browser sign-in, also add the App Service authentication Microsoft Entra application's own application (client) ID. This ID allows tokens issued to the web application during user sign-in. If you're creating a new app registration, add this ID after you create the identity provider.

1. Configure **Identity requirement**:

   - For the narrowest policy on an endpoint called only by Foundry, select **Allow requests from specific identities**. Select the pencil icon and add the parent Foundry resource identity's **object ID**.
   - If the app also supports interactive browser sign-in, select **Allow requests from any identity** so that tenant users aren't blocked. This setting doesn't allow anonymous access. Requests must still contain a valid token from an allowed client application and the configured tenant.

1. For **Tenant requirement**, select **Allow requests only from the issuer tenant**. The parent Foundry resource identity and any users who sign in must be in this tenant.

1. Configure **Unauthenticated requests**:

   - If the app serves only API clients, select **HTTP 401 Unauthorized: recommended for APIs**.
   - If the app supports interactive browser sign-in, select **HTTP 302 Found redirect**, and then select **Microsoft** as the redirect provider.

1. Select **Add** to create the identity provider.

   The following image shows the narrowest Foundry-only configuration.

   :::image type="content" source="media/configure-authentication-ai-foundry-openapi-tool/entra-auth-configuration.png" alt-text="Screenshot showing the configuration of a new Microsoft authentication provider in the App Service.":::

1. If the app supports interactive browser sign-in, edit the provider and ensure the **Token store** is enabled. If you created a new app registration, add its application ID to the allowed client applications.

You need both application IDs when the app supports interactive browser sign-in. A Foundry-only API requires only the parent Foundry resource identity's application ID.

## Update the app registration Application ID URI

An Application ID URI identifies the protected API as an OAuth resource. For a managed identity OpenAPI tool, the audience must exactly match an Application ID URI registered on the App Service authentication Microsoft Entra application. Foundry uses that value as the audience when it requests an access token with the parent Foundry resource identity.

The **Application ID** and **Application ID URI** are different properties:

- The **Application ID**, also called the client ID, is a generated GUID.
- An **Application ID URI** is a URI that identifies an API or resource owned by the application. It doesn't have to contain the application client ID.

Choose a stable Application ID URI and treat it as part of the API contract:

| Format | Good fit | Considerations |
| --- | --- | --- |
| `api://<client-id>` | Reusable Microsoft Entra-protected API with many clients or deployment slots | Conventional and host-independent, but the generated client ID can require a second step in declarative provisioning. |
| `https://<app>.azurewebsites.net` | App Service-specific integration and one-pass Bicep | Easy to calculate and matches this guide, but couples the API identity to the App Service hostname. Each deployment slot has a different hostname. |
| `api://<tenant-id>/<logical-name>` | Host-independent, predictable declarative API identity | Stable and tenant-qualified, but clients must be given the identifier explicitly. |

The URI must be valid, unique in the tenant, and accepted by the tenant's Application ID URI policy. A plain string such as `some-random-string` isn't a valid Application ID URI.

This guide uses the full HTTPS App Service URL:

```text
https://<app-name>.azurewebsites.net
```

1. After the Microsoft provider configuration completes, select it in the **Identity provider** column to open the app registration page.

1. In the left menu, select **Manage** > **Expose an API**.

1. Next to **Application ID URI**, select **Edit**.

1. Change the value to your App Service app's full HTTPS URL, such as `https://<app-name>.azurewebsites.net`.

    You can find the app's hostname on the **Overview** page in **Default domain**.

1. For a new app registration, ensure **Access token version** is set to **2**.

1. Select **Save**.

> [!WARNING]
> If you delete your App Service app, you must also delete the app registration and clean up any authentication resources that reference the Application ID URI. Microsoft Entra applications are tenant resources and aren't deleted with the App Service resource group. Failing to remove the registration creates a security vulnerability: if someone else creates an app with the same URL, they could potentially gain unauthorized access to resources that trust the orphaned app registration.

Changing the Application ID URI later requires updating the Foundry tool audience and every other client that requests tokens for the API.

The corresponding OpenAPI tool authentication configuration is:

```json
{
  "type": "managed_identity",
  "security_scheme": {
    "audience": "https://<app-name>.azurewebsites.net"
  }
}
```

You don't need to list the tool audience under **Allowed token audiences**. App Service authentication recognizes resource identifiers that you register on its Microsoft Entra application. Conversely, adding a value only to **Allowed token audiences** doesn't register an OAuth resource or enable Microsoft Entra to issue a token for it.

Don't use the Foundry project endpoint or the App Service client ID as the audience unless you also configure that exact value as the Application ID URI. Other valid Application ID URI formats, including `api://` URIs, work when the registered value and audience match exactly. For related edge cases, see [Frequently asked questions](#frequently-asked-questions).

## Configure the protected API declaratively

Use Bicep to configure the protected API and the App Service authentication policy. The following pattern assumes:

- `webApp` is the App Service resource.
- `entraApp` is a module that creates the App Service authentication Microsoft Entra application.
- `foundryAccountClientId` is the parent Foundry resource identity's application ID.
- `appServiceAuthCredentialSettingName` is the name of the app setting that contains the existing App Service authentication client secret.

In the Microsoft Graph Bicep application module, configure the App Service URL as the identifier URI and request version 2 access tokens:

```bicep
extension microsoftGraphV1

param environmentName string
param appServiceUrl string

resource app 'Microsoft.Graph/applications@v1.0' = {
  uniqueName: 'my-app-${environmentName}'
  displayName: 'My app (${environmentName})'
  signInAudience: 'AzureADMyOrg'
  identifierUris: [
    appServiceUrl
  ]
  api: {
    requestedAccessTokenVersion: 2
  }
  web: {
    homePageUrl: appServiceUrl
    redirectUris: [
      '${appServiceUrl}/.auth/login/aad/callback'
    ]
  }
}

output clientId string = app.appId
output webAppUrl string = appServiceUrl
```

The following `authsettingsV2` example allows both interactive browser sign-in and Foundry OpenAPI calls:

```bicep
@description('Parent Foundry resource identity application ID')
param foundryAccountClientId string = ''

resource webAppAuthSettings 'Microsoft.Web/sites/config@2024-11-01' = {
  name: '${webApp.name}/authsettingsV2'
  properties: {
    platform: {
      enabled: true
    }
    globalValidation: {
      requireAuthentication: true
      unauthenticatedClientAction: 'RedirectToLoginPage'
      redirectToProvider: 'azureActiveDirectory'
    }
    identityProviders: {
      azureActiveDirectory: {
        enabled: true
        registration: {
          clientId: entraApp.outputs.clientId
          clientSecretSettingName: appServiceAuthCredentialSettingName
          openIdIssuer: 'https://login.microsoftonline.com/${tenant().tenantId}/v2.0'
        }
        validation: {
          allowedAudiences: [
            'api://${entraApp.outputs.clientId}'
          ]
          defaultAuthorizationPolicy: {
            allowedApplications: concat(
              [
                entraApp.outputs.clientId
              ],
              empty(foundryAccountClientId) ? [] : [foundryAccountClientId]
            )
            allowedPrincipals: {}
          }
        }
      }
    }
    login: {
      tokenStore: {
        enabled: true
      }
    }
    httpSettings: {
      requireHttps: true
    }
  }
}
```

Pass the Foundry resource identity application ID through Azure Developer CLI (AZD):

```json
{
  "foundryAccountClientId": {
    "value": "${AZURE_AI_FOUNDRY_ACCOUNT_CLIENT_ID=}"
  }
}
```

Then configure the environment and redeploy:

```azurecli
azd env set AZURE_AI_FOUNDRY_ACCOUNT_CLIENT_ID <application-id>
azd provision
```

> [!NOTE]
> If App Service authentication uses a client secret, keep the existing secret setting. For a fully declarative secretless deployment, App Service authentication can use a user-assigned managed identity with a federated identity credential. That credential is separate from the parent Foundry resource identity used to call the OpenAPI endpoint.

## Configure the OpenAPI tool in Microsoft Foundry

> [!NOTE]
> This section assumes you already completed one of the tutorials in the [Prerequisites](#prerequisites) section, where you added your app as an OpenAPI tool in Microsoft Foundry using anonymous authentication. You now update the tool to use managed identity authentication.

1. Back in the [Foundry portal](https://ai.azure.com), select your agent.

1. Find the OpenAPI tool and select **...** > **Edit**.

1. Verify that the **OpenAPI 3.0+ schema** box contains the schema from your App Service app. If it doesn't, paste in your OpenAPI schema. For more information, see [How to use OpenAPI with Foundry Agent Service](/azure/ai-services/agents/how-to/tools/openapi-spec).

1. For **Authentication method**, select **Managed identity**.

1. For **Audience**, enter the **Application ID URI** that you configured earlier. For the configuration in this guide, use the full HTTPS URL for your App Service app, such as `https://<app-name>.azurewebsites.net`. The values must match exactly.

1. Select **Update tool**.

> [!TIP]
> Foundry Agent Service uses the parent Foundry resource's system-assigned managed identity to authenticate with your app. For a Foundry-only policy, the application ID authorizes the client application and the object ID authorizes the identity. If the app supports interactive browser sign-in, its own application ID also authorizes user sign-in tokens and the policy allows any identity from the configured tenant.

## Test the agent

1. In the Foundry portal, select your agent and select **Try in playground**.

1. Chat with the agent to test your OpenAPI endpoints. For example:

   - Show me all the tasks.
   - Create a task called "Buy groceries."
   - Update that task to "Buy groceries and cook dinner."

If you configure authentication correctly, the agent calls your app's APIs through the OpenAPI tool.

## Frequently asked questions

### Why can I save the OpenAPI tool before configuring App Service authorization?

When you save an OpenAPI tool, Foundry validates its schema, audience format, and definition. It doesn't call the App Service endpoint. You can therefore save the tool before you add the parent Foundry resource identity to the App Service allow list.

Configure the allow list before you invoke the tool in the playground or at runtime. Until then, App Service rejects tool calls.

### Why does the default `api://<client-id>` audience sometimes fail?

The App Service portal commonly creates a Microsoft Entra application with `api://<application-client-id>` as its Application ID URI. In that case, Foundry can use the same value as its audience.

Custom or declarative provisioning can leave the Microsoft Entra application's `identifierUris` collection empty even when App Service authentication displays `api://<client-id>` under **Allowed token audiences**. In that state, Foundry can't obtain a managed identity token for the value because it isn't a registered resource identifier.

To fix the issue, use one of these options:

- Register `api://<client-id>` as the Application ID URI and use it as the Foundry audience.
- Register the App Service HTTPS URL as the Application ID URI and use that URL as the Foundry audience.

Don't fix the mismatch by adding arbitrary strings to `allowedAudiences`.

### Can App Service authentication work without an Application ID URI?

Interactive browser sign-in can work without an Application ID URI because the browser flow uses an ID token for the web application's client ID.

The Foundry managed identity OpenAPI flow needs an access token for a registered API resource. For this flow, configure an Application ID URI and use the same value as the tool audience.

## Troubleshoot authentication and authorization

### The OpenAPI tool receives HTTP 401

An HTTP 401 response means App Service authentication couldn't authenticate the request. Likely causes include:

- You didn't select managed identity for the OpenAPI tool.
- The audience doesn't exactly match the Microsoft Entra Application ID URI.
- The token issuer or tenant doesn't match App Service authentication.
- You didn't configure the Application ID URI on the Microsoft Entra application.

Verify that the OpenAPI audience exactly matches a registered Application ID URI. For the configuration in this guide, the value is the full App Service HTTPS URL.

### The OpenAPI tool receives HTTP 403

An HTTP 403 response means authentication succeeded, but the authorization checks rejected the caller. Likely causes include:

- You added the Foundry **project** identity to the allow list instead of the parent Foundry **resource** identity.
- You entered the object ID where App Service authentication requires an application ID.
- You didn't add the parent resource application ID to `allowedApplications`.
- You didn't add the parent resource object ID to the allowed identity list for a Foundry-only configuration.

Inspect the access token claims:

- `azp` should equal the parent Foundry resource identity's application ID.
- `oid` should equal the parent Foundry resource identity's object ID.

### Browser users receive HTTP 403 after signing in

For an app that supports interactive browser sign-in, verify these settings:

- The web app's own client ID remains in `allowedApplications`.
- The identity requirement allows normal tenant users.
- Unauthenticated browser requests use HTTP 302 rather than HTTP 401.

### The tool works anonymously but fails after authentication is enabled

Update the tool from **Anonymous** to **Managed identity**, set the audience to a registered Application ID URI, and allow the parent Foundry resource identity.

## Clean up resources

When you delete or replace resources from this scenario:

- Remove the parent Foundry resource identity from App Service authentication when you delete or replace the Foundry resource.
- Delete the App Service authentication Microsoft Entra application when you permanently delete the App Service app. This step also prevents the orphaned Application ID URI risk described earlier.
- If you use a user-assigned identity and federated identity credential for secretless App Service authentication, delete that identity and federated credential with the app.

## Related content

- [Configure your App Service or Azure Functions app to use Microsoft Entra sign-in](configure-authentication-provider-aad.md)
- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
- [What is Foundry Agent Service?](/azure/ai-services/agents/overview)

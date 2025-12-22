---
title: Secure MCP servers with Microsoft Entra authentication
description: Configure Microsoft Entra authentication to secure your MCP server on Azure App Service and access it from Visual Studio Code.
ms.topic: how-to
ms.date: 11/18/2025
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Secure Model Context Protocol calls to Azure App Service from Visual Studio Code with Microsoft Entra authentication

This article shows you how to secure your Model Context Protocol (MCP) server hosted on Azure App Service using Microsoft Entra authentication. By enabling authentication, you ensure that only users authenticated with Microsoft Entra can access your MCP server through Copilot agent mode in Visual Studio Code.

For other authentication methods and general MCP server security concepts, see [Secure a Model Context Protocol server in Azure App Service](configure-authentication-mcp.md).

## Prerequisites

An App Service app that hosts an MCP server. If you need to create one, see one of the following tutorials:

- [Integrate an App Service app as an MCP Server for GitHub Copilot Chat (.NET)](tutorial-ai-model-context-protocol-server-dotnet.md)
- [Integrate an App Service app as an MCP Server for GitHub Copilot Chat (Java)](tutorial-ai-model-context-protocol-server-java.md)
- [Integrate an App Service app as an MCP Server for GitHub Copilot Chat (Python)](tutorial-ai-model-context-protocol-server-python.md)
- [Integrate an App Service app as an MCP Server for GitHub Copilot Chat (Node.js)](tutorial-ai-model-context-protocol-server-node.md)

## Enable Microsoft Entra authentication

1. In the [Azure portal](https://portal.azure.com), navigate to your App Service app.

1. In the left menu, select **Settings** > **Authentication**, and then select **Add identity provider**.

1. On the **Add an identity provider** page, select **Microsoft** as the **Identity provider**.

1. Under **App Service authentication settings**, for **Client secret expiration**, select an expiration period (for example, **6 months**).

1. Accept all other default values and select **Add** to create the identity provider.

   This creates a new app registration in Microsoft Entra ID with a client secret and configures your App Service app to use it for authentication.

## Authorize Visual Studio Code in App Service authentication

After enabling authentication, you need to authorize Visual Studio Code to access your MCP server.

1. On the **Authentication** page of your App Service app, under **Identity provider**, select **Edit** (the pencil icon) next to the Microsoft provider you created.

1. On the **Edit identity provider** page, under **Additional checks** > **Client application requirement**, select **Allow requests from specific client applications**.

1. Select the pencil widget to edit the allowed applications.

1. In the **Allowed client applications** field, add the Visual Studio Code client ID: `aebc6443-996d-45c2-90f0-388ff96faa56`.

1. Select **OK**, then select **Save**.

## Authorize Visual Studio Code in the app registration

Next, you need to configure the app registration to expose your API to Visual Studio Code.

1. Go back to the **Authentication** page of your App Service app.

1. Select the Microsoft provider in the **Identity provider** column to open the app registration page.

1. In the app registration page, select **Manage** > **Expose an API** from the left menu.

1. Under **Authorized client applications**, select **Add a client application**.

1. In the **Client ID** field, enter the Visual Studio Code client ID: `aebc6443-996d-45c2-90f0-388ff96faa56`.

1. Select the checkbox next to the **user_impersonation** scope to authorize this scope.

1. Select **Add application**.

1. Under **Scopes defined by this API**, find and copy the full scope value. It should look like `api://<app-registration-app-id>/user_impersonation`.

   You need this scope value in the next section.

## Enable protected resource metadata by setting the authorization scope

To enable MCP server authorization, you need to configure the protected resource metadata (PRM) by setting the authorization scope in an app setting. This allows MCP clients to discover the authentication requirements through the `/.well-known/oauth-protected-resource` endpoint.

1. In the Azure portal, go back to your App Service app page.

1. In the left menu, select **Settings** > **Environment variables**.

1. Select **Add** to create a new application setting.

1. For **Name**, enter `WEBSITE_AUTH_PRM_DEFAULT_WITH_SCOPES`.

1. For **Value**, paste the scope you copied from the app registration: `api://<app-registration-app-id>/user_impersonation`.

1. Select **Apply**, then select **Apply** again to confirm and restart your app.

   This setting configures the PRM to include the required scope for MCP server authorization.

## Connect from Visual Studio Code

Now you can connect to your secured MCP server from Visual Studio Code.

1. Open Visual Studio Code on your local machine.

1. Open or create an MCP configuration file (`mcp.json`). For a workspace scoped MCP configuration, create it in the *.vscode* directory of your workspace.

1. Add your MCP server configuration:

   ```json
   {
     "servers": {
       "my-app-service-mcp": {
         "type": "http",
         "url": "https://<your-app-url>.azurewebsites.net/api/mcp"
       }
     }
   }
   ```

   Replace `<your-app-url>` with your actual App Service app URL. You can find your app's default domain on the **Overview** page in the Azure portal. In this example, the path is `/api/mcp`, but the actual path depends on your MCP code.

1. In Visual Studio Code, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).

1. Type **MCP: List Servers** and press Enter.

1. Select your MCP server from the list and choose **Start Server**.

1. Visual Studio Code automatically prompts you to sign in with Microsoft Entra ID. Follow the authentication prompts.

   The MCP extension handles the OAuth flow using the scope you configured, and Visual Studio Code obtains the necessary access token to call your MCP server.
   
   > [!TIP]
   > If you see an unexpected authentication prompt or encounter errors, see [Troubleshooting](#troubleshooting).

1. Once authenticated, your MCP server is connected and ready to use in GitHub Copilot Chat agent mode or other MCP clients.

## Test the connection

To verify that your MCP server is properly secured and accessible:

1. Open GitHub Copilot Chat in Visual Studio Code (`Ctrl+Alt+I` or `Cmd+Option+I` on macOS).

1. Try using a feature from your MCP server. For example, if you're using the Todos sample:

   ```
   Show me all my tasks
   ```

1. GitHub Copilot should successfully call your MCP server, and you should see the results in the chat. If you encounter any issues, see [Troubleshooting](#troubleshooting).

## Troubleshooting

When you start the MCP server in Visual Studio Code, the authentication prompt you see indicates whether your configuration is correct:

- **Correct configuration**: Visual Studio Code prompts you to **authenticate with Microsoft**. This means the protected resource metadata (PRM) is configured properly, and Visual Studio Code successfully discovered the authorization server and scope from the `/.well-known/oauth-protected-resource` endpoint.

- **Incorrect configuration**: Visual Studio Code prompts you to authenticate with an `/authorize` endpoint on your App Service app (for example, `https://<your-app-url>.azurewebsites.net/authorize`). This means the PRM is not configured properly. Visual Studio Code cannot find the authorization server and authorization scope, so it falls back to using your app's URL as the authorization endpoint, which doesn't exist.

If you see the incorrect authentication prompt, verify that:
- Your app setting `WEBSITE_AUTH_PRM_DEFAULT_WITH_SCOPES` is correctly configured with the full scope value `api://<app-registration-app-id>/user_impersonation`.
- The App Service app has fully restarted after adding the app setting. It might take a few minutes to complete the restart.

If you see authentication errors after signing in, verify that:
- The Visual Studio Code client ID (`aebc6443-996d-45c2-90f0-388ff96faa56`) is added to both the App Service authentication configuration (allowed client applications) and in the app registration (authorized client applications in **Expose an API**).
- The scope value in the app setting matches exactly what's defined in your app registration.

## Related content

- [Secure a Model Context Protocol server in Azure App Service](configure-authentication-mcp.md)
- [Configure your App Service or Azure Functions app to use Microsoft Entra sign-in](configure-authentication-provider-aad.md)
- [Configure the Microsoft Entra provider with a managed identity instead of a secret (preview)](configure-authentication-provider-aad.md#use-a-managed-identity-instead-of-a-secret-preview)
- [What is Model Context Protocol?](https://modelcontextprotocol.io/)

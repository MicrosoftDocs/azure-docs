---
title: Configure MCP server authorization
description: Learn how to configure Model Context Protocol (MCP) server authorization in Azure App Service and Azure Functions
ms.topic: how-to
ms.date: 11/04/2025
author: mattchenderson
ms.author: mahender
ms.service: azure-app-service
---

# Configure built-in MCP server authorization (Preview)

[App Service Authentication](./overview-authentication-authorization.md) allows you to control access to your Model Context Protocol (MCP) server by requiring MCP clients to authenticate with an identity provider. You can make your app comply with the [MCP server authorization specification][spec] by following the instructions in this article.

> [!IMPORTANT]
> MCP server authorization defines access to the server, and it doesn't provide granular control to individual MCP tools or other constructs.

## Configure an identity provider

[Configure App Service Authentication with an identity provider](./overview-authentication-authorization.md#identity-providers). The identity provider registration should be unique for the MCP server. Don't reuse an existing registration from another application component.

As you create the registration, make note of what scopes are defined in your registration or in the identity provider's documentation.

## Configure protected resource metadata (preview)

MCP server authorization requires that the server host [protected resource metadata (PRM)](./overview-authentication-authorization.md#protected-resource-metadata-preview). Support for PRM with App Service Authentication is currently in preview.

To configure PRM for your MCP server, set the `WEBSITE_AUTH_PRM_DEFAULT_WITH_SCOPES` application setting to a comma-separated list of scopes for your application. The scopes you need are either defined as part of your app registration or documented by your identity provider. For example, if you used the [Microsoft Entra ID provider](./configure-authentication-provider-aad.md) and let App Service create the registration for you, a default scope of `api://<client-id>/user_impersonation` was created. You would set `WEBSITE_AUTH_PRM_DEFAULT_WITH_SCOPES` to that value.

## MCP client considerations

In order to sign in users, the MCP client must be registered with the identity provider. Some providers support Dynamic Client Registration (DCR), but many don't, including Microsoft Entra ID. When DCR isn't available, the client needs to be preconfigured with a client ID. Consult the documentation for your client or client SDK to understand how to provide a client ID.

### Entra ID consent authoring

If you're using Microsoft Entra ID, you can specify known client applications and mark them as preauthorized for access. preauthorization is recommended when possible. Without preauthorization, users or an administrator need to [consent to the MCP server registration](/entra/identity-platform/permissions-consent-overview#consent) and any permissions it requires.

For user consent scenarios, consent authoring involves the MCP client using interactive login to display the consent prompt. Some MCP clients might not surface an interactive login. For example, if you are building an MCP tool to be used by GitHub Copilot in Visual Studio Code, the client attempts to use the context of the logged-in user and doesn't display a consent prompt. In these cases, preauthorizing the client application is required to avoid consent issues.

For dev/test purposes, you can author user consent for yourself by signing into the application directly in a browser. Navigating to `<your-app-url>/.auth/login/aad` initiates the sign-in flow and prompts you for consent if needed. Then you can attempt sign-in from another client.

## MCP server considerations

App Service Authentication validates tokens provided by MCP clients and applies any configured authorization policies before responding to the MCP initialization request. You might need to update your authorization rules for the MCP scenario. For example, if you used the Microsoft Entra ID provider and let App Service create the registration for you, a default policy only allows tokens obtained by the app itself. You therefore would add your MCP client to the allowed applications list in the auth configuration. For more information, see [Use a built-in authorization policy](./configure-authentication-provider-aad.md#use-a-built-in-authorization-policy).

MCP server frameworks frequently abstract away the transport, but in some cases they might expose the underlying HTTP context. When the HTTP context is available, you can [access user claims and other authentication information](./configure-authentication-user-identities.md) provided by App Service Authentication.

> [!CAUTION]
> The token used for MCP server authorization is meant to represent access to your MCP server, and not to a downstream resource. Pass-through scenarios where the server forwards its token create security vulnerabilities, so avoid these patterns. If you need to access a downstream resource, obtain a new token through the on-behalf-of flow or another mechanism for explicit delegation.

## Related content

- [Model Context Protocol Authorization specification][spec]
- [Azure Functions Model Context Protocol bindings](../azure-functions/functions-bindings-mcp.md)
- [Integrate an App Service app as an MCP Server (.NET)](./tutorial-ai-model-context-protocol-server-dotnet.md)
- [Integrate an App Service app as an MCP Server (Java)](./tutorial-ai-model-context-protocol-server-java.md)
- [Integrate an App Service app as an MCP Server (Node.js)](./tutorial-ai-model-context-protocol-server-node.md)
- [Integrate an App Service app as an MCP Server (Python)](./tutorial-ai-model-context-protocol-server-python.md)

[spec]: https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization

---
title: Secure access to MCP servers in Azure API Management
description: Learn how secure access to MCP servers managed in Azure API Management.
author: dlepow
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 07/30/2025
ms.author: danlep
ms.collection: ce-skilling-ai-copilot
ms.custom:
---

# Secure access to MCP servers in API Management

[!INCLUDE [api-management-availability-premium-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-standard-basic-premiumv2-standardv2-basicv2.md)]


With  [MCP server support in API Management](mcp-server-overview.md), you can expose and govern access to MCP servers and their tools. This article describes how to secure access to MCP servers managed in API Management, including both MCP servers exposed from managed REST APIs and existing MCP servers hosted outside of API Management.

You can secure either or both inbound access to the MCP server (from an MCP client to API Management) and outbound access (from API Management to the MCP server backend).

## Secure inbound access

### Key-based authentication

If the backend API is protected with an API Management subscription key passed in a `Ocp-Apim-Subscription-Key` header, MCP clients can present the key in the incoming requests, and the MCP server can validate the key. For example, in Visual Studio Code, you can add a `headers` section to the MCP server configuration to require the subscription key in the request headers:

```json
{
  "name": "My MCP Server",
  "type": "remote",
  "url": "https://my-api-management-instance.azure-api.net/my-mcp-server",    
  "transport": "streamable-http",
  "headers": {
    "Ocp-Apim-Subscription-Key": "<subscription-key>"
  }
}

```

Visual Studio Code provides ways to store the subscription key in the workspace or user settings, or to pass the key through user input, so you don't have to hard-code it in the MCP server configuration.

> [!CAUTION]
> When you use an MCP server in API Management, incoming headers like **Authorization** aren't automatically passed to your backend API. If your backend needs a token, you can add it as an input parameter in your API definition. Alternatively, use policies like `get-authorization-context` and `set-header` to generate and attach the token, as noted in the following section.

### Token-based authentication

You can generate an access token (JWT) using your identity provider, and pass the token in a request to the MCP server in an `Authorization` header. Then, API Management can use a policy to validate the JWT in the incoming request. This ensures that only authorized clients can access the MCP server. 

API Management provides the generic [validate-jwt](validate-jwt-policy.md) policy, or the [validate-azure-ad-token](validate-azure-ad-token-policy.md) policy when using Microsoft Entra ID, to validate the JWT in the incoming requests. 

For example, you can use the following policy to validate a Microsoft Entra ID token presented in an incoming request:

```xml
<validate-azure-ad-token tenant-id="your-tenant-id" header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">     
    <client-application-ids>
        <application-id>your-client-id</application-id>
    </client-application-ids> 
</validate-azure-ad-token>
```

For more inbound authorization options and samples, including using OAuth authorization, see:

* [MCP server authorization with Protected Resource Metadata (PRM) sample](https://github.com/blackchoey/remote-mcp-apim-oauth-prm)

* [Secure Remote MCP Servers using Azure API Management (Experimental)](https://github.com/Azure-Samples/remote-mcp-apim-functions-python)

* [MCP client authorization lab](https://github.com/Azure-Samples/AI-Gateway/tree/main/labs/mcp-client-authorization)


## Secure outbound access

Use API Management's [credential manager](credentials-overview.md) to securely inject secrets or tokens for calls to a backend API. For example, use the credential manager to obtain and present an OAuth 2.0 access token from an identity provider to access the backend API called by an MCP server tool.

At a high level, the process is as follows:

1. Register an application in a supported identity provider.
1. Create a credential provider resource in API Management to manage the credentials from the identity provider.
1. Configure a connection to the provider in API Management.
1. Configure `get-authorization-context` and `set-header` policies to fetch the token credentials and present them in an **Authorization** header of the API requests.

    For example, the following policy retrieves an access token from the credential manager and sets it in the `Authorization` header of the request to the backend API:
    
    ```xml
    <!-- Add to inbound policy. -->
    <get-authorization-context
        provider-id="your-credential-provider-id    " 
        authorization-id="auth-01" 
        context-variable-name="auth-context" 
        identity-type="managed" 
        ignore-error="false" />
    <!-- Attach the token to the backend call -->
    <set-header name="Authorization" exists-action="override">
        <value>@("Bearer " + ((Authorization)context.Variables.GetValueOrDefault("auth-context"))?.AccessToken)</value>
    </set-header>
    ```

For a step-by-step guide to call an example backend API using credentials generated in credential manager, see [Configure credential manager - GitHub](credentials-how-to-github.md).

## Related content


* [Register and discover remote MCP servers in Azure API Center](../api-center/register-discover-mcp-server.md)

* [Expose REST API in API Management as an MCP server](export-rest-mcp-server.md)

* [Expose and govern existing MCP server](expose-existing-mcp-server.md)
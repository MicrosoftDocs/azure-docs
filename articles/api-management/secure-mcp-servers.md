---
title: Secure access to MCP servers in Azure API Management
description: Learn how secure access to MCP servers managed in Azure API Management.
author: dlepow
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 11/10/2025
ms.author: danlep
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
ms.custom:
---

# Secure access to MCP servers in API Management

[!INCLUDE [api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2.md)]

With  [MCP server support in API Management](mcp-server-overview.md), you can expose and govern access to MCP servers and their tools. This article describes how to secure access to MCP servers managed in API Management, including both MCP servers exposed from managed REST APIs and existing MCP servers hosted outside of API Management.

You can secure either or both inbound access to the MCP server (from an MCP client to API Management) and outbound access (from API Management to the MCP server).

## Secure inbound access

### Key-based authentication

If the MCP server is protected with an API Management subscription key passed in a `Ocp-Apim-Subscription-Key` header, MCP clients can present the key in the incoming requests, and the MCP server can validate the key. For example, in Visual Studio Code, you can add a `headers` section to the MCP server configuration to require the subscription key in the request headers:

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

> [!NOTE]
> Securely manage subscription keys using Visual Studio Code workspace settings or secure inputs. 
>
 
### Token-based authentication (OAuth 2.1 with Microsoft Entra ID)

MCP clients can present OAuth tokens or JWTs issued by Microsoft Entra ID using an `Authorization` header and validated by API Management. 

For example, use the [validate-azure-ad-token](validate-azure-ad-token-policy.md) policy to validate Microsoft Entra ID tokens:

```xml
<validate-azure-ad-token tenant-id="your-entra-tenant-id" header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">     
    <client-application-ids>
        <application-id>your-client-application-id</application-id>
    </client-application-ids> 
</validate-azure-ad-token>
```

### Forward tokens to backend

Request headers are automatically forwarded (with certain exclusions) to MCP tool invocations, simplifying integration with downstream APIs that rely on headers for routing, context, or authentication. 

If you require explicit forwarding of the `Authorization` header to validate incoming requests, you can use one of the following approaches:

* Explicitly define `Authorization` as a required header in the API settings and forward the header in the `Outbound` policy. 

    Example policy snippet: 

    ```xml
    <!-- Forward Authorization header to backend --> 
    <set-header name="Authorization" exists-action="override"> 
        <value>@(context.Request.Headers.GetValueOrDefault("Authorization"))</value> 
    </set-header> 
    ```

* Use API Management credential manager and policies (`get-authorization-context`, `set-header`) to securely forward the token. See [Secure outbound access](#secure-outbound-access) for details.


For more inbound authorization options and samples, see:

* [MCP server authorization with Protected Resource Metadata (PRM) sample](https://github.com/blackchoey/remote-mcp-apim-oauth-prm)

* [Lab: MCP with protected resource metadata (PRM) authorization](https://github.com/Azure-Samples/AI-Gateway/tree/main/labs/mcp-prm-oauth)

* [Secure Remote MCP Servers using Azure API Management (Experimental)](https://github.com/Azure-Samples/remote-mcp-apim-functions-python)

* [MCP client authorization lab](https://github.com/Azure-Samples/AI-Gateway/tree/main/labs/mcp-client-authorization)

## Secure outbound access

Use API Management's [credential manager](credentials-overview.md) to securely inject OAuth 2.0 tokens for backend API requests made by MCP server tools. 

### Steps to configure OAuth 2-based outbound access

**Step 1:** Register an application in the identity provider. 

**Step 2:** Create a credential provider in API Management linked to the identity provider. 

**Step 3:** Configure connections within credential manager. 

**Step 4:** Apply API Management policies to dynamically fetch and attach credentials.  

For example, the following policy retrieves an access token from the credential manager and sets it in the `Authorization` header of the outgoing request:
    
```xml
<!-- Add to inbound policy. -->
<get-authorization-context
    provider-id="your-credential-provider-id" 
    authorization-id="auth-01" 
    context-variable-name="auth-context" 
    identity-type="managed" 
    ignore-error="false" />
<!-- Attach the token to the backend call -->
<set-header name="Authorization" exists-action="override">
    <value>@("Bearer " + ((Authorization)context.Variables.GetValueOrDefault("auth-context"))?.AccessToken)</value>
</set-header>
```

For a step-by-step guide to call an example backend using credentials generated in credential manager, see [Configure credential manager - GitHub](credentials-how-to-github.md).

## Related content

* [Register and discover remote MCP servers in Azure API Center](../api-center/register-discover-mcp-server.md)

* [Expose REST API in API Management as an MCP server](export-rest-mcp-server.md)

* [Expose and govern existing MCP server](expose-existing-mcp-server.md)
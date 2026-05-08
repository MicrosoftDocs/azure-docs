---
title: Configure App Service built-in MCP (Preview)
description: Turn an existing REST API hosted on Azure App Service into a Model Context Protocol (MCP) server without writing or deploying any MCP code.
author: seligj95
ms.author: jordanselig
ms.service: azure-app-service
ms.topic: how-to
ms.date: 05/08/2026
ms.custom:
  - build-2026
---

# Configure App Service built-in MCP (Preview)

App Service built-in MCP turns an existing REST API hosted on Azure App Service into a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server without writing or deploying any MCP code. The platform reads an OpenAPI specification you provide—either by uploading it directly through the portal or by pointing to a file already in your app. The platform then generates an MCP tool for each operation, and serves the MCP endpoint over [streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http) on a path you choose.

> [!IMPORTANT]
> App Service built-in MCP is in preview.

## When to use built-in MCP

Use built-in MCP when:

- You already have a REST API running on App Service and want to expose it to an MCP-compatible AI client (GitHub Copilot Chat, Cursor, Windsurf, Claude Desktop) without code changes.
- You have an OpenAPI 3.x specification (JSON or YAML) that describes the operations you want to expose.
- You want the platform to handle MCP protocol negotiation, tool discovery, hot-reload of the spec, and client cancellation.
- You want App Service Authentication to enforce identity for MCP requests, the same way it enforces identity for your existing HTTP routes.

Use a custom MCP server (built with an MCP SDK and deployed as your application code) instead when:

- You need MCP tool behavior that doesn't map cleanly to a single REST operation—for example, multi-step workflows, in-memory aggregation, or tools that don't have an HTTP backing endpoint.
- You need to expose MCP [resources](https://modelcontextprotocol.io/specification/2025-06-18/server/resources) or [prompts](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts) in addition to tools.
- You need to host more than one MCP server on a single app.

For a comparison of all MCP hosting options on Azure, see [Choose an Azure service for your MCP server](/azure/container-apps/mcp-choosing-azure-service).

## How it works

When you enable built-in MCP on an App Service app:

1. You provide an OpenAPI specification (JSON or YAML). The platform reads it from a file on the app's file system at the path you set in `ApiSpecPath` (default `/home/data/.ai/apispec.json`). You can populate that file three ways:
   - **Upload it through the portal.** When you create an MCP server in the Azure portal, choose **File** as the source and upload an OpenAPI JSON or YAML file. The platform writes it to `ApiSpecPath`.
   - **Fetch it from a URL.** In the same panel, choose **URL** as the source and provide a reachable URL. The platform fetches the spec and writes it to `ApiSpecPath`.
   - **Deploy it with your app.** Place the spec on the app's content share yourself (for example, by including it in your deployment) and set `ApiSpecPath` to that location.
1. Each OpenAPI operation becomes an MCP tool. By default, the tool name is derived from the operation's `operationId` (or from `{method}_{path}` when no `operationId` is set) and the description comes from the operation's `summary` or `description`. You can override either per tool to give the AI client clearer, more action-oriented names and descriptions without changing the underlying spec.
1. The platform serves the MCP endpoint at the path you configure (default `/.ai/mcp/{serverName}`) using streamable HTTP.
1. When an MCP client calls a tool, the platform translates the call into an HTTP request against your app's existing route, forwards the response back to the client, and returns the result as an MCP `CallToolResult`.
1. When you update the OpenAPI spec, the platform detects the change, recomputes the tool list, and notifies connected clients with a `tools/list_changed` notification.

Built-in MCP runs in the App Service request pipeline alongside [App Service Authentication](overview-authentication-authorization.md). When authentication is enabled on the app, MCP requests are subject to the same identity checks as any other request. Built-in MCP also publishes [protected resource metadata (PRM)](https://datatracker.ietf.org/doc/html/rfc9728) at `/.well-known/oauth-protected-resource` so MCP clients can discover the identity provider.

## Prerequisites

- An App Service app on a dedicated pricing tier (Basic or higher). Built-in MCP isn't supported on Free, Shared, Consumption, or Flex Consumption plans.
- An OpenAPI 3.x specification (JSON or YAML) that describes the operations you want to expose as MCP tools.
- A way to make the spec available to the platform—either by uploading it through the portal or by deploying it as part of your app's content (referenced by `ApiSpecPath`).

## Step 1—Provide your OpenAPI spec

Built-in MCP needs an OpenAPI 3.x document (JSON or YAML). The platform reads it from a path on the app's file system (`ApiSpecPath`, default `/home/data/.ai/apispec.json`). You can populate that file three ways:

- **Upload through the portal**—the simplest option. You don't need to redeploy or expose the spec from your app.
- **Fetch from a URL**—useful when the spec is hosted somewhere the platform can reach (for example, a published Swagger endpoint or a public Git URL).
- **Deploy with your app**—useful when you want the spec to live in source control alongside your code.

A minimal spec that exposes one operation looks like:

```json
{
  "openapi": "3.0.3",
  "info": { "title": "Zava Orders", "version": "1.0.0" },
  "paths": {
    "/orders/{id}": {
      "get": {
        "operationId": "get_order",
        "summary": "Get an order by ID",
        "parameters": [
          { "name": "id", "in": "path", "required": true,
            "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
}
```

The `operationId` becomes the MCP tool name. Use clear, action-oriented IDs (`list_orders`, `create_order`, `cancel_order`)—the AI client uses them to choose tools.

Built-in MCP maps REST verbs to MCP [tool annotations](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#tool-annotations):

| HTTP method | `readOnlyHint` | `idempotentHint` | `destructiveHint` |
|---|---|---|---|
| `GET`, `HEAD` | `true` | `true` | `false` |
| `PUT`, `PATCH` | `false` | `true` | `false` |
| `DELETE` | `false` | `true` | `true` |
| `POST` | `false` | `false` | `false` |

## Step 2—Enable built-in MCP

Built-in MCP is configured through the `aiIntegration` property on your `Microsoft.Web/sites` resource. The preview ships with **Portal**, **Azure CLI** (using `az rest`), and **Bicep** as supported configuration paths.

### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your App Service app.
1. In the left menu, under **Settings**, select **AI (preview)**.
1. Select the **MCP servers** tab.
1. Select **+ Create MCP server**, then fill in:
   - **Display name**—the server identifier shown to clients.
   - **Endpoint path**—the relative URL where the MCP server is served (default `/mcp`). The full URL preview appears below the field.
   - **Description**—optional, shown to MCP clients.
   - **API spec path**—the path on the app's file system where the spec file is stored. Defaults to `/home/data/.ai/apispec.json`; edit it if you want the spec stored somewhere else.
   - **OpenAPI specification › Source**—where the spec content comes from. Choose **File** to upload a JSON or YAML file from your machine, or **URL** to have the platform fetch the spec from a reachable URL. Either way, the platform writes the contents to the location you set in **API spec path**.
   - **Auth**—optional. If App Service Authentication isn't enabled on the app, use this section to provide identity provider metadata (`Scopes` plus either `WellKnownOpenIdConfiguration` or `Issuer`) so MCP clients can complete OAuth. See [Authentication](#authentication) for the field reference. {TODO - review this section once the portal Auth section is available.}
1. Select **Create MCP**.

<!-- TODO: Add screenshot of the AI (Preview) blade in the Azure portal showing the MCP servers tab with the Add MCP server panel open. Save to ./media/configure-built-in-mcp/portal-add-mcp-server.png and reinstate as a > [!div class="mx-imgBorder"] image. -->

After you save, the **MCP servers** tab shows the configured server with its endpoint, tool count, and an enable/disable toggle. You can enable/disable individual tools as well. Edit the MCP server to override tool names or descriptions — the override is what the AI client sees, the underlying OpenAPI spec is unchanged.

<!-- TODO: Add screenshot of the MCP server expanded view showing the tool list with individual tool toggles and status of "8 of 13 tools enabled". Save to ./media/configure-built-in-mcp/portal-server-tools.png and reinstate as a > [!div class="mx-imgBorder"] image. -->

### [Azure CLI](#tab/cli)

Use `az rest` to PATCH the `aiIntegration` property on the site resource.

```azurecli-interactive
RESOURCE_GROUP=<resource-group>
APP_NAME=<app-name>
SUBSCRIPTION=$(az account show --query id -o tsv)
API_VERSION=<api-version>   # TODO: confirm the public preview api-version

az rest \
  --method PATCH \
  --uri "https://management.azure.com/subscriptions/$SUBSCRIPTION/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$APP_NAME?api-version=$API_VERSION" \
  --body '{
    "properties": {
      "aiIntegration": {
        "ApiSpecPath": "/home/data/.ai/apispec.json",
        "Mcp": {
          "Servers": [
            {
              "Name": "orders",
              "Description": "Zava Orders MCP server",
              "Enabled": true,
              "Endpoint": "/mcp/orders",
              "ToolList": ["*"],
              "ToolOverrides": [
                {
                  "OperationId": "get_order",
                  "Name": "lookup_order",
                  "Description": "Look up a Zava order by its ID and return status, line items, and shipping info."
                }
              ]
            }
          ]
        }
      }
    }
  }'
```

Field reference for `aiIntegration`:

| Field | Type | Description |
|---|---|---|
| `ApiSpecPath` | string | Absolute path on the app's file system where the OpenAPI spec lives. Defaults to `/home/data/.ai/apispec.json`. |
| `Mcp.Servers[]` | array | One MCP server per app in this preview. |
| `Mcp.Servers[].Name` | string | Server identifier. Must be unique within the app. |
| `Mcp.Servers[].Description` | string | Short description (≤ 256 characters). |
| `Mcp.Servers[].Enabled` | bool | When `false`, the server isn't registered. Defaults to `true`. |
| `Mcp.Servers[].Endpoint` | string | Relative URL where the MCP endpoint is served. |
| `Mcp.Servers[].ToolList` | array of strings | `["*"]` exposes every operation in the spec, `[]` exposes none, or list specific tool names to filter. |
| `Mcp.Servers[].ToolOverrides[]` | array | Optional. Per-tool overrides for the name and description shown to MCP clients. The underlying OpenAPI spec is unchanged. <!-- TODO: confirm the public preview property name. --> |
| `Mcp.Servers[].ToolOverrides[].OperationId` | string | The OpenAPI `operationId` (or `{method}_{path}`) of the tool to override. |
| `Mcp.Servers[].ToolOverrides[].Name` | string | Optional. Replaces the tool name shown to MCP clients (1–128 characters). |
| `Mcp.Servers[].ToolOverrides[].Description` | string | Optional. Replaces the tool description shown to MCP clients (≤ 256 characters). |
| `SiteAuth` | object | Optional. Identity provider metadata used to publish [protected resource metadata](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization#authorization-server-location) when App Service Authentication isn't enabled. See [Authentication](#authentication). |
| `SiteAuth.Scopes` | array of strings | Required. OAuth scopes the MCP client should request—for example, `["api://my-app/user_impersonation"]`. |
| `SiteAuth.WellKnownOpenIdConfiguration` | string (URL) | Required if `Issuer` isn't set. URL to the OpenID Connect discovery document—for example, `https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration`. |
| `SiteAuth.Issuer` | string | Required if `WellKnownOpenIdConfiguration` isn't set. Token issuer URL—for example, `https://login.microsoftonline.com/{tenant}/v2.0`. |
| `SiteAuth.JwksUri` | string (URL) | Optional. JWKS endpoint for token signature validation. |
| `SiteAuth.Audience` | string | Optional. Expected `aud` claim value—for example, `api://my-app-client-id`. |

To remove built-in MCP from an app, PATCH the same property with `null`:

```azurecli-interactive
az rest \
  --method PATCH \
  --uri "https://management.azure.com/subscriptions/$SUBSCRIPTION/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$APP_NAME?api-version=$API_VERSION" \
  --body '{ "properties": { "aiIntegration": null } }'
```

### [Bicep](#tab/bicep)

Add the `aiIntegration` property to your `Microsoft.Web/sites` resource:

```bicep
// TODO: confirm the public preview api-version
resource site 'Microsoft.Web/sites@<api-version>' = {
  name: appName
  location: location
  properties: {
    serverFarmId: appServicePlanId
    aiIntegration: {
      ApiSpecPath: '/home/data/.ai/apispec.json'
      Mcp: {
        Servers: [
          {
            Name: 'orders'
            Description: 'Zava Orders MCP server'
            Enabled: true
            Endpoint: '/mcp/orders'
            ToolList: [ '*' ]
            ToolOverrides: [
              {
                OperationId: 'get_order'
                Name: 'lookup_order'
                Description: 'Look up a Zava order by its ID and return status, line items, and shipping info.'
              }
            ]
          }
        ]
      }
    }
  }
}
```

---

## Step 3—Connect an MCP client

After you save the configuration, the MCP endpoint is available at:

```
https://<app-name>.azurewebsites.net/<endpoint path you provided>
```

For this example, that's `https://zava.azurewebsites.net/mcp/orders`.

Configure your MCP client with that URL. For [GitHub Copilot Chat in Visual Studio Code](configure-authentication-mcp-server-vscode.md), add an entry to your `.vscode/mcp.json`:

```json
{
  "servers": {
    "zava-orders": {
      "type": "http",
      "url": "https://Zava.azurewebsites.net/mcp/orders"
    }
  }
}
```

When the client connects, it calls `initialize`, then `tools/list` to discover the operations your OpenAPI spec exposes, then `tools/call` for each invocation.

## Authentication

Built-in MCP doesn't issue tokens or implement an authorization server. Identity is enforced by App Service Authentication on the same app. Two configurations are supported:

- **App Service Authentication is enabled**—MCP requests are subject to the same identity checks as any other route. The platform publishes protected resource metadata at `/.well-known/oauth-protected-resource` based on the configured identity provider, so MCP clients can complete OAuth automatically. This option is the recommended configuration. See [Configure built-in MCP server authorization](configure-authentication-mcp.md).
- **App Service Authentication isn't enabled**—provide identity provider metadata in the `SiteAuth` block. The minimum required fields are:
  - `Scopes`—an array of OAuth scopes the client should request.
  - **Either** `WellKnownOpenIdConfiguration` (the OpenID Connect discovery URL) **or** `Issuer` (the token issuer URL). One of the two must be present; both URLs must be well-formed.

  `JwksUri` and `Audience` are optional.

  When a valid `SiteAuth` block is present, built-in MCP returns `401 Unauthorized` with a `WWW-Authenticate` header on the first call to the MCP endpoint. MCP clients (such as VS Code) follow that header to discover the authorization server and complete the OAuth flow. Your application code is still responsible for validating the bearer token on each request.

  In the portal, configure these values in the **Auth** section of the **MCP server** panel.

> [!CAUTION]
> Avoid exposing a built-in MCP server publicly without authentication. Once an MCP client connects, every operation in the published `ToolList` is callable.

## Filter which operations are exposed

The `ToolList` field on each server controls which OpenAPI operations are exposed:

- `["*"]`—expose every operation in the spec.
- `[]`—expose no operations. Useful for temporarily disabling tool discovery without removing the server.
- `["get_order", "list_orders"]`—expose only the listed `operationId` values.

Use this filtering setting to keep destructive or admin-only operations off the MCP surface while still serving them to your existing HTTP clients.

## Update the OpenAPI spec

When the spec changes—either because you redeployed the file at `ApiSpecPath` or you uploaded a new version through the portal—the platform:

1. Detects the change.
1. Reparses the spec and recomputes the tool list.
1. Hashes the new tool list (SHA-256) and compares it to the previous hash.
1. If the hash changed, sends a `notifications/tools/list_changed` event to every connected MCP client.

You don't need to restart the app or update the `aiIntegration` configuration to pick up spec changes.

## Limits

| Limit | Value |
|---|---|
| MCP servers per app | 1 (preview) |
| Description length | 256 characters |
| Tool name length | 1–128 characters (per the [MCP spec](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)) |
| Supported transport | Streamable HTTP |

## Troubleshooting

**The MCP client gets a 404 at the configured endpoint.**

- Confirm the `Endpoint` value starts with `/` and doesn't collide with an existing route in your app.
- Confirm the server's `Enabled` field is `true`.

**The MCP client connects but `tools/list` returns an empty array.**

- Confirm a spec is configured—either uploaded through the portal or available at the path set in `ApiSpecPath`.
- Confirm `ToolList` isn't set to `[]`.
- Validate the spec with an OpenAPI 3.x linter—operations missing required fields (such as a response schema) are skipped.

**The MCP client gets a 401 with a `WWW-Authenticate` challenge.**

- This error is expected when App Service Authentication is enabled and the client doesn't have a valid token. The challenge points the client at the protected resource metadata endpoint, which in turn points at your identity provider. See [Configure built-in MCP server authorization](configure-authentication-mcp.md).

**The MCP client gets a 403 from a tool call but `tools/list` succeeds.**

- The OAuth token is valid for MCP discovery but doesn't have the scope or role your application requires for the underlying HTTP route. Check the upstream HTTP status surfaced in the `CallToolResult`.

## Next steps

- [Configure built-in MCP server authorization](configure-authentication-mcp.md)
- [Secure MCP calls from Visual Studio Code with Microsoft Entra authentication](configure-authentication-mcp-server-vscode.md)
- [App Service as Model Context Protocol (MCP) servers](scenario-ai-model-context-protocol-server.md)
- [Choose an Azure service for your MCP server](/azure/container-apps/mcp-choosing-azure-service)

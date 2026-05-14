---
title: Configure App Service built-in MCP (Preview)
description: Turn an existing REST API hosted on Azure App Service into a Model Context Protocol (MCP) server without writing or deploying any MCP code.
author: seligj95
ms.author: jordanselig
ms.service: azure-app-service
ms.topic: how-to
ms.date: 05/08/2026
ms.collection: ce-skilling-ai-copilot
ms.custom:
  - build-2026
---

# Configure App Service built-in MCP (Preview)

App Service built-in MCP turns an existing REST API hosted on Azure App Service into a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server without writing or deploying any MCP code. The platform reads an OpenAPI specification you provide, generates an MCP tool for each operation, and serves the MCP endpoint over [streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http) on a path you choose.

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

## Prerequisites

- An App Service app on a dedicated pricing tier (Basic or higher). Built-in MCP isn't supported on Free, Shared, Consumption, or Flex Consumption plans.
- An OpenAPI 3.x specification (JSON or YAML) that describes the operations you want to expose as MCP tools. See [Step 1: Provide your OpenAPI spec](#step-1-provide-your-openapi-spec) for generation options.

## Step 1: Provide your OpenAPI spec

Built-in MCP needs an OpenAPI 3.x document (JSON or YAML). Most web frameworks can produce one for you:

- **ASP.NET Core minimal APIs**—use the built-in [`Microsoft.AspNetCore.OpenApi`](/aspnet/core/fundamentals/openapi/overview) package (default in .NET 9 and later).
- **ASP.NET Core controllers**—use [Swashbuckle](/aspnet/core/tutorials/getting-started-with-swashbuckle).
- **FastAPI**—auto-generated at `/openapi.json`.
- **Express / NestJS**—use [`@nestjs/swagger`](https://docs.nestjs.com/openapi/introduction) or [`express-openapi`](https://www.npmjs.com/package/express-openapi).
- **Spring Boot**—use [`springdoc-openapi`](https://springdoc.org/).
- **Java / Quarkus**—use [SmallRye OpenAPI](https://quarkus.io/guides/openapi-swaggerui).

If your API is already running and exposes an OpenAPI endpoint, you don't need to add a new library—download the spec from that endpoint (for example, with `curl`) and save it locally so you can upload it when you enable built-in MCP.

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

Use clear, action-oriented `operationId` values (`list_orders`, `create_order`, `cancel_order`). The AI client uses them as tool names when choosing which tool to call. For details on how operations map to MCP tools, see [How does built-in MCP map REST operations to MCP tools?](#how-does-built-in-mcp-map-rest-operations-to-mcp-tools).

### Make the spec available to the platform

The platform reads the spec from a file on the app's file system. The default path is `/home/data/.ai/apispec.json`, configurable via [`ApiSpecPath`](#change-where-the-spec-lives). How you get the file there depends on the configuration path you use in [Step 2](#step-2-enable-built-in-mcp):

- **Portal**—upload the JSON or YAML file directly, or have the platform fetch it from a reachable URL. Either way, the portal writes the contents to `ApiSpecPath` for you.
- **Azure CLI**—deploy the spec with your app (for example, include it in your deployment artifact), or upload it after the fact with [`az webapp deploy`](/cli/azure/webapp#az-webapp-deploy) or [`az webapp ssh`](/cli/azure/webapp#az-webapp-ssh).
- **Bicep**—reference a path your deployment puts on the app.

<!-- TODO: Confirm whether the "URL fetch" option is a portal-side action (browser downloads bytes, uploads to the site) or a platform-side action exposed through the ARM API. If the latter, document the CLI/Bicep equivalent. -->

## Step 2: Enable built-in MCP

Built-in MCP is configured through the `aiIntegration` property on your `Microsoft.Web/sites` resource. The preview ships with **Portal**, **Azure CLI** (using `az rest`), and **Bicep** as supported configuration paths.

The examples below show the minimal payload to expose every operation in your spec. To filter operations, rename tools, configure auth without App Service Authentication, or change where the spec lives, see [Customize built-in MCP](#customize-built-in-mcp).

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
   - **Authentication**—optional. If App Service Authentication isn't enabled on the app, use this section to provide identity provider metadata so MCP clients can complete OAuth. The portal exposes three fields:
     - **Source**—comma-separated OAuth scopes the MCP client should request (maps to `SiteAuth.Scopes`).
     - **Well-known OpenID configuration URL**—the OpenID Connect discovery URL for your identity provider (maps to `SiteAuth.WellKnownOpenIdConfiguration`).
     - **Issuer**—the token issuer URL (maps to `SiteAuth.Issuer`).

     Provide **Source** plus either **Well-known OpenID configuration URL** or **Issuer**. To set `JwksUri` or `Audience`, use the [Azure CLI](#tab/cli) or [Bicep](#tab/bicep) tab. For details, see [Configure auth without App Service Authentication](#configure-auth-without-app-service-authentication).
1. Select **Create MCP**.

<!-- TODO: Add screenshot of the AI (Preview) blade in the Azure portal showing the MCP servers tab with the Add MCP server panel open. Save to ./media/configure-built-in-mcp/portal-add-mcp-server.png and reinstate as a > [!div class="mx-imgBorder"] image. -->

After you save, the **MCP servers** tab shows the configured server with its endpoint, tool count, and an enable/disable toggle. You can enable or disable individual tools as well. Edit the MCP server to override tool names or descriptions—the override is what the AI client sees; the underlying OpenAPI spec is unchanged.

<!-- TODO: Add screenshot of the MCP server expanded view showing the tool list with individual tool toggles and status of "8 of 13 tools enabled". Save to ./media/configure-built-in-mcp/portal-server-tools.png and reinstate as a > [!div class="mx-imgBorder"] image. -->

### [Azure CLI](#tab/cli)

Use `az rest` to PATCH the `aiIntegration` property on the site resource. This payload uses every default—it exposes every operation in the spec from `/home/data/.ai/apispec.json`, with no tool filtering or overrides.

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
        "Mcp": {
          "Servers": [
            { "Name": "orders", "Endpoint": "/mcp/orders" }
          ]
        }
      }
    }
  }'
```

To change the spec path, filter operations, override tool names, or configure auth without App Service Authentication, see [Customize built-in MCP](#customize-built-in-mcp). For the full property schema, see [Reference: aiIntegration schema](#reference-aiintegration-schema).

To remove built-in MCP from an app, PATCH the same property with `null`:

```azurecli-interactive
az rest \
  --method PATCH \
  --uri "https://management.azure.com/subscriptions/$SUBSCRIPTION/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$APP_NAME?api-version=$API_VERSION" \
  --body '{ "properties": { "aiIntegration": null } }'
```

### [Bicep](#tab/bicep)

Add the `aiIntegration` property to your `Microsoft.Web/sites` resource. This snippet uses every default—it exposes every operation in the spec from `/home/data/.ai/apispec.json`, with no tool filtering or overrides.

```bicep
// TODO: confirm the public preview api-version
resource site 'Microsoft.Web/sites@<api-version>' = {
  name: appName
  location: location
  properties: {
    serverFarmId: appServicePlanId
    aiIntegration: {
      Mcp: {
        Servers: [
          {
            Name: 'orders'
            Endpoint: '/mcp/orders'
          }
        ]
      }
    }
  }
}
```

To change the spec path, filter operations, override tool names, or configure auth without App Service Authentication, see [Customize built-in MCP](#customize-built-in-mcp). For the full property schema, see [Reference: aiIntegration schema](#reference-aiintegration-schema).

---

## Step 3: Connect an MCP client

After you save the configuration, the MCP endpoint is available at:

```text
https://<app-name>.azurewebsites.net/<endpoint path you provided>
```

For this example, that's `https://zava.azurewebsites.net/mcp/orders`. The example uses `/mcp/orders` to scope by API surface; the portal default is `/mcp`.

Configure your MCP client with that URL. For [GitHub Copilot Chat in Visual Studio Code](configure-authentication-mcp-server-vscode.md), add an entry to your `.vscode/mcp.json`:

```json
{
  "servers": {
    "zava-orders": {
      "type": "http",
      "url": "https://zava.azurewebsites.net/mcp/orders"
    }
  }
}
```

When the client connects, it calls `initialize`, then `tools/list` to discover the operations your OpenAPI spec exposes, then `tools/call` for each invocation.

## Authentication

Built-in MCP doesn't issue tokens or implement an authorization server. Identity is enforced by [App Service Authentication](overview-authentication-authorization.md) on the same app, which works with any identity provider App Service Authentication supports (Microsoft Entra, and any other configured OIDC provider). Two configurations are supported:

- **App Service Authentication is enabled (recommended).** MCP requests go through the same identity checks as any other route, and the platform publishes [protected resource metadata](https://datatracker.ietf.org/doc/html/rfc9728) at `/.well-known/oauth-protected-resource` so MCP clients can complete OAuth automatically. **Required follow-up:** complete the steps in [Configure built-in MCP server authorization](configure-authentication-mcp.md) to register the MCP audience and scopes with your identity provider.
- **App Service Authentication isn't enabled.** Provide identity provider metadata in a `SiteAuth` block on `aiIntegration`. This option is appropriate when you already validate tokens in your application code and don't want App Service Authentication injecting headers or middleware. See [Configure auth without App Service Authentication](#configure-auth-without-app-service-authentication).

In both cases, your application code is still responsible for validating the bearer token on each request. Built-in MCP doesn't enforce authorization on the underlying HTTP routes.

> [!CAUTION]
> Avoid exposing a built-in MCP server publicly without authentication. Once an MCP client connects, every operation in the published `ToolList` is callable.

## Customize built-in MCP

The minimal payload in [Step 2](#step-2-enable-built-in-mcp) accepts every default. Add only the fields below that you actually need. Each snippet shows the field added on top of the minimal payload.

### Change where the spec lives

By default, the platform reads the spec from `/home/data/.ai/apispec.json`. Set `ApiSpecPath` to read it from somewhere else:

```json
"aiIntegration": {
  "ApiSpecPath": "/home/site/wwwroot/openapi/orders.yaml",
  "Mcp": { "Servers": [ { "Name": "orders", "Endpoint": "/mcp/orders" } ] }
}
```

### Filter which operations are exposed

`ToolList` on each server controls which OpenAPI operations the MCP server exposes. The default is `["*"]` (every operation in the spec).

- `["*"]`—expose every operation in the spec.
- `[]`—expose no operations. Useful for temporarily disabling tool discovery without removing the server.
- `["get_order", "list_orders"]`—expose only the listed `operationId` values.

```json
"Mcp": {
  "Servers": [
    {
      "Name": "orders",
      "Endpoint": "/mcp/orders",
      "ToolList": ["get_order", "list_orders"]
    }
  ]
}
```

Use this filter to keep destructive or admin-only operations off the MCP surface while still serving them to your existing HTTP clients.

`ToolList` interacts with spec updates as follows:

- `ToolList = ["*"]`—when the spec is updated, new operations are exposed automatically.
- `ToolList = ["op1", "op2"]`—when the spec is updated, only `op1` and `op2` are exposed. New operations in the spec are ignored until you add them to `ToolList`.
- Operation IDs in `ToolList` that don't exist in the spec are silently dropped.

If you want spec-driven filtering only (no ARM-side allowlist), keep `ToolList = ["*"]` and remove operations from the spec itself.

### Rename or redescribe tools

`ToolOverrides[]` lets you change the name or description an MCP client sees without modifying the spec. Each override is keyed by `OperationId`:

```json
"Mcp": {
  "Servers": [
    {
      "Name": "orders",
      "Endpoint": "/mcp/orders",
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
```

Overrides for an `OperationId` that no longer exists in the spec are silently dropped. Because overrides are keyed by `operationId` (not by the override name), they survive spec hot-reloads as long as the underlying `operationId` doesn't change.

### Disable a server without removing it

Set `Enabled` to `false` to take the MCP endpoint offline without deleting the configuration:

```json
"Mcp": {
  "Servers": [
    { "Name": "orders", "Endpoint": "/mcp/orders", "Enabled": false }
  ]
}
```

### Configure auth without App Service Authentication

When App Service Authentication isn't enabled on the app, add a `SiteAuth` block so the platform can publish [protected resource metadata](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization#authorization-server-location) at `/.well-known/oauth-protected-resource`. MCP clients (such as VS Code) follow the `WWW-Authenticate` header returned on the first call to discover the authorization server and complete the OAuth flow.

```json
"aiIntegration": {
  "Mcp": { "Servers": [ { "Name": "orders", "Endpoint": "/mcp/orders" } ] },
  "SiteAuth": {
    "Scopes": ["api://my-app/user_impersonation"],
    "WellKnownOpenIdConfiguration": "https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration",
    "Audience": "api://my-app-client-id"
  }
}
```

Required fields: `Scopes`, plus either `WellKnownOpenIdConfiguration` or `Issuer`. `JwksUri` and `Audience` are optional. See [Reference: aiIntegration schema](#reference-aiintegration-schema) for the full field list.

Your application code is still responsible for validating the bearer token on each request.

## Frequently asked questions

### How does built-in MCP map REST operations to MCP tools?

Each OpenAPI operation becomes one MCP tool:

- **Tool name**—derived from the operation's `operationId`. If `operationId` is missing, the platform falls back to `{method}_{path}` (for example, `get__orders__id_`). Use explicit, action-oriented `operationId` values to give the AI client clearer tool names.
- **Tool description**—the operation's `summary` first, then `description` if `summary` is missing.
- **Tool annotations**—built-in MCP maps the HTTP method to MCP [tool annotations](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#tool-annotations):

  | HTTP method | `readOnlyHint` | `idempotentHint` | `destructiveHint` |
  |---|---|---|---|
  | `GET`, `HEAD` | `true` | `true` | `false` |
  | `PUT`, `PATCH` | `false` | `true` | `false` |
  | `DELETE` | `false` | `true` | `true` |
  | `POST` | `false` | `false` | `false` |

You can override the name and description per tool via [`ToolOverrides[]`](#rename-or-redescribe-tools) without changing the spec.

### How does the platform handle spec updates?

When the spec at `ApiSpecPath` changes—either because you redeployed the file or you uploaded a new version through the portal—the platform:

1. Detects the change.
1. Reparses the spec and recomputes the tool list.
1. Hashes the new tool list (SHA-256) and compares it to the previous hash.
1. If the hash changed, sends a `notifications/tools/list_changed` event to every connected MCP client.

You don't need to restart the app or update the `aiIntegration` configuration to pick up spec changes. For how `ToolList` and `ToolOverrides` interact with spec updates, see [Filter which operations are exposed](#filter-which-operations-are-exposed) and [Rename or redescribe tools](#rename-or-redescribe-tools).

### What's served at `/.well-known/oauth-protected-resource`?

The platform publishes [protected resource metadata (PRM)](https://datatracker.ietf.org/doc/html/rfc9728) so MCP clients can discover where to obtain an access token. The contents are sourced from:

- **App Service Authentication**, when it's enabled on the app. The configured identity provider's metadata is published.
- **The `SiteAuth` block on `aiIntegration`**, when App Service Authentication isn't enabled. See [Configure auth without App Service Authentication](#configure-auth-without-app-service-authentication).

If neither is configured, the endpoint isn't published and clients won't be challenged for OAuth.

### What are the limits?

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

## Reference: aiIntegration schema

| Field | Type | Description |
|---|---|---|
| `ApiSpecPath` | string | Absolute path on the app's file system where the OpenAPI spec lives. Defaults to `/home/data/.ai/apispec.json`. |
| `Mcp.Servers[]` | array (maximum 1 entry in preview) | MCP servers defined on the app. |
| `Mcp.Servers[].Name` | string | Server identifier. Must be unique within the app. |
| `Mcp.Servers[].Description` | string | Short description (≤ 256 characters). |
| `Mcp.Servers[].Enabled` | bool | When `false`, the server isn't registered. Defaults to `true`. |
| `Mcp.Servers[].Endpoint` | string | Relative URL where the MCP endpoint is served. |
| `Mcp.Servers[].ToolList` | array of strings | `["*"]` exposes every operation in the spec, `[]` exposes none, or list specific tool names to filter. |
| `Mcp.Servers[].ToolOverrides[]` | array | Optional. Per-tool overrides for the name and description shown to MCP clients. The underlying OpenAPI spec is unchanged. <!-- TODO: confirm the public preview property name. --> |
| `Mcp.Servers[].ToolOverrides[].OperationId` | string | The OpenAPI `operationId` (or `{method}_{path}`) of the tool to override. |
| `Mcp.Servers[].ToolOverrides[].Name` | string | Optional. Replaces the tool name shown to MCP clients (1–128 characters). |
| `Mcp.Servers[].ToolOverrides[].Description` | string | Optional. Replaces the tool description shown to MCP clients (≤ 256 characters). |
| `SiteAuth` | object | Optional. Identity provider metadata used to publish [protected resource metadata](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization#authorization-server-location) when App Service Authentication isn't enabled. See [Configure auth without App Service Authentication](#configure-auth-without-app-service-authentication). |
| `SiteAuth.Scopes` | array of strings | Required. OAuth scopes the MCP client should request—for example, `["api://my-app/user_impersonation"]`. |
| `SiteAuth.WellKnownOpenIdConfiguration` | string (URL) | Required if `Issuer` isn't set. URL to the OpenID Connect discovery document—for example, `https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration`. |
| `SiteAuth.Issuer` | string | Required if `WellKnownOpenIdConfiguration` isn't set. Token issuer URL—for example, `https://login.microsoftonline.com/{tenant}/v2.0`. |
| `SiteAuth.JwksUri` | string (URL) | Optional. JWKS endpoint for token signature validation. |
| `SiteAuth.Audience` | string | Optional. Expected `aud` claim value—for example, `api://my-app-client-id`. |

## Next steps

- [Configure built-in MCP server authorization](configure-authentication-mcp.md)
- [Secure MCP calls from Visual Studio Code with Microsoft Entra authentication](configure-authentication-mcp-server-vscode.md)
- [App Service as Model Context Protocol (MCP) servers](scenario-ai-model-context-protocol-server.md)
- [Choose an Azure service for your MCP server](/azure/container-apps/mcp-choosing-azure-service)

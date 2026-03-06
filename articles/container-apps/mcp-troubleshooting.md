---
title: Troubleshoot MCP servers on Azure Container Apps
description: Diagnose and fix common issues with MCP servers on Azure Container Apps, including connection, protocol, and authentication problems.
#customer intent: As a developer, I want to troubleshoot my MCP server on Azure Container Apps so that I can identify and resolve connection, protocol, deployment, and authentication issues.
ms.topic: troubleshooting
ms.service: azure-container-apps
ms.collection: ce-skilling-ai-copilot
ms.date: 02/19/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
---

# Troubleshoot MCP servers on Azure Container Apps

This article covers common problems you might encounter when deploying and consuming MCP servers on Azure Container Apps. The problems are organized by category and apply to both [standalone container apps and platform-managed dynamic sessions](mcp-overview.md), unless noted otherwise.

## Connection and ingress

Connection problems prevent MCP clients from reaching your server. These problems typically relate to ingress configuration, DNS, or network policies.

### MCP client can't reach the server

**Symptoms**: Connection timeout or DNS resolution failure when connecting from VS Code, GitHub Copilot, or another MCP client.

**Causes and solutions**:

| Cause | Solution |
|-------|----------|
| Ingress isn't set to `external` | Run `az containerapp ingress show` to verify. Set `external: true` for public access. |
| FQDN is incorrect | Run `az containerapp show --query properties.configuration.ingress.fqdn` to get the correct hostname. |
| TLS certificate problem | Container Apps provides managed TLS. If you use a custom domain, verify the certificate is bound correctly. |
| Client is behind a firewall | Ensure outbound HTTPS (port 443) is allowed to `*.azurecontainerapps.io`. |

### Wrong endpoint path

**Symptoms**: `404 Not Found` when connecting to the MCP server.

The correct endpoint path depends on your MCP SDK and routing configuration.

| Framework | Common endpoint path | Notes |
|-----------|----------------------|-------|
| .NET (`MapMcp`) | `/mcp` | Path matches the route in `MapMcp("/mcp")` |
| Python (FastMCP mounted on FastAPI) | `/mcp` | Mount the SDK app at `/` on FastAPI; the SDK adds `/mcp` |
| Python (FastMCP standalone) | `/mcp` | When running FastMCP directly without mounting |
| Node.js (Express) | `/mcp` | Path matches the Express route |
| Java (Spring Boot SSE) | `/mcp` | SSE transport; path set in `WebMvcSseServerTransportProvider` constructor |
| Platform-managed sessions | Value from `mcpServerEndpoint` | Full URL provided by the Azure Resource Manager (ARM) API; retrieve it from the session pool properties |

A common cause of 404 errors in Python is mounting the FastMCP app at `/mcp` instead of `/` on the FastAPI router. Since the SDK adds its own `/mcp` subpath, mounting at `/mcp` results in a `/mcp/mcp` endpoint. Mount at `/` so the final path is `/mcp`.

Verify the endpoint responds by testing with curl:

```bash
curl -X POST "https://<APP_NAME>.azurecontainerapps.io/mcp" \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","id":"1","method":"initialize"}'
```

### CORS errors in browser-based clients

**Symptoms**: `Access to fetch has been blocked by CORS policy` in the browser console.

> [!NOTE]
> GitHub Copilot in VS Code desktop doesn't use browser CORS. This problem only affects browser-based MCP clients or VS Code for the Web.

**Solution**: Configure CORS on the container app:

```azurecli
az containerapp ingress cors update \
    --name <APP_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --allowed-origins "https://your-trusted-domain.com" \
    --allowed-methods "GET" "POST" "OPTIONS" \
    --allowed-headers "Content-Type" "Authorization" "Mcp-Session-Id"
```

> [!WARNING]
> For troubleshooting, you can temporarily set `--allowed-origins "*"`. For production deployments, restrict allowed origins to specific trusted domains. See [Secure MCP servers on Container Apps](mcp-authentication.md) for guidance.

## Protocol and transport

Protocol errors occur when the JSON-RPC messages between the MCP client and server are malformed or use mismatched transports.

### "Method not found" response

**Symptoms**: JSON-RPC response with `error.code: -32601`.

**Causes**:

- Sending a request before `initialize`. Always send `initialize` first.
- Misspelled method name. Use `tools/list`, `tools/call` (with a forward slash, not dot notation).
- Using SSE method names with HTTP transport or vice versa.

### Missing or malformed JSON-RPC envelope

**Symptoms**: `400 Bad Request` or `Parse error (-32700)`.

**Solution**: Ensure every request includes the required JSON-RPC fields:

```json
{
    "jsonrpc": "2.0",
    "id": "unique-request-id",
    "method": "tools/call",
    "params": { ... }
}
```

The `id` must be a string or number. The `jsonrpc` field must be exactly `"2.0"`.

### Transport mismatch

**Symptoms**: SSE client gets 404 or 405 errors. HTTP client gets unexpected `text/event-stream` content type.

MCP supports multiple transports. Ensure your client and server use the same transport.

| Server transport | Client should use |
|------------------|-------------------|
| Streamable HTTP (`StreamableHTTPServerTransport`) | HTTP POST to endpoint |
| SSE (`SSEServerTransport`) | SSE connection plus POST for messages |
| Platform-managed (sessions) | HTTP POST with `x-ms-apikey` header |

Most modern MCP SDKs default to streamable HTTP. If you're connecting to a server that uses SSE (common with older examples), switch your client to SSE mode.

> [!NOTE]
> The [Java tutorial](tutorial-mcp-server-java.md) uses the SSE transport (`WebMvcSseServerTransportProvider`) because the MCP Java SDK doesn't yet offer a stable streamable HTTP transport. When connecting from VS Code, select SSE and use `"type": "sse"` in `.vscode/mcp.json`.

## Deployment and scaling

Deployment issues prevent your container from starting or responding correctly. These problems typically relate to health probes, port configuration, or scaling settings.

### Container fails health checks

**Symptoms**: Container restarts repeatedly. Logs show health probe failures.

**Cause**: The default startup and liveness probes send HTTP GET requests to the container's port. MCP endpoints typically only accept POST requests.

**Solution**: Add a dedicated `GET /health` endpoint to your application that returns `200 OK`. Then, configure your container app probes to use this endpoint. Don't point health probes at the MCP endpoint.

The following example adds a startup probe pointing to a `/health` path:

```azurecli
az containerapp update \
    --name <APP_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --yaml probe-config.yaml
```

Where `probe-config.yaml` contains the probe configuration:

```yaml
properties:
  template:
    containers:
      - name: mcp-server
        probes:
          - type: startup
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 10
          - type: liveness
            httpGet:
              path: /health
              port: 8080
            periodSeconds: 30
```

### Port mismatch

**Symptoms**: Container starts but ingress returns `502 Bad Gateway`.

**Cause**: The container listens on a different port than what Container Apps ingress expects.

**Solution**: Verify the port configuration:

```azurecli
# Check the target port
az containerapp ingress show \
    --name <APP_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --query targetPort

# Update if needed
az containerapp ingress update \
    --name <APP_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --target-port 8080
```

Ensure the `PORT` environment variable in your application matches the target port.

### Cold start latency

**Symptoms**: First request takes 10 to 30 seconds after a period of inactivity.

**Cause**: Container Apps scales to zero by default. The first request triggers a cold start.

**Solutions**:

- Set minimum replicas to 1: `az containerapp update --name <APP_NAME> --resource-group <RESOURCE_GROUP> --min-replicas 1`
- Increase the health probe timeout to accommodate cold start time.
- For sessions MCP, the platform manages availability. The `coolDownPeriodInSeconds` setting controls individual session lifetime, not pool availability.

## Authentication

Authentication problems typically happen when you use the wrong credential type for your hosting model. The following table summarizes the correct authentication approach.

| Hosting model | Correct header | Common mistake |
|---------------|----------------|----------------|
| Standalone + built-in auth | `Authorization: Bearer <TOKEN>` | Using `x-ms-apikey` |
| Dynamic sessions MCP | `x-ms-apikey: <KEY>` | Using `Authorization: Bearer` |

### 401 Unauthorized: standalone container app

**Symptoms**: `401 Unauthorized` response when connecting to an MCP server with built-in authentication enabled.

**Checklist**:

1. Verify the bearer token is valid: `az account get-access-token --resource <APP_ID> --query accessToken`
1. Verify the token is sent in the `Authorization` header.
1. Check that the Microsoft Entra app registration's `audience` matches the resource you requested.
1. Verify the `--unauthenticated-client-action` setting. `Return401` blocks unauthenticated requests; `AllowAnonymous` lets them through.

### Authentication error: dynamic sessions MCP

**Symptoms**: Authentication error when calling the platform-managed MCP endpoint. The error might appear as an HTTP `401` response or as a JSON-RPC error message in the response body. The type of error depends on where in the request pipeline the failure occurs.

**Checklist**:

1. Verify the API key is sent via the `x-ms-apikey` header (not `Authorization`).
1. Verify the key is from `fetchMCPServerCredentials`, not from a different API.
1. If you recently regenerated the key, wait up to five minutes for the old key's cache to expire.
1. Check that `mcpServerSettings.isMCPServerEnabled` is `true` on the session pool.

For more information, see the [authentication guide](mcp-authentication.md).

## Dynamic sessions

Issues in this section apply only to the platform-managed MCP server in [dynamic sessions](/azure/container-apps/sessions). For standalone container app issues, see the preceding sections.

### Environment ID not found

**Symptoms**: `tools/call` response includes an error about the environment or session not existing.

**Causes**:

- The session expired (exceeded `coolDownPeriodInSeconds`).
- The `environmentId` wasn't extracted correctly from the `launchShell` response.
- You're using an environment ID from a different session pool.

**Solution**: Call `launchShell` again to create a new environment.

### MCP not enabled on session pool

**Symptoms**: No `mcpServerEndpoint` in the session pool properties.

**Solution**: Verify MCP is enabled:

```azurecli
az rest --method GET \
    --uri "https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.App/sessionPools/<SESSION_POOL_NAME>" \
    --uri-parameters api-version=2025-02-02-preview \
    --query "properties.mcpServerSettings"
```

If `isMCPServerEnabled` is `false` or the field is absent, redeploy the session pool with the `mcpServerSettings` block.

### Region availability

**Symptoms**: Deployment fails with a "not available in this region" error.

**Cause**: Dynamic sessions with MCP are available in a subset of Azure regions during preview.

**Solution**: Check the [sessions documentation](/azure/container-apps/sessions) for the current list of supported regions.

## Diagnose and debug

Use the following techniques to gather diagnostic information before filing a support request.

### Use the diagnose and solve problems tool

The Azure portal provides built-in diagnostics for your container app.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to your container app.
1. In the navigation bar, select **Diagnose and solve problems**.
1. Select a troubleshooting category relevant to your issue.

### View container logs

Stream logs from your container app to see application output and errors:

```azurecli
az containerapp logs show \
    --name <APP_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --follow
```

### Test by using curl before using MCP clients

Before configuring GitHub Copilot or other MCP clients, verify the server responds correctly by using curl:

```bash
# 1. Initialize
curl -sS -X POST "https://<APP_NAME>.azurecontainerapps.io/mcp" \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","id":"1","method":"initialize"}'

# 2. List tools
curl -sS -X POST "https://<APP_NAME>.azurecontainerapps.io/mcp" \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","id":"2","method":"tools/list"}'
```

If both commands return valid JSON-RPC responses, the server is working and the issue is likely in the client configuration.

### Inspect MCP logs in VS Code

If you're using GitHub Copilot as your MCP client, check the built-in MCP logs:

1. Open the **Output** panel (**View > Output**).
1. Select **GitHub Copilot Chat - MCP** from the dropdown.
1. Look for connection errors, authentication failures, or tool invocation problems.

## Related content

- [MCP servers on Azure Container Apps overview](mcp-overview.md)
- [Secure MCP servers on Container Apps](mcp-authentication.md)
- [Azure Container Apps troubleshooting](/azure/container-apps/troubleshooting)

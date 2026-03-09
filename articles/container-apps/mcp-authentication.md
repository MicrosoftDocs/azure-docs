---
title: Secure MCP servers on Azure Container Apps
description: Learn how to authenticate and authorize MCP servers on Azure Container Apps using Microsoft Entra ID or API key authentication.
#customer intent: As a developer, I want to secure my MCP server on Azure Container Apps so that only authorized clients can access my tools.
ms.topic: how-to
ms.service: azure-container-apps
ms.collection: ce-skilling-ai-copilot
ms.date: 02/19/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
---

# Secure MCP servers on Azure Container Apps

This article explains how to authenticate and secure MCP servers running on Azure Container Apps. The approach differs depending on whether you host a **standalone container app** or use the **platform-managed MCP server** in dynamic sessions.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.62.0 or later.
- An existing container app or session pool. If you don't have one, see the [MCP server tutorials](mcp-overview.md).

## Authentication models overview

Azure Container Apps supports two authentication models for MCP servers. The following table summarizes the key differences.

| Aspect | Standalone container app | Dynamic sessions MCP |
|--------|--------------------------|----------------------|
| Auth mechanism | Container Apps built-in authentication with Microsoft Entra ID | API key via `x-ms-apikey` header |
| Token type | OAuth 2.0 Bearer token | Opaque API key string |
| Identity provider | Microsoft Entra ID | Azure Resource Manager |
| Key/token rotation | Managed by Microsoft Entra ID | Regenerate via Azure Resource Manager API |
| Authorization scope | Configurable per application | Session pool level |
| Transport encryption | TLS (Container Apps ingress) | TLS (Container Apps sessions endpoint) |

## Standalone container app with Microsoft Entra ID authentication

When you deploy your own MCP server as a container app, you own the authentication layer. Use the Container Apps [built-in authentication](/azure/container-apps/authentication) feature backed by Microsoft Entra ID.

### Configure built-in authentication

The following steps register a Microsoft Entra ID application and enable built-in authentication on your container app.

1. Register an application in Microsoft Entra ID:

    ```azurecli
    APP_ID=$(az ad app create \
        --display-name "mcp-server-auth" \
        --sign-in-audience AzureADMyOrg \
        --query appId -o tsv)
    ```

1. Create a service principal:

    ```azurecli
    az ad sp create --id $APP_ID
    ```

1. Add a client secret:

    ```azurecli
    CLIENT_SECRET=$(az ad app credential reset --id $APP_ID --query password -o tsv)
    TENANT_ID=$(az account show --query tenantId -o tsv)
    ```

1. Enable built-in auth on the container app:

    ```azurecli
    az containerapp auth microsoft update \
        --name <CONTAINER_APP_NAME> \
        --resource-group <RESOURCE_GROUP> \
        --client-id $APP_ID \
        --client-secret $CLIENT_SECRET \
        --tenant-id $TENANT_ID \
        --issuer "https://login.microsoftonline.com/$TENANT_ID/v2.0" \
        --yes
    ```

1. Set the unauthenticated action to require login:

    ```azurecli
    az containerapp auth update \
        --name <CONTAINER_APP_NAME> \
        --resource-group <RESOURCE_GROUP> \
        --unauthenticated-client-action Return401
    ```

### Connect from an MCP client with a bearer token

When your MCP server requires a bearer token, configure token retrieval in your MCP client. The following example shows a `.vscode/mcp.json` configuration for GitHub Copilot:

```json
{
    "servers": {
        "my-mcp-server": {
            "type": "http",
            "url": "https://<CONTAINER_APP_NAME>.<REGION>.azurecontainerapps.io/mcp",
            "headers": {
                "Authorization": "Bearer ${input:mcpBearerToken}"
            }
        }
    },
    "inputs": [
        {
            "id": "mcpBearerToken",
            "type": "promptString",
            "description": "Enter your bearer token for the MCP server",
            "password": true
        }
    ]
}
```

> [!TIP]
> For development, get a token by using `az account get-access-token --resource $APP_ID --query accessToken -o tsv` and paste it when prompted. For automated workflows, integrate with your organization's token management system.

### Configure CORS

MCP clients that connect from web-based environments need CORS headers. Use the following command to configure CORS on your container app:

```azurecli
az containerapp ingress cors update \
    --name <CONTAINER_APP_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --allowed-origins "https://vscode.dev" "https://github.dev" \
    --allowed-methods "GET" "POST" "OPTIONS" \
    --allowed-headers "Content-Type" "Authorization" "Mcp-Session-Id" \
    --max-age 3600
```

The following headers are key to allow:

- `Content-Type`: required for JSON-RPC requests
- `Authorization`: required for bearer token auth
- `Mcp-Session-Id`: used by MCP clients for stateful sessions

> [!NOTE]
> GitHub Copilot connects to remote MCP servers from the VS Code desktop app, not from a browser. CORS is only needed if you intend to support browser-based MCP clients or VS Code for the Web. The standalone tutorials use wildcard CORS origins for simplicity; for production, restrict to specific trusted origins as shown here.

### Security recommendations for standalone MCP servers

Apply the following best practices to harden your standalone MCP server.

- **Network restrictions**: Use [IP restrictions](/azure/container-apps/ip-restrictions) or [virtual network integration](/azure/container-apps/vnet-custom) to limit access to known client IPs.
- **Rate limiting**: Implement rate limiting in your application code or front the app with Azure API Management.
- **Input validation**: Validate all tool arguments in your MCP server code. MCP tool inputs are arbitrary JSON. Treat them as untrusted.
- **Stateless design**: Prefer stateless MCP servers to avoid session-hijacking risks. In most MCP SDKs, this means disabling server-side session ID generation (for example, `sessionIdGenerator: undefined` in TypeScript or `stateless_http=True` in Python).
- **Health probes**: Configure health probes on a separate endpoint (such as `/healthz`), not on the MCP endpoint. MCP endpoints expect JSON-RPC POST requests and return errors for plain GET probes.

## Dynamic sessions with API key authentication

> [!IMPORTANT]
> The platform-managed MCP server for dynamic sessions is in **preview**. The API version `2025-02-02-preview` and `mcpServerSettings` properties are subject to change.

The platform-managed MCP server in dynamic sessions uses API key authentication. The key is scoped to the session pool and grants access to all tools and sessions in the pool.

### API key authentication flow

The following steps describe how API key authentication works for dynamic sessions.

1. The client sends a JSON-RPC request with the `x-ms-apikey` header.
1. The session pool proxy validates the key against the Azure control plane.
1. If the key is valid, the request is forwarded to the session. If not, an authentication error is returned.

### Retrieve the API key

Use the following command to fetch the API key for your session pool.

```azurecli
API_KEY=$(az rest --method POST \
    --uri "https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.App/sessionPools/<SESSION_POOL_NAME>/fetchMCPServerCredentials" \
    --uri-parameters api-version=2025-02-02-preview \
    --query "apiKey" -o tsv)
```

### Rotate and cache the API key

You can regenerate the API key at any time. The platform caches validation results for up to five minutes, so previously valid keys might continue to work after regeneration until the cache expires.

To rotate the API key, call the `regenerateCredentials` action on the session pool:

```azurecli
az rest --method POST \
    --uri "https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.App/sessionPools/<SESSION_POOL_NAME>/regenerateCredentials" \
    --uri-parameters api-version=2025-02-02-preview
```

After regeneration, retrieve the new key by using `fetchMCPServerCredentials` as shown earlier.

### Security recommendations for dynamic sessions

Apply the following best practices to secure your dynamic sessions MCP deployment.

- **API key scope**: The API key grants access to the entire session pool. Any client with the key can create environments and execute code. Don't share the key with untrusted parties.
- **Environment isolation**: Each session runs in a Hyper-V-isolated container. Code execution in one session can't access another session's data.
- **Network egress**: Control whether sessions can access the internet by using `sessionNetworkConfiguration.status`. Set to `EgressDisabled` if the sessions don't need external network access.
- **Session lifetime**: Configure `coolDownPeriodInSeconds` to automatically destroy idle sessions. This setting limits the window of exposure if a session is compromised.
- **Secret storage**: Store the API key in [Azure Key Vault](/azure/key-vault/general/overview) or [Container Apps secrets](/azure/container-apps/manage-secrets) rather than in code or configuration files.

## Common authentication mismatches

A common mistake is using the API key header (`x-ms-apikey`) with a standalone container app, or using a bearer token with the sessions MCP endpoint. The following table shows what happens when you mix them up.

| Mismatch | Result |
|----------|--------|
| `x-ms-apikey` header sent to standalone app | Header is ignored; request hits built-in authentication and returns `401` if auth is enabled |
| `Authorization: Bearer` sent to sessions MCP | Key validation fails and returns `401` |

Make sure your MCP client configuration matches the hosting model you deployed.

## Related content

- [MCP servers on Azure Container Apps overview](mcp-overview.md)
- [Authentication and authorization in Azure Container Apps](/azure/container-apps/authentication)
- [Microsoft Entra ID authentication](/azure/container-apps/authentication-azure-active-directory)
- [Dynamic sessions overview](/azure/container-apps/sessions)
- [Manage secrets in Container Apps](/azure/container-apps/manage-secrets)
- [Configure CORS for Container Apps](/azure/container-apps/cors)
- [Troubleshoot MCP servers on Container Apps](mcp-troubleshooting.md)

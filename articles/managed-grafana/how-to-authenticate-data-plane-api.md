---
title: Authenticate to Azure Managed Grafana Data Plane APIs
description: Get a Microsoft Entra token for Azure Managed Grafana data plane APIs, use the correct audience value, and start calling Grafana APIs.
ms.service: azure-managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 05/28/2026
#customer intent: As a developer, I want to authenticate to Azure Managed Grafana data plane APIs with Microsoft Entra ID so that I can call Grafana APIs programmatically.
---

# Authenticate to Azure Managed Grafana data plane APIs with Microsoft Entra ID

This article shows how to get a Microsoft Entra ID access token for Azure Managed Grafana data plane APIs so you can call Grafana APIs programmatically.

Use the Azure Managed Grafana audience `https://dashboard.azure.com` for Microsoft Entra ID authentication to Azure Managed Grafana data plane APIs.

Choose one token acquisition method based on your scenario.

## Prerequisites

- An Azure account with an active subscription.
- An Azure Managed Grafana workspace. If you don't have one, [create an Azure Managed Grafana workspace](./quickstart-managed-grafana-portal.md).
- A user, service principal, or managed identity with an Azure Managed Grafana role assignment, like Grafana Viewer, Grafana Editor, or Grafana Admin. To assign roles, see [Manage access and permissions for users and identities](./how-to-manage-access-permissions-users-identities.md).

## Choose a token acquisition method

### Option 1: Azure CLI (interactive testing)

Run this command to get an access token for the Azure Managed Grafana audience:

```azurecli
az account get-access-token --resource https://dashboard.azure.com --query accessToken -o tsv
```

If you plan to run the validation command in this article, store the token in a shell variable:

```bash
TOKEN=$(az account get-access-token --resource https://dashboard.azure.com --query accessToken -o tsv)
```

### Option 2: Code (application and automation scenarios)

Request a token for this scope when you use managed identity or service principal authentication in code: `https://dashboard.azure.com/.default`.

Use `DefaultAzureCredential` as shown in this Python example:

```python
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()
token = credential.get_token("https://dashboard.azure.com/.default")
print(token.token)
```

## Validate API access

After you get a token, run a quick call to validate authentication and permissions. Replace `<grafana-endpoint-URL>` with your endpoint URL.

If you used the code option, set a shell variable from your token value before running `curl`:

```bash
TOKEN="<access-token>"
```

```bash
GRAFANA_ENDPOINT="<grafana-endpoint-URL>"

curl -i -H "Authorization: Bearer $TOKEN" "$GRAFANA_ENDPOINT/api/org"
```

Expected result: an HTTP `200` response with a valid JSON body. Response headers can vary between requests.

Use the same `Authorization: Bearer` header pattern to call other Azure Managed Grafana data plane API endpoints.

## Troubleshoot

If a request fails with `401` or an authorization error:

- Check that the token audience is `https://dashboard.azure.com`.
- Check that the caller has a Grafana role assignment on the Azure Managed Grafana resource.
- If role assignments changed recently, wait a few minutes and retry.

For more help, see [Troubleshoot common Azure Managed Grafana issues](./troubleshoot-managed-grafana.md).

## Related content

- [Configure an Azure Managed Grafana remote MCP server](./grafana-mcp-server.md)
- [How to use service accounts in Azure Managed Grafana](./how-to-service-accounts.md)
- [Data plane APIs](https://aka.ms/managed-grafana/docs/http-api)
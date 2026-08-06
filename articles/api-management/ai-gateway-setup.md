---
title: Get started with the AI Gateway tier (preview) setup wizard
titleSuffix: Azure API Management
description: Use the AI Gateway tier (preview) setup wizard to import Foundry models, discover MCP servers, and configure monitoring for your gateway.
ms.service: azure-api-management
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 07/23/2026
ms.custom: references_regions
---

# Get started with the AI Gateway tier (preview) setup wizard

[!INCLUDE [api-gateway-tier-preview](./includes/preview/preview-ai-gateway-tier.md)]

Use the portal setup wizard to configure your AI Gateway SKU tier (preview) for first-time use by discovering resources you already have in Azure and connecting to them.

In this article, you learn how to import Microsoft Foundry model deployments and discover and register Azure-hosted Model Context Protocol (MCP) servers as tool backends.

## Prerequisites

- An AI Gateway tier instance. To create one, see [Quickstart: Create an AI Gateway tier instance](./quickstart-ai-gateway-create.md).
- Permission to sign in and manage the AI Gateway tier instance with Microsoft Entra ID.
- **Reader** access on any Azure subscriptions you want to scan for models or MCP servers.
- Additional per-feature permissions, described in each step, that are only required when you import or connect assets.

## Configure your gateway for first-time use

Follow these steps to start discovering assets in your environment:

1. Open the `AI Gateway tier portal` and sign in with Microsoft Entra ID.

1. Select the gateway you want to configure.

1. Under **Home**, **Configure your gateway**, select **Get started**.

   :::image type="content" source="./media/ai-gateway-setup/aigw-configure-your-gateway-home.png" lightbox="./media/ai-gateway-setup/aigw-configure-your-gateway-home.png" alt-text="Screenshot of the AI Gateway tier portal in a newly created resource."  :::

   > [!TIP]
   > **Not seeing "Configure your gateway" tile?** The homepage of the portal shows the quickstart configuration wizard only when the resource is empty. You can start the setup page directly by going to `/settings/start`.

The wizard opens with the step list on the left and a preview pane on the right that shows the assets each step creates.

## Import Foundry models

Discover Microsoft Foundry model deployments across your subscriptions and register them on the gateway so applications can call them through one governed endpoint.

To import models:

1. Select **Import Foundry models**.

1. Select one or more **subscriptions** to scan. Optionally, apply a **resource group** filter to narrow the results.

1. Review the discovered accounts. Deployments are grouped by their parent Foundry account (the Azure resource). Selection is **per account**: when you select an account, the wizard imports all of its model deployments.

   :::image type="content" source="./media/ai-gateway-setup/aigw-foundry-select-accounts.png" lightbox="./media/ai-gateway-setup/aigw-foundry-select-accounts.png" alt-text="A screenshot showing multiple Foundry accounts selected with models to import."  :::

1. Choose a **backend authentication** method for this import:

   - **Key-based** (default). The gateway stores the account's API key and sends it in the `api-key` header. The wizard retrieves the key at import time.
   - **Managed identity (Microsoft Entra ID)**. The gateway authenticates with its managed identity. If the gateway has no managed identity, the wizard enables a system-assigned identity. If one already exists, you choose which identity to use. The wizard grants the identity the **Foundry User** role on each selected account.

1. Select **Import**.

1. When you select **Import**, the wizard runs a **Verifying requirements** check for each selected account before it creates anything. This check confirms that authentication is configured correctly and that model names don't conflict with models already on the gateway. Accounts that pass are imported; accounts that fail are skipped with an inline warning, and the rest of the run continues.

For each imported account, the wizard reuses or creates a model provider named after the account and registers every deployment as a model on the gateway.

> [!IMPORTANT]
> AI Gateway SKU tier (preview) requires model names to be unique. If a deployment's name collides with a *different* existing model, that deployment is reported as a conflict and skipped. A deployment that matches a model already imported from the same resource is treated as already imported and skipped.
>
> :::image type="content" source="./media/ai-gateway-setup/aigw-foundry-model-taken.png" lightbox="./media/ai-gateway-setup/aigw-foundry-model-taken.png" alt-text="A screenshot showing a model import skipped because of model name already taken."  :::

### Permissions for importing models

To import models from Microsoft Foundry accounts, you need the following permission levels:

| Authentication method | Required permissions |
| --- | --- |
| Discovery (both methods) | **Reader** on the subscriptions and accounts to be scanned. |
| Key-based | Local authentication (API keys) enabled on the account, and permission to list keys on it (for example, **Cognitive Services Contributor** or another role with the `listKeys` action). |
| Managed identity | Write access on the gateway resource if the identity must be enabled, and **User Access Administrator** or **Owner** on each account to assign the Foundry User role. If the identity already has sufficient access, the role assignment is skipped. |

## Discover MCP servers

Scan your subscriptions for Azure-hosted MCP servers and register the ones you select as remote MCP tool backends on the gateway.

To discover and register servers:

1. Select **Discover MCP servers**.
1. Select one or more **subscriptions** to scan. Optionally, apply a **resource group** filter. Select **Refresh** to run discovery again.

   :::image type="content" source="./media/ai-gateway-setup/aigw-mcp-select-resources.png" lightbox="./media/ai-gateway-setup/aigw-mcp-select-resources.png" alt-text="A screenshot showing multiple MCP server resources selected for import in the gateway."  :::

1. Review the discovered servers. The wizard discovers MCP servers from the following sources. Servers that are ready to connect are preselected. You can also choose to add additional resources as MCP servers. Azure API Management service APIs can be converted to MCP servers and registered.

   | Source | Discovery |
   | --- | --- |
   | API Center (APIs of kind `mcp`) | Preselected |
   | API Management (MCP APIs, and REST APIs exposed as MCP) | Preselected |
   | API Management (APIs) | Suggested |
   | Azure Functions (MCP tool trigger binding) | Preselected |
   | Logic Apps (Standard) that return MCP servers | Preselected |
   | Container Apps session pools with an MCP endpoint | Preselected |
   | Any resource with an `mcp` tag | Suggested |

1. Configure **Authentication** for each selected server. The wizard suggests a method based on the source and can retrieve credentials automatically when supported.

   :::image type="content" source="./media/ai-gateway-setup/aigw-mcp-keys-auto.png" lightbox="./media/ai-gateway-setup/aigw-mcp-keys-auto.png" alt-text="A screenshot showing a resource's authentication configuration detected automatically."  :::

1. Select any of the **Authentication** values to change them to another supported method:

   :::image type="content" source="./media/ai-gateway-setup/aigw-mcp-auth-select.png" lightbox="./media/ai-gateway-setup/aigw-mcp-auth-select.png" alt-text="A screenshot showing how to change the authentication configuration for a specific discovered resource."  :::

1. Choose the method each server's backend requires:

   - **None** — the backend requires no authentication.
   - **Keys** — the backend expects a key in a header, such as `x-functions-key` for Azure Functions or Logic Apps. Provide the header name and secret.
   - **Managed identity** — the gateway uses a Microsoft Entra token from its identity.

   > [!NOTE]
   > Import is blocked for any selected server whose header authentication is incomplete, so a backend that requires a key is never registered with no authentication.

1. Select **Import**. Successfully imported resources are indicated.

   :::image type="content" source="./media/ai-gateway-setup/aigw-mcp-completed.png" lightbox="./media/ai-gateway-setup/aigw-mcp-completed.png" alt-text="A screenshot showing 4 MCP servers correctly imported."  :::


### Permissions and limitations for MCP discovery

To successfully complete the import, you need the following permission levels:

| Requirement | Detail |
| --- | --- |
| Discovery | **Reader** across the scanned subscriptions, plus read access to the specific apps being inspected (for example, Azure Functions and Logic Apps control-plane reads). |
| Header authentication | Ability to supply the secret, or permission to auto-retrieve the API Management subscription key. |
| Managed identity | The gateway needs a managed identity configured and the appropriate permissions assigned to the resource. |

> [!NOTE]
> Discovery is declarative and based on Azure Resource Manager signals. The wizard doesn't probe live endpoints or perform a `.well-known` handshake, which is why results carry confidence levels. Cold or unhealthy apps are skipped after a short timeout so one slow app can't stall the scan. Registered servers are workspace-scoped, and name collisions are disambiguated with numeric suffixes.

## Explore your gateway

The final step confirms that setup is complete. From here, use the quick links to continue:

- **Discover your assets** — browse the models and tools you registered.
- **Manage your keys** — create and manage the runtime access keys that applications use to call the gateway.

Select **Close** to return to the home page.

## Supported scenarios

The portal setup wizard discovers and imports two kinds of assets into your gateway. The following table lists each importable asset, the source types it discovers from, and the backend authentication methods it supports for each source.

| Asset | Source type | Azure resource | Supported authentication methods |
| --- | --- | --- | --- |
| **Foundry models** | Microsoft Foundry | `Microsoft.CognitiveServices` accounts and deployments | **Keys**<br />**Managed Identity** |
| **MCP servers** | API Center | `Microsoft.ApiCenter/services/workspaces/apis` | **None**<br />**Keys**<br />**Managed Identity** |
| **MCP servers** | API Management — MCP server | `Microsoft.ApiManagement/service/apis` | **None**<br />**Keys** (APIM subscription key)<br />**Managed Identity** |
| **MCP servers** | API Management — passthrough to external backend | `Microsoft.ApiManagement/service` | **None**<br />**Keys** (custom header)<br />**Managed Identity** |
| **MCP servers** | Azure Functions (MCP extension) | `Microsoft.Web/sites` | **Keys** (Functions MCP extension key, `x-functions-key`, auto‑retrieved)<br />**Managed Identity**<br />**OAuth 2.0** |
| **MCP servers** | Logic Apps (Standard) | `Microsoft.Web/sites` | **Keys** (host key, `x-functions-key`)<br />**Managed Identity**<br />**OAuth 2.0** |
| **MCP servers** | Container Apps session pool (dynamic sessions) | `Microsoft.App/sessionPools` | **Keys** (pool API key, `x-ms-apikey`, auto‑retrieved)<br />**Managed Identity** |
| **MCP servers** | Tagged resource | Azure Resource Graph (tag‑based, user‑declared endpoint) | **None**<br />**Keys** (custom header)<br />**Managed Identity** |

## Troubleshooting

- **A step shows "Select a gateway."** The wizard operates on the selected gateway. Select a gateway in the portal before importing or connecting assets.
- **Discovery returns fewer resources than expected.** Discovery only returns resources your account can see. Confirm you have **Reader** access on the target subscriptions. A per-subscription discovery failure shows a warning and returns a partial list.
- **An account or server fails to import.** Failures are isolated per item. Select the inline warning to copy the full error, fix the underlying permission or configuration problem, and run the import again. The items that passed are already imported.
- **Foundry validation fails on import.** Check that local authentication (API keys) is enabled for key-based import, or that the gateway identity has the required role for managed identity. Model names must be unique within the gateway; a name that collides with a different resource is reported as a conflict and skipped.
- **An MCP server can't be imported.** Confirm that header authentication has both a header name and secret, or that the gateway identity can obtain the required token. Use **Refresh** to run discovery again after you fix the backend.

## Related content

- [AI Gateway tier overview](./ai-gateway-overview.md)
- [Quickstart: Create an AI Gateway tier instance](./quickstart-ai-gateway-create.md)
- [Manage models and tools](./ai-gateway-manage-models-tools.md)
- [Govern, secure, and operate AI Gateway tier](./ai-gateway-govern-secure-assets.md)

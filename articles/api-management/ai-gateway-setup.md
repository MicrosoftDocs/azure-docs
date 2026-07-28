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

# Get started with the AI Gateway tier (preview)

[!INCLUDE [api-gateway-tier-preview](./includes/preview/preview-ai-gateway-tier.md)]

The setup wizard is a guided, first-run experience that helps you configure a new AI Gateway tier (preview) gateway. Instead of adding each asset by hand, the wizard discovers resources you already have in Azure and connects them to the gateway in a few steps. Use it to import Microsoft Foundry model deployments, discover and register Azure-hosted Model Context Protocol (MCP) servers as tool backends, and connect monitoring.

The wizard is a convenience layer over the same operations that the individual portal pages use. Everything it does is optional, and you can change or reverse any of it later from the portal.

## Supported scenarios

The wizard discovers and imports two kinds of assets into your gateway. The table below lists each importable asset, the source types the wizard discovers it from, and the backend authentication methods supported for each source.

| Asset | Source type | Discovered from (Azure resource) | Supported authentication methods |
| --- | --- | --- | --- |
| **Foundry models** | Microsoft Foundry / Azure AI Services accounts | `Microsoft.CognitiveServices` accounts & deployments (per subscription) | **Keys** (API key, sent as `api-key`) · **Microsoft Entra ID** (gateway managed identity) |
| **MCP servers** | API Center | `Microsoft.ApiCenter/services/workspaces/apis` | **None** · **Keys** (custom header) · **Managed Identity** |
| **MCP servers** | API Management — REST API exposed as MCP | `Microsoft.ApiManagement/service` | **None** · **Keys** (APIM subscription key, `Ocp-Apim-Subscription-Key`) |
| **MCP servers** | API Management — hosted MCP server | `Microsoft.ApiManagement/service` | **None** · **Keys** (APIM subscription key) |
| **MCP servers** | API Management — passthrough to external backend | `Microsoft.ApiManagement/service` | **None** · **Keys** (custom header) · **Managed Identity** |
| **MCP servers** | Azure Functions (MCP extension) | `Microsoft.Web/sites` | **Keys** (Functions MCP extension key, `x-functions-key`, auto‑retrieved) · **Managed Identity** · **OAuth 2.0** |
| **MCP servers** | Logic Apps (Standard) | `Microsoft.Web/sites` | **Keys** (host key, `x-functions-key`) · **Managed Identity** · **OAuth 2.0** |
| **MCP servers** | Container Apps session pool (dynamic sessions) | `Microsoft.App/sessionPools` | **Keys** (pool API key, `x-ms-apikey`, auto‑retrieved) · **Managed Identity** (Entra token, audience `https://dynamicsessions.io`) |
| **MCP servers** | First‑party Azure service | Azure Resource Graph (user‑declared endpoint) | **None** · **Keys** (custom header) · **Managed Identity** |
| **MCP servers** | Tagged resource | Azure Resource Graph (tag‑based, user‑declared endpoint) | **None** · **Keys** (custom header) · **Managed Identity** |


## Prerequisites

- An AI Gateway tier instance. To create one, see [Quickstart: Create an AI Gateway tier instance](./quickstart-ai-gateway-create.md).
- Permission to sign in and manage the AI Gateway tier instance with Microsoft Entra ID.
- **Reader** access on any Azure subscriptions you want to scan for models or MCP servers.
- Additional per-feature permissions, described in each step, that are only required when you import or connect assets.

## Run the configuration wizard

The wizard runs against the gateway that's currently selected in the portal. Select a gateway before you start; each step shows a **Select a gateway** prompt if none is selected.

1. Open the AI Gateway tier portal and sign in with Microsoft Entra ID.
1. Select the gateway you want to configure.
1. Go to **Home** > **Get started** > **Configure**, or open the setup page directly at the `/settings/start` route.

The wizard opens with the step list on the left and a preview pane on the right that shows the assets each step creates.

### Step 1: Import Foundry models

In this step, the wizard finds Microsoft Foundry model deployments across your subscriptions and registers them on the gateway so applications can call them through one governed endpoint.

To import models:

1. Select **Import Foundry models**.
1. Select one or more **subscriptions** to scan. Optionally, apply a **resource group** filter to narrow the results.
1. Review the discovered accounts. Deployments are grouped by their parent Foundry account (the Azure resource). Selection is **per account**: when you select an account, the wizard imports all of its model deployments.
1. Choose a **backend authentication** method for this import:
   - **Key-based** (default). The gateway stores the account's API key and sends it in the `api-key` header. The wizard retrieves the key at import time.
   - **Managed identity (Microsoft Entra ID)**. The gateway authenticates with its managed identity. If the gateway has no managed identity, the wizard enables a system-assigned identity. If one already exists, you choose which identity to use. The wizard grants the identity the **Foundry User** role on each selected account.
1. Select **Import**.

When you select **Import**, the wizard runs a **Verifying requirements** check for each selected account before it creates anything. This check confirms that authentication is configured correctly and that model names don't conflict with models already on the gateway. Accounts that pass are imported; accounts that fail are skipped with an inline warning, and the rest of the run continues.

For each imported account, the wizard reuses or creates one model provider named after the account and registers every deployment as a model on the gateway. If a deployment's name collides with a *different* existing model, that deployment is reported as a conflict and skipped. A deployment that matches a model already imported from the same resource is treated as already imported and skipped.

#### Permissions for importing models

| Authentication method | Required permissions |
| --- | --- |
| Discovery (both methods) | **Reader** on the subscriptions and accounts to be scanned. |
| Key-based | Local authentication (API keys) enabled on the account, and permission to list keys on it (for example, **Cognitive Services Contributor** or another role with the `listKeys` action). |
| Managed identity | Write access on the gateway resource if the identity must be enabled, and **User Access Administrator** or **Owner** on each account to assign the Foundry User role. If the identity already has sufficient access, the role assignment is skipped. |

> [!NOTE]
> The import unit is the account, not the individual deployment. Importing an account imports all of its deployments. If discovery fails for one subscription, the wizard shows a warning and returns a partial list rather than failing the whole scan.

### Step 2: Discover MCP servers

In this step, the wizard scans your subscriptions for Azure-hosted MCP servers and registers the ones you select as remote MCP tool backends on the gateway.

To discover and register servers:

1. Select **Discover MCP servers**.
1. Select one or more **subscriptions** to scan. Optionally, apply a **resource group** filter. Select **Refresh** to run discovery again.
1. Review the discovered servers. Each result includes a confidence level that reflects how strongly Azure signals identify it as an MCP server.
1. Select the servers to register. **Confirmed** servers are pre-selected. **Suggested** and **candidate** servers must be selected manually.
1. Configure **backend authentication** for each selected server. The wizard seeds a method based on the source, and you can override it.
1. Select **Import**.

The wizard discovers MCP servers from the following sources:

| Source | Confidence |
| --- | --- |
| API Center (APIs of kind `mcp`) | Confirmed |
| API Management (MCP APIs, and REST APIs exposed as MCP) | Confirmed |
| Azure Functions (MCP tool trigger binding) | Confirmed |
| Logic Apps (Standard) that return MCP servers | Confirmed |
| Container Apps session pools with an MCP endpoint | Suggested |
| Any resource with an `mcp-endpoint` tag | Suggested |

For backend authentication, choose the method each server's backend requires:

- **None** — the backend requires no authentication.
- **Keys** — the backend expects a key in a header, such as `x-functions-key` for Azure Functions or Logic Apps. Provide the header name and secret. For API Management APIs that use a subscription key, the wizard can retrieve the key automatically and falls back to manual entry if it can't.
- **Managed identity** — the gateway uses a Microsoft Entra token from its identity.

Import is blocked for any selected server whose header authentication is incomplete, so a backend that requires a key is never registered with no authentication.

#### Permissions and limitations for MCP discovery

| Requirement | Detail |
| --- | --- |
| Discovery | **Reader** across the scanned subscriptions, plus read access to the specific apps being inspected (for example, Azure Functions and Logic Apps control-plane reads). |
| Header authentication | Ability to supply the secret, or permission to auto-retrieve the API Management subscription key. |
| Managed identity | The gateway identity must be able to obtain the required Microsoft Entra token. |

> [!NOTE]
> Discovery is declarative and based on Azure Resource Manager signals. The wizard doesn't probe live endpoints or perform a `.well-known` handshake, which is why results carry confidence levels. Cold or unhealthy apps are skipped after a short timeout so one slow app can't stall the scan. Registered servers are workspace-scoped, and name collisions are disambiguated with numeric suffixes.

### Step 3: Configure monitoring

In this step, you connect an Application Insights resource to the gateway to collect metrics, traces, and logs. The wizard creates a telemetry exporter for the destination you choose.

To configure monitoring:

1. Select **Configure monitoring**.
1. Choose how to connect a destination:
   - **Create a new Application Insights resource**. The wizard provisions the resource through a deployment.
   - **Use an existing Application Insights resource**. Select a resource from the list.
1. Optionally, turn on **Log request and response payloads**.
1. Select the action to connect the destination.

If the gateway is already connected to a destination, the wizard shows the current destination and lets you disconnect or reconfigure it. You can also change the payload logging setting later.

> [!IMPORTANT]
> Payload logging is off by default. Turning it on can log sensitive request and response content and increase the volume of data collected. Enable it only when you understand the privacy implications for your workload.

To configure monitoring, you need permission to create Application Insights resources and deployments (for the create path) or read existing resources (for the connect path) in the gateway's subscription and resource group.

### Step 4: Explore your gateway

The final step confirms that setup is complete. From here, use the quick links to continue:

- **Discover your assets** — browse the models and tools you registered.
- **Manage your keys** — create and manage the runtime access keys that applications use to call the gateway.

Select **Close** to return to the home page.

## Troubleshooting

- **A step shows "Select a gateway."** The wizard operates on the selected gateway. Select a gateway in the portal before importing or connecting assets.
- **Discovery returns fewer resources than expected.** Discovery only returns resources your account can see. Confirm you have **Reader** access on the target subscriptions. A per-subscription discovery failure shows a warning and returns a partial list.
- **An account or server fails to import.** Failures are isolated per item. Select the inline warning to copy the full error, fix the underlying permission or configuration problem, and run the import again. The items that passed are already imported.
- **Foundry validation fails on import.** Check that local authentication (API keys) is enabled for key-based import, or that the gateway identity has the required role for managed identity. Model names must be unique within the gateway; a name that collides with a different resource is reported as a conflict and skipped.
- **An MCP server can't be imported.** Confirm that header authentication has both a header name and secret, or that the gateway identity can obtain the required token. Use **Refresh** to run discovery again after you fix the backend.

### Authentication method reference

| Method | Description |
| --- | --- |
| **None** | Anonymous endpoint — no backend authentication. |
| **Keys** | An API key / subscription key / host key sent in a request header. Retrieved automatically from ARM when the source and your permissions allow (APIM subscription key, Functions/Logic Apps host key, session‑pool key); otherwise entered manually. |
| **Managed Identity** | The gateway authenticates with a Microsoft Entra token issued to its system‑assigned or a user‑assigned managed identity, for the source's token audience. |
| **OAuth 2.0** | Authorization‑code flow — the gateway acquires and injects OAuth 2.0 tokens using a supplied authorization URL, token URL, and client registration. |

Notes:

• Keys covers several backend-specific headers ( api-key ,  Ocp-Apim-Subscription-Key ,  x-functions-key ,  x-ms-apikey ) — the wizard's picker shows the broad category "Keys" and resolves the exact header per source.
• The default suggested auth is picked from ARM signals, but users can override it per row from the supported set.
• Foundry model imports validate that local (key) auth is enabled before using Keys, or check identity/RBAC before using Entra ID.

## Related content

- [AI Gateway tier overview](./ai-gateway-overview.md)
- [Quickstart: Create an AI Gateway tier instance](./quickstart-ai-gateway-create.md)
- [Manage models and tools](./ai-gateway-manage-models-tools.md)
- [Govern, secure, and operate AI Gateway tier](./ai-gateway-govern-secure-assets.md)

---
title: Network Requirements for Azure SRE Agent
description: Review firewall allow list domains, authentication requirements, and network configuration for Azure SRE Agent connectivity.
ms.topic: reference
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: firewall, network, allow list, domain, prerequisites, connectivity
#customer intent: As a network administrator, I want to understand the network requirements for Azure SRE Agent so that I can configure my firewall and proxy settings correctly.
---

# Network requirements for Azure SRE Agent
This article describes the network and firewall configuration required for Azure SRE Agent connectivity.

## Required domains

Add the following domains to your firewall allow list for both HTTP and WebSocket traffic.

| Domain | Purpose |
|---|---|
| `*.azuresre.ai` | Agent portal, API, and real-time chat (WebSocket) |
| `sre.azure.com` | Agent management portal |
| `portal.azure.com` | Azure portal (for Monitor, Logs, and managed identity) |
| `api.applicationinsights.io` | Application Insights query API |

> [!WARNING]
> Zscaler and some corporate proxies block `*.azuresre.ai` by default. If the portal doesn't load or the chat interface is unresponsive:
>
> 1. Add `*.azuresre.ai` to your firewall allow list.
> 1. Ensure your proxy doesn't block WebSocket connections.
> 1. Try the portal in an incognito or private browser window to rule out extension conflicts.

## Authentication requirements

The agent must meet the following requirements for authentication.

| Requirement | Details |
|---|---|
| **Azure account** | Active Azure subscription |
| **RBAC permissions** | `Microsoft.Authorization/roleAssignments/write` (requires [Role Based Access Control Administrator](/azure/role-based-access-control/built-in-roles) or [User Access Administrator](/azure/role-based-access-control/built-in-roles)) |
| **Browser** | Modern browser with JavaScript enabled |

## Resources created during agent provisioning

When you create an agent, the process automatically creates the following resources in your resource group.

| Resource | Purpose |
|---|---|
| **Application Insights** | Agent telemetry and action logging |
| **Log Analytics workspace** | Backing store for Application Insights |
| **Managed identity** | Agent authentication for Azure resource access |

## Region availability

For the list of Azure regions where Azure SRE Agent is available, see [Supported regions](supported-regions.md).

## Next step

> [!div class="nextstepaction"]
> [Create your agent](./create-agent.md)

## Related content

- [Data privacy and residency](data-privacy.md)
- [Supported regions](supported-regions.md)
- [Permissions](permissions.md)

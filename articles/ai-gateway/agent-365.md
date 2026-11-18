---
title: Govern tools with Microsoft Agent 365 and AI Gateway
description: Learn how AI Gateway SKU in AI Gateway integrates with Microsoft Agent 365 to offer governance and control in the enterprise
author: santiagxf
ms.author: fasantia
ms.reviewer: fasantia
ms.date: 09/24/2026
ms.topic: how-to
ms.service: azure-api-management
---

# Govern tools with Microsoft Agent 365 and AI Gateway

Microsoft Agent 365 integrates with AI Gateway to provide centralized governance and runtime enforcement for Model Context Protocol (MCP) servers and tools. Together, they enable organizations to:

- Discover AI Gateway gateways and their MCP servers.
- Maintain a centralized MCP server inventory.
- Block or unblock MCP servers.
- Control access to individual tools.
- Collect runtime signals for auditing, observability, and incident response.

Existing agents can continue using their configured gateway endpoints.

> [!NOTE]
> This document applies to AI Gateway. See [support in Azure API management service](../api-management/agent-365.md).

## Prerequisites

To connect Microsoft Agent 365 to AI Gateway, you need:

- A Microsoft Agent 365 tenant.
- An AI Gateway instance.
- One or more MCP servers registered with AI Gateway.
  - To enable tool-level controls from Microsoft Agent 365, **ensure each MCP server has [a static list of allowed tools configured](https://ai.gateway.azure.com/docs/toolservers/tool-availability)**.
- Authorization to provide tenant-level consent (tenant-level administrator).

## How it works

The integration separates governance from runtime enforcement:

- **Microsoft Agent 365** defines governance intent, inventory, and access decisions.
- **AI Gateway** enforces policies inline for traffic to MCP servers and tools.
- Use **runtime signals** for monitoring, auditing, and investigation.

Microsoft Agent 365 discovers Azure resources of type `Microsoft.ApiManagement/aigateways` in the tenant. It then retrieves the MCP servers and tools exposed by those resources, along with available metadata such as endpoints, access scopes, and associated service identities.

## Grant access to Microsoft Agent 365

Microsoft Agent 365 needs consent to discover and perform governance operations on Azure subscriptions. A customer administrator grants the **A365 MCP Gateway Policy Operator** Azure role at the tenant level with a one-time consent.

The grant gives the Microsoft Agent 365 service identity the ability to:

- Read AI Gateway resources.
- Read API-scoped policies.
- Write API-scoped policies.
- Discover supported resources in existing and future tenant subscriptions.

To grant consent:

1. Go to the Microsoft Administration Center portal.

1. Ensure you have tenant administration permission level.

1. Under **Agents**, select **Settings**.

1. Select **Gateways**.

1. Enable **AI Gateway service and AI Gateway**. By consenting, you let this organization read the tools published through the AI gateway.

    :::image type="content" source="./media/agent-365/give-consent-azure-api-management.png" lightbox="./media/agent-365/give-consent-azure-api-management.png" alt-text="Screenshot of the consent granting page for Microsoft Azure gateways." :::

After you grant consent, governance operations run under Microsoft Agent 365's app-only identity. Individual Microsoft Agent 365 administrators don't need separate Azure permissions to perform actions over AI assets in the gateway.

## Discover gateways and MCP servers

After you enable the integration, Microsoft Agent 365:

> [!div class="checklist"]
> 1. Discovers supported AI Gateway resources in the tenant.
> 1. Adds discovered servers to the centralized inventory and displays available metadata.
> 1. Makes supported governance actions available to administrators.

To see MCP servers in gateways:

1. Go to Microsoft Administration Center portal.

2. Under **Agents**, select **Tools**.

4. Search for an MCP server or identify the ones where publisher is **AI Gateway**.

    :::image type="content" source="./media/agent-365/mcp-server-inventory.png" lightbox="./media/agent-365/mcp-server-inventory.png" alt-text="Screenshot of how MCP servers coming from gateways are displayed in the portal." :::

5. Select the MCP server to see its metadata.


## Control access to individual tools

Administrators can control which tools are available through an MCP server. Tool-level control lets an organization block selected tools without disabling the entire server. 

To block a tool:

1. Go to Microsoft Administration Center portal.

2. Under **Agents** select **Tools**.

3. Select the MCP Server you want to control.

4. Select the tab **Tools**.

5. Disable the tools you want to block. The following example blocks `delete_file`.

    :::image type="content" source="./media/agent-365/mcp-server-tool-level-block.png" lightbox="./media/agent-365/mcp-server-tool-level-block.png" alt-text="Screenshot of how to disable the tool a tool from the administration portal." :::

6. Once a tool is blocked, Microsoft Agent 365 uses AI Gateway control-plane operations to insert a managed policy to prevent execution. A blocked tool call results in a 200 response but agents receive a JSON-RPC response with `isError=True` and a description of the error. This behavior makes agents aware of the policy and restrain them from retrying.

    ```http
    HTTP/1.1 200 OK
    Content-Type: application/json
    x-correlation-id: aaaa0000-bb11-2222-33cc-444444dddddd

    {
      "jsonrpc": "2.0",
      "id": 42,
      "result": {
        "content": [
          {
            "type": "text",
            "text": "Tool 'delete_file' is blocked by the gateway. Do not retry this tool."
          }
        ],
        "isError": true,
        "_meta": {
          "com.microsoft.azure.ai.gateway/denial": {
            "code": "ToolNotAvailable",
            "correlationId": "aaaa0000-bb11-2222-33cc-444444dddddd"
          }
        }
      }
    }
    ```

7. When the MCP Server doesn't have [an static list of allowed tools configured](https://ai.gateway.azure.com/docs/toolservers/tool-availability#choose-which-tools-to-expose), Microsoft Agent 365 can't retrieve the list of tools available. In those cases, use the [AI Gateway portal](https://ai.gateway.azure.com) to block the tool.

    :::image type="content" source="./media/agent-365/mcp-server-tool-level-not-available.png" lightbox="./media/agent-365/mcp-server-tool-level-not-available.png" alt-text="Screenshot of an MCP Server not supporting tool discovery." :::


## Block or unblock an MCP server

When an administrator blocks an MCP server, Microsoft Agent 365 uses AI Gateway control-plane operations to insert a managed `return-response` policy at the beginning of the API's inbound policy.

To block a server:

1. Go to Microsoft Administration Center portal.

1. Under **Agents**, select **Tools**.

1. Select the MCP server you want to control.

1. Select the **Block** option.

1. The gateway returns HTTP status `403` for requests to that MCP server. Unblocking the server removes the managed policy.

    ```http
    HTTP/1.1 403 Forbidden
    Content-Type: application/json
    x-correlation-id: aaaa0000-bb11-2222-33cc-444444dddddd

    {
      "error": {
        "code": "AccessBlockedByGateway",
        "message": "Access to server 'github-mcp' is blocked.",
        "target": "github-mcp",
        "correlationId": "aaaa0000-bb11-2222-33cc-444444dddddd"
      }
    }
    ```

## Tool threat protection for Microsoft Agent 365

Microsoft Agent 365 integrates with Microsoft Defender and Microsoft Purview to provide advanced threat protection for tools.

Azure administrators can configure policies in the gateway to ensure MCP servers registered in the AI Gateway are protected before tools are invoked and before their results get into the agent.

To learn more about how this capability works, see [Protect tool calls with Defender and Purview in AI Gateway](policy-tool-threat.md).

## Preview limitations

Consider the following limitations when using the integration with Microsoft Agent 365:

- Tool-level governance for MCP servers with dynamic allowed tools isn't available. [Use a static list of tools](https://ai.gateway.azure.com/docs/toolservers/tool-availability#choose-which-tools-to-expose).

> [!NOTE]
> Microsoft Agent 365 doesn't automatically route agents through a customer-hosted gateway. An agent developer must configure the agent to use the gateway's MCP endpoint. To prevent direct access, restrict MCP server connectivity so the gateway is the only permitted caller or use private networking or network-level access controls when supported.

## Related content

- [AI Gateway concepts](concepts.md)
- [AI Gateway in-product documentation](https://ai.gateway.azure.com/docs)
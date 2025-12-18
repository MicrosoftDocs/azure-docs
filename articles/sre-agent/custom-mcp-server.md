---
title: Connect Azure SRE Agent Preview to Custom MCP Server
description: Discover how to integrate Azure SRE Agent with external MCP servers. Set up secure connections to access telemetry, observability, and specialized tools.
#customer intent: As an Azure admin, I want to connect a custom MCP server to Azure SRE Agent so that I can integrate external domain-specific tools and data sources.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.date: 12/18/2025
ms.topic: article
ms.service: azure-sre-agent
---


# Connect to a custom MCP server in Azure SRE Agent Preview

Azure SRE Agent supports extending its capabilities by connecting to external Model Context Protocol (MCP) servers. By using custom MCP servers, the agent can access domain-specific tools and knowledge sources beyond the built-in integrations. This approach enables integration with remote services that expose MCP-compatible APIs. Once connected, the agent can query external telemetry, observability data, or specialized tools provided by the MCP server. This setup is ideal for organizations that rely on external monitoring systems or proprietary operational platforms.

You must host custom MCP servers remotely and make them reachable over HTTPS. SRE Agent doesn't support running MCP servers locally within its compute environment. The MCP server determines the authentication method and protocols it supports.

## Prerequisites

Before establishing a connection, ensure that you have:

- **Azure subscription**: An Azure subscription with access to an Azure SRE Agent resource.

- **Permissions**: Sufficient RBAC permissions to modify connectors (for example, Owner, Contributor, or equivalent custom role).

- **Server endpoint**: The base URL of the MCP server endpoint.

- **Connection info**: Authentication information required by the MCP server, such as API keys, bearer tokens, or custom header fields.

> [!IMPORTANT]
> After you connect your custom MCP server, you must create and configure a subagent to use the tools provided by the MCP server. The tools from your custom MCP server are only accessible through subagents and aren't directly accessible to main Azure SRE Agent.

## How custom MCP connections work

Azure SRE Agent uses connectors to integrate with external systems. A connector defines:

- The MCP server endpoint.
- The transport protocol (SSE or HTTP).
- The authentication mechanism.

When you create the connector, it exposes the set of MCP tools available from the external MCP server. These tools become available for use in [subagents](subagent-builder-overview.md).

## Add a custom MCP server connector

Follow these steps to create a connector for your custom MCP server.

1. Go to your agent in the Azure portal.

1. Select *Settings* → **Connectors**.

1. Select **Add connector**.

1. Choose **MCP server** as the connector type.

1. Enter the following values: 

    | Field | Description |
    |-------|-------------|
    | **Name** | A descriptive name for your MCP connector. |
    | **Connection type** | Typically `SSE` (Server-Sent Events) or `HTTP`, depending on what your MCP server supports. |
    | **MCP server URL** | The external base URL of the MCP server (must be reachable via HTTPS). |
    | **Authentication** | Provide required fields such as API keys, tokens, or custom headers. |

1. Validate the connection by verifying that it appears in the connectors list with a **Connected** status.

    If the connector fails to validate:

    - Confirm that the URL is correct.
    - Ensure credentials are valid and aren't expired.
    - Check whether the MCP server supports the chosen protocol.
    - Resolve any network restrictions that block outbound calls.

## Security and governance considerations

When connecting external MCP servers to Azure SRE Agent, follow security best practices to protect credentials and maintain operational integrity.

- Always use dedicated authentication credentials for SRE Agent.
- Rotate API keys regularly.
- Avoid storing credentials in shared or unsecured locations.
- Ensure your MCP server is externally hosted. SRE Agent doesn't run MCP workloads locally.

## Troubleshooting

If you encounter problems while connecting to or using a custom MCP server, review these common scenarios and resolutions:

- **Authentication errors**: Regenerate or verify API keys.

- **Unsupported protocol**: Ensure the MCP server supports SSE or HTTP as configured.

- **Tools not visible**: Some MCP servers expose tools after the initial handshake. Refresh the connector or check the server configuration.

- **Intermittent connection problems**: The MCP endpoint might enforce rate limits or experience latency.

## Related content

- [Create subagents in Azure SRE Agent](subagent-builder-overview.md)

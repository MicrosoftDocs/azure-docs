---
title: What is Azure IoT Operations MCP? (preview)
description: Learn about the Azure IoT Operations MCP server, client authentication, and policy-based tool access.
author: ancaantochi
ms.author: ancaantochi
ms.service: azure-iot-operations
ms.topic: overview
ms.date: 10/15/2026
ai-usage: ai-assisted
---

# What is Azure IoT Operations MCP? (preview)

The Azure IoT Operations Model Context Protocol (MCP) server exposes tools for Azure IoT Operations documentation, resources, and permitted operational tasks. MCP-compatible clients access these tools through MCP Gateway, which authenticates callers and applies authorization policies before forwarding requests to the server.

The Azure IoT Operations MCP capability contains two components:

| Component | Responsibility |
| --- | --- |
| **MCP Gateway** | Authenticates callers, evaluates per-connection authorization policies, and routes MCP tool calls to registered servers. |
| **Azure IoT Operations MCP** | Provides tools for Azure IoT Operations documentation, resources, and permitted operational tasks. |

The Azure IoT Operations operator deploys both components together. ARM manages the `MCPServerConnection` and `MCPAuthorizationPolicy` resources. The operator reconciles those resources into the configuration used by MCP Gateway.

> [!IMPORTANT]
> MCP in Azure IoT Operations is in preview. Use a nonproduction environment to evaluate the preview and the examples in this article. The examples use ARM API version `2026-11-01-preview` and require an extension version with compatible MCP custom resource definitions (CRDs).

MCP is enabled by default for new Azure IoT Operations deployments that use an instance template with MCP support. The deployment includes **MCP Gateway and Azure IoT Operations MCP**, not the separate Kubernetes MCP server. You can [disable MCP](howto-deploy-mcp.md#disable-mcp-optional) if you don't need it, or optionally [install Kubernetes MCP](howto-deploy-kubernetes-mcp.md) and register it as another gateway connection. Clients must connect through MCP Gateway rather than directly to the backends.

## Access MCP tools

In-cluster clients authenticate by using Kubernetes service account tokens. Authorization policies determine which tools each caller can use based on the roles assigned to its ServiceAccount. Use the default policy or configure your own policy to restrict tool access.
For remote access, Azure API Management validates Microsoft Entra tokens and forwards requests through an Azure Relay Hybrid Connection to the in-cluster relay, which connects to MCP Gateway.
You can bring your own MCP-compatible agent. An optional sample agent demonstrates using MCP tools with a Foundry Local model; you don't need to deploy it to use Azure IoT Operations MCP. Its model authentication is separate from MCP authentication and authorization.



## Get started

1. [Verify the MCP deployment](howto-deploy-mcp.md) and its default connection.
2. [Configure MCP authorization](howto-configure-mcp-authorization.md) to review client authentication and customize tool access.
3. [Connect to MCP](howto-connect-ai-agent.md) by using your own MCP-compatible agent or, optionally, the sample agent.
4. [Expose MCP through Azure Relay](howto-deploy-mcp-relay.md) if your client runs outside the cluster.


## Related content

- [Troubleshoot MCP](troubleshoot-mcp.md)

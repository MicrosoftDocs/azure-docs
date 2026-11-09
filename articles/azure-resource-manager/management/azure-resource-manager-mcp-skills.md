---
title: Use experimental skills with the ARM MCP server
description: Enable experimental Azure Resource Manager MCP skills to discover Microsoft service team workflows for repeatable Azure management tasks.
author: kgremban
ms.author: kgremban
ms.service: azure-resource-manager
ms.subservice: management
ms.topic: how-to
ms.date: 11/05/2026
---

# Use experimental skills with the ARM MCP server

Azure Resource Manager (ARM) MCP server skills give your AI agent or harness access to workflows curated by Microsoft service teams for repeatable Azure management tasks. A skill provides instructions for a workflow, including prerequisites, tool usage, and checks to perform before proceeding.

> [!IMPORTANT]
> Skills are experimental and aren't enabled by default in the ARM MCP server public preview. You must explicitly enable the `Skills` toolset to access them. Available skills and their behavior can change.

## Prerequisites

- An MCP-compatible client connected to the ARM MCP server. For Visual Studio Code setup, see [Quickstart: Get started with the ARM MCP server](azure-resource-manager-mcp-quickstart.md).
- Support in your client for configuring HTTP headers on an MCP server connection.
- Azure permissions and access to the tools and services required by the workflow you choose.

## Enable the Skills toolset

Add the `x-mcp-toolset` header with the value `Skills` to your ARM MCP server configuration.

For Visual Studio Code, add or update the ARM MCP server entry in the `servers` object in `.vscode/mcp.json`. The following example shows a complete configuration:

```json
{
  "servers": {
    "ARM MCP": {
      "url": "https://mcp.management.azure.com",
      "type": "http",
      "headers": {
        "x-mcp-toolset": "Skills"
      }
    }
  }
}
```

For another AI agent or harness, use its configuration format to connect to the same endpoint and send the same header. Complete the authentication flow required by your client. If you need manual app registration or OAuth configuration, see [Configure an MCP client for the ARM MCP server](azure-resource-manager-mcp-other-clients.md).

Restart or reconnect the MCP server connection after changing the configuration, and refresh your client's tool list. Confirm that the following tools are available and enabled:

| Tool | Purpose |
| --- | --- |
| `list_skills` | Discover the available skills. |
| `get_skills` | Retrieve skill content so your agent can use the workflow instructions. |

Use your client's tool list to inspect the current input schemas before calling these tools.

## Use a skill

1. Ask your agent to use `list_skills` to discover available workflows.
1. Choose a workflow that matches your task, and ask the agent to retrieve its instructions with `get_skills`.
1. Provide the target Azure scope and any other inputs required by the workflow.
1. Have the agent check prerequisites and required tools before following the instructions. Review proposed Azure changes before approving write operations.

For example:

```text
Use the ARM MCP server to list available skills. Find the workflow for
investigating historical Azure costs, retrieve its instructions with
get_skills, and tell me what scope and date range you need.
```

Retrieving a skill doesn't run the workflow, grant Azure permissions, or enable tools that are missing from your client. Some workflows require additional service prerequisites or preview capabilities. If a required tool or service isn't available, resolve that prerequisite before proceeding.

## Available workflows

The following summaries describe the current skills. Use `list_skills` for the available catalog and `get_skills` for the latest instructions and prerequisites.

| Skill | High-level description |
| --- | --- |
| `recommend-vm-sku` | Recommend Azure virtual machine sizes and node counts for AI inference or model-serving workloads, with optional subscription quota, placement, and pricing checks. |
| `azure-optimization` | Find and explain Azure cost-saving recommendations, including available resizing alternatives. This workflow examines recommendations rather than historical charges. |
| `aks-cost-analysis` | Analyze measured Azure Kubernetes Service (AKS) costs by cluster, namespace, service category, or utilization, including idle, shared, and unallocated costs. |
| `cost-investigation` | Investigate historical Azure charges, compare periods, identify major cost contributors, and explain cost spikes using service, resource, and meter data. |
| `pricing-estimate` | Estimate costs for a selected Azure configuration using public retail prices, compare regional prices, or request and monitor a negotiated price sheet export. |
| `assess-machine-configuration-policy-compliance` | Review Azure Machine Configuration compliance, identify noncompliant or stale evaluations, and explain recorded failure reasons. |
| `query-machine-configuration-inventory` | Query collected machine inventory, including applications, certificates, local accounts and groups, services, and Windows roles. |
| `enroll-essentials-machine-management` | Guide enrollment of an Azure subscription in Essentials machine management using approved identity and monitoring resources, and verify enrollment. |
| `author-azure-policy` | Author or revise a custom Azure Policy definition, validate it, and optionally simulate it against an approved resource without deploying or assigning the policy. |
| `query-azure-resource-graph` | Discover and inventory Azure resources through scoped, validated Azure Resource Graph queries, including paging through results. |
| `azure-resource-management` | Inspect, create, or update Azure resources using resource discovery and schemas, with confirmation before changes. |
| `deploy-arm-template` | Preview a resource-group-scoped ARM template deployment, obtain approval for the changes, deploy the template, and monitor completion. |

## Review workflow actions

Skills guide your agent's behavior; they don't replace Azure authorization or your client's approval controls. Some workflows are read-only, while others can create or update resources or enroll services.

Confirm the target scope, inspect proposed changes, and approve write operations only when you understand their effect. For deployment workflows, review the what-if result before approving deployment. For more information, see [Secure and govern ARM MCP server use](azure-resource-manager-mcp-governance.md).

## Related content

- [What is the ARM MCP server?](azure-resource-manager-mcp-overview.md)
- [ARM MCP server tools](azure-resource-manager-mcp-tools.md)
- [Troubleshoot the ARM MCP server](azure-resource-manager-mcp-troubleshoot.md)

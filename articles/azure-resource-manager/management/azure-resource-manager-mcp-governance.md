---
title: Secure and govern Azure Resource Manager MCP server use
description: Review authentication, permissions, tool approvals, deployment previews, and Azure Policy considerations for the Azure Resource Manager MCP server.
author: kgremban
ms.author: kgremban
ms.service: azure-resource-manager
ms.subservice: management
ms.topic: concept-article
ms.date: 10/23/2026
---

# Secure and govern Azure Resource Manager MCP server use

The Azure Resource Manager (ARM) MCP server lets AI agents make Azure management requests. Apply the same access-control and change-review practices that you use with other ARM clients, and review the additional context that you provide to the agent.

## Authentication and permissions

The ARM MCP server uses the authentication and authorization context of the user signed in through your AI agent or harness of choice. Tool calls are made on behalf of that user and are subject to Azure access controls.

The server issues Azure Resource Manager API calls on behalf of the user. Enforcement therefore happens at the ARM layer (RBAC, scope, policy, and resource-provider authorization), not at the natural-language prompt layer.

Use [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) to grant only the permissions needed for the task, at the narrowest practical scope. Access to resource inventory doesn't imply permission to deploy resources or read billing data.

Before approving a tool call:

- Confirm which Azure account and tenant you're using.
- Confirm the subscription, resource group, or billing scope in the request.
- Review whether the tool reads data or changes resources.
- Review the resource body or deployment template when the request makes changes.

Client-side tool approvals and Azure authorization serve different purposes. Approving a tool call in an MCP client doesn't grant Azure permissions.

## Review changes before deployment

For ARM template deployments, ask the agent to run `whatif_deployment` before `create_deployment`. Review the expected changes, resource names, locations, and parameters before approving the deployment.

For direct resource operations, review the inputs to `create_or_update_resource` or `create_or_update_resource_group`. A template what-if preview isn't a preview of every possible direct resource operation.

> [!IMPORTANT]
> A prompt such as "don't change resources" helps communicate intent, but isn't an authorization boundary. Use Azure permissions and your client's tool controls to enforce the level of access appropriate for the task.

After a deployment starts, inspect its status and errors with `get_deployment_status`. If you request cancellation, review the resulting resource state rather than assuming the environment returned to its previous state.

## Azure Policy considerations

Azure Resource Manager (ARM) requests you make through the ARM MCP server remain subject to applicable [Azure Policy](../../governance/policy/overview.md) assignments.

You can use the ARM MCP production application ID in a custom Azure Policy condition to target deployment requests that originate from ARM MCP. Obtain the current application ID from the [ARM MCP server repository](https://github.com/Azure/Azure-Resource-Manager-MCP).

The following sample policy uses the fictitious application ID `00001111-aaaa-2222-bbbb-3333cccc4444`. Replace it with the ARM MCP production application ID before using the policy to block ARM MCP requests:

```json
{
  "mode": "All",
  "policyRule": {
    "if": {
      "allOf": [
        {
          "value": "[tryGet(requestContext().identity, 'appid')]",
          "equals": "00001111-aaaa-2222-bbbb-3333cccc4444"
        }
      ]
    },
    "then": {
      "effect": "deny"
    }
  }
}
```

For example, use policy conditions that:

- Target ARM deployment resources (`Microsoft.Resources/deployments`).
- Match the requesting client application ID to the ARM MCP app ID.
- Apply a `deny` or `audit` effect at the scope where you want control.

Test policies at a lower scope first, then promote after validation. A policy targeting deployments doesn't automatically block every other ARM MCP tool or every direct ARM resource operation.

For background on policy definitions and assignment scope, see [Azure Policy definition structure](../../governance/policy/concepts/definition-structure-basics.md).

## Related content

- [ARM MCP server tools](azure-resource-manager-mcp-tools.md)
- [ARM template what-if](../templates/deploy-what-if.md)
- [Troubleshoot the ARM MCP server](azure-resource-manager-mcp-troubleshoot.md)

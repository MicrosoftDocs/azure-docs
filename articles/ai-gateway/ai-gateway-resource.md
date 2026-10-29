---
title: Migrate from the AI Gateway tier to AI Gateway resource type (preview)
titleSuffix: Azure API Management
description: Learn how you can migrate from the AI Gateway tier in Azure API Management service to the new AI Gateway resource type (preview).
ms.reviewer: fasantia
ms.date: 10/06/2026
ms.topic: how-to
ms.service: azure
---

# Migrate from the AI Gateway tier in API Management (preview)

Azure API Management is changing the resource type used for AI Gateway (preview) from `Microsoft.ApiManagement/service` to `Microsoft.ApiManagement/aigateways`, which offers elastic scaling, faster provisioning time, and the latest capabilities for AI traffic management.

This article explains how to plan for the migration to the new resource type to take advantage of the latest capabilities.

> [!IMPORTANT]
> `Microsoft.ApiManagement/service` with the `AIGateway` SKU existing resources will continue to work until January 15, 2027. 

## What changes

Starting October 14, 2026, Azure API management is changing the resource type for AI Gateway (preview) from `Microsoft.ApiManagement/service` to `Microsoft.ApiManagement/aigateways`.

While this change doesn't disrupt the way AI Gateway works, it might require changes in how clients connect to the resource and how automated tools interface with it. The following section describes the changes associated with the new resource type and how to migrate to it. 

### Resource ID

The resource ID includes the resource type in its ID, so it changes even if you reuse the same gateway name.

| Earlier resource | New resource |
| --- | --- |
| `/subscriptions/.../providers/Microsoft.ApiManagement/service/{gateway-name}` | `/subscriptions/.../providers/Microsoft.ApiManagement/aigateways/{gateway-name}` |

### Runtime URL

Applications receive a new runtime URL with the domain `ai.gateway.azure.com`.

| Earlier resource | New resource |
| --- | --- |
| `https://contoso-ai-gateway-old.azure-api.net` | `https://contoso-ai-gateway.westus2-02.ai.gateway.azure.com` |

Use HTTPS with the new hostname:

```text
https://contoso-ai-gateway.westus2-02.ai.gateway.azure.com/
```

> [!div class="checklist"]
> * Don't construct the hostname yourself. Read it from `properties.frontend.defaultHostname` (this property doesn't include `https://`).
> * Update the runtime URL in application settings, SDK clients, secret stores, health checks, allow lists, proxies, DNS configuration, monitoring rules, and code samples.

### Authorization header for keys

Clients connecting to the runtime URL and authenticating by using keys should use the `Authorization` header with a `Bearer` scheme.

| Earlier resource | New resource |
| --- | --- |
| `api-key: <your-key>` | `Authorization: Bearer <your-key>` |

### Azure Resource Manager contract

The two resource types use different Azure Resource Manager contracts.

| Contract area | Earlier resource | New resource |
| --- | --- | --- |
| Resource type | `Microsoft.ApiManagement/service` | `Microsoft.ApiManagement/aigateways` |
| API version | `2025-09-01-preview` | `2026-09-01-preview` |
| Runtime address | `properties.gatewayUrl` | `properties.frontend.defaultHostname` |
| Response shape | General-purpose API Management service properties | Dedicated AI Gateway properties |

The following sanitized examples show the main response differences:

### [`Microsoft.ApiManagement/service`](#tab/old)

```json
{
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso-ai-rg/providers/Microsoft.ApiManagement/service/contoso-ai-gateway-old",
    "name": "contoso-ai-gateway-old",
    "type": "Microsoft.ApiManagement/service",
    "location": "West US 2",
    "identity": {
        "principalId": "11111111-1111-1111-1111-111111111111",
        "tenantId": "22222222-2222-2222-2222-222222222222",
        "type": "SystemAssigned"
    },
    "sku": {
        "name": "AIGateway",
        "capacity": 1
    },
    "properties": {
        "gatewayUrl": "https://contoso-ai-gateway-old.azure-api.net",
        "provisioningState": "Succeeded",
        "publicNetworkAccess": "Enabled",
        "publisherEmail": "admin@contoso.com",
        "publisherName": "Contoso",
        "virtualNetworkType": "None"
    },
    "tags": {
        "environment": "production"
    }
}
```

### [`Microsoft.ApiManagement/aigateways`](#tab/new)

```json
{
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso-ai-rg/providers/Microsoft.ApiManagement/aigateways/contoso-ai-gateway",
    "name": "contoso-ai-gateway",
    "type": "Microsoft.ApiManagement/aigateways",
    "location": "westus2",
    "identity": {
        "principalId": "99999999-9999-9999-9999-999999999999",
        "tenantId": "22222222-2222-2222-2222-222222222222",
        "type": "SystemAssigned"
    },
    "properties": {
        "frontend": {
            "defaultHostname": "contoso-ai-gateway.westus2-02.ai.gateway.azure.com"
        },
        "provisioningState": "Succeeded"
    },
    "tags": {
        "environment": "production"
    }
}
```

---


## Limitations

Consider the following limitations before migrating:

| Limitation | What you need to do |
| --- | --- |
| Private endpoints aren't supported. | Make sure your security and network design can use the supported public frontend configuration before migrating. |
| You can't change the virtual network or subnet after the gateway is created. | Confirm the target virtual network, subnet, address space, routing, DNS, and back-end reachability before deployment. To use a different virtual network later, create another gateway and migrate to it. |
| Content safety policy isn't supported. | Identify applications that depend on the existing content safety policy. Before migrating, choose an alternative safety control like guardrais in Microsoft Foundry. |

## Before you migrate

Ensure that:

> [!div class="checklist"]
> * Your subscription can create `Microsoft.ApiManagement/aigateways` resources.
> * You can create resources, role assignments, and network configuration.
> * Your design doesn't require a private endpoint.
> * You select the final virtual network and subnet because you can't change them after gateway creation.
> * You know which applications use the gateway.

Record the following configuration:

| Area | What to record |
| --- | --- |
| Gateway | Subscription, resource group, name, region, tags, identity, and networking |
| Models | Providers, back-end models, endpoints, credentials, and supported protocols |
| Model aliases | Callable names and the back-end models they target |
| MCP servers | Server names, back ends, authentication, exposed tools, and policies |
| Operations | Policies, telemetry, alerts, dashboards, and deployment automation |

## Migrate the gateway

The following section explains how to perform a migration to the new resource type.

### Create the new gateway

1. Create a `Microsoft.ApiManagement/aigateways` resource. Use the same subscription, resource group, and region when possible.

2. Configure the required identity, tags, public frontend access, and virtual network integration.

3. Choose the virtual network and subnet carefully. You can't change them after the gateway is created. If the configuration is incorrect, create another gateway with the correct network settings.

4. Re-create access:

    1. Role assignments scoped to the earlier resource ID don't apply to the new resource ID. Re-create the required assignments.
    1. If you enable a new system-assigned identity, it receives a new principal ID. Grant the new identity access to model providers, secrets, telemetry destinations, networks, and MCP back ends.
    1. Attach any required user-assigned identities and verify their permissions.

5. Migrate models, aliases, and MCP servers:

    1. Create the model providers and back-end models.
    1. Configure provider endpoints and authentication.
    1. Create each model alias and map it to the correct back-end model or models.
    1. Create each MCP server and configure its back ends and authentication.
    1. Verify the tools exposed by each MCP server.
    1. Reapply the required policies.

    > [!TIP]
    > Preserve model alias names and MCP server names where possible. If migration creates aliases automatically, verify their names before cutover. Don't assume that a generated alias matches the value currently sent by applications in the `model` field.

6. Re-create monitoring and policies.

7. If you use ARM templates for deployment, change definitions to use:

    - Resource type `Microsoft.ApiManagement/aigateways`
    - API version `2026-09-01-preview`
    - The new resource ID
    - The new child-resource paths

8. Create runtime access keys.

### Cut over applications

Before cutover, verify that:

> [!div class="checklist"]
> * Gateway provisioning succeeded.
> * All model providers and back-end models are present.
> * Every model alias targets the correct model or models.
> * Requests using each model alias succeed.
> * Every MCP server exposes the expected tools.
> * MCP tool discovery and representative tool calls succeed.
> * Identity and back-end authentication work.
> * Supported policies behave as expected.
> * Public frontend access, virtual network routing, DNS, back-end network paths, and telemetry work.

Once verification is completed, update applications and agents with:

- The new runtime URL for models
- A new runtime access key or Entra identity
- Any changed model alias
- The new MCP server endpoint

### Remove the earlier resource

Keep the earlier gateway during a rollback period.

Delete it only after:

- No application sends traffic to its endpoint.
- Its keys are no longer used.
- The new gateway contains all required assets and policies.
- Monitoring shows stable traffic.

Then revoke the earlier keys, remove obsolete role assignments and DNS records, and delete the `Microsoft.ApiManagement/service` resource with the `AIGateway` SKU.

## Frequently asked questions

**Is Microsoft retiring AI Gateway?**

No. Only the Azure resource type is changing. As a consequence, the AI Gateway SKU in Azure API Management service is deprecated.

**What is being deprecated?**

The `Microsoft.ApiManagement/service` representation with the `AIGateway` SKU is being replaced by `Microsoft.ApiManagement/aigateways` resource type.

**Can I change the existing resource type?**

No. The resource type is part of the immutable Azure resource ID.

**How long do I have to migrate?**

Complete the migration before January 15, 2027.

**What happens after the retirement date?**

Resources of type `Microsoft.ApiManagement/service` with the `AIGateway` SKU are permanently removed.

**Can I create new resources of type `Microsoft.ApiManagement/service` with the `AIGateway` SKU?**

No.

**Will the deprecated resource type receive new features?**

No. New features target `Microsoft.ApiManagement/aigateways` moving forward. The earlier representation is deprecated and should be used only while you complete migration.

**Do role assignments move automatically?**

No. Re-create resource-scoped role assignments on the new resource ID.

**Do applications need to change?**

Yes. Applications need the new runtime URL and access key. They might also need updated model aliases, MCP server endpoints, or tool names.

**Does this change affect other SKUs in Azure API Management?**

No, there are no changes in other SKUs of Azure API Management and they remain fully functional.

## Related content

- [AI Gateway tier overview](./overview.md)
- [Register an Azure resource provider](/azure/azure-resource-manager/management/resource-providers-and-types#register-resource-provider)
- [Azure role-based access control documentation](/azure/role-based-access-control/overview)

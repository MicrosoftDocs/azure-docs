---
title: Migrate to Azure Functions v2 on Azure Container Apps
ms.reviewer: cshoe
description: Learn how to migrate Azure Functions from the legacy v1 model to the recommended v2 model on Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 12/01/2025
ms.author: cshoe
---

# Migrate to Azure Functions v2 on Azure Container Apps

Use this guide to move Azure Functions running on the legacy Functions v1 model to the recommended Functions v2 model on Azure Container Apps. You learn why to migrate, what changes, and how to execute the transition with minimal risk.

You can host Azure Functions in Azure Container Apps by using two deployment models:

- **Functions v1**: Legacy proxy model that uses a Function App (`Microsoft.Web` resource provider) plus a behind-the-scenes container app.

- **Functions v2**: Native model that creates a single Azure Container App resource (`Microsoft.App`) with `kind=functionapp`.

When you move to v2 you simplify management, unlock native features, and align with future roadmap of Azure Functions.

## Model comparison

| Area | v1 (legacy) | v2 (recommended) |
|------|-------------|------------------|
| Resource model | Proxy Functions app paired with a  hidden container app | Single native container app (`kind=functionapp`) |
| Native features<br><br>(revisions, secrets, health probes, custom domains, sidecars) | Not supported | Supported |
| Scaling controls<br><br>(cooldown, polling interval) | Limited | Full container app scaling options |
| Logging and troubleshooting | Indirect. No live console | Direct. Includes live logs and diagnostics |
| Dapr integration | Problematic in some isolated .NET scenarios | Supported with standard patterns |
| Auth (Easy Auth) | Not available | Available |
| Certificates and custom domains | Not available | Available |
| Metrics and alerting | Basic | Full native metrics and alerts |
| Future roadmap<br><br>(function listing, keys, invocation count) | Not planned | Planned |
| Operational complexity | Dual-resource management | Single resource |
| Recommended for new deployments | No | Yes |

## Limitations of Functions v1

Functions v1 on Azure Container Apps has several limitations that affect scalability, management, and feature availability. Understanding these constraints helps clarify the benefits of migrating to the v2 model.

### Feature gaps

The following features aren't available for Functions v1 apps:

- Easy Auth
- Health probes
- Custom domains
- Sidecar containers
- Managed certificates
- Container app secrets
- Granular scale settings
- Multirevision traffic splitting

### Troubleshooting constraints

With Functions v1 apps, you don't have direct container access or real-time console output. Instead, you need to use Log Analytics for infrastructure diagnostics and Application Insights for application logs.

### Dapr integration issues

Dapr and .NET isolated Functions can conflict during build or runtime because of dependency and initialization ordering constraints.

## Benefits of Functions v2

Functions v2 creates a native container app resource directly. This approach removes proxy indirection and enables full Azure Container Apps capabilities.

Key benefits:

- Enable Easy Auth for identity offload.
- Configure health probes to improve resilience.
- Set custom domains and use managed certificates.
- Reduce operational overhead with a single resource.
- Store secrets natively and mount sidecar containers.
- Gain clearer metrics, alerts, and live log streaming.
- Use multirevision deployments and split traffic safely.
- Apply granular scaling rules (polling interval, cooldown).

> [!NOTE]
> No code changes are required. You can reuse your existing container image.

## Legacy direct image deployment (unsupported)

Some deployments use a standard container app without `kind=functionapp` and manually run a Functions image.

> [!IMPORTANT]
> This approach isn't supported. It lacks automatic scale rules and doesn't receive upcoming v2 platform features like function listing, keys, and invocation counts.

**Recommendation:** Migrate to Functions v2 on Azure Container Apps.

## Prerequisites

Before migrating:

- Azure subscription and permission to create resources.
- [Azure CLI](/cli/azure/install-azure-cli-windows?view=azure-cli-latest (latest) installed.
- Required extensions: `az extension add --name containerapp`, `az extension add --name functionapp` (if applicable).
- Access to the container image used by your v1 deployment.
- Inventory of environment variables, secrets, storage bindings, and networking settings.

## Migration procedure

### 1. Prepare

1. Identify that your current deployment is a Functions v1 app.
1. Export all configuration data including environment variables, secrets, connection strings, and custom bindings.
1. Review environment quotas (CPU, memory, max instances) and adjust if needed.
1. Confirm image availability in your registry.

### 2. Create v2 app

1. Create or reuse an Azure Container Apps environment.
1. Deploy a new v2 container app with the same image.

    ```azurecli
    az containerapp create \
      --name my-func-v2 \
      --resource-group <RESOURCE_GROUP_NAME> \
      --environment <ENVRONMENT_NAME> \
      --image myregistry.azurecr.io/<IMAGE_NAME>:<TAG_NAME> \
      --kind functionapp \
      --ingress external --target-port <TARGET_PORT>
    ```

1. Reapply configuration details including secrets, environment variables, identity, networking.

1. Enable authentication or custom domain if needed.

1. Define scaling rules (HTTP, CPU, queue trigger correlation as appropriate).

### 3. Validate

1. Invoke HTTP-triggered functions (curl or browser).

1. Test each trigger type (Event Hubs, Service Bus, timer).

1. Confirm Application Insights telemetry and Log Analytics logs.

1. Check scaling behavior under load (autoscale rules firing).

1. Verify secrets and connection strings resolve correctly.

1. Confirm health probe status and container revision details.

### 4. Update DNS or custom domains (optional)

1. If using a custom domain, map it to the new v2 hostname (CNAME or A record).

1. Rebind SSL/TLS certificates (managed or uploaded).

1. Test domain resolution and TLS handshake.

1. Communicate endpoint changes internally.

### 5. Migrate

1. Shift production traffic (update DNS TTL or routing rules).

1. Monitor latency, errors, and invocation counts.

1. Adjust scaling parameters if needed (cooldown, min/max instances).

1. Track logs for anomalies during first few hours.

### 6. Clean up

1. Decommission the old v1 Functions app and related resources.

    > [!CAUTION]
    > Verify no production traffic still targets the v1 endpoint before deletion.

1. Remove unused secrets or storage references.

1. Update internal documentation and operational runbooks.

## Validation checklist

| Item | Pass criteria |
|------|---------------|
| Triggers fire | All configured triggers execute successfully |
| Logs and telemetry | Application Insights shows invocations; live logs stream |
| Scaling | Instance count adjusts per rule configuration |
| Auth (if enabled) | Protected endpoints return expected status codes |
| Domains | Custom domain resolves with valid certificate |
| Secrets | Sensitive values load without errors |

## Operational enhancements (optional)

Improve reliability after migration:

- [Add alert rules](alerts.md)
- [Tune autoscale](scale-app.md)
- [Enforce managed identity usage](managed-identity.md)
- [Centralize secrets](manage-secrets.md)

## Related content

- [Functions on Azure Container Apps overview](/azure/container-apps/functions-usage)
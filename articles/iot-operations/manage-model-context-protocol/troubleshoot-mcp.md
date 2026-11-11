---
title: Troubleshoot MCP in Azure IoT Operations (preview)
description: Diagnose MCP deployment, connection, TLS, authentication, and authorization issues in Azure IoT Operations.
author: ancaantochi
ms.author: ancaantochi
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 10/15/2026
ai-usage: ai-assisted
---

# Troubleshoot MCP in Azure IoT Operations (preview)

Use this guide to diagnose MCP deployment, connection, and authorization issues in Azure IoT Operations.

> [!IMPORTANT]
> MCP in Azure IoT Operations is in preview. Use a nonproduction environment to evaluate the preview and the examples in this article.

## Prerequisites

- Azure CLI, Bash, and `kubectl`, with access to the target subscription and cluster.
- Permission to read the instance and inspect Kubernetes configuration, events, and pod logs.

Set the variables for your deployment before running the diagnostic commands:

```bash
set -euo pipefail
export SUBSCRIPTION_ID="<subscription-id>"
export RESOURCE_GROUP="<resource-group>"
export AIO_INSTANCE_NAME="<instance-name>"
export CUSTOM_LOCATION_NAME="<custom-location-name>"
export AIO_NAMESPACE="azure-iot-operations"
export AIO_API_VERSION="2026-11-01-preview"

az account set --subscription "$SUBSCRIPTION_ID"
kubectl config current-context

INSTANCE_ID="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.IoTOperations/instances/$AIO_INSTANCE_NAME"
```

## Troubleshoot MCP deployment and access

| Symptom | What to inspect |
| --- | --- |
| No MCP deployments | New instance templates with MCP support enable MCP by default. Check for an explicit `features.mcp.mode: Disabled`, the extension build, and operator events. Don't add `settings.preview: Enabled` as a workaround. |
| Policy or connection missing | Use an instance template and extension that support MCP to create the ARM resources; preserve any existing customizations. Changing the feature mode alone doesn't create a policy or connection. |
| Fields disappear from the CR | The installed CRD is older than the ARM contract. Upgrade the extension before retrying. |
| Connection isn't validated | Service name, namespace, port, policy reference, CA ConfigMap, and current-generation condition messages. |
| TLS failure | Certificate hostname and CA trust. Don't disable certificate verification. |
| Gateway returns 401 | Caller token expiry, gateway audience, and ServiceAccount identity. |
| Authenticated tool call denied | Role annotation JSON, policy principal selector, and unprefixed resource name. Don't grant `Admin` just to hide the failure. |
| Backend connection or discovery fails | Check for a stale `<instance>-mcp` Service/audience or `DuplicateServerID`, then check backend readiness, projected SAT audience `aio-mcp`, CA reference, and protocol compatibility. Ready conditions alone aren't sufficient. |
| Upgrade reports preview features enabled | Check for an unnecessary `settings.preview: Enabled`. Coordinate the supported removal and upgrade sequence with the instance owner; don't leave MCP disabled accidentally. |

Use the following commands to collect configuration, status, and logs for troubleshooting:

```bash
az resource show --ids "$INSTANCE_ID" --api-version "$AIO_API_VERSION" \
  --query 'properties.{version:version,state:provisioningState,mcp:features.mcp}'
kubectl -n "$AIO_NAMESPACE" get mcpserverconnection aio -o yaml
kubectl -n "$AIO_NAMESPACE" get deployments
kubectl -n "$AIO_NAMESPACE" logs deployment/aio-mcp-frontend --since=15m
kubectl -n "$AIO_NAMESPACE" get events --sort-by=.lastTimestamp
```

When requesting help, include the extension version, API version, operation that failed, UTC timestamp, protocol version, condition generation, HTTP status, and sanitized JSON-RPC result. Remove sensitive data before sharing logs. Never share bearer tokens, Secret contents, private keys, or sensitive tool output.

## Related content

- [Deploy MCP](howto-deploy-mcp.md)
- [Configure MCP authorization](howto-configure-mcp-authorization.md)
- [Connect to MCP](howto-connect-ai-agent.md)
- [Manage certificates](../secure-iot-ops/howto-manage-certificates.md)
- [Upgrade Azure IoT Operations](../manage-iot-ops/howto-upgrade.md)

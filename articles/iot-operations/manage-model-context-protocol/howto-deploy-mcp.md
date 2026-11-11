---
title: Deploy MCP in Azure IoT Operations (preview)
description: Verify the default MCP deployment, authorization policy, and connection in Azure IoT Operations, and optionally disable MCP.
author: ancaantochi
ms.author: ancaantochi
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 10/27/2026
ai-usage: ai-assisted
---

# Deploy MCP in Azure IoT Operations (preview)

MCP is enabled by default for new Azure IoT Operations preview deployments. Verify the default authorization policy and backend connection, or [disable MCP](#disable-mcp-optional) if you don't need it. For an introduction, see [What is Azure IoT Operations MCP?](overview-mcp.md)

> [!IMPORTANT]
> MCP in Azure IoT Operations is in preview. Use a nonproduction environment to evaluate the preview and the examples in this article. The examples use ARM API version `2026-11-01-preview`.

> [!NOTE]
> **Known issue with customer-managed certificates:** When you [bring your own certificate issuer](../deploy-iot-ops/howto-bring-your-own-issuer.md), Azure IoT Operations deployment fails if MCP is enabled because MCP components reference the default certificate issuer and trust bundle instead of your configured resources. To evaluate other Azure IoT Operations features with customer-managed certificates, you must explicitly set `features.mcp.mode` to `Disabled` in your deployment configuration before deploying. MCP is enabled by default. See [Disable MCP](#disable-mcp-optional) for the configuration setting.

## Prerequisites

- An Azure IoT Operations preview instance in a nonproduction environment. Follow the [preview-version installation guidance](../manage-iot-ops/howto-upgrade.md#upgrade-to-preview-version) and [Deploy Azure IoT Operations to a test cluster](../deploy-iot-ops/howto-deploy-iot-test-operations.md#run-azure-cli-commands). Use the CLI extension version associated with the preview release in [Azure IoT Operations versions](https://aka.ms/aio-versions).
- Azure CLI, Bash, and `kubectl`. The optional disable procedure requires the `azure-iot-ops` CLI extension version 2.11.0 or later.
- Permission to read the instance and its MCP resources, plus Kubernetes permissions to inspect deployments. To disable MCP, you also need permission to update the instance.
- The subscription ID, resource group, and instance name for your Azure IoT Operations deployment.

Set your variables:

```bash
set -euo pipefail
export SUBSCRIPTION_ID="<subscription-id>"
export RESOURCE_GROUP="<resource-group>"
export AIO_INSTANCE_NAME="<instance-name>"
export AIO_NAMESPACE="azure-iot-operations"
export AIO_API_VERSION="2026-11-01-preview"

az account set --subscription "$SUBSCRIPTION_ID"
kubectl config current-context

INSTANCE_ID="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.IoTOperations/instances/$AIO_INSTANCE_NAME"
```

If connection `aio` already exists, save its ARM configuration and coordinate with the instance owner before replacing it. Don't overwrite a customized policy or connection on a shared instance.

## Verify the default MCP deployment

New Azure IoT Operations preview deployments enable MCP by default,
with `features.mcp.mode` set to `Preview` unless you explicitly disable it.
You don't need to specify an MCP-specific enablement flag or deploy a separate resource. 

```azurecli
az resource show --ids "$INSTANCE_ID" --api-version "$AIO_API_VERSION" \
  --query 'properties.{state:provisioningState,mcp:features.mcp}'
```

Verify that the instance reports `mode: Preview`, without `settings.preview: Enabled`. Wait for both deployments to become ready.

```bash
kubectl -n "$AIO_NAMESPACE" get deployments,services
kubectl -n "$AIO_NAMESPACE" rollout status deployment/aio-mcp-frontend \
  --timeout=10m
```

The Azure IoT Operations MCP backend Service and Deployment are named `aio-mcp`. Wait for the backend Deployment too:

```bash
kubectl -n "$AIO_NAMESPACE" rollout status deployment/aio-mcp \
  --timeout=10m
```

The Azure IoT Operations preview deployment automatically creates the default
`aio-mcp-policy-v1` authorization policy and the `aio` connection, even when
MCP is disabled. You don't need to create these resources separately.
An enabled gateway without an applicable authorization policy doesn't grant
tool access.

## Review the default roles and connection

The default policy is named `aio-mcp-policy-v1`. Verify that the deployment created it and the `aio` connection; don't overwrite a customized connection. Its roles are additive:

| Role | Intended access |
| --- | --- |
| `Reader` | Explicitly listed documentation, configuration, and operational tools. |
| `DataReader` | Explicitly listed tools that read MQTT message payloads and distributed state store values. Doesn't implicitly include `Reader`. |
| `Admin` | All tools published by this backend, including tools added or configured later. Grant this role only when the caller needs that access; use `Reader` for the examples in this article. |

The default `aio` connection doesn't set `mcpProtocolVersion`. The gateway defaults its **outbound** backend protocol to `2026-07-28` and uses MCP discovery; this default doesn't control the protocol version a client uses with the gateway. If you customize a different connection's `mcpProtocolVersion`, verify backend support: older values select the legacy initialize handshake using the configured protocol version.

Verify the cluster state:

```bash
kubectl -n "$AIO_NAMESPACE" get mcpauthorizationpolicy aio-mcp-policy-v1 -o yaml
kubectl -n "$AIO_NAMESPACE" get mcpserverconnection aio -o yaml
kubectl -n "$AIO_NAMESPACE" rollout status deployment/aio-mcp-frontend \
  --timeout=5m
```

Verify that the connection uses Service `aio-mcp` and `PolicyBased` authorization referring to `aio-mcp-policy-v1`. The `Validated=True` and `Ready=True` conditions should refer to the current generation, and both gateway and backend deployments should be ready. After deployment, [connect to MCP](howto-connect-ai-agent.md) with your own agent or the optional sample and use a tool to verify that the backend is reachable.

The `aio` connection must target Service `aio-mcp`; the operator uses `aio-mcp` as the outbound token audience. An older connection targeting `<instance-name>-mcp` can report `DuplicateServerID`. Update the connection through ARM before continuing.

## Disable MCP (optional)

If you don't need MCP, explicitly set `features.mcp.mode` to `Disabled`.
This setting disables MCP Gateway and the built-in Azure IoT Operations MCP backend.
Clients lose access to all tools through the gateway, including separately
installed backends such as Kubernetes MCP. Confirm that no clients depend on
it before continuing.

Install or update the Azure IoT Operations CLI extension:

```azurecli
az extension add --name azure-iot-ops --upgrade
```

Disable MCP on the Azure IoT Operations instance, using its instance name,
not the Kubernetes cluster name. The CLI preserves other feature settings:

```azurecli
az iot ops update \
  --name "$AIO_INSTANCE_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --feature mcp.mode=Disabled
```

Verify the updated instance configuration:

```azurecli
az resource show --ids "$INSTANCE_ID" --api-version "$AIO_API_VERSION" \
  --query 'properties.{state:provisioningState,mcp:features.mcp}'
```

Verify that the instance reports `mode: Disabled` and provisioning state
`Succeeded`, then wait for the operator to remove the MCP deployments:

```bash
kubectl -n "$AIO_NAMESPACE" wait --for=delete deployment/aio-mcp-frontend \
  --timeout=10m
kubectl -n "$AIO_NAMESPACE" wait --for=delete deployment/aio-mcp \
  --timeout=10m
```

Keep `mcp.mode: Disabled` in your instance deployment configuration so that
future deployments don't restore the default. Don't uninstall the shared
operator, certificate infrastructure, or Azure IoT Operations instance.

## Related content

- [Install Kubernetes MCP](howto-deploy-kubernetes-mcp.md)
- [Configure MCP authorization](howto-configure-mcp-authorization.md)
- [Connect to MCP](howto-connect-ai-agent.md)
- [Troubleshoot MCP](troubleshoot-mcp.md)

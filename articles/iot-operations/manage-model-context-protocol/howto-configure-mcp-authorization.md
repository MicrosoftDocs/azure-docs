---
title: Configure MCP authorization in Azure IoT Operations (preview)
description: Learn how MCP authentication and authorization work, review default roles, and configure read and write tool access with Bicep.
author: ancaantochi
ms.author: ancaantochi
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 10/15/2026
ai-usage: ai-assisted
---

# Configure MCP authorization in Azure IoT Operations (preview)

Configure authentication and policy-based tool access for clients that connect to MCP Gateway.

ARM manages the policy and connection configuration. In this article, you use
Azure CLI to deploy Bicep files to ARM, and the operator reconciles that
configuration to Kubernetes resources. You then use `kubectl` to inspect the
reconciled cluster state. Deployment and verification are sequential steps,
not alternative configuration methods.

> [!IMPORTANT]
> MCP in Azure IoT Operations is in preview. Use a nonproduction environment to evaluate the preview and the examples in this article.

## Prerequisites

- [Deploy MCP](howto-deploy-mcp.md) and verify its default policy and connection.
- Azure CLI with Bicep, Bash, and `kubectl`.
- Permission to create MCP ARM resources and update the connection, plus Kubernetes read access.
- To grant a client a new MCP role, permission to update that client's ServiceAccount through its deployment configuration.

Set the deployment variables for your instance:

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

## Understand client authentication

Use a dedicated ServiceAccount with the `Reader` role for an in-cluster MCP client. Configure its ServiceAccount in the client's deployment. Don't annotate the gateway's own ServiceAccount or grant the client Kubernetes administrative access. The optional [sample agent Helm configuration](howto-connect-ai-agent.md#deploy-the-sample-ai-agent) demonstrates creating and annotating a dedicated identity.

MCP Gateway authenticates the Kubernetes service account token (SAT) by using TokenReview and reads roles from the authenticated ServiceAccount. The annotation is a JSON array, not a comma-separated string. Roles aren't trusted from HTTP headers.

There are two different SAT audiences:

- **Client to gateway:** `aio-mcp-frontend`.
- **Gateway to Azure IoT Operations MCP:** the backend Service name configured in the ARM connection.

The operator projects the outbound token. Don't copy it from the gateway pod or embed any token in Bicep.

MCP roles apply across connections. Granting `Reader` can authorize calls through any connection whose policy grants that role. Review the policies on all connections available to the client when assigning roles.

## Understand the authorization layers

MCP Gateway's authentication and authorization checks
are extra to, not replacements for, the MQTT broker's checks. For a
tool such as `aio_mqtt_publish`, the built-in backend uses this flow:

```text
MCP client
  | Client SAT, audience: aio-mcp-frontend
  v
MCP Gateway
  | Authenticate client with TokenReview; load ServiceAccount roles
  | Authorize tool name and arguments against the connection's policy
  | Separate gateway SAT, audience: aio-mcp
  v
Azure IoT Operations MCP backend
  | Validate gateway SAT and expected gateway ServiceAccount identity
  | Execute the tool using the backend's MQTT connection
  | Backend SAT, audience: aio-internal
  v
MQTT broker
    Authenticate the backend; enforce broker authorization
    for the MQTT operation and topic
```

Each network connection uses TLS. The gateway doesn't forward the client's
token to the backend, and the built-in backend doesn't forward the client's
or gateway's token to the broker. The broker sees the backend's identity,
not the original MCP client.

| Layer | What it controls |
| --- | --- |
| MCP client authentication | Whether the client's SAT is valid for MCP Gateway and which ServiceAccount and MCP roles it represents. |
| MCP connection authorization | Which tools that client can call on a particular backend, with any configured argument conditions. |
| Backend authentication | Whether the caller is the expected gateway identity. The built-in Azure IoT Operations MCP backend validates this independently. Other backends require their own authentication configuration. |
| MQTT broker authentication and authorization | Whether the backend can connect and perform the requested MQTT operation on the target topic. MCP roles don't grant broker permissions. |

A broker permission to publish doesn't grant an MCP client access to
`mqtt_publish`. Conversely, an MCP grant for `mqtt_publish` doesn't override
a broker denial. Kubernetes RBAC and permissions for other downstream
services also remain independent of MCP policy.

For broker configuration, see [Configure MQTT broker authentication](../manage-mqtt-broker/howto-configure-authentication.md)
and [Configure MQTT broker authorization](../manage-mqtt-broker/howto-configure-authorization.md).
For the optional Kubernetes backend's different token flow, see
[Configure OIDC token validation](howto-deploy-kubernetes-mcp.md#configure-oidc-token-validation).

## Default role reference

The default `aio-mcp-policy-v1` policy grants the following roles on the
`aio` connection. These roles are MCP policy roles, not Azure RBAC roles or MQTT
broker roles. Assign them through the client's `aio-mcp-auth/roles`
ServiceAccount annotation.

| Role | Default grant |
| --- | --- |
| `Reader` | The explicit documentation and resource-inspection tool list. It doesn't grant MQTT payload reads, State Store value reads, or `mqtt_publish`. |
| `DataReader` | `mq_messages` and `dss_get`, which read MQTT messages and distributed State Store values. It doesn't include `Reader`. |
| `Admin` | `*`: all tools on this backend, including write tools and tools added later. It doesn't grant downstream permissions or Azure administration rights. |

The `Reader` allow list is:

| Tool category | Unprefixed tool names |
| --- | --- |
| Documentation | `documentation_overview`, `documentation` |
| Edge Registry | `list_edge_registry_groups`, `get_edge_registry_group`, `get_edge_registry_generic_resource`, `get_edge_registry_resource`, `list_edge_registry_resources`, `list_edge_registry_resource_versions`, `get_edge_registry_schema_from_asset` |
| Assets | `list_assets`, `get_asset`, `asset_details` |
| Devices | `list_devices`, `get_device`, `device_details` |
| Connectors | `list_connectors`, `get_connector`, `connector_details`, `find_connector_by_device` |
| MQTT brokers | `list_brokers`, `get_broker`, `broker_details` |
| Data flows | `list_dataflows`, `get_dataflow`, `dataflow_details` |
| Data flow graphs | `list_dataflow_graphs`, `get_dataflow_graph`, `dataflow_graph_details` |

Roles are additive and don't form an inheritance hierarchy. For example,
`["Reader","DataReader"]` grants both sets of tools. A role name has no
permissions unless the connection's policy grants them. Custom roles, such
as `MqttPublisher` in the following example, work the same way.

These lists describe grants, not a guarantee that every tool is available
in every deployment. Backend configuration determines the available tools,
and gateway tool discovery filters them for the caller. Inspect the
deployed policy and your client's tool list for the instance you're using.
Replacing the connection's policy doesn't automatically retain the default
role grants.

## Policy action and rule reference

The supported ARM policy action is **`ToolCall`**. It authorizes MCP tool
invocation (`tools/call`). Read and write tools both use this action:
`mqtt_publish` is a tool name in `resources`, not a separate policy action.
There are no separate `Read`, `Write`, or `Publish` MCP policy actions.
Tool discovery is filtered using tool authorization; it isn't a separate
grant in this policy.

| Field | Meaning |
| --- | --- |
| `action` | Set to `ToolCall`. |
| `principal.principalType: Role` | Match the role named by `principal.role` against the authenticated client's ServiceAccount roles. |
| `principal.principalType: Identities` | Match one of `principal.identities`. ServiceAccount identities use `<namespace>:<service-account-name>`. Use either an identity list or a role, not both in the same principal. |
| `resources` | Unprefixed backend tool names, such as `mqtt_publish`. The client sees the connection prefix, such as `aio_mqtt_publish`. `*` grants all tools; prefer explicit names for least privilege. |
| `context` | Optional conditions that must also match. For example, `'args.topic': 'mcp/examples/write-test'` restricts a publish grant to that exact topic. |

In `PolicyBased` mode, a call needs a matching grant. Grants are additive:
another matching rule can allow a call that a narrower rule doesn't allow.
For example, an `Admin` wildcard grant would bypass the topic restriction
in a separate publisher rule. Don't assign `Admin` to a client intended to
have only restricted write access. Tool visibility alone doesn't prove that
a particular call is authorized; argument conditions are evaluated at call time.

## Configure an authorization policy with Bicep

To customize tool access, create your own policy and reference it from the connection. Don't change the versioned `aio-mcp-policy-v1` policy in place. The following example grants the `Reader` role access to two tools, then shows how to restrict that access.

Changing the `aio` connection's policy affects all clients that use the connection. Review the required permissions for those clients before applying the change.

Save the following as `mcp-authorization-policy.bicep`:

```bicep
param aioInstanceName string
param customLocationName string
param policyName string = 'mcp-reader-policy-v1'
@minLength(1)
param readerTools array = [
  'documentation_overview'
  'list_assets'
]
param enableMqttPublish bool = false
param publishTopic string = 'mcp/examples/write-test'

var publisherPolicies = enableMqttPublish ? [
  {
    action: 'ToolCall'
    principal: {
      principalType: 'Role'
      role: 'MqttPublisher'
    }
    resources: [
      'mqtt_publish'
    ]
    context: {
      'args.topic': publishTopic
    }
  }
] : []

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource aioInstance 'Microsoft.IoTOperations/instances@2026-11-01-preview' existing = {
  name: aioInstanceName
}

resource policy 'Microsoft.IoTOperations/instances/mcpAuthorizationPolicies@2026-11-01-preview' = {
  parent: aioInstance
  name: policyName
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    policies: concat([
      {
        action: 'ToolCall'
        principal: {
          principalType: 'Role'
          role: 'Reader'
        }
        resources: readerTools
      }
    ], publisherPolicies)
  }
}
```

The optional `MqttPublisher` grant is disabled by default. The write-tool
example later in this article enables it without granting `Admin`.

To associate your policy with the existing `aio` connection, save the following as `mcp-connection.bicep`. It preserves the default Service and path and changes the policy reference. Save the current ARM configuration and inspect `what-if` before applying the change. If your connection has other customizations, include them in the template so they aren't lost.

```bicep
param aioInstanceName string
param customLocationName string
param authorizationPolicyName string

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource aioInstance 'Microsoft.IoTOperations/instances@2026-11-01-preview' existing = {
  name: aioInstanceName
}

resource connection 'Microsoft.IoTOperations/instances/mcpServerConnections@2026-11-01-preview' = {
  parent: aioInstance
  name: 'aio'
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    service: {
      name: 'aio-mcp'
      path: '/mcp'
    }
    authorization: {
      mode: 'PolicyBased'
      policyRef: {
        name: authorizationPolicyName
      }
    }
  }
}
```

Check that `mcp-reader-policy-v1` isn't already in use before creating it, or choose a different name in all the following commands. The operator supplies the outbound token and Azure IoT Operations CA to the `aio` route.

```azurecli
az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --name configure-mcp-policy \
  --template-file mcp-authorization-policy.bicep \
  --parameters aioInstanceName="$AIO_INSTANCE_NAME" \
    customLocationName="$CUSTOM_LOCATION_NAME"

az resource show --ids "$INSTANCE_ID/mcpServerConnections/aio" \
  --api-version "$AIO_API_VERSION" > aio-connection-before-update.json

az deployment group what-if \
  --resource-group "$RESOURCE_GROUP" \
  --template-file mcp-connection.bicep \
  --parameters aioInstanceName="$AIO_INSTANCE_NAME" \
    customLocationName="$CUSTOM_LOCATION_NAME" \
    authorizationPolicyName=mcp-reader-policy-v1
```

Verify that `what-if` shows only the connection's `authorization.policyRef.name` changing. If it shows any other change, stop and update the template to preserve the existing connection configuration. When the proposed changes are correct, deploy the connection:

```azurecli
az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --name configure-mcp-connection \
  --template-file mcp-connection.bicep \
  --parameters aioInstanceName="$AIO_INSTANCE_NAME" \
    customLocationName="$CUSTOM_LOCATION_NAME" \
    authorizationPolicyName=mcp-reader-policy-v1
```

The instance deployment template manages the default `aio` policy reference. To retain a custom policy across future instance deployments, update your deployment configuration to reference that policy. Rerunning an unchanged instance template can restore the default reference.

## Verify the deployment

After the Bicep deployments complete, use `kubectl` to inspect the policy and
connection that the operator reconciled, and wait for the gateway rollout.
These commands verify the deployment; they don't configure the resources.

```bash
kubectl -n "$AIO_NAMESPACE" get mcpauthorizationpolicy mcp-reader-policy-v1 -o yaml
kubectl -n "$AIO_NAMESPACE" get mcpserverconnection aio -o yaml
kubectl -n "$AIO_NAMESPACE" rollout status deployment/aio-mcp-frontend --timeout=5m
```

Verify that the policy lists `documentation_overview` and `list_assets`, the
connection references `mcp-reader-policy-v1` in `PolicyBased` mode, and its
`Validated=True` and `Ready=True` conditions reflect the current generation.
Wait for reconciliation and the gateway rollout before testing tool access.

This policy allows a client with the `Reader` role to use
`aio_documentation_overview` and `aio_list_assets`. Policy resource names are
the unprefixed backend names; the gateway adds the `aio_` connection prefix
to tool names. Use your MCP client to confirm that both tools are available.

## Restrict tool access (optional)

To restrict the **same policy** to allow only `list_assets`, update its tool
list by redeploying the Bicep file through ARM:

```azurecli
az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --name configure-mcp-policy \
  --template-file mcp-authorization-policy.bicep \
  --parameters aioInstanceName="$AIO_INSTANCE_NAME" \
    customLocationName="$CUSTOM_LOCATION_NAME" \
    readerTools='["list_assets"]'
```

Repeat the `kubectl` commands in [Verify the deployment](#verify-the-deployment).
This time, verify that the policy lists only `list_assets`. Wait for the
current-generation conditions and gateway rollout before testing the client.

With the updated policy, a client with the `Reader` role can use `aio_list_assets` but not `aio_documentation_overview`. Keep the connection in `PolicyBased` mode.

To restore the policy's original two-tool grant, deploy `mcp-authorization-policy.bicep` again without the `readerTools` override. The [sample agent example](howto-connect-ai-agent.md#deploy-the-sample-ai-agent) uses `aio_documentation_overview`, so restore that grant before following the example. If you no longer need the custom policy, you can return the connection to the default policy:

```azurecli
az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --name configure-mcp-connection \
  --template-file mcp-connection.bicep \
  --parameters aioInstanceName="$AIO_INSTANCE_NAME" \
    customLocationName="$CUSTOM_LOCATION_NAME" \
    authorizationPolicyName=aio-mcp-policy-v1
```

## Allow a write tool (optional)

This example grants a dedicated `MqttPublisher` role access to
`mqtt_publish` for the single topic `mcp/examples/write-test`. Use a test
topic with no operational subscribers: publishing can trigger downstream
actions. The tool accepts a topic and a JSON object payload.

Before granting access, verify that the built-in backend exposes
`mqtt_publish` and its MQTT connection is configured. The broker must permit
the backend identity to connect and publish to the test topic. Review the
broker's existing policy rather than granting wildcard topic access or
changing broker permissions for the original MCP client.

Enable the publisher grant in the same custom policy. This also restores
the example's original two-tool `Reader` grant:

```azurecli
az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --name configure-mcp-policy \
  --template-file mcp-authorization-policy.bicep \
  --parameters aioInstanceName="$AIO_INSTANCE_NAME" \
    customLocationName="$CUSTOM_LOCATION_NAME" \
    enableMqttPublish=true \
    publishTopic=mcp/examples/write-test
```

If you returned `aio` to the default policy in the previous section,
repeat the connection `what-if` and deployment steps in
[Configure an authorization policy with Bicep](#configure-an-authorization-policy-with-bicep)
to reference `mcp-reader-policy-v1` again. Preserve other connection settings.

Add `MqttPublisher` to the dedicated client's ServiceAccount annotation
through its deployment configuration. For the optional sample agent, merge
these values into its complete Helm configuration:

```yaml
agent:
  frontend:
    serviceAccountAnnotations:
      aio-mcp-auth/roles: '["Reader","MqttPublisher"]'
```

Keep any other roles the client still requires, but don't add `Admin`.
The `Reader` role in this example retains access to the two read tools.
Don't put this annotation on the gateway or backend ServiceAccount.

### Verify write access

Repeat [Verify the deployment](#verify-the-deployment), confirming that the
policy now includes the `MqttPublisher` grant and its `args.topic` condition.
Start a new client session after updating its roles.

Call `aio_mqtt_publish` through MCP Gateway with these arguments:

```json
{
  "topic": "mcp/examples/write-test",
  "payload": {
    "message": "MCP authorization test"
  }
}
```

Confirm receipt with an independently authorized test subscriber. Then
verify that a client with only `Reader` is denied this tool and that the
publisher client can't publish to a different topic. Use only another
nonoperational test topic for the negative check. A broker authentication
or authorization error requires checking the backend's broker permissions;
don't bypass the gateway policy to resolve it.

To revoke this example's write grant, redeploy
`mcp-authorization-policy.bicep` with `enableMqttPublish=false` and remove
`MqttPublisher` from the client's deployment configuration, preserving its
other roles. Wait for reconciliation before confirming that publishing is
denied. Review other policies before removing a role used on other connections.

## Remove temporary resources

Keep `mcp-reader-policy-v1` if you want clients to continue using it. To remove it, first update any connections that reference it. If `aio` originally used the default policy, restore that reference using `mcp-connection.bicep` as shown earlier; otherwise, restore the original configuration from your saved snapshot. Wait for reconciliation and check the connections' current-generation conditions. Delete the policy only if you created it and no connection references it:

```azurecli
az resource delete \
  --ids "$INSTANCE_ID/mcpAuthorizationPolicies/mcp-reader-policy-v1" \
  --api-version "$AIO_API_VERSION"
```

Don't delete the template-managed `aio` connection or `aio-mcp-policy-v1` policy. Keep the connection snapshot private for as long as you need it for recovery. When it's no longer needed, remove `aio-connection-before-update.json`.

## Related content

- [Connect to MCP](howto-connect-ai-agent.md)
- [Expose MCP through Azure Relay](howto-deploy-mcp-relay.md)
- [Troubleshoot MCP](troubleshoot-mcp.md)

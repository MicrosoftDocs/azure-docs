---
title: Connect to MCP in Azure IoT Operations (preview)
description: Configure client access to MCP Gateway with your own MCP-compatible agent or optionally deploy a sample agent with Foundry Local.
author: ancaantochi
ms.author: ancaantochi
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 10/15/2026
ai-usage: ai-assisted
---

# Connect to MCP in Azure IoT Operations (preview)

> [!IMPORTANT]
> MCP in Azure IoT Operations is in preview. Use a nonproduction environment to evaluate the preview and the examples in this article.

Connect to Azure IoT Operations MCP through **MCP Gateway**, which authenticates clients and
applies the connection's authorization policy before forwarding tool calls.
The following settings let you connect your own MCP-compatible agent.
An optional sample agent is also provided to demonstrate tool use with a model.
The sample isn't required to use MCP.

## Prerequisites

- [Deploy MCP](howto-deploy-mcp.md) and verify the `aio` connection and its authorization policy.
- Review [MCP authentication and authorization](howto-configure-mcp-authorization.md).

## Configure your MCP client

For an agent running in the cluster, configure its MCP client with the following settings:

| Setting | Value |
| --- | --- |
| MCP endpoint | `https://aio-mcp-frontend.azure-iot-operations:443/mcp` |
| Authentication | A projected Kubernetes service account token with audience `aio-mcp-frontend`, sent as a bearer token. The client must reload the token when Kubernetes rotates it. |
| CA trust | The CA bundle from ConfigMap `azure-iot-operations-aio-ca-trust-bundle`. Keep TLS certificate verification enabled. |
| Authorization | A dedicated ServiceAccount with annotation `aio-mcp-auth/roles: '["Reader"]'`, or the roles required by your connection's policy. |

Configure token projection and CA mounting through your agent's deployment.
The agent's model configuration and credentials are separate from its MCP
authentication. You don't need to install the sample agent Helm chart.

For an agent outside the cluster, see
[Connect your own agent through Azure Relay](howto-deploy-mcp-relay.md#connect-your-own-agent)
for a GitHub Copilot CLI example. The client connects through APIM and the
relay to MCP Gateway; the sample agent isn't required.

## Deploy the sample AI agent

This section is optional. Skip it if you use your own MCP-compatible agent.

For the first tool call, use the sample agent with the built-in `aio` connection
and a tool-calling model. You don't need Kubernetes MCP or Azure Relay.
The walkthrough uses MQTT to ask the agent to list assets through MCP Gateway.

The sample AI agent runs in the cluster and uses an OpenAI-compatible model backend.
The `aio-ai-agent` Helm chart published in `ghcr.io`
deploys the sample with MQTT receiver and executor topics. Don't connect the
agent directly to the backend or deploy another MCP server.

The chart connects to the existing MCP Gateway and doesn't install MCP
backends. It configures the tools endpoint, projected token, CA trust, and
dedicated agent ServiceAccount directly from Helm values.

### Sample agent prerequisites

- An Azure IoT Operations installation in the `azure-iot-operations`
  namespace, including the ready MCP Gateway, `aio` connection, authorization
  policy, and `azure-iot-operations-aio-ca-trust-bundle` from [Deploy MCP](howto-deploy-mcp.md).
- [Foundry Local installed as an Azure Arc extension](https://learn.microsoft.com/azure/azure-sovereign-clouds/private/foundry-local/deploy-foundry-local-arc-extension),
  with a model that supports tool calling deployed and reachable from the agent's namespace. Install the
  extension and deploy a model before installing the agent.
- `helm` and `kubectl`, with the `kubectl` context set to the target cluster.
- Access to the agent chart and image in `ghcr.io`.

Enable service-account-token (SAT) authentication on the Foundry Local model
and authorize the agent's ServiceAccount. Add this authentication method to
the model's `ModelDeployment` configuration, preserving its other settings:

```yaml
spec:
  authenticationMethods:
    - method: serviceAccountToken
      enabled: true
      roles:
        - role: GeneralInferenceUser
          authorizedSubjects:
            - serviceAccountName: aio-ai-agent-agent
              serviceAccountNamespace: azure-iot-operations
```

Apply the updated model deployment before invoking the agent. The
ServiceAccount name corresponds to the `aio-ai-agent` Helm release used below.
Foundry Local authorization is separate from the MCP `Reader` role.

Save the following as `agent-frontend-values.yaml`. The dedicated
ServiceAccount has only the `Reader` MCP role; don't annotate the namespace's
default ServiceAccount or the gateway's own identity.

```yaml
agent:
  enabled: true
  image:
    containerRegistry: ghcr.io
    repository: azure-samples/explore-iot-operations/aio-ai-agent
  backend:
    auth: sat
    satAudience: foundry-local
  frontend:
    enabled: true
    url: https://aio-mcp-frontend.azure-iot-operations:443/mcp
    audience: aio-mcp-frontend
    trustBundle: azure-iot-operations-aio-ca-trust-bundle
    serviceAccountAnnotations:
      aio-mcp-auth/roles: '["Reader"]'
```

Install the published chart from the directory containing
`agent-frontend-values.yaml`. No repository checkout or local chart build is
required:

```bash
helm upgrade --install aio-ai-agent oci://ghcr.io/azure-samples/explore-iot-operations/helm/aio-ai-agent \
  --version 0.1.3 \
  --namespace azure-iot-operations \
  --values agent-frontend-values.yaml \
  --set agent.backend.url=<MODEL_BACKEND_URL> \
  --set agent.backend.model=<MODEL_NAME> \
  --wait --timeout 5m
```

The chart and values file use the image repository
`ghcr.io/azure-samples/explore-iot-operations/aio-ai-agent`.
Use the image tag supplied by chart version `0.1.3` rather than overriding it
with a development build.

The backend URL is the OpenAI-compatible base URL (for example,
`https://<MODEL_HOST>/v1`). The chart projects a short-lived token with audience
`foundry-local` at `/var/run/secrets/tokens/backend-sat`. Kubernetes rotates
the token, and the agent reloads it for model requests. No shared credential
Secret or manually generated token is needed. Set
`agent.backend.trustBundle=<BACKEND_CA_CONFIGMAP>`
when using a private CA.

The model token is separate from the `aio-mcp-frontend` token used for tools
and the `aio-internal` token used for MQTT.
`agent.frontend.enabled=true` configures tools through the existing
gateway. Its audience must match the gateway's inbound SAT settings, not
the backend's audience. Include the values file on subsequent Helm upgrades.
The agent Deployment and ServiceAccount are named `aio-ai-agent-agent`.
If MQTT authorization is enabled, grant this ServiceAccount the required broker
permissions for its executor and receiver topics; the MCP `Reader` role
doesn't grant MQTT access.

Verify the agent, gateway, and backend pods, their restart counts, and the
agent logs; a Helm `STATUS: deployed` result doesn't establish agent health:

```bash
kubectl -n azure-iot-operations get pods
kubectl -n azure-iot-operations logs deployment/aio-ai-agent-agent --tail=100
kubectl -n azure-iot-operations logs deployment/aio-mcp-frontend --tail=100
kubectl -n azure-iot-operations get serviceaccount aio-ai-agent-agent -o yaml
```

### Make your first tool call

Ask the agent to call `aio_list_assets`, a read-only tool that lists assets
in your instance. Gateway tool names include the `aio_` connection prefix.
An empty asset list is a valid result; you don't need to create an asset to
run this example.

The request follows this path:

```text
MQTT client -> sample agent -> model selects aio_list_assets
                           -> MCP Gateway -> Azure IoT Operations MCP
MQTT client <- sample agent <- model summarizes the tool result
```

Use two local Bash terminals with the same Kubernetes context. This example
uses the default executor topic, `akri/agent/executor`. If you configured a
different topic, substitute it in the publish command.

#### Prepare an MQTT client

Use the test client from [Test MQTT connectivity](../manage-mqtt-broker/howto-test-connection.md#connect-to-the-default-listener-inside-the-cluster).
If you already have that client, reuse it. Otherwise, deploy it:

```bash
kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/mqtt-client.yaml
kubectl -n azure-iot-operations wait --for=condition=Ready pod/mqtt-client --timeout=180s
kubectl -n azure-iot-operations exec mqtt-client -- sh -c '
  for attempt in $(seq 1 60); do
    if command -v mosquitto_pub >/dev/null && command -v mosquitto_sub >/dev/null; then
      exit 0
    fi
    sleep 2
  done
  echo "MQTT client tools did not become available" >&2
  exit 1
'
```

The pod mounts the broker's CA certificate and a projected SAT with audience
`aio-internal`. Keep TLS verification and SAT authentication enabled.
Don't enable anonymous access or change the default listener.

If broker authorization is enabled, authorize the `mqtt-client` ServiceAccount
to publish to `akri/agent/executor` and subscribe to
`mcp/examples/agent/replies/#`. The agent must be authorized to subscribe to
its executor topic and publish responses to that reply-topic prefix.
These broker permissions are separate from the agent's MCP `Reader` role.

#### Subscribe to the response

In **terminal 1**, run:

```bash
kubectl -n azure-iot-operations exec -i mqtt-client -- sh <<'SH'
set -eu
REQUEST_ID="$(cat /proc/sys/kernel/random/uuid)"
printf '%s\n' "$REQUEST_ID" > /tmp/aio-agent-request-id
CORRELATION_DATA="$(printf '%s' "$REQUEST_ID" | tr -d '-' | cut -c1-16)"
printf 'Expected correlation: %s\n' "$CORRELATION_DATA"

mosquitto_sub -h aio-broker -p 18883 -V mqttv5 -q 1 \
  --cafile /var/run/certs/ca.crt \
  -D CONNECT authentication-method K8S-SAT \
  -D CONNECT authentication-data "$(cat /var/run/secrets/tokens/broker-sat)" \
  -t "mcp/examples/agent/replies/$REQUEST_ID" \
  -C 1 -W 180 -d \
  -F 'correlation=%D properties=%P payload=%p'
SH
```

Wait until the subscriber reports a successful `SUBACK` before publishing.
It waits up to 180 seconds for one response. If it times out, rerun this step
before publishing again.

#### Publish the request

In **terminal 2**, run:

```bash
kubectl -n azure-iot-operations exec -i mqtt-client -- sh <<'SH'
set -eu
REQUEST_ID="$(cat /tmp/aio-agent-request-id)"
CORRELATION_DATA="$(printf '%s' "$REQUEST_ID" | tr -d '-' | cut -c1-16)"
CLIENT_ID="agent-example-$CORRELATION_DATA"

cat > /tmp/aio-agent-request.json <<JSON
{
  "messageId": "$REQUEST_ID",
  "role": "ROLE_USER",
  "parts": [{
    "text": "Call aio_list_assets and list the returned asset names. If no assets are returned, say 'No assets found'. If the call fails or access is denied, report that instead. Do not invent asset names."
  }]
}
JSON

mosquitto_pub -h aio-broker -p 18883 -V mqttv5 -q 1 \
  -i "$CLIENT_ID" \
  --cafile /var/run/certs/ca.crt \
  -D CONNECT authentication-method K8S-SAT \
  -D CONNECT authentication-data "$(cat /var/run/secrets/tokens/broker-sat)" \
  -t akri/agent/executor -f /tmp/aio-agent-request.json \
  -D PUBLISH response-topic "mcp/examples/agent/replies/$REQUEST_ID" \
  -D PUBLISH correlation-data "$CORRELATION_DATA" \
  -D PUBLISH content-type application/json \
  -D PUBLISH payload-format-indicator 1 \
  -D PUBLISH message-expiry-interval 120 \
  -D PUBLISH user-property __protVer 1.0 \
  -D PUBLISH user-property __srcId "$CLIENT_ID" \
  -D PUBLISH user-property __ts "$(date +%s)000:0:$CLIENT_ID"
SH
```

Use `ROLE_USER`, not lowercase `user`. The response topic and mRPC properties
are required to receive and correlate the reply. This example uses 16 ASCII
bytes for correlation data; don't replace them with a 36-character UUID string.
Don't run overlapping examples in the same client pod because they share
the request-ID file.

#### Check the result

Terminal 1 prints the correlation data, mRPC response properties, and JSON
payload. Verify that the correlation matches the value printed before
subscribing, `__stat` is `200`, and the response role is `ROLE_AGENT`.

The following payload is illustrative; identifiers, asset names, and model
wording vary:

```json
{
  "messageId": "<agent-generated-uuid>",
  "contextId": "<conversation-id>",
  "role": "ROLE_AGENT",
  "parts": [{
    "text": "The instance has two assets: boiler-01 and compressor-01."
  }]
}
```

If there are no assets, expect a response such as `No assets found`. A timeout,
authentication failure, or tool error isn't an empty asset list.

Check the agent and gateway logs for the request time:

```bash
kubectl -n azure-iot-operations logs deployment/aio-ai-agent-agent --since=5m
kubectl -n azure-iot-operations logs deployment/aio-mcp-frontend --since=5m \
  | grep 'tool="list_assets"' \
  | grep 'principal="azure-iot-operations:aio-ai-agent-agent"'
```

The gateway should record an authorization decision like this:

```output
backend="aio" tool="list_assets" principal="azure-iot-operations:aio-ai-agent-agent" decision=allow
```

A model-generated answer or mRPC status `200` alone doesn't prove that a tool
succeeded. The authorization log confirms that the agent attempted the tool
call, but `decision=allow` alone doesn't establish backend success either.
Check for tool/backend errors and compare the reported asset names with the
assets configured in your instance. If the model didn't call the tool, or its
answer doesn't match your instance, don't treat the walkthrough as passed.

### Restrict access and repeat the request (optional)

Use a nonproduction instance. Changing the `aio` connection's policy affects
all clients using that connection.

This example starts with the default `aio-mcp-policy-v1` policy. Follow
[Configure an authorization policy with Bicep](howto-configure-mcp-authorization.md#configure-an-authorization-policy-with-bicep)
to create and associate `mcp-reader-policy-v1`, initially allowing
`documentation_overview` and `list_assets`. Keep that article's deployment
variables and Bicep files. Don't edit the versioned default policy in place.
If your connection already uses a different custom policy, don't replace it
with this example.

Restrict the custom policy to `list_devices`, removing the grant for
`list_assets`. Run this command from the directory containing the Bicep files:

```azurecli
az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --name configure-mcp-policy \
  --template-file mcp-authorization-policy.bicep \
  --parameters aioInstanceName="$AIO_INSTANCE_NAME" \
    customLocationName="$CUSTOM_LOCATION_NAME" \
    readerTools='["list_devices"]'
```

Follow [Verify the deployment](howto-configure-mcp-authorization.md#verify-the-deployment)
to confirm the reconciled policy and connection and wait for the gateway
rollout. Then repeat the subscribe and publish steps, which generate a fresh
request ID.

The agent should report that it can't use `aio_list_assets`. Tool discovery
filters unauthorized tools, so it might report that the tool is unavailable
rather than attempting a call. A successfully delivered agent response can
still have mRPC status `200`; don't expect MQTT status `403`.

An illustrative agent response is:

```output
I couldn't list assets because aio_list_assets isn't available to me.
```

Check the agent and gateway logs again. If the agent attempts the restricted
tool, the gateway should record `decision=deny`. If discovery filters the
tool out, there might be no attempted call or denial log. A model-generated
refusal alone isn't proof of policy enforcement. If `aio_list_assets` still
succeeds, stop and check the applied policy, connection, and any additional grants.

Restore the connection's original default policy after the test:

```azurecli
az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --name configure-mcp-connection \
  --template-file mcp-connection.bicep \
  --parameters aioInstanceName="$AIO_INSTANCE_NAME" \
    customLocationName="$CUSTOM_LOCATION_NAME" \
    authorizationPolicyName=aio-mcp-policy-v1
```

Wait for reconciliation and rollout again, then repeat the MQTT subscribe and
publish steps to confirm that the agent can use `aio_list_assets` again.

### Clean up the test client

If you created the `mqtt-client` pod and ServiceAccount solely for this
walkthrough, remove them when finished. Don't delete an existing shared client.

```bash
kubectl -n azure-iot-operations delete pod mqtt-client
kubectl -n azure-iot-operations delete serviceaccount mqtt-client
```

### Optional extensions

- Add [Kubernetes MCP](howto-deploy-kubernetes-mcp.md) if the agent needs Kubernetes tools.
- Use [Azure Relay](howto-deploy-mcp-relay.md) if a client outside the cluster needs access to MCP Gateway.

Neither extension is required for the `aio_list_assets` example.

## Related content

- [Configure MCP authorization](howto-configure-mcp-authorization.md)
- [Expose MCP through Azure Relay](howto-deploy-mcp-relay.md)
- [Troubleshoot MCP](troubleshoot-mcp.md)

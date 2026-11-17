---
title: Query MQTT broker metadata with MCP in Azure IoT Operations (preview)
description: Use the broker metadata MCP tool to inspect MQTT sessions, subscriptions, queued messages, and retained topic names in Azure IoT Operations.
author: jgoldberg1
ms.author: jegoldberg
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 11/13/2026
ai-usage: ai-assisted
---

# Query MQTT broker metadata with MCP in Azure IoT Operations (preview)

Use the `broker_metadata` tool to inspect the MQTT broker's current sessions, subscriptions, client queue state, and retained topic names. For example, an AI agent can identify disconnected sessions with queued messages or find the topic filters a client subscribes to.

> [!IMPORTANT]
> MCP in Azure IoT Operations is in preview. Use a nonproduction environment to evaluate the preview and the examples in this article.

## Prerequisites

- [Deploy MCP](howto-deploy-mcp.md) and verify its connection.
- [Connect an MCP-compatible client](howto-connect-ai-agent.md).
- [Configure MCP authorization](howto-configure-mcp-authorization.md) to permit your client to call `broker_metadata`.

## Permit the client to call the tool

For example, grant a dedicated `BrokerMetadataReader` role access to `broker_metadata`. In your custom MCP authorization policy's Bicep definition, append this entry to `properties.policies`, preserving the grants required by other clients:

```bicep
{
  action: 'ToolCall'
  principal: {
    principalType: 'Role'
    role: 'BrokerMetadataReader'
  }
  resources: [
    'broker_metadata'
  ]
}
```

Follow [Configure an authorization policy with Bicep](howto-configure-mcp-authorization.md#configure-an-authorization-policy-with-bicep) to deploy the custom policy and reference it from the `aio` connection in `PolicyBased` mode. Don't modify the versioned default policy in place. Use the unprefixed tool name `broker_metadata` in the policy, not `aio_broker_metadata`.

Add the role to the MCP client's ServiceAccount through its deployment configuration. For a client that already has `Reader`, merge this annotation into its ServiceAccount metadata:

```yaml
metadata:
  annotations:
    aio-mcp-auth/roles: '["Reader","BrokerMetadataReader"]'
```

Preserve any other roles the client requires. Annotate the client's ServiceAccount, not the gateway's or backend's. After the policy and connection reconcile, start a new client session and verify that `aio_broker_metadata` is available. This grant permits all of the tool's metadata queries; it doesn't grant the backend broker permissions configured in the next section.

## Configure broker metadata access

The MCP backend also needs broker permissions to connect and subscribe to metadata topics. MCP roles don't grant these permissions. The tool uses MQTT 5 to read metadata through the backend's broker identity.

Use a combined authorization policy on the backend's existing listener port: retain the permissions required by existing clients and tools, and add a rule granting metadata access only to the MCP backend. You don't need a dedicated port or a different backend endpoint.

> [!IMPORTANT]
> If the listener port doesn't have an explicit authorization policy, attaching one replaces its default authorization behavior. Include the permissions required by all existing clients and tools before attaching the policy. Don't attach a metadata-only policy to a shared port.

For a backend that authenticates with a Kubernetes service account token, grant access by using an authorization attribute:

1. Add the annotation `aio-broker-auth/mcp-metadata: "enabled"` to the MCP backend's ServiceAccount through its deployment configuration. Don't annotate the MCP client's or gateway's ServiceAccount.
1. Follow [Configure MQTT broker authorization](../manage-mqtt-broker/howto-configure-authorization.md) to update the policy used by the backend's listener port, or create a combined policy if none is linked. Preserve the existing permissions and append the following rule to the policy's rules list (`spec.authorizationPolicies.rules` in Kubernetes YAML). This fragment isn't a complete policy.

   ```yaml
   - principals:
       attributes:
         - mcp-metadata: "enabled"
     brokerResources:
       - method: Connect
       - method: Subscribe
         topics:
           - "$SYS/topology"
           - "$SYS/store/sessions/#"
           - "$SYS/store/client_state/#"
           - "$SYS/store/retain/#"
   ```

1. Verify that the combined policy is [linked to the listener port](../manage-mqtt-broker/howto-configure-authorization.md#link-brokerauthorization-to-brokerlistener) used by the MCP backend. Keep the existing port, authentication, TLS, and service settings unchanged.
1. Reconnect the MCP backend to the broker after updating its ServiceAccount attributes, so authentication picks up the changes.

For other authentication methods, match the backend's authenticated attributes as described in [Configure MQTT broker authorization](../manage-mqtt-broker/howto-configure-authorization.md).

The added rule grants all metadata queries to the annotated backend identity. Other clients retain their existing permissions without receiving metadata access from this rule. To limit the backend's metadata access, grant only the subscription permissions needed:

| Query | Required broker subscription permissions |
| --- | --- |
| `Topology` | `$SYS/topology` |
| `Sessions`, without a key | `$SYS/topology` and `$SYS/store/sessions/#` |
| `Sessions`, with a key | `$SYS/store/sessions/<client-id>` |
| `ClientState` | `$SYS/topology` and either `$SYS/store/client_state/#` for a listing or `$SYS/store/client_state/<session-tag>` for a lookup |
| `Retain` | `$SYS/topology` and `$SYS/store/retain/#` |

A broker grant for `#` doesn't include `$SYS` topics. Explicitly grant the required `$SYS` namespace.

> [!NOTE]
> Metadata is read using the MCP backend's identity, not the original caller's MQTT identity. Collection results aren't filtered by each caller's MQTT topic permissions. Grant tool access only to callers who can inspect the returned client IDs, subscriptions, queue state, and topic names.

## Choose a query

The tool accepts a required `query` argument and an optional `key`. Query names are case-sensitive.

| `query` | Result | `key` |
| --- | --- | --- |
| `Topology` | Number of logical backend chains, in `chains`. | Omit. |
| `Sessions` | Sessions, including connection status, expiry, keep-alive, receive maximum, persistence setting, session tag, and subscriptions. | Omit to list all sessions, or specify an exact MQTT client ID. |
| `ClientState` | Client state, including queued and in-flight message counts, connection status, receive maximum, and persistence status. | Omit to list all client states, or specify an exact session tag as `frontendId:generationId:connectionKey`. |
| `Retain` | Topic names that have retained messages. Doesn't return their payloads. | Omit. |

Keys don't support `+` or `#` wildcards. `Topology` and `Retain` reject keys. Listings return an `items` array; exact lookups return an `item` object or `null` when no matching entry exists.

For example, ask your agent:

> Show the disconnected MQTT sessions and their queued message counts.

The agent can list sessions, retrieve client state, and match entries by session tag. The following examples show tool arguments and illustrative results. Values vary by instance.

## Get the backend chain count

Through the default `aio` connection, clients see the tool as `aio_broker_metadata`. MCP authorization policies use the unprefixed name, `broker_metadata`.

Call `aio_broker_metadata` with these arguments:

```json
{
  "query": "Topology"
}
```

Example result:

```json
{
  "chains": 4
}
```

`chains` is the number of backend partitions multiplied by the number of workers per partition. For example, two partitions with two workers each produce four logical chains. It isn't the partition count or replica count.

## Inspect a session and its subscriptions

To list sessions, use `{"query": "Sessions"}`. To inspect one session, specify its MQTT client ID:

```json
{
  "query": "Sessions",
  "key": "sensor-a"
}
```

Example result:

```json
{
  "item": {
    "clientId": "sensor-a",
    "sessionTag": {
      "frontendId": 1,
      "generationId": 0,
      "connectionKey": 12345
    },
    "connected": true,
    "expiryIntervalS": 3600,
    "keepAlive": 60,
    "receiveMaximum": 16,
    "persistent": true,
    "subscriptions": [
      {
        "filter": "telemetry/#",
        "qos": 1,
        "noLocal": false,
        "retainAsPublished": false,
        "retainHandling": 0
      }
    ]
  }
}
```

`expiryIntervalS` is the session expiry interval in seconds; `null` means no expiry. Disconnected sessions also include `expiresAtS`, an expiry time in Unix seconds. A session can remain in the broker after its client disconnects, until the session expires.

Each subscription includes its topic filter, maximum QoS, and MQTT subscription options. An empty `subscriptions` array means the session has no subscriptions.

## Inspect queued and in-flight messages

To list client states, use `{"query": "ClientState"}`. For one session, use the `sessionTag` from its `Sessions` result, formatted as `frontendId:generationId:connectionKey`. Don't use the client ID as the key.

```json
{
  "query": "ClientState",
  "key": "1:0:12345"
}
```

Example result:

```json
{
  "item": {
    "clientId": "sensor-a",
    "frontendId": 1,
    "generationId": 0,
    "connectionKey": 12345,
    "connected": true,
    "queueDepth": 5,
    "inflight": 2,
    "receiveMaximum": 16,
    "isPersisted": true
  }
}
```

The tool combines client state from all backend chains by session tag, summing `queueDepth` and `inflight`. `clientId` can be `null` when no matching session entry is available. `receiveMaximum` limits the QoS 1 messages the broker can send to the client before receiving acknowledgments.

## List retained topic names

```json
{
  "query": "Retain"
}
```

Example result:

```json
{
  "items": [
    "factory/line-1/status",
    "factory/line-2/status"
  ]
}
```

This query lists topic names only. It doesn't read retained message payloads or support an exact-topic key.

## Interpret results and errors

An empty `items` array means the query succeeded but found no entries. An exact lookup returning `{"item": null}` means the query succeeded but didn't find the requested key. Connection failures, rejected subscriptions, timeouts, and invalid responses are errors, not empty results.

Listings collect responses from all backend chains. If an expected chain doesn't respond, the tool returns a timeout error rather than a partial listing. Results reflect current broker state, aren't ordered, and aren't a synchronized snapshot across chains or separate calls. They don't provide historical data or a continuous event stream.

If the tool isn't visible, check the backend's available tools and your MCP policy. If a subscription is rejected, check the backend's broker permissions for the required `$SYS` topics. For connection and timeout failures, see [Troubleshoot MCP](troubleshoot-mcp.md).

## Related content

- [What is Azure IoT Operations MCP?](overview-mcp.md)
- [Configure MCP authorization](howto-configure-mcp-authorization.md)

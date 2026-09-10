---
title: Monitor OPC UA server availability with heartbeat monitoring
description: Learn how the connector for OPC UA uses server heartbeat monitoring to detect whether an OPC UA server is alive and report inbound endpoint health.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-opcua-connector
ms.topic: concept-article
ms.date: 09/04/2026
ai-usage: ai-assisted

# CustomerIntent: As an industrial edge operator, I want to understand how server heartbeat monitoring detects OPC UA server outages so that I can tell a server failure apart from a configuration or data collection problem.
---

# Monitor OPC UA server availability with heartbeat monitoring

Server heartbeat monitoring lets the connector for OPC UA detect whether an OPC UA server is alive, independently of the data that it collects from your assets. When a server stops responding, the connector reports the affected inbound endpoint as unhealthy so that you can quickly tell a server outage apart from an asset or data configuration problem.

Server heartbeat monitoring is available starting with Azure IoT Operations release 2607.

## How server heartbeat monitoring works

The OPC UA commander opens a dedicated monitoring session to each OPC UA server and subscribes to the server's `CurrentTime` node (`i=2258`). The `CurrentTime` node updates continuously while the server runs, so it's a reliable signal that the server is alive.

The monitor uses a fixed one-second sampling interval and applies the following rules:

- After three consecutive missed updates, the monitor declares the server *not alive*.
- After two consecutive good updates, the monitor restores the server to *alive*.

This behavior avoids false alarms from a single missed sample while still detecting a genuine outage within a few seconds.

## Shared liveness per server

The connector maintains one reference-counted heartbeat monitor per normalized OPC UA server discovery URL. When multiple inbound endpoints target the same server, they share a single heartbeat session instead of opening a separate monitoring session per endpoint. This sharing reduces the load on the server.

Although these endpoints share the server-level liveness signal, the OPC UA commander maintains and publishes a separate health state for each inbound endpoint. The shared heartbeat fans out changes to every endpoint that targets that server, so each endpoint reports its liveness independently.

## How heartbeat monitoring affects endpoint health reporting

When you enable server heartbeat monitoring for an inbound endpoint, the OPC UA commander manages the device health reporting for that endpoint. The connector suppresses its own competing device-status writes so that the health you see reflects the heartbeat result.

When you disable server heartbeat monitoring for an inbound endpoint, the connector reports endpoint health based on its own data session instead. In both cases, the data path is unaffected. Heartbeat monitoring changes only how endpoint health is reported, not how the connector collects or publishes data.

Inbound endpoint health appears in the operations experience web UI and in the Azure portal. For more information about how health status works across Azure IoT Operations, see [Unified health status reporting and observability](../deploy-iot-ops/health-status-reporting.md).

## Configure server heartbeat monitoring

Configure server heartbeat monitoring per inbound endpoint through the endpoint's `additionalConfiguration`. The `serverHeartbeat.enabled` property defaults to `true`, so heartbeat monitoring is on for every inbound endpoint unless you turn it off.

The following Bicep example explicitly enables server heartbeat monitoring for an inbound endpoint:

```bicep
inbound: {
  'my-opcua-endpoint': {
    endpointType: 'Microsoft.OpcUa'
    address: 'opc.tcp://my-plc.my-namespace:4840'
    authentication: {
      method: 'Anonymous'
    }
    additionalConfiguration: string({
      serverHeartbeat: {
        enabled: true
      }
    })
  }
}
```

### Disable server heartbeat monitoring for an endpoint

To disable server heartbeat monitoring for an inbound endpoint, set `serverHeartbeat.enabled` to `false` and update the device:

```bicep
additionalConfiguration: string({
  serverHeartbeat: {
    enabled: false
  }
})
```

When you disable heartbeat monitoring for an endpoint:

- The endpoint is removed from heartbeat monitoring and from heartbeat metric and status reporting.
- Other endpoints, including endpoints that target the same OPC UA server, continue to be monitored.
- The data path for the endpoint is unaffected. The connector reports the endpoint's health from its data session instead.

## Monitor the server heartbeat state

The OPC UA commander emits the `aio.opc.commander.server.heartbeat.state` gauge metric, which reports the current liveness of the OPC UA server for each inbound endpoint. The metric uses the `aio.opc.inbound.endpoint` dimension and has the following values:

| Value | State | Meaning |
| --- | --- | --- |
| `1` | Alive | The server responds and the `CurrentTime` node updates. |
| `0` | Not alive | The server missed three consecutive updates. |
| `-1` | Unknown | The monitor doesn't yet have enough information to determine liveness, such as right after startup. |

The metric doesn't include a server URL dimension. Because liveness is shared per server, the endpoint dimension identifies which inbound endpoint the reported state applies to.

For the full connector metric reference, see [Metrics for the connector for OPC UA](../reference/observability-metrics-opcua-broker.md).

## Compare heartbeat monitoring with related features

Server heartbeat monitoring is distinct from other connector features that also involve sessions, availability, or the word *heartbeat*:

| Feature | What it does | How it differs from server heartbeat monitoring |
| --- | --- | --- |
| Dataset publishing and triggering | Controls when the connector publishes dataset values from your assets, including the publishing interval and triggering item behavior. | Affects the data that you collect and publish. Server heartbeat monitoring only detects server liveness and reports endpoint health. |
| [Shared endpoint mode](overview-opc-ua-connector.md#shared-endpoint-mode) | Lets multiple assets share a single OPC UA data session for an endpoint. | Changes how data sessions are shared. Server heartbeat monitoring uses a separate monitoring session and is independent of session sharing. |
| [High availability](howto-configure-opc-ua-sessions-high-availability.md) | Runs active and passive connector instances so that telemetry survives a connector failure. | Protects against connector failures. Server heartbeat monitoring detects OPC UA server failures. |

## Related content

- [What is the connector for OPC UA?](overview-opc-ua-connector.md)
- [Configure OPC UA assets and devices](howto-configure-opc-ua.md)
- [Configure OPC UA sessions and high availability](howto-configure-opc-ua-sessions-high-availability.md)
- [Metrics for the connector for OPC UA](../reference/observability-metrics-opcua-broker.md)
- [Unified health status reporting and observability](../deploy-iot-ops/health-status-reporting.md)

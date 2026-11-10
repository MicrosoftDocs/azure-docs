---
title: Troubleshoot IoT Hub with Azure MCP Server
titleSuffix: Azure IoT Hub
description: Use Azure MCP Server tools to investigate missing telemetry, throttling, routing latency, and device identity issues in IoT Hub.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 11/10/2026
---

# Troubleshoot IoT Hub with Azure MCP Server

Azure MCP Server exposes Azure operations through the Model Context Protocol
(MCP). Its `iothub` namespace includes IoT Hub-specific tools. Combine supported
hub, monitoring, and destination tools to investigate missing telemetry,
throttled requests, increased routing latency, or device identity issues.

This is the IoT Hub surface in Azure MCP Server, not a separate hosted IoT Hub
MCP endpoint or the Azure IoT Operations MCP Server. An assistant's diagnosis
must be supported by observations; tool access doesn't guarantee a root cause.

## Prerequisites

- Complete [Azure MCP Server setup](/azure/developer/azure-mcp-server/get-started)
  for your supported client, such as Visual Studio Code.
- Use an Azure identity with the required resource and data-plane permissions.
  Hub management, device-registry access, Log Analytics queries, and destination
  reads can require different permissions.
- Select the intended tenant and subscription explicitly.
- Enable the required tools and start with read-only operations and
  least-privilege permissions. Review the
  [shared server controls](/azure/developer/azure-mcp-server/tools/).
- Collect the hub resource ID, resource group, device ID, destination, and
  investigation start/end times in UTC.
- Ensure that relevant diagnostic logs were collected before the incident.
  Enabling collection later doesn't recover earlier uncollected data.

Don't disable confirmation controls or request keys, connection strings or private
certificates for a routine investigation. A prompt saying "read only" is not a
substitute for server configuration and Azure authorization.

## Confirm the available tools

The [IoT Hub MCP reference](/azure/developer/azure-mcp-server/tools/azure-iot-hub)
provides tool documentation. Check your installed version and tool discovery
before using the operations below.

| Tool | Command | Returned evidence and limits |
| --- | --- | --- |
| Get IoT Hub | `azmcp iothub hub get` | Hub ID, name, location, resource group, subscription, SKU, capacity, state, and hostname, including configured message-routing endpoints and their target resource details. This doesn't prove delivery or application receipt. |
| List IoT Hub devices | `azmcp iothub device list` | Device identity metadata without authentication secrets. `--max-count` defaults to 100 and has a maximum of 100. `truncated=true` indicates that more devices exist than this call returned. |
| Show IoT Hub device | `azmcp iothub device show` | Identity metadata for one device, excluding authentication secrets. A registered identity doesn't prove an active connection. |
| Get IoT Hub device statistics | `azmcp iothub device stats` | Aggregate counts of enabled, disabled, and total registered devices. Enabled devices aren't necessarily connected. |
| Get IoT Hub device twin | `azmcp iothub device twin get` | Device twin tags and desired/reported properties. These aren't proof of current connectivity or telemetry delivery. |
| Run IoT Hub query | `azmcp iothub query run` | Results from a raw IoT Hub SQL query or structured filters compiled into a query. The tool pages internally to return the full matching set, or a partial set with an error if the `--max-count` cap is reached. |
| Get IoT Hub routing endpoint health | `azmcp iothub routing endpoint-health` | The current IoT Hub-reported health snapshot for one or all custom endpoints: status, last known error, and last send/success timestamps. It doesn't query metrics, apply a time window, or infer health. |
| Get IoT Hub routing endpoint diagnostics | `azmcp iothub routing endpoint-diagnostics` | Time-windowed IoT Hub delivery and latency metrics, current target-resource existence, and native Azure Monitor destination metrics for Event Hubs, Service Bus, Blob Storage, or Cosmos DB. Evidence is reported as returned by the services. |

Device list has a default and maximum count of 100. Check `truncated` before
interpreting the returned list. Absence from a truncated result isn't proof that
a device doesn't exist.

Device queries have different result-limit behavior from device listing:
inspect both results and errors before treating a query result as complete.

Source-code availability alone isn't proof that a tool is in your installed
package. If a needed operation isn't available, use
the documented portal or CLI troubleshooting path rather than inventing a tool.

<!-- REVIEW BLOCKER: Tool scope supplied by the feature owner, with implementation
references microsoft/mcp PRs #3005, #3074, #3180, and #3894. Verify minimum customer
package versions and execute the walkthrough before declaring it runtime-tested.
Implementation references alone don't establish released-package availability. -->

## Investigate a missing message

### 1. Establish the resource and time window

Start with a bounded prompt:

```text
Use read-only operations in subscription <subscription-id>.
Get metadata for IoT Hub <hub-name> in resource group <resource-group>.
Investigate missing telemetry for device <device-id> between <UTC-start> and
<UTC-end>, with destination <destination-name>. Do not change resources or
retrieve credentials. Report any missing permissions or unavailable tools.
```

Check the returned resource ID and hostname before continuing. A similarly named
hub in another subscription is not evidence about the affected workload.

If you list devices, specify a bounded count and inspect truncation. Use
`azmcp iothub device show` for an exact-device check when available. Use device
statistics for aggregate registry counts rather than counting a truncated list.

### 2. Gather ingress and routing evidence

Use the [Azure Monitor tools](/azure/developer/azure-mcp-server/tools/azure-monitor)
to discover relevant workspaces/tables and query the hub's data in the selected
window. Inspect available metric definitions and supported dimensions.

```text
For this hub and UTC window, inspect the supported telemetry ingress,
throttling, and routing signals. Query relevant collected logs and identify
configuration changes in the Activity Log. Cite the metric or log evidence
for each observation. Distinguish missing data from a zero result.
```

Use [routing and throttling guidance](monitor-iot-hub-reference.md#investigate-routing-and-throttling-together)
to interpret the evidence. Unsupported metrics or operations must not be used
to diagnose a profile that doesn't implement them.

Use `azmcp iothub hub get` to inspect configured routing endpoints and their
target resources. Use `azmcp iothub routing endpoint-health` for the current
health snapshot and `azmcp iothub routing endpoint-diagnostics` for time-windowed
delivery and latency evidence. The health snapshot and current target-resource
existence aren't historical observations for the investigation window.

For versions exposing these tools, use a prompt such as:

```text
For the configured routing endpoint <endpoint-name>, retrieve its current
IoT Hub-reported health snapshot separately from diagnostic evidence for
<UTC-start> through <UTC-end>. Include IoT Hub delivery and latency metrics,
current target-resource existence, and supported destination metrics.
Report service errors and missing data explicitly. Don't infer that a particular
message arrived from endpoint health or aggregate metrics alone.
```

If these tools aren't available in your installed version, follow
[Troubleshoot message routing](troubleshoot-message-routing.md).

### 3. Inspect the destination

Choose the tools appropriate to the configured endpoint:

- Routing endpoint diagnostics provides native destination metrics for Event
  Hubs, Service Bus, Blob Storage, and Cosmos DB. Don't assume that this
  destination-metric coverage includes Microsoft Fabric Eventstreams.
- [Event Hubs tools](/azure/developer/azure-mcp-server/tools/azure-event-hubs)
  can inspect destination resources and consumer groups.
- [Service Bus tools](/azure/developer/azure-mcp-server/tools/azure-service-bus)
  can retrieve queue, topic and subscription runtime information.
- For other destinations, use their supported diagnostic tools and the receiving
  application's evidence. Don't assume that a connector for one destination
  can inspect another.

Confirm the endpoint identity, permissions and consumer configuration. Destination
health or message counts alone don't prove that a particular test message arrived
or was processed.

### 4. Separate observations from the diagnosis

Ask for a summary that distinguishes:

1. The observed facts, with resource identifiers and timestamps.
1. The first failing checkpoint supported by evidence.
1. Alternative explanations and missing observations.
1. A proposed next action and its expected verification result.

MCP tools can't reconstruct missing device logs or diagnostic data that was never
collected. A registered identity doesn't prove an active device connection, and
a successful publish doesn't prove downstream delivery.

## Investigate a throttling issue

Use this scenario when a device or service reports throttled requests, such as
HTTP 429 responses or corresponding SDK errors. Start with the failed operation,
its error details, and a bounded UTC time window rather than assuming that all
throttling is caused by telemetry sends.

1. Use `azmcp iothub hub get` to confirm the hub, SKU, and capacity.
1. Use supported Azure Monitor tools to inspect **Number of throttled requests**
   (`throttledRequests`) with **Total** aggregation, split by **Throttle Type**
   (`ThrottleType`). The metric and dimension are available for both classic
   and MQTT v5 connection profiles.
1. Correlate the reported operation category with device or service logs,
   attempted request rates, retry behavior, and the applicable
   [operation throttles](iot-hub-devguide-quotas-throttling.md#operation-throttles).
1. If delivery is also affected, collect routing endpoint diagnostics over the
   same window. Distinguish requests throttled by IoT Hub from delivery problems
   at the destination.

```text
Use read-only operations in subscription <subscription-id>.
Investigate throttling on IoT Hub <hub-name> in resource group <resource-group>
between <UTC-start> and <UTC-end>. The affected operation is <operation>;
the observed error is <redacted-error>.
Confirm the hub's SKU and capacity. Inspect throttledRequests using Total,
split by ThrottleType, through available Azure Monitor tools.
Correlate the categories with the supplied client logs, request rates, and
documented limits. If delivery is affected, collect routing diagnostics for
<endpoint-name> over the same window.
Report missing tools, permissions, or data. Don't change capacity, routes,
retry settings, or credentials. Recommend a next step supported by evidence.
```

`ThrottleType` identifies an operation category, not the precise root cause or
an affected device. A hub-level count alone doesn't establish which device or
application was throttled. A retry can generate another request, so don't
interpret the count as the number of unique devices or messages affected.

If metric retrieval isn't available through your installed tools, use Azure
Monitor in the portal or the Azure CLI. For metric definitions and interpretation,
see [Investigate routing and throttling together](monitor-iot-hub-reference.md#investigate-routing-and-throttling-together).
Don't infer that increasing hub units resolves every type of throttling.

## Investigate increased routing latency

Use this scenario when messages arrive late rather than disappearing entirely.
Use `azmcp iothub routing endpoint-diagnostics` to gather time-windowed delivery,
latency, and supported destination metrics. Retrieve
`azmcp iothub routing endpoint-health` separately for the current snapshot.

```text
Use read-only operations in subscription <subscription-id>.
Investigate delayed delivery from IoT Hub <hub-name> in resource group
<resource-group> to routing endpoint <endpoint-name>.
Compare <incident-UTC-start> through <incident-UTC-end> with
<baseline-UTC-start> through <baseline-UTC-end>.
Collect routing delivery and latency metrics with their supported aggregations
and dimensions, plus available destination metrics for both windows.
Report current endpoint health separately. Identify evidence of a delivery
problem versus a receiving-application processing delay, and state what
additional observations are needed. Don't change resources.
```

Compare equivalent windows and endpoint filters. Don't sum latency samples or
treat a currently healthy endpoint as proof that it was healthy during the
incident. IoT Hub routing latency isn't a measurement of the receiving
application's processing time. Use message identifiers and application timestamps
to investigate that final stage.

## Investigate a device identity issue

Use this scenario when a device can't connect or an application can't find its
registered identity. For a hub using the IoT Hub device registry, use
`azmcp iothub device show` for an exact lookup instead of searching a truncated
device list.

```text
Use read-only operations in subscription <subscription-id>.
For IoT Hub <hub-name> in resource group <resource-group>, retrieve the identity
metadata for device <device-id> using the exact-device lookup.
Report whether the lookup succeeded and whether the identity is enabled.
Distinguish a not-found response from an authorization or tool-availability
error. Don't retrieve authentication secrets or change the device.
Use the supplied connection error and client logs to identify the next
diagnostic check; don't infer successful authentication from registration alone.
```

An enabled identity doesn't prove an active connection, valid credentials, or
successful TLS negotiation. Continue with
[device connectivity troubleshooting](iot-hub-troubleshoot-connectivity.md)
when the identity exists but the connection still fails.

These device tools target the IoT Hub device registry. Don't assume that they
inspect an Azure Device Registry device record for an ADR-backed scenario;
use the supported registry-specific tools for that record.

## Approve remediation separately

Don't allow an investigation prompt to silently create diagnostic settings,
change routes, increase capacity, rotate credentials or delete resources.
Review the exact resource, proposed change, permissions and cost implications
before approving any write operation.

After an approved change, generate a new, uniquely identified test message and
verify the full path with the device and receiving application. A successful
configuration update is not the final success criterion.

## Escalate with evidence

For [Azure support](../iot/iot-support-help.md), collect the resource ID, UTC
window, affected operation, redacted errors, relevant metrics/logs, and the MCP
server/client versions. State which tools were unavailable or denied.
Remove credentials, message secrets and unnecessary device/customer data from
diagnostic attachments.

## Related content

- [Monitor IoT Hub](monitor-iot-hub.md)
- [Troubleshoot device connectivity](iot-hub-troubleshoot-connectivity.md)
- [Troubleshoot message routing](troubleshoot-message-routing.md)

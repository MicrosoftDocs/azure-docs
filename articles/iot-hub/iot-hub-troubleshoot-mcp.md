---
title: Troubleshoot IoT Hub with Azure MCP Server
titleSuffix: Azure IoT Hub
description: Use supported Azure MCP Server tools to gather IoT Hub, monitoring, and destination evidence for a missing-telemetry investigation.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 11/07/2026
---

# Troubleshoot IoT Hub with Azure MCP Server

Azure MCP Server exposes Azure operations through the Model Context Protocol
(MCP). Its `iothub` namespace includes IoT Hub-specific tools. Combine supported
hub, monitoring, and destination tools to investigate a problem such as
"my device publishes telemetry, but the application doesn't receive it."

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
documents the current released surface. Check your installed version and tool
discovery before writing prompts that depend on additional operations.

| Documented operation | What it establishes | What it doesn't establish |
| --- | --- | --- |
| Hub: Get | Hub resource identity, location, SKU/capacity, state and hostname | Device authentication, route delivery, or application receipt |
| Device: List | A bounded set of device identity metadata, without authentication keys | A complete inventory when the result is truncated, or current device health |

Device list has a default and maximum count of 100. Check `truncated` before
interpreting the returned list. Absence from a truncated result isn't proof that
a device doesn't exist.

Additional device, twin, query, and routing diagnostics operations might be
available in newer versions. Source-code availability alone isn't proof that
a tool is in your installed package. If a needed operation isn't available, use
the documented portal or CLI troubleshooting path rather than inventing a tool.

<!-- REVIEW BLOCKER: Verify customer package versions and runtime behavior for
device show/stats/twin get/query run and routing endpoint-health/endpoint-diagnostics.
Add tested prompts and minimum versions before advertising these as released tools. -->

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

If you list devices, specify a bounded count and inspect truncation. Use an
available exact-device operation or the normal device-management tools when a
complete identity check is needed.

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

For route configuration and endpoint health, use the matching tools only when
your installed version exposes them. Otherwise follow
[Troubleshoot message routing](troubleshoot-message-routing.md).

### 3. Inspect the destination

Choose the tools appropriate to the configured endpoint:

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

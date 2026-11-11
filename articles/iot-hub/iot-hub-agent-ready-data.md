---
title: Prepare IoT Hub telemetry for agents and analytics (preview)
titleSuffix: Azure IoT Hub
description: Use preview device type references, route schema references, and standardized payload formats to prepare IoT Hub telemetry for applications, analytics, and agents.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: concept-article
ms.date: 11/10/2026
---

# Prepare IoT Hub telemetry for agents and analytics (preview)

IoT Hub can deliver telemetry with context that helps applications, analytics
systems, and agents understand which device produced a reading, which data
contract describes it, and how to interpret its payload. Configure device type
references, route schema references, and endpoint message formats to carry this
context into downstream services such as Microsoft Fabric.

> [!IMPORTANT]
> The device-type context, message schema reference, and standardized message
> payload capabilities described in this article are in **preview**.
> ADR linking and the Microsoft Fabric Eventstream routing endpoint are
> generally available capabilities that you can use with this preview.

## Separate the three kinds of context

| Concept | Where it belongs | Purpose |
| --- | --- | --- |
| Device type reference | DPS individual or group enrollment; ADR device record after provisioning | Identifies the kind of device, such as a WoT Thing Model, and provides device-type context for routed telemetry. |
| Data schema reference | IoT Hub route | Associates routed messages with the contract that describes their original payload. |
| Message payload format | IoT Hub routing endpoint | Delivers the original device payload or represents it as a standardized observation. |

These settings work together. For example, a temperature sensor has a device
type reference, its temperature readings use a versioned data schema, and its
route delivers those readings to Fabric in a standardized observation format.
A device can emit multiple message shapes, and a route can serve many devices,
so manage the device-type definition and message schema as separate contracts.

## Associate messages with a schema

The route's **Data schema reference** maps to `dataSchema` in ARM and
`--data-schema-ref` in the Azure IoT CLI. It describes the original payload, not
the standardized observation wrapper or the destination transport envelope.

For example, `urn:example:schema:temperature-reading:1` can identify a schema
owned by your application. Use a reference that consumers can resolve to the
appropriate contract and version.

When a message matches the route, IoT Hub includes the configured schema
reference in the routed message's metadata. A receiving application can use
that reference to select the appropriate parser, validation rules, or analytics
model. For Fabric destinations, retain the schema metadata alongside the
CloudEvents context when processing the event.

The reference identifies the payload contract; validation of the payload against
that contract belongs in the producer or downstream processing stage. Keep the
original-payload schema reference distinct from the identifier of a standardized
observation format.

The reference is optional. In this preview, IoT Hub stores it as a string;
saving a route doesn't validate it against a registry, and routing doesn't
dereference it or validate each payload. The reference doesn't change the routing
query or transform the payload. Route-query testing isn't schema validation or
a test of the delivered format.

Leave the reference unset if you don't have one. Use a reference that describes
every message selected by the route. If telemetry and fault messages use
different schemas, use separate routes with appropriate conditions and references.
For destinations that emit CloudEvents, the corresponding envelope attribute
is `dataschema`. Don't assume every destination emits CloudEvents.

## Select the endpoint's message format

The endpoint's **Message format** maps to `messagePayloadFormat` in ARM and
`--message-format` in the Azure IoT CLI.

| Selection | API value | Payload behavior |
| --- | --- | --- |
| Device format | `None` | Preserves the original device payload; destination-specific encoding, envelopes, and batching still apply. |
| Standardized | `DOObservationV1` | Wraps the original JSON value in the Digital Operations observation v1 format, identified by `com.do.telemetry.observation.v1`. |

For the standardized format, publish a valid UTF-8 body containing one JSON value.

For example, `temperature-sensor-01` publishes this device payload:

```json
{
  "deviceId": "temperature-sensor-01",
  "temperature": 21.5,
  "unit": "C"
}
```

In device format, the consumer reads the original payload according to the
destination's encoding and envelope. In standardized format, the original
value appears under `payload.value` in an observation array. The observation
provides a consistent structure for device context, event time, and the reading.

With **Standardized** (`DOObservationV1`) selected, the same reading is represented
as follows. This simplified example shows the observation structure and original
payload; additional device context and destination metadata are omitted.

```json
[
  {
    "event_time": "2026-11-10T12:00:00Z",
    "event_kind": "measurement",
    "contract_version": "1.0",
    "schema_id": "com.do.telemetry.observation.v1",
    "schema_version": "1.0",
    "payload": {
      "value": {
        "deviceId": "temperature-sensor-01",
        "temperature": 21.5,
        "unit": "C"
      }
    }
  }
]
```

The original fields are preserved inside `payload.value`. For example, a consumer
reads the temperature from the first observation's `payload.value.temperature`.
The identifier `com.do.telemetry.observation.v1` describes that structure,
while the route schema reference describes the original temperature payload.

Standardized output doesn't rename fields, convert units, flatten objects,
or normalize the inner payload against your schema. Where configured, the
device's ADR device type reference supplies its semantic type; a route's data
schema reference doesn't assign a device type. A missing device type reference
produces null type fields, rather than preventing observation output.

> [!IMPORTANT]
> Message format belongs to the endpoint, not to an individual route.
> Changing it affects all routes that target that endpoint. Use separate
> endpoints if consumers need different formats, and verify the actual output
> before changing a shared endpoint.

Fabric uses a CloudEvents representation for routed messages. The CloudEvents
context identifies the event, its source, and its subject. The selected message
format determines how its data is represented. Preserve both the payload and
its associated metadata when defining Eventstream transformations and
downstream tables.

Fabric uses a CloudEvents envelope independently of the message-format choice.
Selecting Standardized doesn't enable CloudEvents on other endpoint types,
and the observation array isn't a CloudEvents batch.

See [Routing endpoint formats](iot-hub-devguide-endpoints.md) and
[Message schema at routing endpoints](iot-hub-devguide-messages-construct.md#message-schema-at-routing-endpoints).

## Plan DPS device type references

A DPS device type reference identifies the kind of device being provisioned,
such as the identifier of a Web of Things (WoT) Thing Model. In preview, you can
set the reference on either an individual enrollment or an enrollment group.
The reference appears in the ADR device record after provisioning. Devices
provisioned through an enrollment group inherit the group's device type
reference. IoT Hub uses the device context in ADR to enrich routed telemetry
for downstream interpretation.

In the DPS enrollment experience, open **Device settings** and enter the value
under **Device type reference**. In the preview ADR registry device experience,
inspect **Device type** on the device's overview.

For CLI configuration, use the same preview tooling as the MQTT v5 walkthrough.
The `azure-iot` extension version `1.1.0b1` exposes `--device-type-ref` on both
individual and group enrollment commands and uses DPS API version
`2026-11-02-preview`. The service property is `deviceTypeRefs`, an array; the CLI
option supplies one reference.

For an existing enrollment, set the reference using the applicable command:

```azurecli
az iot dps enrollment update --dps-name "<dps-name>" --resource-group "<resource-group>" --enrollment-id "<individual-enrollment-id>" --device-type-ref "urn:example:thing-model:temperature-sensor:1"

az iot dps enrollment-group update --dps-name "<dps-name>" --resource-group "<resource-group>" --enrollment-id "<enrollment-group-id>" --device-type-ref "urn:example:thing-model:temperature-sensor:1"
```

The identifier is illustrative; use a reference that your applications can
resolve to the intended device-type definition. Read the stored enrollment
value back before provisioning a device:

```azurecli
az iot dps enrollment show --dps-name "<dps-name>" --resource-group "<resource-group>" --enrollment-id "<individual-enrollment-id>" --query deviceTypeRefs

az iot dps enrollment-group show --dps-name "<dps-name>" --resource-group "<resource-group>" --enrollment-id "<enrollment-group-id>" --query deviceTypeRefs
```

Read the ADR device record's `properties.deviceTypeRefs` property to verify the
stored reference after provisioning:

```azurecli
az iot adr ns device show --namespace "<adr-namespace>" --resource-group "<resource-group>" --name "<adr-device-name>" --query properties.deviceTypeRefs
```

The device type reference supplies descriptive context. DPS continues to use
the enrollment's authentication and provisioning settings to establish the
device's identity and hub assignment.

For DPS enrollment concepts, see [Manage device enrollments](../iot-dps/how-to-manage-enrollments.md).

## Example: Prepare temperature readings for Fabric

Use the three settings together to give downstream consumers a consistent
interpretation of a temperature reading:

1. Set the DPS enrollment's device type reference to
   `urn:example:thing-model:temperature-sensor:1`, then provision the device.
1. Set the IoT Hub route's data schema reference to
   `urn:example:schema:temperature-reading:1`.
1. Select **Standardized** (`DOObservationV1`) as the Fabric routing endpoint's
   message format.
1. Publish a temperature reading that matches the route's condition.
1. In Fabric, process the observation payload together with the device context,
   route schema metadata, and CloudEvents attributes.

An analytics application can use the schema reference to interpret
`temperature` and `unit`, and the device type reference to understand the
source device. An agent can use the same context to select an appropriate
analysis or summarize readings across devices of the same type.

## Verify readiness with the receiving application

Before connecting an analytics application or agent workflow, send a sample
message and confirm the receiving application can:

- Identify the source device and its device-type context.
- Resolve the route schema reference to the intended payload contract.
- Read the original payload in the selected message format.
- Retain the relevant metadata through transformations and storage.
- Validate the reading and handle schema versions consistently.

Grant consumers the permissions required to read their data. Keep data
interpretation separate from authorization to perform resource-changing actions.

## Related content

- [IoT Hub message routing](iot-hub-devguide-messages-d2c.md)
- [Message enrichments](iot-hub-message-enrichments-overview.md)
- [ADR integration](iot-hub-device-registry-overview.md)
- [Troubleshoot with Azure MCP Server](iot-hub-troubleshoot-mcp.md)

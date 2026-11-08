---
title: Prepare IoT Hub telemetry for agents and analytics
titleSuffix: Azure IoT Hub
description: Understand message schema references, routing payload formats, and DPS device type context for downstream telemetry consumers.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: concept-article
ms.date: 11/07/2026
---

# Prepare IoT Hub telemetry for agents and analytics

An application or agent needs more than a stream of values to interpret device
telemetry. It needs to understand the source device, the meaning and version of
the payload, and how the destination packages that payload.

IoT Hub message schema and message payload format capabilities are in preview.
They are separate from generally available ADR linking and the Fabric Eventstream
routing endpoint. They don't grant a consumer access to data or automatically
validate its meaning.

## Separate the three kinds of context

| Concept | Where it belongs | Purpose |
| --- | --- | --- |
| Device type reference | DPS provisioning and device-type configuration | Associates device-type context with the provisioning scenario. It isn't the schema of every telemetry message. |
| Data schema reference | IoT Hub route | Identifies the contract a consumer uses to interpret the original message payload. |
| Message payload format | IoT Hub routing endpoint | Selects preservation of the device payload or its standardized observation representation. |

Treat these as explicit configuration choices, not interchangeable labels.
A device can emit multiple message shapes, and a route can serve many devices.
Version the relevant contracts and verify the actual context delivered to consumers.

## Associate messages with a schema

The route's **Data schema reference** maps to `dataSchema` in ARM and
`--data-schema-ref` in the Azure IoT CLI. It describes the original payload, not
the standardized observation wrapper or the destination transport envelope.

For example, `fabrikam/TemperatureReading:1` can identify a schema owned by your
application. This is an illustrative reference, not a schema resource created by
this article. Ensure that the intended consumers can resolve the reference to
the appropriate contract and version.

Setting a reference doesn't validate the body against a schema, coerce types,
rename properties, or discard messages that violate the contract. Implement
validation in the producer or a downstream processing stage as appropriate.

Don't assume the route's `dataSchema` property name is copied literally to the
destination. For example, the corresponding CloudEvents context attribute is
`dataschema`. Inspect the destination's representation.

## Select the endpoint's message format

The endpoint's **Message format** maps to `messagePayloadFormat` in ARM and
`--message-format` in the Azure IoT CLI.

| Selection | API value | Payload behavior |
| --- | --- | --- |
| Device format | `None` | Preserves the original device payload; destination-specific encoding, envelopes and batching still apply. |
| Standardized | `DOObservationV1` | Wraps the original JSON value in the Digital Operations observation v1 format, identified by `com.do.telemetry.observation.v1`. |

The standardized format requires a valid UTF-8 body containing one JSON value.
It doesn't make an invalid or arbitrary binary payload valid JSON.

For example, the device might publish:

```json
{
  "testId": "temperature-test-001",
  "temperature": 21.5,
  "unit": "C"
}
```

In device format, the consumer reads the original payload according to the
destination's encoding and envelope. For the standardized observation format,
locate the original value under the observation's `payload.value`; don't assume
that `temperature` remains a top-level field.

For Fabric, account for the CloudEvents representation and the selected body
format. A transport envelope and a payload format are different layers. Use a
fresh test message to inspect the full result in the receiving application.

See [Routing endpoint formats](iot-hub-devguide-endpoints.md) and
[Message schema at routing endpoints](iot-hub-devguide-messages-construct.md#message-schema-at-routing-endpoints).

## Plan DPS device type references

A DPS device type reference provides device-type context for provisioning. Keep
it distinct from the device's onboarding credential, its assigned hub identity,
and a route's telemetry schema reference.

When designing the flow:

1. Define the device type and the message contracts expected from that type.
1. Use the supported DPS configuration for the type reference.
1. Verify the resulting device context after provisioning; don't assume that
   adding a reference also changes existing device records or credentials.
1. Verify which identity/type fields the destination receives and how the consumer
   resolves them. Don't assume every DPS field is copied into every message.
1. Plan compatibility when the device type or message schema changes.

<!-- REVIEW BLOCKER: Confirm the DPS device-type reference field name, supported
enrollment scopes, API/CLI version, release status and ADR/routed-message mapping.
Add a tested configuration/readback example before publication. -->

For DPS enrollment concepts, see [Manage device enrollments](../iot-dps/how-to-manage-enrollments.md).
This guidance doesn't change the existing DPS authentication, certificate
issuance, or renewal flows for any hub connection profile.

## Verify readiness with the receiving application

Before using telemetry in analytics or an agent workflow:

- Send a message with a unique test identifier.
- Verify destination receipt, not just a successful publish.
- Confirm the source identity and available device-type context.
- Resolve the schema reference and validate the original payload against that
  contract in the consumer or validation stage.
- Confirm the selected format and the path to the original payload.
- Test incompatible versions, malformed messages and missing metadata.
- Give the consumer only the data permissions it needs.

Treat message bodies and metadata as untrusted input. Schema context doesn't
authorize an agent to act on instructions contained in device data. Keep
data interpretation separate from permission to perform resource-changing actions.

## Related content

- [IoT Hub message routing](iot-hub-devguide-messages-d2c.md)
- [Message enrichments](iot-hub-message-enrichments-overview.md)
- [ADR integration](iot-hub-device-registry-overview.md)
- [Troubleshoot with Azure MCP Server](iot-hub-troubleshoot-mcp.md)

---
title: Route telemetry from Azure IoT Hub with the MQTT v5 connection profile
titleSuffix: Azure IoT Hub
description: Configure routing endpoints, routes, schema references, message formats, and enrichments for MQTT v5 telemetry, with a Microsoft Fabric eventstream example.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 10/26/2026
---

# Route telemetry from Azure IoT Hub with the MQTT v5 connection profile

Configure routing before devices start sending data. A routing endpoint
identifies a downstream destination. A route selects a message source, applies
a query, and sends matching messages to the endpoint. Message enrichments add
application properties to messages delivered to selected endpoints.

This article explains how to choose a destination, configure an endpoint and
its message format, create a route with an optional data schema reference,
and add enrichments. The worked example uses Microsoft Fabric eventstreams
to demonstrate the complete sequence and selective routing. The routing
concepts apply to all supported destinations; Fabric isn't required.

For an initial delivery test, create
an all-messages route that sends all incoming device telemetry to a destination
you configure. Select device telemetry as the message source, set the routing
query to `true`, and enable the route. This route selects all device telemetry,
including messages that also match selective routes. It isn't a fallback
route. You must create it explicitly; IoT Hub doesn't configure it automatically.
After testing, retain it only if your application needs an all-messages path.

> [!IMPORTANT]
> Fallback routing is disabled for preview. Messages that don't match
> an enabled route aren't delivered to your configured destinations. Don't
> treat a successful device publish as evidence of downstream delivery.

## Prerequisites

- Complete [hub setup](mqtt-v5-cloud-setup.md).
- Permission to configure IoT Hub routing and destination access, including
  role assignments when you use managed identity authentication.
- A receiving resource for your chosen destination and separate access to
  read the delivered messages.
- For the Fabric example only, a workspace on Fabric capacity or a trial, with **Member** or
  higher workspace permissions to configure identity access and create an
  eventstream. A tenant administrator might need to enable service-principal
  access for your organization's permitted identities.
- For the custom-topic examples, complete
  [custom topic group configuration](mqtt-v5-custom-topics.md). Use the two
  templates `fleet/vehicles/{deviceId}/telemetry` and
  `fleet/vehicles/{deviceId}/faults`, or a template such as
  `fleet/vehicles/{deviceId}/#` that covers both. Update an existing group
  rather than creating another. Standard SDK telemetry doesn't require a
  custom topic group.
- For CLI commands, complete the
  [preview CLI setup](mqtt-v5-cloud-setup.md?tabs=cli#create-azure-iot-hub-with-the-mqtt-v5-connection-profile) and use the active
  subscription from hub setup.

## Supported routing destinations

Azure IoT Hub with the MQTT v5 connection profile supports the following
downstream destinations. Their authentication, message-format, and networking
requirements are the same as for the classic connection profile.

Create or identify the receiving resource before adding its routing endpoint
to IoT Hub. Each endpoint needs a unique name, the destination's connection
details, and authorization for IoT Hub to write to that destination.

| Destination | Resources and endpoint settings | Access required for IoT Hub | Consumption and format considerations |
| --- | --- | --- | --- |
| Microsoft Fabric eventstreams | A Fabric workspace on Fabric capacity or a trial, and a published eventstream with a custom endpoint (custom app) source. Obtain its connection details using the **Event Hub** protocol and **Entra ID Authentication**. | Microsoft Entra ID authentication through the hub's system-assigned or user-assigned managed identity. Authorize that identity in the Fabric workspace with **Contributor** or higher access and satisfy the Fabric tenant settings for service-principal access. SAS key authentication isn't supported for this routing endpoint. | Messages use a CloudEvents envelope. Configure the routing endpoint through Azure CLI or ARM, and use the eventstream's data preview to verify ingestion. |
| Azure Event Hubs | An Event Hubs namespace and an event hub. Configure the namespace and event hub name, or an entity-specific connection string. | A shared access policy with **Send** permission, or a managed identity with **Azure Event Hubs Data Sender**. | Prepare a consumer group and a reader with receive access. Messages are written without base64 encoding by IoT Hub. |
| Azure Storage (blob containers) | A storage account and blob container. Choose Avro or JSON output, batching settings, and the blob file-name format. | A storage account key, or a managed identity with **Storage Blob Data Contributor**. | Give the reader separate blob read access. Avro is the default output format; account for batching before checking for new blobs. |
| Azure Service Bus queues | A Service Bus namespace and queue. Configure the namespace and queue name, or the queue's connection string. | A shared access policy with **Send** permission, or a managed identity with **Azure Service Bus Data Sender**. | Disable sessions and duplicate detection. Prepare a queue receiver with receive access. |
| Azure Service Bus topics | A Service Bus namespace and topic. Configure the namespace and topic name, or the topic's connection string. | A shared access policy with **Send** permission, or a managed identity with **Azure Service Bus Data Sender**. | Disable duplicate detection and use receiving subscriptions without sessions. Create a subscription and give its receiver receive access; consumers read from the subscription, not directly from the topic. |
| Azure Cosmos DB | An Azure Cosmos DB for NoSQL account, database, and container. Configure the container and partition-key settings. | An account key, or a system-assigned managed identity with **Cosmos DB Built-in Data Contributor**, assigned through Cosmos DB data-plane role management. | Prepare a reader with data access. JSON handling depends on message system properties; otherwise, the payload is base64 encoded. Align partition-key configuration with the target container. |

These authentication choices apply to hub-to-destination delivery, not device
authentication. Grant consumers their own read permissions; an endpoint's
sending credentials aren't reader credentials.

For JSON output to Storage or Cosmos DB, set the message system properties
`contentType` to `application/json` and `contentEncoding` to `UTF-8`.
For destination formats, partitioning, and restrictions, see
[IoT Hub routing endpoint requirements](iot-hub-devguide-endpoints.md#custom-endpoints-for-message-routing).
For identity roles and network-restricted destinations, see
[Configure message routing with managed identities](iot-hub-managed-identity.md#configure-message-routing-with-managed-identities).
Network access must be configured separately from role assignments.

## Built-in endpoint not supported

Unlike the classic connection profile, this profile doesn't provide a built-in
routing endpoint. You can't receive telemetry through the hub's built-in
Event Hubs-compatible endpoint or use a Fabric IoT Hub source that relies on
it. Configure a route to one of the supported destinations instead.

## Understand schema references, message formats, and enrichments

These settings serve different purposes:

| Setting | Scope | Purpose |
| --- | --- | --- |
| **Data schema reference** | Route | Identifies the schema a consumer can use to interpret the original message payload. Maps to `dataSchema` in ARM and `--data-schema-ref` in the CLI. |
| **Message format** | Endpoint | Chooses whether to preserve the device payload or wrap it in the standardized observation format. Maps to `messagePayloadFormat` in ARM and `--message-format` in the CLI. |
| Message enrichment | One or more selected endpoints | Adds an application property, such as a fleet identifier, without requiring the device to send it. |

### Data schema reference on a route

The **Data schema reference** is optional. For example, `fabrikam/FleetMessage:1`
can identify version 1 of a schema managed by your application. This example
is an illustrative reference, not a schema created by this walkthrough.
Use your own reference and ensure that downstream consumers can resolve it.
Leave the field unset if you don't have a schema reference.

In this preview, IoT Hub stores the reference as a string. Saving a route
doesn't validate the reference against a registry, and routing doesn't
dereference it or validate each payload against the schema. The reference
doesn't change the routing query or transform the payload. Route-query testing
isn't schema validation or a test of the delivered message format.

Use a reference that describes every message selected by the route. If
telemetry and fault messages use different schemas, use separate routes with
appropriate conditions and references rather than assigning one schema to an
all-messages route.

A data schema reference describes the original payload, not the standardized
observation wrapper. For destinations that emit CloudEvents, the corresponding
envelope attribute is `dataschema`. Don't assume that every destination emits
CloudEvents or exposes that attribute in the same way.

### Message format on an endpoint

The message-format setting applies to Event Hubs, Storage, Service Bus queues
and topics, Cosmos DB, and Fabric eventstream routing endpoints.

| Message format | API and CLI value | Body behavior |
| --- | --- | --- |
| Device format | `None` | Preserves the original device payload. Destination-specific encoding, batching, and envelopes still apply. |
| Standardized | `DOObservationV1` | Wraps the original JSON value in the Digital Operations observation v1 format, identified by `com.do.telemetry.observation.v1`. |

The standardized format requires a valid UTF-8 body containing one JSON
value. For example, a device sends:

```json
{"temperature": 22.5}
```

With **Device format**, the message body retains that payload. With
**Standardized**, the body is a JSON array containing one observation.
The following excerpt shows only the schema identifier and original value;
the complete observation also includes identity, time, and other metadata:

```json
[
  {
    "schema_id": "com.do.telemetry.observation.v1",
    "payload": {
      "value": {"temperature": 22.5}
    }
  }
]
```

Standardized output doesn't rename fields, convert units, flatten objects,
or normalize the inner payload against your schema. Where configured, the
device's ADR device type reference supplies its semantic type; a route's
data schema reference doesn't assign a device type. A missing device type
reference produces null type fields, rather than preventing observation output.

> [!IMPORTANT]
> Message format belongs to the endpoint, not to an individual route.
> Changing it affects all routes that target that endpoint. Use separate
> endpoints if consumers need different formats, and verify the actual output
> before changing a shared endpoint.

Fabric eventstream endpoints use a CloudEvents envelope independently of the
message-format choice. Standardized output becomes the data inside that
envelope; selecting Standardized doesn't enable CloudEvents on other endpoint
types. The observation array isn't a CloudEvents batch.

### Enrichments for downstream context

An enrichment adds a key/value application property to messages going to its
selected endpoints. Values can be static strings, the hub name through
`$iothubname`, or supported primitive device twin values such as
`$twin.tags.location`. For the complete rules and limitations, see
[Message enrichments](iot-hub-message-enrichments-overview.md).

For Fabric eventstream endpoints, enrichment names must start with a lowercase
letter, contain only lowercase letters and digits, and be at most 20 characters.
Camel case, hyphens, underscores, and periods aren't allowed. See
[Fabric enrichment property restrictions](iot-hub-devguide-endpoints.md#enrichment-property-restrictions).

Enrichments apply to all messages sent to the selected endpoint, not just
one route. They aren't JSON field transformations or device access-control
rules. Use the original message's properties in routing conditions; don't
depend on an enrichment added for delivery to select the route.

## Plan the endpoint, route, and enrichment sequence

Use the same sequence for any supported destination:

1. Prepare the receiving resource and grant IoT Hub permission to send to it.
   Configure separate reader access and any required network access.
1. Create or select an IoT Hub routing endpoint. Configure its connection,
   authentication, and **Message format**.
1. Create an enabled route targeting that endpoint. Choose the data source,
   routing query, and optional **Data schema reference**.
1. Add enrichments to the endpoints that need the additional context.
1. Read back the saved configuration, publish a test message, and verify
   receipt, body format, and metadata at the destination.

For destination types supported in the Azure portal's **Message routing**
creation flow, **Add** takes you through **Endpoint**, **Route**, and
**Enrichments**. See [Create routes and endpoints in the Azure portal](how-to-routing-portal.md).
The Fabric endpoint in this walkthrough uses CLI or ARM instead.

## Worked example: Route fleet messages to Fabric eventstreams

The following example uses **Device format**, an all-messages route, and a
static `fleetregion` enrichment. It then adds a separate route for critical
faults. The Fabric workspace, eventstream source, and workspace permissions
are destination-specific. The endpoint, route, schema-reference, message-format,
and enrichment concepts apply to the other supported destinations too.

## Prepare the Fabric eventstream

The example uses an eventstream named `fleet-telemetry` and a custom endpoint
source named `iot-hub-input`. The IoT Hub routing endpoint is named
`vehicle-telemetry`; this is a separate name, not the Fabric source's entity path.

1. In the Fabric portal, open your workspace. Create an **Eventstream** item
   named `fleet-telemetry`, or open an existing eventstream you are authorized
   to configure.
1. In the eventstream editor, select **Add source** > **Custom endpoint**.
   Name the source `iot-hub-input`, add it, and select **Publish**.
   See [Add a custom endpoint source](/fabric/real-time-intelligence/event-streams/add-source-custom-app).
1. Select the published custom endpoint source. In its **Details** pane,
   select the **Event Hub** protocol and **Entra ID Authentication**.
   Record the connection details and identifiers below. Use the actual values,
   not the display names of the workspace, eventstream, or source.

   | Placeholder | Value to record |
   | --- | --- |
   | `<FABRIC_ENDPOINT_URI>` | The source's namespace endpoint URI, including `sb://`. |
   | `<FABRIC_ENTITY_PATH>` | The event hub entity path exposed by the custom endpoint source. |
   | `<FABRIC_WORKSPACE_ID>` | The Fabric workspace GUID. |
   | `<FABRIC_EVENTSTREAM_ID>` | The eventstream item GUID. |
   | `<FABRIC_SOURCE_ID>` | The custom endpoint source GUID within that eventstream. |

   Selecting the Event Hub protocol doesn't require you to create a separate
   Azure Event Hubs namespace. Fabric supplies the endpoint connection details.
   Don't use the source's SAS keys for this IoT Hub routing endpoint.

### Grant the hub access to Fabric

Use the hub's system-assigned managed identity enabled during hub setup:

1. Read its principal and tenant IDs:

   ```azurecli
   az iot hub show --name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --query "{principalId:identity.principalId,tenantId:identity.tenantId}" --output json
   ```

   Confirm that both values are present. If the identity is missing, resolve the
   managed identity configuration in [hub setup](mqtt-v5-cloud-setup.md)
   before proceeding.
1. Have your Fabric tenant administrator enable the applicable service-principal
   access settings for this identity according to your organization's policy.
   See [Fabric Microsoft Entra ID access requirements](/fabric/real-time-intelligence/event-streams/custom-endpoint-entra-id-auth).
1. In the Fabric workspace, select **Manage access**. Add the hub's managed
   identity with the **Contributor** role, verifying its principal ID.
   This is a Fabric workspace permission, not an Azure subscription role
   assignment. You don't need to create an application secret.
1. Allow permissions to propagate before creating the routing endpoint.
   Confirm that your own account can open the eventstream and view incoming
   data. That reader access is separate from the hub's permission to send.

Network restrictions must also allow the hub to reach the Fabric endpoint.
Don't change device credentials to fix a hub-to-Fabric authorization failure.

## Configure the Fabric endpoint and route

Create the Fabric resource in the Fabric portal. Choose Azure CLI or ARM
REST to register its routing endpoint on IoT Hub and create the route.
Both alternatives use the same Fabric connection details and managed identity.
They configure the endpoint first, then the route and enrichment. Choose one
alternative rather than creating the same configuration twice.

To select standardized output instead, use `--message-format DOObservationV1`
in the CLI or `"messagePayloadFormat": "DOObservationV1"` on the ARM endpoint.
Choose it only for a consumer that understands the observation format.
Don't recreate an existing endpoint just to change its format; review all
routes that share it before applying an intentional configuration update.

### [Azure CLI](#tab/cli)

Run each command separately and resolve errors before continuing.

1. Confirm that your IoT extension exposes the Fabric endpoint command:

   ```azurecli
   az iot hub message-endpoint create fabric-eventstream --help
   ```

   If the command isn't available, use the supported preview CLI configuration
   from hub setup or the ARM REST alternative. Don't substitute an Event Hubs
   endpoint type for the Fabric endpoint.

1. Inspect the existing endpoints, routes, and enrichments before adding new names:

   ```azurecli
   az iot hub message-endpoint list --hub-name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --output json
   ```

   ```azurecli
   az iot hub message-route list --hub-name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --output json
   ```

   ```azurecli
   az iot hub message-enrichment list --name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --output json
   ```

   If `vehicle-telemetry` or `all-device-telemetry` already exists, verify its
   configuration instead of blindly recreating or replacing it. Use different
   names if an existing endpoint or route serves another purpose.

1. Register the Fabric endpoint by using the hub's system-assigned identity
   and **Device format**:

   ```azurecli
   az iot hub message-endpoint create fabric-eventstream --hub-name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --endpoint-name vehicle-telemetry --endpoint-uri "<FABRIC_ENDPOINT_URI>" --entity-path "<FABRIC_ENTITY_PATH>" --identity "[system]" --workspace-id "<FABRIC_WORKSPACE_ID>" --eventstream-id "<FABRIC_EVENTSTREAM_ID>" --source-id "<FABRIC_SOURCE_ID>" --message-format None --output none
   ```

   This command configures IoT Hub; it doesn't create the Fabric source or
   grant workspace access. No connection string or SAS key is required.

1. Verify that the endpoint is present, and then create an enabled all-messages
   route with condition `true`:

   ```azurecli
   az iot hub message-endpoint list --hub-name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --query "eventStreams[].{name:name,endpointUri:endpointUri,entityPath:entityPath,authenticationType:authenticationType,messagePayloadFormat:messagePayloadFormat,workspaceId:workspaceId,eventStreamId:eventStreamId,sourceId:sourceId}" --output json
   ```

   ```azurecli
   az iot hub message-route create --hub-name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --route-name all-device-telemetry --endpoint-name vehicle-telemetry --source-type devicemessages --condition true --enabled true --output none
   ```

   Add `--data-schema-ref "<DATA_SCHEMA_REFERENCE>"` only if you have a
   reference that describes all messages selected by this route, such as
   your own `fabrikam/FleetMessage:1` schema reference. Omit the option if
   you don't have a reference; don't send the placeholder as a value.

1. Add endpoint-specific context:

   ```azurecli
   az iot hub message-enrichment create --name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --key fleetregion --value west --endpoints vehicle-telemetry --output none
   ```

   Check existing enrichment keys first. To apply an existing enrichment to
   another endpoint, update its target list while retaining its current targets.

1. Inspect the route and hub state:

   ```azurecli
   az iot hub message-route list --hub-name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --query "[].{name:name,condition:condition,enabled:isEnabled,endpoints:endpointNames,dataSchema:dataSchema}" --output json
   ```

   ```azurecli
   az iot hub show --name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --query "{state:properties.state,provisioningState:properties.provisioningState}" --output json
   ```

   Confirm that `all-device-telemetry` is enabled, has condition `true`, and
   targets `vehicle-telemetry`. Check the endpoint's `messagePayloadFormat`
   and the route's `dataSchema` if supplied. Wait for `Active` and `Succeeded`
   before publishing.

   ```azurecli
   az iot hub message-enrichment list --name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --output json
   ```

   Verify that `fleetregion` has value `west` and targets `vehicle-telemetry`.

1. When ready to test the route, follow
   [Publish a custom-topic test message with .NET](mqtt-v5-device-setup.md#publish-a-custom-topic-test-message-with-net)
   and [Verify actual delivery in Fabric](mqtt-v5-device-setup.md#verify-actual-delivery-in-fabric).
   Resource configuration alone doesn't prove delivery.

### [ARM REST](#tab/arm)

First, complete [Prepare the Fabric eventstream](#prepare-the-fabric-eventstream)
and [Grant the hub access to Fabric](#grant-the-hub-access-to-fabric).
The following update configures IoT Hub, not the Fabric resources.

1. Start the
   [ARM configuration update procedure](#apply-configuration-changes-to-your-mqtt-v5-hub-through-arm-rest)
   by reading the current hub with API version `2026-10-01-preview`.
   In the complete resource body, add the endpoint to
   `properties.routing.endpoints.eventStreams` and the route to
   `properties.routing.routes`.

   The following fragment illustrates the new entries. It isn't a replacement for
   the existing routing configuration or a complete PUT body:

   ```json
   {
     "routing": {
       "endpoints": {
         "eventStreams": [
           {
             "name": "vehicle-telemetry",
             "authenticationType": "identityBased",
             "messagePayloadFormat": "None",
             "endpointUri": "<FABRIC_ENDPOINT_URI>",
             "entityPath": "<FABRIC_ENTITY_PATH>",
             "workspaceId": "<FABRIC_WORKSPACE_ID>",
             "eventStreamId": "<FABRIC_EVENTSTREAM_ID>",
             "sourceId": "<FABRIC_SOURCE_ID>"
           }
         ]
       },
       "routes": [
         {
           "name": "all-device-telemetry",
           "source": "DeviceMessages",
           "condition": "true",
           "endpointNames": ["vehicle-telemetry"],
           "isEnabled": true
         }
       ],
       "enrichments": [
         {
         "key": "fleetregion",
         "value": "west",
         "endpointNames": ["vehicle-telemetry"]
         }
       ]
     }
   }
   ```

   If you don't specify an endpoint-level user-assigned identity, the endpoint
   uses the hub's system-assigned identity. Preserve that hub identity.
   Add `dataSchema` to the route only if you have a reference that describes
   its messages. `messagePayloadFormat` belongs to the endpoint.
   Preserve every existing endpoint, route, and enrichment that you aren't intentionally
   changing. If these names already exist, review those entries rather than
   adding duplicates. Keep `mqttV5Settings` and other hub properties intact.
   Restore any omitted or redacted endpoint credentials before the PUT.

1. Submit the complete resource with its original ETag in `If-Match`, as
   described in the shared procedure. Wait for `Active` and `Succeeded`.

1. Read back the route configuration without displaying connection strings:

   ```azurecli
   az rest --method get --uri "https://management.azure.com<HUB_RESOURCE_ID>?api-version=2026-10-01-preview" --query "{endpoints:properties.routing.endpoints.eventStreams,routes:properties.routing.routes,enrichments:properties.routing.enrichments}" --output json
   ```

   Confirm that `all-device-telemetry` is enabled, uses source `DeviceMessages`
   and condition `true`, and targets `vehicle-telemetry`. Verify the endpoint's
   Fabric identifiers, connection details, and `identityBased` authentication.
   Check the message format, optional schema reference, and `fleetregion`
   enrichment. Inspect actual received metadata as well as the CloudEvents
   data body when testing delivery.

1. When ready to test the route, follow
   [Publish a custom-topic test message with .NET](mqtt-v5-device-setup.md#publish-a-custom-topic-test-message-with-net)
   and [Verify actual delivery in Fabric](mqtt-v5-device-setup.md#verify-actual-delivery-in-fabric).
   An accepted management request isn't proof that telemetry arrived.

---

## Verify the Fabric message format and enrichment

Follow [Verify actual delivery in Fabric](mqtt-v5-device-setup.md#verify-actual-delivery-in-fabric)
to locate a message by its test identifier. Inspect the CloudEvents envelope
and its data, rather than treating a saved route or accepted publish as proof
of delivery.

- With **Device format**, verify the original device payload inside the
  CloudEvents data.
- For a separate **Standardized** test, inspect the observation array in the
  CloudEvents data and the original JSON value under `payload.value`.
- Check the delivered metadata for `fleetregion = west`. Don't assume the
  enrichment becomes a field in the original payload or observation body.
- If you configured a route schema reference, inspect `dataschema` and confirm
  that the consumer uses it to interpret the original payload, not the
  observation wrapper.

For another destination, use its receiver or inspection tools to check the
same delivery, format, and enrichment requirements. Don't assume its
transport envelope is the same as Fabric's.

## Filter by MQTT topic and user properties

Consider a fleet-monitoring application in which vehicles publish routine
telemetry to `fleet/vehicles/<deviceId>/telemetry` and fault reports to
`fleet/vehicles/<deviceId>/faults`. Fault reports include a `severity` MQTT v5
user property, such as `warning` or `critical`. You want to retain all messages
in the `fleet-telemetry` eventstream for analysis, while also sending only
critical faults to a separate `fleet-critical-faults` eventstream for
operational monitoring.

The topic identifies the message category, and the user property identifies
its severity. Combining both filters selects critical faults across the fleet
without including warning-level faults or routine telemetry. Keep the
all-messages route so that messages excluded from the selective route still
reach the main eventstream.

After [verifying the all-messages delivery path](mqtt-v5-device-setup.md#verify-actual-delivery-in-fabric),
add routes for subsets of telemetry.
MQTT v5 custom topics and user properties provide two different inputs for
routing. These filters also work with the other supported destinations:

| Filter input | Routing condition | What it matches |
| --- | --- | --- |
| MQTT publish topic | `topic_matches('fleet/vehicles/+/faults')` | Fault topics for any one device-ID topic level. |
| MQTT v5 user property | `severity = 'critical'` | Messages whose `severity` user property has the string value `critical`. |
| Both | `topic_matches('fleet/vehicles/+/faults') AND severity = 'critical'` | Only critical fault messages. |

`topic_matches(...)` matches the publish topic, not user properties. MQTT v5
user properties are exposed as application properties in routing queries:
reference their names directly, without a `$` prefix. For example,
`severity = 'critical'` doesn't inspect `$body.severity` or a Fabric
CloudEvents field. IoT Hub evaluates the condition before delivery to Fabric.
Use unique property names and avoid duplicate keys.

Topic filters use MQTT wildcards, not template variables. Use `+` to match
one device-ID level; don't put `{deviceId}` in a routing filter. Body-based
queries are a separate option and require an interpretable payload format and
content metadata. See [Routing query syntax](iot-hub-devguide-routing-query-syntax.md#message-properties-query-expressions).

Test positive and negative cases for each filter. A rule that selects no
messages can be syntactically valid but still fail the business requirement.

### Create a separate filtered delivery path

Keep the all-messages route. To observe selective delivery independently,
create another Fabric eventstream named `fleet-critical-faults` in the same
workspace, with a published custom endpoint source named `critical-fault-input`.
Repeat [Prepare the Fabric eventstream](#prepare-the-fabric-eventstream) for
this second eventstream. The hub's existing workspace access applies to both.
Use this new source's connection details and GUIDs, not those of `fleet-telemetry`.

Register a second IoT Hub endpoint named `critical-faults`:

```azurecli
az iot hub message-endpoint create fabric-eventstream --hub-name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --endpoint-name critical-faults --endpoint-uri "<FILTERED_FABRIC_ENDPOINT_URI>" --entity-path "<FILTERED_FABRIC_ENTITY_PATH>" --identity "[system]" --workspace-id "<FABRIC_WORKSPACE_ID>" --eventstream-id "<FILTERED_FABRIC_EVENTSTREAM_ID>" --source-id "<FILTERED_FABRIC_SOURCE_ID>" --message-format None --output none
```

Check that these endpoint and route names aren't already in use before
creating them. In **PowerShell on Windows**, create the selective route using
the following quoting so that the Azure CLI command wrapper preserves the
parentheses and string literals:

```powershell
az iot hub message-route create --hub-name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --route-name vehicle-critical-faults --endpoint-name critical-faults --source-type devicemessages --condition '"topic_matches(''fleet/vehicles/+/faults'') AND severity = ''critical''"' --enabled true --output none
```

Check the condition stored by the service:

```azurecli
az iot hub message-route show --hub-name "<HUB_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --route-name vehicle-critical-faults --query "{condition:condition,enabled:isEnabled,endpoints:endpointNames}" --output json
```

Confirm that the stored condition is
`topic_matches('fleet/vehicles/+/faults') AND severity = 'critical'`, the route
is enabled, and its endpoint is `critical-faults`. Repeat the hub-state check
from the configuration steps and wait for `Active` and `Succeeded`.

For ARM updates, set the selected route's JSON `condition` to
`"topic_matches('fleet/vehicles/+/faults') AND severity = 'critical'"` and its
`endpointNames` to `["critical-faults"]` in the complete resource body. Add the
second endpoint under `eventStreams` using its own Fabric details, following
the first endpoint's shape. Keep the all-messages route and other settings,
then use the same guarded PUT and read-back procedure. A JSON file doesn't
need the additional PowerShell command-line escaping in the CLI example.

### Expected filter behavior

When both routes are enabled and destinations are healthy, the combined condition
produces the following expected results:

| Category | Severity user property | `fleet-telemetry` all-messages path | `fleet-critical-faults` selective path |
| --- | --- | --- | --- |
| `faults` | `critical` | Delivered | Delivered |
| `faults` | `warning` | Delivered | Not selected |
| `telemetry` | `critical` | Delivered | Not selected |
| `telemetry` | `warning` | Delivered | Not selected |
| `faults` | Absent | Delivered | Not selected |

To publish these cases and compare actual receipt, see
[Verify the selective route](mqtt-v5-device-setup.md#verify-the-selective-route).

If you retain the all-messages route, a message excluded by a selective route
can still be delivered through the all-messages route. This delivery path isn't fallback.
Don't assume that multiple routes or device retries provide end-to-end
exactly-once processing; make downstream processing safe for duplicate inputs.

## Diagnose missing messages

Check in order:

1. Was the device assigned to the intended hub?
1. Was the publish accepted, and was the topic permitted?
1. Is the route enabled and configured for the correct source?
1. Does the query match the message?
1. Can IoT Hub authenticate to and reach the destination?
1. Is the consumer reading the correct resource, entity, and time window?
1. Does the consumer understand the delivered payload or envelope?
1. Is the endpoint's message format appropriate for that consumer, and does
   a Standardized input contain valid UTF-8 JSON?
1. Are enrichments configured for the endpoint that actually received the
   message, and is the consumer checking application properties?

Don't solve a destination authorization failure by changing the device's
authentication method. The device-to-hub and hub-to-destination connections
have separate credentials and permissions.

## Apply configuration changes to your MQTT v5 hub through ARM REST

Use this advanced reference when applying the [routing ARM example](?tabs=arm#configure-the-fabric-endpoint-and-route)
or [custom topic group ARM example](mqtt-v5-custom-topics.md?tabs=arm#configure-a-custom-topic-group) to an
existing MQTT v5 hub. Sign in with `az login` first. This procedure updates
configuration; it doesn't change the hub's connection profile.

> [!IMPORTANT]
> An IoT Hub `PUT` replaces the resource configuration. Don't submit a partial
> fragment or redeploy a creation-only template. Preserve identities,
> associations, routes, endpoints, enrichments, custom topic groups, and
> unrelated settings. Use an API version that represents all configured features.

1. Read the resource with the API version you'll use for the update.
   `<HUB_RESOURCE_ID>` is the full resource ID, beginning with `/subscriptions/`.

   ```azurecli
   az rest --method get --uri "https://management.azure.com<HUB_RESOURCE_ID>?api-version=2026-10-01-preview" --output-file "hub-update.json"
   ```

1. Edit only the settings you intend to change in `hub-update.json`, locating existing
   entries by name. Restore any omitted or redacted endpoint credentials from
   secure configuration; never submit masked values or placeholders. Keep
   this sensitive file out of source control.

1. Put the original GET's ETag in `hub-update.headers.json`:

   ```json
   {
     "Content-Type": "application/json",
     "If-Match": "\"<ETAG_VALUE>\""
   }
   ```

   This example adds HTTP quotation marks to an unquoted ETag. If the returned
   ETag is already quoted, preserve those quotes once. Don't use `*`.

1. Submit the complete resource with the conditional header:

   ```azurecli
   az rest --method put --uri "https://management.azure.com<HUB_RESOURCE_ID>?api-version=2026-10-01-preview" --headers "@hub-update.headers.json" --body "@hub-update.json" --output none
   ```

   On HTTP `412`, read the latest resource and reapply your change. Don't
   update only the ETag on an old body or retry without the condition.
   Resolve other errors before continuing.

1. Wait for completion and inspect the state:

   ```azurecli
   az resource wait --ids "<HUB_RESOURCE_ID>" --api-version "2026-10-01-preview" --created --interval 15 --timeout 1800
   ```

   ```azurecli
   az rest --method get --uri "https://management.azure.com<HUB_RESOURCE_ID>?api-version=2026-10-01-preview" --query "{state:properties.state,provisioningState:properties.provisioningState}" --output json
   ```

   Confirm `Succeeded` and `Active`, then read back the changed settings and
   verify that unrelated configuration is retained. Remove sensitive request
   files when no longer needed. A successful update doesn't replace a device
   publishing and destination-receipt test.

## Clean up test resources

If you created resources only for this walkthrough, remove their enrichment
associations, test routes, and IoT Hub endpoints before deleting the receiving
event hubs, Fabric eventstreams, or other destination resources. Retain any
enrichment targets still in use. Don't delete a shared namespace, workspace,
hub, custom topic group, or endpoint used by other workloads. Remove destination
role assignments or Fabric workspace access only if no remaining routing
endpoint needs them.

## Next steps

- [Configure a device and publish messages](mqtt-v5-device-setup.md).
- [Publish a custom-topic test message with .NET](mqtt-v5-device-setup.md#publish-a-custom-topic-test-message-with-net).
- [Verify actual delivery in Fabric](mqtt-v5-device-setup.md#verify-actual-delivery-in-fabric).
- [Monitor and troubleshoot the pipeline](mqtt-v5-monitor-troubleshoot.md).

---
title: Azure IoT Operations MCP tools overview (preview)
description: Explore the built-in MCP tools for documentation, resources, Edge Registry, MQTT messages, State Store values, and broker metadata.
author: jgoldberg1
ms.author: jegoldberg
ms.service: azure-iot-operations
ms.topic: overview
ms.date: 11/17/2026
ai-usage: ai-assisted
---

# Azure IoT Operations MCP tools overview (preview)

Azure IoT Operations MCP provides tools to read documentation, inspect deployed resources, retrieve schemas, sample MQTT messages, read State Store values, and publish MQTT messages. This article describes the built-in tools, their arguments, results, and limitations.

> [!IMPORTANT]
> MCP in Azure IoT Operations is in preview. Use a nonproduction environment to evaluate the preview and these examples. Publishing MQTT messages can trigger downstream actions.

## Tool index

| Category | Tools |
| --- | --- |
| Documentation | [documentation_overview](#documentation_overview), [documentation](#documentation) |
| Assets | [list_assets](#list_assets), [get_asset](#get_asset), [asset_details](#asset_details) |
| Devices | [list_devices](#list_devices), [get_device](#get_device), [device_details](#device_details) |
| Brokers | [list_brokers](#list_brokers), [get_broker](#get_broker), [broker_details](#broker_details), [broker_metadata](#broker_metadata) |
| Connectors | [list_connectors](#list_connectors), [get_connector](#get_connector), [connector_details](#connector_details), [find_connector_by_device](#find_connector_by_device) |
| Data flows | [list_dataflows](#list_dataflows), [get_dataflow](#get_dataflow), [dataflow_details](#dataflow_details) |
| Data flow graphs | [list_dataflow_graphs](#list_dataflow_graphs), [get_dataflow_graph](#get_dataflow_graph), [dataflow_graph_details](#dataflow_graph_details) |
| Edge Registry | [list_edge_registry_groups](#list_edge_registry_groups), [get_edge_registry_group](#get_edge_registry_group), [list_edge_registry_resources](#list_edge_registry_resources), [list_edge_registry_resource_versions](#list_edge_registry_resource_versions), [get_edge_registry_resource](#get_edge_registry_resource), [get_edge_registry_generic_resource](#get_edge_registry_generic_resource), [get_edge_registry_schema_from_asset](#get_edge_registry_schema_from_asset) |
| MQTT data | [mq_messages](#mq_messages), [mqtt_publish](#mqtt_publish) |
| State Store | [dss_get](#dss_get) |

## Before you begin

- [Deploy MCP](howto-deploy-mcp.md) and [connect an MCP-compatible client](howto-connect-ai-agent.md).
- [Configure MCP authorization](howto-configure-mcp-authorization.md) for the tools you want to call. The default `Reader` role covers documentation and resource-inspection tools; `DataReader` covers `mq_messages` and `dss_get`. For broker metadata, follow [Enable broker metadata access](howto-configure-mcp-authorization.md#enable-broker-metadata-access-optional) to assign `Admin` to a trusted client; under the default policy, this role also permits all other backend tools, including write tools. For publishing alone, configure a dedicated tool grant.
- Verify the backend's downstream permissions. MCP roles don't grant Kubernetes read access, MQTT subscription or publication permissions, State Store access, or Edge Registry permissions.

Through the default `aio` connection, clients see names such as `aio_list_assets`. Authorization policies use the unprefixed name, such as `list_assets`. For another connection name, use that connection's prefix. Tool discovery is filtered by the caller's policy, and some tools aren't registered if the backend doesn't have a broker connection. Custom backend configuration can add or change tools. Use your client's tool discovery to check the available names and schemas.

## Documentation tools

These read-only tools return documentation embedded in the backend image. They don't search the web or guarantee the latest online content. They don't require access to your application data.

### documentation_overview

Retrieve the documentation table of contents to find an article's relative `href`. For example, ask your agent to find the broker authorization documentation before retrieving it.

This tool has no arguments. Call `aio_documentation_overview`:

```json
{}
```

Example result (excerpt):

```json
{
  "items": [
    {
      "href": "index.yml",
      "items": [
        {
          "name": "Overview",
          "href": "overview-iot-operations.md"
        }
      ]
    }
  ]
}
```

The actual tree can contain nested `items` arrays. Entries can include `name`, `href`, and `display_name`; grouping nodes might not have an `href`. Follow child entries to find a page. An article missing from this tree might not be embedded in the installed backend version.

### documentation

Retrieve one embedded article after finding its relative path with `documentation_overview`.

| Argument | Required | Meaning |
| --- | --- | --- |
| `href` | Yes | Exact relative path from the documentation table of contents. |

Call `aio_documentation`:

```json
{
  "href": "overview-iot-operations.md"
}
```

Example result (excerpt):

```json
{
  "body": "---\ntitle: What Is Azure IoT Operations?\n"
}
```

`body` contains the article text, including Markdown and any front matter. It isn't a summary or rendered HTML. Use an embedded path, not an absolute website URL. An unknown path returns an error rather than an empty article.

## Kubernetes resource inspection tools

The following tools read the resource types that the backend can see in its configured namespace scope. They don't modify resources or return a historical record. The backend needs Kubernetes read permissions for each resource type.

- A **list** tool returns an object keyed by programmatic resource name, not an `items` array. The value is a description where configured, or `true` to indicate existence. It isn't an enabled or healthy flag. An empty object means the backend's scope doesn't include any resources.
- A **get** tool returns the resource data, typically `spec` and `status`, rather than the full Kubernetes API envelope. Use it when the detail tool doesn't expose the information you need. A missing resource or failed Kubernetes request is an error.
- A **details** tool accepts an array of names and one detail selector. For one name, the result is the detail object directly; a scalar is wrapped under the detail name. For multiple names, the result is keyed by resource name. Missing or unavailable details can be omitted; `{}` doesn't prove the resource is healthy or error-free. Use the get tool to investigate. Unsupported detail selectors return an error.

List tools don't accept a resource-name argument or pagination parameters. Detail arrays contain exact resource names, not wildcard patterns. Status fields reflect the controllers' last reports and might lag behind current conditions.

### list_assets

Discover asset names before inspecting an asset, its destinations, or its dataset schema. No arguments are required.

Call `aio_list_assets`:

```json
{}
```

Example result:

```json
{
  "oven": "Production oven telemetry"
}
```

Descriptions come from the asset's description or display name. A resource without a string description has the value `true`. Use the object key, not the description, in `get_asset`, `asset_details`, and `get_edge_registry_schema_from_asset`. This list doesn't read asset telemetry.

### get_asset

Read an asset's configuration and reported status, including datasets, device reference, and destinations. Use `asset_details` for a supported detail.

| Argument | Required | Meaning |
| --- | --- | --- |
| `asset` | Yes | Exact asset name from `list_assets`. |

Call `aio_get_asset`:

```json
{
  "asset": "oven"
}
```

Example result (excerpt):

```json
{
  "spec": {
    "enabled": true
  }
}
```

Inspect `spec.datasets` for configured dataset names and `status.datasets` for reported message schema references. These datasets aren't necessarily populated at the same time. The response describes configuration and status, not current dataset values. A nonexistent asset returns an error.

### asset_details

Read selected information for one or more assets without retrieving each full configuration.

| Argument | Required | Meaning |
| --- | --- | --- |
| `assets` | Yes | Array of exact asset names. |
| `detail` | Yes | `customer_metadata`, `destinations`, `device`, `enabled`, `errors`, or `health_status`. |

Call `aio_asset_details`:

```json
{
  "assets": ["oven"],
  "detail": "enabled"
}
```

Example result:

```json
{
  "enabled": true
}
```

`customer_metadata` includes identifiers and manufacturer, model, revision, or serial fields when present. `destinations` groups destinations by data operator and name, using the first configured destination or its default. `device` returns the device reference. `errors` and `health_status` use reported status, which might be absent. Add names to `assets` to get a name-keyed result for comparison.

### list_devices

Discover device names before reading their configuration, endpoints, or connector allocation. No arguments are required.

Call `aio_list_devices`:

```json
{}
```

Example result:

```json
{
  "oven-device": true
}
```

The keys are Kubernetes device resource names, not endpoint names or external device IDs. `true` indicates existence only. Pass a key to `get_device`, `device_details`, or `find_connector_by_device`. An empty result can also indicate that you're inspecting a namespace without devices.

### get_device

Read a device's configuration and reported status, including its inbound and outbound endpoints. Use `device_details` for a supported detail.

| Argument | Required | Meaning |
| --- | --- | --- |
| `device` | Yes | Exact device resource name. |

Call `aio_get_device`:

```json
{
  "device": "oven-device"
}
```

Example result (excerpt):

```json
{
  "spec": {
    "enabled": true
  }
}
```

Endpoint configuration can include addresses, authentication methods, and secret references. Treat returned configuration as potentially sensitive; this tool isn't a way to retrieve referenced secret values. Status reports endpoint-level health and errors when available. A device's existence doesn't prove that its endpoint is reachable.

### device_details

Read a selected device property across one or more devices.

| Argument | Required | Meaning |
| --- | --- | --- |
| `devices` | Yes | Array of exact device resource names. |
| `detail` | Yes | `customer_metadata`, `enabled`, `endpoints`, `errors`, or `health_status`. |

Call `aio_device_details`:

```json
{
  "devices": ["oven-device"],
  "detail": "enabled"
}
```

Example result:

```json
{
  "enabled": true
}
```

The `endpoints` group endpoint addresses and authentication method names by direction and endpoint name. The `customer_metadata` returns external ID, manufacturer, model, and operating system information. Device health is reported per endpoint, not as one root health value. Empty error or health output might mean status isn't reported. Check `get_device` before drawing conclusions.

### list_brokers

Discover the broker resource names in the backend's scope. You don't need to provide any arguments.

Call `aio_list_brokers`:

```json
{}
```

Example result:

```json
{
  "default": true
}
```

Use the returned name with `get_broker` or `broker_details`. `true` doesn't mean the broker is healthy. This tool lists broker resources, not their partitions, replicas, MQTT sessions, or listeners. Use `broker_metadata` for live session and queue information.

### get_broker

Read broker configuration and reported status, including cardinality and diagnostics settings.

| Argument | Required | Meaning |
| --- | --- | --- |
| `broker` | Yes | Exact broker resource name. |

Call `aio_get_broker`:

```json
{
  "broker": "default"
}
```

Example result (excerpt):

```json
{
  "spec": {
    "cardinality": {
      "backendChain": {
        "partitions": 2,
        "workers": 2
      }
    }
  }
}
```

The response describes the broker resource, not separate BrokerListener or BrokerAuthorization resources. Use `broker_details` for health only. Configuration cardinality isn't a count of connected MQTT clients; use the metadata tool to inspect sessions.

### broker_details

Read the last reported health state for one or more brokers.

| Argument | Required | Meaning |
| --- | --- | --- |
| `brokers` | Yes | Array of exact broker names. |
| `detail` | Yes | `health_status`. |

Call `aio_broker_details`:

```json
{
  "brokers": ["default"],
  "detail": "health_status"
}
```

Example result (excerpt):

```json
{
  "status": "Available",
  "message": "",
  "reasonCode": ""
}
```

Health can include `lastTransitionTime` and `lastUpdateTime`. It reports the controller's aggregate state, not an end-to-end MQTT transaction test. Missing health data can produce `{}`; use `get_broker` and operational diagnostics to investigate.

### list_connectors

Discover instantiated connector resource names before inspecting their health or allocations. No arguments are required.

Call `aio_list_connectors`:

```json
{}
```

Example result:

```json
{
  "opcua-connector": true
}
```

Names identify connector instances, not connector templates or device endpoints. Use them with `get_connector` and `connector_details`. To work in the other direction, starting from a device, use `find_connector_by_device`. Existence alone doesn't mean a connector has a current device allocation.

### get_connector

Read a connector resource's configuration and reported status.

| Argument | Required | Meaning |
| --- | --- | --- |
| `connector` | Yes | Exact connector instance name. |

Call `aio_get_connector`:

```json
{
  "connector": "opcua-connector"
}
```

Example result (excerpt):

```json
{
  "status": {
    "runtime": {
      "output": {
        "allocatedDevices": [
          {
            "deviceName": "oven-device",
            "deviceInboundEndpointName": "opcua"
          }
        ]
      }
    }
  }
}
```

Runtime allocation is reported status and might be absent or stale. Use `connector_details` when you only need health or allocation fields. This tool doesn't connect to a device, restart the connector, or validate endpoint credentials.

### connector_details

Read connector health, runtime device allocation, or both.

| Argument | Required | Meaning |
| --- | --- | --- |
| `connectors` | Yes | Array of exact connector names. |
| `detail` | Yes | `health_status`, `runtime_device_allocation`, or `status`. |

Call `aio_connector_details`:

```json
{
  "connectors": ["opcua-connector"],
  "detail": "runtime_device_allocation"
}
```

Example result (excerpt):

```json
{
  "allocatedDevices": [
    {
      "deviceName": "oven-device",
      "deviceInboundEndpointName": "opcua"
    }
  ]
}
```

Allocation output can also include a `timestamp`. The `status` selector combines `healthStatus` and `runtimeDeviceAllocation`. The `health_status` selector returns health only. An absent allocation field doesn't prove that a device is unassigned: the connector might not have reported runtime status yet.

### find_connector_by_device

Find connectors whose reported runtime allocations include a device. Optionally select one inbound endpoint to disambiguate a device with multiple endpoints.

| Argument | Required | Meaning |
| --- | --- | --- |
| `device_name` | Yes | Device resource name; must not be empty. |
| `device_inbound_endpoint_name` | No | Exact inbound endpoint name; if supplied, must not be empty. |

Call `aio_find_connector_by_device`:

```json
{
  "device_name": "oven-device",
  "device_inbound_endpoint_name": "opcua"
}
```

Example result (excerpt):

```json
{
  "matches": [
    {
      "connectorName": "opcua-connector",
      "runtime": {
        "output": {
          "allocatedDevices": [
            {
              "deviceName": "oven-device",
              "deviceInboundEndpointName": "opcua"
            }
          ]
        }
      }
    }
  ]
}
```

Matching ignores case for device and endpoint names. Each match includes the matching allocation entries and can include `healthState` and a runtime timestamp. `{"matches":[]}` means no matching reported allocation was found; it isn't a live endpoint connectivity check. Omit the optional endpoint argument to search all inbound endpoints for the device.

### list_dataflows

Discover data flow resource names before inspecting their configuration or health. No arguments are required.

Call `aio_list_dataflows`:

```json
{}
```

Example result:

```json
{
  "oven-dataflow": true
}
```

The result includes resource names, not data flow profile names or endpoint names. `true` indicates existence, even if a flow is disabled or unhealthy. Use `get_dataflow` for its source and destination configuration or `dataflow_details` for reported health.

### get_dataflow

Read the configuration and reported status of one data flow.

| Argument | Required | Meaning |
| --- | --- | --- |
| `dataflow` | Yes | Exact data flow resource name. |

Call `aio_get_dataflow`:

```json
{
  "dataflow": "oven-dataflow"
}
```

Example result (excerpt):

```json
{
  "spec": {
    "mode": "Enabled"
  }
}
```

`spec.operations` describes configured source, transformation, and destination operations. The tool doesn't execute the flow or return messages passing through it. Endpoint references describe separate resources and don't include their full configuration. Use `dataflow_details` for a smaller health-only result.

### dataflow_details

Read reported health for one or more data flows.

| Argument | Required | Meaning |
| --- | --- | --- |
| `dataflows` | Yes | Array of exact data flow names. |
| `detail` | Yes | `health_status`. |

Call `aio_dataflow_details`:

```json
{
  "dataflows": ["oven-dataflow"],
  "detail": "health_status"
}
```

Example result (excerpt):

```json
{
  "status": "Available",
  "message": "",
  "reasonCode": ""
}
```

For one flow, health fields are returned directly; for multiple flows they're keyed by name. Health can include report and transition times. An available report doesn't establish that a particular message reached the destination; test delivery separately. Missing status can produce an empty result.

### list_dataflow_graphs

Discover data flow graph names. These resources are separate from the data flows returned by `list_dataflows`. You don't need to provide any arguments.

Call `aio_list_dataflow_graphs`:

```json
{}
```

Example result:

```json
{
  "oven-graph": true
}
```

Use the keys with `get_dataflow_graph` or `dataflow_graph_details`. A graph's presence doesn't mean it's enabled or healthy. This tool doesn't enumerate individual graph nodes. Retrieve the graph configuration for those.

### get_dataflow_graph

Read a graph's configuration and reported status, including nodes and node connections.

| Argument | Required | Meaning |
| --- | --- | --- |
| `dataflowGraph` | Yes | Exact graph resource name. This argument uses camel case. |

Call `aio_get_dataflow_graph`:

```json
{
  "dataflowGraph": "oven-graph"
}
```

Example result (excerpt):

```json
{
  "spec": {
    "mode": "Enabled"
  }
}
```

To follow the configured processing path, inspect `spec.nodes` and `spec.nodeConnections`. The response isn't a trace of an individual message or an execution preview. Use `dataflow_graph_details` if you only need the graph's reported health.

### dataflow_graph_details

Read reported health for one or more data flow graphs.

| Argument | Required | Meaning |
| --- | --- | --- |
| `dataflowGraphs` | Yes | Array of exact graph names. This argument uses camel case. |
| `detail` | Yes | `health_status`. |

Call `aio_dataflow_graph_details`:

```json
{
  "dataflowGraphs": ["oven-graph"],
  "detail": "health_status"
}
```

Example result (excerpt):

```json
{
  "status": "Available",
  "message": "",
  "reasonCode": ""
}
```

Health describes the graph controller's reported state, not node-by-node message contents. Missing health status can produce `{}`. Compare report timestamps with the time of your investigation, and use the get tool for configuration context.

## Edge Registry tools

These read-only tools retrieve metadata and documents through the backend's Edge Registry client. They require a configured broker connection and downstream access to the Edge Registry service. The backend's identity is used, not the MCP caller's MQTT identity.

Typed tools use `resource_kind`: `schema`, `thing_description`, or `thing_model`. Generic tools instead use xRegistry collection names, such as `schemagroups` and `schemas`. Don't substitute a Kubernetes namespace or asset name for a registry group ID.

Unless specified otherwise, omitting `group_id` selects the cloud-default group. For resource and version listings, `all_groups: true` searches every group; don't combine it with `group_id`. Optional `label` filters use an object with exact `key` and `value` strings. Resource labels and version labels are distinct.

Registry identifiers must be 1-128 characters, start with an ASCII letter, digit, or underscore, and contain only ASCII letters, digits, `-`, `.`, `_`, `~`, `:`, or `@`. Use discovery results rather than constructing identifiers. Invalid arguments, nonexistent resources, service errors, and timeouts are errors, not successful empty documents.

### list_edge_registry_groups

List group IDs in an xRegistry group collection.

| Argument | Required | Meaning |
| --- | --- | --- |
| `group_type` | Yes | Group collection name, such as `schemagroups`. |

Call `aio_list_edge_registry_groups`:

```json
{
  "group_type": "schemagroups"
}
```

Example result:

```json
{
  "groups": ["example-schema-group"]
}
```

This method returns IDs only, not group metadata or schemas. Use an ID with `get_edge_registry_group` or a group-scoped listing. An empty `groups` array means the collection returned no groups. The cloud-default group used by other tools is a selection behavior, not a literal ID named `default`.

### get_edge_registry_group

Read a group's metadata and counts of resource collections.

| Argument | Required | Meaning |
| --- | --- | --- |
| `group_type` | Yes | Group collection name. |
| `group_id` | No | Exact group ID; omit to resolve the cloud-default group. |

Call `aio_get_edge_registry_group`:

```json
{
  "group_type": "schemagroups"
}
```

Example result (excerpt):

```json
{
  "group_id": "example-schema-group",
  "labels": [],
  "resources_counts": {
    "schemas": 2
  }
}
```

The full result includes `xid`, `epoch`, creation and modification times, optional descriptive or deprecation metadata, and `extensions`. Extension values are base64-encoded. Counts aren't the documents themselves; use a resource listing to discover IDs. A missing group returns an error.

### list_edge_registry_resources

Discover resource references for a typed collection, optionally filtering by a resource label.

| Argument | Required | Meaning |
| --- | --- | --- |
| `resource_kind` | Yes | `schema`, `thing_description`, or `thing_model`. |
| `group_id` | No | Select one group. |
| `all_groups` | No | Boolean, default `false`; can't be combined with `group_id`. |
| `label` | No | Exact resource label as `{"key":"environment","value":"test"}`. |

Call `aio_list_edge_registry_resources`:

```json
{
  "resource_kind": "schema"
}
```

Example result:

```json
{
  "resources": [
    {
      "group_type": "schemagroups",
      "group_id": "example-schema-group",
      "resource_type": "schemas",
      "resource_id": "telemetry-schema"
    }
  ]
}
```

These resource references aren't versions or document content. Use a returned `resource_id` with a get tool. To search other groups, set `group_id` or `all_groups`; otherwise a schema in a nondefault group doesn't appear. If there are no matches, the `resources` array is empty.

### list_edge_registry_resource_versions

Discover version references. You can narrow the results by resource ID, document hash, or version label.

| Argument | Required | Meaning |
| --- | --- | --- |
| `resource_kind` | Yes | `schema`, `thing_description`, or `thing_model`. |
| `group_id` | No | Select one group. |
| `all_groups` | No | Boolean, default `false`; can't be combined with `group_id`. |
| `resource_id` | No | Exact resource ID. |
| `document_hash` | No | Exact document hash to match. |
| `label` | No | Exact version label with `key` and `value`. |

Call `aio_list_edge_registry_resource_versions`:

```json
{
  "resource_kind": "schema",
  "resource_id": "telemetry-schema"
}
```

Example result:

```json
{
  "versions": [
    {
      "group_type": "schemagroups",
      "group_id": "example-schema-group",
      "resource_type": "schemas",
      "resource_id": "telemetry-schema",
      "version_id": 1
    }
  ]
}
```

Combine the supplied filters to narrow the results. You can pass the returned numeric `version_id` to `get_edge_registry_resource`. Resource discovery doesn't replace version discovery: a resource label isn't a version label. If there are no matches, the `versions` array is empty and doesn't return an error.

### get_edge_registry_resource

Retrieve a typed resource's default or specified version, including document content and version metadata.

| Argument | Required | Meaning |
| --- | --- | --- |
| `resource_kind` | Yes | `schema`, `thing_description`, or `thing_model`. |
| `resource_id` | Yes | Exact resource ID from discovery. |
| `group_id` | No | Group ID; omit for the cloud-default group. |
| `version_id` | No | Unsigned integer; omit for the resource's default version. |

Call `aio_get_edge_registry_resource`:

```json
{
  "resource_kind": "schema",
  "resource_id": "telemetry-schema"
}
```

Example result (excerpt):

```json
{
  "resource_kind": "schema",
  "resource_id": "telemetry-schema",
  "version_id": 1,
  "document": "{\"type\":\"object\"}",
  "document_encoding": "utf8"
}
```

The response includes the resolved `group_id`, `xid`, `epoch`, labels, timestamps, `is_default`, format and validation metadata, document hash, and extensions. `document` is a string: decode it according to `document_encoding` (`utf8` or `base64`) before interpreting its format. A UTF-8 JSON schema is still a JSON string inside the tool result.

Validation objects report `validated` and an optional `reason`; successful retrieval doesn't imply format or compatibility validation passed. Extensions are base64-encoded. This typed response describes a version; use the generic tool for resource-level metadata.

### get_edge_registry_generic_resource

Retrieve an xRegistry resource with resource-level metadata and its default or specified version. Use this tool for collection types or string version identifiers not covered by the typed get tool.

| Argument | Required | Meaning |
| --- | --- | --- |
| `group_type` | Yes | xRegistry group collection name. |
| `resource_type` | Yes | xRegistry resource collection name. |
| `resource_id` | Yes | Exact resource ID. |
| `group_id` | No | Group ID; omit for the cloud-default group. |
| `version_id` | No | String version ID, unlike the typed tool's integer. |

Call `aio_get_edge_registry_generic_resource`:

```json
{
  "group_type": "schemagroups",
  "resource_type": "schemas",
  "resource_id": "telemetry-schema",
  "version_id": "1"
}
```

Example result (excerpt):

```json
{
  "resource_id": "telemetry-schema",
  "meta": {
    "default_version_id": "1"
  },
  "version": {
    "version_id": "1",
    "document": "{\"type\":\"object\"}",
    "document_encoding": "utf8"
  }
}
```

The full result includes collection names, resolved group ID, `xid`, `versions_count`, resource `meta`, the selected `version`, and extensions. `meta` describes default-version selection, compatibility, and read-only state; `version` contains the selected document and version metadata. Selecting a nondefault version doesn't change the resource's default.

Decode document content according to `version.document_encoding`. Documents can be absent in a generic response, while extension values are base64-encoded. A nonexistent version returns an error rather than silently falling back to the default.

### get_edge_registry_schema_from_asset

Resolve the exact schema version that an asset dataset's reported message schema reference points to.

| Argument | Required | Meaning |
| --- | --- | --- |
| `asset` | Yes | Exact asset resource name. |
| `dataset` | Yes | Dataset name in the asset's reported `status.datasets`. |

Call `aio_get_edge_registry_schema_from_asset`:

```json
{
  "asset": "oven",
  "dataset": "temperature"
}
```

Example result (excerpt):

```json
{
  "resource_kind": "schema",
  "version_id": 1,
  "document": "{\"type\":\"object\"}",
  "document_encoding": "utf8"
}
```

The tool reads `schemaName` and `schemaVersion` from the dataset's message schema reference, and then retrieves that version from the cloud-default schema group. The tool doesn't interpret `schemaRegistryNamespace` as a group ID. The response has the same document, encoding, and metadata semantics as `get_edge_registry_resource`.

You can't resolve an asset that doesn't have a reported reference, even if you configure its dataset. The tool returns an error for a missing asset or reference. Incomplete fields or a nonnumeric version are invalid. Inspect the asset's status with `get_asset` first. The tool needs both Kubernetes asset read access and Edge Registry access.

## MQTT and State Store data tools

These tools operate by using the backend's broker identity, not the original MCP client's identity. Authorize callers accordingly: downstream topic and key grants for the backend aren't a substitute for MCP authorization. Reading payloads or values can expose application data.

### mq_messages

Subscribe temporarily and collect MQTT messages until the count limit or timeout is reached. For example, ask your agent to sample one message from a nonoperational test topic.

| Argument | Required | Meaning |
| --- | --- | --- |
| `topic` | Yes | MQTT topic filter; MQTT `+` and `#` wildcards are supported. |
| `timeout_ms` | No | Unsigned milliseconds to wait; default `60000`. |
| `max_messages` | No | Unsigned message limit; default `100`, maximum `1000`. |

Use a separate authorized MQTT client to publish `hello world` to the example topic after sampling begins. For the following result, publish without setting the MQTT payload format indicator. Call `aio_mq_messages`:

```json
{
  "topic": "mcp/examples/sample",
  "timeout_ms": 5000,
  "max_messages": 1
}
```

Example result:

```json
{
  "messages": [
    {
      "payload": "aGVsbG8gd29ybGQ=",
      "payload_format_indicator": "Unspecified"
    }
  ]
}
```

With the `UTF8` payload format indicator, `payload` is text. With `Unspecified`, it's base64-encoded bytes, even if those bytes happen to contain readable text. Optional fields include `content_type`, `message_expiry_interval`, `response_topic`, base64 `correlation_data`, and `user_properties`. Message entries don't include their MQTT topic; avoid a broad wildcard if you need to distinguish source topics.

The tool subscribes with maximum QoS 1. It samples messages received during the call, including any retained messages delivered on subscription; it doesn't query historical traffic. A timeout can return fewer than the requested number, including `{"messages":[]}`, without an error. A zero count requests no messages. An invalid filter, a count above `1000`, or a failure to submit the subscription request returns an error.

The tool doesn't wait for or check the broker's subscription acknowledgment (SUBACK). A broker-side subscription rejection, such as an authorization failure, can therefore return `{"messages":[]}` instead of an error. If sampling unexpectedly returns no messages, check the backend's broker permissions before concluding that the topic has no traffic.

The backend needs subscribe permission for the chosen filter. A broad MCP grant allows sampling any filter the backend can subscribe to; use argument conditions in the MCP policy when callers need narrower access. Don't use production traffic to test payload access.

### mqtt_publish

Publish a JSON object to one MQTT topic. This tool performs a write operation, unlike the other tools in this article.

| Argument | Required | Meaning |
| --- | --- | --- |
| `topic` | Yes | Exact MQTT topic name; wildcards aren't allowed. |
| `payload` | Yes | JSON object, not a JSON string, array, or scalar. |

Start a separately authorized subscriber on your unique test topic before calling the tool. Call `aio_mqtt_publish`:

```json
{
  "topic": "mcp/examples/publish",
  "payload": {
    "message": "Hello from MCP"
  }
}
```

Example result:

```json
{}
```

The built-in tool publishes at QoS 1 with retain disabled, content type `application/json`, and the UTF-8 payload format indicator. A successful empty object means the broker accepted the publish; it doesn't prove that a subscriber or downstream application processed it. Confirm the payload independently with the subscriber.

The backend needs broker publish permission, and the MCP client needs an explicit tool grant. See [Allow a write tool](howto-configure-mcp-authorization.md#allow-a-write-tool-optional) for a dedicated role and an exact-topic condition. A failed publish is an error. Cancellation or timeout can leave delivery unknown; don't automatically retry an operation whose downstream effects aren't idempotent.

### dss_get

Read one Distributed State Store value by key. This tool doesn't create, update, or delete keys.

| Argument | Required | Meaning |
| --- | --- | --- |
| `key_name` | Yes | UTF-8 key name, or base64-encoded key bytes when using `Base64`. |
| `key_encoding` | No | Case-sensitive `String` (default) or `Base64`. This controls the key, not the result encoding. |

Using a separately authorized State Store client, create the test key `mcp/examples/key` with value `hello world` and a short expiry. Call `aio_dss_get`:

```json
{
  "key_name": "mcp/examples/key"
}
```

Example result:

```json
{
  "value": "aGVsbG8gd29ybGQ="
}
```

To read the same key as bytes, call `aio_dss_get`:

```json
{
  "key_name": "bWNwL2V4YW1wbGVzL2tleQ==",
  "key_encoding": "Base64"
}
```

The result has the same `value`. Values are always base64-encoded, regardless of key encoding. Decode `value` before interpreting application content; the tool doesn't infer a JSON or text format.

A missing key and a stored empty byte value both produce `{"value":""}`; the response doesn't distinguish them or return version metadata. Invalid base64 is an argument error. Permission failures and the State Store client's 10-second operation timeout are errors, not missing keys. The backend needs State Store read access for the key and MQTT access needed by the State Store protocol. Delete the test key when finished.

## Broker metadata tool

### broker_metadata

Inspect current MQTT sessions, subscriptions, client queue state, and retained topic names. For example, an agent can list disconnected sessions and match their session tags to queued message counts. The tool doesn't read MQTT message payloads.

First [enable broker metadata access](howto-configure-mcp-authorization.md#enable-broker-metadata-access-optional). The backend needs MQTT 5 access to the broker and explicit subscription grants for the following metadata topics; a grant for `#` doesn't include `$SYS`.

| Query | Required broker subscription permissions |
| --- | --- |
| `Topology` | `$SYS/topology` |
| `Sessions`, without a key | `$SYS/topology` and `$SYS/store/sessions/#` |
| `Sessions`, with a key | `$SYS/store/sessions/<client-id>` |
| `ClientState` | `$SYS/topology` and either `$SYS/store/client_state/#` for a listing or `$SYS/store/client_state/<session-tag>` for a lookup |
| `Retain` | `$SYS/topology` and `$SYS/store/retain/#` |

Metadata is read using the backend's identity. Collection results aren't filtered by the original caller's MQTT topic permissions. Grant access only to callers permitted to inspect client IDs, subscriptions, queue state, and retained topic names.

| Argument | Required | Meaning |
| --- | --- | --- |
| `query` | Yes | Case-sensitive `Topology`, `Sessions`, `ClientState`, or `Retain`. |
| `key` | No | Exact MQTT client ID for `Sessions`, or `frontendId:generationId:connectionKey` for `ClientState`. Omit for a listing. |

Keys don't support `+` or `#` wildcards. `Topology` and `Retain` reject keys. Listings return an `items` array; exact lookups return an `item` object or `null` when no entry matches.

#### Get the backend chain count

Call `aio_broker_metadata`:

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

`chains` is the number of backend partitions multiplied by the number of workers per partition. Two partitions with two workers each produce four logical chains. It isn't the partition count or replica count.

#### Inspect sessions and subscriptions

Call `aio_broker_metadata` to list sessions:

```json
{
  "query": "Sessions"
}
```

The result contains `items`, with one object per session. To inspect one session, connect a test MQTT client with a unique client ID and substitute that ID for `sensor-a`. Call `aio_broker_metadata`:

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

`expiryIntervalS` is the session expiry interval in seconds; `null` means no expiry. Disconnected sessions also include `expiresAtS`, an expiry time in Unix seconds. A session can remain after disconnection until its expiry. Each subscription includes the filter, maximum QoS, and subscription options. An empty `subscriptions` array means no subscriptions were recorded for that session.

#### Inspect queued and in-flight messages

Call `aio_broker_metadata` to list client states:

```json
{
  "query": "ClientState"
}
```

The result contains `items`. For a lookup, use the `sessionTag` from the test client's `Sessions` result, formatted as `frontendId:generationId:connectionKey`. Replace the illustrative key below with that tag, not the client ID. Call `aio_broker_metadata`:

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

The tool combines state from all backend chains by session tag, summing `queueDepth` and `inflight`. `clientId` can be `null` when no matching session entry is available. `receiveMaximum` limits the QoS 1 messages the broker can send before receiving acknowledgments. Queue counts are current observations, not accumulated traffic metrics.

#### List retained topic names

Publish a retained message on a unique test topic with a separate authorized MQTT client, and then call `aio_broker_metadata`:

```json
{
  "query": "Retain"
}
```

Example result:

```json
{
  "items": [
    "mcp/examples/retained"
  ]
}
```

This output lists names only, not retained payloads, and doesn't support an exact-topic key. It also shows other retained topics in the broker. Clear your test retained message by publishing an empty retained payload to the same topic.

#### Interpret metadata results and errors

An empty `items` array means the query succeeded but found no entries. `{"item":null}` means an exact lookup found no match. Connection failures, rejected subscriptions, timeouts, and invalid responses are errors, not empty results.

Listings collect responses from all backend chains. If an expected chain doesn't respond, the tool returns a timeout error rather than a partial listing. Results aren't ordered or a synchronized snapshot across chains or separate calls. They provide no history or continuous event stream.

If the tool isn't visible, check tool availability and the MCP grant. If a subscription is rejected, check the backend's broker permissions for the required `$SYS` topics. Don't grant MQTT permissions to the original caller to fix a backend denial.

## Troubleshoot tool calls

Tool discovery and a successful call are separate checks. A listed tool can still be denied for particular arguments, or fail because a downstream service is unavailable. Invalid arguments and downstream failures can appear as JSON-RPC errors or tool-error content, depending on the failure and client.

For missing tools, inspect the caller's roles, the connection's policy, and backend configuration. For resource reads, check namespace scope and backend Kubernetes permissions. For MQTT, State Store, and Edge Registry calls, check broker connectivity and the backend's downstream grants. Don't treat an error as a valid empty result or bypass MCP authorization to resolve it.

For connection, authentication, and timeout diagnostics, see [Troubleshoot MCP](troubleshoot-mcp.md).

## Related content

- [What is Azure IoT Operations MCP?](overview-mcp.md)
- [Configure MCP authorization](howto-configure-mcp-authorization.md)
- [Connect to MCP](howto-connect-ai-agent.md)

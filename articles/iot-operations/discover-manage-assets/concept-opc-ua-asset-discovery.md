---
title: OPC UA asset discovery modes
description: Learn how the connector for OPC UA discovers assets, including DI-based, type-based (preview), and segmented discovery modes, and how start-node and periodic discovery behave.
author: dominicbetts
ms.subservice: azure-akri
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: concept-article
ms.date: 07/03/2026

# CustomerIntent: As an industrial edge IT or operations user, I want to understand how the connector for OPC UA discovers assets so that I can choose the right discovery mode for my OPC UA servers.
---

# OPC UA asset discovery modes

The connector for OPC UA can automatically discover assets connected to an OPC UA server and add their configurations to Azure Device Registry. To handle the different ways that OPC UA servers describe their address space, the connector supports three *discovery modes*: DI-based, type-based, and segmented. The mode you choose determines which server nodes become assets and data points, so matching the mode to how your server exposes its type model matters. The wrong choice can produce no assets, incomplete assets, or many small chunked assets.

This article explains how each discovery mode works, how the modes interact when you configure more than one, and how start-node and periodic discovery affect the results. To enable and configure discovery, see [Discover and configure OPC UA assets](howto-detect-opc-ua-assets.md). For an overview of the connector for OPC UA and the Akri services, see [What are Akri services](overview-akri.md).

> [!IMPORTANT]
> Type-based discovery is in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Discovery modes and precedence

The connector for OPC UA supports three discovery modes. Only one mode runs per endpoint. The following precedence determines which mode runs:

| Priority | Mode | Condition | Description |
|----------|------|-----------|-------------|
| 1 | **Type-based discovery (preview)** | `assetTypes` is configured | Discovers assets matching specific `ObjectType` definitions |
| 2 | **Segmented discovery** | `segmentedDiscovery` is `true` | Browses all `Variable` nodes and chunks them into assets |
| 3 | **DI-based discovery** (default) | Neither of the above | Detects assets by using DI `ComponentType`/`DeviceType` matching |

If you configure both `assetTypes` and `segmentedDiscovery`, type-based discovery takes precedence and the connector logs a warning.

To use the device integration (DI-based) discovery mode, the assets must comply with the [OPC 10000-100: Devices](https://reference.opcfoundation.org/DI/v103/docs/) companion specification. The connector for OPC UA and Akri services follow the process in [OPC 10000-110: Asset Management Basics](https://reference.opcfoundation.org/AMB/v101/docs/) to discover OPC UA assets and onboard them into Azure Device Registry.

### Comparison of discovery modes

| | DI-based discovery (default) | Type-based discovery (preview) | Segmented discovery |
|---|---|---|---|
| **Detection** | Automatic — finds DI `DeviceType`/`ComponentType` instances | Explicit — you specify which `ObjectType`s to look for | Automatic — collects all `Variable` nodes |
| **Server requirement** | Must implement DI companion spec | Any server with custom `ObjectType`s | Any server (no type model required) |
| **Data points** | All `Variable` nodes under the detected asset root | Only `Variable` nodes whose `BrowseName` matches the type definition's children | All `Variable` nodes (excluding `PropertyType`) |
| **Events** | DI health events (`DeviceHealthAlarmType` subtypes) on the detected device root | Events referenced by the `ObjectType` to be discovered via the `GeneratesEvent` reference | Not discovered |
| **Methods** | `Method` nodes under asset root become management actions | `Method` nodes matching the type definition become management actions | Not discovered |
| **Asset boundaries** | One asset per detected DI device/component | One asset per object instance of the specified type | Fixed-size chunks (10 datasets x 1,000 data points) |
| **Configuration** | `"runAssetDiscovery": true` | `"runAssetDiscovery": true, "assetTypes": [...]` | `"runAssetDiscovery": true, "segmentedDiscovery": true` |
| **Best for** | Servers implementing OPC UA DI companion spec | Servers with known custom `ObjectType`s (for example, `MachineTool`) | Flat servers with many `Variable` nodes and no type model |

## Segmented discovery

By default, asset discovery uses the DI-based mode, which detects assets by matching OPC UA `DeviceType`/`ComponentType` patterns from the DI companion specification. This mode works well for servers that implement standard DI information models, but many OPC UA servers expose flat lists of `Variable` nodes without DI types.

Segmented discovery browses the OPC UA server's address space and automatically creates discovered assets by chunking `Variable` nodes into fixed-size datasets.

Segmented discovery is an alternative discovery mode that:

1. Browses the address space and collects all `Variable` nodes, excluding `PropertyType` variables.
1. Chunks the `Variable` nodes into discovered assets.
1. Automatically creates multiple discovered assets when the number of variables exceeds the per-asset limit.
1. Names assets by using the pattern `{endpointName}-{index}`. For example, `opcua-endpoint-0` and `opcua-endpoint-1`.

Segmented discovery is useful when:

- The OPC UA server doesn't implement DI companion specification types.
- You want to discover all `Variable` nodes without type filtering.
- The server has a large flat address space with thousands of `Variable` nodes.

### Segmented discovery asset chunking limits

Segmented discovery chunks `Variable` nodes into discovered assets with the following limits:

| Parameter | Value |
|-----------|-------|
| Max data points per dataset | 1,000 |
| Max datasets per asset | 10 |
| Max data points per asset | 10,000 |

### Segmented discovery node filtering

Segmented discovery applies the following filtering when browsing the OPC UA address space:

| Node type | Included | Notes |
|-----------|----------|-------|
| Variable nodes | Yes | Become data points in datasets |
| PropertyType variables | No | Contain metadata, not data values |
| Object nodes | No | Enable deeper browsing but aren't data points |
| Method nodes | No | Not applicable for data point discovery |

### Segmented discovery example: 11,000 Variable nodes

For a server with 11,000 `Variable` nodes, segmented discovery creates:

| Asset | Datasets | Data points per dataset | Total data points |
|-------|----------|----------------------|------------------|
| `opcua-endpoint-0` | 10 | 1,000 each | 10,000 |
| `opcua-endpoint-1` | 1 | 1,000 | 1,000 |

### Segmented discovery example: 25,000 Variable nodes

For a server with 25,000 `Variable` nodes, segmented discovery creates:

| Asset | Datasets | Total data points |
|-------|----------|------------------|
| `opcua-endpoint-0` | 10 | 10,000 |
| `opcua-endpoint-1` | 10 | 10,000 |
| `opcua-endpoint-2` | 5 | 5,000 |

## Start-node discovery

By default, asset discovery browses the entire OPC UA address space starting from the root folder. For large servers with thousands of nodes, this process can be slow and return many irrelevant results.

*Start-node discovery* lets you specify a starting node so that discovery only browses the subtree under that node. This feature is useful when:

- The OPC UA server has a large address space and you only care about a specific section.
- You want faster discovery by limiting the scope.
- You need to target a specific production line, machine, or device subtree.

You can combine start-node discovery with any of the discovery modes: DI-based, type-based, or segmented.

### Start-node formats

The `discoveryStartNode` property accepts two formats:

- Use a standard OPC UA `ExpandedNodeId` string to point directly to a node. For example: `nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=5`

- Use a browse path with namespace-index-qualified segments. The objects folder of the OPC UA address space serves as the start instance. For example: `/4:Boiler/4:BoilerStatus`

    Each segment uses the format `<namespaceIndex>:<browseName>`, separated by `/`. The OPC UA [`TranslateBrowsePathsToNodeIds`](https://reference.opcfoundation.org/Core/Part4/v105/docs/5.9.4) service resolves the path. The browse path syntax follows the [OPC UA specification](https://reference.opcfoundation.org/Core/Part4/v105/docs/A).

    > [!WARNING]
    > Namespace indexes might change when the server restarts. Use the browse path format only when you're certain the indexes are stable.

### Start-node error handling

If the endpoint can't resolve the start node (for example, because of an invalid `NodeId`, unknown namespace, or missing node), it skips asset discovery and logs an error such as:

| Error | Cause |
|-------|-------|
| Start node isn't a valid `ExpandedNodeId` | Malformed `nsu=` or `ns=` string |
| Browse path doesn't resolve to any node | One or more segments in the path don't exist on the server |
| Unknown namespace URI | The server doesn't recognize the namespace in the `ExpandedNodeId` |

## Periodic discovery

Asset discovery browses the OPC UA server's address space to detect assets. On large servers, this process takes a long time. By default, discovery runs only once.

Two properties control periodic discovery:

- `runAssetDiscovery` (boolean, default `false`) enables asset discovery.
- `assetDiscoveryInterval` (integer minutes, default `0`) sets how often discovery repeats.

The following table summarizes the behavior of periodic discovery based on these two properties:

| `runAssetDiscovery` | `assetDiscoveryInterval` | Behavior |
|---------------------|--------------------------|----------|
| `false`             | any                      | Asset discovery doesn't run automatically |
| `true`              | `0` (default)            | Asset discovery runs once |
| `true`              | `> 0`                    | Asset discovery runs once, then repeats every *N* minutes |

> [!NOTE]
> In earlier releases, enabling `runAssetDiscovery` repeated discovery every 10 minutes. The new default (`0`) runs discovery only once. To keep periodic behavior, set `assetDiscoveryInterval` explicitly (for example, `10`).

### Periodic discovery behavior details

Periodic asset discovery in the connector for OPC UA works as follows:

- The first discovery run starts a few seconds after you apply the endpoint configuration.
- When multiple endpoint profiles enable periodic discovery with different intervals, a single timer ticks at the smallest configured interval, and each profile runs at its own configured interval.
- Choose larger intervals for servers with large address spaces to avoid overlapping or long-running discovery cycles.

## Related content

- [Discover and configure OPC UA assets](howto-detect-opc-ua-assets.md)
- [What are Akri services?](overview-akri.md)
- [Understand the connector for OPC UA](overview-opc-ua-connector.md)

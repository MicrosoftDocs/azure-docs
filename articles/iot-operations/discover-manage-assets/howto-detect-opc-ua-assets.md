---
title: OPC UA asset discovery
description: Learn how to automatically discover and configure OPC UA assets at the edge by enabling and tuning the discovery modes of the connector for OPC UA.
author: dominicbetts
ms.subservice: azure-akri
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 07/03/2026
ai-usage: ai-assisted
---

# Discover and configure OPC UA assets

Asset discovery enables Azure IoT Operations to automatically detect the assets connected to an OPC UA server and register them in Azure Device Registry, so you don't have to define each asset manually. In industrial environments that expose many assets, this capability saves time and avoids the configuration errors of setting up assets manually.

This article shows you how to enable asset discovery when you add a device, review and import the discovered assets, and configure the discovery mode that suits your OPC UA server.

For an explanation of the discovery modes and how they behave, see [OPC UA asset discovery modes](concept-opc-ua-asset-discovery.md).

> [!IMPORTANT]
> Type-based discovery is in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

[!INCLUDE [set-environment-variables](../includes/set-environment-variables.md)]

[!INCLUDE [enable-resource-sync-rules](../includes/enable-resource-sync-rules.md)]

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

## Create a device with discovery enabled

To create a device with an OPC UA endpoint that has discovery enabled:

1. Go to your Azure IoT Operations instance in the operations experience.

1. Add a new device and add an OPC UA endpoint.

1. Select the **Run asset discovery** option for the endpoint:

    :::image type="content" source="media/howto-detect-opc-ua-assets/enable-asset-detection.png" alt-text="Screenshot of the operations experience device endpoint form with the Run asset discovery option selected." lightbox="media/howto-detect-opc-ua-assets/enable-asset-detection.png":::

1. Finish creating the device.

By default, the endpoint uses [DI-based discovery](concept-opc-ua-asset-discovery.md#discovery-modes-and-precedence). To use a different mode, follow the steps in [Configure segmented discovery](#configure-segmented-discovery) or use the `assetTypes` property for type-based discovery (preview).

## Review the discovered assets

Azure IoT Operations uses the device to connect to the OPC UA server and scan for assets. To view the discovered assets:

1. Go to the **Discovery** page for your instance in the operations experience and then go to the **Discovered assets** tab:

    :::image type="content" source="media/howto-detect-opc-ua-assets/discovered-assets-list.png" alt-text="Screenshot of the Discovered assets tab on the Discovery page in the operations experience, showing a list of discovered assets and their status." lightbox="media/howto-detect-opc-ua-assets/discovered-assets-list.png":::

1. Filter the list by device name or keyword. The list shows the discovered assets and their status.

## Import an asset from a discovered asset

From the list of discovered assets, you can import an asset into your Azure IoT Operations instance. To import an asset:

1. Select the asset you want to import from the list of discovered assets, and then select **+ Import and create asset**.

1. The operations experience opens the **Asset details** page for the asset, where you can review the asset details and make any changes. Enter a name and description for the discovered asset:

    :::image type="content" source="media/howto-detect-opc-ua-assets/add-asset-details.png" alt-text="Screenshot of the Asset details page in the operations experience with the name and description fields populated for an imported asset." lightbox="media/howto-detect-opc-ua-assets/add-asset-details.png":::

1. Step through the rest of the **Create asset** pages and select the imported data points and events that you want to use:

    :::image type="content" source="media/howto-detect-opc-ua-assets/add-imported-tags.png" alt-text="Screenshot of the Create asset page in the operations experience showing the data points and events selection for an imported asset." lightbox="media/howto-detect-opc-ua-assets/add-imported-tags.png":::

1. The operations experience creates the imported asset in your Azure IoT Operations instance. You can view the asset in the **Assets** page of the operations experience:

    :::image type="content" source="media/howto-detect-opc-ua-assets/provisioned-asset.png" alt-text="Screenshot of the Assets page in the operations experience showing the imported asset in the list." lightbox="media/howto-detect-opc-ua-assets/provisioned-asset.png":::

To learn more about managing asset configurations, see [Manage asset configurations](howto-use-operations-experience.md).

## Review the discovered assets in your cluster (optional)

To review the discovered assets in your cluster, use the `kubectl` command line tool:

```console
kubectl get discoveredassets.namespaces -n azure-iot-operations
```

To view the details of a discovered asset, use the following command:

```console
kubectl describe discoveredasset.namespaces <name> -n azure-iot-operations
```

> [!TIP]
> The previous commands assume that you installed your Azure IoT Operations instance in the default `azure-iot-operations` namespace. If you installed it in a different namespace, replace `azure-iot-operations` with the name of your namespace.

You can also review the discovered assets in your cluster by using the Azure portal. The portal hides discovered asset and device resources by default, but if you select **Show hidden types** in **Manage view**, you can view the discovered asset and device resources in your resource group.

## Use the imported asset in your data flows

After you import a discovered asset, you can use it in your data flows. Imported asset definitions behave the same as manually entered asset definitions. To learn more, see [Create and manage data flows](../connect-to-cloud/howto-create-dataflow.md).

## Configure segmented discovery

Use segmented discovery when the OPC UA server exposes a flat list of `Variable` nodes without DI companion specification types. For details on how segmented discovery chunks nodes and which nodes it includes, see [Segmented discovery](concept-opc-ua-asset-discovery.md#segmented-discovery).

Add the `segmentedDiscovery` property to the endpoint's `additionalConfiguration` in your configuration Bicep file:

```bicep
inbound: {
  'opcua-connector-0': {
    endpointType: 'Microsoft.OpcUa'
    address: 'opc.tcp://my-opcua-server:50000'
    additionalConfiguration: string({
      runAssetDiscovery: true
      segmentedDiscovery: true
    })
  }
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `runAssetDiscovery` | boolean | `false` | Enables the periodic asset discovery loop. |
| `segmentedDiscovery` | boolean | `false` | Selects segmented discovery mode instead of DI-based discovery. |

Set both properties to `true` to enable segmented discovery.

## Configure start-node discovery

Use start-node discovery to limit browsing to a subtree of the OPC UA address space. For the two supported formats and error behavior, see [Start-node discovery](concept-opc-ua-asset-discovery.md#start-node-discovery).

Add the `discoveryStartNode` property to the endpoint's `additionalConfiguration`.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `runAssetDiscovery` | boolean | `false` | Enables the periodic asset discovery loop. |
| `discoveryStartNode` | string | none | The node to start browsing from. Accepts an `ExpandedNodeId` or a browse path. |

To specify the start node by using an `ExpandedNodeId`, add the following to the endpoint's `additionalConfiguration`:

```bicep
inbound: {
  'opcua-connector-0': {
    endpointType: 'Microsoft.OpcUa'
    address: 'opc.tcp://my-opcua-server:50000'
    additionalConfiguration: string({
      runAssetDiscovery: true
      discoveryStartNode: 'nsu=http://microsoft.com/Opc/OpcPlc/Boiler;i=5'
    })
  }
}
```

To specify the start node by using a browse path, add the following to the endpoint's `additionalConfiguration`:

```bicep
inbound: {
  'opcua-connector-0': {
    endpointType: 'Microsoft.OpcUa'
    address: 'opc.tcp://my-opcua-server:50000'
    additionalConfiguration: string({
      runAssetDiscovery: true
      discoveryStartNode: '/4:Boiler/4:BoilerStatus'
    })
  }
}
```

> [!WARNING]
> Namespace indexes might change when the server restarts. Use the browse path format only when you're certain the indexes are stable.

### Combine start-node discovery with a discovery mode

Start-node discovery works with any of the three discovery modes: DI-based discovery (default), type-based discovery (preview), and segmented discovery.

To browse from a start node and detect assets by using the default DI-based discovery, add the following code to the endpoint's `additionalConfiguration`:

```bicep
inbound: {
  'opcua-connector-0': {
    endpointType: 'Microsoft.OpcUa'
    address: 'opc.tcp://my-opcua-server:50000'
    additionalConfiguration: string({
      runAssetDiscovery: true
      discoveryStartNode: 'nsu=http://example.com/UA;s=ProductionLine1'
    })
  }
}
```

To browse from a start node and detect assets by using type-based discovery, add the following code to the endpoint's `additionalConfiguration`:

```bicep
inbound: {
  'opcua-connector-0': {
    endpointType: 'Microsoft.OpcUa'
    address: 'opc.tcp://my-opcua-server:50000'
    additionalConfiguration: string({
      runAssetDiscovery: true
      discoveryStartNode: 'nsu=http://example.com/UA;s=ProductionLine1'
      assetTypes: [
        'nsu=http://opcfoundation.org/UA/MachineTool/;i=16'
      ]
    })
  }
}
```

To browse from a start node and detect assets by using segmented discovery, add the following code to the endpoint's `additionalConfiguration`:

```bicep
inbound: {
  'opcua-connector-0': {
    endpointType: 'Microsoft.OpcUa'
    address: 'opc.tcp://my-opcua-server:50000'
    additionalConfiguration: string({
      runAssetDiscovery: true
      discoveryStartNode: 'nsu=http://example.com/UA;s=ProductionLine1'
      segmentedDiscovery: true
    })
  }
}
```

## Configure periodic discovery

By default, asset discovery runs only once when you apply the endpoint configuration. To repeat discovery on a schedule, set `assetDiscoveryInterval` to the interval in minutes. For how the two properties interact and the behavior of the discovery timer, see [Periodic discovery](concept-opc-ua-asset-discovery.md#periodic-discovery).

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `runAssetDiscovery` | boolean | `false` | Enables the periodic asset discovery loop. |
| `assetDiscoveryInterval` | integer | 0 | The interval in minutes between discovery runs. Omit to run discovery only once. |

To run asset discovery only once, add the following code to the endpoint's `additionalConfiguration`:

```bicep
inbound: {
  'opcua-connector-0': {
    endpointType: 'Microsoft.OpcUa'
    address: 'opc.tcp://my-opcua-server:50000'
    additionalConfiguration: string({
      runAssetDiscovery: true
    })
  }
}
```

To run asset discovery every 30 minutes, add the following code to the endpoint's `additionalConfiguration`:

```bicep
inbound: {
  'opcua-connector-0': {
    endpointType: 'Microsoft.OpcUa'
    address: 'opc.tcp://my-opcua-server:50000'
    additionalConfiguration: string({
      runAssetDiscovery: true
      assetDiscoveryInterval: 30
    })
  }
}
```

## Trigger segmented discovery by using MQTT RPC

To trigger a segmented discovery run on demand, send a `discoverSegmentedAssets` action over MQTT RPC to the connector for OPC UA endpoint-operations service.

Publish the request to the following topic, where `{aioNamespace}` is the Kubernetes namespace where Azure IoT Operations is installed, `{deviceName}` is the name of the device resource, and `{endpointName}` is the name of the OPC UA endpoint on that device:

**Topic:** `{aioNamespace}/endpoint-operations/{deviceName}/{endpointName}/discoverSegmentedAssets`

**Payload:**

```json
{}
```

To scope the discovery to a subtree, include a `discoveryStartNode` in the payload:

```json
{
  "discoveryStartNode": "nsu=http://example.com/UA;s=ProductionLine1"
}
```

**Response:**

```json
{
  "opc_discovered_asset_names": [
    "opcua-endpoint-0",
    "opcua-endpoint-1"
  ]
}
```

## Related content

- [OPC UA asset discovery modes](concept-opc-ua-asset-discovery.md)
- [What are Akri services?](overview-akri.md)
- [Manage asset configurations](howto-use-operations-experience.md)

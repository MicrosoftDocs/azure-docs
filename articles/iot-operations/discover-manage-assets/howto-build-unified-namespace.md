---
title: Build a unified namespace with asset definitions
titleSuffix: Azure IoT Operations
description: Use Azure IoT Operations asset definitions and the built-in MQTT broker to publish data into an ISA-95-aligned unified namespace (UNS) across your organization.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 06/19/2026
ai-usage: ai-assisted

#CustomerIntent: As an industrial IT or OT architect, I want to use Azure IoT Operations asset definitions to publish data into a single, hierarchical MQTT namespace so that every consumer reads operational data from one place.
---

# Build a unified namespace with asset definitions

A _unified namespace_ (UNS) is a single, hierarchical, human-readable view of all operational data in your organization, published on a single message bus. UNS is an industrial architecture and design pattern that lets data consumers subscribe to a canonical topic tree instead of integrating point-to-point with each data producer. A UNS implementation often uses the [ISA-95](https://en.wikipedia.org/wiki/ANSI/ISA-95) hierarchy to organize its topics and asset structure.

Azure IoT Operations gives you the building blocks for a UNS out of the box:

- The built-in MQTT broker is the message bus.
- _Assets_ in Azure Device Registry model each physical or logical thing.
- The MQTT topic on each asset's dataset destination places that data on a branch of the namespace hierarchy.
- Data flows project the topic hierarchy onto downstream messages so analytics consumers can filter and group by site, line, or asset type.

This article describes how to design and implement a UNS by using asset definitions, MQTT topics, and data flows.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

## Prerequisites

[!INCLUDE [prereq-deployed-instance](../includes/prereq-deployed-instance.md)]

[!INCLUDE [prereq-azure-cli](../includes/prereq-azure-cli.md)]

- Familiarity with the asset and device model. See [Assets and devices](concept-assets-devices.md).
- Devices configured for the southbound connectors (such as OPC UA, MQTT, or HTTP/REST) you plan to use. For example, [Configure the connector for OPC UA](howto-configure-opc-ua.md) or [Configure the connector for MQTT](howto-use-mqtt-connector.md).
- An MQTT client to validate the namespace. The validate step uses `mosquitto_sub` from the [Mosquitto](https://mosquitto.org/download/) `mosquitto-clients` package. For alternative options, see [Tips and tools for troubleshooting your Azure IoT Operations instance](../troubleshoot/tips-tools.md).
- An Azure role that allows you to create assets in the Azure IoT Operations namespace, such as **Contributor** on the namespace resource (or a custom role with `Microsoft.DeviceRegistry/namespaces/assets/write`). For role guidance, see [Custom RBAC roles for Azure IoT Operations](../reference/custom-rbac.md).

## Design your namespace hierarchy

Before you create assets, agree on a topic hierarchy. The hierarchy is the contract between OT, IT, and the business units that consume the data. Each level becomes a branch in the MQTT topic tree that a downstream service can subscribe to.

The following example shows a common starting point with the customer's own geography or organization at the top of the hierarchy:

```text
<enterprise>/<site>/<area>/<line>/<asset-type>
```

For example, a manufacturer with a facility in Redmond might lay out part of the namespace as follows. The Contoso enterprise has one site (Redmond) containing one building (`building1`). The building has two production lines: `line1` runs two ovens (`oven-1`, `oven-2`) and one packer (`packer-1`); `line2` runs a single oven (`oven-3`) and a single packer (`packer-2`).

```text
contoso
└── redmond
    └── building1
        ├── line1
        │   ├── ovens
        │   │   ├── oven-1
        │   │   └── oven-2
        │   └── packers
        │       └── packer-1
        └── line2
            ├── ovens
            |   └── oven-3
        │   └── packers
        │       └── packer-2
```

All oven data from line 1 lands under `contoso/redmond/building1/line1/ovens`, regardless of how many ovens are on the line. A consumer that subscribes to `contoso/redmond/building1/line1/ovens/#` sees every oven on that line. A consumer that subscribes to `contoso/+/+/+/ovens/#` sees every oven in the enterprise.

Apply these rules to keep the hierarchy stable:

- Use levels that reflect how OT operators describe the plant, not how connectors or protocols are organized.
- Group similar assets at the same branch so that you can apply the same transformations or queries to all of them.
- Use lowercase, hyphen-separated identifiers (`line-1`, not `Line 1`).
- Keep the hierarchy shallow. Five to seven levels is usually enough.
- Don't put mutable metadata (firmware version, owner, shift) in the topic path. Put it in the payload or in asset properties.
- Separate command topics from telemetry topics. For example, use a sibling `cmd/` branch instead of mixing commands into the telemetry hierarchy.
- Treat the hierarchy as a versioned artifact. Review and store it in source control so that the naming convention doesn't drift.

## Map assets into the hierarchy

Each asset publishes data through one or more datasets. The dataset's MQTT destination determines where the data lands in the namespace. To place an asset on a UNS branch, set the dataset destination topic to the full hierarchical path you want that asset's data to appear under.

The following example shows an OPC UA asset for one oven that publishes its dataset to `contoso/redmond/building1/line1/ovens/oven-1`. The examples assume a device named `opc-ua-connector` with an inbound endpoint named `opc-ua-connector-0`. Adjust the names to match your environment.

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Assets** and then **Create asset**.

1. On the asset details page, select the inbound endpoint for your OPC UA device, then enter an asset name such as `oven-1`.

1. Select **Next** to add a dataset. Enter a dataset name and, in the MQTT topic field for the dataset, enter the UNS path for this asset:

    ```text
    contoso/redmond/building1/line1/ovens/oven-1
    ```

1. Select **Add data point** for each value you want to publish. For each data point, enter a name (for example, `temperature`) and paste the OPC UA node ID (for example, `ns=3;s=FastUInt10`). Repeat for `energy-use` (`ns=3;s=FastUInt100`) and any other values from the asset.

1. Select **Next** to review the asset summary, then select **Create**.

1. Confirm that `oven-1` appears in the **Assets** list with the expected dataset and data point count.

1. Repeat the process for every oven asset, varying the final segment of the topic so that all ovens on line 1 sit under `contoso/redmond/building1/line1/ovens/`.

# [Azure CLI](#tab/cli)

Replace `<RESOURCE_GROUP>` and `<INSTANCE_NAME>` with your own values before you run the commands. The `dataset add` command uses an empty `--data-source` because the OPC UA node IDs are supplied on each datapoint:

```azurecli
# Create the asset
az iot ops ns asset opcua create \
  --name oven-1 \
  --instance <INSTANCE_NAME> \
  -g <RESOURCE_GROUP> \
  --device opc-ua-connector \
  --endpoint opc-ua-connector-0 \
  --description 'Oven 1'

# Add the dataset and point it at the UNS path for this asset
az iot ops ns asset opcua dataset add \
  --asset oven-1 \
  --instance <INSTANCE_NAME> \
  -g <RESOURCE_GROUP> \
  --name oven \
  --data-source "" \
  --dest topic="contoso/redmond/building1/line1/ovens/oven-1" retain=Never qos=Qos1 ttl=3600

# Add data points to the dataset
az iot ops ns asset opcua datapoint add \
  --asset oven-1 \
  --instance <INSTANCE_NAME> \
  -g <RESOURCE_GROUP> \
  --dataset oven \
  --name temperature \
  --data-source "ns=3;s=FastUInt10"

az iot ops ns asset opcua datapoint add \
  --asset oven-1 \
  --instance <INSTANCE_NAME> \
  -g <RESOURCE_GROUP> \
  --dataset oven \
  --name energy-use \
  --data-source "ns=3;s=FastUInt100"
```

Verify the dataset destination by using the `show` command:

```azurecli
az iot ops ns asset opcua dataset show \
  --asset oven-1 \
  --name oven \
  -g <RESOURCE_GROUP> \
  --instance <INSTANCE_NAME>
```

The command returns the dataset, including the destination topic you set:

```output
{
  "name": "oven",
  "destinations": [
    {
      "target": "Mqtt",
      "configuration": {
        "topic": "contoso/redmond/building1/line1/ovens/oven-1",
        "qos": "Qos1",
        "retain": "Never",
        "ttl": 3600
      }
    }
  ]
}
```

To learn more, see [az iot ops ns asset opcua](/cli/azure/iot/ops/ns/asset/opcua).

# [Bicep](#tab/bicep)

The Azure IoT Operations namespace and the custom location must already exist in the target resource group; the snippet references them with `existing`. In the snippet, _namespace_ refers to the `Microsoft.DeviceRegistry/namespaces` resource that contains the asset, not the MQTT topic hierarchy. Optional configuration defaults are omitted for brevity.

1. Save the following snippet as `oven.bicep`. Replace `<AIO_NAMESPACE_NAME>` and `<CUSTOM_LOCATION_NAME>` with your Azure IoT Operations namespace name and custom location name:

    ```bicep
    param aioNamespaceName string = '<AIO_NAMESPACE_NAME>'
    param customLocationName string = '<CUSTOM_LOCATION_NAME>'

    resource namespace 'Microsoft.DeviceRegistry/namespaces@2026-04-01' existing = {
      name: aioNamespaceName
    }

    resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
      name: customLocationName
    }

    resource oven 'Microsoft.DeviceRegistry/namespaces/assets@2026-04-01' = {
      name: 'oven-1'
      parent: namespace
      location: resourceGroup().location
      extendedLocation: {
        type: 'CustomLocation'
        name: customLocation.id
      }
      properties: {
        displayName: 'Oven 1'
        enabled: true
        deviceRef: {
          deviceName: 'opc-ua-connector'
          endpointName: 'opc-ua-connector-0'
        }
        datasets: [
          {
            name: 'oven'
            dataPoints: [
              {
                name: 'temperature'
                dataSource: 'ns=3;s=FastUInt10'
              }
              {
                name: 'energy-use'
                dataSource: 'ns=3;s=FastUInt100'
              }
            ]
            destinations: [
              {
                target: 'Mqtt'
                configuration: {
                  topic: 'contoso/redmond/building1/line1/ovens/oven-1'
                  qos: 'Qos1'
                  retain: 'Never'
                  ttl: 3600 // seconds
                }
              }
            ]
          }
        ]
      }
    }
    ```

    The `ttl` value is in seconds. The `qos`, `retain`, and `ttl` properties on each destination are optional; omit them to use the broker defaults. Use `retain: 'Never'` when consumers always read the live stream; switch to `retain: 'Keep'` if downstream subscribers need the last known value when they connect.

1. Deploy the template to your resource group:

    ```azurecli
    az deployment group create \
      --resource-group <RESOURCE_GROUP> \
      --template-file oven.bicep
    ```

1. Verify the asset was created:

    ```azurecli
    az iot ops ns asset opcua show \
      --name oven-1 \
      -g <RESOURCE_GROUP> \
      --instance <INSTANCE_NAME>
    ```
---

## Bridge existing MQTT topics into the namespace

If you already have data on an external MQTT broker, use the [connector for MQTT](howto-use-mqtt-connector.md) to bridge those topics into your UNS without changing the source systems. The device inbound endpoint uses these two settings:

- **Topic filter** (`topicFilter`) selects which incoming topics to subscribe to. The filter supports the standard MQTT wildcards: `+` (single level) and `#` (multi-level, trailing).
- **Topic mapping prefix** (`topicMappingPrefix`) prepends a default UNS path to the destination of each discovered asset.

> [!IMPORTANT]
> The topic mapping prefix only applies to discovered assets in the operations experience. If you configure your assets using the Azure CLI or a bicep file, the prefix is ignored and you specify the destination topic directly on each dataset.

For example, if the topic mapping prefix is `contoso/redmond/building1/line2` and an incoming message arrives on `packers/packer-3`, the connector creates a discovered asset with the destination topic `contoso/redmond/building1/line2/packers/packer-3`. The bridged topic now sits on the same UNS branch as your natively modeled assets.

In the operations experience, when you create an asset from the discovered MQTT asset, you can accept the default topic or edit it to fit the design. For example, you might want to change `contoso/redmond/building1/line2/packers/packer-3` to `contoso/redmond/building1/line3/packers/packer-3` if you want to group it with an existing packer instead of giving it a unique branch.

## Preserve the hierarchy in downstream payloads

Hierarchical topic paths are useful inside the MQTT broker, but downstream analytics platforms work in columns and rows. When a data flow forwards UNS messages to Event Hubs, Microsoft Fabric, or a data lake, project the topic path and the asset identity onto fields in the outgoing payload. Consumers can then filter, group, and visualize by site, line, or asset type without parsing the topic string.

In a data flow that uses an asset as the source, add a transformation that emits a `siteHierarchy` field from the source topic. For example:

```yaml
operationType: BuiltInTransformation
builtInTransformationSettings:
  map:
    - inputs:
        - '$metadata.topic'
      output: 'siteHierarchy'
```

> [!TIP]
> In the operations experience, use the built-in **Rename** transformation to map `$metadata.topic` to `siteHierarchy` without needing to author a custom mapping.

Because each asset publishes to its own branch (for example, `contoso/redmond/building1/line1/ovens/oven-1`), downstream consumers can derive the asset name from the last segment of the topic. When the messages land in Microsoft Fabric, a KQL query can split `siteHierarchy` into columns for site, building, line, asset type, and asset name, so a data analyst can group readings by line or compare ovens across sites.

To learn more about data flow transformations, see [Map data by using data flows](../connect-to-cloud/concept-dataflow-mapping.md).

## Validate the namespace

To confirm the namespace is populated correctly, use an MQTT client to subscribe to the broker and view the tree:

1. Connect an MQTT client to your Azure IoT Operations broker. For tools and steps, see [Test and troubleshoot connectivity](../troubleshoot/tips-tools.md).

1. Subscribe to `#` to see every published topic, or subscribe to a branch such as `contoso/redmond/+/+/ovens/#` to see only oven data for the Redmond site. The following example uses `mosquitto_sub` against the broker's default TLS listener on port 8883. Replace `<broker-host>` with the broker's hostname or IP address and `<ca.pem>` with the broker's CA certificate. If your deployment exposes a non-TLS listener, drop `--cafile` and use the matching port instead.

    ```bash
    mosquitto_sub -h <broker-host> -p 8883 -t '#' --cafile /var/run/certs/ca.crt
    ```

1. Verify that each asset appears at its expected branch and that no messages arrive on unexpected paths. Unexpected topics usually indicate a misconfigured dataset destination or a topic mapping prefix that doesn't match the design.

A successful subscription returns one message per dataset publish interval, with the topic on the expected branch:

```output
contoso/redmond/building1/line1/ovens/oven-1 {"temperature":182.4,"energy-use":17.3}
contoso/redmond/building1/line1/ovens/oven-2 {"temperature":179.8,"energy-use":16.9}
contoso/redmond/building1/line1/packers/packer-1 {"throughput":42}
```

## Best practices

- Assign a single owner per top-level branch (for example, per site). The owner approves new sub-branches and naming conventions.
- Use one asset per physical thing. Don't reuse a single asset definition to represent multiple physical things, even when they're identical.
- Keep payloads consistent. Use the schema registry to capture each asset's data points so that downstream consumers see the same field names and units across sources. See [Configure OPC UA assets and devices](howto-configure-opc-ua.md) for an example of inferred schemas.

## Related content

- [Assets and devices](concept-assets-devices.md)
- [Configure the connector for OPC UA](howto-configure-opc-ua.md)
- [Configure the connector for MQTT](howto-use-mqtt-connector.md)
- [Configure an MQTT data flow endpoint](../connect-to-cloud/howto-configure-mqtt-endpoint.md)

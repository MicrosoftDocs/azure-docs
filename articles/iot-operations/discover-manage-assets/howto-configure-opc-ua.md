---
title: Configure the connector for OPC UA
description: Use the operations experience, Azure CLI, or Bicep to configure OPC UA devices, assets, datasets, data points, and events.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-opcua-connector
ms.topic: how-to
ms.date: 08/10/2026
ai-usage: ai-assisted

#CustomerIntent: As an OT user, I want to configure my Azure IoT Operations environment so that data can flow from my OPC UA servers through to the MQTT broker.
---

# Configure the connector for OPC UA

_OPC UA servers_ are software applications that communicate with assets. OPC UA servers expose _OPC UA data points_ that represent data points. OPC UA data points provide real-time or historical data about the status, performance, quality, or condition of assets.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

This article describes how to use the operations experience, Azure CLI, and Bicep to:

- Define the devices that connect OPC UA servers to your Azure IoT Operations instance.
- Add assets, and define their data points and events to enable data flow from OPC UA servers to the MQTT broker.

These assets, data points, and events map inbound data from OPC UA servers to friendly names that you can use in the MQTT broker and data flows.

For endpoint session modes and connector redundancy, see [Configure OPC UA sessions and high availability](howto-configure-opc-ua-sessions-high-availability.md). For dynamic node resolution, key frames, and event filters, see [Configure advanced OPC UA data collection](howto-configure-opc-ua-advanced-data-collection.md).

The connector can use `anonymous`, `username password`, or `X.509certificate` user authentication when it connects to an OPC UA server.

> [!NOTE]
> This user authentication is separate from the certificate-based application authentication that's used to establish a secure channel between the connector for OPC UA and the OPC UA server. To learn more, see [Understand the OPC UA certificates infrastructure](overview-opc-ua-connector-certificates-management.md).

## Prerequisites

[!INCLUDE [prereq-deployed-instance](../includes/prereq-deployed-instance.md)]

[!INCLUDE [prereq-azure-cli](../includes/prereq-azure-cli.md)]

- The connector for OPC UA is enabled on your Azure IoT Operations instance.

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

- Your IT administrator configures the OPC UA connector template for your Azure IoT Operations instance in the Azure portal or by using the Azure CLI.
- An OPC UA server that you can reach from your Azure IoT Operations cluster. If you don't have an OPC UA server, use the OPC PLC simulator from the Azure IoT Operations samples repository.

## Create a device

An Azure IoT Operations deployment can include a sample OPC PLC simulator. To create a device that uses the OPC PLC simulator:

# [Operations experience](#tab/portal)

1. Select **devices** and then **Create device**:

    :::image type="content" source="media/howto-configure-opc-ua/devices.png" alt-text="Screenshot that shows the devices page in the operations experience." lightbox="media/howto-configure-opc-ua/devices.png":::

    > [!TIP]
    > Use the filter box to search for devices.

1. On the **Basics** page, enter a device name and select **New** on the **Microsoft.OpcUa** tile to add an endpoint for the device:

    :::image type="content" source="media/howto-configure-opc-ua/device-details.png" alt-text="Screenshot that shows how to create a device in the operations experience." lightbox="media/howto-configure-opc-ua/device-details.png":::

1. Enter your endpoint information. For example, to use the OPC PLC simulator, enter the following values:

    | Field | Value |
    | --- | --- |
    | Name | `opc-ua-connector-0` |
    | Connector for OPC UA URL | `opc.tcp://opcplc-000000:50000` |
    | User authentication | `Anonymous` |

1. Select **Next**. On the **Additional Info** page enter any custom properties for the device.

1. Select **Next** to review your device details. Then select **Create**.

# [Azure CLI](#tab/cli)

Run the following commands:

```azurecli
az iot ops ns device create \
  -n opc-ua-connector-cli \
  -g {your resource group name} \
  --instance {your instance name}

az iot ops ns device endpoint inbound add opcua \
  --device opc-ua-connector-cli \
  -g {your resource group name} \
  -i {your instance name} \
  --name opc-ua-connector-0 \
  --endpoint-address "opc.tcp://opcplc-000000:50000"
```

To learn more, see [az iot ops ns device](/cli/azure/iot/ops/ns/device).

# [Bicep](#tab/bicep)

Deploy the following Bicep template to create a device with an inbound endpoint for the OPC UA connector. Replace the placeholders `<AIO_NAMESPACE_NAME>` and `<CUSTOM_LOCATION_NAME>` with your Azure IoT Operations namespace name and custom location name respectively:

```bicep
param deviceRegistryNamespaceName string = '<AIO_NAMESPACE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource deviceRegistryNamespace 'Microsoft.DeviceRegistry/namespaces@2026-04-01' existing = {
  name: deviceRegistryNamespaceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource device 'Microsoft.DeviceRegistry/namespaces/devices@2026-04-01' = {
  name: 'opc-ua-connector-bicep'
  parent: deviceRegistryNamespace
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    endpoints: {
      outbound: {
        assigned: {}
      }
      inbound: {
        'opc-ua-connector-0': {
          endpointType: 'Microsoft.OpcUa'
          address: 'opc.tcp://opcplc-000000:50000'
          authentication: {
            method: 'Anonymous'
          }
        }
      }
    }
  }
}
```

---

This configuration deploys a new `device` resource called `opc-ua-connector-bicep` to the cluster with an inbound endpoint called `opc-ua-connector-0`.

When the OPC PLC simulator is running, data flows from the simulator, to the connector for OPC UA, and then to the MQTT broker.

### Configure a device to use a username and password

The previous example uses the `Anonymous` authentication mode. This mode doesn't require a username or password.

To use the `UsernamePassword` authentication mode, complete the following steps:

# [Operations experience](#tab/portal)

[!INCLUDE [connector-username-password-portal](../includes/connector-username-password-portal.md)]

# [Azure CLI](#tab/cli)

[!INCLUDE [connector-username-password-cli](../includes/connector-username-password-cli.md)]

# [Bicep](#tab/bicep)

[!INCLUDE [connector-username-password-bicep](../includes/connector-username-password-bicep.md)]

---

### Configure a device to use an X.509 certificate

# [Operations experience](#tab/portal)

[!INCLUDE [connector-certificate-user-portal](../includes/connector-certificate-user-portal.md)]

# [Azure CLI](#tab/cli)

[!INCLUDE [connector-certificate-user-cli](../includes/connector-certificate-user-cli.md)]

# [Bicep](#tab/bicep)

[!INCLUDE [connector-certificate-user-bicep](../includes/connector-certificate-user-bicep.md)]

---

### Other security options

When you create the inbound endpoint, you can also select:

| Option | Type | Description |
| ------ | ---- | ----------- |
| **Auto accept untrusted server certificate** | Yes/No | Automatically accept untrusted server certificates |
| **Security policy** | Dropdown | Security policy used to establish secure channel with the OPC UA server |
| **Security mode** | Dropdown | Security mode used to communicate within secure channel with the OPC UA server |

## Add an asset, dataset, and data points

# [Operations experience](#tab/portal)

To add an asset in the operations experience, follow these steps:

1. Select the **Assets** tab. Before you create any assets, you see the following screen:

    :::image type="content" source="media/howto-configure-opc-ua/create-asset-empty.png" alt-text="Screenshot that shows an empty Assets tab in the operations experience." lightbox="media/howto-configure-opc-ua/create-asset-empty.png":::

    > [!TIP]
    > Use the filter box to search for assets.

1. Select **Create asset**.

1. On the asset details screen, enter the following asset information:

    - Inbound endpoint. Select your device inbound endpoint from the list.
    - Asset name
    - Description

1. Configure the set of custom properties that you want to associate with the asset. You can accept the default list of properties or add your own. The following properties are available by default:

    - Manufacturer
    - Manufacturer URI
    - Model
    - Product code
    - Hardware version
    - Software version
    - Serial number
    - Documentation URI

    :::image type="content" source="media/howto-configure-opc-ua/create-asset-details.png" alt-text="Screenshot that shows how to add asset details in the operations experience." lightbox="media/howto-configure-opc-ua/create-asset-details.png":::

1. Select **Next** to go to the **Datasets** page.

### Add a dataset to an asset

A dataset defines where the connector sends the data it collects from a collection of data points. An OPC UA asset can have multiple datasets. To create a dataset:

1. Select **Create dataset**.

1. Enter the details for the dataset such as its name and destination. For OPC UA assets, the destination is an MQTT topic. For example:

    :::image type="content" source="media/howto-configure-opc-ua/create-dataset.png" alt-text="Screenshot that shows how to create a dataset in the operations experience." lightbox="media/howto-configure-opc-ua/create-dataset.png":::

    Use the **Start instance** field to specify the starting node for resolving relative browse paths for data points in the dataset. For more information, see [Resolve dynamic nodes by using browse paths](howto-configure-opc-ua-advanced-data-collection.md#resolve-dynamic-nodes-by-using-browse-paths).

1. Select **Create and next** to create the dataset.

> [!TIP]
> Use the **Manage default settings** option to configure default dataset settings such as publishing interval, sampling interval, and queue size.

### Add individual data points to a dataset

> [!IMPORTANT]
> The data point name `_ErrorMessage` is reserved and shouldn't be used.

Now you can define the data points associated with the dataset. To add OPC UA data points:

1. Select **Add data point**.

1. Enter your data point details:

      - Data source. This value is the node ID from the OPC UA server.
      - Data point name (Optional). This value is the friendly name that you want to use for the data point. If you don't specify a data point name, the node ID is used as the data point name.
      - Sampling interval (milliseconds). You can override the default value for this data point.
      - Queue size. You can override the default value for this data point.
      - Key frame count. By default, key frames are disabled. Use this setting to enable key frames and specify how frequently the connector generates key frames. For more information, see [Configure key frames for state recovery](howto-configure-opc-ua-advanced-data-collection.md#configure-key-frames-for-state-recovery).

    :::image type="content" source="media/howto-configure-opc-ua/add-data-point.png" alt-text="Screenshot that shows adding data points in the operations experience." lightbox="media/howto-configure-opc-ua/add-data-point.png":::

    The following table shows some example data point values that you can use with the built-in OPC PLC simulator:

    | Data source | Data point name |
    | ------- | -------- |
    | ns=3;s=FastUInt10 | Temperature |
    | ns=3;s=FastUInt100 | Humidity |

    > [!NOTE]
    > If you're using relative browse paths to resolve dynamic nodes, the **Data source** field contains a relative browse path. For more information, see [Resolve dynamic nodes by using browse paths](howto-configure-opc-ua-advanced-data-collection.md#resolve-dynamic-nodes-by-using-browse-paths).

1. On the **data points** page, select **Next** to go to the **Add events** page.

# [Azure CLI](#tab/cli)

Use the following commands to add a thermostat asset to your device by using the Azure CLI. The commands add a dataset and two data points to the asset by using the `datapoint add` command:

```azurecli
# Create the asset
az iot ops ns asset opcua create \
  --name thermostat \
  --instance {your instance name} \
  -g {your resource group name} \
  --device opc-ua-connector-cli \
  --endpoint opc-ua-connector-0 \
  --description 'A simulated thermostat asset'

# Add the dataset
az iot ops ns asset opcua dataset add \
  --asset thermostat \
  --instance {your instance name} \
  -g {your resource group name} \
  --name oven \
  --data-source "" \
  --dest topic="azure-iot-operations/data/thermostat" retain=Never qos=Qos1 ttl=3600

# Add the data points
az iot ops ns asset opcua datapoint add \
  --asset thermostat \
  --instance {your instance name} \
  -g {your resource group name} \
  --dataset oven \
  --name temperature \
  --data-source "ns=3;s=FastUInt10"

az iot ops ns asset opcua datapoint add \
  --asset thermostat \
  --instance {your instance name} \
  -g {your resource group name} \
  --dataset oven \
  --name humidity \
  --data-source "ns=3;s=FastUInt100"

# Show the dataset and datapoints
az iot ops ns asset opcua dataset show \
  --asset thermostat \
  -n oven \
  -g {your resource group name} \
  --instance {your instance name}
```

When you create an asset by using the Azure CLI, you can define:

- Multiple data points by using the `datapoint add` command multiple times.
- Multiple event groups and events by using the `event-group add` and `event add` commands.
- Optional information for the asset such as:
  - Manufacturer
  - Manufacturer URI
  - Model
  - Product code
  - Hardware version
  - Software version
  - Serial number
  - Documentation URI
- Dataset values for sampling interval, publishing interval, key frame count, and queue size.
- Data point specific values for sampling interval, publishing interval, and queue size.
- Event-specific values for sampling interval and queue size.
- The observability mode for each data point and event

# [Bicep](#tab/bicep)

Deploy the following Bicep template to create an asset that publishes messages from the device shown previously to an MQTT topic. Replace the placeholders `<AIO_NAMESPACE_NAME>` and `<CUSTOM_LOCATION_NAME>` with your Azure IoT Operations namespace name and custom location name respectively:

```bicep
param deviceRegistryNamespaceName string = '<AIO_NAMESPACE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource deviceRegistryNamespace 'Microsoft.DeviceRegistry/namespaces@2026-04-01' existing = {
  name: deviceRegistryNamespaceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource asset 'Microsoft.DeviceRegistry/namespaces/assets@2026-04-01' = {
  name: 'thermostat'
  parent: deviceRegistryNamespace
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    displayName: 'thermostat'
    description: 'A simulated thermostat asset'
    enabled: true

    deviceRef: {
      deviceName: 'opc-ua-connector-bicep'
      endpointName: 'opc-ua-connector-0'
    }

    defaultDatasetsConfiguration: '{}'
    defaultEventsConfiguration: '{}'

    datasets: [
      {
        name: 'oven'
        datasetConfiguration: '{}'
        dataPoints: [
          {
            name: 'temperature'
            dataSource: 'ns=3;s=FastUInt10'
            dataPointConfiguration: '{}'
          }
          {
            name: 'humidity'
            dataSource: 'ns=3;s=FastUInt100'
            dataPointConfiguration: '{}'
          }
        ]
        destinations: [
          {
            target: 'Mqtt'
            configuration: {
              topic: 'azure-iot-operations/data/thermostat'
              qos: 'Qos1'
              retain: 'Never'
              ttl: 3600
            }
          }
        ]
      }
    ]
  }
}
```

---

## Configure dataset triggering

Starting with Azure IoT Operations 2607, you can configure one data point to trigger publication of the other sampled data points in the same dataset. Dataset triggering is supported only for assets that reference a namespaced device endpoint. To learn about reporting modes, requirements, and fallback behavior, see [Control dataset publishing with a triggering item](overview-opc-ua-connector.md#).

The following examples configure a `telemetry` dataset with `dataPoint-SlowUInt1` as the triggering item. The default `Sampling` reporting mode means that the trigger controls publication but its own value isn't included in the published output.

# [Operations experience](#tab/portal)

1. In the operations experience, select **Assets**, and then open or create the `my-triggered-asset` asset. Select the `opc-ua-connector-0` inbound endpoint on the namespaced device that you created previously.

1. On the **Datasets** page, select or create the `telemetry` dataset. Set the destination topic to `azure-iot-operations/data/my-triggered-asset`, the publishing interval to `1000` milliseconds, and the sampling interval to `500` milliseconds.

1. Add the following data points to the dataset. Data point names are case-sensitive.

    | Data point name | Data source |
    | --- | --- |
    | `dataPoint-SlowUInt1` | `nsu=http://microsoft.com/Opc/OpcPlc/;s=SlowUInt1` |
    | `dataPoint-FastUInt1` | `nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt1` |
    | `dataPoint-FastUInt2` | `nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt2` |

1. In the dataset settings, set **Triggering item** to `dataPoint-SlowUInt1` and **Triggering item reporting mode** to **Sampling**.

    :::image type="content" source="media/howto-configure-opc-ua/triggering-item-configuration.png" alt-text="Screenshot of Azure IoT Operations dataset settings with dataPoint-SlowUInt1 as the triggering item and Sampling as the reporting mode." lightbox="media/howto-configure-opc-ua/triggering-item-configuration.png":::

1. Save the asset configuration.

# [Azure CLI](#tab/cli)

Azure CLI doesn't currently support setting `triggeringItem` or `triggeringItemReportingMode`. Use the operations experience or Bicep to configure dataset triggering. Don't use a generic asset update command to modify these connector-specific dataset properties.

# [Bicep](#tab/bicep)

Deploy the following Bicep template to create a namespaced asset with dataset triggering. Replace `<IOT_OPERATIONS_NAMESPACE_NAME>` and `<CUSTOM_LOCATION_NAME>` with your Azure IoT Operations namespace and custom location names:

```bicep
param iotOperationsNamespaceName string = '<IOT_OPERATIONS_NAMESPACE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource iotOperationsNamespace 'Microsoft.DeviceRegistry/namespaces@2026-04-01' existing = {
  name: iotOperationsNamespaceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource asset 'Microsoft.DeviceRegistry/namespaces/assets@2026-04-01' = {
  name: 'my-triggered-asset'
  parent: iotOperationsNamespace
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    displayName: 'my-triggered-asset'
    enabled: true
    deviceRef: {
      deviceName: 'opc-ua-connector-bicep'
      endpointName: 'opc-ua-connector-0'
    }
    defaultDatasetsConfiguration: '{}'
    defaultEventsConfiguration: '{}'
    datasets: [
      {
        name: 'telemetry'
        datasetConfiguration: '{"publishingInterval":1000,"samplingInterval":500,"triggeringItem":"dataPoint-SlowUInt1","triggeringItemReportingMode":"Sampling"}'
        dataPoints: [
          {
            name: 'dataPoint-SlowUInt1'
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/;s=SlowUInt1'
            dataPointConfiguration: '{}'
          }
          {
            name: 'dataPoint-FastUInt1'
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt1'
            dataPointConfiguration: '{}'
          }
          {
            name: 'dataPoint-FastUInt2'
            dataSource: 'nsu=http://microsoft.com/Opc/OpcPlc/;s=FastUInt2'
            dataPointConfiguration: '{}'
          }
        ]
        destinations: [
          {
            target: 'Mqtt'
            configuration: {
              topic: 'azure-iot-operations/data/my-triggered-asset'
              qos: 'Qos1'
              retain: 'Never'
              ttl: 3600
            }
          }
        ]
      }
    ]
  }
}
```

---

To include the triggering data point in the published output, change `triggeringItemReportingMode` to `Reporting`. The `triggeringItem` value is case-sensitive and must match exactly one data point name in the same dataset.

### Verify dataset triggering

1. Subscribe to the dataset's destination MQTT topic. For an example, see [Connector for OPC UA message format](overview-opc-ua-connector.md#connector-for-opc-ua-message-format).

1. Change either `dataPoint-FastUInt1` or `dataPoint-FastUInt2` without changing `dataPoint-SlowUInt1`. Verify that the connector samples the changed value but doesn't publish the dataset.

1. Change `dataPoint-SlowUInt1`. Verify that the connector publishes the sampled fast data point values together.

1. Review the asset status for trigger validation errors. If the status reports an error, inspect the connector logs. For information about viewing pod logs, see [`kubectl`](../troubleshoot/tips-tools.md#kubectl).

### Troubleshoot dataset triggering

| Symptom | Resolution |
| --- | --- |
| The dataset publishes on every value change. | Verify that `triggeringItem` is in the dataset's own `datasetConfiguration` and exactly matches one data point name. Check the connector logs for validation or trigger-link errors. |
| Triggering is unexpectedly disabled. | Check the asset status for an `Unprocessable telemetry.TriggeringItem` error. Verify that the trigger name has exactly one match and that the dataset doesn't exceed `subscription.maxItems`. |
| The triggering data point is missing from the output. | Set `triggeringItemReportingMode` to `Reporting`. In the default `Sampling` mode, the trigger controls publication but doesn't report its own value. |

## Add events and event groups

# [Operations experience](#tab/portal)

### Add an event group to an asset

An event group defines where the connector sends the data it receives from a collection of events. An OPC UA asset can have multiple event groups. To create an event group:

1. Select **Create event group**.

1. Enter a name for the event group and any other required details:

    :::image type="content" source="media/howto-configure-opc-ua/create-event-group.png" alt-text="Screenshot that shows how to create an event group in the operations experience." lightbox="media/howto-configure-opc-ua/create-event-group.png":::

1. Select **Create and next** to create the event group and go to the **List of events for alerts** page.

### Add events to an event group

Now you can define the events associated with the event group. To add OPC UA events:

1. Select **Add event**.

1. Enter your event details:

      - Data source. This value is the event notifier from the OPC UA server.
      - Event name (Optional). This value is the friendly name that you want to use for the event. If you don't specify an event name, the event notifier is used as the event name.
      - Topic. The MQTT topic that you want the event to be published to.
      - Sampling interval (milliseconds). You can override the default value for this event.
      - Queue size. You can override the default value for this event.
      - Start instance. This value is the starting node for resolving relative browse paths for this event. This field is required if you use relative browse paths in the Data source field. For more information, see [Resolve dynamic nodes by using browse paths](howto-configure-opc-ua-advanced-data-collection.md#resolve-dynamic-nodes-by-using-browse-paths).
      - Event filter. An optional configuration that selects and renames fields in the event notification. For more information, see [Select and rename event fields](howto-configure-opc-ua-advanced-data-collection.md#select-and-rename-event-fields).

    :::image type="content" source="media/howto-configure-opc-ua/add-event.png" alt-text="Screenshot that shows adding events in the operations experience." lightbox="media/howto-configure-opc-ua/add-event.png":::

1. Select **Manage default settings** to configure default event settings for the asset. These settings apply to all the OPC UA events that belong to the asset. You can override these settings for each event that you add. Default event settings include:

    - **Publishing interval (milliseconds)**: The rate at which OPC UA server should publish data.
    - **Queue size**: The depth of the queue to hold the sampling data before publishing it.

# [Azure CLI](#tab/cli)

To add an event group and events to an existing asset, use the `az iot ops ns asset opcua event-group` and `az iot ops ns asset opcua event` commands:

```azurecli
# Add an event group to the thermostat asset
az iot ops ns asset opcua event-group add \
  --data-source "" \
  --asset thermostat \
  --instance {your instance name} \
  -g {your resource group name} \
  --name alerts \
  --dest topic="azure-iot-operations/events/test-thermostat-cli" retain=Never qos=Qos1 ttl=3600

# Add an event to the event group
az iot ops ns asset opcua event add \
  --asset thermostat \
  --instance {your instance name} \
  -g {your resource group name} \
  --event-group alerts \
  --name serverObjectNotifier \
  --data-source "ns=0;i=2253"

# List the event groups for the asset
az iot ops ns asset opcua event-group list \
  --asset thermostat \
  --instance {your instance name} \
  -g {your resource group name}
```

When you add an event group by using the Azure CLI, you can configure:

- Event group name and data source
- Publishing interval and queue size
- Event destinations (MQTT topic, QoS, retain, TTL)

To add individual events to an event group, use the `az iot ops ns asset opcua event add` command with the `--event-group` parameter.

To remove an event group, use the `az iot ops ns asset opcua event-group remove` command.

# [Bicep](#tab/bicep)

To add events and event groups to an asset by using Bicep, include the `eventGroups` array in the asset properties. Each event group can contain an `events` array with individual events:

```bicep
eventGroups: [
  {
    name: 'alerts'
    eventGroupConfiguration: '{"publishingInterval":1000,"queueSize":10}'
    events: [
      {
        name: 'serverObjectNotifier'
        dataSource: 'ns=0;i=2253'
        eventConfiguration: '{}'
        destinations: [
          {
            target: 'Mqtt'
            configuration: {
              topic: 'azure-iot-operations/events/test-thermostat-bicep'
              qos: 'Qos1'
              retain: 'Never'
              ttl: 3600
            }
          }
        ]
      }
    ]
  }
]
```

The `eventGroupConfiguration` property is a stringified JSON object that can include connector-specific settings such as `publishingInterval` and `queueSize`. Individual events use the `eventConfiguration` property for event-specific settings including per-event `destinations`.

---

### Review your changes

# [Operations experience](#tab/portal)

Review your asset and OPC UA data point and event details. Make any adjustments you need:

:::image type="content" source="media/howto-configure-opc-ua/review-asset.png" alt-text="A screenshot that shows how to review your asset, data points, and events in the operations experience." lightbox="media/howto-configure-opc-ua/review-asset.png":::

# [Azure CLI](#tab/cli)

To review your asset configuration, use the following commands:

```azurecli
# View the complete asset details
az iot ops ns asset show \
  --name thermostat \
  --instance {your instance name} \
  -g {your resource group name}

# List datasets and data points
az iot ops ns asset opcua dataset list \
  --asset thermostat \
  --instance {your instance name} \
  -g {your resource group name}

# List event groups
az iot ops ns asset opcua event-group list \
  --asset thermostat \
  --instance {your instance name} \
  -g {your resource group name}
```

# [Bicep](#tab/bicep)

To review your Bicep template before deployment, use the `what-if` operation:

```azurecli
az deployment group what-if --resource-group {your resource group name} --template-file asset.bicep
```

This command shows you what changes would be made to your Azure resources without actually deploying them.

---

## Add management groups and actions

A management group is a logical grouping of actions that you can invoke against an OPC UA asset, such as writing a value to a tag or calling a method. Actions must belong to a management group.

To create a management group and define actions for it, see [Control OPC UA servers](howto-control-opc-ua.md). That article explains the different types of actions (simple writes, complex writes, and method calls) and the MQTT topics you use to invoke them.

## Update an asset

# [Operations experience](#tab/portal)

Find and select the asset you created previously. Use the **Asset details**, **data points**, and **Events** tabs to make any changes:

:::image type="content" source="media/howto-configure-opc-ua/asset-update-property-save.png" alt-text="A screenshot that shows how to update an existing asset in the operations experience." lightbox="media/howto-configure-opc-ua/asset-update-property-save.png":::

On the **view data points** tab for a dataset, you can add data points, update existing data points, or remove data points.

To update a data point, select an existing data point and update the data point information. Then select **Update**:

:::image type="content" source="media/howto-configure-opc-ua/asset-update-data-point.png" alt-text="A screenshot that shows how to update an existing data point in the operations experience." lightbox="media/howto-configure-opc-ua/asset-update-data-point.png":::

To remove data points, select one or more data points and then select **Remove data points**:

:::image type="content" source="media/howto-configure-opc-ua/asset-remove-data-points.png" alt-text="A screenshot that shows how to delete a data point in the operations experience." lightbox="media/howto-configure-opc-ua/asset-remove-data-points.png":::

You can also add, update, and delete events and properties in the same way.

When you're finished making changes, select **Save** to save your changes.

# [Azure CLI](#tab/cli)

To list your assets associated with a specific endpoint, use the following command:

```azurecli
az iot ops ns asset query \
  --device {your device name} \
  --endpoint {your endpoint name} \
  -g {your resource group name} \
  --instance {your instance name}
```

> [!TIP]
> You can refine the query command to search for assets that match specific criteria. For example, you can search for assets by manufacturer.

To view the details of the thermostat asset, use the following command:

```azurecli
az iot ops ns asset show \
  --name thermostat \
  --instance {your instance name} \
  -g {your resource group}
```

To update an asset, use the `az iot ops ns asset opcua update` command. For example, to update the asset's description, use a command like the following example:

```azurecli
az iot ops ns asset opcua update \
  --name thermostat \
  --instance {your instance name} \
  -g {your resource group} \
  --description "Updated factory PLC"
```

To list the thermostat asset's data points in a dataset, use the following command:

```azurecli
az iot ops ns asset opcua dataset show \
  --asset thermostat \
  --name oven \
  -g {your resource group} \
  --instance {your instance name}
```

To list the thermostat asset's event groups, use the following command:

```azurecli
az iot ops ns asset opcua event-group list \
  --asset thermostat \
  -g {your resource group} \
  --instance {your instance name}
```

To add a new data point to the thermostat asset, use a command like the following example:

```azurecli
az iot ops ns asset opcua datapoint add \
  --asset thermostat \
  --instance {your instance name} \
  -g {your resource group name} \
  --dataset oven \
  --name humidity \
  --data-source "ns=3;s=FastUInt100"
```

To delete a data point, use the `az iot ops ns asset opcua datapoint remove` command.

You can manage an asset's event groups by using the `az iot ops ns asset opcua event-group` commands.

# [Bicep](#tab/bicep)

To retrieve an asset by using Bicep, use a template like the following example:

```bicep
param deviceRegistryNamespaceName string = '<AIO_NAMESPACE_NAME>'

resource deviceRegistryNamespace 'Microsoft.DeviceRegistry/namespaces@2026-04-01' existing = {
  name: deviceRegistryNamespaceName
}

resource asset 'Microsoft.DeviceRegistry/namespaces/assets@2026-04-01' existing = {
  name: 'thermostat'
  parent: deviceRegistryNamespace
}

output asset object = asset
```

To update an existing asset, for example to modify the description and add a data point, use a template like the following example:

```bicep
param deviceRegistryNamespaceName string = '<AIO_NAMESPACE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource deviceRegistryNamespace 'Microsoft.DeviceRegistry/namespaces@2026-04-01' existing = {
  name: deviceRegistryNamespaceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource asset 'Microsoft.DeviceRegistry/namespaces/assets@2026-04-01' = {
  name: 'thermostat'
  parent: deviceRegistryNamespace
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    displayName: 'thermostat'
    description: 'Updated thermostat asset with voltage data point'
    enabled: true

    deviceRef: {
      deviceName: 'opc-ua-connector-bicep'
      endpointName: 'opc-ua-connector-0'
    }

    defaultDatasetsConfiguration: '{}'
    defaultEventsConfiguration: '{}'

    datasets: [
      {
        name: 'oven'
        datasetConfiguration: '{}'
        dataPoints: [
          {
            name: 'temperature'
            dataSource: 'ns=3;s=FastUInt10'
            dataPointConfiguration: '{}'
          }
          {
            name: 'humidity'
            dataSource: 'ns=3;s=FastUInt100'
            dataPointConfiguration: '{}'
          }
          {
            name: 'voltage'
            dataSource: 'ns=3;s=FastUInt101'
            dataPointConfiguration: '{}'
          }
        ]
        destinations: [
          {
            target: 'Mqtt'
            configuration: {
              topic: 'azure-iot-operations/data/thermostat'
              qos: 'Qos1'
              retain: 'Never'
              ttl: 3600
            }
          }
        ]
      }
    ]
  }
}
```

---

## Delete an asset

# [Operations experience](#tab/portal)

To delete an asset, select the asset you want to delete. On the **Asset** details page, select **Delete**. Confirm your changes to delete the asset:

:::image type="content" source="media/howto-configure-opc-ua/asset-delete.png" alt-text="A screenshot that shows how to delete an asset from the operations experience." lightbox="media/howto-configure-opc-ua/asset-delete.png":::

# [Azure CLI](#tab/cli)

To delete an asset, use a command that looks like the following example:

```azurecli
az iot ops ns asset delete \
  --name thermostat \
  -g {your resource group name} \
  --instance {your instance name}
```

# [Bicep](#tab/bicep)

To delete individual resources by using Bicep, see [Deployment stacks](/azure/azure-resource-manager/bicep/quickstart-create-deployment-stacks).

---


## Configure advanced endpoint behavior

By default, each asset opens a dedicated OPC UA session. You can configure assets to share an endpoint session and enable active and passive connector instances for high availability. To compare these modes and configure endpoint behavior, see [Configure OPC UA sessions and high availability](howto-configure-opc-ua-sessions-high-availability.md).

Each inbound endpoint can also monitor whether its OPC UA server is alive. Server heartbeat monitoring is enabled by default and reports the endpoint's health from a dedicated monitoring session. To learn how it works and how to enable or disable it per endpoint, see [Monitor OPC UA server availability with heartbeat monitoring](concept-opc-ua-server-heartbeat-monitoring.md).

## Related content

- [Manage asset and device configurations](howto-use-operations-experience.md)
- [Control OPC UA servers](howto-control-opc-ua.md)
- [Connector for OPC UA overview](overview-opc-ua-connector.md)
- [Configure OPC UA sessions and high availability](howto-configure-opc-ua-sessions-high-availability.md)
- [Configure advanced OPC UA data collection](howto-configure-opc-ua-advanced-data-collection.md)
- [az iot ops ns asset](/cli/azure/iot/ops/ns/asset)
- [az iot ops ns device](/cli/azure/iot/ops/ns/device)

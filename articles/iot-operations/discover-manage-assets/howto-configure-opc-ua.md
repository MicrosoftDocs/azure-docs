---
title: How to use the connector for OPC UA
description: Use the operations experience web UI or the Azure CLI to configure assets and devices for OPC UA connections.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 12/09/2025


#CustomerIntent: As an OT user, I want configure my Azure IoT Operations environment so that data can flow from my OPC UA servers through to the MQTT broker.
---

# Configure the connector for OPC UA

_OPC UA servers_ are software applications that communicate with assets. OPC UA servers expose _OPC UA data points_ that represent data points. OPC UA data points provide real-time or historical data about the status, performance, quality, or condition of assets.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

This article describes how to use the operations experience web UI and the Azure CLI to:

- Define the devices that connect OPC UA servers to your Azure IoT Operations instance.
- Add assets, and define their data points and events to enable data flow from OPC UA servers to the MQTT broker.

These assets, data points, and events map inbound data from OPC UA servers to friendly names that you can use in the MQTT broker and data flows.

The connector can use `anonymous` or `username password` user authentication when it connects to an OPC UA server.

> [!NOTE]
> This user authentication is separate from the certificate-based application authentication that's used to establish a secure channel between the connector for OPC UA and the OPC UA server. To learn more, see [Understand the OPC UA certificates infrastructure](overview-opc-ua-connector-certificates-management.md).

## Prerequisites

To configure devices and assets, you need an instance of Azure IoT Operations.

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

Your IT administrator must configure the OPC UA connector template for your Azure IoT Operations instance in the Azure portal.

An OPC UA server that you can reach from your Azure IoT Operations cluster. If you don't have an OPC UA server, use the OPC PLC simulator from the Azure IoT Operations samples repository.

## Configure a certificate trust list for the connector

[!INCLUDE [connector-certificate-application](../includes/connector-certificate-application.md)]

## Create a device

An Azure IoT Operations deployment can include a sample OPC PLC simulator. To create a device that uses the OPC PLC simulator:

# [Operations experience](#tab/portal)

1. Select **devices** and then **Create device**:

    :::image type="content" source="media/howto-configure-opc-ua/devices.png" alt-text="Screenshot that shows the devices page in the operations experience." lightbox="media/howto-configure-opc-ua/devices.png":::

    > [!TIP]
    > Use the filter box to search for devices.

1. On the **Basics** page, enter a device name and select **New** on the **Microsoft.OpcUa** tile to add an endpoint for the device:

    :::image type="content" source="media/howto-configure-opc-ua/device-details.png" alt-text="Screenshot that shows how to create a device in the operations experience." lightbox="media/howto-configure-opc-ua/device-details.png":::

1. Enter  your endpoint information. For example, to use the OPC PLC simulator, enter the following values:

    | Field | Value |
    | --- | --- |
    | Name | `opc-ua-connector-0` |
    | Connector for OPC UA URL | `opc.tcp://opcplc-000000:50000` |
    | User authentication | `Anonymous` |

1. Select **Next** and on the **Additional Info** page, enter any custom properties for the device.

1. Select **Next** to review your device details. Then select **Create**.

# [Azure CLI](#tab/cli)

Run the following commands:

```azurecli
az iot ops ns device create -n opc-ua-connector-cli -g {your resource group name} --instance {your instance name} 

az iot ops ns device endpoint inbound add opcua --device opc-ua-connector-cli -g {your resource group name} -i {your instance name} --name opc-ua-connector-0 --endpoint-address "opc.tcp://opcplc-000000:50000"
```

To learn more, see [az iot ops ns device](/cli/azure/iot/ops/ns/device).

# [Bicep](#tab/bicep)

Deploy the following Bicep template to create a device with an inbound endpoint for the OPC UA connector. Replace the placeholders `<AIO_NAMESPACE_NAME>` and `<CUSTOM_LOCATION_NAME>` with your Azure IoT Operations namespace name and custom location name respectively:

```bicep
param aioNamespaceName string = '<AIO_NAMESPACE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource namespace 'Microsoft.DeviceRegistry/namespaces@2025-10-01' existing = {
  name: aioNamespaceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource device 'Microsoft.DeviceRegistry/namespaces/devices@2025-10-01' = {
  name: 'opc-ua-connector'
  parent: namespace
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

This configuration deploys a new `device` resource called `opc-ua-connector` to the cluster with an inbound endpoint called `opc-ua-connector-0`.

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

### Other security options

When you create the inbound endpoint, you can also select:

| Option | Type | Description |
| ------ | ---- | ----------- |
| **Auto accept untrusted server certificate** | Yes/No | Automatically accept untrusted server certificates |
| **Security policy** | Dropdown | Security policy used to establish secure channel with the OPC UA server |
| **Security mode** | Dropdown | Security mode used to communicate within secure channel with the OPC UA server |

## Add an asset, data points, and events

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

    Use the **Start instance** field to specify the starting node for resolving relative browse paths for data points in the dataset. For more information, see [Resolve nodes dynamically using browse paths](overview-opc-ua-connector.md#resolve-nodes-dynamically-using-browse-paths).

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

    :::image type="content" source="media/howto-configure-opc-ua/add-data-point.png" alt-text="Screenshot that shows adding data points in the operations experience." lightbox="media/howto-configure-opc-ua/add-data-point.png":::

    The following table shows some example data point values that you can use with the built-in OPC PLC simulator:

    | Data source | Data point name |
    | ------- | -------- |
    | ns=3;s=FastUInt10 | Temperature |
    | ns=3;s=FastUInt100 | Humidity |

    > [!NOTE]
    > If you're using relative browse paths to resolve dynamic nodes, the **Data source** field contains a relative browse path. For more information, see [Resolve nodes dynamically using browse paths](overview-opc-ua-connector.md#resolve-nodes-dynamically-using-browse-paths).

1. On the **data points** page, select **Next** to go to the **Add events** page.

# [Azure CLI](#tab/cli)

Use the following commands to add a thermostat asset to your device by using the Azure CLI. The commands add a dataset and two data points to the asset by using the `point add` command:

```azurecli
# Create the asset
az iot ops ns asset opcua create --name thermostat --instance {your instance name} -g  {your resource group name} --device opc-ua-connector --endpoint opc-ua-connector-0  --description 'A simulated thermostat asset'

# Add the dataset
az iot ops ns asset opcua dataset add --asset thermostat --instance {your instance name} -g {your resource group name} --name oven --data-source "ns=3;s=FastUInt10" --dest topic="azure-iot-operations/data/thermostat" retain=Keep qos=Qos1 ttl=3600

# Add the data points
az iot ops ns asset opcua datapoint add --asset thermostat --instance {your instance name} -g {your resource group name} --dataset oven --name temperature --data-source "ns=3;s=FastUInt10"
az iot ops ns asset opcua datapoint add --asset thermostat --instance {your instance name} -g {your resource group name} --dataset oven --name humidity --data-source "ns=3;s=FastUInt100"

# Show the dataset and datapoints
az iot ops ns asset opcua dataset show --asset thermostat -n default -g {your resource group name} --instance {your instance name}
```

When you create an asset by using the Azure CLI, you can define:

- Multiple data points by using the `point add` command multiple times.
- Multiple events by using the `--event` parameter multiple times.
- Optional information for the asset such as:
  - Manufacturer
  - Manufacturer URI
  - Model
  - Product code
  - Hardware version
  - Software version
  - Serial number
  - Documentation URI
- Default values for sampling interval, publishing interval, and queue size.
- Datapoint specific values for sampling interval, publishing interval, and queue size.
- Event specific values for sampling publishing interval, and queue size.
- The observability mode for each data point and event

# [Bicep](#tab/bicep)

Deploy the following Bicep template to create an asset that publishes messages from the device shown previously to an MQTT topic. Replace the placeholders `<AIO_NAMESPACE_NAME>` and `<CUSTOM_LOCATION_NAME>` with your Azure IoT Operations namespace name and custom location name respectively:

```bicep
param aioNamespaceName string = '<AIO_NAMESPACE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource namespace 'Microsoft.DeviceRegistry/namespaces@2025-10-01' existing = {
  name: aioNamespaceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource asset 'Microsoft.DeviceRegistry/namespaces/assets@2025-10-01' = {
  name: 'thermostat'
  parent: namespace
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
      deviceName: 'opc-ua-connector'
      endpointName: 'opc-ua-connector-0'
    }

    defaultDatasetsConfiguration: '{}'
    defaultEventsConfiguration: '{}'

    datasets: [
      {
        name: 'oven'
        dataSource: 'ns=3;s=FastUInt10'
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
              retain: 'Keep'
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

### Add individual events to an asset

Now you can define the events associated with the asset. To add OPC UA events in the operations experience:

1. Create an event group by selecting **Create event group**.

1. Select **Add event**.

1. Enter your event details:

      - Event notifier. This value is the event notifier from the OPC UA server.
      - Event name (Optional). This value is the friendly name that you want to use for the event. If you don't specify an event name, the event notifier is used as the event name.
      - Publishing interval (milliseconds). You can override the default value for this data point.
      - Sampling interval (milliseconds). You can override the default value for this data point.
      - Queue size. You can override the default value for this data point.
      - Key frame count. You can override the default value for this data point.

    :::image type="content" source="media/howto-configure-opc-ua/add-event.png" alt-text="Screenshot that shows adding events in the operations experience." lightbox="media/howto-configure-opc-ua/add-event.png":::

    > [!NOTE]
    > To resolve node IDs dynamically, use the **Start instance** field to specify the starting node ID, and the **Data source** field to specify the relative browse path. For more information, see [Resolve nodes dynamically using browse paths](overview-opc-ua-connector.md#resolve-nodes-dynamically-using-browse-paths).

1. Select **Manage default settings** to configure default event settings for the asset. These settings apply to all the OPC UA events that belong to the asset. You can override these settings for each event that you add. Default event settings include:

    - **Publishing interval (milliseconds)**: The rate at which OPC UA server should publish data.
    - **Queue size**: The depth of the queue to hold the sampling data before publishing it.

### Event filters

Define event filters to customize the information included in event notifications from the server. By default, the server sends a selection of standard fields in event notifications. The server determines the exact selection for each event type. For example:

```json
{
    "EventId":"OkaXYhfr20yUoj1QBbzcIg==",
    "EventType":"i=2130",
    "SourceNode":"i=2253",
    "SourceName":"WestTank",
    "Time":"2025-10-10T15:09:13.3946878Z",
    "ReceiveTime":"2025-10-10T15:09:13.3946881Z",
    "Message":"Raising Events",
    "Severity":500
}
```

Use an event filter to:

- Include extra fields in event notifications.
- Exclude fields from event notifications.
- Modify field names in event notifications.

The following screenshot shows an example event filter:

:::image type="content" source="media/howto-configure-opc-ua/event-filter.png" alt-text="A screenshot that shows how to configure an event filter for an OPC UA asset." lightbox="media/howto-configure-opc-ua/event-filter.png":::

The complete event filter shown in the preceding screenshot defines four output fields:

| Browse path | Type definition ID | Field ID |
| --- | --- | --- |
| `EventId` | `ns=0;i=2041` | `myEventId` |
| `EventType` | `ns=0;i=2041` | blank |
| `SourceName` | blank | `mySourceName` |
| `Severity` | blank | blank |

The three properties for a filter row are:

- _Browse path_. Required value that identifies the source field to include in the forwarded event notification.
- _Type definition ID_. Optional value that specifies the OPC UA type definition of the source field.
- _Field ID_. Optional value that specifies the name to use for the field in the forwarded event notification. If you don't specify a field ID, the original field name is used.

The resulting message forwarded by the connector now looks like the following example:

```json
{
    "myEventId":"OkaXYhfr20yUoj1QBbzcIg==",
    "EventType":"i=2130",
    "mySourceName":"WestTank",
    "Severity":500
}
```

### Review your changes

Review your asset and OPC UA data point and event details. Make any adjustments you need:

:::image type="content" source="media/howto-configure-opc-ua/review-asset.png" alt-text="A screenshot that shows how to review your asset, data points, and events in the operations experience." lightbox="media/howto-configure-opc-ua/review-asset.png":::

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
az iot ops ns asset query --device {your device name} --endpoint-name {your endpoint name}
```

> [!TIP]
> You can refine the query command to search for assets that match specific criteria. For example, you can search for assets by manufacturer.

To view the details of the thermostat asset, use the following command:

```azurecli
az iot ops ns asset show --name thermostat --instance {your instance name} -g {your resource group}
```

To update an asset, use the `az iot ops ns asset opcua update` command. For example, to update the asset's description, use a command like the following example:

```azurecli
az iot ops ns asset opcua update --name thermostat --instance {your instance name} -g {your resource group} --description "Updated factory PLC"
```

To list the thermostat asset's data points in a dataset, use the following command:

```azurecli
az iot ops ns asset opcua dataset show --asset thermostat --name default -g {your resource group} --instance {your instance name}
```

To list the thermostat asset's events, use the following command:

```azurecli
az iot ops ns asset opcua event list --asset thermostat -g {your resource group} --instance {your instance name}
```

To add a new data point to the thermostat asset, use a command like the following example:

```azurecli
az iot ops ns asset opcua dataset point add --asset thermostat --instance {your instance name} -g {your resource group name} --dataset default --name humidity --data-source "ns=3;s=FastUInt100"
```

To delete a data point, use the `az iot ops ns asset opcua dataset point remove` command.

You can manage an asset's events by using the `az iot ops ns asset opcua event` commands.

# [Bicep](#tab/bicep)

To retrieve an asset by using Bicep, use a template like the following example:

```bicep
param aioNamespaceName string = '<AIO_NAMESPACE_NAME>'

resource namespace 'Microsoft.DeviceRegistry/namespaces@2025-10-01' existing = {
  name: aioNamespaceName
}

resource asset 'Microsoft.DeviceRegistry/namespaces/assets@2025-10-01' existing = {
  name: 'thermostat'
  parent: aioNamespaceName
}

output asset object = asset
```

To update an existing asset, for example to modify the description and add a data point, use a template like the following example:

```bicep
param aioNamespaceName string = '<AIO_NAMESPACE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource namespace 'Microsoft.DeviceRegistry/namespaces@2025-10-01' existing = {
  name: aioNamespaceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource asset 'Microsoft.DeviceRegistry/namespaces/assets@2025-10-01' = {
  name: 'thermostat'
  parent: namespace
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
      deviceName: 'opc-ua-connector'
      endpointName: 'opc-ua-connector-0'
    }

    defaultDatasetsConfiguration: '{}'
    defaultEventsConfiguration: '{}'

    datasets: [
      {
        name: 'oven'
        dataSource: 'ns=3;s=FastUInt10'
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
              retain: 'Keep'
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

To delete an asset, select the asset you want to delete. On the **Asset**  details page, select **Delete**. Confirm your changes to delete the asset:

:::image type="content" source="media/howto-configure-opc-ua/asset-delete.png" alt-text="A screenshot that shows how to delete an asset from the operations experience." lightbox="media/howto-configure-opc-ua/asset-delete.png":::

# [Azure CLI](#tab/cli)

To delete an asset, use a command that looks like the following example:

```azurecli
az iot ops ns asset delete --name thermostat -g {your resource group name} --instance {your instance name}
```

# [Bicep](#tab/bicep)

To delete individual resources by using Bicep, see [Deployment stacks](/azure/azure-resource-manager/bicep/quickstart-create-deployment-stacks).

---

## Related content

- [Manage asset and device configurations](howto-use-operations-experience.md)
- [Connector for OPC UA overview](overview-opc-ua-connector.md)
- [az iot ops asset](/cli/azure/iot/ops/asset)
- [az iot ops device](/cli/azure/iot/ops/asset/endpoint)

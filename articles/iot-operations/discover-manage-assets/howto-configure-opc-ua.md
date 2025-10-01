---
title: How to use the connector for OPC UA
description: Use the operations experience web UI or the Azure CLI to configure assets and devices for OPC UA connections.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 07/28/2025


#CustomerIntent: As an OT user, I want configure my Azure IoT Operations environment so that data can flow from my OPC UA servers through to the MQTT broker.
---

# Configure the connector for OPC UA

_OPC UA servers_ are software applications that communicate with assets. OPC UA servers expose _OPC UA tags_ that represent tags. OPC UA tags provide real-time or historical data about the status, performance, quality, or condition of assets.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

This article describes how to use the operations experience web UI and the Azure CLI to:

- Define the devices that connect OPC UA servers to your Azure IoT Operations instance.
- Add assets, and define their tags and events to enable data flow from OPC UA servers to the MQTT broker.

These assets, tags, and events map inbound data from OPC UA servers to friendly names that you can use in the MQTT broker and data flows.

## Prerequisites

To configure devices and assets, you need a running preview instance of Azure IoT Operations.

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

Your IT administrator must have configured the OPC UA connector template for your Azure IoT Operations instance in the Azure portal.

An OPC UA server that you can reach from your Azure IoT Operations cluster. If you don't have an OPC UA server, use the OPC PLC simulator from the Azure IoT Operations samples repository.

## Create a device

An Azure IoT Operations deployment can include a sample OPC PLC simulator. To create a device that uses the OPC PLC simulator:

# [Operations experience](#tab/portal)

1. Select **devices** and then **Create device**:

    :::image type="content" source="media/howto-configure-opc-ua/devices.png" alt-text="Screenshot that shows the devices page in the operations experience." lightbox="media/howto-configure-opc-ua/devices.png":::

    > [!TIP]
    > You can use the filter box to search for devices.

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

---

This configuration deploys a new `device` resource called `opc-ua-connector` to the cluster with an inbound endpoint called `opc-ua-connector-0`.

When the OPC PLC simulator is running, data flows from the simulator, to the connector for OPC UA, and then to the MQTT broker.

### Configure a device to use a username and password

The previous example uses the `Anonymous` authentication mode. This mode doesn't require a username or password.

To use the `UsernamePassword` authentication mode, complete the following steps:

# [Operations experience](#tab/portal)

1. Follow the steps in [Manage secrets for your Azure IoT Operations deployment](../secure-iot-ops/howto-manage-secrets.md) to add secrets for username and password in Azure Key Vault, and project them into Kubernetes cluster.
2. In the operations experience, select **Username password** for the **User authentication** field to configure the device endpoint to use these secrets. Then enter the following values for the **Username reference** and **Password reference** fields:

| Field | Value |
| --- | --- |
| Username reference | `aio-opc-ua-broker-user-authentication/username` |
| Password reference | `aio-opc-ua-broker-user-authentication/password` |

# [Azure CLI](#tab/cli)

1. Follow the steps in [Manage secrets for your Azure IoT Operations deployment](../secure-iot-ops/howto-manage-secrets.md) to add secrets for username and password in Azure Key Vault, and project them into Kubernetes cluster.

1. Use a command like the following example to create a device endpoint that uses the username and password authentication mode:

    ```azurecli
    az iot ops ns device endpoint inbound add opcua --device opc-ua-connector-cli -g {your resource group name} -i {your instance name} --name opc-ua-connector-0 --endpoint-address "opc.tcp://opcplc-000000:50000"  --user-ref "aio-opc-ua-broker-user-authentication/username" --pass-ref "aio-opc-ua-broker-user-authentication/password"
    ```

---

## Add an asset, tags, and events

# [Operations experience](#tab/portal)

To add an asset in the operations experience:

1. Select the **Assets** tab. Before you create any assets, you see the following screen:

    :::image type="content" source="media/howto-configure-opc-ua/create-asset-empty.png" alt-text="Screenshot that shows an empty Assets tab in the operations experience." lightbox="media/howto-configure-opc-ua/create-asset-empty.png":::

    > [!TIP]
    > You can use the filter box to search for assets.

1. Select **Create namespace asset**.

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

1. Select **Next** to go to the **Tags** page.

### Add individual tags to an asset

Now you can define the tags associated with the asset. To add OPC UA tags:

1. Select **Add tag**.

1. Enter your tag details:

      - Data source. This value is the node ID from the OPC UA server.
      - Tag name (Optional). This value is the friendly name that you want to use for the tag. If you don't specify a tag name, the node ID is used as the tag name.
      - Publishing interval (milliseconds). You can override the default value for this tag.
      - Sampling interval (milliseconds). You can override the default value for this tag.
      - Queue size. You can override the default value for this tag.
      - Key frame count. You can override the default value for this tag.

    :::image type="content" source="media/howto-configure-opc-ua/add-tag.png" alt-text="Screenshot that shows adding tags in the operations experience." lightbox="media/howto-configure-opc-ua/add-tag.png":::

    The following table shows some example tag values that you can use with the built-in OPC PLC simulator:

    | Data source | Tag name |
    | ------- | -------- |
    | ns=3;s=FastUInt10 | Temperature |
    | ns=3;s=FastUInt100 | Humidity |

1. To configure default settings for messages from the asset, select **Manage default settings**. These settings apply to all the OPC UA tags that belong to the asset. You can override these settings for each tag that you add. Default settings include:

    - **Sampling interval (milliseconds)**: The sampling interval indicates the fastest rate at which the OPC UA server should sample its underlying source for data changes.
    - **Publishing interval (milliseconds)**: The rate at which OPC UA server should publish data.
    - **Queue size**: The depth of the queue to hold the sampling data before publishing it.

1. To configure the MQTT topic to publish the tag data to, select **Manage default dataset**. Enter an MQTT topic name such as `azure-iot-operations/data/thermostat`, then select **Update**.

1. On the **Tags** page, select **Next** to go to the **Add events** page.

# [Azure CLI](#tab/cli)

Use the following commands to add a "thermostat" namespace asset to your device by using the Azure CLI. The commands add a dataset and two tags to the asset by using the `point add` command:

```azurecli
# Create the asset
az iot ops ns asset opcua create --name thermostat --instance {your instance name} -g  {your resource group name} --device opc-ua-connector --endpoint opc-ua-connector-0  --description 'A simulated thermostat asset'

# Add the dataset
az iot ops ns asset opcua dataset add --asset thermostat --instance {your instance name} -g {your resource group name} --name default --data-source "ns=3;s=FastUInt10" --dest topic="azure-iot-operations/data/thermostat" retain=Keep qos=Qos1 ttl=3600

# Add the datapoints
az iot ops ns asset opcua dataset point add --asset thermostat --instance {your instance name} -g {your resource group name} --dataset default --name temperature --data-source "ns=3;s=FastUInt10"
az iot ops ns asset opcua dataset point add --asset thermostat --instance {your instance name} -g {your resource group name} --dataset default --name humidity --data-source "ns=3;s=FastUInt100"

# Show the dataset and datapoints
az iot ops ns asset opcua dataset show --asset thermostat -n default -g {your resource group name} --instance {your instance name}
```

When you create an asset by using the Azure CLI, you can define:

- Multiple datapoints/tags by using the `point add` command multiple times.
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
- The observability mode for each tag and event

---

### Add individual events to an asset

# [Operations experience](#tab/portal)

Now you can define the events associated with the asset. To add OPC UA events:

1. Select **Add event**.

1. Enter your event details:

      - Event notifier. This value is the event notifier from the OPC UA server.
      - Event name (Optional). This value is the friendly name that you want to use for the event. If you don't specify an event name, the event notifier is used as the event name.
      - Publishing interval (milliseconds). You can override the default value for this tag.
      - Sampling interval (milliseconds). You can override the default value for this tag.
      - Queue size. You can override the default value for this tag.
      - Key frame count. You can override the default value for this tag.

    :::image type="content" source="media/howto-configure-opc-ua/add-event.png" alt-text="Screenshot that shows adding events in the operations experience." lightbox="media/howto-configure-opc-ua/add-event.png":::

1. Select **Manage default settings** to configure default event settings for the asset. These settings apply to all the OPC UA events that belong to the asset. You can override these settings for each event that you add. Default event settings include:

    - **Publishing interval (milliseconds)**: The rate at which OPC UA server should publish data.
    - **Queue size**: The depth of the queue to hold the sampling data before publishing it.

### Review your changes

Review your asset and OPC UA tag and event details and make any adjustments you need:

:::image type="content" source="media/howto-configure-opc-ua/review-asset.png" alt-text="A screenshot that shows how to review your asset, tags, and events in the operations experience." lightbox="media/howto-configure-opc-ua/review-asset.png":::

# [Azure CLI](#tab/cli)

When you create an asset by using the Azure CLI, you can define multiple events by using the `--event` parameter multiple times:

```azurecli
az iot ops ns asset opcua event add --asset thermostat -g {your resource group name} --instance {your instance name} --event_notifier='ns=3;s=FastUInt12', name=warning
```

For each event that you define, you can specify the:

- Event notifier. This value is the event notifier from the OPC UA server.
- Event name. This value is the friendly name that you want to use for the event. If you don't specify an event name, the event notifier is used as the event name.
- Observability mode.
- Queue size.

You can also use the [az iot ops ns asset opcua event](/cli/azure/iot/ops/asset/event) commands to add and remove events from an asset.

---

## Update an asset

# [Operations experience](#tab/portal)

Find and select the asset you created previously. Use the **Asset details**, **Tags**, and **Events** tabs to make any changes:

:::image type="content" source="media/howto-configure-opc-ua/asset-update-property-save.png" alt-text="A screenshot that shows how to update an existing asset in the operations experience." lightbox="media/howto-configure-opc-ua/asset-update-property-save.png":::

On the **Tags** tab, you can add tags, update existing tags, or remove tags.

To update a tag, select an existing tag and update the tag information. Then select **Update**:

:::image type="content" source="media/howto-configure-opc-ua/asset-update-tag.png" alt-text="A screenshot that shows how to update an existing tag in the operations experience." lightbox="media/howto-configure-opc-ua/asset-update-tag.png":::

To remove tags, select one or more tags and then select **Remove tags**:

:::image type="content" source="media/howto-configure-opc-ua/asset-remove-data-points.png" alt-text="A screenshot that shows how to delete a tag in the operations experience." lightbox="media/howto-configure-opc-ua/asset-remove-data-points.png":::

You can also add, update, and delete events and properties in the same way.

When you're finished making changes, select **Save** to save your changes.

# [Azure CLI](#tab/cli)

To list your namespace assets associated with a specific endpoint, use the following command:

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

To list the thermostat asset's tags in a dataset, use the following command:

```azurecli
az iot ops ns asset opcua dataset show --asset thermostat --name default -g {your resource group} --instance {your instance name}
```

To list the thermostat asset's events, use the following command:

```azurecli
az iot ops ns asset opcua event list --asset thermostat -g {your resource group} --instance {your instance name}
```

To add a new tag to the thermostat asset, use a command like the following example:

```azurecli
az iot ops ns asset opcua dataset point add --asset thermostat --instance {your instance name} -g {your resource group name} --dataset default --name humidity --data-source "ns=3;s=FastUInt100"
```

To delete a tag, use the `az iot ops ns asset opcua dataset point remove` command.

You can manage an asset's events by using the `az iot ops ns asset opcua event` commands.

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

---

## Related content

- [Manage asset and device configurations](howto-use-operations-experience.md)
- [Connector for OPC UA overview](overview-opc-ua-connector.md)
- [az iot ops asset](/cli/azure/iot/ops/asset)
- [az iot ops device](/cli/azure/iot/ops/asset/endpoint)

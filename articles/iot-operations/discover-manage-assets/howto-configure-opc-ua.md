---
title: Configure assets and devices for OPC UA
description: Use the operations experience web UI or the Azure CLI to configure your assets and devices for OPC UA connections.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 06/25/2025


#CustomerIntent: As an OT user, I want configure my IoT Operations environment to so that data can flow from my OPC UA servers through to the MQTT broker.
---

# Manage asset and device configurations

An _asset_ in Azure IoT Operations is a logical entity that you create to represent a real asset. An Azure IoT Operations asset can have properties, data points, and events that describe its behavior and characteristics.

_OPC UA servers_ are software applications that communicate with assets. OPC UA servers expose _OPC UA data points_ that represent data points. OPC UA data points provide real-time or historical data about the status, performance, quality, or condition of assets.

A _device_ is a custom resource in your Kubernetes cluster that connects OPC UA servers to connector for OPC UA modules. This connection enables a connector for OPC UA to access an asset's data points. Without a device, data can't flow from an OPC UA server to the connector for OPC UA and MQTT broker. After you configure the custom resources in your cluster, a connection is established to the downstream OPC UA server and the server forwards messages such as sensor data to the connector for OPC UA.

This article describes how to use the operations experience web UI and the Azure CLI to:

- Define the devices that connect assets to your Azure IoT Operations instance.
- Add assets, and define their data points and events to enable data flow from OPC UA servers to the MQTT broker.

These assets, data points, and events map inbound data from OPC UA servers to friendly names that you can use in the MQTT broker and data flows.

## Prerequisites

To configure devices and assets, you need a running instance of Azure IoT Operations.

To sign in to the operations experience web UI, you need a Microsoft Entra ID account with at least contributor permissions for the resource group that contains your **Kubernetes - Azure Arc** instance. You can't sign in with a Microsoft account (MSA). To create a suitable Microsoft Entra ID account in your Azure tenant:

1. Sign in to the [Azure portal](https://portal.azure.com/) with the same tenant and user name that you used to deploy Azure IoT Operations.
1. In the Azure portal, go to the **Microsoft Entra ID** section, select **Users > +New user > Create new user**. Create a new user and make a note of the password, you need it to sign in later.
1. In the Azure portal, go to the resource group that contains your **Kubernetes - Azure Arc** instance. On the **Access control (IAM)** page, select **+Add > Add role assignment**.
1. On the **Add role assignment page**, select **Privileged administrator roles**. Then select **Contributor** and then select **Next**.
1. On the **Members** page, add your new user to the role.
1. Select **Review and assign** to complete setting up the new user.

You can now use the new user account to sign in to the [Azure IoT Operations](https://iotoperations.azure.com) portal.

## Create a device

An Azure IoT Operations deployment can include an optional built-in OPC PLC simulator. To create a device that uses the built-in OPC PLC simulator:

# [Operations experience](#tab/portal)

1. Select **devices** and then **Create device**:

    :::image type="content" source="media/howto-configure-opc-ua/asset-endpoints.png" alt-text="Screenshot that shows the devices page in the operations experience." lightbox="media/howto-configure-opc-ua/asset-endpoints.png":::

    > [!TIP]
    > You can use the filter box to search for devices.

1. Enter the following endpoint information:

    | Field | Value |
    | --- | --- |
    | Name | `opc-ua-connector-0` |
    | Connector for OPC UA URL | `opc.tcp://opcplc-000000:50000` |
    | User authentication | `Anonymous` |

1. To save the definition, select **Create**.

# [Azure CLI](#tab/cli)

Run the following command:

```azurecli
az iot ops device create opcua --name opc-ua-connector-0 --target-address opc.tcp://opcplc-000000:50000 -g {your resource group name} --instance {your instance name} 
```

> [!TIP]
> Use `az connectedk8s list` to list the clusters you have access to.

To learn more, see [az iot ops device](/cli/azure/iot/ops/asset/endpoint).

---

This configuration deploys a new `assetendpointprofile` resource called `opc-ua-connector-0` to the cluster. After you define an asset, a connector for OPC UA pod discovers it. The pod uses the device that you specify in the asset definition to connect to an OPC UA server.

When the OPC PLC simulator is running, data flows from the simulator, to the connector for OPC UA, and then to the MQTT broker.

### Configure a device to use a username and password

The previous example uses the `Anonymous` authentication mode. This mode doesn't require a username or password.

To use the `UsernamePassword` authentication mode, complete the following steps:

# [Operations experience](#tab/portal)

1. Follow the steps in [Configure OPC UA user authentication with username and password](howto-configure-opcua-authentication-options.md#configure-username-and-password-authentication) to add secrets for username and password in Azure Key Vault, and project them into Kubernetes cluster.
2. In the operations experience, select **Username password** for the **User authentication** field to configure the device to use these secrets. Then enter the following values for the **Username reference** and **Password reference** fields:

| Field | Value |
| --- | --- |
| Username reference | `aio-opc-ua-broker-user-authentication/username` |
| Password reference | `aio-opc-ua-broker-user-authentication/password` |

# [Azure CLI](#tab/cli)

1. Follow the steps in [Configure OPC UA user authentication with username and password](howto-configure-opcua-authentication-options.md#configure-username-and-password-authentication) to add secrets for username and password in Azure Key Vault, and project them into Kubernetes cluster.

1. Use a command like the following example to create your device:

    ```azurecli
    az iot ops device create opcua --name opc-ua-connector-0 --target-address opc.tcp://opcplc-000000:50000 -g {your resource group name} --instance {your instance name} --username-ref "aio-opc-ua-broker-user-authentication/username" --password-ref "aio-opc-ua-broker-user-authentication/password"
    ```

---

## Add an asset, data points, and events

# [Operations experience](#tab/portal)

To add an asset in the operations experience:

1. Select the **Assets** tab. Before you create any assets, you see the following screen:

    :::image type="content" source="media/howto-configure-opc-ua/create-asset-empty.png" alt-text="Screenshot that shows an empty Assets tab in the operations experience." lightbox="media/howto-configure-opc-ua/create-asset-empty.png":::

    > [!TIP]
    > You can use the filter box to search for assets.

1. Select **Create asset**.

1. On the asset details screen, enter the following asset information:

    - device. Select your device from the list.
    - Asset name
    - Description
    - The MQTT topic that the asset publishes to. The default is `<namespace>/data/<asset-name>`.

1. Configure the set of properties that you want to associate with the asset. You can accept the default list of properties or add your own. The following properties are available by default:

    - Manufacturer
    - Manufacturer URI
    - Model
    - Product code
    - Hardware version
    - Software version
    - Serial number
    - Documentation URI

    :::image type="content" source="media/howto-configure-opc-ua/create-asset-details.png" alt-text="Screenshot that shows how to add asset details in the operations experience." lightbox="media/howto-configure-opc-ua/create-asset-details.png":::

1. Select **Next** to go to the **Add data points** page.

### Add individual data points to an asset

Now you can define the data points associated with the asset. To add OPC UA data points:

1. Select **Add tag or CSV > Add tag**.

1. Enter your tag details:

      - Node ID. This value is the node ID from the OPC UA server.
      - Tag name (Optional). This value is the friendly name that you want to use for the tag. If you don't specify a tag name, the node ID is used as the tag name.
      - Observability mode (Optional) with following choices:
        - None
        - Gauge
        - Counter
        - Histogram
        - Log
      - Sampling Interval (milliseconds). You can override the default value for this tag.
      - Queue size. You can override the default value for this tag.

    :::image type="content" source="media/howto-configure-opc-ua/add-tag.png" alt-text="Screenshot that shows adding data points in the operations experience." lightbox="media/howto-configure-opc-ua/add-tag.png":::

    The following table shows some example tag values that you can use with the built-in OPC PLC simulator:

    | Node ID | Tag name | Observability mode |
    | ------- | -------- | ------------------ |
    | ns=3;s=FastUInt10 | Temperature | None |
    | ns=3;s=FastUInt100 | Humidity | None |

1. Select **Manage default settings** to configure default settings for messages from the asset. These settings apply to all the OPC UA data points that belong to the asset. You can override these settings for each tag that you add. Default settings include:

    - **Sampling interval (milliseconds)**: The sampling interval indicates the fastest rate at which the OPC UA server should sample its underlying source for data changes.
    - **Publishing interval (milliseconds)**: The rate at which OPC UA server should publish data.
    - **Queue size**: The depth of the queue to hold the sampling data before publishing it.

### Add data points in bulk to an asset

You can import up to 1000 OPC UA data points at a time from a CSV file:

1. Create a CSV file that looks like the following example:

    | NodeID              | TagName  | QueueSize | ObservabilityMode | Sampling Interval Milliseconds |
    |---------------------|----------|-----------|-------------------|--------------------------------|
    | ns=3;s=FastUInt1000 | Tag 1000 | 5         | None              | 1000                           |
    | ns=3;s=FastUInt1001 | Tag 1001 | 5         | None              | 1000                           |
    | ns=3;s=FastUInt1002 | Tag 1002 | 10        | None              | 5000                           |

1. Select **Add tag or CSV > Import CSV (.csv) file**. Select the CSV file you created and select **Open**. The data points defined in the CSV file are imported:

    :::image type="content" source="media/howto-configure-opc-ua/import-complete.png" alt-text="A screenshot that shows the completed import from the Excel file in the operations experience." lightbox="media/howto-configure-opc-ua/import-complete.png":::

    If you import a CSV file that contains data points that are duplicates of existing data points, the operations experience displays the following message:

    :::image type="content" source="media/howto-configure-opc-ua/import-duplicates.png" alt-text="A screenshot that shows the error message when you import duplicate tag definitions in the operations experience." lightbox="media/howto-configure-opc-ua/import-duplicates.png":::

    You can either replace the duplicate data points and add new data points from the import file, or you can cancel the import.

1. To export all the data points from an asset to a CSV file, select **Export all** and choose a location for the file:

    :::image type="content" source="media/howto-configure-opc-ua/export-data-points.png" alt-text="A screenshot that shows how to export tag definitions from an asset in the operations experience." lightbox="media/howto-configure-opc-ua/export-data-points.png":::

1. On the **data points** page, select **Next** to go to the **Add events** page.

> [!TIP]
> You can use the filter box to search for data points.

# [Azure CLI](#tab/cli)

Use the following commands to add a "thermostat" asset by using the Azure CLI. The commands add two data points/datapoints to the asset by using the `point add` command:

```azurecli
# Create the asset
az iot ops asset create --name thermostat -g {your resource group name} --instance {your instance name} --endpoint opc-ua-connector-0 --description 'A simulated thermostat asset'

# Add the datapoints
az iot ops asset dataset point add --asset thermostat -g {your resource group name} --dataset default --data-source 'ns=3;s=FastUInt10' --name temperature
az iot ops asset dataset point add --asset thermostat -g {your resource group name} --dataset default --data-source 'ns=3;s=FastUInt100' --name 'Tag 10'

# Show the datapoints
az iot ops asset dataset show --asset thermostat -n default -g {your resource group name}
```

When you create an asset by using the Azure CLI, you can define:

- Multiple datapoints/data points by using the `point add` command multiple times.
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

1. Select **Add event or CSV > Add event**.

1. Enter your event details:

      - Event notifier. This value is the event notifier from the OPC UA server.
      - Event name (Optional). This value is the friendly name that you want to use for the event. If you don't specify an event name, the event notifier is used as the event name.
      - Observability mode (Optional) with following choices:
        - None
        - Log
      - Queue size. You can override the default value for this tag.

    :::image type="content" source="media/howto-configure-opc-ua/add-event.png" alt-text="Screenshot that shows adding events in the operations experience." lightbox="media/howto-configure-opc-ua/add-event.png":::

1. Select **Manage default settings** to configure default event settings for the asset. These settings apply to all the OPC UA events that belong to the asset. You can override these settings for each event that you add. Default event settings include:

    - **Publishing interval (milliseconds)**: The rate at which OPC UA server should publish data.
    - **Queue size**: The depth of the queue to hold the sampling data before publishing it.

### Add events in bulk to an asset

You can import up to 1000 OPC UA events at a time from a CSV file.

To export all the events from an asset to a CSV file, select **Export all** and choose a location for the file.

On the **Events** page, select **Next** to go to the **Review** page.

> [!TIP]
> You can use the filter box to search for events.

### Review your changes

Review your asset and OPC UA tag and event details and make any adjustments you need:

:::image type="content" source="media/howto-configure-opc-ua/review-asset.png" alt-text="A screenshot that shows how to review your asset, data points, and events in the operations experience." lightbox="media/howto-configure-opc-ua/review-asset.png":::

# [Azure CLI](#tab/cli)

When you create an asset by using the Azure CLI, you can define multiple events by using the `--event` parameter multiple times:

```azurecli
az iot ops asset create --name thermostat -g {your resource group name} --cluster {your cluster name} --endpoint opc-ua-connector-0 --description 'A simulated thermostat asset' --event event_notifier='ns=3;s=FastUInt12', name=warning
```

For each event that you define, you can specify the:

- Event notifier. This value is the event notifier from the OPC UA server.
- Event name. This value is the friendly name that you want to use for the event. If you don't specify an event name, the event notifier is used as the event name.
- Observability mode.
- Queue size.

You can also use the a[z iot ops asset event](/cli/azure/iot/ops/asset/event) commands to add and remove events from an asset.

---

## Update an asset

# [Operations experience](#tab/portal)

Find and select the asset you created previously. Use the **Asset details**, **data points**, and **Events** tabs to make any changes:

:::image type="content" source="media/howto-configure-opc-ua/asset-update-property-save.png" alt-text="A screenshot that shows how to update an existing asset in the operations experience." lightbox="media/howto-configure-opc-ua/asset-update-property-save.png":::

On the **data points** tab, you can add data points, update existing data points, or remove data points.

To update a tag, select an existing tag and update the tag information. Then select **Update**:

:::image type="content" source="media/howto-configure-opc-ua/asset-update-tag.png" alt-text="A screenshot that shows how to update an existing tag in the operations experience." lightbox="media/howto-configure-opc-ua/asset-update-tag.png":::

To remove data points, select one or more data points and then select **Remove data points**:

:::image type="content" source="media/howto-configure-opc-ua/asset-remove-data-points.png" alt-text="A screenshot that shows how to delete a tag in the operations experience." lightbox="media/howto-configure-opc-ua/asset-remove-data-points.png":::

You can also add, update, and delete events and properties in the same way.

When you're finished making changes, select **Save** to save your changes.

# [Azure CLI](#tab/cli)

To list your assets, use the following command:

```azurecli
az iot ops asset query -g {your resource group name}
```

> [!TIP]
> You can refine the query command to search for assets that match specific criteria. For example, you can search for assets by manufacturer.

To view the details of the thermostat asset, use the following command:

```azurecli
az iot ops asset show --name thermostat -g {your resource group}
```

To update an asset, use the `az iot ops asset update` command. For example, to update the asset's description, use a command like the following example:

```azurecli
az iot ops asset update --name thermostat --description 'A simulated thermostat asset' -g {your resource group}
```

To list the thermostat asset's data points, use the following command:

```azurecli
az iot ops asset dataset show --asset thermostat --name default -g {your resource group}
```

To list the thermostat asset's events, use the following command:

```azurecli
az iot ops asset event list --asset thermostat -g {your resource group}
```

To add a new tag to the thermostat asset, use a command like the following example:

```azurecli
az iot ops asset dataset point add --asset thermostat -g {your resource group name} --dataset default --data-source 'ns=3;s=FastUInt1002' --name 'humidity'
```

To delete a tag, use the `az iot ops asset dataset point remove` command.

You can manage an asset's events by using the `az iot ops asset event` commands.

---

## Delete an asset

# [Operations experience](#tab/portal)

To delete an asset, select the asset you want to delete. On the **Asset**  details page, select **Delete**. Confirm your changes to delete the asset:

:::image type="content" source="media/howto-configure-opc-ua/asset-delete.png" alt-text="A screenshot that shows how to delete an asset from the operations experience." lightbox="media/howto-configure-opc-ua/asset-delete.png":::

# [Azure CLI](#tab/cli)

To delete an asset, use a command that looks like the following example:

```azurecli
az iot ops asset delete --name thermostat -g {your resource group name}
```

---

## Related content

- [Manage asset and device configurations](howto-manage-assets-devices.md)
- [Connector for OPC UA overview](overview-opcua-broker.md)
- [az iot ops asset](/cli/azure/iot/ops/asset)
- [az iot ops device](/cli/azure/iot/ops/asset/endpoint)

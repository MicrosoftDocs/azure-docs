---
title: Manage asset configurations remotely
description: Use the Azure IoT Operations portal or the Azure CLI to manage your asset configurations remotely and enable data to flow from your assets to an MQTT broker.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 03/01/2024
ms.custom:
  - ignite-2023
  - devx-track-azurecli

#CustomerIntent: As an OT user, I want configure my IoT Operations environment to so that data can flow from my OPC UA servers through to the MQTT broker.
---

# Manage asset configurations remotely

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

An _asset_ in Azure IoT Operations Preview is a logical entity that you create to represent a real asset. An Azure IoT Operations asset can have properties, tags, and events that describe its behavior and characteristics.

_OPC UA servers_ are software applications that communicate with assets. OPC UA servers expose _OPC UA tags_ that represent data points. OPC UA tags provide real-time or historical data about the status, performance, quality, or condition of assets.

An _asset endpoint_ is a custom resource in your Kubernetes cluster that connects OPC UA servers to OPC UA connector modules. This connection enables an OPC UA connector to access an asset's data points. Without an asset endpoint, data can't flow from an OPC UA server to the Azure IoT OPC UA Broker Preview instance and Azure IoT MQ Preview instance. After you configure the custom resources in your cluster, a connection is established to the downstream OPC UA server and the server forwards telemetry to the OPC UA Broker instance.

A _site_ is a collection of Azure IoT Operations instances. Sites help you organize your instances and manage access control. Your IT administrator creates sites, assigns instances to them, and grants access to OT users in your organization.

In the Azure IoT Operations (preview) portal, an _instance_ represents an Azure IoT Operations cluster. An instance can have one or more asset endpoints.

This article describes how to use the Azure IoT Operations (preview) portal and the Azure CLI to:

- Define the asset endpoints that connect assets to your Azure IoT Operations instance.
- Add assets, and define their tags and events to enable data flow from OPC UA servers to the Azure IoT MQ broker.

These assets, tags, and events map inbound data from OPC UA servers to friendly names that you can use in the MQ broker and Azure IoT Data Processor Preview pipelines.

## Prerequisites

To configure an assets endpoint, you need a running instance of Azure IoT Operations.

## Sign in

# [Azure IoT Operations portal](#tab/portal)

To sign in to the Azure IoT Operations (preview) portal, navigate to the [Azure IoT Operations (preview)](https://iotoperations.azure.com) portal in your browser and sign in by using your Microsoft Entra ID credentials.

## Select your site

After you sign in, the portal displays a list of sites that you have access to. Each site is a collection of Azure IoT Operations instances where you can configure your assets. Your [IT administrator is responsible for organizing instances in to sites](../../azure-arc/site-manager/overview.md) and granting access to OT users in your organization. Instances that aren't part of a site appear in the **Unassigned instances** node. Select the site that you want to use:

:::image type="content" source="media/howto-manage-assets-remotely/site-list.png" alt-text="Screenshot that shows a list of sites in the Azure IoT Operations (preview) portal.":::

> [!TIP]
> You can use the filter box to search for sites.

If you don't see any sites, you might not be in the right Azure Active Directory tenant. You can change the tenant from the top right menu in the portal. If you still don't see any sites that means you aren't added to any yet. Reach out to your IT administrator to request access.

## Select your instance

After you select a site, the portal displays a list of the Azure IoT Operations instances that are part of the site. Select the instance that you want to use:

:::image type="content" source="media/howto-manage-assets-remotely/cluster-list.png" alt-text="Screenshot that shows the list of instances in the Azure IoT Operations (preview) portal.":::

> [!TIP]
> You can use the filter box to search for instances.

# [Azure CLI](#tab/cli)

Before you use the `az iot ops asset` commands, sign in to the subscription that contains your Azure IoT Operations deployment:

```azurecli
az login
```

---

## Create an asset endpoint

By default, an Azure IoT Operations deployment includes a built-in OPC PLC simulator. To create an asset endpoint that uses the built-in OPC PLC simulator:

# [Azure IoT Operations portal](#tab/portal)

1. Select **Asset endpoints** and then **Create asset endpoint**:

    :::image type="content" source="media/howto-manage-assets-remotely/asset-endpoints.png" alt-text="Screenshot that shows the asset endpoints page in the Azure IoT Operations (preview) portal.":::

    > [!TIP]
    > You can use the filter box to search for asset endpoints.

1. Enter the following endpoint information:

    | Field | Value |
    | --- | --- |
    | Name | `opc-ua-connector-0` |
    | OPC UA Broker URL | `opc.tcp://opcplc-000000:50000` |
    | User authentication | `Anonymous` |
    | Transport authentication | `Do not use transport authentication certificate` |

1. To save the definition, select **Create**.

# [Azure CLI](#tab/cli)

Run the following command:

```azurecli
az iot ops asset endpoint create --name opc-ua-connector-0 --target-address opc.tcp://opcplc-000000:50000 -g {your resource group name} --cluster {your cluster name} 
```

> [!TIP]
> Use `az connectedk8s list` to list the clusters you have access to.

To learn more, see [az iot ops asset endpoint](/cli/azure/iot/ops/asset/endpoint).

---

This configuration deploys a new `assetendpointprofile` resource called `opc-ua-connector-0` to the cluster. After you define an asset, an OPC UA connector pod discovers it. The pod uses the asset endpoint that you specify in the asset definition to connect to an OPC UA server.

When the OPC PLC simulator is running, data flows from the simulator, to the connector, to the OPC UA broker, and finally to the MQ broker.

### Configure an asset endpoint to use a username and password

The previous example uses the `Anonymous` authentication mode. This mode doesn't require a username or password.

# [Azure IoT Operations portal](#tab/portal)

To use the `UsernamePassword` authentication mode, complete the following steps:

1. Follow the steps in [Configure OPC UA user authentication with username and password](howto-configure-opcua-authentication-options.md#configure-username-and-password-authentication) to add secrets for username and password in Azure Key Vault, and project them into Kubernetes cluster.
2. In the Azure IoT Operations (preview) portal, select **Username & password** for the **User authentication** field to configure the asset endpoint to use these secrets. Then enter the following values for the **Username reference** and **Password reference** fields:

| Field | Value |
| --- | --- |
| Username reference | `aio-opc-ua-broker-user-authentication/username` |
| Password reference | `aio-opc-ua-broker-user-authentication/password` |

# [Azure CLI](#tab/cli)

To use the `UsernamePassword` authentication mode, complete the following steps:

1. Follow the steps in [Configure OPC UA user authentication with username and password](howto-configure-opcua-authentication-options.md#configure-username-and-password-authentication) to add secrets for username and password in Azure Key Vault, and project them into Kubernetes cluster.

1. Use a command like the following example to create your asset endpoint:

    ```azurecli
    az iot ops asset endpoint create --name opc-ua-connector-0 --target-address opc.tcp://opcplc-000000:50000 -g {your resource group name} --cluster {your cluster name} --username-ref "aio-opc-ua-broker-user-authentication/username" --password-ref "aio-opc-ua-broker-user-authentication/password"
    ```

---

### Configure an asset endpoint to use a transport authentication certificate

To configure the asset endpoint to use a transport authentication certificate, complete the following steps:

# [Azure IoT Operations portal](#tab/portal)

1. Follow the steps in [configure mutual trust](howto-configure-opcua-certificates-infrastructure.md#configure-the-trusted-certificates-list) to add a transport certificate and private key to Azure Key Vault, and project them into Kubernetes cluster.
2. In the Azure IoT Operations (preview) portal, select **Use transport authentication certificate** for the **Transport authentication** field and enter the certificate thumbprint.

# [Azure CLI](#tab/cli)

1. Follow the steps in [configure mutual trust](howto-configure-opcua-certificates-infrastructure.md#configure-the-trusted-certificates-list) to add a transport certificate and private key to Azure Key Vault, and project them into Kubernetes cluster.

1. Use a command like the following example to create your asset endpoint:

    ```azurecli
    az iot ops asset endpoint create --name opc-ua-connector-0 --target-address opc.tcp://opcplc-000000:50000 -g {your resource group name} --cluster {your cluster name} --username-ref "aio-opc-ua-broker-user-authentication/username" --password-ref "aio-opc-ua-broker-user-authentication/password"
    ```

To learn more, see [az iot ops asset](/cli/azure/iot/ops/asset).

---

## Add an asset, tags, and events

# [Azure IoT Operations portal](#tab/portal)

To add an asset in the Azure IoT Operations (preview) portal:

1. Select the **Assets** tab. Before you create any assets, you see the following screen:

    :::image type="content" source="media/howto-manage-assets-remotely/create-asset-empty.png" alt-text="Screenshot that shows an empty Assets tab in the Azure IoT Operations (preview) portal.":::

    > [!TIP]
    > You can use the filter box to search for assets.

    Select **Create asset**.

1. On the asset details screen, enter the following asset information:

    - Asset name
    - Asset endpoint. Select your asset endpoint from the list.
    - Description

    :::image type="content" source="media/howto-manage-assets-remotely/create-asset-details.png" alt-text="Screenshot that shows how to add asset details in the Azure IoT Operations (preview) portal.":::

1. Configure the set of properties that you want to associate with the asset. You can accept the default list of properties or add your own. The following properties are available by default:

    - Manufacturer
    - Manufacturer URI
    - Model
    - Product code
    - Hardware version
    - Software version
    - Serial number
    - Documentation URI

1. Select **Next** to go to the **Add tags** page.

### Add individual tags to an asset

Now you can define the tags associated with the asset. To add OPC UA tags:

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

    :::image type="content" source="media/howto-manage-assets-remotely/add-tag.png" alt-text="Screenshot that shows adding tags in the Azure IoT Operations (preview) portal.":::

    The following table shows some example tag values that you can use with the built-in OPC PLC simulator:

    | Node ID | Tag name | Observability mode |
    | ------- | -------- | ------------------ |
    | ns=3;s=FastUInt10 | temperature | none |
    | ns=3;s=FastUInt100 | Tag 10 | none |

1. Select **Manage default settings** to configure default telemetry settings for the asset. These settings apply to all the OPC UA tags that belong to the asset. You can override these settings for each tag that you add. Default telemetry settings include:

    - **Sampling interval (milliseconds)**: The sampling interval indicates the fastest rate at which the OPC UA Server should sample its underlying source for data changes.
    - **Publishing interval (milliseconds)**: The rate at which OPC UA Server should publish data.
    - **Queue size**: The depth of the queue to hold the sampling data before publishing it.

### Add tags in bulk to an asset

You can import up to 1000 OPC UA tags at a time from a CSV file:

1. Create a CSV file that looks like the following example:

    | NodeID              | TagName  | Sampling Interval Milliseconds | QueueSize | ObservabilityMode |
    |---------------------|----------|--------------------------------|-----------|-------------------|
    | ns=3;s=FastUInt1000 | Tag 1000 | 1000                           | 5         | none              |
    | ns=3;s=FastUInt1001 | Tag 1001 | 1000                           | 5         | none              |
    | ns=3;s=FastUInt1002 | Tag 1002 | 5000                           | 10        | none              |

1. Select **Add tag or CSV > Import CSV (.csv) file**. Select the CSV file you created and select **Open**. The tags defined in the CSV file are imported:

    :::image type="content" source="media/howto-manage-assets-remotely/import-complete.png" alt-text="A screenshot that shows the completed import from the Excel file in the Azure IoT Operations (preview) portal.":::

    If you import a CSV file that contains tags that are duplicates of existing tags, the Azure IoT Operations (preview) portal displays the following message:

    :::image type="content" source="media/howto-manage-assets-remotely/import-duplicates.png" alt-text="A screenshot that shows the error message when you import duplicate tag definitions in the Azure IoT Operations (preview) portal.":::

    You can either replace the duplicate tags and add new tags from the import file, or you can cancel the import.

1. To export all the tags from an asset to a CSV file, select **Export all** and choose a location for the file:

    :::image type="content" source="media/howto-manage-assets-remotely/export-tags.png" alt-text="A screenshot that shows how to export tag definitions from an asset in the Azure IoT Operations (preview) portal.":::

1. On the **Tags** page, select **Next** to go to the **Add events** page.

> [!TIP]
> You can use the filter box to search for tags.

# [Azure CLI](#tab/cli)

Use the following command to add a "thermostat" asset by using the Azure CLI. The command adds two tags to the asset by using the `--data` parameter:

```azurecli
az iot ops asset create --name thermostat -g {your resource group name} --cluster {your cluster name} --endpoint opc-ua-connector-0 --description 'A simulated thermostat asset' --data  data_source='ns=3;s=FastUInt10', name=temperature --data data_source='ns=3;s=FastUInt100', name='Tag 10'
```

When you create an asset by using the Azure CLI, you can define:

- Multiple tags by using the `--data` parameter multiple times.
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
- Tag specific values for sampling interval, publishing interval, and queue size.
- Event specific values for sampling publishing interval, and queue size.
- The observability mode for each tag and event

---

### Add individual events to an asset

# [Azure IoT Operations portal](#tab/portal)

Now you can define the events associated with the asset. To add OPC UA events:

1. Select **Add event or CSV > Add event**.

1. Enter your event details:

      - Event notifier. This value is the event notifier from the OPC UA server.
      - Event name (Optional). This value is the friendly name that you want to use for the event. If you don't specify an event name, the event notifier is used as the event name.
      - Observability mode (Optional) with following choices:
        - None
        - Gauge
        - Counter
        - Histogram
        - Log
      - Queue size. You can override the default value for this tag.

    :::image type="content" source="media/howto-manage-assets-remotely/add-event.png" alt-text="Screenshot that shows adding events in the Azure IoT Operations (preview) portal.":::

1. Select **Manage default settings** to configure default event settings for the asset. These settings apply to all the OPC UA events that belong to the asset. You can override these settings for each event that you add. Default event settings include:

    - **Publishing interval (milliseconds)**: The rate at which OPC UA Server should publish data.
    - **Queue size**: The depth of the queue to hold the sampling data before publishing it.

### Add events in bulk to an asset

You can import up to 1000 OPC UA events at a time from a CSV file.

To export all the events from an asset to a CSV file, select **Export all** and choose a location for the file.

On the **Events** page, select **Next** to go to the **Review** page.

> [!TIP]
> You can use the filter box to search for events.

### Review your changes

Review your asset and OPC UA tag and event details and make any adjustments you need:

:::image type="content" source="media/howto-manage-assets-remotely/review-asset.png" alt-text="A screenshot that shows how to review your asset, tags, and events in the Azure IoT Operations (preview) portal.":::

# [Azure CLI](#tab/cli)

When you create an asset by using the Azure CLI, you can define multiple events by using the `--event` parameter multiple times. The syntax for the `--event` parameter is similar to the `--data` parameter:

```azurecli
az iot ops asset create --name thermostat -g {your resource group name} --cluster {your cluster name} --endpoint opc-ua-connector-0 --description 'A simulated thermostat asset' --event event_notifier='ns=3;s=FastUInt12', name=warning
```

For each event that you define, you can specify the:

- Event notifier. This value is the event notifier from the OPC UA server.
- Event name. This value is the friendly name that you want to use for the event. If you don't specify an event name, the event notifier is used as the event name.
- Observability mode.
- Queue size.

---

## Update an asset

# [Azure IoT Operations portal](#tab/portal)

Find and select the asset you created previously. Use the **Asset details**, **Tags**, and **Events** tabs to make any changes:

:::image type="content" source="media/howto-manage-assets-remotely/asset-update-property-save.png" alt-text="A screenshot that shows how to update an existing asset in the Azure IoT Operations (preview) portal.":::

On the **Tags** tab, you can add tags, update existing tags, or remove tags.

To update a tag, select an existing tag and update the tag information. Then select **Update**:

:::image type="content" source="media/howto-manage-assets-remotely/asset-update-tag.png" alt-text="A screenshot that shows how to update an existing tag in the Azure IoT Operations (preview) portal.":::

To remove tags, select one or more tags and then select **Remove tags**:

:::image type="content" source="media/howto-manage-assets-remotely/asset-remove-tags.png" alt-text="A screenshot that shows how to delete a tag in the Azure IoT Operations (preview) portal.":::

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

To list the thermostat asset's tags, use the following command:

```azurecli
az iot ops asset data-point list --asset thermostat -g {your resource group}
```

To list the thermostat asset's events, use the following command:

```azurecli
az iot ops asset event list --asset thermostat -g {your resource group}
```

To add a new tag to the thermostat asset, use a command like the following example:

```azurecli
az iot ops asset data-point add --asset thermostat -g {your resource group} --data-source 'ns=3;s=FastUInt1002' --name 'humidity'
```

To delete a tag, use the `az iot ops asset data-point remove` command.

You can manage an asset's events by using the `az iot ops asset event` commands.

---

## Delete an asset

# [Azure IoT Operations portal](#tab/portal)

To delete an asset, select the asset you want to delete. On the **Asset**  details page, select **Delete**. Confirm your changes to delete the asset:

:::image type="content" source="media/howto-manage-assets-remotely/asset-delete.png" alt-text="A screenshot that shows how to delete an asset from the Azure IoT Operations (preview) portal.":::

# [Azure CLI](#tab/cli)

To delete an asset, use a command that looks like the following example:

```azurecli
az iot ops asset delete --name thermostat -g {your resource group name}
```

---

## Notifications

Whenever you make a change to asset in the Azure IoT Operations (preview) portal, you see a notification that reports the status of the operation:

:::image type="content" source="media/howto-manage-assets-remotely/portal-notifications.png" alt-text="A screenshot that shows the notifications in the Azure IoT Operations (preview) portal.":::

## Related content

- [Azure OPC UA Broker overview](overview-opcua-broker.md)
- [Azure IoT Akri overview](overview-akri.md)
- [az iot ops asset](/cli/azure/iot/ops/asset)
- [az iot ops asset endpoint](/cli/azure/iot/ops/asset/endpoint)

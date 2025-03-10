---
title: Manage asset configurations remotely
description: Use the operations experience web UI or the Azure CLI to manage your asset configurations remotely and enable data to flow from your assets to an MQTT broker.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 11/15/2024
ms.custom:
  - ignite-2023
  - devx-track-azurecli

#CustomerIntent: As an OT user, I want configure my IoT Operations environment to so that data can flow from my OPC UA servers through to the MQTT broker.
---

# Manage asset configurations remotely

An _asset_ in Azure IoT Operations is a logical entity that you create to represent a real asset. An Azure IoT Operations asset can have properties, tags, and events that describe its behavior and characteristics.

_OPC UA servers_ are software applications that communicate with assets. OPC UA servers expose _OPC UA tags_ that represent data points. OPC UA tags provide real-time or historical data about the status, performance, quality, or condition of assets.

An _asset endpoint_ is a custom resource in your Kubernetes cluster that connects OPC UA servers to connector for OPC UA modules. This connection enables a connector for OPC UA to access an asset's data points. Without an asset endpoint, data can't flow from an OPC UA server to the connector for OPC UA and MQTT broker. After you configure the custom resources in your cluster, a connection is established to the downstream OPC UA server and the server forwards telemetry to the connector for OPC UA.

A _site_ is a collection of Azure IoT Operations instances. Sites typically group instances by physical location and make it easier for OT users to locate and manage assets. Your IT administrator creates sites and assigns Azure IoT Operations instances to them. To learn more, see [What is Azure Arc site manager (preview)?](/azure/azure-arc/site-manager/overview).

In the operations experience web UI, an _instance_ represents an Azure IoT Operations cluster. An instance can have one or more asset endpoints.

This article describes how to use the operations experience web UI and the Azure CLI to:

- Define the asset endpoints that connect assets to your Azure IoT Operations instance.
- Add assets, and define their tags and events to enable data flow from OPC UA servers to the MQTT broker.

These assets, tags, and events map inbound data from OPC UA servers to friendly names that you can use in the MQTT broker and data flows.

## Prerequisites

To configure an assets endpoint, you need a running instance of Azure IoT Operations.

To sign in to the operations experience web UI, you need a Microsoft Entra ID account with at least contributor permissions for the resource group that contains your **Kubernetes - Azure Arc** instance. You can't sign in with a Microsoft account (MSA). To create a suitable Microsoft Entra ID account in your Azure tenant:

1. Sign in to the [Azure portal](https://portal.azure.com/) with the same tenant and user name that you used to deploy Azure IoT Operations.
1. In the Azure portal, go to the **Microsoft Entra ID** section, select **Users > +New user > Create new user**. Create a new user and make a note of the password, you need it to sign in later.
1. In the Azure portal, go to the resource group that contains your **Kubernetes - Azure Arc** instance. On the **Access control (IAM)** page, select **+Add > Add role assignment**.
1. On the **Add role assignment page**, select **Privileged administrator roles**. Then select **Contributor** and then select **Next**.
1. On the **Members** page, add your new user to the role.
1. Select **Review and assign** to complete setting up the new user.

You can now use the new user account to sign in to the [Azure IoT Operations](https://iotoperations.azure.com) portal.

## Sign in

# [Operations experience](#tab/portal)

To sign in to the operations experience, go to the [operations experience](https://iotoperations.azure.com) in your browser and sign in by using your Microsoft Entra ID credentials.

## Select your site

After you sign in, the operations experience displays a list of sites. Each site is a collection of Azure IoT Operations instances where you can configure and manage your assets. A site typically represents a physical location where you have physical assets deployed. Sites make it easier for you to locate and manage assets. Your [IT administrator is responsible for grouping instances in to sites](/azure/azure-arc/site-manager/overview). Any Azure IoT Operations instances that aren't assigned to a site appear in the **Unassigned instances** node. Select the site that you want to use:

:::image type="content" source="media/howto-manage-assets-remotely/site-list.png" alt-text="Screenshot that shows a list of sites in the operations experience.":::

> [!TIP]
> You can use the filter box to search for sites.

If you don't see any sites, you might not be in the right Azure Active Directory tenant. You can change the tenant from the top right menu in the operations experience. If you still don't see any sites that means you aren't added to any yet. Reach out to your IT administrator to request access.

## Select your instance

After you select a site, the operations experience displays a list of the Azure IoT Operations instances that are part of the site. Select the instance that you want to use:

:::image type="content" source="media/howto-manage-assets-remotely/cluster-list.png" alt-text="Screenshot that shows the list of instances in the operations experience.":::

> [!TIP]
> You can use the filter box to search for instances.

# [Azure CLI](#tab/cli)

Before you use the `az iot ops asset` commands, sign in to the subscription that contains your Azure IoT Operations deployment:

```azurecli
az login
```

---

After you select your instance, the operations experience displays the **Overview** page for the instance. The **Overview** page shows the status of the instance and the resources, such as assets, that are associated with it:

:::image type="content" source="media/howto-manage-assets-remotely/instance-overview.png" alt-text="Screenshot that shows the overview page for an instance in the operations experience.":::

## Create an asset endpoint

An Azure IoT Operations deployment can include an optional built-in OPC PLC simulator. To create an asset endpoint that uses the built-in OPC PLC simulator:

# [Operations experience](#tab/portal)

1. Select **Asset endpoints** and then **Create asset endpoint**:

    :::image type="content" source="media/howto-manage-assets-remotely/asset-endpoints.png" alt-text="Screenshot that shows the asset endpoints page in the operations experience.":::

    > [!TIP]
    > You can use the filter box to search for asset endpoints.

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
az iot ops asset endpoint create opcua --name opc-ua-connector-0 --target-address opc.tcp://opcplc-000000:50000 -g {your resource group name} --instance {your instance name} 
```

> [!TIP]
> Use `az connectedk8s list` to list the clusters you have access to.

To learn more, see [az iot ops asset endpoint](/cli/azure/iot/ops/asset/endpoint).

---

This configuration deploys a new `assetendpointprofile` resource called `opc-ua-connector-0` to the cluster. After you define an asset, a connector for OPC UA pod discovers it. The pod uses the asset endpoint that you specify in the asset definition to connect to an OPC UA server.

When the OPC PLC simulator is running, data flows from the simulator, to the connector for OPC UA, and then to the MQTT broker.

### Configure an asset endpoint to use a username and password

The previous example uses the `Anonymous` authentication mode. This mode doesn't require a username or password.

To use the `UsernamePassword` authentication mode, complete the following steps:

# [Operations experience](#tab/portal)

1. Follow the steps in [Configure OPC UA user authentication with username and password](howto-configure-opcua-authentication-options.md#configure-username-and-password-authentication) to add secrets for username and password in Azure Key Vault, and project them into Kubernetes cluster.
2. In the operations experience, select **Username password** for the **User authentication** field to configure the asset endpoint to use these secrets. Then enter the following values for the **Username reference** and **Password reference** fields:

| Field | Value |
| --- | --- |
| Username reference | `aio-opc-ua-broker-user-authentication/username` |
| Password reference | `aio-opc-ua-broker-user-authentication/password` |

# [Azure CLI](#tab/cli)

1. Follow the steps in [Configure OPC UA user authentication with username and password](howto-configure-opcua-authentication-options.md#configure-username-and-password-authentication) to add secrets for username and password in Azure Key Vault, and project them into Kubernetes cluster.

1. Use a command like the following example to create your asset endpoint:

    ```azurecli
    az iot ops asset endpoint create opcua --name opc-ua-connector-0 --target-address opc.tcp://opcplc-000000:50000 -g {your resource group name} --instance {your instance name} --username-ref "aio-opc-ua-broker-user-authentication/username" --password-ref "aio-opc-ua-broker-user-authentication/password"
    ```

---

## Add an asset, tags, and events

# [Operations experience](#tab/portal)

To add an asset in the operations experience:

1. Select the **Assets** tab. Before you create any assets, you see the following screen:

    :::image type="content" source="media/howto-manage-assets-remotely/create-asset-empty.png" alt-text="Screenshot that shows an empty Assets tab in the operations experience.":::

    > [!TIP]
    > You can use the filter box to search for assets.

1. Select **Create asset**.

1. On the asset details screen, enter the following asset information:

    - Asset endpoint. Select your asset endpoint from the list.
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

    :::image type="content" source="media/howto-manage-assets-remotely/create-asset-details.png" alt-text="Screenshot that shows how to add asset details in the operations experience.":::

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

    :::image type="content" source="media/howto-manage-assets-remotely/add-tag.png" alt-text="Screenshot that shows adding tags in the operations experience.":::

    The following table shows some example tag values that you can use with the built-in OPC PLC simulator:

    | Node ID | Tag name | Observability mode |
    | ------- | -------- | ------------------ |
    | ns=3;s=FastUInt10 | Temperature | None |
    | ns=3;s=FastUInt100 | Humidity | None |

1. Select **Manage default settings** to configure default telemetry settings for the asset. These settings apply to all the OPC UA tags that belong to the asset. You can override these settings for each tag that you add. Default telemetry settings include:

    - **Sampling interval (milliseconds)**: The sampling interval indicates the fastest rate at which the OPC UA server should sample its underlying source for data changes.
    - **Publishing interval (milliseconds)**: The rate at which OPC UA server should publish data.
    - **Queue size**: The depth of the queue to hold the sampling data before publishing it.

### Add tags in bulk to an asset

You can import up to 1000 OPC UA tags at a time from a CSV file:

1. Create a CSV file that looks like the following example:

    | NodeID              | TagName  | QueueSize | ObservabilityMode | Sampling Interval Milliseconds |
    |---------------------|----------|-----------|-------------------|--------------------------------|
    | ns=3;s=FastUInt1000 | Tag 1000 | 5         | None              | 1000                           |
    | ns=3;s=FastUInt1001 | Tag 1001 | 5         | None              | 1000                           |
    | ns=3;s=FastUInt1002 | Tag 1002 | 10        | None              | 5000                           |

1. Select **Add tag or CSV > Import CSV (.csv) file**. Select the CSV file you created and select **Open**. The tags defined in the CSV file are imported:

    :::image type="content" source="media/howto-manage-assets-remotely/import-complete.png" alt-text="A screenshot that shows the completed import from the Excel file in the operations experience.":::

    If you import a CSV file that contains tags that are duplicates of existing tags, the operations experience displays the following message:

    :::image type="content" source="media/howto-manage-assets-remotely/import-duplicates.png" alt-text="A screenshot that shows the error message when you import duplicate tag definitions in the operations experience.":::

    You can either replace the duplicate tags and add new tags from the import file, or you can cancel the import.

1. To export all the tags from an asset to a CSV file, select **Export all** and choose a location for the file:

    :::image type="content" source="media/howto-manage-assets-remotely/export-tags.png" alt-text="A screenshot that shows how to export tag definitions from an asset in the operations experience.":::

1. On the **Tags** page, select **Next** to go to the **Add events** page.

> [!TIP]
> You can use the filter box to search for tags.

# [Azure CLI](#tab/cli)

Use the following commands to add a "thermostat" asset by using the Azure CLI. The commands add two tags/datapoints to the asset by using the `point add` command:

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

1. Select **Add event or CSV > Add event**.

1. Enter your event details:

      - Event notifier. This value is the event notifier from the OPC UA server.
      - Event name (Optional). This value is the friendly name that you want to use for the event. If you don't specify an event name, the event notifier is used as the event name.
      - Observability mode (Optional) with following choices:
        - None
        - Log
      - Queue size. You can override the default value for this tag.

    :::image type="content" source="media/howto-manage-assets-remotely/add-event.png" alt-text="Screenshot that shows adding events in the operations experience.":::

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

:::image type="content" source="media/howto-manage-assets-remotely/review-asset.png" alt-text="A screenshot that shows how to review your asset, tags, and events in the operations experience.":::

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

Find and select the asset you created previously. Use the **Asset details**, **Tags**, and **Events** tabs to make any changes:

:::image type="content" source="media/howto-manage-assets-remotely/asset-update-property-save.png" alt-text="A screenshot that shows how to update an existing asset in the operations experience.":::

On the **Tags** tab, you can add tags, update existing tags, or remove tags.

To update a tag, select an existing tag and update the tag information. Then select **Update**:

:::image type="content" source="media/howto-manage-assets-remotely/asset-update-tag.png" alt-text="A screenshot that shows how to update an existing tag in the operations experience.":::

To remove tags, select one or more tags and then select **Remove tags**:

:::image type="content" source="media/howto-manage-assets-remotely/asset-remove-tags.png" alt-text="A screenshot that shows how to delete a tag in the operations experience.":::

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

:::image type="content" source="media/howto-manage-assets-remotely/asset-delete.png" alt-text="A screenshot that shows how to delete an asset from the operations experience.":::

# [Azure CLI](#tab/cli)

To delete an asset, use a command that looks like the following example:

```azurecli
az iot ops asset delete --name thermostat -g {your resource group name}
```

---

## Notifications

Whenever you make a change to asset in the operations experience, you see a notification that reports the status of the operation:

:::image type="content" source="media/howto-manage-assets-remotely/portal-notifications.png" alt-text="A screenshot that shows the notifications in the operations experience.":::

## View activity logs

In the operations experience, you can view activity logs for each instance or each resource in an instance.

To view activity logs at the instance level, select the **Activity logs** tab. You can use the **Timespan** and **Resource type** filters to customize the view.

:::image type="content" source="./media/howto-manage-assets-remotely/view-instance-activity-logs.png" alt-text="A screenshot that shows the activity logs for an instance in the operations experience.":::

To view activity logs as the resource level, select the resource that you want to inspect. This resource can be an asset, asset endpoint, or data pipeline. In the resource overview, select **View activity logs**. You can use the **Timespan** filter to customize the view.

## Related content

- [Connector for OPC UA overview](overview-opcua-broker.md)
- [az iot ops asset](/cli/azure/iot/ops/asset)
- [az iot ops asset endpoint](/cli/azure/iot/ops/asset/endpoint)

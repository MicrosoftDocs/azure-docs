---
title: Manage asset configurations remotely
description: Use the Azure IoT Operations portal to manage your asset configurations remotely and enable data to flow from your assets to an MQTT broker.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/24/2023

#CustomerIntent: As an OT user, I want configure my IoT Operations environment to so that data can flow from my OPC UA servers through to the MQTT broker.
---

# Manage asset configurations remotely

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

An _asset_ in Azure IoT Operations Preview is a logical entity that you create to represent a real asset. An Azure IoT Operations asset can have properties, tags, and events that describe its behavior and characteristics.

_OPC UA servers_ are software applications that communicate with assets. OPC UA servers expose _OPC UA tags_ that represent data points. OPC UA tags provide real-time or historical data about the status, performance, quality, or condition of assets.

An _asset endpoint_ is a custom resource in your Kubernetes cluster that connects OPC UA servers to OPC UA connector modules. This connection enables an OPC UA connector to access an asset's data points. Without an asset endpoint, data can't flow from an OPC UA server to the Azure IoT OPC UA Broker (preview) instance and Azure IoT MQ (preview) instance. After you configure the custom resources in your cluster, a connection is established to the downstream OPC UA server and the server forwards telemetry to the OPC UA Broker instance.

This article describes how to use the Azure IoT Operations (preview) portal to:

- Define asset endpoints
- Add assets, and define tags and events.

These assets, tags, and events map inbound data from OPC UA servers to friendly names that you can use in the MQ broker and Azure IoT Data Processor (preview) pipelines.

## Prerequisites

To configure an assets endpoint, you need a running instance of Azure IoT Operations.

## Sign in to the Azure IoT Operations portal

Navigate to the [Azure IoT Operations portal](https://aka.ms/iot-operations-portal) in your browser and sign in by using your Microsoft Entra ID credentials.

## Select your cluster

When you sign in, the portal displays a list of the Azure Arc-enabled Kubernetes clusters running Azure IoT Operations that you have access to. Select the cluster that you want to use.

> [!TIP]
> If you don't see any clusters, you might not be in the right Azure Active Directory tenant. You can change the tenant from the top right menu in the portal. If you still don't see any clusters, that means you are not added to any yet. Reach out to your IT administrator to give you access to the Azure resource group the Kubernetes cluster belongs to from Azure portal. You must be in the _contributor_ role.

:::image type="content" source="media/howto-manage-assets-remotely/cluster-list.png" alt-text="Screenshot that shows the list of clusters in the Azure IoT Operations portal.":::

## Create an asset endpoint

By default, an Azure IoT Operations deployment includes a built-in OPC PLC simulator. To create an asset endpoint that uses the built-in OPC PLC simulator:

1. Select **Asset endpoints** and then **Create asset endpoint**:

    :::image type="content" source="media/howto-manage-assets-remotely/asset-endpoints.png" alt-text="Screenshot that shows the asset endpoints page in the Azure IoT Operations portal.":::

1. Enter the following endpoint information:

    | Field | Value |
    | --- | --- |
    | Name | `opc-ua-connector-0` |
    | OPC UA Broker URL | `opc.tcp://opcplc-000000:50000` |
    | User authentication | `Anonymous` |
    | Transport authentication | `Do not use transport authentication certificate` |

1. To save the definition, select **Create**.

This configuration deploys a new module called `opc-ua-connector-0` to the cluster. After you define an asset, an OPC UA connector pod discovers it. The pod uses the asset endpoint that you specify in the asset definition to connect to an OPC UA server.

When the OPC PLC simulator is running, data flows from the simulator, to the connector, to the OPC UA broker, and finally to the MQ broker.

### Configure an asset endpoint to use a username and password

The previous example uses the `Anonymous` authentication mode. This mode doesn't require a username or password. If you want to use the `UsernamePassword` authentication mode, you must configure the asset endpoint accordingly.

The following script shows how to create a secret for the username and password and add it to the Kubernetes store:

```sh
# NAMESPACE is the namespace containing the MQ broker.
export NAMESPACE="alice-springs-solution"

# Set the desired username and password here.
export USERNAME="username"
export PASSWORD="password"

echo "Storing k8s username and password generic secret..."
kubectl create secret generic opc-ua-connector-secrets --from-literal=username=$USERNAME --from-literal=password=$PASSWORD --namespace $NAMESPACE
```

To configure the asset endpoint to use these secrets, select **Username & password** for the **User authentication** field. Then enter the following values for the **Username reference** and **Password reference** fields:

| Field | Value |
| --- | --- |
| Username reference | `@@sec_k8s_opc-ua-connector-secrets/username` |
| Password reference | `@@sec_k8s_opc-ua-connector-secrets/password` |

The following example YAML file shows the configuration for an asset endpoint that uses the `UsernamePassword` authentication mode. The configuration references the secret you created previously:

### Configure an asset endpoint to use a transport authentication certificate

To configure the asset endpoint to use a transport authentication certificate, select **Use transport authentication certificate** for the **Transport authentication** field. Then enter the certificate thumbprint and the certificate password reference.

## Add an asset, tags, and events

To add an asset in the Azure IoT Operations portal:

1. Select the **Assets** tab. If you haven't created any assets yet, you see the following screen:

    :::image type="content" source="media/howto-manage-assets-remotely/create-asset-empty.png" alt-text="Screenshot that shows an empty Assets tab in the Azure IoT Operations portal.":::

    Select **Create asset**.

1. On the asset details screen, enter the following asset information:

    - Asset name
    - Asset endpoint. Select your asset endpoint from the list.
    - Description

    :::image type="content" source="media/howto-manage-assets-remotely/create-asset-details.png" alt-text="Screenshot that shows how to add asset details in the Azure IoT Operations portal.":::

1. Add any optional information for the asset that you want to include such as:

    - Manufacturer
    - Manufacturer URI
    - Model
    - Product code
    - Hardware version
    - Software version
    - Serial number
    - Documentation URI

1. Select **Next** to go to the **Tags** page.

### Add individual tags to an asset

Now you can define the tags associated with the asset. To add OPC UA tags:

1. Select **Add > Add tag**.

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

    :::image type="content" source="media/howto-manage-assets-remotely/add-tag.png" alt-text="Screenshot that shows adding tags in the Azure IoT Operations portal.":::

    The following table shows some example tag values that you can use to with the built-in OPC PLC simulator:

    | Node ID | Tag name | Observability mode |
    | ------- | -------- | ------------------ |
    | ns=3;s=FastUInt10 | temperature | none |
    | ns=3;s=FastUInt100 | Tag 10 | none |

1. Select **Manage default settings** to configure default telemetry settings for the asset. These settings apply to all the OPC UA tags that belong to the asset. You can override these settings for each tag that you add. Default telemetry settings include:

    - **Sampling interval (milliseconds)**: The sampling interval indicates the fastest rate at which the OPC UA Server should sample its underlying source for data changes.
    - **Publishing interval (milliseconds)**: The rate at which OPC UA Server should publish data.
    - **Queue size**: The depth of the queue to hold the sampling data before it's published.

### Add tags in bulk to an asset

You can import up to 1000 OPC UA tags at a time from a CSV file:

1. Create a CSV file that looks like the following example:

    | NodeID              | TagName  | Sampling Interval Milliseconds | QueueSize | ObservabilityMode |
    |---------------------|----------|--------------------------------|-----------|-------------------|
    | ns=3;s=FastUInt1000 | Tag 1000 | 1000                           | 5         | none              |
    | ns=3;s=FastUInt1001 | Tag 1001 | 1000                           | 5         | none              |
    | ns=3;s=FastUInt1002 | Tag 1002 | 5000                           | 10        | none              |

1. Select **Add > Import CSV (.csv) file**. Select the CSV file you created and select **Open**. The tags defined in the CSV file are imported:

    :::image type="content" source="media/howto-manage-assets-remotely/import-complete.png" alt-text="A screenshot that shows the completed import from the Excel file in the Azure IoT Operations portal.":::

    If you import a CSV file that contains tags that are duplicates of existing tags, the Azure IoT Operations portal displays the following message:

    :::image type="content" source="media/howto-manage-assets-remotely/import-duplicates.png" alt-text="A screenshot that shows the error message when you import duplicate tag definitions in the Azure IoT Operations portal.":::

    You can either replace the duplicate tags and add new tags from the import file, or you can cancel the import.

1. To export all the tags from an asset to a CSV file, select **Export all** and choose a location for the file:

    :::image type="content" source="media/howto-manage-assets-remotely/export-tags.png" alt-text="A screenshot that shows how to export tag definitions from an asset in the Azure IoT Operations portal.":::

1. On the **Tags** page, select **Next** to go to the **Events** page.

### Add individual events to an asset

Now you can define the events associated with the asset. To add OPC UA events:

1. Select **Add > Add event**.

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

    :::image type="content" source="media/howto-manage-assets-remotely/add-event.png" alt-text="Screenshot that shows adding events in the Azure IoT Operations portal.":::

1. Select **Manage default settings** to configure default event settings for the asset. These settings apply to all the OPC UA events that belong to the asset. You can override these settings for each event that you add. Default event settings include:

    - **Publishing interval (milliseconds)**: The rate at which OPC UA Server should publish data.
    - **Queue size**: The depth of the queue to hold the sampling data before it's published.

### Add events in bulk to an asset

You can import up to 1000 OPC UA events at a time from a CSV file.

To export all the events from an asset to a CSV file, select **Export all** and choose a location for the file.

On the **Events** page, select **Next** to go to the **Review** page.

### Review your changes

Review your asset and OPC UA tag and event details and make any adjustments you need:

:::image type="content" source="media/howto-manage-assets-remotely/review-asset.png" alt-text="A screenshot that shows how to review your asset, tags, and events in the Azure IoT Operations portal.":::

## Update an asset

Select the asset you created previously. Use the **Properties**, **Tags**, and **Events** tabs to make any changes:

:::image type="content" source="media/howto-manage-assets-remotely/asset-update-property-save.png" alt-text="A screenshot that shows how to update an existing asset in the Azure IoT Operations portal.":::

On the **Tags** tab, you can add tags, update existing tags, or remove tags.

To update a tag, select an existing tag and update the tag information. Then select **Update**:

:::image type="content" source="media/howto-manage-assets-remotely/asset-update-tag.png" alt-text="A screenshot that shows how to update an existing tag in the Azure IoT Operations portal.":::

To remove tags, select one or more tags and then select **Remove tags**:

:::image type="content" source="media/howto-manage-assets-remotely/asset-remove-tags.png" alt-text="A screenshot that shows how to delete a tag in the Azure IoT Operations portal.":::

You can also add, update, and delete events and properties in the same way.

When you're finished making changes, select **Save** to save your changes.

## Delete an asset

To delete an asset, select the asset you want to delete. On the **Asset**  details page, select **Delete**. Confirm your changes to delete the asset:

:::image type="content" source="media/howto-manage-assets-remotely/asset-delete.png" alt-text="A screenshot that shows how to delete an asset from the Azure IoT Operations portal.":::

## Notifications

Whenever you make a change to asset, you see a notification in the Azure IoT Operations portal that reports the status of the operation:

:::image type="content" source="media/howto-manage-assets-remotely/portal-notifications.png" alt-text="A screenshot that shows the notifications in the Azure IoT Operations portal.":::

## Related content

- [Azure OPC UA Broker overview](overview-opcua-broker.md)
- [Azure IoT Akri overview](overview-akri.md)

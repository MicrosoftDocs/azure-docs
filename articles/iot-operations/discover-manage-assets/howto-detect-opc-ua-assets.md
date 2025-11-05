---
title: Automatically discover OPC UA assets
description: How to automatically discover and configure OPC UA assets at the edge
author: dominicbetts
ms.subservice: azure-akri
ms.author: dobett
ms.topic: how-to 
ms.date: 04/02/2025

# CustomerIntent: As an industrial edge IT or operations user, I want to discover and create OPC UA assets in my industrial edge environment so that I can reduce manual configuration overhead. 
---

# Automatically discover and configure OPC UA assets

The Akri services and connector for OPC UA are a turnkey solution that lets you discover assets connected to an OPC UA server and add the asset configurations into Azure Device Registry. The connector for OPC UA discovers assets at the edge and Akri services maps them to assets in Azure Device Registry. The assets send messages, such as sensor data, to upstream brokers and components. The Akri services let you eliminate the time-consuming and error-prone process of manually configuring and onboarding the assets to your cluster and Azure Device Registry.

To discover OPC UA assets, the assets must be compliant with the [OPC 10000-100: Devices](https://reference.opcfoundation.org/DI/v103/docs/) companion specification. The connector for OPC UA and Akri services follow the process described in [OPC 10000-110: Asset Management Basics](https://reference.opcfoundation.org/AMB/v101/docs/) to discover OPC UA assets and onboard them into Azure Device Registry.

In this article, you learn how to automatically discover and configure OPC UA devices and assets connected to your Azure IoT Operations deployment. The automatic discovery process starts when you add a device with the **Enable discovery** option selected.

To learn more, see [What is asset discovery?](overview-akri.md).

## Prerequisites

[!INCLUDE [enable-resource-sync-rules](../includes/enable-resource-sync-rules.md)]

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

## Create a device

To create a device with an OPC UA endpoint that has discovery enabled:

1. Go to your Azure IoT Operations instance in the operations experience web UI.

1. Add a new device and add an OPC UA endpoint.

1. Select the **Run asset discovery** option for the endpoint:

    :::image type="content" source="media/howto-detect-opc-ua-assets/enable-asset-detection.png" alt-text="Screenshot that shows how to create a device endpoint with discovery enabled.":::

1. Finish creating the device.

## Review the discovered assets

Azure IoT Operations uses the device to connect to the OPC UA server and scan for assets. To view the discovered assets:

1. Go to the **Discovery** page for your instance in the operations experience and then go to the **Discovered assets** tab:

    :::image type="content" source="media/howto-detect-opc-ua-assets/discovered-assets-list.png" alt-text="Screenshot that shows how to view discovered assets.":::

1. You can filter the list by the device name, or by keyword. The list shows the discovered assets and their status.

## Import an asset from a discovered asset

From the list of discovered assets, you can import an asset into your Azure IoT Operations instance. To import an asset:

1. Select the asset you want to import from the list of discovered assets. Then select **+ Import and create asset**.

1. The site takes you to the **Asset details** page for an asset, where you can review the asset details and make any changes. Enter a name and description for the discovered asset:

    :::image type="content" source="media/howto-detect-opc-ua-assets/add-asset-details.png" alt-text="Screenshot that shows an asset created from a discovered asset.":::

1. Step through the rest of the **Create asset** pages and select the imported data points and events that you want to use:

    :::image type="content" source="media/howto-detect-opc-ua-assets/add-imported-tags.png" alt-text="Screenshot that shows how to modify the data points of an imported asset.":::

1. The imported asset is created in your Azure IoT Operations instance. You can view the asset in the **Assets** page of the operations experience:

    :::image type="content" source="media/howto-detect-opc-ua-assets/provisioned-asset.png" alt-text="Screenshot that shows how to view the imported asset.":::

To learn more about managing asset configurations, see [Manage asset configurations](howto-use-operations-experience.md).

## Review the custom resource definitions in your cluster (optional)

To review the discovered assets in your cluster, you can use the `kubectl` command line tool:

```console
kubectl get discoveredassets.namespaces -n azure-iot-operations
```

To view the details of a discovered asset, use the following command:

```console
kubectl describe discoveredasset.namespaces <name> -n azure-iot-operations
```

> [!TIP]
> The previous commands assume that you installed your Azure IoT Operations instance in the default `azure-iot-operations` namespace. If you installed it in a different namespace, replace `azure-iot-operations` with the name of your namespace.

## Use the imported asset in your data flows

After you complete the import process for a discovered asset, you can use the imported asset in your data flows. Imported asset definitions behave in exactly the same way as manually entered asset definitions. To learn more, see [Create and manage data flows](../connect-to-cloud/howto-create-dataflow.md).

---
title: "Quickstart: Add assets"
description: "Quickstart: Add OPC UA assets that publish messages to the Azure IoT MQ broker in your Azure IoT Operations cluster."
author: dominicbetts
ms.author: dobett
ms.topic: quickstart
ms.date: 10/24/2023

#CustomerIntent: As an OT user, I want to create assets in Azure IoT Operations so that I can subscribe to asset data points, and then process the data before I send it to the cloud.
---

# Quickstart: Add OPC UA assets to your Azure IoT Operations cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you manually add OPC UA assets to your Azure IoT Operations cluster. These assets publish messages to the Azure IoT MQ (preview) broker in your Azure IoT Operations cluster. Typically, an OT user completes these steps.

An _asset_ is a physical device or logical entity that represents a device, a machine, a system, or a process. For example, a physical asset could be a pump, a motor, a tank, or a production line. A logical asset that you define can have properties, stream telemetry, or generate events.

_OPC UA servers_ are software applications that communicate with assets. _OPC UA tags_ are data points that OPC UA servers expose. OPC UA tags can provide real-time or historical data about the status, performance, quality, or condition of assets.

## Prerequisites

Complete [Quickstart: Deploy Azure IoT Operations – enabled by Azure Arc Preview to an Arc-enabled Kubernetes cluster](quickstart-deploy.md) before you begin this quickstart.

## What problem will we solve?

The data that OPC UA servers expose can have a complex structure and can be difficult to understand. Azure IoT Operations provides a way to model OPC UA assets as tags, events, and properties. This modeling makes it easier to understand the data and to use it in downstream processes such as the MQ broker and Azure IoT Data Processor (preview) pipelines.

## Sign into the Azure IoT Operations portal

To create asset endpoints, assets and subscribe to OPC UA tags and events, use the Azure IoT Operations (preview) portal. Navigate to the [Azure IoT Operations](https://digitaloperations.azure.com) portal in your browser and sign with your Microsoft Entra ID credentials.

## Select your cluster

When you sign in, select **Get started**. The portal displays the list of Kubernetes clusters that you have access to. Use the cluster that you deployed Azure IoT Operations to in the previous quickstart. Select the cluster that you want to use:

:::image type="content" source="media/cluster-list.png" alt-text="Screenshot of Azure IoT Operations cluster list.":::

> [!TIP]
> If you don't see any clusters, you might not be in the right Azure Active Directory tenant. You can change the tenant from the top right menu in the portal. If you still don't see any clusters, that means you are not added to any yet. Reach out to your IT administrator to give you access to the Azure resource group the Kubernetes cluster belongs to from Azure portal. You must be in the _contributor_ role.

## Add an asset endpoint

When you deployed Azure IoT Operations, you chose to include a built-in OPC PLC simulator. In this step, you add an asset endpoint that enables you to connect to the OPC PLC simulator.

To add an asset endpoint:

1. Select **Asset endpoints** and then **Create asset endpoint**:

    :::image type="content" source="media/asset-endpoints.png" alt-text="Screenshot that shows the asset endpoints page in the Azure IoT Operations portal.":::

1. Enter the following endpoint information:

    | Field | Value |
    | --- | --- |
    | Name | `opc-ua-connector-0` |
    | OPC UA Broker URL | `opc.tcp://opc-plc-simulator:50000` |
    | User authentication | `Anonymous` |
    | Transport authentication | `Do not use transport authentication certificate` |

1. To save the definition, select **Create**.

This configuration deploys a new module called `opc-ua-connector-0` to the cluster. After you define an asset, an OPC UA connector pod discovers it. The pod uses the asset endpoint that you specify in the asset definition to connect to an OPC UA server.

When the OPC PLC simulator is running, data flows from the simulator, to the connector, to the OPC UA broker, and finally to the MQ broker.

## Manage your assets

After you select your cluster in Azure IoT Operations portal, you see the available list of assets on the **Assets** page. If there are no assets yet, this list is empty:

:::image type="content" source="media/create-asset-empty.png" alt-text="Screenshot of Azure IoT Operations empty asset list.":::

### Create an asset

To create an asset, select **Create asset**.

Enter the following asset information:

| Field | Value |
| --- | --- |
| Asset name | `thermostat` |
| Asset Endpoint | `opc-ua-connector-0` |
| Description | `A simulated thermostat asset` |

:::image type="content" source="media/create-asset-details.png" alt-text="Screenshot of Azure IoT Operations asset details page.":::

Scroll down on the **Asset details** page and add any additional information for the asset that you want to include such as:

- Manufacturer
- Manufacturer URI
- Model
- Product code
- Hardware version
- Software version
- Serial number
- Documentation URI

Select **Next** to go to the **Tags** page.

### Create OPC UA tags

Add two OPC UA tags on the **Tags** page. To add each tag, select **Add** and then select **Add tag**. Enter the tag details shown in the following table:

| Node ID            | Tag name    | Observability mode |
| ------------------ | ----------- | ------------------ |
| ns=3;s=FastUInt10  | temperature | none               |
| ns=3;s=FastUInt100 | Tag 10      | none               |

The **Observability mode** is one of: none, gauge, counter, histogram, or log.

You can override the default sampling interval and queue size for each tag.

:::image type="content" source="media/add-tag.png" alt-text="Screenshot of Azure IoT Operations add tag page.":::

Select **Next** to go to the **Events** page and then **Next** to go to the **Review** page.

### Review

Review your asset and tag details and make any adjustments you need before you select **Create**:

:::image type="content" source="media/review-asset.png" alt-text="Screenshot of Azure IoT Operations create asset review page.":::

## How did we solve the problem?

In this quickstart, you added an asset endpoint and then defined an asset and tags. The assets and tags model data from the OPC UA server to make the data easier to use in an MQTT broker and other downstream processes.

## Clean up resources

If you're not going to continue to use this deployment, delete the Kubernetes cluster that you deployed Azure IoT Operations to and remove the Azure resource group that contains the cluster.

## Next step

[Quickstart: Use Data Processor pipelines to process messages from your OPC UA assets](quickstart-process-telemetry.md)

---
title: "Tutorial: Add assets"
description: "Tutorial: Add OPC UA assets that publish messages to the MQTT broker in your Azure IoT Operations cluster."
author: dominicbetts
ms.author: dobett
ms.topic: tutorial
ms.custom:
  - ignite-2023
ms.date: 11/14/2024

#CustomerIntent: As an OT user, I want to create assets in Azure IoT Operations so that I can subscribe to asset data points, and then process the data before I send it to the cloud.
---

# Tutorial: Add OPC UA assets to your Azure IoT Operations cluster

In this tutorial, you manually add OPC UA assets to your Azure IoT Operations cluster. These assets publish messages to the MQTT broker in your Azure IoT Operations cluster. Typically, an OT user completes these steps.

An _asset_ is a physical device or logical entity that represents a device, a machine, a system, or a process. For example, a physical asset could be a pump, a motor, a tank, or a production line. A logical asset that you define can have properties, stream telemetry, or generate events.

_OPC UA servers_ are software applications that communicate with assets. _OPC UA tags_ are data points that OPC UA servers expose. OPC UA tags can provide real-time or historical data about the status, performance, quality, or condition of assets.

In this tutorial, you use the operations experience web UI to create your assets. You can also use the [Azure CLI to complete some of these tasks](/cli/azure/iot/ops/asset).

## Prerequisites

An instance of Azure IoT Operations deployed in a Kubernetes cluster. To create an instance, use one of the following to deploy Azure IoT Operations:

- [Quickstart: Run Azure IoT Operations in GitHub Codespaces with K3s](../get-started-end-to-end-sample/quickstart-deploy.md) provides simple instructions to deploy an Azure IoT Operations instance that you can use for the tutorials.
- [Deployment overview](../deploy-iot-ops/overview-deploy.md) provides detailed instructions to deploy an Azure IoT Operations instance on Windows using Azure Kubernetes Service Edge Essentials or Ubuntu using K3s.

To sign in to the operations experience web UI, you need a Microsoft Entra ID account with at least contributor permissions for the resource group that contains your **Kubernetes - Azure Arc** instance. To learn more, see [Operations experience web UI](../discover-manage-assets/howto-manage-assets-remotely.md#prerequisites).

Unless otherwise noted, you can run the console commands in this tutorial in either a Bash or PowerShell environment.

## What problem will we solve?

The data that OPC UA servers expose can have a complex structure and can be difficult to understand. Azure IoT Operations provides a way to model OPC UA assets as tags, events, and properties. This modeling makes it easier to understand the data and to use it in downstream processes such as the MQTT broker and dataflows.

## Deploy the OPC PLC simulator

This tutorial uses the OPC PLC simulator to generate sample data. To deploy the OPC PLC simulator, run the following command:

<!-- TODO: Change branch to main before merging the release branch -->

```console
kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/opc-plc-deployment.yaml
```

The following snippet shows the YAML file that you applied:

:::code language="yaml" source="~/azure-iot-operations-samples/samples/quickstarts/opc-plc-deployment.yaml":::

> [!CAUTION]
> This configuration isn't secure. Don't use this configuration in a production environment.

## Sign into the operations experience

To create asset endpoints, assets and subscribe to OPC UA tags and events, use the operations experience.

Browse to the [operations experience](https://iotoperations.azure.com) in your browser and sign in with your Microsoft Entra ID credentials.

## Select your site

A _site_ is a collection of Azure IoT Operations instances. Sites typically group instances by physical location and make it easier for OT users to locate and manage assets. Your IT administrator creates [sites and assigns Azure IoT Operations instances to them](/azure/azure-arc/site-manager/overview). Because you're working with a new deployment, there are no sites yet. You can find the cluster you created in the previously by selecting **View unassigned instances**. In the operations experience, an instance represents a cluster where you deployed Azure IoT Operations.

:::image type="content" source="media/tutorial-add-assets/site-list.png" alt-text="Screenshot that shows the unassigned instances node in the operations experience.":::

## Select your instance

Select the instance where you deployed Azure IoT Operations in the previous tutorial:

:::image type="content" source="media/tutorial-add-assets/cluster-list.png" alt-text="Screenshot of Azure IoT Operations instance list.":::

> [!TIP]
> If you don't see any instances, you might not be in the right Microsoft Entra ID tenant. You can change the tenant from the top right menu in the operations experience.

## Add an asset endpoint

When you deployed Azure IoT Operations in the previous article, you included a built-in OPC PLC simulator. In this step, you add an asset endpoint that enables you to connect to the OPC PLC simulator.

To add an asset endpoint:

1. Select **Asset endpoints** and then **Create asset endpoint**:

    :::image type="content" source="media/tutorial-add-assets/asset-endpoints.png" alt-text="Screenshot that shows the asset endpoints page in the operations experience.":::

1. Enter the following endpoint information:

    | Field | Value |
    | --- | --- |
    | Asset endpoint name | `opc-ua-connector-0` |
    | OPC UA server URL | `opc.tcp://opcplc-000000:50000` |
    | User authentication mode | `Anonymous` |

1. To save the definition, select **Create**.

    This configuration deploys a new asset endpoint called `opc-ua-connector-0` to the cluster. You can use `kubectl` to view the asset endpoints:

    ```console
    kubectl get assetendpointprofile -n azure-iot-operations
    ```

## Manage your assets

After you select your instance in operations experience, you see the available list of assets on the **Assets** page. If there are no assets yet, this list is empty:

:::image type="content" source="media/tutorial-add-assets/create-asset-empty.png" alt-text="Screenshot of Azure IoT Operations empty asset list.":::

### Create an asset

To create an asset, select **Create asset**. Then enter the following asset information:

| Field | Value |
| --- | --- |
| Asset Endpoint | `opc-ua-connector-0` |
| Asset name | `thermostat` |
| Description | `A simulated thermostat asset` |
| Default MQTT topic | `azure-iot-operations/data/thermostat` |

Remove the existing **Custom properties** and add the following custom properties. Be careful to use the exact property names, as the Power BI template in a later tutorial queries for them:

| Property name | Property detail |
|---------------|-----------------|
| batch         | 102             |
| customer      | Contoso         |
| equipment     | Boiler          |
| isSpare       | true            |
| location      | Seattle         |

:::image type="content" source="media/tutorial-add-assets/create-asset-details.png" alt-text="Screenshot of Azure IoT Operations asset details page.":::

Select **Next** to go to the **Add tags** page.

### Create OPC UA tags

Add two OPC UA tags on the **Add tags** page. To add each tag, select **Add tag or CSV** and then select **Add tag**. Enter the tag details shown in the following table:

| Node ID            | Tag name    | Observability mode |
| ------------------ | ----------- | ------------------ |
| ns=3;s=FastUInt10  | temperature | None               |
| ns=3;s=FastUInt100 | Tag 10      | None               |

The **Observability mode** is one of the following values: `None`, `Gauge`, `Counter`, `Histogram`, or `Log`.

You can select **Manage default settings** to change the default sampling interval and queue size for each tag.

:::image type="content" source="media/tutorial-add-assets/add-tag.png" alt-text="Screenshot of Azure IoT Operations add tag page.":::

Select **Next** to go to the **Add events** page and then **Next** to go to the **Review** page.

### Review

Review your asset and tag details and make any adjustments you need before you select **Create**:

:::image type="content" source="media/tutorial-add-assets/review-asset.png" alt-text="Screenshot of Azure IoT Operations create asset review page.":::

This configuration deploys a new asset called `thermostat` to the cluster. You can use `kubectl` to view the assets:

```console
kubectl get assets -n azure-iot-operations
```

## View resources in the Azure portal

To view the asset endpoint and asset you created in the Azure portal, go to the resource group that contains your Azure IoT Operations instance. You can see the thermostat asset in the **Azure IoT Operations** resource group. If you select **Show hidden types**, you can also see the asset endpoint:

:::image type="content" source="media/tutorial-add-assets/azure-portal.png" alt-text="Screenshot of Azure portal showing the Azure IoT Operations resource group including the asset and asset endpoint.":::

The portal enables you to view the asset details. Select **JSON View** for more details:

:::image type="content" source="media/tutorial-add-assets/thermostat-asset.png" alt-text="Screenshot of Azure IoT Operations asset details in the Azure portal.":::

## Verify data is flowing

[!INCLUDE [deploy-mqttui](../includes/deploy-mqttui.md)]

To verify that the thermostat asset you added is publishing data, view the telemetry in the `azure-iot-operations/data` topic:

```output
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:17.1858435Z","Value":4558},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:17.1858869Z","Value":4558}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:18.1838125Z","Value":4559},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:18.1838523Z","Value":4559}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:19.1834363Z","Value":4560},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:19.1834879Z","Value":4560}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:20.1861251Z","Value":4561},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:20.1861709Z","Value":4561}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:21.1856798Z","Value":4562},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:21.1857211Z","Value":4562}}
```

If there's no data flowing, restart the `aio-opc-opc.tcp-1` pod:

1. Find the name of your `aio-opc-opc.tcp-1` pod by using the following command:

    ```console
    kubectl get pods -n azure-iot-operations
    ```

    The name of your pod looks like `aio-opc-opc.tcp-1-849dd78866-vhmz6`.

1. Restart the `aio-opc-opc.tcp-1` pod by using a command that looks like the following example. Use the `aio-opc-opc.tcp-1` pod name from the previous step:

    ```console
    kubectl delete pod aio-opc-opc.tcp-1-849dd78866-vhmz6 -n azure-iot-operations
    ```

The sample tags you added in the previous tutorial generate messages from your asset that look like the following example:

```json
{
    "temperature": {
        "SourceTimestamp": "2024-08-02T13:52:15.1969959Z",
        "Value": 2696
    },
    "Tag 10": {
        "SourceTimestamp": "2024-08-02T13:52:15.1970198Z",
        "Value": 2696
    }
}
```

## How did we solve the problem?

In this tutorial, you added an asset endpoint and then defined an asset and tags. The assets and tags model data from the OPC UA server to make the data easier to use in an MQTT broker and other downstream processes. You use the thermostat asset you defined in the next tutorial.

## Clean up resources

If you're continuing on to the next tutorial, keep all of your resources.

[!INCLUDE [tidy-resources](../includes/tidy-resources.md)]

## Next step

[Tutorial: Send asset telemetry to the cloud using a dataflow](tutorial-upload-telemetry-to-cloud.md).

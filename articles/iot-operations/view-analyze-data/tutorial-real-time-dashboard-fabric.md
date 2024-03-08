---
title: Build a real-time dashboard in Microsoft Fabric with MQTT data
titleSuffix: Azure IoT MQ
description: Learn how to build a real-time dashboard in Microsoft Fabric using MQTT data from IoT MQ
author: PatAltimore
ms.subservice: mq
ms.author: patricka
ms.topic: how-to
ms.date: 11/15/2023

#CustomerIntent: As an operator, I want to learn how to build a real-time dashboard in Microsoft Fabric using MQTT data from IoT MQ.
---

# Build a real-time dashboard in Microsoft Fabric with MQTT data

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this walkthrough, you build a real-time Power BI dashboard in Microsoft Fabric using simulated MQTT data that's published to IoT MQ. The architecture uses the IoT MQ's Kafka connector to deliver messages to an Event Hubs namespace. Messages are then streamed to a Kusto database in Microsoft Fabric using an eventstream and visualized in a Power BI dashboard. 

Azure IoT Operations can be deployed with the Azure CLI, Azure portal or with infrastructure-as-code (IaC) tools. This tutorial uses the IaC method using the Bicep language.

## Prepare your Kubernetes cluster

This walkthrough uses a virtual Kubernetes environment hosted in a GitHub Codespace to help you get going quickly. If you want to use a different environment, all the artifacts are available in the [explore-iot-operations](https://github.com/Azure-Samples/explore-iot-operations/tree/main/tutorials/mq-realtime-fabric-dashboard) GitHub repository so you can easily follow along. 

1. Create the Codespace, optionally entering your Azure details to store them as environment variables for the terminal.

    [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/explore-iot-operations?quickstart=1)

1. Once the Codespace is ready, select the menu button at the top left, then select **Open in VS Code Desktop**.

    :::image type="content" source="../deploy-iot-ops/media/howto-prepare-cluster/open-in-vs-code-desktop.png" alt-text="Screenshot of open VS Code on desktop." lightbox="../deploy-iot-ops/media/howto-prepare-cluster/open-in-vs-code-desktop.png":::

1. [Connect the cluster to Azure Arc](../deploy-iot-ops/howto-prepare-cluster.md#arc-enable-your-cluster).

## Deploy edge and cloud Azure resources

The MQTT broker and north-bound cloud connector components can be deployed as regular Azure resources as they have Azure Resource Provider (RPs) implementations. A single Bicep template file from the *explore-iot-operations* repository deploys all the required edge and cloud resources and Azure role-based access assignments. Run this command in your Codespace terminal:

```azurecli
CLUSTER_NAME=<arc-connected-cluster-name>
TEMPLATE_FILE_NAME='tutorials/mq-realtime-fabric-dashboard/deployEdgeAndCloudResources.bicep'

 az deployment group create \ 
    --name az-resources \
    --resource-group $RESOURCE_GROUP \
    --template-file $TEMPLATE_FILE_NAME \
    --parameters clusterName=$CLUSTER_NAME
```

> [!IMPORTANT]
> The deployment configuration is for demonstration or development purposes only. It's not suitable for production environments.

The resources deployed by the template include: 
* [Event Hubs related resources](https://github.com/Azure-Samples/explore-iot-operations/blob/88ff2f4759acdcb4f752aa23e89b30286ab0cc99/tutorials/mq-realtime-fabric-dashboard/deployEdgeAndCloudResources.bicep#L349) 
* [IoT Operations MQ Arc extension](https://github.com/Azure-Samples/explore-iot-operations/blob/88ff2f4759acdcb4f752aa23e89b30286ab0cc99/tutorials/mq-realtime-fabric-dashboard/deployEdgeAndCloudResources.bicep#L118)
* [IoT MQ Broker](https://github.com/Azure-Samples/explore-iot-operations/blob/88ff2f4759acdcb4f752aa23e89b30286ab0cc99/tutorials/mq-realtime-fabric-dashboard/deployEdgeAndCloudResources.bicep#L202)
* [Kafka north-bound connector and topicmap](https://github.com/Azure-Samples/explore-iot-operations/blob/88ff2f4759acdcb4f752aa23e89b30286ab0cc99/tutorials/mq-realtime-fabric-dashboard/deployEdgeAndCloudResources.bicep#L282)
* [Azure role-based access assignments](https://github.com/Azure-Samples/explore-iot-operations/blob/88ff2f4759acdcb4f752aa23e89b30286ab0cc99/tutorials/mq-realtime-fabric-dashboard/deployEdgeAndCloudResources.bicep#L379)

## Send test MQTT data and confirm cloud delivery

1. Simulate test data by deploying a Kubernetes workload. The pod simulates a sensor by sending sample temperature, vibration, and pressure readings periodically to the MQ broker using an MQTT client. Execute the following command in the Codespace terminal:

    ```bash
    kubectl apply -f tutorials/mq-realtime-fabric-dashboard/simulate-data.yaml
    ```

1. The Kafka north-bound connector is [preconfigured in the deployment](https://github.com/Azure-Samples/explore-iot-operations/blob/e4bf8375e933c29c49bfd905090b37caef644135/tutorials/mq-realtime-fabric-dashboard/deployEdgeAndCloudResources.bicep#L331) to pick up messages from the MQTT topic where messages are being published to Event Hubs in the cloud.

1. After about a minute, confirm the message delivery in Event Hubs metrics.

    :::image type="content" source="media/tutorial-real-time-dashboard-fabric/event-hub-messages.png" alt-text="Screenshot of confirming Event Hubs messages." lightbox="media/tutorial-real-time-dashboard-fabric/event-hub-messages.png":::

## Create and configure Microsoft Fabric event streams

1. [Create a KQL Database](/fabric/real-time-analytics/create-database).

1. [Create an eventstream in Microsoft Fabric](/fabric/real-time-analytics/event-streams/create-manage-an-eventstream).

    1. [Add the Event Hubs namespace created in the previous section as a source](/fabric/real-time-analytics/event-streams/add-manage-eventstream-sources#add-an-azure-event-hub-as-a-source).

    1. [Add the KQL Database created in the previous step as a destination](/fabric/real-time-analytics/event-streams/add-manage-eventstream-destinations#add-a-kql-database-as-a-destination).

1. In the wizard's **Inspect** step, add a **New table** called *sensor_readings*, enter a **Data connection name** and select **Next**.

1. In the **Preview data** tab, select the **JSON** format and select **Finish**.

In a few seconds, you should see the data being ingested into KQL Database.

:::image type="content" source="media/tutorial-real-time-dashboard-fabric/eventstream-ingesting.png" alt-text="Screenshot showing eventstream ingesting success." lightbox="media/tutorial-real-time-dashboard-fabric/eventstream-ingesting.png":::

## Create Power BI report

1. From the KQL Database, right-click on the *sensor-readings* table and select **Build Power BI report**.

    :::image type="content" source="media/tutorial-real-time-dashboard-fabric/powerbi-report.png" alt-text="Screenshot showing menu selection of Build Power BI report." lightbox="media/tutorial-real-time-dashboard-fabric/powerbi-report.png":::

1. Drag the *∑ Temperature* onto the canvas and change the visualization to a line graph. Drag the *EventEnqueuedUtcTime* column onto the visual and save the report.

    :::image type="content" source="media/tutorial-real-time-dashboard-fabric/powerbi-dash-create.png" alt-text="Screenshot showing save dialog for a Power BI report." lightbox="media/tutorial-real-time-dashboard-fabric/powerbi-dash-create.png":::

1. Open the Power BI report to see the real-time dashboard, you can refresh the dashboard with latest sensor reading using the button on the top right.

    :::image type="content" source="media/tutorial-real-time-dashboard-fabric/powerbi-dash-show.png" alt-text="Screenshot of a Power BI report." lightbox="media/tutorial-real-time-dashboard-fabric/powerbi-dash-show.png":::

In this walkthrough, you learned how to build a real-time dashboard in Microsoft Fabric using simulated MQTT data that is published to IoT MQ.

## Next steps

[Upload MQTT data to Microsoft Fabric lakehouse](tutorial-upload-mqtt-lakehouse.md)
---
title: Upload MQTT data to Microsoft Fabric lakehouse
# titleSuffix: Azure IoT MQ
description: Learn how to upload MQTT data from the edge to a Fabric lakehouse
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 11/13/2023

#CustomerIntent: As an operator, I want to learn how to send MQTT data from the edge to a lakehouse in the cloud.
---

# Build a real-time dashboard in Microsoft Fabric with MQTT data

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this walkthrough, you send MQTT data from IoT MQ directly to a Microsoft Fabric OneLake lakehouse. MQTT payloads are in the JSON format and automatically encoded into the Delta Lake format before uploading the lakehouse. This means data is ready for querying and analysis in seconds thanks to Microsoft Fabric's native support for the Detla Lake format. IoT MQ's datalake connector is configured with the desired batching behavior as well as enriching the output with additional metadata.

Azure IoT Operations can be deployed with the Azure CLI, Azure Portal or with infrastructure-as-code (IaC) tools. This tutorial uses the IaC method using the Bicep language.

## Prepare your Kubernetes cluster

This walkthrough uses a virtual Kubernetes environment hosted in a GitHub Codespace to help you get going quickly. If you want to use a different environment, all the artifacts are available in the [explore-iot-operations](https://github.com/Azure-Samples/explore-iot-operations/tree/main/tutorials/mq-onelake-upload) GitHub repository so you can easily follow along. 

1. Create the Codespace, optionally entering your Azure details to store them as environment variables for the terminal.

    [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/explore-iot-operations?quickstart=1)

1. Once the Codespace is ready, select the menu button at the top left, then select **Open in VS Code Desktop**.

    :::image type="content" source="../deploy-iot-ops/media/howto-prepare-cluster/open-in-vs-code-desktop.png" alt-text="Open VS Code desktop" lightbox="../deploy-iot-ops/media/howto-prepare-cluster/open-in-vs-code-desktop.png":::

1. [Connect the cluster to Azure Arc](../deploy-iot-ops/howto-prepare-cluster.md#arc-enable-your-cluster).

## Deploy base edge resources

IoT MQ resources can be deployed as regular Azure resources as they have Azure Resource Provider (RP) implementations. First, deploy the base broker resources. Run this command in your Codespace terminal:

```azurecli

TEMPLATE_FILE_NAME=./tutorials/mq-onelake-upload/deployBaseResources.bicep
CLUSTER_NAME=xxx
RESOURCE_GROUP=xxx

az deployment group create --name az-resources \
    --resource-group $RESOURCE_GROUP \
    --template-file $TEMPLATE_FILE_NAME \
    --parameters clusterName=$CLUSTER_NAME

```

From the deployment JSON outputs, note the name of the IoT MQ extension - it should look like 'mq-<resource-group-name>'.

## Setup Microsoft Fabric resources

Next, create and setup the required Fabric resources. 

### Create a Fabric workspace and give access to IoT MQ 

Create a new workspace in Microsoft Fabric, select **Manage access** from the top bar, and give **Contributor** access to MQ's extension identity in teh **Add people** sidebar.

:::image type="content" source="media/tutorial-upload-mqtt-lakehouse/mq-workspace-contributor.png" alt-text="Create workspace and give access" lightbox="media/tutorial-upload-mqtt-lakehouse/mq-workspace-contributor.png":::

That's all you need to do start sending data from IoT MQ!

### Create a new lakehouse

:::image type="content" source="media/tutorial-upload-mqtt-lakehouse/new-lakehouse.png" alt-text="Create new lakehouse" lightbox="media/tutorial-upload-mqtt-lakehouse/new-lakehouse.png":::

### Make note of the resource names

Note the following names for later use - Fabric workspace name, Fabric lakehouse name and Fabric endpoint URL. You can get the endpoint URL from the **Properties** of one of the pre-created lakehouse folders -

:::image type="content" source="media/tutorial-upload-mqtt-lakehouse/lakehouse-name.png" alt-text="Create new lakehouse" lightbox="media/tutorial-upload-mqtt-lakehouse/lakehouse-name.png":::

The URL should look like *https://xxx.dfs.fabric.microsoft.com*

## Generate simulated data 



## Deploy the datalake connector and topic map resources

Building on top of the previous Azure deployment, add the datalake connector and 


TEMPLATE_FILE_NAME=./tutorials/mq-onelake-upload/deployDatalakeConnector.bicep
RESOURCE_GROUP=urban-succotash-jrjj4v4jv4whppvq
mqInstanceName=mq-instance
customLocationName=urban-succotash-jrjj4v4jv4whppvq-cl
fabricEndpointUrl=https://msit-onelake.dfs.fabric.microsoft.com
fabricWorkspaceName=mq-upload-workspace
fabricLakehouseName=mq_upload

 az deployment group create --name dl-resources \
    --resource-group $RESOURCE_GROUP \
    --template-file $TEMPLATE_FILE_NAME \
    --parameters mqInstanceName=$mqInstanceName \
    --parameters customLocationName=$customLocationName \
    --parameters fabricEndpointUrl=$fabricEndpointUrl \
    --parameters fabricWorkspaceName=$fabricWorkspaceName \
    --parameters fabricLakehouseName=$fabricLakehouseName



```


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

1. Simulate test data by deploying a Kubernetes workload. The pod simulates a sensor by sending sample temperature, vibration, and pressure readings every 200 milliseconds to the MQ broker using an MQTT client. Execute the following command in the Codespace terminal:

    ```bash
    kubectl apply -f tutorials/mq-realtime-fabric-dashboard/simulate-data.yaml
    ```

1. The Kafka north-bound connector is [preconfigured in the deployment](https://github.com/Azure-Samples/explore-iot-operations/blob/e4bf8375e933c29c49bfd905090b37caef644135/tutorials/mq-realtime-fabric-dashboard/deployEdgeAndCloudResources.bicep#L331) to pick up messages from the MQTT topic where messages are being published to Event Hubs in the cloud.

1. After about a minute, confirm the message delivery in Event Hubs metrics.

    :::image type="content" source="media/tutorial-real-time-dashboard-fabric/event-hub-messages.png" alt-text="Confirm Event Hubs messages." lightbox="media/tutorial-real-time-dashboard-fabric/event-hub-messages.png":::

## Create and configure Microsoft Fabric event streams

1. [Create a KQL Database](/fabric/real-time-analytics/create-database).

1. [Create an eventstream in Microsoft Fabric](/fabric/real-time-analytics/event-streams/create-manage-an-eventstream).

    1. [Add the Event Hubs namespace created in the previous section as a source](/fabric/real-time-analytics/event-streams/add-manage-eventstream-sources#add-an-azure-event-hub-as-a-source).

    1. [Add the KQL Database created in the previous step as a destination](/fabric/real-time-analytics/event-streams/add-manage-eventstream-destinations#add-a-kql-database-as-a-destination).

1. In the wizard's **Inspect** step, add a **New table** called *sensor_readings*, enter a **Data connection name** and select **Next**.

1. In the **Preview data** tab, select the **JSON** format and select **Finish**.

In a few seconds, you should see the data being ingested into KQL Database.

:::image type="content" source="media/tutorial-real-time-dashboard-fabric/eventstream-ingesting.png" alt-text="Eventstream ingesting success." lightbox="media/tutorial-real-time-dashboard-fabric/eventstream-ingesting.png":::

## Create Power BI report

1. From the KQL Database, right-click on the *sensor-readings* table and select **Build Power BI report**.

    :::image type="content" source="media/tutorial-real-time-dashboard-fabric/powerbi-report.png" alt-text="Create Power BI report." lightbox="media/tutorial-real-time-dashboard-fabric/powerbi-report.png":::

1. Drag the *∑ Temperature* onto the canvas and change the visualization to a line graph. Drag the *EventEnqueuedUtcTime* column onto the visual and save the report.

    :::image type="content" source="media/tutorial-real-time-dashboard-fabric/powerbi-dash-create.png" alt-text="Save Power BI report." lightbox="media/tutorial-real-time-dashboard-fabric/powerbi-dash-create.png":::

1. Open the Power BI report to see the real-time dashboard, you can refresh the dashboard with latest sensor reading using the button on the top right.

    :::image type="content" source="media/tutorial-real-time-dashboard-fabric/powerbi-dash-show.png" alt-text="View Power BI report." lightbox="media/tutorial-real-time-dashboard-fabric/powerbi-dash-show.png":::

In this walkthrough, you learned how to build a real-time dashboard in Microsoft Fabric using simulated MQTT data that is published to IoT MQ.

## Next steps

[Configure MQTT bridge between IoT MQ and Azure Event Grid](tutorial-connect-event-grid.md)
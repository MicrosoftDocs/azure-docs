---
title: Build a real-time dashboard in Microsoft Fabric with MQTT data
# titleSuffix: Azure IoT MQ
description: Learn how to build a real-time dashboard in Microsoft Fabric using MQTT data from IoT MQ
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 11/01/2023

#CustomerIntent: As an operator, I want to learn how to build a real-time dashboard in Microsoft Fabric using MQTT data from IoT MQ.
---

# Build a real-time dashboard in Microsoft Fabric with MQTT data

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this walkthrough, you build a real-time Power BI dashboard in Microsoft Fabric using simulated MQTT data that is published to IoT MQ. The architecture uses the IoT MQ's Kafka connector to deliver messages to an Event Hubs namespace. Messages are then streamed to a Kusto database in Microsoft Fabric using an eventstream and visualized in a Power BI dashboard. 

## Prepare your Kubernetes cluster

This walkthrough uses a virtual Kubernetes environment hosted in a GitHub Codespace to help you get going quickly. If you want to use a different environment, all the artifacts are available in the [explore-iot-operations](https://github.com/Azure-Samples/explore-iot-operations/tree/main/tutorials/mq-realtime-fabric-dashboard) GitHub repo so you can easily follow along. 

1. Create the codespace, optionally entering your Azure details to store them as environment variables for the terminal.

   [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/explore-iot-operations?quickstart=1)

1. Once the codespace is ready, select the menu button at the top left, then select **Open in VS Code Desktop**.

:::image type="content" source="../deploy-iot-ops/media/howto-prepare-cluster/open-in-vs-code-desktop.png" alt-text="Open VS Code desktop" lightbox="../deploy-iot-ops/media/howto-prepare-cluster/open-in-vs-code-desktop.png":::


1. [Connect the cluster to Azure Arc](../deploy-iot-ops/howto-prepare-cluster.md#arc-enable-your-cluster).

## Deploy edge and cloud Azure resources

The MQTT broker and north-bound cloud connector components can be deployed as regular Azure resources as they have Azure Resource Provider (RPs) implementations. A single Bicep template file from the explore-iot-operations repo deploys all the required edge and cloud resources and Azure role-based access assignments. Execute this command in your codespace terminal:

```azcli
CLUSTER_NAME=<arc-connected-cluster-name>
TEMPLATE_FILE_NAME='tutorials/mq-realtime-fabric-dashboard/deployEdgeAndCloudResources.bicep'

 az deployment group create               \ 
    --name az-resources                   \
    --resource-group $RESOURCE_GROUP      \
    --template-file $TEMPLATE_FILE_NAME   \
    --parameters clusterName=$CLUSTER_NAME
```

> [!IMPORTANT]
> The deployment configuration is for demonstration or development purposes only. They are not recommended for live environments.

The resources deployed by the template include: 
* [Event Hubs related resources](https://github.com/Azure-Samples/explore-iot-operations/blob/88ff2f4759acdcb4f752aa23e89b30286ab0cc99/tutorials/mq-realtime-fabric-dashboard/deployEdgeAndCloudResources.bicep#L349) 
* [IoT Operations MQ Arc extension](https://github.com/Azure-Samples/explore-iot-operations/blob/88ff2f4759acdcb4f752aa23e89b30286ab0cc99/tutorials/mq-realtime-fabric-dashboard/deployEdgeAndCloudResources.bicep#L118)
* [IoT MQ Broker](https://github.com/Azure-Samples/explore-iot-operations/blob/88ff2f4759acdcb4f752aa23e89b30286ab0cc99/tutorials/mq-realtime-fabric-dashboard/deployEdgeAndCloudResources.bicep#L202)
* [Kafka north-bound connector and topicmap](https://github.com/Azure-Samples/explore-iot-operations/blob/88ff2f4759acdcb4f752aa23e89b30286ab0cc99/tutorials/mq-realtime-fabric-dashboard/deployEdgeAndCloudResources.bicep#L282)
* [Azure role-based access assignments](https://github.com/Azure-Samples/explore-iot-operations/blob/88ff2f4759acdcb4f752aa23e89b30286ab0cc99/tutorials/mq-realtime-fabric-dashboard/deployEdgeAndCloudResources.bicep#L379)









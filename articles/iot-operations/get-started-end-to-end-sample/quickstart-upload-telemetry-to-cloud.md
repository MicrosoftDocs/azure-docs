---
title: "Quickstart: Send telemetry from your assets to the cloud"
description: "Quickstart: Use a dataflow to send asset telemetry from the MQTT broker to an event hub in the cloud."
author: dominicbetts
ms.author: dobett
ms.topic: quickstart
ms.subservice: azure-data-processor
ms.custom:
  - ignite-2023
ms.date: 04/19/2024

#CustomerIntent: As an OT user, I want to send my OPC UA data to the cloud so that I can derive insights from it by using a tool such as Real-Time Dashboards.
---

# Quickstart: Send asset telemetry to the cloud using a dataflow

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you use a dataflow to forward messages from the MQTT broker to an event hub in the Azure Event Hubs service. The event hub can deliver the data to other cloud services for storage and analysis. In the next quickstart, you use a Real-Time Dashboard to visualize the data.

## Prerequisites

Before you begin this quickstart, you must complete the following quickstarts:

- [Quickstart: Run Azure IoT Operations Preview in GitHub Codespaces with K3s](quickstart-deploy.md)
- [Quickstart: Add OPC UA assets to your Azure IoT Operations Preview cluster](quickstart-add-assets.md)

## What problem will we solve?

To use a tool such as Real-Time Dashboard to analyze your OPC UA data, you need to send the data to a cloud service such as Azure Event Hubs. A dataflow can subscribe to an MQTT topic and forward the messages to an event hub in your Azure Event Hubs namespace. The next quickstart shows you how to use Real-Time Dashboards to visualize and analyze your data.

## Create an Event Hubs namespace

To create an Event Hubs namespace and an event hub, run the following Azure CLI commands in your Codespaces terminal. These commands create the Event Hubs namespace in the same resource group as your Kubernetes cluster:

```azurecli
az eventhubs namespace create --name ${CLUSTER_NAME:0:24} --resource-group $RESOURCE_GROUP --location $LOCATION

az eventhubs eventhub create --name destinationeh --resource-group $RESOURCE_GROUP --namespace-name ${CLUSTER_NAME:0:24} --retention-time 1 --partition-count 1 --cleanup-policy Delete
```

To grant the Azure IoT Operations extension in your cluster access to your Event Hubs namespace, run the following Azure CLI commands:

```bash
# AIO Arc extension name
AIO_EXTENSION_NAME=$(az k8s-extension list --resource-group $RESOURCE_GROUP --cluster-name $CLUSTER_NAME --cluster-type connectedClusters -o tsv --query "[?extensionType=='microsoft.iotoperations'].name")

az deployment group create \
      --name assign-RBAC-roles \
      --resource-group $RESOURCE_GROUP \
      --template-file samples/quickstarts/event-hubs-config.bicep \
      --parameters aioExtensionName=$AIO_EXTENSION_NAME \
      --parameters clusterName=$CLUSTER_NAME \
      --parameters eventHubNamespaceName=${CLUSTER_NAME:0:24}
```

## Create a dataflow to send telemetry to an event hub

To create and configure a dataflow in your cluster, run the following commands in your Codespaces terminal. This dataflow forwards messages from the MQTT topic to the event hub you created without making any changes:

```bash
sed 's/<NAMESPACE>/'"${CLUSTER_NAME:0:24}"'/' samples/quickstarts/dataflow.yaml > dataflow.yaml

kubectl apply -f dataflow.yaml
```

## How did we solve the problem?

In this quickstart, you used a dataflow to connect an MQTT topic to an event hub in your Azure Event Hubs namespace. In the next quickstart, you use Microsoft Fabric Real-Time Intelligence to visualize the data.

## Clean up resources

If you're not going to continue to use this deployment, delete the Kubernetes cluster where you deployed Azure IoT Operations and remove the Azure resource group that contains the cluster.

You can also delete your Microsoft Fabric workspace.

## Next step

[Quickstart: Get insights from your asset telemetry](quickstart-get-insights.md)

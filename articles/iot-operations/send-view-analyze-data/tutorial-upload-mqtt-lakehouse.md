---
title: Upload MQTT data to Microsoft Fabric lakehouse
titleSuffix: Azure IoT MQ
description: Learn how to upload MQTT data from the edge to a Fabric lakehouse
author: PatAltimore
ms.subservice: mq
ms.author: patricka
ms.topic: how-to
ms.date: 11/15/2023

#CustomerIntent: As an operator, I want to learn how to send MQTT data from the edge to a lakehouse in the cloud.
---

# Upload MQTT data to Microsoft Fabric lakehouse

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this walkthrough, you send MQTT data from Azure IoT MQ directly to a Microsoft Fabric OneLake lakehouse. MQTT payloads are in the JSON format and automatically encoded into the Delta Lake format before uploading the lakehouse. This means data is ready for querying and analysis in seconds thanks to Microsoft Fabric's native support for the Delta Lake format. IoT MQ's data lake connector is configured with the desired batching behavior as well as enriching the output with additional metadata.

Azure IoT Operations can be deployed with the Azure CLI, Azure portal or with infrastructure-as-code (IaC) tools. This tutorial uses the IaC method using the Bicep language.

## Prepare your Kubernetes cluster

This walkthrough uses a virtual Kubernetes environment hosted in a GitHub Codespace to help you get going quickly. If you want to use a different environment, all the artifacts are available in the [explore-iot-operations](https://github.com/Azure-Samples/explore-iot-operations/tree/main/tutorials/mq-onelake-upload) GitHub repository so you can easily follow along. 

1. Create the Codespace, optionally entering your Azure details to store them as environment variables for the terminal.

    [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/explore-iot-operations?quickstart=1)

1. Once the Codespace is ready, select the menu button at the top left, then select **Open in VS Code Desktop**.

    :::image type="content" source="../deploy-iot-ops/media/howto-prepare-cluster/open-in-vs-code-desktop.png" alt-text="Screenshot of opening VS Code desktop." lightbox="../deploy-iot-ops/media/howto-prepare-cluster/open-in-vs-code-desktop.png":::

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

> [!IMPORTANT]
> The deployment configuration is for demonstration or development purposes only. It's not suitable for production environments.

The template deploys:

* [IoT MQ Arc extension](https://github.com/Azure-Samples/explore-iot-operations/blob/a57e3217a93f3478cb2ee1d85acae5e358822621/tutorials/mq-onelake-upload/deployBaseResources.bicep#L124)
* [IoT MQ Broker and child resources](https://github.com/Azure-Samples/explore-iot-operations/blob/a57e3217a93f3478cb2ee1d85acae5e358822621/tutorials/mq-onelake-upload/deployBaseResources.bicep#L191)

From the deployment JSON outputs, note the name of the IoT MQ extension. It should look like *mq-resource-group-name*.

## Set up Microsoft Fabric resources

Next, create and set up the required Fabric resources.

### Create a Fabric workspace and give access to IoT MQ 

Create a new workspace in Microsoft Fabric, select **Manage access** from the top bar, and give **Contributor** access to IoT MQ's extension identity in the **Add people** sidebar.

:::image type="content" source="media/tutorial-upload-mqtt-lakehouse/mq-workspace-contributor.png" alt-text="Screenshot showing adding contributor to workspace and grant access." lightbox="media/tutorial-upload-mqtt-lakehouse/mq-workspace-contributor.png":::

That's all the steps you need to do start sending data from IoT MQ.

### Create a new lakehouse

:::image type="content" source="media/tutorial-upload-mqtt-lakehouse/new-lakehouse.png" alt-text="Screenshot showing dialot to create a new lakehouse." lightbox="media/tutorial-upload-mqtt-lakehouse/new-lakehouse.png":::

### Make note of the resource names

Note the following names for later use: **Fabric workspace name**, **Fabric lakehouse name**, and **Fabric endpoint URL**. You can get the endpoint URL from the **Properties** of one of the precreated lakehouse folders.

:::image type="content" source="media/tutorial-upload-mqtt-lakehouse/lakehouse-name.png" alt-text="Screenshot of properties shortcut menu to get lakehouse name." lightbox="media/tutorial-upload-mqtt-lakehouse/lakehouse-name.png":::

The URL should look like *https:\/\/xyz\.dfs\.fabric\.microsoft\.com*.

## Simulate MQTT messages 

Simulate test data by deploying a Kubernetes workload. It simulates a sensor by sending sample temperature, vibration, and pressure readings periodically to the MQ broker using an MQTT client. Run the following command in the Codespace terminal:

```bash
kubectl apply -f tutorials/mq-onelake-upload/simulate-data.yaml
```

## Deploy the data lake connector and topic map resources

Building on top of the previous Azure deployment, add the data lake connector and topic map. Supply the names of the previously created resources using environment variables.

```azurecli
TEMPLATE_FILE_NAME=./tutorials/mq-onelake-upload/deployDatalakeConnector.bicep
RESOURCE_GROUP=xxx
mqInstanceName=mq-instance
customLocationName=xxx
fabricEndpointUrl=xxx
fabricWorkspaceName=xxx
fabricLakehouseName=xxx

az deployment group create --name dl-resources \
    --resource-group $RESOURCE_GROUP \
    --template-file $TEMPLATE_FILE_NAME \
    --parameters mqInstanceName=$mqInstanceName \
    --parameters customLocationName=$customLocationName \
    --parameters fabricEndpointUrl=$fabricEndpointUrl \
    --parameters fabricWorkspaceName=$fabricWorkspaceName \
    --parameters fabricLakehouseName=$fabricLakehouseName
```

The template deploys:

* [IoT MQ data lake connector to Microsoft Fabric](https://github.com/Azure-Samples/explore-iot-operations/blob/a57e3217a93f3478cb2ee1d85acae5e358822621/tutorials/mq-onelake-upload/deployDatalakeConnector.bicep#L21)
* [Data lake connector topic map](https://github.com/Azure-Samples/explore-iot-operations/blob/a57e3217a93f3478cb2ee1d85acae5e358822621/tutorials/mq-onelake-upload/deployDatalakeConnector.bicep#L56)

The data lake connector uses the IoT MQ's system-assigned managed identity to write data to the lakehouse. No manual credentials are needed.

The topic map provides the mapping between the JSON fields in the MQTT payload and the Delta table columns. It also defines the batch size of the uploads to the lakehouse and built-in enrichments the data like a receive timestamp and topic name.

## Confirm lakehouse ingest

In about a minute, you should see the MQTT payload along with the enriched fields in Fabric under the **Tables** folder.

:::image type="content" source="media/tutorial-upload-mqtt-lakehouse/lakehouse-table.png" alt-text="Screenshot showing fields with data in a Delta table." lightbox="media/tutorial-upload-mqtt-lakehouse/lakehouse-table.png":::

The data is now available in Fabric for cleaning, creating reports, and further analysis.

In this walkthrough, you learned how to upload MQTT messages from IoT MQ directly to a Fabric lakehouse.

## Next steps

[Bridge MQTT data between IoT MQ and Azure Event Grid](tutorial-connect-event-grid.md)
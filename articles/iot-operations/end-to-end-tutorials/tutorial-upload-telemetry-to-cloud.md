---
title: "Tutorial: Send telemetry from your assets to the cloud"
description: "Tutorial: Use a dataflow to send asset telemetry from the MQTT broker to an event hub in the cloud."
author: dominicbetts
ms.author: dobett
ms.topic: tutorial
ms.custom:
  - ignite-2023
ms.date: 11/14/2024

#CustomerIntent: As an OT user, I want to send my OPC UA data to the cloud so that I can derive insights from it by using a tool such as Real-Time Dashboards.
ms.service: azure-iot-operations
---

# Tutorial: Send asset telemetry to the cloud using a dataflow

In this tutorial, you use a dataflow to forward messages from the MQTT broker to an event hub in the Azure Event Hubs service. The event hub can deliver the data to other cloud services for storage and analysis. In the next tutorial, you use a real-time dashboard to visualize the data.

## Prerequisites

Before you begin this tutorial, you must complete [Tutorial: Add OPC UA assets to your Azure IoT Operations cluster](tutorial-add-assets.md).

## What problem will we solve?

To use a tool such as Real-Time Dashboard to analyze your OPC UA data, you need to send the data to a cloud service such as Azure Event Hubs. A dataflow can subscribe to an MQTT topic and forward the messages to an event hub in your Azure Event Hubs namespace. The next tutorial shows you how to use Real-Time Dashboards to visualize and analyze your data.

## Set your environment variables

If you're using the Codespaces environment, the required environment variables are already set and you can skip this step. Otherwise, set the following environment variables in your shell:

# [Bash](#tab/bash)

```bash
# The name of the resource group where your Kubernetes cluster is deployed
RESOURCE_GROUP=<resource-group-name>

# The name of your Kubernetes cluster
CLUSTER_NAME=<kubernetes-cluster-name>
```

# [PowerShell](#tab/powershell)

```powershell
# The name of the resource group where your Kubernetes cluster is deployed
$RESOURCE_GROUP = "<resource-group-name>"

# The name of your Kubernetes cluster
$CLUSTER_NAME = "<kubernetes-cluster-name>"
```

---

## Create an Event Hubs namespace

To create an Event Hubs namespace and an event hub, run the following Azure CLI commands in your shell. These commands create the Event Hubs namespace in the same resource group as your Kubernetes cluster:

# [Bash](#tab/bash)

```bash
az eventhubs namespace create --name ${CLUSTER_NAME:0:24} --resource-group $RESOURCE_GROUP --disable-local-auth false

az eventhubs eventhub create --name destinationeh --resource-group $RESOURCE_GROUP --namespace-name ${CLUSTER_NAME:0:24} --retention-time 1 --partition-count 1 --cleanup-policy Delete
```

# [PowerShell](#tab/powershell)

```powershell
az eventhubs namespace create --name $CLUSTER_NAME.Substring(0, [MATH]::Min($CLUSTER_NAME.Length, 24)) --resource-group $RESOURCE_GROUP --disable-local-auth false

az eventhubs eventhub create --name destinationeh --resource-group $RESOURCE_GROUP --namespace-name $CLUSTER_NAME.Substring(0, [MATH]::Min($CLUSTER_NAME.Length, 24)) --retention-time 1 --partition-count 1 --cleanup-policy Delete
```

---

To grant the Azure IoT Operations extension in your cluster access to your Event Hubs namespace, run the following Azure CLI commands:

# [Bash](#tab/bash)

```bash
EVENTHUBRESOURCE=$(az eventhubs namespace show --resource-group $RESOURCE_GROUP --namespace-name ${CLUSTER_NAME:0:24} --query id -o tsv)

PRINCIPAL=$(az k8s-extension list --resource-group $RESOURCE_GROUP --cluster-name $CLUSTER_NAME --cluster-type connectedClusters -o tsv --query "[?extensionType=='microsoft.iotoperations'].identity.principalId")

az role assignment create --role "Azure Event Hubs Data Sender" --assignee $PRINCIPAL --scope $EVENTHUBRESOURCE
```

# [PowerShell](#tab/powershell)

```powershell
$EVENTHUBRESOURCE = $(az eventhubs namespace show --resource-group $RESOURCE_GROUP --namespace-name $CLUSTER_NAME.Substring(0, [MATH]::Min($CLUSTER_NAME.Length, 24)) --query id -o tsv)

$PRINCIPAL = $(az k8s-extension list --resource-group $RESOURCE_GROUP --cluster-name $CLUSTER_NAME --cluster-type connectedClusters -o tsv --query "[?extensionType=='microsoft.iotoperations'].identity.principalId")

az role assignment create --role "Azure Event Hubs Data Sender" --assignee $PRINCIPAL --scope $EVENTHUBRESOURCE
```

---

## Create a dataflow to send telemetry to an event hub

Use the operations experience UI to create and configure a dataflow in your cluster that:

- Renames the `Tag 10` field in the incoming message to `Humidity`.
- Renames the `temperature` field in the incoming message to `Temperature`.
- Adds a field called `AssetId` that contains the name of the asset.
- Forwards the transformed messages from the MQTT topic to the event hub you created.

To create the dataflow:

1. Browse to the operations experience UI and locate your instance. Then select **Dataflow endpoints** and select **+ New** in the **Azure Event Hubs** tile:

    :::image type="content" source="media/tutorial-upload-telemetry-to-cloud/new-event-hubs-endpoint.png" alt-text="Screenshot of the Dataflow endpoints page.":::

1. In the **Create new dataflow endpoint: Azure Event Hubs**, enter *event-hubs-target* as the name, and update the **Host** field with the address of the Event Hubs namespace you created. Select **Apply**:

    :::image type="content" source="media/tutorial-upload-telemetry-to-cloud/new-event-hubs-destination.png" alt-text="Screenshot of the Create new dataflow endpoint: Azure Event Hubs page.":::

    Your new dataflow endpoint is created and displays in the list on the **Dataflow endpoints** page.

1. Select **Dataflows** and then select **+ Create dataflow**. The **\<new-dataflow\>** page displays:

    :::image type="content" source="media/tutorial-upload-telemetry-to-cloud/new-dataflow.png" alt-text="Screenshot of the Dataflows page.":::

1. In the dataflow editor, select **Select source**. Then select the thermostat asset you created previously and select **Apply**.

1. In the dataflow editor, select **Select dataflow endpoint**. Then select the **event-hubs-target** endpoint you created previously and select **Apply**.

1. On the next page, enter *destinationeh* as the topic. The topic refers to the hub you created in the Event Hubs namespace. Select **Apply**. Your dataflow now has the thermostat asset as its source and a hub in your Event Hubs namespace as its destination.

1. To add a transformation, select **Add transform (optional)**.

1. To rename the `Tag 10` and `temperature` fields in the incoming message, select **+ Add** in the **Rename** tile.

1. Add the following two rename transforms:

    | Datapoint | New datapoint name |
    |-----------|--------------------|
    | Tag 10.Value    | ThermostatHumidity          |
    | temperature.Value | ThermostatTemperature       |

1. To copy the asset ID from the message metadata, add the following rename transform:

    | Datapoint | New datapoint name |
    |-----------|--------------------|
    | $metadata.user_property.externalAssetId | AssetId |
  
    The rename transformation looks like the following screenshot:
  
    :::image type="content" source="media/tutorial-upload-telemetry-to-cloud/rename-transform.png" alt-text="Screenshot of the rename transformation.":::

    Select **Apply**.

1. The dataflow editor now looks like the following screenshot:

    :::image type="content" source="media/tutorial-upload-telemetry-to-cloud/dataflow-complete.png" alt-text="Screenshot of the completed dataflow.":::

1. To start the dataflow running, enter *tutorial-dataflow* as its name and then select **Save**. After a few minutes, the **Provisioning State** changes to **Succeeded**. The dataflow is now running in your cluster.

Your dataflow subscribes to an MQTT topic to receive messages from the thermostat asset. It renames some of the fields in the message, and forwards the transformed messages to the event hub you created.

## Verify data is flowing

To verify that data is flowing to the cloud, you can view your Event Hubs instance in the Azure portal. You might need to wait for several minutes for the dataflow to start and for messages to flow to the event hub.

If messages are flowing to the instance, you can see the count on incoming messages on the instance **Overview** page:

:::image type="content" source="media/tutorial-upload-telemetry-to-cloud/incoming-messages.png" alt-text="Screenshot that shows the Event Hubs instance overview page with incoming messages.":::

If messages are flowing, you can use the **Data Explorer** to view the messages:

:::image type="content" source="media/tutorial-upload-telemetry-to-cloud/event-hubs-data-viewer.png" alt-text="Screenshot of the Event Hubs instance **Data Explorer** page.":::

> [!TIP]
> You may need to assign yourself to the **Azure Event Hubs Data Receiver** role for the Event Hubs namespace to view the messages.

## How did we solve the problem?

In this tutorial, you used a dataflow to connect an MQTT topic to an event hub in your Azure Event Hubs namespace. In the next tutorial, you use Microsoft Fabric Real-Time Intelligence to visualize the data.

## Clean up resources

If you're continuing on to the next tutorial, keep all of your resources.

[!INCLUDE [tidy-resources](../includes/tidy-resources.md)]

> [!NOTE]
> The resource group contains the Event Hubs namespace you created in this tutorial.

## Next step

[Tutorial: Get insights from your asset telemetry](tutorial-get-insights.md)

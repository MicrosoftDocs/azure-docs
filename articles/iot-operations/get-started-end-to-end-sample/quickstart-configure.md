---
title: "Quickstart: Configure your cluster"
description: "Quickstart: Configure asset endpoints, assets, and dataflows in your cluster to process and route data from a simulated OPC PLC server to the cloud."
author: dominicbetts
ms.author: dobett
ms.topic: quickstart
ms.custom:
  - ignite-2023
ms.date: 10/17/2024

#CustomerIntent: As an OT user, I want to configure my Azure IoT Operations cluster so that I can see how to process and route data to a cloud endpoint.
---

# Quickstart: Configure your cluster

In this quickstart, you configure the following resources in your Azure IoT Operations Preview cluster:

- An *asset endpoint* that defines a connection to a simulated OPC PLC server that simulates an oven in a bakery.
- An *asset* that represents the oven and defines the data points that the oven exposes.
- A *dataflow* that manipulates the messages from the simulated oven.

An _asset_ is a physical device or logical entity that represents a device, a machine, a system, or a process. For example, a physical asset could be a pump, a motor, a tank, or a production line. A logical asset that you define can have properties, stream telemetry, or generate events.

_OPC UA servers_ are software applications that communicate with assets. _OPC UA tags_ are data points that OPC UA servers expose. OPC UA tags can provide real-time or historical data about the status, performance, quality, or condition of assets.

In this quickstart, you use a Bicep file to configure your Azure IoT Operations instance.

## Prerequisites

Have an instance of Azure IoT Operations Preview deployed in a Kubernetes cluster. The [Quickstart: Run Azure IoT Operations Preview in GitHub Codespaces with K3s](quickstart-deploy.md) provides simple instructions to deploy an Azure IoT Operations instance that you can use for the quickstarts.

Unless otherwise noted, you can run the console commands in this quickstart in either a Bash or PowerShell environment.

## What problem will we solve?

The data that OPC UA servers expose can have a complex structure and can be difficult to understand. Azure IoT Operations provides a way to model OPC UA assets as tags, events, and properties. This modeling makes it easier to understand the data and to use it in downstream processes such as the MQTT broker and dataflows. Dataflows let you manipulate and route data to cloud services such as Azure Event Hubs. In this quickstart, the dataflow changes the names of some fields in payload and adds an asset ID to the messages.

## Deploy the OPC PLC simulator

This quickstart uses the OPC PLC simulator to generate sample data. To deploy the OPC PLC simulator, run the following command:

```console
kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/opc-plc-deployment.yaml
```

The following snippet shows the YAML file that you applied:

:::code language="yaml" source="~/azure-iot-operations-samples-m3/samples/quickstarts/opc-plc-deployment.yaml":::

> [!CAUTION]
> This configuration uses a self-signed application instance certificate. Don't use this configuration in a production environment. To learn more, see [Configure OPC UA certificates infrastructure for the connector for OPC UA](../discover-manage-assets/howto-configure-opcua-certificates-infrastructure.md).

---

## Set your environment variables

If you're using the Codespaces environment, the required environment variables are already set and you can skip this step. Otherwise, set the following environment variables in your shell:

# [Bash](#tab/bash)

```bash
# Your subscription ID
SUBSCRIPTION_ID=<subscription-id>

# The name of the resource group where your Kubernetes cluster is deployed
RESOURCE_GROUP=<resource-group-name>

# The name of your Kubernetes cluster
CLUSTER_NAME=<kubernetes-cluster-name>
```

# [PowerShell](#tab/powershell)

```powershell
# Your subscription ID
$SUBSCRIPTION_ID = "<subscription-id>"

# The name of the resource group where your Kubernetes cluster is deployed
$RESOURCE_GROUP = "<resource-group-name>"

# The name of your Kubernetes cluster
$CLUSTER_NAME = "<kubernetes-cluster-name>"
```

---

## Configure your cluster

Run the following commands to download and run the Bicep file that configures your Azure IoT Operations instance. The Bicep file:

- Adds an asset endpoint that connects to the OPC PLC simulator.
- Adds an asset that represents the oven and defines the data points that the oven exposes.
- Adds a dataflow that manipulates the messages from the simulated oven.
- Creates an Azure Event Hubs instance to receive the data.

<!-- TODO: Fix download link -->

# [Bash](#tab/bash)

```bash
wget https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/quickstart.bicep -O quickstart.bicep

AIO_EXTENSION_NAME=$(az k8s-extension list -g $RESOURCE_GROUP --cluster-name $CLUSTER_NAME --cluster-type connectedClusters --query "[?extensionType == 'microsoft.iotoperations'].id" -o tsv | awk -F'/' '{print $NF}')
AIO_INSTANCE_NAME=$(az iot ops list -g $RESOURCE_GROUP --query "[0].name" -o tsv)
CUSTOM_LOCATION_NAME=$(az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv | awk -F'/' '{print $NF}')

az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file quickstart.bicep --parameters clusterName=$CLUSTER_NAME customLocationName=$CUSTOM_LOCATION_NAME aioExtensionName=$AIO_EXTENSION_NAME aioInstanceName=$AIO_INSTANCE_NAME
```

# [PowerShell](#tab/powershell)

```powershell
Invoke-WebRequest -Uri https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/quickstart.bicep -OutFile quickstart.bicep

$AIO_EXTENSION_NAME = (az k8s-extension list -g $RESOURCE_GROUP --cluster-name $CLUSTER_NAME --cluster-type connectedClusters --query "[?extensionType == 'microsoft.iotoperations'].id" -o tsv) -split '/' | Select-Object -Last 1
$AIO_INSTANCE_NAME = $(az iot ops list -g $RESOURCE_GROUP --query "[0].name" -o tsv)
$CUSTOM_LOCATION_NAME = (az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv) -split '/' | Select-Object -Last 1

az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file quickstart.bicep --parameters clusterName=$CLUSTER_NAME customLocationName=$CUSTOM_LOCATION_NAME aioExtensionName=$AIO_EXTENSION_NAME aioInstanceName=$AIO_INSTANCE_NAME
```

---

## Review configuration

The Bicep file configured the following resources:

- An asset endpoint that connects to the OPC PLC simulator.
- An asset that represents the oven and defines the data points that the oven exposes.
- Two dataflows that process the messages from the simulated oven.
- An Azure Event Hubs namespace that contains a destination hub for the dataflows.

To view the asset endpoint, asset, and dataflows, navigate to the [operations experience](https://iotoperations.azure.com) UI in your browser and sign in with your Microsoft Entra ID credentials. Because you're working with a new deployment, there are no sites yet. You can find the cluster you created in the previous quickstart by selecting **Unassigned instances**. In the operations experience, an instance represents a cluster where you deployed Azure IoT Operations.

:::image type="content" source="media/quickstart-configure/instance-list.png" alt-text="Screenshot in the operations experience showing unassigned instances.":::

The asset endpoint defines the connection to the OPC PLC simulator:

:::image type="content" source="media/quickstart-configure/asset-endpoint-list.png" alt-text="Screenshot in the operations experience that shows a list of asset endpoints.":::

The oven asset defines the data points that the oven exposes:

:::image type="content" source="media/quickstart-configure/asset-list.png" alt-text="Screenshot in the operations experience that shows a list of assets.":::

The dataflows define how the messages from the simulated oven are processed and routed to Event Hubs in the cloud:

:::image type="content" source="media/quickstart-configure/dataflows-list.png" alt-text="Screenshot in the operations experience that shows a list of dataflows.":::

The following screenshot shows how the temperature conversion dataflow is configured:

:::image type="content" source="media/quickstart-configure/dataflow-compute.png" alt-text="Screenshot in the operations experience that shows the temperature conversion calculation.":::

## Verify data is flowing to MQTT broker

[!INCLUDE [deploy-mqttui](../includes/deploy-mqttui.md)]

To verify that the oven asset you added is publishing data, view the telemetry in the `azure-iot-operations/data` topic:

```output
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/oven', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:17.1858435Z","Value":4558},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:17.1858869Z","Value":4558}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/oven', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:18.1838125Z","Value":4559},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:18.1838523Z","Value":4559}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/oven', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:19.1834363Z","Value":4560},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:19.1834879Z","Value":4560}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/oven', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:20.1861251Z","Value":4561},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:20.1861709Z","Value":4561}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/oven', ... (152 bytes))
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

The sample tags you added in the previous quickstart generate messages from your asset that look like the following example:

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

## Verify data is flowing to Event Hubs

To verify that data is flowing to the cloud, you can view your Event Hubs instance in the Azure portal. You may need to wait for several minutes for the dataflow to start and for messages to flow to the event hub.

The Bicep configuration you applied previously created an Event Hubs namespace and hub that's used as a destination by the dataflow. To view the namespace and hub, navigate to the resource group in the Azure portal that contains your IoT Operations instance and then select the Event Hubs namespace.

If messages are flowing to the instance, you can see the count on incoming messages on the instance **Overview** page:

:::image type="content" source="media/quickstart-configure/incoming-messages.png" alt-text="Screenshot that shows the Event Hubs instance overview page with incoming messages.":::

If messages are flowing, you can use the **Data Explorer** to view the messages:

:::image type="content" source="media/quickstart-configure/event-hubs-data-viewer.png" alt-text="Screenshot of the Event Hubs instance **Data Explorer** page.":::

> [!TIP]
> You may need to assign yourself to the **Azure Event Hubs Data Receiver** role for the Event Hubs namespace to view the messages.

## How did we solve the problem?

In this quickstart, you used a bicep file to configure your Azure IoT Operations instance with an asset endpoint, asset, and dataflow. The configuration processes and routes data from a simulated oven. The dataflow in the configuration routes the messages to an Azure Event Hubs instance.

## Clean up resources

If you're continuing on to the next quickstart, keep all of your resources.

[!INCLUDE [tidy-resources](../includes/tidy-resources.md)]

## Next step

If you want to learn how to build a Microsoft Fabric dashboard to get insights from your oven data, see [Tutorial: Get insights from your processed data](../end-to-end-tutorials/tutorial-get-insights.md).

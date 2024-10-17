---
title: "Quickstart: Add assets"
description: "Quickstart: Add OPC UA assets that publish messages to the MQTT broker in your Azure IoT Operations cluster."
author: dominicbetts
ms.author: dobett
ms.topic: quickstart
ms.custom:
  - ignite-2023
ms.date: 10/17/2024

#CustomerIntent: As an OT user, I want to create assets in Azure IoT Operations so that I can subscribe to asset data points, and then process the data before I send it to the cloud.
---

# Quickstart: Add OPC UA assets to your Azure IoT Operations Preview cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you manually add OPC UA assets to your Azure IoT Operations Preview cluster. These assets publish messages to the MQTT broker in your Azure IoT Operations cluster. Typically, an OT user completes these steps.

An _asset_ is a physical device or logical entity that represents a device, a machine, a system, or a process. For example, a physical asset could be a pump, a motor, a tank, or a production line. A logical asset that you define can have properties, stream telemetry, or generate events.

_OPC UA servers_ are software applications that communicate with assets. _OPC UA tags_ are data points that OPC UA servers expose. OPC UA tags can provide real-time or historical data about the status, performance, quality, or condition of assets.

In this quickstart, you use the operations experience web UI to create your assets. You can also use the [Azure CLI to complete some of these tasks](/cli/azure/iot/ops/asset).

## Prerequisites

Have an instance of Azure IoT Operations Preview deployed in a Kubernetes cluster. The [Quickstart: Run Azure IoT Operations Preview in GitHub Codespaces with K3s](quickstart-deploy.md) provides simple instructions to deploy an Azure IoT Operations instance that you can use for the quickstarts.

To sign in to the operations experience web UI, you need a Microsoft Entra ID account with at least contributor permissions for the resource group that contains your **Kubernetes - Azure Arc** instance. To learn more, see [Operations experience web UI](../discover-manage-assets/howto-manage-assets-remotely.md#prerequisites).

Unless otherwise noted, you can run the console commands in this quickstart in either a Bash or PowerShell environment.

## What problem will we solve?

The data that OPC UA servers expose can have a complex structure and can be difficult to understand. Azure IoT Operations provides a way to model OPC UA assets as tags, events, and properties. This modeling makes it easier to understand the data and to use it in downstream processes such as the MQTT broker and dataflows.

## Deploy the OPC PLC simulator

This quickstart uses the OPC PLC simulator to generate sample data. To deploy the OPC PLC simulator, run the following command:

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

A _site_ is a collection of Azure IoT Operations instances. Sites typically group instances by physical location and make it easier for OT users to locate and manage assets. Your IT administrator creates [sites and assigns Azure IoT Operations instances to them](/azure/azure-arc/site-manager/overview). Because you're working with a new deployment, there are no sites yet. You can find the cluster you created in the previous quickstart by selecting **Unassigned instances**. In the operations experience, an instance represents a cluster where you deployed Azure IoT Operations.

:::image type="content" source="media/quickstart-add-assets/site-list.png" alt-text="Screenshot that shows the unassigned instances node in the operations experience.":::

## Select your instance

Select the instance where you deployed Azure IoT Operations in the previous quickstart:

:::image type="content" source="media/quickstart-add-assets/cluster-list.png" alt-text="Screenshot of Azure IoT Operations instance list.":::

> [!TIP]
> If you don't see any instances, you might not be in the right Microsoft Entra ID tenant. You can change the tenant from the top right menu in the operations experience.

## Add an asset endpoint

When you deployed Azure IoT Operations in the previous article, you included a built-in OPC PLC simulator. In this step, you add an asset endpoint that enables you to connect to the OPC PLC simulator.

To add an asset endpoint:

1. Select **Asset endpoints** and then **Create asset endpoint**:

    :::image type="content" source="media/quickstart-add-assets/asset-endpoints.png" alt-text="Screenshot that shows the asset endpoints page in the operations experience.":::

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

:::image type="content" source="media/quickstart-add-assets/create-asset-empty.png" alt-text="Screenshot of Azure IoT Operations empty asset list.":::

### Create an asset

To create an asset, select **Create asset**. Then enter the following asset information:

| Field | Value |
| --- | --- |
| Asset Endpoint | `opc-ua-connector-0` |
| Asset name | `thermostat` |
| Description | `A simulated thermostat asset` |

Remove the existing **Custom properties** and add the following custom properties. Be careful to use the exact property names, as the Power BI template in a later quickstart queries for them:

| Property name | Property detail |
|---------------|-----------------|
| batch         | 102             |
| customer      | Contoso         |
| equipment     | Boiler          |
| isSpare       | true            |
| location      | Seattle         |

:::image type="content" source="media/quickstart-add-assets/create-asset-details.png" alt-text="Screenshot of Azure IoT Operations asset details page.":::

Select **Next** to go to the **Add tags** page.

### Create OPC UA tags

Add two OPC UA tags on the **Add tags** page. To add each tag, select **Add tag or CSV** and then select **Add tag**. Enter the tag details shown in the following table:

| Node ID            | Tag name    | Observability mode |
| ------------------ | ----------- | ------------------ |
| ns=3;s=FastUInt10  | temperature | None               |
| ns=3;s=FastUInt100 | Tag 10      | None               |

The **Observability mode** is one of the following values: `None`, `Gauge`, `Counter`, `Histogram`, or `Log`.

You can select **Manage default settings** to change the default sampling interval and queue size for each tag.

:::image type="content" source="media/quickstart-add-assets/add-tag.png" alt-text="Screenshot of Azure IoT Operations add tag page.":::

Select **Next** to go to the **Add events** page and then **Next** to go to the **Review** page.

### Review

Review your asset and tag details and make any adjustments you need before you select **Create**:

:::image type="content" source="media/quickstart-add-assets/review-asset.png" alt-text="Screenshot of Azure IoT Operations create asset review page.":::

This configuration deploys a new asset called `thermostat` to the cluster. You can use `kubectl` to view the assets:

```console
kubectl get assets -n azure-iot-operations
```

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

## How did we solve the problem?

In this quickstart, you added an asset endpoint and then defined an asset and tags. The assets and tags model data from the OPC UA server to make the data easier to use in an MQTT broker and other downstream processes. You use the thermostat asset you defined in the next quickstart.

## What problem will we solve?

To use a tool such as Real-Time Dashboard to analyze your OPC UA data, you need to send the data to a cloud service such as Azure Event Hubs. A dataflow can subscribe to an MQTT topic and forward the messages to an event hub in your Azure Event Hubs namespace. The next quickstart shows you how to use Real-Time Dashboards to visualize and analyze your data.

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
az eventhubs namespace create --name ${CLUSTER_NAME:0:24} --resource-group $RESOURCE_GROUP --disable-local-auth true

az eventhubs eventhub create --name destinationeh --resource-group $RESOURCE_GROUP --namespace-name ${CLUSTER_NAME:0:24} --retention-time 1 --partition-count 1 --cleanup-policy Delete
```

# [PowerShell](#tab/powershell)

```powershell
az eventhubs namespace create --name $CLUSTER_NAME.Substring(0, [MATH]::Min($CLUSTER_NAME.Length, 24)) --resource-group $RESOURCE_GROUP --disable-local-auth true

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

To create and configure a dataflow in your cluster, run the following commands in your shell. This dataflow:

- Renames the `Tag 10` field in the incoming message to `Humidity`.
- Renames the `temperature` field in the incoming message to `Temperature`.
- Adds a field called `AssetId` that contains the value of the `externalAssetId` message property.
- Forwards the transformed messages from the MQTT topic to the event hub you created.

<!-- TODO: Change branch to main before merging the release branch -->

# [Bash](#tab/bash)

```bash
wget https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/dataflow.yaml
sed -i 's/<NAMESPACE>/'"${CLUSTER_NAME:0:24}"'/' dataflow.yaml

kubectl apply -f dataflow.yaml
```

# [PowerShell](#tab/powershell)

```powershell
Invoke-WebRequest -Uri https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/dataflow.yaml -OutFile dataflow.yaml

(Get-Content dataflow.yaml) | ForEach-Object { $_ -replace '<NAMESPACE>', $CLUSTER_NAME.Substring(0, [MATH]::Min($CLUSTER_NAME.Length, 24)) } | Set-Content dataflow.yaml

kubectl apply -f dataflow.yaml
```

---

## Verify data is flowing

To verify that data is flowing to the cloud, you can view your Event Hubs instance in the Azure portal. You may need to wait for several minutes for the dataflow to start and for messages to flow to the event hub.

If messages are flowing to the instance, you can see the count on incoming messages on the instance **Overview** page:

:::image type="content" source="media/quickstart-upload-telemetry-to-cloud/incoming-messages.png" alt-text="Screenshot that shows the Event Hubs instance overview page with incoming messages.":::

If messages are flowing, you can use the **Data Explorer** to view the messages:

:::image type="content" source="media/quickstart-upload-telemetry-to-cloud/event-hubs-data-viewer.png" alt-text="Screenshot of the Event Hubs instance **Data Explorer** page.":::

> [!TIP]
> You may need to assign yourself to the **Azure Event Hubs Data Receiver** role for the Event Hubs namespace to view the messages.

## How did we solve the problem?

In this quickstart, you used a dataflow to connect an MQTT topic to an event hub in your Azure Event Hubs namespace. In the next quickstart, you use Microsoft Fabric Real-Time Intelligence to visualize the data.

## Clean up resources

If you're continuing on to the next quickstart, keep all of your resources.

[!INCLUDE [tidy-resources](../includes/tidy-resources.md)]

## Next step

[Quickstart: Send asset telemetry to the cloud using the data lake connector for the MQTT broker](quickstart-upload-telemetry-to-cloud.md).

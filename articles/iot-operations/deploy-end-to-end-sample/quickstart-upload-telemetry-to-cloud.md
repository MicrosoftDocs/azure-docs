---
title: "Quickstart: Send telemetry from your assets to the cloud"
description: "Quickstart: Use the data lake connector for MQ to send asset telemetry to a Microsoft Fabric lakehouse."
author: dominicbetts
ms.author: dobett
ms.topic: quickstart
ms.subservice: data-processor
ms.custom:
  - ignite-2023
ms.date: 04/19/2024

#CustomerIntent: As an OT user, I want to send my OPC UA data to the cloud so that I can derive insights from it by using a tool such as Power BI.
---

# Quickstart: Send asset telemetry to the cloud using the data lake connector for Azure IoT MQ Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you use the data lake connector for Azure IoT MQ to forward telemetry from your OPC UA assets to a Microsoft Fabric lakehouse for storage and analysis.

## Prerequisites

Before you begin this quickstart, you must complete the following quickstarts:

- [Quickstart: Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster](quickstart-deploy.md)
- [Quickstart: Add OPC UA assets to your Azure IoT Operations Preview cluster](quickstart-add-assets.md)

You also need a Microsoft Fabric subscription. If you don't have a subscription, you can sign up for a free [Microsoft Fabric trial capacity](/fabric/get-started/fabric-trial). To access the trial capacity, you must be a [trial capacity administrator](/fabric/get-started/fabric-trial#look-up-the-trial-capacity-administrator). In your Microsoft Fabric subscription, ensure that the following settings are enabled for your tenant:

- [Allow service principals to use Power BI APIs](/fabric/admin/service-admin-portal-developer#allow-service-principals-to-use-power-bi-apis)
- [Users can access data stored in OneLake with apps external to Fabric](/fabric/admin/service-admin-portal-onelake#users-can-access-data-stored-in-onelake-with-apps-external-to-fabric)

To learn more, see [Microsoft Fabric > About tenant settings](/fabric/admin/tenant-settings-index).

## What problem will we solve?

To use a tool such as Power BI to analyze your OPC UA data, you need to send the data to a cloud-based storage service. The data lake connector for Azure IoT MQ subscribes to MQTT topics and ingests the messages into Delta tables in a Microsoft Fabric lakehouse. The next quickstart shows you how to use Power BI to analyze the data in the lakehouse.

## Grant access to your Microsoft Fabric workspace

You need to allow the MQ extension on your cluster to connect to your Microsoft Fabric workspace. You made a note of the MQ extension name in the [deployment quickstart](quickstart-deploy.md#view-resources-in-your-cluster). The name of the extension looks like `mq-z2ewy`.

> [!TIP]
> If you need to find the unique name assigned to your MQ extension, run the following command in your Codespaces terminal to list your cluster extensions: `az k8s-extension list --resource-group <your-resource-group-name> --cluster-name $CLUSTER_NAME --cluster-type connectedClusters -o table`

Navigate to the [Microsoft Fabric Power BI experience](https://msit.powerbi.com/groups/me/list?experience=power-bi). To ensure you can see the **Manage access** option in your Microsoft Fabric workspace, create a new workspace:

1. Select **Workspaces** in the left navigation bar, then select **New workspace**:

    :::image type="content" source="media/quickstart-upload-telemetry-to-cloud/create-fabric-workspace.png" alt-text="Screenshot that shows how to create a new Microsoft Fabric workspace.":::

1. Enter a name for your workspace, such as _yournameaioworkspace_, and select **Apply**. Make a note of this name, you need it later.

    > [!TIP]
    > Don't include any spaces in the name of your workspace.

To grant the MQ extension access to your Microsoft Fabric workspace:

1. In your Microsoft Fabric workspace, select **Manage access**:

    :::image type="content" source="media/quickstart-upload-telemetry-to-cloud/workspace-manage-access.png" alt-text="Screenshot that shows how to access the Manage access option in a workspace.":::

1. Select **Add people or groups**, then paste the name of the MQ extension you made a note of previously and grant it at least **Contributor** access:

    :::image type="content" source="media/quickstart-upload-telemetry-to-cloud/workspace-add-service-principal.png" alt-text="Screenshot that shows how to add a service principal to a workspace and add it to the contributor role.":::

1. Select **Add** to grant the MQ extension contributor permissions in the workspace.

## Create a lakehouse

Create a lakehouse in your Microsoft Fabric workspace:

1. Select **New** and **More options**, then choose **Lakehouse** from the list.

    :::image type="content" source="media/quickstart-upload-telemetry-to-cloud/create-lakehouse.png" alt-text="Screenshot that shows how to create a lakehouse.":::

1. Enter *aiomqdestination* as the name for your lakehouse and select **Create**.

## Configure a connector

Your codespace comes with the following sample connector configuration file, `/workspaces/explore-iot-operations/samples/quickstarts/datalake-connector.yaml`:

:::code language="yaml" source="~/azure-iot-operations-samples/samples/quickstarts/datalake-connector.yaml":::

1. Open the _datalake-connector.yaml_ file in a text editor and replace `<your-workspace-name>` with the name of your Microsoft Fabric workspace. You made a note of this value when you created the workspace.

1. Save the file.

1. Run the following command to create the connector:

   ```console
   kubectl apply -f samples/quickstarts/datalake-connector.yaml
   ```

After a short time, the data from your MQ broker begins to populate the table in your lakehouse. You may need refresh the lakehouse page to see the data.

:::image type="content" source="media/quickstart-upload-telemetry-to-cloud/lakehouse-preview.png" alt-text="Screenshot that shows data from the pipeline appearing in the lakehouse table.":::

> [!TIP]
> Make sure that no other processes write to the OPCUA table in your lakehouse. If you write to the table from multiple sources, you might see corrupted data in the table.

## How did we solve the problem?

In this quickstart, you used the data lake connector for Azure IoT MQ to ingest the data into a Microsoft Fabric lakehouse in the cloud. In the next quickstart, you use Power BI to analyze the data in the lakehouse.

## Clean up resources

If you're not going to continue to use this deployment, delete the Kubernetes cluster where you deployed Azure IoT Operations and remove the Azure resource group that contains the cluster.

You can also delete your Microsoft Fabric workspace.

## Next step

[Quickstart: Get insights from your asset telemetry](quickstart-get-insights.md)

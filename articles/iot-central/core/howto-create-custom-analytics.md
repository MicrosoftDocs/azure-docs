---
title: Extend Azure IoT Central with custom analytics
description: As a solution developer, configure an IoT Central application to do custom analytics and visualizations. This solution uses Azure Databricks.
author: dominicbetts 
ms.author: dobett 
ms.date: 06/14/2023
ms.topic: how-to
ms.service: iot-central
services: iot-central
ms.custom: mvc, devx-track-azurecli
# Solution developer
---

# Extend Azure IoT Central with custom analytics using Azure Databricks

This how-to guide shows you how to extend your IoT Central application with custom analytics and visualizations. The example uses an [Azure Databricks](/azure/azure-databricks/) workspace to analyze the IoT Central telemetry stream and to generate visualizations such as [box plots](https://wikipedia.org/wiki/Box_plot).  

This how-to guide shows you how to extend IoT Central beyond what it can already do with the [built-in analytics tools](./howto-create-custom-analytics.md).

In this how-to guide, you learn how to:

* Stream telemetry from an IoT Central application using *continuous data export*.
* Create an Azure Databricks environment to analyze and plot device telemetry.

## Prerequisites

[!INCLUDE [azure-cli-prepare-your-environment-no-header](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Run the Script

The following script creates an IoT Central application, Event Hubs namespace, and Databricks workspace in a resource group called `eventhubsrg`.

```azurecli

# A unique name for the Event Hub Namespace.
eventhubnamespace="your-event-hubs-name-data-bricks"

# A unique name for the IoT Central application.
iotcentralapplicationname="your-app-name-data-bricks"

# A unique name for the Databricks workspace.
databricksworkspace="your-databricks-name-data-bricks"

# Name for the Resource group.
resourcegroup=eventhubsrg

eventhub=centralexport
location=eastus
authrule=ListenSend


#Create a resource group for the IoT Central application.
RESOURCE_GROUP=$(az group create --name $resourcegroup --location $location)

# Create an IoT Central application
IOT_CENTRAL=$(az iot central app create -n $iotcentralapplicationname -g $resourcegroup -s $iotcentralapplicationname -l $location --mi-system-assigned)


# Create an Event Hubs namespace.
az eventhubs namespace create --name $eventhubnamespace --resource-group $resourcegroup -l $location

# Create an Azure Databricks workspace 
DATABRICKS_JSON=$(az databricks workspace create --resource-group $resourcegroupname --name $databricksworkspace --location $location --sku standard)


# Create an Event Hub
az eventhubs eventhub create --name $eventhub --resource-group $resourcegroupname --namespace-name $eventhubnamespace


# Configure the managed identity for your IoT Central application
# with permissions to send data to an event hub in the resource group.
MANAGED_IDENTITY=$(az iot central app identity show --name $iotcentralapplicationname \
    --resource-group $resourcegroup)
az role assignment create --assignee $(jq -r .principalId <<< $MANAGED_IDENTITY) --role 'Azure Event Hubs Data Sender' --scope $(jq -r .id <<< $RESOURCE_GROUP)


# Create a connection string to use in Databricks notebook
az eventhubs eventhub authorization-rule create --eventhub-name $eh  --namespace-name $ehns --resource-group $rg --name $authrule --rights Listen Send
EHAUTH_JSON=$(az eventhubs eventhub authorization-rule keys list --resource-group $rg --namespace-name $ehns --eventhub-name $eh --name $authrule)

# Details of your IoT Central application, databricks workspace, and event hub connection string

echo "Your IoT Central app: https://$iotcentralapplicationname.azureiotcentral.com/"
echo "Your Databricks workspace: https://$(jq -r .workspaceUrl <<< $DATABRICKS_JSON)"
echo "Your event hub connection string is: $(jq -r .primaryConnectionString <<< EHAUTH_JSON)"

```

Make a note of the three values output by the script, you need them in the following steps.

## Configure export in IoT Central

In this section, you configure the application to stream telemetry from its simulated devices to your event hub.

Use the URL output by the script to navigate to the IoT Central application it created.

1. Navigate to the **Data export** page, then select **Destinations**.
1. Select **+ New destination**.
1. Use the values in the following table to create a destination:

    | Setting | Value |
    | ----- | ----- |
    | Destination name | Telemetry event hub |
    | Destination type | Azure Event Hubs |
    | Authorization | System-assigned managed identity |
    | Host name | The event hub namespace host name, it's the value you assigned to `eventhubnamespace` in the earlier script  |
    | Event Hub | The event hub name, it's the value you assigned to `eventhub` in the earlier script  |

    :::image type="content" source="media/howto-create-custom-analytics/data-export-1.png" alt-text="Screenshot showing data export destination." lightbox="media/howto-create-custom-analytics/data-export-1.png":::

1. Select **Save**.

To create the export definition:

1. Navigate to the **Data export** page and select **+ New Export**.

1. Use the values in the following table to configure the export:

    | Setting | Value |
    | ------- | ----- |
    | Export name | Event Hub Export |
    | Enabled | On |
    | Type of data to export | Telemetry |
    | Destinations | Select **+ Destination**, then select **Telemetry event hub** |

1. Select **Save**.

:::image type="content" source="media/howto-create-custom-analytics/data-export-2.png" alt-text="Screenshot showing data export definition." lightbox="media/howto-create-custom-analytics/data-export-2.png":::

Wait until the export status is **Healthy** on the **Data export** page before you continue.

## Create a device template

To add a device template for the MXChip device:

1. Select **+ New** on the **Device templates** page.
1. On the **Select type** page, scroll down until you find the **MXCHIP AZ3166** tile in the **Featured device templates** section.
1. Select the **MXCHIP AZ3166** tile, and then select **Next: Review**.
1. On the **Review** page, select **Create**.

## Add a device

To add a simulated device to your Azure IoT Central application:

1. Choose **Devices** on the left pane.
1. Choose the **MXCHIP AZ3166** device template from which you created.
1. Choose + **New**.
1. Enter a device name and ID or accept the default. The maximum length of a device name is 148 characters. The maximum length of a device ID is 128 characters.
1. Turn the **Simulated** toggle to **On**.
1. Select **Create**.

Repeat these steps to add two more simulated MXChip devices to your application.

## Configure Databricks workspace

Use the URL output by the script to navigate to the Databricks workspace it created.

### Create a cluster

Navigate to **Create** page in your Databricks environment. Select the **+ Cluster**.

Use the information in the following table to create your cluster:

| Setting | Value |
| ------- | ----- |
| Cluster Name | centralanalysis |
| Cluster Mode | Standard |
| Databricks Runtime Version | Runtime: 10.4 LTS (Scala 2.12, Spark 3.2.1) |
| Enable Autoscaling | No |
| Terminate after minutes of inactivity | 30 |
| Worker Type | Standard_DS3_v2 |
| Workers | 1 |
| Driver Type | Same as worker |

Creating a cluster may take several minutes, wait for the cluster creation to complete before you continue.

### Install libraries

On the **Clusters** page, wait until the cluster state is **Running**.

The following steps show you how to import the library your sample needs into the cluster:

1. On the **Clusters** page, wait until the state of the **centralanalysis** interactive cluster is **Running**.

1. Select the cluster and then choose the **Libraries** tab.

1. On the **Libraries** tab, choose **Install New**.

1. On the **Install Library** page, choose **Maven** as the library source.

1. In the **Coordinates** textbox, enter the following value: `com.microsoft.azure:azure-eventhubs-spark_2.11:2.3.10`

1. Choose **Install** to install the library on the cluster.

1. The library status is now **Installed**:

:::image type="content" source="media/howto-create-custom-analytics/cluster-libraries.png" alt-text="Screenshot of Libraries page in Databricks showing installed library.":::

### Import a Databricks notebook

Use the following steps to import a Databricks notebook that contains the Python code to analyze and visualize your IoT Central telemetry:

1. Navigate to the **Workspace** page in your Databricks environment. Select the dropdown from the workspace and then choose **Import**.

    :::image type="content" source="media/howto-create-custom-analytics/databricks-import.png" alt-text="Screenshot of Databricks notebook import.":::

1. Choose to import from a URL and enter the following address: [https://github.com/Azure-Samples/iot-central-docs-samples/blob/main/databricks/IoT%20Central%20Analysis.dbc?raw=true](https://github.com/Azure-Samples/iot-central-docs-samples/blob/main/databricks/IoT%20Central%20Analysis.dbc?raw=true)

1. To import the notebook, choose **Import**.

1. Select the **Workspace** to view the imported notebook:

    :::image type="content" source="media/howto-create-custom-analytics/import-notebook.png" alt-text="Screenshot of imported notebook in Databricks.":::

1. Use the connection string output by the script to edit the code in the first Python cell to add the Event Hubs connection string:

    ```python
    from pyspark.sql.functions import *
    from pyspark.sql.types import *

    ###### Event Hub Connection strings ######
    telementryEventHubConfig = {
      'eventhubs.connectionString' : '{your Event Hubs connection string}'
    }
    ```

## Run analysis

To run the analysis, you must attach the notebook to the cluster:

1. Select **Detached** and then select the **centralanalysis** cluster.
1. If the cluster isn't running, start it.
1. To start the notebook, select the run button.

You may see an error in the last cell. If so, check the previous cells are running, wait a minute for some data to be written to storage, and then run the last cell again.

### View smoothed data

In the notebook, scroll down to see a plot of the rolling average humidity by device type. This plot continuously updates as streaming telemetry arrives:

:::image type="content" source="media/howto-create-custom-analytics/telemetry-plot.png" alt-text="Screenshot of smoothed telemetry plot in the Databricks notebook.":::

You can resize the chart in the notebook.

### View box plots

In the notebook, scroll down to see the [box plots](https://en.wikipedia.org/wiki/Box_plot). The box plots are based on static data so to update them you must rerun the cell:

:::image type="content" source="media/howto-create-custom-analytics/box-plots.png" alt-text="Screenshot of box plots in the Databricks notebook.":::

You can resize the plots in the notebook.

## Tidy up

To tidy up after this how-to and avoid unnecessary costs, you can run the following command to delete the resource group:

```azurecli
az group delete -n eventhubsrg
```

## Next steps

In this how-to guide, you learned how to:

* Stream telemetry from an IoT Central application using *continuous data export*.
* Create an Azure Databricks environment to analyze and plot telemetry data.

Now that you know how to create custom analytics, the suggested next step is to learn how to [Use the IoT Central device bridge to connect other IoT clouds to IoT Central](howto-build-iotc-device-bridge.md).

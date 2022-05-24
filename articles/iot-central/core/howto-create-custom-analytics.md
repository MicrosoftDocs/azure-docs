---
title: Extend Azure IoT Central with custom analytics | Microsoft Docs
description: As a solution developer, configure an IoT Central application to do custom analytics and visualizations. This solution uses Azure Databricks.
author: dominicbetts 
ms.author: dobett 
ms.date: 12/21/2021
ms.topic: how-to
ms.service: iot-central
services: iot-central
ms.custom: mvc


# Solution developer
---

# Extend Azure IoT Central with custom analytics using Azure Databricks

This how-to guide shows you how to extend your IoT Central application with custom analytics and visualizations. The example uses an [Azure Databricks](/azure/azure-databricks/) workspace to analyze the IoT Central telemetry stream and to generate visualizations such as [box plots](https://wikipedia.org/wiki/Box_plot).  

This how-to guide shows you how to extend IoT Central beyond what it can already do with the [built-in analytics tools](./howto-create-custom-analytics.md).

In this how-to guide, you learn how to:

* Stream telemetry from an IoT Central application using *continuous data export*.
* Create an Azure Databricks environment to analyze and plot device telemetry.

## Prerequisites

[!INCLUDE [azure-cli-prepare-your-environment-no-header](../../../includes/azure-cli-prepare-your-environment-no-header.md)]

In your shell environment, add the following variables.

```
eventhubnamespace="your-event-hubs-name-data-bricks"
iotcentralapplicationname="your-app-name-data-bricks"
databricksworkspace="your-databricks-name-data-bricks"
resourcegroup=eventhubsrg
eventhub=centralexport
location=eastus
authrule=ListenSend
```

## Create a resource group

Create a resource group for the IoT Central application. For example:

```azurecli-interactive
RESOURCE_GROUP=$(az group create --name $resourcegroup --location $location)
```

This command creates a resource group in the east US region for the application. 

### IoT Central application

Use the [az iot central app create](/cli/azure/iot/central/app#az-iot-central-app-create) command to create an IoT Central application in your Azure subscription. For example:

```azurecli-interactive
# Create an IoT Central application
IOT_CENTRAL=$(az iot central app create -n $iotcentralapplicationname -g $resourcegroup -s $iotcentralapplicationname -l $location --mi-system-assigned)
```

The following table describes the parameters used with the **az iot central app create** command:

| Parameter         | Description |
| ----------------- | ----------- |
| resource-group    | The resource group that contains the application. This resource group must already exist in your subscription. |
| location          | By default, this command uses the location from the resource group. Currently, you can create an IoT Central application in the **Australia East**, **Canada Central**, **Central US**, **East US**, **East US 2**, **Japan East**, **North Europe**, **South Central US**, **Southeast Asia**, **UK South**, **West Europe**, and **West US**. |
| name              | The name of the application in the Azure portal. Avoid special characters - instead, use lower case letters (a-z), numbers (0-9), and dashes (-).|
| subdomain         | The subdomain in the URL of the application. In the example, the application URL is `https://mysubdomain.azureiotcentral.com`. |
| sku               | Currently, you can use either **ST1** or **ST2**. See [Azure IoT Central pricing](https://azure.microsoft.com/pricing/details/iot-central/). |
| template          | The application template to use. For more information, see the following table. |
| display-name      | The name of the application as displayed in the UI. |

## Event Hubs namespace

An Event Hubs namespace provides a unique scoping container, referenced by its fully qualified domain name, in which you create one or more event hubs. To create a namespace in your resource group, run the following command:

```azurecli-interactive
az eventhubs namespace create --name $eventhubnamespace --resource-group $resourcegroup -l $location
```

## Azure Databricks workspace

Create an Azure Databricks workspace for accessing all of your Azure Databricks assets. The workspace organizes objects (notebooks, libraries, and experiments) into folders, and provides access to data and computational resources such as clusters and jobs.

```azurecli-interactive
DATABRICKS_JSON=$(az databricks workspace create --resource-group $resourcegroupname --name $databricksworkspace --location $location --sku standard)
```

## Create an event hub

Azure Event Hubs is a big data streaming platform and event ingestion service.

Run the following command to create an event hub:

```azurecli-interactive
az eventhubs eventhub create --name $eventhub --resource-group $resourcegroupname --namespace-name $eventhubnamespace
```

## Configure managed identity 

```azurecli-interactive
MANAGED_IDENTITY=$(az iot central app identity show --name $iotcentralapplicationname \
    --resource-group $resourcegroup)
```

Create a role with permissions to send data to an event hub in the resource group.

```azurecli-interactive
az role assignment create --assignee $(jq -r .principalId <<< $MANAGED_IDENTITY) --role 'Azure Event Hubs Data Sender' --scope $(jq -r .id <<< $RESOURCE_GROUP)

```

## Create a connection string to use in Databricks notebook

```azurecli-interactive
az eventhubs eventhub authorization-rule create --eventhub-name $eh  --namespace-name $ehns --resource-group $rg --name $authrule --rights Listen Send
EHAUTH_JSON=$(az eventhubs eventhub authorization-rule keys list --resource-group $rg --namespace-name $ehns --eventhub-name $eh --name $authrule)
```

Run the following commands to get details of your IoT Central application, databricks workspace, and event hub connection string

```azurecli-interactive
echo "Your IoT Central app: https://$iotcentralapplicationname.azureiotcentral.com/"
echo "Your Databricks workspace: https://$(jq -r .workspaceUrl <<< $DATABRICKS_JSON)"
echo "Your event hub connection string is: $(jq -r .primaryConnectionString <<< EHAUTH_JSON)"
```

## Configure export in IoT Central

In this section, you configure the application to stream telemetry from its simulated devices to your event hub.

On the [Azure IoT Central application manager](https://aka.ms/iotcentral) website, navigate to the IoT Central application you created previously. To configure the export, first create a destination:

1. Navigate to the **Data export** page, then select **Destinations**.
1. Select **+ New destination**.
1. Use the values in the following table to create a destination:

    | Setting | Value |
    | ----- | ----- |
    | Destination name | Telemetry event hub |
    | Destination type | Azure Event Hubs |
    | Connection string | The event hub connection string you made a note of previously |

    The **Event Hub** shows as **centralexport**.

    :::image type="content" source="media/howto-create-custom-analytics/data-export-1.png" alt-text="Screenshot showing data export destination.":::

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

    :::image type="content" source="media/howto-create-custom-analytics/data-export-2.png" alt-text="Screenshot showing data export definition.":::

Wait until the export status is **Healthy** on the **Data export** page before you continue.

## Configure Databricks workspace

In the Azure portal, navigate to your Azure Databricks service and select **Launch Workspace**. A new tab opens in your browser and signs you in to your workspace.

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

:::image type="content" source="media/howto-create-custom-analytics/cluster-libraries.png" alt-text="Screenshot of Library installed.":::

### Import a Databricks notebook

Use the following steps to import a Databricks notebook that contains the Python code to analyze and visualize your IoT Central telemetry:

1. Navigate to the **Workspace** page in your Databricks environment. Select the dropdown next to your account name and then choose **Import**.

1. Choose to import from a URL and enter the following address: [https://github.com/Azure-Samples/iot-central-docs-samples/blob/master/databricks/IoT%20Central%20Analysis.dbc?raw=true](https://github.com/Azure-Samples/iot-central-docs-samples/blob/master/databricks/IoT%20Central%20Analysis.dbc?raw=true)

1. To import the notebook, choose **Import**.

1. Select the **Workspace** to view the imported notebook:

:::image type="content" source="media/howto-create-custom-analytics/import-notebook.png" alt-text="Screenshot of Imported notebook.":::

5. Edit the code in the first Python cell to add the Event Hubs connection string you saved previously:

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

:::image type="content" source="media/howto-create-custom-analytics/telemetry-plot.png" alt-text="Screenshot of Smoothed telemetry plot.":::

You can resize the chart in the notebook.

### View box plots

In the notebook, scroll down to see the [box plots](https://en.wikipedia.org/wiki/Box_plot). The box plots are based on static data so to update them you must rerun the cell:

:::image type="content" source="media/howto-create-custom-analytics/box-plots.png" alt-text="Screenshot of box plots.":::

You can resize the plots in the notebook.

## Tidy up

To tidy up after this how-to and avoid unnecessary costs, delete the **IoTCentralAnalysis** resource group in the Azure portal.

You can delete the IoT Central application from the **Management** page within the application.

## Next steps

In this how-to guide, you learned how to:

* Stream telemetry from an IoT Central application using *continuous data export*.
* Create an Azure Databricks environment to analyze and plot telemetry data.

Now that you know how to create custom analytics, the suggested next step is to learn how to [Use the IoT Central device bridge to connect other IoT clouds to IoT Central](howto-build-iotc-device-bridge.md).

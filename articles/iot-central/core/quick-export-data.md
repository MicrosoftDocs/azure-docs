---
title: Quickstart - Export data from Azure IoT Central
description: Quickstart - Learn how to use the data export feature in IoT Central to integrate with other cloud services.
author: dominicbetts
ms.author: dobett
ms.date: 02/18/2022
ms.topic: quickstart
ms.service: iot-central
services: iot-central
ms.custom: mvc, mode-other, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Export data from an IoT Central application

This quickstart shows you how to continuously export data from your Azure IoT Central application to another cloud service. To get you set up quickly, this quickstart uses [Azure Data Explorer](/azure/data-explorer/data-explorer-overview), a fully managed data analytics service for real-time analysis. Azure Data Explorer lets you store, query, and process the telemetry from devices such as the **IoT Plug and Play** smartphone app.

In this quickstart, you:

- Use the data export feature in IoT Central to export the telemetry sent by the smartphone app to an Azure Data Explorer database.
- Use Azure Data Explorer to run queries on the telemetry.

## Prerequisites

- Before you begin, you should complete the first quickstart [Create an Azure IoT Central application](./quick-deploy-iot-central.md). The second quickstart, [Configure rules and actions for your device](quick-configure-rules.md), is optional.
- You need the IoT Central application *URL prefix* that you chose in the first quickstart [Create an Azure IoT Central application](./quick-deploy-iot-central.md).

[!INCLUDE [azure-cli-prepare-your-environment-no-header](../../../includes/azure-cli-prepare-your-environment-no-header.md)]

## Install Azure services

Before you can export data from your IoT Central application, you need an Azure Data Explorer cluster and database. In this quickstart, you use the bash environment in the [Azure Cloud Shell](https://shell.azure.com) to create and configure them.

Run the following script in the Azure Cloud Shell. Replace the `clustername` value with a unique name for your cluster before you run the script. The cluster name can contain only lowercase letters and numbers. Replace the `centralurlprefix` value with the URL prefix you chose in the first quickstart:

> [!IMPORTANT]
> The script can take 20 to 30 minutes to run.

```azurecli
# The cluster name can contain only lowercase letters and numbers.
# It must contain from 4 to 22 characters.
clustername="<A unique name for your cluster>"

centralurlprefix="<The URL prefix of your IoT Central application>"

databasename="phonedata"
location="eastus"
resourcegroup="IoTCentralExportData"

az extension add -n kusto

# Create a resource group for the Azure Data Explorer cluster
az group create --location $location \
    --name $resourcegroup

# Create the Azure Data Explorer cluster
# This command takes at least 10 minutes to run
az kusto cluster create --cluster-name $clustername \
    --sku name="Standard_D11_v2"  tier="Standard" \
    --enable-streaming-ingest=true \
    --enable-auto-stop=true \
    --resource-group $resourcegroup --location $location

# Create a database in the cluster
az kusto database create --cluster-name $clustername \
    --database-name $databasename \
    --read-write-database location=$location soft-delete-period=P365D hot-cache-period=P31D \
    --resource-group $resourcegroup

# Create and assign a managed identity to use
# when authenticating from IoT Central.
# This assumes your IoT Central was created in the default
# IOTC resource group.
MI_JSON=$(az iot central app identity assign --name $centralurlprefix \
    --resource-group IOTC --system-assigned)

## Assign the managed identity permissions to use the database.
az kusto database-principal-assignment create --cluster-name $clustername \
                                              --database-name $databasename \
                                              --principal-id $(jq -r .principalId <<< $MI_JSON) \
                                              --principal-assignment-name $centralurlprefix \
                                              --resource-group $resourcegroup \
                                              --principal-type App \
                                              --tenant-id $(jq -r .tenantId <<< $MI_JSON) \
                                              --role Admin

echo "Azure Data Explorer URL: $(az kusto cluster show --name $clustername --resource-group $resourcegroup --query uri -o tsv)" 
```

Make a note of the **Azure Data Explorer URL**. You use this value later in the quickstart.

## Configure the database

To add a table in the database to store the accelerometer data from the **IoT Plug and Play** smartphone app:

1. Use the **Azure Data Explorer URL** from the previous section to navigate to your Azure Data Explorer environment.

1. Expand the cluster node and select the **phonedata** database. The cope of the query window changes to `Scope:yourclustername.eastus/phonedata`.

1. Paste the following Kusto script into the query editor and select **Run**:

    ```kusto
    .create table acceleration (
      EnqueuedTime:datetime,
      Device:string,
      X:real,
      Y:real,
      Z:real
    );
    ```

    The result looks like the following screenshot:

    :::image type="content" source="media/quick-export-data/azure-data-explorer-create-table.png" alt-text="Screenshot that shows the results of creating the table in Azure Data Explorer.":::

1. In the Azure Data Explorer, open a new tab and paste in the following Kusto script. The script enables streaming ingress for the **acceleration** table:

    ```kusto
    .alter table acceleration policy streamingingestion enable;
    ```

Keep the Azure Data Explorer page open in your browser. After you configure the data export in your IoT Central application, you'll run a query to view the accelerometer telemetry stored in the **acceleration** table.

## Configure data export

To configure the data export destination from IoT Central:

1. Navigate to the **Data export** page in your IoT Central application.
1. Select the **Destinations** tab and then **Add a destination**.
1. Enter *Azure Data Explorer* as the destination name. Select **Azure Data Explorer** as the destination type.
1. In **Cluster URL**, enter the **Azure Data Explorer URL** you made a note of previously.
1. In **Database name**, enter *phonedata*.
1. In **Table name**, enter *acceleration*.
1. In **Authorization**, select **System-assigned managed identity**.
1. Select **Save**.

To configure the data export:

1. On the **Data export** page, select the **Exports** tab, and then **Add an export**.
1. Enter *Phone accelerometer* as the export name.
1. Select **Telemetry** as the type of data to export.
1. Use the information in the following table to add two filters:

    | Name | Operator | Value |
    | ---- | -------- | ----- |
    | Device template | Equals | IoT Plug and Play mobile |
    | Sensors/Acceleration/X | Exists | N/A |

    Make sure that the option to export the data if all of the conditions are true is set.

1. Add **Azure Data Explorer** as a destination.
1. Add a data transformation to the destination. Add the following query in the **2. Build transformation query** field on the **Data transformation page**:

    ```json
    import "iotc" as iotc;
    {
        Device: .device.id,
        EnqueuedTime: .enqueuedTime,
        X: .telemetry | iotc::find(.name == "accelerometer").value.x,
        Y: .telemetry | iotc::find(.name == "accelerometer").value.y,
        Z: .telemetry | iotc::find(.name == "accelerometer").value.z
    }
    ```

    :::image type="content" source="media/quick-export-data/data-transformation-query.png" alt-text="Screenshot that shows the data transformation query for the export.":::

    If you want to see how the transformation works and experiment with the query, paste the following sample telemetry message into **1. Add your input message**:

    ```json
    {
      "messageProperties": {},
      "device": {
        "id": "8hltz8xa7n",
        "properties": {
          "reported": []
        },
        "approved": true,
        "types": [],
        "name": "8hltz8xa7n",
        "simulated": false,
        "provisioned": true,
        "modules": [],
        "templateId": "urn:modelDefinition:vlcd3zvzdm:y425jkkpqzeu",
        "templateName": "IoT Plug and Play mobile",
        "organizations": [],
        "cloudProperties": [],
        "blocked": false
      },
      "component": "sensors",
      "applicationId": "40a97c91-50cc-44f0-9f63-71386613facc",
      "messageSource": "telemetry",
      "telemetry": [
        {
          "id": "dtmi:azureiot:PhoneSensors:__accelerometer;1",
          "name": "accelerometer",
          "value": {
            "x": 0.09960123896598816,
            "y": 0.09541380405426025,
            "z": 9.907781600952148
          }
        }
      ],
      "enqueuedTime": "2021-11-12T10:01:30.588Z",
      "enrichments": {}
    }
    ```

1. Save the transformation. Then save the data export definition.

Wait until the export status shows **Healthy**:

:::image type="content" source="media/quick-export-data/healthy-export.png" alt-text="Screenshot that shows a running data export with the healthy status.":::

## Query exported data

In Azure Data Explorer, open a new tab and paste in the following Kusto query and then select **Run** to plot the accelerometer telemetry:

```kusto
['acceleration'] 
    | project EnqueuedTime, Device, X, Y, Z
    | render timechart 
```

You may need to wait for several minutes to collect enough data. Try holding your phone in different orientations to see the telemetry values change:

:::image type="content" source="media/quick-export-data/acceleration-plot.png" alt-text="Screenshot of the query results for the accelerometer telemetry.":::

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources](../../../includes/iot-central-clean-up-resources.md)]

To remove the Azure Data Explorer instance from your subscription and avoid being billed unnecessarily, delete the **IoTCentralExportData** resource group from the [Azure portal](https://portal.azure.com/#blade/HubsExtension/BrowseResourceGroups) or run the following command in the Azure Cloud Shell:

```azurecli
az group delete --name IoTCentralExportData
```

## Next steps

In this quickstart, you learned how to continuously export data from IoT Central to another Azure service.

Now that you know now to export your data, the suggested next step is to:

> [!div class="nextstepaction"]
> [Build and manage a device template](howto-set-up-template.md).

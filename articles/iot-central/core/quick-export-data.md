---
title: Quickstart - Export data from Azure IoT Central
description: In this quickstart, you learn how to use the data export feature in IoT Central to integrate with other cloud services.
author: dominicbetts
ms.author: dobett
ms.date: 03/01/2024
ms.topic: quickstart
ms.service: iot-central
services: iot-central
ms.custom: mvc, mode-other, devx-track-azurecli
ms.devlang: azurecli
# Customer intent: As a new user of IoT Central, I want to learn how to use the data export feature so that I can integrate my IoT Central application with other backend services.
---

# Quickstart: Export data from an IoT Central application

In this quickstart, you configure your IoT Central application to export data Azure Data Explorer. Azure Data Explorer lets you store, query, and process the telemetry from devices such as the **IoT Plug and Play** smartphone app.

In this quickstart, you:

- Use the data export feature in IoT Central to the telemetry from the smartphone app to an Azure Data Explorer database.
- Use Azure Data Explorer to run queries on the telemetry.

Completing this quickstart incurs a small cost in your Azure account for the Azure Data Explorer instance. The first two devices in your IoT Central application are free.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- Complete the first quickstart [Create an Azure IoT Central application](./quick-deploy-iot-central.md). The second quickstart, [Configure rules and actions for your device](quick-configure-rules.md), is optional.
- You need the IoT Central application *URL prefix* that you chose in the first quickstart [Create an Azure IoT Central application](./quick-deploy-iot-central.md).

[!INCLUDE [azure-cli-prepare-your-environment-no-header](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Install Azure services

Before you can export data from your IoT Central application, you need an Azure Data Explorer cluster and database. In this quickstart, you run a bash script in the [Azure Cloud Shell](https://shell.azure.com) to create and configure them.

The script completes the following steps:

- Prompts you to sign in to your Azure subscription so that it can generate a bearer token to authenticate the REST API calls.
- Creates an Azure Data Explorer cluster and database.
- Creates a managed identity for your IoT Central application.
- Configures the managed identity with permission to access the Azure Data Explorer database.
- Adds a table to the database to store the incoming telemetry from IoT Central.

Run the following commands to download the script to your Azure Cloud Shell environment:

```azurecli
wget https://raw.githubusercontent.com/Azure-Samples/iot-central-docs-samples/main/quickstart-cde/createADX.sh
chmod u+x createADX.sh
```

Use the following command to run the script:

- Replace `CLUSTER_NAME` with a unique name for your Azure Data Explorer cluster. The cluster name can contain only lowercase letters and numbers. The length of the cluster name must be between 4 and 22 characters.
- Replace `CENTRAL_URL_PREFIX` with URL prefix you chose in the first quickstart for your IoT Central application.
- When prompted, follow the instructions to sign in to your account. It's necessary for the script to sign in because it generates a bearer token to authenticate a REST API call.

```azurecli
./createADX.sh CLUSTER_NAME CENTRAL_URL_PREFIX
```

> [!IMPORTANT]
> This script can take 20 to 30 minutes to run.

Make a note of the **Azure Data Explorer URL** output by the script. You use this value later in the quickstart.

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

    :::image type="content" source="media/quick-export-data/data-transformation-query.png" alt-text="Screenshot that shows the data transformation query for the export." lightbox="media/quick-export-data/data-transformation-query.png":::

    To see how the transformation works and experiment with the query, paste the following sample telemetry message into **1. Add your input message**:

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

:::image type="content" source="media/quick-export-data/healthy-export.png" alt-text="Screenshot that shows a running data export with the healthy status." lightbox="media/quick-export-data/healthy-export.png":::

## Query exported data

To query the exported telemetry:

1. Use the **Azure Data Explorer URL** output by the script you ran previously to navigate to your Azure Data Explorer environment.

1. Expand the cluster node and select the **phonedata** database. The scope of the query window changes to `Scope:yourclustername.eastus/phonedata`.

1. In Azure Data Explorer, open a new tab and paste in the following Kusto query and then select **Run** to plot the accelerometer telemetry:

  ```kusto
  ['acceleration'] 
      | project EnqueuedTime, Device, X, Y, Z
      | render timechart 
  ```

You might need to wait for several minutes to collect enough data. To see the telemetry values change, try holding your phone in different orientations:

:::image type="content" source="media/quick-export-data/acceleration-plot.png" alt-text="Screenshot of the query results for the accelerometer telemetry." lightbox="media/quick-export-data/acceleration-plot.png":::

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources](../../../includes/iot-central-clean-up-resources.md)]

To remove the Azure Data Explorer instance from your subscription and avoid being billed unnecessarily, delete the **IoTCentralExportData-rg** resource group from the [Azure portal](https://portal.azure.com/#blade/HubsExtension/BrowseResourceGroups) or run the following command in the Azure Cloud Shell:

```azurecli
az group delete --name IoTCentralExportData-rg
```

## Next step

In this quickstart, you learned how to continuously export data from IoT Central to another Azure service.

Now that you know now to export your data, the suggested next step is to:

> [!div class="nextstepaction"]
> [Create and connect a device](tutorial-connect-device.md).

---
author: baanders
description: include file for testing an Azure Digital Twins data history setup
ms.service: digital-twins
ms.topic: include
ms.date: 1/13/2022
ms.author: baanders
---

## Create a twin graph and send telemetry to it

Now that your data history connection is set up, you can test it with data from your digital twins.

If you already have twins in your Azure Digital Twins instance that are receiving telemetry updates, you can skip this section and visualize the results using your own resources. 

Otherwise, continue through this section to set up a sample graph containing twins that can receive telemetry updates. 

You can set up a sample graph for this scenario using either the **Azure Digital Twins Data Simulator** or the **Azure CLI**. The Azure Digital Twins Data Simulator continuously pushes telemetry to several twins in an Azure Digital Twins instance, while the CLI can be used to create and update a single twin in an ad-hoc manner.

# [Azure Digital Twins Data Simulator](#tab/data-simulator)

You can use the Azure Digital Twins Data Simulator to provision a sample twin graph and push telemetry data to it. The twin graph created here models pasteurization processes for a dairy company.

Start by opening the [Azure Digital Twins Data Simulator](https://explorer.digitaltwins.azure.net/flights/data-pusher?web=1&wdLOR=c120562AB-645B-43EC-8FD0-E9A5A99DC417) web application in your browser.

:::image type="content"  source="../articles/digital-twins/media/how-to-use-data-history/data-simulator.png" alt-text="Screenshot of the Azure Digital Twins Data simulator. The screen shows configuration fields for Instance URL, Frequency of live stream data, and Simulation status, and a button to Generate environment.":::

Enter the **host name** of your Azure Digital Twins instance in the Instance URL field. The host name can be found in the [portal](https://portal.azure.com) page for your instance, and has a format like `<Azure-Digital-Twins-instance-name>.api.<region-code>.digitaltwins.azure.net`. Select **Generate Environment**. 

The elements under Simulation status will display checks once they've been created, and when the simulation is ready, the **Start simulation** button will become enabled. Select **Start simulation** to push simulated data to your Azure Digital Twins instance. To continuously update the twins in your Azure Digital Twins instance, keep this browser window in the foreground on your desktop (and complete other browser actions in a separate window). 

# [CLI](#tab/cli) 

You can use the Azure CLI to set up a sample twin graph and update the twins with simulated telemetry data. The twin graph created here models water flow through a series of pumps.

Start by creating a DTDL model of a pump. Create a text file called *pump.json* on your machine. Copy the text below and save it to the file.

```JSON
{
  "@id": "dtmi:example:Pump;1",
  "@type": "Interface",
  "displayName": "Pump",
  "contents": [
    {
      "@type": ["Property", "VolumeFlowRate"],
      "name": "Flow_Rate",
      "schema": "double",
      "unit": "litrePerSecond"
    },
    {
      "@type": ["Property", "AngularVelocity"],
      "name": "RPM",
      "schema": "double",
      "unit": "revolutionPerMinute"
    }
  ],
  "@context": "dtmi:dtdl:context;2"
}
```

Next, upload the model to Azure Digital Twins. Run the Azure CLI command below from the same folder where you saved the model.

>[!NOTE]
>If you're using the Cloud Shell, you can upload the file to your Cloud Shell before running the command, using the "Upload/Download files" icon.
>
>:::image type="content"  source="../articles/digital-twins/media/how-to-set-up-instance/cloud-shell/cloud-shell-upload.png" alt-text="Screenshot of Azure Cloud Shell. The Upload icon is highlighted.":::
>
>This will upload the file to the root of your Cloud Shell storage.

```azurecli-interactive
az dt model create --dt-name <Azure-Digital-Twins-instance> --models pump.json
```

Next, create a digital twin (**pump_01**) based on the pump model. 

>[!NOTE]
> If you're using Cloud Shell, either use the **Bash** environment for the following commands, or edit the commands for the PowerShell environment by using the `\` character to escape all double-quote (`"`) characters.

```azurecli-interactive
az dt twin create --dt-name <Azure-Digital-Twins-instance> --dtmi "dtmi:example:Pump;1" --twin-id pump_01 --properties '{"Flow_Rate":100, "RPM":1000}'
```

Now, apply several updates to the twin, in order to trigger data history to historize the changes to Azure Data Explorer.

```azurecli-interactive
az dt twin update -n <Azure-Digital-Twins-instance> --twin-id pump_01 --json-patch '[{"op":"replace", "path":"/Flow_Rate", "value": 110}, {"op":"replace", "path":"/RPM", "value": 1100}]'

az dt twin update -n <Azure-Digital-Twins-instance> --twin-id pump_01 --json-patch '[{"op":"replace", "path":"/Flow_Rate", "value": 120}, {"op":"replace", "path":"/RPM", "value": 1200}]'

az dt twin update -n <Azure-Digital-Twins-instance> --twin-id pump_01 --json-patch '[{"op":"replace", "path":"/Flow_Rate", "value": 130}, {"op":"replace", "path":"/RPM", "value": 1300}]'

az dt twin update -n <Azure-Digital-Twins-instance> --twin-id pump_01 --json-patch '[{"op":"replace", "path":"/Flow_Rate", "value": 140}, {"op":"replace", "path":"/RPM", "value": 1400}]'
```

---

To verify that data is flowing through the data history pipeline, navigate to the [Azure portal](https://portal.azure.com) and open the Event Hubs namespace resource you created. You should see charts showing the flow of messages into and out of the namespace, indicating the flow of incoming messages from Azure Digital Twins and outgoing messages to Azure Data Explorer.

:::image type="content"  source="../articles/digital-twins/media/how-to-use-data-history/simulated-environment-portal.png" alt-text="Screenshot of the Azure portal showing an Event Hubs namespace for the simulated environment." lightbox="../articles/digital-twins/media/how-to-use-data-history/simulated-environment-portal.png":::

## View the historized twin updates in Azure Data Explorer

In this section, you'll view the historized twin updates being stored in Azure Data Explorer.

Start in the [Azure portal](https://portal.azure.com) and navigate to the Azure Data Explorer cluster you created earlier. Choose the **Databases** pane from the left menu to open the database view. Find the database you created for this article and select the checkbox next to it, then select **Query**.

:::image type="content"  source="../articles/digital-twins/media/how-to-use-data-history/azure-data-explorer-database.png" alt-text="Screenshot of the Azure portal showing a database in an Azure Data Explorer cluster.":::

Next, expand the cluster and database in the left pane to see the name of the table. You'll use this name to run queries on the table.

:::image type="content"  source="../articles/digital-twins/media/how-to-use-data-history/data-history-table.png" alt-text="Screenshot of the Azure portal showing the query view for the database. The name of the data history table is highlighted." lightbox="../articles/digital-twins/media/how-to-use-data-history/data-history-table.png":::

Copy the command below. The command will change the ingestion to [batched mode](../articles/digital-twins/concepts-data-history.md#batch-ingestion-default) and ingest every 10 seconds.

```kusto
.alter table <table-name> policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:10", "MaximumNumberOfItems": 500, "MaximumRawDataSizeMB": 1024}'
```

Paste the command into the query window, replacing the `<table-name>` placeholder with the name of your table. Select the **Run** button.

:::image type="content"  source="../articles/digital-twins/media/how-to-use-data-history/data-history-run-query-1.png" alt-text="Screenshot of the Azure portal showing the query view for the database. The Run button is highlighted." lightbox="../articles/digital-twins/media/how-to-use-data-history/data-history-run-query-1.png":::

Next, add the following command to the query window, and run it again to verify that Azure Data Explorer has ingested twin updates into the table.

>[!NOTE]
> It may take up to 5 minutes for the first batch of ingested data to appear.

```kusto
<table_name>
| count
```

You should see in the results that the count of items in the table is something greater than 0.

You can also add and run the following command to view 100 records in the table:

```kusto
<table_name>
| limit 100
```

Next, run a query based on the data of your twins to see the contextualized time series data. 

If you used the Azure Digital Twins Data Simulator earlier to set up the [sample dairy scenario](#create-a-twin-graph-and-send-telemetry-to-it), you can use the query below to chart the **outflow** of all salt machine twins in the Oslo dairy. This Kusto query uses the Azure Digital Twins plugin to select the twins of interest, joins those twins against the data history time series in Azure Data Explorer, and then charts the results. Make sure to replace the `<ADT-instance>` placeholder with the URL of your instance, in the format `https://<instance-host-name>`.

```kusto
let ADTendpoint = "<ADT-instance>";
let ADTquery = ```SELECT SALT_MACHINE.$dtId as tid
FROM DIGITALTWINS FACTORY 
JOIN SALT_MACHINE RELATED FACTORY.contains 
WHERE FACTORY.$dtId = 'OsloFactory'
AND IS_OF_MODEL(SALT_MACHINE , 'dtmi:assetGen:SaltMachine;1')```;
evaluate azure_digital_twins_query_request(ADTendpoint, ADTquery)
| extend Id = tostring(tid)
| join kind=inner (<table_name>) on Id
| extend val_double = todouble(Value)
| where Key == "OutFlow"
| render timechart with (ycolumns = val_double)
```

The results should show the outflow numbers changing over time.

:::image type="content"  source="../articles/digital-twins/media/how-to-use-data-history/data-history-run-query-2.png" alt-text="Screenshot of the Azure portal showing the query view for the database. The result for the example query is a line graph showing changing values over time for the salt machine outflows." lightbox="../articles/digital-twins/media/how-to-use-data-history/data-history-run-query-2.png":::

For more information on using the Azure Digital Twins query plugin for Azure Data Explorer, see the [documentation](../articles/digital-twins/concepts-data-explorer-plugin.md), [blog](https://techcommunity.microsoft.com/t5/internet-of-things/adding-context-to-iot-data-just-became-easier/ba-p/2459987), and [sample Kusto queries on GitHub](https://github.com/Azure-Samples/azure-digital-twins-getting-started/tree/main/adt-adx-queries).
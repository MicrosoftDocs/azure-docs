---
title: 'Ingest data from IoT Hub into Azure Data Explorer'
description: 'In this article, you learn how to ingest (load) data into Azure Data Explorer from IoT Hub.'
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: conceptual
ms.date: 01/08/2020

# Customer intent: As a database administrator, I want to ingest data into Azure Data Explorer from an IoT Hub, so I can analyze streaming data.
---

# Ingest data from IoT Hub into Azure Data Explorer 

> [!div class="op_single_selector"]
> * [Portal](ingest-data-iot-hub.md)
> * [C#](data-connection-iot-hub-csharp.md)
> * [Python](data-connection-iot-hub-python.md)
> * [Azure Resource Manager template](data-connection-iot-hub-resource-manager.md)

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data Explorer offers ingestion (data loading) from IoT Hub, a big data streaming platform and IoT ingestion service.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Create [a test cluster and database](create-cluster-database-portal.md) with database name *testdb*.
* [A sample app](https://github.com/Azure-Samples/azure-iot-samples-csharp) and documentation for simulating a device.
* [Visual Studio 2019](https://visualstudio.microsoft.com/vs/) to run the sample app.

## Create an Iot Hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]

## Register a device to the IoT Hub

[!INCLUDE [iot-hub-get-started-create-device-identity](../../includes/iot-hub-get-started-create-device-identity.md)]

## Create a target table in Azure Data Explorer

Now you create a table in Azure Data Explorer to which IoT Hubs will send data. You create the table in the cluster and database provisioned in [**Prerequisites**](#prerequisites).

1. In the Azure portal, navigate to your cluster and select **Query**.

    ![ADX query in portal](media/ingest-data-iot-hub/adx-initiate-query.png)

1. Copy the following command into the window and select **Run** to create the table (TestTable) which will receive the ingested data.

    ```Kusto
    .create table TestTable (temperature: real, humidity: real)
    ```
	
    ![Run create query](media/ingest-data-iot-hub/run-create-query.png)

1. Copy the following command into the window and select **Run** to map the incoming JSON data to the column names and data types of the table (TestTable).

    ```Kusto
    .create table TestTable ingestion json mapping 'TestMapping' '[{"column":"humidity","path":"$.humidity","datatype":"real"},{"column":"temperature","path":"$.temperature","datatype":"real"}]'
    ```

## Connect Azure Data Explorer table to IoT hub

Now you connect to the IoT Hub from Azure Data Explorer. When this connection is complete, data that flows into the iot hub streams to the [target table you created](#create-a-target-table-in-azure-data-explorer).

1. Select **Notifications** on the toolbar to verify that the IoT Hub deployment was successful.

1. Under the cluster you created, select **Databases** then select the database that you created **testdb**.
	
    ![Select test database](media/ingest-data-iot-hub/select-database.png)

1. Select **Data ingestion** and **Add data connection**. Then fill out the form with the following information. Select **Create** when you're finished.

    ![IoT Hub connection](media/ingest-data-iot-hub/iot-hub-connection.png)

    **Data Source**:

    **Setting** | **Field description**
    |---|---|
    | Data connection name | The name of the connection you want to create in Azure Data Explorer
    | IoT Hub | IoT Hub name |
    | Shared access policy | The name of the shared access policy. Must have read permissions |
    | Consumer group |  The consumer group defined in the IoT Hub built-in endpoint |
	| Event system properties | The [IoT Hub event system properties](/azure/iot-hub/iot-hub-devguide-messages-construct#system-properties-of-d2c-iot-hub-messages). When adding system properties, [create](/azure/kusto/management/create-table-command) or [update](/azure/kusto/management/alter-table-command) table schema and [mapping](/azure/kusto/management/mappings) to include the selected properties. | | | 

    > [!NOTE]
    > In case of a [manual failover](/azure/iot-hub/iot-hub-ha-dr#manual-failover), you must recreate the data connection.

    **Target table**:

    There are two options for routing the ingested data: *static* and *dynamic*. 
    For this article, you use static routing, where you specify the table name, data format, and mapping. Therefore, leave **My data includes routing info** unselected.

     **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Table | *TestTable* | The table you created in **testdb**. |
    | Data format | *JSON* | Supported formats are Avro, CSV, JSON, MULTILINE JSON, PSV, SOHSV, SCSV, TSV, TSVE, and TXT. |
    | Column mapping | *TestMapping* | The [mapping](/azure/kusto/management/mappings) you created in **testdb**, which maps incoming JSON data to the column names and data types of **testdb**. Required for JSON, MULTILINE JSON, and AVRO, and optional for other formats.|
    | | |

    > [!NOTE]
    > * Select **My data includes routing info** to use dynamic routing, where your data includes the necessary routing information as seen in the [sample app](https://github.com/Azure-Samples/event-hubs-dotnet-ingest) comments. If both static and dynamic properties are set, the dynamic properties override the static ones. 
    > * Only events enqueued after you create the data connection are ingested.

[!INCLUDE [data-explorer-container-system-properties](../../includes/data-explorer-container-system-properties.md)]

## Generate sample data for testing

The simulated device application connects to a device-specific endpoint on your IoT hub and sends simulated temperature and humidity telemetry.

1. Download the sample C# project from https://github.com/Azure-Samples/azure-iot-samples-csharp/archive/master.zip and extract the ZIP archive.

1. In a local terminal window, navigate to the root folder of the sample C# project. Then navigate to the **iot-hub\Quickstarts\simulated-device** folder.

1. Open the **SimulatedDevice.cs** file in a text editor of your choice.

    Replace the value of the `s_connectionString` variable with the device connection string from [Register a device to the IoT Hub](#register-a-device-to-the-iot-hub). Then save your changes to **SimulatedDevice.cs** file.

1. In the local terminal window, run the following commands to install the required packages for simulated device application:

    ```cmd/sh
    dotnet restore
    ```

1. In the local terminal window, run the following command to build and run the simulated device application:

    ```cmd/sh
    dotnet run
    ```

    The following screenshot shows the output as the simulated device application sends telemetry to your IoT hub:

    ![Run the simulated device](media/ingest-data-iot-hub/simulated-device.png)

## Review the data flow

With the app generating data, you can now see the data flow from the IoT hub to the table in your cluster.

1. In the Azure portal, under your IoT hub, you see the spike in activity while the app is running.

    ![IoT Hub metrics](media/ingest-data-iot-hub/iot-hub-metrics.png)

1. To check how many messages have made it to the database so far, run the following query in your test database.

    ```Kusto
    TestTable
    | count
    ```

1. To see the content of the messages, run the following query:

    ```Kusto
    TestTable
    ```

    The result set:
	
    ![Show ingested data results](media/ingest-data-iot-hub/show-ingested-data.png)

    > [!NOTE]
    > * Azure Data Explorer has an aggregation (batching) policy for data ingestion, designed to optimize the ingestion process. The policy is configured to 5 minutes or 500 MB of data, by default, so you may experience a latency. See [batching policy](/azure/kusto/concepts/batchingpolicy) for aggregation options. 
    > * Configure your table to support streaming and remove the lag in response time. See [streaming policy](/azure/kusto/concepts/streamingingestionpolicy). 

## Clean up resources

If you don't plan to use your IoT Hub again, clean up **test-hub-rg**, to avoid incurring costs.

1. In the Azure portal, select **Resource groups** on the far left, and then select the resource group you created.  

    If the left menu is collapsed, select ![Expand button](media/ingest-data-event-hub/expand.png) to expand it.

   ![Select resource group to delete](media/ingest-data-event-hub/delete-resources-select.png)

1. Under **test-resource-group**, select **Delete resource group**.

1. In the new window, type the name of the resource group to delete (*test-hub-rg*), and then select **Delete**.

## Next steps

* [Query data in Azure Data Explorer](web-query-data.md)

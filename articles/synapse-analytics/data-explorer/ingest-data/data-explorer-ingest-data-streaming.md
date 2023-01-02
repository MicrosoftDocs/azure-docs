---
title: Configure streaming ingestion on your Azure Synapse Data Explorer pool
description: Learn how to configure your Azure Synapse Data Explorer pool and start loading data with streaming ingestion.
ms.topic: quickstart
ms.date: 11/02/2021
author: shsagir
ms.author: shsagir
ms.reviewer: tzgitlin
ms.service: synapse-analytics
ms.subservice: data-explorer
ms.devlang: csharp, golang, java, javascript, python
ms.custom: mode-other
---

# Configure streaming ingestion on your Azure Synapse Data Explorer pool (Preview)

Streaming ingestion is useful for loading data when you need low latency between ingestion and query. Consider using streaming ingestion in the following scenarios:

- Latency of less than a second is required.
- To optimize operational processing of many tables where the stream of data into each table is relatively small (a few records per second), but the overall data ingestion volume is high (thousands of records per second).

If the stream of data into each table is high (over 4 GB per hour), consider using [batch ingestion](/azure/data-explorer/kusto/management/batchingpolicy?context=/azure/synapse-analytics/context/context).

To learn more about different ingestion methods, see [data ingestion overview](data-explorer-ingest-data-overview.md).

## Choose the appropriate streaming ingestion type

Two streaming ingestion types are supported:

| Ingestion type | Description |
| -- | -- |
| **Event Hub** or **IoT Hub** | Hubs are configured as table streaming data sources.<br />For information about setting these up, see [**Event Hub**](data-explorer-ingest-event-hub-overview.md). <!--  or [**IoT Hub**](ingest-data-iot-hub.md) data ingestion methods --> |
| **Custom ingestion** | Custom ingestion requires you to write an application that uses one of the Azure Synapse Data Explorer [client libraries](/azure/data-explorer/kusto/api/client-libraries?context=/azure/synapse-analytics/context/context).<br />Use the information in this topic to configure custom ingestion. You may also find the [C# streaming ingestion sample application](https://github.com/Azure/azure-kusto-samples-dotnet/tree/master/client/StreamingIngestionSample) helpful. |

Use the following table to help you choose the ingestion type that's appropriate for your environment:

|Criterion|Event Hub / IoT Hub|Custom Ingestion|
|---------|---------|---------|
|Data delay between ingestion initiation and the data available for query | Longer delay | Shorter delay |
|Development overhead | Fast and easy setup, no development overhead | High development overhead to create an application ingest the data, handle errors, and ensure data consistency |

> [!NOTE]
> Ingesting data from an Event Hub into Data Explorer pools will not work if your Synapse workspace uses a managed virtual network with data exfiltration protection enabled.

## Prerequisites

[!INCLUDE [data-explorer-ingest-prerequisites](../includes/data-explorer-ingest-prerequisites.md)]

- Get the Query and Data Ingestion endpoints.
    [!INCLUDE [data-explorer-get-endpoint](../includes/data-explorer-get-endpoint.md)]

## Performance and operational considerations

The main contributors that can impact streaming ingestion are:

- **Compute Specification**: Streaming ingestion performance and capacity scales with increased Data Explorer pool sizes. The number of concurrent ingestion requests is limited to six per core. For example, for 16 core workload type, such as Compute Optimized (Large) and Storage Optimized (Large), the maximal supported load is 96 concurrent ingestion requests. For two core workload type, such as Compute Optimized (Extra Small), the maximal supported load is 12 concurrent ingestion requests.
- **Data size limit**: The data size limit for a streaming ingestion request is 4 MB.
- **Schema updates**: Schema updates, such as creation and modification of tables and ingestion mappings, may take up to five minutes for the streaming ingestion service. For more information see [Streaming ingestion and schema changes](/azure/data-explorer/kusto/management/data-ingestion/streaming-ingestion-schema-changes?context=/azure/synapse-analytics/context/context).
- **SSD capacity**: Enabling streaming ingestion on a Data Explorer pool, even when data isn't ingested via streaming, uses part of the local SSD disk of the Data Explorer pool machines for streaming ingestion data and reduces the storage available for hot cache.

## Enable streaming ingestion on your Data Explorer pool

Before you can use streaming ingestion, you must enable the capability on your Data Explorer pool and define a [streaming ingestion policy](/azure/data-explorer/kusto/management/streamingingestionpolicy?context=/azure/synapse-analytics/context/context). You can enable the capability when [creating the Data Explorer pool](#enable-streaming-ingestion-while-creating-a-new-data-explorer-pool), or [add it to an existing Data Explorer pool](#enable-streaming-ingestion-on-an-existing-data-explorer-pool).

> [!WARNING]
> Review the [limitations](#limitations) prior to enabling streaming ingestion.

### Enable streaming ingestion while creating a new Data Explorer pool

You can enable streaming ingestion while creating a new Data Explorer pool using Azure Synapse Studio or the Azure portal.

#### [Studio](#tab/azure-studio)

While creating a Data Explorer pool using the steps in [Create a Data Explorer pool using Synapse Studio](../data-explorer-create-pool-studio.md#create-a-new-data-explorer-pool), in the **Additional settings** tab, select **Streaming ingestion** > **Enabled**.

:::image type="content" source="../media/ingest-data-streaming/create-data-explorer-pool-advanced-settings-studio.png" alt-text="Enable streaming ingestion while creating a Data Explorer pool in Azure Synapse Data Explorer.":::

#### [Portal](#tab/azure-portal)

While creating a Data Explorer pool using the steps in [Create a Data Explorer pool using the Azure portal](../data-explorer-create-pool-portal.md#create-a-new-data-explorer-pool), in the **Additional settings** tab, select **Streaming ingestion** > **Enabled**.

:::image type="content" source="../media/ingest-data-streaming/create-data-explorer-pool-advanced-settings-portal.png" alt-text="Enable streaming ingestion while creating a Data Explorer pool in Azure Synapse Data Explorer.":::

---

### Enable streaming ingestion on an existing Data Explorer pool

If you have an existing Data Explorer pool, you can enable streaming ingestion using the Azure portal.

1. In the Azure portal, go to your Data Explorer pool.
1. In **Settings**, select **Configurations**.
1. In the **Configurations** pane, select **On** to enable **Streaming ingestion**.
1. Select **Save**.

### Create a target table and define the policy

Create a table to receive the streaming ingestion data and define its related policy using Azure Synapse Studio or the Azure portal.

#### [Studio](#tab/azure-studio)

1. In Synapse Studio, on the left-side pane, select **Develop**.
1. Under **KQL scripts**, Select **&plus;** (Add new resource) > **KQL script**. On the right-side pane, you can name your script.
1. In the **Connect to** menu, select *contosodataexplorer*.
1. In the **Use database** menu, select *TestDatabase*.
1. Paste in the following command, and select **Run** to create the table.

    ```kusto
    .create table TestTable (TimeStamp: datetime, Name: string, Metric: int, Source:string)
    ```

1. Copy one of the following commands into the **Query pane** and select **Run**. This defines the [streaming ingestion policy](/azure/data-explorer/kusto/management/streamingingestionpolicy?context=/azure/synapse-analytics/context/context) on the table you created or on the database that contains the table.

    > [!TIP]
    > A policy that is defined at the database level applies to all existing and future tables in the database.

    - To define the policy on the table you created, use:

        ```kusto
        .alter table TestTable policy streamingingestion enable
        ```

    - To define the policy on the database containing the table you created, use:

        ```kusto
        .alter database StreamingTestDb policy streamingingestion enable
        ```

#### [Portal](#tab/azure-portal)

1. In the Azure Synapse Analytics portal, navigate to your Data Explorer pool.
1. Select **Query**.
1. To create the table that will receive the data via streaming ingestion, copy the following command into the **Query pane** and select **Run**.

    ```kusto
    .create table TestTable (TimeStamp: datetime, Name: string, Metric: int, Source:string)
    ```

1. Copy one of the following commands into the **Query pane** and select **Run**. This defines the [streaming ingestion policy](/azure/data-explorer/kusto/management/streamingingestionpolicy?context=/azure/synapse-analytics/context/context) on the table you created or on the database that contains the table.

    > [!TIP]
    > A policy that is defined at the database level applies to all existing and future tables in the database.

    - To define the policy on the table you created, use:

        ```kusto
        .alter table TestTable policy streamingingestion enable
        ```

    - To define the policy on the database containing the table you created, use:

        ```kusto
        .alter database StreamingTestDb policy streamingingestion enable
        ```

---

## Create a streaming ingestion application to ingest data to your Data Explorer pool

Create your application for ingesting data to your Data Explorer pool using your preferred language. For the *poolPath* variable, use the Query endpoint you made a note of in the [Prerequisites](#prerequisites).

### [C#](#tab/csharp)

```csharp
using Kusto.Data;
using Kusto.Ingest;
using System.IO;
using Kusto.Data.Common;

namespace StreamingIngestion
{
    class Program
    {
        static void Main(string[] args)
        {
            string poolPath = "https://<Poolname>.<WorkspaceName>.kusto.windows.net";
            string appId = "<appId>";
            string appKey = "<appKey>";
            string appTenant = "<appTenant>";
            string dbName = "<dbName>";
            string tableName = "<tableName>";

            // Create Kusto connection string with App Authentication
            var csb =
                new KustoConnectionStringBuilder(poolPath)
                    .WithAadApplicationKeyAuthentication(
                        applicationClientId: appId,
                        applicationKey: appKey,
                        authority: appTenant
                    );

            // Create a disposable client that will execute the ingestion
            using (IKustoIngestClient client = KustoIngestFactory.CreateStreamingIngestClient(csb))
            {
                // Initialize client properties
                var ingestionProperties =
                    new KustoIngestionProperties(
                        databaseName: dbName,
                        tableName: tableName
                    );

                // Ingest from a compressed file
                var fileStream = File.Open("MyFile.gz", FileMode.Open);
                // Create source options
                var sourceOptions = new StreamSourceOptions()
                {
                    CompressionType = DataSourceCompressionType.GZip,
                };
                // Ingest from stream
                var status = client.IngestFromStreamAsync(fileStream, ingestionProperties, sourceOptions).GetAwaiter().GetResult();
            }
        }
    }
}
```

### [Python](#tab/python)

```python
from Azure Synapse Analytics.kusto.data import KustoConnectionStringBuilder

from Azure Synapse Analytics.kusto.ingest import (
    IngestionProperties,
    DataFormat,
    KustoStreamingIngestClient
)

poolPath = "https://<Poolname>.<WorkspaceName>.kusto.windows.net"
appId = "<appId>"
appKey = "<appKey>"
appTenant = "<appTenant>"
dbName = "<dbName>"
tableName = "<tableName>"

csb = KustoConnectionStringBuilder.with_aad_application_key_authentication(
    poolPath,
    appId,
    appKey,
    appTenant
)
client = KustoStreamingIngestClient(csb)

ingestionProperties = IngestionProperties(
    database=dbName,
    table=tableName,
    data_format=DataFormat.CSV
)

# Ingest from file
# Automatically detects gz format
client.ingest_from_file("MyFile.gz", ingestion_properties=ingestionProperties) 
```

### [Node.js](#tab/nodejs)

```nodejs
// Load modules using ES6 import statements:
import { DataFormat, IngestionProperties, StreamingIngestClient } from "azure-kusto-ingest";
import { KustoConnectionStringBuilder } from "azure-kusto-data";

// For earlier version, load modules using require statements:
// const IngestionProperties = require("azure-kusto-ingest").IngestionProperties;
// const KustoConnectionStringBuilder = require("azure-kusto-data").KustoConnectionStringBuilder;
// const {DataFormat} = require("azure-kusto-ingest").IngestionPropertiesEnums;
// const StreamingIngestClient = require("azure-kusto-ingest").StreamingIngestClient;

const poolPath = "https://<Poolname>.<WorkspaceName>.kusto.windows.net";
const appId = "<appId>";
const appKey = "<appKey>";
const appTenant = "<appTenant>";
const dbName = "<dbName>";
const tableName = "<tableName>";
const mappingName = "<mappingName>"; // Required for JSON formatted files

const ingestionProperties = new IngestionProperties({
    database: dbName, // Your database
    table: tableName, // Your table
    format: DataFormat.JSON,
    ingestionMappingReference: mappingName
});

// Initialize client with engine endpoint
const client = new StreamingIngestClient(
    KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(
        poolPath,
        appId,
        appKey,
        appTenant
    ),
    ingestionProperties
);

// Automatically detects gz format
await client.ingestFromFile("MyFile.gz", ingestionProperties);
```

### [Go](#tab/go)

```go
import (
    "context"
    "github.com/Azure Synapse Analytics/azure-kusto-go/kusto"
    "github.com/Azure Synapse Analytics/azure-kusto-go/kusto/ingest"
    "github.com/Azure Synapse Analytics/go-autorest/autorest/Azure Synapse Analytics/auth"
)

func ingest() {
    poolPath := "https://<Poolname>.<WorkspaceName>.kusto.windows.net"
    appId := "<appId>"
    appKey := "<appKey>"
    appTenant := "<appTenant>"
    dbName := "<dbName>"
    tableName := "<tableName>"
    mappingName := "<mappingName>" // Optional, can be nil

    // Creates a Kusto Authorizer using your client identity, secret, and tenant identity.
    // You may also uses other forms of authorization, see GoDoc > Authorization type.
    // auth package is: "github.com/Azure Synapse Analytics/go-autorest/autorest/Azure Synapse Analytics/auth"
    authorizer := kusto.Authorization{
        Config: auth.NewClientCredentialsConfig(appId, appKey, appTenant),
    }

    // Create a client
    client, err := kusto.New(poolPath, authorizer)
    if err != nil {
        panic("add error handling")
    }

    // Create an ingestion instance
    // Pass the client, the name of the database, and the name of table you wish to ingest into.
    in, err := ingest.New(client, dbName, tableName)
    if err != nil {
        panic("add error handling")
    }

    // Go currently only supports streaming from a byte array with a maximum size of 4 MB.
    jsonEncodedData := []byte("{\"a\":  1, \"b\":  10}\n{\"a\":  2, \"b\":  20}")

    // Ingestion from a stream commits blocks of fully formed data encodes (JSON, AVRO, ...) into Kusto:
    if err := in.Stream(context.Background(), jsonEncodedData, ingest.JSON, mappingName); err != nil {
        panic("add error handling")
    }
}
```

### [Java](#tab/java)

```java
import com.microsoft.Azure Synapse Analytics.kusto.data.auth.ConnectionStringBuilder;
import com.microsoft.Azure Synapse Analytics.kusto.ingest.IngestClient;
import com.microsoft.Azure Synapse Analytics.kusto.ingest.IngestClientFactory;
import com.microsoft.Azure Synapse Analytics.kusto.ingest.IngestionProperties;
import com.microsoft.Azure Synapse Analytics.kusto.ingest.result.OperationStatus;
import com.microsoft.Azure Synapse Analytics.kusto.ingest.source.CompressionType;
import com.microsoft.Azure Synapse Analytics.kusto.ingest.source.StreamSourceInfo;
import java.io.FileInputStream;
import java.io.InputStream;

public class FileIngestion {
    public static void main(String[] args) throws Exception {
        String poolPath = "https://<Poolname>.<WorkspaceName>.kusto.windows.net";
        String appId = "<appId>";
        String appKey = "<appKey>";
        String appTenant = "<appTenant>";
        String dbName = "<dbName>";
        String tableName = "<tableName>";

        // Build connection string and initialize
        ConnectionStringBuilder csb =
            ConnectionStringBuilder.createWithAadApplicationCredentials(
                poolPath,
                appId,
                appKey,
                appTenant
            );

        // Initialize client and its properties
        IngestClient client = IngestClientFactory.createClient(csb);
        IngestionProperties ingestionProperties =
            new IngestionProperties(
                dbName,
                tableName
            );

        // Ingest from a compressed file
        // Create Source info
        InputStream zipInputStream = new FileInputStream("MyFile.gz");
        StreamSourceInfo zipStreamSourceInfo = new StreamSourceInfo(zipInputStream);
        // If the data is compressed
        zipStreamSourceInfo.setCompressionType(CompressionType.gz);
        // Ingest from stream
        OperationStatus status = client.ingestFromStream(zipStreamSourceInfo, ingestionProperties).getIngestionStatusCollection().get(0).status;
    }
}
```

---

## Disable streaming ingestion on your Data Explorer pool

> [!WARNING]
> Disabling streaming ingestion may take a few hours.

Before disabling streaming ingestion on your Data Explorer pool, drop the [streaming ingestion policy](/azure/data-explorer/kusto/management/streamingingestionpolicy?context=/azure/synapse-analytics/context/context) from all relevant tables and databases. The removal of the streaming ingestion policy triggers data rearrangement inside your Data Explorer pool. The streaming ingestion data is moved from the initial storage to permanent storage in the column store (extents or shards). This process can take between a few seconds to a few hours, depending on the amount of data in the initial storage.

### Drop the streaming ingestion policy

You can drop the streaming ingestion policy using Azure Synapse Studio or the Azure portal.

#### [Studio](#tab/azure-studio)

1. In Synapse Studio, on the left-side pane, select **Develop**.
1. Under **KQL scripts**, Select **&plus;** (Add new resource) > **KQL script**. On the right-side pane, you can name your script.
1. In the **Connect to** menu, select *contosodataexplorer*.
1. In the **Use database** menu, select *TestDatabase*.
1. Paste in the following command, and select **Run** to create the table.

    ```kusto
    .delete table TestTable policy streamingingestion
    ```

1. In the Azure portal, go to your Data Explorer pool.
1. In **Settings**, select **Configurations**.
1. In the **Configurations** pane, select **On** to enable **Streaming ingestion**.
1. Select **Save**.

#### [Portal](#tab/azure-portal)

1. In the Azure portal, go to your Data Explorer pool and select **Query**.
1. To drop the streaming ingestion policy from the table, copy the following command into **Query pane** and select **Run**.

    ```Kusto
    .delete table TestTable policy streamingingestion
    ```

1. In **Settings**, select **Configurations**.
1. In the **Configurations** pane, select **Off** to disable **Streaming ingestion**.
1. Select **Save**.

---

## Limitations

- [Database cursors](/azure/data-explorer/kusto/management/databasecursor?context=/azure/synapse-analytics/context/context) aren't supported for a database if the database itself or any of its tables have the [Streaming ingestion policy](/azure/data-explorer/kusto/management/streamingingestionpolicy?context=/azure/synapse-analytics/context/context) defined and enabled.
- [Data mappings](/azure/data-explorer/kusto/management/mappings?context=/azure/synapse-analytics/context/context) must be [pre-created](/azure/data-explorer/kusto/management/create-ingestion-mapping-command?context=/azure/synapse-analytics/context/context) for use in streaming ingestion. Individual streaming ingestion requests don't accommodate inline data mappings.
- [Extent tags](/azure/data-explorer/kusto/management/extents-overview?context=/azure/synapse-analytics/context/context#extent-tagging) can't be set on the streaming ingestion data.
- [Update policy](/azure/data-explorer/kusto/management/updatepolicy?context=/azure/synapse-analytics/context/context). The update policy can reference only the newly-ingested data in the source table and not any other data or tables in the database.
- If streaming ingestion is used on any of the tables of the database, this database cannot be used as leader for follower databases or as a data provider for Azure Synapse Analytics Data Share.

## Next steps

- [Analyze with Data Explorer](../../get-started-analyze-data-explorer.md)
- [Monitor Data Explorer pools](../data-explorer-monitor-pools.md)

---
title: Configure streaming ingestion on your Azure Synapse Analytics Data Explorer pool
description: Learn how to configure your Azure Synapse Analytics Data Explorer pool and start loading data with streaming ingestion.
ms.topic: quickstart
ms.date: 11/02/2021
author: shsagir
ms.author: shsagir
ms.reviewer: tzgitlin
services: synapse-analytics
ms.service: synapse-analytics
ms.subservice: data-explorer
---

# Configure streaming ingestion on your Azure Synapse Analytics Data Explorer pool

Streaming ingestion is useful for loading data when you need low latency between ingestion and query. Consider using streaming ingestion in the following scenarios:

* Latency of less than a second is required.
* To optimize operational processing of many tables where the stream of data into each table is relatively small (a few records per second), but the overall data ingestion volume is high (thousands of records per second).

If the stream of data into each table is high (over 4 GB per hour), consider using [batch ingestion](/azure/data-explorer/kusto/management/batchingpolicy?context=/azure/synapse-analytics/context/context).

To learn more about different ingestion methods, see [data ingestion overview](data-explorer-ingest-data-overview.md).

## Choose the appropriate streaming ingestion type

Two streaming ingestion types are supported:

| Ingestion type | Description |
| -- | -- |
| **Event Hub** or **IoT Hub** | Hubs are configured as table streaming data sources.<br />For information about setting these up, see [**Event Hub**](ingest-data-event-hub.md) or [**IoT Hub**](ingest-data-iot-hub.md) data ingestion methods. |
| **Custom ingestion** | Custom ingestion requires you to write an application that uses one of the Azure Synapse Analytics Data Explorer [client libraries](/azure/data-explorer/kusto/api/client-libraries?context=/azure/synapse-analytics/context/context).<br />Use the information in this topic to configure custom ingestion. You may also find the [C# streaming ingestion sample application](https://github.com/Azure Synapse Analytics/Azure Synapse Analytics-kusto-samples-dotnet/tree/master/client/StreamingIngestionSample) helpful. |

Use the following table to help you choose the ingestion type that's appropriate for your environment:

|Criterion|Event Hub / IoT Hub|Custom Ingestion|
|---------|---------|---------|
|Data delay between ingestion initiation and the data available for query | Longer delay | Shorter delay |
|Development overhead | Fast and easy setup, no development overhead | High development overhead to create an application ingest the data, handle errors, and ensure data consistency |

> [!NOTE]
> You can manage the process to [enable](#enable-streaming-ingestion-on-your-cluster) and [disable](#disable-streaming-ingestion-on-your-cluster) streaming ingestion on your cluster using the Azure Synapse Analytics portal or programmatically in C\#. If you are using C\# for your [custom application](#create-a-streaming-ingestion-application-to-ingest-data-to-your-cluster), you may find it more convenient using the programmatic approach.

## Prerequisites

* An Azure Synapse Analytics subscription. Create a [free Azure Synapse Analytics account](https://Azure Synapse Analytics.microsoft.com/free/).
* Get the Query and Data Ingestion endpoints. You'll need the query endpoint to configure your code.
    [!INCLUDE [data-explorer-get-endpoint](../includes/data-explorer-get-endpoint.md)]

## Performance and operational considerations

The main contributors that can impact streaming ingestion are:

* **VM and cluster size**: Streaming ingestion performance and capacity scales with increased VM and cluster sizes. The number of concurrent ingestion requests is limited to six per core. For example, for 16 core SKUs, such as D14 and L16, the maximal supported load is 96 concurrent ingestion requests. For two core SKUs, such as D11, the maximal supported load is 12 concurrent ingestion requests.
* **Data size limit**: The data size limit for a streaming ingestion request is 4 MB.
* **Schema updates**: Schema updates, such as creation and modification of tables and ingestion mappings, may take up to five minutes for the streaming ingestion service. For more information see [Streaming ingestion and schema changes](kusto/management/data-ingestion/streaming-ingestion-schema-changes.md).
* **SSD capacity**: Enabling streaming ingestion on a cluster, even when data isn't ingested via streaming, uses part of the local SSD disk of the cluster machines for streaming ingestion data and reduces the storage available for hot cache.

## Enable streaming ingestion on your cluster

Before you can use streaming ingestion, you must enable the capability on your cluster and define a [streaming ingestion policy](/azure/data-explorer/kusto/management/streamingingestionpolicy?context=/azure/synapse-analytics/context/context). You can enable the capability when [creating the cluster](#enable-streaming-ingestion-while-creating-a-new-cluster), or [add it to an existing cluster](#enable-streaming-ingestion-on-an-existing-cluster).

> [!WARNING]
> Review the [limitations](#limitations) prior to enabling streaming ingestion.

### Enable streaming ingestion while creating a new cluster

You can enable streaming ingestion while creating a new cluster using the Azure Synapse Analytics portal or programmatically in C\#.

#### [Portal](#tab/Azure Synapse Analytics-portal)

While creating a cluster using the steps in [Create an Data Explorer pool and database](create-cluster-database-portal.md), in the **Configurations** tab, select **Streaming ingestion** > **On**.

:::image type="content" source="media/ingest-data-streaming/cluster-creation-enable-streaming.png" alt-text="Enable streaming ingestion while creating a cluster in Azure Synapse Analytics Data Explorer.":::

#### [C#](#tab/Azure Synapse Analytics-csharp)

To enable streaming ingestion while creating a new Data Explorer pool, run the following code:

```csharp
using System.Threading.Tasks;
using Microsoft.Azure Synapse Analytics.Management.Kusto; // Required package Microsoft.Azure Synapse Analytics.Management.Kusto
using Microsoft.Azure Synapse Analytics.Management.Kusto.Models;
using Microsoft.IdentityModel.Clients.ActiveDirectory; // Required package Microsoft.IdentityModel.Clients.ActiveDirectory
using Microsoft.Rest;
namespace StreamingIngestion
{
    class Program
    {
        static async Task Main(string[] args)
        {
            string appId = "<appId>";
            string appKey = "<appKey>";
            string appTenant = "<appTenant>";
            string clusterName = "<clusterName>";
            string resourceGroupName = "<resourceGroupName>";
            string subscriptionId = "<subscriptionId>";
            string location = "<location>";
            string skuName = "<skuName>";
            string tier = "<tier>";

            var authenticationContext = new AuthenticationContext($"https://login.windows.net/{appTenant}");
            var credential = new ClientCredential(appId, appKey);
            var result = await authenticationContext.AcquireTokenAsync(resource: "https://management.core.windows.net/", clientCredential: credential);

            var credentials = new TokenCredentials(result.AccessToken, result.AccessTokenType);
            var kustoManagementClient = new KustoManagementClient(credentials)
            {
                SubscriptionId = subscriptionId
            };

            var cluster = new Cluster(location, new Azure Synapse AnalyticsSku(skuName, tier), enableStreamingIngest:true);
            await kustoManagementClient.Clusters.CreateOrUpdateAsync(resourceGroupName, clusterName, cluster);
        }
    }
}
```

---

### Enable streaming ingestion on an existing cluster

If you have an existing cluster, you can enable streaming ingestion using the Azure Synapse Analytics portal or programmatically in C\#.

#### [Portal](#tab/Azure Synapse Analytics-portal)

1. In the Azure Synapse Analytics portal, go to your Data Explorer pool.
1. In **Settings**, select **Configurations**.
1. In the **Configurations** pane, select **On** to enable **Streaming ingestion**.
1. Select **Save**.

    :::image type="content" source="media/ingest-data-streaming/streaming-ingestion-on.png" alt-text="Turn on streaming ingestion in Azure Synapse Analytics Data Explorer.":::

#### [C#](#tab/Azure Synapse Analytics-csharp)

You can enable streaming ingestion while creating a new Data Explorer pool.

```csharp
using System.Threading.Tasks;
using Microsoft.Azure Synapse Analytics.Management.Kusto; // Required package Microsoft.Azure Synapse Analytics.Management.Kusto
using Microsoft.Azure Synapse Analytics.Management.Kusto.Models;
using Microsoft.IdentityModel.Clients.ActiveDirectory; // Required package Microsoft.IdentityModel.Clients.ActiveDirectory
using Microsoft.Rest;
namespace StreamingIngestion
{
    class Program
    {
        static async Task Main(string[] args)
        {
            string appId = "<appId>";
            string appKey = "<appKey>";
            string appTenant = "<appTenant>";
            string clusterName = "<clusterName>";
            string resourceGroupName = "<resourceGroupName>";
            string subscriptionId = "<subscriptionId>";

            var authenticationContext = new AuthenticationContext($"https://login.windows.net/{appTenant}");
            var credential = new ClientCredential(appId, appKey);
            var result = await authenticationContext.AcquireTokenAsync(resource: "https://management.core.windows.net/", clientCredential: credential);

            var credentials = new TokenCredentials(result.AccessToken, result.AccessTokenType);
            var kustoManagementClient = new KustoManagementClient(credentials)
            {
                SubscriptionId = subscriptionId
            };

            var clusterUpdateParameters = new ClusterUpdate(enableStreamingIngest: true);
            await kustoManagementClient.Clusters.UpdateAsync(resourceGroupName, clusterName, clusterUpdateParameters);
        }
    }
}
```

---

### Create a target table and define the policy

Create a table to receive the streaming ingestion data and define its related policy using the Azure Synapse Analytics portal or programmatically in C\#.

#### [Portal](#tab/Azure Synapse Analytics-portal)

1. In the Azure Synapse Analytics portal, navigate to your cluster.
1. Select **Query**.

    :::image type="content" source="media/ingest-data-streaming/cluster-select-query-tab.png" alt-text="Select query in the Azure Synapse Analytics Data Explorer portal to enable streaming ingestion.":::

1. To create the table that will receive the data via streaming ingestion, copy the following command into the **Query pane** and select **Run**.

    ```kusto
    .create table TestTable (TimeStamp: datetime, Name: string, Metric: int, Source:string)
    ```

    :::image type="content" source="media/ingest-data-streaming/create-table.png" alt-text="Create a table for streaming ingestion into Azure Synapse Analytics Data Explorer.":::

1. Copy one of the following commands into the **Query pane** and select **Run**. This defines the [streaming ingestion policy](kusto/management/streamingingestionpolicy.md) on the table you created or on the database that contains the table.

    > [!TIP]
    > A policy that is defined at the database level applies to all existing and future tables in the database.

    * To define the policy on the table you created, use:

        ```kusto
        .alter table TestTable policy streamingingestion enable
        ```

    * To define the policy on the database containing the table you created, use:

        ```kusto
        .alter database StreamingTestDb policy streamingingestion enable
        ```

    :::image type="content" source="media/ingest-data-streaming/define-streaming-ingestion-policy.png" alt-text="Define the streaming ingestion policy in Azure Synapse Analytics Data Explorer.":::

#### [C#](#tab/Azure Synapse Analytics-csharp)

```csharp
using System.Threading.Tasks;
using Kusto.Data; // Requires Package Microsoft.Azure Synapse Analytics.Kusto.Data
using Kusto.Data.Common;
using Kusto.Data.Net.Client;
namespace StreamingIngestion
{
    class Program
    {
        static async Task Main(string[] args)
        {
            string clusterPath = "https://<clusterName>.kusto.windows.net";
            string appId = "<appId>";
            string appKey = "<appKey>";
            string appTenant = "<appTenant>";
            string dbName = "<dbName>";
            string tableName = "<tableName>";

            // Create Kusto connection string with App Authentication
            var csb =
                new KustoConnectionStringBuilder(clusterPath)
                    .WithAadApplicationKeyAuthentication(
                        applicationClientId: appId,
                        applicationKey: appKey,
                        authority: appTenant
                    );

            var tableSchema = new TableSchema(
                tableName,
                new ColumnSchema[]
                {
                    new ColumnSchema("TimeStamp", "System.DateTime"),
                    new ColumnSchema("Name", "System.String"),
                    new ColumnSchema("Metric", "System.int"),
                    new ColumnSchema("Source", "System.String"),
                });
            var tableCreateCommand = CslCommandGenerator.GenerateTableCreateCommand(tableSchema);
            var tablePolicyAlterCommand = CslCommandGenerator.GenerateTableAlterStreamingIngestionPolicyCommand(tableName, isEnabled: true);

            using (var client = KustoClientFactory.CreateCslAdminProvider(csb))
            {
                client.ExecuteControlCommand(tableCreateCommand);
                client.ExecuteControlCommand(tablePolicyAlterCommand);
            }
        }
    }
}
```

---

## Create a streaming ingestion application to ingest data to your cluster

Create your application for ingesting data to your cluster using your preferred language.

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
            string clusterPath = "https://<clusterName>.kusto.windows.net";
            string appId = "<appId>";
            string appKey = "<appKey>";
            string appTenant = "<appTenant>";
            string dbName = "<dbName>";
            string tableName = "<tableName>";

            // Create Kusto connection string with App Authentication
            var csb =
                new KustoConnectionStringBuilder(clusterPath)
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

clusterPath = "https://<clusterName>.kusto.windows.net"
appId = "<appId>"
appKey = "<appKey>"
appTenant = "<appTenant>"
dbName = "<dbName>"
tableName = "<tableName>"

csb = KustoConnectionStringBuilder.with_aad_application_key_authentication(
    clusterPath,
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
import { DataFormat, IngestionProperties, StreamingIngestClient } from "Azure Synapse Analytics-kusto-ingest";
import { KustoConnectionStringBuilder } from "Azure Synapse Analytics-kusto-data";

// For earlier version, load modules using require statements:
// const IngestionProperties = require("Azure Synapse Analytics-kusto-ingest").IngestionProperties;
// const KustoConnectionStringBuilder = require("Azure Synapse Analytics-kusto-data").KustoConnectionStringBuilder;
// const {DataFormat} = require("Azure Synapse Analytics-kusto-ingest").IngestionPropertiesEnums;
// const StreamingIngestClient = require("Azure Synapse Analytics-kusto-ingest").StreamingIngestClient;

const clusterPath = "https://<clusterName>.kusto.windows.net";
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
        clusterPath,
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
    "github.com/Azure Synapse Analytics/Azure Synapse Analytics-kusto-go/kusto"
    "github.com/Azure Synapse Analytics/Azure Synapse Analytics-kusto-go/kusto/ingest"
    "github.com/Azure Synapse Analytics/go-autorest/autorest/Azure Synapse Analytics/auth"
)

func ingest() {
    clusterPath := "https://<clusterName>.kusto.windows.net"
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
    client, err := kusto.New(clusterPath, authorizer)
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
        String clusterPath = "https://<clusterName>.kusto.windows.net";
        String appId = "<appId>";
        String appKey = "<appKey>";
        String appTenant = "<appTenant>";
        String dbName = "<dbName>";
        String tableName = "<tableName>";

        // Build connection string and initialize
        ConnectionStringBuilder csb =
            ConnectionStringBuilder.createWithAadApplicationCredentials(
                clusterPath,
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

## Disable streaming ingestion on your cluster

> [!WARNING]
> Disabling streaming ingestion may take a few hours.

Before disabling streaming ingestion on your Data Explorer pool, drop the [streaming ingestion policy](kusto/management/streamingingestionpolicy.md) from all relevant tables and databases. The removal of the streaming ingestion policy triggers data rearrangement inside your Data Explorer pool. The streaming ingestion data is moved from the initial storage to permanent storage in the column store (extents or shards). This process can take between a few seconds to a few hours, depending on the amount of data in the initial storage.

### Drop the streaming ingestion policy

You can drop the streaming ingestion policy using the Azure Synapse Analytics portal or programmatically in C\#.

#### [Portal](#tab/Azure Synapse Analytics-portal)

1. In the Azure Synapse Analytics portal, go to your Data Explorer pool and select **Query**.
1. To drop the streaming ingestion policy from the table, copy the following command into **Query pane** and select **Run**.

    ```Kusto
    .delete table TestTable policy streamingingestion
    ```

    :::image type="content" source="media/ingest-data-streaming/delete-streaming-ingestion-policy.png" alt-text="Delete streaming ingestion policy in Azure Synapse Analytics Data Explorer.":::

1. In **Settings**, select **Configurations**.
1. In the **Configurations** pane, select **Off** to disable **Streaming ingestion**.
1. Select **Save**.

    :::image type="content" source="media/ingest-data-streaming/streaming-ingestion-off.png" alt-text="Turn off streaming ingestion in Azure Synapse Analytics Data Explorer.":::

#### [C#](#tab/Azure Synapse Analytics-csharp)

To drop the streaming ingestion policy from the table, run the following code:

```csharp
using System.Threading.Tasks;
using Kusto.Data; // Requires Package Microsoft.Azure Synapse Analytics.Kusto.Data
using Kusto.Data.Common;
using Kusto.Data.Net.Client;
namespace StreamingIngestion
{
    class Program
    {
        static async Task Main(string[] args)
        {
            string clusterPath = "https://<clusterName>.kusto.windows.net";
            string appId = "<appId>";
            string appKey = "<appKey>";
            string appTenant = "<appTenant>";
            string dbName = "<dbName>";
            string tableName = "<tableName>";
            
            // Create Kusto connection string with App Authentication
            var csb =
                new KustoConnectionStringBuilder(clusterPath)
                    .WithAadApplicationKeyAuthentication(
                        applicationClientId: appId,
                        applicationKey: appKey,
                        authority: appTenant
                    );
            
            var tablePolicyDropCommand = CslCommandGenerator.GenerateTableStreamingIngestionPolicyDropCommand(dbName, tableName);
            using (var client = KustoClientFactory.CreateCslAdminProvider(csb))
            {
                client.ExecuteControlCommand(tablePolicyDropCommand);
            }
        }
    }
}
```

To disable streaming ingestion on your cluster, run the following code:

```csharp
using System.Threading.Tasks;
using Microsoft.Azure Synapse Analytics.Management.Kusto; // Required package Microsoft.Azure Synapse Analytics.Management.Kusto
using Microsoft.Azure Synapse Analytics.Management.Kusto.Models;
using Microsoft.IdentityModel.Clients.ActiveDirectory; // Required package Microsoft.IdentityModel.Clients.ActiveDirectory
using Microsoft.Rest;
namespace StreamingIngestion
{
    class Program
    {
        static async Task Main(string[] args)
        {
            string appId = "<appId>";
            string appKey = "<appKey>";
            string appTenant = "<appTenant>";
            string clusterName = "<clusterName>";
            string resourceGroupName = "<resourceGroupName>";
            string subscriptionId = "<subscriptionId>";
            
            var authenticationContext = new AuthenticationContext($"https://login.windows.net/{appTenant}");
            var credential = new ClientCredential(appId, appKey);
            var result = await authenticationContext.AcquireTokenAsync(resource: "https://management.core.windows.net/", clientCredential: credential);
            
            var credentials = new TokenCredentials(result.AccessToken, result.AccessTokenType);
            var kustoManagementClient = new KustoManagementClient(credentials)
            {
                SubscriptionId = subscriptionId
        };
        
            var clusterUpdateParameters = new ClusterUpdate(enableStreamingIngest: false);
            await kustoManagementClient.Clusters.UpdateAsync(resourceGroupName, clusterName, clusterUpdateParameters);
        }
    }
}
```

---

## Limitations

* [Database cursors](kusto/management/databasecursor.md) aren't supported for a database if the database itself or any of its tables have the [Streaming ingestion policy](kusto/management/streamingingestionpolicy.md) defined and enabled.
* [Data mappings](kusto/management/mappings.md) must be [pre-created](kusto/management/create-ingestion-mapping-command.md) for use in streaming ingestion. Individual streaming ingestion requests don't accommodate inline data mappings.
* [Extent tags](kusto/management/extents-overview.md#extent-tagging) can't be set on the streaming ingestion data.
* [Update policy](kusto/management/updatepolicy.md). The update policy can reference only the newly-ingested data in the source table and not any other data or tables in the database.
* If streaming ingestion is used on any of the tables of the database, this database cannot be used as leader for [follower databases](follower.md) or as a [data provider](data-share.md#data-provider---share-data) for Azure Synapse Analytics Data Share.

## Next steps

* [Query data in Azure Synapse Analytics Data Explorer](web-query-data.md)

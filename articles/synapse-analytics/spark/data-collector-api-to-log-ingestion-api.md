---
title: Collect logs and metrics with Azure Log Analytics
description: This article shows how to collect and ingest Apache Spark diagnostics to Azure Log Analytics by using the Log Ingestion API in Azure Synapse Analytics.
author: eric-urban
ms.author: eur
ms.reviewer: jejiang
ms.topic: how-to
ms.date: 03/18/2026
---

# Collect logs and metrics with Azure Log Analytics

This article describes how to use the Azure Log Analytics destination for Apache Spark diagnostics in Azure Synapse Analytics by using the Log Ingestion API.

Azure Synapse Apache Spark diagnostic emission provides a unified configuration model for collecting Spark diagnostics across supported destinations. For Azure Log Analytics, the Log Ingestion API is the recommended ingestion mechanism.

This article explains how to configure emitter properties, route Apache Spark logs, event logs, and metrics to Log Analytics, and query the ingested data for monitoring and troubleshooting purposes.

## Migrate from the Data Collector API

If you are currently using the HTTP Data Collector API in Azure Synapse Analytics, migrate to the **Log Ingestion API** to align with the latest Azure Monitor ingestion architecture and best practices.

Key changes in the new model:

- Schema definitions are explicit through **Data Collection Rules (DCRs)**, which gives you predictable schema validation and more consistent query results than the older free-form payload approach.
- Ingestion is routed through **Data Collection Endpoints (DCEs)** and DCR mappings, which provide a more controlled ingestion path than posting directly to the Data Collector API endpoint.
- Authentication supports both service principal **client secret** and **certificate-based** options.
- The emitter type changes from `AzureLogAnalytics` to `AzureLogIngestion`.

Migration typically includes creating DCR and DCE resources, updating Fabric environment Spark properties, and validating data ingestion into custom Log Analytics tables.

## Log Ingestion API overview

For Apache Spark diagnostics in Microsoft Fabric, Log Ingestion API provides a structured ingestion model for authentication, schema definition, routing, and table delivery in Azure Log Analytics.

**Key components**

| Component | Purpose |
| --- | --- |
| App registration credentials | Provides Microsoft Entra app identity used to authenticate Log Ingestion API requests with either a client secret or certificate. |
| Log Analytics table | Provides the target custom table where ingested Spark diagnostics are stored for querying and monitoring. |
| Data Collection Rule (DCR) | Defines input streams, schema mapping, and optional transformations for ingestion. |
| Data Collection Endpoint (DCE) | Provides the ingestion endpoint URI (`dceUri`) used by clients to send data through DCR-based routing. |

Only user-created DCRs configured for Log Ingestion API can be used for programmatic ingestion.

## Step-by-step configuration

### Step 1. Prepare Log Analytics workspace

A Log Analytics workspace is required to receive Spark diagnostics. It's the basic storage and query unit for [Azure Monitor Logs](/azure/azure-monitor/logs/log-analytics-workspace-overview).

If you don't have one, [create a Log Analytics workspace in the Azure portal](https://portal.azure.com/#blade/Microsoft_OperationsManagementSuite_Workspace/CreateWorkspaceBladeV2).

> [!IMPORTANT]
> As you complete the following steps, create the Data Collection Endpoint (DCE) and Data Collection Rule (DCR) resources in the same region as the Log Analytics workspace.

### Step 2. Create a Data Collection Endpoint (DCE)

Create a Data Collection Endpoint (DCE) in the Azure portal. The DCE provides the endpoint URI that you configure in Spark properties for Log Ingestion API. The region of the DCE must be the same as the region of your Log Analytics workspace.

1. In the [**Azure portal**](https://portal.azure.com/#home), go to **Monitor** in the left navigation pane.
1. Under **Settings**, select **Data collection endpoints**, and then select **Create**.

   :::image type="content" source="media\data-collector-api-to-log-ingestion-api\create-a-data-collection-endpoint.png" alt-text="Screenshot showing create a data collection endpoint." lightbox="media\data-collector-api-to-log-ingestion-api\create-a-data-collection-endpoint.png":::

1. Create the endpoint, then note the DCE name (for example, `DCEdemo`).

### Step 3. Prepare sample JSON schema

When creating custom log tables, you must configure a Data Collection Rule (DCR). Based on the data stream definitions specified in the DCR, the system automatically generates the corresponding table schema in your Log Analytics workspace.

The following predefined JSON schema samples each map to a specific data type. Download the sample that fits your scenario, and upload it when you create the associated custom table and DCR.

- Spark event logs - [Event table JSON schema sample](https://raw.githubusercontent.com/microsoft/fabric-samples/refs/heads/main/docs-samples/data-engineering/SparkMonitoring/TableSchemaSamples/fabric-sample-table-event-schema.json)
- Spark driver and executor logs - [Log table JSON schema sample](https://raw.githubusercontent.com/microsoft/fabric-samples/refs/heads/main/docs-samples/data-engineering/SparkMonitoring/TableSchemaSamples/fabric-sample-table-log-schema.json)
- Spark metrics - [Metric table JSON schema sample](https://raw.githubusercontent.com/microsoft/fabric-samples/refs/heads/main/docs-samples/data-engineering/SparkMonitoring/TableSchemaSamples/fabric-sample-table-metric-schema.json)
- Platform metadata - [Platform metadata table JSON schema sample](https://raw.githubusercontent.com/microsoft/fabric-samples/refs/heads/main/docs-samples/data-engineering/SparkMonitoring/TableSchemaSamples/fabric-sample-table-metadata-schema.json)

Here's an example log table JSON schema sample for Spark driver and executor logs in Azure Log Analytics. Use this schema as a reference when creating your custom tables and DCRs for log ingestion.

```json
[
  {
    "applicationId_s": "<APPLICATION_ID>",
    "applicationName_s": "<NOTEBOOK_NAME>",
    "artifactId_g": "<ARTIFACT_GUID>",
    "artifactType_s": "SynapseNotebook",
    "capacityId_g": "<CAPACITY_GUID>",
    "Category": "Log",
    "executorId_s": "driver",
    "executorMax_s": 9,
    "executorMin_s": 1,
    "ExtraFields": {
      "Category": "Log",
      "JobId": "1"
    },
    "fabricEnvId_g": "<FABRIC_ENV_GUID>",
    "fabricLivyId_g": "<FABRIC_LIVY_GUID>",
    "fabricTenantId_g": "<FABRIC_TENANT_GUID>",
    "fabricWorkspaceId_g": "<FABRIC_WORKSPACE_GUID>",
    "isHighConcurrencyEnabled_s": false,
    "Level": "INFO",
    "logger_name_s": "org.apache.spark.scheduler.dynalloc.ExecutorMonitor",
    "Message": "Executor 1 is removed.",
    "thread_name_s": "spark-listener-group-executorManagement",
    "TimeGenerated": "<TIME_GENERATED>",
    "userId_g": "<USER_ID>"
  }
]
```

### Step 4. Create custom table (Direct Ingest)

Create a custom table in your Log Analytics workspace with the Log Ingestion API option, and upload the JSON schema sample to the associated DCR. This step is required to set up the destination for Spark diagnostics and ensure that the ingested data conforms to the expected schema. The region of the Log Analytics workspace, DCE, and DCR must be the same for successful ingestion.

1. In the [**Azure portal**](https://portal.azure.com/#home), open your Log Analytics workspace (for example, *loganalyticsworkspacedemo*).
1. Select **Tables** > **Create** > **New custom log (Direct Ingest)**.

    :::image type="content" source="media\data-collector-api-to-log-ingestion-api\create-custom-table-direct-ingest.png" alt-text="Screenshot showing create custom table direct ingest." lightbox="media\data-collector-api-to-log-ingestion-api\create-custom-table-direct-ingest.png":::

1. Enter the table settings:
   - **Table name**: For example, SparkLogTest (suffix "_CL" is auto-added).
   - **Table Plan**: Analytics
   - **Data Collection Rule**: Create a new DCR (for example, *SparkLogTestrule*).
   - **Data Collection Endpoint**: Select the DCE from the [Create a Data Collection Endpoint (DCE) step](#step-2-create-a-data-collection-endpoint-dce) (for example, *DCEdemo*).

    :::image type="content" source="media\data-collector-api-to-log-ingestion-api\create-custom-table-direct-ingest-fill-in.png" alt-text="Screenshot showing create custom table direct ingest configure." lightbox="media\data-collector-api-to-log-ingestion-api\create-custom-table-direct-ingest-fill-in.png":::

1. Select **Next**.
1. In **Schema and Transformation**, upload [the JSON schema sample](#step-3-prepare-sample-json-schema). You don't need to configure DCR transformation because the schema is fully stabilized on the client side.

### Step 5. Prepare service principal for authentication

1. Register an app in **Microsoft Entra ID**.

   :::image type="content" source="media\data-collector-api-to-log-ingestion-api\tenant-client.png" alt-text="Screenshot showing tenantId and clientId." lightbox="media\data-collector-api-to-log-ingestion-api\tenant-client.png":::

1. Record the **TenantId**, **ClientId**, and **ClientSecret** (if you use client secret authentication). You use these values in the Spark configuration in Step 6.
1. Grant the app the [**Monitoring Metrics Publisher**](/azure/role-based-access-control/built-in-roles/monitor#monitoring-metrics-publisher) role on each table's DCR resource. For role assignment steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

   :::image type="content" source="media\data-collector-api-to-log-ingestion-api\monitoring-metrics-publisher-role.png" alt-text="Screenshot showing the Monitoring Metrics Publisher role assignment." lightbox="media\data-collector-api-to-log-ingestion-api\monitoring-metrics-publisher-role.png":::

### Step 6. Configure Spark properties

To configure Spark, create an environment in Fabric and choose one of the following authentication options. Use only one option for a given emitter.

An environment in Fabric stores Spark settings and libraries that notebooks and Spark job definitions use at runtime. For steps to create one, see [Create, configure, and use an environment in Fabric](create-and-use-environment.md#create-an-environment-from-a-workspace).

- Choose **Option 1** if you want a simpler setup by using a client secret.
- Choose **Option 2** if your organization requires certificate-based authentication and centralized certificate management in Azure Key Vault.

In both options, you can select **Add from .yml** in the environment to import a `.yml` configuration file.

#### Option 1: Configure with service principal and client secret

Use this option for quick setup with service principal credentials and a client secret.

1. Create an environment in Fabric.
1. Add the following **Spark properties** with the appropriate values to the environment, or select **Add from .yml** in the ribbon to import a `.yml` configuration file.

   ```properties
   spark.synapse.diagnostic.emitters: <EMITTER_NAME>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.type: AzureLogIngestion
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.categories: DriverLog,ExecutorLog,EventLog,Metrics
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.dceUri: https://<DCE_NAME>.<REGION>.ingest.monitor.azure.com
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.logDcr: <LOG_DCR_ID>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.logStream: <LOG_STREAM_NAME>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.eventDcr: <EVENT_DCR_ID>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.eventStream: <EVENT_STREAM_NAME>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.metricDcr: <METRIC_DCR_ID>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.metricStream: <METRIC_STREAM_NAME>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.metaDcr: <META_DCR_ID>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.metaStream: <META_STREAM_NAME>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.secret: <SP_CLIENT_SECRET>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.tenantId: <SP_TENANT_ID>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.clientId: <SP_CLIENT_ID>
   spark.fabric.pools.skipStarterPools: 'true'
   ```
1. Save and publish the changes.

#### Option 2: Configure with service principal certificate authentication

Use this option when your organization requires certificate-based authentication.

Before you start, ensure that your service principal is created with a certificate. For more information, see [Create a service principal containing a certificate using Azure CLI](/cli/azure/azure-cli-sp-tutorial-3).

1. Create an environment in Fabric.
1. Add the following **Spark properties** with the appropriate values to the environment, or select **Add from .yml** in the ribbon to import a `.yml` configuration file.

   ```properties
   spark.synapse.diagnostic.emitters: <EMITTER_NAME>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.type: AzureLogIngestion
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.categories: DriverLog,ExecutorLog,EventLog,Metrics
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.dceUri: https://<DCE_NAME>.<REGION>.ingest.monitor.azure.com
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.logDcr: <LOG_DCR_ID>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.logStream: <LOG_STREAM_NAME>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.eventDcr: <EVENT_DCR_ID>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.eventStream: <EVENT_STREAM_NAME>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.metricDcr: <METRIC_DCR_ID>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.metricStream: <METRIC_STREAM_NAME>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.metaDcr: <META_DCR_ID>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.metaStream: <META_STREAM_NAME>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.certificate.keyVault.certificateName: <SP_CERT-NAME>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.certificate.keyVault: https://<KEYVAULT_NAME>.vault.azure.net/
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.tenantId: <SP_TENANT_ID>
   spark.synapse.diagnostic.emitter.<EMITTER_NAME>.clientId: <SP_CLIENT_ID>
   spark.fabric.pools.skipStarterPools: 'true'
   ```
1. Save and publish changes.

### Step 7. Attach the environment to notebooks or Spark job definitions, or set it as the workspace default

Use one of the following approaches based on your scope:

- Attach the environment to specific notebooks or Spark job definitions when you want targeted rollout, testing, or per-item control.
- Set the environment as the workspace default when you want consistent Spark diagnostics settings applied across the workspace.

To attach the environment to notebooks or Spark job definitions:
1. Navigate to your notebook or Spark job definition in Fabric.
1. Select the **Environment** menu on the Home tab and select the configured environment.
1. The configuration will be applied after starting a **Spark session**.

To set the environment as the workspace default:

1. Navigate to Workspace settings in Fabric.
1. Find **Spark settings** in workspace settings (**Workspace setting** > **Data Engineering/Science** > **Spark settings**).
1. Select **Environment** tab and choose the environment with diagnostics spark properties configured, and select **Save**.

### Step 8. Run Spark workloads and verify logs and metrics

Use the environment you created and attached in the previous section, then run Spark workloads and verify ingestion in Log Analytics.

1. Run Spark workloads by using the environment configured in the previous section. You can use one of the following methods:
   - Run a notebook in Fabric.
   - Submit a Spark batch job through a Spark job definition.
   - Run Spark activities in a pipeline.
1. Open the target Log Analytics workspace and verify that logs and metrics are ingested for the running workload.
1. To validate ingestion and inspect records, use the Kusto examples in [Query data with Kusto](#query-data-with-kusto).

## Write custom application logs

Use custom application logs when you want business-level or app-specific events in addition to platform diagnostics. These logs are emitted through the same diagnostic pipeline and appear in Log Analytics together with Spark logs, event logs, and metrics.

Use Apache Log4j in your Spark code to emit custom log messages. The following examples show a minimal pattern for Scala and PySpark.

Scala example:
```scala
%%spark
val logger = org.apache.log4j.LogManager.getLogger("com.contoso.LoggerExample")
logger.info("info message")
logger.warn("warn message")
logger.error("error message")
//log exception
try {
      1/0
 } catch {
      case e:Exception =>logger.warn("Exception", e)
}
// run job for task level metrics
val data = sc.parallelize(Seq(1,2,3,4)).toDF().count()
```

PySpark example:

```python
%%pyspark
logger = sc._jvm.org.apache.log4j.LogManager.getLogger("com.contoso.PythonLoggerExample")
logger.info("info message")
logger.warn("warn message")
logger.error("error message")
```

## Query data with Kusto

Use Kusto queries to validate that ingestion is working and to investigate Spark execution behavior. Replace placeholder values such as `{FabricWorkspaceId}`, `{ArtifactId}`, and `{LivyId}` with values from your own run.

Start with event and log queries to confirm data arrival, then use metric queries for performance analysis.

To query Apache Spark events:

```kusto
SparkEventTest_CL
| where fabricWorkspaceId_g == "{FabricWorkspaceId}" and artifactId_g == "{ArtifactId}" and fabricLivyId_g == "{LivyId}"
| order by TimeGenerated desc
| limit 100 
```

To query Spark application driver and executor logs:

```kusto
SparkLogTest_CL
| where fabricWorkspaceId_g == "{FabricWorkspaceId}" and artifactId_g == "{ArtifactId}" and fabricLivyId_g == "{LivyId}"
| order by TimeGenerated desc
| limit 100 
```

To query Apache Spark metrics:

```kusto
SparkMetricsTest_CL
| where fabricWorkspaceId_g == "{FabricWorkspaceId}" and artifactId_g == "{ArtifactId}" and fabricLivyId_g == "{LivyId}"
| where name_s endswith "jvm.total.used"
| summarize max(value_d) by bin(TimeGenerated, 30s), executorId_s
| order by TimeGenerated asc
```

To query platform metadata:

```kusto
SparkMetadataTest_CL 
| where fabricWorkspaceId_g == "{FabricWorkspaceId}" and artifactId_g == "{ArtifactId}" and fabricLivyId_g == "{LivyId}"
| order by TimeGenerated desc
| limit 100
```

## Fabric workspaces with managed virtual network

Fabric support enabling data exfiltration protection for workspaces. With exfiltration protection, the logs and metrics cannot be sent out to the destination endpoints directly. You can create corresponding [managed private endpoints](../security/security-managed-private-endpoints-create.md) for different destination endpoints in this scenario. 

## Available Apache Spark configurations

The following table lists Spark configurations for sending logs and metrics to Azure Log Analytics by using Log Ingestion API.

> [!IMPORTANT]
> For Azure Log Analytics, set `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.type` to `AzureLogIngestion`.
> `AzureLogAnalytics` is the legacy HTTP Data Collector API type. For legacy guidance, see [Monitor Apache Spark applications with Azure Log Analytics](azure-fabric-diagnostic-emitters-log-analytics.md).

| Configuration | Description |
| --- | --- |
| `spark.synapse.diagnostic.emitters` | The comma-separated destination names of diagnostic emitters. For example, `MyDest1`,`MyDest2`. |
| `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.type` | Built-in destination type. To enable Azure Log Analytics via Log Ingestion API, set this value to `AzureLogIngestion`. |
| `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.categories` | The comma-separated selected log categories. Available values include `DriverLog`, `ExecutorLog`, `EventLog`, `Metrics`. If not set, the default value is all categories. |
| `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.dceUri` | The Data Collection Endpoint (DCE) URI used for ingestion when routing data via Data Collection Rules (DCRs). |
| `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.logDcr` | The Data Collection Rule (DCR) resource ID used to route Spark logs to the destination. |
| `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.logStream` | The stream name defined in the Data Collection Rule (DCR) for Spark logs. |
| `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.eventDcr` | The Data Collection Rule (DCR) resource ID used to route Spark event logs. |
| `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.eventStream` | The stream name defined in the Data Collection Rule (DCR) for Spark event logs. |
| `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.metricDcr` | The Data Collection Rule (DCR) resource ID used to route Spark metrics. |
| `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.metricStream` | The stream name defined in the Data Collection Rule (DCR) for Spark metrics. |
| `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.metaDcr` | The Data Collection Rule (DCR) resource ID used to route Spark metadata. |
| `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.metaStream` | The stream name defined in the Data Collection Rule (DCR) for Spark metadata. |
| `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.certificate.keyVault.certificateName` |  The name of the certificate stored in Azure Key Vault, used for authentication. |
| `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.certificate.keyVault` | The Azure Key Vault URI that stores the authentication certificate. |
| `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.tenantId` | The Microsoft Entra tenant ID used for authentication. |
| `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.clientId` | The client (application) ID registered in Microsoft Entra ID. |
| `spark.fabric.pools.skipStarterPools` | This Spark property is used to force an on-demand Spark session. Set the value to `true` when using the default pool to trigger the libraries to emit logs and metrics. |
| `spark.synapse.diagnostic.emitter.<EMITTER_NAME>.secret` | The client secret associated with the Microsoft Entra ID (Azure AD) application, used together with the tenant ID and client ID to authenticate the emitter when sending diagnostic data. This setting is mutually exclusive with certificate-based authentication—configure either the client secret or the certificate, but not both. |

## Related content

- [Create Apache Spark job definition](../data-engineering/create-spark-job-definition.md)
- [Create, configure, and use an environment in Microsoft Fabric](../data-engineering/create-and-use-environment.md)
- [Develop, execute, and manage Microsoft Fabric notebooks](../data-engineering/author-execute-notebook.md)
- [Monitor Spark Applications](../data-engineering/spark-monitoring-overview.md)
- [Collect Apache Spark diagnostics using Azure Event Hubs](azure-fabric-diagnostic-emitters-azure-event-hub.md)
- [Collect Apache Spark diagnostics using Azure Storage Account](azure-fabric-diagnostic-emitters-azure-storage.md)
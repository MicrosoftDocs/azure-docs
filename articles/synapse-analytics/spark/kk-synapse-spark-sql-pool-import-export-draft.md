---
title: Import and Export data between serverless Apache Spark pools and SQL pools
description: This article introduces the Synapse Dedicated SQL Pool Connector API for moving data between dedicated SQL pools and serverless Apache Spark pools.
author: kalyankadiyala-Microsoft
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: spark
ms.date: 03/17/2022
ms.author: kalyankadiyala-Microsoft
ms.reviewer: 
--- 
# Azure Synapse Dedicated SQL Pool Connector for Apache Spark

## Introduction

The Azure Synapse Dedicated SQL Pool Connector for Apache Spark enables efficient large volume data transfers between [Apache Spark runtime](../../synapse-analytics/spark/apache-spark-overview.md) and [Dedicated SQL pool](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) in Azure Synapse Analytics. The connector is implemented in `Scala`. If the notebook's language preference is other than `Scala`, one can use the connector using the `%%spark` magic command.

The Connector offers following capabilities:

* Write-to and Read-from Synapse Dedicated SQL Pool tables - Internal and External table types.
* Supports all four Spark DataFrame write mode options - Append, ErrorIfExists, Ignore and Overwrite.
* Support for Parquet and Delimited Text (example, CSV) file formats for writing to an external table type.
* Improved write (throughput) performance moving data from the source to target Synapse Dedicated SQL Pool tables.
* Access post write performance metrics by passing a call-back handle (optional argument of type Scala function) that can accept a key->value map.
* Read improvements that enable querying data from views in Azure Synapse Dedicated SQL Pool.

## Orchestration Approach

This section illustrates the orchestration workflow by the Connector to move data between Azure Synapse Spark Runtime and the Azure Synapse Dedicated SQL Pool.

### Write

![Write-Orchestration](./media/synapse-spark-sql-pool-import-export/SynapseDedicatedSQLPoolSparkConnector-WriteOrchestration.png)

### Read

![Read-Orchestration](./media/synapse-spark-sql-pool-import-export/SynapseDedicatedSQLPoolSparkConnector-ReadOrchestration.png)

## Using the Connector

### Code Templates

This section introduces to the code template with the Connector function signature and contextual examples to represent the connector's usage to either write-to or read-from Synapse Dedicated SQL Pool.

#### Write Scenario

```scala
//Add required imports
import org.apache.spark.sql.DataFrame
import org.apache.spark.sql.SaveMode
import com.microsoft.spark.sqlanalytics.utils.Constants
import org.apache.spark.sql.SqlAnalyticsConnector._

//Define read options for example, if reading from CSV source, configure header and delimiter options.
val pathToInputSource="abfss://<storage_container_name>@<storage_account_name>.dfs.core.windows.net/<some_folder>/<some_dataset>.csv"

//Define read configuration for the input CSV
val dfReadOptions:Map[String, String] = Map("header" -> "true", "delimiter" -> ",")

//Initialize DataFrame that reads CSV data from a given source 
val readDF:DataFrame=spark.
            read.
            options(dfReadOptions).
            csv(pathToInputSource).
            limit(1000) //Reads first 1000 rows from the source CSV input.

//Setup and trigger the read DataFrame for write to Synapse Dedicated SQL Pool.
//Fully qualified SQL Server DNS name can be obtained using one of the following methods:
//    1. Synapse Workspace - Manage Pane - SQL Pools - <Properties view of the corresponding Dedicated SQL Pool>
//    2. From Azure Portal, follow the bread-crumbs for <Portal_Home> -> <Resource_Group> -> <Dedicated SQL Pool> and then go to Connection Strings/JDBC tab. 
val writeOptions:Map[String, String] = Map(Constants.SERVER -> "<dedicated-pool-sql-server-name>.sql.azuresynapse.net", 
                                            Constants.TEMP_FOLDER -> "abfss://<storage_container_name>@<storage_account_name>.dfs.core.windows.net/<some_temp_folder>")

//Setup optional callback/feedback function that can receive post write metrics of the job performed.
val callBackFunctionToReceivePostWriteMetrics: (Map[String, Any], Option[Throwable]) => Unit =
    (feedback: Map[String, Any], errorState: Option[Throwable]) => {
     if(errorState.isDefined){
         println(errorState.getOrElse("<No errors spotted.>"))
     }
     println(s"Feedback map - ${feedback.map{case(key, value) => s"$key -> $value"}.mkString("{",",\n","}")}")
}

//Configure and trigger write to Synapse Dedicated SQL Pool (note - default SaveMode is set to ErrorIfExists)
readDF.
    write.
    options(writeOptions).
    mode(SaveMode.Overwrite).
    synapsesql(tableName = "<database_name>.<schema_name>.<table_name>", 
                tableType = Constants.INTERNAL, //For external table type value is Constants.EXTERNAL
                location = None, //Not required for writing to internal table
                callBackHandle = Some(callBackFunctionToReceivePostWriteMetrics))
    
```

**Note about the `callBackHandle` argument**

The call back handle is an optional argument and a new introduction to the `synapsesql` signature. Primary idea is to give instant post-write metrics that developers can fold them into better orchestration across their workflow stages. Metric names are standardized in camel case for their string values with minimal exceptions. Users of the Connector can leverage these using the newly introduced Constants.FeedbackConstants object. This feature is new and experimental until few subsequent iterations. In the sense, based on feedback received the list will either become more concise or will see new metric additions.

Following are few useful metric-constants:

* WRITE_FAILURE_CAUSE -> "WriteFailureCause"
* TIME_INMILLIS_TO_COMPLETE_DATA_STAGING -> "DataStagingSparkJobDurationInMilliseconds"
* NUMBER_OF_RECORDS_STAGED_FOR_SQL_COMMIT -> "NumberOfRecordsStagedForSQLCommit"
* TIME_INMILLIS_TO_EXECUTE_COMMIT_SQLS -> "SQLStatementExecutionDurationInMilliseconds"
* COPY_INTO_COMMAND_PROCESSED_ROW_COUNT -> "rows_processed" ()
* ROW_COUNT_POST_WRITE_ACTION (applied for scenario where table type is external)

Following is a sample JSON string with post-write metrics:

```json
{
SparkApplicationId -> application_1647522710276_0002,
SQLStatementExecutionDurationInMilliseconds -> 10113,
WriteRequestReceivedAtEPOCH -> 1647523790633,
WriteRequestProcessedAtEPOCH -> 1647523808379,
StagingDataFileSystemCheckDurationInMilliseconds -> 60,
command -> "COPY INTO [helloworld_ingress].[internaltablewithhundredrows] ...",
NumberOfRecordsStagedForSQLCommit -> 100,
DataStagingSparkJobEndedAtEPOCH -> 1647523797245,
SchemaInferenceAssertionCompletedAtEPOCH -> 1647523790920,
DataStagingSparkJobDurationInMilliseconds -> 5252,
rows_processed -> 100,
SaveModeApplied -> TRUNCATE_COPY,
DurationInMillisecondsToValidateFileFormat -> 75,
status -> Completed,
SparkApplicationName -> ForDWConnectorPublicDocs_docspoolspark31_1647522838,
ThreePartFullyQualifiedTargetTableName -> workspacededicatedsqlpool.helloworld_ingress.internaltablewithhundredrows,
request_id -> QID13073,
StagingFolderConfigurationCheckDurationInMilliseconds -> 2,
JDBCConfigurationsSetupAtEPOCH -> 193,
StagingFolderConfigurationCheckCompletedAtEPOCH -> 1647523791012,
FileFormatValidationsCompletedAtEPOCHTime -> 1647523790995,
SchemaInferenceCheckDurationInMilliseconds -> 91,
SaveModeRequested -> Overwrite,
DataStagingSparkJobStartedAtEPOCH -> 1647523791993,
DurationInMillisecondsTakenToGenerateWriteSQLStatements -> 4}
```


#### Read Scenario

```scala
```

### Setup pre-requisite Azure Resources

Before progressing further, review and setup following dependent Azure Resources:

* [Azure Data Lake Storage](/storage/blobs/data-lake-storage-introduction) - used as the primary storage account for the Azure Synapse Workspace.
* [Azure Synapse Workspace](../../synapse-analytics/get-started-create-workspace.md) - create notebooks, build and deploy DataFrame based ingress-egress workflows.
* [Dedicated SQL Pool (formerly SQL DW)](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) - used to host and manage various data assets.
* [Azure Synapse Serverless Spark Pool](../../synapse-analytics/get-started-analyze-spark.md) - Azure Synapse Analytics runtime for Spark applications. For example, code submitted from workspace notebook is executed  code from the notebook).

### Authentication

At each stage of its process, the Connector authenticates with each of the dependent Azure Resource types (mentioned in the above illustrations). Let us now review how authentication requirements manifest for each supported scenario (Write or Read) and at each phase of respective scenarios:

* During a Write scenario:
  * Read (via user initiated DataFrame) from the Storage Account where data is sourced and will be written to target tables in Synapse Dedicated SQL Pool.
  * Stage data to temporary staging folders (user provided path or path set using workspace defaults).
  * Connect to Synapse Dedicated SQL Pool database.
  * Moving data into Synapse Dedicated SQL Pool table locations (for internal i.e., managed tables).
    * For external tables, data is written directly to the location set on the user provided Data Source configuration option.
* During a Read scenario:

Following is a description of how the authentication is handled at each stage of the request process by the Connector:

* During a write scenario:
  * Fetch data from source (i.e., via user initiated DataFrame)
    * If the storage account associated with the source is same as that set as primary storage for the Synapse Workspace, configuration values from Serverless Spark Pool will be applied.
    * If the storage account associated with the source is different, then initialize the source DataFrame by setting relevant  If the source is ADLS gen2, by default the credential information from the Serverless Spark Pool runtime is applied. In case the storage account is different  
Read from the Data Source (ADLS gen2) - leverage fs.* keys from the Serverless Spark Pool runtime configurations. This means, the User Identity logged in to Synapse workspace has access to the source storage. If your source is other than ADLS gen2, the client code must have relevant authentication detail configured over the DataFrame that reads from the source.
  * Write to staging data folders (ADLS gen2) -

Each dependent resource type as shown in the above illustrations, supports login with user identities defined in Azure Active Directory (i.e., AAD based authentication). As a first step, setup a User Identity in the Azure Active Directory (AAD) associated with the Azure Subscription where the resources will be created. For example, Azure Storage, Azure Synapse Workspace and Azure Dedicated SQL Pool (formerly SQL DW). Note, the connector is leveraged within an active login session with Azure Synapse Workspace. The Connector will leverage session tokens to fetch relevant access tokens to connect and interact with respective resources.

Alternative to AAD-based authentication is to use a combination of SQL basic authentication (i.e., username and password local to the Synapse Dedicated SQL Pool) with Storage Account Access Key. In this approach, the Connector would authenticate with Synapse Dedicated SQL Pool using basic auth, while

### Authorization

In this section we will review Authentication and Authorization requirements for each Azure Resource indicated in the above illustrations.

Authentication at a high-level:

* As a first step, define a User Identity in the Azure Active Directory (AAD) associated with the Azure subscription, where other resources will also be defined.
* Each resource mentioned in the afore-mentioned illustrations support Azure Active Directory to authenticate.
* Besides, users can connect with Azure Synapse Dedicated SQL Pool using SQL basic auth. This approach requires additional configurations to work with the connector.
* With AAD based approach, the connector will leverage established authentication tokens when interacting with Azure Storage and Azure Synapse Dedicated SQL Pool.

To successfully process a write or a read request, certain authorizations are required on each resource type. Following is a list of such required authorization grants by each resource type:

* Azure Storage
  * Assign [Azure Storage Blob Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) RBAC (Role-based Access Control) role to the user. The storage account in the context here is the one from where data will be source, or staged or will be persisted (in case of external tables).
* Azure Synapse Dedicated SQL Pool
  *  

### Limitations

### Write to Synapse Dedicated SQL Pool Tables

#### Internal Table Sample

#### External Table Sample

### Read from Synapse Dedicated SQL Pool Tables

## Authentication

Following are some of the key aspects of the connector:

* The Connector leverages [Azure Storage](../../storage/blobs/data-lake-storage-introduction.md) to stage data for writes and reads.
* Read path extracts data from [Dedicated SQL pool](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) to staging folders using T-SQL command [CETAS](/sql/t-sql/statements-).

## Additional Reading

* [Runtime library versions](../../synapse-analytics/spark/apache-spark-3-runtime.md)

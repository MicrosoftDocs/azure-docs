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

The Azure Synapse Dedicated SQL Pool Connector for Apache Spark offers an efficient way to transfer large volume data sets between [Apache Spark runtime](../../synapse-analytics/spark/apache-spark-overview.md) and [Dedicated SQL pool](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md), in Azure Synapse Analytics. The connector is implemented using `Scala` language. The connector is shipped as a default library within Azure Synapse environment - workspace Notebook and Serverless Spark Pool runtime. Using the Spark magic command `%%spark`, the Connector can be used with other notebook language preferences.

At a high-level, the connector provides following capabilities:

* Write to Azure Synapse Dedicated SQL Pool:
  * Ingest large volume data to Internal and External table types.
  * Support for different Spark DataFrame write mode options - `Append`, `ErrorIfExists`, `Ignore` and `Overwrite`.
  * Write to External Table type supports Parquet and Delimited Text file format (example - CSV).
  * Write path implementation leverages [COPY statement](../../synapse-analytics/sql-data-warehouse/quickstart-bulk-load-copy-tsql.md) instead of CETAS/CTAS approach.
  * Enhancements to optimize end-to-end write throughput performance.
  * Introduces an optional call-back handle (a Scala function argument) that clients can use to receive post-write metrics.
    * For example - time taken to stage data, time taken to write data to target tables, number of records staged, number of records committed to target table, and failure cause (in case of a failure).
* Read from Azure Synapse Dedicated SQL Pool:
  * Export large data sets from Tables (Internal and External) and Views.
  * Comprehensive push-down predicate support, where filters on DataFrame get mapped to corresponding SQL push-down predicates.

## Orchestration Approach

### Write

![Write-Orchestration](./media/synapse-spark-sql-pool-import-export/SynapseDedicatedSQLPoolSparkConnector-WriteOrchestration.png)

### Read

![Read-Orchestration](./media/synapse-spark-sql-pool-import-export/SynapseDedicatedSQLPoolSparkConnector-ReadOrchestration.png)

## Pre-requisites

This section presents necessary pre-requisites that must be setup for a successful application of the Azure Synapse Dedicated SQL Pool Connector for Apache Spark.

### Azure Resources

Review and setup following dependent Azure Resources:

* [Azure Data Lake Storage](../../storage/blobs/data-lake-storage-introduction.md) - used as the primary storage account for the Azure Synapse Workspace.
* [Azure Synapse Workspace](../../synapse-analytics/get-started-create-workspace.md) - create notebooks, build and deploy DataFrame based ingress-egress workflows.
* [Dedicated SQL Pool (formerly SQL DW)](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) - used to host and manage various data assets.
* [Azure Synapse Serverless Spark Pool](../../synapse-analytics/get-started-analyze-spark.md) - Spark runtime where the jobs are executed as Spark Applications.

#### Database Setup

Connect to the Synapse Dedicated SQL Pool database and run following setup statements:

* Create a database user that maps to the Azure Active Directory User Identity (also used to login to Azure Synapse Workspace).
  
    ```sql
    CREATE USER [username@domain.com] FROM EXTERNAL PROVIDER;      
    ```
  
  * Note:
    * This is not a required step to perform a write.
    * However, for read in order to assign the [`db_exporter`](/sql/relational-databases/security/authentication-access/database-level-roles#special-roles-for--and-azure-synapse) role the user must exist in the database.

* Create schema in which tables will be defined, such that writes and reads can successfully executed by the Connector.

    ```sql
    CREATE SCHEMA [<schema_name>];
    ```

### Authentication

To avoid the complexity of passing discrete credentials and configure authentication to access each resource type, the recommended approach is to setup and leverage Azure Active Directory based authentication. All the resource types support AAD-based authentication. It requires to define a User Identity in the Azure Active Directory associated with the subscription, where the resources will be deployed and configured.

### Authorization

This section focuses on required authorization grants that must be set for the User on respective Azure Resource Types - Azure Storage and Azure Synapse Dedicated SQL Pool.

#### [Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-introduction.md)

There are two ways to grant access permissions to Azure Data Lake Storage Gen2 - Storage Account:

* Role based Access Control role - [Storage Blob Data Contributor role](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor)
  * Assigning the `Storage Blob Data Contributor Role` grants the User permissions to read, write and delete from the Azure Storage Blob Containers.
  * RBAC offers a coarse control approach at the container level.
* [Access Control Lists (ACL)](../../storage/blobs/data-lake-storage-access-control.md)
  * ACL approach allows for fine-grained controls over specific paths and/or files under a given folder.
  * ACL checks are not enforced if the User is already granted permissions using RBAC approach.
  * There are two broad types of ACL permissions:
    * Access Permissions (applied at a specific level or object).
    * Default Permissions (automatically applied for all child objects at the time of their creation).
  * Type of permissions include:
    * `Execute` enables ability to traverse or navigate the folder hierarchies.
    * `Read` enables ability to read.
    * `Write` enables ability to write.
  * It is important to configure ACLs such that the Connector's writes and reads can be successfully performed.

#### [Azure Synapse Dedicated SQL Pool](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md)

* Write Scenario
  * Connector uses the COPY command to write data from staging to the internal table's managed location.
    * Setup required permissions described [here](../../synapse-analytics/sql-data-warehouse/quickstart-bulk-load-copy-tsql#set-up-the-required-permissions).
    * **Note** If the workspace User is set as an `Active Directory Admin` on the target database, this step can be skipped.
    * Following is a quick access snippet of the same:

      ```sql
      --Make sure your user has the permissions to CREATE tables in the [dbo] schema
      GRANT CREATE TABLE TO [<your_domain_user>@<your_domain_name>.com];
      GRANT ALTER ON SCHEMA::<target_database_schema_name> TO [<your_domain_user>@<your_domain_name>.com];

      --Make sure your user has ADMINISTER DATABASE BULK OPERATIONS permissions
      GRANT ADMINISTER DATABASE BULK OPERATIONS TO [<your_domain_user>@<your_domain_name>.com];

      --Make sure your user has INSERT permissions on the target table
      GRANT INSERT ON <your_table> TO [<your_domain_user>@<your_domain_name>.com]
      ```

* Read Scenario
  * Data set that matches the User's read requirements i.e., table, columns and predicates is first fetched to an external staging location using external tables.
  * In order to successfully create temporary external tables over data in the staging folders, grant the `db_exporter` the system stored procedure [sp_addrolemember](/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql).
  * Following is a reference sample:

    ```sql
    EXEC sp_addrolemember 'db_exporter', [<your_domain_user>@<your_domain_name>.com];
    ```

## Code Templates

This section provide reference code templates that describe how to use and invoke the Azure Synapse Dedicated SQL Pool Connector for Apache Spark.

### Write Scenario

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

   ```doc
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
    DurationInMillisecondsTakenToGenerateWriteSQLStatements -> 4
   }
   ```

#### Read Scenario

```scala

```

### Limitations

## Additional Reading

* [Runtime library versions](../../synapse-analytics/spark/apache-spark-3-runtime.md)
* [Azure Storage](../../storage/blobs/data-lake-storage-introduction.md)
* [Dedicated SQL pool](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md)

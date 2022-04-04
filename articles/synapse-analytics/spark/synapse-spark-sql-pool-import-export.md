---
title: Azure Synapse dedicated SQL pool connector for Apache Spark
description:  This article discusses the Azure Synapse dedicated SQL pool connector for Apache Spark. The connector is used to move data between the Apache Spark runtime (serverless Spark pool) and the Azure Synapse dedicated SQL pool.
author: kalyankadiyala-Microsoft
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: spark
ms.date: 03/18/2022
ms.author: kakadiya
ms.reviewer: ktuckerdavis, aniket.adnaik
--- 
# Azure Synapse dedicated SQL pool connector for Apache Spark

This article discusses the Azure Synapse dedicated SQL pool connector for Apache Spark in Azure Synapse Analytics. The connector is used to move data between the Apache Spark runtime (serverless Spark pool) and the Azure Synapse dedicated SQL pool.

## Introduction

The Azure Synapse dedicated SQL pool connector for Apache Spark in Azure Synapse Analytics efficiently transfers large-volume datasets between the [Apache Spark runtime](../../synapse-analytics/spark/apache-spark-overview.md) and a [dedicated SQL pool](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md). The connector is implemented by using the `Scala` language.

The connector is shipped as a default library within the Synapse Analytics environment that consists of a workspace notebook and serverless Spark pool runtime. By using the Spark magic command `%%spark`, you can place the Scala connector code in any Azure Synapse notebook cell regardless of the notebook language preferences.

At a high level, the connector provides the following capabilities:

* Writes to the Azure Synapse dedicated SQL pool:
  * Ingests a large volume of data to internal and external table types.
  * Supports the following DataFrame save mode preferences:
    * `Append`
    * `ErrorIfExists`
    * `Ignore`
    * `Overwrite`
  * Writes to an external table type that supports Parquet and the delimited text file format, for example, CSV.
  * Writes path implementation using a [COPY statement](../../synapse-analytics/sql-data-warehouse/quickstart-bulk-load-copy-tsql.md) instead of the CETAS/CTAS approach.
  * Provides enhancements to optimize end-to-end write throughput performance.
  * Introduces an optional call-back handle (a Scala function argument) that clients can use to receive post-write metrics.
    * Examples include the time taken to stage data and the time taken to write data to target tables. Examples also include the number of records staged and the number of records committed to target tables. Failure cause is included if the submitted request has failed.
* Reads from the Azure Synapse dedicated SQL pool:
  * Reads large datasets from the Azure Synapse dedicated SQL pool tables (internal and external) and views.
  * Supports comprehensive predicate push-down, where filters on DataFrame get mapped to corresponding SQL predicate push-down.
  * Supports column pruning.

> [!NOTE]
> The latest release of the connector introduced certain default behavior changes for the write path. See the section [Common issues](#common-issues) for a scenario description and relevant mitigation steps.

## Orchestration approach

The following two diagrams illustrate write and read orchestrations.

### Write

![Diagram that shows write orchestration.](./media/synapse-spark-sql-pool-import-export/synapse-dedicated-sql-pool-spark-connector-write-orchestration.png)

### Read

![Diagram that shows read orchestration.](./media/synapse-spark-sql-pool-import-export/synapse-dedicated-sql-pool-spark-connector-read-orchestration.png)

## Prerequisites

This section discusses the prerequisite steps for Azure resource setup and configuration. It includes authentication and authorization requirements for using the Azure Synapse dedicated SQL pool connector for Apache Spark.

### Azure resources

Review and set up the following dependent Azure resources:

* [Azure Data Lake Storage](../../storage/blobs/data-lake-storage-introduction.md): Used as the primary storage account for an Azure Synapse workspace.
* [Azure Synapse workspace](../../synapse-analytics/get-started-create-workspace.md): Used to create notebooks and build and deploy DataFrame-based ingress-egress workflows.
* [Dedicated SQL pool (formerly Azure SQL Data Warehouse)](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md): Used to host and manage various data assets.
* [Azure Synapse serverless Spark pool](../../synapse-analytics/get-started-analyze-spark.md): The Spark runtime where the jobs are executed as Spark applications.

#### Database setup

Connect to the Azure Synapse dedicated SQL pool database and run the following setup statements:

* Create a database user for the Azure Active Directory (Azure AD) user identity. It must be the same identity that's used to sign in to an Azure Synapse workspace.

  If your use case for the connector is to write data to destination tables in the Azure Synapse dedicated SQL pool, you can skip this step. This step is necessary only if your scenario is both write-to and read-from an Azure Synapse dedicated SQL pool, where the database user must be present in order to assign the [`db_exporter`](/sql/relational-databases/security/authentication-access/database-level-roles#special-roles-for--and-azure-synapse) role:
  
    ```sql
    CREATE USER [username@domain.com] FROM EXTERNAL PROVIDER;      
    ```

* Create a schema in which tables are defined so that the connector can successfully write to and read from respective tables:

    ```sql
    CREATE SCHEMA [<schema_name>];
    ```

### Authentication

This section discusses two approaches for authentication.

#### Azure AD-based authentication

Azure AD-based authentication is an integrated authentication approach. The user is required to successfully sign in to the Azure Synapse workspace. When users interact with respective resources such as storage and the Azure Synapse dedicated SQL pool, the user tokens are used from the runtime.

It's important to verify that users can connect and access resources to perform write and read actions. The user identity must be set up in the Azure AD associated with the Azure subscription where the resources are set up and configured to connect by using Azure AD-based authentication.

#### SQL basic authentication

An alternative to Azure AD-based authentication is to use SQL basic authentication. This approach requires the parameters described here:

* Write data to an Azure Synapse dedicated SQL pool
  * Reading data from the data source by initializing a DataFrame object:
    * Consider an example scenario where the data is read from a storage account for which the workspace user doesn't have access permissions.
    * In such a scenario, the initialization attempt should pass relevant access credentials, as shown in the following sample code snippet:

       ```Scala
       //Specify options that Spark runtime must support when interfacing and consuming source data
       val storageAccountName="<storageAccountName>"
       val storageContainerName="<storageContainerName>"
       val subscriptionId="<AzureSubscriptionID>"
       val spnClientId="<ServicePrincipalClientID>"
       val spnSecretKeyUsedAsAuthCred="<spn_secret_key_value>"
       val dfReadOptions:Map[String, String]=Map("header"->"true",
                                        "delimiter"->",", 
                                        "fs.defaultFS" -> s"abfss://$storageContainerName@$storageAccountName.dfs.core.windows.net",
                                        s"fs.azure.account.auth.type.$storageAccountName.dfs.core.windows.net" -> "OAuth",
                                        s"fs.azure.account.oauth.provider.type.$storageAccountName.dfs.core.windows.net" -> 
                                            "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider",
                                        "fs.azure.account.oauth2.client.id" -> s"$spnClientId",
                                        "fs.azure.account.oauth2.client.secret" -> s"$spnSecretKeyUsedAsAuthCred",
                                        "fs.azure.account.oauth2.client.endpoint" -> s"https://login.microsoftonline.com/$subscriptionId/oauth2/token",
                                        "fs.AbstractFileSystem.abfss.impl" -> "org.apache.hadoop.fs.azurebfs.Abfs",
                                        "fs.abfss.impl" -> "org.apache.hadoop.fs.azurebfs.SecureAzureBlobFileSystem")
        //Initialize the Storage Path string, where source data is maintained/kept.
        val pathToInputSource=s"abfss://$storageContainerName@$storageAccountName.dfs.core.windows.net/<base_path_for_source_data>/<specific_file (or) collection_of_files>"
        //Define data frame to interface with the data source
        val df:DataFrame = spark.
                    read.
                    options(dfReadOptions).
                    csv(pathToInputSource).
                    limit(100)
       ```

    * Similar to the preceding snippet, the DataFrame over the source data must have credentials to meet the requirement to perform the read from some other source from which you want to fetch data.
  
  * Staging the source data to the temporary folders:
    * The connector expects that the workspace user is granted permission to connect and successfully write to the staging folders, for example, temporary folders.
  
  * Writing to an Azure Synapse dedicated SQL pool table:
    * To successfully connect to an Azure Synapse dedicated SQL pool table, the connector expects the `user` and `password` option parameters.
    * Committing data to SQL occurs in two forms depending on the type of the target table that the user's request requires:
      * Internal table type: The connector requires the option `staging_storage_acount_key` set on the DataFrameWriter[Row] before invoking the method `synapsesql`.
      * External table type: The connector expects that the workspace user has access to read/write access to the target storage location where the external table's data is staged.

* Read from an Azure Synapse dedicated SQL pool table:
  * With the SQL basic authentication approach, to read data from the source tables, the connector's ability to write to the staging table must be met.
  * This requirement can be made possible by providing the `data_source` configuration option on the DataFrameReader reference, prior to invoking the `synapsesql` method.
  
### Authorization

This section focuses on required authorization grants that must be set for the user on respective Azure resource types: Azure Storage and an Azure Synapse dedicated SQL pool.

#### [Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-introduction.md)

There are two ways to grant access permissions to an Azure Data Lake Storage Gen2 storage account:

* Role-based access control (RBAC) role: [Storage Blob Data Contributor role](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor)
  * Assigning the `Storage Blob Data Contributor Role` grants the user permission to read, write, and delete from the Azure Storage Blob containers.
  * RBAC offers a coarse control approach at the container level.
* [Access control lists (ACLs)](../../storage/blobs/data-lake-storage-access-control.md)
  * The ACL approach allows for fine-grained controls over specific paths or files under a given folder.
  * ACL checks aren't enforced if the user is already granted permission by using an RBAC approach.
  * There are two broad types of ACL permissions:
    * Access permissions are applied at a specific level or object.
    * Default permissions are automatically applied for all child objects at the time of their creation.
  * Type of permissions include:
    * `Execute` enables the ability to traverse or navigate the folder hierarchies.
    * `Read` enables the ability to read.
    * `Write` enables the ability to write.
  * It's important to configure ACLs so that the connector can successfully write and read from the storage locations.

#### [Azure Synapse dedicated SQL pool](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md)

This section describes the authorization settings that are necessary to interact with an Azure Synapse dedicated SQL pool. You can skip this step if the user identity used to sign in to an Azure Synapse workspace is also configured as an `Active Directory Admin` for the database in the target Azure Synapse dedicated SQL pool.

* Write scenario
  * The connector uses the COPY command to write data from staging to the internal table's managed location.
    * Set up required permissions described in [this quickstart](../../synapse-analytics/sql-data-warehouse/quickstart-bulk-load-copy-tsql.md#set-up-the-required-permissions).
    * The following sample is a quick access snippet of the same:

      ```sql
      --Make sure your user has the permissions to CREATE tables in the [dbo] schema
      GRANT CREATE TABLE TO [<your_domain_user>@<your_domain_name>.com];
      GRANT ALTER ON SCHEMA::<target_database_schema_name> TO [<your_domain_user>@<your_domain_name>.com];

      --Make sure your user has ADMINISTER DATABASE BULK OPERATIONS permissions
      GRANT ADMINISTER DATABASE BULK OPERATIONS TO [<your_domain_user>@<your_domain_name>.com];

      --Make sure your user has INSERT permissions on the target table
      GRANT INSERT ON <your_table> TO [<your_domain_user>@<your_domain_name>.com]
      ```

* Read scenario
  * A dataset that matches the user's read requirements, for example, table, columns, and predicates, is first fetched to an external staging location by using external tables.
  * To successfully create temporary external tables over data in the staging folders, grant the `db_exporter` the system stored procedure [sp_addrolemember](/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql).
  * The following snippet is a reference sample:

    ```sql
    EXEC sp_addrolemember 'db_exporter', [<your_domain_user>@<your_domain_name>.com];
    ```

## Process the response

Invoking `synapsesql` has two possible end states. They're the successful completion of the write or read request or a failure state. In this section, we'll review how to handle each of these states with respect to a write and read use case.

### Read request response

Whether the response is a success or a failure, the result is rendered under the respective cell. For more information, see the application logs.

### Write request response

The new write path API introduces a graceful approach, where the results can be programmatically interpreted and processed. The snippets are printed under the respective cell from which the request is submitted. The method `synapsesql` now supports another argument to pass an optional lambda, for example, a Scala function. The expected arguments for this function are `scala.collection.immutable.Map[String, Any]` and an optional `Throwable`.

The benefits of this approach over printing the end state result to the console in a partial snippet and to the application logs include:

* Allow the users, for example, developers, to model dependent workflow activities that depend on a prior state without having to change the cell.
* Provide a programmatic approach to handle the outcome `if <success> <do_something_next> else <capture_error_and_handle_necessary_mitigation>`.
  * Review the sample error code snippet presented in the section [Write request callback handle](../../synapse-analytics/spark/synapse-spark-sql-pool-import-export.md#write-request-callback-handle).
* Review and use the [Write scenario code template](../../synapse-analytics/spark/synapse-spark-sql-pool-import-export.md#write-code-template). The template makes it easy to adapt to the signature changes and motivate to build better write workflows by using the call-back function. This function is also known as lambda.

## Connector API documentation

Azure Synapse dedicated SQL pool connector for Apache Spark: [API documentation](https://synapsesql.blob.core.windows.net/docs/2.0.0/scaladocs/com/microsoft/spark/sqlanalytics/index.html).

## Code templates

This section presents reference code templates to describe how to use and invoke the Azure Synapse dedicated SQL pool connector for Apache Spark.

### Write scenario

The following sections relate to a write scenario.

#### Write request: synapsesql method signature

The method signature for the connector version built for Spark 2.4.8 has one less argument than that applied to the Spark 3.1.2 version. The following snippets are the two method signatures:

* Spark pool version 2.4.8
    
    ```Scala
    synapsesql(tableName:String, 
               tableType:String = Constants.INTERNAL, 
               location:Option[String] = None):Unit
    ```

* Spark pool version 3.1.2

    ```Scala
    synapsesql(tableName:String, 
               tableType:String = Constants.INTERNAL, 
               location:Option[String] = None,
               callBackHandle=Option[(Map[String, Any], Option[Throwable])=>Unit]):Unit
    ```

#### Write code template

```Scala
//Add required imports
import org.apache.spark.sql.DataFrame
import org.apache.spark.sql.SaveMode
import com.microsoft.spark.sqlanalytics.utils.Constants
import org.apache.spark.sql.SqlAnalyticsConnector._

//Define read options, for example, if reading from a CSV source, configure header and delimiter options.
val pathToInputSource="abfss://<storage_container_name>@<storage_account_name>.dfs.core.windows.net/<some_folder>/<some_dataset>.csv"

//Define read configuration for the input CSV.
val dfReadOptions:Map[String, String] = Map("header" -> "true", "delimiter" -> ",")

//Initialize the DataFrame that reads CSV data from a given source. 
val readDF:DataFrame=spark.
            read.
            options(dfReadOptions).
            csv(pathToInputSource).
            limit(1000) //Reads first 1000 rows from the source CSV input.

//Set up and trigger the read DataFrame for write to Synapse dedicated SQL pool.
//Fully qualified SQL Server DNS name can be obtained by using one of the following methods:
//    1. Synapse Workspace - Manage Pane - SQL Pools - <Properties view of the corresponding Dedicated SQL Pool>.
//    2. From the Azure portal, follow the breadcrumbs for <Portal_Home> -> <Resource_Group> -> <Dedicated SQL Pool> and then go to the Connection Strings/JDBC tab. 
val writeOptions:Map[String, String] = Map(Constants.SERVER -> "<dedicated-pool-sql-server-name>.sql.azuresynapse.net", 
                                            Constants.TEMP_FOLDER -> "abfss://<storage_container_name>@<storage_account_name>.dfs.core.windows.net/<some_temp_folder>")

//Set up an optional callback/feedback function that can receive post-write metrics of the job performed.
var errorDuringWrite:Option[Throwable] = None
val callBackFunctionToReceivePostWriteMetrics: (Map[String, Any], Option[Throwable]) => Unit =
    (feedback: Map[String, Any], errorState: Option[Throwable]) => {
    println(s"Feedback map - ${feedback.map{case(key, value) => s"$key -> $value"}.mkString("{",",\n","}")}")
    errorDuringWrite = errorState
}

//Configure and trigger write to an Azure Synapse dedicated SQL pool (default SaveMode is set to ErrorIfExists)
readDF.
    write.
    options(writeOptions).
    mode(SaveMode.Overwrite).
    synapsesql(tableName = "<database_name>.<schema_name>.<table_name>", 
                tableType = Constants.INTERNAL, //For external table type value is Constants.EXTERNAL
                location = None, //Not required for writing to an internal table
                callBackHandle = Some(callBackFunctionToReceivePostWriteMetrics))

//If the write request has failed, raise an error and fail the cell's execution.
if(errorDuringWrite.isDefined) throw errorDuringWrite.get    
```

#### DataFrame SaveMode support

The following items briefly describe how the SaveMode setting by the user translates into actions taken by the connector:

* ErrorIfExists (the connector's default save mode)
  * If the destination table exists, the write is aborted with an exception returned to the callee. Else, a new table is created with data from the staging folders.
* Ignore
  * If the destination table exists, the write ignores the write request without returning an error. Else, a new table is created with data from the staging folders.
* Overwrite
  * If the destination table exists, the existing data in the destination is replaced with data from the staging folders. Else, a new table is created with data from the staging folders.
* Append
  * If the destination table exists, the new data is appended to it. Else, a new table is created with data from the staging folders.
  
#### Write request callback handle

The new write path API changes introduced an experimental feature to provide the client with a key-value map of post-write metrics. These metrics provide information like the number of records staged to the number of records written to a SQL table. They can also include information on the time spent in staging and executing the SQL statements to write data to the Azure Synapse dedicated SQL pool.

String values for each metric key are defined and accessible from the new object reference, `Constants.FeedbackConstants`. By default, these metrics are written to the Spark driver logs. You can also fetch these metrics by passing a call-back handle like the Scala function. The following snippet is the signature of this function:

```Scala
//Function signature is expected to have two arguments - a `scala.collection.immutable.Map[String, Any]` and an Option[Throwable].
//Post-write if there's a reference of this handle passed to the `synapsesql` signature. It will be invoked by the closing process.
//These arguments will have valid objects in either a Success or Failure case. In the case of Failure, the second argument will be a Some(Throwable), for example, some error reference.
(Map[String, Any], Option[Throwable]) => Unit
```

The following list of notable metric constants includes values described by using internal capitalization:

* WRITE_FAILURE_CAUSE -> "WriteFailureCause"
* TIME_INMILLIS_TO_COMPLETE_DATA_STAGING -> "DataStagingSparkJobDurationInMilliseconds"
* NUMBER_OF_RECORDS_STAGED_FOR_SQL_COMMIT -> "NumberOfRecordsStagedForSQLCommit"
* TIME_INMILLIS_TO_EXECUTE_COMMIT_SQLS -> "SQLStatementExecutionDurationInMilliseconds"
* COPY_INTO_COMMAND_PROCESSED_ROW_COUNT -> "rows_processed" ()
* ROW_COUNT_POST_WRITE_ACTION (applied for a scenario where the table type is external)

The following snippet is a sample JSON string with post-write metrics:

   ```doc
   {
    SparkApplicationId -> <spark_yarn_application_id>,
    SQLStatementExecutionDurationInMilliseconds -> 10113,
    WriteRequestReceivedAtEPOCH -> 1647523790633,
    WriteRequestProcessedAtEPOCH -> 1647523808379,
    StagingDataFileSystemCheckDurationInMilliseconds -> 60,
    command -> "COPY INTO [schema_name].[table_name] ...",
    NumberOfRecordsStagedForSQLCommit -> 100,
    DataStagingSparkJobEndedAtEPOCH -> 1647523797245,
    SchemaInferenceAssertionCompletedAtEPOCH -> 1647523790920,
    DataStagingSparkJobDurationInMilliseconds -> 5252,
    rows_processed -> 100,
    SaveModeApplied -> TRUNCATE_COPY,
    DurationInMillisecondsToValidateFileFormat -> 75,
    status -> Completed,
    SparkApplicationName -> <spark_application_name>,
    ThreePartFullyQualifiedTargetTableName -> <database_name>.<schema_name>.<table_name>,
    request_id -> <query_id_as_retrieved_from_synapse_dedicated_sql_db_query_reference>,
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

### Read scenario

The following sections relate to a read scenario.

#### Read request: synapsesql method signature

The following snippet is the signature to use `synapsesql`. It applies to both Spark 2.4.8 and Spark 3.1.2 connector versions:

```Scala
synapsesql(tableName:String) => org.apache.spark.sql.DataFrame
```

#### Read code template

```Scala
//Use case is to read data from an internal table in an Azure Synapse dedicated SQL pool database.
//Azure Active Directory-based authentication approach is preferred here.
import org.apache.spark.sql.DataFrame
import com.microsoft.spark.sqlanalytics.utils.Constants
import org.apache.spark.sql.SqlAnalyticsConnector._

//Read from the existing internal table.
val dfToReadFromTable:DataFrame = spark.read.
    option(Constants.SERVER, "<sql-server-name>.sql.azuresynapse.net").
    option(Constants.TEMP_FOLDER, "abfss://<container_name>@<storage_account_name>.dfs.core.windows.net/<some_base_path_for_temporary_staging_folders>").
    synapsesql("<database_name>.<schema_name>.<table_name>").
    select("<some_column_1>", "<some_column_5>", "<some_column_n>"). //Column-pruning i.e., query select column values
    filter(col("Title").startsWith("E")). //Push-down filter criteria that gets translated to SQL Push-down Predicates
    limit(10) //Fetch a sample of 10 records

//Show contents of the DataFrame.
dfToReadFromTable.show()
```

### Code sample

Here's another code sample.

#### Use the connector with PySpark

```Python
%%spark

import org.apache.spark.sql.DataFrame
import com.microsoft.spark.sqlanalytics.utils.Constants
import org.apache.spark.sql.SqlAnalyticsConnector._

//Code for either writing or reading from an Azure Synapse dedicated SQL pool (similar to the aforementioned code templates)

```

## Common issues

The latest release of the connector introduced certain default behavior changes for the write path. The following list includes common behaviors and the necessary mitigation steps:

* Error handling, for example, throwing exceptions from cells, when writing to an Azure Synapse dedicated SQL pool:
  * Context
    * Typically, when the code in a notebook cell contains an error, an error is surfaced and notebook execution stops.
    * The current implementation of this connector is different. Any errors are written to the driver logs, but notebook cell execution continues.
  * Mitigation
    * Handling and surfacing the error allows the cell execution to fail. Subsequent cell execution won't be attempted. For example, it might be canceled.
    * See the [Write code template](#write-code-template) section for a sample code reference.

* A write request returns a validation error message, as described:
  * Detailed error message
    * `“java.lang.IllegalArgumentException: Valid SQL Server option - logical_server and a valid three-part table name are required to succesfully setup SQL Server connections`.
  * Mitigation
      * Specify the write option parameter `Constants.SERVER`, which is also included in the [Write code template](#write-code-template), as shown in the following snippet:

       ```Scala
        df.write.
        option(Constants.SERVER, "<sql_server_name-supporting-dedicated-pool>.sql.azuresynapse.net"). //required; can be fetched from Portal – Azure synapse workspace Overview pane - Dedicated SQL endpoint config.
        option(Constants.TEMP_FOLDER, "abfss://<storage-container-name>@<storage-account-name>.dfs.core.windows.net/temp-tables"). //Defaults to workspace attached primary storage.
        mode(SaveMode.Overwrite). //Defaults to ErrorIfExists SaveMode option.
        synapsesql("<db_name>.<schema_name>.<table_name>", Constants.INTERNAL, None, Option(callBackHandle))
       ```

* Deprecation warning
  * Context
     * When you use the `synapsesql` method to write to an Azure Synapse dedicated SQL pool table, the following warning message appears under the respective cell: "warning: there was one deprecation warning; for details, enable `:setting -deprecation' or`:replay -deprecation'."
  * Mitigation
    * This warning is related to the deprecated `sqlanalytics` signature.
    * Users can safely ignore this warning. It doesn't affect the use of the `synapsesql` method.
  
## Things to note

The connector uses the capabilities of dependent resources like Azure Storage and an Azure Synapse dedicated SQL pool to achieve efficient data transfers. Consider the following aspects when you tune for optimized performance. Optimization doesn't necessarily mean speed. It also relates to predictable outcomes:

* The `Performance Level` setting in an Azure Synapse dedicated SQL pool drives write throughput for maximum achievable concurrency, data distribution, and threshold cap for maximum rows per transaction.
  * You can review the [transaction size](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-develop-transactions.md#transaction-size) limitation when you select the `Performance Level` of the Azure Synapse dedicated SQL pool.
  * You can adjust `Performance Level` by using the [Scale](../../synapse-analytics/sql-data-warehouse/quickstart-scale-compute-portal.md) feature.
* Initial parallelism for a write scenario is heavily dependent on the number of partitions the job would identify. You can adjust partition count by using the Spark configuration setting `spark.sql.files.maxPartitionBytes` to better regroup the source data during file scans. You can also try the DataFrame re-partition method.
* Besides factoring in the data characteristics, also derive optimal Executor node count and choice. An example would be small versus medium sizes that drive CPU and memory resource allocations.
* When you tune for write or read performance, factor in the dominating pattern. It will be I/O intensive or CPU intensive. Then adjust your choices for Spark Pool capacities. Take advantage of autoscale.
* Review the data orchestration illustrations to see where your job's performance can suffer. For example:
  * In a read scenario, determine if adding more filters or choosing select columns, for example, column pruning, can help avoid unwarranted data movement.
  * In a write scenario, review the source DataFrame plan. Identify if concurrency can be tuned in reading the data for staging. This initial parallelism helps downstream data movement too. Take advantage of feedback to draw some patterns.
* Besides Spark and the Azure Synapse dedicated SQL pool, also watch for write and read latencies associated with the Azure Data Lake Storage Gen2 resources used to stage data or hold data at rest.

## Further reading

* [Runtime library versions](../../synapse-analytics/spark/apache-spark-3-runtime.md)
* [Azure Storage](../../storage/blobs/data-lake-storage-introduction.md)
* [Dedicated SQL pool](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md)

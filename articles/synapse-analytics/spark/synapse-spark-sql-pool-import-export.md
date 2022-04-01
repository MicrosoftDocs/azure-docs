---
title: Azure Synapse Dedicated SQL Pool Connector for Apache Spark
description: Presents Azure Synapse Dedicated SQL Pool Connector for Apache Spark for moving data between Apache Spark Runtime (Serverless Spark Pool) and the Synapse Dedicated SQL Pool.
author: kalyankadiyala-Microsoft
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: spark
ms.date: 03/18/2022
ms.author: kakadiya
ms.reviewer: ktuckerdavis, aniket.adnaik
--- 
# Azure Synapse Dedicated SQL Pool Connector for Apache Spark

## Introduction

The Azure Synapse Dedicated SQL Pool Connector for Apache Spark in Azure Synapse Analytics efficiently transfers large volume data sets between the [Apache Spark runtime](../../synapse-analytics/spark/apache-spark-overview.md) and the [Dedicated SQL pool](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md). The connector is implemented using `Scala` language. The connector is shipped as a default library within Azure Synapse environment - workspace Notebook and Serverless Spark Pool runtime. Using the Spark magic command `%%spark`, the Scala Connector code can be placed in any Synapse Notebook Cell regardless of the notebook language preferences.

At a high-level, the connector provides the following capabilities:

* Write to Azure Synapse Dedicated SQL Pool:
  * Ingest large volume data to Internal and External table types.
  * Supports following DataFrame save mode preferences:
    * `Append`
    * `ErrorIfExists`
    * `Ignore`
    * `Overwrite`
  * Write to External Table type supports Parquet and Delimited Text file format (example - CSV).
  * Write path implementation leverages [COPY statement](../../synapse-analytics/sql-data-warehouse/quickstart-bulk-load-copy-tsql.md) instead of CETAS/CTAS approach.
  * Enhancements to optimize end-to-end write throughput performance.
  * Introduces an optional call-back handle (a Scala function argument) that clients can use to receive post-write metrics.
    * For example - time taken to stage data, time taken to write data to target tables, number of records staged, number of records committed to target table, and the failure cause (if the request submitted has failed).
* Read from Azure Synapse Dedicated SQL Pool:
  * Read large data sets from Synapse Dedicated SQL Pool Tables (Internal and External) and Views.
  * Comprehensive predicate push down support, where filters on DataFrame get mapped to corresponding SQL predicate push down.
  * Support for column pruning.

> [!NOTE]
> The latest release of the Connector introduced certain default behavior changes for the write path. Please refer to the section [Common Issues](#common-issues) for scenario description and relevant mitigation steps.

## Orchestration Approach

### Write

![Write-Orchestration](./media/synapse-spark-sql-pool-import-export/synapse-dedicated-sql-pool-spark-connector-write-orchestration.png)

### Read

![Read-Orchestration](./media/synapse-spark-sql-pool-import-export/synapse-dedicated-sql-pool-spark-connector-read-orchestration.png)

## Pre-requisites

This section details necessary pre-requisite steps include Azure Resource set up and Configurations including authentication and authorization requirements for using the Azure Synapse Dedicated SQL Pool Connector for Apache Spark.

### Azure Resources

Review and set up following dependent Azure Resources:

* [Azure Data Lake Storage](../../storage/blobs/data-lake-storage-introduction.md) - used as the primary storage account for the Azure Synapse Workspace.
* [Azure Synapse Workspace](../../synapse-analytics/get-started-create-workspace.md) - create notebooks, build and deploy DataFrame based ingress-egress workflows.
* [Dedicated SQL Pool (formerly SQL DW)](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) - used to host and manage various data assets.
* [Azure Synapse Serverless Spark Pool](../../synapse-analytics/get-started-analyze-spark.md) - Spark runtime where the jobs are executed as Spark Applications.

#### Database Set up

Connect to the Synapse Dedicated SQL Pool database and run following set up statements:

* Create a database user for the Azure Active Directory User Identity. This must be the same identity that is used to log in to Azure Synapse Workspace. If your use case for the Connector is to write data to destination tables in Azure Synapse Dedicated SQL Pool, this step can be skipped. This step is necessary only if your scenario is both write-to and read-from Synapse Dedicated SQL Pool, where the database user must be present in order to assign the [`db_exporter`](/sql/relational-databases/security/authentication-access/database-level-roles#special-roles-for--and-azure-synapse) role.
  
    ```sql
    CREATE USER [username@domain.com] FROM EXTERNAL PROVIDER;      
    ```

* Create schema in which tables will be defined, such that the Connector can successfully write-to and read-from respective tables.

    ```sql
    CREATE SCHEMA [<schema_name>];
    ```

### Authentication

#### Azure Active Directory based Authentication

Azure Active Directory based authentication is an integrated authentication approach. The user is required to successfully log in to the Azure Synapse Analytics Workspace. When interacting with respective resources such as storage and Synapse Dedicated SQL Pool, the user tokens are leveraged from the runtime. It's important to verify that the respective users can connect and access respective resources to perform write and read actions. The User Identity must be set up in the Azure Active Directory associated with the Azure Subscription where the resources are set up and configured to connect using Azure Active Directory based authentication.

#### SQL Basic Authentication

An alternative to Azure Active Directory based authentication is to use SQL basic authentication. This approach requires additional parameters as described below:

* Write Data to Azure Synapse Dedicated SQL Pool
  * When reading data from the data source by initializing a DataFrame object:
    * Consider an example scenario where the data is read from a Storage Account for which the workspace user doesn't have access permissions.
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

    * Similar to above snippet, the DataFrame over the source data must have credentials to meet the requirement to perform read from some other source you would like fetch data!
  
  * When staging the source data to the temporary folders:
    * Connector expects the workspace user is granted permission to connect and successfully write to the staging folders (i..e, temporary folders).
  
  * Writing to Azure Synapse Dedicated SQL Pool table:
    * To successfully connect to Azure Synapse Dedicated SQL Pool table, the Connector expects the `user` and `password` option parameters.
    * Committing data to SQL occurs in two forms depending on type of the target table that the user's request requires:
      * Internal Table Type - the Connector requires the option `staging_storage_acount_key` set on the DataFrameWriter[Row] before invoking the method `synapsesql`.
      * External Table Type - the Connector expects the workspace user has access to read/write access to the target storage location where external table's data is staged.

* Reading from Azure Synapse Dedicated SQL Pool table:
  * With SQL basic authentication approach, in order to read data from the source tables, Connector's ability to write to staging table must met.
  * This requirement can be made possible by providing the `data_source` configuration option on the DataFrameReader reference, prior to invoking the `synapsesql` method.
  
### Authorization

This section focuses on required authorization grants that must be set for the User on respective Azure Resource Types - Azure Storage and Azure Synapse Dedicated SQL Pool.

#### [Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-introduction.md)

There are two ways to grant access permissions to Azure Data Lake Storage Gen2 - Storage Account:

* Role based Access Control role - [Storage Blob Data Contributor role](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor)
  * Assigning the `Storage Blob Data Contributor Role` grants the User permissions to read, write and delete from the Azure Storage Blob Containers.
  * RBAC offers a coarse control approach at the container level.
* [Access Control Lists (ACL)](../../storage/blobs/data-lake-storage-access-control.md)
  * ACL approach allows for fine-grained controls over specific paths and/or files under a given folder.
  * ACL checks aren't enforced if the User is already granted permissions using RBAC approach.
  * There are two broad types of ACL permissions:
    * Access Permissions (applied at a specific level or object).
    * Default Permissions (automatically applied for all child objects at the time of their creation).
  * Type of permissions include:
    * `Execute` enables ability to traverse or navigate the folder hierarchies.
    * `Read` enables ability to read.
    * `Write` enables ability to write.
  * It's important to configure ACLs such that the Connector can successfully write and read from the storage locations.

#### [Azure Synapse Dedicated SQL Pool](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md)

This section details authorization settings necessary to interact with Azure Synapse Dedicated SQL Pool. This step can be skipped, if the User Identity used to log in to Azure Synapse Analytics Workspace is also configured as an `Active Directory Admin`, for the database in the target Synapse Dedicated SQL Pool.

* Write Scenario
  * Connector uses the COPY command to write data from staging to the internal table's managed location.
    * Set up required permissions described [here](../../synapse-analytics/sql-data-warehouse/quickstart-bulk-load-copy-tsql.md#set-up-the-required-permissions).
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

## Processing the Response

Invoking `synapsesql` has two possible end states - Successful completion of the request (write or read) or a Failure state. In this section we'll review how to handle each of these states with respect to a write and read use case.

### Read Request Response

Upon completion, in either case of a success or a failure the result is rendered below the respective cell. Detailed information can be obtained from the application logs.

### Write Request Response

The new write path API introduces a graceful approach, where the results can be programmatically interpreted and processed, besides printing the snippets below respective cell from which the request is submitted. The method `synapsesql` now supports an additional argument to pass an optional lambda (i.e., Scala Function ). The expected arguments for this function are - a `scala.collection.immutable.Map[String, Any]` and an optional `Throwable`.

Benefits of this approach over printing the end state result to console (partial snippet) and to the application logs include:

* Allow the end-users (i.e., developers) to model dependent workflow activities that depend on a prior state, without having to change the cell.
* Provide a programmatic approach to handle the outcome - `if <success> <do_something_next> else <capture_error_and_handle_necessary_mitigation>`.
  * Reviewing the sample error code snippet presented in the section [Write Request Callback Handle](../../synapse-analytics/spark/synapse-spark-sql-pool-import-export.md#write-request-callback-handle).
* Recommend to review and leverage the [Write Scenario - Code Template](../../synapse-analytics/spark/synapse-spark-sql-pool-import-export.md#write-code-template) that makes easy to adopt to the signature changes, as well motivate to build better write workflows by leveraging the call-back function (a.ka., lambda).

## Connector API Documentation

Azure Synapse Dedicated SQL Pool Connector for Apache Spark - [API Documentation](https://synapsesql.blob.core.windows.net/docs/2.0.0/scaladocs/com/microsoft/spark/sqlanalytics/index.html).

### Configuration Options

To successfully bootstrap and orchestrate the read or write operation, the Connector expects certain configuration parameters. The object definition - `com.microsoft.spark.sqlanalytics.utils.Constants` provides a list of standardized constants for each parameter key.

Following table describes the essential configuration options that must be set for each usage scenario:

|Usage Scenario| Options to configure |
|--------------|----------------------------------|
| Write using AAD based authentication | <ul><li>Azure Synapse Dedicated SQL End Point<ul><li>`Constants.SERVER`<ul><li>By default, if user has not provided one, the Synapse Dedicated SQL End Point will be inferred by using the database name from the three-part table argument to `synapsesql` method.</li><li>User can chose to provide `Constants.SERVER` option, in which case inference will not be made.</li></ul></ul></li><li>Azure Data Lake Storage (g2) End Point  - Staging Folders<ul><li>For Internal Table Type:<ul><li>Configure either `Constants.TEMP_FOLDER` or `Constants.DATASOURCE` option.</li><li>If user chose to provide `Constants.DATASOURCE` option, staging folder will be derived by using the `location` value on the DataSource.</li><li>If both are provided, then the `Constants.TEMP_FOLDER` option value will be used.</li><li>In the absence of a staging folder option, the Connector will derive one based on the runtime configuration - `spark.sqlanalyticsconnector.stagingdir.prefix`.</li></ul></li><li>For External Table Type:<ul><li>`Constants.DATASOURCE` is a required configuration option.</li><li>The storage path defined on the Data Source's `location` parameter will be used as the base path to establish final absolute path.</li><li>The base path is then appended with the value set on the `synapsesql` method's `location` argument, example `/<external_table_name>`.</li><li>If the `location` argument to `synapsesql` method is not provided, then the connector will derive the location value as  `<base_path>/dbName/schemaName/tableName`.</li></ul></li></ul></li></ul>|
| Write using SQL Basic Authentication | <ul><li>Azure Synapse Dedicated SQL End Point<ul><li>`Constants.SERVER` - Synapse Dedicated SQL Pool End Point (Server FQDN)</li><li>`Constants.USER` - SQL User Name.</li><li>`Constants.PASSWORD` - SQL User Password.</li><li>`Constants.STAGING_STORAGE_ACCOUNT_KEY` associated with Storage Account that hosts `Constants.TEMP_FOLDERS` (internal table types only) or `Constants.DATASOURCE`.</li></ul></li><li>Azure Data Lake Storage (g2) End Point  - Staging Folders<ul><li>SQL basic authentication credentials do not apply to access storage end points. Hence it is required that the workspace user identity is given relevant access permissions (reference the section - [Azure Data Lake Storage Gen2](#azure-data-lake-storage-gen2).</li></ul></li></ul>|
|Read using AAD based authentication|<ul><li>Credentials are auto-mapped, and user is not required to provide specific configuration options.</li><li>Three-part table name argument on `synapsesql` method is required to read from respective table in Azure Synapse Dedicated SQL Pool.</li></ul>|
|Read using SQL basic authentication|<ul><li>Azure Synapse Dedicated SQL End Point<ul><li>`Constants.SERVER` - Synapse Dedicated SQL Pool End Point (Server FQDN)</li><li>`Constants.USER` - SQL User Name.</li><li>`Constants.PASSWORD` - SQL User Password.</li></ul></li><li>Azure Data Lake Storage (g2) End Point  - Staging Folders<ul><li>`Constants.DATA_SOURCE` - Location setting from data source is used to stage extracted data from Azure Synapse Dedicated SQL End Point.</li></ul></li></ul>|
  
## Code Templates

This section presents reference code templates to describe how to use and invoke the Azure Synapse Dedicated SQL Pool Connector for Apache Spark.

### Write Scenario

#### Write Request - `synapsesql` Method Signature

The method signature for the Connector version built for Spark 2.4.8 has one less argument, than that applied to the Spark 3.1.2 version. Following are the two method signatures:

* Spark Pool Version 2.4.8

```Scala
synapsesql(tableName:String, 
           tableType:String = Constants.INTERNAL, 
           location:Option[String] = None):Unit
```

* Spark Pool Version 3.1.2

```Scala
synapsesql(tableName:String, 
           tableType:String = Constants.INTERNAL, 
           location:Option[String] = None,
           callBackHandle=Option[(Map[String, Any], Option[Throwable])=>Unit]):Unit
```

#### Write Code Template

```Scala
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

//Set up and trigger the read DataFrame for write to Synapse Dedicated SQL Pool.
//Fully qualified SQL Server DNS name can be obtained using one of the following methods:
//    1. Synapse Workspace - Manage Pane - SQL Pools - <Properties view of the corresponding Dedicated SQL Pool>
//    2. From Azure Portal, follow the bread-crumbs for <Portal_Home> -> <Resource_Group> -> <Dedicated SQL Pool> and then go to Connection Strings/JDBC tab. 
val writeOptions:Map[String, String] = Map(Constants.SERVER -> "<dedicated-pool-sql-server-name>.sql.azuresynapse.net", 
                                            Constants.TEMP_FOLDER -> "abfss://<storage_container_name>@<storage_account_name>.dfs.core.windows.net/<some_temp_folder>")

//Set up optional callback/feedback function that can receive post write metrics of the job performed.
var errorDuringWrite:Option[Throwable] = None
val callBackFunctionToReceivePostWriteMetrics: (Map[String, Any], Option[Throwable]) => Unit =
    (feedback: Map[String, Any], errorState: Option[Throwable]) => {
    println(s"Feedback map - ${feedback.map{case(key, value) => s"$key -> $value"}.mkString("{",",\n","}")}")
    errorDuringWrite = errorState
}

//Configure and trigger write to Synapse Dedicated SQL Pool (note - default SaveMode is set to ErrorIfExists)
readDF.
    write.
    options(writeOptions).
    mode(SaveMode.Overwrite).
    synapsesql(tableName = "<database_name>.<schema_name>.<table_name>", 
                tableType = Constants.INTERNAL, //For external table type value is Constants.EXTERNAL
                location = None, //Not required for writing to an internal table
                callBackHandle = Some(callBackFunctionToReceivePostWriteMetrics))

//If write request has failed, raise an error and fail the Cell's execution.
if(errorDuringWrite.isDefined) throw errorDuringWrite.get    
```

#### DataFrame SaveMode Support

Following is a brief description of how the SaveMode setting by the User would translate into actions taken by the Connector:

* ErrorIfExists (Connector's default save mode)
  * If destination table exists, then the write is aborted with an exception returned to the callee. Else, a new table is created with data from the staging folders.
* Ignore
  * If the destination table exists, then the write will ignore the write request without returning an error. Else, a new table is created with data from the staging folders.
* Overwrite
  * If the destination table exists, then existing data in the destination is replaced with data from the staging folders. Else, a new table is created with data from the staging folders.
* Append
  * If the destination table exists, then the new data is appended to it. Else, a new table is created with data from the staging folders.
  
#### Write Request Callback Handle

The new write path API changes introduced an experimental feature to provide the client with a key->value map of post-write metrics. These metrics provide information such as number of records staged, to number of records written to SQL table, time spent in staging and executing the SQL statements to write data to the Synapse Dedicated SQL Pool. String values for each Metric key are defined and accessible from the new Object reference - `Constants.FeedbackConstants`. These metrics are by default written to the Spark Driver logs. One can also fetch these by passing a call-back handle (a `Scala Function`). Following is the signature of this function:

```Scala
//Function signature is expected to have two arguments - a `scala.collection.immutable.Map[String, Any]` and an Option[Throwable]
//Post-write if there's a reference of this handle passed to the `synapsesql` signature, it will be invoked by the closing process.
//These arguments will have valid objects in either Success or Failure case. In case of Failure the second argument will be a Some(Throwable) i.e., some error reference.
(Map[String, Any], Option[Throwable]) => Unit
```

Following is a list of some notable metric constants, with values described using Camel-case format:

* WRITE_FAILURE_CAUSE -> "WriteFailureCause"
* TIME_INMILLIS_TO_COMPLETE_DATA_STAGING -> "DataStagingSparkJobDurationInMilliseconds"
* NUMBER_OF_RECORDS_STAGED_FOR_SQL_COMMIT -> "NumberOfRecordsStagedForSQLCommit"
* TIME_INMILLIS_TO_EXECUTE_COMMIT_SQLS -> "SQLStatementExecutionDurationInMilliseconds"
* COPY_INTO_COMMAND_PROCESSED_ROW_COUNT -> "rows_processed" ()
* ROW_COUNT_POST_WRITE_ACTION (applied for scenario where table type is external)

Following is a sample JSON string with post-write metrics:

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

### Read Scenario

#### Read Request - `synapsesql` Method Signature

Following is the signature to leverage `synapsesql` (applies to both Spark 2.4.8 and Spark 3.1.2 Connector versions):

```Scala
synapsesql(tableName:String) => org.apache.spark.sql.DataFrame
```

#### Read Code Template

```Scala
//Use case is to read data from an internal table in Synapse Dedicated SQL Pool DB
//Azure Active Directory based authentication approach is preferred here.
import org.apache.spark.sql.DataFrame
import com.microsoft.spark.sqlanalytics.utils.Constants
import org.apache.spark.sql.SqlAnalyticsConnector._

//Read from existing internal table
val dfToReadFromTable:DataFrame = spark.read.
    option(Constants.SERVER, "<sql-server-name>.sql.azuresynapse.net").
    option(Constants.TEMP_FOLDER, "abfss://<container_name>@<storage_account_name>.dfs.core.windows.net/<some_base_path_for_temporary_staging_folders>").
    synapsesql("<database_name>.<schema_name>.<table_name>").
    select("<some_column_1>", "<some_column_5>", "<some_column_n>"). //Column-pruning i.e., query select column values
    filter(col("Title").startsWith("E")). //Push-down filter criteria that gets translated to SQL Push-down Predicates
    limit(10) //Fetch a sample of 10 records

//Show contents of the dataframe
dfToReadFromTable.show()
```

### Additional Code Samples

#### Using Connector with PySpark

```Python
%%spark

import org.apache.spark.sql.DataFrame
import com.microsoft.spark.sqlanalytics.utils.Constants
import org.apache.spark.sql.SqlAnalyticsConnector._

//Code for either writing or reading from Azure Synapse Dedicated SQL Pool (similar to afore-mentioned code templates)

```

## Common Issues

The latest release of the Connector introduced certain default behavior changes for the write path. Following is the list of such common behaviors and necessary mitigation steps:

* Error Handling (i.e., throwing exceptions from cells) when writing to Synapse Dedicated SQL Pool.
  * Context
    * Typically, when the code in a notebook cell contains an error, an error will be surfaced and notebook execution will stop.
    * The current implementation of this connector is different, in that any errors will be written to the Driver Logs, but notebook cell execution will continue.
  * Mitigation
    * Handling and surfacing the error will allow the Cell execution to fail. Subsequent cell execution will not be attempted (i.e., cancelled).
    * See section - Write [Code Template](#write-code-template) section for a sample code reference.

* A write request returns a validation error message, as described below
  * Detailed Error Message
    `“java.lang.IllegalArgumentException: Valid SQL Server option - logical_server and a valid three-part table name are required to succesfully setup SQL Server connections`.
  * Mitigation - Specify the write option parameter `Constants.SERVER`as shown below (also included in the [Write Code Template](#write-code-template))

   ```Scala
    df.write.
    option(Constants.SERVER, "<sql_server_name-supporting-dedicated-pool>.sql.azuresynapse.net"). //required; can be fetched from Portal – Azure synapse workspace Overview pane - Dedicated SQL endpoint config.
    option(Constants.TEMP_FOLDER, "abfss://<storage-container-name>@<storage-account-name>.dfs.core.windows.net/temp-tables"). //Defaults to workspace attached primary storage.
    mode(SaveMode.Overwrite). //Defaults to ErrorIfExists SaveMode option.
    synapsesql("<db_name>.<schema_name>.<table_name>", Constants.INTERNAL, None, Option(callBackHandle))
   ```

* Deprecation Warning
  * Context - When using the `synapsesql` method to write to Synapse Dedicated SQL Pool table, following warning message is displayed below the respective cell:
    * "warning: there was one deprecation warning; for details, enable `:setting -deprecation' or`:replay -deprecation'"
  * Mitigation
    * This is related to the deprecated `sqlanalytics` signature.
    * End users can safely ignore this warning. This does not effect use of `synapsesql` method.
  
## Things to Note

The Connector leverages the capabilities of dependent resources (Azure Storage and Synapse Dedicated SQL Pool) to achieve efficient data transfers. Following are few important aspects must be taken into consideration when tuning for optimized (note, doesn't necessarily mean speed; this also relates to predictable outcomes) performance:

* The `Performance Level` setting in Synapse Dedicated SQL Pool will drive write throughput, in terms of maximum achievable concurrency, data distribution and threshold cap for max rows per transaction.
  * Review the [transaction size](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-develop-transactions.md#transaction-size) limitation when selecting the `Performance Level` of the Synapse Dedicated SQL Pool.
  * `Performance Level` can be adjusted using the [Scale](../../synapse-analytics/sql-data-warehouse/quickstart-scale-compute-portal.md) feature.
* Initial parallelism for a write scenario is heavily dependent on the number of partitions the job would identify. Partition count can be adjusted using the Spark configuration setting `spark.sql.files.maxPartitionBytes` to better re-group the source data during file scans. Besides, one can try DataFrame's repartition method.
* Besides factoring in the data characteristics also derive optimal Executor node count and choice (for example, small vs medium sizes that drive CPU & Memory resource allocations).
* When tuning for write or read performance, recommend factoring in the dominating pattern - I/O intensive or CPU intensive, and adjust your choices for Spark Pool capacities. Leverage auto-scale.
* Review the data orchestration illustrations to see where your job's performance can suffer. For example:
  * In a read scenario, determine if adding additional filters or choosing select columns (i.e., column-pruning) can help avoid unwarranted data movement.
  * In a write scenario, review the source DataFrame plan and identify if concurrency can be tuned in reading the data for staging. This initial parallelism will help downstream data movement as well. Leverage feedback handle to draw some patterns.
* Besides, Spark and Synapse Dedicated SQL Pool, also watch for write and read latencies associated with the ADLS Gen2 resources used to stage data or to hold data-at-rest.

## Additional Reading

* [Runtime library versions](../../synapse-analytics/spark/apache-spark-3-runtime.md)
* [Azure Storage](../../storage/blobs/data-lake-storage-introduction.md)
* [Dedicated SQL pool](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md)

---
title: Azure Synapse Dedicated SQL Pool Connector for Apache Spark
description: This article discusses the Azure Synapse Dedicated SQL Pool Connector for Apache Spark. The connector is used to move data between a serverless Spark pool and Azure Synapse Dedicated SQL Pool.
author: kalyankadiyala-Microsoft
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: spark
ms.date: 03/18/2022
ms.author: kakadiya
ms.reviewer: ktuckerdavis, aniket.adnaik
--- 
# Azure Synapse Dedicated SQL Pool Connector for Apache Spark

This article discusses the Azure Synapse Dedicated SQL Pool Connector for Apache Spark in Azure Synapse Analytics. The connector is used to move data between the Apache Spark runtime (serverless Spark pool) and Azure Synapse Dedicated SQL Pool.

## Introduction

The Azure Synapse Dedicated SQL Pool Connector for Apache Spark in Azure Synapse Analytics enables efficient transfer of large datasets between the [Apache Spark runtime](../../synapse-analytics/spark/apache-spark-overview.md) and the [dedicated SQL pool](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md).

The connector is implemented by using the `Scala` language. The connector is shipped as a default library within the Azure Synapse environment that consists of a workspace notebook and the serverless Spark pool runtime. To use the connector with other notebook language choices, use the Spark magic command `%%spark`.

At a high level, the connector provides the following capabilities:

* Writes to Azure Synapse Dedicated SQL Pool:
  * Ingests a large volume of data to internal and external table types.
  * Supports the following DataFrame save mode preferences:
    * `Append`
    * `ErrorIfExists`
    * `Ignore`
    * `Overwrite`
  * Writes to an external table type that supports Parquet and the delimited text file format, for example, CSV.
  * To write data to internal tables, the connector now uses a [COPY statement](../../synapse-analytics/sql-data-warehouse/quickstart-bulk-load-copy-tsql.md) instead of the CETAS/CTAS approach.
  * Enhancements optimize end-to-end write throughput performance.
  * Introduces an optional call-back handle (a Scala function argument) that clients can use to receive post-write metrics:
    * A few examples include the number of records, the duration to complete a certain action, and failure reason.
* Reads from Azure Synapse Dedicated SQL Pool:
  * Reads large datasets from Azure Synapse Dedicated SQL Pool tables, which are internal and external, and views.
  * Comprehensive predicate push-down support, where filters on DataFrame get mapped to corresponding SQL predicate push down.
  * Support for column pruning.

## Orchestration approach

The following two diagrams illustrate write and read orchestrations.

### Write

![Diagram that shows write orchestration.](./media/synapse-spark-sql-pool-import-export/synapse-dedicated-sql-pool-spark-connector-write-orchestration.png)

### Read

![Diagram that shows read orchestration.](./media/synapse-spark-sql-pool-import-export/synapse-dedicated-sql-pool-spark-connector-read-orchestration.png)

## Prerequisites

This section discusses the prerequisite steps for Azure resource setup and configuration. It includes authentication and authorization requirements for using the Azure Synapse Dedicated SQL Pool Connector for Apache Spark.

### Azure resources

Review and set up the following dependent Azure resources:

* [Azure Data Lake Storage](../../storage/blobs/data-lake-storage-introduction.md): Used as the primary storage account for the Azure Synapse workspace.
* [Azure Synapse workspace](../../synapse-analytics/get-started-create-workspace.md): Used to create notebooks and build and deploy DataFrame-based ingress-egress workflows.
* [Dedicated SQL pool (formerly Azure SQL Data Warehouse)](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md): Provides enterprise data warehousing features.
* [Azure Synapse serverless Spark pool](../../synapse-analytics/get-started-analyze-spark.md): Provides the Spark runtime where the jobs are executed as Spark applications.

#### Prepare the database

Connect to the Azure Synapse Dedicated SQL Pool database and run the following setup statements:

* Create a database user that's mapped to the Azure Active Directory (Azure AD) user identity that's used to sign in to the Azure Synapse workspace:
  
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

Azure AD-based authentication is an integrated authentication approach. The user is required to successfully sign in to the Azure Synapse workspace. When users interact with respective resources, such as storage and Azure Synapse Dedicated SQL Pool, the user tokens are used from the runtime.

Azure AD-based authentication is an integrated authentication approach. The user is required to successfully log in to the Azure Synapse workspace.

#### Basic Authentication

The Basic Authentication approach requires the user to configure `username` and `password` options. See the section [Configuration options](#configuration-options) to learn about relevant configuration parameters for reading from and writing to tables in Azure Synapse Dedicated SQL Pool.
  
### Authorization

This section discusses authorization.

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
  * Types of permission include:
    * `Execute` enables the ability to traverse or navigate the folder hierarchies.
    * `Read` enables the ability to read.
    * `Write` enables the ability to write.
  * Configure ACLs so that the connector can successfully write and read from the storage locations.

#### [Azure Synapse Dedicated SQL Pool](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md)

To enable successful interaction with Azure Synapse Dedicated SQL Pool, the following authorization is necessary unless you're a user also configured as an `Active Directory Admin` on the dedicated SQL endpoint:

* Write scenario
  * Connector uses the COPY command to write data from staging to the internal table's managed location.
    * Configure the required permissions described in [this quickstart](../../synapse-analytics/sql-data-warehouse/quickstart-bulk-load-copy-tsql.md#set-up-the-required-permissions).
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

* Read scenario
  * Grant the user `db_exporter` by using the system stored procedure `sp_addrolemember`.

    ```sql
    EXEC sp_addrolemember 'db_exporter', [<your_domain_user>@<your_domain_name>.com];
    ```

## Connector API documentation

Azure Synapse Dedicated SQL Pool Connector for Apache Spark: [API documentation](https://synapsesql.blob.core.windows.net/docs/latest/scala/index.html)

### Configuration options

To successfully bootstrap and orchestrate the read or write operation, the connector expects certain configuration parameters. The object definition `com.microsoft.spark.sqlanalytics.utils.Constants` provides a list of standardized constants for each parameter key.

The following table describes the essential configuration options that must be set for each usage scenario:

|Usage scenario| Options to configure |
|--------------|----------------------------------|
| Write using Azure AD-based authentication | <ul><li>Azure Synapse Dedicated SQL endpoint<ul><li>`Constants.SERVER`<ul><li>By default, the connector infers the Azure Synapse Dedicated SQL endpoint associated with the database name (from the three-part table name argument to `synapsesql` method).</li><li>Alternatively, users can provide the `Constants.SERVER` option.</li></ul></ul></li><li>Azure Data Lake Storage Gen2 endpoint: Staging folders<ul><li>For internal table type:<ul><li>Configure either `Constants.TEMP_FOLDER` or the `Constants.DATASOURCE` option.</li><li>If the user chose to provide the `Constants.DATASOURCE` option, the staging folder is derived by using the `location` value on the data source.</li><li>If both are provided, the `Constants.TEMP_FOLDER` option value is used.</li><li>In the absence of a staging folder option, the connector derives one based on the runtime configuration `spark.sqlanalyticsconnector.stagingdir.prefix`.</li></ul></li><li>For external table type:<ul><li>`Constants.DATASOURCE` is a required configuration option.</li><li>The storage path defined on the data source's `location` parameter is used as the base path to establish the final absolute path.</li><li>The base path is then appended with the value set on the `synapsesql` method's `location` argument, for example, `/<external_table_name>`.</li><li>If the `location` argument to `synapsesql` method isn't provided, the connector derives the location value as `<base_path>/dbName/schemaName/tableName`.</li></ul></li></ul></li></ul>|
| Write using Basic Authentication | <ul><li>Azure Synapse Dedicated SQL endpoint<ul><li>`Constants.SERVER`: Azure Synapse Dedicated SQL Pool endpoint (server FQDN)</li><li>`Constants.USER`: SQL user name</li><li>`Constants.PASSWORD`: SQL user password</li><li>`Constants.STAGING_STORAGE_ACCOUNT_KEY` associated with the storage account that hosts `Constants.TEMP_FOLDERS` (internal table types only) or `Constants.DATASOURCE`</li></ul></li><li>Azure Data Lake Storage Gen2 endpoint: Staging folders<ul><li>SQL Basic Authentication credentials don't apply to access storage endpoints. It's required that the workspace user identity is given relevant access permissions. (See the section [Azure Data Lake Storage Gen2](#azure-data-lake-storage-gen2).)</li></ul></li></ul>|
|Read using Azure AD-based authentication|<ul><li>Credentials are automapped and the user isn't required to provide specific configuration options.</li><li>Three-part table name argument on `synapsesql` method is required to read from the respective table in Azure Synapse Dedicated SQL Pool.</li></ul>|
|Read using Basic Authentication|<ul><li>Azure Synapse Dedicated SQL endpoint<ul><li>`Constants.SERVER`: Azure Synapse Dedicated SQL Pool endpoint (server FQDN)</li><li>`Constants.USER`: SQL user name</li><li>`Constants.PASSWORD`: SQL user password</li></ul></li><li>Azure Data Lake Storage Gen2 endpoint: Staging folders<ul><li>`Constants.DATA_SOURCE`: Location setting from data source is used to stage extracted data from the Azure Synapse Dedicated SQL endpoint.</li></ul></li></ul>|
  
## Code templates

This section presents reference code templates to describe how to use and invoke the Azure Synapse Dedicated SQL Pool Connector for Apache Spark.

### Write to Azure Synapse Dedicated SQL Pool

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

### Write using Azure AD-based authentication

The following comprehensive code template describes how to use the connector for write scenarios:

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

//Set up and trigger the read DataFrame for write to Azure Synapse Dedicated SQL Pool.
//Fully qualified SQL Server DNS name can be obtained by using one of the following methods:
//    1. Synapse Workspace - Manage Pane - SQL Pools - <Properties view of the corresponding Dedicated SQL Pool>
//    2. From the Azure portal, follow the breadcrumbs for <Portal_Home> -> <Resource_Group> -> <Dedicated SQL Pool> and then go to the Connection Strings/JDBC tab. 
//If `Constants.SERVER` is not provided, the value will be inferred by using the `database_name` in the three-part table name argument to the `synapsesql` method.
//Likewise, if `Constants.TEMP_FOLDER` is not provided, the connector will use the runtime staging directory config (see the section on Configuration options for details).
val writeOptionsWithAADAuth:Map[String, String] = Map(Constants.SERVER -> "<dedicated-pool-sql-server-name>.sql.azuresynapse.net",
                                            Constants.TEMP_FOLDER -> "abfss://<storage_container_name>@<storage_account_name>.dfs.core.windows.net/<some_temp_folder>")

//Set up an optional callback/feedback function that can receive post-write metrics of the job performed.
var errorDuringWrite:Option[Throwable] = None
val callBackFunctionToReceivePostWriteMetrics: (Map[String, Any], Option[Throwable]) => Unit =
    (feedback: Map[String, Any], errorState: Option[Throwable]) => {
    println(s"Feedback map - ${feedback.map{case(key, value) => s"$key -> $value"}.mkString("{",",\n","}")}")
    errorDuringWrite = errorState
}

//Configure and submit the request to write to Azure Synapse Dedicated SQL Pool. (Note the default SaveMode is set to ErrorIfExists.)
//The following sample uses the Azure AD-based authentication approach. See further examples to use SQL Basic Authentication.
readDF.
    write.
    //Configure required configurations.
    options(writeOptionsWithAADAuth).
    //Choose a save mode that is apt for your use case.
    mode(SaveMode.Overwrite).
    synapsesql(tableName = "<database_name>.<schema_name>.<table_name>", 
                //For external table type value is Constants.EXTERNAL
                tableType = Constants.INTERNAL, 
                //Optional parameter that is used to specify external table's base folder; defaults to `database_name/schema_name/table_name`
                location = None, 
                //Optional parameter to receive a callback.
                callBackHandle = Some(callBackFunctionToReceivePostWriteMetrics))

//If the write request has failed, raise an error and fail the cell's execution.
if(errorDuringWrite.isDefined) throw errorDuringWrite.get
```

#### Write using Basic Authentication

The following code snippet replaces the write definition described in the [Write using Azure AD-based authentication](#write-using-azure-ad-based-authentication) section. To submit a write request by using the SQL Basic Authentication approach:

```Scala
//Define write options to use SQL Basic Authentication
val writeOptionsWithBasicAuth:Map[String, String] = Map(Constants.SERVER -> "<dedicated-pool-sql-server-name>.sql.azuresynapse.net",
                                           //Set database user name
                                           Constants.USER -> "<user_name>",
                                           //Set database user's password
                                           Constants.PASSWORD -> "<user_password>",
                                           //Required only when writing to an external table. For write to internal table, this can be used instead of TEMP_FOLDER option.
                                           Constants.DATA_SOURCE -> "<Name of the datasource as defined in the target database>"
                                           //To be used only when writing to internal tables. Storage path will be used for data staging.
                                           Constants.TEMP_FOLDER -> "abfss://<storage_container_name>@<storage_account_name>.dfs.core.windows.net/<some_temp_folder>")

//Configure and submit the request to write to Azure Synapse Dedicated SQL Pool. 
readDF.
    write.
    options(writeOptions).
    //Choose a save mode that is apt for your use case.
    mode(SaveMode.Overwrite). 
    synapsesql(tableName = "<database_name>.<schema_name>.<table_name>", 
                //For external table type value is Constants.EXTERNAL
                tableType = Constants.INTERNAL,
                //Not required for writing to an internal table 
                location = None,
                //Optional parameter.
                callBackHandle = Some(callBackFunctionToReceivePostWriteMetrics))
```

In a Basic Authentication approach, in order to read data from a source storage path, other configuration options are required. The following code snippet provides an example to read from an Azure Data Lake Storage Gen2 data source by using Service Principal credentials:

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
//Define the data frame to interface with the data source.
val df:DataFrame = spark.
            read.
            options(dfReadOptions).
            csv(pathToInputSource).
            limit(100)
```

#### DataFrame write SaveMode support

The following SaveModes are supported when writing source data to a destination table in Azure Synapse Dedicated SQL Pool:

* ErrorIfExists (default save mode)
  * If a destination table exists, the write is aborted with an exception returned to the callee. Else, a new table is created with data from the staging folders.
* Ignore
  * If the destination table exists, the write ignores the write request without returning an error. Else, a new table is created with data from the staging folders.
* Overwrite
  * If the destination table exists, the existing data in the destination is replaced with data from the staging folders. Else, a new table is created with data from the staging folders.
* Append
  * If the destination table exists, the new data is appended to it. Else, a new table is created with data from the staging folders.
  
#### Write request callback handle

The new write path API changes introduced an experimental feature to provide the client with a key-value map of post-write metrics. These metrics provide information like the number of records staged to the number of records written to a SQL table. They can also include information on the time spent in staging and executing the SQL statements to write data to Azure Synapse Dedicated SQL Pool.

The new write path API changes introduced an experimental feature to provide the client with a key-value map of post-write metrics. Keys for the metrics are defined in the new object definition `Constants.FeedbackConstants`. Metrics can be retrieved as a JSON string by passing in the callback handle, for example, `Scala Function`. The following snippet is the function signature:

```Scala
//Function signature is expected to have two arguments, a `scala.collection.immutable.Map[String, Any]` and an Option[Throwable].
//Post-write if there's a reference of this handle passed to the `synapsesql` signature, it will be invoked by the closing process.
//These arguments will have valid objects in either a Success or Failure case. In the case of Failure, the second argument will be a `Some(Throwable)`.
(Map[String, Any], Option[Throwable]) => Unit
```

The following notable metrics are presented with internal capitalization:

* `WriteFailureCause`
* `DataStagingSparkJobDurationInMilliseconds`
* `NumberOfRecordsStagedForSQLCommit`
* `SQLStatementExecutionDurationInMilliseconds`
* `rows_processed`

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

### Read from Azure Synapse Dedicated SQL Pool

The following sections relate to a read scenario.

#### Read request: synapsesql method signature

```Scala
synapsesql(tableName:String) => org.apache.spark.sql.DataFrame
```

#### Read using Azure AD-based authentication

```Scala
//Use case is to read data from an internal table in an Azure Synapse Dedicated SQL Pool database.
//Azure Active Directory-based authentication approach is preferred here.
import org.apache.spark.sql.DataFrame
import com.microsoft.spark.sqlanalytics.utils.Constants
import org.apache.spark.sql.SqlAnalyticsConnector._

//Read from the existing internal table.
val dfToReadFromTable:DataFrame = spark.read.
    //If `Constants.SERVER` is not provided, the `<database_name>` from the three-part table name argument 
    //to `synapsesql` method is used to infer the Synapse Dedicated SQL endpoint.
    option(Constants.SERVER, "<sql-server-name>.sql.azuresynapse.net").
    //Defaults to storage path defined in the runtime configurations (See section on Configuration Options above).
    option(Constants.TEMP_FOLDER, "abfss://<container_name>@<storage_account_name>.dfs.core.windows.net/<some_base_path_for_temporary_staging_folders>").
    //Three-part table name from where data will be read.
    synapsesql("<database_name>.<schema_name>.<table_name>").
    //Column-pruning i.e., query select column values.
    select("<some_column_1>", "<some_column_5>", "<some_column_n>"). 
    //Push-down filter criteria that gets translated to SQL Push-down Predicates.    
    filter(col("Title").startsWith("E")).
    //Fetch a sample of 10 records 
    limit(10)

//Show contents of the DataFrame.
dfToReadFromTable.show()
```

#### Read using Basic Authentication

```Scala
//Use case is to read data from an internal table in an Azure Synapse Dedicated SQL Pool database.
//Azure Active Directory-based authentication approach is preferred here.
import org.apache.spark.sql.DataFrame
import com.microsoft.spark.sqlanalytics.utils.Constants
import org.apache.spark.sql.SqlAnalyticsConnector._

//Read from an existing internal table.
val dfToReadFromTable:DataFrame = spark.read.
    //If `Constants.SERVER` is not provided, the `<database_name>` from the three-part table name argument 
    //to `synapsesql` method is used to infer the Synapse Dedicated SQL endpoint.
    option(Constants.SERVER, "<sql-server-name>.sql.azuresynapse.net").
    //Set database user name.
    option(Constants.USER, "<user_name>").
    //Set user's password to the database.
    option(Constants.PASSWORD, "<user_password>").
    //Set name of the data source definition that is defined with database-scoped credentials.
    //Data extracted from the SQL query will be staged to the storage path defined on the data source's location setting.
    option(Constants.DATA_SOURCE, "<data_source_name>").
    //Three-part table name from where data will be read.
    synapsesql("<database_name>.<schema_name>.<table_name>").
    //Column pruning, for example, query select column values.
    select("<some_column_1>", "<some_column_5>", "<some_column_n>").
    //Push-down filter criteria that gets translated to SQL push-down predicates.    
    filter(col("Title").startsWith("E")).
    //Fetch a sample of 10 records.
    limit(10)

//Show contents of the DataFrame.
dfToReadFromTable.show()
```

### More code samples

This section includes some other code samples.

#### Use the connector with other language preferences

This example demonstrates how to use the connector with the `PySpark (Python)` language preference:

```Python
%%spark

import org.apache.spark.sql.DataFrame
import com.microsoft.spark.sqlanalytics.utils.Constants
import org.apache.spark.sql.SqlAnalyticsConnector._

//Code to write or read goes here (refer to the aforementioned code templates).

```

#### Use materialized data across cells

Spark DataFrame's `createOrReplaceTempView` can be used to access data fetched in another cell by registering a temporary view.

* Cell where data is fetched (say with notebook language preference as `Scala`):
    
    ```Scala
        //Necessary imports
        import org.apache.spark.sql.DataFrame
        import org.apache.spark.sql.SaveMode
        import com.microsoft.spark.sqlanalytics.utils.Constants
        import org.apache.spark.sql.SqlAnalyticsConnector._
        
        //Configure options and read from Azure Synapse Dedicated SQL Pool.
        val readDF = spark.read.
            //Set Synapse Dedicated SQL endpoint name.
            option(Constants.SERVER, "<synapse-dedicated-sql-end-point>.sql.azuresynapse.net").
            //Set database user name.
            option(Constants.USER, "<user_name>").
            //Set database user's password. 
            option(Constants.PASSWORD, "<user_password>").
            //Set name of the data source definition that is defined with database scoped credentials.
            option(Constants.DATA_SOURCE,"<data_source_name>").
            //Set the three-part table name from which the read must be performed.
            synapsesql("<database_name>.<schema_name>.<table_name>").
            //Optional - specify number of records the DataFrame would read.
            limit(10)
        //Register the temporary view (scope - current active Spark Session)
        readDF.createOrReplaceTempView("<temporary_view_name>")
    ```

* Now, change the language preference on the notebook to `PySpark (Python)` and fetch data from the registered view `<temporary_view_name>`:

    ```Python
        spark.sql("select * from <temporary_view_name>").show()
    ```

## Response handling

Invoking `synapsesql` has two possible end states that are either success or fail. This section describes how to handle the request response for each scenario.

### Read request response

Upon completion, the read response snippet is displayed in the cell's output. Failure in the current cell also cancels subsequent cell executions. Detailed error information is available in the Spark application logs.

### Write request response

By default, a write response is printed to the cell output. On failure, the current cell is marked as failed, and subsequent cell executions are aborted. The other approach is to pass the [callback handle](#write-request-callback-handle) option to the `synapsesql` method. The callback handle provides programmatic access to the write response.

## Things to note

Consider the following points on read and write performance:

* When writing to Azure Synapse Dedicated SQL Pool tables:
  * For internal table types:
    * Tables are created with ROUND_ROBIN data distribution.
    * Column types are inferred from the DataFrame that would read data from the source. String columns are mapped to `NVARCHAR(4000)`.
  * For external table types:
    * The DataFrame's initial parallelism drives the data organization for the external table.
    * Column types are inferred from the DataFrame that would read data from the source.
  * Better data distribution across executors can be achieved by tuning the `spark.sql.files.maxPartitionBytes` and the DataFrame's `repartition` parameter.
  * When writing large datasets, factor in the impact of [DWU Performance Level](../../synapse-analytics/sql-data-warehouse/quickstart-scale-compute-portal.md) setting that limits [transaction size](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-develop-transactions.md#transaction-size).
* When reading from Azure Synapse Dedicated SQL Pool tables:
  * Consider applying necessary filters on the DataFrame to take advantage of the connector's column-pruning feature.
  * The read scenario doesn't support the `TOP(n-rows)` clause when framing the `SELECT` query statements. The choice to limit data is to use the DataFrame's limit(.) clause.
    * Refer to the example [Use materialized data across cells](#use-materialized-data-across-cells) section.
* Monitor [Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-best-practices.md) utilization trends to spot throttling behaviors that can [affect](../../storage/common/scalability-targets-standard-account.md) read and write performance.

## References

* [Runtime library versions](../../synapse-analytics/spark/apache-spark-3-runtime.md)
* [Azure Storage](../../storage/blobs/data-lake-storage-introduction.md)
* [Dedicated SQL pool](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md)

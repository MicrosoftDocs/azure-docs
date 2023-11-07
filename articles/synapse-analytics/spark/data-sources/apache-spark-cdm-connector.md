---
title: Spark Common Data Model connector for Azure Synapse Analytics
description: Learn how to use the Spark CDM connector in Azure Synapse Analytics to read and write Common Data Model entities in a Common Data Model folder on Azure Data Lake Storage.
services: synapse-analytics 
ms.author: AvinandaC
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: spark
ms.date: 02/03/2023
author: AvinandaMS
---

# Spark Common Data Model connector for Azure Synapse Analytics

The Spark Common Data Model connector (Spark CDM connector) is a format reader/writer in Azure Synapse Analytics. It enables a Spark program to read and write Common Data Model entities in a Common Data Model folder via Spark DataFrames.

For information on defining Common Data Model documents by using Common Data Model 1.2, see [this article about what Common Data Model is and how to use it](/common-data-model/).

## Capabilities

At a high level, the connector supports:

* 3.1, and 3.2., and 3.3.
* Reading data from an entity in a Common Data Model folder into a Spark DataFrame.
* Writing from a Spark DataFrame to an entity in a Common Data Model folder based on a Common Data Model entity definition.
* Writing from a Spark DataFrame to an entity in a Common Data Model folder based on the DataFrame schema.

The connector also supports:

* Reading and writing to Common Data Model folders in Azure Data Lake Storage with a hierarchical namespace (HNS) enabled.
* Reading from Common Data Model folders described by either manifest or *model.json* files.
* Writing to Common Data Model folders described by a manifest file.
* Data in CSV format with or without column headers, and with user-selectable delimiter characters.
* Data in Apache Parquet format, including nested Parquet.
* Submanifests on read, and optional use of entity-scoped submanifests on write.
* Writing data via user-modifiable partition patterns.
* Use of managed identities and credentials in Azure Synapse Analytics.
* Resolving Common Data Model alias locations used in imports via Common Data Model adapter definitions described in a *config.json* file.

## Limitations

The connector doesn't support the following capabilities and scenarios:

* Parallel writes. We don't recommend them. There's no locking mechanism at the storage layer.
* Programmatic access to entity metadata after you read an entity.
* Programmatic access to set or override metadata when you're writing an entity.
* Schema drift, where data in a DataFrame that's being written includes extra attributes not included in the entity definition.
* Schema evolution, where entity partitions reference different versions of the entity definition. You can verify the version by running `com.microsoft.cdm.BuildInfo.version`.
* Write support for *model.json*.
* Writing `Time` data to Parquet. Currently, the connector supports overriding a time stamp column to be interpreted as a Common Data Model `Time` value rather than a `DateTime` value for CSV files only.
* The Parquet `Map` type, arrays of primitive types, and arrays of array types. Common Data Model doesn't currently support them, so neither does the Spark CDM connector.

## Samples

To start using the connector, check out the [sample code and Common Data Model files](https://github.com/Azure/spark-cdm-connector/tree/spark3.2/samples).

## Reading data

When the connector reads data, it uses metadata in the Common Data Model folder to create the DataFrame based on the resolved entity definition for the specified entity, as referenced in the manifest. The connector uses entity attribute names as DataFrame column names. It maps attribute data types to column data types. When the DataFrame is loaded, it's populated from the entity partitions identified in the manifest.

The connector looks in the specified manifest and any first-level submanifests for the specified entity. If the required entity is in a second-level or lower submanifest, or if there are multiple entities of the same name in different submanifests, you should specify the submanifest that contains the required entity rather than the root manifest.

Entity partitions can be in a mix of formats (for example, CSV and Parquet). All the entity data files identified in the manifest are combined into one dataset regardless of format and loaded to the DataFrame.

When the connector reads CSV data, it uses the Spark `failfast` option by default. If the number of columns isn't equal to the number of attributes in the entity, the connector returns an error.

Alternatively, as of 0.19, the connector supports permissive mode (only for CSV files). With permissive mode, when a CSV row has a lower number of columns than the entity schema, the connector assigns null values for the missing columns. When a CSV row has more columns than the entity schema, the columns greater than the entity schema column count are truncated to the schema column count. Usage is as follows:

```scala
.option("mode", "permissive") or .option("mode", "failfast")
```

## Writing data

When the connector writes to a Common Data Model folder, if the entity doesn't already exist in that folder, the connector creates a new entity and definition. It adds the entity and definition to the Common Data Model folder and references them in the manifest.

The connector supports two writing modes:

* **Explicit write**: The physical entity definition is based on a logical Common Data Model entity definition that you specify.

  The connector reads and resolves the specified logical entity definition to create the physical entity definition used in the Common Data Model folder. If import statements in any directly or indirectly referenced Common Data Model definition file include aliases, you must provide a *config.json* file that maps these aliases to Common Data Model adapters and storage locations.
  * If the DataFrame schema doesn't match the referenced entity definition, the connector returns an error. Ensure that the column data types in the DataFrame match the attribute data types in the entity, including for decimal data, precision, and scale set via traits in Common Data Model.
  * If the DataFrame is inconsistent with the entity definition, the connector returns an error.
  * If the DataFrame is consistent:
    * If the entity already exists in the manifest, the connector resolves the provided entity definition and validates it against the definition in the Common Data Model folder. If the definitions don't match, the connector returns an error. Otherwise, the connector writes data and updates the partition information in the manifest.
    * If the entity doesn't exist in the Common Data Model folder, the connector writes a resolved copy of the entity definition to the manifest in the Common Data Model folder. The connector writes data and updates the partition information in the manifest.

* **Implicit write**: The entity definition is derived from the DataFrame structure.

  * If the entity doesn't exist in the Common Data Model folder, the connector uses the implicit definition to create the resolved entity definition in the target Common Data Model folder.
  * If the entity exists in the Common Data Model folder, the connector validates the implicit definition against the existing entity definition. If the definitions don't match, the connector returns an error. Otherwise, the connector writes data, and it writes derived logical entity definitions into a subfolder of the entity folder.

    The connector writes data to data folders within an entity subfolder. A save mode determines whether the new data overwrites or is appended to existing data, or an error is returned if data exists. The default is to return an error if data already exists.

## Common Data Model alias integration

Common Data Model definition files use aliases in import statements to simplify the import statements and allow the location of the imported content to be late bound at runtime. Using aliases:

* Facilitates easy organization of Common Data Model files so that related Common Data Model definitions can be grouped together at different locations.
* Allows Common Data Model content to be accessed from different deployed locations at runtime.

The following snippet shows the use of aliases in import statements in a Common Data Model definition file:

```Scala
"imports": [  
{     
  "corpusPath": "cdm:/foundations.cdm.json"
},  
{       
  "corpusPath": "core:/TrackedEntity.cdm.json"  
},  
{      
  "corpusPath": "Customer.cdm.json"  
} 
]
```

The preceding example uses `cdm` as an alias for the location of the Common Data Model foundations file. It uses `core` as an alias for the location of the `TrackedEntity` definition file.

Aliases are text labels that are matched to a namespace value in an adapter entry in a Common Data Model *config.json* file. An adapter entry specifies the adapter type (for example, `adls`, `CDN`, `GitHub`, or `local`) and a URL that defines a location. Some adapters support other configuration options, such as a connection timeout. Whereas aliases are arbitrary text labels, the `cdm` alias is treated in a special way.

The Spark CDM connector looks in the entity definition's model root location for the *config.json* file to load. If the *config.json* file is at some other location or you want to override the *config.json* file in the model root, you can provide the location of a *config.json* file by using the `configPath` option. The *config.json* file must contain adapter entries for all the aliases used in the Common Data Model code that's being resolved, or the connector reports an error.

The ability to override the *config.json* file means that you can provide runtime-accessible locations for Common Data Model definitions. Ensure that the content that's referenced at runtime is consistent with the definitions that were used when Common Data Model was originally authored.

By convention, the `cdm` alias refers to the location of the root-level standard Common Data Model definitions, including the *foundations.cdm.json* file. This file includes the Common Data Model primitive data types and a core set of trait definitions required for most Common Data Model entity definitions.

You can resolve the `cdm` alias like any other alias, by using an adapter entry in the *config.json* file. If you don't specify an adapter or you provide a null entry, the `cdm` alias is resolved by default to the Common Data Model public content delivery network (CDN) at `https://cdm-schema.microsoft.com/logical/`.

You can also use the `cdmSource` option to override how the `cdm` alias is resolved. Using the `cdmSource` option is useful if the `cdm` alias is the only alias used in the Common Data Model definitions that are being resolved, because it can avoid the need to create or reference a *config.json* file.

## Parameters, options, and save mode

For both reads and writes, you provide the Spark CDM connector's library name as a parameter. You use a set of options to parameterize the behavior of the connector. When you're writing, the connector also supports a save mode.

The connector library name, options, and save mode are formatted as follows:

* `dataframe.read.format("com.microsoft.cdm") [.option("option", "value")]*`
* `dataframe.write.format("com.microsoft.cdm") [.option("option", "value")]* .mode(savemode.\<saveMode\>)`

Here's an example that shows some of the options in using the connector for reads:

```scala
val readDf = spark.read.format("com.microsoft.cdm")
  .option("storage", "mystorageaccount.dfs.core.windows.net")
  .option("manifestPath", "customerleads/default.manifest.cdm.json")
  .option("entity", "Customer")
  .load()
```

### Common read and write options

The following options identify the entity in the Common Data Model folder that you're reading or writing to.

|**Option**  |**Description**  |**Pattern and example usage**  |
|---------|---------|:---------:|
|`storage`|The endpoint URL for the Azure Data Lake Storage account, with HNS enabled, that contains the Common Data Model folder. <br/>Use the `dfs.core.windows.net` URL. | `<accountName>.dfs.core.windows.net` `"myAccount.dfs.core.windows.net"`|
|`manifestPath`|The relative path to the manifest or *model.json* file in the storage account. For reads, it can be a root manifest or a submanifest or a *model.json* file. For writes, it must be a root manifest.|`<container>/{<folderPath>}<manifestFileName>`, <br/>`"mycontainer/default.manifest.cdm.json"` `"models/hr/employees.manifest.cdm.json"` <br/> `"models/hr/employees/model.json"` (read only)|
|`entity`| The name of the source or target entity in the manifest. When you're writing an entity for the first time in a folder, the connector gives the resolved entity definition this name. The entity name is case sensitive.| `<entityName>` <br/>`"customer"`|
|`maxCDMThreads`| The maximum number of concurrent reads while the connector resolves an entity definition. | Any valid integer, such as `5`|

> [!NOTE]
> You no longer need to specify a logical entity definition in addition to the physical entity definition in the Common Data Model folder on read.

### Explicit write options

The following options identify the logical entity definition for the entity that's being written. The logical entity definition is resolved to a physical definition that defines how the entity is written.

|**Option**  |**Description**  |**Pattern or example usage**  |
|---------|---------|:---------:|
|`entityDefinitionStorage` |The Azure Data Lake Storage account that contains the entity definition. Required if it's different from the storage account that hosts the Common Data Model folder.|`<accountName>.dfs.core.windows.net`<br/>`"myAccount.dfs.core.windows.net"`|
|`entityDefinitionModelRoot`|The location of the model root or corpus within the account. |`<container>/<folderPath>` <br/> `"crm/core"`|
|`entityDefinitionPath`|The location of the entity. It's the file path to the Common Data Model definition file relative to the model root, including the name of the entity in that file.|`<folderPath>/<entityName>.cdm.json/<entityName>`<br/>`"sales/customer.cdm.json/customer"`|
`configPath`| The container and folder path to a *config.json* file that contains the adapter configurations for all aliases included in the entity definition file and any directly or indirectly referenced Common Data Model files. <br/><br/>This option is not required if *config.json* is in the model root folder.| `<container><folderPath>`|
|`useCdmStandardModelRoot` | Indicates that the model root is located at [https://cdm-schema.microsoft.com/CDM/logical/](https://github.com/microsoft/CDM/tree/master/schemaDocuments). Used to reference entity types defined in the Common Data Model CDN. Overrides `entityDefinitionStorage` and `entityDefinitionModelRoot` (if specified).<br/>| `"useCdmStandardModelRoot"` |
|`cdmSource`|Defines how the `cdm` alias (if it's present in Common Data Model definition files) is resolved. If you use this option, it overrides any `cdm` adapter specified in the *config.json* file. Values are `builtin` or `referenced`. The default value is `referenced`.<br/><br/> If you set this option to `referenced`, the connector uses the latest published standard Common Data Model definitions at `https://cdm-schema.microsoft.com/logical/`. If you set this option to `builtin`, the connector uses the Common Data Model base definitions built in to the Common Data Model object model that the connector is using. <br/><br/> Note: <br/> * The Spark CDM connector might not be using the latest Common Data Model SDK, so it might not contain the latest published standard definitions. <br/> * The built-in definitions include only the top-level Common Data Model content, such as *foundations.cdm.json* or *primitives.cdm.json*. If you want to use lower-level standard Common Data Model definitions, either use `referenced` or include a `cdm` adapter in *config.json*.| `"builtin"`\|`"referenced"` |

In the preceding example, the full path to the customer entity definition object is `https://myAccount.dfs.core.windows.net/models/crm/core/sales/customer.cdm.json/customer`. In that path, *models* is the container in Azure Data Lake Storage.

### Implicit write options

If you don't specify a logical entity definition on write, the entity is written implicitly, based on the DataFrame schema.

When you're writing implicitly, a time stamp column is normally interpreted as a Common Data Model `DateTime` data type. You can override this interpretation to create an attribute of the Common Data Model `Time` data type by providing a metadata object that's associated with the column that specifies the data type. For details, see [Handling Common Data Model time data](#handling-common-data-model-time-data) later in this article.

Support for writing time data exists for CSV files only. That support currently doesn't extend to Parquet.

### Folder structure and data format options

You can use the following options to change folder organization and file format.

|**Option**  |**Description**  |**Pattern or example usage**  |
|---------|---------|:---------:|
|`useSubManifest`|If `true`, causes the target entity to be included in the root manifest via a submanifest. The submanifest and the entity definition are written into an entity folder beneath the root. Default is `false`.|`"true"`\|`"false"` |
|`format`|Defines the file format. Current supported file formats are CSV and Parquet. Default is `csv`.|`"csv"`\|`"parquet"` <br/> |
|`delimiter`|CSV only. Defines the delimiter that you're using. Default is comma. | `"|"` |
|`columnHeaders`| CSV only. If `true`, adds a first row to data files with column headers. Default is `true`.|`"true"`\|`"false"`|
|`compression`|Write only. Parquet only. Defines the compression format that you're using. Default is `snappy`. |`"uncompressed"` \| `"snappy"` \| `"gzip"` \| `"lzo"` |
|`dataFolderFormat`|Allows a user-definable data folder structure within an entity folder. Allows you to substitute date and time values into folder names by using `DateTimeFormatter` formatting. Non-formatter content must be enclosed in single quotation marks. Default format is `"yyyy"-"MM"-"dd"`, which produces folder names like *2020-07-30*.| `year "yyyy" / month "MM"` <br/> `"Data"`|

### Save mode

The save mode specifies how the connector handles existing entity data in the Common Data Model folder when you're writing a DataFrame. Options are to overwrite, append to, or return an error if data already exists. The default save mode is `ErrorIfExists`.

|**Mode**|**Description**|
|---------|---------|
|`SaveMode.Overwrite` |Overwrites the existing entity definition if it's changed and replaces existing data partitions with the data partitions that are being written.|
|`SaveMode.Append` |Appends data that's being written in new partitions alongside the existing partitions.<br/><br/>This mode doesn't support changing the schema. If the schema of the data that's being written is incompatible with the existing entity definition, the connector throws an error.|
|`SaveMode.ErrorIfExists`|Returns an error if partitions already exist.|

For details of how data files are named and organized on write, see the [Folder and file naming and organization](#naming-and-organization-of-folders-and-files) section later in this article.

## Authentication

You can use three modes of authentication with the Spark CDM connector to read or write the Common Data Model metadata and data partitions: credential passthrough, shared access signature (SAS) token, and app registration.

### Credential passthrough

In Azure Synapse Analytics, the Spark CDM connector supports the use of [managed identities for Azure resources](../../../active-directory/managed-identities-azure-resources/overview.md) to mediate access to the Azure Data Lake Storage account that contains the Common Data Model folder. A managed identity is [automatically created for every Azure Synapse Analytics workspace](/cli/azure/synapse/workspace/managed-identity). The connector uses the managed identity of the workspace that contains the notebook in which the connector is called to authenticate to the storage accounts.

You must ensure that the chosen identity has access to the appropriate storage accounts:

* Grant Storage Blob Data Contributor permissions to allow the library to write to Common Data Model folders.
* Grant Storage Blob Data Reader permissions to allow only read access.

In both cases, no extra connector options are required.

### Options for SAS token-based access control

SAS token credentials are an extra option for authentication to storage accounts. With SAS token authentication, the SAS token can be at the container or folder level. The appropriate permissions are required:

* Read permissions for a manifest or partition need only read-level support.
* Write permissions need both read and write support.

| **Option**  |**Description**  |**Pattern and example usage**  |
|----------|---------|:---------:|
| `sasToken` |The SAS token to access the relative storage account with the correct permissions | `<token>`|

### Options for credential-based access control

As an alternative to using a managed identity or a user identity, you can provide explicit credentials to enable the Spark CDM connector to access data. In Microsoft Entra ID, [create an app registration](../../../active-directory/develop/quickstart-register-app.md). Then grant this app registration access to the storage account by using either of the following roles:

* Storage Blob Data Contributor to allow the library to write to Common Data Model folders
* Storage Blob Data Reader to allow only read permissions

After you create permissions, you can pass the app ID, app key, and tenant ID to the connector on each call to it by using the following options. We recommend that you use Azure Key Vault to store these values to ensure that they aren't stored in clear text in your notebook file.

| **Option**   |**Description**  |**Pattern and example usage**  |
|----------|---------|:---------:|
| `appId` | The app registration ID for authentication to the storage account | `<guid>` |
| `appKey` | The registered app key or secret | `<encrypted secret>` |
| `tenantId` | The Microsoft Entra tenant ID under which the app is registered | `<guid>` |

## Examples

The following examples all use `appId`, `appKey`, and `tenantId` variables. You initialized these variables earlier in the code, based on an Azure app registration: Storage Blob Data Contributor permissions on the storage for write, and Storage Blob Data Reader permissions for read.

### Read

This code reads the `Person` entity from the Common Data Model folder with a manifest in `mystorage.dfs.core.windows.net/cdmdata/contacts/root.manifest.cdm.json`:

```scala
val df = spark.read.format("com.microsoft.cdm")
 .option("storage", "mystorage.dfs.core.windows.net")
 .option("manifestPath", "cdmdata/contacts/root.manifest.cdm.json")
 .option("entity", "Person")
 .load()
```

### Implicit write by using a DataFrame schema only

The following code writes the `df` DataFrame to a Common Data Model folder with a manifest to `mystorage.dfs.core.windows.net/cdmdata/Contacts/default.manifest.cdm.json` with an event entity.

The code writes event data as Parquet files, compresses it with `gzip`, and appends it to the folder. (The code adds new files without deleting existing files.)

```scala

df.write.format("com.microsoft.cdm")
 .option("storage", "mystorage.dfs.core.windows.net")
 .option("manifestPath", "cdmdata/Contacts/default.manifest.cdm.json")
 .option("entity", "Event")
 .option("format", "parquet")
 .option("compression", "gzip")
 .mode(SaveMode.Append)
 .save()
```

### Explicit write by using an entity definition stored in Data Lake Storage

The following code writes the `df` DataFrame to a Common Data Model folder with a manifest at
`https://_mystorage_.dfs.core.windows.net/cdmdata/Contacts/root.manifest.cdm.json` with the `Person` entity. The code writes person data as new CSV files (by default) that overwrite existing files in the folder.

The code retrieves the `Person` entity definition from
`https://_mystorage_.dfs.core.windows.net/models/cdmmodels/core/Contacts/Person.cdm.json`.

```scala
df.write.format("com.microsoft.cdm")
 .option("storage", "mystorage.dfs.core.windows.net")
 .option("manifestPath", "cdmdata/contacts/root.manifest.cdm.json")
 .option("entity", "Person")
 .option("entityDefinitionModelRoot", "cdmmodels/core")
 .option("entityDefinitionPath", "/Contacts/Person.cdm.json/Person")
 .mode(SaveMode.Overwrite)
 .save()
```

### Explicit write by using an entity defined in the Common Data Model GitHub repo

The following code writes the `df` DataFrame to a Common Data Model folder with:

* The manifest at `https://_mystorage_.dfs.core.windows.net/cdmdata/Teams/root.manifest.cdm.json`.
* A submanifest that contains the `TeamMembership` entity that's created in a *TeamMembership* subdirectory.

`TeamMembership` data is written to CSV files (the default) that overwrite any existing data files. The code retrieves the `TeamMembership` entity definition from the Common Data Model CDN at
[https://cdm-schema.microsoft.com/logical/core/applicationCommon/TeamMembership.cdm.json](https://cdm-schema.microsoft.com/logical/core/applicationCommon/TeamMembership.cdm.json).

```scala
df.write.format("com.microsoft.cdm")
 .option("storage", "mystorage.dfs.core.windows.net")
 .option("manifestPath", "cdmdata/Teams/root.manifest.cdm.json")
 .option("entity", "TeamMembership")
 .option("useCdmStandardModelRoot", true)
 .option("entityDefinitionPath", "core/applicationCommon/TeamMembership.cdm.json/TeamMembership")
 .option("useSubManifest", true)
 .mode(SaveMode.Overwrite)
 .save()
```

## Other considerations

### Mapping data types from Spark to Common Data Model

The connector applies the following data type mappings when you convert Common Data Model to or from Spark.

|**Spark**|**Common Data Model**|
|---------|---------|
|`ShortType`|`SmallInteger`|
|`IntegerType`|`Integer`|
|`LongType` |`BigInteger`|
|`DateType` |`Date`|
|`Timestamp`|`DateTime` (optionally `Time`)|
|`StringType`|`String`|
|`DoubleType`|`Double`|
|`DecimalType(x,y)`|`Decimal (x,y)` (default scale and precision are `18,4`)|
|`FloatType`|`Float`|
|`BooleanType`|`Boolean`|
|`ByteType`|`Byte`|

The connector doesn't support the Common Data Model `Binary` data type.

### Handling Common Data Model Date, DateTime, and DateTimeOffset data

The Spark CDM connector handles Common Data Model `Date` and `DateTime` data types as normal for Spark and Parquet. In CSV, the connector reads and writes those data types in ISO 8601 format.

The connector interprets Common Data Model `DateTime` data type values as UTC. In CSV, the connector writes those values in ISO 8601 format. An example is `2020-03-13 09:49:00Z`.

Common Data Model `DateTimeOffset` values intended for recording local time instants are handled differently in Spark and Parquet from CSV. CSV and other formats can express a local time instant as a structure that comprises a datetime, such as `2020-03-13 09:49:00-08:00`. Parquet and Spark don't support such structures. Instead, they use a `TIMESTAMP` data type that allows an instant to be recorded in UTC (or in an unspecified time zone).

The Spark CDM connector converts a `DateTimeOffset` value in CSV to a UTC time stamp. This value is persisted as a time stamp in Parquet. If the value is later persisted to CSV, it will be serialized as a `DateTimeOffset` value with a +00:00 offset. There's no loss of temporal accuracy. The serialized values represent the same instant as the original values, although the offset is lost.

Spark systems use their system time as the baseline and normally express time by using that local time. UTC times can always be computed through application of the local system offset. For Azure systems in all regions, the system time is always UTC, so all time stamp values are normally in UTC. When you're using an implicit write, where a Common Data Model definition is derived from a DataFrame, time stamp columns are translated to attributes with the Common Data Model `DateTime` data type, which implies a UTC time.

If it's important to persist a local time and the data will be processed in Spark or persisted in Parquet, we recommend that you use a `DateTime` attribute and keep the offset in a separate attribute. For example, you can keep the offset as a signed integer value that represents minutes. In Common Data Model, DateTime values are in UTC, so you must apply the offset to compute local time.

In most cases, persisting local time isn't important. Local times are often required only in a UI for user convenience and based on the user's time zone, so not storing a UTC time is often a better solution.

### Handling Common Data Model time data

Spark doesn't support an explicit `Time` data type. An attribute with the Common Data Model `Time` data type is represented in a Spark DataFrame as a column with a `Timestamp` data type. When The Spark CDM connector reads a time value, the time stamp in the DataFrame is initialized with the Spark epoch date 01/01/1970 plus the time value as read from the source.

When you use explicit write, you can map a time stamp column to either a `DateTime` or `Time` attribute. If you map a time stamp to a `Time` attribute, the date portion of the time stamp is stripped off.

When you use implicit write, a time stamp column is mapped by default to a `DateTime` attribute. To map a time stamp column to a `Time` attribute, you must add a metadata object to the column in the DataFrame that indicates that the time stamp should be interpreted as a time value. The following code shows how to do this in Scala:

```scala
val md = new MetadataBuilder().putString(“dataType”, “Time”)
val schema = StructType(List(
StructField(“ATimeColumn”, TimeStampType, true, md))

```

### Time value accuracy

The Spark CDM connector supports time values in either `DateTime` or `Time`. Seconds have up to six decimal places, based on the format of the data in the file that's being read (CSV or Parquet) or as defined in the DataFrame. The use of six decimal places enables accuracy from single seconds to microseconds.

### Naming and organization of folders and files

When you're writing to Common Data Model folders, there's a default folder organization. By default, data files are written into folders created for the current date, named like *2010-07-31*. You can customize the folder structure and names by using the `dateFolderFormat` option.

Data file names are based on the following pattern: \<entity\>-\<jobid\>-*.\<fileformat\>.

You can control the number of data partitions that are written by using the `sparkContext.parallelize()` method. The number of partitions is either determined by the number of executors in the Spark cluster or specified explicitly. The following Scala example creates a DataFrame with two partitions:

```scala
val df= spark.createDataFrame(spark.sparkContext.parallelize(data, 2), schema)
```

Here's an example of an explicit write that's defined by a referenced entity definition:

```text
+-- <CDMFolder>
     |-- default.manifest.cdm.json     << with entity reference and partition info
     +-- <Entity>
          |-- <entity>.cdm.json        << resolved physical entity definition
          |-- <data folder>
          |-- <data folder>
          +-- ...                            
 ```

Here's an example of an explicit write with a submanifest:

```text
+-- <CDMFolder>
    |-- default.manifest.cdm.json       << contains reference to submanifest
    +-- <Entity>
         |-- <entity>.cdm.json
         |-- <entity>.manifest.cdm.json << submanifest with partition info
         |-- <data folder>
         |-- <data folder>
         +-- ...
```

Here's an example of an implicit write in which the entity definition is derived from a DataFrame schema:

```text
+-- <CDMFolder>
    |-- default.manifest.cdm.json
    +-- <Entity>
         |-- <entity>.cdm.json          << resolved physical entity definition
         +-- LogicalDefinition
         |   +-- <entity>.cdm.json      << logical entity definitions
         |-- <data folder>
         |-- <data folder>
         +-- ...
```

Here's an example of an implicit write with a submanifest:

```text
+-- <CDMFolder>
    |-- default.manifest.cdm.json       << contains reference to submanifest
    +-- <Entity>
        |-- <entity>.cdm.json           << resolved physical entity definition
        |-- <entity>.manifest.cdm.json  << submanifest with reference to the entity and partition info
        +-- LogicalDefinition
        |   +-- <entity>.cdm.json       << logical entity definitions
        |-- <data folder>
        |-- <data folder>
        +-- ...
```

## Troubleshooting and known issues

* Ensure that the decimal precision and scale of decimal data type fields that you use in the DataFrame match the data type that's in the Common Data Model entity definition. If the precision and scale aren't defined explicitly in Common Data Model, the default is `Decimal(18,4)`. For *model.json* files, `Decimal` is assumed to be `Decimal(18,4)`.
* Folder and file names in the following options shouldn't include spaces or special characters, such as an equal sign (=): `manifestPath`, `entityDefinitionModelRoot`, `entityDefinitionPath`, `dataFolderFormat`.

## Next steps

You can now look at the other Apache Spark connectors:

* [Apache Spark Kusto connector](apache-spark-kusto-connector.md)
* [Apache Spark SQL connector](apache-spark-sql-connector.md)

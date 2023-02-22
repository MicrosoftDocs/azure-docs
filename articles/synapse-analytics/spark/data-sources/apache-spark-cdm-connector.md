---
title: Spark CDM connector in Azure Synapse Analytics
description: Learn how to use the Spark CDM connector in Azure Synapse Analytics to read and write Common Data Model entities in a folder on Azure Data Lake Storage.
services: synapse-analytics 
ms.author: AvinandaC
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: spark
ms.date: 02/03/2023
author: AvinandaMS
---

# Spark CDM connector for Azure Synapse Analytics

The Spark Common Data Model connector (Spark CDM connector) is a format reader/writer in Azure Synapse Analytics. It enables a Spark program to read and write Common Data Model entities in a folder via Spark dataframes.

For information on defining Common Data Model documents by using Common Data Model 1.2, see [this article about what Common Data Model is and how to use it](/common-data-model/).

## Capabilities

At a high level, the connector supports:

* Spark 2.4, 3.1, and 3.2.
* Reading data from an entity in a Common Data Model into a Spark dataframe.
* Writing from a Spark dataframe to an entity in a Common Data Model .folder based on a Common Data Model entity definition.
* Writing from a Spark dataframe to an entity in a Common Data Model folder based on the dataframe schema.

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

> [!TIP]
> You can verify the Spark CDM connector version by running `com.microsoft.cdm.BuildInfo.version`.

## Limitations

The following scenarios aren't supported:

* Parallel writes. We don't recommend them. There is no locking mechanism at the storage layer.
* Programmatic access to entity metadata after reading an entity.
* Programmatic access to set or override metadata when writing an entity.
* Schema drift, where data in a dataframe that's being written includes extra attributes not included in the entity definition.
* Schema evolution, where entity partitions reference different versions of the entity definition.
* Write support for *model.json*.

## Samples

To start using the connector, check out the [sample code and Common Data Model files](https://github.com/Azure/spark-cdm-connector/tree/spark3.2/samples).

## Reading data

When the connector reads data, it uses metadata in the Common Data Model folder to create the dataframe based on the resolved entity definition for the specified entity, as referenced in the manifest. The connector uses entity attribute names as dataframe column names. It maps attribute data types to column data types. When the dataframe is loaded, it's populated from the entity partitions identified in the manifest.

The connector looks in the specified manifest and any first-level submanifests for the specified entity. If the required entity is in a second-level or lower submanifest, or if there are multiple entities of the same name in different submanifests, then the user should specify the submanifest that contains the required entity rather than the root manifest.

Entity partitions can be in a mix of formats (for example, CSV and Parquet). All the entity data files identified in the manifest are combined into one dataset regardless of format and loaded to the dataframe.

When the connector reads CSV data, it uses the Spark `failfast` option by default. It will return an error if the number of columns isn't equal to the number of attributes in the entity. Alternatively, as of 0.19, the connector supports permissive mode (only for CSV files). With permissive mode, when a CSV row has a fewer number of columns than the entity schema, the connector assigns null values for the missing columns. When a CSV row has more columns than the entity schema, the columns greater than the entity schema column count will be truncated to the schema column count. Usage is as follows:

```scala
.option("entity", "permissive") or .option("mode", "failfast")
```

## Writing data

When the connector writes to a Common Data Model folder, if the entity doesn't already exist in that folder, the connector creates a new entity and definition. It adds the entity and definition to the Common Data Model folder and references them in the manifest.

The connector supports two writing modes:

* **Explicit write**: The physical entity definition is based on a logical Common Data Model entity definition that the user specifies.

  The connector reads and resolves the specified logical entity definition to create the physical entity definition used in the Common Data Model folder. If import statements in any directly or indirectly referenced Common Data Model definition file include aliases, then you must provide a *config.json* file that maps these aliases to Common Data Model adapters and storage locations.
  * If the dataframe schema doesn't match the referenced entity definition, the connector returns an error. Ensure that the column data types in the dataframe match the attribute data types in the entity, including for decimal data, precision, and scale set via traits in Common Data Model.
  * If the dataframe is inconsistent with the entity definition, the connector returns an error.
  * If the dataframe is consistent:
    * If the entity already exists in the manifest, the connector resolves the provided entity definition and validates it against the definition in the Common Data Model folder. If the definitions don't match, the connector returns an error. Otherwise, the connector writes data and updates the partition information in the manifest.
    * If the entity doesn't exist in the Common Data Model folder, the connector writes a resolved copy of the entity definition to the manifest in the Common Data Model folder. The connector writes data and updates the partition information in the manifest.

* **Implicit write**: The entity definition is derived from the dataframe structure.

  * If the entity doesn't exist in the Common Data Model folder, the connector uses the implicit definition to create the resolved entity definition in the target Common Data Model folder.
  * If the entity exists in the Common Data Model folder, the connector validates the implicit definition against the existing entity definition. If the definitions don't match, the connector returns an error. Otherwise, the connector writes data, and it writes derived logical entity definitions into a subfolder of the entity folder.

    The connector writes data to data folders within an entity subfolder. A save mode determines whether the new data overwrites or is appended to existing data, or an error is returned if data exists. The default is to return an error if data already exists.

## Common Data Model alias integration

Common Data Model definition files use aliases in import statements to simplify the import statements and allow the location of the imported content to be late bound at execution time. Using aliases:

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

The preceding example uses `cdm` as an alias for the location of the Common Data Model foundations file. It uses `core` as an alias for the location of the TrackedEntity definition file.

Aliases are text labels that are matched to a namespace value in an adapter entry in a Common Data Model *config.json* file. An adapter entry specifies the adapter type (for example, *adls*, *CDN*, *GitHub*, or *local*) and a URL that defines a location. Some adapters support other configuration options, such as a connection timeout. Whereas aliases are arbitrary text labels, the `cdm` alias is treated in a special way.

The Spark CDM connector looks in the entity definition's model root location for the *config.json* file to load. If the *config.json* file is at some other location or you want to override the *config.json* file in the model root, then you can provide the location of a *config.json* file by using the `configPath` option. The *config.json* file must contain adapter entries for all the aliases used in the Common Data Model code that's being resolved, or the connector will report an error.

The ability to override the *config.json* file means that you can provide runtime-accessible locations for Common Data Model definitions. Ensure that the content that's referenced at runtime is consistent with the definitions that were used when Common Data Model was originally authored.

By convention, the `cdm` alias refers to the location of the root-level standard Common Data Model definitions, including the *foundations.cdm.json* file. This file includes the Common Data Model primitive data types and a core set of trait definitions required for most Common Data Model entity definitions.

You can resolve the `cdm` alias like any other alias by using an adapter entry in the *config.json* file. Alternatively, you don't specify an adapter or you provide a null entry, then the `cdm` alias will be resolved by default to the Common Data Model public content delivery network (CDN) at `https://cdm-schema.microsoft.com/logical/`.

You can also use the `cdmSource` option to override how the `cdm` alias is resolved. Using the `cdmsource` option is useful if the `cdm` alias is the only alias used in the Common Data Model definitions that are being resolved, because it can avoid the need to create or reference a *config.json* file.

## Parameters, options, and save mode

For both read and write, you provide the Spark CDM connector's library name as a parameter. You use a set of options to parameterize the behavior of the connector. When you're writing, the connector also supports a save mode.

The connector library name, options, and save mode are formatted as follows:

* `dataframe.read.format("com.microsoft.cdm") [.option("option", "value")]*`
* `dataframe.write.format("com.microsoft.cdm") [.option("option", "value")]* .mode(savemode.\<saveMode\>)`

Here's an example that shows some of the options in using the connector for read:

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
|`storage`|The endpoint URL for the Azure Data Lake Storage account, with HNS enabled, that contains the Common Data Model folder. <br/>Use the _dfs_.core.windows.net URL. | \<accountName\>.dfs.core.windows.net "myAccount.dfs.core.windows.net"|
|`manifestPath`|The relative path to the manifest or `model.json` file in the storage account. For read, it can be a root manifest or a submanifest or a `model.json` file. For write, it must be a root manifest.|\<container\>/{\<folderPath\>/}\<manifestFileName>, <br/>"mycontainer/default.manifest.cdm.json" "models/hr/employees.manifest.cdm.json" <br/> "models/hr/employees/model.json" (read only)         |
|`entity`| The name of the source or target entity in the manifest. When you're writing an entity for the first time in a folder, the connector will gived the resolved entity definition this name. The entity name is case sensitive.| \<entityName\> <br/>"customer"|
|`maxCDMThreads`| The maximum number of concurrent reads while the connector resolves an entity definition. | Any valid integer, such as 5|

> [!NOTE]
> You no longer need to specify a logical entity definition in addition to the physical entity definition in the Common Data Model folder on read.

### Explicit write options

The following options identify the logical entity definition that defines the entity that's being written. The logical entity definition will be resolved to a physical definition that defines how the entity will be written.

|**Option**  |**Description**  |**Pattern or example usage**  |
|---------|---------|:---------:|
|`entityDefinitionStorage` |The Azure Data Lake Storage account that contains the entity definition. Required if different from the storage account that hosts the Common Data Model folder.|\<accountName\>.dfs.core.windows.net<br/>"myAccount.dfs.core.windows.net"|
|`entityDefinitionModelRoot`|The location of the model root or corpus within the account. |\<container\>/\<folderPath\> <br/> "crm/core"<br/>|
|`entityDefinitionPath`|The location of the entity. It's the file path to the Common Data Model definition file relative to the model root, including the name of the entity in that file.|\<folderPath\>/\<entityName\>.cdm.json/\<entityName\><br/>"sales/customer.cdm.json/customer"|
`configPath`| The container and folder path to a *config.json* file that contains the adapter configurations for all aliases included in the entity definition file and any directly or indirectly referenced Common Data Model files. <br/><br/>This option is not required if *config.json* is in the model root folder.| \<container\>\<folderPath\>|
|`useCdmStandardModelRoot` | Indicates that the model root is located at [https://cdm-schema.microsoft.com/CDM/logical/](https://github.com/microsoft/CDM/tree/master/schemaDocuments). Used to reference entity types defined in the Common Data Model CDN. Overrides `entityDefinitionStorage` and `entityDefinitionModelRoot` (if specified).<br/>| "useCdmStandardModelRoot" |
|`cdmSource`|Defines how the 'cdm' alias (if present in Common Data Model definition files) is resolved. If you use this option, it overrides any `cdm` adapter specified in the *config.json* file. Values are `builtin` or `referenced`. The default value is `referenced`.  <br/><br/> If you set this option to `referenced`, the connecor uses the latest published standard Common Data Model definitions at `https://cdm-schema.microsoft.com/logical/`. If you set this option to `builtin`, the connector uses the Common Data Model base definitions built in to the Common Data Model object model that the connector is using. <br/><br/> Note: <br/> * The Spark CDM connector may not be using the latest Common Data Model SDK so may not contain the latest published standard definitions. <br/> *The built-in definitions only include the top-level Common Data Model content such as *foundations.cdm.json*, primitives.cdm.json, etc.  If you wish to use lower-level standard Common Data Model definitions, either use _referenced_ or include a cdm adapter in `config.json`.<br/>| "builtin"\|"referenced". |

In the preceding example, the full path to the customer entity definition object is `https://myAccount.dfs.core.windows.net/models/crm/core/sales/customer.cdm.json/customer`, where *models* is the container in Azure Data Lake Storage.

### Implicit write options

If a logical entity definition isn't specified on write, the entity will be written implicitly, based on the dataframe schema.  

When writing implicitly, a timestamp column will normally be interpreted as a Common Data Model DateTime datatype.  This can be overridden to create an attribute of Common Data Model Time datatype by providing a metadata object associated with the column that specifies the datatype.  See Handling Common Data Model Time data below for details.  

Initially, this is supported for CSV files only.  Support for writing time data to Parquet will be added in a later release.  

### Folder structure and data format options

Folder organization and file format can be changed with the following options.

|**Option**  |**Description**  |**Pattern / example usage**  |
|---------|---------|:---------:|
|useSubManifest|If true, causes the target entity to be included in the root manifest via a submanifest. The submanifest and the entity definition are written into an entity folder beneath the root. Default is false.|"true"\|"false" |
|format|Defines the file format. Current supported file formats are CSV and Parquet. Default is "csv"|"csv"\|"parquet" <br/> |
|delimiter|CSV only.  Defines the delimiter used.  Default is comma.   | "\|" |
|columnHeaders| CSV only.  If true, will add a first row to data files with column headers. Default is "true"|"true"\|"false"|
|compression|Write only. Parquet only. Defines the compression format used. Default is "snappy" |"uncompressed" \| "snappy" \| "gzip" \| "lzo".
|dataFolderFormat|Allows user-definable data folder structure within an entity folder.  Allows the use of date and time values to be substituted into folder names using DateTimeFormatter formatting. Non-formatter content must be enclosed in single quotes. Default format is ``` "yyyy"-"MM"-"dd" ``` producing folder names like 2020-07-30| ```year "yyyy" / month "MM"``` <br/> ```"Data"```|

### Save mode

The save mode specifies how existing entity data in the Common Data Model folder is handled when writing a dataframe. Options are to overwrite, append to, or error if data already exists. The default save mode is ErrorIfExists

|**Mode**  |**Description**|
|---------|---------|
|SaveMode.Overwrite |Will overwrite the existing entity definition if it's changed and replace existing data partitions with the data partitions being written.|
|SaveMode.Append |Will append data being written in new partitions alongside the existing partitions.<br/>Note: append doesn't support changing the schema; if the schema of the data being written is incompatible with the existing entity definition an error will be thrown.|
|SaveMode.ErrorIfExists|Will return an error if partitions already exist.|

See _Folder and file organization_ below for details of how data files are named and organized on write.

## Authentication

There are three modes of authentication that can be used with the Spark CDM connector to read/write the Common Data Model metadata and data partitions: Credential Passthrough, SasToken, and App Registration.

### Credential pass-through

In Synapse, the Spark CDM connector supports use of [Managed identities for Azure resource](../../../active-directory/managed-identities-azure-resources/overview.md) to mediate access to the Azure datalake storage account containing the Common Data Model folder.  A managed identity is [automatically created for every Synapse workspace](/cli/azure/synapse/workspace/managed-identity).  The connector uses the managed identity of the workspace that contains the notebook in which the connector is called to authenticate to the storage accounts being addressed.

You must ensure the identity used is granted access to the appropriate storage accounts.  Grant  **Storage Blob Data Contributor** to allow the library to write to Common Data Model folders, or **Storage Blob Data Reader** to allow only read access. In both cases, no extra connector options are required.

### SAS token access control options

SaS Token Credential authentication to storage accounts is an extra option for authentication to storage. With SAS token authentication, the SaS token can be at the container or folder level. The appropriate permissions (read/write) are required – read manifest/partition only needs read level support, while write requires read and write support.

| **Option**   |**Description**  |**Pattern and example usage**  |
|----------|---------|:---------:|
| sasToken |The sastoken to access the relative storageAccount with the correct permissions | \<token\>|

### Credential-based access control options

As an alternative to using a managed identity or a user identity, explicit credentials can be provided to enable the Spark CDM connector to access data. In Azure Active Directory, [create an App Registration](../../../active-directory/develop/quickstart-register-app.md) and then grant this App Registration access to the storage account using either of the following roles: **Storage Blob Data Contributor** to allow the library to write to Common Data Model folders, or **Storage Blob Data Reader** to allow only read.

Once permissions are created, you can pass the app ID, app key, and tenant ID to the connector on each call to it using the options below. It's recommended to use Azure Key Vault to secure these values to ensure they aren't stored in clear text in your notebook file.

| **Option**   |**Description**  |**Pattern and example usage**  |
|----------|---------|:---------:|
| appId | The app registration ID used to authenticate to the storage account | \<guid\> |
| appKey | The registered app key or secret | \<encrypted secret\> |
| tenantId | The Azure Active Directory tenant ID under which the app is registered.      | \<guid\>  |

## Examples

The following examples all use appId, appKey and tenantId variables initialized earlier in the code based on an Azure app registration that has been given Storage Blob Data Contributor permissions on the storage for write and Storage Blob Data Reader permissions for read.

### Read

This code reads the Person entity from the Common Data Model folder with manifest in `mystorage.dfs.core.windows.net/cdmdata/contacts/root.manifest.cdm.json`.

```scala
val df = spark.read.format("com.microsoft.cdm")
 .option("storage", "mystorage.dfs.core.windows.net")
 .option("manifestPath", "cdmdata/contacts/root.manifest.cdm.json")
 .option("entity", "Person")
 .load()
```

### Implicit Write – using dataframe schema only

This code writes the dataframe _df_ to a Common Data Model folder with a manifest to `mystorage.dfs.core.windows.net/cdmdata/Contacts/default.manifest.cdm.json` with an Event entity.

Event data is written as parquet files, compressed with gzip, that are appended to the folder (new files
are added without deleting existing files).

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

### Explicit Write - using an entity definition stored in Data Lake Storage

This code writes the dataframe _df_ to a Common Data Model folder with manifest at
`https://_mystorage_.dfs.core.windows.net/cdmdata/Contacts/root.manifest.cdm.json` with the entity Person. Person data is written as new CSV files (by default) which overwrite existing files in the folder.
The Person entity definition is retrieved from
`https://_mystorage_.dfs.core.windows.net/models/cdmmodels/core/Contacts/Person.cdm.json`

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

### Explicit Write - using an entity defined in the Common Data Model GitHub

This code writes the dataframe _df_ to a Common Data Model folder with the manifest at `https://_mystorage_.dfs.core.windows.net/cdmdata/Teams/root.manifest.cdm.json` and a submanifest containing the TeamMembership entity, created in a TeamMembership subdirectory. TeamMembership data is written to CSV files (the default) that overwrite any existing data files. The TeamMembership entity definition is retrieved from the Common Data Model CDN, at:
[https://cdm-schema.microsoft.com/logical/core/applicationCommon/TeamMembership.cdm.json](https://cdm-schema.microsoft.com/logical/core/applicationCommon/TeamMembership.cdm.json)

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

### Spark to Common Data Model datatype mapping

The following datatype mappings are applied when converting Common Data Model to/from Spark.

|**Spark**  |**Common Data Model**|
|---------|---------|
|ShortType|SmallInteger|
|IntegerType|Integer|
|LongType |BigInteger|
|DateType |Date|
|Timestamp|DateTime (optionally Time, see below)|
|StringType|String|
|DoubleType|Double|
|DecimalType(x,y)|Decimal (x,y) (default scale and precision are 18,4)|
|FloatType|Float|
|BooleanType|Boolean|
|ByteType|Byte|

The Common Data Model Binary datatype isn't supported.

### Handling Common Data Model Date, DateTime, and DateTimeOffset data

Common Data Model Date and DateTime datatype values are handled as normal for Spark and Parquet, and in CSV are read/written in ISO 8601 format.  

Common Data Model _DateTime_ datatype values are _interpreted as UTC_, and in CSV written in ISO 8601 format, for example, 
2020-03-13 09:49:00Z.

Common Data Model _DateTimeOffset_ values intended for recording local time instants are handled differently in Spark and
parquet from CSV. While CSV and other formats can express a local time instant as a structure,
comprising a datetime and a UTC offset, formatted in CSV like, 2020-03-13 09:49:00-08:00, Parquet and
Spark don’t support such structures. Instead, they use a TIMESTAMP datatype that allows an instant to
be recorded in UTC time (or in some unspecified time zone).

The Spark CDM connector will convert a DateTimeOffset value in CSV to a UTC timestamp. This will be persisted as a Timestamp in parquet and if subsequently persisted to CSV, the value will be serialized as a DateTimeOffset with a +00:00 offset. Importantly, there's no loss of temporal accuracy – the serialized values represent the same instant as the original values, although the offset is lost. Spark systems use their system time as the baseline and normally express time using that local time. UTC times can always be computed by applying the local system offset. For Azure systems in all regions, system time is always UTC, so all timestamp values will normally be in UTC.

As Azure system values are always UTC, when using implicit write, where a Common Data Model definition is derived from a dataframe, timestamp columns are translated to attributes with Common Data Model DateTime datatype, which implies a UTC time.

If it's important to persist a local time and the data will be processed in Spark or persisted in parquet,
then it's recommended to use a DateTime attribute and keep the offset in a separate attribute, for
example as a signed integer value representing minutes. In Common Data Model, DateTime values are UTC, so the
offset must be applied when needed to compute local time.

In most cases, persisting local time isn't important. Local times are often only required in a UI for user
convenience and based on the user’s time zone, so not storing a UTC time is often a better solution.

### Handling Common Data Model time data

Spark doesn't support an explicit Time datatype.  An attribute with the Common Data Model _Time_ datatype is represented in a Spark dataframe as a column with a Timestamp datatype in a dataframe.  When a time value is read, the timestamp in the dataframe will be initialized with the Spark epoch date 01/01/1970 plus the time value as read from the source.

When using explicit write, a timestamp column can be mapped to either a DateTime or Time attribute. If a timestamp is mapped to a Time attribute, the date portion of the timestamp is stripped off.  

When using implicit write, a Timestamp column is mapped by default to a DateTime attribute.  To map a timestamp column to a Time attribute, you must add a metadata object to the column in the dataframe that indicates that the timestamp should be interpreted as a time value. The code below shows how this is done in Scala. 

```scala
val md = new MetadataBuilder().putString(“dataType”, “Time”)
val schema = StructType(List(
StructField(“ATimeColumn”, TimeStampType, true, md))

```

### Time value accuracy

The Spark CDM connector supports time values in either DateTime or Time with seconds having up to six decimal places, based on the format of the data either in the file being read (CSV or Parquet) or as defined in the dataframe, enabling accuracy from single seconds to microseconds.

### Folder and file naming and organization

When writing Common Data Model folders, the default folder organization illustrated below is used. 

By default, data files are written into folders created for the current date, named like '2010-07-31'.  The folder structure and names can be customized using the dateFolderFormat option, described earlier.  

Data file names are based on the following pattern: \<entity\>-\<jobid\>-*.\<fileformat\>.

The number of data partitions written can be controlled using the sparkContext.parallelize() method.  The number of partitions is either determined by the number of executors in the Spark cluster or can be specified explicitly. The Scala example below creates a dataframe with two partitions.

```scala
val df= spark.createDataFrame(spark.sparkContext.parallelize(data, 2), schema)
```

**Explicit Write** (defined by a referenced entity definition)

```text
+-- <CDMFolder>
     |-- default.manifest.cdm.json     << with entity ref and partition info
     +-- <Entity>
          |-- <entity>.cdm.json        << resolved physical entity definition
          |-- <data folder>
          |-- <data folder>
          +-- ...                            
 ```

**Explicit Write with sub-manifest:**

```text
+-- <CDMFolder>
    |-- default.manifest.cdm.json       << contains reference to sub-manifest
    +-- <Entity>
         |-- <entity>.cdm.json
         |-- <entity>.manifest.cdm.json << sub-manifest with partition info
         |-- <data folder>
         |-- <data folder>
         +-- ...
```

**Implicit (entity definition is derived from dataframe schema):**

```text
+-- <CDMFolder>
    |-- default.manifest.cdm.json
    +-- <Entity>
         |-- <entity>.cdm.json          << resolved physical entity definition
         +-- LogicalDefinition
         |   +-- <entity>.cdm.json      << logical entity definition(s)
         |-- <data folder>
         |-- <data folder>
         +-- ...
```

**Implicit Write with sub-manifest:**

```text
+-- <CDMFolder>
    |-- default.manifest.cdm.json       << contains reference to sub-manifest
    +-- <Entity>
        |-- <entity>.cdm.json           << resolved physical entity definition
        |-- <entity>.manifest.cdm.json  << sub-manifest with reference to the entity and partition info
        +-- LogicalDefinition
        |   +-- <entity>.cdm.json       << logical entity definition(s)
        |-- <data folder>
        |-- <data folder>
        +-- ...
```

## Troubleshooting and known issues

* Ensure the decimal precision and scale of decimal data type fields used in the dataframe match the data type used in the Common Data Model entity definition - requires precision and scale traits are defined on the data type.  If the precision and scale aren't defined explicitly in Common Data Model, the default used is Decimal(18,4).  For model.json files, Decimal is assumed to be Decimal(18,4).
* Folder and file names in the options below shouldn't include spaces or special characters, such as "=": manifestPath, entityDefinitionModelRoot, entityDefinitionPath, dataFolderFormat.

## Unsupported features

The following features aren't yet supported:

* Overriding a timestamp column to be interpreted as a Common Data Model Time rather than a DateTime is initially supported for CSV files only.  Support for writing Time data to Parquet will be added in a later release.
* Parquet Map type and arrays of primitive types and arrays of array types aren't currently supported by Common Data Model so aren't supported by the Spark CDM connector.

## Next steps

You can now look at the other Apache Spark connectors:

* [Apache Spark Kusto connector](apache-spark-kusto-connector.md)
* [Apache Spark SQL connector](apache-spark-sql-connector.md)

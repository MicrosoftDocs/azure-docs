---
title: Exporting and analyzing Azure API for FHIR data using Azure Synapse Analytics
description: This article describes moving and analyzing the FHIR data using Azure Synapse Analytics  
author: ginalee-dotcom
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 05/13/2021
ms.author: ginle
---
# Exporting and Analyzing FHIR Data using Azure Synapse Analytics 

Azure API for FHIR stores and manages large amounts of healthcare data in FHIR format using REST APIs. However, FHIR data is usually in nested JSON structures that cannot be instantly used for data analytics such as tabular projections, aggregations, and data slicing across the database.

To allow such data analytics, you can export your FHIR data into [Azure Synapse Analytics](../../synapse-analytics/overview-what-is.md), a specialized analytical service for data warehousing and big data workloads. Along with various SQL technologies, it allows deep integration with other Azure analytical services such as Power BI, Cosmos DB, and Azure Machine Learning.

To export data into Synapse, you will first use `$export` to export FHIR resources in `NDJSON` format to Azure blob storage, create a linked service between Azure storage and Synapse, then use T-SQL from Synapse pools to query against those `NDJSON` files.

:::image type="content" source="media/export-data/synapse-from-azurestorage.png" alt-text="Azure storage to Synapse":::

## Exporting FHIR data to Azure blob storage

Azure API for FHIR implements the `$export` operation defined by the FHIR specification to export all or a filtered subset of FHIR data in `NDJSON` format. In addition, it supports [de-identified export](./de-identified-export.md) to anonymize FHIR data on-premises or in the cloud.

To export FHIR data to Azure storage, you first need to [configure your FHIR server to export data](./configure-export-data.md) to ADLS Gen2 Azure storage account. You will need to (1) enable Managed Identity, (2) go to Access Control in the storage account and add role assignment, (3) select your storage account for `$export`.

After the configuration, you can choose your option to manage your collection of FHIR resources in the storage:

* [System](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---system-level-export): `GET https://{{FHIR service base URL}}/$export`
* [Patient](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---all-patients): `GET https://{{FHIR service base URL}}/Patient/$export`
* [Group](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---group-of-patients): `GET https:/{{FHIR service base URL}}/Group/[ID]/$export`

For example, let's assume you chose `Group`. You can export all of your FHIR data related to the patients in that `Group` with the following command, in which you specify your blob storage name in the field `{{BlobContainer}}`:

```rest
https://{{FHIR service base URL}}/Group/{{GroupId}}/$export?_container={{BlobContainer}}  
```

You can also use parameters such as `_type` and `_typefilter` parameters in the `$export` call above to restrict the resources we you want to export. For example, the following call will export only `Patient`, `MedicationRequest`, and `Observation` resources. Moreover, it will restrict `MedicationRequest` resources to the request instances that are active, or completed after July 1, 2018:

```rest
https://{{FHIR service base URL}}/Group/{{GroupId}}/$export?_container={{BlobContainer}}&
_type=Patient,MedicationRequest,Condition&_typeFilter=MedicationRequest%3Fstatus%3Dactive,
MedicationRequest%3Fstatus%3Dcompleted%26date%3Dgt2018-07-01T00%3A00%3A00Z  
```  

For more information on the different parameters supported, check out our `$export` page section on the [query parameters](./export-data.md#settings-and-parameters).

## Creating a linked service between Azure storage and Synapse

To move your data to Synapse, you need to create a Linked Service that stores information on the connection between Synapse and external resources such as Azure Storage account. You can create a Linked Service from the Synapse Studio by navigating to the 'Manage' tab and providing details on your storage.

## Using Synapse to analyze FHIR data

### Synapse workspace

Before using Synapse, you will need a Synapse workspace. You will create a Azure Synapse Analytics service on Azure portal, and put in details about your workspace. More details can be found [here](../../synapse-analytics/get-started-create-workspace.md). After creating a workspace, you can view your workspace on Synapse Studio by signing into your workspace on `https://web.azuresynapse.net`.

### Synapse SQL pools: serverless SQL pool and dedicated SQL pool

Azure Synapse Analytics offers two different SQL pools, serverless SQL pool and dedicated SQL pool. Serverless SQL pool gives the flexibility of querying data directly in the blob storage using the serverless SQL endpoint without any resource provisioning. Dedicated SQL pool has the processing power for high performance and concurrency, and is recommended for enterprise data warehousing capabilities. You can have one serverless and several dedicated SQL pools in your Synapse workspace. For more details on the two SQL pools, check out the [Synapse documentation page](../../synapse-analytics/sql/overview-architecture.md) on SQL architecture.

### Using serverless SQL pool

Since it is serverless, there's no infrastructure to setup or clusters to maintain. You can start querying data from Synapse Studio as soon as the workspace is created. You can start a T-SQL session either from the 'Develop' tab, or by navigating to the Linked server under the Data tab and right-clicking on an exported `NDJSON` file. You must have Storage Blob Data Reader role on the Azure Storage account to navigate and execute SQL against it.

For example, the following query can be used to transform selected fields from `Patient.ndjson` into a tabular structure. You can also create a [SQL View](../../synapse-analytics/sql/create-use-views.md) within the serverless pool to wrap this query and make it easily consumable from tools like Power BI.

```sql
SELECT * FROM  
OPENROWSET(bulk 'https://{{youraccount}}.blob.core.windows.net/{{yourcontainer}}/Patient.ndjson', 
FORMAT = 'csv', 
FIELDTERMINATOR ='0x0b', 
FIELDQUOTE = '0x0b')  
WITH (doc NVARCHAR(MAX)) AS rows     
CROSS APPLY OPENJSON(doc)     
WITH ( 
    ResourceId VARCHAR(64) '$.id', 
    Active VARCHAR(10) '$.active', 
    FullName VARCHAR(100) '$.name[0].text', 
    NamePrefix VARCHAR(10) '$.name[0].prefix[0]', 
    FamilyName VARCHAR(50) '$.name[0].family', 
    GivenName VARCHAR(50) '$.name[0].given[0]', 
    Gender VARCHAR(20) '$.gender', 
    DOB DATETIME2 '$.birthDate', 
    MaritalStatus VARCHAR(20) '$.maritalStatus.coding[0].display', 
    LanguageOfCommunication VARCHAR(20) '$.communication[0].language.text', 
    Deceased VARCHAR(10) '$.deceasedBoolean', 
    DeceasedDateTime DATETIME2 '$.deceasedDateTime', 
    MultipleBirth VARCHAR(10) '$.multipleBirthBoolean', 
    MultipleBirthNumber INT '$.multipleBirthInteger' 
) 
```

In the query above, the `OPENROWSET` function accesses files in Azure Storage, and `OPENJSON` parses JSON text and returns the JSON input properties as rows and columns. Every time this query is executed, the serverless SQL pool reads the file from the blob storage, parses the JSON, and extracts the fields - and it does so in parallel, and returning the results in a respectable duration.

You can get an even better performance by materializing the results in Parquet format in an [External Table](../../synapse-analytics/sql/develop-tables-external-tables.md). The following query is an example:

```sql
-- Create External data source where the parquet file will be written 
CREATE EXTERNAL DATA SOURCE [MyDataSource] WITH ( 
    LOCATION = 'https://{{youraccount}}.blob.core.windows.net/{{exttblcontainer}}' 
); 
GO 

-- Create External File Format 
CREATE EXTERNAL FILE FORMAT [ParquetFF] WITH ( 
    FORMAT_TYPE = PARQUET, 
    DATA_COMPRESSION = 'org.apache.hadoop.io.compress.SnappyCodec' 
); 
GO 

CREATE EXTERNAL TABLE [dbo].[Patient] WITH ( 
        LOCATION = 'PatientParquet/', 
        DATA_SOURCE = [MyDataSource], 
        FILE_FORMAT = [ParquetFF] 
) AS 
SELECT * FROM  
OPENROWSET(bulk 'https://{{youraccount}}.blob.core.windows.net/{{yourcontainer}}/Patient.ndjson' 

-- Use rest of the SQL statement from above --
```

You can query these external tables as you would query any other SQL tables. The level of performance improvements you get by creating external tables will depend on the nature of your query.  

The serverless pool is a convenient and cost-effective option if you want to run queries infrequently, and performance is not your primary concern. There is no fixed cost for using the serverless pool, as you pay only for the data processed. However, if you want a more robust performance solution with richer capabilities, you should consider using the dedicated SQL pool.

### Using dedicated SQL pool

Dedicated SQL pool supports managed tables and a hierarchical cache for in-memory performance. You can import big data with simple T-SQL queries, and then use the power of the distributed query engine to run high-performance analytics.

The simplest and fastest way to load data from your storage to a dedicated SQL pool is to use the `COPY` command in T-SQL, which can read CSV, Parquet, and ORC files. As in the example query below, use the `COPY` command to load the `NDJSON` rows into a staging table, treating a `NDJSON` file like a single-column CSV file. Then, use the `OPENJSON` function together with `SELECT INTO` to create and populate staging tables with the extracted fields.  

```sql
-- Create table with HEAP, which is not indexed and does not have a column width limitation of NVARCHAR(4000) 
CREATE TABLE StagingPatient ( 
Resource NVARCHAR(MAX) 
) WITH (HEAP) 
COPY INTO StagingPatient 
FROM 'https://{{yourblobaccount}}.blob.core.windows.net/{{yourcontainer}}/Patient.ndjson' 
WITH ( 
FILE_TYPE = 'CSV', 
ROWTERMINATOR='0x0a', 
FIELDQUOTE = '', 
FIELDTERMINATOR = '0x00' 
) 
GO
```

Once you have the JSON rows in the staging table, you can create different projections of the data using the `OPENJSON` function and store the results into tables. Here is a sample query to create a `Patient` table by extracting a few fields from the `Patient` resource:

```sql
SELECT RES.*  
INTO Patient  
FROM StagingPatient 
CROSS APPLY OPENJSON(Resource)    
WITH ( 
ResourceId VARCHAR(64) '$.id', 
Active VARCHAR(10) '$.active', 
FullName VARCHAR(100) '$.name[0].text', 
NamePrefix VARCHAR(10) '$.name[0].prefix[0]', 
FamilyName VARCHAR(50) '$.name[0].family', 
GivenName VARCHAR(50) '$.name[0].given[0]', 
Gender VARCHAR(20) '$.gender', 
DOB DATETIME2 '$.birthDate', 
MaritalStatus VARCHAR(20) '$.maritalStatus.coding[0].display', 
LanguageOfCommunication VARCHAR(20) '$.communication[0].language.text', 
Deceased VARCHAR(10) '$.deceasedBoolean', 
DeceasedDateTime DATETIME2 '$.deceasedDateTime', 
    MultipleBirth VARCHAR(10) '$.multipleBirthBoolean', 
    MultipleBirthNumber INT '$.multipleBirthInteger' 
) AS RES  
GO
```

## Next steps

In this article, you learned how to export FHIR resources using $export command to Azure blob storage, create a linked service to Synapse to load data, and use Synapse to analyze FHIR data. Next, you can learn more details about using SQL pools on Azure Synapse Analytics documentation:
 
>[!div class="nextstepaction"]
>[Quickstart: Use serverless SQL pool](../../synapse-analytics/quickstart-sql-on-demand.md)

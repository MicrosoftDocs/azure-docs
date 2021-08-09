---
title: Moving data in Azure API for FHIR to Azure Synapse Analytics
description: This article describes moving FHIR data into Synapse
author: ginalee-dotcom
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 05/13/2021
ms.author: ginle
---
# Moving data from Azure API for FHIR to Azure Synapse Analytics

In this article you will learn a couple of ways to move data from Azure API for FHIR to [Azure Synapse Analytics](https://azure.microsoft.com/services/synapse-analytics/), which is a limitless analytics service that brings together data integration, enterprise data warehousing, and big data analytics. 

Moving data from the FHIR server to Synapse involves exporting the data using the FHIR `$export` operation followed by a series of steps to transform and load the data to Synapse. This article will walk you through two of the several approaches, both of which will show how to convert FHIR resources into tabular formats while moving them into Synapse.

* **Load exported data to Synapse using T-SQL:** Use `$export` operation to move FHIR resources into a **Azure Data Lake Gen 2 (ADL Gen 2) blob storage** in `NDJSON` format. Load the data from the storage into **serverless or dedicated SQL pools** in Synapse using T-SQL. Convert these steps into a robust data movement pipeline using [Synapse pipelines](../../synapse-analytics/get-started-pipelines.md).
* **Use the tools from the FHIR Analytics Pipelines OSS repo:** The [FHIR Analytics Pipeline](https://github.com/microsoft/FHIR-Analytics-Pipelines) repo contains tools that can create an **Azure Data Factory (ADF) pipeline** to move FHIR data into a **Common Data Model (CDM) folder**, and from the CDM folder to Synapse.

## Load exported data to Synapse using T-SQL

### `$export` for moving FHIR data into Azure Data Lake Gen 2 storage

:::image type="content" source="media/export-data/export-azure-storage-option.png" alt-text="Azure storage to Synapse using $export":::

#### Configure your FHIR server to support `$export`

Azure API for FHIR implements the `$export` operation defined by the FHIR specification to export all or a filtered subset of FHIR data in `NDJSON` format. In addition, it supports [de-identified export](./de-identified-export.md) to anonymize FHIR data during the export. If you use `$export`, you get de-identification feature by default its capability is already integrated in `$export`.

To export FHIR data to Azure blob storage, you first need to configure your FHIR server to export data to the storage account. You will need to (1) enable Managed Identity, (2) go to Access Control in the storage account and add role assignment, (3) select your storage account for `$export`. More step-by-step can be found [here](./configure-export-data.md).

You can configure the server to export the data to any kind of Azure storage account, but we recommend exporting to ADL Gen 2 for best alignment with Synapse.

#### Using `$export` command

After configuring your FHIR server, you can follow the [documentation](./export-data.md#using-export-command) to export your FHIR resources at System, Patient, or Group level. For example, you can export all of your FHIR data related to the patients in a `Group` with the following `$export` command, in which you specify your ADL Gen 2 blob storage name in the field `{{BlobContainer}}`:

```rest
https://{{FHIR service base URL}}/Group/{{GroupId}}/$export?_container={{BlobContainer}}  
```

You can also use `_type` parameter in the `$export` call above to restrict the resources we you want to export. For example, the following call will export only `Patient`, `MedicationRequest`, and `Observation` resources:

```rest
https://{{FHIR service base URL}}/Group/{{GroupId}}/$export?_container={{BlobContainer}}&
_type=Patient,MedicationRequest,Condition
```  

For more information on the different parameters supported, check out our `$export` page section on the [query parameters](./export-data.md#settings-and-parameters).

### Create a Synapse workspace

Before using Synapse, you will need a Synapse workspace. You will create a Azure Synapse Analytics service on Azure portal. More step-by-step guide can be found [here](../../synapse-analytics/get-started-create-workspace.md). You need an `ADLSGEN2` account to create a workspace. Your Azure Synapse workspace will use this storage account to store your Synapse workspace data.

After creating a workspace, you can view your workspace on Synapse Studio by signing into your workspace on https://web.azuresynapse.net, or launching Synapse Studio in the Azure portal.

#### Creating a linked service between Azure storage and Synapse

To move your data to Synapse, you need to create a linked service that connects your Azure Storage account with Synapse. More step-by-step can be found [here](../../synapse-analytics/data-integration/data-integration-sql-pool.md#create-linked-services).

1. On Synapse Studio, navigate to the **Manage** tab, and under **External connections**, select **Linked services**.
2. Select **New** to add a new linked service.
3. Select **Azure Data Lake Storage Gen2** from the list and select **Continue**.
4. Enter your authentication credentials. Select **Create** when finished.

Now that you have a linked service between your ADL Gen 2 storage and Synapse, you are ready to use Synapse SQL pools to load and analyze your FHIR data.

### Decide between serverless and dedicated SQL pool

Azure Synapse Analytics offers two different SQL pools, serverless SQL pool and dedicated SQL pool. Serverless SQL pool gives the flexibility of querying data directly in the blob storage using the serverless SQL endpoint without any resource provisioning. Dedicated SQL pool has the processing power for high performance and concurrency, and is recommended for enterprise-scale data warehousing capabilities. For more details on the two SQL pools, check out the [Synapse documentation page](../../synapse-analytics/sql/overview-architecture.md) on SQL architecture.

#### Using serverless SQL pool

Since it is serverless, there's no infrastructure to setup or clusters to maintain. You can start querying data from Synapse Studio as soon as the workspace is created.

For example, the following query can be used to transform selected fields from `Patient.ndjson` into a tabular structure:

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
    Gender VARCHAR(20) '$.gender', 
       ...
) 
```

In the query above, the `OPENROWSET` function accesses files in Azure Storage, and `OPENJSON` parses JSON text and returns the JSON input properties as rows and columns. Every time this query is executed, the serverless SQL pool reads the file from the blob storage, parses the JSON, and extracts the fields.

You can also materialize the results in Parquet format in an [External Table](../../synapse-analytics/sql/develop-tables-external-tables.md) to get better query performance, as shown below:

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
-- Use rest of the SQL statement from the previous example --
```

#### Using dedicated SQL pool

Dedicated SQL pool supports managed tables and a hierarchical cache for in-memory performance. You can import big data with simple T-SQL queries, and then use the power of the distributed query engine to run high-performance analytics.

The simplest and fastest way to load data from your storage to a dedicated SQL pool is to use the **`COPY`** command in T-SQL, which can read CSV, Parquet, and ORC files. As in the example query below, use the `COPY` command to load the `NDJSON` rows into a tabular structure. 

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

Once you have the JSON rows in the `StagingPatient` table above, you can create different tabular formats of the data using the `OPENJSON` function and storing the results into tables. Here is a sample SQL query to create a `Patient` table by extracting a few fields from the `Patient` resource:

```sql
SELECT RES.* 
INTO Patient 
FROM StagingPatient
CROSS APPLY OPENJSON(Resource)   
WITH (
	ResourceId VARCHAR(64) '$.id',
	FullName VARCHAR(100) '$.name[0].text',
	FamilyName VARCHAR(50) '$.name[0].family',
	GivenName VARCHAR(50) '$.name[0].given[0]',
	Gender VARCHAR(20) '$.gender',
	DOB DATETIME2 '$.birthDate',
	MaritalStatus VARCHAR(20) '$.maritalStatus.coding[0].display',
	LanguageOfCommunication VARCHAR(20) '$.communication[0].language.text'
) AS RES 
GO

```

## Use FHIR Analytics Pipelines OSS tools

:::image type="content" source="media/export-data/analytics-pipeline-option.png" alt-text="Using ADF pipeline to move data into CDM folder then into Synapse":::

> [!Note]
> [FHIR Analytics pipeline](https://github.com/microsoft/FHIR-Analytics-Pipelines) is an open source tool released under MIT license, and is not covered by the Microsoft SLA for Azure services.

### ADF pipeline for moving FHIR data into CDM folder

Common Data Model (CDM) folder is a folder in a data lake that conforms to well-defined and standardized metadata structures and self-describing data. These folders facilitate metadata interoperability between data producers and data consumers. Before you move FHIR data into CDM folder, you can transform your data into a table configuration.

### Generating table configuration

Clone te repo get all the scripts and source code. Use `npm install` to install the dependencies. Run the following command from the `Configuration-Generator` folder to generate a table configuration folder using YAML format instructions:

```bash
Configuration-Generator> node .\generate_from_yaml.js -r {resource configuration file} -p {properties group file} -o {output folder}
```

You may use the sample `YAML` files, `resourcesConfig.yml` and `propertiesGroupConfig.yml` provided in the repo.

### Generating ADF pipeline

Now you can use the content of the generated table configuration and a few other configurations to generate an ADF pipeline. This ADF pipeline, when triggered, exports the data from the FHIR server using `$export` API and writes to a CDM folder along with associated CDM metadata.

1. Create an Azure Active Directory (AD) application and service principal. The ADF pipeline uses an Azure batch service to do the transformation, and needs an Azure AD application for the batch service. Follow [Azure AD documentation](../../active-directory/develop/howto-create-service-principal-portal.md).
2. Grant access for export storage location to the service principal. In the `Access Control` of the export storage, grant `Storage Blob Data Contributor` role to the Azure AD application.
3. Deploy the egress pipeline. Use the template `fhirServiceToCdm.json` for a custom deployment on Azure. This step will create the following Azure resources:
    - An ADF pipeline with the name `{pipelinename}-df`.
    - A key vault with the name `{pipelinename}-kv` to store the client secret.
    - A batch account with the name `{pipelinename}batch` to run the transformation.
    - A storage account with the name `{pipelinename}storage`.
4. Grant access to the Azure Data Factory. In the access control panel of your FHIR service, grant `FHIR data exporter` and `FHIR data reader` roles to the data factory, `{pipelinename}-df`.
5. Upload the content of the table configuration folder to the configuration container.
6. Go to `{pipelinename}-df`, and trigger the pipeline. You should see the exported data in the CDM folder on the storage account `{pipelinename}storage`. You should see one folder for each table having a CSV file.

### From CDM folder to Synapse

Once you have the data exported in a CDM format and stored in your ADL Gen 2 storage, you can now move your data in the CDM folder to Synapse.

You can create CDM to Synapse pipeline using a configuration file, which would look something like this:

```json
{
  "ResourceGroup": "",
  "TemplateFilePath": "../Templates/cdmToSynapse.json",
  "TemplateParameters": {
    "DataFactoryName": "",
    "SynapseWorkspace": "",
    "DedicatedSqlPool": "",
    "AdlsAccountForCdm": "",
    "CdmRootLocation": "cdm",
    "StagingContainer": "adfstaging",
    "Entities": ["LocalPatient", "LocalPatientAddress"]
  }
}
```

Run this script with the configuration file above:

```bash
.\DeployCdmToSynapsePipeline.ps1 -Config: config.json
```

Add ADF Managed Identity as a SQL user into SQL database. Here is a sample SQL script to create a user and an assign role:

```sql
CREATE USER [datafactory-name] FROM EXTERNAL PROVIDER
GO
EXEC sp_addrolemember db_owner, [datafactory-name]
GO
```

## Next steps

In this article, you learned two different ways to move your FHIR data into Synapse: (1) using `$export` to move data into ADL Gen 2 blob storage then loading the data into Synapse SQL pools, and (2) using ADF pipeline for moving FHIR data into CDM folder then into Synapse.

Next, you can learn about anonymization of your FHIR data while moving data to Synapse to ensure your healthcare information is protected:
 
>[!div class="nextstepaction"]
>[Exporting de-identified data](./de-identified-export.md)









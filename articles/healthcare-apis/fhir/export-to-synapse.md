---
title: Exporting data in Azure API for FHIR to Azure Synapse Analytics
description: This article describes moving FHIR data into Synapse
author: ginalee-dotcom
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 05/13/2021
ms.author: ginle
---
# Moving FHIR Data into Azure Synapse Analytics

Azure API for FHIR stores and manages large amounts of healthcare data in FHIR format using REST APIs. However, FHIR data is usually in nested JSON structures that cannot be instantly used for data analytics and machine learning, which work the best with tabular data. Therefore, it is recommended to transform FHIR data into a tabular format, and move the transformed FHIR data into a service platform dedicated for data analytics.

One such platform is [Azure Synapse Analytics](../../synapse-analytics/overview-what-is.md), a specialized analytical service for data warehouses and big data workloads. Along with various SQL technologies and data integration pipelines, it allows integration with other Azure analytical services such as Power BI, Cosmos DB, and Azure Machine Learning.

Currently, we have two options for moving FHIR data into Azure Synapse Analytics:

- Use **`$export` operation** to move FHIR resources into a **Azure Data Lake Gen 2 (ADL Gen 2) blob storage** in `NDJSON` format. Load the data from the storage into **serverless or dedicated SQL pools** in Synapse.
- Create an **Azure Data Factory (ADF) pipeline** to move FHIR data into a **Common Data Model (CDM) folder**, and move the data from the CDM folder to Synapse. For more details, check out our GitHub repo [FHIR Analytics Pipeline](https://github.com/microsoft/FHIR-Analytics-Pipelines).

This article will walk you through the two options, both of which will show how to convert FHIR resources into tabular formats while moving them into Synapse.

## `$export` for moving FHIR data into Azure Data Lake Gen 2 storage

:::image type="content" source="media/export-data/synapse-from-azurestorage.png" alt-text="Azure storage to Synapse":::

### Configuring your FHIR server to support `$export`

Azure API for FHIR implements the `$export` operation defined by the FHIR specification to export all or a filtered subset of FHIR data in `NDJSON` format. In addition, it supports [de-identified export](./de-identified-export.md) to anonymize FHIR data on-premises or in the cloud. If you use `$export`, you get de-identification feature by default its capability is already integrated in `$export`.

To export FHIR data to Azure blob storage, you first need to configure your FHIR server to export data to the storage account. You will need to (1) enable Managed Identity, (2) go to Access Control in the storage account and add role assignment, (3) select your storage account for `$export`. More step-by-step can be found [here](./configure-export-data.md).

You can configure the server to export the data to any kind of Azure storage account, but we recommend exporting to ADL Gen 2 for best alignment with Synapse.

### Using `$export` command

After configuring your FHIR server, you can choose how you want to manage your FHIR resources in the storage:

* [System](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---system-level-export): `GET https://{{FHIR service base URL}}/$export`
* [Patient](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---all-patients): `GET https://{{FHIR service base URL}}/Patient/$export`
* [Group](https://hl7.org/Fhir/uv/bulkdata/export/index.html#endpoint---group-of-patients): `GET https:/{{FHIR service base URL}}/Group/[ID]/$export`

For example, let's assume you choose `Group`. You can export all of your FHIR data related to the patients in that `Group` with the following `$export` command, in which you specify your ADL Gen 2 blob storage name in the field `{{BlobContainer}}`:

```rest
https://{{FHIR service base URL}}/Group/{{GroupId}}/$export?_container={{BlobContainer}}  
```

You can also use parameters such as `_type` parameters in the `$export` call above to restrict the resources we you want to export. For example, the following call will export only `Patient`, `MedicationRequest`, and `Observation` resources:

```rest
https://{{FHIR service base URL}}/Group/{{GroupId}}/$export?_container={{BlobContainer}}&
_type=Patient,MedicationRequest,Condition
```  

For more information on the different parameters supported, check out our `$export` page section on the [query parameters](./export-data.md#settings-and-parameters).

## Synapse and Synapse SQL pools

### Create a Synapse workspace

Before using Synapse, you will need a Synapse workspace. You will create a Azure Synapse Analytics service on Azure portal. More step-by-step guide can be found [here](../../synapse-analytics/get-started-create-workspace.md). You need an `ADLSGEN2` account to create a workspace. Your Azure Synapse workspace will use this storage account to store your Synapse workspace data.

After creating a workspace, you can view your workspace on Synapse Studio by signing into your workspace on https://web.azuresynapse.net, or launching Synapse Studio in the Azure portal.

### Creating a linked service between Azure storage and Synapse

To move your data to Synapse, you need to create a linked service that connects your Azure Storage account with Synapse. More step-by-step can be found [here](../../synapse-analytics/data-integration/data-integration-sql-pool.md#create-linked-services).

1. On Synapse Studio, navigate to the **Manage** tab, and under **External connections**, select **Linked services**.
2. Select **New** to add a new linked service.
3. Select **Azure Data Lake Storage Gen2** from the list and select **Continue**.
4. Enter your authentication credentials. Select **Create** when finished.

Now that you have a linked service between your ADL Gen 2 storage and Synapse, you are ready to use Synapse SQL pools to load and analyze your FHIR data.

### Synapse SQL pools: serverless SQL pool and dedicated SQL pool

Azure Synapse Analytics offers two different SQL pools, serverless SQL pool and dedicated SQL pool. Serverless SQL pool gives the flexibility of querying data directly in the blob storage using the serverless SQL endpoint without any resource provisioning. Dedicated SQL pool has the processing power for high performance and concurrency, and is recommended for enterprise-scale data warehousing capabilities. For more details on the two SQL pools, check out the [Synapse documentation page](../../synapse-analytics/sql/overview-architecture.md) on SQL architecture.

### Using serverless SQL pool

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

You can also get a better performance by materializing the results in Parquet format in an [External Table](../../synapse-analytics/sql/develop-tables-external-tables.md), as in the example query below:

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

### Using dedicated SQL pool

Dedicated SQL pool supports managed tables and a hierarchical cache for in-memory performance. You can import big data with simple T-SQL queries, and then use the power of the distributed query engine to run high-performance analytics.

The simplest and fastest way to load data from your storage to a dedicated SQL pool is to use the **`COPY`** command in T-SQL, which can read CSV, Parquet, and ORC files. As in the example query below, use the `COPY` command to load the `NDJSON` rows into a tabular structure. Then, use the `OPENJSON` function together with `SELECT INTO` to create and populate the tables:  

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

## ADF pipeline for moving FHIR data into CDM folder

[CDM folder](https://docs.microsoft.com/en-us/common-data-model/data-lake) is a folder in a data lake that conforms to well-defined and standardized metadata structures and self-describing data. These folders facilitate metadata interoperability between data producers and data consumers. Before you move FHIR data into CDM folder, you can transform your data into a table configuration.

### Generating table configuration

[Table configuration generator](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/docs/fhir-to-cdm.md#1-table-configuration-generator) takes YAML instructions and generates a table configuration folder. The [schema viewer](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/docs/fhir-to-cdm.md#2-schema-viewer) helps visualize the schema of the generated tables.

Clone GitHub repo [FHIR Analytics Pipeline](https://github.com/microsoft/FHIR-Analytics-Pipelines) to get all the scripts and source code. Use `npm install` to install the dependencies. Run the following command from the `Configuration-Generator` folder to generate a table configuration:

```bash
Configuration-Generator> node .\generate_from_yaml.js -r {resource configuration file} -p {properties group file} -o {output folder}
```

You may use the sample `YAML` files, `resourcesConfig.yml` and `propertiesGroupConfig.yml` provided in the repo. See the [documentation](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/docs/yaml-instructions-format.md) on `YAML` instruction format if you want to write one yourself.

### Generating ADF pipeline

[Pipeline generator](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/docs/fhir-to-cdm.md#3-pipeline-generator) uses the content of the generated table configuration and a few other configurations to generate an ADF pipeline. This ADF pipeline, when triggered, exports the data from the FHIR server using `$export` API and writes to a CDM folder along with associated CDM metadata. Below is a condensed guide to generating the ADF pipeline. For a more step-by-step guide, refer to the [repo documentation](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/docs/fhir-to-cdm.md):

1. Ensure that `$export` is configured for your FHIR server.
2. Create an Azure AD application and service principal. The ADF pipeline uses an Azure batch service to do the transformation. We need to register an Azure AD application for the batch service. Follow [this documentation](../../active-directory/develop/howto-create-service-principal-portal.md) to create an AAD application and service principal.
3. Grant access for export storage location to the service principal. In the `Access Control` of the export storage, grant `Storage Blob Data Contributor` role to the Azure AD application created above.
4. Deploy the egress pipeline. Download and save `fhirServiceToCdm.json` deployment template. Use this template to do a custom deployment on Azure. This step will create the following Azure resources:
    - An ADF pipeline with the name `{pipelinename}-df`.
    - A key vault with the name `{pipelinename}-kv` to store the client secret.
    - A batch account with the name `{pipelinename}batch` to run the transformation.
    - A storage account with the name `{pipelinename}storage`. This storage will be used for different purposes such as running the batch job and the destination storage for the CDM data. This is also where you will keep the table configuration.
5. Grant access to the Azure Data Factory. In the access control panel of your FHIR service, grant `FHIR data exporter` and `FHIR data reader` roles to the data factory, `{pipelinename}-df`, created in the previous step.
6. Upload the content of the table configuration folder to the configuration container that you specified in Step 4.
7. Trigger the ADF pipeline. Go to `{pipelinename}-df`, and trigger the pipeline. One the pipeline execution is completed, you should see the exported data in the CDM folder on the storage account `{pipelinename}storage`. You should see one folder for each table having a CSV file.

## From CDM folder to Synapse

Once you have the data exported in a CDM format and stored in your ADL Gen 2 storage, you can now move your data in the CDM folder to Synapse. This article outlines the steps in a concise manner; if you want a more detailed guide, please refer to our [repo documentation](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/docs/cdm-to-synapse.md).

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

Ensure that your database master key is created on your Synapse SQL pool. For more details, read about [creating a database master key](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-master-key-transact-sql?view=sql-server-ver15).

Instead of running a script on the configuration file, you can manually move your data from CDM folder to Synapse using the Azure portal and Synapse Studio. For a step-by-step guide, check out the [repo documentation section](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/docs/cdm-to-synapse.md#manual-method-using-azure-portal-and-synapse-studio).

## Next steps

In this article, you learned two different ways to move your FHIR data into Synapse: (1) using `$export` to move data into ADL Gen 2 blob storage then loading the data into Synapse SQL pools, and (2) using ADF pipeline for moving FHIR data into CDM folder then into Synapse.

Next, you can learn about anonymization of your FHIR data while moving data to Synapse to ensure your healthcare information is protected:
 
>[!div class="nextstepaction"]
>[Exporting de-identified data](./de-identified-export.md)

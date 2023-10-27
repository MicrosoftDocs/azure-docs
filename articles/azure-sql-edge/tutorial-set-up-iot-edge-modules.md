---
title: Set up IoT Edge modules in Azure SQL Edge
description: In part two of this three-part Azure SQL Edge tutorial for predicting iron ore impurities, you'll set up IoT Edge modules and connections.
author: kendalvandyke
ms.author: kendalv
ms.reviewer: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: tutorial
---
# Set up IoT Edge modules and connections

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

In part two of this three-part tutorial for predicting iron ore impurities in Azure SQL Edge, you'll set up the following IoT Edge modules:

- Azure SQL Edge
- Data generator IoT Edge module

## Specify container registry credentials

The credentials to the container registries hosting module images need to be specified. These credentials can be found in the container registry that was created in your resource group. Navigate to the **Access Keys** section. Make note of the following fields:

- Registry name
- Login server
- Username
- Password

Now, specify the container credentials in the IoT Edge module.

1. Navigate to the IoT hub that was created in your resource group.

1. In the **IoT Edge** section under **Automatic Device Management**, select **Device ID**. For this tutorial, the ID is `IronOrePredictionDevice`.

1. Select the **Set Modules** section.

1. Under **Container Registry Credentials**, enter the following values:

   | Field | Value |
   | --- | --- |
   | Name | Registry name |
   | Address | Login server |
   | User Name | Username |
   | Password | Password |

## Build, push, and deploy the Data Generator Module

1. Clone the project files to your machine.
1. Open the file **IronOre_Silica_Predict.sln** using Visual Studio 2019
1. Update the container registry details in the **deployment.template.json**

   ```json
   "registryCredentials": {
        "RegistryName": {
            "username": "",
            "password": "",
            "address": ""
        }
   }
   ```

1. Update the **modules.json** file to specify the target container registry (or repository for the module)

   ```json
   "image": {
        "repository":"samplerepo.azurecr.io/ironoresilicapercent",
        "tag":
   }
   ```

1. Execute the project in either debug or release mode to ensure the project runs without any issues
1. Push the project to your container registry by right-clicking the project name and then selecting **Build and Push IoT Edge Modules**.
1. Deploy the Data Generator module as an IoT Edge module to your Edge device.

## Deploy the Azure SQL Edge module

1. Deploy the Azure SQL Edge module by selecting on **+ Add** and then **Marketplace Module**.

1. On the **IoT Edge Module Marketplace** pane, search for *Azure SQL Edge* and pick *Azure SQL Edge Developer*.

1. Select the newly added *Azure SQL Edge* module under **IoT Edge Modules** to configure the Azure SQL Edge module. For more information on the configuration options, see [Deploy Azure SQL Edge](./deploy-portal.md).

1. Add the `MSSQL_PACKAGE` environment variable to the *Azure SQL Edge* module deployment, and specify the SAS URL of the database dacpac file created in step 8 of [Part one](tutorial-deploy-azure-resources.md) of this tutorial.

1. Select **update**

1. On the **Set modules on device** page, select **Next: Routes >**.

1. On the routes pane of the **Set modules on device** page, specify the routes for module to IoT Edge hub communication as described below. Make sure to update the module names in the following route definitions.

   ```sql
   FROM /messages/modules/<your_data_generator_module>/outputs/IronOreMeasures
   INTO BrokeredEndpoint("/modules/<your_azure_sql_edge_module>/inputs/IronOreMeasures")
   ```

   For example:

   ```sql
   FROM /messages/modules/ASEDataGenerator/outputs/IronOreMeasures
   INTO BrokeredEndpoint("/modules/AzureSQLEdge/inputs/IronOreMeasures")
   ```

1. On the **Set modules on device** page, select **Next: Review + create >**

1. On the **Set modules on device** page, select **Create**

## Create and start the T-SQL Streaming Job in Azure SQL Edge.

1. Open Azure Data Studio.

1. In the **Welcome** tab, start a new connection with the following details:

   | Field | Value |
   | --- | --- |
   | Connection type | Microsoft SQL Server |
   | Server | Public IP address mentioned in the VM that was created for this demo |
   | Username | sa |
   | Password | The strong password that was used while creating the Azure SQL Edge instance |
   | Database | Default |
   | Server group | Default |
   | Name (optional) | Provide an optional name |

1. Select **Connect**.

1. In the **File** menu tab, open a new notebook or use the keyboard shortcut **Ctrl + N**.

1. In the new Query window, execute the script below to create the T-SQL Streaming job. Before executing the script, make sure to change the following variables:

   - `@SQL_SA_Password`: The `MSSQL_SA_PASSWORD` value specified while deploying the Azure SQL Edge Module.

   ```sql
   USE IronOreSilicaPrediction;
   GO

   DECLARE @SQL_SA_Password VARCHAR(200) = '<SQL_SA_Password>';
   DECLARE @query VARCHAR(MAX);

   /* Create objects required for streaming */

   CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'MyStr0ng3stP@ssw0rd';

   IF NOT EXISTS (
           SELECT name
           FROM sys.external_file_formats
           WHERE name = 'JSONFormat'
           )
   BEGIN
       CREATE EXTERNAL FILE FORMAT [JSONFormat]
           WITH (FORMAT_TYPE = JSON)
   END

   IF NOT EXISTS (
           SELECT name
           FROM sys.external_data_sources
           WHERE name = 'EdgeHub'
           )
   BEGIN
       CREATE EXTERNAL DATA SOURCE [EdgeHub]
           WITH (LOCATION = N'edgehub://')
   END

   IF NOT EXISTS (
           SELECT name
           FROM sys.external_streams
           WHERE name = 'IronOreInput'
           )
   BEGIN
       CREATE EXTERNAL STREAM IronOreInput
           WITH (
                   DATA_SOURCE = EdgeHub,
                   FILE_FORMAT = JSONFormat,
                   LOCATION = N'IronOreMeasures'
                   )
   END

   IF NOT EXISTS (
           SELECT name
           FROM sys.database_scoped_credentials
           WHERE name = 'SQLCredential'
           )
   BEGIN
       SET @query = 'CREATE DATABASE SCOPED CREDENTIAL SQLCredential
                    WITH IDENTITY = ''sa'', SECRET = ''' + @SQL_SA_Password + ''''

       EXECUTE (@query)
   END

   IF NOT EXISTS (
           SELECT name
           FROM sys.external_data_sources
           WHERE name = 'LocalSQLOutput'
           )
   BEGIN
       CREATE EXTERNAL DATA SOURCE LocalSQLOutput
           WITH (
                   LOCATION = 'sqlserver://tcp:.,1433',
                   CREDENTIAL = SQLCredential
                   )
   END

   IF NOT EXISTS (
           SELECT name
           FROM sys.external_streams
           WHERE name = 'IronOreOutput'
           )
   BEGIN
       CREATE EXTERNAL STREAM IronOreOutput
           WITH (
                   DATA_SOURCE = LocalSQLOutput,
                   LOCATION = N'IronOreSilicaPrediction.dbo.IronOreMeasurements'
                   )
   END

   EXEC sys.sp_create_streaming_job @name = N'IronOreData',
       @statement = N'Select * INTO IronOreOutput from IronOreInput';

   EXEC sys.sp_start_streaming_job @name = N'IronOreData';
   ```

1. Use the following query to verify that the data from the data generation module is being streamed into the database.

   ```sql
   SELECT TOP 10 *
   FROM dbo.IronOreMeasurements
   ORDER BY timestamp DESC;
   ```

In this tutorial, we deployed the data generator module and the SQL Edge module. Then we created a streaming job to stream the data generated by the data generation module to SQL.

## Next steps

- [Deploy ML model on Azure SQL Edge using ONNX](tutorial-run-ml-model-on-sql-edge.md)

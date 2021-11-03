---
title: Set up IoT Edge modules in Azure SQL Edge
description: In part two of this three-part Azure SQL Edge tutorial for predicting iron ore impurities, you'll set up IoT Edge modules and connections.
keywords:
services: sql-edge
ms.service: sql-edge
ms.topic: tutorial
author: VasiyaKrishnan
ms.author: vakrishn
ms.reviewer: sourabha, sstein
ms.date: 09/22/2020
---

# Set up IoT Edge modules and connections

In part two of this three-part tutorial for predicting iron ore impurities in Azure SQL Edge, you'll set up the following IoT Edge modules:

- Azure SQL Edge
- Data generator IoT Edge module

## Specify container registry credentials

The credentials to the container registries hosting module images need to be specified. These can be found in the container registry that was created in your resource group. Navigate to the **Access Keys** section. Make note of the following fields:

- Registry name
- Login server
- Username
- Password

Now, specify the container credentials in the IoT Edge module.

1. Navigate to the IoT hub that was created in your resource group.

2. In the **IoT Edge** section under **Automatic Device Management**, click **Device ID**. For this tutorial, the ID is `IronOrePredictionDevice`.

3. Select the **Set Modules** section.

4. Under **Container Registry Credentials**, enter the following values:

   | _Field_   | _Value_       |
   | -------   | -------       |
   | Name      | Registry name |
   | Address   | Login server  |
   | User Name | Username      |
   | Password  | Password      |

## Build, push, and deploy the Data Generator Module

1. Clone the [project files](https://github.com/microsoft/sqlsourabh/tree/main/SQLEdgeSamples/IoTEdgeSamples/IronOreSilica) to your machine.
2. Open the file **IronOre_Silica_Predict.sln** using Visual Studio 2019
3. Update the container registry details in the **deployment.template.json**
   ```json
   "registryCredentials":{
        "RegistryName":{
            "username":"",
            "password":""
            "address":""
        }
    }
   ```
4. Update the **modules.json** file to specify the target container registry (or repository for the module)
   ```json
   "image":{
        "repository":"samplerepo.azurecr.io/ironoresilicapercent",
        "tag":
    }
   ```
5. Execute the project in either debug or release mode to ensure the project runs without any issues
6. Push the project to your container registry by right-clicking the project name and then selecting **Build and Push IoT Edge Modules**.
7. Deploy the Data Generator module as an IoT Edge module to your Edge device.

## Deploy the Azure SQL Edge module

1. Deploy the Azure SQL Edge module by clicking on **+ Add** and then **Marketplace Module**.

2. On the **IoT Edge Module Marketplace** blade, search for *Azure SQL Edge* and pick *Azure SQL Edge Developer*.

3. Click on the newly added *Azure SQL Edge* module under **IoT Edge Modules** to configure the Azure SQL Edge module. For more information on the configuration options, see [Deploy Azure SQL Edge](./deploy-portal.md).

4. Add the `MSSQL_PACKAGE` environment variable to the *Azure SQL Edge* module deployment, and specify the SAS URL of the database dacpac file created in step 8 of [Part one](tutorial-deploy-azure-resources.md) of this tutorial.

5. Click **update**

6. On the **Set modules on device** page, click **Next: Routes >**.

7. On the routes pane of the **Set modules on device** page, specify the routes for module to IoT Edge hub communication as described below. Make sure to update the module names in the route definitions below.

   ```syntax
   FROM /messages/modules/<your_data_generator_module>/outputs/IronOreMeasures INTO
   BrokeredEndpoint("/modules/<your_azure_sql_edge_module>/inputs/IronOreMeasures")
   ```

   For example:

   ```syntax
   FROM /messages/modules/ASEDataGenerator/outputs/IronOreMeasures INTO BrokeredEndpoint("/modules/AzureSQLEdge/inputs/IronOreMeasures")
   ```


7. On the **Set modules on device** page, click **Next: Review + create >**

8. On the **Set modules on device** page, click **Create**

## Create and start the T-SQL Streaming Job in Azure SQL Edge.

1. Open Azure Data Studio.

2. In the **Welcome** tab, start a new connection with the following details:

   |_Field_|_Value_|
   |-------|-------|
   |Connection type| Microsoft SQL Server|
   |Server|Public IP address mentioned in the VM that was created for this demo|
   |Username|sa|
   |Password|The strong password that was used while creating the Azure SQL Edge instance|
   |Database|Default|
   |Server group|Default|
   |Name (optional)|Provide an optional name|

3. Click **Connect**

4. In the **File** menu tab, open a new notebook or use the keyboard shortcut Ctrl + N.

5. In the new Query window, execute the script below to create the T-SQL Streaming job. Before executing the script, make sure to change the following variables.
   - *SQL_SA_Password:* The MSSQL_SA_PASSWORD value specified while deploy the Azure SQL Edge Module.

   ```sql
   Use IronOreSilicaPrediction
   Go

   Declare @SQL_SA_Password varchar(200) = '<SQL_SA_Password>'
   declare @query varchar(max)

   /*
   Create Objects Required for Streaming
   */

   CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'MyStr0ng3stP@ssw0rd';

   If NOT Exists (select name from sys.external_file_formats where name = 'JSONFormat')
   Begin
      CREATE EXTERNAL FILE FORMAT [JSONFormat]
      WITH ( FORMAT_TYPE = JSON)
   End


   If NOT Exists (select name from sys.external_data_sources where name = 'EdgeHub')
   Begin
      Create EXTERNAL DATA SOURCE [EdgeHub]
      With(
         LOCATION = N'edgehub://'
      )
   End

   If NOT Exists (select name from sys.external_streams where name = 'IronOreInput')
   Begin
      CREATE EXTERNAL STREAM IronOreInput WITH
      (
         DATA_SOURCE = EdgeHub,
         FILE_FORMAT = JSONFormat,
         LOCATION = N'IronOreMeasures'
       )
   End


   If NOT Exists (select name from sys.database_scoped_credentials where name = 'SQLCredential')
   Begin
       set @query = 'CREATE DATABASE SCOPED CREDENTIAL SQLCredential
                 WITH IDENTITY = ''sa'', SECRET = ''' + @SQL_SA_Password + ''''
       Execute(@query)
   End

   If NOT Exists (select name from sys.external_data_sources where name = 'LocalSQLOutput')
   Begin
      CREATE EXTERNAL DATA SOURCE LocalSQLOutput WITH (
      LOCATION = 'sqlserver://tcp:.,1433',CREDENTIAL = SQLCredential)
   End

   If NOT Exists (select name from sys.external_streams where name = 'IronOreOutput')
   Begin
      CREATE EXTERNAL STREAM IronOreOutput WITH
      (
         DATA_SOURCE = LocalSQLOutput,
         LOCATION = N'IronOreSilicaPrediction.dbo.IronOreMeasurements'
      )
   End

   EXEC sys.sp_create_streaming_job @name=N'IronOreData',
   @statement= N'Select * INTO IronOreOutput from IronOreInput'

   exec sys.sp_start_streaming_job @name=N'IronOreData'
   ```

6. Use the following query to verify that the data from the data generation module is being streamed into the database.

   ```sql
   Select Top 10 * from dbo.IronOreMeasurements
   order by timestamp desc
   ```


In this tutorial, we deployed the data generator module and the SQL Edge module. Then we created a streaming job to stream the data generated by the data generation module to SQL.

## Next Steps

- [Deploy ML model on Azure SQL Edge using ONNX](tutorial-run-ml-model-on-sql-edge.md)

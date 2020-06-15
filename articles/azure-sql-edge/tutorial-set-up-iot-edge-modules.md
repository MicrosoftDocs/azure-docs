---
title: Set up IoT Edge modules in Azure SQL Edge
description: In part two of this three-part Azure SQL Edge tutorial for predicting iron ore impurities, you'll set up IoT Edge modules and connections.
keywords: 
services: sql-edge
ms.service: sql-edge
ms.topic: tutorial
author: VasiyaKrishnan
ms.author: vakrishn
ms.reviewer: sstein
ms.date: 05/19/2020
---

# Set up IoT Edge modules and connections

In part two of this three-part tutorial for predicting iron ore impurities in Azure SQL Edge, you'll set up the following IoT Edge modules:

- Azure SQL Edge
- Data generator IoT Edge module

## Create Azure Stream Analytics module

Create an Azure Stream Analytics module that will be used in this tutorial. To learn more about using streaming jobs with SQL Edge, see [Using streaming jobs with SQL Edge](stream-analytics.md).

Once the Azure Stream Analytics job is created with the hosting environment set as Edge, set up the inputs and outputs for the tutorial.

1. To create the **input**, click **+Add stream input**. Fill the details section using the following information:

   Field|Value
   -----|-----
   Event Serialization format|JSON
   Encoding|UTF-8
   Event compression type|None

2. To create the **output**, click **+Add** and choose SQL Database. Fill the details section using the following information.

   > [!NOTE]
   > The password specified in this section needs to be specified for SQL SA password when deploying the SQL Edge module in section **"Deploy the Azure SQL Edge module"**.

   Field|Value
   -----|-----
   Database|IronOreSilicaPrediction
   Server name|tcp:.,1433
   Username|sa
   Password|Specify a strong password
   Table|IronOreMeasurements1

3. Navigate to the **Query** section and set up the query as follows:

   `SELECT * INTO <name_of_your_output_stream> FROM <name_of_your_input_stream>`
   
4. Under **Configure**, select **Publish**, and then select the **Publish** button. Save the SAS URI for use with the SQL Database Edge module.

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

   _Field_|_Value_
   -------|-------
   Name|Registry name
   Address|Login server
   User Name|Username
   Password|Password
  
## Deploy the data generator module

1. In the **IoT Edge Modules** section, click **+ ADD** and select **IoT Edge module**.

2. Provide an IoT Edge module name and the image URI.
   The Image URI can be found in the container registry in the resource group. Select the **Repositories** section under **Services**. For this tutorial, choose the repository named `silicaprediction`. Select the appropriate tag. The Image URI will be of the format:

   *login server of the containerregistry*/*repository name*:*tag name*

   For example:

   ```
   ASEdemocontregistry.azurecr.io/silicaprediction:amd64
   ```

3. CLick **Add**.

## Deploy the Azure SQL Edge module

1. Deploy the Azure SQL Edge module by following the steps listed in [Deploy Azure SQL Edge (Preview)](https://docs.microsoft.com/azure/azure-sql-edge/deploy-portal).

2. On the **Specify Route** of the **Set Modules** page, specify the routes for module to IoT Edge hub communication as follows. 

   ```
   FROM /messages/modules/<your_data_generator_module>/outputs/<your_output_stream_name> INTO
   BrokeredEndpoint("/modules/<your_azure_sql_edge_module>/inputs/<your_input_stream_name>")
   ```

   For example:

   ```
   FROM /messages/modules/ASEDataGenerator/outputs/IronOreMeasures INTO BrokeredEndpoint("/modules/AzureSQLEdge/inputs/Input1")
   ```

3. In the **module twin** settings, ensure that SQLPackage and ASAJonInfo are updated with the relevant SAS URLs that you saved earlier in the tutorial.

   ```json
       {
         "properties.desired":
         {
           "SqlPackage": "<Optional_DACPAC_ZIP_SAS_URL>",
           "ASAJobInfo": "<Optional_ASA_Job_ZIP_SAS_URL>"
         }
       }
   ```

## Next Steps

- [Deploy ML model on Azure SQL Edge using ONNX](tutorial-run-ml-model-on-sql-edge.md)

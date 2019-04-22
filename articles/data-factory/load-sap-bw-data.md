---
title: Load data from SAP Business Warehouse by using Azure Data Factory | Microsoft Docs
description: 'Use Azure Data Factory to copy data from SAP Business Warehouse (BW)'
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer:

ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 03/19/2019
ms.author: jingwang

---
# Load data from SAP Business Warehouse (BW) by using Azure Data Factory

This article shows you a walkthrough on how to use the Data Factory _load data from SAP Business Warehouse (BW) via Open Hub into Azure Data Lake Storage Gen2_. You can follow similar steps to copy data to other [supported sink data stores](copy-activity-overview.md#supported-data-stores-and-formats). 

> [!TIP]
> Refer to [SAP BW Open Hub connector article](connector-sap-business-warehouse-open-hub.md) on copying data from SAP BW in general, including introduction on SAP BW Open Hub integration and delta extraction flow.

## Prerequisites

- **Azure Data Factory (ADF):** If you don't have a data factory, follow the "[Create a data factory](quickstart-create-data-factory-portal.md#create-a-data-factory)" section to create one. 

- **SAP BW Open Hub Destination (OHD) with destination type as "Database Table".** Follow [SAP BW Open Hub Destination configurations](#sap-bw-open-hub-destination-configurations) section to create one or to confirm if your existing OHD is configured properly to be integrated with ADF.

- **SAP BW user being used needs to have following permissions:**

  - Authorization for RFC and SAP BW.
  - Permissions to the “**Execute**” Activity of Authorization Object “**S_SDSAUTH**”.

- **[Self-host Integration Runtime](concepts-integration-runtime.md#self-hosted-integration-runtime) with SAP .NET connector 3.0 are required**. Below are the detailed preparations that need to be done:

  1. Install and register the Self-hosted IR with version >= 3.13 (covered in the following walkthrough). 

  2. Download the [64-bit SAP .NET Connector 3.0](https://support.sap.com/en/product/connectors/msnet.html) from SAP's website, and install it on the Self-hosted IR machine.  When installing, in the "Optional setup steps" window, make sure you select the "**Install Assemblies to GAC**" option as shown in the following image.

     ![Set up SAP .NET Connector](media/connector-sap-business-warehouse-open-hub/install-sap-dotnet-connector.png)

## Full copy from SAP BW Open Hub

On Azure portal, go to your data factory -> select **Author & Monitor** to launch the ADF UI in a separate tab. 

1. On the **Let's get started** page, select **Copy Data** to launch the Copy Data tool. 

2. On the **Properties** page, specify a name for the **Task name** field, and select **Next**.

3. On the **Source data store** page, click **+ Create new connection** -> select **SAP BW Open Hub** from the connector gallery -> select **Continue**. You can type "SAP" in the search box to filter the connectors.

4. On the **Specify SAP BW Open Hub connection** page, 

   ![Create SAP BW Open Hub linked service](media/load-sap-bw-data/create-sap-bw-open-hub-linked-service.png)

   1. Choose the **Connect via Integration Runtime**: click the drop-down list to select an existing Self-hosted IR, or create one if you don't have Self-hosted IR set up yet. 

      To create new, click **+New** in the drop-down -> select type **Self-hosted** -> specify a **Name** and click **Next** -> choose **Express setup** to install on the current machine or follow the **Manual setup** steps there.

      As mentioned in [Prerequisites](#prerequisites), make sure you also have the **SAP .NET connector 3.0** installed on the same machine where Self-hosted IR is running.

   2. Specify the SAP BW **Server name**, **System number**, **Client ID,** **Language** (if other than EN), **User name**, and **Password**.

   3. Click **Test connection** to validate the settings, then select **Finish**.

   4. You will see a new connection gets created. Select **Next**.

5. On the **Select Open Hub destinations** page, browse the Open Hub Destinations available on your SAP BW, and select the one you want to copy data from, then click **Next**.

   ![Select SAP BW Open Hub table](media/load-sap-bw-data/select-sap-bw-open-hub-table.png)

6. Specify the filter if needed. If your Open Hub Destination only contains data from single Data Transfer Process (DTP) execution with single request ID, or you are sure your DTP has finished and want to copy all the data, uncheck the **Exclude Last Request**. You can learn more on how these settings relate to your SAP BW configuration in [SAP BW Open Hub Destination configurations](#sap-bw-open-hub-destination-configurations) section. Click **Validate** to double check the data returned, then select **Next**.

   ![Configure SAP BW Open Hub filter](media/load-sap-bw-data/configure-sap-bw-open-hub-filter.png)

7. In the **Destination data store** page, click **+ Create new connection**, and then select **Azure Data Lake Storage Gen2**, and select **Continue**.

8. In the **Specify Azure Data Lake Storage connection** page, 

   ![Create ADLS Gen2 linked service](media/load-sap-bw-data/create-adls-gen2-linked-service.png)

   1. Select your Data Lake Storage Gen2 capable account from the "Storage account name" drop-down list.
   2. Select **Finish** to create the connection. Then select **Next**.

9. In the **Choose the output file or folder** page, enter "copyfromopenhub" as the output folder name, and select **Next**.

   ![Choose output folder](media/load-sap-bw-data/choose-output-folder.png)

10. In the **File format setting** page, select **Next** to use the default settings.

    ![Specify sink format](media/load-sap-bw-data/specify-sink-format.png)

11. In the **Settings** page, expand the **Performance settings**, and set **Degree of copy parallelism** such as 5 in order to load from SAP BW in parallel. Click **Next**.

    ![Configure copy settings](media/load-sap-bw-data/configure-copy-settings.png)

12. In the **Summary** page, review the settings, and select **Next**.

13. In the **Deployment** page, select **Monitor** to monitor the pipeline.

    ![Deployment page](media/load-sap-bw-data/deployment.png)

14. Notice that the **Monitor** tab on the left is automatically selected. The **Actions** column includes links to view activity run details and to rerun the pipeline:

    ![Pipeline monitoring](media/load-sap-bw-data/pipeline-monitoring.png)

15. To view activity runs that are associated with the pipeline run, select the **View Activity Runs** link in the **Actions** column. There's only one activity (copy activity) in the pipeline, so you see only one entry. To switch back to the pipeline runs view, select the **Pipelines** link at the top. Select **Refresh** to refresh the list.

    ![Activity monitoring](media/load-sap-bw-data/activity-monitoring.png)

16. To monitor the execution details for each copy activity, select the **Details** link (eyeglasses image) under **Actions** in the activity monitoring view. You can monitor details like the volume of data copied from the source to the sink, data throughput, execution steps with corresponding duration, and used configurations:

    ![Activity monitoring details](media/load-sap-bw-data/activity-monitoring-details.png)

17. Review the **maximum Request ID** that is copied. Go back to the activity monitoring view, click the **Output** under **Actions**.

    ![Activity output](media/load-sap-bw-data/activity-output.png)

    ![Activity output details](media/load-sap-bw-data/activity-output-details.png)

## Incremental copy from SAP BW Open Hub

> [!TIP]
>
> Refer to [SAP BW Open Hub connector delta extraction flow](connector-sap-business-warehouse-open-hub.md#delta-extraction-flow) to learn more on how ADF SAP BW Open Hub connector works to copy incremental data from SAP BW, and read this article from the beginning to understand the basics of connector related configurations.

Now, let's continue to configure incremental copy from SAP BW Open Hub. 

The incremental copy is using high watermark mechanism based on **request ID** automatically generated in SAP BW Open Hub Destination by DTP. The workflow for this approach is depicted in the following diagram:

![Incremental copy workflow](media/load-sap-bw-data/incremental-copy-workflow.png)

On the ADF UI **Let's get started** page, select **Create pipeline from template** to leverage the built-in template. 

1. Search "SAP BW" to find and select the template named **Incremental copy from SAP BW to Azure Data Lake Storage Gen2**. This template copies data into ADLS Gen2, you can later follow the similar flow to copy to other sink types.

2. On the template main page, select or create the following three connections, then select **Use this template** at the bottom right.

   - **Azure Blob**: in this walkthrough, we use Azure Blob to store the high watermark, which is the max copied request ID.
   - **SAP BW Open Hub**: your source to copy data from. Refer to the previous full copy walkthrough on detailed configurations.
   - **ADLS Gen2**: your sink to copy data to. Refer to the previous full copy walkthrough on detailed configurations.

   ![Incremental copy from SAP BW template](media/load-sap-bw-data/incremental-copy-from-sap-bw-template.png)

3. This template generates a pipeline with three activities - **Lookup, Copy Data, and Web** - and makes them chained on-success. Go to the pipeline **Parameters** tab, you see all the configurations you need to provide.

   ![Incremental copy from SAP BW config](media/load-sap-bw-data/incremental-copy-from-sap-bw-pipeline-config.png)

   - **SAPOpenHubDestinationName**: specify the Open Hub table name to copy data from.

   - **ADLSGen2SinkPath**: specify the destination ADLS Gen2 path to copy data to. If the path doesn't exist, ADF Copy activity will create one during execution.

   - **HighWatermarkBlobPath**: specify the path to store the high watermark value e.g. `container/path`. 

   - **HighWatermarkBlobName**: specify the blob name to store the high watermark value e.g. `requestIdCache.txt`. In your blob storage, at the corresponding path of HighWatermarkBlobPath+HighWatermarkBlobName e.g. "*container/path/requestIdCache.txt*", create a blob with content 0. 

      ![Blob content](media/load-sap-bw-data/blob.png)

   - **LogicAppURL**: in this template, we use Web activity to call Logic Apps to set the high watermark value in Blob storage. Alternatively, you can also use SQL database to store it and use Stored Procedure activity to update the value. 

      Here, you need to firstly create a Logic App as the following, then copy the **HTTP POST URL** to this field. 

      ![Logic App config](media/load-sap-bw-data/logic-app-config.png)

      1. Go to Azure portal -> new a **Logic Apps** service -> click **+Blank Logic App** to go to **Logic Apps Designer**.

      2. Create a trigger of **When a HTTP request is received**. Specify the HTTP request body as follows:

         ```json
         {
            "properties": {
               "sapOpenHubMaxRequestId": {
                  "type": "string"
               },
               "type": "object"
            }
         }
         ```

      3. Add an action of **Create blob**. For "Folder path" and "Blob name", use the same value configured in the above HighWatermarkBlobPath and HighWatermarkBlobName.

      4. Click **Save**, and then copy the value of **HTTP POST URL** to use in ADF pipeline.

4. After you provide all the values for ADF pipeline parameters, you can click **Debug** -> **Finish** to invoke a run to validate the configuration. Or, you can select **Publish All** to publish all the changes, then click **Trigger** to execute a run.

## SAP BW Open Hub Destination configurations

This section introduces the needed configuration on SAP BW side in order to use SAP BW Open Hub connector in ADF to copy data.

### Configure delta extraction in SAP BW

If you need both historical copy and incremental copy, or only incremental copy, configure delta extraction in SAP BW.

1. Create the Open Hub Destination (OHD)

   You can create the OHD in SAP Transaction RSA1, which automatically creates the required transformation and Data Transfer Process (DTP). Use the following settings:

   - Object type can be any. Here we use InfoCube as an example.
   - **Destination Type:** *Database Table*
   - **Key of the Table:** *Technical Key*
   - **Extraction:** *Keep Data and Insert Records into Table*

   ![Create SAP BW OHD delta extraction](media/load-sap-bw-data/create-sap-bw-ohd-delta.png)

   ![create-sap-bw-ohd-delta2](media/load-sap-bw-data/create-sap-bw-ohd-delta2.png)

   You might increase the number of parallel running SAP work processes for the DTP:

   ![create-sap-bw-ohd-delta3](media/load-sap-bw-data/create-sap-bw-ohd-delta3.png)

2. Schedule the DTP in process chains

   A Delta DTP for a cube only works when the needed rows have not been compressed yet. Therefore, you must make sure that BW Cube Compression is not running before the DTP to the Open Hub table. The easiest way for this is integrating this DTP into your existing process chains. In the example below, the DTP (to the OHD) is inserted in the process chain between the step Adjust (Aggregate Rollup) and Collapse (Cube Compression).

   ![create-sap-bw-process-chain](media/load-sap-bw-data/create-sap-bw-process-chain.png)

### Configure full extraction in SAP BW

In addition to the delta extraction, you might want to have a full extraction of the same InfoProvider. It usually applies if you want to do full copy without incremental need or you want to [re-sync delta extraction](#re-sync-delta-extraction).

You must not have more than one DTP for the same OHD. Therefore, you need to create an additional OHD then delta extraction.

![create-sap-bw-ohd-full](media/load-sap-bw-data/create-sap-bw-ohd-full.png)

For a full load OHD, choose different options than delta extraction:

- In OHD: set "Extraction" option as "*Delete Data and Insert Records*". Otherwise data would be extracted many times when repeating the DTP in a BW process chain.

- In DTP: set "Extraction Mode" as "*Full*". You must change the automatically created DTP from Delta to Full just after the OHD has been created:

   ![create-sap-bw-ohd-full2](media/load-sap-bw-data/create-sap-bw-ohd-full2.png)

- In ADF SAP BW Open Hub connector: turn off the option "*Exclude last request*". Otherwise nothing would be extracted. 

You typically run the Full DTP manually. Or you might also create a process chain for the Full DTP - it would usually be a separate process chain independent from your existing process chains. In either case, you must **make sure the DTP has finished before starting the extraction using ADF copy**, otherwise, partial data will be copied.

### Run delta extraction the first time

The first Delta Extraction is technically a **Full Extraction**. Note by default ADF SAP BW Open Hub connector excludes the last request when copying the data. In the case of delta extraction for the first time, in ADF copy activity, no data will be extracted until there is subsequent DTP generates delta data in the table with separate request ID. While there are two possible ways to avoid this scenario:

1. Turn off the option "Exclude last request" for the first Delta Extraction
   In this case you need to make sure that the first Delta DTP has finished before starting the Delta Extraction the first time
2. Use the procedure for re-syncing the Delta Extraction as described below.

### Re-sync delta extraction

There are a few scenarios which change the data in SAP BW Cubes but are not considered by the Delta DTP:

- SAP BW Selective Deletion (of rows using any filter condition)
- SAP BW Request Deletion (of faulty request)

An SAP Open Hub Destination is not a data-mart-controlled data target (in all SAP BW Support Packages since the year 2015). Therefore, it is possible to delete data from a cube without changing the data in the OHD. In this case, you must re-sync the data of the cube with the data in ADF by performing the following steps:

1. Run a Full Extraction in ADF (by using a Full DTP in SAP)
2. Delete all rows in the Open Hub table for the Delta DTP
3. Set the status of the Delta DTP to Fetched

After this, all subsequent Delta DTPs and ADF Delta Extractions work fine as expected.

You can set the status of the Delta DTP to Fetched by running the Delta DTP manually using the following option: “*No Data Transfer; Delta Status in Source: Fetched*”.

## Next steps

Advance to the following article to learn about SAP BW Open Hub connector support: 

> [!div class="nextstepaction"]
>[SAP Business Warehouse Open Hub connector](connector-sap-business-warehouse-open-hub.md)

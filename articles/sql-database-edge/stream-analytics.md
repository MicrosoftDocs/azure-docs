---
title: Using SQL Database DAC Package and Stream Analytics jobs with Azure SQL Database Edge | Microsoft Docs
description: Learn about using Stream Analytics jobs in SQL Database Edge
keywords: sql database edge, stream analytics, sqlpackage
services: sql-database-edge
ms.service: sql-database-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 11/04/2019
---

# Using SQL Database DAC Package and Stream Analytics job with SQL Database Edge

Azure SQL Database Edge Preview is an optimized relational database engine geared for IoT and edge deployments. It is built on the latest versions of the Microsoft SQL Server Database Engine, which provides industry-leading performance, security and query processing capabilities. Along with the industry-leading relational database management capabilities of SQL Server, Azure SQL Database Edge provides in-built streaming capability for real-time analytics and complex event-processing.

Azure SQL Database Edge also provides a native implementation of SQLPackage.exe that enables users to deploy a [SQL Database DAC](https://docs.microsoft.com/sql/relational-databases/data-tier-applications/data-tier-applications) package during the deployment of SQL Database Edge.

Azure SQL Database Edge exposes two optional parameters through the *module twin's desired properties* option of the IoT Edge Module.

```json
{
    "properties.desired":
    {
        "SqlPackage": "<Optional_DACPAC_ZIP_SAS_URL>",
        "ASAJobInfo": "<Optional_ASA_Job_ZIP_SAS_URL>"
    }
}
```

|Field | Description |
|------|-------------|
| SQLPackage | Azure Blob Storage URI for the *.zip file containing the SQL Database DAC package.
| ASAJobInfo | Azure Blob Storage URI for the ASA Edge job. For more information on publishing the ASA Edge job, refer [Publishing an ASA Edge job for SQL Database Edge]().

## Using SQL Database DAC packages with SQL Database Edge

To use a SQL Database DAC package (*.dacpac) with SQL Database Edge, please follow the steps mentioned below.

1. Create or extract a SQL Database DAC package. You can use the concepts mentioned in [Extracting DAC from an existing database](/sql/relational-databases/data-tier-applications/extract-a-dac-from-a-database/) to generate a DacPac for an existing SQL Database.

2. Zip the **.dacpac* and upload to an Azure Blob storage account. For more information on uploading files to Azure Blob Storage, see [Upload, download, and list blobs with the Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md).

3. Generate a SAS signature for the zip file using Azure portal. For more information, see [Delegate access with Shared Access Signatures (SAS)](../storage/common/storage-sas-overview.md).

4. Update the SQL Database Edge Module configuration to include the SAS URI for the DAC package. To update the SQL Database Edge module

    1. On the Azure portal, browse to your IoT Hub deployment.

    2. On the left side pane, click on **IoT Edge**.

    3. On the **IoT Edge** page, find and click on the IoT Edge where the SQL Database Edge module is deployed.

    4. On the *IoT Edge Device* device page, click on **Set Module**. 

    5. On the **Set modules** page click on *configure* against the SQL Database Edge module. 

    6. On the **IoT Edge Custom Modules** pane, select the *Set modules twin's desired properties* and then update the desired properties to include the URI for the SQLPackage option as shown in the example below. 

        > [!NOTE]
        > The SAS URI below is for illustration only. Please replace the URI with the actual URI from your deployment.

        ```json
            {
                "properties.desired":
                {
                    "SqlPackage": "https://StorageAccountName.blob.core.windows.net/SQLpackageFiles/MeasurementsDB.zip?sp=r&st=2019-09-01T00:00:00Z&se=2019-09-30T00:00:00Z&spr=https&sv=2019-02-02&sr=b&sig=Uh8X0E50qzlxkiKVBJKU3ccVQYwF235qTz7AXp4R3gI%3D",
                }
            }
        ```

    7. Click **Save**.

    8. On the **Set modules** page click *Next*.

    9. On the **Set modules** page click *Next* and then click **Submit**.

5. Post the module update, the dacpac file is downloaded, unzipped, and deployed against the SQL Database Edge instance.

## Using streaming jobs with SQL Database Edge

Azure SQL Database Edge has a native implementation of stream analytics runtime. This enables users to create an Azure Stream Analytics Edge job and deploy that job as a SQL Database Edge streaming job. To create a stream analytics Edge job, follow the steps below.

1. Browse to the Azure portal using the preview [URL](https://portal.azure.com/?microsoft_azure_streamanalytics_edgeadapterspreview=true). This preview URL enables users to configure SQL Database output for a stream analytics edge job.

2. Create a new **Azure Stream Analytics on IoT Edge** job and choose the hosting environment targeting **Edge**.

3. Define *input* and *output* for the Azure Stream Analytics job. Each SQL output (configured below) is tied to a single table within the database. If there is a need to stream data to multiple tables, you'll need to create multiple SQL Database outputs. The SQL outputs can be configured to point to different databases.

    *Input - Choose EdgeHub as the input for the Edge job, and fill in the resource info.*

    *Output - Select SQL Database as output, “Provide SQL Database settings manually” and provide the configuration details for the database and table.*

    |Field      | Description |
    |---------------|-------------|
    |Output alias | Name of the Output alias.|
    |Database | Name of the SQL Database. This needs to be a valid database name, which exists on the SQL Database Edge instance.|
    |Server name | Name (or IP address) and port number details for the SQL instance. For a SQL Database Edge deployment you can use **tcp:.,1433** as the server name.|
    |Username | SQL login account that has data reader and data writer access to the database mentioned above.|
    |Password | Password for the SQL login account mentioned above.|
    |Table | Name of the Table that will be output for the streaming job.|
    |Inherit Partitioning| This SQL output configuration option enables inheriting the partitioning scheme of your previous query step or input. With this enabled, writing to a disk-based table and having a fully parallel topology for your job, expect to see better throughput.|
    |Batch Size| Batch size is the maximum number of records that is sent with every bulk insert transaction.|

    Sample input/output configuration below:

    ```txt
        Input:
            Input from EdgeHub
            Input alias: input
            Event serialization format: JSON
            Encoding: UTF-8
            Event compression type: None

        Output :
            Output alias: output
            Database:  MeasurementsDB
            Server name: tcp:.,1433
            Username: sa
            Password: <Password>
            Table: TemperatureMeasurements
            Inherit Partitioning: Merge all input partitions into a single writer
            Max batch count: 10000
    ```

    > [!NOTE]
    > For more information on the SQL output adapter for Azure Stream Analytics, see [Azure Stream Analytics output to Azure SQL Database](../stream-analytics/stream-analytics-sql-output-perf.md).

4. Define the ASA job query for the edge job. This query should use the defined input/output aliases as the input and output names in the query. For more information, see [Stream Analytics Query Language Reference](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference).

5. Set the storage Account Settings for the Edge job. The storage account is used as the publishing target for the edge job.

6. Under Configure, select Publish, and click Publish button. Save SAS URL for use with the SQL Database Edge module.

### Deploy the stream analytics edge job to the SQL Database Edge

To deploy the streaming job to the SQL Database Edge module, update the SQL Database Edge Module configuration to include the SAS URI for the streaming job from the step above. To update the SQL Database Edge module

1. On the Azure portal, browse to your IoT Hub deployment.

2. On the left side pane, click on **IoT Edge**.

3. On the **IoT Edge** page, find and click on the IoT Edge where the SQL Database Edge module is deployed.

4. On the *IoT Edge Device* device page, click on **Set Module**. 

5. On the **Set modules** page click on *configure* against the SQL Database Edge module. 

6. On the **IoT Edge Custom Modules** pane select the *Set modules twin's desired properties* and then update the desired properties to include the URI for the ASAJobInfo option as shown in the example below. 

    > [!NOTE]
    > The SAS URI below is for illustration only. Please replace the URI with the actual URI from your deployment.

    ```json
        {
            "properties.desired":
            {
                "ASAJobInfo": "https://storageAccountName.blob.core.windows.net/asajobs/ASAEdgeJobs/5a9b34db-7a5c-4606-adae-4c8609eaa1c7/d85b5aa6-4d38-4703-bb34-af7f0bd7916d/ASAEdgeJobDefinition.zip?sv=2018-03-28&sr=b&sig=HH%2BFMsEy378RaTxIy2Xo6rM6wDaqoBaZ5zFDBqdZiS0%3D&st=2019-09-01T22%3A24%3A34Z&se=2019-09-30T22%3A34%3A34Z&sp=r"   
            }
        }
    ```

7. Click **Save**.

8. On the **Set modules** page click *Next*.

9. On the **Set modules** page click *Next* and then click **Submit**.

10. Post the module update, the stream analytics job file is downloaded, unzipped, and deployed against the SQL Database Edge instance.

## Next steps

- For pricing and availability-related details, see [Azure SQL Database Edge](https://azure.microsoft.com/services/sql-database-edge/).
- Request to enable Azure SQL Database Edge for your subscription.
- To get started, see the following:
  - [Deploy SQL Database Edge through Azure portal](deploy-portal.md)

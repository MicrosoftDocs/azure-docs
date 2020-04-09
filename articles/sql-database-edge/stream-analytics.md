---
title: Using SQL Database DAC packages and Stream Analytics jobs with Azure SQL Database Edge | Microsoft Docs
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

# Using SQL Database DAC packages and Stream Analytics jobs with SQL Database Edge

Azure SQL Database Edge Preview is an optimized relational database engine geared for IoT and edge deployments. It's built on the latest versions of the Microsoft SQL Server Database Engine, which provides industry-leading performance, security, and query processing capabilities. Along with the industry-leading relational database management capabilities of SQL Server, Azure SQL Database Edge provides in-built streaming capability for real-time analytics and complex event-processing.

Azure SQL Database Edge also provides a native implementation of SqlPackage.exe that enables you to deploy a [SQL Database DAC](https://docs.microsoft.com/sql/relational-databases/data-tier-applications/data-tier-applications) package during the deployment of SQL Database Edge.

Azure SQL Database Edge exposes two optional parameters through the `module twin's desired properties` option of the IoT Edge module:

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
| SqlPackage | Azure Blob storage URI for the *.zip file that contains the SQL Database DAC package.
| ASAJobInfo | Azure Blob storage URI for the ASA Edge job. For more information, see [Publishing an ASA Edge job for SQL Database Edge](/azure/sql-database-edge/stream-analytics#using-streaming-jobs-with-sql-database-edge).

## Using SQL Database DAC packages with SQL Database Edge

To use a SQL Database DAC package (*.dacpac) with SQL Database Edge, take these steps:

1. Create or extract a SQL Database DAC package. See [Extracting a DAC from a database](/sql/relational-databases/data-tier-applications/extract-a-dac-from-a-database/) for information on how to generate a DAC package for an existing SQL Server database.

2. Zip the *.dacpac and upload it to an Azure Blob storage account. For more information on uploading files to Azure Blob storage, see [Upload, download, and list blobs with the Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md).

3. Generate a shared access signature for the zip file by using the Azure portal. For more information, see [Delegate access with shared access signatures (SAS)](../storage/common/storage-sas-overview.md).

4. Update the SQL Database Edge module configuration to include the shared access URI for the DAC package. To update the SQL Database Edge module, take these steps:

    1. In the Azure portal, go to your IoT Hub deployment.

    2. In the left pane, select **IoT Edge**.

    3. On the **IoT Edge** page, find and select the IoT edge where the SQL Database Edge module is deployed.

    4. On the **IoT Edge Device** device page, select **Set Module**.

    5. On the **Set modules** page, select **Configure** against the SQL Database Edge module.

    6. In the **IoT Edge Custom Modules** pane, select **Set module twin's desired properties**. Update the desired properties to include the URI for the `SQLPackage` option, as shown in the following example.

        > [!NOTE]
        > The SAS URI in the following JSON is just an example. Replace the URI with the actual URI from your deployment.

        ```json
            {
                "properties.desired":
                {
                    "SqlPackage": "https://StorageAccountName.blob.core.windows.net/SQLpackageFiles/MeasurementsDB.zip?sp=r&st=2019-09-01T00:00:00Z&se=2019-09-30T00:00:00Z&spr=https&sv=2019-02-02&sr=b&sig=Uh8X0E50qzlxkiKVBJKU3ccVQYwF235qTz7AXp4R3gI%3D",
                }
            }
        ```

    7. Select **Save**.

    8. On the **Set modules** page, select **Next**.

    9. On the **Set modules** page, select **Next** and then **Submit**.

5. After the module update, the DAC package file is downloaded, unzipped, and deployed against the SQL Database Edge instance.

## Using streaming jobs with SQL Database Edge

Azure SQL Database Edge has a native implementation of the stream analytics runtime. This implementation enables you to create an Azure Stream Analytics edge job and deploy that job as a SQL Database Edge streaming job. To create a Stream Analytics edge job, complete these steps:

1. Go to the Azure portal by using the preview [URL](https://portal.azure.com/?microsoft_azure_streamanalytics_edgeadapterspreview=true). This preview URL enables you to configure SQL Database output for a Stream Analytics edge job.

2. Create a new **Azure Stream Analytics on IoT Edge** job. Choose the hosting environment that targets **Edge**.

3. Define an input and output for the Azure Stream Analytics job. Each SQL output, which you'll set up here, is tied to a single table in the database. If you need to stream data to multiple tables, you'll need to create multiple SQL Database outputs. You can configure the SQL outputs to point to different databases.

    **Input**. Choose EdgeHub as the input for the edge job, and provide the resource info.

    **Output**. Select SQL Database the as output. Select **Provide SQL Database settings manually**. Provide the configuration details for the database and table.

    |Field      | Description |
    |---------------|-------------|
    |Output alias | Name of the output alias.|
    |Database | Name of the SQL database. It needs to be a valid name of a database that exists on the SQL Database Edge instance.|
    |Server name | Name (or IP address) and port number details for the SQL instance. For a SQL Database Edge deployment, you can use **tcp:.,1433** for the server name.|
    |Username | SQL sign-in account that has data reader and data writer access to the database that you specified earlier.|
    |Password | Password for the SQL sign-in account that you specified earlier.|
    |Table | Name of the table that will be output for the streaming job.|
    |Inherit Partitioning| Enables inheriting the partitioning scheme of your previous query step or input. When this option is enabled, you can expect to see better throughput when you write to a disk-based table and have a fully parallel topology for your job.|
    |Batch Size| The maximum number of records that's sent with every bulk insert transaction.|

    Here's a sample input/output configuration:

    ```txt
        Input:
            Input from EdgeHub
            Input alias: input
            Event serialization format: JSON
            Encoding: UTF-8
            Event compression type: None

        Output:
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

4. Define the ASA job query for the edge job. This query should use the defined input/output aliases as the input and output names in the query. For more information, see [Stream Analytics Query Language reference](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference).

5. Set the storage account settings for the edge job. The storage account is used as the publishing target for the edge job.

6. Under **Configure**, select **Publish**, and then select the **Publish** button. Save the SAS URI for use with the SQL Database Edge module.

### Deploy the Stream Analytics edge job to SQL Database Edge

To deploy the streaming job to the SQL Database Edge module, update the SQL Database Edge module configuration to include the SAS URI for the streaming job from the earlier step. To update the SQL Database Edge module:

1. In the Azure portal, go to your IoT Hub deployment.

2. In the left pane, select **IoT Edge**.

3. On the **IoT Edge** page, find and select the IoT edge where the SQL Database Edge module is deployed.

4. On the **IoT Edge Device** device page, select **Set Module**.

5. On the **Set modules** page, select **Configure** against the SQL Database Edge module.

6. In the **IoT Edge Custom Modules** pane, select **Set module twin's desired properties**. Update the desired properties to include the URI for the `ASAJobInfo` option, as shown in the following example.

    > [!NOTE]
    > The SAS URI in the following JSON is just an example. Replace the URI with the actual URI from your deployment.

    ```json
        {
            "properties.desired":
            {
                "ASAJobInfo": "https://storageAccountName.blob.core.windows.net/asajobs/ASAEdgeJobs/5a9b34db-7a5c-4606-adae-4c8609eaa1c7/d85b5aa6-4d38-4703-bb34-af7f0bd7916d/ASAEdgeJobDefinition.zip?sv=2018-03-28&sr=b&sig=HH%2BFMsEy378RaTxIy2Xo6rM6wDaqoBaZ5zFDBqdZiS0%3D&st=2019-09-01T22%3A24%3A34Z&se=2019-09-30T22%3A34%3A34Z&sp=r"   
            }
        }
    ```

7. Select **Save**.

8. On the **Set modules** page, select **Next**.

9. On the **Set modules** page, select **Next** and then **Submit**.

10. After the module update, the stream analytics job file is downloaded, unzipped, and deployed against the SQL Database Edge instance.

## Next steps

- For pricing and availability details, see [Azure SQL Database Edge](https://azure.microsoft.com/services/sql-database-edge/).
- Request enabling Azure SQL Database Edge for your subscription.
- To get started, see [Deploy SQL Database Edge through Azure portal](deploy-portal.md).

---
title: Using Azure Stream Analytics Edge jobs with Azure SQL Edge (Preview)
description: Learn about using Stream Analytics jobs in Azure SQL Edge (Preview)
keywords: SQL Edge, stream analytics, 
services: sql-edge
ms.service: sql-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 05/19/2020
---

# Using Azure Stream Analytics jobs with SQL Edge

Azure SQL Edge (Preview) is an optimized relational database engine geared for IoT and edge deployments. It's built on the latest versions of the Microsoft SQL Server Database Engine, which provides industry-leading performance, security, and query processing capabilities. Along with the industry-leading relational database management capabilities of SQL Server, Azure SQL Edge provides in-built streaming capability for real-time analytics and complex event-processing.

Azure SQL Edge has a native implementation of the stream analytics runtime. This implementation enables you to create an Azure Stream Analytics edge job and deploy that job as a SQL Edge streaming job. Azure Stream Analytics jobs can be deployed to SQL Edge using the ASAJobInfo parameter exposed via the `module twin's desired properties` option of the SQL Edge module:

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
| ASAJobInfo | Azure Blob storage URI for the ASA Edge job.

## Create an Azure Stream Analytics Edge Job

1. Go to the Azure portal.

2. Create a new **Azure Stream Analytics on IoT Edge** job. Choose the hosting environment that targets **Edge**.

3. Define an input and output for the Azure Stream Analytics job. Each SQL output, which you'll set up here, is tied to a single table in the database. If you need to stream data to multiple tables, you'll need to create multiple SQL Database outputs. You can configure the SQL outputs to point to different databases.

    **Input**. Choose EdgeHub as the input for the edge job, and provide the resource info.

    **Output**. Select SQL Database the as output. Select **Provide SQL Database settings manually**. Provide the configuration details for the database and table.

    |Field      | Description |
    |---------------|-------------|
    |Output alias | Name of the output alias.|
    |Database | Name of the SQL database. It needs to be a valid name of a database that exists on the SQL Edge instance.|
    |Server name | Name (or IP address) and port number details for the SQL instance. For a SQL Edge deployment, you can use **tcp:.,1433** for the server name.|
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

6. Under **Configure**, select **Publish**, and then select the **Publish** button. Save the SAS URI for use with the SQL Edge module.

## Deploy Azure Stream Analytics Edge job to SQL Edge

To deploy the streaming job to the SQL Edge module, update the SQL Edge module configuration to include the SAS URI for the streaming job from the earlier step. To update the SQL Edge module:

1. In the Azure portal, go to your IoT Hub deployment.

2. In the left pane, select **IoT Edge**.

3. On the **IoT Edge** page, find and select the IoT Edge where the SQL Edge module is deployed.

4. On the **IoT Edge Device** device page, select **Set Module**.

5. On the **Set modules** page, select **Configure** against the SQL Edge module.

6. In the **IoT Edge Custom Modules** pane, select **Set module twin's desired properties**. Update the desired properties to include the URI for the `ASAJobInfo` option, as shown in the following example.

    > [!NOTE]
    > The SAS URI in the following JSON is just an example. Replace the URI with the actual URI from your deployment.

    ```json
        {
            "properties.desired":
            {
                "ASAJobInfo": "<<<SAS URL For the published ASA Edge Job>>>>"
            }
        }
    ```

7. Select **Save**.

8. On the **Set modules** page, select **Next**.

9. On the **Set modules** page, select **Next** and then **Submit**.

10. After the module update, the stream analytics job file is downloaded, unzipped, and deployed against the SQL Edge instance.

## Next steps

- [Deploy SQL Edge through Azure portal](deploy-portal.md).

- [Stream Data](stream-data.md)

- [Machine learning and AI with ONNX in SQL Edge (Preview)](onnx-overview.md)

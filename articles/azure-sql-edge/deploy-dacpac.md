---
title: Using SQL Database DAC packages - Azure SQL Edge (Preview)
description: Learn about using dacpacs in Azure SQL Edge (Preview)
keywords: SQL Edge, sqlpackage
services: sql-edge
ms.service: sql-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 05/19/2020
---

# SQL Database DAC packages in SQL Edge

Azure SQL Edge (Preview) is an optimized relational database engine geared for IoT and edge deployments. It's built on the latest versions of the Microsoft SQL Server Database Engine, which provides industry-leading performance, security, and query processing capabilities. Along with the industry-leading relational database management capabilities of SQL Server, Azure SQL Edge provides in-built streaming capability for real-time analytics and complex event-processing.

Azure SQL Edge also provides a native implementation of SqlPackage.exe that enables you to deploy a [SQL Database DAC](https://docs.microsoft.com/sql/relational-databases/data-tier-applications/data-tier-applications) package during the deployment of SQL Edge. SQL Database dacpacs can be deployed to SQL Edge using the SqlPackage parameter exposed via the `module twin's desired properties` option of the SQL Edge module:

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

## Use a SQL Database DAC package with SQL Edge

To use a SQL Database DAC package (*.dacpac) with SQL Edge, follow these steps:

1. Create or extract a SQL Database DAC package. See [Extracting a DAC from a database](/sql/relational-databases/data-tier-applications/extract-a-dac-from-a-database/) for information on how to generate a DAC package for an existing SQL Server database.

2. Zip the *.dacpac and upload it to an Azure Blob storage account. For more information on uploading files to Azure Blob storage, see [Upload, download, and list blobs with the Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md).

3. Generate a shared access signature for the zip file by using the Azure portal. For more information, see [Delegate access with shared access signatures (SAS)](../storage/common/storage-sas-overview.md).

4. Update the SQL Edge module configuration to include the shared access URI for the DAC package. To update the SQL Edge module, take these steps:

    1. In the Azure portal, go to your IoT Hub deployment.

    2. In the left pane, select **IoT Edge**.

    3. On the **IoT Edge** page, find and select the IoT Edge where the SQL Edge module is deployed.

    4. On the **IoT Edge Device** device page, select **Set Module**.

    5. On the **Set modules** page, select **Configure** against the SQL Edge module.

    6. In the **IoT Edge Custom Modules** pane, select **Set module twin's desired properties**. Update the desired properties to include the URI for the `SQLPackage` option, as shown in the following example.

        > [!NOTE]
        > The SAS URI in the following JSON is just an example. Replace the URI with the actual URI from your deployment.

        ```json
            {
                "properties.desired":
                {
                    "SqlPackage": "<<<SAS URL for the *.zip file containing the dacpac",
                }
            }
        ```

    7. Select **Save**.

    8. On the **Set modules** page, select **Next**.

    9. On the **Set modules** page, select **Next** and then **Submit**.

5. After the module update, the DAC package file is downloaded, unzipped, and deployed against the SQL Edge instance.

On each restart of the Azure SQL Edge container, the *.dacpac file package is download and evaluated for changes. If a new version of the dacpac file is encountered, the changes are deployed to the database in SQL Edge.

## Next steps

- [Deploy SQL Edge through Azure portal](deploy-portal.md).
- [Stream Data](stream-data.md)
- [Machine learning and AI with ONNX in SQL Edge (Preview)](onnx-overview.md)

---
title: Using SQL Database DACPAC and BACPAC packages - Azure SQL Edge
description: Learn about using dacpacs and bacpacs in Azure SQL Edge
author: rwestMSFT
ms.author: randolphwest
ms.reviewer: randolphwest
ms.date: 09/03/2020
ms.service: sql-edge
ms.topic: conceptual
keywords:
  - SQL Edge
  - sqlpackage
services: sql-edge
---

# SQL Database DACPAC and BACPAC packages in SQL Edge

Azure SQL Edge is an optimized relational database engine geared for IoT and edge deployments. It's built on the latest versions of the Microsoft SQL Database Engine, which provides industry-leading performance, security, and query processing capabilities. Along with the industry-leading relational database management capabilities of SQL Server, Azure SQL Edge provides in-built streaming capability for real-time analytics and complex event-processing.

Azure SQL Edge provides native mechanism that enable you to deploy a [SQL Database DACPAC and BACPAC](/sql/relational-databases/data-tier-applications/data-tier-applications) package during, or after deploying SQL Edge.

SQL Database dacpac and bacpac packages can be deployed to SQL Edge using the `MSSQL_PACKAGE` environment variable. The environment variable can be configured with any of the following.  
- A local folder location within the SQL container containing the dacpac and bacpac files. This folder can be mapped to a host volume using either mount points or data volume containers. 
- A local file path within the SQL container mapping to the dacpac or the bacpac file. This file path can be mapped to a host volume using either mount points or data volume containers. 
- A local file path within the SQL container mapping to a zip file containing the dacpac or bacpac files. This file path can be mapped to a host volume using either mount points or data volume containers. 
- An Azure Blob SAS URL to a zip file containing the dacpac and bacpac files.
- An Azure Blob SAS URL to a dacpac or a bacpac file. 

## Use a SQL Database DAC package with SQL Edge

To deploy (or import) a SQL Database DAC package `(*.dacpac)` or a BACPAC file `(*.bacpac)` using Azure Blob storage and a zip file, follow the steps below. 

1. Create/Extract a DAC package or Export a Bacpac File using one of the mechanism mentioned below. 
    - Use [SQL Database Project Extension - Azure Data Studio](/sql/azure-data-studio/extensions/sql-database-project-extension-getting-started) to [create a new database project or export an existing database](/sql/azure-data-studio/extensions/sql-database-project-extension-getting-started)
    - Create or extract a SQL Database DAC package. See [Extracting a DAC from a database](/sql/relational-databases/data-tier-applications/extract-a-dac-from-a-database/) for information on how to generate a DAC package for an existing SQL Server database.
    - Exporting a deployed DAC package or a database. See [Export a Data-tier Application](/sql/relational-databases/data-tier-applications/export-a-data-tier-application/) for information on how to generate a bacpac file for an existing SQL Server database.

> [!NOTE]
> If you are using external streaming jobs as part of the database, please ensure the following:
> 
> - The generated dacpac will capture all the SQL Server Objects corresponding to the inputs/output streams and the streaming jobs. But the jobs will not be automatically started. In order to have the external streaming job automatically started after deployment, add a post-deployment script that restarts the jobs as follows:
>   
>   ```
>   exec sys.sp_stop_streaming_job @name=N'<JOB NAME>';
>   GO
>   exec sys.sp_start_streaming_job @name=N'<JOB NAME>';
>   GO
>   ```
>   
> - Ensure any credentials required by the external streaming jobs to access input or output streams are provided as part of the dacpac.



2. Zip the `*.dacpac` or the `*.bacpac` file and upload it to an Azure Blob storage account. For more information on uploading files to Azure Blob storage, see [Upload, download, and list blobs with the Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md).

3. Generate a shared access signature for the zip file by using the Azure portal. For more information, see [Delegate access with shared access signatures (SAS)](../storage/common/storage-sas-overview.md).

4. Update the SQL Edge module configuration to include the shared access URI for the DAC package. To update the SQL Edge module, take these steps:

    1. In the Azure portal, go to your IoT Hub deployment.

    2. In the left pane, select **IoT Edge**.

    3. On the **IoT Edge** page, find and select the IoT Edge where the SQL Edge module is deployed.

    4. On the **IoT Edge Device** device page, select **Set Module**.

    5. On the **Set modules** page, and click on the Azure SQL Edge module.

    6. On the **Update IoT Edge Module** pane, select **Environment Variables**. Add the `MSSQL_PACKAGE` environment variable and specify the SAS URL generated in Step 3 above as the value for the environment variable. 

    7. Select **Update**.

    8. On the **Set modules** page, select **Review + create**.

    9. On the **Set modules** page, select **Create**.

5. After the module update, the package files are downloaded, unzipped, and deployed against the SQL Edge instance.

On each restart of the Azure SQL Edge container, SQL Edge attempts to download the zipped file package and evaluate for changes. If a new version of the dacpac file is encountered, the changes are deployed to the database in SQL Edge.

## Known Issue

During some DACPAC or BACPAC deployments users may encounter a command timeouts, resulting in the failure of the dacpac deployment operation. If you encounter this problem, please use the SQLPackage.exe (or SQL Client Tools) to apply the DACPAC or BACPAC maually. 

## Next steps

- [Deploy SQL Edge through Azure portal](deploy-portal.md).
- [Stream Data](stream-data.md)
- [Machine learning and AI with ONNX in SQL Edge](onnx-overview.md)

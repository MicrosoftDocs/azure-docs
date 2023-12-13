---
title: Manage workspace libraries for Apache Spark
description: Learn how to add and manage libraries to workspace in Azure Synapse Analytics.
author: shuaijunye
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 11/03/2022
ms.author: shuaijunye
ms.subservice: spark
---

# Workspace packages

Workspace packages can be custom or private wheel (Python), jar (Scala/Java), or tar.gz (R) files. You can upload these packages to your workspace and later assign them to a specific Spark pool.

To add workspace packages:
1. Navigate to the **Manage** > **Workspace packages** tab.
2. Upload your wheel files by using the file selector.
3. Once the files have been uploaded to the Azure Synapse workspace, you can add these packages to a given Apache Spark pool.

  :::image type="content" source="./media/apache-spark-azure-portal-add-libraries/studio-add-workspace-package.png" alt-text="Screenshot that highlights workspace packages." lightbox="./media/apache-spark-azure-portal-add-libraries/studio-add-workspace-package.png":::

>[!WARNING]
>- Within Azure Synapse, an Apache Spark pool can leverage custom libraries that are either uploaded  as Workspace Packages or uploaded within a well-known Azure Data Lake Storage path. However, both of these options cannot be used simultaneously within the same Apache Spark pool. If packages are provided using both methods, only the wheel files specified in the Workspace packages list will be installed. 
>
>- Once Workspace Packages are used to install packages on a given Apache Spark pool, there is a limitation that you can no longer specify packages using the Storage account path on the same pool.  

> [!NOTE]
> It's recommended that you don't have multiple wheel packages with the same name in a workspace. If you want to use a different version of the same wheel package, you have to delete the existing version and upload the new one.

## Storage account
Custom-built wheel packages can be installed on the Apache Spark pool by uploading all the wheel files into the Azure Data Lake Storage (Gen2) account that is linked with the Synapse workspace. 

The files should be uploaded to the following path in the storage account's default container: 

```
abfss://<file_system>@<account_name>.dfs.core.windows.net/synapse/workspaces/<workspace_name>/sparkpools/<pool_name>/libraries/python/
```

>[!WARNING]
> - In some cases, you may need to create the file path based on the structure above if it does not already exist. For example, you may need to add the ```python``` folder within the ```libraries``` folder if it does not already exist.
> - This method of managing custom wheel files will not be supported on the Azure Synapse Runtime for Apache Spark 3.0. Please refer to the Workspace packages feature to manage custom wheel files.

> [!IMPORTANT]
> To install custom libraries using the Azure DataLake Storage method, you must have the **Storage Blob Data Contributor** or **Storage Blob Data Owner** permissions on the primary Gen2 Storage account that is linked to the Azure Synapse Analytics workspace.

## Next steps
- View the default libraries: [Apache Spark version support](apache-spark-version-support.md)
- Troubleshoot library installation errors: [Troubleshoot library errors](apache-spark-troubleshoot-library-errors.md)
- Create a private Conda channel using your Azure Data Lake Storage Account: [Conda private channels](./spark/../apache-spark-custom-conda-channel.md)

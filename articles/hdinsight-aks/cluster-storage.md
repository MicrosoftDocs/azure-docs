---
title: Introduction to cluster storage
description: Understand how Azure HDInsight on AKS integrates with Azure Storage
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/3/2023
---

# Introduction to cluster storage

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

Azure HDInsight on AKS can seamlessly integrate with Azure Storage, which is a general-purpose storage solution that works well with many other Azure services. 
Azure Data Lake Storage Gen2 (ADLS Gen 2) is the default file system for the clusters. 

The storage account could be used as the default location for data, cluster logs, and other output that are generated during cluster operation. It could also be a default storage for the Hive catalog that depends on the cluster type.

For more information, see [Introduction to Azure Data Lake Storage Gen2](/azure/storage/blobs/create-data-lake-storage-account).

## Managed identities for secure file access

Azure HDInsight on AKS uses managed identities (MSI) to secure cluster access to files in Azure Data Lake Storage Gen2. Managed identity is a feature of Microsoft Entra ID that provides Azure services with a set of automatically managed credentials. These credentials can be used to authenticate to any service that supports Active Directory authentication. Moreover, managed identities don't require you to store credentials in code or configuration files. 

In Azure HDInsight on AKS, once you select a managed identity and storage during cluster creation, the managed identity can seamlessly work with storage for data management, provided the **Storage Blob Data Owner** role is assigned to the user-assigned MSI. 

The following table outlines the supported storage options for Azure HDInsight on AKS (public preview):

|Cluster Type|Supported Storage|Connection|Role on Storage|
|---|---|---|---|
|Trino, Apache Flink, and Apache Spark |ADLS Gen2|Cluster user-assigned managed identity (MSI) | The user-assigned MSI needs to have **Storage Blob Data Owner** role on the storage account.|

> [!NOTE]
> To share a storage account across multiple clusters, you can just assign the corresponding cluster user-assigned MSI “Storage Blob Data Owner” on the shared storage account. Learn how to [assign a role](/azure/role-based-access-control/role-assignments-portal#step-2-open-the-add-role-assignment-page).

After that, you can use the full storage `abfs://` path to access the data via your applications.

For more information, see [Managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/overview).
<br>Learn how to [create an ADLS Gen2 account](/azure/storage/blobs/create-data-lake-storage-account).

## Azure HDInsight on AKS storage architecture

The following diagram provides an abstract view of the Azure HDInsight on AKS architecture of Azure Storage.

:::image type="content" source="./media/cluster-storage/storage-architecture.png" alt-text="Screenshot showing storage architecture.":::

### Storage management

Currently, Azure HDInsight on AKS doesn't support storage accounts with soft delete enabled, make sure you disable soft delete for your storage account.

:::image type="content" source="./media/cluster-storage/soft-delete.png" alt-text="Screenshot showing portal UI for soft delete." border="true" lightbox="./media/cluster-storage/soft-delete.png":::

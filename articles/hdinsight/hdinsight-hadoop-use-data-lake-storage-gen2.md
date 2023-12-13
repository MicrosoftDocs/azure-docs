---
title: Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters
description: Learn how to use Azure Data Lake Storage Gen2 with Azure HDInsight clusters.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive,seoapr2020
ms.date: 04/24/2023
---

# Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters

[Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md) is a cloud storage service dedicated to big data analytics, built on [Azure Blob storage](../storage/blobs/storage-blobs-introduction.md). Data Lake Storage Gen2 combines the capabilities of Azure Blob storage and Azure Data Lake Storage Gen1. The resulting service offers features from Azure Data Lake Storage Gen1 including: file system semantics, directory-level and file-level security, and adaptability. Along with the low-cost, tiered storage, high availability, and disaster-recovery capabilities from Azure Blob storage.

For a full comparison of cluster creation options using Data Lake Storage Gen2, see [Compare storage options for use with Azure HDInsight clusters](hdinsight-hadoop-compare-storage-options.md).

[!INCLUDE [delete-cluster-warning](includes/hdinsight-delete-cluster-warning.md)]

## Data Lake Storage Gen2 availability

Data Lake Storage Gen2 is available as a storage option for almost all Azure HDInsight cluster types as both a default and an additional storage account. HBase, however, can have only one account with Data Lake Storage Gen2.

> [!Note]  
> After you select Data Lake Storage Gen2 as your **primary storage type**, you cannot select a Data Lake Storage Gen1 as additional storage.

## Create HDInsight clusters using Data Lake Storage Gen2

Use the following links for detailed instructions on how to create HDInsight clusters with access to Data Lake Storage Gen2.

* [Using Portal](../hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2-portal.md)
* [Using Azure CLI](../hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2-azure-cli.md)
* PowerShell isn't currently supported for creating an HDInsight cluster with Azure Data Lake Storage Gen2.

## Access control for Data Lake Storage Gen2 in HDInsight

### What kinds of permissions does Data Lake Storage Gen2 support?

Data Lake Storage Gen2 uses an access control model that supports both Azure role-based access control (Azure RBAC) and POSIX-like access control lists (ACLs). Data Lake Storage Gen1 supports access control lists only for controlling access to data.

Azure RBAC uses role assignments to effectively apply sets of permissions to users, groups, and service principals for Azure resources. Typically, those Azure resources are constrained to top-level resources (for example, Azure Blob storage accounts). For Azure Blob storage, and also Data Lake Storage Gen2, this mechanism has been extended to the file system resource.

For more information about file permissions with Azure RBAC, see [Azure role-based access control (Azure RBAC)](../storage/blobs/data-lake-storage-access-control-model.md#role-based-access-control).

For more information about file permissions with ACLs, see [Access control lists on files and directories](../storage/blobs/data-lake-storage-access-control.md).

### How do I control access to my data in Data Lake Storage Gen2?

Your HDInsight cluster's ability to access files in Data Lake Storage Gen2 is controlled through managed identities. A managed identity is an identity registered in Microsoft Entra whose credentials are managed by Azure. With managed identities, you don't need to register service principals in Microsoft Entra ID. Or maintain credentials such as certificates.

Azure services have two types of managed identities: system-assigned and user-assigned. HDInsight uses user-assigned managed identities to access Data Lake Storage Gen2. A `user-assigned managed identity` is created as a standalone Azure resource. Through a create process, Azure creates an identity in the Microsoft Entra tenant that's trusted by the subscription in use. After the identity is created, the identity can be assigned to one or more Azure service instances.

The lifecycle of a user-assigned identity is managed separately from the lifecycle of the Azure service instances to which it's assigned. For more information about managed identities, see [What are managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md).

<a name='how-do-i-set-permissions-for-azure-ad-users-to-query-data-in-data-lake-storage-gen2-by-using-hive-or-other-services'></a>

### How do I set permissions for Microsoft Entra users to query data in Data Lake Storage Gen2 by using Hive or other services?

To set permissions for users to query data, use Microsoft Entra security groups as the assigned principal in ACLs. Don't directly assign file-access permissions to individual users or service principals. With Microsoft Entra security groups to control the flow of permissions, you can add and remove users or service principals without reapplying ACLs to an entire directory structure. You only have to add or remove the users from the appropriate Microsoft Entra security group. ACLs aren't inherited, so reapplying ACLs requires updating the ACL on every file and subdirectory.

## Access files from the cluster

There are several ways you can access the files in Data Lake Storage Gen2 from an HDInsight cluster.

* **Using the fully qualified name**. With this approach, you provide the full path to the file that you want to access.

    ```
    abfs://<containername>@<accountname>.dfs.core.windows.net/<file.path>/
    ```

* **Using the shortened path format**. With this approach, you replace the path up to the cluster root with:

    ```
    abfs:///<file.path>/
    ```

* **Using the relative path**. With this approach, you only provide the relative path to the file that you want to access.

    ```
    /<file.path>/
    ```

### Data access examples

Examples are based on an [ssh connection](./hdinsight-hadoop-linux-use-ssh-unix.md) to the head node of the cluster. The examples use all three URI schemes. Replace `CONTAINERNAME` and `STORAGEACCOUNT` with the relevant values

#### A few hdfs commands

1. Create a file on local storage.

    ```bash
    touch testFile.txt
    ```

1. Create directories on cluster storage.

    ```bash
    hdfs dfs -mkdir abfs://CONTAINERNAME@STORAGEACCOUNT.dfs.core.windows.net/sampledata1/
    hdfs dfs -mkdir abfs:///sampledata2/
    hdfs dfs -mkdir /sampledata3/
    ```

1. Copy data from local storage to cluster storage.

    ```bash
    hdfs dfs -copyFromLocal testFile.txt  abfs://CONTAINERNAME@STORAGEACCOUNT.dfs.core.windows.net/sampledata1/
    hdfs dfs -copyFromLocal testFile.txt  abfs:///sampledata2/
    hdfs dfs -copyFromLocal testFile.txt  /sampledata3/
    ```

1. List directory contents on cluster storage.

    ```bash
    hdfs dfs -ls abfs://CONTAINERNAME@STORAGEACCOUNT.dfs.core.windows.net/sampledata1/
    hdfs dfs -ls abfs:///sampledata2/
    hdfs dfs -ls /sampledata3/
    ```

#### Creating a Hive table

Three file locations are shown for illustrative purposes. For actual execution, use only one of the `LOCATION` entries.

```hql
DROP TABLE myTable;
CREATE EXTERNAL TABLE myTable (
    t1 string,
    t2 string,
    t3 string,
    t4 string,
    t5 string,
    t6 string,
    t7 string)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
STORED AS TEXTFILE
LOCATION 'abfs://CONTAINERNAME@STORAGEACCOUNT.dfs.core.windows.net/example/data/';
LOCATION 'abfs:///example/data/';
LOCATION '/example/data/';
```

## Next steps

* [Azure HDInsight integration with Data Lake Storage Gen2 preview - ACL and security update](https://azure.microsoft.com/blog/azure-hdinsight-integration-with-data-lake-storage-gen-2-preview-acl-and-security-update/)
* [Introduction to Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md)
* [Tutorial: Extract, transform, and load data using Interactive Query in Azure HDInsight](./interactive-query/interactive-query-tutorial-analyze-flight-data.md)

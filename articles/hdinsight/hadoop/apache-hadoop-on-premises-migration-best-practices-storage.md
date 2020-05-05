---
title: 'Storage: Migrate on-premises Apache Hadoop to Azure HDInsight'
description: Learn storage best practices for migrating on-premises Hadoop clusters to Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: ashishth
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 12/10/2019
---

# Migrate on-premises Apache Hadoop clusters to Azure HDInsight

This article gives recommendations for data storage in Azure HDInsight systems. It's part of a series that provides best practices to assist with migrating on-premises Apache Hadoop systems to Azure HDInsight.

## Choose right storage system for HDInsight clusters

The on-premises Apache Hadoop File System (HDFS) directory structure can be re-created in Azure Storage or Azure Data Lake Storage. You can then safely delete HDInsight clusters that are used for computation without losing user data. Both services can be used as both the default file system and an additional file system for an HDInsight cluster. The HDInsight cluster and the storage account must be hosted in the same region.

### Azure Storage

HDInsight clusters can use the blob container in Azure Storage as either the default file system or an additional file system. The Standard tier storage account is supported for use with HDInsight clusters. The Premier tier isn't supported. The default Blob container stores cluster-specific information such as job history and logs. Sharing one blob container as the default file system for multiple clusters isn't supported.

The storage accounts that are defined in the creation process and their respective keys are stored in `%HADOOP_HOME%/conf/core-site.xml` on the cluster nodes. They can also be accessed under the "Custom core site" section in HDFS configuration in the Ambari UI. The storage account key is encrypted by default and a custom decryption script is used to decrypt the keys before being passed on to Hadoop daemons. The jobs including Hive, MapReduce, Hadoop streaming, and Pig, carry a description of storage accounts and metadata with them.

Azure Storage can be geo-replicated. Although geo-replication gives geographic recovery and data redundancy, a failover to the geo-replicated location severely impacts the performance, and it may incur additional costs. The recommendation is to choose the geo-replication wisely and only if the value of the data is worth the additional cost.

One of the following formats can be used to access data that is stored in Azure Storage:

|Data Access Format |Description |
|---|---|
|`wasb:///`|Access default storage using unencrypted communication.|
|`wasbs:///`|Access default storage using encrypted communication.|
|`wasb://<container-name>@<account-name>.blob.core.windows.net/`|Used when communicating with a non-default storage account. |

[Scalability targets for standard storage accounts](../../storage/common/scalability-targets-standard-account.md) lists the current limits on Azure Storage accounts. If the needs of the application exceed the scalability targets of a single storage account, the application can be built to use multiple storage accounts and then partition data objects across those storage accounts.

[Azure Storage Analytics](../../storage/storage-analytics.md) provides metrics for all storage services and Azure portal can be configured collect metrics to be visualized through charts. Alerts can be created to notify when thresholds have been reached for storage resource metrics.

Azure Storage offers [soft delete for blob objects](../../storage/blobs/storage-blob-soft-delete.md) to help recover data when it's accidentally modified or deleted by an application or other storage account user.

You can create [blob snapshots](https://docs.microsoft.com/rest/api/storageservices/creating-a-snapshot-of-a-blob). A snapshot is a read-only version of a blob that's taken at a point in time and it provides a way to back up a blob. Once a snapshot has been created, it can be read, copied, or deleted, but not modified.

> [!Note]
> For older versions of on-premises Hadoop Distributions that don't have the "wasbs" certificate, they need to be imported to the Java trust store.

The following methods can be used to import certificates into the Java trust store:

Download the Azure Blob TLS/SSL cert to a file

```bash
echo -n | openssl s_client -connect <storage-account>.blob.core.windows.net:443 | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > Azure_Storage.cer
```

Import the above file to the Java trust store on all the nodes

```bash
keytool -import -trustcacerts -keystore /path/to/jre/lib/security/cacerts -storepass changeit -noprompt -alias blobtrust -file Azure_Storage.cer
```

Verify that the added cert is in the trust store

```bash
keytool -list -v -keystore /path/to/jre/lib/security/cacerts
```

For more information, see the following articles:

- [Use Azure Storage with Azure HDInsight clusters](../hdinsight-hadoop-use-blob-storage.md)
- [Scalability targets for standard storage accounts](../../storage/common/scalability-targets-standard-account.md)
- [Scalability and performance targets for Blob storage](../../storage/blobs/scalability-targets.md)
- [Microsoft Azure Storage Performance and Scalability Checklist](../../storage/common/storage-performance-checklist.md)
- [Monitor, diagnose, and troubleshoot Microsoft Azure Storage](../../storage/common/storage-monitoring-diagnosing-troubleshooting.md)
- [Monitor a storage account in the Azure portal](../../storage/common/storage-monitor-storage-account.md)

### Azure Data Lake Storage Gen1

Azure Data Lake Storage implements HDFS and POSIX style access control model. It provides first class integration with AAD for fine grained access control. There are no limits to the size of data that it can store, or its ability to run massively parallel analytics.

For more information, see the following articles:

- [Create HDInsight clusters with Data Lake Storage by using the Azure portal](../../data-lake-store/data-lake-store-hdinsight-hadoop-use-portal.md)
- [Use Data Lake Storage with Azure HDInsight clusters](../hdinsight-hadoop-use-data-lake-store.md)

### Azure Data Lake Storage Gen2

Azure Data Lake Storage Gen2 is the latest storage offering. It unifies the core capabilities from the first generation of Azure Data Lake Storage with a Hadoop compatible file system endpoint directly integrated into Azure Blob Storage. This enhancement combines the scale and cost benefits of object storage with the reliability and performance typically associated only with on-premises file systems.

ADLS Gen 2 is built on top of [Azure Blob storage](../../storage/blobs/storage-blobs-introduction.md) and allows you to interface with data using both file system and object storage paradigms. Features from [Azure Data Lake Storage Gen1](../../data-lake-store/index.yml), such as file system semantics, file-level security, and scale are combined with low-cost, tiered storage, high availability/disaster recovery capabilities, and a large SDK/tooling ecosystem from [Azure Blob storage](../../storage/blobs/storage-blobs-introduction.md). In Data Lake Storage Gen2, all the qualities of object storage remain while adding the advantages of a file system interface optimized for analytics workloads.

A fundamental feature of Data Lake Storage Gen2 is the addition of a [hierarchical namespace](../../storage/data-lake-storage/namespace.md) to the Blob storage service, which organizes objects/files into a hierarchy of directories for performant data access. The hierarchical structure enables operations such as renaming or deleting a directory to be single atomic metadata operations on the directory rather than enumerating and processing all objects that share the name prefix of the directory.

In the past, cloud-based analytics had to compromise in areas of performance, management, and security. The Key features of Azure Data Lake Storage (ADLS) Gen2 are as follows:

- **Hadoop compatible access**: Azure Data Lake Storage Gen2 allows you to manage and access data just as you would with a [Hadoop Distributed File System (HDFS)](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html). The new [ABFS driver](../../storage/data-lake-storage/abfs-driver.md) is available within all Apache Hadoop environments that are included in [Azure HDInsight](../index.yml). This driver allows you to access data stored in Data Lake Storage Gen2.

- **A superset of POSIX permissions**: The security model for Data Lake Gen2 fully supports ACL and POSIX permissions along with some extra granularity specific to Data Lake Storage Gen2. Settings may be configured through admin tools or through frameworks like Hive and Spark.

- **Cost effective**: Data Lake Storage Gen2 features low-cost storage capacity and transactions. As data transitions through its complete life-cycle, billing rates change to minimize costs via built-in features such as [Azure Blob storage life cycle](../../storage/common/storage-lifecycle-management-concepts.md).

- **Works with Blob storage tools, frameworks, and apps**: Data Lake Storage Gen2 continues to work with a wide array of tools, frameworks, and applications that exist today for Blob storage.

- **Optimized driver**: The Azure Blob Filesystem driver (ABFS) is [optimized specifically](../../storage/data-lake-storage/abfs-driver.md) for big data analytics. The corresponding REST APIs are surfaced through the dfs endpoint, dfs.core.windows.net.

One of the following formats can be used to access data that is stored in ADLS Gen2:
- `abfs:///`: Access the default Data Lake Storage for the cluster.
- `abfs://file_system@account_name.dfs.core.windows.net`: Used when communicating with a non-default Data Lake Storage.

For more information, see the following articles:

- [Introduction to Azure Data Lake Storage Gen2](../../storage/data-lake-storage/introduction.md)
- [The Azure Blob Filesystem driver (ABFS.md)](../../storage/data-lake-storage/abfs-driver.md)
- [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](../hdinsight-hadoop-use-data-lake-storage-gen2.md)

## Secure Azure Storage keys within on-premises Hadoop cluster configuration

The Azure Storage keys that are added to the Hadoop configuration files, establish connectivity between on premises HDFS and Azure Blob storage. These keys can be protected by encrypting them with the Hadoop credential provider framework. Once encrypted, they can be stored and accessed securely.

**To provision the credentials:**

```bash
hadoop credential create fs.azure.account.key.account.blob.core.windows.net -value <storage key> -provider jceks://hdfs@headnode.xx.internal.cloudapp.net/path/to/jceks/file
```

**To add the above provider path to the core-site.xml or to the Ambari configuration under custom core-site:**

```xml
<property>
    <name>hadoop.security.credential.provider.path</name>
        <value>
        jceks://hdfs@headnode.xx.internal.cloudapp.net/path/to/jceks
        </value>
    <description>Path to interrogate for protected credentials.</description>
</property>
```

> [!Note]
> The provider path property can also be added to the distcp command line instead of storing key at cluster level at core-site.xml as follows:

```bash
hadoop distcp -D hadoop.security.credential.provider.path=jceks://hdfs@headnode.xx.internal.cloudapp.net/path/to/jceks /user/user1/ wasb:<//yourcontainer@youraccount.blob.core.windows.net/>user1
```

## Restrict Azure Storage data access using SAS

HDInsight by default has full access to data in the Azure Storage accounts associated with the cluster. Shared Access Signatures (SAS) on the blob container can be used to restrict access to the data, such as provide users with read-only access to the data.

### Using the SAS token created with python

1. Open the
    [SASToken.py](https://github.com/Azure-Samples/hdinsight-dotnet-python-azure-storage-shared-access-signature/blob/master/Python/SASToken.py) file and change the following values:

    |Token Property|Description|
    |---|---|
    |policy_name|The name to use for the stored policy to create.|
    |storage_account_name|The name of your storage account.|
    |storage_account_key|The key for the storage account.|
    |storage_container_name|The container in the storage account that you want to restrict access to.|
    |example_file_path|The path to a file that is uploaded to the container.|

2. The SASToken.py file comes with the `ContainerPermissions.READ + ContainerPermissions.LIST` permissions and can be adjusted based on the use case.

3. Execute the script as follows: `python SASToken.py`

4. It displays the SAS token similar to the following text when the script completes: `sr=c&si=policyname&sig=dOAi8CXuz5Fm15EjRUu5dHlOzYNtcK3Afp1xqxniEps%3D&sv=2014-02-14`

5. To limit access to a container with Shared Access Signature, add a custom entry to the core-site configuration for the cluster under Ambari HDFS Configs Advanced Custom core-site Add property.

6. Use the following values for the **Key** and **Value** fields:

    **Key**: `fs.azure.sas.YOURCONTAINER.YOURACCOUNT.blob.core.windows.net`
    **Value**: The SAS KEY returned by the Python application FROM step 4 above.

7. Click the **Add** button to save this key and value, then click the **Save** button to save the configuration changes. When prompted, add a description of the change ("adding SAS storage access" for example) and then click **Save**.

8. In the Ambari web UI, select HDFS from the list on the left, and then select **Restart All Affected** from the Service Actions drop down list on the right. When prompted, select **Confirm Restart All**.

9. Repeat this process for MapReduce2 and YARN.

There are three important things to remember about the use of SAS Tokens in Azure:

1. When SAS tokens are created with "READ + LIST" permissions, users who access the Blob container with that SAS token won't be able to "write and delete" data. Users who access the Blob container with that SAS token and try a write or delete operation, will receive a message like `"This request is not authorized to perform this operation"`.

2. When the SAS tokens are generated with `READ + LIST + WRITE` permissions (to restrict `DELETE` only), commands like `hadoop fs -put` first write to a `\_COPYING\_` file and then try to rename the file. This HDFS operation maps to a `copy+delete` for WASB. Since the `DELETE` permission wasn't provided, the "put" would fail. The `\_COPYING\_` operation is a Hadoop feature intended to provide some concurrency control. Currently there's no way to restrict just the "DELETE" operation without affecting "WRITE" operations as well.

3. Unfortunately, the hadoop credential provider and decryption key provider (ShellDecryptionKeyProvider) currently don't work with the SAS tokens and so it currently can't be protected from visibility.

For more information, see [Use Azure Storage Shared Access Signatures to restrict access to data in HDInsight](../hdinsight-storage-sharedaccesssignature-permissions.md).

## Use data encryption and replication

All data written to Azure Storage is automatically encrypted using [Storage Service Encryption (SSE)](../../storage/common/storage-service-encryption.md). The data in the Azure Storage account is always replicated for high availability. When you create a storage account, you can choose one of the following replication options:

- [Locally redundant storage (LRS)](../../storage/common/storage-redundancy-lrs.md)
- [Zone-redundant storage (ZRS)](../../storage/common/storage-redundancy-zrs.md)
- [Geo-redundant storage (GRS)](../../storage/common/storage-redundancy-grs.md)
- [Read-access geo-redundant storage (RA-GRS)](../../storage/common/storage-redundancy.md)

Azure Data Lake Storage provides locally redundant storage (LRS) but you should also copy critical data to another Data Lake Storage account in another region with a frequency aligned to the needs of the disaster recovery plan. There are different methods to copy data including [ADLCopy](../../data-lake-store/data-lake-store-copy-data-azure-storage-blob.md), [DistCp](https://hadoop.apache.org/docs/current/hadoop-distcp/DistCp.html), [Azure PowerShell](../../data-lake-store/data-lake-store-get-started-powershell.md), or [Azure Data Factory](../../data-factory/connector-azure-data-lake-store.md). It's also recommended to enforce access policies for Data Lake Storage account to prevent accidental deletion.

For more information, see the following articles:

- [Azure Storage replication](../../storage/common/storage-redundancy.md)
- [Disaster guidance for Azure Data Lake Storage (ADLS)](../../data-lake-store/data-lake-store-disaster-recovery-guidance.md)

## Attach additional Azure Storage accounts to cluster

During the HDInsight creation process, an Azure Storage account or Azure Data Lake Storage account is chosen as the default file system. In addition to this default storage account, additional storage accounts can be added from the same Azure subscription or different Azure subscriptions during the cluster creation process or after a cluster has been created.

Additional storage account can be added in one on the following ways:
- Ambari HDFS Config Advanced Custom core-site Add the storage Account Name and key Restarting the services
- Using [Script action](../hdinsight-hadoop-add-storage.md) by passing the storage account name and key

> [!Note]
> In valid use-cases, the limits on the Azure storage can be increased via a request made to [Azure Support](https://azure.microsoft.com/support/faq/).

For more information, see [Add additional storage accounts to HDInsight](../hdinsight-hadoop-add-storage.md).

## Next steps

Read the next article in this series: [Data migration best practices for on-premises to Azure HDInsight Hadoop migration](apache-hadoop-on-premises-migration-best-practices-data-migration.md).

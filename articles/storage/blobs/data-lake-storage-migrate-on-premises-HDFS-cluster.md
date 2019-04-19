---
title: Use Azure Data Box to migrate data from on-premises HDFS store to Azure Storage
description: Migrate data from an on-premises HDFS store to Azure Storage
services: storage
author: normesta
ms.service: storage
ms.date: 03/01/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# Use Azure Data Box to migrate data from an on-premises HDFS store to Azure Storage

You can migrate data from an on-premises HDFS store of your Hadoop cluster into Azure Storage (blob storage or Data Lake Storage Gen2) by using a Data Box device.

This article helps you complete these tasks:

:heavy_check_mark: Copy your data to a Data Box device.

:heavy_check_mark: Ship the Data Box device to Microsoft.

:heavy_check_mark: Move the data onto your Data Lake Storage Gen2 storage account.

## Prerequisites

You need these things to complete the migration.

* An Azure Storage account that **doesn't** have hierarchical namespaces enabled on it.

* If you want to use Azure Data Lake Storage Gen2 account (A storage account that **does** have hierarchical namespaces enabled on it), then you might want to create it at this point.

* An on-premises Hadoop cluster that contains your source data.

* An [Azure Data Box device](https://azure.microsoft.com/services/storage/databox/). 

    - [Order your Data Box](https://docs.microsoft.com/azure/databox/data-box-deploy-ordered). While ordering your Box, remember to choose a storage account that **doesn't** have hierarchical namespaces enabled on it. This is because Data Box does not yet support direct ingestion into Azure Data Lake Storage Gen2. You will need to copy into a storage account and then do a second copy into the ADLS Gen2 account. Instructions for this are given in the steps below.
    - [Cable and connect your Data Box](https://docs.microsoft.com/azure/databox/data-box-deploy-set-up) to an on-premises network.

If you are ready, let's start.

## Copy your data to a Data Box device

To copy the data from your on-premises HDFS store to a Data Box device, you'll set a few things up, and then use the [DistCp](https://hadoop.apache.org/docs/stable/hadoop-distcp/DistCp.html) tool.

If the amount of data that you are copying is more than the capacity of a single Data Box, you will have to break up your data set into sizes that do fit into your Data Boxes.

Follow these steps to copy data via the REST APIs of Blob/Object storage to your Data Box. The REST API interface will make the Data Box appear as a HDFS store to your cluster. 


1. Before you copy the data via REST, identify the security and connection primitives to connect to the REST interface on the Data Box. Sign in to the local web UI of Data Box and go to **Connect and copy** page. Against the Azure storage account for your Data Box, under **Access settings**, locate and select **REST(Preview)**.

    !["Connect and copy" page](media/data-lake-storage-migrate-on-premises-HDFS-cluster/data-box-connect-rest.png)

2. In the Access storage account and upload data dialog, copy the **Blob service endpoint** and the **Storage account key**. From the blob service endpoint, omit the `https://` and the trailing slash.

    In this case, the endpoint is: `https://mystorageaccount.blob.mydataboxno.microsoftdatabox.com/`. The host portion of the URI that you'll use is: `mystorageaccount.blob.mydataboxno.microsoftdatabox.com`. For an example, see how to [Connect to REST over http](/azure/databox/data-box-deploy-copy-data-via-rest). 

     !["Access storage account and upload data" dialog](media/data-lake-storage-migrate-on-premises-HDFS-cluster/data-box-connection-string-http.png)

3. Add the endpoint and the Data Box IP address to `/etc/hosts` on each node.

    ```    
    10.128.5.42  mystorageaccount.blob.mydataboxno.microsoftdatabox.com
    ```
    If you are using some other mechanism for DNS, you should ensure that the Data Box endpoint can be resolved.
    
3. Set a shell variable `azjars` to point to the `hadoop-azure` and the `microsoft-windowsazure-storage-sdk` jar files. These files are under the Hadoop installation directory (You can check if these files exist by using this command `ls -l $<hadoop_install_dir>/share/hadoop/tools/lib/ | grep azure` where `<hadoop_install_dir>` is the directory where you have installed Hadoop  ) Use the full paths. 
    
    ```
    # azjars=$hadoop_install_dir/share/hadoop/tools/lib/hadoop-azure-2.6.0-cdh5.14.0.jar
    # azjars=$azjars,$hadoop_install_dir/share/hadoop/tools/lib/microsoft-windowsazure-storage-sdk-0.6.0.jar
    ```

4. Copy data from the Hadoop HDFS to Data Box Blob storage.

    ```
    # hadoop distcp \
    -libjars $azjars \
    -D fs.AbstractFileSystem.wasb.Impl=org.apache.hadoop.fs.azure.Wasb \
    -D fs.azure.account.key.[blob_service_endpoint]=[account_key] \
    -strategy dynamic -m 4 -update \
    [source_directory] \
           wasb://[container_name]@[blob_service_endpoint]/[destination_folder]       
    ```
   The `-libjars` option is used to make the `hadoop-azure*.jar` and the dependent `azure-storage*.jar` files available to `distcp`. This    may already occur for some clusters.
   
   The following example shows how the `distcp` command is used to copy data.
   
   ```
   # hadoop distcp \
    -libjars $azjars \
    -D fs.AbstractFileSystem.wasb.Impl=org.apache.hadoop.fs.azure.Wasb \
    -D fs.azure.account.key.mystorageaccount.blob.mydataboxno.microsoftdatabox.com=myaccountkey \
    -strategy dynamic -m 4 -update \
    /data/testfiles \
    wasb://hdfscontainer@mystorageaccount.blob.mydataboxno.microsoftdatabox.com/testfiles
   ```
  
To improve the copy speed:
- Try changing the number of mappers. (The above example uses `m` = 4 mappers.)
- Try running mutliple `distcp` in parallel.
- Remember that large files perform better than small files.       
    
## Ship the Data Box to Microsoft

Follow these steps to prepare and ship the Data Box device to Microsoft.

1. After the data copy is complete, run [Prepare to ship](https://docs.microsoft.com/azure/databox/data-box-deploy-copy-data-via-rest) on your Data Box. After the device preparation is complete, download the BOM files. You will use these BOM or manifest files later to verify the data uploaded to Azure. Shut down the device and remove the cables. 
2.	Schedule a pickup with UPS to [Ship your Data Box back to Azure](https://docs.microsoft.com/azure/databox/data-box-deploy-picked-up). 
3.	After Microsoft receives your device, it is connected to the network datacenter and data is uploaded to the storage account you specified (with hierarchical namespaces disabled) when you ordered the Data Box. Verify against the BOM files that all your data is uploaded to Azure. You can now move this data to a Data Lake Storage Gen2 storage account.

## Move the data onto your Data Lake Storage Gen2 storage account

This step is needed if you are using Azure Data Lake Storage Gen2 as your data store. If you are using just a blob storage account without hierarchical namespace as your data store, you do not need to do this step.

You can do this in 2 ways. 

- Use [Azure Data Factory to move data to ADLS Gen2](https://docs.microsoft.com/azure/data-factory/load-azure-data-lake-storage-gen2). You will have to specify **Azure Blob Storage** as the source.

- Use your Azure-based Hadoop cluster. You can run this DistCp command:

    ```bash
    hadoop distcp -Dfs.azure.account.key.{source_account}.dfs.windows.net={source_account_key} abfs://{source_container} @{source_account}.dfs.windows.net/[path] abfs://{dest_container}@{dest_account}.dfs.windows.net/[path]
    ```

This command copies both data and metadata from your storage account into your Data Lake Storage Gen2 storage account.

## Next steps

Learn how Data Lake Storage Gen2 works with HDInsight clusters. See [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](../../hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2.md).

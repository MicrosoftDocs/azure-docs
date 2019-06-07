---
title: Use Azure Data Box to migrate data from on-premises HDFS store to Azure Storage
description: Migrate data from an on-premises HDFS store to Azure Storage
services: storage
author: normesta

ms.service: storage
ms.date: 06/05/2019
ms.author: normesta
ms.topic: article
ms.component: data-lake-storage-gen2
---

# Use Azure Data Box to migrate data from an on-premises HDFS store to Azure Storage

You can migrate data from an on-premises HDFS store of your Hadoop cluster into Azure Storage (blob storage or Data Lake Storage Gen2) by using a Data Box device. You can choose from an 80-TB Data Box or a 770-TB Data Box Heavy.

This article helps you complete these tasks:

> [!div class="checklist"]
> * Prepare to migrate your data.
> * Copy your data to a Data Box or a Data Box Heavy device.
> * Ship the device back to Microsoft.
> * Move the data onto your Data Lake Storage Gen2 storage account.

## Prerequisites

You need these things to complete the migration.

* An Azure Storage account that **doesn't** have hierarchical namespaces enabled on it.

* If you want to migrate your data to Azure Data Lake storage Gen2, then you'll need to create a storage account and enable the **hierarchical namespace** feature on that account.

* An on-premises Hadoop cluster that contains your source data.

* An [Azure Data Box device](https://azure.microsoft.com/services/storage/databox/).

    - [Order your Data Box](https://docs.microsoft.com/azure/databox/data-box-deploy-ordered) or [Data Box Heavy](https://docs.microsoft.com/azure/databox/data-box-heavy-deploy-ordered). While ordering your device, remember to choose a storage account that **doesn't** have hierarchical namespaces enabled on it. This is because Data Box devices do not yet support direct ingestion into Azure Data Lake Storage Gen2. You will need to copy into a storage account and then do a second copy into the ADLS Gen2 account. Instructions for this are given in the steps below.

    - Cable and connect your [Data Box](https://docs.microsoft.com/azure/databox/data-box-deploy-set-up) or [Data Box Heavy](https://docs.microsoft.com/azure/databox/data-box-heavy-deploy-set-up) to an on-premises network.

If you are ready, let's start.

## Prepare to migrate your data

Before you move your data onto a Data Box device, you'll need to download some helper scripts, ensure that your data is organized to fit onto a Data Box device, and exclude any unnecessary files.

### Download helper scripts and set up your local computer to run them

1. From your edge or head node of your on-premises Hadoop cluster, run this command:

   ```bash
   git clone https://github.com/jamesbak/databox-adls-loader.git
   cd databox-adls-loader
   ```

   This command clones the Github repository that contains the helper scripts.

2. Make sure that have the [jq](https://stedolan.github.io/jq/) package installed on your local computer.

   ```bash
   sudo apt-get install jq
   ```

3. Install the [Requests](http://docs.python-requests.org/en/master/) python package.

   ```bash
   pip install requests
   ```

4. Set execute permissions on the required scripts.

   ```bash
   chmod +x *.py *.sh

   ```

### Ensure that your data is organized to fit onto a Data Box

If the size of your data exceeds the size of a single Data Box device, you can split files up into groups that you can store onto multiple Data Box devices.

If your data doesn't exceed the size of a singe Data Box, you can proceed to the next section.

1. From an elevated command prompt, run the `generate-file-list` script that you downloaded by following the guidance in the previous section.

   Here's a description of the command parameters:

   ```
   sudo -u hdfs ./generate-file-list.py [-h] [-s DATABOX_SIZE] [-b FILELIST_BASENAME]
                    [-f LOG_CONFIG] [-l LOG_FILE]
                    [-v {DEBUG,INFO,WARNING,ERROR}]
                    path

   where:
   positional arguments:
   path                  The base HDFS path to process.

   optional arguments:
   -h, --help            show this help message and exit
   -s DATABOX_SIZE, --databox-size DATABOX_SIZE
                        The size of each Data Box in bytes.
   -b FILELIST_BASENAME, --filelist-basename FILELIST_BASENAME
                        The base name for the output filelists. Lists will be
                        named basename1, basename2, ... .
   -f LOG_CONFIG, --log-config LOG_CONFIG
                        The name of a configuration file for logging.
   -l LOG_FILE, --log-file LOG_FILE
                        Name of file to have log output written to (default is
                        stdout/stderr)
   -v {DEBUG,INFO,WARNING,ERROR}, --log-level {DEBUG,INFO,WARNING,ERROR}
                        Level of log information to output. Default is 'INFO'.
   ```

2. Copy the generated file lists to HDF so that they are accessible to the [DistCp](https://hadoop.apache.org/docs/stable/hadoop-distcp/DistCp.html) job.

   ```
   hadoop fs -copyFromLocal {filelist_pattern} /[hdfs directory]
   ```

### Exclude unnecessary files

You'll need to exclude some directories from the DisCp job. For example, exclude directories that contain state information that keep the cluster running.

On the on-premise Hadoop cluster where you plan to initiate the DistCp job, create a file that specifies the list of directories that you want to exclude.

Here's an example:

```
.*ranger/audit.*
.*/hbase/data/WALs.*
```

## Copy your data to a Data Box device

To copy the data from your on-premises HDFS store to a Data Box device, you'll set a few things up, and then use the [DistCp](https://hadoop.apache.org/docs/stable/hadoop-distcp/DistCp.html) tool.

If the amount of data that you are copying is more than the capacity of a single Data Box or that of single node on Data Box Heavy, break up your data set into sizes that do fit into your devices.

Follow these steps to copy data via the REST APIs of Blob/Object storage to your Data Box device. The REST API interface will make the device appear as an HDFS store to your cluster.

1. Before you copy the data via REST, identify the security and connection primitives to connect to the REST interface on the Data Box or Data Box Heavy. Sign in to the local web UI of Data Box and go to **Connect and copy** page. Against the Azure storage account for your device, under **Access settings**, locate, and select **REST**.

    !["Connect and copy" page](media/data-lake-storage-migrate-on-premises-HDFS-cluster/data-box-connect-rest.png)

2. In the Access storage account and upload data dialog, copy the **Blob service endpoint** and the **Storage account key**. From the blob service endpoint, omit the `https://` and the trailing slash.

    In this case, the endpoint is: `https://mystorageaccount.blob.mydataboxno.microsoftdatabox.com/`. The host portion of the URI that you'll use is: `mystorageaccount.blob.mydataboxno.microsoftdatabox.com`. For an example, see how to [Connect to REST over http](/azure/databox/data-box-deploy-copy-data-via-rest). 

     !["Access storage account and upload data" dialog](media/data-lake-storage-migrate-on-premises-HDFS-cluster/data-box-connection-string-http.png)

3. Add the endpoint and the Data Box or Data Box Heavy node IP address to `/etc/hosts` on each node.

    ```    
    10.128.5.42  mystorageaccount.blob.mydataboxno.microsoftdatabox.com
    ```
    If you are using some other mechanism for DNS, you should ensure that the Data Box endpoint can be resolved.
    
4. Set the shell variable `azjars` to the location of the `hadoop-azure` and `azure-storage` jar files. You can find these files under the Hadoop installation directory.

    To determine if these files exist, use the following command: `ls -l $<hadoop_install_dir>/share/hadoop/tools/lib/ | grep azure`. Replace the `<hadoop_install_dir>` placeholder with the path to the directory where you've installed Hadoop. Be sure to use fully qualified paths.

    Examples:

    `azjars=$hadoop_install_dir/share/hadoop/tools/lib/hadoop-azure-2.6.0-cdh5.14.0.jar`
    `azjars=$azjars,$hadoop_install_dir/share/hadoop/tools/lib/microsoft-windowsazure-storage-sdk-0.6.0.jar`
    
5. Create the storage container that you want to use for data copy. You should also specify a destination folder as part of this command. This could be a dummy destination folder at this point.

    ```
    hadoop fs -libjars $azjars \
    -D fs.AbstractFileSystem.wasb.Impl=org.apache.hadoop.fs.azure.Wasb \
    -D fs.azure.account.key.[blob_service_endpoint]=[account_key] \
    -mkdir -p  wasb://[container_name]@[blob_service_endpoint]/[destination_folder]
    ```

6. Run a list command to ensure that your container and folder were created.

    ```
    hadoop fs -libjars $azjars \
    -D fs.AbstractFileSystem.wasb.Impl=org.apache.hadoop.fs.azure.Wasb \
    -D fs.azure.account.key.[blob_service_endpoint]=[account_key] \
    -ls -R  wasb://[container_name]@[blob_service_endpoint]/
    ```

7. Copy data from the Hadoop HDFS to Data Box Blob storage, into the container that you created earlier. If the folder that you are copying into is not found, the command automatically creates it.

    ```
    hadoop distcp \
    -libjars $azjars \
    -D fs.AbstractFileSystem.wasb.Impl=org.apache.hadoop.fs.azure.Wasb \
    -D fs.azure.account.key.[blob_service_endpoint]=[account_key] \
    -filters {exclusion_filelist_file} \
    [-f filelist_file | /[source_directory] \
           wasb://[container_name]@[blob_service_endpoint]/[destination_folder]
    ```
   The `-libjars` option is used to make the `hadoop-azure*.jar` and the dependent `azure-storage*.jar` files available to `distcp`. This    may already occur for some clusters.
   
   The following example shows how the `distcp` command is used to copy data.
   
   ```
     hadoop distcp \
    -libjars $azjars \
    -D fs.AbstractFileSystem.wasb.Impl=org.apache.hadoop.fs.azure.Wasb \
    -D fs.azure.account.key.mystorageaccount.blob.mydataboxno.microsoftdatabox.com=myaccountkey \
    -filter ./exclusions.lst -f /tmp/copylist1 -m 4 \
    /data/testfiles \
    wasb://hdfscontainer@mystorageaccount.blob.mydataboxno.microsoftdatabox.com/data
   ```
  
To improve the copy speed:
- Try changing the number of mappers. (The above example uses `m` = 4 mappers.)
- Try running multiple `distcp` in parallel.
- Remember that large files perform better than small files.
    
## Ship the Data Box to Microsoft

Follow these steps to prepare and ship the Data Box device to Microsoft.

1. After the data copy is complete, run:
    
    - [Prepare to ship on your Data Box or Data Box Heavy](https://docs.microsoft.com/azure/databox/data-box-deploy-copy-data-via-rest).
    - After the device preparation is complete, download the BOM files. You will use these BOM or manifest files later to verify the data uploaded to Azure. 
    - Shut down the device and remove the cables.
2.	Schedule a pickup with UPS. Follow the instructions to:

    - [Ship your Data Box](https://docs.microsoft.com/azure/databox/data-box-deploy-picked-up) 
    - [Ship your Data Box Heavy](https://docs.microsoft.com/azure/databox/data-box-heavy-deploy-picked-up).
3.	After Microsoft receives your device, it is connected to the datacenter network and the data is uploaded to the storage account you specified (with hierarchical namespaces disabled) when you placed the device order. Verify against the BOM files that all your data is uploaded to Azure. You can now move this data to a Data Lake Storage Gen2 storage account.

## Move the data into Azure Data Lake Storage Gen2

First, copy data into your storage account. Then, apply access permissions to files and directories.

> [!NOTE]
> This step is needed if you are using Azure Data Lake Storage Gen2 as your data store. If you are using just a blob storage account without hierarchical > namespace as your data store, you can skip this section.

### Copy data to the storage account

You can do this in two ways.

- Use [Azure Data Factory to move data to ADLS Gen2](https://docs.microsoft.com/azure/data-factory/load-azure-data-lake-storage-gen2). You will have to specify **Azure Blob Storage** as the source.

- Use your Azure-based Hadoop cluster. You can run this DistCp command:

    ```bash
    hadoop distcp -Dfs.azure.account.key.{source_account}.dfs.windows.net={source_account_key} abfs://{source_container} @{source_account}.dfs.windows.net/[path] abfs://{dest_container}@{dest_account}.dfs.windows.net/[path]
    ```

This command copies both data and metadata from your storage account into your Data Lake Storage Gen2 storage account.

### Create a service principal for your Azure Data Lake Storage Gen2 account

To create a service principal, see [How to: Use the portal to create an Azure AD application and service principal that can access resources](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal).

  * When performing the steps in the [Assign the application to a role](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#assign-the-application-to-a-role) section of the article, make sure to assign the **Storage Blob Data Contributor** role to the service principal.

  * When performing the steps in the [Get values for signing in](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#get-values-for-signing-in) section of the article, application ID, and client secret values into a text file. You'll need those soon.

### Generate a list of copied files with their permissions

From the on-premises Hadoop cluster, run this command:

```bash
sudo -u hdfs ./copy-acls.sh -s /{hdfs_path} > ./filelist.json
```

This command generates a list of copied files with their permissions.

> [!NOTE]
> Depending on the number of files in the HDFS, this command can take a long time to run.

### Generate a list of identities and map them to Azure Active Directory (ADD) identities

1. Run this command to generate a list of unique identities.

   ```bash
   ./copy-acls.py -s ./filelist.json -i id_map.json -g
   ```

   This script generates a file named `id_map.json` that contains the identities that you need to map to ADD-based identities.

2. Open the `id_map.json` file in a text editor such as Notepad.

3. For each JSON object that appears in the file, update the `target` attribute of either an AAD User Principal Name (UPN) or ObjectId (OID), with the appropriate mapped identity. After you're done, save the file. You'll need this file in the next step.

### Apply permissions to copied files and apply identity mappings

Run this command to apply permissions to the data that you copied into the Data Lake Storage Gen2 account:

```bash
./copy-acls.py -s ./filelist.json -i ./id_map.json  -A adlsgen2hnswestus2 -C databox1 --dest-spn-id {application-id}  --dest-spn-secret {authentication-key}
```

Replace the `application-id` and `authentication-key` placeholders with the application ID and authentication key that you collected when you created the service principle.

## Next steps

Learn how Data Lake Storage Gen2 works with HDInsight clusters. See [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](../../hdinsight/hdinsight-hadoop-use-data-lake-storage-gen2.md).

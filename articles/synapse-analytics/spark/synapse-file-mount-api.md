---
title: Introduction to file mount in Azure Synapse Analytics
description: This tutorial describes how to use the file mount/unmount API in Azure Synapse Analytics.
author: ruixinxu 
services: synapse-analytics 
ms.service: synapse-analytics 
ms.topic: reference
ms.subservice: spark
ms.date: 07/12/2022
ms.author: ruxu
ms.reviewer: wiassaf
ms.custom: subject-rbac-steps
---

# How to use file mount/unmount API in Azure Synapse Analytics 

The Azure Synapse Studio team built two new mount/unmount APIs in the Microsoft Spark Utilities (MSSparkUtils) package. You can use these APIs to attach remote storage (Azure Blob Storage or Azure Data Lake Storage Gen2) to all working nodes (driver node and worker nodes). After the storage is in place, you can use the local file API to ccess data in storage as if it's in the local file system. For more information, see [Introduction to Microsoft Spark Utilities](microsoft-spark-utilities.md).

The article shows you how to use mount/unmount APIs in your workspace. You'll learn: 

+ How to mount Data Lake Storage Gen2 or Blob Storage.
+ How to access files under the mount point via the local file system API. 
+ How to access files under the mount point by using the `mssparktuils fs` API. 
+ How to access files under the mount point by using the Spark Read API.
+ How to unmount the mount point.
 
> [!WARNING]
> Azure file-share mount is temporarily disabled. You can use Data Lake Storage Gen2 of blob mount instead, as described in the next section.
>
> Azure Data Lake Storage Gen1 storage is not supported. You can migrate to Data Lake Storage Gen2 following the [migration gudiance](../../storage/blobs/data-lake-storage-migrate-gen1-to-gen2-azure-portal.md) before using mount APIs.


<a id="How-to-mount-Gen2/blob-Storage"></a>
## Mount storage

This section illustrates how to mount Data Lake Storage Gen2 step by step as an example. Mounting Blob Storage works similarly. 

The example assumes you have one Data Lake Storage Gen2 account named `storegen2` and the account has one container name `mycontainer`, and you want to mount the `mycontainer` to `/test` of your Spark pool. 

![Screenshot of a Data Lake Storage Gen2 storage account.](./media/synapse-file-mount-api/gen2-storage-account.png)

To mount the container called `mycontainer`, `mssparkutils` first needs to check whether you have the permission to access the container. Currently, we support three authentication methods for the trigger mount operation: `linkedService`, `accountKey`, and `sastoken`. 

### Mount by using a linked service (recommended)

We recommend a trigger mount via linked service. This method avoids security leaks, because `mssparkutils` doesn't store any secret/authentication values itself. Instead, `mssparkutils` always fetches authentication values from the linked service to request blob data from remote storage. 

![Screenshot of linked services.](./media/synapse-file-mount-api/synapse-link-service.png)

You can create a linked service for Data Lake Storage Gen2 or Blob Storage. Currently, two authentication methods are supported when you create a linked service: 

+ **Create a linked service by using an account key**

    ![Screenshot of selections for creating a linked service by using an account key.](./media/synapse-file-mount-api/synapse-link-service-using-account-key.png)

+ **Create a linked service by using managed identity**

    ![Screenshot of selections for creating a linked service by using managed identity.](./media/synapse-file-mount-api/synapse-link-service-using-managed-identity.png)

> [!NOTE]
> + If you create linked service using managed identity as authentication method, please make sure that the workspace MSI has the Storage Blob Data Contributor role of the mounted container. 
> + Please always check the linked service connection to guarantee that the linked service is created successfully. 

After you create linked service successfully, you can easily mount the container to your Spark pool with below Python code. 

```python
mssparkutils.fs.mount( 
    "abfss://mycontainer@<accountname>.dfs.core.windows.net", 
    "/test", 
    {"linkedService":"mygen2account"} 
) 
``` 

**Notice**:   

+ You may need to import `mssparkutils` if it not available. 

    ```python
    From notebookutils import mssparkutils 
    ``` 
+ It's not recommended to mount a root folder, no matter which authentication method is used.


### Mount via shared access signature token or account key  

In addition to mount with linked service, `mssparkutils` also support explicitly passing account key or [SAS (shared access signature)](/samples/azure-samples/storage-dotnet-sas-getting-started/storage-dotnet-sas-getting-started/) token as parameter to mount the target. 

For security reasons, it is recommended to store Account key or SAS token in Azure Key Vaults (as the below example figure shows), then retrieving them with `mssparkutil.credentials.getSecret` API. For more information, see [Manage storage account keys with Key Vault and the Azure CLI (legacy)](../../key-vault/secrets/overview-storage-keys.md).

![Screenshot of key vaults](./media/synapse-file-mount-api/key-vaults.png)
 
Here is the sample code. 

```python 
from notebookutils import mssparkutils  

accountKey = mssparkutils.credentials.getSecret("MountKV","mySecret")  
mssparkutils.fs.mount(  
    "abfss://mycontainer@<accountname>.dfs.core.windows.net",  
    "/test",  
    {"accountKey":accountKey}
) 
``` 

> [!Note]
> For security reasons, do not store credentials in code.

<!---
## Mount Azure file shares
> [!WARNING]
> File-share mount is temporarily disable due to tech limitation issue. Please using blob/gen2 mount following above steps as workaround.

Assuming you have a Data Lake Storage Gen2 storage account named `storegen2` and the account has one file share named `myfileshare`, and you want to mount the `myfileshare` to `/test` of your spark pool.
![Screenshot of file share](./media/synapse-file-mount-api/file-share.png)
 
Mount azure file share only supports the account key authentication method, below is the code sample to mount **myfileshare** to `/test` and we reuse the Azure Key Value settings of `MountKV` here: 

```python 
from notebookutils import mssparkutils  

accountKey = mssparkutils.credentials.getSecret("MountKV","mySecret")  
mssparkutils.fs.mount(  
    "https://myfileshare@<accountname>.file.core.windows.net",  
    "/test",  
    {"accountKey":accountKey}  
) 
``` 

In the above example, we pre-defined the schema format of source URL for the file share to: `https://<filesharename>@<accountname>.file.core.windows.net`, and we stored the account key in AKV, and retrieving them with `mssparkutil.credentials.getSecret` API instead of explicitly passing it to the mount API. 

   

## Access files under the mount point via the local file system API

Once the mount run successfully, you can access data via local file system API, while currently we limit the mount point always be created under **/synfs** folder of node and it was scoped to job/session level. 

So, for example if you mount `mycontainer` to `/test` folder, the created local mount point is `/synfs/{jobid}/test`, that means if you want to access mount point via local fs APIs after a successful mount, the local path used should be `/synfs/{jobid}/test` 

Below is an example to show how it works. 

```python 
jobId = mssparkutils.env.getJobId() 
f = open(f"/synfs/{jobId}/test/myFile.txt", "a") 
f.write("Hello world.") 
f.close() 
``` 
--->

## Access files under the mount point by using the mssparktuils fs API 

The main purpose of the mount operation is to let customer access the data stored in remote storage account using local file system API, you can also access data using `mssparkutils fs` API with mounted path as a parameter. The path format used here is a little different. 

Assuming you mounted to the Data Lake Storage Gen2 container `mycontainer` to `/test` using mount API. 

When you access the data using local file system API, as above section shared, the path format is like 

`/synfs/{jobId}/test/{filename}`

While when you want to access the data with `mssparkutils fs` API, the path format is like: 

`synfs:/{jobId}/test/{filename}`

You can see the `synfs` is used as schema in this case instead of a part of the mounted path. 

Below are three examples to show how to access file with mount point path using `mssparkutils fs`, while **49** is a Spark job ID we got from calling `mssparkutils.env.getJobId()`. 

+ List dirs:  

    ```python 
    mssparkutils.fs.ls("synfs:/49/test") 
    ``` 

+ Read file content: 

    ```python 
    mssparkutils.fs.head("synfs:/49/test/myFile.txt") 
    ``` 

+ Create directory: 

    ```python 
    mssparkutils.fs.mkdirs("synfs:/49/test/newdir") 
    ``` 

## Access files under the mount point by using the Spark Read API 

You can also use Spark Read API with mounted path as parameter to access the data after mount as well, the path format here is same with the format of using `mssparkutils fs` API: 

`synfs:/{jobId}/test/{filename} `

Below are two code examples, one is for a mounted Data Lake Storage Gen2 storage, another for a mounted blob storage. 

<a id="read-file-from-a-mounted-gen2-storage-account"></a>
### Read file from a mounted Data Lake Storage Gen2 storage account 

The below example assumes an Data Lake Storage Gen2 storage was already mounted then read file using mount path.

```python 
%%pyspark 

# Assume a Data Lake Storage Gen2 storage was already mounted then read file using mount path 

df = spark.read.load("synfs:/49/test/myFile.csv", format='csv') 
df.show() 
``` 

### Read files from a mounted Blob Storage account 

Notice that if you mounted a Blob Storage account then want to access it using `mssparkutils` or Spark API, you need to explicitly configure the sas token via spark configuration at first before try to mount container using mount API. 

1. Update Spark configuration as below code example if you want to access it using `mssparkutils` or Spark API after trigger mount, you can bypass this step if you only want to access it using local file api after mount:

    ```python 
    blob_sas_token = mssparkutils.credentials.getConnectionStringOrCreds("myblobstorageaccount") 

    spark.conf.set('fs.azure.sas.mycontainer.<blobStorageAccountName>.blob.core.windows.net', blob_sas_token) 
    ``` 

2. Create link service `myblobstorageaccount` and mount blob storage account with link service:

    ```python 
    %%spark 
    mssparkutils.fs.mount( 
        "wasbs://mycontainer@<blobStorageAccountName>.blob.core.windows.net", 
        "/test", 
        Map("linkedService" -> "myblobstorageaccount") 
    ) 
    ``` 

3. Mount the blob storage container and then read file using mount path through the local file API:

    ```python
    # mount blob storage container and then read file using mount path
    with open("/synfs/64/test/myFile.txt") as f:
        print(f.read())
    ```

4. Read data from mounted blob storage through Spark Read API:

    ```python
    %%spark
    // mount blob storage container and then read file using mount path
    val df = spark.read.text("synfs:/49/test/myFile.txt")
    df.show()
    ```

## Unmount the mount point 

Unmount with your mount point, `/test` in our example: 

```python 
mssparkutils.fs.unmount("/test") 
``` 

## Known limitations

+ The `mssparkutils fs help` function hasn't added the description about mount/unmount part yet. 

+ In further, we will support auto unmount mechanism to remove the mount point when application run finished, currently it not implemented yet. If you want to unmount the mount point to release the disk space, you need to explicitly call unmount API in your code, otherwise, the mount point will still exist in the node even after the application run finished. 

+ Mounting Data Lake Storage Gen1 storage account is not supported for now. 

## Next steps

- [Get Started with Azure Synapse Analytics](../get-started.md)
- [Monitor your Synapse Workspace](../get-started-monitor.md)
- [Introduction to Microsoft Spark Utilities](microsoft-spark-utilities.md)
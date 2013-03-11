<properties linkid="manage-services-hdinsight-using-blob-store-hdinsight" urlDisplayName="Using Windows Azure Blob Store with HDInsight" pageTitle="Using Blob Store with HDInsight - Windows Azure tutorial" metaKeywords="hdinsight blob, asv, hdinsight asv, hdinsight azure" metaDescription="How to use Windows Azure Blob Store with HDInsight" umbracoNaviHide="0" disqusComments="1" writer="sburgess" editor="mollybos" manager="paulettm" />

<div chunk="../chunks/hdinsight-left-nav.md" />

#Using Windows Azure Blob Storage with HDInsight  #

## Getting started ##

When you provision an HDInsight Service cluster, you will need to provide a Windows Azure Storage Account. The HDInsight Service will create the default HDFS file system in a Blob Storage container that has the same name as your HDInsight Service cluster. If such a container already exists, it will use it with all the data preloaded. If it does not exist yet, it will be created.

While you are using the HDInsight Service and interacting with the storage through HDFS, the file system will look like any other HDFS file system, with the difference though that the file system is not located inside the compute cluster, but in the highly scalable Windows Azure Blob Storage container. We refer to an HDFS file system over the Blob Storage as an *Azure Storage Vault* or ASV for short.

Most HDFS commands such as `ls`, `copyFromLocal`, `mkdir ` etc. will still work as expected. Only the commands that are specific to the native HDFS implementation (which is referred to as DFS) such as `fschk` and `dfsadmin` will show different behavior.

In the following tutorial we will:

- give an overview of the architecture
- show how you can use a Blob Storage Account in the HDInsight Service
- show how to address Windows Azure Blob Storage containers through a new URI scheme
- show how to use multiple Windows Azure Blob Storage containers

## The HDInsight Service Storage Architecture ##

The following diagram provides you with an abstract view of the HDInsight Service's storage architecture:

![](../Media/HDI.ASVArch.png)

You will notice that the HDInsight Service still provides access to the distributed file system that is locally attached to the compute nodes. This file system can still be accessed, but now has to be referred to via the fully qualified URI `hdfs://<namenodehost>/<path>`. 

In addition, HDInsight Service now also provides the ability to store your data in Windows Azure Blob Store containers, one of which you specify to be the default file system.

#### Benefits of HDFS/ASV ####

While the storage container for Windows Azure Blob Storage is not local to the compute nodes, and thus seems to violate the Hadoop paradigm of co-locating compute with storage, there are several benefits associated with storing the data in Windows Azure Blob Storage instead of DFS:

- **Data Reuse and Sharing**: The data in DFS is located inside the compute cluster and "locked" behind the HDFS APIs. This means that only applications that have a knowledge of HDFS and have access to the compute cluster can use the data. The data in Windows Azure Blob Storage can be accessed either through the HDFS APIs or through the Windows Azure Blob Storage REST APIs. Thus, a larger set of applications and tools can be used to produce and consume the data and different applications can produce the data while others consume it.

- **Data Archiving**: Since the data in DFS only lives as long as you have provisioned your HDInsight Service cluster, you either have to keep your cluster deployed indefinitely, or you have to reload your data into the cluster every time you provision a cluster to perform computation. In Blob Storage, you can keep the data stored for as long as you wish.

- **Data Storage Cost**: Storing data in DFS for the long term will be more costly than storing the data in Windows Azure Blob Storage since the cost of a compute cluster is higher than the cost of an Windows Azure Blob Store container. In addition, since the data does not have to be reloaded for every compute cluster generation, you are saving data loading costs as well.

- **Elastic scale-out**: While DFS provides you with a scaled-out file system, the scale is determined by the number of nodes that you provision for your cluster. Changing the scale can become a more complicated process than relying on the Windows Azure Blob Store's elastic scaling capabilities that you get automatically using Windows Azure Storage.

- **Geo Replication**: Your Windows Azure Blob Store containers can be geo replicated through the Windows Azure Portal! While this gives you geographic recovery and data redundancy, a fail-over to the geo replicated location will severely impact your performance and may incur additional costs. So our recommendation is to choose the geo replication wisely and only if the value of the data is worth the additional costs.

The implied performance cost of not having compute and storage co-located is actually mitigated by the way the compute clusters are provisioned close to the storage account resources inside the Windows Azure data center, where the high speed network makes it very efficient for the compute nodes to access the data inside Windows Azure Blob Storage. Depending on general load, compute and access patterns, we have observed only slight performance degradation and often even faster access.

##Temporary Data in Hive Jobs##

Certain Map-Reduce jobs and packages may create intermediate results that you don't really want to store in the Windows Azure Blob Store container. In that case, you can still elect to store the data in the local HDFS/DFS file system. In fact, the HDInsight Service uses DFS for several of these intermediate results in Hive jobs and other processes. 

##Using Windows Azure Blob Store Containers in HDInsight Service##

When you provision an HDInsight Service cluster, you get either a new Blob Storage container provisioned as your default file system or you can select any existing container from a drop-down menu in the HDInsight Service portal.

This container may be a container that has been created as an ASV file system, or it may be just an arbitrary Blob Storage container created outside of the HDInsight Service. In either case you can "mount" it and use it as the default file system. Note that the data will stay in that container and will **not** be copied to a different location.

##Addressing a File In Blob Storage##

Since the default file system uses Blob Storage, you can just refer to files and directories inside the file system using relative or absolute paths. For example, the following statement will list all top-level directories and files of the default file system:

>    hadoop fs -ls /

However, you can refer to any Blob Store container that lives inside your storage subscription by referring to it using the following URI scheme (`[]` indicates that the part is optional, `<>` enclose concepts): 
 
	asv[s]://[[<container>@]<domain>]/<path>
    
The URI scheme provides for both an unencrypted way to access the data inside your file system with the `asv:` prefix, and an SSL encrypted way with `asvs:`. Note that we recommend you use `asvs:` wherever possible, even when accessing data that lives inside the same data center.

The `<container>` identifies the name of the Blob Storage container that is being referred used. If no container name is specified but the domain is, then it refers to the root container of the domain's storage account. Note that root containers are read-only.

The `<domain>` identifies the storage account domain. If it does not contain a dot (`.`), it will be interpreted as `<domain>.blob.core.windows.net`.

If neither the container nor the domain has been specified, then the default file system is used.

Finally, the `<path>` is the file's or directory's HDFS path name. Since Blob Storage containers are just a key-value store, there is no true hierarchical file system. A `/` inside a Windows Azure Blob Storage key is interpreted as a directory separator. Thus, if a blob's key is `input/log1.txt`, then it is the file `log1.txt` inside the directory `input`.

For example,

> asvs://dailylogs@myaccount/input/log1.txt

refers to the file `log1.txt` in the directory `input` on the Blob Storage container `dailylogs` at the location `myaccount.blob.core.windows.net` using SSL.

> asvs://myaccount/result.txt

refers to the file `result.txt` on the read-only ASV file system in the root container at the location `myaccount.blob.core.windows.net` that gets accessed through SSL. Note that `asv://myaccount/output/result.txt` will result in an exception, because Blob Storage does not allow `/` inside path names in the root container to avoid ambiguities between paths and folder names. 

asv:///output/result.txt refers to the file `result.txt` in the `output` directory on the default filesystem.

##Mapping an ASV URI to a Blob Storage URI##

Given an ASV URI, you may need to be able to create the Blob Storage URI which can be used to access the blob directly in Blob Storage. The mapping is straight forward. To access an file (or folder) at 

    asv[s]://<account>/<path-name>

through the Blob Storage URI, use

	http[s]://<account>/<path-name>

and to access the file 

    asv[s]://<container>@<account>/<path-name>
    
through the Blob Storage URI, use

	`http[s]://<account>/<container>/<path-name>`

The short form:

	`asv[s]:///<path-name>`

translates to the Blob Storage URI

	`http[s]://<account>/<container>/<path-name>`

where account and container are the values used for specifying the default file system.

For example,

	`asvs://dailylogs@myaccount/input/log1.txt`

can be accessed through the Blob Storage URI 

	`https://myaccount.blob.core.windows.net/dailylogs/input/log1.txt`


##Using Multiple Windows Azure Blob Storage Containers##

You can refer to locations in several Blob Storage containers inside your default storage subscription beyond the one that is used as the default file system by using the URI for the desired locations.

It is possible to access a container that lives in a separate storage subscription. However be aware that accessing such a location may go outside of your subscription's data center. Be  aware that this may incur additional charges for data flowing across the data center boundaries. It should also always be encrypted using the `asvs` URI scheme.

In order to access such a storage account container, the storage account either needs to be publicly readable, or you need to add the storage account's key to your HDInsight Service's `core-site.xml` file by adding the following entry for every storage account that you want to access:

    <property>
    	<name>fs.azure.account.key.<accountname></name>
    	<value><enterthekeyvaluehere></value>
    </property>

##Mapping Files and Directories into Blob Storage Containers##

The process to map a non-hierarchical Storage Blob's key into the hierarchical HDFS file system is described above. You assume that each blob maps to a file, and that each segment in the blob's key separated by a `/` implies a directory, or - in the case of the last segment - the file name.

This is also how to map the HDFS file and directory structure back into the Blob Storage container. A file `f.txt` inside the directories `a/b/c` will be stored as blob called `a/b/c/f.txt` inside the Blob Storage container.

In order to preserve the POSIX-based semantics of HDFS, you need to add some more information to preserve the presence of folders that were created either explicitly through `mkdir` or implicitly by creating files inside them. This is achieved by creating a place holder blob for the directory, that is empty, and has two metadata properties that indicate that the blob is an ASV directory (`asv_isfolder`) and what its permissions are (`asv_permissions`).

Such folder blobs may also be created in a normal Blob Storage container, if you perform a writing/updating HDFS file command on it such as deleting a file inside a folder, since is it necessary to preserve the semantics that deleting a file will not delete the containing folder.

##Creating an ASV File System##

Creating an ASV File System can be done by creating a new Blob Storage container through the commonly-used APIs in a storage account for which `core-site.xml` contains the storage key.

In addition, you can also create a new container by referring to it in an HDFS file system command. For example,

	`hadoop fs -mkdir asvs://newcont@myaccount/a`

will not only create the new directory `a` but, if it doesn't exist, will also create a new container called `newcont`.

##Summary##

In this article you learned how to use Blob Storage with the HDInsight Service and that Windows Azure Blob Storage is a fundamental component of the HDInsight Service. This will allow you to build scalable, long-term archiving data acquisition solutions with Windows Azure Blob Storage and use the HDInsight Service to unlock the information inside the stored data.

##Next Steps

For more information on loading data into the HDInsight Service, see [How to: Upload data][upload-data].

[upload-data]: /en-us/manage/services/hdinsight/howto-upload-data-to-hdinsight/
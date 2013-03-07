<properties linkid="using-blob-store-hdinsight" urlDisplayName="Using Windows Azure Blob Store with HDInsight" pageTitle="Using Blob Store with HDInsight - Windows Azure tutorial" metaKeywords="hdinsight blob, asv, hdinsight asv, hdinsight azure" metaDescription="How to use Windows Azure Blob Store with HDInsight" metaCanonical="http://www.windowsazure.com/en-us/manage/hdinsight/using-blob-store" umbracoNaviHide="0" disqusComments="1" writer="sburgess" editor="mollybos" manager="paulettm" />

##Using Windows Azure Blob Store with HDInsight  ##

*Michael Rys, mrys@microsoft.com*

### Getting started ###

When you provision an HDInsight cluster, you will have to provide an Azure storage account. HDInsight will per default create the default HDFS file system in an Azure Blob Store container that has the same name as your HDInsight cluster in the provided storage account. If such a container already exists, it will use it with all the data preloaded. If it does not exist yet, it will be created.

While you are using HDInsight and are only interacting with the storage through your HDFS commands, the file system will look like any other HDFS file system, with the difference though, that the file system is not located inside the compute cluster, but in the highly scalable Azure Blob Store container. We refer to an HDFS file system also as an *Azure Storage Vault* or HDFS/ASV or ASV for short.

Most HDFS commands such as `ls`, `copyFromLocal`, `mkdir ` etc. will still be working as expected. Only the commands that are specific to the native HDFS implementation (which we often refer to as HDFS/DFS) such as `fschk` and `dfsadmin` are showing different behavior.

In the following, we are going to give you an overview of how the architecture looks like, how you can use any Azure Blob Store container that you have access to through HDFS, address Azure Blob Store containers through a new URI scheme, how to use multiple Azure Blob Store containers, and finally what you will see if you look at your HDFS/ASV data through the Azure Blob Store view.

### The HDInsight Service Storage Architecture ###

The following diagram provides you with an abstract view of the HDInsight Service's storage architecture:

![](..\Media\ASV Arch.jpg)

You will notice that HDInsight Service still provides the distributed file system that is locally attached to the compute nodes commonly referred to as HDFS/DFS. This file system can still be accessed, but now has to be referred to via the fully qualified URI `hdfs://<namenodehost>/<path>`. 

In addition, HDInsight Service now also provides the ability to store the data in Azure Blob Store containers (HDFS/ASV), one of which is chosen as the default file system.

#### Benefits of HDFS/ASV ####

While the storage container for HDFS/ASV is not local to the compute nodes, and thus seem to violate the Hadoop paradigm of co-locating compute with storage, there are several benefits associated with storing the data in HDFS/ASV instead of DFS:

- **Data Reuse and Sharing**: The data in DFS is located inside the compute cluster and "locked" behind the HDFS APIs. This means that only applications that have a knowledge of HDFS and have access to the compute cluster can use the data. The data in ASV can be accessed either through the HDFS APIs or through the Azure Blob Store REST APIs. Thus, a larger set of applications and tools can be used to produce and consume the data and different applications can produce the data while others consume it.

- **Data Archiving**: Since the data in DFS only lives as long as you have provisioned your HDInsight cluster, you either have to keep your cluster alive beyond your compute time, or you have to reload your data into the cluster everytime you provision one to perform your computations. In ASV, you can keep the data stored for as long as you wish.

- **Data Storage Cost**: Storing data in DFS for the long term will be more costly than storing the data in ASV since the cost of a compute cluster is higher than the cost of an Azure Blob Store container. In addition, since the data does not have to be reloaded for every compute cluster generation, you are saving data loading costs as well.

- **Elastic scale-out**: While DFS provides you with a scaled-out file system, the scale is determined by the number of nodes that you provision for your cluster. Changing the scale can become a more complicated process than relying on the Azure Blob Store's elastic scaling capabilities that you get automatically via ASV.

- **Geo Replication**: Your Azure Blob Store containers can be geo replicated through the Azure Portal! While this gives you geographic recovery and data redundancy, a fail-over to the geo replicated location will severely impact your performance and may incure additional costs. So our recommendation is to chose the geo replication wisely and only if the value of the data is worth the additional costs.

- **Fast Loading of Data**: Azure Blob Store has a set of partners and tools that provide fast data loading capabilities into the [ADD LINK!]

Furthermore, the implied performance cost of not having compute and storage co-located is actually mitigated by the way the compute clusters are provisioned close to the storage account resources inside the Azure data center, where the high speed network makes it very efficient for the compute nodes to access the data inside ASV. Depending on general load, compute and access patterns, we have observed only slight performance degradation and often even faster access!

And please don't forget, by not having to reload the data into the file system every time you provision an HDInsight cluster, you can save on data load times and data movement charges!

####What about my Temporary Data in Hive Jobs etc?####

Certain Map-Reduce jobs and packages may create intermediate results that you don't really want to store in the Azure Blob Store container. In that case, you can still select to store the data in the local HDFS/DFS file system. In fact, HDInsight is using HDFS/DFS for several of these intermediate results in Hive jobs and other processes. [ADD FULL LIST AND WHERE TO SET IT?!]

###Using Azure Blob Store Containers in HDInsight Service###

When you provision a HDInsight cluster, you either get an Azure Blob Store container provisioned as your default file system, or you can select any existing container of the storage account that you use to provision the HDInsight cluster from a drop-down menu in the HDInsight portal.

This container may be a container that has been created as an HDFS/ASV file system, or it may be just an arbitrary Azure Blob Store container created outside of HDInsight. In either case you can "mount" it and use it as the default file system. Note that the data will stay in that container and will **not** be copied to a different location.

####Addressing a file inside HDFS/ASV####

Since the default file system is HDFS/ASV, you can just refer to files and directories inside the file system using relative or absolute paths. For example, the following statement will list all top-level directories and files of the default file system:

    hadoop fs -ls /

However, you can refer to any HDFS/ASV file system, and in fact any Azure Blob Store container, that lives inside your storage subscription by referring to it using the following ASV URI scheme (`[]` indicate that the part is optional, `<>` enclose concepts): 
 
    asv[s]://[[<container>@]<domain>]/<path>
    
The ASV URI scheme provides for both an unencrypted way to access the data inside your file system with the `asv:` prefix, and an SSL encrypted way with `asvs:`. Note that we recommend to use `asvs:` wherever possible, even if you are just accessing data that lives inside the same data center.

The `<container>` identifies the name of the Azure Blob Store container that is being referred to. If no container name is specified but the domain is, then it refers to the root container of the domain's storage account. Note that root containers are read-only.

The `<domain>` identifies the storage account domain. If it does not contain a dot (`.`), it will be interpreted as `<domain>.blob.core.windows.net`.

If neither the container nor the domain has been specified, then the default file system is being referenced.

Finally, the `<path>` is the file's or directory's HDFS path name. Since Azure Blob Store containers are just a key-value store, there is no true hierarchical file system. So a `/` inside an Azure Blob's key is being interpreted as a directory separator. Thus, if a blob's key is `input/log1.txt`, then it is being exposed in HDFS/ASV as the file `log1.txt` inside the directory `input`.

For example,

`asvs://dailylogs@myaccount/input/log1.txt`

refers to the file `log1.txt` in the directory `input` on the Azure Blob Store container `dailylogs` at the location `myaccount.blob.core.windows.net` using SSL.

`asvs://myaccount/result.txt` 

refers to the file `result.txt` on the read-only HDFS/ASV filesystem in the root container at the location `myaccount.blob.core.windows.net` that gets accessed with the use of SSL. Note that `asv://myaccount/output/result.txt` will result in an exception, because Azure Blob Store does not allow `/` inside pathnames in the root container to avoid ambiguities between paths and folder names. 

`asv:///output/result.txt` refers to the file `result.txt` in the `output` directory on the default HDFS/ASV filesystem.

####Mapping an ASV URI to an Azure Blob Store URI####

Given an ASV URI, it may be desirable to create the Azure Blob Store URI, to be able to access the blob directly at the Azure Blob Store. The mapping is straight forward. To access an HDFS/ASV file (or explicit folder) at 

    asv[s]://<account>/<path-name>

through the Azure Blob Store URI, use

`http[s]://<account>/<path-name>`

(assuming `<account>` is the fully expanded domain or adding the `.blob.core.windows.net`), and to access the file 

    asv[s]://<container>@<account>/<path-name>
    
through the Azure Blob Store URI, use

`http[s]://<account>/<container>/<path-name>`

The short form:

`asv[s]:///<path-name>`

translates to the Azure Blob Store URI

`http[s]://<account>/<container>/<path-name>`

where account and container are the values used for specifying the default HDFS/ASV file system.

For examples,

`asvs://dailylogs@myaccount/input/log1.txt`

can be accessed through the Azure Blob Store URI 

`https://myaccount.blob.core.windows.net/dailylogs/input/log1.txt`.

###Using Multiple Azure Blob Store Containers###

It should now be fairly obvious, that you can refer to locations in several Azure Blob Store containers inside your default storage subscription beyond the one that is used as the default HDFS/ASV file system by simply using the ASV URI for the desired locations.

But what if you want to access a container that lives in a separate storage subscription? Even that is possible! However be aware that accessing such a location may go outside of your subscription's data center. So please be aware that this may incur additional charges for data flowing across the data center boundaries, and may be seen by third parties, unless you use the `asvs` URI scheme.

In order to access such a storage account container, the storage account either needs to be publicly readable, or you have to add the storage account's key to your HDInsight's `core-site.xml` file by adding the following entry for every storage account that you want to access:

    <property>
    	<name>fs.azure.account.key.<accountname></name>
    	<value><enterthekeyvaluehere></value>
    </property>

###How does ASV Map Files and Directories into Azure Blob Store Containers?###

We already mentioned how ASV maps a non-hierarchical Azure Blob's key into the hierarchical HDFS file system above. We basically assume that each blob maps to a file, and that each segment in the blob's key separated by a `/` implies a directory, or - in the case of the last segment - the file name.

This is basically also how we are mapping the HDFS file and directory structure back into the Azure Blob Store container. A file `f.txt` inside the directories `a/b/c` will be stored as blob `a/b/c/f.txt` inside the Azure Blob Store container.

In order to preserve the POSIX-based semantics of HDFS, we however need to add some more information to preserve the presence of folders that are explicitly created by `mkdir` or implicitly by creating files inside them. We achieve that by creating a place holder blob for the directory, that is empty, and has two meta properties that indicate that the blob is an ASV directory (`asv_isfolder`) and what its permissions are (`asv_permissions`).

Such folder blobs may also be created in a normal Azure Blob Store container, if you perform a writing/updating HDFS file command on it such as deleting a file inside a folder, since we need to preserve the semantics that deleting a file will not delete the containing folder.

###How can I create a New HDFS/ASV File System?###

Finally, you may ask yourself how you can create new HDFS/ASV file systems. One way is to create a new Azure Blob Store container through the commonly-used APIs in a storage account for which `core-site.xml` contains the storage key.

In addition, you can also create a new container by referring to it in an HDFS file system command. For example,

`hadoop fs -mkdir asvs://newcont@myaccount/a`

will not only create the new directory `a` but - if not yet existing - will also create a new container called `newcont`.

 In the current CTP, even ls will do so, but by the time we release it generally, this will only occur for statements that create files/directories.

###Conclusion###

In this article you learned not only how to use Azure Blob Storage with HDInsight but also that Azure Blob Storage is a fundamental component of the HDInsight Service. This will allow you to build scalable, long-term archiving data acquisition solutions with Azure Blob Storage and use HDInsight to unlock the information inside the stored data. Feedback on this article as well as the Azure Storage Vault capabilities are very welcome!

##Next Steps

* [Using Pig with HDInsight][hdinsight-pig] 

* [Using Hive with HDInsight][hdinsight-hive]

* [Using MapReduce with HDInsight][hdinsight-mapreduce]

[hdinsight-pig]: /en-us/manage/services/hdinsight/using-pig/
[hdinsight-hive]: /en-us/manage/services/hdinsight/using-hive/
[hdinsight-mapreduce]: /en-us/manage/services/hdinsight/using-mapreduce/
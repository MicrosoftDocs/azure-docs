<properties linkid="manage-services-hdinsight-using-blob-store-hdinsight" urlDisplayName="Using Windows Azure Blob Store with HDInsight" pageTitle="Using Blob Store with HDInsight - Windows Azure tutorial" metaKeywords="hdinsight blob, asv, hdinsight asv, hdinsight azure" metaDescription="How to use Windows Azure Blob Store with HDInsight" umbracoNaviHide="0" disqusComments="1" writer="sburgess" editor="mollybos" manager="paulettm" />

<div chunk="../chunks/hdinsight-left-nav.md" />

#Using Windows Azure Blob Storage with HDInsight  #




Windows Azure HDInsight Service supports both Hadoop Distributed Files System (HDFS) and Windows Azure Blob Storage for storing data. Blob Storage is a robust, general purpose Windows Azure storage solution. An HDFS file system over Blob Storage is referred as Azure Storage Vault or ASV for short. ASV provides a full featured HDFS file system interface for Blob Storage that provides a seamless experience to customers by enabling the full set of components in the Hadoop ecosystem to operate (by default) directly on the data managed by Blog Storage. Blob Storage is not just a low cost solution. Storing data in Blob Storage enables the HDInsight clusters used for computation to be safely deleted without losing user data. 

**Note:** Most HDFS commands such as ls, copyFromLocal, mkdir etc. will still work as expected. Only the commands that are specific to the native HDFS implementation (which is referred to as DFS) such as fschk and dfsadmin will show different behavior.

In this Article

	• The HDInsight service storage architecture
	• Provision the default file system
	• Accessing files in other blob storage
	• Addressing files in blob storage
	• Mapping an ASU URI to a Blob Storage URI
	• Mapping Files and Directories into Blob Storage Containers
	• Conclusion
	• Next Steps

##The HDInsight Service Storage Architecture
The following diagram provides an abstract view of the HDInsight Service's storage architecture:

![HDI.ASVArch](../Media/HDI.ASVArch.gif "HDInsight Storage Architecture")
  
The HDInsight Service provides access to the distributed file system that is locally attached to the compute nodes. This file system can be accessed using the fully qualified URI. For example: hdfs://<namenodehost>/<path>. 

In addition, HDInsight Service provides the ability to access data stored in Blob Storage containers, one of which is designated as the default file system during the provision process.

##Benefits of ASV
The implied performance cost of not having compute and storage co-located is mitigated by the way the compute clusters are provisioned close to the storage account resources inside the Windows Azure data center, where the high speed network makes it very efficient for the compute nodes to access the data inside Blob Storage. Depending on general load, compute and access patterns, only slight performance degradation has been observed and often even faster access.

There are several benefits associated with storing the data in Blob Storage instead of HDFS:

* **Data reuse and sharing:** The data in HDFS is located inside the compute cluster. Only the applications that have access to the compute cluster can use the data using HDFS API. The data in Blob Storage can be accessed either through the HDFS APIs or through the [Blob Storage REST APIs](http://msdn.microsoft.com/en-us/library/windowsazure/dd135733.aspx). Thus, a larger set of applications and tools can be used to produce and consume the data.
* **Data archiving:** Storing data in Blob Storage enables the HDInsight clusters used for computation to be safely deleted without losing user data. 
* **Data storage cost:** Storing data in DFS for the long term will be more costly than storing the data in Blob Storage since the cost of a compute cluster is higher than the cost of a Blob Storage container. In addition, since the data does not have to be reloaded for every compute cluster generation, you are saving data loading costs as well.
* **Elastic scale-out:** While HDFS provides you with a scaled-out file system, the scale is determined by the number of nodes that you provision for your cluster. Changing the scale can become a more complicated process than relying on the Blob Storage's elastic scaling capabilities that you get automatically.
* **Geo replication:** Your Blob Storage containers can be geo replicated through the Azure Portal. While this gives you geographic recovery and data redundancy, a fail-over to the geo replicated location will severely impact your performance and may incur additional costs. So our recommendation is to choose the geo replication wisely and only if the value of the data is worth the additional costs.

Certain Map-Reduce jobs and packages may create intermediate results that you don't really want to store in the Blob Storage container. In that case, you can still elect to store the data in the local HDFS file system. In fact, HDInsight uses DFS for several of these intermediate results in Hive jobs and other processes. 

##Provision the Default File System
Hadoop supports a notion of default file system. A user can set the default file system for his HDInsight cluster during the provision process. The default file system implies a default scheme and authority; it can also be used to resolve relative paths.

When provisioning an HDInsight cluster from Windows Azure Management Portal, there are two options: quick create and custom create. Using either of the options, a Windows Azure Storage account must be created beforehand.  For instructions, see How to [Create a Storage Account]( /en-us/manage/services/storage/how-to-create-a-storage-account/). 

Using the quick create option, you can choose an existing storage account. The provision process will create a new container with the same name as the HDInsight cluster name. This container will be used as the default file system.

![HDI.QuickCreate](../Media/HDI.QuickCreate.png "HDInsight Cluster Quick Create")
 
Using the custom create, you can either choose an existing Blob Storage container or create a new container to be provisioned as the default file system. The new container has the same name as the HDInsight cluster name.

![HDI.CustomCreateStorageAccount](../Media/HDI.CustomCreateStorageAccount.png "Custom Create Storage Account")

The provision process adds an entry to the C:\apps\dist\hadoop-1.1.0-SNAPSHOT\conf\core-site.xml file:

	<property>
	    <name>fs.azure.account.key.<accountname></name>
	    <value><enterthekeyvaluehere></value>
	</property>
	
Once a Blob Storage container has designated as the default file system for the HDInsight Service, it cannot be changed to a different container. 

##Accessing Files in other Blob Storage

Other than the Blob Storage container designated as the default file system, you can also access containers that reside in the same Windows Azure storage account or different Windows Azure storage accounts:

* Container in the same storage account: Because the account name and key are stored in the core-site.xml, you have full access to the files in the container.
* Container in a different storage account with the public container access level: you have read only permission to the files in the container.
* Container in a different storage account with the private or public blob access levels: you must add a new entry to the core-site.xml files to be able to access the files in the container:

		<property>
		    <name>fs.azure.account.key.<accountname></name>
		    <value><enterthekeyvaluehere></value>
		</property>
	
Be aware that accessing such a container may go outside of your subscription's data center, this may incur additional charges for data flowing across the data center boundaries. It should also always be encrypted using the ASVS URI scheme.

Creating an ASV File System can be done by creating a new Blob Storage container through the commonly-used APIs in a storage account for which core-site.xml contains the storage key. In addition, you can also create a new container by referring to it in an HDFS file system command. For example:

	hadoop fs -mkdir asvs://newcontainer@myaccount/newdirectory

The example command will not only create the new directory newdirectory but, if it doesn't exist, will also create a new container called newcontainer.

This container may be a container that has been created as an ASV file system, or it may be just an arbitrary Blob Storage container created outside of HDInsight. In either case you can "mount" it and use it as the default file system. Note that the data will stay in that container and will not be copied to a different location.

##Addressing Files in Blob Storage

The URI scheme ([] indicates that the part is optional, <> enclose concepts) for accessing files in Blob Storage is: 

	asv[s]://[[<container>@]<domain>]/<path>

	The URI scheme provides both unencrypted access with the ASV: prefix, and SSL encrypted access with ASVS:. We recommend using ASVS: wherever possible, even when accessing data that lives inside the same Windows Azure data center.
	
	The <container> identifies the name of the Blob Storage container. If no container name is specified but the domain is, then it refers to the [root container](http://msdn.microsoft.com/en-us/library/windowsazure/ee395424.aspx) of the domain's storage account. Note that root containers are read-only.
	
	The <domain> identifies the storage account domain. If it does not contain a dot (.), it will be interpreted as <domain>.blob.core.windows.net.
	
	If neither the container nor the domain has been specified, then the default file system is used.
	
	The <path> is the file or directory HDFS path name. Since Blob Storage containers are just a key-value store, there is no true hierarchical file system. A / inside an Azure Blob's key is interpreted as a directory separator. Thus, if a blob's key is input/log1.txt, then it is the file log1.txt inside the directory input.

For example:

	asvs://dailylogs@myaccount/input/log1.txt
	
	refers to the file log1.txt in the directory input on the Blob Storage container dailylogs at the location myaccount.blob.core.windows.net using SSL.
	
	asvs://myaccount/result.txt
	
	refers to the file result.txt on the read-only ASV file system in the root container at the location myaccount.blob.core.windows.net that gets accessed through SSL. Note that asv://myaccount/output/result.txt will result in an exception, because Blob Storage does not allow / inside path names in the root container to avoid ambiguities between paths and folder names. 
	
	asv:///output/result.txt 
	refers to the file result.txt in the output directory on the default file system.

Because HDInsight uses a Blob Storage container as the default file system, you can refer to files and directories inside the default file system using relative or absolute paths. For example, the following statement will list all top-level directories and files of the default file system:

	hadoop fs -ls /

##Mapping an ASV URI to a Blob Storage URI

Given an ASV URI, you may need to be able to create the Blob Storage URI which can be used to access the blob directly in Blob Storage. The mapping is straight forward. 

To access an file (or folder) at 

<table>
<tr><th>AVS URI</th><th>Blob Storage URI</th></tr>
<tr><td>asv[s]://<account>/<path-name></td><td>http[s]://<account>/<path-name></td></tr>
<tr><td>asv[s]://<container>@<account>/<path-name></td><td>http[s]://<account>/<container>/<path-name></td></tr>
<tr><td>asv[s]:///<path-name></td><td>http[s]://<account>/<container>/<path-name><br/>

where account and container are the values used for specifying the default file system.</td></tr>

<tr><td>asvs://dailylogs@myaccount/input/log1.txt</td><td>https://myaccount.blob.core.windows.net/dailylogs/input/log1.txt</td></tr>
</table>

##Mapping Files and Directories into Blob Storage Containers

Blob Storage containers are a key-value store. There is no true hierarchical file system. A / inside an Azure Blob's key is interpreted as a directory separator. Each segment in the blob's key separated by a directory separator implies a directory, or, in the case of the last segment, the file name. For example a blob's key input/log1.txt is the file log1.txt inside the directory input.

This is also how to map the HDFS file and directory structure back into the Blob Storage container. A file f.txt inside the directories a/b/c will be stored as blob called a/b/c/f.txt inside the Blob Storage container.

In order to preserve the POSIX-based semantics of HDFS, you need to add some more information to preserve the presence of folders that were created either explicitly through mkdir or implicitly by creating files inside them. This is achieved by creating a place holder blob for the directory, which is empty, and has two metadata properties that indicate that the blob is an ASV directory (asv_isfolder) and what its permissions are (asv_permissions).

Such folder blobs may also be created in a normal Blob Storage container, if you perform a writing/updating HDFS file command on it such as deleting a file inside a folder, since is it necessary to preserve the semantics that deleting a file will not delete the containing folder.

##Conclusion

In this article, you learned how to use Blob Storage with HDInsight and that Blob Storage is a fundamental component of the HDInsight Service. This will allow you to build scalable, long-term archiving data acquisition solutions with Windows Azure Blob Storage and use HDInsight to unlock the information inside the stored data.

##Next Steps

Now you understand how to use Windows Azure Blob Storage. To learn more, see the following articles:

* [How to: Upload data][upload-data]
* [Using Pig with HDInsight][pig]
* [Using Hive with HDInsight][hive]
* [Using MapReduce with HDInsight][mapreduce]


[upload-data]: /en-us/manage/services/hdinsight/howto-upload-data-to-hdinsight/
[pig]: \en-us\manage\services\hdinsight\howto-pig\
[hive]: \en-us\manage\services\hdinsight\howto-hive\
[mapreduce]: \en-us\manage\services\hdinsight\howto-mapreduce\
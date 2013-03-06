<properties linkid="using-blob-store-hdinsight" urlDisplayName="Using Windows Azure Blob Store with HDInsight" pageTitle="Using Blob Store with HDInsight - Windows Azure tutorial" metaKeywords="hdinsight blob, asv, hdinsight asv, hdinsight azure" metaDescription="How to use Windows Azure Blob Store with HDInsight" metaCanonical="http://www.windowsazure.com/en-us/manage/hdinsight/using-blob-store" umbracoNaviHide="0" disqusComments="1" writer="sburgess" editor="mollybos" manager="paulettm" />

##Using Windows Azure Blob Store with HDInsight  ##

### Getting started ###

When you provision an HDInsight cluster, you will have to provide an Azure storage account. HDInsight will per default create the default HDFS file system in an Azure Blob Store container that has the same name as your HDInsight cluster in the provided storage account. If such a container already exists, it will use it with all the data preloaded. If it does not exist yet, it will be created.

While you are using HDInsight and are only interacting with the storage through your HDFS commands, the file system will look like any other HDFS file system, with the difference though, that the file system is not located inside the compute cluster, but in the highly scalable Azure Blob Store container. We refer to an HDFS file system also as an *Azure Storage Vault* or HDFS/ASV or ASV for short.

Most HDFS commands such as `ls`, `copyFromLocal`, `mkdir ` etc. will still be working as expected. Only the commands that are specific to the native HDFS implementation (which we often refer to as HDFS/DFS) such as `fschk` and `dfsadmin` are showing different behavior.

In the following, we are going to give you an overview of how the architecture looks like, what you will see if you look at your HDFS/ASV data through the Azure Blob Store view, how you can use any Azure Blob Store container that you have access to through HDFS, address them through a new URI scheme and how to use multiple Azure Blob Store containers.

### The HDInsight Service Storage Architecture ###

The following diagram provides you with an abstract view of the HDInsight Service's storage architecture:


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

 

**MarkdownPad** is a full-featured Markdown editor for Windows.

### Built exclusively for Markdown ###

Enjoy first-class Markdown support with easy access to  Markdown syntax and convenient keyboard shortcuts.

Give them a try:

- **Bold** (`Ctrl+B`) and *Italic* (`Ctrl+I`)
- Quotes (`Ctrl+Q`)
- Code blocks (`Ctrl+K`)
- Headings 1, 2, 3 (`Ctrl+1`, `Ctrl+2`, `Ctrl+3`)
- Lists (`Ctrl+U` and `Ctrl+Shift+O`)

### See your changes instantly with LivePreview ###

Don't guess if your [hyperlink syntax](http://markdownpad.com) is correct; LivePreview will show you exactly what your document looks like every time you press a key.

### Make it your own ###

Fonts, color schemes, layouts and stylesheets are all 100% customizable so you can turn MarkdownPad into your perfect editor.

### A robust editor for advanced Markdown users ###

MarkdownPad supports multiple Markdown processing engines, including standard Markdown, Markdown Extra (with Table support) and GitHub Flavored Markdown.

With a tabbed document interface, PDF export, a built-in image uploader, session management, spell check, auto-save, syntax highlighting and a built-in CSS management interface, there's no limit to what you can do with MarkdownPad.

##Next Steps

* [Using Pig with HDInsight][hdinsight-pig] 

* [Using Hive with HDInsight][hdinsight-hive]

* [Using MapReduce with HDInsight][hdinsight-mapreduce]

[hdinsight-pig]: /en-us/manage/services/hdinsight/using-pig/
[hdinsight-hive]: /en-us/manage/services/hdinsight/using-hive/
[hdinsight-mapreduce]: /en-us/manage/services/hdinsight/using-mapreduce/
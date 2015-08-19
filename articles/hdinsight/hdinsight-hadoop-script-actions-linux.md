<properties
    pageTitle="Script Action Development with HDInsight | Microsoft Azure"
    description="Learn how to customize Hadoop clusters with Script Action."
    services="hdinsight"
    documentationCenter=""
    authors="Blackmist"
    manager="paulettm"
    editor="cgronlun"/>

<tags
    ms.service="hdinsight"
    ms.workload="big-data"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="08/18/2015"
    ms.author="larryfr"/>

# Script Action development with HDInsight

Script Actions are a way to customize Azure HDInsight clusters by specifying cluster configuration settings during installation, or installing additional services, tools, or other software on the cluster.

> [AZURE.NOTE] The information in this document is specific to Linux-based HDInsight clusters. For information on using Script Actions with Windows-based clusters, see [Script action development with HDInsight (Windows)](hdinsight-hadoop-script-actions.md).

## What are Script Actions?

Script actions are Bash scripts that run on the cluster nodes during provisioning. A script action is executed as root, and provides full access rights to the cluster nodes.

Script Action can be used when provisioning a cluster using the __Azure preview portal__, __Azure PowerShell__, or the __HDInsight .NET SDK__.

For an walkthrough of customizing a cluster using Script Actions, see [Customize HDInsight clusters using script actions](hdinsight-hadoop-customize-cluster-linux.md).

## <a name="bestPracticeScripting"></a>Best practices for script development

When you develop a custom script for an HDInsight cluster, there are several best practices to keep in mind:

- [Target the Hadoop version](#bPS1)
- [Provide stable links to script resources](#bPS2)
- [Ensure that the cluster customization script is idempotent](#bPS3)
- [Ensure high availability of the cluster architecture](#bPS5)
- [Configure the custom components to use Azure Blob storage](#bPS6)
- [Write information to STDOUT and STDERR](#bPS7)

### <a name="bPS1"></a>Target the Hadoop version

Different versions of HDInsight have different versions of Hadoop services and components installed. If your script expects a specific version of a service or component, you should only use the script with the version of HDInsight that includes the required components. You can find information on component versions included with HDInsight using the [HDInsight component versioning](hdinsight-component-versioning.md) document.

### <a name="bPS2"></a>Provide stable links to script resources

Users should make sure that all of the scripts and resources used by the script remain available throughout the lifetime of the cluster and that the versions of these files do not change for the duration. These resources are required if the nodes in the cluster are re-imaged.

The best practice is to download and archive everything in an Azure Storage account on your subscription.

> [AZURE.IMPORTANT] The storage account used must be the default storage account for the cluster or a public, read-only container on any other storage account.

For example, the samples provided by Microsoft are stored in the [https://hdiconfigactions.blob.core.windows.net/](https://hdiconfigactions.blob.core.windows.net/) storage account, which is a public, read-only container maintained by the HDInsight team.

### <a name="bPS3"></a>Ensure that the cluster customization script is idempotent

You must expect that the nodes of an HDInsight cluster will be re-imaged during the cluster lifetime, and that the cluster customization script will be used when this happens. The script must be designed to be idempotent in the sense that upon re-imaging, the script should ensure that the cluster is returned to the same state every time it is ran.

For example, if a custom script installs an application at /usr/local/bin on its first run, then on each subsequent run the script should check whether the application already exists at the /usr/local/bin location before proceeding with other steps in the script.

### <a name="bPS5"></a>Ensure high availability of the cluster architecture

Linux-based HDInsight clusters provides two head nodes that are active within the cluster, and Script Actions are ran for both nodes. If the components you install expect only one head node, you must design a script that will only install the component on one of the two head nodes in the cluster. The head nodes are named **headnode0** and **headnode1**.

> [AZURE.IMPORTANT] Default services installed as part of HDInsight are designed to fail over between the two head nodes as needed, however this functionality is not extended to custom components installed through Script Actions. If you need the components installed through a Script Action to be highly available, you must implement your own failover mechanism that uses the two available head nodes.

### <a name="bPS6"></a>Configure the custom components to use Azure Blob storage

Components that you install on the cluster might have a default configuration that uses Hadoop Distributed File System (HDFS) storage. On a cluster re-image, the HDFS file system gets formatted and you will lose any data that is stored there. You should change the configuration to use Azure Blob storage (WASB) instead, as this is the default storage for the cluster, and is kept even when the cluster is deleted.

For example, the following copies the giraph-examples.jar file from the local file system to WASB:

    hadoop fs -copyFromLocal /usr/hdp/current/giraph/giraph-examples.jar /example/jars/
    
### <a name="bPS7"></a>Write information to STDOUT and STDERR

Information written to STDOUT and STDERR is logged, and can be viewed after the cluster has been provisioned by using the Ambari web UI.

Most utilities and installation packages will already write information to STDOUT and STDERR, however you may want to add additional logging. To send text to STDOUT use `echo`. For example:

        echo "Getting ready to install Foo"

By default, `echo` will send the string to STDOUT. To direct it to STDERR, add `>&2` before `echo`. For example:

        >&2 echo "An error occured installing Foo"
        
This redirects information sent to STDOUT (1, which is default so not listed here,) to STDERR (2). For more information on IO redirection, see [http://www.tldp.org/LDP/abs/html/io-redirection.html](http://www.tldp.org/LDP/abs/html/io-redirection.html).
        
For more information on viewing information logged by Script Actions, see [Customize HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md#troubleshooting)

## <a name="helpermethods"></a>Helper methods for custom scripts

Script Action helper methods are utilities that you can use while writing custom scripts. These are defined in [https://hdiconfigactions.blob.core.windows.net/linuxconfigactionmodulev01/HDInsightUtilities-v01.sh](https://hdiconfigactions.blob.core.windows.net/linuxconfigactionmodulev01/HDInsightUtilities-v01.sh), and can be included in your scripts using the following:

    # Import the helper method module.
    wget -O /tmp/HDInsightUtilities-v01.sh -q https://hdiconfigactions.blob.core.windows.net/linuxconfigactionmodulev01/HDInsightUtilities-v01.sh && source /tmp/HDInsightUtilities-v01.sh && rm -f /tmp/HDInsightUtilities-v01.sh
    
This makes the following helpers available for use in your script:

| Helper usage | Description |
| ------------ | ----------- |
| `download_file SOURCEURL DESTFILEPATH [OVERWRITE]` | Downloads a file from the source URL to the specified file path. By default, it will not overwrite an existing file. |
| `untar_file TARFILE DESTDIR` | Extracts a tar file (using `-xf`,) to the destination directory. |
| `test_is_headnode` | If ran on a cluster head node, returns 1; otherwise, 0. |
| `test_is_datanode` | If the current node is a data (worker) node, returns a 1; otherwise, 0. |
| `test_is_first_datanode` | If the current node is the first data (worker) node (named workernode0,) returns a 1; otherwise, 0. |

## <a name="commonusage"></a>Common usage patterns

This section provides guidance on implementing some of the common usage patterns that you might run into while writing your own custom script.

### Setting environment variables

In some cases, you may need to add system wide environment variables so that users connecting via SSH can use the components installed by your script. You can accomplish this by adding the environment variable to `/etc/environment`. For example, the following adds __HADOOP\_CONF\_DIR__:

    echo "HADOOP_CONF_DIR=/etc/hadoop/conf" | sudo tee -a /etc/environment

### Access to locations where the custom scripts are stored

Scripts used to customize a cluster needs to either be in the default storage account for the cluster or, if on another storage account, in a public read-only container. If your script accesses resources located elsewhere these also need to be in a publicly accessible (at least public read-only). For instance you might want to download a file to the cluster using `download_file`.

Storing the file in an Azure storage account accessible by the cluster (such as the default storage account,) will provide fast access, as this storage is within the Azure network.

## <a name="deployScript"></a>Checklist for deploying a script action

Here are the steps we took when preparing to deploy these scripts:

- Put the files that contain the custom scripts in a place that is accessible by the cluster nodes during deployment. This can be any of the default or additional Storage accounts specified at the time of cluster deployment, or any other publicly accessible storage container.

- Add checks into scripts to make sure that they execute idempotently, so that the script can be executed multiple times on the same node.

- Use a temporary file directory /tmp to keep the downloaded files used by the scripts and then clean them up after scripts have executed.

- In the event that OS-level settings or Hadoop service configuration files were changed, you may want to restart HDInsight services so that they can pick up any OS-level settings, such as the environment variables set in the scripts.

## <a name="runScriptAction"></a>How to run a script action

You can use Script Actions to customize HDInsight clusters by using the Azure portal, Azure PowerShell, or the HDInsight .NET SDK. For instructions, see [How to use Script Action](hdinsight-hadoop-customize-cluster-linux.md#howto).

## <a name="sampleScripts"></a>Custom script samples

Microsoft provides sample scripts to install components on an HDInsight cluster. The sample scripts and instructions on how to use them are available at the links below:

- [Install and use Hue on HDInsight clusters](hdinsight-hadoop-hue-linux.md)
- [Install and use Spark on HDInsight clusters](hdinsight-hadoop-spark-install-linux.md)
- [Install and use R on HDInsight Hadoop clusters](hdinsight-hadoop-r-scripts-linux.md)
- [Install and use Solr on HDInsight clusters](hdinsight-hadoop-solr-install-linux.md)
- [Install and use Giraph on HDInsight clusters](hdinsight-hadoop-giraph-install-linux.md)  

> [AZURE.NOTE] The documents linked above are specific to Linux-based HDInsight clusters. For a scripts that work with Windows-based HDInsight, see [Script action development with HDInsight (Windows)](hdinsight-hadoop-script-actions.md) or use the links available at the top of each article.

## <a name="seeAlso"></a>See also

[Customize HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md)

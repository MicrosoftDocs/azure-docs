<properties
	pageTitle="Use Hue with Hadoop on HDInsight Linux clusters | Microsoft Azure"
	description="Learn how to install and use Hue with Hadoop clusters on HDInsight Linux."
	services="hdinsight"
	documentationCenter=""
	authors="nitinme"
	manager="paulettm"
	editor="cgronlun"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/11/2015" 
	ms.author="nitinme"/>

# Install and use Hue on HDInsight Hadoop clusters

Learn how to install Hue on HDInsight Linux clusters and use tunneling to route the requests to Hue.

## What is Hue?

Hue is a set of Web applications used to interact with a Hadoop cluster. You can use Hue to browse the storage associated with a Hadoop cluster (WASB, in the case of HDInsight clusters), run Hive jobs and Pig scripts, etc. The following components are supported with Hue installation on an HDInsight Hadoop cluster.

* Beeswax Hive Editor
* Pig
* Metastore manager
* Oozie
* FileBrowser (which talks to WASB default container)
* Job Browser


## Install Hue using Script Actions

The [https://hdiconfigactions.blob.core.windows.net/linuxhueconfigactionv01/install-hue-uber-v01.sh](https://hdiconfigactions.blob.core.windows.net/linuxhueconfigactionv01/install-hue-uber-v01.sh) script action is used to install Hue on an HDInsight cluster. This section provides instructions about how to use the script when provisioning the cluster using the Azure portal.

> [AZURE.NOTE] You can also use Azure PowerShell or the HDInsight .NET SDK to create a cluster using this script. For more information on using these methods, see [Customize HDInsight clusters with Script Actions](hdinsight-hadoop-customize-cluster-linux.md).

1. Start provisioning a cluster by using the steps in [Provision HDInsight clusters on Linux](hdinsight-hadoop-provision-linux-clusters.md#portal), but do not complete provisioning.

	> [AZURE.NOTE] To install Hue on HDInsight clusters, the recommended headnode size is at least A4 (8 cores, 14 GB memory).

2. On the **Optional Configuration** blade, select **Script Actions**, and provide the information below:

	* __NAME__: Enter a friendly name for the script action.
	* __SCRIPT URI__: https://hdiconfigactions.blob.core.windows.net/linuxhueconfigactionv01/install-hue-uber-v01.sh
	* __HEAD__: Check this option
	* __WORKER__: Leave this blank.
	* __ZOOKEEPER__: Leave this blank.
	* __PARAMETERS__: The script expects the **cluster admin password** as a parameter. This is the password you specified while provisioning the cluster. You must specify the password within single quotes.


3. At the bottom of the **Script Actions**, use the **Select** button to save the configuration. Finally, use the **Select** button at the bottom of the **Optional Configuration** blade to save the optional configuration information.

4. Continue provisioning the cluster as described in [Provision HDInsight clusters on Linux](hdinsight-hadoop-provision-linux-clusters.md#portal).

## Use Hue with HDInsight clusters

SSH Tunneling is the only way to access Hue on the cluster once it is running. Tunneling via SSH allows the traffic to go directly to the headnode of the cluster where Hue is running. After the cluster has finished provisioning, use the following steps to use Hue on an HDInsight Linux cluster.

1. Use the information in [Use SSH Tunneling to access Ambari web UI, ResourceManager, JobHistory, NameNode, Oozie, and other web UI's](hdinsight-linux-ambari-ssh-tunnel.md) to create an SSH tunnel from your client system to the HDInsight cluster, and then configure your Web browser to use the SSH tunnel as a proxy.

2. Once you have created an SSH tunnel and configured your browser to proxy traffic through it, use the browser to open the Hue portal at http://headnode0:8888.

    > [AZURE.NOTE] When you log in for the first time, you will be prompted to create an account to log into the Hue portal. The credentials you specify here will be limited to the portal and are not related to the admin or SSH user credentials you specified while provision the cluster.

	![Login to the Hue portal](./media/hdinsight-hadoop-hue-linux/HDI.Hue.Portal.Login.png "Specify credentials for Hue portal")

### Run a Hive query

1. From the Hue portal, click **Query Editors**, and then click **Hive** to open the Hive editor.

	![Use Hive](./media/hdinsight-hadoop-hue-linux/HDI.Hue.Portal.Hive.png "Use Hive")

2. On the **Assist** tab, under **Database**, you should see **hivesampletable**. This is a sample table that is shipped with all Hadoop clusters on HDInsight. Enter a sample query in the right pane and see the output on the **Results** tab in the pane below, as shown in the screen capture.

	![Run Hive query](./media/hdinsight-hadoop-hue-linux/HDI.Hue.Portal.Hive.Query.png "Run Hive query")

	You can also use the **Chart** tab to see a visual representation of the result.

### Browse the cluster storage

1. From the Hue portal, click **File Browser** in the top-right corner of the menu bar.

2. By default the file browser opens at the **/user/myuser** directory. Click the forward slash right before the user directory in the path to go to the root of the Azure storage container associated with the cluster.

	![Use file browser](./media/hdinsight-hadoop-hue-linux/HDI.Hue.Portal.File.Browser.png "Use file browser")

3. Right-click on a file or folder to see the available operations. Use the **Upload** button in the right corner to upload files to the current directory. Use the **New** button to create new files or directories.

> [AZURE.NOTE] The Hue file browser can only show the contents of the default container associated with the HDInsight cluster. Any additional storage accounts/containers that you might have associated with the cluster will not be accessible using the file browser. However, the additional containers associated with the cluster will always be accessible for the Hive jobs. For example, if you enter the command `dfs -ls wasb://newcontainer@mystore.blob.core.windows.net` in the Hive editor, you can see the contents of additional containers as well. In this command, **newcontainer** is not the default container associated with a cluster.

## Important considerations

1. The script used to install Hue installs it only on HEADNODE0 of the cluster.

2. During installation, multiple Hadoop services (HDFS, YARN, MR2, Oozie) are restarted for updating the configuration. After the script finishes installing Hue, it might take some time for other Hadoop services to start up. This might affect Hue's performance initially. Once all services start up, Hue will be fully functional.

3.	Hue does not understand Tez jobs, which is the current default for Hive. If you want to use MapReduce as the Hive execution engine, update the script to use the following command in your script:

		set hive.execution.engine=mr;

4.	With Linux clusters, you can have a scenario where your services are running on HEADNODE0 while the Resource Manager could be running on HEADNODE1. Such a scenario might result in errors (shown below) when using Hue to view details of RUNNING jobs on the cluster. However, you can view the job details when the job has completed.

	![Hue portal error](./media/hdinsight-hadoop-hue-linux/HDI.Hue.Portal.Error.png "Hue portal error")

	This is due to a known issue. As a workaround, modify Ambari so that the active Resource Manager also runs on HEADNODE0.

5.	Hue understands WebHDFS while HDInsight clusters use Azure Storage using `wasb://`. So, the custom script used with script action installs WebWasb, which is a WebHDFS-compatible service for talking to WASB. So, even though the Hue portal says HDFS in places (like when you move your mouse over the **File Browser**), it should be interpreted as WASB.


## Next steps

- [Install and use Spark on HDInsight clusters](hdinsight-hadoop-spark-install-linux.md) for  instructions about how to use cluster customization to install and use Spark on HDInsight Hadoop clusters. Spark is an open-source parallel processing framework that supports in-memory processing to boost the performance of big data analytic applications.

- [Install Giraph on HDInsight clusters](hdinsight-hadoop-giraph-install-linux.md). Use cluster customization to install Giraph on HDInsight Hadoop clusters. Giraph allows you to perform graph processing using Hadoop, and it can be used with Azure HDInsight.

- [Install Solr on HDInsight clusters](hdinsight-hadoop-solr-install-linux.md). Use cluster customization to install Solr on HDInsight Hadoop clusters. Solr allows you to perform powerful search operations on stored data.

- [Install R on HDInsight clusters](hdinsight-hadoop-r-scripts-linux.md). Use cluster customization to install R on HDInsight Hadoop clusters. R is an open-source language and environment for statistical computing. It provides hundreds of built-in statistical functions and its own programming language that combines aspects of functional and object-oriented programming. It also provides extensive graphical capabilities.

[powershell-install-configure]: install-configure-powershell-linux.md
[hdinsight-provision]: hdinsight-provision-clusters-linux.md
[hdinsight-cluster-customize]: hdinsight-hadoop-customize-cluster-linux.md
[hdinsight-install-spark]: hdinsight-hadoop-spark-install-linux.md

---
title: Hue with Hadoop on HDInsight Linux-based clusters - Azure 
description: Learn how to install Hue on HDInsight clusters and use tunneling to route the requests to Hue. Use Hue to browse storage and run Hive or Pig.
keywords: hue hadoop
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 12/11/2017
ms.author: jasonh

---
# Install and use Hue on HDInsight Hadoop clusters

Learn how to install Hue on HDInsight clusters and use tunneling to route the requests to Hue.

> [!IMPORTANT]
> The steps in this document require an HDInsight cluster that uses Linux. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdinsight-windows-retirement).

## What is Hue?
Hue is a set of Web applications used to interact with a Hadoop cluster. You can use Hue to browse the storage associated with a Hadoop cluster (WASB, in the case of HDInsight clusters), run Hive jobs and Pig scripts, and so on. The following components are available with Hue installations on an HDInsight Hadoop cluster.

* Beeswax Hive Editor
* Pig
* Metastore manager
* Oozie
* FileBrowser (which talks to WASB default container)
* Job Browser

> [!WARNING]
> Components provided with the HDInsight cluster are fully supported and Microsoft Support will help to isolate and resolve issues related to these components.
>
> Custom components receive commercially reasonable support to help you to further troubleshoot the issue. This might result in resolving the issue OR asking you to engage available channels for the open source technologies where deep expertise for that technology is found. For example, there are many community sites that can be used, like: [MSDN forum for HDInsight](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=hdinsight), [http://stackoverflow.com](http://stackoverflow.com). Also Apache projects have project sites on [http://apache.org](http://apache.org), for example: [Hadoop](http://hadoop.apache.org/).
>
>

## Install Hue using Script Actions

The script to install Hue on a Linux-based HDInsight cluster is available at https://hdiconfigactions.blob.core.windows.net/linuxhueconfigactionv02/install-hue-uber-v02.sh. You can use this script to install Hue on clusters with either Azure Storage Blobs (WASB) or Azure Data Lake Store as default storage.

This section provides instructions about how to use the script when provisioning the cluster using the Azure portal.

> [!NOTE]
> Azure PowerShell, the Azure Classic CLI, the HDInsight .NET SDK, or Azure Resource Manager templates can also be used to apply script actions. You can also apply script actions to already running clusters. For more information, see [Customize HDInsight clusters with Script Actions](hdinsight-hadoop-customize-cluster-linux.md).
>
>

1. Start provisioning a cluster by using the steps in [Provision HDInsight clusters on Linux](hdinsight-hadoop-provision-linux-clusters.md), but do not complete provisioning.

   > [!NOTE]
   > To install Hue on HDInsight clusters, the recommended headnode size is at least A4 (8 cores, 14 GB memory).
   >
   >
2. On the **Optional Configuration** blade, select **Script Actions**, and provide the information as shown below:

    ![Provide script action parameters for Hue](./media/hdinsight-hadoop-hue-linux/hue-script-action.png "Provide script action parameters for Hue")

   * **NAME**: Enter a friendly name for the script action.
   * **SCRIPT URI**: https://hdiconfigactions.blob.core.windows.net/linuxhueconfigactionv02/install-hue-uber-v02.sh
   * **HEAD**: Check this option
   * **WORKER**: Leave this blank.
   * **ZOOKEEPER**: Leave this blank.
   * **PARAMETERS**: Leave this blank.
3. At the bottom of the **Script Actions**, use the **Select** button to save the configuration. Finally, use the **Select** button at the bottom of the **Optional Configuration** blade to save the optional configuration information.
4. Continue provisioning the cluster as described in [Provision HDInsight clusters on Linux](hdinsight-hadoop-provision-linux-clusters.md).

## Use Hue with HDInsight clusters

SSH Tunneling is the only way to access Hue on the cluster once it is running. Tunneling via SSH allows the traffic to go directly to the headnode of the cluster where Hue is running. After the cluster has finished provisioning, use the following steps to use Hue on an HDInsight Linux cluster.

> [!NOTE]
> We recommend using Firefox web browser to follow the instructions below.
>
>

1. Use the information in [Use SSH Tunneling to access Ambari web UI, ResourceManager, JobHistory, NameNode, Oozie, and other web UI's](hdinsight-linux-ambari-ssh-tunnel.md) to create an SSH tunnel from your client system to the HDInsight cluster, and then configure your Web browser to use the SSH tunnel as a proxy.

2. Once you have created an SSH tunnel and configured your browser to proxy traffic through it, you must find the host name of the primary head node. You can do this by connecting to the cluster using SSH on port 22. For example, `ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net` where **USERNAME** is your SSH user name and **CLUSTERNAME** is the name of your cluster.

    For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

3. Once connected, use the following command to obtain the fully qualified domain name of the primary headnode:

        hostname -f

    This will return a name similar to the following:

        hn0-myhdi-nfebtpfdv1nubcidphpap2eq2b.ex.internal.cloudapp.net

    This is the hostname of the primary headnode where the Hue website is located.
4. Use the browser to open the Hue portal at http://HOSTNAME:8888. Replace HOSTNAME with the name you obtained in the previous step.

   > [!NOTE]
   > When you log in for the first time, you will be prompted to create an account to log in to the Hue portal. The credentials you specify here will be limited to the portal and are not related to the admin or SSH user credentials you specified while provision the cluster.
   >
   >

    ![Login to the Hue portal](./media/hdinsight-hadoop-hue-linux/hdinsight-hue-portal-login.png "Specify credentials for Hue portal")

### Run a Hive query
1. From the Hue portal, click **Query Editors**, and then click **Hive** to open the Hive editor.

    ![Use Hive](./media/hdinsight-hadoop-hue-linux/hdinsight-hue-portal-use-hive.png "Use Hive")
2. On the **Assist** tab, under **Database**, you should see **hivesampletable**. This is a sample table that is shipped with all Hadoop clusters on HDInsight. Enter a sample query in the right pane and see the output on the **Results** tab in the pane below, as shown in the screen capture.

    ![Run Hive query](./media/hdinsight-hadoop-hue-linux/hdinsight-hue-portal-hive-query.png "Run Hive query")

    You can also use the **Chart** tab to see a visual representation of the result.

### Browse the cluster storage
1. From the Hue portal, click **File Browser** in the top-right corner of the menu bar.
2. By default the file browser opens at the **/user/myuser** directory. Click the forward slash right before the user directory in the path to go to the root of the Azure storage container associated with the cluster.

    ![Use file browser](./media/hdinsight-hadoop-hue-linux/hdinsight-hue-portal-file-browser.png "Use file browser")
3. Right-click on a file or folder to see the available operations. Use the **Upload** button in the right corner to upload files to the current directory. Use the **New** button to create new files or directories.

> [!NOTE]
> The Hue file browser can only show the contents of the default container associated with the HDInsight cluster. Any additional storage accounts/containers that you might have associated with the cluster will not be accessible using the file browser. However, the additional containers associated with the cluster will always be accessible for the Hive jobs. For example, if you enter the command `dfs -ls wasb://newcontainer@mystore.blob.core.windows.net` in the Hive editor, you can see the contents of additional containers as well. In this command, **newcontainer** is not the default container associated with a cluster.
>
>

## Important considerations
1. The script used to install Hue installs it only on the primary headnode of the cluster.

2. During installation, multiple Hadoop services (HDFS, YARN, MR2, Oozie) are restarted for updating the configuration. After the script finishes installing Hue, it might take some time for other Hadoop services to start up. This might affect Hue's performance initially. Once all services start up, Hue will be fully functional.
3. Hue does not understand Tez jobs, which is the current default for Hive. If you want to use MapReduce as the Hive execution engine, update the script to use the following command in your script:

     	set hive.execution.engine=mr;

4. With Linux clusters, you can have a scenario where your services are running on the primary headnode while the Resource Manager could be running on the secondary. Such a scenario might result in errors (shown below) when using Hue to view details of RUNNING jobs on the cluster. However, you can view the job details when the job has completed.

   ![Hue portal error](./media/hdinsight-hadoop-hue-linux/hdinsight-hue-portal-error.png "Hue portal error")

   This is due to a known issue. As a workaround, modify Ambari so that the active Resource Manager also runs on the primary headnode.
5. Hue understands WebHDFS while HDInsight clusters use Azure Storage using `wasb://`. So, the custom script used with script action installs WebWasb, which is a WebHDFS-compatible service for talking to WASB. So, even though the Hue portal says HDFS in places (like when you move your mouse over the **File Browser**), it should be interpreted as WASB.

## Next steps
* [Install Giraph on HDInsight clusters](hdinsight-hadoop-giraph-install-linux.md). Use cluster customization to install Giraph on HDInsight Hadoop clusters. Giraph allows you to perform graph processing using Hadoop, and it can be used with Azure HDInsight.
* [Install Solr on HDInsight clusters](hdinsight-hadoop-solr-install-linux.md). Use cluster customization to install Solr on HDInsight Hadoop clusters. Solr allows you to perform powerful search operations on stored data.
* [Install R on HDInsight clusters](hdinsight-hadoop-r-scripts-linux.md). Use cluster customization to install R on HDInsight Hadoop clusters. R is an open-source language and environment for statistical computing. It provides hundreds of built-in statistical functions and its own programming language that combines aspects of functional and object-oriented programming. It also provides extensive graphical capabilities.

[powershell-install-configure]: install-configure-powershell-linux.md
[hdinsight-provision]: hdinsight-provision-clusters-linux.md
[hdinsight-cluster-customize]: hdinsight-hadoop-customize-cluster-linux.md

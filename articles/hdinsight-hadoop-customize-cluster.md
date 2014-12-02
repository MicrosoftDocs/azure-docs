<properties linkid="customize HDInsight clusters using Script Action" urlDisplayName="Customize HDInsight clusters using Script Action" pageTitle="Customize HDInsight Clusters using Script Action| Azure" metaKeywords="" description="Learn how to customize HDInsight clusters using Script Action." metaCanonical="" services="hdinsight" documentationCenter="" title="Customize HDInsight clusters using Script Action" authors="nitinme" solutions="" manager="paulettm" editor="cgronlun" /> 

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/14/2014" ms.author="nitinme" />

# Customize HDInsight clusters using Script Action (Preview)

You can customize an Azure HDInsight cluster to install additional software on a cluster, or to change the configuration of applications on the cluster. HDInsight provides a configuration option called **Script Action** that invokes custom scripts, which define the customization to be performed on the cluster. These scripts can be used to customize a cluster *as it is being deployed*.  

HDInsight clusters can be customized in a variety of other ways as well such as including additional storage accounts, changing the hadoop configuration files (core-site.xml, hive-site.xml, etc.), or by adding shared libraries (e.g. Hive, Oozie) into common locations in the cluster. These customization can be done using HDInsight PowerShell, .NET SDK, or the Azure Management Portal. For more information, see [Provision Hadoop clusters in HDInsight using custom options][hdinsight-provision-cluster].



> [WACOM.NOTE] Using Script Action to customize a cluster is supported only on HDInsight cluster version 3.1. For more information on HDInsight cluster versions, see [HDInsight cluster versions](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-component-versioning/).



## In this article

- [How is the script used while cluster creation?](#lifecycle)
- [How to write a script for cluster customization?](#writescript)
- [Cluster customization examples](#example)


## <a name="lifecycle"></a>How is the script used while cluster creation?

Using Script Action, an HDInsight cluster can be customized only while it is in the process of being created. As an HDInsight cluster is being created, it goes through the following stages:

![HDInsight cluster customization and stages during cluster provisioning][img-hdi-cluster-states] 

The script is invoked after the cluster creation completes the *HDInsightConfiguration* stage and before the *ClusterOperational* stage. Each cluster can accept multiple script actions that are invoked in the order they are specified.

> [WACOM.NOTE] The option to customize HDInsight clusters is available as part of the standard Azure HDInsight subscriptions at no extra charge.

### How does the script work?

You have the option of running the script on either the headnode, the worker nodes, or both. When the script is running, the cluster enters the *ClusterCustomization* stage. At this stage, the script is run under the system admin account, in parallel on all the specified nodes in the cluster, and provides full admin privileges on the nodes. 

> [WACOM.NOTE] Because you have have admin privileges on the cluster nodes during the *Cluster customization* stage, you can use the script to perform operations like stopping and starting services, including Hadoop-related services. So, as part of the script, you must ensure that the Ambari services, and other Hadoop-related services are up and running before the script finishes running. These services are required to successfully ascertain the health and state of the cluster while it is being created. If you change any configuration on the cluster that affects these services, you must use the helper functions that are provided. For more information about helper functions, see [Script Action development with HDInsight][hdinsight-write-script].

The output as well as the error logs for the script are stored in the default storage account you specified for the cluster. The logs are stored in a table with the name *u<\cluster-name-fragment><\time-stamp>setuplog*. These are aggregate logs from the script run on all the nodes (headnode and worker nodes) in the cluster.

## <a name="writescript"></a>How to write a script for cluster customization?

For information on how to write a cluster customization script, see [Script Action development with HDInsight][hdinsight-write-script]. 

## <a name="example"></a>Cluster Customization Examples?

To get you started, HDInsight provides sample scripts to install Spark and R on an HDInsight cluster.

- For instructions on how to install Spark, see [Install Spark on HDInsight clusters][hdinsight-install-spark].
- For instructions on how to install R, see [Install R on HDInsight clusters][hdinsight-install-r].


## See also##
[Provision Hadoop clusters in HDInsight using custom options][hdinsight-provision-cluster] provides instructions on how to provision an HDInsight cluster using other custom options.

[hdinsight-install-spark]: ../hdinsight-hadoop-spark-install/
[hdinsight-install-r]: ../hdinsight-hadoop-r-scripts/
[hdinsight-write-script]: ../hdinsight-hadoop-script-actions/
[hdinsight-provision-cluster]: ../hdinsight-provision-clusters/

[img-hdi-cluster-states]: ./media/hdinsight-hadoop-customize-cluster/HDI-Cluster-state.png "Stages during cluster provisioning"
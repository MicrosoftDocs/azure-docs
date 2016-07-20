<properties
	pageTitle="Access Hadoop YARN application logs on Linux-based HDInsight | Microsoft Azure"
	description="Learn how to access YARN application logs on a Linux-based HDInsight (Hadoop) cluster using both the command-line and a web browser."
	services="hdinsight"
	documentationCenter=""
	tags="azure-portal"
	authors="Blackmist" 
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/12/2016"
	ms.author="larryfr"/>

# Access YARN application logs on Linux-based HDInsight 

This document explains how to access the logs for YARN (Yet Another Resource Negotiator) applications that have finished on a Hadoop cluster in Azure HDInsight.

> [AZURE.NOTE] The information in this document is specific to Linux-based HDInsight clusters. For information on Windows-based clusters, see [Access YARN application logs on Windows-based HDInsight](hdinsight-hadoop-access-yarn-app-logs.md)

## Prerequisites

* A Linux-based HDInsight cluster.

* You must [create an SSH tunnel](hdinsight-linux-ambari-ssh-tunnel.md) before you can access the ResourceManager Logs web UI.

## <a name="YARNTimelineServer"></a>YARN Timeline Server

The [YARN Timeline Server](http://hadoop.apache.org/docs/r2.4.0/hadoop-yarn/hadoop-yarn-site/TimelineServer.html) provides generic information on completed applications as well as framework-specific application information through two different interfaces. Specifically:

* Storage and retrieval of generic application information on HDInsight clusters has been enabled with version 3.1.1.374 or higher.
* The framework-specific application information component of the Timeline Server is not currently available on HDInsight clusters.

Generic information on applications includes the following sorts of data:

* The application ID, a unique identifier of an application
* The user who started the application
* Information on attempts made to complete the application
* The containers used by any given application attempt

## <a name="YARNAppsAndLogs"></a>YARN applications and logs

YARN supports multiple programming models (MapReduce being one of them) by decoupling resource management from application scheduling/monitoring. This is done through a global *ResourceManager* (RM), per-worker-node *NodeManagers* (NMs), and per-application *ApplicationMasters* (AMs). The per-application AM negotiates resources (CPU, memory, disk, network) for running your application with the RM. The RM works with NMs to grant these resources, which are granted as *containers*. The AM is responsible for tracking the progress of the containers assigned to it by the RM. An application may require many containers depending on the nature of the application.

Furthermore, each application may consist of multiple *application attempts* in order to finish in the presence of crashes or due to the loss of communication between an AM and an RM. Hence, containers are granted to a specific attempt of an application. In a sense, a container provides the context for basic unit of work performed by a YARN application, and all work that is done within the context of a container is performed on the single worker node on which the container was allocated. See [YARN Concepts][YARN-concepts] for further reference.

Application logs (and the associated container logs) are critical in debugging problematic Hadoop applications. YARN provides a nice framework for collecting, aggregating, and storing application logs with the [Log Aggregation][log-aggregation] feature. The Log Aggregation feature makes accessing application logs more deterministic, as it aggregates logs across all containers on a worker node and stores them as one aggregated log file per worker node on the default file system after an application finishes. Your application may use hundreds or thousands of containers, but logs for all containers run on a single worker node will always be aggregated to a single file, resulting in one log file per worker node used by your application. Log Aggregation is enabled by default on HDInsight clusters (version 3.0 and above), and aggregated logs can be found in the default container of your cluster at the following location:

	wasb:///app-logs/<user>/logs/<applicationId>

In that location, *user* is the name of the user who started the application, and *applicationId* is the unique identifier of an application as assigned by the YARN RM.

The aggregated logs are not directly readable, as they are written in a [TFile][T-file], [binary format][binary-format] indexed by container. You must use the YARN ResourceManager logs or CLI tools to view these logs as plain text for applications or containers of interest. 

##YARN CLI tools

In order to use the YARN CLI tools, you must first connect to the HDInsight cluster using SSH. Use one of the following documents for information on using SSH with HDInsight:

- [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)

- [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)
	
You can view these logs as plain text by running one of the following commands:

	yarn logs -applicationId <applicationId> -appOwner <user-who-started-the-application>
	yarn logs -applicationId <applicationId> -appOwner <user-who-started-the-application> -containerId <containerId> -nodeAddress <worker-node-address>
	
You must specify the &lt;applicationId>, &lt;user-who-started-the-application>, &lt;containerId>, and &ltworker-node-address> information when running these commands.

##YARN ResourceManager UI

The YARN ResourceManager UI runs on the cluster headnode, and can be accessed through the Ambari web UI; however, you must first [create an SSH tunnel](hdinsight-linux-ambari-ssh-tunnel.md) before you can access the ResourceManager UI.

Once you have created an SSH tunnel, use the following steps to view the YARN logs:

1. In your web browser, navigate to https://CLUSTERNAME.azurehdinsight.net. Replace CLUSTERNAME with the name of your HDInsight cluster.

2. From the list of services on the left, select __YARN__.

	![Yarn service selected](./media/hdinsight-hadoop-access-yarn-app-logs-linux/yarnservice.png)

3. From the __Quick Links__ dropdown, select one of the cluster head nodes and then select __ResourceManager Log__.

	![Yarn quick linnks](./media/hdinsight-hadoop-access-yarn-app-logs-linux/yarnquicklinks.png)
	
	You will be presented with a list of links to YARN logs.

[YARN-timeline-server]:http://hadoop.apache.org/docs/r2.4.0/hadoop-yarn/hadoop-yarn-site/TimelineServer.html
[log-aggregation]:http://hortonworks.com/blog/simplifying-user-logs-management-and-access-in-yarn/
[T-file]:https://issues.apache.org/jira/secure/attachment/12396286/TFile%20Specification%2020081217.pdf
[binary-format]:https://issues.apache.org/jira/browse/HADOOP-3315
[YARN-concepts]:http://hortonworks.com/blog/apache-hadoop-yarn-concepts-and-applications/

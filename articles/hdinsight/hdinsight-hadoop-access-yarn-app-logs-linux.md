---
title: Access Hadoop YARN application logs on Linux-based HDInsight - Azure 
description: Learn how to access YARN application logs on a Linux-based HDInsight (Hadoop) cluster using both the command-line and a web browser.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 03/22/2018
ms.author: jasonh

---
# Access YARN application logs on Linux-based HDInsight

Learn how to access the logs for YARN (Yet Another Resource Negotiator) applications on a Hadoop cluster in Azure HDInsight.

> [!IMPORTANT]
> The steps in this document require an HDInsight cluster that uses Linux. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight component versioning](hdinsight-component-versioning.md#hdinsight-windows-retirement).

## <a name="YARNTimelineServer"></a>YARN Timeline Server

The [YARN Timeline Server](http://hadoop.apache.org/docs/r2.7.3/hadoop-yarn/hadoop-yarn-site/TimelineServer.html) provides generic information on completed applications and framework-specific application information through two different interfaces. Specifically:

* Storage and retrieval of generic application information on HDInsight clusters has been enabled with version 3.1.1.374 or higher.
* The framework-specific application information component of the Timeline Server is not currently available on HDInsight clusters.

Generic information on applications includes the following type of data:

* The application ID, a unique identifier of an application
* The user who started the application
* Information on attempts made to complete the application
* The containers used by any given application attempt

## <a name="YARNAppsAndLogs"></a>YARN applications and logs

YARN supports multiple programming models (MapReduce being one of them) by decoupling resource management from application scheduling/monitoring. YARN uses a global *ResourceManager* (RM), per-worker-node *NodeManagers* (NMs), and per-application *ApplicationMasters* (AMs). The per-application AM negotiates resources (CPU, memory, disk, network) for running your application with the RM. The RM works with NMs to grant these resources, which are granted as *containers*. The AM is responsible for tracking the progress of the containers assigned to it by the RM. An application may require many containers depending on the nature of the application.

Each application may consist of multiple *application attempts*. If an application fails, it may be retried as a new attempt. Each attempt runs in a container. In a sense, a container provides the context for basic unit of work performed by a YARN application. All work that is done within the context of a container is performed on the single worker node on which the container was allocated. See [YARN Concepts][YARN-concepts] for further reference.

Application logs (and the associated container logs) are critical in debugging problematic Hadoop applications. YARN provides a nice framework for collecting, aggregating, and storing application logs with the [Log Aggregation][log-aggregation] feature. The Log Aggregation feature makes accessing application logs more deterministic. It aggregates logs across all containers on a worker node and stores them as one aggregated log file per worker node. The log is stored on the default file system after an application finishes. Your application may use hundreds or thousands of containers, but logs for all containers run on a single worker node are always aggregated to a single file. So there is only 1 log per worker node used by your application. Log Aggregation is enabled by default on HDInsight clusters version 3.0 and above. Aggregated logs are located in default storage for the cluster. The following path is the HDFS path to the logs:

    /app-logs/<user>/logs/<applicationId>

In the path, `user` is the name of the user who started the application. The `applicationId` is the unique identifier assigned to an application by the YARN RM.

The aggregated logs are not directly readable, as they are written in a [TFile][T-file], [binary format][binary-format] indexed by container. Use the YARN ResourceManager logs or CLI tools to view these logs as plain text for applications or containers of interest.

## YARN CLI tools

To use the YARN CLI tools, you must first connect to the HDInsight cluster using SSH. For information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

You can view these logs as plain text by running one of the following commands:

    yarn logs -applicationId <applicationId> -appOwner <user-who-started-the-application>
    yarn logs -applicationId <applicationId> -appOwner <user-who-started-the-application> -containerId <containerId> -nodeAddress <worker-node-address>

Specify the &lt;applicationId>, &lt;user-who-started-the-application>, &lt;containerId>, and &lt;worker-node-address> information when running these commands.

## YARN ResourceManager UI

The YARN ResourceManager UI runs on the cluster headnode. It is accessed through the Ambari web UI. Use the following steps to view the YARN logs:

1. In your web browser, navigate to https://CLUSTERNAME.azurehdinsight.net. Replace CLUSTERNAME with the name of your HDInsight cluster.
2. From the list of services on the left, select **YARN**.

    ![Yarn service selected](./media/hdinsight-hadoop-access-yarn-app-logs-linux/yarnservice.png)
3. From the **Quick Links** dropdown, select one of the cluster head nodes and then select **ResourceManager Log**.

    ![Yarn quick links](./media/hdinsight-hadoop-access-yarn-app-logs-linux/yarnquicklinks.png)

    You are presented with a list of links to YARN logs.

[YARN-timeline-server]:http://hadoop.apache.org/docs/r2.4.0/hadoop-yarn/hadoop-yarn-site/TimelineServer.html
[log-aggregation]:http://hortonworks.com/blog/simplifying-user-logs-management-and-access-in-yarn/
[T-file]:https://issues.apache.org/jira/secure/attachment/12396286/TFile%20Specification%2020081217.pdf
[binary-format]:https://issues.apache.org/jira/browse/HADOOP-3315
[YARN-concepts]:http://hortonworks.com/blog/apache-hadoop-yarn-concepts-and-applications/

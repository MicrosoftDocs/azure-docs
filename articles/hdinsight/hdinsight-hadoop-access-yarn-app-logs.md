---
title: Access Hadoop YARN application logs programmatically - Azure 
description: Access application logs programmatically on a Hadoop cluster in HDInsight.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/25/2017
ms.author: jasonh
ROBOTS: NOINDEX

---
# Access YARN application logs on Windows-based HDInsight
This document explains how to access the logs for YARN applications that have finished on a Windows-based Hadoop cluster in Azure HDInsight

> [!IMPORTANT]
> The information in this document applies only to Windows-based HDInsight clusters. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdinsight-windows-retirement). For information on accessing YARN logs on Linux-based HDInsight clusters, see [Access YARN application logs on Linux-based Hadoop on HDInsight](hdinsight-hadoop-access-yarn-app-logs-linux.md)
>


### Prerequisites
* A Windows-based HDInsight cluster.  See [Create Windows-based Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md).

## YARN Timeline Server
The <a href="http://hadoop.apache.org/docs/r2.4.0/hadoop-yarn/hadoop-yarn-site/TimelineServer.html" target="_blank">YARN Timeline Server</a> provides generic information on completed applications as well as framework-specific application information through two different interfaces. Specifically:

* Storage and retrieval of generic application information on HDInsight clusters has been enabled with version 3.1.1.374 or higher.
* The framework-specific application information component of the Timeline Server is not currently available on HDInsight clusters.

Generic information on applications includes the following sorts of data:

* The application ID, a unique identifier of an application
* The user who started the application
* Information on attempts made to complete the application
* The containers used by any given application attempt

On your HDInsight clusters, this information is stored by Azure Resource Manager. The information is saved to the history store in the default storage for the cluster. This generic data on completed applications can be retrieved through a REST API:

    GET on https://<cluster-dns-name>.azurehdinsight.net/ws/v1/applicationhistory/apps


## YARN applications and logs
YARN supports multiple programming models by decoupling resource management from application scheduling/monitoring. YARN uses a global *ResourceManager* (RM), per-worker-node *NodeManagers* (NMs), and per-application *ApplicationMasters* (AMs). The per-application AM negotiates resources (CPU, memory, disk, network) for running your application with the RM. The RM works with NMs to grant these resources, which are granted as *containers*. The AM is responsible for tracking the progress of the containers assigned to it by the RM. An application may require many containers depending on the nature of the application.

* Each application may consist of multiple *application attempts*. 
* Containers are granted to a specific attempt of an application. 
* A container provides the context for a basic unit of work. 
* Work that is done within the context of a container is performed on the single worker node that the container was allocated to. 

For more information, see [YARN Concepts][YARN-concepts].

Application logs (and the associated container logs) are critical in debugging problematic Hadoop applications. YARN provides a nice framework for collecting, aggregating, and storing application logs with the [Log Aggregation][log-aggregation] feature. The Log Aggregation feature makes accessing application logs more deterministic, as it aggregates logs across all containers on a worker node and stores them as one aggregated log file per worker node on the default file system after an application finishes. Your application may use hundreds or thousands of containers, but logs for all containers run on a single worker node are aggregated to a single file, resulting in one file per worker node used by your application. Log Aggregation is enabled by default on HDInsight clusters (version 3.0 and above), and aggregated logs can be found in the default container of your cluster at the following location:

    wasb:///app-logs/<user>/logs/<applicationId>

In that location, *user* is the name of the user who started the application, and *applicationId* is the unique identifier of an application as assigned by the YARN RM.

The aggregated logs are not directly readable, as they are written in a [TFile][T-file], [binary format][binary-format] indexed by container. YARN provides CLI tools to dump these logs as plain text for applications or containers of interest. You can view these logs as plain text by running one of the following YARN commands directly on the cluster nodes (after connecting to it through RDP):

    yarn logs -applicationId <applicationId> -appOwner <user-who-started-the-application>
    yarn logs -applicationId <applicationId> -appOwner <user-who-started-the-application> -containerId <containerId> -nodeAddress <worker-node-address>


## YARN ResourceManager UI
The YARN ResourceManager UI runs on the cluster headnode, and can be accessed through the Azure portal dashboard:

1. Sign in to [Azure portal](https://portal.azure.com/).
2. On the left menu, click **Browse**, click **HDInsight Clusters**, click a Windows-based cluster that you want to access the YARN application logs.
3. On the top menu, click **Dashboard**. You see a page opened on a new browser tab called **HDInsight Query Console**.
4. From **HDInsight Query Console**, click **Yarn UI**.

[YARN-timeline-server]:http://hadoop.apache.org/docs/r2.4.0/hadoop-yarn/hadoop-yarn-site/TimelineServer.html
[log-aggregation]:http://hortonworks.com/blog/simplifying-user-logs-management-and-access-in-yarn/
[T-file]:https://issues.apache.org/jira/secure/attachment/12396286/TFile%20Specification%2020081217.pdf
[binary-format]:https://issues.apache.org/jira/browse/HADOOP-3315
[YARN-concepts]:http://hortonworks.com/blog/apache-hadoop-yarn-concepts-and-applications/

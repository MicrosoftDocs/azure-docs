---
title: Troubleshoot a slow or failing HDInsight cluster - Azure HDInsight | Microsoft Docs
description: Diagnose and troubleshoot a slow or failing HDInsight cluster.
services: hdinsight
documentationcenter: ''
tags: azure-portal
author: ashishthaps
manager: jhubbard
editor: cgronlun

ms.assetid: 
ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/15/2017
ms.author: ashishth
---
# Troubleshoot a slow or failing HDInsight cluster

This article walks you through the process of troubleshooting an HDInsight cluster that is either in the failed state, or running slowly. A 'Failed Cluster' is defined as one that has terminated with an error code. If your jobs are taking longer to run than expected, or you are seeing slow response times in general, you may be experiencing failures upstream from your cluster, such as the services on which the cluster runs. However, the most common cause of these slowdowns have to do with scale. When you provision a new HDInsight cluster, you have many options for selecting [virtual machine sizes](hdinsight-using-external-metadata-stores.md) to preserve your metadata when you delete and recreate your cluster.

There are a set of general steps to take when diagnosing a failed or slow cluster. They involve getting information about all aspects of the environment, including, but not limited to, all associated Azure Services, cluster configuration, job execution information, and reproducability of error state.  The most common steps taken in this process are listed below.

* Step 1: Gather data about the issue
* Step 2: Validate the HDInsight cluster environment 
* Step 3: View your cluster's health
* Step 4: Review the environment stack and versions
* Step 5: Examine the cluster log files
* Step 6: Check configuration settings
* Step 7: Reproduce the failure on a different cluster 

## Step 1: Gather data about the issue

HDInsight provides many tools that you can use to identify and troubleshoot issues like cluster failures and slow response times. The key is to know what these tools are and how to use them. The following steps guide you through these tools and some options for pinpointing the issue for resolution.

### Identify the problem

Take note of the problem to assist yourself and others during the troubleshooting process. It's easy to miss key details, so be as clear and concise as possible. Here are a few questions that can help you with this process:

* What did I expect to happen? What happened instead?
* How long did the process take to run? How long should it have run?
* Have my tasks always run slowly on this cluster? Did they run faster on a different cluster?
* When did this problem first occur? How often has it happened since?
* Has anything changed in my cluster configuration?

### Cluster details

Gather key information about your cluster, such as:

* Name of the cluster
* The cluster's region (you can check for [region outages](https://azure.microsoft.com/status/)).
* The HDInsight cluster type and version.
* Type and number of HDInsight instances specified for head and worker nodes.

You can quickly get much of this top level information via the Azure portal.  A sample screen is shown below:

![HDInsight Azure Portal Information](./media/hdinsight-troubleshoot-failed-cluster/portal.png)

Alternatively, you can use the Azure cli to get information about a HDInsight cluster by running the following commands:

```
    azure hdinsight cluster list
    azure hdinsight cluster show <Cluster Name>
```
Or, you can use PowerShell to view this type of information.  See [Manage Hadoop clusters in HDInsight by using Azure PowerShell](../hdinsight-administer-use-powershell.md) for details.

---

## Step 2: Validate the HDInsight cluster environment

A typical HDInsight cluster uses a number of services and open-source software packages (such as Apache HBase, Apache Spark, etc...). In addition, it's common to find that a HDInsight cluster interoperates with other Azure services, such as Azure Virtual Networks and others.  Failures in any of the running services on your cluster or any external services can result in a cluster failure.  Additionally, a requested cluster service configuration change could also cause the cluster to fail.

### Service details

* Check the Open-source library Release Versions
* Check for [Azure Service Outages](https://azure.microsoft.com/status/) 
* Check for Azure Service Usage Limits 
* Check the Azure Virtual Network Subnet Configuration 

### View cluster configuration settings with the Ambari UI

Apache Ambari simplifies the management and monitoring of a HDInsight cluster by providing an easy to use web UI and REST API. 
Ambari is included on Linux-based HDInsight clusters, and is used to monitor the cluster and make configuration changes.
Click on the 'Cluster Dashboard' blade on the Azure Portal HDInsight page to open the 'Cluster Dashboards' link page.  Next, click on the 'HDInsight cluster dashboard' blade to open the Ambari UI.  You'll be prompted for your cluster login credentials.  An example Ambari HDInsight Dashboard is shown below.

![Ambari UI](./media/hdinsight-troubleshoot-failed-cluster/ambari-ui.png)

Also, you can click the blade named 'Ambari Views' on the Azure portal page for HDInsight to open a list of service views.  This list will vary, depending on which libraries you've installed. For example, you may see YARN Queue Manager, Hive View and Tez View, if you've installed these services.  Click any service link of interest to drill down to see configuration and service information.

#### Check for Azure service outages

HDInsight relies on several Azure services. It runs virtual servers on Azure HDInsight, stores data and scripts on Azure Blob storage or Azure Datalake Store, and indexes log files in Azure Table storage. Disruptions to these services, although rare, can cause issues in HDInsight. The first thing you should do when encountering unexpected slowdowns or failures in your cluster, is to check the [Azure Status Dashboard](https://azure.microsoft.com/en-us/status/). The status of each service is listed by region. Be sure to check your cluster's region, as well as regions for any related services, for outages.

#### Check Azure service usage limits

If you are launching a large cluster, or have launched many clusters simultaneously, the cluster may have failed because you exceeded an Azure service limit. Service limits can vary based on your Azure subscription. Read more about [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits).
You can request that Microsoft increase the number of HDInsight resources available (such as VM cores and VM instances) by completing a [Resource Manager core quota increase request](https://docs.microsoft.com/en-us/azure/azure-supportability/resource-manager-core-quotas-request).

#### Check the release version

Compare the release label that you used to launch the cluster with the latest HDInsight release. Each release of HDInsight includes improvements such as new applications, features, patches, and bug
fixes. The issue that is affecting your cluster may have already been fixed in the latest release version. If possible, re-run your cluster using the latest version of HDInsight and associated libraries (i.e. Apache HBase, Apache Spark, etc...).

#### Restart your cluster services

If you are experiencing slowdowns in your cluster, consider restarting your services through the Ambari interface or CLI. Your cluster may be experiencing transient errors, and oftentimes this is the fastest path to stabilizing your environment and improving performance.

## Step 3: View your cluster's health

HDInsight clusters are composed of different types of nodes running on Virtual Machine instances. Each of these nodes can be monitored for resource starvation, network connectivity issues, or other problems that can slowdown your cluster. Every cluster contains two head nodes, and most cluster types contains some combination of worker and edge nodes. For a description of the various nodes each cluster type uses, see [HDInsight Architecture](hdinsight-architecture.md). You will want to check the health of each node, as well as the overall cluster health, using the following tools:

### Get a snapshot of the cluster health using the Ambari UI dashboard

As shown in the reference image in Step 2 (above), the Ambari UI dashboard (`https://<clustername>.azurehdinsight.net`) provides a bird's-eye view of your overall cluster health, such as uptime, memory, network, and CPU usage, HDFS disk usage, etc. You can use the Hosts section of Ambari to view resources at a host level to try and determine which may be causing issues or slowdowns. From here, you also have the ability to stop and restart services.

### Check your WebHCat service

One common scenario for Hive, Pig, or Scoop jobs failing is due to a failure with the [WebHCat](../hdinsight-hadoop-templeton-webhcat-debug-errors.md) (sometimes referred to as Templeton) service. WebHCat is a REST interface for remote jobs (Hive, Pig, Scoop, MapReduce) execution. WebHCat translates the job submission requests into YARN applications and reports the status based on the YARN application status. WebHCat results come from YARN, and troubleshooting some of them requires going to YARN.

WebHCat may respond with the following HTTP status codes:

#### BadGateway (502 status code)

This is a generic message from Gateway nodes, and is the most common status code you may see. One possible cause for this is due to the WebHCat service being down on the active head node. This can be quickly verified by running the following CURL command:

```bash
$ curl -u admin:{HTTP PASSWD} https://{CLUSTERNAME}.azurehdinsight.net/templeton/v1/status?user.name=admin
```

Ambari will also display an alert showing the hosts on which the WebHCat service is down. You can attempt to bring the service back up by restarting the service on the host for which the alert was raised:

![Restart WebHCat Server](./media/hdinsight-troubleshoot-failed-cluster/restart-webhcat.png)

If WebHCat server still does not come up, then clicking through operations will show the failures. For more detailed information, refer to the `stderr` and `stdout` files referenced on the node.

#### WebHCat times out

The HDInsight Gateway times out responses which take longer than 2 minutes, resulting in `502 BadGateway`. WebHCat queries YARN services for job status, and if they take longer than two minutes, the request might timeout.

When this happens, review the following logs for further investigation:

`/var/log/webhcat`

You will typically find the following in this directory:

* **webhcat.log** is the log4j log to which server writes logs
* **webhcat-console.log** is stdout of the server when started
* **webhcat-console-error.log** is stderr of the server process

> NOTE: webhcat.log will roll-over daily, generating files like `webhcat.log.YYYY-MM-DD`. Select the appropriate file, given the time range you are investigating.

Here are some possible causes for timeouts:

##### WebHCat Level Timeout

When WebHCat is under load, meaning there are more than 10 open sockets at any given time, it will take longer to establish new socket connections, which might result in a time out. A quick way to validate is to check the connection status using the below command on the current active headnode:

```bash
$ netstat | grep 30111
```

30111 is the port WebHCat listens to, and the above command lists network connections to and from WebHCat. This command will show you the current open sockets on port 30111. The number of open sockets should be less than 10.

Sometimes when debugging using the above command, you will receive no result. That doesn't mean that nothing is listening on port 30111. Because the command `netstat` only prints out open sockets. No result simply means for that given time, there are no open sockets. To check if Templeton is up and listening on port 30111, use:

```bash
$ netstat -l | grep 30111
```

##### YARN level timeout

Because Templeton is calling YARN to run jobs, the communication between Templeton and YARN is another source that can cause a timeout.

At the YARN level, there are two types of timeouts:

1. Submitting a YARN job might take long enough to cause a timeout.

    If you open the **webhcat.log** file mentioned earlier, and search for "queued job", you may see multiple entries where the execution time is excessively long (>2000 ms), with each entry showing even longer wait times.

    The reason the time for the queued jobs continues to increase, is the rate at which new jobs get submitted is much higher than the rate at which the old jobs are completed. Because of this, once the Yarn Memory is 100% used, there is no way the `joblauncher queue` can borrow capacity from the `default queue`. Thus, no more new jobs can be accepted (meaning being added to the joblauncher queue). This would cause the waiting time to become longer and longer, leading up to a `timeout` error, usually followed by many others.

    As an illustration, the following shows the joblauncher queue at 714.4% over used. This is okay as long as there is still free capacity in the default queue, meaning new jobs can still be added by borrowing capacity from the default queue. But, if the YARN memory is at 100% capacity, meaning the cluster is fully used, new jobs must wait, eventually causing timeouts as described above.

    ![Restart WebHCat Server](./media/hdinsight-troubleshoot-failed-cluster/joblauncher-queue.png)

    There are two ways to resolve this issue: one is to reduce the speed of new jobs being submitted, the second one is to increase the consumption speed of old jobs in joblauncher queue, which is basically increasing the processing power of your cluster by scaling up.

2. YARN processing might take a long time, which makes another source of timeouts.

    * List all jobs: This is a very expensive call. This call enumerates the applications from YARN ResourceManager and for each completed application, gets the status from JobHistoryServer. In cases of higher numbers of jobs, this call might timeout, resulting in a 502.

    * List jobs older than 7 days: The HDInsight YARN JobHistoryServer is configured (`mapreduce.jobhistory.max-age-ms`) to retain completed job information for 7 days. Trying to enumerating purged jobs results in a timeout, causing a 502.

    Your process will involve the following:

    1. Figure out the UTC time range to troubleshoot
    2. Select the **webhcat.log** file, based on the time range
    3. Look for WARN/ERROR messages during that period of time

#### Other failures

1. HTTP Status code 500

    In most cases where WebHCat returns 500, the error message contains details on the failure. Otherwise, looking through the **webhcat.log** for WARN/ERROR messages will reveal the issue.

2. Job failures

    There may be cases where interactions with WebHCat are successful, but the jobs are failing.

    Templeton collects the job console output as `stderr` in "statusdir" which will most often be useful for troubleshooting. `stderr` contains the YARN application id of the actual query, which can be used for troubleshooting.

## Step 4: Review the environment stack and versions

The Ambari UI 'Stack and Version' page provides information about the cluster services configuration and service version history.  Incorrect Hadoop service libary versions can be a cause of cluster failure.  In the Ambari UI, click on the 'Admin' menu and then on 'Stacks and Versions' to navigate to this section.  Then click on the 'Versions' tab on the page to see service version information.  An example is shown below.

![Stack and Versions](./media/hdinsight-troubleshoot-failed-cluster/stack-versions.png)

## Step 5: Examine the log files

We have demonstrated examining log files in the WebHCat section of Step 3 above. There are several other useful, and oftentimes verbose, log files you can investigate to narrow down issues with your cluster. There are many types of logs that are generated, given the large number of services and components that comprise a Hadoop cluster. We will go over where you can locate these various logs in this section.

An example log is shown below.

![HDInsight log file example](./media/hdinsight-troubleshoot-failed-cluster/logs.png)

As explained earlier, HDInsight clusters consist of several nodes, most of which are tasked to run submitted jobs. Jobs will run concurrently, but log files can only display results linearly. HDInsight executes new tasks, terminating others that fail to complete first. This activity is logged to `stderr` and `syslog` log files as they occur.

Start by checking the Script Action logs for errors or unexpected configuration changes during your cluster's provisioning process. The next set of logs to check are the step logs to identify Hadoop jobs launched as part of a step with errors.

The following sections cover each of the log files you can use to troubleshoot cluster errors and slowdowns:

### Check the Script Action logs

HDInsight [Script Actions](hdinsight-hadoop-customize-cluster-linux.md) run scripts on the cluster manually or when specified. For example, they can be used to install additional software on the cluster or to alter configuration settings from the default values. Checking these logs may provide insight into errors that occurred during set up of the cluster as well as configuration settings changes that could affect availability.  You can view the status of a script action by clicking on the 'ops' button on your Ambari UI or by accessing them from the default storage account.

The storage logs are available at `\STORAGE_ACCOUNT_NAME\DEFAULT_CONTAINER_NAME\custom-scriptaction-logs\CLUSTER_NAME\DATE`.

### View logs in HDInsight using Ambari Quick Links

The HDInsight Ambari UI includes a number of 'Quick Links' sections.  To access the log links for a particular service in your HDInsight cluster, open the Ambari UI for your clustuer, then click on the service link from the list at left, next click on the 'Quick Links' drop down and then on the HDInsight node of interest and then on the link for its associated log.

An example, for HDFS logs, is shown below:

![Ambari Quick Links to Log Files](./media/hdinsight-troubleshoot-failed-cluster/quick-links.png)

#### HDInsight logs written to Azure Tables

The logs written to Azure Tables provide one level of insight into what is happening with an HDInsight cluster.
When you create an HDInsight cluster, 6 tables are automatically created for Linux-based clusters in the default Table storage:

* hdinsightagentlog
* syslog
* daemonlog
* hadoopservicelog
* ambariserverlog
* ambariagentlog

#### HDInsight logs written to Azure Blob Storage

HDInsight clusters are configured to write task logs to an Azure Blob Storage account for any job that is submitted using the Azure PowerShell cmdlets or the .NET Job Submission APIs.  If you submit jobs through RDP/command-line access to the cluster then the execution logging information will be found in the Azure Tables discussed in the previous paragraph.

#### HDInsight logs generated by YARN

YARN aggregates logs across all containers on a worker node and stores them as one aggregated log file per worker node. The log is stored on the default file system after an application finishes. Your application may use hundreds or thousands of containers, but logs for ALL containers run on a single worker node are always aggregated to a single file. So there is only one log per worker node used by your application. Log Aggregation is enabled by default on HDInsight clusters version 3.0 and above. Aggregated logs are located in default storage for the cluster. The following path is the HDFS path to the logs:

```
    /app-logs/<user>/logs/<applicationId>
```

The aggregated logs are not directly readable, as they are written in a TFile, binary format indexed by container. Use the YARN ResourceManager logs or CLI tools to view these logs as plain text for applications or containers of interest.

##### YARN CLI tools

To use the YARN CLI tools, you must first connect to the HDInsight cluster using SSH. Specify the <applicationId>, <user-who-started-the-application>, <containerId>, and <worker-node-address> information when running these commands.
You can view these logs as plain text by running one of the following commands:

```bash
    yarn logs -applicationId <applicationId> -appOwner <user-who-started-the-application>
    yarn logs -applicationId <applicationId> -appOwner <user-who-started-the-application> -containerId <containerId> -nodeAddress <worker-node-address>
```

##### YARN ResourceManager UI

The YARN ResourceManager UI runs on the cluster headnode. It is accessed through the Ambari web UI. Use the following steps to view the YARN logs:
In your web browser, navigate to https://CLUSTERNAME.azurehdinsight.net. Replace CLUSTERNAME with the name of your HDInsight cluster.
From the list of services on the left, select YARN.
Yarn service selected
From the Quick Links dropdown, select one of the cluster head nodes and then select ResourceManager Log.
Yarn quick links
You are presented with a list of links to YARN logs.

#### Other logs

Heap dumps contain a snapshot of the application's memory, including the values of variables at the time the dump was created. So they are useful for diagnosing problems that occur at run-time.  See the link at the bottom of this article for the process to enable heap dumps for your HDInsight cluster.

## Step 6: Check configuration settings

HDInsight clusters come preconfigured with default settings for related services, such as Hadoop, Hive, HBase, etc. Depending on your cluster's hardware configuration, number of nodes, types of jobs you are running, the data you are working with (and how that data is being processed), as well as the type of cluster, you may need to optimize your configuration.

Read [Changing Configs via Ambari](hdinsight-changing-configs-via-ambari.md) for detailed instructions on optimizing performance configurations for most scenarios. When using Spark, refer to [Optimizing and configuring Spark Jobs for Performance](hdinsight-spark-perf.md).

## Step 7: Reproduce the Failure on a different cluster

A useful technique when you are trying to track down the source of an error is to restart a new cluster withe the same configuration and then to submit the job steps (one-by-one) that caused the original cluster to fail. In this way, you can check the results of each step before processing the next one. This method gives you the opportunity to correct and re-run a single step that has failed. This also has the advantage that you only load your input data once which can save time in the troubleshooting process.

To test a cluster step-by-step:

1. Launch a new cluster, with the same configuration as the failed cluster.
2. Submit the first job step to the cluster.
3. When the step completes processing, check for errors in the step log files. The fastest way to locate these log files is by connecting to the master node and viewing the log files there. The step log files do not appear until the step runs for some time, finishes, or fails.
4. If the step succeeded without error, run the next step. If there were errors, investigate the error in the log files. If it was an error in your code, make the correction and re-run the step. Continue until all steps run without error.
5. When you are done debugging the test cluster, delete it.

## Conclusion

There are a number of considerations you need to pay attention to make sure your HDInsight cluster is operational.  You should focus on using the best HDInsight cluster configuration for your particular workload.  Along with that, you'll need to monitor the execution of long-running and/or high resource consuming job executions to make sure that they don't fail and possibly bring down your entire cluster.  It's also critically important to manage your cluster configuration over time, so that you can revert to working state should the need arise.

## See also

* [Manage HDInsight clusters by using the Ambari Web UI](hdinsight-hadoop-manage-ambari.md)
* [Analyze HDInsight Logs](hdinsight-debug-jobs.md)
* [Access YARN application log on Linux-based HDInsight](hdinsight-hadoop-access-yarn-app-logs-linux.md)
* [Enable heap dumps for Hadoop services on Linux-based HDInsight](hdinsight-hadoop-collect-debug-heap-dump-linux.md)
* [Known Issues for Apache Spark cluster on HDInsight](hdinsight-apache-spark-known-issues.md)

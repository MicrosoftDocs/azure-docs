---
title: Scale cluster sizes - Azure HDInsight
description: Scale an Azure HDInsight cluster elastically to match your workload.
author: ashishthaps
ms.author: ashish
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/13/2019
---
# Scale HDInsight clusters

HDInsight provides elasticity by giving you the option to scale up and scale down the number of worker nodes in your clusters. This elasticity, allows you to shrink a cluster after hours or on weekends, and expand it during peak business demands.

If you have batch processing that happens periodically, the HDInsight cluster can be scaled up a few minutes prior to that operation, so that your cluster has adequate memory and CPU power.  Later, after the processing is done, and usage goes down again, you can scale down the HDInsight cluster to fewer worker nodes.

You can scale a cluster manually using one of the methods outlined below, or use [autoscale](hdinsight-autoscale-clusters.md) options to have the system automatically scale up and down in response to CPU, memory, and other metrics.

## Impact of scaling operations

When you add nodes to your running HDInsight cluster, any pending or running jobs will not be affected. New jobs can be safely submitted while the scaling process is running. If the scaling operations fails for any reason, the failure will be handled to leave your cluster in a functional state.

However, if you are scaling down your cluster by removing nodes, any pending or running jobs will fail when the scaling operation completes. This failure is due to some of the services restarting during the process.

## Utilities to scale clusters

Microsoft provides the following utilities to scale clusters:

|Utility | Description|
|---|---|
|[PowerShell Az](https://docs.microsoft.com/powershell/azure)|[Set-AzHDInsightClusterSize](https://docs.microsoft.com/powershell/module/az.hdinsight/set-azhdinsightclustersize) -ClusterName \<Cluster Name> -TargetInstanceCount \<NewSize>|
|[PowerShell AzureRM](https://docs.microsoft.com/powershell/azure/azurerm) |[Set-AzureRmHDInsightClusterSize](https://docs.microsoft.com/powershell/module/azurerm.hdinsight/set-azurermhdinsightclustersize) -ClusterName \<Cluster Name> -TargetInstanceCount \<NewSize>|
|[Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest)| [az hdinsight resize](https://docs.microsoft.com/cli/azure/hdinsight?view=azure-cli-latest#az-hdinsight-resize) --resource-group \<Resource group> --name \<Cluster Name> --target-instance-count \<NewSize>|
|[Azure Classic CLI](hdinsight-administer-use-command-line.md)|azure hdinsight cluster resize \<clusterName> \<Target Instance Count> |
|[Azure portal](https://portal.azure.com)|Open your HDInsight cluster pane, select **Cluster size** on the left-hand menu, then on the Cluster size pane, type in the number of worker nodes, and select Save.|  

![Scale cluster](./media/hdinsight-scaling-best-practices/scale-cluster-blade.png)

Using any of these methods, you can scale your HDInsight cluster up or down within minutes.

> [!IMPORTANT]  
> * The Aure classic CLI is deprecated and should only be used with the classic deployment model. For all other deployments, use the [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest).  
> * The PowerShell AzureRM module is deprecated.  Please use the [Az module](https://docs.microsoft.com/powershell/azure/new-azureps-module-az?view=azps-1.4.0) whenever possible.

## How to safely scale a cluster

### Scale down a cluster with running jobs

To address this issue, you can wait for the jobs to complete before scaling down your cluster, manually terminate the jobs, or  resubmit the jobs after the scaling operation has concluded.

To see a list of pending and running jobs, you can use the YARN ResourceManager UI, following these steps:

1. Sign in to [Azure portal](https://portal.azure.com).
2. From the left, navigate to **All services** > **Analytics** > **HDInsight Clusters**, and then select your cluster.
3. From the main view, navigate to **Cluster dashboards** > **Ambari home**. Enter your cluster login credentials.
4. From the Ambari UI, select **YARN** on the list of services on the left-hand menu.  
5. From the YARN page, select **Quick Links** and hover over the active head node, then select **ResourceManager UI**.

    ![ResourceManager UI](./media/hdinsight-scaling-best-practices/resourcemanager-ui.png)

You may directly access the ResourceManager UI with `https://<HDInsightClusterName>.azurehdinsight.net/yarnui/hn/cluster`.

You  see a list of jobs, along with their current state. In the screenshot, there's  one job currently running:

![ResourceManager UI applications](./media/hdinsight-scaling-best-practices/resourcemanager-ui-applications.png)

To  manually kill that running application, execute the following command from the SSH shell:

```bash
yarn application -kill <application_id>
```

For example:

```bash
yarn application -kill "application_1499348398273_0003"
```

### Scale down a cluster to less than 3 nodes

When a scale down attempt happens, HDInsight relies upon the Apache Ambari management interfaces to first decommission the extra unwanted worker nodes, which replicate their HDFS blocks to other online worker nodes, and then safely scale the cluster down. HDFS goes into a safe mode during the maintenance window, and is supposed to come out once the scaling is finished. It is at this point that HDFS can become stuck in safe mode.

HDFS is normally configured with a `dfs.replication` setting of 3, which controls how many copies of each file block are available. Each copy of a file block is stored on a different node of the cluster. When HDFS detects that the expected number of block copies aren't available, HDFS will enter safe mode and Ambari may generate alerts.

For this reason, don't scale down your cluster to fewer than 3 nodes, unless you update the `dfs.replication` configuration property to the number of nodes that will be available in the cluster for file replication.

If you shrink your cluster down to the minimum of one worker node, Apache HDFS may become stuck in safe mode when worker nodes are rebooted because of patching, or immediately after the scaling operation.

For Apache Hive, the primary cause of this is that Hive uses a few `scratchdir` files, and by default expects three replicas of each block, but there is only one replica possible if you scale down to the minimum one worker node. As a consequence, the files in the `scratchdir` become *under-replicated*. This under-replication could cause HDFS to stay in safe mode when the services are restarted after the scale operation.

### Scale down an Apache HBase cluster

Region servers are automatically balanced within a few minutes after completing a scaling operation. To manually balance region servers, complete the following steps:

1. Connect to the HDInsight cluster using SSH. For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

2. Start the HBase shell:

        hbase shell

3. Use the following command to manually balance the region servers:

        balancer

## Troubleshooting when name node goes into safe mode

You can execute a command  to bring HDFS out of safe mode. For example, if you know that the only reason safe mode is on is because the temporary files are under-replicated, then you can safely leave safe mode. The under-replicated files are Hive temporary scratch files.

```bash
hdfs dfsadmin -D 'fs.default.name=hdfs://mycluster/' -safemode leave
```

After leaving safe mode, you can manually remove the  temporary files, or wait for Hive to eventually clean them up automatically.

### Example errors when safe mode is turned on

```
org.apache.hadoop.hdfs.server.namenode.SafeModeException: Cannot create directory /tmp/hive/hive/819c215c-6d87-4311-97c8-4f0b9d2adcf0. Name node is in safe mode.
```

```
org.apache.http.conn.HttpHostConnectException: Connect to hn0-clustername.servername.internal.cloudapp.net:10001 [hn0-clustername.servername. internal.cloudapp.net/1.1.1.1] failed: Connection refused
```

You can review the name node logs from the `/var/log/hadoop/hdfs/` folder, near the time when the cluster was scaled, to see when it entered safe mode. The log files are named `Hadoop-hdfs-namenode-hn0-clustername.*`.

The root cause of the previous errors is that Hive depends on temporary files in HDFS while running queries. When HDFS enters safe mode, Hive cannot run queries because it cannot write to HDFS. The temp files in HDFS are located in the local drive mounted to the individual worker node VMs, and replicated amongst other worker nodes at three replicas, minimum.

The `hive.exec.scratchdir` parameter in Hive is configured within `/etc/hive/conf/hive-site.xml`:

```xml
<property>
    <name>hive.exec.scratchdir</name>
    <value>hdfs://mycluster/tmp/hive</value>
</property>
```

### How to prevent HDInsight from getting stuck in safe mode

There are several ways to prevent HDInsight from being left in safe mode:

* Stop all Hive jobs before scaling down HDInsight. Alternately, schedule the scale down process to avoid conflicting with running Hive jobs.
* Manually clean up Hive's scratch `tmp` directory files in HDFS before scaling down.
* Only scale down HDInsight to three worker nodes, minimum. Avoid going as low as one worker node.
* Run the command to leave safe mode, if needed.

The following sections describe these options.

#### Stop all Hive jobs

Stop all Hive jobs before scaling down to one worker node. If  your workload is scheduled, then execute your scale-down after Hive work is done.

This helps minimize the number of scratch files in the tmp folder (if any).

#### Manually clean up Hive's scratch files

If Hive has left behind temporary files, then you can manually clean up those files before scaling down to avoid safe mode.

1. Stop Hive services and be sure all queries and jobs are completed.

2. List the contents of the `hdfs://mycluster/tmp/hive/` directory to see if it contains any files:

    ```
    hadoop fs -ls -R hdfs://mycluster/tmp/hive/hive
    ```

    Here is a sample output when files exist:

    ```
    sshuser@hn0-scalin:~$ hadoop fs -ls -R hdfs://mycluster/tmp/hive/hive
    drwx------   - hive hdfs          0 2017-07-06 13:40 hdfs://mycluster/tmp/hive/hive/4f3f4253-e6d0-42ac-88bc-90f0ea03602c
    drwx------   - hive hdfs          0 2017-07-06 13:40 hdfs://mycluster/tmp/hive/hive/4f3f4253-e6d0-42ac-88bc-90f0ea03602c/_tmp_space.db
    -rw-r--r--   3 hive hdfs         27 2017-07-06 13:40 hdfs://mycluster/tmp/hive/hive/4f3f4253-e6d0-42ac-88bc-90f0ea03602c/inuse.info
    -rw-r--r--   3 hive hdfs          0 2017-07-06 13:40 hdfs://mycluster/tmp/hive/hive/4f3f4253-e6d0-42ac-88bc-90f0ea03602c/inuse.lck
    drwx------   - hive hdfs          0 2017-07-06 20:30 hdfs://mycluster/tmp/hive/hive/c108f1c2-453e-400f-ac3e-e3a9b0d22699
    -rw-r--r--   3 hive hdfs         26 2017-07-06 20:30 hdfs://mycluster/tmp/hive/hive/c108f1c2-453e-400f-ac3e-e3a9b0d22699/inuse.info
    ```

3. If you know Hive is done with these files, you can remove them. Be sure that Hive does not have any queries running by looking in the Yarn ResourceManager UI page.

    Example command line to remove files from HDFS:

    ```
    hadoop fs -rm -r -skipTrash hdfs://mycluster/tmp/hive/
    ```

#### Scale  HDInsight to three worker nodes

If getting stuck in safe mode is a persistent problem, and the previous steps are not options, then you may want to avoid the problem by only scaling down to three worker nodes. This may not be optimal, due to cost constraints, compared to scaling down to one node. However, with only one worker node, HDFS cannot guarantee three replicas of the data are available to the cluster.

#### Run the command to leave safe mode

The final option is to watch for the rare occasion in which HDFS enters safe mode, then execute the leave safe mode command. Once you have determined that the reason HDFS has entered safe mode is due to the Hive files being under-replicated, execute the following command to leave safe mode:

* HDInsight on Linux:

    ```bash
    hdfs dfsadmin -D 'fs.default.name=hdfs://mycluster/' -safemode leave
    ```

* HDInsight on Windows:

    ```bash
    hdfs dfsadmin -fs hdfs://headnodehost:9000 -safemode leave
    ```

## Next steps

* [Automatically scale Azure HDInsight clusters](hdinsight-autoscale-clusters.md)
* [Introduction to Azure HDInsight](hadoop/apache-hadoop-introduction.md)
* [Scale clusters](hdinsight-administer-use-portal-linux.md#scale-clusters)

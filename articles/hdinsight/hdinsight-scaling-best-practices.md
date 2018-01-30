---
title: Scaling - Best Practices - Azure HDInsight | Microsoft Docs
description: ''
services: hdinsight
documentationcenter: ''

tags: azure-portal
keywords: scaling

---
# Scaling - Best Practices

HDInsight offers elasticity by giving administrators the option to scale up and scale down the number of Worker Nodes in the clusters. This allows you to shrink a cluster during after hours or on weekends, and grow it during peak business demands.

For example, if you have some batch processing that happens once a week or once a month, the HDInsight cluster can be scaled up a few minutes prior to that scheduled event so that there is plenty of memory and CPU compute power. You can automate that with the PowerShell cmdlet [`Set–AzureRmHDInsightClusterSize`](../hdinsight-administer-use-powershell.md#scale-clusters).  Later, after the processing is done, and usage is expected to go down again, the administrator can scale down the HDInsight cluster to fewer worker nodes.

Scaling your cluster through [PowerShell](../hdinsight-administer-use-powershell.md):

```powershell
Set-AzureRmHDInsightClusterSize -ClusterName <Cluster Name> -TargetInstanceCount <NewSize>
```

Scaling your cluster through the [Azure CLI](../hdinsight-administer-use-command-line.md):

```
azure hdinsight cluster resize [options] <clusterName> <Target Instance Count>
```

To scale your cluster through the [Azure Portal](https://portal.azure.com), open your HDInsight cluster blade, select **Scale cluster** on the left-hand menu, then on the Scale cluster blade, type in the number of worker nodes, and click save.

![Scale cluster](./media/hdinsight-scaling-best-practices/scale-cluster-blade.png)

Using any of these methods, you can scale your HDInsight cluster up or down within minutes.

## Scaling impacts on running jobs

When you **add** nodes to your running HDInsight cluster, any pending or running jobs will not be impacted. In addition, new jobs can be safely submitted while the scaling process is running. If the scaling operations fails for any reason, the failure is gracefully handled, leaving the cluster in a functional state.

However, if you are scaling down your cluster by **removing** nodes, any pending or running jobs will fail when the scaling operation completes. This is due to some of the services restarting during the process.

To address this, you can wait for the jobs to complete before scaling down your cluster, manually terminate them, or simply resubmit the jobs after the scaling operation has concluded.

To see a list of pending and running jobs, you can use the YARN ResourceManager UI, following these steps:

1. Sign in to [Azure portal](https://portal.azure.com).
2. On the left menu, click **Browse**, click **HDInsight Clusters**, select your cluster.
3. From your HDInsight cluster blade, click **Dashboard** on the top menu to open the Ambari UI. You'll be prompted for your cluster login credentials.
4. Click **YARN** on the list of services on the left-hand menu. On the YARN page, click **Quick Links** hover over the active head node, then click **ResourceManager UI**.

![ResourceManager UI](./media/hdinsight-scaling-best-practices/resourcemanager-ui.png)

> You may directly access the ResourceManager UI by navigating to: `https://<HDInsightClusterName>.azurehdinsight.net/yarnui/hn/cluster`

You will see a list of jobs, along with their current State. In the screenshot below, we can see that we have one job currently running:

![ResourceManager UI applications](./media/hdinsight-scaling-best-practices/resourcemanager-ui-applications.png)

We can manually kill that running application by executing the following command from the SSH shell:

```bash
yarn application -kill "application_1499348398273_0003"
```

The syntax for this command is:

```bash
yarn application -kill <application_id>
```

## Rebalancing an HBase cluster

Region servers are automatically balanced within a few minutes after completion of the scaling operation. To manually balance region servers, use the following steps:

1. Connect to the HDInsight cluster using SSH. For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

2. Use the following to start the HBase shell:

        hbase shell

3. Once the HBase shell has loaded, use the following to manually balance the region servers:

        balancer


## Scale down implications

As mentioned above, any pending or running jobs will be terminated at the completion of a scaling down operation. However, there are other potential implications to scaling down that may occur.

### HDInsight Name Node stays in Safe mode after a Scale Down

![Scale cluster](./media/hdinsight-scaling-best-practices/scale-cluster.png)

If you shrink your cluster down to the minimum of 1 worker node, as shown above, from several nodes, it is possible for HDFS to become stuck in safe mode when worker nodes are rebooted due to patching, or immediately after the scaling operation.

The primary cause of this is that Hive uses a few `scratchdir` files, and by default, expects 3 replicas of each block, but there is only 1 replica possible if you scale down to the minimum 1 worker node. As a consequence, the files in the `scratchdir` become under replicated. This could cause HDFS to stay in Safe mode when the services are restarted after the scale operation.

When a scale down attempt happens, HDInsight relies upon the Ambari management interfaces to first decommission the extra unwanted worker nodes, which replicates the HDFS blocks to other online worker nodes, and then safely scale the cluster down. HDFS goes into a safe mode during the maintenance window, and is supposed to come out once the scaling is finished. It is at this point that HDFS can become stuck in safe mode.

> HDFS is configured with the `dfs.replication` setting of 3. Thus, the blocks of the scratch files are under replicated whenever there are fewer than 3 worker nodes online, because there are not the expected 3 copies of each file block available.

One way to bring HDFS out of safe mode is to execute a command to leave safe mode (ignoring the cause, assuming it is benign). For example, if you know that the only reason safe mode is on is because the temporary files are under replicated (discussed in detail below), then you can safely leave safe mode. This is primarily because the under-replicated files are Hive temporary scratch files.

```bash
hdfs dfsadmin -D 'fs.default.name=hdfs://mycluster/' -safemode leave
```

After leaving safe mode, you may remove the problematic temp files or wait for Hive to eventually clean them up automatically.

#### Example errors when safe mode is turned on


**ERROR 1**

H070 Unable to open Hive session. org.apache.hadoop.ipc.RemoteException(org.apache.hadoop.ipc.RetriableException): org.apache.hadoop.hdfs.server.namenode.SafeModeException: **Cannot create directory** /tmp/hive/hive/819c215c-6d87-4311-97c8-4f0b9d2adcf0. **Name node is in safe mode**. The reported blocks 75 needs additional 12 blocks to reach the threshold 0.9900 of total blocks 87. The number of live datanodes 10 has reached the minimum number 0. Safe mode will be turned off automatically once the thresholds have been reached.

**ERROR 2**

H100 Unable to submit statement show databases: org.apache.thrift.transport.TTransportException: org.apache.http.conn.HttpHostConnectException: Connect to hn0-clustername.servername.internal.cloudapp.net:10001 [hn0-clustername.servername. internal.cloudapp.net/1.1.1.1] failed: **Connection refused**

**ERROR 3**

H020 Could not establish connecton to hn0-hdisrv.servername.bx.internal.cloudapp.net:10001:
org.apache.thrift.transport.TTransportException: Could not create http connection to http://hn0-hdisrv.servername.bx.internal.cloudapp.net:10001/. org.apache.http.conn.HttpHostConnectException: Connect to hn0-hdisrv.servername.bx.internal.cloudapp.net:10001
[hn0-hdisrv.servername.bx.internal.cloudapp.net/10.0.0.28] failed: Connection refused: org.apache.thrift.transport.TTransportException: Could not create http connection to http://hn0-hdisrv.servername.bx.internal.cloudapp.net:10001/. org.apache.http.conn.HttpHostConnectException: Connect to hn0-hdisrv.servername.bx.internal.cloudapp.net:10001 [hn0-hdisrv.servername.bx.internal.cloudapp.net/10.0.0.28] failed: **Connection refused**

**ERROR 4 – from the Hive logs**

WARN [main]: server.HiveServer2 (HiveServer2.java:startHiveServer2(442)) – Error starting HiveServer2 on attempt 21, will retry in 60 seconds
java.lang.RuntimeException: Error applying authorization policy on hive configuration: org.apache.hadoop.ipc.RemoteException(org.apache.hadoop.ipc.RetriableException): org.apache.hadoop.hdfs.server.namenode.SafeModeException: **Cannot create directory** /tmp/hive/hive/70a42b8a-9437-466e-acbe-da90b1614374. **Name node is in safe mode**.
The reported blocks 0 needs additional 9 blocks to reach the threshold 0.9900 of total blocks 9.
The number of live datanodes 10 has reached the minimum number 0. **Safe mode will be turned off automatically once the thresholds have been reached**.
at org.apache.hadoop.hdfs.server.namenode.FSNamesystem.checkNameNodeSafeMode(FSNamesystem.java:1324)

---

You can review the Name Node logs from the `/var/log/hadoop/hdfs/` folder, near the time when the cluster was scaled to see when it entered safe mode. The log files are named after the following pattern: `Hadoop-hdfs-namenode-hn0-clustername.*`

The gist of the above errors is that Hive depends on temporary files in HDFS while running queries. When HDFS enters "Safe Mode", Hive cannot run queries since it cannot write to HDFS. The temp files in HDFS are located in the local drive mounted to the individual worker node VMs, and replicated amongst the worker nodes at 3 replicas, minumum.

The `hive.exec.scratchdir` parameter in Hive is configured within `/etc/hive/conf/hive-site.xml` as shown:

```xml
<property>
    <name>hive.exec.scratchdir</name>
    <value>hdfs://mycluster/tmp/hive</value>
</property>
```

#### View the health and state of your HDFS file system

You can view a status report from each name node to see whether nodes are in safe mode. To view the report, SSH into each head node to run the following command:

```
hdfs dfsadmin -D 'fs.default.name=hdfs://mycluster/' -safemode get
```

![Safe mode off](./media/hdinsight-scaling-best-practices/safe-mode-off.png)

Next, you can view a report that shows the details of the HDFS state:

```
hdfs dfsadmin -D 'fs.default.name=hdfs://mycluster/' -report
```

The above command will result in the following on a healthy cluster where all blocks are replicated to the expected degree:

![Safe mode off](./media/hdinsight-scaling-best-practices/report.png)

> Note: The `-D` switch is used in these queries, because the default file system in HDInsight is either Azure Storage or Azure Data Lake Store. The switch specifies that the commands need to execute against the local HDFS file system.

HDFS supports the `fsck` command to check for various inconsistencies with various files, for example, missing blocks for a file or under-replicated blocks. To run the `fsck` command against the `scratchdir` (temporary scratch disk) files, execute the following:

```
hdfs fsck -D 'fs.default.name=hdfs://mycluster/' /tmp/hive/hive
```

When executed on a healthy HDFS file system with no under-replicated blocks, you will see an output similar to the following:

```
Connecting to namenode via http://hn0-scalin.cxei5na03ppe1cvcujsey53ynd.bx.internal.cloudapp.net:30070/fsck?ugi=sshuser&path=%2Ftmp%2Fhive%2Fhive
FSCK started by sshuser (auth:SIMPLE) from /10.0.0.21 for path /tmp/hive/hive at Thu Jul 06 20:07:01 UTC 2017
..Status: HEALTHY
 Total size:    53 B
 Total dirs:    5
 Total files:   2
 Total symlinks:                0 (Files currently being written: 2)
 Total blocks (validated):      2 (avg. block size 26 B)
 Minimally replicated blocks:   2 (100.0 %)
 Over-replicated blocks:        0 (0.0 %)
 Under-replicated blocks:       0 (0.0 %)
 Mis-replicated blocks:         0 (0.0 %)
 Default replication factor:    3
 Average block replication:     3.0
 Corrupt blocks:                0
 Missing replicas:              0 (0.0 %)
 Number of data-nodes:          4
 Number of racks:               1
FSCK ended at Thu Jul 06 20:07:01 UTC 2017 in 3 milliseconds


The filesystem under path '/tmp/hive/hive' is HEALTHY
```

In contrast, when the command is executed on an HDFS file system with some under-replicated blocks, the output will be similar to the following:

```
Connecting to namenode via http://hn0-scalin.cxei5na03ppe1cvcujsey53ynd.bx.internal.cloudapp.net:30070/fsck?ugi=sshuser&path=%2Ftmp%2Fhive%2Fhive
FSCK started by sshuser (auth:SIMPLE) from /10.0.0.21 for path /tmp/hive/hive at Thu Jul 06 20:13:58 UTC 2017
.
/tmp/hive/hive/4f3f4253-e6d0-42ac-88bc-90f0ea03602c/inuse.info:  Under replicated BP-1867508080-10.0.0.21-1499348422953:blk_1073741826_1002. Target Replicas is 3 but found 1 live replica(s), 0 decommissioned replica(s) and 0 decommissioning replica(s).
.
/tmp/hive/hive/e7c03964-ff3a-4ee1-aa3c-90637a1f4591/inuse.info: CORRUPT blockpool BP-1867508080-10.0.0.21-1499348422953 block blk_1073741825

/tmp/hive/hive/e7c03964-ff3a-4ee1-aa3c-90637a1f4591/inuse.info: MISSING 1 blocks of total size 26 B.Status: CORRUPT
 Total size:    53 B
 Total dirs:    5
 Total files:   2
 Total symlinks:                0 (Files currently being written: 2)
 Total blocks (validated):      2 (avg. block size 26 B)
  ********************************
  UNDER MIN REPL'D BLOCKS:      1 (50.0 %)
  dfs.namenode.replication.min: 1
  CORRUPT FILES:        1
  MISSING BLOCKS:       1
  MISSING SIZE:         26 B
  CORRUPT BLOCKS:       1
  ********************************
 Minimally replicated blocks:   1 (50.0 %)
 Over-replicated blocks:        0 (0.0 %)
 Under-replicated blocks:       1 (50.0 %)
 Mis-replicated blocks:         0 (0.0 %)
 Default replication factor:    3
 Average block replication:     0.5
 Corrupt blocks:                1
 Missing replicas:              2 (33.333332 %)
 Number of data-nodes:          1
 Number of racks:               1
FSCK ended at Thu Jul 06 20:13:58 UTC 2017 in 28 milliseconds


The filesystem under path '/tmp/hive/hive' is CORRUPT
```

You can also view the HDFS status in Ambari UI by selecting the **HDFS** service on the left (direct link: `https://<HDInsightClusterName>.azurehdinsight.net/#/main/services/HDFS/summary`)

![Ambari HDFS status](./media/hdinsight-scaling-best-practices/ambari-hdfs.png)

You may also see one or more critical errors on the active or standby NameNodes. Click the NameNode link next to the alert to view the NameNode Blocks Health.

![NameNode Blocks Health](./media/hdinsight-scaling-best-practices/ambari-hdfs-crit.png)

To clean up the scratch files, removing the block replication errors, SSH into each head node to run the following command:

```
hadoop fs -rm -r -skipTrash hdfs://mycluster/tmp/hive/
```

> Warning: This can break Hive if some jobs are still running.

#### How to Prevent HDInsight from getting stuck in safe mode due to under-replicated blocks

There are some ways in which you can prevent HDInsight from being left in safe mode. A few options are:

* Stop all Hive jobs before scaling HDInsight down. Alternately, schedule the scale down process to avoid conflicting with running Hive jobs.
* Manually clean up Hive's scratch Tmp directory files in HDFS before scaling down.
* Only scale down HDInsight to 3 worker nodes, minimum. Avoid going as low as 1 worker node.
* Run the command to leave safe mode, if needed.

Let’s go through these possibilities in more detail:

**Stop all Hive jobs**

Stop all Hive jobs before scaling down to 1 worker node. If you know your workload is scheduled, then execute your scale down after Hive work is done.

This will help minimize the number of scratch files in the tmp folder (if any).

**Manually clean up Hive's scratch files**

If Hive has left behind temporary files before you scale down, then you can manually clean up the tmp files before scaling down to avoid safe mode.

You should stop Hive services to be safe, and at a minimum, make sure all queries and jobs are completed.

You can list the contents of the `hdfs://mycluster/tmp/hive/` directory to see if it contains any files:

```
hadoop fs -ls -R hdfs://mycluster/tmp/hive/hive
```

Sample output when files exist:

```
sshuser@hn0-scalin:~$ hadoop fs -ls -R hdfs://mycluster/tmp/hive/hive
drwx------   - hive hdfs          0 2017-07-06 13:40 hdfs://mycluster/tmp/hive/hive/4f3f4253-e6d0-42ac-88bc-90f0ea03602c
drwx------   - hive hdfs          0 2017-07-06 13:40 hdfs://mycluster/tmp/hive/hive/4f3f4253-e6d0-42ac-88bc-90f0ea03602c/_tmp_space.db
-rw-r--r--   3 hive hdfs         27 2017-07-06 13:40 hdfs://mycluster/tmp/hive/hive/4f3f4253-e6d0-42ac-88bc-90f0ea03602c/inuse.info
-rw-r--r--   3 hive hdfs          0 2017-07-06 13:40 hdfs://mycluster/tmp/hive/hive/4f3f4253-e6d0-42ac-88bc-90f0ea03602c/inuse.lck
drwx------   - hive hdfs          0 2017-07-06 20:30 hdfs://mycluster/tmp/hive/hive/c108f1c2-453e-400f-ac3e-e3a9b0d22699
-rw-r--r--   3 hive hdfs         26 2017-07-06 20:30 hdfs://mycluster/tmp/hive/hive/c108f1c2-453e-400f-ac3e-e3a9b0d22699/inuse.info
```
 
If you know Hive is done with these files, you can remove them. You should stop Hive services beforehand.

As stated earlier, this can break Hive if some jobs are still running, so refrain from cleaning up the scratch files unless all Hive jobs are done. Be sure that Hive does not have any queries running by looking in the Yarn ResourceManager UI page before doing so, as detailed at the beginning of the article.

Example command line to remove files from HDFS:

```
hadoop fs -rm -r -skipTrash hdfs://mycluster/tmp/hive/
```

**Only scale down HDInsight to 3 worker nodes, minimum**

If being stuck in safe mode is a persistent problem, and the previous steps are not options, then you may want to avoid the problem by only scaling down to 3 worker nodes, minimum. This may not be optimal, due to cost constraints compared to scaling down to only 1 node. However, with 1 worker node, HDFS cannot guarantee 3 replicas of the data will be made available to the cluster.

Having 3 worker nodes is the safest minimum for HDFS with the default replication factor.

**Run the command to leave safe mode, if needed**

The final option is to watch for the rare occasion in which HDFS enters safe mode, then execute the leave safe mode command. Once you have proven that the reason HDFS has entered safe mode is due to the Hive files being under-replicated, simply execute the following commands to leave safe mode:

HDInsight on Linux:

```bash
hdfs dfsadmin -D 'fs.default.name=hdfs://mycluster/' -safemode leave
```

HDInsight on Windows:

```bash
hdfs dfsadmin -fs hdfs://headnodehost:9000 -safemode leave
```


## Next steps

In this article, we covered the various ways in which you can scale the number of nodes in your HDInsight cluster, as well as some potential impacts scaling down can have, particularly while executing jobs. These issues may not occur often, but following the exercise of scaling down when there are no running jobs is a practice that should prevent issues during the process, as well as further down the road. Learn more about the HDInsight cluster architecture, using Ambari, and scaling your cluster by following the links below.

* [HDInsight Architecture](hdinsight-architecture.md)
* [Scale clusters](hdinsight-administer-use-portal-linux.md#scale-clusters)
* [Manage HDInsight clusters by using the Ambari Web UI](hdinsight-hadoop-manage-ambari.md)
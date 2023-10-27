---
title: Apache HBase Master fails to start in Azure HDInsight
description: Apache HBase Master (HMaster) fails to start in Azure HDInsight
ms.service: hdinsight
ms.custom: devx-track-extended-java
ms.topic: troubleshooting
ms.date: 12/21/2022
---

# Apache HBase Master (HMaster) fails to start in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Scenario: `Master startup cannot progress, in holding-pattern until region comes online`

### Issue

HMaster fails to start due to the following warning:
```output
hbase:namespace,,<timestamp_region_create>.<encoded_region_name>.is NOT online; state={<encoded_region_name> state=OPEN, ts=<some_timestamp>, server=<server_name>}; ServerCrashProcedures=true. Master startup cannot progress, in holding-pattern until region onlined. 
```

For example, the parameter values may vary in the actual message:
```output
hbase:namespace,,1546588612000.0000010bc582e331e3080d5913a97000. is NOT online; state={0000010bc582e331e3080d5913a97000 state=OPEN, ts=1633935993000, server=<wn fqdn>,16000,1622012792000}; ServerCrashProcedures=false. Master startup cannot progress, in holding-pattern until region onlined.
```

### Cause

HMaster checks the WAL directory on the region servers before bringing back the **OPEN** regions online. In this case, if that directory wasn't present, it was not getting started

### Resolution

1. Create this dummy directory using the command:
`sudo -u hbase hdfs dfs -mkdir /hbase-wals/WALs/<wn fqdn>,16000,1622012792000`

2. Restart the HMaster service from the Ambari UI.

If you're using hbase-2.x, see more information in [how to use hbck2 to assign namespace and meta table](how-to-use-hbck2-tool.md#assign-and-unassign)

## Scenario: Atomic renaming failure

### Issue

Unexpected files identified during startup process.

### Cause

During the startup process, HMaster performs many initialization steps, including moving data from scratch (.tmp) folder to data folder. HMaster also looks at the write-ahead logs (WAL) folder to see if there are any unresponsive region servers.

HMaster does a basic list command on the WAL folders. If at any time, HMaster sees an unexpected file in any of these folders, it throws an exception and doesn't start.

### Resolution

Check the call stack and try to determine which folder might be causing the problem (for instance, it might be the WAL folder or the .tmp folder). Then, in Azure Storage Explorer or by using HDFS commands, try to locate the problem file. Usually, this file is called `*-renamePending.json`. (The `*-renamePending.json` file is a journal file that's used to implement the atomic rename operation in the WASB driver. Due to bugs in this implementation, these files can be left over after process crashes, and so on.) Force-delete this file either in Cloud Explorer or by using HDFS commands.

Sometimes, there might also be a temporary file named something like `$$$.$$$` at this location. You have to use HDFS `ls` command to see this file; you can't see the file in Azure Storage Explorer. To delete this file, use the HDFS command `hdfs dfs -rm /\<path>\/\$\$\$.\$\$\$`.

After you've run these commands, HMaster should start immediately.

---

## Scenario: No server address listed

### Issue

You might see a message that indicates that the `hbase: meta` table isn't online. Running `hbck` might report that `hbase: meta table replicaId 0 is not found on any region.` In the HMaster logs, you might see the message: `No server address listed in hbase: meta for region hbase: backup <region name>`.  

### Cause

HMaster couldn't initialize after restarting HBase.

### Resolution

1. In the HBase shell, enter the following commands (change actual values as applicable):

    ```hbase
    scan 'hbase:meta'
    delete 'hbase:meta','hbase:backup <region name>','<column name>'
    ```

1. Delete the `hbase: namespace` entry. This entry might be the same error that's being reported when the `hbase: namespace` table is scanned.

1. Restart the active HMaster from Ambari UI to bring up HBase in running state.

1. In the HBase shell, to bring up all offline tables, run the following command:

    ```hbase
    hbase hbck -ignorePreCheckPermission -fixAssignments
    ```

---

## Scenario: `java.io.IOException: Timedout`

### Issue

HMaster times out with fatal exception similar to: `java.io.IOException: Timedout 300000ms waiting for namespace table to be assigned`.

### Cause

You might experience this issue if you have many tables and regions that haven't been flushed when you restart your HMaster services. The time-out is a known defect with HMaster. General cluster startup tasks can take a long time. HMaster shuts down if the namespace table isn’t yet assigned. The lengthy startup tasks happen where large amount of unflushed data exists and a timeout of five minutes isn't sufficient.

### Resolution

1. From the Apache Ambari UI, go to **HBase** > **Configs**. In the custom `hbase-site.xml` file, add the following setting:

    ```
    Key: hbase.master.namespace.init.timeout Value: 2400000  
    ```

1. Restart the required services (HMaster, and possibly other HBase services).

---

## Scenario: Frequent region server restarts

### Issue

Nodes reboot periodically. From the region server logs you may see entries similar to:

```
2017-05-09 17:45:07,683 WARN  [JvmPauseMonitor] util.JvmPauseMonitor: Detected pause in JVM or host machine (eg GC): pause of approximately 31000ms
2017-05-09 17:45:07,683 WARN  [JvmPauseMonitor] util.JvmPauseMonitor: Detected pause in JVM or host machine (eg GC): pause of approximately 31000ms
2017-05-09 17:45:07,683 WARN  [JvmPauseMonitor] util.JvmPauseMonitor: Detected pause in JVM or host machine (eg GC): pause of approximately 31000ms
```

### Cause: zookeeper session timeout

Long `regionserver` JVM GC pause. The pause causes `regionserver` to be unresponsive and not able to send heart beat to HMaster within the zookeeper session timeout 40s. HMaster believes `regionserver` is dead, aborts the `regionserver` and restarts.



To mitigate, change the Zookeeper session timeout, not only `hbase-site` setting `zookeeper.session.timeout` but also Zookeeper `zoo.cfg` setting `maxSessionTimeout` need to be changed.

1. Access Ambari UI, go to **HBase -> Configs -> Settings**, in Timeouts section, change the value of Zookeeper Session Timeout.

1. Access Ambari UI, go to **Zookeeper -> Configs -> Custom** `zoo.cfg`, add/change the following setting. Make sure the value is the same as HBase `zookeeper.session.timeout`.

    ```
    Key: maxSessionTimeout Value: 120000  
    ```

1. Restart required services.


### Cause: overloaded RegionServer

Follow [Number of regions per RS - upper bound](https://hbase.apache.org/book.html#ops.capacity.regions.count) to calculate upper bound.
For example: `8000 (Region server Heap -- Xmx in MB) * 0.4 (hbase.regionserver.global.memstore.size) /64 (hbase.regionserver.hlog.blocksize/2) = 50`

To mitigate, scale up your HBase cluster.



---

## Scenario: Log splitting failure

### Issue

HMasters failed to come up on a HBase cluster.

### Cause

Misconfigured HDFS and HBase settings for a secondary storage account.

### Resolution

`set hbase.rootdir: wasb://@.blob.core.windows.net/hbase` and restart services on Ambari.

---

## Next steps

[!INCLUDE [notes](../includes/hdinsight-troubleshooting-next-steps.md)]

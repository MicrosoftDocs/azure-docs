---
title: Apache HBase Master fails to start in Azure HDInsight
description: Apache HBase Master (HMaster) fails to start in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.date: 08/06/2019
---

# Apache HBase Master (HMaster) fails to start in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Scenario: Atomic renaming failure

### Issue

Unexpected files identified during startup process.

### Cause

During the startup process, HMaster performs many initialization steps, including moving data from scratch (.tmp) folder to data folder. HMaster also looks at WALs (Write Ahead Logs) folder to see if there are any dead region servers. During all these situations, it does a basic `list` command on these folders. If at any time it sees an unexpected file in any of these folders, it will throw an exception and hence not start.

### Resolution

In such a situation, check the call stack to see which folder might be causing problem (for instance is it WALs folder or .tmp folder). Then via Cloud Explorer or via hdfs commands to locate the problem file. The problem file is usually a `*-renamePending.json` file (a journal file used to implement Atomic Rename operation in WASB driver). Due to bugs in this implementation, such files can be left over in cases of process crash. Force delete this file via Cloud Explorer. In addition, there might be a temporary file of the nature $ in this location. The file cannot be seen via cloud explorer and only via hdfs `ls` command. You can use hdfs command `hdfs dfs -rm //\$\$\$.\$\$\$` to delete this file.

Once the problem file has been removed, HMaster should start up immediately.

---

## Scenario: No server address listed

### Issue

HMaster log shows an error message similar to "No server address listed in hbase: meta for region xxx."

### Cause

HMaster could not initialize after restarting HBase.

### Resolution

1. Execute the following commands on HBase shell (change actual values as applicable):

    ```
    scan 'hbase:meta'
    delete 'hbase:meta','hbase:backup <region name>','<column name>' 
    ```

1. Delete the entry of hbase: namespace as the same error may be reported while scan hbase: namespace table.

1. Restart the active HMaster from Ambari UI to bring up HBase in running state.

1. Run the following command on HBase shell to bring up all offline tables:

    ```
    hbase hbck -ignorePreCheckPermission -fixAssignments
    ```

---

## Scenario: java.io.IOException: Timedout

### Issue

HMaster times out with fatal exception like `java.io.IOException: Timedout 300000ms waiting for namespace table to be assigned`.

### Cause

The time-out is a known defect with HMaster. General cluster startup tasks can take a long time. HMaster shuts down if the namespace table isn’t yet assigned. The lengthy startup tasks happen where large amount of unflushed data exists and a timeout of five minutes is not sufficient.

### Resolution

1. Access Ambari UI, go to HBase -> Configs, in custom `hbase-site.xml` add the following setting:

    ```
    Key: hbase.master.namespace.init.timeout Value: 2400000  
    ```

1. Restart required services (Mainly HMaster and possibly other HBase services).

---

## Scenario: Frequent regionserver restarts

### Issue

Nodes reboot periodically. From the regionserver logs you may see entries similar to:

```
2017-05-09 17:45:07,683 WARN  [JvmPauseMonitor] util.JvmPauseMonitor: Detected pause in JVM or host machine (eg GC): pause of approximately 31000ms
2017-05-09 17:45:07,683 WARN  [JvmPauseMonitor] util.JvmPauseMonitor: Detected pause in JVM or host machine (eg GC): pause of approximately 31000ms
2017-05-09 17:45:07,683 WARN  [JvmPauseMonitor] util.JvmPauseMonitor: Detected pause in JVM or host machine (eg GC): pause of approximately 31000ms
```

### Cause

Long regionserver JVM GC pause. The pause will cause regionserver to be unresponsive and not able to send heart beat to HMaster within the zk session timeout 40s. HMaster will believe regionserver is dead and will abort the regionserver and restart.

### Resolution

Change the zookeeper session timeout, not only hbase-site setting `zookeeper.session.timeout` but also zookeeper zoo.cfg setting `maxSessionTimeout` need to be changed.

1. Access Ambari UI, go to **HBase -> Configs -> Settings**, in Timeouts section, change the value of Zookeeper Session Timeout.

1. Access Ambari UI, go to **Zookeeper -> Configs -> Custom** zoo.cfg, add/change the following setting. Make sure the value is the same as hbase `zookeeper.session.timeout`.

    ```
    Key: maxSessionTimeout Value: 120000  
    ```

1. Restart required services.

---

## Scenario: Log splitting failure

### Issue

HMasters failed to come up on a HBase cluster.

### Cause

Misconfigured HDFS and HBase settings for a secondary storage account.

### Resolution

set hbase.rootdir: wasb://@.blob.core.windows.net/hbase and restart services on Ambari.

---

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).

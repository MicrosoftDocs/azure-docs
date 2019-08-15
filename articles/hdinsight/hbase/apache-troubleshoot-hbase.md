---
title: Troubleshoot HBase by using Azure HDInsight 
description: Get answers to common questions about working with HBase and Azure HDInsight.
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.custom: hdinsightactive, seodec18
ms.topic: troubleshooting
ms.date: 08/14/2019
---

# Troubleshoot Apache HBase by using Azure HDInsight

Learn about the top issues and their resolutions when working with Apache HBase payloads in Apache Ambari.

## How do I run hbck command reports with multiple unassigned regions?

A common error message that you might see when you run the `hbase hbck` command is "multiple regions being unassigned or holes in the chain of regions."

In the HBase Master UI, you can see the number of regions that are unbalanced across all region servers. Then, you can run `hbase hbck` command to see holes in the region chain.

Holes might be caused by the offline regions, so fix the assignments first. 

To bring the unassigned regions back to a normal state, complete the following steps:

1. Sign in to the HDInsight HBase cluster by using SSH.
2. To connect with the Apache ZooKeeper shell, run the `hbase zkcli` command.
3. Run the `rmr /hbase/regions-in-transition` command or the `rmr /hbase-unsecure/regions-in-transition` command.
4. To exit from the `hbase zkcli` shell, use the `exit` command.
5. Open the Apache Ambari UI, and then restart the Active HBase Master service.
6. Run the `hbase hbck` command again (without any options). Check the output of this command to ensure that all regions are being assigned.


## <a name="how-do-i-fix-timeout-issues-with-hbck-commands-for-region-assignments"></a>How do I fix timeout issues when using hbck commands for region assignments?

### Issue

A potential cause for timeout issues when you use the `hbck` command might be that several regions are in the "in transition" state for a long time. You can see those regions as offline in the HBase Master UI. Because a high number of regions are attempting to transition, HBase Master might timeout and be unable to bring those regions back online.

### Resolution steps

1. Sign in to the HDInsight HBase cluster by using SSH.
2. To connect with the Apache ZooKeeper shell, run the `hbase zkcli` command.
3. Run the `rmr /hbase/regions-in-transition` or the `rmr /hbase-unsecure/regions-in-transition` command.
4. To exit the `hbase zkcli` shell, use the `exit` command.
5. In the Ambari UI, restart the Active HBase Master service.
6. Run the `hbase hbck -fixAssignments` command again.

## How do I fix JDBC or SQLLine connectivity issues with Apache Phoenix?

### Resolution steps

To connect with Apache Phoenix, you must provide the IP address of an active Apache ZooKeeper node. Ensure that the ZooKeeper service to which sqlline.py is trying to connect is up and running.
1. Sign in to the HDInsight cluster by using SSH.
2. Enter the following command:
                
   ```apache
           "/usr/hdp/current/phoenix-client/bin/sqlline.py <IP of machine where Active Zookeeper is running"
   ```

   > [!Note] 
   > You can get the IP address of the active ZooKeeper node from the Ambari UI. Go to **HBase** > **Quick Links** > **ZK\* (Active)** > **Zookeeper Info**. 

3. If the sqlline.py connects to Phoenix and does not timeout, run the following command to validate the availability and health of Phoenix:

   ```apache
           !tables
           !quit
   ```      
4. If this command works, there is no issue. The IP address provided by the user might be incorrect. However, if the command pauses for an extended time and then displays the following error, continue to step 5.

   ```apache
           Error while connecting to sqlline.py (Hbase - phoenix) Setting property: [isolation, TRANSACTION_READ_COMMITTED] issuing: !connect jdbc:phoenix:10.2.0.7 none none org.apache.phoenix.jdbc.PhoenixDriver Connecting to jdbc:phoenix:10.2.0.7 SLF4J: Class path contains multiple SLF4J bindings. 
   ```

5. Run the following commands from the head node (hn0) to diagnose the condition of the Phoenix SYSTEM.CATALOG table:

   ```apache
            hbase shell
                
           count 'SYSTEM.CATALOG'
   ```

   The command should return an error similar to the following: 

   ```apache
           ERROR: org.apache.hadoop.hbase.NotServingRegionException: Region SYSTEM.CATALOG,,1485464083256.c0568c94033870c517ed36c45da98129. is not online on 10.2.0.5,16020,1489466172189) 
   ```
6. In the Apache Ambari UI, complete the following steps to restart the HMaster service on all ZooKeeper nodes:

    1. In the **Summary** section of HBase, go to **HBase** > **Active HBase Master**. 
    2. In the **Components** section, restart the HBase Master service.
    3. Repeat these steps for all remaining **Standby HBase Master** services. 

It can take up to five minutes for the HBase Master service to stabilize and finish the recovery process. After a few minutes, repeat the sqlline.py commands to confirm that the SYSTEM.CATALOG table is up, and that it can be queried. 

When the SYSTEM.CATALOG table is back to normal, the connectivity issue to Phoenix should be automatically resolved.


## What causes a master server to fail to start?

### Error 

An atomic renaming failure occurs.

### Detailed description

During the startup process, HMaster completes many initialization steps. These include moving data from the scratch (.tmp) folder to the data folder. HMaster also looks at the write-ahead logs (WALs) folder to see if there are any unresponsive region servers, and so on. 

During startup, HMaster does a basic `list` command on these folders. If at any time, HMaster sees an unexpected file in any of these folders, it throws an exception and doesn't start.  

### Probable cause

In the region server logs, try to identify the timeline of the file creation, and then see if there was a process crash around the time the file was created. (Contact HBase support to assist you in doing this.) This helps us provide more robust mechanisms, so that you can avoid hitting this bug, and ensure graceful process shutdowns.

### Resolution steps

Check the call stack and try to determine which folder might be causing the problem (for instance, it might be the WALs folder or the .tmp folder). Then, in Cloud Explorer or by using HDFS commands, try to locate the problem file. Usually, this is a \*-renamePending.json file. (The \*-renamePending.json file is a journal file that's used to implement the atomic rename operation in the WASB driver. Due to bugs in this implementation, these files can be left over after process crashes, and so on.) Force-delete this file either in Cloud Explorer or by using HDFS commands. 

Sometimes, there might also be a temporary file named something like *$$$.$$$* at this location. You have to use HDFS `ls` command to see this file; you cannot see the file in Cloud Explorer. To delete this file, use the HDFS command `hdfs dfs -rm /\<path>\/\$\$\$.\$\$\$`.  

After you've run these commands, HMaster should start immediately. 

### Error

No server address is listed in *hbase: meta* for region xxx.

### Detailed description

You might see a message on your Linux cluster that indicates that the *hbase: meta* table is not online. Running `hbck` might report that "hbase: meta table replicaId 0 is not found on any region." The problem might be that HMaster could not initialize after you restarted HBase. In the HMaster logs, you might see the message: "No server address listed in hbase: meta for region hbase: backup \<region name\>".  

### Resolution steps

1. In the HBase shell, enter the following commands (change actual values as applicable):  

   ```apache
   > scan 'hbase:meta'  
   ```

   ```apache
   > delete 'hbase:meta','hbase:backup <region name>','<column name>'  
   ```

2. Delete the *hbase: namespace* entry. This entry might be the same error that's being reported when the *hbase: namespace* table is scanned.

3. To bring up HBase in a running state, in the Ambari UI, restart the Active HMaster service.  

4. In the HBase shell, to bring up all offline tables, run the following command:

   ```apache 
   hbase hbck -ignorePreCheckPermission -fixAssignments 
   ```

### Additional reading

[Unable to process the HBase table](https://stackoverflow.com/questions/4794092/unable-to-access-hbase-table)


### Error

HMaster times out with a fatal exception similar to "java.io.IOException: Timedout 300000ms waiting for namespace table to be assigned."

### Detailed description

You might experience this issue if you have many tables and regions that have not been flushed when you restart your HMaster services. Restart might fail, and you'll see the preceding error message.  

### Probable cause

This is a known issue with the HMaster service. General cluster startup tasks can take a long time. HMaster shuts down because the namespace table isn’t yet assigned. This occurs only in scenarios in which large amount of unflushed data exists, and a timeout of five minutes is not sufficient.
  
### Resolution steps

1. In the Apache Ambari UI, go to **HBase** > **Configs**. In the custom hbase-site.xml file, add the following setting: 

   ```apache
   Key: hbase.master.namespace.init.timeout Value: 2400000  
   ```

2. Restart the required services (HMaster, and possibly other HBase services).  


## What causes a restart failure on a region server?

### Issue

A restart failure on a region server might be prevented by following best practices. We recommend that you pause heavy workload activity when you are planning to restart HBase region servers. If an application continues to connect with region servers when shutdown is in progress, the region server restart operation will be slower by several minutes. Also, it's a good idea to first flush all the tables. For a reference on how to flush tables, see [HDInsight HBase: How to improve the Apache HBase cluster restart time by flushing tables](https://web.archive.org/web/20190112153155/https://blogs.msdn.microsoft.com/azuredatalake/2016/09/19/hdinsight-hbase-how-to-improve-hbase-cluster-restart-time-by-flushing-tables/).

If you initiate the restart operation on HBase region servers from the Apache Ambari UI, you immediately see that the region servers went down, but they don't restart right away. 

Here's what's happening behind the scenes: 

1. The Ambari agent sends a stop request to the region server.
2. The Ambari agent waits for 30 seconds for the region server to shut down gracefully. 
3. If your application continues to connect with the region server, the server won't shut down immediately. The 30-second timeout expires before shutdown occurs. 
4. After 30 seconds, the Ambari agent sends a force-kill (`kill -9`) command to the region server. You can see this in the ambari-agent log (in the /var/log/ directory of the respective worker node):

   ```apache
           2017-03-21 13:22:09,171 - Execute['/usr/hdp/current/hbase-regionserver/bin/hbase-daemon.sh --config /usr/hdp/current/hbase-regionserver/conf stop regionserver'] {'only_if': 'ambari-sudo.sh  -H -E t
           est -f /var/run/hbase/hbase-hbase-regionserver.pid && ps -p `ambari-sudo.sh  -H -E cat /var/run/hbase/hbase-hbase-regionserver.pid` >/dev/null 2>&1', 'on_timeout': '! ( ambari-sudo.sh  -H -E test -
           f /var/run/hbase/hbase-hbase-regionserver.pid && ps -p `ambari-sudo.sh  -H -E cat /var/run/hbase/hbase-hbase-regionserver.pid` >/dev/null 2>&1 ) || ambari-sudo.sh -H -E kill -9 `ambari-sudo.sh  -H 
           -E cat /var/run/hbase/hbase-hbase-regionserver.pid`', 'timeout': 30, 'user': 'hbase'}
           2017-03-21 13:22:40,268 - Executing '! ( ambari-sudo.sh  -H -E test -f /var/run/hbase/hbase-hbase-regionserver.pid && ps -p `ambari-sudo.sh  -H -E cat /var/run/hbase/hbase-hbase-regionserver.pid` >
           /dev/null 2>&1 ) || ambari-sudo.sh -H -E kill -9 `ambari-sudo.sh  -H -E cat /var/run/hbase/hbase-hbase-regionserver.pid`'. Reason: Execution of 'ambari-sudo.sh su hbase -l -s /bin/bash -c 'export  
           PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/var/lib/ambari-agent ; /usr/hdp/current/hbase-regionserver/bin/hbase-daemon.sh --config /usr/hdp/curre
           nt/hbase-regionserver/conf stop regionserver was killed due timeout after 30 seconds
           2017-03-21 13:22:40,285 - File['/var/run/hbase/hbase-hbase-regionserver.pid'] {'action': ['delete']}
           2017-03-21 13:22:40,285 - Deleting File['/var/run/hbase/hbase-hbase-regionserver.pid']
   ```
   Because of the abrupt shutdown, the port associated with the process might not be released, even though the region server process is stopped. This situation can lead to an AddressBindException when the region server is starting, as shown in the following logs. You can verify this in the region-server.log in the /var/log/hbase directory on the worker nodes where the region server fails to start. 

   ```apache

   2017-03-21 13:25:47,061 ERROR [main] regionserver.HRegionServerCommandLine: Region server exiting
   java.lang.RuntimeException: Failed construction of Regionserver: class org.apache.hadoop.hbase.regionserver.HRegionServer
   at org.apache.hadoop.hbase.regionserver.HRegionServer.constructRegionServer(HRegionServer.java:2636)
   at org.apache.hadoop.hbase.regionserver.HRegionServerCommandLine.start(HRegionServerCommandLine.java:64)
   at org.apache.hadoop.hbase.regionserver.HRegionServerCommandLine.run(HRegionServerCommandLine.java:87)
   at org.apache.hadoop.util.ToolRunner.run(ToolRunner.java:76)
   at org.apache.hadoop.hbase.util.ServerCommandLine.doMain(ServerCommandLine.java:126)
   at org.apache.hadoop.hbase.regionserver.HRegionServer.main(HRegionServer.java:2651)
        
   Caused by: java.lang.reflect.InvocationTargetException
   at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
   at sun.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:57)
   at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
   at java.lang.reflect.Constructor.newInstance(Constructor.java:526)
   at org.apache.hadoop.hbase.regionserver.HRegionServer.constructRegionServer(HRegionServer.java:2634)
   ... 5 more
        
   Caused by: java.net.BindException: Problem binding to /10.2.0.4:16020 : Address already in use
   at org.apache.hadoop.hbase.ipc.RpcServer.bind(RpcServer.java:2497)
   at org.apache.hadoop.hbase.ipc.RpcServer$Listener.<init>(RpcServer.java:580)
   at org.apache.hadoop.hbase.ipc.RpcServer.<init>(RpcServer.java:1982)
   at org.apache.hadoop.hbase.regionserver.RSRpcServices.<init>(RSRpcServices.java:863)
   at org.apache.hadoop.hbase.regionserver.HRegionServer.createRpcServices(HRegionServer.java:632)
   at org.apache.hadoop.hbase.regionserver.HRegionServer.<init>(HRegionServer.java:532)
   ... 10 more
        
   Caused by: java.net.BindException: Address already in use
   at sun.nio.ch.Net.bind0(Native Method)
   at sun.nio.ch.Net.bind(Net.java:463)
   at sun.nio.ch.Net.bind(Net.java:455)
   at sun.nio.ch.ServerSocketChannelImpl.bind(ServerSocketChannelImpl.java:223)
   at sun.nio.ch.ServerSocketAdaptor.bind(ServerSocketAdaptor.java:74)
   at org.apache.hadoop.hbase.ipc.RpcServer.bind(RpcServer.java:2495)
   ... 15 more
   ```

### Resolution steps

1. Try to reduce the load on the HBase region servers before you initiate a restart. 
2. Alternatively (if step 1 doesn't help), try to manually restart region servers on the worker nodes by using the following commands:

   ```apache
   sudo su - hbase -c "/usr/hdp/current/hbase-regionserver/bin/hbase-daemon.sh stop regionserver"
   sudo su - hbase -c "/usr/hdp/current/hbase-regionserver/bin/hbase-daemon.sh start regionserver"   
   ```

### See also
[Troubleshoot by using Azure HDInsight](../../hdinsight/hdinsight-troubleshoot-guide.md)

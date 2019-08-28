---
title: Troubleshoot HBase by using Azure HDInsight 
description: Get answers to common questions about working with HBase and Azure HDInsight.
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.custom: hdinsightactive, seodec18
ms.topic: troubleshooting
ms.date: 08/16/2019
---

# Troubleshoot Apache HBase by using Azure HDInsight

Learn about the top issues and their resolutions when working with Apache HBase payloads in Apache Ambari.

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

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).

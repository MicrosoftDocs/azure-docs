---
title: HBase Hbck command reporting holes in the chain of regions | Microsoft Docs
description: Troubleshooting the cause of holes in the chain of regions.
services: hdinsight
documentationcenter: ''
author: nitinver
manager: ashitg

ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 6/8/2017
ms.author: nitinver
---

# HBASE troubleshooting

This article describes the top issues and their resolutions for working with HBASE payloads in Apache Ambari.

## How do I run hbck command reports with multiple unassigned regions

It is a common issue to see 'multiple regions being unassigned or holes in the chain of regions' when the HBase user runs 'hbase hbck' command.

The user would see the count of regions being un-balanced across all the region servers from HBase Master UI. After that, user can run 'hbase hbck' command and shall notice holes in the region chain.

The user should first fix the assignments, because holes may be due to those offline regions. 

Follow the steps below to bring the unassigned regions back to normal state:

1. Login to HDInsight HBase cluster using SSH.
1. Run 'hbase zkcli' command to connect with zookeeper shell.
1. Run 'rmr /hbase/regions-in-transition' or 'rmr /hbase-unsecure/regions-in-transition' command.
1. Exit from 'hbase zkcli' shell by using 'exit' command.
1. Open Ambari UI and restart Active HBase Master service from Ambari.
1. Run 'hbase hbck' command again (without any further options).

Check the output of command in step 6 and ensure that all regions are being assigned.

---

## How do I fix timeout issues with hbck commands for region assignments

### Probable Cause

The potential cause here could be several regions under "in transition" state for a long time. 
Those regions can be seen as offline from HBase Master UI. Due to high number of regions that are 
attempting to transition, HBase Master could timeout and will be unable to bring those regions back
 to online state.

### Resolution Steps

Below are the steps to fix the hbck timeout problem:

1. Login to HDInsight HBase cluster using SSH.
1. Run 'hbase zkcli' command to connect with zookeeper shell.
1. Run 'rmr /hbase/regions-in-transition' or 'rmr /hbase-unsecure/regions-in-transition' command.
1. Exit from 'hbase zkcli' shell by using 'exit' command.
1. Open Ambari UI and restart Active HBase Master service from Ambari.
1. Run 'hbase hbck -fixAssignments' command again and it should not timeout any further.

## How do I force disable HDFS safe mode in an cluster

### Issue:

Local HDFS is stuck in safe mode on HDInsight cluster.   

### Detailed Description:

Fail to run simple HDFS command as follows:

```apache
hdfs dfs -D "fs.default.name=hdfs://mycluster/" -mkdir /temp
```

The error encountered trying to run the above command is as follows:

```apache
hdiuser@hn0-spark2:~$ hdfs dfs -D "fs.default.name=hdfs://mycluster/" -mkdir /temp
17/04/05 16:20:52 WARN retry.RetryInvocationHandler: Exception while invoking ClientNamenodeProtocolTranslatorPB.mkdirs over hn0-spark2.2oyzcdm4sfjuzjmj5dnmvscjpg.dx.internal.cloudapp.net/10.0.0.22:8020. Not retrying because try once and fail.
org.apache.hadoop.ipc.RemoteException(org.apache.hadoop.hdfs.server.namenode.SafeModeException): Cannot create directory /temp. Name node is in safe mode.
It was turned on manually. Use "hdfs dfsadmin -safemode leave" to turn safe mode off.
        at org.apache.hadoop.hdfs.server.namenode.FSNamesystem.checkNameNodeSafeMode(FSNamesystem.java:1359)
        at org.apache.hadoop.hdfs.server.namenode.FSNamesystem.mkdirs(FSNamesystem.java:4010)
        at org.apache.hadoop.hdfs.server.namenode.NameNodeRpcServer.mkdirs(NameNodeRpcServer.java:1102)
        at org.apache.hadoop.hdfs.protocolPB.ClientNamenodeProtocolServerSideTranslatorPB.mkdirs(ClientNamenodeProtocolServerSideTranslatorPB.java:630)
        at org.apache.hadoop.hdfs.protocol.proto.ClientNamenodeProtocolProtos$ClientNamenodeProtocol$2.callBlockingMethod(ClientNamenodeProtocolProtos.java)
        at org.apache.hadoop.ipc.ProtobufRpcEngine$Server$ProtoBufRpcInvoker.call(ProtobufRpcEngine.java:640)
        at org.apache.hadoop.ipc.RPC$Server.call(RPC.java:982)
        at org.apache.hadoop.ipc.Server$Handler$1.run(Server.java:2313)
        at org.apache.hadoop.ipc.Server$Handler$1.run(Server.java:2309)
        at java.security.AccessController.doPrivileged(Native Method)
        at javax.security.auth.Subject.doAs(Subject.java:422)
        at org.apache.hadoop.security.UserGroupInformation.doAs(UserGroupInformation.java:1724)
        at org.apache.hadoop.ipc.Server$Handler.run(Server.java:2307)
        at org.apache.hadoop.ipc.Client.getRpcResponse(Client.java:1552)
        at org.apache.hadoop.ipc.Client.call(Client.java:1496)
        at org.apache.hadoop.ipc.Client.call(Client.java:1396)
        at org.apache.hadoop.ipc.ProtobufRpcEngine$Invoker.invoke(ProtobufRpcEngine.java:233)
        at com.sun.proxy.$Proxy10.mkdirs(Unknown Source)
        at org.apache.hadoop.hdfs.protocolPB.ClientNamenodeProtocolTranslatorPB.mkdirs(ClientNamenodeProtocolTranslatorPB.java:603)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at org.apache.hadoop.io.retry.RetryInvocationHandler.invokeMethod(RetryInvocationHandler.java:278)
        at org.apache.hadoop.io.retry.RetryInvocationHandler.invoke(RetryInvocationHandler.java:194)
        at org.apache.hadoop.io.retry.RetryInvocationHandler.invoke(RetryInvocationHandler.java:176)
        at com.sun.proxy.$Proxy11.mkdirs(Unknown Source)
        at org.apache.hadoop.hdfs.DFSClient.primitiveMkdir(DFSClient.java:3061)
        at org.apache.hadoop.hdfs.DFSClient.mkdirs(DFSClient.java:3031)
        at org.apache.hadoop.hdfs.DistributedFileSystem$24.doCall(DistributedFileSystem.java:1162)
        at org.apache.hadoop.hdfs.DistributedFileSystem$24.doCall(DistributedFileSystem.java:1158)
        at org.apache.hadoop.fs.FileSystemLinkResolver.resolve(FileSystemLinkResolver.java:81)
        at org.apache.hadoop.hdfs.DistributedFileSystem.mkdirsInternal(DistributedFileSystem.java:1158)
        at org.apache.hadoop.hdfs.DistributedFileSystem.mkdirs(DistributedFileSystem.java:1150)
        at org.apache.hadoop.fs.FileSystem.mkdirs(FileSystem.java:1898)
        at org.apache.hadoop.fs.shell.Mkdir.processNonexistentPath(Mkdir.java:76)
        at org.apache.hadoop.fs.shell.Command.processArgument(Command.java:273)
        at org.apache.hadoop.fs.shell.Command.processArguments(Command.java:255)
        at org.apache.hadoop.fs.shell.FsCommand.processRawArguments(FsCommand.java:119)
        at org.apache.hadoop.fs.shell.Command.run(Command.java:165)
        at org.apache.hadoop.fs.FsShell.run(FsShell.java:297)
        at org.apache.hadoop.util.ToolRunner.run(ToolRunner.java:76)
        at org.apache.hadoop.util.ToolRunner.run(ToolRunner.java:90)
        at org.apache.hadoop.fs.FsShell.main(FsShell.java:350)
mkdir: Cannot create directory /temp. Name node is in safe mode.
```

### Probable Cause:

HDInsight cluster has been scaled down to very few nodes below or close to HDFS replication factor.

### Resolution Steps: 

- Report on the status of HDFS on the HDInsight cluster with the following commands:

```apache
hdfs dfsadmin -D "fs.default.name=hdfs://mycluster/" -report
```

```apache
hdiuser@hn0-spark2:~$ hdfs dfsadmin -D "fs.default.name=hdfs://mycluster/" -report
Safe mode is ON
Configured Capacity: 3372381241344 (3.07 TB)
Present Capacity: 3138625077248 (2.85 TB)
DFS Remaining: 3102710317056 (2.82 TB)
DFS Used: 35914760192 (33.45 GB)
DFS Used%: 1.14%
Under replicated blocks: 0
Blocks with corrupt replicas: 0
Missing blocks: 0
Missing blocks (with replication factor 1): 0

-------------------------------------------------
Live datanodes (8):

Name: 10.0.0.17:30010 (10.0.0.17)
Hostname: 10.0.0.17
Decommission Status : Normal
Configured Capacity: 421547655168 (392.60 GB)
DFS Used: 5288128512 (4.92 GB)
Non DFS Used: 29087272960 (27.09 GB)
DFS Remaining: 387172253696 (360.58 GB)
DFS Used%: 1.25%
DFS Remaining%: 91.85%
Configured Cache Capacity: 0 (0 B)
Cache Used: 0 (0 B)
Cache Remaining: 0 (0 B)
Cache Used%: 100.00%
Cache Remaining%: 0.00%
Xceivers: 2
Last contact: Wed Apr 05 16:22:00 UTC 2017
...

```
- You can also check on the integrity of HDFS on the HDInsight cluster with the following commands:

```apache
hdiuser@hn0-spark2:~$ hdfs fsck -D "fs.default.name=hdfs://mycluster/" /
```

```apache
Connecting to namenode via http://hn0-spark2.2oyzcdm4sfjuzjmj5dnmvscjpg.dx.internal.cloudapp.net:30070/fsck?ugi=hdiuser&path=%2F
FSCK started by hdiuser (auth:SIMPLE) from /10.0.0.22 for path / at Wed Apr 05 16:40:28 UTC 2017
....................................................................................................

....................................................................................................
..................Status: HEALTHY
 Total size:    9330539472 B
 Total dirs:    37
 Total files:   2618
 Total symlinks:                0 (Files currently being written: 2)
 Total blocks (validated):      2535 (avg. block size 3680686 B)
 Minimally replicated blocks:   2535 (100.0 %)
 Over-replicated blocks:        0 (0.0 %)
 Under-replicated blocks:       0 (0.0 %)
 Mis-replicated blocks:         0 (0.0 %)
 Default replication factor:    3
 Average block replication:     3.0
 Corrupt blocks:                0
 Missing replicas:              0 (0.0 %)
 Number of data-nodes:          8
 Number of racks:               1
FSCK ended at Wed Apr 05 16:40:28 UTC 2017 in 187 milliseconds


The filesystem under path '/' is HEALTHY
```

- If determined there are no missing, corrupt or under replicated blocks or those blocks can be ignored run the following command to take the name node out of safe mode:

```apache
hdfs dfsadmin -D "fs.default.name=hdfs://mycluster/" -safemode leave
```


## How do I fix JDBC or sqlline connectivity issues with Apache Phoenix

### Resolution Steps:

To connect with Apache phoenix, you must provide the IP of active zookeeper 
node. Ensure that zookeeper service to which sqlline.py is trying to connect is up and running.
1. Perform SSH login to the HDInsight cluster.
1. Try following command:
        
```apache
        "/usr/hdp/current/phoenix-client/bin/sqlline.py <IP of machine where Active Zookeeper is running"
```     
    Note: The IP of Active Zooker node can be identified from Ambari UI, by following the links to HBase -> "Quick Links" -> "ZK* (Active)" -> "Zookeeper Info". 

If the sqlline.py connects to Apache Phoenix and does not timeout, run following command to validate the availability and health of Apache Phoenix:

```apache
        !tables
        !quit
```      
- If the above commands works, then there is no issue. The IP provided by user could be incorrect.
   
    However, if the command pauses for too long and then throws the error mentions below, continue to follow the troubleshooting guide below:

```apache
        Error while connecting to sqlline.py (Hbase - phoenix) Setting property: [isolation, TRANSACTION_READ_COMMITTED] issuing: !connect jdbc:phoenix:10.2.0.7 none none org.apache.phoenix.jdbc.PhoenixDriver Connecting to jdbc:phoenix:10.2.0.7 SLF4J: Class path contains multiple SLF4J bindings. 
```

- Run following commands from headnode (hn0) to diagnose the condition of phoenix SYSTEM.CATALOG table:

```apache
        hbase shell
        
        count 'SYSTEM.CATALOG'
```        
- The command should return an error similar to following: 

```apache
        ERROR: org.apache.hadoop.hbase.NotServingRegionException: Region SYSTEM.CATALOG,,1485464083256.c0568c94033870c517ed36c45da98129. is not online on 10.2.0.5,16020,1489466172189) 
```
- Restart the HMaster service on all the zookeeper nodes from Ambari UI by following steps below:

    a. Go to "HBase -> Active HBase Master" link in summary section of HBase. 
    a. In Components section, restart the HBase Master service.
    a. Repeat the above steps for remaining "Standby HBase Master" services. 

It can take up to five minutes for HBase Master service to stabilize and finish the recovery. After few minutes of wait, repeat the sqlline.py commands to confirm that system catalog table is up and can be queried. 

When Once the 'SYSTEM.CATALOG' table is back to normal, the connectivity issue to Apache Phoenix should get resolved automatically.


## What causes a master server to fail to start

### Error: 

Atomic renaming failure

### Detailed Description:

During startup process HMaster does lot of initialization steps including moving data from scratch (.tmp) folder to data folder; also looks at WALs (Write Ahead Logs) folder to see if there are any dead region servers and so on. 

During all these situations it does a basic 'list' command on these folders. If at anytime it sees an unexpected file in any of these folders it will throw an exception and hence not start.  

### Probable Cause:

Try to identify the timeline of the file creation and see if there was a process crash at around that time in region server logs (Contact any of the HBase crew to assist you in doing this). This helps us provide more robust mechanisms 
to avoid hitting this bug and ensure graceful process shutdowns.

### Resolution Steps:

In such a situation try to check the call stack and see which folder might be causing problem (for instance is it WALs folder or .tmp folder). Then via Cloud Explorer or via hdfs commands try to locate the problem file - usually this is a *-renamePending.json file (a journal file used to implement Atomic Rename operation in WASB driver; due to bugs in this implementation such files can be left over in cases of process crash etc). Force delete this either via Cloud Explorer. 

In addition sometimes there might also be a temporary file of the nature $$$.$$$ in this location, this cannot be seen via cloud explorer and only via hdfs ls command. You can use hdfs command "hdfs dfs -rm /<the path>/\$\$\$.\$\$\$" to delete this file.  

Once this is done, HMaster should start up immediately. 

### Error: No server address listed in 

No server address listed in hbase: meta for region xxx

### Detailed Description:

Customer met an issue on their Linux cluster that hbase: meta table was not online. Running hbck reported that "hbase: meta table replicaId 0 is not found on any region". After restarting HBase, the symptom became that the hmaster could not initialize. In the hmaster logs, it reported that "No server address listed in hbase: meta for region hbase: backup <region name>".  

### Resolution Steps:

- Type the following on HBase shell (change actual values as applicable),  

```apache
> scan 'hbase:meta'  
```

```apache
> delete 'hbase:meta','hbase:backup <region name>','<column name>'  
```

- Delete the entry of hbase: namespace as the same error may be reported while scan hbase: namespace table.

- Restart the active HMaster from Ambari UI to bring up HBase in running state.  

- Run the following command on HBase shell to bring up all offline tables:

```apache 
hbase hbck -ignorePreCheckPermission -fixAssignments 
```

### Further Reading:

[Unable to process HBase table](http://stackoverflow.com/questions/4794092/unable-to-access-hbase-table)


### Error:

HMaster times out with fatal exception like java.io.IOException: Timedout 300000ms waiting for namespace table to be assigned

### Detailed Description:

Customer ran into this issue when apparently they had a lot of tables and regions and had not flushed when they restarted their HMaster services. Restart was failing with above message. No other error found.  

### Probable Cause:

This is a known "defect" with the HMaster - general cluster startup tasks can take a long time and the HMaster shuts down because of the namespace table isn’t yet assigned - which is hit only in this scenario where large amount of unflushed data exists and a timeout of five minutes is not sufficient
  
### Resolution Steps:

- Access Ambari UI, go to HBase -> Configs, in custom hbase-site.xml add the following setting: 

```apache
Key: hbase.master.namespace.init.timeout Value: 2400000  
```

- Restart required services (Mainly HMaster and possibly other HBase services).  



## What causes a restart failure on a region server

### Probable Cause:

First of all, the situation like this could be prevented by following best practices. It is advisable to pause the heavy workload activity when planning to restart HBase Region Servers. If the application continues to connect with region servers when shutdown is in progress, it will slow down the region server restart operation by several minutes. Also, it is advised the users to flush all the tables by following [HDInsight HBase: How to Improve HBase cluster restart time 
by Flushing tables](https://blogs.msdn.microsoft.com/azuredatalake/2016/09/19/hdinsight-hbase-how-to-improve-hbase-cluster-restart-time-by-flushing-tables/) as a reference.

If a user initiates the restart operation on HBase region server's from Ambari UI. He would immediately see the region servers went down, but not coming back up for too long. 

Below is what happens behind the scenes: 

1. Ambari agent will send a stop request to region server.
1. The Ambari agent then waits for 30 seconds for region server to shutdown gracefully. 
1. If the customer's application continues to connect with region server, it will not shutdown immediately and hence 30 seconds timeout will expire sooner. 
1. After expiration of 30 seconds, Ambari agent will send a force kill (kill -9) to region server. One can observe this in ambari-agent log (in /var/log/ directory of respective workernode) as below:

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

ue to this abrupt shutdown, although the region server process gets killed, the port associated with the process may not be released, which eventually leads to AddressBindException as shown in the logs below while starting region server. One can verify this in region-server.log in /var/log/hbase directory on the worker nodes where region server start fails. 

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

### Resolution Steps:

During such cases, the workaround below can be tried: 

- Try to reduce the load on the HBase region servers before initiating a restart. 

- Alternatively (if step above doesn't help), try and manually restart region servers on the worker nodes using following commands:

```apache
      sudo su - hbase -c "/usr/hdp/current/hbase-regionserver/bin/hbase-daemon.sh stop regionserver"
      sudo su - hbase -c "/usr/hdp/current/hbase-regionserver/bin/hbase-daemon.sh start regionserver"   
```



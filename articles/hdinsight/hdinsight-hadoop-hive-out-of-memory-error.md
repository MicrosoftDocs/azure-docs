<properties
	pageTitle="Out of memory error - Hive settings | Microsoft Azure"
	description="Fix an out of memory error with Hive memory settings in Hadoop in HDInsight. Example is a Hive query on a big table with many STRING column types."
	keywords="out of memory error, Hive settings"
	services="service-name"
	documentationCenter=""
	authors="cjgronlund"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="hdinsight"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="big-data"
	ms.date="12/09/2015"
	ms.author="rashimg;cgronlun"/>

# Fix an out of memory error with Hive memory settings in Azure HDInsight

One of the common problems our customers face is getting an Out of Memory (OOM) error when using Hive. This blog post describes a scenario when a customer reached out to us regarding an issue and the settings we recommended to them to fix the issue.

Scenario

One of our customers reached out to us with the following problem. They ran the query below using Hive.
SELECT
	COUNT (T1.COLUMN1) as DisplayColumn1,
	…
	…	
	….
FROM
	TABLE1 T1,
	TABLE2 T2,
	TABLE3 T3,
	TABLE5 T4,
	TABLE6 T5,
	TABLE7 T6
where (T1.KEY1 = T2.KEY1….
	…
	…

Some nuances of this query:
•T1 is an alias to a big table, TABLE1, which has lots of STRING column types.
•Other tables are not that big but do have a large number of columns.
•All tables are joining each other, in some cases with multiple columns in TABLE1 and others.

When they ran the query below using Hive on MapReduce on a 24 node A3 cluster, the query ran in about 26 minutes. The customer noticed the following warning messages when the query was run using Hive on MapReduce:
Warning: Map Join MAPJOIN[428][bigTable=?] in task 'Stage-21:MAPRED' is a cross product
Warning: Shuffle Join JOIN[8][tables = [t1933775, t1932766]] in Stage 'Stage-4:MAPRED' is a cross product

Since the query finished executing in about 26 minutes, the customer ignored these warnings and instead started to focus on how to improve the this query’s performance further.

Based on our documentation on improving performance, the customer decided to use Tez execution engine. Once the same query was run with the Tez setting enabled, the query ran for 15 minutes, then threw the following error:
Status: Failed
Vertex failed, vertexName=Map 5, vertexId=vertex_1443634917922_0008_1_05, diagnostics=[Task failed, taskId=task_1443634917922_0008_1_05_000006, diagnostics=[TaskAttempt 0 failed, info=[Error: Failure
while running task:java.lang.RuntimeException: java.lang.OutOfMemoryError: Java heap space
        at org.apache.hadoop.hive.ql.exec.tez.TezProcessor.initializeAndRunProcessor(TezProcessor.java:172)
        at org.apache.hadoop.hive.ql.exec.tez.TezProcessor.run(TezProcessor.java:138)
        at org.apache.tez.runtime.LogicalIOProcessorRuntimeTask.run(LogicalIOProcessorRuntimeTask.java:324)
        at org.apache.tez.runtime.task.TezTaskRunner$TaskRunnerCallable$1.run(TezTaskRunner.java:176)
        at org.apache.tez.runtime.task.TezTaskRunner$TaskRunnerCallable$1.run(TezTaskRunner.java:168)
        at java.security.AccessController.doPrivileged(Native Method)
        at javax.security.auth.Subject.doAs(Subject.java:415)
        at org.apache.hadoop.security.UserGroupInformation.doAs(UserGroupInformation.java:1628)
        at org.apache.tez.runtime.task.TezTaskRunner$TaskRunnerCallable.call(TezTaskRunner.java:168)
        at org.apache.tez.runtime.task.TezTaskRunner$TaskRunnerCallable.call(TezTaskRunner.java:163)
        at java.util.concurrent.FutureTask.run(FutureTask.java:262)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)
        at java.lang.Thread.run(Thread.java:745)
Caused by: java.lang.OutOfMemoryError: Java heap space

The customer then decided to use a bigger VM, i.e. D12, thinking a bigger VM will have more heap space. Even then, the customer continued to see the error. The customer reached out to us for help in debugging this issue.

Debugging Out of Memory error

Our CSS team and engineering team together found one of the issues causing the Out of Memory (OOM) error was due to a known issue, described here. From the description of the JIRA:
When hive.auto.convert.join.noconditionaltask = true we check noconditionaltask.size and if the sum of tables sizes in the map join is less than noconditionaltask.size the plan would generate a Map join, the issue with this is that the calculation doesnt take into account the overhead introduced by different HashTable implementation as results if the sum of input sizes is smaller than the noconditionaltask size by a small margin queries will hit OOM.

We confirmed that  hive.auto.convert.join.noconditionaltask is indeed set to true by looking under hive-site.xml file:
<property>
    <name>hive.auto.convert.join.noconditionaltask</name>
    <value>true</value>
    <description>
      Whether Hive enables the optimization about converting common join into mapjoin based on the input file size. 
      If this parameter is on, and the sum of size for n-1 of the tables/partitions for a n-way join is smaller than the
      specified size, the join is directly converted to a mapjoin (there is no conditional task).
    </description>
  </property>

Based on the warning and the JIRA, our hypothesis was Map Join was the cause of the “Java Heap Space” OOM error. So we started digging deeper into this issue.

As explained in this blog post, when Tez execution engine is used, the heap space used actually belongs to the Tez container. See the image below describing the Tez container memory.

Tez_Memory

As the blog post suggests, the following two memory settings define the container memory for the heap: hive.tez.container.size and hive.tez.java.opts. From our experience, the OOM exception does not mean the container size is too small. It means the Java heap size (hive.tez.java.opts) is too small. So whenever you see OOM, you can try to increase “hive.tez.java.opts.” If needed you might have to increase “hive.tez.container.size.” The “java.opts” should be around 80% of “container.size.”

Note, the setting hive.tez.java.opts must always be smaller than hive.tez.container.size.

Since a D12 machine has 28GB memory, we decided to use a container size of 10GB (10240MB) and assign 80% to java.opts. This was done on the Hive console using the setting below:
SET hive.tez.container.size=10240
SET hive.tez.java.opts=-Xmx8192m

Based on these settings, the query successfully ran in under ten minutes.

Conclusion

Getting an OOM error does not necessarily mean the container size is too small. Instead, you should configure the memory settings  such that the heap size is increased and is at least 80% of the container memory size.




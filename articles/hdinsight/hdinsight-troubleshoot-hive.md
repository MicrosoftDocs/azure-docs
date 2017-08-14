---
title: Hive troubleshooting - Azure HDInsight | Microsoft Docs
description: Use the Hive FAQ for answers to common questions about Hive on the Azure HDInsight platform.
keywords: Azure HDInsight, Hive, FAQ, troubleshooting guide, common questions
services: Azure HDInsight
documentationcenter: na
author: dharmeshkakadia
manager: ''
editor: ''

ms.assetid: 15B8D0F3-F2D3-4746-BDCB-C72944AA9252
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 7/7/2017
ms.author: dharmeshkakadia

---

# Hive troubleshooting

This article describes resolutions to the most common questions that come up when you're working with with Hive payloads in Apache Ambari.


## How do I export a Hive metastore and import it on another cluster


### Resolution steps

1. Connect to the HDInsight cluster with a Secure Shell (SSH) client. (For more information, see the **Additional reading** section.)

2. Run the following command on the HDInsight cluster from which you want to export the metastore:

```apache
for d in `hive -e "show databases"`; do echo "create database $d; use $d;" >> alltables.sql ; for t in `hive --database $d -e "show tables"` ; do ddl=`hive --database $d -e "show create table $t"`; echo "$ddl ;" >> alltables.sql ; echo "$ddl" | grep -q "PARTITIONED\s*BY" && echo "MSCK REPAIR TABLE $t ;" >> alltables.sql ; done; done
```

This command generates a file named `allatables.sql`.

Copy the file `alltables.sql` to the new HDInsight cluster, and then run the following command:

```apache
hive -f alltables.sql
```

This code assumes that data paths on the new cluster are the same as on the old cluster. If not, you can manually edit the generated  `alltables.sql` file to reflect any changes.

### Additional reading

- [Connect to HDInsight Cluster using SSH](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-linux-use-ssh-unix)


## How do locate Hive logs on a cluster

### Resolution steps

- Connect to the HDInsight cluster with a Secure Shell (SSH) client. (For more information, check the **Additional reading** section).

- Hive client logs can be found at:

```apache
/tmp/<username>/hive.log 
```

- Hive metastore logs can be found at:

```apache
/var/log/hive/hivemetastore.log 
```

- Hiveserver logs can be found at:

```apache
/var/log/hive/hiveserver2.log 
```

### Additional reading

- [Connect to HDInsight Cluster using SSH](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-linux-use-ssh-unix)

## How do I launch Hive shell with specific configurations on a cluster


### Resolution steps

- Specify a configuration key value pair when starting Hive shell. (For more information, see the **Additional Reading** section):

```apache
hive -hiveconf a=b 
```

- List all effective configurations on Hive shell with the following command:

```apache
hive> set;
```

For example, use the following command to start Hive shell with debug logging enabled on the console:
             
```apache
hive -hiveconf hive.root.logger=ALL,console 
```

### Additional reading

- [Hive configuration properties](https://cwiki.apache.org/confluence/display/Hive/Configuration+Properties)


## How do I analyze Tez DAG data on a cluster critical path




### Resolution steps
 
- Connect to the HDInsight cluster with a Secure Shell (SSH) client. (For more information, see the **Additional reading** section.)

- Run the following command at a command prompt:
   
```apache
hadoop jar /usr/hdp/current/tez-client/tez-job-analyzer-*.jar CriticalPath --saveResults --dagId <DagId> --eventFileName <DagData.zip> 
```

- List other analyzers that can be used for analyzing Tez DAG by using the following command:

```apache
hadoop jar /usr/hdp/current/tez-client/tez-job-analyzer-*.jar
```

An example program must be given as the first argument.

Valid program names include:
  - *ContainerReuseAnalyzer*: Print container reuse details in a DAG
  - *CriticalPath*: Find the critical path of a DAG
  - *LocalityAnalyzer*: Print locality details in a DAG
  - *ShuffleTimeAnalyzer*: Analyze the shuffle time details in a DAG
  - *SkewAnalyzer*: Analyze the skew details in a DAG
  - *SlowNodeAnalyzer*: Print node details in a DAG
  - *SlowTaskIdentifier*: Print slow task details in a DAG
  - *SlowestVertexAnalyzer*: Print slowest vertex details in a DAG
  - *SpillAnalyzer*: Print spill details in a DAG
  - *TaskConcurrencyAnalyzer*: Print the task concurrency details in a DAG
  - *VertexLevelCriticalPathAnalyzer*: Find critical path at vertex level in a DAG


### Additional reading

- [Connect to HDInsight Cluster using SSH](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-linux-use-ssh-unix)



## How do I download Tez DAG data from a cluster


#### Resolution steps

There are two ways to collect the Tez DAG data.

- From the command line:
 
    Connect to the HDInsight cluster with a Secure Shell (SSH) client. Run the following command at the command prompt:
   
```apache
hadoop jar /usr/hdp/current/tez-client/tez-history-parser-*.jar org.apache.tez.history.ATSImportTool -downloadDir . -dagId <DagId> 
```

- You can also use the Ambari Tez view:
   
  1. Go to Ambari. 
  2. Go to Tez view (hidden under the tiles icon in the upper-right corner). 
  3. Select the dag that you're interested in.
  4. Select **Download data.**

## Additional reading

[Connect to HDInsight Cluster using SSH](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-linux-use-ssh-unix)







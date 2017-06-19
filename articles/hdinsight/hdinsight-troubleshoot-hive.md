---
title: Answers to common questions on Hive on HDInsight | Microsoft Docs
description: Use the Hive FAQ for answers to common questions on Hive on Azure HDInsight platform.
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
ms.date: 6/8/2017
ms.author: dharmeshkakadia

---

# HIVE troubleshooting

This article describes the top issues and their resolutions for working with HIVE payloads in Apache Ambari.

## How do I export a Hive metastore and import it on another cluster

### Issue:

Need to export Hive metastore and import it on another HDInsight cluster.  

### Resolution Steps: 

1) Connect to the HDInsight cluster with a Secure Shell (SSH) client (check Further Reading section below).

2) Run the following command on the HDInsight cluster where from you want to export the metastore:

```apache
for d in `hive -e "show databases"`; do echo "create database $d; use $d;" >> alltables.sql ; for t in `hive --database $d -e "show tables"` ; do ddl=`hive --database $d -e "show create table $t"`; echo "$ddl ;" >> alltables.sql ; echo "$ddl" | grep -q "PARTITIONED\s*BY" && echo "MSCK REPAIR TABLE $t ;" >> alltables.sql ; done; done
```

This will generate a file named `allatables.sql`.

3) Copy the file `alltables.sql` to the new HDInsight cluster and run the following command:

```apache
hive -f alltables.sql
```

Note: This assumes that data paths on new cluster are same as on old. If not, you can manually edit the generated  
`alltables.sql`  file to reflect any changes.

### Further Reading:

1) [Connect to HDInsight Cluster using SSH](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-linux-use-ssh-unix)


## How do locate Hive logs on a cluster

### Issue:

Need to find the Hive client, metastore and hiveserver logs on HDInsight cluster.  

### Resolution Steps: 

1) Connect to the HDInsight cluster with a Secure Shell (SSH) client (check Further Reading section below).


2) Hive client logs can be found at:

```apache
/tmp/<username>/hive.log 
```

3) Hive metastore logs can be found at:

```apache
/var/log/hive/hivemetastore.log 
```

4) Hiveserver logs can be found at:

```apache
/var/log/hive/hiveserver2.log 
```

### Further Reading:

1) [Connect to HDInsight Cluster using SSH](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-linux-use-ssh-unix)

---

## How do I launch Hive shell with specific configurations on a cluster

### Issue:

Need to override or specify Hive shell configurations at launch time on HDInsight clusters.  

### Resolution Steps: 

1) Specify a configuration key value pair while starting Hive shell (check Further Reading section below):

```apache
hive -hiveconf a=b 
```

2) List all effective configurations on Hive shell with the following command:

```apache
hive> set;
```

For example, use the following command to start hive shell with debug logging enabled on console:
             
```apache
hive -hiveconf hive.root.logger=ALL,console 
```

### Further Reading:

1) [Hive configuration properties](https://cwiki.apache.org/confluence/display/Hive/Configuration+Properties)


## How do I aanalyze Tez DAG data on a cluster critical path

### Issue:

Need to analyze Tez Directed Acyclic Graph (DAG) information particularly the critical path on HDInsight cluster

### Resolution Steps:
 
1) Connect to the HDInsight cluster with a Secure Shell (SSH) client (check Further Reading section below).

2) Run the following command at the command prompt:
   
```apache
hadoop jar /usr/hdp/current/tez-client/tez-job-analyzer-*.jar CriticalPath --saveResults --dagId <DagId> --eventFileName <DagData.zip> 
```

3) List other analyzers that can be used for analyzing Tez DAG with the following command:

```apache
hadoop jar /usr/hdp/current/tez-client/tez-job-analyzer-*.jar
```

An example program must be given as the first argument.

Valid program names are:
  ContainerReuseAnalyzer: Print container reuse details in a DAG
  CriticalPath: Find the critical path of a DAG
  LocalityAnalyzer: Print locality details in a DAG
  ShuffleTimeAnalyzer: Analyze the shuffle time details in a DAG
  SkewAnalyzer: Analyze the skew details in a DAG
  SlowNodeAnalyzer: Print node details in a DAG
  SlowTaskIdentifier: Print slow task details in a DAG
  SlowestVertexAnalyzer: Print slowest vertex details in a DAG
  SpillAnalyzer: Print spill details in a DAG
  TaskConcurrencyAnalyzer: Print the task concurrency details in a DAG
  VertexLevelCriticalPathAnalyzer: Find critical path at vertex level in a DAG


### Further Reading:

1) [Connect to HDInsight Cluster using SSH](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-linux-use-ssh-unix)

---

## How do I download Tez DAG data from a cluster

#### Issue:

Need to download Tez Directed Acyclic Graph (DAG) information from HDInsight cluster.

#### Resolution Steps:

There are two ways to collect the Tez DAG data.

1) From commandline:
 
1.1) Connect to the HDInsight cluster with a Secure Shell (SSH) client (check Further Reading section below).

1.2) Run the following command at the command prompt:
   
```apache
hadoop jar /usr/hdp/current/tez-client/tez-history-parser-*.jar org.apache.tez.history.ATSImportTool -downloadDir . -dagId <DagId> 
```

2) From Ambari Tez view:
   
Go to Ambari --> Go to Tez view (hidden under tiles icon in upper right corner) --> Click on the dag you are interested in --> Click on Download data.

#### Further Reading:

1) [Connect to HDInsight Cluster using SSH](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-linux-use-ssh-unix)








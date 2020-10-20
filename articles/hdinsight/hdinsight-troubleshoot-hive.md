---
title: Troubleshoot Hive by using Azure HDInsight 
description: Get answers to common questions about working with Apache Hive and Azure HDInsight.
keywords: Azure HDInsight, Hive, FAQ, troubleshooting guide, common questions
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.topic: troubleshooting
ms.date: 08/15/2019
---

# Troubleshoot Apache Hive by using Azure HDInsight

Learn about the top questions and their resolutions when working with Apache Hive payloads in Apache Ambari.

## How do I export a Hive metastore and import it on another cluster?

### Resolution steps

1. Connect to the HDInsight cluster by using a Secure Shell (SSH) client. For more information, see [Additional reading](#additional-reading-end).

2. Run the following command on the HDInsight cluster from which you want to export the metastore:

    ```apache
    for d in `hive -e "show databases"`; do echo "create database $d; use $d;" >> alltables.sql ; for t in `hive --database $d -e "show tables"` ; do ddl=`hive --database $d -e "show create table $t"`; echo "$ddl ;" >> alltables.sql ; echo "$ddl" | grep -q "PARTITIONED\s*BY" && echo "MSCK REPAIR TABLE $t ;" >> alltables.sql ; done; done
    ```

   This command generates a file named allatables.sql.

3. Copy the file alltables.sql to the new HDInsight cluster, and then run the following command:

    ```apache
    hive -f alltables.sql
    ```

The code in the resolution steps assumes that data paths on the new cluster are the same as the data paths on the old cluster. If the data paths are different, you can manually edit the generated `alltables.sql` file to reflect any changes.

### Additional reading

- [Connect to an HDInsight cluster by using SSH](hdinsight-hadoop-linux-use-ssh-unix.md)

## How do I locate Hive logs on a cluster?

### Resolution steps

1. Connect to the HDInsight cluster by using SSH. For more information, see **Additional reading**.

2. To view Hive client logs, use the following command:

   ```apache
   /tmp/<username>/hive.log
   ```

3. To view Hive metastore logs, use the following command:

   ```apache
   /var/log/hive/hivemetastore.log
   ```

4. To view Hive server logs, use the following command:

   ```apache
   /var/log/hive/hiveserver2.log
   ```

### Additional reading

- [Connect to an HDInsight cluster by using SSH](hdinsight-hadoop-linux-use-ssh-unix.md)

## How do I launch the Hive shell with specific configurations on a cluster?

### Resolution steps

1. Specify a configuration key-value pair when you start the Hive shell. For more information, see [Additional reading](#additional-reading-end).

   ```apache
   hive -hiveconf a=b
   ```

2. To list all effective configurations on Hive shell, use the following command:

   ```apache
   hive> set;
   ```

   For example, use the following command to start Hive shell with debug logging enabled on the console:

   ```apache
   hive -hiveconf hive.root.logger=ALL,console
   ```

### Additional reading

- [Hive configuration properties](https://cwiki.apache.org/confluence/display/Hive/Configuration+Properties)

## <a name="how-do-i-analyze-tez-dag-data-on-a-cluster-critical-path"></a>How do I analyze Apache Tez DAG data on a cluster-critical path?

### Resolution steps

1. To analyze an Apache Tez directed acyclic graph (DAG) on a cluster-critical graph, connect to the HDInsight cluster by using SSH. For more information, see [Additional reading](#additional-reading-end).

2. At a command prompt, run the following command:

   ```apache
   hadoop jar /usr/hdp/current/tez-client/tez-job-analyzer-*.jar CriticalPath --saveResults --dagId <DagId> --eventFileName <DagData.zip> 
   ```

3. To list other analyzers that can be used to analyze Tez DAG, use the following command:

   ```apache
   hadoop jar /usr/hdp/current/tez-client/tez-job-analyzer-*.jar
   ```

   You must provide an example program as the first argument.

   Valid program names include:
    - **ContainerReuseAnalyzer**: Print container reuse details in a DAG
    - **CriticalPath**: Find the critical path of a DAG
    - **LocalityAnalyzer**: Print locality details in a DAG
    - **ShuffleTimeAnalyzer**: Analyze the shuffle time details in a DAG
    - **SkewAnalyzer**: Analyze the skew details in a DAG
    - **SlowNodeAnalyzer**: Print node details in a DAG
    - **SlowTaskIdentifier**: Print slow task details in a DAG
    - **SlowestVertexAnalyzer**: Print slowest vertex details in a DAG
    - **SpillAnalyzer**: Print spill details in a DAG
    - **TaskConcurrencyAnalyzer**: Print the task concurrency details in a DAG
    - **VertexLevelCriticalPathAnalyzer**: Find the critical path at vertex level in a DAG

### Additional reading

- [Connect to an HDInsight cluster by using SSH](hdinsight-hadoop-linux-use-ssh-unix.md)

## How do I download Tez DAG data from a cluster?

#### Resolution steps

There are two ways to collect the Tez DAG data:

- From the command line:

    Connect to the HDInsight cluster by using SSH. At the command prompt, run the following command:

  ```apache
  hadoop jar /usr/hdp/current/tez-client/tez-history-parser-*.jar org.apache.tez.history.ATSImportTool -downloadDir . -dagId <DagId>
  ```

- Use the Ambari Tez view:

  1. Go to Ambari.
  2. Go to Tez view (under the tiles icon in the upper-right corner).
  3. Select the DAG you want to view.
  4. Select **Download data**.

### <a name="additional-reading-end"></a>Additional reading

[Connect to an HDInsight cluster by using SSH](hdinsight-hadoop-linux-use-ssh-unix.md)

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

- Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

- Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

- If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).

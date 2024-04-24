---
title: Monitoring data reference for Azure HDInsight
description: This article contains important reference material you need when you monitor Azure HDInsight.
ms.date: 03/21/2024
ms.custom: horz-monitor
ms.topic: reference
ms.service: hdinsight
---

# Azure HDInsight monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor HDInsight](monitor-hdinsight.md) for details on the data you can collect for Azure HDInsight and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.HDInsight/clusters
The following table lists the metrics available for the Microsoft.HDInsight/clusters resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.HDInsight/clusters](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-hdinsight-clusters-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

Dimensions for the Microsoft.HDInsight/clusters table include:

- HttpStatus
- Machine
- Topic
- MetricName

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

HDInsight doesn't use Azure Monitor resource logs or diagnostic settings. Logs are collected by other methods, including the use of the Log Analytics agent.

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### HDInsight Clusters
Microsoft.HDInsight/Clusters

The available logs and metrics vary depending on your HDInsight cluster type.

- [HDInsightAmbariClusterAlerts](/azure/azure-monitor/reference/tables/hdinsightambariclusteralerts#columns)
- [HDInsightAmbariSystemMetrics](/azure/azure-monitor/reference/tables/hdinsightambarisystemmetrics#columns)
- [HDInsightGatewayAuditLogs](/azure/azure-monitor/reference/tables/hdinsightgatewayauditlogs#columns)
- [HDInsightHBaseLogs](/azure/azure-monitor/reference/tables/hdinsighthbaselogs#columns)
- [HDInsightHBaseMetrics](/azure/azure-monitor/reference/tables/hdinsighthbasemetrics#columns)
- [HDInsightHadoopAndYarnLogs](/azure/azure-monitor/reference/tables/hdinsighthadoopandyarnlogs#columns)
- [HDInsightHadoopAndYarnMetrics](/azure/azure-monitor/reference/tables/hdinsighthadoopandyarnmetrics#columns)
- [HDInsightHiveAndLLAPLogs](/azure/azure-monitor/reference/tables/hdinsighthiveandllaplogs#columns)
- [HDInsightHiveAndLLAPMetrics](/azure/azure-monitor/reference/tables/hdinsighthiveandllapmetrics#columns)
- [HDInsightHiveQueryAppStats](/azure/azure-monitor/reference/tables/hdinsighthivequeryappstats#columns)
- [HDInsightHiveTezAppStats](/azure/azure-monitor/reference/tables/hdinsighthivetezappstats#columns)
- [HDInsightJupyterNotebookEvents](/azure/azure-monitor/reference/tables/hdinsightjupyternotebookevents#columns)
- [HDInsightKafkaLogs](/azure/azure-monitor/reference/tables/hdinsightkafkalogs#columns)
- [HDInsightKafkaMetrics](/azure/azure-monitor/reference/tables/hdinsightkafkametrics#columns)
- [HDInsightKafkaServerLog](/azure/azure-monitor/reference/tables/hdinsightkafkaserverlog#columns)
- [HDInsightOozieLogs](/azure/azure-monitor/reference/tables/hdinsightoozielogs#columns)
- [HDInsightRangerAuditLogs](/azure/azure-monitor/reference/tables/hdinsightrangerauditlogs#columns)
- [HDInsightSecurityLogs](/azure/azure-monitor/reference/tables/hdinsightsecuritylogs#columns)
- [HDInsightSparkApplicationEvents](/azure/azure-monitor/reference/tables/hdinsightsparkapplicationevents#columns)
- [HDInsightSparkBlockManagerEvents](/azure/azure-monitor/reference/tables/hdinsightsparkblockmanagerevents#columns)
- [HDInsightSparkEnvironmentEvents](/azure/azure-monitor/reference/tables/hdinsightsparkenvironmentevents#columns)
- [HDInsightSparkExecutorEvents](/azure/azure-monitor/reference/tables/hdinsightsparkexecutorevents#columns)
- [HDInsightSparkExtraEvents](/azure/azure-monitor/reference/tables/hdinsightsparkextraevents#columns)
- [HDInsightSparkJobEvents](/azure/azure-monitor/reference/tables/hdinsightsparkjobevents#columns)
- [HDInsightSparkLogs](/azure/azure-monitor/reference/tables/hdinsightsparklogs#columns)
- [HDInsightSparkSQLExecutionEvents](/azure/azure-monitor/reference/tables/hdinsightsparksqlexecutionevents#columns)
- [HDInsightSparkStageEvents](/azure/azure-monitor/reference/tables/hdinsightsparkstageevents#columns)
- [HDInsightSparkStageTaskAccumulables](/azure/azure-monitor/reference/tables/hdinsightsparkstagetaskaccumulables#columns)
- [HDInsightSparkTaskEvents](/azure/azure-monitor/reference/tables/hdinsightsparktaskevents#columns)
- [HDInsightStormLogs](/azure/azure-monitor/reference/tables/hdinsightstormlogs#columns)
- [HDInsightStormMetrics](/azure/azure-monitor/reference/tables/hdinsightstormmetrics#columns)
- [HDInsightStormTopologyMetrics](/azure/azure-monitor/reference/tables/hdinsightstormtopologymetrics#columns)

## Log table mapping

The new Azure Monitor integration implements new tables in the Log Analytics workspace. The following tables show the log table mappings from the classic Azure Monitor integration to the new one.

The **New table** column shows the name of the new table. The **Description** row describes the type of logs/metrics that are available in this table. The **Classic table** column is a list of all the tables from the classic Azure Monitor integration whose data is now present in the new table.

> [!NOTE]
> Some tables are completely new and not based on previous tables.

### General workload tables

| New table | Description | Classic table |
| --- | --- | --- |
| HDInsightAmbariSystemMetrics | System metrics collected from Ambari. The metrics now come from each node in the cluster (except for edge nodes) instead of just the two headnodes. Each metric is now a column and each metric is reported once per record. | metrics\_cpu\_nice\_cl, metrics\_cpu\_system\_cl, metrics\_cpu\_user\_cl, metrics\_memory\_cache\_CL, metrics\_memory\_swap\_CL, metrics\_memory\_total\_CLmetrics\_memory\_buffer\_CL, metrics\_load\_1min\_CL, metrics\_load\_cpu\_CL, metrics\_load\_nodes\_CL, metrics\_load\_procs\_CL, metrics\_network\_in\_CL, metrics\_network\_out\_CL |
| HDInsightAmbariClusterAlerts | Ambari Cluster Alerts from each node in the cluster (except for edge nodes). Each alert is a record in this table. | metrics\_cluster\_alerts\_CL |
| HDInsightSecurityLogs | Records from the Ambari Audit and Auth Logs. | log\_ambari\_audit\_CL, log\_auth\_CL |
| HDInsightRangerAuditLogs | All records from the Ranger Audit log for ESP clusters. | ranger\_audit\_logs\_CL |
| HDInsightGatewayAuditLogs\_CL | The Gateway nodes audit information. Same format as the classic table, and still located in the Custom Logs section. | log\_gateway\_Audit\_CL |

### Spark workload

> [!NOTE]
> Spark application related tables have been replaced with 11 new Spark tables that give more in-depth information about your Spark workloads.

| New table | Description | Classic table |
| --- | --- | --- |
| HDInsightSparkLogs | All logs related to Spark and its related component: Livy and Jupyter. | log\_livy\_CL, log\_jupyter\_CL, log\_spark\_CL, log\_sparkappsexecutors\_CL, log\_sparkappsdrivers\_CL |
| HDInsightSparkApplicationEvents | Event information for Spark Applications including Submission and Completion time, App ID, and AppName. Useful for keeping track of when applications started and completed.  |
| HDInsightSparkBlockManagerEvents | Event information related to Spark's Block Manager. Includes information such as executor memory usage. |
| HDInsightSparkEnvironmentEvents | Event information related to the Environment an application executes in including, Spark Deploy Mode, Master, and information about the Executor. |
| HDInsightSparkExecutorEvents | Event information about the Spark Executor usage for by an Application. |
| HDInsightSparkExtraEvents | Event information that doesn't fit into any other Spark table.  |
| HDInsightSparkJobEvents | Information about Spark Jobs including their start and end times, result, and associated stages. |
| HDInsightSparkSqlExecutionEvents | Event information on Spark SQL Queries including their plan info and description and start and end times. |
| HDInsightSparkStageEvents | Event information for Spark Stages including their start and completion times, failure status, and detailed execution information. |
| HDInsightSparkStageTaskAccumulables | Performance metrics for stages and tasks. |
| HDInsightTaskEvents | Event information for Spark Tasks including start and completion time, associated stages, execution status, and task type. |
| HDInsightJupyterNotebookEvents | Event information for Jupyter Notebooks. |

### Hadoop/YARN workload

| New table | Description | Classic table |
| --- | --- | --- |
| HDInsightHadoopAndYarnMetrics | JMX metrics from the Hadoop and YARN frameworks. Contains all the same JMX metrics as the previous Custom Logs tables, plus more important metrics: Timeline Server, Node Manager, and Job History Server. Contains one metric per record. | metrics\_resourcemanager\_clustermetrics\_CL, metrics\_resourcemanager\_jvm\_CL, metrics\_resourcemanager\_queue\_root\_CL, metrics\_resourcemanager\_queue\_root\_joblauncher\_CL, metrics\_resourcemanager\_queue\_root\_default\_CL, metrics\_resourcemanager\_queue\_root\_thriftsvr\_CL |
| HDInsightHadoopAndYarnLogs | All logs generated from the Hadoop and YARN frameworks. | log\_mrjobsummary\_CL, log\_resourcemanager\_CL, log\_timelineserver\_CL, log\_nodemanager\_CL |

### Hive/LLAP workload 

| New table | Description | Classic table |
| --- | --- | --- |
| HDInsightHiveAndLLAPMetrics | JMX metrics from the Hive and LLAP frameworks. Contains all the same JMX metrics as the previous Custom Logs tables, one metric per record. | llap\_metrics\_hiveserver2\_CL, llap\_metrics\_hs2\_metrics\_subsystemllap\_metrics\_jvm\_CL, llap\_metrics\_llap\_daemon\_info\_CL, llap\_metrics\_buddy\_allocator\_info\_CL, llap\_metrics\_deamon\_jvm\_CL, llap\_metrics\_io\_CL, llap\_metrics\_executor\_metrics\_CL, llap\_metrics\_metricssystem\_stats\_CL, llap\_metrics\_cache\_CL |
| HDInsightHiveAndLLAPLogs | Logs generated from Hive, LLAP, and their related components: WebHCat and Zeppelin. | log\_hivemetastore\_CL log\_hiveserver2\_CL, log\_hiveserve2interactive\_CL, log\_webhcat\_CL, log\_zeppelin\_zeppelin\_CL |

### Kafka workload

| New table | Description | Classic table |
| --- | --- | --- |
| HDInsightKafkaMetrics | JMX metrics from Kafka. Contains all the same JMX metrics as the old Custom Logs tables, plus other important metrics. One metric per record. | metrics\_kafka\_CL |
| HDInsightKafkaLogs | All logs generated from the Kafka Brokers. | log\_kafkaserver\_CL, log\_kafkacontroller\_CL |

### HBase workload

| New table | Description | Classic table |
| --- | --- | --- |
| HDInsightHBaseMetrics | JMX metrics from HBase. Contains all the same JMX metrics from the previous tables. In contrast with the previous tables, each row contains one metric. | metrics\_regionserver\_CL, metrics\_regionserver\_wal\_CL, metrics\_regionserver\_ipc\_CL, metrics\_regionserver\_os\_CL, metrics\_regionserver\_replication\_CL, metrics\_restserver\_CL, metrics\_restserver\_jvm\_CL, metrics\_hmaster\_assignmentmanager\_CL, metrics\_hmaster\_ipc\_CL, metrics\_hmaser\_os\_CL, metrics\_hmaster\_balancer\_CL, metrics\_hmaster\_jvm\_CL, metrics\_hmaster\_CL, metrics\_hmaster\_fs\_CL |
| HDInsightHBaseLogs | Logs from HBase and its related components: Phoenix and HDFS. | log\_regionserver\_CL, log\_restserver\_CL, log\_phoenixserver\_CL, log\_hmaster\_CL, log\_hdfsnamenode\_CL, log\_garbage\_collector\_CL |

### Oozie workload

| New table | Description | Classic table |
| --- | --- | --- |
| HDInsightOozieLogs | All logs generated from the Oozie framework. | Log\_oozie\_CL |

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.HDInsight resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsofthdinsight)

## Related content

- See [Monitor HDInsight](monitor-hdinsight.md) for a description of monitoring HDInsight.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.

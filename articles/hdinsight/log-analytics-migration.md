---
title: Migrate Log Analytics data for Azure HDInsight 
description: Learn about the changes to the Azure Monitor integration and best-practices for using the new tables. 
ms.service: hdinsight
ms.topic: how-to
ms.author: sairamyeturi
author: yeturis
ms.date: 03/21/2023
---

# Log Analytics migration guide for Azure HDInsight clusters

 Azure HDInsight is an enterprise-ready, managed-cluster service. This service runs open-source analytics frameworks like Apache Spark, Hadoop, HBase, and Kafka on Azure. Azure HDInsight has integrated with other Azure services to enable customers to better manage their big data analytics applications.

Log Analytics provides a tool in the Azure portal to edit and run log queries. The queries come from data collected by Azure Monitor Logs and interactively analyze their results. Customers can use Log Analytics queries to retrieve records that match specific criteria. They can also use queries to identify trends, analyze patterns, and provide insights into their data.

Azure HDInsight enabled integration with Log Analytics in 2017. HDInsight customers quickly adopted this feature to monitor their HDInsight clusters and query the logs in the clusters. While adoption of this feature has increased, customers have provided feedback about the integration:

- Customers can't decide which logs to store, and storing all the logs can become expensive.
- Current HDInsight schemas logs aren't following consistent naming conventions and some tables are repetitive.
- Customers want an out-of-box dashboard to easily monitor the KPI of their HDInsight clusters.
- Customers must jump to Log Analytics to run simple queries.

## Solution overview

Considering customer feedback, the Azure HDInsight team invested in integration with Azure Monitor. This integration enables:

- A new set of tables in customers' Log Analytics workspace. The new tables are delivered through a new Log Analytics pipeline.
- Higher reliability
- Faster log delivery
- Resource-based table grouping and default queries

> [!NOTE]  
> New Azure Montitor integration is in Public Preview across all regions where HDInsight is available.


## Benefits of the new Azure Monitor integration

This document outlines the changes to the Azure Monitor integration and provides best-practices for using the new tables.

**Redesigned schemas**: The schema formatting for the new Azure Monitor integration is better organized and easy to understand. There are two-thirds fewer schemas to remove as much ambiguity in the legacy schemas as possible.

**Selective Logging**: There are logs and metrics available through Log Analytics. To help you save on monitoring costs, we'll be releasing a new selective logging feature. Use this feature to turn on and off different logs and metric sources. With this feature, you'll only have to pay for what you use. For more details see [Selective Logging](selective-logging-analysis.md)

**Logs cluster portal integration**: The **Logs** pane is new to the HDInsight Cluster portal. Anyone with access to the cluster can go to this pane to query any table that the cluster resource sends records to. Users don't need access to the Log Analytics workspace anymore to see the records for a specific cluster resource.

**Insights cluster portal integration**: The **Insights** pane is also new to the HDInsight Cluster portal. After enabling the new Azure Monitor integration, you can select the **Insights** pane and an out-of-box logs and metrics dashboard specific to the cluster's type will automatically populate for you. These dashboards have been revamped from our previous Azure solutions. They give you deep insights into your cluster's performance and health.

## Customer scenarios

The following sections describe how customers can use the new Azure Monitor integration in different scenarios. The [Activate a new Azure Monitor integration](#activate-a-new-azure-monitor-integration) section outlines how to activate and use the new Azure Monitor integration. The [Migrating from Azure Monitor Classic to the new Azure Monitor Integration](#migrate-to-the-new-azure-monitor-integration) section includes additional information for users that depend on the old Azure Monitor integration.

> [!NOTE]
> Only clusters created in late-September 2020 and after are eligible for the new Azure Monitoring integration.

## Activate a new Azure Monitor integration 

> [!NOTE]
> You must have a Log Analytics workspace created in a subscription you have access to before doing enabling the new integration. For more information about how to create a Log Analytics workspace, see [Create a Log Analytics workspace in the Azure portal](../azure-monitor/logs/quick-create-workspace.md).

Activate the new integration by going to your cluster's portal page and scrolling down the menu on the left until you reach the **Monitoring** section. In the **Monitoring** section, select **Monitor integration**. Then, select **Enable** and you can choose the Log Analytics workspace that you want your logs to be sent to. Select **Save** once you have chosen your workspace. 

### Access the new tables

There are two ways you can access the new tables. 

### Approach 1:
The first way to access the new tables is through the Log Analytics workspace. 

1. Go to the Log Analytics workspace that you selected when you enabled the integration. 
2. Scroll down in the menu on the left side of the screen and select **Logs**. A Logs query editor will pop up with a list of all the tables in the workspace. 
3. If the tables are grouped by **Solution**, the new HDI tables are under the **Logs Management** section. 
4. If you group the tables by **Resource Type**, the tables are under the **HDInsight Clusters** section as shown in the image below. 

> [!NOTE]
> This process describes how the logs were accessed in the old integration. This requires the user to have access to the workspace.

### Approach 2:

The second way to access the new tables is through Cluster portal access.
 
1. Navigate to your Cluster's portal page and scroll down the menu on the left side until you see the **Monitoring** section. In this section, you'll see the **Logs** pane. 
2. Select **Logs** and a Logs query editor appears. The editor contains all logs that are associated with the cluster resource. You sent the logs to the Log Analytics workspace when you enabled integration. These logs provide resource-based access (RBAC). With RBAC, users who have access to the cluster but not to the workspace can see the logs that are associated with the cluster.

For comparison, the following screenshots show the legacy integration workspace view and the new integration workspace view:

**Legacy integration workspace view**

  :::image type="content" source="./media/log-analytics-migration/legacy-integration-workspace-view.png"  lightbox="./media/log-analytics-migration/legacy-integration-workspace-view.png" alt-text="Screenshot that shows the legacy integration workspace view." border="false":::

**New integration workspace view**

  :::image type="content" source="./media/log-analytics-migration/new-integration-workspace-view.png" lightbox="./media/log-analytics-migration/new-integration-workspace-view.png" alt-text="Screenshot that shows the new integration workspace view." border="false":::

### Use the new tables

These integrations can help you use the new tables:

#### Default queries to use with new tables

In your Logs query editor, set the toggle to **Queries** above the tables list. Make sure that you group the queries by **Resource Type** and that there's no filter set for a resource type other than **HDInsight Clusters**. The following image shows how the results look when grouped by **Resource Type** and filtered for **HDInsight Clusters**. Just select one and it appears in the Logs query editor. Be sure to read the comments included in the queries, as some require you to enter some information, like your cluster name, for the query to run successfully.

:::image type="content" source="./media/log-analytics-migration/default-query-results-grouped-resource-type.png" alt-text="Screenshot that shows the default query results grouped resource type." border="true":::


#### Create your own queries

You can enter your own queries in the Logs query editor. Queries used on the old tables won't be valid on the new tables as many of the new tables have new, refined schemas. The default queries are great references for shaping queries on the new tables.

#### Insights

Insights are cluster-specific visualization dashboards made using [Azure Workbooks](../azure-monitor/visualize/workbooks-overview.md). These dashboards give you detailed graphs and visualizations of how your cluster is running. The dashboards have sections for each cluster type, YARN, system metrics, and component logs. You can access your cluster's dashboard by visiting your cluster's page in the portal, scrolling down to the **Monitoring** section, and selecting the **Insights** pane. The dashboard loads automatically if you've enabled the new integration. Allow a few seconds for the graphs to load as they query the logs.

:::image type="content" source="./media/log-analytics-migration/visualization-dashboard.png" lightbox="./media/log-analytics-migration/visualization-dashboard.png" alt-text="Screenshot that shows the visualization dashboard.":::

#### Custom Azure workbooks

You can create your own Azure workbooks with custom graphs and visualizations. In your cluster's portal page, scroll down to the **Monitoring** section and select the **Workbooks** pane in the menu on the left. You can either start using a blank template or use one of the templates under the **HDInsight Clusters** section. There's a template for each cluster type. Templates are useful if you want to save specific customizations that the default HDInsight Insights don't provide. Feel free to send in requests for new features in the HDInsight Insights if you feel they're lacking something.

#### Alerts

You can add custom alerts to your clusters and workspaces in the Log query editor. Go to the Logs query editor by selecting the **Logs** pane from either your cluster or workspace portal. Run a query and then select **New Alert Rule** as shown in the following screenshot. For more information, read about [configuring alerts](../azure-monitor/alerts/alerts-log.md).

:::image type="content" source="./media/log-analytics-migration/new-rule-alert.png" alt-text="Screenshot that shows the new rule alert." border="false":::

## Migrate to the new Azure Monitor Integration

If you're using the classic Azure Monitor integration, you need to make some adjustments to the new table formats after you switch to the new Azure Monitor integration.

To enable the new Azure Monitor integration, follow the steps outlined in the [Activate a new Azure Monitor integration](#activate-a-new-azure-monitor-integration) section.

### Run queries in Log Analytics

Since the new table format is different from the previous one, your queries need to be reworked so you can use our new tables. Once you enable the new Azure Monitor integration, you can browse the tables and schemas to identify the fields that are used in your old queries.

We provide a [mapping table](#appendix-table-mapping) between the old table to the new table to help you quickly find the new fields you need to use to migrate your dashboards and queries.

**Default queries**: We created default queries that show how to use the new tables for common situations. The default queries also show what information is available in each table. You can access the default queries by following the instructions in the [Default queries to use with new tables](#default-queries-to-use-with-new-tables) section in this article.

### Update dashboards for HDInsight clusters

If you have built multiple dashboards to monitor your HDInsight clusters, you need to adjust the query behind the table once you enable the new Azure Monitor integration. The table name or the field name might change in the new integration, but all the information you have in old integration is included.

Refer to the [mapping table](#appendix-table-mapping) between the old table/schema to the new table/schema to update the query behind the dashboards.

#### Out-of-box dashboards 

We also improved the out-of-box dashboards both at the cluster-level. There's a button on the top right of every graph that allows you to see the underlying query that produces the information. The graph is a great way to familiarize yourself with how the new tables can be queried effectively. 

## Enable both integrations to accelerate the migration

You can activate both the classic and the new Azure Monitor integrations at the same time on a cluster that is eligible for both integrations to migrate to the new Azure Monitor integration quickly. The new integration is available for all clusters created after mid-September 2020.

In this way, you can easily do a side-by-side comparison for the queries you're using.

### Enabling the classic integration

If you're using a cluster created after mid-September 2020, you'll see the new portal experience in your cluster's portal. To enable the new pipeline, you can follow the steps outlined in the [Activate a new Azure Monitor integration](#activate-a-new-azure-monitor-integration) section. To activate the classic integration on this cluster, go to your cluster's portal page. Select the **Monitor integration** pane in the **Monitoring** section of the menu on the left side of your cluster portal page. Select **Configure Azure Monitor for HDInsight clusters integration (classic)**. A side context appears with a toggle you can use to enable and disable the classic Azure Monitoring integration. 

> [!NOTE]
> You won't see any logs or metrics from the classic integration through your Cluster portal's logs and Insights page. Only the new integrations logs and metrics will be present in those locations.

   :::image type="content" source="./media/log-analytics-migration/hdinsight-classic-integration.png" alt-text="Screenshot that shows the link to access the classic integration." border="false":::

Creating new clusters with classic Azure Monitor integration is not available after Jan 1, 2023.

## Release and support timeline

- Classic Azure Monitoring integration will be unavailable after October 15, 2021. You can't enable classic Azure Monitoring integration after that date.
- Existing classic Azure monitoring integrations will continue to work. There will be limited support for the classic Azure Monitoring integration. 
  - Issues will be investigated once customers submit the support ticket.
  - If solution requires image change, customers should move to the new integration.
  - We won't patch the classic Azure Monitoring integration clusters except for critical security issues.

## Appendix: Table mapping

The following charts show the table mappings from the classic Azure Monitoring Integration to our new one. The **Workload** column describes which workload each table is associated with. The **New Table** row shows the name of the new table. The **Description** row describes the type of logs/metrics that will be available in this table. The **Old Table** row is a list of all the tables from the classic Azure Monitor integration whose data will now be present in the table listed in the **New Table** row.

> [!NOTE]
> Some tables are new and not based off of old tables.

## General workload tables

| New Table | Details |
| --- | --- |
| HDInsightAmbariSystemMetrics | <ul><li>**Description**: This table contains system metrics collected from Ambari. The metrics now come from each node in the cluster (except for edge nodes) instead of just the two headnodes. Each metric is now a column and each metric is reported once per record.</li><li>**Old table**: metrics\_cpu\_nice\_cl, metrics\_cpu\_system\_cl, metrics\_cpu\_user\_cl, metrics\_memory\_cache\_CL, metrics\_memory\_swap\_CL, metrics\_memory\_total\_CLmetrics\_memory\_buffer\_CL, metrics\_load\_1min\_CL, metrics\_load\_cpu\_CL, metrics\_load\_nodes\_CL, metrics\_load\_procs\_CL, metrics\_network\_in\_CL, metrics\_network\_out\_CL</li></ul>|
| HDInsightAmbariClusterAlerts | <ul><li>**Description**: This table contains Ambari Cluster Alerts from each node in the cluster (except for edge nodes). Each alert is a record in this table.</li><li>**Old table**: metrics\_cluster\_alerts\_CL</li></ul>|
| HDInsightSecurityLogs | <ul><li>**Description**: This table contains records from the Ambari Audit and Auth Logs.</li><li>**Old table**: log\_ambari\_audit\_CL, log\_auth\_CL</li></ul>|
| HDInsightRangerAuditLogs | <ul><li>**Description**: This table contains all records from the Ranger Audit log for ESP clusters.</li><li>**Old table**: ranger\_audit\_logs\_CL</li></ul>|
| HDInsightGatewayAuditLogs\_CL | <ul><li>**Description**: This table contains the Gateway nodes audit information. It is the same format as the table in Old Tables column. **It is still located in the Custom Logs section.**</li><li>**Old table**: log\_gateway\_Audit\_CL</li></ul>|

## Spark workload

> [!NOTE]
> Spark application related tables have been replaced with 11 new Spark tables (starting with HDInsightSpark*) that will give more in depth information about your Spark workloads.


| New Table | Details |
| --- | --- |
| HDInsightSparkLogs | <ul><li>**Description**: This table contains all logs related to Spark and its related component: Livy and Jupyter.</li><li>**Old table**: log\_livy,\_CL, log\_jupyter\_CL, log\_spark\_CL, log\_sparkappsexecutors\_CL, log\_sparkappsdrivers\_CL</li></ul>|
| HDInsightSparkApplicationEvents | <ul><li>**Description**: This table contains event information for Spark Applications including Submission and Completion time, App ID, and AppName. It's useful for keeping track of when applications started and completed. </li></ul>|
| HDInsightSparkBlockManagerEvents | <ul><li>**Description**: This table contains event information related to Spark's Block Manager. It includes information such as executor memory usage.</li></ul>|
| HDInsightSparkEnvironmentEvents | <ul><li>**Description**: This table contains event information related to the Environment an application executes in including, Spark Deploy Mode, Master, and information about the Executor.</li></ul>|
| HDInsightSparkExecutorEvents | <ul><li>**Description**: This table contains event information about the Spark Executor usage for by an Application.</li></ul>|
| HDInsightSparkExtraEvents | <ul><li>**Description**: This table contains event information that doesn't fit into any other Spark table. </li></ul>|
| HDInsightSparkJobEvents | <ul><li>**Description**: This table contains information about Spark Jobs including their start and end times, result, and associated stages.</li></ul>|
| HDInsightSparkSqlExecutionEvents | <ul><li>**Description**: This table contains event information on Spark SQL Queries including their plan info and description and start and end times.</li></ul>|
| HDInsightSparkStageEvents | <ul><li>**Description**: This table contains event information for Spark Stages including their start and completion times, failure status, and detailed execution information.</li></ul>|
| HDInsightSparkStageTaskAccumulables | <ul><li>**Description**: This table contains performance metrics for stages and tasks.</li></ul>|
| HDInsightTaskEvents | <ul><li>**Description**: This table contains event information for Spark Tasks including start and completion time, associated stages, execution status, and task type.</li></ul>|
| HDInsightJupyterNotebookEvents | <ul><li>**Description**: This table contains event information for Jupyter Notebooks.</li></ul>|

## Hadoop/YARN workload

| New Table | Details |
| --- | --- |
| HDInsightHadoopAndYarnMetrics | <ul><li>**Description**: This table contains JMX metrics from the Hadoop and YARN frameworks. It contains all the same JMX metrics as the old Custom Logs tables, plus more metrics we considered important. We added Timeline Server, Node Manager, and Job History Server metrics. It contains one metric per record.</li><li>**Old table**: metrics\_resourcemanager\_clustermetrics\_CL, metrics\_resourcemanager\_jvm\_CL, metrics\_resourcemanager\_queue\_root\_CL, metrics\_resourcemanager\_queue\_root\_joblauncher\_CL, metrics\_resourcemanager\_queue\_root\_default\_CL, metrics\_resourcemanager\_queue\_root\_thriftsvr\_CL</li></ul>|
| HDInsightHadoopAndYarnLogs | <ul><li>**Description**: This table contains all logs generated from the Hadoop and YARN frameworks.</li><li>**Old table**: log\_mrjobsummary\_CL, log\_resourcemanager\_CL, log\_timelineserver\_CL, log\_nodemanager\_CL</li></ul>|

 
## Hive/LLAP workload 

| New Table | Details |
| --- | --- |
| HDInsightHiveAndLLAPMetrics | <ul><li>**Description**: This table contains JMX metrics from the Hive and LLAP frameworks. It contains all the same JMX metrics as the old Custom Logs tables. It contains one metric per record.</li><li>**Old table**: llap\_metrics\_hiveserver2\_CL, llap\_metrics\_hs2\_metrics\_subsystemllap\_metrics\_jvm\_CL, llap\_metrics\_llap\_daemon\_info\_CL, llap\_metrics\_buddy\_allocator\_info\_CL, llap\_metrics\_deamon\_jvm\_CL, llap\_metrics\_io\_CL, llap\_metrics\_executor\_metrics\_CL, llap\_metrics\_metricssystem\_stats\_CL, llap\_metrics\_cache\_CL</li></ul>|
| HDInsightHiveAndLLAPLogs | <ul><li>**Description**: This table contains logs generated from Hive, LLAP, and their related components: WebHCat and Zeppelin.</li><li>**Old table**: log\_hivemetastore\_CL log\_hiveserver2\_CL, log\_hiveserve2interactive\_CL, log\_webhcat\_CL, log\_zeppelin\_zeppelin\_CL</li></ul>|


## Kafka workload

| New Table | Details |
| --- | --- |
| HDInsightKafkaMetrics | <ul><li>**Description**: This table contains JMX metrics from Kafka. It contains all the same JMX metrics as the old Custom Logs tables, plus more metrics we considered important. It contains one metric per record.</li><li>**Old table**: metrics\_kafka\_CL</li></ul>|
| HDInsightKafkaLogs | <ul><li>**Description**: This table contains all logs generated from the Kafka Brokers.</li><li>**Old table**: log\_kafkaserver\_CL, log\_kafkacontroller\_CL</li></ul>|

## HBase workload

| New Table | Details |
| --- | --- |
| HDInsightHBaseMetrics | <ul><li>**Description**: This table contains JMX metrics from HBase. It contains all the same JMX metrics from the tables listed in the Old Schema column. In contrast from the old tables, each row contains one metric.</li><li>**Old table**: metrics\_regionserver\_CL, metrics\_regionserver\_wal\_CL, metrics\_regionserver\_ipc\_CL, metrics\_regionserver\_os\_CL, metrics\_regionserver\_replication\_CL, metrics\_restserver\_CL, metrics\_restserver\_jvm\_CL, metrics\_hmaster\_assignmentmanager\_CL, metrics\_hmaster\_ipc\_CL, metrics\_hmaser\_os\_CL, metrics\_hmaster\_balancer\_CL, metrics\_hmaster\_jvm\_CL, metrics\_hmaster\_CL,metrics\_hmaster\_fs\_CL</li></ul>|
| HDInsightHBaseLogs | <ul><li>**Description**: This table contains logs from HBase and its related components: Phoenix and HDFS.</li><li>**Old table**: log\_regionserver\_CL, log\_restserver\_CL, log\_phoenixserver\_CL, log\_hmaster\_CL, log\_hdfsnamenode\_CL, log\_garbage\_collector\_CL</li></ul>|


## Oozie workload

| New Table | Details |
| --- | --- |
| HDInsightOozieLogs | <ul><li>**Description**: This table contains all logs generated from the Oozie framework.</li><li>**Old table**: Log\_oozie\_CL</li></ul>|

## Next steps
[Query Azure Monitor logs to monitor HDInsight clusters](hdinsight-hadoop-oms-log-analytics-use-queries.md)

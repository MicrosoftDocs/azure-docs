---
title: Guidance for migrating HDInsight customer Log Analytics
description: Determine the types, sizes, and retention policies for HDInsight activity log files.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 02/05/2020
---

# HDInsight Customer Log Analytics Migration Guidance

Azure HDInsight is an enterprise-ready managed-cluster service for running open-source analytics frameworks like Apache Spark, Hadoop, and Kafka on Azure. Azure HDInsight has integrated with other Azure services to enable customers to better manage their big data analytics applications, like Azure Active Directory, Azure Data Factory, and Log Analytics.

Log Analytics provides a tool in the Azure portal to edit and run log queries from data collected by Azure Monitor Logs and interactively analyze their results. Customers can use Log Analytics queries to retrieve records matching criteria, identify trends, analyze patterns, and provide a variety of insights into their data.

Azure HDInsight enabled integration with Log Analytics in 2017. HDInsight customers quickly adopted this feature to monitor their HDInsight clusters and query the logs in the clusters. While adoption of this feature has increased, customers have provided feedback about the integration:

- Customers can't decide which logs to store and storing all the logs can become expensive.
- Current HDInsight schemas logs aren't following consistent naming conventions and some tables are repetitive.
- Customers want out-of-box dashboard to easily monitor the KPI of their HDInsight clusters.
- Customers must jump to Log Analytics to run simple queries.

## Solution Overview

As a result of the feedback, the HDInsight team invested in the new Azure Monitor integration. This integration enables:

- A new set of tables in customers' Log Analytics workspace. The new tables are delivered through a new Log Analytics pipeline.
- Higher reliability.
- Faster log delivery.
- Resource-based table grouping and default queries.

Also, there are 30 new tables that provide the same information as the 90+ tables from the legacy system. 

## Benefits of New Azure Monitor Integration

This document walks you through the changes to the Azure Monitor integration and provides best-practices for using the new tables.

**Redesigned schemas**: The schema formatting for the new Azure Monitor integration is better organized and easy to understand. There are two-thirds fewer schemas to remove as much ambiguity in the legacy schemas as possible.

**Selective Logging (releasing soon)**: There are a variety of logs and metrics available through Log Analytics. To help you save on monitoring costs, we will be releasing a new selective logging feature soon that you can use to turn on and off different logs and metric sources. With this feature, you'll only have to pay for what you use.

**Logs cluster portal integration**: The **Logs** blade is new to the HDInsight Cluster portal. Anyone with access to the cluster can go to this blade to query any table that the cluster resource sends records to. Users don't need access to the Log Analytics workspace anymore to see the records for a specific cluster resource.

**Insights cluster portal integration**: The **Insights** blade is also new to the HDInsight Cluster portal. After enabling the new Azure Monitor integration, you can select the **Insights** blade and an out-of-box logs and metrics dashboard specific to the cluster's type will automatically populate for you. These dashboards have been revamped from our previous Azure solutions. They give you deep insights into your cluster's performance and health.

**At-scale insights**: Monitor the health and performance of multiple clusters across different subscriptions through our new **At-Scale Insights** workbook available in the **Azure Monitor** portal.

## Customer scenarios

The following sections describe how customers can use the new Azure Monitor integration in different scenarios. The **New Azure Monitor user** section outlines how to activate and utilize the new Azure Monitor integration. The **Existing Azure Monitor user** section includes additional information for users that dependend on the old Azure Monitor integration.

> [!NOTE]
> Only clusters created in late-September 2020 and after are eligible for the new Azure Monitoring integration.



## Activate a new Azure Monitor integration 

> [!NOTE]
> You must have a Log Analytics workspace created in a subscription you have access to before doing enabling the new integration. Learn how to create a Log Analytics workspace [here](https://docs.microsoft.com/en-us/azure/azure-monitor/learn/quick-create-workspace).

Activate the new integration by going to your cluster's portal page, scrolling down the menu on the left until you reach the **Monitoring** section, and selecting the **Azure Monitor** blade. There will be a button to enable the pipeline. Once you select **Enable**, you can choose the Log Analytics workspace that you want your logs to be sent to. Select **Save** once you have chosen your workspace. 

### Accessing the new tables

There are two ways you can access the new tables. 

The first way is through the Log Analytics workspace. 

1. Go to the Log Analytics workspace that you selected when you enabled the integration. 
2. Scroll down in the menu on the left side of the screen and select the **Logs** blade. A Logs query editor will pop up with a list of all the tables in the workspace. 
3. If the tables are grouped by **Solution**, the new HDI tables will be under the **Logs Management** section. 
4. If you group the tables by **Resource Type**, the tables will appear under the **HDInsight Clusters** section as shown in the image below. 
> [!NOTE]
> This is how the logs were accessed in the old integration. This requires the user to have access to the workspace.

The second way is through Cluster portal access.
 
1. Navigate to your Cluster's portal page and scroll down the menu on the left side until you see the **Monitoring** section. In this section you will see a **Logs** blade. 
2. Select the blade and a Logs query editor appears. This editor contains all logs associated with the cluster resource that are sent to the Log Analytics workspace you selected when enabling the integration. This provides resource-based access (RBAC) so that users who have access to the cluster but not to the workspace can still see logs associated with the cluster.

For comparison, the following screenshots show the legacy integration workspace view and the new integration workspace view:

![]() 
![]()

### Using the new tables

These integrations can help you use the new tables:

#### Default queries to use with new tables

In your Logs query editor, set the toggle to **Queries** above the table list. Make sure that the queries are grouped by **Resource Type** and that there's no filter set for a resource type other than **HDInsight Clusters**. The following image shows how the results look when grouped by **Resource Type** and filtered for **HDInsight Clusters**. Just select one and it appear in the Logs query editor. Be sure to read the comments included in the queries, as some require you to enter some information, like your cluster name, for the query to run successfully.

![]()

#### Ad-hoc queries

You can enter your own queries in the Logs query editor. queries used on the old tables won't be valid on the new tables as many of the new tables have new, refined schemas. The default queries are great references for shaping queries on the new tables.

#### Insights

Insights are cluster-specific visualization dashboards made using [Azure Workbooks](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/workbooks-overview). These dashboards give you detailed graphs and visualizations of how your cluster is running. The dashboards have sections for each cluster type, YARN, system metrics, and component logs. You can access the Insight for your cluster by visiting your cluster's page in the portal, scrolling down to the **Monitoring** section, and selecting the **Insights** blade. The dashboard loads automatically if you have enabled the new integration. Please allow a few seconds for the graphs to load as they query the logs.

![]()

#### Custom Azure workbooks

You can create your own Azure workbooks with custom graphs and visualizations. In your cluster's portal page, scroll down to the **Monitoring** section and select the **Workbooks** blade in the menu on the left. You can either start using a blank template or use one of the templates under the **HDInsight Clusters** section. There is a template for each cluster type. This is useful if you want to save specific customizations that the default HDInsight Insights don't provide. Feel free to send in requests for new features in the HDInsight Insights if you feel they are lacking something.

#### At-scale workbooks for new Azure Monitor integrations

Use our new out-of-box, at-scale workbook <add link> to get a multi-cluster monitoring experience for your clusters. Our at-scale workbook shows you which of your clusters have our monitoring pipeline enabled and gives you a straightforward way to quickly check the health of multiple clusters at once. It contains different views, including one for each cluster type and one for YARN-based clusters. To view this workbook:

1. Go to **Aure Monitor** page in from the Azure Portal home page
2. Once on the **Azure Monitor** page, look at the menu on the left for the section, **Insights**, and click under the **HDInsight** blade.

   <Add picture of at scale workbook>

#### Alerts

You can add custom alerts to your clusters and workspaces in the Log query editor. Go to the Logs query editor by selecting the **Logs** blade from either your cluster or workspace portal. Run a query and then select **New Alert Rule** as shown in the following screenshot. For more information, read about [configuring alerts](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-log).

![]()

## Activate an existing Azure Monitor integration

If are using the classic Azure Monitor Integration, you'll need to make some adjustments to the new table formats after you switch to the new Azure Monitor Integration.

To enable the new Azure Monitor Integration, please follow the steps outlined in the [Enable a new Azure Monitor integration](#enable-a-new-azure-monitor-integration) section.

### Run queries in Log Analytics

Since the new table format is different from the previous one, your queries need to be reworked so you can use our new tables. Once you enable the new Azure Monitor integration, you can browse the tables and schemas to identify the fields that are used in your old queries.

We provide a [mapping table](#appendix-1-table-mapping) between the old table to the new table to help you quickly find the new fields you need to use to migrate your dashboards and queries.

**Default queries**: We created default queries that show how to use the new tables for common situations and show what information is available in each table. You can access the Default Queries by following the instructions in the [Default queries to use with new tables](#default-queries-to-use-with-new-tables)

### Update dashboards for HDInsight clusters

If you have built multiple dashboards to monitor your HDInsight clusters, you need to adjust the query behind the table once you enable the new Azure Monitor Integration. Table name/field name might change in the new integration, but all the information you have in old integration is included.

Please refer to the [mapping table](#appendix-1-table-mapping) between the old table/schema to the new table/schema to update the query behind the dashboards.

#### Out-of-Box dashboards 

We also created much improved out-of-box dashboards both at the cluster-level. There is a button on the top right of every graph that allows you to see the underlying query that produces the information, which is a great way to familiarize yourself with how the new tables can be queried effectively. You can access the out-of-box dashboards by following the instructions found in section **Insights** and **At-Scale Workbooks** under the **I am a New User-\&gt;Using the new tables** section.

### I am using HDInsight workload-specific monitoring dashboard

If you are using the out-of-box monitoring dashboard for HDInsight clusters, like HDInsight Spark Monitoring, HDInsight HBase Monitoring, and HDInsight Interactive Monitoring, we are working on provide you the same capabilities on Azure Monitor portal.

You will see an HDInsight option in Azure Monitor.

![]()

The HDInsight Monitor portal provides you the capability of monitoring multiple HDInsight clusters in one place. We organize the clusters based on the workload type, so you see types like Spark, HBase, and Hive. Instead of going to multiple dashboards, now you can monitor all your HDInsight clusters in this view.

> [!NOTE]
> This feature is planned to be released by <XX of 2021>. More details in <section **Insights** and **At-Scale Workbooks** under the **I am a New User > Using the new tables** section.>

## Enable both integrations to accelerate the migration

To help you quickly migrate to the new Azure Monitor integration, you can have both the classic and the new Azure Monitor integrations activated at the same time on a cluster that is eligible for both integrations. The new integration is available for all clusters created after mid-September 2020.

In this way, you can easily do a side-by-side comparison for the queries you are using.

### Enabling the classic integration

If you are using a cluster created after mid-September 2020, you'll see the new portal experience in your cluster's portal. To enable the new pipeline, you can follow the steps outlined in the section **Enabling the New Integration** in the **New Users** section. To activate the classic integration on this cluster, go to the your cluster's portal page. Select the **Azure Monitor** blade in the **Monitoring** section of the blade menu on the left side of your cluster portal page. Select **Configure Azure Monitor for HDInsight clusters integration (classic)**. A side context appears with a toggle you can use to enable and disable the classic Azure Monitoring integration. 

> [!NOTE]
> The **Insights** and **Logs** blades only work with the new integration.

<Include image circling the link to old pipeline>

You won't be able to create new clusters with classic Azure Monitor integration after July 1st, 2021.

## Release and support timeline

- Customers can enable the New Azure Monitoring after February 20th, 2021.
- Classic Azure Monitoring integration will be unavailable after July 1st, 2021. Until then, there will be limited support for all the running clusters with classic Azure Monitoring integration
  - Issues will be investigated once customers submit the support ticket.
  - If solution requires image change, customers should move to the new integration.
  - If the solution requires an RP change or Sibyl update, we will include the fix and deploy the mitigation along in the regular release cycle.
  - We will not patch the classic Azure Monitoring integration clusters except critical security issues.

## Appendix 1: Table Mapping

The below chart shows the table mappings from the classic Azure Monitoring Integration to our new one. The **Workload** section describes which workload each table is associated with. The **New Table** section shows the name of the new table. The **Description** section describes the type of logs/metrics that will be available in this table. The **Old Table** section is a list of all the tables from the classic Azure Monitor Integration whose data will now be present in the table listed in **New Table**.

| Workload | New Table (Azure Monitor) | Description | Old Table (Azure Monitor (Classic) |
| --- | --- | --- | --- |
| **Kafka** | **HDInsightKafkaMetrics** | this table contains JMX metrics from Kafka. It contains all the same JMX metrics as the old Custom Logs tables, plus more metrics we deemed are important. It contains one metric per record. | metrics\_kafka\_CL
 |
| **Kafka** | **HDInsightKafkaLogs** | This table contains all logs generated from the Kafka Brokers. | log\_kafkaserver\_CL, log\_kafkacontroller\_CL
 |
| **Spark** | **HDInsightSparkLogs** | This table contains all logs related to Spark and its related component: Livy and Jupyter. | log\_zeppelin-zeppelin\_CL,log\_sparkapplication\_stats\_executors\_CL,sparkapplication\_stats\_allexecutors\_CL,application\_stats\_storedrdd,log\_livy,log\_jupyter\_CL,log\_spark\_CL,log\_sparkappsexecutors\_CL, log\_sparkappsdrivers\_CL
 |
| **Spark** | **HDInsightSparkApplicationEvents** | This table contains event information for Spark Applications including Submission and Completion time, App Id, and AppName. It is useful for keeping track of when applications started and completed. |
 |
| **Spark** | **HDInsightSparkBlockManagerEvents** | This table contains event information related to Spark&#39;s Block Manager. It includes information such as executor memory usage |
 |
| **Spark** | **HDInsightSparkEnvironmentEvents** | This table contains event information related to the Environment an application executes in including, Spark Deploy Mode, Master, and information about the Executor |
 |
| **Spark** | **HDInsightSparkExecutorEvents** | This table contains event information about the Spark Executor usage for an by Application |
 |
| **Spark** | **HDInsightSparkExtraEvents** | This table contains event information that does not fit into any other Spark table. |
 |
| **Spark** | **HDInsightSparkJobEvents** | This table contains information about Spark Jobs including their start and end times, result, and associated stages |
 |
| **Spark** | **HDInsightSparkSqlExecutionEvents** | This table contains event information on Spark SQL Queries including their plan info and description and start and end times. |
 |
| **Spark** | **HDInsightSparkStageEvents** | This table contains event information for Spark Stages including their start and completion times, failure status, and detailed execution information. |
 |
| **Spark** | **HDInsightSparkStageTaskAccumulables** | This table contains performance metrics for stages and tasks. |
 |
| **Spark** | **HDInsightTaskEvents** | This table contains event information for Spark Tasks including start and completion time, associated stages, execution status and task type |
 |
| **Spark** | **HDInsightJupyterNotebookEvents** | This table contains event information for Jupyter Notebooks. |
 |
| **HBase** | **HDInsightHBaseMetrics** | This table contains JMX metrics from HBase. It contains all the same JMX metrics from the tables listed in the Old Schema column. In contrast from the old tables, each row contains one metric | metrics\_regionserver\_CLmetrics\_regionserver\_wal\_CLmetrics\_regionserver\_ipc\_CLmetrics\_regionserver\_os\_CLmetrics\_regionserver\_replication\_CLmetrics\_restserver\_CL,metrics\_restserver\_jvm\_CLmetrics\_hmaster\_assignmentmanager\_CLmetrics\_hmaster\_ipc\_CLmetrics\_hmaser\_os\_CLmetrics\_hmaster\_balancer\_CLmetrics\_hmaster\_jvm\_CLmetrics\_hmaster\_CL,metrics\_hmaster\_fs\_CL
 |
| **HBase** | **HDInsightHBaseLogs** | This table contains logs from HBase and its related components: Phoenix and HDFS | log\_regionserver\_CLlog\_restserver\_CLlog\_phoenixserver\_CLlog\_hmaster\_CL,log\_hdfsnamenode\_CL,log\_garbage\_collector\_CL
 |
| **Storm** | **HDInsightStormMetrics** | This table contains the same JMX metrics as the tables in the Old Tables section. Its rows contain one metric per record. | metrics\_stormnimbus\_CLmetrics\_stormsupervisor\_CL |
| **Storm** | **HDInsightStormTopologyMetrics** | This table contains topology level metrics from Storm. It is the same shape as the table listed in Old Tables section | metrics\_stormrest\_CL |
| **Storm** | **HDInsightStormLogs** | This table contains all logs generated from Storm. | log\_supervisor\_CL,log\_nimbus\_CL |
| **Hadoop/Yarn** | **HDInsightHadoopAndYarnMetrics** | this table contains JMX metrics from the Hadoop and YARN frameworks. It contains all the same JMX metrics as the old Custom Logs tables, plus more metrics we deemed are important. We added Timeline Server, Node Manager, and Job History Server metrics. It contains one metric per record. | metrics\_resourcemanager\_clustermetrics\_CLmetrics\_resourcemanager\_jvm\_CLmetrics\_resourcemanager\_queue\_root\_CLmetrics\_resourcemanager\_queue\_root\_joblauncher\_CLmetrics\_resourcemanager\_queue\_root\_default\_CLmetrics\_resourcemanager\_queue\_root\_thriftsvr\_CL
 |
| **Hadoop/Yarn** | **HDInsightHadoopAndYarnLogs** | This table contains all logs generated from the Hadoop and YARN frameworks. | log\_mrjobsummary\_CLlog\_resourcemanager\_CLlog\_timelineserver\_CLlog\_nodemanager\_CL
 |
| **Hive/LLAP** | **HDInsightHiveAndLLAPMetrics** | This table contains JMX metrics from the Hive and LLAP frameworks. It contains all the same JMX metrics as the old Custom Logs tables. It contains one metric per record. | llap\_metrics\_hiveserver2\_CLllap\_metrics\_hs2\_metrics\_subsystemllap\_metrics\_jvm\_CLllap\_metrics\_llap\_daemon\_info\_CLllap\_metrics\_buddy\_allocator\_info\_CLllap\_metrics\_deamon\_jvm\_CLllap\_metrics\_io\_CLllap\_metrics\_executor\_metrics\_CLllap\_metrics\_metricssystem\_stats\_CL,llap\_metrics\_cache\_CL
 |
| **Hive/LLAP** | **HDInsightHiveAndLLAPLogs** | This table contains logs generated from Hive, LLAP, and their related components: WebHCat and Zeppelin | log\_hivemetastore\_CL log\_hiveserver2\_CLlog\_hiveserve2interactive\_CLlog\_webhcat\_CL
 |
| **General** | **HDInsightAmbariSystemMetrics** | This table contains system metrics collected from Ambari. The metrics now come from each node in the cluster (except for edgenodes) instead of just the two headnodes. Each metric is no w column and each metric is reported once per record. | metrics\_cpu\_nice\_clmetrics\_cpu\_system\_clmetrics\_cpu\_user\_cl metrics\_memory\_cache\_CLmetrics\_memory\_swap\_CLmetrics\_memory\_total\_CLmetrics\_memory\_buffer\_CLmetrics\_load\_1min\_CLmetrics\_load\_cpu\_CL metrics\_load\_nodes\_CLmetrics\_load\_procs\_CLmetrics\_network\_in\_CLmetrics\_network\_out\_CL
 |
| **General** | **HDInsightAmbariClusterAlerts** | This table contains Ambari Cluster Alerts from each node in the cluster (except for edgenodes). Each alert is a record in this table. | metrics\_cluster\_alerts\_CL
 |
| **General** | **HDInsightSecurityLogs** | This table contains records from the Ambari Audit and Auth Logs. | log\_ambari\_audit\_CLlog\_auth\_CL |
| **General** | **HDInsightRangerAuditLogs** | This table contains all records from the Ranger Audit log for ESP clusters | ranger\_audit\_logs\_CL |
| **General** | **HDInsightGatewayAuditLogs\_CL** | This table contains the Gateway nodes audit information. It is the same format as the table in Old Tables column. **It is still located in the Custom Logs section.** | log\_gateway\_Audit\_CL |
| **Oozie** | **HDInsightOozieLogs** | This table contains all logs generated from the Oozie framework | Log\_oozie\_CL |

**Note:** Some tables are new and not based off of old tables.
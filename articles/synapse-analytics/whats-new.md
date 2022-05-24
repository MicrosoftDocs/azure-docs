---
title: What's new? 
description: Learn about the new features and documentation improvements for Azure Synapse Analytics
author: ryanmajidi
ms.author: rymajidi 
ms.service: synapse-analytics
ms.subservice: overview
ms.topic: conceptual
ms.date: 04/15/2022
---

# What's new in Azure Synapse Analytics?

This article lists updates to Azure Synapse Analytics that are published in Mar 2022. Each update links to the Azure Synapse Analytics blog and an article that provides more information. For previous months releases, check out [Azure Synapse Analytics - updates archive](whats-new-archive.md).

The following updates are new to Azure Synapse Analytics this month.

## SQL

* Cross-subscription restore for Azure Synapse SQL is now generally available.  Previously, it took many undocumented steps to restore a dedicated SQL pool to another subscription.  Now, with the PowerShell Az.Sql module 3.8 update, the Restore-AzSqlDatabase cmdlet can be used for cross-subscription restore.  To learn more, see [Restore a dedicated SQL pool (formerly SQL DW) to a different subscription](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-april-update-2022/ba-p/3280185).

* It is now possible to recover a SQL pool from a dropped server or workspace.  With the PowerShell Restore cmdlets in Az.Sql and Az.Synapse modules, you can now restore from a deleted server or workspace without filing a support ticket.  For more information, read [Synapse workspace SQL pools](./backuprestore/restore-sql-pool-from-deleted-workspace.md) or [standalone SQL pools (formerly SQL DW)](./sql-data-warehouse/sql-data-warehouse-restore-from-deleted-server.md), depending on your scenario.

## Synapse database templates and database designer

* Based on popular customer feedback, we've made significant improvements to our exploration experience when creating a lake database using an industry template.  To learn more, read [Quickstart: Create a new Lake database leveraging database templates](./database-designer/quick-start-create-lake-database.md).

* We've added the option to clone a lake database.  This  unlocks additional opportunities to manage new versions of databases or support schemas that evolve in discrete steps. You can quickly clone a database using the action menu available on the lake database.  To learn more, read [How-to: Clone a lake database](./database-designer/clone-lake-database.md).

* You can now use wildcards to specify custom folder hierarchies.  Lake databases sit on top of data that is in the lake and this data can live in nested folders that don’t fit into clean partition patterns. Previously, querying lake databases required that your data exists in a simple directory structure that you could browse using the folder icon without the ability to manually specify directory structure or use wildcard characters.  To learn more, read [How-to: Modify a datalake](./database-designer/modify-lake-database.md).

## Apache Spark for Synapse

* We are excited to announce the preview availability of Apache Spark™ 3.2 on Synapse Analytics. This new version incorporates user-requested enhancements and resolves 1,700+ Jira tickets. Please review the [official release notes](https://spark.apache.org/releases/spark-release-3-2-0.html) for the complete list of fixes and features and review the [migration guidelines between Spark 3.1 and 3.2](https://spark.apache.org/docs/latest/sql-migration-guide.html#upgrading-from-spark-sql-31-to-32) to assess potential changes to your applications. For more details, read [Apache Spark version support and Azure Synapse Runtime for Apache Spark 3.2](./spark/apache-spark-version-support.md).  

* Assigning parameters dynamically based on variables, metadata, or specifying Pipeline specific parameters has been one of your top feature requests. Now, with the release of parameterization for the Spark job definition activity, you can do just that.  For more details, read [Transform data using Apache Spark job definition](quickstart-transform-data-using-spark-job-definition.md#settings-tab).

* We often receive customer requests to access the snapshot of the Notebook when there is a Pipeline Notebook run failure or there is a long-running Notebook job. With the release of the Synapse Notebook snapshot feature, you can now view the snapshot of the Notebook activity run with the original Notebook code, the cell output, and the input parameters. You can also access the snapshot of the referenced Notebook from the referencing Notebook cell output if you refer to other Notebooks through Spark utils. To learn more, read [Transform data by running a Synapse notebook](synapse-notebook-activity.md?tabs=classical#see-notebook-activity-run-history) and [Introduction to Microsoft Spark utilities](/spark/microsoft-spark-utilities.md?pivots=programming-language-scala#reference-a-notebook-1). 

## Security

* The Synapse Monitoring Operator RBAC role is now generally available.  Since the GA of Synapse, customers have asked for a fine-grained RBAC (role-based access control) role that allows a user persona to monitor the execution of Synapse Pipelines and Spark applications without having the ability to run or cancel the execution of these applications.  Now, customers can assign the Synapse Monitoring Operator role to such monitoring personas. This allows organizations to stay compliant while having flexibility in the delegation of tasks to individuals or teams. Learn more by reading [Synapse RBAC Roles](security/synapse-workspace-synapse-rbac-roles.md). 
## Data integration

* Microsoft has added Dataverse as a source and sink connector to Synapse Data Flows so that you can now build low-code data transformation ETL jobs in Synapse directly accessing your Dataverse environment. For more details on how to use this new connector, read [Mapping data flow properties](../data-factory/connector-dynamics-crm-office-365.md#mapping-data-flow-properties). 

* We heard from you that a 1-minute timeout for Web activity was not long enough, especially in cases of synchronous APIs. Now, with the response timeout property 'httpRequestTimeout', you can define timeout for the HTTP request up to 10 minutes. Learn more by reading [Web activity response timeout improvements](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/web-activity-response-timeout-improvement/ba-p/3260307).
 
## Developer experience

* Previously, if you wanted to reference a notebook in another notebook, you could only reference published or committed content. Now, when using %run notebooks, you can enable ‘unpublished notebook reference’ which will allow you to reference unpublished notebooks. When enabled, notebook run will fetch the current contents in the notebook web cache, meaning the changes in your notebook editor can be referenced immediately by other notebooks without having to be published (Live mode) or committed (Git mode).  To learn more, read [Reference unpublished notebook](spark/apache-spark-development-using-notebooks.md#reference-unpublished-notebook). 
## Next steps

[Get started with Azure Synapse Analytics](get-started.md)

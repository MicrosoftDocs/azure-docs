---
title: FAQ - Azure Synapse Analytics (workspaces preview)
description: FAQ for Azure Synapse Analytics  (workspaces preview)
services: synapse-analytics
author: saveenr
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: overview
ms.date: 10/25/2020
ms.author: saveenr
ms.reviewer: jrasnick
---

# Azure Synapse Analytics (workspaces preview) frequently asked questions

In this guide, you'll find the most frequently asked questions for Synapse Analytics.

[!INCLUDE [preview](includes/note-preview.md)]

## General

### Q: What RBAC roles exist and how I use them to secure a Synapse workspace?
A: Azure Synapse introduces a number of roles and scopes to assign them on that will simplify securing your workspace.

Synapse RBAC roles:
* Synapse Administrator
* Synapse Contributor
* Synapse Artifact Author
* Synapse Artifact Reader
* Synapse Compute Manager
* Synapse Credential User
* Synapse Managed Private Endpoint Administrator
* Synapse Reader

Synapse RBAC Scopes:
* Workspace 
* Spark pool
* Integration runtime
* Linked service
* Credential

Additionally, with Dedicated SQL pools you have all the same security features that you know and love.



### Q: How can I cost control for the capabilities inside a Synapse workspace such as dedicated SQL pools, and serverless Spark pools, and serverless SQL pools?

A: As a starting point, Synapse works with the built-in Cost analysis and Cost alerts available at the Azure Subscription level.

For dedicated SQL pools, you have direct visibility into the cost and control over the cost, because you create and specify the sizes of dedicated SQL pools. You can further control your which users can create or scale dedicated SQL pools with Azure RBAC roles.

For serverless SQL pools, has monitoring and cost management controls that let you cap spending at a daily, weekly, and monthly level. https://docs.microsoft.com/azure/synapse-analytics/sql/data-processed 

For serverless Spark pools, you can restrict who can create Spark pools with Synapse RBAC roles.  

### Q: Will Synapse workspace support folder organization of objects and granularity at GA?
A: Synapse workspaces support user-defined folders.

### Q: Can I link more than one Power BI workspaces to a single Azure Synapse Workspace?	
A: Currently, you can only link a single Power BI workspace to an Azure Synapse Workspace. 

### Q: Is Synapse Link to Cosmos DB GA?
A: Synapse Link for Apache Spark is GA. Synapse Link for Serverless SQL is in Public Preview.

### Q: Does Azure Synapse Workspace Support CI/CD? 
A: Yes! All Pipeline artifacts, notebooks, SQL scripts, and Spark Job Definitions will reside in GIT. All Pool definitions will be stored in GIT as ARM Templates. Dedicated SQL Pool objects (schemas, tables, views, etc.) will be managed with Database Projects with CI/CD support.

## Pipelines

### Q: How do I ensure I know what credential is being used to run a pipeline?
A: Each activity in a Synapse Pipelines is executed using the credential specified inside the linked service.

### Q: Are SSIS IRs supported in Synapse Orchestrate?
A: Not at this time. 

### Q: How do I migrate existing pipelines from Azure Data Factory to Azure Synapse Workspace?
A: At this time, you must manually recreate your Azure Data Factory pipelines and related artifacts manually. 

## Apache Spark

### Q: What is the difference between Apache Spark for Synapse and Apache Spark?
A: Apache Spark for Synapse IS Apache Spark with added support for integrations with other services (AAD, AzureML, etc.) and additional libraries (mssparktuils, Hummingbird) and pre-tuned performance configurations.
Any workload that is currently running on Apache Spark will run on MSFT Spark without change. 

### Q: What versions of Spark is available?
A: Azure Synapse Apache Spark fully supports Spark 2.4. For a full list of core components and currently supported version see https://docs.microsoft.com/azure/synapse-analytics/spark/apache-spark-version-support 

### Q: Is there an equivalent of DButils in Azure Synapse Spark?
A: Yes, Azure Synapse Apache Spark provides the **mssparkutils** library. Full documentation of the utility can be found https://docs.microsoft.com/azure/synapse-analytics/spark/microsoft-spark-utilities

### Q: How do I set Session parameters in Apache Spark?
A: To set session parameters, use %%configure magic available. A session restart is required for the parameters to take effect. 

### Q: How do I set Cluster level Parameters in a serverless Spark pool?
A: To set Cluster level parameters, you can provide a spark.conf file for the Spark pool. This pool will then honor the parameters past in the config file. 

### Q: Can I run a multi-user Spark Cluster in Azure Synapse Analytics? 
A: Azure Synapse provides purpose-built engines for specific use cases. Apache Spark for Synapse is designed as a job service and not a cluster model. 
There are two scenarios where people ask for a multi-user cluster model.

**Scenario #1: Many users accessing a cluster for serving data for BI purposes.**

The easiest way of accomplishing this task is to cook the data with Spark and then take advantage of the serving capabilities of Synapse SQL to that they can connect power BI to those datasets.

**Scenario #2: Having multiple developers on a single cluster to save money.**
 
To satisfy this scenario, you should give each developer a serverless Spark pool that is set to use a small number of Spark resources. Since serverless Spark pools don’t cost anything, until they are actively used minimizes the cost when there are multiple developers. The pools share metadata (Spark tables) so they can easily work with each other.

### Q: How do I include manage and install libraries  
A:  You can install external packages via a requirements.txt file while creating the SQL Pool, from the synapse workspace, or from the Azure portal. See https://docs.microsoft.com/azure/synapse-analytics/spark/apache-spark-azure-portal-add-libraries  

## Dedicated SQL Pools

### Q: What are the functional differences between Dedicated SQL pools and Serverless Pools
A: You can find a full list of differences at https://docs.microsoft.com/azure/synapse-analytics/sql/overview-features 

### Q: Now that Azure Synapse is GA, how do I move my Dedicated SQL pools that were previously standalone into Synapse? 
A: There is no “move” or “migration.” 
You can choose to enable new workspace features on your existing pools. If you do, there are no breaking changes, instead you’ll be able to use new features such as Synapse Studio, Spark, and serverless SQL pools.

### Q: What is the default deployment of Dedicated SQL Pools now? 
A: By Default, all new Dedicated SQL Pools will be deployed to a workspace; however, if you need to you can still create a Dedicated SQL Pool in a standalone form factor. 
Serverless SQL Pools

### Q: What are the functional differences between Dedicated SQL pools and Serverless Pools
A: You can find a full list of differences https://docs.microsoft.com/azure/synapse-analytics/sql/overview-features 

## Next steps

* [Get started with Azure Synapse Analytics](get-started.md)
* [Create a workspace](quickstart-create-workspace.md)
* [Use serverless SQL pool](quickstart-sql-on-demand.md)

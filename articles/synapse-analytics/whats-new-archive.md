---
title: Previous monthly updates in Azure Synapse Analytics 
description: Archive of the new features and documentation improvements for Azure Synapse Analytics
services: synapse-analytics
author: ryanmajidi
ms.author: rymajidi 
ms.service: synapse-analytics
ms.subservice: overview
ms.topic: conceptual
ms.date: 01/28/2022
---

# Previous monthly updates in Azure Synapse Analytics

This article describes previous month updates to Azure Synapse Analytics. For the most current month's release, check out [Azure Synapse Analytics latest updates](whats-new.md). Each update links to the Azure Synapse Analytics blog and an article that provides more information.

## December 2021 update

The following updates are new to Azure Synapse Analytics this month.

### Apache Spark for Synapse

* Accelerate Spark workloads with NVIDIA GPU acceleration [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--16536080) [article](./spark/apache-spark-rapids-gpu.md)
* Mount remote storage to a Synapse Spark pool [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--1823990543) [article](./spark/synapse-file-mount-api.md)
* Natively read & write data in ADLS with Pandas [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-663522290) [article](./spark/tutorial-use-pandas-spark-pool.md)
* Dynamic allocation of executors for Spark [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--1143932173) [article](./spark/apache-spark-autoscale.md)

### Machine Learning

* The Synapse Machine Learning library [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--463873803) [article](https://microsoft.github.io/SynapseML/docs/about/)
* Getting started with state-of-the-art pre-built intelligent models [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-2023639030) [article](./machine-learning/tutorial-form-recognizer-use-mmlspark.md)
* Building responsible AI systems with the Synapse ML library [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-914346508) [article](https://microsoft.github.io/SynapseML/docs/features/responsible_ai/Model%20Interpretation%20on%20Spark/)
* PREDICT is now GA for Synapse Dedicated SQL pools [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1594404878) [article](./machine-learning/tutorial-sql-pool-model-scoring-wizard.md)
* Simple & scalable scoring with PREDICT and MLFlow for Apache Spark for Synapse [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--213049585) [article](./machine-learning/tutorial-score-model-predict-spark-pool.md)
* Retail AI solutions [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--2020504048) [article](./machine-learning/quickstart-industry-ai-solutions.md)

### Security

* User-Assigned managed identities now supported in Synapse Pipelines in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--1340445678) [article](../data-factory/credentials.md?context=%2Fazure%2Fsynapse-analytics%2Fcontext%2Fcontext&tabs=data-factory)
* Browse ADLS Gen2 folders in an Azure Synapse Analytics workspace in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1147067155) [article](how-to-access-container-with-access-control-lists.md)

### Data Integration

* Pipeline Fail activity [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1827125525) [article](../data-factory/control-flow-fail-activity.md)
* Mapping Data Flow gets new native connectors [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-717833003) [article](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/mapping-data-flow-gets-new-native-connectors/ba-p/2866754)
* Additional notebook export formats: HTML, Python, and LaTeX [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF3) 
* Three new chart types in notebook view: box plot, histogram, and pivot table [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF4)
* Reconnect to lost notebook session [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF5)

### Integrate

* Synapse Link for Dataverse [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1397891373) [article](/powerapps/maker/data-platform/azure-synapse-link-synapse)
* Custom partitions for Synapse link for Azure Cosmos DB in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--409563090) [article](../cosmos-db/custom-partitioning-analytical-store.md)
* Map data tool (Public Preview), a no-code guided ETL experience [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF7) [article](./database-designer/overview-map-data.md)
* Quick reuse of spark cluster [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF7) [article](../data-factory/concepts-integration-runtime-performance.md#time-to-live)
* External Call transformation [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF9) [article](../data-factory/data-flow-external-call.md)
* Flowlets (Public Preview) [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-december-2021-update/ba-p/3042904#REF10) [article](../data-factory/concepts-data-flow-flowlet.md)

## November 2021 update

The following updates are new to Azure Synapse Analytics this month.

### Synapse Data Explorer

* Synapse Data Explorer now available in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1022327194) [article](./data-explorer/data-explorer-overview.md)

### Working with Databases and Data Lakes

* Introducing Lake databases (formerly known as Spark databases) [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--795630373) [article](./database-designer/concepts-lake-database.md)
* Lake database designer now available in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1691882460) [article](./database-designer/concepts-lake-database.md#database-designer)
* Database Templates and Database Designer [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--115572003) [article](./database-designer/concepts-database-templates.md)

### SQL

* Delta Lake support for serverless SQL is generally available [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-564486367) [article](./sql/query-delta-lake-format.md)
* Query multiple file paths using OPENROWSET in serverless SQL [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--1242968096) [article](./sql/query-single-csv-file.md)
* Serverless SQL queries can now return up to 200GB of results [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1110860013) [article](./sql/resources-self-help-sql-on-demand.md)
* Handling invalid rows with OPENROWSET in serverless SQL [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--696594450) [article](./sql/develop-openrowset.md)

### Apache Spark for Synapse

* Accelerate Spark workloads with NVIDIA GPU acceleration [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--16536080) [article](./spark/apache-spark-rapids-gpu.md)
* Mount remote storage to a Synapse Spark pool [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--1823990543) [article](./spark/synapse-file-mount-api.md)
* Natively read & write data in ADLS with Pandas [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-663522290) [article](./spark/tutorial-use-pandas-spark-pool.md)
* Dynamic allocation of executors for Spark [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--1143932173) [article](./spark/apache-spark-autoscale.md)

### Machine Learning

* The Synapse Machine Learning library [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--463873803) [article](https://microsoft.github.io/SynapseML/docs/about/)
* Getting started with state-of-the-art pre-built intelligent models [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-2023639030) [article](./machine-learning/tutorial-form-recognizer-use-mmlspark.md)
* Building responsible AI systems with the Synapse ML library [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-914346508) [article](https://microsoft.github.io/SynapseML/docs/features/responsible_ai/Model%20Interpretation%20on%20Spark/)
* PREDICT is now GA for Synapse Dedicated SQL pools [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1594404878) [article](./machine-learning/tutorial-sql-pool-model-scoring-wizard.md)
* Simple & scalable scoring with PREDICT and MLFlow for Apache Spark for Synapse [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--213049585) [article](./machine-learning/tutorial-score-model-predict-spark-pool.md)
* Retail AI solutions [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--2020504048) [article](./machine-learning/quickstart-industry-ai-solutions.md)

### Security

* User-Assigned managed identities now supported in Synapse Pipelines in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--1340445678) [article](../data-factory/credentials.md?context=%2Fazure%2Fsynapse-analytics%2Fcontext%2Fcontext&tabs=data-factory)
* Browse ADLS Gen2 folders in an Azure Synapse Analytics workspace in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1147067155) [article](how-to-access-container-with-access-control-lists.md)

### Data Integration

* Pipeline Fail activity [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1827125525) [article](../data-factory/control-flow-fail-activity.md)
* Mapping Data Flow gets new native connectors [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-717833003) [article](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/mapping-data-flow-gets-new-native-connectors/ba-p/2866754)

### Synapse Link

* Synapse Link for Dataverse [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId-1397891373) [article](/powerapps/maker/data-platform/azure-synapse-link-synapse)
* Custom partitions for Synapse link for Azure Cosmos DB in preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-november-2021-update/ba-p/3020740#toc-hId--409563090) [article](../cosmos-db/custom-partitioning-analytical-store.md)

## October 2021 update

The following updates are new to Azure Synapse Analytics this month.

### General

* Manage your cost with Azure Synapse pre-purchase plans [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#manage-cost) [article](../cost-management-billing/reservations/synapse-analytics-pre-purchase-plan.md)
* Move your Azure Synapse workspace across Azure regions [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#move-workspace-region) [article](how-to-move-workspace-from-one-region-to-another.md)

### Apache Spark for Synapse

* Spark performance optimizations [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#spark-performance) 

### Security

* All Synapse RBAC roles are now generally available for use in production [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#synapse-rbac) [article](./security/synapse-workspace-synapse-rbac-roles.md)
* Leverage User-Assigned Managed Identities for Double Encryption [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#user-assigned-managed-identities) [article](./security/workspaces-encryption.md)
* Synapse Administrators now have elevated access to dedicated SQL pools [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#elevated-access) [article](./security/synapse-workspace-access-control-overview.md)
    
###  Governance

* Synapse workspaces can now automatically push lineage data to Azure Purview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#synapse-purview-lineage) [article](../purview/how-to-lineage-azure-synapse-analytics.md)
 
### Integrate

* Use Stringify in data flows to easily transform complex data types to strings [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#stringify-transform) [article](../data-factory/data-flow-stringify.md)
* Control Spark session time-to-live (TTL) in data flows [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#data-flowspark-ttl) [article](../data-factory/concepts-integration-runtime-performance.md)

### CI/CD & Git

* Deploy Synapse workspaces using GitHub Actions [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#deploy-synapse-github-action) [article](./cicd/continuous-integration-delivery.md#configure-github-actions-secrets)
* More control creating Git branches in Synapse Studio [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#create-git-branch-in-studio) [article](./cicd/source-control.md#creating-feature-branches)

### Developer Experience

* Enhanced Markdown editing in Synapse notebooks preview [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#notebook-markdown-toolbar) [article](./spark/apache-spark-development-using-notebooks.md)
* Pandas dataframes automatically render as nicely formatted HTML tables [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#pandas-dataframe-html) [article](./spark/apache-spark-data-visualization.md)
* Use IPython widgets in Synapse Notebooks [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#notebook-ipythong-widgets) [article](./spark/apache-spark-development-using-notebooks.md)
* Mssparkutils runtime context now available for Python and Scala [blog](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/azure-synapse-analytics-october-update/ba-p/2875372#mssparkutils-context) [article](./spark/microsoft-spark-utilities.md?pivots=programming-language-python)

## Next steps

[Get started with Azure Synapse Analytics](get-started.md)

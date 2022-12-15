---
title: "Apache Spark in Azure Machine Learning (preview)"
titleSuffix: Azure Machine Learning
description: This article explains difference options for accessing Apache Spark in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: conceptual
ms.author: ynpandey
author: ynpandey
ms.reviewer: franksolomon
ms.date: 12/15/2022
ms.custom: cliv2, sdkv2
#Customer intent: As a Full Stack ML Pro, I want to use Apache Spark in Azure Machine Learning.
---

# Apache Spark in Azure Machine Learning (preview)
The Azure Machine Learning integration with Azure Synapse Analytics (preview) provides easy access to distributed computing using Apache Spark framework. You can choose from one of two Apache Spark computing experiences:
1. Managed (Automatic) Spark compute.
2. Attached Synapse Spark pool

## Managed (Automatic) Spark compute
Azure Machine Learning Managed (Automatic) Spark compute is the easiest way to execute distributed computing tasks using Apache Spark framework in Azure Machine Learning environment. A fully managed, serverless, on-demand Apache Spark compute cluster - backed by Azure Synapse - is made available to users in Azure Machine Learning, without the need to create an Azure Synapse Workspace and an Azure Synapse Spark pool. User can define the resources, including

- instance type
- Apache Spark runtime version

to access the Managed (Automatic) Spark compute in Azure Machine Learning Notebooks, for [interactive Spark code development](./interactive-data-wrangling-with-apache-spark-azure-ml.md), [submitting Spark batch jobs](./how-to-submit-spark-jobs.md), and [running machine learning pipelines with a Spark component](./how-to-submit-spark-jobs.md#spark-component-in-a-pipeline-job).

### Some points to consider
Managed (Automatic) Spark compute is a suitable option for most user scenarios that require quick access to distributed computing using Apache Spark. However, to make an informed decision, users should consider the advantages and disadvantages of this approach .

|Advantages|Disadvantages|
|----------|-------------|

|<ul><li>Friction-free Synapse workspace and Spark pool creation</li><li>Friction-free Synapse workspace and Spark pool configuration and attachment</li><li>No permissions required in the subscription to create Synapse-related resources</li><li>No SQL pool quota limitations</li></ul>|<ul><li>Only in-memory Spark SQL support due to missing Hive Metastore<ul><li>No available tables or databases</li><li>Missing Purview integration</li></ul><li>Linked Services not available</li><li>Fewer Data sources/connectors</li><li>Missing pool-level configuration</li><li>Missing pool-level library management</li><li>Partial support for `mssparkutils`</li><li>Missing managed VNET support</li><li>Private endpoint creation to Azure Synapse not available</li><li>Missing configuration knobs around certain features (e.g., intelligent cache)</li></ul>|

### Inactivity periods and tear down mechanism
When a user first launches a Managed (Automatic) Spark compute (**cold start**), it may take three to five minutes to start the Spark session. The automated provisioning of a Managed (Automatic) Spark compute, backed by Azure Synapse, causes this delay. Once the Managed (Automatic) Spark compute is provisioned and an Apache Spark session is started, users will not experience this delay in subsequent code executions. The Spark session configuration allows an option to define a session timeout (in minutes). The Spark session will terminate after an inactivity period exceeding the user-defined timeout. If another Spark session does not start in the next ten minutes, resources provisioned for the Managed (Automatic) Spark compute will be torn down. Once the resources for Managed (Automatic) Spark compute are torn down, submitting the next job will require a *cold start*.

## Attached Synapse Spark pool
Attached Synapse Spark pool makes a Synapse Spark pool created in an Azure Synapse workspace available in the Azure Machine Learning workspace. This option may be suitable for the users who want to reuse an existing Azure Synapse Spark pool. Attaching an Azure Synapse Spark pool to the Azure Machine Learning workspace requires [additional steps](./how-to-manage-synapse-spark-pool.md), before the Azure Synapse Spark pool can be used in the Azure Machine Learning for [interactive Spark code development](./interactive-data-wrangling-with-apache-spark-azure-ml.md), [submitting Spark batch jobs](./how-to-submit-spark-jobs.md), or [running machine learning pipelines with a Spark component](./how-to-submit-spark-jobs.md#spark-component-in-a-pipeline-job). While an attached Synapse Spark pool provides access to native Synapse features, the user is responsible for provisioning, attaching, configuring, and managing the Synapse Spark pool.

The Spark session configuration for an attached Synapse Spark pool also allows an option to define a session timeout (in minutes). The session timeout behavior is similar to description provided in [the previous section](#inactivity-periods-and-tear-down-mechanism), except that the associated resources are never torn down after the session timeout.

## Ensuring resource access for Spark jobs
Spark jobs can use either user identity passthrough, or a managed identity, to access data and other resources. Tje following table summarizes different mechanisms to access resources.

|Spark pool|Supported identities|Default identity|
| ---------- | -------------------- | ---------------- |
|Managed (Automatic) Spark compute|User identity and managed identity|User identity|
|Attached Synapse Spark pool|User identity and managed identity|Managed identity - compute identity of the attached Synapse Spark pool|

Please [click here](./how-to-submit-spark-jobs#ensuring-resource-access-for-spark-jobs.md) for more details about accessing Spark job resources.

> [!NOTE]
> - To ensure successful Spark job execution, assign **Contributor** and **Storage Blob Data Contributor** roles, on the Azure storage account used for data input and output, to the identity used for the Spark job.
> - If an [attached Synapse Spark pool](./how-to-manage-synapse-spark-pool.md) points to a Synapse Spark pool in an Azure Synapse workspace, that has a managed virtual network associated with it, [a managed private endpoint to storage account should be configured](../synapse-analytics/security/connect-to-a-secure-storage-account.md) to ensure data access.

Please follow this [quickstart guide](./quickstart-spark-jobs.md) to start using Managed (Automatic) Spark compute to submit your Spark jobs in Azure Machine Learning.

## Next steps
- [Quickstart: Apache Spark jobs in Azure Machine Learning (preview)](./quickstart-spark-jobs.md)
- [Attach and manage a Synapse Spark pool in Azure Machine Learning (preview)](./how-to-manage-synapse-spark-pool.md)
- [Interactive Data Wrangling with Apache Spark in Azure Machine Learning (preview)](./interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Submit Spark jobs in Azure Machine Learning (preview)](./how-to-submit-spark-jobs.md)
- [Code samples for Spark jobs using Azure Machine Learning CLI](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/spark)
- [Code samples for Spark jobs using Azure Machine Learning Python SDK](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/spark)

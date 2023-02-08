---
title: "Apache Spark in Azure Machine Learning (preview)"
titleSuffix: Azure Machine Learning
description: This article explains difference options for accessing Apache Spark in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: conceptual
ms.author: franksolomon
author: ynpandey
ms.reviewer: franksolomon
ms.date: 01/30/2023
ms.custom: cliv2, sdkv2
#Customer intent: As a Full Stack ML Pro, I want to use Apache Spark in Azure Machine Learning.
---

# Apache Spark in Azure Machine Learning (preview)
The Azure Machine Learning integration with Azure Synapse Analytics (preview) provides easy access to distributed computing, using the Apache Spark framework. This integration offers these Apache Spark computing experiences:
- Managed (Automatic) Spark compute
- Attached Synapse Spark pool

## Managed (Automatic) Spark compute
Azure Machine Learning Managed (Automatic) Spark compute is the easiest way to execute distributed computing tasks in the Azure Machine Learning environment, using the Apache Spark framework. Azure Machine Learning users can use a fully managed, serverless, on-demand Apache Spark compute cluster. Those users can avoid the need to create an Azure Synapse Workspace and an Azure Synapse Spark pool. Users can define the resources, including

- instance type
- Apache Spark runtime version

to access the Managed (Automatic) Spark compute in Azure Machine Learning Notebooks, for

- [interactive Spark code development](./interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Spark batch job submissions](./how-to-submit-spark-jobs.md)
- [running machine learning pipelines with a Spark component](./how-to-submit-spark-jobs.md#spark-component-in-a-pipeline-job)

### Some points to consider
Managed (Automatic) Spark compute works well for most user scenarios that require quick access to distributed computing using Apache Spark. To make an informed decision, however, users should consider the advantages and disadvantages of this approach.

### Advantages
  
- No dependencies on other Azure resources to be created for Apache Spark
- No permissions required in the subscription to create Synapse-related resources
- No need for SQL pool quota

### Disadvantages
 
- Persistent Hive metastore is missing. Therefore, Managed (Automatic) Spark compute only supports in-memory Spark SQL
- No available tables or databases
- Missing Purview integration
- Linked Services not available
- Fewer Data sources/connectors
- Missing pool-level configuration
- Missing pool-level library management
- Partial support for `mssparkutils`

### Network configuration
As of January 2023, the Managed (Automatic) Spark compute doesn't support managed VNet or private endpoint creation to Azure Synapse.

### Inactivity periods and tear down mechanism
A Managed (Automatic) Spark compute (**cold start**) resource might need three to five minutes to start the Spark session, when first launched. The automated Managed (Automatic) Spark compute provisioning, backed by Azure Synapse, causes this delay. Once the Managed (Automatic) Spark compute is provisioned, and an Apache Spark session starts, subsequent code executions (**warm start**) won't experience this delay. The Spark session configuration offers an option that defines a session timeout (in minutes). The Spark session will terminate after an inactivity period that exceeds the user-defined timeout. If another Spark session doesn't start in the following 10 minutes, resources provisioned for the Managed (Automatic) Spark compute will be torn down. Once the Managed (Automatic) Spark compute resource tear-down happens, submission of the next job will require a *cold start*. The next visualization shows some session inactivity period and cluster teardown scenarios.

:::image type="content" source="./media/apache-spark-azure-ml-concepts/spark-session-timeout-teardown.png" lightbox="./media/apache-spark-azure-ml-concepts/spark-session-timeout-teardown.png" alt-text="Expandable screenshot that shows different scenarios for Apache spark session inactivity period and cluster teardown.":::

## Attached Synapse Spark pool
A Synapse Spark pool created in an Azure Synapse workspace becomes available in the Azure Machine Learning workspace with the Attached Synapse Spark pool. This option may be suitable for the users who want to reuse an existing Azure Synapse Spark pool. Attachment of an Azure Synapse Spark pool to the Azure Machine Learning workspace requires [other steps](./how-to-manage-synapse-spark-pool.md), before the Azure Synapse Spark pool can be used in the Azure Machine Learning for

- [interactive Spark code development](./interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Spark batch job submission](./how-to-submit-spark-jobs.md), or 
- [running machine learning pipelines with a Spark component](./how-to-submit-spark-jobs.md#spark-component-in-a-pipeline-job)

While an attached Synapse Spark pool provides access to native Synapse features, the user is responsible for provisioning, attaching, configuring, and managing the Synapse Spark pool.

The Spark session configuration for an attached Synapse Spark pool also offers an option to define a session timeout (in minutes). The session timeout behavior resembles the description seen in [the previous section](#inactivity-periods-and-tear-down-mechanism), except the associated resources are never torn down after the session timeout.

## Defining Spark cluster size
You can define three parameter values

- number of executors
- executor cores
- executor memory

in Azure Machine Learning Spark jobs. You should consider an Azure Machine Learning Apache Spark executor as an equivalent of Azure Spark worker nodes. An example will explain these parameters. Let's say that you have defined number of executors as 6 (equivalent to six worker nodes), executor cores as 4, and executor memory as 28 GB. Your Spark job will then have access to a cluster with 24 cores and 168-GB memory.

## Ensuring resource access for Spark jobs
To access data and other resources, a Spark job can either use either user identity passthrough, or a managed identity. This table summarizes the different mechanisms Spark jobs use to access resources.

|Spark pool|Supported identities|Default identity|
| ---------- | -------------------- | ---------------- |
|Managed (Automatic) Spark compute|User identity and managed identity|User identity|
|Attached Synapse Spark pool|User identity and managed identity|Managed identity - compute identity of the attached Synapse Spark pool|

[This page](./how-to-submit-spark-jobs.md#ensuring-resource-access-for-spark-jobs) describes Spark job resource access. In a Notebooks session, both the Managed (Automatic) Spark compute and the attached Synapse Spark pool use user identity passthrough for data access during [interactive data wrangling](./interactive-data-wrangling-with-apache-spark-azure-ml.md).

> [!NOTE]
> - To ensure successful Spark job execution, assign **Contributor** and **Storage Blob Data Contributor** roles, on the Azure storage account used for data input and output, to the identity used for the Spark job.
> - If an [attached Synapse Spark pool](./how-to-manage-synapse-spark-pool.md) points to a Synapse Spark pool in an Azure Synapse workspace, and that workspace has an associated managed virtual network associated, [configure a managed private endpoint to storage account](../synapse-analytics/security/connect-to-a-secure-storage-account.md), to ensure data access.

This [quickstart guide](./quickstart-spark-jobs.md) describes how to start using Managed (Automatic) Spark compute to submit your Spark jobs in Azure Machine Learning.

## Next steps
- [Quickstart: Apache Spark jobs in Azure Machine Learning (preview)](./quickstart-spark-jobs.md)
- [Attach and manage a Synapse Spark pool in Azure Machine Learning (preview)](./how-to-manage-synapse-spark-pool.md)
- [Interactive Data Wrangling with Apache Spark in Azure Machine Learning (preview)](./interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Submit Spark jobs in Azure Machine Learning (preview)](./how-to-submit-spark-jobs.md)
- [Code samples for Spark jobs using Azure Machine Learning CLI](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/spark)
- [Code samples for Spark jobs using Azure Machine Learning Python SDK](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/spark)

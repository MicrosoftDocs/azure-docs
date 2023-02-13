---
title: "Apache Spark in Azure Machine Learning (preview)"
titleSuffix: Azure Machine Learning
description: This article explains the options for accessing Apache Spark in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: conceptual
ms.author: franksolomon
author: ynpandey
ms.reviewer: franksolomon
ms.date: 01/30/2023
ms.custom: cliv2, sdkv2
#Customer intent: As a full-stack machine learning pro, I want to use Apache Spark in Azure Machine Learning.
---

# Apache Spark in Azure Machine Learning (preview)

Azure Machine Learning integration with Azure Synapse Analytics (preview) provides easy access to distributed computing through the Apache Spark framework. This integration offers these Apache Spark computing experiences:

- Managed (Automatic) Spark compute
- Attached Synapse Spark pool

## Managed (Automatic) Spark compute

Azure Machine Learning Managed (Automatic) Spark compute is the easiest way to accomplish distributed computing tasks in the Azure Machine Learning environment by using the Apache Spark framework. Azure Machine Learning users can use a fully managed, serverless, on-demand Apache Spark compute cluster. Those users can avoid the need to create an Azure Synapse workspace and a Synapse Spark pool.

Users can define resources, including instance type and Apache Spark runtime version. They can then use those resources to access Managed (Automatic) Spark compute in Azure Machine Learning notebooks for:

- [Interactive Spark code development](./interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Spark batch job submissions](./how-to-submit-spark-jobs.md)
- [Running machine learning pipelines with a Spark component](./how-to-submit-spark-jobs.md#spark-component-in-a-pipeline-job)

### Points to consider

Managed (Automatic) Spark compute works well for most user scenarios that require quick access to distributed computing through Apache Spark. But to make an informed decision, users should consider the advantages and disadvantages of this approach.

Advantages:
  
- There are no dependencies on other Azure resources to be created for Apache Spark.
- No permissions are required in the subscription to create Azure Synapse-related resources.
- There's no need for SQL pool quotas.

Disadvantages:

- A persistent Hive metastore is missing. Managed (Automatic) Spark compute supports only in-memory Spark SQL.
- No tables or databases are available.
- Azure Purview integration is missing.
- Linked services aren't available.
- There are fewer data sources and connectors.
- Pool-level configuration is missing.
- Pool-level library management is missing.
- There's only partial support for `mssparkutils`.

### Network configuration

As of January 2023, creating a Managed (Automatic) Spark compute inside a virtual network and creating a private endpoint to Azure Synapse are not supported.

### Inactivity periods and tear-down mechanism

A Managed (Automatic) Spark compute (*cold start*) resource might need three to five minutes to start the Spark session when it's first launched. The automated Managed (Automatic) Spark compute provisioning, backed by Azure Synapse, causes this delay. After the Managed (Automatic) Spark compute is provisioned and an Apache Spark session starts, subsequent code executions (*warm start*) won't experience this delay.

The Spark session configuration offers an option that defines a session timeout (in minutes). The Spark session will end after an inactivity period that exceeds the user-defined timeout. If another Spark session doesn't start in the following 10 minutes, resources provisioned for the Managed (Automatic) Spark compute will be torn down.

After the Managed (Automatic) Spark compute resource tear-down happens, submission of the next job will require a *cold start*. The next visualization shows some session inactivity period and cluster teardown scenarios.

:::image type="content" source="./media/apache-spark-azure-ml-concepts/spark-session-timeout-teardown.png" lightbox="./media/apache-spark-azure-ml-concepts/spark-session-timeout-teardown.png" alt-text="Expandable diagram that shows scenarios for Apache Spark session inactivity period and cluster teardown.":::

## Attached Synapse Spark pool

A Spark pool created in an Azure Synapse workspace becomes available in the Azure Machine Learning workspace with the attached Synapse Spark pool. This option might be suitable for users who want to reuse an existing Synapse Spark pool.

Attachment of a Synapse Spark pool to an Azure Machine Learning workspace requires [other steps](./how-to-manage-synapse-spark-pool.md) before you can use the pool in Azure Machine Learning for:

- [Interactive Spark code development](./interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Spark batch job submission](./how-to-submit-spark-jobs.md)
- [Running machine learning pipelines with a Spark component](./how-to-submit-spark-jobs.md#spark-component-in-a-pipeline-job)

An attached Synapse Spark pool provides access to native Azure Synapse features. The user is responsible for provisioning, attaching, configuring, and managing the Synapse Spark pool.

The Spark session configuration for an attached Synapse Spark pool also offers an option to define a session timeout (in minutes). The session timeout behavior resembles the description in [the previous section](#inactivity-periods-and-tear-down-mechanism), except that the associated resources are never torn down after the session timeout.

## Defining Spark cluster size

You can define Spark cluster size by using three parameter values in Azure Machine Learning Spark jobs:

- Number of executors
- Executor cores
- Executor memory

You should consider an Azure Machine Learning Apache Spark executor as an equivalent of Azure Spark worker nodes. An example can explain these parameters. Let's say that you defined the number of executors as 6 (equivalent to six worker nodes), executor cores as 4, and executor memory as 28 GB. Your Spark job will then have access to a cluster with 24 cores and 168 GB of memory.

## Ensuring resource access for Spark jobs

To access data and other resources, a Spark job can use either a user identity passthrough or a managed identity. This table summarizes the mechanisms that Spark jobs use to access resources.

|Spark pool|Supported identities|Default identity|
| ---------- | -------------------- | ---------------- |
|Managed (Automatic) Spark compute|User identity and managed identity|User identity|
|Attached Synapse Spark pool|User identity and managed identity|Managed identity - compute identity of the attached Synapse Spark pool|

[This article](./how-to-submit-spark-jobs.md#ensuring-resource-access-for-spark-jobs) describes resource access for Spark jobs. In a notebook session, both the Managed (Automatic) Spark compute and the attached Synapse Spark pool use user identity passthrough for data access during [interactive data wrangling](./interactive-data-wrangling-with-apache-spark-azure-ml.md).

> [!NOTE]
> To ensure successful Spark job execution, assign **Contributor** and **Storage Blob Data Contributor** roles (on the Azure storage account that's used for data input and output) to the identity that's used for submitting the Spark job.
>
> If an [attached Synapse Spark pool](./how-to-manage-synapse-spark-pool.md) points to a Synapse Spark pool in an Azure Synapse workspace, and that workspace has an associated managed virtual network, [configure a managed private endpoint to a storage account](../synapse-analytics/security/connect-to-a-secure-storage-account.md). This configuration will help ensure data access.

[This quickstart](./quickstart-spark-jobs.md) describes how to start using Managed (Automatic) Spark compute to submit your Spark jobs in Azure Machine Learning.

## Next steps

- [Attach and manage a Synapse Spark pool in Azure Machine Learning (preview)](./how-to-manage-synapse-spark-pool.md)
- [Interactive data wrangling with Apache Spark in Azure Machine Learning (preview)](./interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Submit Spark jobs in Azure Machine Learning (preview)](./how-to-submit-spark-jobs.md)
- [Code samples for Spark jobs using the Azure Machine Learning CLI](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/spark)
- [Code samples for Spark jobs using the Azure Machine Learning Python SDK](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/spark)

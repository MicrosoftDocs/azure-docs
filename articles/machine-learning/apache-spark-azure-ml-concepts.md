---
title: "Apache Spark in Azure Machine Learning"
titleSuffix: Azure Machine Learning
description: This article explains the options for accessing Apache Spark in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: conceptual
ms.author: yogipandey
author: ynpandey
ms.reviewer: franksolomon
ms.date: 10/05/2023
ms.custom: cliv2, sdkv2, build-2023
#Customer intent: As a full-stack machine learning pro, I want to use Apache Spark in Azure Machine Learning.
---

# Apache Spark in Azure Machine Learning

Azure Machine Learning integration with Azure Synapse Analytics provides easy access to distributed computation resources through the Apache Spark framework. This integration offers these Apache Spark computing experiences:

- Serverless Spark compute
- Attached Synapse Spark pool

## Serverless Spark compute

With the Apache Spark framework, Azure Machine Learning serverless Spark compute is the easiest way to accomplish distributed computing tasks in the Azure Machine Learning environment. Azure Machine Learning offers a fully managed, serverless, on-demand Apache Spark compute cluster. Its users can avoid the need to create an Azure Synapse workspace and a Synapse Spark pool.

Users can define resources, including instance type and the Apache Spark runtime version. They can then use those resources to access serverless Spark compute, in Azure Machine Learning notebooks, for:

- [Interactive Spark code development](./interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Spark batch job submissions](./how-to-submit-spark-jobs.md)
- [Running machine learning pipelines with a Spark component](./how-to-submit-spark-jobs.md#spark-component-in-a-pipeline-job)

### Points to consider

Serverless Spark compute works well for most user scenarios that require quick access to distributed computing resources through Apache Spark. However, to make an informed decision, users should consider the advantages and disadvantages of this approach.

Advantages:
  
- No dependencies on creation of other Azure resources for Apache Spark (Azure Synapse infrastructure operates under the hood).
- No required subscription permissions to create Azure Synapse-related resources.
- No need for SQL pool quotas.

Disadvantages:

- A persistent Hive metastore is missing. Serverless Spark compute supports only in-memory Spark SQL.
- No available tables or databases.
- Missing Azure Purview integration.
- No available linked services.
- Fewer data sources and connectors.
- No pool-level configuration.
- No pool-level library management.
- Only partial support for `mssparkutils`.

### Network configuration

To use network isolation with Azure Machine Learning and serverless Spark compute, use a [managed virtual network](how-to-managed-network.md).

### Inactivity periods and tear-down mechanism

At first launch, a serverless Spark compute (*cold start*) resource might need three to five minutes to start the Spark session itself. The automated serverless Spark compute provisioning, backed by Azure Synapse, causes this delay. After the serverless Spark compute is provisioned, and an Apache Spark session starts, subsequent code executions (*warm start*) won't experience this delay.

The Spark session configuration offers an option that defines a session timeout (in minutes). The Spark session will end after an inactivity period that exceeds the user-defined timeout. If another Spark session doesn't start in the following 10 minutes, resources provisioned for the serverless Spark compute will be torn down.

After the serverless Spark compute resource tear-down happens, submission of the next job will require a *cold start*. The next visualization shows some session inactivity period and cluster teardown scenarios.

:::image type="content" source="./media/apache-spark-azure-ml-concepts/spark-session-timeout-teardown.png" lightbox="./media/apache-spark-azure-ml-concepts/spark-session-timeout-teardown.png" alt-text="Expandable diagram that shows scenarios for Apache Spark session inactivity period and cluster teardown.":::

> [!NOTE]
> For a session-level Conda package:
> - the *Cold start* will need about ten to fifteen minutes.
> - the *Warm start*, using same Conda package, will need about one minute.
> - the *Warm start*, with a different Conda package, will also need about ten to fifteen minutes.
> - If the package that you install is large or needs a long installation time, it might impact the Spark instance startup time.
> - Altering the PySpark, Python, Scala/Java, .NET, or Spark version is not supported.

### Session-level Conda Packages
A Conda dependency YAML file can define many session-level Conda packages in a session configuration. A session will time out if it needs more than 15 minutes to install the Conda packages defined in the YAML file. It becomes important to first check whether a required package is already available in the Azure Synapse base image. To do this, users should follow the link to determine *packages available in the base image for* the Apache Spark version in use:
- [Azure Synapse Runtime for Apache Spark 3.3](../synapse-analytics/spark/apache-spark-33-runtime.md#python-libraries-normal-vms)
- [Azure Synapse Runtime for Apache Spark 3.2](../synapse-analytics/spark/apache-spark-32-runtime.md#python-libraries-normal-vms)

### Improving session cold start time while using session-level Conda packages
You can improve the Spark session *cold start* time by setting the `spark.hadoop.aml.enable_cache` configuration variable to `true`. The session *cold start* with session level Conda packages typically takes 10 to 15 minutes when the session starts for the first time. However, subsequent session *cold starts* take three to five minutes. Define the configuration variable in the **Configure session** user interface, under **Configuration settings**.

:::image type="content" source="./media/apache-spark-azure-ml-concepts/spark-session-enable-cache.png" lightbox="./media/apache-spark-azure-ml-concepts/spark-session-enable-cache.png" alt-text="Expandable diagram that shows the Spark session configuration tag that enables cache.":::

## Attached Synapse Spark pool

A Spark pool created in an Azure Synapse workspace becomes available in the Azure Machine Learning workspace with the attached Synapse Spark pool. This option might be suitable for users who want to reuse an existing Synapse Spark pool.

Attachment of a Synapse Spark pool to an Azure Machine Learning workspace requires [other steps](./how-to-manage-synapse-spark-pool.md) before you can use the pool in Azure Machine Learning for:

- [Interactive Spark code development](./interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Spark batch job submission](./how-to-submit-spark-jobs.md)
- [Running machine learning pipelines with a Spark component](./how-to-submit-spark-jobs.md#spark-component-in-a-pipeline-job)

An attached Synapse Spark pool provides access to native Azure Synapse features. The user is responsible for the Synapse Spark pool provisioning, attaching, configuration, and management.

The Spark session configuration for an attached Synapse Spark pool also offers an option to define a session timeout (in minutes). The session timeout behavior resembles the description in [the previous section](#inactivity-periods-and-tear-down-mechanism), except that the associated resources are never torn down after the session timeout.

## Defining Spark cluster size

In Azure Machine Learning Spark jobs, you can define the Spark cluster size, with three parameter values:

- Number of executors
- Executor cores
- Executor memory

You should consider an Azure Machine Learning Apache Spark executor as equivalent to Azure Spark worker nodes. An example can explain these parameters. Let's say that you defined the number of executors as 6 (equivalent to six worker nodes), the number of executor cores as 4, and executor memory as 28 GB. Your Spark job then has access to a cluster with 24 cores in total, and 168 GB of memory.

## Ensuring resource access for Spark jobs

To access data and other resources, a Spark job can use either a managed identity or a user identity passthrough. This table summarizes the mechanisms that Spark jobs use to access resources.

|Spark pool|Supported identities|Default identity|
| ---------- | -------------------- | ---------------- |
|Serverless Spark compute|User identity and managed identity|User identity|
|Attached Synapse Spark pool|User identity and managed identity|Managed identity - compute identity of the attached Synapse Spark pool|

[This article](./apache-spark-environment-configuration.md#ensuring-resource-access-for-spark-jobs) describes resource access for Spark jobs. In a notebook session, both the serverless Spark compute and the attached Synapse Spark pool use user identity passthrough for data access during [interactive data wrangling](./interactive-data-wrangling-with-apache-spark-azure-ml.md).

> [!NOTE]
> - To ensure successful Spark job execution, assign **Contributor** and **Storage Blob Data Contributor** roles (on the Azure storage account used for data input and output) to the identity that will be used for the Spark job submission.
> - If an [attached Synapse Spark pool](./how-to-manage-synapse-spark-pool.md) points to a Synapse Spark pool in an Azure Synapse workspace, and that workspace has an associated managed virtual network, [configure a managed private endpoint to a storage account](../synapse-analytics/security/connect-to-a-secure-storage-account.md). This configuration will help ensure data access.

## Next steps

- [Attach and manage a Synapse Spark pool in Azure Machine Learning](./how-to-manage-synapse-spark-pool.md)
- [Interactive data wrangling with Apache Spark in Azure Machine Learning](./interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Submit Spark jobs in Azure Machine Learning](./how-to-submit-spark-jobs.md)
- [Code samples for Spark jobs using the Azure Machine Learning CLI](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/spark)
- [Code samples for Spark jobs using the Azure Machine Learning Python SDK](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/spark)
---
title: 'Deep learning (deprecated)'
description: This article provides a conceptual overview of the deep learning and data science capabilities available through Apache Spark on Azure Synapse Analytics.
author: midesa
ms.service: azure-synapse-analytics
ms.topic: conceptual
ms.subservice: machine-learning
ms.date: 07/15/2024
ms.author: midesa
---

# Deep learning (deprecated)

Apache Spark in Azure Synapse Analytics enables machine learning with big data, providing the ability to obtain valuable insight from large amounts of structured, unstructured, and fast-moving data. There are several options when training machine learning models using Azure Spark in Azure Synapse Analytics: Apache Spark MLlib, Azure Machine Learning, and various other open-source libraries.

> [!NOTE]
> The Preview for Azure Synapse GPU-enabled pools has now been deprecated.

> [!CAUTION]
> Deprecation and disablement notification for GPUs on the Azure Synapse Runtime for Apache Spark 3.1 and 3.2
> - The GPU accelerated preview is now deprecated on the [Apache Spark 3.2 (deprecated) runtime](../spark/apache-spark-32-runtime.md). Deprecated runtimes will not have bug and feature fixes. This runtime and the corresponding GPU accelerated preview on Spark 3.2 has been retired and disabled as of July 8, 2024.
> - The GPU accelerated preview is now deprecated on the [Azure Synapse 3.1 (deprecated) runtime](../spark/apache-spark-3-runtime.md). Azure Synapse Runtime for Apache Spark 3.1 has reached its end of support as of January 26, 2023, with official support discontinued effective January 26, 2024, and no further addressing of support tickets, bug fixes, or security updates beyond this date.

## GPU-enabled Apache Spark pools

To simplify the process for creating and managing pools, Azure Synapse takes care of pre-installing low-level libraries and setting up all the complex networking requirements between compute nodes. This integration allows users to get started with GPU- accelerated pools within just a few minutes. 

> [!NOTE]
>  - GPU-accelerated pools can be created in workspaces located in East US, Australia East, and North Europe.
>  - GPU-accelerated pools are only available with the Apache Spark 3.1 (deprecated) and 3.2 runtime (deprecated).
>  - You might need to request a [limit increase](../spark/apache-spark-rapids-gpu.md#quotas-and-resource-constraints-in-azure-synapse-gpu-enabled-pools) in order to create GPU-enabled clusters.

## GPU ML Environment

Azure Synapse Analytics provides built-in support for deep learning infrastructure. The Azure Synapse Analytics runtimes for Apache Spark 3 include support for the most common deep learning libraries like TensorFlow and PyTorch. The Azure Synapse runtime also includes supporting libraries like Petastorm and Horovod which are commonly used for distributed training.

### TensorFlow

TensorFlow is an open source machine learning framework for all developers. It is used for implementing machine learning and deep learning applications.

For more information about TensorFlow, you can visit the [TensorFlow API documentation](https://www.tensorflow.org/api_docs/python/tf).

### PyTorch

PyTorch is an optimized tensor library for deep learning using GPUs and CPUs.

For more information about PyTorch, you can visit the [PyTorch documentation](https://pytorch.org/docs/stable/index.html).

### Horovod

Horovod is a distributed deep learning training framework for TensorFlow, Keras, and PyTorch. Horovod was developed to make distributed deep learning fast and easy to use. With this framework, an existing training script can be scaled up to run on hundreds of GPUs in just a few lines of code. In addition, Horovod can run on top of Apache Spark, making it possible to unify data processing and model training into a single pipeline.

To learn more about how to run distributed training jobs in Azure Synapse Analytics, you can visit the following tutorials:
    - [Tutorial: Distributed training with Horovod and PyTorch](./tutorial-horovod-pytorch.md)
    - [Tutorial: Distributed training with Horovod and TensorFlow](./tutorial-horovod-tensorflow.md)

For more information about Horovod, you can visit the [Horovod documentation](https://horovod.readthedocs.io/en/stable/),

### Petastorm

Petastorm is an open source data access library which enables single-node or distributed training of deep learning models. This library enables training directly from datasets in Apache Parquet format and datasets that have already been loaded as an Apache Spark DataFrame. Petastorm supports popular training frameworks such as TensorFlow and PyTorch.

For more information about Petastorm, you can visit the [Petastorm GitHub page](https://github.com/uber/petastorm) or the [Petastorm API documentation](https://petastorm.readthedocs.io/en/latest/).

## Next steps

This article provides an overview of the various options to train machine learning models within Apache Spark pools in Azure Synapse Analytics. You can learn more about model training by following the tutorial below:

- Run SparkML experiments: [Apache SparkML Tutorial](../spark/apache-spark-machine-learning-mllib-notebook.md)
- Accelerate ETL workloads with RAPIDS: [Apache Spark Rapids](../spark/apache-spark-rapids-gpu.md)

---
title: 'Deep learning'
description: This article provides a conceptual overview of the deep learning and data science capabilities available through Apache Spark on Azure Synapse Analytics.
author: midesa
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: machine-learning
ms.date: 04/19/2022
ms.author: midesa
---

# Deep learning (Preview)

Apache Spark in Azure Synapse Analytics enables machine learning with big data, providing the ability to obtain valuable insight from large amounts of structured, unstructured, and fast-moving data. There are several options when training machine learning models using Azure Spark in Azure Synapse Analytics: Apache Spark MLlib, Azure Machine Learning, and various other open-source libraries.

## GPU-enabled Apache Spark pools

To simplify the process for creating and managing pools, Azure Synapse takes care of pre-installing low-level libraries and setting up all the complex networking requirements between compute nodes. This integration allows users to get started with GPU- accelerated pools within just a few minutes. To learn more about how to create a GPU-accelerated pool, you can visit the quickstart on how to [create a GPU-accelerated pool](../quickstart-create-apache-gpu-pool-portal.md).

> [!NOTE]
>  - GPU-accelerated pools can be created in workspaces located in East US, Australia East, and North Europe.
>  - GPU-accelerated pools are only available with the Apache Spark 3.1 and 3.2 runtime.
>  - You might need to request a [limit increase](../spark/apache-spark-rapids-gpu.md#quotas-and-resource-constraints-in-azure-synapse-gpu-enabled-pools) in order to create GPU-enabled clusters.

## GPU ML Environment

Azure Synapse Analytics provides built-in support for deep learning infrastructure. The Azure Synapse Analytics runtimes for Apache Spark 3 include support for the most common deep learning libraries like TensorFlow and PyTorch. The Azure Synapse runtime also includes supporting libraries like Petastorm and Horovod which are commonly used for distributed training.

### Tensorflow

TensorFlow is an open source machine learning framework for all developers. It is used for implementing machine learning and deep learning applications.

For more information about Tensorflow, you can visit the [Tensorflow API documentation](https://www.tensorflow.org/api_docs/python/tf).

### PyTorch

PyTorch is an optimized tensor library for deep learning using GPUs and CPUs.

For more information about PyTorch, you can visit the [PyTorch documentation](https://pytorch.org/docs/stable/index.html).

### Horovod

Horovod is a distributed deep learning training framework for TensorFlow, Keras, and PyTorch. Horovod was developed to make distributed deep learning fast and easy to use. With this framework, an existing training script can be scaled up to run on hundreds of GPUs in just a few lines of code. In addition, Horovod can run on top of Apache Spark, making it possible to unify data processing and model training into a single pipeline.

To learn more about how to run distributed training jobs in Azure Synapse Analytics, you can visit the following tutorials:
    - [Tutorial: Distributed training with Horovod and PyTorch](./tutorial-horovod-pytorch.md)
    - [Tutorial: Distributed training with Horovod and Tensorflow](./tutorial-horovod-tensorflow.md)

For more information about Horovod, you can visit the [Horovod documentation](https://horovod.readthedocs.io/en/stable/),

### Petastorm

Petastorm is an open source data access library which enables single-node or distributed training of deep learning models. This library enables training directly from datasets in Apache Parquet format and datasets that have already been loaded as an Apache Spark DataFrame. Petastorm supports popular training frameworks such as Tensorflow and PyTorch.

For more information about Petastorm, you can visit the [Petastorm GitHub page](https://github.com/uber/petastorm) or the [Petastorm API documentation](https://petastorm.readthedocs.io/en/latest/).

## Next steps

This article provides an overview of the various options to train machine learning models within Apache Spark pools in Azure Synapse Analytics. You can learn more about model training by following the tutorial below:

- Run SparkML experiments: [Apache SparkML Tutorial](../spark/apache-spark-machine-learning-mllib-notebook.md)
- View libraries within the Apache Spark 3 runtime: [Apache Spark 3 Runtime](../spark/apache-spark-3-runtime.md)
- Accelerate ETL workloads with RAPIDS: [Apache Spark Rapids](../spark/apache-spark-rapids-gpu.md)
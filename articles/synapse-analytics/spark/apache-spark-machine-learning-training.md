---
title: Train machine learning models with Apache Spark
description: Use Apache Spark in Azure Synapse Analytics to train machine learning models
author: midesa
ms.author: midesa
ms.reviewer: euang
services: synapse-analytics 
ms.service:  synapse-analytics 
ms.topic: conceptual
ms.subservice: machine-learning
ms.date: 09/13/2020
---

# Train machine learning models
Apache Spark in Azure Synapse Analytics enables machine learning with big data, providing the ability to obtain valuable insight from large amounts of structured, unstructured, and fast-moving data. There are several options when training machine learning models using Azure Spark in Azure Synapse Analytics: Apache Spark MLlib, Azure Machine Learning, and various other open-source libraries. 

## Apache SparkML and MLlib
Apache Spark in Azure Synapse Analytics is one of Microsoft's implementations of Apache Spark in the cloud. It provides a unified, open-source, parallel data processing framework supporting in-memory processing to boost big data analytics. The Spark processing engine is built for speed, ease of use, and sophisticated analytics. Spark's in-memory distributed computation capabilities make it a good choice for the iterative algorithms used in machine learning and graph computations. 

There are two scalable machine learning libraries that bring algorithmic modeling capabilities to this distributed environment: MLlib and SparkML. MLlib contains the original API built on top of RDDs. SparkML is a newer package that provides a higher-level API built on top of DataFrames for constructing ML pipelines. SparkML doesn't yet support all of the features of MLlib, but is replacing MLlib as Spark's standard machine learning library.

> [!NOTE]
> 
> You can learn more about creating a SparkML model by following this [tutorial](../spark/apache-spark-azure-machine-learning-tutorial.md).

## Popular libraries
Every Apache Spark pool in Azure Synapse Analytics comes with a set of pre-loaded and popular machine learning libraries. These libraries provide reusable code that you may want to include in your programs or projects. Some of the relevant machine learning libraries that are included by default include:
- [Scikit-learn](https://scikit-learn.org/stable/index.html) is one of the most popular single-node machine learning libraries for classical ML algorithms. Scikit-learn supports most of the supervised and unsupervised learning algorithms and can also be used for data-mining and data-analysis.
  
- [XGBoost](https://xgboost.readthedocs.io/en/latest/) is a popular machine learning library that contains optimized algorithms for training decision trees and random forests. 
  
- [PyTorch](https://pytorch.org/) & [Tensorflow](https://www.tensorflow.org/) are powerful Python deep learning libraries. Within an Apache Spark pool in Azure Synapse Analytics, you can use these libraries to build single-machine models by setting the number of executors on your pool to zero. Even though Apache Spark is not functional under this configuration, it is a simple and cost-effective way to create single-machine models.

You can learn more about the available libraries and related versions by viewing the published [Azure Synapse Analytics runtime](../spark/apache-spark-version-support.md).

## MMLSpark
The Microsoft Machine Learning library for Apache Spark is [MMLSpark](https://github.com/Azure/mmlspark). This library is designed to make data scientists more productive on Spark, increase the rate of experimentation, and leverage cutting-edge machine learning techniques, including deep learning, on large datasets. 

MMLSpark provides a layer on top of SparkML's low-level APIs when building scalable ML models, such as indexing strings, coercing data into a layout expected by machine learning algorithms, and assembling feature vectors. The MMLSpark library simplifies these and other common tasks for building models in PySpark.

## Automated ML in Azure Machine Learning 
Azure Machine Learning is a cloud-based environment that allows you to train, deploy, automate, manage, and track machine learning models. Automated ML in Azure Machine Learning accepts training data and configuration settings and automatically iterates through combinations of different feature normalization/standardization methods, models, and hyperparameter settings to arrive at the best model. 

When using automated ML within Azure Synapse Analytics, you can leverage the deep integration between the different services to simplify authentication & model training. 

> [!NOTE]
> 
> You can learn more about creating an Azure Machine Learning automated ML experiment by following this [tutorial](./spark/../apache-spark-azure-machine-learning-tutorial.md).

<a name='azure-cognitive-services'></a>

## Azure AI services
[Azure AI services](../../ai-services/what-are-ai-services.md) provides machine learning capabilities to solve general problems such as analyzing text for emotional sentiment or analyzing images to recognize objects or faces. You don't need special machine learning or data science knowledge to use these services. A Cognitive Service provides part or all of the components in a machine learning solution: data, algorithm, and trained model. These services are meant to require general knowledge about your data without needing experience with machine learning or data science. You can leverage these pre-trained Azure AI services automatically within Azure Synapse Analytics.

## Next steps
This article provides an overview of the various options to train machine learning models within Apache Spark pools in Azure Synapse Analytics. You can learn more about model training by following the tutorial below:

- Run Automated ML experiments using Azure Machine Learning and Azure Synapse Analytics: [Automated ML Tutorial](../spark/apache-spark-azure-machine-learning-tutorial.md) 
- Run SparkML experiments: [Apache SparkML Tutorial](../spark/apache-spark-machine-learning-mllib-notebook.md)
- View the default libraries: [Azure Synapse Analytics runtime](../spark/apache-spark-version-support.md)

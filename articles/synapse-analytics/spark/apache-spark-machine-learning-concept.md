---
title: 'Machine Learning with Apache Spark'
description: This article provides a conceptual overview of the machine learning and data science capabilities available through Apache Spark on Azure Synapse Analytics.
author: midesa
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: machine-learning
ms.date: 11/13/2020
ms.author: midesa
ms.reviewer: sngun
---

# Machine learning with Apache Spark

Apache Spark in Azure Synapse Analytics enables machine learning with big data, providing the ability to obtain valuable insight from large amounts of structured, unstructured, and fast-moving data. 

This section includes an overview and tutorials for machine learning workflows, including exploratory data analysis, feature engineering, model training, model scoring, and deployment.  

## Synapse Runtime 
The Synapse Runtime is a curated environment optimized for data science and machine learning. The Synapse Runtime offers a range of popular open-source libraries and builds in the Azure Machine Learning SDK by default. The Synapse Runtime also includes many external libraries, including PyTorch, Scikit-Learn, XGBoost, and more.

Learn more about the available libraries and related versions by viewing the published [Azure Synapse Analytics runtime](../spark/apache-spark-version-support.md).

## Exploratory data analysis
When using Apache Spark in Azure Synapse Analytics, there are various built-in options to help you visualize your data, including Synapse notebook chart options, access to popular open-source libraries like Seaborn and Matplotlib, as well as integration with Synapse SQL and Power BI.

Learn more about the data visualization and data analysis options by viewing the article on how to [visualize data using Azure Synapse Notebooks](../spark/apache-spark-data-visualization.md).

## Feature engineering
By default, the Synapse Runtime includes a set of libraries that are commonly used for feature engineering. For large datasets, you can use Spark SQL, MLlib, and Koalas for feature engineering. For smaller datasets, third-party libraries like Numpy, Pandas, and Scikit-learn also provide useful methods for these scenarios.

## Train models
There are several options when training machine learning models using Azure Spark in Azure Synapse Analytics: Apache Spark MLlib, Azure Machine Learning, and various other open-source libraries. 

Learn more about the machine learning capabilities by viewing the article on how to [train models in Azure Synapse Analytics](../spark/apache-spark-machine-learning-training.md).

### SparkML and MLlib
Spark's in-memory distributed computation capabilities make it a good choice for the iterative algorithms used in machine learning and graph computations. ```spark.ml``` provides a uniform set of high-level APIs that help users create and tune  machine learning pipelines.To learn more about ```spark.ml```, you can visit the [Apache Spark ML programming guide](https://spark.apache.org/docs/1.2.2/ml-guide.html).

### Azure Machine Learning automated ML
[Azure Machine Learning automated ML](../../machine-learning/concept-automated-ml.md) (automated machine learning) helps automate the process of developing machine learning models. It allows data scientists, analysts, and developers to build ML models with high scale, efficiency, and productivity all while sustaining model quality. The components to run the Azure Machine Learning automated ML SDK is built directly into the Synapse Runtime.

### Open-source libraries
Every Apache Spark pool in Azure Synapse Analytics comes with a set of pre-loaded and popular machine learning libraries.  Some of the relevant machine learning libraries that are included by default include:

- [Scikit-learn](https://scikit-learn.org/stable/index.html) is one of the most popular single-node machine learning libraries for classical ML algorithms. Scikit-learn supports most of the supervised and unsupervised learning algorithms and can also be used for data-mining and data-analysis.
  
- [XGBoost](https://xgboost.readthedocs.io/en/latest/) is a popular machine learning library that contains optimized algorithms for training decision trees and random forests. 
  
- [PyTorch](https://pytorch.org/) & [TensorFlow](https://www.tensorflow.org/) are powerful Python deep learning libraries. Within an Apache Spark pool in Azure Synapse Analytics, you can use these libraries to build single-machine models by setting the number of executors on your pool to zero. Even though Apache Spark is not functional under this configuration, it is a simple and cost-effective way to create single-machine models.

## Track model development
[MLFlow](https://www.mlflow.org/) is an open-source library for managing the life cycle of your machine learning experiments. MLFlow Tracking is a component of MLflow that logs and tracks your training run metrics and model artifacts. To learn more about how you can use MLFlow Tracking through Azure Synapse Analytics and Azure Machine Learning, visit this tutorial on [how to use MLFlow](../../machine-learning/how-to-use-mlflow.md).

## Model scoring
Model scoring, or inferencing, is the phase where a model is used to make predictions. For model scoring with SparkML or MLLib, you can leverage the native Spark  methods to perform inferencing directly on a Spark DataFrame. For other open-source libraries and model types, you can also create a Spark UDF to scale out inference on large datasets. For smaller datasets, you can also use the native model inference methods provided by the library.

## Register and serve models
Registering a model allows you to store, version, and track metadata about models in your workspace. After you have finished training your model, you can register your model to the [Azure Machine Learning model registry](../../machine-learning/concept-model-management-and-deployment.md#register-package-and-deploy-models-from-anywhere). Once registered, ONNX models can also be used to [enrich the data](../machine-learning/tutorial-sql-pool-model-scoring-wizard.md) stored in dedicated SQL pools.

## Next steps
To get started with machine learning in Azure Synapse Analytics, be sure to check out the following tutorials:
- [Analyze data with Azure Synapse Notebooks](../spark/apache-spark-data-visualization-tutorial.md)

- [Train a machine learning model with automated ML](../spark/apache-spark-azure-machine-learning-tutorial.md)

- [Train a machine learning model with Apache Spark MLlib](../spark/apache-spark-machine-learning-mllib-notebook.md)

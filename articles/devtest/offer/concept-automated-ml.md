---
title: What is automated ML? AutoML
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning can automatically generate a model by using the parameters and criteria you provide with automated machine learning.
ms.topic: conceptual
ms.prod: visual-studio-windows
ms.author: jmartens
author: j-martens
ms.date: 09/30/2021
ms.custom: devtestoffer
adobe-target: true
---

# What is automated machine learning (AutoML)?

Automated machine learning, also referred to as automated ML or AutoML, is the process of automating the time-consuming, iterative tasks of machine learning model development. It allows data scientists, analysts, and developers to build ML models with high scale, efficiency, and productivity all while sustaining model quality. Automated ML in Azure Machine Learning is based on a breakthrough from our [Microsoft Research division](https://www.microsoft.com/research/project/automl/).

Traditional machine learning model development is resource-intensive, requiring significant domain knowledge and time to produce and compare dozens of models. With automated machine learning, you'll accelerate the time it takes to get production-ready ML models with great ease and efficiency.

## Ways to use AutoML in Azure Machine Learning

Azure Machine Learning offers the following two experiences for working with automated ML. See the following sections to understand [feature availability in each experience](#parity).

* For code-experienced customers, [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro).  Get started with [Tutorial: Use automated machine learning to predict taxi fares](../machine-learning/tutorial-auto-train-models.md).

* For limited/no-code experience customers, Azure Machine Learning studio at [https://ml.azure.com](https://ml.azure.com/).  Get started with these tutorials:
    * [Tutorial: Create a classification model with automated ML in Azure Machine Learning](../machine-learning/tutorial-first-experiment-automated-ml.md).
    *  [Tutorial: Forecast demand with automated machine learning](tutorial-automated-ml-forecast.md)


## AutoML & ONNX

With Azure Machine Learning, you can use automated ML to build a Python model and have it converted to the ONNX format. Once the models are in the ONNX format, they can be run on a variety of platforms and devices. Learn more about [accelerating ML models with ONNX](concept-onnx.md).

See how to convert to ONNX format [in this Jupyter notebook example](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/classification-bank-marketing-all-features/auto-ml-classification-bank-marketing-all-features.ipynb). Learn which [algorithms are supported in ONNX](how-to-configure-auto-train.md#select-your-experiment-type).

The ONNX runtime also supports C#, so you can use the model built automatically in your C# apps without any need for recoding or any of the network latencies that REST endpoints introduce. Learn more about [using an AutoML ONNX model in a .NET application with ML.NET](./how-to-use-automl-onnx-model-dotnet.md) and [inferencing ONNX models with the ONNX runtime C# API](https://www.onnxruntime.ai/docs/reference/api/csharp-api.html). 

## Next steps

There are multiple resources to get you up and running with AutoML. 

### Tutorials/ how-tos
Tutorials are end-to-end introductory examples of AutoML scenarios.
+ **For a code first experience**, follow the [Tutorial: Train a regression model with AutoML and Python](tutorial-auto-train-models.md).

 + **For a low or no-code experience**, see the [Tutorial: Train a classification model with no-code AutoML in Azure Machine Learning studio](tutorial-first-experiment-automated-ml.md).

How-to articles provide additional detail into what functionality automated ML offers. For example, 

+ Configure the settings for automatic training experiments
    + [Without code in the Azure Machine Learning studio](how-to-use-automated-ml-for-ml-models.md). 
    + [With the Python SDK](how-to-configure-auto-train.md).

+  Learn how to [train forecasting models with time series data](how-to-auto-train-forecast.md).

### Jupyter notebook samples 

Review detailed code examples and use cases in the [GitHub notebook repository for automated machine learning samples](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/).

### Python SDK reference

Deepen your expertise of SDK design patterns and class specifications with the [AutoML class reference documentation](/python/api/azureml-train-automl-client/azureml.train.automl.automlconfig.automlconfig). 

> [!Note]
> Automated machine learning capabilities are also available in other Microsoft solutions such as, 
[ML.NET](/dotnet/machine-learning/automl-overview), 
[HDInsight](../hdinsight/spark/apache-spark-run-machine-learning-automl.md), [Power BI](/power-bi/service-machine-learning-automated) and [SQL Server](https://cloudblogs.microsoft.com/sqlserver/2019/01/09/how-to-automate-machine-learning-on-sql-server-2019-big-data-clusters/)

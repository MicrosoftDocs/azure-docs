---
title: Automated ML algorithm selection & tuning
titleSuffix: Azure Machine Learning service
description: Learn how Azure Machine Learning service can automatically pick an algorithm for you, and generate a model from it to save you time by using the parameters and criteria you provide to select the best algorithm for your model.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: jmartens
author: nacharya1
ms.author: nilesha
ms.date: 12/12/2018
ms.custom: seodec18

---

# What is automated machine learning?

Automated machine learning is the process of taking training data with a defined target feature, and iterating through combinations of algorithms and feature selections to automatically select the best model for your data based on the training scores. The traditional machine learning model development process is highly resource-intensive, and requires significant domain knowledge and time investment to run and compare the results of dozens of models. Automated machine learning simplifies this process by generating models tuned from the goals and constraints you defined for your experiment, such as the time for the experiment to run or which models to blacklist.

## How it works

1. You configure the type of machine learning problem you are trying to solve. Categories of supervised learning are supported:
   + Classification
   + Regression
   + Forecasting

   While automated machine learning is generally available, **the forecasting feature is still in public preview.**

   See the [list of models](how-to-configure-auto-train.md#select-your-experiment-type) Azure Machine Learning can try when training.

1. You specify the source and format for the training data. The data must be labeled, and can be stored on your development environment or in Azure Blob Storage. If the data is stored on your development environment, it must be in the same directory as your training scripts. This directory is copied to the compute target you select for training.

    In your training script, the data can be read into Numpy arrays or a Pandas dataframe.

    You can configure split options for selecting training and validation data, or you can specify separate training and validation data sets.

1. Configure the [compute target](how-to-set-up-training-targets.md) that is used to train the model.

1. Configure the automated machine learning configuration. This controls the parameters used as Azure Machine Learning iterates over different models, hyperparameter settings, and what metrics to look at when determining the best model

1. Submit a training run.

During training, the Azure Machine Learning service creates a number of pipelines that try different algorithms and parameters. It will stop once it hits the iteration limit you provide, or when it reaches the target value for the metric you specify.

[![Automated Machine learning](./media/how-to-automated-ml/automated-machine-learning.png)](./media/how-to-automated-ml/automated-machine-learning.png#lightbox)

You can inspect the logged run information, which contains metrics gathered during the run. The training run also produces a Python serialized object (`.pkl` file) that contains the model and data preprocessing.


## Next steps

See examples and learn how to build models using Automated Machine Learning:

+ [Tutorial: Automatically train a classification model with Azure Automated Machine Learning](tutorial-auto-train-models.md)

+ [Notebook Samples](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/)

+ [Use automatic training on a remote resource](how-to-auto-train-remote.md)

+ [Configure settings for automatic training](how-to-configure-auto-train.md)

---
title: Model training methods
titleSuffix: Azure Machine Learning
description: Learn the different methods you can use to train model with Azure Machine Learning. Estimators provide an easy way to work with popular frameworks like Scikit-learn, TensorFlow, Keras, PyTorch, and Chainer. Machine Learning pipelines make it easy to schedule unattended runs, use heterogenous compute environments, and reuse parts of your workflow. And run configurations provide granular control over the compute targets that the training process runs on.
services: machine-learning
ms.service: machine-learning
author: Blackmist
ms.author: larryfr
ms.subservice: core
ms.topic: conceptual
ms.date: 09/18/2019
---

# Train models with Azure Machine Learning

Azure Machine Learning provides several ways to train your models. Use the following list to determine which training method is right for you:

+ **Visual interface**: The Azure Machine Learning __visual interface__ provides a way to train models using a drag and drop web-based UI. You can use Python code as part of the design, or train models without writing any code.

+ **Python**: The Azure Machine Learning SDK provides several methods to train models:

    + **Run**: A run submits a single instance of a training script as a training job. A run is a generic way to train a model with Azure Machine Learning. Define the training environment and then submit the training script.

    + **Estimator**: Estimator classes build on the basic run process, and make it easy to train models based on popular machine learning frameworks. There are estimator classes for Scikit-learn, PyTorch, TensorFlow, and Chainer. There is also a generic estimator that can be used with frameworks that do not already have a dedicated estimator class.

    + **Automated machine learning**: Automate the time consuming, iterative tasks of model development. Azure Machine Learning uses the parameters you provide to iteratively train models until one meets your criteria.

    + **Machine learning pipeline**: Optimizes your workflow with speed, portability, and reusability. Machine learning pipelines can use runs, estimators, and automated ML as steps in a pipeline. You can create templates and publish a pipeline as a parameterized REST API, which can then be used to start or schedule runs.

Each of these training methods can use different types of compute resources for training. Collectively, these resources are referred to as [__compute targets__](concept-azure-machine-learning-architecture.md#compute-targets). A compute target can be a local machine or a cloud resource, such as an Azure Machine Learning Compute, Azure HDInsight, or a remote virtual machine.

## Visual interface

The visual interface (preview) enables you to train models using a drag and drop interface in your web browser.

+ [What is the visual interface?](ui-concept-visual-interface.md)
+ [Tutorial : Predict automobile price](ui-tutorial-automobile-price-train-score.md)
+ [Regression: Predict price](how-to-ui-sample-regression-predict-automobile-price-basic.md)
+ [Classification: Predict credit risk](how-to-ui-sample-classification-predict-credit-risk-basic.md)
+ [Classification: Predict churn, appetency, and up-selling](how-to-ui-sample-classification-predict-churn.md)

## Run

A run uses a __run configuration__ to define the environment needed to run your training script. Azure Machine Learning uses the run configuration to configure the environment on the compute target when you submit your script for a training run.

You may start with a run configuration for your local computer, and then switch to one for a cloud-based compute target as needed. When changing the compute target, you only change the run configuration you use. A run also logs information about the training job, such as the inputs, outputs, and logs.

* [What is a run configuration?](concept-azure-machine-learning-architecture.md#run-configurations)
* [Tutorial: Train your first ML model](tutorial-1st-experiment-sdk-train.md)
* [Examples: Jupyter Notebook examples of training models](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training)
* [How to: Set up and use compute targets for model training](how-to-set-up-training-targets.md)

## Estimator

Estimators make it easy to train models using popular ML frameworks.

* [What are estimators?](concept-azure-machine-learning-architecture#estimators)
* [Tutorial: Train image classification models with MNIST data and scikit-learn using Azure Machine Learning](tutorial-train-models-with-aml.md)
* [Examples: Jupyter Notebook examples of using estimators](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training-with-deep-learning)
* [How to: Create estimators in training](how-to-train-ml-models.md)

## Automated Machine Learning

Define the iterations, hyperparameter settings, featurization, and other settings. During training, Azure Machine Learning tries different algorithms and parameters in parallel. Training stops once it hits the exit criteria you defined.

> [!TIP]
> You can use Automated ML through the Azure Machine Learning Python SDK or the [workspace landing page (preview)](https://ml.azure.com).

* [What is automated machine learning?](concept-automated-ml.md)
* [Tutorial: Create your first classification model with automated machine learning](tutorial-first-experiment-automated-ml.md)
* [Tutorial: Use automated machine learning to predict taxi fares](tutorial-auto-train-models.md)
* [Examples: Jupyter Notebook examples for automated machine learning](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/automated-machine-learning)
* [How to: Configure automated ML experiments in Python](how-to-configure-auto-train.md)
* [How to: Autotrain a time-series forecast model](how-to-auto-train-forecast.md)
* [How to: Create, explore and deploy automated machine learning experiments with Azure Machine Learning's workspace landing page (preview)](how-to-create-portal-experiments.md)

## Machine learning pipeline

Machine learning pipelines optimize your workflow with the following key features:

| Feature | Description |
| ----- | ----- |
| Unattended runs | Schedule steps to run in parallel or in sequence in a reliable and unattended manner. Perfect for long running tasks such as data preparation or long running training jobs. |
| Heterogenous compute | Use multiple ML pipelines that are reliably coordinated across heterogeneous and scalable compute resources and storage locations. |
| Reusability | Create ML pipeline templates for specific scenarios, such as training or batch scoring. Publish the pipelines as a REST endpoint and trigger via REST calls. |
| Tracking and versioning | ML pipelines can explicitly name and version your data sources, inputs, and outputs. You can also manage scripts and data separately for increased productivity. |
| Collaboration | ML pipelines allow data scientists to collaborate across all areas of the machine learning design process, while being able to concurrently work on pipeline steps. |

> [!TIP]
> Machine learning pipelines can use run configurations, estimators, and automated ML as steps in a pipeline.

* [What are ML pipelines in Azure Machine Learning?](concept-ml-pipelines.md).
* [Tutorial: Use Azure Machine Learning Pipelines for batch scoring](tutorial-pipeline-batch-scoring-classification.md)
* [Examples: Jupyter Notebook examples for machine learning pipelines](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/machine-learning-pipelines)

## Next steps

Learn how to [Set up training environments](how-to-set-up-training-targets.md).